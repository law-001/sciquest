import React, { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function OrderingForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [items, setItems] = useState(
    initialData?.items?.length >= 2 ? [...initialData.items] : ['', '', '']
  )

  function move(i, dir) {
    const target = i + dir
    if (target < 0 || target >= items.length) return
    const next = [...items];
    [next[i], next[target]] = [next[target], next[i]]
    setItems(next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const clean = items.filter(item => item.trim())
    onSubmit({ question, items: clean })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Question <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[80px]'} value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Arrange the following steps in the correct order…" rows={3} required />
      </div>

      <div>
        <label className={LABEL}>Items in Correct Order <span className="text-red-400">*</span></label>
        <p className="text-xs text-stone-400 dark:text-stone-500 mb-2">Enter items in the correct order — students will see them shuffled.</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-black text-stone-400 shrink-0">{i + 1}</span>
              <input className={INPUT} value={item}
                onChange={e => { const next = [...items]; next[i] = e.target.value; setItems(next) }}
                placeholder={`Step ${i + 1}…`} required />
              <div className="flex gap-0.5 shrink-0">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-stone-700 disabled:opacity-20 transition-colors">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                  className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-stone-700 disabled:opacity-20 transition-colors">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  disabled={items.length <= 2}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setItems([...items, ''])}
          className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Item
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
