import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w18-l2 signature interactive: arrows that actually carry something.
//
// Which organisms are fed is not stored anywhere. It is worked out every
// render by walking outward from the sun along the links that are currently
// pointing the right way, through the organisms that are currently present.
// So flipping one arrow starves everything behind it, and the packets stop
// arriving because there is nothing upstream sending them.
//
// The web switch adds a second route to the hawk. Removing the frog then
// proves the point that no amount of arrow-drawing can: in a chain the top
// predator starves, in a web it does not.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// The meadow runs past the viewBox so a cropped edge never shows a seam.
// Nothing readable goes in that margin.
const BLEED = 60

// `slice` can crop about 60 units off whichever axis is long, so every label
// sits between x 60 and x 560 and between y 40 and y 352.
const MEADOW_Y = 238
const FORE_Y = 292

const SKY = '#E4EDF2'
const HILL = '#CBDCD2'
const MEADOW = '#CFDCBC'
const MEADOW_DARK = '#BDCDA6'
const INK = '#44403c'
const INK_MID = '#6B6259'
const PAPER = '#FDF7EC'
const RED = '#DC2626'
const TEAL = '#0F766E'
const GREY = '#A8A29E'
const PACKET = '#F59E0B'
const PACKET_EDGE = '#B45309'

const NODES = {
  sun: { x: 100, y: 84, r: 30, name: 'Sun', tint: '#F59E0B' },
  grass: { x: 142, y: 206, r: 32, name: 'Grass', tint: '#3F8F3A' },
  hopper: { x: 268, y: 206, r: 30, name: 'Grasshopper', tint: '#8CBF3F' },
  frog: { x: 392, y: 206, r: 30, name: 'Frog', tint: '#2E8B8B' },
  snake: { x: 508, y: 206, r: 30, name: 'Snake', tint: '#C07A2E' },
  hawk: { x: 506, y: 84, r: 34, name: 'Hawk', tint: '#6B4E33' },
  rabbit: { x: 392, y: 304, r: 32, name: 'Rabbit', tint: '#C9A882', webOnly: true },
}

const CHAIN_LINKS = [
  { id: 'l0', from: 'sun', to: 'grass' },
  { id: 'l1', from: 'grass', to: 'hopper' },
  { id: 'l2', from: 'hopper', to: 'frog' },
  { id: 'l3', from: 'frog', to: 'snake' },
  { id: 'l4', from: 'snake', to: 'hawk' },
]

const WEB_LINKS = [
  { id: 'w0', from: 'grass', to: 'rabbit' },
  { id: 'w1', from: 'rabbit', to: 'hawk' },
]

const REMOVABLE = ['hopper', 'frog', 'snake', 'rabbit']

// Walk out from the sun along whichever links currently point away from
// something already fed.
function feed(links, present) {
  const fed = new Set(['sun'])
  for (let pass = 0; pass < links.length; pass += 1) {
    for (const l of links) {
      if (!present.has(l.from) || !present.has(l.to)) continue
      if (fed.has(l.from)) fed.add(l.to)
    }
  }
  return fed
}

// ── The organisms themselves ──
//
// Each is drawn around its own origin so the node table only has to carry a
// position. A starving one is handed the grey fill and the red outline, so the
// picture shows the state as a change of posture and colour, not just a badge.

function Sun({ fill, ink }) {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <line
            key={i}
            x1={Math.cos(a) * 26}
            y1={Math.sin(a) * 26}
            x2={Math.cos(a) * 39}
            y2={Math.sin(a) * 39}
            stroke={fill}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        )
      })}
      <circle r="24" fill={fill} stroke={ink} strokeWidth="2.6" />
      <circle r="14" fill={PAPER} opacity="0.28" />
    </g>
  )
}

const BLADES = [
  'M 0 30 q -16 -16 -25 -42',
  'M 0 30 q -8 -20 -11 -48',
  'M 0 30 q 3 -22 8 -46',
  'M 0 30 q 14 -16 24 -38',
  'M 0 30 q 20 -10 28 -24',
]

function Grass({ fill, ink }) {
  return (
    <g>
      {BLADES.map((d) => (
        <path key={d} d={d} fill="none" stroke={fill} strokeWidth="6" strokeLinecap="round" />
      ))}
      <circle cx="-11" cy="-18" r="4.5" fill={fill} stroke={ink} strokeWidth="1.8" />
      <circle cx="8" cy="-16" r="4.5" fill={fill} stroke={ink} strokeWidth="1.8" />
      <path d="M -14 30 L 14 30" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
    </g>
  )
}

function Grasshopper({ fill, ink }) {
  return (
    <g>
      <path
        d="M 4 2 L 20 -14 L 26 12"
        fill="none"
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M -6 6 l -8 14 M 2 8 l -2 14" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="6" cy="-2" rx="22" ry="11" fill={fill} stroke={ink} strokeWidth="2.4" />
      <path d="M 2 -8 q 18 -3 24 5 q -12 6 -24 1 Z" fill={PAPER} opacity="0.5" stroke={ink} strokeWidth="1.6" />
      <circle cx="-19" cy="-7" r="9" fill={fill} stroke={ink} strokeWidth="2.4" />
      <circle cx="-22" cy="-9" r="2.4" fill={ink} />
      <path
        d="M -25 -13 q -8 -6 -14 -6 M -23 -15 q -6 -10 -11 -13"
        fill="none"
        stroke={ink}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  )
}

function Frog({ fill, ink }) {
  return (
    <g>
      <path d="M -20 6 q -15 4 -13 16 q 9 4 15 -4 Z" fill={fill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 20 6 q 15 4 13 16 q -9 4 -15 -4 Z" fill={fill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cy="4" rx="24" ry="18" fill={fill} stroke={ink} strokeWidth="2.4" />
      <ellipse cy="11" rx="13" ry="7" fill={PAPER} opacity="0.45" />
      <path d="M -12 6 q 12 9 24 -2" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <circle cx="-11" cy="-14" r="8.5" fill={fill} stroke={ink} strokeWidth="2.2" />
      <circle cx="11" cy="-14" r="8.5" fill={fill} stroke={ink} strokeWidth="2.2" />
      <circle cx="-11" cy="-14" r="3.4" fill={ink} />
      <circle cx="11" cy="-14" r="3.4" fill={ink} />
    </g>
  )
}

const SNAKE_BODY = 'M -26 20 q 16 -8 4 -17 q -14 -8 2 -16 q 14 -6 26 1'

function Snake({ fill, ink }) {
  return (
    <g>
      <path d={SNAKE_BODY} fill="none" stroke={ink} strokeWidth="17" strokeLinecap="round" />
      <path d={SNAKE_BODY} fill="none" stroke={fill} strokeWidth="12.5" strokeLinecap="round" />
      <g transform="rotate(12 14 -17)">
        <ellipse cx="14" cy="-17" rx="12" ry="8.5" fill={fill} stroke={ink} strokeWidth="2.2" />
        <circle cx="19" cy="-20" r="2.1" fill={ink} />
      </g>
      <path d="M 27 -13 l 9 3 M 36 -10 l -5 -3 M 36 -10 l -5 4" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  )
}

function Hawk({ fill, ink }) {
  return (
    <g>
      <path
        d="M -6 -6 q -22 -18 -44 -7 q 16 4 22 12 q 12 6 22 3 Z"
        fill={fill}
        stroke={ink}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M 6 -6 q 22 -18 44 -7 q -16 4 -22 12 q -12 6 -22 3 Z"
        fill={fill}
        stroke={ink}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M -9 12 L 0 31 L 9 12 Z" fill={fill} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cy="2" rx="11" ry="18" fill={fill} stroke={ink} strokeWidth="2.4" />
      <circle cy="-20" r="9.5" fill={fill} stroke={ink} strokeWidth="2.4" />
      <circle cx="-3.4" cy="-22" r="1.8" fill={PAPER} />
      <circle cx="3.4" cy="-22" r="1.8" fill={PAPER} />
      <path d="M 0 -17 l 9 3 q -4 5 -9 3 Z" fill={PACKET} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path
        d="M -5 17 l -4 9 M -5 17 l 1 10 M 5 17 l 4 9 M 5 17 l -1 10"
        fill="none"
        stroke={PACKET}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  )
}

function Rabbit({ fill, ink }) {
  return (
    <g>
      <ellipse cx="-8" cy="-24" rx="5.5" ry="13" fill={fill} stroke={ink} strokeWidth="2.2" transform="rotate(-10 -8 -24)" />
      <ellipse cx="7" cy="-25" rx="5.5" ry="13" fill={fill} stroke={ink} strokeWidth="2.2" transform="rotate(8 7 -25)" />
      <ellipse cx="6" cy="8" rx="23" ry="17" fill={fill} stroke={ink} strokeWidth="2.4" />
      <circle cx="28" cy="1" r="7" fill={PAPER} stroke={ink} strokeWidth="2" />
      <circle cx="-12" cy="-7" r="13" fill={fill} stroke={ink} strokeWidth="2.4" />
      <circle cx="-17" cy="-10" r="2.4" fill={ink} />
      <path d="M -24 -2 l -10 -3 M -24 0 l -10 3" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="-6" cy="23" rx="9" ry="5" fill={fill} stroke={ink} strokeWidth="2" />
      <ellipse cx="15" cy="24" rx="9" ry="5" fill={fill} stroke={ink} strokeWidth="2" />
    </g>
  )
}

const ART = { sun: Sun, grass: Grass, hopper: Grasshopper, frog: Frog, snake: Snake, hawk: Hawk, rabbit: Rabbit }

function Tuft({ x, y, scale = 1 }) {
  return (
    <path
      d="M 0 0 l -7 -16 M 0 0 l 1 -20 M 0 0 l 8 -15"
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke={MEADOW_DARK}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  )
}

export default function EnergyFlowWidget({ onSolved }) {
  const [flipped, setFlipped] = useState([])
  const [web, setWeb] = useState(false)
  const [removed, setRemoved] = useState([])
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])
  const winRef = useRef([])

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [still])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 3) onSolved?.()
  }

  const rawLinks = web ? [...CHAIN_LINKS, ...WEB_LINKS] : CHAIN_LINKS
  // A flipped link is the same link with its ends swapped: the arrow really
  // points the other way, it is not just drawn differently.
  const links = rawLinks.map((l) =>
    flipped.includes(l.id) ? { ...l, from: l.to, to: l.from, reversed: true } : l,
  )

  const present = new Set(
    Object.keys(NODES).filter(
      (id) => !removed.includes(id) && (web || !NODES[id].webOnly),
    ),
  )
  const fed = feed(links, present)
  const starving = [...present].filter((id) => !fed.has(id))

  function toggleLink(id) {
    const next = flipped.includes(id) ? flipped.filter((f) => f !== id) : [...flipped, id]
    setFlipped(next)
    const nextLinks = (web ? [...CHAIN_LINKS, ...WEB_LINKS] : CHAIN_LINKS).map((l) =>
      next.includes(l.id) ? { ...l, from: l.to, to: l.from } : l,
    )
    const nextFed = feed(nextLinks, present)
    if (next.length > 0 && [...present].some((n) => !nextFed.has(n))) win('reversed')
    if (next.length === 0 && removed.length === 0 && [...present].every((n) => nextFed.has(n))) win('chain')
  }

  function toggleNode(id) {
    const next = removed.includes(id) ? removed.filter((r) => r !== id) : [...removed, id]
    setRemoved(next)
    const nextPresent = new Set(
      Object.keys(NODES).filter((n) => !next.includes(n) && (web || !NODES[n].webOnly)),
    )
    const nextFed = feed(links, nextPresent)
    if (web && next.length > 0 && nextFed.has('hawk')) win('web')
    if (next.length === 0 && flipped.length === 0 && [...nextPresent].every((n) => nextFed.has(n))) win('chain')
  }

  // Putting everything back is the "correctly fed" state, and it is only worth
  // crediting once the student has actually broken something, so it is awarded
  // on an action, never on the untouched first paint.
  function reset() {
    setFlipped([])
    setRemoved([])
    win('chain')
  }

  const names = starving.map((id) => NODES[id].name)
  const status = starving.length
    ? `${starving.length} starving: ${names.join(', ')}`
    : web
      ? `All ${present.size} fed, two routes`
      : `All ${present.size} fed, one line`

  // One hint at a time, aimed at whichever goal is still open.
  const hint = !wins.includes('reversed')
    ? 'Reverse any arrow. Everything behind it stops being fed.'
    : !wins.includes('web')
      ? 'Add the web links, then remove the frog. The hawk still eats.'
      : !wins.includes('chain')
        ? 'Put everything back to feed the whole chain again.'
        : null

  return (
    <>
      <SimLayout
        stage={
          <Stage bleed>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={status}
              preserveAspectRatio="xMidYMid slice"
              style={stageFill(W, H)}
            >
              {/* Meadow, bled past the viewBox on all sides. */}
              <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={MEADOW_Y + BLEED} fill={SKY} />
              <path
                d={`M ${-BLEED} ${MEADOW_Y} q 150 -54 310 -20 q 160 34 ${W + BLEED - 310} 12 L ${W + BLEED} ${MEADOW_Y} Z`}
                fill={HILL}
              />
              <rect x={-BLEED} y={MEADOW_Y} width={W + BLEED * 2} height={H + BLEED - MEADOW_Y} fill={MEADOW} />
              <rect x={-BLEED} y={FORE_Y} width={W + BLEED * 2} height={H + BLEED - FORE_Y} fill={MEADOW_DARK} />

              {[-46, 30, 200, 330, 470, 560, 648].map((gx) => (
                <Tuft key={`m${gx}`} x={gx} y={MEADOW_Y + 8} />
              ))}
              {[-40, 64, 140, 230, 470, 540, 636].map((gx) => (
                <Tuft key={`f${gx}`} x={gx} y={FORE_Y + 22} scale={1.3} />
              ))}

              {/* ── Arrows, and the packets they carry ── */}
              {links.map((l) => {
                if (!present.has(l.from) || !present.has(l.to)) return null
                const a = NODES[l.from]
                const b = NODES[l.to]
                const dx = b.x - a.x
                const dy = b.y - a.y
                const len = Math.hypot(dx, dy)
                const ux = dx / len
                const uy = dy / len
                const x1 = a.x + ux * (a.r + 6)
                const y1 = a.y + uy * (a.r + 6)
                const x2 = b.x - ux * (b.r + 12)
                const y2 = b.y - uy * (b.r + 12)
                const live = fed.has(l.from)
                const tone = l.reversed ? RED : live ? TEAL : GREY
                return (
                  <g key={l.id} onClick={() => toggleLink(l.id)} style={{ cursor: 'pointer' }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="26" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={PAPER} strokeWidth="7" strokeOpacity="0.55" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tone} strokeWidth="3.6" />
                    <path
                      d={`M ${x2} ${y2} L ${x2 - ux * 13 - uy * 7.5} ${y2 - uy * 13 + ux * 7.5} L ${x2 - ux * 13 + uy * 7.5} ${y2 - uy * 13 - ux * 7.5} Z`}
                      fill={tone}
                    />
                    {/* Packets only exist when there is something upstream to send them. */}
                    {live &&
                      [0, 1, 2].map((k) => {
                        const t = still ? 0.4 + k * 0.2 : (((tick * 0.022 + k / 3) % 1) + 1) % 1
                        return (
                          <circle
                            key={k}
                            cx={x1 + (x2 - x1) * t}
                            cy={y1 + (y2 - y1) * t}
                            r="5"
                            fill={PACKET}
                            stroke={PACKET_EDGE}
                            strokeWidth="1.4"
                          />
                        )
                      })}
                  </g>
                )
              })}

              {/* ── The organisms ── */}
              {[...present].map((id) => {
                const n = NODES[id]
                const ok = fed.has(id)
                const canRemove = REMOVABLE.includes(id)
                const Art = ART[id]
                return (
                  <g
                    key={id}
                    onClick={() => canRemove && toggleNode(id)}
                    style={{ cursor: canRemove ? 'pointer' : 'default' }}
                  >
                    <ellipse
                      cx={n.x}
                      cy={n.y + n.r + 4}
                      rx={n.r * 0.8}
                      ry="5"
                      fill={INK}
                      opacity={id === 'sun' || id === 'hawk' ? 0 : 0.13}
                    />
                    {!ok && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.r + 12}
                        fill="none"
                        stroke={RED}
                        strokeWidth="2.6"
                        strokeDasharray="6 5"
                      />
                    )}
                    <g transform={`translate(${n.x} ${n.y})`}>
                      <Art fill={ok ? n.tint : GREY} ink={ok ? INK : RED} />
                    </g>
                    <text
                      x={n.x}
                      y={n.y + n.r + 20}
                      fontSize="11.5"
                      fontWeight="900"
                      fill={ok ? INK : RED}
                      textAnchor="middle"
                    >
                      {ok ? n.name : `${n.name}, no food`}
                    </text>
                  </g>
                )
              })}

              {/* Gaps left by an organism the student took out. */}
              {removed
                .filter((id) => web || !NODES[id].webOnly)
                .map((id) => {
                  const n = NODES[id]
                  return (
                    <g key={id} onClick={() => toggleNode(id)} style={{ cursor: 'pointer' }}>
                      <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={GREY} strokeWidth="2.4" strokeDasharray="7 6" />
                      <text x={n.x} y={n.y + n.r + 20} fontSize="11.5" fontWeight="900" fill={INK_MID} textAnchor="middle">
                        {n.name} removed
                      </text>
                    </g>
                  )
                })}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                starving.length
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              {hint && (
                <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">{hint}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setWeb((v) => !v)}
              className={`min-h-11 w-full rounded-xl px-4 py-3 text-sm font-black transition-colors ${
                web
                  ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {web ? 'Back to one chain' : 'Add the web links'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Reverse an arrow
              </p>
              <div className="space-y-1.5">
                {(web ? [...CHAIN_LINKS, ...WEB_LINKS] : CHAIN_LINKS).map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLink(l.id)}
                    className={`min-h-11 w-full rounded-lg border-2 px-2.5 py-1.5 text-left text-xs font-black transition-colors ${
                      flipped.includes(l.id)
                        ? 'border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200'
                        : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {NODES[l.from].name} {flipped.includes(l.id) ? '←' : '→'} {NODES[l.to].name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Remove an organism
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {REMOVABLE.filter((id) => web || !NODES[id].webOnly).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleNode(id)}
                    className={`min-h-11 rounded-xl border-2 px-2 py-2 text-xs font-black transition-colors ${
                      removed.includes(id)
                        ? 'border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200'
                        : 'border-stone-200 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {removed.includes(id) ? 'Bring back ' : 'Remove '}
                    {NODES[id].name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors dark:bg-accent-700/25 dark:text-accent-100"
            >
              Put everything back
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['chain', 'Whole chain fed'],
                  ['reversed', 'An arrow reversed, something starved'],
                  ['web', 'Web survived losing an organism'],
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
        {status}
      </p>
    </>
  )
}
