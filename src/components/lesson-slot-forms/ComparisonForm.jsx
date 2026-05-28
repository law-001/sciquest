import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ColorPicker from './_ColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

function ColumnEditor({ side, value, onChange }) {
  function updateItem(i, val) {
    const items = value.items.map((it, idx) => (idx === i ? val : it))
    onChange({ ...value, items })
  }
  function addItem() { onChange({ ...value, items: [...value.items, ''] }) }
  function removeItem(i) {
    if (value.items.length === 1) return
    onChange({ ...value, items: value.items.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-3">
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">{side} Column</p>
      <div>
        <label className={LABEL}>Column Label</label>
        <input className={INPUT} value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} placeholder={`e.g. ${side === 'Left' ? 'Advantages' : 'Disadvantages'}`} required />
      </div>
      <ColorPicker value={value.color} onChange={(c) => onChange({ ...value, color: c })} label="Column color" />
      <div>
        <label className={LABEL}>Items</label>
        {value.items.map((item, i) => (
          <div key={i} className="flex gap-2 mb-1.5 items-center">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center text-xs font-black text-stone-600 dark:text-stone-200 shrink-0">{i + 1}</span>
            <input className={INPUT} value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder={`Item ${i + 1}`} required />
            <button type="button" onClick={() => removeItem(i)} disabled={value.items.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add Item</button>
      </div>
    </div>
  )
}

export default function ComparisonForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [left, setLeft] = useState(initialData?.left ?? { label: '', color: 'primary', items: [''] })
  const [right, setRight] = useState(initialData?.right ?? { label: '', color: 'secondary', items: [''] })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, { intro: intro.trim() || undefined, left, right })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Comparing Model Types" required />
      </div>
      <div>
        <label className={LABEL}>Intro Text <span className="normal-case font-normal text-stone-400">(optional)</span></label>
        <textarea className={INPUT + ' resize-none'} value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} placeholder="Optional text before the columns" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ColumnEditor side="Left" value={left} onChange={setLeft} />
        <ColumnEditor side="Right" value={right} onChange={setRight} />
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
