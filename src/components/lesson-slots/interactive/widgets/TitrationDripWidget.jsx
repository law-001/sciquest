import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w07-l2 signature interactive — a titration you run one drop at a time.
//
// The pH is not looked up. It is solved from how much acid is left after the
// base that has actually landed in the flask, through the same water-equilibrium
// expression a chemist would use — which is why the needle crawls for thirty
// drops and then jumps most of the scale on the fortieth.
//
// H⁺ and OH⁻ are drawn as real particles that disappear in pairs and leave water
// behind, salt builds on the floor as they go, and overshooting is allowed: the
// indicator flips pink one drop past the endpoint and the student has to start
// over to land on it.

const W = 620
const H = 340

const TIP_X = 164
const TIP_Y = 174
const NECK_Y = 208
const FLOOR_Y = 302
const SURFACE_Y = 236

const SCALE_X = 436
const SCALE_W = 52
const SCALE_TOP = 40
const SCALE_BOT = 306

const V_L = 0.1
const ACID_MMOL = 2.0
const DROP_MMOL = 0.05
const MAX_BASE = 3.0
const KW = 1e-14

const GOALS = [
  { id: 'salt', label: 'Salt formed in the flask', hint: 'Keep dripping. Crystals build as H⁺ and OH⁻ pair off into water.' },
  { id: 'endpoint', label: 'pH 7 reached exactly', hint: 'Slow down near the end — the last drop before neutral is the one that matters.' },
  { id: 'flip', label: 'Indicator flipped past the endpoint', hint: 'Add one drop too many and watch the flask go pink.' },
]

// Universal-indicator colours, so the scale is a real scale and not a gradient.
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

const halfWidthAt = (y) => 34 + ((y - NECK_Y) / (FLOOR_Y - NECK_Y)) * 44
const scaleY = (ph) => SCALE_TOP + (ph / 14) * (SCALE_BOT - SCALE_TOP)

function makeParticles() {
  return Array.from({ length: 90 }, () => {
    const a = Math.random() * Math.PI * 2
    const y = SURFACE_Y + 8 + Math.random() * (FLOOR_Y - SURFACE_Y - 20)
    return {
      x: TIP_X + (Math.random() - 0.5) * halfWidthAt(y) * 1.5,
      y,
      vx: Math.cos(a) * 0.9,
      vy: Math.sin(a) * 0.9,
    }
  })
}

function drawScene(ctx, { parts, red, water, blue, drops, ph, base, salt }) {
  ctx.clearRect(0, 0, W, H)

  // ── Burette ──
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 3
  ctx.strokeRect(TIP_X - 15, 20, 30, 132)
  ctx.fillStyle = 'rgba(96,165,250,0.35)'
  const buretteFill = 20 + (base / MAX_BASE) * 128
  ctx.fillRect(TIP_X - 13, buretteFill, 26, 152 - buretteFill)
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(TIP_X - 6, 152)
  ctx.lineTo(TIP_X - 3, TIP_Y)
  ctx.lineTo(TIP_X + 3, TIP_Y)
  ctx.lineTo(TIP_X + 6, 152)
  ctx.stroke()
  ctx.fillStyle = '#78716c'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('NaOH', TIP_X + 22, 34)
  ctx.fillText(`${base.toFixed(2)} mmol added`, TIP_X + 22, 50)

  // ── Drops in flight ──
  ctx.fillStyle = '#60a5fa'
  for (const d of drops) {
    ctx.beginPath()
    ctx.ellipse(TIP_X, d.y, 4, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Flask ──
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(TIP_X - 24, 186)
  ctx.lineTo(TIP_X - 34, NECK_Y)
  ctx.lineTo(TIP_X - 78, FLOOR_Y)
  ctx.lineTo(TIP_X + 78, FLOOR_Y)
  ctx.lineTo(TIP_X + 34, NECK_Y)
  ctx.lineTo(TIP_X + 24, 186)
  ctx.stroke()

  // Phenolphthalein: colourless until 8.2, then pink. The flip is one drop
  // past the endpoint, which is exactly why overshooting is easy.
  const pink = Math.max(0, Math.min(1, (ph - 8.2) / 0.8))
  ctx.fillStyle =
    pink > 0
      ? `rgba(236,72,153,${(0.15 + pink * 0.4).toFixed(3)})`
      : 'rgba(148,196,214,0.22)'
  ctx.beginPath()
  ctx.moveTo(TIP_X - halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.lineTo(TIP_X - 76, FLOOR_Y - 2)
  ctx.lineTo(TIP_X + 76, FLOOR_Y - 2)
  ctx.lineTo(TIP_X + halfWidthAt(SURFACE_Y), SURFACE_Y)
  ctx.closePath()
  ctx.fill()

  // ── Ions and the water they make ──
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

  // ── Salt on the floor ──
  ctx.fillStyle = '#f5f5f4'
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1
  for (let k = 0; k < salt; k += 1) {
    const x = TIP_X - 66 + (k % 12) * 11
    const y = FLOOR_Y - 7 - Math.floor(k / 12) * 9
    ctx.beginPath()
    ctx.rect(x, y, 7, 6)
    ctx.fill()
    ctx.stroke()
  }

  ctx.fillStyle = '#78716c'
  ctx.font = '700 11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('100 mL HCl + phenolphthalein', TIP_X, FLOOR_Y + 20)
  ctx.fillText(
    `H⁺ ${red}   ·   OH⁻ ${blue}   ·   H₂O ${water}`,
    TIP_X,
    FLOOR_Y + 36,
  )

  // ── pH scale ──
  for (let p = 0; p < 14; p += 1) {
    ctx.fillStyle = BANDS[p]
    ctx.fillRect(SCALE_X, scaleY(p), SCALE_W, (SCALE_BOT - SCALE_TOP) / 14 + 0.5)
  }
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 2
  ctx.strokeRect(SCALE_X, SCALE_TOP, SCALE_W, SCALE_BOT - SCALE_TOP)

  ctx.fillStyle = '#78716c'
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const p of [0, 2, 4, 6, 7, 8, 10, 12, 14]) {
    ctx.fillText(`${p}`, SCALE_X - 5, scaleY(p) + 4)
  }
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('pH', SCALE_X + SCALE_W / 2, SCALE_TOP - 12)

  // The needle.
  const ny = scaleY(Math.max(0, Math.min(14, ph)))
  ctx.fillStyle = '#1c1917'
  ctx.beginPath()
  ctx.moveTo(SCALE_X + SCALE_W + 4, ny)
  ctx.lineTo(SCALE_X + SCALE_W + 20, ny - 8)
  ctx.lineTo(SCALE_X + SCALE_W + 20, ny + 8)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#78716c'
  ctx.font = '900 16px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(ph.toFixed(2), SCALE_X + SCALE_W + 26, ny + 6)
}

export default function TitrationDripWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const dropsRef = useRef([])
  const baseRef = useRef(0)
  const applyRef = useRef(null)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [base, setBase] = useState(0)
  const [held, setHeld] = useState(false)
  const [done, setDone] = useState([])

  const ph = phFor(base)
  const neutralised = Math.min(base, ACID_MMOL)

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

      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        const hw = halfWidthAt(p.y) - 8
        if (p.x < TIP_X - hw) { p.x = TIP_X - hw; p.vx = Math.abs(p.vx) }
        if (p.x > TIP_X + hw) { p.x = TIP_X + hw; p.vx = -Math.abs(p.vx) }
        if (p.y < SURFACE_Y + 6) { p.y = SURFACE_Y + 6; p.vy = Math.abs(p.vy) }
        if (p.y > FLOOR_Y - 8) { p.y = FLOOR_Y - 8; p.vy = -Math.abs(p.vy) }
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
      ? { label: 'Neutral — the endpoint', panel: 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25', note: 'Every H⁺ has found an OH⁻. What is left in the flask is water and dissolved salt, and nothing else.' }
      : ph < 7
        ? { label: 'Acidic — H⁺ still in excess', panel: 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25', note: 'There are more H⁺ ions than OH⁻ ions. Each drop pairs some off and the count of red particles falls.' }
        : { label: 'Basic — you have gone past it', panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15', note: 'The acid ran out and the OH⁻ has nothing left to react with. The indicator flipped pink on the first drop past neutral.' }

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Titration flask at pH ${ph.toFixed(2)}, ${status.label}, after ${base.toFixed(2)} millimoles of sodium hydroxide.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${status.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                pH {ph.toFixed(2)} — {status.label}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {status.note}
              </p>
              <p className="mt-2 text-xs font-black text-stone-900 dark:text-white">
                HCl + NaOH → NaCl + H₂O · {neutralised.toFixed(2)} mmol of salt made
              </p>
            </div>

            <button
              type="button"
              onClick={() => release(1)}
              disabled={base >= MAX_BASE}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              💧 Release one drop
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
              Hold to open the tap
            </button>

            <button
              type="button"
              onClick={reset}
              className="min-h-11 w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm font-black text-stone-600 transition-colors dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
            >
              Fresh flask of acid
            </button>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Forty drops take it to neutral. Drop forty-one turns it pink — overshoot it
              once on purpose, then start over and land on it.
            </p>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Titration log — {done.length} of {GOALS.length}
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
        pH {ph.toFixed(2)} — {status.label}. {base.toFixed(2)} millimoles of base added.
      </p>
    </>
  )
}
