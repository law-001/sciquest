import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `qc-${Date.now()}-${Math.random().toString(36).slice(2)}`

const blankQuestion = () => ({
  id: genId(),
  prompt: '',
  options: ['', ''],
  correctIndex: 0,
  explanation: '',
})

export default function QuickCheckForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [xp, setXp] = useState(initialData?.xp ?? 0)
  const [questions, setQuestions] = useState(
    initialData?.questions?.length ? initialData.questions : [blankQuestion()],
  )

  function handleSubmit(e) {
    e.preventDefault()
    // Drop empty options, then re-point correctIndex at the same option text it
    // had selected — otherwise removing a blank above it silently moves the answer.
    const clean = questions
      .filter((q) => q.prompt.trim())
      .map((q) => {
        const correctText = q.options[q.correctIndex]
        const options = q.options.filter((o) => o.trim())
        return {
          id: q.id || genId(),
          prompt: q.prompt.trim(),
          options,
          correctIndex: Math.max(0, options.indexOf(correctText)),
          explanation: q.explanation?.trim() || undefined,
        }
      })
      .filter((q) => q.options.length >= 2)

    onSubmit(heading, {
      intro: intro.trim() || undefined,
      xp: Number(xp) || 0,
      questions: clean,
    })
  }

  function updateQuestion(qi, field, val) {
    setQuestions(questions.map((q, i) => (i === qi ? { ...q, [field]: val } : q)))
  }

  function updateOption(qi, oi, val) {
    setQuestions(
      questions.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) } : q,
      ),
    )
  }

  function addOption(qi) {
    setQuestions(
      questions.map((q, i) => (i === qi ? { ...q, options: [...q.options, ''] } : q)),
    )
  }

  function removeOption(qi, oi) {
    setQuestions(
      questions.map((q, i) => {
        if (i !== qi || q.options.length <= 2) return q
        const options = q.options.filter((_, j) => j !== oi)
        // Keep the marked answer pointing at the same option after the splice.
        let correctIndex = q.correctIndex
        if (oi === q.correctIndex) correctIndex = 0
        else if (oi < q.correctIndex) correctIndex -= 1
        return { ...q, options, correctIndex }
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Check Your Understanding"
          required
        />
      </div>

      <div>
        <label className={LABEL}>Intro (optional)</label>
        <textarea
          className={INPUT + ' resize-none'}
          rows={2}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="A sentence framing the questions"
        />
      </div>

      <div>
        <label className={LABEL}>Questions</label>
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div
              key={q.id ?? qi}
              className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3 dark:border-stone-700 dark:bg-stone-800/50"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-xs font-black text-stone-700 dark:bg-secondary-700/40 dark:text-stone-200">
                  {qi + 1}
                </span>
                <input
                  className={INPUT + ' flex-1'}
                  value={q.prompt}
                  onChange={(e) => updateQuestion(qi, 'prompt', e.target.value)}
                  placeholder="Question"
                  required
                />
                <button
                  type="button"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qi))}
                  disabled={questions.length === 1}
                  className="p-2 text-stone-400 transition-colors hover:text-red-500 disabled:opacity-30"
                  aria-label={`Remove question ${qi + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 pl-8">
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  Select the radio button next to the correct answer
                </p>
                {q.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id ?? qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                      className="h-4 w-4 shrink-0 accent-teal-500"
                      aria-label={`Mark option ${oi + 1} correct`}
                    />
                    <input
                      className={INPUT + ' flex-1'}
                      value={o}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qi, oi)}
                      disabled={q.options.length <= 2}
                      className="p-2 text-stone-400 transition-colors hover:text-red-500 disabled:opacity-30"
                      aria-label={`Remove option ${oi + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qi)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Option
                </button>
              </div>

              <div className="pl-8">
                <input
                  className={INPUT}
                  value={q.explanation ?? ''}
                  onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                  placeholder="Explanation shown after a correct answer (optional)"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setQuestions([...questions, blankQuestion()])}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Question
        </button>
      </div>

      <div>
        <label className={LABEL}>XP for completing this (0 = none)</label>
        <input
          type="number"
          min={0}
          className={INPUT}
          value={xp}
          onChange={(e) => setXp(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
        >
          Save Section
        </button>
      </div>
    </form>
  )
}
