import React, { useState } from "react";
import { Bell, Star, Trophy, Sparkles, X, ChevronRight, ClipboardCheck } from "lucide-react";

function notifMeta(n) {
  if (n.kind === "level-up") {
    return {
      title: `Level Up — You reached Level ${n.level}!`,
      sub: "Keep going — more XP unlocks the next milestone.",
      icon: <Sparkles className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />,
      iconBg: "bg-secondary-500/10 dark:bg-secondary-400/15",
      navigateTo: "profile",
    };
  }
  if (n.kind === "achievement") {
    return {
      title: n.hidden ? "Hidden Achievement Unlocked" : `Achievement: ${n.label}`,
      sub: n.amount > 0 ? `+${n.amount} XP` : null,
      icon: <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
      iconBg: "bg-amber-500/10 dark:bg-amber-400/15",
      navigateTo: "profile",
    };
  }
  if (n.kind === "quiz-graded") {
    return {
      title: "Quiz Graded",
      sub: n.detail ? `${n.label} — ${n.detail}` : n.label,
      icon: <ClipboardCheck className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />,
      iconBg: "bg-secondary-500/10 dark:bg-secondary-400/15",
      navigateTo: "profile",
    };
  }
  // xp
  return {
    title: `+${n.amount} XP Earned`,
    sub: n.detail ?? null,
    icon: <Star className="w-4 h-4 text-primary-500 fill-primary-500" />,
    iconBg: "bg-primary-500/10 dark:bg-primary-500/15",
    navigateTo: "lessons",
  };
}

export function NotificationBubble({ notifications = [], unseenCount = 0, onNavigate, onOpen, onClearAll, onClearOne }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  const handleClose = () => setOpen(false);

  const handleNotifClick = (n) => {
    const { navigateTo } = notifMeta(n);
    onClearOne?.(n.id);
    setOpen(false);
    onNavigate?.(navigateTo);
  };

  return (
    <>
      {/* Floating bell button */}
      <button
        onClick={open ? handleClose : handleOpen}
        aria-label={`Notifications${unseenCount > 0 ? `, ${unseenCount} unread` : ""}`}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-white border border-stone-200 dark:border-stone-700 shadow-2xl flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95"
      >
        <Bell className="w-6 h-6" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-primary-500 text-white text-[10px] font-black flex items-center justify-center px-1 tabular-nums border-2 border-white dark:border-stone-900">
            {unseenCount > 99 ? "99+" : unseenCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel content */}
          <div className="fixed bottom-24 left-6 z-50 w-80 max-h-[70vh] flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span className="text-sm font-black text-stone-900 dark:text-white font-heading">
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <span className="text-xs font-bold text-stone-400 dark:text-stone-500 tabular-nums">
                    ({notifications.length})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={() => { onClearAll?.(); }}
                    className="text-[10px] font-bold text-stone-400 dark:text-stone-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-1 py-0.5 rounded"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-stone-100 dark:[&::-webkit-scrollbar-track]:bg-stone-800 [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-stone-600 [&::-webkit-scrollbar-thumb]:rounded-full">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-stone-400 dark:text-stone-500">
                  <Bell className="w-8 h-8 opacity-30" />
                  <p className="text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {[...notifications].reverse().map((n) => {
                    const { title, sub, icon, iconBg } = notifMeta(n);
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className="w-full flex items-start gap-3 px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors text-left group"
                      >
                        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-800 dark:text-stone-100 leading-snug">
                            {title}
                          </p>
                          {sub && (
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                              {sub}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0 mt-1 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
