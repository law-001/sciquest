import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L1 signature interactive — four working models on one bench.
//
// Each of the four kinds of scientific model is built here as the thing itself
// and left running: a bridge that flexes under a truck, an atom with orbiting
// electrons, a graph that plots itself, a hurricane tracking up a coast. The
// student picks one and watches it do its job, which is the only way "what is
// this kind of model FOR" lands without a paragraph explaining it.
//
// A single clock tick drives every scene; each scene is pure SVG drawn from it.

const W = 620
const H = 300

const MODELS = [
  {
    id: 'physical',
    label: 'Physical model',
    tag: 'A small copy you can build and break',
    job: 'Will this bridge hold a loaded truck?',
    reads: 'The deck sags under the load and springs back. Engineers add weight until it fails — on the model, not on the real bridge.',
  },
  {
    id: 'conceptual',
    label: 'Conceptual model',
    tag: 'A picture of an idea nobody can see',
    job: 'What is inside an atom?',
    reads: 'Nothing here is drawn to scale, and it is not meant to be. It carries the idea: a heavy nucleus with light electrons in shells around it.',
  },
  {
    id: 'mathematical',
    label: 'Mathematical model',
    tag: 'A formula that gives you a number',
    job: 'How many fish will be in the lake in ten years?',
    reads: 'The curve is the formula being calculated year by year. Feed it this year and it hands you a number for any year you ask for.',
  },
  {
    id: 'simulation',
    label: 'Simulation model',
    tag: 'A computer running the world forward',
    job: 'Where will this hurricane be in three days?',
    reads: 'The computer steps the storm forward hour by hour. The widening cone is the forecast getting less certain the further ahead it looks.',
  },
]

export default function ModelGalleryWidget({ onSolved }) {
  const [active, setActive] = useState('physical')
  const [ran, setRan] = useState([])
  // A reduced-motion student gets one representative frame instead of a loop.
  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  const [t, setT] = useState(still ? 0.55 : 0)

  const model = MODELS.find((m) => m.id === active)

  useEffect(() => {
    if (still) return undefined
    let raf = 0
    const start = performance.now()
    const loop = (now) => {
      setT(((now - start) / 4200) % 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [still])

  function pick(id) {
    setActive(id)
    setRan((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      if (next.length === MODELS.length) onSolved?.()
      return next
    })
  }

  return (
    <>
      <SimLayout
        stage={
          // The job line sits above the picture but inside the stage column, so
          // the column still fills the row height the grid gives it.
          <div className="flex h-full min-h-0 w-full flex-col">
            <p className="mb-2 shrink-0 text-sm font-black text-stone-900 dark:text-white sm:text-base">
              The job: {model.job}
            </p>
            <div className="min-h-0 flex-1">
              <Stage>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  role="img"
                  aria-label={`${model.label} running: ${model.job}`}
                  style={STAGE_MEDIA}
                >
                  {active === 'physical' && <BridgeScene t={t} />}
                  {active === 'conceptual' && <AtomScene t={t} />}
                  {active === 'mathematical' && <GraphScene t={t} />}
                  {active === 'simulation' && <StormScene t={t} />}
                </svg>
              </Stage>
            </div>
          </div>
        }
        panel={
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => pick(m.id)}
                  aria-pressed={active === m.id}
                  className={`min-h-11 rounded-xl border-2 px-3 py-2 text-left transition-colors ${
                    active === m.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-700/30'
                      : 'border-stone-200 bg-white hover:border-primary-300 dark:border-stone-600 dark:bg-stone-800'
                  }`}
                >
                  <span className="block text-sm font-black text-stone-900 dark:text-white">
                    {ran.includes(m.id) ? '✓ ' : ''}
                    {m.label}
                  </span>
                  <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                    {m.tag}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-xl border-2 border-secondary-300 bg-secondary-50 p-3 dark:border-secondary-600 dark:bg-secondary-700/25">
              <p className="text-xs font-black uppercase tracking-wider text-secondary-700 dark:text-secondary-100">
                What you are watching
              </p>
              <p className="mt-1 text-sm font-medium text-stone-700 dark:text-stone-200">
                {model.reads}
              </p>
            </div>

            <p className="text-sm font-black text-stone-700 dark:text-stone-200">
              Models run — {ran.length} of {MODELS.length}
            </p>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        Now running the {model.label}. {ran.length} of {MODELS.length} models run.
      </p>
    </>
  )
}

// ── Scenes ────────────────────────────────────────────────────────────────────

// A truck crosses; the deck sags most when the truck is over mid-span.
//
// Deck and main cable are both quadratic curves between the same two towers, so
// a hanger is drawn between the two curves evaluated at the same x — that is
// what keeps it from poking out through the cable or below the deck.
const DECK_L = 47
const DECK_R = W - 47
const DECK_Y = 150
const CABLE_TOP = 60

// x is linear in t for these curves (the control point sits at the midpoint),
// so t can be recovered from x directly.
const tAtX = (x) => (x - DECK_L) / (DECK_R - DECK_L)
const quadY = (t, ctrl) => (1 - t) ** 2 * DECK_Y + 2 * (1 - t) * t * ctrl + t ** 2 * DECK_Y

function BridgeScene({ t }) {
  const x = DECK_L + 20 + t * (DECK_R - DECK_L - 110)
  const mid = W / 2
  const truckMid = x + 40
  const load = Math.max(0, 1 - Math.abs(truckMid - mid) / 220)
  const sag = load * 26
  const deckCtrl = DECK_Y + sag * 2

  const deckYAt = (px) => quadY(tAtX(px), deckCtrl)

  return (
    <g>
      <rect x="0" y="230" width={W} height="70" fill="#e7d9c3" />
      <rect x="30" y="150" width="34" height="80" rx="4" fill="#a8a29e" />
      <rect x={W - 64} y="150" width="34" height="80" rx="4" fill="#a8a29e" />

      {/* Main cable. */}
      <path
        d={`M ${DECK_L} ${DECK_Y} Q ${mid} ${CABLE_TOP} ${DECK_R} ${DECK_Y}`}
        stroke="#57534e"
        strokeWidth="5"
        fill="none"
      />

      {/* Hangers: cable above, deck below, nothing beyond either. */}
      {Array.from({ length: 9 }).map((_, i) => {
        const hx = DECK_L + ((i + 1) * (DECK_R - DECK_L)) / 10
        const ht = tAtX(hx)
        return (
          <line
            key={i}
            x1={hx}
            y1={quadY(ht, CABLE_TOP)}
            x2={hx}
            y2={quadY(ht, deckCtrl)}
            stroke="#78716c"
            strokeWidth="2.5"
          />
        )
      })}

      {/* Deck, bending under the load. Drawn last so the hangers meet it. */}
      <path
        d={`M ${DECK_L} ${DECK_Y} Q ${mid} ${deckCtrl} ${DECK_R} ${DECK_Y}`}
        stroke="#c2410c"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Truck, riding on the deck wherever the deck happens to be. */}
      <g transform={`translate(${x} ${deckYAt(truckMid) - 8})`}>
        <rect x="0" y="-30" width="56" height="30" rx="4" fill="#0f766e" />
        <rect x="56" y="-20" width="26" height="20" rx="4" fill="#14b8a6" />
        <circle cx="16" cy="3" r="7" fill="#292524" />
        <circle cx="66" cy="3" r="7" fill="#292524" />
      </g>

      {/* Load gauge — the same sag, said as a number. */}
      <rect x={W - 150} y="22" width="128" height="46" rx="10" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <text x={W - 138} y="40" fontSize="11" fontWeight="700" fill="#78716c">DECK LOAD</text>
      <rect x={W - 138} y="48" width="104" height="9" rx="4.5" fill="#e7e5e4" />
      <rect x={W - 138} y="48" width={104 * load} height="9" rx="4.5" fill={load > 0.75 ? '#ef4444' : '#f97316'} />
    </g>
  )
}

// Nucleus plus two electron shells. Not to scale, and that is the point.
function AtomScene({ t }) {
  const cx = W / 2
  const cy = H / 2
  const shells = [
    { r: 70, n: 2, speed: 1 },
    { r: 118, n: 8, speed: -0.55 },
  ]
  return (
    <g>
      {shells.map((s) => (
        <ellipse
          key={s.r}
          cx={cx}
          cy={cy}
          rx={s.r}
          ry={s.r * 0.62}
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      ))}

      <circle cx={cx} cy={cy} r="30" fill="#f97316" />
      <circle cx={cx - 9} cy={cy - 8} r="9" fill="#ea580c" />
      <circle cx={cx + 10} cy={cy + 6} r="9" fill="#fb923c" />
      <text x={cx} y={cy + 52} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        nucleus
      </text>

      {shells.map((s) =>
        Array.from({ length: s.n }).map((_, i) => {
          const a = t * Math.PI * 2 * s.speed + (i / s.n) * Math.PI * 2
          return (
            <circle
              key={`${s.r}-${i}`}
              cx={cx + Math.cos(a) * s.r}
              cy={cy + Math.sin(a) * s.r * 0.62}
              r="8"
              fill="#3BAFA9"
            />
          )
        }),
      )}
      <text x="20" y="26" fontSize="12" fontWeight="800" fill="#78716c">
        electrons (teal) — not drawn to scale
      </text>
    </g>
  )
}

// The curve is drawn point by point, so the formula is visibly being computed.
function GraphScene({ t }) {
  const x0 = 70
  const y0 = 250
  const x1 = W - 40
  const y1 = 50
  const years = 10
  const shown = Math.max(1, Math.round(t * years))
  // N = 400 x 1.18^year, capped by the lake.
  const value = (y) => Math.min(2000, 400 * Math.pow(1.18, y))
  const px = (y) => x0 + (y / years) * (x1 - x0)
  const py = (v) => y0 - (v / 2000) * (y0 - y1)

  const pts = Array.from({ length: shown + 1 }, (_, y) => `${px(y)},${py(value(y))}`).join(' ')

  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#a8a29e" strokeWidth="3" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#a8a29e" strokeWidth="3" />
      {[0, 500, 1000, 1500, 2000].map((v) => (
        <g key={v}>
          <line x1={x0} y1={py(v)} x2={x1} y2={py(v)} stroke="#e7e5e4" strokeWidth="1.5" />
          <text x={x0 - 8} y={py(v) + 4} fontSize="11" fontWeight="700" fill="#78716c" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <text x={(x0 + x1) / 2} y={y0 + 30} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        years from now
      </text>

      <polyline points={pts} fill="none" stroke="#0d9488" strokeWidth="4" strokeLinejoin="round" />
      {Array.from({ length: shown + 1 }).map((_, y) => (
        <circle key={y} cx={px(y)} cy={py(value(y))} r="5" fill="#0d9488" />
      ))}

      <rect x={x1 - 190} y="24" width="180" height="52" rx="10" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <text x={x1 - 178} y="44" fontSize="12" fontWeight="800" fill="#292524">
        N = 400 × 1.18ʸᵉᵃʳ
      </text>
      <text x={x1 - 178} y="64" fontSize="12" fontWeight="700" fill="#0d9488">
        year {shown} → {Math.round(value(shown))} fish
      </text>
    </g>
  )
}

// The storm walks its track; the cone behind it is the uncertainty growing.
function StormScene({ t }) {
  const track = [
    [90, 250],
    [180, 210],
    [270, 165],
    [370, 120],
    [480, 78],
  ]
  const seg = Math.min(t * (track.length - 1), track.length - 1.0001)
  const i = Math.floor(seg)
  const f = seg - i
  const x = track[i][0] + (track[i + 1][0] - track[i][0]) * f
  const y = track[i][1] + (track[i + 1][1] - track[i][1]) * f

  const conePath =
    `M ${track[0][0]} ${track[0][1] - 12} ` +
    track.map((p, k) => `L ${p[0]} ${p[1] - 12 - k * 11}`).join(' ') +
    ` L ${track[track.length - 1][0]} ${track[track.length - 1][1] + 12 + (track.length - 1) * 11} ` +
    track
      .slice()
      .reverse()
      .map((p, k) => `L ${p[0]} ${p[1] + 12 + (track.length - 1 - k) * 11}`)
      .join(' ') +
    ' Z'

  return (
    <g>
      <rect x="0" y="0" width={W} height={H} fill="#dbeafe" />
      <path d={`M 0 ${H} L 0 200 Q 120 250 240 235 Q 380 218 ${W} 265 L ${W} ${H} Z`} fill="#bbf7d0" />
      <path d={`M 0 200 Q 120 250 240 235 Q 380 218 ${W} 265`} stroke="#65a30d" strokeWidth="3" fill="none" />

      <path d={conePath} fill="rgba(249,115,22,0.18)" stroke="#fdba74" strokeWidth="2" />
      <polyline
        points={track.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#c2410c"
        strokeWidth="3"
        strokeDasharray="7 6"
      />
      {track.map((p, k) => (
        <circle key={k} cx={p[0]} cy={p[1]} r="4" fill="#c2410c" />
      ))}

      {/* Spiral storm — the arms turn as it travels. */}
      <g transform={`translate(${x} ${y}) rotate(${t * 720})`}>
        <circle r="26" fill="rgba(255,255,255,0.85)" />
        {[0, 120, 240].map((a) => (
          <path
            key={a}
            d="M 0 0 Q 16 -10 26 -4 Q 14 4 0 0"
            fill="#94a3b8"
            transform={`rotate(${a})`}
          />
        ))}
        <circle r="5" fill="#475569" />
      </g>

      <text x="20" y="28" fontSize="12" fontWeight="800" fill="#334155">
        day {Math.min(3, Math.floor(t * 3) + 1)} of 3 — forecast cone widens as it looks further ahead
      </text>
    </g>
  )
}
