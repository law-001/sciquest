import { CELL } from '../render/cellGeometry';
import { Centrosome, ChromatinFiber, Chromosome, Nucleus, SpindleFiber } from '../render/parts';
import { CellStage } from './CellStage';
import { CHROM_COLORS, CHROM_LABELS } from '../procedures/palette';

// The cell at rest, shown behind a checkpoint gate. Nothing here is
// interactive — the point is that the cell you are about to make a call about
// stays in front of you while you make it.

const SCATTER = [
  { x: 372, y: 214, angle: -18 },
  { x: 636, y: 202, angle: 20 },
  { x: 358, y: 412, angle: 12 },
  { x: 650, y: 420, angle: -24 },
];

const POLES = [
  { id: 'top', y: CELL.cy - CELL.r + 34, dir: -1 },
  { id: 'bottom', y: CELL.cy + CELL.r - 34, dir: 1 },
];

export function AmbientCell({ stage = 0, label = 'Cell' }) {
  if (stage >= 1) {
    return (
      <CellStage label={label}>
        {POLES.map((p) => <Centrosome key={p.id} x={CELL.cx} y={p.y} dir={p.dir} />)}
        {SCATTER.map((s, i) => POLES.map((p) => (
          <SpindleFiber
            key={`${CHROM_LABELS[i]}-${p.id}`}
            x1={CELL.cx}
            y1={p.y}
            x2={s.x}
            y2={s.y + (p.id === 'top' ? -24 : 24)}
            width={2}
            opacity={0.45}
          />
        )))}
        {SCATTER.map((s, i) => (
          <Chromosome
            key={CHROM_LABELS[i]}
            x={s.x}
            y={s.y}
            angle={s.angle}
            scale={0.86}
            color={CHROM_COLORS[i]}
            label={CHROM_LABELS[i]}
            kinetochores
          />
        ))}
      </CellStage>
    );
  }

  const nucleusR = CELL.r * 0.46;
  return (
    <CellStage label={label} nucleus={<Nucleus x={CELL.cx} y={CELL.cy} r={nucleusR} />}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <ChromatinFiber
            key={i}
            x={CELL.cx + Math.cos(a) * nucleusR * 0.42}
            y={CELL.cy + Math.sin(a) * nucleusR * 0.42}
            seed={i * 2 + 1}
            spread={nucleusR * 0.34}
            color="var(--cdl-chromatin)"
            width={4}
            opacity={0.75}
          />
        );
      })}
    </CellStage>
  );
}
