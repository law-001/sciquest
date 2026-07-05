# SciQuest — Project Instructions

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run lint      # ESLint check
npm run lint:fix  # ESLint auto-fix
```

No test suite. No typecheck script (plain JSX, no TypeScript).

## Testing / Verification

**The developer runs the app and does the testing — Claude does not.** Don't launch the dev server, drive a headless browser, or take screenshots to verify runtime/visual behavior. Instead, after a change:

1. Do the static checks Claude *can* do: `npm run lint` and, for standalone game JS, `node --check <file>`. Report the results.
2. Then hand off testing with a short **"What to check"** note: exactly what the developer should do, what they should see if it's correct, and the specific signs it's wrong. Be concrete (which screen, which control, expected vs. broken).

The developer will test and report back. Only write a runnable harness/screenshot if explicitly asked.

## Architecture

React 19 + Vite 8 + Tailwind CSS 4. No React Router — navigation is view-string state in `App.jsx`.

- **Routing**: `currentView` string ("home" | "lessons" | "lesson-content" | "quiz" | "about" | "contact" | "admin" | "teachers" | "teacher-portal" | "profile"). Use `onNavigate(view)` prop to switch views.
- **Lesson system**: Slot-based. Each lesson in `src/data/` declares a `layout[]` array of slot types. `src/components/lesson-slots/` has the slot components; `src/components/LessonTemplate.jsx` renders them.
- **Quiz system**: 10 question types in `src/components/quiz-slots/`. Quiz data lives in `src/data/quizzesweek-*.js`.
- **Theme**: Dark mode via `src/context/ThemeContext.jsx`. Base bg: `#fdf6e3` (warm cream) / `stone-900` dark.
- **No backend**: Auth is mock (state only). All lesson/quiz data is static JS files.

## Key Decisions

- View-string routing instead of React Router — keeps the app self-contained with no URL bar changes.
- Slot map pattern for lessons so new content types can be added without touching lesson page logic.
- GSAP + Lenis for animations/scroll — keep animation logic out of business logic components.

## Domain Knowledge

- **Week**: A group of lessons (`WEEKS_DATA` array). Each week has multiple `lessons[]`.
- **Lesson slot**: A content block type (intro, diagram, timeline, key-terms, etc.) rendered by `LessonTemplate`.
- **Quiz slot**: A question-type component (MultipleChoice, TrueFalse, FillInTheBlanks, etc.).
- **Portal views**: Admin and Teacher views hide the Navbar (`isPortalView` flag in `App.jsx`).

## Don'ts

- Don't add React Router — the view-string pattern is intentional.
- Don't modify generated files (`*.gen.ts`, `*.generated.*`).
- Don't hardcode colors — use Tailwind tokens or CSS variables.

## Completed Games — Do Not Touch

### `matter-state-sandbox`

`src/games/matter-state-sandbox/` is **complete and shipped**. Do not modify any file inside it, its shared dependencies, or its CSS.

- Its styles live in the global `src/index.css` under the `/* — Sandbox shell layout — */` and related `sq-*` blocks. Do not remove, rename, or change those rules — they are load-bearing for the game.
- Do not change `src/games/_shared/` files in ways that could break this game.
- Do not change `src/lib/games/progress.js` in ways that break its existing queries.

---

## Games Platform

### Folder rules

- `src/pages/` — route-level React views
- `src/components/games/` — React UI shared across all games
- `src/games/_shared/` — game-engine infrastructure (event bus, base scene, hooks)
- `src/games/<game-slug>/` — one game's full code (Phaser scenes + React HUD)
- `src/lib/games/` — game registry + Supabase progress queries

### Game stack

Phaser 3.80+ with built-in Matter.js physics. No separate physics install.
Phaser renders to a `<canvas>`. React wraps it with HUD overlays.

### GameComponent contract

Every game's `index.jsx` default export must accept:

```
{ user, profile, onExit, onProgressUpdate, initialChallengeId, reducedMotion, deviceTier }
```

- `user`: Supabase user object
- `profile`: SciQuest profile (role, displayName, etc.)
- `onExit`: `() => void` — navigate back to games hub
- `onProgressUpdate`: `(payload) => void` — called when a challenge completes
- `reducedMotion`: boolean — disable all animations if true
- `deviceTier`: `'low' | 'mid' | 'high'`

### React ↔ Phaser communication

ONLY via event bus (EventEmitter). Never pass React state or refs into Phaser scenes.

- React → Phaser: emit events (e.g. `setTemperature`, `setSubstance`, `reset`)
- Phaser → React: emit events (e.g. `stateChanged`, `transitionStart`, `transitionComplete`)

### Games rules

- `Phaser.Game` is created exactly once per mount using a `useRef` guard (StrictMode safe)
- A file enters `_shared/` only when 2+ games need it — build inline first
- No `console.log` in committed code
- All Supabase queries go through `src/lib/games/progress.js` — no game writes DB directly

---

## Visual Design Spec

SciQuest uses a **warm cream background** (`#FAF7F2`) with **orange, teal, and yellow** accents. All new screens must match this palette.

**State colors** (game canvas and badges only — not general UI):

- Solid: cool blue/white — `#A8C8F0` to `#DDEEFF`
- Liquid: teal/blue — `#3BAFA9` to `#7BC9CF`
- Gas: light grey/white, semi-transparent — `rgba(200,220,255,0.4)`

**Typography:** match the existing SciQuest font. No new fonts.

**Rounded corners:** 12–16px on cards, panels, buttons.

**Component rules:**

- Every state must be shown by BOTH color and text label — never color alone
- All buttons are real `<button>` elements with visible labels
- Tap targets ≥ 44px height on mobile
- Sliders must respond to keyboard arrow keys
