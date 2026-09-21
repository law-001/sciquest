import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// L4 signature interactive: a live particle box.
//
// Real particles with real velocities on a canvas: temperature sets how fast
// they move, and the arrangement they fall into is a consequence of that speed
// rather than a picture chosen to illustrate it. Cold and they lock into a
// lattice and shiver; warm and they break loose but stay pooled at the bottom;
// hot and they fly free and fill the box.
//
// The canvas is transparent and the particles are drawn in colours that read on
// cream and on stone-900, so nothing here has to know about the theme.

const W = 640
// Drawn at the stage's own shape (about 16:10) so the box fills the frame
// instead of sitting in a band of empty gradient.
const H = 400
const R = 7

// The inside of the sealed jar. The simulation bounces off these walls and the
// glass is drawn around them, so "it fills the whole container" is one fact
// rather than two that have to be kept in step by hand.
const IN_L = 48
const IN_R = W - 104
const IN_T = 54
const IN_B = H - 58
const IN_W = IN_R - IN_L
const IN_H = IN_B - IN_T

// Where a liquid settles. Attraction still holds it together, so it keeps its
// volume and shows a surface; a gas has outrun attraction and has neither.
const POOL_Y = IN_T + IN_H * 0.42

const REGIMES = [
  {
    id: 'solid',
    max: 29,
    label: 'Solid',
    colour: '#7FB3EA',
    trail: 'rgba(127,179,234,0.30)',
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    note: 'Particles are locked in a fixed pattern. They shiver in place but never swap positions, so the shape stays put.',
  },
  {
    id: 'liquid',
    max: 99,
    label: 'Liquid',
    colour: '#3BAFA9',
    trail: 'rgba(59,175,169,0.30)',
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    note: 'Particles have broken out of the pattern and slide past each other, but they still pull on each other enough to pool at the bottom.',
  },
  {
    id: 'gas',
    max: Infinity,
    label: 'Gas',
    colour: '#9AA7B8',
    trail: 'rgba(154,167,184,0.30)',
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    note: 'Particles have escaped each other completely. They fly in straight lines until they hit something, filling the whole box.',
  },
]

const regimeFor = (t) => REGIMES.find((r) => t <= r.max)

const OBSERVATIONS = [
  { id: 'made-of', text: 'All matter is made of tiny particles.', hint: 'Push the particle count up to 34 or more.' },
  { id: 'moving', text: 'Particles are always moving.', hint: 'Cool it to 5 °C or below, then watch closely. They still shiver.' },
  { id: 'spaces', text: 'There are spaces between the particles.', hint: 'Heat it past 100 °C and watch the gaps open up.' },
  { id: 'attract', text: 'Particles attract each other.', hint: 'Cool it below 30 °C and watch them pull into a pattern.' },
  { id: 'energy', text: 'More energy means faster movement.', hint: 'Push the temperature to 140 °C and watch the trails stretch.' },
]

// Pixels per frame. Deliberately non-linear so the cold end still visibly
// shivers instead of freezing dead.
const speedFor = (t) => 0.4 + (t / 150) * 4.2

function makeParticles(n) {
  return Array.from({ length: n }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    return {
      i,
      x: IN_L + R * 3 + Math.random() * (IN_W - R * 6),
      y: IN_T + IN_H * 0.5 + Math.random() * (IN_H * 0.45 - R * 2),
      px: 0,
      py: 0,
      vx: Math.cos(a),
      vy: Math.sin(a),
      phase: Math.random() * Math.PI * 2,
    }
  })
}

// Where particle i sits when the substance is solid.
function siteFor(i, n) {
  const cols = Math.ceil(Math.sqrt(n * (IN_W / IN_H)))
  const rows = Math.ceil(n / cols)
  const gapX = Math.min(38, (IN_W - 44) / Math.max(cols - 1, 1))
  const gapY = Math.min(38, (IN_H - 44) / Math.max(rows - 1, 1))
  const x0 = (IN_L + IN_R) / 2 - ((cols - 1) * gapX) / 2
  const y0 = (IN_T + IN_B) / 2 - ((rows - 1) * gapY) / 2
  return { x: x0 + (i % cols) * gapX, y: y0 + Math.floor(i / cols) * gapY }
}

// The longest link the lattice can have, so a bond is only drawn between
// neighbours and never right across the jar.
function bondReach(n) {
  const cols = Math.ceil(Math.sqrt(n * (IN_W / IN_H)))
  const rows = Math.ceil(n / cols)
  return (
    Math.max(
      Math.min(38, (IN_W - 44) / Math.max(cols - 1, 1)),
      Math.min(38, (IN_H - 44) / Math.max(rows - 1, 1)),
    ) * 1.28
  )
}

// ── Scene furniture ───────────────────────────────────────────────────────────

// Bench and back wall. A scene that paints its own ground keeps its contrast on
// cream and on stone-900 alike.
function drawRoom(ctx) {
  ctx.fillStyle = '#eef4fb'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#e7d9c3'
  ctx.fillRect(0, IN_B + 30, W, H - IN_B - 30)
  ctx.fillStyle = 'rgba(120,113,108,0.18)'
  ctx.fillRect(0, IN_B + 30, W, 2)

  // The jar's shadow on the bench.
  ctx.fillStyle = 'rgba(87,83,78,0.13)'
  ctx.beginPath()
  ctx.ellipse((IN_L + IN_R) / 2, IN_B + 32, IN_W / 2 + 14, 9, 0, 0, Math.PI * 2)
  ctx.fill()
}

// The inside face of the glass, painted before the particles.
function drawJarBack(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.beginPath()
  ctx.roundRect(IN_L - 11, IN_T - 11, IN_W + 22, IN_H + 22, 16)
  ctx.fill()
}

// Glass walls, lid and sheen, painted after the particles.
function drawJarFront(ctx) {
  ctx.strokeStyle = 'rgba(120,113,108,0.55)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(IN_L - 11, IN_T - 11, IN_W + 22, IN_H + 22, 16)
  ctx.stroke()

  // A sealed lid, because nothing escapes: the count on screen is the count.
  ctx.fillStyle = 'rgba(120,113,108,0.75)'
  ctx.beginPath()
  ctx.roundRect(IN_L - 24, IN_T - 30, IN_W + 48, 17, 7)
  ctx.fill()

  // Glass highlight, kept on the right wall so it never sits over the state tag.
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(IN_R - 16, IN_T + 22)
  ctx.lineTo(IN_R - 16, IN_T + IN_H * 0.4)
  ctx.stroke()
}

// The control, as an instrument. The slider says the number; this says what the
// number is doing.
function drawThermometer(ctx, t) {
  const x = W - 56
  const top = IN_T + 4
  const bot = IN_B - 30
  const bulb = bot + 20

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(120,113,108,0.6)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(x - 9, top, 18, bot - top, 9)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, bulb, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  const frac = Math.min(1, Math.max(0, t / 150))
  const mercuryTop = bot - frac * (bot - top - 10)
  ctx.fillStyle = '#E2683C'
  ctx.beginPath()
  ctx.roundRect(x - 5, mercuryTop, 10, bot - mercuryTop + 6, 5)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, bulb, 11, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(120,113,108,0.5)'
  ctx.lineWidth = 2
  for (let i = 0; i <= 3; i += 1) {
    const y = bot - (i / 3) * (bot - top - 10)
    ctx.beginPath()
    ctx.moveTo(x + 10, y)
    ctx.lineTo(x + 17, y)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(87,83,78,0.95)'
  ctx.font = '700 12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('°C', x, top - 8)
}

// Colour alone never says which state this is.
function drawStateTag(ctx, label) {
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

export default function ParticleLabWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles(24))
  const liveRef = useRef({ temp: 20, count: 24 })

  const [temp, setTemp] = useState(20)
  const [count, setCount] = useState(24)
  const [observed, setObserved] = useState([])

  const regime = regimeFor(temp)

  // The draw loop reads the controls through a ref so dragging a slider never
  // tears the simulation down and restarts it.
  useEffect(() => {
    liveRef.current = { temp, count }
  }, [temp, count])

  useEffect(() => {
    partsRef.current = makeParticles(count)
  }, [count])

  // One rAF loop for the life of the widget. It reads the sliders through a ref
  // so dragging never tears down and restarts the simulation.
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
    let tick = 0

    function step() {
      const { temp: t, count: n } = liveRef.current
      const reg = regimeFor(t)
      const speed = speedFor(t)
      const parts = partsRef.current
      tick += 1

      for (const p of parts) {
        p.px = p.x
        p.py = p.y

        if (reg.id === 'solid') {
          // Held on a lattice site; temperature only sets how hard it shivers.
          const site = siteFor(p.i, n)
          const amp = 1 + (t / 29) * 4
          p.x = site.x + Math.sin(tick * 0.09 + p.phase) * amp
          p.y = site.y + Math.cos(tick * 0.11 + p.phase * 1.7) * amp
          continue
        }

        p.x += p.vx * speed
        p.y += p.vy * speed

        // Attraction between particles is what keeps a liquid pooled; a gas has
        // outrun it, so only the gas gets the full box.
        if (reg.id === 'liquid' && p.y < POOL_Y) {
          p.y = POOL_Y
          p.vy = Math.abs(p.vy)
        }

        if (p.x < IN_L + R) { p.x = IN_L + R; p.vx = Math.abs(p.vx) }
        if (p.x > IN_R - R) { p.x = IN_R - R; p.vx = -Math.abs(p.vx) }
        if (p.y < IN_T + R) { p.y = IN_T + R; p.vy = Math.abs(p.vy) }
        if (p.y > IN_B - R) { p.y = IN_B - R; p.vy = -Math.abs(p.vy) }
      }

      ctx.clearRect(0, 0, W, H)
      drawRoom(ctx)
      drawJarBack(ctx)

      // A liquid keeps its volume, so it has a surface. Drawn under the
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

      // Bonds, drawn only for a solid. This is the fixed pattern the lesson
      // means by "particles attract each other": break them and it is a liquid.
      if (reg.id === 'solid') {
        const reach = bondReach(n)
        ctx.strokeStyle = 'rgba(127,179,234,0.55)'
        ctx.lineWidth = 2.5
        for (let a = 0; a < parts.length; a += 1) {
          for (let b = a + 1; b < parts.length; b += 1) {
            const dx = parts[a].x - parts[b].x
            const dy = parts[a].y - parts[b].y
            if (dx * dx + dy * dy > reach * reach) continue
            ctx.beginPath()
            ctx.moveTo(parts[a].x, parts[a].y)
            ctx.lineTo(parts[b].x, parts[b].y)
            ctx.stroke()
          }
        }
      }

      // Trails make speed readable at a glance: a fast particle draws a long
      // streak, a shivering one draws almost none.
      ctx.strokeStyle = reg.trail
      ctx.lineWidth = R * 1.6
      ctx.lineCap = 'round'
      for (const p of parts) {
        if (!p.px) continue
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }

      ctx.fillStyle = reg.colour
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
        ctx.fill()
      }

      // A highlight, so particles read as spheres rather than flat discs.
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Glass, lid and sheen go on top, so the particles are inside the jar
      // rather than painted on it.
      drawJarFront(ctx)
      drawThermometer(ctx, t)
      drawStateTag(ctx, reg.label)

      if (!still) raf = requestAnimationFrame(step)
    }

    step()
    return () => cancelAnimationFrame(raf)
  }, [])

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

  function changeTemp(next) {
    setTemp(next)
    const seen = []
    if (next <= 5) seen.push('moving')
    if (next < 30) seen.push('attract')
    if (next >= 100) seen.push('spaces')
    if (next >= 140) seen.push('energy')
    if (seen.length) observe(seen)
  }

  function changeCount(next) {
    setCount(next)
    if (next >= 34) observe(['made-of'])
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Particle box: ${count} particles at ${temp} degrees Celsius, behaving as a ${regime.label}.`}
              style={stageFill(W, H)}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${regime.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {temp} °C: behaving as a {regime.label}
              </p>
            </div>

            <div>
              <label
                htmlFor="plab-temp"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Temperature: {temp} °C
              </label>
              <input
                id="plab-temp"
                type="range"
                min={0}
                max={150}
                step={1}
                value={temp}
                onChange={(e) => changeTemp(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />

              <label
                htmlFor="plab-count"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Particles: {count}
              </label>
              <input
                id="plab-count"
                type="range"
                min={8}
                max={48}
                step={1}
                value={count}
                onChange={(e) => changeCount(Number(e.target.value))}
                className="h-11 w-full accent-teal-500"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Seen with your own eyes: {observed.length} of {OBSERVATIONS.length}
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
                        {done ? '✓ Seen: ' : 'Not yet: '}
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
        {count} particles at {temp} degrees Celsius, behaving as a {regime.label}.{' '}
        {observed.length} of {OBSERVATIONS.length} behaviours seen.
      </p>
    </>
  )
}
