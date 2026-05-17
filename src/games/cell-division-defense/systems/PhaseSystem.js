import { PHASES } from '../data/phases';

const PHASE_ORDER = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
const INTERPHASE_DURATION = 30000;

class PhaseSystem {
  constructor(scene, levelData, mutationSystem) {
    this.scene = scene;
    this.levelData = levelData;
    this.mutationSystem = mutationSystem;

    this.currentPhaseIndex = 0;
    this.interphaseTimer = null;
    this.waitingForMinigame = false;
    this._minigameResultHandler = null;
  }

  start() {
    this.currentPhaseIndex = 0;
    this.scene.phase = PHASE_ORDER[0];
    this._emitState();

    this.interphaseTimer = this.scene.time.delayedCall(INTERPHASE_DURATION, () => {
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
      this.scene.enemySystem?.spawnWave(waveConfig);
      this._emitState();
    } else {
      this._triggerMinigame(toPhase);
    }
  }

  onWaveCleared() {
    const phase = PHASE_ORDER[this.currentPhaseIndex];
    this._triggerMinigame(phase);
  }

  _triggerMinigame(phase) {
    const phaseDef = PHASES[phase];
    if (!phaseDef?.minigameId) {
      this.advancePhase();
      return;
    }

    this.waitingForMinigame = true;
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
