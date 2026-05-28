import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'
const SUB_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True / False' },
  { value: 'short-answer', label: 'Short Answer' },
]

function newSubQuestion(type) {
  const base = { id: `sq-${Date.now()}-${Math.random().toString(36).slice(2)}`, type, question: '' }
  if (type === 'multiple-choice') return { ...base, options: ['', '', '', ''], correctAnswer: '' }
  if (type === 'true-false') return { ...base, correctAnswer: true }
  return base
}

function SubQuestionEditor({ sub, index, onChange, onRemove }) {
  function updateField(field, val) { onChange({ ...sub, [field]: val }) }

  function updateOption(i, val) {
    const next = [...(sub.options || [])]
    next[i] = val
    updateField('options', next)
  }

  return (
    <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-orange-100 dark:border-stone-700 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className="text-xs font-black text-primary-600 dark:text-primary-400 shrink-0">#{index + 1}</span>
          <select
            className="px-2 py-1 rounded-lg border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 focus:outline-none"
            value={sub.type} onChange={e => onChange(newSubQuestion(e.target.value))}
          >
            {SUB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button type="button" onClick={onRemove}
          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Question Text</label>
        <textarea className={INPUT + ' min-h-[60px]'} value={sub.question}
          onChange={e => updateField('question', e.target.value)} placeholder="Sub-question…" rows={2} required />
      </div>

      {sub.type === 'multiple-choice' && (
        <>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Options</label>
            <div className="space-y-1">
              {(sub.options || ['', '', '', '']).map((opt, i) => (
                <input key={i} className={INPUT} value={opt}
                  onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Correct Answer</label>
            <select className={INPUT} value={sub.correctAnswer || ''}
              onChange={e => updateField('correctAnswer', e.target.value)}>
              <option value="">Select…</option>
              {(sub.options || []).filter(o => o.trim()).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </>
      )}

      {sub.type === 'true-false' && (
        <div>
          <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Correct Answer</label>
          <div className="flex gap-2">
            {[{ val: true, label: 'True' }, { val: false, label: 'False' }].map(({ val, label }) => (
              <button key={label} type="button" onClick={() => updateField('correctAnswer', val)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  sub.correctAnswer === val
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-orange-200 dark:border-stone-600 text-stone-500 hover:border-primary-300'
                }`}>{label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CaseStudyForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [scenario, setScenario] = useState(initialData?.scenario || '')
  const [subQuestions, setSubQuestions] = useState(
    initialData?.subQuestions?.length ? JSON.parse(JSON.stringify(initialData.subQuestions)) : []
  )

  function addSubQuestion() {
    setSubQuestions([...subQuestions, newSubQuestion('multiple-choice')])
  }

  function updateSub(i, updated) {
    const next = [...subQuestions]; next[i] = updated; setSubQuestions(next)
  }

  function removeSub(i) {
    setSubQuestions(subQuestions.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ question, scenario, subQuestions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Overall Question / Prompt</label>
        <textarea className={INPUT + ' min-h-[60px]'} value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Read the scenario and answer the questions below." rows={2} />
      </div>

      <div>
        <label className={LABEL}>Scenario Text <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[120px]'} value={scenario}
          onChange={e => setScenario(e.target.value)}
          placeholder="Describe the real-world situation students will analyze…" rows={5} required />
      </div>

      <div>
        <label className={LABEL}>Sub-Questions ({subQuestions.length})</label>
        <div className="space-y-3">
          {subQuestions.map((sub, i) => (
            <SubQuestionEditor key={sub.id || i} sub={sub} index={i}
              onChange={updated => updateSub(i, updated)} onRemove={() => removeSub(i)} />
          ))}
        </div>
        <button type="button" onClick={addSubQuestion}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Sub-Question
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
