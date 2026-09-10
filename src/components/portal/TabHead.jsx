import React from "react";

/**
 * Compact page heading for a portal tab. Title and subtitle sit on one block
 * with actions pulled to the right, so a tab spends ~48px on its header
 * instead of the ~86px the old text-3xl heading block took.
 */
export function TabHead({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-heading text-[22px] leading-tight font-black text-stone-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[13px] font-medium text-stone-500 dark:text-stone-400">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  );
}
