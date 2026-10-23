import React, { useCallback, useEffect, useRef, useState } from 'react'

import SimLayout, { Stage } from '../SimLayout'
import { stageFill } from '../stageMedia'

// w08-l2 signature interactive: the symbols do the thing they warn about.
//
// A hazard symbol is a promise about what will happen. So here, opening the
// bottle plays that promise out: the corrosive really eats through the plate,
// the toxic dye really reaches the fish, and the numbers on the wall card are
// measured off how far the demonstration has run.
//
// The lab floor beside the cabinet is the other half of the lesson. Three
// unsafe things are already happening when the widget loads and they get worse
// on their own until the student intervenes, which is the difference between a
// rule on a poster and a rule you act on.
//
// The scene paints its own wall, bench and floor, so its contrast is the same
// on cream and on stone-900 and the widget never has to know about the theme.

// Drawn at the stage's own shape (about 16:10) so the scene fills the frame.
const W = 620
const H = 390
// Wall, bench and floor run past the viewBox so a cropped edge never shows a
// seam. Nothing readable goes in this margin.
const BLEED = 60

const BENCH_Y = 312
// Left edge of the wall cabinet. `slice` crops roughly 40 units off each side
// at the shapes the stage takes, so the cabinet and its brackets start well
// inside that inset rather than hard against the viewBox.
const CAB_X = 56

const INK = '#57534e'
const INK_MID = '#78716c'
const STEEL = '#a8a29e'

const SYMBOLS = [
  {
    id: 'corrosive',
    name: 'Corrosive',
    tint: '#DC2626',
    means: 'Destroys skin, eyes and metal on contact.',
    watch: 'It bores through the steel plate.',
  },
  {
    id: 'flammable',
    name: 'Flammable',
    tint: '#EA580C',
    means: 'The vapour catches from a spark a metre away.',
    watch: 'The vapour reaches the spark first.',
  },
  {
    id: 'toxic',
    name: 'Toxic',
    tint: '#7C3AED',
    means: 'Poisons in small amounts, even one drop.',
    watch: 'One drop fills the whole tank.',
  },
  {
    id: 'oxidising',
    name: 'Oxidising',
    tint: '#CA8A04',
    means: 'Feeds oxygen to whatever is already burning.',
    watch: 'A dying ember flares with no new fuel.',
  },
]

const HAZARDS = [
  {
    id: 'hair',
    name: 'Loose hair over a flame',
    fix: 'Tie the hair back',
    after: 'Hair tied back, clear of the flame.',
  },
  {
    id: 'spill',
    name: 'Spill spreading on the floor',
    fix: 'Mop it up and set a cone',
    after: 'Floor dry, cone out, nobody slipping.',
  },
  {
    id: 'goggles',
    name: 'No goggles by a boiling tube',
    fix: 'Put the goggles on',
    after: 'Goggles on before the tube is touched.',
  },
]

const DEMO_TICKS = 26
const HAZARD_TICKS = 60

// ── Shared scenery ────────────────────────────────────────────────────────

function Room() {
  return (
    <g>
      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill="#fdfaf3" />
      <line x1={-BLEED} y1="110" x2={W + BLEED} y2="110" stroke="#efe6d6" strokeWidth="2" />
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

// The four GHS pictograms, drawn rather than typed, so they look the same on
// every device instead of depending on which emoji font is installed.
function Pictogram({ id, tint }) {
  if (id === 'flammable') {
    return (
      <g fill={tint}>
        <path d="M -1 -15 C 6 -7 12 -2 9 5 C 6 12 -7 12 -9 4 C -10 -1 -6 -4 -4 -9 C -3 -4 -1 -3 0 -5 C 1 -9 0 -12 -1 -15 Z" />
        <rect x="-11" y="12" width="22" height="2.6" rx="1.3" />
      </g>
    )
  }

  if (id === 'toxic') {
    return (
      <g fill={tint}>
        <circle cx="0" cy="-5" r="9" />
        <rect x="-4" y="2" width="8" height="5" rx="1.6" />
        <circle cx="-3.4" cy="-6" r="2.6" fill="#ffffff" />
        <circle cx="3.4" cy="-6" r="2.6" fill="#ffffff" />
        <g stroke={tint} strokeWidth="2.6" strokeLinecap="round">
          <line x1="-11" y1="8" x2="11" y2="15" />
          <line x1="-11" y1="15" x2="11" y2="8" />
        </g>
      </g>
    )
  }

  if (id === 'corrosive') {
    return (
      <g fill={tint}>
        <rect x="-14" y="-14" width="9" height="15" rx="1.6" transform="rotate(-28 -9 -7)" />
        <rect x="5" y="-14" width="9" height="15" rx="1.6" transform="rotate(28 9 -7)" />
        <circle cx="-6" cy="3" r="2.2" />
        <circle cx="6" cy="3" r="2.2" />
        <path d="M -15 9 L 15 9 L 11 14 L -11 14 Z" />
        <path d="M -6 9 L 0 14 L 6 9 Z" fill="#ffffff" />
      </g>
    )
  }

  return (
    <g fill={tint}>
      <circle cx="0" cy="8" r="7" />
      <path d="M -1 -15 C 6 -8 11 -4 8 1 C 5 5 -6 5 -8 0 C -9 -4 -5 -6 -3 -10 C -2 -6 -1 -5 0 -7 C 1 -10 0 -12 -1 -15 Z" />
    </g>
  )
}

function Diamond({ symbol, x, y, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect
        x="-26"
        y="-26"
        width="52"
        height="52"
        rx="5"
        transform="rotate(45)"
        fill="#ffffff"
        stroke={symbol.tint}
        strokeWidth="5"
      />
      <Pictogram id={symbol.id} tint={symbol.tint} />
    </g>
  )
}

// ── Cabinet demonstrations ────────────────────────────────────────────────

function Demo({ id, t, tick }) {
  const flick = Math.sin(tick * 0.6) * 2.4

  if (id === 'corrosive') {
    const hole = t * 32
    return (
      <g>
        {/* Dropper bottle, held above a steel plate on two blocks. */}
        <rect x="424" y="132" width="32" height="46" rx="5" fill="#f5f5f4" stroke={INK_MID} strokeWidth="2.5" />
        <rect x="430" y="118" width="20" height="16" rx="6" fill="#DC2626" />
        <rect x="436" y="178" width="8" height="10" fill={INK_MID} />
        <rect x="428" y="146" width="24" height="18" rx="2" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.2" />
        <circle cx="440" cy={194 + ((tick * 7) % 40)} r="5" fill="#DC2626" opacity="0.85" />

        <rect x="362" y="266" width="26" height="46" fill="#d6d3d1" stroke={INK_MID} strokeWidth="2" />
        <rect x="492" y="266" width="26" height="46" fill="#d6d3d1" stroke={INK_MID} strokeWidth="2" />
        <rect x="356" y="238" width="168" height="28" fill={STEEL} stroke={INK} strokeWidth="2.5" />
        <line x1="356" y1="246" x2="524" y2="246" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
        <ellipse cx="440" cy="238" rx={hole} ry={Math.min(9, t * 11)} fill="#fdfaf3" />
        <ellipse cx="440" cy="266" rx={Math.max(0, hole - 9)} ry={Math.min(7, t * 9)} fill="#fdfaf3" />

        <line x1="352" y1="252" x2="336" y2="252" stroke={INK_MID} strokeWidth="1.5" />
        <text x="332" y="256" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="end">
          steel plate
        </text>
        <text x="440" y="296" fontSize="12" fontWeight="900" fill="#DC2626" textAnchor="middle">
          {t >= 1 ? 'eaten through' : 'still eating'}
        </text>
      </g>
    )
  }

  if (id === 'flammable') {
    const flame = t * 62
    return (
      <g>
        {/* Open beaker on the bench, and a spark at a socket a metre away. */}
        <rect x="328" y="234" width="68" height="78" rx="3" fill="none" stroke={INK_MID} strokeWidth="3" />
        <ellipse cx="362" cy="234" rx="34" ry="5" fill="#ffffff" stroke={INK_MID} strokeWidth="2.5" />
        <rect x="330" y="274" width="64" height="36" fill="#F59E0B" opacity="0.4" />
        <line x1="334" y1="244" x2="334" y2="304" stroke="#ffffff" strokeWidth="3" opacity="0.6" />

        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={356 + i * 22 + ((tick * 2 + i * 9) % 34)}
            cy={226 - ((tick * 3 + i * 12) % 52)}
            r="3.5"
            fill="#EA580C"
            opacity="0.5"
          />
        ))}
        <text x="446" y="214" fontSize="11" fontWeight="800" fill="#EA580C" textAnchor="middle">
          vapour
        </text>

        <rect x="536" y="200" width="34" height="28" rx="4" fill="#f5f5f4" stroke={INK_MID} strokeWidth="2" />
        <rect x="544" y="208" width="4" height="10" rx="2" fill={INK} />
        <rect x="558" y="208" width="4" height="10" rx="2" fill={INK} />
        <path d="M 534 230 L 524 244 L 534 244 L 522 260" fill="none" stroke="#FACC15" strokeWidth="3" />
        <text x="553" y="192" fontSize="11" fontWeight="800" fill={INK_MID} textAnchor="middle">
          spark
        </text>

        {flame > 2 && (
          <path
            d={`M 344 274 Q 338 ${274 - flame * 0.7} 362 ${274 - flame - flick} Q 386 ${274 - flame * 0.7} 380 274 Z`}
            fill="#EA580C"
            opacity="0.9"
          />
        )}
        <text x="440" y="298" fontSize="12" fontWeight="900" fill="#EA580C" textAnchor="middle">
          {t >= 1 ? 'the vapour carried it back' : 'vapour drifting to the spark'}
        </text>
      </g>
    )
  }

  if (id === 'toxic') {
    const spread = t * 132
    const fishX = 512 - t * 70
    const dead = t > 0.72
    return (
      <g>
        {/* Fish tank on the bench, one drop going in at the left. */}
        <rect x="336" y="200" width="232" height="112" rx="4" fill="#7BC9CF" opacity="0.4" />
        <rect x="336" y="200" width="232" height="112" rx="4" fill="none" stroke={INK_MID} strokeWidth="3" />
        <rect x="338" y="298" width="228" height="12" fill="#d6cbb4" />
        <path d="M 378 298 Q 370 272 382 254 Q 386 276 394 298 Z" fill="#3BAFA9" opacity="0.7" />
        <ellipse cx="452" cy="200" rx="116" ry="4" fill="#ffffff" opacity="0.6" />

        <rect x="344" y="150" width="20" height="34" rx="4" fill="#f5f5f4" stroke={INK_MID} strokeWidth="2" />
        <rect x="350" y="184" width="8" height="8" fill={INK_MID} />
        <text x="354" y="142" fontSize="11" fontWeight="800" fill="#7C3AED" textAnchor="middle">
          one drop in
        </text>

        <circle cx="356" cy="214" r={spread} fill="#7C3AED" opacity="0.26" />
        <g
          transform={`translate(${fishX} ${dead ? 222 : 254 + Math.sin(tick * 0.3) * 8}) ${dead ? 'rotate(180)' : ''}`}
        >
          <ellipse cx="0" cy="0" rx="18" ry="9" fill="#F59E0B" />
          <path d="M 16 0 L 30 -10 L 30 10 Z" fill="#F59E0B" />
          <path d="M -2 -9 L 4 -17 L 10 -9 Z" fill="#EA580C" />
          <circle cx="-9" cy="-2.5" r="2" fill="#1c1917" />
        </g>

        <text x="452" y="332" fontSize="12" fontWeight="900" fill="#7C3AED" textAnchor="middle">
          {dead ? 'the fish stopped swimming' : 'spreading through the tank'}
        </text>
      </g>
    )
  }

  const glow = 6 + t * 52
  return (
    <g>
      {/* Glowing ember on a heatproof mat, with an oxygen cylinder beside it. */}
      <rect x="356" y="300" width="164" height="12" rx="3" fill="#d6d3d1" stroke={INK_MID} strokeWidth="2" />
      <circle cx="420" cy="292" r="10" fill="#B45309" />
      <path
        d={`M 408 292 Q 403 ${292 - glow * 0.7} 420 ${292 - glow - flick} Q 437 ${292 - glow * 0.7} 432 292 Z`}
        fill="#F59E0B"
        opacity={0.35 + t * 0.6}
      />

      <rect x="532" y="214" width="40" height="98" rx="14" fill="#3BAFA9" stroke={INK_MID} strokeWidth="2.5" />
      <rect x="544" y="200" width="16" height="16" rx="3" fill={STEEL} />
      <circle cx="552" cy="200" r="7" fill={INK_MID} />
      <text x="552" y="190" fontSize="11" fontWeight="800" fill="#0f766e" textAnchor="middle">
        oxygen
      </text>
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={528 - ((tick * 4 + i * 30) % 88)}
          y1={232 + i * 22}
          x2={508 - ((tick * 4 + i * 30) % 88)}
          y2={232 + i * 22}
          stroke="#CA8A04"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}

      <text x="430" y="332" fontSize="12" fontWeight="900" fill="#CA8A04" textAnchor="middle">
        {t >= 1 ? 'burning hard, no new fuel' : 'oxygen arriving'}
      </text>
    </g>
  )
}

// ── Lab floor ─────────────────────────────────────────────────────────────

// The body both students share: arms, lab gown, neck, head and face. The hair,
// and whatever they are or are not wearing, is drawn over the top by the
// caller, because that is the part each hazard changes.
//
// `reachX` / `reachY` are where the working hand goes, so each student is
// reaching for the equipment their own hazard belongs to rather than standing
// to attention beside it.
function Student({ cx, gown, shade, reachX, reachY }) {
  const SKIN = '#FBBF24'
  const SKIN_DARK = '#D99A2B'

  return (
    <g>
      <path
        d={`M ${cx - 22} 218 Q ${cx - 34} 250 ${cx - 30} 278`}
        fill="none"
        stroke={gown}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + 22} 218 Q ${cx + (reachX - cx) * 0.55} 230 ${reachX} ${reachY}`}
        fill="none"
        stroke={gown}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <circle cx={cx - 30} cy="282" r="7" fill={SKIN} />
      <circle cx={reachX} cy={reachY} r="7" fill={SKIN} />

      <path
        d={`M ${cx - 29} 218 Q ${cx - 29} 201 ${cx - 13} 197 L ${cx + 13} 197 Q ${cx + 29} 201 ${cx + 29} 218 L ${cx + 29} 312 L ${cx - 29} 312 Z`}
        fill={gown}
      />
      <path d={`M ${cx - 13} 197 L ${cx} 216 L ${cx + 13} 197 Z`} fill={shade} />
      <line x1={cx} y1="216" x2={cx} y2="312" stroke={shade} strokeWidth="1.6" />
      {[240, 262, 284].map((y) => (
        <circle key={y} cx={cx + 5} cy={y} r="2.2" fill={shade} />
      ))}

      <rect x={cx - 7} y="184" width="14" height="16" fill={SKIN_DARK} />
      <circle cx={cx} cy="172" r="20" fill={SKIN} />
      <ellipse cx={cx - 20} cy="176" rx="4" ry="5" fill={SKIN_DARK} />
      <ellipse cx={cx + 20} cy="176" rx="4" ry="5" fill={SKIN_DARK} />
      <line x1={cx - 11} y1="163" x2={cx - 4} y2="162" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
      <line x1={cx + 4} y1="162" x2={cx + 11} y2="163" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={cx - 6.5} cy="170" r="2.4" fill="#1c1917" />
      <circle cx={cx + 6.5} cy="170" r="2.4" fill="#1c1917" />
      <path
        d={`M ${cx + 1} 172 L ${cx - 1} 179 L ${cx + 3} 179`}
        fill="none"
        stroke="#B45309"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx - 6} 184 Q ${cx} 188 ${cx + 6} 184`}
        fill="none"
        stroke="#B45309"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  )
}

// Three shades, mixed strand by strand. A single brown reads as a cut-out
// shape however good the outline is; the depth is what makes it hair.
const HAIR_TINTS = ['#78350F', '#92400E', '#5C2A0B']

// One falling length of hair, drawn as separate wavy strands rather than one
// filled shape. Each strand runs the same route, out past the jaw, in over the
// shoulder and down onto the chest, but carries its own start point, width,
// shade and wave phase, so the bundle has a broken edge and gaps you can see
// through instead of a flat brown silhouette.
//
// `dir` is -1 for the left length and +1 for the right. `sway` and `drop` build
// up down the strand instead of moving it whole, because hair pivots at the
// head: the roots stay put and only the ends travel.
function HairFall({ x0, dir, sway = 0, drop = 0, count = 14 }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1)
        const phase = i % 2 ? 1 : -1
        const yTop = 150 + t * 7
        const yTip = 246 + t * 7 + drop * 0.7
        const xTop = x0 + dir * t * 5
        const xJaw = x0 + dir * (7 + t * 9) + sway * 0.25 + phase * 2
        const xShoulder = x0 + dir * (4 + t * 9) + sway * 0.55 - phase * 2
        const xTip = x0 + dir * (3 + t * 8) + sway * 1.2 + phase * 1.5
        return (
          <path
            key={i}
            d={
              `M ${xTop} ${yTop}` +
              ` C ${xTop + dir * 5} ${yTop + 14} ${xJaw - dir} 178 ${xJaw} 196` +
              ` C ${xJaw + dir} 208 ${xShoulder - dir} 214 ${xShoulder} 224` +
              ` C ${xShoulder + dir} 234 ${xTip - dir} ${yTip - 10} ${xTip} ${yTip}`
            }
            fill="none"
            stroke={HAIR_TINTS[i % 3]}
            strokeWidth={1.3 + (i % 3) * 0.55}
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

function LabFloor({ severity, resolved, onTap, tick }) {
  const flick = Math.sin(tick * 0.7) * 2
  const hair = severity.hair
  const spill = severity.spill
  const gog = severity.goggles

  // Loose hair falls on both sides: each length leaves the temple, clears the
  // jaw, drapes over its own shoulder and comes to rest on the chest.
  //
  // Only the right length carries the hazard. As it grows that side swings out
  // and further down until its tip is beside the flame, which is what the
  // `cm from flame` readout is measuring. The left side just hangs.
  const sway = hair * 18
  const drop = hair * 20

  return (
    <g>
      {/* Loose hair over a lit burner. */}
      <g onClick={() => onTap('hair')} style={{ cursor: 'pointer' }}>
        <Student cx={102} gown="#3BAFA9" shade="#0f766e" reachX={136} reachY={264} />

        {/* The crown stays a filled cap, because you genuinely cannot see
            scalp through the top of someone's head, but its lower edge is
            scalloped and strand lines run over it so it does not read as a
            flat brown shape. Tying the hair back turns both falling lengths
            into a bun. */}
        <path
          d="M 82 171 Q 84 145 102 145 Q 120 145 122 171 C 119 161 114 157 108 156 C 104 153 99 157 95 156 C 90 157 85 163 82 171 Z"
          fill="#5C2A0B"
        />
        {[
          'M 88 150 C 92 157 93 163 92 170',
          'M 95 146 C 98 155 99 162 98 169',
          'M 103 145 C 105 154 106 161 105 168',
          'M 110 147 C 112 156 113 162 112 169',
          'M 117 152 C 119 159 120 164 119 170',
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={HAIR_TINTS[i % 2]}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        {resolved.hair ? (
          <>
            <path d="M 112 150 C 122 146 132 148 130 156" fill="none" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <circle cx="128" cy="156" r="11" fill="#5C2A0B" />
            {['M 120 152 C 126 150 132 153 134 159', 'M 119 158 C 125 156 131 159 133 164', 'M 122 164 C 127 163 131 164 134 162'].map(
              (d) => (
                <path key={d} d={d} fill="none" stroke="#92400E" strokeWidth="1.4" strokeLinecap="round" />
              ),
            )}
            <rect x="114" y="151" width="9" height="9" rx="3" fill="#EA580C" />
          </>
        ) : (
          <>
            <HairFall x0={86} dir={-1} />
            <HairFall x0={118} dir={1} sway={sway} drop={drop} />
          </>
        )}

        {/* The burner they are leaning over. */}
        <path d="M 138 296 L 176 296 L 184 312 L 130 312 Z" fill="#44403c" />
        <rect x="150" y="266" width="14" height="30" fill={INK_MID} />
        <rect x="146" y="272" width="22" height="12" rx="3" fill={INK} />
        <path d={`M 150 266 Q 157 ${244 - flick} 164 266 Z`} fill="#EA580C" />

        <text
          x="122"
          y="132"
          fontSize="11"
          fontWeight="900"
          fill={resolved.hair ? '#0f766e' : '#DC2626'}
          textAnchor="middle"
        >
          {resolved.hair ? 'hair tied back' : `${Math.round((1 - hair) * 20)} cm from flame`}
        </text>
      </g>

      {/* Spill spreading across the floor. */}
      <g onClick={() => onTap('spill')} style={{ cursor: 'pointer' }}>
        {resolved.spill ? (
          <>
            <path d="M 284 348 L 300 306 L 316 348 Z" fill="#EA580C" />
            <rect x="274" y="348" width="52" height="8" rx="4" fill="#C2410C" />
            <line x1="330" y1="344" x2="368" y2="344" stroke={INK_MID} strokeWidth="1.5" />
            <text x="372" y="348" fontSize="11" fontWeight="900" fill="#0f766e">
              dry and cordoned
            </text>
          </>
        ) : (
          <>
            <ellipse cx="300" cy="348" rx={26 + spill * 58} ry={10 + spill * 15} fill="#7BC9CF" opacity="0.8" />
            <ellipse
              cx={278 - spill * 24}
              cy="340"
              rx={9 + spill * 14}
              ry={4 + spill * 6}
              fill="#7BC9CF"
              opacity="0.6"
            />
            <line x1={332 + spill * 30} y1="344" x2="372" y2="344" stroke={INK_MID} strokeWidth="1.5" />
            <text x="376" y="348" fontSize="11" fontWeight="900" fill="#DC2626">
              {Math.round(26 + spill * 78)} cm of wet floor
            </text>
          </>
        )}
      </g>

      {/* No goggles beside a boiling tube. */}
      <g onClick={() => onTap('goggles')} style={{ cursor: 'pointer' }}>
        <Student cx={472} gown="#F59E0B" shade="#B45309" reachX={506} reachY={250} />

        <path d="M 452 169 Q 455 143 472 143 Q 489 143 492 169 Q 486 153 472 152 Q 458 153 452 169 Z" fill="#1c1917" />
        {resolved.goggles && (
          <>
            <rect x="443" y="167" width="13" height="5" rx="2.5" fill="#0E7490" />
            <rect x="488" y="167" width="13" height="5" rx="2.5" fill="#0E7490" />
            <rect x="452" y="161" width="40" height="17" rx="7" fill="#0E7490" />
            <rect x="456" y="164" width="14" height="10" rx="4" fill="#7BC9CF" opacity="0.75" />
            <rect x="474" y="164" width="14" height="10" rx="4" fill="#7BC9CF" opacity="0.75" />
          </>
        )}

        {/* The boiling tube, clamped to a stand on the bench. */}
        <rect x="518" y="304" width="46" height="8" rx="3" fill={INK} />
        <rect x="536" y="238" width="9" height="70" fill={STEEL} />
        <rect x="524" y="250" width="16" height="11" rx="3" fill={INK} />
        <rect x="514" y="212" width="20" height="58" rx="9" fill="none" stroke={INK_MID} strokeWidth="2.5" />
        <rect x="516" y="240" width="16" height="28" fill="#3BAFA9" opacity="0.8" />
        {!resolved.goggles &&
          [0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={512 - ((tick * 5 + i * 18) % 44) * (0.5 + gog)}
              cy={206 - i * 7 - gog * 10}
              r="3"
              fill="#3BAFA9"
            />
          ))}

        <text
          x="486"
          y="132"
          fontSize="11"
          fontWeight="900"
          fill={resolved.goggles ? '#0f766e' : '#DC2626'}
          textAnchor="middle"
        >
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
  // reduced motion on there is no tick, so the hazards are drawn part grown
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
        ? `${active.name}, sealed on the shelf. ${active.means}`
        : demoT >= 1
          ? `${active.name}, demonstration finished. ${active.means}`
          : `${active.name}, running. ${active.watch}`
      : fixed.length === HAZARDS.length
        ? 'Lab floor clear. Nothing is getting worse.'
        : `${HAZARDS.length - fixed.length} unsafe things left, and they are still growing.`

  const readout =
    mode === 'floor'
      ? {
          label: 'hazards left',
          value: `${HAZARDS.length - fixed.length} of ${HAZARDS.length}`,
          tint: fixed.length === HAZARDS.length ? '#0f766e' : '#DC2626',
        }
      : openedAt === null
        ? { label: 'bottle', value: 'sealed', tint: INK_MID }
        : symbol === 'corrosive'
          ? { label: 'cut into steel', value: `${(demoT * 6).toFixed(1)} mm`, tint: '#DC2626' }
          : symbol === 'flammable'
            ? { label: 'flame height', value: `${(demoT * 62).toFixed(0)} mm`, tint: '#EA580C' }
            : symbol === 'toxic'
              ? {
                  label: 'tank contaminated',
                  value: `${Math.round(demoT * 100)}%`,
                  tint: '#7C3AED',
                }
              : {
                  label: 'ember temperature',
                  value: `${Math.round(400 + demoT * 500)} °C`,
                  tint: '#CA8A04',
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
              aria-label={caption}
              style={stageFill(W, H)}
            >
              <Room />

              {mode === 'cabinet' ? (
                <>
                  {/* Wall cabinet: frame, warning plate, two shelves, four
                      bottles that each carry their own pictogram. */}
                  <rect x={CAB_X} y="40" width="164" height="252" rx="8" fill="#E7E0D2" stroke={INK_MID} strokeWidth="3" />
                  <rect x={CAB_X + 8} y="66" width="148" height="218" fill="#ded3bd" />
                  <rect x={CAB_X + 8} y="46" width="148" height="20" rx="3" fill="#FBBF24" />
                  <text x={CAB_X + 82} y="60" fontSize="10.5" fontWeight="900" fill="#7c2d12" textAnchor="middle">
                    HAZARD STORE
                  </text>
                  <rect x={CAB_X + 6} y="164" width="152" height="7" fill={STEEL} />
                  <rect x={CAB_X + 6} y="278" width="152" height="7" fill={STEEL} />
                  <rect x={CAB_X - 8} y="80" width="10" height="26" rx="3" fill={STEEL} />
                  <rect x={CAB_X - 8} y="226" width="10" height="26" rx="3" fill={STEEL} />

                  {SYMBOLS.map((s, i) => {
                    const cx = CAB_X + 44 + (i % 2) * 76
                    const shelfY = 164 + Math.floor(i / 2) * 114
                    const open = s.id === symbol
                    return (
                      <g key={s.id} onClick={() => openSymbol(s.id)} style={{ cursor: 'pointer' }}>
                        <rect
                          x={cx - 22}
                          y={shelfY - 52}
                          width="44"
                          height="52"
                          rx="4"
                          fill={open ? '#FFFFFF' : '#f5f0e4'}
                          stroke={s.tint}
                          strokeWidth="2.5"
                        />
                        <rect x={cx - 7} y={shelfY - 64} width="14" height="12" fill={STEEL} />
                        <rect x={cx - 11} y={shelfY - 72} width="22" height="9" rx="2" fill={s.tint} opacity={open ? 0.4 : 1} />
                        <Diamond symbol={s} x={cx} y={shelfY - 28} scale={0.4} />
                        {shown.includes(s.id) && (
                          <circle cx={cx + 16} cy={shelfY - 46} r="6" fill="#0f766e" />
                        )}
                      </g>
                    )
                  })}

                  {/* The bottle currently open, blown up on the wall. */}
                  <Diamond symbol={active} x={272} y={86} scale={0.95} />
                  <text x="272" y="146" fontSize="13" fontWeight="900" fill={active.tint} textAnchor="middle">
                    {active.name}
                  </text>

                  {openedAt === null ? (
                    <text x="430" y="230" fontSize="13" fontWeight="800" fill={INK_MID} textAnchor="middle">
                      open a bottle
                    </text>
                  ) : (
                    <Demo id={symbol} t={demoT} tick={tick} />
                  )}
                </>
              ) : (
                <LabFloor
                  severity={severity}
                  resolved={{
                    hair: fixed.includes('hair'),
                    spill: fixed.includes('spill'),
                    goggles: fixed.includes('goggles'),
                  }}
                  onTap={fixHazard}
                  tick={tick}
                />
              )}

              <Readout label={readout.label} value={readout.value} tint={readout.tint} />
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
                  Open a bottle: {shown.length} of {SYMBOLS.length} shown
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
                  Step in: {fixed.length} of {HAZARDS.length} fixed
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
                  You can also tap the hazard in the picture.
                </p>
              </div>
            )}
          </>
        }
      />

      <p aria-live="polite" className="sr-only">
        {caption} {shown.length} of {SYMBOLS.length} symbols demonstrated, {fixed.length} of{' '}
        {HAZARDS.length} hazards fixed.
      </p>
    </>
  )
}
