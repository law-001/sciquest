import React from "react";

import { cn } from "../../lib/utils";

// Full class strings — Tailwind v4 has no safelist, so a tone can never be
// built by interpolation.
const FILL = {
  teal: "bg-secondary-500",
  orange: "bg-primary-500",
  yellow: "bg-accent-500",
  red: "bg-red-400",
  blue: "bg-blue-500",
  stone: "bg-stone-300 dark:bg-stone-600",
};

/**
 * Independent horizontal bars, one per row — for comparing things against each
 * other (sections, quizzes) rather than showing parts of a whole, which is what
 * ProportionBar is for.
 *
 * items: [{ label, value, sub, tone }]  value is 0-100
 */
export function BarList({ items, emptyLabel = "Nothing to show yet." }) {
  if (items.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-[12px] text-stone-500 dark:text-stone-400">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="px-5 py-4 space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline gap-3">
            <span className="min-w-0 flex-1 text-[13px] font-bold text-stone-800 dark:text-stone-100 truncate">
              {item.label}
            </span>
            {item.sub && (
              <span className="shrink-0 text-[11px] font-medium text-stone-400 dark:text-stone-500">
                {item.sub}
              </span>
            )}
            <span className="shrink-0 w-10 text-right text-[13px] font-black tabular-nums text-stone-900 dark:text-white">
              {item.value}%
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden"
            role="img"
            aria-label={`${item.label}: ${item.value} percent`}
          >
            <div
              className={cn(
                "h-full rounded-full",
                FILL[item.tone] ?? FILL.teal,
              )}
              style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
