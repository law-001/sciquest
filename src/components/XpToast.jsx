import { AchievementMedal } from "./AchievementMedal";
import React, { useEffect, useRef, useState } from "react";
import { Star, Sparkles, Trophy, ClipboardCheck, Gamepad2, ChevronRight } from "lucide-react";

const DISMISS_MS = 3200;
// Game-unlock toasts stay longer so the student can actually read + click them.
const GAME_UNLOCK_DISMISS_MS = 7000;
const EXIT_MS = 720;

function ToastItem({ notification, onDismiss, onNavigate }) {
  const [visible, setVisible] = useState(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const isGameUnlocked = notification.kind === "game-unlocked";
  const dismissMs = isGameUnlocked ? GAME_UNLOCK_DISMISS_MS : DISMISS_MS;

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), dismissMs);
    const drop = setTimeout(
      () => onDismissRef.current?.(notification.id),
      dismissMs + EXIT_MS,
    );
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(hide);
      clearTimeout(drop);
    };
  }, [notification.id, dismissMs]);

  const isLevelUp = notification.kind === "level-up";
  const isAchievement = notification.kind === "achievement";
  const isQuizGraded = notification.kind === "quiz-graded";
  const isHidden = isAchievement && notification.hidden;

  const handleClick = () => {
    if (!isGameUnlocked) return;
    onDismissRef.current?.(notification.id);
    onNavigate?.("games");
  };

  const borderClass = isHidden
    ? "border-white/25"
    : isLevelUp
      ? "border-secondary-400/50 dark:border-secondary-400/50"
      : isQuizGraded
        ? "border-secondary-400/50 dark:border-secondary-400/50"
        : isGameUnlocked
          ? "border-primary-400/60 dark:border-primary-400/50"
          : "border-amber-400/50 dark:border-amber-400/40";

  const bgClass = isHidden
    ? "bg-black"
    : "bg-white dark:bg-stone-900/95";

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ShellTag
        isButton={isGameUnlocked}
        onClick={isGameUnlocked ? handleClick : undefined}
        ariaLabel={
          isGameUnlocked
            ? `Open the Games hub — ${notification.gameTitle ?? "new game"} unlocked`
            : undefined
        }
        className={`flex items-center gap-3 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-3 max-w-sm border ${bgClass} ${borderClass} ${
          isGameUnlocked
            ? "text-left w-full cursor-pointer hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 transition-[filter,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            : ""
        }`}
      >
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center bg-linear-to-br ${
              isHidden
                ? "from-stone-800 to-black ring-1 ring-white/20"
                : isLevelUp
                  ? "from-secondary-400 to-secondary-600"
                  : isQuizGraded
                    ? "from-secondary-400 to-secondary-600"
                    : isGameUnlocked
                      ? "from-primary-400 to-primary-600"
                      : "from-amber-400 to-orange-500"
            }`}
          >
            {isAchievement && notification.achievementKey ? (
              <AchievementMedal achievementKey={notification.achievementKey} className="w-12 h-12" />
            ) : isLevelUp || isAchievement ? (
              <Trophy className="w-5 h-5 text-white" />
            ) : isQuizGraded ? (
              <ClipboardCheck className="w-5 h-5 text-white" />
            ) : isGameUnlocked ? (
              <Gamepad2 className="w-5 h-5 text-white" />
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
                  : isQuizGraded
                    ? "border-secondary-400/60"
                    : isGameUnlocked
                      ? "border-primary-400/60"
                      : "border-amber-400/50"
            }`}
          />
        </div>

        <div className="min-w-0">
          {isLevelUp && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary-500 dark:text-secondary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Level Up
              </p>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                You reached Level {notification.level}!
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-300 font-medium">
                Keep going — more XP unlocks the next milestone.
              </p>
            </>
          )}
          {isAchievement && (
            <>
              <p
                className={`text-[10px] font-bold tracking-widest uppercase ${
                  isHidden ? "text-white" : "text-amber-500 dark:text-amber-400"
                }`}
              >
                {isHidden ? "Hidden Achievement Unlocked" : notification.upgraded ? "Achievement Evolved" : "Achievement Unlocked"}
              </p>
              <p className={`text-sm font-bold leading-tight ${isHidden ? "text-white" : "text-stone-900 dark:text-white"}`}>
                {notification.label}
              </p>
              {notification.amount > 0 && (
                <p
                  className={`text-xs font-bold ${
                    isHidden ? "text-stone-300" : "text-amber-500 dark:text-amber-300"
                  }`}
                >
                  +{notification.amount} XP
                </p>
              )}
            </>
          )}
          {isQuizGraded && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary-500 dark:text-secondary-300">
                Quiz Graded
              </p>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                {notification.label}
              </p>
              {notification.detail && (
                <p className="text-xs text-secondary-500 dark:text-secondary-300 font-medium">
                  {notification.detail}
                </p>
              )}
            </>
          )}
          {isGameUnlocked && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary-500 dark:text-primary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Game Unlocked
              </p>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                {notification.gameTitle ?? "New game"}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-300 font-medium">
                Tap to play →
              </p>
            </>
          )}
          {!isLevelUp && !isAchievement && !isQuizGraded && !isGameUnlocked && (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500 dark:text-amber-400">
                XP Earned
              </p>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                +{notification.amount} XP
              </p>
              {notification.detail && (
                <p className="text-xs text-stone-500 dark:text-stone-300 font-medium">
                  {notification.detail}
                </p>
              )}
            </>
          )}
        </div>
        {isGameUnlocked && (
          <ChevronRight className="w-4 h-4 text-primary-500 dark:text-primary-300 shrink-0" />
        )}
      </ShellTag>
    </div>
  );
}

// Toasts are visual-only by default; game-unlock toasts become real buttons so
// a click opens the Games hub. Everything else stays a plain <div>.
function ShellTag({ isButton, onClick, ariaLabel, className, children }) {
  if (isButton) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={className}>
        {children}
      </button>
    );
  }
  return <div className={className}>{children}</div>;
}

export function XpToast({ notifications = [], onDismiss, onNavigate }) {
  if (notifications.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bottom-6 flex flex-col gap-3 items-center sm:items-end"
    >
      {notifications.map((n) => (
        <ToastItem
          key={n.id}
          notification={n}
          onDismiss={onDismiss}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
