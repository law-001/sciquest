# SciQuest — Project Summary
Last updated: May 17, 2026

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
admin | teachers | teacher-portal | profile
games | game-play
```

Portal views (`admin`, `teacher-portal`, `game-play`) hide the Navbar via an `isPortalView` flag.

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

## Key File Locations

```
src/
├── App.jsx                        # Root — routing, global state
├── main.jsx                       # React 19 entry (createRoot)
├── index.css                      # Global styles + Tailwind config
├── context/
│   ├── AuthContext.jsx             # Auth state + Supabase methods
│   └── ThemeContext.jsx            # Dark/light toggle
├── lib/
│   ├── supabase.js                 # Supabase client init
│   ├── users.js                    # Admin/teacher DB queries
│   ├── utils.js                    # cn() classname helper
│   └── games/                      # registry.js + progress.js
├── games/
│   ├── _shared/                    # Engine infra (eventBus, scenes, hooks)
│   └── matter-state-sandbox/       # Playable Phaser game
├── data/
│   ├── lessonsweek-01.js .. -20.js # 20 weeks of lesson content
│   └── quizzesweek-01.js .. -20.js # 20 weeks of quiz questions
├── components/
│   ├── lesson-slots/               # 10 lesson slot components + Sectionheading
│   ├── quiz-slots/                 # 10 quiz question components
│   ├── games/                      # Shared game UI (GameShell, GameCard…)
│   ├── layout/Navbar.jsx
│   ├── modals/AuthModal.jsx
│   ├── LessonTemplate.jsx
│   └── Quiztemplate.jsx
└── pages/                         # One file per view (+ template.jsx scaffolds)
supabase/
├── schema.sql                     # Tables, RLS, triggers
└── functions/                     # Edge functions
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
