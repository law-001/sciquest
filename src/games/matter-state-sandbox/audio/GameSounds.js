// Procedural SFX using Web Audio API — one sound per state transition + success fanfare.
// Mirrors the AudioContext lifecycle pattern in GameMusic.js.

export class GameSounds {
  constructor() {
    this._ctx = null;
    this._master = null;
    this._muted = false;
  }

  setMuted(muted) {
    this._muted = muted;
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(muted ? 0 : 1, this._ctx.currentTime, 0.05);
    }
  }

  destroy() {
    setTimeout(() => {
      if (this._ctx) { this._ctx.close(); this._ctx = null; }
    }, 300);
  }

  playTransition(fromState, toState) {
    const key = `${fromState}->${toState}`;
    switch (key) {
      case 'solid->liquid':  this._playMelt();        break;
      case 'liquid->solid':  this._playFreeze();      break;
      case 'liquid->gas':    this._playEvaporate();   break;
      case 'gas->liquid':    this._playCondense();    break;
      case 'solid->gas':     this._playSublimation(); break;
      case 'gas->solid':     this._playDeposition();  break;
      default: break;
    }
  }

  playSuccess() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Ascending pentatonic arpeggio: C5 E5 G5 C6
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const s = t + i * 0.11;
      gain.gain.setValueAtTime(0, s);
      gain.gain.linearRampToValueAtTime(0.22, s + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.42);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(s);
      osc.stop(s + 0.45);
    });
  }

  playReset() {
    if (!this._ensureCtx()) return;
    this._noise(0.09, 400, 3200, 0.18);
  }

  // ── private ──────────────────────────────────────────────────────────────

  _ensureCtx() {
    try {
      if (!this._ctx) {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._master = this._ctx.createGain();
        this._master.gain.value = this._muted ? 0 : 1;
        this._master.connect(this._ctx.destination);
      }
      if (this._ctx.state === 'suspended') this._ctx.resume();
      return true;
    } catch { return false; }
  }

  _playFreeze() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Crystalline pings — descending to feel "cold settling in"
    [2200, 1800, 1500, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const s = t + i * 0.07;
      gain.gain.setValueAtTime(0, s);
      gain.gain.linearRampToValueAtTime(0.13, s + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.28);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(s);
      osc.stop(s + 0.32);
    });
    // Ice crackle
    this._noise(0.07, 3000, 9000, 0.28);
  }

  _playMelt() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Warm drip tones — frequency falls like a drop forming
    [480, 420, 360].forEach((baseFreq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const s = t + i * 0.17;
      osc.frequency.setValueAtTime(baseFreq * 1.35, s);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, s + 0.09);
      gain.gain.setValueAtTime(0.14, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.23);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(s);
      osc.stop(s + 0.26);
    });
  }

  _playEvaporate() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Rising steam hiss
    this._noise(0.14, 2000, 9000, 0.55);
    // Rising pitch sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.48);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.58);
    osc.connect(gain);
    gain.connect(this._master);
    osc.start(t);
    osc.stop(t + 0.62);
  }

  _playCondense() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Descending sweep (gas cooling)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.32);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    osc.connect(gain);
    gain.connect(this._master);
    osc.start(t);
    osc.stop(t + 0.46);
    // Soft splash noise
    this._noise(0.1, 400, 2200, 0.22);
  }

  _playSublimation() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Dramatic upward whoosh
    this._noise(0.18, 150, 9000, 0.65);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.52);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.11, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);
    osc.connect(gain);
    gain.connect(this._master);
    osc.start(t);
    osc.stop(t + 0.72);
  }

  _playDeposition() {
    if (!this._ensureCtx()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;
    // Cold crackle
    this._noise(0.09, 4000, 12000, 0.28);
    // Brief descending pings
    [1800, 2200, 1400].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const s = t + i * 0.07;
      gain.gain.setValueAtTime(0.09, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.22);
      osc.connect(gain);
      gain.connect(this._master);
      osc.start(s);
      osc.stop(s + 0.25);
    });
  }

  _noise(vol, freqLo, freqHi, duration) {
    const ctx = this._ctx;
    const t = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (freqLo + freqHi) / 2;
    filter.Q.value = (freqLo + freqHi) / Math.max(1, freqHi - freqLo);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this._master);
    src.start(t);
  }
}
