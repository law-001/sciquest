import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w12-l2 signature interactive: a cell with the production line running.
//
// The organelles are not labels on a diagram. They are stations on one line:
// the nucleus issues the instruction, the ribosome builds the chain, the Golgi
// packages it, the membrane lets the vesicle out, and the mitochondria pay for
// all of it. Every travelling dot on screen belongs to one leg of that line.
//
// Switch a station off and the legs downstream of it simply stop carrying
// anything, which is the whole point. Nothing announces that the Golgi has
// failed; the vesicles just stop arriving at the membrane.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The fluid outside the cell runs past the viewBox so a cropped edge never
// shows a seam. Nothing readable goes in this margin.
const BLEED = 60

const CX = 300
const CY = 196
const RX = 292
const RY = 182

const NUCLEUS = [178, 168]
const RIBO = [312, 104]
const GOLGI = [408, 244]
const EXIT = [560, 196]

const INK = '#44403c'
const INK_MID = '#78716c'

const ORGANELLES = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    short: 'nucleus',
    does: 'Holds the DNA and sends out the working copy for one protein.',
    breaks: 'No instruction leaves, so the ribosomes have nothing to build from.',
  },
  {
    id: 'ribosome',
    name: 'Ribosomes',
    short: 'ribosomes',
    does: 'Read the instruction and join amino acids into a protein chain.',
    breaks: 'Instructions pile up. No chain is built, so the Golgi packs nothing.',
  },
  {
    id: 'golgi',
    name: 'Golgi apparatus',
    short: 'Golgi',
    does: 'Folds and packs the chain into a vesicle addressed to the membrane.',
    breaks: 'Chains are still made, but no vesicle ever reaches the membrane.',
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    short: 'mitochondria',
    does: 'Release energy from glucose as ATP. Every other station spends it.',
    breaks: 'The line has no power. Every stage stops at once, not one by one.',
  },
  {
    id: 'membrane',
    name: 'Cell membrane',
    short: 'membrane',
    does: 'Decides what comes in and what goes out, and holds the cytoplasm in.',
    breaks: 'The boundary is gone, so cytoplasm leaks straight out of the cell.',
  },
]

const byId = (id) => ORGANELLES.find((o) => o.id === id)

// Faint grain in the cytoplasm, so the inside of the cell is not a flat fill.
const CYTO = Array.from({ length: 34 }, (_, i) => [
  46 + ((i * 71) % 508),
  58 + ((i * 97) % 280),
])

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function Travellers({ from, to, count, tick, speed, colour, radius, running }) {
  if (!running) return null
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = ((tick * speed + i / count) % 1 + 1) % 1
        const [x, y] = lerp(from, to, t)
        return <circle key={i} cx={x} cy={y} r={radius} fill={colour} stroke={INK} strokeWidth="1" />
      })}
    </g>
  )
}

// The phospholipid bilayer, drawn as heads on two rings rather than one line,
// because the double layer is the thing the lesson keeps calling a bilayer.
function Bilayer({ intact }) {
  const heads = 64
  return (
    <g>
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX}
        ry={RY}
        fill="none"
        stroke={intact ? '#0f766e' : '#DC2626'}
        strokeWidth="3"
        strokeDasharray={intact ? undefined : '12 14'}
      />
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX - 13}
        ry={RY - 13}
        fill="none"
        stroke={intact ? '#0f766e' : '#DC2626'}
        strokeWidth="3"
        strokeDasharray={intact ? undefined : '12 14'}
      />
      {intact &&
        Array.from({ length: heads }, (_, i) => {
          const a = (i / heads) * Math.PI * 2
          const cos = Math.cos(a)
          const sin = Math.sin(a)
          return (
            <g key={i}>
              <circle cx={CX + cos * RX} cy={CY + sin * RY} r="3.4" fill="#0f766e" />
              <circle cx={CX + cos * (RX - 13)} cy={CY + sin * (RY - 13)} r="3.4" fill="#0f766e" />
            </g>
          )
        })}
      {/* Channel proteins sunk through both layers. */}
      {intact &&
        [0.18, 0.5, 0.82, 1.18, 1.5, 1.82].map((k) => {
          const a = k * Math.PI
          const cos = Math.cos(a)
          const sin = Math.sin(a)
          return (
            <rect
              key={k}
              x={CX + cos * (RX - 6.5) - 7}
              y={CY + sin * (RY - 6.5) - 11}
              width="14"
              height="22"
              rx="6"
              fill="#115E59"
              opacity="0.85"
            />
          )
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

  const stopped = !powered
    ? byId('mitochondria')
    : !on.nucleus
      ? byId('nucleus')
      : !on.ribosome
        ? byId('ribosome')
        : !on.golgi
          ? byId('golgi')
          : !on.membrane
            ? byId('membrane')
            : null

  const pulse = powered ? 1 + Math.sin(tick * 0.22) * 0.09 : 1
  const caption = stopped
    ? `${stopped.name} is off. ${rate} proteins leave per minute.`
    : `Everything running. ${rate} proteins leave per minute.`

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={caption}
              style={stageFill(W, H)}
            >
              {/* Fluid outside the cell, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#E3EEF2" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={i}
                  cx={-30 + ((i * 131) % 690)}
                  cy={-20 + ((i * 83) % 430)}
                  r="7"
                  fill="#CBDFE6"
                />
              ))}

              {/* Cytoplasm. */}
              <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#FDF7EC" />
              {CYTO.map(([gx, gy], i) => (
                <circle key={i} cx={gx} cy={gy} r="2" fill="#E7E0D2" />
              ))}

              <g opacity={on.membrane ? 1 : 0.45}>
                <Bilayer intact={on.membrane} />
              </g>

              {/* Molecules at the boundary: some bounce, one slips through. */}
              {[0, 1, 2].map((i) => {
                const t = ((tick * 0.012 + i / 3) % 1 + 1) % 1
                const pass = i === 1 && on.membrane
                const leak = !on.membrane
                const x = leak ? 30 + t * 580 : pass ? 22 + t * 96 : 22 + Math.sin(t * Math.PI) * 70
                return <circle key={i} cx={x} cy={148 + i * 46} r="5" fill={leak ? '#DC2626' : '#F59E0B'} />
              })}

              {/* Nucleus: envelope, pores, nucleolus, chromatin. */}
              <g opacity={on.nucleus ? 1 : 0.3}>
                <circle cx={NUCLEUS[0]} cy={NUCLEUS[1]} r="52" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="3.5" />
                <circle cx={NUCLEUS[0]} cy={NUCLEUS[1]} r="45" fill="none" stroke="#5B21B6" strokeWidth="1.6" opacity="0.7" />
                {Array.from({ length: 10 }, (_, i) => {
                  const a = (i / 10) * Math.PI * 2
                  return (
                    <circle
                      key={i}
                      cx={NUCLEUS[0] + Math.cos(a) * 48.5}
                      cy={NUCLEUS[1] + Math.sin(a) * 48.5}
                      r="4"
                      fill="#FDF7EC"
                      stroke="#5B21B6"
                      strokeWidth="1.6"
                    />
                  )
                })}
                <path
                  d="M -30 8 q 14 -20 28 -4 q 12 14 26 -8 M -22 -20 q 16 12 32 -2"
                  transform={`translate(${NUCLEUS[0]} ${NUCLEUS[1]})`}
                  fill="none"
                  stroke="#6D28D9"
                  strokeWidth="2.4"
                  opacity="0.75"
                />
                <circle cx={NUCLEUS[0] + 10} cy={NUCLEUS[1] - 8} r="16" fill="#5B21B6" />
                <text x={NUCLEUS[0]} y={NUCLEUS[1] + 74} fontSize="12" fontWeight="900" fill="#5B21B6" textAnchor="middle">
                  nucleus{on.nucleus ? '' : ' (off)'}
                </text>
              </g>

              {/* Rough ER: folded sheets, studded with ribosomes. */}
              <g opacity={on.ribosome ? 1 : 0.3}>
                {[0, 1, 2].map((i) => (
                  <path
                    key={i}
                    d={`M ${236 + i * 6} ${96 + i * 15} q 40 -26 80 -6 q 26 13 56 2`}
                    fill="none"
                    stroke="#B45309"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity={0.85 - i * 0.12}
                  />
                ))}
                {Array.from({ length: 16 }, (_, i) => (
                  <circle
                    key={i}
                    cx={242 + (i % 8) * 17}
                    cy={80 + Math.floor(i / 8) * 34 + (i % 3) * 5}
                    r="4.2"
                    fill="#92400E"
                  />
                ))}
                <text x={RIBO[0]} y="52" fontSize="12" fontWeight="900" fill="#B45309" textAnchor="middle">
                  ribosomes{on.ribosome ? '' : ' (off)'}
                </text>
              </g>

              {/* Golgi: a stack of cisternae with vesicles budding off the rim. */}
              <g opacity={on.golgi ? 1 : 0.3}>
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={i}
                    d={`M ${372 + i * 5} ${222 + i * 13} q 36 -15 72 0`}
                    fill="none"
                    stroke="#0E7490"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <circle key={i} cx={462 + i * 5} cy={218 + i * 17} r="6" fill="#67E8F9" stroke="#0E7490" strokeWidth="2" />
                ))}
                <text x={GOLGI[0]} y="300" fontSize="12" fontWeight="900" fill="#0E7490" textAnchor="middle">
                  Golgi{on.golgi ? '' : ' (off)'}
                </text>
              </g>

              {/* Mitochondria: outer membrane, inner membrane, cristae. */}
              <g opacity={on.mitochondria ? 1 : 0.3}>
                {[[146, 296], [470, 122]].map(([mx, my]) => (
                  <g key={mx} transform={`translate(${mx} ${my}) scale(${pulse})`}>
                    <ellipse rx="42" ry="23" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="3" />
                    <ellipse rx="34" ry="15" fill="none" stroke="#B91C1C" strokeWidth="1.6" opacity="0.6" />
                    <path
                      d="M -28 -14 q 10 14 0 28 M -12 -16 q 10 16 0 32 M 4 -16 q 10 16 0 32 M 20 -14 q 10 14 0 28"
                      fill="none"
                      stroke="#B91C1C"
                      strokeWidth="2.4"
                    />
                  </g>
                ))}
                <text x="146" y="264" fontSize="12" fontWeight="900" fill="#B91C1C" textAnchor="middle">
                  mitochondria{on.mitochondria ? '' : ' (off)'}
                </text>
                {powered &&
                  [0, 1, 2, 3].map((i) => {
                    const t = ((tick * 0.014 + i / 4) % 1 + 1) % 1
                    const [x, y] = lerp([146, 296], [300, 200], t)
                    return <circle key={i} cx={x} cy={y} r="3.4" fill="#F59E0B" opacity={0.85 - t * 0.5} />
                  })}
              </g>

              {/* The production line. */}
              <Travellers from={NUCLEUS} to={RIBO} count={4} tick={tick} speed={0.011} colour="#A78BFA" radius={4.6} running={legMrna} />
              <Travellers from={RIBO} to={GOLGI} count={4} tick={tick} speed={0.009} colour="#FBBF24" radius={5.4} running={legChain} />
              <Travellers from={GOLGI} to={EXIT} count={3} tick={tick} speed={0.008} colour="#67E8F9" radius={7.4} running={legVesicle} />
              <Travellers from={EXIT} to={[640, 158]} count={2} tick={tick} speed={0.016} colour="#5EEAD4" radius={5.4} running={legExport} />

              {/* Live readout plate, inside the picture. */}
              <rect x="202" y="310" width="196" height="56" rx="8" fill="#fff7ed" stroke={INK_MID} strokeWidth="2" />
              <text x="216" y="330" fontSize="8.5" fontWeight="800" fill={INK_MID}>
                PROTEINS OUT PER MINUTE
              </text>
              <text x="216" y="356" fontSize="19" fontWeight="900" fill={stopped ? '#DC2626' : '#0f766e'}>
                {rate}
              </text>
              <text
                x="384"
                y="356"
                fontSize="10"
                fontWeight="900"
                fill={stopped ? '#DC2626' : '#0f766e'}
                textAnchor="end"
              >
                {stopped ? `stops at the ${stopped.short}` : 'line running'}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                stopped
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{caption}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {stopped
                  ? stopped.breaks
                  : 'Instruction, chain, package, vesicle, out through the membrane.'}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Switched off: {switched.length} of {ORGANELLES.length}
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
                        {o.name}: {live ? 'running' : 'off'}
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
              Watch which dots vanish, then switch it back on.
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
