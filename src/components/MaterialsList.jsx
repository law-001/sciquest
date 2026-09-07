import React, { useState } from 'react'
import {
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Play,
  Presentation,
} from 'lucide-react'

import { formatFileSize, youtubeIdFromUrl } from '../lib/materials'

const KIND_META = {
  youtube: { icon: Play, label: 'Video', tone: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  pdf: { icon: FileText, label: 'PDF', tone: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  ppt: { icon: Presentation, label: 'Slides', tone: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20' },
  doc: { icon: FileText, label: 'Document', tone: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20' },
  link: { icon: LinkIcon, label: 'Link', tone: 'text-stone-600 bg-stone-100 dark:bg-stone-700' },
}

const metaFor = (kind) => KIND_META[kind] ?? KIND_META.link

// Click-to-load facade. Embedding the iframe directly would pull YouTube's
// player JS into every lesson that links a video, whether or not it's watched.
function YouTubeEmbed({ videoId, title }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-stone-900"
      aria-label={`Play video: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-white text-white" />
        </span>
      </span>
    </button>
  )
}

function MaterialRow({ material }) {
  const meta = metaFor(material.kind)
  const Icon = meta.icon
  const videoId = material.kind === 'youtube' ? youtubeIdFromUrl(material.url) : null

  if (videoId) {
    return (
      <li className="space-y-2">
        <YouTubeEmbed videoId={videoId} title={material.title} />
        <div>
          <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
            {material.title}
          </p>
          {material.description && (
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {material.description}
            </p>
          )}
        </div>
      </li>
    )
  }

  const isDownload = material.kind === 'pdf' || material.kind === 'ppt' || material.kind === 'doc'

  return (
    <li className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-3 dark:border-stone-700 dark:bg-stone-800">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}>
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-stone-800 dark:text-stone-100">
          {material.title}
        </p>
        {/* Type is stated in words, not just by the icon's color. */}
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {meta.label}
          {material.file_size ? ` · ${formatFileSize(material.file_size)}` : ''}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-1.5 rounded-xl border border-orange-200 px-3 py-2 text-xs font-bold text-stone-600 transition-colors hover:bg-orange-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </a>
        {isDownload && (
          <a
            href={material.url}
            download
            className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-600"
          >
            <Download className="h-3.5 w-3.5" />
            Save
          </a>
        )}
      </div>
    </li>
  )
}

export default function MaterialsList({ materials = [] }) {
  if (materials.length === 0) return null
  return (
    <ul className="space-y-3">
      {materials.map((m) => (
        <MaterialRow key={m.id} material={m} />
      ))}
    </ul>
  )
}
