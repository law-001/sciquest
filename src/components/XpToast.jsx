import React, { useEffect, useRef, useState } from "react";
import { Star, Sparkles, Trophy, ClipboardCheck } from "lucide-react";

const DISMISS_MS = 3200;
const EXIT_MS = 720;

function ToastItem({ notification, onDismiss }) {
  const [visible, setVisible] = useState(false);
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
  const isQuizGraded = notification.kind === "quiz-graded";
  const isHidden = isAchievement && notification.hidden;

  const borderClass = isHidden
    ? "border-white/25"
    : isLevelUp
      ? "border-secondary-400/50 dark:border-secondary-400/50"
      : isQuizGraded
        ? "border-secondary-400/50 dark:border-secondary-400/50"
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
      <div
        className={`flex items-center gap-3 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-3 max-w-sm border ${bgClass} ${borderClass}`}
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
                    : "from-amber-400 to-orange-500"
            }`}
          >
            {isLevelUp || isAchievement ? (
              <Trophy className="w-5 h-5 text-white" />
            ) : isQuizGraded ? (
              <ClipboardCheck className="w-5 h-5 text-white" />
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
                {isHidden ? "Hidden Achievement Unlocked" : "Achievement Unlocked"}
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
          {!isLevelUp && !isAchievement && !isQuizGraded && (
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
