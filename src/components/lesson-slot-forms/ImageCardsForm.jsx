import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ColorPicker from './_ColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'
const BADGE_VARIANTS = ['primary', 'secondary', 'accent', 'outline']

export default function ImageCardsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [cards, setCards] = useState(
    initialData?.cards?.length
      ? initialData.cards
      : [{ image: '', imageAlt: '', label: 'Example', variant: 'primary', title: '', desc: '', examples: [''], color: 'primary' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = cards.filter((c) => c.title.trim()).map((c) => ({
      ...c,
      examples: c.examples.filter((ex) => ex.trim()),
    }))
    onSubmit(heading, { cards: clean })
  }

  function updateCard(i, field, val) {
    setCards(cards.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)))
  }

  function updateExample(cardIdx, exIdx, val) {
    const next = cards.map((c, ci) => {
      if (ci !== cardIdx) return c
      const exs = c.examples.map((e, ei) => (ei === exIdx ? val : e))
      return { ...c, examples: exs }
    })
    setCards(next)
  }

  function addExample(cardIdx) {
    setCards(cards.map((c, ci) => ci === cardIdx ? { ...c, examples: [...c.examples, ''] } : c))
  }

  function removeExample(cardIdx, exIdx) {
    setCards(cards.map((c, ci) => {
      if (ci !== cardIdx) return c
      const exs = c.examples.filter((_, ei) => ei !== exIdx)
      return { ...c, examples: exs.length ? exs : [''] }
    }))
  }

  function addCard() {
    setCards([...cards, { image: '', imageAlt: '', label: 'Example', variant: 'primary', title: '', desc: '', examples: [''], color: 'primary' }])
  }

  function removeCard(i) {
    if (cards.length === 1) return
    setCards(cards.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Types of Scientific Models" required />
      </div>

      <div>
        <label className={LABEL}>Image Cards</label>
        <div className="space-y-4">
          {cards.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Card {i + 1}</span>
                <button type="button" onClick={() => removeCard(i)} disabled={cards.length === 1} className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>

              <div>
                <label className={LABEL}>Image URL</label>
                <input className={INPUT} value={c.image} onChange={(e) => updateCard(i, 'image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={LABEL}>Image Alt</label>
                  <input className={INPUT} value={c.imageAlt} onChange={(e) => updateCard(i, 'imageAlt', e.target.value)} placeholder="Alt text" />
                </div>
                <div>
                  <label className={LABEL}>Badge Label</label>
                  <input className={INPUT} value={c.label} onChange={(e) => updateCard(i, 'label', e.target.value)} placeholder="e.g. Physical Model" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={LABEL}>Badge Variant</label>
                  <select className={INPUT} value={c.variant} onChange={(e) => updateCard(i, 'variant', e.target.value)}>
                    {BADGE_VARIANTS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <ColorPicker value={c.color} onChange={(col) => updateCard(i, 'color', col)} label="Bullet Color" />
              </div>
              <div>
                <label className={LABEL}>Title</label>
                <input className={INPUT} value={c.title} onChange={(e) => updateCard(i, 'title', e.target.value)} placeholder="Card title" required />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea className={INPUT + ' resize-none'} value={c.desc} onChange={(e) => updateCard(i, 'desc', e.target.value)} placeholder="Short description" rows={2} />
              </div>
              <div>
                <label className={LABEL}>Examples</label>
                {c.examples.map((ex, ei) => (
                  <div key={ei} className="flex gap-2 mb-1.5">
                    <input className={INPUT} value={ex} onChange={(e) => updateExample(i, ei, e.target.value)} placeholder={`Example ${ei + 1}`} />
                    <button type="button" onClick={() => removeExample(i, ei)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addExample(i)} className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Example</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addCard} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400"><Plus className="w-3.5 h-3.5" /> Add Card</button>
      </div>

      <FormActions onCancel={onCancel} />
    </form>
  )
}

function FormActions({ onCancel }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-stone-700">
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors">Save Section</button>
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors">Cancel</button>
    </div>
  )
}
