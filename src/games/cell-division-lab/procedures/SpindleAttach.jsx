import { useEffect, useRef, useState } from 'react';
import { CELL, stagePoint } from '../render/cellGeometry';
import { Centrosome, Chromosome, SpindleFiber } from '../render/parts';
import { CellStage } from '../ui/CellStage';
import { CHROM_COLORS, CHROM_LABELS } from './palette';

// PROMETAPHASE — in the cell, on the cell's own spindle.
//
// The wall around the nucleus has broken down and the fibres now reach in from
// the top and bottom of the cell. Drag a fibre out of one end and hook it onto
// a chromosome. Every chromosome needs a fibre from BOTH ends: one held from a
// single side gets dragged whole into the wrong cell.
//
// `fault` (Level 3) jams one chromosome so the top can never catch it. The
// spindle checkpoint exists to catch exactly this, so the right answer at the
// gate afterwards is WAIT.

const POLES = [
  { id: 'top', x: CELL.cx, y: CELL.cy - CELL.r + 34, dir: -1 },
  { id: 'bottom', x: CELL.cx, y: CELL.cy + CELL.r - 34, dir: 1 },
];

const SPOTS = [
  { x: 352, y: 214, angle: -18 },
  { x: 648, y: 200, angle: 22 },
  { x: 336, y: 414, angle: 14 },
  { x: 662, y: 424, angle: -26 },
];

const CATCH_R = 74;
const STUCK_INDEX = 2;
const KINETOCHORE_OFFSET = 26;

const kinetochoreAt = (spot, side) => ({
  x: spot.x,
  y: spot.y + (side === 'top' ? -KINETOCHORE_OFFSET : KINETOCHORE_OFFSET),
});

function scoreFor(list) {
  const bad = list.filter((a) => !(a.top && a.bottom)).length;
  if (bad === 0) return 3;
  if (bad === 1) return 2;
  return 1;
}

export default function SpindleAttach({ fault, onComplete, onStarsUpdate, onStatus }) {
  const stuckIdx = fault === 'stuckKinetochore' ? STUCK_INDEX : -1;

  const [attached, setAttached] = useState(() => SPOTS.map(() => ({ top: false, bottom: false })));
  const [rubber, setRubber] = useState(null);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const attachedRef = useRef(SPOTS.map(() => ({ top: false, bottom: false })));
  const dragRef = useRef(null);
  const doneRef = useRef(false);
  const mountedRef = useRef(true);


  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    const list = attachedRef.current;
    onComplete({
      stars: scoreFor(list),
      monoOriented: list.filter((a) => !(a.top && a.bottom)).length,
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const biCount = attached.filter((a) => a.top && a.bottom).length;

  // With the jam in play the step can never reach 4/4, so once every fibre that
  // CAN be hooked on is hooked on, the only way forward is the submit button.
  // Say so outright rather than leaving the player stuck on an impossible step.
  const blocked = stuckIdx >= 0
    && attached.every((a, i) => (i === stuckIdx ? a.bottom : a.top && a.bottom));

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: 'Every chromosome is held from both sides', tone: 'good' });
      return;
    }
    onStatus?.({
      hint: blocked
        ? `Chromosome ${CHROM_LABELS[stuckIdx]} is stuck and will not attach. There is nothing more you can do here — press the button below to carry on.`
        : message || `Drag a fibre from the top and from the bottom onto every chromosome  (${biCount} of ${SPOTS.length} held from both sides)`,
      tone: blocked || message ? 'bad' : 'info',
      submit: {
        label: `Carry on with ${biCount} of ${SPOTS.length} attached`,
        onSubmit: submitNow,
      },
    });
  }, [biCount, message, done, blocked]); // eslint-disable-line react-hooks/exhaustive-deps

  function attach(hit, poleId) {
    if (hit === stuckIdx && poleId === 'top') {
      setMessage(`Chromosome ${CHROM_LABELS[hit]} is stuck — it will not take a fibre from the top.`);
      return;
    }
    if (attachedRef.current[hit][poleId]) return;

    const next = attachedRef.current.map((a, i) => (i === hit ? { ...a, [poleId]: true } : a));
    attachedRef.current = next;
    setAttached(next);
    setMessage('');

    const stars = scoreFor(next);
    onStarsUpdate?.(stars);

    if (next.every((a) => a.top && a.bottom)) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars: 3, monoOriented: 0 }); }, 500);
    }
  }


  function handlePoleDown(event, poleId) {
    if (doneRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = poleId;
    const pt = stagePoint(event);
    setRubber({ poleId, x: pt.x, y: pt.y });
    setMessage('');
  }

  function handlePoleMove(event) {
    if (!dragRef.current) return;
    const pt = stagePoint(event);
    setRubber({ poleId: dragRef.current, x: pt.x, y: pt.y });
  }

  function handlePoleUp(event) {
    const poleId = dragRef.current;
    dragRef.current = null;
    setRubber(null);
    if (!poleId || doneRef.current) return;

    const pt = stagePoint(event);
    const hit = SPOTS.findIndex((s) => Math.hypot(pt.x - s.x, pt.y - s.y) <= CATCH_R);
    if (hit !== -1) attach(hit, poleId);
  }

  const dragPole = rubber ? POLES.find((p) => p.id === rubber.poleId) : null;

  return (
    <CellStage label="Cell — attaching the fibres">
      {POLES.map((pole) => (
        <Centrosome key={pole.id} x={pole.x} y={pole.y} dir={pole.dir} active={rubber?.poleId === pole.id} />
      ))}

      {/* Fibres already hooked on */}
      {attached.map((a, i) => POLES.map((pole) => {
        if (!a[pole.id]) return null;
        const k = kinetochoreAt(SPOTS[i], pole.id);
        return (
          <SpindleFiber
            key={`f-${i}-${pole.id}`}
            x1={pole.x}
            y1={pole.y}
            x2={k.x}
            y2={k.y}
            tone="var(--cdl-teal-deep)"
            width={3}
            grow
          />
        );
      }))}

      {dragPole && (
        <SpindleFiber
          x1={dragPole.x}
          y1={dragPole.y}
          x2={rubber.x}
          y2={rubber.y}
          tone="var(--cdl-orange)"
          width={3}
          dashed
        />
      )}

      {SPOTS.map((spot, i) => {
        const a = attached[i];
        const bi = a.top && a.bottom;
        return (
          <g key={CHROM_LABELS[i]}>
            <Chromosome
              x={spot.x}
              y={spot.y}
              angle={spot.angle}
              scale={0.86}
              color={bi ? 'var(--cdl-good)' : CHROM_COLORS[i]}
              label={`${CHROM_LABELS[i]} ${bi ? '✓ both sides' : a.top || a.bottom ? '! one side only' : 'not attached'}`}
              kinetochores
              attached={a}
            />
            <circle
              cx={spot.x}
              cy={spot.y}
              r={CATCH_R}
              fill="transparent"
              aria-label={`Chromosome ${CHROM_LABELS[i]} — ${bi ? 'attached top and bottom' : 'press up arrow to attach the top, down arrow to attach the bottom'}`}
              role="button"
              tabIndex={done ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                e.preventDefault();
                attach(i, e.key === 'ArrowUp' ? 'top' : 'bottom');
              }}
            />
          </g>
        );
      })}

      {/* Grab handles sit last so a pole is always reachable */}
      {POLES.map((pole) => (
        <circle
          key={`grab-${pole.id}`}
          cx={pole.x}
          cy={pole.y}
          r={34}
          fill="transparent"
          style={{ cursor: done ? 'default' : 'grab' }}
          aria-label={`${pole.id} of the cell — drag a fibre from here`}
          onPointerDown={done ? undefined : (e) => handlePoleDown(e, pole.id)}
          onPointerMove={handlePoleMove}
          onPointerUp={handlePoleUp}
          onPointerCancel={handlePoleUp}
        />
      ))}
    </CellStage>
  );
}
