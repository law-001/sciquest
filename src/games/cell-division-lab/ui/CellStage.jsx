import { useMemo } from 'react';
import {
  NUCLEUS, STAGE_H, STAGE_W,
  circleShape, membraneDots, membranePaths, outerRadius,
} from '../render/cellGeometry';
import { ChromatinFiber, Mitochondrion } from '../render/parts';

// Everything in here is scenery: it gives the chromosomes somewhere to live,
// and it never takes a pointer event. Positions are deterministic so the
// furniture does not rearrange itself on every render.

// Golden angle — an even scatter with no clumping and no randomness.
const RIBOSOMES = Array.from({ length: 54 }, (_, i) => ({
  a: i * 2.39996,
  rf: 0.24 + 0.72 * Math.sqrt((i + 0.5) / 54),
}));

const SPECKS = Array.from({ length: 120 }, (_, i) => ({
  a: i * 2.39996 + 1.1,
  rf: 0.1 + 0.88 * Math.sqrt((i + 0.5) / 120),
  s: 1.2 + (i % 3) * 0.6,
}));

function StageDefs() {
  return (
    <defs>
      <radialGradient id="cdl-cytoplasm" cx="38%" cy="34%" r="78%">
        <stop offset="0%" stopColor="var(--cdl-cyto-1)" />
        <stop offset="58%" stopColor="var(--cdl-cyto-2)" />
        <stop offset="100%" stopColor="var(--cdl-cyto-3)" />
      </radialGradient>
      <radialGradient id="cdl-nucleoplasm" cx="40%" cy="34%" r="75%">
        <stop offset="0%" stopColor="var(--cdl-nuc-1)" />
        <stop offset="100%" stopColor="var(--cdl-nuc-2)" />
      </radialGradient>
      <radialGradient id="cdl-halo" cx="50%" cy="50%" r="50%">
        <stop offset="52%" stopColor="var(--cdl-membrane)" stopOpacity="0" />
        <stop offset="82%" stopColor="var(--cdl-membrane)" stopOpacity="0.16" />
        <stop offset="100%" stopColor="var(--cdl-membrane)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// Rough endoplasmic reticulum: stacked folded sheets studded with ribosomes.
function Reticulum({ x, y }) {
  const sheets = [0, 1, 2];
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift cdl-drift--b">
        {sheets.map((i) => (
          <path
            key={i}
            d={`M -54 ${-26 + i * 26} q 26 -15 52 0 q 26 15 52 0`}
            fill="none"
            stroke="var(--cdl-er)"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        {sheets.map((i) => [-40, -8, 24, 52].map((dx) => (
          <circle key={`${i}-${dx}`} cx={dx} cy={-33 + i * 26} r={2.4} fill="var(--cdl-ribosome)" />
        )))}
      </g>
    </g>
  );
}

// Golgi apparatus: stacked cisternae with vesicles budding off the rim.
function Golgi({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift cdl-drift--c">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${-46 + i * 5} ${-24 + i * 15} a 52 52 0 0 0 ${92 - i * 10} 0`}
            fill="none"
            stroke="var(--cdl-golgi)"
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
        <circle cx={56} cy={-32} r={6} fill="var(--cdl-golgi)" fillOpacity={0.6} />
        <circle cx={68} cy={-10} r={4} fill="var(--cdl-golgi)" fillOpacity={0.45} />
      </g>
    </g>
  );
}

// Smooth ER: a tubular network rather than stacked sheets, and no ribosomes.
function SmoothER({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${-40 + i * 8} ${-20 + i * 18} c 14 -14 32 -12 40 2 c 8 14 26 16 38 4`}
            fill="none"
            stroke="var(--cdl-er)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeOpacity={0.7}
          />
        ))}
      </g>
    </g>
  );
}

// Lysosome: a digestive sac, drawn with the granular contents that make it
// tellable from a plain vesicle.
function Lysosome({ x, y, r = 15 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift cdl-drift--c">
        <circle r={r} fill="var(--cdl-lyso)" stroke="var(--cdl-lyso-line)" strokeWidth={2} />
        {[[-5, -4], [4, -6], [0, 3], [6, 4], [-6, 5]].map(([dx, dy]) => (
          <circle key={`${dx},${dy}`} cx={dx} cy={dy} r={2.2} fill="var(--cdl-lyso-line)" />
        ))}
      </g>
    </g>
  );
}

function Peroxisome({ x, y, r = 9 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift cdl-drift--b">
        <circle r={r} fill="var(--cdl-vesicle)" stroke="var(--cdl-membrane)" strokeWidth={1.6} strokeOpacity={0.5} />
        <rect x={-3.5} y={-3.5} width={7} height={7} rx={1.5} fill="var(--cdl-membrane)" fillOpacity={0.45} />
      </g>
    </g>
  );
}

function CellInterior({ shape, cx, cy }) {
  const r = outerRadius(shape);
  const polar = (deg, rf) => ({
    x: cx + Math.cos((deg * Math.PI) / 180) * r * rf,
    y: cy + Math.sin((deg * Math.PI) / 180) * r * rf,
  });

  // Scenery keeps to the periphery, and it is all drawn before the
  // chromosomes, which sit on top of it.
  const mitochondria = [32, 148, 212, 328].map((d, i) => ({ ...polar(d, 0.87), rot: d + 90, i }));
  const lysosomes = [58, 122, 238, 302].map((d, i) => ({ ...polar(d, 0.88), i }));
  const peroxisomes = [12, 168, 192, 348].map((d, i) => ({ ...polar(d, 0.93), i }));
  const vesicles = [22, 45, 70, 110, 135, 158, 202, 225, 250, 290, 315, 338]
    .map((d, i) => ({ ...polar(d, 0.96), i }));

  return (
    <g pointerEvents="none">
      {/* Fine cytosolic texture, thin enough to sit under everything */}
      {SPECKS.map(({ a, rf, s: size }, i) => (
        <circle
          key={`sp${i}`}
          cx={(cx + Math.cos(a) * r * rf).toFixed(1)}
          cy={(cy + Math.sin(a) * r * rf * 0.95).toFixed(1)}
          r={size}
          fill="var(--cdl-speck)"
        />
      ))}

      {RIBOSOMES.map(({ a, rf }, i) => (
        <circle
          key={`rb${i}`}
          cx={(cx + Math.cos(a) * r * rf).toFixed(1)}
          cy={(cy + Math.sin(a) * r * rf * 0.96).toFixed(1)}
          r={2.4}
          fill="var(--cdl-ribosome)"
        />
      ))}

      <Reticulum x={cx - r * 0.87} y={cy - r * 0.28} />
      <Reticulum x={cx - r * 0.8} y={cy + r * 0.42} />
      <Golgi x={cx + r * 0.84} y={cy - r * 0.2} />
      <SmoothER x={cx + r * 0.78} y={cy + r * 0.46} />

      {mitochondria.map((m) => (
        <Mitochondrion key={`mt${m.i}`} x={m.x} y={m.y} rot={m.rot} scale={0.92} variant={m.i % 2 ? 'b' : 'c'} />
      ))}
      {lysosomes.map((l) => <Lysosome key={`ly${l.i}`} x={l.x} y={l.y} r={l.i % 2 ? 13 : 16} />)}
      {peroxisomes.map((pk) => <Peroxisome key={`px${pk.i}`} x={pk.x} y={pk.y} r={pk.i % 2 ? 8 : 10} />)}

      {vesicles.map((v) => (
        <g key={`vs${v.i}`} transform={`translate(${v.x.toFixed(1)} ${v.y.toFixed(1)})`}>
          <g className={`cdl-drift${v.i % 3 === 0 ? ' cdl-drift--c' : ''}`}>
            <circle r={v.i % 4 === 0 ? 9 : 6.5} fill="var(--cdl-vesicle)" />
            <circle
              r={v.i % 4 === 0 ? 9 : 6.5}
              fill="none"
              stroke="var(--cdl-membrane)"
              strokeWidth={1.4}
              strokeOpacity={0.4}
            />
          </g>
        </g>
      ))}
    </g>
  );
}

// Inside the nucleus: speckles, nucleoli, and the sliver of cytoplasm still
// visible past the envelope in the corners.
function NucleusInterior() {
  const speckles = Array.from({ length: 130 }, (_, i) => {
    const a = i * 2.39996;
    const rf = Math.sqrt((i + 0.5) / 130) * 0.97;
    return {
      x: NUCLEUS.cx + Math.cos(a) * NUCLEUS.r * rf,
      y: NUCLEUS.cy + Math.sin(a) * NUCLEUS.r * rf,
      r: 1.6 + (i % 4) * 0.7,
    };
  }).filter((p) => p.y > -6 && p.y < STAGE_H + 6);

  // Chromosome territories — the loose chromatin that is not being worked on.
  // Kept clear of the middle band, which is where the DNA and the chromosomes
  // are handled.
  const territories = [
    { x: 130, y: 96, seed: 1 }, { x: 352, y: 74, seed: 3 },
    { x: 648, y: 68, seed: 5 }, { x: 878, y: 104, seed: 2 },
    { x: 124, y: 520, seed: 4 }, { x: 886, y: 536, seed: 6 },
  ];

  const corners = [
    { x: 34, y: 30, rot: 30 },
    { x: 966, y: 34, rot: -28 },
    { x: 38, y: 592, rot: -34 },
    { x: 962, y: 588, rot: 26 },
  ];

  return (
    <g pointerEvents="none">
      {territories.map((t) => (
        <ChromatinFiber
          key={`${t.x}-${t.y}`}
          x={t.x}
          y={t.y}
          seed={t.seed}
          spread={52}
          color="var(--cdl-chromatin)"
          width={5}
          opacity={0.22}
        />
      ))}

      {/* Nucleoli, where ribosomes are built */}
      <ellipse cx={168} cy={158} rx={66} ry={52} fill="var(--cdl-nucleolus)" />
      <ellipse cx={168} cy={158} rx={40} ry={30} fill="var(--cdl-nucleolus)" />
      <ellipse cx={846} cy={470} rx={52} ry={42} fill="var(--cdl-nucleolus)" />
      <ellipse cx={846} cy={470} rx={30} ry={24} fill="var(--cdl-nucleolus)" />
      <ellipse cx={742} cy={122} rx={34} ry={27} fill="var(--cdl-nucleolus)" />

      {speckles.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.r} fill="var(--cdl-speckle)" />
      ))}

      {corners.map((c) => (
        <Mitochondrion key={`${c.x}-${c.y}`} x={c.x} y={c.y} rot={c.rot} scale={0.6} />
      ))}
    </g>
  );
}

// The cell, as the board rather than as wallpaper.
//
// Everything a procedure draws goes inside this same <svg>, so the student is
// handling the cell's own chromosomes and DNA — there is no panel floating on
// top of a picture of a cell.
//
// `view` picks the magnification: 'cell' frames the whole cell; 'nucleus'
// pushes in until the nucleoplasm fills the frame and the envelope curves
// across the corners.
export function CellStage({
  view = 'cell',
  shape,
  nucleus = null,
  straining = false,
  label = 'Cell',
  children,
}) {
  const cellShape = shape ?? circleShape();
  const paths = useMemo(() => membranePaths(cellShape), [cellShape]);
  const dots = useMemo(() => membraneDots(cellShape, 500, 312, 84, 4), [cellShape]);
  const innerDots = useMemo(() => membraneDots(cellShape, 500, 312, 84, -13), [cellShape]);

  return (
    <svg
      className="cdl-svg cdl-enter"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={label}
    >
      <StageDefs />
      <clipPath id="cdl-cell-clip">
        {paths.map((d) => <path key={d.slice(0, 26)} d={d} />)}
      </clipPath>

      {view === 'nucleus' ? (
        <g pointerEvents="none">
          <rect x={0} y={0} width={STAGE_W} height={STAGE_H} fill="url(#cdl-cytoplasm)" />
          <circle cx={NUCLEUS.cx} cy={NUCLEUS.cy} r={NUCLEUS.r} fill="url(#cdl-nucleoplasm)" />
          <NucleusInterior />
          <circle
            cx={NUCLEUS.cx}
            cy={NUCLEUS.cy}
            r={NUCLEUS.r}
            fill="none"
            stroke="var(--cdl-nuc-line)"
            strokeWidth={8}
          />
          <circle
            cx={NUCLEUS.cx}
            cy={NUCLEUS.cy}
            r={NUCLEUS.r - 15}
            fill="none"
            stroke="var(--cdl-nuc-line)"
            strokeWidth={3}
            strokeOpacity={0.45}
          />
          {/* Nuclear pores. Only the arc crossing the frame is worth drawing. */}
          {Array.from({ length: 44 }, (_, i) => {
            const a = (i / 44) * Math.PI * 2;
            const cy = NUCLEUS.cy + Math.sin(a) * NUCLEUS.r;
            if (cy < -12 || cy > STAGE_H + 12) return null;
            return (
              <circle
                key={i}
                cx={NUCLEUS.cx + Math.cos(a) * NUCLEUS.r}
                cy={cy}
                r={7}
                fill="var(--cdl-nuc-2)"
                stroke="var(--cdl-nuc-pore)"
                strokeWidth={3}
              />
            );
          })}
        </g>
      ) : (
        <g className={straining ? 'cdl-strain' : undefined} pointerEvents="none">
          <g className="cdl-cell">
            <circle cx={500} cy={312} r={outerRadius(cellShape) * 1.32} fill="url(#cdl-halo)" />

            {paths.map((d) => (
              <path key={d.slice(0, 26)} d={d} fill="url(#cdl-cytoplasm)" />
            ))}

            {/* Clipped to the membrane so the contents stay inside the cell
                as it stretches, pinches and finally splits in two. */}
            <g clipPath="url(#cdl-cell-clip)">
              <CellInterior shape={cellShape} cx={500} cy={312} />
              {nucleus}
            </g>

            {/* The cortical actin mesh lining the inside of the membrane */}
            {paths.map((d) => (
              <path
                key={`cortex-${d.slice(0, 26)}`}
                d={d}
                fill="none"
                stroke="var(--cdl-cortex)"
                strokeWidth={2}
                strokeDasharray="10 7"
                transform="translate(500 312) scale(0.925) translate(-500 -312)"
              />
            ))}

            {/* A phospholipid bilayer: two leaflets, each with its own row of
                heads, rather than a single outline. */}
            {paths.map((d) => (
              <path
                key={`inner-${d.slice(0, 26)}`}
                d={d}
                fill="none"
                stroke="var(--cdl-membrane)"
                strokeWidth={4}
                strokeOpacity={0.6}
                strokeLinejoin="round"
                transform="translate(500 312) scale(0.968) translate(-500 -312)"
              />
            ))}
            {paths.map((d) => (
              <path
                key={`edge-${d.slice(0, 26)}`}
                d={d}
                fill="none"
                stroke="var(--cdl-membrane)"
                strokeWidth={5}
                strokeLinejoin="round"
              />
            ))}
            {innerDots.map((p) => (
              <circle key={`in-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={2.2} fill="var(--cdl-membrane-dot)" />
            ))}
            {dots.map((p) => (
              <circle key={`out-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={2.6} fill="var(--cdl-membrane-dot)" />
            ))}
          </g>
        </g>
      )}

      {children}
    </svg>
  );
}
