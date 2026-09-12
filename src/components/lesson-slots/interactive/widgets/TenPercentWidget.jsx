import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w19-l1 signature interactive — the pyramid draws itself out of the losses.
//
// A thousand units of energy enter the producers. Each time the student sends
// energy up a level, ninety per cent of the dots peel off sideways as heat and
// drift away, and a tenth climb. The tier widths are the cube root of the
// surviving fraction, so the pyramid shape is a consequence of the arithmetic
// rather than a picture drawn to look like one.
//
// Nutrients take the other road. One carbon atom leaves a dead snake, goes
// through a decomposer into the soil and back up into the grass — a closed
// circle, running beside an energy flow that is one-way and finished.

const W = 620
const H = 340

const START_UNITS = 1000
const TIERS = [
  { name: 'Producers', who: 'grass', tint: '#15803D' },
  { name: 'Primary consumers', who: 'grasshoppers', tint: '#84CC16' },
  { name: 'Secondary consumers', who: 'frogs', tint: '#0E7490' },
  { name: 'Tertiary consumers', who: 'snakes', tint: '#B45309' },
]

const unitsAt = (i) => START_UNITS / 10 ** i

// Cube root keeps the top tier visible while still shrinking hard — a linear
// width would make the 1-unit tier a single pixel.
const widthAt = (i) => 250 * Math.cbrt(unitsAt(i) / START_UNITS)

const STEPS = [
  { id: 'dead', label: 'dead snake', tint: '#B45309' },
  { id: 'decomposer', label: 'decomposer', tint: '#7C3AED' },
  { id: 'soil', label: 'soil minerals', tint: '#8A6A4A' },
  { id: 'producer', label: 'grass', tint: '#15803D' },
]

const LOOP_CX = 486
const LOOP_CY = 162
const LOOP_R = 80
const ATOM_TICKS = 44

const loopPoint = (t) => {
  const a = t * Math.PI * 2 - Math.PI / 2
  return [LOOP_CX + Math.cos(a) * LOOP_R, LOOP_CY + Math.sin(a) * LOOP_R]
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
  const lost = level === 0 ? 0 : unitsAt(level - 1) - units
  const atomStep = atom === null ? -1 : Math.min(STEPS.length - 1, Math.floor(atom * STEPS.length))
  const [ax, ay] = atom === null ? [0, 0] : loopPoint(atom)

  const status =
    atom !== null && atom < 1
      ? `Following one carbon atom — now in the ${STEPS[atomStep].label}.`
      : level === TIERS.length - 1
        ? `Top of the pyramid: ${units} unit of the original ${START_UNITS} is left. The other ${START_UNITS - units} left as heat.`
        : `${TIERS[level].name} hold ${units} units. Send it up and ninety per cent goes as heat.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              {/* ── Energy pyramid ── */}
              <text x="160" y="30" fontSize="12" fontWeight="900" fill="#78716c" textAnchor="middle">
                energy — one way, and it runs out
              </text>
              {TIERS.map((t, i) => {
                const reached = i <= level
                const w = widthAt(i)
                const y = 258 - i * 52
                return (
                  <g key={t.name} opacity={reached ? 1 : 0.22}>
                    <rect x={160 - w / 2} y={y} width={w} height="44" rx="8" fill={t.tint} stroke="#1c1917" strokeWidth="2" />
                    <text x={160} y={y + 20} fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
                      {unitsAt(i)} units
                    </text>
                    <text x={160} y={y + 36} fontSize="9.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
                      {t.who}
                    </text>
                    {/* Heat leaving this tier — the ninety per cent. */}
                    {reached && i > 0 &&
                      [0, 1, 2, 3].map((k) => {
                        const p = still ? 0.5 : ((tick * 0.03 + k / 4) % 1 + 1) % 1
                        return (
                          <circle
                            key={k}
                            cx={160 + w / 2 + 14 + p * 62}
                            cy={y + 30 - p * 34}
                            r={4 - p * 2}
                            fill="#F59E0B"
                            opacity={1 - p}
                          />
                        )
                      })}
                    {reached && i > 0 && (
                      <text x={160 + w / 2 + 62} y={y + 8} fontSize="9.5" fontWeight="900" fill="#B45309" textAnchor="middle">
                        heat
                      </text>
                    )}
                  </g>
                )
              })}
              <text x="160" y="322" fontSize="11.5" fontWeight="900" fill="#B45309" textAnchor="middle">
                {level === 0 ? `${START_UNITS} units entered` : `${START_UNITS - units} units lost as heat so far`}
              </text>

              {/* ── Nutrient cycle ── */}
              <text x={LOOP_CX} y="30" fontSize="12" fontWeight="900" fill="#78716c" textAnchor="middle">
                nutrients — the same atoms, round and round
              </text>
              <circle cx={LOOP_CX} cy={LOOP_CY} r={LOOP_R} fill="none" stroke="#a8a29e" strokeWidth="3" strokeDasharray="8 7" />
              {STEPS.map((s, i) => {
                const [x, y] = loopPoint(i / STEPS.length)
                const here = atomStep === i
                return (
                  <g key={s.id}>
                    <circle cx={x} cy={y} r={here ? 20 : 16} fill={s.tint} stroke="#1c1917" strokeWidth="2.5" />
                    <text
                      x={x}
                      y={y + (i === 2 ? 38 : i === 0 ? -26 : 5)}
                      fontSize="10.5"
                      fontWeight="900"
                      fill={here ? '#1c1917' : '#78716c'}
                      textAnchor="middle"
                    >
                      {i === 1 || i === 3 ? '' : s.label}
                    </text>
                    {(i === 1 || i === 3) && (
                      <text x={x + (i === 1 ? 34 : -34)} y={y + 4} fontSize="10.5" fontWeight="900" fill={here ? '#1c1917' : '#78716c'} textAnchor={i === 1 ? 'start' : 'end'}>
                        {s.label}
                      </text>
                    )}
                  </g>
                )
              })}
              {/* Direction of travel, so the loop is not just a dotted circle. */}
              {[0.12, 0.37, 0.62, 0.87].map((t) => {
                const [x, y] = loopPoint(t)
                const a = t * 360
                return <path key={t} d={`M ${x} ${y} l -5 -8 l 10 0 Z`} transform={`rotate(${a} ${x} ${y})`} fill="#a8a29e" />
              })}
              {atom !== null && (
                <g>
                  <circle cx={ax} cy={ay} r="8" fill="#FACC15" stroke="#1c1917" strokeWidth="2.5" />
                  <text x={ax} y={ay + 3.5} fontSize="8" fontWeight="900" fill="#1c1917" textAnchor="middle">
                    C
                  </text>
                </g>
              )}
              <text x={LOOP_CX} y="290" fontSize="11.5" fontWeight="900" fill={atom >= 1 ? '#0f766e' : '#78716c'} textAnchor="middle">
                {atom === null
                  ? 'one carbon atom, waiting'
                  : atom >= 1
                    ? 'full circle — the same atom is back in the grass'
                    : `${Math.round(atom * 100)}% round`}
              </text>
              <text x={LOOP_CX} y="310" fontSize="10.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                nothing was lost here — only moved
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {level === 0
                  ? 'Ninety per cent of what an organism eats is spent moving, breathing and staying warm. Only what is left can be eaten by the next level.'
                  : `This step alone lost ${lost} units — more than everything above it will ever hold.`}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Energy — level {level + 1} of {TIERS.length}
              </p>
              <button
                type="button"
                onClick={sendUp}
                disabled={level >= TIERS.length - 1}
                className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                {level >= TIERS.length - 1 ? 'Top of the pyramid reached' : `Send energy up to the ${TIERS[level + 1].who}`}
              </button>
              <button
                type="button"
                onClick={() => setLevel(0)}
                disabled={level === 0}
                className="mt-1.5 min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
              >
                Start again with {START_UNITS} units
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Nutrients
              </p>
              <button
                type="button"
                onClick={followAtom}
                disabled={atom !== null && atom < 1}
                className="min-h-11 w-full rounded-xl bg-secondary-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-secondary-700 disabled:opacity-60"
              >
                {atom === null ? 'Follow one carbon atom' : atom >= 1 ? 'Send it round again' : 'Travelling…'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                Watch the two pictures together. The pyramid empties and cannot be
                refilled from above. The circle never empties at all.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['top', 'Energy traced to the top of the pyramid'],
                  ['atom', 'One nutrient atom followed full circle'],
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
