import { useEffect, useRef, useState } from 'react';
import { useViewportBp } from '../useViewportBp';

const STRAND_COUNT = 4;
const HIT_WINDOW_MS = 1500;
const MONO = '"Courier New", Courier, monospace';

function StrandSVG({ color, strokeWidth, size = 88 }) {
  const h = size / 2;
  return (
    <svg width={size} height={h} viewBox="0 0 88 44" aria-hidden="true">
      <path
        d="M4,22 Q16,6 28,22 Q40,38 52,22 Q64,6 76,22 Q82,30 88,22"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChromosomeX({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <rect x="9"  y="3"  width="10" height="17" rx="5" fill="#9B59B6" transform="rotate(-15 14 11)" />
      <rect x="25" y="3"  width="10" height="17" rx="5" fill="#9B59B6" transform="rotate(15 30 11)" />
      <rect x="9"  y="24" width="10" height="17" rx="5" fill="#9B59B6" transform="rotate(15 14 33)" />
      <rect x="25" y="24" width="10" height="17" rx="5" fill="#9B59B6" transform="rotate(-15 30 33)" />
      <circle cx="22" cy="22" r="5" fill={"#9B59B6"} />
    </svg>
  );
}

const STRAND_BASE_COLORS = ['#78DCD2', '#5BB8D4', '#7EB9A0', '#4DB6AC'];

export default function ChromatinCondense({ onComplete, onStarsUpdate }) {
  const bp = useViewportBp();
  const isXS = bp === 'xs';
  const isSM = bp === 'sm';
  const btnHeight = isXS ? 50 : isSM ? 62 : 82;
  const gridGap = isXS ? 8 : isSM ? 10 : 14;
  const gridMaxW = isXS ? 240 : isSM ? 300 : 360;
  const strandSize = isXS ? 56 : isSM ? 70 : 88;
  const strandStroke = isXS ? 2 : isSM ? 2.5 : 2.5;
  const strandActiveStroke = isXS ? 2.8 : isSM ? 3.2 : 3.5;
  const chrSize = isXS ? 28 : isSM ? 36 : 44;
  const [activeIndex, setActiveIndex] = useState(0);
  const [condensed, setCondensed] = useState(() => Array(STRAND_COUNT).fill(false));
  const [missCount, setMissCount] = useState(0);
  const [done, setDone] = useState(false);

  // Refs hold mutable state safe to read from setTimeout
  const activeRef  = useRef(0);
  const missRef    = useRef(0);
  const condRef    = useRef(Array(STRAND_COUNT).fill(false));
  const doneRef    = useRef(false);
  const timerRef   = useRef(null);

  function scheduleWindow() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!doneRef.current) advanceStrand(false);
    }, HIT_WINDOW_MS);
  }

  function advanceStrand(hit) {
    if (doneRef.current) return;

    if (hit) {
      condRef.current[activeRef.current] = true;
      setCondensed([...condRef.current]);
    } else {
      missRef.current += 1;
      setMissCount(missRef.current);
    }

    const next = activeRef.current + 1;

    if (next >= STRAND_COUNT) {
      doneRef.current = true;
      setDone(true);
      const stars = missRef.current === 0 ? 3 : missRef.current === 1 ? 2 : 1;
      onStarsUpdate?.(stars);
      onComplete({ stars });
      return;
    }

    const starsNow = missRef.current === 0 ? 3 : missRef.current === 1 ? 2 : 1;
    onStarsUpdate?.(starsNow);

    activeRef.current = next;
    setActiveIndex(next);
    scheduleWindow();
  }

  // Kick off the first window on mount
  useEffect(() => {
    scheduleWindow();
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick(idx) {
    if (doneRef.current || idx !== activeRef.current) return;
    clearTimeout(timerRef.current);
    advanceStrand(true);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isXS ? 8 : 14,
      fontFamily: MONO,
    }}>
      <style>{`
        @keyframes cdd-strand-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes cdd-strand-active {
          0%, 100% {
            box-shadow: 0 0 0 2px #3BAFA9, 0 0 14px 3px rgba(59,175,169,0.5);
          }
          50% {
            box-shadow: 0 0 0 3px #3BAFA9, 0 0 26px 8px rgba(59,175,169,0.8);
          }
        }
        @keyframes cdd-condense-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1.0); opacity: 1; }
        }
      `}</style>

      {/* Miss counter */}
      <div style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        color: missCount > 0 ? '#FF8080' : 'rgba(255,255,255,0.22)',
        transition: 'color 0.3s',
      }}>
        MISSED: {missCount} / {STRAND_COUNT}
      </div>

      {/* 2 × 2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: gridGap,
        width: '100%',
        maxWidth: gridMaxW,
      }}>
        {Array.from({ length: STRAND_COUNT }, (_, i) => {
          const isActive   = i === activeIndex && !done;
          const isCond     = condensed[i];
          const isPending  = i > activeIndex && !done;

          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={isCond || done || isPending}
              aria-label={
                isCond    ? `Strand ${i + 1} condensed` :
                isActive  ? `Strand ${i + 1} — tap now!` :
                            `Strand ${i + 1}`
              }
              style={{
                height: btnHeight,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isActive ? 'pointer' : 'default',
                border: isCond
                  ? '1.5px solid rgba(155,89,182,0.45)'
                  : isActive
                  ? '2px solid #3BAFA9'
                  : '1.5px solid rgba(255,255,255,0.08)',
                background: isCond
                  ? 'rgba(155,89,182,0.13)'
                  : isActive
                  ? 'rgba(59,175,169,0.10)'
                  : 'rgba(255,255,255,0.03)',
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.15s ease, border 0.2s, background 0.2s',
                animation: isActive ? 'cdd-strand-active 0.85s ease-in-out infinite' : 'none',
                outline: 'none',
                padding: 0,
              }}
            >
              {isCond ? (
                <div style={{ animation: 'cdd-condense-pop 0.35s ease-out forwards' }}>
                  <ChromosomeX size={chrSize} />
                </div>
              ) : (
                <div style={{
                  animation: isActive
                    ? 'cdd-strand-float 0.55s ease-in-out infinite'
                    : 'cdd-strand-float 1.6s ease-in-out infinite',
                  opacity: isPending ? 0.35 : 1,
                  transition: 'opacity 0.3s',
                }}>
                  <StrandSVG
                    color={isActive ? '#3BAFA9' : STRAND_BASE_COLORS[i]}
                    strokeWidth={isActive ? strandActiveStroke : strandStroke}
                    size={strandSize}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Instruction text */}
      <p style={{
        margin: 0,
        fontSize: 11,
        letterSpacing: '0.09em',
        textAlign: 'center',
        color: done ? '#3BAFA9' : 'rgba(255,255,255,0.38)',
        textShadow: done ? '0 0 10px #3BAFA9' : 'none',
        transition: 'color 0.4s, text-shadow 0.4s',
      }}>
        {done
          ? 'CHROMATIN CONDENSED'
          : 'TAP THE GLOWING STRAND WITHIN 1.5s'}
      </p>
    </div>
  );
}
