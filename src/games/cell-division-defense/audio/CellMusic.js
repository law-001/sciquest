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
    this._waveNum = 0;
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

  setWaveIntensity(waveNum) {
    this._waveNum = Math.max(0, waveNum);
    if (this._master && this._ctx) {
      const gain = this._minigameMode ? 0.14 : Math.min(0.24, 0.10 + this._waveNum * 0.024);
      this._master.gain.setTargetAtTime(gain, this._ctx.currentTime, 0.6);
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

  playAttack() {
    if (!this._ctx || !this._master) return;
    if (this._ctx.state === 'suspended') this._ctx.resume();
    const ctx = this._ctx;
    const now = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 520;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gain);
    gain.connect(this._master);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playDeath(enemyType) {
    if (!this._ctx || !this._master) return;
    if (this._ctx.state === 'suspended') this._ctx.resume();
    const ctx = this._ctx;
    const now = ctx.currentTime;

    if (enemyType === 'viralHijacker') {
      // Melee: crunchy low thud — square wave growl descending
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.40);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.010);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(now);
      osc.stop(now + 0.44);
    } else if (enemyType === 'radiationPulse') {
      // Long range: sharp high-pitched zap — sine ping falling fast
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(now);
      osc.stop(now + 0.27);
      // Secondary crackle
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(900, now);
      osc2.frequency.exponentialRampToValueAtTime(300, now + 0.14);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.07, now + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc2.connect(gain2);
      gain2.connect(this._master);
      osc2.start(now);
      osc2.stop(now + 0.18);
    } else if (enemyType === 'toxinDroplet') {
      // Tank: deep bass rumble — triangle wave sub boom
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.58);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.020);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(now);
      osc.stop(now + 0.65);
    } else {
      // Generic fallback
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.28);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.10, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(now);
      osc.stop(now + 0.33);
    }
  }

  playMinigameFanfare() {
    if (!this._ctx || !this._master) return;
    if (this._ctx.state === 'suspended') this._ctx.resume();
    const ctx = this._ctx;
    const now = ctx.currentTime;
    const notes = [261.6, 329.6, 392.0, 523.2];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(t);
      osc.stop(t + 0.30);
    });
  }

  playVictory() {
    if (!this._ctx || !this._master) return;
    if (this._ctx.state === 'suspended') this._ctx.resume();
    const ctx = this._ctx;
    const now = ctx.currentTime;
    // Rising arpeggio C-E-G-C5-E5
    const arpNotes = [261.6, 329.6, 392.0, 523.2, 659.2];
    arpNotes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.11;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(t);
      osc.stop(t + 0.8);
    });
    // Sustained final chord C-E-G
    const chordStart = now + arpNotes.length * 0.11 + 0.08;
    [261.6, 329.6, 392.0].forEach((freq) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, chordStart);
      gain.gain.linearRampToValueAtTime(0.12, chordStart + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + 2.0);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(chordStart);
      osc.stop(chordStart + 2.1);
    });
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
    this._master.gain.value = 0.04;
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
    const interval = this._minigameMode
      ? 1000
      : Math.round(3000 - (Math.min(this._waveNum, 5) / 5) * 2100);

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
