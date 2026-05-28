import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors resize-none'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

// Build initial pairing indices from existing correctPairs text-keys
function buildPairingIndices(leftItems, rightItems, correctPairs) {
  return leftItems.map(left => {
    const right = correctPairs?.[left]
    if (!right) return ''
    const idx = rightItems.indexOf(right)
    return idx >= 0 ? String(idx) : ''
  })
}

export default function MatchingForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(
    initialData?.question || 'Match each item in Column A with its correct description in Column B.'
  )
  const [leftItems, setLeftItems] = useState(
    initialData?.leftItems?.length >= 2 ? [...initialData.leftItems] : ['', '']
  )
  const [rightItems, setRightItems] = useState(
    initialData?.rightItems?.length >= 2 ? [...initialData.rightItems] : ['', '']
  )
  const [pairings, setPairings] = useState(() =>
    buildPairingIndices(
      initialData?.leftItems?.length >= 2 ? initialData.leftItems : ['', ''],
      initialData?.rightItems?.length >= 2 ? initialData.rightItems : ['', ''],
      initialData?.correctPairs
    )
  )

  function updateLeft(i, val) {
    const next = [...leftItems]; next[i] = val; setLeftItems(next)
  }
  function updateRight(i, val) {
    const next = [...rightItems]; next[i] = val; setRightItems(next)
  }

  function addLeft() { setLeftItems([...leftItems, '']); setPairings([...pairings, '']) }
  function addRight() { setRightItems([...rightItems, '']) }

  function removeLeft(i) {
    if (leftItems.length <= 2) return
    setLeftItems(leftItems.filter((_, idx) => idx !== i))
    setPairings(pairings.filter((_, idx) => idx !== i))
  }
  function removeRight(i) {
    if (rightItems.length <= 2) return
    setRightItems(rightItems.filter((_, idx) => idx !== i))
    setPairings(pairings.map(p => (p === String(i) ? '' : p > String(i) ? String(Number(p) - 1) : p)))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const correctPairs = {}
    leftItems.forEach((left, i) => {
      const rightIdx = Number(pairings[i])
      if (!isNaN(rightIdx) && pairings[i] !== '' && rightItems[rightIdx]) {
        correctPairs[left] = rightItems[rightIdx]
      }
    })
    onSubmit({ question, leftItems, rightItems, correctPairs })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Instruction <span className="text-red-400">*</span></label>
        <textarea className={INPUT + ' min-h-[60px]'} value={question}
          onChange={e => setQuestion(e.target.value)} rows={2} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Column A (left)</label>
          <div className="space-y-2">
            {leftItems.map((item, i) => (
              <div key={i} className="flex gap-1">
                <input className={INPUT} value={item} onChange={e => updateLeft(i, e.target.value)}
                  placeholder={`A${i + 1}`} required />
                <button type="button" onClick={() => removeLeft(i)} disabled={leftItems.length <= 2}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addLeft}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div>
          <label className={LABEL}>Column B (right)</label>
          <div className="space-y-2">
            {rightItems.map((item, i) => (
              <div key={i} className="flex gap-1">
                <input className={INPUT} value={item} onChange={e => updateRight(i, e.target.value)}
                  placeholder={`B${i + 1}`} required />
                <button type="button" onClick={() => removeRight(i)} disabled={rightItems.length <= 2}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addRight}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      <div>
        <label className={LABEL}>Correct Pairings</label>
        <div className="space-y-2">
          {leftItems.map((left, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 min-w-0 flex-1 truncate">{left || `A${i + 1}`}</span>
              <span className="text-stone-300 shrink-0">→</span>
              <select className="flex-1 px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={pairings[i] ?? ''}
                onChange={e => { const next = [...pairings]; next[i] = e.target.value; setPairings(next) }}>
                <option value="">Select match…</option>
                {rightItems.map((right, j) => (
                  <option key={j} value={String(j)}>{right || `B${j + 1}`}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
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
