import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';
import SubstanceDisplay from '../objects/SubstanceDisplay';
import { determineState } from '../physics/stateRules';
import { SUBSTANCES } from '../data/substances';

export default class SandboxScene extends BaseGameScene {
  constructor() {
    super({ key: 'SandboxScene' });
  }

  init(data) {
    super.init();
    this.level = data?.level ?? 'level_1';
    this.substanceId = data?.substanceId ?? 'water';
    this.reducedMotion = data?.reducedMotion ?? false;
    this.deviceTier = data?.deviceTier ?? 'mid';
  }

  create() {
    this.currentTemp = -10;
    this.currentPressure = 1;
    this.currentState = null;
    this.isTransitioning = false;
    this._pendingState = null;
    this.substanceDisplay = null;

    this._initSubstance(this.substanceId, false);
    this._setupBusListeners();
  }

  update() {}

  // ── Private helpers ───────────────────────────────────────────

  _initSubstance(substanceId, emitOnly = false) {
    if (!emitOnly) {
      this.substanceDisplay?.destroy();
      const initialState = determineState(substanceId, this.currentTemp, this.currentPressure);
      this.substanceDisplay = new SubstanceDisplay(this);
      this.substanceDisplay.show(initialState);
      this.currentState = initialState;
    }

    this.bus.emit('stateChanged', {
      state: this.currentState,
      substance: SUBSTANCES[substanceId],
      temp: this.currentTemp,
      pressure: this.currentPressure,
    });
  }

  // Push the slider's value to the HUD immediately on every input, so the
  // readout never waits for a phase transition (or the rAF loop) to refresh.
  _emitReadout() {
    this.bus.emit('readout', {
      temp: this.currentTemp,
      pressure: this.currentPressure,
    });
  }

  _handleStateChange(newState) {
    if (newState === this.currentState) return;
    const fromState = this.currentState;
    this._pendingState = newState;
    this.isTransitioning = true;
    this.bus.emit('transitionStart', {
      fromState,
      toState: newState,
      substanceName: SUBSTANCES[this.substanceId].name,
    });
    this.substanceDisplay.transitionTo(newState);
  }

  _setupBusListeners() {
    this.bus.on('setTemperature', (value) => {
      // Keep tracking the slider even mid-transition; transitionComplete
      // re-evaluates against the latest value so the sim catches up.
      this.currentTemp = value;
      this._emitReadout();
      if (this.isTransitioning) return;
      const newState = determineState(this.substanceId, this.currentTemp, this.currentPressure);
      this._handleStateChange(newState);
    });

    this.bus.on('setPressure', (value) => {
      this.currentPressure = value;
      this._emitReadout();
      if (this.isTransitioning) return;
      const newState = determineState(this.substanceId, this.currentTemp, this.currentPressure);
      this._handleStateChange(newState);
    });

    this.bus.on('setSubstance', (substanceId) => {
      this.substanceDisplay?.destroy();
      this.substanceId = substanceId;
      this.currentTemp = -10;
      this.currentPressure = 1;
      this.isTransitioning = false;
      this._pendingState = null;
      this._initSubstance(substanceId);
    });

    this.bus.on('reset', () => {
      this.substanceDisplay?.destroy();
      this.currentTemp = -10;
      this.currentPressure = 1;
      this.isTransitioning = false;
      this._pendingState = null;
      this._initSubstance(this.substanceId);
    });

    this.bus.on('pauseGame', () => {
      this.tweens.pauseAll();
      if (this.physics?.world) this.physics.pause();
    });

    this.bus.on('resumeGame', () => {
      this.tweens.resumeAll();
      if (this.physics?.world) this.physics.resume();
    });

    this.bus.on('requestCurrentState', () => {
      if (this.currentState) {
        this.bus.emit('stateChanged', {
          state: this.currentState,
          substance: SUBSTANCES[this.substanceId],
          temp: this.currentTemp,
          pressure: this.currentPressure,
        });
      }
    });

    // Re-emit initial state for React listeners registered before this point
    if (this.currentState) {
      this.bus.emit('stateChanged', {
        state: this.currentState,
        substance: SUBSTANCES[this.substanceId],
        temp: this.currentTemp,
        pressure: this.currentPressure,
      });
    }

    // emitted by SubstanceDisplay when animation completes
    this.bus.on('transitionComplete', () => {
      if (this._pendingState !== null) {
        this.currentState = this._pendingState;
        this._pendingState = null;
      }
      this.isTransitioning = false;

      // The slider may have moved past more phase boundaries while this
      // animation was running — settle to wherever it actually is now.
      const settledState = determineState(this.substanceId, this.currentTemp, this.currentPressure);
      if (settledState !== this.currentState) {
        this._handleStateChange(settledState);
        return;
      }

      this.bus.emit('stateChanged', {
        state: this.currentState,
        substance: SUBSTANCES[this.substanceId],
        temp: this.currentTemp,
        pressure: this.currentPressure,
      });
    });
  }
}
