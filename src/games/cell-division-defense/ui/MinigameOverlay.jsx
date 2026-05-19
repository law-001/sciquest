import { useEffect, useRef, useState } from 'react';
import ChromatinCondense from './minigames/ChromatinCondense';
import ChromosomeAlign from './minigames/ChromosomeAlign';
import ChromatidPull from './minigames/ChromatidPull';
import NuclearEnvelope from './minigames/NuclearEnvelope';
import CleavageFurrow from './minigames/CleavageFurrow';

const MONO = '"Courier New", Courier, monospace';
const OVERLAY_DURATION = 30;

const PHASE_META = {
  prophase:    { color: '#9B59B6',  label: 'PROPHASE',    subtitle: 'Condense the chromatin strands' },
  metaphase:   { color: '#00FFCC',  label: 'METAPHASE',   subtitle: 'Align chromosomes on the metaphase plate' },
  anaphase:    { color: '#FFD700',  label: 'ANAPHASE',    subtitle: 'Pull the sister chromatids apart' },
  telophase:   { color: '#A8C8F0',  label: 'TELOPHASE',   subtitle: 'Draw the nuclear envelopes' },
  cytokinesis: { color: '#FF6B6B',  label: 'CYTOKINESIS', subtitle: 'Pinch the cleavage furrow closed' },
};

const MINIGAME_MAP = {
  prophase:    ChromatinCondense,
  metaphase:   ChromosomeAlign,
  anaphase:    ChromatidPull,
  telophase:   NuclearEnvelope,
  cytokinesis: CleavageFurrow,
};

export function MinigameOverlay({ phase, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(OVERLAY_DURATION);
  const [currentStars, setCurrentStars] = useState(3);
  const completedRef = useRef(false);
  const timerRef = useRef(null);

  const meta = PHASE_META[phase] ?? { color: '#3BAFA9', label: phase?.toUpperCase() ?? '', subtitle: '' };
  const MinigameComponent = MINIGAME_MAP[phase];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete({ stars: 0 });
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChildComplete({ stars }) {
    if (completedRef.current) return;
    completedRef.current = true;
    clearInterval(timerRef.current);
    setCurrentStars(stars);
    onComplete({ stars });
  }

  const timerPct = (secondsLeft / OVERLAY_DURATION) * 100;
  const timerColor = secondsLeft > 10 ? '#3BAFA9' : secondsLeft > 5 ? '#FFD700' : '#FF4444';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${meta.label} minigame`}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.87)',
        backdropFilter: 'blur(4px)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
      }}
    >
      <style>{`
        @keyframes cdd-overlay-pulse {
          0%, 100% { box-shadow: 0 0 32px 0 ${meta.color}22, 0 0 0 1px rgba(59,175,169,0.3); }
          50%       { box-shadow: 0 0 56px 8px ${meta.color}44, 0 0 0 1px rgba(59,175,169,0.5); }
        }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: 'calc(100% - 32px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: '0 16px',
          background: '#0D1B2A',
          borderRadius: 16,
          padding: 'clamp(14px,3vh,28px) clamp(14px,3vw,32px) clamp(14px,3vh,32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(10px,2vh,18px)',
          animation: 'cdd-overlay-pulse 3s ease-in-out infinite',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              color: meta.color,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textShadow: `0 0 14px ${meta.color}`,
            }}>
              {meta.label}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 11,
              marginTop: 4,
              letterSpacing: '0.05em',
            }}>
              {meta.subtitle}
            </div>
          </div>

          {/* Countdown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span
              aria-label={`${secondsLeft} seconds remaining`}
              style={{
                color: timerColor,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1,
                textShadow: secondsLeft <= 5 ? `0 0 16px ${timerColor}` : 'none',
                transition: 'color 0.3s, text-shadow 0.3s',
                minWidth: 44,
                textAlign: 'center',
              }}
            >
              {String(secondsLeft).padStart(2, '0')}
            </span>
            <div style={{
              width: 52,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                background: timerColor,
                width: `${timerPct}%`,
                transition: 'width 1s linear, background 0.3s',
              }} />
            </div>
          </div>
        </div>

        {/* ── Stars ──────────────────────────────────────────────── */}
        <div
          aria-label={`${currentStars} of 3 stars`}
          style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
        >
          {[1, 2, 3].map(n => (
            <span
              key={n}
              aria-hidden="true"
              style={{
                fontSize: 30,
                lineHeight: 1,
                color: currentStars >= n ? '#FFD700' : '#333',
                filter: currentStars >= n ? 'drop-shadow(0 0 8px #FFD700)' : 'none',
                transition: 'color 0.4s, filter 0.4s',
                userSelect: 'none',
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* ── Minigame content ───────────────────────────────────── */}
        <div style={{ minHeight: 'clamp(140px, 28vh, 220px)' }}>
          {MinigameComponent ? (
            <MinigameComponent
              onComplete={handleChildComplete}
              onStarsUpdate={setCurrentStars}
            />
          ) : (
            <div style={{
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
              paddingTop: 80,
              fontSize: 12,
            }}>
              No minigame found for: {phase}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
