import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w06-l1 signature interactive — a beaker that stops accepting sugar.
//
// Sugar goes in as undissolved solid and moves across into solution a little
// every tick. It stops moving when the solution hits the solubility limit for
// the current temperature, so the pile on the bottom is a consequence of the
// chemistry rather than a picture of saturation.
//
// The solubility curve beside it plots the same two numbers that drive the
// beaker. The stirrer and the crusher change how fast the transfer happens and
// nothing else — the marker still ends up in the same place, and the curve
// never moves. That is the whole lesson, and it is visible rather than stated.

const W = 660
const H = 330

const BX = 34
const BY = 74
const BW = 250
const BH = 210
const WATER_TOP = BY + 34

const GX0 = 360
const GX1 = 638
const GY_TOP = 56
const GY_BOT = 282

const SPOON_G = 10
const MAX_G = 220
const S_MAX = 180

const GOALS = [
  { id: 'unsat', label: 'Unsaturated solution made', hint: 'Add a spoon or two and let it all disappear into the water.' },
  { id: 'sat', label: 'Saturated solution made', hint: 'Keep spooning until sugar stops dissolving and piles up on the bottom.' },
  { id: 'super', label: 'Supersaturated solution made', hint: 'Dissolve a lot while it is hot, then cool it down without disturbing it.' },
  { id: 'rate', label: 'Rate changed without moving the curve', hint: 'Switch the stirrer or the crusher on while there is still solid on the bottom.' },
]

// Grams of sugar that 100 mL of water will hold at this temperature.
const solubility = (t) => 30 + 1.6 * t

const gx = (t) => GX0 + (t / 90) * (GX1 - GX0)
const gy = (g) => GY_BOT - (g / S_MAX) * (GY_BOT - GY_TOP)

function statusFor(dissolved, undissolved, cap) {
  if (dissolved > cap + 0.5) return 'super'
  if (undissolved > 0.5) return 'sat'
  if (dissolved > 0.5) return 'unsat'
  return 'empty'
}

const STATUS = {
  empty: { label: 'Plain water', panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50', note: 'Nothing dissolved yet. Spoon some sugar in.' },
  unsat: { label: 'Unsaturated', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15', note: 'Everything you added has gone into solution and the water would still take more. The marker sits below the curve.' },
  sat: { label: 'Saturated', panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15', note: 'The water is holding all it can at this temperature. Extra sugar just sits on the bottom — the marker is sitting on the curve.' },
  super: { label: 'Supersaturated', panel: 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20', note: 'The solution is holding more than it should be able to, because you cooled it without disturbing it. The marker is above the curve — and one seed crystal will bring the excess straight back down.' },
}

function makeDots() {
  return Array.from({ length: 60 }, () => {
    const a = Math.random() * Math.PI * 2
    return {
      x: BX + 12 + Math.random() * (BW - 24),
      y: WATER_TOP + 10 + Math.random() * (BH - (WATER_TOP - BY) - 24),
      vx: Math.cos(a),
      vy: Math.sin(a),
    }
  })
}

function drawScene(ctx, { dots, shown, pileG, temp, dissolved, cap, status }) {
  ctx.clearRect(0, 0, W, H)

  // ── Beaker ──
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(BX, BY)
  ctx.lineTo(BX, BY + BH)
  ctx.lineTo(BX + BW, BY + BH)
  ctx.lineTo(BX + BW, BY)
  ctx.stroke()

  ctx.fillStyle = 'rgba(59,175,169,0.22)'
  ctx.fillRect(BX + 2, WATER_TOP, BW - 4, BY + BH - WATER_TOP - 1)
  ctx.strokeStyle = '#3BAFA9'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(BX + 2, WATER_TOP)
  ctx.lineTo(BX + BW - 2, WATER_TOP)
  ctx.stroke()

  // Dissolved sugar: individual particles loose in the water.
  ctx.fillStyle = '#b45309'
  for (let i = 0; i < shown; i += 1) {
    const d = dots[i]
    ctx.beginPath()
    ctx.arc(d.x, d.y, 3.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Undissolved sugar: a heap of crystals on the floor.
  const crystals = Math.min(90, Math.round(pileG / 2.2))
  ctx.fillStyle = '#f59e0b'
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 1
  for (let i = 0; i < crystals; i += 1) {
    const row = Math.floor(i / 15)
    const col = i % 15
    const x = BX + 20 + col * 14 + (row % 2) * 7
    const y = BY + BH - 9 - row * 11
    ctx.beginPath()
    ctx.rect(x, y, 9, 8)
    ctx.fill()
    ctx.stroke()
  }

  ctx.fillStyle = '#78716c'
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`100 mL water at ${temp} °C`, BX, BY - 32)
  ctx.font = '700 12px system-ui, sans-serif'
  ctx.fillText(`${dissolved.toFixed(0)} g dissolved · ${pileG.toFixed(0)} g undissolved`, BX, BY - 14)

  // ── Solubility curve ──
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
  for (const g of [0, 60, 120, 180]) ctx.fillText(`${g}`, GX0 - 6, gy(g) + 4)
  ctx.textAlign = 'center'
  for (const t of [0, 30, 60, 90]) ctx.fillText(`${t}`, gx(t), GY_BOT + 16)
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('g of sugar per 100 mL', GX0 - 8, GY_TOP - 16)
  ctx.textAlign = 'center'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillText('temperature °C →', (GX0 + GX1) / 2, GY_BOT + 32)

  ctx.strokeStyle = '#0d9488'
  ctx.lineWidth = 3
  ctx.beginPath()
  for (let t = 0; t <= 90; t += 1) {
    const x = gx(t)
    const y = gy(solubility(t))
    if (t === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = '#0d9488'
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('solubility limit', GX1 - 4, gy(solubility(90)) - 10)

  ctx.strokeStyle = '#d6d3d1'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(gx(temp), GY_BOT)
  ctx.lineTo(gx(temp), GY_TOP)
  ctx.stroke()
  ctx.setLineDash([])

  const markerColour = status === 'super' ? '#f59e0b' : status === 'sat' ? '#0d9488' : '#7FB3EA'
  ctx.fillStyle = markerColour
  ctx.beginPath()
  ctx.arc(gx(temp), gy(Math.min(dissolved, S_MAX)), 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#44403c'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#78716c'
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    status === 'super' ? 'above the curve' : status === 'sat' ? 'on the curve' : 'below the curve',
    gx(temp) + 11,
    gy(Math.min(dissolved, S_MAX)) + 4,
  )
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`limit here: ${cap.toFixed(0)} g`, GX1, GY_TOP - 2)
}

export default function SolubilityBeakerWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const dotsRef = useRef(makeDots())
  const liveRef = useRef({ dissolved: 0, undissolved: 0, temp: 20, stir: false, crush: false })
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [dissolved, setDissolved] = useState(0)
  const [undissolved, setUndissolved] = useState(0)
  const [temp, setTemp] = useState(20)
  const [stir, setStir] = useState(false)
  const [crush, setCrush] = useState(false)
  const [done, setDone] = useState([])

  const cap = solubility(temp)
  const status = statusFor(dissolved, undissolved, cap)
  const info = STATUS[status]

  useEffect(() => {
    liveRef.current = { dissolved, undissolved, temp, stir, crush }
  }, [dissolved, undissolved, temp, stir, crush])

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

  // The chemistry runs on its own fixed tick, not on the frame rate, so the
  // stirrer speeds the dissolving up by a real factor rather than a visual one.
  useEffect(() => {
    const id = setInterval(() => {
      const c = liveRef.current
      const limit = solubility(c.temp)
      const state = statusFor(c.dissolved, c.undissolved, limit)
      if (state !== 'empty') note(state)
      if ((c.stir || c.crush) && c.undissolved > 0.5) note('rate')

      if (c.undissolved <= 0.01 || c.dissolved >= limit - 0.01) return
      const rate = 0.55 * (c.stir ? 2.6 : 1) * (c.crush ? 2 : 1)
      const move = Math.min(rate, limit - c.dissolved, c.undissolved)
      setDissolved((d) => d + move)
      setUndissolved((u) => Math.max(0, u - move))
    }, 50)
    return () => clearInterval(id)
  }, [note])

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

    function step() {
      const c = liveRef.current
      const limit = solubility(c.temp)
      const speed = (0.6 + (c.temp / 90) * 1.9) * (c.stir ? 2.2 : 1)
      const dots = dotsRef.current
      const shown = Math.min(dots.length, Math.round(c.dissolved / 3))

      for (let i = 0; i < shown; i += 1) {
        const d = dots[i]
        d.x += d.vx * speed
        d.y += d.vy * speed
        if (d.x < BX + 8) { d.x = BX + 8; d.vx = Math.abs(d.vx) }
        if (d.x > BX + BW - 8) { d.x = BX + BW - 8; d.vx = -Math.abs(d.vx) }
        if (d.y < WATER_TOP + 6) { d.y = WATER_TOP + 6; d.vy = Math.abs(d.vy) }
        if (d.y > BY + BH - 8) { d.y = BY + BH - 8; d.vy = -Math.abs(d.vy) }
      }

      drawScene(ctx, {
        dots,
        shown,
        pileG: c.undissolved,
        temp: c.temp,
        dissolved: c.dissolved,
        cap: limit,
        status: statusFor(c.dissolved, c.undissolved, limit),
      })

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [dissolved, undissolved, temp])

  const total = dissolved + undissolved

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Beaker at ${temp} degrees Celsius holding ${dissolved.toFixed(0)} grams of dissolved sugar with ${undissolved.toFixed(0)} grams undissolved. The solution is ${info.label}.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${info.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {info.label} — {dissolved.toFixed(0)} g in, limit {cap.toFixed(0)} g
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {info.note}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUndissolved((u) => Math.min(MAX_G - dissolved, u + SPOON_G))}
                disabled={total >= MAX_G}
                className="min-h-11 rounded-xl bg-primary-500 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                🥄 Add {SPOON_G} g
              </button>
              <button
                type="button"
                onClick={() => {
                  setDissolved(0)
                  setUndissolved(0)
                }}
                className="min-h-11 rounded-xl border-2 border-stone-300 bg-white px-3 py-3 text-sm font-black text-stone-600 transition-colors dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
              >
                Fresh water
              </button>
            </div>

            <div>
              <label
                htmlFor="sol-temp"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Temperature — {temp} °C
              </label>
              <input
                id="sol-temp"
                type="range"
                min={0}
                max={90}
                step={1}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                This is the only control that moves the limit. Warm it and the pile
                re-dissolves; cool it and sugar comes back out.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStir((s) => !s)}
                aria-pressed={stir}
                className={`min-h-11 rounded-xl border-2 px-3 py-2 text-xs font-black transition-colors ${
                  stir
                    ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-700/25 dark:text-accent-100'
                    : 'border-stone-300 bg-white text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                Stirrer: {stir ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={() => setCrush((c) => !c)}
                aria-pressed={crush}
                className={`min-h-11 rounded-xl border-2 px-3 py-2 text-xs font-black transition-colors ${
                  crush
                    ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-700/25 dark:text-accent-100'
                    : 'border-stone-300 bg-white text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                Crushed: {crush ? 'YES' : 'NO'}
              </button>
            </div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Watch the curve while you use these. It does not move. They change how
              fast sugar dissolves, never how much will.
            </p>

            <button
              type="button"
              onClick={() => {
                const excess = dissolved - cap
                setDissolved(cap)
                setUndissolved((u) => u + excess)
              }}
              disabled={status !== 'super'}
              className="min-h-11 w-full rounded-xl border-2 border-amber-400 bg-amber-50 px-3 py-2 text-sm font-black text-amber-800 transition-colors disabled:opacity-40 dark:border-amber-500 dark:bg-amber-600/20 dark:text-amber-100"
            >
              Drop in a seed crystal
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Solutions made — {done.length} of {GOALS.length}
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
        {info.label}. {dissolved.toFixed(0)} grams dissolved of a {cap.toFixed(0)} gram
        limit, {undissolved.toFixed(0)} grams on the bottom.
      </p>
    </>
  )
}
