import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w15-l1 signature interactive: a mitosis the student scrubs by hand.
//
// One position drives everything. Each chromosome has a phase dependent shape
// and place computed from it: how tightly it is coiled, how far it has slid
// toward the metaphase plate, whether its chromatids have separated, and how
// far each half has been dragged toward its pole. Nothing is keyframed, so
// dragging the slider backwards runs the division in reverse because the same
// functions are evaluated at a smaller number.
//
// The plant/animal switch changes only the last leg: a ring pinching a furrow
// in from the sides, or vesicles fusing into a plate from the middle outward.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The background runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in that margin.
const BLEED = 60

// Everything a student has to read lives between x 60 and x 560 and y 40 and
// y 352, because `slice` crops up to about 60 units off whichever axis is long.
const CX = 310
const CY = 182
const HALF_W = 200
const HALF_H = 102

const END = 100
const POLE_GAP = 152

const BG = '#E4EBEF'
const INK = '#44403c'
const INK_MID = '#6B6259'
const CYTO = '#FDE8D7'
const MEMBRANE = '#B45309'
const WALL = '#15803D'
const WALL_IN = '#65A30D'
const ENVELOPE = '#5B21B6'
const FIBRE = '#78716C'
const PLATE = '#F97316'
const RING = '#BE123C'

const STAGES = [
  {
    id: 'interphase',
    from: 0,
    to: 14,
    name: 'Interphase',
    tint: '#A8A29E',
    note: 'The DNA is already copied. The chromosomes are still loose threads.',
  },
  {
    id: 'prophase',
    from: 14,
    to: 36,
    name: 'Prophase',
    tint: '#F59E0B',
    note: 'Threads coil into thick chromosomes. The nuclear envelope breaks apart.',
  },
  {
    id: 'metaphase',
    from: 36,
    to: 54,
    name: 'Metaphase',
    tint: '#3BAFA9',
    note: 'Every chromosome lines up along the middle of the cell.',
  },
  {
    id: 'anaphase',
    from: 54,
    to: 74,
    name: 'Anaphase',
    tint: '#7C3AED',
    note: 'Fibres shorten and drag the two chromatids to opposite poles.',
  },
  {
    id: 'telophase',
    from: 74,
    to: 88,
    name: 'Telophase',
    tint: '#0E7490',
    note: 'New envelopes form. The chromosomes unwind back into threads.',
  },
  {
    id: 'cytokinesis',
    from: 88,
    to: 101,
    name: 'Cytokinesis',
    tint: '#DC2626',
    note: 'The cytoplasm splits, and plants and animals do it differently.',
  },
]

const stageAt = (p) => STAGES.find((s) => p < s.to) ?? STAGES[STAGES.length - 1]

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const lerp = (a, b, t) => a + (b - a) * t
const seg = (p, from, to) => clamp01((p - from) / (to - from))

// Four chromosomes, each with its own resting place in the nucleus and its own
// row on the metaphase plate, so a student can follow one of them all the way.
const CHROMOSOMES = [
  { id: 0, ox: -54, oy: -30, tint: '#7C3AED' },
  { id: 1, ox: 50, oy: -36, tint: '#0E7490' },
  { id: 2, ox: -44, oy: 32, tint: '#BE123C' },
  { id: 3, ox: 52, oy: 26, tint: '#A16207' },
]

const rowY = (id) => (id - 1.5) * 42

// Faint grain so the cytoplasm is not a flat fill. Kept well inside the
// membrane so it never escapes while the cell is being pinched.
const GRAIN = Array.from({ length: 26 }, (_, i) => [
  (((i * 37) % 100) / 100 - 0.5) * 300,
  (((i * 61) % 100) / 100 - 0.5) * 140,
])

// One chromatid: a long wavy thread when loose, a short fat rod once coiled.
// The same path morphs between the two, which is why dragging back uncoils it.
function strandPath(len, wobble, phase) {
  const points = []
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12
    const y = -len + 2 * len * t
    const x = Math.sin(t * Math.PI * 3 + phase) * wobble
    points.push(`${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ')
}

// A short label tied by a leader line to the part of the picture it names.
function Tag({ x, y, tx, ty, text, tint = INK }) {
  return (
    <g>
      <line x1={x} y1={y + 4} x2={tx} y2={ty} stroke={tint} strokeWidth="1.4" opacity="0.65" />
      <text x={x} y={y} fontSize="11.5" fontWeight="900" fill={tint} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

const TRACK_X = 62
const TRACK_W = 496
const TRACK_Y = 318
const TRACK_H = 34

export default function MitosisRunWidget({ onSolved }) {
  const [pos, setPos] = useState(0)
  const [plant, setPlant] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const posRef = useRef(0)
  const dirRef = useRef(1)

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
      if (winRef.current.length === 4) onSolved?.()
    },
    [onSolved],
  )

  // Which cytokinesis ending gets credited depends on the switch, so `mark`
  // is rebuilt when it moves, and the playback interval restarts with it.
  const mark = useCallback(
    (value) => {
      if (value >= END - 1) {
        win(plant ? 'plate' : 'furrow')
        win('forward')
      }
      if (value <= 1 && winRef.current.includes('forward')) win('reverse')
    },
    [plant, win],
  )

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      const next = posRef.current + dirRef.current * 1.5
      if (next >= END) {
        dirRef.current = -1
        posRef.current = END
      } else if (next <= 0) {
        dirRef.current = 1
        posRef.current = 0
      } else {
        posRef.current = next
      }
      setPos(Math.round(posRef.current))
      mark(Math.round(posRef.current))
    }, 70)
    return () => clearInterval(id)
  }, [playing, mark])

  function changePos(value) {
    posRef.current = value
    setPos(value)
    setPlaying(false)
    mark(value)
  }

  function reset() {
    posRef.current = 0
    dirRef.current = 1
    setPos(0)
    setPlaying(false)
  }

  const p = pos
  const stage = stageAt(p)

  const coil = clamp01(seg(p, 12, 34) - seg(p, 76, 90))
  const envelope = 1 - seg(p, 24, 36)
  const nucleolus = 1 - seg(p, 14, 26)
  const lined = seg(p, 32, 52)
  const pulled = seg(p, 54, 74)
  const reformed = seg(p, 76, 90)
  const split = seg(p, 88, 100)
  const spindle = seg(p, 26, 40) * (1 - seg(p, 86, 96))

  const jitter = still ? 0 : Math.sin(tick * 0.3) * 0.9 * (1 - split)
  const pinch = HALF_H * 0.7 * split
  const topY = CY - HALF_H + pinch
  const botY = CY + HALF_H - pinch

  const strandLen = lerp(32, 16, coil)
  const strandWob = (1 - coil) * 7
  const strandThick = lerp(3, 10, coil)
  const halfGap = 4 + pulled * (POLE_GAP / 2)

  const caption = split > 0.02
    ? plant
      ? `cell plate ${Math.round(split * 100)}% built outward`
      : `furrow ${Math.round(split * 100)}% pinched in`
    : pulled > 0.02
      ? '2 sets of 4 chromosomes, moving apart'
      : '4 chromosomes, 8 chromatids'

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${stage.name}. ${plant ? 'Plant' : 'Animal'} cell, position ${p} of ${END}. ${caption}.`}
              style={stageFill(W, H)}
            >
              {/* Background, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BG} />

              <text x={CX} y="42" fontSize="12.5" fontWeight="900" fill={INK} textAnchor="middle">
                one cell into two identical cells
              </text>

              {/* ── The cell itself ── */}
              {plant ? (
                <>
                  <rect
                    x={CX - HALF_W}
                    y={CY - HALF_H}
                    width={HALF_W * 2}
                    height={HALF_H * 2}
                    rx="10"
                    fill="none"
                    stroke={WALL}
                    strokeWidth="9"
                  />
                  <rect
                    x={CX - HALF_W + 7}
                    y={CY - HALF_H + 7}
                    width={HALF_W * 2 - 14}
                    height={HALF_H * 2 - 14}
                    rx="7"
                    fill={CYTO}
                    stroke={WALL_IN}
                    strokeWidth="2.5"
                  />
                  {[
                    [-178, -44],
                    [178, -44],
                    [-178, 48],
                    [178, 48],
                  ].map(([gx, gy]) => (
                    <ellipse
                      key={`cp-${gx}`}
                      cx={CX + gx}
                      cy={CY + gy}
                      rx="11"
                      ry="7"
                      fill="#86EFAC"
                      stroke={WALL}
                      strokeWidth="1.8"
                    />
                  ))}
                </>
              ) : (
                <path
                  d={`M ${CX - HALF_W} ${CY}
                      Q ${CX - HALF_W} ${CY - HALF_H - 10} ${CX - 74} ${CY - HALF_H}
                      Q ${CX} ${topY} ${CX + 74} ${CY - HALF_H}
                      Q ${CX + HALF_W} ${CY - HALF_H - 10} ${CX + HALF_W} ${CY}
                      Q ${CX + HALF_W} ${CY + HALF_H + 10} ${CX + 74} ${CY + HALF_H}
                      Q ${CX} ${botY} ${CX - 74} ${CY + HALF_H}
                      Q ${CX - HALF_W} ${CY + HALF_H + 10} ${CX - HALF_W} ${CY} Z`}
                  fill={CYTO}
                  stroke={MEMBRANE}
                  strokeWidth="5"
                />
              )}

              {GRAIN.map(([gx, gy], i) => (
                <circle
                  key={`g-${i}`}
                  cx={CX + gx}
                  cy={CY + gy}
                  r="1.7"
                  fill={MEMBRANE}
                  opacity="0.16"
                />
              ))}

              {/* The drawstring of protein filaments that pulls the furrow in. */}
              {!plant && split > 0.02 && (
                <>
                  <path
                    d={`M ${CX - 48} ${topY - 7} Q ${CX} ${topY + 7} ${CX + 48} ${topY - 7}`}
                    fill="none"
                    stroke={RING}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity={split}
                  />
                  <path
                    d={`M ${CX - 48} ${botY + 7} Q ${CX} ${botY - 7} ${CX + 48} ${botY + 7}`}
                    fill="none"
                    stroke={RING}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity={split}
                  />
                </>
              )}

              {/* Vesicles lining up down the middle, then fusing into a plate. */}
              {plant && split > 0.02 && (
                <>
                  <rect
                    x={CX - 5}
                    y={CY - (HALF_H - 7) * split}
                    width="10"
                    height={(HALF_H - 7) * 2 * split}
                    fill={WALL}
                  />
                  {[-72, -40, 40, 72].map((vy) => (
                    <circle
                      key={`v-${vy}`}
                      cx={CX}
                      cy={CY + vy}
                      r="5.5"
                      fill="#BBF7D0"
                      stroke={WALL}
                      strokeWidth="1.8"
                      opacity={clamp01((1 - split) * 1.5)}
                    />
                  ))}
                </>
              )}

              {/* ── Nuclear envelope: one at the start, two at the end ── */}
              {envelope > 0.02 && (
                <>
                  <ellipse
                    cx={CX}
                    cy={CY}
                    rx="100"
                    ry="76"
                    fill="#EDE9FE"
                    stroke={ENVELOPE}
                    strokeWidth="3.5"
                    strokeDasharray="9 6"
                    opacity={envelope * 0.9}
                  />
                  {nucleolus > 0.02 && (
                    <circle cx={CX + 62} cy={CY + 44} r="13" fill="#C4B5FD" stroke={ENVELOPE} strokeWidth="2" opacity={nucleolus} />
                  )}
                </>
              )}
              {reformed > 0.02 &&
                [-1, 1].map((s) => (
                  <ellipse
                    key={s}
                    cx={CX + s * (POLE_GAP / 2)}
                    cy={CY}
                    rx="60"
                    ry="52"
                    fill="#EDE9FE"
                    stroke={ENVELOPE}
                    strokeWidth="3.5"
                    strokeDasharray="9 6"
                    opacity={reformed * 0.9}
                  />
                ))}

              {/* ── Spindle: poles, asters and the fibres reaching the plate ── */}
              {spindle > 0.02 && (
                <g opacity={spindle}>
                  {[-1, 1].map((s) => (
                    <g key={`pole-${s}`}>
                      {!plant &&
                        Array.from({ length: 9 }, (_, i) => {
                          const a = (i / 9) * Math.PI * 2
                          return (
                            <line
                              key={i}
                              x1={CX + s * 182}
                              y1={CY}
                              x2={CX + s * 182 + Math.cos(a) * 22}
                              y2={CY + Math.sin(a) * 22}
                              stroke={FIBRE}
                              strokeWidth="1.6"
                              opacity="0.7"
                            />
                          )
                        })}
                      <circle cx={CX + s * 182} cy={CY} r="5.5" fill="#57534e" />
                    </g>
                  ))}
                  {[-1, 1].map((s) =>
                    CHROMOSOMES.map((c) => {
                      const bx = c.ox * (1 - lined)
                      const by = c.oy * (1 - lined) + rowY(c.id) * lined
                      return (
                        <line
                          key={`${s}-${c.id}`}
                          x1={CX + s * 182}
                          y1={CY}
                          x2={CX + bx + s * halfGap}
                          y2={CY + by}
                          stroke={FIBRE}
                          strokeWidth="1.6"
                          opacity="0.8"
                        />
                      )
                    }),
                  )}
                </g>
              )}

              {/* The metaphase plate, drawn only while it means something. */}
              {lined > 0.4 && pulled < 0.4 && (
                <line
                  x1={CX}
                  y1={CY - 94}
                  x2={CX}
                  y2={CY + 94}
                  stroke={PLATE}
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  opacity={lined * (1 - pulled)}
                />
              )}

              {/* ── Chromosomes ── */}
              {CHROMOSOMES.map((c) => {
                const bx = c.ox * (1 - lined)
                const by = c.oy * (1 - lined) + rowY(c.id) * lined + jitter

                return (
                  <g key={c.id}>
                    {[-1, 1].map((s) => (
                      <path
                        key={s}
                        transform={`translate(${CX + bx + s * halfGap} ${CY + by})`}
                        d={strandPath(strandLen, strandWob, s * 0.9 + c.id)}
                        fill="none"
                        stroke={c.tint}
                        strokeWidth={strandThick}
                        strokeLinecap="round"
                        opacity={0.6 + coil * 0.4}
                      />
                    ))}
                    {pulled < 0.08 && coil > 0.15 && (
                      <ellipse
                        cx={CX + bx}
                        cy={CY + by}
                        rx={halfGap + 2}
                        ry={3.4 * coil}
                        fill="#44403c"
                      />
                    )}
                  </g>
                )
              })}

              {/* ── One label at a time, so the picture never crowds ── */}
              {envelope > 0.15 && envelope < 0.95 && (
                <Tag x={CX - 146} y={CY - 64} tx={CX - 94} ty={CY - 40} text="nucleus" tint={ENVELOPE} />
              )}
              {lined > 0.75 && pulled < 0.15 && (
                <Tag x={CX + 106} y={CY - 82} tx={CX + 6} ty={CY - 58} text="metaphase plate" tint={PLATE} />
              )}
              {pulled > 0.15 && pulled < 0.95 && (
                <Tag x={CX + 128} y={CY + 92} tx={CX + 92} ty={CY + 40} text="fibres pulling" tint={FIBRE} />
              )}
              {split > 0.15 && (
                <Tag
                  x={CX + 112}
                  y={CY - 82}
                  tx={CX + 8}
                  ty={CY - 64}
                  text={plant ? 'cell plate' : 'cleavage furrow'}
                  tint={plant ? WALL : RING}
                />
              )}

              <text x={CX} y="302" fontSize="12" fontWeight="800" fill={INK_MID} textAnchor="middle">
                {caption}
              </text>

              {/* ── Stage track: where in the division the slider is sitting ── */}
              <g>
                {STAGES.map((s) => {
                  const x = TRACK_X + (s.from / END) * TRACK_W
                  const w = ((Math.min(s.to, END) - s.from) / END) * TRACK_W
                  const active = s.id === stage.id
                  return (
                    <g key={s.id}>
                      <rect
                        x={x}
                        y={TRACK_Y}
                        width={w - 2}
                        height={TRACK_H}
                        rx="7"
                        fill={s.tint}
                        opacity={active ? 1 : 0.32}
                      />
                      <text
                        x={x + (w - 2) / 2}
                        y={TRACK_Y + 21}
                        fontSize="8.8"
                        fontWeight="900"
                        fill={active ? '#FFFFFF' : INK}
                        textAnchor="middle"
                      >
                        {s.name}
                      </text>
                    </g>
                  )
                })}
                <path
                  d={`M ${TRACK_X + (p / END) * TRACK_W} ${TRACK_Y - 3} l -7 -10 l 14 0 Z`}
                  fill="#1c1917"
                />
              </g>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{stage.name}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{stage.note}</p>
            </div>

            <div>
              <label
                htmlFor="mr-pos"
                className="mb-1 flex items-baseline justify-between gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                <span>Scrub the division</span>
                <span className="text-sm text-stone-900 dark:text-white">
                  {p} of {END}
                </span>
              </label>
              <input
                id="mr-pos"
                type="range"
                min={0}
                max={END}
                step={1}
                value={p}
                onChange={(e) => changePos(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Drag it backwards too.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              disabled={still}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {playing ? 'Pause' : still ? 'Playback off' : 'Play it through and back'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cell type
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  [false, 'Animal cell'],
                  [true, 'Plant cell'],
                ].map(([value, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPlant(value)}
                    className={`min-h-11 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                      plant === value
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              disabled={p === 0 && !playing}
              className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
            >
              Reset
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of 4
              </p>
              <ul className="space-y-1.5">
                {[
                  ['forward', 'Run all the way through'],
                  ['reverse', 'Run back to the start'],
                  ['furrow', 'Animal ending, the furrow'],
                  ['plate', 'Plant ending, the cell plate'],
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
        {stage.name}, position {p} of {END}. {plant ? 'Plant' : 'Animal'} cell. {caption}.
      </p>
    </>
  )
}
