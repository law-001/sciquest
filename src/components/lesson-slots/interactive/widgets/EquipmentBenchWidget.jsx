import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w08-l1 signature interactive: a bench of instruments that actually work.
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
//
// The scene paints its own wall and bench, so its contrast is the same on cream
// and on stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall and bench run past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 312

const INK = '#57534e'
const INK_MID = '#78716c'
const STEEL = '#a8a29e'

const TOOLS = [
  {
    id: 'bunsen',
    name: 'Bunsen burner',
    job: 'Heats things. The collar sets how much air meets the gas.',
    goal: 'Open the collar until the flame roars blue.',
  },
  {
    id: 'balance',
    name: 'Balance',
    job: 'Measures mass. The pan swings before the reading settles.',
    goal: 'Load the pan, then wait for the reading to settle.',
  },
  {
    id: 'funnel',
    name: 'Filter funnel',
    job: 'Separates a solid from the liquid it is sitting in.',
    goal: 'Pour the muddy mixture through and collect the filtrate.',
  },
  {
    id: 'scope',
    name: 'Microscope',
    job: 'Magnifies what is far too small for your eye.',
    goal: 'Turn the focus knob until the cells look sharp.',
  },
]

const SHARP_AT = 72

const flameName = (air) =>
  air < 25 ? 'Yellow safety flame' : air < 70 ? 'Mixed flame' : 'Roaring blue flame'

// ── Shared scenery ────────────────────────────────────────────────────────

function Room() {
  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
      <line x1={-BLEED} y1="96" x2={W + BLEED} y2="96" stroke="#efe6d6" strokeWidth="2" />
      <line x1={-BLEED} y1="198" x2={W + BLEED} y2="198" stroke="#efe6d6" strokeWidth="2" />
      <rect x={-BLEED} y={BENCH_Y} width={W + BLEED * 2} height="13" fill="#e7d9c3" />
      <rect x={-BLEED} y={BENCH_Y + 13} width={W + BLEED * 2} height={H + BLEED} fill="#f3ead9" />
    </g>
  )
}

// One card, pinned to the wall in the same corner of every scene, so the live
// number sits in the picture instead of only in the control panel.
function Readout({ label, value, tint }) {
  return (
    <g>
      <rect x="404" y="24" width="176" height="60" rx="6" fill="#fff7ed" stroke="#e7e5e4" strokeWidth="1.5" />
      <circle cx="492" cy="24" r="3.5" fill={STEEL} />
      <text x="492" y="46" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        {label}
      </text>
      <text x="492" y="72" fontSize="19" fontWeight="900" fill={tint} textAnchor="middle">
        {value}
      </text>
    </g>
  )
}

// ── Instrument views ───────────────────────────────────────────────────────

function BunsenView({ air, tick }) {
  const a = air / 100
  const flicker = Math.sin(tick * 0.55) * 2.6 + Math.sin(tick * 1.27) * 1.2
  const topY = 150
  const apex = topY - (100 - a * 24) - flicker * (1 - a * 0.6)
  const halfW = 26 - a * 11
  const outer = `M ${308 - halfW} ${topY} Q ${308 - halfW * 1.3} ${(topY + apex) / 2} 308 ${apex.toFixed(1)} Q ${308 + halfW * 1.3} ${(topY + apex) / 2} ${308 + halfW} ${topY} Z`
  const innerApex = topY - (30 + a * 30)
  const inner = `M 299 ${topY} Q 297 ${(topY + innerApex) / 2} 308 ${innerApex.toFixed(1)} Q 319 ${(topY + innerApex) / 2} 317 ${topY} Z`
  const holeW = 3 + a * 15

  return (
    <g>
      {/* Gas tap on the wall, with the hose that feeds the burner. */}
      <rect x="70" y="190" width="34" height="24" rx="5" fill={STEEL} stroke={INK_MID} strokeWidth="2" />
      <rect x="80" y="176" width="14" height="16" rx="3" fill="#EA580C" />
      <circle cx="87" cy="176" r="6" fill="#C2410C" />
      <text x="87" y="168" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        gas tap
      </text>
      <path d="M 104 204 C 152 228 168 292 248 288" fill="none" stroke="#44403c" strokeWidth="7" strokeLinecap="round" />
      <rect x="248" y="280" width="22" height="14" rx="5" fill={INK_MID} />

      {/* Flame: an outer cone that changes colour and an inner cone that only
          appears once enough air is getting in. */}
      <path d={outer} fill="#F59E0B" opacity={1 - a * 0.92} />
      <path d={outer} fill="#3B82F6" opacity={0.25 + a * 0.6} />
      <path d={inner} fill="#0E7490" opacity={a * 0.85} />

      {/* Barrel, collar and base. */}
      <rect x="296" y={topY} width="24" height="118" fill={INK_MID} />
      <rect x="299" y={topY} width="5" height="118" fill="#a8a29e" opacity="0.5" />
      <rect x="288" y="230" width="40" height="32" rx="5" fill="#57534e" />
      {[234, 240, 246, 252, 258].map((y) => (
        <line key={y} x1="290" y1={y} x2="326" y2={y} stroke="#44403c" strokeWidth="1.5" />
      ))}
      <rect x={308 - holeW / 2} y="234" width={holeW} height="24" rx="3" fill="#1c1917" />
      <path d="M 286 268 L 330 268 L 350 302 L 266 302 Z" fill="#44403c" />
      <rect x="258" y="302" width="100" height="10" rx="4" fill={INK} />
      <ellipse cx="308" cy={BENCH_Y + 2} rx="64" ry="5" fill={INK} opacity="0.12" />

      <line x1="330" y1="246" x2="344" y2="246" stroke={INK_MID} strokeWidth="1.5" />
      <text x="348" y="250" fontSize="11" fontWeight="800" fill={INK_MID}>
        air hole {Math.round(a * 100)}% open
      </text>
      <text
        x="308"
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
  const drop = (mass / 200) * 22 + swing
  const panY = 172 + drop
  const liquid = (mass / 200) * 40

  return (
    <g>
      {/* Pan, on the column that carries the load down onto the spring. */}
      <rect x="292" y={panY - 58} width="56" height="54" rx="3" fill="none" stroke={INK_MID} strokeWidth="2.5" />
      <ellipse cx="320" cy={panY - 58} rx="28" ry="4.5" fill="#ffffff" stroke={INK_MID} strokeWidth="2" />
      <rect x="294" y={panY - 6 - liquid} width="52" height={liquid} fill="#F59E0B" opacity="0.85" />
      <ellipse cx="320" cy={panY} rx="58" ry="8" fill="#d6d3d1" stroke={INK_MID} strokeWidth="2.5" />
      <rect x="314" y={panY} width="12" height={240 - panY} fill={INK_MID} />

      <line x1="350" y1={panY - 34} x2="392" y2={panY - 34} stroke={INK_MID} strokeWidth="1.5" />
      <text x="396" y={panY - 30} fontSize="11" fontWeight="800" fill={INK_MID}>
        sample beaker
      </text>

      {/* Balance body: display, tare button, spirit level, feet. */}
      <rect x="206" y="240" width="228" height="58" rx="10" fill="#e7e5e4" stroke={INK_MID} strokeWidth="2.5" />
      <rect x="282" y="248" width="140" height="42" rx="4" fill="#1c1917" />
      <text
        x="410"
        y="279"
        fontSize="22"
        fontWeight="900"
        fill="#4ade80"
        textAnchor="end"
        fontFamily="ui-monospace, monospace"
      >
        {(mass + swing * 1.4).toFixed(2)}
      </text>
      <text x="292" y="279" fontSize="12" fontWeight="800" fill={STEEL}>
        g
      </text>
      <rect x="220" y="270" width="46" height="22" rx="5" fill="#d6d3d1" stroke={INK_MID} strokeWidth="1.5" />
      <text x="243" y="285" fontSize="10" fontWeight="900" fill={INK} textAnchor="middle">
        TARE
      </text>
      <circle cx="243" cy="254" r="10" fill="#f5f5f4" stroke={INK_MID} strokeWidth="1.5" />
      <circle cx={243 + swing * 0.6} cy="254" r="4" fill="#3BAFA9" />
      <rect x="214" y="298" width="24" height="10" rx="3" fill={INK} />
      <rect x="402" y="298" width="24" height="10" rx="3" fill={INK} />
      <ellipse cx="320" cy={BENCH_Y + 2} rx="128" ry="6" fill={INK} opacity="0.1" />

      <text x="320" y={334} fontSize="12" fontWeight="800" fill={INK_MID} textAnchor="middle">
        {Math.abs(swing) > 0.25 ? 'pan still swinging' : 'pan at rest'}
      </text>
    </g>
  )
}

function FunnelView({ poured, tick }) {
  const p = poured / 100
  const mixTop = 118 + p * 62
  const mixHalf = 6 + ((192 - mixTop) / 86) * 58
  const residue = 2 + p * 12
  const resHalf = 6 + (residue / 86) * 58
  const filtrate = p * 58
  const dropY = 236 + ((tick * 6) % 34)

  return (
    <g>
      {/* Retort stand: base, rod, boss head and ring clamp. */}
      <rect x="146" y="296" width="140" height="14" rx="4" fill={STEEL} stroke={INK_MID} strokeWidth="2" />
      <rect x="206" y="84" width="10" height="212" fill={STEEL} />
      <rect x="204" y="150" width="34" height="20" rx="4" fill="#57534e" />
      <circle cx="232" cy="160" r="5" fill="#EA580C" />
      <rect x="236" y="156" width="76" height="8" rx="3" fill={STEEL} />
      <ellipse cx="344" cy="160" rx="32" ry="7" fill="none" stroke={INK_MID} strokeWidth="4" />

      {/* Funnel, with the filter paper cone folded inside it. */}
      <path d="M 280 106 L 408 106 L 350 192 L 338 192 Z" fill="none" stroke={INK_MID} strokeWidth="3" />
      <ellipse cx="344" cy="106" rx="64" ry="11" fill="#ffffff" stroke={INK_MID} strokeWidth="3" />
      <path d="M 288 110 L 400 110 L 346 188 Z" fill="#fdfaf3" stroke="#e7e5e4" strokeWidth="1.5" />
      {[-40, -20, 0, 20, 40].map((dx) => (
        <line key={dx} x1={344 + dx} y1="112" x2="345" y2="186" stroke="#e7e5e4" strokeWidth="1.2" />
      ))}
      {poured < 100 && (
        <path
          d={`M ${344 - mixHalf} ${mixTop} L ${344 + mixHalf} ${mixTop} L 350 192 L 338 192 Z`}
          fill="#92785C"
          opacity="0.88"
        />
      )}
      <path
        d={`M ${344 - resHalf} ${192 - residue} L ${344 + resHalf} ${192 - residue} L 350 192 L 338 192 Z`}
        fill="#5B4636"
      />
      <rect x="338" y="192" width="12" height="40" fill="none" stroke={INK_MID} strokeWidth="3" />
      <text x="344" y="92" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        filter paper cone
      </text>

      {poured > 0 && poured < 100 && <circle cx="344" cy={dropY} r="4.5" fill="#7BC9CF" />}

      {/* Receiving beaker, with the filtrate climbing its graduations. */}
      <rect x="300" y="240" width="88" height="66" rx="3" fill="none" stroke={INK_MID} strokeWidth="3" />
      <ellipse cx="344" cy="240" rx="44" ry="6" fill="#ffffff" stroke={INK_MID} strokeWidth="2.5" />
      <path d="M 388 238 q 12 2 13 12" fill="none" stroke={INK_MID} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="302" y={306 - filtrate} width="84" height={filtrate} fill="#7BC9CF" opacity="0.8" />
      {filtrate > 3 && (
        <path
          d={`M 302 ${306 - filtrate} Q 344 ${312 - filtrate} 386 ${306 - filtrate}`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="2"
        />
      )}
      {[0, 10, 20, 30, 40, 50].map((ml) => {
        const y = 306 - (ml / 50) * 58
        return (
          <g key={ml}>
            <line x1="370" y1={y} x2="386" y2={y} stroke={INK} strokeWidth="1.2" />
            <text x="366" y={y + 3.5} fontSize="8" fontWeight="800" fill={INK_MID} textAnchor="end">
              {ml}
            </text>
          </g>
        )
      })}
      <line x1="306" y1="246" x2="306" y2="300" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
      <ellipse cx="344" cy={BENCH_Y + 2} rx="60" ry="5" fill={INK} opacity="0.12" />

      <line x1="356" y1="188" x2="418" y2="192" stroke={INK_MID} strokeWidth="1.5" />
      <text x="422" y="196" fontSize="11" fontWeight="800" fill="#5B4636">
        mud stays here
      </text>
      <line x1="390" y1="286" x2="418" y2="286" stroke={INK_MID} strokeWidth="1.5" />
      <text x="422" y="290" fontSize="11" fontWeight="800" fill="#0f766e">
        clear filtrate
      </text>
    </g>
  )
}

function ScopeView({ focus, tick }) {
  const blur = Math.min(7, Math.abs(focus - SHARP_AT) / 9)
  const wobble = Math.sin(tick * 0.18) * 2
  // The focus knob raises and lowers the stage, so the gap under the objective
  // is something you can see rather than something the readout claims.
  const stageY = 222 + (SHARP_AT - focus) * 0.14

  return (
    <g>
      <defs>
        <filter id="eb-focus" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={blur.toFixed(2)} />
        </filter>
        <clipPath id="eb-field">
          <circle cx="472" cy="200" r="80" />
        </clipPath>
      </defs>

      {/* Foot, arm and body tube. */}
      <path d="M 96 302 L 246 302 L 236 282 L 128 282 Z" fill="#44403c" />
      <rect x="90" y="302" width="162" height="10" rx="5" fill={INK} />
      <path
        d="M 198 288 L 198 152 Q 198 134 178 134 L 160 134"
        fill="none"
        stroke={INK_MID}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <rect x="138" y="84" width="30" height="88" rx="6" fill="#44403c" />
      <rect x="142" y="66" width="22" height="22" rx="4" fill={INK} />
      <ellipse cx="153" cy="66" rx="13" ry="4" fill={INK_MID} />
      <text x="153" y="54" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        eyepiece 10x
      </text>

      {/* Nosepiece with three objectives, the middle one in line with the slide. */}
      <circle cx="153" cy="178" r="19" fill={INK} />
      {[-42, 42].map((deg) => (
        <rect
          key={deg}
          x="147"
          y="186"
          width="12"
          height="20"
          rx="3"
          fill={INK_MID}
          transform={`rotate(${deg} 153 178)`}
        />
      ))}
      <rect x="146" y="186" width="14" height="28" rx="3" fill={INK_MID} />
      <rect x="146" y="206" width="14" height="5" fill="#3BAFA9" />
      <line x1="102" y1="196" x2="142" y2="198" stroke={INK_MID} strokeWidth="1.5" />
      <text x="98" y="200" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="end">
        objective 40x
      </text>

      {/* Stage, slide and clips. The stage is what the focus knob moves. */}
      <rect x="104" y={stageY} width="110" height="12" rx="3" fill="#44403c" />
      <ellipse cx="158" cy={stageY + 6} rx="10" ry="3" fill="#FDE68A" />
      <rect x="120" y={stageY - 7} width="76" height="7" fill="#DDEEFF" stroke={STEEL} strokeWidth="1.2" />
      <ellipse cx="158" cy={stageY - 3.5} rx="12" ry="3" fill="#3BAFA9" />
      <rect x="112" y={stageY - 3} width="16" height="4" rx="2" fill={STEEL} />
      <rect x="190" y={stageY - 3} width="16" height="4" rx="2" fill={STEEL} />
      <line x1="102" y1={stageY - 6} x2="118" y2={stageY - 4} stroke={INK_MID} strokeWidth="1.5" />
      <text x="98" y={stageY - 2} fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="end">
        slide
      </text>

      {/* Lamp under the stage, throwing light up through the specimen. */}
      <path
        d={`M 146 244 L 170 244 L 180 ${stageY + 12} L 136 ${stageY + 12} Z`}
        fill="#FDE68A"
        opacity="0.35"
      />
      <circle cx="158" cy="248" r="11" fill="#FDE68A" stroke={INK_MID} strokeWidth="1.5" />
      <rect x="138" y="256" width="40" height="30" rx="5" fill={INK} />

      {/* Coarse and fine focus knobs, turning with the slider. */}
      <g transform={`rotate(${focus * 3.6} 214 226)`}>
        <circle cx="214" cy="226" r="17" fill={INK} />
        {[0, 45, 90, 135].map((deg) => (
          <line
            key={deg}
            x1={214 - 14 * Math.cos((deg * Math.PI) / 180)}
            y1={226 - 14 * Math.sin((deg * Math.PI) / 180)}
            x2={214 + 14 * Math.cos((deg * Math.PI) / 180)}
            y2={226 + 14 * Math.sin((deg * Math.PI) / 180)}
            stroke={INK_MID}
            strokeWidth="1.6"
          />
        ))}
        <circle cx="214" cy="226" r="6" fill={STEEL} />
      </g>
      <circle cx="214" cy="258" r="10" fill={INK} />
      <circle cx="214" cy="258" r="4" fill={STEEL} />
      <text x="238" y="230" fontSize="11" fontWeight="800" fill={INK_MID}>
        coarse focus
      </text>
      <text x="238" y="262" fontSize="11" fontWeight="800" fill={INK_MID}>
        fine focus
      </text>
      <ellipse cx="170" cy={BENCH_Y + 2} rx="96" ry="6" fill={INK} opacity="0.1" />

      {/* What the eyepiece shows. */}
      <text x="472" y="106" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
        what you see
      </text>
      <circle cx="472" cy="200" r="80" fill="#FDF7EC" stroke={INK_MID} strokeWidth="5" />
      <g clipPath="url(#eb-field)" filter="url(#eb-focus)">
        {[
          [440, 172, 26, 18],
          [500, 186, 22, 16],
          [462, 230, 24, 17],
          [514, 234, 18, 13],
          [424, 220, 17, 12],
        ].map(([cx, cy, rx, ry]) => (
          <g key={`${cx}-${cy}`}>
            <ellipse
              cx={cx}
              cy={cy + wobble}
              rx={rx}
              ry={ry}
              fill="#7BC9CF"
              opacity="0.55"
              stroke="#0f766e"
              strokeWidth="2"
            />
            <circle cx={cx} cy={cy + wobble} r="5" fill="#0f766e" />
          </g>
        ))}
      </g>
      <text
        x="472"
        y="300"
        fontSize="13"
        fontWeight="900"
        fill={blur < 0.6 ? '#0f766e' : '#b45309'}
        textAnchor="middle"
      >
        {blur < 0.6 ? 'sharp' : blur < 2.5 ? 'nearly there' : 'out of focus'}
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

  // The pan really does overshoot and come back: a spring, damped, rather than
  // a number that snaps to its final value.
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
      ? `${flameName(air)}, about ${temperature} °C.`
      : tool === 'balance'
        ? mass === 0
          ? 'Empty pan, reading 0.00 g.'
          : settled
            ? `Settled at ${mass.toFixed(2)} g.`
            : 'Pan still swinging. Wait for it.'
        : tool === 'funnel'
          ? poured >= 100
            ? 'All through. The mud stayed on the paper.'
            : poured > 0
              ? `Filtering. ${((poured / 100) * 50).toFixed(0)} mL collected.`
              : 'Muddy mixture waiting in the cone.'
          : blur < 0.6
            ? 'Sharp. Every cell has a clean edge.'
            : 'Blurred. The edges are smeared.'

  const readout =
    tool === 'bunsen'
      ? { label: 'flame tip', value: `${temperature} °C`, tint: air >= 70 ? '#0e7490' : '#b45309' }
      : tool === 'balance'
        ? {
            label: 'balance reading',
            value: `${(mass + swing * 1.4).toFixed(2)} g`,
            tint: settled ? '#0f766e' : '#b45309',
          }
        : tool === 'funnel'
          ? {
              label: 'filtrate collected',
              value: `${((poured / 100) * 50).toFixed(0)} mL`,
              tint: '#0f766e',
            }
          : {
              label: 'focus error',
              value: blur < 0.6 ? 'none' : blur.toFixed(1),
              tint: blur < 0.6 ? '#0f766e' : '#b45309',
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
              aria-label={`${current.name} on the laboratory bench. ${caption}`}
              style={stageFill(W, H)}
            >
              <Room />
              {tool === 'bunsen' && <BunsenView air={air} tick={tick} />}
              {tool === 'balance' && <BalanceView mass={mass} swing={swing} />}
              {tool === 'funnel' && <FunnelView poured={poured} tick={tick} />}
              {tool === 'scope' && <ScopeView focus={focus} tick={tick} />}
              <Readout label={readout.label} value={readout.value} tint={readout.tint} />
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
                  Air collar: {air}%
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
                  Closed burns yellow and cool. Open burns blue and hot.
                </p>
              </div>
            )}

            {tool === 'balance' && (
              <div>
                <label
                  htmlFor="eb-mass"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Mass on pan: {mass} g
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
                  Watch the display, not the pan. It overshoots first.
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
                  {pouring ? 'Filtering' : poured >= 100 ? 'Fresh mixture' : 'Pour mixture'}
                </button>
                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  The holes pass water and stop grains of mud.
                </p>
              </div>
            )}

            {tool === 'scope' && (
              <div>
                <label
                  htmlFor="eb-focus"
                  className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400"
                >
                  Focus knob: {focus}
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
                  The knob moves the stage. Only one height is sharp.
                </p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Instruments working: {done.length} of {TOOLS.length}
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
                        {ok ? '✓ Working: ' : 'Not yet: '}
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
        {current.name}. {caption} {done.length} of {TOOLS.length} instruments working.
      </p>
    </>
  )
}
