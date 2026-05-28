import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function ScenarioForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [scenarios, setScenarios] = useState(
    initialData?.scenarios?.length
      ? initialData.scenarios
      : [{ title: '', situation: '', question: '', skill: '' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, { intro: intro.trim() || undefined, scenarios: scenarios.filter((s) => s.title.trim()) })
  }

  function update(i, field, val) {
    setScenarios(scenarios.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)))
  }

  function add() {
    setScenarios([...scenarios, { title: '', situation: '', question: '', skill: '' }])
  }

  function remove(i) {
    if (scenarios.length === 1) return
    setScenarios(scenarios.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Real-World Scenarios" required />
      </div>
      <div>
        <label className={LABEL}>Intro Text <span className="normal-case font-normal text-stone-400">(optional)</span></label>
        <textarea className={INPUT + ' resize-none'} value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} placeholder="Optional sentence before the scenarios" />
      </div>

      <div>
        <label className={LABEL}>Scenarios</label>
        <div className="space-y-4">
          {scenarios.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Scenario {i + 1}</span>
                <button type="button" onClick={() => remove(i)} disabled={scenarios.length === 1} className="ml-auto p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div>
                <label className={LABEL}>Title</label>
                <input className={INPUT} value={s.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Scenario title" required />
              </div>
              <div>
                <label className={LABEL}>Situation</label>
                <textarea className={INPUT + ' resize-none'} value={s.situation} onChange={(e) => update(i, 'situation', e.target.value)} placeholder="Describe the real-world situation" rows={3} />
              </div>
              <div>
                <label className={LABEL}>Think About It Question</label>
                <textarea className={INPUT + ' resize-none'} value={s.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="What question should students think about?" rows={2} />
              </div>
              <div>
                <label className={LABEL}>Skill Used</label>
                <input className={INPUT} value={s.skill} onChange={(e) => update(i, 'skill', e.target.value)} placeholder="e.g. Observation, Inference, Classification" />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={add} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Scenario
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
