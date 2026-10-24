import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w11-l2 signature interactive: the same cork, scrubbed through 280 years.
//
// One slider moves the year. Everything else on screen is derived from a single
// number, the resolving power of the best instrument available in that year,
// log-interpolated between three real anchors. The blur on the field of view is
// that number in pixels, the colour fringing is what an uncorrected single lens
// does to white light, and whether a structure is drawn at all depends on
// whether it is bigger than the resolution limit.
//
// So the student does not read that the electron microscope was better. They
// drag past 1933 and ribosomes appear that were not there a pixel earlier.
//
// The three instruments are drawn as the real objects: Hooke's leather barrel
// with its oil lamp and water globe, Lister's brass compound with a mirror and
// a two-glass objective, and Ruska's vacuum column with its lens coils. The
// scene paints its own wall and bench, so it reads the same on cream and on
// stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall, bench and floor run past the viewBox so a cropped edge never shows a
// seam. Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 306

const CX = 460
const CY = 148
const R = 92

const INK = '#57534e'
const INK_MID = '#78716c'
const STEEL = '#a8a29e'
const GLASS = '#DDEEFF'
const WOOD = '#8A6A4A'

// Real anchors: Hooke's compound lens, Lister's achromatic doublet, Ruska's
// electron column. Resolution in micrometres.
const ERAS = [
  {
    id: 'hooke',
    year: 1665,
    res: 5,
    name: 'Hooke, 1665',
    lens: 'single ground lens',
    found: 'Cork is empty boxes. Hooke called them cells.',
    limit: 'One lens splits white light, so every edge carries colour.',
  },
  {
    id: 'achromat',
    year: 1830,
    res: 1,
    name: 'Lister, 1830',
    lens: 'crown and flint lenses',
    found: 'The fringes clear, and a nucleus shows inside each cell.',
    limit: 'Light sets the floor: nothing under half a wavelength splits apart.',
  },
  {
    id: 'electron',
    year: 1933,
    res: 0.002,
    name: 'Ruska, 1933',
    lens: 'electron beam in vacuum',
    found: 'Ribosomes, membranes and viruses resolve for the first time.',
    limit: 'The specimen must be dead and in a vacuum, so never alive.',
  },
]

const YEAR_MIN = 1660
const YEAR_MAX = 1945

// The wall rail the marker slides along, in scene units.
const RAIL_X = 56
const RAIL_W = 508
const railX = (year) => RAIL_X + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * RAIL_W

// Log interpolation between the anchors: resolution improved by orders of
// magnitude, not by equal steps.
function resolutionFor(year) {
  if (year <= ERAS[0].year) return ERAS[0].res
  if (year >= ERAS[2].year) return ERAS[2].res
  const i = year < ERAS[1].year ? 0 : 1
  const a = ERAS[i]
  const b = ERAS[i + 1]
  const t = (year - a.year) / (b.year - a.year)
  return Math.exp(Math.log(a.res) + t * (Math.log(b.res) - Math.log(a.res)))
}

const eraFor = (year) => (year < 1750 ? ERAS[0] : year < 1890 ? ERAS[1] : ERAS[2])

const formatRes = (res) =>
  res >= 1 ? `${res.toFixed(1)} µm` : res >= 0.01 ? `${res.toFixed(2)} µm` : `${(res * 1000).toFixed(0)} nm`

// Cork cells are not a grid of equal squares, so neither is this: centre,
// width and height per cell, laid out to fill the field circle.
const CELLS = [
  [404, 106, 58, 46],
  [462, 104, 50, 50],
  [516, 112, 48, 42],
  [400, 154, 52, 52],
  [456, 156, 58, 46],
  [514, 160, 50, 50],
  [418, 204, 56, 48],
  [478, 208, 60, 44],
]

function Room() {
  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
      <rect x={-BLEED} y={BENCH_Y} width={W + BLEED * 2} height="13" fill="#e7d9c3" />
      <rect x={-BLEED} y={BENCH_Y + 13} width={W + BLEED * 2} height={H + BLEED} fill="#f3ead9" />
    </g>
  )
}

// The slider's own value, drawn into the scene: a dated rail with the three
// anchor years notched on it and a marker that travels as the year changes.
function YearRail({ year }) {
  const x = railX(year)

  return (
    <g>
      <rect x="30" y="12" width="560" height="44" rx="6" fill="#fff7ed" stroke="#e7e5e4" strokeWidth="1.5" />
      <line x1={RAIL_X} y1="38" x2={RAIL_X + RAIL_W} y2="38" stroke={STEEL} strokeWidth="2" />
      {ERAS.map((e) => (
        <g key={e.id}>
          <line x1={railX(e.year)} y1="32" x2={railX(e.year)} y2="44" stroke={INK_MID} strokeWidth="2" />
          <text x={railX(e.year)} y="53" fontSize="9" fontWeight="800" fill={INK_MID} textAnchor="middle">
            {e.year}
          </text>
        </g>
      ))}
      <path d={`M ${x - 6} 30 L ${x + 6} 30 L ${x} 40 Z`} fill="#EA580C" />
      <text x={x} y="26" fontSize="13" fontWeight="900" fill="#b45309" textAnchor="middle">
        {year}
      </text>
    </g>
  )
}

// 1665: a leather-covered barrel on a turned pillar, lit by an oil lamp shining
// through a water-filled globe. That lamp is why Hooke could see anything.
function HookeScope() {
  return (
    <g>
      <ellipse cx="128" cy={BENCH_Y + 2} rx="88" ry="6" fill={INK} opacity="0.12" />
      <rect x="54" y="298" width="104" height="8" rx="3" fill="#6B4E32" />
      <path d="M 66 298 L 150 298 L 140 280 L 76 280 Z" fill={WOOD} />
      <rect x="96" y="120" width="14" height="160" fill="#A97C50" />
      <rect x="102" y="146" width="20" height="12" rx="3" fill="#6B4E32" />

      <rect x="112" y="92" width="42" height="156" rx="7" fill={WOOD} />
      {[110, 148, 186, 224].map((y) => (
        <rect key={y} x="112" y={y} width="42" height="5" fill="#C9A227" />
      ))}
      <rect x="118" y="72" width="30" height="22" rx="5" fill="#6B4E32" />
      <ellipse cx="133" cy="72" rx="15" ry="4" fill={GLASS} />
      <path d="M 116 248 L 150 248 L 142 260 L 124 260 Z" fill="#6B4E32" />
      <ellipse cx="133" cy="260" rx="9" ry="3" fill={GLASS} />

      {/* Cork on a pin, right under the nose of the barrel. */}
      <line x1="110" y1="276" x2="133" y2="276" stroke={INK_MID} strokeWidth="2.5" />
      <rect x="120" y="270" width="28" height="6" rx="2" fill="#C7A27A" stroke="#6B4E32" strokeWidth="1.4" />

      {/* Oil lamp and the water globe that concentrates its light. */}
      <rect x="196" y="296" width="58" height="10" rx="3" fill="#6B4E32" />
      <rect x="219" y="262" width="12" height="34" fill="#A97C50" />
      <path d="M 225 262 q -9 -10 0 -20 q 9 10 0 20 z" fill="#F59E0B" />
      <circle cx="225" cy="222" r="19" fill={GLASS} opacity="0.85" stroke={INK_MID} strokeWidth="2" />
      <path d="M 218 214 q 6 -5 12 0" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
      <line x1="207" y1="230" x2="156" y2="266" stroke="#FDE68A" strokeWidth="6" opacity="0.8" />

      <text x="225" y="322" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        oil lamp and globe
      </text>
      <text x="100" y="292" fontSize="10.5" fontWeight="800" fill="#6B4E32" textAnchor="end">
        cork on a pin
      </text>
    </g>
  )
}

// 1830: brass compound scope. The objective is drawn as two glasses stacked,
// one crown and one flint, because that pairing is what kills the fringes.
function ListerScope() {
  return (
    <g>
      <ellipse cx="118" cy={BENCH_Y + 2} rx="80" ry="6" fill={INK} opacity="0.12" />
      <path d="M 62 298 L 172 298 L 158 276 L 76 276 Z" fill="#C9A227" />
      <rect x="56" y="298" width="122" height="8" rx="3" fill="#A17C1A" />
      <path
        d="M 150 284 Q 168 284 168 262 L 168 150 Q 168 122 140 118 L 126 118"
        fill="none"
        stroke="#C9A227"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <circle cx="168" cy="230" r="15" fill="#A17C1A" />
      <circle cx="168" cy="230" r="6" fill="#C9A227" />

      <rect x="96" y="82" width="30" height="102" fill="#C9A227" />
      <rect x="99" y="82" width="5" height="102" fill="#FDE68A" opacity="0.6" />
      <rect x="92" y="62" width="38" height="22" rx="5" fill="#A17C1A" />
      <ellipse cx="111" cy="62" rx="19" ry="5" fill={GLASS} />

      {/* The achromatic doublet: crown glass over flint glass. */}
      <rect x="100" y="184" width="22" height="20" rx="4" fill="#A17C1A" />
      <ellipse cx="111" cy="190" rx="11" ry="4" fill={GLASS} />
      <ellipse cx="111" cy="200" rx="11" ry="4" fill="#FBBF24" />
      <line x1="126" y1="196" x2="150" y2="186" stroke={INK_MID} strokeWidth="1.5" />
      <text x="154" y="184" fontSize="10.5" fontWeight="800" fill="#b45309">
        two glasses
      </text>

      <rect x="74" y="214" width="76" height="8" rx="2" fill="#A17C1A" />
      <rect x="92" y="208" width="40" height="6" rx="1.5" fill={GLASS} stroke={INK_MID} strokeWidth="1.4" />
      <line x1="111" y1="258" x2="111" y2="216" stroke="#FDE68A" strokeWidth="6" opacity="0.8" />

      {/* Swivel mirror, throwing daylight up through the slide. */}
      <rect x="107" y="240" width="8" height="42" fill="#A17C1A" />
      <g transform="rotate(-18 111 264)">
        <ellipse cx="111" cy="264" rx="19" ry="10" fill={GLASS} stroke={INK_MID} strokeWidth="2" />
      </g>
      <text x="111" y="294" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        mirror
      </text>
    </g>
  )
}

// 1933: a vacuum column. Magnetic coils replace glass, the specimen goes in
// through an airlock, and a pump on the bench holds the vacuum.
function RuskaScope({ tick }) {
  const pulse = 0.55 + ((tick % 10) / 10) * 0.3

  return (
    <g>
      <ellipse cx="124" cy={BENCH_Y + 2} rx="86" ry="6" fill={INK} opacity="0.12" />
      <rect x="92" y="64" width="56" height="204" rx="8" fill={INK} />
      <rect x="100" y="46" width="40" height="20" rx="6" fill="#44403c" />
      <text x="120" y="38" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        electron gun
      </text>
      {[98, 156, 214].map((y) => (
        <g key={y}>
          <rect x="76" y={y} width="88" height="18" rx="6" fill={STEEL} />
          <rect x="76" y={y + 6} width="88" height="6" fill="#d6d3d1" />
        </g>
      ))}
      <line x1="120" y1="64" x2="120" y2="266" stroke="#3BAFA9" strokeWidth="3" opacity={pulse} />

      {/* Specimen airlock: the cork goes in through this port. */}
      <rect x="148" y="150" width="26" height="16" rx="3" fill="#d6d3d1" stroke={INK_MID} strokeWidth="1.5" />
      <circle cx="180" cy="158" r="6" fill="#EA580C" />
      <text x="192" y="147" fontSize="10.5" fontWeight="800" fill={INK_MID}>
        cork in here
      </text>

      {/* Fluorescent viewing screen at the foot of the column. */}
      <path d="M 88 268 L 152 268 L 166 292 L 74 292 Z" fill="#C7E3D8" stroke={INK_MID} strokeWidth="2" />
      <rect x="70" y="292" width="100" height="14" rx="4" fill="#44403c" />

      {/* Vacuum pump, hosed to the column. */}
      <rect x="206" y="266" width="56" height="40" rx="6" fill="#44403c" />
      <circle cx="234" cy="286" r="11" fill={STEEL} />
      <circle cx="234" cy="286" r="4" fill="#44403c" />
      <path d="M 206 276 Q 184 272 172 250" fill="none" stroke={INK_MID} strokeWidth="5" />
      <text x="234" y="258" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        vacuum pump
      </text>
    </g>
  )
}

export default function ScopeThroughTimeWidget({ onSolved }) {
  const [year, setYear] = useState(1665)
  const [seen, setSeen] = useState(['hooke'])
  const [tick, setTick] = useState(0)
  const seenRef = useRef(['hooke'])

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 90)
    return () => clearInterval(id)
  }, [])

  function changeYear(value) {
    setYear(value)
    const id = eraFor(value).id
    if (seenRef.current.includes(id)) return
    seenRef.current = [...seenRef.current, id]
    setSeen(seenRef.current)
    if (seenRef.current.length === ERAS.length) onSolved?.()
  }

  const res = resolutionFor(year)
  const era = eraFor(year)
  const blur = Math.min(9, res * 1.7)
  const fringe = Math.max(0, Math.min(1, (res - 0.9) / 4))
  const electron = era.id === 'electron'
  const drift = Math.sin(tick * 0.13) * 1.4
  const sweep = CY - R + ((tick * 7) % (R * 2))

  const walls = res < 12
  const nuclei = res < 2.5
  const microbes = res < 0.35
  const fine = res < 0.02

  const wall = electron ? '#44403c' : WOOD
  const lumen = electron ? '#D6D3D1' : '#F3E6CE'
  const structure = fine
    ? 'ribosomes and membranes'
    : microbes
      ? 'bacteria visible'
      : nuclei
        ? 'nucleus visible'
        : 'cell walls only'

  const specimen = (
    <g>
      {CELLS.map(([x, y, w, h]) => (
        <g key={`${x}-${y}`} transform={`translate(${drift} ${drift * 0.5})`}>
          <rect
            x={x - w / 2}
            y={y - h / 2}
            width={w}
            height={h}
            rx="7"
            fill={lumen}
            stroke={walls ? wall : lumen}
            strokeWidth={walls ? 5 : 0}
          />
          {nuclei && <circle cx={x} cy={y} r="9" fill={electron ? '#57534e' : '#7C3AED'} opacity="0.85" />}
          {microbes &&
            [0, 1, 2, 3].map((i) => (
              <ellipse
                key={i}
                cx={x - 16 + i * 11}
                cy={y + h / 2 - 9 - (i % 2) * (h - 18)}
                rx="4"
                ry="2.2"
                fill={electron ? '#78716c' : '#0f766e'}
              />
            ))}
          {fine && (
            <>
              <rect
                x={x - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx="7"
                fill="none"
                stroke="#1c1917"
                strokeWidth="1.2"
              />
              {Array.from({ length: 14 }, (_, i) => (
                <circle
                  key={i}
                  cx={x - w / 2 + 6 + (i % 7) * ((w - 12) / 6)}
                  cy={y - h / 2 + 9 + Math.floor(i / 7) * (h - 18)}
                  r="1.6"
                  fill="#292524"
                />
              ))}
            </>
          )}
        </g>
      ))}
    </g>
  )

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`Cork seen in ${year} through the ${era.lens}. Resolves down to ${formatRes(res)}. ${structure}.`}
              style={stageFill(W, H)}
            >
              <defs>
                <filter id="stt-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation={blur.toFixed(2)} />
                </filter>
                <clipPath id="stt-field">
                  <circle cx={CX} cy={CY} r={R} />
                </clipPath>
              </defs>

              <Room />
              <YearRail year={year} />

              {era.id === 'hooke' && <HookeScope />}
              {era.id === 'achromat' && <ListerScope />}
              {era.id === 'electron' && <RuskaScope tick={tick} />}

              <text x="140" y="338" fontSize="11.5" fontWeight="900" fill={INK} textAnchor="middle">
                {era.lens}
              </text>

              {/* Field of view: the same cork, whatever the year. */}
              <rect x="414" y="66" width="92" height="20" rx="5" fill="#fff7ed" stroke="#e7e5e4" strokeWidth="1.5" />
              <text x="460" y="80" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
                field of view
              </text>
              <circle cx={CX} cy={CY} r={R + 9} fill="#e7e5e4" stroke={INK_MID} strokeWidth="2.5" />
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill={electron ? '#E7E5E4' : '#FDF7EC'}
                stroke={INK}
                strokeWidth="2"
              />
              <g clipPath="url(#stt-field)" filter="url(#stt-blur)">
                {fringe > 0.02 && (
                  <>
                    <g transform={`translate(${-fringe * 5} 0)`} opacity={fringe * 0.55}>
                      <g style={{ mixBlendMode: 'multiply' }}>{specimen}</g>
                    </g>
                    <g transform={`translate(${fringe * 5} 0)`} opacity={fringe * 0.55}>
                      <g style={{ mixBlendMode: 'multiply' }}>{specimen}</g>
                    </g>
                  </>
                )}
                {specimen}
              </g>
              {electron && (
                <g clipPath="url(#stt-field)">
                  <line x1={CX - R} y1={sweep} x2={CX + R} y2={sweep} stroke="#3BAFA9" strokeWidth="2" opacity="0.35" />
                </g>
              )}

              {/* Wall card: the live numbers, inside the picture. */}
              <rect x="356" y="246" width="208" height="54" rx="6" fill="#fff7ed" stroke="#e7e5e4" strokeWidth="1.5" />
              <circle cx="460" cy="246" r="3.5" fill={STEEL} />
              <text x="368" y="264" fontSize="9" fontWeight="800" fill={INK_MID}>
                RESOLVES DOWN TO
              </text>
              <text x="368" y="288" fontSize="21" fontWeight="900" fill={INK}>
                {formatRes(res)}
              </text>
              <text
                x="552"
                y="288"
                fontSize="11"
                fontWeight="900"
                fill={electron ? '#0f766e' : '#b45309'}
                textAnchor="end"
              >
                {structure}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{era.name}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{era.found}</p>
            </div>

            <div>
              <label
                htmlFor="stt-year"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Year: {year}
              </label>
              <input
                id="stt-year"
                type="range"
                min={YEAR_MIN}
                max={YEAR_MAX}
                step={1}
                value={year}
                onChange={(e) => changeYear(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Same cork all the way. Only the instrument changes.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {ERAS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => changeYear(e.year)}
                  className={`min-h-11 rounded-xl border-2 px-1 py-2 text-xs font-black transition-colors ${
                    era.id === e.id
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                  }`}
                >
                  {e.year}
                </button>
              ))}
            </div>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2.5 dark:border-stone-600 dark:bg-stone-800">
              <p className="text-xs font-black text-stone-900 dark:text-white">What still stops you</p>
              <p className="mt-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">{era.limit}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Instruments used: {seen.length} of {ERAS.length}
              </p>
              <ul className="space-y-1.5">
                {ERAS.map((e) => {
                  const ok = seen.includes(e.id)
                  return (
                    <li
                      key={e.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 ${
                        ok
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {ok ? '✓ Used: ' : 'Not yet: '}
                        {e.name}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                        best detail {formatRes(e.res)}
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
        {year}. {era.name}. Resolves down to {formatRes(res)}. {structure}.
      </p>
    </>
  )
}
