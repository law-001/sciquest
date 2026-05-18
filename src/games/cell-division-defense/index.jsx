import { useCallback, useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createEventBus } from '../_shared/eventBus';
import BootScene from './scenes/BootScene';
import CellDefenseScene from './scenes/CellDefenseScene';
import { CellDefenseHUD } from './ui/CellDefenseHUD';
import { TowerPanel } from './ui/TowerPanel';
import { MenuScreen } from './ui/MenuScreen';
import { MinigameOverlay } from './ui/MinigameOverlay';
import { WaveQueue } from './ui/WaveQueue';
import { MutationLog } from './ui/MutationLog';
import { MutationAlert } from './ui/MutationAlert';
import { ResultsScreen } from './ui/ResultsScreen';
import { SlotActionMenu } from './ui/SlotActionMenu';
import { CellMusic } from './audio/CellMusic';
import { TOWERS } from './data/towers';
import { LEVELS } from './data/levels';

const MONO = '"Courier New", Courier, monospace';
const WAVE_COUNTDOWN_MAX = 30;

function RotatePrompt() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#0A1520',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      zIndex: 50,
      fontFamily: MONO,
    }}>
      <style>{`
        @keyframes cdd-rotate-phone {
          0%,100% { transform: rotate(0deg);   }
          40%,60% { transform: rotate(90deg);  }
        }
      `}</style>

      <svg
        width="72" height="72" viewBox="0 0 72 72"
        fill="none" aria-hidden="true"
        style={{ animation: 'cdd-rotate-phone 2.4s ease-in-out infinite' }}
      >
        <path
          d="M20 56 A28 28 0 0 1 56 20"
          stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="6 4"
        />
        <polyline points="54,12 56,20 48,22" stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="26" y="18" width="20" height="34" rx="3" stroke="white" strokeWidth="2" opacity="0.7" />
        <circle cx="36" cy="47" r="2" fill="white" opacity="0.5" />
      </svg>

      <p style={{
        color: '#3BAFA9',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.18em',
        margin: 0,
        textShadow: '0 0 12px #3BAFA9',
      }}>
        ROTATE YOUR DEVICE
      </p>
      <p style={{
        color: 'rgba(255,255,255,0.45)',
        fontSize: 11,
        textAlign: 'center',
        maxWidth: 220,
        lineHeight: 1.6,
        margin: 0,
      }}>
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
  const containerRef = useRef(null);
  const gameRef      = useRef(null);
  const busRef       = useRef(null);
  const musicRef     = useRef(null);
  const selectedTowerRef = useRef(null);
  const waveTimerRef = useRef(null);

  const [gameStarted,  setGameStarted]  = useState(false);
  const [isPortrait,   setIsPortrait]   = useState(() => window.innerHeight > window.innerWidth);
  const [hp,           setHp]           = useState(100);
  const [atp,          setAtp]          = useState(300);
  const [phase,        setPhase]        = useState('interphase');
  const [mutations,    setMutations]    = useState([]);
  const [wave,         setWave]         = useState(0);
  const [selectedTower, setSelectedTower] = useState(null);
  const [paused,       setPaused]       = useState(false);
  const [minigamePhase, setMinigamePhase] = useState(null);

  // Step 12 state
  const [nextWaveEnemies,      setNextWaveEnemies]      = useState([]);
  const [waveCountdown,        setWaveCountdown]        = useState(0);
  const [currentMutationAlert, setCurrentMutationAlert] = useState(null);
  const [showResults,          setShowResults]          = useState(false);
  const [resultsData,          setResultsData]          = useState(null);

  // Step 14 state — occupied-slot action menu
  const [slotAction, setSlotAction] = useState(null); // { slotIndex, def, canvasX, canvasY }

  // ── Portrait detection ────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    screen.orientation?.addEventListener('change', check);
    return () => {
      window.removeEventListener('resize', check);
      screen.orientation?.removeEventListener('change', check);
    };
  }, []);

  // ── Phaser init ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameStarted) return;
    if (gameRef.current) return;

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

    function onStateChanged({ hp: h, atp: a, mutations: m, phase: p, wave: w }) {
      setHp(h);
      setAtp(a);
      setMutations(m ?? []);
      setPhase(p ?? 'interphase');
      setWave(w ?? 0);
    }

    function onWaveStarted({ enemies }) {
      // enemies = [{ type, count, interval }]
      const summary = enemies.map(e => ({ type: e.type, count: e.count }));
      setNextWaveEnemies(summary);
      setWaveCountdown(WAVE_COUNTDOWN_MAX);
      clearInterval(waveTimerRef.current);
      waveTimerRef.current = setInterval(() => {
        setWaveCountdown(c => {
          if (c <= 1) {
            clearInterval(waveTimerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }

    function onWaveCleared() {
      clearInterval(waveTimerRef.current);
      setNextWaveEnemies([]);
      setWaveCountdown(0);
    }

    function onMutationAdded({ mutation }) {
      setCurrentMutationAlert(mutation);
    }

    function onRunComplete(payload) {
      clearInterval(waveTimerRef.current);
      setNextWaveEnemies([]);
      setShowResults(true);
      setResultsData(payload);
      onProgressUpdate?.({
        ...payload,
        gameId: 'cell-division-defense',
        completedAt: new Date().toISOString(),
      });
    }

    function onSlotClicked({ slotIndex, isEmpty, towerId, canvasX, canvasY }) {
      const tower = selectedTowerRef.current;
      if (isEmpty && tower) {
        bus.emit('placeTower', { towerId: tower, slotIndex });
        selectedTowerRef.current = null;
        setSelectedTower(null);
        bus.emit('towerSelected', { towerId: null });
        setSlotAction(null);
      } else if (!isEmpty) {
        const def = towerId ? TOWERS[towerId] : null;
        setSlotAction({ slotIndex, def, canvasX, canvasY });
      }
    }

    function onPhaseTransition({ fromPhase, toPhase }) {
      if (fromPhase === toPhase) {
        bus.emit('pause');
        setMinigamePhase(toPhase);
      }
    }

    bus.on('stateChanged',    onStateChanged);
    bus.on('waveStarted',     onWaveStarted);
    bus.on('waveCleared',     onWaveCleared);
    bus.on('mutationAdded',   onMutationAdded);
    bus.on('runComplete',     onRunComplete);
    bus.on('towerSlotClicked', onSlotClicked);
    bus.on('phaseTransition', onPhaseTransition);

    return () => {
      clearInterval(waveTimerRef.current);
      bus.off('stateChanged',    onStateChanged);
      bus.off('waveStarted',     onWaveStarted);
      bus.off('waveCleared',     onWaveCleared);
      bus.off('mutationAdded',   onMutationAdded);
      bus.off('runComplete',     onRunComplete);
      bus.off('towerSlotClicked', onSlotClicked);
      bus.off('phaseTransition', onPhaseTransition);
      gameRef.current?.destroy(true);
      gameRef.current = null;
      busRef.current?.removeAll();
      busRef.current = null;
    };
  }, [gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Music (separate effect — runs after the bus is created) ──────────────
  useEffect(() => {
    if (!gameStarted) return;

    const music = new CellMusic();
    musicRef.current = music;
    music.start();

    const bus = busRef.current;
    if (!bus) return () => music.destroy();

    const onPhase = ({ fromPhase, toPhase }) => {
      if (fromPhase === toPhase) music.setMinigameMode(true);
    };
    const onResume = () => music.setMinigameMode(false);

    bus.on('phaseTransition', onPhase);
    bus.on('resume',          onResume);

    return () => {
      bus.off('phaseTransition', onPhase);
      bus.off('resume',          onResume);
      music.destroy();
      musicRef.current = null;
    };
  }, [gameStarted]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleSelectTower(towerId) {
    const next = selectedTower === towerId ? null : towerId;
    selectedTowerRef.current = next;
    setSelectedTower(next);
    setSlotAction(null);
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

  function handleMinigameComplete({ stars }) {
    const p = minigamePhase;
    setMinigamePhase(null);
    busRef.current?.emit('resume');
    busRef.current?.emit('minigameResult', { stars, phase: p });
  }

  const handleDismissAlert = useCallback(() => setCurrentMutationAlert(null), []);

  function handleSlotSell() {
    if (!slotAction) return;
    busRef.current?.emit('sellTower', { slotIndex: slotAction.slotIndex });
    setSlotAction(null);
  }

  function handleSlotUpgrade() {
    if (!slotAction) return;
    busRef.current?.emit('upgradeTower', { slotIndex: slotAction.slotIndex });
    setSlotAction(null);
  }

  function handleReplay() {
    setShowResults(false);
    setResultsData(null);
    setMutations([]);
    setHp(100);
    setAtp(LEVELS[0]?.startAtp ?? 300);
    setPhase('interphase');
    setWave(0);
    setNextWaveEnemies([]);
    setWaveCountdown(0);
    // Restart the Phaser game by destroying + re-creating via state toggle
    gameRef.current?.destroy(true);
    gameRef.current = null;
    busRef.current?.removeAll();
    busRef.current = null;
    // Trigger game re-init by momentarily leaving and re-entering started state
    setGameStarted(false);
    setTimeout(() => setGameStarted(true), 50);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0D1B2A',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: MONO,
      }}
    >
      {/* HUD */}
      {gameStarted && (
        <CellDefenseHUD
          hp={hp}
          atp={atp}
          phase={phase}
          mutations={mutations}
          wave={wave}
          totalWaves={5}
          paused={paused}
          onPause={paused ? handleResume : handlePause}
          onExit={onExit}
        />
      )}

      {/* Main body: tower panel + canvas */}
      <div style={{
        flex: 1,
        display: 'flex',
        paddingTop: gameStarted ? 56 : 0,
        minHeight: 0,
      }}>
        {gameStarted && (
          <TowerPanel
            towers={TOWERS}
            selectedTower={selectedTower}
            onSelect={handleSelectTower}
            atp={atp}
          />
        )}

        {/* Phaser canvas mount point */}
        <div
          ref={containerRef}
          style={{ flex: 1, minWidth: 0, minHeight: 0 }}
        />
      </div>

      {/* Right-side overlay: wave queue + mutation log */}
      {gameStarted && !showResults && (
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: 8,
            width: 138,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <WaveQueue
            nextWaveEnemies={nextWaveEnemies}
            waveCountdown={waveCountdown}
            waveCountdownMax={WAVE_COUNTDOWN_MAX}
            currentWave={wave}
            totalWaves={5}
          />
          <MutationLog mutations={mutations} />
        </div>
      )}

      {/* Mutation toast alert */}
      {gameStarted && currentMutationAlert && (
        <MutationAlert
          mutation={currentMutationAlert}
          onDismiss={handleDismissAlert}
        />
      )}

      {/* Occupied-slot action menu */}
      {gameStarted && slotAction && !showResults && (
        <SlotActionMenu
          canvasX={slotAction.canvasX}
          canvasY={slotAction.canvasY}
          slotDef={slotAction.def}
          atp={atp}
          onSell={handleSlotSell}
          onUpgrade={handleSlotUpgrade}
          onCancel={() => setSlotAction(null)}
        />
      )}

      {/* Menu overlay — before game starts */}
      {!gameStarted && (
        <MenuScreen
          onStart={() => setGameStarted(true)}
          onExit={onExit}
        />
      )}

      {/* Landscape prompt */}
      {gameStarted && isPortrait && <RotatePrompt />}

      {/* Minigame overlay */}
      {gameStarted && minigamePhase && (
        <MinigameOverlay
          phase={minigamePhase}
          onComplete={handleMinigameComplete}
        />
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
          role="dialog"
          aria-modal="true"
          aria-label="Game paused"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}
          onClick={handleResume}
        >
          <div
            style={{
              background: '#0D1B2A',
              border: '1.5px solid rgba(59,175,169,0.45)',
              borderRadius: 16,
              padding: '32px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{
              color: '#3BAFA9',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '0.15em',
              textShadow: '0 0 16px #3BAFA988',
            }}>
              PAUSED
            </p>

            <button
              onClick={handleResume}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 28px',
                borderRadius: 999,
                border: '1.5px solid #F97316',
                background: 'rgba(249,115,22,0.15)',
                color: '#F97316',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: MONO,
                minHeight: 44,
                letterSpacing: '0.1em',
              }}
            >
              ▶ RESUME
            </button>

            <button
              onClick={onExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 999,
                border: '1.5px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: MONO,
                minHeight: 40,
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
