import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ColorPicker from './_ColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function TimelineForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [steps, setSteps] = useState(
    initialData?.steps?.length
      ? initialData.steps
      : [{ num: 1, title: '', description: '', tip: '', color: 'primary' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = steps.filter((s) => s.title.trim()).map((s, i) => ({ ...s, num: i + 1 }))
    onSubmit(heading, { intro: intro.trim() || undefined, steps: clean })
  }

  function update(i, field, val) {
    setSteps(steps.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)))
  }

  function add() {
    setSteps([...steps, { num: steps.length + 1, title: '', description: '', tip: '', color: 'primary' }])
  }

  function remove(i) {
    if (steps.length === 1) return
    setSteps(steps.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Steps of the Scientific Method" required />
      </div>
      <div>
        <label className={LABEL}>Intro Text <span className="normal-case font-normal text-stone-400">(optional)</span></label>
        <textarea className={INPUT + ' resize-none'} value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} placeholder="Optional sentence before the timeline" />
      </div>

      <div>
        <label className={LABEL}>Timeline Steps</label>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-black text-primary-700 shrink-0">{i + 1}</span>
                <input className={INPUT + ' flex-1'} value={s.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Step title" required />
                <button type="button" onClick={() => remove(i)} disabled={steps.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <textarea className={INPUT + ' resize-none'} value={s.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Step description" rows={2} required />
              <input className={INPUT} value={s.tip} onChange={(e) => update(i, 'tip', e.target.value)} placeholder="Tip (optional) — e.g. Remember to record your observations" />
              <ColorPicker value={s.color} onChange={(c) => update(i, 'color', c)} label="Step color" />
            </div>
          ))}
        </div>
        <button type="button" onClick={add} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Step
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
