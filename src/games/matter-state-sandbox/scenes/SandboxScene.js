import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';
import SubstanceDisplay from '../objects/SubstanceDisplay';
import { determineState } from '../physics/stateRules';
import { SUBSTANCES } from '../data/substances';

const BEAKER_STROKE = 4;
const BEAKER_FILL = 0xfaf7f2;
const BEAKER_BORDER = 0xc8b89a;
const BEAKER_RADIUS = 12;

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
    const W = this.scale.width;
    const H = this.scale.height;

    const bw = W * 0.6;
    const bh = H * 0.7;
    const bx = (W - bw) / 2;
    const by = (H - bh) / 2;

    const beaker = this.add.graphics();
    beaker.fillStyle(BEAKER_FILL, 1);
    beaker.fillRoundedRect(bx, by, bw, bh, BEAKER_RADIUS);
    beaker.lineStyle(BEAKER_STROKE, BEAKER_BORDER, 1);
    beaker.strokeRoundedRect(bx, by, bw, bh, BEAKER_RADIUS);

    const inset = BEAKER_STROKE + 2;
    this.containerBounds = {
      x: bx + inset,
      y: by + inset,
      width: bw - inset * 2,
      height: bh - inset * 2,
    };

    this.currentTemp = -10;
    this.currentPressure = 1;
    this.currentState = null;
    this.isTransitioning = false;
    this._pendingState = null;
    this.substanceDisplay = null;

    this._initSubstance(this.substanceId, false);
    this._setupBusListeners();
  }

  update(time) {
    if (this.currentState === 'liquid' && !this.isTransitioning) {
      this.substanceDisplay?.updateLiquidSurface(time);
    }
  }

  // ── Private helpers ───────────────────────────────────────────

  _initSubstance(substanceId, emitOnly = false) {
    if (!emitOnly) {
      this.substanceDisplay?.destroy();
      const substance = SUBSTANCES[substanceId];
      const initialState = determineState(substanceId, this.currentTemp, this.currentPressure);
      this.substanceDisplay = new SubstanceDisplay(
        this,
        substance,
        this.containerBounds,
        this.reducedMotion,
      );
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
      if (this.isTransitioning) return;
      this.currentTemp = value;
      const newState = determineState(this.substanceId, this.currentTemp, this.currentPressure);
      this._handleStateChange(newState);
    });

    this.bus.on('setPressure', (value) => {
      if (this.isTransitioning) return;
      this.currentPressure = value;
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

    // emitted by SubstanceDisplay when animation completes
    this.bus.on('transitionComplete', () => {
      if (this._pendingState !== null) {
        this.currentState = this._pendingState;
        this._pendingState = null;
      }
      this.isTransitioning = false;
      this.bus.emit('stateChanged', {
        state: this.currentState,
        substance: SUBSTANCES[this.substanceId],
        temp: this.currentTemp,
        pressure: this.currentPressure,
      });
    });
  }
}
