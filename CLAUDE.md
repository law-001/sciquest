# SciQuest — Project Instructions

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run lint      # ESLint check
npm run lint:fix  # ESLint auto-fix
```

No test suite. No typecheck script (plain JSX, no TypeScript).

## The Gate — after every code change (non-negotiable)

After any change to source or config, run the verification gate automatically, without being asked. A change isn't done until it exits 0.

```bash
npm run lint && npm run build   # no `check` script here; this is the gate
```

If it fails: read the actual error (file:line) — don't guess; fix **every** error by editing the source, including pre-existing ones the run surfaces; re-run until green. Never silence an error with `eslint-disable`, config tweaks, or the like unless there's a real reason — say why. Warnings are acceptable; errors are not. (For standalone game JS under `public/games/`, also `node --check <file>` — ESLint ignores it.)

## Testing / Verification

**The developer runs the app and does the testing — Claude does not.** Don't launch the dev server, drive a headless browser, or take screenshots to verify runtime/visual behavior. Instead, after a change:

1. Do the static checks Claude *can* do: `npm run lint` and, for standalone game JS, `node --check <file>`. Report the results.
2. Then hand off testing with a short **"What to check"** note: exactly what the developer should do, what they should see if it's correct, and the specific signs it's wrong. Be concrete (which screen, which control, expected vs. broken).

The developer will test and report back. Only write a runnable harness/screenshot if explicitly asked.

## Report-back — after adding or changing any UI element

Whenever a feature, button, view, or UI element is added or changed, report:

1. **Where** — a clickable `file:line` link to the code that renders/controls it, e.g. `[LessonTemplate.jsx:42](src/components/LessonTemplate.jsx#L42)`.
2. **How to edit it by hand** — name the thing to change (label text, handler, style prop, data entry) and what each change does, so it can be tweaked without re-asking.

For anything touching **placement** (`left`/`right`/`top`/`bottom`/`margin`/`transform`/`gap`/`padding`), name the property + value and which direction each way moves it (e.g. "`gap: 12` — smaller = tighter, bigger = more space"). Prefer plain px values over `50%` + `translate(-50%)` tricks so values stay easy to find and drag.

## Architecture

React 19 + Vite 8 + Tailwind CSS 4. No React Router — navigation is view-string state in `App.jsx`.

- **Routing**: `currentView` string ("home" | "lessons" | "lesson-content" | "quiz" | "about" | "contact" | "admin" | "teacher-portal" | "teacher-setup" | "teacher-edit-lesson" | "teacher-edit-quiz" | "profile" | "games" | "game-play"). Use `onNavigate(view)` prop to switch views.
- **Lesson system**: Slot-based. Each lesson declares a `layout[]` array of slot types. `src/components/lesson-slots/` has the slot components; `src/components/slotMap.js` is the type→component registry; `src/components/LessonTemplate.jsx` renders them.
- **Quiz system**: 10 question types in `src/components/quiz-slots/`. Quiz data lives in `src/data/quizzesweek-*.js`.
- **Theme**: Dark mode via `src/context/ThemeContext.jsx`. Base bg: `#fdf6e3` (warm cream) / `stone-900` dark.
- **Backend**: Supabase (real auth + Postgres + Storage). `src/data/*.js` is the seed content; teacher edits are stored as override rows in the `lessons` / `quizzes` tables and merged over the seed by `src/context/LessonsDataContext.jsx`. Migrations live in `supabase/migrations/`.
- **Roles**: `student`, `teacher`, `admin`. Users live in either the `staff` table (teacher/admin) or `students`; `role: 'student'` is synthesized client-side.

## Lesson Slots

Every slot component receives:

```
{ id, heading, data, blockId, lessonId, stateScope?, onInteractionComplete? }
```

The last four exist for **interactive** slots (`flipCards`, `quickCheck`, `hotspot`,
`sortBuckets`, `dragLabel`, `customWidget`). Presentational slots destructure only the
first three and ignore the rest.

- In-progress answers persist to `localStorage`; completion + XP go to the
  `lesson_interactions` table via `src/lib/lessonInteractions.js`.
- `stateScope` overrides the localStorage scope. The lesson editor passes a
  `preview-` prefix so a teacher trying a block out never writes student state.
- Interactive blocks are **practice, not assessment**: they never touch
  achievements, `quiz_attempts`, or the gradebook, and never gate lesson completion.

Adding a slot type means adding an entry to each of: `slotMap.js` (`SLOT_MAP`),
`lesson-slots/index.js`, and `lesson-slot-forms/index.js` (`FORM_MAP`, `SLOT_META`,
`SLOT_GROUPS`, `DEFAULT_SLOT_DATA`), plus `SlotPickerModal.jsx` (`SLOT_ICONS`, `SLOT_COLORS`).

**Never build a Tailwind class by interpolation** (`` `bg-${color}-50` ``). This project is
Tailwind v4 with no safelist, so interpolated classes compile to nothing. Use a static map of
complete class strings — see `FlipCardsSection.jsx`.

## Key Decisions

- View-string routing instead of React Router — keeps the app self-contained with no URL bar changes.
- Slot map pattern for lessons so new content types can be added without touching lesson page logic.
- GSAP + Lenis for animations/scroll — keep animation logic out of business logic components.

## Database (Supabase)

The app is a Vite SPA with a Supabase backend (browser client only — not Next.js; ignore `next/headers`, middleware, server components). Progress, quiz, and lesson data are read through Supabase; only static content lives in `src/data/`.

- **All SQL lives in `supabase/`. Migrations are the only way schema or seed data changes** — never hand-edit the DB in the dashboard, never one-off scripts.
- Naming follows the existing folder: sequential/timestamped `supabase/migrations/<NNNN | YYYYMMDDHHMMSS>_short_desc.sql` — match the latest style there. **Forward-only: never edit a migration that already ran; write a new one.**
- Read the current `supabase/schema.sql` snapshot before writing a migration so columns/types match; update it in the same change.
- **RLS on for every table**, policies shipped in the same migration. Flag demo-grade policies as tighten-before-production.
- App objects are **camelCase**, DB columns **snake_case** — keep the mapping in `src/lib/games/progress.js` (games) or the matching `src/lib/*` API module. No component talks to the DB directly.
- Edge functions live in `supabase/functions/`.

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

### Level-select header (reuse for every new game)

Every game's level-select screen uses the same SciQuest topbar so the platform
feels consistent. When adding a new game, copy this pattern instead of inventing
a new header.

**Reference implementations** (identical structure, different substrates):
- React game — [src/games/matter-state-sandbox/ui/LevelSelect.jsx](src/games/matter-state-sandbox/ui/LevelSelect.jsx) (canonical)
- React game — [src/games/cell-division-lab/ui/LevelSelect.jsx](src/games/cell-division-lab/ui/LevelSelect.jsx)
- Standalone HTML game — [public/games/quake-ready/index.html](public/games/quake-ready/index.html) + `#backBtn` block in [public/games/quake-ready/css/ui.css](public/games/quake-ready/css/ui.css)
- Standalone HTML game — [public/games/food-chain-survival/index.html](public/games/food-chain-survival/index.html) + `#backBtn` block in [public/games/food-chain-survival/css/ui.css](public/games/food-chain-survival/css/ui.css)

**Required parts:**
- **Back arrow SVG** (identical everywhere): `viewBox="0 0 24 24"`, `width="20"`, `height="18"`, `stroke-width="1.8"`, path `M19 12H5M11 6l-6 6 6 6`. No chevron variants.
- **Back button styling**: `inline-flex`, `padding: 8px 10px`, `min-height: 44px`, `border-radius: 8px`, no border, no background, `color: var(--sq-ink-3)`, hover → cream bg + `var(--sq-ink-1)` text. Icon-only (no "Back" text).
- **Header**: centered title "Choose a level" + subtitle with orange/teal dot bookends, theme toggle on the right, thin orange accent stripe along the top edge.

**Don't render the shell overlay Back button on games that have their own header.**
Add the game's slug to `GAMES_WITH_OWN_BACK` in [src/pages/GamePlayPage.jsx](src/pages/GamePlayPage.jsx) — otherwise the dark pill overlay stacks on top of the game's own back button.

### Every new game ships a Codex asset prompt

Build the game with plain shapes first (inline SVG / simple canvas drawing), then
write the art brief to `docs/asset-prompts/<game-slug>.md` so it can be pasted
straight into Codex. Do this as part of finishing the game, not later.

The prompt must contain:

1. **A table of where each asset is consumed** — file + what it replaces.
2. **Art direction** — flat vector, outline weight, and the exact hex palette the
   game already uses (pull the values out of the game's CSS/JSX, don't invent new
   ones). State that assets must read on both cream `#FBF5E7` and near-black
   `#0C0A09`.
3. **Sprite sheets, not loose files** — one SVG per sheet, a fixed grid of equal
   cells, and an explicit list of `id="<name>"` values per sprite, because the
   code references those ids. Give each state its own sprite (idle / active /
   damaged) rather than asking for animation.
4. **The registry thumbnail** (`src/assets/<game>.svg`, 480 × 320, no text).
5. **Achievement medals** for the game's keys — 128 × 128, and say to copy an
   existing medal in `public/achievements/` as the template so the frame and
   ribbon match.
6. **Rules** — SVG only, transparent backgrounds, no embedded rasters or fonts,
   no editor metadata, inline `fill`/`stroke`, and a size budget.

[docs/asset-prompts/plant-cell.md](docs/asset-prompts/plant-cell.md) is the
worked example — copy its shape.

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

**Accessibility & performance:** keyboard access for everything interactive, labels on inputs, 4.5:1 contrast, visible focus, respect `prefers-reduced-motion`. Below the fold use `loading="lazy"` + explicit image dimensions; animate only `transform`/`opacity`; never import a whole library for one function.

---

## Version log — track every change in `VERSIONS.md` (non-negotiable)

Keep a `VERSIONS.md` at the repo root. After **any** change to source or config, update it automatically as part of finishing the change.

- **Create it if missing** — first change starts at `VERSION_1`.
- **Append, never replace.** Each change is a **new** entry with the next number. The log only grows — never overwrite, renumber, or reorder existing entries. Newest at the bottom.
- **One entry per change** — a short bullet list of what changed/was added/was fixed. Enough to know what happened without the diff.
- **Last line always holds the staged-changes message** for the newest version — one ready-to-paste commit line. Each new version replaces that last line with its own.

```markdown
# Versions

## VERSION_1
- Initial setup: <what was built>.

## VERSION_2
- Added leaderboard: <what changed / which files>.

---
Staged changes: <one-line commit message for this latest version>
```
