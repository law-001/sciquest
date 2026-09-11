// Publish state, per section. A section can override any scope; a scope the
// section never touched inherits the global course_publish_state row (the
// admin-set default), and with no row at either level the built-in default
// applies. RLS only lets a teacher write the sections she handles
// (teacher_sections). A small localStorage cache keeps the first paint fast
// on reload.
//
// Scopes, and what their ids are:
//   lessons             week ids whose lessons are published
//   open                week ids open regardless of the previous week
//   quizzes             week ids whose quizzes are published
//   quizzes-individual  lesson ids whose quiz is hidden
//   lessons-individual  lesson ids that are hidden
//
// resolvePublishIds returns null for "no row anywhere", which
// isWeekPublished treats as "all published" and the open / hidden checks
// treat as empty.

import { supabase } from './supabase'

const CACHE_KEY = 'sq_publish_state'

function emptyState() {
  return { global: {}, sections: {} }
}

function readCache() {
  try {
    const val = localStorage.getItem(CACHE_KEY)
    return val !== null ? JSON.parse(val) : emptyState()
  } catch {
    return emptyState()
  }
}

function writeCache(state) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

export function getCachedPublishState() {
  return readCache()
}

export async function fetchPublishState() {
  const [globalRes, sectionRes] = await Promise.all([
    supabase.from('course_publish_state').select('scope, week_ids'),
    supabase.from('section_publish_state').select('section, scope, item_ids'),
  ])
  if (globalRes.error) throw globalRes.error
  if (sectionRes.error) throw sectionRes.error

  const state = emptyState()
  for (const row of globalRes.data ?? []) {
    state.global[row.scope] = row.week_ids ?? []
  }
  for (const row of sectionRes.data ?? []) {
    state.sections[row.section] ??= {}
    state.sections[row.section][row.scope] = row.item_ids ?? []
  }
  writeCache(state)
  return state
}

// `section` null (a signed-out visitor, a student with no section, staff)
// reads the global default.
export function resolvePublishIds(state, section, scope) {
  const ids =
    (section != null ? state.sections[section]?.[scope] : undefined) ??
    state.global[scope]
  return ids ? new Set(ids) : null
}

export function isWeekPublished(weekId, publishedIds) {
  if (publishedIds === null) return true
  return publishedIds.has(weekId)
}

export function isWeekOpen(weekId, openIds) {
  if (!openIds) return false
  return openIds.has(weekId)
}

export function isLessonHidden(lessonId, hiddenIds) {
  if (!hiddenIds) return false
  return hiddenIds.has(lessonId)
}

// Copy of `state` with one section's scope replaced — the optimistic update
// applied before the write lands.
export function withSectionPublishIds(state, section, scope, ids) {
  return {
    ...state,
    sections: {
      ...state.sections,
      [section]: { ...state.sections[section], [scope]: [...ids] },
    },
  }
}

export async function saveSectionPublishIds(section, scope, ids) {
  const { error } = await supabase
    .from('section_publish_state')
    .upsert(
      { section, scope, item_ids: [...ids], updated_at: new Date().toISOString() },
      { onConflict: 'section,scope' },
    )
  if (error) throw error
}

// Refetches the whole state on any change to either table, so toggles made
// on one device reach every open client. Returns an unsubscribe fn.
export function subscribeToPublishState(onChange) {
  const refetch = () => {
    fetchPublishState().then(onChange).catch(() => {})
  }
  // Channel names must be unique per subscriber — duplicate names across
  // components silently break Supabase realtime.
  const channel = supabase
    .channel(`publish_state_changes_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'course_publish_state' }, refetch)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'section_publish_state' }, refetch)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
