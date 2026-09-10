import React from "react";

/**
 * Horizontal stacked bar with a two-column legend. Reads the same as a donut
 * but costs a fraction of the vertical space in a narrow side column.
 *
 * data: [{ label, value, color }]
 */
export function ProportionBar({ data, unit = "" }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  return (
    <div>
      <div
        className="flex h-2.5 w-full rounded-full overflow-hidden bg-stone-100 dark:bg-stone-700"
        role="img"
        aria-label={data
          .map((d) => `${d.label}: ${d.value}${unit ? ` ${unit}` : ""}`)
          .join(", ")}
      >
        {data.map((d) => (
          <span
            key={d.label}
            className="h-full"
            style={{
              width: `${(d.value / total) * 100}%`,
              background: d.color,
            }}
          />
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden="true"
              className="w-1.5 h-4 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <dt className="text-[12px] font-medium text-stone-600 dark:text-stone-400 truncate">
              {d.label}
            </dt>
            <dd className="ml-auto text-[12px] font-black tabular-nums text-stone-900 dark:text-white">
              {d.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
