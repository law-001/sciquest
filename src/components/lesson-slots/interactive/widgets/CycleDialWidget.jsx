import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w14-l2 signature interactive — the cell cycle as a dial you turn.
//
// Position on the dial is the only input. The chromosomes below it are drawn
// from that position: through S phase each one grows a second chromatid a
// little at a time, so the student watches duplication happen rather than
// being shown a before and an after. The DNA-amount graph is the same number
// plotted, which is why it steps up exactly across S and nowhere else.
//
// Damaged DNA does not pop up a warning. The dial simply will not turn past
// the G2 checkpoint — the slider stops moving, and the reason is written on
// the checkpoint marker the handle has run into.

const W = 620
const H = 340
const CX = 186
const CY = 168
const R_OUT = 118
const R_IN = 74

const G2_CHECKPOINT = 82
const CYCLE_STEPS = 100

const PHASES = [
  { id: 'g1', from: 0, to: 40, name: 'G₁ — growth', tint: '#F59E0B', note: 'The cell grows, builds organelles and checks it is big enough to be worth copying its DNA.' },
  { id: 's', from: 40, to: 62, name: 'S — DNA synthesis', tint: '#3BAFA9', note: 'Every chromosome is copied. This is the only place in the whole cycle where the DNA amount changes.' },
  { id: 'g2', from: 62, to: 82, name: 'G₂ — final checks', tint: '#7C3AED', note: 'Proteins for division are made, and the copied DNA is proof-read before the cell is allowed to divide.' },
  { id: 'm', from: 82, to: 100, name: 'M — mitosis', tint: '#DC2626', note: 'The copies are pulled apart and the cell splits in two. Short — under an hour in a cycle that ran all day.' },
]

const phaseAt = (p) => PHASES.find((ph) => p < ph.to) ?? PHASES[PHASES.length - 1]

// 0 at the top, running clockwise, so the dial reads like a clock.
const angleOf = (p) => (p / CYCLE_STEPS) * Math.PI * 2 - Math.PI / 2

function arc(from, to, radius) {
  const a0 = angleOf(from)
  const a1 = angleOf(to)
  const large = to - from > CYCLE_STEPS / 2 ? 1 : 0
  return `M ${CX + Math.cos(a0) * radius} ${CY + Math.sin(a0) * radius} A ${radius} ${radius} 0 ${large} 1 ${CX + Math.cos(a1) * radius} ${CY + Math.sin(a1) * radius}`
}

// One chromosome's worth of DNA before S, two after — and a fraction of the
// way through in between, which is what the second chromatid drawing shows.
const copiedFraction = (p) => Math.max(0, Math.min(1, (p - 40) / 22))
const dnaAmount = (p) => (p >= 82 ? 2 : 1 + copiedFraction(p))

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
  const jiggle = Math.sin(tick * 0.3) * 1.5
  const handA = angleOf(pos)

  const status = blocked
    ? 'Held at the G₂ checkpoint. Damaged DNA is not allowed into mitosis — the dial will not turn.'
    : `${phase.name} — DNA amount ${dna.toFixed(2)}×.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${status} Position ${pos} of ${CYCLE_STEPS} around the cell cycle.`} style={STAGE_MEDIA}>
              {/* ── The dial ── */}
              <circle cx={CX} cy={CY} r={(R_OUT + R_IN) / 2} fill="none" stroke="#E7E0D2" strokeWidth={R_OUT - R_IN} />
              {PHASES.map((ph) => (
                <path
                  key={ph.id}
                  d={arc(ph.from, ph.to, (R_OUT + R_IN) / 2)}
                  fill="none"
                  stroke={ph.tint}
                  strokeWidth={R_OUT - R_IN}
                  opacity={ph.id === phase.id ? 1 : 0.42}
                />
              ))}
              {PHASES.map((ph) => {
                const a = angleOf((ph.from + ph.to) / 2)
                return (
                  <text
                    key={ph.id}
                    x={CX + Math.cos(a) * ((R_OUT + R_IN) / 2)}
                    y={CY + Math.sin(a) * ((R_OUT + R_IN) / 2) + 5}
                    fontSize="14"
                    fontWeight="900"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    {ph.id === 'g1' ? 'G₁' : ph.id === 's' ? 'S' : ph.id === 'g2' ? 'G₂' : 'M'}
                  </text>
                )
              })}

              {/* Checkpoint marker, where the handle actually stops. */}
              <g transform={`rotate(${(G2_CHECKPOINT / CYCLE_STEPS) * 360} ${CX} ${CY})`}>
                <line x1={CX} y1={CY - R_OUT - 10} x2={CX} y2={CY - R_IN + 6} stroke={damaged ? '#DC2626' : '#57534e'} strokeWidth="4" />
              </g>
              <text x={CX} y={CY + R_OUT + 30} fontSize="11.5" fontWeight="900" fill={damaged ? '#DC2626' : '#78716c'} textAnchor="middle">
                {damaged ? 'G₂ checkpoint — closed' : 'G₂ checkpoint — open'}
              </text>

              {/* Handle */}
              <line x1={CX} y1={CY} x2={CX + Math.cos(handA) * (R_IN - 6)} y2={CY + Math.sin(handA) * (R_IN - 6)} stroke="#1c1917" strokeWidth="4" />
              <circle cx={CX + Math.cos(handA) * (R_OUT + 12)} cy={CY + Math.sin(handA) * (R_OUT + 12)} r="9" fill="#f97316" stroke="#1c1917" strokeWidth="2.5" />
              <circle cx={CX} cy={CY} r="7" fill="#1c1917" />

              {/* ── Chromosomes, drawn from the same position ── */}
              <text x="452" y="46" fontSize="12" fontWeight="900" fill="#78716c" textAnchor="middle">
                chromosomes
              </text>
              {[0, 1, 2].map((i) => {
                const x = 398 + i * 54
                const y = 104 + jiggle * (i % 2 ? 1 : -1)
                const sister = copied > 0.02
                return (
                  <g key={i}>
                    <path d={`M ${x} ${y - 30} L ${x} ${y + 30}`} stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" />
                    {sister && (
                      <>
                        <path
                          d={`M ${x + 14} ${y - 30 * copied} L ${x + 14} ${y + 30 * copied}`}
                          stroke="#7C3AED"
                          strokeWidth="11"
                          strokeLinecap="round"
                          opacity={0.45 + copied * 0.55}
                        />
                        <line x1={x} y1={y} x2={x + 14} y2={y} stroke="#4C1D95" strokeWidth={5 * copied} />
                      </>
                    )}
                  </g>
                )
              })}
              <text x="452" y="160" fontSize="11.5" fontWeight="800" fill="#7C3AED" textAnchor="middle">
                {copied >= 1 ? 'each one is now two chromatids' : copied > 0 ? `copying — ${Math.round(copied * 100)}%` : 'single chromatids'}
              </text>
              {damaged && (
                <text x="452" y="180" fontSize="11.5" fontWeight="900" fill="#DC2626" textAnchor="middle">
                  ✳ damage on chromosome 2
                </text>
              )}

              {/* ── DNA amount graph ── */}
              <g transform="translate(362 210)">
                <line x1="0" y1="82" x2="196" y2="82" stroke="#78716c" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="82" stroke="#78716c" strokeWidth="2" />
                <text x="-6" y="10" fontSize="10" fontWeight="800" fill="#78716c" textAnchor="end">2×</text>
                <text x="-6" y="48" fontSize="10" fontWeight="800" fill="#78716c" textAnchor="end">1×</text>
                <path
                  d={Array.from({ length: CYCLE_STEPS + 1 }, (_, i) => {
                    const y = 82 - (dnaAmount(i) - 0.5) * 38
                    return `${i ? 'L' : 'M'} ${(i / CYCLE_STEPS) * 196} ${y.toFixed(1)}`
                  }).join(' ')}
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3"
                  opacity="0.35"
                />
                <path
                  d={Array.from({ length: pos + 1 }, (_, i) => {
                    const y = 82 - (dnaAmount(i) - 0.5) * 38
                    return `${i ? 'L' : 'M'} ${(i / CYCLE_STEPS) * 196} ${y.toFixed(1)}`
                  }).join(' ')}
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3.5"
                />
                <circle cx={(pos / CYCLE_STEPS) * 196} cy={82 - (dna - 0.5) * 38} r="5" fill="#f97316" />
                <text x="98" y="102" fontSize="10.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                  DNA per cell, through one cycle
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
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {blocked
                  ? 'Repair the damage and the dial turns again. A cell that cannot repair itself is held here, or destroyed — it is not allowed to copy a fault into two new cells.'
                  : phase.note}
              </p>
            </div>

            <div>
              <label htmlFor="cd-pos" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Turn the dial — {pos} of {CYCLE_STEPS}
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
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Notice how much of the ring is interphase. Mitosis is the short red slice
                at the end.
              </p>
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
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Damage it, then try to turn the dial past G₂.
            </p>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 2
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
        {status}
      </p>
    </>
  )
}
