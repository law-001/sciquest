import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w12-l1 signature interactive: a field of living cells you can go into.
//
// Six cells drift under the objective from the moment the block paints, each
// one shaped for the job it actually does. Pick one and the view zooms onto it
// while it keeps moving, and at about 2.5x the interior resolves.
//
// The prokaryote and eukaryote split is never stated as a rule here. It is what
// the student sees when they zoom into the bacterium expecting a nucleus and
// find a loose loop of DNA lying in the cytoplasm with nothing holding it.
//
// The scene is the eyepiece view itself. The microscope barrel fills the frame
// and bleeds off every edge, so no empty gradient is left around the picture,
// and the engraved plate on the right carries the live readouts.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The barrel runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in this margin.
const BLEED = 60

const FX = 214
const FY = 195
const FR = 164

const PLATE_X = 404
const PLATE_W = 170

const DETAIL_ZOOM = 2.5

const BARREL = '#57534e'
const BARREL_DARK = '#44403c'
const BARREL_LIT = '#8b8378'
const INK = '#44403c'
const INK_MID = '#78716c'
const NUCLEUS_INK = '#5B21B6'

const CELLS = [
  {
    id: 'cheek',
    shape: 'round',
    type: 'eukaryote',
    name: 'Cheek cell',
    job: 'Lines your mouth. Flat, so it tiles a surface without gaps.',
    x: 146, y: 142, phase: 0.0, speed: 0.05, tint: '#F5C6C6',
  },
  {
    id: 'neuron',
    shape: 'neuron',
    type: 'eukaryote',
    name: 'Nerve cell',
    job: 'Carries signals a metre down your leg, so it is built as one long wire.',
    x: 278, y: 138, phase: 1.4, speed: 0.035, tint: '#FBD9A5',
  },
  {
    id: 'palisade',
    shape: 'leaf',
    type: 'eukaryote',
    name: 'Palisade cell',
    job: 'Catches sunlight. A tall box packed with chloroplasts, held by a wall.',
    x: 146, y: 248, phase: 2.6, speed: 0.042, tint: '#CFE8C9',
  },
  {
    id: 'sperm',
    shape: 'sperm',
    type: 'eukaryote',
    name: 'Sperm cell',
    job: 'Built to travel: a tail, and mitochondria stacked behind the head.',
    x: 278, y: 250, phase: 3.9, speed: 0.075, tint: '#D8CBF0',
  },
  {
    id: 'ecoli',
    shape: 'rod',
    type: 'prokaryote',
    name: 'E. coli',
    job: 'Lives in a gut. Splits every twenty minutes, with no nucleus to copy.',
    x: 104, y: 196, phase: 5.1, speed: 0.09, tint: '#9AD5CF',
  },
  {
    id: 'cyano',
    shape: 'coccus',
    type: 'prokaryote',
    name: 'Cyanobacterium',
    job: 'Photosynthesises with folded membranes instead of chloroplasts.',
    x: 320, y: 196, phase: 0.8, speed: 0.065, tint: '#A9CDEE',
  },
]

// Drifting grit in the water, so the field reads as a wet mount rather than a
// blank disc. Fixed positions keep the scene identical on every render.
const SPECKS = Array.from({ length: 18 }, (_, i) => [
  68 + ((i * 97) % 292),
  56 + ((i * 53) % 268),
])

function positionOf(cell, tick) {
  return {
    x: cell.x + Math.sin(tick * cell.speed + cell.phase) * 26,
    y: cell.y + Math.cos(tick * cell.speed * 0.8 + cell.phase * 1.7) * 18,
  }
}

// A label pinned to the cell it names. It rides with the cell, so it sits
// inside the zoomed group, but the glyphs are counter-scaled: at 3.2x an
// unscaled label rendered three times its authored size and ran straight over
// the drawing. The cream halo keeps it readable over a tinted cell body.
function PinLabel({ y, zoom, fill, size = 12, children }) {
  return (
    <g transform={`translate(0 ${y}) scale(${1 / zoom})`}>
      <text
        fontSize={size}
        fontWeight="900"
        fill={fill}
        textAnchor="middle"
        stroke="#FDF7EC"
        strokeWidth="3.5"
        paintOrder="stroke"
      >
        {children}
      </text>
    </g>
  )
}

// What resolves once the objective is past DETAIL_ZOOM. Drawn in the cell's own
// coordinates, so it rides along while the cell keeps drifting.
function Interior({ cell, zoom }) {
  if (cell.type === 'prokaryote') {
    return (
      <g>
        {/* One closed loop of DNA, lying free in the cytoplasm. */}
        <ellipse rx="13" ry="8" fill="none" stroke="#0f766e" strokeWidth="2.6" />
        <ellipse
          rx="13"
          ry="8"
          fill="none"
          stroke="#0f766e"
          strokeWidth="1.2"
          opacity="0.6"
          transform="rotate(26)"
        />
        {/* Free ribosomes, not held on any membrane. */}
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={-20 + (i % 5) * 10}
            cy={-13 + Math.floor(i / 5) * 26}
            r="1.8"
            fill="#44403c"
          />
        ))}
        <PinLabel y={-30} zoom={zoom} fill="#b45309">
          no nucleus
        </PinLabel>
        <PinLabel y={34} zoom={zoom} fill="#0f766e" size={11}>
          loose DNA loop
        </PinLabel>
      </g>
    )
  }
  return (
    <g>
      {/* Nuclear envelope: two membranes with pores punched through. */}
      <circle r="13" fill="#C4B5FD" stroke={NUCLEUS_INK} strokeWidth="2.2" />
      <circle r="9.6" fill="none" stroke={NUCLEUS_INK} strokeWidth="0.9" opacity="0.7" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={Math.cos(a) * 13}
            cy={Math.sin(a) * 13}
            r="1.5"
            fill="#FDF7EC"
            stroke={NUCLEUS_INK}
            strokeWidth="0.6"
          />
        )
      })}
      <circle r="4.6" fill="#4C1D95" />
      {/* Mitochondria, with cristae folded inside. */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 25} ${s * 15})`}>
          <ellipse rx="8.5" ry="4.4" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="1.3" />
          <path d="M -5 0 q 2.5 -3.2 5 0 q 2.5 3.2 5 0" fill="none" stroke="#B91C1C" strokeWidth="1" />
        </g>
      ))}
      {/* Ribosomes scattered through the cytoplasm. */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={-21 + i * 8.5} cy={i % 2 ? -18 : 19} r="1.5" fill="#B45309" />
      ))}
      {cell.shape === 'leaf' &&
        [0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${-18 + i * 12} 24)`}>
            <ellipse rx="5.5" ry="3.4" fill="#15803D" />
            <path d="M -3.4 0 L 3.4 0" stroke="#064E3B" strokeWidth="0.8" />
          </g>
        ))}
      <PinLabel y={-20} zoom={zoom} fill={NUCLEUS_INK}>
        nucleus
      </PinLabel>
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
        {/* Myelin blocks along the axon. */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={10 + i * 18}
            y="-5"
            width="13"
            height="10"
            rx="4"
            fill="#E7E5E4"
            stroke="#44403c"
            strokeWidth="1.4"
          />
        ))}
        <path
          d="M -22 -18 L -44 -34 M -26 0 L -52 2 M -22 18 L -42 34"
          fill="none"
          stroke="#44403c"
          strokeWidth="3"
        />
        <path
          d="M -44 -34 L -54 -42 M -44 -34 L -52 -26 M -52 2 L -62 -4 M -52 2 L -62 8 M -42 34 L -52 42 M -42 34 L -50 26"
          fill="none"
          stroke="#44403c"
          strokeWidth="1.8"
        />
        <circle r="22" {...common} />
      </g>
    )
  }
  if (cell.shape === 'leaf') {
    return (
      <g>
        <rect x="-26" y="-34" width="52" height="68" rx="6" {...common} />
        {/* The cell wall, outside the membrane. */}
        <rect x="-30" y="-38" width="60" height="76" rx="8" fill="none" stroke="#15803D" strokeWidth="3.4" />
        <rect
          x="-33"
          y="-41"
          width="66"
          height="82"
          rx="10"
          fill="none"
          stroke="#15803D"
          strokeWidth="1.2"
          opacity="0.5"
        />
      </g>
    )
  }
  if (cell.shape === 'sperm') {
    return (
      <g>
        <path d={`M 14 0 q 22 ${wag} 44 ${-wag}`} fill="none" stroke="#44403c" strokeWidth="3" />
        <ellipse cx="0" cy="0" rx="20" ry="14" {...common} />
        {/* Midpiece: the energy section behind the head. */}
        <rect x="14" y="-5" width="12" height="10" rx="3" fill="#FCA5A5" stroke="#44403c" strokeWidth="1.6" />
      </g>
    )
  }
  if (cell.shape === 'rod') {
    return (
      <g>
        <path d={`M 32 0 q 16 ${wag} 32 ${-wag * 0.6}`} fill="none" stroke="#44403c" strokeWidth="2.6" />
        <rect x="-32" y="-16" width="64" height="32" rx="16" {...common} />
        {/* Pili: the short hairs a bacterium grips with. */}
        <path
          d="M -30 -14 L -38 -22 M -14 -16 L -16 -26 M 6 -16 L 10 -26 M -20 16 L -24 26 M 4 16 L 6 26"
          fill="none"
          stroke="#0f766e"
          strokeWidth="1.4"
        />
      </g>
    )
  }
  if (cell.shape === 'coccus') {
    return (
      <g>
        <circle r="24" {...common} />
        {/* Thylakoid membranes folded against the inside of the wall. */}
        <circle r="19" fill="none" stroke="#0f766e" strokeWidth="2" opacity="0.7" />
        <circle r="14.5" fill="none" stroke="#0f766e" strokeWidth="1.4" opacity="0.5" />
      </g>
    )
  }
  return (
    <g>
      <ellipse rx="30" ry="22" {...common} />
      <ellipse rx="30" ry="22" fill="none" stroke="#44403c" strokeWidth="0.9" opacity="0.5" transform="scale(0.88)" />
    </g>
  )
}

// The microscope body the field is cut into. It bleeds off every edge, so the
// stage frame is filled corner to corner.
function Barrel() {
  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BARREL} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect
          key={i}
          x={-BLEED + i * 54}
          y={-BLEED}
          width="10"
          height={H + BLEED * 2}
          fill={BARREL_DARK}
          opacity="0.35"
        />
      ))}
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height="26" fill={BARREL_LIT} opacity="0.25" />
      <circle cx={FX} cy={FY} r={FR + 18} fill={BARREL_LIT} opacity="0.5" />
      <circle cx={FX} cy={FY} r={FR + 8} fill={BARREL_DARK} />
      {/* Engraved graduations around the rim of the eyepiece. */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r1 = FR + 3
        const r2 = FR + (i % 6 === 0 ? 14 : 9)
        return (
          <line
            key={i}
            x1={FX + Math.cos(a) * r1}
            y1={FY + Math.sin(a) * r1}
            x2={FX + Math.cos(a) * r2}
            y2={FY + Math.sin(a) * r2}
            stroke="#d6d3d1"
            strokeWidth={i % 6 === 0 ? 2.4 : 1.2}
            opacity="0.8"
          />
        )
      })}
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

  const dnaLine = !focus
    ? 'pick a cell'
    : !detail
      ? 'zoom in to check'
      : focus.type === 'prokaryote'
        ? 'loose in cytoplasm'
        : 'inside a nucleus'

  const caption = focus
    ? detail
      ? `${focus.name}: DNA ${dnaLine}.`
      : `${focus.name}. Zoom past ${DETAIL_ZOOM}x to see inside.`
    : 'Six cells drifting under the lens. Pick one.'

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={caption}
              style={stageFill(W, H)}
            >
              <defs>
                <clipPath id="sfield-clip">
                  <circle cx={FX} cy={FY} r={FR} />
                </clipPath>
              </defs>

              <Barrel />

              <circle cx={FX} cy={FY} r={FR} fill="#FDF7EC" stroke={INK} strokeWidth="2.5" />

              <g clipPath="url(#sfield-clip)">
                <g transform={view}>
                  {SPECKS.map(([sx, sy], i) => (
                    <circle
                      key={i}
                      cx={sx + Math.sin(tick * 0.02 + i) * 4}
                      cy={sy + Math.cos(tick * 0.017 + i) * 3}
                      r="1.6"
                      fill="#a8a29e"
                      opacity="0.5"
                    />
                  ))}

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
                        {active && detail && <Interior cell={c} zoom={zoom} />}
                        {/* Markers are for picking a cell out of the field. Once
                            the view is inside one they only crowd it, and the
                            plate already names what is in view. */}
                        {!detail && active && (
                          <circle r="46" fill="none" stroke="#f97316" strokeWidth={3 / zoom} strokeDasharray="7 6" />
                        )}
                        {!detail && seen.includes(c.id) && !active && (
                          <circle r="40" fill="none" stroke="#0f766e" strokeWidth={2 / zoom} opacity="0.65" />
                        )}
                      </g>
                    )
                  })}
                </g>
              </g>

              {/* Engraved plate on the barrel: every live number lives here. */}
              <g>
                <rect
                  x={PLATE_X}
                  y="56"
                  width={PLATE_W}
                  height="278"
                  rx="10"
                  fill="#fff7ed"
                  stroke={INK_MID}
                  strokeWidth="2.5"
                />
                {[
                  [PLATE_X + 11, 67],
                  [PLATE_X + PLATE_W - 11, 67],
                  [PLATE_X + 11, 323],
                  [PLATE_X + PLATE_W - 11, 323],
                ].map(([rx, ry]) => (
                  <circle
                    key={`${rx}-${ry}`}
                    cx={rx}
                    cy={ry}
                    r="3"
                    fill="#d6d3d1"
                    stroke={INK_MID}
                    strokeWidth="0.8"
                  />
                ))}

                <text x={PLATE_X + 16} y="86" fontSize="9" fontWeight="800" fill={INK_MID}>
                  OBJECTIVE
                </text>
                <text x={PLATE_X + 16} y="112" fontSize="23" fontWeight="900" fill={INK}>
                  {zoom.toFixed(1)}x
                </text>
                <line x1={PLATE_X + 12} y1="124" x2={PLATE_X + PLATE_W - 12} y2="124" stroke="#e7e5e4" strokeWidth="2" />

                <text x={PLATE_X + 16} y="144" fontSize="9" fontWeight="800" fill={INK_MID}>
                  IN VIEW
                </text>
                <text x={PLATE_X + 16} y="164" fontSize="12" fontWeight="900" fill="#1c1917">
                  {focus ? focus.name : 'whole field'}
                </text>
                {focus && (
                  <>
                    <rect
                      x={PLATE_X + 14}
                      y="172"
                      width={PLATE_W - 28}
                      height="20"
                      rx="6"
                      fill={focus.type === 'prokaryote' ? '#FEF3C7' : '#EDE9FE'}
                      stroke={focus.type === 'prokaryote' ? '#b45309' : '#7C3AED'}
                      strokeWidth="1.6"
                    />
                    <text
                      x={PLATE_X + PLATE_W / 2}
                      y="186"
                      fontSize="10.5"
                      fontWeight="900"
                      fill={focus.type === 'prokaryote' ? '#b45309' : '#7C3AED'}
                      textAnchor="middle"
                    >
                      {focus.type}
                    </text>
                  </>
                )}
                <line x1={PLATE_X + 12} y1="204" x2={PLATE_X + PLATE_W - 12} y2="204" stroke="#e7e5e4" strokeWidth="2" />

                <text x={PLATE_X + 16} y="224" fontSize="9" fontWeight="800" fill={INK_MID}>
                  DNA IS
                </text>
                <text x={PLATE_X + 16} y="242" fontSize="11" fontWeight="900" fill={INK}>
                  {dnaLine}
                </text>
                <line x1={PLATE_X + 12} y1="258" x2={PLATE_X + PLATE_W - 12} y2="258" stroke="#e7e5e4" strokeWidth="2" />

                <text x={PLATE_X + 16} y="278" fontSize="9" fontWeight="800" fill={INK_MID}>
                  INSPECTED
                </text>
                <text x={PLATE_X + 16} y="302" fontSize="19" fontWeight="900" fill={INK}>
                  {seen.length} of {CELLS.length}
                </text>
                {CELLS.map((c, i) => (
                  <circle
                    key={c.id}
                    cx={PLATE_X + 20 + i * 22}
                    cy="318"
                    r="6"
                    fill={seen.includes(c.id) ? '#0f766e' : '#FFFFFF'}
                    stroke={INK_MID}
                    strokeWidth="1.6"
                  />
                ))}
              </g>
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
              <label
                htmlFor="sf-zoom"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Objective zoom: {zoom.toFixed(1)}x
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
                The view follows the cell you picked.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cells inspected: {seen.length} of {CELLS.length}
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
