import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// L1 signature interactive: four working models on one bench.
//
// Each of the four kinds of scientific model is built here as the thing itself
// and left running: a bridge that flexes under a truck, an atom with orbiting
// electrons, a graph that plots itself, a hurricane tracking up a coast. The
// student picks one and watches it do its job, which is the only way "what is
// this kind of model FOR" lands without a paragraph explaining it.
//
// A single clock tick drives every scene; each scene is pure SVG drawn from it.
//
// Every scene is drawn at the stage's own shape (about 16:10) and paints its
// own ground out past the viewBox, so it fills the frame edge to edge in both
// themes instead of floating in a band of empty gradient.

const W = 620
const H = 390

const MODELS = [
  {
    id: 'physical',
    label: 'Physical model',
    tag: 'A small copy',
    job: 'Will this bridge hold a loaded truck?',
  },
  {
    id: 'conceptual',
    label: 'Conceptual model',
    tag: 'A picture of an idea',
    job: 'What is inside an atom?',
  },
  {
    id: 'mathematical',
    label: 'Mathematical model',
    tag: 'A formula',
    job: 'How many fish in ten years?',
  },
  {
    id: 'simulation',
    label: 'Simulation model',
    tag: 'A computer running it',
    job: 'Where will this storm go next?',
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
              <Stage bleed>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="xMidYMid slice"
                  role="img"
                  aria-label={`${model.label} running: ${model.job}`}
                  style={stageFill(W, H)}
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

            <p className="text-sm font-black text-stone-700 dark:text-stone-200">
              Models run: {ran.length} of {MODELS.length}
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

// Everything outside this margin can be cropped by the stage, so no label or
// readout is placed there.
const BLEED = 60

// ── Scenes ────────────────────────────────────────────────────────────────────

// A truck crosses; the deck sags most when the truck is over mid-span.
//
// Deck and main cable are both quadratic curves between the same two towers, so
// a hanger is drawn between the two curves evaluated at the same x, which is
// what keeps it from poking out through the cable or below the deck. A dashed
// line marks where the unloaded deck sat, so the sag is something you can see
// rather than something you have to be told about.
const DECK_L = 52
const DECK_R = W - 52
const DECK_Y = 196
const CABLE_TOP = 96
const WATER_Y = 300
const PIER_FOOT = 330

// x is linear in t for these curves (the control point sits at the midpoint),
// so t can be recovered from x directly.
const tAtX = (x) => (x - DECK_L) / (DECK_R - DECK_L)
const quadY = (t, ctrl) => (1 - t) ** 2 * DECK_Y + 2 * (1 - t) * t * ctrl + t ** 2 * DECK_Y

function BridgeScene({ t }) {
  const x = DECK_L + 20 + t * (DECK_R - DECK_L - 110)
  const mid = W / 2
  const truckMid = x + 40
  const load = Math.max(0, 1 - Math.abs(truckMid - mid) / 220)
  const sag = load * 30
  const deckCtrl = DECK_Y + sag * 2

  const deckYAt = (px) => quadY(tAtX(px), deckCtrl)
  const deckPath = `M ${DECK_L} ${DECK_Y} Q ${mid} ${deckCtrl} ${DECK_R} ${DECK_Y}`

  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#eaf4fb" />

      {/* A few clouds, so the sky above the cable is sky and not blank. */}
      {[
        [110, 58, 1],
        [470, 44, 0.8],
      ].map(([cx, cy, s]) => (
        <g key={cx} transform={`translate(${cx} ${cy}) scale(${s})`}>
          <ellipse rx="34" ry="14" fill="#ffffff" opacity="0.85" />
          <ellipse cx="-22" cy="4" rx="20" ry="10" fill="#ffffff" opacity="0.85" />
          <ellipse cx="24" cy="5" rx="18" ry="9" fill="#ffffff" opacity="0.85" />
        </g>
      ))}

      {/* River, banks and the piers standing in it. */}
      <rect x={-BLEED} y={WATER_Y} width={W + BLEED * 2} height={H + BLEED - WATER_Y} fill="#9fd0d8" />
      <path d={`M ${-BLEED} ${WATER_Y} L ${-BLEED} ${H + BLEED} L 120 ${H + BLEED} Q 84 ${WATER_Y + 6} ${-BLEED} ${WATER_Y} Z`} fill="#cbb994" />
      <path
        d={`M ${W + BLEED} ${WATER_Y} L ${W + BLEED} ${H + BLEED} L ${W - 120} ${H + BLEED} Q ${W - 84} ${WATER_Y + 6} ${W + BLEED} ${WATER_Y} Z`}
        fill="#cbb994"
      />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={150 + i * 110}
          y1={WATER_Y + 24 + i * 16}
          x2={236 + i * 110}
          y2={WATER_Y + 24 + i * 16}
          stroke="#7fbcc6"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}

      {/* Towers, with the cross-bracing that keeps a real one standing. */}
      {[32, W - 68].map((tx) => (
        <g key={tx}>
          <rect x={tx} y={DECK_Y} width="36" height={PIER_FOOT - DECK_Y} fill="#a8a29e" />
          <rect x={tx - 6} y={DECK_Y - 9} width="48" height="11" rx="3" fill="#78716c" />
          <path
            d={`M ${tx + 4} 216 L ${tx + 32} 250 M ${tx + 32} 216 L ${tx + 4} 250 M ${tx + 4} 256 L ${tx + 32} 290 M ${tx + 32} 256 L ${tx + 4} 290`}
            stroke="#78716c"
            strokeWidth="3"
          />
        </g>
      ))}

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

      {/* Where the deck sits with nothing on it. */}
      <line
        x1={DECK_L}
        y1={DECK_Y}
        x2={DECK_R}
        y2={DECK_Y}
        stroke="#78716c"
        strokeWidth="2"
        strokeDasharray="6 7"
        opacity="0.75"
      />

      {/* Deck, bending under the load. Drawn last so the hangers meet it. */}
      <path d={deckPath} stroke="#c2410c" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={deckPath} stroke="#fed7aa" strokeWidth="2" strokeDasharray="16 14" fill="none" />

      {/* Truck, riding on the deck wherever the deck happens to be. */}
      <g transform={`translate(${x} ${deckYAt(truckMid) - 9})`}>
        <rect x="0" y="-32" width="58" height="32" rx="4" fill="#0f766e" />
        {[12, 25, 38, 50].map((rx) => (
          <line key={rx} x1={rx} y1="-30" x2={rx} y2="-2" stroke="#115e59" strokeWidth="2" />
        ))}
        <rect x="58" y="-23" width="27" height="23" rx="4" fill="#14b8a6" />
        <rect x="62" y="-19" width="16" height="11" rx="2" fill="#cffafe" />
        <rect x="81" y="-8" width="5" height="5" rx="1" fill="#0f766e" />
        <circle cx="17" cy="3" r="7.5" fill="#292524" />
        <circle cx="17" cy="3" r="3" fill="#a8a29e" />
        <circle cx="68" cy="3" r="7.5" fill="#292524" />
        <circle cx="68" cy="3" r="3" fill="#a8a29e" />
      </g>

      {sag > 5 && (
        <text
          x={mid}
          y={deckCtrl / 2 + DECK_Y / 2 + 40}
          fontSize="12"
          fontWeight="800"
          fill="#9a3412"
          textAnchor="middle"
        >
          deck sags here
        </text>
      )}

      {/* Load gauge: the same sag, said as a number. */}
      <rect x={W - 158} y="26" width="132" height="48" rx="10" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <text x={W - 146} y="45" fontSize="11" fontWeight="700" fill="#78716c">DECK LOAD</text>
      <rect x={W - 146} y="53" width="108" height="10" rx="5" fill="#e7e5e4" />
      <rect x={W - 146} y="53" width={108 * load} height="10" rx="5" fill={load > 0.75 ? '#ef4444' : '#f97316'} />
    </g>
  )
}

// Nucleus plus two electron shells. Not to scale, and that is the point, so
// the nucleus is built out of countable protons and neutrons rather than a
// blob, and each electron drags a short trail showing the way it is going.
function AtomScene({ t }) {
  const cx = W / 2
  const cy = 205
  const shells = [
    { r: 82, n: 2, speed: 1, name: 'shell 1' },
    { r: 146, n: 8, speed: -0.55, name: 'shell 2' },
  ]
  const NUCLEONS = [
    [-15, -7, true], [0, -15, false], [15, -6, true], [-8, 8, false],
    [8, 10, true], [0, 0, false], [-18, 5, false], [18, 7, true],
  ]

  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#f6f7fb" />

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
      {shells.map((s) => (
        <text
          key={`${s.r}-name`}
          x={cx + s.r + 6}
          y={cy - 8}
          fontSize="11"
          fontWeight="800"
          fill="#a8a29e"
        >
          {s.name}
        </text>
      ))}

      {/* Nucleus: protons carry a +, neutrons carry nothing. */}
      <circle cx={cx} cy={cy} r="34" fill="#fed7aa" opacity="0.7" />
      {NUCLEONS.map(([dx, dy, isProton], i) => (
        <g key={i}>
          <circle cx={cx + dx} cy={cy + dy} r="10" fill={isProton ? '#f97316' : '#a8a29e'} />
          {isProton && (
            <path
              d={`M ${cx + dx - 4.5} ${cy + dy} h 9 M ${cx + dx} ${cy + dy - 4.5} v 9`}
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
      <text x={cx} y={cy + 60} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        nucleus
      </text>

      {shells.map((s) =>
        Array.from({ length: s.n }).map((_, i) => {
          const a = t * Math.PI * 2 * s.speed + (i / s.n) * Math.PI * 2
          const trail = a - 0.28 * Math.sign(s.speed)
          return (
            <g key={`${s.r}-${i}`}>
              <path
                d={`M ${cx + Math.cos(trail) * s.r} ${cy + Math.sin(trail) * s.r * 0.62} L ${
                  cx + Math.cos(a) * s.r
                } ${cy + Math.sin(a) * s.r * 0.62}`}
                stroke="#3BAFA9"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.35"
              />
              <circle
                cx={cx + Math.cos(a) * s.r}
                cy={cy + Math.sin(a) * s.r * 0.62}
                r="9"
                fill="#3BAFA9"
              />
              <path
                d={`M ${cx + Math.cos(a) * s.r - 4.5} ${cy + Math.sin(a) * s.r * 0.62} h 9`}
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )
        }),
      )}

      <g>
        <circle cx="34" cy="34" r="7" fill="#f97316" />
        <text x="46" y="38" fontSize="11" fontWeight="800" fill="#78716c">proton</text>
        <circle cx="110" cy="34" r="7" fill="#a8a29e" />
        <text x="122" y="38" fontSize="11" fontWeight="800" fill="#78716c">neutron</text>
        <circle cx="200" cy="34" r="7" fill="#3BAFA9" />
        <text x="212" y="38" fontSize="11" fontWeight="800" fill="#78716c">electron</text>
      </g>
      <text x={W - 24} y="38" fontSize="11" fontWeight="800" fill="#a8a29e" textAnchor="end">
        not to scale
      </text>
    </g>
  )
}

// The curve is drawn point by point, so the formula is visibly being computed.
// The lake it is counting sits along the bottom, and the line the fish cannot
// grow past is drawn in, so the curve flattening reads as the lake filling up.
function GraphScene({ t }) {
  const x0 = 78
  const y0 = 300
  const x1 = W - 42
  const y1 = 66
  const years = 10
  const shown = Math.max(1, Math.round(t * years))
  // N = 400 x 1.18^year, capped by the lake.
  const value = (y) => Math.min(2000, 400 * Math.pow(1.18, y))
  const px = (y) => x0 + (y / years) * (x1 - x0)
  const py = (v) => y0 - (v / 2000) * (y0 - y1)

  const coords = Array.from({ length: shown + 1 }, (_, y) => [px(y), py(value(y))])
  const pts = coords.map((c) => c.join(',')).join(' ')
  const head = coords[coords.length - 1]

  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#ffffff" />

      {/* The lake being counted. */}
      <rect x={x0} y={y0 + 6} width={x1 - x0} height="30" rx="7" fill="#d7eef1" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${x0 + 40 + i * 128} ${y0 + 22})`}>
          <ellipse rx="10" ry="5.5" fill="#3BAFA9" />
          <path d="M 9 0 L 17 -6 L 17 6 Z" fill="#3BAFA9" />
          <circle cx="-4.5" cy="-1.6" r="1.5" fill="#fff" />
        </g>
      ))}

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

      {/* The ceiling the formula runs into. */}
      <line x1={x0} y1={py(2000)} x2={x1} y2={py(2000)} stroke="#c2410c" strokeWidth="2" strokeDasharray="8 6" />
      <text x={x1} y={py(2000) - 8} fontSize="11" fontWeight="800" fill="#c2410c" textAnchor="end">
        lake is full
      </text>

      <text x={(x0 + x1) / 2} y={y0 + 58} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        years from now
      </text>
      <text
        x="26"
        y={(y0 + y1) / 2}
        fontSize="12"
        fontWeight="800"
        fill="#78716c"
        textAnchor="middle"
        transform={`rotate(-90 26 ${(y0 + y1) / 2})`}
      >
        fish in the lake
      </text>

      <polyline points={`${x0},${y0} ${pts} ${head[0]},${y0}`} fill="#ccfbf1" opacity="0.7" stroke="none" />
      <polyline points={pts} fill="none" stroke="#0d9488" strokeWidth="4" strokeLinejoin="round" />
      {coords.map(([cx, cy], y) => (
        <circle key={y} cx={cx} cy={cy} r="5" fill="#0d9488" />
      ))}
      {/* The year being worked out right now. */}
      <circle cx={head[0]} cy={head[1]} r="11" fill="none" stroke="#0d9488" strokeWidth="2.5" opacity="0.6" />

      <rect x={x1 - 194} y="30" width="184" height="54" rx="10" fill="#fff" stroke="#d6d3d1" strokeWidth="2" />
      <text x={x1 - 182} y="51" fontSize="12" fontWeight="800" fill="#292524">
        N = 400 × 1.18ʸᵉᵃʳ
      </text>
      <text x={x1 - 182} y="71" fontSize="12" fontWeight="700" fill="#0d9488">
        year {shown} → {Math.round(value(shown))} fish
      </text>
    </g>
  )
}

// The storm walks its track; the cone behind it is the uncertainty growing.
// Two coastal towns sit under the track, so "where will it go" is a question
// about somewhere rather than about a dot.
function StormScene({ t }) {
  const track = [
    [92, 322],
    [182, 270],
    [272, 212],
    [372, 156],
    [482, 100],
  ]
  const seg = Math.min(t * (track.length - 1), track.length - 1.0001)
  const i = Math.floor(seg)
  const f = seg - i
  const x = track[i][0] + (track[i + 1][0] - track[i][0]) * f
  const y = track[i][1] + (track[i + 1][1] - track[i][1]) * f

  const conePath =
    `M ${track[0][0]} ${track[0][1] - 14} ` +
    track.map((p, k) => `L ${p[0]} ${p[1] - 14 - k * 13}`).join(' ') +
    ` L ${track[track.length - 1][0]} ${track[track.length - 1][1] + 14 + (track.length - 1) * 13} ` +
    track
      .slice()
      .reverse()
      .map((p, k) => `L ${p[0]} ${p[1] + 14 + (track.length - 1 - k) * 13}`)
      .join(' ') +
    ' Z'

  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#dbeafe" />
      {[0, 1, 2, 3].map((k) => (
        <line
          key={k}
          x1={44 + k * 150}
          y1={48 + k * 20}
          x2={116 + k * 150}
          y2={48 + k * 20}
          stroke="#bfdbfe"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      <path
        d={`M ${-BLEED} ${H + BLEED} L ${-BLEED} 258 Q 120 318 240 302 Q 380 283 ${W + BLEED} 338 L ${W + BLEED} ${H + BLEED} Z`}
        fill="#bbf7d0"
      />
      <path d={`M ${-BLEED} 258 Q 120 318 240 302 Q 380 283 ${W + BLEED} 338`} stroke="#65a30d" strokeWidth="3" fill="none" />
      <ellipse cx="462" cy="250" rx="48" ry="19" fill="#bbf7d0" />
      <ellipse cx="462" cy="250" rx="48" ry="19" fill="none" stroke="#65a30d" strokeWidth="2.5" />

      {/* Towns under the forecast. */}
      {[
        [128, 312, 'Tacloban'],
        [336, 294, 'Legazpi'],
      ].map(([tx, ty, name]) => (
        <g key={name}>
          <circle cx={tx} cy={ty} r="5" fill="#166534" />
          <circle cx={tx} cy={ty} r="10" fill="none" stroke="#166534" strokeWidth="1.5" opacity="0.5" />
          <text x={tx} y={ty + 24} fontSize="11" fontWeight="800" fill="#166534" textAnchor="middle">
            {name}
          </text>
        </g>
      ))}

      <path d={conePath} fill="rgba(249,115,22,0.18)" stroke="#fdba74" strokeWidth="2" />
      <polyline
        points={track.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#c2410c"
        strokeWidth="3"
        strokeDasharray="7 6"
      />
      {track.map((p, k) => (
        <g key={k}>
          <circle cx={p[0]} cy={p[1]} r="4.5" fill="#c2410c" />
          {k > 0 && (
            <text x={p[0]} y={p[1] + 22} fontSize="10" fontWeight="800" fill="#9a3412" textAnchor="middle">
              day {k}
            </text>
          )}
        </g>
      ))}

      {/* Spiral storm: the arms turn as it travels, rain bands and all. */}
      <g transform={`translate(${x} ${y})`}>
        <circle r="40" fill="rgba(148,163,184,0.22)" />
        <g transform={`rotate(${t * 720})`}>
          <circle r="30" fill="rgba(255,255,255,0.85)" />
          {[0, 90, 180, 270].map((a) => (
            <path
              key={a}
              d="M 0 0 Q 21 -13 35 -6 Q 19 6 0 0"
              fill="#94a3b8"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="8" fill="none" stroke="#475569" strokeWidth="3" />
        </g>
      </g>

      <text x="26" y="36" fontSize="12" fontWeight="800" fill="#334155">
        day {Math.min(3, Math.floor(t * 3) + 1)} of 3: the cone is how unsure it is
      </text>
    </g>
  )
}
