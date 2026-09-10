import React from "react";

import { cn } from "../../lib/utils";

// Full class strings — Tailwind v4 has no safelist, so these can never be
// built by interpolation.
const TICK = {
  orange: "bg-primary-500",
  teal: "bg-secondary-500",
  yellow: "bg-accent-500",
  blue: "bg-blue-500",
  pink: "bg-pink-500",
  violet: "bg-violet-500",
};

const STRIPE = {
  primary: "bg-primary-500",
  secondary: "bg-secondary-500",
};

/**
 * Masthead + inline metric strip. Replaces the old "page title row plus a
 * grid of four stat squares" pattern with a single band: identity on the
 * left, live figures on the right, hairlines instead of card gutters.
 *
 * metrics: [{ label, value, hint, tone }]
 */
export function MetricRibbon({
  accent = "primary",
  eyebrow,
  title,
  subtitle,
  metrics,
  action,
}) {
  return (
    <section className="relative rounded-3xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 overflow-hidden">
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-[3px]",
          STRIPE[accent] ?? STRIPE.primary,
        )}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Identity block */}
        <div className="lg:w-[288px] xl:w-[320px] shrink-0 px-5 pt-5 pb-4 lg:py-5 border-b lg:border-b-0 lg:border-r border-orange-100 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span
                className={cn(
                  "absolute inline-flex w-full h-full rounded-full opacity-60 motion-safe:animate-ping",
                  TICK.teal,
                )}
              />
              <span
                className={cn(
                  "relative inline-flex w-2 h-2 rounded-full",
                  TICK.teal,
                )}
              />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
              {eyebrow}
            </span>
          </div>

          <h1 className="mt-1.5 font-heading text-[26px] leading-[1.1] font-black text-stone-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400 font-medium">
            {subtitle}
          </p>

          {action && <div className="mt-3">{action}</div>}
        </div>

        {/* Metric strip */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={cn(
                "relative px-5 py-4 lg:py-5 border-orange-100 dark:border-stone-700",
                i % 2 === 1 && "border-l",
                i >= 2 && "border-t",
                "md:border-t-0",
                i > 0 && "md:border-l",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-5 w-[3px] h-5 rounded-r-full",
                  TICK[m.tone] ?? TICK.orange,
                )}
              />
              <p className="text-[10px] font-black uppercase tracking-[0.13em] text-stone-400 dark:text-stone-500">
                {m.label}
              </p>
              <p className="mt-1.5 text-[28px] leading-none font-black tabular-nums text-stone-900 dark:text-white">
                {m.value}
              </p>
              {m.hint && (
                <p className="mt-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">
                  {m.hint}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
