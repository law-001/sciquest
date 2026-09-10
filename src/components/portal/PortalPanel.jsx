import React from "react";

import { cn } from "../../lib/utils";

/**
 * Flat surface used across both portals. Deliberately thinner-walled than
 * the marketing-side Card: no drop shadow, larger radius, flush headers.
 */
export function PortalPanel({ className, children, ...props }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/** Flush header strip for a PortalPanel: title on the left, tools on the right. */
export function PanelHeader({ title, count, children }) {
  return (
    <div className="flex items-center gap-3 px-5 h-12 border-b border-orange-100 dark:border-stone-700">
      <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
        {title}
      </h2>
      {count != null && (
        <span className="text-[11px] font-bold tabular-nums text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60">
          {count}
        </span>
      )}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
