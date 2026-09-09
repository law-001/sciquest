import React from 'react'

// Shell every signature simulation uses: the picture on the left, the controls
// and readouts on the right, so a student never has to scroll away from the
// thing they are steering to reach the control that steers it.
//
// On `lg` and up the grid is given one explicit height, which both columns then
// fill — that is what keeps the picture and the control panel the same height
// instead of each ending wherever its own content happens to run out. The
// picture letterboxes inside its share; the panel scrolls inside its own.
//
// Below `lg` it stacks — picture first, then controls — which is the only
// arrangement that works on a phone, and the fixed height is dropped so nothing
// is squeezed.
export default function SimLayout({ stage, panel }) {
  return (
    <div className="grid gap-4 lg:h-[62vh] lg:grid-cols-[minmax(0,1fr)_clamp(260px,30%,340px)]">
      <div className="min-h-0 min-w-0">{stage}</div>
      <div className="flex min-h-0 min-w-0 flex-col rounded-2xl border-2 border-stone-200 bg-orange-50/40 p-3 dark:border-stone-600 dark:bg-stone-800/60">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto lg:pr-1">{panel}</div>
      </div>
    </div>
  )
}

// The bordered frame a stage picture sits in. It fills the row height it is
// given, and centres the picture in whatever space that leaves.
export function Stage({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-stone-200 bg-gradient-to-b from-white to-orange-50/50 p-2 dark:border-stone-600 dark:from-stone-800 dark:to-stone-900">
      {children}
    </div>
  )
}
