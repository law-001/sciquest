import React, { useEffect, useState } from "react";
import { Star, Sparkles, Trophy } from "lucide-react";

// XpToast — renders one toast at a time from a notification queue.
//
// Props:
//   notifications  array of { id, kind: 'xp' | 'level-up', amount?, level? }
//   onDismiss(id)  called when the toast auto-dismisses
//
// The parent owns the queue. We auto-dismiss the head after DISMISS_MS;
// the parent then shifts the next item in.
const DISMISS_MS = 3200;

export function XpToast({ notifications = [], onDismiss }) {
  const head = notifications[0];
  // `visible` runs an enter→exit transition without unmounting mid-fade.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!head) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), DISMISS_MS);
    // Give the exit transition (700ms) time to play before unmounting.
    const drop = setTimeout(() => onDismiss?.(head.id), DISMISS_MS + 720);
    return () => {
      clearTimeout(hide);
      clearTimeout(drop);
    };
  }, [head?.id, onDismiss]);

  if (!head) return null;

  const isLevelUp = head.kind === "level-up";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-50 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bottom-6 transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className={`flex items-center gap-3 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-3 max-w-sm border ${
        isLevelUp
          ? "bg-stone-900/95 border-secondary-400/50"
          : "bg-stone-900/95 border-amber-400/40"
      }`}>
        <div className="relative shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-linear-to-br ${
            isLevelUp
              ? "from-secondary-400 to-secondary-600"
              : "from-amber-400 to-orange-500"
          }`}>
            {isLevelUp ? (
              <Trophy className="w-5 h-5 text-white" />
            ) : (
              <Star className="w-5 h-5 text-white fill-white" />
            )}
          </div>
          <span className={`absolute -inset-1 rounded-full border-2 animate-ping ${
            isLevelUp ? "border-secondary-400/60" : "border-amber-400/50"
          }`} />
        </div>
        <div className="min-w-0">
          {isLevelUp ? (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-secondary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Level Up
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                You reached Level {head.level}!
              </p>
              <p className="text-xs text-stone-300 font-medium">
                Keep going — more XP unlocks the next milestone.
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                XP Earned
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                +{head.amount} XP
              </p>
              {head.detail && (
                <p className="text-xs text-stone-300 font-medium">{head.detail}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
