import React, { useState } from 'react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function TrueFalseForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [correctAnswer, setCorrectAnswer] = useState(
    initialData?.correctAnswer !== undefined ? initialData.correctAnswer : true
  )
  const [explanation, setExplanation] = useState(initialData?.explanation || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ question, correctAnswer, explanation: explanation.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Statement <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[80px]'} value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Write a statement that is either True or False…" rows={3} required />
      </div>

      <div>
        <label className={LABEL}>Correct Answer <span className="text-red-400">*</span></label>
        <div className="flex gap-3">
          {[{ val: true, label: 'True' }, { val: false, label: 'False' }].map(({ val, label }) => (
            <button key={label} type="button" onClick={() => setCorrectAnswer(val)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                correctAnswer === val
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-orange-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-primary-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

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
