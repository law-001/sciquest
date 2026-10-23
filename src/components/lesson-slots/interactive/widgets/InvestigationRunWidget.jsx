import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// L2 signature interactive: a fair test you set up and then watch run.
//
// Two pots side by side. Everything about them is identical except the one
// thing the student sets: hours of light. Press run and fourteen days play out,
// the sun crosses, the stems climb, leaves unfold, and the graph plots itself
// day by day. The conclusion is then computed from the heights that actually
// came out, so it is a reading of the data rather than a prepared answer.
//
// The light each pot gets is drawn as a beam over that pot, so the one thing
// being changed is visible in the picture instead of only in the slider.
//
// The bench is drawn at the stage's own shape (about 16:10) and bleeds past the
// viewBox, so it fills the frame instead of sitting in a tall narrow strip.

const W = 620
const H = 400
const BLEED = 60
const CH_W = 300
const CH_H = 200
const DAYS = 14

const CONTROL_LIGHT = 4
const MAX_LIGHT = 16

// Bench geometry. `BASE` is the soil line every plant grows up from.
const BASE = 286
const BENCH_Y = 345
const PX_PER_CM = 8.7

// Height in cm on a given day. More light grows faster, but the plant tops out,
// it cannot grow forever, and the flattening is visible on the graph.
function heightOn(day, hours) {
  const rate = 0.55 + hours * 0.42
  return Number((22 * (1 - Math.exp((-rate * day) / 14))).toFixed(1))
}

export default function InvestigationRunWidget({ onSolved }) {
  const [hours, setHours] = useState(9)
  const [day, setDay] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!running) return undefined
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const id = setInterval(
      () => {
        setDay((prev) => {
          if (prev >= DAYS) return prev
          const next = prev + 1
          if (next >= DAYS) {
            setRunning(false)
            setDone(true)
            onSolved?.()
          }
          return next
        })
      },
      still ? 60 : 420,
    )
    return () => clearInterval(id)
  }, [running, onSolved])

  const controlH = heightOn(day, CONTROL_LIGHT)
  const testH = heightOn(day, hours)
  const gap = Number((testH - controlH).toFixed(1))

  function start() {
    setDay(0)
    setDone(false)
    setRunning(true)
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`Day ${day} of ${DAYS}. Pot A is ${controlH} centimetres, Pot B is ${testH} centimetres.`}
              style={stageFill(W, H)}
            >
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
              <rect x={-BLEED} y={BENCH_Y} width={W + BLEED * 2} height="13" fill="#e7d9c3" />
              <rect x={-BLEED} y={BENCH_Y + 13} width={W + BLEED * 2} height={H + BLEED} fill="#f3ead9" />

              <Sun day={day} />
              <LightBeam cx={190} hours={CONTROL_LIGHT} />
              <LightBeam cx={430} hours={hours} />

              <Pot cx={190} label="Pot A (control)" sub={`${CONTROL_LIGHT} h light`} height={controlH} colour="#0d9488" />
              <Pot cx={430} label="Pot B (test)" sub={`${hours} h light`} height={testH} colour="#c2410c" />

              <text x="26" y="36" fontSize="14" fontWeight="800" fill="#78716c">
                Day {day} of {DAYS}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-accent-300 bg-accent-50 p-3 dark:border-accent-600 dark:bg-accent-700/20">
              <p className="text-xs font-black uppercase tracking-wider text-accent-700 dark:text-accent-100">
                1 · Hypothesis
              </p>
              <p className="mt-1 text-sm font-black text-stone-900 dark:text-white">
                More light,{' '}
                {hours > CONTROL_LIGHT ? 'taller' : hours < CONTROL_LIGHT ? 'shorter' : 'same'} plant.
              </p>
            </div>

            <div>
              <label
                htmlFor="inv-hours"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                2 · Light for Pot B: {hours} h a day
              </label>
              <input
                id="inv-hours"
                type="range"
                min={0}
                max={MAX_LIGHT}
                step={1}
                value={hours}
                disabled={running}
                onChange={(e) => setHours(Number(e.target.value))}
                className="h-11 w-full accent-orange-500 disabled:opacity-50"
              />
            </div>

            <button
              type="button"
              onClick={start}
              disabled={running}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {running ? `Running, day ${day}` : done ? 'Run it again' : '3 · Run the 14 days'}
            </button>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2 dark:border-stone-600 dark:bg-stone-800">
              <Chart day={day} hours={hours} />
            </div>

            {done && (
              <div className="rounded-xl border-2 border-secondary-400 bg-secondary-50 p-3 dark:border-secondary-600 dark:bg-secondary-700/25">
                <p className="text-xs font-black uppercase tracking-wider text-secondary-700 dark:text-secondary-100">
                  4 · Your result
                </p>
                <p className="mt-1 text-sm font-black text-stone-900 dark:text-white">
                  {gap > 0.4
                    ? `Pot B finished ${gap} cm taller than Pot A.`
                    : gap < -0.4
                      ? `Pot B finished ${Math.abs(gap)} cm shorter than Pot A.`
                      : 'Both pots finished at the same height.'}
                </p>
              </div>
            )}
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        Day {day} of {DAYS}. Pot A {controlH} centimetres, Pot B {testH} centimetres.
      </p>
    </>
  )
}

// ── Scene parts ───────────────────────────────────────────────────────────────

// The sun is the calendar: it walks across the sky as the days tick by.
function Sun({ day }) {
  const a = Math.PI * (0.12 + (day / DAYS) * 0.76)
  const cx = W / 2 - Math.cos(a) * 235
  const cy = 92 - Math.sin(a) * 48
  return (
    <g>
      <circle cx={cx} cy={cy} r="19" fill="#facc15" />
      <circle cx={cx} cy={cy} r="19" fill="none" stroke="#eab308" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => {
        const ra = (i / 8) * Math.PI * 2
        return (
          <line
            key={i}
            x1={cx + Math.cos(ra) * 24}
            y1={cy + Math.sin(ra) * 24}
            x2={cx + Math.cos(ra) * 32}
            y2={cy + Math.sin(ra) * 32}
            stroke="#facc15"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

// The one thing being changed, drawn: a beam over each pot whose strength is
// that pot's hours of light. Zero hours leaves the pot in the dark.
function LightBeam({ cx, hours }) {
  const strength = hours / MAX_LIGHT
  const top = 112
  return (
    <g>
      <path
        d={`M ${cx - 20} ${top} L ${cx + 20} ${top} L ${cx + 74} ${BASE} L ${cx - 74} ${BASE} Z`}
        fill="#facc15"
        opacity={0.06 + strength * 0.3}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={cx - 16 + i * 8}
          y1={top + 5}
          x2={cx - 56 + i * 28}
          y2={BASE - 7}
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.12 + strength * 0.55}
        />
      ))}
      <text x={cx} y={top - 8} fontSize="13" fontWeight="800" fill="#a16207" textAnchor="middle">
        {hours} h
      </text>
    </g>
  )
}

// One pot, drawn around its own centre so the bench can be laid out by moving
// the pots rather than by editing every coordinate inside one. Stem height
// comes straight from the measured cm, and a leaf pair unfolds every 4 cm, so
// growth is legible without reading the number.
function Pot({ cx, label, sub, height, colour }) {
  const stem = height * PX_PER_CM
  const leaves = Math.floor(height / 4)

  return (
    <g transform={`translate(${cx} ${BASE})`}>
      {/* Pot: tapered body, thrown rim, a tray under it and soil on top. */}
      <path d="M -60 0 L 60 0 L 51 52 L -51 52 Z" fill="#b45309" />
      <path d="M -52 5 L -44 48" stroke="#92400e" strokeWidth="3" opacity="0.5" />
      <rect x="-55" y="52" width="110" height="7" rx="3" fill="#78350f" />
      <rect x="-66" y="-11" width="132" height="15" rx="5" fill="#92400e" />
      <rect x="-52" y="-8" width="104" height="11" rx="4" fill="#44403c" />
      {[-36, -12, 12, 36].map((dx, i) => (
        <circle key={dx} cx={dx} cy={-2 + (i % 2)} r="1.8" fill="#78716c" />
      ))}

      <line x1="0" y1="-6" x2="0" y2={-6 - stem} stroke={colour} strokeWidth="7" strokeLinecap="round" />
      {Array.from({ length: leaves }).map((_, i) => {
        const ly = -12 - ((i + 1) / (leaves + 1)) * stem
        const side = i % 2 === 0 ? 1 : -1
        return (
          <g key={i} transform={`translate(0 ${ly}) scale(${side} 1) rotate(-16)`}>
            <path d="M 0 0 Q 15 -13 34 -6 Q 16 8 0 0 Z" fill={colour} opacity="0.9" />
            <path d="M 2 -1 Q 16 -5 31 -6" stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.7" />
          </g>
        )
      })}
      {stem > 6 && <circle cx="0" cy={-6 - stem} r="5.5" fill={colour} />}

      {/* A ruler, so the height is a measurement and not a vibe. */}
      <line x1="-86" y1="-6" x2="-86" y2={-6 - 24 * PX_PER_CM} stroke="#a8a29e" strokeWidth="2" />
      {[0, 5, 10, 15, 20].map((cm) => (
        <g key={cm}>
          <line
            x1="-92"
            y1={-6 - cm * PX_PER_CM}
            x2="-80"
            y2={-6 - cm * PX_PER_CM}
            stroke="#a8a29e"
            strokeWidth="2"
          />
          <text x="-96" y={-2 - cm * PX_PER_CM} fontSize="10" fontWeight="700" fill="#78716c" textAnchor="end">
            {cm}
          </text>
        </g>
      ))}

      <text x="0" y="86" fontSize="14" fontWeight="800" fill="#57534e" textAnchor="middle">
        {label}
      </text>
      <text x="0" y="104" fontSize="13" fontWeight="700" fill="#78716c" textAnchor="middle">
        {sub} · {height} cm
      </text>
    </g>
  )
}

// The graph draws itself one day at a time, which is the data being collected.
// It is its own SVG rather than a corner of the pot scene, so the title can
// never land on top of the axis.
function Chart({ day, hours }) {
  const x0 = 40
  const y0 = CH_H - 44
  const x1 = CH_W - 14
  const y1 = 34
  const px = (d) => x0 + (d / DAYS) * (x1 - x0)
  const py = (cm) => y0 - (cm / 24) * (y0 - y1)

  const line = (h) =>
    Array.from({ length: day + 1 }, (_, d) => `${px(d)},${py(heightOn(d, h))}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${CH_W} ${CH_H}`}
      role="img"
      aria-label={`Growth chart, day ${day} of ${DAYS}.`}
      className="w-full"
      style={{ display: 'block' }}
    >
      <text x="4" y="14" fontSize="12" fontWeight="800" fill="#78716c">
        Your data
      </text>
      <text x="4" y="28" fontSize="11" fontWeight="700" fill="#a8a29e">
        height in cm
      </text>

      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#a8a29e" strokeWidth="2" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#a8a29e" strokeWidth="2" />
      {[0, 8, 16, 24].map((cm) => (
        <g key={cm}>
          <line x1={x0} y1={py(cm)} x2={x1} y2={py(cm)} stroke="#e7e5e4" strokeWidth="1.5" />
          <text x={x0 - 6} y={py(cm) + 4} fontSize="11" fontWeight="700" fill="#78716c" textAnchor="end">
            {cm}
          </text>
        </g>
      ))}
      <text x={(x0 + x1) / 2} y={y0 + 20} fontSize="11" fontWeight="700" fill="#78716c" textAnchor="middle">
        day {day} of {DAYS}
      </text>

      <polyline points={line(CONTROL_LIGHT)} fill="none" stroke="#0d9488" strokeWidth="3" />
      <polyline points={line(hours)} fill="none" stroke="#c2410c" strokeWidth="3" />
      {day > 0 && (
        <>
          <circle cx={px(day)} cy={py(heightOn(day, CONTROL_LIGHT))} r="4.5" fill="#0d9488" />
          <circle cx={px(day)} cy={py(heightOn(day, hours))} r="4.5" fill="#c2410c" />
        </>
      )}

      <rect x={x0} y={CH_H - 16} width="12" height="4" fill="#0d9488" />
      <text x={x0 + 18} y={CH_H - 8} fontSize="11" fontWeight="700" fill="#57534e">
        Pot A
      </text>
      <rect x={x0 + 74} y={CH_H - 16} width="12" height="4" fill="#c2410c" />
      <text x={x0 + 92} y={CH_H - 8} fontSize="11" fontWeight="700" fill="#57534e">
        Pot B
      </text>
    </svg>
  )
}
