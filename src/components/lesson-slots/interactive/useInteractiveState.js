import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../../context/AuthContext'
import { interactiveStateKey } from '../../../lib/studentStorage'

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
//
// In-progress answers stay on the device; completion and XP are the database's
// job. The key is scoped to the signed-in student so a shared computer does not
// hand one student's half-finished block to the next.
export function useInteractiveState(lessonId, blockId, makeInitial) {
  const { user } = useAuth()
  const storageKey = interactiveStateKey(user?.id, lessonId, blockId)
  const [state, setStateRaw] = useState(() => hydrate(storageKey, makeInitial()))

  // AuthContext restores the session after the first paint, so a block mounted
  // during a refresh starts on the signed-out key and re-keys a moment later.
  // Re-read from the new key during render (the same derived-state pattern
  // LessonTemplate uses for a lesson change) so the student sees their own work
  // instead of whatever the anonymous scope happened to hold.
  const [prevKey, setPrevKey] = useState(storageKey)
  if (prevKey !== storageKey) {
    setPrevKey(storageKey)
    setStateRaw(hydrate(storageKey, makeInitial()))
  }

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
