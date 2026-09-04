// The cell's parts, drawn as SVG in stage coordinates.
//
// Everything here is a real structure the student is meant to recognise: a
// chromosome has two sister chromatids joined at a centromere with a
// kinetochore facing each pole, a nucleotide has a phosphate, a sugar and a
// base, and a base only physically fits its partner.

import { CHROM_COLORS } from '../procedures/palette';
import { BASE_TINT, baseHeight, basePath, chromatinPath } from './partShapes';

// ── Chromosomes ──────────────────────────────────────────────────────────

// One chromatid, lying along the x axis with its waist at the origin.
function chromatidPath(halfLen, halfThick) {
  const L = halfLen;
  const T = halfThick;
  const waist = T * 0.42;
  return [
    `M ${-L} ${-T}`,
    `C ${-L * 0.45} ${-T} ${-L * 0.2} ${-waist} 0 ${-waist}`,
    `C ${L * 0.2} ${-waist} ${L * 0.45} ${-T} ${L} ${-T}`,
    `A ${T} ${T} 0 0 1 ${L} ${T}`,
    `C ${L * 0.45} ${T} ${L * 0.2} ${waist} 0 ${waist}`,
    `C ${-L * 0.2} ${waist} ${-L * 0.45} ${T} ${-L} ${T}`,
    `A ${T} ${T} 0 0 1 ${-L} ${-T}`,
    'Z',
  ].join(' ');
}

function Bands({ halfLen, halfThick, tone }) {
  const at = [-0.72, -0.42, 0.42, 0.72];
  return at.map((f) => (
    <rect
      key={f}
      x={halfLen * f - halfLen * 0.06}
      y={-halfThick * 0.78}
      width={halfLen * 0.12}
      height={halfThick * 1.56}
      rx={halfLen * 0.05}
      fill={tone}
    />
  ));
}

// A duplicated chromosome: two sister chromatids stacked across the spindle
// axis, so the kinetochore on each faces its own pole.
export function Chromosome({
  x, y, angle = 0, scale = 1, color = CHROM_COLORS[0], label,
  glow = false, kinetochores = false, attached = { top: false, bottom: false },
  dim = false,
}) {
  const L = 46;
  const T = 11;
  const offset = T + 1.5;
  const d = chromatidPath(L, T);

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}
      opacity={dim ? 0.35 : 1}
      style={{ filter: glow ? 'drop-shadow(0 0 10px currentColor)' : 'none', color }}
    >
      {['top', 'bottom'].map((side, i) => (
        <g key={side} transform={`translate(0 ${i === 0 ? -offset : offset})`}>
          <path d={d} fill={color} />
          <path d={d} fill={i === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.1)'} />
          <Bands halfLen={L} halfThick={T} tone="rgba(0,0,0,0.16)" />
        </g>
      ))}

      {/* Centromere — the constriction that holds the sisters together */}
      <ellipse cx={0} cy={0} rx={T * 0.85} ry={offset + T * 0.35} fill={color} />
      <ellipse cx={0} cy={0} rx={T * 0.45} ry={offset * 0.7} fill="rgba(255,255,255,0.3)" />

      {kinetochores && ['top', 'bottom'].map((side, i) => (
        <rect
          key={side}
          x={-9}
          y={i === 0 ? -(offset + T + 5) : offset + T - 1}
          width={18}
          height={6}
          rx={3}
          fill={attached[side] ? 'var(--cdl-good)' : 'var(--cdl-surface)'}
          stroke={attached[side] ? 'var(--cdl-good)' : 'var(--cdl-ink-4)'}
          strokeWidth={1.5}
        />
      ))}

      {label && (
        <text
          x={0}
          y={offset * 2 + T + 20}
          textAnchor="middle"
          fill="var(--cdl-ink-3)"
          fontSize={15}
          fontWeight={700}
          fontFamily="var(--cdl-font-mono)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// Half a chromosome — what actually travels to a pole in anaphase.
export function Chromatid({ x, y, angle = 0, scale = 1, color, label, glow = false }) {
  const L = 46;
  const T = 11;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}
      style={{ filter: glow ? 'drop-shadow(0 0 10px currentColor)' : 'none', color }}
    >
      <path d={chromatidPath(L, T)} fill={color} />
      <Bands halfLen={L} halfThick={T} tone="rgba(0,0,0,0.16)" />
      <ellipse cx={0} cy={0} rx={T * 0.8} ry={T * 1.05} fill={color} />
      {label && (
        <text
          x={0}
          y={T + 22}
          textAnchor="middle"
          fill="var(--cdl-ink-3)"
          fontSize={14}
          fontWeight={700}
          fontFamily="var(--cdl-font-mono)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ── Chromatin ────────────────────────────────────────────────────────────

export function ChromatinFiber({ x, y, seed = 1, spread = 42, coil = 0, color, width = 5, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} pointerEvents="none">
      <path
        d={chromatinPath(seed, spread, coil)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// ── Organelles ───────────────────────────────────────────────────────────

// A mitochondrion, with the folded inner membrane that gives it its shape.
export function Mitochondrion({ x, y, rot = 0, scale = 1, variant = '' }) {
  const cristae = [-26, -13, 0, 13, 26];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} pointerEvents="none">
      <g className={`cdl-drift${variant ? ` cdl-drift--${variant}` : ''}`}>
        <rect x={-38} y={-17} width={76} height={34} rx={17} fill="var(--cdl-mito)" fillOpacity={0.55} />
        <rect
          x={-38}
          y={-17}
          width={76}
          height={34}
          rx={17}
          fill="none"
          stroke="var(--cdl-mito-line)"
          strokeWidth={2}
        />
        {cristae.map((dx) => (
          <path
            key={dx}
            d={`M ${dx} -15 q 9 8 0 15 q -9 7 0 15`}
            fill="none"
            stroke="var(--cdl-mito-line)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeOpacity={0.75}
          />
        ))}
      </g>
    </g>
  );
}

// ── Spindle ──────────────────────────────────────────────────────────────

export function Centrosome({ x, y, dir = 1, active = false }) {
  const rays = Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI / 2 + (i - 4) * 0.3;
    return { x2: x + Math.cos(a) * 66 * dir, y2: y + Math.sin(a) * 66 * dir };
  });
  return (
    <g pointerEvents="none">
      {rays.map((r) => (
        <line
          key={`${r.x2}-${r.y2}`}
          x1={x}
          y1={y}
          x2={r.x2}
          y2={r.y2}
          stroke="var(--cdl-teal)"
          strokeWidth={1.6}
          strokeOpacity={0.34}
          strokeLinecap="round"
        />
      ))}
      <g transform={`translate(${x} ${y})`}>
        <circle r={17} fill="var(--cdl-teal)" fillOpacity={active ? 0.24 : 0.12} />
        <rect x={-9} y={-3.5} width={18} height={7} rx={3.5} fill="var(--cdl-orange)" />
        <rect x={-3.5} y={-9} width={7} height={18} rx={3.5} fill="var(--cdl-orange-deep)" />
      </g>
    </g>
  );
}

// A microtubule. Bowed slightly so a bundle of them reads as a spindle
// rather than a fan of straight lines.
export function SpindleFiber({
  x1, y1, x2, y2, tone = 'var(--cdl-teal)', width = 2.4,
  dashed = false, opacity = 0.85, grow = false, animated = false,
}) {
  const mx = (x1 + x2) / 2 + (y1 < y2 ? -14 : 14);
  const my = (y1 + y2) / 2;
  // pathLength normalises the dash to 1 so one CSS rule draws any fibre on.
  return (
    <path
      className={`${grow ? 'cdl-grow ' : ''}${animated ? 'cdl-morph' : ''}`.trim() || undefined}
      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
      fill="none"
      stroke={tone}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeLinecap="round"
      pathLength={grow ? 1 : undefined}
      strokeDasharray={grow ? '1' : dashed ? '8 6' : undefined}
      pointerEvents="none"
    />
  );
}

// ── Nucleus ──────────────────────────────────────────────────────────────

export function Nucleus({ x, y, r, envelope = 'solid', opacity = 1 }) {
  return (
    <g opacity={opacity} pointerEvents="none">
      <circle cx={x} cy={y} r={r} fill="url(#cdl-nucleoplasm)" />
      <circle cx={x - r * 0.3} cy={y + r * 0.22} r={r * 0.2} fill="var(--cdl-nucleolus)" />
      {envelope !== 'none' && (
        <circle
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke="var(--cdl-nuc-line)"
          strokeWidth={3}
          strokeDasharray={envelope === 'dashed' ? '10 8' : undefined}
        />
      )}
    </g>
  );
}

// ── DNA ──────────────────────────────────────────────────────────────────

// `flip` draws the base upward instead, for the strand running along the top.
export function Base({ base, flip = false, muted = false, damaged = false }) {
  const h = baseHeight(base);
  const sign = flip ? -1 : 1;
  return (
    <g>
      <g transform={flip ? 'scale(1 -1)' : undefined}>
        <path
          d={basePath(base)}
          fill={damaged ? 'var(--cdl-ink-4)' : BASE_TINT[base]}
          fillOpacity={muted ? 0.4 : 1}
          stroke={damaged ? 'var(--cdl-bad)' : 'rgba(0,0,0,0.18)'}
          strokeWidth={damaged ? 2.5 : 1}
          strokeDasharray={damaged ? '5 4' : undefined}
        />
      </g>
      <text
        x={0}
        y={sign * h * 0.5 + 6}
        textAnchor="middle"
        fill="#fff"
        fontSize={17}
        fontWeight={800}
        fontFamily="var(--cdl-font-mono)"
        pointerEvents="none"
      >
        {damaged ? '?' : base}
      </text>
    </g>
  );
}

// A free nucleotide: phosphate, deoxyribose, base — the unit that actually
// gets added to the growing strand.
export function Nucleotide({ base, flip = false, muted = false, damaged = false }) {
  const h = baseHeight(base);
  const sign = flip ? -1 : 1;
  const sugarY = sign * (h + 17);
  const phosY = sign * (h + 40);

  return (
    <g>
      <line
        x1={0}
        y1={sign * h}
        x2={0}
        y2={phosY}
        stroke="var(--cdl-ink-4)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Base base={base} flip={flip} muted={muted} damaged={damaged} />
      <g transform={`translate(0 ${sugarY})`}>
        <path
          d="M 0 -14 L 13 -4 L 8 12 L -8 12 L -13 -4 Z"
          fill="var(--cdl-yellow-soft)"
          stroke="var(--cdl-yellow-deep)"
          strokeWidth={2}
        />
      </g>
      <circle
        cx={0}
        cy={phosY}
        r={9}
        fill="var(--cdl-surface)"
        stroke="var(--cdl-teal-deep)"
        strokeWidth={2.5}
      />
      <text
        x={0}
        y={phosY + 4}
        textAnchor="middle"
        fill="var(--cdl-teal-deep)"
        fontSize={11}
        fontWeight={800}
        fontFamily="var(--cdl-font-mono)"
        pointerEvents="none"
      >
        P
      </text>
    </g>
  );
}

// A deoxyribose on its own, for marking positions along a bare backbone.
export function Sugar({ x, y, flip = false }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(1 -1)' : ''}`} pointerEvents="none">
      <path
        d="M 0 -11 L 10 -3 L 6 9 L -6 9 L -10 -3 Z"
        fill="var(--cdl-yellow-soft)"
        stroke="var(--cdl-yellow-deep)"
        strokeWidth={1.8}
      />
    </g>
  );
}

// The hydrogen bonds across a completed pair — two for A–T, three for G–C.
export function HydrogenBonds({ x, yTop, yBottom, count }) {
  const spread = count === 3 ? [-14, 0, 14] : [-10, 10];
  return spread.map((dx) => (
    <line
      key={dx}
      x1={x + dx}
      y1={yTop}
      x2={x + dx}
      y2={yBottom}
      stroke="var(--cdl-teal-deep)"
      strokeWidth={2}
      strokeDasharray="3 3"
      strokeLinecap="round"
      pointerEvents="none"
    />
  ));
}

// A wound stretch of double helix: the two backbones cross, with base pairs
// as rungs between them.
export function Helix({ x1, x2, y, amp = 40, period = 130, phase = 0, color = 'var(--cdl-teal-deep)' }) {
  const step = 6;
  let a = '';
  let b = '';
  for (let x = x1; x <= x2; x += step) {
    const t = ((x - x1) / period) * Math.PI * 2 + phase;
    a += `${x === x1 ? 'M' : 'L'} ${x.toFixed(1)} ${(y + Math.sin(t) * amp).toFixed(1)} `;
    b += `${x === x1 ? 'M' : 'L'} ${x.toFixed(1)} ${(y - Math.sin(t) * amp).toFixed(1)} `;
  }

  const bars = [];
  for (let x = x1 + period / 8; x <= x2; x += period / 4) {
    const t = ((x - x1) / period) * Math.PI * 2 + phase;
    const dy = Math.sin(t) * amp;
    bars.push(
      <line
        key={x}
        x1={x}
        y1={y + dy}
        x2={x}
        y2={y - dy}
        stroke="var(--cdl-ink-4)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeOpacity={0.6}
      />,
    );
  }

  return (
    <g pointerEvents="none">
      {bars}
      <path d={a} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
      <path d={b} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeOpacity={0.72} />
    </g>
  );
}
