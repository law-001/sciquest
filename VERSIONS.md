# Versions

## VERSION_1
- Lesson materials Open/Save fixed: `openMaterial` / `downloadMaterial` / `fileNameForMaterial` added to `src/lib/materials.js`.
- Open now targets a new browser tab — PDFs are re-typed as `application/pdf` and shown from a blob URL so a wrong stored MIME type can't hand the file to a desktop app; Word/PowerPoint go through Microsoft's web viewer.
- Save now fetches the file and downloads it from a blob URL (cross-origin `download` on an anchor was being ignored, which replaced the SciQuest tab), with a `?download=` hidden-frame fallback.
- `MaterialsList.jsx` Open/Save are real `<button>`s with Opening…/Saving… busy labels; both are used by `MaterialsPanel` and the `materials` lesson slot.

## VERSION_2
- Signature interactives, wave 0 + first 5 lessons (see `INTERACTIVE_SECTIONS.md`).
- New: `signatureWidgets.js` (lazy registry, separate from `CUSTOM_WIDGETS` so the teacher picker stays small) and `SignatureWidgetSection.jsx` (host block, fixed `blockId: "signature"`, 25 XP each).
- `LessonTemplate.jsx` renders the pinned block after the `layout[]` sections and before `MaterialsPanel`; it sits outside `layout[]`, so teachers can't reorder or delete it.
- `LessonsDataContext.mergeWeeks()` now carries `signature` from the static seed onto a teacher's DB override row — without it, the widget would vanish the first time a lesson was edited.
- Five widgets: `ModelMatchBenchWidget` (L1 model-type matching), `MethodSequencerWidget` (L2 step ordering, a wrong order runs and reports what broke), `ModelLimitsExplorerWidget` (L3 globe vs flat map trade-off), `ParticleTheorySandboxWidget` (L4 two sliders prove the five statements), `StateChangeJourneyWidget` (L5 six changes of state across -20 to 120 °C).
- `signature: { ... }` blocks added to lessons 1-3 (`lessonsweek-01.js`) and 4-5 (`lessonsweek-02.js`).
- No migration needed — `lesson_interactions.block_type` is plain `text`.

## VERSION_3
- Rebuilt all five signature interactives as animated visual simulations. The previous set were matching/ordering/multiple-choice tasks — that work belongs to the quiz section, so it is gone.
- `ModelGalleryWidget` (L1): four models that actually run — a suspension bridge whose deck sags under a crossing truck with a live load gauge, an atom with two orbiting electron shells, a population formula plotting itself year by year, a hurricane tracking up a coast inside a widening forecast cone. All SVG, one shared clock.
- `InvestigationRunWidget` (L2): a fair test that plays out. Set hours of light, press run, and 14 days animate — sun arcs overhead, stems climb against a ruler, leaf pairs unfold every 4 cm, and the graph plots both pots day by day. The conclusion is computed from the heights that came out.
- `GlobeUnrollWidget` (L3): a globe that unrolls into a Mercator map. Same lat/long coastlines projected two ways and blended by the slider, so Greenland genuinely inflates; the "times too big" readout is a shoelace area measured off the on-screen shape.
- `ParticleLabWidget` (L4): canvas particle simulation with real velocities and motion trails. Cold locks them into a vibrating lattice, warm breaks them loose but keeps them pooled, hot sends them filling the box.
- `StateChangeLabWidget` (L5): a beaker on a burner. Hold to heat or cool — the thermometer climbs and stalls at 0 °C and 100 °C (latent heat), lattice bonds draw and break, bubbles form and rise while boiling, and a vacuum pump forces sublimation and deposition.
- `SignatureWidgetSection` no longer uses `InteractiveFrame`: that shell holds content at `opacity: 0` until an IntersectionObserver fires, which can leave a block invisible. The signature block now paints unconditionally.
- Widget ids renamed in `signatureWidgets.js` and the lesson data: `model-gallery`, `investigation-run`, `globe-unroll`, `particle-lab`, `state-change-lab`. Old widget files deleted.
- Every widget respects `prefers-reduced-motion` by rendering one representative frame instead of looping.

## VERSION_4
- Bridge hangers fixed (`ModelGalleryWidget`): deck and main cable are both quadratic curves, so each hanger is now drawn between the two curves evaluated at the same x. They no longer punch through the cable above or hang below the deck, and the truck rides on the deck wherever the sag puts it.
- Chart overlap fixed (`InvestigationRunWidget`): the graph is its own SVG in the side panel instead of a corner of the pot scene, so its title can never land on the axis. Pot labels were being drawn below the viewBox and clipped — pot base moved up and the box grew to 342.
- New `SimLayout.jsx` + `stageMedia.js`: every simulation is now picture-left / controls-right on `lg` and up, stacked below it. The stage is capped at `58vh` so a sim can't push its own controls off the bottom — no more scrolling between the thing you're steering and the control that steers it.
- Side panels rewritten compact: smaller checklists, tighter type, controls grouped. `SignatureWidgetSection` chrome trimmed (`p-4 sm:p-5`, shorter intro/instruction spacing).
- Responsive throughout: single column on phones, two on tablet landscape and up; canvases use `object-fit: contain` so clamping the height letterboxes rather than stretching; all tap targets stay `min-h-11`.

## VERSION_5
- Simulation and control columns are now the same height. `SimLayout` gives the grid one explicit height on `lg` and up (`lg:h-[62vh]`) which both columns fill — the picture letterboxes inside its share, the panel scrolls inside its own. Below `lg` the fixed height is dropped so the stacked layout is not squeezed.
- The control panel got its own bordered surface matching the stage, so the equal heights actually read as equal.
- `stageMedia.js` switched from a `vh` cap to `maxHeight: 100%`, so the picture sizes to the row the grid hands it rather than to the viewport directly.
- `ModelGalleryWidget`'s stage column is a flex column now — its job line sits above the picture without stopping the column filling the row.
- Lesson content container widened from `max-w-7xl` to `max-w-[1600px]` (`LessonTemplate.jsx:359`).

## VERSION_6
- Lesson content container narrowed from `max-w-[1600px]` to `max-w-[1440px]` (`LessonTemplate.jsx:359`) — 1600 read too wide; this sits between it and the original `max-w-7xl` (1280px).

## VERSION_7
- `INTERACTIVE_SECTIONS.md` rewritten around the visual-first direction. Retitled "Per-Lesson Signature Simulations".
- Opens with the rule that decides every design: show the object, do not ask about it. Multiple choice, matching, bucket-sorting, card-ordering and fill-in-the-blank are named as banned — the quiz section already does assessment. Test given: strip every word from the widget and the science should still be visible.
- The ten question-shaped archetypes are replaced by six simulation shapes — Live Sim, Apparatus, Run & Record, Morph, Dissect, Cascade — each anchored to a shipped example.
- All 54 remaining lessons redesigned as animated simulations, described by what runs on screen rather than what the student is asked.
- Architecture section updated to what was actually built: `SimLayout` + `stageMedia`, the `{ onSolved }` contract, why `InteractiveFrame` is not used, and the `mergeWeeks` carry-over that must not regress.
- Added the hard-won build constraints: one rAF loop read through refs, and the React Compiler lint rules (no ref writes during render, no synchronous setState in an effect) which are errors here, not warnings.

## VERSION_8
- Added a second interactive to each week 2 lesson, placed as `customWidget` blocks inside `layout[]` because the pinned `signature` slot is one-per-lesson and both lessons already use theirs.
- **L4 `pour-test`** (`widgets/PourTestWidget.jsx`) — the empty-space proof. Two sliders pour water and alcohol into a volumetric flask; 50 mL + 50 mL measures about 96 mL, with a dashed line marking where 100 mL would have reached. A magnifier lens zooms into the real simulated particles so the small alcohol beads are visibly sitting in the gaps between the large water ones. The vessel is a volumetric flask because a narrow neck is the only thing that makes a 4 mL shortfall visible.
- **L5 `container-test`** (`widgets/ContainerTestWidget.jsx`) — shape versus volume, on a bench. Ice, water and steam move between a beaker, a conical flask and a syringe. The liquid surface height is found by integrating the container's own cross-section, so the same 40 mL genuinely stands twice as tall in the narrow syringe. A two-light readout names what the sample keeps. The syringe plunger compresses the gas and stops dead against the liquid and the solid.
- Both registered in `interactive/customWidgets.js`, so they are also placeable by teachers from the section picker.
- Inserted into `src/data/lessonsweek-02.js`: the pour test straight after the five statements of particle theory, the container test straight after the solid/liquid/gas reason cards. 25 XP each.

## VERSION_9
- Admin and Teacher portals rebuilt on one shared frame. New `src/components/portal/`: `PortalShell` (fixed left rail), `MetricRibbon` (masthead), `PortalPanel` + `PanelHeader` (flat surface), `ProportionBar` (stacked-bar distribution).
- **Chrome removed.** The sticky top navbar and the boxed sidebar card are gone on both pages. Navigation is a fixed 232px rail (collapsible to 72px, remembered in `localStorage` under `sq_portal_rail_collapsed`) that also carries the theme toggle, the account menu and log out. Content now starts at the top of the viewport instead of ~130px down.
- **The four stat squares are gone.** Both dashboards open on a single `MetricRibbon` band: identity block on the left (live dot, title, date, one primary action) and four figures on the right separated by hairlines, each marked by a 3px colour tick instead of a 48px icon chip. Replaces three stacked rows (~215px) with one ~104px band.
- **Density pass.** Container widened `max-w-7xl` → `max-w-[1680px]`; page padding `py-8` → `py-5 lg:py-7`; panel gaps `gap-6` → `gap-4`; table rows `py-4` → `py-2.5`; all figures set in `tabular-nums`.
- **Asymmetric bodies.** Equal-width grids replaced with `1.75fr / 1fr` (admin) and `1.6fr / 1fr` (teacher).
- Admin dashboard: "Recent Users" → "Newest accounts" (denser rows, empty state added). The two stacked donuts collapse into one Distribution panel — students-by-section as a stacked bar, plus an account-mix donut. The hardcoded 987/261 "Weekly Activity" figures are gone; account mix reads real `fetchDashboardCounts` data.
- Teacher dashboard: "Teaching Desk" ribbon, latest-submissions and grade-queue panels with real empty states, and an "Open grade queue" action that jumps to Quiz Checking. Section filter restyled as a compact scope row.
- Admin rail reordered so Reset Data sits next to Settings rather than third from the top.
- Mobile: rail becomes a 56px top bar plus an Escape-dismissable slide-over drawer; all targets kept at 44px. Ribbon entrance animation is skipped under `prefers-reduced-motion`.

## VERSION_10
- **Fixed a real theme bug behind the unreadable rail.** The `primary`/`secondary`/`accent` palettes in `index.css` stopped at shade 700, so every `dark:bg-primary-900/30`-style class in the app — 135 of them — compiled to nothing and silently fell back to its light-mode pair. That is why the active nav item rendered as a cream pill in dark mode. Added shades 800/900/950 to all three palettes; those 135 usages now render as their authors intended.
- Rail colours rewritten as two independent sets per accent (`ACCENT` in `PortalShell.jsx`) rather than one palette tinted for dark mode. Active item: `bg-*-50 / text-*-800` light, `bg-*-950 / text-*-200` dark. Idle items lifted from `stone-400` to `stone-300` in dark mode (~7:1 to ~12:1).
- **All remaining tabs redesigned** on the shell built in VERSION_9. Every `Card` in both portals is now a `PortalPanel` (flat, `rounded-3xl`, flush headers) — 5 in admin, 21 in teacher. The `hoverable` lift was dropped in favour of a border-colour hover so pressing a card no longer shifts layout.
- New `TabHead`: tab headings drop from `text-3xl` in an 86px block to a 22px title with the tab's action button folded into the same row (~48px). Applied to all 7 admin tabs; Teachers and Sections now carry their Invite/Create buttons inside it.
- New `StatStrip` + `tones.js`: the four remaining stat-square grids inside the teacher slots (Gradebook student, Gradebook section, Progress student, Progress section) became hairline-divided strips with 3px colour ticks — same idiom as the dashboard ribbon, no icon chips.
- Density pass across both files: table cells `px-6 py-4` → `px-5 py-2.5`, table headers `px-6 py-3` → `px-5 py-2` at 10px/black/wide-tracking, panel headers `p-6` → `px-5 py-3.5`, panel titles from `text-lg font-bold` to the small uppercase label, `space-y-6`/`space-y-8` → `space-y-4`, `mb-6` → `mb-4`.
- Week and lesson card grids gain a third/fourth column at `xl` now that the container is 1680px rather than 1280px.
- All figures inside slots set in `tabular-nums`.

## VERSION_11
- **Week and section lists rebuilt as quiet rosters.** Lessons, Quizzes and My Sections opened onto a grid of fat cards — 20 week cards each carrying 8 elements (icon chip, state badge, "Week N", title, count, "Avg completion", the %, a progress bar), so ~160 items competed at equal weight with no scanning path. All three are now a single `PortalPanel` with one row per item.
- New `RosterList` / `RosterRow` (`src/components/portal/RosterList.jsx`): 56px rows, hairline dividers, and exactly one bold element per row — the title. Week number, item count, inline progress bar and state recede to 11px grey, so the eye runs down the title column. Row body and trailing control are siblings, never nested buttons, so both keep a focus stop and the markup stays valid.
- New `WeekStatePill` in `TeacherPortalPage.jsx`: the hidden/published/open cycler that used to be duplicated inside every week card, now one component driven by `WEEK_STATE_META`. "Open" uses the Users icon rather than Eye so it is not separated from "Published" by colour alone; the label stays visible at every width.
- **Quiz Checking no longer expands every submission.** Each pending item was a full card (student row, type badges, answer snippet, word count, button) — 12 pending meant 12 tall cards. Now one 56px row each; clicking a row expands just that response inline, and Grade still opens the existing modal.
- Quiz Checking gains its own filter bar in the panel header: a **section select** carrying the pending count per section (something the global scope pills cannot show), wired to the same `selectedSectionId` the scope row uses so the two never disagree, plus **question-type** chips (Essay / Short Answer / Case Study). Empty state distinguishes "all caught up" from "nothing matches this filter".
- Lesson and quiz cards *inside* a week are left as a grid — a handful of items, each with real per-item actions, is what a grid is for.

## VERSION_12
- **Lessons and Quizzes now open onto two quarter dropdowns instead of one list of twenty weeks.** 1st Quarter holds weeks 1-10, 2nd Quarter weeks 11-20.
- New `RosterGroup` (`src/components/portal/RosterGroup.jsx`) — a collapsible roster section whose header is a real button carrying the group's own summary: label, week range, week count, and average completion across every lesson in the quarter. A collapsed quarter still tells you how much is in it and how far the class has got.
- New `quarters.js` alongside `tones.js`: `QUARTERS` defines four ten-week bands and `groupByQuarter()` buckets weeks into them, dropping empty ones. Only Q1 and Q2 render today; adding weeks 21+ creates its own group rather than breaking the grouping. The helpers live in a plain `.js` module because `react-refresh/only-export-components` rejects a `.jsx` file that exports both a component and constants.
- New `useOpenQuarters(storageKey)` hook in `TeacherPortalPage.jsx`. Only the 1st Quarter is open on first visit — the point of grouping is that the tab does not land on twenty rows — and the choice is remembered per list (`sq_teacher_lesson_quarters`, `sq_teacher_quiz_quarters`), so a teacher working in Q2 is not reopening it every day.
- Searching force-opens every group, so a match in a collapsed quarter can never look like "no results".
- Both slot subtitles now read "Grouped by quarter" rather than "All weeks".

## VERSION_13
- Lessons and Quizzes now open with **both quarters closed**, not just the 2nd. The tab lands on two headers and nothing else.
- Removed the per-list localStorage memory (`sq_teacher_lesson_quarters`, `sq_teacher_quiz_quarters`) added in VERSION_12. Restoring a quarter the teacher had left open would reopen ten week rows on entry — the exact landing state the grouping exists to prevent — so `useOpenQuarters()` no longer takes a storage key and simply starts empty. The slot unmounts on tab switch, so the closed state returns every visit.
- Search still force-opens every group, so a match in a closed quarter is never hidden.

## VERSION_14
- Both dashboards go from 3 sections to 6, laid out as a bento — a tall column, two medium panels, a wide-short strip — rather than another uniform grid.
- New `BarList` (`src/components/portal/BarList.jsx`): independent horizontal bars for comparing items against each other, as opposed to `ProportionBar`, which shows parts of one whole.

**Teacher — three new panels, chosen for what is actually actionable:**
- **Needs attention** (tall, 4 of 12 cols, spans both rows) — students who are failing or stalled, worst first, capped at 6. Reuses the existing `engagementStatus()` so the dashboard and the Progress tab can never disagree; `hasSubs` is keyed on name + section, matching how Progress pairs a student to their submissions.
- **Lowest scoring quizzes** (wide, 8 of 12 cols) — class average per quiz, lowest first. This is the reteach list, the one thing a dashboard can tell a teacher that a roster cannot.
- **Curriculum status** (full width, short) — weeks open / published / hidden, counted with the same precedence the Lessons tab uses (not published wins over open). Teachers forget to publish; this is where they find out.
- **Section standings** renders only when there is more than one section — a single bar comparing a class to itself is noise.
- Latest submissions and Grade queue kept, re-laid out at 5 and 3 columns.

**Admin — two new panels:**
- **Curriculum reach** — completions against every lesson every enrolled student could finish, as one large figure plus the three numbers behind it. Answers "is the platform actually being used".
- **Teaching staff** (full width, short) — who holds portal access, as a 4-up grid. Hairlines drawn with `gap-px` over a tinted track so they stay correct however the grid wraps. Needed `fetchTeachers()` added to the dashboard load.
- Newest accounts is now the tall panel (7 cols, both rows); Distribution and Curriculum reach stack beside it at 5 cols.

## VERSION_15
- **Fixed browser-painted controls rendering light on dark surfaces.** The app never declared `color-scheme`, so the browser assumed light everywhere and painted its own widgets to match — the `<input type="number">` spin buttons showed as a white block on a dark panel, and every `<select>` kept a light dropdown arrow and a white option list in dark mode.
- Added `html { color-scheme: light }` / `html.dark { color-scheme: dark }` to `src/index.css`. `.dark` already sits on `<html>` (set by `ThemeContext`), so one root rule covers every native control at once. The existing explicit `background-color` and `scrollbar-color` declarations still win over the new defaults.
- Affects both number steppers in the teacher portal (Grade % in the grade modal, the custom quiz-timer minutes field) and all five selects across the two portals (admin student-section filter, teacher section filter in Quiz Checking, quiz timer, quiz attempts).
- Also set `opacity: 1` on `::-webkit-inner-spin-button` / `::-webkit-outer-spin-button`: Chrome fades the stepper in on hover, so a number field reads as a plain text box until the pointer lands on it.
- Note: `color-scheme` is a root declaration, so student-facing pages get the same correction — the same latent bug existed there.

## VERSION_16
- **Per-student quiz access (make-up / deadline extension).** A teacher can re-open a closed quiz for one student — e.g. someone who forgot to take it — without re-opening it for classmates who already finished.
- New migration `supabase/migrations/20260910000000_quiz_student_access.sql`: `quiz_student_access` table (one row per `lesson_id` + `student_id`, `open_until` null = until removed), RLS (staff manage all, a student reads only their own rows), added to the realtime publication. `supabase/schema.sql` snapshot updated.
- New API module `src/lib/quizStudentAccess.js`: fetch / grant (upsert, so granting again extends) / revoke / realtime subscribe, plus `isGrantActive` and `findActiveGrant`.
- `App.jsx`: `isQuizLocked` now lets a student through when the quiz is closed for the class but they hold an active personal grant. Grants reload on realtime changes and a one-minute tick closes the quiz when the end time passes.
- Teacher portal → Quizzes → week → each quiz card has an **Open for a student** button (shows "N open"). It opens `QuizStudentAccessModal`: list of students already given access (Extend / Remove), a searchable student picker showing Submitted / Not taken, and a duration picker (1 day, 3 days, 1 week, custom date & time, until removed). Warns when the quiz is currently open to the whole class.
- Student lesson page shows "Your teacher re-opened this quiz just for you — open until …" under the quiz button when a personal grant is what unlocks it.
- Note: like the existing publish toggles, availability is enforced client-side; `quiz_attempts` inserts are not gated on it (flagged tighten-before-production in the migration).

## VERSION_17
- **Quiz availability is now enforced by the database, not just the browser.** New migration `supabase/migrations/20260910010000_enforce_quiz_availability.sql`:
  - `curriculum_lessons` (seed lesson → week map, 59 rows) so the server never trusts the `week_id` a client sends. Custom lessons use `lessons.week_id`, which wins.
  - `quiz_week_for_lesson()` and `is_quiz_open_for()` mirror `isQuizLocked`: the week quiz toggle, the per-quiz toggle, and per-student grants (2-minute grace after `open_until` so an auto-submit at the deadline still lands).
  - `own_attempt_insert` on `quiz_attempts` now also requires `is_quiz_open_for()` — a direct API insert into a closed quiz is refused.
  - `supabase/schema.sql` snapshot updated.
- `App.jsx` `handleQuizComplete` now returns the save promise. XP toasts and achievement sync run only after the attempt is saved; on refusal the optimistic attempt is rolled back so it doesn't count or unlock the next lesson.
- Opening a quiz (`handleGoToQuiz`, resume in `handleStartWeek`) checks the lock against a fresh clock instead of the minute-old tick.
- **Countdown + auto-submit for personal windows** (`QuizContainer.jsx`, new `closesAt` prop via `QuizPage`): a "Quiz Closes In" card in the right rail with the note that answers auto-submit at 0:00; a floating warning in the last 5 minutes (amber, red in the last minute); auto-submit when it hits zero. Results read "Auto-submitted — the quiz closed".
- A student who reaches the quiz page after their window already ended sees "This quiz has closed" instead of an instant empty submission. Retry is hidden once the window has closed.
- If the server refuses an attempt, the results screen shows "Not saved" with the reason, hides the XP/attempt line and Retry, and restores the answers to the device so they reload when the quiz opens again.

## VERSION_18
- **Quiz Checking is now organised by lesson** (`QuizCheckingSlot` in `src/pages/TeacherPortalPage.jsx`).
- Only lessons whose quiz has a hand-checked question (essay, short answer, case study) are listed. A lesson that still has ungraded submissions stays listed even if those questions were edited out, so no student work is stranded.
- Lesson list is split into **Needs grading** and **All caught up**, each in curriculum order. Each row shows the quiz title, week + lesson, submission count, question-type chips, and a status pill ("N to grade" / "All graded" / "No submissions").
- Clicking a lesson opens its submissions with **Needs Grading** (oldest first, Grade button, response preview) and **Graded** (score + Graded label) tabs, plus a back button.
- Removed the flat "Needs Grading" queue, the question-type filter, and the "All Submissions" table (which also listed auto-graded quizzes). The section selector with per-section pending counts is kept.
- New small `ManualTypeChips` component for the type labels, used in both views.

## VERSION_19
- Removed the pinging teal dot and "Live" label from the dashboard header (`src/components/portal/MetricRibbon.jsx`), shown on the admin Control Center and the teacher Teaching Desk.
- Dropped the now-unused `eyebrow` prop from `MetricRibbon` and from both callers (`AdminDashboardPage.jsx`, `TeacherPortalPage.jsx`). The title's `mt-1.5` top margin went with it so the title sits at the top of the block.

## VERSION_20
- **Gradebook student record: Game Performance beside Quiz Performance** (`GradebookSlot` in `src/pages/TeacherPortalPage.jsx`). Two columns from the `lg` breakpoint up, stacked on smaller screens.
- Game Performance lists every game with its best result, attempt count and a bar, plus a footer with total stars and games played. Game results are fetched for the open student only (`fetchGameProgressForStudents`), with loading and error states.
- New `getGameScore()` + `GAME_SCORE_RULES`: level games score stars earned out of `totalLevels × 3`; Mystery Lab out of 9 stars; Matter State Sandbox as challenges done out of 8.
- **Score is now the primary figure** in both panels: quiz rows lead with "4 / 10 pts" (coloured by grade) with the percentage small beside it; game rows lead with "7 / 9 stars". The quiz footer now shows total points ("12 / 40 pts") with the average % and descriptor as the secondary line.

## VERSION_21
- Avatar editor: pressing anywhere off a sticker now deselects it (handles + dashed outline disappear). `AvatarEditor.jsx` listens for `pointerdown` on the document while a sticker is selected; presses on a sticker frame or inside the Stickers panel (marked `data-keeps-sticker-selection`) keep the selection.

## VERSION_22
- Avatar editor: the red remove handle on a selected sticker now shows a trash icon (`Trash2`) instead of an X. Help text in the Stickers panel updated to match.

## VERSION_23
- Avatar editor: removed the row of placed-sticker chips ("Flower Bunch 1", "Heart 2", …) from the Stickers panel. Stickers are selected by clicking (or tabbing to) them on the preview; the edit card and "Clear all stickers" stay.

## VERSION_24
- Avatar editor: nothing renders below the sticker grid any more. Removed the "sticker space is full" note, the "Editing …" card (width/height/rotation/position sliders, Bring to front, Remove sticker) and "Clear all stickers". Stickers are edited only on the preview (drag, handles, trash button, arrow keys); the `n / 6` counter still shows when the grid is full.
- The Stickers panel no longer keeps a sticker selected, so clicking blank space in it deselects like anywhere else. Dropped the now-unused `CONTROL`, `selected` and `selectedLabel`.
- Commit: Remove sticker edit card and controls below avatar sticker grid

## VERSION_25
- Stopped `VERSIONS.md` conflicting on every merge. New `.gitattributes` sets `VERSIONS.md merge=union`, so when two branches both append entries git keeps both instead of stopping.
- Dropped the shared "Staged changes" footer — the one line every branch rewrote, so it conflicted every time. Each entry now ends with its own `- Commit:` line instead.
- `CLAUDE.md` version-log rules updated to match: number one past the highest in the file, a `Commit:` line per entry, no shared trailing line, and duplicate numbers after a merge are left alone.
- Commit: Stop VERSIONS.md merge conflicts with union merge and per-entry commit lines

## VERSION_26
- Teacher quiz modal: fixed the "Show correct answers" switch (`QuizShowAnswersControl` in `src/pages/TeacherPortalPage.jsx`).
- The switch now holds its own on/off state and flips immediately on click (reverting if the save fails). Before, it only redrew when Supabase realtime echoed the save back to the parent, so it could look stuck until a reload. Same pattern as the Attempts control above it.
- The knob now slides: `translate-x-2px` / `translate-x-18px` aren't Tailwind classes and compiled to nothing; replaced with `translate-x-[2px]` / `translate-x-[18px]`.
- Commit: Fix teacher quiz "Show correct answers" switch not flipping or sliding

## VERSION_27
- Student profile pictures now show in the teacher and admin portals instead of a plain initial.
- `src/lib/users.js` (admin) and `src/lib/teacher.js` (teacher portal) now select `avatar` + `avatar_style` from `students` and pass them on as `avatar` / `avatarStyle`. Staff rows get `null`, so teachers still show their initial.
- Every student initial circle in `AdminDashboardPage.jsx` (Users, Recent Users, Remove User, Students roster) and `TeacherPortalPage.jsx` (dashboard roster, Students, Gradebook, Quiz Checking, the student profile cards) is now the shared `<Avatar>` at the same size (28 / 32 / 36 / 64 px). Teacher-only circles on the admin Teachers screens are unchanged.
- No migration: staff can already read `students`, and the avatar columns exist.
- Commit: Show student profile pictures in teacher and admin portals

## VERSION_28
- Student profile pictures on quiz submissions: the dashboard "Latest submissions" list and the Quiz Checking submission rows (`TeacherPortalPage.jsx`) now show the student's `<Avatar>` instead of an initial. Quiz Checking's amber/teal pending-vs-graded tint on the initial is gone; the "Needs Grading" / "Graded" tabs and grade labels still carry that state in text.
- `fetchTeacherDashboard()` (`src/lib/teacher.js`) attaches `avatar` / `avatarStyle` to each submission from the student it belongs to.
- Every remaining initial circle is a staff member (admin Teachers screens, the portal's own user badge) or the hardcoded landing-page leaderboard sample — none has a student picture to show, so they are unchanged.
- Commit: Show student profile pictures on quiz submission rows

## VERSION_29
- Contact form now really sends: `ContactPage.jsx` had a fake `setTimeout` submit. It now saves name / email / message (plus `user_id` when signed in) through `submitContactMessage`, clears the fields on success, and shows an inline error if the insert fails.
- New `contact_messages` table (`supabase/migrations/20260911000000_contact_messages.sql`, mirrored in `schema.sql`). RLS: anyone may insert (unread, own or null `user_id`); only admins may read / update / delete. Flagged tighten-before-production: anonymous insert has no rate limit.
- New API module `src/lib/contactMessages.js` (submit, list, unread count, mark read/unread, delete).
- New admin **Messages** tab (`src/components/admin/MessagesTab.jsx`): inbox list + reading pane (stacked on mobile), search, All/Unread filters, unread dot + "New" label, relative times, Reply (mailto), Mark read/unread, Delete with inline confirm, loading skeleton, empty and error states.
- `PortalShell` nav items accept an optional `badge` count (pill when expanded, dot when collapsed); the admin Messages item shows the unread count.
- Commit: Save contact messages to Supabase and add admin Messages inbox tab
