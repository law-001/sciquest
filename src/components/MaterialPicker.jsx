import React, { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Link as LinkIcon,
  Loader2,
  Play,
  Presentation,
  Trash2,
  Upload,
} from 'lucide-react'

import { useLessonsData } from '../context/LessonsDataContext'
import {
  MAX_MATERIAL_BYTES,
  deleteMaterial,
  formatFileSize,
  kindForFile,
  upsertMaterial,
  uploadMaterialFile,
  youtubeIdFromUrl,
} from '../lib/materials'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'

const KIND_ICONS = { youtube: Play, pdf: FileText, ppt: Presentation, doc: FileText, link: LinkIcon }

const ACCEPT =
  '.pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export default function MaterialPicker({ lessonId }) {
  const { getMaterials, applyMaterialRow, removeMaterialRow } = useLessonsData()
  const materials = getMaterials(lessonId)

  const [tab, setTab] = useState('upload')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    if (!kindForFile(file)) {
      setError('Only PDF, PowerPoint and Word files can be uploaded.')
      return
    }
    if (file.size > MAX_MATERIAL_BYTES) {
      setError('File must be under 20 MB.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const uploaded = await uploadMaterialFile(file, lessonId)
      const saved = await upsertMaterial({
        lesson_id: lessonId,
        kind: uploaded.kind,
        title: file.name,
        url: uploaded.url,
        storage_path: uploaded.path,
        file_size: uploaded.size,
        mime_type: uploaded.mimeType,
        sort_order: materials.length,
      })
      applyMaterialRow(saved)
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleAddLink(e) {
    e.preventDefault()
    const url = linkUrl.trim()
    if (!url) return
    setError(null)
    setBusy(true)
    try {
      // A YouTube URL becomes an embeddable video; anything else is a plain link.
      const kind = youtubeIdFromUrl(url) ? 'youtube' : 'link'
      const saved = await upsertMaterial({
        lesson_id: lessonId,
        kind,
        title: linkTitle.trim() || url,
        url,
        sort_order: materials.length,
      })
      applyMaterialRow(saved)
      setLinkUrl('')
      setLinkTitle('')
    } catch (err) {
      setError(err.message || 'Could not save the link.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(material) {
    setError(null)
    try {
      await deleteMaterial(material)
      removeMaterialRow(material.id)
    } catch (err) {
      setError(err.message || 'Could not delete that material.')
    }
  }

  // Reorder rewrites sort_order for the whole list, so gaps left by deletions
  // can't make two materials share a position.
  async function move(index, delta) {
    const next = [...materials]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    try {
      for (let i = 0; i < next.length; i++) {
        if (next[i].sort_order === i) continue
        const saved = await upsertMaterial({ ...next[i], sort_order: i })
        applyMaterialRow(saved)
      }
    } catch (err) {
      setError(err.message || 'Could not reorder materials.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Lesson Materials
        </p>
        <div className="flex gap-1 rounded-lg bg-stone-100 p-1 dark:bg-stone-700">
          {[
            { id: 'upload', icon: Upload, label: 'Upload file' },
            { id: 'link', icon: LinkIcon, label: 'Video or link' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-600 dark:text-white'
                  : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <t.icon className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          onClick={() => !busy && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all ${
            dragging
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'border-orange-200 bg-orange-50/40 hover:border-primary-300 dark:border-stone-600 dark:bg-stone-800/40 dark:hover:bg-stone-800'
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              <p className="text-sm font-bold text-stone-500">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-stone-700">
                <Upload className="h-6 w-6 text-primary-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                  Drop a file here or{' '}
                  <span className="text-primary-600 dark:text-primary-400">browse</span>
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  PDF, PowerPoint, Word · max 20 MB
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {tab === 'link' && (
        <form onSubmit={handleAddLink} className="space-y-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=… or any link"
            className={INPUT}
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Title students will see"
              className={INPUT + ' flex-1'}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-stone-400">
            YouTube links play inline. Anything else opens in a new tab.
          </p>
        </form>
      )}

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}

      {materials.length > 0 && (
        <ul className="space-y-2">
          {materials.map((m, i) => {
            const Icon = KIND_ICONS[m.kind] ?? LinkIcon
            return (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-2.5 dark:border-stone-700 dark:bg-stone-800"
              >
                <Icon className="h-4 w-4 shrink-0 text-stone-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stone-800 dark:text-stone-100">
                    {m.title}
                  </p>
                  <p className="text-xs text-stone-400">
                    {m.kind.toUpperCase()}
                    {m.file_size ? ` · ${formatFileSize(m.file_size)}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-2 text-stone-400 transition-colors hover:text-stone-600 disabled:opacity-30"
                  aria-label={`Move ${m.title} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === materials.length - 1}
                  className="p-2 text-stone-400 transition-colors hover:text-stone-600 disabled:opacity-30"
                  aria-label={`Move ${m.title} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m)}
                  className="p-2 text-stone-400 transition-colors hover:text-red-500"
                  aria-label={`Delete ${m.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
