import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function IdentificationForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || '')
  const [acceptedAnswers, setAcceptedAnswers] = useState(initialData?.acceptedAnswers || [])

  function handleSubmit(e) {
    e.preventDefault()
    const cleanAlts = acceptedAnswers.filter(a => a.trim())
    onSubmit({ question, correctAnswer, acceptedAnswers: cleanAlts.length ? cleanAlts : undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Question <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[80px]'} value={question}
          onChange={e => setQuestion(e.target.value)} placeholder="What is being identified?" rows={3} required />
      </div>

      <div>
        <label className={LABEL}>Correct Answer <span className="text-red-400">*</span></label>
        <input className={INPUT} value={correctAnswer}
          onChange={e => setCorrectAnswer(e.target.value)} placeholder="The exact correct answer…" required />
      </div>

      <div>
        <label className={LABEL}>Accepted Alternatives <span className="font-normal normal-case text-stone-400">(optional — other spellings or synonyms)</span></label>
        <div className="space-y-2">
          {acceptedAnswers.map((alt, i) => (
            <div key={i} className="flex gap-2">
              <input className={INPUT} value={alt}
                onChange={e => { const next = [...acceptedAnswers]; next[i] = e.target.value; setAcceptedAnswers(next) }}
                placeholder={`Alternative ${i + 1}`} />
              <button type="button" onClick={() => setAcceptedAnswers(acceptedAnswers.filter((_, idx) => idx !== i))}
                className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setAcceptedAnswers([...acceptedAnswers, ''])}
          className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Alternative
        </button>
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
