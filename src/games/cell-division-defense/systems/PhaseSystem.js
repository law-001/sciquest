import { PHASES } from '../data/phases';
import { GAME_XP } from '../../config/xp.js';

const PHASE_ORDER = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
const INTERPHASE_DURATION = 30000;
const WAVE_MIN_DURATION   = 30000;

class PhaseSystem {
  constructor(scene, levelData, mutationSystem) {
    this.scene = scene;
    this.levelData = levelData;
    this.mutationSystem = mutationSystem;

    this.currentPhaseIndex = 0;
    // Timers use Phaser's scene clock (this.scene.time.delayedCall) so that
    // setting scene.time.paused = true (done by the pause handler) freezes
    // every wave/phase countdown while a modal is active.
    this._interphaseTimeout = null;
    this._preWaveTimeout    = null;
    this._waveMinTimeout    = null;
    this.waitingForMinigame = false;
    this._minigameResultHandler = null;
    this._tutorialCompleteHandler = null;
    this._waveStartTime = 0;
    this._waveCleared = false;
  }

  _cancelTimer(ev) {
    if (!ev) return;
    if (typeof ev.remove === 'function') ev.remove(false);
    else clearTimeout(ev);
  }

  start() {
    this.currentPhaseIndex = 0;
    this.scene.phase = PHASE_ORDER[0];
    this._emitState();

    // Tutorial emits 'tutorialComplete' to start immediately; fallback timer if skipped
    const onTutComplete = () => {
      this.scene.bus?.off('tutorialComplete', onTutComplete);
      this._tutorialCompleteHandler = null;
      this._cancelTimer(this._interphaseTimeout);
      this._interphaseTimeout = null;
      // 10-second countdown warning before first wave
      this.scene.bus?.emit('waveWarning', { seconds: 10 });
      this._preWaveTimeout = this.scene.time.delayedCall(10000, () => {
        this._preWaveTimeout = null;
        this.advancePhase();
      });
    };
    this._tutorialCompleteHandler = onTutComplete;
    this.scene.bus?.on('tutorialComplete', onTutComplete);

    this._interphaseTimeout = this.scene.time.delayedCall(INTERPHASE_DURATION, () => {
      this._interphaseTimeout = null;
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
      this._waveMinTimeout = this.scene.time.delayedCall(WAVE_MIN_DURATION, () => {
        this._waveMinTimeout = null;
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

    if (this._waveMinTimeout === null) {
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
    const xpTable = GAME_XP['cell-division-defense'].starsXp;

    this.scene.bus?.emit('runComplete', {
      stars,
      mutations: this.mutationSystem.getAll(),
      hpLeft: this.scene.hp,
      xpEarned: xpTable[stars] ?? 0,
      levelId: this.levelData?.id ?? null,
    });
  }

  destroy() {
    this._cancelTimer(this._interphaseTimeout);
    this._cancelTimer(this._preWaveTimeout);
    this._cancelTimer(this._waveMinTimeout);
    this._interphaseTimeout = null;
    this._preWaveTimeout    = null;
    this._waveMinTimeout    = null;
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
