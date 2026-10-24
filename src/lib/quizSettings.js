// Per-lesson quiz settings: optional time limit, attempt cap, the "reveal
// correct answers after submit" toggle, and the scheduled availability window.
//
// `time_limit_seconds` null = "no timer".
// `max_attempts`       null = "unlimited"; positive int otherwise.
// `show_correct_answers` defaults true (current behavior).
// `available_from` / `available_until` null = "no window on that edge"; both
//   null means the quiz is governed by the publish toggles alone.
//
// Read paths return a Map keyed by lessonId; missing keys mean "no
// override exists" — callers fall back to app-wide defaults.

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

function toEntry(row) {
  return {
    time_limit_seconds: row.time_limit_seconds,
    max_attempts: row.max_attempts,
    show_correct_answers: row.show_correct_answers,
    available_from: row.available_from ?? null,
    available_until: row.available_until ?? null,
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

// Returns the configured max attempts for this quiz, or null when the
// teacher has chosen "unlimited". A missing entry returns null too so
// the caller can fall back to the app-wide default.
export function getQuizMaxAttempts(settings, lessonId) {
  const entry = settings?.get?.(lessonId)
  if (!entry) return null
  const v = entry.max_attempts
  return Number.isFinite(v) && v > 0 ? v : null
}

// True when the per-question review on the results screen should reveal
// correct answers. Defaults to true (the original behavior) so quizzes
// without an explicit setting keep working as before.
export function getQuizShowAnswers(settings, lessonId) {
  const entry = settings?.get?.(lessonId)
  if (!entry) return true
  return entry.show_correct_answers !== false
}

// The scheduled availability window for this quiz, or null when the teacher
// set neither edge. `from` / `until` are ISO instants; either may be null.
export function getQuizWindow(settings, lessonId) {
  const entry = settings?.get?.(lessonId)
  if (!entry) return null
  const from = entry.available_from ?? null
  const until = entry.available_until ?? null
  if (!from && !until) return null
  return { from, until }
}

// 'none'   no window set
// 'before' the window has not opened yet
// 'open'   inside the window (or past an open-ended start)
// 'after'  the window has closed
//
// The server allows a 2-minute grace past `until` so an auto-submit fired at
// the bell still saves. That grace is deliberately NOT applied here: students
// and teachers should see the window close exactly when it says it does.
export function getQuizWindowState(quizWindow, now = Date.now()) {
  if (!quizWindow) return 'none'
  const from = quizWindow.from ? Date.parse(quizWindow.from) : NaN
  const until = quizWindow.until ? Date.parse(quizWindow.until) : NaN
  if (Number.isFinite(from) && now < from) return 'before'
  if (Number.isFinite(until) && now >= until) return 'after'
  return 'open'
}

// Both edges are written together: saving one without the other could leave
// a window whose end precedes its start, which the table's check rejects.
// Pass nulls for both to clear the schedule.
export async function saveQuizWindow(lessonId, { from, until }) {
  const { error } = await supabase
    .from('quiz_settings')
    .upsert(
      {
        lesson_id: lessonId,
        available_from: from ?? null,
        available_until: until ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id' },
    )
  if (error) throw error
  const cache = readCache()
  const prev = cache.get(lessonId) ?? {}
  cache.set(lessonId, {
    ...prev,
    available_from: from ?? null,
    available_until: until ?? null,
  })
  writeCache(cache)
}

export async function fetchQuizSettings() {
  const { data, error } = await supabase
    .from('quiz_settings')
    .select('lesson_id, time_limit_seconds, max_attempts, show_correct_answers, available_from, available_until')
  if (error) throw error
  const map = new Map()
  for (const row of data ?? []) {
    map.set(row.lesson_id, toEntry(row))
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
  const prev = cache.get(lessonId) ?? {}
  cache.set(lessonId, { ...prev, time_limit_seconds: value })
  writeCache(cache)
}

// `attempts` of null means "unlimited"; otherwise a positive int.
export async function saveQuizMaxAttempts(lessonId, attempts) {
  const value = attempts == null ? null : Math.max(1, Math.round(attempts))
  const { error } = await supabase
    .from('quiz_settings')
    .upsert(
      {
        lesson_id: lessonId,
        max_attempts: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id' },
    )
  if (error) throw error
  const cache = readCache()
  const prev = cache.get(lessonId) ?? {}
  cache.set(lessonId, { ...prev, max_attempts: value })
  writeCache(cache)
}

export async function saveQuizShowAnswers(lessonId, show) {
  const value = !!show
  const { error } = await supabase
    .from('quiz_settings')
    .upsert(
      {
        lesson_id: lessonId,
        show_correct_answers: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id' },
    )
  if (error) throw error
  const cache = readCache()
  const prev = cache.get(lessonId) ?? {}
  cache.set(lessonId, { ...prev, show_correct_answers: value })
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
        if (payload.eventType === 'DELETE') {
          cache.delete(row.lesson_id)
        } else {
          cache.set(row.lesson_id, toEntry(row))
        }
        writeCache(cache)
        onChange(row.lesson_id, payload.eventType === 'DELETE' ? null : row)
      },
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
