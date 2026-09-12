import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w16-l2 signature interactive — fertilisation as an addition you can get wrong.
//
// Two cells are loaded onto the bench and driven together. The chromosome
// total on screen is literally the sum of what the student picked, so putting
// a body cell in one of the slots produces 69 and the zygote is drawn as the
// failure it is, rather than being blocked with a message.
//
// A correct 23 + 23 keeps going on its own: the zygote starts cleaving, and
// the cell count climbs while the chromosome number stays at 46 — which is the
// thing students most often expect to double.

const W = 620
const H = 340
const CY = 150

const GAMETES = [
  { id: 'sperm', name: 'Sperm', n: 23, ploidy: 'n', tint: '#0E7490', note: 'A haploid male gamete — half a set, plus a tail and almost nothing else.' },
  { id: 'egg', name: 'Egg cell', n: 23, ploidy: 'n', tint: '#EA580C', note: 'A haploid female gamete — half a set, and all the cytoplasm the zygote will start with.' },
  { id: 'body', name: 'Body cell', n: 46, ploidy: '2n', tint: '#7C3AED', note: 'A diploid ordinary cell. It is not a gamete, and it never took part in meiosis.' },
]

const FUSE_TICKS = 18
const CLEAVE_EVERY = 26

const find = (id) => GAMETES.find((g) => g.id === id)

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

  const total = find(left).n + find(right).n
  const viable = total === 46

  // The run: the two cells close on each other, then a viable zygote starts
  // cleaving on its own and keeps going.
  useEffect(() => {
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
  }, [phase, viable])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 2) onSolved?.()
  }

  function fuse() {
    progRef.current = still ? 1 : 0
    ageRef.current = 0
    setProgress(progRef.current)
    setAge(0)
    setPhase(still ? 'done' : 'fusing')
    win(total === 46 ? 'correct' : 'error')
  }

  function reset() {
    progRef.current = 0
    ageRef.current = 0
    setProgress(0)
    setAge(0)
    setPhase('ready')
  }

  const p = progress
  const cells = viable && phase === 'done' ? 2 ** Math.min(3, Math.floor(age / CLEAVE_EVERY)) : 1
  const swim = Math.sin(tick * 0.5) * 5
  const lx = 128 + p * 150
  const rx = 492 - p * 150
  const fused = phase === 'done' && p >= 1

  const status =
    phase === 'ready'
      ? `${find(left).name} (${find(left).ploidy} = ${find(left).n}) + ${find(right).name} (${find(right).ploidy} = ${find(right).n}) — drive them together.`
      : !fused
        ? 'Closing…'
        : viable
          ? `Zygote, 2n = 46. Now cleaving on its own — ${cells} cell${cells > 1 ? 's' : ''}, still 46 chromosomes in every one.`
          : `${total} chromosomes. That is not a viable zygote — the set is wrong, and no amount of dividing fixes it.`

  function cellArt(g, x, y, scale) {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {g.id === 'sperm' && <path d={`M 22 0 q 22 ${swim} 44 ${-swim}`} fill="none" stroke="#44403c" strokeWidth="3.5" />}
        <circle r={g.id === 'sperm' ? 22 : g.id === 'egg' ? 40 : 30} fill="#FDE8D7" stroke={g.tint} strokeWidth="4" />
        {Array.from({ length: g.n === 46 ? 8 : 4 }, (_, i) => (
          <rect key={i} x={-14 + (i % 4) * 8} y={-10 + Math.floor(i / 4) * 12} width="4" height="12" rx="2" fill={g.tint} />
        ))}
      </g>
    )
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              <rect x="20" y="256" width="580" height="12" rx="6" fill="#57534e" />

              {!fused ? (
                <>
                  {cellArt(find(left), lx, CY, 1)}
                  {cellArt(find(right), rx, CY, 1)}
                  <text x={lx} y={CY + 76} fontSize="12" fontWeight="900" fill={find(left).tint} textAnchor="middle">
                    {find(left).ploidy} = {find(left).n}
                  </text>
                  <text x={rx} y={CY + 76} fontSize="12" fontWeight="900" fill={find(right).tint} textAnchor="middle">
                    {find(right).ploidy} = {find(right).n}
                  </text>
                  <text x="310" y="44" fontSize="15" fontWeight="900" fill="#78716c" textAnchor="middle">
                    {find(left).n} + {find(right).n} = {total}
                  </text>
                </>
              ) : (
                <g>
                  {Array.from({ length: cells }, (_, i) => {
                    const cols = cells > 2 ? 4 : cells
                    const r = cells === 1 ? 54 : cells === 2 ? 40 : 28
                    const x = 310 + (i - (cols - 1) / 2) * (r * 2 + 8)
                    return (
                      <g key={i}>
                        <circle cx={x} cy={CY} r={r} fill="#FDE8D7" stroke={viable ? '#B45309' : '#DC2626'} strokeWidth="4" strokeDasharray={viable ? undefined : '9 7'} />
                        {Array.from({ length: Math.min(10, Math.round(total / 5)) }, (_, k) => (
                          <rect
                            key={k}
                            x={x - r * 0.55 + (k % 5) * (r * 0.24)}
                            y={CY - r * 0.3 + Math.floor(k / 5) * (r * 0.34)}
                            width={r * 0.09}
                            height={r * 0.28}
                            rx="2"
                            fill={viable ? '#7C3AED' : '#DC2626'}
                          />
                        ))}
                      </g>
                    )
                  })}
                  <text x="310" y="44" fontSize="17" fontWeight="900" fill={viable ? '#0f766e' : '#DC2626'} textAnchor="middle">
                    2n = {total} {viable ? '' : '✗ not viable'}
                  </text>
                  {viable && (
                    <text x="310" y="242" fontSize="12" fontWeight="900" fill="#0f766e" textAnchor="middle">
                      {cells} cell{cells > 1 ? 's' : ''} · 46 chromosomes in each · the count never doubles again
                    </text>
                  )}
                  {!viable && (
                    <text x="310" y="242" fontSize="12" fontWeight="900" fill="#DC2626" textAnchor="middle">
                      a whole extra set of 23 — the instructions contradict each other
                    </text>
                  )}
                </g>
              )}

              <text x="310" y="300" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
                {phase === 'ready' ? 'bench ready' : fused ? (viable ? 'fertilisation complete' : 'fusion failed') : 'closing…'}
              </text>
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
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Fertilisation is addition. Meiosis is what makes the two halves add up to
                one set instead of two.
              </p>
            </div>

            {[
              ['Left slot', left, setLeft, 'fb-left'],
              ['Right slot', right, setRight, 'fb-right'],
            ].map(([label, value, setter, key]) => (
              <div key={key}>
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
              </div>
            ))}

            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
              {find(left).note}
            </p>

            <button
              type="button"
              onClick={phase === 'ready' ? fuse : reset}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              {phase === 'ready' ? `Drive them together — ${find(left).n} + ${find(right).n}` : 'Clear the bench'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['correct', 'Correct zygote formed — 23 + 23 = 46'],
                  ['error', 'Wrong pairing explored — the count comes out wrong'],
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
