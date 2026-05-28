# Dynamic Lessons & Quizzes — Teacher CRUD

## Context

Today, SciQuest's lessons and quizzes are **static** — defined in 40 hand-written files under `src/data/` (`lessonsweek-01.js` … `lessonsweek-20.js`, `quizzesweek-01.js` … `quizzesweek-20.js`). Each lesson uses a slot-based architecture: `layout[]` lists slot objects (`{ type, heading, data }`) which `LessonTemplate.jsx` renders via a `SLOT_MAP` of the 10 slot components in `src/components/lesson-slots/`. Quizzes work the same way — `QuizContainer.jsx` maps `question.type` to one of 10 components in `src/components/quiz-slots/`.

The goal is to make this **dynamic**: teachers can create, edit, and delete lessons and quizzes from the teacher portal — reusing the existing slot components for both rendering and authoring, so a teacher's edit view _is_ the student view (WYSIWYG).

**Locked decisions (from clarification):**

- **Scope**: Teachers can edit/delete **all** lessons (static + teacher-created). Static lessons get _forked on first edit_ — the static file stays as a seed; the DB row becomes the canonical version.
- **Media**: Image uploads go to **Supabase Storage** (1 GB free, plenty for ~30 MB of expected lesson media). Vercel Hobby is unaffected — uploads bypass it entirely.
- **Visibility**: Lessons are **global** — every student sees every lesson, regardless of which teacher created it. Matches the existing static-weeks mental model.

**Constraints:**

- Existing 20 weeks must keep working unchanged for students until/unless a teacher edits them.
- Slot components in `src/components/lesson-slots/` and `src/components/quiz-slots/` are reused as-is in both student and teacher views — no duplication.
- `matter-state-sandbox` and other completed games must not be touched.

---

## Architecture

### Three-layer model

```
┌─ Static seed ────────────────────┐    ┌─ Supabase DB ────────────────┐
│  src/data/lessonsweek-*.js       │    │  lessons      (overrides)    │
│  src/data/quizzesweek-*.js       │    │  quizzes      (overrides)    │
│  (read-only, shipped in bundle)  │    │  lesson-media (Storage)      │
└──────────────┬───────────────────┘    └──────────────┬───────────────┘
               │                                       │
               └────────── MERGE LAYER ────────────────┘
                          (LessonsContext)
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
  LessonsPage              LessonContentPage           TeacherPortalPage
  QuizPage                 (student view)              (editor + CRUD)
```

**Merge rule** (deterministic, order matters):

1. For each static lesson in `WEEKS_DATA`: if a DB row with the same `id` exists, use the DB row; if it has `is_hidden=true`, drop it.
2. Append all DB-only lessons (where `is_custom=true`) into their target week, sorted by `lesson_number`.
3. Same logic for quizzes (keyed by `lesson_id`).

This means: the static files are a **seed**, never mutated. The DB layers overrides on top. Deleting a static lesson sets `is_hidden=true` (recoverable). Deleting a custom lesson hard-deletes.

---

## Database

### Schema (Supabase / Postgres)

```sql
-- ── Lessons (overrides for static, full row for custom) ──────────────
CREATE TABLE lessons (
  id text PRIMARY KEY,                  -- "lesson-1" overrides static; "lesson-<uuid>" for custom
  week_id text NOT NULL,                -- "week-1"
  lesson_number int NOT NULL,
  title text NOT NULL,
  badge text,
  subtitle text,
  read_time text DEFAULT '~15 min read',
  xp int DEFAULT 50,
  hero_image_url text,                  -- Supabase Storage URL or external
  hero_image_alt text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,    -- ["Overview", "Breakdown", ...]
  references jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{label, url}]
  layout jsonb NOT NULL DEFAULT '[]'::jsonb,      -- [{type, heading, data}, ...]
  is_custom boolean NOT NULL DEFAULT false,       -- true = no static counterpart
  is_hidden boolean NOT NULL DEFAULT false,       -- soft-delete for static IDs
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lessons_week_id_idx ON lessons(week_id);
CREATE INDEX lessons_visibility_idx ON lessons(is_hidden) WHERE is_hidden = false;

-- ── Quizzes (overrides for static, full row for custom) ──────────────
CREATE TABLE quizzes (
  lesson_id text PRIMARY KEY,           -- matches lessons.id (1:1)
  title text NOT NULL,
  description text,
  time_limit int DEFAULT 900,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_custom boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────────
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can SELECT
CREATE POLICY lessons_select_all ON lessons FOR SELECT
  TO authenticated USING (true);
CREATE POLICY quizzes_select_all ON quizzes FOR SELECT
  TO authenticated USING (true);

-- Only teachers/admins can INSERT / UPDATE / DELETE
CREATE POLICY lessons_write_teacher ON lessons FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  );

CREATE POLICY quizzes_write_teacher ON quizzes FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  );

-- ── Auto-bump updated_at ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION bump_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$ LANGUAGE plpgsql;

CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION bump_updated_at();
CREATE TRIGGER quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION bump_updated_at();
```

### Storage bucket

```
Bucket name: lesson-media
Public: YES (so <img src=...> just works)
File size limit: 5 MB (per-file)
Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
RLS:
  - SELECT (read): anyone
  - INSERT/UPDATE/DELETE: teacher/admin role only (same check as tables)
File path convention: `lesson-media/<lessonId>/<timestamp>-<sanitized-name>.<ext>`
```

---

## New files

### Data access layer

**`src/lib/lessons.js`** (new) — mirrors the pattern in `src/lib/publishedWeeks.js`:

- `fetchAllLessons()` → `Promise<Map<lessonId, DbLesson>>`
- `upsertLesson(lesson)` → `Promise<DbLesson>` (handles both fork-on-edit of static AND new custom)
- `deleteLesson(lessonId, { isStatic })` → if `isStatic`, sets `is_hidden=true`; else hard-deletes
- `restoreStaticLesson(lessonId)` → deletes the DB row so the static seed shows again
- `subscribeToLessonChanges(onChange)` → realtime subscription (channel pattern from `publishedWeeks.js:114-143`)
- `uploadLessonImage(file, lessonId)` → uploads to `lesson-media/<lessonId>/...`, returns public URL
- localStorage cache: `sq_lessons_cache` (Map serialized) for fast first paint

**`src/lib/quizzes.js`** (new) — same shape as `lessons.js`:

- `fetchAllQuizzes()` → `Promise<Map<lessonId, DbQuiz>>`
- `upsertQuiz(quiz)`, `deleteQuiz(lessonId, { isStatic })`, `restoreStaticQuiz(lessonId)`
- `subscribeToQuizChanges(onChange)`
- localStorage cache: `sq_quizzes_cache`

### Merge layer

**`src/context/LessonsDataContext.jsx`** (new) — single source of truth for the merged dataset:

```jsx
export function LessonsDataProvider({ children }) {
  const [dbLessons, setDbLessons] = useState(/* from cache */);
  const [dbQuizzes, setDbQuizzes] = useState(/* from cache */);

  useEffect(() => {
    fetchAllLessons().then(setDbLessons);
    fetchAllQuizzes().then(setDbQuizzes);
    const unsub1 = subscribeToLessonChanges((map) => setDbLessons(map));
    const unsub2 = subscribeToQuizChanges((map) => setDbQuizzes(map));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const weeks = useMemo(() => mergeWeeks(WEEKS_DATA, dbLessons), [dbLessons]);
  const getQuiz = useCallback(
    (lessonId) => mergeQuiz(staticQuiz(lessonId), dbQuizzes.get(lessonId)),
    [dbQuizzes],
  );

  return (
    <Ctx.Provider value={{ weeks, getQuiz, dbLessons, dbQuizzes }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLessonsData = () => useContext(Ctx);
```

`mergeWeeks` and `mergeQuiz` helpers live in this file. The merge logic is the deterministic 2-step rule from the architecture section above.

Mount the provider in `src/main.jsx` (or just outside `<App />` in `src/App.jsx`).

### Editor screens

**`src/pages/LessonEditorPage.jsx`** (new) — WYSIWYG lesson editor:

- Renders the lesson with **the same slot components students see** (`SLOT_MAP` from `LessonTemplate.jsx`).
- Wraps each `<section>` in an `EditableSlotFrame` that adds a hover toolbar: **Edit · Move up · Move down · Delete**.
- Inserts an **"+ Add Section"** affordance between every pair of slots and at the start/end.
- Header has inline-editable lesson metadata (title, subtitle, badge, XP, read time, hero image).
- Floating top toolbar: **Save** (calls `upsertLesson`) / **Cancel** / **Preview as student**.
- Two modals managed inside the editor:
  - `SlotPickerModal` — grid of the 10 slot types with icon + name + 1-line description. Click → opens edit modal for empty data of that type.
  - `SlotEditModal` — renders the appropriate `<XForm>` based on slot type. Form submits → updates `layout[index].data`.

**`src/pages/QuizEditorPage.jsx`** (new) — same pattern, for quizzes:

- Renders each question in its student-view slot component, with hover toolbar.
- "+ Add Question" picker for the 10 question types.
- `QuestionEditModal` swaps in the appropriate `<XQuestionForm>`.
- Save → calls `upsertQuiz`.

### Slot edit forms (lesson)

One per slot type, in `src/components/lesson-slot-forms/`:

| File                   | Form fields                                              | Maps to data shape from  |
| ---------------------- | -------------------------------------------------------- | ------------------------ |
| `IntroForm.jsx`        | paragraphs (rich-text array), didYouKnow                 | `Introsection.jsx`       |
| `KeyTermsForm.jsx`     | terms[] of {term, desc}                                  | `Keytermssection.jsx`    |
| `ReasonCardsForm.jsx`  | cards[] of {title, desc, …}                              | `Reasoncardssection.jsx` |
| `ImageCardsForm.jsx`   | cards[] with `<ImagePicker>`                             | `Imagecardssection.jsx`  |
| `ConceptListForm.jsx`  | concepts[]                                               | `Conceptlistsection.jsx` |
| `ApplicationsForm.jsx` | applications[]                                           | `Applicationsection.jsx` |
| `TimelineForm.jsx`     | intro + steps[] of {num, title, description, tip, color} | `Timelinesection.jsx`    |
| `ComparisonForm.jsx`   | items[]                                                  | `Comparisonsection.jsx`  |
| `ScenarioForm.jsx`     | description, options                                     | `Scenariosection.jsx`    |
| `DiagramForm.jsx`      | image picker + caption                                   | `Diagramsection.jsx`     |

Plus an `index.js` barrel and a `FORM_MAP` mirroring `SLOT_MAP`:

```js
export const FORM_MAP = { intro: IntroForm, keyTerms: KeyTermsForm, ... };
```

### Slot edit forms (quiz)

One per question type, in `src/components/quiz-slot-forms/`:

| File                      | Form fields                                             |
| ------------------------- | ------------------------------------------------------- |
| `MultipleChoiceForm.jsx`  | question, options[], correctAnswer, explanation, points |
| `TrueFalseForm.jsx`       | question, correctAnswer (bool), explanation, points     |
| `FillInTheBlanksForm.jsx` | template with `[blank]` markers, answers[]              |
| `ShortAnswerForm.jsx`     | question, acceptedAnswers[], points, rubric             |
| `EssayForm.jsx`           | question, minWords, points, rubric                      |
| `MatchingForm.jsx`        | leftItems[], rightItems[], correctPairs map             |
| `IdentificationForm.jsx`  | question, correctAnswer, acceptedAnswers[], points      |
| `OrderingForm.jsx`        | items[], correctOrder[]                                 |
| `PictureBasedForm.jsx`    | image picker, question, options[], correctAnswer        |
| `CaseStudyForm.jsx`       | scenario, subQuestions[]                                |

Plus an `index.js` and `QUESTION_FORM_MAP` mirroring `QUESTION_MAP` in `QuizContainer.jsx:41`.

### Shared components

- **`src/components/ImagePicker.jsx`** (new) — `<input type=file>` + drag-drop zone. Calls `uploadLessonImage(file, lessonId)`. Shows preview. Stores returned URL via `onChange(url)`. Also accepts a "paste URL" tab for external images.
- **`src/components/EditableSlotFrame.jsx`** (new) — wraps a slot component with hover-only toolbar. Uses CSS `:hover` + `opacity` so it stays invisible during normal scrolling.
- **`src/components/SlotPickerModal.jsx`** (new) — grid picker for slot types. Reusable between lesson and quiz editors via a `types` prop.

---

## Files to modify

| File                                | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/App.jsx`                       | Add `currentView` values: `"teacher-edit-lesson"`, `"teacher-edit-quiz"`. Pass `editingLessonId` and `editingQuizLessonId` in state. Add to `isPortalView` (line ~791). Replace `import { WEEKS_DATA } from "../data/lessonsweek-01"` with `useLessonsData()` everywhere `WEEKS_DATA` is currently read inline.                                                                                                                                                                                               |
| `src/main.jsx`                      | Wrap `<App />` in `<LessonsDataProvider>`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `src/pages/LessonContentPage.jsx`   | Replace `WEEKS_DATA` import with `useLessonsData()`. Lines 1–4, 17–21 — keep API identical, just swap source.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `src/pages/QuizPage.jsx`            | Replace `getQuizByLesson` import with `useLessonsData().getQuiz(lessonId)`.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `src/pages/LessonsPage.jsx`         | Same swap: use merged weeks from context.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `src/pages/TeacherPortalPage.jsx`   | **Major changes in `LessonsSlot` (lines 895–1219):** add **Edit** + **Delete** buttons on every lesson card (lines 1049–1076 area), and a **+ Create Lesson** button in the expanded-week toolbar. Same treatment for the Quizzes tab. Replace `WEEKS_DATA` (lines 50, 92, 919, 942, 954, 962, 1113…) with merged data from context. The `getManualQuestionTypes` / `getAnswerSnippet` / `getRubricItems` helpers (lines 1244–1308) that call `getQuizByLesson` need to swap to `useLessonsData().getQuiz()`. |
| `src/components/LessonTemplate.jsx` | No structural changes — just expose `SLOT_MAP` (line 102) as a **named export** so the editor reuses it.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `src/components/QuizContainer.jsx`  | Same: export `QUESTION_MAP` (line 41) and `TYPE_LABELS` (line 54).                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `src/data/quizzesweek-01.js`        | `getQuizByLesson` stays for backward-compat but the context's `getQuiz` is the new source of truth. Eventually `getQuizByLesson` can be deleted, but not in this PR.                                                                                                                                                                                                                                                                                                                                          |

**Note**: `src/data/lessonsweek-*.js` files are **never modified**. They remain the seed.

---

## Routing flow

```
TeacherPortalPage (Lessons tab)
  ├── Click "+ Create Lesson" on expanded week
  │     → setEditingLessonId(null); setEditingWeekId(week.id)
  │     → onNavigate("teacher-edit-lesson")
  │     → LessonEditorPage renders with a blank lesson template
  │
  ├── Click "Edit" on lesson card
  │     → setEditingLessonId(lesson.id); setEditingWeekId(lesson.weekId)
  │     → onNavigate("teacher-edit-lesson")
  │     → LessonEditorPage renders, deep-copying current merged lesson into local state
  │
  └── Click "Delete" on lesson card → confirm modal → deleteLesson(id, { isStatic })
```

Same shape for quizzes (`teacher-edit-quiz` view, `editingQuizLessonId` state).

The editor's **Save** button:

1. Validates required fields (title, week_id, at least one slot).
2. Calls `upsertLesson(lessonStateAsRow)` — this is the **fork-on-edit moment** for static lessons: the upsert writes a new row keyed by the static `id`, and from then on the merge layer prefers the DB version.
3. On success → toast + `onNavigate("teacher-portal")`.

---

## Implementation phases

Break the work into 6 incremental milestones. **Each milestone should ship a working app** — don't merge a half-done state.

### Phase 1 — Foundation (no UI changes yet)

**Goal**: DB and data layer in place; existing app still uses static files.

1. Run the SQL above in Supabase (tables, RLS, trigger, storage bucket).
2. Create `src/lib/lessons.js` and `src/lib/quizzes.js` with all functions.
3. Create `src/context/LessonsDataContext.jsx`. Mount it in `src/main.jsx`.
4. Add the merge helpers but do **not** swap any consumer yet.
5. **Verify**: Manually `INSERT` one test lesson row in Supabase, refresh, log `useLessonsData().weeks` from a test component — confirm the merge works.

### Phase 2 — Swap consumers to merged data

**Goal**: All read paths go through context, but UI looks identical.

1. Replace `WEEKS_DATA` imports in `LessonsPage.jsx`, `LessonContentPage.jsx`, `QuizPage.jsx`, `TeacherPortalPage.jsx`.
2. Replace `getQuizByLesson` calls with `useLessonsData().getQuiz()`.
3. **Verify**: Existing 20 weeks render identically for a student. Toggle the test row from Phase 1 to confirm DB overrides win.

### Phase 3 — Lesson editor (forms + page)

**Goal**: Teachers can create and edit lessons end-to-end.

1. Export `SLOT_MAP` from `LessonTemplate.jsx`.
2. Build `ImagePicker.jsx` (uploads to `lesson-media` bucket).
3. Build the 10 forms in `src/components/lesson-slot-forms/`. Start with `IntroForm` (simplest), test end-to-end, then knock out the rest.
4. Build `SlotPickerModal.jsx`, `EditableSlotFrame.jsx`.
5. Build `LessonEditorPage.jsx`.
6. Wire `currentView === "teacher-edit-lesson"` in `App.jsx`.
7. **Verify**: Create a brand-new lesson in week 1 → it appears on the student lessons page → opens correctly → render every slot type at least once.

### Phase 4 — Lesson CRUD on teacher portal

**Goal**: Teachers reach the editor from the portal; can delete lessons.

1. Add **Edit** + **Delete** buttons to lesson cards in `LessonsSlot`.
2. Add **+ Create Lesson** button in the expanded-week toolbar.
3. Delete confirmation modal (reuse `RemoveUserModal` pattern from `AdminDashboardPage.jsx:139-183`).
4. **Verify**: Edit a static lesson (e.g., lesson-1) → save → student sees the edit. Delete a static lesson → it disappears from student view. Delete a custom lesson → hard-deletes.

### Phase 5 — Quiz editor + CRUD

**Goal**: Mirror phases 3–4 for quizzes.

1. Export `QUESTION_MAP` from `QuizContainer.jsx`.
2. Build 10 forms in `src/components/quiz-slot-forms/`.
3. Build `QuizEditorPage.jsx`.
4. Add Edit/Delete/Create buttons on the Quizzes section of the teacher portal.
5. **Verify**: Edit quiz for lesson-1 → student takes the edited quiz → existing grading flow (essays, manual review) still works for the new quiz.

### Phase 6 — Polish

1. Realtime: confirm Supabase realtime subscription works across two browser windows (teacher edits → student sees within ~1s).
2. Add a "Restore default" button on edited static lessons (calls `restoreStaticLesson`).
3. Loading skeletons for the editor while data loads.
4. Empty-state copy for slot picker.
5. Keyboard nav: arrow keys to reorder slots in the editor.

---

## Design Handoff (from Claude Design)

**Authoritative UI reference** — every UI-touching phase (3, 4, 5, 6) must match this design:

> **https://api.anthropic.com/v1/design/h/ytOyWTNJu_VaaYFuI8Ooxw?open_file=Dynamic+Lessons+UI.html**

How to use it in a Claude Code session:

1. Fetch the URL with the `WebFetch` tool. Read its `README` first to understand the file layout.
2. Open `Dynamic Lessons UI.html` — that file contains the full visual spec for the lesson editor, slot picker, slot edit modals, hover toolbar (`EditableSlotFrame`), quiz editor, and the teacher-portal CRUD additions.
3. Match the HTML's layout, spacing, typography, colors, and component structure exactly. Where the handoff conflicts with the architecture in this plan, the **architecture wins** (data shapes, file names, routing) — but visual decisions defer to the handoff.
4. Reuse SciQuest tokens: warm cream `#FAF7F2` background, orange/teal/yellow accents, 12–16px rounded corners, existing SciQuest font. Don't introduce new fonts or palette colors not already in `CLAUDE.md`'s visual spec.
5. The handoff's HTML is a **static reference**, not code to copy verbatim. Translate it into React components that use the existing slot architecture, Tailwind tokens, and `ThemeContext` (dark mode must work).

---

## Deployment requirements (production, not localhost)

The feature must work on the deployed Vercel site, not just `npm run dev`. Before each UI-touching phase, verify these are in place; if any are missing, fix them as part of that phase.

1. **Vercel env vars** — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set in the Vercel project (Production, Preview, and Development scopes). If missing, the deployed build will silently fail to fetch lessons/quizzes. Confirm with `vercel env ls` or in the Vercel dashboard.
2. **Supabase Storage CORS** — the `lesson-media` bucket must allow the production origin (e.g., `https://sciquest.vercel.app` and any custom domain). Without this, image uploads work locally but 4xx in production. Add allowed origins under Storage → Policies → CORS.
3. **Supabase Auth redirect URLs** — Authentication → URL Configuration → Redirect URLs must include the production domain. If teachers can't log in on prod, RLS will block every write.
4. **Realtime enabled** — In Supabase, Database → Replication, enable realtime for the `lessons` and `quizzes` tables. Without this the realtime subscription is a no-op in production.
5. **RLS verified against prod data** — RLS policies reference `profiles.role`. Confirm the production `profiles` table has rows with `role IN ('teacher','admin')` for the accounts that need write access.
6. **Storage bucket is public** — `lesson-media` must be marked **Public** so `<img src=...>` works without signed URLs. If kept private, the editor and student views will need `createSignedUrl` calls — not in scope for this plan.
7. **Build-time guards** — `src/lib/lessons.js` and `src/lib/quizzes.js` must degrade gracefully when Supabase env vars are absent (return empty Maps, log a warning). Otherwise a misconfigured deploy crashes the whole app.

**Per-phase verification on deployed build:**

- After each UI-touching phase, push to a Vercel Preview, open the preview URL, log in as a real teacher account, and run the phase's verification steps there. **Do not rely on localhost behavior** — Supabase Storage CORS, redirect URLs, and env vars are deploy-environment concerns that localhost will not catch.

---

## How to instruct Claude Code for this

Don't try to one-shot the whole feature — the change surface is too large. Open a fresh Claude Code session per phase and paste the relevant prompt below. Each prompt is **self-contained** so context doesn't matter.

> **Phase 1 prompt**
> "Read the plan at `~/.claude/plans/soft-shimmying-beacon.md`. Execute **Phase 1 only**. Create the Supabase migration SQL in `supabase/migrations/<timestamp>_add_dynamic_lessons.sql`. Create `src/lib/lessons.js` and `src/lib/quizzes.js`, modeling them on `src/lib/publishedWeeks.js` (same caching + realtime pattern). These files must degrade gracefully if Supabase env vars are missing (return empty Maps, log a warning) — see the **Deployment requirements** section. Create `src/context/LessonsDataContext.jsx` and mount it in `src/main.jsx`. **Do not** modify any consumers yet — that's Phase 2. Finish with: (a) a verification snippet I can paste into any component, and (b) a checklist of Vercel/Supabase config to set before the next phase (env vars, Storage bucket + CORS, realtime replication, redirect URLs)."

> **Phase 2 prompt**
> "Read `~/.claude/plans/soft-shimmying-beacon.md`. Execute **Phase 2**. Swap every `WEEKS_DATA` import in `src/pages/{LessonsPage,LessonContentPage,QuizPage,TeacherPortalPage}.jsx` to use `useLessonsData()` from the context. Swap every `getQuizByLesson(...)` call to `useLessonsData().getQuiz(...)`. Don't touch any other behavior. Run `npm run lint:fix` and `npm run build` at the end. After the build passes, push to a Vercel Preview and confirm all 20 existing weeks still render on the deployed preview URL — not just localhost."

> **Phase 3 prompt**
> "Read `~/.claude/plans/soft-shimmying-beacon.md`. Then fetch the design handoff with WebFetch: **https://api.anthropic.com/v1/design/h/ytOyWTNJu_VaaYFuI8Ooxw?open_file=Dynamic+Lessons+UI.html** — read its README first, then open `Dynamic Lessons UI.html` for the visual spec. The implementation must match this handoff for the lesson editor, slot picker, slot edit modals, and hover toolbar. Execute **Phase 3** — the lesson editor. Start by exporting `SLOT_MAP` from `src/components/LessonTemplate.jsx` as a named export. Build `src/components/ImagePicker.jsx` (uploads to the `lesson-media` Supabase Storage bucket — confirm the bucket and its CORS allow the deployed origin per the **Deployment requirements** section). Build the 10 slot forms in `src/components/lesson-slot-forms/` — read each slot component in `src/components/lesson-slots/` to mirror its data shape exactly. Build `SlotPickerModal.jsx` and `EditableSlotFrame.jsx`. Build `src/pages/LessonEditorPage.jsx`. Wire `currentView === 'teacher-edit-lesson'` in `src/App.jsx`. Treat it as a portal view (no navbar). After the build passes, deploy to a Vercel Preview and verify image upload + lesson save works on the **deployed URL**, not just localhost."

> **Phase 4 prompt**
> "Read `~/.claude/plans/soft-shimmying-beacon.md`. Then fetch the design handoff with WebFetch: **https://api.anthropic.com/v1/design/h/ytOyWTNJu_VaaYFuI8Ooxw?open_file=Dynamic+Lessons+UI.html** — the handoff shows the teacher-portal lesson card with Edit/Delete buttons and the expanded-week toolbar. Match it. Execute **Phase 4**. In `src/pages/TeacherPortalPage.jsx`, modify `LessonsSlot` (lines 895–1219): add **Edit** and **Delete** buttons to each lesson card (around lines 1049–1076), and a **+ Create Lesson** button to the expanded-week toolbar (around lines 996–1044). Use the existing `RemoveUserModal` pattern in `src/pages/AdminDashboardPage.jsx:139-183` for delete confirmation. Wire the buttons to set `editingLessonId` + `editingWeekId` in App state and navigate to `'teacher-edit-lesson'`. Verify on a Vercel Preview, signed in as a real teacher account — RLS must allow the writes in production."

> **Phase 5 prompt**
> "Read `~/.claude/plans/soft-shimmying-beacon.md`. Then fetch the design handoff with WebFetch: **https://api.anthropic.com/v1/design/h/ytOyWTNJu_VaaYFuI8Ooxw?open_file=Dynamic+Lessons+UI.html** — apply the same editor patterns (slot picker, edit modal, hover toolbar) to the quiz editor. Execute **Phase 5** — quiz editor and CRUD. Mirror everything Phase 3+4 did for lessons, but for quizzes. Export `QUESTION_MAP` from `src/components/QuizContainer.jsx`. Build the 10 quiz forms in `src/components/quiz-slot-forms/`. Build `src/pages/QuizEditorPage.jsx`. Add quiz Edit/Delete/Create UI to the teacher portal. Verify on a Vercel Preview deploy."

> **Phase 6 prompt**
> "Read `~/.claude/plans/soft-shimmying-beacon.md`. Then fetch the design handoff with WebFetch: **https://api.anthropic.com/v1/design/h/ytOyWTNJu_VaaYFuI8Ooxw?open_file=Dynamic+Lessons+UI.html** — use it for empty-state copy, loading skeletons, and the 'Restore default' button styling. Execute **Phase 6** — polish. Verify realtime sync works across two browser windows **on the deployed Vercel URL** (not localhost — realtime needs the table enabled in Supabase replication, which is a prod-only concern). Add a 'Restore default' button on edited static lessons. Add loading skeletons and empty-state copy. Implement keyboard arrow-key reordering for slots in the editor."

**Between phases:**

- Run `npm run lint` and `npm run build` — both must pass.
- Push to a **Vercel Preview** and smoke-test the new behavior on the preview URL. Localhost is not enough — Supabase Storage CORS, redirect URLs, env vars, and realtime are deploy-environment concerns.
- Commit each phase as a separate PR if reviewing externally; or a single PR per phase if solo.

---

## Verification (end-to-end smoke test, after all phases)

**Run every step on the deployed Vercel URL with a real Supabase-authenticated teacher account, not localhost.** Localhost will pass even when Storage CORS, redirect URLs, env vars, or realtime are misconfigured for production.

1. **Static unchanged**: log out → log in as student → all 20 weeks render exactly as before. No console errors. Existing quizzes work.
2. **Create custom lesson**: log in as teacher → Lessons tab → Week 1 → "+ Create Lesson" → fill title, add an `intro` slot, add an `imageCards` slot with an uploaded image, save. Switch to student view → new lesson appears in Week 1 → opens → both slots render correctly with the uploaded image visible.
3. **Edit static lesson**: as teacher → Week 1 → Edit "Uses of Scientific Models" → change the heading on the intro slot → save. Switch to student → see the edit. Verify in Supabase that a row with `id='lesson-1'` exists.
4. **Restore static**: as teacher → click "Restore default" on the edited lesson → confirm. Student sees the original static content again. Supabase row for `lesson-1` is gone.
5. **Delete static lesson**: as teacher → delete "Uses of Scientific Models". Student no longer sees it in Week 1's list. Supabase row has `is_hidden=true`.
6. **Delete custom lesson**: as teacher → delete the lesson created in step 2. Hard-deleted from Supabase. Gone from student view.
7. **Edit quiz**: as teacher → edit quiz for lesson-3 → add a `multiple-choice` question → save. Student takes the quiz → new question appears and is auto-graded correctly. The existing manual-grading flow in `QuizCheckingSlot` (`TeacherPortalPage.jsx:1310`) still works for any essay questions on the lesson.
8. **Realtime**: open two browser windows. Window A (teacher) edits a lesson and saves. Window B (student or another teacher) sees the change without refresh.
9. **RLS**: as a student account, try to call `supabase.from('lessons').insert(...)` from devtools — must be rejected.
10. **Image storage**: upload several images, then delete the lesson — confirm orphaned images are cleaned up (or, if not implemented in Phase 1, file a TODO for a later cleanup job).

---

## Critical files reference

- **Slot architecture**: `src/components/LessonTemplate.jsx:102-113` (SLOT_MAP), `:514-525` (layout iteration)
- **Lesson data shape**: `src/data/lessonsweek-01.js:36-160` (week01 + lesson-1 structure)
- **Slot exports**: `src/components/lesson-slots/index.js` (10 slots)
- **Quiz runner**: `src/components/QuizContainer.jsx:41-52` (QUESTION_MAP), `:54-65` (TYPE_LABELS)
- **Quiz slot exports**: `src/components/quiz-slots/index.js` (10 questions)
- **Quiz data shape**: `src/data/quizzesweek-01.js` (`QUIZZES_DATA` + `getQuizByLesson`)
- **Teacher portal Lessons tab**: `src/pages/TeacherPortalPage.jsx:895-1219` (LessonsSlot)
- **Teacher portal Quiz Checking**: `src/pages/TeacherPortalPage.jsx:1310+` (QuizCheckingSlot)
- **Persistence pattern to copy**: `src/lib/publishedWeeks.js` (Supabase + localStorage cache + realtime)
- **Modal/CRUD pattern to copy**: `src/pages/AdminDashboardPage.jsx:139-183` (RemoveUserModal), `:236-328` (InviteTeacherModal)
- **Existing Supabase client**: `src/lib/supabase.js`
- **Auth + role**: `src/context/AuthContext.jsx` — `profile.role` ∈ `'student' | 'teacher' | 'admin'`
- **Routing & portal-view flag**: `src/App.jsx:791-795` (`isPortalView`)
