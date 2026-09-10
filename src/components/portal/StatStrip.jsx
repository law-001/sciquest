import React from "react";

import { cn } from "../../lib/utils";
import { TICK, TONE_ORDER } from "./tones";

/**
 * In-slot figures. Same idiom as MetricRibbon but without the masthead: one
 * panel, hairline-divided cells, a 3px colour tick in place of the 40px icon
 * chip the old stat cards carried.
 *
 * items: [{ label, value, hint?, tone? }]
 */
export function StatStrip({ items }) {
  return (
    <section className="rounded-3xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 overflow-hidden grid grid-cols-2 md:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "relative px-4 py-3.5 border-orange-100 dark:border-stone-700",
            i % 2 === 1 && "border-l",
            i >= 2 && "border-t",
            "md:border-t-0",
            i > 0 && "md:border-l",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-4 w-[3px] h-4 rounded-r-full",
              TICK[item.tone ?? TONE_ORDER[i % TONE_ORDER.length]],
            )}
          />
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-stone-400 dark:text-stone-500">
            {item.label}
          </p>
          <p className="mt-1 text-[22px] leading-none font-black tabular-nums text-stone-900 dark:text-white">
            {item.value}
          </p>
          {item.hint && (
            <p className="mt-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
