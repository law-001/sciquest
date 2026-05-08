# SciQuest — Project Instructions

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run lint      # ESLint check
npm run lint:fix  # ESLint auto-fix
```

No test suite. No typecheck script (plain JSX, no TypeScript).

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
