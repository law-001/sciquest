# Audio Design Document — Mystery Lab: The Dying Pond Mystery
**Version:** 1.0  
**Engine:** Web Audio API (procedural synthesis, no external files)  
**Platform:** Browser, React 19, pure Web Audio API  
**Home Key:** G major pentatonic  
**Mix Architecture:** 3 buses — SFX / Music / Ambient

---

## Table of Contents
1. [Audio Direction](#audio-direction)
2. [SFX Specification](#sfx-specification)
3. [Accessibility Requirements](#accessibility-requirements)
4. [Technical Architecture](#technical-architecture)
5. [Implementation Task List](#implementation-task-list)

---

## Audio Direction

### Sonic Identity
Mystery Lab sounds like a curious child's science kit crossed with a quiet nature documentary. The palette is acoustic-organic at its core — water, wind, living things — contaminated by sparse industrial intrusion that the player learns to recognize and distrust. Every UI sound earns its moment: nothing decorates, everything communicates. The synthesis is warm (sine and triangle dominance, soft attack envelopes) so the game never feels cold or clinical despite being a lab investigation. Dissonance is reserved exclusively for pollution-adjacent events; resolution always returns to the G major pentatonic home base.

### Emotional Arc

| Phase | Screens | Target Emotion | Audio Strategy |
|---|---|---|---|
| **Wonder** | Opening → Intro | Curiosity, invitation | Sparse, bright, wide stereo space. Single tones with long decay tails. No urgency. |
| **Exploration** | Map | Gentle suspense, agency | Ambient loop present but quiet. Map pins reward discovery. Silence between interactions. |
| **Investigation** | Observe (both ponds) | Contrast — hope vs dread | Pond B: lush layered nature textures. Pond A: thin, detuned, irregular. Audio tells the story before the data does. |
| **Precision** | Lab | Focus, procedural calm | Clean, minimal. Each test has its own tonal signature. No ambient loop competing. |
| **Revelation** | Evidence → Conclude | Building certainty | Evidence placements accumulate tension. The conclusion moment is the loudest emotional beat before victory. |
| **Resolution** | Victory | Joy, earned satisfaction | Full pentatonic flourish. All prior motifs resolve upward. Warm, full, unhurried. |

### Adaptive Music System: 4-Stem Architecture
One procedural 4-stem system layered on the G major pentatonic loop:

- **Stem A** — Harmonic foundation chord G3+D4+G4 (active on map/explore screens)
- **Stem B** — Existing pentatonic melody (`startAmbient()` loop)
- **Stem C** — Biological plucks E4/G4/A4/B4 (fades in near Pond B)
- **Stem D** — Industrial 55Hz sawtooth + detuned 415Hz sine (fades in near Pond A, silenced at victory)

### Zone Crossfade Rules
| Zone | Stems Active |
|---|---|
| Map (neutral) | A + B |
| Pond B (healthy) | A + B + C |
| Pond A (sick) | A + B (lowpass filtered) + D |
| Lab | D only (no melody) |
| Victory | None (fanfare takes over) |

### Mix Priority Order
1. `correct()`, `wrong()`, `error()` — learning feedback, always audible
2. `victory()` — plays once, most emotional
3. `result()`, `labTest()` — science moment
4. `discover()`, `evidenceReveal()` — narrative beats
5. `mapPin()`, `mapPulse()` — exploration rewards
6. `transition()`, `screenEnter()` — orientation
7. `click()`, `hypothesisSelect()`, `pageFlip()` — tactile UI
8. Ambient procedural (water, birds) — atmosphere
9. Music loop — always lowest in the mix

---

## SFX Specification

---

## Table of Contents
1. [Complete Audio Event List](#1-complete-audio-event-list)
2. [Ambient / Environmental Sound Specs](#2-ambient--environmental-sound-specs)
3. [Ducking Rules](#3-ducking-rules)
4. [Sound Categories Summary](#4-sound-categories-summary)
5. [Implementation Notes](#5-implementation-notes)

---

## 1. Complete Audio Event List

### Priority Scale
| Level | Meaning |
|-------|---------|
| 5 | Never masked — always audible (correct / wrong / victory) |
| 4 | High — momentary UI feedback, narrative beats |
| 3 | Normal — exploration, lab, navigation |
| 2 | Low — ambient supplemental, hover states |
| 1 | Background — continuous textures, drones |

---

### 1.1 Existing Events

#### `click()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Any generic button press (nav, skip, theme toggle, exit) |
| **Screen(s)** | All screens |
| **Oscillator** | Sine |
| **Frequency** | 820 Hz |
| **Envelope** | Attack 0 ms · Decay 70 ms · exponential ramp to 0 |
| **Volume (gain)** | 0.10 |
| **Duration** | 0.07 s |
| **Bus** | SFX |
| **Priority** | 4 |

---

#### `mapPin(id)`
Four sub-variants, each fired when the player clicks a map location pin.

**`mapPin('pondA')` — Sick Pond**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Click Pond A pin on map |
| **Screen** | map |
| **Oscillator** | Sine × 2 (sequential) |
| **Frequencies** | 180 Hz → 140 Hz |
| **Envelope** | Tone 1: 140 ms exp decay · Tone 2: 200 ms exp decay, 120 ms delay |
| **Volume** | 0.12 / 0.10 |
| **Duration** | 0.32 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Below G major pentatonic — deliberate tonal dissonance signalling pollution |

**`mapPin('pondB')` — Healthy Pond**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Click Pond B pin on map |
| **Screen** | map |
| **Oscillator** | Sine × 3 (sequential) |
| **Frequencies** | 880 Hz → 1100 Hz → 880 Hz |
| **Envelope** | 90 ms / 70 ms / 120 ms exp decays; delays 0 / 90 ms / 170 ms |
| **Volume** | 0.11 / 0.09 / 0.07 |
| **Duration** | 0.29 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | High, bright — tonal cluster that feels like water surface catching light |

**`mapPin('lab')` — Lab Tent**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Click Lab Tent pin on map |
| **Screen** | map |
| **Oscillator** | Square × 2 (sequential) |
| **Frequencies** | 660 Hz → 880 Hz |
| **Envelope** | 70 ms / 90 ms exp decays; delays 0 / 80 ms |
| **Volume** | 0.06 / 0.07 |
| **Duration** | 0.17 s total |
| **Bus** | SFX |
| **Priority** | 3 |

**`mapPin('evidence')` — Evidence Board**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Click Evidence Board pin on map |
| **Screen** | map |
| **Oscillator** | Square 420 Hz then Sine 290 Hz |
| **Envelope** | 50 ms square · 90 ms sine exp decay; 40 ms delay on second |
| **Volume** | 0.13 / 0.10 |
| **Duration** | 0.13 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Cork thunk — percussive attack from square, woody resonance from sine |

---

#### `mapPulse()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | `pulse` prop changes to a new location ID on the MapScreen (hint system advances) |
| **Screen** | map |
| **Oscillator** | Sine × 2 (sequential) |
| **Frequencies** | G5 (784 Hz) → B5 (988 Hz) |
| **Envelope** | 140 ms / 200 ms exp decays; 160 ms delay on second |
| **Volume** | 0.07 / 0.09 |
| **Duration** | 0.36 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | G→B is a G major 3rd — firmly in palette |

---

#### `tick()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Every 5th character during typewriter animation in IntroScreen |
| **Screen** | intro |
| **Oscillator** | Square |
| **Frequency** | 1300 Hz |
| **Envelope** | Immediate decay, 12 ms |
| **Volume** | 0.025 |
| **Duration** | 0.012 s |
| **Bus** | SFX |
| **Priority** | 2 |
| **Notes** | Sub-audible on its own; texture only. Never call every character. |

---

#### `discover()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player uncovers a new observation clue (ClueWrapper onClick, first time only) |
| **Screen** | observe |
| **Oscillator** | Sine × 3 (sequential) |
| **Frequencies** | C5 (523 Hz) → E5 (659 Hz) → G5 (784 Hz) |
| **Envelope** | 200 ms / 200 ms / 300 ms exp decays; delays 0 / 90 ms / 180 ms |
| **Volume** | 0.18 / 0.18 / 0.22 |
| **Duration** | 0.48 s total |
| **Bus** | SFX |
| **Priority** | 4 |
| **Notes** | C-E-G = G major triad. Ascending arc = revelation arc. |

---

#### `lab()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Lab screen entered without any experiment loaded; generic fallback for unknown `labTest(id)` |
| **Screen** | lab |
| **Oscillator** | Square × 3 (sequential) |
| **Frequencies** | 440 Hz → 540 Hz → 660 Hz |
| **Envelope** | 100 ms / 100 ms / 130 ms exp decays; delays 0 / 110 ms / 220 ms |
| **Volume** | 0.05 / 0.05 / 0.06 |
| **Duration** | 0.35 s total |
| **Bus** | SFX |
| **Priority** | 2 |

---

#### `labTest(id)`
Five sub-variants fired when the player starts a specific experiment.

**`labTest('ph')` — pH Acid Drip**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Run pH test button |
| **Oscillator** | Sine × 3 (sequential, descending) |
| **Frequencies** | 900 Hz → 720 Hz → 560 Hz |
| **Envelope** | 80 ms each exp decay; delays 0 / 130 ms / 260 ms |
| **Volume** | 0.14 each |
| **Duration** | 0.36 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Descending sine mimics liquid drops falling |

**`labTest('oxygen')` — Bubble Rise**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Run oxygen test button |
| **Oscillator** | Sine × 5 (sequential, ascending) |
| **Frequencies** | 320 → 420 → 540 → 680 → 860 Hz |
| **Envelope** | 60 ms each exp decay; 70 ms spacing |
| **Volume** | 0.10 each |
| **Duration** | 0.34 s total |
| **Bus** | SFX |
| **Priority** | 3 |

**`labTest('temp')` — Thermometer Sweep**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Run temperature test button |
| **Oscillator** | Sine, frequency glide (linearRamp) |
| **Frequencies** | 260 Hz → 740 Hz over 450 ms |
| **Envelope** | Gain 0.12 at start, linear ramp to 0 at 480 ms |
| **Volume** | 0.12 peak |
| **Duration** | 0.50 s total |
| **Bus** | SFX |
| **Priority** | 3 |

**`labTest('pollution')` — Industrial Pulse**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Run pollution test button |
| **Oscillator** | Sawtooth × 2, Square × 1 |
| **Frequencies** | 180 Hz saw · 220 Hz saw · 160 Hz square |
| **Envelope** | 120 ms / 120 ms / 160 ms exp decays; delays 0 / 150 ms / 300 ms |
| **Volume** | 0.08 / 0.08 / 0.09 |
| **Duration** | 0.46 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Only event that uses sawtooth. Dissonant register = intentional pollution signal. |

**`labTest('micro')` — Microscope Ping**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Run microscope test button |
| **Oscillator** | Sine × 3 (A-B-A shape) |
| **Frequencies** | 1760 Hz → 2093 Hz → 1760 Hz |
| **Envelope** | 60 ms / 120 ms / 180 ms exp decays; delays 0 / 70 ms / 220 ms |
| **Volume** | 0.10 / 0.14 / 0.08 |
| **Duration** | 0.40 s total |
| **Bus** | SFX |
| **Priority** | 3 |

---

#### `result()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Experiment result panel opens (reveals A vs B comparison) |
| **Screen** | lab |
| **Oscillator** | Sine × 3 (ascending) |
| **Frequencies** | E5 (659 Hz) → G5 (784 Hz) → C6 (1047 Hz) |
| **Envelope** | 180 ms / 180 ms / 280 ms exp decays; delays 0 / 100 ms / 200 ms |
| **Volume** | 0.16 / 0.16 / 0.20 |
| **Duration** | 0.48 s total |
| **Bus** | SFX |
| **Priority** | 4 |

---

#### `error()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player attempts action with insufficient energy (energy === 0) |
| **Screen** | lab |
| **Oscillator** | Square × 2 (descending) |
| **Frequencies** | 260 Hz → 200 Hz |
| **Envelope** | 150 ms / 220 ms exp decays; 140 ms delay on second |
| **Volume** | 0.10 / 0.09 |
| **Duration** | 0.36 s total |
| **Bus** | SFX |
| **Priority** | 4 |

---

#### `correct()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player selects the correct clue in EvidenceScreen story panel |
| **Screen** | evidence |
| **Oscillator** | Sine × 4 (ascending arpeggio) |
| **Frequencies** | C5 (523) → E5 (659) → G5 (784) → C6 (1047) Hz |
| **Envelope** | 140 ms / 140 ms / 140 ms / 280 ms exp decays; 100 ms spacing |
| **Volume** | 0.16 / 0.16 / 0.16 / 0.20 |
| **Duration** | 0.58 s total |
| **Bus** | SFX |
| **Priority** | 5 |
| **Notes** | Must always be audible. Ducks all other buses while playing. |

---

#### `wrong()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player selects a wrong/distractor clue in EvidenceScreen |
| **Screen** | evidence |
| **Oscillator** | Square × 2 (descending) |
| **Frequencies** | 330 Hz → 210 Hz |
| **Envelope** | 220 ms / 300 ms exp decays; 160 ms delay on second |
| **Volume** | 0.09 / 0.10 |
| **Duration** | 0.46 s total |
| **Bus** | SFX |
| **Priority** | 5 |
| **Notes** | Must always be audible. See ducking rules. |

---

#### `victory()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | `handleVictory` fires, screen transitions to "victory" |
| **Screen** | victory |
| **Oscillator** | Sine × 6 (ascending run) |
| **Frequencies** | G4 (392) → C5 (523) → E5 (659) → G5 (784) → C6 (1047) → E6 (1319) Hz |
| **Envelope** | 380 ms exp decay each; 130 ms spacing |
| **Volume** | 0.20 each |
| **Duration** | ~1.13 s total |
| **Bus** | SFX |
| **Priority** | 5 |
| **Notes** | Stops ambient. Music bus ducks fully before this fires. |

---

#### `startAmbient()` / `stopAmbient()`
| Parameter | Value |
|-----------|-------|
| **Trigger start** | OpeningScreen mount; MapScreen mount |
| **Trigger stop** | MapScreen unmount; victory |
| **Oscillator** | Sine, polyphonic melody loop |
| **Scale** | G major pentatonic: G4 A4 B4 D5 E5 G5 (392/440/494/587/659/784 Hz) |
| **Pattern** | 24-step melody, each step 420 ms, loop ~10.1 s |
| **Envelope** | Each note: immediate onset, exponential decay to silence at 72% of step length |
| **Master gain** | 0 → 0.13 linear ramp over 2.0 s (fade-in); 0.13 → 0 linear ramp over 1.2 s (fade-out) |
| **Duration** | Continuous loop |
| **Bus** | Music |
| **Priority** | 1 |

---

#### `transition()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Every `go(id)` call in index.jsx — all screen changes |
| **Screen** | All (during navigation) |
| **Oscillator** | Sine, frequency glide (exponentialRamp) |
| **Frequencies** | 320 Hz → 680 Hz |
| **Envelope** | Gain 0.07 at start, exponential decay to 0 at 180 ms |
| **Volume** | 0.07 peak |
| **Duration** | 0.20 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Whoosh direction (low→high) = forward movement. Do NOT play on back navigation. |

---

### 1.2 New Events

#### `pageFlip()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | NotebookScreen opens or closes (go("notebook") / go("map")) |
| **Screen** | notebook (enter and exit) |
| **Oscillator** | Triangle × 2 + noise burst |
| **Frequencies** | Triangle: 680 Hz (4 ms attack, 60 ms decay) · 520 Hz (3 ms attack, 80 ms decay, 30 ms delay) |
| **Noise** | White noise filtered through BiquadFilterNode (bandpass, center 1200 Hz, Q 0.8) — GainNode 0.04, 40 ms exp decay |
| **Volume** | 0.09 / 0.07 / 0.04 |
| **Duration** | 0.11 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Implementation** | `const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate); const data = buf.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;` Feed through bandpass BiquadFilterNode before GainNode. |
| **Notes** | Triangle is softer than square — paper feel without harsh click. |

---

#### `observeHover(pond)`
Two sub-variants. Fired on `mouseenter` / `touchstart` of a ClueWrapper button (not-yet-found clues only).

**`observeHover('A')` — Pond A (polluted zone)**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Hover/focus over undiscovered clue in Pond A observe scene |
| **Screen** | observe (pond === "A") |
| **Oscillator** | Sine |
| **Frequency** | 220 Hz |
| **Envelope** | 8 ms linear attack, 180 ms exponential decay |
| **Volume** | 0.04 |
| **Duration** | 0.19 s |
| **Bus** | SFX |
| **Priority** | 2 |
| **Notes** | Low, murky — below G major home to reinforce contamination. Soft enough to feel ambient. |

**`observeHover('B')` — Pond B (healthy zone)**
| Parameter | Value |
|-----------|-------|
| **Trigger** | Hover/focus over undiscovered clue in Pond B observe scene |
| **Screen** | observe (pond === "B") |
| **Oscillator** | Sine |
| **Frequency** | 880 Hz |
| **Envelope** | 6 ms linear attack, 120 ms exponential decay |
| **Volume** | 0.035 |
| **Duration** | 0.13 s |
| **Bus** | SFX |
| **Priority** | 2 |
| **Notes** | High, clean A5 — in pentatonic palette. Brief so it does not annoy on slow hover. |

---

#### `hypothesisSelect()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player clicks a hypothesis chip to select it on QuestionScreen |
| **Screen** | question |
| **Oscillator** | Sine × 2 (ascending 2-note pickup) |
| **Frequencies** | D5 (587 Hz) → G5 (784 Hz) |
| **Envelope** | Tone 1: 8 ms linear attack, 120 ms exp decay · Tone 2: 8 ms linear attack, 180 ms exp decay, 100 ms delay |
| **Volume** | 0.10 / 0.14 |
| **Duration** | 0.29 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | D→G = pentatonic scale step, rising = affirmation |

---

#### `hypothesisDeselect()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Player clicks an already-selected hypothesis chip to remove it |
| **Screen** | question |
| **Oscillator** | Sine × 2 (descending) |
| **Frequencies** | G5 (784 Hz) → D5 (587 Hz) |
| **Envelope** | Tone 1: 4 ms attack, 90 ms exp decay · Tone 2: 4 ms attack, 140 ms exp decay, 80 ms delay |
| **Volume** | 0.08 / 0.06 |
| **Duration** | 0.22 s total |
| **Bus** | SFX |
| **Priority** | 3 |
| **Notes** | Mirror of hypothesisSelect — descending = removal without harsh buzz |

---

#### `notebookWrite()`
| Parameter | Value |
|-----------|-------|
| **Trigger** | Any textarea `input` event in NotebookScreen (conclusion text field) — debounced, fire at most once per 80 ms |
| **Screen** | notebook |
| **Implementation** | Calls `tick()` twice with 35 ms offset: `tick(); setTimeout(() => tick(), 35);` |
| **Volume** | Inherits `tick()` gain (0.025 each) |
| **Duration** | 0.047 s total |
| **Bus** | SFX |
| **Priority** | 2 |
| **Notes** | Distinct from intro typewriter (that ticks every 5 chars automatically). This is player-driven writing. Cap at 1 burst per 80 ms to avoid saturation. |

---

#### `screenEnter(screenId)`
A grounding chord played ~200 ms after `transition()` completes — gives arrival confirmation.

| Parameter | Value |
|-----------|-------|
| **Trigger** | 200 ms after `go(id)` fires (setTimeout in each screen's `useEffect` on mount) |
| **Screen** | All non-opening/non-intro screens |
| **Oscillator** | Sine × 3 simultaneously (chord) |
| **Frequencies** | Per screen (see table below) |
| **Envelope** | Each oscillator: 15 ms linear attack, 600 ms exponential decay to silence |
| **Volume** | 0.05 each oscillator (summed peak ~0.13) |
| **Duration** | 0.62 s total |
| **Bus** | SFX |
| **Priority** | 3 |

**Per-screen chord frequencies:**

| Screen ID | Chord | Frequencies | Character |
|-----------|-------|-------------|-----------|
| `map` | G major | G3+D4+G4 (196 / 294 / 392 Hz) | Open, exploratory |
| `observe` (Pond A) | D minor 7 (no 3rd) | D3+A3+C4 (147 / 220 / 262 Hz) | Uneasy, low |
| `observe` (Pond B) | G major open | G3+B3+D4 (196 / 247 / 294 Hz) | Bright, natural |
| `question` | E minor | E3+B3+E4 (165 / 247 / 330 Hz) | Thoughtful tension |
| `notebook` | G major soft | G3+D4+G4 (196 / 294 / 392 Hz) | Settled, reflective |
| `lab` | A minor | A3+E4+A4 (220 / 330 / 440 Hz) | Clinical, focused |
| `evidence` | C major | C4+G4+C5 (262 / 392 / 523 Hz) | Building resolution |
| `conclude` | G major full | G3+B3+D4+G4 (196 / 247 / 294 / 392 Hz) | Confident resolution |
| `victory` | G major + 6th | G3+B3+D4+E5 (196 / 247 / 294 / 659 Hz) | Triumphant open |

---

#### `evidenceReveal()`
Narrative "aha" moment — fires when a story panel caption is revealed for the first time (after correct clue selection, before the next panel loads).

| Parameter | Value |
|-----------|-------|
| **Trigger** | Immediately after `correct()` finishes (~580 ms after correct clue click), on EvidenceScreen panel advance |
| **Screen** | evidence |
| **Oscillator** | Sine × 4 (delayed entry, sparkle texture) |
| **Frequencies** | E5 (659 Hz) · G5 (784 Hz) · B5 (988 Hz) · E6 (1319 Hz) |
| **Envelope** | All start simultaneously with staggered delays (0 / 60 ms / 130 ms / 210 ms); each: 10 ms attack, 400 ms exp decay |
| **Volume** | 0.14 / 0.12 / 0.10 / 0.08 (descending with pitch) |
| **Duration** | 0.62 s total |
| **Bus** | SFX |
| **Priority** | 4 |
| **Notes** | E-G-B-E = E minor arpeggio resolving upward. Complements `correct()` without repeating it. Fire via setTimeout 580 after `correct()`. |

---

## 2. Ambient / Environmental Sound Specs

All ambient sounds use Web Audio API nodes only. No AudioBuffer preloads from external files.

---

### 2.1 Four-Stem Adaptive Music System

All four stems share a single **Music bus** GainNode → `ac.destination`.

**Stem A — Harmonic Pad (always on during map/explore)**
```
Stem A: 3 simultaneous OscillatorNodes (sine), sustained with very slow amplitude LFO
  Frequencies:  G3 (196 Hz) · D4 (294 Hz) · G4 (392 Hz)
  Attack:        linearRamp 0 → 0.06 over 3.0 s
  Sustain gain:  0.06 each oscillator (summed ~0.16)
  LFO:           OscillatorNode (sine, 0.12 Hz) → GainNode (depth 0.015)
                 connected to each oscillator's GainNode.gain
  Active on:     map, observe (both ponds), notebook
  Inactive on:   lab, evidence, conclude, victory
  Fade in/out:   2.0 s linear ramp on Music bus gain
```

**Stem B — Pentatonic Melody (existing `startAmbient()` loop)**
```
  Already implemented (see Section 1.1 startAmbient entry)
  Active on:    opening, map
  Inactive on:  observe, question, notebook, lab, evidence, conclude, victory
  Transition:   stopAmbient() on screen leave — 1.2 s fade
```

**Stem C — Biological Plucks (near Pond B)**
```
  OscillatorNode (triangle wave — softer than square for pluck feel)
  Notes: E4 (330 Hz) · G4 (392 Hz) · A4 (440 Hz) · B4 (494 Hz)
  Pattern: random selection from note pool, one note every 1.2–2.4 s (random interval)
  Envelope per note: 5 ms linear attack, 300 ms exp decay
  Gain: 0.07 per note
  BiquadFilterNode: highpass, frequency 200 Hz, Q 1.0 — removes muddy low end
  Active on: observe screen when pond === "B"
  Fade in: 1.5 s linear ramp from 0 on screen enter
  Fade out: 1.0 s on screen leave
  Implementation: setInterval with random interval between 1200–2400 ms
```

**Stem D — Industrial Drone (near Pond A)**
```
  Layer 1: OscillatorNode (sawtooth), 55 Hz
    GainNode: 0.05 with very slow tremolo LFO (0.08 Hz sine, depth 0.02)
  Layer 2: OscillatorNode (sine), 415 Hz (detuned A4 — 25 cents flat of 440)
    GainNode: 0.03 with independent LFO (0.11 Hz sine, depth 0.01)
  BiquadFilterNode (lowpass, 800 Hz, Q 0.7) applied to sawtooth layer
  Active on: observe screen when pond === "A"
  Fade in: 2.0 s linear ramp from 0 on screen enter
  Fade out: 1.5 s on screen leave
  Implementation: separate nodes, stop() called on fade-out completion via setTimeout
```

---

### 2.2 Pond B Water Texture

```
Continuous pink noise loop using AudioBufferSourceNode (looping)
  Buffer: 2 seconds of noise generated in JS:
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0;
    for (let i = 0; i < data.length; i++) {
      // Paul Kellett pink noise approximation
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.11;
    }
  source.loop = true;
  BiquadFilterNode: bandpass, frequency 800 Hz, Q 2.0 — shapes to water gurgle range
  GainNode: 0.08
  Active on: observe screen when pond === "B"
  Fade in: 1.8 s · Fade out: 1.2 s
  Bus: Ambient
```

**Surface Drip Events** (layered on top of pink noise):
```
  setInterval fires every 1.8–3.5 s (random)
  Each drip: OscillatorNode (sine), 600–900 Hz random
  Envelope: 5 ms attack, 80 ms exp decay, gain 0.07
  Purpose: punctuate the continuous noise with distinct water-drop moments
```

---

### 2.3 Pond A Dead Texture

```
Layer 1 — Sparse pops:
  setInterval every 4–9 s (random)
  Each pop: OscillatorNode (square), 80–140 Hz random
  Envelope: 2 ms attack, 60 ms exp decay, gain 0.06
  BiquadFilterNode: lowpass 400 Hz — dull, not crisp
  Simulates: methane/decomposition gas bubbles breaking surface

Layer 2 — Industrial drone (Stem D — see above):
  Always on when pond === "A"

Layer 3 — High-frequency interference flutter:
  OscillatorNode (sawtooth), 3200 Hz
  GainNode: 0.01 (barely perceptible subliminal edge)
  LFO: 1.6 Hz sine → gain depth 0.008
  Purpose: creates mild psychoacoustic unease without conscious perception
  BiquadFilterNode: highpass 2800 Hz, Q 3.0

Bus: Ambient
Active on: observe screen when pond === "A"
Fade in: 2.5 s · Fade out: 2.0 s (longer fade = harder to let go)
```

---

### 2.4 Lab White Noise Floor

```
White noise:
  const buf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  source.loop = true;
  BiquadFilterNode: bandpass, frequency 2400 Hz, Q 4.0
    (targets HVAC/ventilation frequency range)
  GainNode: 0.03

Humm layer:
  OscillatorNode (sine), 60 Hz (electrical hum frequency)
  GainNode: 0.025
  Simulates: fluorescent lab equipment

Bus: Ambient
Active on: lab screen
Fade in: 1.0 s · Fade out: 0.8 s
```

---

### 2.5 Evidence Board G3 Drone Accumulation

Each correctly placed evidence panel adds one more voice to the drone, building narrative weight.

```
Base drone: OscillatorNode (sine), G3 (196 Hz), GainNode 0.04
  Starts when EvidenceScreen mounts.

After 1st correct clue: add D4 (294 Hz) sine, GainNode 0.035
After 2nd correct clue: add G4 (392 Hz) sine, GainNode 0.03
After 3rd correct clue: add B4 (494 Hz) sine, GainNode 0.025
After 4th correct clue: add D5 (587 Hz) sine, GainNode 0.02
After 5th correct clue (all panels done): ramp all voices up 40% gain
  over 1.5 s, then immediately call victory() and transition()

Each new voice fades in: 0.8 s linear ramp from 0
Bus: Ambient
Purpose: audible evidence accumulation — the chord fills out as the case closes
```

---

## 3. Ducking Rules

All ducking is implemented via GainNode automation on the Music or Ambient bus GainNode.

---

### Rule 1 — `correct()` / `wrong()` Duck
```
Trigger:    correct() OR wrong() fires
Duck bus:   Music + Ambient (both simultaneously)
Duck to:    20% of current gain (–80% = approx –14 dB)
Duck time:  30 ms (fast linear ramp — snap to duck, before sound plays)
Recovery:   600 ms linear ramp back to pre-duck gain
            Recovery starts immediately after duck completes (not after sound ends)
Reason:     Priority-5 events must be unmasked — hearing correct/wrong is
            critical gameplay feedback
```

---

### Rule 2 — `discover()` Duck
```
Trigger:    discover() fires
Duck bus:   Music only (ambient persists for environmental continuity)
Duck to:    55% of current gain (–45%)
Duck time:  50 ms linear ramp
Recovery:   400 ms linear ramp back to full
Reason:     Discovery is a narrative moment; melody should step back,
            not disappear
```

---

### Rule 3 — `evidenceReveal()` Duck
```
Trigger:    evidenceReveal() fires
Duck bus:   Ambient only
Duck to:    40% of current gain (–60%)
Duck time:  40 ms linear ramp
Recovery:   500 ms linear ramp back to full
Reason:     Aha sparkle sits above ambient texture; Music is already
            minimal in evidence screen
```

---

### Rule 4 — `victory()` Duck
```
Trigger:    victory() fires
Duck bus:   Music + Ambient
Duck to:    0% (full stop) — 800 ms linear ramp
Recovery:   None — victory fanfare and VictoryScreen have no ambient
Reason:     Victory is an absolute moment; all other audio ceases
```

---

### Rule 5 — `labTest(id)` Duck
```
Trigger:    labTest() or lab() fires
Duck bus:   Ambient (lab white noise floor only)
Duck to:    60% of current gain (–40%)
Duck time:  80 ms linear ramp
Recovery:   350 ms linear ramp
Reason:     Lab SFX and lab ambient occupy overlapping frequency ranges;
            light duck prevents muddiness
```

---

### Rule 6 — `screenEnter()` Duck
```
Trigger:    screenEnter() fires (arrival chord)
Duck bus:   Ambient only
Duck to:    70% of current gain (–30%)
Duck time:  100 ms linear ramp
Recovery:   700 ms linear ramp (longer — ambient returns slowly as you settle)
Reason:     Arrival chord needs slight space; ambient texture must not
            compete with the tuned chord
```

---

## 4. Sound Categories Summary

| Category | Events | Count |
|----------|--------|-------|
| **UI Feedback** | `click`, `error`, `tick`, `notebookWrite`, `hypothesisSelect`, `hypothesisDeselect`, `pageFlip` | 7 |
| **Navigation** | `transition`, `screenEnter`, `mapPin` (×4 variants), `mapPulse` | 7 |
| **Investigation / Exploration** | `observeHover` (×2 variants), `discover` | 3 |
| **Lab Science** | `lab`, `labTest` (×5 variants), `result` | 7 |
| **Narrative / Story** | `correct`, `wrong`, `victory`, `evidenceReveal` | 4 |
| **Music / Ambient** | `startAmbient`, `stopAmbient`, Stem A, Stem B, Stem C, Stem D, Pond B water texture, Pond A dead texture, Lab noise floor, Evidence drone | 10 |
| **TOTAL** | | **38** |

---

## 5. Implementation Notes

### Bus Architecture (Web Audio API)
```js
const sfxBus     = ctx.createGain();  // master SFX bus
const musicBus   = ctx.createGain();  // master Music bus
const ambientBus = ctx.createGain();  // master Ambient bus

sfxBus.connect(ctx.destination);
musicBus.connect(ctx.destination);
ambientBus.connect(ctx.destination);

// Initial gains
sfxBus.gain.value     = 1.0;
musicBus.gain.value   = 1.0;
ambientBus.gain.value = 1.0;
```

All existing `tone()` helper calls connect directly to `ctx.destination` — they must be rerouted to `sfxBus`. Recommend refactoring `tone()` to accept an optional `outputNode` param, defaulting to `sfxBus`.

### Reduced Motion
When `reducedMotion === true` is passed to `MysteryLab`:
- Suppress all ambient stem fades (set gain directly, no ramps)
- Skip `observeHover()` entirely (hover feedback only)
- All other SFX continue (they carry gameplay information)

### Context Resume
The existing `getCtx()` already calls `ctx.resume()` on each use — this is correct. Do not change it.

### iOS Safari
`AudioContext` must be created inside a user gesture handler. The existing lazy init in `getCtx()` (called from click/tap handlers) handles this correctly.

### Accessibility
- `correct()` and `wrong()` carry critical gameplay information (right/wrong answer). These must have visual fallbacks: the existing shake animation and color change on the EvidenceScreen clue card serve as the visual alternative.
- `discover()` has a visual fallback: the teal check badge appears on the ClueWrapper simultaneously.
- `error()` has a visual fallback: the energy counter visual feedback (existing UI).
- `observeHover()` is purely supplemental — no gameplay info conveyed — no visual fallback required.
- `victory()` has full visual fallback via VictoryScreen star display.

### Memory Budget
All synthesis is procedural (no AudioBuffer except pink/white noise). Noise buffers:
- Pond B pink noise: 1 ch × 2 s × 44100 Hz × 4 bytes = ~352 KB
- Lab white noise: 1 ch × 1 s × 44100 Hz × 4 bytes = ~176 KB
- **Total audio memory budget: < 600 KB**

---

---

## Accessibility Requirements

### Critical Events Audit

| Event | Gameplay-Critical? | Visual Exists? | Status |
|---|---|---|---|
| `error()` | Yes — player can't know why test failed | **No visual output** | ❌ FAIL |
| `correct()` | Yes | Bounce-in animation + progress bar (no ARIA live) | ⚠ Screen reader gap |
| `wrong()` | Yes | Shake animation + mentor text (no ARIA live) | ⚠ Screen reader gap |
| `result()` | Yes | ResultCard renders but no live region | ⚠ Screen reader gap |
| `discover()` | Yes | Teal checkmark + popup (popup is ephemeral) | ⚠ ARIA needed |
| `hypothesisSelect()` | Yes | Orange badge (no `aria-pressed`) | ⚠ State not announced |
| `mapPulse()` | Yes (hint system) | Pulsing ring animation on target MapPin | ✅ |
| `victory()` | No | Full VictoryScreen | ✅ |
| All others | No | Visual equivalents exist | ✅ |

### P0 — Blocks Gameplay for Hearing-Impaired Users

**1. `error()` — No visual output**
- Component: `LabScreen` (`screens-c.jsx`)
- Add: dismissable toast `<div role="alert">` anchored below energy chip
- Text: "Not enough test points" / "Already completed"
- Duration: auto-dismiss after 2500ms
- Also: add `aria-disabled="true"` + `title` on test button when energy = 0

**2. Audio mute control**
- Component: `HUD` (`shared.jsx`)
- Add mute/unmute button with `aria-label="Mute game sounds"` / `"Unmute game sounds"`
- Persist via `localStorage` key `"sciquest-audio-muted"`
- Props: `isMuted` + `onToggleMute` following existing `isDark`/`onToggleTheme` pattern

### P1 — Screen Reader Failures

**3.** Add `aria-live="polite"` to Evidence Board mentor `<p>` (`screens-d.jsx`)  
**4.** Add `role="status" aria-live="polite"` to `MiniGameResults` container (`screens-c.jsx`)  
**5.** Add `aria-pressed={picked}` to hypothesis buttons (`screens-b.jsx`)  
**6.** Add `aria-label` to map pin `<button>` elements using `label + desc`  
**7.** Add `aria-label` to mini-game close buttons (currently icon-only)

### Zone Audio Ecological Concerns

The Pond A / Pond B audio contrast (ominous vs bright) is atmospheric reinforcement only — it is **not** the sole carrier of ecological meaning. The visual map already shows dead trees, mud, "Sick pond" label, dead fish, dead flowers. Verdict: acceptable. The industrial drone (55Hz, subliminal) must never be referenced in game text as the primary health indicator.

Recommendation: increase prominence of the "Sick pond" `desc` label in `MapPin` — add a red "SICK" badge alongside the location name.

### Audio Sensitivity Concerns

| Event | Concern | Mitigation |
|---|---|---|
| `victory()` | 6 simultaneous tones at 0.20 — additive sum ~0.70 pre-clipping | Add master `DynamicsCompressorNode`; add 20ms attack |
| `correct()` | Abrupt onset | 20ms attack envelope |
| `error()` / `wrong()` | Square wave harsh on auditory-sensitive users | Switch to `triangle` waveform; reduce gain to 0.07 |
| `labTest('micro')` | 1760–2093Hz peaks at 0.14 | Cap at 0.09; add 15ms attack |
| `tick()` | Rapid repetitive 1300Hz square | Throttle to every 8 chars (currently 5); already at low vol |

### `prefers-reduced-motion` — FAIL
The `reducedMotion` prop is received but aliased to `_reducedMotion` (unused) in `index.jsx`. Must be wired to suppress CSS animations (`ml-shimmer`, `ml-pulse-ring`, `bounce-in`, `confetti-fall`) and suppress audio auto-play for ambient stems.

### Accessibility Checklist

| Criterion | Status |
|---|---|
| No gameplay state communicated by audio alone | ❌ `error()` has no visual |
| All feedback events have visual equivalents | ⚠ Partial (sighted OK; screen readers fail) |
| All interactive elements keyboard-accessible | ⚠ Map pins and mini-game close missing labels |
| Audio can be disabled without breaking gameplay | ❌ No mute control |
| Screen reader compatible (ARIA live regions) | ❌ Missing on error, result, correct, wrong |
| No events exceed safe volume levels | ⚠ `victory()` additive clipping risk |
| `prefers-reduced-motion` respected | ❌ Not wired |
| Color never the sole indicator | ✅ All states use icon + color |
| Tap targets ≥ 44px | ⚠ Mini-game close is 36px |

---

## Technical Architecture

### Bus Node Graph
```
SFX sources    → sfxBus (GainNode, gain 1.0)    ─┐
Music stems    → musicBus (GainNode, gain 0.75)  ─┤→ masterBus → DynamicsCompressor → ctx.destination
Ambient srcs   → ambientBus (GainNode, gain 0.65) ─┘
```

**DynamicsCompressorNode config:** threshold −3dB, knee 0, ratio 20:1, attack 1ms, release 50ms. Prevents additive clipping on `victory()`.

### Module-Level State (after refactor)
```js
let ctx           = null;  // AudioContext singleton
let buses         = null;  // { sfxBus, musicBus, ambientBus, masterBus, limiter }
let _stems        = { A: null, B: null, C: null, D: null };
let _stemBFilter  = null;  // BiquadFilterNode on Stem B in pondA zone
let _noiseBuffers = null;  // { white, pink } — generated once at init
let _waterLoop    = null;  // AudioBufferSourceNode ref for continuous water texture
let _muted        = false;
```

### Stem Lifecycle
| Screen | Action |
|---|---|
| `map` mounts | `startStemA()`, `startAmbient()` (Stem B) |
| `map` unmounts | `stopStemA()`, `stopAmbient()` |
| `observe` pond=A | `setZone('pondA')` → Stem D in, Stem C out, lowpass on B |
| `observe` pond=B | `setZone('pondB')` → Stem C in, Stem D out |
| leaving `observe` | `setZone('neutral')` |
| `lab` | `setZone('lab')` → Stem D only |
| `victory` | `setZone('victory')` → all stems stop |

### Critical Platform Issues

| Issue | Severity | Fix |
|---|---|---|
| No `ctx.close()` on unmount — leaks AudioContext slots | High | `mlAudio.teardown()` in `useEffect` cleanup |
| Vite HMR doubles AudioContext on hot reload | High | `import.meta.hot.dispose(() => mlAudio.teardown())` |
| `startAmbient()` from `useEffect` silently fails on iOS | High | Guard: `if (ac.state !== 'running') return` |
| `AudioBufferSourceNode` with `loop=true` never GC'd | Medium | Store ref in `_waterLoop`, call `source.stop()` in teardown |
| `setInterval` melody scheduler drifts on long sessions | Medium | Add resync guard: if `loopStart < ac.currentTime - period`, resync |

### Memory Budget
| Item | Size |
|---|---|
| Pink noise buffer (2s, 1ch) | ~352 KB |
| White noise buffer (1s, 1ch) | ~176 KB |
| Peak simultaneous nodes | ~34 (14 persistent + ~20 transient) |
| **Total audio memory** | **< 600 KB** |

### iOS Audio Unlock Pattern
```jsx
// index.jsx — one-time gesture unlock
useEffect(() => {
  const unlock = () => {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume().then(() => ac.close());
  };
  window.addEventListener('touchstart', unlock, { once: true });
  window.addEventListener('pointerdown', unlock, { once: true });
  return () => {
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('pointerdown', unlock);
  };
}, []);
```

### Mute Control (module-level, no prop threading)
```js
let _muted = false;
export const mlAudio = {
  setMuted(val) {
    _muted = val;
    const ac = getCtx();
    masterBus.gain.cancelScheduledValues(ac.currentTime);
    masterBus.gain.setValueAtTime(masterBus.gain.value, ac.currentTime);
    masterBus.gain.linearRampToValueAtTime(val ? 0 : 1, ac.currentTime + 0.08);
  }
}
```

### Files to Modify
1. `src/games/mystery-lab/audio.js` — full refactor
2. `src/games/mystery-lab/index.jsx` — teardown effect, zone effect, iOS unlock, mute state
3. `src/games/mystery-lab/screens-a.jsx` — Stem A in MapScreen useEffect
4. `src/games/mystery-lab/screens-b.jsx` — setZone + water texture in ObservationScreen
5. `src/games/mystery-lab/screens-c.jsx` — lab noise in LabScreen + error toast
6. `src/games/mystery-lab/screens-d.jsx` — aria-live on mentor text
7. `src/games/mystery-lab/shared.jsx` — mute button in HUD

---

## Implementation Task List

Phases must be done in order. Tasks within a phase can be parallelized.

### Phase 1 — audio.js Infrastructure (do first, sequential)

| # | Task | File | Complexity | Deps |
|---|---|---|---|---|
| T1 | Bus architecture + DynamicsCompressor | audio.js | M | — |
| T2 | Noise buffer generation (pink + white) | audio.js | M | T1 |
| T3 | Mute system (`setMuted`, `isMuted`) | audio.js | S | T1 |
| T4 | `teardown()` — close ctx, clear stems/refs | audio.js | S | T1 |
| T5 | HMR dispose hook (`import.meta.hot.dispose`) | audio.js | S | T4 |
| T6 | iOS guard on `startAmbient()` | audio.js | S | — |

### Phase 2 — Adaptive Stems (after T1)

| # | Task | File | Complexity | Deps |
|---|---|---|---|---|
| T7 | Stem A: `startStemA()` / `stopStemA()` | audio.js | S | T1 |
| T8 | Stem C: `startStemC()` / `stopStemC()` | audio.js | S | T1 |
| T9 | Stem D: `startStemD()` / `stopStemD()` | audio.js | S | T1 |
| T10 | Zone control: `setZone(zone)` | audio.js | M | T7–T9, T11 |
| T11 | Stem B lowpass filter (Pond A zone) | audio.js | M | T7, T10 |

### Phase 3 — New Audio Events (after T1, any order)

| # | Task | File | Complexity |
|---|---|---|---|
| T12 | `pageFlip()` — triangle chirp 600→900Hz | audio.js | S |
| T13 | `observeHover(pond)` — bandpass noise burst | audio.js | S |
| T14 | `hypothesisSelect()` / `hypothesisDeselect()` | audio.js | S |
| T15 | `notebookWrite()` — tick burst wrapper | audio.js | S |
| T16 | `screenEnter(screenId)` — grounding chord | audio.js | S |
| T17 | `evidenceReveal()` — C5→E5 "aha" motif | audio.js | S |
| T18 | `ambientBird()` — F5/G5 trill | audio.js | S |
| T19 | `observeWater(pond)` + `stopObserveWater()` | audio.js | M |
| T20 | Quality fixes: error/wrong→triangle; victory/correct attack; micro gain cap | audio.js | S |

### Phase 4 — React Wiring (after T4, T10)

| # | Task | File | Complexity | Deps |
|---|---|---|---|---|
| T21 | Teardown `useEffect` | index.jsx | S | T4 |
| T22 | Zone `useEffect([screen, pond])` | index.jsx | S | T10 |
| T23 | iOS unlock listeners | index.jsx | S | — |
| T24 | Stem A in MapScreen `useEffect` | screens-a.jsx | S | T7 |
| T25 | `observeWater` + bird interval in ObservationScreen | screens-b.jsx | S | T18, T19 |
| T26 | Lab noise in LabScreen `useEffect` | screens-c.jsx | S | T9 |

### Phase 5 — Accessibility (independent, parallel with 2–4)

| # | Task | File | Complexity |
|---|---|---|---|
| T27 | Error visual toast (`role="alert"`) in LabScreen | screens-c.jsx | S |
| T28 | Mute toggle in HUD + state in index.jsx | shared.jsx, index.jsx | M |
| T29 | `aria-live="polite"` on Evidence Board mentor text | screens-d.jsx | S |
| T30 | `role="status" aria-live="polite"` on MiniGameResults | screens-c.jsx | S |
| T31 | `aria-pressed` on hypothesis buttons | screens-b.jsx | S |
| T32 | Wire `reducedMotion` prop (suppress animations) | index.jsx, screens-b.jsx, screens-a.jsx | M |

### Open Questions for Developer

1. **`observeHover` trigger**: `mouseEnter` event or same `onClick` as clue discovery? If hover, add to `ClueWrapper`'s outer `<div>` — not the button — to avoid double-firing on click.
2. **Stem D frequency 415Hz**: Intentional industrial tritone dissonance, or should it be a subharmonic of 55Hz (110/220/440Hz)? Confirm before T9.
3. **Bird interval ownership**: Should `ambientBird()` interval live inside `audio.js setZone()` (cleaner, no stale closure risk) rather than `ObservationScreen useEffect`?
4. **`reducedMotion` + audio**: Should `reducedMotion=true` also suppress ambient stems via `setMuted(true)`? Confirm before T32.
5. **Stem D in lab vs `startStemD()` in LabScreen**: Task 26 calls `startStemD()` directly. `setZone('lab')` from Task 22 also activates Stem D. Verify idempotency guard `if (_stemD) return` is in place.

### Integration Test Checklist

**Infrastructure**
- [ ] Mount/unmount game twice rapidly — AudioContext count stays 1, goes 0 after unmount
- [ ] HMR hot-reload — no doubled ambient audio, no `AudioContext not allowed` warning
- [ ] iOS Safari — tap anywhere, then trigger a map pin — audio plays without console error

**Mute**
- [ ] Mute button in HUD silences all audio within 80ms
- [ ] Navigate map → observe → lab — mute persists
- [ ] Unmute — audio resumes

**Stems / Zones**
- [ ] Enter MapScreen — Stem A chord drone fades in over ~2.5s
- [ ] ObservationScreen Pond B — water texture audible; bird trills fire at 6–10s intervals
- [ ] Switch to Pond A — water texture crossfades to darker; bird trills stop; industrial undertone
- [ ] Lab — only industrial drone; no melody
- [ ] Victory — all stems stop; fanfare plays once

**New Events**
- [ ] Hypothesis sticky note click — ascending chirp; deselect — descending
- [ ] Clue hover in ObservationScreen — soft noise burst (different per pond)
- [ ] Notebook tab — triangle page flip sound
- [ ] Type in conclusion textarea — 2–3 tick bursts
- [ ] Correct evidence clue — `evidenceReveal()` sparkle fires ~580ms after `correct()`
- [ ] Each screen arrival — faint grounding chord

**Audio Quality**
- [ ] `error()` — soft triangle buzz, not harsh square
- [ ] `wrong()` — same
- [ ] `correct()` — no pop/click at onset
- [ ] `victory()` — no digital clip on simultaneous 6-tone onset
- [ ] Microscope lab test — not louder than other tests

**Accessibility**
- [ ] Screen reader: trigger `error()` — toast announced immediately
- [ ] Screen reader: select hypothesis — `aria-pressed` state announced
- [ ] Screen reader: place correct evidence — mentor text update announced
- [ ] Screen reader: complete lab test — results announced
- [ ] OS reduced-motion enabled — no shimmer animations in ObservationScreen

---

## Summary

| Metric | Count |
|---|---|
| Total audio events | 38 (14 existing + 24 new) |
| Audio buses | 3 (SFX / Music / Ambient) |
| Adaptive music stems | 4 |
| Implementation tasks | 32 across 5 phases |
| Files to modify | 7 |
| P0 accessibility blockers | 2 (error toast, mute control) |
| P1 screen reader fixes | 5 |
| Audio memory budget | < 600 KB |

---

*Produced by SciQuest Audio Team — Audio Director, Sound Designer, Accessibility Specialist, Technical Artist, React Integration Review, Gameplay Programmer*  
*Game: Mystery Lab · Episode 1: The Dying Pond Mystery*  
*Engine: Web Audio API procedural synthesis, no external files*
