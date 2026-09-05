import { useEffect, useRef, useState } from 'react';
import { CELL, stagePoint } from '../render/cellGeometry';
import { Centrosome, Chromosome, SpindleFiber } from '../render/parts';
import { CellStage } from '../ui/CellStage';
import { CHROM_COLORS, CHROM_LABELS, HOMOLOG_COLORS } from './palette';

// METAPHASE — in the cell, on the cell's own equator.
//
// The spindle already has hold of every chromosome; what is left is to let it
// pull each one onto the metaphase plate. Drag a chromosome to the equator and
// it snaps into line.
//
// mode 'single' (mitosis, metaphase II): one chromosome sits ON the plate.
// mode 'tetrad' (meiosis I): a homologous PAIR straddles it, one partner
// either side — which is what actually lines up in metaphase I.

const PIECE_COUNT = 4;
const PLATE_Y = CELL.cy;
const SNAP_X = [CELL.cx - 168, CELL.cx - 56, CELL.cx + 56, CELL.cx + 168];
const SNAP_R = 78;
const PARTNER_GAP = 56;

const HOME = [
  { x: 322, y: 176 },
  { x: 676, y: 168 },
  { x: 312, y: 452 },
  { x: 686, y: 446 },
];

const POLES = [
  { id: 'top', x: CELL.cx, y: CELL.cy - CELL.r + 34, dir: -1 },
  { id: 'bottom', x: CELL.cx, y: CELL.cy + CELL.r - 34, dir: 1 },
];

export default function ChromosomeAlign({ mode = 'single', onComplete, onStarsUpdate, onStatus }) {
  const isTetrad = mode === 'tetrad';

  const [positions, setPositions] = useState(() => HOME.map((p) => ({ ...p })));
  const [placed, setPlaced] = useState({});
  const [occupied, setOccupied] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  const [done, setDone] = useState(false);

  const dragRef = useRef(null);
  const positionsRef = useRef(HOME.map((p) => ({ ...p })));
  const placedRef = useRef({});
  const occupiedRef = useRef({});
  const doneRef = useRef(false);
  const mountedRef = useRef(true);


  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    const n = Object.keys(placedRef.current).length;
    onComplete({ stars: n >= PIECE_COUNT ? 3 : n >= 3 ? 2 : 1 });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const placedCount = Object.keys(placed).length;
  const noun = isTetrad ? 'homologous pairs' : 'chromosomes';

  const dragPos = draggingId === null ? null : positions[draggingId];
  const armedZone = dragPos
    ? SNAP_X.findIndex((zx, zi) => (
      occupied[zi] === undefined && Math.hypot(dragPos.x - zx, dragPos.y - PLATE_Y) <= SNAP_R
    ))
    : -1;

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: `All ${noun} aligned on the plate`, tone: 'good' });
      return;
    }
    onStatus?.({
      hint: `Drag each onto the metaphase plate  (${placedCount} / ${PIECE_COUNT})`,
      tone: 'info',
      submit: placedCount >= 1
        ? { label: `Submit ${placedCount}/${PIECE_COUNT} aligned`, onSubmit: submitNow }
        : null,
    });
  }, [placedCount, done]); // eslint-disable-line react-hooks/exhaustive-deps


  function handleDown(event, id) {
    if (doneRef.current || placedRef.current[id] !== undefined) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pt = stagePoint(event);
    const pos = positionsRef.current[id];
    dragRef.current = { id, dx: pt.x - pos.x, dy: pt.y - pos.y };
    setDraggingId(id);
  }

  function handleMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const pt = stagePoint(event);
    const next = positionsRef.current.slice();
    next[drag.id] = { x: pt.x - drag.dx, y: pt.y - drag.dy };
    positionsRef.current = next;
    setPositions(next);
  }

  function handleUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    setDraggingId(null);
    if (!drag || doneRef.current) return;
    settle(drag.id);
  }

  function settle(id) {
    const pos = positionsRef.current[id];
    const zone = SNAP_X.findIndex((zx, zi) => (
      occupiedRef.current[zi] === undefined && Math.hypot(pos.x - zx, pos.y - PLATE_Y) <= SNAP_R
    ));

    const next = positionsRef.current.slice();
    if (zone === -1) {
      next[id] = { ...HOME[id] };
      positionsRef.current = next;
      setPositions(next);
      return;
    }

    next[id] = { x: SNAP_X[zone], y: PLATE_Y };
    positionsRef.current = next;
    setPositions(next);

    const np = { ...placedRef.current, [id]: zone };
    const no = { ...occupiedRef.current, [zone]: id };
    placedRef.current = np;
    occupiedRef.current = no;
    setPlaced(np);
    setOccupied(no);

    const count = Object.keys(np).length;
    onStarsUpdate?.(count >= PIECE_COUNT ? 3 : count >= 3 ? 2 : 1);

    if (count >= PIECE_COUNT) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars: 3 }); }, 500);
    }
  }

  function placeByKeyboard(id) {
    if (doneRef.current || placedRef.current[id] !== undefined) return;
    const zone = SNAP_X.findIndex((_, zi) => occupiedRef.current[zi] === undefined);
    if (zone === -1) return;
    const next = positionsRef.current.slice();
    next[id] = { x: SNAP_X[zone], y: PLATE_Y };
    positionsRef.current = next;
    settle(id);
  }

  return (
    <CellStage label="Cell — aligning chromosomes on the metaphase plate">
      {POLES.map((pole) => (
        <Centrosome key={pole.id} x={pole.x} y={pole.y} dir={pole.dir} />
      ))}

      {/* The metaphase plate */}
      <line
        className="cdl-plate"
        x1={CELL.cx - CELL.r * 0.94}
        y1={PLATE_Y}
        x2={CELL.cx + CELL.r * 0.94}
        y2={PLATE_Y}
        stroke="var(--cdl-teal)"
        strokeWidth={3}
        strokeDasharray="12 9"
        pointerEvents="none"
      />
      <text
        x={CELL.cx + CELL.r * 0.94}
        y={PLATE_Y - 14}
        textAnchor="end"
        fill="var(--cdl-teal-deep)"
        fontSize={17}
        fontWeight={800}
        fontFamily="var(--cdl-font-mono)"
        pointerEvents="none"
      >
        METAPHASE PLATE
      </text>

      {SNAP_X.map((zx, zi) => (
        <circle
          key={zx}
          cx={zx}
          cy={PLATE_Y}
          r={SNAP_R * 0.62}
          className="cdl-tint"
          fill={occupied[zi] !== undefined ? 'var(--cdl-good)' : 'var(--cdl-teal)'}
          fillOpacity={occupied[zi] !== undefined ? 0.12 : armedZone === zi ? 0.2 : 0}
          stroke={occupied[zi] !== undefined ? 'none' : 'var(--cdl-line-strong)'}
          strokeWidth={2}
          strokeDasharray="7 6"
          pointerEvents="none"
        />
      ))}

      {/* Fibres from both poles, following each chromosome */}
      {positions.map((pos, id) => POLES.map((pole) => (
        <SpindleFiber
          key={`f-${id}-${pole.id}`}
          x1={pole.x}
          y1={pole.y}
          x2={pos.x}
          y2={pos.y + (pole.id === 'top' ? -24 : 24)}
          tone="var(--cdl-teal)"
          width={2.2}
          opacity={0.6}
        />
      )))}

      {positions.map((pos, id) => {
        const isPlaced = placed[id] !== undefined;
        const isDragging = draggingId === id;
        const label = CHROM_LABELS[id];

        return (
          <g
            key={label}
            style={{ cursor: isPlaced ? 'default' : isDragging ? 'grabbing' : 'grab' }}
            role="button"
            tabIndex={isPlaced || done ? -1 : 0}
            aria-label={
              isTetrad
                ? `Homologous pair ${label}${isPlaced ? ' aligned on the plate' : ' — press Enter to align it'}`
                : `Chromosome ${label}${isPlaced ? ' aligned on the plate' : ' — press Enter to align it'}`
            }
            onPointerDown={(e) => handleDown(e, id)}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              placeByKeyboard(id);
            }}
          >
            {/* A wrapper carries the position so the snap onto the plate can
                glide. During a drag the transition is off, or the chromosome
                would lag behind the pointer. */}
            <g
              className={isDragging ? undefined : 'cdl-travel'}
              transform={`translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`}
            >
              <circle cx={0} cy={0} r={isTetrad ? 68 : 54} fill="transparent" />
              {isTetrad ? (
                <>
                  <Chromosome
                    x={0}
                    y={-PARTNER_GAP / 2}
                    scale={0.78}
                    color={HOMOLOG_COLORS[0]}
                    glow={isDragging}
                  />
                  <Chromosome
                    x={0}
                    y={PARTNER_GAP / 2}
                    scale={0.78}
                    color={HOMOLOG_COLORS[1]}
                    glow={isDragging}
                    label={`${label}${isPlaced ? ' ✓' : ''}`}
                  />
                </>
              ) : (
                <Chromosome
                  x={0}
                  y={0}
                  scale={0.82}
                  color={isPlaced ? 'var(--cdl-good)' : CHROM_COLORS[id]}
                  glow={isDragging}
                  kinetochores
                  attached={{ top: true, bottom: true }}
                  label={`${label}${isPlaced ? ' ✓' : ''}`}
                />
              )}
            </g>
          </g>
        );
      })}

    </CellStage>
  );
}
