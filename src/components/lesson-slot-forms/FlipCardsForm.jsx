import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import ThemeColorPicker from './_ThemeColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function FlipCardsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [xp, setXp] = useState(initialData?.xp ?? 0)
  const [cards, setCards] = useState(
    initialData?.cards?.length
      ? initialData.cards
      : [{ front: '', back: '', color: 'primary' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = cards.filter((c) => c.front.trim() && c.back.trim())
    onSubmit(heading, {
      intro: intro.trim() || undefined,
      xp: Number(xp) || 0,
      cards: clean,
    })
  }

  function updateCard(i, field, val) {
    setCards(cards.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))
  }

  function addCard() {
    setCards([...cards, { front: '', back: '', color: 'primary' }])
  }

  function removeCard(i) {
    if (cards.length === 1) return
    setCards(cards.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Review the Key Terms"
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
          placeholder="A sentence telling students what to do"
        />
      </div>

      <div>
        <label className={LABEL}>Cards</label>
        <div className="space-y-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border border-orange-100 bg-orange-50/50 p-3 dark:border-stone-700 dark:bg-stone-800/50"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-xs font-black text-stone-700 dark:bg-secondary-700/40 dark:text-stone-200">
                  {i + 1}
                </span>
                <input
                  className={INPUT + ' flex-1'}
                  value={c.front}
                  onChange={(e) => updateCard(i, 'front', e.target.value)}
                  placeholder="Front — the term or question"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeCard(i)}
                  disabled={cards.length === 1}
                  className="p-2 text-stone-400 transition-colors hover:text-red-500 disabled:opacity-30"
                  aria-label={`Remove card ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                className={INPUT + ' resize-none'}
                rows={2}
                value={c.back}
                onChange={(e) => updateCard(i, 'back', e.target.value)}
                placeholder="Back — the definition or answer"
                required
              />
              <ThemeColorPicker
                label="Card color"
                value={c.color}
                onChange={(v) => updateCard(i, 'color', v)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCard}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Card
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
