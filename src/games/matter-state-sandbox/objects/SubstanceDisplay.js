// Thin state machine — owns transition timing and emits transitionComplete on the bus.
// Visual rendering is handled by ObjectRenderer / ObjectView.

export default class SubstanceDisplay {
  constructor(scene) {
    this.scene = scene;
    this.currentState = null;
    this._timer = null;
    this._queuedState = null;
    this.isTransitioning = false;
  }

  show(state) {
    this.currentState = state;
  }

  transitionTo(newState) {
    if (newState === this.currentState && !this.isTransitioning) return;

    if (this.isTransitioning) {
      this._queuedState = newState;
      return;
    }

    this.isTransitioning = true;
    if (this._timer) { this._timer.remove(); this._timer = null; }

    this._timer = this.scene.time.delayedCall(1200, () => {
      this.currentState = newState;
      this.isTransitioning = false;
      this._timer = null;
      this.scene.bus.emit('transitionComplete');
      if (this._queuedState !== null) {
        const next = this._queuedState;
        this._queuedState = null;
        this.transitionTo(next);
      }
    });
  }

  destroy() {
    if (this._timer) { this._timer.remove(); this._timer = null; }
  }
}
