import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w14-l1 signature interactive: why a cell cannot just keep growing.
//
// Nutrients enter through the membrane and diffuse a fixed distance inward.
// That distance never changes, so the fed shell is always the same thickness
// and the starved core is whatever is left over. Grow the cell and the core
// grows faster than the shell, because volume goes as the cube of the radius
// and surface area only as the square.
//
// Every number falls out of that: the fed fraction is one minus the cube of
// the core-to-cell radius ratio, and the surface-to-volume ratio is three over
// the radius. Dividing halves the volume, which is why each daughter comes out
// with a smaller core than its parent had.
//
// The drawing has to carry that on its own, so the nutrient dots stop dead at
// the inner edge of the shell and pile up there, the mitochondria inside the
// core grey out when nothing reaches them, and the growth graph plots both
// curves against the same baseline so volume is visibly the one running away.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The fluid outside the cell runs past the viewBox so a cropped edge never
// shows a seam. Nothing readable goes in that margin.
const BLEED = 60

// Everything a student has to read lives between x 60 and x 560. The stage
// column is wide but rarely as wide as 16:10, so `slice` crops up to about 60
// units off each side; only the fluid may sit outside that band.
const CX = 200
const CY = 196

const DEPTH = 20 // how far nutrients diffuse in, in micrometres
const R_MIN = 34
const R_MAX = 100
// Micrometres to SVG units. Chosen so the two daughters still fit side by side
// inside the readable band at the largest radius the slider allows.
const SCALE = 0.83
const STARVED_BELOW = 0.6

// Each daughter takes half the volume, so its radius is the parent's over the
// cube root of two.
const DAUGHTER = 1 / Math.cbrt(2)

const FLUID = '#E6EFF2'
const INK = '#44403c'
const INK_MID = '#6B6259'
const TEAL = '#0f766e'
const NUTRIENT = '#3BAFA9'
const ORANGE = '#C2410C'

// The instrument card on the right of the readable band.
const CARD_X = 352
const CARD_Y = 40
const CARD_W = 204
const CARD_H = 310

const GX = 370
const GY = 88
const GW = 168
const GH = 100

const coreOf = (r) => Math.max(0, r - DEPTH)
const fedOf = (r) => 1 - (coreOf(r) / r) ** 3

// Nutrients drifting in the fluid outside the cell. They sit behind the cell,
// so any that land under it are simply covered.
const DRIFT = Array.from({ length: 34 }, (_, i) => ({
  x: 6 + ((i * 97) % 336),
  y: 14 + ((i * 131) % 362),
  phase: (i * 0.29) % 1,
}))

// Nutrients crossing the membrane, one per angle around the rim.
const ENTERING = Array.from({ length: 26 }, (_, i) => ({
  angle: (i / 26) * Math.PI * 2,
  phase: (i * 0.37) % 1,
}))

// Both curves are measured against the smallest cell rather than against their
// own maximum, so they share one scale and volume is visibly the runaway.
const GROWTH_MAX = (R_MAX / R_MIN) ** 3
const growthAt = (r, power) => (r / R_MIN) ** power / GROWTH_MAX

function curve(power) {
  return Array.from({ length: 25 }, (_, i) => {
    const r = R_MIN + ((R_MAX - R_MIN) * i) / 24
    const x = GX + (GW * i) / 24
    const y = GY + GH - growthAt(r, power) * GH
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
}

const AREA_CURVE = curve(2)
const VOLUME_CURVE = curve(3)

function Mitochondrion({ x, y, angle, dim }) {
  const body = dim ? '#C9BDB8' : '#FCA5A5'
  const line = dim ? '#8A7B74' : '#B91C1C'
  return (
    <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
      <ellipse rx="11" ry="5.5" fill={body} stroke={line} strokeWidth="1.6" />
      <path d="M -6 -1.6 q 3 5 6 0 q 3 -5 6 0" fill="none" stroke={line} strokeWidth="1.2" />
    </g>
  )
}

function Nucleus({ x, y, r, starving }) {
  const body = starving ? '#A79FAE' : '#C4B5FD'
  const line = starving ? '#6E6678' : '#6D28D9'
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={body} stroke={line} strokeWidth="2.4" />
      <circle cx={x} cy={y} r={Math.max(1, r - 3.4)} fill="none" stroke={line} strokeWidth="1" opacity="0.45" />
      <circle cx={x - r * 0.26} cy={y - r * 0.22} r={r * 0.3} fill={line} opacity="0.7" />
      <path
        d={`M ${x - r * 0.55} ${y + r * 0.3} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q ${r * 0.3} ${r * 0.3} ${r * 0.5} ${-r * 0.1}`}
        fill="none"
        stroke={line}
        strokeWidth="1.6"
        opacity="0.55"
      />
    </g>
  )
}

// One cell, drawn from its radius alone. `dx` shifts it sideways so the same
// component draws the parent and each daughter.
function CellBody({ dx, rs, cores, starving, phase }) {
  const shell = (rs + cores) / 2
  const nucR = Math.max(9, Math.min(30, cores > 12 ? cores * 0.55 : rs * 0.3))
  const shellMitos = rs > 46 ? [0.5, 1.9, 3.5, 4.9] : [0.9, 3.9]
  const coreMitos = cores > 30 ? [2.5, 5.6] : []

  return (
    <g transform={`translate(${dx} 0)`}>
      {/* Cytoplasm, then the fed shell washed over it, then the core on top. */}
      <circle cx={CX} cy={CY} r={rs} fill="#FDE8D7" />
      <circle cx={CX} cy={CY} r={rs} fill="#7BC9CF" opacity="0.38" />
      {cores > 1 && (
        <circle
          cx={CX}
          cy={CY}
          r={cores}
          fill={starving ? '#6B6259' : '#EFE3CE'}
          opacity={starving ? 0.92 : 1}
        />
      )}

      {/* Nutrients pile up at the inner edge of the shell and go no further. */}
      {cores > 6 &&
        Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2 + 0.12
          return (
            <circle
              key={`stack-${i}`}
              cx={CX + Math.cos(a) * (cores + 3.4)}
              cy={CY + Math.sin(a) * (cores + 3.4)}
              r="2.6"
              fill={NUTRIENT}
              opacity="0.75"
            />
          )
        })}

      {shellMitos.map((a) => (
        <Mitochondrion
          key={`sm-${a}`}
          x={CX + Math.cos(a) * shell}
          y={CY + Math.sin(a) * shell}
          angle={a + Math.PI / 2}
          dim={false}
        />
      ))}
      {coreMitos.map((a) => (
        <Mitochondrion
          key={`cm-${a}`}
          x={CX + Math.cos(a) * (cores * 0.62)}
          y={CY + Math.sin(a) * (cores * 0.62)}
          angle={a + Math.PI / 2}
          dim={starving}
        />
      ))}

      <Nucleus
        x={CX - rs * 0.1}
        y={CY - rs * 0.08}
        r={nucR}
        starving={starving && cores > nucR}
      />

      {/* Nutrients crossing the membrane. */}
      {ENTERING.map((n, i) => {
        const p = (((phase + n.phase) % 1) + 1) % 1
        const travel = rs - cores
        const rr = rs + 5 - p * (travel + 5)
        return (
          <circle
            key={`in-${i}`}
            cx={CX + Math.cos(n.angle) * rr}
            cy={CY + Math.sin(n.angle) * rr}
            r="3.2"
            fill={NUTRIENT}
            opacity={0.95 - p * 0.35}
          />
        )
      })}

      {/* Membrane last, so nothing is drawn over the boundary. */}
      <circle cx={CX} cy={CY} r={rs} fill="none" stroke="#B45309" strokeWidth="4.5" />
      <circle cx={CX} cy={CY} r={Math.max(1, rs - 4.4)} fill="none" stroke="#B45309" strokeWidth="1.5" opacity="0.4" />

      {cores > 26 && (
        <text
          x={CX}
          y={CY + cores * 0.62}
          fontSize="13"
          fontWeight="900"
          fill={starving ? '#FFFFFF' : INK_MID}
          textAnchor="middle"
        >
          {starving ? 'starving core' : 'core'}
        </text>
      )}
    </g>
  )
}

export default function SurfaceVolumeWidget({ onSolved }) {
  const [radius, setRadius] = useState(40)
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
  const pct = Math.round(fed * 100)
  const area = 4 * Math.PI * r * r
  const volume = (4 / 3) * Math.PI * r ** 3
  const ratio = area / volume
  const starving = fed < STARVED_BELOW

  const rs = r * SCALE
  const cores = core * SCALE
  const phase = still ? 0.5 : (tick * 0.02) % 1

  // After a division the radius state is already the daughter radius, so both
  // cells are drawn at rs and only their horizontal offset differs.
  const offsets = divided ? [-rs - 4, rs + 4] : [0]

  const markX = GX + GW * ((r - R_MIN) / (R_MAX - R_MIN))
  const areaY = GY + GH - growthAt(r, 2) * GH
  const volY = GY + GH - growthAt(r, 3) * GH

  const status = starving
    ? `Only ${pct}% of the inside is fed. The middle ${Math.round(core * 2)} µm across is starving.`
    : divided
      ? `Two cells, each ${pct}% fed. Halving the volume shrank the core.`
      : `${pct}% of the inside is fed.`

  const hint = starving
    ? 'Now press Divide and watch the core shrink.'
    : divided
      ? 'Grow it again to starve a bigger cell.'
      : 'Keep growing. The fed shell stays 20 µm thick.'

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={status}
              style={stageFill(W, H)}
            >
              {/* Fluid around the cell, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={FLUID} />

              {DRIFT.map((d, i) => {
                const wob = still ? 0 : Math.sin(tick * 0.05 + d.phase * 6.28)
                return (
                  <circle
                    key={`d-${i}`}
                    cx={d.x + wob * 3}
                    cy={d.y + wob * 4}
                    r="3"
                    fill={NUTRIENT}
                    opacity="0.45"
                  />
                )
              })}

              {offsets.map((dx) => (
                <CellBody
                  key={dx}
                  dx={dx}
                  rs={rs}
                  cores={cores}
                  starving={starving}
                  phase={phase}
                />
              ))}

              {/* The fed shell, drawn as the measurement it is. */}
              {!divided && (
                <g>
                  <line x1={CX + cores} y1={CY - rs - 16} x2={CX + rs} y2={CY - rs - 16} stroke={TEAL} strokeWidth="2.5" />
                  <line x1={CX + cores} y1={CY - rs - 21} x2={CX + cores} y2={CY - rs - 11} stroke={TEAL} strokeWidth="2.5" />
                  <line x1={CX + rs} y1={CY - rs - 21} x2={CX + rs} y2={CY - rs - 11} stroke={TEAL} strokeWidth="2.5" />
                  <text x={CX + (cores + rs) / 2} y={CY - rs - 26} fontSize="12.5" fontWeight="900" fill={TEAL} textAnchor="middle">
                    fed shell 20 µm
                  </text>
                </g>
              )}

              <text
                x={CX}
                y="344"
                fontSize="14"
                fontWeight="900"
                fill={starving ? '#B91C1C' : TEAL}
                textAnchor="middle"
              >
                {divided ? 'two daughter cells' : starving ? 'centre starving' : 'whole cell fed'}
              </text>

              {/* ── Instrument card ── */}
              <rect x={CARD_X} y={CARD_Y} width={CARD_W} height={CARD_H} rx="16" fill="#FFFFFF" opacity="0.86" stroke="#B9C7CC" strokeWidth="2" />

              <text x={GX} y="68" fontSize="12.5" fontWeight="900" fill={INK}>
                growth race
              </text>

              <line x1={GX} y1={GY + GH} x2={GX + GW} y2={GY + GH} stroke={INK_MID} strokeWidth="2" />
              <line x1={GX} y1={GY} x2={GX} y2={GY + GH} stroke={INK_MID} strokeWidth="2" />
              <path d={AREA_CURVE} fill="none" stroke={TEAL} strokeWidth="3" />
              <path d={VOLUME_CURVE} fill="none" stroke={ORANGE} strokeWidth="3" />
              <line x1={markX} y1={GY} x2={markX} y2={GY + GH} stroke={INK_MID} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx={markX} cy={areaY} r="4.5" fill={TEAL} />
              <circle cx={markX} cy={volY} r="4.5" fill={ORANGE} />
              <text x={GX + GW - 2} y={GY + 12} fontSize="11.5" fontWeight="900" fill={ORANGE} textAnchor="end">
                volume
              </text>
              <text x={GX + GW - 2} y={GY + GH - 12} fontSize="11.5" fontWeight="900" fill={TEAL} textAnchor="end">
                surface
              </text>
              <text x={GX + GW / 2} y={GY + GH + 18} fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
                radius
              </text>

              <text x={GX} y="240" fontSize="11.5" fontWeight="900" fill={INK}>
                volume fed
              </text>
              <text x={GX + GW} y="240" fontSize="13" fontWeight="900" fill={starving ? '#B91C1C' : TEAL} textAnchor="end">
                {pct}%
              </text>
              <rect x={GX} y="248" width={GW} height="16" rx="8" fill="#DCD3C4" />
              <rect x={GX} y="248" width={GW * fed} height="16" rx="8" fill={starving ? '#DC2626' : NUTRIENT} />

              <circle cx={GX + 7} cy="292" r="5" fill={NUTRIENT} />
              <text x={GX + 22} y="296" fontSize="11.5" fontWeight="800" fill={INK}>
                nutrient
              </text>
              <rect x={GX + 2} y="309" width="11" height="11" rx="2.5" fill="#6B6259" />
              <text x={GX + 22} y="319" fontSize="11.5" fontWeight="800" fill={INK}>
                starved core
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
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{hint}</p>
            </div>

            <div>
              <label
                htmlFor="sv-radius"
                className="mb-1 flex items-baseline justify-between gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                <span>Cell radius</span>
                <span className="text-sm text-stone-900 dark:text-white">{radius} µm</span>
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
            </div>

            <button
              type="button"
              onClick={divide}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              Divide the cell
            </button>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl border-2 border-stone-200 bg-white/70 p-3 dark:border-stone-600 dark:bg-stone-800/70">
              {[
                ['Surface', `${Math.round(area).toLocaleString()} µm²`],
                ['Volume', `${Math.round(volume).toLocaleString()} µm³`],
                ['Surface ÷ volume', `${ratio.toFixed(3)} per µm`],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt className="text-xs font-bold text-stone-500 dark:text-stone-400">{label}</dt>
                  <dd className="text-right text-xs font-black text-stone-900 dark:text-white">{value}</dd>
                </React.Fragment>
              ))}
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of 2
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
