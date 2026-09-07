import React, { useState } from 'react'

// Worked example of a custom widget. It receives only `data` (whatever the
// teacher typed into the form) and reports completion through `onSolved`, which
// the host calls once — nothing here knows about lessons, XP or Supabase.
//
// State colors follow the project's visual spec for the game canvas.
const STATES = [
  {
    id: 'solid',
    label: 'Solid',
    range: [0, 32],
    swatch: 'bg-[#A8C8F0]',
    panel: 'border-[#A8C8F0] bg-[#DDEEFF] dark:bg-[#A8C8F0]/20',
    blurb: 'Particles are locked in a fixed pattern. They vibrate in place but cannot swap positions, so the shape and volume stay fixed.',
    spread: 0,
  },
  {
    id: 'liquid',
    label: 'Liquid',
    range: [33, 99],
    swatch: 'bg-[#3BAFA9]',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/20',
    blurb: 'Particles still touch but can slide past one another. Volume stays fixed, and the liquid takes the shape of its container.',
    spread: 1,
  },
  {
    id: 'gas',
    label: 'Gas',
    range: [100, 150],
    swatch: 'bg-stone-300',
    panel: 'border-stone-300 bg-stone-100 dark:bg-stone-700/40',
    blurb: 'Particles have escaped each other entirely and move freely at speed, spreading to fill whatever container they are in.',
    spread: 2,
  },
]

const stateFor = (temp) =>
  STATES.find((s) => temp >= s.range[0] && temp <= s.range[1]) ?? STATES[0]

export default function ParticleMotionWidget({ data, onSolved }) {
  const substance = data?.substance || 'Water'
  const [temp, setTemp] = useState(20)
  const [seen, setSeen] = useState(['solid'])

  const current = stateFor(temp)

  function handleChange(next) {
    setTemp(next)
    const stateId = stateFor(next).id
    setSeen((prev) => {
      if (prev.includes(stateId)) return prev
      const updated = [...prev, stateId]
      // Solved once the student has visited all three states.
      if (updated.length === STATES.length) onSolved?.()
      return updated
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATES.map((s) => (
          <span
            key={s.id}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
              current.id === s.id
                ? 'border-stone-800 text-stone-900 dark:border-white dark:text-white'
                : 'border-stone-200 text-stone-500 dark:border-stone-600 dark:text-stone-400'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${s.swatch}`} />
            {s.label}
            {seen.includes(s.id) && ' ✓'}
          </span>
        ))}
      </div>

      {/* Particle box. Spread is driven by state, not by a random walk, so the
          picture stays readable and reduced-motion users lose nothing. */}
      <div className="mb-4 flex h-40 items-center justify-center rounded-xl border-2 border-stone-200 bg-white p-4 dark:border-stone-600 dark:bg-stone-800">
        <div className="grid grid-cols-6" style={{ gap: `${4 + current.spread * 10}px` }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${current.swatch}`}
              style={{ transition: 'all 0.4s ease' }}
            />
          ))}
        </div>
      </div>

      <label
        htmlFor="particle-temp"
        className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
      >
        Temperature: {temp}°C
      </label>
      <input
        id="particle-temp"
        type="range"
        min={0}
        max={150}
        step={1}
        value={temp}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="h-11 w-full accent-orange-500"
      />

      {/* State is named in text, never signalled by color alone. */}
      <div className={`mt-4 rounded-xl border-2 p-4 ${current.panel}`}>
        <p className="text-base font-black text-stone-900 dark:text-white">
          {substance} is a {current.label.toLowerCase()} at {temp}°C
        </p>
        <p className="mt-1 text-sm font-medium text-stone-700 dark:text-stone-200">
          {current.blurb}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {substance} is a {current.label} at {temp} degrees Celsius.
      </p>
    </div>
  )
}
