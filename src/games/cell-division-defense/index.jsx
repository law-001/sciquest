import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { createEventBus } from "../_shared/eventBus";
import BootScene from "./scenes/BootScene";
import CellDefenseScene from "./scenes/CellDefenseScene";
import { UICanvas } from "./ui/UICanvas";
import { MenuScreen } from "./ui/MenuScreen";
import { MinigameOverlay } from "./ui/MinigameOverlay";
import { ResultsScreen } from "./ui/ResultsScreen";
import { NotificationModal } from "./ui/NotificationModal";
import { CellSplitAnimation } from "./ui/CellSplitAnimation";
import { TutorialOverlay } from "./ui/TutorialOverlay";
import { CellMusic } from "./audio/CellMusic";
import { LEVELS } from "./data/levels";

const MONO = '"Courier New", Courier, monospace';

function RotatePrompt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0A1520",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        zIndex: 50,
        fontFamily: MONO,
      }}
    >
      <style>{`@keyframes cdd-rotate-phone{0%,100%{transform:rotate(0deg)}40%,60%{transform:rotate(90deg)}}`}</style>
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        aria-hidden="true"
        style={{ animation: "cdd-rotate-phone 2.4s ease-in-out infinite" }}
      >
        <path
          d="M20 56 A28 28 0 0 1 56 20"
          stroke="#3BAFA9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 4"
        />
        <polyline
          points="54,12 56,20 48,22"
          stroke="#3BAFA9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="26"
          y="18"
          width="20"
          height="34"
          rx="3"
          stroke="white"
          strokeWidth="2"
          opacity="0.7"
        />
        <circle cx="36" cy="47" r="2" fill="white" opacity="0.5" />
      </svg>
      <p
        style={{
          color: "#3BAFA9",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.18em",
          margin: 0,
          textShadow: "0 0 12px #3BAFA9",
        }}
      >
        ROTATE YOUR DEVICE
      </p>
      <p
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          textAlign: "center",
          maxWidth: 220,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
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
  const phaserCanvasRef = useRef(null);
  const selectedTowerRef = useRef(null);
  const cellMusicRef = useRef(null);

  // Flags used inside synchronous event-bus callbacks (can't rely on React state)
  const showCellSplitRef = useRef(false);
  const pendingResultsRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    () => window.innerHeight > window.innerWidth,
  );
  const [isTouchDevice] = useState(() => navigator.maxTouchPoints > 0);
  const [hp, setHp] = useState(100);
  const [atp, setAtp] = useState(400);
  const [phase, setPhase] = useState("interphase");
  const [mutations, setMutations] = useState([]);
  const [wave, setWave] = useState(0);
  const [selectedTower, setSelectedTower] = useState(null);
  const [paused, setPaused] = useState(false);
  const [minigamePhase, setMinigamePhase] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [nextWaveEnemies, setNextWaveEnemies] = useState([]);
  const [notification, setNotification] = useState(null); // { message, subtext, duration, onDone }
  const [waveActive, setWaveActive] = useState(false);
  const [showCellSplit, setShowCellSplit] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [waveWarningSeconds, setWaveWarningSeconds] = useState(0);

  // Portrait detection
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", check);
    screen.orientation?.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      screen.orientation?.removeEventListener("change", check);
    };
  }, []);

  // Music lifecycle — tied to gameStarted
  useEffect(() => {
    if (!gameStarted) return;
    const music = new CellMusic();
    cellMusicRef.current = music;
    setTimeout(() => music.start(), 200);
    return () => {
      music.destroy();
      cellMusicRef.current = null;
    };
  }, [gameStarted]);

  // Wave-warning countdown
  useEffect(() => {
    if (waveWarningSeconds <= 0) return;
    const id = setTimeout(
      () => setWaveWarningSeconds((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearTimeout(id);
  }, [waveWarningSeconds]);

  // Phaser game lifecycle
  useEffect(() => {
    if (!gameStarted || gameRef.current) return;

    const bus = createEventBus();
    busRef.current = bus;

    const fps = deviceTier === "low" ? 30 : 60;
    const initW = containerRef.current?.clientWidth || window.innerWidth;
    const initH = containerRef.current?.clientHeight || window.innerHeight;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: initW,
      height: initH,
      backgroundColor: "#0D1B2A",
      scene: [BootScene, CellDefenseScene],
      fps: { target: fps, forceSetTimeOut: deviceTier === "low" },
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.NONE,
      },
    });

    game.bus = bus;
    gameRef.current = game;
    game.registry.set("reducedMotion", reducedMotion ?? false);
    game.registry.set("deviceTier", deviceTier ?? "mid");

    // Grab Phaser's canvas once it appears so UICanvas can forward pointer events
    const observer = new MutationObserver(() => {
      const canvas = containerRef.current?.querySelector(
        "canvas:not([data-ui-overlay])",
      );
      if (canvas) {
        phaserCanvasRef.current = canvas;
        observer.disconnect();
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    function onStateChanged({
      hp: h,
      atp: a,
      mutations: m,
      phase: p,
      wave: w,
    }) {
      setHp(h);
      setAtp(a);
      setMutations(m ?? []);
      setPhase(p ?? "interphase");
      setWave(w ?? 0);
    }

    function onRunComplete(payload) {
      const results = {
        stars: payload.stars ?? 0,
        mutations: payload.mutations ?? [],
        hpLeft: payload.hpLeft ?? 0,
        xpEarned: payload.xpEarned ?? 0,
      };
      onProgressUpdate?.(payload);

      if (showCellSplitRef.current) {
        // Cell split animation is showing — hold results until it finishes
        pendingResultsRef.current = results;
        return;
      }
      setResultsData(results);
      setShowResults(true);
    }

    function onSlotClicked({ slotIndex, isEmpty }) {
      const towerId = selectedTowerRef.current;
      if (isEmpty && towerId) {
        bus.emit("placeTower", { towerId, slotIndex });
        selectedTowerRef.current = null;
        setSelectedTower(null);
      } else if (!isEmpty) {
        bus.emit("sellTower", { slotIndex });
      }
    }

    function onPhaseTransition({ fromPhase, toPhase }) {
      if (fromPhase === toPhase) {
        // Wave cleared — show pre-minigame notification, then open minigame
        bus.emit("pause");
        cellMusicRef.current?.setMinigameMode(true);
        cellMusicRef.current?.playMinigameFanfare();
        setWaveActive(false);
        setNotification({
          message: "What have you observed?",
          subtext: "Time for a mini-game!",
          duration: 3000,
          onDone: () => {
            setNotification(null);
            setMinigamePhase(toPhase);
          },
        });
      }
    }

    function onWaveStarted({ enemies, wave: w }) {
      setNextWaveEnemies(enemies ?? []);
      setWaveActive(true);
      setWaveWarningSeconds(0);
      setTutorialDone(true);
      cellMusicRef.current?.setWaveIntensity(w ?? 0);
    }

    function onWaveWarning({ seconds }) {
      setWaveWarningSeconds(seconds ?? 10);
    }

    function onSfx({ type, enemyType }) {
      const music = cellMusicRef.current;
      if (!music) return;
      if (type === "attack") music.playAttack();
      if (type === "death") music.playDeath(enemyType);
    }

    function onWaveCleared() {
      setNextWaveEnemies([]);
      // waveActive stays true until notification clears (handled in onPhaseTransition)
    }

    bus.on("stateChanged", onStateChanged);
    bus.on("runComplete", onRunComplete);
    bus.on("towerSlotClicked", onSlotClicked);
    bus.on("phaseTransition", onPhaseTransition);
    bus.on("waveStarted", onWaveStarted);
    bus.on("waveCleared", onWaveCleared);
    bus.on("waveWarning", onWaveWarning);
    bus.on("sfx", onSfx);

    return () => {
      observer.disconnect();
      bus.off("stateChanged", onStateChanged);
      bus.off("runComplete", onRunComplete);
      bus.off("towerSlotClicked", onSlotClicked);
      bus.off("phaseTransition", onPhaseTransition);
      bus.off("waveStarted", onWaveStarted);
      bus.off("waveCleared", onWaveCleared);
      bus.off("waveWarning", onWaveWarning);
      bus.off("sfx", onSfx);
      gameRef.current?.destroy(true);
      gameRef.current = null;
      busRef.current?.removeAll();
      busRef.current = null;
      phaserCanvasRef.current = null;
    };
  }, [gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSelectTower(towerId) {
    const next = selectedTower === towerId ? null : towerId;
    selectedTowerRef.current = next;
    setSelectedTower(next);
    busRef.current?.emit("towerSelected", { towerId: next });
  }

  function handleBusEmit(event, data) {
    busRef.current?.emit(event, data);
  }

  function handlePause() {
    setPaused(true);
    busRef.current?.emit("pause");
  }

  function handleResume() {
    setPaused(false);
    busRef.current?.emit("resume");
  }

  const handleMinigameComplete = useCallback(
    ({ stars }) => {
      const ph = minigamePhase;
      setMinigamePhase(null);
      cellMusicRef.current?.setMinigameMode(false);

      if (ph === "cytokinesis") {
        showCellSplitRef.current = true;
        busRef.current?.emit("minigameResult", { stars, phase: ph });
        cellMusicRef.current?.playVictory();
        setShowCellSplit(true);
        return;
      }

      // Emit result — PhaseSystem.advancePhase() runs synchronously, spawning next wave's enemies
      busRef.current?.emit("minigameResult", { stars, phase: ph });

      // Re-pause after advancePhase so newly spawned enemy tweens are also paused
      busRef.current?.emit("pause");

      // Show "back to defending" notification, then resume
      setNotification({
        message: "Back to defending!",
        subtext: "Protect the nucleus!",
        duration: 3000,
        onDone: () => {
          setNotification(null);
          setWaveActive(true);
          busRef.current?.emit("resume");
        },
      });
    },
    [minigamePhase],
  );

  const handleTutorialComplete = useCallback(() => {
    setTutorialDone(true);
    busRef.current?.emit('tutorialComplete');
    busRef.current?.emit('resume');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCellSplitComplete() {
    showCellSplitRef.current = false;
    setShowCellSplit(false);
    const results = pendingResultsRef.current;
    pendingResultsRef.current = null;
    if (results) {
      setResultsData(results);
      setShowResults(true);
    }
  }

  function handleReplay() {
    setShowResults(false);
    setResultsData(null);
    setMutations([]);
    setHp(100);
    setAtp(400);
    setWave(0);
    setPhase("interphase");
    setNextWaveEnemies([]);
    setSelectedTower(null);
    setNotification(null);
    setWaveActive(false);
    setShowCellSplit(false);
    showCellSplitRef.current = false;
    pendingResultsRef.current = null;
    selectedTowerRef.current = null;
    gameRef.current?.destroy(true);
    gameRef.current = null;
    busRef.current?.removeAll();
    busRef.current = null;
    phaserCanvasRef.current = null;
    setGameStarted(false);
    setTimeout(() => setGameStarted(true), 50);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0D1B2A",
        position: "relative",
        overflow: "hidden",
        fontFamily: MONO,
      }}
    >
      {/* Phaser mounts here — fills the full container */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, touchAction: "none" }}
      />

      {/* Canvas UI overlay: HUD + shop panel + wave queue + mutation log */}
      {gameStarted && !showResults && !showCellSplit && (
        <>
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
            waveActive={waveActive}
          />

          {/* Transparent hit targets for shop tower cards */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 56,
              bottom: 0,
              width: "max(200px, 18vw)",
              display: "flex",
              flexDirection: "column",
              padding: "40px 14px 30px",
              gap: 10,
              zIndex: 6,
              pointerEvents: "none",
            }}
          >
            {["lysosome", "proteinKinase", "repairEnzyme"].map((id) => (
              <button
                key={id}
                onClick={() => handleSelectTower(id)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                aria-label={`Select ${id}`}
              />
            ))}
          </div>

          {/* Transparent pause/resume hit target */}
          <button
            onClick={paused ? handleResume : handlePause}
            style={{
              position: "absolute",
              right: 20,
              top: 10,
              width: 36,
              height: 36,
              background: "transparent",
              border: "none",
              zIndex: 6,
              cursor: "pointer",
            }}
            aria-label={paused ? "Resume" : "Pause"}
          />
        </>
      )}

      {/* Zoom controls — touch devices only, visible during active gameplay */}
      {gameStarted &&
        isTouchDevice &&
        !showResults &&
        !showCellSplit &&
        !minigamePhase && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              zIndex: 7,
            }}
          >
            {[
              { label: "+", event: "cameraZoomIn", title: "Zoom in" },
              { label: "⊙", event: "cameraReset", title: "Reset view" },
              { label: "−", event: "cameraZoomOut", title: "Zoom out" },
            ].map(({ label, event, title }) => (
              <button
                key={event}
                title={title}
                aria-label={title}
                onClick={() => busRef.current?.emit(event)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(13,27,42,0.75)",
                  border: "1.5px solid rgba(59,175,169,0.55)",
                  color: "#3BAFA9",
                  fontSize: label === "⊙" ? 16 : 22,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

      {/* "Set up your defense" banner — shown after tutorial until first wave */}
      {gameStarted &&
        tutorialDone &&
        !waveActive &&
        !showResults &&
        !showCellSplit &&
        !minigamePhase &&
        !notification && (
          <div
            style={{
              position: "absolute",
              top: 64,
              left: "max(200px, 18vw)",
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              zIndex: 14,
              pointerEvents: "none",
              fontFamily: MONO,
            }}
          >
            <div
              style={{
                fontSize: "clamp(13px,2vw,18px)",
                fontWeight: 700,
                color: "#FFD700",
                letterSpacing: "0.18em",
                textShadow:
                  "0 0 18px rgba(255,215,0,0.7), 0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              ⚡ SET UP YOUR DEFENSE
            </div>
            {waveWarningSeconds > 0 && (
              <div
                style={{
                  fontSize: "clamp(10px,1.4vw,12px)",
                  color: "rgba(255,107,53,0.9)",
                  letterSpacing: "0.12em",
                  textShadow: "0 0 10px rgba(255,107,53,0.6)",
                }}
              >
                ENEMIES ARRIVE IN {waveWarningSeconds}s
              </div>
            )}
          </div>
        )}

      {/* Tutorial during interphase (first play only) */}
      {gameStarted &&
        !tutorialDone &&
        !showResults &&
        !showCellSplit &&
        !minigamePhase &&
        !notification && (
          <TutorialOverlay
            atp={atp}
            onBusEmit={handleBusEmit}
            onComplete={handleTutorialComplete}
          />
        )}

      {/* Menu before game starts */}
      {!gameStarted && (
        <MenuScreen onStart={() => setGameStarted(true)} onExit={onExit} />
      )}

      {/* Landscape prompt */}
      {gameStarted && isPortrait && <RotatePrompt />}

      {/* Pre/post minigame notification */}
      {notification && (
        <NotificationModal
          key={notification.message}
          message={notification.message}
          subtext={notification.subtext}
          duration={notification.duration ?? 3000}
          onDone={notification.onDone}
        />
      )}

      {/* Minigame overlay */}
      {gameStarted && minigamePhase && !notification && (
        <MinigameOverlay
          phase={minigamePhase}
          onComplete={handleMinigameComplete}
        />
      )}

      {/* Cell division animation after cytokinesis minigame */}
      {showCellSplit && (
        <CellSplitAnimation onComplete={handleCellSplitComplete} />
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
      {paused && !minigamePhase && !notification && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Game paused"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
          onClick={handleResume}
        >
          <div
            style={{
              background: "#0D1B2A",
              border: "1.5px solid rgba(59,175,169,0.45)",
              borderRadius: 16,
              padding: "32px 48px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                color: "#3BAFA9",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "0.15em",
                textShadow: "0 0 16px #3BAFA988",
              }}
            >
              PAUSED
            </p>
            <button
              onClick={handleResume}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 28px",
                borderRadius: 999,
                border: "1.5px solid #F97316",
                background: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: MONO,
                minHeight: 44,
                letterSpacing: "0.1em",
              }}
            >
              &#9654; RESUME
            </button>
            <button
              onClick={onExit}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: MONO,
                minHeight: 40,
              }}
            >
              &larr; EXIT TO HUB
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
