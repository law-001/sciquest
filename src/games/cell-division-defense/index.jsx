import { useCallback, useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createEventBus } from '../_shared/eventBus';
import BootScene from './scenes/BootScene';
import CellDefenseScene from './scenes/CellDefenseScene';
import { UICanvas } from './ui/UICanvas';
import { MenuScreen } from './ui/MenuScreen';
import { MinigameOverlay } from './ui/MinigameOverlay';
import { ResultsScreen } from './ui/ResultsScreen';
import { LEVELS } from './data/levels';

const MONO = '"Courier New", Courier, monospace';

function RotatePrompt() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#0A1520',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, zIndex: 50, fontFamily: MONO,
    }}>
      <style>{`@keyframes cdd-rotate-phone{0%,100%{transform:rotate(0deg)}40%,60%{transform:rotate(90deg)}}`}</style>
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true"
        style={{ animation: 'cdd-rotate-phone 2.4s ease-in-out infinite' }}>
        <path d="M20 56 A28 28 0 0 1 56 20" stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4"/>
        <polyline points="54,12 56,20 48,22" stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="26" y="18" width="20" height="34" rx="3" stroke="white" strokeWidth="2" opacity="0.7"/>
        <circle cx="36" cy="47" r="2" fill="white" opacity="0.5"/>
      </svg>
      <p style={{ color: '#3BAFA9', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', margin: 0, textShadow: '0 0 12px #3BAFA9' }}>
        ROTATE YOUR DEVICE
      </p>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textAlign: 'center', maxWidth: 220, lineHeight: 1.6, margin: 0 }}>
        This game plays best in landscape mode
      </p>
    </div>
  );
}

export default function CellDivisionDefense({
  user: _user,
  profile: _profile,
  onExit,
  onProgressUpdate,
  initialChallengeId: _initialChallengeId,
  reducedMotion,
  deviceTier,
}) {
  const containerRef    = useRef(null);
  const gameRef         = useRef(null);
  const busRef          = useRef(null);
  const phaserCanvasRef = useRef(null);
  const selectedTowerRef = useRef(null);

  const [gameStarted,   setGameStarted]   = useState(false);
  const [isPortrait,    setIsPortrait]    = useState(() => window.innerHeight > window.innerWidth);
  const [hp,            setHp]            = useState(100);
  const [atp,           setAtp]           = useState(400);
  const [phase,         setPhase]         = useState('interphase');
  const [mutations,     setMutations]     = useState([]);
  const [wave,          setWave]          = useState(0);
  const [selectedTower, setSelectedTower] = useState(null);
  const [paused,           setPaused]           = useState(false);
  const [minigamePhase,    setMinigamePhase]    = useState(null);
  const [showResults,      setShowResults]      = useState(false);
  const [resultsData,      setResultsData]      = useState(null);
  const [nextWaveEnemies,  setNextWaveEnemies]  = useState([]);

  // Portrait detection
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    screen.orientation?.addEventListener('change', check);
    return () => {
      window.removeEventListener('resize', check);
      screen.orientation?.removeEventListener('change', check);
    };
  }, []);

  // Phaser game lifecycle
  useEffect(() => {
    if (!gameStarted || gameRef.current) return;

    const bus = createEventBus();
    busRef.current = bus;

    const fps = deviceTier === 'low' ? 30 : 60;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#0D1B2A',
      scene: [BootScene, CellDefenseScene],
      fps: { target: fps, forceSetTimeOut: deviceTier === 'low' },
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.NONE,
      },
    });

    game.bus = bus;
    gameRef.current = game;
    game.registry.set('reducedMotion', reducedMotion ?? false);
    game.registry.set('deviceTier', deviceTier ?? 'mid');

    // Grab Phaser's canvas once it appears so UICanvas can forward pointer events
    const observer = new MutationObserver(() => {
      const canvas = containerRef.current?.querySelector('canvas:not([data-ui-overlay])');
      if (canvas) {
        phaserCanvasRef.current = canvas;
        observer.disconnect();
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    function onStateChanged({ hp: h, atp: a, mutations: m, phase: p, wave: w }) {
      setHp(h);
      setAtp(a);
      setMutations(m ?? []);
      setPhase(p ?? 'interphase');
      setWave(w ?? 0);
    }

    function onRunComplete(payload) {
      setResultsData({
        stars:     payload.stars     ?? 0,
        mutations: payload.mutations ?? [],
        hpLeft:    payload.hpLeft    ?? 0,
        xpEarned:  payload.xpEarned  ?? 0,
      });
      setShowResults(true);
      onProgressUpdate?.(payload);
    }

    function onSlotClicked({ slotIndex, isEmpty }) {
      const towerId = selectedTowerRef.current;
      if (isEmpty && towerId) {
        bus.emit('placeTower', { towerId, slotIndex });
        selectedTowerRef.current = null;
        setSelectedTower(null);
      } else if (!isEmpty) {
        bus.emit('sellTower', { slotIndex });
      }
    }

    function onPhaseTransition({ fromPhase, toPhase }) {
      if (fromPhase === toPhase) {
        bus.emit('pause');
        setMinigamePhase(toPhase);
      }
    }

    function onWaveStarted({ enemies }) {
      setNextWaveEnemies(enemies ?? []);
    }

    function onWaveCleared() {
      setNextWaveEnemies([]);
    }

    bus.on('stateChanged',    onStateChanged);
    bus.on('runComplete',     onRunComplete);
    bus.on('towerSlotClicked', onSlotClicked);
    bus.on('phaseTransition', onPhaseTransition);
    bus.on('waveStarted',     onWaveStarted);
    bus.on('waveCleared',     onWaveCleared);

    return () => {
      observer.disconnect();
      bus.off('stateChanged',    onStateChanged);
      bus.off('runComplete',     onRunComplete);
      bus.off('towerSlotClicked', onSlotClicked);
      bus.off('phaseTransition', onPhaseTransition);
      bus.off('waveStarted',     onWaveStarted);
      bus.off('waveCleared',     onWaveCleared);
      gameRef.current?.destroy(true);
      gameRef.current      = null;
      busRef.current?.removeAll();
      busRef.current       = null;
      phaserCanvasRef.current = null;
    };
  }, [gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSelectTower(towerId) {
    const next = selectedTower === towerId ? null : towerId;
    selectedTowerRef.current = next;
    setSelectedTower(next);
    busRef.current?.emit('towerSelected', { towerId: next });
  }

  function handlePause() {
    setPaused(true);
    busRef.current?.emit('pause');
  }

  function handleResume() {
    setPaused(false);
    busRef.current?.emit('resume');
  }

  const handleMinigameComplete = useCallback(({ stars }) => {
    const ph = minigamePhase;
    setMinigamePhase(null);
    busRef.current?.emit('resume');
    busRef.current?.emit('minigameResult', { stars, phase: ph });
  }, [minigamePhase]);

  function handleReplay() {
    setShowResults(false);
    setResultsData(null);
    setMutations([]);
    setHp(100);
    setAtp(400);
    setWave(0);
    setPhase('interphase');
    setNextWaveEnemies([]);
    setSelectedTower(null);
    selectedTowerRef.current = null;
    gameRef.current?.destroy(true);
    gameRef.current      = null;
    busRef.current?.removeAll();
    busRef.current       = null;
    phaserCanvasRef.current = null;
    setGameStarted(false);
    setTimeout(() => setGameStarted(true), 50);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#0D1B2A', position: 'relative', overflow: 'hidden',
      fontFamily: MONO,
    }}>
      {/* Phaser mounts here — fills the full container */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Canvas UI overlay: HUD + shop panel + wave queue + mutation log */}
      {gameStarted && !showResults && (
        <UICanvas
          hp={hp}
          maxHp={100}
          atp={atp}
          phase={phase}
          wave={wave}
          totalWaves={5}
          mutations={mutations}
          nextWaveEnemies={nextWaveEnemies}
          waveCountdown={0}
          waveCountdownMax={0}
          selectedTower={selectedTower}
          paused={paused}
          onTowerSelect={handleSelectTower}
          onPause={paused ? handleResume : handlePause}
          onExit={onExit}
          phaserCanvasRef={phaserCanvasRef}
        />
      )}

      {/* Menu before game starts */}
      {!gameStarted && <MenuScreen onStart={() => setGameStarted(true)} onExit={onExit} />}

      {/* Landscape prompt */}
      {gameStarted && isPortrait && <RotatePrompt />}

      {/* Minigame overlay */}
      {gameStarted && minigamePhase && (
        <MinigameOverlay phase={minigamePhase} onComplete={handleMinigameComplete} />
      )}

      {/* Results screen */}
      {showResults && resultsData && (
        <ResultsScreen
          stars={resultsData.stars}
          mutations={resultsData.mutations}
          hpLeft={resultsData.hpLeft}
          xpEarned={resultsData.xpEarned}
          levelTitle={LEVELS[0]?.displayName}
          onReplay={handleReplay}
          onExit={onExit}
        />
      )}

      {/* Pause overlay */}
      {paused && !minigamePhase && (
        <div
          role="dialog" aria-modal="true" aria-label="Game paused"
          style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 20,
          }}
          onClick={handleResume}
        >
          <div
            style={{
              background: '#0D1B2A', border: '1.5px solid rgba(59,175,169,0.45)',
              borderRadius: 16, padding: '32px 48px', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 20,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ color: '#3BAFA9', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '0.15em', textShadow: '0 0 16px #3BAFA988' }}>
              PAUSED
            </p>
            <button
              onClick={handleResume}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 28px', borderRadius: 999,
                border: '1.5px solid #F97316', background: 'rgba(249,115,22,0.15)',
                color: '#F97316', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: MONO, minHeight: 44, letterSpacing: '0.1em',
              }}
            >
              ▶ RESUME
            </button>
            <button
              onClick={onExit}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', borderRadius: 999,
                border: '1.5px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: MONO, minHeight: 40,
              }}
            >
              ← EXIT TO HUB
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
