import React, { useState } from 'react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function ShortAnswerForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [rubric, setRubric] = useState(initialData?.rubric || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ question, rubric: rubric.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Question <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[80px]'} value={question}
          onChange={e => setQuestion(e.target.value)} placeholder="What is your question?" rows={3} required />
      </div>

      <div>
        <label className={LABEL}>Grading Rubric / Hint <span className="font-normal normal-case text-stone-400">(optional — shown to teacher when grading)</span></label>
        <textarea className={INPUT + ' min-h-[60px]'} value={rubric}
          onChange={e => setRubric(e.target.value)}
          placeholder="Describe what a full-credit answer looks like…" rows={2} />
      </div>

      <div className="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
          Short answer requires manual grading — the teacher reviews and scores each response.
        </p>
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
