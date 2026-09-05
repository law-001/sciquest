import { useEffect, useRef, useState } from 'react';
import { Chromosome, ChromatinFiber } from '../render/parts';
import { CellStage } from '../ui/CellStage';
import { CHROM_COLORS, CHROM_LABELS } from './palette';

// PROPHASE — inside the nucleus, on the cell's own chromatin.
//
// Each thread is metres of DNA wound loosely round its histones. Press and
// hold the glowing one and you can watch it supercoil in your hand until it
// is a compact chromosome. Let go too early, or run out of window, and that
// thread stays loose — which is the chromosome that later tears.

const SPOTS = [
  { x: 320, y: 216 },
  { x: 672, y: 208 },
  { x: 306, y: 428 },
  { x: 684, y: 424 },
];
const COIL_MS = 1500;
const WINDOW_MS = 2800;
const TICK_MS = 30;

export default function ChromatinCondense({ onComplete, onStarsUpdate, onStatus }) {
  const [coils, setCoils] = useState(() => SPOTS.map(() => 0));
  const [activeIndex, setActiveIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);

  const coilsRef = useRef(SPOTS.map(() => 0));
  const activeRef = useRef(0);
  const missRef = useRef(0);
  const holdRef = useRef(false);
  const doneRef = useRef(false);
  const tickRef = useRef(null);
  const windowRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(tickRef.current);
      clearTimeout(windowRef.current);
    };
  }, []);

  useEffect(() => {
    if (done) {
      onStatus?.({ hint: 'All chromatin condensed into chromosomes', tone: 'good' });
      return;
    }
    onStatus?.({
      hint: holding
        ? 'Keep holding — the fibre is supercoiling'
        : `Press and hold the glowing chromatin thread  (${coils.filter((c) => c >= 1).length} / ${SPOTS.length} condensed${misses > 0 ? `, ${misses} left loose` : ''})`,
      tone: holding ? 'busy' : misses > 0 ? 'bad' : 'info',
    });
  }, [holding, misses, done, coils]); // eslint-disable-line react-hooks/exhaustive-deps

  function advance(condensed) {
    clearInterval(tickRef.current);
    clearTimeout(windowRef.current);
    tickRef.current = null;
    holdRef.current = false;
    setHolding(false);

    if (!condensed) {
      missRef.current += 1;
      setMisses(missRef.current);
    }

    const stars = missRef.current === 0 ? 3 : missRef.current === 1 ? 2 : 1;
    onStarsUpdate?.(stars);

    const next = activeRef.current + 1;
    if (next >= SPOTS.length) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars }); }, 500);
      return;
    }

    activeRef.current = next;
    setActiveIndex(next);
    openWindow();
  }

  function openWindow() {
    clearTimeout(windowRef.current);
    windowRef.current = setTimeout(() => {
      if (!doneRef.current) advance(false);
    }, WINDOW_MS);
  }

  useEffect(() => {
    openWindow();
    return () => clearTimeout(windowRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startHold(event, idx) {
    if (doneRef.current || idx !== activeRef.current || tickRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    holdRef.current = true;
    setHolding(true);

    tickRef.current = setInterval(() => {
      if (!holdRef.current || doneRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
        return;
      }
      const i = activeRef.current;
      const next = coilsRef.current.slice();
      next[i] = Math.min(1, next[i] + TICK_MS / COIL_MS);
      coilsRef.current = next;
      setCoils(next);
      if (next[i] >= 1) advance(true);
    }, TICK_MS);
  }

  function stopHold() {
    holdRef.current = false;
    setHolding(false);
    clearInterval(tickRef.current);
    tickRef.current = null;
  }

  return (
    <CellStage view="nucleus" label="Nucleus — condensing chromatin">
      {SPOTS.map((spot, i) => {
        const coil = coils[i];
        const isActive = i === activeIndex && !done;
        const isCondensed = coil >= 1;
        const isPending = i > activeIndex && !done;

        return (
          <g key={CHROM_LABELS[i]}>
            {isActive && (
              <circle
                className="cdl-pulse"
                cx={spot.x}
                cy={spot.y}
                r={76}
                fill="var(--cdl-teal)"
                fillOpacity={0.12}
                stroke="var(--cdl-teal)"
                strokeWidth={3}
                pointerEvents="none"
              />
            )}

            {!isCondensed && (
              <ChromatinFiber
                x={spot.x}
                y={spot.y}
                seed={i * 2 + 1}
                spread={54}
                coil={coil}
                width={isActive ? 6 : 4.5}
                color={isActive ? 'var(--cdl-teal-deep)' : 'var(--cdl-chromatin)'}
                opacity={isPending ? 0.45 : 1}
              />
            )}

            {isCondensed && (
              <g className="cdl-pop">
                <Chromosome
                  x={spot.x}
                  y={spot.y}
                  angle={-24 + i * 16}
                  scale={0.92}
                  color={CHROM_COLORS[i]}
                  label={CHROM_LABELS[i]}
                />
              </g>
            )}

            <circle
              cx={spot.x}
              cy={spot.y}
              r={76}
              fill="transparent"
              style={{ cursor: isActive ? 'pointer' : 'default' }}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={
                isCondensed
                  ? `Chromatin ${CHROM_LABELS[i]} condensed`
                  : isActive
                    ? `Chromatin ${CHROM_LABELS[i]} — press and hold to condense`
                    : `Chromatin ${CHROM_LABELS[i]} waiting`
              }
              onPointerDown={isActive ? (e) => startHold(e, i) : undefined}
              onPointerUp={isActive ? stopHold : undefined}
              onPointerCancel={isActive ? stopHold : undefined}
              onKeyDown={isActive ? (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                coilsRef.current[i] = 1;
                setCoils(coilsRef.current.slice());
                advance(true);
              } : undefined}
            />

            {isActive && !isCondensed && (
              <g pointerEvents="none">
                <rect x={spot.x - 44} y={spot.y + 88} width={88} height={9} rx={4.5} fill="var(--cdl-line-strong)" />
                <rect
                  x={spot.x - 44}
                  y={spot.y + 88}
                  width={88 * coil}
                  height={9}
                  rx={4.5}
                  fill="var(--cdl-teal)"
                />
              </g>
            )}

            {!isCondensed && !isActive && (
              <text
                x={spot.x}
                y={spot.y + 96}
                textAnchor="middle"
                fill="var(--cdl-ink-3)"
                fontSize={17}
                fontWeight={700}
                fontFamily="var(--cdl-font-mono)"
                pointerEvents="none"
              >
                {CHROM_LABELS[i]}{coil > 0 ? ' · loose' : ''}
              </text>
            )}
          </g>
        );
      })}
    </CellStage>
  );
}
