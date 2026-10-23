import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w07-l2 signature interactive: a titration you run one drop at a time.
//
// The pH is not looked up. It is solved from how much acid is left after the
// base that has actually landed in the flask, through the same water
// equilibrium a chemist would use, which is why the needle crawls for thirty
// drops and then jumps most of the scale on the fortieth.
//
// H⁺ and OH⁻ are drawn as real particles that disappear in pairs and leave
// water behind, salt builds on the floor of the flask as they go, and
// overshooting is allowed: the indicator flips pink one drop past the endpoint
// and the student has to start over to land on it.
//
// The scene paints its own wall and bench, so its contrast is the same on cream
// and on stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall and bench run past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 344

const STAND_X = 12
const STAND_W = 112
const ROD_X = 58
const ROD_W = 12

const TIP_X = 210
const TUBE_TOP = 40
const TUBE_BOT = 170
const TAP_Y = 182
const TIP_Y = 212

const NECK_TOP = 224
const NECK_Y = 248
const FLOOR_Y = 340
const SURFACE_Y = 276

const SHEET_X = 330
const SHEET_Y = 24
const SHEET_W = 264
const SHEET_H = 296

const SCALE_X = 396
const SCALE_W = 46
const SCALE_TOP = 76
const SCALE_BOT = 286

const V_L = 0.1
const ACID_MMOL = 2.0
const DROP_MMOL = 0.05
const MAX_BASE = 3.0
const KW = 1e-14

const INK = '#57534e'
const INK_MID = '#78716c'

const GOALS = [
  {
    id: 'salt',
    label: 'Salt formed in the flask',
    hint: 'Keep dripping. Crystals build on the flask floor.',
  },
  {
    id: 'endpoint',
    label: 'pH 7 reached',
    hint: 'Slow down near the end. Land the needle on 7.',
  },
  {
    id: 'flip',
    label: 'Indicator flipped past pH 7',
    hint: 'Add one drop past neutral and the flask turns pink.',
  },
]

// Universal indicator colours, so the scale is a real scale and not a gradient.
const BANDS = [
  '#E53935', '#E53935', '#F4511E', '#FB8C00', '#FDD835', '#C0CA33', '#8BC34A',
  '#43A047', '#26A69A', '#1E88E5', '#3949AB', '#5E35B1', '#6A1B9A', '#6A1B9A',
]

function phFor(baseMmol) {
  const net = (ACID_MMOL - baseMmol) / 1000 / V_L
  let h
  if (net >= 0) {
    h = (net + Math.sqrt(net * net + 4 * KW)) / 2
  } else {
    const oh = (-net + Math.sqrt(net * net + 4 * KW)) / 2
    h = KW / oh
  }
  return -Math.log10(h)
}

const halfWidthAt = (y) => 20 + ((y - NECK_Y) / (FLOOR_Y - NECK_Y)) * 62
const scaleY = (ph) => SCALE_TOP + (ph / 14) * (SCALE_BOT - SCALE_TOP)

function makeParticles() {
  return Array.from({ length: 90 }, () => {
    const a = Math.random() * Math.PI * 2
    const y = SURFACE_Y + 10 + Math.random() * (FLOOR_Y - SURFACE_Y - 24)
    return {
      x: TIP_X + (Math.random() - 0.5) * halfWidthAt(y) * 1.4,
      y,
      vx: Math.cos(a) * 0.9,
      vy: Math.sin(a) * 0.9,
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

// The retort stand is what makes the burette hang in mid air instead of float.
// The clamp reaches across to the tube and grips it.
function drawStand(ctx) {
  ctx.fillStyle = 'rgba(87,83,78,0.18)'
  ctx.beginPath()
  ctx.ellipse(STAND_X + STAND_W / 2, BENCH_Y + 3, STAND_W / 2 + 10, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#78716c'
  ctx.beginPath()
  ctx.roundRect(STAND_X, BENCH_Y - 14, STAND_W, 14, 3)
  ctx.fill()
  ctx.fillStyle = '#a8a29e'
  ctx.fillRect(STAND_X, BENCH_Y - 14, STAND_W, 3)

  ctx.fillStyle = '#a8a29e'
  ctx.fillRect(ROD_X, 56, ROD_W, BENCH_Y - 14 - 56)
  ctx.fillStyle = '#d6d3d1'
  ctx.fillRect(ROD_X, 56, 3, BENCH_Y - 14 - 56)

  ctx.fillStyle = '#78716c'
  ctx.beginPath()
  ctx.roundRect(ROD_X - 4, 140, 22, 24, 4)
  ctx.fill()
  ctx.fillRect(ROD_X + 14, 146, TIP_X - 18 - (ROD_X + 14), 10)
  ctx.beginPath()
  ctx.roundRect(TIP_X - 22, 138, 12, 26, 4)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(TIP_X + 10, 138, 12, 26, 4)
  ctx.fill()
}

// The burette: tube, graduations, stopcock. The tap handle turns while the
// student holds the drip button, so the control has a moving part on screen.
function drawBurette(ctx, base, open) {
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillRect(TIP_X - 15, TUBE_TOP, 30, TUBE_BOT - TUBE_TOP)

  const fillTop = TUBE_TOP + (base / MAX_BASE) * (TUBE_BOT - TUBE_TOP - 6)
  ctx.fillStyle = 'rgba(96,165,250,0.4)'
  ctx.fillRect(TIP_X - 13, fillTop, 26, TUBE_BOT - fillTop - 2)

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 3
  ctx.strokeRect(TIP_X - 15, TUBE_TOP, 30, TUBE_BOT - TUBE_TOP)

  ctx.strokeStyle = 'rgba(87,83,78,0.55)'
  for (let i = 1; i < 10; i += 1) {
    const y = TUBE_TOP + (i / 10) * (TUBE_BOT - TUBE_TOP)
    const major = i % 5 === 0
    ctx.lineWidth = major ? 1.8 : 1
    ctx.beginPath()
    ctx.moveTo(TIP_X - 14, y)
    ctx.lineTo(TIP_X - 14 + (major ? 14 : 8), y)
    ctx.stroke()
  }

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(TIP_X - 15, TUBE_BOT)
  ctx.lineTo(TIP_X - 4, TIP_Y)
  ctx.lineTo(TIP_X + 4, TIP_Y)
  ctx.lineTo(TIP_X + 15, TUBE_BOT)
  ctx.stroke()

  ctx.fillStyle = '#78716c'
  ctx.beginPath()
  ctx.arc(TIP_X, TAP_Y, 9, 0, Math.PI * 2)
  ctx.fill()
  ctx.save()
  ctx.translate(TIP_X, TAP_Y)
  ctx.rotate(open ? Math.PI / 2 : 0)
  ctx.fillStyle = '#f97316'
  ctx.beginPath()
  ctx.roundRect(-3, -20, 6, 20, 3)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = INK
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('NaOH base', TIP_X + 32, 62)
  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.fillText(`${base.toFixed(2)} mmol added`, TIP_X + 32, 78)
  ctx.strokeStyle = 'rgba(120,113,108,0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(TIP_X + 28, 58)
  ctx.lineTo(TIP_X + 17, 70)
  ctx.stroke()
}

function drawFlaskGlass(ctx) {
  ctx.fillStyle = 'rgba(87,83,78,0.18)'
  ctx.beginPath()
  ctx.ellipse(TIP_X, BENCH_Y + 2, 96, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.beginPath()
  ctx.moveTo(TIP_X - 20, NECK_TOP)
  ctx.lineTo(TIP_X - 20, NECK_Y)
  ctx.lineTo(TIP_X - 82, FLOOR_Y)
  ctx.lineTo(TIP_X + 82, FLOOR_Y)
  ctx.lineTo(TIP_X + 20, NECK_Y)
  ctx.lineTo(TIP_X + 20, NECK_TOP)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(TIP_X - 20, NECK_TOP)
  ctx.lineTo(TIP_X - 20, NECK_Y)
  ctx.lineTo(TIP_X - 82, FLOOR_Y)
  ctx.lineTo(TIP_X + 82, FLOOR_Y)
  ctx.lineTo(TIP_X + 20, NECK_Y)
  ctx.lineTo(TIP_X + 20, NECK_TOP)
  ctx.stroke()

  ctx.beginPath()
  ctx.ellipse(TIP_X, NECK_TOP, 20, 5, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.stroke()
}

// Phenolphthalein: colourless until 8.2, then pink. The flip lands one drop
// past the endpoint, which is exactly why overshooting is easy.
function drawFlaskLiquid(ctx, ph) {
  const pink = Math.max(0, Math.min(1, (ph - 8.2) / 0.8))
  ctx.fillStyle =
    pink > 0
      ? `rgba(236,72,153,${(0.15 + pink * 0.4).toFixed(3)})`
      : 'rgba(148,196,214,0.24)'
  ctx.beginPath()
  ctx.moveTo(TIP_X - halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.lineTo(TIP_X - 80, FLOOR_Y - 2)
  ctx.lineTo(TIP_X + 80, FLOOR_Y - 2)
  ctx.lineTo(TIP_X + halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = pink > 0 ? '#db2777' : '#7BC9CF'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(TIP_X - halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.quadraticCurveTo(TIP_X, SURFACE_Y + 7, TIP_X + halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.stroke()
}

// The salt is the product the lesson names, so it is drawn as crystals that
// stack up rather than counted in a readout.
function drawSalt(ctx, crystals) {
  ctx.fillStyle = '#f5f5f4'
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1
  for (let k = 0; k < crystals; k += 1) {
    const row = Math.floor(k / 12)
    const x = TIP_X - 66 + (k % 12) * 11 + (row % 2) * 5
    const y = FLOOR_Y - 8 - row * 8
    ctx.beginPath()
    ctx.rect(x, y, 7, 6)
    ctx.fill()
    ctx.stroke()
  }
}

function drawChart(ctx, ph, red, blue, water) {
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

  ctx.fillStyle = INK
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('pH scale', SHEET_X + SHEET_W / 2, SHEET_Y + 34)

  for (let p = 0; p < 14; p += 1) {
    ctx.fillStyle = BANDS[p]
    ctx.fillRect(SCALE_X, scaleY(p), SCALE_W, (SCALE_BOT - SCALE_TOP) / 14 + 0.5)
  }
  ctx.strokeStyle = INK_MID
  ctx.lineWidth = 2.5
  ctx.strokeRect(SCALE_X, SCALE_TOP, SCALE_W, SCALE_BOT - SCALE_TOP)

  ctx.fillStyle = INK_MID
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const p of [0, 2, 4, 6, 7, 8, 10, 12, 14]) {
    ctx.fillText(`${p}`, SCALE_X - 8, scaleY(p) + 4)
  }

  // Every band is named as well as coloured, so the scale never relies on
  // colour alone.
  ctx.fillStyle = INK
  ctx.font = '800 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('acid', SHEET_X + 12, scaleY(3) + 4)
  ctx.fillText('neutral', SHEET_X + 12, scaleY(7) + 4)
  ctx.fillText('base', SHEET_X + 12, scaleY(11) + 4)

  const ny = scaleY(Math.max(0, Math.min(14, ph)))
  ctx.fillStyle = '#1c1917'
  ctx.beginPath()
  ctx.moveTo(SCALE_X + SCALE_W + 4, ny)
  ctx.lineTo(SCALE_X + SCALE_W + 20, ny - 8)
  ctx.lineTo(SCALE_X + SCALE_W + 20, ny + 8)
  ctx.closePath()
  ctx.fill()
  ctx.font = '900 16px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(ph.toFixed(2), SCALE_X + SCALE_W + 26, ny + 6)

  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    `H⁺ ${red}   ·   OH⁻ ${blue}   ·   H₂O ${water}`,
    SHEET_X + SHEET_W / 2,
    SHEET_Y + SHEET_H - 14,
  )
}

function drawScene(ctx, { parts, red, water, blue, drops, ph, base, salt, open }) {
  ctx.clearRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2)

  drawRoom(ctx)
  drawChart(ctx, ph, red, blue, water)
  drawStand(ctx)
  drawBurette(ctx, base, open)

  ctx.fillStyle = '#60a5fa'
  for (const d of drops) {
    ctx.beginPath()
    ctx.ellipse(TIP_X, d.y, 4, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  drawFlaskGlass(ctx)
  drawFlaskLiquid(ctx, ph)

  let i = 0
  const paint = (n, colour, radius) => {
    ctx.fillStyle = colour
    for (let k = 0; k < n && i < parts.length; k += 1, i += 1) {
      ctx.beginPath()
      ctx.arc(parts[i].x, parts[i].y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  paint(red, '#dc2626', 4.2)
  paint(blue, '#2563eb', 4.2)
  paint(water, 'rgba(120,113,108,0.55)', 3.2)

  drawSalt(ctx, salt)

  // In-picture labels, each on a leader line to the part it names.
  if (salt > 0) {
    ctx.strokeStyle = 'rgba(120,113,108,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(300, 322)
    ctx.lineTo(TIP_X + 62, FLOOR_Y - 12)
    ctx.stroke()
    ctx.fillStyle = INK
    ctx.font = '800 11px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('salt crystals', 304, 320)
  }

  ctx.fillStyle = INK_MID
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('100 mL acid, indicator added', TIP_X, BENCH_Y + 20)
}

export default function TitrationDripWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const dropsRef = useRef([])
  const baseRef = useRef(0)
  const heldRef = useRef(false)
  const applyRef = useRef(null)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [base, setBase] = useState(0)
  const [held, setHeld] = useState(false)
  const [done, setDone] = useState([])

  const ph = phFor(base)
  const neutralised = Math.min(base, ACID_MMOL)

  useEffect(() => {
    heldRef.current = held
  }, [held])

  const apply = useCallback(
    (n) => {
      const next = Math.min(MAX_BASE, baseRef.current + DROP_MMOL * n)
      baseRef.current = next
      setBase(next)

      const marks = []
      const nextPh = phFor(next)
      if (Math.min(next, ACID_MMOL) >= ACID_MMOL * 0.9) marks.push('salt')
      if (Math.abs(nextPh - 7) < 0.5) marks.push('endpoint')
      if (nextPh >= 8.2) marks.push('flip')
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
    },
    [onSolved],
  )

  useEffect(() => {
    applyRef.current = apply
  }, [apply])

  // With reduced motion there is no loop to land the drop, so the drop takes
  // effect straight away instead of falling.
  const release = useCallback((n) => {
    if (stillRef.current) {
      applyRef.current?.(n)
      return
    }
    for (let i = 0; i < n; i += 1) {
      dropsRef.current.push({ y: TIP_Y + 2 - i * 16, vy: 1 })
    }
  }, [])

  useEffect(() => {
    if (!held) return undefined
    const id = setInterval(() => release(1), 150)
    return () => clearInterval(id)
  }, [held, release])

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
      const b = baseRef.current
      const parts = partsRef.current

      if (!still) {
        for (const p of parts) {
          p.x += p.vx
          p.y += p.vy
          const hw = halfWidthAt(p.y) - 8
          if (p.x < TIP_X - hw) { p.x = TIP_X - hw; p.vx = Math.abs(p.vx) }
          if (p.x > TIP_X + hw) { p.x = TIP_X + hw; p.vx = -Math.abs(p.vx) }
          if (p.y < SURFACE_Y + 8) { p.y = SURFACE_Y + 8; p.vy = Math.abs(p.vy) }
          if (p.y > FLOOR_Y - 10) { p.y = FLOOR_Y - 10; p.vy = -Math.abs(p.vy) }
        }

        const drops = dropsRef.current
        for (const d of drops) {
          d.y += d.vy
          d.vy += 0.34
        }
        const landed = drops.filter((d) => d.y >= SURFACE_Y).length
        if (landed) {
          dropsRef.current = drops.filter((d) => d.y < SURFACE_Y)
          applyRef.current?.(landed)
        }
      }

      const paired = Math.min(b, ACID_MMOL)
      drawScene(ctx, {
        parts,
        red: Math.round((ACID_MMOL - paired) / DROP_MMOL),
        water: Math.round(paired / DROP_MMOL),
        blue: Math.round(Math.max(0, b - ACID_MMOL) / DROP_MMOL),
        drops: dropsRef.current,
        ph: phFor(b),
        base: b,
        salt: Math.min(24, Math.round(paired / DROP_MMOL / 2)),
        open: heldRef.current,
      })

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [base])

  function reset() {
    dropsRef.current = []
    baseRef.current = 0
    setBase(0)
    setHeld(false)
  }

  const status =
    Math.abs(ph - 7) < 0.5
      ? {
          label: 'Neutral, the endpoint',
          panel: 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25',
          note: 'Every H⁺ found an OH⁻. Only water and salt are left.',
        }
      : ph < 7
        ? {
            label: 'Acidic, H⁺ still spare',
            panel: 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25',
            note: 'More H⁺ than OH⁻. Each drop pairs a few more off.',
          }
        : {
            label: 'Basic, you went past it',
            panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
            note: 'The acid ran out, so the spare OH⁻ turned the flask pink.',
          }

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`A burette clamped above a flask of acid. After ${base.toFixed(2)} millimoles of sodium hydroxide the wall chart reads pH ${ph.toFixed(2)}, ${status.label}.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${status.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                pH {ph.toFixed(2)}, {status.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {status.note}
              </p>
              <p className="mt-2 text-xs font-black text-stone-900 dark:text-white">
                HCl + NaOH → NaCl + H₂O · {neutralised.toFixed(2)} mmol salt
              </p>
            </div>

            <button
              type="button"
              onClick={() => release(1)}
              disabled={base >= MAX_BASE}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              💧 One drop
            </button>

            <button
              type="button"
              onPointerDown={() => setHeld(true)}
              onPointerUp={() => setHeld(false)}
              onPointerLeave={() => setHeld(false)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setHeld(true)}
              onKeyUp={() => setHeld(false)}
              onBlur={() => setHeld(false)}
              disabled={base >= MAX_BASE}
              className="min-h-11 w-full rounded-xl bg-secondary-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700 disabled:opacity-50"
            >
              Hold to drip
            </button>

            <button
              type="button"
              onClick={reset}
              className="min-h-11 w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm font-black text-stone-600 transition-colors dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
            >
              Fresh flask
            </button>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Forty drops reach neutral. Drop forty-one turns it pink.
            </p>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Titration log: {done.length} of {GOALS.length}
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
        pH {ph.toFixed(2)}, {status.label}. {base.toFixed(2)} millimoles of base added.
      </p>
    </>
  )
}
