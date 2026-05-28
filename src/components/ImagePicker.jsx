import React, { useState, useRef } from 'react'
import { Upload, Link, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadLessonImage } from '../lib/lessons'

export default function ImagePicker({ value, onChange, lessonId, label = 'Hero Image' }) {
  const [tab, setTab] = useState('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.')
      return
    }
    setUploadError(null)
    setUploading(true)
    try {
      const url = await uploadLessonImage(file, lessonId)
      onChange(url)
    } catch (err) {
      setUploadError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleUrlSubmit(e) {
    e.preventDefault()
    if (urlInput.trim()) onChange(urlInput.trim())
  }

  function clear() {
    onChange('')
    setUrlInput('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{label}</p>
        <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-700 rounded-lg">
          {[
            { id: 'upload', icon: Upload, label: 'Upload' },
            { id: 'url', icon: Link, label: 'URL' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border-2 border-orange-200 dark:border-stone-600 aspect-video">
          <img src={value} alt="Hero preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-900/70 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              dragging
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'border-orange-200 dark:border-stone-600 bg-orange-50/40 dark:bg-stone-800/40 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-stone-800'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <p className="text-sm font-bold text-stone-500">Uploading…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-stone-700 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                    Drop image here or <span className="text-primary-600 dark:text-primary-400">browse</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">JPEG, PNG, WebP, GIF · max 5 MB</p>
                </div>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>
          {uploadError && (
            <p className="mt-1.5 text-xs font-bold text-red-500">{uploadError}</p>
          )}
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors"
          >
            Use
          </button>
        </form>
      )}
    </div>
  )
}
