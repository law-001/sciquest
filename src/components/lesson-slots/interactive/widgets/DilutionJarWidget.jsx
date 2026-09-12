import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w07-l1 signature interactive — diluting without removing anything.
//
// The particles are stored in normalised coordinates inside the liquid, so when
// water goes in and the surface rises they are literally spread through a
// bigger space. The count on screen never changes while you add water — the
// colour lightens because the same number of particles is sharing more volume,
// which is the one thing about dilution that a still picture cannot show.
//
// The second route halves the solute instead: pour half the jar away and top it
// back up. Same volume, half the particles, and the concentration halves too.

const W = 620
const H = 330

const JX = 118
const JW = 236
const JY = 44
const JH = 254
const MAX_ML = 400
const MAX_G = 60

const COL_X = 470
const COL_W = 46
const COL_TOP = 62
const COL_BOT = 288
const COL_MAX_PCT = 26

const TARGET_PCT = 6
const TOLERANCE_PCT = 0.4

const GOALS = [
  { id: 'water', label: 'Diluted by adding water', hint: 'Add water. Count the particles before and after — the number does not change.' },
  { id: 'halve', label: 'Diluted by pouring half away', hint: 'Pour half the jar out and top it back up with water.' },
  { id: 'target', label: `Hit ${TARGET_PCT.toFixed(1)} % m/m`, hint: `Get the readout inside ${(TARGET_PCT - TOLERANCE_PCT).toFixed(1)} – ${(TARGET_PCT + TOLERANCE_PCT).toFixed(1)} % m/m.` },
]

const percent = (g, ml) => (g + ml === 0 ? 0 : (g / (g + ml)) * 100)

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

const colY = (pct) => COL_BOT - (Math.min(pct, COL_MAX_PCT) / COL_MAX_PCT) * (COL_BOT - COL_TOP)

function drawScene(ctx, { parts, shown, surfaceY, pct, solute, water }) {
  ctx.clearRect(0, 0, W, H)

  // ── Jar ──
  ctx.strokeStyle = '#78716c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(JX, JY)
  ctx.lineTo(JX, JY + JH)
  ctx.lineTo(JX + JW, JY + JH)
  ctx.lineTo(JX + JW, JY)
  ctx.stroke()

  // Colour intensity is particles-per-volume, computed, never chosen.
  const density = water > 0 ? solute / water : 0
  const alpha = Math.min(0.82, density * 2.6)
  ctx.fillStyle = `rgba(217,119,6,${alpha.toFixed(3)})`
  ctx.fillRect(JX + 2, surfaceY, JW - 4, JY + JH - surfaceY - 1)
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(JX + 2, surfaceY)
  ctx.lineTo(JX + JW - 2, surfaceY)
  ctx.stroke()

  const span = JY + JH - 6 - surfaceY
  ctx.fillStyle = '#7c2d12'
  for (let i = 0; i < shown; i += 1) {
    const p = parts[i]
    ctx.beginPath()
    ctx.arc(JX + 8 + p.nx * (JW - 16), surfaceY + 4 + p.ny * span, 3.6, 0, Math.PI * 2)
    ctx.fill()
  }

  // Volume scale down the side of the jar.
  ctx.strokeStyle = '#a8a29e'
  ctx.lineWidth = 1.5
  ctx.fillStyle = '#78716c'
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (let ml = 100; ml <= MAX_ML; ml += 100) {
    const y = JY + JH - (ml / MAX_ML) * (JH - 8)
    ctx.beginPath()
    ctx.moveTo(JX + JW - 16, y)
    ctx.lineTo(JX + JW, y)
    ctx.stroke()
    ctx.fillText(`${ml}`, JX + JW - 20, y + 4)
  }

  ctx.textAlign = 'left'
  ctx.font = '800 13px system-ui, sans-serif'
  ctx.fillText(`${solute} g solute in ${water} mL water`, JX, JY - 22)
  ctx.font = '700 12px system-ui, sans-serif'
  ctx.fillText(`${shown} particles on screen`, JX, JY - 6)

  // ── Concentration column ──
  ctx.strokeStyle = '#78716c'
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

  ctx.fillStyle = '#78716c'
  ctx.font = '700 10px system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const p of [0, 5, 10, 15, 20, 25]) {
    ctx.fillText(`${p}`, COL_X - 6, colY(p) + 4)
  }
  ctx.font = '800 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('% m/m', COL_X + COL_W / 2, COL_TOP - 12)
  ctx.font = '900 15px system-ui, sans-serif'
  ctx.fillText(`${pct.toFixed(1)} %`, COL_X + COL_W / 2, COL_BOT + 22)
}

export default function DilutionJarWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef({ solute: 20, water: 80 })
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [solute, setSolute] = useState(20)
  const [water, setWater] = useState(80)
  const [done, setDone] = useState([])

  const pct = percent(solute, water)
  const onTarget = Math.abs(pct - TARGET_PCT) <= TOLERANCE_PCT

  useEffect(() => {
    liveRef.current = { solute, water }
  }, [solute, water])

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
      const { solute: s, water: w } = liveRef.current
      const parts = partsRef.current
      const shown = Math.min(parts.length, Math.round(s * 2.6))
      const surfaceY = JY + JH - 4 - (w / MAX_ML) * (JH - 10)

      for (let i = 0; i < shown; i += 1) {
        const p = parts[i]
        p.nx += p.vx * 0.004
        p.ny += p.vy * 0.006
        if (p.nx < 0.02) { p.nx = 0.02; p.vx = Math.abs(p.vx) }
        if (p.nx > 0.98) { p.nx = 0.98; p.vx = -Math.abs(p.vx) }
        if (p.ny < 0.02) { p.ny = 0.02; p.vy = Math.abs(p.vy) }
        if (p.ny > 0.98) { p.ny = 0.98; p.vy = -Math.abs(p.vy) }
      }

      drawScene(ctx, { parts, shown, surfaceY, pct: percent(s, w), solute: s, water: w })

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [solute, water])

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

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Jar holding ${solute} grams of solute in ${water} millilitres of water — ${pct.toFixed(1)} percent by mass.`}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
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
                {pct.toFixed(1)} % m/m — {onTarget ? 'on target' : pct > 12 ? 'concentrated' : 'dilute'}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {solute} g of solute sharing {water} mL of water. Concentration is mass of
                solute ÷ total mass, so it changes when either number does.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => apply(Math.min(MAX_G, solute + 5), water, null)}
                disabled={solute >= MAX_G}
                className="min-h-11 rounded-xl bg-primary-500 px-3 py-3 text-xs font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                + 5 g solute
              </button>
              <button
                type="button"
                onClick={() => apply(solute, Math.min(MAX_ML, water + 10), 'water')}
                disabled={water >= MAX_ML}
                className="min-h-11 rounded-xl bg-secondary-600 px-3 py-3 text-xs font-black text-white transition-colors hover:bg-secondary-700 disabled:opacity-50"
              >
                + 10 mL water
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => apply(Math.round(solute / 2), water, 'halve')}
                disabled={solute < 2}
                className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
              >
                Pour half away, top back up with water
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                The other route to a dilute solution: same volume in the jar, half as much
                solute left in it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => apply(20, 80, null)}
              className="min-h-11 w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm font-black text-stone-600 transition-colors dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
            >
              Start over — 20 g in 80 mL
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Routes found — {done.length} of {GOALS.length}
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
        {solute} grams of solute in {water} millilitres of water — {pct.toFixed(1)} percent
        by mass.
      </p>
    </>
  )
}
