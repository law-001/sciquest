import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

// w18-l1 signature interactive — twelve offspring, no two the same.
//
// Each offspring's three traits are drawn from a deterministic hash of the
// batch seed and its own index, then pulled toward the midpoint of the two
// parents. That means the litter is genuinely computed from where the parent
// sliders are: move a parent and the whole spread on screen shifts with it,
// and a new batch is a new seed rather than a new picture.
//
// The disease then kills on one trait, inside a fixed band. Because the
// offspring are spread out, the band misses some of them — which is exactly
// what the clone field in `clone-bench` could not do.

const W = 620
const H = 340
const LITTER = 12

// Survival needs a shell tone outside the band the parasite can grip.
const KILL_LOW = 34
const KILL_HIGH = 66

// Cheap deterministic hash so a batch is reproducible and a re-render never
// reshuffles the litter under the student.
function rand(seed, index, salt) {
  const x = Math.sin(seed * 127.1 + index * 311.7 + salt * 74.7) * 43758.5453
  return x - Math.floor(x)
}

function childOf(seed, i, a, b) {
  const mix = rand(seed, i, 1)
  const shell = Math.round(a * mix + b * (1 - mix) + (rand(seed, i, 2) - 0.5) * 26)
  return {
    shell: Math.max(0, Math.min(100, shell)),
    size: 0.7 + rand(seed, i, 3) * 0.62,
    spots: Math.floor(rand(seed, i, 4) * 5),
  }
}

const survives = (c) => c.shell < KILL_LOW || c.shell > KILL_HIGH

// Shell tone reads as a hue sweep from pale sand to deep rust, and the number
// is shown too — colour is never the only signal here.
const shellFill = (v) => `hsl(${28 + (v / 100) * 176} 62% ${72 - (v / 100) * 22}%)`

function Beetle({ c, x, y, dead, tick }) {
  const wob = Math.sin(tick * 0.2 + c.shell) * 1.4
  return (
    <g transform={`translate(${x} ${y + (dead ? 0 : wob)}) scale(${c.size}) ${dead ? 'rotate(180)' : ''}`}>
      <ellipse rx="17" ry="21" fill={dead ? '#a8a29e' : shellFill(c.shell)} stroke="#44403c" strokeWidth="2.4" />
      <line x1="0" y1="-20" x2="0" y2="20" stroke="#44403c" strokeWidth="1.8" />
      <circle cy="-23" r="7" fill="#44403c" />
      {Array.from({ length: c.spots }, (_, k) => (
        <circle key={k} cx={k % 2 ? 7 : -7} cy={-10 + Math.floor(k / 2) * 11} r="3" fill="#292524" opacity={dead ? 0.4 : 0.8} />
      ))}
    </g>
  )
}

export default function VariationBatchWidget({ onSolved }) {
  const [parentA, setParentA] = useState(22)
  const [parentB, setParentB] = useState(78)
  const [seed, setSeed] = useState(3)
  const [born, setBorn] = useState(0)
  const [running, setRunning] = useState(false)
  const [diseased, setDiseased] = useState(false)
  const [tick, setTick] = useState(0)
  const [wins, setWins] = useState([])

  const winRef = useRef([])
  const bornRef = useRef(0)

  const [still] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    if (still) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [still])

  const win = useCallback(
    (id) => {
      if (winRef.current.includes(id)) return
      winRef.current = [...winRef.current, id]
      setWins(winRef.current)
      if (winRef.current.length === 2) onSolved?.()
    },
    [onSolved],
  )

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      bornRef.current = Math.min(LITTER, bornRef.current + 1)
      setBorn(bornRef.current)
      if (bornRef.current >= LITTER) {
        setRunning(false)
        win('batch')
      }
    }, 180)
    return () => clearInterval(id)
  }, [running, win])

  function cross() {
    setSeed((s) => s + 1)
    setDiseased(false)
    if (still) {
      bornRef.current = LITTER
      setBorn(LITTER)
      win('batch')
      return
    }
    bornRef.current = 0
    setBorn(0)
    setRunning(true)
  }

  function release() {
    setDiseased(true)
    if (born >= LITTER && children.some(survives)) win('stress')
  }

  const children = Array.from({ length: LITTER }, (_, i) => childOf(seed, i, parentA, parentB))
  const shown = children.slice(0, born)
  const alive = shown.filter(survives).length

  const status = diseased
    ? `${alive} of ${shown.length} survived. The parasite grips shell tones ${KILL_LOW}–${KILL_HIGH}, and the spread put some offspring outside that band.`
    : born === 0
      ? 'Two parents, no offspring yet. Cross them.'
      : born < LITTER
        ? `${born} of ${LITTER} born — each one a different draw from the same two parents.`
        : `${LITTER} offspring. Shell tones from ${Math.min(...children.map((c) => c.shell))} to ${Math.max(...children.map((c) => c.shell))} — no two identical.`

  return (
    <>
      <SimLayout
        stage={
          <Stage>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={status} style={STAGE_MEDIA}>
              {/* ── Parents ── */}
              <Beetle c={{ shell: parentA, size: 1.35, spots: 2 }} x={62} y={78} dead={false} tick={tick} />
              <Beetle c={{ shell: parentB, size: 1.35, spots: 3 }} x={558} y={78} dead={false} tick={tick} />
              <text x="62" y="132" fontSize="11" fontWeight="900" fill="#78716c" textAnchor="middle">
                parent A · {parentA}
              </text>
              <text x="558" y="132" fontSize="11" fontWeight="900" fill="#78716c" textAnchor="middle">
                parent B · {parentB}
              </text>
              <path d="M 100 74 Q 310 20 520 74" fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeDasharray="7 6" />

              {/* Kill band, drawn on a tone scale so it is a place, not a rule. */}
              <g transform="translate(150 148)">
                <rect x="0" y="0" width="320" height="12" rx="6" fill="url(#vb-scale)" />
                <defs>
                  <linearGradient id="vb-scale" x1="0" x2="1">
                    <stop offset="0" stopColor={shellFill(0)} />
                    <stop offset="0.5" stopColor={shellFill(50)} />
                    <stop offset="1" stopColor={shellFill(100)} />
                  </linearGradient>
                </defs>
                <rect
                  x={(KILL_LOW / 100) * 320}
                  y="-5"
                  width={((KILL_HIGH - KILL_LOW) / 100) * 320}
                  height="22"
                  rx="5"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeDasharray={diseased ? undefined : '6 5'}
                />
                <text x={((KILL_LOW + KILL_HIGH) / 200) * 320} y="-12" fontSize="10.5" fontWeight="900" fill="#DC2626" textAnchor="middle">
                  parasite grips {KILL_LOW}–{KILL_HIGH}
                </text>
                <text x="160" y="30" fontSize="10.5" fontWeight="800" fill="#78716c" textAnchor="middle">
                  shell tone
                </text>
              </g>

              {/* ── The litter ── */}
              {shown.map((c, i) => (
                <Beetle
                  key={i}
                  c={c}
                  x={70 + (i % 6) * 96}
                  y={228 + Math.floor(i / 6) * 72}
                  dead={diseased && !survives(c)}
                  tick={tick}
                />
              ))}
              {shown.map((c, i) => (
                <text
                  key={`t${i}`}
                  x={70 + (i % 6) * 96}
                  y={228 + Math.floor(i / 6) * 72 + 38}
                  fontSize="10"
                  fontWeight="900"
                  fill={diseased ? (survives(c) ? '#0f766e' : '#DC2626') : '#78716c'}
                  textAnchor="middle"
                >
                  {c.shell}
                  {diseased ? (survives(c) ? ' ✓' : ' ✗') : ''}
                </text>
              ))}
            </svg>
          </Stage>
        }
        panel={
          <>
            <div
              className={`rounded-xl border-2 p-3 ${
                diseased && alive === 0
                  ? 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/25'
                  : 'border-[#3BAFA9] bg-[#7BC9CF]/25 dark:bg-[#3BAFA9]/15'
              }`}
            >
              <p className="text-sm font-black text-stone-900 dark:text-white">{status}</p>
              <p className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-200">
                Two parents, twelve draws. Sexual reproduction does not copy — it shuffles,
                and the shuffle is what the disease cannot predict.
              </p>
            </div>

            {[
              ['Parent A shell tone', parentA, setParentA, 'vb-a'],
              ['Parent B shell tone', parentB, setParentB, 'vb-b'],
            ].map(([label, value, setter, key]) => (
              <div key={key}>
                <label htmlFor={key} className="mb-1 block text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {label} — {value}
                </label>
                <input
                  id={key}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="h-11 w-full accent-orange-500"
                />
              </div>
            ))}
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Set both parents inside the red band and the litter has nowhere safe to land.
              Set them far apart and the spread reaches past it on both sides.
            </p>

            <button
              type="button"
              onClick={cross}
              disabled={running}
              className="min-h-11 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              {running ? `Breeding… ${born} of ${LITTER}` : `Cross them — ${LITTER} offspring`}
            </button>

            <button
              type="button"
              onClick={release}
              disabled={born < LITTER || diseased}
              className="min-h-11 w-full rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition-colors disabled:opacity-50 dark:border-rose-500 dark:bg-rose-900/25 dark:text-rose-200"
            >
              {diseased ? `${alive} survived` : 'Release the same disease'}
            </button>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Done — {wins.length} of 2
              </p>
              <ul className="space-y-1.5">
                {[
                  ['batch', `A batch of ${LITTER} run`],
                  ['stress', 'Stress test survived — at least one offspring lived'],
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
