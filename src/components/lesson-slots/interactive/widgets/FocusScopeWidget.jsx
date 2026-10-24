import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w11-l1 signature interactive: a microscope that punishes the coarse knob.
//
// The blur is a real Gaussian on the field of view, and how much of it there is
// comes out of one number: how far the stage sits from the focal plane, divided
// by the depth of field of the objective in the light path. At 4x that band is
// ten micrometres wide and the coarse knob is harmless. At 40x it is eight
// tenths, one coarse step is two, and the lens goes into the glass.
//
// The barrel lengths are not decoration. Each objective is drawn exactly long
// enough that its tip meets the slide at the coarse setting that cracks it, so
// the crash is something a student can watch closing rather than a message.
//
// The coverslip is the other half. Dropped flat it traps air, and the bubbles
// are then in the field of view with black rims, in the way, until the student
// remounts it on an edge.
//
// The scene paints its own wall and bench, so its contrast is the same on cream
// and on stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall and bench run past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 300

const INK = '#57534e'
const INK_MID = '#78716c'
const STEEL = '#a8a29e'
const GLASS = '#DDEEFF'
const BRASS = '#F59E0B'

// The turret hangs here, and every barrel length below is measured off it.
const TURRET_X = 150
const TURRET_Y = 132

const FOCAL_Z = 60

// `barrel` is chosen so the objective tip reaches the slide at exactly its
// `crashZ`: the slide top sits at 214 - coarse * 0.28333 and the barrel starts
// 18 below the turret centre. Move one of those and the others follow.
const OBJECTIVES = [
  { power: 4, depth: 10, crashZ: Infinity, cells: 1, barrel: 28 },
  { power: 10, depth: 4, crashZ: 108, cells: 2.1, barrel: 33 },
  { power: 40, depth: 0.8, crashZ: 64, cells: 5.4, barrel: 46 },
]

const SHARP_BLUR = 0.9

const FIELD_X = 470
const FIELD_Y = 130
const FIELD_R = 92

const bubblesFor = (angle) => (angle < 10 ? 4 : angle < 22 ? 2 : 0)

// The lab the instrument stands in. Wall, bench edge and floor all run past the
// viewBox, so the scene covers the frame however it is cropped.
function Room() {
  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
      <line x1={-BLEED} y1="96" x2={W + BLEED} y2="96" stroke="#efe6d6" strokeWidth="2" />
      <rect x={-BLEED} y={BENCH_Y} width={W + BLEED * 2} height="13" fill="#e7d9c3" />
      <rect x={-BLEED} y={BENCH_Y + 13} width={W + BLEED * 2} height={H + BLEED} fill="#f3ead9" />
    </g>
  )
}

// Foot, lamp, condenser, stage, turret, body tube and the two focus knobs.
// Both knobs turn with the slider that drives them, so the control and the part
// it moves are visibly the same thing.
function Microscope({ objective, index, coarse, fine, stageY, cracked }) {
  const tip = TURRET_Y + 18 + objective.barrel
  const spares = OBJECTIVES.map((_, i) => i).filter((i) => i !== index)

  return (
    <g>
      {/* Foot and lamp housing. */}
      <ellipse cx="144" cy={BENCH_Y + 2} rx="96" ry="6" fill={INK} opacity="0.12" />
      <rect x="58" y="292" width="176" height="8" rx="3" fill="#44403c" />
      <path d="M 70 292 L 222 292 L 206 270 L 86 270 Z" fill={INK} />
      <rect x="120" y="256" width="60" height="20" rx="6" fill="#44403c" />
      <circle cx="150" cy="256" r="9" fill="#FDE68A" stroke={INK_MID} strokeWidth="2" />
      <text x="150" y="288" fontSize="10" fontWeight="800" fill={STEEL} textAnchor="middle">
        lamp
      </text>

      {/* Light climbing from the lamp through the condenser into the slide. */}
      <path
        d={`M 141 250 L 159 250 L 170 ${stageY + 2} L 130 ${stageY + 2} Z`}
        fill="#FDE68A"
        opacity="0.45"
      />

      {/* Condenser and iris diaphragm, riding just under the stage. */}
      <rect x="132" y={stageY + 11} width="36" height="8" rx="3" fill={STEEL} />
      <circle cx="150" cy={stageY + 24} r="9" fill={INK_MID} />
      <circle cx="150" cy={stageY + 24} r="4" fill="#FDE68A" />
      <rect x="159" y={stageY + 21} width="20" height="6" rx="3" fill={INK} />

      {/* Stage, clips, and the slide the objective is closing in on. */}
      <rect x="92" y={stageY} width="116" height="10" rx="3" fill={STEEL} />
      <path d={`M 104 ${stageY} l 0 -9 l 16 0`} fill="none" stroke={INK} strokeWidth="3" />
      <path d={`M 196 ${stageY} l 0 -9 l -16 0`} fill="none" stroke={INK} strokeWidth="3" />
      <rect
        x="110"
        y={stageY - 6}
        width="80"
        height="6"
        rx="1.5"
        fill={cracked ? '#FCA5A5' : GLASS}
        stroke={cracked ? '#DC2626' : INK_MID}
        strokeWidth="1.6"
      />
      {cracked && (
        <path
          d={`M 126 ${stageY - 6} l 7 6 M 148 ${stageY} l 6 -6 l -1 6 M 172 ${stageY - 6} l -5 6`}
          stroke="#DC2626"
          strokeWidth="2"
          fill="none"
        />
      )}

      {/* Arm, body tube and eyepiece. */}
      <path
        d="M 212 286 Q 228 286 228 262 L 228 142 Q 228 112 198 108 L 172 108"
        fill="none"
        stroke={INK_MID}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <rect x="136" y="74" width="28" height="62" fill={INK_MID} />
      <rect x="139" y="74" width="5" height="62" fill={STEEL} opacity="0.5" />
      <rect x="131" y="54" width="38" height="22" rx="6" fill="#44403c" />
      <ellipse cx="150" cy="54" rx="19" ry="5" fill={STEEL} />
      <text x="150" y="44" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        eyepiece 10x
      </text>

      {/* Turret: the two spare objectives swing out of the light path and the
          chosen one hangs straight down over the slide. */}
      {spares.map((si, k) => (
        <g key={si} transform={`rotate(${k === 0 ? -56 : 56} ${TURRET_X} ${TURRET_Y})`}>
          <rect x={TURRET_X - 6} y={TURRET_Y + 14} width="12" height="24" rx="4" fill={STEEL} />
        </g>
      ))}
      <circle cx={TURRET_X} cy={TURRET_Y} r="20" fill={INK} />
      <circle cx={TURRET_X} cy={TURRET_Y} r="8" fill="#44403c" />
      <rect
        x={TURRET_X - 8}
        y={TURRET_Y + 14}
        width="16"
        height={objective.barrel}
        rx="4"
        fill={BRASS}
      />
      <rect x={TURRET_X - 8} y={tip - 9} width="16" height="9" rx="3" fill="#b45309" />
      <ellipse cx={TURRET_X} cy={tip} rx="6" ry="2" fill={GLASS} />

      <line
        x1="138"
        y1={TURRET_Y + 32}
        x2="104"
        y2={TURRET_Y + 32}
        stroke={INK_MID}
        strokeWidth="1.5"
      />
      <text x="100" y={TURRET_Y + 36} fontSize="11" fontWeight="800" fill="#b45309" textAnchor="end">
        {objective.power}x objective
      </text>

      {/* Focus knobs: coarse outside, fine on the same shaft. */}
      <g transform={`rotate(${coarse * 2.4} 228 206)`}>
        <circle cx="228" cy="206" r="20" fill="#44403c" />
        {[0, 45, 90, 135].map((a) => (
          <line
            key={a}
            x1={228 - Math.cos((a * Math.PI) / 180) * 18}
            y1={206 - Math.sin((a * Math.PI) / 180) * 18}
            x2={228 + Math.cos((a * Math.PI) / 180) * 18}
            y2={206 + Math.sin((a * Math.PI) / 180) * 18}
            stroke={INK_MID}
            strokeWidth="2"
          />
        ))}
      </g>
      <g transform={`rotate(${fine * 3.6} 228 206)`}>
        <circle cx="228" cy="206" r="10" fill={STEEL} />
        <line x1="228" y1="206" x2="228" y2="197" stroke="#b45309" strokeWidth="2.5" />
      </g>
      <text x="228" y="242" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
        focus knobs
      </text>
    </g>
  )
}

// The wet mount being made on the bench beside the instrument, so the angle the
// coverslip goes down at is a thing the student can see, not a number.
function WetMount({ angle, mounted, bubbles }) {
  const slipY = mounted ? 283 : 258

  return (
    <g>
      <text x="300" y="248" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        wet mount
      </text>
      <ellipse cx="300" cy={BENCH_Y + 2} rx="50" ry="4" fill={INK} opacity="0.12" />
      <rect
        x="256"
        y="288"
        width="88"
        height="9"
        rx="2"
        fill={GLASS}
        stroke={INK_MID}
        strokeWidth="1.6"
      />
      <path d="M 280 288 q 20 -11 40 0 z" fill="#7BC9CF" opacity="0.6" />
      <ellipse cx="300" cy="285" rx="7" ry="3" fill="#0f766e" opacity="0.7" />

      {!mounted && (
        <line
          x1="352"
          y1="236"
          x2="322"
          y2={slipY - angle * 0.4}
          stroke={INK_MID}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      <g transform={`rotate(${mounted ? 0 : -angle} 300 ${slipY})`}>
        <rect
          x="274"
          y={slipY - 3}
          width="52"
          height="5"
          rx="1.5"
          fill="#7BC9CF"
          stroke="#0f766e"
          strokeWidth="1.5"
        />
      </g>

      {mounted &&
        Array.from({ length: bubbles }, (_, i) => (
          <circle
            key={i}
            cx={282 + i * 12}
            cy="286"
            r="3.6"
            fill="#fdfaf3"
            stroke="#1c1917"
            strokeWidth="1.6"
          />
        ))}

      <text
        x="300"
        y="316"
        fontSize="11"
        fontWeight="800"
        fill={mounted && !bubbles ? '#0f766e' : '#b45309'}
        textAnchor="middle"
      >
        {mounted ? (bubbles ? `${bubbles} bubbles trapped` : 'no bubbles') : `coverslip at ${angle} deg`}
      </text>
    </g>
  )
}

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

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
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
  const stageY = 220 - (coarse / 120) * 34
  const cell = 13 * objective.cells
  const statusWord = cracked ? 'cracked' : sharp ? 'sharp' : 'blurred'
  const statusTint = cracked ? '#DC2626' : sharp ? '#0f766e' : '#b45309'
  const title = cracked
    ? 'Slide cracked.'
    : sharp
      ? `Sharp at ${objective.power}×.`
      : `Blurred at ${objective.power}×.`
  const note = cracked
    ? 'The lens was driven into the glass. Fit a fresh slide.'
    : sharp
      ? `Total magnification ${objective.power * 10}×.`
      : `Stage is ${Math.abs(z - FOCAL_Z).toFixed(2)} µm off the focal plane.`

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${title} ${note} ${
                mounted ? `${bubbles} air bubbles in the mount.` : 'No coverslip yet.'
              }`}
              style={stageFill(W, H)}
            >
              <defs>
                <filter id="fs-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation={blur.toFixed(2)} />
                </filter>
                <clipPath id="fs-field">
                  <circle cx={FIELD_X} cy={FIELD_Y} r={FIELD_R} />
                </clipPath>
              </defs>

              <Room />
              <Microscope
                objective={objective}
                index={index}
                coarse={coarse}
                fine={fine}
                stageY={stageY}
                cracked={cracked}
              />
              <WetMount angle={angle} mounted={mounted} bubbles={bubbles} />

              {/* What the eyepiece shows. */}
              <rect
                x="424"
                y="14"
                width="92"
                height="20"
                rx="5"
                fill="#fff7ed"
                stroke="#e7e5e4"
                strokeWidth="1.5"
              />
              <text x="470" y="28" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
                field of view
              </text>
              <circle
                cx={FIELD_X}
                cy={FIELD_Y}
                r={FIELD_R + 9}
                fill="#e7e5e4"
                stroke={INK_MID}
                strokeWidth="2.5"
              />
              <circle cx={FIELD_X} cy={FIELD_Y} r={FIELD_R} fill="#FDF7EC" stroke={INK} strokeWidth="2" />

              <g clipPath="url(#fs-field)" filter="url(#fs-blur)">
                {Array.from({ length: 7 }, (_, r) =>
                  Array.from({ length: 7 }, (_, c) => {
                    const x = FIELD_X - FIELD_R + c * cell + drift
                    const y = FIELD_Y - FIELD_R + r * cell * 0.72 + drift * 0.6
                    const w = cell - 2
                    const h = cell * 0.72 - 2
                    return (
                      <g key={`${r}-${c}`}>
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="3"
                          fill="#F3E6CE"
                          stroke="#8A6A4A"
                          strokeWidth="2.4"
                        />
                        <rect
                          x={x + 2}
                          y={y + 2}
                          width={Math.max(0, w - 4)}
                          height={Math.max(0, h - 4)}
                          rx="2"
                          fill="#C7E3D8"
                          opacity="0.6"
                        />
                        <circle
                          cx={x + w * 0.5}
                          cy={y + h * 0.5}
                          r={Math.max(1.4, cell * 0.12)}
                          fill="#7C3AED"
                          opacity="0.75"
                        />
                        <circle
                          cx={x + w * 0.5}
                          cy={y + h * 0.5}
                          r={Math.max(0.6, cell * 0.05)}
                          fill="#4C1D95"
                        />
                      </g>
                    )
                  }),
                )}
                {mounted &&
                  Array.from({ length: bubbles }, (_, i) => (
                    <circle
                      key={i}
                      cx={420 + i * 34}
                      cy={110 + (i % 2) * 46}
                      r={15 + i * 2}
                      fill="#FDF7EC"
                      stroke="#1c1917"
                      strokeWidth="4"
                    />
                  ))}
                {cracked && (
                  <path
                    d="M 384 62 L 444 122 L 418 140 L 486 202 M 444 122 L 504 90 L 560 138"
                    stroke="#44403c"
                    strokeWidth="4"
                    fill="none"
                  />
                )}
              </g>

              {/* Wall card: the live numbers, inside the picture. */}
              <rect
                x="366"
                y="234"
                width="216"
                height="56"
                rx="6"
                fill="#fff7ed"
                stroke="#e7e5e4"
                strokeWidth="1.5"
              />
              <circle cx="474" cy="234" r="3.5" fill={STEEL} />
              <text x="378" y="252" fontSize="9" fontWeight="800" fill={INK_MID}>
                TOTAL MAGNIFICATION
              </text>
              <text x="378" y="278" fontSize="22" fontWeight="900" fill={INK}>
                {objective.power * 10}x
              </text>
              <text x="570" y="254" fontSize="13" fontWeight="900" fill={statusTint} textAnchor="end">
                {statusWord}
              </text>
              <text x="570" y="278" fontSize="10.5" fontWeight="800" fill={INK_MID} textAnchor="end">
                sharp band {objective.depth} um
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
              <p className="text-sm font-black text-stone-900 dark:text-white">{title}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{note}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Objective lens
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
                    {o.power}&times;
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="fs-coarse"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Coarse focus: {coarse} &micro;m
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
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Big steps, 2 &micro;m each. Safe at low power only.
              </p>
            </div>

            <div>
              <label
                htmlFor="fs-fine"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Fine focus: {(fine * 0.04).toFixed(2)} &micro;m
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
                Steps of 0.04 &micro;m. The only knob that works at 40&times;.
              </p>
            </div>

            <div>
              <label
                htmlFor="fs-angle"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Coverslip angle: {angle}&deg;
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
                {mounted ? 'Lower it again' : 'Lower coverslip'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                Dropped flat, the air underneath has nowhere to go.
              </p>
            </div>

            <button
              type="button"
              onClick={freshSlide}
              className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors dark:bg-accent-700/25 dark:text-accent-100"
            >
              Fresh slide
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Bench work: {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['lowpower', 'Focused at 4× first'],
                  ['sharp', 'Sharp at 40×, slide intact'],
                  ['mount', 'Coverslip down with no bubbles'],
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
                        {ok ? '✓ Done: ' : 'Not yet: '}
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
        {title} {note} {mounted ? `${bubbles} bubbles in the mount.` : 'No coverslip yet.'}
      </p>
    </>
  )
}
