import React from 'react'
import { Layers } from 'lucide-react'

import InteractiveFrame from './InteractiveFrame'
import { useCompletionReport, useInteractiveState } from './useInteractiveState'

// Complete class strings only. Tailwind v4 scans source text, and this project
// has no safelist — an interpolated `bg-${color}-50` would compile to nothing.
const FACE_STYLES = {
  primary: {
    front: 'bg-primary-50 border-2 border-primary-200 text-primary-900 dark:bg-primary-700/25 dark:border-primary-600/50 dark:text-primary-50',
    back: 'bg-primary-500 border-2 border-primary-500 text-white',
  },
  secondary: {
    front: 'bg-secondary-50 border-2 border-secondary-200 text-secondary-900 dark:bg-secondary-700/25 dark:border-secondary-600/50 dark:text-secondary-50',
    back: 'bg-secondary-500 border-2 border-secondary-500 text-white',
  },
  accent: {
    front: 'bg-accent-50 border-2 border-accent-200 text-accent-900 dark:bg-accent-700/25 dark:border-accent-600/50 dark:text-accent-50',
    back: 'bg-accent-600 border-2 border-accent-600 text-white',
  },
}

const styleFor = (color) => FACE_STYLES[color] ?? FACE_STYLES.primary

export default function FlipCardsSection({
  id,
  heading,
  data,
  blockId,
  lessonId,
  stateScope,
  onInteractionComplete,
}) {
  const { intro, cards = [], xp = 0 } = data ?? {}

  const [state, setState, reset] = useInteractiveState(stateScope ?? lessonId, blockId, () => ({
    flipped: [],
  }))

  const flipped = new Set(state.flipped)
  const seenCount = cards.filter((_, i) => flipped.has(i)).length
  const isComplete = cards.length > 0 && seenCount === cards.length

  useCompletionReport({
    isComplete,
    lessonId,
    blockId,
    blockType: 'flipCards',
    xp,
    onInteractionComplete,
  })

  if (cards.length === 0) return null

  function toggle(i) {
    setState((prev) => {
      const next = new Set(prev.flipped)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return { flipped: [...next] }
    })
  }

  return (
    <InteractiveFrame
      id={id}
      heading={heading}
      icon={<Layers className="h-5 w-5 text-primary-500" />}
      headingBg="bg-primary-50"
      intro={intro}
      instruction={`Tap a card to reveal the answer — ${seenCount} of ${cards.length} revealed`}
      isComplete={isComplete}
      status={
        isComplete
          ? 'All cards revealed.'
          : `${seenCount} of ${cards.length} cards revealed.`
      }
      onReset={state.flipped.length > 0 ? reset : null}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card, i) => {
          const isFlipped = flipped.has(i)
          const faces = styleFor(card.color)
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={isFlipped}
              className="sq-flip h-44 w-full rounded-2xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
            >
              <div
                className={`sq-flip__inner ${isFlipped ? 'sq-flip__inner--flipped' : ''}`}
              >
                <div className={`sq-flip__face ${faces.front}`} aria-hidden={isFlipped}>
                  <span className="text-base font-black leading-snug">{card.front}</span>
                </div>
                <div
                  className={`sq-flip__face sq-flip__face--back ${faces.back}`}
                  aria-hidden={!isFlipped}
                >
                  <span className="text-sm font-bold leading-relaxed">{card.back}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </InteractiveFrame>
  )
}
