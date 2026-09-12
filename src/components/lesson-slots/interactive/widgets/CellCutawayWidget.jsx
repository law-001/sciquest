import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w12-l2 signature interactive — a cell with the production line running.
//
// The organelles are not labels on a diagram. They are stations on one line:
// the nucleus issues the instruction, the ribosome builds the chain, the Golgi
// packages it, the membrane lets the vesicle out, and the mitochondria pay for
// all of it. Every travelling dot on screen belongs to one leg of that line.
//
// Switch a station off and the legs downstream of it simply stop carrying
// anything — which is the whole point. Nothing announces "the Golgi has
// failed"; the vesicles just stop arriving at the membrane.

const W = 620
const H = 340

const NUCLEUS = [186, 152]
const RIBO = [306, 108]
const GOLGI = [404, 212]
const EXIT = [532, 168]

const ORGANELLES = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    does: 'Holds the DNA and sends out the working copy — the instruction for one protein.',
    breaks: 'No instruction leaves. The ribosomes have nothing to build from, so the whole line downstream goes quiet.',
  },
  {
    id: 'ribosome',
    name: 'Ribosomes',
    does: 'Read the instruction and assemble amino acids into a protein chain.',
    breaks: 'Instructions arrive and pile up. No chain is ever built, so the Golgi has nothing to package.',
  },
  {
    id: 'golgi',
    name: 'Golgi apparatus',
    does: 'Folds, finishes and packs the chain into a vesicle addressed to the membrane.',
    breaks: 'Chains are still made but nothing gets wrapped, so no vesicle ever reaches the membrane.',
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    does: 'Release energy from glucose as ATP. Every other station spends it.',
    breaks: 'The line has no power. Every stage stops at once, not one after another.',
  },
  {
    id: 'membrane',
    name: 'Cell membrane',
    does: 'Decides what comes in and what goes out, and holds the cytoplasm in.',
    breaks: 'The boundary is gone. Cytoplasm leaks away and nothing can be kept at the right concentration.',
  },
]

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function Travellers({ from, to, count, tick, speed, colour, radius, running }) {
  if (!running) return null
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = ((tick * speed + i / count) % 1 + 1) % 1
        const [x, y] = lerp(from, to, t)
        return <circle key={i} cx={x} cy={y} r={radius} fill={colour} />
      })}
    </g>
  )
}

export default function CellCutawayWidget({ onSolved }) {
  const [on, setOn] = useState({
    nucleus: true,
    ribosome: true,
    golgi: true,
    mitochondria: true,
    membrane: true,
  })
  const [tick, setTick] = useState(0)
  const [switched, setSwitched] = useState([])
  const switchedRef = useRef([])

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 60)
    return () => clearInterval(id)
  }, [])

  function toggle(id) {
    const next = { ...on, [id]: !on[id] }
    setOn(next)
    if (next[id] || switchedRef.current.includes(id)) return
    switchedRef.current = [...switchedRef.current, id]
    setSwitched(switchedRef.current)
    if (switchedRef.current.length === ORGANELLES.length) onSolved?.()
  }

  const powered = on.mitochondria
  const legMrna = powered && on.nucleus
  const legChain = legMrna && on.ribosome
  const legVesicle = legChain && on.golgi
  const legExport = legVesicle && on.membrane
  const rate = legExport ? 24 : 0

  const firstStop = !powered
    ? 'Mitochondria'
    : !on.nucleus
      ? 'Nucleus'
      : !on.ribosome
        ? 'Ribosomes'
        : !on.golgi
          ? 'Golgi apparatus'
          : !on.membrane
            ? 'Cell membrane'
            : null

  const pulse = powered ? 1 + Math.sin(tick * 0.22) * 0.09 : 1
  const caption = firstStop
    ? `${firstStop} is off — ${rate} proteins exported per minute.`
    : `Everything running — ${rate} proteins exported per minute.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption} style={STAGE_MEDIA}>
              {/* ── Cell membrane ── */}
              <ellipse
                cx="300"
                cy="170"
                rx="268"
                ry="148"
                fill="#FDF7EC"
                stroke={on.membrane ? '#0f766e' : '#DC2626'}
                strokeWidth="6"
                strokeDasharray={on.membrane ? undefined : '10 12'}
              />
              {on.membrane &&
                [-1, 1].map((s) =>
                  [0, 1, 2].map((i) => (
                    <rect key={`${s}-${i}`} x={296 + s * 240 - 7} y={120 + i * 44} width="14" height="26" rx="6" fill="#0f766e" opacity="0.8" />
                  )),
                )}

              {/* Molecules at the boundary: some bounce, one slips through. */}
              {[0, 1, 2].map((i) => {
                const t = ((tick * 0.012 + i / 3) % 1 + 1) % 1
                const pass = i === 1 && on.membrane
                const leak = !on.membrane
                const x = leak ? 40 + t * 560 : pass ? 20 + t * 90 : 20 + Math.sin(t * Math.PI) * 66
                return <circle key={i} cx={x} cy={130 + i * 42} r="5" fill={leak ? '#DC2626' : '#F59E0B'} />
              })}

              {/* ── Nucleus ── */}
              <g opacity={on.nucleus ? 1 : 0.3}>
                <circle cx={NUCLEUS[0]} cy={NUCLEUS[1]} r="46" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="3.5" />
                <circle cx={NUCLEUS[0] + 8} cy={NUCLEUS[1] - 6} r="15" fill="#5B21B6" />
                <text x={NUCLEUS[0]} y={NUCLEUS[1] + 66} fontSize="11" fontWeight="900" fill="#5B21B6" textAnchor="middle">
                  nucleus {on.nucleus ? '' : '— off'}
                </text>
              </g>

              {/* ── Ribosomes on rough ER ── */}
              <g opacity={on.ribosome ? 1 : 0.3}>
                <path d="M 262 92 q 44 -22 88 6 q -44 24 -88 -6 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle key={i} cx={272 + i * 18} cy={88 + (i % 2) * 12} r="4.6" fill="#B45309" />
                ))}
                <text x={RIBO[0]} y="58" fontSize="11" fontWeight="900" fill="#B45309" textAnchor="middle">
                  ribosomes {on.ribosome ? '' : '— off'}
                </text>
              </g>

              {/* ── Golgi ── */}
              <g opacity={on.golgi ? 1 : 0.3}>
                {[0, 1, 2].map((i) => (
                  <path key={i} d={`M ${370 + i * 5} ${198 + i * 11} q 34 -13 68 0`} fill="none" stroke="#0E7490" strokeWidth="7" strokeLinecap="round" />
                ))}
                <text x={GOLGI[0]} y="262" fontSize="11" fontWeight="900" fill="#0E7490" textAnchor="middle">
                  Golgi {on.golgi ? '' : '— off'}
                </text>
              </g>

              {/* ── Mitochondria ── */}
              <g opacity={on.mitochondria ? 1 : 0.3}>
                {[[164, 256], [452, 96]].map(([mx, my]) => (
                  <g key={mx} transform={`translate(${mx} ${my}) scale(${pulse})`}>
                    <ellipse rx="34" ry="18" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="3" />
                    <path d="M -24 0 q 8 -11 16 0 q 8 11 16 0 q 8 -11 14 0" fill="none" stroke="#B91C1C" strokeWidth="2.6" />
                  </g>
                ))}
                <text x="164" y="290" fontSize="11" fontWeight="900" fill="#B91C1C" textAnchor="middle">
                  mitochondrion {on.mitochondria ? '— pulsing' : '— off'}
                </text>
              </g>

              {/* ── The production line ── */}
              <Travellers from={NUCLEUS} to={RIBO} count={4} tick={tick} speed={0.011} colour="#7C3AED" radius={4.4} running={legMrna} />
              <Travellers from={RIBO} to={GOLGI} count={4} tick={tick} speed={0.009} colour="#B45309" radius={5.2} running={legChain} />
              <Travellers from={GOLGI} to={EXIT} count={3} tick={tick} speed={0.008} colour="#0E7490" radius={7} running={legVesicle} />
              <Travellers from={EXIT} to={[600, 150]} count={2} tick={tick} speed={0.016} colour="#0f766e" radius={5} running={legExport} />

              <text x="300" y="330" fontSize="13" fontWeight="900" fill={firstStop ? '#DC2626' : '#0f766e'} textAnchor="middle">
                {rate} proteins exported per minute
                {firstStop ? ` — line stops at the ${firstStop.toLowerCase()}` : ''}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                firstStop
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{caption}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {firstStop
                  ? ORGANELLES.find((o) => o.name === firstStop).breaks
                  : 'Instruction out of the nucleus, chain built at the ribosome, packed at the Golgi, vesicle through the membrane.'}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Switch an organelle off — {switched.length} of {ORGANELLES.length} tried
              </p>
              <div className="space-y-1.5">
                {ORGANELLES.map((o) => {
                  const live = on[o.id]
                  const tried = switched.includes(o.id)
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle(o.id)}
                      aria-pressed={!live}
                      className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left transition-colors ${
                        !live
                          ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                          : tried
                            ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                            : 'border-stone-200 bg-white hover:border-primary-400 dark:border-stone-600 dark:bg-stone-800'
                      }`}
                    >
                      <span className="block text-xs font-black text-stone-900 dark:text-white">
                        {tried ? '✓ ' : ''}
                        {o.name} — {live ? 'running' : 'switched off'}
                      </span>
                      <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                        {live ? o.does : o.breaks}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Switch one off, watch which dots disappear, then switch it back on. The
              stations upstream of the broken one keep working — that is how you can tell
              what depends on what.
            </p>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {caption} {switched.length} of {ORGANELLES.length} organelles switched off at least
        once.
      </p>
    </>
  )
}
