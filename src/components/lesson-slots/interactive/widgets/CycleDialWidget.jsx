import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w14-l2 signature interactive: the cell cycle as a dial you turn.
//
// Position on the dial is the only input. Everything else is drawn from it.
// The cell sitting inside the ring grows through G1, copies its chromatin a
// little at a time through S, condenses and lines its chromosomes up in M,
// then pinches into two. The chromosome close-up and the DNA graph are the
// same number shown two other ways, which is why the graph steps up exactly
// across S and nowhere else.
//
// Damaged DNA does not pop up a warning. The dial simply will not turn past
// the G2 checkpoint: the handle stops there and the gate across the ring is
// drawn closed.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The background runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in that margin.
const BLEED = 60

// Everything a student has to read lives between x 60 and x 560. The stage
// column is wide but rarely as wide as 16:10, so `slice` crops up to about 60
// units off each side; only the background may sit outside that band.
const CX = 202
const CY = 196
const R_OUT = 130
const R_IN = 92
const BAND = (R_OUT + R_IN) / 2

// The instrument card on the right of the readable band.
const CARD_X = 352
const CARD_Y = 40
const CARD_W = 204
const CARD_H = 310
const CARD_MID = CARD_X + CARD_W / 2

const G2_CHECKPOINT = 82
const CYCLE_STEPS = 100

const BG = '#E4EBEF'
const INK = '#44403c'
const INK_MID = '#6B6259'
const DNA = '#7C3AED'
const DNA_DARK = '#4C1D95'
const MEMBRANE = '#B45309'
const RED = '#B91C1C'

const PHASES = [
  {
    id: 'g1',
    from: 0,
    to: 40,
    letter: 'G₁',
    name: 'G₁: growth',
    note: 'The cell grows and builds parts. The DNA is not copied yet.',
    tint: '#F59E0B',
  },
  {
    id: 's',
    from: 40,
    to: 62,
    letter: 'S',
    name: 'S: DNA copying',
    note: 'Every chromosome is copied. This is the only place the DNA doubles.',
    tint: '#3BAFA9',
  },
  {
    id: 'g2',
    from: 62,
    to: 82,
    letter: 'G₂',
    name: 'G₂: final checks',
    note: 'More growth, and the new copies are proof-read before division.',
    tint: '#7C3AED',
  },
  {
    id: 'm',
    from: 82,
    to: 100,
    letter: 'M',
    name: 'M: mitosis',
    note: 'The copies are pulled apart and the cell splits in two.',
    tint: '#DC2626',
  },
]

const phaseAt = (p) => PHASES.find((ph) => p < ph.to) ?? PHASES[PHASES.length - 1]

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// 0 at the top, running clockwise, so the dial reads like a clock.
const angleOf = (p) => (p / CYCLE_STEPS) * Math.PI * 2 - Math.PI / 2

function arc(from, to, radius) {
  const a0 = angleOf(from)
  const a1 = angleOf(to)
  const large = to - from > CYCLE_STEPS / 2 ? 1 : 0
  return `M ${CX + Math.cos(a0) * radius} ${CY + Math.sin(a0) * radius} A ${radius} ${radius} 0 ${large} 1 ${CX + Math.cos(a1) * radius} ${CY + Math.sin(a1) * radius}`
}

// One chromosome's worth of DNA before S, two after, and a fraction of the way
// through in between, which is what the growing second chromatid shows.
const copiedFraction = (p) => clamp01((p - 40) / 22)
const dnaAmount = (p) => (p >= 82 ? 2 : 1 + copiedFraction(p))

// The cell grows right through interphase and holds its size through mitosis.
const cellRadiusAt = (p) => 34 + (22 * Math.min(p, 82)) / 82

// Half the width of the bridge still joining the two lobes at full furrow.
const NECK_HALF = 7

// The graph, in its own coordinate space.
const GRAPH_X = 374
const GRAPH_Y = 226
const GRAPH_W = 164
const GRAPH_H = 80
const graphY = (amount) => GRAPH_H - (amount - 0.5) * 56

function dnaPath(upTo) {
  return Array.from({ length: upTo + 1 }, (_, i) => {
    const x = (i / CYCLE_STEPS) * GRAPH_W
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${graphY(dnaAmount(i)).toFixed(1)}`
  }).join(' ')
}

const DNA_FULL = dnaPath(CYCLE_STEPS)

// Faint grain so the cytoplasm is not a flat fill.
const GRAIN = Array.from({ length: 22 }, (_, i) => [
  ((i * 37) % 100) / 100 - 0.5,
  ((i * 61) % 100) / 100 - 0.5,
])

function Mitochondrion({ x, y, angle }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <ellipse rx="9" ry="4.5" fill="#FCA5A5" stroke={RED} strokeWidth="1.5" />
      <path d="M -5 -1.4 q 2.5 4 5 0 q 2.5 -4 5 0" fill="none" stroke={RED} strokeWidth="1.1" />
    </g>
  )
}

// One chromosome inside the cell. `copied` grows its second chromatid through
// S, `cond` shortens and thickens it for mitosis, `sep` pulls the two
// chromatids apart toward the poles.
function Chromosome({ x, y, copied, cond, sep, pole, flagged }) {
  const half = lerp(11, 8, cond)
  const width = lerp(6, 9, cond)
  const gap = lerp(9, 11, cond)
  const pull = sep * pole

  const bar = (bx, by, len, opacity) => (
    <path
      d={`M ${bx} ${by - len} L ${bx} ${by + len}`}
      stroke={DNA}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
    />
  )

  return (
    <g>
      {bar(x, y - pull, half, 1)}
      {copied > 0.02 && bar(x + gap, y + (sep > 0 ? pull : 0), half * (sep > 0 ? 1 : copied), 0.45 + copied * 0.55)}
      {copied > 0.02 && sep < 1 && (
        <line
          x1={x}
          y1={y - pull}
          x2={x + gap}
          y2={y + pull}
          stroke={DNA_DARK}
          strokeWidth={4.5 * copied * (1 - sep)}
        />
      )}
      {flagged && (
        <text x={x + gap / 2} y={y - half - 6} fontSize="13" fontWeight="900" fill={RED} textAnchor="middle">
          ✳
        </text>
      )}
    </g>
  )
}

export default function CycleDialWidget({ onSolved }) {
  const [pos, setPos] = useState(6)
  const [damaged, setDamaged] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])
  const winRef = useRef([])

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [still])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 2) onSolved?.()
  }

  function changePos(value) {
    if (damaged && value > G2_CHECKPOINT) {
      setPos(G2_CHECKPOINT)
      setBlocked(true)
      win('checkpoint')
      return
    }
    setBlocked(false)
    setPos(value)
    if (value >= CYCLE_STEPS - 1) win('full')
  }

  function repair() {
    setDamaged(false)
    setBlocked(false)
  }

  const phase = phaseAt(pos)
  const copied = copiedFraction(pos)
  const dna = dnaAmount(pos)
  const handA = angleOf(pos)
  const jiggle = still ? 0 : Math.sin(tick * 0.3) * 1.2

  const cellR = cellRadiusAt(pos)
  const cond = clamp01((pos - 82) / 4)
  const sep = clamp01((pos - 88) / 6)
  const furrow = clamp01((pos - 92) / 7)
  const split = pos >= 99
  const envelope = pos < 82 ? 1 : pos < 86 ? 1 - (pos - 82) / 4 : pos > 95 ? (pos - 95) / 5 : 0

  // The furrow is two bites taken out of the cell from the left and the right,
  // so the membrane stays one continuous line around a narrowing waist. The
  // bite centres must stay further out than their own radius, otherwise the
  // two bites meet in the middle and cut a channel straight through the cell
  // instead of pinching a neck: at full furrow the neck is 2 * NECK_HALF wide.
  const biteR = cellR * 0.62
  const biteD = lerp(cellR + biteR, biteR + NECK_HALF, furrow)

  const home = [
    [-15, -12],
    [14, -8],
    [-3, 15],
  ]
  const chromos = [0, 1, 2].map((i) => ({
    x: CX + lerp(home[i][0], (i - 1) * 20, cond),
    y: CY + lerp(home[i][1], 0, cond) + jiggle * (i % 2 ? 1 : -1),
  }))

  const status = blocked
    ? 'Held at the G₂ checkpoint. Damaged DNA is not allowed into mitosis.'
    : `${phase.name}. DNA amount ${dna.toFixed(2)}×.`

  const hint = blocked
    ? 'Repair the damage and the dial turns again.'
    : damaged
      ? 'Now drag the dial past G₂ and see what happens.'
      : phase.note

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${status} Position ${pos} of ${CYCLE_STEPS} around the cell cycle.`}
              style={stageFill(W, H)}
            >
              <defs>
                <clipPath id="cd-cell-clip">
                  <circle cx={CX} cy={CY} r={cellR} />
                </clipPath>
                <mask id="cd-furrow">
                  <rect x={CX - cellR - 8} y={CY - cellR - 8} width={cellR * 2 + 16} height={cellR * 2 + 16} fill="#FFFFFF" />
                  {furrow > 0 && !split && (
                    <>
                      <circle cx={CX - biteD} cy={CY} r={biteR} fill="#000000" />
                      <circle cx={CX + biteD} cy={CY} r={biteR} fill="#000000" />
                    </>
                  )}
                </mask>
              </defs>

              {/* Background, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BG} />

              <text x={CX} y="46" fontSize="12.5" fontWeight="900" fill={INK} textAnchor="middle">
                one cell cycle
              </text>

              {/* ── The dial ── */}
              <circle cx={CX} cy={CY} r={BAND} fill="none" stroke="#D6CEC1" strokeWidth={R_OUT - R_IN} />
              {PHASES.map((ph) => (
                <path
                  key={ph.id}
                  d={arc(ph.from, ph.to, BAND)}
                  fill="none"
                  stroke={ph.tint}
                  strokeWidth={R_OUT - R_IN}
                  opacity={ph.id === phase.id ? 1 : 0.4}
                />
              ))}
              {/* Hour ticks, so the ring reads as a dial and not a pie chart. */}
              {Array.from({ length: 20 }, (_, i) => {
                const a = angleOf(i * 5)
                return (
                  <line
                    key={`tick-${i}`}
                    x1={CX + Math.cos(a) * (R_OUT - 5)}
                    y1={CY + Math.sin(a) * (R_OUT - 5)}
                    x2={CX + Math.cos(a) * R_OUT}
                    y2={CY + Math.sin(a) * R_OUT}
                    stroke="#FFFFFF"
                    strokeWidth="1.6"
                    opacity="0.7"
                  />
                )
              })}
              {PHASES.map((ph) => {
                const a = angleOf((ph.from + ph.to) / 2)
                return (
                  <text
                    key={ph.id}
                    x={CX + Math.cos(a) * (R_IN + 12)}
                    y={CY + Math.sin(a) * (R_IN + 12) + 5}
                    fontSize="14"
                    fontWeight="900"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    {ph.letter}
                  </text>
                )
              })}

              {/* The gate the handle runs into. */}
              <g transform={`rotate(${(G2_CHECKPOINT / CYCLE_STEPS) * 360} ${CX} ${CY})`}>
                <line
                  x1={CX}
                  y1={CY - R_OUT - 7}
                  x2={CX}
                  y2={CY - R_IN + 4}
                  stroke={damaged ? '#DC2626' : '#57534e'}
                  strokeWidth={damaged ? 7 : 3.5}
                  strokeLinecap="round"
                />
              </g>
              <text
                x={CX}
                y={CY + R_OUT + 20}
                fontSize="12.5"
                fontWeight="900"
                fill={damaged ? RED : INK_MID}
                textAnchor="middle"
              >
                {damaged ? 'G₂ checkpoint closed' : 'G₂ checkpoint open'}
              </text>

              {/* Handle, riding on the ring so it never crosses the cell. */}
              <circle
                cx={CX + Math.cos(handA) * (R_OUT - 10)}
                cy={CY + Math.sin(handA) * (R_OUT - 10)}
                r="9.5"
                fill="#f97316"
                stroke="#1c1917"
                strokeWidth="2.5"
              />

              {/* ── The cell inside the dial ── */}
              {split ? (
                [-1, 1].map((dir) => (
                  <g key={dir}>
                    <circle cx={CX} cy={CY + dir * 44} r={cellR * 0.72} fill="#FDE8D7" stroke={MEMBRANE} strokeWidth="4" />
                    <circle cx={CX} cy={CY + dir * 44} r={cellR * 0.36} fill="#C4B5FD" stroke={DNA_DARK} strokeWidth="2" />
                    {[0, 1, 2].map((i) => (
                      <path
                        key={i}
                        d={`M ${CX - 10 + i * 10} ${CY + dir * 44 - 6} L ${CX - 10 + i * 10} ${CY + dir * 44 + 6}`}
                        stroke={DNA}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    ))}
                  </g>
                ))
              ) : (
                <>
                  <g mask="url(#cd-furrow)">
                    <circle cx={CX} cy={CY} r={cellR} fill="#FDE8D7" stroke={MEMBRANE} strokeWidth="4" />
                    {GRAIN.map(([gx, gy], i) => (
                      <circle
                        key={`g-${i}`}
                        cx={CX + gx * cellR * 1.5}
                        cy={CY + gy * cellR * 1.5}
                        r="1.6"
                        fill={MEMBRANE}
                        opacity="0.18"
                      />
                    ))}
                    <Mitochondrion x={CX - cellR * 0.55} y={CY - cellR * 0.5} angle={-28} />
                    <Mitochondrion x={CX + cellR * 0.52} y={CY + cellR * 0.52} angle={34} />

                    {envelope > 0 && (
                      <circle
                        cx={CX}
                        cy={CY}
                        r={cellR * 0.62}
                        fill="#C4B5FD"
                        stroke={DNA_DARK}
                        strokeWidth="2.2"
                        opacity={envelope * 0.9}
                      />
                    )}

                    {chromos.map((c, i) => (
                      <Chromosome
                        key={i}
                        x={c.x}
                        y={c.y}
                        copied={copied}
                        cond={cond}
                        sep={sep}
                        pole={cellR * 0.46}
                        flagged={damaged && i === 1}
                      />
                    ))}
                  </g>

                  {furrow > 0 && (
                    <g clipPath="url(#cd-cell-clip)">
                      <circle cx={CX - biteD} cy={CY} r={biteR} fill="none" stroke={MEMBRANE} strokeWidth="4" />
                      <circle cx={CX + biteD} cy={CY} r={biteR} fill="none" stroke={MEMBRANE} strokeWidth="4" />
                    </g>
                  )}
                </>
              )}

              {/* ── Instrument card ── */}
              <rect x={CARD_X} y={CARD_Y} width={CARD_W} height={CARD_H} rx="16" fill="#FFFFFF" opacity="0.86" stroke="#B9C7CC" strokeWidth="2" />

              <text x={CARD_MID} y="66" fontSize="12.5" fontWeight="900" fill={INK} textAnchor="middle">
                chromosome close-up
              </text>
              {[0, 1, 2].map((i) => {
                const x = 396 + i * 50
                const y = 122 + jiggle * (i % 2 ? 1 : -1)
                const sister = copied > 0.02
                return (
                  <g key={i}>
                    <path d={`M ${x} ${y - 32} L ${x} ${y + 32}`} stroke={DNA} strokeWidth="12" strokeLinecap="round" />
                    <line x1={x - 6} y1={y - 16} x2={x + 6} y2={y - 16} stroke={DNA_DARK} strokeWidth="2" opacity="0.5" />
                    <line x1={x - 6} y1={y + 14} x2={x + 6} y2={y + 14} stroke={DNA_DARK} strokeWidth="2" opacity="0.5" />
                    {sister && (
                      <>
                        <path
                          d={`M ${x + 16} ${y - 32 * copied} L ${x + 16} ${y + 32 * copied}`}
                          stroke={DNA}
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity={0.45 + copied * 0.55}
                        />
                        <line x1={x} y1={y} x2={x + 16} y2={y} stroke={DNA_DARK} strokeWidth={5 * copied} />
                        <circle cx={x + 8} cy={y} r={3.2 * copied} fill={DNA_DARK} />
                      </>
                    )}
                    {damaged && i === 1 && (
                      <text x={x + 8} y={y - 40} fontSize="15" fontWeight="900" fill={RED} textAnchor="middle">
                        ✳
                      </text>
                    )}
                  </g>
                )
              })}
              <text x={CARD_MID} y="180" fontSize="12" fontWeight="800" fill={DNA_DARK} textAnchor="middle">
                {copied >= 1 ? 'two chromatids each' : copied > 0 ? `copying ${Math.round(copied * 100)}%` : 'single chromatids'}
              </text>
              {damaged && (
                <text x={CARD_MID} y="200" fontSize="12" fontWeight="900" fill={RED} textAnchor="middle">
                  damage on chromosome 2
                </text>
              )}

              {/* ── DNA amount graph ── */}
              <g transform={`translate(${GRAPH_X} ${GRAPH_Y})`}>
                {PHASES.map((ph) => (
                  <rect
                    key={ph.id}
                    x={(ph.from / CYCLE_STEPS) * GRAPH_W}
                    y="0"
                    width={((ph.to - ph.from) / CYCLE_STEPS) * GRAPH_W}
                    height={GRAPH_H}
                    fill={ph.tint}
                    opacity="0.12"
                  />
                ))}
                <line x1="0" y1={GRAPH_H} x2={GRAPH_W} y2={GRAPH_H} stroke={INK_MID} strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2={GRAPH_H} stroke={INK_MID} strokeWidth="2" />
                <text x="-6" y="10" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="end">
                  2×
                </text>
                <text x="-6" y={graphY(1) + 4} fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="end">
                  1×
                </text>
                <path d={DNA_FULL} fill="none" stroke="#0f766e" strokeWidth="3" opacity="0.3" />
                <path d={dnaPath(pos)} fill="none" stroke="#0f766e" strokeWidth="3.5" />
                <circle cx={(pos / CYCLE_STEPS) * GRAPH_W} cy={graphY(dna)} r="5" fill="#f97316" stroke="#1c1917" strokeWidth="1.5" />
                <text x={GRAPH_W / 2} y={GRAPH_H + 20} fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
                  DNA per cell
                </text>
              </g>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                blocked
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{hint}</p>
            </div>

            <div>
              <label
                htmlFor="cd-pos"
                className="mb-1 flex items-baseline justify-between gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                <span>Dial position</span>
                <span className="text-sm text-stone-900 dark:text-white">
                  {pos} of {CYCLE_STEPS}
                </span>
              </label>
              <input
                id="cd-pos"
                type="range"
                min={0}
                max={CYCLE_STEPS}
                step={1}
                value={pos}
                onChange={(e) => changePos(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={() => (damaged ? repair() : setDamaged(true))}
              className={`min-h-11 w-full rounded-xl px-4 py-3 text-sm font-black transition-colors ${
                damaged
                  ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {damaged ? 'Repair the DNA' : 'Damage the DNA'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['full', 'Whole cycle turned, G₁ to the end of M'],
                  ['checkpoint', 'Checkpoint triggered with damaged DNA'],
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
        {status}
      </p>
    </>
  )
}
