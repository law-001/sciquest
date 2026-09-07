import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import ImagePicker from '../ImagePicker'
import ImagePointEditor from './_ImagePointEditor'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

const DEFAULT_ZONE_W = 18
const DEFAULT_ZONE_H = 8

const genId = (prefix) =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`

export default function DragLabelForm({
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
  const [labels, setLabels] = useState(initialData?.labels ?? [])
  const [zones, setZones] = useState(initialData?.zones ?? [])
  const [selectedId, setSelectedId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const cleanLabels = labels.filter((l) => l.text.trim())
    const labelIds = new Set(cleanLabels.map((l) => l.id))
    // A zone whose answer label was deleted can never be solved, so drop it.
    const cleanZones = zones.filter((z) => labelIds.has(z.labelId))
    onSubmit(heading, {
      intro: intro.trim() || undefined,
      image,
      imageAlt,
      xp: Number(xp) || 0,
      labels: cleanLabels,
      zones: cleanZones,
    })
  }

  function addZone(x, y) {
    const zone = {
      id: genId('z'),
      // Click point is the centre of the new box, clamped inside the image.
      x: Math.min(100 - DEFAULT_ZONE_W, Math.max(0, x - DEFAULT_ZONE_W / 2)),
      y: Math.min(100 - DEFAULT_ZONE_H, Math.max(0, y - DEFAULT_ZONE_H / 2)),
      w: DEFAULT_ZONE_W,
      h: DEFAULT_ZONE_H,
      labelId: '',
    }
    setZones((prev) => [...prev, zone])
    setSelectedId(zone.id)
  }

  function updateZone(id, field, val) {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, [field]: val } : z)))
  }

  const labelTextFor = (labelId) => labels.find((l) => l.id === labelId)?.text ?? ''

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Label the Diagram"
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
          placeholder="A sentence telling students what to label"
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

      {/* Labels come first: a zone needs an existing label to point at. */}
      <div>
        <label className={LABEL}>Labels</label>
        <div className="space-y-2">
          {labels.map((l, i) => (
            <div key={l.id} className="flex items-center gap-2">
              <input
                className={INPUT + ' flex-1'}
                value={l.text}
                onChange={(e) =>
                  setLabels(labels.map((x) => (x.id === l.id ? { ...x, text: e.target.value } : x)))
                }
                placeholder={`Label ${i + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => setLabels(labels.filter((x) => x.id !== l.id))}
                className="p-2 text-stone-400 transition-colors hover:text-red-500"
                aria-label={`Remove label ${i + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLabels([...labels, { id: genId('l'), text: '' }])}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Label
        </button>
      </div>

      <ImagePointEditor
        image={image}
        items={zones}
        mode="zone"
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddAt={addZone}
        labelFor={(z) => labelTextFor(z.labelId)}
      />

      {zones.length > 0 && (
        <div>
          <label className={LABEL}>Drop Zones</label>
          <div className="space-y-3">
            {zones.map((z, i) => (
              <div
                key={z.id}
                onFocus={() => setSelectedId(z.id)}
                className={`space-y-2 rounded-xl border p-3 transition-colors ${
                  z.id === selectedId
                    ? 'border-primary-300 bg-primary-50/60 dark:border-primary-600/50 dark:bg-primary-700/20'
                    : 'border-orange-100 bg-orange-50/50 dark:border-stone-700 dark:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-xs font-black text-stone-700 dark:bg-secondary-700/40 dark:text-stone-200">
                    {i + 1}
                  </span>
                  <select
                    className={INPUT + ' flex-1'}
                    value={z.labelId}
                    onChange={(e) => updateZone(z.id, 'labelId', e.target.value)}
                    aria-label={`Correct label for zone ${i + 1}`}
                    required
                  >
                    <option value="">Correct label…</option>
                    {labels.map((l, li) => (
                      <option key={l.id} value={l.id}>
                        {l.text || `Label ${li + 1}`}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setZones(zones.filter((x) => x.id !== z.id))}
                    className="p-2 text-stone-400 transition-colors hover:text-red-500"
                    aria-label={`Remove zone ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['x', 'y', 'w', 'h'].map((field) => (
                    <div key={field}>
                      <label className={LABEL}>{field.toUpperCase()} %</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        className={INPUT}
                        value={z[field]}
                        onChange={(e) => updateZone(z.id, field, Number(e.target.value))}
                      />
                    </div>
                  ))}
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
