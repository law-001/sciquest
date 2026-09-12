import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w11-l2 signature interactive — the same cork, scrubbed through 280 years.
//
// One slider moves the year. Everything else on screen is derived from a single
// number: the resolving power of the best instrument available in that year,
// log-interpolated between three real anchors. The blur on the field of view is
// that number in pixels, the colour fringing is what an uncorrected single lens
// does to white light, and whether a structure is drawn at all depends on
// whether it is bigger than the resolution limit.
//
// So the student does not read that the electron microscope was better. They
// drag past 1933 and ribosomes appear that were not there a pixel earlier.

const W = 620
const H = 340
const CX = 420
const CY = 168
const R = 100

// Real anchors: Hooke's compound lens, Lister's achromatic doublet, Ruska's
// electron column. Resolution in micrometres.
const ERAS = [
  {
    id: 'hooke',
    year: 1665,
    res: 5,
    name: '1665 — Hooke’s compound lens',
    found: 'Cork is not solid. It is a honeycomb of little empty boxes, and Hooke called them cells.',
    limit: 'Single lenses split white light, so every edge carries a coloured fringe.',
  },
  {
    id: 'achromat',
    year: 1830,
    res: 1,
    name: '1830 — Lister’s achromatic doublet',
    found: 'The fringes are gone and a dense body shows inside each cell — the nucleus.',
    limit: 'Light itself sets the floor: nothing smaller than about half a wavelength can be split apart.',
  },
  {
    id: 'electron',
    year: 1933,
    res: 0.002,
    name: '1933 — Ruska’s electron microscope',
    found: 'Electrons have a far shorter wavelength than light, so ribosomes, the double membrane and even viruses resolve.',
    limit: 'The specimen must be dead and in a vacuum — you can never watch a living cell this way.',
  },
]

const YEAR_MIN = 1660
const YEAR_MAX = 1945

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

const CELLS = [
  [368, 118],
  [428, 112],
  [482, 126],
  [364, 176],
  [424, 172],
  [480, 184],
  [388, 232],
  [448, 230],
]

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

  const wall = electron ? '#44403c' : '#8A6A4A'
  const lumen = electron ? '#D6D3D1' : '#F3E6CE'

  const specimen = (
    <g>
      {CELLS.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${drift} ${drift * 0.5})`}>
          <rect x={x - 28} y={y - 25} width="56" height="50" rx="7" fill={lumen} stroke={walls ? wall : lumen} strokeWidth={walls ? 5 : 0} />
          {nuclei && <circle cx={x} cy={y} r="9" fill={electron ? '#57534e' : '#7C3AED'} opacity="0.85" />}
          {microbes &&
            [0, 1, 2, 3].map((i) => (
              <ellipse
                key={i}
                cx={x - 16 + i * 11}
                cy={y + 15 - (i % 2) * 26}
                rx="4"
                ry="2.2"
                fill={electron ? '#78716c' : '#0f766e'}
              />
            ))}
          {fine && (
            <>
              <rect x={x - 28} y={y - 25} width="56" height="50" rx="7" fill="none" stroke="#1c1917" strokeWidth="1.2" />
              {Array.from({ length: 14 }, (_, i) => (
                <circle key={i} cx={x - 22 + (i % 7) * 7.5} cy={y - 16 + Math.floor(i / 7) * 33} r="1.6" fill="#292524" />
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
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cork seen in ${year}. Resolution ${formatRes(res)}. ${era.name}.`} style={STAGE_MEDIA}>
              <defs>
                <filter id="stt-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation={blur.toFixed(2)} />
                </filter>
                <clipPath id="stt-field">
                  <circle cx={CX} cy={CY} r={R} />
                </clipPath>
              </defs>

              {/* ── The instrument of the day ── */}
              <rect x="40" y="290" width="150" height="15" rx="7" fill="#57534e" />
              {era.id === 'electron' ? (
                <g>
                  <rect x="86" y="60" width="58" height="230" rx="10" fill="#57534e" />
                  <rect x="74" y="96" width="82" height="16" rx="6" fill="#a8a29e" />
                  <rect x="74" y="160" width="82" height="16" rx="6" fill="#a8a29e" />
                  <rect x="74" y="224" width="82" height="16" rx="6" fill="#a8a29e" />
                  <line x1="115" y1="64" x2="115" y2="288" stroke="#3BAFA9" strokeWidth="3" opacity="0.8" />
                  <text x="115" y="52" fontSize="11" fontWeight="900" fill="#0f766e" textAnchor="middle">
                    electron gun
                  </text>
                  <text x="115" y="322" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                    vacuum column
                  </text>
                </g>
              ) : (
                <g>
                  <path d="M 108 290 L 108 150 Q 108 124 132 124 L 152 124" fill="none" stroke="#78716c" strokeWidth="12" strokeLinecap="round" />
                  <rect x="146" y="100" width="24" height="38" rx="6" fill="#44403c" />
                  <rect x="96" y="200" width="90" height="8" rx="3" fill="#a8a29e" />
                  <ellipse cx="114" cy="168" rx="13" ry="7" fill="#DDEEFF" stroke="#78716c" strokeWidth="2" />
                  {era.id === 'achromat' && (
                    <ellipse cx="114" cy="180" rx="13" ry="6" fill="#FBBF24" stroke="#78716c" strokeWidth="2" />
                  )}
                  <text x="114" y="322" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                    {era.id === 'achromat' ? 'crown + flint doublet' : 'single ground lens'}
                  </text>
                </g>
              )}

              {/* ── Field of view ── */}
              <circle cx={CX} cy={CY} r={R} fill={electron ? '#E7E5E4' : '#FDF7EC'} stroke="#78716c" strokeWidth="3" />
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

              <text x={CX} y={CY + R + 24} fontSize="13" fontWeight="900" fill="#78716c" textAnchor="middle">
                resolves down to {formatRes(res)}
              </text>
              <text x={CX} y={CY + R + 44} fontSize="11.5" fontWeight="800" fill={electron ? '#0f766e' : '#b45309'} textAnchor="middle">
                {fine ? 'ribosomes and membranes' : microbes ? 'bacteria visible' : nuclei ? 'nucleus visible' : 'cell walls only'}
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
              <label htmlFor="stt-year" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Year — {year}
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
                Same piece of cork the whole way. Only the instrument changes.
              </p>
            </div>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2.5 dark:border-stone-600 dark:bg-stone-800">
              <p className="text-xs font-black text-stone-900 dark:text-white">
                What still stops you
              </p>
              <p className="mt-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">{era.limit}</p>
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

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Instruments used — {seen.length} of {ERAS.length}
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
                        {ok ? '✓ Used — ' : 'Not yet — '}
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
        {year}. {era.name}. Resolves down to {formatRes(res)}.
      </p>
    </>
  )
}
