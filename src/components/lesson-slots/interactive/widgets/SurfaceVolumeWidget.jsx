import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w14-l1 signature interactive — why a cell cannot just keep growing.
//
// Nutrients enter through the membrane and diffuse a fixed distance inward.
// That distance never changes, so the fed shell is always the same thickness
// and the starved core is whatever is left over. Grow the cell and the core
// grows faster than the shell, because volume goes as the cube of the radius
// and surface area only as the square.
//
// Every number here falls out of that: the fed percentage is one minus the
// cube of the core-to-cell radius ratio, and the surface-to-volume ratio is
// three over the radius. Dividing halves the volume, which is why each
// daughter comes out with a smaller core than its parent had.

const W = 620
const H = 340
const CX = 232
const CY = 168

const DEPTH = 20 // how far nutrients diffuse in, in micrometres
const R_MIN = 24
const R_MAX = 110
const STARVED_BELOW = 0.6

// Each daughter takes half the volume, so its radius is the parent's over the
// cube root of two.
const DAUGHTER = 1 / Math.cbrt(2)

const NUTRIENTS = Array.from({ length: 26 }, (_, i) => ({
  angle: (i / 26) * Math.PI * 2,
  phase: (i * 0.37) % 1,
}))

const coreOf = (r) => Math.max(0, r - DEPTH)
const fedOf = (r) => 1 - (coreOf(r) / r) ** 3

export default function SurfaceVolumeWidget({ onSolved }) {
  const [radius, setRadius] = useState(34)
  const [divided, setDivided] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])
  const winRef = useRef([])

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [still])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 2) onSolved?.()
  }

  function changeRadius(value) {
    setRadius(value)
    setDivided(false)
    if (fedOf(value) < STARVED_BELOW) win('starved')
  }

  function divide() {
    const next = Math.max(R_MIN, Math.round(radius * DAUGHTER))
    setRadius(next)
    setDivided(true)
    win('divided')
  }

  const r = radius
  const core = coreOf(r)
  const fed = fedOf(r)
  const area = 4 * Math.PI * r * r
  const volume = (4 / 3) * Math.PI * r ** 3
  const ratio = area / volume
  const starving = fed < STARVED_BELOW

  // After a division the radius state is already the daughter radius, so both
  // cells are drawn at r — only their horizontal offset differs.
  const offsets = divided ? [-r - 6, r + 6] : [0]

  const status = starving
    ? `Only ${Math.round(fed * 100)}% of the volume is being fed. The middle ${Math.round(core * 2)} µm across is starving.`
    : divided
      ? `Two daughters, each ${Math.round(fed * 100)}% fed. Halving the volume shrank the core.`
      : `${Math.round(fed * 100)}% of the volume is fed. Surface-to-volume ratio ${ratio.toFixed(3)} per µm.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              {offsets.map((dx) => (
                <g key={dx} transform={`translate(${dx} 0)`}>
                  <circle cx={CX} cy={CY} r={r} fill="#FDE8D7" stroke="#B45309" strokeWidth="4" />
                  {core > 1 && (
                    <circle cx={CX} cy={CY} r={core} fill={starving ? '#78716c' : '#D6CCB8'} opacity={starving ? 0.85 : 0.55} />
                  )}

                  {/* Nutrients enter at the rim and stop at the diffusion depth. */}
                  {NUTRIENTS.map((n, i) => {
                    const p = still ? 0.5 : ((tick * 0.02 + n.phase) % 1 + 1) % 1
                    const rr = r - p * Math.min(DEPTH, r)
                    return (
                      <circle
                        key={i}
                        cx={CX + Math.cos(n.angle) * rr}
                        cy={CY + Math.sin(n.angle) * rr}
                        r="3.2"
                        fill="#3BAFA9"
                        opacity={1 - p * 0.55}
                      />
                    )
                  })}

                  {core > 14 && (
                    <text x={CX} y={CY + 5} fontSize="12" fontWeight="900" fill={starving ? '#FFFFFF' : '#78716c'} textAnchor="middle">
                      {starving ? 'starving' : 'core'}
                    </text>
                  )}
                </g>
              ))}

              {/* Diffusion depth, drawn as the measurement it is. */}
              <line x1={CX + core} y1={CY - r - 14} x2={CX + r} y2={CY - r - 14} stroke="#0f766e" strokeWidth="2.5" />
              <text x={CX + (core + r) / 2} y={CY - r - 20} fontSize="11" fontWeight="900" fill="#0f766e" textAnchor="middle">
                {DEPTH} µm fed shell
              </text>

              {/* ── Readouts, all measured off the cell on the left ── */}
              <g transform="translate(404 54)">
                <rect x="0" y="0" width="188" height="228" rx="14" fill="#FFFFFF" stroke="#78716c" strokeWidth="2.5" />
                {[
                  ['radius', `${r} µm`],
                  ['surface area', `${Math.round(area).toLocaleString()} µm²`],
                  ['volume', `${Math.round(volume).toLocaleString()} µm³`],
                  ['SA ÷ V', `${ratio.toFixed(3)} / µm`],
                  ['fed', `${Math.round(fed * 100)}%`],
                ].map(([label, value], i) => (
                  <g key={label}>
                    <text x="16" y={34 + i * 40} fontSize="11" fontWeight="800" fill="#78716c">
                      {label}
                    </text>
                    <text x="172" y={34 + i * 40} fontSize="14" fontWeight="900" fill={label === 'fed' && starving ? '#DC2626' : '#1c1917'} textAnchor="end">
                      {value}
                    </text>
                  </g>
                ))}
                {/* The fed bar is the same number, drawn. */}
                <rect x="16" y="196" width="156" height="14" rx="7" fill="#E7E0D2" />
                <rect x="16" y="196" width={156 * fed} height="14" rx="7" fill={starving ? '#DC2626' : '#3BAFA9'} />
              </g>

              <text x={CX} y="320" fontSize="13" fontWeight="900" fill={starving ? '#DC2626' : '#0f766e'} textAnchor="middle">
                {divided ? 'two daughter cells' : starving ? 'centre starving' : 'whole cell fed'}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                starving
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                The fed shell is always {DEPTH} µm thick — diffusion cannot reach further.
                Growing the cell does not thicken it.
              </p>
            </div>

            <div>
              <label htmlFor="sv-radius" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Grow the cell — radius {radius} µm
              </label>
              <input
                id="sv-radius"
                type="range"
                min={R_MIN}
                max={R_MAX}
                step={1}
                value={radius}
                onChange={(e) => changeRadius(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Watch the two numbers race: double the radius and the surface goes up four
                times, the volume eight.
              </p>
            </div>

            <button
              type="button"
              onClick={divide}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              Divide — two cells, half the volume each
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['starved', 'Grown until the centre starves'],
                  ['divided', 'Divided, and the core shrank'],
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
