import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w18-l1 signature interactive: twelve offspring, no two the same.
//
// Each offspring's three traits are drawn from a deterministic hash of the
// batch seed and its own index, then pulled toward the midpoint of the two
// parents. That means the litter is genuinely computed from where the parent
// sliders are: move a parent and the whole spread on screen shifts with it,
// and a new batch is a new seed rather than a new picture.
//
// The disease then kills on one trait, inside a fixed band. Because the
// offspring are spread out, the band misses some of them, which is exactly
// what the clone field in `clone-bench` could not do.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The background runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in that margin.
const BLEED = 60

const LITTER = 12

// Survival needs a shell tone outside the band the parasite can grip.
const KILL_LOW = 34
const KILL_HIGH = 66

// `slice` can crop about 60 units off whichever axis is long, so every label
// sits between x 60 and x 560 and between y 40 and y 352.
const PARENT_Y = 88
const PARENT_SCALE = 1.28
const SCALE_X = 120
const SCALE_W = 380
const GROUND_Y = 218
const ROW_Y = [252, 322]
const COL_X = [90, 178, 266, 354, 442, 530]
// Shrinks the raw trait size so a whole litter fits two rows without the
// bottom row's legs running past the crop line.
const LITTER_SCALE = 0.72

const BG = '#E9EEE8'
const GROUND = '#D7DECD'
const GROUND_DARK = '#B9C3A9'
const INK = '#44403c'
const INK_MID = '#6B6259'
const PAPER = '#FDF7EC'
const CARD_EDGE = '#DED7C7'
const RED = '#DC2626'
const TEAL = '#0F766E'
const LEAF = '#5C8F4E'
const DEAD = '#A8A29E'

// Cheap deterministic hash so a batch is reproducible and a re-render never
// reshuffles the litter under the student.
function rand(seed, index, salt) {
  const x = Math.sin(seed * 127.1 + index * 311.7 + salt * 74.7) * 43758.5453
  return x - Math.floor(x)
}

function childOf(seed, i, a, b) {
  const mix = rand(seed, i, 1)
  const shell = Math.round(a * mix + b * (1 - mix) + (rand(seed, i, 2) - 0.5) * 26)
  return {
    shell: Math.max(0, Math.min(100, shell)),
    size: 0.7 + rand(seed, i, 3) * 0.62,
    spots: Math.floor(rand(seed, i, 4) * 5),
  }
}

const survives = (c) => c.shell < KILL_LOW || c.shell > KILL_HIGH

// Shell tone reads as a hue sweep from pale sand to deep rust, and the number
// is printed under every beetle too, so colour is never the only signal.
const shellFill = (v) => `hsl(${28 + (v / 100) * 176} 62% ${72 - (v / 100) * 22}%)`

const toneX = (v) => SCALE_X + (v / 100) * SCALE_W

// Six legs and two antennae are what make this read as a beetle rather than a
// coloured oval. The split down the middle is the join between the two wing
// cases, which is where the shell tone is actually judged.
const LEG_PATHS = [
  'M -9 -13 q -11 -4 -17 -11',
  'M -10 -1 q -13 1 -19 -3',
  'M -9 11 q -12 5 -17 12',
]

function Legs({ dir }) {
  return (
    <g transform={dir < 0 ? 'scale(-1 1)' : undefined}>
      {LEG_PATHS.map((d) => (
        <path key={d} d={d} fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      ))}
    </g>
  )
}

function Beetle({ c, x, y, scale, dead, tick, shadow }) {
  const s = c.size * scale
  const wob = dead ? 0 : Math.sin(tick * 0.2 + c.shell) * 1.2
  const fill = dead ? DEAD : shellFill(c.shell)

  return (
    <g transform={`translate(${x} ${y + wob})`}>
      {shadow && (
        <ellipse cy={24 * s} rx={15 * s} ry={4 * s} fill={GROUND_DARK} opacity="0.45" />
      )}
      {/* A killed beetle lands on its back, legs in the air. */}
      <g transform={`scale(${s})${dead ? ' rotate(180)' : ''}`}>
        <Legs dir={1} />
        <Legs dir={-1} />
        <path d="M -4 -28 q -7 -6 -13 -6" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M 4 -28 q 7 -6 13 -6" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <ellipse cy="-25" rx="7.2" ry="5.8" fill={INK} />
        <circle cx="-3.2" cy="-26.5" r="1.4" fill={PAPER} />
        <circle cx="3.2" cy="-26.5" r="1.4" fill={PAPER} />
        <ellipse cy="-16" rx="11.5" ry="7.5" fill={INK} />
        <ellipse cy="3" rx="17" ry="19.5" fill={fill} stroke={INK} strokeWidth="2.2" />
        <line x1="0" y1="-15" x2="0" y2="22" stroke={INK} strokeWidth="1.6" />
        <path
          d="M -14 -4 q 4 -8 12 -9"
          fill="none"
          stroke={PAPER}
          strokeWidth="2.6"
          opacity="0.4"
          strokeLinecap="round"
        />
        {Array.from({ length: c.spots }, (_, k) => (
          <circle
            key={k}
            cx={k % 2 ? 7.5 : -7.5}
            cy={-6 + Math.floor(k / 2) * 10}
            r="2.8"
            fill={INK}
            opacity={dead ? 0.35 : 0.75}
          />
        ))}
      </g>
    </g>
  )
}

function Leaf({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -44 0 Q 0 -15 44 0 Q 0 13 -44 0 Z" fill={LEAF} opacity="0.55" />
      <path d="M -40 0 L 40 0" stroke={LEAF} strokeWidth="1.6" opacity="0.9" />
    </g>
  )
}

export default function VariationBatchWidget({ onSolved }) {
  const [parentA, setParentA] = useState(22)
  const [parentB, setParentB] = useState(78)
  const [seed, setSeed] = useState(3)
  const [born, setBorn] = useState(0)
  const [running, setRunning] = useState(false)
  const [diseased, setDiseased] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const bornRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 80)
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
    if (!running) return undefined
    const id = setInterval(() => {
      bornRef.current = Math.min(LITTER, bornRef.current + 1)
      setBorn(bornRef.current)
      if (bornRef.current >= LITTER) {
        setRunning(false)
        win('batch')
      }
    }, 180)
    return () => clearInterval(id)
  }, [running, win])

  function cross() {
    setSeed((s) => s + 1)
    setDiseased(false)
    if (still) {
      bornRef.current = LITTER
      setBorn(LITTER)
      win('batch')
      return
    }
    bornRef.current = 0
    setBorn(0)
    setRunning(true)
  }

  function release() {
    setDiseased(true)
    if (born >= LITTER && children.some(survives)) win('stress')
  }

  const children = Array.from({ length: LITTER }, (_, i) => childOf(seed, i, parentA, parentB))
  const shown = children.slice(0, born)
  const alive = shown.filter(survives).length
  const tones = shown.map((c) => c.shell)

  const status = diseased
    ? `${alive} of ${shown.length} survived`
    : born === 0
      ? 'No offspring yet'
      : born < LITTER
        ? `${born} of ${LITTER} born`
        : `${LITTER} offspring, tones ${Math.min(...tones)} to ${Math.max(...tones)}`

  // One hint at a time, and only while the student still has something to work
  // out. Once both goals are met it stops showing rather than nagging.
  const hint = wins.includes('stress')
    ? null
    : diseased && alive === 0
      ? 'Both parents sat inside the parasite zone. Move them apart and cross again.'
      : born === 0
        ? 'Set the two parent tones, then cross them.'
        : born >= LITTER
          ? 'Parents far apart spread the litter past the parasite zone.'
          : null

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
              {/* Background, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED} fill={BG} />
              <rect
                x={-BLEED}
                y={GROUND_Y}
                width={W + BLEED * 2}
                height={H + BLEED - GROUND_Y}
                fill={GROUND}
              />
              <rect
                x={-BLEED}
                y={GROUND_Y}
                width={W + BLEED * 2}
                height="5"
                fill={GROUND_DARK}
                opacity="0.7"
              />

              {/* Foliage in the top corners, running off both edges. */}
              <path d="M -70 -20 q 90 30 120 90 q -80 10 -130 -40 Z" fill={LEAF} opacity="0.18" />
              <path d="M 690 -20 q -90 30 -120 90 q 80 10 130 -40 Z" fill={LEAF} opacity="0.18" />

              {/* Grass tufts, also bled past both sides. */}
              {[-40, 26, 96, 214, 340, 470, 552, 640].map((gx) => (
                <path
                  key={gx}
                  d={`M ${gx} ${GROUND_Y + 3} l -6 -14 M ${gx} ${GROUND_Y + 3} l 1 -18 M ${gx} ${GROUND_Y + 3} l 7 -13`}
                  fill="none"
                  stroke={LEAF}
                  strokeWidth="2.2"
                  opacity="0.5"
                  strokeLinecap="round"
                />
              ))}

              {/* ── The two parents, and the cross between them ── */}
              <Leaf x={110} y={121} />
              <Leaf x={510} y={121} />
              <Beetle
                c={{ shell: parentA, size: 1, spots: 2 }}
                x={110}
                y={PARENT_Y}
                scale={PARENT_SCALE}
                dead={false}
                tick={tick}
              />
              <Beetle
                c={{ shell: parentB, size: 1, spots: 3 }}
                x={510}
                y={PARENT_Y}
                scale={PARENT_SCALE}
                dead={false}
                tick={tick}
              />
              <text x="110" y="145" fontSize="11.5" fontWeight="900" fill={INK_MID} textAnchor="middle">
                parent A {parentA}
              </text>
              <text x="510" y="145" fontSize="11.5" fontWeight="900" fill={INK_MID} textAnchor="middle">
                parent B {parentB}
              </text>

              <line
                x1="152"
                y1={PARENT_Y}
                x2="284"
                y2={PARENT_Y}
                stroke={INK_MID}
                strokeWidth="2.2"
                strokeDasharray="7 6"
              />
              <line
                x1="336"
                y1={PARENT_Y}
                x2="468"
                y2={PARENT_Y}
                stroke={INK_MID}
                strokeWidth="2.2"
                strokeDasharray="7 6"
              />
              <circle cx="310" cy={PARENT_Y} r="22" fill={PAPER} stroke={INK_MID} strokeWidth="2.2" />
              <text
                x="310"
                y={PARENT_Y + 9}
                fontSize="24"
                fontWeight="900"
                fill={INK_MID}
                textAnchor="middle"
              >
                ×
              </text>
              <text x="310" y="124" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
                cross
              </text>

              {/* ── The tone scale, pinned up like a field chart ── */}
              <rect
                x="104"
                y="150"
                width="412"
                height="62"
                rx="10"
                fill={PAPER}
                stroke={CARD_EDGE}
                strokeWidth="1.6"
              />
              <defs>
                <linearGradient id="vb-scale" x1="0" x2="1">
                  <stop offset="0" stopColor={shellFill(0)} />
                  <stop offset="0.5" stopColor={shellFill(50)} />
                  <stop offset="1" stopColor={shellFill(100)} />
                </linearGradient>
              </defs>
              <text
                x={(toneX(KILL_LOW) + toneX(KILL_HIGH)) / 2}
                y="164"
                fontSize="10.5"
                fontWeight="900"
                fill={RED}
                textAnchor="middle"
              >
                parasite zone {KILL_LOW}-{KILL_HIGH}
              </text>
              <rect x={SCALE_X} y="172" width={SCALE_W} height="14" rx="7" fill="url(#vb-scale)" />
              <rect
                x={toneX(KILL_LOW)}
                y="168"
                width={toneX(KILL_HIGH) - toneX(KILL_LOW)}
                height="22"
                rx="5"
                fill={RED}
                fillOpacity={diseased ? 0.18 : 0.06}
                stroke={RED}
                strokeWidth="2.6"
                strokeDasharray={diseased ? undefined : '6 5'}
              />
              <text x={SCALE_X - 6} y="183" fontSize="10" fontWeight="800" fill={INK_MID} textAnchor="end">
                pale
              </text>
              <text
                x={SCALE_X + SCALE_W + 6}
                y="183"
                fontSize="10"
                fontWeight="800"
                fill={INK_MID}
                textAnchor="start"
              >
                dark
              </text>
              {/* One marker per offspring born, so the spread appears on the
                  scale at the same moment it appears on the ground. */}
              {shown.map((c, i) => (
                <path
                  key={`m${i}`}
                  d={`M ${toneX(c.shell)} 190 l -5 9 l 10 0 Z`}
                  fill={diseased ? (survives(c) ? TEAL : RED) : INK_MID}
                />
              ))}
              <text x="310" y="208" fontSize="10" fontWeight="800" fill={INK_MID} textAnchor="middle">
                shell tone
              </text>

              {/* ── The litter ── */}
              {shown.map((c, i) => (
                <Beetle
                  key={i}
                  c={c}
                  x={COL_X[i % 6]}
                  y={ROW_Y[Math.floor(i / 6)]}
                  scale={LITTER_SCALE}
                  dead={diseased && !survives(c)}
                  tick={tick}
                  shadow
                />
              ))}
              {shown.map((c, i) => (
                <text
                  key={`t${i}`}
                  x={COL_X[i % 6]}
                  y={ROW_Y[Math.floor(i / 6)] + 26}
                  fontSize="10.5"
                  fontWeight="900"
                  fill={diseased ? (survives(c) ? TEAL : RED) : INK_MID}
                  textAnchor="middle"
                >
                  {c.shell}
                  {diseased ? (survives(c) ? ' ✓' : ' ✗') : ''}
                </text>
              ))}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                diseased && alive === 0
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              {hint && (
                <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{hint}</p>
              )}
            </div>

            {[
              ['Parent A tone', parentA, setParentA, 'vb-a'],
              ['Parent B tone', parentB, setParentB, 'vb-b'],
            ].map(([label, value, setter, key]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  {label} {value}
                </label>
                <input
                  id={key}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={cross}
              disabled={running}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              {running ? `Breeding ${born} of ${LITTER}` : 'Cross the parents'}
            </button>

            <button
              type="button"
              onClick={release}
              disabled={born < LITTER || diseased}
              className="min-h-11 w-full rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition-colors disabled:opacity-50 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200"
            >
              {diseased ? `${alive} survived` : 'Release the disease'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['batch', 'Twelve offspring born'],
                  ['stress', 'Some offspring survived the disease'],
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
