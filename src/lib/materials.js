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

// ── Opening and saving ───────────────────────────────────────────────────────

const KIND_MIME = {
  pdf: 'application/pdf',
  ppt: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const KIND_EXT = { pdf: 'pdf', ppt: 'pptx', doc: 'docx' }

// Uploads are stored as `<lessonId>/<timestamp>-<original name>`; strip both
// parts so a saved file lands under the name the teacher uploaded.
export function fileNameForMaterial(material) {
  const fromPath = material.storage_path?.split('/').pop()
  if (fromPath) return fromPath.replace(/^\d+-/, '')
  const fromUrl = decodeURIComponent(material.url?.split('?')[0].split('/').pop() ?? '')
  if (fromUrl) return fromUrl.replace(/^\d+-/, '')
  const ext = KIND_EXT[material.kind]
  return ext ? `${material.title}.${ext}` : material.title
}

// Word and PowerPoint have no native browser renderer. Microsoft's viewer shows
// them in a tab instead of handing the file to a desktop app; it fetches the
// file itself, which works because the lesson-materials bucket is public.
function viewerUrlFor(material) {
  if (material.kind === 'doc' || material.kind === 'ppt') {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(material.url)}`
  }
  return material.url
}

async function fetchMaterialBlob(material) {
  const res = await fetch(material.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const mime = KIND_MIME[material.kind]
  // Storage replays whatever content type the browser guessed at upload time,
  // and an empty guess becomes application/octet-stream — which is enough on its
  // own to make a browser download a PDF instead of rendering it.
  return mime && blob.type !== mime ? blob.slice(0, blob.size, mime) : blob
}

function openBlank() {
  const tab = window.open('about:blank', '_blank')
  if (tab) tab.opener = null
  return tab
}

function sendTo(tab, url) {
  if (tab) tab.location.replace(url)
  else window.open(url, '_blank', 'noopener,noreferrer')
}

// Shows the material in a new browser tab, leaving the SciQuest tab untouched.
// The tab is opened synchronously, before any await, so the popup blocker sees
// it as part of the click.
export async function openMaterial(material) {
  const tab = openBlank()
  if (material.kind !== 'pdf') {
    sendTo(tab, viewerUrlFor(material))
    return
  }
  try {
    const url = URL.createObjectURL(await fetchMaterialBlob(material))
    sendTo(tab, url)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch {
    sendTo(tab, material.url)
  }
}

// Saves the file without navigating: `download` on a plain anchor is ignored
// cross-origin, so the storage URL would replace the SciQuest tab instead.
export async function downloadMaterial(material) {
  const filename = fileNameForMaterial(material)
  try {
    const url = URL.createObjectURL(await fetchMaterialBlob(material))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
  } catch {
    // Fallback for a blocked fetch: Storage sets the attachment header itself
    // for `?download=`, and a hidden frame keeps the current tab in place.
    const sep = material.url.includes('?') ? '&' : '?'
    const frame = document.createElement('iframe')
    frame.hidden = true
    frame.src = `${material.url}${sep}download=${encodeURIComponent(filename)}`
    document.body.appendChild(frame)
    setTimeout(() => frame.remove(), 60_000)
  }
}
