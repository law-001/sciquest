import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w15-l2 signature interactive: the gametes come out of where you dragged.
//
// Four chromatids, six gene loci each. Two of the four are left alone; the
// inner two swap everything below the crossover point. So the gene bands on
// the four gametes at the end are not an illustration of recombination, they
// are computed from the slider, and moving it by one gene changes two of the
// four gametes on screen.
//
// The counter strip along the bottom is the other half of the lesson: it reads
// 2n through the tetrad, halves at the end of meiosis I, and then does not
// halve again. Students routinely think meiosis II halves it a second time;
// here they can watch that it does not.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The background runs past the viewBox on every side so a cropped edge never
// shows a seam. Nothing readable goes in that margin.
const BLEED = 60

// Readable content stays between x 60 and x 560 and y 40 and y 362, because
// `slice` crops up to about 60 units off whichever axis runs long.
const CX = 310
const LOCI = 6
const GENES = ['A', 'B', 'C', 'D', 'E', 'F']

const BG = '#E4EBEF'
const INK = '#44403c'
const INK_MID = '#6B6259'
const MATERNAL = '#EA580C'
const PATERNAL = '#0E7490'
const CYTO = '#FDE8D7'
const MEMBRANE = '#B45309'
const CENTROMERE = '#44403c'

const STEPS = [
  {
    id: 'tetrad',
    name: 'Prophase I: the tetrad',
    count: '2n = 46, 92 chromatids',
    note: 'Matching chromosomes pair up. Each is already two chromatids, so four strands lie together.',
  },
  {
    id: 'meiosis1',
    name: 'After meiosis I',
    count: 'n = 23, 46 chromatids',
    note: 'The pair is pulled apart. This is the division that halves the count.',
  },
  {
    id: 'meiosis2',
    name: 'After meiosis II',
    count: 'n = 23, 23 chromatids',
    note: 'The chromatids separate. Four gametes, and no two of them match.',
  },
]

// Four chromatids. The outer two keep their parent's genes all the way; the
// inner two exchange everything from the crossover point onward.
function chromatids(cut) {
  return [
    Array.from({ length: LOCI }, () => 'M'),
    Array.from({ length: LOCI }, (_, i) => (i >= cut && cut > 0 ? 'P' : 'M')),
    Array.from({ length: LOCI }, (_, i) => (i >= cut && cut > 0 ? 'M' : 'P')),
    Array.from({ length: LOCI }, () => 'P'),
  ]
}

const isRecombinant = (bands) => new Set(bands).size > 1

// One chromatid, banded gene by gene. The gene letter rides on the band so the
// swap is readable without relying on colour alone.
function Chromatid({ bands, x, y, h }) {
  const band = h / LOCI
  return (
    <g transform={`translate(${x} ${y})`}>
      {bands.map((b, i) => (
        <g key={i}>
          <rect
            x="-8"
            y={i * band}
            width="16"
            height={band - 1.6}
            rx="3"
            fill={b === 'M' ? MATERNAL : PATERNAL}
          />
          {band >= 14 && (
            <text
              x="0"
              y={i * band + band / 2 + 3}
              fontSize="9"
              fontWeight="900"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              {GENES[i]}
            </text>
          )}
        </g>
      ))}
      <circle cx="0" cy={h / 2} r="5" fill={CENTROMERE} />
    </g>
  )
}

const STRIP_X = 62
const STRIP_W = 496
const STRIP_Y = 316
const STRIP_H = 46

export default function CrossoverLabWidget({ onSolved }) {
  const [cut, setCut] = useState(0)
  const [step, setStep] = useState(0)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])
  const winRef = useRef([])

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 90)
    return () => clearInterval(id)
  }, [still])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 3) onSolved?.()
  }

  function changeCut(value) {
    setCut(value)
    setStep(0)
    if (value > 0) win('crossover')
  }

  function advance() {
    const next = Math.min(2, step + 1)
    setStep(next)
    if (next >= 1) win('meiosis1')
    if (next >= 2) win('meiosis2')
  }

  const strands = chromatids(cut)
  const stage = STEPS[step]
  const recombinants = strands.filter(isRecombinant).length
  const drift = still ? 0 : Math.sin(tick * 0.25) * 1.8

  const tetradTop = 92
  const tetradH = 156
  const bandH = tetradH / LOCI
  // Grouped two and two, because that is what a tetrad is: two chromosomes
  // lying together, each already made of two chromatids. The wider gap down
  // the middle is also where the chiasma has to be drawn.
  const strandX = (i) => CX + [-62, -30, 30, 62][i]
  const cutY = tetradTop + cut * bandH

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`${stage.name}. ${stage.count}. Crossover at gene ${cut ? GENES[cut] : 'none'}, ${recombinants} of 4 chromatids recombinant.`}
              style={stageFill(W, H)}
            >
              {/* Background, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={BG} />

              <text x={CX} y="42" fontSize="12.5" fontWeight="900" fill={INK} textAnchor="middle">
                {stage.name}
              </text>

              {step === 0 && (
                <g>
                  <ellipse cx={CX} cy="170" rx="170" ry="112" fill={CYTO} stroke={MEMBRANE} strokeWidth="4" />

                  {/* Key, in the top-left corner the cell outline never reaches. */}
                  <rect x="66" y="60" width="12" height="12" rx="3" fill={MATERNAL} />
                  <text x="84" y="70" fontSize="10.5" fontWeight="800" fill={INK_MID}>
                    from mother
                  </text>
                  <rect x="66" y="78" width="12" height="12" rx="3" fill={PATERNAL} />
                  <text x="84" y="88" fontSize="10.5" fontWeight="800" fill={INK_MID}>
                    from father
                  </text>

                  {[0, 1, 2, 3].map((i) => (
                    <Chromatid
                      key={i}
                      bands={strands[i]}
                      x={strandX(i)}
                      y={tetradTop + (i === 1 || i === 2 ? drift : -drift)}
                      h={tetradH}
                    />
                  ))}

                  {cut > 0 && (
                    <g>
                      <path
                        d={`M ${strandX(1)} ${cutY - 9} L ${strandX(2)} ${cutY + 9}
                            M ${strandX(1)} ${cutY + 9} L ${strandX(2)} ${cutY - 9}`}
                        stroke="#f97316"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={CX}
                        cy={cutY}
                        r={11 + (still ? 0 : Math.sin(tick * 0.4) * 1.6)}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                      />
                      {/* Bracket under the two strands that actually changed. */}
                      <path
                        d={`M ${strandX(1)} 254 L ${strandX(1)} 262 L ${strandX(2)} 262 L ${strandX(2)} 254`}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                      />
                      <text x={CX} y="277" fontSize="10.5" fontWeight="900" fill="#f97316" textAnchor="middle">
                        swapped
                      </text>
                    </g>
                  )}

                  <text
                    x={CX}
                    y="302"
                    fontSize="11.5"
                    fontWeight={cut > 0 ? '900' : '800'}
                    fill={cut > 0 ? '#f97316' : INK_MID}
                    textAnchor="middle"
                  >
                    {cut > 0 ? `swapped from gene ${GENES[cut]} down` : 'no crossover yet'}
                  </text>
                </g>
              )}

              {step === 1 && (
                <g>
                  {[0, 1].map((c) => (
                    <g key={c}>
                      <ellipse
                        cx={CX + (c ? 124 : -124)}
                        cy="170"
                        rx="104"
                        ry="96"
                        fill={CYTO}
                        stroke={MEMBRANE}
                        strokeWidth="4"
                      />
                      {[0, 1].map((i) => (
                        <Chromatid
                          key={i}
                          bands={strands[c * 2 + i]}
                          x={CX + (c ? 124 : -124) + (i - 0.5) * 32}
                          y="104"
                          h="126"
                        />
                      ))}
                      <text
                        x={CX + (c ? 124 : -124)}
                        y="294"
                        fontSize="11.5"
                        fontWeight="900"
                        fill={INK_MID}
                        textAnchor="middle"
                      >
                        cell {c + 1}: 2 chromatids each
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {step === 2 && (
                <g>
                  {strands.map((bands, i) => {
                    const gx = CX + (i - 1.5) * 124
                    const mixed = isRecombinant(bands)
                    return (
                      <g key={i}>
                        <circle
                          cx={gx}
                          cy="164"
                          r="58"
                          fill={CYTO}
                          stroke={mixed ? '#f97316' : MEMBRANE}
                          strokeWidth={mixed ? 5 : 3.5}
                        />
                        <Chromatid bands={bands} x={gx} y="116" h="96" />
                        <text x={gx} y="250" fontSize="11" fontWeight="900" fill={INK} textAnchor="middle">
                          gamete {i + 1}
                        </text>
                        <text
                          x={gx}
                          y="266"
                          fontSize="10.5"
                          fontWeight="800"
                          fill={mixed ? '#f97316' : INK_MID}
                          textAnchor="middle"
                        >
                          {mixed ? 'mixed genes' : 'unchanged'}
                        </text>
                      </g>
                    )
                  })}
                  <text x={CX} y="302" fontSize="11.5" fontWeight="800" fill={INK_MID} textAnchor="middle">
                    {recombinants} of 4 gametes carry mixed genes
                  </text>
                </g>
              )}

              {/* ── Chromosome counter: where the halving actually happens ── */}
              <g>
                <rect
                  x={STRIP_X}
                  y={STRIP_Y}
                  width={STRIP_W}
                  height={STRIP_H}
                  rx="12"
                  fill="#FFFFFF"
                  opacity="0.9"
                  stroke="#B9C7CC"
                  strokeWidth="2.5"
                />
                {STEPS.map((s, i) => {
                  const mid = STRIP_X + (i + 0.5) * (STRIP_W / 3)
                  const active = i === step
                  return (
                    <g key={s.id}>
                      <text
                        x={mid}
                        y={STRIP_Y + 20}
                        fontSize="10.5"
                        fontWeight="800"
                        fill={active ? INK : '#A8A29E'}
                        textAnchor="middle"
                      >
                        {s.name}
                      </text>
                      <text
                        x={mid}
                        y={STRIP_Y + 37}
                        fontSize="13"
                        fontWeight="900"
                        fill={active ? '#0f766e' : '#D6D3D1'}
                        textAnchor="middle"
                      >
                        {s.count}
                      </text>
                      {i > 0 && (
                        <line
                          x1={STRIP_X + i * (STRIP_W / 3)}
                          y1={STRIP_Y + 8}
                          x2={STRIP_X + i * (STRIP_W / 3)}
                          y2={STRIP_Y + STRIP_H - 8}
                          stroke="#E7E5E4"
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {stage.name}: {stage.count}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{stage.note}</p>
            </div>

            <div>
              <label
                htmlFor="cl-cut"
                className="mb-1 flex items-baseline justify-between gap-2 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                <span>Crossover point</span>
                <span className="text-sm text-stone-900 dark:text-white">
                  {cut === 0 ? 'none' : `gene ${GENES[cut]}`}
                </span>
              </label>
              <input
                id="cl-cut"
                type="range"
                min={0}
                max={LOCI - 1}
                step={1}
                value={cut}
                onChange={(e) => changeCut(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Drag it and watch two strands change.
              </p>
            </div>

            <button
              type="button"
              onClick={advance}
              disabled={step >= 2}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {step === 0 ? 'Run meiosis I' : step === 1 ? 'Run meiosis II' : 'Four gametes made'}
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              disabled={step === 0}
              className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors disabled:opacity-50 dark:bg-accent-700/25 dark:text-accent-100"
            >
              Reset
            </button>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2.5 dark:border-stone-600 dark:bg-stone-800">
              <p className="text-xs font-black text-stone-900 dark:text-white">
                {recombinants} of 4 strands mixed
              </p>
              {cut === 0 && (
                <p className="mt-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                  Slide to add a crossover.
                </p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done: {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['crossover', 'Crossover placed on the tetrad'],
                  ['meiosis1', 'Meiosis I run, count halved'],
                  ['meiosis2', 'Meiosis II run, four gametes'],
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
        {stage.name}. {stage.count}. {recombinants} of four chromatids carry mixed genes.
      </p>
    </>
  )
}
