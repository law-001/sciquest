import { useEffect, useRef, useState, useCallback } from 'react';
import { createEventBus } from '../_shared/eventBus';
import { createPhaserGame } from '../_shared/phaser/createPhaserGame';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { useChallengeTracker } from '../_shared/progress/useChallengeTracker';
import { usePageVisibility } from '../_shared/hooks/usePageVisibility';
import { LevelSelect } from './ui/LevelSelect';
import { SandboxHUD } from './ui/SandboxHUD';
import { ControlBar } from './ui/ControlBar';
import { SuccessModal } from './ui/SuccessModal';
import BootScene from './scenes/BootScene';
import SandboxScene from './scenes/SandboxScene';
import { LEVELS } from './data/levels';
import { SUBSTANCES } from './data/substances';
import { CHALLENGES } from './data/challenges';
import { supabase } from '../../lib/supabase';

const GAME_ID = 'matter-state-sandbox';
const NULL_BUS = { on: () => {}, off: () => {}, emit: () => {} };

export default function MatterStateSandbox({
  user,
  profile,
  onExit,
  onProgressUpdate,
  initialChallengeId,
  reducedMotion,
  deviceTier,
}) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [bus, setBus] = useState(null);
  const busRef = useRef(null);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const flashTimerRef = useRef(null);

  // Portrait lock on touch devices
  const [isPortrait, setIsPortrait] = useState(false);
  useEffect(() => {
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
    const check = () => setIsPortrait(isTouchDevice() && window.innerHeight > window.innerWidth);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const levelChallenges = selectedLevel
    ? CHALLENGES.filter(c => c.levelId === selectedLevel.id)
    : [];

  const studentId = profile?.id ?? user?.id ?? null;
  const { recordCompletion } = useGameProgress(supabase, GAME_ID, studentId);

  const liveBus = bus ?? NULL_BUS;
  const { holdProgress, isComplete } = useChallengeTracker(activeChallenge, bus, isPaused);

  // Flash on transition start
  useEffect(() => {
    if (!bus) return;
    function handleTransitionStart() {
      setFlashOn(true);
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlashOn(false), 240);
    }
    bus.on('transitionStart', handleTransitionStart);
    return () => {
      bus.off('transitionStart', handleTransitionStart);
      clearTimeout(flashTimerRef.current);
    };
  }, [bus]);

  // Auto-select first challenge when entering a level
  useEffect(() => {
    if (!selectedLevel) return;
    const lvlChallenges = CHALLENGES.filter(c => c.levelId === selectedLevel.id);
    setActiveChallenge(lvlChallenges[0] ?? null);
  }, [selectedLevel?.id]);

  // Record completion exactly once per challenge
  const completionFiredRef = useRef(false);
  useEffect(() => {
    if (!isComplete || !activeChallenge || completionFiredRef.current) return;
    completionFiredRef.current = true;
    setCompletedIds(prev => [...new Set([...prev, activeChallenge.id])]);
    setShowSuccessModal(true);
    recordCompletion({
      challengeId: activeChallenge.id,
      score: 1,
      scoreUnit: 'completion',
    }).catch(() => {});
    onProgressUpdate?.({ challengeId: activeChallenge.id });
  }, [isComplete]);

  useEffect(() => { completionFiredRef.current = false; }, [activeChallenge?.id]);

  // Create / destroy Phaser when level changes
  useEffect(() => {
    if (!selectedLevel) return;
    if (gameRef.current) return;

    const eventBus = createEventBus();
    busRef.current = eventBus;
    setBus(eventBus);

    const game = createPhaserGame({
      containerId: containerRef.current,
      scenes: [BootScene, SandboxScene],
      bus: eventBus,
      deviceTier: deviceTier ?? 'mid',
    });

    game.registry.set('level', selectedLevel.id);
    game.registry.set('substanceId', selectedLevel.availableSubstances[0]);
    game.registry.set('reducedMotion', reducedMotion ?? false);
    game.registry.set('deviceTier', deviceTier ?? 'mid');

    gameRef.current = game;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      busRef.current?.removeAll();
      busRef.current = null;
      setBus(null);
    };
  }, [selectedLevel?.id]);

  // Page visibility — pause/resume silently
  const manuallyPausedRef = useRef(false);
  const handlePageVisibility = useCallback((isHidden) => {
    if (isHidden) {
      busRef.current?.emit('pauseGame');
      setIsPaused(true);
    } else if (!manuallyPausedRef.current) {
      busRef.current?.emit('resumeGame');
      setIsPaused(false);
    }
  }, []);
  usePageVisibility(handlePageVisibility);

  // ── Handlers ─────────────────────────────────────────────────────

  function handleSelectLevel(lvl) {
    setSelectedLevel(lvl);
    setCompletedIds([]);
    setShowSuccessModal(false);
    setPaused(false);
  }

  function handleBackFromGame() {
    setSelectedLevel(null);
    setActiveChallenge(null);
    setShowSuccessModal(false);
    setPaused(false);
  }

  function handleReset() {
    busRef.current?.emit('reset');
    setActiveChallenge(levelChallenges[0] ?? null);
    setShowSuccessModal(false);
  }

  function handlePause() {
    manuallyPausedRef.current = true;
    setIsPaused(true);
    setPaused(true);
    busRef.current?.emit('pauseGame');
  }

  function handleResume() {
    manuallyPausedRef.current = false;
    setIsPaused(false);
    setPaused(false);
    busRef.current?.emit('resumeGame');
  }

  function handleScreenshot() {
    if (!gameRef.current) return;
    gameRef.current.renderer.snapshot((image) => {
      const a = document.createElement('a');
      a.href = image.src;
      a.download = 'matter-sandbox.png';
      a.click();
    });
  }

  const activeChallengeIndex = levelChallenges.findIndex(c => c.id === activeChallenge?.id);
  const nextChallenge = activeChallengeIndex >= 0
    ? levelChallenges[activeChallengeIndex + 1] ?? null
    : null;

  const substance = selectedLevel
    ? SUBSTANCES[selectedLevel.availableSubstances[0]]
    : null;

  // ── Level select ─────────────────────────────────────────────────

  if (!selectedLevel) {
    return (
      <LevelSelect
        supabase={supabase}
        user={user}
        levels={LEVELS}
        challenges={CHALLENGES}
        onSelectLevel={handleSelectLevel}
        onBack={onExit}
      />
    );
  }

  // ── Game screen ──────────────────────────────────────────────────

  return (
    <>
      {isPortrait && (
        <div style={{ position: 'fixed', inset: 0, background: '#1c1a17', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, color: 'white', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 64 }} aria-hidden="true">↻</div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>Rotate your device for the best experience</p>
        </div>
      )}

      <div className="sq-sandbox-shell">
        {/* — Top bar — */}
        <div className="sq-sandbox-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="sq-icon-btn"
              style={{ width: 'auto', padding: '0 12px', gap: 6, fontSize: 13, fontWeight: 600 }}
              onClick={handleBackFromGame}
              aria-label="Exit to level select"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6"/>
              </svg>
              Exit
            </button>
            <span className="sq-pill sq-pill--teal" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sq-teal)' }} />
              Saved
            </span>
          </div>

          <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--sq-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--sq-ink-1)' }}>
              Level {selectedLevel.number} — {selectedLevel.name}
            </span>
            {activeChallenge && (
              <>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--sq-ink-4)', display: 'inline-block' }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: 'var(--sq-ink-3)' }}>{activeChallenge.title}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              className="sq-icon-btn"
              aria-label={paused ? 'Resume simulation' : 'Pause simulation'}
              onClick={paused ? handleResume : handlePause}
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M6 4l14 8L6 20z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              )}
            </button>
            <button className="sq-icon-btn" aria-label="Reset particles" onClick={handleReset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>
              </svg>
            </button>
            <button className="sq-icon-btn" aria-label="Take a screenshot" onClick={handleScreenshot}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* — Main: HUD + Stage — */}
        <div className="sq-sandbox-main">
          <SandboxHUD
            bus={liveBus}
            level={selectedLevel}
            activeChallenge={activeChallenge}
            holdProgress={holdProgress}
            reducedMotion={reducedMotion}
          />

          <div className="sq-stage-wrap">
            <div className="sq-stage" ref={containerRef}>
              {/* Phaser canvas renders here */}
              <div className={`sq-flash${flashOn ? ' on' : ''}`} aria-hidden="true" />
              {substance && (
                <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: 'var(--sq-font-mono)', fontSize: 10, color: 'var(--sq-ink-3)', display: 'flex', gap: 14, pointerEvents: 'none', zIndex: 1 }}>
                  <span><b style={{ color: 'var(--sq-ink-2)', fontWeight: 600 }}>{substance.name}</b></span>
                  <span>melt <b style={{ color: 'var(--sq-ink-2)', fontWeight: 600 }}>{substance.meltingPoint}°C</b></span>
                  <span>boil <b style={{ color: 'var(--sq-ink-2)', fontWeight: 600 }}>{substance.boilingPoint}°C</b></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* — Bottom controls — */}
        <ControlBar
          bus={liveBus}
          level={selectedLevel}
          substances={SUBSTANCES}
          currentSubstanceId={selectedLevel.availableSubstances[0]}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Pause overlay */}
      {paused && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={handleResume}
        >
          <div
            style={{ background: 'white', borderRadius: 'var(--sq-radius-lg)', padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', minWidth: 220 }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontFamily: 'var(--sq-font-display)', fontSize: 24, fontWeight: 700, color: 'var(--sq-ink-1)', margin: 0 }}>Paused</p>
            <button
              onClick={handleResume}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--sq-orange)', border: '1.5px solid var(--sq-orange-deep)', color: 'white', borderRadius: 999, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 44 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M6 4l14 8L6 20z"/></svg>
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && activeChallenge && (
        <SuccessModal
          challenge={activeChallenge}
          nextChallenge={nextChallenge}
          onClose={() => setShowSuccessModal(false)}
          onNextChallenge={() => {
            setShowSuccessModal(false);
            setActiveChallenge(nextChallenge);
          }}
        />
      )}
    </>
  );
}
