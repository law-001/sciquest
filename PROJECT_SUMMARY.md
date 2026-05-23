# SciQuest — Project Summary
Last updated: May 22, 2026

## What It Is

SciQuest is an interactive **Grade 7 science learning platform** built as a single-page React app. Students work through weekly lesson modules and take quizzes; teachers and admins have separate portal views for oversight.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19.2 (React Compiler enabled) |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 4 (no external component kit — all custom) |
| Backend | Supabase (auth + PostgreSQL) |
| Animation | GSAP 3 + Lenis (smooth scroll) |
| Games | Phaser 3.90 (built-in Matter.js physics) |
| Icons | lucide-react |
| Language | Plain JSX — no TypeScript |

---

## Routing

No React Router. `App.jsx` holds a `currentView` string and passes `onNavigate(view)` down as a prop. Views:

```
home | lessons | lesson-content | quiz | about | contact
admin | teachers | teacher-portal | teacher-setup | profile
games | game-play
```

Portal views (`admin`, `teacher-portal`, `teacher-setup`, `game-play`) hide the Navbar via an `isPortalView` flag.

`teacher-setup` is the invite-acceptance flow: a teacher follows an admin invite link and fills in the `staff` row that the DB trigger pre-created. Expired/used links show an "Invite link expired" screen.

---

## Authentication & Roles

Supabase auth with three roles: **student**, **teacher**, **admin**.

- `src/context/AuthContext.jsx` — exposes `user`, `profile`, `signIn`, `signUp`, `verifyEmailOtp`, `signOut`
- Email OTP verification flow for new signups
- `persistSession: true` — users stay logged in on refresh
- A Supabase trigger (`handle_new_user`) auto-creates a row in the `profiles` table on signup

---

## Database Schema (Supabase)

Users are split across two tables. `students` holds learners; `staff` holds teachers and admins (distinguished by a `role` column). The `handle_new_user` trigger routes the row based on `user_metadata.role`.

**`students`**
- `id` (uuid, FK → auth.users), `first_name`, `last_name`, `email`, `student_number` (unique), `section`, `created_at`

**`staff`**
- `id` (uuid, FK → auth.users), `role` (`'teacher' | 'admin'`), `first_name`, `last_name`, `email`, `created_at`

**`student_progress`**
- `id`, `student_id` (FK → students), `lesson_id`, `week_id`, `completed`, `completed_at`
- Unique on `(student_id, lesson_id)`

RLS is enabled on all three tables. Students manage their own progress rows; staff/students can update their own profile row (staff cannot self-promote). All authenticated users can read.

---

## Lesson System

Lesson data lives in `src/data/lessonsweek-01.js` through `lessonsweek-20.js` as `WEEKS_DATA` arrays — full 20-week curriculum. Each lesson declares a `layout[]` array of slot type strings. [LessonTemplate.jsx](src/components/LessonTemplate.jsx) maps those strings to components via a `SLOT_MAP`.

**10 slot types** in [src/components/lesson-slots/](src/components/lesson-slots/) (plus a `Sectionheading` helper):

| Slot | Purpose |
|---|---|
| `IntroSection` | Paragraphs + "Did you know?" callout |
| `KeyTermsSection` | Glossary |
| `ReasonCardsSection` | Why-use-this-concept cards |
| `ImageCardsSection` | Image grid |
| `ConceptListSection` | Bullet-point concepts |
| `ApplicationsSection` | Real-world applications |
| `TimelineSection` | Historical timeline |
| `ComparisonSection` | Side-by-side table |
| `ScenarioSection` | Real-world scenario |
| `DiagramSection` | SVG/image diagram |

To add a new content type: create the component, add it to the slot map, and use the key in lesson data — no changes to `LessonTemplate`.

---

## Quiz System

Quiz data lives in `src/data/quizzesweek-01.js` through `quizzesweek-20.js`, keyed by `lessonId`. [Quiztemplate.jsx](src/components/Quiztemplate.jsx) handles the timer, progress, and submit logic.

**10 question types** in [src/components/quiz-slots/](src/components/quiz-slots/):

`MultipleChoice` · `TrueFalse` · `FillInTheBlanks` · `ShortAnswer` · `Essay` · `Matching` · `Identification` · `Ordering` · `PictureBased` · `CaseStudy`

---

## Games Platform

A Phaser-based mini-game system layered onto the React app. Phaser renders to a `<canvas>`; React wraps it with HUD overlays. React ↔ Phaser communication is **only** via an event bus — never pass React state/refs into scenes.

**Registry** — [src/lib/games/registry.js](src/lib/games/registry.js) defines a `GAMES` map. Each entry carries metadata (title, difficulty, category, related lesson IDs) and a lazy `loader`. Games without a loader render as **locked** cards.

| Game ID | Status | Category |
|---|---|---|
| `matter-state-sandbox` | Playable (Phaser) | Chemistry |
| `cell-division-defense` | Playable (Phaser) | Biology |
| `cell-explorer` | Locked (coming soon) | Biology |
| `circuit-lab` | Locked (coming soon) | Physics |

**Folder layout:**

```
src/games/_shared/          # Engine infra: eventBus, BaseGameScene,
                            #   createPhaserGame, useGameProgress, hooks
src/games/<game-slug>/      # One game: Phaser scenes + React HUD
src/components/games/       # Shared game UI: GameShell, GameCard,
                            #   GameAuthGate, GameLoadingScreen
src/lib/games/              # registry.js + progress.js (all DB writes)
```

**GameComponent contract** — every game's `index.jsx` default export accepts:
`{ user, profile, onExit, onProgressUpdate, initialChallengeId, reducedMotion, deviceTier }`

**Rules:** `Phaser.Game` created exactly once per mount via a `useRef` guard (StrictMode-safe). A file enters `_shared/` only when 2+ games need it. All Supabase writes go through `src/lib/games/progress.js`.

---

## Pages

| Page | View Key | Notes |
|---|---|---|
| `LandingPage` | `home` | Hero + feature showcase |
| `LessonsPage` | `lessons` | Week/lesson picker with progress |
| `LessonContentPage` | `lesson-content` | Renders `LessonTemplate` |
| `QuizPage` | `quiz` | Renders `QuizTemplate` |
| `AboutPage` | `about` | — |
| `ContactPage` | `contact` | — |
| `AdminDashboardPage` | `admin` | Stats, user management |
| `TeacherPortalPage` | `teacher-portal` | Teacher view |
| `ProfilePage` | `profile` | User profile |
| `GamesHubPage` | `games` | Game catalog (cards from registry) |
| `GamePlayPage` | `game-play` | Lazy-loads + mounts the active game |

---

## Design Tokens

**Colors (Tailwind theme):**
- Primary: orange (`#f97316` → `#c2410c`)
- Secondary: teal (`#14b8a6` → `#0f766e`)
- Accent: yellow (`#eab308` → `#a16207`)

**Light mode base:** warm cream (`#fdf6e3`) · **Dark mode base:** `stone-900`

**Fonts:** Nunito (headings, 800/900 weight) + Inter (body)

**Custom shadows:** `card`, `card-hover`, `modal`, `glow`, `glow-success`, `glow-error`, `warm`

**Custom keyframe animations:** `float`, `bounce-in`, `slide-up`, `shimmer`, `spin-slow`, `pulse-glow`, `confetti-fall`

---

## XP & Levelling System

Config lives entirely in `src/lib/xp-config.js` — edit numbers there to retune the economy.

- **Quiz XP:** `QUIZ_MIN_XP = 5` (floor for trying) + `QUIZ_XP_PER_CORRECT = 5` per correct unit
- **Matching questions** count one unit per pair, not one unit for the whole question
- **Attempt decay:** attempt 1 → 100%, attempt 2 → 50%, attempt 3 → 25%. Attempt 4 is blocked (`MAX_QUIZ_ATTEMPTS = 3`)
- **Manual-grade types** (`essay`, `short-answer`) are excluded from auto XP until a teacher grades them
- **Levels 1–15** defined by `LEVEL_THRESHOLDS` cumulative XP array; progress bars computed by `xpToNextLevel()`
- Lesson XP is declared per-lesson in the `lessonsweek-*.js` data files (not in xp-config)

---

## Live Games (details)

Two games are currently playable; `cell-explorer` and `circuit-lab` are locked placeholders. See the Games Platform section above for registry, folder rules, and the GameComponent contract.

**matter-state-sandbox** (Chemistry):
- 3 levels: Level 1 (preset buttons), Level 2 (temperature slider), Level 3 (temperature + pressure sliders)
- Substances: water, ethanol, iron, CO₂ (defined in `data/substances.js`)
- Challenges tracked via `useChallengeTracker` — hold the target state for N seconds to complete
- Background music via `GameMusic.js` (Web Audio API)
- Two canvas overlays: Object View (animated substance) and Particle View (particle simulation)

**cell-division-defense** (Biology) — tower-defense framing of mitosis:
- Phases of cell division drive the waves (`data/phases.js`, `systems/PhaseSystem.js`); defend the nucleus against mutating enemies
- Towers, enemies, waves, and levels defined under `data/`; per-phase minigames in `ui/minigames/` (e.g. `ChromosomeAlign`, `ChromatidPull`, `CleavageFurrow`)
- Custom `canvas/GameCanvas.js` render layer + React HUD (`CellDefenseHUD`, `WaveQueue`, `TowerPanel`)
- Background music via `CellMusic.js`

Both write progress to Supabase only through `src/lib/games/progress.js`.

**Sandbox CSS classes** (all prefixed `sq-`): defined in `src/index.css` from line ~231 onward. The shell is a 3-row grid: `60px` top bar / `1fr` main / bottom bar (fixed height on desktop, `auto` on xs).

---

## Notifications

Student-only. A floating bell button (bottom-left) rendered by [NotificationBubble.jsx](src/components/NotificationBubble.jsx), hidden on portal views. `App.jsx` owns the state (`notifications`, `notifHistory`, `unseenCount`) and exposes a `pushNotification(n)` helper.

Four notification kinds: `xp` (XP earned), `level-up`, `achievement`, and `quiz-graded`. Transient XP pops also surface via `XpToast`; the bubble keeps the full history with an unseen badge. Quiz-graded notifications fire when a student's `pending_grade_count` flips from > 0 → 0, and survive a logout/login cycle (pending attempt ids are remembered).

---

## Responsive Breakpoints (Sandbox)

| Breakpoint | Max-width | Bottom bar height | Notes |
|---|---|---|---|
| Desktop | — | `132px` | 3-column grid |
| Mobile | `768px` | `190px` | Single column, stacked controls |
| XS | `390px` | `auto` (max 210px, scrollable) | Extra-small phones |

---

## Known Gotchas

- **CSS calc() in sliders** — use dimensionless numbers (`0.4`), not percentages (`40%`), when multiplying lengths inside `calc()`. Mobile browsers are strict; desktop Chrome silently accepts invalid expressions. Slider thumb/fill/tick positions all use `calc(10px + ${frac} * (100% - 20px))` where `frac` ∈ [0, 1].
- **Custom slider touch events** — React's `onTouchStart` is passive (can't `preventDefault()`). The `SandboxSlider` attaches a native non-passive `touchstart` listener via `useEffect` to stop browser scroll-hijack during drag.
- **Phaser + React layering** — Phaser canvas is WebGL; slider/HUD overlays are CPU-rendered DOM. Use `will-change: left` on the thumb and `will-change: width` on the fill to keep them on their own compositor layers alongside the canvas.
- **Portrait mode** — the sandbox has a full responsive portrait layout; do NOT add a "rotate device" overlay. It was removed intentionally.

---

## Key File Locations

```
src/
├── App.jsx                        # Root — routing, global state
├── main.jsx                       # React 19 entry (createRoot)
├── index.css                      # Global styles + sq- sandbox classes (~1300 lines)
├── context/
│   ├── AuthContext.jsx             # Auth state + Supabase methods
│   └── ThemeContext.jsx            # Dark/light toggle
├── lib/
│   ├── supabase.js                 # Supabase client init
│   ├── users.js                    # Admin/teacher DB queries
│   ├── utils.js                    # cn() classname helper
│   ├── xp-config.js                # XP/level economy constants + helpers
│   ├── progress.js                 # Lesson progress queries
│   └── games/
│       ├── registry.js             # Game manifest + lazy loaders
│       └── progress.js             # Game challenge progress (all game DB writes)
├── data/
│   ├── lessonsweek-01.js .. -20.js # 20 weeks of lesson content
│   └── quizzesweek-01.js .. -20.js # 20 weeks of quiz questions
├── components/
│   ├── lesson-slots/               # 10 lesson slot components + Sectionheading
│   ├── quiz-slots/                 # 10 quiz question components
│   ├── games/                      # Shared game UI (GameShell, GameCard…)
│   ├── layout/Navbar.jsx
│   ├── modals/AuthModal.jsx
│   ├── NotificationBubble.jsx      # Student notification bell + panel
│   ├── XpToast.jsx                 # Transient XP pop-ups
│   ├── LessonTemplate.jsx
│   └── Quiztemplate.jsx
├── games/
│   ├── _shared/                    # EventBus, BaseGameScene, hooks, progress utils
│   ├── matter-state-sandbox/       # Live game (Chemistry)
│   │   ├── index.jsx               # GameComponent root
│   │   ├── scenes/                 # BootScene, SandboxScene (Phaser)
│   │   ├── ui/                     # SandboxHUD, ControlBar, ParticleView, ObjectView…
│   │   ├── data/                   # challenges.js, levels.js, substances.js
│   │   ├── physics/stateRules.js   # State transition logic
│   │   └── audio/GameMusic.js
│   └── cell-division-defense/      # Live game (Biology) — mitosis tower defense
│       ├── index.jsx               # GameComponent root
│       ├── scenes/                 # BootScene, CellDefenseScene (Phaser)
│       ├── systems/                # PhaseSystem, EnemySystem, TowerSystem…
│       ├── ui/                     # CellDefenseHUD, WaveQueue + minigames/
│       ├── data/                   # phases.js, towers.js, enemies.js, levels.js
│       └── audio/CellMusic.js
└── pages/                         # One file per view (+ template.jsx scaffolds)
supabase/
├── schema.sql                     # Tables, RLS, triggers
├── migrations/                    # Incremental schema migrations
└── seed_test_user.sql             # Dev-only test account (never run on prod)
```

---

## Environment Variables

Required in `.env.local`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The Supabase client throws at init if either is missing.

---

## Dev Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build → dist/
npm run lint      # ESLint check
npm run preview   # Preview production build
```

No test suite. No TypeScript. No typecheck script.

---

## Architectural Constraints (intentional)

- **No React Router** — view-string state keeps the app self-contained with no URL changes
- **Static data only** — all lesson/quiz content is JS files; no CMS or dynamic fetching
- **No external component library** — all UI is custom Tailwind components
- **GSAP + Lenis scope** — animation logic stays out of business logic components
- **No hardcoded colors** — always use Tailwind tokens or CSS variables
- **Event bus only** for React ↔ Phaser — never pass React state/refs into Phaser scenes
- **One `Phaser.Game` per mount** — guarded with `useRef` to be StrictMode safe
