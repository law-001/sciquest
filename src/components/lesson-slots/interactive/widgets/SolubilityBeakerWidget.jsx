import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w06-l1 signature interactive: a beaker that stops accepting sugar.
//
// Sugar goes in as undissolved solid and crosses into solution a little every
// tick. It stops crossing when the solution reaches the solubility limit for
// the current temperature, so the heap on the floor of the beaker is a
// consequence of the chemistry rather than a picture of saturation.
//
// The chart pinned to the wall plots the same two numbers that drive the
// beaker. The stirrer and the crusher change how fast the transfer happens and
// nothing else: the marker still lands in the same place and the curve never
// moves. That is the lesson, and it is visible rather than stated.
//
// Every control has to show up in the drawing, not only in a readout. The
// hotplate glows with the temperature, the stirring rod sweeps when the stirrer
// is on, and crushing swaps the heap of big cubes for a bed of fine grains.
//
// The scene paints its own wall and bench, so its contrast is the same on cream
// and on stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall and bench run past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 340

const PLATE_X = 26
const PLATE_W = 214
const PLATE_Y = 314
const PLATE_H = 26

// Beaker interior. The dissolved particles bounce off these walls and the glass
// is drawn around them, so "it fills the water" stays one fact rather than two.
const BX = 54
const BY = 126
const BW = 162
const BH = 188
const WATER_TOP = BY + 36
const FLOOR = BY + BH - 4

// The chart paper pinned to the wall, and the axes drawn on it.
const SHEET_X = 264
const SHEET_Y = 28
const SHEET_W = 330
const SHEET_H = 306
const GX0 = 318
const GX1 = 574
const GY_TOP = 88
const GY_BOT = 282

const SPOON_G = 10
const MAX_G = 220
const S_MAX = 180

const INK = '#57534e'
const INK_MID = '#78716c'

const GOALS = [
  { id: 'unsat', label: 'Unsaturated solution made', hint: 'Add a spoon or two and let it all disappear.' },
  { id: 'sat', label: 'Saturated solution made', hint: 'Keep spooning until sugar piles up on the bottom.' },
  { id: 'super', label: 'Supersaturated solution made', hint: 'Dissolve a lot while it is hot, then cool it down.' },
  { id: 'rate', label: 'Speed changed, curve unmoved', hint: 'Switch the stirrer or the crusher on while solid is left.' },
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
  empty: {
    label: 'Plain water',
    where: 'nothing in yet',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    note: 'Nothing dissolved yet. Spoon some sugar in.',
  },
  unsat: {
    label: 'Unsaturated',
    where: 'below the curve',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    note: 'It all went in. The water would still take more.',
  },
  sat: {
    label: 'Saturated',
    where: 'on the curve',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    note: 'The water is full. Extra sugar sits on the bottom.',
  },
  super: {
    label: 'Supersaturated',
    where: 'above the curve',
    panel: 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20',
    note: 'It holds more than it should. A seed crystal drops the extra out.',
  },
}

function makeDots() {
  return Array.from({ length: 60 }, () => {
    const a = Math.random() * Math.PI * 2
    return {
      x: BX + 12 + Math.random() * (BW - 24),
      y: WATER_TOP + 10 + Math.random() * (FLOOR - WATER_TOP - 20),
      vx: Math.cos(a),
      vy: Math.sin(a),
    }
  })
}

// ── Scene furniture ─────────────────────────────────────────────────────────

function drawRoom(ctx) {
  ctx.fillStyle = '#f2f7fc'
  ctx.fillRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)
  ctx.fillStyle = '#e7d9c3'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, H + BLEED - BENCH_Y)
  ctx.fillStyle = 'rgba(120,113,108,0.25)'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, 2)
}

// The plate is where the temperature slider lands in the picture: the element
// band brightens with it, and a heat shimmer rises once the water is warm.
function drawPlate(ctx, temp, tick) {
  ctx.fillStyle = 'rgba(87,83,78,0.16)'
  ctx.beginPath()
  ctx.ellipse(PLATE_X + PLATE_W / 2, BENCH_Y + 3, 118, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#78716c'
  ctx.beginPath()
  ctx.roundRect(PLATE_X, PLATE_Y, PLATE_W, PLATE_H, 4)
  ctx.fill()
  ctx.fillStyle = '#a8a29e'
  ctx.fillRect(PLATE_X, PLATE_Y, PLATE_W, 3)

  const heat = temp / 90
  ctx.fillStyle = `rgba(249,115,22,${(0.15 + heat * 0.8).toFixed(3)})`
  ctx.beginPath()
  ctx.roundRect(BX - 6, PLATE_Y - 5, BW + 12, 6, 3)
  ctx.fill()

  ctx.fillStyle = '#44403c'
  ctx.beginPath()
  ctx.roundRect(PLATE_X + 132, PLATE_Y + 5, 72, 16, 3)
  ctx.fill()
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = '#fb923c'
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${temp} °C`, PLATE_X + 198, PLATE_Y + 17)

  if (temp > 42) {
    ctx.strokeStyle = `rgba(249,115,22,${(0.12 + heat * 0.35).toFixed(3)})`
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    for (let i = 0; i < 3; i += 1) {
      const x = BX + 34 + i * 48
      const drift = Math.sin(tick / 22 + i) * 5
      ctx.beginPath()
      ctx.moveTo(x, BY - 14)
      ctx.quadraticCurveTo(x + drift, BY - 32, x - drift, BY - 50)
      ctx.stroke()
    }
    ctx.lineCap = 'butt'
  }
}

// Glass first, then whatever is floating in it, then the graduations, so the
// beaker reads as a container rather than an outline behind some dots.
function drawBeakerGlass(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillRect(BX, BY, BW, BH)

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(BX, BY)
  ctx.lineTo(BX, BY + BH)
  ctx.lineTo(BX + BW, BY + BH)
  ctx.lineTo(BX + BW, BY)
  ctx.stroke()

  // Rim and pour lip: the parts that make it a beaker rather than a box.
  ctx.beginPath()
  ctx.ellipse(BX + BW / 2, BY, BW / 2, 7, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(BX + BW - 2, BY - 3)
  ctx.quadraticCurveTo(BX + BW + 15, BY, BX + BW + 13, BY + 13)
  ctx.stroke()
}

function drawGraduations(ctx) {
  ctx.strokeStyle = 'rgba(87,83,78,0.55)'
  for (let i = 1; i <= 5; i += 1) {
    const y = FLOOR - (i / 6) * (FLOOR - WATER_TOP + 26)
    const major = i % 2 === 0
    ctx.lineWidth = major ? 1.8 : 1
    ctx.beginPath()
    ctx.moveTo(BX + BW - (major ? 22 : 12), y)
    ctx.lineTo(BX + BW - 3, y)
    ctx.stroke()
  }

  ctx.fillStyle = '#fff7ed'
  ctx.strokeStyle = '#d6d3d1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(BX + 12, BY + 58, 54, 18, 3)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = INK_MID
  ctx.font = '800 10px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('100 mL', BX + 39, BY + 71)
}

function drawWater(ctx, temp) {
  const warm = temp / 90
  ctx.fillStyle = `rgba(59,175,169,${(0.2 + warm * 0.08).toFixed(3)})`
  ctx.fillRect(BX + 2, WATER_TOP, BW - 4, FLOOR - WATER_TOP + 4)

  ctx.strokeStyle = '#3BAFA9'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(BX + 2, WATER_TOP)
  ctx.quadraticCurveTo(BX + BW / 2, WATER_TOP + 7, BX + BW - 2, WATER_TOP)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(BX + 11, WATER_TOP + 14)
  ctx.lineTo(BX + 11, FLOOR - 26)
  ctx.stroke()
}

// Whole cubes and crushed grains carry the same mass. The crusher has to be
// something a student can see, not a number that changes somewhere else.
function drawPile(ctx, pileG, crush) {
  if (pileG <= 0.2) return

  const gramsEach = crush ? 0.85 : 2.4
  const cw = crush ? 5 : 11
  const ch = crush ? 4 : 9
  const cols = crush ? 26 : 12
  const count = Math.min(crush ? 286 : 108, Math.max(1, Math.round(pileG / gramsEach)))
  const x0 = BX + (BW - cols * cw) / 2

  ctx.fillStyle = crush ? '#fcd34d' : '#f59e0b'
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 1

  for (let i = 0; i < count; i += 1) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const x = x0 + col * cw + (row % 2) * (cw / 2)
    const y = FLOOR - (row + 1) * ch
    ctx.beginPath()
    ctx.rect(x, y, cw - 1, ch - 1)
    ctx.fill()
    if (!crush) ctx.stroke()
  }
}

// The rod sweeps across the beaker while the stirrer is on, and the swirl under
// it turns with the same angle, so "stirring" is a thing happening in the water.
function drawStirrer(ctx, angle) {
  const cx = BX + BW / 2
  const x = cx + Math.sin(angle) * 34

  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(cx, WATER_TOP + 26, 46, 11, 0, angle, angle + Math.PI * 1.4)
  ctx.stroke()

  ctx.strokeStyle = '#d6d3d1'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx, BY - 26)
  ctx.lineTo(x, FLOOR - 22)
  ctx.stroke()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 1, BY - 24)
  ctx.lineTo(x - 1, FLOOR - 26)
  ctx.stroke()
  ctx.lineCap = 'butt'
}

function drawChart(ctx, { temp, dissolved, cap, status }) {
  ctx.fillStyle = '#fffdf7'
  ctx.strokeStyle = '#e7e5e4'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(SHEET_X, SHEET_Y, SHEET_W, SHEET_H, 6)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#d6d3d1'
  ctx.beginPath()
  ctx.arc(SHEET_X + SHEET_W / 2, SHEET_Y + 10, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(GX0, GY_TOP)
  ctx.lineTo(GX0, GY_BOT)
  ctx.lineTo(GX1, GY_BOT)
  ctx.stroke()

  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const g of [0, 60, 120, 180]) ctx.fillText(`${g}`, GX0 - 6, gy(g) + 4)
  ctx.textAlign = 'center'
  for (const t of [0, 30, 60, 90]) ctx.fillText(`${t}`, gx(t), GY_BOT + 16)
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('g sugar per 100 mL', GX0 - 10, GY_TOP - 14)
  ctx.textAlign = 'center'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillText('temperature °C', (GX0 + GX1) / 2, GY_BOT + 32)

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

  const markY = gy(Math.min(dissolved, S_MAX))
  ctx.fillStyle = status === 'super' ? '#f59e0b' : status === 'sat' ? '#0d9488' : '#7FB3EA'
  ctx.beginPath()
  ctx.arc(gx(temp), markY, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#44403c'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = INK
  ctx.font = '800 11px system-ui, sans-serif'
  const rightHalf = gx(temp) > (GX0 + GX1) / 2
  ctx.textAlign = rightHalf ? 'right' : 'left'
  ctx.fillText(STATUS[status].where, gx(temp) + (rightHalf ? -12 : 12), markY + 4)
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`limit here: ${cap.toFixed(0)} g`, GX1, GY_TOP - 14)
}

function drawScene(ctx, { dots, shown, pileG, temp, dissolved, cap, status, stir, crush, tick }) {
  ctx.clearRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)

  drawRoom(ctx)
  drawChart(ctx, { temp, dissolved, cap, status })
  drawPlate(ctx, temp, tick)

  drawBeakerGlass(ctx)
  drawWater(ctx, temp)

  // Dissolved sugar: individual particles loose in the water.
  ctx.fillStyle = '#b45309'
  for (let i = 0; i < shown; i += 1) {
    const d = dots[i]
    ctx.beginPath()
    ctx.arc(d.x, d.y, 3.4, 0, Math.PI * 2)
    ctx.fill()
  }

  drawPile(ctx, pileG, crush)
  if (stir) drawStirrer(ctx, tick / 9)
  drawGraduations(ctx)

  // In-picture labels, each on a leader line to the part it names.
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.strokeStyle = 'rgba(180,83,9,0.5)'
  ctx.lineWidth = 1.5
  ctx.fillStyle = '#b45309'
  ctx.fillText(`dissolved ${dissolved.toFixed(0)} g`, BX + BW + 22, WATER_TOP + 24)
  ctx.beginPath()
  ctx.moveTo(BX + BW + 18, WATER_TOP + 20)
  ctx.lineTo(BX + BW - 26, WATER_TOP + 34)
  ctx.stroke()

  if (pileG > 0.5) {
    ctx.fillText(`on the bottom ${pileG.toFixed(0)} g`, BX + BW + 22, FLOOR - 4)
    ctx.beginPath()
    ctx.moveTo(BX + BW + 18, FLOOR - 8)
    ctx.lineTo(BX + BW - 20, FLOOR - 12)
    ctx.stroke()
  }

  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(crush ? 'crushed sugar' : 'sugar cubes', BX + BW / 2, BENCH_Y + 18)
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
    let tick = 0

    function step() {
      const c = liveRef.current
      const limit = solubility(c.temp)
      const speed = (0.6 + (c.temp / 90) * 1.9) * (c.stir ? 2.2 : 1)
      const dots = dotsRef.current
      const shown = Math.min(dots.length, Math.round(c.dissolved / 3))

      if (!still) {
        tick += 1
        for (let i = 0; i < shown; i += 1) {
          const d = dots[i]
          d.x += d.vx * speed
          d.y += d.vy * speed
          if (d.x < BX + 8) { d.x = BX + 8; d.vx = Math.abs(d.vx) }
          if (d.x > BX + BW - 8) { d.x = BX + BW - 8; d.vx = -Math.abs(d.vx) }
          if (d.y < WATER_TOP + 8) { d.y = WATER_TOP + 8; d.vy = Math.abs(d.vy) }
          if (d.y > FLOOR - 6) { d.y = FLOOR - 6; d.vy = -Math.abs(d.vy) }
        }
      }

      drawScene(ctx, {
        dots,
        shown,
        pileG: c.undissolved,
        temp: c.temp,
        dissolved: c.dissolved,
        cap: limit,
        status: statusFor(c.dissolved, c.undissolved, limit),
        stir: c.stir,
        crush: c.crush,
        tick,
      })

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [dissolved, undissolved, temp, stir, crush])

  const total = dissolved + undissolved

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Beaker of 100 millilitres of water at ${temp} degrees Celsius holding ${dissolved.toFixed(0)} grams of dissolved sugar, with ${undissolved.toFixed(0)} grams undissolved on the bottom. The solution is ${info.label} and the chart marker is ${info.where}.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${info.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">{info.label}</p>
              <p className="mt-0.5 text-sm font-bold text-stone-700 dark:text-stone-200">
                {dissolved.toFixed(0)} g in, limit {cap.toFixed(0)} g
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
                Temperature: {temp} °C
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
                Only this control moves the limit.
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
              These two change the speed. The curve stays put.
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
                Solutions made: {done.length} of {GOALS.length}
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
                        {hit ? '✓ Done: ' : 'Not yet: '}
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
