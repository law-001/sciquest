import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w13-l1 signature interactive: one cell, dragged from animal to plant.
//
// There is only ever one cell on screen. The morph slider moves every number
// that defines it at once: the outline goes from round to boxy, the wall, the
// big vacuole and the chloroplasts fade up, the centrioles and lysosomes fade
// down. The structures both cells share never move at all through the whole
// drag, which is the comparison the lesson wants, made by watching what stays
// still.
//
// The water slider then does the other half. Volume climbs the same way in both
// forms; what differs is what stops it. The plant cell runs into a wall, its
// membrane is pressed flat against it and the pressure reading rises instead of
// the size. The animal cell has nothing to run into, so it bursts.
//
// Every label sits in the margin on one side of the cell with an arrow into the
// part it names, so no text is ever drawn over the drawing.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The fluid outside the cell runs past the viewBox so a cropped edge never
// shows a seam. Nothing readable goes in that margin.
const BLEED = 60

const CX = 300
const CY = 196

// The label gutters. The cell is sized to stay between them.
const LEFT_TEXT = 120
const LEFT_LEAD = 126
const RIGHT_TEXT = 486
const RIGHT_LEAD = 480

const BURST_AT = 78
const BURST_TICKS = 14

// Every structure, with the range of the morph over which it exists. A shared
// structure is present at both ends, so it never fades and never moves.
const PARTS = [
  { id: 'membrane', name: 'Cell membrane', kind: 'shared' },
  { id: 'cytoplasm', name: 'Cytoplasm', kind: 'shared' },
  { id: 'nucleus', name: 'Nucleus', kind: 'shared' },
  { id: 'mitochondria', name: 'Mitochondria', kind: 'shared' },
  { id: 'ribosomes', name: 'Ribosomes', kind: 'shared' },
  { id: 'wall', name: 'Cell wall', kind: 'plant', from: 0.18 },
  { id: 'vacuole', name: 'Central vacuole', kind: 'plant', from: 0.34 },
  { id: 'chloroplasts', name: 'Chloroplasts', kind: 'plant', from: 0.52 },
  { id: 'centrioles', name: 'Centrioles', kind: 'animal', until: 0.46 },
  { id: 'lysosomes', name: 'Lysosomes', kind: 'animal', until: 0.62 },
]

const STEPS = [
  ['toPlant', 'Plant cell, fully morphed'],
  ['toAnimal', 'Animal cell, fully morphed'],
  ['turgid', 'Plant cell flooded, stays firm'],
  ['burst', 'Animal cell flooded, bursts'],
]

// Faint grain in the cytoplasm, held as fractions of the box so it stretches
// with the cell instead of pooling in one corner.
const GRAIN = Array.from({ length: 30 }, (_, i) => [
  0.06 + ((i * 17) % 89) / 100,
  0.07 + ((i * 29) % 87) / 100,
])

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const lerp = (a, b, t) => a + (b - a) * t

const presenceOf = (part, m) =>
  part.kind === 'shared'
    ? 1
    : part.kind === 'plant'
      ? clamp01((m - part.from) / 0.18)
      : clamp01((part.until - m) / 0.18)

// A label in the margin plus the arrow that ties it to its part. `side` says
// which gutter the text sits in; the arrow always ends on the structure.
function Tag({ side, text, y, toX, toY, colour, opacity = 1 }) {
  const fromX = side === 'left' ? LEFT_LEAD : RIGHT_LEAD
  const fromY = y - 4
  const angle = Math.atan2(toY - fromY, toX - fromX)
  const head = 7
  const tip = [
    [toX, toY],
    [toX - head * Math.cos(angle - 0.42), toY - head * Math.sin(angle - 0.42)],
    [toX - head * Math.cos(angle + 0.42), toY - head * Math.sin(angle + 0.42)],
  ]
  return (
    <g opacity={opacity}>
      <text
        x={side === 'left' ? LEFT_TEXT : RIGHT_TEXT}
        y={y}
        fontSize="13"
        fontWeight="900"
        fill={colour}
        textAnchor={side === 'left' ? 'end' : 'start'}
      >
        {text}
      </text>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX - Math.cos(angle) * head}
        y2={toY - Math.sin(angle) * head}
        stroke={colour}
        strokeWidth="1.8"
      />
      <polygon points={tip.map((p) => p.join(',')).join(' ')} fill={colour} />
    </g>
  )
}

function Mitochondrion({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx="26" ry="14" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="2.6" />
      <path d="M -17 -5 q 6 11 12 0 q 6 -11 12 0" fill="none" stroke="#B91C1C" strokeWidth="2.2" />
      <path
        d="M -17 6 q 6 -11 12 0 q 6 11 12 0"
        fill="none"
        stroke="#B91C1C"
        strokeWidth="1.6"
        opacity="0.75"
      />
    </g>
  )
}

// The grana stacks are what make a chloroplast look like a chloroplast rather
// than a green dot, so they are drawn even at this size.
function Chloroplast({ x, y, grow }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${grow})`} opacity={grow}>
      <ellipse rx="20" ry="12" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
      {[-9, 0, 9].map((dx) => (
        <g key={dx}>
          <line x1={dx} y1="-6" x2={dx} y2="6" stroke="#BBF7D0" strokeWidth="3.2" />
          <line x1={dx} y1="-6" x2={dx} y2="6" stroke="#14532D" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
    </g>
  )
}

export default function CellMorphWidget({ onSolved }) {
  const [morph, setMorph] = useState(0)
  const [water, setWater] = useState(0)
  const [burst, setBurst] = useState(0)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const burstRef = useRef(0)
  const stillRef = useRef(false)

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    stillRef.current = still
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [])

  // The rupture is a one-shot, so it runs on its own short timer rather than
  // being derived from the slider: pulling the water back down afterwards must
  // not un-burst a cell.
  useEffect(() => {
    if (burst <= 0 || burst >= 1) return undefined
    const id = setTimeout(() => {
      burstRef.current = Math.min(1, burstRef.current + 1 / BURST_TICKS)
      setBurst(burstRef.current)
    }, 55)
    return () => clearTimeout(id)
  }, [burst])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === STEPS.length) onSolved?.()
  }

  function changeMorph(value) {
    setMorph(value)
    if (value >= 98) win('toPlant')
    if (value <= 2) win('toAnimal')
  }

  function changeWater(value) {
    setWater(value)
    const m = morph / 100
    if (value < BURST_AT) return
    if (m >= 0.55) {
      win('turgid')
    } else if (m <= 0.45) {
      win('burst')
      if (burstRef.current === 0) {
        burstRef.current = stillRef.current ? 1 : 1 / BURST_TICKS
        setBurst(burstRef.current)
      }
    }
  }

  function freshCell() {
    burstRef.current = 0
    setBurst(0)
    setWater(0)
  }

  const m = morph / 100
  const isPlant = m >= 0.55
  const plantish = m > 0.5
  // Volume climbs with the water outside; the wall is what caps it.
  const swell = 1 + (water / 100) * (plantish ? 0.07 : 0.24)
  const turgor = plantish ? Math.round((water / 100) * 620) : 0
  const volume = Math.round((swell * swell - 1) * 100)

  const bw = lerp(190, 280, m) * swell
  const bh = lerp(190, 204, m) * swell
  const rx = lerp(95, 18, m)
  const L = CX - bw / 2
  const R = CX + bw / 2
  const T = CY - bh / 2
  const B = CY + bh / 2
  // Turgor presses the membrane flat against the wall, so the gap closes.
  const gap = 16 - (water / 100) * 11

  const open = burst > 0 ? burst : 0
  const pres = Object.fromEntries(PARTS.map((p) => [p.id, presenceOf(p, m)]))
  const wet = clamp01(water / 25)

  const status = burst >= 1
    ? 'Burst. Nothing was there to stop the swelling.'
    : isPlant
      ? water >= BURST_AT
        ? `Firm. ${turgor} kPa on the wall, only +${volume}% bigger.`
        : `Plant cell. +${volume}% bigger, ${turgor} kPa.`
      : water >= BURST_AT
        ? 'Animal cell stretching, with nothing holding it in.'
        : `Animal cell. +${volume}% bigger.`

  const hint = !wins.includes('toPlant')
    ? 'Drag the first slider all the way right.'
    : !wins.includes('toAnimal')
      ? 'Now drag it all the way back to the left.'
      : !wins.includes('turgid')
        ? 'Go back to plant, then raise the water slider.'
        : !wins.includes('burst')
          ? 'Switch to animal, then raise the water again.'
          : 'All four done. Turn the card over.'

  const caption = burst >= 1
    ? 'burst, contents lost'
    : `${isPlant ? 'plant cell' : 'animal cell'} · +${volume}% · ${isPlant ? `${turgor} kPa` : 'no wall'}`

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${isPlant ? 'Plant' : 'Animal'} cell, morph ${morph} per cent. ${status}`}
              style={stageFill(W, H)}
            >
              {/* Fluid outside the cell, bled past the viewBox on all sides. */}
              <rect
                x={-BLEED}
                y={-BLEED}
                width={W + BLEED * 2}
                height={H + BLEED * 2}
                fill="#DCEAF0"
              />
              {/* Dissolved solutes outside. The purer the water, the fewer. */}
              {Array.from({ length: 12 }, (_, i) => (
                <circle
                  key={i}
                  cx={-24 + ((i * 179) % 680)}
                  cy={-16 + ((i * 113) % 424)}
                  r="6"
                  fill="#B7CFD9"
                  opacity={0.85 - (water / 100) * 0.7}
                />
              ))}

              {/* Water marching in from both sides once the slider is up. */}
              {water > 2 &&
                [CY - 58, CY + 58].map((wy, i) =>
                  [-1, 1].map((side) => {
                    const dist = 22 - ((tick * 2.2 + i * 9 + (side > 0 ? 11 : 0)) % 22)
                    const edge = side < 0 ? L - gap - 10 : R + gap + 10
                    return (
                      <circle
                        key={`${wy}-${side}`}
                        cx={edge + side * (8 + dist)}
                        cy={wy}
                        r="5"
                        fill="#38BDF8"
                        opacity={wet * (dist / 22) * 0.9}
                      />
                    )
                  }),
                )}

              {/* Cell wall, plant only. Two layers of cellulose, the inner one
                  dashed so the layering reads at this size. */}
              {pres.wall > 0.01 && (
                <g opacity={pres.wall}>
                  <rect
                    x={L - gap - 11}
                    y={T - gap - 11}
                    width={bw + (gap + 11) * 2}
                    height={bh + (gap + 11) * 2}
                    rx={rx + 14}
                    fill="#DCFCE7"
                    stroke="#15803D"
                    strokeWidth={9 * pres.wall}
                  />
                  <rect
                    x={L - gap - 4}
                    y={T - gap - 4}
                    width={bw + (gap + 4) * 2}
                    height={bh + (gap + 4) * 2}
                    rx={rx + 8}
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="1.6"
                    strokeDasharray="7 8"
                    opacity="0.7"
                  />
                </g>
              )}

              <g
                transform={
                  open
                    ? `translate(${CX} ${CY}) scale(${1 + open * 0.16}) translate(${-CX} ${-CY})`
                    : undefined
                }
              >
                {/* Membrane and cytoplasm. The hairline inside the outer stroke
                    is the second layer of the bilayer. */}
                <rect
                  x={L}
                  y={T}
                  width={bw}
                  height={bh}
                  rx={rx}
                  fill="#FDF7EC"
                  stroke={open ? '#DC2626' : '#B45309'}
                  strokeWidth="5"
                  strokeDasharray={open ? `${22 - open * 16} ${open * 26}` : undefined}
                  opacity={1 - open * 0.55}
                />
                <rect
                  x={L + 6}
                  y={T + 6}
                  width={bw - 12}
                  height={bh - 12}
                  rx={Math.max(4, rx - 6)}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.6"
                  opacity={0.8 - open * 0.8}
                />
                {GRAIN.map(([fx, fy], i) => (
                  <circle key={i} cx={L + bw * fx} cy={T + bh * fy} r="2" fill="#E7E0D2" />
                ))}

                {/* Central vacuole, plant only, drawn behind the organelles.
                    It is what the water actually fills. */}
                {pres.vacuole > 0.01 && (
                  <g opacity={pres.vacuole}>
                    <rect
                      x={306}
                      y={T + 34}
                      width={(R - 20 - 306) * pres.vacuole}
                      height={bh - 68}
                      rx="18"
                      fill="#7BC9CF"
                      opacity={0.35 + (water / 100) * 0.3}
                    />
                    <rect
                      x={306}
                      y={T + 34}
                      width={(R - 20 - 306) * pres.vacuole}
                      height={bh - 68}
                      rx="18"
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="2.6"
                    />
                  </g>
                )}

                {/* Chloroplasts hug the inside of the wall, so they follow the
                    box rather than sitting at fixed points. */}
                {pres.chloroplasts > 0.01 && (
                  <>
                    <Chloroplast x={L + 46} y={B - 24} grow={pres.chloroplasts} />
                    <Chloroplast x={L + 100} y={B - 24} grow={pres.chloroplasts} />
                    <Chloroplast x={L + 154} y={B - 24} grow={pres.chloroplasts} />
                    <Chloroplast x={L + 22} y={T + 58} grow={pres.chloroplasts} />
                    <Chloroplast x={L + 22} y={B - 62} grow={pres.chloroplasts} />
                  </>
                )}

                {/* Shared structures. None of these coordinates involve the
                    morph at all, which is the thing to notice. */}
                <g>
                  <circle cx="246" cy="174" r="32" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="3.5" />
                  <circle
                    cx="246"
                    cy="174"
                    r="26"
                    fill="none"
                    stroke="#5B21B6"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  {Array.from({ length: 8 }, (_, i) => {
                    const a = (i / 8) * Math.PI * 2
                    return (
                      <circle
                        key={i}
                        cx={246 + Math.cos(a) * 29}
                        cy={174 + Math.sin(a) * 29}
                        r="2.6"
                        fill="#3B0764"
                      />
                    )
                  })}
                  <circle cx="239" cy="167" r="10" fill="#5B21B6" />
                  <path
                    d="M 230 188 q 11 -7 20 2 q 9 9 16 -2"
                    fill="none"
                    stroke="#5B21B6"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </g>

                <Mitochondrion x={336} y={136} />
                <Mitochondrion x={340} y={200} />

                {/* Rough ER: folded sheets with ribosomes sitting on them. */}
                <g>
                  {[236, 248].map((ey) => (
                    <path
                      key={ey}
                      d={`M 284 ${ey} q 21 -12 42 0 q 21 12 40 0`}
                      fill="none"
                      stroke="#9A3412"
                      strokeWidth="3"
                    />
                  ))}
                  {Array.from({ length: 8 }, (_, i) => (
                    <circle
                      key={i}
                      cx={288 + i * 11}
                      cy={(i % 2 ? 248 : 236) + (i % 3 === 0 ? -5 : 5)}
                      r="3"
                      fill="#7C2D12"
                    />
                  ))}
                </g>

                {/* Golgi: three stacked sacs with two vesicles budding off. */}
                <g>
                  {[224, 234, 244].map((gy, i) => (
                    <path
                      key={gy}
                      d={`M ${212 + i * 4} ${gy} q 28 -11 ${56 - i * 7} 0`}
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx="274" cy="252" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.4" />
                  <circle cx="286" cy="260" r="4" fill="#FBBF24" stroke="#B45309" strokeWidth="1.4" />
                </g>

                {/* Free ribosomes. */}
                {Array.from({ length: 8 }, (_, i) => (
                  <circle
                    key={i}
                    cx={212 + (i % 4) * 12}
                    cy={208 + Math.floor(i / 4) * 12}
                    r="3.2"
                    fill="#B45309"
                  />
                ))}

                {/* Animal-only structures fade out as the morph runs. */}
                {pres.centrioles > 0.01 && (
                  <g opacity={pres.centrioles}>
                    <rect
                      x="266"
                      y="119"
                      width="11"
                      height="24"
                      rx="3.5"
                      fill="#57534e"
                      stroke="#292524"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="280"
                      y="123"
                      width="24"
                      height="11"
                      rx="3.5"
                      fill="#57534e"
                      stroke="#292524"
                      strokeWidth="1.6"
                    />
                    {[0, 1, 2].map((i) => (
                      <circle key={i} cx={286 + i * 8} cy="128.5" r="1.8" fill="#E7E5E4" />
                    ))}
                  </g>
                )}
                {pres.lysosomes > 0.01 && (
                  <g opacity={pres.lysosomes}>
                    {[[288, 168], [296, 192]].map(([lx, ly]) => (
                      <g key={lx}>
                        <circle cx={lx} cy={ly} r="9" fill="#F59E0B" stroke="#78350F" strokeWidth="1.8" />
                        <circle cx={lx - 3} cy={ly - 2} r="1.8" fill="#78350F" />
                        <circle cx={lx + 3} cy={ly + 3} r="1.8" fill="#78350F" />
                      </g>
                    ))}
                  </g>
                )}

                {/* Turgor: the push outward once the vacuole starts filling. */}
                {pres.wall > 0.05 && water > 4 && (
                  <g
                    opacity={pres.wall * (water / 100)}
                    stroke="#0F766E"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    {[
                      [L + 14, CY, -1, 0],
                      [R - 14, CY, 1, 0],
                      [CX - 60, T + 14, 0, -1],
                      [CX + 60, T + 14, 0, -1],
                    ].map(([px, py, dx, dy]) => (
                      <line key={`${px}-${py}`} x1={px} y1={py} x2={px + dx * 12} y2={py + dy * 12} />
                    ))}
                  </g>
                )}
              </g>

              {/* Contents leaving a burst cell. */}
              {open > 0 &&
                Array.from({ length: 7 }, (_, i) => {
                  const a = (i / 7) * Math.PI * 2
                  const d = 104 + open * 130
                  return (
                    <circle
                      key={i}
                      cx={CX + Math.cos(a) * d}
                      cy={CY + Math.sin(a) * d * 0.62}
                      r="6"
                      fill="#FCA5A5"
                      opacity={1 - open * 0.5}
                    />
                  )
                })}

              {/* Labels. All of them live in a gutter beside the cell and reach
                  their part with an arrow, so none is drawn over the artwork. */}
              <Tag side="left" text="nucleus" y={178} toX={216} toY={176} colour="#3B0764" />
              <Tag side="right" text="mitochondria" y={126} toX={364} toY={134} colour="#7F1D1D" />
              {pres.centrioles > 0.05 && (
                <Tag
                  side="left"
                  text="centrioles"
                  y={112}
                  toX={262}
                  toY={126}
                  colour="#292524"
                  opacity={pres.centrioles}
                />
              )}
              {pres.lysosomes > 0.05 && (
                <Tag
                  side="right"
                  text="lysosomes"
                  y={200}
                  toX={306}
                  toY={192}
                  colour="#78350F"
                  opacity={pres.lysosomes}
                />
              )}
              {pres.chloroplasts > 0.05 && (
                <Tag
                  side="left"
                  text="chloroplasts"
                  y={250}
                  toX={L + 2}
                  toY={B - 62}
                  colour="#14532D"
                  opacity={pres.chloroplasts}
                />
              )}
              {pres.vacuole > 0.05 && (
                <Tag
                  side="right"
                  text="central vacuole"
                  y={288}
                  toX={R - 32}
                  toY={B - 46}
                  colour="#134E4A"
                  opacity={pres.vacuole}
                />
              )}
              {pres.wall > 0.05 && (
                <g opacity={pres.wall}>
                  <text
                    x={CX}
                    y={T - gap - 32}
                    fontSize="13"
                    fontWeight="900"
                    fill="#14532D"
                    textAnchor="middle"
                  >
                    cell wall
                  </text>
                  <line
                    x1={CX}
                    y1={T - gap - 28}
                    x2={CX}
                    y2={T - gap - 20}
                    stroke="#14532D"
                    strokeWidth="1.8"
                  />
                  <polygon
                    points={`${CX},${T - gap - 13} ${CX - 4},${T - gap - 20} ${CX + 4},${T - gap - 20}`}
                    fill="#14532D"
                  />
                </g>
              )}

              <text
                x={CX}
                y="366"
                fontSize="13"
                fontWeight="900"
                fill={burst >= 1 ? '#DC2626' : isPlant ? '#15803D' : '#B45309'}
                textAnchor="middle"
              >
                {caption}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                burst >= 1
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Next: {hint}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <label
                  htmlFor="cm-morph"
                  className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Animal to plant
                </label>
                <span className="text-xs font-black text-stone-900 dark:text-white">
                  {morph}% plant
                </span>
              </div>
              <input
                id="cm-morph"
                type="range"
                min={0}
                max={100}
                step={1}
                value={morph}
                onChange={(e) => changeMorph(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Nucleus, mitochondria and ribosomes never move.
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <label
                  htmlFor="cm-water"
                  className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Water outside
                </label>
                <span className="text-xs font-black text-stone-900 dark:text-white">
                  {water}% pure
                </span>
              </div>
              <input
                id="cm-water"
                type="range"
                min={0}
                max={100}
                step={1}
                value={water}
                onChange={(e) => changeWater(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Pure water pushes in hardest.
              </p>
            </div>

            {burst > 0 && (
              <button
                type="button"
                onClick={freshCell}
                className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors dark:bg-accent-700/25 dark:text-accent-100"
              >
                Get a fresh cell
              </button>
            )}

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                On screen now
              </p>
              <ul className="space-y-1">
                {PARTS.map((p) => {
                  const v = pres[p.id]
                  const label =
                    p.kind === 'shared' ? 'in both' : p.kind === 'plant' ? 'plant only' : 'animal only'
                  return (
                    <li
                      key={p.id}
                      className={`rounded-lg border-2 px-2.5 py-1 text-xs font-bold ${
                        v > 0.5
                          ? 'border-secondary-400 bg-secondary-50 text-stone-900 dark:border-secondary-600 dark:bg-secondary-700/25 dark:text-white'
                          : 'border-stone-200 bg-orange-50/40 text-stone-400 dark:border-stone-600 dark:bg-stone-700/30 dark:text-stone-500'
                      }`}
                    >
                      {p.name}: {label}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of {STEPS.length}
              </p>
              <ul className="space-y-1.5">
                {STEPS.map(([id, text]) => {
                  const ok = wins.includes(id)
                  return (
                    <li
                      key={id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 ${
                        ok
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {ok ? '✓ ' : ''}
                        {text}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {status} {wins.length} of {STEPS.length} steps done.
      </p>
    </>
  )
}
