import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w19-l1 signature interactive: the pyramid builds itself out of the losses.
//
// A thousand units of energy enter the grass. Each time the student sends
// energy up a level, ninety per cent peels off sideways as heat and a tenth
// climbs. Tier widths are the cube root of the surviving fraction, so the
// pyramid shape is a consequence of the arithmetic rather than a picture drawn
// to look like one.
//
// Beside it one carbon atom takes the other road: dead snake, decomposer, soil,
// new grass, and round again. Nothing leaves that circle, which is the whole
// contrast the lesson is built on.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Sky and ground run past the viewBox so a cropped edge never shows a seam.
// Nothing readable sits in that margin.
const BLEED = 60

const SKY = '#E7EEF4'
const GROUND = '#DCE4CE'
const GROUND_DARK = '#BFCBA8'
const PAPER = '#FDF7EC'
const CARD_EDGE = '#DED7C7'
const INK = '#44403C'
const INK_MID = '#6B6259'
const HEAT = '#F59E0B'
const HEAT_DEEP = '#B45309'
const TEAL = '#0F766E'
const ATOM = '#FACC15'
const DEAD = '#A8A29E'

const START_UNITS = 1000
const TIERS = [
  { name: 'Producers', who: 'grass', kind: 'grass', tint: '#4D8A3F' },
  { name: 'Primary consumers', who: 'grasshoppers', kind: 'hopper', tint: '#7FA93C' },
  { name: 'Secondary consumers', who: 'frogs', kind: 'frog', tint: '#2E8B76' },
  { name: 'Tertiary consumers', who: 'snakes', kind: 'snake', tint: '#B4783A' },
]

const unitsAt = (i) => START_UNITS / 10 ** i

// Cube root shrinks hard but keeps the top tier wide enough to hold its own
// label; a linear width would make the 1-unit tier a single pixel.
const widthAt = (i) => 30 + 210 * Math.cbrt(unitsAt(i) / START_UNITS)

// `slice` can crop about 60 units off whichever axis is long, so every label
// sits between x 60 and x 560 and between y 40 and y 352.
const CX = 185
const BAR_H = 38
const TIER_Y = [292, 230, 168, 106]
const GROUND_Y = 330
// Midpoints of the three gaps between bars, where the 10% chips sit.
const GAP_Y = [280, 218, 156]

const STEPS = [
  { id: 'dead', label: 'dead snake', kind: 'dead', tint: '#B4783A' },
  { id: 'decomposer', label: 'decomposer', kind: 'fungus', tint: '#7C5CBF' },
  { id: 'soil', label: 'soil minerals', kind: 'soil', tint: '#8A6A4A' },
  { id: 'grass', label: 'new grass', kind: 'grass', tint: '#4D8A3F' },
]

const LOOP_CX = 460
const LOOP_CY = 200
const LOOP_R = 66
const ATOM_TICKS = 44

// t = 0 sits top left and runs clockwise, so the four labels land in four
// corners and never crowd each other.
const loopPoint = (t) => {
  const a = ((225 + t * 360) * Math.PI) / 180
  return [LOOP_CX + Math.cos(a) * LOOP_R, LOOP_CY + Math.sin(a) * LOOP_R]
}

// Organism glyphs. Each one is drawn with its feet on y = 0, so it can be
// dropped on a pyramid bar or inside a loop node with one translate.

function GrassTuft({ tint }) {
  return (
    <g fill="none" stroke={tint} strokeWidth="2.6" strokeLinecap="round">
      <path d="M 0 0 C -2 -8 -6 -13 -12 -18" />
      <path d="M 0 0 C -1 -9 -3 -15 -5 -21" />
      <path d="M 0 0 C 1 -9 2 -15 4 -20" />
      <path d="M 0 0 C 3 -8 7 -12 12 -17" />
      <path d="M 0 0 C 0 -6 0 -10 -1 -14" strokeWidth="2" opacity="0.7" />
    </g>
  )
}

function Grasshopper({ tint }) {
  return (
    <g>
      <path
        d="M -4 -8 l -4 8 M 2 -8 l -1 8"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 3 -9 l 9 -7 l -3 16"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="3" cy="-11" rx="11" ry="5.5" fill={tint} stroke={INK} strokeWidth="1.8" />
      <path d="M -3 -14 q 10 0 14 4 q -8 2 -14 -1 Z" fill={PAPER} opacity="0.45" />
      <ellipse cx="-8" cy="-12" rx="5.5" ry="5.5" fill={tint} stroke={INK} strokeWidth="1.8" />
      <circle cx="-15" cy="-13" r="4.5" fill={tint} stroke={INK} strokeWidth="1.8" />
      <circle cx="-16.5" cy="-14" r="1.4" fill={INK} />
      <path
        d="M -18 -16 q -5 -4 -9 -4"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  )
}

function Frog({ tint }) {
  return (
    <g>
      <path
        d="M -12 -5 q -8 1 -11 6 M 12 -5 q 8 1 11 6"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse cx="0" cy="-8" rx="13" ry="8" fill={tint} stroke={INK} strokeWidth="1.8" />
      <path
        d="M -6 -7 q 6 4 12 0"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="-5.5" cy="-15" r="4.2" fill={tint} stroke={INK} strokeWidth="1.8" />
      <circle cx="5.5" cy="-15" r="4.2" fill={tint} stroke={INK} strokeWidth="1.8" />
      <circle cx="-5.5" cy="-15.5" r="1.7" fill={INK} />
      <circle cx="5.5" cy="-15.5" r="1.7" fill={INK} />
    </g>
  )
}

function Snake({ tint, dead = false }) {
  const body = 'M -16 -5 q 8 -10 16 -5 q 8 5 14 -5'
  return (
    <g>
      <path d={body} fill="none" stroke={INK} strokeWidth="9.5" strokeLinecap="round" />
      <path d={body} fill="none" stroke={tint} strokeWidth="6" strokeLinecap="round" />
      <circle cx="15" cy="-12" r="4.6" fill={tint} stroke={INK} strokeWidth="1.8" />
      {dead ? (
        <path
          d="M 13.5 -13.5 l 3 3 M 16.5 -13.5 l -3 3"
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <circle cx="16" cy="-13" r="1.3" fill={INK} />
      )}
      <path
        d="M 19 -11 l 6 1 m -6 -1 l 6 3"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </g>
  )
}

function Fungus({ tint }) {
  return (
    <g>
      <rect
        x="-9"
        y="-8"
        width="4.5"
        height="8"
        rx="2"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.5"
      />
      <path d="M -14 -8 a 7 6 0 0 1 14 0 Z" fill={tint} stroke={INK} strokeWidth="1.7" />
      <rect x="4" y="-11" width="5" height="11" rx="2.2" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <path d="M -1 -11 a 8.5 7 0 0 1 17 0 Z" fill={tint} stroke={INK} strokeWidth="1.8" />
      <circle cx="4.5" cy="-14" r="1.5" fill={PAPER} opacity="0.75" />
      <circle cx="11" cy="-13" r="1.2" fill={PAPER} opacity="0.75" />
    </g>
  )
}

function Soil({ tint }) {
  return (
    <g>
      <path
        d="M -15 0 q 1 -9 8 -9 q 3 -7 10 -4 q 9 -1 9 13 Z"
        fill={tint}
        stroke={INK}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="-6" cy="-4" r="1.7" fill={PAPER} opacity="0.65" />
      <circle cx="2" cy="-7" r="1.4" fill={PAPER} opacity="0.65" />
      <circle cx="8" cy="-3" r="1.6" fill={PAPER} opacity="0.65" />
    </g>
  )
}

function Organism({ kind, tint }) {
  if (kind === 'grass') return <GrassTuft tint={tint} />
  if (kind === 'hopper') return <Grasshopper tint={tint} />
  if (kind === 'frog') return <Frog tint={tint} />
  if (kind === 'snake') return <Snake tint={tint} />
  if (kind === 'dead') return <Snake tint={DEAD} dead />
  if (kind === 'fungus') return <Fungus tint={tint} />
  return <Soil tint={tint} />
}

// Short label on a paper chip, so a name can cross the dashed ring and stay
// readable.
function Chip({ x, y, text, width, fill = INK_MID, size = 10.5 }) {
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 11}
        width={width}
        height="17"
        rx="8.5"
        fill={PAPER}
        stroke={CARD_EDGE}
        strokeWidth="1.4"
      />
      <text x={x} y={y + 1.5} fontSize={size} fontWeight="900" fill={fill} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

export default function TenPercentWidget({ onSolved }) {
  const [level, setLevel] = useState(0)
  const [atom, setAtom] = useState(null)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const atomRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [still])

  const win = useCallback(
    (id) => {
      if (winRef.current.includes(id)) return
      winRef.current = [...winRef.current, id]
      setWins(winRef.current)
      if (winRef.current.length === 2) onSolved?.()
    },
    [onSolved],
  )

  useEffect(() => {
    if (atom === null || atom >= 1) return undefined
    const id = setTimeout(() => {
      atomRef.current = Math.min(1, atomRef.current + 1 / ATOM_TICKS)
      setAtom(atomRef.current)
      if (atomRef.current >= 1) win('atom')
    }, 70)
    return () => clearTimeout(id)
  }, [atom, win])

  function sendUp() {
    const next = Math.min(TIERS.length - 1, level + 1)
    setLevel(next)
    if (next === TIERS.length - 1) win('top')
  }

  function followAtom() {
    atomRef.current = still ? 1 : 0
    setAtom(atomRef.current)
    if (still) win('atom')
  }

  const units = unitsAt(level)
  const atTop = level === TIERS.length - 1
  const travelling = atom !== null && atom < 1
  const atomStep = atom === null ? -1 : Math.min(STEPS.length - 1, Math.floor(atom * STEPS.length))
  const [ax, ay] = atom === null ? [0, 0] : loopPoint(atom)

  const status = travelling
    ? `Carbon atom: ${STEPS[atomStep].label}`
    : atTop
      ? `1 unit left of ${START_UNITS}`
      : `${units} units, ${TIERS[level].who}`

  // One hint at a time, and only while something is still left to do.
  const hint =
    wins.length === 2 || travelling
      ? null
      : !wins.includes('top')
        ? level === 0
          ? 'Press Send energy up and watch the heat leave.'
          : 'Keep going. Only a tenth reaches the next level.'
        : 'Now follow one carbon atom round the circle.'

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={status}
              preserveAspectRatio="xMidYMid slice"
              style={stageFill(W, H)}
            >
              {/* Sky and meadow, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED} fill={SKY} />
              <rect
                x={-BLEED}
                y={GROUND_Y}
                width={W + BLEED * 2}
                height={H + BLEED - GROUND_Y}
                fill={GROUND}
              />
              <rect x={-BLEED} y={GROUND_Y} width={W + BLEED * 2} height="5" fill={GROUND_DARK} />
              {[-30, 322, 362, 566, 640].map((gx) => (
                <g key={gx} transform={`translate(${gx} ${GROUND_Y + 22})`}>
                  <GrassTuft tint={GROUND_DARK} />
                </g>
              ))}

              {/* Sun: where the thousand units come from. */}
              <circle cx="8" cy="24" r="52" fill="#FDE68A" opacity="0.85" />
              <circle cx="8" cy="24" r="34" fill="#FCD34D" />
              <path
                d="M 44 66 C 58 150 60 226 70 276"
                fill="none"
                stroke={HEAT}
                strokeWidth="2.4"
                strokeDasharray="7 6"
                strokeLinecap="round"
              />
              <path d="M 70 286 l -6 -11 l 12 0 Z" fill={HEAT} />
              <text x="76" y="66" fontSize="10.5" fontWeight="900" fill={HEAT_DEEP}>
                sunlight in
              </text>

              {/* Energy pyramid. */}
              <text x={CX} y="60" fontSize="12" fontWeight="900" fill={INK_MID} textAnchor="middle">
                energy runs out
              </text>
              {TIERS.map((t, i) => {
                const reached = i <= level
                const w = widthAt(i)
                const y = TIER_Y[i]
                const right = CX + w / 2
                return (
                  <g key={t.name} opacity={reached ? 1 : 0.25}>
                    {/* The organisms stand on their own bar. */}
                    {i === 0
                      ? [-70, 0, 70].map((dx) => (
                          <g key={dx} transform={`translate(${CX + dx} ${y})`}>
                            <Organism kind={t.kind} tint={t.tint} />
                          </g>
                        ))
                      : (
                          <g transform={`translate(${CX} ${y})`}>
                            <Organism kind={t.kind} tint={t.tint} />
                          </g>
                        )}
                    <rect
                      x={CX - w / 2}
                      y={y}
                      width={w}
                      height={BAR_H}
                      rx="8"
                      fill={t.tint}
                      stroke={INK}
                      strokeWidth="2"
                    />
                    <text
                      x={CX}
                      y={y + 17}
                      fontSize="12.5"
                      fontWeight="900"
                      fill={PAPER}
                      textAnchor="middle"
                    >
                      {unitsAt(i)} units
                    </text>
                    <text
                      x={CX}
                      y={y + 30}
                      fontSize="9.5"
                      fontWeight="800"
                      fill={PAPER}
                      textAnchor="middle"
                      opacity="0.9"
                    >
                      {t.who}
                    </text>

                    {/* The ninety per cent, drifting off as heat. */}
                    {reached && i > 0 && (
                      <>
                        {[0, 1, 2, 3].map((k) => {
                          const p = still ? 0.45 : (((tick * 0.03 + k / 4) % 1) + 1) % 1
                          return (
                            <circle
                              key={k}
                              cx={right + 12 + p * 56}
                              cy={y + 24 - p * 28}
                              r={4 - p * 2}
                              fill={HEAT}
                              opacity={1 - p}
                            />
                          )
                        })}
                        <text
                          x={right + 44}
                          y={y + 2}
                          fontSize="10"
                          fontWeight="900"
                          fill={HEAT_DEEP}
                          textAnchor="middle"
                        >
                          90% heat
                        </text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* Only a tenth makes the climb. */}
              {GAP_Y.map((gy, k) =>
                level >= k + 1 ? (
                  <Chip key={gy} x={110} y={gy} width={48} text="10% up" fill={TEAL} size={9.5} />
                ) : null,
              )}

              <text
                x={CX}
                y="348"
                fontSize="11.5"
                fontWeight="900"
                fill={level === 0 ? INK_MID : HEAT_DEEP}
                textAnchor="middle"
              >
                {level === 0
                  ? `${START_UNITS} units in`
                  : `${START_UNITS - units} units lost as heat`}
              </text>

              <line
                x1="350"
                y1="76"
                x2="350"
                y2="322"
                stroke={CARD_EDGE}
                strokeWidth="2"
                strokeDasharray="6 7"
              />

              {/* Nutrient cycle. */}
              <text
                x={LOOP_CX}
                y="60"
                fontSize="12"
                fontWeight="900"
                fill={INK_MID}
                textAnchor="middle"
              >
                atoms go round
              </text>
              <circle
                cx={LOOP_CX}
                cy={LOOP_CY}
                r={LOOP_R}
                fill="none"
                stroke="#A8A29E"
                strokeWidth="3"
                strokeDasharray="8 7"
              />
              {[0.125, 0.375, 0.625, 0.875].map((t) => {
                const [x, y] = loopPoint(t)
                return (
                  <path
                    key={t}
                    d={`M ${x} ${y} l -5 -8 l 10 0 Z`}
                    transform={`rotate(${225 + t * 360 + 90} ${x} ${y})`}
                    fill="#A8A29E"
                  />
                )
              })}
              {STEPS.map((s, i) => {
                const [x, y] = loopPoint(i / STEPS.length)
                const here = atomStep === i
                const top = i < 2
                return (
                  <g key={s.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r={here ? 23 : 20}
                      fill={PAPER}
                      stroke={here ? INK : CARD_EDGE}
                      strokeWidth={here ? 3 : 2}
                    />
                    <g transform={`translate(${x} ${y + 9}) scale(0.62)`}>
                      <Organism kind={s.kind} tint={s.tint} />
                    </g>
                    <Chip
                      x={x}
                      y={top ? y - 27 : y + 44}
                      width={s.label.length * 6.2 + 14}
                      text={s.label}
                      fill={here ? INK : INK_MID}
                    />
                  </g>
                )
              })}
              {atom !== null && (
                <g>
                  <circle cx={ax} cy={ay} r="9" fill={ATOM} stroke={INK} strokeWidth="2.5" />
                  <text
                    x={ax}
                    y={ay + 3.5}
                    fontSize="9"
                    fontWeight="900"
                    fill={INK}
                    textAnchor="middle"
                  >
                    C
                  </text>
                </g>
              )}
              <text
                x={LOOP_CX}
                y="306"
                fontSize="11.5"
                fontWeight="900"
                fill={atom >= 1 ? TEAL : INK_MID}
                textAnchor="middle"
              >
                {atom === null
                  ? 'one carbon atom'
                  : atom >= 1
                    ? 'back in the grass'
                    : `${Math.round(atom * 100)}% round`}
              </text>
              <text
                x={LOOP_CX}
                y="324"
                fontSize="10.5"
                fontWeight="800"
                fill={INK_MID}
                textAnchor="middle"
              >
                nothing lost, only moved
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              {hint && (
                <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{hint}</p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Energy, level {level + 1} of {TIERS.length}
              </p>
              <button
                type="button"
                onClick={sendUp}
                disabled={atTop}
                className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                {atTop ? 'Top reached' : 'Send energy up'}
              </button>
              <button
                type="button"
                onClick={() => setLevel(0)}
                disabled={level === 0}
                className="mt-1.5 min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
              >
                Start again
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Nutrients
              </p>
              <button
                type="button"
                onClick={followAtom}
                disabled={travelling}
                className="min-h-11 w-full rounded-xl bg-secondary-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700 disabled:opacity-60"
              >
                {atom === null ? 'Follow one atom' : atom >= 1 ? 'Send it again' : 'Travelling'}
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['top', 'Energy traced to the top'],
                  ['atom', 'One atom followed full circle'],
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
