import React from "react";

import { cn } from "../../lib/utils";

// Ranked player list. `highlightId` marks the viewer's own row.
export function LiveLeaderboard({ players, limit, highlightId }) {
  const rows = limit ? players.slice(0, limit) : players;
  if (!rows.length) {
    return (
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
        No players yet.
      </p>
    );
  }
  return (
    <ol className="flex flex-col gap-2">
      {rows.map((player, index) => (
        <li
          key={player.studentId}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 border",
            player.studentId === highlightId
              ? "bg-primary-50 border-primary-300 dark:bg-primary-900/30 dark:border-primary-700"
              : "bg-white border-orange-100 dark:bg-stone-800 dark:border-stone-700",
          )}
        >
          <span className="w-7 text-center font-heading font-black text-stone-500 dark:text-stone-400">
            {index + 1}
          </span>
          <span className="flex-1 min-w-0 truncate font-bold text-stone-800 dark:text-stone-100">
            {player.displayName}
          </span>
          <span className="font-heading font-black tabular-nums text-secondary-700 dark:text-secondary-400">
            {player.score.toLocaleString()}
          </span>
        </li>
      ))}
    </ol>
  );
}
