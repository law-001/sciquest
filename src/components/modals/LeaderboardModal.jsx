import React, { useState, useEffect } from "react";
import { X, Crown, TrendingUp, Trophy } from "lucide-react";
import { Avatar } from "../Avatar";
import { fetchLeaderboard } from "../../lib/leaderboard";
import { useAuth } from "../../context/AuthContext";

const PERIODS = [
  { key: "week", label: "Week", empty: "No one in your section has earned XP this week yet." },
  { key: "month", label: "Month", empty: "No one in your section has earned XP this month yet." },
  { key: "all", label: "All", empty: "No one in your section has earned XP yet." },
];

// Same ten slots the profile page shows, so the two views never disagree.
const TOP_N = 10;

function rankBadgeClass(rank) {
  if (rank === 1) return "bg-amber-400 text-stone-900";
  if (rank === 2) return "bg-linear-to-br from-slate-100 to-slate-400 text-slate-800 ring-1 ring-slate-400";
  if (rank === 3) return "bg-linear-to-br from-orange-300 to-orange-800 text-white ring-1 ring-orange-700";
  return "bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300";
}

export function LeaderboardModal({ isOpen, onClose }) {
  const { user, profile } = useAuth();
  const [period, setPeriod] = useState("all");
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !user) return;
    let cancelled = false;
    fetchLeaderboard(period)
      .then((rows) => {
        if (!cancelled) setBoard(rows);
      })
      .catch(() => {
        if (!cancelled) setBoard([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, period, user]);

  if (!isOpen) return null;

  const isStudent = profile?.role === "student";
  const optOut = profile?.leaderboardOptOut ?? false;
  const topBoard = board.slice(0, TOP_N);
  const emptySlots = Array.from(
    { length: TOP_N - topBoard.length },
    (_, i) => topBoard.length + i,
  );
  const selfOutsideTop =
    isStudent &&
    !optOut &&
    topBoard.length === TOP_N &&
    !topBoard.some((e) => e.studentId === user?.id)
      ? (board.find((e) => e.studentId === user?.id) ?? {
          studentId: user?.id,
          name: "You",
          avatar: null,
          avatarStyle: null,
          xp: 0,
        })
      : null;
  const xpToTopTen = selfOutsideTop
    ? Math.max(1, topBoard[TOP_N - 1].xp - selfOutsideTop.xp + 1)
    : 0;

  const renderRow = (entry, xpNeeded = 0) => {
    const isUser = entry.studentId === user?.id;
    const isOutsideTop = xpNeeded > 0;
    return (
      <div
        key={entry.studentId}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
          isUser
            ? "bg-primary-500/10 border border-primary-500/30"
            : "bg-stone-100 dark:bg-stone-800/60"
        }`}
      >
        {isOutsideTop ? (
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary-500/15 text-primary-600 dark:text-primary-300"
            aria-label="Outside the top 10"
          >
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
          </span>
        ) : (
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${rankBadgeClass(entry.rank)}`}
          >
            {entry.rank === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
          </span>
        )}
        <Avatar
          avatarId={isUser ? profile?.avatar : entry.avatar}
          avatarStyle={isUser ? profile?.avatarStyle : entry.avatarStyle}
          name={entry.name}
          size={32}
        />
        <span className="flex-1 min-w-0">
          <span
            className={`block text-sm font-bold truncate ${
              isUser
                ? "text-primary-600 dark:text-primary-300"
                : "text-stone-700 dark:text-stone-200"
            }`}
          >
            {isUser ? "You" : entry.name}
          </span>
          {isOutsideTop && (
            <span className="block text-xs font-semibold text-stone-500 dark:text-stone-400 truncate">
              {xpNeeded.toLocaleString()} XP to reach the top 10
            </span>
          )}
        </span>
        <span className="text-sm font-black text-stone-900 dark:text-white font-heading tabular-nums shrink-0">
          {entry.xp.toLocaleString()} XP
        </span>
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Section leaderboard"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 motion-safe:animate-slide-up"
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-black text-stone-900 dark:text-white font-heading">
            <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
            Section Leaderboard
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    if (p.key === period) return;
                    setLoading(true);
                    setPeriod(p.key);
                  }}
                  aria-pressed={period === p.key}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                    period === p.key
                      ? "bg-primary-500 text-white"
                      : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              aria-label="Close leaderboard"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2 overflow-y-auto themed-scrollbar">
          {!user ? (
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium py-8 text-center">
              Log in to see how your section is doing.
            </p>
          ) : loading ? (
            <div role="status" aria-label="Loading leaderboard">
              <div className="space-y-2 motion-safe:animate-pulse">
                {Array.from({ length: TOP_N }, (_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800/60"
                  >
                    <span className="w-8 h-8 rounded-full shrink-0 bg-stone-200 dark:bg-stone-700" />
                    <span className="w-8 h-8 rounded-full shrink-0 bg-stone-200 dark:bg-stone-700" />
                    <span className="flex-1 h-3 rounded-full bg-stone-200 dark:bg-stone-700" />
                    <span className="w-12 h-3 rounded-full shrink-0 bg-stone-200 dark:bg-stone-700" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {topBoard.length === 0 && (
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium pb-2 text-center">
                  {PERIODS.find((p) => p.key === period).empty} Be the first!
                </p>
              )}
              {topBoard.map((entry) => renderRow(entry))}
              {emptySlots.map((slot) => (
                <div
                  key={`empty-${slot}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700"
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      slot < 3
                        ? rankBadgeClass(slot + 1)
                        : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    {slot === 0 ? <Crown className="w-4 h-4" /> : slot + 1}
                  </span>
                  <span className="text-sm font-medium text-stone-400 dark:text-stone-500">
                    Open spot
                  </span>
                </div>
              ))}
              {selfOutsideTop && (
                <>
                  <p
                    aria-hidden="true"
                    className="text-center text-stone-300 dark:text-stone-700 text-xs leading-none"
                  >
                    ···
                  </p>
                  {renderRow(selfOutsideTop, xpToTopTen)}
                </>
              )}
              {optOut && (
                <p className="pt-2 text-center text-xs font-semibold text-stone-500 dark:text-stone-400">
                  You are hidden from this leaderboard. Turn it back on in Edit
                  Profile.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
