# SciQuest — Complete System Overview

## What Is SciQuest?

SciQuest is a **Grade 7 Science e-learning platform** built entirely in the browser — no mobile app, no backend server. It covers 20 weeks of curriculum (Scientific Models → Energy Flow & Biological Organization), lets students read lessons, take quizzes, and play interactive science games, all while earning XP, levelling up, and unlocking achievements.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3 + Lenis (smooth scroll) |
| Icons | Lucide React |
| Game Engine | Phaser 3.90 (with built-in Matter.js physics) |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Routing | **None** — custom view-string state in `App.jsx` |

No React Router. Navigation is a single `currentView` string that switches between named page components inside a `switch` statement.

---

## Project Folder Map

```
src/
├── App.jsx                    ← Root — routing, global state, XP logic
├── context/
│   ├── AuthContext.jsx        ← Supabase session + profile
│   └── ThemeContext.jsx       ← Dark/light mode toggle
├── pages/
│   ├── LandingPage.jsx
│   ├── LessonsPage.jsx        ← Week grid with filter + search
│   ├── LessonContentPage.jsx  ← Thin wrapper → LessonTemplate
│   ├── QuizPage.jsx           ← Thin wrapper → QuizContainer
│   ├── GamesHubPage.jsx
│   ├── GamePlayPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── TeacherPortalPage.jsx
│   └── TeacherSetupPage.jsx
├── components/
│   ├── LessonTemplate.jsx     ← THE slot-rendering engine
│   ├── QuizContainer.jsx      ← Quiz runner
│   ├── lesson-slots/          ← 10 content block components
│   ├── quiz-slots/            ← 10 question type components
│   └── layout/Navbar.jsx
├── data/
│   ├── lessonsweek-01.js      ← Aggregates all 20 weeks + WEEKS_DATA export
│   ├── lessonsweek-02.js … lessonsweek-20.js
│   ├── quizzesweek-01.js      ← Aggregates all quiz data
│   └── quizzesweek-02.js … quizzesweek-20.js
├── games/
│   ├── matter-state-sandbox/  ← COMPLETE — do not touch
│   ├── mystery-lab/
│   ├── cell-division-defense/
│   └── _shared/               ← Shared game infrastructure (EventEmitter, base scene)
├── lib/
│   ├── games/registry.js      ← Central game catalogue
│   ├── progress.js            ← All Supabase read/write for student progress
│   ├── achievements.js        ← Achievement keys, labels, XP values
│   ├── achievements-store.js  ← Supabase sync for achievements
│   ├── xp-config.js           ← Level thresholds
│   ├── publishedWeeks.js      ← Teacher-controlled quiz lock
│   └── supabase.js            ← Supabase client singleton
└── assets/                    ← Images imported directly (Vite handles hashing)
```

---

## Routing — How Navigation Works

There is **no URL bar change**. The entire app is a single-page shell.

```jsx
// App.jsx (simplified)
const [currentView, setCurrentView] = useState('home');

const renderView = () => {
  switch (currentView) {
    case 'home':         return <LandingPage ... />;
    case 'lessons':      return <LessonsPage ... />;
    case 'lesson-content': return <LessonContentPage ... />;
    case 'quiz':         return <QuizPage ... />;
    case 'games':        return <GamesHubPage ... />;
    case 'game-play':    return <GamePlayPage ... />;
    case 'profile':      return <ProfilePage ... />;
    case 'admin':        return <AdminDashboardPage ... />;
    case 'teacher-portal': return <TeacherPortalPage ... />;
    case 'teacher-setup':  return <TeacherSetupPage ... />;
  }
};
```

Every page receives an `onNavigate(view, payload?)` prop to switch views. Portal views (admin, teacher-portal, game-play, teacher-setup) hide the Navbar via the `isPortalView` flag.

---

## Authentication & Roles

Three roles exist: **student**, **teacher**, **admin**.

`AuthContext.jsx` wraps Supabase Auth. On login it first checks the `staff` table; if found the user is teacher/admin. Otherwise it checks the `students` table and synthesizes `role: 'student'`. The resulting `profile` object is available everywhere via `useAuth()`.

On refresh, `App.jsx` redirects by role:
- `admin` → `'admin'` view
- `teacher` → `'teacher-portal'` view
- `student` → `'lessons'` view

Teacher invite flow: Supabase sends a magic link. `App.jsx` reads `?type=invite` from the URL synchronously (via `useRef`, before any async runs) and starts at `'teacher-setup'` view instead of home.

---

## The Lesson Data Format

All lesson content lives in plain JS files — no CMS, no API call. Each file exports a `week` object:

```js
// lessonsweek-01.js (structure)
const week01 = {
  id: "week-1",
  weekNumber: 1,
  title: "Scientific Models",
  category: "Scientific Method",
  lessons: [
    {
      id: "lesson-1",
      title: "Uses of Scientific Models",
      badge: "Lesson 1",
      subtitle: "...",
      readTime: "~15 min read",
      xp: 50,
      heroImage: microscope,   // imported asset
      sections: ["Overview", "Key Concepts", "Fundamentals", ...],
      layout: [                // ← THIS drives everything
        { type: "intro",       heading: "Overview",      data: { paragraphs: [...], didYouKnow: "..." } },
        { type: "keyTerms",    heading: "Key Concepts",  data: { terms: [...] } },
        { type: "reasonCards", heading: "Fundamentals",  data: { intro: "...", reasons: [...] } },
        { type: "conceptList", heading: "Breakdown",     data: { concepts: [...] } },
        { type: "comparison",  heading: "Understanding", data: { left: {...}, right: {...} } },
        { type: "diagram",     heading: "Applications",  data: { nodes: [...] } },
      ],
    },
  ],
};
```

`lessonsweek-01.js` is the **aggregator**: it imports all 20 week files and exports a single `WEEKS_DATA` array. Every page that needs lesson data imports only `WEEKS_DATA` from this one file.

---

## The Slot-Map System — How Lessons Render

This is the core architectural pattern for lesson content.

### Step 1 — The SLOT_MAP (LessonTemplate.jsx:31)

```js
const SLOT_MAP = {
  intro:       IntroSection,
  keyTerms:    KeyTermsSection,
  reasonCards: ReasonCardsSection,
  imageCards:  ImageCardsSection,
  conceptList: ConceptListSection,
  applications: ApplicationsSection,
  timeline:    TimelineSection,
  comparison:  ComparisonSection,
  scenario:    ScenarioSection,
  diagram:     DiagramSection,
};
```

This is a plain JavaScript object that maps a **string key → React component**.

### Step 2 — The Render Loop (LessonTemplate.jsx:434)

```jsx
{lesson.layout.map((slot, i) => {
  const Component = SLOT_MAP[slot.type];   // look up by type string
  if (!Component) return null;             // unknown type = skip silently
  return (
    <Component
      key={i}
      id={`section-${i}`}        // used for scroll tracking + TOC
      heading={slot.heading}     // the section title shown in the heading
      data={slot.data}           // all the content for this block
    />
  );
})}
```

**What this means:** The order and composition of a lesson's content blocks is entirely determined by the data file. To add a new section type, you add one entry to `SLOT_MAP` and one entry in the lesson's `layout[]`. No changes to `LessonTemplate.jsx` rendering logic needed.

### Step 3 — The Sidebar TOC is also generated from a loop

```jsx
// LessonTemplate.jsx
const sections = lesson?.sections ?? [];   // string array like ["Overview", "Key Concepts", ...]

{sections.map((s, i) => (
  <button key={i} onClick={() => scrollToSection(i)}>
    {s}
  </button>
))}
```

`sections[]` is a parallel array of heading strings in the lesson data. Index `i` in `sections[]` maps to `id="section-i"` on the rendered slot — that's how the TOC knows which DOM element to scroll to.

---

## All 10 Lesson Slot Types

Each slot component receives `{ id, heading, data }` and uses `IntersectionObserver` to animate in when scrolled into view (fade-up with staggered delays per item).

| Type key | Component | `data` shape | Visual |
|---|---|---|---|
| `intro` | `IntroSection` | `{ paragraphs[], didYouKnow? }` | Reading paragraphs + teal "Did You Know?" card |
| `keyTerms` | `KeyTermsSection` | `{ terms[{ term, desc }] }` | Numbered list of vocabulary definitions |
| `reasonCards` | `ReasonCardsSection` | `{ intro?, reasons[{ num, title, desc, content, color }] }` | 2-column card grid with colored left borders |
| `imageCards` | `ImageCardsSection` | `{ cards[{ image, title, desc }] }` | Image + caption cards |
| `conceptList` | `ConceptListSection` | `{ concepts[] }` | Numbered bullet list of concepts |
| `applications` | `ApplicationsSection` | `{ items[] }` | Application examples list |
| `timeline` | `TimelineSection` | `{ intro?, steps[{ num, title, description, color, tip? }] }` | Vertical timeline with connector lines |
| `comparison` | `ComparisonSection` | `{ intro?, left{ label, color, items[] }, right{ label, color, items[] } }` | Side-by-side comparison cards |
| `scenario` | `ScenarioSection` | `{ intro?, scenarios[{ title, situation, question, skill }] }` | Scenario cards with "Think About It" callouts |
| `diagram` | `DiagramSection` | `{ title?, description?, nodes[{ id, label, color, connects[] }] }` | Node graph with connection labels |

### Animation pattern (consistent across all slots)

Every slot uses the same two-stage animation:

1. **Section reveal** — the whole `<section>` fades up when it enters the viewport (IntersectionObserver, threshold 0.1)
2. **Item stagger** — each item inside delays by `i * 80ms` (or `i * 100ms`) so they cascade in sequence

```jsx
// Example from KeyTermsSection — item stagger
style={{
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(12px)",
  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
}}
```

All animations use pure CSS transitions on `opacity` and `transform` — no GSAP inside lesson slots. GSAP + Lenis are used for landing page scroll effects.

---

## Scroll Progress & Lesson Completion

`LessonTemplate.jsx` has a `useEffect` that runs a `requestAnimationFrame`-throttled scroll listener. It calculates the percentage scrolled between `#section-0` (first slot) and `#lesson-cta` (the CTA at the bottom):

```js
const pct = ((window.scrollY - startY) / range) * 100;
```

- Progress is clamped 0–100 and shown in the sidebar `ProgressBar`.
- Once it hits 100%, `lessonCompletedRef.current = true` (a ref, not state) so it never drops back below 100 even if the user scrolls up.
- On hit, it calls `onLessonCompleteRef.current(lesson.id)` — which fires `handleLessonComplete` in `App.jsx`, awards XP, and persists to Supabase.

**A separate `Enter` key listener** lets students advance sections without a mouse: pressing Enter scrolls to the next `#section-i`, and on the last section scrolls to `#lesson-cta`.

---

## The Quiz System

### Data Format

```js
// quizzesweek-01.js
export const QUIZZES_WEEK_01 = {
  "lesson-1": {
    lessonId: "lesson-1",
    title: "...",
    timeLimit: 900,        // seconds
    questions: [
      { id: "q1", type: "essay",          question: "...", minWords: 50, points: 25 },
      { id: "q2", type: "multipleChoice", question: "...", options: [...], correctAnswer: "...", points: 10 },
      { id: "q3", type: "matching",       leftItems: [...], rightItems: [...], correctPairs: {...}, points: 50 },
      // etc.
    ],
  },
};
```

`quizzesweek-01.js` is also the aggregator: it imports all 20 quiz week files.

### 10 Quiz Question Types

| Type string | Component | Grading |
|---|---|---|
| `multipleChoice` | `MultipleChoiceQuestion` | Auto — client-side |
| `trueFalse` | `TrueFalseQuestion` | Auto — client-side |
| `fillInTheBlanks` | `FillInTheBlanks` | Auto — client-side |
| `matching` | `MatchingQuestion` | Auto — client-side |
| `ordering` | `OrderingQuestion` | Auto — client-side |
| `shortAnswer` | `ShortAnswer` | Auto — client-side (keyword match) |
| `identification` | `IdentificationQuestion` | Auto — client-side |
| `pictureBasedQuestion` | `PictureBasedQuestion` | Auto — client-side |
| `caseStudy` | `CaseStudyQuestion` | Auto — client-side |
| `essay` | `EssayQuestion` | **Manual — teacher grades in portal** |

`QuizContainer` maps question `type` strings to components the same way `LessonTemplate` maps slot types — a similar lookup object.

### Quiz Rules

- **3-attempt cap** per lesson quiz (enforced client-side by `priorAttempts` prop, DB-backed by counting rows)
- **XP scaling**: 1st attempt = full XP, 2nd = partial, 3rd = minimum
- **Quiz lock**: Teachers can lock a week's quiz via admin/teacher portal; `isWeekPublished()` checks a published list; locked quizzes show "Quiz Locked by Teacher" instead of the CTA button
- **Essay grading flow**: Essay answers are saved to Supabase with `pending_grade_count > 0`. `App.jsx` polls Supabase every **30 seconds** for newly graded essays and fires a "Quiz Graded" notification when the count drops to 0

---

## XP, Levels & Achievements

### XP Sources

| Source | Amount |
|---|---|
| Reading a lesson to 100% | `lesson.xp` (e.g. 50 XP) |
| Completing a quiz | Varies by score, attempt number |
| Unlocking an achievement | Fixed per achievement |

Total XP = `totalXpEarned(completedRows, quizAttempts) + totalAchievementXp(unlockedAchievements)`

Level thresholds live in `src/lib/xp-config.js`. `levelFromXp(xp)` returns the current level; `xpToNextLevel(xp)` returns progress to next level.

### Achievement System

Achievements are defined in `src/lib/achievements.js` (keys, labels, XP). They are synced via `syncAchievements()` which:

1. Derives which achievements the student now qualifies for from their progress context
2. Compares against already-unlocked set
3. Inserts newly unlocked ones to Supabase
4. Returns `{ unlocked, newlyUnlocked }` so `App.jsx` can show toast notifications

Two achievements are awarded via explicit UI actions (not progress):
- **Curious Explorer** — awarded when student scrolls the landing page (LandingPage fires `onExplore`)
- **BLACKED** — hidden achievement awarded by watching the About page portraits cross-fade dark

### Notification System

`App.jsx` maintains `notifications` (transient toasts) and `notifHistory` (bell history, persisted to `localStorage` per user). `pushNotification({ kind, ... })` adds to both. The `NotificationBubble` component shows the bell icon with unread count. The `XpToast` component shows pop-up toasts in the corner. Both are student-only.

---

## Games Platform

### Registry (`src/lib/games/registry.js`)

```js
export const GAMES = {
  "matter-state-sandbox": {
    id: "matter-state-sandbox",
    title: "Matter State Sandbox",
    engine: "phaser",
    category: "Chemistry",
    loader: () => import("../../games/matter-state-sandbox/index.jsx"),
    minRole: "student",
  },
  "mystery-lab": { engine: "react", ... },
  "cell-division-defense": { engine: "phaser", ... },
  "cell-explorer": { locked: true },     // coming soon
  "circuit-lab": { locked: true },       // coming soon
};
```

`getGameComponent(id)` uses `React.lazy()` with a memoised cache (via `_lazyCache` Map) so the same game is only lazily imported once even if called multiple times.

### React ↔ Phaser Communication

Games use an **event bus** (EventEmitter in `src/games/_shared/`). React never passes state into Phaser directly.

- React → Phaser: emit events like `setTemperature`, `setSubstance`, `reset`
- Phaser → React: emit events like `stateChanged`, `transitionStart`, `transitionComplete`

`Phaser.Game` is created exactly once per mount using a `useRef` guard — this makes it safe under React 18/19 StrictMode (which double-invokes effects in development).

### Game Contract

Every `games/<slug>/index.jsx` must accept these props:

```
{ user, profile, onExit, onProgressUpdate, initialChallengeId, reducedMotion, deviceTier }
```

`onProgressUpdate(payload)` is called when a challenge completes — this is how game progress eventually routes back to `App.jsx`.

---

## LessonsPage — Week Grid with Loops

`LessonsPage.jsx` renders the `WEEKS_DATA` array as a card grid. Key patterns:

**Icon map** — 20 Lucide icons are mapped by position to 20 weeks:
```js
const ICON_MAP = { Shapes, Atom, Thermometer, FlaskConical, ... };
// Each week's `icon` field (e.g. "Shapes") is looked up: ICON_MAP[week.icon]
```

**Filter + Search** — `useMemo` computes `displayedWeeks` by quarter range and search string. Quarter ranges are week number bands (1–10, 11–20, 21–30, 31–40).

**Scroll-trigger animation** — A `useScrollTrigger` custom hook wraps `IntersectionObserver` to trigger CSS class transitions when the card grid enters the viewport. Cards get staggered animation delays via `style={{ transitionDelay: \`${i * 50}ms\` }}`.

**Published weeks** — `getPublishedWeekIds()` reads from Supabase (teacher-controlled). Unpublished weeks show a lock icon and cannot be started.

---

## Theme System

`ThemeContext.jsx` stores `isDark` in state (initialized from `localStorage`, then respects `prefers-color-scheme` as fallback). Toggling adds/removes the `dark` class on `<html>`. Tailwind CSS's `dark:` variant handles all dark-mode styles — no separate stylesheet.

Background colors: `#fdf6e3` (warm cream) light / `stone-900` dark.

---

## Supabase Tables (inferred from queries)

| Table | Purpose |
|---|---|
| `staff` | Teachers + admins. Has `role`, `first_name`, `last_name`, `email` |
| `students` | Students. Has `first_name`, `last_name`, `section`, `avatar`, `student_number` |
| `student_progress` | One row per completed lesson. Has `lesson_id`, `week_id`, `xp_awarded`, `completed_at` |
| `quiz_attempts` | One row per quiz submission. Has `score`, `max_score`, `pending_grade_count`, `answers` |
| `achievements` | Unlocked achievement keys per student |
| `screen_time` | Aggregated seconds-on-site (global, not per-student) |

All Supabase queries go through `src/lib/progress.js` or `src/lib/achievements-store.js`. No component writes to Supabase directly.

---

## Key Architectural Decisions & Why

| Decision | Why |
|---|---|
| View-string routing instead of React Router | Keeps app self-contained, no URL changes, simpler state management for a school app |
| Slot-map pattern for lessons | Adding new content types only requires a new component + one map entry — lesson data files and `LessonTemplate` don't need to change |
| Static JS data files instead of a CMS | Zero API latency, fully offline-capable reading, version-controlled content |
| Event bus for React ↔ Phaser | React state and Phaser game state are completely decoupled — Phaser scenes can't hold React refs |
| One `Phaser.Game` per mount via `useRef` | Prevents double-initialisation under StrictMode |
| Essay grading via 30s poll | Simple, no WebSocket needed, matches the low-urgency nature of teacher grading |
| Optimistic UI for XP/completion | Lesson completion and quiz XP appear instantly; network failure only silently loses the DB write |

---

## Commands

```bash
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run lint      # ESLint check
npm run lint:fix  # ESLint auto-fix
```

No test suite. No TypeScript (plain JSX throughout).
