import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L5 second interactive — the container bench.
//
// Lesson 5 states that a solid keeps its shape and volume, a liquid keeps only
// its volume, and a gas keeps neither. Here the student moves the same sample
// between three containers and watches it happen: the ice cube ignores the
// glassware entirely, the 40 mL of water re-shapes itself but stays 40 mL, and
// the steam expands to whatever it is given.
//
// The syringe is the pay-off. Forty millilitres of water stands twice as tall
// in it as in the beaker, and its plunger compresses the gas while stopping
// dead against the liquid.

const W = 560
const H = 380

const TOP = 70
const BOTTOM = 340

// Square pixels per millilitre. Everything on screen is sized from this, so the
// readouts and the picture cannot disagree.
const SCALE = 600
const SAMPLE_ML = 40

const CONTAINERS = [
  {
    id: 'beaker',
    label: 'Beaker',
    note: 'Wide and open.',
    wallsAt: () => [170, 400],
    outline: [[170, TOP], [170, BOTTOM], [400, BOTTOM], [400, TOP]],
  },
  {
    id: 'flask',
    label: 'Flask',
    note: 'Narrow neck, cone body.',
    wallsAt: (y) => {
      if (y <= 150) return [250, 320]
      const t = (y - 150) / (BOTTOM - 150)
      return [250 - t * 100, 320 + t * 100]
    },
    outline: [[250, TOP], [250, 150], [150, BOTTOM], [420, BOTTOM], [320, 150], [320, TOP]],
  },
  {
    id: 'syringe',
    label: 'Syringe',
    note: 'Narrow barrel with a plunger.',
    wallsAt: () => [225, 335],
    outline: [[225, TOP], [225, BOTTOM], [335, BOTTOM], [335, TOP]],
  },
]

const SOLID = '#7FB3EA'
const LIQUID = '#3BAFA9'
const GAS = '#9AA7B8'

const SAMPLES = [
  {
    id: 'ice',
    label: 'Ice',
    observationId: 'solid',
    state: 'Solid',
    colour: SOLID,
    panel: 'border-[#7FB3EA] bg-[#DDEEFF] dark:bg-[#7FB3EA]/15',
    keepsShape: true,
    keepsVolume: true,
    note: 'Particles are locked to each other in a fixed pattern, so the block holds its own shape no matter what it is put in.',
  },
  {
    id: 'water',
    label: 'Water',
    observationId: 'liquid',
    state: 'Liquid',
    colour: LIQUID,
    panel: 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15',
    keepsShape: false,
    keepsVolume: true,
    note: 'Particles slide past each other but still cling together, so the water takes the container’s shape while staying the same amount.',
  },
  {
    id: 'steam',
    label: 'Steam',
    observationId: 'gas',
    state: 'Gas',
    colour: GAS,
    panel: 'border-stone-300 bg-stone-100 dark:border-stone-500 dark:bg-stone-700/50',
    keepsShape: false,
    keepsVolume: false,
    note: 'Particles have broken free of each other completely, so they spread out until they hit the walls — however far away those are.',
  },
]

const N = 25
const R = 7
const CUBE_GAP = 16
const MAX_PUSH = 190

const GLASS = 'rgba(120,113,108,0.85)'
const INK = 'rgba(87,83,78,0.95)'

const byId = (list, id) => list.find((x) => x.id === id) ?? list[0]

// Interior cross-section summed downward from a height, in square pixels.
function areaBetween(container, topY, bottomY) {
  let area = 0
  for (let y = bottomY; y > topY; y -= 1) {
    const [l, r] = container.wallsAt(y)
    area += r - l
  }
  return area
}

// The height a fixed volume reaches in this container, found by filling upward
// until the accumulated area matches — so a narrow vessel really does stand the
// same millilitres taller.
function surfaceFor(container, ml, bottomY) {
  const target = ml * SCALE
  let area = 0
  for (let y = bottomY; y > TOP; y -= 1) {
    const [l, r] = container.wallsAt(y)
    area += r - l
    if (area >= target) return y
  }
  return TOP
}

function makeParticles() {
  return Array.from({ length: N }, () => {
    const angle = Math.random() * Math.PI * 2
    return { x: 285, y: 250, vx: Math.cos(angle), vy: Math.sin(angle), phase: Math.random() * 6.28 }
  })
}

const OBSERVATIONS = [
  {
    id: 'solid',
    text: 'A solid keeps its shape and volume in every container.',
    hint: 'Put the ice in all three containers.',
  },
  {
    id: 'liquid',
    text: 'A liquid changes shape to fit, but stays 40 mL.',
    hint: 'Put the water in all three containers.',
  },
  {
    id: 'gas',
    text: 'A gas fills whatever it is put in, so its volume changes.',
    hint: 'Put the steam in all three containers and read the volume.',
  },
  {
    id: 'squeeze',
    text: 'Gas squashes under the plunger. Liquid and solid do not.',
    hint: 'In the syringe, push the plunger down hard on the steam, then on the water.',
  },
]

export default function ContainerTestWidget({ onSolved }) {
  const canvasRef = useRef(null)
  const partsRef = useRef(makeParticles())
  const liveRef = useRef({ sampleId: 'ice', containerId: 'beaker', push: 0 })
  const drawRef = useRef(null)

  const [sampleId, setSampleId] = useState('ice')
  const [containerId, setContainerId] = useState('beaker')
  const [push, setPush] = useState(0)
  const [visited, setVisited] = useState({ ice: ['beaker'], water: [], steam: [] })
  const [squeezed, setSqueezed] = useState([])
  const [observed, setObserved] = useState([])

  const sample = byId(SAMPLES, sampleId)
  const container = byId(CONTAINERS, containerId)
  const isSyringe = containerId === 'syringe'

  // The plunger cannot pass through matter that will not compress, so a solid
  // or a liquid caps its travel at its own surface.
  const contentTop = sample.keepsVolume
    ? surfaceFor(container, SAMPLE_ML, BOTTOM)
    : TOP
  const wantedY = TOP + (push / 100) * MAX_PUSH
  const plungerY = isSyringe ? Math.min(wantedY, sample.keepsVolume ? contentTop - 4 : TOP + MAX_PUSH) : TOP
  const blocked = isSyringe && sample.keepsVolume && wantedY > plungerY

  const occupied = sample.keepsVolume
    ? SAMPLE_ML
    : areaBetween(container, plungerY, BOTTOM) / SCALE

  useEffect(() => {
    liveRef.current = { sampleId, containerId, push }
  }, [sampleId, containerId, push])

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
      const live = liveRef.current
      const smp = byId(SAMPLES, live.sampleId)
      const con = byId(CONTAINERS, live.containerId)
      const syringe = con.id === 'syringe'
      const fillTop = smp.keepsVolume ? surfaceFor(con, SAMPLE_ML, BOTTOM) : TOP
      const lid = syringe
        ? Math.min(TOP + (live.push / 100) * MAX_PUSH, smp.keepsVolume ? fillTop - 4 : TOP + MAX_PUSH)
        : TOP
      const roof = smp.keepsVolume ? fillTop : lid
      const parts = partsRef.current
      tick += 1

      // Solid: held on a lattice that ignores the container entirely.
      if (smp.keepsShape) {
        const [l, r] = con.wallsAt(BOTTOM - 40)
        const cx = (l + r) / 2
        const cy = BOTTOM - R - 6 - CUBE_GAP * 2
        for (let i = 0; i < parts.length; i += 1) {
          const p = parts[i]
          const site = {
            x: cx + ((i % 5) - 2) * CUBE_GAP,
            y: cy + (Math.floor(i / 5) - 2) * CUBE_GAP,
          }
          p.x = site.x + Math.sin(tick * 0.09 + p.phase) * 1.6
          p.y = site.y + Math.cos(tick * 0.11 + p.phase * 1.7) * 1.6
        }
      } else {
        const speed = smp.keepsVolume ? 1.1 : 3.2
        for (const p of parts) {
          p.x += p.vx * speed
          p.y += p.vy * speed
          const [l, r] = con.wallsAt(p.y)
          if (p.x < l + R) { p.x = l + R; p.vx = Math.abs(p.vx) }
          if (p.x > r - R) { p.x = r - R; p.vx = -Math.abs(p.vx) }
          if (p.y < roof + R) { p.y = roof + R; p.vy = Math.abs(p.vy) }
          if (p.y > BOTTOM - R) { p.y = BOTTOM - R; p.vy = -Math.abs(p.vy) }
        }
      }

      ctx.clearRect(0, 0, W, H)

      // Container walls. Left and right sides only — an open vessel has no lid.
      ctx.strokeStyle = GLASS
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.beginPath()
      con.outline.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
      ctx.stroke()

      if (smp.keepsVolume) {
        // Surface line, drawn at the height the volume actually reaches.
        const [l, r] = con.wallsAt(fillTop)
        ctx.strokeStyle = smp.colour
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(l, fillTop)
        ctx.lineTo(r, fillTop)
        ctx.stroke()
      }

      ctx.fillStyle = smp.colour
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x - R * 0.3, p.y - R * 0.3, R * 0.32, 0, Math.PI * 2)
        ctx.fill()
      }

      if (syringe) {
        ctx.strokeStyle = INK
        ctx.fillStyle = 'rgba(226,104,60,0.85)'
        ctx.lineWidth = 3
        ctx.fillRect(227, lid - 10, 106, 10)
        ctx.beginPath()
        ctx.moveTo(280, lid - 10)
        ctx.lineTo(280, TOP - 40)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(245, TOP - 40)
        ctx.lineTo(315, TOP - 40)
        ctx.stroke()
      }

      ctx.fillStyle = INK
      ctx.font = '600 13px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${con.label} — ${smp.label} (${smp.state})`, W / 2, BOTTOM + 26)

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
  }, [sampleId, containerId, push])

  function record(nextSample, nextContainer, nextPush) {
    const seenContainers = visited[nextSample].includes(nextContainer)
      ? visited[nextSample]
      : [...visited[nextSample], nextContainer]
    const nextVisited = { ...visited, [nextSample]: seenContainers }
    setVisited(nextVisited)

    const hardPush = nextContainer === 'syringe' && nextPush >= 60
    const nextSqueezed = hardPush && !squeezed.includes(nextSample)
      ? [...squeezed, nextSample]
      : squeezed
    if (nextSqueezed !== squeezed) setSqueezed(nextSqueezed)

    const ids = []
    SAMPLES.forEach((s) => {
      if (nextVisited[s.id].length === CONTAINERS.length) ids.push(s.observationId)
    })
    if (nextSqueezed.includes('steam') && (nextSqueezed.includes('water') || nextSqueezed.includes('ice'))) {
      ids.push('squeeze')
    }
    if (!ids.length) return
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

  function chooseSample(id) {
    setSampleId(id)
    record(id, containerId, push)
  }

  function chooseContainer(id) {
    setContainerId(id)
    record(sampleId, id, push)
  }

  function movePlunger(next) {
    setPush(next)
    record(sampleId, containerId, next)
  }

  const heightCm = ((BOTTOM - (sample.keepsVolume ? contentTop : plungerY)) / 8).toFixed(1)
  const reading = `${sample.label} in the ${container.label.toLowerCase()} — taking up ${occupied.toFixed(1)} mL, standing ${heightCm} cm tall.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={reading}
              style={{ ...STAGE_MEDIA, aspectRatio: `${W} / ${H}` }}
            />
          </Stage>
        }
        panel={
          <>
            <div className={`rounded-xl border-2 p-3 ${sample.panel}`}>
              <p className="text-sm font-black text-stone-900 dark:text-white">{reading}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {blocked ? 'The plunger has stopped dead — this sample will not compress. ' : ''}
                {sample.note}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Keeps its shape', yes: sample.keepsShape },
                { label: 'Keeps its volume', yes: sample.keepsVolume },
              ].map((light) => (
                <div
                  key={light.label}
                  className={`rounded-xl border-2 px-2.5 py-2 ${
                    light.yes
                      ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                      : 'border-accent-400 bg-accent-50 dark:border-accent-600 dark:bg-accent-700/25'
                  }`}
                >
                  <p className="text-xs font-black text-stone-900 dark:text-white">
                    {light.yes ? '✓ Yes' : '✗ No'}
                  </p>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    {light.label}
                  </p>
                </div>
              ))}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Sample
              </legend>
              <div className="flex gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => chooseSample(s.id)}
                    aria-pressed={s.id === sampleId}
                    className={`min-h-11 flex-1 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                      s.id === sampleId
                        ? 'border-orange-500 bg-orange-50 text-stone-900 dark:border-orange-400 dark:bg-orange-500/20 dark:text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-orange-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Container
              </legend>
              <div className="flex gap-2">
                {CONTAINERS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => chooseContainer(c.id)}
                    aria-pressed={c.id === containerId}
                    className={`min-h-11 flex-1 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                      c.id === containerId
                        ? 'border-teal-500 bg-teal-50 text-stone-900 dark:border-teal-400 dark:bg-teal-500/20 dark:text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-orange-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {isSyringe && (
              <div>
                <label
                  htmlFor="ct-plunger"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Plunger — pushed {push}%
                </label>
                <input
                  id="ct-plunger"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={push}
                  onChange={(e) => movePlunger(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
              </div>
            )}

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
