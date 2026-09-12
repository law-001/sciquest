import React, { useEffect, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w05-l2 signature interactive — reading a cylinder, and a balance that lies.
//
// The eye really does sight along a line. The graduations are on the near wall
// and the liquid surface is behind them, so the line of sight crosses the scale
// somewhere other than the true level unless the eye is level with it. The
// number the student records is computed from that crossing, which means a
// wrong eye height gives a wrong answer rather than a warning message.
//
// The balance beside it reads 2.40 g with nothing on the pan. It shifts every
// mass by exactly that amount until it is zeroed — the same error every time,
// which is what makes it systematic rather than random.

const W = 620
const H = 360

// Cylinder interior, in SVG units.
const CYL_L = 100
const CYL_R = 164
const Y_ZERO = 300
const Y_FULL = 80
const FULL_ML = 50

// Parallax geometry: the scale is printed on the near wall, the surface sits
// behind it, and the eye is further out still.
const X_SCALE = 158
const X_SURFACE = 118
const EYE_X = 330
const T = (X_SCALE - EYE_X) / (X_SURFACE - EYE_X)

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
        `Recorded ${apparent.toFixed(1)} mL — that is ${Math.abs(error).toFixed(1)} mL ${
          error > 0 ? 'too high' : 'too low'
        }. Your eye is ${eyeY < ySurface ? 'above' : 'below'} the surface, so you are sighting across the scale at an angle.`,
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
    setMessage(
      `Recorded ${apparent.toFixed(1)} mL and ${balanceReading.toFixed(2)} g. Eye level, so the sightline crosses the scale exactly at the surface.`,
    )
    setIndex((i) => (i + 1) % SAMPLES.length)
    if (nextLog.filter((r) => r.ok).length >= SAMPLES.length && tared) onSolved?.()
  }

  function tare() {
    setOffset(0)
    setTared(true)
    setMessage(
      `Zeroed. Every mass above was ${TARE_ERROR_G.toFixed(2)} g too heavy — the same amount every single time. An error that repeats identically is systematic, and it is fixed at the instrument, not by averaging.`,
    )
    if (correctReads >= SAMPLES.length) onSolved?.()
  }

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`Graduated cylinder holding ${sample.volume} millilitres. From the current eye height it appears to read ${apparent.toFixed(1)} millilitres. The balance shows ${balanceReading.toFixed(2)} grams.`}
              style={STAGE_MEDIA}
            >
              {/* ── Graduated cylinder ── */}
              <rect x={CYL_L - 4} y={Y_FULL - 22} width={CYL_R - CYL_L + 8} height={Y_ZERO - Y_FULL + 30} rx="8" fill="none" stroke="#78716c" strokeWidth="3" />
              <rect x={CYL_L - 22} y={Y_ZERO + 8} width={CYL_R - CYL_L + 44} height="12" rx="5" fill="#78716c" />

              <rect x={CYL_L} y={ySurface + ripple} width={CYL_R - CYL_L} height={Y_ZERO - ySurface - ripple} fill="#3BAFA9" opacity="0.7" />
              <path
                d={`M${CYL_L} ${ySurface + ripple} Q ${(CYL_L + CYL_R) / 2} ${ySurface + ripple + 8} ${CYL_R} ${ySurface + ripple}`}
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Graduations, printed on the near wall — this is the plane the
                  sightline has to cross. */}
              {Array.from({ length: 11 }, (_, i) => i * 5).map((ml) => {
                const y = yForVolume(ml)
                const major = ml % 10 === 0
                return (
                  <g key={ml}>
                    <line x1={major ? CYL_R - 22 : CYL_R - 13} y1={y} x2={CYL_R} y2={y} stroke="#57534e" strokeWidth={major ? 2 : 1.2} />
                    {major && (
                      <text x={CYL_L - 10} y={y + 4} fontSize="11" fontWeight="800" fill="#78716c" textAnchor="end">
                        {ml}
                      </text>
                    )}
                  </g>
                )
              })}
              <text x={(CYL_L + CYL_R) / 2} y={Y_FULL - 32} fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
                mL
              </text>

              {/* ── Sightline ── */}
              <line x1={EYE_X - 10} y1={eyeY} x2={X_SURFACE} y2={ySurface} stroke={level ? '#0d9488' : '#dc2626'} strokeWidth="2" strokeDasharray="6 5" />
              <circle cx={X_SURFACE} cy={ySurface} r="3.5" fill={level ? '#0d9488' : '#dc2626'} />

              {/* Where that line crosses the scale is the number you read. */}
              <line x1={CYL_L - 30} y1={yRead} x2={X_SCALE + 26} y2={yRead} stroke="#f97316" strokeWidth="2.5" />
              <text x={X_SCALE + 32} y={yRead + 4} fontSize="13" fontWeight="900" fill="#f97316">
                {apparent.toFixed(1)} mL
              </text>

              {/* ── The eye ── */}
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
                  level with the surface
                </text>
              )}

              {/* ── Balance ── */}
              <rect x="430" y="244" width="164" height="62" rx="10" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
              <rect x="448" y="258" width="128" height="30" rx="5" fill="#1c1917" />
              <text x="566" y="280" fontSize="19" fontWeight="900" fill="#4ade80" textAnchor="end" fontFamily="ui-monospace, monospace">
                {balanceReading.toFixed(2)}
              </text>
              <text x="460" y="280" fontSize="12" fontWeight="800" fill="#a8a29e">
                g
              </text>
              <rect x="462" y="228" width="100" height="10" rx="4" fill="#a8a29e" />
              <rect x="492" y="204" width="40" height="24" rx="4" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <text x="512" y="196" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                sample {index + 1}
              </text>
              {!tared && (
                <text x="512" y="322" fontSize="11.5" fontWeight="900" fill="#dc2626" textAnchor="middle">
                  reads {TARE_ERROR_G.toFixed(2)} g with an empty pan
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
              <p className="text-sm font-black text-stone-900 dark:text-white">
                Reads {apparent.toFixed(1)} mL — true level {sample.volume.toFixed(1)} mL
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {level
                  ? 'Eye level with the surface. The sightline crosses the scale exactly where the liquid is, so the number is honest.'
                  : `Off by ${Math.abs(error).toFixed(1)} mL. Your eye is ${eyeY < ySurface ? 'above' : 'below'} the surface and the sightline crosses the scale ${error > 0 ? 'above' : 'below'} the real level.`}
              </p>
            </div>

            <div>
              <label
                htmlFor="mb-eye"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Drag the eye up and down
              </label>
              <input
                id="mb-eye"
                type="range"
                min={70}
                max={320}
                step={1}
                value={eyeY}
                onChange={(e) => setEyeY(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Left is high above the bench, right is down at bench level.
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
                  ? 'Take a reading first — you need more than one mass before you can tell whether the balance is wrong the same way every time.'
                  : tared
                    ? 'The pan now reads 0.00 g empty, so every mass from here is the sample and nothing else.'
                    : 'Look at the masses you have logged. Are they all out by the same amount?'}
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
                      #{i + 1} — {r.volume} mL, {r.mass} g
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
                    {correctReads >= SAMPLES.length ? '✓ Done — ' : `${correctReads} of ${SAMPLES.length} — `}
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
                    {tared ? '✓ Done — ' : 'Not yet — '}
                    Systematic error found and fixed
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
