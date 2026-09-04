import { useEffect, useRef, useState } from 'react';
import { CELL, cellPointAt, cytokinesisShape, severThread, stagePoint } from '../render/cellGeometry';
import { Nucleus } from '../render/parts';
import { CellStage } from '../ui/CellStage';

// CYTOKINESIS — on the cell's own membrane.
//
// A ring of actin and myosin runs right round the equator. Take hold of it on
// either side and draw it inward; the membrane really does pinch in under your
// hands, and it fights back — the last stretch strains and shudders before the
// two cells finally tear apart and recoil.

const OPEN_X = CELL.r;
const CLOSED_X = CELL.r * 0.14;
const HANDLE_OFFSET = 28;
const STRAIN_FROM = 0.68;
const SEVER_MS = 1150;

export default function CleavageFurrow({ onComplete, onStarsUpdate, onStatus }) {
  const [pull, setPull] = useState({ left: 0, right: 0 });
  const [grabbed, setGrabbed] = useState(null);
  // 0 → still one cell; 1 → the daughters have fully recoiled apart.
  const [sever, setSever] = useState(0);
  const [done, setDone] = useState(false);

  const pullRef = useRef({ left: 0, right: 0 });
  const dragRef = useRef(null);
  const doneRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const constriction = (pull.left + pull.right) / 2;
  // One parameter runs the whole thing: 0–1 is the student pinching, 1–2 is
  // the membrane giving way.
  const progress = sever > 0 ? 1 + sever : constriction;
  const shape = cytokinesisShape(progress);
  const thread = severThread(progress);
  const closedSides = (pull.left >= 1 ? 1 : 0) + (pull.right >= 1 ? 1 : 0);
  const strain = Math.max(0, (constriction - STRAIN_FROM) / (1 - STRAIN_FROM));
  const straining = sever === 0 && strain > 0.1;

  function starsFor(state) {
    if (state.left >= 1 && state.right >= 1) return 3;
    if (state.left >= 1 || state.right >= 1) return 2;
    return state.left + state.right > 0.4 ? 1 : 0;
  }

  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    onComplete({ stars: starsFor(pullRef.current) });
  }

  // The tear itself is not something the student drags — once the ring has
  // closed, the membrane parts and the two cells recoil on their own.
  function severMembrane() {
    let startedAt = null;
    const step = (now) => {
      if (!mountedRef.current) return;
      if (startedAt === null) startedAt = now;
      const t = Math.min(1, (now - startedAt) / SEVER_MS);
      setSever(t);
      if (t < 1) requestAnimationFrame(step);
      else onComplete({ stars: 3 });
    };
    requestAnimationFrame(step);
  }

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: 'The membrane parted — two daughter cells', tone: 'good' });
      return;
    }
    let hint = 'Press on a handle either side of the equator and drag it inward toward the middle';
    if (closedSides === 1) hint = 'That side is fully contracted — now drag the other one in';
    else if (strain > 0.45) hint = 'The membrane is straining — keep pulling, it is nearly through';
    onStatus?.({
      hint,
      tone: strain > 0.45 ? 'bad' : closedSides > 0 ? 'busy' : 'info',
      submit: constriction > 0.05
        ? { label: `Submit at ${Math.round(constriction * 100)}% constricted`, onSubmit: submitNow }
        : null,
    });
  }, [closedSides, done, constriction, strain]); // eslint-disable-line react-hooks/exhaustive-deps

  function finish() {
    dragRef.current = null;
    setGrabbed(null);
    doneRef.current = true;
    setDone(true);
    severMembrane();
  }

  function handleDown(event, side) {
    if (doneRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = side;
    setGrabbed(side);
  }

  function handleMove(event) {
    const side = dragRef.current;
    if (!side || doneRef.current) return;

    const reach = Math.abs(stagePoint(event).x - CELL.cx);
    const next = Math.max(0, Math.min(1, (OPEN_X - reach) / (OPEN_X - CLOSED_X)));
    if (next <= pullRef.current[side]) return; // the ring never relaxes back

    const state = { ...pullRef.current, [side]: next };
    pullRef.current = state;
    setPull(state);
    onStarsUpdate?.(starsFor(state));
    if (state.left >= 1 && state.right >= 1) finish();
  }

  function handleUp() {
    dragRef.current = null;
    setGrabbed(null);
  }

  function tighten(side) {
    if (doneRef.current) return;
    const state = { ...pullRef.current, [side]: Math.min(1, pullRef.current[side] + 0.2) };
    pullRef.current = state;
    setPull(state);
    onStarsUpdate?.(starsFor(state));
    if (state.left >= 1 && state.right >= 1) finish();
  }

  const edge = cellPointAt(0, shape, CELL.cx, CELL.cy);
  const halfWidth = shape.mode === 'split'
    ? Math.max(CLOSED_X * 0.5, shape.daughterR - shape.daughterOffsetY + 4)
    : Math.abs(edge.x - CELL.cx);
  const lobeY = shape.mode === 'split' ? shape.daughterOffsetY : (shape.splitY ?? 0) * 0.62;
  const nucleusR = shape.mode === 'split' ? shape.daughterR * 0.34 : CELL.r * 0.2;
  // Teal while it gives easily, red once the membrane is fighting back.
  const ringTone = strain > 0.6 ? 'var(--cdl-bad)' : strain > 0.15 ? 'var(--cdl-orange)' : 'var(--cdl-teal)';

  return (
    <CellStage shape={shape} straining={straining} label="Cell — contracting the cleavage furrow">
      <Nucleus x={CELL.cx} y={CELL.cy - Math.max(lobeY, CELL.r * 0.34)} r={nucleusR} />
      <Nucleus x={CELL.cx} y={CELL.cy + Math.max(lobeY, CELL.r * 0.34)} r={nucleusR} />

      {/* The last thread of membrane, stretching thin before it parts */}
      {thread && (
        <path
          d={`M ${CELL.cx} ${CELL.cy - thread.gap} C ${CELL.cx - thread.width} ${CELL.cy - thread.gap * 0.3}, ${CELL.cx + thread.width} ${CELL.cy + thread.gap * 0.3}, ${CELL.cx} ${CELL.cy + thread.gap}`}
          fill="none"
          stroke="var(--cdl-membrane)"
          strokeWidth={Math.max(1.5, thread.width)}
          strokeOpacity={thread.opacity}
          strokeLinecap="round"
          pointerEvents="none"
        />
      )}

      {/* The moment it lets go */}
      {sever > 0 && sever < 0.6 && (
        <circle
          className="cdl-snap"
          cx={CELL.cx}
          cy={CELL.cy}
          r={34}
          fill="none"
          stroke="var(--cdl-yellow)"
          strokeWidth={6}
          pointerEvents="none"
        />
      )}

      {/* The contractile ring, seen edge-on around the equator */}
      {sever < 0.5 && (
        <g className={straining && strain > 0.5 ? 'cdl-strain' : undefined} pointerEvents="none">
          <ellipse
            cx={CELL.cx}
            cy={CELL.cy}
            rx={halfWidth}
            ry={16}
            fill="none"
            stroke={ringTone}
            strokeWidth={9}
            strokeOpacity={0.9 * (1 - sever * 2)}
          />
          <ellipse
            cx={CELL.cx}
            cy={CELL.cy}
            rx={halfWidth}
            ry={16}
            fill="none"
            stroke="var(--cdl-orange-deep)"
            strokeWidth={3}
            strokeDasharray="10 8"
            strokeOpacity={1 - sever * 2}
          />
        </g>
      )}

      {/* Strain marks: the membrane pulled taut against the ring */}
      {straining && [-1, 1].map((dx) => [-1, 1].map((dy) => [0.5, 0.78, 1].map((f) => (
        <line
          key={`${dx}-${dy}-${f}`}
          x1={CELL.cx + dx * halfWidth * 0.95}
          y1={CELL.cy + dy * 30 * f}
          x2={CELL.cx + dx * halfWidth * 0.45}
          y2={CELL.cy + dy * 5 * f}
          stroke="var(--cdl-bad)"
          strokeWidth={2}
          strokeOpacity={0.2 + 0.45 * strain}
          strokeLinecap="round"
          pointerEvents="none"
        />
      ))))}

      {!done && ['left', 'right'].map((side) => {
        const dir = side === 'left' ? -1 : 1;
        const hx = CELL.cx + dir * (halfWidth + HANDLE_OFFSET);
        const full = pull[side] >= 1;
        return (
          <g
            key={side}
            style={{ cursor: full ? 'default' : 'ew-resize', touchAction: 'none' }}
            role="button"
            tabIndex={full ? -1 : 0}
            aria-label={`${side} side of the contractile ring, ${Math.round(pull[side] * 100)}% contracted — drag it inward, or press Enter to tighten it`}
            onPointerDown={full ? undefined : (e) => handleDown(e, side)}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              tighten(side);
            }}
          >
            <circle cx={hx} cy={CELL.cy} r={32} fill="transparent" />
            <circle
              className="cdl-tint"
              cx={hx}
              cy={CELL.cy}
              r={20}
              fill={full ? 'var(--cdl-good)' : ringTone}
              stroke={full ? 'var(--cdl-good)' : 'var(--cdl-orange-deep)'}
              strokeWidth={3}
            />
            {/* Which way to drag */}
            {!full && !grabbed && (
              <g transform={`translate(${hx} ${CELL.cy})`} pointerEvents="none">
                <g className={dir < 0 ? 'cdl-cue-right' : 'cdl-cue-left'}>
                  <path
                    d={dir < 0
                      ? 'M 16 0 L -2 -11 L -2 -4 L -14 -4 L -14 4 L -2 4 L -2 11 Z'
                      : 'M -16 0 L 2 -11 L 2 -4 L 14 -4 L 14 4 L 2 4 L 2 11 Z'}
                    fill="#fff"
                  />
                </g>
              </g>
            )}
            {full && (
              <text
                x={hx}
                y={CELL.cy + 7}
                textAnchor="middle"
                fill="#fff"
                fontSize={18}
                fontWeight={800}
                pointerEvents="none"
              >
                ✓
              </text>
            )}
            <text
              x={hx}
              y={CELL.cy + 50}
              textAnchor="middle"
              fill="var(--cdl-ink-3)"
              fontSize={14}
              fontWeight={700}
              fontFamily="var(--cdl-font-mono)"
              pointerEvents="none"
            >
              {Math.round(pull[side] * 100)}%
            </text>
          </g>
        );
      })}

      {!done && (
        <text
          x={CELL.cx}
          y={CELL.cy - 68}
          textAnchor="middle"
          fill={strain > 0.45 ? 'var(--cdl-bad)' : 'var(--cdl-ink-3)'}
          fontSize={14}
          fontWeight={800}
          fontFamily="var(--cdl-font-mono)"
          pointerEvents="none"
        >
          {strain > 0.45 ? 'MEMBRANE STRAINING' : 'CONTRACTILE RING'}
        </text>
      )}
    </CellStage>
  );
}
