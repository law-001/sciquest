import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w05-l1 signature interactive: the investigation as a machine on a belt.
//
// A potted sample rides a conveyor through five stage modules. Pull any module
// out of its frame and the belt keeps turning but the sample stops dead at the
// gap, so "you cannot skip a step" is something the student jams rather than
// reads.
//
// The second lever changes two variables at once. The cause arrows above the
// belt then cross, and the machine delivers a result it cannot attribute to
// anything: the confounded run.
//
// The workshop is drawn at the stage's own shape (about 16:10) and bleeds past
// the viewBox, so it fills the frame instead of sitting in a short wide strip.
// The stage column is only about 16:10 on a wide screen, so `slice` crops the
// sides by roughly 40 units at the shapes it actually takes. SAFE_L and SAFE_R
// are the inset that survives that: the machine is centred between them and
// nothing but wall and floor is drawn outside.

const W = 620
const H = 390
const BLEED = 60
const SAFE_L = 40
const SAFE_R = W - SAFE_L

const X0 = 49
const PITCH = 92
const HOUSE_W = 84
const HOUSE_Y = 110
const HOUSE_H = 142
const FRAME_L = X0 - 10
const FRAME_R = X0 + 4 * PITCH + HOUSE_W + 10

const BELT_L = 42
const BELT_R = 505
const BELT_Y = 306
const BELT_H = 15
const FLOOR_Y = 362

const TRAY_L = 493
const TRAY_R = 569

const STAGES = [
  { id: 'question', label: 'Question', sub: 'what we ask', jam: 'Nothing was asked, so the machine has no reason to run.' },
  { id: 'prediction', label: 'Prediction', sub: 'what we expect', jam: 'No prediction, so the data has nothing to agree with.' },
  { id: 'trial', label: 'Fair test', sub: 'change one thing', jam: 'Nothing is held steady, so the result cannot be pinned on anything.' },
  { id: 'data', label: 'Data', sub: 'measure it', jam: 'No measurements, so the ending would only be an opinion.' },
  { id: 'conclusion', label: 'Conclusion', sub: 'what data says', jam: 'Numbers came out, but nobody ever said what they mean.' },
]

const GOALS = [
  { id: 'whole', label: 'Full run, one variable', hint: 'Leave all five stages in and let the sample reach the tray.' },
  { id: 'jam', label: 'Machine jammed', hint: 'Pull any stage out and watch the sample stop at the gap.' },
  { id: 'confound', label: 'Two variables at once', hint: 'Switch the second variable on, then let a full run finish.' },
]

// Where the sample sits for a given belt position, in SVG units. Stage i is
// centred on position i * 20 + 10, which puts it under module i.
const sampleX = (pos) => X0 + HOUSE_W / 2 + ((pos - 10) / 20) * PITCH
const houseX = (i) => X0 + i * PITCH

export default function InvestigationRigWidget({ onSolved }) {
  const posRef = useRef(0)
  const holdRef = useRef(0)
  const stagesRef = useRef([true, true, true, true, true])
  const twoVarsRef = useRef(false)

  const [pos, setPos] = useState(0)
  const [tick, setTick] = useState(0)
  const [stages, setStages] = useState([true, true, true, true, true])
  const [twoVars, setTwoVars] = useState(false)
  const [done, setDone] = useState([])
  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    stagesRef.current = stages
    twoVarsRef.current = twoVars
  }, [stages, twoVars])

  const note = useCallback(
    (id) => {
      setDone((prev) => {
        if (prev.includes(id)) return prev
        const updated = [...prev, id]
        if (updated.length === GOALS.length) onSolved?.()
        return updated
      })
    },
    [onSolved],
  )

  // The belt never stops turning: that is what makes a jam read as a jam rather
  // than as a machine somebody switched off.
  useEffect(() => {
    const id = setInterval(
      () => {
        const prev = posRef.current
        const blocked = stagesRef.current.findIndex((s) => !s)
        const limit = blocked === -1 ? 100 : Math.max(0, blocked * 20 - 4)

        let next
        if (prev >= 100) {
          holdRef.current += 1
          next = holdRef.current > 14 ? 0 : prev
          if (next === 0) holdRef.current = 0
        } else {
          next = Math.min(limit, prev + 1.4)
        }

        posRef.current = next
        setPos(next)
        setTick((t) => t + 1)

        if (prev < 100 && next >= 100) note(twoVarsRef.current ? 'confound' : 'whole')
        if (blocked !== -1 && next === prev && next === limit) note('jam')
      },
      still ? 25 : 60,
    )
    return () => clearInterval(id)
  }, [note, still])

  const blocked = stages.findIndex((s) => !s)
  const jammed = blocked !== -1 && pos >= Math.max(0, blocked * 20 - 4) - 0.01
  const delivered = pos >= 100
  // Reduced motion gets the machine without the spin: the belt dashes and the
  // gear spokes hold still while the sample still moves, which is the only
  // motion the activity depends on.
  const beltOffset = still ? 0 : -((tick * 3) % 18)
  const spin = still ? 0 : tick * 0.14

  const toggleStage = (i) =>
    setStages((prev) => prev.map((on, j) => (j === i ? !on : on)))

  const caption = jammed
    ? `Jammed at "${STAGES[blocked].label}". ${STAGES[blocked].jam}`
    : delivered
      ? twoVars
        ? 'Two things changed, so neither one can be blamed for the result.'
        : 'One thing changed, so the result can be pinned on that one thing.'
      : `Running. The sample is at "${STAGES[Math.min(4, Math.floor(pos / 20))].label}".`

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={caption}
              style={stageFill(W, H)}
            >
              {/* Workshop wall and floor, both bleeding past the viewBox so a
                  cropped edge never shows a seam. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
              <rect x={-BLEED} y={FLOOR_Y} width={W + BLEED * 2} height="9" fill="#d6cbb6" />
              <rect x={-BLEED} y={FLOOR_Y + 9} width={W + BLEED * 2} height={H + BLEED} fill="#efe4d0" />

              {/* ── Cause chips and arrows above the belt ── */}
              <rect x={SAFE_L + 12} y={twoVars ? 22 : 32} width="104" height="24" rx="6" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
              <text x={SAFE_L + 64} y={twoVars ? 38 : 48} fontSize="12" fontWeight="800" fill="#7c2d12" textAnchor="middle">
                hours of light
              </text>
              {twoVars && (
                <>
                  <rect x={SAFE_L + 12} y="56" width="104" height="24" rx="6" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                  <text x={SAFE_L + 64} y="72" fontSize="12" fontWeight="800" fill="#7f1d1d" textAnchor="middle">
                    amount of water
                  </text>
                </>
              )}
              <rect x={SAFE_R - 160} y="32" width="96" height="24" rx="6" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2" />
              <text x={SAFE_R - 112} y="48" fontSize="12" fontWeight="800" fill="#134e4a" textAnchor="middle">
                plant height
              </text>

              <defs>
                <marker id="rig-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 5 L0 10 z" fill="#f97316" />
                </marker>
                <marker id="rig-arrow-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 5 L0 10 z" fill="#dc2626" />
                </marker>
              </defs>

              {twoVars ? (
                <>
                  {/* Crossed arrows: the picture of a tangled cause. */}
                  <path d="M160 34 C 250 34, 320 68, 414 54" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rig-arrow-bad)" />
                  <path d="M160 68 C 250 68, 320 30, 414 42" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rig-arrow-bad)" />
                  <text x="287" y="98" fontSize="12" fontWeight="800" fill="#dc2626" textAnchor="middle">
                    two causes, one result
                  </text>
                </>
              ) : (
                <>
                  <path d="M160 44 L 414 44" fill="none" stroke="#f97316" strokeWidth="2.5" markerEnd="url(#rig-arrow)" />
                  <text x="287" y="98" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
                    one cause, one result
                  </text>
                </>
              )}

              {/* ── The frame the modules bolt into ── */}
              <rect x={FRAME_L} y={HOUSE_Y - 8} width={FRAME_R - FRAME_L} height="6" rx="3" fill="#ddd2bc" />
              <rect x={FRAME_L} y={HOUSE_Y + HOUSE_H + 2} width={FRAME_R - FRAME_L} height="6" rx="3" fill="#ddd2bc" />

              {/* ── Stage modules ── */}
              {STAGES.map((s, i) => {
                const on = stages[i]
                const x = houseX(i)
                return (
                  <g key={s.id}>
                    <rect
                      x={x}
                      y={HOUSE_Y}
                      width={HOUSE_W}
                      height={HOUSE_H}
                      rx="10"
                      fill={on ? '#fff7ed' : 'none'}
                      stroke={on ? '#f97316' : '#a8a29e'}
                      strokeWidth={on ? 2.5 : 2}
                      strokeDasharray={on ? undefined : '7 6'}
                    />
                    <text
                      x={x + HOUSE_W / 2}
                      y={HOUSE_Y + 22}
                      fontSize="11"
                      fontWeight="900"
                      fill={on ? '#7c2d12' : '#a8a29e'}
                      textAnchor="middle"
                    >
                      {i + 1}. {s.label}
                    </text>
                    <text
                      x={x + HOUSE_W / 2}
                      y={HOUSE_Y + 37}
                      fontSize="9"
                      fontWeight="700"
                      fill="#8d8378"
                      textAnchor="middle"
                    >
                      {s.sub}
                    </text>

                    {on ? (
                      <>
                        {/* Bolt heads, so a fitted module looks bolted in. */}
                        {[
                          [x + 9, HOUSE_Y + 9],
                          [x + HOUSE_W - 9, HOUSE_Y + 9],
                          [x + 9, HOUSE_Y + HOUSE_H - 9],
                          [x + HOUSE_W - 9, HOUSE_Y + HOUSE_H - 9],
                        ].map(([bx, by]) => (
                          <circle key={`${bx}-${by}`} cx={bx} cy={by} r="2.6" fill="#fdba74" />
                        ))}

                        {/* Viewport onto the mechanism. */}
                        <rect x={x + 9} y={HOUSE_Y + 48} width={HOUSE_W - 18} height="62" rx="6" fill="#fffdf8" stroke="#fdba74" strokeWidth="1.5" />
                        <circle cx={x + 29} cy={HOUSE_Y + 79} r="15" fill="none" stroke="#f97316" strokeWidth="3" />
                        <circle cx={x + 58} cy={HOUSE_Y + 86} r="10" fill="none" stroke="#fb923c" strokeWidth="3" />
                        <line
                          x1={x + 29}
                          y1={HOUSE_Y + 79}
                          x2={x + 29 + Math.cos(spin + i) * 15}
                          y2={HOUSE_Y + 79 + Math.sin(spin + i) * 15}
                          stroke="#ea580c"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        <rect x={x + 12} y={HOUSE_Y + 118} width={HOUSE_W - 24} height="15" rx="4" fill="#ffedd5" stroke="#fdba74" strokeWidth="1.5" />
                        <text x={x + HOUSE_W / 2} y={HOUSE_Y + 129} fontSize="9.5" fontWeight="900" fill="#9a3412" textAnchor="middle">
                          FITTED
                        </text>
                      </>
                    ) : (
                      <>
                        {/* The empty socket the module was pulled out of. */}
                        <rect x={x + 9} y={HOUSE_Y + 48} width={HOUSE_W - 18} height="62" rx="6" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="5 4" />
                        <line x1={x + 9} y1={HOUSE_Y + 62} x2={x + HOUSE_W - 9} y2={HOUSE_Y + 62} stroke="#d6d3d1" strokeWidth="3" />
                        <line x1={x + 9} y1={HOUSE_Y + 98} x2={x + HOUSE_W - 9} y2={HOUSE_Y + 98} stroke="#d6d3d1" strokeWidth="3" />
                        <text x={x + HOUSE_W / 2} y={HOUSE_Y + 84} fontSize="10.5" fontWeight="900" fill="#dc2626" textAnchor="middle">
                          PULLED OUT
                        </text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* ── Belt legs, drive motor and rollers ── */}
              {[160, 300, 440].map((lx) => (
                <rect key={lx} x={lx} y={BELT_Y + BELT_H} width="10" height={FLOOR_Y - BELT_Y - BELT_H} fill="#ddd2bc" />
              ))}
              <rect x={BELT_L + 18} y={BELT_Y + 24} width="58" height="30" rx="5" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
              <text x={BELT_L + 47} y={BELT_Y + 43} fontSize="10" fontWeight="800" fill="#78716c" textAnchor="middle">
                motor
              </text>
              <line x1={BELT_L + 4} y1={BELT_Y + BELT_H / 2} x2={BELT_L + 32} y2={BELT_Y + 24} stroke="#a8a29e" strokeWidth="2" />
              {[BELT_L + 4, BELT_R - 4].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy={BELT_Y + BELT_H / 2} r="13" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
                  <line
                    x1={cx}
                    y1={BELT_Y + BELT_H / 2}
                    x2={cx + Math.cos(spin) * 11}
                    y2={BELT_Y + BELT_H / 2 + Math.sin(spin) * 11}
                    stroke="#78716c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              ))}

              {/* ── The belt, with a real gap under any missing stage ── */}
              {STAGES.map((s, i) =>
                stages[i] ? (
                  <rect key={s.id} x={houseX(i) - 4} y={BELT_Y} width={HOUSE_W + 8} height={BELT_H} rx="4" fill="#57534e" />
                ) : null,
              )}
              <line
                x1={BELT_L}
                y1={BELT_Y + BELT_H / 2}
                x2={BELT_R}
                y2={BELT_Y + BELT_H / 2}
                stroke="#d6d3d1"
                strokeWidth="3"
                strokeDasharray="9 9"
                strokeDashoffset={beltOffset}
              />

              {/* ── The sample riding through ── */}
              <g transform={`translate(${sampleX(pos)}, ${BELT_Y})`}>
                <rect x="-17" y="-7" width="34" height="7" rx="2.5" fill="#44403c" />
                <path
                  d="M-11 -27 h22 l-3 20 h-16 z"
                  fill={jammed || (delivered && twoVars) ? '#fca5a5' : '#5eead4'}
                  stroke={jammed || (delivered && twoVars) ? '#b91c1c' : '#0f766e'}
                  strokeWidth="1.5"
                />
                <rect x="-11" y="-27" width="22" height="4" fill="#57534e" />
                <line x1="0" y1="-27" x2="0" y2="-38" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="-6" cy="-36" rx="5.5" ry="3" fill="#22c55e" transform="rotate(-22 -6 -36)" />
                <ellipse cx="6" cy="-41" rx="5.5" ry="3" fill="#22c55e" transform="rotate(22 6 -41)" />
              </g>
              {jammed && (
                <text x={sampleX(pos)} y={BELT_Y + 36} fontSize="13" fontWeight="900" fill="#dc2626" textAnchor="middle">
                  JAMMED
                </text>
              )}

              {/* ── Output tray ── */}
              <path
                d={`M${TRAY_L} ${BELT_Y - 28} v 32 h ${TRAY_R - TRAY_L} v -32`}
                fill="none"
                stroke="#78716c"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <text x={(TRAY_L + TRAY_R) / 2} y={BELT_Y + 26} fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                result
              </text>
              {delivered && (
                <text
                  x={TRAY_R - 22}
                  y={BELT_Y - 6}
                  fontSize="20"
                  fontWeight="900"
                  fill={twoVars ? '#dc2626' : '#0d9488'}
                  textAnchor="middle"
                >
                  {twoVars ? '?' : '✓'}
                </text>
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                jammed
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : delivered && twoVars
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-700/20'
                    : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-xs font-medium text-stone-700 dark:text-stone-200">{caption}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Stages
              </p>
              <div className="space-y-1.5">
                {STAGES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStage(i)}
                    aria-pressed={stages[i]}
                    className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-2 text-left text-xs font-black transition-colors ${
                      stages[i]
                        ? 'border-primary-400 bg-primary-50 text-primary-800 dark:border-primary-500 dark:bg-primary-700/25 dark:text-primary-100'
                        : 'border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200'
                    }`}
                  >
                    {i + 1}. {s.label}: {stages[i] ? 'fitted' : 'pulled out'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setTwoVars((v) => !v)}
                aria-pressed={twoVars}
                className={`min-h-11 w-full rounded-xl border-2 px-3 py-2 text-sm font-black transition-colors ${
                  twoVars
                    ? 'border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200'
                    : 'border-stone-300 bg-white text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                Second variable: {twoVars ? 'ON' : 'OFF'}
              </button>
              <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                Water changes too, so the result cannot be pinned on light.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Runs made: {done.length} of {GOALS.length}
              </p>
              <ul className="space-y-1.5">
                {GOALS.map((g) => {
                  const hit = done.includes(g.id)
                  return (
                    <li
                      key={g.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 transition-colors ${
                        hit
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {hit ? '✓ Done: ' : 'Not yet: '}
                        {g.label}
                      </p>
                      {!hit && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {g.hint}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {caption} {done.length} of {GOALS.length} runs made.
      </p>
    </>
  )
}
