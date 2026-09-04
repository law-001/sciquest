import { useEffect, useRef, useState } from 'react';
import {
  CELL, STAGE_H, STAGE_W, ellipseShape, splitShape, stagePoint,
} from '../render/cellGeometry';
import { Chromosome } from '../render/parts';
import { CellStage } from '../ui/CellStage';
import { CHROM_COLORS } from './palette';

// TELOPHASE — in the cell, around the cell's own chromosomes.
//
// The chromosomes have arrived at the poles and now need wrapping. Draw a
// closed loop around each cluster and it becomes that nucleus's envelope,
// pores and all. `count` is 2 after mitosis and 4 after meiosis II, where the
// cell has already divided once.

const MIN_POINTS = 12;
const CLOSE_DISTANCE = 70;
const CHROM_OFFSETS = [{ dx: -34, dy: -26 }, { dx: 32, dy: -22 }, { dx: -4, dy: 26 }];

function clustersFor(count) {
  if (count === 4) {
    const shape = splitShape();
    return {
      shape,
      clusters: [
        { cx: CELL.cx, cy: CELL.cy - shape.daughterOffsetY - 62, label: 'top cell, upper' },
        { cx: CELL.cx, cy: CELL.cy - shape.daughterOffsetY + 62, label: 'top cell, lower' },
        { cx: CELL.cx, cy: CELL.cy + shape.daughterOffsetY - 62, label: 'bottom cell, upper' },
        { cx: CELL.cx, cy: CELL.cy + shape.daughterOffsetY + 62, label: 'bottom cell, lower' },
      ],
      hintR: 74,
      scale: 0.42,
    };
  }
  return {
    shape: ellipseShape(CELL.r, 0.14),
    clusters: [
      { cx: CELL.cx, cy: CELL.cy - 152, label: 'top' },
      { cx: CELL.cx, cy: CELL.cy + 152, label: 'bottom' },
    ],
    hintR: 104,
    scale: 0.58,
  };
}

const pointsToStr = (pts) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

// Ray-cast point-in-polygon: the cluster centre must fall inside the loop.
function isInside(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const { x: xi, y: yi } = pts[i];
    const { x: xj, y: yj } = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export default function NuclearEnvelope({ count = 2, onComplete, onStarsUpdate, onStatus }) {
  const { shape, clusters, hintR, scale } = clustersFor(count);
  const total = clusters.length;

  const [drawings, setDrawings] = useState(() => Array(total).fill(null));
  const [current, setCurrent] = useState(0);
  const [stroke, setStroke] = useState([]);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const drawingsRef = useRef(Array(total).fill(null));
  const currentRef = useRef(0);
  const strokeRef = useRef([]);
  const drawingNowRef = useRef(false);
  const doneRef = useRef(false);
  const mountedRef = useRef(true);

  function starsFor(n) {
    if (n >= total) return 3;
    if (n >= total / 2) return 2;
    return n >= 1 ? 1 : 0;
  }

  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    onComplete({ stars: starsFor(drawingsRef.current.filter(Boolean).length) });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const drawn = drawings.filter(Boolean).length;

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: `All ${total} nuclei enclosed`, tone: 'good' });
      return;
    }
    onStatus?.({
      hint: message || `Draw a closed loop around the ${clusters[current]?.label} cluster  (${drawn} / ${total})`,
      tone: message ? 'bad' : 'info',
      submit: { label: `Submit ${drawn}/${total} enclosed`, onSubmit: submitNow },
    });
  }, [current, drawn, message, done]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDown(event) {
    if (doneRef.current || currentRef.current >= total || drawingNowRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pt = stagePoint(event);
    drawingNowRef.current = true;
    strokeRef.current = [pt];
    setStroke([pt]);
    setMessage('');
  }

  function handleMove(event) {
    if (!drawingNowRef.current) return;
    strokeRef.current = [...strokeRef.current, stagePoint(event)];
    setStroke(strokeRef.current);
  }

  function handleUp() {
    if (!drawingNowRef.current) return;
    drawingNowRef.current = false;

    const pts = strokeRef.current;
    strokeRef.current = [];
    setStroke([]);

    if (pts.length < MIN_POINTS) {
      setMessage('Draw a larger loop');
      return;
    }

    const first = pts[0];
    const last = pts[pts.length - 1];
    if (Math.hypot(last.x - first.x, last.y - first.y) > CLOSE_DISTANCE) {
      setMessage('The envelope is not closed — finish where you started');
      return;
    }

    const idx = currentRef.current;
    const cluster = clusters[idx];
    if (!isInside(cluster.cx, cluster.cy, pts)) {
      setMessage(`Surround the ${cluster.label} cluster`);
      return;
    }

    const next = [...drawingsRef.current];
    next[idx] = pts;
    drawingsRef.current = next;
    setDrawings(next);
    setMessage('');

    const n = next.filter(Boolean).length;
    onStarsUpdate?.(starsFor(n));

    if (n >= total) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars: 3 }); }, 600);
      return;
    }
    currentRef.current = idx + 1;
    setCurrent(idx + 1);
  }

  function encloseByKeyboard() {
    const idx = currentRef.current;
    if (doneRef.current || idx >= total) return;
    const c = clusters[idx];
    const ring = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return { x: c.cx + Math.cos(a) * hintR, y: c.cy + Math.sin(a) * hintR };
    });
    strokeRef.current = [...ring, ring[0]];
    drawingNowRef.current = true;
    handleUp();
  }

  return (
    <CellStage shape={shape} label="Cell — rebuilding the nuclear envelopes">
      {/* Envelopes already drawn */}
      {drawings.map((pts, i) => pts && (
        <g key={`env-${i}`} pointerEvents="none">
          <polygon
            className="cdl-fade"
            points={pointsToStr(pts)}
            fill="url(#cdl-nucleoplasm)"
            fillOpacity={0.85}
          />
          <polygon
            className="cdl-grow"
            points={pointsToStr(pts)}
            fill="none"
            stroke="var(--cdl-nuc-line)"
            strokeWidth={5}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
          />
          <polygon
            className="cdl-fade"
            points={pointsToStr(pts)}
            fill="none"
            stroke="var(--cdl-nuc-pore)"
            strokeWidth={9}
            strokeDasharray="2 20"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Where the envelope still has to go */}
      {clusters.map((c, i) => (drawings[i] ? null : (
        <circle
          key={`hint-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={hintR}
          fill="none"
          stroke="var(--cdl-ink-4)"
          strokeWidth={2}
          strokeDasharray="9 7"
          strokeOpacity={i === current && !done ? 0.8 : 0.25}
          pointerEvents="none"
        />
      )))}

      {clusters.map((c, i) => CHROM_OFFSETS.map((off, k) => (
        <Chromosome
          key={`chr-${i}-${k}`}
          x={c.cx + off.dx}
          y={c.cy + off.dy}
          angle={-20 + k * 22}
          scale={scale}
          color={drawings[i] ? 'var(--cdl-good)' : CHROM_COLORS[k]}
        />
      )))}

      {/* The stroke being drawn */}
      {stroke.length > 1 && (
        <polyline
          points={pointsToStr(stroke)}
          fill="none"
          stroke="var(--cdl-teal-deep)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="none"
        />
      )}

      <rect
        x={0}
        y={0}
        width={STAGE_W}
        height={STAGE_H}
        fill="transparent"
        style={{ cursor: done ? 'default' : 'crosshair', touchAction: 'none' }}
        role="button"
        tabIndex={done ? -1 : 0}
        aria-label={done
          ? 'All nuclei enclosed'
          : `Drawing area — draw a closed loop around the ${clusters[current]?.label} cluster, or press Enter to enclose it`}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          encloseByKeyboard();
        }}
      />
    </CellStage>
  );
}
