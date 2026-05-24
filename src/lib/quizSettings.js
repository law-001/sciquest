// Per-lesson quiz settings (currently just the optional time limit).
// `time_limit_seconds` null = "no timer".
//
// Read paths return a Map keyed by lessonId; missing keys mean "no
// override exists" which the caller should treat as "no timer".

import { supabase } from './supabase'

const CACHE_KEY = 'sq_quiz_settings'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return new Map()
    const obj = JSON.parse(raw)
    return new Map(Object.entries(obj))
  } catch {
    return new Map()
  }
}

function writeCache(map) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(map)))
  } catch {
    /* quota */
  }
}

export function getCachedQuizSettings() {
  return readCache()
}

export function getQuizTimeLimit(settings, lessonId) {
  const entry = settings?.get?.(lessonId)
  if (!entry) return null
  const v = entry.time_limit_seconds
  return Number.isFinite(v) && v > 0 ? v : null
}

export async function fetchQuizSettings() {
  const { data, error } = await supabase
    .from('quiz_settings')
    .select('lesson_id, time_limit_seconds')
  if (error) throw error
  const map = new Map()
  for (const row of data ?? []) {
    map.set(row.lesson_id, { time_limit_seconds: row.time_limit_seconds })
  }
  writeCache(map)
  return map
}

// `seconds` of null clears the timer; otherwise must be a positive int.
export async function saveQuizTimeLimit(lessonId, seconds) {
  const value = seconds == null ? null : Math.max(1, Math.round(seconds))
  const { error } = await supabase
    .from('quiz_settings')
    .upsert(
      {
        lesson_id: lessonId,
        time_limit_seconds: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id' },
    )
  if (error) throw error
  const cache = readCache()
  cache.set(lessonId, { time_limit_seconds: value })
  writeCache(cache)
}

export function subscribeToQuizSettings(onChange) {
  // Channel names must be unique per subscriber — duplicate names across
  // components silently break Supabase realtime.
  const channel = supabase
    .channel(`quiz_settings_changes_${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'quiz_settings' },
      (payload) => {
        const row = payload.new ?? payload.old
        if (!row?.lesson_id) return
        const cache = readCache()
        if (payload.eventType === 'DELETE') cache.delete(row.lesson_id)
        else cache.set(row.lesson_id, { time_limit_seconds: row.time_limit_seconds })
        writeCache(cache)
        onChange(row.lesson_id, payload.eventType === 'DELETE' ? null : row.time_limit_seconds)
      },
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
