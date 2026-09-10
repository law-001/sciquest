import React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * A quiet list. One row per item, hairline dividers, and exactly one bold
 * thing per row — the title — so the eye can run down the title column
 * instead of weighing every card in a grid equally.
 *
 * The row body and any trailing control are siblings, never nested buttons,
 * so both stay keyboard reachable and the markup stays valid.
 */
export function RosterList({ children, className }) {
  return (
    <ul
      className={cn(
        "divide-y divide-orange-100 dark:divide-stone-700",
        className,
      )}
    >
      {children}
    </ul>
  );
}

/**
 * index    small tabular lead-in (week number, rank)
 * title    the one bold element
 * meta     array of short strings shown small and grey under the title
 * progress 0-100; renders a thin inline bar beside the meta
 * trailing extra control rendered outside the row button (a state pill, a
 *          delete button) — receives its own focus stop
 * onOpen   makes the row body a button and shows the chevron
 */
export function RosterRow({
  index,
  title,
  meta = [],
  progress,
  progressLabel,
  trailing,
  onOpen,
  openLabel,
  dimmed = false,
  className,
}) {
  const body = (
    <>
      {index != null && (
        <span className="w-7 shrink-0 text-[13px] font-black tabular-nums text-stone-300 dark:text-stone-600">
          {index}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold text-stone-900 dark:text-white truncate">
          {title}
        </span>
        {(meta.length > 0 || progress != null) && (
          <span className="mt-1 flex items-center gap-3 text-[11px] font-medium text-stone-500 dark:text-stone-400">
            {meta.map((m) => (
              <span key={m} className="truncate">
                {m}
              </span>
            ))}
            {progress != null && (
              <span className="flex items-center gap-1.5 shrink-0">
                <span
                  className="hidden sm:block w-16 h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-secondary-500"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  />
                </span>
                <span className="tabular-nums">
                  {progressLabel ?? `${progress}%`}
                </span>
              </span>
            )}
          </span>
        )}
      </span>
    </>
  );

  return (
    <li
      className={cn(
        "relative flex items-center gap-3 pr-3 transition-colors hover:bg-orange-50/60 dark:hover:bg-stone-700/40",
        dimmed && "opacity-55",
        className,
      )}
    >
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={openLabel ?? title}
          className="flex flex-1 min-w-0 items-center gap-3 pl-5 pr-1 py-2.5 min-h-[56px] text-left"
        >
          {body}
        </button>
      ) : (
        <div className="flex flex-1 min-w-0 items-center gap-3 pl-5 pr-1 py-2.5 min-h-[56px]">
          {body}
        </div>
      )}

      {trailing}

      {onOpen && (
        <ChevronRight
          aria-hidden="true"
          className="w-4 h-4 shrink-0 text-stone-300 dark:text-stone-600"
        />
      )}
    </li>
  );
}
