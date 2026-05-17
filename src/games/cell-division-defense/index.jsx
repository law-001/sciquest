import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createEventBus } from '../_shared/eventBus';
import BootScene from './scenes/BootScene';
import CellDefenseScene from './scenes/CellDefenseScene';
import { CellDefenseHUD } from './ui/CellDefenseHUD';
import { TowerPanel } from './ui/TowerPanel';
import { MenuScreen } from './ui/MenuScreen';
import { MinigameOverlay } from './ui/MinigameOverlay';
import { TOWERS } from './data/towers';

const MONO = '"Courier New", Courier, monospace';

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

      {/* Phone + rotation arc SVG */}
      <svg
        width="72" height="72" viewBox="0 0 72 72"
        fill="none" aria-hidden="true"
        style={{ animation: 'cdd-rotate-phone 2.4s ease-in-out infinite' }}
      >
        {/* Rotation arc */}
        <path
          d="M20 56 A28 28 0 0 1 56 20"
          stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="6 4"
        />
        {/* Arrow head */}
        <polyline points="54,12 56,20 48,22" stroke="#3BAFA9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Phone body */}
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
  const gameRef = useRef(null);
  const busRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth);
  const [hp, setHp] = useState(100);
  const [atp, setAtp] = useState(300);
  const [phase, setPhase] = useState('interphase');
  const [mutations, setMutations] = useState([]);
  const [wave, setWave] = useState(0);
  const [selectedTower, setSelectedTower] = useState(null);
  const selectedTowerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [minigamePhase, setMinigamePhase] = useState(null);

  // Portrait-mode detection
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', check);
    screen.orientation?.addEventListener('change', check);
    return () => {
      window.removeEventListener('resize', check);
      screen.orientation?.removeEventListener('change', check);
    };
  }, []);

  useEffect(() => {
    // Only initialise Phaser after the player clicks Start
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

    function handleRunComplete(payload) {
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

    // fromPhase === toPhase is the PhaseSystem signal to open the minigame overlay
    function onPhaseTransition({ fromPhase, toPhase }) {
      if (fromPhase === toPhase) {
        bus.emit('pause');
        setMinigamePhase(toPhase);
      }
    }

    bus.on('stateChanged', onStateChanged);
    bus.on('runComplete', handleRunComplete);
    bus.on('towerSlotClicked', onSlotClicked);
    bus.on('phaseTransition', onPhaseTransition);

    return () => {
      bus.off('stateChanged', onStateChanged);
      bus.off('runComplete', handleRunComplete);
      bus.off('towerSlotClicked', onSlotClicked);
      bus.off('phaseTransition', onPhaseTransition);
      gameRef.current?.destroy(true);
      gameRef.current = null;
      busRef.current?.removeAll();
      busRef.current = null;
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

  function handleMinigameComplete({ stars }) {
    const phase = minigamePhase;
    setMinigamePhase(null);
    busRef.current?.emit('resume');
    busRef.current?.emit('minigameResult', { stars, phase });
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
      {/* HUD — only visible once game is running */}
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

      {/* Main body — tower panel + canvas */}
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

        {/* Phaser mounts here — always in the DOM so the ref is ready */}
        <div
          ref={containerRef}
          style={{ flex: 1, minWidth: 0, minHeight: 0 }}
        />
      </div>

      {/* Menu overlay — shown before game starts */}
      {!gameStarted && (
        <MenuScreen
          onStart={() => setGameStarted(true)}
          onExit={onExit}
        />
      )}

      {/* Landscape prompt — shown when game is running in portrait */}
      {gameStarted && isPortrait && <RotatePrompt />}

      {/* Minigame overlay — shown after each wave clears */}
      {gameStarted && minigamePhase && (
        <MinigameOverlay
          phase={minigamePhase}
          onComplete={handleMinigameComplete}
        />
      )}

      {/* Pause overlay */}
      {paused && (
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
