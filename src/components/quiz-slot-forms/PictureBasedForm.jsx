import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ImagePicker from '../ImagePicker'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function PictureBasedForm({ initialData, onSubmit, onCancel, lessonId }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '')
  const [options, setOptions] = useState(
    initialData?.options?.length >= 2 ? [...initialData.options] : ['', '', '', '']
  )
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || '')
  const [explanation, setExplanation] = useState(initialData?.explanation || '')

  function handleSubmit(e) {
    e.preventDefault()
    const cleanOpts = options.filter(o => o.trim())
    const answer = cleanOpts.includes(correctAnswer) ? correctAnswer : cleanOpts[0] || ''
    onSubmit({ question, imageUrl, imageAlt, options: cleanOpts, correctAnswer: answer, explanation: explanation.trim() || undefined })
  }

  const cleanOpts = options.filter(o => o.trim())

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImagePicker value={imageUrl} onChange={setImageUrl} lessonId={lessonId} label="Question Image" />

      {imageUrl && (
        <div>
          <label className={LABEL}>Image Alt Text</label>
          <input className={INPUT} value={imageAlt} onChange={e => setImageAlt(e.target.value)}
            placeholder="Describe the image for accessibility" />
        </div>
      )}

      <div>
        <label className={LABEL}>Question <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[80px]'} value={question}
          onChange={e => setQuestion(e.target.value)} placeholder="What is shown in this image?" rows={3} required />
      </div>

      <div>
        <label className={LABEL}>Answer Options <span className="text-red-400">*</span></label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input className={INPUT} value={opt}
                onChange={e => { const next = [...options]; next[i] = e.target.value; setOptions(next) }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`} />
              <button type="button" onClick={() => {
                if (options[i] === correctAnswer) setCorrectAnswer('')
                setOptions(options.filter((_, idx) => idx !== i))
              }} disabled={options.length <= 2}
                className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button type="button" onClick={() => setOptions([...options, ''])}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            <Plus className="w-3.5 h-3.5" /> Add Option
          </button>
        )}
      </div>

      <div>
        <label className={LABEL}>Correct Answer <span className="text-red-400">*</span></label>
        <select className={INPUT} value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} required>
          <option value="">Select correct answer…</option>
          {cleanOpts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
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
