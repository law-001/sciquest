import React, { useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w13-l1 signature interactive — one cell, dragged from animal to plant.
//
// There is only ever one cell on screen. The morph slider moves every number
// that defines it at once: the outline goes from round to boxy, the wall and
// the big vacuole fade up, the centrioles fade down. The structures both cells
// share never move at all through the whole drag — which is the comparison the
// lesson wants, made by watching what stays still.
//
// The water slider then does the other half. Volume climbs the same way in both
// forms; what differs is what stops it. The plant cell runs into a wall and the
// pressure reading rises instead of the size. The animal cell has nothing to
// run into, so it bursts.

const W = 620
const H = 340

const BURST_AT = 78
const BURST_TICKS = 14

// Every structure, with the range of the morph over which it exists. A shared
// structure is present at both ends, so it never fades and never moves.
const PARTS = [
  { id: 'membrane', name: 'Cell membrane', kind: 'shared' },
  { id: 'cytoplasm', name: 'Cytoplasm', kind: 'shared' },
  { id: 'nucleus', name: 'Nucleus', kind: 'shared' },
  { id: 'mitochondria', name: 'Mitochondria', kind: 'shared' },
  { id: 'ribosomes', name: 'Ribosomes', kind: 'shared' },
  { id: 'wall', name: 'Cell wall', kind: 'plant', from: 0.18 },
  { id: 'vacuole', name: 'Large central vacuole', kind: 'plant', from: 0.34 },
  { id: 'chloroplasts', name: 'Chloroplasts', kind: 'plant', from: 0.52 },
  { id: 'centrioles', name: 'Centrioles', kind: 'animal', until: 0.46 },
  { id: 'lysosomes', name: 'Lysosomes', kind: 'animal', until: 0.62 },
]

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const lerp = (a, b, t) => a + (b - a) * t

const presenceOf = (part, m) =>
  part.kind === 'shared'
    ? 1
    : part.kind === 'plant'
      ? clamp01((m - part.from) / 0.18)
      : clamp01((part.until - m) / 0.18)

export default function CellMorphWidget({ onSolved }) {
  const [morph, setMorph] = useState(0)
  const [water, setWater] = useState(0)
  const [burst, setBurst] = useState(0)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const burstRef = useRef(0)
  const stillRef = useRef(false)

  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    stillRef.current = still
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 70)
    return () => clearInterval(id)
  }, [])

  // The rupture is a one-shot, so it runs on its own short timer rather than
  // being derived from the slider — pulling the water back down afterwards
  // must not un-burst a cell.
  useEffect(() => {
    if (burst <= 0 || burst >= 1) return undefined
    const id = setTimeout(() => {
      burstRef.current = Math.min(1, burstRef.current + 1 / BURST_TICKS)
      setBurst(burstRef.current)
    }, 55)
    return () => clearTimeout(id)
  }, [burst])

  function win(id) {
    if (winRef.current.includes(id)) return
    winRef.current = [...winRef.current, id]
    setWins(winRef.current)
    if (winRef.current.length === 4) onSolved?.()
  }

  function changeMorph(value) {
    setMorph(value)
    if (value >= 98) win('toPlant')
    if (value <= 2) win('toAnimal')
  }

  function changeWater(value) {
    setWater(value)
    const m = morph / 100
    if (value < BURST_AT) return
    if (m >= 0.55) {
      win('turgid')
    } else if (m <= 0.45) {
      win('burst')
      if (burstRef.current === 0) {
        burstRef.current = stillRef.current ? 1 : 1 / BURST_TICKS
        setBurst(burstRef.current)
      }
    }
  }

  function freshCell() {
    burstRef.current = 0
    setBurst(0)
    setWater(0)
  }

  const m = morph / 100
  const isPlant = m >= 0.55
  const plantish = m > 0.5
  // Volume climbs with the water outside; the wall is what caps it.
  const swell = 1 + (water / 100) * (plantish ? 0.07 : 0.24)
  const turgor = plantish ? Math.round((water / 100) * 620) : 0
  const volume = Math.round((swell * swell - 1) * 100)

  const cx = 290
  const cy = 168
  const bw = lerp(212, 330, m) * swell
  const bh = lerp(212, 216, m) * swell
  const rx = lerp(106, 18, m)
  const wobble = Math.sin(tick * 0.14) * (1.6 + (water / 100) * 2.4)

  const open = burst > 0 ? burst : 0
  const pres = Object.fromEntries(PARTS.map((p) => [p.id, presenceOf(p, m)]))

  const status = burst >= 1
    ? 'Burst. The membrane could not hold the pressure and the contents are gone.'
    : isPlant
      ? water >= BURST_AT
        ? `Turgid — ${turgor} kPa pushing out against the wall, volume only +${volume}%.`
        : `Plant cell. Volume +${volume}%, turgor ${turgor} kPa.`
      : water >= BURST_AT
        ? 'Animal cell in pure water — the membrane is stretching with nothing behind it.'
        : `Animal cell. Volume +${volume}%.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${isPlant ? 'Plant' : 'Animal'} cell, morph ${morph} per cent. ${status}`} style={STAGE_MEDIA}>
              {/* ── Cell wall — plant only ── */}
              {pres.wall > 0.01 && (
                <rect
                  x={cx - bw / 2 - 15}
                  y={cy - bh / 2 - 15}
                  width={bw + 30}
                  height={bh + 30}
                  rx={rx + 8}
                  fill="none"
                  stroke="#15803D"
                  strokeWidth={11 * pres.wall}
                  opacity={pres.wall}
                />
              )}

              {/* ── Membrane and cytoplasm ── */}
              <g transform={open ? `translate(${cx} ${cy}) scale(${1 + open * 0.16}) translate(${-cx} ${-cy})` : undefined}>
                <rect
                  x={cx - bw / 2}
                  y={cy - bh / 2}
                  width={bw}
                  height={bh}
                  rx={rx}
                  fill="#FDE8D7"
                  stroke={open ? '#DC2626' : '#B45309'}
                  strokeWidth="5"
                  strokeDasharray={open ? `${22 - open * 16} ${open * 26}` : undefined}
                  opacity={1 - open * 0.55}
                />

                {/* Large central vacuole — plant only, and it is what the water
                    actually fills. */}
                {pres.vacuole > 0.01 && (
                  <rect
                    x={cx - bw / 2 + 34}
                    y={cy - bh / 2 + 30}
                    width={(bw - 68) * pres.vacuole}
                    height={bh - 60}
                    rx="18"
                    fill="#7BC9CF"
                    opacity={0.55 * pres.vacuole}
                  />
                )}

                {/* Shared structures. These coordinates do not involve m at
                    all — they are the point. */}
                <circle cx={cx - 62} cy={cy - 18} r="34" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="3.5" />
                <circle cx={cx - 55} cy={cy - 24} r="11" fill="#5B21B6" />
                {[[cx + 58, cy - 54], [cx + 74, cy + 44]].map(([mx, my]) => (
                  <g key={mx} transform={`translate(${mx} ${my + wobble * 0.4})`}>
                    <ellipse rx="27" ry="14" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="2.6" />
                    <path d="M -18 0 q 6 -9 12 0 q 6 9 12 0" fill="none" stroke="#B91C1C" strokeWidth="2.2" />
                  </g>
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <circle key={i} cx={cx - 96 + (i % 4) * 26} cy={cy + 58 + Math.floor(i / 4) * 16 + wobble * 0.3} r="3.4" fill="#B45309" />
                ))}

                {/* Plant-only chloroplasts grow in. */}
                {pres.chloroplasts > 0.01 &&
                  Array.from({ length: 5 }, (_, i) => (
                    <ellipse
                      key={i}
                      cx={cx - 30 + i * 34}
                      cy={cy + (i % 2 ? -74 : 80) + wobble * 0.5}
                      rx={13 * pres.chloroplasts}
                      ry={8 * pres.chloroplasts}
                      fill="#15803D"
                      opacity={pres.chloroplasts}
                    />
                  ))}

                {/* Animal-only structures fade out. */}
                {pres.centrioles > 0.01 && (
                  <g opacity={pres.centrioles}>
                    <rect x={cx - 116} y={cy - 74} width="9" height="24" rx="3" fill="#44403c" />
                    <rect x={cx - 102} y={cy - 80} width="24" height="9" rx="3" fill="#44403c" />
                  </g>
                )}
                {pres.lysosomes > 0.01 &&
                  [0, 1, 2].map((i) => (
                    <circle key={i} cx={cx + 6 + i * 24} cy={cy + 36 + (i % 2) * 18} r="8" fill="#F59E0B" opacity={pres.lysosomes} />
                  ))}
              </g>

              {/* Contents leaving a burst cell. */}
              {open > 0 &&
                Array.from({ length: 7 }, (_, i) => {
                  const a = (i / 7) * Math.PI * 2
                  const d = 110 + open * 130
                  return <circle key={i} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d * 0.62} r="6" fill="#FCA5A5" opacity={1 - open * 0.5} />
                })}

              {/* Labels fade in exactly when their structure appears. */}
              {pres.wall > 0.05 && (
                <text x={cx} y={cy - bh / 2 - 34} fontSize="12" fontWeight="900" fill="#15803D" textAnchor="middle" opacity={pres.wall}>
                  cell wall
                </text>
              )}
              {pres.vacuole > 0.05 && (
                <text x={cx + 40} y={cy + 4} fontSize="12" fontWeight="900" fill="#0f766e" textAnchor="middle" opacity={pres.vacuole}>
                  central vacuole
                </text>
              )}
              {pres.centrioles > 0.05 && (
                <text x={cx - 104} y={cy - 92} fontSize="11" fontWeight="900" fill="#44403c" textAnchor="middle" opacity={pres.centrioles}>
                  centrioles
                </text>
              )}

              <text x="300" y="328" fontSize="13" fontWeight="900" fill={burst >= 1 ? '#DC2626' : isPlant ? '#15803D' : '#B45309'} textAnchor="middle">
                {burst >= 1 ? 'lysed — contents lost' : `${isPlant ? 'plant cell' : 'animal cell'} · volume +${volume}%${isPlant ? ` · ${turgor} kPa` : ''}`}
              </text>
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                burst >= 1
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Water moves in either way. Only one of these two cells has something to
                push back against.
              </p>
            </div>

            <div>
              <label htmlFor="cm-morph" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Animal → plant — {morph}%
              </label>
              <input
                id="cm-morph"
                type="range"
                min={0}
                max={100}
                step={1}
                value={morph}
                onChange={(e) => changeMorph(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Watch the nucleus, the mitochondria and the ribosomes. They do not move at
                all — those are the shared ones.
              </p>
            </div>

            <div>
              <label htmlFor="cm-water" className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Water outside the cell — {water}%
              </label>
              <input
                id="cm-water"
                type="range"
                min={0}
                max={100}
                step={1}
                value={water}
                onChange={(e) => changeWater(Number(e.target.value))}
                className="h-11 w-full accent-orange-500"
              />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                100% is pure water — the steepest possible gradient into the cell.
              </p>
            </div>

            {burst > 0 && (
              <button
                type="button"
                onClick={freshCell}
                className="min-h-11 w-full rounded-xl border-2 border-accent-500 bg-accent-50 px-3 py-2 text-sm font-black text-accent-700 transition-colors dark:bg-accent-700/25 dark:text-accent-100"
              >
                Get a fresh cell
              </button>
            )}

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Structures on screen
              </p>
              <ul className="space-y-1">
                {PARTS.map((p) => {
                  const v = pres[p.id]
                  const label = p.kind === 'shared' ? 'in both' : p.kind === 'plant' ? 'plant only' : 'animal only'
                  return (
                    <li
                      key={p.id}
                      className={`rounded-lg border-2 px-2.5 py-1 text-xs font-bold ${
                        v > 0.5
                          ? 'border-secondary-400 bg-secondary-50 text-stone-900 dark:border-secondary-600 dark:bg-secondary-700/25 dark:text-white'
                          : 'border-stone-200 bg-orange-50/40 text-stone-400 dark:border-stone-600 dark:bg-stone-700/30 dark:text-stone-500'
                      }`}
                    >
                      {p.name} — {label}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 4
              </p>
              <ul className="space-y-1.5">
                {[
                  ['toPlant', 'Morphed all the way to plant'],
                  ['toAnimal', 'Morphed all the way back to animal'],
                  ['turgid', 'Plant cell in pure water — turgid, not burst'],
                  ['burst', 'Animal cell in pure water — burst'],
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
        {status} {wins.length} of 4 steps done.
      </p>
    </>
  )
}
