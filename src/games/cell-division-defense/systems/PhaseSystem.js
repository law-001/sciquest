import { PHASES } from '../data/phases';

const PHASE_ORDER = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
const INTERPHASE_DURATION = 30000;
const WAVE_MIN_DURATION   = 30000;

class PhaseSystem {
  constructor(scene, levelData, mutationSystem) {
    this.scene = scene;
    this.levelData = levelData;
    this.mutationSystem = mutationSystem;

    this.currentPhaseIndex = 0;
    this.interphaseTimer = null;
    this.waitingForMinigame = false;
    this._minigameResultHandler = null;
    this._tutorialCompleteHandler = null;
    this._preWaveTimer = null;
    this._waveStartTime = 0;
    this._waveMinTimer = null;
    this._waveCleared = false;
  }

  start() {
    this.currentPhaseIndex = 0;
    this.scene.phase = PHASE_ORDER[0];
    this._emitState();

    // Tutorial emits 'tutorialComplete' to start immediately; fallback timer if skipped
    const onTutComplete = () => {
      this.scene.bus?.off('tutorialComplete', onTutComplete);
      this._tutorialCompleteHandler = null;
      if (this.interphaseTimer) {
        this.interphaseTimer.remove();
        this.interphaseTimer = null;
      }
      // 10-second countdown warning before first wave
      this.scene.bus?.emit('waveWarning', { seconds: 10 });
      this._preWaveTimer = this.scene.time.delayedCall(10000, () => {
        this._preWaveTimer = null;
        this.advancePhase();
      });
    };
    this._tutorialCompleteHandler = onTutComplete;
    this.scene.bus?.on('tutorialComplete', onTutComplete);

    this.interphaseTimer = this.scene.time.delayedCall(INTERPHASE_DURATION, () => {
      if (this._tutorialCompleteHandler) {
        this.scene.bus?.off('tutorialComplete', this._tutorialCompleteHandler);
        this._tutorialCompleteHandler = null;
      }
      this.advancePhase();
    });
  }

  advancePhase() {
    this.currentPhaseIndex++;

    if (this.currentPhaseIndex >= PHASE_ORDER.length) {
      this.endRun();
      return;
    }

    const fromPhase = PHASE_ORDER[this.currentPhaseIndex - 1];
    const toPhase = PHASE_ORDER[this.currentPhaseIndex];

    this.scene.phase = toPhase;
    this._emitState();

    this.scene.bus?.emit('phaseTransition', { fromPhase, toPhase });

    const waveConfig = this.levelData?.waves?.[toPhase];
    if (waveConfig) {
      this.scene.wave++;
      this.scene._waveActive = true;
      this._waveCleared = false;
      this._waveStartTime = Date.now();

      const activeBreach = this.levelData?.breachCountByPhase?.[toPhase] ?? 3;

      this.scene.bus?.emit('waveStarted', {
        phase: toPhase,
        enemies: waveConfig,
        wave: this.scene.wave,
        totalWaves: 5,
        activeBreach,
      });
      this.scene.enemySystem?.spawnWave(waveConfig, activeBreach);
      this._emitState();

      // Enforce 30-second minimum wave: start timer now; fire minigame only after both
      // the minimum duration AND all enemies being cleared.
      this._waveMinTimer = this.scene.time.delayedCall(WAVE_MIN_DURATION, () => {
        this._waveMinTimer = null;
        if (this._waveCleared) {
          this._triggerMinigame(toPhase);
        }
        // If not cleared yet, onWaveCleared() will handle it
      });
    } else {
      this._triggerMinigame(toPhase);
    }
  }

  onWaveCleared() {
    this._waveCleared = true;
    const phase = PHASE_ORDER[this.currentPhaseIndex];

    if (this._waveMinTimer === null) {
      // Minimum time already elapsed — go straight to minigame
      this._triggerMinigame(phase);
    }
    // Otherwise wait for the minimum timer to finish
  }

  _triggerMinigame(phase) {
    const phaseDef = PHASES[phase];
    if (!phaseDef?.minigameId) {
      this.advancePhase();
      return;
    }

    this.waitingForMinigame = true;
    // Signal React to show the pre-minigame notification then pause + open minigame
    this.scene.bus?.emit('phaseTransition', { fromPhase: phase, toPhase: phase });

    // Manual once: unregister handler after first call
    const handler = ({ stars }) => {
      this.scene.bus?.off('minigameResult', handler);
      this._minigameResultHandler = null;
      this.waitingForMinigame = false;

      if (stars === 0) {
        const mutationId = phaseDef.mutationOnFail;
        if (mutationId) this.mutationSystem.addMutation(mutationId);
      } else if (stars >= 2) {
        this.scene.atp += stars === 3 ? 100 : 50;
        this._emitState();
      }

      this.advancePhase();
    };

    this._minigameResultHandler = handler;
    this.scene.bus?.on('minigameResult', handler);
  }

  endRun() {
    const stars = this.mutationSystem.getStarRating();
    const xpTable = [0, 40, 80, 120];

    this.scene.bus?.emit('runComplete', {
      stars,
      mutations: this.mutationSystem.getAll(),
      hpLeft: this.scene.hp,
      xpEarned: xpTable[stars] ?? 0,
      levelId: this.levelData?.id ?? null,
    });
  }

  destroy() {
    this.interphaseTimer?.remove();
    this._waveMinTimer?.remove();
    this._preWaveTimer?.remove();
    if (this._tutorialCompleteHandler) {
      this.scene.bus?.off('tutorialComplete', this._tutorialCompleteHandler);
      this._tutorialCompleteHandler = null;
    }
    if (this._minigameResultHandler) {
      this.scene.bus?.off('minigameResult', this._minigameResultHandler);
      this._minigameResultHandler = null;
    }
  }

  _emitState() {
    this.scene.bus?.emit('stateChanged', {
      hp:        this.scene.hp,
      atp:       this.scene.atp,
      mutations: this.scene.mutations,
      phase:     this.scene.phase,
      wave:      this.scene.wave,
    });
  }
}

export default PhaseSystem;
