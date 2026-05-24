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
        const cacheKey = row.scope === 'lessons' ? LESSONS_CACHE : QUIZZES_CACHE
        writeCache(cacheKey, ids)
        onChange(row.scope, ids)
      },
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
