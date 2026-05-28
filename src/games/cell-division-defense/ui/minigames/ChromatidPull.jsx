import { useEffect, useRef, useState } from 'react';
import { useViewportBp } from '../useViewportBp';

const MONO          = '"Courier New", Courier, monospace';
const PAIR_COUNT    = 4;
const PAIR_COLORS   = ['#9B59B6', '#E74C3C', '#27AE60', '#E67E22'];
const PAIR_LABELS   = ['A', 'B', 'C', 'D'];
const PULL_WINDOW   = 1500;  // ms to drag after severing
const TOO_EARLY_MS  = 300;   // drag within this ms of sever = error

function ChromX({ color, size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <rect x="9"  y="3"  width="10" height="17" rx="5" fill={color} transform="rotate(-15 14 11)" />
      <rect x="25" y="3"  width="10" height="17" rx="5" fill={color} transform="rotate(15 30 11)" />
      <rect x="9"  y="24" width="10" height="17" rx="5" fill={color} transform="rotate(15 14 33)" />
      <rect x="25" y="24" width="10" height="17" rx="5" fill={color} transform="rotate(-15 30 33)" />
      <circle cx="22" cy="22" r="5" fill={color} />
    </svg>
  );
}

export default function ChromatidPull({ onComplete, onStarsUpdate }) {
  const bp = useViewportBp();
  const isXS = bp === 'xs';
  const isSM = bp === 'sm';
  const chrSize     = isXS ? 24 : isSM ? 30 : 34;
  const pairGap     = isXS ? 6 : isSM ? 8 : 10;
  const pairPadding = isXS ? '6px 4px' : isSM ? '8px 6px' : '12px 10px';
  // Pull threshold shrinks with the chromosome so the gesture stays
  // proportional to the visible separation on a narrow viewport.
  const pullPx      = isXS ? 36 : isSM ? 48 : 60;
  const linkW       = isXS ? 12 : isSM ? 14 : 18;
  const linkH       = isXS ? 6 : isSM ? 7 : 8;

  const [pairResults, setPairResults] = useState([]);   // { error: bool }[]
  const [activeIdx,   setActiveIdx]   = useState(0);
  // 'link' | 'severed' | 'pulled'
  const [activeStage, setActiveStage] = useState('link');
  const [errorFlash,  setErrorFlash]  = useState(false);
  const [allDone,     setAllDone]     = useState(false);

  const stageRef      = useRef('link');
  const activeIdxRef  = useRef(0);
  const resultsRef    = useRef([]);
  const doneRef       = useRef(false);
  const severTimeRef  = useRef(null);
  const dragOriginRef = useRef(null);
  const pullTimerRef  = useRef(null);
  const mountedRef    = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(pullTimerRef.current);
    };
  }, []);

  function completePair(hasError) {
    if (doneRef.current || stageRef.current === 'pulled') return;
    stageRef.current = 'pulled';
    clearTimeout(pullTimerRef.current);

    const newResults = [...resultsRef.current, { error: hasError }];
    resultsRef.current = newResults;
    setPairResults([...newResults]);

    const errCount = newResults.filter(r => r.error).length;
    const stars    = errCount === 0 ? 3 : errCount === 1 ? 2 : 1;
    onStarsUpdate?.(stars);

    if (!mountedRef.current) return;
    setActiveStage('pulled');

    const nextIdx = activeIdxRef.current + 1;
    if (nextIdx >= PAIR_COUNT) {
      doneRef.current = true;
      setAllDone(true);
      setTimeout(() => {
        if (mountedRef.current) onComplete({ stars });
      }, 400);
      return;
    }

    setTimeout(() => {
      if (!mountedRef.current) return;
      activeIdxRef.current = nextIdx;
      stageRef.current     = 'link';
      dragOriginRef.current  = null;
      severTimeRef.current   = null;
      setActiveIdx(nextIdx);
      setActiveStage('link');
    }, 380);
  }

  function handleLinkClick(e) {
    e.stopPropagation();
    if (stageRef.current !== 'link' || doneRef.current) return;
    severTimeRef.current = Date.now();
    stageRef.current = 'severed';
    setActiveStage('severed');

    pullTimerRef.current = setTimeout(() => {
      if (stageRef.current === 'severed') completePair(false);
    }, PULL_WINDOW);
  }

  function handlePairPointerDown(e) {
    if (stageRef.current !== 'severed') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOriginRef.current = { x: e.clientX, t: Date.now() };
  }

  function handlePairPointerMove(e) {
    if (stageRef.current !== 'severed' || !dragOriginRef.current) return;
    const dx = Math.abs(e.clientX - dragOriginRef.current.x);
    if (dx >= pullPx) {
      const tooEarly = (dragOriginRef.current.t - (severTimeRef.current ?? 0)) < TOO_EARLY_MS;
      dragOriginRef.current = null;
      if (tooEarly) {
        setErrorFlash(true);
        setTimeout(() => { if (mountedRef.current) setErrorFlash(false); }, 550);
      }
      completePair(tooEarly);
    }
  }

  function handlePairPointerUp() {
    dragOriginRef.current = null;
  }

  const errorCount = pairResults.filter(r => r.error).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', fontFamily: MONO }}>
      <style>{`
        @keyframes cdd-link-ready {
          0%, 100% { box-shadow: 0 0 0 2px #27AE60, 0 0 10px 2px rgba(39,174,96,0.45); }
          50%       { box-shadow: 0 0 0 3px #27AE60, 0 0 20px 6px rgba(39,174,96,0.8); }
        }
        @keyframes cdd-err-flash {
          0%, 100% { background: transparent; }
          40%      { background: rgba(231,76,60,0.3); }
        }
      `}</style>

      {/* Error counter */}
      <div style={{
        fontSize: 11, letterSpacing: '0.1em',
        color: errorCount > 0 ? '#FF8080' : 'rgba(255,255,255,0.22)',
        transition: 'color 0.3s',
      }}>
        PREMATURE PULLS: {errorCount}
      </div>

      {/* Pairs */}
      <div style={{ display: 'flex', gap: pairGap, justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: PAIR_COUNT }, (_, i) => {
          const isActive  = i === activeIdx && !allDone;
          const isDone    = i < pairResults.length;
          const wasError  = isDone && pairResults[i].error;
          const stage     = isActive ? activeStage : isDone ? 'pulled' : 'idle';
          const color     = PAIR_COLORS[i];
          const dimmed    = !isActive && !isDone;
          const pulled    = stage === 'pulled';

          return (
            <div
              key={i}
              onPointerDown={isActive ? handlePairPointerDown : undefined}
              onPointerMove={isActive ? handlePairPointerMove : undefined}
              onPointerUp={isActive ? handlePairPointerUp : undefined}
              aria-label={`Chromosome pair ${PAIR_LABELS[i]}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: pulled ? (isXS ? 12 : 18) : 2,
                padding: pairPadding,
                borderRadius: 12,
                border: isActive
                  ? `1.5px solid ${color}`
                  : isDone
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(255,255,255,0.05)',
                background: errorFlash && isActive
                  ? 'rgba(231,76,60,0.2)'
                  : 'transparent',
                opacity: dimmed ? 0.28 : 1,
                cursor: stage === 'severed' ? 'ew-resize' : 'default',
                userSelect: 'none',
                touchAction: 'none',
                transition: 'gap 0.3s ease, opacity 0.3s, background 0.2s',
                animation: errorFlash && isActive ? 'cdd-err-flash 0.55s ease' : 'none',
              }}
            >
              {/* Left chromatid */}
              <div style={{
                transition: 'transform 0.3s ease',
                transform: pulled ? 'translateX(-6px)' : 'none',
              }}>
                <ChromX color={isDone && !wasError ? '#3EDD88' : color} size={chrSize} />
              </div>

              {/* Link / connector / result */}
              {!pulled ? (
                <button
                  onClick={isActive && stage === 'link' ? handleLinkClick : undefined}
                  aria-label={stage === 'link' && isActive ? `Sever link for pair ${PAIR_LABELS[i]}` : undefined}
                  tabIndex={stage === 'link' && isActive ? 0 : -1}
                  style={{
                    width: linkW, height: linkH, borderRadius: 4,
                    background: stage === 'link' && isActive
                      ? '#27AE60'
                      : 'rgba(255,255,255,0.18)',
                    border: 'none', padding: 0, flexShrink: 0,
                    cursor: stage === 'link' && isActive ? 'pointer' : 'default',
                    animation: stage === 'link' && isActive
                      ? 'cdd-link-ready 0.8s ease-in-out infinite'
                      : 'none',
                    pointerEvents: stage === 'link' && isActive ? 'auto' : 'none',
                    transition: 'background 0.2s',
                    position: 'relative', zIndex: 2,
                  }}
                />
              ) : (
                <span style={{
                  fontSize: 13, flexShrink: 0,
                  color: wasError ? '#FF8080' : '#3EDD88',
                  textShadow: wasError ? 'none' : '0 0 6px #3EDD88',
                }}>
                  {wasError ? '✗' : '✓'}
                </span>
              )}

              {/* Right chromatid */}
              <div style={{
                transition: 'transform 0.3s ease',
                transform: pulled ? 'translateX(6px)' : 'none',
              }}>
                <ChromX color={isDone && !wasError ? '#3EDD88' : color} size={chrSize} />
              </div>

              {/* Drag arrows overlay when severed */}
              {stage === 'severed' && isActive && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 6px',
                    pointerEvents: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                  }}
                >
                  <span>←</span>
                  <span>→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instruction */}
      <p style={{
        margin: 0, fontSize: 11, letterSpacing: '0.08em', textAlign: 'center',
        color: allDone
          ? '#3EDD88'
          : activeStage === 'severed'
          ? '#FFD700'
          : 'rgba(255,255,255,0.38)',
        textShadow: allDone ? '0 0 10px #3EDD88' : 'none',
        transition: 'color 0.3s',
      }}>
        {allDone
          ? 'ALL CHROMATIDS SEPARATED'
          : activeStage === 'link'
          ? 'CLICK THE GREEN LINK TO SEVER IT'
          : activeStage === 'severed'
          ? 'NOW DRAG OUTWARD  ← →'
          : ''}
      </p>
    </div>
  );
}
