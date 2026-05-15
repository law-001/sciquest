# Matter State Sandbox — Build Progress

Source: `CLAUDE_CODE_HANDOFF MAIN.md` in Downloads. Send one task at a time.

---

## Status

| Task | Description | Status |
|------|-------------|--------|
| 1 | Install Phaser + scaffold platform folders | Done (prior session) |
| 2 | Supabase migration (game_progress, game_saves, game_sessions) | Done — migration applied manually (see note below) |
| 3 | Shared game infrastructure (`_shared/`) | Done (prior session) |
| 4 | Progress hook + Supabase queries | Done (prior session) |
| 5 | Shared React UI components (`GameCard`, `GameShell`, etc.) | Done (prior session) |
| 6 | Pages + routing (`GamesHubPage`, `GamePlayPage`, `App.jsx`) | Done (prior session) |
| 7 | Matter Sandbox folder, registry entry, game shell | Done |
| 8 | Game data files (substances, levels, challenges) | Done |
| 9 | State rules + SubstanceDisplay (Phaser objects) | Done |
| 10 | Sandbox scenes (BootScene, SandboxScene) | Done |
| 11 | Game HUD (React UI overlaid on Phaser canvas) | **Done this session** |
| 12 | Challenge tracking + success modal | **Done this session** |
| 13 | Level select screen | **Done this session** |
| 14 | Polish, accessibility, QA | **Done** |

---

## Supabase migration note (Task 2)

The migration file is `supabase/migrations/20260515000000_games_platform.sql`.
It was applied manually via the Supabase SQL editor (no CLI configured).

**Bug found and fixed:** the original migration referenced `profiles(id)` which does not
exist — the schema uses `public.students(id)`. The file has been corrected. The applied
version uses `public.students(id)` for all three tables.

---

## What exists in `src/games/matter-state-sandbox/`

```
index.jsx                   Full — level select → game flow, Phaser lifecycle, challenge tracking

manifest.js                 { id, version, scenes, assets }

scenes/
  BootScene.js              Full — extends BaseGameScene, emits 'sceneReady', starts SandboxScene
  SandboxScene.js           Full — beaker, SubstanceDisplay, all bus listeners

data/
  substances.js             SUBSTANCES object: water, co2, iron (iron is UI-stub only)
  levels.js                 LEVELS array: L1 Observe, L2 Transition, L3 Kinetic Energy
  challenges.js             CHALLENGES array: ch_01 through ch_08

physics/
  stateRules.js             determineState(substanceId, tempC, pressureAtm)

objects/
  SubstanceDisplay.js       Full visual state system with all 6 animated transitions

ui/
  LevelSelect.jsx           Full — progress fetch, unlock logic, 3-col card grid
  SandboxHUD.jsx            Full — left panel, StateBadge, temp/pressure, hold progress bar
  StateBadge.jsx            Pill badge with state→color mapping and pulse animation
  ControlBar.jsx            Full — L1 presets / L2+ slider with tick marks + substance pills
  ChallengePanel.jsx        Slide-in drawer from x=260, toggle tab, challenge list
  SuccessModal.jsx          Modal with focus trap, educational note, next-challenge button

assets/                     (empty)
```

Also added: `src/games/_shared/progress/useChallengeTracker.js`

---

## Key implementation details

### `createPhaserGame.js` — bus timing fix
`game.bus = bus` is set synchronously on the returned game object (not via `postBoot` callback).
In Phaser 3.90, scene `init()` fires before `postBoot`, so the old approach left `this.bus = null`
when `BaseGameScene.init()` ran. Setting it immediately after `new Phaser.Game(...)` guarantees
`this.game.bus` is available in all scene lifecycle methods.

### BootScene.js
- Extends `BaseGameScene` (gets `this.bus` via inherited `init()`)
- `create()` emits `'sceneReady'` on `this.bus`, builds `initData` from `game.registry`
  (`level`, `substanceId`, `reducedMotion`, `deviceTier`), then `this.scene.start('SandboxScene', initData)`

### SandboxScene.js
- `init(data)` calls `super.init()` then stores level/substanceId/reducedMotion/deviceTier
- `create()`: draws beaker (480×420, centered on 800×600 canvas, cream fill `#faf7f2`,
  4px warm border `#c8b89a`, r=12), insets `containerBounds` by 6px, creates `SubstanceDisplay`
  for water in solid state, emits initial `'stateChanged'`
- `update(time)`: calls `updateLiquidSurface` only when `currentState === 'liquid'` and not transitioning
- `_pendingState` tracks transition target so `transitionComplete` always emits the right state
- Bus listeners: `setTemperature`, `setPressure`, `setSubstance`, `reset`, `transitionComplete`

### Registry (`src/lib/games/registry.js`)
The `matter-state-sandbox` entry is registered at the top. The existing `states-of-matter` stub
entry is still present below it — do not remove it.

### index.jsx (current state)
- `selectedLevel` state drives the two-screen flow: `null` → LevelSelect, object → game
- Phaser created in `useEffect([selectedLevel?.id])` — mounts after level chosen, tears down on back
- Bus stored in React state (`setBus`) so child components re-render once bus is ready (not just a ref)
- `GameShell` Exit button goes back to LevelSelect; LevelSelect back button calls `onExit` (games hub)
- Challenge tracker wired: `useChallengeTracker(activeChallenge, bus, isPaused)`
- Completion fires `recordCompletion` + shows `SuccessModal`; guarded by `completionFiredRef`
- `completedIds` passed to `ChallengePanel` so checkmarks update live

### useChallengeTracker.js (`src/games/_shared/progress/`)
- 100ms interval advances `holdProgress` (0–1) while state criteria are met
- Pause-safe: adjusts `stateMatchStart` and `challengeStart` forward by pause duration via a
  `pausedAt` ref, so timers ignore paused periods without stopping/restarting the interval
- `isCompleteRef` guards against setting `isComplete` more than once per challenge
- Handles both `holdSeconds` and bare `timeLimit` success criteria (ch_08 has only `timeLimit`)

### LevelSelect.jsx
- Fetches `game_progress` on mount via `getProgress(supabase, { studentId, gameId })`
- Unlock logic: `lvl.unlocksAfter === null` → always unlocked; else check `completedSet.has(lvl.unlocksAfter)`
- "Complete Level N first" message derived by finding which level owns the prerequisite challenge id
- Graceful degradation for guests / offline: fetch silently fails, only L1 is playable

### SandboxHUD.jsx
- Shows substance-specific labels (e.g. "Ice" not "Solid") via `substance[${state}Label]`
- `holdProgress` prop renders an orange fill bar inside the active challenge card

### GameShell.jsx
- Added `onResume` prop — called from the Resume button so `index.jsx` can track `isPaused` state

### stateRules.js
- CO₂ at ≤5 atm skips liquid (sublimation only: solid → gas)
- Pressure effect: `effectiveBoilingPoint = boilingPoint + (pressureAtm - 1) * 10`
- Iron is in SUBSTANCES data but not wired to any UI (future expansion)

### SubstanceDisplay.js
Key patterns to know before touching this file:
- `show(state)` — instant, no animation. Called on first render and when `reducedMotion=true`.
- `transitionTo(newState)` — queues if `isTransitioning`, emits `'transitionComplete'` on `scene.bus` when done.
- `updateLiquidSurface(time)` — call from `SandboxScene.update()` every frame when state is `'liquid'`. Gated by `_liquidManaged` flag (true during grow/shrink animations) to prevent double-draw conflicts.
- Solid drawn upward from bottom anchor point so `scaleY→0` tween collapses it toward the base.
- Gas puffs use a recursive drift function (`_driftGasPuff`) that stops via `_gasPuffsActive = false`.
- `scene.tweens.killTweensOf(gfx)` is used to stop puff drift before fade-out tweens.

---

## Shared infrastructure locations

| File | Purpose |
|------|---------|
| `src/games/_shared/eventBus.js` | `createEventBus()` factory |
| `src/games/_shared/phaser/createPhaserGame.js` | `createPhaserGame({ containerId, scenes, bus, deviceTier })` — bus set synchronously |
| `src/games/_shared/phaser/BaseGameScene.js` | Base class with `this.bus`, `pause()`, `resume()` |
| `src/games/_shared/hooks/useReducedMotion.js` | React hook for `prefers-reduced-motion` |
| `src/games/_shared/hooks/usePageVisibility.js` | React hook for tab visibility |
| `src/games/_shared/progress/useGameProgress.js` | React hook: `recordCompletion`, `saveArtifact`, `progress` |
| `src/games/_shared/progress/useChallengeTracker.js` | Hook: `holdProgress`, `elapsed`, `isComplete` |
| `src/lib/games/registry.js` | `GAMES`, `getGame(id)`, `listGames()` |
| `src/lib/games/progress.js` | Supabase query functions |
| `src/pages/GamesHubPage.jsx` | Games hub page (already shows Matter Sandbox card) |
| `src/pages/GamePlayPage.jsx` | Lazy-loads and mounts the game component |

---

## React ↔ Phaser event contract (Matter Sandbox)

| Direction | Event | Payload |
|-----------|-------|---------|
| React → Phaser | `setTemperature` | `number` (°C) |
| React → Phaser | `setPressure` | `number` (atm) |
| React → Phaser | `setSubstance` | `string` (substance id) |
| React → Phaser | `reset` | — |
| React → Phaser | `pauseGame` | — |
| React → Phaser | `resumeGame` | — |
| Phaser → React | `stateChanged` | `{ state, substance, temp, pressure }` |
| Phaser → React | `transitionStart` | `{ fromState, toState, substanceName }` |
| Phaser → React | `transitionComplete` | — |
| Phaser → React | `sceneReady` | — |
