import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ColorPicker from './_ColorPicker'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function DiagramForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [nodes, setNodes] = useState(
    initialData?.nodes?.length
      ? initialData.nodes
      : [{ id: 'node-1', label: '', color: 'primary', connects: [] }],
  )

  function handleSubmit(e) {
    e.preventDefault()
    const clean = nodes.filter((n) => n.label.trim())
    onSubmit(heading, { title: title.trim() || undefined, description: description.trim() || undefined, nodes: clean })
  }

  function update(i, field, val) {
    setNodes(nodes.map((n, idx) => (idx === i ? { ...n, [field]: val } : n)))
  }

  function toggleConnect(nodeIdx, targetId) {
    setNodes(nodes.map((n, idx) => {
      if (idx !== nodeIdx) return n
      const connects = n.connects.includes(targetId)
        ? n.connects.filter((id) => id !== targetId)
        : [...n.connects, targetId]
      return { ...n, connects }
    }))
  }

  function addNode() {
    const id = `node-${Date.now()}`
    setNodes([...nodes, { id, label: '', color: 'primary', connects: [] }])
  }

  function removeNode(i) {
    if (nodes.length === 1) return
    const removedId = nodes[i].id
    const filtered = nodes.filter((_, idx) => idx !== i).map((n) => ({
      ...n,
      connects: n.connects.filter((id) => id !== removedId),
    }))
    setNodes(filtered)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input className={INPUT} value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Model Relationships" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Diagram Title <span className="normal-case font-normal text-stone-400">(optional)</span></label>
          <input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Diagram heading" />
        </div>
        <div>
          <label className={LABEL}>Description <span className="normal-case font-normal text-stone-400">(optional)</span></label>
          <input className={INPUT} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </div>
      </div>

      <div>
        <label className={LABEL}>Nodes</label>
        <div className="space-y-3">
          {nodes.map((n, i) => (
            <div key={n.id} className="p-4 rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/40 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <input className={INPUT + ' flex-1'} value={n.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Node label" required />
                <button type="button" onClick={() => removeNode(i)} disabled={nodes.length === 1} className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <ColorPicker value={n.color} onChange={(c) => update(i, 'color', c)} label="Node color" />
              {nodes.length > 1 && (
                <div>
                  <p className={LABEL}>Connects to</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nodes.filter((_, idx) => idx !== i).map((target) => (
                      <label key={target.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={n.connects.includes(target.id)}
                          onChange={() => toggleConnect(i, target.id)}
                          className="rounded"
                        />
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          {target.label || `Node ${nodes.indexOf(target) + 1}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addNode} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Plus className="w-3.5 h-3.5" /> Add Node
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
