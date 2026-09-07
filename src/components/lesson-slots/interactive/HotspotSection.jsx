import React, { useEffect } from 'react'
import { CheckCircle2, MapPin, X } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { useCompletionReport, useInteractiveState } from './useInteractiveState'

export default function HotspotSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  stateScope,
  onInteractionComplete,
}) {
  const { intro, image, imageAlt, points = [], xp = 0 } = data ?? {}

  const [state, setState, reset] = useInteractiveState(stateScope ?? lessonId, blockId, () => ({
    opened: [],
    activeId: null,
  }))

  const opened = new Set(state.opened)
  const isComplete = points.length > 0 && points.every((p) => opened.has(p.id))
  const active = points.find((p) => p.id === state.activeId) ?? null

  useCompletionReport({
    isComplete,
    lessonId,
    blockId,
    blockType: 'hotspot',
    xp,
    onInteractionComplete,
  })

  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') setState((prev) => ({ ...prev, activeId: null }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // setState is stable enough for this: it only closes the popover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!image || points.length === 0) return null

  function openPoint(pointId) {
    setState((prev) => ({
      opened: prev.opened.includes(pointId) ? prev.opened : [...prev.opened, pointId],
      activeId: prev.activeId === pointId ? null : pointId,
    }))
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<MapPin className="h-5 w-5 text-accent-600" />}
      headingBg="bg-accent-50"
      intro={intro}
      instruction={`Tap each marker to learn more — ${opened.size} of ${points.length} explored`}
      isComplete={isComplete}
      status={
        isComplete
          ? 'All markers explored.'
          : `${opened.size} of ${points.length} markers explored.`
      }
      onReset={state.opened.length > 0 ? reset : null}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-100 dark:border-stone-700">
        <img src={image} alt={imageAlt || ''} className="block w-full" />

        {points.map((point, i) => {
          const isOpen = state.activeId === point.id
          const seen = opened.has(point.id)
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => openPoint(point.id)}
              aria-expanded={isOpen}
              aria-label={`Marker ${i + 1}: ${point.title}`}
              // Percentages, so markers track the image at every breakpoint.
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-black shadow-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/40 ${
                seen
                  ? 'border-white bg-secondary-500 text-white'
                  : 'border-white bg-accent-600 text-white'
              }`}
            >
              {seen ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
            </button>
          )
        })}
      </div>

      {active && (
        <div className="mt-4 rounded-xl border-2 border-accent-200 bg-accent-50 p-4 dark:border-accent-700/40 dark:bg-accent-700/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-black text-stone-900 dark:text-white">
                {active.title}
              </p>
              {active.body && (
                <p className="mt-1 text-sm font-medium text-stone-700 dark:text-stone-200">
                  {active.body}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, activeId: null }))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white/60 dark:hover:bg-stone-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </InteractiveFrame>
  )
}
