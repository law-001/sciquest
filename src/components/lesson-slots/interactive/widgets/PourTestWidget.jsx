import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L4 second interactive — the empty-space proof.
//
// 50 mL of water poured into 50 mL of alcohol does not measure 100 mL. The
// small alcohol particles drop into the gaps already between the larger water
// ones, so the mixture packs tighter than the two liquids did apart. Lesson 4
// asserts there is empty space between particles; this is the bench measurement
// that shows it.
//
// The mixing vessel is a volumetric flask because a narrow neck is the only
// thing that makes a four-millilitre shortfall visible at all — which is the
// real reason volumetric glassware is shaped that way.

const W = 680
const H = 360

const FLASK = {
  bottom: 330,
  bodyTop: 210,
  shoulderTop: 180,
  neckTop: 60,
  bodyL: 300,
  bodyR: 470,
  neckL: 372,
  neckR: 398,
}

// Capacity split across the two sections of the flask, in millilitres. The body
// swallows most of the volume; the neck magnifies whatever is left.
const BODY_ML = 90
const CAP_ML = 110
const SHOULDER_Y = 190

const SRC_TOP = 150
const SRC_BOTTOM = 330
const SRC_ML = 50

const WATER = { colour: '#3BAFA9', r: 7, x: [40, 120] }
const ALCOHOL = { colour: '#E08A3C', r: 4, x: [145, 225] }
const N_EACH = 26

const GLASS = 'rgba(120,113,108,0.85)'
const INK = 'rgba(87,83,78,0.95)'
const MARK = '#E2683C'

const LENS = { cx: 578, cy: 132, r: 78, fromX: 385, fromY: 285, zoom: 2.6 }

// Mixing water and alcohol loses about 4 mL out of 100 — the two liquids pack
// into each other. A partial mix loses proportionally less.
const shrinkFor = (w, a) => 4 * (Math.min(w, a) / SRC_ML)

function surfaceY(v) {
  if (v <= BODY_ML) return FLASK.bottom - (v / BODY_ML) * (FLASK.bottom - SHOULDER_Y)
  return SHOULDER_Y - ((v - BODY_ML) / (CAP_ML - BODY_ML)) * (SHOULDER_Y - FLASK.neckTop)
}

// Interior walls of the flask at a given height, so particles are held by the
// shape that is drawn rather than by a bounding box.
function wallsAt(y) {
  if (y >= FLASK.bodyTop) return [FLASK.bodyL, FLASK.bodyR]
  if (y <= FLASK.shoulderTop) return [FLASK.neckL, FLASK.neckR]
  const t = (FLASK.bodyTop - y) / (FLASK.bodyTop - FLASK.shoulderTop)
  return [
    FLASK.neckL * t + FLASK.bodyL * (1 - t),
    FLASK.neckR * t + FLASK.bodyR * (1 - t),
  ]
}

function makePool(spec) {
  return Array.from({ length: N_EACH }, () => {
    const angle = Math.random() * Math.PI * 2
    return {
      x: spec.x[0] + spec.r + Math.random() * (spec.x[1] - spec.x[0] - spec.r * 2),
      y: SRC_TOP + spec.r + Math.random() * (SRC_BOTTOM - SRC_TOP - spec.r * 2),
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      inFlask: false,
    }
  })
}

function drift(p, xL, xR, top, bottom, r) {
  p.x += p.vx * 0.9
  p.y += p.vy * 0.9
  if (p.x < xL + r) { p.x = xL + r; p.vx = Math.abs(p.vx) }
  if (p.x > xR - r) { p.x = xR - r; p.vx = -Math.abs(p.vx) }
  if (p.y < top + r) { p.y = top + r; p.vy = Math.abs(p.vy) }
  if (p.y > bottom - r) { p.y = bottom - r; p.vy = -Math.abs(p.vy) }
}

const OBSERVATIONS = [
  {
    id: 'poured',
    text: 'Both liquids are in the flask.',
    hint: 'Pour in some water and some alcohol.',
  },
  {
    id: 'short',
    text: '50 mL + 50 mL does not measure 100 mL.',
    hint: 'Pour all 50 mL of each, then read the neck against the dashed line.',
  },
  {
    id: 'gaps',
    text: 'Up close, there are gaps between the particles.',
    hint: 'Switch the magnifier on and look inside the flask.',
  },
  {
    id: 'less',
    text: 'Mix less of one liquid and less volume goes missing.',
    hint: 'With the magnifier on, drop one slider to 10 mL or below.',
  },
]

export default function PourTestWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const waterRef = useRef(makePool(WATER))
  const alcoholRef = useRef(makePool(ALCOHOL))
  const liveRef = useRef({ water: 0, alcohol: 0, magnified: false })
  const drawRef = useRef(null)

  const [water, setWater] = useState(0)
  const [alcohol, setAlcohol] = useState(0)
  const [magnified, setMagnified] = useState(false)
  const [observed, setObserved] = useState([])

  const expected = water + alcohol
  const shrink = shrinkFor(water, alcohol)
  const actual = expected - shrink

  // The draw loop reads the controls through a ref so dragging a slider never
  // tears the simulation down and restarts it.
  useEffect(() => {
    liveRef.current = { water, alcohol, magnified }
  }, [water, alcohol, magnified])

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

    function flaskPath() {
      ctx.beginPath()
      ctx.moveTo(FLASK.neckL, FLASK.neckTop)
      ctx.lineTo(FLASK.neckL, FLASK.shoulderTop)
      ctx.lineTo(FLASK.bodyL, FLASK.bodyTop)
      ctx.lineTo(FLASK.bodyL, FLASK.bottom)
      ctx.lineTo(FLASK.bodyR, FLASK.bottom)
      ctx.lineTo(FLASK.bodyR, FLASK.bodyTop)
      ctx.lineTo(FLASK.neckR, FLASK.shoulderTop)
      ctx.lineTo(FLASK.neckR, FLASK.neckTop)
    }

    function bead(x, y, r, colour) {
      ctx.fillStyle = colour
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.beginPath()
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.32, 0, Math.PI * 2)
      ctx.fill()
    }

    function step() {
      const { water: w, alcohol: a, magnified: mag } = liveRef.current
      const total = w + a - shrinkFor(w, a)
      const top = surfaceY(total)
      const pools = [
        { pool: waterRef.current, spec: WATER, poured: w },
        { pool: alcoholRef.current, spec: ALCOHOL, poured: a },
      ]

      for (const { pool, spec, poured } of pools) {
        const moved = Math.round((poured / SRC_ML) * N_EACH)
        const srcTop = SRC_BOTTOM - ((SRC_ML - poured) / SRC_ML) * (SRC_BOTTOM - SRC_TOP)
        pool.forEach((p, i) => {
          const shouldBeInFlask = i < moved
          // A particle that has just been poured re-enters at the neck, so the
          // transfer reads as pouring rather than teleporting.
          if (shouldBeInFlask && !p.inFlask) {
            p.inFlask = true
            p.x = FLASK.neckL + spec.r + Math.random() * (FLASK.neckR - FLASK.neckL - spec.r * 2)
            p.y = FLASK.neckTop + spec.r
            p.vy = Math.abs(p.vy)
          } else if (!shouldBeInFlask && p.inFlask) {
            p.inFlask = false
            p.x = spec.x[0] + spec.r + Math.random() * (spec.x[1] - spec.x[0] - spec.r * 2)
            p.y = srcTop + spec.r
          }
          if (p.inFlask) {
            const [xL, xR] = wallsAt(p.y)
            drift(p, xL, xR, top, FLASK.bottom, spec.r)
          } else {
            drift(p, spec.x[0], spec.x[1], srcTop, SRC_BOTTOM, spec.r)
          }
        })
      }

      ctx.clearRect(0, 0, W, H)
      ctx.lineWidth = 2.5
      ctx.strokeStyle = GLASS
      ctx.font = '600 13px system-ui, sans-serif'
      ctx.textAlign = 'center'

      // Source cylinders, draining as they are poured out.
      for (const { spec, poured } of pools) {
        const srcTop = SRC_BOTTOM - ((SRC_ML - poured) / SRC_ML) * (SRC_BOTTOM - SRC_TOP)
        ctx.strokeRect(spec.x[0], SRC_TOP, spec.x[1] - spec.x[0], SRC_BOTTOM - SRC_TOP)
        ctx.strokeStyle = spec.colour
        ctx.beginPath()
        ctx.moveTo(spec.x[0], srcTop)
        ctx.lineTo(spec.x[1], srcTop)
        ctx.stroke()
        ctx.strokeStyle = GLASS
      }

      flaskPath()
      ctx.stroke()

      // Where the poured volume would reach if nothing were lost.
      if (w + a > 0) {
        const marked = surfaceY(w + a)
        ctx.save()
        ctx.setLineDash([6, 5])
        ctx.strokeStyle = MARK
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(FLASK.bodyL - 20, marked)
        ctx.lineTo(FLASK.bodyR + 16, marked)
        ctx.stroke()
        ctx.restore()
        ctx.fillStyle = MARK
        ctx.textAlign = 'left'
        ctx.fillText(`expected ${w + a} mL`, FLASK.bodyR + 22, marked + 4)
        ctx.textAlign = 'center'
      }

      // The surface actually measured.
      if (total > 0) {
        const [xL, xR] = wallsAt(top)
        ctx.strokeStyle = '#2F8F8A'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(xL, top)
        ctx.lineTo(xR, top)
        ctx.stroke()
        ctx.strokeStyle = GLASS
        ctx.lineWidth = 2.5
      }

      ctx.save()
      flaskPath()
      ctx.clip()
      for (const { pool, spec } of pools) {
        for (const p of pool) if (p.inFlask) bead(p.x, p.y, spec.r, spec.colour)
      }
      ctx.restore()

      for (const { pool, spec } of pools) {
        for (const p of pool) if (!p.inFlask) bead(p.x, p.y, spec.r, spec.colour)
      }

      ctx.fillStyle = INK
      ctx.fillText(`Water ${SRC_ML - w} mL`, (WATER.x[0] + WATER.x[1]) / 2, SRC_BOTTOM + 22)
      ctx.fillText(`Alcohol ${SRC_ML - a} mL`, (ALCOHOL.x[0] + ALCOHOL.x[1]) / 2, SRC_BOTTOM + 22)
      ctx.fillText(`${total.toFixed(1)} mL`, (FLASK.bodyL + FLASK.bodyR) / 2, FLASK.bottom + 22)

      // The magnifier shows the particles that are really there, scaled about a
      // point in the body, so the gaps on show are the simulation's own gaps.
      if (mag) {
        ctx.save()
        ctx.strokeStyle = GLASS
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(LENS.fromX, LENS.fromY)
        ctx.lineTo(LENS.cx, LENS.cy)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(LENS.cx, LENS.cy, LENS.r, 0, Math.PI * 2)
        ctx.clip()
        ctx.fillStyle = 'rgba(253,246,227,0.92)'
        ctx.fillRect(LENS.cx - LENS.r, LENS.cy - LENS.r, LENS.r * 2, LENS.r * 2)
        for (const { pool, spec } of pools) {
          for (const p of pool) {
            if (!p.inFlask) continue
            bead(
              LENS.cx + (p.x - LENS.fromX) * LENS.zoom,
              LENS.cy + (p.y - LENS.fromY) * LENS.zoom,
              spec.r * LENS.zoom,
              spec.colour,
            )
          }
        }
        ctx.restore()
        ctx.strokeStyle = INK
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(LENS.cx, LENS.cy, LENS.r, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  // A reduced-motion student gets no loop, so the scene is redrawn whenever a
  // control moves instead of being frozen on its first frame.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) drawRef.current?.()
  }, [water, alcohol, magnified])

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

  function pour(nextWater, nextAlcohol) {
    setWater(nextWater)
    setAlcohol(nextAlcohol)
    const low = Math.min(nextWater, nextAlcohol)
    const seen = []
    if (low > 0) seen.push('poured')
    if (nextWater === SRC_ML && nextAlcohol === SRC_ML) seen.push('short')
    if (magnified) seen.push('gaps')
    if (magnified && low > 0 && low <= 10) seen.push('less')
    if (seen.length) observe(seen)
  }

  function toggleMagnifier() {
    const next = !magnified
    setMagnified(next)
    if (!next) return
    const low = Math.min(water, alcohol)
    const seen = ['gaps']
    if (low > 0 && low <= 10) seen.push('less')
    observe(seen)
  }

  const reading =
    expected === 0
      ? 'Empty flask — pour something in.'
      : `Expected ${expected} mL, measured ${actual.toFixed(1)} mL. ${shrink.toFixed(1)} mL has gone missing.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Volumetric flask holding ${water} millilitres of water and ${alcohol} millilitres of alcohol, measuring ${actual.toFixed(1)} millilitres.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{reading}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Alcohol particles are smaller than water particles, so they drop into the
                empty spaces already between them. The mixture packs tighter than the two
                liquids did apart.
              </p>
            </div>

            <div>
              <label
                htmlFor="pour-water"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Water poured in — {water} mL
              </label>
              <input
                id="pour-water"
                type="range"
                min={0}
                max={SRC_ML}
                step={1}
                value={water}
                onChange={(e) => pour(Number(e.target.value), alcohol)}
                className="h-11 w-full accent-teal-500"
              />

              <label
                htmlFor="pour-alcohol"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Alcohol poured in — {alcohol} mL
              </label>
              <input
                id="pour-alcohol"
                type="range"
                min={0}
                max={SRC_ML}
                step={1}
                value={alcohol}
                onChange={(e) => pour(water, Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={toggleMagnifier}
              aria-pressed={magnified}
              className={`min-h-11 w-full rounded-xl border-2 px-3 py-2 text-xs font-black transition-colors ${
                magnified
                  ? 'border-secondary-500 bg-secondary-50 text-secondary-800 dark:bg-secondary-700/30 dark:text-secondary-100'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-orange-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {magnified ? 'Magnifier on — ×2.6 into the flask' : 'Magnifier off — switch it on'}
            </button>

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
        {reading} {observed.length} of {OBSERVATIONS.length} observations made.
      </p>
    </>
  )
}
