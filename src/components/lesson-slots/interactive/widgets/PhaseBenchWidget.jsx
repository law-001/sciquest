import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w03-l1 signature interactive: one substance, five phases, one slider.
//
// The energy slider runs from a hair above absolute zero to star-hot. Nothing
// about the picture is drawn per phase: the particles have real velocities and
// the arrangement falls out of how fast they are moving, so the student watches
// a lattice break, a pool spread, a gas fill the box and finally the particles
// tear into charged ions and free electrons.
//
// The canvas is transparent and everything is drawn in colours that read on
// cream and on stone-900, so the widget never has to know about the theme.

const W = 640
// Drawn at the stage's own shape (about 16:10) so the box fills the frame.
const H = 400
const R = 7
const N = 30

// The inside of the sealed chamber. The simulation bounces off these walls and
// the vessel is drawn around them, so "it fills the chamber" is one fact rather
// than two that have to be kept in step by hand.
const IN_L = 56
const IN_R = W - 112
const IN_T = 56
const IN_B = H - 58
const IN_W = IN_R - IN_L
const IN_H = IN_B - IN_T

// Where a liquid settles. It still clings together, so it keeps a flat top.
const POOL_Y = IN_T + IN_H * 0.44

// The lattice spacing, and the longest link a bond may span, so a bond is only
// ever drawn between neighbours.
const SITE_GAP = 34
const BOND_REACH = SITE_GAP * 1.35

const PHASES = [
  {
    id: 'condensate',
    max: 7,
    label: 'Bose–Einstein condensate',
    colour: '#A8C8F0',
    panel: 'border-[#A8C8F0] bg-[#DDEEFF] dark:bg-[#A8C8F0]/15',
    hint: 'Pull the energy down below 8.',
  },
  {
    id: 'solid',
    max: 31,
    label: 'Solid',
    colour: '#7FB3EA',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    hint: 'Park the energy between 8 and 31.',
  },
  {
    id: 'liquid',
    max: 57,
    label: 'Liquid',
    colour: '#3BAFA9',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    hint: 'Park the energy between 32 and 57.',
  },
  {
    id: 'gas',
    max: 81,
    label: 'Gas',
    colour: '#9AA7B8',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    hint: 'Push the energy between 58 and 81.',
  },
  {
    id: 'plasma',
    max: Infinity,
    label: 'Plasma',
    colour: '#F59E0B',
    panel: 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20',
    hint: 'Push the energy past 81.',
  },
]

const phaseFor = (e) => PHASES.find((p) => e <= p.max)

// Log ramp: 0.2 K at the bottom, ~12 000 K at the top. A linear scale would
// crush the whole cold end of the story into one pixel of slider.
const kelvinFor = (e) => Math.pow(10, -0.7 + (e / 100) * 4.78)

const formatK = (k) =>
  k < 10 ? `${k.toFixed(1)} K` : `${Math.round(k).toLocaleString()} K`

function makeParticles() {
  return Array.from({ length: N }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    const b = Math.random() * Math.PI * 2
    return {
      i,
      x: IN_L + R * 3 + Math.random() * (IN_W - R * 6),
      y: IN_T + IN_H * 0.5 + Math.random() * (IN_H * 0.4 - R * 2),
      vx: Math.cos(a),
      vy: Math.sin(a),
      ex: 0,
      ey: 0,
      evx: Math.cos(b),
      evy: Math.sin(b),
      wobble: Math.random() * Math.PI * 2,
    }
  })
}

// Where particle i sits once the substance has locked into a lattice.
function siteFor(i) {
  const cols = 6
  const gap = SITE_GAP
  const x0 = (IN_L + IN_R) / 2 - ((cols - 1) * gap) / 2
  const y0 = (IN_T + IN_B) / 2 - (Math.floor((N - 1) / cols) * gap) / 2
  return { x: x0 + (i % cols) * gap, y: y0 + Math.floor(i / cols) * gap }
}

function speedFor(id, e) {
  if (id === 'condensate') return 0.05
  if (id === 'liquid') return 0.8 + ((e - 32) / 26) * 1.3
  if (id === 'gas') return 2.2 + ((e - 58) / 24) * 2.1
  if (id === 'plasma') return 4.6 + Math.min((e - 82) / 18, 1) * 2.6
  return 0
}

// ── Scene furniture ───────────────────────────────────────────────────────────

// Bench and back wall. A scene that paints its own ground keeps its contrast on
// cream and on stone-900 alike.
function drawRoom(ctx) {
  ctx.fillStyle = '#f2f7fc'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#e7d9c3'
  ctx.fillRect(0, IN_B + 32, W, H - IN_B - 32)
  ctx.fillStyle = 'rgba(120,113,108,0.18)'
  ctx.fillRect(0, IN_B + 32, W, 2)

  ctx.fillStyle = 'rgba(87,83,78,0.13)'
  ctx.beginPath()
  ctx.ellipse((IN_L + IN_R) / 2, IN_B + 34, IN_W / 2 + 16, 9, 0, 0, Math.PI * 2)
  ctx.fill()
}

// The inside face of the chamber, painted before the particles.
function drawChamberBack(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.beginPath()
  ctx.roundRect(IN_L - 12, IN_T - 12, IN_W + 24, IN_H + 24, 14)
  ctx.fill()
}

// Steel walls, bolted flange and viewport, painted after the particles. This is
// a sealed chamber: nothing added, nothing let out, only energy changed.
function drawChamberFront(ctx) {
  ctx.strokeStyle = 'rgba(120,113,108,0.65)'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.roundRect(IN_L - 12, IN_T - 12, IN_W + 24, IN_H + 24, 14)
  ctx.stroke()

  // Flange bolts around the viewport.
  ctx.fillStyle = 'rgba(120,113,108,0.85)'
  const bolts = 8
  for (let i = 0; i < bolts; i += 1) {
    const f = i / (bolts - 1)
    for (const y of [IN_T - 24, IN_B + 24]) {
      ctx.beginPath()
      ctx.arc(IN_L + f * IN_W, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // The feet it stands on.
  ctx.beginPath()
  ctx.roundRect(IN_L + 18, IN_B + 14, 40, 20, 4)
  ctx.roundRect(IN_R - 58, IN_B + 14, 40, 20, 4)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(IN_R - 18, IN_T + 22)
  ctx.lineTo(IN_R - 18, IN_T + IN_H * 0.36)
  ctx.stroke()
}

// The energy scale as an instrument, banded by phase. It shows that one slider
// covers all five, and where in the range the student currently is.
function drawGauge(ctx, energy) {
  const x = W - 72
  const top = IN_T + 4
  const bot = IN_B - 4
  const span = bot - top
  const yFor = (e) => bot - (e / 100) * span

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(120,113,108,0.6)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(x - 11, top, 22, span, 11)
  ctx.fill()
  ctx.stroke()

  // One band per phase, in that phase's own colour.
  let from = 0
  for (const ph of PHASES) {
    const to = ph.max === Infinity ? 100 : ph.max
    ctx.fillStyle = ph.colour
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.roundRect(x - 7, yFor(to), 14, Math.max(2, yFor(from) - yFor(to)), 3)
    ctx.fill()
    ctx.globalAlpha = 1
    from = to
  }

  // Where the slider is standing right now.
  const y = yFor(energy)
  ctx.fillStyle = 'rgba(41,37,36,0.95)'
  ctx.beginPath()
  ctx.moveTo(x - 20, y)
  ctx.lineTo(x - 12, y - 6)
  ctx.lineTo(x - 12, y + 6)
  ctx.closePath()
  ctx.fill()

  ctx.font = '700 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(87,83,78,0.95)'
  ctx.fillText('hot', x, top - 10)
  ctx.fillText('cold', x, bot + 20)
}

// Colour alone never says which phase this is.
function drawPhaseTag(ctx, label) {
  ctx.font = '800 14px system-ui, sans-serif'
  const w = ctx.measureText(label).width + 22
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.strokeStyle = 'rgba(120,113,108,0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(IN_L + 12, IN_T + 12, w, 26, 13)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = 'rgba(41,37,36,0.95)'
  ctx.textAlign = 'left'
  ctx.fillText(label, IN_L + 23, IN_T + 30)
}

export default function PhaseBenchWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef(45)
  const drawRef = useRef(null)
  const stillRef = useRef(false)

  const [energy, setEnergy] = useState(45)
  const [seen, setSeen] = useState(['liquid'])

  const phase = phaseFor(energy)
  const kelvin = kelvinFor(energy)

  // The loop reads the slider through a ref, so dragging never tears the
  // simulation down and restarts it.
  useEffect(() => {
    liveRef.current = energy
  }, [energy])

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
      const e = liveRef.current
      const reg = phaseFor(e)
      const speed = speedFor(reg.id, e)
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        if (reg.id === 'condensate') {
          // Everything drifts toward one point and barely moves once it is
          // there, which is what makes the group unresolvable.
          p.x += ((IN_L + IN_R) / 2 - p.x) * 0.035 + Math.sin(tick * 0.02 + p.wobble) * speed
          p.y += (IN_T + IN_H * 0.6 - p.y) * 0.035 + Math.cos(tick * 0.02 + p.wobble) * speed
        } else if (reg.id === 'solid') {
          const site = siteFor(p.i)
          const amp = 0.8 + ((e - 8) / 23) * 4
          p.x = site.x + Math.sin(tick * 0.09 + p.wobble) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.wobble * 1.7) * amp
        } else {
          p.x += p.vx * speed
          p.y += p.vy * speed
          // A liquid still clings together, so it keeps a flat top surface.
          const top = reg.id === 'liquid' ? POOL_Y : IN_T + R
          if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy) }
          if (p.x < IN_L + R) { p.x = IN_L + R; p.vx = Math.abs(p.vx) }
          if (p.x > IN_R - R) { p.x = IN_R - R; p.vx = -Math.abs(p.vx) }
          if (p.y > IN_B - R) { p.y = IN_B - R; p.vy = -Math.abs(p.vy) }
        }

        if (reg.id === 'plasma') {
          p.ex += p.evx * speed * 1.7
          p.ey += p.evy * speed * 1.7
          if (p.ex < IN_L + R) { p.ex = IN_L + R; p.evx = Math.abs(p.evx) }
          if (p.ex > IN_R - R) { p.ex = IN_R - R; p.evx = -Math.abs(p.evx) }
          if (p.ey < IN_T + R) { p.ey = IN_T + R; p.evy = Math.abs(p.evy) }
          if (p.ey > IN_B - R) { p.ey = IN_B - R; p.evy = -Math.abs(p.evy) }
        } else {
          p.ex = p.x
          p.ey = p.y
        }
      }

      ctx.clearRect(0, 0, W, H)
      drawRoom(ctx)
      drawChamberBack(ctx)

      // A liquid clings together, so it has a surface. Drawn under the
      // particles so they break through it the way a real one does.
      if (reg.id === 'liquid') {
        ctx.strokeStyle = reg.colour
        ctx.globalAlpha = 0.55
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(IN_L + 2, POOL_Y - R)
        ctx.quadraticCurveTo((IN_L + IN_R) / 2, POOL_Y - R - 5, IN_R - 2, POOL_Y - R)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Bonds, drawn only for a solid. This is what "locked onto fixed sites"
      // looks like, and watching them vanish is the lattice breaking.
      if (reg.id === 'solid') {
        ctx.strokeStyle = 'rgba(127,179,234,0.55)'
        ctx.lineWidth = 2.5
        for (let a = 0; a < parts.length; a += 1) {
          for (let b = a + 1; b < parts.length; b += 1) {
            const dx = parts[a].x - parts[b].x
            const dy = parts[a].y - parts[b].y
            if (dx * dx + dy * dy > BOND_REACH * BOND_REACH) continue
            ctx.beginPath()
            ctx.moveTo(parts[a].x, parts[a].y)
            ctx.lineTo(parts[b].x, parts[b].y)
            ctx.stroke()
          }
        }
      }

      if (reg.id === 'condensate') {
        // One blurred group: wide soft discs overlapping into a single smear.
        ctx.fillStyle = 'rgba(168,200,240,0.22)'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, R * 3.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.fillStyle = reg.colour
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, reg.id === 'plasma' ? R * 0.9 : R, 0, Math.PI * 2)
        ctx.fill()
      }

      if (reg.id === 'plasma') {
        ctx.fillStyle = '#FDE047'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.ex, p.ey, R * 0.45, 0, Math.PI * 2)
          ctx.fill()
        }
        // The + and the − carry the charge without relying on colour.
        ctx.strokeStyle = 'rgba(120,53,15,0.9)'
        ctx.lineWidth = 1.6
        for (const p of parts) {
          ctx.beginPath()
          ctx.moveTo(p.x - 3, p.y)
          ctx.lineTo(p.x + 3, p.y)
          ctx.moveTo(p.x, p.y - 3)
          ctx.lineTo(p.x, p.y + 3)
          ctx.stroke()
        }
        ctx.strokeStyle = 'rgba(87,83,78,0.9)'
        ctx.lineWidth = 1.4
        for (const p of parts) {
          ctx.beginPath()
          ctx.moveTo(p.ex - 2.4, p.ey)
          ctx.lineTo(p.ex + 2.4, p.ey)
          ctx.stroke()
        }
      } else if (reg.id !== 'condensate') {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        for (const p of parts) {
          ctx.beginPath()
          ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Vessel, gauge and tag go on top, so the particles are inside the
      // chamber rather than painted on it.
      drawChamberFront(ctx)
      drawGauge(ctx, e)
      drawPhaseTag(ctx, reg.label)

      if (!still) raf = requestAnimationFrame(step)
    }

    drawRef.current = step
    step()
    return () => cancelAnimationFrame(raf)
  }, [])

  // With reduced motion on there is no loop, so the picture is repainted once
  // per slider change instead: a still frame that still answers the control.
  useEffect(() => {
    if (stillRef.current) drawRef.current?.()
  }, [energy])

  function changeEnergy(next) {
    setEnergy(next)
    const id = phaseFor(next).id
    setSeen((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      if (updated.length === PHASES.length) onSolved?.()
      return updated
    })
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Sealed chamber at ${formatK(kelvin)}. The substance is behaving as a ${phase.label}.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${phase.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {formatK(kelvin)}: {phase.label}
              </p>
            </div>

            <div>
              <label
                htmlFor="pbench-energy"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Energy: {energy}
              </label>
              <input
                id="pbench-energy"
                type="range"
                min={0}
                max={100}
                step={1}
                value={energy}
                onChange={(e) => changeEnergy(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Phases reached: {seen.length} of {PHASES.length}
              </p>
              <ul className="space-y-1.5">
                {PHASES.map((p) => {
                  const done = seen.includes(p.id)
                  return (
                    <li
                      key={p.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 transition-colors ${
                        done
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p
                        className={`text-xs font-black ${
                          done
                            ? 'text-stone-900 dark:text-white'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {done ? '✓ ' : '○ '}
                        {p.label}
                      </p>
                      {!done && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {p.hint}
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
        {formatK(kelvin)}: {phase.label}. {seen.length} of {PHASES.length} phases
        reached.
      </p>
    </>
  )
}
