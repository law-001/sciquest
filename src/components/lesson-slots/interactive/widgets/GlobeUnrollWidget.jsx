import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L3 signature interactive — unroll a globe into a flat map and watch what it
// costs you.
//
// Every line and every coastline here is the same list of latitude/longitude
// points, projected two ways and blended by the slider: a globe on the left of
// the slider, a Mercator map on the right. Greenland inflating to the size of
// Africa is not an illustration drawn to make a point — it is what the maths
// does, and the "times too big" readout is measured off the shape on screen.

const W = 620
const H = 340
const CX = W / 2
const CY = H / 2
const RG = 140 // globe radius
const HALF_W = 280
const MAX_LAT = 80

// Mercator stretches without limit at the poles, so the map is cut off at 80°.
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const MERC_MAX = mercY(MAX_LAT)

function project(lon, lat, t) {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180
  const gx = CX + RG * Math.cos(la) * Math.sin(lo)
  const gy = CY - RG * Math.sin(la)
  const fx = CX + (lon / 90) * HALF_W
  const fy = CY - (mercY(Math.max(-MAX_LAT, Math.min(MAX_LAT, lat))) / MERC_MAX) * (H / 2 - 14)
  return [gx + (fx - gx) * t, gy + (fy - gy) * t]
}

const path = (pts, t) =>
  pts.map(([lon, lat], i) => `${i ? 'L' : 'M'} ${project(lon, lat, t).map((n) => n.toFixed(1)).join(' ')}`).join(' ')

// Rough outlines, in [lon, lat]. Detail enough to be recognisable, coarse
// enough that the shape change is the thing you notice.
const AFRICA = [
  [-16, 14], [-6, 5], [8, 4], [9, -1], [12, -6], [13, -17], [15, -28],
  [20, -35], [28, -33], [32, -26], [40, -16], [40, -3], [43, 11],
  [51, 12], [43, 12], [37, 22], [33, 31], [25, 32], [10, 34], [-2, 35],
  [-10, 30], [-17, 21],
]

const GREENLAND = [
  [-45, 60], [-52, 65], [-55, 70], [-58, 76], [-50, 80], [-38, 83],
  [-26, 82], [-20, 77], [-25, 72], [-32, 68], [-40, 63],
]

const MERIDIANS = [-90, -60, -30, 0, 30, 60, 90]
const PARALLELS = [-60, -30, 0, 30, 60]

function shoelace(pts, t) {
  let a = 0
  for (let i = 0; i < pts.length; i += 1) {
    const [x1, y1] = project(pts[i][0], pts[i][1], t)
    const [x2, y2] = project(pts[(i + 1) % pts.length][0], pts[(i + 1) % pts.length][1], t)
    a += x1 * y2 - x2 * y1
  }
  return Math.abs(a / 2)
}

// Greenland is really about 7% of Africa's area.
const TRUE_RATIO = 0.072

export default function GlobeUnrollWidget({ onSolved }) {
  const [t, setT] = useState(0)
  const [seen, setSeen] = useState([])
  const [playing, setPlaying] = useState(false)
  const dirRef = useRef(1)
  const tRef = useRef(0)

  useEffect(() => {
    tRef.current = t
  }, [t])

  const mark = useCallback(
    (v) => {
      const id = v > 0.95 ? 'flat' : v < 0.05 ? 'globe' : null
      if (!id) return
      setSeen((prev) => {
        if (prev.includes(id)) return prev
        const next = [...prev, id]
        if (next.length === 2) onSolved?.()
        return next
      })
    },
    [onSolved],
  )

  // The animation walks `t` on a timer rather than in a state updater, so each
  // step can record reaching an end without doing it mid-update.
  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      const next = Math.min(1, Math.max(0, tRef.current + dirRef.current * 0.02))
      if (next >= 1) dirRef.current = -1
      if (next <= 0) dirRef.current = 1
      tRef.current = next
      setT(next)
      mark(next)
    }, 16)
    return () => clearInterval(id)
  }, [playing, mark])

  const ratio = shoelace(GREENLAND, t) / shoelace(AFRICA, t)
  const exaggeration = ratio / TRUE_RATIO
  const isFlat = t > 0.5

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`${isFlat ? 'Flat map' : 'Globe'} view. Greenland is drawn ${exaggeration.toFixed(1)} times too big.`}
              style={STAGE_MEDIA}
            >
              {/* Ocean: the globe's disc fades out as the map's rectangle fades in. */}
              <ellipse
                cx={CX}
                cy={CY}
                rx={RG + (HALF_W - RG) * t}
                ry={RG + (H / 2 - 14 - RG) * t}
                fill="#7BC9CF"
                opacity={0.55 * (1 - t * t)}
              />
              <rect
                x={CX - HALF_W}
                y={14}
                width={HALF_W * 2}
                height={H - 28}
                fill="#7BC9CF"
                opacity={0.55 * t * t}
              />

              {MERIDIANS.map((lon) => (
                <path
                  key={`m${lon}`}
                  d={path(
                    Array.from({ length: 33 }, (_, i) => [lon, -MAX_LAT + (i * (MAX_LAT * 2)) / 32]),
                    t,
                  )}
                  fill="none"
                  stroke="rgba(15,118,110,0.35)"
                  strokeWidth="1.5"
                />
              ))}
              {PARALLELS.map((lat) => (
                <path
                  key={`p${lat}`}
                  d={path(
                    Array.from({ length: 33 }, (_, i) => [-90 + (i * 180) / 32, lat]),
                    t,
                  )}
                  fill="none"
                  stroke={lat === 0 ? 'rgba(15,118,110,0.75)' : 'rgba(15,118,110,0.35)'}
                  strokeWidth={lat === 0 ? 2.5 : 1.5}
                />
              ))}

              <path d={`${path(AFRICA, t)} Z`} fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
              <path d={`${path(GREENLAND, t)} Z`} fill="#fde047" stroke="#a16207" strokeWidth="2" />

              <text
                x={project(20, 5, t)[0]}
                y={project(20, 5, t)[1]}
                fontSize="13"
                fontWeight="800"
                fill="#7c2d12"
                textAnchor="middle"
              >
                Africa
              </text>
              <text
                x={project(-38, 73, t)[0]}
                y={project(-38, 73, t)[1]}
                fontSize="13"
                fontWeight="800"
                fill="#713f12"
                textAnchor="middle"
              >
                Greenland
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div>
              <label
                htmlFor="globe-t"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Unroll — {Math.round(t * 100)}% flat ({isFlat ? 'flat map' : 'globe'})
              </label>
              <input
                id="globe-t"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(t * 100)}
                onChange={(e) => {
                  const v = Number(e.target.value) / 100
                  setT(v)
                  mark(v)
                }}
                className="h-11 w-full accent-orange-500"
              />
              <button
                type="button"
                onClick={() => {
                  // Reduced motion gets the end state outright instead of a sweep.
                  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
                    const v = t > 0.5 ? 0 : 1
                    setT(v)
                    mark(v)
                    return
                  }
                  dirRef.current = t > 0.5 ? -1 : 1
                  setPlaying((p) => !p)
                }}
                className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
              >
                {playing ? 'Stop' : 'Unroll it and roll it back'}
              </button>
            </div>

            <div
              className={`rounded-xl border-2 p-3 ${
                exaggeration > 4
                  ? 'border-accent-400 bg-accent-50 dark:border-accent-600 dark:bg-accent-700/20'
                  : 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">
                Greenland is drawn {exaggeration.toFixed(1)}× too big right now.
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Measured off the shape on screen: Greenland is covering{' '}
                {Math.round(ratio * 100)}% of Africa&rsquo;s area. In reality it is 7%.
              </p>
            </div>

            <div
              className={`rounded-xl border-2 p-3 ${
                !isFlat
                  ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                  : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
              }`}
            >
              <p className="text-xs font-black text-stone-900 dark:text-white">
                Globe {seen.includes('globe') && '✓'}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-600 dark:text-stone-300">
                Keeps real sizes, shapes and distances. Costs you: half the world is round
                the back, and you cannot fold it into a pocket.
              </p>
            </div>
            <div
              className={`rounded-xl border-2 p-3 ${
                isFlat
                  ? 'border-accent-400 bg-accent-50 dark:border-accent-600 dark:bg-accent-700/20'
                  : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
              }`}
            >
              <p className="text-xs font-black text-stone-900 dark:text-white">
                Flat map {seen.includes('flat') && '✓'}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-600 dark:text-stone-300">
                Keeps the whole world visible and printable, and straight lines stay
                straight for navigation. Costs you: everything near the poles balloons.
              </p>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {isFlat ? 'Flat map' : 'Globe'}, {Math.round(t * 100)} percent unrolled. Greenland
        drawn {exaggeration.toFixed(1)} times too big.
      </p>
    </>
  )
}
