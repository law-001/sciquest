import React, { useState } from 'react'

import { CUSTOM_WIDGETS } from '../lesson-slots/interactive/customWidgets'

const INPUT =
  'w-full px-3 py-2 rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors'
const LABEL = 'block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1'

export default function CustomWidgetForm({ initialHeading, initialData, onSubmit, onCancel }) {
  const [heading, setHeading] = useState(initialHeading || '')
  const [intro, setIntro] = useState(initialData?.intro || '')
  const [widgetId, setWidgetId] = useState(initialData?.widgetId || '')
  const [substance, setSubstance] = useState(initialData?.substance || '')
  const [height, setHeight] = useState(initialData?.height ?? '')
  const [xp, setXp] = useState(initialData?.xp ?? 0)

  const options = Object.entries(CUSTOM_WIDGETS)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(heading, {
      widgetId,
      intro: intro.trim() || undefined,
      substance: substance.trim() || undefined,
      height: height === '' ? undefined : Number(height),
      xp: Number(xp) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={LABEL}>Section Heading</label>
        <input
          className={INPUT}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="e.g. Try It Yourself"
          required
        />
      </div>

      <div>
        <label className={LABEL}>Interactive</label>
        {options.length === 0 ? (
          <p className="rounded-xl border border-dashed border-orange-200 p-4 text-sm font-medium text-stone-500 dark:border-stone-600 dark:text-stone-400">
            No custom interactives are installed yet.
          </p>
        ) : (
          <div className="space-y-2">
            {options.map(([id, meta]) => (
              <label
                key={id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
                  widgetId === id
                    ? 'border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-700/20'
                    : 'border-orange-100 bg-white dark:border-stone-700 dark:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="widgetId"
                  value={id}
                  checked={widgetId === id}
                  onChange={() => setWidgetId(id)}
                  className="mt-1 h-4 w-4 accent-orange-500"
                  required
                />
                <span>
                  <span className="block text-sm font-bold text-stone-900 dark:text-white">
                    {meta.label}
                  </span>
                  <span className="block text-xs text-stone-500 dark:text-stone-400">
                    {meta.desc}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={LABEL}>Intro (optional)</label>
        <textarea
          className={INPUT + ' resize-none'}
          rows={2}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="A sentence framing the interactive"
        />
      </div>

      {/* Widget-specific setting. Kept simple on purpose: a widget that needs
          richer configuration should ship its own settings UI. */}
      {widgetId === 'particle-motion' && (
        <div>
          <label className={LABEL}>Substance name</label>
          <input
            className={INPUT}
            value={substance}
            onChange={(e) => setSubstance(e.target.value)}
            placeholder="Water"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Min height in px (optional)</label>
          <input
            type="number"
            min={0}
            className={INPUT}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="auto"
          />
        </div>
        <div>
          <label className={LABEL}>XP for completing (0 = none)</label>
          <input
            type="number"
            min={0}
            className={INPUT}
            value={xp}
            onChange={(e) => setXp(e.target.value)}
          />
        </div>
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
