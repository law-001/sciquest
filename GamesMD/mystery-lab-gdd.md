# Mystery Lab — Game Design Document

**Episode 01: The Dying Pond Mystery**  
**Version:** 1.0 | **Target:** Grade 7 Science | **Platform:** Web (landscape-only)

---

## 1. Overview

Mystery Lab is a pure-React educational science game (no Phaser/canvas). Players take the role of a junior science detective investigating why fish are dying in Pond A at Maple Creek while Pond B — 200 metres away — remains perfectly healthy. The game teaches the scientific method through a complete inquiry cycle: observe → question → hypothesise → experiment → analyse → conclude.

**Genre:** Educational mystery / point-and-click investigation  
**Session length:** ~15–25 minutes  
**Orientation:** Landscape only (portrait shows rotate-device gate)  
**Tech stack:** React 19, Vite, Tailwind CSS, inline SVG illustrations  
**Entry point:** `src/games/mystery-lab/index.jsx`

---

## 2. Learning Objectives

| Objective | How it's covered |
|---|---|
| Formulate a testable scientific question | Screen 4 — pick one question from three options; wrong picks give mentor feedback |
| Construct evidence-based hypotheses | Screen 4 — select up to 2 hypotheses from 4; one is absurd (aliens) |
| Design and conduct fair-test experiments | Screen 6 — 5 lab tests, each a distinct mini-game |
| Interpret quantitative results | Lab results screen: Pond A vs Pond B data table |
| Build a causal evidence chain | Screen 7 — comic-strip story reconstruction |
| Write a structured conclusion | Screen 8 — cause selection + evidence check + free-write |

---

## 3. Story

Maple Creek, Tuesday 7:00 AM. Detective Hoot (the owl mascot) introduces the mystery across 4 cinematic panels:

1. **Peaceful** — Maple Creek on a normal day; healthy pond, happy fish.
2. **Alarm** — Friday 6:45 AM. Dozens of fish in Pond A found dead overnight. Mayor Lin calls.
3. **Compare** — Pond B, 200 metres away, is fine. Same source, same rain, same season.
4. **Mission** — Hoot recruits the player: observe, test, pin the evidence, write the report.

**Root cause (known to designer):** The Maple Factory's drainage pipe leaks industrial waste into Pond A. The waste raises temperature, drops dissolved oxygen, raises acidity (pH 4.5), and introduces heavy metal particulates — killing the fish. Pond B has no pipe nearby.

---

## 4. Screen Flow

```
Opening → Intro (cinematic) → Map
                                ├─→ Pond A (Observe)  ─┐
                                ├─→ Pond B (Observe)    ├─→ Question & Hypothesis → Map
                                ├─→ Lab Tent ─────────────────────────────────────────→ Map
                                ├─→ Evidence Board ───────────────────────────────────→ Conclude
                                └─→ Notebook (read-only, accessible anywhere)              ↓
                                                                                       Victory
```

**Screen IDs** (used in `go(id)` navigation):

| ID | Screen |
|---|---|
| `opening` | Title card |
| `intro` | Cinematic 4-panel intro |
| `map` | Illustrated investigation map |
| `observe` | Pond observation scene (A or B) |
| `question` | Question + hypothesis picker |
| `notebook` | Detective's read-only journal |
| `lab` | Lab Tent — run experiments |
| `evidence` | Evidence Board — story reconstruction |
| `conclude` | Conclusion writer |
| `victory` | End-screen with star rating |

---

## 5. Game State (index.jsx)

| State | Type | Purpose |
|---|---|---|
| `observations` | `array` | Clues found at ponds; each has `id, label, obs, xp, pond` |
| `experiments` | `array` | Lab tests completed; each has `id, label, resultA, resultB, verdict` |
| `hypotheses` | `string[]` | IDs of chosen hypotheses (max 2) |
| `evidenceLinks` | `array` | Story panels completed on Evidence Board |
| `energy` | `number` | Test points remaining (starts at 5, each test costs 1) |
| `question` | `string` | Chosen question ID (`q1` only is correct) |
| `cause` | `string` | Final cause pick on Conclusion screen |
| `supports` | `string[]` | Supporting evidence IDs picked on Conclusion screen |
| `written` | `string` | Free-write conclusion text |
| `conclusion` | `string` | Formatted conclusion stored in notebook |
| `victory` | `object` | `{stars: {accuracy, evidence, thinking}, causeRight}` |

**Computed values:**

- `xpEarned` — sum of observation XP + (experiments × 6)
- `progress` — float 0–1 across 10 milestones; drives HUD progress bar
- `visited` — set of location IDs that have been accessed

---

## 6. Screens in Detail

### Screen 0 — Opening
Static title card. Two buttons: **Start Investigation** (→ intro) and **Case briefing** (→ notebook). Shows theme/dark-mode toggle and exit button.

### Screen 1 — Intro (Cinematic)
4 illustrated panels. Each shows a full-bleed illustrated scene + Hoot's typewriter speech. Click anywhere to advance (or skip text). "Skip intro" button jumps directly to map. Panel scenes are SVG/component compositions: `PanelScenePeaceful`, `PanelSceneAlarm`, `PanelSceneCompare`, `PanelSceneMission`.

### Screen 2 — Map
Illustrated top-down map of Maple Creek with 5 location pins:

| Pin | ID | Action |
|---|---|---|
| Pond B | `pondB` | → observe (pond = B) |
| Maple Factory | `factory` | Locked; "out of bounds" |
| Evidence Board | `evidence` | → evidence |
| Lab Tent | `lab` | → lab |
| Pond A | `pondA` | → observe (pond = A); hot/red pin |

Sidebar shows mission checklist + Hoot tip that adapts based on progress. Day/night toggle (light/dark mode) animates: stars, fireflies, moon appear at night; birds and butterflies disappear. Pulse ring animation draws the player toward the next recommended location.

### Screen 3 — Observation Scene
Illustrated pond scene (460px tall card). Interactive clues are placed at % positions within the scene.

**Pond A clues (5 total):**

| ID | Label | XP | Hint |
|---|---|---|---|
| `deadFish` | Dead Fish | 8 | Floating belly-up |
| `murky` | Murky Water | 6 | Brown, cloudy |
| `temp` | Temperature | 6 | 34°C — hot |
| `smell` | Strange Smell | 6 | Chemical vapour |
| `factoryPipe` | Drainage Pipe | 10 | Grey-brown liquid dripping |

**Pond B clues (3 total, all control observations):**

| ID | Label | XP |
|---|---|---|
| `healthyFish` | Healthy Fish | 4 |
| `clearWater` | Clear Water | 4 |
| `tempB` | Temperature B | 4 — 22°C normal |

Each clue fires a ripple animation + pop-up card with label, observation text, and XP badge. Hoot tip changes based on how many clues found. "Form hypothesis" button unlocks only after both ponds are fully observed.

### Screen 4 — Question & Hypothesis
Two-column layout.

**Left — Pick a question (3 options):**
- `q1` ✓ "Why are fish dying in Pond A but not Pond B?" — correct
- `q2` ✗ "Who owns the ponds?" — not a science question
- `q3` ✗ "Why is the sky blue?" — wrong case

**Right — Pick hypotheses (4 sticky-note cards, max 2):**

| ID | Text | Type |
|---|---|---|
| `h1` | Water temperature too high | Good |
| `h2` | Oxygen levels too low | Good |
| `h3` | Pollution from the factory | Good |
| `h4` | Aliens poisoned the pond | Absurd — warns player |

Mentor banner at bottom shows dynamic feedback. "Back to map" button enabled only when question + ≥1 hypothesis are chosen.

### Screen 5 — Notebook
Tabbed read-only journal. 6 tabs: Observations, Questions, Hypotheses, Experiments, Results, Conclusion. Data flows in from game state; nothing is editable here. Results tab renders a Pond A vs Pond B comparison table for all completed experiments.

### Screen 6 — Lab Tent
Two-column layout: lab bench card (left) + sidebar (right).

**Gate:** If no observations yet, blocks entry and shows "go observe first" message.

**Sidebar:** Hypothesis verdict panel (updates live as tests complete) + Hoot tip + notebook badge.

**Lab bench:** 5 tool cards in a grid. Each costs 1 energy. Completed tests show "DONE". Clicking an available test opens `TestMiniGame` — a fixed modal overlay.

#### Mini-game 1 — pH Test (`ph`)
Two phases:
1. **Dip** — Press button; strip animates downward into beaker over 1.2s; color shifts cream → orange → deep orange. On small landscape screens (vh < 500px) layout switches to row: beaker left, button right.
2. **Read** — Pick the matching pH value from 4 color-coded options (pH 2, 4.5, 7.0, 10). Only pH 4.5 is correct.

Result: pH 4.5 acidic (Pond A) vs pH 7.0 neutral (Pond B).

#### Mini-game 2 — Oxygen Test (`oxygen`)
3-level timing bar. A needle bounces left↔right. Player taps when needle lands in the shrinking green zone. Zone shrinks and bar speeds up each level. Miss → back to level 1. Complete all 3 levels → done.

Result: 3.1 mg/L LOW (Pond A) vs 8.4 mg/L normal (Pond B).

#### Mini-game 3 — Temperature (`temp`)
Drag-and-drop thermometer. 3 beakers: River (18°C), Pond A (34°C), Pond B (22°C). Drop thermometer into each; 3-second countdown; reading auto-fills. After all 3 measured, switches to question phase: "Which was hottest?" (Pond A). Beaker and thermometer SVGs scale with viewport height (`bs = min(1, vh/600)`).

Result: 34°C HOT (Pond A) vs 22°C normal (Pond B).

#### Mini-game 4 — Pollution (`pollution`)
3 levels of vial-matching. A glowing vial appears; player picks its chemical source from an options list. Options shuffle each pick. Wrong answer → back to level 1. Levels add more vials and more options:
- Level 1: 1 vial, 3 options
- Level 2: 2 vials, 4 options
- Level 3: 3 vials, 5 options

Result: Industrial waste detected (Pond A) vs Clean (Pond B).

#### Mini-game 5 — Microscope (`micro`)
4 metallic virus particles move around a circular viewport (aspect ratio 1.6, `maxHeight: min(340px, 42vh)`). Click all 4 to complete. Particles bounce off viewport edges (positions in %). Particle size scales with viewport height (`vs = min(1, vh/600)`).

Result: Heavy metal particles seen (Pond A) vs None (Pond B).

### Screen 7 — Evidence Board
5-panel comic-strip story reconstruction. Each panel has a prompt and the player picks the correct clue from a shuffled set (correct clues + distractors).

| Step | Title | Correct clue |
|---|---|---|
| source | The Source | Factory drainage pipe |
| leak | The Leak | Industrial waste in water |
| poison | The Poison | Heavy metals · acidic water |
| effect | The Effect | Dangerously low oxygen |
| tragedy | The Tragedy | Dead fish floating |

Distractors: "Warm afternoon weather" and "Pond B fish are healthy" — both get mentor commentary explaining why they don't fit the causal chain. Wrong picks trigger a shake animation. Completing all 5 panels unlocks the Conclude button.

**Gate:** Requires both ponds observed + at least 1 experiment run.

### Screen 8 — Conclusion
Three steps in sequence:

1. **Pick the cause** — 3 options; only "Industrial pollution from the factory" is correct.
2. **Pick supporting evidence** — checkbox list of completed experiments; must pick ≥2.
3. **Write conclusion** — free-text area (min 12 chars to enable submit).

On submit, calls `handleVictory()` which computes stars and records completion to Supabase.

**Star scoring:**

| Category | Criteria |
|---|---|
| Accuracy | Chose correct cause |
| Evidence | ≥3 experiments completed |
| Thinking | ≥2 hypotheses explored |

### Screen 9 — Victory
Displays 3-star breakdown, XP earned, summary of experiments. Offers "Play again" (restarts state) and "Exit" (calls `onExit`).

---

## 7. HUD

Visible on all screens except `opening`, `intro`. Fixed top bar with:
- XP counter
- Energy bar (5 segments)
- Progress bar (0–100%)
- Jump menu (quick-nav to any visited screen)
- Theme toggle (day/night)
- Exit button

---

## 8. Mentor — Detective Hoot

SVG owl mascot with 3 moods: `happy`, `thinking`, `stern`. Appears in every screen as a contextual guide. Speech adapts to player progress. Never blocks flow — tips are advisory only.

---

## 9. Visual Design

| Token | Value |
|---|---|
| Background | `#fdf6e3` (warm cream) / `stone-900` dark |
| Primary accent | Orange `#f97316` |
| Secondary | Teal `#14b8a6` |
| Tertiary | Yellow `#fde047` |
| Text | `#1c1410` (ink) |
| Card radius | 12–20px |
| Font — display | Nunito (weight 900) |
| Font — handwritten | Kalam |
| Font — body | Inter / system-ui |

State colors (lab canvas only):
- Solid: `#A8C8F0` – `#DDEEFF`
- Liquid: `#3BAFA9` – `#7BC9CF`
- Gas: `rgba(200,220,255,0.4)`

---

## 10. Data Files

| File | Contents |
|---|---|
| `screens-a.jsx` | Intro panels, Opening, Map |
| `screens-b.jsx` | Observation, Question/Hypothesis, Notebook |
| `screens-c.jsx` | Lab Tent + all 5 mini-games |
| `screens-d.jsx` | Evidence Board, Conclusion, Victory |
| `shared.jsx` | `DetectiveHoot`, `HUD`, `Lucide`, `NotebookBadge`, `CrimeTape` |
| `world.jsx` | All illustrated world objects (Pond, Tree, Factory, etc.) |
| `styles.css` | All mystery-lab-specific CSS |
| `index.jsx` | Root component, game state, routing |

---

## 11. Progress & Supabase

- Challenge ID: `ep01-dying-pond`
- Calls `useGameProgress(supabase, 'mystery-lab', user?.id)`
- Records: `{ challengeId, score (stars 0–3), scoreUnit: 'stars', metadata: { xpEarned } }`
- Also fires `onProgressUpdate` prop for parent platform XP sync

---

## 12. Responsive Behaviour

- Portrait mode: device-rotate gate overlay covers entire game
- Landscape compact (vh < 500px): popup modals use `maxHeight: calc(100vh - 32px)` + scroll; mini-games shrink via `bs`/`vs` scale factors; pH dip phase goes row layout
- Min-height components use `min(Npx, Xvh)` to compress gracefully

---

## 13. Animations & CSS

Defined in `styles.css` under `.mystery-lab-root`:

| Name | Used for |
|---|---|
| `ml-btn-glow` | Pulsing CTA buttons |
| `ml-pulse-ring` | Map pin location pulse |
| `ml-shimmer` | Hint shimmer / fireflies / cursor blink |
| `ml-float-y` | Floating clue elements |
| `ml-twinkle` | Night-mode stars |
| `bounce-in` | Modal + result card entrance |
| `float` | Hoot floating idle |
| `ripple-fx` | Clue-click ripple |
