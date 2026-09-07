import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

import ImagePicker from '../ImagePicker'
import ImagePointEditor from './_ImagePointEditor'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `pt-${Date.now()}-${Math.random().toString(36).slice(2)}`

export default function HotspotForm({
  initialHeading,
  initialData,
  lessonId,
  onSubmit,
  onCancel,
}) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [image, setImage] = useState(initialData?.image || '')
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '')
  const [xp, setXp] = useState(initialData?.xp ?? 0)
  const [points, setPoints] = useState(initialData?.points ?? [])
  const [selectedId, setSelectedId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const clean = points.filter((p) => p.title.trim())
    onSubmit(heading, {
      intro: intro.trim() || undefined,
      image,
      imageAlt,
      xp: Number(xp) || 0,
      points: clean,
    })
  }

  function addPoint(x, y) {
    const point = { id: genId(), x, y, title: '', body: '' }
    setPoints((prev) => [...prev, point])
    setSelectedId(point.id)
  }

  function updatePoint(id, field, val) {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Explore the Cell"
          required
        />
      </div>

      <div>
        <label className={LABEL}>Intro (optional)</label>
        <textarea
          className={INPUT + ' resize-none'}
          rows={2}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="A sentence telling students what to explore"
        />
      </div>

      <ImagePicker value={image} onChange={setImage} lessonId={lessonId} label="Image" />

      {image && (
        <div>
          <label className={LABEL}>Image Alt Text</label>
          <input
            className={INPUT}
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </div>
      )}

      <ImagePointEditor
        image={image}
        items={points}
        mode="point"
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddAt={addPoint}
      />

      {points.length > 0 && (
        <div>
          <label className={LABEL}>Markers</label>
          <div className="space-y-3">
            {points.map((p, i) => (
              <div
                key={p.id}
                onFocus={() => setSelectedId(p.id)}
                className={`space-y-2 rounded-xl border p-3 transition-colors ${
                  p.id === selectedId
                    ? 'border-primary-300 bg-primary-50/60 dark:border-primary-600/50 dark:bg-primary-700/20'
                    : 'border-orange-100 bg-orange-50/50 dark:border-stone-700 dark:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-200 text-xs font-black text-stone-700 dark:bg-accent-700/40 dark:text-stone-200">
                    {i + 1}
                  </span>
                  <input
                    className={INPUT + ' flex-1'}
                    value={p.title}
                    onChange={(e) => updatePoint(p.id, 'title', e.target.value)}
                    placeholder="Marker title"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPoints(points.filter((x) => x.id !== p.id))}
                    className="p-2 text-stone-400 transition-colors hover:text-red-500"
                    aria-label={`Remove marker ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  className={INPUT + ' resize-none'}
                  rows={2}
                  value={p.body}
                  onChange={(e) => updatePoint(p.id, 'body', e.target.value)}
                  placeholder="What students learn when they tap this marker"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={LABEL}>X %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      className={INPUT}
                      value={p.x}
                      onChange={(e) => updatePoint(p.id, 'x', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Y %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      className={INPUT}
                      value={p.y}
                      onChange={(e) => updatePoint(p.id, 'y', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className={LABEL}>XP for completing this (0 = none)</label>
        <input
          type="number"
          min={0}
          className={INPUT}
          value={xp}
          onChange={(e) => setXp(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
        >
          Save Section
        </button>
      </div>
    </form>
  )
}
