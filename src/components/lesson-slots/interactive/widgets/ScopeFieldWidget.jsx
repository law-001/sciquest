import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w12-l1 signature interactive — a field of living cells you can go into.
//
// Six cells drift around the objective from the moment the block paints, each
// one shaped for the job it actually does. Pick one and the view zooms onto it
// while it keeps moving, and at about 2.5× the interior resolves.
//
// The prokaryote/eukaryote distinction is not stated anywhere as a rule. It is
// what the student sees when they zoom into the bacterium expecting a nucleus
// and there is simply nothing there — a loose loop of DNA lying in the cytoplasm
// and nothing holding it.

const W = 620
const H = 340
const FX = 300
const FY = 168
const FR = 152

const DETAIL_ZOOM = 2.5

const CELLS = [
  {
    id: 'cheek',
    shape: 'round',
    type: 'eukaryote',
    name: 'Cheek cell',
    job: 'Lines the inside of your mouth — flat, so it tiles a surface without wasting space.',
    x: 228, y: 118, phase: 0.0, speed: 0.05, tint: '#F5C6C6',
  },
  {
    id: 'neuron',
    shape: 'neuron',
    type: 'eukaryote',
    name: 'Nerve cell',
    job: 'Carries signals a metre down your leg — so it is built as one enormously long wire.',
    x: 386, y: 112, phase: 1.4, speed: 0.035, tint: '#FBD9A5',
  },
  {
    id: 'palisade',
    shape: 'leaf',
    type: 'eukaryote',
    name: 'Palisade cell (leaf)',
    job: 'Catches sunlight — a tall box packed with chloroplasts and a wall to hold the shape.',
    x: 238, y: 226, phase: 2.6, speed: 0.042, tint: '#CFE8C9',
  },
  {
    id: 'sperm',
    shape: 'sperm',
    type: 'eukaryote',
    name: 'Sperm cell',
    job: 'Has to travel — almost no cytoplasm, a tail, and mitochondria stacked behind the head.',
    x: 372, y: 224, phase: 3.9, speed: 0.075, tint: '#D8CBF0',
  },
  {
    id: 'ecoli',
    shape: 'rod',
    type: 'prokaryote',
    name: 'E. coli bacterium',
    job: 'Lives in a gut. Divides every twenty minutes, which is easier with no nucleus to copy.',
    x: 178, y: 178, phase: 5.1, speed: 0.09, tint: '#9AD5CF',
  },
  {
    id: 'cyano',
    shape: 'coccus',
    type: 'prokaryote',
    name: 'Cyanobacterium',
    job: 'Photosynthesises without chloroplasts — the membranes are folded into the cytoplasm itself.',
    x: 420, y: 178, phase: 0.8, speed: 0.065, tint: '#A9CDEE',
  },
]

const NUCLEUS = '#7C3AED'

function positionOf(cell, tick) {
  return {
    x: cell.x + Math.sin(tick * cell.speed + cell.phase) * 26,
    y: cell.y + Math.cos(tick * cell.speed * 0.8 + cell.phase * 1.7) * 18,
  }
}

function Interior({ cell }) {
  if (cell.type === 'prokaryote') {
    return (
      <g>
        <path d="M -16 2 q 8 -12 16 0 q 8 12 16 0" transform="translate(-8 0)" fill="none" stroke="#0f766e" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={-22 + (i % 6) * 9} cy={-13 + Math.floor(i / 6) * 26} r="1.9" fill="#44403c" />
        ))}
        <text y="-26" fontSize="7.5" fontWeight="900" fill="#b45309" textAnchor="middle">
          no nucleus
        </text>
      </g>
    )
  }
  return (
    <g>
      <circle r="11" fill={NUCLEUS} opacity="0.8" />
      <circle r="4" fill="#4C1D95" />
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 22} cy={s * 13} rx="7" ry="3.6" fill="#F59E0B" />
      ))}
      {cell.shape === 'leaf' &&
        [0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={-18 + i * 12} cy={22} rx="5.5" ry="3.4" fill="#15803D" />
        ))}
    </g>
  )
}

function CellBody({ cell, tick }) {
  const wag = Math.sin(tick * 0.5 + cell.phase) * 7
  const common = { fill: cell.tint, stroke: '#44403c', strokeWidth: 2.4 }

  if (cell.shape === 'neuron') {
    return (
      <g>
        <path d={`M -6 0 L 62 ${wag * 0.3}`} fill="none" stroke="#44403c" strokeWidth="5" />
        <path d="M -22 -18 L -44 -34 M -26 0 L -52 2 M -22 18 L -42 34" fill="none" stroke="#44403c" strokeWidth="3" />
        <circle r="22" {...common} />
      </g>
    )
  }
  if (cell.shape === 'leaf') {
    return (
      <g>
        <rect x="-26" y="-34" width="52" height="68" rx="6" {...common} />
        <rect x="-30" y="-38" width="60" height="76" rx="8" fill="none" stroke="#15803D" strokeWidth="3.4" />
      </g>
    )
  }
  if (cell.shape === 'sperm') {
    return (
      <g>
        <path d={`M 14 0 q 22 ${wag} 44 ${-wag}`} fill="none" stroke="#44403c" strokeWidth="3" />
        <ellipse cx="0" cy="0" rx="20" ry="14" {...common} />
      </g>
    )
  }
  if (cell.shape === 'rod') {
    return (
      <g>
        <path d={`M 32 0 q 16 ${wag} 32 ${-wag * 0.6}`} fill="none" stroke="#44403c" strokeWidth="2.6" />
        <rect x="-32" y="-16" width="64" height="32" rx="16" {...common} />
      </g>
    )
  }
  if (cell.shape === 'coccus') {
    return (
      <g>
        <circle r="24" {...common} />
        <circle r="19" fill="none" stroke="#0f766e" strokeWidth="2" opacity="0.7" />
      </g>
    )
  }
  return (
    <g>
      <ellipse rx="30" ry="22" {...common} />
    </g>
  )
}

export default function ScopeFieldWidget({ onSolved }) {
  const [tick, setTick] = useState(0)
  const [focusId, setFocusId] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [seen, setSeen] = useState([])
  const seenRef = useRef([])

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [])

  function inspect(id) {
    setFocusId(id)
    if (zoom < DETAIL_ZOOM) setZoom(3.2)
    record(id, Math.max(zoom, 3.2))
  }

  function changeZoom(value) {
    setZoom(value)
    if (focusId) record(focusId, value)
  }

  function record(id, z) {
    if (z < DETAIL_ZOOM || seenRef.current.includes(id)) return
    seenRef.current = [...seenRef.current, id]
    setSeen(seenRef.current)
    const list = CELLS.filter((c) => seenRef.current.includes(c.id))
    const bothTypes =
      list.some((c) => c.type === 'eukaryote') && list.some((c) => c.type === 'prokaryote')
    if (seenRef.current.length === CELLS.length && bothTypes) onSolved?.()
  }

  const focus = CELLS.find((c) => c.id === focusId) || null
  const detail = zoom >= DETAIL_ZOOM
  const centre = focus ? positionOf(focus, tick) : { x: FX, y: FY }
  const view = `translate(${FX} ${FY}) scale(${zoom}) translate(${-centre.x} ${-centre.y})`

  const caption = focus
    ? detail
      ? `${focus.name} — ${focus.type === 'prokaryote' ? 'no nucleus: the DNA is loose in the cytoplasm.' : 'a nucleus, and organelles around it.'}`
      : `${focus.name} — zoom past ${DETAIL_ZOOM}× to see inside it.`
    : 'Six cells drifting under the objective. Pick one to go in.'

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption} style={STAGE_MEDIA}>
              <defs>
                <clipPath id="sfield-clip">
                  <circle cx={FX} cy={FY} r={FR} />
                </clipPath>
              </defs>

              <circle cx={FX} cy={FY} r={FR} fill="#FDF7EC" stroke="#78716c" strokeWidth="3" />
              <g clipPath="url(#sfield-clip)">
                <g transform={view}>
                  {CELLS.map((c) => {
                    const p = positionOf(c, tick)
                    const active = c.id === focusId
                    return (
                      <g
                        key={c.id}
                        transform={`translate(${p.x} ${p.y})`}
                        onClick={() => inspect(c.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CellBody cell={c} tick={tick} />
                        {active && detail && <Interior cell={c} />}
                        {active && (
                          <circle r="46" fill="none" stroke="#f97316" strokeWidth={3 / zoom} strokeDasharray="7 6" />
                        )}
                        {seen.includes(c.id) && !active && (
                          <circle r="40" fill="none" stroke="#0f766e" strokeWidth={2 / zoom} opacity="0.65" />
                        )}
                      </g>
                    )
                  })}
                </g>
              </g>

              <text x={FX} y={FY + FR + 26} fontSize="13" fontWeight="900" fill="#78716c" textAnchor="middle">
                {zoom.toFixed(1)}× {detail ? '— interior resolved' : '— whole field'}
              </text>

              {focus && (
                <g>
                  <rect x="474" y="60" width="132" height="96" rx="12" fill="#FFFFFF" stroke="#78716c" strokeWidth="2.5" />
                  <text x="540" y="84" fontSize="12" fontWeight="900" fill="#1c1917" textAnchor="middle">
                    {focus.name}
                  </text>
                  <text x="540" y="108" fontSize="11.5" fontWeight="900" fill={focus.type === 'prokaryote' ? '#b45309' : '#7C3AED'} textAnchor="middle">
                    {focus.type}
                  </text>
                  <text x="540" y="132" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                    {detail ? (focus.type === 'prokaryote' ? 'DNA loose inside' : 'DNA inside a nucleus') : 'zoom in to check'}
                  </text>
                </g>
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {focus ? focus.name : 'Open field'}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {focus ? focus.job : caption}
              </p>
            </div>

            <div>
              <label htmlFor="sf-zoom" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Objective zoom — {zoom.toFixed(1)}×
              </label>
              <input
                id="sf-zoom"
                type="range"
                min={1}
                max={6}
                step={0.1}
                value={zoom}
                onChange={(e) => changeZoom(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                The cells keep swimming while you are in close — the view follows the one
                you picked.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cells inspected — {seen.length} of {CELLS.length}
              </p>
              <div className="space-y-1.5">
                {CELLS.map((c) => {
                  const ok = seen.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => inspect(c.id)}
                      className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left transition-colors ${
                        ok
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : focusId === c.id
                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/25'
                            : 'border-stone-200 bg-white hover:border-primary-400 dark:border-stone-600 dark:bg-stone-800'
                      }`}
                    >
                      <span className="block text-xs font-black text-stone-900 dark:text-white">
                        {ok ? '✓ ' : ''}
                        {c.name}
                      </span>
                      <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                        {ok ? c.type : 'not inspected yet'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {caption} {seen.length} of {CELLS.length} cells inspected.
      </p>
    </>
  )
}
