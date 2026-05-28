import React, { useState } from 'react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

function syncBlanks(prev, count) {
  if (count === prev.length) return prev
  if (count > prev.length) return [...prev, ...Array(count - prev.length).fill('')]
  return prev.slice(0, count)
}

export default function FillInTheBlanksForm({ initialData, onSubmit, onCancel }) {
  const [template, setTemplate] = useState(initialData?.question || '')
  const [blanks, setBlanks] = useState(initialData?.blanks || [])
  const [explanation, setExplanation] = useState(initialData?.explanation || '')

  function handleTemplateChange(val) {
    setTemplate(val)
    const count = (val.match(/___/g) || []).length
    setBlanks(prev => syncBlanks(prev, count))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ question: template, blanks, explanation: explanation.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Question Template <span className="text-red-400">*</span></label>
        <p className="text-xs text-stone-400 dark:text-stone-500 mb-1.5">
          Use <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-primary-600 font-mono text-[11px]">___</code> (triple underscore) for each blank
        </p>
        <textarea className={INPUT + ' min-h-[80px]'} value={template}
          onChange={e => handleTemplateChange(e.target.value)}
          placeholder="The ___ is the basic unit of ___ in all living things." rows={3} required />
        <p className="text-xs text-stone-400 mt-1">{blanks.length} blank{blanks.length !== 1 ? 's' : ''} detected</p>
      </div>

      {blanks.length > 0 && (
        <div>
          <label className={LABEL}>Correct Answers</label>
          <div className="space-y-2">
            {blanks.map((blank, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-400 w-14 shrink-0">Blank {i + 1}</span>
                <input className={INPUT} value={blank}
                  onChange={e => {
                    const next = [...blanks]; next[i] = e.target.value; setBlanks(next)
                  }}
                  placeholder={`Answer for blank ${i + 1}…`} required />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className={LABEL}>Explanation <span className="font-normal normal-case text-stone-400">(optional)</span></label>
        <textarea className={INPUT + ' min-h-[60px]'} value={explanation}
          onChange={e => setExplanation(e.target.value)} placeholder="Shown after submission…" rows={2} />
      </div>

      <FormActions onCancel={onCancel} />
    </form>
  )
}

function FormActions({ onCancel }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-stone-700">
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm transition-colors">Save Question</button>
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-stone-700 transition-colors">Cancel</button>
    </div>
  )
}
