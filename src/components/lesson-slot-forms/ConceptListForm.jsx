import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function ConceptListForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [concepts, setConcepts] = useState(
    initialData?.concepts?.length ? initialData.concepts : [''],
  )

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, { concepts: concepts.filter((c) => c.trim()) })
  }

  function update(i, val) {
    setConcepts(concepts.map((c, idx) => (idx === i ? val : c)))
  }

  function add() { setConcepts([...concepts, '']) }

  function remove(i) {
    if (concepts.length === 1) return
    setConcepts(concepts.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Types of Conceptual Models" required />
      </div>

      <div>
        <label className={LABEL}>Concepts</label>
        <div className="space-y-2">
          {concepts.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-6 h-6 rounded-full bg-secondary-200 dark:bg-secondary-700/40 flex items-center justify-center text-xs font-black text-stone-700 dark:text-stone-200 shrink-0">{i + 1}</span>
              <textarea
                className={INPUT + ' resize-none min-h-[52px]'}
                value={c}
                onChange={(e) => update(i, e.target.value)}
                placeholder={`Concept ${i + 1}`}
                rows={2}
                required
              />
              <button type="button" onClick={() => remove(i)} disabled={concepts.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={add} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Concept
        </button>
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
