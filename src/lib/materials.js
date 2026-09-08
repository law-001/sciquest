// Teacher-uploaded lesson materials — YouTube links, PDFs, PPTs, Word docs.
//
// Structured like src/lib/lessons.js: degrades to a null client so a
// misconfigured deploy shows lessons without materials instead of crashing.

import { supabaseOrNull } from './supabaseClient'

const supabase = supabaseOrNull

if (!supabase) {
  console.warn('[materials] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — lesson materials disabled')
}

const CACHE_KEY = 'sq_materials_cache'
const BUCKET = 'lesson-materials'

export const MAX_MATERIAL_BYTES = 20 * 1024 * 1024

// Maps an upload's MIME type to the `kind` column. Anything unrecognised is
// rejected by the picker rather than stored as an opaque blob.
const MIME_KIND = {
  'application/pdf': 'pdf',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
}

const EXT_KIND = { pdf: 'pdf', ppt: 'ppt', pptx: 'ppt', doc: 'doc', docx: 'doc' }

// Browsers disagree on the MIME type for .ppt/.docx, so fall back to extension.
export function kindForFile(file) {
  const byMime = MIME_KIND[file.type]
  if (byMime) return byMime
  const ext = file.name.split('.').pop()?.toLowerCase()
  return EXT_KIND[ext] ?? null
}

// Accepts watch?v=, youtu.be/, /embed/ and /shorts/ forms. Returns null for
// anything else so the caller can store it as a plain link instead.
export function youtubeIdFromUrl(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com|youtube-nocookie\.com)\/watch\?(?:.*&)?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([\w-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/shorts\/([\w-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

export function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Cache ────────────────────────────────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeCache(rows) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rows))
  } catch {
    /* storage quota exceeded */
  }
}

export function getCachedMaterials() {
  return readCache()
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function fetchAllMaterials() {
  if (!supabase) return []
  // See fetchAllLessons: an anonymous read returns zero rows under RLS, and
  // caching that would discard the offline copy.
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) return readCache()
  try {
    const { data, error } = await supabase
      .from('lesson_materials')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    const rows = data ?? []
    writeCache(rows)
    return rows
  } catch (err) {
    console.warn('[materials] fetch failed, using cache:', err.message)
    return readCache()
  }
}

export async function upsertMaterial(material) {
  if (!supabase) throw new Error('[materials] Supabase not configured')
  const { data, error } = await supabase
    .from('lesson_materials')
    .upsert(material, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// Removes the Storage object first so a failed DB delete doesn't orphan the row
// pointing at a file that no longer exists.
export async function deleteMaterial(material) {
  if (!supabase) throw new Error('[materials] Supabase not configured')
  if (material.storage_path) {
    const { error: storageErr } = await supabase.storage
      .from(BUCKET)
      .remove([material.storage_path])
    if (storageErr) throw storageErr
  }
  const { error } = await supabase
    .from('lesson_materials')
    .delete()
    .eq('id', material.id)
  if (error) throw error
}

// Returns { url, path, size, mimeType, kind } for the caller to store on the row.
export async function uploadMaterialFile(file, lessonId) {
  if (!supabase) throw new Error('[materials] Supabase not configured')
  const kind = kindForFile(file)
  if (!kind) throw new Error('Only PDF, PowerPoint and Word files can be uploaded.')
  if (file.size > MAX_MATERIAL_BYTES) throw new Error('File must be under 20 MB.')

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${lessonId}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path, size: file.size, mimeType: file.type, kind }
}

// Returns an unsubscribe function. Realtime must be enabled on the
// lesson_materials table in Supabase for this to fire in production.
export function subscribeToMaterialChanges(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel(`materials_changes_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lesson_materials' }, async () => {
      onChange(await fetchAllMaterials())
    })
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
