import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w17-l1 signature interactive: four ways to copy yourself, and the catch.
//
// Each method runs as a real animation on a real organism rather than as an
// arrow diagram. The bacterium copies its DNA loop and closes a wall across
// itself, the yeast bud swells until it drops, the broken starfish arm regrows
// what it is missing, the runner crawls out and roots.
//
// Every organism that lands in the field below is drawn from the same picture
// as its parent, because that is what a clone is. Then the disease sweeps, and
// it kills on the one weakness they all share, so nothing in the field can be
// missed. That is the cost the four methods have in common.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The background runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in that margin.
const BLEED = 60

// `slice` can crop about 60 units off whichever axis is long, so every label
// sits between x 60 and x 560 and between y 40 and y 352.
const SCENE_X = 310
const SCENE_Y = 128
const FIELD_Y = 312
const RUN_TICKS = 22
const SWEEP_TICKS = 16

const BG = '#E8EDEF'
const BENCH = '#D9E2E6'
const INK = '#44403c'
const INK_MID = '#6B6259'

const TEAL = '#0F766E'
const TEAL_FILL = '#9AD5CF'
const AMBER = '#B45309'
const AMBER_FILL = '#FBD9A5'
const ORANGE = '#C2410C'
const ORANGE_FILL = '#FB923C'
const LEAF = '#15803D'
const LEAF_LIGHT = '#4ADE80'
const SOIL = '#8A6A4A'
const SOIL_DARK = '#6B5138'
const DNA = '#6D28D9'
const CLONE_TINT = '#15803D'
const DEAD_TINT = '#78716C'
const PAPER = '#FDF7EC'

const METHODS = [
  {
    id: 'fission',
    name: 'Binary fission',
    who: 'Bacterium',
    watch: 'Watch the wall close across the middle.',
  },
  {
    id: 'budding',
    name: 'Budding',
    who: 'Yeast',
    watch: 'Watch the bud swell, then drop off.',
  },
  {
    id: 'fragmentation',
    name: 'Fragmentation',
    who: 'Starfish',
    watch: 'Watch both halves regrow the arms they lack.',
  },
  {
    id: 'vegetative',
    name: 'Vegetative propagation',
    who: 'Strawberry',
    watch: 'Watch the runner root and stand a plant up.',
  },
]

const clamp01 = (n) => Math.max(0, Math.min(1, n))
const seg = (p, a, b) => clamp01((p - a) / (b - a))

function Caption({ y, tint, children }) {
  return (
    <text y={y} fontSize="12.5" fontWeight="900" fill={tint} textAnchor="middle">
      {children}
    </text>
  )
}

function PartLabel({ x, y, drop, children }) {
  return (
    <g>
      <line x1={x} y1={y + 4} x2={x} y2={y + 4 + drop} stroke={INK_MID} strokeWidth="1.4" />
      <text x={x} y={y} fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        {children}
      </text>
    </g>
  )
}

// ── Binary fission: one rod cell, one DNA loop, one wall closing ──
function FissionScene({ p }) {
  const Lx = 54 + seg(p, 0, 0.5) * 40
  const copy = seg(p, 0.12, 0.45)
  const septum = seg(p, 0.5, 0.9)
  const done = p >= 0.95
  const waist = 36 - 33 * septum
  const shoulder = Math.max(22, Lx - 28)
  const loopX = copy * (Lx - 28)

  const body =
    `M ${-Lx} 0 Q ${-Lx} -36 ${-shoulder} -36 Q -16 -36 0 ${-waist}` +
    ` Q 16 -36 ${shoulder} -36 Q ${Lx} -36 ${Lx} 0 Q ${Lx} 36 ${shoulder} 36` +
    ` Q 16 36 0 ${waist} Q -16 36 ${-shoulder} 36 Q ${-Lx} 36 ${-Lx} 0 Z`

  const flagella = (dir) => (
    <path
      d={`M ${dir * Lx} -8 q ${dir * 20} -10 ${dir * 34} 2 q ${dir * 14} 12 ${dir * 30} 4
          M ${dir * Lx} 10 q ${dir * 18} 12 ${dir * 32} 2`}
      fill="none"
      stroke={TEAL}
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.75"
    />
  )

  const caption =
    p < 0.12 ? 'one DNA loop' : p < 0.5 ? 'DNA copied' : p < 0.95 ? 'wall closing' : 'two identical cells'

  return (
    <g>
      {flagella(-1)}
      {flagella(1)}

      {done ? (
        <>
          <rect x={-Lx - 11} y="-36" width={Lx} height="72" rx="36" fill={TEAL_FILL} stroke={TEAL} strokeWidth="4.5" />
          <rect x="11" y="-36" width={Lx} height="72" rx="36" fill={TEAL_FILL} stroke={TEAL} strokeWidth="4.5" />
        </>
      ) : (
        <>
          <path d={body} fill={TEAL_FILL} stroke={TEAL} strokeWidth="4.5" strokeLinejoin="round" />
          <path d={body} fill="none" stroke={PAPER} strokeWidth="1.6" opacity="0.8" transform="scale(0.9)" />
        </>
      )}

      {/* Ribosomes, so the cell reads as full of working parts. */}
      {[
        [-0.62, -0.5],
        [0.58, 0.46],
        [-0.38, 0.58],
        [0.34, -0.58],
        [-0.78, 0.26],
        [0.76, -0.22],
      ].map(([fx, fy]) => (
        <circle key={`r${fx}`} cx={fx * (Lx - 14)} cy={fy * 22} r="2.6" fill={TEAL} opacity="0.55" />
      ))}

      {/* Both loops are drawn from the start; at copy 0 they sit on top of each
          other, which is exactly the before picture. */}
      {[-1, 1].map((s) => (
        <ellipse
          key={s}
          cx={s * loopX}
          cy="0"
          rx="19"
          ry="12"
          fill="none"
          stroke={DNA}
          strokeWidth="4"
        />
      ))}

      <PartLabel x={-loopX} y={-60} drop={12}>
        DNA loop
      </PartLabel>
      <Caption y={88} tint={TEAL}>
        {caption}
      </Caption>
    </g>
  )
}

// ── Budding: a bulge on the parent that takes a copy of the nucleus ──
function BuddingScene({ p }) {
  const budR = 5 + seg(p, 0.05, 0.8) * 27
  const moved = seg(p, 0.35, 0.72)
  const drop = seg(p, 0.84, 1)
  const budX = 52 + drop * 52
  const budY = -drop * 20
  const neck = 1 - seg(p, 0.72, 0.92)

  const caption =
    p < 0.3 ? 'bulge forming' : p < 0.72 ? 'nucleus copied in' : p < 0.95 ? 'neck pinching shut' : 'a smaller copy'

  return (
    <g>
      {/* Parent yeast cell: wall, cytoplasm, vacuole, nucleus, old bud scars. */}
      <circle cx="-40" cy="0" r="48" fill={AMBER_FILL} stroke={AMBER} strokeWidth="4.5" />
      <circle cx="-40" cy="0" r="41" fill="none" stroke={PAPER} strokeWidth="1.8" opacity="0.8" />
      <circle cx="-56" cy="16" r="16" fill={PAPER} opacity="0.7" />
      <circle cx={-40 + moved * 14} cy="0" r="13" fill={DNA} opacity="0.8" />
      {[
        [-72, -28],
        [-64, 32],
      ].map(([sx, sy]) => (
        <circle key={sx} cx={sx} cy={sy} r="5" fill="none" stroke={AMBER} strokeWidth="2" opacity="0.6" />
      ))}

      {/* Neck joining bud to parent, until it pinches shut. */}
      {budR > 7 && neck > 0 && (
        <rect
          x="2"
          y={-9 * neck}
          width="52"
          height={18 * neck}
          fill={AMBER_FILL}
          stroke={AMBER}
          strokeWidth="3"
        />
      )}

      <g transform={`translate(${budX} ${budY})`}>
        <circle r={budR} fill={AMBER_FILL} stroke={AMBER} strokeWidth="3.5" />
        {budR > 14 && <circle r={budR * 0.34} fill={DNA} opacity={0.8 * moved} />}
      </g>

      <PartLabel x={budX} y={budY - budR - 16} drop={10}>
        bud
      </PartLabel>
      <PartLabel x={-40} y={-74} drop={12}>
        parent
      </PartLabel>
      <Caption y={88} tint={AMBER}>
        {caption}
      </Caption>
    </g>
  )
}

// ── Fragmentation: an arm leaves with a piece of the disc, both regrow ──
function FragmentScene({ p }) {
  const breakOff = seg(p, 0.18, 0.48)
  const regrow = seg(p, 0.5, 1)

  const armPath = (a, len) => {
    const px = Math.cos(a + Math.PI / 2)
    const py = Math.sin(a + Math.PI / 2)
    const bx = Math.cos(a) * 8
    const by = Math.sin(a) * 8
    const tx = Math.cos(a) * len
    const ty = Math.sin(a) * len
    return (
      `M ${bx + px * 16} ${by + py * 16} L ${tx + px * 4.5} ${ty + py * 4.5}` +
      ` Q ${tx + Math.cos(a) * 8} ${ty + Math.sin(a) * 8} ${tx - px * 4.5} ${ty - py * 4.5}` +
      ` L ${bx - px * 16} ${by - py * 16} Z`
    )
  }

  const star = (lengths, discR) => (
    <>
      {lengths.map((len, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return (
          <g key={a}>
            <path d={armPath(a, Math.max(10, len))} fill={ORANGE_FILL} stroke={ORANGE} strokeWidth="2.6" />
            {/* Tube feet along the underside of each arm. */}
            {[0.45, 0.68, 0.86].map((f) => (
              <circle
                key={f}
                cx={Math.cos(a) * len * f}
                cy={Math.sin(a) * len * f}
                r="2.4"
                fill={ORANGE}
                opacity="0.6"
              />
            ))}
          </g>
        )
      })}
      <circle r={discR} fill={ORANGE_FILL} stroke={ORANGE} strokeWidth="3" />
      <circle cx={discR * 0.4} cy={-discR * 0.35} r="3.6" fill={ORANGE} opacity="0.8" />
    </>
  )

  const parentArms = [42 * regrow, 46, 46, 46, 46]
  const pieceArms = [46, 46 * regrow, 46 * regrow, 46 * regrow, 46 * regrow]

  const caption =
    p < 0.18
      ? 'one arm breaking'
      : p < 0.5
        ? 'arm keeps a disc piece'
        : p < 0.95
          ? 'both halves regrowing'
          : 'two whole starfish'

  return (
    <g>
      <g transform="translate(-84 4)">{star(parentArms, 21)}</g>
      <g
        transform={`translate(${70 + breakOff * 46} ${4 - breakOff * 14}) rotate(${breakOff * 26})`}
        opacity={Math.max(0.15, breakOff)}
      >
        {star(pieceArms, 21 * Math.max(0.38, regrow))}
      </g>

      <PartLabel x={70 + breakOff * 46} y={-72} drop={14}>
        broken piece
      </PartLabel>
      <Caption y={96} tint={ORANGE}>
        {caption}
      </Caption>
    </g>
  )
}

// ── Vegetative propagation: a runner walks a second plant out ──
function VegetativeScene({ p }) {
  const reach = seg(p, 0, 0.62) * 232
  const root = seg(p, 0.6, 1)
  const sway = Math.sin(p * 14) * 2.5

  const leaflet = (cx, cy, scale, tilt) => (
    <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy}) rotate(${tilt}) scale(${scale})`}>
      <ellipse cx="0" cy="-17" rx="12" ry="9" fill={LEAF} />
      <ellipse cx="-14" cy="-6" rx="11" ry="8" fill={LEAF_LIGHT} />
      <ellipse cx="14" cy="-6" rx="11" ry="8" fill={LEAF_LIGHT} />
      <path
        d="M 0 2 L 0 -15 M 0 -3 L -11 -7 M 0 -3 L 11 -7"
        fill="none"
        stroke={LEAF}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  )

  const roots = (scale) => (
    <path
      d={`M 0 0 q -5 ${16 * scale} -15 ${24 * scale} M 0 0 L 0 ${28 * scale} M 0 0 q 6 ${15 * scale} 16 ${22 * scale}`}
      fill="none"
      stroke={SOIL_DARK}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  )

  return (
    <g>
      {/* Soil bleeds well past the viewBox on both sides. */}
      <rect x="-400" y="42" width="800" height="200" fill={SOIL} opacity="0.45" />
      <rect x="-400" y="42" width="800" height="6" fill={SOIL_DARK} opacity="0.5" />
      {[-250, -170, -90, 10, 90, 170, 250].map((sx) => (
        <circle key={sx} cx={sx} cy={62 + (sx % 3) * 6} r="2.6" fill={SOIL_DARK} opacity="0.4" />
      ))}

      {/* Parent plant. */}
      <g transform="translate(-150 42)">
        <path d={`M 0 0 q ${sway} -18 ${sway * 2} -24`} fill="none" stroke={LEAF} strokeWidth="5" />
        {leaflet(sway * 2 - 18, -26, 1, -18)}
        {leaflet(sway * 2 + 20, -32, 0.9, 16)}
        <g transform="translate(0 4)">{roots(1)}</g>
      </g>

      {/* The runner, and the daughter plant standing up at its tip. */}
      <path
        d={`M -144 40 q ${reach * 0.5} 22 ${reach} 2`}
        fill="none"
        stroke={LEAF}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {reach > 70 && (
        <g transform={`translate(${-144 + reach} 42)`}>
          <path d={`M 0 0 q ${sway} ${-16 * root} ${sway * 2} ${-22 * root}`} fill="none" stroke={LEAF} strokeWidth="5" />
          {leaflet(sway * 2 - 16, -24 * root, root, -16)}
          {leaflet(sway * 2 + 18, -30 * root, 0.9 * root, 14)}
          <g transform="translate(0 4)">{roots(root)}</g>
        </g>
      )}

      <PartLabel x={-144 + reach * 0.5} y={12} drop={22}>
        runner
      </PartLabel>
      <Caption y={126} tint={LEAF}>
        {p < 0.35
          ? 'runner crawling out'
          : p < 0.6
            ? 'runner reaching soil'
            : p < 0.95
              ? 'roots going down'
              : 'a second plant'}
      </Caption>
    </g>
  )
}

const SCENES = {
  fission: FissionScene,
  budding: BuddingScene,
  fragmentation: FragmentScene,
  vegetative: VegetativeScene,
}

export default function CloneBenchWidget({ onSolved }) {
  const [method, setMethod] = useState('fission')
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState([])
  const [sweep, setSweep] = useState(0)
  const [sweeping, setSweeping] = useState(false)

  const ranRef = useRef([])
  const progRef = useRef(0)
  const sweepRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  const finish = useCallback((id) => {
    if (ranRef.current.includes(id)) return
    ranRef.current = [...ranRef.current, id]
    setRan(ranRef.current)
  }, [])

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

  useEffect(() => {
    if (!sweeping) return undefined
    const id = setInterval(() => {
      const next = Math.min(1, sweepRef.current + 1 / SWEEP_TICKS)
      sweepRef.current = next
      setSweep(next)
      if (next >= 1) setSweeping(false)
    }, 70)
    return () => clearInterval(id)
  }, [sweeping])

  function clearSweep() {
    sweepRef.current = 0
    setSweep(0)
    setSweeping(false)
  }

  function run() {
    clearSweep()
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

  function release() {
    onSolved?.()
    if (still) {
      sweepRef.current = 1
      setSweep(1)
      return
    }
    sweepRef.current = 0
    setSweep(0)
    setSweeping(true)
  }

  const active = METHODS.find((m) => m.id === method)
  const Scene = SCENES[method]
  const allRun = ran.length === METHODS.length
  const population = 2 + ran.length * 3
  const dead = Math.round(sweep * population)

  const status = sweep > 0
    ? `${dead} of ${population} dead. They all share one weakness.`
    : progress >= 1
      ? `${active.name} done. The new one is an exact copy.`
      : running
        ? `${active.name} running.`
        : `${active.name} on a ${active.who.toLowerCase()}. Press Run.`

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
              {/* Background, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BG} />
              <rect x={-BLEED} y="248" width={W + BLEED * 2} height={H + BLEED - 248} fill={BENCH} />

              <text x={SCENE_X} y="42" fontSize="12.5" fontWeight="900" fill={INK} textAnchor="middle">
                {active.who}
              </text>

              <g transform={`translate(${SCENE_X} ${SCENE_Y})`}>
                <Scene p={progress} />
              </g>

              {/* ── The field of clones ── */}
              <line x1="20" y1="248" x2="600" y2="248" stroke="#A8A29E" strokeWidth="2" />
              <text x="60" y="270" fontSize="11.5" fontWeight="900" fill={INK_MID}>
                {sweep > 0
                  ? `${dead} of ${population} dead`
                  : `${population} clones, all identical`}
              </text>

              {Array.from({ length: population }, (_, i) => {
                const x = 60 + i * ((496 / Math.max(1, population - 1)) || 0)
                const hit = i < dead
                return (
                  <g key={i} transform={`translate(${x} ${FIELD_Y}) ${hit ? 'rotate(84)' : ''}`}>
                    <circle r="14" fill={hit ? DEAD_TINT : CLONE_TINT} opacity={hit ? 0.55 : 1} />
                    {hit ? (
                      <path
                        d="M -7 -6 l 5 5 M -2 -6 l -5 5 M 2 -6 l 5 5 M 7 -6 l -5 5"
                        stroke={PAPER}
                        strokeWidth="2"
                        fill="none"
                      />
                    ) : (
                      <>
                        <circle cx="-4.5" cy="-3" r="2.2" fill={PAPER} />
                        <circle cx="4.5" cy="-3" r="2.2" fill={PAPER} />
                      </>
                    )}
                    <path
                      d={hit ? 'M -5 5 q 5 -5 10 0' : 'M -5 4 q 5 5 10 0'}
                      stroke={PAPER}
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>
                )
              })}

              {sweep >= 1 && (
                <text x={SCENE_X} y="350" fontSize="12.5" fontWeight="900" fill="#DC2626" textAnchor="middle">
                  one disease, no survivors
                </text>
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                sweep > 0
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{active.watch}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Method: {ran.length} of {METHODS.length} run
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
              {running ? 'Running' : `Run ${active.name.toLowerCase()}`}
            </button>

            <button
              type="button"
              onClick={release}
              disabled={!allRun || sweep > 0}
              className="min-h-11 w-full rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition-colors disabled:opacity-50 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200"
            >
              {sweep > 0 ? 'Field wiped out' : 'Release the disease'}
            </button>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {allRun
                ? 'The field is full. Now release the disease.'
                : `Run all four methods first. ${METHODS.length - ran.length} to go.`}
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
