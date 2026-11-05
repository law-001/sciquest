// One look for every dropdown a teacher meets — the portal, the quiz editor,
// Live Quest. Full class strings: Tailwind v4 has no safelist here, so these
// can never be built by interpolation.
//
// Width is deliberately absent. A call site adds its own (`w-full`,
// `flex-1 min-w-0`), because these sit in everything from a tight header row
// to a full-width settings panel.

export const SELECT =
  "min-h-[44px] px-3 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-bold text-stone-900 dark:text-white cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed";
