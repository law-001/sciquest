// Procedural ambient drone — no audio files, all Web Audio API.
// Heartbeat pattern inspired by cellular ATP pulse rhythm.

export class CellMusic {
  constructor() {
    this._ctx = null;
    this._master = null;
    this._baseOsc = null;
    this._lfo = null;
    this._fifthOsc = null;
    this._heartbeatTimer = null;
    this._minigameMode = false;
    this._started = false;
  }

  start() {
    if (this._started) return;
    if (!this._ctx) this._setup();
    if (this._ctx.state === 'suspended') this._ctx.resume();
    this._started = true;
    this._scheduleHeartbeat();
  }

  stop() {
    this._started = false;
    clearTimeout(this._heartbeatTimer);
    this._heartbeatTimer = null;
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(0, this._ctx.currentTime, 0.4);
    }
  }

  setMinigameMode(on) {
    this._minigameMode = !!on;
    if (this._master && this._ctx) {
      // Slightly raise the master gain in minigame mode for urgency
      const gain = on ? 0.14 : 0.10;
      this._master.gain.setTargetAtTime(gain, this._ctx.currentTime, 0.3);
    }
    if (this._started) {
      clearTimeout(this._heartbeatTimer);
      this._heartbeatTimer = null;
      this._scheduleHeartbeat();
    }
  }

  setVolume(v) {
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(
        Math.max(0, Math.min(1, v)),
        this._ctx.currentTime,
        0.1,
      );
    }
  }

  destroy() {
    this.stop();
    setTimeout(() => {
      if (this._ctx) {
        this._ctx.close();
        this._ctx = null;
      }
    }, 650);
  }

  // ── private ───────────────────────────────────────────────────────────────

  _setup() {
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();

    this._master = this._ctx.createGain();
    this._master.gain.value = 0.10;
    this._master.connect(this._ctx.destination);

    // Base oscillator: sine, 55 Hz (A1)
    const baseGain = this._ctx.createGain();
    baseGain.gain.value = 0.08;

    this._baseOsc = this._ctx.createOscillator();
    this._baseOsc.type = 'sine';
    this._baseOsc.frequency.value = 55;
    this._baseOsc.connect(baseGain);
    baseGain.connect(this._master);
    this._baseOsc.start();

    // Slow LFO on base frequency: 0.08 Hz, ±4 Hz depth
    this._lfo = this._ctx.createOscillator();
    this._lfo.type = 'sine';
    this._lfo.frequency.value = 0.08;

    const lfoGain = this._ctx.createGain();
    lfoGain.gain.value = 4;
    this._lfo.connect(lfoGain);
    lfoGain.connect(this._baseOsc.frequency);
    this._lfo.start();

    // Second oscillator: sine, 82.5 Hz (E2, a perfect fifth above A1)
    const fifthGain = this._ctx.createGain();
    fifthGain.gain.value = 0.05;

    this._fifthOsc = this._ctx.createOscillator();
    this._fifthOsc.type = 'sine';
    this._fifthOsc.frequency.value = 82.5;
    this._fifthOsc.connect(fifthGain);
    fifthGain.connect(this._master);
    this._fifthOsc.start();
  }

  _scheduleHeartbeat() {
    if (!this._started || !this._ctx) return;

    const ctx = this._ctx;
    const now = ctx.currentTime;
    const interval = this._minigameMode ? 1000 : 3000;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 110; // A2

    // Attack 0.1 s → peak 0.12 → decay to near-zero over 1.5 s
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(gain);
    gain.connect(this._master);

    osc.start(now);
    osc.stop(now + 1.7);

    this._heartbeatTimer = setTimeout(
      () => this._scheduleHeartbeat(),
      interval,
    );
  }
}
