// Global publish state — stored in Supabase so a teacher's toggle takes
// effect for every device, not just the one that flipped it. A small
// localStorage cache keeps the first paint fast on reload.
//
// The "null" sentinel returned from the cache means "no row yet", which
// `isWeekPublished` treats as "all published" (preserves the original
// default before this table existed).

import { supabase } from './supabase'

const LESSONS_CACHE = 'sq_published_weeks'
const QUIZZES_CACHE = 'sq_published_quiz_weeks'
const OPEN_CACHE = 'sq_open_weeks'
const HIDDEN_QUIZZES_CACHE = 'sq_hidden_quiz_lessons'

function readCache(key) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? new Set(JSON.parse(val)) : null
  } catch {
    return null
  }
}

function writeCache(key, ids) {
  try {
    if (ids === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify([...ids]))
  } catch {
    /* quota */
  }
}

export function getPublishedWeekIds() {
  return readCache(LESSONS_CACHE)
}

export function getPublishedQuizWeekIds() {
  return readCache(QUIZZES_CACHE)
}

export function isWeekPublished(weekId, publishedIds) {
  if (publishedIds === null) return true
  return publishedIds.has(weekId)
}

// "Open for all" is opt-in per week — default (no row, or week not in set)
// is `false`, so the normal previous-week prerequisite still applies.
export function getOpenWeekIds() {
  return readCache(OPEN_CACHE)
}

export function isWeekOpen(weekId, openIds) {
  if (!openIds) return false
  return openIds.has(weekId)
}

// Per-quiz hiding is opt-in by lesson id — default (no row, or lesson not in
// set) is `false`, so a quiz stays visible as long as its week is published.
export function getHiddenQuizLessonIds() {
  return readCache(HIDDEN_QUIZZES_CACHE)
}

export function isQuizLessonHidden(lessonId, hiddenIds) {
  if (!hiddenIds) return false
  return hiddenIds.has(lessonId)
}

async function fetchScope(scope) {
  const { data, error } = await supabase
    .from('course_publish_state')
    .select('week_ids')
    .eq('scope', scope)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return new Set(data.week_ids ?? [])
}

export async function fetchPublishedWeekIds() {
  const ids = await fetchScope('lessons')
  writeCache(LESSONS_CACHE, ids)
  return ids
}

export async function fetchPublishedQuizWeekIds() {
  const ids = await fetchScope('quizzes')
  writeCache(QUIZZES_CACHE, ids)
  return ids
}

export async function fetchOpenWeekIds() {
  const ids = await fetchScope('open')
  writeCache(OPEN_CACHE, ids)
  return ids
}

export async function fetchHiddenQuizLessonIds() {
  const ids = await fetchScope('quizzes-individual')
  writeCache(HIDDEN_QUIZZES_CACHE, ids)
  return ids
}

async function upsertScope(scope, ids) {
  const arr = ids ? [...ids] : []
  const { error } = await supabase
    .from('course_publish_state')
    .upsert(
      { scope, week_ids: arr, updated_at: new Date().toISOString() },
      { onConflict: 'scope' },
    )
  if (error) throw error
}

export async function savePublishedWeekIds(ids) {
  writeCache(LESSONS_CACHE, ids)
  await upsertScope('lessons', ids)
}

export async function savePublishedQuizWeekIds(ids) {
  writeCache(QUIZZES_CACHE, ids)
  await upsertScope('quizzes', ids)
}

export async function saveOpenWeekIds(ids) {
  writeCache(OPEN_CACHE, ids)
  await upsertScope('open', ids)
}

export async function saveHiddenQuizLessonIds(ids) {
  writeCache(HIDDEN_QUIZZES_CACHE, ids)
  await upsertScope('quizzes-individual', ids)
}

// Subscribe to realtime updates so toggles made on one device propagate
// to every other open client within seconds. Returns an unsubscribe fn.
export function subscribeToPublishedState(onChange) {
  // Channel names must be unique per subscriber — duplicate names across
  // components silently break Supabase realtime.
  const channel = supabase
    .channel(`course_publish_state_changes_${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'course_publish_state' },
      (payload) => {
        const row = payload.new ?? payload.old
        if (!row?.scope) return
        const ids = payload.eventType === 'DELETE'
          ? null
          : new Set(row.week_ids ?? [])
        const cacheKey =
          row.scope === 'lessons'
            ? LESSONS_CACHE
            : row.scope === 'quizzes'
              ? QUIZZES_CACHE
              : row.scope === 'open'
                ? OPEN_CACHE
                : row.scope === 'quizzes-individual'
                  ? HIDDEN_QUIZZES_CACHE
                  : null
        if (!cacheKey) return
        writeCache(cacheKey, ids)
        onChange(row.scope, ids)
      },
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
