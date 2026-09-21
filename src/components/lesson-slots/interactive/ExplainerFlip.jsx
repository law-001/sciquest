import React, { useEffect, useRef, useState } from 'react'
import { RotateCw, Undo2 } from 'lucide-react'

// Turns a finished interactive over to show what the student just did.
//
// The explanation used to sit beside the activity, which meant a Grade 7
// student read a paragraph about a result before they had produced it. Here the
// front carries instructions only, and the back, reachable once the block
// reports complete, carries the "so what".
//
// The front is never unmounted, only rotated away: half of these blocks are
// running simulations, and remounting one would throw away the state the
// explanation is about.
//
// This is a reveal, not assessment. It awards no XP, reports no completion and
// gates nothing.

// A click that starts inside one of these is the student still using the
// activity: pressing Reset, dragging a slider, re-running a sim. So it must
// not be swallowed by the card-level flip.
const CONTROL_SELECTOR =
  'button, a, input, select, textarea, label, canvas, svg, [role="button"], [draggable="true"]'

export default function ExplainerFlip({ explainer, unlocked = false, children }) {
  const [flipped, setFlipped] = useState(false)
  const frontButtonRef = useRef(null)
  const backButtonRef = useRef(null)
  // Focus follows the flip, but only once the student has actually flipped it:
  // the face being turned away is `inert`, so whatever they pressed is about to
  // stop being focusable.
  const hasFlippedRef = useRef(false)

  const points = (explainer?.points ?? []).filter(Boolean)
  const hasExplainer = Boolean(explainer?.title) && points.length > 0

  useEffect(() => {
    if (!hasFlippedRef.current) return
    const target = flipped ? backButtonRef.current : frontButtonRef.current
    target?.focus()
  }, [flipped])

  // A block with no explainer written for it renders exactly as it did before
  // this component existed, so a half-migrated lesson stays correct.
  if (!hasExplainer) return children

  function turn(next) {
    hasFlippedRef.current = true
    setFlipped(next)
  }

  function handleFrontClick(e) {
    if (!unlocked || flipped) return
    if (e.target.closest(CONTROL_SELECTOR)) return
    turn(true)
  }

  return (
    <div className="sq-explain-flip">
      <div
        className={`sq-explain-flip__inner${flipped ? ' sq-explain-flip__inner--flipped' : ''}`}
      >
        <div
          className="sq-explain-flip__face"
          aria-hidden={flipped}
          inert={flipped}
          onClick={handleFrontClick}
          style={{ cursor: unlocked ? 'pointer' : 'auto' }}
        >
          {children}

          {unlocked && (
            <button
              ref={frontButtonRef}
              type="button"
              onClick={() => turn(true)}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-secondary-400 bg-secondary-50 px-4 py-3 text-sm font-black text-secondary-700 transition-colors hover:bg-secondary-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary-500/30 dark:border-secondary-600 dark:bg-secondary-700/25 dark:text-secondary-100 dark:hover:bg-secondary-700/40"
            >
              <RotateCw className="h-4 w-4" />
              What just happened?
            </button>
          )}
        </div>

        <div
          className="sq-explain-flip__face sq-explain-flip__face--back"
          aria-hidden={!flipped}
          inert={!flipped}
          onClick={() => turn(false)}
        >
          <div className="flex h-full flex-col justify-center rounded-2xl border-2 border-secondary-300 bg-secondary-50 p-6 dark:border-secondary-600 dark:bg-stone-800 sm:p-8">
            <p className="text-xs font-black uppercase tracking-wider text-secondary-700 dark:text-secondary-200">
              What just happened
            </p>
            <h3 className="mt-2 text-xl font-black text-stone-900 dark:text-white sm:text-2xl">
              {explainer.title}
            </h3>

            <ul className="mt-4 space-y-3">
              {points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm font-medium leading-relaxed text-stone-700 dark:text-stone-200 sm:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <button
              ref={backButtonRef}
              type="button"
              onClick={() => turn(false)}
              className="mt-6 flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-card transition-colors hover:bg-orange-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary-500/30 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
            >
              <Undo2 className="h-4 w-4" />
              Back to the activity
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
