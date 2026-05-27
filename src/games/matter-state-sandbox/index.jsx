import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { createEventBus } from '../_shared/eventBus';
import { createPhaserGame } from '../_shared/phaser/createPhaserGame';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { useChallengeTracker } from '../_shared/progress/useChallengeTracker';
import { usePageVisibility } from '../_shared/hooks/usePageVisibility';
import { LevelSelect } from './ui/LevelSelect';
import { SandboxHUD } from './ui/SandboxHUD';
import { ControlBar } from './ui/ControlBar';
import { ParticleView } from './ui/ParticleView';
import { ObjectView } from './ui/ObjectView';
import { SuccessModal } from './ui/SuccessModal';
import { GameMusic } from './audio/GameMusic';
import { GameSounds } from './audio/GameSounds';
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
  initialChallengeId: _initialChallengeId,
  reducedMotion,
  deviceTier,
}) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { isDark, toggle: toggleDark } = useTheme();

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
  const [burgerOpen, setBurgerOpen] = useState(false);
  const burgerRef = useRef(null);
  const [viewMode, setViewMode] = useState('object');
  const [particleSnapshot, setParticleSnapshot] = useState({ temp: 20, pressure: 1 });
  const [muted, setMuted] = useState(false);
  const musicRef = useRef(null);
  const soundsRef = useRef(null);
  const lastSimStateRef = useRef({ temp: 20, pressure: 1 });

  // Background music — starts on mount, resumes after first user interaction
  useEffect(() => {
    const music = new GameMusic();
    musicRef.current = music;
    music.start();
    const sfx = new GameSounds();
    soundsRef.current = sfx;
    return () => {
      music.destroy(); musicRef.current = null;
      sfx.destroy(); soundsRef.current = null;
    };
  }, []);

  useEffect(() => {
    musicRef.current?.setMuted(muted);
    soundsRef.current?.setMuted(muted);
  }, [muted]);

  // SFX — transition sounds and success chime
  useEffect(() => {
    if (!bus) return;
    const onTransition = ({ fromState, toState }) => soundsRef.current?.playTransition(fromState, toState);
    const onReset = () => soundsRef.current?.playReset();
    bus.on('transitionStart', onTransition);
    bus.on('reset', onReset);
    return () => {
      bus.off('transitionStart', onTransition);
      bus.off('reset', onReset);
    };
  }, [bus]);


  useEffect(() => {
    if (!burgerOpen) return;
    const handler = (e) => {
      if (!burgerRef.current?.contains(e.target)) setBurgerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [burgerOpen]);

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

  // Track live temp/pressure so ParticleView can start in sync when toggled
  useEffect(() => {
    if (!bus) return;
    function onStateChanged(data) {
      lastSimStateRef.current = { temp: data.temp, pressure: data.pressure };
    }
    bus.on('stateChanged', onStateChanged);
    bus.emit('requestCurrentState');
    return () => bus.off('stateChanged', onStateChanged);
  }, [bus]);

  // Auto-select first challenge when entering a level
  useEffect(() => {
    if (!selectedLevel) return;
    const lvlChallenges = CHALLENGES.filter(c => c.levelId === selectedLevel.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveChallenge(lvlChallenges[0] ?? null);
  }, [selectedLevel?.id]);

  // Record completion exactly once per challenge
  const completionFiredRef = useRef(false);
  const completedIdsRef = useRef([]);
  useEffect(() => { completedIdsRef.current = completedIds; }, [completedIds]);

  useEffect(() => {
    if (!isComplete || !activeChallenge || completionFiredRef.current) return;
    if (completedIdsRef.current.includes(activeChallenge.id)) return;
    completionFiredRef.current = true;
    soundsRef.current?.playSuccess();
    /* eslint-disable react-hooks/set-state-in-effect */
    setCompletedIds(prev => [...new Set([...prev, activeChallenge.id])]);
    setShowSuccessModal(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    recordCompletion({
      challengeId: activeChallenge.id,
      score: 1,
      scoreUnit: 'completion',
    }).catch(() => {});
    const lastLevel = LEVELS[LEVELS.length - 1];
    const lastLevelChallenges = CHALLENGES.filter(c => c.levelId === lastLevel.id);
    const isLastOfAllLevels = lastLevelChallenges[lastLevelChallenges.length - 1]?.id === activeChallenge.id;
    if (isLastOfAllLevels) onProgressUpdate?.({ challengeId: activeChallenge.id });
  }, [isComplete]);

  useEffect(() => { completionFiredRef.current = false; }, [activeChallenge?.id]);

  // Create / destroy Phaser when level changes
  useEffect(() => {
    if (!selectedLevel) return;
    if (gameRef.current) return;

    const eventBus = createEventBus();
    busRef.current = eventBus;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setViewMode('object');
    setParticleSnapshot({ temp: 20, pressure: 1 });
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
      <div className="sq-sandbox-shell">
        {/* — Top bar — */}
        <div className="sq-sandbox-top">
          {/* Left: exit always visible; saved pill hidden on mobile */}
          <div className="sq-top-left">
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
            <span className="sq-pill sq-pill--teal sq-top-desktop-only" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sq-teal)' }} />
              Saved
            </span>
          </div>

          {/* Center: level title always; challenge subtitle hidden on mobile */}
          <div className="sq-top-center">
            <span style={{ fontFamily: 'var(--sq-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--sq-ink-1)', whiteSpace: 'nowrap' }}>
              Level {selectedLevel.number} — {selectedLevel.name}
            </span>
            {activeChallenge && (
              <span className="sq-top-desktop-only" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--sq-ink-4)', display: 'inline-block' }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: 'var(--sq-ink-3)' }}>{activeChallenge.title}</span>
              </span>
            )}
          </div>

          {/* Right: icon buttons on desktop, burger on mobile */}
          <div className="sq-top-right">
            {/* Desktop action buttons */}
            <div className="sq-top-actions">
              <button
                className="sq-icon-btn"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleDark}
              >
                {isDark ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
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
              <button className="sq-icon-btn" aria-label={muted ? 'Unmute music' : 'Mute music'} onClick={() => setMuted(m => !m)}>
                {muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile burger */}
            <div className="sq-top-burger-wrap" ref={burgerRef}>
              <button
                className="sq-icon-btn sq-top-burger"
                aria-label="More options"
                aria-expanded={burgerOpen}
                onClick={() => setBurgerOpen(o => !o)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 6h18M3 12h18M3 18h18"/>
                </svg>
              </button>
              {burgerOpen && (
                <div className="sq-top-burger-menu" role="menu">
                  <span className="sq-pill sq-pill--teal sq-burger-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sq-teal)' }} />
                    Saved
                  </span>
                  <button
                    className="sq-icon-btn sq-burger-item"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    onClick={() => { toggleDark(); setBurgerOpen(false); }}
                  >
                    {isDark ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    )}
                    <span className="sq-burger-label">{isDark ? 'Light mode' : 'Dark mode'}</span>
                  </button>
                  <button
                    className="sq-icon-btn sq-burger-item"
                    aria-label={paused ? 'Resume simulation' : 'Pause simulation'}
                    onClick={() => { paused ? handleResume() : handlePause(); setBurgerOpen(false); }}
                  >
                    {paused ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M6 4l14 8L6 20z"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    )}
                    <span className="sq-burger-label">{paused ? 'Resume' : 'Pause'}</span>
                  </button>
                  <button
                    className="sq-icon-btn sq-burger-item"
                    aria-label="Reset particles"
                    onClick={() => { handleReset(); setBurgerOpen(false); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>
                    </svg>
                    <span className="sq-burger-label">Reset</span>
                  </button>
                  <button
                    className="sq-icon-btn sq-burger-item"
                    aria-label="Take a screenshot"
                    onClick={() => { handleScreenshot(); setBurgerOpen(false); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>
                    </svg>
                    <span className="sq-burger-label">Screenshot</span>
                  </button>
                  <button
                    className="sq-icon-btn sq-burger-item"
                    aria-label={muted ? 'Unmute music' : 'Mute music'}
                    onClick={() => { setMuted(m => !m); setBurgerOpen(false); }}
                  >
                    {muted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                    )}
                    <span className="sq-burger-label">{muted ? 'Unmute' : 'Mute'}</span>
                  </button>
                </div>
              )}
            </div>
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
            levelChallenges={levelChallenges}
            completedIds={completedIds}
            onSelectChallenge={setActiveChallenge}
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

              {/* View toggle */}
              <button
                aria-pressed={viewMode === 'particle'}
                onClick={() => {
                  if (viewMode === 'object') {
                    setParticleSnapshot({ ...lastSimStateRef.current });
                  }
                  setViewMode(m => m === 'object' ? 'particle' : 'object');
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: viewMode === 'particle' ? 'var(--sq-orange)' : 'var(--sq-surface)',
                  border: viewMode === 'particle'
                    ? '1.5px solid var(--sq-orange-deep)'
                    : '1.5px solid var(--sq-border-color, rgba(0,0,0,0.12))',
                  color: viewMode === 'particle' ? 'white' : 'var(--sq-ink-2)',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--sq-font-ui, inherit)',
                  cursor: 'pointer',
                  minHeight: 32,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}
              >
                {/* atom icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="2"/>
                  <ellipse cx="12" cy="12" rx="9" ry="3.5"/>
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/>
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)"/>
                </svg>
                {viewMode === 'particle' ? 'Object View' : 'Particle View'}
              </button>

              {/* Object view overlay — always shown by default */}
              {viewMode === 'object' && (
                <ObjectView
                  bus={liveBus}
                  substanceId={selectedLevel.availableSubstances[0]}
                  initialTemp={particleSnapshot.temp}
                  initialPressure={particleSnapshot.pressure}
                />
              )}

              {/* Particle view overlay */}
              {viewMode === 'particle' && (
                <ParticleView
                  bus={liveBus}
                  substanceId={selectedLevel.availableSubstances[0]}
                  initialTemp={particleSnapshot.temp}
                  initialPressure={particleSnapshot.pressure}
                />
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
          className="sq-modal-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, animation: 'sq-modal-backdrop-in 0.2s ease both' }}
          onClick={handleResume}
        >
          <div
            className="sq-modal-card"
            style={{ background: 'var(--sq-surface)', borderRadius: 'var(--sq-radius-lg)', padding: '32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', minWidth: 220, animation: 'sq-modal-card-in 0.3s cubic-bezier(0.34,1.4,0.64,1) both' }}
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
          onClose={() => {
            setShowSuccessModal(false);
            if (!nextChallenge) setActiveChallenge(null);
          }}
          onNextChallenge={() => {
            setShowSuccessModal(false);
            setActiveChallenge(nextChallenge);
          }}
        />
      )}
    </>
  );
}
