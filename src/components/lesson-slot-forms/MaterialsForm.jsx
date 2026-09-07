import React, { useState } from 'react'

import { useLessonsData } from '../../context/LessonsDataContext'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function MaterialsForm({
  initialHeading,
  initialData,
  lessonId,
  onSubmit,
  onCancel,
}) {
  const { getMaterials } = useLessonsData()
  const available = getMaterials(lessonId)

  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [materialIds, setMaterialIds] = useState(initialData?.materialIds ?? [])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, { intro: intro.trim() || undefined, materialIds })
  }

  function toggle(id) {
    setMaterialIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
          placeholder="e.g. Watch This First"
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
          placeholder="A sentence introducing these materials"
        />
      </div>

      <div>
        <label className={LABEL}>Which materials to show</label>
        {available.length === 0 ? (
          <p className="rounded-xl border border-dashed border-orange-200 p-4 text-sm font-medium text-stone-500 dark:border-stone-600 dark:text-stone-400">
            No materials attached to this lesson yet. Add them in the Lesson Materials
            panel on the editor page, then come back here to pick which ones appear.
          </p>
        ) : (
          <>
            <p className="mb-2 text-xs text-stone-400">
              Select none to show every material attached to this lesson.
            </p>
            <div className="space-y-2">
              {available.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-100 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
                >
                  <input
                    type="checkbox"
                    checked={materialIds.includes(m.id)}
                    onChange={() => toggle(m.id)}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-stone-800 dark:text-stone-100">
                      {m.title}
                    </span>
                    <span className="block text-xs text-stone-400">
                      {m.kind.toUpperCase()}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
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
