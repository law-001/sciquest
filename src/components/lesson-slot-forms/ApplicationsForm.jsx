import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

// Full Tailwind border-left class strings expected by ApplicationsSection
const APP_COLORS = [
  { value: 'border-l-orange-500', label: 'Orange' },
  { value: 'border-l-teal-500', label: 'Teal' },
  { value: 'border-l-yellow-500', label: 'Yellow' },
  { value: 'border-l-blue-500', label: 'Blue' },
  { value: 'border-l-red-500', label: 'Red' },
  { value: 'border-l-green-500', label: 'Green' },
  { value: 'border-l-purple-500', label: 'Purple' },
  { value: 'border-l-stone-500', label: 'Stone' },
]

export default function ApplicationsForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [apps, setApps] = useState(
    initialData?.apps?.length
      ? initialData.apps
      : [{ icon: '🔬', title: '', description: '', color: 'border-l-orange-500' }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, { apps: apps.filter((a) => a.title.trim()) })
  }

  function update(i, field, val) {
    setApps(apps.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)))
  }

  function add() {
    setApps([...apps, { icon: '🔬', title: '', description: '', color: 'border-l-orange-500' }])
  }

  function remove(i) {
    if (apps.length === 1) return
    setApps(apps.filter((_, idx) => idx !== i))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Real-World Applications" required />
      </div>

      <div>
        <label className={LABEL}>Application Cards</label>
        <div className="space-y-3">
          {apps.map((a, i) => (
            <div key={i} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-500">#{i + 1}</span>
                <div className="flex-1 flex gap-2">
                  <input
                    className="w-14 px-2 py-1.5 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                    value={a.icon}
                    onChange={(e) => update(i, 'icon', e.target.value)}
                    placeholder="🔬"
                    maxLength={4}
                    title="Emoji or short symbol"
                  />
                  <input className={INPUT + ' flex-1'} value={a.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Application title" required />
                </div>
                <button type="button" onClick={() => remove(i)} disabled={apps.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <textarea className={INPUT + ' resize-none'} value={a.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Short description of this application" rows={2} />
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Border Color</label>
                <select className={INPUT} value={a.color} onChange={(e) => update(i, 'color', e.target.value)}>
                  {APP_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={add} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Application
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
