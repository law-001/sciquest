import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w04-l1 signature interactive: the heating curve drawing itself.
//
// Heat goes in at a steady rate, so the x-axis is both "heat added" and "time".
// The graph is not a picture of a heating curve: it is plotted from the same
// energy number that is driving the lattice next to it, point by point, which
// is what makes the plateau something the student sits through.
//
// Three things carry the lesson visually, and all three move off the same
// number: the particles in the beaker, the red column in the thermometer, and
// the head of the curve. During a plateau the hotplate keeps glowing while the
// column sits perfectly still, which is the whole point of the lesson.
//
// The scene paints its own wall and bench, so its contrast is the same on cream
// and on stone-900 and the widget never has to know about the theme.

const W = 640
// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const H = 400
// The wall and bench run past the viewBox on every side, so a cropped edge
// never shows a seam. Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 348

// Beaker interior. The particles bounce off these walls and the glass is drawn
// around them, so "it fills the beaker" stays one fact rather than two.
const BX = 66
const BW = 148
const BY = 148
const BH = 170

// Where a liquid settles, and where the meniscus is drawn.
const POOL_Y = BY + BH * 0.46

const PLATE_X = 38
const PLATE_W = 204
const PLATE_Y = 323
const PLATE_H = 25

// Thermometer. The column maps temperature straight onto a y value, which is
// why yCol below is a subtraction and not a scaling.
const TX = 200
const T_TOP = 138
const T_BULB_Y = 300
const T_COL_BOT = 296
const yCol = (t) => 276 - Math.max(-20, Math.min(130, t))

// The chart paper pinned to the wall, and the axes drawn on it.
const SHEET_X = 282
const SHEET_Y = 30
const SHEET_W = 342
const SHEET_H = 306
const GX0 = 332
const GX1 = 606
const GY_TOP = 68
const GY_BOT = 292

const N = 24
const R = 6
const SITE_GAP = 19
const BOND_REACH = SITE_GAP * 1.3

const E_MAX = 115
const E_MELT_START = 20
const E_MELT_END = 32
const E_BOIL_START = 72
const E_BOIL_END = 100

const INK = 'rgba(41,37,36,0.95)'
const INK_MID = 'rgba(87,83,78,0.95)'
const RULE = 'rgba(120,113,108,0.45)'
const GLASS = 'rgba(87,83,78,0.55)'

const GOALS = [
  { id: 'melt', label: 'Melting plateau drawn', hint: 'Hold heat until the line goes flat at 0 °C.' },
  { id: 'boil', label: 'Boiling plateau drawn', hint: 'Keep holding heat. The second flat run sits at 100 °C.' },
  { id: 'reverse', label: 'Curve retraced backwards', hint: 'Hold cool and walk the head of the line back down.' },
  { id: 'sublime', label: 'Sublimation route taken', hint: 'Turn the vacuum pump on, cool to solid, then heat up.' },
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
    if (e < E_MELT_START) return { id: 'solid', label: 'Solid: ice', colour: '#7FB3EA', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15' }
    if (e < E_MELT_END) return { id: 'subliming', label: 'Subliming at 0 °C', colour: '#8FB6C8', panel: 'border-[#8FB6C8] bg-[#DDEEFF] dark:bg-[#8FB6C8]/15' }
    return { id: 'gas', label: 'Gas: water vapour', colour: '#9AA7B8', panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50' }
  }
  if (e < E_MELT_START) return { id: 'solid', label: 'Solid: ice', colour: '#7FB3EA', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15' }
  if (e < E_MELT_END) return { id: 'melting', label: 'Melting at 0 °C', colour: '#5FBBC8', panel: 'border-[#5FBBC8] bg-[#DDEEFF] dark:bg-[#5FBBC8]/15' }
  if (e < E_BOIL_START) return { id: 'liquid', label: 'Liquid: water', colour: '#3BAFA9', panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15' }
  if (e < E_BOIL_END) return { id: 'boiling', label: 'Boiling at 100 °C', colour: '#7FC4C0', panel: 'border-[#7FC4C0] bg-[#7BC9CF]/25 dark:bg-[#7FC4C0]/15' }
  return { id: 'gas', label: 'Gas: water vapour', colour: '#9AA7B8', panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50' }
}

const IS_SOLID = { solid: true, melting: true, subliming: true }
const IS_POOLED = { liquid: true, boiling: true }

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

// Six columns of four, parked clear of the graduation marks on the left wall
// and clear of the thermometer bulb on the right.
function siteFor(i) {
  const cols = 6
  return {
    x: 86 + (i % cols) * SITE_GAP,
    y: 302 - (Math.floor((N - 1) / cols) - Math.floor(i / cols)) * SITE_GAP,
  }
}

const px = (e) => GX0 + (e / E_MAX) * (GX1 - GX0)
const py = (t) => GY_BOT - ((t + 20) / 150) * (GY_BOT - GY_TOP)

// ── Scene furniture ─────────────────────────────────────────────────────────

function drawRoom(ctx) {
  ctx.fillStyle = '#f2f7fc'
  ctx.fillRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)
  ctx.fillStyle = '#e7d9c3'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, H + BLEED - BENCH_Y)
  ctx.fillStyle = 'rgba(120,113,108,0.25)'
  ctx.fillRect(-BLEED, BENCH_Y, W + BLEED * 2, 2)
}

function drawPlate(ctx, held, temp) {
  ctx.fillStyle = 'rgba(87,83,78,0.16)'
  ctx.beginPath()
  ctx.ellipse(140, BENCH_Y + 3, 112, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#78716c'
  ctx.beginPath()
  ctx.roundRect(PLATE_X, PLATE_Y, PLATE_W, PLATE_H, 4)
  ctx.fill()
  ctx.fillStyle = '#a8a29e'
  ctx.fillRect(PLATE_X, PLATE_Y, PLATE_W, 3)

  ctx.fillStyle = held === 'heat' ? '#f97316' : held === 'cool' ? '#60a5fa' : '#d6d3d1'
  ctx.beginPath()
  ctx.arc(PLATE_X + 16, PLATE_Y + 13, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#44403c'
  ctx.beginPath()
  ctx.roundRect(148, PLATE_Y + 5, 88, 16, 3)
  ctx.fill()
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = '#fb923c'
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${Math.round(temp)} °C`, 228, PLATE_Y + 17)

  // The band under the beaker base is where heat crosses into the substance,
  // so it has to keep glowing through a plateau.
  if (held) {
    ctx.fillStyle = held === 'heat' ? 'rgba(249,115,22,0.75)' : 'rgba(96,165,250,0.75)'
    ctx.beginPath()
    ctx.roundRect(BX - 5, PLATE_Y - 5, BW + 10, 6, 3)
    ctx.fill()
  }

  ctx.fillStyle = INK_MID
  ctx.font = '700 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    held === 'heat' ? 'heat going in' : held === 'cool' ? 'heat coming out' : 'plate off',
    140,
    BENCH_Y + 18,
  )
}

function drawBeakerGlass(ctx) {
  ctx.strokeStyle = GLASS
  ctx.lineWidth = 4
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(BX - 2, BY)
  ctx.lineTo(BX - 2, BY + BH)
  ctx.lineTo(BX + BW + 2, BY + BH)
  ctx.lineTo(BX + BW + 2, BY)
  ctx.stroke()

  // Graduation marks on the left wall, long and short alternating the way a
  // real beaker's are.
  ctx.strokeStyle = 'rgba(87,83,78,0.45)'
  ctx.lineWidth = 1.5
  for (let k = 1; k <= 4; k += 1) {
    const y = BY + BH - (k * BH) / 5
    ctx.beginPath()
    ctx.moveTo(BX + 1, y)
    ctx.lineTo(BX + (k % 2 === 0 ? 16 : 10), y)
    ctx.stroke()
  }
}

function drawBeakerRim(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.strokeStyle = GLASS
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(BX - 8, BY - 5, BW + 16, 9, 4)
  ctx.fill()
  ctx.stroke()

  // Pour lip on the right.
  ctx.beginPath()
  ctx.moveTo(BX + BW + 6, BY - 3)
  ctx.quadraticCurveTo(BX + BW + 20, BY + 2, BX + BW + 6, BY + 8)
  ctx.stroke()
}

function drawLiquid(ctx, stateId, tick) {
  if (!IS_POOLED[stateId]) return
  ctx.fillStyle = 'rgba(59,175,169,0.20)'
  ctx.fillRect(BX, POOL_Y, BW, BY + BH - POOL_Y)

  if (stateId === 'boiling') {
    ctx.strokeStyle = 'rgba(59,175,169,0.8)'
    ctx.lineWidth = 1.5
    const span = BY + BH - POOL_Y
    for (let i = 0; i < 3; i += 1) {
      const y = BY + BH - 8 - ((tick * 1.6 + i * 41) % span)
      ctx.beginPath()
      ctx.arc(BX + 34 + i * 42, y, 3.5, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}

function drawMeniscus(ctx, stateId) {
  if (!IS_POOLED[stateId]) return
  ctx.strokeStyle = '#3BAFA9'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(BX, POOL_Y - 4)
  ctx.quadraticCurveTo(BX + BW / 2, POOL_Y + 7, BX + BW, POOL_Y - 4)
  ctx.stroke()
}

function drawThermometer(ctx, temp) {
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.strokeStyle = GLASS
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(TX - 5, T_TOP, 10, T_BULB_Y - T_TOP, 5)
  ctx.fill()
  ctx.stroke()

  const top = yCol(temp)
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.roundRect(TX - 2.5, top, 5, T_COL_BOT - top, 2.5)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(TX, T_BULB_Y, 9, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = GLASS
  ctx.stroke()

  // Only the two temperatures the lesson turns on get a mark.
  ctx.strokeStyle = 'rgba(87,83,78,0.8)'
  ctx.lineWidth = 1.5
  for (const t of [0, 100]) {
    const y = yCol(t)
    ctx.beginPath()
    ctx.moveTo(TX - 10, y)
    ctx.lineTo(TX - 6, y)
    ctx.moveTo(TX + 6, y)
    ctx.lineTo(TX + 10, y)
    ctx.stroke()
  }
}

function drawBellJar(ctx) {
  ctx.fillStyle = 'rgba(168,85,247,0.07)'
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(26, BENCH_Y)
  ctx.lineTo(26, 170)
  ctx.quadraticCurveTo(140, 50, 254, 170)
  ctx.lineTo(254, BENCH_Y)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = 'rgba(168,85,247,0.22)'
  ctx.beginPath()
  ctx.roundRect(18, BENCH_Y - 6, 244, 9, 4)
  ctx.fill()
}

// Colour alone never says which state this is.
function drawTag(ctx, text, y, fill, stroke, ink, font) {
  ctx.font = font
  const w = ctx.measureText(text).width + 22
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(14, y, w, 26, 13)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.fillText(text, 25, y + 18)
}

function drawChart(ctx, { vacuum, energy, maxE }) {
  ctx.save()
  ctx.shadowColor = 'rgba(41,37,36,0.20)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(SHEET_X, SHEET_Y, SHEET_W, SHEET_H, 6)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(SHEET_X, SHEET_Y, SHEET_W, SHEET_H, 6)
  ctx.clip()
  ctx.strokeStyle = 'rgba(148,163,184,0.32)'
  ctx.lineWidth = 1
  for (let x = SHEET_X + 17; x < SHEET_X + SHEET_W; x += 17) {
    ctx.beginPath()
    ctx.moveTo(x, SHEET_Y)
    ctx.lineTo(x, SHEET_Y + SHEET_H)
    ctx.stroke()
  }
  for (let y = SHEET_Y + 17; y < SHEET_Y + SHEET_H; y += 17) {
    ctx.beginPath()
    ctx.moveTo(SHEET_X, y)
    ctx.lineTo(SHEET_X + SHEET_W, y)
    ctx.stroke()
  }
  ctx.restore()

  ctx.strokeStyle = RULE
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(SHEET_X, SHEET_Y, SHEET_W, SHEET_H, 6)
  ctx.stroke()

  // The two temperatures a change of state happens at.
  ctx.strokeStyle = 'rgba(87,83,78,0.5)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 4])
  for (const t of [0, 100]) {
    ctx.beginPath()
    ctx.moveTo(GX0, py(t))
    ctx.lineTo(GX1, py(t))
    ctx.stroke()
  }
  ctx.setLineDash([])

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
  for (const t of [-20, 0, 50, 100, 130]) {
    ctx.fillText(`${t}`, GX0 - 7, py(t) + 4)
  }
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.fillText('temperature °C', GX0 - 6, GY_TOP - 16)
  ctx.textAlign = 'center'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillStyle = INK_MID
  ctx.fillText('heat added over time', (GX0 + GX1) / 2, GY_BOT + 22)

  // The dashed line is how far the run has ever got; the solid one is where the
  // head is now, so cooling visibly walks it back.
  const trace = (limit, colour, width, dash) => {
    ctx.strokeStyle = colour
    ctx.lineWidth = width
    ctx.lineJoin = 'round'
    ctx.setLineDash(dash)
    ctx.beginPath()
    for (let e = 0; e <= limit; e += 0.5) {
      const x = px(e)
      const y = py(tempFor(e, vacuum))
      if (e === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }
  if (maxE > energy) trace(maxE, '#a8a29e', 2, [5, 4])
  trace(energy, '#f97316', 3.5, [])

  // A plateau is only named once the student has actually drawn it.
  const band = (from, to, t, text) => {
    if (maxE < to) return
    ctx.fillStyle = 'rgba(249,115,22,0.16)'
    ctx.fillRect(px(from), py(t) - 5, px(to) - px(from), 10)
    ctx.fillStyle = '#c2410c'
    ctx.font = '800 11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(text, (px(from) + px(to)) / 2, py(t) - 10)
  }
  if (vacuum) {
    band(E_MELT_START, E_MELT_END, 0, 'subliming, 0 °C')
  } else {
    band(E_MELT_START, E_MELT_END, 0, 'melting, 0 °C')
    band(E_BOIL_START, E_BOIL_END, 100, 'boiling, 100 °C')
  }

  ctx.fillStyle = '#f97316'
  ctx.strokeStyle = 'rgba(41,37,36,0.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(px(energy), py(tempFor(energy, vacuum)), 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
}

function drawScene(ctx, { state, parts, held, vacuum, energy, maxE, temp, tick }) {
  drawRoom(ctx)
  drawChart(ctx, { vacuum, energy, maxE })
  drawPlate(ctx, held, temp)
  drawBeakerGlass(ctx)
  drawLiquid(ctx, state.id, tick)

  // Bonds are drawn from the lattice sites, so they only appear while the
  // particles are actually locked onto them.
  if (IS_SOLID[state.id]) {
    ctx.strokeStyle = 'rgba(87,83,78,0.35)'
    ctx.lineWidth = 1.5
    for (let a = 0; a < parts.length; a += 1) {
      for (let b = a + 1; b < parts.length; b += 1) {
        const dx = parts[a].x - parts[b].x
        const dy = parts[a].y - parts[b].y
        if (Math.hypot(dx, dy) > BOND_REACH) continue
        ctx.beginPath()
        ctx.moveTo(parts[a].x, parts[a].y)
        ctx.lineTo(parts[b].x, parts[b].y)
        ctx.stroke()
      }
    }
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

  drawMeniscus(ctx, state.id)
  drawThermometer(ctx, temp)
  drawBeakerRim(ctx)
  if (vacuum) drawBellJar(ctx)

  drawTag(ctx, state.label, 30, 'rgba(255,255,255,0.94)', RULE, INK, '800 14px system-ui, sans-serif')
  if (vacuum) {
    drawTag(ctx, 'vacuum, no air', 62, 'rgba(168,85,247,0.16)', '#a855f7', '#6b21a8', '700 11px system-ui, sans-serif')
  }
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
        const top = IS_POOLED[st.id] ? POOL_Y : BY + R
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
  }, [energy, vacuum, maxE, held])

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
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Ice in a beaker on a hotplate at ${temp} degrees Celsius, currently ${state.label}, with the heating curve drawn on the chart beside it.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${state.panel}`}>
              <p className="text-2xl font-black text-stone-900 dark:text-white">{temp} °C</p>
              <p className="mt-0.5 text-sm font-black text-stone-700 dark:text-stone-200">
                {state.label}
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

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Curve drawn: {done.length} of {GOALS.length}
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
        {temp} degrees Celsius. {state.label}. {done.length} of {GOALS.length} parts of the
        curve drawn.
      </p>
    </>
  )
}
