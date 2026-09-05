import { useMemo } from 'react';
import {
  NUCLEUS, STAGE_H, STAGE_W,
  circleShape, membranePaths, outerRadius,
} from '../render/cellGeometry';
import { ChromatinFiber, Mitochondrion } from '../render/parts';
import { useStageZoom } from './stage-zoom';

// Everything in here is scenery: it gives the chromosomes somewhere to live,
// and it never takes a pointer event. One of each organelle, placed by hand —
// a scatter of dozens of look-alike dots reads as noise, not as a cell.

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

// A transport vesicle: cargo moving between the organelles.
function Vesicle({ x, y, r = 9 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cdl-drift">
        <circle
          r={r}
          fill="var(--cdl-vesicle)"
          stroke="var(--cdl-membrane)"
          strokeWidth={1.6}
          strokeOpacity={0.45}
        />
      </g>
    </g>
  );
}

const CYTOPLASM_PARTS = {
  roughEr: Reticulum,
  golgi: Golgi,
  smoothEr: SmoothER,
  lysosome: Lysosome,
  peroxisome: Peroxisome,
  mitochondrion: Mitochondrion,
  vesicle: Vesicle,
};

// Placed in the four quadrants as fractions of the cell radius: clear of the
// poles (top and bottom, where the spindle forms), clear of the middle band
// (where the chromosomes line up), and clear of the waist the cell pinches at.
const CYTOPLASM = [
  { id: 'rer', kind: 'roughEr', fx: -0.52, fy: -0.5 },
  { id: 'golgi', kind: 'golgi', fx: 0.54, fy: -0.48 },
  { id: 'ser', kind: 'smoothEr', fx: 0.5, fy: 0.52 },
  { id: 'lyso', kind: 'lysosome', fx: -0.56, fy: 0.5, props: { r: 16 } },
  { id: 'mito-a', kind: 'mitochondrion', fx: -0.22, fy: -0.72, props: { rot: 16 } },
  { id: 'mito-b', kind: 'mitochondrion', fx: 0.26, fy: 0.72, props: { rot: -14, variant: 'b' } },
  { id: 'perox', kind: 'peroxisome', fx: 0.7, fy: -0.24, props: { r: 10 } },
  { id: 'ves-a', kind: 'vesicle', fx: -0.72, fy: -0.2 },
  { id: 'ves-b', kind: 'vesicle', fx: 0.3, fy: -0.66, props: { r: 7 } },
  { id: 'ves-c', kind: 'vesicle', fx: -0.3, fy: 0.68, props: { r: 7 } },
];

function CellInterior({ shape, cx, cy }) {
  const r = outerRadius(shape);

  return (
    <g pointerEvents="none">
      {CYTOPLASM.map(({ id, kind, fx, fy, props }) => {
        const Part = CYTOPLASM_PARTS[kind];
        return <Part key={id} x={cx + fx * r} y={cy + fy * r} {...props} />;
      })}
    </g>
  );
}

// Inside the nucleus: the chromosome territories that are not being worked on,
// and the nucleoli where ribosomes are built. Nothing is drawn past the
// envelope — at this magnification it reads as the edge of everything, so an
// organelle out there looks like it escaped the cell.
function NucleusInterior() {
  // Kept to the top and bottom strips: the middle band is where the DNA, the
  // chromosomes and the crossing-over columns are handled.
  const territories = [
    { x: 350, y: 92, seed: 1 },
    { x: 660, y: 88, seed: 3 },
    { x: 330, y: 552, seed: 4 },
    { x: 676, y: 556, seed: 6 },
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

      {/* Nucleoli, where ribosomes are built. Kept out of the middle band,
          which is where the DNA and the chromosomes are handled. */}
      <ellipse cx={170} cy={156} rx={62} ry={50} fill="var(--cdl-nucleolus)" />
      <ellipse cx={170} cy={156} rx={38} ry={29} fill="var(--cdl-nucleolus)" />
      <ellipse cx={844} cy={470} rx={50} ry={40} fill="var(--cdl-nucleolus)" />
      <ellipse cx={844} cy={470} rx={29} ry={23} fill="var(--cdl-nucleolus)" />
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

  // Zooming out grows the window on the stage, so the cell keeps its shape
  // instead of being cut off by the edge of the frame.
  const zoom = useStageZoom();
  const width = STAGE_W / zoom;
  const height = STAGE_H / zoom;

  return (
    <svg
      className="cdl-svg cdl-enter"
      viewBox={`${(STAGE_W - width) / 2} ${(STAGE_H - height) / 2} ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={label}
    >
      <StageDefs />
      <clipPath id="cdl-cell-clip">
        {paths.map((d) => <path key={d.slice(0, 26)} d={d} />)}
      </clipPath>

      {view === 'nucleus' ? (
        <g pointerEvents="none">
          {/* Nothing is painted behind the envelope: outside the nucleus is the
              bare stage grid, so the teal only ever reads as "inside". */}
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
          {/* Nuclear pores. Only the arc crossing the frame is worth drawing. */}
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2;
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
            {paths.map((d) => (
              <path key={d.slice(0, 26)} d={d} fill="url(#cdl-cytoplasm)" />
            ))}

            {/* Clipped to the membrane so the contents stay inside the cell
                as it stretches, pinches and finally splits in two. */}
            <g clipPath="url(#cdl-cell-clip)">
              <CellInterior shape={cellShape} cx={500} cy={312} />
              {nucleus}
            </g>

            {/* One membrane, drawn as a single wall. */}
            {paths.map((d) => (
              <path
                key={`edge-${d.slice(0, 26)}`}
                d={d}
                fill="none"
                stroke="var(--cdl-membrane)"
                strokeWidth={6}
                strokeLinejoin="round"
              />
            ))}
          </g>
        </g>
      )}

      {children}
    </svg>
  );
}
