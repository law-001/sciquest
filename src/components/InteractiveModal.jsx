import React, { Activity, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { cn } from "../lib/utils";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// Centered pop-up for the lesson's signature interactive.
//
// The widget mounts on first open and is never unmounted after that, so a
// student's progress survives closing and reopening. While closed it sits in a
// hidden <Activity>: state is kept, but its effects (the animation loops these
// sims run every frame) are paused, so a closed modal costs the lesson
// nothing while the student scrolls.
//
// This doesn't use useModalDismiss because that hook only runs once per
// mount, and this modal stays mounted.
export function InteractiveModal({ isOpen, hasOpened, title, onClose, children }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  // The content stays visible until the fade-out finishes, then pauses.
  const [isFadedOut, setIsFadedOut] = useState(true);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setIsFadedOut(false);
    // With reduced motion there's no fade, so no transitionend to wait for.
    else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setIsFadedOut(true);
  }

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;

    // Lock the lesson behind the modal. The padding stands in for the
    // scrollbar that disappears, so the page doesn't jump sideways.
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    closeButtonRef.current?.focus({ preventScroll: true });

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  function handleTransitionEnd(e) {
    // Transitions inside the widget bubble up here too; only the overlay's
    // own fade counts.
    if (e.target !== e.currentTarget || e.propertyName !== "opacity") return;
    if (!isOpen) setIsFadedOut(true);
  }

  if (!hasOpened) return null;

  return (
    // z-[55]: above the main navbar (z-50) so it dims too, below the XP toast
    // (z-[60]) so finishing the interactive still shows the reward.
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        // p-2 on phones so the modal uses nearly the whole screen; more
        // breathing room from sm (640px) up.
        "fixed inset-0 z-[55] flex items-center justify-center p-2 sm:p-4 lg:p-6",
        "transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
        isOpen ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      {/* No backdrop-blur: blurring the whole page every frame is what makes
          modals feel laggy. A plain dim is free. */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interactive-modal-title"
        className={cn(
          // Width: full on phones, capped at 896px (max-w-4xl) on big screens.
          // Height: never taller than the visible screen (dvh accounts for the
          // phone's browser bars); anything extra scrolls inside.
          "relative flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl sm:max-h-[calc(100dvh-2rem)] lg:max-h-[calc(100dvh-3rem)]",
          "border border-orange-200 bg-[#fdf6e3] shadow-2xl dark:border-stone-700 dark:bg-stone-900",
          "transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none",
          isOpen ? "scale-100" : "scale-95",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-orange-200 py-1 pl-4 pr-2 dark:border-stone-700">
          <p
            id="interactive-modal-title"
            className="min-w-0 truncate text-sm font-black text-stone-500 dark:text-stone-400"
          >
            {title}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close the interactive and go back to the lesson"
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-stone-500 transition-colors hover:bg-orange-100 hover:text-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <X className="h-5 w-5" />
            Close
          </button>
        </div>

        {/* --stage-chrome: how much screen height the modal's header, heading,
            instruction and buttons take. The simulation picture (always
            16:10) is kept at most (screen height − this) tall on desktop, so
            the whole modal fits. Bigger = smaller picture.
            overscroll-contain: reaching the end of the modal's scroll must not
            hand the scroll over to the lesson behind it. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [--stage-chrome:400px] sm:p-5">
          <Activity mode={isOpen || !isFadedOut ? "visible" : "hidden"}>
            {children}
          </Activity>
        </div>
      </div>
    </div>
  );
}
