import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w15-l1 signature interactive — a mitosis the student scrubs by hand.
//
// One position drives everything. Each chromosome has a phase-dependent
// position and shape computed from it: how condensed it is, how far it has
// slid toward the metaphase plate, whether its chromatids have separated, and
// how far each half has been dragged toward its pole. Nothing is keyframed —
// drag the slider backwards and the whole division runs in reverse because the
// same functions are evaluated at a smaller number.
//
// The plant/animal switch changes only the last leg: a furrow pinching in from
// the sides, or a plate built outward from the middle.

const W = 620
const H = 340
const CX = 300
const CY = 160

const END = 100

const STAGES = [
  { id: 'interphase', to: 10, name: 'Interphase', note: 'DNA already copied, still loose and uncondensed. The nucleus looks unremarkable.' },
  { id: 'prophase', to: 34, name: 'Prophase', note: 'Chromatin coils into visible chromosomes, the nuclear envelope breaks down and the spindle starts forming.' },
  { id: 'metaphase', to: 52, name: 'Metaphase', note: 'Every chromosome is lined up on the equator, each sister chromatid held by a fibre from the opposite pole.' },
  { id: 'anaphase', to: 72, name: 'Anaphase', note: 'The chromatids are pulled apart. From here each pole has a complete set.' },
  { id: 'telophase', to: 86, name: 'Telophase', note: 'Chromosomes reach the poles, unwind, and two new nuclear envelopes form around them.' },
  { id: 'cytokinesis', to: 101, name: 'Cytokinesis', note: 'The cytoplasm itself divides — and this is the one step that differs between plants and animals.' },
]

const stageAt = (p) => STAGES.find((s) => p < s.to) ?? STAGES[STAGES.length - 1]

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const seg = (p, from, to) => clamp01((p - from) / (to - from))

// Four chromosomes, each with its own resting place in the nucleus.
const CHROMOSOMES = [
  { id: 0, ox: -62, oy: -36, tint: '#7C3AED' },
  { id: 1, ox: 54, oy: -46, tint: '#0E7490' },
  { id: 2, ox: -44, oy: 40, tint: '#B45309' },
  { id: 3, ox: 58, oy: 34, tint: '#15803D' },
]

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
  // is rebuilt when it moves — and the playback interval restarts with it.
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

  const p = pos
  const stage = stageAt(p)

  const condensed = seg(p, 8, 30) // thin chromatin → thick rod
  const envelope = 1 - seg(p, 20, 34) // nuclear envelope fading out
  const lined = seg(p, 34, 50) // slide to the equator
  const pulled = seg(p, 52, 72) // chromatids dragged apart
  const decondensed = seg(p, 74, 88) // unwinding again at the poles
  const reformed = seg(p, 76, 90) // new envelopes
  const split = seg(p, 86, 100) // cytokinesis
  const spindle = seg(p, 24, 40) * (1 - seg(p, 84, 96))

  const poleGap = 132
  const jitter = Math.sin(tick * 0.3) * 0.9 * (1 - split)

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${stage.name}. ${plant ? 'Plant' : 'Animal'} cell, position ${p} of ${END}.`} style={STAGE_MEDIA}>
              {/* ── Cell outline — pinched by a furrow, or cut by a plate ── */}
              {plant ? (
                <>
                  <rect x={CX - 208} y={CY - 108} width="416" height="216" rx="18" fill="#FDE8D7" stroke="#15803D" strokeWidth="6" />
                  {split > 0 && (
                    <rect x={CX - 5} y={CY - 108 * split} width="10" height={216 * split} fill="#15803D" />
                  )}
                </>
              ) : (
                <path
                  d={`M ${CX - 208} ${CY} Q ${CX - 208} ${CY - 112} ${CX - 70} ${CY - 108}
                      Q ${CX} ${CY - 108 + 70 * split} ${CX + 70} ${CY - 108}
                      Q ${CX + 208} ${CY - 112} ${CX + 208} ${CY}
                      Q ${CX + 208} ${CY + 112} ${CX + 70} ${CY + 108}
                      Q ${CX} ${CY + 108 - 70 * split} ${CX - 70} ${CY + 108}
                      Q ${CX - 208} ${CY + 112} ${CX - 208} ${CY} Z`}
                  fill="#FDE8D7"
                  stroke="#B45309"
                  strokeWidth="5"
                />
              )}

              {/* Nuclear envelope: one at the start, two at the end. */}
              {envelope > 0.02 && (
                <ellipse cx={CX} cy={CY} rx="104" ry="80" fill="none" stroke="#5B21B6" strokeWidth="3.5" strokeDasharray="8 6" opacity={envelope} />
              )}
              {reformed > 0.02 &&
                [-1, 1].map((s) => (
                  <ellipse key={s} cx={CX + s * poleGap} cy={CY} rx="62" ry="52" fill="none" stroke="#5B21B6" strokeWidth="3.5" strokeDasharray="8 6" opacity={reformed} />
                ))}

              {/* Spindle fibres, reaching from the poles to the equator. */}
              {spindle > 0.02 &&
                [-1, 1].map((s) =>
                  CHROMOSOMES.map((c) => (
                    <line
                      key={`${s}-${c.id}`}
                      x1={CX + s * 196}
                      y1={CY}
                      x2={CX + s * (pulled > 0 ? poleGap * pulled + 14 : 14)}
                      y2={CY - 54 + c.id * 36}
                      stroke="#78716c"
                      strokeWidth="1.6"
                      opacity={spindle * 0.8}
                    />
                  )),
                )}
              {spindle > 0.02 &&
                [-1, 1].map((s) => <circle key={s} cx={CX + s * 196} cy={CY} r={5 * spindle} fill="#57534e" />)}

              {/* ── Chromosomes ── */}
              {CHROMOSOMES.map((c) => {
                // Resting position → equator → dragged to opposite poles.
                const baseX = c.ox * (1 - lined)
                const baseY = c.oy * (1 - lined) + (c.id * 36 - 54) * lined
                const thick = 4 + condensed * 8 - decondensed * 7
                const armLen = 16 + condensed * 16 - decondensed * 14
                const sep = 7 + pulled * poleGap

                return [-1, 1].map((s) => (
                  <g key={`${c.id}-${s}`} transform={`translate(${CX + baseX + s * sep * (lined > 0.2 ? 1 : 0.4)} ${CY + baseY + jitter})`}>
                    <path
                      d={`M 0 ${-armLen} L 0 ${armLen}`}
                      stroke={c.tint}
                      strokeWidth={thick}
                      strokeLinecap="round"
                      opacity={0.55 + condensed * 0.45}
                    />
                    {pulled < 0.05 && s === 1 && (
                      <line x1={-sep * (lined > 0.2 ? 2 : 0.8)} y1="0" x2="0" y2="0" stroke="#44403c" strokeWidth={2.5 * condensed} />
                    )}
                  </g>
                ))
              })}

              {/* Metaphase plate, drawn only while it means something. */}
              {lined > 0.5 && pulled < 0.4 && (
                <line x1={CX} y1={CY - 96} x2={CX} y2={CY + 96} stroke="#f97316" strokeWidth="2" strokeDasharray="5 6" opacity={lined * (1 - pulled)} />
              )}

              <text x={CX} y="298" fontSize="15" fontWeight="900" fill="#1c1917" textAnchor="middle">
                {stage.name}
              </text>
              <text x={CX} y="320" fontSize="11.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                {split > 0.02
                  ? plant
                    ? `cell plate ${Math.round(split * 100)}% built from the middle outward`
                    : `furrow ${Math.round(split * 100)}% pinched in from the sides`
                  : `${pulled > 0.02 ? '2 × 4 chromatids separating' : '4 chromosomes, 8 chromatids'}`}
              </text>
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
              <label htmlFor="mr-pos" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Scrub the division — {p} of {END}
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
                Drag it backwards too — everything runs in reverse, because every position
                is computed rather than recorded.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              disabled={still}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {playing ? 'Pause' : still ? 'Playback off (reduced motion)' : 'Play it through, then back'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cytokinesis type
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  [false, 'Animal — furrow'],
                  [true, 'Plant — cell plate'],
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
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                A plant cell has a wall, so it cannot be pinched. It builds a new wall
                across the middle instead.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 4
              </p>
              <ul className="space-y-1.5">
                {[
                  ['forward', 'Scrubbed all the way through'],
                  ['reverse', 'Run back to the start again'],
                  ['furrow', 'Animal ending — cleavage furrow'],
                  ['plate', 'Plant ending — cell plate'],
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
                        {ok ? '✓ Done — ' : 'Not yet — '}
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
        {stage.name}, position {p} of {END}. {plant ? 'Plant' : 'Animal'} cytokinesis.
      </p>
    </>
  )
}
