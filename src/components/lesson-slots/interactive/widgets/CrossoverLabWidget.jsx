import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w15-l2 signature interactive — the gametes come out of where you dragged.
//
// Four chromatids, six gene loci each. Two of the four are left alone; the
// inner two swap everything below the crossover point. So the bands on the
// four gametes at the end are not an illustration of recombination — they are
// computed from the slider position, and moving it by one locus changes two of
// the four gametes on screen.
//
// The chromosome counter beside it is the other half of the lesson: it reads
// 2n through meiosis I's start, halves at the end of meiosis I, and then does
// not halve again. Students routinely think meiosis II halves it a second
// time; here they can watch that it does not.

const W = 620
const H = 340
const LOCI = 6

const MATERNAL = '#EA580C'
const PATERNAL = '#0E7490'

const STEPS = [
  {
    id: 'tetrad',
    name: 'Prophase I — the tetrad',
    count: '2n = 46 · 92 chromatids',
    note: 'Homologous chromosomes pair up. Each is already two identical chromatids, so there are four strands lying together.',
  },
  {
    id: 'meiosis1',
    name: 'After meiosis I',
    count: 'n = 23 · 46 chromatids',
    note: 'The homologous pair is pulled apart — this is the division that halves the count. Each cell now has one chromosome of the pair, still two chromatids.',
  },
  {
    id: 'meiosis2',
    name: 'After meiosis II',
    count: 'n = 23 · 23 chromatids',
    note: 'The chromatids separate. The count does NOT halve again — it was already n. Four gametes, and the crossover is why no two of them match.',
  },
]

// Four chromatids. Two keep their parent's alleles all the way; the inner two
// exchange everything from the crossover point onward.
function chromatids(cut) {
  return [
    Array.from({ length: LOCI }, () => 'M'),
    Array.from({ length: LOCI }, (_, i) => (i >= cut && cut > 0 ? 'P' : 'M')),
    Array.from({ length: LOCI }, (_, i) => (i >= cut && cut > 0 ? 'M' : 'P')),
    Array.from({ length: LOCI }, () => 'P'),
  ]
}

const isRecombinant = (bands) => new Set(bands).size > 1

function Chromatid({ bands, x, y, h, label }) {
  const band = h / LOCI
  return (
    <g transform={`translate(${x} ${y})`}>
      {bands.map((b, i) => (
        <rect
          key={i}
          x="-7"
          y={i * band}
          width="14"
          height={band - 1.5}
          rx="3"
          fill={b === 'M' ? MATERNAL : PATERNAL}
        />
      ))}
      <circle cx="0" cy={h / 2} r="5" fill="#44403c" />
      {label && (
        <text x="0" y={h + 16} fontSize="10" fontWeight="900" fill="#78716c" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

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
  const drift = Math.sin(tick * 0.25) * 1.8
  const cutY = 72 + (cut / LOCI) * 150

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${stage.name}. ${stage.count}. Crossover at locus ${cut || 'none'}, ${recombinants} of 4 chromatids recombinant.`} style={STAGE_MEDIA}>
              <text x="44" y="46" fontSize="12" fontWeight="900" fill="#78716c">
                {stage.name}
              </text>

              {step === 0 && (
                <g>
                  {[0, 1, 2, 3].map((i) => (
                    <Chromatid
                      key={i}
                      bands={strands[i]}
                      x={238 + i * 36}
                      y={72 + (i === 1 || i === 2 ? drift : -drift)}
                      h={150}
                      label={i < 2 ? 'maternal' : 'paternal'}
                    />
                  ))}
                  {cut > 0 && (
                    <g>
                      <path
                        d={`M ${238 + 36} ${cutY} L ${238 + 2 * 36} ${cutY + 14} M ${238 + 36} ${cutY + 14} L ${238 + 2 * 36} ${cutY}`}
                        stroke="#f97316"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx={238 + 1.5 * 36} cy={cutY + 7} r={9 + Math.sin(tick * 0.4) * 1.6} fill="none" stroke="#f97316" strokeWidth="2.5" />
                      <text x="466" y={cutY + 11} fontSize="11.5" fontWeight="900" fill="#f97316">
                        chiasma at locus {cut}
                      </text>
                    </g>
                  )}
                  <text x="316" y="258" fontSize="11.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                    {cut > 0 ? 'the inner two strands have swapped everything below the cross' : 'no crossover yet — the slider sets where it happens'}
                  </text>
                </g>
              )}

              {step === 1 && (
                <g>
                  {[0, 1].map((c) => (
                    <g key={c}>
                      <ellipse cx={186 + c * 250} cy={150} rx="96" ry="84" fill="#FDE8D7" stroke="#B45309" strokeWidth="4" />
                      {[0, 1].map((i) => (
                        <Chromatid key={i} bands={strands[c * 2 + i]} x={158 + c * 250 + i * 34} y={92} h={116} />
                      ))}
                      <text x={186 + c * 250} y={256} fontSize="11.5" fontWeight="900" fill="#78716c" textAnchor="middle">
                        cell {c + 1} — n = 23, still 2 chromatids each
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {step === 2 && (
                <g>
                  {strands.map((bands, i) => (
                    <g key={i}>
                      <circle cx={108 + i * 136} cy={150} r="60" fill="#FDE8D7" stroke="#B45309" strokeWidth="3.5" />
                      <Chromatid bands={bands} x={108 + i * 136} y={104} h={94} />
                      <text x={108 + i * 136} y={240} fontSize="11" fontWeight="900" fill={isRecombinant(bands) ? '#f97316' : '#78716c'} textAnchor="middle">
                        gamete {i + 1}
                      </text>
                      <text x={108 + i * 136} y={256} fontSize="10.5" fontWeight="800" fill={isRecombinant(bands) ? '#f97316' : '#a8a29e'} textAnchor="middle">
                        {isRecombinant(bands) ? 'recombinant' : 'parental'}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Chromosome counter — the point of the whole right-hand column. */}
              <g transform="translate(20 278)">
                <rect x="0" y="0" width="580" height="46" rx="12" fill="#FFFFFF" stroke="#78716c" strokeWidth="2.5" />
                {STEPS.map((s, i) => (
                  <g key={s.id}>
                    <text x={98 + i * 194} y="20" fontSize="11" fontWeight="800" fill={i === step ? '#1c1917' : '#a8a29e'} textAnchor="middle">
                      {s.name}
                    </text>
                    <text x={98 + i * 194} y="37" fontSize="13" fontWeight="900" fill={i === step ? '#0f766e' : '#d6d3d1'} textAnchor="middle">
                      {s.count}
                    </text>
                    {i > 0 && <line x1={i * 194} y1="8" x2={i * 194} y2="38" stroke="#e7e5e4" strokeWidth="2" />}
                  </g>
                ))}
              </g>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {stage.name} — {stage.count}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{stage.note}</p>
            </div>

            <div>
              <label htmlFor="cl-cut" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Crossover point — {cut === 0 ? 'none' : `locus ${cut}`}
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
                Drag it and watch two of the four strands change. Moving the crossover by
                one gene changes which genes travel together.
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
              Back to the tetrad
            </button>

            <div className="rounded-xl border-2 border-stone-200 bg-white p-2.5 dark:border-stone-600 dark:bg-stone-800">
              <p className="text-xs font-black text-stone-900 dark:text-white">
                {recombinants} of 4 chromatids recombinant
              </p>
              <p className="mt-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                {cut === 0
                  ? 'With no crossover only two kinds of gamete are possible — pure maternal and pure paternal.'
                  : 'Two strands were never touched. Crossing over always leaves two parental chromatids behind.'}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['crossover', 'Crossover placed on the tetrad'],
                  ['meiosis1', 'Meiosis I stepped — count halved'],
                  ['meiosis2', 'Meiosis II stepped — four gametes compared'],
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
        {stage.name}. {stage.count}. {recombinants} of four chromatids recombinant.
      </p>
    </>
  )
}
