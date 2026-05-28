import { useEffect, useRef, useState } from 'react';

const MONO = '"Courier New", Courier, monospace';

const TOWERS = [
  {
    color: '#FF6B35',
    name: 'LYSOSOME',
    role: 'OFFENSE',
    desc: 'Fires enzymes at enemies in range. Your primary damage dealer.',
  },
  {
    color: '#1A6EFF',
    name: 'PROTEIN KINASE',
    role: 'CONTROL',
    desc: 'Slows enemy movement with phosphorylation — gives other towers more time.',
  },
  {
    color: '#2ECC71',
    name: 'REPAIR ENZYME',
    role: 'SUPPORT',
    desc: 'Continuously regenerates nucleus HP. Essential for long survival.',
  },
];

const ENEMIES = [
  {
    color: '#8B00FF',
    name: 'VIRAL HIJACKER',
    role: 'MELEE',
    desc: 'Stops beside towers and attacks them directly. Destroy it fast.',
  },
  {
    color: '#FF4444',
    name: 'RAD PULSE',
    role: 'LONG RANGE',
    desc: 'Fires radiation projectiles from afar without slowing down.',
  },
  {
    color: '#7FFF00',
    name: 'TOXIN TANK',
    role: 'TANK',
    desc: 'Massive HP pool — focus all fire to bring it down.',
  },
];

const STEPS = ['welcome', 'towers', 'enemies', 'place', 'atp', 'ready'];
const MODAL_STEPS = new Set([0, 1, 2, 5]);

function Dot({ color }) {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
      background: `radial-gradient(circle at 38% 35%, ${color}cc, ${color}44)`,
      boxShadow: `0 0 8px ${color}88`, border: `1.5px solid ${color}88`,
    }} />
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
      padding: '2px 6px', borderRadius: 4,
      background: `${color}20`, color, border: `1px solid ${color}44`,
    }}>
      {label}
    </span>
  );
}

function Btn({ onClick, children, accent = '#3BAFA9' }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${accent}30`;
        e.currentTarget.style.boxShadow = `0 0 14px ${accent}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${accent}14`;
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{
        padding: '9px 22px', borderRadius: 999,
        border: `1.5px solid ${accent}`,
        background: `${accent}14`, color: accent,
        fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
        cursor: 'pointer', transition: 'background 0.15s, box-shadow 0.15s',
        minHeight: 36,
      }}
    >
      {children}
    </button>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          height: 3, flex: 1, borderRadius: 2,
          background: i <= step ? '#3BAFA9' : 'rgba(59,175,169,0.15)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'rgba(4,12,24,0.97)',
      border: '1.5px solid rgba(59,175,169,0.4)',
      borderRadius: 18,
      padding: 'clamp(12px,2.5vh,26px) clamp(14px,3vw,26px)',
      fontFamily: MONO,
      boxShadow: '0 0 50px rgba(59,175,169,0.12), 0 20px 50px rgba(0,0,0,0.7)',
      width: 'min(440px, calc(100vw - 24px))',
      ...style,
    }}>
      {children}
    </div>
  );
}

function STitle({ children }) {
  return (
    <div style={{
      fontSize: 'clamp(13px,2vw,17px)', fontWeight: 700,
      color: '#3BAFA9', letterSpacing: '0.1em', marginBottom: 14,
      textShadow: '0 0 12px rgba(59,175,169,0.5)',
    }}>
      {children}
    </div>
  );
}

function EntityRow({ item }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Dot color={item.color} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'clamp(11px,1.6vw,12px)', fontWeight: 700, color: item.color, letterSpacing: '0.07em' }}>
            {item.name}
          </span>
          <Badge label={item.role} color={item.color} />
        </div>
        <div style={{ fontSize: 'clamp(10px,1.5vw,11px)', color: 'rgba(255,255,255,0.58)', lineHeight: 1.5 }}>
          {item.desc}
        </div>
      </div>
    </div>
  );
}

export function TutorialOverlay({ atp, onBusEmit, onComplete }) {
  const [step, setStep] = useState(0);
  const atpSnapshotRef = useRef(null);

  const isModal = MODAL_STEPS.has(step);
  const key = STEPS[step];

  // Keep the underlying scene paused for the whole tutorial — including the
  // non-modal banner steps (place / atp). Otherwise the interphase timer keeps
  // ticking and the cell + ATP pickup animations play while the user is still
  // reading the prompt, which can auto-advance the game before they're ready.
  // Resume happens on unmount when the tutorial actually completes.
  useEffect(() => {
    onBusEmit('pause');
    return () => onBusEmit('resume');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-assert pause on every step transition so any external resume (e.g. the
  // parent's blocking-modal effect after tutorialDone flips) can't leak in.
  useEffect(() => {
    onBusEmit('pause');
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-step side effects
  useEffect(() => {
    if (step === 3) {
      atpSnapshotRef.current = atp;
    }
    if (step === 4) {
      onBusEmit('spawnTutorialAtp');
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance the final "ready" step
  useEffect(() => {
    if (step !== 5) return;
    const id = setTimeout(() => onComplete(), 2200);
    return () => clearTimeout(id);
  }, [step, onComplete]);

  // Step 3: auto-advance when a tower is placed (ATP decreases)
  useEffect(() => {
    if (step === 3 && atpSnapshotRef.current !== null && atp < atpSnapshotRef.current) {
      setTimeout(() => setStep(4), 0);
    }
  }, [atp, step]);

  const next = () => setStep(s => s + 1);

  // Non-modal steps (place + atp): compact banner pinned below the HUD so the
  // game canvas remains accessible — a full card at the bottom covers the tower
  // ring on small landscape viewports (≤ 375px tall) making it impossible to
  // interact with the game.
  if (!isModal) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 22, fontFamily: MONO,
        pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes tut-left { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-8px)} }
        `}</style>

        {/* Subtle dim — keep game visible */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(1px)',
        }} />

        {/* Arrow pointing to shop panel (step 3 only) */}
        {key === 'place' && (
          <div style={{
            position: 'absolute',
            left: 'max(150px, 14vw)',
            top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              fontSize: 'clamp(28px,4vw,42px)', color: '#FFD700',
              textShadow: '0 0 20px rgba(255,215,0,0.9)',
              animation: 'tut-left 0.8s ease-in-out infinite',
            }}>←</div>
            <div style={{
              fontSize: 10, color: '#FFD700', fontWeight: 700,
              letterSpacing: '0.12em', textShadow: '0 0 8px rgba(255,215,0,0.7)',
            }}>SELECT HERE</div>
          </div>
        )}

        {/* Compact banner — pinned below HUD, right of shop, full game width */}
        <div style={{
          position: 'absolute',
          top: 64,
          left: 'max(204px, calc(18vw + 4px))',
          right: 10,
          pointerEvents: 'all',
          background: 'rgba(4,12,24,0.94)',
          border: '1.5px solid rgba(59,175,169,0.45)',
          borderRadius: 12,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {key === 'place' && <>
            <div style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55 }}>
              <span style={{ color: '#FFD700', fontWeight: 700 }}>① SELECT</span> a defender from the panel
              {' · '}
              <span style={{ color: '#FFD700', fontWeight: 700 }}>② TAP</span> a glowing slot to place it
            </div>
            <Btn onClick={next}>SKIP →</Btn>
          </>}

          {key === 'atp' && <>
            <div style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55 }}>
              <span style={{ color: '#FFD700', fontWeight: 700 }}>ATP</span> orb spawned inside the cell —
              {' '}tap it to collect!
            </div>
            <Btn onClick={next} accent="#FFD700">GOT IT →</Btn>
          </>}
        </div>
      </div>
    );
  }

  // Modal steps — three-layer structure for reliable mobile landscape scroll:
  //   1. outer: sizing wrapper (position absolute, inset 0, no overflow)
  //   2. dim: sits behind scroll container so it never scrolls away
  //   3. scroll: overflow-y auto + centering wrapper (minHeight 100%) so the
  //      NEXT button is always reachable even on very short landscape viewports.
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 22, fontFamily: MONO,
        pointerEvents: 'all',
      }}
    >
      <style>{`
        @keyframes tut-glow { 0%,100%{opacity:.65} 50%{opacity:1} }
      `}</style>

      {/* Background dim — lives OUTSIDE the scroll container so it stays put */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(5px)',
      }} />

      {/* Scroll container — sits on top of the dim */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Centering wrapper: minHeight 100% lets flex-center work when the card
            fits; grows taller than 100% when the card overflows so the outer
            scroll container actually scrolls. */}
        <div style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
        }}>
          <Card style={{ pointerEvents: 'all' }}>
            <ProgressBar step={step} total={STEPS.length} />

            {/* ── WELCOME ───────────────────────────────── */}
            {key === 'welcome' && <>
              <div style={{
                fontSize: 10, color: 'rgba(59,175,169,0.55)',
                letterSpacing: '0.25em', marginBottom: 8,
              }}>
                SCIQUEST · TUTORIAL
              </div>
              <STitle>CELL DIVISION DEFENSE</STitle>
              <div style={{ fontSize: 'clamp(11px,1.6vw,13px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.72 }}>
                Your cell is undergoing{' '}
                <span style={{ color: '#3BAFA9', fontWeight: 700 }}>mitosis</span>
                {' '}— and hostile agents are targeting the nucleus.
                <br /><br />
                Place <span style={{ color: '#FFD700', fontWeight: 700 }}>defenders</span> on
                the membrane ring to intercept them before they reach the center.
                <br /><br />
                Survive all{' '}
                <span style={{ color: '#FF6B35', fontWeight: 700 }}>5 phases</span> of
                mitosis to complete cell division!
              </div>
              <div style={{ marginTop: 18 }}>
                <Btn onClick={next}>NEXT →</Btn>
              </div>
            </>}

            {/* ── TOWERS ────────────────────────────────── */}
            {key === 'towers' && <>
              <STitle>YOUR DEFENDERS</STitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOWERS.map(t => <EntityRow key={t.name} item={t} />)}
              </div>
              <div style={{ marginTop: 18 }}>
                <Btn onClick={next}>NEXT →</Btn>
              </div>
            </>}

            {/* ── ENEMIES ───────────────────────────────── */}
            {key === 'enemies' && <>
              <STitle>KNOW YOUR ENEMIES</STitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ENEMIES.map(e => <EntityRow key={e.name} item={e} />)}
              </div>
              <div style={{ marginTop: 18 }}>
                <Btn onClick={next}>NEXT →</Btn>
              </div>
            </>}

            {/* ── READY ─────────────────────────────────── */}
            {key === 'ready' && <>
              <div style={{
                fontSize: 'clamp(13px,2vw,17px)', fontWeight: 700,
                color: '#FFD700', letterSpacing: '0.1em', marginBottom: 14,
                textShadow: '0 0 12px rgba(255,215,0,0.5)',
              }}>
                YOU'RE READY!
              </div>
              <div style={{ fontSize: 'clamp(11px,1.6vw,13px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.72 }}>
                Hostile agents are approaching the nucleus.
                <br />
                Observe each wave — a <span style={{ color: '#3BAFA9' }}>mini-game</span> follows
                every phase to test what you learned!
                <br /><br />
                <span style={{ color: 'rgba(59,175,169,0.55)', fontSize: 10 }}>
                  Good luck, scientist!
                </span>
              </div>
              <div style={{
                marginTop: 16, fontSize: 10,
                color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em',
              }}>
                Starting in a moment...
              </div>
            </>}
          </Card>
        </div>
      </div>
    </div>
  );
}
