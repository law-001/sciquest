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
        "rounded-2xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 overflow-hidden",
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
      <h2 className="text-[14px] font-black text-stone-800 dark:text-stone-100">
        {title}
      </h2>
      {count != null && (
        <span className="text-[12px] tabular-nums text-stone-500 dark:text-stone-400">
          {count}
        </span>
      )}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
