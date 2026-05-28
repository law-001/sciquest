import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function KeyTermsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [terms, setTerms] = useState(
    initialData?.terms?.length ? initialData.terms : [{ term: '', desc: '' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = terms.filter((t) => t.term.trim())
    onSubmit(heading, { terms: clean })
  }

  function updateTerm(i, field, val) {
    const next = terms.map((t, idx) => (idx === i ? { ...t, [field]: val } : t))
    setTerms(next)
  }

  function addTerm() {
    setTerms([...terms, { term: '', desc: '' }])
  }

  function removeTerm(i) {
    if (terms.length === 1) return
    setTerms(terms.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Key Terms" required />
      </div>

      <div>
        <label className={LABEL}>Terms</label>
        <div className="space-y-3">
          {terms.map((t, i) => (
            <div key={i} className="p-3 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/50 dark:bg-stone-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary-200 dark:bg-secondary-700/40 flex items-center justify-center text-xs font-black text-stone-700 dark:text-stone-200 shrink-0">
                  {i + 1}
                </span>
                <input
                  className={INPUT + ' flex-1'}
                  value={t.term}
                  onChange={(e) => updateTerm(i, 'term', e.target.value)}
                  placeholder="Term"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeTerm(i)}
                  disabled={terms.length === 1}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Remove term"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                className={INPUT + ' resize-none min-h-[60px]'}
                value={t.desc}
                onChange={(e) => updateTerm(i, 'desc', e.target.value)}
                placeholder="Definition / description"
                rows={2}
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={addTerm} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Term
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
