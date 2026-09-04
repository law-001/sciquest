import { useEffect, useRef, useState } from 'react';
import { CELL, ellipseShape, stagePoint } from '../render/cellGeometry';
import { Centrosome, Chromatid, Chromosome, SpindleFiber } from '../render/parts';
import { CellStage } from '../ui/CellStage';
import { CHROM_COLORS, CHROM_LABELS, HOMOLOG_COLORS } from './palette';

// ANAPHASE — in the cell, which has already begun to elongate.
//
// Cut the link, wait for it to part, then drag up or down: the two halves
// follow the mouse in real time, one to each pole, and once they are far
// enough apart the spindle takes over and reels them the rest of the way.
// Grabbing while the link is still being cut tears the chromosome.
//
// mode 'chromatid' (mitosis, anaphase II): one chromosome splits at the
// centromere into two single chromatids.
// mode 'homolog' (meiosis, anaphase I): a homologous PAIR separates and each
// partner stays whole, its sister chromatids still joined. This is the
// difference students most often get backwards.

const PAIR_COUNT = 4;
const SEVER_MS = 380;
const PULL_WINDOW = 5000;
const RELEASE_TRAVEL = 92;
const FINAL_TRAVEL = 152;

const SHAPE = ellipseShape(CELL.r, 0.14);
const PLATE_Y = CELL.cy;
const SLOT_X = [CELL.cx - 168, CELL.cx - 56, CELL.cx + 56, CELL.cx + 168];
const POLE_Y_TOP = CELL.cy - CELL.r * 1.14 + 34;
const POLE_Y_BOTTOM = CELL.cy + CELL.r * 1.14 - 34;
const HOMOLOG_GAP = 56;

export default function ChromatidPull({ mode = 'chromatid', onComplete, onStarsUpdate, onStatus }) {
  const isHomolog = mode === 'homolog';
  const unit = isHomolog ? 'homologues' : 'chromatids';

  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  // link → severing → ready → flying
  const [stage, setStage] = useState('link');
  const [travel, setTravel] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const stageRef = useRef('link');
  const activeRef = useRef(0);
  const resultsRef = useRef([]);
  const travelRef = useRef(0);
  const dragRef = useRef(null);
  const doneRef = useRef(false);
  const severTimerRef = useRef(null);
  const windowRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(severTimerRef.current);
      clearTimeout(windowRef.current);
    };
  }, []);

  const errorCount = results.filter((r) => r.error).length;

  useEffect(() => {
    if (allDone) {
      onStatus?.({ hint: `All ${unit} separated`, tone: 'good' });
      return;
    }
    const tail = errorCount > 0 ? `  ·  ${errorCount} torn` : '';
    const hint = {
      link: isHomolog
        ? 'Tap the glowing green link holding the highlighted pair together'
        : 'Tap the glowing green centromere to cut it',
      severing: 'Cutting — hold off until the link has fully parted',
      ready: 'Now press on the chromosome and drag the mouse up or down to pull the halves apart',
      flying: 'The spindle takes it from here',
    }[stage];
    onStatus?.({ hint: `${hint}${tail}`, tone: stage === 'severing' ? 'bad' : stage === 'ready' ? 'busy' : 'info' });
  }, [stage, allDone, errorCount]); // eslint-disable-line react-hooks/exhaustive-deps

  function completePair(hasError) {
    if (doneRef.current || stageRef.current === 'flying') return;
    stageRef.current = 'flying';
    clearTimeout(windowRef.current);
    clearTimeout(severTimerRef.current);
    dragRef.current = null;
    setDragging(false);
    setStage('flying');
    travelRef.current = FINAL_TRAVEL;
    setTravel(FINAL_TRAVEL);

    const next = [...resultsRef.current, { error: hasError }];
    resultsRef.current = next;
    setResults(next);

    const errs = next.filter((r) => r.error).length;
    const stars = errs === 0 ? 3 : errs === 1 ? 2 : 1;
    onStarsUpdate?.(stars);

    const nextIdx = activeRef.current + 1;
    if (nextIdx >= PAIR_COUNT) {
      doneRef.current = true;
      setAllDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars }); }, 900);
      return;
    }

    // Long enough for the halves to finish their glide before the next
    // chromosome lights up.
    setTimeout(() => {
      if (!mountedRef.current) return;
      activeRef.current = nextIdx;
      stageRef.current = 'link';
      travelRef.current = 0;
      setActiveIdx(nextIdx);
      setStage('link');
      setTravel(0);
    }, 700);
  }

  function cutLink(event) {
    event.stopPropagation();
    if (stageRef.current !== 'link' || doneRef.current) return;
    stageRef.current = 'severing';
    setStage('severing');

    severTimerRef.current = setTimeout(() => {
      if (stageRef.current !== 'severing' || !mountedRef.current) return;
      stageRef.current = 'ready';
      setStage('ready');
      // If the student never pulls, the spindle does it for them rather than
      // stranding the run.
      windowRef.current = setTimeout(() => {
        if (stageRef.current === 'ready') completePair(false);
      }, PULL_WINDOW);
    }, SEVER_MS);
  }

  function handleDown(event) {
    if (doneRef.current) return;
    if (stageRef.current === 'severing') {
      completePair(true);
      return;
    }
    if (stageRef.current !== 'ready') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    clearTimeout(windowRef.current);
    dragRef.current = { y: stagePoint(event).y, from: travelRef.current };
    setDragging(true);
  }

  function handleMove(event) {
    if (!dragRef.current || stageRef.current !== 'ready') return;
    const dy = Math.abs(stagePoint(event).y - dragRef.current.y);
    const next = Math.min(RELEASE_TRAVEL, dragRef.current.from + dy * 0.9);
    travelRef.current = next;
    setTravel(next);
    if (next >= RELEASE_TRAVEL) completePair(false);
  }

  function handleUp() {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    if (stageRef.current !== 'ready') return;
    // Let go early and the halves spring back — the spindle has not won yet.
    travelRef.current = 0;
    setTravel(0);
    clearTimeout(windowRef.current);
    windowRef.current = setTimeout(() => {
      if (stageRef.current === 'ready') completePair(false);
    }, PULL_WINDOW);
  }

  return (
    <CellStage shape={SHAPE} label="Cell — separating chromosomes">
      <Centrosome x={CELL.cx} y={POLE_Y_TOP} dir={-1} />
      <Centrosome x={CELL.cx} y={POLE_Y_BOTTOM} dir={1} />

      {SLOT_X.map((x, i) => {
        const isActive = i === activeIdx && !allDone;
        const isDone = i < results.length;
        const wasError = isDone && results[i].error;
        const label = CHROM_LABELS[i];

        const linkLive = isActive && stage === 'link';
        const severing = isActive && stage === 'severing';
        const canPull = isActive && stage === 'ready';

        // Whether the link has parted, which is what decides both how far the
        // halves sit apart and whether there is still a link to cut. A
        // homologous pair already straddles a gap while it is joined, so the
        // gap alone cannot stand in for "cut".
        const cut = isActive ? stage === 'ready' || stage === 'flying' : isDone;
        const restGap = isHomolog ? HOMOLOG_GAP / 2 : cut ? 12 : 0;
        const gap = isDone
          ? FINAL_TRAVEL
          : isActive ? Math.max(travel, restGap) : restGap;
        const joined = !cut && !isDone;
        const twoBodies = isHomolog || cut || isDone;

        const tint = (side) => {
          if (wasError) return 'var(--cdl-bad)';
          if (isDone) return 'var(--cdl-good)';
          return isHomolog ? HOMOLOG_COLORS[side] : CHROM_COLORS[i];
        };
        const Body = isHomolog ? Chromosome : Chromatid;
        // Only ease when the spindle is moving them; a live drag must track
        // the pointer exactly.
        const glide = dragging && isActive ? undefined : 'cdl-travel';

        return (
          <g
            key={label}
            opacity={!isActive && !isDone ? 0.38 : 1}
            style={{ cursor: canPull ? 'ns-resize' : 'default', touchAction: 'none' }}
            onPointerDown={isActive ? handleDown : undefined}
            onPointerMove={isActive ? handleMove : undefined}
            onPointerUp={isActive ? handleUp : undefined}
            onPointerCancel={isActive ? handleUp : undefined}
          >
            <SpindleFiber
              x1={CELL.cx}
              y1={POLE_Y_TOP}
              x2={x}
              y2={PLATE_Y - gap}
              tone={cut ? 'var(--cdl-teal-deep)' : 'var(--cdl-teal)'}
              width={2.4}
            />
            <SpindleFiber
              x1={CELL.cx}
              y1={POLE_Y_BOTTOM}
              x2={x}
              y2={PLATE_Y + gap}
              tone={cut ? 'var(--cdl-teal-deep)' : 'var(--cdl-teal)'}
              width={2.4}
            />

            {isActive && (
              <ellipse
                className={`cdl-travel${linkLive ? ' cdl-pulse' : ''}`}
                cx={x}
                cy={PLATE_Y}
                rx={62}
                ry={gap + 62}
                fill="var(--cdl-teal)"
                fillOpacity={canPull || dragging ? 0.12 : 0.07}
                stroke="var(--cdl-teal)"
                strokeWidth={2}
                pointerEvents="none"
              />
            )}

            {/* A whole chromosome until the link is cut */}
            {!twoBodies && (
              <Chromosome x={x} y={PLATE_Y} scale={0.82} color={tint(0)} label={label} />
            )}

            {twoBodies && (
              <>
                <g className={glide} transform={`translate(0 ${-gap})`}>
                  <Body x={x} y={PLATE_Y} scale={isHomolog ? 0.78 : 0.82} color={tint(0)} />
                </g>
                <g className={glide} transform={`translate(0 ${gap})`}>
                  <Body x={x} y={PLATE_Y} scale={isHomolog ? 0.78 : 0.82} color={tint(1)} label={label} />
                </g>
              </>
            )}

            {/* The link that has to be cut before anything can move */}
            {joined && (
              <g
                role="button"
                tabIndex={linkLive ? 0 : -1}
                aria-label={isHomolog
                  ? `Link holding homologous pair ${label}${linkLive ? ' — tap to release it' : ''}`
                  : `Centromere of chromosome ${label}${linkLive ? ' — tap to cut it' : ''}`}
                style={{ cursor: linkLive ? 'pointer' : 'default' }}
                onPointerDown={linkLive ? cutLink : undefined}
                onKeyDown={linkLive ? (e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  cutLink(e);
                } : undefined}
              >
                <rect
                  className={linkLive ? 'cdl-pulse' : undefined}
                  x={x - 14}
                  y={PLATE_Y - 7}
                  width={28}
                  height={14}
                  rx={7}
                  fill={linkLive ? 'var(--cdl-good)' : 'var(--cdl-ink-4)'}
                />
                <circle cx={x} cy={PLATE_Y} r={32} fill="transparent" />
              </g>
            )}

            {/* The cut in progress, drawn so the wait is visible rather than
                a hidden trap. */}
            {severing && (
              <g pointerEvents="none">
                <circle
                  className="cdl-grow"
                  style={{ animationDuration: `${SEVER_MS}ms` }}
                  cx={x}
                  cy={PLATE_Y}
                  r={30}
                  fill="none"
                  stroke="var(--cdl-orange)"
                  strokeWidth={5}
                  pathLength={1}
                  strokeDasharray="1"
                  transform={`rotate(-90 ${x} ${PLATE_Y})`}
                />
                <text
                  x={x}
                  y={PLATE_Y - 52}
                  textAnchor="middle"
                  fill="var(--cdl-orange-deep)"
                  fontSize={13}
                  fontWeight={800}
                  fontFamily="var(--cdl-font-mono)"
                >
                  CUTTING
                </text>
              </g>
            )}

            {canPull && (
              <circle
                cx={x}
                cy={PLATE_Y}
                r={62}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={`Pull the ${unit} of ${label} apart — drag up or down, or press an arrow key`}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                  e.preventDefault();
                  completePair(false);
                }}
              />
            )}

            {/* Which way to drag */}
            {(canPull || (dragging && isActive)) && (
              <g pointerEvents="none">
                <g transform={`translate(${x} ${PLATE_Y - gap - 58})`}>
                  <g className="cdl-cue-up">
                    <path
                      d="M 0 -18 L 13 4 L 4 4 L 4 18 L -4 18 L -4 4 L -13 4 Z"
                      fill="var(--cdl-orange)"
                      stroke="var(--cdl-orange-deep)"
                      strokeWidth={2}
                    />
                  </g>
                </g>
                <g transform={`translate(${x} ${PLATE_Y + gap + 58})`}>
                  <g className="cdl-cue-down">
                    <path
                      d="M 0 18 L 13 -4 L 4 -4 L 4 -18 L -4 -18 L -4 -4 L -13 -4 Z"
                      fill="var(--cdl-orange)"
                      stroke="var(--cdl-orange-deep)"
                      strokeWidth={2}
                    />
                  </g>
                </g>
                {!dragging && (
                  <text
                    x={x}
                    y={PLATE_Y - gap - 88}
                    textAnchor="middle"
                    fill="var(--cdl-orange-deep)"
                    fontSize={13}
                    fontWeight={800}
                    fontFamily="var(--cdl-font-mono)"
                  >
                    DRAG APART
                  </text>
                )}
              </g>
            )}

            {isDone && (
              <text
                className="cdl-fade"
                x={x}
                y={PLATE_Y + 8}
                textAnchor="middle"
                fill={wasError ? 'var(--cdl-bad)' : 'var(--cdl-good)'}
                fontSize={24}
                fontWeight={800}
                pointerEvents="none"
              >
                {wasError ? '✗' : '✓'}
              </text>
            )}
          </g>
        );
      })}
    </CellStage>
  );
}
