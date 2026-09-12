import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w03-l1 signature interactive — one substance, five phases, one slider.
//
// The energy slider runs from a hair above absolute zero to star-hot. Nothing
// about the picture is drawn per phase: the particles have real velocities and
// the arrangement falls out of how fast they are moving, so the student watches
// a lattice break, a pool spread, a gas fill the box and finally the particles
// tear into charged ions and free electrons.
//
// The canvas is transparent and everything is drawn in colours that read on
// cream and on stone-900, so the widget never has to know about the theme.

const W = 640
const H = 320
const R = 7
const N = 30

const PHASES = [
  {
    id: 'condensate',
    max: 7,
    label: 'Bose–Einstein condensate',
    colour: '#A8C8F0',
    panel: 'border-[#A8C8F0] bg-[#DDEEFF] dark:bg-[#A8C8F0]/15',
    note: 'Almost all the energy is gone. The particles have slowed to a crawl and smeared into one blurred group — you can no longer tell them apart.',
    hint: 'Pull the energy down below 8.',
  },
  {
    id: 'solid',
    max: 31,
    label: 'Solid',
    colour: '#7FB3EA',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    note: 'Particles are locked onto fixed sites. They shiver harder as the energy climbs, but never swap places — so the shape holds.',
    hint: 'Park the energy between 8 and 31.',
  },
  {
    id: 'liquid',
    max: 57,
    label: 'Liquid',
    colour: '#3BAFA9',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    note: 'The lattice has broken. Particles slide past each other but still pull on each other enough to pool in the bottom of the chamber.',
    hint: 'Park the energy between 32 and 57.',
  },
  {
    id: 'gas',
    max: 81,
    label: 'Gas',
    colour: '#9AA7B8',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    note: 'Particles have outrun the pull between them. They fly straight until they hit a wall, so they fill the whole chamber evenly.',
    hint: 'Push the energy between 58 and 81.',
  },
  {
    id: 'plasma',
    max: Infinity,
    label: 'Plasma',
    colour: '#F59E0B',
    panel: 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20',
    note: 'Collisions are now violent enough to strip electrons off the atoms. Orange ions and yellow free electrons fly separately — the gas has become electrically charged.',
    hint: 'Push the energy past 81.',
  },
]

const phaseFor = (e) => PHASES.find((p) => e <= p.max)

// Log ramp: 0.2 K at the bottom, ~12 000 K at the top. A linear scale would
// crush the whole cold end of the story into one pixel of slider.
const kelvinFor = (e) => Math.pow(10, -0.7 + (e / 100) * 4.78)

const formatK = (k) =>
  k < 10 ? `${k.toFixed(1)} K` : `${Math.round(k).toLocaleString()} K`

function makeParticles() {
  return Array.from({ length: N }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    const b = Math.random() * Math.PI * 2
    return {
      i,
      x: R * 3 + Math.random() * (W - R * 6),
      y: H * 0.5 + Math.random() * (H * 0.4 - R * 2),
      vx: Math.cos(a),
      vy: Math.sin(a),
      ex: 0,
      ey: 0,
      evx: Math.cos(b),
      evy: Math.sin(b),
      wobble: Math.random() * Math.PI * 2,
    }
  })
}

// Where particle i sits once the substance has locked into a lattice.
function siteFor(i) {
  const cols = 6
  const gap = 34
  const x0 = W / 2 - ((cols - 1) * gap) / 2
  const y0 = H / 2 - (Math.floor((N - 1) / cols) * gap) / 2
  return { x: x0 + (i % cols) * gap, y: y0 + Math.floor(i / cols) * gap }
}

function speedFor(id, e) {
  if (id === 'condensate') return 0.05
  if (id === 'liquid') return 0.8 + ((e - 32) / 26) * 1.3
  if (id === 'gas') return 2.2 + ((e - 58) / 24) * 2.1
  if (id === 'plasma') return 4.6 + Math.min((e - 82) / 18, 1) * 2.6
  return 0
}

export default function PhaseBenchWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef(45)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [energy, setEnergy] = useState(45)
  const [seen, setSeen] = useState(['liquid'])

  const phase = phaseFor(energy)
  const kelvin = kelvinFor(energy)

  // The loop reads the slider through a ref, so dragging never tears the
  // simulation down and restarts it.
  useEffect(() => {
    liveRef.current = energy
  }, [energy])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    stillRef.current = still
    let raf = 0
    let tick = 0

    function step() {
      const e = liveRef.current
      const reg = phaseFor(e)
      const speed = speedFor(reg.id, e)
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        if (reg.id === 'condensate') {
          // Everything drifts toward one point and barely moves once it is
          // there — which is what makes the group unresolvable.
          p.x += (W / 2 - p.x) * 0.035 + Math.sin(tick * 0.02 + p.wobble) * speed
          p.y += (H * 0.6 - p.y) * 0.035 + Math.cos(tick * 0.02 + p.wobble) * speed
        } else if (reg.id === 'solid') {
          const site = siteFor(p.i)
          const amp = 0.8 + ((e - 8) / 23) * 4
          p.x = site.x + Math.sin(tick * 0.09 + p.wobble) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.wobble * 1.7) * amp
        } else {
          p.x += p.vx * speed
          p.y += p.vy * speed
          // A liquid still clings together, so it keeps a flat top surface.
          const top = reg.id === 'liquid' ? H * 0.44 : R
          if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy) }
          if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx) }
          if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx) }
          if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy) }
        }

        if (reg.id === 'plasma') {
          p.ex += p.evx * speed * 1.7
          p.ey += p.evy * speed * 1.7
          if (p.ex < R) { p.ex = R; p.evx = Math.abs(p.evx) }
          if (p.ex > W - R) { p.ex = W - R; p.evx = -Math.abs(p.evx) }
          if (p.ey < R) { p.ey = R; p.evy = Math.abs(p.evy) }
          if (p.ey > H - R) { p.ey = H - R; p.evy = -Math.abs(p.evy) }
        } else {
          p.ex = p.x
          p.ey = p.y
        }
      }

      ctx.clearRect(0, 0, W, H)

      if (reg.id === 'condensate') {
        // One blurred group: wide soft discs overlapping into a single smear.
        ctx.fillStyle = 'rgba(168,200,240,0.22)'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, R * 3.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = reg.colour
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, reg.id === 'plasma' ? R * 0.9 : R, 0, Math.PI * 2)
        ctx.fill()
      }

      if (reg.id === 'plasma') {
        ctx.fillStyle = '#FDE047'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.ex, p.ey, R * 0.45, 0, Math.PI * 2)
          ctx.fill()
        }
        // The + and − marks carry the charge without relying on colour.
        ctx.strokeStyle = 'rgba(120,53,15,0.9)'
        ctx.lineWidth = 1.6
        for (const p of parts) {
          ctx.beginPath()
          ctx.moveTo(p.x - 3, p.y)
          ctx.lineTo(p.x + 3, p.y)
          ctx.moveTo(p.x, p.y - 3)
          ctx.lineTo(p.x, p.y + 3)
          ctx.stroke()
        }
      } else if (reg.id !== 'condensate') {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  // With reduced motion on there is no loop, so the picture is repainted once
  // per slider change instead — a still frame that still answers the control.
  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [energy])

  function changeEnergy(next) {
    setEnergy(next)
    const id = phaseFor(next).id
    setSeen((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      if (updated.length === PHASES.length) onSolved?.()
      return updated
    })
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Sealed chamber at ${formatK(kelvin)}. The substance is behaving as a ${phase.label}.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${phase.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {formatK(kelvin)} — {phase.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {phase.note}
              </p>
            </div>

            <div>
              <label
                htmlFor="pbench-energy"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Energy in the chamber — {energy}
              </label>
              <input
                id="pbench-energy"
                type="range"
                min={0}
                max={100}
                step={1}
                value={energy}
                onChange={(e) => changeEnergy(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Same substance the whole way. Only the energy changes.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Phases reached — {seen.length} of {PHASES.length}
              </p>
              <ul className="space-y-1.5">
                {PHASES.map((p) => {
                  const done = seen.includes(p.id)
                  return (
                    <li
                      key={p.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 transition-colors ${
                        done
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {done ? '✓ Reached — ' : 'Not yet — '}
                        {p.label}
                      </p>
                      {!done && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {p.hint}
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
        {formatK(kelvin)} — {phase.label}. {seen.length} of {PHASES.length} phases
        reached.
      </p>
    </>
  )
}
