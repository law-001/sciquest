import { useEffect, useRef, useState } from 'react';
import { stagePoint } from '../render/cellGeometry';
import { Helix, HydrogenBonds, Nucleotide } from '../render/parts';
import { BASE_TINT, H_BONDS, PARTNER, baseHeight } from '../render/partShapes';
import { CellStage } from '../ui/CellStage';

// S PHASE — inside the nucleus, on the cell's own DNA.
//
// The parent helix winds in from the right, helicase prises it open at the
// fork, and the exposed template strand runs left as a ladder with a rung
// missing at every position. Drag a free nucleotide out of the nucleoplasm
// onto the polymerase and it pairs: a purine's tab only fits its pyrimidine's
// socket, so A goes with T and G with C by shape and not just by colour.
//
// `fault` (Level 3) damages two template bases. A damaged base cannot be
// read, so whatever is placed opposite it is a guess — which is exactly the
// state the G2 checkpoint exists to catch.

const TEMPLATE = ['A', 'T', 'G', 'C', 'C', 'A', 'T', 'G'];
const LESION_POSITIONS = [2, 5];
const BASES = ['A', 'T', 'G', 'C'];

const SPACING = 66;
const X0 = 500 - ((TEMPLATE.length - 1) * SPACING) / 2;
const AXIS_Y = 300;
const TEMPLATE_OUTER_Y = 262;
const NEW_OUTER_Y = 338;
const TEMPLATE_BACKBONE_Y = 222;
const NEW_BACKBONE_Y = 378;
const LADDER_LEFT = X0 - 36;
const LADDER_RIGHT = X0 + (TEMPLATE.length - 1) * SPACING + 36;
const POOL_Y = 470;
const POOL_X0 = 320;
const POOL_STEP = 120;
const DROP_RADIUS = 170;

const slotX = (i) => X0 + i * SPACING;
const templatePairY = (i) => TEMPLATE_OUTER_Y + baseHeight(TEMPLATE[i]);
const newPairY = (base) => NEW_OUTER_Y - baseHeight(base);

function starsFor(errors) {
  if (errors === 0) return 3;
  if (errors === 1) return 2;
  return 1;
}

export default function DnaReplication({ fault, onComplete, onStarsUpdate, onStatus }) {
  const lesions = fault === 'replicationErrors' ? LESION_POSITIONS : [];

  const [placed, setPlaced] = useState(() => Array(TEMPLATE.length).fill(null));
  const [activeIdx, setActiveIdx] = useState(0);
  const [errors, setErrors] = useState(0);
  const [drag, setDrag] = useState(null);
  const [done, setDone] = useState(false);

  const placedRef = useRef(Array(TEMPLATE.length).fill(null));
  const activeRef = useRef(0);
  const errorRef = useRef(0);
  const doneRef = useRef(false);
  const dragRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: 'Strand replicated — the helix rewinds behind the fork', tone: 'good' });
      return;
    }
    if (lesions.includes(activeIdx)) {
      onStatus?.({
        hint: 'This template base is damaged and cannot be read — whatever you pair here is a guess.',
        tone: 'bad',
      });
      return;
    }
    onStatus?.({
      hint: errors > 0
        ? `${errors} mispaired — ${TEMPLATE.length - activeIdx} bases still to place`
        : `Drag a nucleotide into the polymerase  ·  A–T, G–C  ·  ${TEMPLATE.length - activeIdx} left`,
      tone: errors > 0 ? 'bad' : 'info',
    });
  }, [activeIdx, errors, done]); // eslint-disable-line react-hooks/exhaustive-deps

  function placeBase(base) {
    if (doneRef.current) return;
    const idx = activeRef.current;
    if (idx >= TEMPLATE.length) return;

    const damaged = lesions.includes(idx);
    const correct = !damaged && base === PARTNER[TEMPLATE[idx]];

    const next = [...placedRef.current];
    next[idx] = { base, correct };
    placedRef.current = next;
    setPlaced(next);

    if (!correct) {
      errorRef.current += 1;
      setErrors(errorRef.current);
    }

    const stars = starsFor(errorRef.current);
    onStarsUpdate?.(stars);

    const nextIdx = idx + 1;
    activeRef.current = nextIdx;
    setActiveIdx(nextIdx);

    if (nextIdx >= TEMPLATE.length) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => {
        if (mountedRef.current) onComplete({ stars, replicationErrors: errorRef.current });
      }, 1000);
    }
  }

  function handleGrab(event, base) {
    if (doneRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pt = stagePoint(event);
    dragRef.current = { base };
    setDrag({ base, x: pt.x, y: pt.y });
  }

  function handleMove(event) {
    if (!dragRef.current) return;
    const pt = stagePoint(event);
    setDrag({ base: dragRef.current.base, x: pt.x, y: pt.y });
  }

  function handleRelease(event) {
    const held = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!held || doneRef.current) return;

    const pt = stagePoint(event);
    const targetX = slotX(Math.min(activeRef.current, TEMPLATE.length - 1));
    if (Math.hypot(pt.x - targetX, pt.y - AXIS_Y) <= DROP_RADIUS) placeBase(held.base);
  }

  const activeX = slotX(Math.min(activeIdx, TEMPLATE.length - 1));
  const armed = drag
    ? Math.hypot(drag.x - activeX, drag.y - AXIS_Y) <= DROP_RADIUS
    : false;

  return (
    <CellStage view="nucleus" label="Nucleus — replicating DNA">
      {/* The stretch already copied, rewound into a double helix */}
      <Helix x1={-20} x2={214} y={AXIS_Y} amp={44} phase={0.6} />
      {/* The parent helix, still wound, feeding into the fork */}
      <Helix x1={814} x2={1020} y={AXIS_Y} amp={44} phase={2.1} />

      {/* Backbones splitting at the fork and rejoining behind it */}
      <path
        d={`M 214 ${AXIS_Y} L ${LADDER_LEFT} ${TEMPLATE_BACKBONE_Y} M 214 ${AXIS_Y} L ${LADDER_LEFT} ${NEW_BACKBONE_Y}`}
        stroke="var(--cdl-teal-deep)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
        pointerEvents="none"
      />
      <path
        d={`M 814 ${AXIS_Y} L ${LADDER_RIGHT} ${TEMPLATE_BACKBONE_Y} M 814 ${AXIS_Y} L ${LADDER_RIGHT} ${NEW_BACKBONE_Y}`}
        stroke="var(--cdl-teal-deep)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
        pointerEvents="none"
      />

      <rect
        x={LADDER_LEFT}
        y={TEMPLATE_BACKBONE_Y - 6}
        width={LADDER_RIGHT - LADDER_LEFT}
        height={12}
        rx={6}
        fill="var(--cdl-teal-deep)"
        pointerEvents="none"
      />
      <rect
        x={LADDER_LEFT}
        y={NEW_BACKBONE_Y - 6}
        width={LADDER_RIGHT - LADDER_LEFT}
        height={12}
        rx={6}
        fill="var(--cdl-teal-deep)"
        fillOpacity={0.72}
        pointerEvents="none"
      />

      <text
        x={26}
        y={TEMPLATE_BACKBONE_Y + 5}
        fill="var(--cdl-ink-3)"
        fontSize={15}
        fontWeight={700}
        fontFamily="var(--cdl-font-mono)"
        pointerEvents="none"
      >
        TEMPLATE
      </text>
      <text
        x={26}
        y={NEW_BACKBONE_Y + 5}
        fill="var(--cdl-ink-3)"
        fontSize={15}
        fontWeight={700}
        fontFamily="var(--cdl-font-mono)"
        pointerEvents="none"
      >
        NEW STRAND
      </text>

      {/* Helicase, prising the parent helix apart at the fork */}
      <g transform={`translate(818 ${AXIS_Y})`} pointerEvents="none">
        <g className="cdl-drift">
          <path
            d="M 30 0 L -12 -42 A 48 48 0 0 0 -12 42 Z"
            fill="var(--cdl-orange-soft)"
            stroke="var(--cdl-orange-deep)"
            strokeWidth={3}
          />
        </g>
        <text
          x={6}
          y={96}
          textAnchor="middle"
          fill="var(--cdl-orange-deep)"
          fontSize={14}
          fontWeight={800}
          fontFamily="var(--cdl-font-mono)"
        >
          HELICASE
        </text>
      </g>

      {/* Template strand: a full nucleotide at every position */}
      {TEMPLATE.map((base, i) => (
        <g
          key={`t-${i}`}
          transform={`translate(${slotX(i)} ${templatePairY(i)})`}
          pointerEvents="none"
        >
          <Nucleotide base={base} flip damaged={lesions.includes(i)} />
        </g>
      ))}

      {/* Rungs still waiting for a partner */}
      {TEMPLATE.map((base, i) => (placed[i] ? null : (
        <rect
          key={`e-${i}`}
          className="cdl-tint"
          x={slotX(i) - 26}
          y={NEW_OUTER_Y - 34}
          width={52}
          height={34}
          rx={8}
          fill={i === activeIdx && armed ? 'var(--cdl-teal)' : 'none'}
          fillOpacity={i === activeIdx && armed ? 0.22 : 0}
          stroke={i === activeIdx ? 'var(--cdl-teal)' : 'var(--cdl-line-strong)'}
          strokeWidth={2}
          strokeDasharray="6 5"
          pointerEvents="none"
        />
      )))}

      {/* Bases already paired onto the new strand */}
      {placed.map((slot, i) => {
        if (!slot) return null;
        const yBottom = newPairY(slot.base);
        return (
          <g key={`n-${i}`} pointerEvents="none">
            {slot.correct ? (
              <g className="cdl-fade">
                <HydrogenBonds
                  x={slotX(i)}
                  yTop={templatePairY(i)}
                  yBottom={yBottom}
                  count={H_BONDS[slot.base]}
                />
              </g>
            ) : (
              <text
                className="cdl-fade"
                x={slotX(i)}
                y={templatePairY(i) + 16}
                textAnchor="middle"
                fill="var(--cdl-bad)"
                fontSize={24}
                fontWeight={800}
              >
                ✗
              </text>
            )}
            <g transform={`translate(${slotX(i)} ${yBottom})`}>
              <g className="cdl-place">
                <Nucleotide base={slot.base} muted={!slot.correct} />
              </g>
            </g>
          </g>
        );
      })}

      {/* DNA polymerase — the clamp that slides on as each base is added */}
      {!done && (
        <g className="cdl-clamp" transform={`translate(${activeX} ${AXIS_Y})`} pointerEvents="none">
          <ellipse rx={46} ry={66} fill="var(--cdl-teal)" fillOpacity={armed ? 0.26 : 0.14} />
          <ellipse
            className="cdl-tint"
            rx={46}
            ry={66}
            fill="none"
            stroke="var(--cdl-teal)"
            strokeWidth={armed ? 5 : 3.5}
            strokeDasharray="14 9"
          />
          <g transform="translate(0 -92)">
            <rect x={-62} y={-16} width={124} height={28} rx={14} fill="var(--cdl-surface)" fillOpacity={0.9} />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill="var(--cdl-teal-deep)"
              fontSize={14}
              fontWeight={800}
              fontFamily="var(--cdl-font-mono)"
            >
              POLYMERASE
            </text>
          </g>
        </g>
      )}

      {/* Free nucleotides drifting in the nucleoplasm */}
      {!done && BASES.map((base, i) => (
        <g
          key={base}
          transform={`translate(${POOL_X0 + i * POOL_STEP} ${POOL_Y})`}
          style={{ cursor: 'grab' }}
          role="button"
          tabIndex={0}
          aria-label={`Free ${base} nucleotide — pair it with template position ${activeIdx + 1}`}
          onPointerDown={(e) => handleGrab(e, base)}
          onPointerMove={handleMove}
          onPointerUp={handleRelease}
          onPointerCancel={handleRelease}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            placeBase(base);
          }}
        >
          <g className="cdl-float" style={{ animationDelay: `${i * 0.45}s` }}>
            <circle r={56} fill={BASE_TINT[base]} fillOpacity={drag?.base === base ? 0.02 : 0.1} />
            <g opacity={drag?.base === base ? 0.3 : 1}>
              <Nucleotide base={base} />
            </g>
          </g>
        </g>
      ))}

      {/* The nucleotide currently in hand */}
      {drag && (
        <g transform={`translate(${drag.x} ${drag.y - 34})`} pointerEvents="none">
          <g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${armed ? 1.1 : 1})`, transition: 'transform .18s ease' }}>
            <Nucleotide base={drag.base} />
          </g>
        </g>
      )}
    </CellStage>
  );
}
