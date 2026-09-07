import React from 'react'
import { CheckCircle2, Tag, XCircle } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { useDragOrTap } from './useDragOrTap'
import { useCompletionReport, useInteractiveState } from './useInteractiveState'

const TRAY_ID = '__tray__'

export default function DragLabelSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  stateScope,
  onInteractionComplete,
}) {
  const { intro, image, imageAlt, labels = [], zones = [], xp = 0 } = data ?? {}

  // placements maps zoneId -> labelId; a label can only sit in one zone.
  const [state, setState, reset] = useInteractiveState(stateScope ?? lessonId, blockId, () => ({
    placements: {},
    checked: false,
  }))

  const filledCount = zones.filter((z) => state.placements[z.id]).length
  const allFilled = zones.length > 0 && filledCount === zones.length
  const allCorrect =
    allFilled && zones.every((z) => state.placements[z.id] === z.labelId)
  const isComplete = state.checked && allCorrect

  useCompletionReport({
    isComplete,
    lessonId,
    blockId,
    blockType: 'dragLabel',
    xp,
    onInteractionComplete,
  })

  const drag = useDragOrTap({
    disabled: isComplete,
    onDrop: (labelId, zoneId) => {
      setState((prev) => {
        const placements = { ...prev.placements }
        // A label lives in exactly one zone, so clear any previous home first.
        for (const [z, l] of Object.entries(placements)) {
          if (l === labelId) delete placements[z]
        }
        if (zoneId !== TRAY_ID) placements[zoneId] = labelId
        return { placements, checked: false }
      })
    },
  })

  if (!image || zones.length === 0 || labels.length === 0) return null

  const placedLabelIds = new Set(Object.values(state.placements))
  const trayLabels = labels.filter((l) => !placedLabelIds.has(l.id))
  const labelText = (labelId) => labels.find((l) => l.id === labelId)?.text ?? ''

  function zoneTone(zone) {
    const filled = state.placements[zone.id]
    if (!state.checked) {
      return filled
        ? 'border-primary-400 bg-white/95 dark:bg-stone-800/95'
        : 'border-dashed border-stone-400 bg-white/70 dark:bg-stone-800/70'
    }
    return filled === zone.labelId
      ? 'border-secondary-500 bg-secondary-50/95 dark:bg-secondary-700/40'
      : 'border-red-400 bg-red-50/95 dark:bg-red-900/40'
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<Tag className="h-5 w-5 text-secondary-500" />}
      headingBg="bg-secondary-50"
      intro={intro}
      instruction={
        drag.selectedId
          ? 'Now tap a labelled box on the image'
          : `Drag each label onto the image, or tap a label then tap a box — ${filledCount} of ${zones.length} placed`
      }
      isComplete={isComplete}
      status={
        isComplete
          ? 'All labels placed correctly.'
          : `${filledCount} of ${zones.length} labels placed.`
      }
      onReset={filledCount > 0 ? reset : null}
    >
      {/* Label tray */}
      <div
        {...drag.getZoneProps(TRAY_ID)}
        className="mb-4 min-h-16 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-3 dark:border-stone-600 dark:bg-stone-800/60"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
          Labels
        </p>
        {trayLabels.length === 0 ? (
          <p className="text-sm font-medium text-stone-400">All labels placed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trayLabels.map((label) => (
              <button
                key={label.id}
                type="button"
                {...drag.getItemProps(label.id)}
                aria-pressed={drag.selectedId === label.id}
                className={`sq-drag-chip min-h-11 rounded-xl border-2 border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-700 transition-all dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 ${
                  drag.selectedId === label.id ? 'ring-4 ring-primary-500/30' : ''
                }`}
              >
                {label.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image with drop zones */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-100 dark:border-stone-700">
        <img src={image} alt={imageAlt || ''} className="block w-full" />

        {zones.map((zone, i) => {
          const filled = state.placements[zone.id]
          const verdict = state.checked ? filled === zone.labelId : null
          return (
            <button
              key={zone.id}
              type="button"
              {...drag.getZoneProps(zone.id)}
              aria-label={
                filled
                  ? `Drop zone ${i + 1}, contains ${labelText(filled)}`
                  : `Empty drop zone ${i + 1}`
              }
              // Percentages keep zones aligned to the image at every width.
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
              }}
              className={`absolute flex items-center justify-center gap-1.5 rounded-lg border-2 px-1 text-xs font-bold text-stone-800 backdrop-blur-sm transition-colors dark:text-white ${zoneTone(zone)}`}
            >
              {verdict === true && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary-600" />}
              {verdict === false && <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />}
              <span className="truncate">{filled ? labelText(filled) : i + 1}</span>
            </button>
          )
        })}
      </div>

      {/* Verdict */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, checked: true }))}
          disabled={!allFilled || isComplete}
          className="min-h-11 rounded-xl bg-primary-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-40"
        >
          Check Answers
        </button>
        {state.checked && !allCorrect && (
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            Some labels are in the wrong place — move them and check again.
          </p>
        )}
        {isComplete && (
          <p className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
            Every label is correct.
          </p>
        )}
      </div>

      {drag.ghost && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-primary-400 bg-white px-3 py-2 text-sm font-bold text-stone-700 shadow-lg dark:bg-stone-700 dark:text-white"
          style={{ left: drag.ghost.x, top: drag.ghost.y }}
        >
          {labelText(drag.ghost.id)}
        </div>
      )}
    </InteractiveFrame>
  )
}
