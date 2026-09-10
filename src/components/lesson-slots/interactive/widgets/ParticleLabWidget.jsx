import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L4 signature interactive — a live particle box.
//
// Real particles with real velocities on a canvas: temperature sets how fast
// they move, and the arrangement they fall into is a consequence of that speed
// rather than a picture chosen to illustrate it. Cold and they lock into a
// lattice and shiver; warm and they break loose but stay pooled at the bottom;
// hot and they fly free and fill the box.
//
// The canvas is transparent and the particles are drawn in colours that read on
// cream and on stone-900, so nothing here has to know about the theme.

const W = 640
const H = 320
const R = 7

const REGIMES = [
  {
    id: 'solid',
    max: 29,
    label: 'Solid',
    colour: '#7FB3EA',
    trail: 'rgba(127,179,234,0.30)',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    note: 'Particles are locked in a fixed pattern. They shiver in place but never swap positions, so the shape stays put.',
  },
  {
    id: 'liquid',
    max: 99,
    label: 'Liquid',
    colour: '#3BAFA9',
    trail: 'rgba(59,175,169,0.30)',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    note: 'Particles have broken out of the pattern and slide past each other, but they still pull on each other enough to pool at the bottom.',
  },
  {
    id: 'gas',
    max: Infinity,
    label: 'Gas',
    colour: '#9AA7B8',
    trail: 'rgba(154,167,184,0.30)',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    note: 'Particles have escaped each other completely. They fly in straight lines until they hit something, filling the whole box.',
  },
]

const regimeFor = (t) => REGIMES.find((r) => t <= r.max)

const OBSERVATIONS = [
  { id: 'made-of', text: 'All matter is made of tiny particles.', hint: 'Push the particle count up to 34 or more.' },
  { id: 'moving', text: 'Particles are always moving.', hint: 'Cool it to 5 °C or below — watch closely, they still shiver.' },
  { id: 'spaces', text: 'There are spaces between the particles.', hint: 'Heat it past 100 °C and watch the gaps open up.' },
  { id: 'attract', text: 'Particles attract each other.', hint: 'Cool it below 30 °C and watch them pull into a pattern.' },
  { id: 'energy', text: 'More energy means faster movement.', hint: 'Push the temperature to 140 °C and watch the trails stretch.' },
]

// Pixels per frame. Deliberately non-linear so the cold end still visibly
// shivers instead of freezing dead.
const speedFor = (t) => 0.4 + (t / 150) * 4.2

function makeParticles(n) {
  return Array.from({ length: n }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    return {
      i,
      x: R * 3 + Math.random() * (W - R * 6),
      y: H * 0.5 + Math.random() * (H * 0.45 - R * 2),
      px: 0,
      py: 0,
      vx: Math.cos(a),
      vy: Math.sin(a),
      phase: Math.random() * Math.PI * 2,
    }
  })
}

// Where particle i sits when the substance is solid.
function siteFor(i, n) {
  const cols = Math.ceil(Math.sqrt(n * (W / H)))
  const rows = Math.ceil(n / cols)
  const gapX = Math.min(38, (W - 70) / Math.max(cols - 1, 1))
  const gapY = Math.min(38, (H - 70) / Math.max(rows - 1, 1))
  const x0 = W / 2 - ((cols - 1) * gapX) / 2
  const y0 = H / 2 - ((rows - 1) * gapY) / 2
  return { x: x0 + (i % cols) * gapX, y: y0 + Math.floor(i / cols) * gapY }
}

export default function ParticleLabWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles(24))
  const liveRef = useRef({ temp: 20, count: 24 })

  const [temp, setTemp] = useState(20)
  const [count, setCount] = useState(24)
  const [observed, setObserved] = useState([])

  const regime = regimeFor(temp)

  // The draw loop reads the controls through a ref so dragging a slider never
  // tears the simulation down and restarts it.
  useEffect(() => {
    liveRef.current = { temp, count }
  }, [temp, count])

  useEffect(() => {
    partsRef.current = makeParticles(count)
  }, [count])

  // One rAF loop for the life of the widget. It reads the sliders through a ref
  // so dragging never tears down and restarts the simulation.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let tick = 0

    function step() {
      const { temp: t, count: n } = liveRef.current
      const reg = regimeFor(t)
      const speed = speedFor(t)
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        p.px = p.x
        p.py = p.y

        if (reg.id === 'solid') {
          // Held on a lattice site; temperature only sets how hard it shivers.
          const site = siteFor(p.i, n)
          const amp = 1 + (t / 29) * 4
          p.x = site.x + Math.sin(tick * 0.09 + p.phase) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.phase * 1.7) * amp
          continue
        }

        p.x += p.vx * speed
        p.y += p.vy * speed

        // Attraction between particles is what keeps a liquid pooled; a gas has
        // outrun it, so only the gas gets the full box.
        if (reg.id === 'liquid' && p.y < H * 0.42) {
          p.y = H * 0.42
          p.vy = Math.abs(p.vy)
        }

        if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx) }
        if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx) }
        if (p.y < R) { p.y = R; p.vy = Math.abs(p.vy) }
        if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy) }
      }

      ctx.clearRect(0, 0, W, H)

      // Trails make speed readable at a glance: a fast particle draws a long
      // streak, a shivering one draws almost none.
      ctx.strokeStyle = reg.trail
      ctx.lineWidth = R * 1.6
      ctx.lineCap = 'round'
      for (const p of parts) {
        if (!p.px) continue
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }

      ctx.fillStyle = reg.colour
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
        ctx.fill()
      }

      // A highlight, so particles read as spheres rather than flat discs.
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!still) raf = requestAnimationFrame(step)
    }

    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  function observe(ids) {
    setObserved((prev) => {
      const next = [...prev]
      ids.forEach((id) => {
        if (!next.includes(id)) next.push(id)
      })
      if (next.length === prev.length) return prev
      if (next.length === OBSERVATIONS.length) onSolved?.()
      return next
    })
  }

  function changeTemp(next) {
    setTemp(next)
    const seen = []
    if (next <= 5) seen.push('moving')
    if (next < 30) seen.push('attract')
    if (next >= 100) seen.push('spaces')
    if (next >= 140) seen.push('energy')
    if (seen.length) observe(seen)
  }

  function changeCount(next) {
    setCount(next)
    if (next >= 34) observe(['made-of'])
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Particle box: ${count} particles at ${temp} degrees Celsius, behaving as a ${regime.label}.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${regime.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {temp} °C — behaving as a {regime.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {regime.note}
              </p>
            </div>

            <div>
              <label
                htmlFor="plab-temp"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Temperature — {temp} °C
              </label>
              <input
                id="plab-temp"
                type="range"
                min={0}
                max={150}
                step={1}
                value={temp}
                onChange={(e) => changeTemp(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />

              <label
                htmlFor="plab-count"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Particles — {count}
              </label>
              <input
                id="plab-count"
                type="range"
                min={8}
                max={48}
                step={1}
                value={count}
                onChange={(e) => changeCount(Number(e.target.value))}
                className="h-11 w-full accent-teal-500"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Seen with your own eyes — {observed.length} of {OBSERVATIONS.length}
              </p>
              <ul className="space-y-1.5">
                {OBSERVATIONS.map((o) => {
                  const done = observed.includes(o.id)
                  return (
                    <li
                      key={o.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 transition-colors ${
                        done
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {done ? '✓ Seen — ' : 'Not yet — '}
                        {o.text}
                      </p>
                      {!done && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {o.hint}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {count} particles at {temp} degrees Celsius, behaving as a {regime.label}.{' '}
        {observed.length} of {OBSERVATIONS.length} behaviours seen.
      </p>
    </>
  )
}
