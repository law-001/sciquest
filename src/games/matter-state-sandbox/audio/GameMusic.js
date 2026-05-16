// Web Audio API procedural music — pentatonic melody, seamless loop, ~120 BPM
// Handles suspended AudioContext (browser autoplay policy) gracefully.

const PENTATONIC = {
  G4:  392.00,
  A4:  440.00,
  C5:  523.25,
  D5:  587.33,
  E5:  659.25,
  G5:  783.99,
  A5:  880.00,
};

// 16-step melody (eighth notes). null = rest.
// Each entry: { freq, vol } or null.
const MELODY = [
  { freq: PENTATONIC.C5, vol: 0.18 },
  null,
  { freq: PENTATONIC.E5, vol: 0.15 },
  { freq: PENTATONIC.G5, vol: 0.20 },
  { freq: PENTATONIC.E5, vol: 0.14 },
  null,
  { freq: PENTATONIC.D5, vol: 0.16 },
  { freq: PENTATONIC.C5, vol: 0.14 },
  null,
  { freq: PENTATONIC.A4, vol: 0.15 },
  { freq: PENTATONIC.C5, vol: 0.16 },
  null,
  { freq: PENTATONIC.G4, vol: 0.13 },
  { freq: PENTATONIC.A4, vol: 0.15 },
  null,
  null,
];

// Counter-melody / harmony — plays a fifth below every 4 steps
const COUNTER = [
  { freq: PENTATONIC.G4, vol: 0.07 },
  null,
  null,
  null,
  { freq: PENTATONIC.A4, vol: 0.07 },
  null,
  null,
  null,
  { freq: PENTATONIC.G4, vol: 0.07 },
  null,
  null,
  null,
  { freq: PENTATONIC.C5, vol: 0.06 },
  null,
  null,
  null,
];

export class GameMusic {
  constructor() {
    this._ctx = null;
    this._master = null;
    this._muted = false;
    this._running = false;
    this._nextTime = 0;
    this._step = 0;
    this._timerId = null;
    this._stepSec = (60 / 120) * 0.5; // eighth note at 120 BPM = 0.25 s
  }

  start() {
    if (!this._ctx) this._setup();
    if (this._ctx.state === 'suspended') this._ctx.resume();
    if (this._running) return;
    this._running = true;
    this._nextTime = this._ctx.currentTime + 0.05;
    this._tick();
  }

  stop() {
    this._running = false;
    clearTimeout(this._timerId);
    this._timerId = null;
    if (this._master && this._ctx) {
      this._master.gain.setTargetAtTime(0, this._ctx.currentTime, 0.4);
    }
  }

  setMuted(muted) {
    this._muted = muted;
    if (this._master && this._ctx) {
      const target = muted ? 0 : 1;
      this._master.gain.setTargetAtTime(target, this._ctx.currentTime, 0.15);
    }
  }

  isMuted() { return this._muted; }

  destroy() {
    this.stop();
    setTimeout(() => {
      if (this._ctx) { this._ctx.close(); this._ctx = null; }
    }, 600);
  }

  // ── private ───────────────────────────────────────────────────────────────

  _setup() {
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Slight reverb via a convolver approximation (simple FIR impulse)
    const reverb = this._makeReverb(1.2, 2.5);

    const reverbGain = this._ctx.createGain();
    reverbGain.gain.value = 0.22;
    reverb.connect(reverbGain);
    reverbGain.connect(this._ctx.destination);

    this._master = this._ctx.createGain();
    this._master.gain.value = this._muted ? 0 : 1;
    this._master.connect(this._ctx.destination);
    this._master.connect(reverb);
  }

  _makeReverb(decaySec, durationSec) {
    const sampleRate = this._ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSec);
    const impulse = this._ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decaySec);
      }
    }
    const conv = this._ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  _tick() {
    const LOOKAHEAD = 0.12;
    while (this._nextTime < this._ctx.currentTime + LOOKAHEAD) {
      this._schedNote(MELODY[this._step], this._nextTime, 'triangle');
      this._schedNote(COUNTER[this._step], this._nextTime, 'sine');
      this._step = (this._step + 1) % MELODY.length;
      this._nextTime += this._stepSec;
    }
    if (this._running) {
      this._timerId = setTimeout(() => this._tick(), 30);
    }
  }

  _schedNote(note, time, type) {
    if (!note) return;
    const { freq, vol } = note;
    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + this._stepSec * 0.85);
    osc.connect(gain);
    gain.connect(this._master);
    osc.start(time);
    osc.stop(time + this._stepSec);
  }
}
