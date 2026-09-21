import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w07-l1 signature interactive: diluting without removing anything.
//
// The particles live in normalised coordinates inside the liquid, so when the
// tap runs and the surface rises they are literally spread through a bigger
// space. The count on screen never changes while water goes in, and the colour
// lightens because the same particles share more volume. That is the one thing
// about dilution a still picture cannot show.
//
// The second route halves the solute instead: pour half the jar into the waste
// beaker, then top it back up. Same volume, half the particles, half the
// concentration. The waste beaker keeps filling, so "I poured some away" stays
// visible after the pour has finished.
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

const JX = 56
const JW = 196
const JY = 96
const JH = 242
const FLOOR = JY + JH - 4

const MAX_ML = 400
const MAX_G = 60

const TAP_X = JX + JW / 2
const TAP_Y = 86

const WX = 276
const WW = 76
const WTOP = 262
const WBOT = 338

const SHEET_X = 372
const SHEET_Y = 26
const SHEET_W = 222
const SHEET_H = 290

const COL_X = 414
const COL_W = 44
const COL_TOP = 104
const COL_BOT = 272
const COL_MAX_PCT = 26

const TARGET_PCT = 6
const TOLERANCE_PCT = 0.4

const INK = '#57534e'
const INK_MID = '#78716c'

const GOALS = [
  {
    id: 'water',
    label: 'Diluted by adding water',
    hint: 'Add water and watch the particle count. It never changes.',
  },
  {
    id: 'halve',
    label: 'Diluted by pouring half away',
    hint: 'Pour half the jar out, then top it back up.',
  },
  {
    id: 'target',
    label: `Hit ${TARGET_PCT.toFixed(1)} % m/m`,
    hint: `Land the readout between ${(TARGET_PCT - TOLERANCE_PCT).toFixed(1)} and ${(TARGET_PCT + TOLERANCE_PCT).toFixed(1)} %.`,
  },
]

const percent = (g, ml) => (g + ml === 0 ? 0 : (g / (g + ml)) * 100)

const particleCount = (g) => Math.min(160, Math.round(g * 2.6))

const stateFor = (pct) => {
  if (Math.abs(pct - TARGET_PCT) <= TOLERANCE_PCT) return { label: 'on target', ink: '#0d9488' }
  if (pct > 12) return { label: 'concentrated', ink: '#b45309' }
  return { label: 'dilute', ink: '#2563eb' }
}

function makeParticles() {
  return Array.from({ length: 160 }, () => {
    const a = Math.random() * Math.PI * 2
    return {
      nx: 0.05 + Math.random() * 0.9,
      ny: 0.05 + Math.random() * 0.9,
      vx: Math.cos(a),
      vy: Math.sin(a),
    }
  })
}

const colY = (pct) =>
  COL_BOT - (Math.min(pct, COL_MAX_PCT) / COL_MAX_PCT) * (COL_BOT - COL_TOP)

const surfaceFor = (ml) => FLOOR - (ml / MAX_ML) * (JH - 16)

// ── Scene furniture ─────────────────────────────────────────────────────────

function drawRoom(ctx) {
  ctx.fillStyle = '#f2f7fc'
  ctx.fillRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)
  ctx.fillStyle = '#e7d9c3'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, H + BLEED - BENCH_Y)
  ctx.fillStyle = 'rgba(120,113,108,0.25)'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, 2)
}

// The tap is where the water button lands in the picture: the handle turns and
// a stream falls while water is going in, so adding water is an event on the
// bench rather than a number ticking up in a panel.
function drawTap(ctx, pouring, tick) {
  ctx.fillStyle = '#a8a29e'
  ctx.fillRect(-BLEED, 44, TAP_X + 14 + BLEED, 12)
  ctx.fillStyle = '#d6d3d1'
  ctx.fillRect(-BLEED, 44, TAP_X + 14 + BLEED, 3)

  ctx.fillStyle = '#a8a29e'
  ctx.beginPath()
  ctx.roundRect(TAP_X - 7, 44, 14, TAP_Y - 44, 3)
  ctx.fill()

  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(TAP_X, 44)
  ctx.lineTo(TAP_X, 30)
  ctx.stroke()
  ctx.save()
  ctx.translate(TAP_X, 28)
  ctx.rotate(pouring ? Math.sin(tick / 4) * 0.5 : 0)
  ctx.fillStyle = '#f97316'
  ctx.beginPath()
  ctx.roundRect(-18, -4, 36, 8, 4)
  ctx.fill()
  ctx.restore()

  if (!pouring) return

  ctx.fillStyle = 'rgba(123,201,207,0.75)'
  ctx.fillRect(TAP_X - 4, TAP_Y, 8, BENCH_Y - TAP_Y)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillRect(TAP_X - 1, TAP_Y, 2, BENCH_Y - TAP_Y)
}

// Glass first, then the liquid, then the graduations, so the jar reads as a
// container rather than an outline behind some dots.
function drawJarGlass(ctx) {
  ctx.fillStyle = 'rgba(87,83,78,0.16)'
  ctx.beginPath()
  ctx.ellipse(JX + JW / 2, BENCH_Y + 3, JW / 2 + 16, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillRect(JX, JY, JW, JH)

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(JX, JY)
  ctx.lineTo(JX, JY + JH)
  ctx.lineTo(JX + JW, JY + JH)
  ctx.lineTo(JX + JW, JY)
  ctx.stroke()

  // Rim and pour lip: the parts that make it a jar rather than a box, and the
  // lip is where the pour-away stream leaves from.
  ctx.beginPath()
  ctx.ellipse(JX + JW / 2, JY, JW / 2, 8, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(JX + JW - 2, JY - 3)
  ctx.quadraticCurveTo(JX + JW + 17, JY, JX + JW + 15, JY + 14)
  ctx.stroke()
}

function drawLiquid(ctx, surfaceY, density) {
  const alpha = Math.min(0.82, density * 2.6)
  ctx.fillStyle = `rgba(217,119,6,${alpha.toFixed(3)})`
  ctx.fillRect(JX + 2, surfaceY, JW - 4, JY + JH - surfaceY - 1)

  // Meniscus: the curved surface the lesson asks students to read from.
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(JX + 2, surfaceY)
  ctx.quadraticCurveTo(JX + JW / 2, surfaceY + 8, JX + JW - 2, surfaceY)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(JX + 13, surfaceY + 16)
  ctx.lineTo(JX + 13, JY + JH - 20)
  ctx.stroke()
}

function drawGraduations(ctx, water, surfaceY) {
  ctx.strokeStyle = 'rgba(87,83,78,0.55)'
  ctx.fillStyle = INK_MID
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (let ml = 100; ml <= MAX_ML; ml += 100) {
    const y = surfaceFor(ml)
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(JX + JW - 22, y)
    ctx.lineTo(JX + JW - 3, y)
    ctx.stroke()
    ctx.fillText(`${ml}`, JX + JW - 26, y + 4)
  }

  // The reading, level with the surface, on the free side of the jar.
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(JX - 28, surfaceY)
  ctx.lineTo(JX - 2, surfaceY)
  ctx.stroke()
  ctx.fillStyle = '#b45309'
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${water} mL`, JX - 4, surfaceY - 6)
}

// What the student poured away has to go somewhere, and it stays there, so the
// second route leaves a mark on the bench instead of only on a counter.
function drawWasteBeaker(ctx, poured) {
  ctx.fillStyle = 'rgba(87,83,78,0.16)'
  ctx.beginPath()
  ctx.ellipse(WX + WW / 2, BENCH_Y + 2, WW / 2 + 8, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  const level = Math.min(1, poured / 600)
  const top = WBOT - level * (WBOT - WTOP - 8)

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillRect(WX, WTOP, WW, WBOT - WTOP)
  if (level > 0) {
    ctx.fillStyle = 'rgba(217,119,6,0.35)'
    ctx.fillRect(WX + 2, top, WW - 4, WBOT - top - 1)
  }

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(WX, WTOP)
  ctx.lineTo(WX, WBOT)
  ctx.lineTo(WX + WW, WBOT)
  ctx.lineTo(WX + WW, WTOP)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(WX + WW / 2, WTOP, WW / 2, 5, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('poured away', WX + WW / 2, WTOP - 14)
}

function drawPourOut(ctx, surfaceY) {
  ctx.strokeStyle = 'rgba(217,119,6,0.6)'
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(JX + JW + 8, Math.min(surfaceY + 6, JY + 44))
  ctx.quadraticCurveTo(WX + 4, JY + 96, WX + WW / 2, WTOP + 10)
  ctx.stroke()
  ctx.lineCap = 'butt'
}

function drawChart(ctx, pct, state) {
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

  const mid = SHEET_X + SHEET_W / 2
  ctx.fillStyle = INK
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('% m/m', mid, SHEET_Y + 32)
  ctx.fillStyle = INK_MID
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.fillText('solute mass ÷ total mass × 100', mid, SHEET_Y + 52)

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.strokeRect(COL_X, COL_TOP, COL_W, COL_BOT - COL_TOP)

  // Target band, drawn before the fill so the fill reads on top of it.
  ctx.fillStyle = 'rgba(13,148,136,0.28)'
  const bandTop = colY(TARGET_PCT + TOLERANCE_PCT)
  const bandBot = colY(TARGET_PCT - TOLERANCE_PCT)
  ctx.fillRect(COL_X + 1, bandTop, COL_W - 2, bandBot - bandTop)
  ctx.strokeStyle = '#0d9488'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(COL_X - 8, colY(TARGET_PCT))
  ctx.lineTo(COL_X + COL_W + 8, colY(TARGET_PCT))
  ctx.stroke()
  ctx.fillStyle = '#0d9488'
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`target ${TARGET_PCT.toFixed(1)} %`, COL_X + COL_W + 12, colY(TARGET_PCT) + 4)

  const fillTop = colY(pct)
  ctx.fillStyle = '#d97706'
  ctx.fillRect(COL_X + 1, fillTop, COL_W - 2, COL_BOT - fillTop - 1)

  ctx.fillStyle = INK_MID
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const p of [0, 5, 10, 15, 20, 25]) ctx.fillText(`${p}`, COL_X - 8, colY(p) + 4)

  ctx.fillStyle = INK
  ctx.font = '900 17px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${pct.toFixed(1)} %`, COL_X + COL_W / 2, COL_BOT + 26)
  ctx.fillStyle = state.ink
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.fillText(state.label, COL_X + COL_W / 2, COL_BOT + 44)
}

function drawScene(ctx, { parts, shown, water, solute, pouringIn, pouringOut, poured, tick }) {
  ctx.clearRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)

  const pct = percent(solute, water)
  const surfaceY = surfaceFor(water)
  const density = water > 0 ? solute / water : 0

  drawRoom(ctx)
  drawChart(ctx, pct, stateFor(pct))
  drawWasteBeaker(ctx, poured)
  drawTap(ctx, pouringIn, tick)

  drawJarGlass(ctx)
  drawLiquid(ctx, surfaceY, density)

  const span = JY + JH - 10 - surfaceY
  ctx.fillStyle = '#7c2d12'
  for (let i = 0; i < shown; i += 1) {
    const p = parts[i]
    ctx.beginPath()
    ctx.arc(JX + 10 + p.nx * (JW - 20), surfaceY + 8 + p.ny * span, 3.6, 0, Math.PI * 2)
    ctx.fill()
  }

  drawGraduations(ctx, water, surfaceY)
  if (pouringOut) drawPourOut(ctx, surfaceY)

  // In-picture labels, each sitting against the part it names.
  ctx.fillStyle = '#7c2d12'
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${shown} solute particles`, JX, JY - 32)
  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillText('only pouring removes them', JX, JY - 16)

  ctx.textAlign = 'center'
  ctx.fillText(`${solute} g solute`, JX + JW / 2, BENCH_Y + 20)
}

export default function DilutionJarWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef({ solute: 20, water: 80, poured: 0 })
  const pourInRef = useRef(0)
  const pourOutRef = useRef(0)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [solute, setSolute] = useState(20)
  const [water, setWater] = useState(80)
  const [poured, setPoured] = useState(0)
  const [done, setDone] = useState([])

  const pct = percent(solute, water)
  const onTarget = Math.abs(pct - TARGET_PCT) <= TOLERANCE_PCT
  const state = stateFor(pct)
  const shown = particleCount(solute)

  useEffect(() => {
    liveRef.current = { solute, water, poured }
  }, [solute, water, poured])

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
      const parts = partsRef.current
      const count = particleCount(c.solute)

      if (!still) {
        tick += 1
        if (pourInRef.current > 0) pourInRef.current -= 1
        if (pourOutRef.current > 0) pourOutRef.current -= 1
        for (let i = 0; i < count; i += 1) {
          const p = parts[i]
          p.nx += p.vx * 0.004
          p.ny += p.vy * 0.006
          if (p.nx < 0.02) { p.nx = 0.02; p.vx = Math.abs(p.vx) }
          if (p.nx > 0.98) { p.nx = 0.98; p.vx = -Math.abs(p.vx) }
          if (p.ny < 0.02) { p.ny = 0.02; p.vy = Math.abs(p.vy) }
          if (p.ny > 0.98) { p.ny = 0.98; p.vy = -Math.abs(p.vy) }
        }
      }

      drawScene(ctx, {
        parts,
        shown: count,
        water: c.water,
        solute: c.solute,
        pouringIn: pourInRef.current > 0,
        pouringOut: pourOutRef.current > 0,
        poured: c.poured,
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
  }, [solute, water, poured])

  function apply(nextSolute, nextWater, route) {
    setSolute(nextSolute)
    setWater(nextWater)
    const marks = route ? [route] : []
    if (Math.abs(percent(nextSolute, nextWater) - TARGET_PCT) <= TOLERANCE_PCT) marks.push('target')
    if (!marks.length) return
    setDone((prev) => {
      const updated = [...prev]
      marks.forEach((m) => {
        if (!updated.includes(m)) updated.push(m)
      })
      if (updated.length === prev.length) return prev
      if (updated.length === GOALS.length) onSolved?.()
      return updated
    })
  }

  function addWater() {
    if (!stillRef.current) pourInRef.current = 30
    apply(solute, Math.min(MAX_ML, water + 10), 'water')
  }

  function pourHalf() {
    if (!stillRef.current) pourOutRef.current = 34
    setPoured((p) => p + Math.round(water / 2))
    apply(Math.round(solute / 2), water, 'halve')
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`A jar on a bench holding ${solute} grams of solute in ${water} millilitres of water, with ${shown} particles on screen. The wall chart reads ${pct.toFixed(1)} percent by mass, which is ${state.label}.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                onTarget
                  ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                  : pct > 12
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20'
                    : 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {pct.toFixed(1)} % m/m, {state.label}
              </p>
              <p className="mt-0.5 text-sm font-bold text-stone-700 dark:text-stone-200">
                {solute} g in {water} mL
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {shown} particles are in the jar right now.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => apply(Math.min(MAX_G, solute + 5), water, null)}
                disabled={solute >= MAX_G}
                className="min-h-11 rounded-xl bg-primary-500 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                🥄 Add 5 g
              </button>
              <button
                type="button"
                onClick={addWater}
                disabled={water >= MAX_ML}
                className="min-h-11 rounded-xl bg-secondary-600 px-3 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700 disabled:opacity-50"
              >
                💧 Add 10 mL
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={pourHalf}
                disabled={solute < 2}
                className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
              >
                Pour half away
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                It tops back up with water: same volume, half the solute.
              </p>
            </div>

            <button
              type="button"
              onClick={() => apply(20, 80, null)}
              className="min-h-11 w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm font-black text-stone-600 transition-colors dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
            >
              Start over
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Routes found: {done.length} of {GOALS.length}
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
        {pct.toFixed(1)} percent by mass, {state.label}. {solute} grams of solute in{' '}
        {water} millilitres of water.
      </p>
    </>
  )
}
