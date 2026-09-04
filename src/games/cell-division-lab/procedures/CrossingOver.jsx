import { useEffect, useRef, useState } from 'react';
import { NUCLEUS, stagePoint } from '../render/cellGeometry';
import { CellStage } from '../ui/CellStage';
import { HOMOLOG_COLORS } from './palette';

// PROPHASE I — inside the nucleus, on the cell's own homologues.
//
// Two stages, in the order a real cell does them. First synapsis: slide the
// paternal chromosome until its bands line up with the maternal one and the
// synaptonemal complex can zip them together. Only then can crossing over
// exchange matching segments. Swapping while the pair is still out of register
// trades mismatched pieces — unbalanced recombination.

const BAND_COUNT = 6;
const CHIASMATA = [1, 3, 4];
const START_OFFSET = 2;
const MAX_OFFSET = 3;

const BAND_H = 46;
const BAND_W = 56;
const COLUMN_H = BAND_COUNT * BAND_H;
const TOP_Y = NUCLEUS.cy - COLUMN_H / 2;
const MATERNAL_X = 420;
const PATERNAL_X = 580;

const bandY = (i) => TOP_Y + i * BAND_H;

function starsFor(errors) {
  if (errors === 0) return 3;
  if (errors === 1) return 2;
  return 1;
}

export default function CrossingOver({ onComplete, onStarsUpdate, onStatus }) {
  const [offset, setOffset] = useState(START_OFFSET);
  const [dragging, setDragging] = useState(false);
  // Which homologue owns each band: 0 = maternal, 1 = paternal.
  const [left, setLeft] = useState(() => Array(BAND_COUNT).fill(0));
  const [right, setRight] = useState(() => Array(BAND_COUNT).fill(1));
  const [swapped, setSwapped] = useState([]);
  const [errors, setErrors] = useState(0);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const offsetRef = useRef(START_OFFSET);
  const dragRef = useRef(null);
  const leftRef = useRef(Array(BAND_COUNT).fill(0));
  const rightRef = useRef(Array(BAND_COUNT).fill(1));
  const swappedRef = useRef([]);
  const errorRef = useRef(0);
  const doneRef = useRef(false);
  const mountedRef = useRef(true);


  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    const missed = CHIASMATA.length - swappedRef.current.length;
    onComplete({ stars: starsFor(errorRef.current + missed) });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const aligned = offset === 0;

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: 'Segments exchanged — the homologues are recombined', tone: 'good' });
      return;
    }
    onStatus?.({
      hint: message || (aligned
        ? `Synapsed. Tap each ⇄ chiasma to exchange segments  (${swapped.length} / ${CHIASMATA.length})`
        : 'Drag the paternal chromosome up or down until its bands line up'),
      tone: message ? 'bad' : aligned ? 'busy' : 'info',
      submit: swapped.length >= 1
        ? { label: `Submit ${swapped.length}/${CHIASMATA.length} exchanges`, onSubmit: submitNow }
        : null,
    });
  }, [aligned, message, swapped.length, done]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDragStart(event) {
    if (doneRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { y: stagePoint(event).y, from: offsetRef.current };
    setDragging(true);
  }

  function handleDragMove(event) {
    if (!dragRef.current) return;
    const dy = stagePoint(event).y - dragRef.current.y;
    const next = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dragRef.current.from + Math.round(dy / BAND_H)));
    if (next === offsetRef.current) return;
    offsetRef.current = next;
    setOffset(next);
    if (next === 0) setMessage('');
  }

  function handleDragEnd() {
    dragRef.current = null;
    setDragging(false);
  }

  function nudge(delta) {
    if (doneRef.current) return;
    const next = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetRef.current + delta));
    offsetRef.current = next;
    setOffset(next);
    if (next === 0) setMessage('');
  }

  function handleChiasma(band) {
    if (doneRef.current || swappedRef.current.includes(band)) return;

    if (!aligned) {
      errorRef.current += 1;
      setErrors(errorRef.current);
      setMessage('The homologues are out of register — that swapped mismatched segments.');
      onStarsUpdate?.(starsFor(errorRef.current));
    } else {
      setMessage('');
    }

    const l = [...leftRef.current];
    const r = [...rightRef.current];
    const tmp = l[band];
    l[band] = r[band];
    r[band] = tmp;
    leftRef.current = l;
    rightRef.current = r;
    setLeft(l);
    setRight(r);

    const next = [...swappedRef.current, band];
    swappedRef.current = next;
    setSwapped(next);

    if (next.length >= CHIASMATA.length) {
      doneRef.current = true;
      setDone(true);
      const stars = starsFor(errorRef.current);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars }); }, 600);
    }
  }


  function renderColumn(owners, shift, x, name) {
    return (
      <g transform={`translate(${x} ${shift * BAND_H})`} className={dragging ? undefined : 'cdl-travel'}>
        <rect
          x={-BAND_W / 2}
          y={TOP_Y}
          width={BAND_W}
          height={COLUMN_H}
          rx={BAND_W / 2}
          fill="var(--cdl-ink-4)"
          fillOpacity={0.25}
        />
        {owners.map((owner, i) => (
          <rect
            key={i}
            x={-BAND_W / 2}
            y={bandY(i) + 2}
            width={BAND_W}
            height={BAND_H - 4}
            rx={i === 0 || i === BAND_COUNT - 1 ? BAND_W / 2 : 5}
            fill={HOMOLOG_COLORS[owner]}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
          />
        ))}
        {/* Sister chromatid line — each homologue is still two chromatids */}
        <line
          x1={0}
          y1={TOP_Y + 8}
          x2={0}
          y2={TOP_Y + COLUMN_H - 8}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={2}
          strokeDasharray="6 5"
        />
        <text
          x={0}
          y={TOP_Y + COLUMN_H + 30}
          textAnchor="middle"
          fill="var(--cdl-ink-3)"
          fontSize={15}
          fontWeight={700}
          fontFamily="var(--cdl-font-mono)"
        >
          {name}
        </text>
      </g>
    );
  }

  return (
    <CellStage view="nucleus" label="Nucleus — crossing over">
      {/* Synaptonemal complex, once the pair is in register */}
      {aligned && (
        <g pointerEvents="none">
          <rect
            x={MATERNAL_X}
            y={TOP_Y}
            width={PATERNAL_X - MATERNAL_X}
            height={COLUMN_H}
            fill="var(--cdl-teal)"
            fillOpacity={0.1}
          />
          {Array.from({ length: 13 }, (_, i) => (
            <line
              key={i}
              x1={MATERNAL_X + BAND_W / 2}
              y1={TOP_Y + i * (COLUMN_H / 12)}
              x2={PATERNAL_X - BAND_W / 2}
              y2={TOP_Y + i * (COLUMN_H / 12)}
              stroke="var(--cdl-teal)"
              strokeWidth={2}
              strokeOpacity={0.45}
            />
          ))}
        </g>
      )}

      <g pointerEvents="none">{renderColumn(left, 0, MATERNAL_X, 'MATERNAL')}</g>

      <g
        style={{ cursor: done ? 'default' : dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        role="button"
        tabIndex={done ? -1 : 0}
        aria-label={`Paternal chromosome — ${aligned ? 'in register' : `${Math.abs(offset)} bands out of register`}. Use the up and down arrow keys to slide it.`}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
          e.preventDefault();
          nudge(e.key === 'ArrowUp' ? -1 : 1);
        }}
      >
        <rect
          x={PATERNAL_X - BAND_W}
          y={TOP_Y + offset * BAND_H - 20}
          width={BAND_W * 2}
          height={COLUMN_H + 40}
          fill="transparent"
        />
        {renderColumn(right, offset, PATERNAL_X, 'PATERNAL')}
      </g>

      {/* Chiasmata — the points where the strands actually cross */}
      {CHIASMATA.map((band) => {
        const isSwapped = swapped.includes(band);
        const cy = bandY(band) + BAND_H / 2;
        return (
          <g
            key={band}
            role="button"
            tabIndex={isSwapped || done ? -1 : 0}
            aria-label={isSwapped
              ? `Chiasma at band ${band + 1}, segments already exchanged`
              : `Exchange segments at band ${band + 1}`}
            style={{ cursor: isSwapped || done ? 'default' : 'pointer' }}
            onPointerDown={isSwapped || done ? undefined : () => handleChiasma(band)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              handleChiasma(band);
            }}
          >
            {isSwapped && (
              <path
                d={`M ${MATERNAL_X} ${cy - 16} L ${PATERNAL_X} ${cy + 16} M ${PATERNAL_X} ${cy - 16} L ${MATERNAL_X} ${cy + 16}`}
                stroke="var(--cdl-good)"
                strokeWidth={4}
                strokeLinecap="round"
                pointerEvents="none"
              />
            )}
            <circle
              cx={(MATERNAL_X + PATERNAL_X) / 2}
              cy={cy}
              r={21}
              fill={isSwapped ? 'var(--cdl-good-soft)' : aligned ? 'var(--cdl-orange-soft)' : 'var(--cdl-surface)'}
              stroke={isSwapped ? 'var(--cdl-good)' : aligned ? 'var(--cdl-orange)' : 'var(--cdl-line-strong)'}
              strokeWidth={2.5}
            />
            <text
              x={(MATERNAL_X + PATERNAL_X) / 2}
              y={cy + 6}
              textAnchor="middle"
              fill={isSwapped ? 'var(--cdl-good)' : aligned ? 'var(--cdl-orange-deep)' : 'var(--cdl-ink-4)'}
              fontSize={17}
              fontWeight={800}
              pointerEvents="none"
            >
              {isSwapped ? '✓' : '⇄'}
            </text>
          </g>
        );
      })}

      {errors > 0 && (
        <text
          x={NUCLEUS.cx}
          y={TOP_Y - 34}
          textAnchor="middle"
          fill="var(--cdl-bad)"
          fontSize={15}
          fontWeight={700}
          fontFamily="var(--cdl-font-mono)"
          pointerEvents="none"
        >
          {errors} mismatched {errors === 1 ? 'swap' : 'swaps'}
        </text>
      )}
    </CellStage>
  );
}
