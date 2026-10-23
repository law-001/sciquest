import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w05-l2 signature interactive: reading a cylinder, and a balance that lies.
//
// The eye really does sight along a line. The graduations are on the near wall
// and the liquid surface is behind them, so the line of sight crosses the scale
// somewhere other than the true level unless the eye is level with it. The
// number the student records is computed from that crossing, which means a
// wrong eye height gives a wrong answer rather than a warning message.
//
// The balance beside it reads 2.40 g with nothing on the pan. It shifts every
// mass by exactly that amount until it is zeroed: the same error every time,
// which is what makes it systematic rather than random.
//
// The bench is drawn at the stage's own shape (about 16:10) and bleeds past the
// viewBox, so it fills the frame instead of letterboxing inside it.

const W = 620
const H = 390
const BLEED = 60

// Cylinder interior, in SVG units.
const CYL_L = 104
const CYL_R = 168
const Y_ZERO = 296
const Y_FULL = 78
const FULL_ML = 50

// Parallax geometry: the scale is printed on the near wall, the surface sits
// behind it, and the eye is further out still.
const X_SCALE = 162
const X_SURFACE = 122
const EYE_X = 320
const T = (X_SCALE - EYE_X) / (X_SURFACE - EYE_X)

const EYE_TOP = 72
const EYE_BOTTOM = 306
const BENCH_Y = 318

// Left edge of the balance body. The stage column is only about 16:10 on a wide
// screen, so `slice` crops the sides by roughly 40 units at the shapes it takes.
// This keeps the balance and its empty-pan warning inside that inset instead of
// running to the very edge of the viewBox.
const BAL_X = 388

const TOLERANCE_ML = 0.3
const TARE_ERROR_G = 2.4

const SAMPLES = [
  { volume: 18.5, mass: 24.6 },
  { volume: 32.0, mass: 41.2 },
  { volume: 27.5, mass: 35.8 },
]

const yForVolume = (ml) => Y_ZERO - (ml / FULL_ML) * (Y_ZERO - Y_FULL)
const volumeForY = (y) => ((Y_ZERO - y) / (Y_ZERO - Y_FULL)) * FULL_ML

export default function MeniscusBenchWidget({ onSolved }) {
  const [eyeY, setEyeY] = useState(120)
  const [index, setIndex] = useState(0)
  const [log, setLog] = useState([])
  const [offset, setOffset] = useState(TARE_ERROR_G)
  const [tared, setTared] = useState(false)
  const [message, setMessage] = useState(null)
  const [tick, setTick] = useState(0)

  // A real liquid surface is never perfectly still, and the ripple is what
  // makes the meniscus read as liquid rather than as a drawn line.
  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 120)
    return () => clearInterval(id)
  }, [])

  const sample = SAMPLES[index]
  const ySurface = yForVolume(sample.volume)
  const yRead = eyeY + T * (ySurface - eyeY)
  const apparent = volumeForY(yRead)
  const error = apparent - sample.volume
  const level = Math.abs(error) <= TOLERANCE_ML
  const correctReads = log.filter((r) => r.ok).length
  const balanceReading = sample.mass + offset

  const ripple = Math.sin(tick * 0.5) * 0.8

  function record() {
    if (!level) {
      setMessage(
        `Not recorded. That is ${Math.abs(error).toFixed(1)} mL too ${
          error > 0 ? 'high' : 'low'
        }. Move your eye level with the surface.`,
      )
      return
    }
    const entry = {
      id: `${index}-${log.length}`,
      volume: apparent.toFixed(1),
      mass: balanceReading.toFixed(2),
      offsetAtTime: offset,
      ok: true,
    }
    const nextLog = [...log, entry]
    setLog(nextLog)
    setMessage(`Recorded ${apparent.toFixed(1)} mL and ${balanceReading.toFixed(2)} g.`)
    setIndex((i) => (i + 1) % SAMPLES.length)
    if (nextLog.filter((r) => r.ok).length >= SAMPLES.length && tared) onSolved?.()
  }

  function tare() {
    setOffset(0)
    setTared(true)
    setMessage(
      `Zeroed. Every mass before this was ${TARE_ERROR_G.toFixed(2)} g too heavy, every single time.`,
    )
    if (correctReads >= SAMPLES.length) onSolved?.()
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
              aria-label={`Graduated cylinder holding ${sample.volume} millilitres. From the current eye height it appears to read ${apparent.toFixed(1)} millilitres. The balance shows ${balanceReading.toFixed(2)} grams.`}
              style={stageFill(W, H)}
            >
              {/* Lab wall and bench, both bleeding past the viewBox so a
                  cropped edge never shows a seam. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
              <rect x={-BLEED} y={BENCH_Y} width={W + BLEED * 2} height="13" fill="#e7d9c3" />
              <rect x={-BLEED} y={BENCH_Y + 13} width={W + BLEED * 2} height={H + BLEED} fill="#f3ead9" />

              {/* ── Graduated cylinder ── */}
              <ellipse cx={(CYL_L + CYL_R) / 2} cy={BENCH_Y + 2} rx="56" ry="5" fill="#57534e" opacity="0.12" />
              <rect
                x={CYL_L - 4}
                y={Y_FULL - 26}
                width={CYL_R - CYL_L + 8}
                height={304 - (Y_FULL - 26)}
                rx="8"
                fill="none"
                stroke="#78716c"
                strokeWidth="3"
              />
              {/* Foot and pour lip: the parts that make it a cylinder rather
                  than a tube. */}
              <rect x={CYL_L - 26} y="304" width={CYL_R - CYL_L + 52} height="14" rx="6" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
              <ellipse cx={(CYL_L + CYL_R) / 2} cy={Y_FULL - 26} rx={(CYL_R - CYL_L) / 2 + 4} ry="5" fill="#ffffff" stroke="#78716c" strokeWidth="2.5" />
              <path d={`M${CYL_R + 4} ${Y_FULL - 28} q 14 2 15 14`} fill="none" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />

              <rect x={CYL_L} y={ySurface + ripple} width={CYL_R - CYL_L} height={Y_ZERO - ySurface - ripple} fill="#3BAFA9" opacity="0.7" />
              <path
                d={`M${CYL_L} ${ySurface + ripple} Q ${(CYL_L + CYL_R) / 2} ${ySurface + ripple + 8} ${CYL_R} ${ySurface + ripple}`}
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.5"
              />
              <line x1={CYL_L + 9} y1={Y_FULL - 6} x2={CYL_L + 9} y2="290" stroke="#ffffff" strokeWidth="4" opacity="0.55" />

              {/* Graduations. The long ticks are printed on the near wall, and
                  that is the plane the sightline has to cross. */}
              {Array.from({ length: 26 }, (_, i) => i * 2).map((ml) => {
                const y = yForVolume(ml)
                const major = ml % 10 === 0
                return (
                  <g key={ml}>
                    <line x1={major ? CYL_R - 22 : CYL_R - 11} y1={y} x2={CYL_R} y2={y} stroke="#57534e" strokeWidth={major ? 2 : 1} />
                    <line x1={CYL_L} y1={y} x2={CYL_L + (major ? 9 : 5)} y2={y} stroke="#57534e" strokeWidth={major ? 1.6 : 0.9} />
                    {major && (
                      <text x={CYL_L - 9} y={y + 4} fontSize="11" fontWeight="800" fill="#78716c" textAnchor="end">
                        {ml}
                      </text>
                    )}
                  </g>
                )
              })}
              <rect x={CYL_L + 6} y="84" width="52" height="17" rx="3" fill="#fff7ed" stroke="#d6d3d1" strokeWidth="1.5" />
              <text x={CYL_L + 32} y="96" fontSize="9.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                50 mL
              </text>
              <text x={(CYL_L + CYL_R) / 2} y={Y_FULL - 38} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
                mL
              </text>

              {/* ── Sightline ── */}
              <line x1={EYE_X - 8} y1={eyeY} x2={X_SURFACE} y2={ySurface} stroke={level ? '#0d9488' : '#dc2626'} strokeWidth="2" strokeDasharray="6 5" />
              <circle cx={X_SURFACE} cy={ySurface} r="3.5" fill={level ? '#0d9488' : '#dc2626'} />

              {/* Where that line crosses the scale is the number you read. */}
              <line x1={CYL_L - 4} y1={yRead} x2="212" y2={yRead} stroke="#f97316" strokeWidth="2.5" />
              <text x="218" y={yRead + 4} fontSize="13" fontWeight="900" fill="#f97316">
                {apparent.toFixed(1)} mL
              </text>

              {/* ── The eye, on the track the slider moves it along ── */}
              <line x1={EYE_X + 16} y1={EYE_TOP - 6} x2={EYE_X + 16} y2={EYE_BOTTOM + 6} stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 6" />
              <g>
                <ellipse cx={EYE_X + 16} cy={eyeY} rx="22" ry="13" fill="#ffffff" stroke="#78716c" strokeWidth="2.5" />
                <circle cx={EYE_X + 12} cy={eyeY} r="7" fill="#44403c" />
                <circle cx={EYE_X + 10} cy={eyeY - 2} r="2.4" fill="#ffffff" />
                <text x={EYE_X + 16} y={eyeY - 20} fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                  your eye
                </text>
              </g>
              {level && (
                <text x={EYE_X + 16} y={eyeY + 30} fontSize="11" fontWeight="900" fill="#0d9488" textAnchor="middle">
                  eye level
                </text>
              )}

              {/* ── Balance ── */}
              <ellipse cx={BAL_X + 88} cy={BENCH_Y + 2} rx="94" ry="5" fill="#57534e" opacity="0.12" />
              <rect x={BAL_X + 66} y="190" width="44" height="34" rx="3" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
              <line x1={BAL_X + 66} y1="200" x2={BAL_X + 110} y2="200" stroke="#b45309" strokeWidth="1.5" />
              <text x={BAL_X + 88} y="182" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                sample {index + 1}
              </text>
              <rect x={BAL_X + 36} y="224" width="104" height="11" rx="4" fill="#a8a29e" />
              <rect x={BAL_X + 74} y="234" width="28" height="16" fill="#a8a29e" />
              <rect x={BAL_X} y="250" width="176" height="58" rx="10" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
              <rect x={BAL_X + 10} y="308" width="14" height="10" rx="3" fill="#78716c" />
              <rect x={BAL_X + 152} y="308" width="14" height="10" rx="3" fill="#78716c" />
              <rect x={BAL_X + 14} y="262" width="112" height="32" rx="5" fill="#1c1917" />
              <text x={BAL_X + 116} y="285" fontSize="19" fontWeight="900" fill="#4ade80" textAnchor="end" fontFamily="ui-monospace, monospace">
                {balanceReading.toFixed(2)}
              </text>
              <text x={BAL_X + 24} y="285" fontSize="12" fontWeight="800" fill="#a8a29e">
                g
              </text>
              <rect x={BAL_X + 136} y="264" width="30" height="28" rx="7" fill={tared ? '#5eead4' : '#f5f5f4'} stroke="#78716c" strokeWidth="2" />
              <text x={BAL_X + 151} y="282" fontSize="8" fontWeight="900" fill="#44403c" textAnchor="middle">
                TARE
              </text>
              {!tared && (
                <text x={BAL_X + 88} y="338" fontSize="12" fontWeight="900" fill="#dc2626" textAnchor="middle">
                  empty pan: {TARE_ERROR_G.toFixed(2)} g
                </text>
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                level
                  ? 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
                  : 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-black text-stone-900 dark:text-white">
                  {apparent.toFixed(1)} mL
                </p>
                <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  true {sample.volume.toFixed(1)} mL
                </p>
              </div>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {level
                  ? 'Eye level with the surface, so the number is honest.'
                  : `Off by ${Math.abs(error).toFixed(1)} mL. Your eye is ${eyeY < ySurface ? 'above' : 'below'} the surface.`}
              </p>
            </div>

            <div>
              <label
                htmlFor="mb-eye"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Eye height
              </label>
              <input
                id="mb-eye"
                type="range"
                min={EYE_TOP}
                max={EYE_BOTTOM}
                step={1}
                value={eyeY}
                onChange={(e) => setEyeY(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Left is high, right is down at bench level.
              </p>
            </div>

            <button
              type="button"
              onClick={record}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
            >
              Record this reading
            </button>

            <div>
              <button
                type="button"
                onClick={tare}
                disabled={log.length === 0 || tared}
                className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
              >
                {tared ? 'Balance zeroed' : 'Zero (tare) the balance'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                {log.length === 0
                  ? 'Take a reading first. You need more than one mass to spot a pattern.'
                  : tared
                    ? 'The pan now reads 0.00 g empty, so every mass is the sample.'
                    : 'Look at your logged masses. Are they all out by the same amount?'}
              </p>
            </div>

            {message && (
              <p className="rounded-lg border-2 border-stone-200 bg-white px-2.5 py-2 text-xs font-medium text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200">
                {message}
              </p>
            )}

            {log.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Your logbook
                </p>
                <ul className="space-y-1">
                  {log.map((r, i) => (
                    <li
                      key={r.id}
                      className="rounded-lg border-2 border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200"
                    >
                      #{i + 1}: {r.volume} mL, {r.mass} g
                      {r.offsetAtTime > 0 && tared && (
                        <span className="ml-1 font-black text-rose-600 dark:text-rose-300">
                          (−{r.offsetAtTime.toFixed(2)} g)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Bench work
              </p>
              <ul className="space-y-1.5">
                <li
                  className={`rounded-lg border-2 px-2.5 py-1.5 ${
                    correctReads >= SAMPLES.length
                      ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                      : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                  }`}
                >
                  <p className="text-xs font-black text-stone-900 dark:text-white">
                    {correctReads >= SAMPLES.length ? '✓ Done: ' : `${correctReads} of ${SAMPLES.length}: `}
                    Volumes read at eye level
                  </p>
                </li>
                <li
                  className={`rounded-lg border-2 px-2.5 py-1.5 ${
                    tared
                      ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                      : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                  }`}
                >
                  <p className="text-xs font-black text-stone-900 dark:text-white">
                    {tared ? '✓ Done: ' : 'Not yet: '}
                    Balance zeroed
                  </p>
                </li>
              </ul>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        Apparent reading {apparent.toFixed(1)} millilitres, true level{' '}
        {sample.volume.toFixed(1)} millilitres. Balance {balanceReading.toFixed(2)} grams.
      </p>
    </>
  )
}
