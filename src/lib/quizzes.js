// Dynamic quiz data — Supabase-backed overrides on top of the static seed.
// Degrades gracefully (returns empty Map, logs a warning) when Supabase is
// not configured so a misconfigured deploy doesn't crash the whole app.

import { createClient } from '@supabase/supabase-js'

const _url = import.meta.env.VITE_SUPABASE_URL
const _key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Intentionally separate from src/lib/supabase.js so this module can return
// null and degrade gracefully when env vars are absent (supabase.js throws).
const supabase = (_url && _key)
  ? createClient(_url, _key, { auth: { persistSession: true } })
  : null

if (!supabase) {
  console.warn('[quizzes] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — dynamic quizzes disabled')
}

const CACHE_KEY = 'sq_quizzes_cache'

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return new Map()
    return new Map(JSON.parse(raw))
  } catch {
    return new Map()
  }
}

function writeCache(map) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify([...map.entries()]))
  } catch {
    /* storage quota exceeded */
  }
}

export function getCachedQuizzes() {
  return readCache()
}

export async function fetchAllQuizzes() {
  if (!supabase) return new Map()
  try {
    const { data, error } = await supabase.from('quizzes').select('*')
    if (error) throw error
    const map = new Map((data ?? []).map((row) => [row.lesson_id, row]))
    writeCache(map)
    return map
  } catch (err) {
    console.warn('[quizzes] fetch failed, using cache:', err.message)
    return readCache()
  }
}

export async function upsertQuiz(quiz) {
  if (!supabase) throw new Error('[quizzes] Supabase not configured')
  const { data, error } = await supabase
    .from('quizzes')
    .upsert(quiz, { onConflict: 'lesson_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// isStatic=true → soft-delete (sets is_hidden). isStatic=false → hard-delete.
export async function deleteQuiz(lessonId, { isStatic = false } = {}) {
  if (!supabase) throw new Error('[quizzes] Supabase not configured')
  if (isStatic) {
    const { error } = await supabase
      .from('quizzes')
      .update({ is_hidden: true })
      .eq('lesson_id', lessonId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('lesson_id', lessonId)
    if (error) throw error
  }
}

// Deletes the DB row so the static seed shows again for students.
export async function restoreStaticQuiz(lessonId) {
  if (!supabase) throw new Error('[quizzes] Supabase not configured')
  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('lesson_id', lessonId)
  if (error) throw error
}

// Returns an unsubscribe function. Realtime must be enabled on the quizzes
// table in Supabase (Database → Replication) for this to fire in production.
export function subscribeToQuizChanges(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel(`quizzes_changes_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quizzes' }, async () => {
      const map = await fetchAllQuizzes()
      onChange(map)
    })
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
