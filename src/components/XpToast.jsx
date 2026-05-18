import React, { useEffect, useRef, useState } from "react";
import { Star, Sparkles, Trophy } from "lucide-react";

// XpToast — renders the notification queue as a bottom-right stack.
//
// Props:
//   notifications  array of { id, kind: 'xp' | 'level-up' | 'achievement',
//                              amount?, level?, label? }
//   onDismiss(id)  called when a toast auto-dismisses
//
// The parent owns the queue and appends new items to the end. The
// stack is anchored at the bottom, so the newest toast sits lowest and
// earlier ones are pushed upward as more arrive. Each toast runs its
// own enter→exit transition and auto-dismisses independently.
const DISMISS_MS = 3200;
// Exit transition is 700ms; unmount a hair after so it plays out.
const EXIT_MS = 720;

function ToastItem({ notification, onDismiss }) {
  // `visible` runs an enter→exit transition without unmounting mid-fade.
  const [visible, setVisible] = useState(false);
  // Hold the latest onDismiss without it being an effect dep — the
  // parent recreates it each render and we must not reset the timers.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), DISMISS_MS);
    const drop = setTimeout(
      () => onDismissRef.current?.(notification.id),
      DISMISS_MS + EXIT_MS,
    );
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(hide);
      clearTimeout(drop);
    };
  }, [notification.id]);

  const isLevelUp = notification.kind === "level-up";
  const isAchievement = notification.kind === "achievement";
  // The hidden "BLACKED" achievement gets its own all-black skin.
  const isHidden = isAchievement && notification.hidden;

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center gap-3 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-3 max-w-sm border ${
          isHidden
            ? "bg-black border-white/25"
            : isLevelUp
              ? "bg-stone-900/95 border-secondary-400/50"
              : "bg-stone-900/95 border-amber-400/40"
        }`}
      >
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center bg-linear-to-br ${
              isHidden
                ? "from-stone-800 to-black ring-1 ring-white/20"
                : isLevelUp
                  ? "from-secondary-400 to-secondary-600"
                  : "from-amber-400 to-orange-500"
            }`}
          >
            {isLevelUp || isAchievement ? (
              <Trophy className="w-5 h-5 text-white" />
            ) : (
              <Star className="w-5 h-5 text-white fill-white" />
            )}
          </div>
          <span
            className={`absolute -inset-1 rounded-full border-2 animate-ping ${
              isHidden
                ? "border-white/30"
                : isLevelUp
                  ? "border-secondary-400/60"
                  : "border-amber-400/50"
            }`}
          />
        </div>
        <div className="min-w-0">
          {isLevelUp && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Level Up
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                You reached Level {notification.level}!
              </p>
              <p className="text-xs text-stone-300 font-medium">
                Keep going — more XP unlocks the next milestone.
              </p>
            </>
          )}
          {isAchievement && (
            <>
              <p
                className={`text-[10px] font-bold tracking-widest uppercase ${
                  isHidden ? "text-white" : "text-amber-400"
                }`}
              >
                {isHidden ? "Hidden Achievement Unlocked" : "Achievement Unlocked"}
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                {notification.label}
              </p>
              {notification.amount > 0 && (
                <p
                  className={`text-xs font-bold ${
                    isHidden ? "text-stone-300" : "text-amber-300"
                  }`}
                >
                  +{notification.amount} XP
                </p>
              )}
            </>
          )}
          {!isLevelUp && !isAchievement && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                XP Earned
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                +{notification.amount} XP
              </p>
              {notification.detail && (
                <p className="text-xs text-stone-300 font-medium">
                  {notification.detail}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function XpToast({ notifications = [], onDismiss }) {
  if (notifications.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bottom-6 flex flex-col gap-3 items-center sm:items-end"
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
