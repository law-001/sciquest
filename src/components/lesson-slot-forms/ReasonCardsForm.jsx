import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ColorPicker from './_ColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function ReasonCardsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [reasons, setReasons] = useState(
    initialData?.reasons?.length
      ? initialData.reasons
      : [{ num: 1, title: '', desc: '', content: '', color: 'primary' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = reasons.filter((r) => r.title.trim()).map((r, i) => ({ ...r, num: i + 1 }))
    onSubmit(heading, { intro: intro.trim() || undefined, reasons: clean })
  }

  function updateReason(i, field, val) {
    setReasons(reasons.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)))
  }

  function addReason() {
    setReasons([...reasons, { num: reasons.length + 1, title: '', desc: '', content: '', color: 'primary' }])
  }

  function removeReason(i) {
    if (reasons.length === 1) return
    setReasons(reasons.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Why Use Models?" required />
      </div>
      <div>
        <label className={LABEL}>Intro Text <span className="normal-case font-normal text-stone-400">(optional)</span></label>
        <textarea className={INPUT + ' resize-none min-h-[60px]'} value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} placeholder="Sentence before the cards" />
      </div>

      <div>
        <label className={LABEL}>Reason Cards</label>
        <div className="space-y-3">
          {reasons.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-xs font-black text-accent-700 shrink-0">{i + 1}</span>
                <input className={INPUT + ' flex-1'} value={r.title} onChange={(e) => updateReason(i, 'title', e.target.value)} placeholder="Card title" required />
                <button type="button" onClick={() => removeReason(i)} disabled={reasons.length === 1} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <textarea className={INPUT + ' resize-none'} value={r.desc} onChange={(e) => updateReason(i, 'desc', e.target.value)} placeholder="Short description" rows={2} />
              <textarea className={INPUT + ' resize-none'} value={r.content} onChange={(e) => updateReason(i, 'content', e.target.value)} placeholder="Additional content / example (italic)" rows={2} />
              <ColorPicker value={r.color} onChange={(c) => updateReason(i, 'color', c)} label="Card color" />
            </div>
          ))}
        </div>
        <button type="button" onClick={addReason} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Card
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
