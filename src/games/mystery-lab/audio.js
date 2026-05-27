/* Mystery Lab — procedural audio engine (Web Audio API, no external files) */

let ctx = null;
let _muted = false;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Ambient state — one ambient loop at a time
let _ambient = null;

function tone(freq, dur, type = 'sine', vol = 0.2, delay = 0) {
  if (_muted) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t = ac.currentTime + delay;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch (_) {}
}

export const mlAudio = {
  // Soft UI click for button presses
  click() {
    tone(820, 0.07, 'sine', 0.10);
  },

  // Per-location map pin sounds
  mapPin(id) {
    switch (id) {
      case 'pondA':
        // Sick pond — low ominous burble
        tone(180, 0.14, 'sine', 0.12, 0);
        tone(140, 0.20, 'sine', 0.10, 0.12);
        break;
      case 'pondB':
        // Healthy pond — clear bright ripple
        tone(880, 0.09, 'sine', 0.11, 0);
        tone(1100, 0.07, 'sine', 0.09, 0.09);
        tone(880, 0.12, 'sine', 0.07, 0.17);
        break;
      case 'lab':
        // Lab tent — quick instrument beep
        tone(660, 0.07, 'square', 0.06, 0);
        tone(880, 0.09, 'square', 0.07, 0.08);
        break;
      case 'evidence':
        // Evidence board — cork pin thunk
        tone(420, 0.05, 'square', 0.13, 0);
        tone(290, 0.09, 'sine',   0.10, 0.04);
        break;
      default:
        this.click();
    }
  },

  // Hint chime — when map pulse moves to next suggested location
  mapPulse() {
    tone(784, 0.14, 'sine', 0.07, 0);
    tone(988, 0.20, 'sine', 0.09, 0.16);
  },

  // Subtle typewriter tick (call every N chars, not every char)
  tick() {
    tone(1300, 0.012, 'square', 0.025);
  },

  // Clue discovered — ascending chime C5 E5 G5
  discover() {
    tone(523, 0.20, 'sine', 0.18, 0);
    tone(659, 0.20, 'sine', 0.18, 0.09);
    tone(784, 0.30, 'sine', 0.22, 0.18);
  },

  // Lab test started — generic fallback
  lab() {
    tone(440, 0.10, 'square', 0.05, 0);
    tone(540, 0.10, 'square', 0.05, 0.11);
    tone(660, 0.13, 'square', 0.06, 0.22);
  },

  // Per-test sounds
  labTest(id) {
    switch (id) {
      case 'ph':
        // Acid drip — three descending liquid drops
        tone(900, 0.08, 'sine', 0.14, 0);
        tone(720, 0.08, 'sine', 0.14, 0.13);
        tone(560, 0.10, 'sine', 0.14, 0.26);
        break;

      case 'oxygen':
        // Bubbles rising — rapid ascending pops
        [320, 420, 540, 680, 860].forEach((f, i) =>
          tone(f, 0.06, 'sine', 0.10, i * 0.07)
        );
        break;

      case 'temp': {
        // Thermometer sweep — slow glide from cold to hot
        try {
          const ac = getCtx();
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, ac.currentTime);
          osc.frequency.linearRampToValueAtTime(740, ac.currentTime + 0.45);
          gain.gain.setValueAtTime(0.12, ac.currentTime);
          gain.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.48);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.50);
        } catch (_) {}
        break;
      }

      case 'pollution':
        // Industrial pulse — harsh square bursts
        tone(180, 0.12, 'sawtooth', 0.08, 0);
        tone(220, 0.12, 'sawtooth', 0.08, 0.15);
        tone(160, 0.16, 'square',   0.09, 0.30);
        break;

      case 'micro':
        // Microscope zoom — high clean ping
        tone(1760, 0.06, 'sine', 0.10, 0);
        tone(2093, 0.12, 'sine', 0.14, 0.07);
        tone(1760, 0.18, 'sine', 0.08, 0.22);
        break;

      default:
        this.lab();
    }
  },

  // Experiment result revealed — positive chime
  result() {
    tone(659, 0.18, 'sine', 0.16, 0);
    tone(784, 0.18, 'sine', 0.16, 0.10);
    tone(1047, 0.28, 'sine', 0.20, 0.20);
  },

  // Not enough energy / invalid action
  error() {
    tone(260, 0.15, 'square', 0.10, 0);
    tone(200, 0.22, 'square', 0.09, 0.14);
  },

  // Evidence clue placed correctly — reward arpeggio
  correct() {
    tone(523, 0.14, 'sine', 0.16, 0);
    tone(659, 0.14, 'sine', 0.16, 0.10);
    tone(784, 0.14, 'sine', 0.16, 0.20);
    tone(1047, 0.28, 'sine', 0.20, 0.30);
  },

  // Wrong clue selected — low descending buzz
  wrong() {
    tone(330, 0.22, 'square', 0.09, 0);
    tone(210, 0.30, 'square', 0.10, 0.16);
  },

  // Victory fanfare — full ascending run G4→C6
  victory() {
    const notes = [392, 523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, 0.38, 'sine', 0.20, i * 0.13));
  },

  // Map BGM — light pentatonic melody loop (G major pentatonic)
  startAmbient() {
    if (_ambient) return;
    try {
      const ac = getCtx();

      // Master gain — fades in over 2 s
      const masterGain = ac.createGain();
      masterGain.gain.setValueAtTime(0, ac.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.13, ac.currentTime + 2.0);
      masterGain.connect(ac.destination);

      // G major pentatonic: G4 A4 B4 D5 E5 G5
      // 0 = rest; 24 steps × 0.42 s = ~10 s loop
      const MELODY = [
        659, 0,   784, 659, 587, 0,   494, 0,
        440, 494, 0,   587, 659, 0,   587, 0,
        494, 440, 0,   392, 0,   440, 494, 0,
      ];
      const STEP = 0.42;
      let loopStart = ac.currentTime + 0.3;

      const schedule = () => {
        MELODY.forEach((freq, i) => {
          if (!freq) return;
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.connect(g);
          g.connect(masterGain);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t = loopStart + i * STEP;
          g.gain.setValueAtTime(1, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + STEP * 0.72);
          osc.start(t);
          osc.stop(t + STEP * 0.72 + 0.02);
        });
        loopStart += MELODY.length * STEP;
      };

      schedule();
      const timer = setInterval(schedule, MELODY.length * STEP * 1000);

      _ambient = { masterGain, timer };
    } catch (_) {}
  },

  stopAmbient() {
    if (!_ambient) return;
    const { masterGain, timer } = _ambient;
    _ambient = null;
    clearInterval(timer);
    try {
      const ac = getCtx();
      masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2);
      setTimeout(() => { try { masterGain.disconnect(); } catch (_) {} }, 1400);
    } catch (_) {}
  },

  setMuted(val) {
    _muted = val;
    if (_ambient?.masterGain) {
      try {
        const ac = getCtx();
        _ambient.masterGain.gain.cancelScheduledValues(ac.currentTime);
        _ambient.masterGain.gain.setValueAtTime(_ambient.masterGain.gain.value, ac.currentTime);
        _ambient.masterGain.gain.linearRampToValueAtTime(val ? 0 : 0.13, ac.currentTime + 0.15);
      } catch (_) {}
    }
  },

  isMuted() { return _muted; },

  // Screen navigation whoosh
  transition() {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ac.currentTime + 0.14);
      gain.gain.setValueAtTime(0.07, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.18);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.20);
    } catch (_) {}
  },
};
