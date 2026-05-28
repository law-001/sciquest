// Dynamic lesson data — Supabase-backed overrides on top of the static seed.
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
  console.warn('[lessons] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — dynamic lessons disabled')
}

const CACHE_KEY = 'sq_lessons_cache'

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

export function getCachedLessons() {
  return readCache()
}

export async function fetchAllLessons() {
  if (!supabase) return new Map()
  try {
    const { data, error } = await supabase.from('lessons').select('*')
    if (error) throw error
    const map = new Map((data ?? []).map((row) => [row.id, row]))
    writeCache(map)
    return map
  } catch (err) {
    console.warn('[lessons] fetch failed, using cache:', err.message)
    return readCache()
  }
}

export async function upsertLesson(lesson) {
  if (!supabase) throw new Error('[lessons] Supabase not configured')
  const { data, error } = await supabase
    .from('lessons')
    .upsert(lesson, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// isStatic=true → soft-delete (sets is_hidden). Assumes the row already exists
// (fork-on-edit in Phase 3 creates it before delete is possible in Phase 4).
// isStatic=false → hard-delete custom lesson row.
export async function deleteLesson(lessonId, { isStatic = false } = {}) {
  if (!supabase) throw new Error('[lessons] Supabase not configured')
  if (isStatic) {
    const { error } = await supabase
      .from('lessons')
      .update({ is_hidden: true })
      .eq('id', lessonId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)
    if (error) throw error
  }
}

// Deletes the DB row so the static seed shows again for students.
export async function restoreStaticLesson(lessonId) {
  if (!supabase) throw new Error('[lessons] Supabase not configured')
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)
  if (error) throw error
}

// Uploads to the lesson-media Storage bucket and returns the public URL.
// Bucket must be public and CORS-configured for the production origin.
export async function uploadLessonImage(file, lessonId) {
  if (!supabase) throw new Error('[lessons] Supabase not configured')
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `lesson-media/${lessonId}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage
    .from('lesson-media')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('lesson-media').getPublicUrl(path)
  return data.publicUrl
}

// Returns an unsubscribe function. Realtime must be enabled on the lessons
// table in Supabase (Database → Replication) for this to fire in production.
export function subscribeToLessonChanges(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel(`lessons_changes_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, async () => {
      const map = await fetchAllLessons()
      onChange(map)
    })
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
