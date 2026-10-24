import { useCallback, useEffect, useState } from 'react'

import { fetchLiveRoom, subscribeToLiveRoom } from '../lib/liveQuest'

// The countdown runs off this device's clock from the moment it first sees a
// question, so a phone with a wrong clock still gets the full time. Only a
// fresh page load mid-question trusts the server start time (clamped), so a
// refresh doesn't hand out extra seconds. The server enforces the real limit.
function withDeadline(prev, next, now) {
  if (next.status !== 'question') return { room: next, deadline: null }
  const isSameQuestion =
    prev.room?.status === 'question' && prev.room.currentIndex === next.currentIndex
  if (isSameQuestion && prev.deadline) return { room: next, deadline: prev.deadline }

  const localDeadline = now + next.secondsPerQuestion * 1000
  if (prev.room) return { room: next, deadline: localDeadline }
  const serverDeadline =
    Date.parse(next.questionStartedAt) + next.secondsPerQuestion * 1000
  const deadline =
    serverDeadline > now && serverDeadline <= localDeadline ? serverDeadline : localDeadline
  return { room: next, deadline }
}

// Loads one Live Quest room and keeps it live. `loadState` is
// 'loading' | 'ready' | 'missing' (gone, or the viewer isn't in it) | 'error'.
export function useLiveRoom(roomId) {
  const [state, setState] = useState({ room: null, deadline: null })
  const [loadState, setLoadState] = useState('loading')

  const apply = useCallback((room) => {
    const now = Date.now()
    setState((prev) => withDeadline(prev, room, now))
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchLiveRoom(roomId)
      .then((room) => {
        if (cancelled) return
        if (room) apply(room)
        setLoadState(room ? 'ready' : 'missing')
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })
    const unsubscribe = subscribeToLiveRoom(roomId, (room) => {
      if (!cancelled) apply(room)
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [roomId, apply])

  // Host actions call this after each write so the screen moves on even if
  // the realtime push is slow or missing.
  const refresh = useCallback(async () => {
    const room = await fetchLiveRoom(roomId)
    if (room) apply(room)
  }, [roomId, apply])

  return { room: state.room, deadline: state.deadline, loadState, refresh }
}

// Ticks while `isActive`, for countdowns.
export function useNow(isActive, intervalMs = 250) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!isActive) return undefined
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [isActive, intervalMs])
  return now
}

export function getSecondsLeft(room, deadline, now) {
  if (room?.status !== 'question' || !deadline) return 0
  const seconds = Math.ceil((deadline - now) / 1000)
  return Math.max(0, Math.min(room.secondsPerQuestion, seconds))
}
