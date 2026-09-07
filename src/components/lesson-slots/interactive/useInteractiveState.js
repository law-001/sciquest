import { useEffect, useRef, useState } from 'react'

// In-progress answers live in localStorage only — the same approach
// QuizContainer uses for `quiz-answers-${lessonId}`. Completion (and XP) is the
// database's job.
const storageKeyFor = (lessonId, blockId) => `sq_lesson_interact_${lessonId}_${blockId}`

function hydrate(storageKey, initial) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) return { ...initial, ...JSON.parse(raw) }
  } catch {
    /* private mode, or stale JSON — fall through to a clean slate */
  }
  return initial
}

// Persisted per-block state. `makeInitial` is called for the first render and
// again on reset; it must be pure.
export function useInteractiveState(lessonId, blockId, makeInitial) {
  const storageKey = storageKeyFor(lessonId, blockId)
  const [state, setStateRaw] = useState(() => hydrate(storageKey, makeInitial()))

  function setState(updater) {
    setStateRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        /* quota exceeded — the block still works, it just won't survive reload */
      }
      return next
    })
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* nothing to clean up */
    }
    setStateRaw(makeInitial())
  }

  return [state, setState, reset]
}

// Reports the first solve upward. The latch is per-mount, so App.jsx is what
// decides whether a report is genuinely new — it holds the student's saved rows.
// Revisiting a finished block therefore never re-awards XP.
export function useCompletionReport({
  isComplete,
  lessonId,
  blockId,
  blockType,
  xp = 0,
  onInteractionComplete,
}) {
  const reportedRef = useRef(false)

  useEffect(() => {
    if (!isComplete || reportedRef.current) return
    reportedRef.current = true
    onInteractionComplete?.({ lessonId, blockId, blockType, xp })
  }, [isComplete, lessonId, blockId, blockType, xp, onInteractionComplete])
}
