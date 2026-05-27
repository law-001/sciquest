# SciQuest — Games Platform Context

## What's been built

Tasks 1–6 of the games platform handoff are complete. The platform scaffold is fully wired but contains zero actual games yet.

---

## File map

```
src/
├── lib/games/
│   ├── registry.js          # GAMES object + getGame / listGames exports
│   └── progress.js          # All Supabase queries (getProgress, recordCompletion, saveArtifact, startSession, endSession)
│
├── games/
│   └── _shared/
│       ├── eventBus.js                    # createEventBus() factory — one bus per game instance
│       ├── phaser/
│       │   ├── createPhaserGame.js        # Phaser.Game factory (WebGL, Matter.js, FIT scale, 30/60fps by deviceTier)
│       │   └── BaseGameScene.js           # Extends Phaser.Scene; stores bus, adds pause()/resume()
│       ├── hooks/
│       │   ├── useReducedMotion.js        # Returns boolean, reacts to OS setting changes
│       │   └── usePageVisibility.js       # Calls callback(true/false) on tab hide/show
│       └── progress/
│           └── useGameProgress.js         # React hook: loads progress on mount, exposes recordCompletion / saveArtifact / getChallengeProgress
│
├── components/games/
│   ├── GameCard.jsx          # Card with thumbnail, difficulty dots, progress bar, Play button; locked state
│   ├── GameAuthGate.jsx      # Renders children if user exists, else shows sign-in prompt
│   ├── GameShell.jsx         # Fixed 60px top bar + pause overlay; wraps game canvas
│   └── GameLoadingScreen.jsx # Full-screen loading bar
│
└── pages/
    ├── GamesHubPage.jsx      # Lists all registered games in a 2-col grid
    └── GamePlayPage.jsx      # Lazy-loads + runs a single game by activeGameId

supabase/migrations/
└── 20260515000000_games_platform.sql   # Creates game_progress, game_saves, game_sessions + RLS policies
```

---

## Routing

`App.jsx` uses view-string routing (no React Router).

| View string | What renders | Navbar hidden? |
|---|---|---|
| `'games'` | `GamesHubPage` | No |
| `'game-play'` | `GamePlayPage` | Yes (isPortalView) |

Navigate to a game:
```js
onNavigate('game-play', { gameId: 'your-game-id' })
```
`handleNavigate` in App.jsx reads `payload.gameId` and stores it in `activeGameId` state.

---

## How to add a new game

1. **Create the game folder** at `src/games/<game-slug>/index.jsx`.  
   The default export must accept this exact prop contract:
   ```js
   { user, profile, onExit, onProgressUpdate, initialChallengeId, reducedMotion, deviceTier }
   ```

2. **Register it** in `src/lib/games/registry.js`:
   ```js
   import { GAMES } from './registry';

   GAMES['states-of-matter'] = {
     id: 'states-of-matter',
     title: 'States of Matter',
     tagline: 'Explore solids, liquids, and gases',
     difficulty: 2,           // 1–3
     estimatedMinutes: 15,
     totalLevels: 3,
     thumbnail: null,         // or import path
     locked: false,
     loader: () => import('../../games/states-of-matter/index.jsx'),
   };
   ```

3. The game card appears automatically in the hub. No changes to routing or pages needed.

---

## React ↔ Phaser communication

**Only via the event bus. Never pass React state or refs into Phaser scenes.**

```js
// Inside a React component
bus.emit('setTemperature', 100);
bus.on('stateChanged', (state) => setUiState(state));

// Inside a Phaser scene (this.bus is set in BaseGameScene.init())
this.bus.on('setTemperature', (temp) => { /* update simulation */ });
this.bus.emit('stateChanged', { phase: 'gas' });
```

`createPhaserGame` attaches the bus to `game.bus`. `BaseGameScene.init()` picks it up as `this.bus`.

---

## Progress recording

Call from inside a game component when a challenge completes:
```js
onProgressUpdate({
  challengeId: 'level-1',
  score: 4200,
  scoreUnit: 'points',   // 'time_ms' | 'points' | 'percent'
  metadata: { heatApplied: true },
});
```

Or use the hook directly:
```js
const { recordCompletion, getChallengeProgress, progress } = useGameProgress(supabase, gameId, user.id);
```

All DB writes go through `src/lib/games/progress.js`. No game touches Supabase directly.

---

## Database tables (already migrated)

| Table | Purpose |
|---|---|
| `game_progress` | One row per student × game × challenge. Tracks completion, best score, attempts. |
| `game_saves` | Arbitrary save slots (inventory, custom levels, etc.). Can be public. |
| `game_sessions` | Session telemetry — start/end time, duration. |

RLS is enabled on all three. Students manage their own rows; authenticated users can read all progress and sessions, and public saves.

---

## What's next

No games exist yet. The next task is building the first game (e.g. States of Matter) inside `src/games/states-of-matter/` and registering it in the registry.
