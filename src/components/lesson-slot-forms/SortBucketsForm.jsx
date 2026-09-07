import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import ThemeColorPicker from './_ThemeColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

const genId = (prefix) =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`

export default function SortBucketsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [xp, setXp] = useState(initialData?.xp ?? 0)
  const [buckets, setBuckets] = useState(
    initialData?.buckets?.length
      ? initialData.buckets
      : [
          { id: genId('b'), label: '', color: 'primary' },
          { id: genId('b'), label: '', color: 'secondary' },
        ],
  )
  const [items, setItems] = useState(initialData?.items ?? [])

  function handleSubmit(e) {
    e.preventDefault()
    const cleanBuckets = buckets.filter((b) => b.label.trim())
    const bucketIds = new Set(cleanBuckets.map((b) => b.id))
    // Drop items whose category was deleted — otherwise they'd be unsolvable.
    const cleanItems = items.filter((it) => it.text.trim() && bucketIds.has(it.bucketId))
    onSubmit(heading, {
      intro: intro.trim() || undefined,
      xp: Number(xp) || 0,
      buckets: cleanBuckets,
      items: cleanItems,
    })
  }

  function updateBucket(id, field, val) {
    setBuckets(buckets.map((b) => (b.id === id ? { ...b, [field]: val } : b)))
  }

  function updateItem(id, field, val) {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: val } : it)))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Sort the Organisms"
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
          placeholder="A sentence telling students how to sort"
        />
      </div>

      <div>
        <label className={LABEL}>Categories</label>
        <div className="space-y-3">
          {buckets.map((b, i) => (
            <div
              key={b.id}
              className="space-y-2 rounded-xl border border-orange-100 bg-orange-50/50 p-3 dark:border-stone-700 dark:bg-stone-800/50"
            >
              <div className="flex items-center gap-2">
                <input
                  className={INPUT + ' flex-1'}
                  value={b.label}
                  onChange={(e) => updateBucket(b.id, 'label', e.target.value)}
                  placeholder={`Category ${i + 1} name`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setBuckets(buckets.filter((x) => x.id !== b.id))}
                  disabled={buckets.length <= 2}
                  className="p-2 text-stone-400 transition-colors hover:text-red-500 disabled:opacity-30"
                  aria-label={`Remove category ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ThemeColorPicker
                label="Category color"
                value={b.color}
                onChange={(v) => updateBucket(b.id, 'color', v)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setBuckets([...buckets, { id: genId('b'), label: '', color: 'accent' }])
          }
          disabled={buckets.length >= 4}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 disabled:opacity-40 dark:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      <div>
        <label className={LABEL}>Items to sort</label>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={it.id} className="flex items-center gap-2">
              <input
                className={INPUT + ' flex-1'}
                value={it.text}
                onChange={(e) => updateItem(it.id, 'text', e.target.value)}
                placeholder={`Item ${i + 1}`}
                required
              />
              <select
                className={INPUT + ' w-40'}
                value={it.bucketId}
                onChange={(e) => updateItem(it.id, 'bucketId', e.target.value)}
                aria-label={`Correct category for item ${i + 1}`}
              >
                <option value="">Belongs to…</option>
                {buckets.map((b, bi) => (
                  <option key={b.id} value={b.id}>
                    {b.label || `Category ${bi + 1}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setItems(items.filter((x) => x.id !== it.id))}
                className="p-2 text-stone-400 transition-colors hover:text-red-500"
                aria-label={`Remove item ${i + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setItems([...items, { id: genId('i'), text: '', bucketId: buckets[0]?.id ?? '' }])
          }
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

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
