import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// L2 signature interactive — a fair test you set up and then watch run.
//
// Two pots side by side. Everything about them is identical except the one
// thing the student sets: hours of light. Press run and fourteen days play out
// — the sun crosses, the stems climb, leaves unfold, and the graph plots itself
// day by day. The conclusion is then computed from the heights that actually
// came out, so it is a reading of the data rather than a prepared answer.

const POT_W = 330
const POT_H = 342
const CH_W = 300
const CH_H = 200
const DAYS = 14

const CONTROL_LIGHT = 4

// Height in cm on a given day. More light grows faster, but the plant tops out
// — it cannot grow forever, and the flattening is visible on the graph.
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
          <Stage>
            <svg
              viewBox={`0 0 ${POT_W} ${POT_H}`}
              role="img"
              aria-label={`Day ${day} of ${DAYS}. Pot A is ${controlH} centimetres, Pot B is ${testH} centimetres.`}
              style={STAGE_MEDIA}
            >
              <Sun day={day} hours={hours} />
              <Pot x={48} label="Pot A — control" sub={`${CONTROL_LIGHT} h light`} height={controlH} colour="#0d9488" />
              <Pot x={196} label="Pot B — test" sub={`${hours} h light`} height={testH} colour="#c2410c" />
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-accent-300 bg-accent-50 p-3 dark:border-accent-600 dark:bg-accent-700/20">
              <p className="text-xs font-black uppercase tracking-wider text-accent-700 dark:text-accent-100">
                Step 1 — the hypothesis
              </p>
              <p className="mt-1 text-sm font-black text-stone-900 dark:text-white">
                If a bean plant gets{' '}
                <span className="text-primary-600 dark:text-primary-300">{hours} hours</span> of
                light a day instead of {CONTROL_LIGHT}, then it will grow{' '}
                {hours > CONTROL_LIGHT ? 'taller' : hours < CONTROL_LIGHT ? 'shorter' : 'the same'}.
              </p>
            </div>

            <div>
              <label
                htmlFor="inv-hours"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Step 2 — light for Pot B: {hours} h a day
              </label>
              <input
                id="inv-hours"
                type="range"
                min={0}
                max={16}
                step={1}
                value={hours}
                disabled={running}
                onChange={(e) => setHours(Number(e.target.value))}
                className="h-11 w-full accent-orange-500 disabled:opacity-50"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Same soil, water, pot and seed in both. That is what makes it a fair test.
              </p>
            </div>

            <button
              type="button"
              onClick={start}
              disabled={running}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {running ? `Running — day ${day}` : done ? 'Run it again' : 'Step 3 — run the experiment'}
            </button>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2 dark:border-stone-600 dark:bg-stone-800">
              <Chart day={day} hours={hours} />
            </div>

            {done && (
              <div className="rounded-xl border-2 border-secondary-400 bg-secondary-50 p-3 dark:border-secondary-600 dark:bg-secondary-700/25">
                <p className="text-xs font-black uppercase tracking-wider text-secondary-700 dark:text-secondary-100">
                  Step 4 — the conclusion, read off your own data
                </p>
                <p className="mt-1 text-sm font-black text-stone-900 dark:text-white">
                  {gap > 0.4
                    ? `Pot B finished ${gap} cm taller than Pot A.`
                    : gap < -0.4
                      ? `Pot B finished ${Math.abs(gap)} cm shorter than Pot A.`
                      : 'Both pots finished at almost exactly the same height.'}
                </p>
                <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                  {gap > 0.4
                    ? 'Light was the only difference between the pots, so the extra height can be pinned on the light and nothing else.'
                    : gap < -0.4
                      ? 'Less light gave less growth. A result that goes against your prediction is still a real result.'
                      : 'You changed nothing, so there was nothing for the plants to respond to.'}
                </p>
                <p className="mt-2 text-xs font-medium text-stone-600 dark:text-stone-300">
                  Step 5 — communicate: that graph is what you would publish, so someone
                  else can run the same test and check your curve.
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

function Sun({ day, hours }) {
  const a = Math.PI * (0.12 + (day / DAYS) * 0.76)
  const cx = POT_W / 2 - Math.cos(a) * 118
  const cy = 62 - Math.sin(a) * 34
  const bright = Math.min(1, hours / 12)
  return (
    <g>
      <circle cx={cx} cy={cy} r="18" fill="#facc15" opacity={0.35 + bright * 0.65} />
      {Array.from({ length: 8 }).map((_, i) => {
        const ra = (i / 8) * Math.PI * 2
        return (
          <line
            key={i}
            x1={cx + Math.cos(ra) * 22}
            y1={cy + Math.sin(ra) * 22}
            x2={cx + Math.cos(ra) * (26 + bright * 8)}
            y2={cy + Math.sin(ra) * (26 + bright * 8)}
            stroke="#facc15"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.3 + bright * 0.7}
          />
        )
      })}
    </g>
  )
}

// One pot. Stem height comes straight from the measured cm, and a leaf pair
// unfolds every 4 cm, so growth is legible without reading the number.
function Pot({ x, label, sub, height, colour }) {
  const base = 248
  const px = 26 // pixels per cm
  const stem = height * (px / 3)
  const leaves = Math.floor(height / 4)

  return (
    <g>
      <rect x={x} y={base} width="90" height="46" rx="6" fill="#b45309" />
      <rect x={x - 6} y={base - 10} width="102" height="14" rx="5" fill="#92400e" />
      <rect x={x + 6} y={base - 6} width="78" height="8" rx="4" fill="#44403c" />

      <line
        x1={x + 45}
        y1={base - 6}
        x2={x + 45}
        y2={base - 6 - stem}
        stroke={colour}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {Array.from({ length: leaves }).map((_, i) => {
        const ly = base - 12 - ((i + 1) / (leaves + 1)) * stem
        const side = i % 2 === 0 ? 1 : -1
        return (
          <ellipse
            key={i}
            cx={x + 45 + side * 17}
            cy={ly}
            rx="17"
            ry="8"
            fill={colour}
            opacity="0.85"
            transform={`rotate(${side * -18} ${x + 45 + side * 17} ${ly})`}
          />
        )
      })}
      {stem > 6 && <circle cx={x + 45} cy={base - 6 - stem} r="5" fill={colour} />}

      {/* A ruler, so the height is a measurement and not a vibe. */}
      <line x1={x - 18} y1={base - 6} x2={x - 18} y2={base - 6 - 24 * (px / 3)} stroke="#a8a29e" strokeWidth="2" />
      {[0, 5, 10, 15, 20].map((cm) => (
        <g key={cm}>
          <line
            x1={x - 24}
            y1={base - 6 - cm * (px / 3)}
            x2={x - 12}
            y2={base - 6 - cm * (px / 3)}
            stroke="#a8a29e"
            strokeWidth="2"
          />
          <text x={x - 28} y={base - 2 - cm * (px / 3)} fontSize="9" fontWeight="700" fill="#78716c" textAnchor="end">
            {cm}
          </text>
        </g>
      ))}

      <text x={x + 45} y={base + 64} fontSize="13" fontWeight="800" fill="#57534e" textAnchor="middle">
        {label}
      </text>
      <text x={x + 45} y={base + 79} fontSize="12" fontWeight="700" fill="#78716c" textAnchor="middle">
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
        Step 3 — data being collected
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
