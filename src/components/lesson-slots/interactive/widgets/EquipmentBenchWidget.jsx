import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w08-l1 signature interactive — a bench of instruments that actually work.
//
// Naming a piece of glassware is a quiz question. What a quiz cannot do is let
// a student open the collar and watch the lazy yellow flame pull itself into a
// roaring blue cone, or pour a muddy mixture through paper and watch clear
// filtrate climb the beaker while the mud stays behind.
//
// Every number on screen is computed: the flame temperature comes off the air
// setting, the balance reading is the mass plus a decaying oscillation, and the
// filtrate volume is the poured fraction. Nothing is a caption pretending to be
// a readout.

const W = 620
const H = 340

const TOOLS = [
  {
    id: 'bunsen',
    name: 'Bunsen burner',
    job: 'Heats things. The collar decides how much air mixes with the gas before it burns.',
    goal: 'Open the collar until the flame roars blue.',
  },
  {
    id: 'balance',
    name: 'Digital balance',
    job: 'Measures mass. The pan swings on its spring before the reading settles.',
    goal: 'Load the pan and let the reading settle.',
  },
  {
    id: 'funnel',
    name: 'Filter funnel',
    job: 'Separates an insoluble solid from the liquid it is sitting in.',
    goal: 'Pour the muddy mixture through and collect the filtrate.',
  },
  {
    id: 'scope',
    name: 'Compound microscope',
    job: 'Magnifies what is far too small to see with an eye alone.',
    goal: 'Turn the focus until the specimen is sharp.',
  },
]

const SHARP_AT = 72

const flameName = (air) =>
  air < 25 ? 'Yellow safety flame' : air < 70 ? 'Mixed flame' : 'Roaring blue flame'

// ── Instrument views ───────────────────────────────────────────────────────

function BunsenView({ air, tick }) {
  const a = air / 100
  const flicker = Math.sin(tick * 0.55) * 2.6 + Math.sin(tick * 1.27) * 1.2
  const baseY = 196
  const apex = baseY - (92 - a * 24) - flicker * (1 - a * 0.6)
  const halfW = 27 - a * 12
  const outer = `M ${300 - halfW} ${baseY} Q ${300 - halfW * 1.3} ${(baseY + apex) / 2} 300 ${apex.toFixed(1)} Q ${300 + halfW * 1.3} ${(baseY + apex) / 2} ${300 + halfW} ${baseY} Z`
  const innerApex = baseY - (28 + a * 26)
  const inner = `M 291 ${baseY} Q 289 ${(baseY + innerApex) / 2} 300 ${innerApex.toFixed(1)} Q 311 ${(baseY + innerApex) / 2} 309 ${baseY} Z`
  const holeW = 3 + a * 13

  return (
    <g>
      <path d={outer} fill="#F59E0B" opacity={1 - a * 0.92} />
      <path d={outer} fill="#3B82F6" opacity={0.25 + a * 0.6} />
      <path d={inner} fill="#0E7490" opacity={a * 0.85} />
      <rect x="288" y={baseY} width="24" height="88" fill="#57534e" />
      <rect x="281" y="252" width="38" height="20" rx="5" fill="#78716c" />
      <rect x={300 - holeW / 2} y="256" width={holeW} height="12" rx="3" fill="#1c1917" />
      <path d="M 262 306 L 338 306 L 322 284 L 278 284 Z" fill="#44403c" />
      <rect x="256" y="306" width="88" height="10" rx="4" fill="#57534e" />
      <text x="300" y="330" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        air hole {Math.round(a * 100)}% open
      </text>
      <text
        x="300"
        y={apex - 14}
        fontSize="13"
        fontWeight="900"
        fill={a > 0.7 ? '#0e7490' : '#b45309'}
        textAnchor="middle"
      >
        {flameName(air)}
      </text>
    </g>
  )
}

function BalanceView({ mass, swing }) {
  const drop = (mass / 200) * 24 + swing
  const panY = 176 + drop
  const blockH = 8 + (mass / 200) * 44

  return (
    <g>
      <rect x={250} y={panY} width="120" height="7" rx="3" fill="#a8a29e" />
      {mass > 0 && (
        <rect
          x={310 - blockH * 0.6}
          y={panY - blockH}
          width={blockH * 1.2}
          height={blockH}
          rx="4"
          fill="#F59E0B"
          stroke="#b45309"
          strokeWidth="2"
        />
      )}
      <line x1="310" y1={panY + 7} x2="310" y2="232" stroke="#78716c" strokeWidth="6" />
      <rect x="212" y="232" width="196" height="60" rx="12" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
      <rect x="230" y="246" width="160" height="32" rx="5" fill="#1c1917" />
      <text
        x="378"
        y="269"
        fontSize="20"
        fontWeight="900"
        fill="#4ade80"
        textAnchor="end"
        fontFamily="ui-monospace, monospace"
      >
        {(mass + swing * 1.4).toFixed(2)}
      </text>
      <text x="242" y="269" fontSize="12" fontWeight="800" fill="#a8a29e">
        g
      </text>
      <rect x="236" y="292" width="148" height="9" rx="4" fill="#a8a29e" />
      <text x="310" y="322" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        {Math.abs(swing) > 0.25 ? 'pan still swinging' : 'pan at rest — reading is honest'}
      </text>
    </g>
  )
}

function FunnelView({ poured, tick }) {
  const p = poured / 100
  const mixTop = 116 + p * 52
  const residue = 2 + p * 11
  const filtrate = p * 56
  const dropY = 196 + ((tick * 6) % 46)

  return (
    <g>
      <rect x="160" y="120" width="9" height="190" rx="4" fill="#78716c" />
      <rect x="130" y="306" width="240" height="11" rx="5" fill="#57534e" />
      <line x1="164" y1="150" x2="252" y2="150" stroke="#78716c" strokeWidth="7" />

      <path d="M 252 106 L 372 106 L 318 186 L 306 186 Z" fill="none" stroke="#78716c" strokeWidth="3" />
      {poured < 100 && (
        <path
          d={`M ${252 + (mixTop - 106) * 0.75} ${mixTop} L ${372 - (mixTop - 106) * 0.75} ${mixTop} L 318 186 L 306 186 Z`}
          fill="#92785C"
          opacity="0.85"
        />
      )}
      <path d={`M ${312 - residue * 2.4} ${186 - residue} L ${312 + residue * 2.4} ${186 - residue} L 318 186 L 306 186 Z`} fill="#5B4636" />
      <text x="312" y="98" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        filter paper cone
      </text>

      {poured > 0 && poured < 100 && <circle cx="312" cy={dropY} r="4.5" fill="#7BC9CF" />}

      <rect x="268" y="240" width="90" height="70" rx="5" fill="none" stroke="#78716c" strokeWidth="3" />
      <rect x="271" y={310 - filtrate} width="84" height={filtrate} fill="#7BC9CF" opacity="0.8" />
      <text x="313" y="332" fontSize="12" fontWeight="800" fill="#0f766e" textAnchor="middle">
        filtrate {(p * 50).toFixed(0)} mL — clear
      </text>
      <text x="470" y="150" fontSize="12" fontWeight="800" fill="#5B4636" textAnchor="middle">
        residue stays on the paper
      </text>
      <text x="470" y="170" fontSize="12" fontWeight="800" fill="#0f766e" textAnchor="middle">
        liquid passes through
      </text>
    </g>
  )
}

function ScopeView({ focus, tick }) {
  const blur = Math.min(7, Math.abs(focus - SHARP_AT) / 9)
  const wobble = Math.sin(tick * 0.18) * 2

  return (
    <g>
      <defs>
        <filter id="eb-focus" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={blur.toFixed(2)} />
        </filter>
        <clipPath id="eb-field">
          <circle cx="430" cy="176" r="84" />
        </clipPath>
      </defs>

      <rect x="140" y="286" width="150" height="16" rx="7" fill="#57534e" />
      <path d="M 200 286 L 200 150 Q 200 124 224 124 L 246 124" fill="none" stroke="#78716c" strokeWidth="12" strokeLinecap="round" />
      <rect x="238" y="104" width="26" height="40" rx="6" fill="#44403c" />
      <rect x="186" y="196" width="86" height="9" rx="4" fill="#a8a29e" />
      <circle cx="204" cy={168 + (focus / 100) * 10} r="13" fill="#57534e" />
      <circle cx="204" cy={168 + (focus / 100) * 10} r="5" fill="#a8a29e" />
      <text x="214" y="248" fontSize="12" fontWeight="800" fill="#78716c">
        focus knob
      </text>

      <circle cx="430" cy="176" r="84" fill="#FDF7EC" stroke="#78716c" strokeWidth="3" />
      <g clipPath="url(#eb-field)" filter="url(#eb-focus)">
        {[
          [400, 150, 26, 18],
          [458, 164, 22, 16],
          [420, 206, 24, 17],
          [472, 212, 18, 13],
          [386, 196, 17, 12],
        ].map(([cx, cy, rx, ry]) => (
          <g key={`${cx}-${cy}`}>
            <ellipse cx={cx} cy={cy + wobble} rx={rx} ry={ry} fill="#7BC9CF" opacity="0.55" stroke="#0f766e" strokeWidth="2" />
            <circle cx={cx} cy={cy + wobble} r="5" fill="#0f766e" />
          </g>
        ))}
      </g>
      <text x="430" y="284" fontSize="13" fontWeight="900" fill={blur < 0.6 ? '#0f766e' : '#b45309'} textAnchor="middle">
        {blur < 0.6 ? 'sharp' : blur < 2.5 ? 'nearly there' : 'badly out of focus'}
      </text>
    </g>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────

export default function EquipmentBenchWidget({ onSolved }) {
  const [tool, setTool] = useState('bunsen')
  const [air, setAir] = useState(0)
  const [mass, setMass] = useState(0)
  const [poured, setPoured] = useState(0)
  const [pouring, setPouring] = useState(false)
  const [focus, setFocus] = useState(18)
  const [swing, setSwing] = useState(0)
  const [tick, setTick] = useState(0)
  const [done, setDone] = useState([])

  const doneRef = useRef([])
  const pourRef = useRef(0)
  const settleRef = useRef(0)
  const stillRef = useRef(false)

  const markDone = useCallback(
    (id) => {
      if (doneRef.current.includes(id)) return
      doneRef.current = [...doneRef.current, id]
      setDone(doneRef.current)
      if (doneRef.current.length === TOOLS.length) onSolved?.()
    },
    [onSolved],
  )

  // One heartbeat for the whole bench: flame flicker, falling drops, the drift
  // of the specimen under the objective.
  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    stillRef.current = still
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [])

  // The pan really does overshoot and come back — a spring, damped, rather
  // than a number that snaps to its final value.
  useEffect(() => {
    if (Math.abs(swing) < 0.02 || stillRef.current) return undefined
    const id = setTimeout(() => setSwing((s) => s * -0.72), 110)
    return () => clearTimeout(id)
  }, [swing])

  useEffect(() => {
    if (!pouring) return undefined
    const id = setInterval(() => {
      const next = Math.min(100, pourRef.current + 2.5)
      pourRef.current = next
      setPoured(next)
      if (next >= 100) {
        setPouring(false)
        markDone('funnel')
      }
    }, 45)
    return () => clearInterval(id)
  }, [pouring, markDone])

  useEffect(() => () => clearTimeout(settleRef.current), [])

  function changeAir(value) {
    setAir(value)
    if (value >= 80) markDone('bunsen')
  }

  function changeMass(value) {
    setMass(value)
    setSwing(stillRef.current ? 0 : 9)
    clearTimeout(settleRef.current)
    if (value > 0) settleRef.current = setTimeout(() => markDone('balance'), 1600)
  }

  function changeFocus(value) {
    setFocus(value)
    if (Math.abs(value - SHARP_AT) / 9 < 0.6) markDone('scope')
  }

  function startPour() {
    if (stillRef.current) {
      pourRef.current = 100
      setPoured(100)
      markDone('funnel')
      return
    }
    pourRef.current = 0
    setPoured(0)
    setPouring(true)
  }

  const current = TOOLS.find((t) => t.id === tool)
  const temperature = Math.round(380 + (air / 100) * 1120)
  const settled = Math.abs(swing) <= 0.25
  const blur = Math.min(7, Math.abs(focus - SHARP_AT) / 9)

  const caption =
    tool === 'bunsen'
      ? `${flameName(air)} — about ${temperature} °C at the tip.`
      : tool === 'balance'
        ? mass === 0
          ? 'Empty pan, reading 0.00 g.'
          : settled
            ? `Settled at ${mass.toFixed(2)} g.`
            : 'Pan swinging — the reading is not trustworthy yet.'
        : tool === 'funnel'
          ? poured >= 100
            ? 'All the liquid is through. The mud never made it past the paper.'
            : poured > 0
              ? `Filtering — ${((poured / 100) * 50).toFixed(0)} mL collected.`
              : 'Muddy mixture sitting in the cone, waiting.'
          : blur < 0.6
            ? 'Sharp. Every cell wall has an edge you can follow.'
            : `Out of focus by ${blur.toFixed(1)} — the edges are smeared.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`${current.name} on the laboratory bench. ${caption}`}
              style={STAGE_MEDIA}
            >
              {tool === 'bunsen' && <BunsenView air={air} tick={tick} />}
              {tool === 'balance' && <BalanceView mass={mass} swing={swing} />}
              {tool === 'funnel' && <FunnelView poured={poured} tick={tick} />}
              {tool === 'scope' && <ScopeView focus={focus} tick={tick} />}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">{current.name}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{caption}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Pick up an instrument
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTool(t.id)}
                    className={`min-h-11 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                      tool === t.id
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-primary-400 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {done.includes(t.id) ? '✓ ' : ''}
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">{current.job}</p>

            {tool === 'bunsen' && (
              <div>
                <label
                  htmlFor="eb-air"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Collar — air hole {air}% open
                </label>
                <input
                  id="eb-air"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={air}
                  onChange={(e) => changeAir(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Closed, the gas burns in air it has to find for itself — a cool, sooty
                  yellow flame. Open, it arrives pre-mixed and burns hot and blue.
                </p>
              </div>
            )}

            {tool === 'balance' && (
              <div>
                <label
                  htmlFor="eb-mass"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Mass on the pan — {mass} g
                </label>
                <input
                  id="eb-mass"
                  type="range"
                  min={0}
                  max={200}
                  step={5}
                  value={mass}
                  onChange={(e) => changeMass(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Watch the display, not the pan. It overshoots first and comes back.
                </p>
              </div>
            )}

            {tool === 'funnel' && (
              <div>
                <button
                  type="button"
                  onClick={startPour}
                  disabled={pouring}
                  className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
                >
                  {pouring ? 'Filtering…' : poured >= 100 ? 'Pour a fresh mixture' : 'Pour the muddy mixture in'}
                </button>
                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  The paper has holes bigger than water molecules and smaller than grains
                  of mud. That single fact is the whole separation.
                </p>
              </div>
            )}

            {tool === 'scope' && (
              <div>
                <label
                  htmlFor="eb-focus"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Focus knob — {focus}
                </label>
                <input
                  id="eb-focus"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={focus}
                  onChange={(e) => changeFocus(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Focusing moves the lens, not the specimen. There is exactly one height
                  where the light converges on your eye.
                </p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Instruments operated — {done.length} of {TOOLS.length}
              </p>
              <ul className="space-y-1.5">
                {TOOLS.map((t) => {
                  const ok = done.includes(t.id)
                  return (
                    <li
                      key={t.id}
                      className={`rounded-lg border-2 px-2.5 py-1.5 ${
                        ok
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-orange-50/40 dark:border-stone-600 dark:bg-stone-700/30'
                      }`}
                    >
                      <p className="text-xs font-black text-stone-900 dark:text-white">
                        {ok ? '✓ Operated — ' : 'Not yet — '}
                        {t.name}
                      </p>
                      {!ok && (
                        <p className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                          {t.goal}
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
        {current.name}. {caption} {done.length} of {TOOLS.length} instruments operated.
      </p>
    </>
  )
}
