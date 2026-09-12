import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w08-l2 signature interactive — the symbols do the thing they warn about.
//
// A hazard symbol is a promise about what will happen. So here, opening the
// bottle plays that promise out: the corrosive really eats through the plate,
// the toxic dye really reaches the fish, and the numbers underneath are
// measured off how far the demonstration has run.
//
// The lab floor beside the cabinet is the other half of the lesson. Three
// unsafe things are already happening when the widget loads and they get worse
// on their own until the student intervenes — which is the difference between
// a rule on a poster and a rule you act on.

const W = 620
const H = 340

const SYMBOLS = [
  {
    id: 'corrosive',
    name: 'Corrosive',
    tint: '#DC2626',
    means: 'Destroys living tissue and eats into metal on contact.',
    watch: 'Watch it bore straight through the steel plate.',
  },
  {
    id: 'flammable',
    name: 'Flammable',
    tint: '#EA580C',
    means: 'The vapour above the liquid catches from a spark metres away.',
    watch: 'Watch the vapour find the spark, not the other way round.',
  },
  {
    id: 'toxic',
    name: 'Toxic',
    tint: '#7C3AED',
    means: 'Poisons in small amounts — by swallowing, breathing or skin.',
    watch: 'Watch it spread through the whole tank from one drop.',
  },
  {
    id: 'oxidising',
    name: 'Oxidising',
    tint: '#CA8A04',
    means: 'Does not burn itself. Feeds oxygen to whatever else is burning.',
    watch: 'Watch a dying ember turn into a flame with no new fuel.',
  },
]

const HAZARDS = [
  {
    id: 'hair',
    name: 'Loose hair over a lit burner',
    fix: 'Tie the hair back',
    after: 'Hair tied back and well clear of the flame.',
  },
  {
    id: 'spill',
    name: 'Spill spreading across the floor',
    fix: 'Clean and cordon the spill',
    after: 'Floor dry, hazard cone out, nobody slipping.',
  },
  {
    id: 'goggles',
    name: 'No goggles beside a boiling tube',
    fix: 'Put the goggles on',
    after: 'Goggles on before the tube is touched.',
  },
]

const DEMO_TICKS = 26
const HAZARD_TICKS = 60

// ── Cabinet demonstrations ────────────────────────────────────────────────

function Demo({ id, t, tick }) {
  const flick = Math.sin(tick * 0.6) * 2.4

  if (id === 'corrosive') {
    const hole = t * 34
    const depth = (t * 6).toFixed(1)
    return (
      <g>
        <rect x="300" y="96" width="24" height="46" rx="5" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.5" />
        <circle cx="312" cy={150 + ((tick * 7) % 40)} r="5" fill="#DC2626" opacity="0.8" />
        <rect x="232" y="196" width="160" height="26" rx="4" fill="#a8a29e" stroke="#57534e" strokeWidth="2.5" />
        <ellipse cx="312" cy="196" rx={hole} ry={Math.min(9, t * 11)} fill="#FDF7EC" />
        <ellipse cx="312" cy="222" rx={Math.max(0, hole - 10)} ry={Math.min(7, t * 9)} fill="#FDF7EC" />
        <text x="312" y="256" fontSize="13" fontWeight="900" fill="#DC2626" textAnchor="middle">
          {depth} mm into the steel
        </text>
        <text x="312" y="276" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
          {t >= 1 ? 'straight through' : 'still eating'}
        </text>
      </g>
    )
  }

  if (id === 'flammable') {
    const flame = t * 64
    return (
      <g>
        <path d="M 276 160 L 276 232 L 348 232 L 348 160" fill="none" stroke="#78716c" strokeWidth="3" />
        <rect x="279" y="198" width="66" height="34" fill="#F59E0B" opacity="0.35" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={286 + i * 16}
            cy={192 - ((tick * 3 + i * 12) % 48)}
            r="3.5"
            fill="#EA580C"
            opacity="0.55"
          />
        ))}
        <path d="M 424 150 L 436 168 L 424 168 L 434 186" fill="none" stroke="#FACC15" strokeWidth="3" />
        <text x="430" y="140" fontSize="11" fontWeight="800" fill="#78716c" textAnchor="middle">
          spark, 1 m away
        </text>
        {flame > 2 && (
          <path
            d={`M 296 198 Q 290 ${198 - flame * 0.7} 312 ${198 - flame - flick} Q 334 ${198 - flame * 0.7} 328 198 Z`}
            fill="#EA580C"
            opacity="0.9"
          />
        )}
        <text x="312" y="262" fontSize="13" fontWeight="900" fill="#EA580C" textAnchor="middle">
          flame {flame.toFixed(0)} mm tall
        </text>
        <text x="312" y="282" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
          {t >= 1 ? 'the vapour carried the flame back to the beaker' : 'vapour drifting toward the spark'}
        </text>
      </g>
    )
  }

  if (id === 'toxic') {
    const spread = t * 118
    const fishX = 372 - t * 40
    const dead = t > 0.72
    return (
      <g>
        <rect x="232" y="140" width="190" height="110" rx="6" fill="#7BC9CF" opacity="0.45" stroke="#78716c" strokeWidth="3" />
        <circle cx="252" cy="156" r={spread} fill="#7C3AED" opacity={0.28} />
        <g transform={`translate(${fishX} ${dead ? 168 : 200 + Math.sin(tick * 0.3) * 8}) ${dead ? 'rotate(180)' : ''}`}>
          <ellipse cx="0" cy="0" rx="17" ry="9" fill="#F59E0B" />
          <path d="M 15 0 L 28 -9 L 28 9 Z" fill="#F59E0B" />
          <circle cx="-8" cy="-2.5" r="2" fill="#1c1917" />
        </g>
        <text x="327" y="272" fontSize="13" fontWeight="900" fill="#7C3AED" textAnchor="middle">
          {Math.round(t * 100)}% of the tank contaminated
        </text>
        <text x="327" y="292" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
          {dead ? 'the fish has stopped swimming' : 'one drop, spreading everywhere'}
        </text>
      </g>
    )
  }

  const glow = 6 + t * 46
  return (
    <g>
      <rect x="248" y="228" width="158" height="12" rx="5" fill="#57534e" />
      <circle cx="300" cy="220" r="9" fill="#B45309" />
      <path
        d={`M 288 220 Q 284 ${220 - glow * 0.7} 300 ${220 - glow - flick} Q 316 ${220 - glow * 0.7} 312 220 Z`}
        fill="#F59E0B"
        opacity={0.35 + t * 0.6}
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            x1={430 - ((tick * 4 + i * 30) % 90)}
            y1={186 + i * 22}
            x2={410 - ((tick * 4 + i * 30) % 90)}
            y2={186 + i * 22}
            stroke="#CA8A04"
            strokeWidth="3"
          />
        </g>
      ))}
      <text x="452" y="160" fontSize="11" fontWeight="800" fill="#CA8A04" textAnchor="middle">
        oxygen released
      </text>
      <text x="300" y="272" fontSize="13" fontWeight="900" fill="#CA8A04" textAnchor="middle">
        ember at {Math.round(400 + t * 500)} °C
      </text>
      <text x="300" y="292" fontSize="12" fontWeight="800" fill="#78716c" textAnchor="middle">
        {t >= 1 ? 'burning hard — no extra fuel was added' : 'oxygen arriving'}
      </text>
    </g>
  )
}

function Diamond({ symbol, x, y, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-26" y="-26" width="52" height="52" rx="5" transform="rotate(45)" fill="#ffffff" stroke={symbol.tint} strokeWidth="5" />
      <text x="0" y="6" fontSize="20" fontWeight="900" fill={symbol.tint} textAnchor="middle">
        {symbol.id === 'corrosive' ? '⌁' : symbol.id === 'flammable' ? '🔥' : symbol.id === 'toxic' ? '☠' : '◎'}
      </text>
    </g>
  )
}

// ── Lab floor ─────────────────────────────────────────────────────────────

function LabFloor({ severity, resolved, onTap, tick }) {
  const flick = Math.sin(tick * 0.7) * 2
  const hair = severity.hair
  const spill = severity.spill
  const gog = severity.goggles

  return (
    <g>
      <rect x="20" y="258" width="580" height="60" fill="#E7E0D2" />
      <line x1="20" y1="258" x2="600" y2="258" stroke="#a8a29e" strokeWidth="2" />

      {/* Loose hair over a lit burner */}
      <g onClick={() => onTap('hair')} style={{ cursor: 'pointer' }}>
        <rect x="86" y="196" width="120" height="62" rx="5" fill="#D6CCB8" />
        <rect x="150" y="168" width="14" height="30" fill="#57534e" />
        <path d={`M 150 168 Q 157 ${152 - flick} 164 168 Z`} fill="#EA580C" />
        <circle cx="112" cy="150" r="16" fill="#FBBF24" />
        <path
          d={
            resolved.hair
              ? 'M 98 146 Q 112 126 126 146 Q 120 138 112 138 Q 104 138 98 146 Z'
              : `M 98 144 Q 112 124 ${126 + hair * 26} ${150 + hair * 10} Q 118 136 98 144 Z`
          }
          fill="#78350F"
        />
        <rect x="96" y="166" width="34" height="44" rx="8" fill="#3BAFA9" />
        <text x="112" y="232" fontSize="11" fontWeight="900" fill={resolved.hair ? '#0f766e' : '#DC2626'} textAnchor="middle">
          {resolved.hair ? 'hair tied' : `${Math.round((1 - hair) * 20)} cm from the flame`}
        </text>
      </g>

      {/* Spreading spill */}
      <g onClick={() => onTap('spill')} style={{ cursor: 'pointer' }}>
        {resolved.spill ? (
          <>
            <path d="M 300 300 L 316 262 L 332 300 Z" fill="#EA580C" />
            <rect x="292" y="300" width="48" height="7" rx="3" fill="#C2410C" />
            <text x="316" y="322" fontSize="11" fontWeight="900" fill="#0f766e" textAnchor="middle">
              dry and cordoned
            </text>
          </>
        ) : (
          <>
            <ellipse cx="316" cy="290" rx={24 + spill * 56} ry={9 + spill * 16} fill="#7BC9CF" opacity="0.8" />
            <ellipse cx={300 - spill * 22} cy="284" rx={8 + spill * 14} ry={4 + spill * 6} fill="#7BC9CF" opacity="0.6" />
            <text x="316" y="322" fontSize="11" fontWeight="900" fill="#DC2626" textAnchor="middle">
              spill {Math.round(24 + spill * 76)} cm across
            </text>
          </>
        )}
      </g>

      {/* No goggles beside a boiling tube */}
      <g onClick={() => onTap('goggles')} style={{ cursor: 'pointer' }}>
        <circle cx="480" cy="150" r="16" fill="#FBBF24" />
        {resolved.goggles ? (
          <rect x="464" y="144" width="32" height="10" rx="4" fill="#0E7490" opacity="0.85" />
        ) : (
          <>
            <circle cx="474" cy="150" r="2.2" fill="#1c1917" />
            <circle cx="486" cy="150" r="2.2" fill="#1c1917" />
          </>
        )}
        <rect x="462" y="166" width="36" height="46" rx="8" fill="#F59E0B" />
        <rect x="528" y="176" width="17" height="46" rx="7" fill="none" stroke="#78716c" strokeWidth="2.5" />
        <rect x="530" y="200" width="13" height="22" fill="#3BAFA9" opacity="0.8" />
        {!resolved.goggles &&
          [0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={528 - ((tick * 5 + i * 18) % 46) * (0.4 + gog)}
              cy={186 - i * 6 - gog * 8}
              r="3"
              fill="#3BAFA9"
            />
          ))}
        <text x="500" y="238" fontSize="11" fontWeight="900" fill={resolved.goggles ? '#0f766e' : '#DC2626'} textAnchor="middle">
          {resolved.goggles ? 'eyes protected' : 'splashing, eyes bare'}
        </text>
      </g>
    </g>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────

export default function HazardCabinetWidget({ onSolved }) {
  const [mode, setMode] = useState('cabinet')
  const [symbol, setSymbol] = useState('corrosive')
  const [openedAt, setOpenedAt] = useState(null)
  const [tick, setTick] = useState(0)
  const [shown, setShown] = useState([])
  const [fixed, setFixed] = useState([])

  // Read once at mount and held in state, because the render needs it: with
  // reduced motion on there is no tick, so the hazards are drawn part-grown
  // instead of frozen at nothing.
  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  const shownRef = useRef([])
  const fixedRef = useRef([])
  const tickRef = useRef(0)
  const demoRef = useRef(0)

  const check = useCallback(() => {
    if (shownRef.current.length === SYMBOLS.length && fixedRef.current.length === HAZARDS.length) {
      onSolved?.()
    }
  }, [onSolved])

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => {
      tickRef.current += 1
      setTick(tickRef.current)
    }, 70)
    return () => clearInterval(id)
  }, [still])

  useEffect(() => () => clearTimeout(demoRef.current), [])

  function openSymbol(id) {
    setSymbol(id)
    setMode('cabinet')
    clearTimeout(demoRef.current)
    if (still) {
      setOpenedAt(-DEMO_TICKS)
      markShown(id)
      return
    }
    setOpenedAt(tickRef.current)
    demoRef.current = setTimeout(() => markShown(id), DEMO_TICKS * 70 + 120)
  }

  function markShown(id) {
    if (shownRef.current.includes(id)) return
    shownRef.current = [...shownRef.current, id]
    setShown(shownRef.current)
    check()
  }

  function fixHazard(id) {
    if (fixedRef.current.includes(id)) return
    fixedRef.current = [...fixedRef.current, id]
    setFixed(fixedRef.current)
    check()
  }

  const active = SYMBOLS.find((s) => s.id === symbol)
  const demoT =
    openedAt === null ? 0 : Math.min(1, Math.max(0, (tick - openedAt) / DEMO_TICKS))

  const grow = still ? 0.75 : Math.min(1, tick / HAZARD_TICKS)
  const severity = {
    hair: fixed.includes('hair') ? 0 : grow,
    spill: fixed.includes('spill') ? 0 : grow,
    goggles: fixed.includes('goggles') ? 0 : grow,
  }

  const caption =
    mode === 'cabinet'
      ? openedAt === null
        ? `${active.name} — sealed on the shelf. ${active.means}`
        : demoT >= 1
          ? `${active.name} — demonstration finished. ${active.means}`
          : `${active.name} — running. ${active.watch}`
      : fixed.length === HAZARDS.length
        ? 'Lab floor clear. Nothing is getting worse.'
        : `${HAZARDS.length - fixed.length} unsafe things still happening, and they are getting worse on their own.`

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
              {mode === 'cabinet' ? (
                <>
                  <rect x="20" y="46" width="132" height="256" rx="10" fill="#E7E0D2" stroke="#78716c" strokeWidth="3" />
                  <line x1="20" y1="176" x2="152" y2="176" stroke="#78716c" strokeWidth="3" />
                  {SYMBOLS.map((s, i) => {
                    const cx = 55 + (i % 2) * 62
                    const cy = 108 + Math.floor(i / 2) * 130
                    const open = s.id === symbol
                    return (
                      <g key={s.id} onClick={() => openSymbol(s.id)} style={{ cursor: 'pointer' }}>
                        <rect x={cx - 19} y={cy - 34} width="38" height="60" rx="6" fill={open ? '#FFFFFF' : '#D6CCB8'} stroke={s.tint} strokeWidth="2.5" />
                        <rect x={cx - 8} y={cy - 46} width="16" height="14" rx="3" fill={s.tint} opacity={open ? 0.35 : 1} />
                        <Diamond symbol={s} x={cx} y={cy} scale={0.42} />
                        {shown.includes(s.id) && (
                          <text x={cx} y={cy + 40} fontSize="12" fontWeight="900" fill="#0f766e" textAnchor="middle">
                            ✓
                          </text>
                        )}
                      </g>
                    )
                  })}

                  <Diamond symbol={active} x={520} y={82} scale={1} />
                  <text x="520" y="140" fontSize="13" fontWeight="900" fill={active.tint} textAnchor="middle">
                    {active.name}
                  </text>

                  {openedAt === null ? (
                    <text x="312" y="200" fontSize="13" fontWeight="800" fill="#78716c" textAnchor="middle">
                      open a bottle to see what its symbol promises
                    </text>
                  ) : (
                    <Demo id={symbol} t={demoT} tick={tick} />
                  )}
                </>
              ) : (
                <LabFloor severity={severity} resolved={{ hair: fixed.includes('hair'), spill: fixed.includes('spill'), goggles: fixed.includes('goggles') }} onTap={fixHazard} tick={tick} />
              )}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div className="rounded-xl border-2 border-[#3BAFA9] bg-[#7BC9CF]/25 p-3 dark:bg-[#3BAFA9]/15">
              <p className="text-sm font-black text-stone-900 dark:text-white">
                {mode === 'cabinet' ? 'Hazard cabinet' : 'Lab floor'}
              </p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{caption}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setMode('cabinet')}
                className={`min-h-11 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                  mode === 'cabinet'
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                }`}
              >
                Cabinet
              </button>
              <button
                type="button"
                onClick={() => setMode('floor')}
                className={`min-h-11 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                  mode === 'floor'
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                }`}
              >
                Lab floor
              </button>
            </div>

            {mode === 'cabinet' ? (
              <div>
                <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Open a bottle — {shown.length} of {SYMBOLS.length} shown
                </p>
                <div className="space-y-1.5">
                  {SYMBOLS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => openSymbol(s.id)}
                      className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left transition-colors ${
                        shown.includes(s.id)
                          ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                          : 'border-stone-200 bg-white hover:border-primary-400 dark:border-stone-600 dark:bg-stone-800'
                      }`}
                    >
                      <span className="block text-xs font-black text-stone-900 dark:text-white">
                        {shown.includes(s.id) ? '✓ ' : ''}
                        {s.name}
                      </span>
                      <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                        {s.means}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Step in — {fixed.length} of {HAZARDS.length} resolved
                </p>
                <div className="space-y-1.5">
                  {HAZARDS.map((h) => {
                    const ok = fixed.includes(h.id)
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => fixHazard(h.id)}
                        disabled={ok}
                        className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left transition-colors ${
                          ok
                            ? 'border-secondary-400 bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-700/25'
                            : 'border-rose-300 bg-rose-50 hover:border-rose-500 dark:border-rose-600 dark:bg-rose-900/25'
                        }`}
                      >
                        <span className="block text-xs font-black text-stone-900 dark:text-white">
                          {ok ? '✓ ' : ''}
                          {h.name}
                        </span>
                        <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                          {ok ? h.after : h.fix}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  You can also tap the hazard itself in the picture.
                </p>
              </div>
            )}
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {caption} {shown.length} of {SYMBOLS.length} symbols demonstrated, {fixed.length} of{' '}
        {HAZARDS.length} hazards resolved.
      </p>
    </>
  )
}
