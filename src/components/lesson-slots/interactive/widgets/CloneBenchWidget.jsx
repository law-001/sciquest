import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w17-l1 signature interactive — four ways to copy yourself, and the catch.
//
// Each method runs as a real animation on a real organism rather than as an
// arrow diagram: the bacterium elongates and constricts, the bud swells until
// it drops off, the broken starfish arm regrows the arms it is missing, the
// runner crawls out and roots.
//
// Every offspring that lands in the field below is drawn from the same trait
// value as its parent, because that is what a clone is. Then the disease
// sweeps, and it kills on that trait — so nothing in the field can be missed,
// and they all go down together. That is the cost the four methods share.

const W = 620
const H = 340
const RUN_TICKS = 22

const METHODS = [
  {
    id: 'fission',
    name: 'Binary fission',
    who: 'Bacterium',
    how: 'The single chromosome is copied, the cell stretches, and a wall closes across the middle. Twenty minutes, start to finish.',
  },
  {
    id: 'budding',
    name: 'Budding',
    who: 'Yeast / Hydra',
    how: 'A bulge grows on the parent, is given a copy of the nucleus, and pinches off — smaller than the parent but complete.',
  },
  {
    id: 'fragmentation',
    name: 'Fragmentation',
    who: 'Starfish',
    how: 'A piece breaks off and regrows everything it is missing. The parent regrows the piece too, so one becomes two.',
  },
  {
    id: 'vegetative',
    name: 'Vegetative propagation',
    who: 'Strawberry',
    how: 'A runner crawls out along the ground, puts down roots at its tip, and a new plant stands up — still joined to the parent at first.',
  },
]

const CLONE_TINT = '#15803D'
const DEAD_TINT = '#78716c'

function Scene({ id, p, tick }) {
  const sway = Math.sin(tick * 0.3) * 3

  if (id === 'fission') {
    const stretch = 46 + p * 52
    const pinch = Math.max(0, (p - 0.45) / 0.55)
    const gap = pinch * 26
    return (
      <g transform="translate(300 108)">
        {p < 0.92 ? (
          <>
            <rect x={-stretch / 2} y="-22" width={stretch} height="44" rx="22" fill="#9AD5CF" stroke="#0f766e" strokeWidth="3.5" />
            {pinch > 0 && (
              <>
                <path d={`M 0 -22 q ${gap * 0.5} 22 0 44`} fill="#FDF7EC" stroke="#0f766e" strokeWidth="3" />
                <path d={`M 0 -22 q ${-gap * 0.5} 22 0 44`} fill="#FDF7EC" stroke="#0f766e" strokeWidth="3" />
              </>
            )}
          </>
        ) : (
          [-1, 1].map((s) => (
            <rect key={s} x={s * 12 - (s > 0 ? 0 : 46)} y="-22" width="46" height="44" rx="22" fill="#9AD5CF" stroke="#0f766e" strokeWidth="3.5" />
          ))
        )}
        <text y="64" fontSize="12" fontWeight="800" fill="#0f766e" textAnchor="middle">
          {p >= 0.92 ? 'two identical cells' : p > 0.45 ? 'wall closing across the middle' : 'stretching'}
        </text>
      </g>
    )
  }

  if (id === 'budding') {
    const bud = p * 26
    const drop = Math.max(0, (p - 0.8) / 0.2)
    return (
      <g transform="translate(300 108)">
        <circle cx="-20" cy="0" r="38" fill="#FBD9A5" stroke="#B45309" strokeWidth="3.5" />
        <circle cx="-20" cy="0" r="12" fill="#7C3AED" opacity="0.75" />
        {bud > 1 && (
          <g transform={`translate(${22 + drop * 46} ${-drop * 16})`}>
            <circle r={bud} fill="#FBD9A5" stroke="#B45309" strokeWidth="3" />
            {bud > 12 && <circle r={bud * 0.32} fill="#7C3AED" opacity="0.75" />}
          </g>
        )}
        <text y="64" fontSize="12" fontWeight="800" fill="#B45309" textAnchor="middle">
          {drop > 0.5 ? 'bud released — a smaller copy' : bud > 12 ? 'nucleus copied into the bud' : 'bulge forming'}
        </text>
      </g>
    )
  }

  if (id === 'fragmentation') {
    const breakOff = Math.max(0, (p - 0.2) / 0.35)
    const regrow = Math.max(0, (p - 0.5) / 0.5)
    const arm = (cx, cy, a, len, tint) => (
      <path
        key={`${cx}-${a}`}
        d={`M ${cx} ${cy} L ${cx + Math.cos(a) * len} ${cy + Math.sin(a) * len}`}
        stroke={tint}
        strokeWidth="13"
        strokeLinecap="round"
      />
    )
    return (
      <g transform="translate(300 108)">
        <g transform="translate(-72 0)">
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2
            const gone = i === 0 && breakOff > 0
            return arm(0, 0, a, gone ? 34 * regrow : 34, gone ? '#FBBF24' : '#EA580C')
          })}
          <circle r="13" fill="#EA580C" />
        </g>
        <g transform={`translate(${52 + breakOff * 34} ${-breakOff * 10})`} opacity={breakOff}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2
            return arm(0, 0, a, i === 0 ? 34 : 34 * regrow, i === 0 ? '#EA580C' : '#FBBF24')
          })}
          <circle r={13 * Math.max(0.3, regrow)} fill="#EA580C" />
        </g>
        <text y="76" fontSize="12" fontWeight="800" fill="#EA580C" textAnchor="middle">
          {regrow > 0.9 ? 'two complete starfish' : breakOff > 0 ? 'both halves regrowing the arms they lack' : 'one arm about to break'}
        </text>
      </g>
    )
  }

  const runner = p * 128
  const root = Math.max(0, (p - 0.6) / 0.4)
  return (
    <g transform="translate(240 132)">
      <rect x="-190" y="26" width="420" height="26" fill="#8A6A4A" opacity="0.35" />
      <path d={`M 0 26 q 0 -30 ${-10 + sway} -46`} fill="none" stroke={CLONE_TINT} strokeWidth="6" />
      <ellipse cx={-14 + sway} cy="-26" rx="24" ry="14" fill={CLONE_TINT} />
      <ellipse cx={14 + sway} cy="-14" rx="20" ry="12" fill={CLONE_TINT} />
      <path d={`M 6 22 q ${runner * 0.5} 18 ${runner} 2`} fill="none" stroke={CLONE_TINT} strokeWidth="5" />
      {runner > 40 && (
        <g transform={`translate(${runner} 22)`}>
          <ellipse cx="0" cy={-18 * root} rx={20 * root} ry={12 * root} fill={CLONE_TINT} />
          <path d={`M 0 0 L -8 ${16 * root} M 0 0 L 0 ${20 * root} M 0 0 L 9 ${15 * root}`} stroke="#8A6A4A" strokeWidth="3" fill="none" />
        </g>
      )}
      <text x="30" y="88" fontSize="12" fontWeight="800" fill={CLONE_TINT} textAnchor="middle">
        {root > 0.8 ? 'a second plant, rooted and standing' : runner > 40 ? 'runner reaching, roots going down' : 'runner crawling out'}
      </text>
    </g>
  )
}

export default function CloneBenchWidget({ onSolved }) {
  const [method, setMethod] = useState('fission')
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState([])
  const [diseased, setDiseased] = useState(false)
  const [tick, setTick] = useState(0)

  const ranRef = useRef([])
  const progRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [still])

  const finish = useCallback(
    (id) => {
      if (ranRef.current.includes(id)) return
      ranRef.current = [...ranRef.current, id]
      setRan(ranRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      const next = Math.min(1, progRef.current + 1 / RUN_TICKS)
      progRef.current = next
      setProgress(next)
      if (next >= 1) {
        setRunning(false)
        finish(method)
      }
    }, 70)
    return () => clearInterval(id)
  }, [running, method, finish])

  function run() {
    setDiseased(false)
    if (still) {
      progRef.current = 1
      setProgress(1)
      finish(method)
      return
    }
    progRef.current = 0
    setProgress(0)
    setRunning(true)
  }

  function pick(id) {
    setMethod(id)
    progRef.current = 0
    setProgress(0)
    setRunning(false)
  }

  function sweep() {
    setDiseased(true)
    if (ranRef.current.length === METHODS.length) onSolved?.()
  }

  const active = METHODS.find((m) => m.id === method)
  const population = 2 + ran.length * 3
  const wave = ((tick * 0.05) % 1.6) * population

  const status = diseased
    ? `All ${population} organisms are dead. Every one of them had the same weakness, because every one of them has the same genes.`
    : progress >= 1
      ? `${active.name} complete — the offspring is genetically identical to its parent.`
      : running
        ? `${active.name} running…`
        : `${active.name} on a ${active.who.toLowerCase()}. Press run.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              <Scene id={method} p={still ? Math.max(progress, 1) : progress} tick={tick} />

              {/* ── The field of clones ── */}
              <line x1="20" y1="232" x2="600" y2="232" stroke="#a8a29e" strokeWidth="2" />
              <text x="26" y="252" fontSize="11" fontWeight="900" fill="#78716c">
                the field — {population} organisms, all genetically identical
              </text>
              {Array.from({ length: population }, (_, i) => {
                const x = 44 + i * ((532 / Math.max(1, population - 1)) || 0)
                const hit = diseased && i < wave + population
                return (
                  <g key={i} transform={`translate(${x} 292) ${hit ? 'rotate(84)' : ''}`}>
                    <circle r="14" fill={hit ? DEAD_TINT : CLONE_TINT} opacity={hit ? 0.5 : 1} />
                    <circle cx="-4.5" cy="-3" r="2.2" fill="#FDF7EC" />
                    <circle cx="4.5" cy="-3" r="2.2" fill="#FDF7EC" />
                    <path d={hit ? 'M -5 5 q 5 -5 10 0' : 'M -5 4 q 5 5 10 0'} stroke="#FDF7EC" strokeWidth="2" fill="none" />
                  </g>
                )
              })}
              {diseased && (
                <text x="310" y="326" fontSize="12" fontWeight="900" fill="#DC2626" textAnchor="middle">
                  one disease, no survivors — there was no variation for it to miss
                </text>
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                diseased
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{active.how}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Method — {ran.length} of {METHODS.length} run
              </p>
              <div className="space-y-1.5">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => pick(m.id)}
                    className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left transition-colors ${
                      ran.includes(m.id)
                        ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                        : method === m.id
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/25'
                          : 'border-stone-200 bg-white hover:border-primary-400 dark:border-stone-600 dark:bg-stone-800'
                    }`}
                  >
                    <span className="block text-xs font-black text-stone-900 dark:text-white">
                      {ran.includes(m.id) ? '✓ ' : ''}
                      {m.name}
                    </span>
                    <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                      {m.who}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={run}
              disabled={running}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              {running ? 'Running…' : `Run ${active.name.toLowerCase()}`}
            </button>

            <button
              type="button"
              onClick={sweep}
              disabled={ran.length === 0 || diseased}
              className="min-h-11 w-full rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition-colors disabled:opacity-50 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200"
            >
              {diseased ? 'Field wiped out' : 'Release the disease'}
            </button>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {ran.length < METHODS.length
                ? `Run all four methods first — ${METHODS.length - ran.length} to go — so there is a full field to sweep.`
                : 'The field is full. Now find out what identical costs you.'}
            </p>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {status} {ran.length} of {METHODS.length} methods run.
      </p>
    </>
  )
}
