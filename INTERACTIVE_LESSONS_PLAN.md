# Interactive Lesson Sections + Teacher Materials


---

## Context

Lessons today are read-only. `LessonTemplate` walks `lesson.layout[]`, looks each entry's
`type` up in `SLOT_MAP`, and renders `<Component id heading data />`. All 10 existing slots
(`intro`, `keyTerms`, `timeline`, …) are presentational — a student scrolls, hits 100%, gets XP.
There is nothing to *do*.

Two gaps to close:

1. **Interactivity.** Students should manipulate something — flip, drag, sort, click, self-check.
2. **Supplementary materials.** Teachers need to attach YouTube links, PDFs, PPTs and Word docs
   to a lesson for students to open.

Teachers can already author lesson text and the hero image through `LessonEditorPage`
(slot picker → per-type form → `upsertLesson` → `lessons.layout` JSONB). Everything below
extends that same machinery rather than building a parallel system.

### The hardcoded-vs-teacher-authored tension (resolved)

You were right that interactives *feel* like they want to be hardcoded. The resolution is
**data-driven by default, with an escape hatch**:

- The 5 interactive types are ordinary slot types whose `data` a teacher fills in via a form.
  They work across all 20 weeks with no code changes.
- One extra type, `customWidget`, points at a hand-coded React component by id. When a lesson
  needs a bespoke simulation no generic form can express, you write the component, register it,
  and the teacher just places it. (This is also where a future embedded game would live.)

### Why this is cheap

`lessons.layout` is `jsonb NOT NULL DEFAULT '[]'` — free-form. Adding a block type touches
**only registries and components**. No migration for the blocks themselves. The migration below
exists solely for *materials* and *student completion tracking*.

### Scope decision: XP yes, achievements/grades no

Per your answer, interactive blocks may award XP (teacher-set, **default 0**) and show a ✓, but:

- They are **excluded from the achievements system** — `syncAchievements()` inputs are untouched.
- They are **excluded from grades** — nothing writes to `quiz_attempts`, nothing appears in the
  Gradebook or Quiz Checking tabs.
- They **do not gate lesson completion** — scroll-to-100% still completes a lesson, unchanged.

Interaction XP lives in its own table and is added to the profile XP total only. If you'd rather
have zero XP at all, that's a one-line change (drop the `xp` field from the block schema and skip
Phase 1's XP wiring) — flag it in this file and I'll adjust.

---

## What gets built

### The 5 interactive blocks (teacher-authorable)

| `type` | Student experience | `data` shape |
|---|---|---|
| `flipCards` | Grid of cards; click/Enter flips front→back. Done when all flipped. | `{ intro?, cards: [{ front, back, color }] }` |
| `quickCheck` | 1–3 inline MCQs with instant right/wrong + explanation. Unlimited retries. | `{ intro?, questions: [{ id, prompt, options[], correctIndex, explanation? }] }` |
| `hotspot` | Image with numbered markers; click one → popover with title/body. Done when all opened. | `{ image, imageAlt, intro?, points: [{ id, x, y, title, body }] }` |
| `sortBuckets` | Drag/tap items into 2–4 labelled categories, then Check. | `{ intro?, buckets: [{ id, label, color }], items: [{ id, text, bucketId }] }` |
| `dragLabel` | Drag/tap word chips onto marked drop zones on an image, then Check. | `{ image, imageAlt, intro?, labels: [{ id, text }], zones: [{ id, x, y, w, h, labelId }] }` |

`x/y/w/h` are **percentages of the image box**, so hotspots and drop zones stay correct at every
breakpoint.

### The escape hatch

| `type` | Purpose | `data` shape |
|---|---|---|
| `customWidget` | Mounts a hand-coded component from a registry. | `{ widgetId, height?, props? }` |

### Materials

| Surface | What it is |
|---|---|
| `MaterialsPanel` | Auto-renders near the bottom of every lesson (just above References) listing **all** of that lesson's attachments. Nothing to author — it appears when materials exist. |
| `materials` slot | Optional block a teacher drops mid-lesson to surface a *specific* subset where it's relevant. `data: { intro?, materialIds: [] }` (empty = show all). |

Supported kinds: `youtube`, `pdf`, `ppt`, `doc`, `link`.

---

## Architecture

### 1. Slot contract extension (the one real change to existing code)

Interactive blocks need per-student state, which `({ id, heading, data })` can't carry.
`LessonTemplate` will pass three additional props to **every** slot:

```jsx
// LessonTemplate.jsx — the render loop
{lesson.layout.map((slot, i) => {
  const Component = SLOT_MAP[slot.type];
  if (!Component) return null;
  return (
    <Component
      key={slot.id ?? i}
      id={`section-${i}`}
      heading={slot.heading}
      data={slot.data}
      blockId={slot.id ?? `idx-${i}`}          // stable key for persistence
      lessonId={lesson.id}
      onInteractionComplete={onInteractionComplete}
    />
  );
})}
```

The 10 existing slots destructure only `{ id, heading, data }`, so extra props are inert —
**zero edits to any existing slot component.**

Each interactive block owns its own answer state internally (like `OrderingQuestion` does).
`LessonTemplate` never holds answers. The block calls
`onInteractionComplete({ lessonId, blockId, xp })` exactly once, the first time it is solved.

`slot.id` is a new field the editor stamps on newly created blocks
(`crypto.randomUUID()`, mirroring `genId()` in `QuizEditorPage.jsx:53`). Legacy blocks with no
`id` fall back to index — acceptable because only interactive blocks persist anything.

### 2. Persistence

**In-progress state** → `localStorage`, key `sq_lesson_interact_${lessonId}_${blockId}`.
Same pattern as `QuizContainer`'s `quiz-answers-${lessonId}` (`QuizContainer.jsx:199-214`).
Survives refresh, never hits the network.

**Completion + XP** → new `lesson_interactions` table, upsert on
`(student_id, lesson_id, block_id)`. This deliberately mirrors `game_progress`'s key shape
(`src/lib/games/progress.js:21`) — a proven pattern in this repo. XP is frozen on first write so
it can't be farmed by resetting the block.

New lib `src/lib/lessonInteractions.js` (imports the strict client from `src/lib/supabase.js`,
matching `progress.js` — **not** the degrade-to-null pattern in `lessons.js`, which exists only so
teacher tooling doesn't crash a misconfigured deploy):

```js
export async function fetchInteractions(studentId)              // all rows, once on login
export async function recordInteraction({ studentId, lessonId, blockId, xp })
export function totalInteractionXp(rows)
```

### 3. Materials

New table `lesson_materials` + new Storage bucket `lesson-materials`.
New lib `src/lib/materials.js`, structured exactly like `src/lib/lessons.js`:
localStorage cache (`sq_materials_cache`) → `fetchAllMaterials()` → Realtime subscription →
`upsertMaterial` / `deleteMaterial` / `uploadMaterialFile`.

`uploadMaterialFile(file, lessonId)` copies `uploadLessonImage` (`src/lib/lessons.js:113`) but:
- allowed MIME: `application/pdf`, `.ppt/.pptx`, `.doc/.docx`
- size cap **20 MB** (docs are bigger than images)
- path `${lessonId}/${Date.now()}-${safeName}` — note the existing image path double-nests
  (`lesson-media/lesson-media/...`); the new bucket won't repeat that.

**Rendering:**
- **YouTube** — parse the id out of any `watch?v=` / `youtu.be/` / `/embed/` form. Render a
  **click-to-load facade**: static thumbnail + play button, swapped for a
  `youtube-nocookie.com/embed/<id>` iframe on click. Keeps YouTube's JS off every lesson page.
- **PDF** — "Open" (new tab, browsers render inline) + "Download".
- **PPT / Word** — "Download" primary. No third-party viewer by default; if you want in-browser
  preview later, the Office web viewer is a one-line addition but it sends the file URL to
  Microsoft, so it's opt-in per your call.
- Every row shows kind icon, title, and file size. Real `<a>` elements, ≥44px tap targets.

---

## Files

### New — interactive renderers (`src/components/lesson-slots/interactive/`)

| File | Notes |
|---|---|
| `InteractiveFrame.jsx` | Shared shell every interactive uses: `SectionHeading`, optional intro, an `aria-live` status line, a **Reset** button, and a "✓ Completed" pill. This is what makes the 6 blocks read as one family. |
| `FlipCardsSection.jsx` | Real `<button>` per card, `aria-pressed`, both faces in DOM (hidden face `aria-hidden`). |
| `QuickCheckSection.jsx` | Matches `MultipleChoiceQuestion`'s visual language exactly, but with retry semantics instead of exam semantics — that's why it isn't a reuse. |
| `HotspotSection.jsx` | Markers are buttons in tab order; popover closes on Esc. |
| `SortBucketsSection.jsx` | Uses `useDragOrTap`. |
| `DragLabelSection.jsx` | Uses `useDragOrTap`. |
| `CustomWidgetSection.jsx` | `React.Suspense` + lazy lookup, with a visible fallback for an unknown `widgetId`. |
| `MaterialsSection.jsx` | Inline materials slot; renders `MaterialsList`. |
| `useDragOrTap.js` | **Pointer-events** drag (`pointerdown/move/up` — works on mouse *and* touch) **plus** a tap-to-select-then-tap-to-place fallback that is also the keyboard path. No DnD library is installed and HTML5 drag-and-drop is dead on touch, so this hook is required, not optional. Two blocks need it, which justifies sharing it. |
| `customWidgets.js` | `CUSTOM_WIDGETS = { 'widget-id': { label, desc, load: () => import(...) } }` with a memoised `React.lazy` cache — same trick as `registry.js:8-12`. Ships with one example widget. |
| `index.js` | Barrel. |

### New — teacher forms (`src/components/lesson-slot-forms/`)

`FlipCardsForm.jsx`, `QuickCheckForm.jsx`, `HotspotForm.jsx`, `SortBucketsForm.jsx`,
`DragLabelForm.jsx`, `CustomWidgetForm.jsx`, `MaterialsForm.jsx`.

All follow the existing contract verbatim —
`({ initialHeading, initialData, onSubmit, onCancel }) → onSubmit(heading, data)` —
and reuse the `INPUT` / `LABEL` class constants and private `FormActions` footer that every
current form already declares. See `KeyTermsForm.jsx` as the reference shape.

Two are non-trivial and worth calling out:

- **`HotspotForm` / `DragLabelForm`** need a *visual placement editor*: teacher picks an image via
  the existing `<ImagePicker>` (`src/components/ImagePicker.jsx` — already reusable, `onChange`
  hands back a URL string), then **clicks on the preview to drop a point/zone**, converting the
  click to `%` coordinates. Points are listed beside the image with title/body/label fields and a
  delete button. This is the single largest UI in the plan; budget accordingly.
- **`CustomWidgetForm`** is just a `<select>` over `CUSTOM_WIDGETS` showing each widget's
  `label` + `desc`, plus an optional height field.

Both image-based forms take a `lessonId` prop threaded through `SlotEditModal`, exactly as
`QuizEditorPage` already threads it to `PictureBasedForm` (`QuizEditorPage.jsx:138`).

### New — materials UI

| File | Notes |
|---|---|
| `src/components/MaterialsList.jsx` | The shared row renderer (icon, title, size, actions). Used by both the panel and the inline slot. |
| `src/components/MaterialsPanel.jsx` | Student-facing bottom-of-lesson panel. Renders nothing when the lesson has no materials. |
| `src/components/MaterialPicker.jsx` | Teacher widget: tabbed **Upload file** / **YouTube or link**, drag-drop zone, progress spinner, validation, list of existing materials with reorder + delete. Modelled directly on `ImagePicker.jsx`. |

### New — libs & migration

- `src/lib/lessonInteractions.js`
- `src/lib/materials.js`
- `supabase/migrations/20260906000000_lesson_interactives_and_materials.sql`

### Modified

| File | Change |
|---|---|
| `src/components/slotMap.js` | +7 entries. |
| `src/components/lesson-slots/index.js` | Re-export the new sections. |
| `src/components/lesson-slot-forms/index.js` | +7 to `FORM_MAP`, `SLOT_META`, `DEFAULT_SLOT_DATA`; add a new `SLOT_GROUPS` export (`Content` / `Interactive` / `Materials`) so the picker isn't a flat wall of 17 tiles. |
| `src/components/SlotPickerModal.jsx` | +7 to `SLOT_ICONS` / `SLOT_COLORS`; render grouped by `SLOT_GROUPS`. |
| `src/components/LessonTemplate.jsx` | Pass `blockId` / `lessonId` / `onInteractionComplete` in the render loop; render `<MaterialsPanel>` immediately above `<ReferencesSection>`. |
| `src/pages/LessonContentPage.jsx` | Thread `onInteractionComplete` through. |
| `src/pages/LessonEditorPage.jsx` | Stamp `id: crypto.randomUUID()` in `handleTypeChosen`; pass `lessonId` into `SlotEditModal`; add a **Materials** block below Lesson Details hosting `<MaterialPicker>`. |
| `src/App.jsx` | `handleInteractionComplete` → `recordInteraction` + XP toast (reuses `pushNotification`); load interaction rows alongside progress on login; add `totalInteractionXp` into the XP total. |
| `src/lib/progress.js` | `totalXpEarned` gains an optional third argument for interaction rows (default `[]`, so every existing call site is unaffected). |
| `CLAUDE.md` | See "Docs" below. |

---

## Migration

`supabase/migrations/20260906000000_lesson_interactives_and_materials.sql`

```sql
-- Materials attached to a lesson (teacher-uploaded files + external links).
CREATE TABLE IF NOT EXISTS public.lesson_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  text NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('youtube','pdf','ppt','doc','link')),
  title      text NOT NULL,
  url        text NOT NULL,          -- public Storage URL, or the external link
  storage_path text,                 -- set for uploads, so delete can clean the object
  file_size  bigint,
  mime_type  text,
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lesson_materials_lesson_idx
  ON public.lesson_materials(lesson_id, sort_order);

-- Per-student completion of one interactive block. Mirrors game_progress's key shape.
CREATE TABLE IF NOT EXISTS public.lesson_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_id  text NOT NULL,
  block_id   text NOT NULL,
  completed  boolean NOT NULL DEFAULT true,
  xp_awarded int NOT NULL DEFAULT 0,   -- frozen on first write; no farming
  attempts   int NOT NULL DEFAULT 1,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id, block_id)
);
```

RLS follows the two patterns already in the repo:

- `lesson_materials` — read: any `authenticated`; write: the
  `EXISTS (SELECT 1 FROM staff …role IN ('teacher','admin'))` policy copied from
  `20260528100000_fix_dynamic_lessons_schema.sql:63-69`.
- `lesson_interactions` — a student may only read/write **their own** rows
  (`auth.uid() = student_id`); staff may read all (for a future report).

Plus a `bump_updated_at` trigger on `lesson_materials`, reusing the existing function.

**Storage buckets.** The migration also creates `lesson-materials` **and** idempotently creates
`lesson-media`. Exploration turned up that `lesson-media` exists in production but is created by
**no migration** — it was made by hand in the dashboard, so a fresh environment silently breaks
image upload. Fixing that here costs three lines and removes a real deploy hazard:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-media','lesson-media',true), ('lesson-materials','lesson-materials',true)
ON CONFLICT (id) DO NOTHING;
```
…with SELECT-for-`authenticated` and INSERT/UPDATE/DELETE-for-staff policies on
`storage.objects` scoped to those two bucket ids.

---

## Build order

**Phase 0 — foundation.** Migration; `lessonInteractions.js`; `materials.js`. Verify the two
tables and both buckets exist and RLS behaves (a student can write only their own row).

**Phase 1 — contract + first two blocks.** Extend the `LessonTemplate` render loop; build
`InteractiveFrame`; ship `flipCards` and `quickCheck` (no images, no dragging — fastest path to
proving the whole pipeline end-to-end); their two forms; registry entries; picker grouping; the
`App.jsx` XP wiring and toast. **At the end of Phase 1 a teacher can author an interactive block
and a student can complete it.**

**Phase 2 — image & pointer blocks.** `useDragOrTap`; `hotspot`, `sortBuckets`, `dragLabel` and
their forms, including the click-to-place editor. Largest phase.

**Phase 3 — materials end-to-end.** `MaterialPicker` in the editor; `MaterialsList`,
`MaterialsPanel` in `LessonTemplate`; the `materials` slot; YouTube facade; file type handling.

**Phase 4 — escape hatch.** `customWidgets.js` registry, `CustomWidgetSection`,
`CustomWidgetForm`, one worked example widget to prove the path.

Each phase ends with `npm run lint` clean and a hand-off note for you to test.

---

## Constraints these components must respect

These come from the codebase and the project rules, and are the easiest things to get wrong:

1. **No interpolated Tailwind classes.** Nine existing slots build classes like
   `` `bg-${item.color}-100` ``, and this project is Tailwind v4 **with no safelist** — those
   classes only survive if the literal string appears elsewhere in a scanned file. Every new
   component uses a **static lookup map** of complete class strings instead. (Worth knowing:
   `_ColorPicker` already offers colors that likely render as nothing today. Out of scope to fix,
   but don't add to the pile.)
2. **No `dangerouslySetInnerHTML`.** `IntroSection` injects teacher-authored HTML unsanitized
   (`Introsection.jsx:49`). New blocks render teacher text as **plain text** — no new injection
   surface.
3. **Accessibility is non-negotiable per the frontend rules.** Every interaction has a keyboard
   path (this is why `useDragOrTap` has a tap/keyboard mode rather than HTML5 DnD). Correct/wrong
   is signalled by **icon + text**, never color alone. Tap targets ≥44px. Status changes announced
   via `aria-live`.
4. **Respect `prefers-reduced-motion`.** Card flips and popovers become instant swaps. Handled in
   CSS inside each component — no prop plumbing needed.
5. **Match the existing visual language.** `rounded-xl` controls / `rounded-2xl` cards; `Card`
   wrapper; `primary`=orange selection, `secondary`=teal correct, `red`=wrong, `accent`=yellow XP;
   `IntersectionObserver` fade-up with `i * 80ms` stagger; cream `#fdf6e3` ground; full dark-mode
   variants (applied more consistently than the quiz slots manage).
6. **No new dependencies.** No dnd library, no PDF library. Pointer events and native `<iframe>`
   cover everything here.
7. **No `console.log` in committed code.**

---

## Two small fixes folded in

Both are in files this work already modifies, and both are live bugs:

- `LessonEditorPage.jsx:88` — `draftToDbRow` hardcodes `is_hidden: false`, so saving a lesson from
  the editor silently **un-hides** a lesson a teacher had hidden. Preserve the existing flag.
- The `lesson-media` bucket has no migration (covered above).

**Explicitly out of scope** (found during exploration, unrelated to this feature, flagging only):
`App.jsx:633` and `:673` read the static `WEEKS_DATA` instead of the DB-merged `weeks`, so
teacher-created custom lessons are invisible to `handleStartWeek` / `handleLessonComplete`. That's
a real bug but a separate change.

---

## Docs

`CLAUDE.md` is materially stale — it says *"No backend: Auth is mock (state only). All lesson/quiz
data is static JS files"* and names a `"teachers"` view. In reality there's full Supabase auth,
15 tables, 17 migrations, 3 Edge Functions, and the view is `"teacher-portal"`. I'll correct those
lines and document the extended slot contract as part of Phase 1, since anyone adding a block type
next will read that file first.

---

## Verification

No test suite exists, and per project rules **you run the app, I don't**. Static checks I run each
phase: `npm run lint`, plus `node --check` on any standalone JS.

**What to check — Phase 1**

1. *Teacher portal → Lessons → any week → Edit a lesson.* Click **Add Section**. The picker should
   now be grouped, with an **Interactive** group containing Flip Cards and Check Your Understanding.
2. Add **Flip Cards**, fill in 3 cards, Save Section. The editor canvas should render the real,
   fully-flippable component (the lesson editor is WYSIWYG). Hit **Preview** — same thing inside
   the real lesson chrome. **Save**.
3. *Sign in as a student, open that lesson.* The block should appear in the right position. Flip
   all cards → a "✓ Completed" pill appears; if the teacher set XP > 0, one XP toast fires.
   Reload → the block still reads as completed, and **no second toast** fires.
4. Add a **Check Your Understanding** block with one MCQ. Wrong answer → red + ✗ + explanation, and
   you can retry. Right answer → teal + ✓.
5. *Regression, most important:* open a lesson you did **not** edit. Every existing section must
   render exactly as before, the sidebar TOC must still scroll correctly, and scrolling to the
   bottom must still award normal lesson XP. Confirm no interactive XP shows in the Gradebook and
   no new achievement fires.

**Signs it's wrong:** a section renders unstyled or colorless (interpolated Tailwind class);
the TOC scrolls to the wrong section (`sections[]` / `layout[]` drift); the XP toast fires on every
reload (completion isn't persisting); an interactive appears in Quiz Checking or the Gradebook
(scope leak).

Per-phase "what to check" notes follow the same form for Phases 2–4.
