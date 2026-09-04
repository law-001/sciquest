> **SUPERSEDED.** The tower-defense game this document describes
> (`src/games/cell-division-defense/`) has been removed. It was replaced by
> **Cell Division Lab** (`src/games/cell-division-lab/`), which keeps the five
> mitosis mini-games but drops the attack/defend loop in favour of a
> checkpoint-driven cell cycle. Kept for reference only — do not build from it.

# Game Design Document
## Cell Division: Divide & Defend
### SciQuest — Game 2

**Version:** 0.1 (Concept)
**Genre:** Phase-Based Tower Defense + Puzzle Minigames
**Platform:** Web (SciQuest platform, Phaser 3 + React)
**Target Audience:** Grade 7 Biology students
**Curriculum Tie:** Cell division — mitosis and meiosis
**Estimated Play Time:** 8–15 min per run
**Difficulty Range:** 1–3 stars (Easy → Hard)

---

## 1. Elevator Pitch

The player is a cell biologist defending a dividing cell from viruses, radiation, and toxins that want to corrupt mitosis. Each division is divided into **phases** (Interphase → Prophase → Metaphase → Anaphase → Telophase → Cytokinesis). Between waves the player places enzyme towers around the cell membrane. When a phase transition arrives, the game PAUSES combat and launches a **30-second phase minigame** — align the chromosomes, pull the chromatids apart, draw the cleavage furrow. Fail the minigame and a mutation accumulates; too many mutations and the daughter cells are non-viable. Succeed across all six phases and both daughter cells escape healthy.

**One-sentence hook:** *Defend the nucleus, master the phases, and walk your cell through the most important event in biology.*

---

## 2. Game References

| Reference | What to borrow |
|---|---|
| **Plants vs. Zombies 2** | Accessible tower placement loop, wave-preview queue, distinct enemy silhouettes |
| **Kingdom Rush** | Tower upgrade branching, enemy ability callouts, level star rating |
| **Cytus II / VOEZ** | Clean tap-timing feel for the phase minigames — rhythm-adjacent but forgiving |
| **Spore (Cell Stage)** | Bubbly microscope aesthetic, animated organelles, bioluminescent color palette |
| **Plague Inc.** | Enemy "ability unlocks" as waves progress — each enemy type gets a scary secondary behavior at higher difficulties |

The game does **not** clone any of these — they are reference points for individual systems only.

---

## 3. Core Pillars

1. **Defend while you learn** — Tower placement reinforces the vocabulary (lysosomes, kinases, spindle fibers) naturally through use, not rote memorization.
2. **Phase minigames are the curriculum** — Every minigame is a direct physical metaphor for what the cell actually does. Aligning chromosomes at the metaphase plate IS the metaphase plate.
3. **Failure is educational, not punishing** — Mutations cause debuffs but never instant death. The game names the mutation type and explains its real-world consequence.
4. **Replayable short runs** — Each run fits in a class period. Students can replay for a better mutation score without feeling like they wasted progress.

---

## 4. High-Level Game Flow

```
LEVEL SELECT
     │
     ▼
INTERPHASE (Prep Round)
  • No enemies yet — place your starting towers
  • ATP budget: 300
  • Tutorial prompts on first run
     │
     ▼
◄────────────────────────────────────────────┐
│  WAVE COMBAT                               │
│   Enemies spawn from 3 membrane entry points│
│   Towers auto-attack on their own         │
│   Player can: place/sell towers, use ATP   │
│   Wave ends when all enemies defeated      │
│                                            │
│     ↓ (phase transition trigger)           │
│  PHASE MINIGAME OVERLAY (30 sec)           │
│   Combat pauses; enemies freeze in place  │
│   Player performs the phase action        │
│   Stars earned: 3 = no errors, 2 = minor  │
│   errors, 1 = partial, 0 = fail → mutation│
│                                            │
└──── next phase wave ───────────────────────►
     │ (after Telophase)
     ▼
CYTOKINESIS SEQUENCE (cinematic + minigame)
     │
     ▼
RESULTS SCREEN
  Daughter cell health | Mutations | Stars | XP
```

---

## 5. Phases & Minigames

### Phase 1 — Interphase (Setup)

No enemies. The nucleus pulses gently as DNA replicates. The player has free time to arrange their starting tower loadout.

**Teaching moment:** "Before division, the cell copies its DNA so each daughter cell gets a full set."

---

### Phase 2 — Prophase

**Wave:** Light enemy wave. Viruses approach slowly from 2 entry points.

**Minigame — Chromatin Condense:**
- Loose chromatin threads fill the nucleus area.
- Player taps each thread in sequence (highlighted one at a time) to condense them into compact chromosomes.
- Timing: tap the highlighted strand within a 1.5 s window. Miss → strand partially condenses → that chromosome is "fragile" (takes +1 damage from hits).
- Success condition: All 4 chromosome pairs fully condensed before timer.

**Mutation on fail:** *Chromatin Bridge* — two chromosomes fuse; one tower is disabled for the next wave.

---

### Phase 3 — Metaphase *(hardest minigame)*

**Wave:** Medium wave. Toxins target spindle fiber towers specifically.

**Minigame — Chromosome Alignment:**
- 4 chromosome pairs appear scattered in the nucleus.
- Player drags each pair to its correct position on the **metaphase plate** (a glowing center line).
- Pairs are color-coded (homologs share a base color, chromatids are identical halves).
- Order matters: pairs must be spaced evenly. Snap zones aid placement.
- Timer: 30 seconds. Each misplaced pair at timer end = 1 mutation.

**Mutation on fail:** *Nondisjunction* — chromosomes don't separate evenly; the game's "health split" at Cytokinesis is uneven, giving one daughter cell a visible chromosome count error badge.

---

### Phase 4 — Anaphase

**Wave:** Fast enemy wave. Radiation pulses sweep from one side of the cell.

**Minigame — Chromatid Pull:**
- 4 chromosome pairs are on the metaphase plate, each pair connected by a highlighted link.
- Player clicks/taps the link to "sever" it, then swipes outward along the spindle fiber arrow to pull chromatids to opposite poles.
- If the player swipes too fast (before the fiber animation completes), it shows a "tearing" effect → mutation.
- Rhythm: each pair has a brief ready-window (green flash). Pull during the window = clean separation. Pull early = torn chromatids.

**Mutation on fail:** *Deletion* — a chromosome fragment is lost; the cell's max HP cap drops 10% permanently for the rest of this run.

---

### Phase 5 — Telophase

**Wave:** Two enemy waves with a short breather between.

**Minigame — Nuclear Envelope Rebuild:**
- Two clusters of chromosomes sit at opposite poles of the cell.
- Player draws a closed oval around each cluster using click-and-drag (or touch-drag on mobile).
- The game checks the shape's closure and coverage — must encircle all chromosomes.
- Incomplete envelopes leave exposed chromosomes → vulnerable to the next enemy wave's hit.

**Mutation on fail:** *Open Nucleus* — the new nuclei are permeable; one enemy per wave in the next phase deals double damage.

---

### Phase 6 — Cytokinesis (Final)

**Boss Wave:** All remaining enemies flood in simultaneously.

**Minigame — Cleavage Furrow:**
- A contractile ring appears around the cell's equator as a dotted circle.
- Player must tap/hold along the ring to "pinch" it closed, section by section (6 sections like a pie).
- Each section has a fill meter that depletes if attacked while the player isn't holding it.
- Completing all 6 sections before the timer = clean division.

**Failure:** Incomplete furrow = unequal cytoplasm split → one daughter cell gets a "cytoplasm deficit" badge (minor debuff, still counts as a win but reduces XP).

---

## 6. Tower System

All towers are placed on the **cell membrane ring** or on specific **organelle anchor points** inside the cell. Placement grid is radial (like a clock face) — 12 membrane positions + 4 interior organelle slots.

### Tower Roster

| Tower | Cost (ATP) | Range | Target | Ability | Upgrade → |
|---|---|---|---|---|---|
| **Lysosome** | 80 | Short | Single | Digests enemies; drops ATP pickup on kill | +AOE splash |
| **Protein Kinase** | 120 | Medium | Single | Slows enemy by 40% (phosphorylation debuff) | +Chain slow |
| **Repair Enzyme** | 100 | Passive | Nucleus | Regenerates 2 HP/sec to the nucleus; cannot attack | +Cures mutations |

**Tower cap:** 8 towers maximum simultaneously (prevents overwhelming the canvas).

### Upgrade System

Each tower has a single upgrade (50% of base cost). Upgrades are unlocked mid-run and lost at run end — no persistent upgrades between runs. This keeps each run balanced and lets students experiment without fear.

### Selling

Sell a tower at any time for 50% of its total investment. Crucial during phase minigames where the placement feels wrong for the incoming wave.

---

## 7. Enemy Roster

Enemies spawn at 3 fixed **membrane breach points** (top-left, top-right, bottom) and pathfind toward the nucleus center using a pre-baked radial path. They do not use dynamic pathfinding — they always walk the same arc toward the nucleus.

### Enemy Types

All three enemy types appear from Level 1 onward. Difficulty scales by count, speed, and spawn interval — not by introducing new types mid-game.

| Enemy | HP | Speed | Ability |
|---|---|---|---|
| **Viral Hijacker** | 60 | Medium | On reaching nucleus: inserts rogue DNA → +1 mutation |
| **Radiation Pulse** | 40 | Slow | AOE burst at death: damages all towers in radius |
| **Toxin Droplet** | 80 | Medium | Targets and silences the nearest active tower for 10 sec |

### Enemy Ability Callouts

When an enemy uses its special ability, a small label pops above it for 2 seconds (e.g., *"DNA Insert!"*, *"Silencing spindle fibers!"*). These are teaching moments embedded in combat feedback.

---

## 8. Mutation System

Mutations are the primary consequence of failing minigames or letting enemies reach the nucleus. They accumulate as a visible log on the HUD and carry real biological names.

| Mutation | Cause | Effect |
|---|---|---|
| **Point Mutation** | Viral Hijacker reaches nucleus | Max nucleus HP −5 |
| **Frameshift Mutation** | 2+ Viral Hijackers reach nucleus in same wave | 1 random tower drops to 50% output |
| **Chromatin Bridge** | Fail Prophase minigame | 1 tower disabled for next wave |
| **Nondisjunction** | Fail Metaphase minigame | Cytokinesis split is uneven (daughter cell HP imbalance) |
| **Deletion** | Fail Anaphase minigame | Nucleus max HP cap −10% permanently this run |
| **Open Nucleus** | Fail Telophase minigame | 1 enemy/wave deals ×2 damage to nucleus |

**Mutation cap:** 4 mutations = game over (cell is non-viable). The game tells the player which mutation was the final trigger and why that number matters biologically.

**Mutation antidote:** The Repair Enzyme tower, when fully upgraded, can cure the most recent mutation once per run. This creates a meaningful decision — spend 100 ATP + 50 ATP upgrade cost to potentially undo a mistake, or save ATP for offense.

---

## 9. ATP Economy

ATP is the sole currency. It flows in and out constantly during combat.

**Income sources:**
- Base passive rate: 10 ATP/sec
- Enemy kill pickup: 10–30 ATP per enemy (drops as a glowing bead the player clicks to collect — optional, adds interactivity)
- Minigame star bonus: 3 stars = +100 ATP, 2 stars = +50 ATP, 1 star = +0 ATP

**Expenditure:**
- Tower placement (80–200 ATP)
- Tower upgrade (50% of base)
- Emergency Cell Repair: 150 ATP to restore 20 nucleus HP (once per phase)

**Starting ATP:** 300 (Interphase) — enough for 2–3 starting towers.

**Design intent:** The ATP drip means the player always has something to do between enemy spawns. There is never a moment of pure waiting.

---

## 10. Scoring & XP

### Star Rating (per level)

| Stars | Condition |
|---|---|
| ★★★ | 0 mutations, both daughter cells at 80%+ HP |
| ★★ | 1–2 mutations, at least 1 daughter cell healthy |
| ★ | 3 mutations, run completed |
| 0 | 4 mutations or nucleus destroyed |

### XP Awarded (fed to SciQuest's `onProgressUpdate`)

| Outcome | XP |
|---|---|
| 3-star run | 120 XP |
| 2-star run | 80 XP |
| 1-star run | 40 XP |
| Retry bonus (improve star on same level) | +20 XP |

XP is awarded via the standard `onProgressUpdate(payload)` GameComponent contract and recorded through `src/lib/games/progress.js`. No direct Supabase writes inside the game folder.

---

## 11. Level Progression

### Act 1 — Mitosis (5 Levels)

All three enemy types are present in every level. Difficulty scales through count, speed, and spawn frequency.

| Level | Setting | Wave Composition | Difficulty Twist |
|---|---|---|---|
| 1 — First Division | Skin cell | 2–3 enemies per wave, slow speed, long spawn intervals | Tutorial; generous ATP, extended minigame timers |
| 2 — Under Pressure | Muscle cell | 3–4 enemies per wave, medium speed | Radiation Pulses are timed to spike during the Anaphase wave |
| 3 — Toxin Tide | Liver cell | 4–5 enemies per wave, medium speed | Toxin Droplets spawn in clusters, forcing frequent tower repositioning |
| 4 — Full Assault | Nerve cell | 5–6 enemies per wave, fast speed, overlapping spawns | Waves begin before the previous wave fully clears |
| 5 — The Boss Cell | Dividing stem cell | Maximum count, all types at full speed | Cytokinesis floods all 3 enemy types simultaneously as a boss wave |

### Act 2 — Meiosis I (Unlocked after 3-star on Level 3)

Meiosis introduces **homologous chromosome pairs** and **crossing-over**. The metaphase minigame now requires pairing homologs before aligning them. A new minigame appears in a new phase: **Prophase I — Synapsis**, where the player must drag homologous chromosomes together to form bivalents (tetrad structures).

| Level | New mechanic |
|---|---|
| Meiosis 1 | Synapsis minigame (pairing homologs) |
| Meiosis 2 | Crossing-over: a swap event occurs mid-minigame; player must re-identify which chromatids belong to which chromosome |
| Meiosis 3 | Reduction division — only one of each homolog pair should go to each pole; wrong placement = aneuploidy mutation |

### Act 3 — Meiosis II (Unlocked after Act 2 completion)

Faster pace; no new mechanics but the enemy roster is at full difficulty.

---

## 12. UI Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (60px)                                                       │
│  [← EXIT]  PHASE: ●●●○○○  Metaphase    ❤ 72 / 100    ⚡ 340 ATP  [⏸]│
├──────────────┬───────────────────────────────────┬───────────────────┤
│  TOWER PANEL │          PHASER CANVAS             │  WAVE QUEUE       │
│  (160px)     │       (fills remaining space)      │  (140px)          │
│              │                                    │                   │
│ ┌──────────┐ │   ╭────────────────────╮           │  NEXT WAVE:       │
│ │Lysosome  │ │  ╱  ·  ·  ·  ·  ·  ·  ╲          │  ░░░░░░ 8s        │
│ │  80 ATP  │ │ │  ○ tower  [NUCLEUS] ○ │          │                   │
│ └──────────┘ │ │  ○ tower           ○  │          │  Viral Hijacker ×3│
│ ┌──────────┐ │  ╲  ·  ·  ·  ·  ·  ·  ╱          │  Toxin Droplet ×1 │
│ │P. Kinase │ │   ╰────────────────────╯           │  Radiation Pulse×2│
│ │ 120 ATP  │ │                                    │                   │
│ └──────────┘ │   Enemies walk arc paths           │  ┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│ ┌──────────┐ │   from 3 breach points             │  MUTATION LOG     │
│ │Repair Enz│ │   toward center nucleus            │  ⚠ Pt. Mutation   │
│ │ 100 ATP  │ │                                    │  ⚠ Chromatin Br.  │
│ └──────────┘ │                                    │                   │
│              │                                    │                   │
└──────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━ PHASE MINIGAME OVERLAY (full-screen, combat paused) ━━━━━━━━
┌──────────────────────────────────────────────────────────────────────┐
│  METAPHASE — Align the chromosomes!                    ⏱ 28s         │
│                                                                       │
│  Drag each chromosome pair to the metaphase plate (glowing line)     │
│                                                                       │
│         [chr A]   [chr B]                                            │
│    [chr D]    ━━━━━━━━━━━━━━    [chr C]                              │
│                 PLATE                                                  │
│          [chr A here ✓]  [chr B here…]                               │
│                                                                       │
│  ★★☆  (1 pair placed correctly so far)                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (≤ 768px)

- Tower panel collapses to a **horizontal scrollable strip** at the bottom.
- Wave queue disappears; replaced by a small badge "Wave 3/5" in the top bar.
- Mutation log accessible via a ⚠ button that opens a bottom sheet.
- Canvas fills full width; radius of the cell reduces slightly.
- All touch targets ≥ 44px.

### Color Palette (matches SciQuest visual spec)

| Element | Color |
|---|---|
| Cell membrane ring | `#3BAFA9` (teal, SciQuest liquid color) |
| Nucleus | `#A8C8F0` (cool blue, SciQuest solid color) |
| Cytoplasm background | `rgba(200,220,255,0.15)` — translucent over canvas |
| Enemy — Viral Hijacker | `#EF4444` (red) |
| Enemy — Radiation Pulse | `#F59E0B` (amber) |
| Enemy — Toxin Droplet | `#10B981` (emerald, ironic) |
| Tower selection highlight | `#F97316` (orange, SciQuest primary) |
| ATP bar | `#EAB308` (yellow, SciQuest accent) |
| Mutation log entries | `#EF4444` with `#7F1D1D` bg |
| Canvas background | `#0D1B2A` (deep navy — microscope dark field) |
| Minigame overlay bg | `rgba(0,0,0,0.85)` blur backdrop |

---

## 13. Visual & Audio Direction

### Aesthetic

Dark-field microscope look for the Phaser canvas — deep navy/black background, bioluminescent cell elements. The React HUD sits outside the canvas in SciQuest's warm cream (`#FAF7F2`). The contrast between the dark game world and the warm UI is intentional: the cell is a foreign, mysterious environment.

Organelles are **rounded, bubbly, slightly translucent** — Spore cell-stage aesthetic but cleaner. All animations use simple sprite-sheet frames or Phaser tweens; no external animation libraries inside the Phaser canvas.

### Phaser Rendering

- **WebGL renderer** (same as Matter State Sandbox)
- Cell membrane: `Graphics` object drawn as a circle, animated with a slow pulse tween
- Towers: `Sprite` objects placed at pre-calculated radial positions
- Enemies: `Sprite` objects following `Phaser.Curves.Path` arcs from breach points to nucleus
- HP bars above enemies: `Graphics` rect drawn manually each frame (no DOM overlay for in-canvas elements)
- ATP bead pickups: `Particles` emitter on enemy death, individual interactive sprites for click collection

### React HUD

- All sidebar panels and top bar are React components (same pattern as `SandboxHUD.jsx`)
- Minigame overlay is a React portal rendered above the canvas — combat pauses via an event-bus `'pause'` event emitted from React, consumed by the Phaser scene

### Audio

| Sound | Trigger |
|---|---|
| Low ambient hum | Looping background (Web Audio API, same pattern as `GameMusic.js`) |
| Soft "pop" | Tower placed |
| Squelch | Enemy defeated |
| Rising alarm | Enemy reaches nucleus |
| Bright chime | Minigame star earned |
| Discordant sting | Mutation gained |
| DNA bass loop | Minigame overlay open |

---

## 14. React ↔ Phaser Communication (Event Bus)

Following the project rule: **ONLY via event bus. Never pass React state or refs into Phaser scenes.**

### React → Phaser

| Event | Payload | When |
|---|---|---|
| `placeTower` | `{ type, slotIndex }` | Player confirms tower placement |
| `sellTower` | `{ slotIndex }` | Player sells a tower |
| `upgradeTower` | `{ slotIndex }` | Player upgrades a tower |
| `repairCell` | `{}` | Player uses Emergency Cell Repair |
| `pause` | `{}` | Minigame overlay opens |
| `resume` | `{}` | Minigame overlay closes |
| `minigameResult` | `{ stars, phase }` | Minigame completed |

### Phaser → React

| Event | Payload | When |
|---|---|---|
| `stateChanged` | `{ hp, atp, mutations, phase, wave }` | Any game state update |
| `waveStarted` | `{ waveNumber, enemies[] }` | New wave begins |
| `waveCleared` | `{ phase }` | All enemies in wave defeated |
| `phaseTransition` | `{ fromPhase, toPhase }` | Phase change trigger |
| `enemyReachedNucleus` | `{ enemyType, mutationType }` | Enemy breach |
| `towerSlotClicked` | `{ slotIndex, isEmpty }` | Player clicks a tower slot |
| `atpPickupSpawned` | `{ id, x, y, amount }` | Kill pickup appeared |
| `gameOver` | `{ reason, mutationCount }` | Cell non-viable |
| `runComplete` | `{ stars, mutations, hpLeft, xpEarned }` | All phases done |

---

## 15. Code Structure

Following the SciQuest games folder rules exactly:

```
src/games/cell-division-defense/
├── index.jsx                     # GameComponent — default export, accepts contract props
├── manifest.js                   # id, version, scenes list
│
├── scenes/
│   ├── BootScene.js              # Preloads all sprites, audio; transitions to CellScene
│   ├── CellDefenseScene.js       # Main combat loop (tower placement, enemy waves, ATP)
│   └── MinigameScene.js          # Launched as overlay scene during phase transitions
│
├── ui/                           # React HUD components (outside canvas)
│   ├── CellDefenseHUD.jsx        # Top bar: phase tracker, HP, ATP, pause
│   ├── TowerPanel.jsx            # Left sidebar: tower selection cards
│   ├── WaveQueue.jsx             # Right sidebar: upcoming wave preview
│   ├── MutationLog.jsx           # Right sidebar: accumulated mutations list
│   ├── MinigameOverlay.jsx       # Full-screen React overlay; renders minigame UI
│   ├── minigames/
│   │   ├── ChromatinCondense.jsx # Prophase tap minigame
│   │   ├── ChromosomeAlign.jsx   # Metaphase drag-and-drop minigame
│   │   ├── ChromatidPull.jsx     # Anaphase swipe minigame
│   │   ├── NuclearEnvelope.jsx   # Telophase draw minigame
│   │   └── CleavageFurrow.jsx    # Cytokinesis hold minigame
│   ├── ResultsScreen.jsx         # End-of-run star rating + XP display
│   └── MutationAlert.jsx         # Pop-up naming the mutation + biological explanation
│
├── data/
│   ├── towers.js                 # Tower definitions: id, cost, range, damage, upgrade
│   ├── enemies.js                # Enemy definitions: id, hp, speed, ability, phase
│   ├── levels.js                 # Level configs: waves[], phaseOrder[], startAtp, difficulty
│   ├── phases.js                 # Phase configs: name, minigameId, waveTrigger, teachingText
│   └── mutations.js              # Mutation definitions: id, name, cause, effect, biologyNote
│
├── systems/
│   ├── TowerSystem.js            # Placement grid, targeting, upgrade, sell logic
│   ├── EnemySystem.js            # Wave spawning, path curves, ability triggers
│   ├── MutationSystem.js         # Accumulation, cap check, antidote handling
│   └── PhaseSystem.js            # Phase sequencing, minigame trigger, wave gating
│
└── audio/
    └── CellMusic.js              # Web Audio API background track (same pattern as GameMusic.js)
```

**Registry entry** to add to `src/lib/games/registry.js`:
```js
"cell-division-defense": {
  id: "cell-division-defense",
  title: "Cell Division: Divide & Defend",
  tagline: "Defend the nucleus and guide your cell through mitosis",
  subject: "Science",
  relatedLessonIds: ["week-07-cell-division", "week-08-meiosis"],
  difficulty: 2,
  estimatedMinutes: 12,
  thumbnail: null,          // swap for actual asset when ready
  engine: "phaser",
  category: "Biology",
  loader: () => import("../../games/cell-division-defense/index.jsx"),
  minRole: "student",
},
```

---

## 16. Phaser Scene Architecture

### CellDefenseScene.js

Extends `BaseGameScene`. Key lifecycle:

```
create()
  → draw cell membrane (Graphics circle, pulsing tween)
  → initialize TowerSystem (build slot positions radially)
  → initialize EnemySystem (load path curves)
  → initialize PhaseSystem (set phase = INTERPHASE)
  → emit 'stateChanged' to React HUD
  → start INTERPHASE timer (30s free placement)

update(time, delta)
  → EnemySystem.update(delta)     — move enemies, check nucleus collision
  → TowerSystem.update(delta)     — towers target + fire
  → collect ATP drip (based on delta)
  → PhaseSystem.checkWaveEnd()    — triggers transition if wave cleared
  → emit 'stateChanged' if any value changed

phaseTransition(toPhase)
  → emit 'phaseTransition' { fromPhase, toPhase }
  → React opens MinigameOverlay (emits 'pause')
  → scene receives 'pause' → this.physics.pause(), freeze all tweens
  → wait for 'minigameResult' event
  → apply result (mutation or ATP bonus)
  → emit 'resume' → start next wave
```

### MinigameScene.js

Handles any canvas-side visual feedback needed during minigames (e.g., drawing the chromosome positions for context while the React overlay is active). Mostly the minigames are pure React UI — the Phaser scene is just frozen in the background providing visual context.

---

## 17. Data Schemas

### towers.js

```js
export const TOWERS = {
  lysosome: {
    id: 'lysosome',
    displayName: 'Lysosome',
    cost: 80,
    upgradeCost: 40,
    range: 120,         // px radius
    damage: 15,
    fireRate: 1200,     // ms between shots
    target: 'single',
    slot: 'membrane',
    description: 'Digests invading pathogens. Drops ATP on kill.',
    upgrade: { damage: 25, splash: 60 },
  },
  // …
};
```

### enemies.js

```js
export const ENEMIES = {
  viralHijacker: {
    id: 'viralHijacker',
    displayName: 'Viral Hijacker',
    hp: 60,
    speed: 80,          // px/sec along path
    reward: 20,         // ATP on kill
    onReachNucleus: 'mutation:pointMutation',
    abilityLabel: 'DNA Insert!',
  },
  // …
};
```

### levels.js

```js
export const LEVELS = [
  {
    id: 'mitosis-1',
    act: 1,
    title: 'First Division',
    cellType: 'Skin Cell',
    startAtp: 300,
    difficulty: 1,
    phases: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
    waves: {
      prophase:  [{ type: 'viralHijacker', count: 2, interval: 2500 },
                  { type: 'radiationPulse', count: 1, interval: 3000 },
                  { type: 'toxinDroplet',   count: 1, interval: 3500 }],
      metaphase: [{ type: 'viralHijacker', count: 2, interval: 2000 },
                  { type: 'radiationPulse', count: 2, interval: 2500 },
                  { type: 'toxinDroplet',   count: 1, interval: 2000 }],
      // …
    },
  },
  // …
];
```

---

## 18. GameComponent Contract

`src/games/cell-division-defense/index.jsx` must accept and use all standard props:

```jsx
export default function CellDivisionDefense({
  user,
  profile,
  onExit,
  onProgressUpdate,
  initialChallengeId,
  reducedMotion,
  deviceTier,
}) { … }
```

- `reducedMotion` → disable membrane pulse tween, skip enemy movement animations (teleport along path at lower frame budget)
- `deviceTier === 'low'` → reduce particle count on enemy death, skip canvas shadow effects
- `onProgressUpdate` called with `{ levelId, stars, xpEarned, mutations, completedAt }` on run completion

---

## 19. Educational Mapping

| Game mechanic | Biology concept | Grade 7 standard |
|---|---|---|
| Phase sequence lock (can't skip) | Mitosis checkpoint mechanism | Cell cycle regulation |
| Chromosome alignment minigame | Metaphase plate formation | Mitosis — Metaphase |
| Chromatid pull timing | Spindle fiber contraction | Mitosis — Anaphase |
| Nondisjunction mutation | Chromosomal nondisjunction | Errors in cell division |
| Cytokinesis furrow | Contractile ring / cleavage furrow | Cytokinesis |
| Meiosis crossing-over minigame | Genetic recombination | Meiosis I |
| Mutation accumulation → game over | Cancer as uncontrolled or defective division | Implications of cell division errors |
| Lysosome tower mechanic | Cellular immune response | Cell organelle functions |

Every mutation pop-up includes a one-sentence biology note. Example:
> **Nondisjunction:** "In real cells this can cause conditions like Down syndrome, where chromosome 21 doesn't separate evenly."

---

## 20. Out of Scope (V1)

The following are deliberately excluded from the first build to keep scope manageable:

- Multiplayer / co-op
- Persistent tower upgrades across runs (each run is self-contained)
- Procedurally generated waves
- Sound effects beyond background music (can be added in a follow-up)
- Meiosis Act 3 (ship Act 1 first, gate Act 2 + 3 behind level unlock)
- An in-game biology glossary panel (teach through action, not text)
- A leaderboard (XP feeds SciQuest's existing XP system — that's sufficient)

---

## 21. Open Questions (to resolve before implementation)

1. **Minigame input on mobile** — the Chromosome Alignment drag-drop must be tested carefully; small chromosome targets on a phone screen may need larger snap zones or a simplified mobile variant.
2. **Wave pacing tuning** — ATP income vs. tower cost balance needs playtesting. Start conservative (plenty of ATP) and tighten per feedback.
3. **Art assets** — are organelle sprites being hand-drawn, generated, or purchased? The Phaser canvas needs sprites early. Placeholder colored circles ship first.
4. **Level count for V1 ship** — does the team have time for all 5 mitosis levels + 3 meiosis levels, or do we ship Act 1 only (5 levels) and gate Act 2 behind a future update?
5. **Teacher-facing analytics** — does the teacher portal need a cell-division game report, or does the existing `student_progress` / XP system cover it?
