import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w11-l1 signature interactive — a microscope that punishes the coarse knob.
//
// The blur is a real Gaussian on the field of view, and how much of it there is
// comes out of one number: how far the stage is from the focal plane, divided
// by the depth of field of the objective currently in the light path. At 4x the
// depth of field is ten units wide and the coarse knob is fine. At 40x it is
// eight tenths of a unit, one coarse step is two units, and the lens goes into
// the slide. Nothing warns the student about this — the slide simply cracks.
//
// The coverslip is the other half. Dropped flat it traps air, and the bubbles
// are then in the field of view with perfect black rims, in the way, until the
// student remounts at an angle.

const W = 620
const H = 340

const FOCAL_Z = 60

const OBJECTIVES = [
  { power: 4, label: '4× low power', depth: 10, crashZ: Infinity, cells: 1 },
  { power: 10, label: '10× medium power', depth: 4, crashZ: 108, cells: 2.1 },
  { power: 40, label: '40× high power', depth: 0.8, crashZ: 64, cells: 5.4 },
]

const SHARP_BLUR = 0.9

const bubblesFor = (angle) => (angle < 10 ? 4 : angle < 22 ? 2 : 0)

export default function FocusScopeWidget({ onSolved }) {
  const [coarse, setCoarse] = useState(20)
  const [fine, setFine] = useState(0)
  const [index, setIndex] = useState(0)
  const [angle, setAngle] = useState(5)
  const [mounted, setMounted] = useState(false)
  const [bubbles, setBubbles] = useState(0)
  const [cracked, setCracked] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const stillRef = useRef(false)

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    stillRef.current = still
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 90)
    return () => clearInterval(id)
  }, [])

  const objective = OBJECTIVES[index]
  const z = coarse + fine * 0.04
  const blur = cracked ? 9 : Math.min(9, (Math.abs(z - FOCAL_Z) / objective.depth) * 2.2)
  const sharp = blur < SHARP_BLUR

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 3) onSolved?.()
  }

  // Everything that can go right is checked from the state the student has
  // actually produced, never from which button they pressed.
  function settle(nextCoarse, nextFine, nextIndex, nextCracked) {
    const nz = nextCoarse + nextFine * 0.04
    const obj = OBJECTIVES[nextIndex]
    const nb = Math.min(9, (Math.abs(nz - FOCAL_Z) / obj.depth) * 2.2)
    if (nextCracked || nb >= SHARP_BLUR) return
    if (obj.power === 4) win('lowpower')
    if (obj.power === 40) win('sharp')
  }

  function changeCoarse(value) {
    let broke = cracked
    if (!cracked && value > objective.crashZ) {
      broke = true
      setCracked(true)
    }
    setCoarse(value)
    settle(value, fine, index, broke)
  }

  function changeFine(value) {
    setFine(value)
    settle(coarse, value, index, cracked)
  }

  function changeObjective(next) {
    setIndex(next)
    let broke = cracked
    if (!cracked && coarse > OBJECTIVES[next].crashZ) {
      broke = true
      setCracked(true)
    }
    settle(coarse, fine, next, broke)
  }

  function lowerCoverslip() {
    const b = bubblesFor(angle)
    setMounted(true)
    setBubbles(b)
    if (b === 0) win('mount')
  }

  function freshSlide() {
    setCracked(false)
    setMounted(false)
    setBubbles(0)
    setCoarse(20)
    setFine(0)
    setIndex(0)
  }

  const drift = Math.sin(tick * 0.16) * 1.6
  const stageY = 214 - (coarse / 120) * 26
  const cell = 13 * objective.cells
  const status = cracked
    ? 'Slide cracked. The objective was driven straight into the glass.'
    : sharp
      ? `Sharp at ${objective.power}×.`
      : `${objective.power}× — out of focus. Depth of field here is ${objective.depth} µm.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${status} ${bubbles} air bubbles in the mount.`} style={STAGE_MEDIA}>
              <defs>
                <filter id="fs-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation={blur.toFixed(2)} />
                </filter>
                <clipPath id="fs-field">
                  <circle cx="440" cy="168" r="96" />
                </clipPath>
              </defs>

              {/* ── The instrument ── */}
              <rect x="52" y="296" width="188" height="18" rx="8" fill="#57534e" />
              <path d="M 146 296 L 146 128 Q 146 100 174 100 L 200 100" fill="none" stroke="#78716c" strokeWidth="14" strokeLinecap="round" />
              <rect x="192" y="74" width="28" height="42" rx="7" fill="#44403c" />
              <text x="206" y="66" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                eyepiece 10×
              </text>

              {/* Turret: the chosen objective swings into the light path. */}
              <circle cx="152" cy="158" r="26" fill="#57534e" />
              {OBJECTIVES.map((o, i) => {
                const chosen = i === index
                const a = ((i - index) * 46 - 90) * (Math.PI / 180)
                const len = chosen ? 30 + o.power * 0.42 : 18
                return (
                  <g key={o.power} transform={`translate(${152 + Math.cos(a) * 20} ${158 + Math.sin(a) * 20}) rotate(${(i - index) * 46})`}>
                    <rect x="-6" y="0" width="12" height={len} rx="4" fill={chosen ? '#F59E0B' : '#a8a29e'} />
                    <text x="0" y={len + 12} fontSize="9" fontWeight="900" fill={chosen ? '#b45309' : '#a8a29e'} textAnchor="middle">
                      {o.power}×
                    </text>
                  </g>
                )
              })}

              {/* Stage and slide */}
              <rect x="98" y={stageY} width="112" height="9" rx="3" fill="#a8a29e" />
              <rect x="116" y={stageY - 5} width="74" height="5" rx="2" fill={cracked ? '#DC2626' : '#DDEEFF'} stroke="#78716c" strokeWidth="1.4" />
              {cracked && (
                <path d={`M 122 ${stageY - 5} l 10 5 l -6 0 l 12 -5 M 158 ${stageY} l 8 -5 l -2 5 l 10 -5`} stroke="#DC2626" strokeWidth="2" fill="none" />
              )}
              <circle cx="118" cy={stageY + 42} r="15" fill="#57534e" />
              <circle cx="118" cy={stageY + 42} r="6" fill="#a8a29e" />
              <circle cx="118" cy={stageY + 42} r="26" fill="none" stroke="#78716c" strokeWidth="4" />
              <text x="118" y={stageY + 84} fontSize="10" fontWeight="800" fill="#78716c" textAnchor="middle">
                coarse / fine
              </text>

              {/* Coverslip, shown at the angle it will be lowered at. */}
              <g transform={`translate(238 ${mounted ? 250 : 210})`}>
                <rect x="0" y="0" width="56" height="4" rx="2" fill="#7BC9CF" stroke="#0f766e" strokeWidth="1.4" transform={`rotate(${mounted ? 0 : -angle})`} />
                <text x="28" y="24" fontSize="10" fontWeight="800" fill="#0f766e" textAnchor="middle">
                  {mounted ? `mounted — ${bubbles} bubbles` : `coverslip at ${angle}°`}
                </text>
              </g>

              {/* ── Field of view ── */}
              <circle cx="440" cy="168" r="96" fill="#FDF7EC" stroke="#78716c" strokeWidth="3" />
              <g clipPath="url(#fs-field)" filter="url(#fs-blur)">
                {Array.from({ length: 7 }, (_, r) =>
                  Array.from({ length: 7 }, (_, c) => {
                    const x = 440 - 96 + c * cell + drift
                    const y = 168 - 96 + r * cell * 0.72 + drift * 0.6
                    return (
                      <g key={`${r}-${c}`}>
                        <rect x={x} y={y} width={cell - 2} height={cell * 0.72 - 2} rx="3" fill="#C7E3D8" stroke="#0f766e" strokeWidth="1.5" />
                        <circle cx={x + cell * 0.5} cy={y + cell * 0.36} r={Math.max(1.4, cell * 0.11)} fill="#7C3AED" opacity="0.75" />
                      </g>
                    )
                  }),
                )}
                {mounted &&
                  Array.from({ length: bubbles }, (_, i) => (
                    <circle
                      key={i}
                      cx={396 + i * 32}
                      cy={150 + (i % 2) * 44}
                      r={16 + i * 2}
                      fill="#FDF7EC"
                      stroke="#1c1917"
                      strokeWidth="4"
                    />
                  ))}
                {cracked && (
                  <path d="M 350 100 L 410 160 L 384 178 L 452 240 M 410 160 L 470 128 L 530 176" stroke="#44403c" strokeWidth="4" fill="none" />
                )}
              </g>
              <text x="440" y="288" fontSize="13" fontWeight="900" fill={cracked ? '#DC2626' : sharp ? '#0f766e' : '#b45309'} textAnchor="middle">
                {cracked ? 'slide cracked' : sharp ? `sharp — total ${objective.power * 10}×` : `blur ${blur.toFixed(1)}`}
              </text>
              <text x="440" y="308" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                {mounted ? (bubbles ? `${bubbles} air bubbles in the way` : 'clean mount, no bubbles') : 'no coverslip yet'}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                cracked
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : sharp
                    ? 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
                    : 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-600/20'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                {cracked
                  ? 'The coarse knob moves the stage two micrometres a step. At 40× the whole sharp band is less than one. Fit a fresh slide and use fine focus only.'
                  : `Stage at ${z.toFixed(2)} µm, focal plane at ${FOCAL_Z}. You are ${Math.abs(z - FOCAL_Z).toFixed(2)} µm out.`}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Objective in the light path
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {OBJECTIVES.map((o, i) => (
                  <button
                    key={o.power}
                    type="button"
                    onClick={() => changeObjective(i)}
                    className={`min-h-11 rounded-xl border-2 px-1 py-2 text-xs font-black transition-colors ${
                      i === index
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {o.power}×
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="fs-coarse" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Coarse focus — {coarse} µm
              </label>
              <input
                id="fs-coarse"
                type="range"
                min={0}
                max={120}
                step={2}
                value={coarse}
                onChange={(e) => changeCoarse(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
            </div>

            <div>
              <label htmlFor="fs-fine" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Fine focus — {(fine * 0.04).toFixed(2)} µm
              </label>
              <input
                id="fs-fine"
                type="range"
                min={-50}
                max={50}
                step={1}
                value={fine}
                onChange={(e) => changeFine(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Fine moves the stage by four hundredths of a micrometre a step. That is why
                it is the only knob that can find focus at 40×.
              </p>
            </div>

            <div>
              <label htmlFor="fs-angle" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Coverslip angle — {angle}°
              </label>
              <input
                id="fs-angle"
                type="range"
                min={0}
                max={45}
                step={1}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <button
                type="button"
                onClick={lowerCoverslip}
                className="mt-1 min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600"
              >
                {mounted ? 'Lift and lower it again' : 'Lower the coverslip'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                Dropped flat, the air under it has nowhere to go. Lowered on one edge, the
                water pushes the air out ahead of the glass.
              </p>
            </div>

            <button
              type="button"
              onClick={freshSlide}
              className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors dark:bg-accent-700/25 dark:text-accent-100"
            >
              Fit a fresh slide
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Bench work — {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['lowpower', 'Focus found at 4× first'],
                  ['sharp', 'Sharp at 40× with the slide still intact'],
                  ['mount', 'Bubble-free mount'],
                ].map(([id, text]) => {
                  const ok = wins.includes(id)
                  return (
                    <li
                      key={id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 ${
                        ok
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {ok ? '✓ Done — ' : 'Not yet — '}
                        {text}
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
        {status} {mounted ? `${bubbles} bubbles in the mount.` : 'No coverslip yet.'}
      </p>
    </>
  )
}
