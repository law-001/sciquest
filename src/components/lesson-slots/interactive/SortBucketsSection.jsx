import React from 'react'
import { CheckCircle2, FolderTree, XCircle } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { useDragOrTap } from './useDragOrTap'
import { useCompletionReport, useInteractiveState } from './useInteractiveState'

// Complete class strings only — Tailwind v4 with no safelist can't see
// interpolated names.
const BUCKET_STYLES = {
  primary: 'border-primary-300 bg-primary-50 dark:border-primary-600/50 dark:bg-primary-700/20',
  secondary: 'border-secondary-300 bg-secondary-50 dark:border-secondary-600/50 dark:bg-secondary-700/20',
  accent: 'border-accent-300 bg-accent-50 dark:border-accent-600/50 dark:bg-accent-700/20',
}

const bucketStyle = (color) => BUCKET_STYLES[color] ?? BUCKET_STYLES.primary

const TRAY_ID = '__tray__'

export default function SortBucketsSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  stateScope,
  onInteractionComplete,
}) {
  const { intro, buckets = [], items = [], xp = 0 } = data ?? {}

  const [state, setState, reset] = useInteractiveState(stateScope ?? lessonId, blockId, () => ({
    placements: {},
    checked: false,
  }))

  const placedCount = items.filter((it) => state.placements[it.id]).length
  const allPlaced = items.length > 0 && placedCount === items.length
  const allCorrect =
    allPlaced && items.every((it) => state.placements[it.id] === it.bucketId)
  const isComplete = state.checked && allCorrect

  useCompletionReport({
    isComplete,
    lessonId,
    blockId,
    blockType: 'sortBuckets',
    xp,
    onInteractionComplete,
  })

  const drag = useDragOrTap({
    disabled: isComplete,
    onDrop: (itemId, zoneId) => {
      setState((prev) => {
        const placements = { ...prev.placements }
        if (zoneId === TRAY_ID) delete placements[itemId]
        else placements[itemId] = zoneId
        // Any move invalidates the previous verdict, so marks can't go stale.
        return { placements, checked: false }
      })
    },
  })

  if (buckets.length === 0 || items.length === 0) return null

  const trayItems = items.filter((it) => !state.placements[it.id])

  function itemTone(item) {
    if (!state.checked) return 'border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-700'
    return state.placements[item.id] === item.bucketId
      ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-500 dark:bg-secondary-700/25'
      : 'border-red-300 bg-red-50 dark:border-red-500/60 dark:bg-red-900/25'
  }

  function renderChip(item, { inTray }) {
    const isSelected = drag.selectedId === item.id
    const verdictIcon =
      state.checked && !inTray ? (
        state.placements[item.id] === item.bucketId ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary-600" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
        )
      ) : null

    return (
      <button
        key={item.id}
        type="button"
        {...drag.getItemProps(item.id)}
        aria-pressed={isSelected}
        className={`sq-drag-chip flex min-h-11 items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold text-stone-700 transition-all dark:text-stone-100 ${itemTone(item)} ${
          isSelected ? 'ring-4 ring-primary-500/30' : ''
        }`}
      >
        {verdictIcon}
        {item.text}
      </button>
    )
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<FolderTree className="h-5 w-5 text-primary-500" />}
      headingBg="bg-primary-50"
      intro={intro}
      instruction={
        drag.selectedId
          ? 'Now tap a category to place it'
          : `Drag each item into a category, or tap it then tap a category — ${placedCount} of ${items.length} placed`
      }
      isComplete={isComplete}
      status={
        isComplete
          ? 'All items sorted correctly.'
          : `${placedCount} of ${items.length} items placed.`
      }
      onReset={placedCount > 0 ? reset : null}
    >
      {/* Tray */}
      <div
        {...drag.getZoneProps(TRAY_ID)}
        className="mb-5 min-h-20 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-3 dark:border-stone-600 dark:bg-stone-800/60"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
          Items to sort
        </p>
        {trayItems.length === 0 ? (
          <p className="text-sm font-medium text-stone-400">All items placed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trayItems.map((it) => renderChip(it, { inTray: true }))}
          </div>
        )}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {buckets.map((bucket) => {
          const bucketItems = items.filter((it) => state.placements[it.id] === bucket.id)
          return (
            <div
              key={bucket.id}
              {...drag.getZoneProps(bucket.id)}
              className={`min-h-32 rounded-xl border-2 p-3 transition-colors ${bucketStyle(bucket.color)} ${
                drag.selectedId ? 'cursor-pointer ring-2 ring-primary-400/40' : ''
              }`}
            >
              <p className="mb-2 text-sm font-black text-stone-800 dark:text-white">
                {bucket.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {bucketItems.map((it) => renderChip(it, { inTray: false }))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Verdict */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, checked: true }))}
          disabled={!allPlaced || isComplete}
          className="min-h-11 rounded-xl bg-primary-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-40"
        >
          Check Answers
        </button>
        {state.checked && !allCorrect && (
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            Some items are in the wrong category — move them and check again.
          </p>
        )}
        {isComplete && (
          <p className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
            Every item is in the right category.
          </p>
        )}
      </div>

      {/* Floating copy of the chip under the pointer while dragging. */}
      {drag.ghost && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-primary-400 bg-white px-3 py-2 text-sm font-bold text-stone-700 shadow-lg dark:bg-stone-700 dark:text-white"
          style={{ left: drag.ghost.x, top: drag.ghost.y }}
        >
          {items.find((it) => it.id === drag.ghost.id)?.text}
        </div>
      )}
    </InteractiveFrame>
  )
}
