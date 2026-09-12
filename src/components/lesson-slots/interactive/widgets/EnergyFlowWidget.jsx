import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w18-l2 signature interactive — arrows that actually carry something.
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

const W = 620
const H = 340

const NODES = {
  sun: { x: 58, y: 62, r: 26, name: 'Sun', tint: '#F59E0B', fixed: true },
  grass: { x: 150, y: 168, r: 28, name: 'Grass', tint: '#15803D', fixed: true },
  hopper: { x: 268, y: 168, r: 26, name: 'Grasshopper', tint: '#84CC16' },
  frog: { x: 386, y: 168, r: 26, name: 'Frog', tint: '#0E7490' },
  snake: { x: 496, y: 168, r: 26, name: 'Snake', tint: '#B45309' },
  hawk: { x: 556, y: 66, r: 28, name: 'Hawk', tint: '#7C3AED', fixed: true },
  rabbit: { x: 268, y: 272, r: 26, name: 'Rabbit', tint: '#A16207', webOnly: true },
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
  // A flipped link is the same link with its ends swapped — the arrow really
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
  // crediting once the student has actually broken something — so it is
  // awarded on an action, never on the untouched first paint.
  function reset() {
    setFlipped([])
    setRemoved([])
    win('chain')
  }

  const status = starving.length
    ? `${starving.map((id) => NODES[id].name).join(', ')} ${starving.length > 1 ? 'are' : 'is'} starving — no energy is reaching ${starving.length > 1 ? 'them' : 'it'}.`
    : web
      ? 'Every organism fed. The web gives the hawk two independent routes.'
      : 'Every organism fed. Energy runs from the sun to the hawk in one line.'

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              {links.map((l) => {
                if (!present.has(l.from) || !present.has(l.to)) return null
                const a = NODES[l.from]
                const b = NODES[l.to]
                const dx = b.x - a.x
                const dy = b.y - a.y
                const len = Math.hypot(dx, dy)
                const ux = dx / len
                const uy = dy / len
                const x1 = a.x + ux * (a.r + 4)
                const y1 = a.y + uy * (a.r + 4)
                const x2 = b.x - ux * (b.r + 10)
                const y2 = b.y - uy * (b.r + 10)
                const live = fed.has(l.from)
                return (
                  <g key={l.id} onClick={() => toggleLink(l.id)} style={{ cursor: 'pointer' }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="22" />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={l.reversed ? '#DC2626' : live ? '#0f766e' : '#a8a29e'}
                      strokeWidth="3.5"
                    />
                    <path
                      d={`M ${x2} ${y2} L ${x2 - ux * 12 - uy * 7} ${y2 - uy * 12 + ux * 7} L ${x2 - ux * 12 + uy * 7} ${y2 - uy * 12 - ux * 7} Z`}
                      fill={l.reversed ? '#DC2626' : live ? '#0f766e' : '#a8a29e'}
                    />
                    {/* Packets only exist when there is something upstream to send them. */}
                    {live &&
                      [0, 1, 2].map((k) => {
                        const t = still ? 0.4 + k * 0.2 : ((tick * 0.022 + k / 3) % 1 + 1) % 1
                        return (
                          <circle
                            key={k}
                            cx={x1 + (x2 - x1) * t}
                            cy={y1 + (y2 - y1) * t}
                            r="5"
                            fill="#F59E0B"
                            stroke="#B45309"
                            strokeWidth="1.4"
                          />
                        )
                      })}
                  </g>
                )
              })}

              {[...present].map((id) => {
                const n = NODES[id]
                const ok = fed.has(id)
                const canRemove = REMOVABLE.includes(id)
                return (
                  <g
                    key={id}
                    onClick={() => canRemove && toggleNode(id)}
                    style={{ cursor: canRemove ? 'pointer' : 'default' }}
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      fill={ok ? n.tint : '#d6d3d1'}
                      stroke={ok ? '#1c1917' : '#DC2626'}
                      strokeWidth="3"
                      strokeDasharray={ok ? undefined : '6 5'}
                    />
                    <text x={n.x} y={n.y + n.r + 16} fontSize="11" fontWeight="900" fill={ok ? '#1c1917' : '#DC2626'} textAnchor="middle">
                      {n.name}
                    </text>
                    {!ok && (
                      <text x={n.x} y={n.y + 5} fontSize="15" fontWeight="900" fill="#DC2626" textAnchor="middle">
                        ✗
                      </text>
                    )}
                  </g>
                )
              })}

              {removed.map((id) => (
                <text key={id} x={NODES[id].x} y={NODES[id].y + 4} fontSize="11" fontWeight="900" fill="#a8a29e" textAnchor="middle">
                  removed
                </text>
              ))}

              <text x="310" y="322" fontSize="12" fontWeight="900" fill={starving.length ? '#DC2626' : '#0f766e'} textAnchor="middle">
                {starving.length ? `${starving.length} starving` : 'all fed'} · tap an arrow to reverse it, tap an organism to remove it
              </text>
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
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                The arrow points the way the energy travels — from the eaten to the eater.
                Turn one round and the animal behind it has nothing coming.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWeb((v) => !v)}
              className={`min-h-11 w-full rounded-xl px-4 py-3 text-sm font-black transition-colors ${
                web ? 'bg-secondary-600 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {web ? 'Back to a single chain' : 'Add links — make it a web'}
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
                Done — {wins.length} of 3
              </p>
              <ul className="space-y-1.5">
                {[
                  ['chain', 'Chain built and correctly fed'],
                  ['reversed', 'An arrow reversed — something starved'],
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
        {status}
      </p>
    </>
  )
}
