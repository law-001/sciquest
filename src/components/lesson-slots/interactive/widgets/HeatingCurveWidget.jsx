import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w04-l1 signature interactive — the heating curve drawing itself.
//
// Heat goes in at a steady rate, so the x-axis is both "heat added" and "time".
// The graph is not a picture of a heating curve: it is plotted from the same
// energy number that is driving the lattice next to it, point by point, which
// is what makes the plateau something the student sits through. Cooling walks
// the head of the curve back down the way it came.
//
// The vacuum pump swaps the route for the sublimation one — one plateau instead
// of two, and the liquid stage visibly never happens.

const W = 720
const H = 340

const BX = 46
const BY = 56
const BW = 210
const BH = 200

const GX0 = 330
const GX1 = 694
const GY_TOP = 52
const GY_BOT = 288

const N = 24
const R = 6

const E_MAX = 115
const E_MELT_START = 20
const E_MELT_END = 32
const E_BOIL_START = 72
const E_BOIL_END = 100

const GOALS = [
  { id: 'melt', label: 'Melting plateau drawn', hint: 'Hold heat until the line goes flat at 0 °C and stays flat.' },
  { id: 'boil', label: 'Boiling plateau drawn', hint: 'Keep holding heat — the second flat run is at 100 °C.' },
  { id: 'reverse', label: 'Curve retraced backwards', hint: 'Hold cool and walk the head of the line back down through a plateau.' },
  { id: 'sublime', label: 'Sublimation route taken', hint: 'Turn the vacuum pump on, cool to solid, then heat back up.' },
]

function tempFor(e, vacuum) {
  if (vacuum) {
    if (e <= E_MELT_START) return -20 + (e / E_MELT_START) * 20
    if (e <= E_MELT_END) return 0
    return ((e - E_MELT_END) / (E_MAX - E_MELT_END)) * 130
  }
  if (e <= E_MELT_START) return -20 + (e / E_MELT_START) * 20
  if (e <= E_MELT_END) return 0
  if (e <= E_BOIL_START) return ((e - E_MELT_END) / (E_BOIL_START - E_MELT_END)) * 100
  if (e <= E_BOIL_END) return 100
  return 100 + (e - E_BOIL_END) * 2
}

function stateFor(e, vacuum) {
  if (vacuum) {
    if (e < E_MELT_START) return { id: 'solid', label: 'Solid — ice', colour: '#7FB3EA', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15', note: 'Locked lattice. With the pump on there is no liquid stage ahead of it at all.' }
    if (e < E_MELT_END) return { id: 'subliming', label: 'Subliming — flat and holding', colour: '#8FB6C8', panel: 'border-[#8FB6C8] bg-[#DDEEFF] dark:bg-[#8FB6C8]/15', note: 'The line has gone flat. Every bit of heat is tearing particles straight off the solid and into vapour — the liquid stage is skipped.' }
    return { id: 'gas', label: 'Gas — water vapour', colour: '#9AA7B8', panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50', note: 'Free particles filling the whole vessel. They went there straight from the solid.' }
  }
  if (e < E_MELT_START) return { id: 'solid', label: 'Solid — ice', colour: '#7FB3EA', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15', note: 'Particles shiver on fixed lattice sites. The line is climbing because the heat is going into speed.' }
  if (e < E_MELT_END) return { id: 'melting', label: 'Melting — 0 °C and holding', colour: '#5FBBC8', panel: 'border-[#5FBBC8] bg-[#DDEEFF] dark:bg-[#5FBBC8]/15', note: 'The line has gone flat. Heat is still going in, but it is being spent breaking the lattice, not raising the temperature.' }
  if (e < E_BOIL_START) return { id: 'liquid', label: 'Liquid — water', colour: '#3BAFA9', panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15', note: 'The lattice is gone. Particles slide over each other and the line climbs again.' }
  if (e < E_BOIL_END) return { id: 'boiling', label: 'Boiling — 100 °C and holding', colour: '#7FC4C0', panel: 'border-[#7FC4C0] bg-[#7BC9CF]/25 dark:bg-[#7FC4C0]/15', note: 'Flat again, and for much longer. Pulling particles clean away from each other costs far more heat than melting did.' }
  return { id: 'gas', label: 'Gas — water vapour', colour: '#9AA7B8', panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50', note: 'Every particle has escaped. With nothing left to break, the line climbs steeply again.' }
}

const IS_SOLID = { solid: true, melting: true, subliming: true }

function makeParticles() {
  return Array.from({ length: N }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    return {
      i,
      x: BX + R * 2 + Math.random() * (BW - R * 4),
      y: BY + BH * 0.6 + Math.random() * (BH * 0.35 - R * 2),
      vx: Math.cos(a),
      vy: Math.sin(a),
      wobble: Math.random() * Math.PI * 2,
    }
  })
}

function siteFor(i) {
  const cols = 6
  const gap = 28
  const x0 = BX + BW / 2 - ((cols - 1) * gap) / 2
  const y0 = BY + BH - 34 - Math.floor((N - 1) / cols) * gap
  return { x: x0 + (i % cols) * gap, y: y0 + Math.floor(i / cols) * gap }
}

const px = (e) => GX0 + (e / E_MAX) * (GX1 - GX0)
const py = (t) => GY_BOT - ((t + 20) / 150) * (GY_BOT - GY_TOP)

function drawScene(ctx, { state, parts, held, vacuum, energy, maxE, temp }) {
  ctx.clearRect(0, 0, W, H)

  // ── The vessel ──
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(BX, BY)
  ctx.lineTo(BX, BY + BH)
  ctx.lineTo(BX + BW, BY + BH)
  ctx.lineTo(BX + BW, BY)
  ctx.stroke()

  if (vacuum) {
    ctx.setLineDash([6, 5])
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 2
    ctx.strokeRect(BX - 14, BY - 22, BW + 28, BH + 36)
    ctx.setLineDash([])
    ctx.fillStyle = '#a855f7'
    ctx.font = '700 12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('vacuum — no air pressure', BX + BW / 2, BY - 28)
  }

  ctx.fillStyle = state.colour
  for (const p of parts) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  for (const p of parts) {
    ctx.beginPath()
    ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Hotplate ──
  const plateY = BY + BH + 8
  ctx.fillStyle = '#57534e'
  ctx.fillRect(BX - 16, plateY, BW + 32, 18)
  ctx.strokeStyle = held === 'heat' ? '#f97316' : held === 'cool' ? '#60a5fa' : '#a8a29e'
  ctx.lineWidth = 3
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath()
    ctx.arc(BX + 26 + i * 52, plateY + 9, 8, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#78716c'
  ctx.font = '700 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    held === 'heat' ? 'heat going in' : held === 'cool' ? 'heat coming out' : 'plate idle',
    BX + BW / 2,
    plateY + 34,
  )

  // ── Thermometer readout on the vessel ──
  ctx.fillStyle = '#78716c'
  ctx.font = '800 15px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${Math.round(temp)} °C`, BX + 4, BY - 12)

  // ── The graph ──
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  for (const t of [0, 100]) {
    ctx.beginPath()
    ctx.moveTo(GX0, py(t))
    ctx.lineTo(GX1, py(t))
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(GX0, GY_TOP)
  ctx.lineTo(GX0, GY_BOT)
  ctx.lineTo(GX1, GY_BOT)
  ctx.stroke()

  ctx.fillStyle = '#78716c'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const t of [-20, 0, 50, 100, 130]) {
    ctx.fillText(`${t}`, GX0 - 6, py(t) + 4)
  }
  ctx.textAlign = 'left'
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.fillText('temperature °C', GX0 - 4, GY_TOP - 14)
  ctx.textAlign = 'center'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillText('heat added at a steady rate  =  time  →', (GX0 + GX1) / 2, GY_BOT + 20)

  // The faint line is how far the run has ever got; the bold one is where the
  // head is now, so cooling visibly walks it back.
  const trace = (limit, colour, width) => {
    ctx.strokeStyle = colour
    ctx.lineWidth = width
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let e = 0; e <= limit; e += 0.5) {
      const x = px(e)
      const y = py(tempFor(e, vacuum))
      if (e === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  if (maxE > energy) trace(maxE, '#d6d3d1', 2)
  trace(energy, '#f97316', 3.5)

  ctx.fillStyle = '#f97316'
  ctx.beginPath()
  ctx.arc(px(energy), py(tempFor(energy, vacuum)), 5, 0, Math.PI * 2)
  ctx.fill()
}

export default function HeatingCurveWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef({ energy: 0, vacuum: false, maxE: 0, held: null })
  const energyRef = useRef(0)
  const vacuumRef = useRef(false)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [energy, setEnergy] = useState(0)
  const [maxE, setMaxE] = useState(0)
  const [vacuum, setVacuum] = useState(false)
  const [held, setHeld] = useState(null)
  const [done, setDone] = useState([])

  const state = stateFor(energy, vacuum)
  const temp = Math.round(tempFor(energy, vacuum))

  useEffect(() => {
    liveRef.current = { energy, vacuum, maxE, held }
    energyRef.current = energy
    vacuumRef.current = vacuum
  }, [energy, vacuum, maxE, held])

  const note = useCallback(
    (id) => {
      setDone((prev) => {
        if (prev.includes(id)) return prev
        const updated = [...prev, id]
        if (updated.length === GOALS.length) onSolved?.()
        return updated
      })
    },
    [onSolved],
  )

  // A fixed 20-per-second tick, so the run takes the same wall time whatever
  // the frame rate is.
  useEffect(() => {
    if (!held) return undefined
    const id = setInterval(() => {
      const prev = energyRef.current
      const dir = held === 'heat' ? 1.1 : -1.1
      const next = Math.min(E_MAX, Math.max(0, prev + dir))
      energyRef.current = next
      setEnergy(next)
      setMaxE((m) => Math.max(m, next))

      const vac = vacuumRef.current
      if (dir > 0 && vac && prev < E_MELT_START && next >= E_MELT_START) note('sublime')
      if (dir > 0 && !vac && prev < E_MELT_END && next >= E_MELT_END) note('melt')
      if (dir > 0 && !vac && prev < E_BOIL_END && next >= E_BOIL_END) note('boil')
      if (
        dir < 0 &&
        !vac &&
        ((prev > E_MELT_END && next <= E_MELT_END) || (prev > E_BOIL_END && next <= E_BOIL_END))
      ) {
        note('reverse')
      }
    }, 50)
    return () => clearInterval(id)
  }, [held, note])

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
      const live = liveRef.current
      const st = stateFor(live.energy, live.vacuum)
      const t = tempFor(live.energy, live.vacuum)
      const speed = 0.35 + (Math.max(t + 20, 0) / 150) * 3.2
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        if (IS_SOLID[st.id]) {
          const site = siteFor(p.i)
          const amp = 0.8 + (Math.max(t + 20, 0) / 20) * 2.2
          p.x = site.x + Math.sin(tick * 0.09 + p.wobble) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.wobble * 1.7) * amp
          continue
        }
        p.x += p.vx * speed
        p.y += p.vy * speed
        const top = st.id === 'liquid' ? BY + BH * 0.5 : BY + R
        if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy) }
        if (p.x < BX + R) { p.x = BX + R; p.vx = Math.abs(p.vx) }
        if (p.x > BX + BW - R) { p.x = BX + BW - R; p.vx = -Math.abs(p.vx) }
        if (p.y > BY + BH - R) { p.y = BY + BH - R; p.vy = -Math.abs(p.vy) }
      }

      drawScene(ctx, {
        state: st,
        parts,
        held: live.held,
        vacuum: live.vacuum,
        energy: live.energy,
        maxE: live.maxE,
        temp: t,
      })

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [energy, vacuum, maxE])

  const holdProps = (kind) => ({
    onPointerDown: () => setHeld(kind),
    onPointerUp: () => setHeld(null),
    onPointerLeave: () => setHeld(null),
    onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && setHeld(kind),
    onKeyUp: () => setHeld(null),
    onBlur: () => setHeld(null),
  })

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Ice on a hotplate at ${temp} degrees Celsius, currently ${state.label}, with the heating curve plotted alongside.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${state.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {temp} °C — {state.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {state.note}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                {...holdProps('heat')}
                className="min-h-11 rounded-xl bg-primary-500 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
              >
                🔥 Hold to heat
              </button>
              <button
                type="button"
                {...holdProps('cool')}
                className="min-h-11 rounded-xl bg-secondary-600 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700"
              >
                ❄️ Hold to cool
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setVacuum((v) => !v)}
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
                With the pump on the whole route changes — one plateau instead of two,
                and the liquid stage never happens.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Curve drawn — {done.length} of {GOALS.length}
              </p>
              <ul className="space-y-1.5">
                {GOALS.map((g) => {
                  const hit = done.includes(g.id)
                  return (
                    <li
                      key={g.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 transition-colors ${
                        hit
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {hit ? '✓ Done — ' : 'Not yet — '}
                        {g.label}
                      </p>
                      {!hit && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {g.hint}
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
        {temp} degrees Celsius — {state.label}. {done.length} of {GOALS.length} parts of
        the curve drawn.
      </p>
    </>
  )
}
