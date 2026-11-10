import React from 'react'

// Shell every signature simulation uses: the picture on the left, the controls
// and readouts on the right, so a student never has to scroll away from the
// thing they are steering to reach the control that steers it.
//
// The picture sets the row height, not the screen. Every scene is drawn at
// about 16:10 and fills its Stage edge to edge by cropping (see stageFill), so
// a Stage of any other shape cuts the scene off. Giving the row a height from
// the viewport did exactly that whenever the window changed size. Now the Stage
// is always 16:10 and the row is as tall as it.
//
// On `lg` and up the control panel sits beside the picture. `contain: size`
// stops the panel's content from making the row taller than the picture; the
// panel stretches to the picture's height and scrolls inside instead.
//
// Below `lg` it stacks, picture first and then controls, which is the only
// arrangement that works on a phone, and the panel just grows to its content.
export default function SimLayout({ stage, panel }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_clamp(260px,30%,340px)]">
      <div className="min-w-0">{stage}</div>
      <div className="flex min-h-0 min-w-0 flex-col rounded-2xl border-2 border-stone-200 bg-orange-50/40 p-3 lg:[contain:size] dark:border-stone-600 dark:bg-stone-800/60">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto lg:pr-1">{panel}</div>
      </div>
    </div>
  )
}

// The bordered frame a stage picture sits in: always 16:10, the shape every
// scene is drawn at, so the scene shows whole at any width.
//
// On a short desktop screen the width is capped so the height fits: the frame
// is at most (screen height − --stage-chrome) tall, where --stage-chrome is the
// room the surrounding modal needs for its header, heading and buttons, and
// never narrower than 240px. It centres in its column when the cap kicks in.
// Phones stack and scroll instead, so they get the full width.
// `bleed` is for a scene that fills the frame edge to edge (see stageFill):
// the padding would otherwise show a ring of gradient around the artwork.
export function Stage({ bleed = false, children }) {
  return (
    <div
      className={`mx-auto flex aspect-[16/10] w-full lg:max-w-[max(240px,calc((100dvh-var(--stage-chrome,400px))*1.6))] items-center justify-center overflow-hidden rounded-2xl border-2 border-stone-200 bg-gradient-to-b from-white to-orange-50/50 dark:border-stone-600 dark:from-stone-800 dark:to-stone-900 ${
        bleed ? '' : 'p-2'
      }`}
    >
      {children}
    </div>
  )
}
