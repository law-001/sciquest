import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w05-l1 signature interactive — the investigation as a machine on a belt.
//
// A sample rides a conveyor through five stages. Pull any stage out of its
// housing and the belt keeps turning but the sample stops dead at the gap, so
// "you cannot skip a step" is something the student jams rather than reads.
//
// The second lever changes two variables at once. The cause arrows above the
// belt then cross, and the machine delivers a result it cannot attribute to
// anything — the confounded run.

const W = 600
const H = 330

const BELT_Y = 232
const HOUSE_Y = 88
const HOUSE_H = 136
const HOUSE_W = 104
const PITCH = 112
const X0 = 24

const STAGES = [
  { id: 'question', label: 'Question', sub: 'what are we asking?', jam: 'Nothing has been asked, so the machine has no reason to run at all.' },
  { id: 'prediction', label: 'Prediction', sub: 'what do we expect?', jam: 'No prediction, so there is nothing for the data to agree or disagree with later.' },
  { id: 'trial', label: 'Fair test', sub: 'change one thing only', jam: 'Nothing is being held constant, so whatever comes out cannot be pinned on anything.' },
  { id: 'data', label: 'Data', sub: 'measure and record', jam: 'No measurements are being taken. Anything said at the end would be an opinion.' },
  { id: 'conclusion', label: 'Conclusion', sub: 'what the data says', jam: 'The run produced numbers and then stopped. Nobody ever said what they mean.' },
]

const GOALS = [
  { id: 'whole', label: 'Machine run start to finish', hint: 'Leave all five stages in, one variable, and let the sample reach the tray.' },
  { id: 'jam', label: 'Machine jammed on purpose', hint: 'Pull any stage out and watch the sample stop at the gap.' },
  { id: 'confound', label: 'Run confounded on purpose', hint: 'Switch on the second variable and let a full run finish.' },
]

// Where the sample sits for a given belt position, in SVG units. Stage i is
// centred on position i * 20 + 10.
const sampleX = (pos) => 76 + (pos - 10) * 5.6
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

  // The belt never stops turning — that is what makes a jam read as a jam
  // rather than as a machine that was switched off.
  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
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
  }, [note])

  const blocked = stages.findIndex((s) => !s)
  const jammed = blocked !== -1 && pos >= Math.max(0, blocked * 20 - 4) - 0.01
  const delivered = pos >= 100
  const beltOffset = -((tick * 3) % 18)

  const toggleStage = (i) =>
    setStages((prev) => prev.map((on, j) => (j === i ? !on : on)))

  const caption = jammed
    ? `Jammed at "${STAGES[blocked].label}" — ${STAGES[blocked].jam}`
    : delivered
      ? twoVars
        ? 'Delivered, but the result is useless: two things changed, so neither can be blamed for the difference.'
        : 'Delivered. One variable changed, everything else held constant — so the difference can be pinned on that one thing.'
      : `Running — the sample is at "${STAGES[Math.min(4, Math.floor(pos / 20))].label}".`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={caption}
              style={STAGE_MEDIA}
            >
              {/* ── Cause arrows above the belt ── */}
              <rect x="36" y="26" width="92" height="24" rx="6" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
              <text x="82" y="42" fontSize="12" fontWeight="800" fill="#7c2d12" textAnchor="middle">
                hours of light
              </text>
              {twoVars && (
                <>
                  <rect x="36" y="56" width="92" height="24" rx="6" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                  <text x="82" y="72" fontSize="12" fontWeight="800" fill="#7f1d1d" textAnchor="middle">
                    amount of water
                  </text>
                </>
              )}
              <rect x="452" y="41" width="112" height="24" rx="6" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2" />
              <text x="508" y="57" fontSize="12" fontWeight="800" fill="#134e4a" textAnchor="middle">
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
                  {/* Crossed arrows: the picture of a confounded cause. */}
                  <path d="M128 38 C 260 38, 320 76, 450 62" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rig-arrow-bad)" />
                  <path d="M128 68 C 260 68, 320 30, 450 46" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rig-arrow-bad)" />
                  <text x="290" y="20" fontSize="12" fontWeight="800" fill="#dc2626" textAnchor="middle">
                    two causes, one result — tangled
                  </text>
                </>
              ) : (
                <>
                  <path d="M128 53 L 446 53" fill="none" stroke="#f97316" strokeWidth="2.5" markerEnd="url(#rig-arrow)" />
                  <text x="290" y="44" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
                    one cause, one result
                  </text>
                </>
              )}

              {/* ── Stage housings ── */}
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
                      rx="12"
                      fill={on ? '#fff7ed' : 'none'}
                      stroke={on ? '#f97316' : '#a8a29e'}
                      strokeWidth={on ? 2.5 : 2}
                      strokeDasharray={on ? undefined : '7 6'}
                    />
                    <text x={x + HOUSE_W / 2} y={HOUSE_Y + 26} fontSize="13" fontWeight="900" fill={on ? '#7c2d12' : '#a8a29e'} textAnchor="middle">
                      {i + 1}. {s.label}
                    </text>
                    <text x={x + HOUSE_W / 2} y={HOUSE_Y + 44} fontSize="10.5" fontWeight="700" fill="#78716c" textAnchor="middle">
                      {s.sub}
                    </text>
                    {on ? (
                      <>
                        {/* A little mechanism, so a fitted stage looks fitted. */}
                        <circle cx={x + 34} cy={HOUSE_Y + 84} r="16" fill="none" stroke="#f97316" strokeWidth="3" />
                        <circle cx={x + 70} cy={HOUSE_Y + 84} r="11" fill="none" stroke="#fb923c" strokeWidth="3" />
                        <line
                          x1={x + 34}
                          y1={HOUSE_Y + 84}
                          x2={x + 34 + Math.cos(tick * 0.14 + i) * 16}
                          y2={HOUSE_Y + 84 + Math.sin(tick * 0.14 + i) * 16}
                          stroke="#ea580c"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </>
                    ) : (
                      <text x={x + HOUSE_W / 2} y={HOUSE_Y + 90} fontSize="12" fontWeight="900" fill="#dc2626" textAnchor="middle">
                        PULLED OUT
                      </text>
                    )}
                  </g>
                )
              })}

              {/* ── The belt, with a real gap under any missing stage ── */}
              {STAGES.map((s, i) =>
                stages[i] ? (
                  <rect key={s.id} x={houseX(i) - 4} y={BELT_Y} width={HOUSE_W + 8} height="16" rx="4" fill="#57534e" />
                ) : null,
              )}
              <line
                x1={X0 - 4}
                y1={BELT_Y + 8}
                x2={X0 + 4 * PITCH + HOUSE_W + 4}
                y2={BELT_Y + 8}
                stroke="#d6d3d1"
                strokeWidth="3"
                strokeDasharray="9 9"
                strokeDashoffset={beltOffset}
              />

              {/* ── The sample riding through ── */}
              <g>
                <rect x={sampleX(pos) - 13} y={BELT_Y - 22} width="26" height="22" rx="5" fill={jammed ? '#dc2626' : delivered && twoVars ? '#dc2626' : '#0d9488'} />
                <rect x={sampleX(pos) - 8} y={BELT_Y - 17} width="16" height="6" rx="2" fill="#ffffff" opacity="0.8" />
                {jammed && (
                  <text x={sampleX(pos)} y={BELT_Y - 30} fontSize="13" fontWeight="900" fill="#dc2626" textAnchor="middle">
                    JAMMED
                  </text>
                )}
              </g>

              {/* ── Output tray ── */}
              <path d={`M${X0 + 4 * PITCH + HOUSE_W + 10} ${BELT_Y - 4} h 46 v 26 h -46 z`} fill="none" stroke="#78716c" strokeWidth="2.5" />
              <text x={X0 + 4 * PITCH + HOUSE_W + 33} y={BELT_Y + 36} fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
                result
              </text>
              {delivered && (
                <text x={X0 + 4 * PITCH + HOUSE_W + 33} y={BELT_Y + 12} fontSize="15" fontWeight="900" fill={twoVars ? '#dc2626' : '#0d9488'} textAnchor="middle">
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
                Stages in the machine
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
                    {i + 1}. {s.label} — {stages[i] ? 'fitted' : 'pulled out'}
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
                Turn it on and water changes as well as light. The machine still runs — it
                just cannot tell you which one did it.
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Runs made — {done.length} of {GOALS.length}
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
                        {hit ? '✓ Done — ' : 'Not yet — '}
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
