import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L5 signature interactive — water in a beaker over a burner.
//
// The student holds a heat or cool button and the whole thing runs: the
// thermometer climbs, the particles break their lattice, bubbles rise, vapour
// escapes. Temperature stalls at 0 °C and 100 °C while the change of state is
// happening, so latent heat is something you sit through rather than read about.
//
// Sublimation and deposition need a vacuum pump, because that is honestly the
// only way water does them — and it makes the "skips the liquid" jump literal.

const W = 620
const H = 360

// Beaker interior, in canvas units.
const BX = 180
const BY = 70
const BW = 260
const BH = 250

const N = 34
const R = 7

const PHASES = {
  solid: {
    label: 'Solid — ice',
    colour: '#7FB3EA',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    note: 'Particles are locked in a fixed lattice. They shiver in place, so the ice keeps its own shape.',
  },
  melting: {
    label: 'Melting — 0 °C and holding',
    colour: '#5FBBC8',
    panel: 'border-[#5FBBC8] bg-[#DDEEFF] dark:bg-[#5FBBC8]/15',
    note: 'The thermometer has stopped. Every bit of heat going in is being spent breaking the lattice apart, not raising the temperature.',
  },
  liquid: {
    label: 'Liquid — water',
    colour: '#3BAFA9',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    note: 'Particles slide past each other but still cling together, so water pools in the bottom of the beaker and takes its shape.',
  },
  boiling: {
    label: 'Boiling — 100 °C and holding',
    colour: '#7FC4C0',
    panel: 'border-[#7FC4C0] bg-[#7BC9CF]/25 dark:bg-[#7FC4C0]/15',
    note: 'Stalled again. The heat is now tearing particles away from each other — watch the bubbles form at the bottom and rise.',
  },
  gas: {
    label: 'Gas — water vapour',
    colour: '#9AA7B8',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    note: 'Particles have escaped each other and fill the whole beaker, bouncing off the walls and each other.',
  },
}

const CHANGES = [
  { id: 'melting', label: 'Melting', note: 'solid → liquid, ice taking in heat at 0 °C' },
  { id: 'freezing', label: 'Freezing', note: 'liquid → solid, water giving out heat at 0 °C' },
  { id: 'evaporation', label: 'Evaporation', note: 'liquid → gas, water taking in heat at 100 °C' },
  { id: 'condensation', label: 'Condensation', note: 'gas → liquid, vapour giving out heat' },
  { id: 'sublimation', label: 'Sublimation', note: 'solid → gas, skipping the liquid entirely' },
  { id: 'deposition', label: 'Deposition', note: 'gas → solid, skipping the liquid entirely' },
]

// Energy runs 0 to 100. Melting eats 12 units at 0 °C, boiling eats 30 at
// 100 °C — the ratio is roughly true and it makes the boiling plateau the long,
// memorable one.
const E_MELT_START = 20
const E_MELT_END = 32
const E_BOIL_START = 72
const E_BOIL_END = 100

function tempFor(e) {
  if (e <= E_MELT_START) return -20 + (e / E_MELT_START) * 20
  if (e <= E_MELT_END) return 0
  if (e <= E_BOIL_START) return ((e - E_MELT_END) / (E_BOIL_START - E_MELT_END)) * 100
  if (e <= E_BOIL_END) return 100
  return 100 + (e - E_BOIL_END) * 2
}

function phaseFor(e, vacuum) {
  if (vacuum) return e <= E_MELT_START ? 'solid' : 'gas'
  if (e < E_MELT_START) return 'solid'
  if (e < E_MELT_END) return 'melting'
  if (e < E_BOIL_START) return 'liquid'
  if (e < E_BOIL_END) return 'boiling'
  return 'gas'
}

// What a phase reduces to when you ask "solid, liquid or gas?" — the plateaus
// are mid-change, so they count as the state they are leaving.
const BASE = { solid: 'solid', melting: 'solid', liquid: 'liquid', boiling: 'liquid', gas: 'gas' }

function makeParticles() {
  return Array.from({ length: N }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    return {
      i,
      x: BX + R * 2 + Math.random() * (BW - R * 4),
      y: BY + BH * 0.55 + Math.random() * (BH * 0.4 - R * 2),
      vx: Math.cos(a),
      vy: Math.sin(a),
      phase: Math.random() * Math.PI * 2,
    }
  })
}

function siteFor(i) {
  const cols = 7
  const gap = 30
  const x0 = BX + BW / 2 - ((cols - 1) * gap) / 2
  const y0 = BY + BH - 40 - Math.floor((N - 1) / cols) * gap
  return { x: x0 + (i % cols) * gap, y: y0 + Math.floor(i / cols) * gap }
}

export default function StateChangeLabWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const bubblesRef = useRef([])
  const liveRef = useRef({ energy: 0, vacuum: false })
  const energyRef = useRef(0)
  const heldRef = useRef(null)

  const [energy, setEnergy] = useState(0)
  const [vacuum, setVacuum] = useState(false)
  const [held, setHeld] = useState(null)
  const [seen, setSeen] = useState([])
  const [latest, setLatest] = useState(null)

  const phaseId = phaseFor(energy, vacuum)
  const phase = PHASES[phaseId]
  const temp = Math.round(tempFor(energy))

  // The draw loop and the energy ramp read live values through refs, so neither
  // restarts when a control moves.
  useEffect(() => {
    liveRef.current = { energy, vacuum }
    energyRef.current = energy
    heldRef.current = held
  }, [energy, vacuum, held])

  const recordCrossing = useCallback(
    (prev, next, isVacuum) => {
      const from = BASE[phaseFor(prev, isVacuum)]
      const to = BASE[phaseFor(next, isVacuum)]
      if (from === to) return

      let id = null
      if (isVacuum) id = to === 'gas' ? 'sublimation' : 'deposition'
      else if (from === 'solid' && to === 'liquid') id = 'melting'
      else if (from === 'liquid' && to === 'solid') id = 'freezing'
      else if (from === 'liquid' && to === 'gas') id = 'evaporation'
      else if (from === 'gas' && to === 'liquid') id = 'condensation'
      if (!id) return

      setLatest(CHANGES.find((c) => c.id === id))
      setSeen((prevSeen) => {
        if (prevSeen.includes(id)) return prevSeen
        const updated = [...prevSeen, id]
        if (updated.length === CHANGES.length) onSolved?.()
        return updated
      })
    },
    [onSolved],
  )

  // Holding a button ramps the energy on a fixed 20-per-second tick, so the
  // physics runs at the same rate whatever the frame rate is.
  useEffect(() => {
    if (!held) return undefined
    const id = setInterval(() => {
      const prev = energyRef.current
      const next = Math.min(115, Math.max(0, prev + (held === 'heat' ? 1.1 : -1.1)))
      energyRef.current = next
      setEnergy(next)
      recordCrossing(prev, next, liveRef.current.vacuum)
    }, 50)
    return () => clearInterval(id)
  }, [held, recordCrossing])

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
      const { energy: e, vacuum: vac } = liveRef.current
      const pid = phaseFor(e, vac)
      const base = BASE[pid]
      const t = tempFor(e)
      const speed = 0.4 + Math.max(t + 20, 0) / 120 * 3.4
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        if (base === 'solid') {
          const site = siteFor(p.i)
          const amp = 1 + Math.max(t + 20, 0) / 20 * 2.5
          p.x = site.x + Math.sin(tick * 0.09 + p.phase) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.phase * 1.7) * amp
          continue
        }

        p.x += p.vx * speed
        p.y += p.vy * speed

        // A liquid keeps a flat top surface; a gas has none.
        const top = base === 'liquid' ? BY + BH * 0.45 : BY + R
        if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy) }
        if (p.x < BX + R) { p.x = BX + R; p.vx = Math.abs(p.vx) }
        if (p.x > BX + BW - R) { p.x = BX + BW - R; p.vx = -Math.abs(p.vx) }
        if (p.y > BY + BH - R) { p.y = BY + BH - R; p.vy = -Math.abs(p.vy) }
      }

      // Bubbles only exist while the water is actually boiling.
      const bubbles = bubblesRef.current
      if (pid === 'boiling' && tick % 6 === 0) {
        bubbles.push({
          x: BX + 20 + Math.random() * (BW - 40),
          y: BY + BH - 12,
          r: 3 + Math.random() * 5,
          v: 0.9 + Math.random() * 1.2,
        })
      }
      for (const b of bubbles) b.y -= b.v
      bubblesRef.current = bubbles.filter((b) => b.y > BY + 10).slice(-60)

      draw(ctx, { pid, base, parts, bubbles: bubblesRef.current, held: heldRef.current, vac, t })

      if (!still) raf = requestAnimationFrame(step)
    }

    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Beaker of water at ${temp} degrees Celsius. Current state: ${phase.label}.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${phase.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {temp} °C — {phase.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {phase.note}
              </p>
              {latest && (
                <p className="mt-2 text-xs font-black text-stone-900 dark:text-white">
                  Just happened → {latest.label}: {latest.note}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onPointerDown={() => setHeld('heat')}
                onPointerUp={() => setHeld(null)}
                onPointerLeave={() => setHeld(null)}
                onKeyDown={(e) => e.key === 'Enter' && setHeld('heat')}
                onKeyUp={() => setHeld(null)}
                onBlur={() => setHeld(null)}
                className="min-h-11 rounded-xl bg-primary-500 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
              >
                🔥 Hold to heat
              </button>
              <button
                type="button"
                onPointerDown={() => setHeld('cool')}
                onPointerUp={() => setHeld(null)}
                onPointerLeave={() => setHeld(null)}
                onKeyDown={(e) => e.key === 'Enter' && setHeld('cool')}
                onKeyUp={() => setHeld(null)}
                onBlur={() => setHeld(null)}
                className="min-h-11 rounded-xl bg-secondary-600 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700"
              >
                ❄️ Hold to cool
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  const next = !vacuum
                  setVacuum(next)
                  recordCrossing(energy, energy, next)
                }}
                aria-pressed={vacuum}
                className={`min-h-11 w-full rounded-xl border-2 px-3 py-2 text-sm font-black transition-colors ${
                  vacuum
                    ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-700/25 dark:text-accent-100'
                    : 'border-stone-300 bg-white text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                Vacuum pump: {vacuum ? 'ON' : 'OFF'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                With the pump on there is no air pressure holding the water down, so ice
                goes straight to vapour and back — no liquid stage at all.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Changes watched — {seen.length} of {CHANGES.length}
              </p>
              <ul className="space-y-1.5">
                {CHANGES.map((c) => {
                  const done = seen.includes(c.id)
                  return (
                    <li
                      key={c.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 ${
                        done
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p
                        className={`text-xs font-black ${
                          done ? 'text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {done ? '✓ ' : '○ '}
                        {c.label}
                      </p>
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                        {c.note}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {temp} degrees Celsius, {phase.label}. {seen.length} of {CHANGES.length} changes
        watched.
      </p>
    </>
  )
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function draw(ctx, { pid, base, parts, bubbles, held, vac, t }) {
  ctx.clearRect(0, 0, W, H)

  drawThermometer(ctx, t)

  // Beaker glass.
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(120,113,108,0.55)'
  ctx.beginPath()
  ctx.moveTo(BX, BY - 8)
  ctx.lineTo(BX, BY + BH)
  ctx.lineTo(BX + BW, BY + BH)
  ctx.lineTo(BX + BW, BY - 8)
  ctx.stroke()

  // Graduation marks, so it reads as lab glassware rather than a plain box.
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(120,113,108,0.30)'
  for (let i = 1; i <= 4; i += 1) {
    const y = BY + (BH / 5) * i
    ctx.beginPath()
    ctx.moveTo(BX, y)
    ctx.lineTo(BX + 18, y)
    ctx.stroke()
  }

  // Water surface line — only a liquid has one.
  if (base === 'liquid') {
    ctx.strokeStyle = 'rgba(59,175,169,0.65)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(BX + 2, BY + BH * 0.45 - R)
    ctx.lineTo(BX + BW - 2, BY + BH * 0.45 - R)
    ctx.stroke()
  }

  const colour = PHASES[pid].colour

  for (const b of bubbles) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = colour
  for (const p of parts) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  for (const p of parts) {
    ctx.beginPath()
    ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Bonds between neighbours, drawn only for a solid — this is the lattice the
  // heat has to break, made visible.
  if (base === 'solid') {
    ctx.strokeStyle = 'rgba(127,179,234,0.55)'
    ctx.lineWidth = 2
    for (let i = 0; i < parts.length; i += 1) {
      for (let j = i + 1; j < parts.length; j += 1) {
        const dx = parts[i].x - parts[j].x
        const dy = parts[i].y - parts[j].y
        if (dx * dx + dy * dy < 44 * 44) {
          ctx.beginPath()
          ctx.moveTo(parts[i].x, parts[i].y)
          ctx.lineTo(parts[j].x, parts[j].y)
          ctx.stroke()
        }
      }
    }
  }

  drawBurner(ctx, held === 'heat')
  if (held === 'cool') drawFrost(ctx)
  if (vac) drawPump(ctx)
}

function drawThermometer(ctx, t) {
  const x = 84
  const top = BY
  const h = BH
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(120,113,108,0.55)'
  ctx.beginPath()
  ctx.roundRect(x - 11, top, 22, h, 11)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, top + h + 12, 17, 0, Math.PI * 2)
  ctx.stroke()

  // -20 at the bottom of the tube, 140 at the top.
  const frac = Math.min(Math.max((t + 20) / 160, 0), 1)
  ctx.fillStyle = t >= 100 ? '#ef4444' : t <= 0 ? '#7FB3EA' : '#f97316'
  ctx.beginPath()
  ctx.arc(x, top + h + 12, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(x - 6, top + h - h * frac, 12, h * frac, 6)
  ctx.fill()

  ctx.fillStyle = 'rgba(120,113,108,0.9)'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('140', x - 18, top + 12)
  ctx.fillText('100', x - 18, top + h - h * 0.75 + 5)
  ctx.fillText('0', x - 18, top + h - h * 0.125 + 5)
}

function drawBurner(ctx, lit) {
  const cx = BX + BW / 2
  const y = BY + BH
  ctx.fillStyle = 'rgba(120,113,108,0.75)'
  ctx.beginPath()
  ctx.roundRect(cx - 14, y + 26, 28, 44, 4)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(cx - 46, y + 66, 92, 12, 6)
  ctx.fill()

  if (!lit) return
  // Two nested flames; the wobble comes from the clock so it needs no state.
  const wob = Math.sin(Date.now() / 90) * 4
  ctx.fillStyle = 'rgba(249,115,22,0.9)'
  ctx.beginPath()
  ctx.moveTo(cx - 16, y + 28)
  ctx.quadraticCurveTo(cx + wob, y - 22, cx + 16, y + 28)
  ctx.fill()
  ctx.fillStyle = 'rgba(250,204,21,0.95)'
  ctx.beginPath()
  ctx.moveTo(cx - 8, y + 28)
  ctx.quadraticCurveTo(cx + wob * 0.6, y + 2, cx + 8, y + 28)
  ctx.fill()
}

function drawFrost(ctx) {
  ctx.strokeStyle = 'rgba(127,179,234,0.85)'
  ctx.lineWidth = 3
  for (let i = 0; i < 5; i += 1) {
    const x = BX + 26 + i * ((BW - 52) / 4)
    const y = BY + BH + 34
    ctx.beginPath()
    ctx.moveTo(x, y - 9)
    ctx.lineTo(x, y + 9)
    ctx.moveTo(x - 8, y - 5)
    ctx.lineTo(x + 8, y + 5)
    ctx.moveTo(x - 8, y + 5)
    ctx.lineTo(x + 8, y - 5)
    ctx.stroke()
  }
}

function drawPump(ctx) {
  ctx.strokeStyle = 'rgba(202,138,4,0.9)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(BX + BW, BY + 24)
  ctx.lineTo(BX + BW + 54, BY + 24)
  ctx.stroke()
  ctx.fillStyle = 'rgba(202,138,4,0.9)'
  ctx.beginPath()
  ctx.roundRect(BX + BW + 54, BY + 6, 40, 36, 6)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('PUMP', BX + BW + 74, BY + 29)
}
