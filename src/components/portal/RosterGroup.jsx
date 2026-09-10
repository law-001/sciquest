import React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * A collapsible section of a roster. The header is a real button carrying the
 * group's own summary, so a collapsed quarter still tells you how much is in
 * it and how far the class has got.
 */
export function RosterGroup({
  label,
  rangeLabel,
  count,
  countNoun = "weeks",
  progress,
  open,
  onToggle,
  children,
}) {
  return (
    <section className="border-b border-orange-100 dark:border-stone-700 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="w-full flex items-center gap-3 px-5 py-3 min-h-[52px] text-left transition-colors hover:bg-orange-50/60 dark:hover:bg-stone-700/40"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "w-4 h-4 shrink-0 text-stone-400 dark:text-stone-500 transition-transform duration-200",
              !open && "-rotate-90",
            )}
          />
          <span className="text-[14px] font-black text-stone-900 dark:text-white">
            {label}
          </span>
          <span className="text-[11px] font-medium tabular-nums text-stone-400 dark:text-stone-500">
            {rangeLabel}
          </span>

          <span className="ml-auto flex items-center gap-3 shrink-0">
            {progress != null && (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                <span
                  className="w-16 h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-secondary-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, progress))}%`,
                    }}
                  />
                </span>
                <span className="tabular-nums">{progress}%</span>
              </span>
            )}
            <span className="text-[11px] font-bold tabular-nums text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60">
              {count} {countNoun}
            </span>
          </span>
        </button>
      </h3>

      {open && children}
    </section>
  );
}
