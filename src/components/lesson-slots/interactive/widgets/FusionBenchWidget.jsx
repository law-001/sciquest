import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w16-l2 signature interactive: fertilisation drawn as an addition you can get
// wrong.
//
// Two cells are loaded onto the bench and driven together. The chromosome total
// on screen is literally the sum of what the student picked, so a body cell in
// one slot produces 69 and the result is drawn as the failure it is, rather
// than being blocked with a message.
//
// Matching count is necessary but not sufficient: two eggs also add to 46, and
// the bench says so, because a student who walks away with "46 means zygote"
// has learned the wrong rule.
//
// A real 23 + 23 keeps going on its own. The zygote cleaves, the cell count
// climbs, and the chromosome number stays at 46, which is the thing students
// most often expect to double.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The fluid runs past the viewBox on every side so a cropped edge never shows a
// seam. Nothing readable goes in that margin.
const BLEED = 60

// Readable content stays between x 60 and x 560 and y 40 and y 360, because
// `slice` crops up to about 60 units off whichever axis runs long.
const CX = 310
const CY = 178

const BG = '#E4EBEF'
const INK = '#44403c'
const INK_MID = '#6B6259'
const CYTO = '#FDE8D7'
const ZONA = '#EFC79B'
const SPERM = '#0E7490'
const EGG = '#EA580C'
const BODY = '#7C3AED'
const GOOD = '#0F766E'
const BAD = '#DC2626'

const GAMETES = [
  {
    id: 'sperm',
    name: 'Sperm',
    n: 23,
    ploidy: 'n',
    tint: SPERM,
    hint: 'Half a set, plus a tail.',
  },
  {
    id: 'egg',
    name: 'Egg cell',
    n: 23,
    ploidy: 'n',
    tint: EGG,
    hint: 'Half a set, plus all the food.',
  },
  {
    id: 'body',
    name: 'Body cell',
    n: 46,
    ploidy: '2n',
    tint: BODY,
    hint: 'A full set. Never a gamete.',
  },
]

const FUSE_TICKS = 18
const CLEAVE_EVERY = 26
const TRAVEL = 100

// Cleaving cells packed inside the fertilisation membrane. Hand-placed rather
// than computed, because eight circles that do not overlap is a packing problem
// and this is four lines.
const PACK = {
  1: [[0, 0, 62]],
  2: [
    [-42, 0, 41],
    [42, 0, 41],
  ],
  4: [
    [-30, -30, 29],
    [30, -30, 29],
    [-30, 30, 29],
    [30, 30, 29],
  ],
  8: [
    [-44, -44, 21],
    [0, -44, 21],
    [44, -44, 21],
    [-44, 0, 21],
    [0, 0, 21],
    [44, 0, 21],
    [-22, 44, 21],
    [22, 44, 21],
  ],
}

// Faint specks in the surrounding fluid, so the cells read as floating in
// something rather than sitting on a blank field.
const SPECKS = [
  [72, 74],
  [196, 48],
  [402, 58],
  [548, 96],
  [96, 268],
  [244, 338],
  [388, 330],
  [534, 272],
  [30, 178],
  [590, 190],
  [300, 26],
  [150, 350],
]

const find = (id) => GAMETES.find((g) => g.id === id)

// Chromosome bars inside a nucleus. One copy of each bar means haploid, two
// means diploid, three means a set too many, so "how many of each" is readable
// without the number. Anything past `surplusFrom` is drawn in red.
function Chroms({ copies, tint, scale = 1, surplusFrom = 99 }) {
  const pitch = 4.6 * copies + 6
  const bars = []
  for (let g = 0; g < 4; g += 1) {
    for (let c = 0; c < copies; c += 1) {
      bars.push({
        key: `${g}-${c}`,
        x: (g - 1.5) * pitch + (c - (copies - 1) / 2) * 4.6,
        fill: c >= surplusFrom ? BAD : tint,
      })
    }
  }
  return (
    <g transform={`scale(${scale})`}>
      {bars.map((b) => (
        <rect key={b.key} x={b.x - 1.7} y="-7" width="3.4" height="14" rx="1.7" fill={b.fill} />
      ))}
    </g>
  )
}

// Head with an acrosome cap, a midpiece, and a tail that beats. `facing` is 1
// for a cell swimming right and -1 for one swimming left.
function SpermCell({ facing, swim }) {
  return (
    <g transform={`scale(${facing} 1)`}>
      <path
        d={`M -26 0 q -20 ${swim} -38 0 t -38 ${-swim}`}
        fill="none"
        stroke={SPERM}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <rect x="-36" y="-5.5" width="16" height="11" rx="5.5" fill={SPERM} opacity="0.5" />
      <ellipse rx="24" ry="16" fill={CYTO} stroke={SPERM} strokeWidth="3.4" />
      <path d="M 6 -15.5 A 24 16 0 0 1 6 15.5 Z" fill={SPERM} opacity="0.22" />
      <g transform="translate(-4 0)">
        <ellipse rx="14" ry="10.5" fill="#FFFFFF" opacity="0.88" stroke={SPERM} strokeWidth="1.6" />
        <Chroms copies={1} tint={SPERM} scale={0.65} />
      </g>
    </g>
  )
}

// Jelly coat of follicle cells, then the zona, then cytoplasm packed with yolk,
// then the nucleus. Every layer is something the lesson names.
function EggCell() {
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={Math.cos(a) * 74}
            cy={Math.sin(a) * 74}
            r="7.5"
            fill={ZONA}
            opacity="0.5"
          />
        )
      })}
      <circle r="64" fill="none" stroke={ZONA} strokeWidth="9" />
      <circle r="55" fill={CYTO} stroke={EGG} strokeWidth="3.4" />
      {[
        [-34, -18],
        [32, -24],
        [-28, 26],
        [30, 24],
        [0, 38],
        [-40, 6],
        [40, 8],
      ].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="6" fill={EGG} opacity="0.18" />
      ))}
      <circle cy="-2" r="21" fill="#FFFFFF" opacity="0.88" stroke={EGG} strokeWidth="2" />
      <g transform="translate(0 -2)">
        <Chroms copies={1} tint={EGG} scale={0.85} />
      </g>
    </g>
  )
}

function BodyCell() {
  return (
    <g>
      <circle r="48" fill={CYTO} stroke={BODY} strokeWidth="4" />
      {[
        [-30, -20],
        [28, -26],
        [-26, 28],
        [30, 22],
      ].map(([x, y], i) => (
        <ellipse
          key={`${x},${y}`}
          cx={x}
          cy={y}
          rx="10"
          ry="5"
          transform={`rotate(${i * 40 - 60} ${x} ${y})`}
          fill={BODY}
          opacity="0.2"
        />
      ))}
      <circle r="25" fill="#FFFFFF" opacity="0.88" stroke={BODY} strokeWidth="2" />
      <Chroms copies={2} tint={BODY} scale={0.8} />
    </g>
  )
}

function LoadedCell({ id, facing, swim }) {
  if (id === 'sperm') return <SpermCell facing={facing} swim={swim} />
  if (id === 'egg') return <EggCell />
  return <BodyCell />
}

export default function FusionBenchWidget({ onSolved }) {
  const [left, setLeft] = useState('sperm')
  const [right, setRight] = useState('egg')
  const [phase, setPhase] = useState('ready') // ready | fusing | done
  const [progress, setProgress] = useState(0)
  const [age, setAge] = useState(0)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const progRef = useRef(0)
  const ageRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [still])

  const L = find(left)
  const R = find(right)
  const total = L.n + R.n
  const countOk = total === 46
  // 46 is necessary, not sufficient: two eggs also add to 46. A zygote needs one
  // of each gamete, and the bench has to say so or it teaches the wrong rule.
  const pairOk = (left === 'sperm' && right === 'egg') || (left === 'egg' && right === 'sperm')
  const viable = countOk && pairOk

  // The run: the two cells close on each other, then a viable zygote starts
  // cleaving on its own and keeps going.
  useEffect(() => {
    if (still) return undefined
    if (phase !== 'fusing' && phase !== 'done') return undefined
    const id = setInterval(() => {
      if (progRef.current < 1) {
        progRef.current = Math.min(1, progRef.current + 1 / FUSE_TICKS)
        setProgress(progRef.current)
        if (progRef.current >= 1) setPhase('done')
        return
      }
      if (!viable) return
      ageRef.current += 1
      setAge(ageRef.current)
    }, 70)
    return () => clearInterval(id)
  }, [phase, viable, still])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 2) onSolved?.()
  }

  function fuse() {
    // Reduced motion skips both tweens and lands on the finished embryo.
    progRef.current = still ? 1 : 0
    ageRef.current = still ? CLEAVE_EVERY * 3 : 0
    setProgress(progRef.current)
    setAge(ageRef.current)
    setPhase(still ? 'done' : 'fusing')
    win(viable ? 'correct' : 'error')
  }

  function reset() {
    progRef.current = 0
    ageRef.current = 0
    setProgress(0)
    setAge(0)
    setPhase('ready')
  }

  const p = progress
  const fused = phase === 'done' && p >= 1
  const cells = viable && fused ? 2 ** Math.min(3, Math.floor(age / CLEAVE_EVERY)) : 1
  const swim = still ? 0 : Math.sin(tick * 0.5) * 6
  const lx = CX - 162 + p * TRAVEL
  const rx = CX + 162 - p * TRAVEL
  const copies = Math.round(total / 23)

  const failHead = countOk ? '46, but two of the same' : `${total} chromosomes`
  const failCaption = countOk ? 'needs one of each' : 'a whole extra set'
  const failLine = countOk
    ? 'A zygote needs one sperm and one egg.'
    : 'A whole extra set. No dividing fixes it.'

  const headline =
    phase === 'ready'
      ? `${L.n} + ${R.n} = ${total}`
      : !fused
        ? 'Closing in'
        : viable
          ? 'Zygote, 2n = 46'
          : failHead

  const subline =
    phase === 'ready'
      ? `${L.name} plus ${R.name}.`
      : !fused
        ? 'The two cells are meeting.'
        : viable
          ? `${cells} cell${cells > 1 ? 's' : ''} now, still 46 in each.`
          : failLine

  const caption = fused
    ? viable
      ? `${cells} cell${cells > 1 ? 's' : ''}, 46 each`
      : failCaption
    : phase === 'ready'
      ? 'bench ready'
      : 'closing in'

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${headline}. ${subline}`}
              style={stageFill(W, H)}
            >
              {/* Fluid, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BG} />
              {SPECKS.map(([x, y]) => (
                <circle key={`${x},${y}`} cx={x} cy={y} r="3.5" fill="#FFFFFF" opacity="0.55" />
              ))}

              <text
                x={CX}
                y="42"
                fontSize="16"
                fontWeight="900"
                fill={fused && !viable ? BAD : INK}
                textAnchor="middle"
              >
                {headline}
              </text>

              {!fused ? (
                <g>
                  <g transform={`translate(${lx} ${CY})`}>
                    <LoadedCell id={left} facing={1} swim={swim} />
                  </g>
                  <g transform={`translate(${rx} ${CY})`}>
                    <LoadedCell id={right} facing={-1} swim={swim} />
                  </g>

                  <text
                    x={lx}
                    y={CY + 100}
                    fontSize="12"
                    fontWeight="900"
                    fill={L.tint}
                    textAnchor="middle"
                  >
                    {L.name}
                  </text>
                  <text
                    x={lx}
                    y={CY + 116}
                    fontSize="12"
                    fontWeight="900"
                    fill={INK_MID}
                    textAnchor="middle"
                  >
                    {L.ploidy} = {L.n}
                  </text>
                  <text
                    x={rx}
                    y={CY + 100}
                    fontSize="12"
                    fontWeight="900"
                    fill={R.tint}
                    textAnchor="middle"
                  >
                    {R.name}
                  </text>
                  <text
                    x={rx}
                    y={CY + 116}
                    fontSize="12"
                    fontWeight="900"
                    fill={INK_MID}
                    textAnchor="middle"
                  >
                    {R.ploidy} = {R.n}
                  </text>
                </g>
              ) : viable ? (
                <g>
                  <circle cx={CX} cy={CY} r="92" fill="none" stroke={ZONA} strokeWidth="8" />
                  {PACK[cells].map(([dx, dy, r]) => (
                    <g key={`${dx},${dy}`} transform={`translate(${CX + dx} ${CY + dy})`}>
                      <circle r={r} fill={CYTO} stroke={GOOD} strokeWidth={r > 30 ? 3.6 : 2.6} />
                      <circle
                        r={r * 0.48}
                        fill="#FFFFFF"
                        opacity="0.88"
                        stroke={GOOD}
                        strokeWidth="1.6"
                      />
                      <Chroms copies={2} tint={BODY} scale={r * 0.0145} />
                    </g>
                  ))}
                  <text
                    x={CX}
                    y={CY - 100}
                    fontSize="11"
                    fontWeight="900"
                    fill={INK_MID}
                    textAnchor="middle"
                  >
                    fertilisation membrane
                  </text>
                </g>
              ) : (
                <g>
                  <circle
                    cx={CX}
                    cy={CY}
                    r="70"
                    fill={CYTO}
                    stroke={BAD}
                    strokeWidth="4.5"
                    strokeDasharray="10 8"
                  />
                  <circle
                    cx={CX}
                    cy={CY}
                    r="40"
                    fill="#FFFFFF"
                    opacity="0.88"
                    stroke={BAD}
                    strokeWidth="2"
                  />
                  <g transform={`translate(${CX} ${CY})`}>
                    <Chroms
                      copies={copies}
                      tint={INK}
                      scale={copies >= 4 ? 0.78 : 0.95}
                      surplusFrom={2}
                    />
                  </g>
                  <path
                    d={`M ${CX + 74} ${CY - 36} L ${CX + 104} ${CY - 62}`}
                    stroke={BAD}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <text x={CX + 108} y={CY - 64} fontSize="11" fontWeight="900" fill={BAD}>
                    {failCaption}
                  </text>
                </g>
              )}

              <text
                x={CX}
                y="296"
                fontSize="12"
                fontWeight="900"
                fill={fused ? (viable ? GOOD : BAD) : INK_MID}
                textAnchor="middle"
              >
                {caption}
              </text>

              {/* Bench readout: what went in, and what came out. */}
              <g>
                <rect
                  x="62"
                  y="312"
                  width="496"
                  height="46"
                  rx="12"
                  fill="#FFFFFF"
                  opacity="0.9"
                  stroke="#B9C7CC"
                  strokeWidth="2.5"
                />
                {[
                  ['Left slot', L.name, `${L.ploidy} = ${L.n}`, L.tint],
                  ['Right slot', R.name, `${R.ploidy} = ${R.n}`, R.tint],
                  [
                    'Result',
                    fused ? (viable ? 'Zygote' : 'Failed') : 'Not yet',
                    fused ? `2n = ${total}` : `${total} if fused`,
                    fused ? (viable ? GOOD : BAD) : '#A8A29E',
                  ],
                ].map(([label, name, count, tint], i) => (
                  <g key={label}>
                    <text
                      x={62 + (i + 0.5) * (496 / 3)}
                      y="332"
                      fontSize="10.5"
                      fontWeight="800"
                      fill={INK_MID}
                      textAnchor="middle"
                    >
                      {label}: {name}
                    </text>
                    <text
                      x={62 + (i + 0.5) * (496 / 3)}
                      y="349"
                      fontSize="13"
                      fontWeight="900"
                      fill={tint}
                      textAnchor="middle"
                    >
                      {count}
                    </text>
                    {i > 0 && (
                      <line
                        x1={62 + i * (496 / 3)}
                        y1="320"
                        x2={62 + i * (496 / 3)}
                        y2="350"
                        stroke="#E7E5E4"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                ))}
              </g>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                fused && !viable
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{headline}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {subline}
              </p>
            </div>

            {[
              ['Left slot', left, setLeft],
              ['Right slot', right, setRight],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {GAMETES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setter(g.id)
                        reset()
                      }}
                      className={`min-h-11 rounded-xl border-2 px-1 py-2 text-xs font-black transition-colors ${
                        value === g.id
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium text-stone-600 dark:text-stone-300">
                  {find(value).hint}
                </p>
              </div>
            ))}

            <button
              type="button"
              onClick={phase === 'ready' ? fuse : reset}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              {phase === 'ready' ? 'Drive them together' : 'Clear the bench'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['correct', 'Real zygote made, 46 chromosomes'],
                  ['error', 'A fusion that failed'],
                ].map(([id, text]) => {
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
                        {ok ? '✓ Done: ' : 'Not yet: '}
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
        {headline}. {subline}
      </p>
    </>
  )
}
