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
- **Publishing is now per section, limited to the teacher's own sections.** Before, every publish / hide / open toggle wrote one global row, so a teacher changed it for every section, and RLS let any staff member do it.
- New migration `supabase/migrations/20260911000000_section_publish_state.sql` (+ `schema.sql` snapshot):
  - `teacher_sections` — the "My Sections" list, moved out of browser localStorage so the server can check it. The old local list is imported on the teacher's first load.
  - `section_publish_state` — per-section override for each scope (`lessons`, `open`, `quizzes`, `quizzes-individual`, new `lessons-individual`). A section with no row inherits the global `course_publish_state` row, which is now admin-only to write.
  - `can_manage_section()` / `can_manage_student()` / `publish_ids_for()` / `is_staff_admin()` helpers. RLS on `section_publish_state` only accepts writes for sections in the teacher's `teacher_sections`.
  - `is_quiz_open_for()` reads the student's own section state.
  - `quiz_student_access` (per-student quiz re-open) writes are limited to teachers of that student's section.
  - Lessons hidden with the old global `lessons.is_hidden` toggle move into the global `lessons-individual` default, so no section sees a change on deploy.
- `src/lib/publishedWeeks.js` rewritten around one `{ global, sections }` state: `fetchPublishState`, `resolvePublishIds`, `saveSectionPublishIds`, `withSectionPublishIds`, `subscribeToPublishState`. `isQuizLessonHidden` → `isLessonHidden`.
- `src/lib/sections.js`: `fetchTeacherSections`, `addTeacherSection`, `removeTeacherSection`.
- Teacher portal (`TeacherPortalPage.jsx`): Lessons and Quizzes toggles apply to the section picked under Scope, or every section the teacher handles under "All". Weeks that differ between sections show a grey **Mixed** pill. A note above each list names the sections a toggle will change; with no sections added, toggles are disabled and it links to My Sections. The lesson eye-toggle confirm names the sections too. A refused save shows a red dismissible banner and reloads the real state. The Overview's curriculum counts follow the same scope (and add a Mixed cell when needed).
- The trash button on **seed** lessons and quizzes (which hid them for every section) is gone — hiding is the per-section toggle. Trash now only deletes custom lessons/quizzes. `deleteLesson` / `deleteQuiz` are hard-delete only; `setLessonHidden` removed.
- Students: `App.jsx` resolves publish state for the student's `profile.section`; new `HiddenLessonsFilter` (`LessonsDataContext.jsx`) drops lessons hidden for that section from `weeks`. Publish state is re-fetched on sign-in.

## VERSION_22
- Production-readiness pass over the teacher portal.
- `supabase/functions/invite-teacher/index.ts`: removed the `http://localhost:5173` fallback for `SITE_URL`. The function now returns a 500 "SITE_URL is not set" instead of emailing teachers a link to localhost.
- "Show correct answers" switch (`QuizShowAnswersControl` in `TeacherPortalPage.jsx`): the knob classes `translate-x-18px` / `translate-x-2px` aren't valid Tailwind v4 and compiled to nothing, so the knob never moved. Now `translate-x-4.5` (18px, on) / `translate-x-0.5` (2px, off).

## VERSION_23
- **Production blockers from the teacher-portal review, fixed.**
- New migration `supabase/migrations/20260911010000_sections_table.sql`: the `sections` table (signup dropdown + "Add Section") had no migration — it only existed as a comment. Creates it where missing, with RLS (anyone reads, staff insert — a teacher can only record `created_by_role = 'teacher'` — admins delete), and backfills every section name students already have. Adds `is_staff()`.
- New migration `supabase/migrations/20260911020000_student_data_access.sql`:
  - `students`, `student_progress`, `quiz_attempts`, `student_achievements` are readable only by the student themself or staff. Before, every signed-in student could read every classmate's email, student number, progress and quiz answers.
  - `leaderboard_entries(p_since)` RPC returns only what the leaderboard shows (name, avatar, lesson + quiz XP, achievement keys). `src/lib/leaderboard.js` now uses it and still adds achievement XP from the JS catalog.
  - `remove_student_from_section(p_student_id)` RPC: the roster remove button silently did nothing (RLS blocked the update with no error). It now works for students in the caller's own sections and errors otherwise.
- `src/lib/teacher.js`: `fetchTeacherDashboard(sectionNames)` loads only the teacher's sections (progress/attempts filtered through the `students!inner` join) and pages past Supabase's 1000-row response cap (`fetchAllPages`). `removeStudentFromSection` calls the RPC.
- `TeacherPortalPage.jsx`: loads My Sections first, then the dashboard for those sections; re-fetches the dashboard after a section is added or removed.
- `schema.sql` snapshot updated to match.

---
Staged changes: fix(security): scope student data reads to owner/staff, add sections migration, paginate teacher dashboard, fix roster remove
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

## VERSION_29
- Merged the teacher portal's **Gradebook** and **Student Progress** screens into one **Gradebook** (`TeacherPortalPage.jsx`). The "Student Progress" sidebar tab and `ProgressSlot` are gone; the dashboard's "All students" link now opens the Gradebook.
- The grade (and its DepEd descriptor: O / VS / S / FS / DNME) now combines quizzes and games: `computeGrade()` = quiz average × `GRADE_WEIGHTS.quiz` + game score × `GRADE_WEIGHTS.game` (50/50). Quiz average = mean best % over quizzes taken; game score = mean earned/max % over games played. A part with no data yet is left out instead of counted as 0.
- Class list: rank, progress, quizzes (avg + taken), games (score + played), combined grade, and engagement status; every column sortable (sort headers are now real buttons) and rows open with Enter/Space. Stats: Class Average, Passed (≥ 75%), Avg Progress, Not Started. "Needs Help" / "On Track" now follow the combined grade.
- Student record: combined grade with the formula spelled out, status, rank, last quiz, pending warning; Quiz Performance + Game Performance; Week-by-Week Activity + Quiz History. The duplicate games list from the old progress screen was dropped.
- `fetchGameProgressForStudents()` (`src/lib/teacher.js`) now pages past the 1000-row cap, since grades depend on every row.
- Commit: Merge Gradebook and Student Progress; grade combines quizzes and games

## VERSION_30
- Gradebook student record (`TeacherPortalPage.jsx`): removed the Week-by-Week Activity and Quiz History panels.
- Quiz Performance now lists only the quizzes the student has taken (with an "Awaiting grade" note when one is pending). Untaken quizzes sit in a collapsible "Not attempted · N" section at the bottom of the same panel, collapsed by default.
- Game Performance now lists only the games played; unplayed games are in a collapsible "Not played yet · N" section in the same panel. Both use native `<details>`, so they're keyboard-accessible, and the chevron doesn't animate for reduced motion.
- Commit: Gradebook record: show only taken quizzes/played games, collapse the rest

## VERSION_31
- Rebuilt the course to follow the Grade 7 (MATATAG) curriculum in `SCIQUEST-TOPICS.pdf`: 20 weeks, 33 lessons, with lessons-per-week now varying (3, 2, 2, 1, 2, 2, 2, 2, 1, 0 …) instead of a fixed 3.
- **Weeks 1 and 2 are unchanged** at the developer's request — they keep their original lessons and ids (`lesson-1` … `lesson-5`) and all five shipped signature widgets.
- Weeks 3–19 rewritten with new content and a new id scheme (`w03-l1`, `w03-l2`, …) so no stale teacher-override or progress row in Supabase can land on the wrong topic. Weeks 10 and 20 are periodical-examination weeks and now carry `lessons: []`.
- New lessons written for the four performance tasks (comic strip, solution detectives, acids/bases at home, science fair, 3D diorama); prior 3-lessons-per-week content merged where the curriculum consolidates it (e.g. old lessons 7–9 became the single Week 4 lesson on changes of state).
- Quiz banks `quizzesweek-03.js` … `quizzesweek-20.js` re-keyed to the new lesson ids and consolidated to match; weeks 10 and 20 export empty objects so the aggregator in `quizzesweek-01.js` still spreads them.
- Fixed `isWeekFullyCompleted()` in `src/lib/lessonGating.js`: a week with zero lessons now counts as complete. Previously an empty Week 10 would have permanently locked Week 11, since there is no quiz to submit.
- Fixed a divide-by-zero in `src/pages/LessonsPage.jsx` — an examination week's card showed `NaN%` progress and reported itself fully done.
- Fixed the corrupted `lessonsweek-19.js`, where a bad find/replace had turned every "Web"/"web" into the literal string `null` ("Food Chains and Food nulls").
- Commit: Restructure lessons and quizzes to the MATATAG Grade 7 curriculum (weeks 1-2 untouched)

## VERSION_32
- Made the database the thing teachers actually edit, instead of the hardcoded files in `src/data/`.
- New migration `supabase/migrations/20260912000000_recurriculum_ids.sql` (reference data + cleanup only, no content):
  - Rebuilds `curriculum_lessons` for the 33 current lesson ids. **This was a security regression**: the table still mapped `lesson-1` … `lesson-60`, so every new `wNN-lN` id resolved to NULL in `quiz_week_for_lesson()` and fell back to the client-supplied `week_id` — reopening the hole that `20260910010000_enforce_quiz_availability.sql` was written to close. It also still mapped `lesson-28..30` to week-10, now an exam week with no lessons.
  - Deletes orphaned seed-override rows (`is_custom = false`) in `lessons` / `quizzes` whose id is no longer in the curriculum. Teacher-authored lessons (`is_custom = true`) are preserved.
  - Strips dead lesson ids out of `section_publish_state.item_ids` for the `lessons-individual` and `quizzes-individual` scopes.
  - Leaves `quiz_attempts`, `lesson_interactions` and `student_progress` untouched — no student loses a score or XP.
- New `scripts/seed-curriculum.mjs` + `npm run seed:curriculum`: upserts all 33 lessons and 33 quizzes from `src/data` into the `lessons` / `quizzes` tables, so the portal edits real DB rows. Content rows are deliberately kept out of migration history (`.claude/rules/database.md`), while the reference table stays in a migration as it already was.
  - Loads `src/data` through Vite's `ssrLoadModule`, since those modules import `.jpg`/`.webp` assets that plain Node cannot resolve. Stored asset URLs are re-resolved by filename at runtime by `resolveLessonImage()`.
  - Preserves teacher edits by default (skips rows whose `updated_at` has moved past `created_at`); `--force` overwrites, `--dry-run` reports without writing.
  - Requires `SUPABASE_SERVICE_ROLE_KEY` — RLS restricts writes on these tables to teacher/admin staff.
- No schema change: the `lessons` / `quizzes` tables, their teacher-only RLS policies, and the editor CRUD already existed.
- Commit: Seed lessons and quizzes into Supabase and re-point curriculum reference data

## VERSION_33
- **Incident repair.** A `supabase db push` found the remote migration-tracking table empty (the schema had been applied by hand via the dashboard), so it replayed history from the start, recorded `0001` and `0002` as applied, then aborted on `0003` with `cannot drop columns from view (SQLSTATE 42P16)`.
- `0001` and `0002` are idempotent for tables but not for policies — both `drop policy ... create policy ...`, which silently reverted three policies to their original permissive definitions and undid two later security migrations:
  1. `quiz_attempts.own_attempt_insert` lost its `is_quiz_open_for(...)` term, so a student could submit an attempt for a **closed** quiz through the API.
  2. `quiz_attempts.auth_read_attempts` (`using (true)`) came back; since RLS policies are OR-ed, it overrode `own_or_staff_read_attempts` and every student could read every other student's attempts.
  3. `students.auth_read_students` (`using (true)`) came back, re-exposing every student's email and student number.
- New `supabase/migrations/20260912010000_repair_policy_regressions.sql` drops the two resurrected permissive policies, reasserts the `own_or_staff_read_*` pair, and restores `own_attempt_insert` with the availability check. Guards on `is_quiz_open_for` existing so it fails loudly rather than silently leaving the hole open.
- Verified undamaged: `handle_new_user`, the `student_progress` FK, `own_student_update`, `auth_read_staff`, `own_staff_update` (never redefined by a later migration), and the `student_progress` / `student_achievements` read policies (never touched by `0001`/`0002`). `0003` aborted inside its own transaction, so none of it applied.
- No application code changed; `schema.sql` already described the correct end state.
- Commit: Repair RLS policy regressions caused by replaying migrations 0001 and 0002

## VERSION_34
- Merged `main` into `markbranch`. The only conflict was a modify/delete on `VERSIONS.md`: PR #125 (`5e5f1b7`) deleted the file, its `.gitattributes` union-merge rule, and the CLAUDE.md version-log section, while this branch had appended VERSION_33. `merge=union` cannot resolve modify/delete, which is why GitHub refused to auto-merge.
- Kept the version log: restored `VERSIONS.md` (full history + VERSION_33), `.gitattributes` (`VERSIONS.md merge=union`), and the CLAUDE.md "Version log" section.
- Everything else from `main` merged cleanly and was taken as-is — `src/pages/ProfilePage.jsx` (own-row + XP-to-top-10 leaderboard) and `INTERACTIVE_SECTIONS.md`.
- Commit: Merge main into markbranch, keeping VERSIONS.md and its union-merge rule

## VERSION_35
- **Navbar leaderboard button.** Added a trophy button next to the dark-mode toggle (desktop and mobile) in `src/components/layout/Navbar.jsx` that opens a modal leaderboard, so a student never has to walk to their profile to see the section standings.
- New `src/components/modals/LeaderboardModal.jsx`: same ten slots, same Week/Month/All periods, same dense ranking, own-row-outside-top-10 and opt-out notice as the profile board. It reads through `fetchLeaderboard()` and `useAuth()` itself, so nothing was threaded through `App.jsx`. Signed-out visitors get a "log in to see this" line rather than an empty board.
- **The profile leaderboard was not touched** — this is a duplicate for quick access, not a move.
- Navbar row is now a `grid-cols-[1fr_auto_1fr]` instead of `flex justify-between`, so the five centre nav links stay exactly centred however wide the logo or the right-hand controls get.
- **Wave 2 of the signature interactives (weeks 3–7) — seven new widgets**, all using `SimLayout` + `Stage`, all registered in `interactive/signatureWidgets.js` and pinned to their lesson via a `signature` block in `src/data/lessonsweek-0N.js`:
  - `phase-bench` (w03-l1) — one energy slider takes a live canvas of particles from a Bose–Einstein condensate through solid, liquid and gas to plasma, where ions and free electrons separate.
  - `heating-curve` (w04-l1) — hold-to-heat plots the temperature curve live beside the lattice; cooling walks the head of the curve back down, and the vacuum pump swaps in the one-plateau sublimation route.
  - `investigation-rig` (w05-l1) — the investigation as a conveyor. Pull a stage out and the belt keeps turning while the sample jams at the gap; the second-variable lever tangles the cause arrows and the machine delivers "?".
  - `meniscus-bench` (w05-l2) — real parallax: the sightline crosses the near-wall scale, so a wrong eye height produces a wrong number. The balance beside it reads 2.40 g with an empty pan until it is tared.
  - `solubility-beaker` (w06-l1) — sugar transfers from pile to solution on a fixed tick until it hits the limit; the marker sits below, on, or above the solubility curve, and the stirrer and crusher move only the rate.
  - `dilution-jar` (w07-l1) — particles live in normalised coordinates, so adding water genuinely spreads them without removing one; the % m/m readout falls as it happens.
  - `titration-drip` (w07-l2) — pH solved from the water equilibrium, so the needle crawls for thirty drops and jumps on the fortieth. H⁺ and OH⁻ pair into water, salt builds on the flask floor, phenolphthalein flips one drop past neutral.
- Reduced-motion handling for the canvas widgets: no `rAF` loop, but the draw function is stashed in a ref and repainted once per control change, so the picture still answers the slider instead of freezing at mount.
- `INTERACTIVE_SECTIONS.md` progress tables updated — Wave 2 done, 12 of 28 shipped, Wave 3 (weeks 8–13) next.
- Commit: Add navbar leaderboard modal and ship Wave 2 signature interactives for weeks 3-7

## VERSION_36
- **Dev-only "unlock every lesson" flag**, so the whole course can be walked one lesson at a time without sitting 33 quizzes.
- `src/lib/lessonGating.js` exports `UNLOCK_ALL = import.meta.env.DEV && import.meta.env.VITE_UNLOCK_ALL === 'true'`, and `isWeekUnlocked()`, `isLessonUnlocked()` and `weekLockReason()` short-circuit on it. Double-guarded by `import.meta.env.DEV`, so the variable cannot open the gates in a production build.
- `src/components/LessonTemplate.jsx` lesson-tab nav honours the same flag — without it only the week grid would open and lesson 2+ tabs inside each week would stay locked.
- Usage: add `VITE_UNLOCK_ALL=true` to `.env.local` and restart `npm run dev`. `.env.*` is already gitignored.
- Nothing else changed: quiz publish state, per-lesson hiding, XP and progress recording all behave exactly as before.
- Commit: Add dev-only VITE_UNLOCK_ALL flag to open every week and lesson

## VERSION_37
- **Wave 3 of the signature interactives (weeks 8–13) — seven new widgets**, all using `SimLayout` + `Stage`, all registered in `interactive/signatureWidgets.js` and pinned to their lesson via a `signature` block in `src/data/lessonsweek-NN.js`:
  - `equipment-bench` (w08-l1) — four instruments that actually work. The collar pulls the burner's yellow flame into a blue cone (temperature computed off the air setting), the balance pan overshoots on a damped spring before the reading settles, the funnel passes clear filtrate into the beaker while the mud stays on the paper, and the microscope's field of view is really blurred by an SVG Gaussian.
  - `hazard-cabinet` (w08-l2) — opening a bottle plays its symbol out: the corrosive bores through a steel plate, the flammable vapour reaches a spark a metre away, one drop of toxic spreads through a fish tank, an ember flares on oxygen alone. A second view is a lab floor where three hazards grow worse on their own until tapped (or fixed from the keyboard-reachable panel buttons).
  - `focus-scope` (w11-l1) — blur is `|stage − focal plane| ÷ depth of field`, so 4× forgives the coarse knob and 40× does not: one coarse step is two micrometres, the sharp band is under one, and the objective goes through the slide. The coverslip traps bubbles when it is dropped flat and none when it is lowered on an edge.
  - `scope-through-time` (w11-l2) — one year slider, resolution log-interpolated between Hooke 1665, Lister 1830 and Ruska 1933. Colour fringing is what an uncorrected single lens does; a structure is drawn only if it is bigger than the resolution limit, so the nucleus and then the ribosomes appear as the student scrubs.
  - `scope-field` (w12-l1) — six specialised cells drift under the objective and the view follows the one you pick while it keeps moving. Past 2.5× the interior resolves — or, in the two bacteria, does not: a loose nucleoid and ribosomes, with nothing enclosing them.
  - `cell-cutaway` (w12-l2) — the organelles are stations on one production line and every travelling dot belongs to one leg of it. Switching a station off stops only the legs downstream, and the exported-proteins-per-minute readout drops to zero at whichever station broke first.
  - `cell-morph` (w13-l1) — one slider morphs animal into plant; shared structures use coordinates that do not involve the morph value at all, so they visibly never move. The water slider then swells both: the plant cell's volume stalls and its turgor reading climbs against the wall, the animal cell lyses.
- Two lint lessons from the React Compiler rules, recorded in `INTERACTIVE_SECTIONS.md`: reading `ref.current` during render is an error (`react-hooks/refs`), so a reduced-motion flag that render needs is seeded into `useState` instead; and all seven widgets drive motion from a single `setTick` interval with every coordinate derived in render, rather than a `rAF` loop plus refs.
- `cell-morph` was specified as a possible GSAP candidate and shipped without it — the morph is slider-driven and the burst is a fourteen-step one-shot timer, so a tween library would have added a dependency for nothing.
- `INTERACTIVE_SECTIONS.md` progress tables updated — Wave 3 done, 19 of 28 shipped, Wave 4 (weeks 14–19) next.
- Commit: Ship Wave 3 signature interactives for weeks 8-13

## VERSION_38
- **Back-to-top button inside a lesson.** A floating "↑ Top" button appears once the reader is more than 640 px down and scrolls smoothly back to the start. Added in `src/components/LessonTemplate.jsx`: `TOP_BUTTON_AFTER_PX` at module scope, a `showTopButton` state fed by the scroll listener that already drives the progress bar (no second listener), and the button itself as the last child of the page wrapper.
- Placed bottom-right at `z-30`, deliberately below the XP toast (`z-50`) and the notification bell (`z-40`), so it can never cover either. It fades and slides in rather than popping, and is `pointer-events-none` while hidden.
- **Wave 4 of the signature interactives (weeks 14–19) — nine new widgets**, completing the set. Every one of the 28 content lessons now has a signature simulation; the five performance-task lessons deliberately have none.
  - `surface-volume` (w14-l1) — the fed shell is a fixed 20 µm however big the cell gets, so growing it grows the starved core instead. Surface area, volume, SA∶V and the fed percentage are all computed off the radius, and dividing halves the volume so the core visibly shrinks.
  - `cycle-dial` (w14-l2) — one dial. Chromosomes grow their second chromatid across S phase and the DNA-amount graph steps up with them, nowhere else. Damaged DNA does not warn: the slider physically stops at the G₂ checkpoint until it is repaired.
  - `mitosis-run` (w15-l1) — condensation, alignment, chromatid separation and cytokinesis are each a pure function of the scrub position, so dragging backwards runs the division in reverse rather than replaying a recording. Plant/animal switches the ending between a cleavage furrow and a cell plate.
  - `crossover-lab` (w15-l2) — four chromatids, six loci. The two inner strands swap everything below the crossover index, so moving it by one gene changes two of the four gametes on screen. The counter shows the halving happening at meiosis I and *not* again at meiosis II.
  - `fusion-bench` (w16-l2) — the chromosome total is the sum of the two slots. 23 + 23 gives a zygote that starts cleaving on its own with 46 in every new cell; loading a body cell gives 69 and a zygote drawn as the failure it is.
  - `clone-bench` (w17-l1) — binary fission, budding, fragmentation and vegetative propagation each animate on a real organism. The field they fill is genetically identical, so the disease sweep leaves no survivors.
  - `variation-batch` (w18-l1) — twelve offspring from a deterministic hash of the batch seed, pulled toward the parents' midpoint, so moving a parent slider shifts the whole spread. The same disease grips one band of shell tones and the spread reaches past it.
  - `energy-flow` (w18-l2) — which organisms are fed is recomputed every render by walking from the sun along the arrows that currently point the right way. Reversing one starves everything behind it and its packets stop; the web switch gives the hawk a second route that survives losing the frog.
  - `ten-percent` (w19-l1) — tier widths are the cube root of the surviving fraction, so the pyramid shape is a consequence of the 90% losses rather than a drawing. A carbon atom runs the closed nutrient loop beside it.
- Third React Compiler lint lesson, recorded in `INTERACTIVE_SECTIONS.md`: a hoisted helper called inside a `useEffect` that sits above its declaration is an **error** (`Cannot access variable before it is declared`), not a warning. `win` / `mark` / `finish` now sit above the first effect that calls them.
- Warning count is back to the pre-existing baseline of 10: the three new `exhaustive-deps` warnings were fixed properly rather than left, by wrapping `win` / `mark` in `useCallback` and listing them in the effect deps.
- `mitosis-run` and `crossover-lab` were both flagged as GSAP candidates in the plan and both shipped without it — every position is derived from the control value, so there was nothing left for a tween library to do.
- `INTERACTIVE_SECTIONS.md` updated — all four waves done, 28 of 28 shipped, no "next three".
- Commit: Add lesson back-to-top button and ship Wave 4 signature interactives for weeks 14-19

## VERSION_39
- Removed the Section Leaderboard card from `src/pages/ProfilePage.jsx`. It duplicated the navbar's `LeaderboardModal`, and the profile page is for the student's own progress.
- Subject Progress now spans the full width. The two-column grid that held it next to the leaderboard is gone.
- Deleted the code only the card used: the `LEADERBOARD_PERIODS` / `PERIOD_API` constants, the `activePeriod` / `board` / `boardLoading` state, the per-period fetch effect, `renderBoardRow`, the top-10 slot logic, and the `LeaderboardRank` / `TrendingUp` imports.
- Kept the "Section Rank" quick stat (it still reads the all-time board) and the "On the leaderboard / Hidden" toggle in the profile header.
- Commit: Remove duplicate section leaderboard from profile page

## VERSION_40
- Subject Progress and Recent Activity now sit side by side in `src/pages/ProfilePage.jsx`: one `grid lg:grid-cols-2 gap-8` row. They stack on smaller screens.
- Recent Activity moved up above My Quizzes to share that row. Page order is now Stats, then Subject Progress + Recent Activity, then My Quizzes, then Achievements.
- Both cards got `h-full` so they stretch to the same height when one has more rows.
- Commit: Show subject progress and recent activity side by side on profile page

## VERSION_41
- Profile header: the player card is now the same height as the right-hand column (Quick Stats, Current Focus, Member Since) in `src/pages/ProfilePage.jsx`. It used to stop short.
- Removed `items-start` from the header grid so both columns stretch to the taller one. The player card is now `flex flex-col`.
- The Achievements label got `mt-auto`, so it and the badge row sit at the bottom of the card and line up with the bottom of Member Since. The extra space goes above them, below the XP bar.
- Commit: Align profile player card height with the sidebar cards

## VERSION_42
- Moved the leaderboard visibility toggle from under the student's section name to the right end of the Quick Stats heading in `src/pages/ProfilePage.jsx`. It now sits directly above Section Rank, the value it hides.
- The toggle is now a borderless icon + text button: "On leaderboard" or "Hidden". It keeps a 44px tap target, and `-my-3` stops that from making the header taller. It has an `aria-label` and `aria-pressed` for screen readers.
- The profile card's name block is back to name, streak and section only.
- Commit: Move leaderboard visibility toggle into the Quick Stats header

## VERSION_43
- Reverted the equal-height player card from VERSION_41 in `src/pages/ProfilePage.jsx`. With the leaderboard toggle gone, stretching the card left a large empty gap between the XP bar and Achievements.
- Put `items-start` back on the profile header grid, removed `flex flex-col` from the player card, and removed `mt-auto` from the Achievements label. The card is only as tall as its content again.
- Commit: Revert equal-height profile card to remove empty space

## VERSION_44
- Plant Cell Level 1 (Power the Cell) now uses the matter-state sandbox layout: top bar, left info sidebar, grid stage and bottom control bar. It reuses the sandbox's global `sq-*` shell classes from `src/index.css` without editing them, and nothing in `src/games/matter-state-sandbox/` was touched.
- New `src/games/plant-cell/ui/LabFrame.jsx` holds the shell:
  - Top bar: Exit, "Level 1 — Power the Cell · objective", and theme, pause and restart icon buttons.
  - A Paused popup with a Resume button.
- `levels/PowerTheCell.jsx` now fills that shell:
  - Sidebar: an orange objective card with a time-survived bar and seconds left, the coaching line, and the health, glucose, cell water and soil water meters in a stats card.
  - Stage: photosynthesis rate, limiting factor and oxygen as small text in the top-left, an "Inside a cell" / "Whole plant" pill in the top-right, and the plant or cell drawing above the equation strip.
  - Bottom bar: Sunlight, Water from roots and Stomata sliders side by side, with one-line hints.
- `index.jsx` passes `onRestart` to Level 1 so the restart button starts a fresh run.
- `styles.css` got a `pc-lab-*` block covering the parts the sandbox shell has no class for. On screens 768px or narrower, the sliders stack, the meters become a 2-column grid, and the top-bar buttons grow to 44px.
- Levels 2 and 3 are unchanged and still use `RunFrame`. No "Saved" pill: this game only saves when a run ends.
- Commit: Give Plant Cell Level 1 the sandbox-style layout

## VERSION_45
- Plant Cell Level 1 (Power the Cell) now plays like the matter-state sandbox. There is no 30-second timer. Instead there are 5 quests, each completed by holding a condition for a few seconds: Open the stomata, Turn up the sun, Draw water from the roots, Find the limiting factor, and Full power. They live in `quests[]` in `src/games/plant-cell/data/levels.js`.
- The left sidebar lists the quests using the sandbox's `ChallengePanel`, imported as-is. The active quest shows a hold-progress bar, and finished quests get a check mark. Clicking a quest makes it active.
- The new `src/games/plant-cell/ui/QuestModal.jsx` pops up when a quest completes. It shows the quest's science note plus Keep exploring and Next quest buttons, and the sim pauses while it is open. After the last quest it also shows the level's stars and debrief, with a Back to levels button.
- The run no longer ends when the quests are done; it only ends if the cell dies. Finishing every quest saves the `l1` level row, which keeps unlocks, XP and the Sun Catcher achievement working. Each quest also saves its own row.
- Quests from earlier sessions load already ticked, and a level finished before quests existed shows all of its quests ticked.
- Matter State Sandbox: challenges finished in earlier sessions now show a check mark when you re-enter a level. The level opens on the first unfinished challenge, or free explore if all are done. The only file changed is `src/games/matter-state-sandbox/index.jsx`.
- Commit: Turn Plant Cell level 1 into sandbox quests and tick saved challenges in both games

## VERSION_46
- Fixed Plant Cell Level 1 crashing to a blank cream screen right after "Start photosynthesis". The React Compiler reads `celebration.nextQuest` during render to memoise `handleNextQuest` in `src/games/plant-cell/levels/PowerTheCell.jsx`, and `celebration` is `null` until a quest completes. The handler now reads `celebration?.nextQuest ?? null`.
- Temporary crash/layout probe used to find it (`src/games/plant-cell/ui/DebugProbe.jsx` and its wiring in `index.jsx`) was removed again.
- Commit: Fix Plant Cell level 1 crash from null quest celebration under React Compiler

## VERSION_47
- Plant Cell Levels 2 and 3 now play like Level 1: the same sandbox layout (top bar, quest list on the left, stage, bottom controls), 5 quests each with the check-mark list and quest popup, and no ending except a dead cell.
- The quest logic moved out of Level 1 into the new `src/games/plant-cell/engine/useQuests.js`, which all three levels use. `ui/LabFrame.jsx` now draws the quest list, the Whole plant / Inside a cell toggle, the stage and the quest popup, so each level only supplies its readings, drawings, caption and controls.
- Level 2 (Keep It Alive): no 55-second weather clock. The player picks the weather (Mild, Heavy rain, Drought, Salty soil) in the bottom bar, next to the channels slider and the vacuole Store / Release buttons. Quests: Make it rain, Bank water in the vacuole, Test the cell wall, Survive salty soil, Ride out a drought. Stars come from the share of the run spent in the healthy turgor band. `stepOsmosis` now takes the picked weather instead of a clock.
- Level 3 (Cell Emergency): tests, organelle picks and the diagnosis button sit in the bottom bar; monitors and evidence sit in the sidebar. Quests: Run a test, Rule something out, Name the fault, Repair the organelle, Nurse the cell back. A solved case no longer ends the level; "Open a new case" loads the next fault. Stars come from wrong calls in the case that finished the level.
- Plant cell's bottom control row now sizes to its content (at least 132px, at most 45% of the screen) so Level 3's buttons fit.
- Removed code nothing used any more: `ui/RunFrame.jsx`, `ui/ViewTabs.jsx`, `ResourceSlider`, `currentWeather`, and their CSS.
- Commit: Convert Plant Cell levels 2 and 3 to sandbox-style quests

## VERSION_48
- Rebuilt Plant Cell Level 2 (Keep It Alive) so it only uses what the Week 12 and 13 lessons teach, in plain words students can follow without a teacher explaining.
- Removed everything the lessons don't cover: the salt-concentration numbers, the membrane-channels slider, the vacuole Store / Release buttons, cytoplasm water, cell health and dying, stars from a "healthy band", and the stomata / carbon dioxide / water-vapour art in the plant picture (`PlantView` got a `showLeafGas` prop; Level 1 still shows it).
- New controls: "Around the cell" (Pure water / No water / Salty water) and "Show" (The plant / Plant cell vs animal cell).
- The stage shows two pictures side by side: the whole plant next to a close-up plant cell, or a plant cell next to an animal cell in the same water. The new `ui/WaterCell.jsx` draws them in the lesson widget's style, with a labelled cell wall and a central vacuole that visibly fills and shrinks. The animal cell swells and bursts.
- The sidebar has a plain one-sentence explanation of what is happening now, a vacuole meter ("Full — firm" / "Part full" / "Low — wilting") and the lesson's key terms.
- New quests, taken from the lesson scenarios: Let the plant wilt, Water it back up, Fill the cell completely, Plant cell vs animal cell, Salty water. The level can't be failed, so finishing it gives 3 stars.
- New `engine/water.js` replaces `engine/osmosis.js`. LabFrame hides the Whole plant / Inside a cell toggle when a level doesn't use it.
- Commit: Rebuild Plant Cell level 2 around the vacuole, turgor and cell wall lessons

## VERSION_49
- Cleaned Plant Cell Levels 1 and 3 so they only use what the Week 12 and 13 lessons teach, like Level 2.
- Level 1 (Power the Cell): "Stomata open" is now a plain Carbon dioxide slider, and "Water from roots" is now just Water. Removed the untaught rules: water lost through stomata, soil draining and refilling, and "limiting factor". Photosynthesis still needs all three ingredients, and the cell still uses glucose for energy. Sidebar meters are now Cell health and Glucose store. New quests: Turn on the sunlight, Give it water, Add carbon dioxide, Take one away, Make lots of glucose. The briefing and debrief now mention chlorophyll and mitochondria, as the lessons do.
- The whole-plant picture (`ui/PlantView.jsx`) no longer draws the stoma close-up, its callout or water vapour; the `showLeafGas` prop is gone.
- Level 3 (Cell Emergency): removed the tracer dye test, and renamed "Stain the nucleus" to "Check the nucleus and its DNA". Test results and reasoning no longer mention channels, osmosis or dye. The membrane case is now solved from the pure-water and salty-water tests.
- Every level's sidebar now shows the lesson's key terms (`keyTerms` in `data/levels.js`, drawn by `ui/LabFrame.jsx`).
- Commit: Keep Plant Cell levels 1 and 3 to lesson content and show key terms in every level

## VERSION_50
- Reworked Plant Cell Level 2 from a watch-the-meter sandbox into "Predict, Then Test". Each quest is now a round: a plant or animal cell goes into pure water, salty water or no water, the player picks what will happen (stays firm / bursts / shrinks), then runs the test and watches.
- A wrong prediction shows what really happened, explains why, and lets the player predict again. Stars now come from wrong predictions (`starsByMisses` in `data/levels.js`), so Level 2 is no longer an automatic 3 stars.
- Six rounds: plant cell in pure water, plant cell in salty water, animal cell in pure water, a shrunken plant cell in pure water, animal cell in salty water, and a plant with no water.
- New screen `levels/PredictThenTest.jsx` replaces `levels/KeepItAlive.jsx`. `engine/water.js` now steps one cell at a time (`createCellState`, `stepCell`, `outcomeOf`). Reuses the existing WaterCell and PlantView art.
- Commit: Rework Plant Cell level 2 into a predict-then-test round game

## VERSION_51
- Plant Cell Level 2 is now "What Happens If?" — a prediction level on Level 1's photosynthesis, replacing the cell wall / animal cell / water rounds.
- Five rounds, each asking "What do you think will happen if…?": the sunlight is blocked, the plant gets no water, the stomata close (no carbon dioxide), the sunlight dims to 20%, and everything is turned up to full.
- Each round: the plant runs normally while the player picks one of three answers, then "Let's see it happen" makes the change and plays it for 5 seconds in the plant and cell views. A right answer completes the quest; a wrong one highlights the right answer, explains why, costs a star and offers Try again.
- Rounds, questions, answers and explanations all live in `data/levels.js` (`quests[].question`, `change`, `choices`). `levels/PredictThenTest.jsx` now runs on `engine/photosynthesis.js`. `engine/water.js` and `ui/WaterCell.jsx` are no longer used by any level.
- Commit: Turn Plant Cell level 2 into What Happens If? photosynthesis predictions

## VERSION_52
- Plant Cell level briefing now opens over the level list instead of a blank screen: `index.jsx` keeps `LevelSelect` mounted behind `EducationalModal` during the brief stage.
- `.pc-modal` in `styles.css` blurs what is behind it (`backdrop-filter: blur(6px)`) and its dark tint is lighter (0.45 → 0.32) so the level cards stay visible.
- Commit: Blur the level list behind the Plant Cell briefing popup

## VERSION_53
- Mystery Lab expedition map now fills its whole card. `.ml-world` in `expedition.css` was locked to a 10:7 box sized from the card's height (`min(100%, calc((100cqh - 35px) * 10 / 7))`), which squeezed the map into the middle and left empty bands down both sides; it is now `width: 100%; height: 100%`.
- Dropped the now-unused `container-type` rules that only existed to feed that calculation.
- Commit: Make the Mystery Lab map fill its card instead of sitting squished in the middle

## VERSION_54
- Fixed the Mystery Lab map looking zoomed in after VERSION_53: sprite widths were percentages of the map's width, so widening the map magnified every tree, pond and building by roughly 40%.
- `ExpeditionMap.jsx` now sizes every sprite off the map's height via `spriteWidth()` (`calc(<n> * 10cqh / 7)`), so sprites stay at their designed size at any card shape and the landmarks spread out instead of crowding. `.ml-world` declares `container-type: size` to make that work, and the factory smoke is sized the same way.
- Commit: Size Mystery Lab map sprites off the map height so a wide map does not zoom in

## VERSION_55
- Removed the `lab-bench` table sprite drawn over the Lab Tent on the Mystery Lab map (`ExpeditionMap.jsx`).
- Commit: Remove the bench sprite from the Mystery Lab map tent

## VERSION_56
- Mystery Lab opening screen now runs full-bleed: added `full-bleed` class on `<main className="screen">` when `screen === "opening"` (src/games/mystery-lab/index.jsx) and matching CSS (`.screen.full-bleed` drops the 1280px max-width + page padding; `.ml-opening-card` drops radius/border/shadow) in src/games/mystery-lab/styles.css.
- Commit: Make Mystery Lab opening screen edge-to-edge full-bleed

## VERSION_57
- Every Mystery Lab screen now spans the full window: dropped `max-width: 1280px` + `margin: 0 auto` from `.screen` in src/games/mystery-lab/styles.css (page gutter padding kept for the card screens; opening stays padding-0 full-bleed).
- Commit: Let all Mystery Lab screens span the full window width

## VERSION_58
- Mystery Lab cutscene (intro) screen now full-bleed too: `full-bleed` class extended to `screen === "intro"` in src/games/mystery-lab/index.jsx, and the intro stage's `borderRadius: 20` dropped in src/games/mystery-lab/screens-a.jsx.
- Commit: Make the Mystery Lab intro cutscene run edge-to-edge

## VERSION_59
- Redesigned Mystery Lab's opening screen as a measured case-file layout with a clear title and investigation CTA, compact scientific-method sequence, and grouped case metadata.
- Rebuilt the hero art as one grounded pond scene with a shared horizon, factory, healthy and polluted ponds, and a wider Detective Hoot welcome bubble; the scene now follows light and dark theme tokens and respects reduced motion.
- Commit: Redesign the Mystery Lab opening case file

## VERSION_60
- Reimagined the Mystery Lab opening as a single lively, full-bleed Maple Creek map: the generated art keeps a calm left-side clearing for the live case-file UI and shows the factory, contaminated runoff, both ponds, wildlife and Detective Hoot together on the right.
- Restyled the live title with a chunky game-display treatment and retained the controls, accessible text, dark-theme contrast wash, and short-screen CTA behavior.
- Commit: Turn the Mystery Lab opening into a full illustrated map

## VERSION_61
- Fixed the Mystery Lab opening map failing to render by making it an explicit, base-URL-aware `<img>` layer below the UI, with its contrast wash rendered as a separate layer.
- Commit: Fix the Mystery Lab opening map rendering

## VERSION_62
- Fixed the opening map crop: it now preserves the complete generated landscape, anchored to the right beside the case-file clearing, instead of using `cover` to cut off its top and bottom.
- Commit: Show the complete Mystery Lab opening map

## VERSION_63
- Made the opening map span the full wide hero without a visible fitted-image edge or crop, and softened its saturation so it sits more naturally with SciQuest's flatter game UI.
- Commit: Extend the Mystery Lab opening map across the hero

## VERSION_64
- Replaced the opening map with a purpose-built panoramic, flatter game illustration. Its single watershed now visibly runs from the factory outlet through polluted Pond A and downstream to healthy Pond B, with the left-side case-file clearing kept open.
- Commit: Regenerate a coherent panoramic Mystery Lab map

## VERSION_65
- Rebuilt the opening background as two separate pond vignettes: factory runoff terminates at polluted Pond A, while Pond B sits beyond a tree-and-ridge divider with no shared stream or water connection.
- Commit: Separate the Mystery Lab opening pond locations

## VERSION_66
- Added a transparent, hand-lettered title-lockup asset for “The Dying Pond Mystery” and now render it inside the opening screen's semantic H1.
- Commit: Add a custom Dying Pond title lockup

## VERSION_67
- Removed the opening's premise and Hoot quote copy, leaving the title and actions as the focus.
- Added transparent generated investigation and case-briefing emblems to the two real opening buttons.
- Commit: Focus the Mystery Lab opening actions with custom button art

## VERSION_68
- Mystery Lab opening: removed the light-mode cream fade over the map art (`--opening-map-wash: none` in src/games/mystery-lab/styles.css; dark-mode wash kept for text contrast).
- Removed the "Episode 01 · Grade 7 Science" tag above the title (src/games/mystery-lab/screens-a.jsx) and its now-unused `.ml-opening-episode` CSS rule.
- Commit: Drop title fade and episode tag from Mystery Lab opening

## VERSION_69
- Mystery Lab opening title lockup now bobs gently: added the existing `float` class (`ml-float-y`, 4s, ±6px + ±1° tilt) to the title `<img>` in src/games/mystery-lab/screens-a.jsx; already disabled under `prefers-reduced-motion`.
- Commit: Animate Mystery Lab opening title with a gentle bob

## VERSION_70
- Mystery Lab opening: the "01 Observe → 04 Conclude" step line now sits on a solid paper pill (bg `--bg-paper`, border, card shadow, 13px `--text`) so it reads over the map art; step numbers use `--primary` in dark mode for contrast (src/games/mystery-lab/styles.css).
- Commit: Put Mystery Lab opening step line on a readable paper pill

## VERSION_71
- Mystery Lab opening buttons: "Case briefing" is now a solid paper button (bg `--bg-paper`, 2px `--primary` border, 4px `--primary-d` press shadow) sized to match "Start Investigation"; both opening buttons get a yellow `:focus-visible` ring (src/games/mystery-lab/styles.css).
- Commit: Make Mystery Lab opening buttons solid and matched

## VERSION_72
- Mystery Lab opening: removed the "01 Observe → 04 Conclude" step pill under the buttons (JSX + `MissionStep` helper in src/games/mystery-lab/screens-a.jsx, `.ml-opening-pills` / `.ml-opening-step` rules in src/games/mystery-lab/styles.css).
- Commit: Remove the method-steps pill from Mystery Lab opening

## VERSION_73
- Mystery Lab cutscene: dropped the flat vector props that doubled up on the painted backdrops — sun disc, static/animated clouds and all 30 `<Tree>` sprites on the Peaceful and Mission panels, plus the grove frame and prop SVGs on Mission (src/games/mystery-lab/screens-a.jsx).
- Foliage frames (`foreground-grove.png`, `alarm-marsh-frame.png`) no longer use `scaleY()` — they keep their painted aspect and are widened to 116% / sunk below the stage so the canopies crop off the top instead of looking squashed (src/games/mystery-lab/styles.css).
- Ponds are now positioned with plain `left`/`right`/`bottom` per panel instead of a fixed 270px width + `translateX(-50%) scale()`, so each panel's pond sits on the ground at a sane size.
- Compare panel's centre seam and "?" moved from inline styles to `.ml-compare-seam` / `.ml-compare-question`.
- "Skip intro" moved from top-left to bottom-right so it no longer sits under the game shell's overlay Back pill.
- Commit: Fix Mystery Lab cutscene layering, foliage distortion and skip-button overlap

## VERSION_74
- Fixed the giant floating pond in the Mystery Lab cutscene: an `<img>` is a replaced element, so `left` + `right` + `width: auto` makes it keep its intrinsic 1536px width and drop `right`. Each pond now sets an explicit `width` and is centred with `left = (100 - width) / 2` (src/games/mystery-lab/styles.css).
- Foliage frames no longer crop the tree canopies: `.ml-cutscene-grove` / `.ml-cutscene-alarm-frame` now use `inset: 0` + `object-fit: cover` + `object-position: center top`, so the crop falls on the low ground strip at the bottom instead of cutting the treetops.
- `ml-grove-sway` animates `transform` on a 1.02-scaled image instead of `margin-left`, which used to shift the whole layer and expose a strip of backdrop at the edge.
- Butterflies moved down onto the meadow (were floating in the sky).
- Commit: Centre the cutscene ponds and stop cropping the foreground canopies

## VERSION_75
- Mystery Lab now owns its back control, so the game shell's dark overlay Back pill no longer sits on top of the HUD's "Mystery Lab / EP 01 - Dying Pond" title: added `mystery-lab` to `GAMES_WITH_OWN_BACK` (src/pages/GamePlayPage.jsx).
- HUD: the exit button moved from the far right (where it was never rendered, since `onExit` was not passed) to the far left of the bar as an icon-only ghost back arrow, and `index.jsx` now passes `onExit` to it (src/games/mystery-lab/shared.jsx, src/games/mystery-lab/index.jsx).
- The opening and intro screens draw no HUD, so they get their own round back button at top-left; the repeated floating-control style is now one `FLOATING_BTN` const shared by back/mute/theme.
- Added the SciQuest back arrow (`M19 12H5M11 6l-6 6 6 6`) to the Mystery Lab `Lucide` icon map as `arrowLeft`.
- Commit: Give Mystery Lab its own back button instead of the overlapping shell pill

## VERSION_76
- The in-game `Pond` sprite now draws the painted cutscene pond (`/games/mystery-lab/cutscene/pond-healthy.png` / `pond-polluted.png`) instead of the flat `art/pond-*.png` blob. Same 3:2 aspect, and the intro cutscene already loads both files, so the observation screen gets them from cache (src/games/mystery-lab/world.jsx).
- The painted pond's water sits lower inside its frame than the old blob, so the Pond A/B clue hotspots were nudged back onto open water in `CLUE_POS` — deadFish/healthyFish 60%,70% -> 58%,65%; clearWater 40%,70% -> 44%,65%; murky 56%,49% -> 54%,56%; smell 40%,45% -> 44%,47%. `rx`/`ry` ripple centres updated to match (src/games/mystery-lab/screens-b.jsx).
- Commit: Use the painted cutscene pond art in the observation screens

## VERSION_77
- Observation screen pond is much bigger: the wrapper's `translateX(-50%) scale(1.8)` on a `size={260}` Pond is replaced by a flex-centred wrapper at `bottom: -76` with `size={660}`, so the pond spans ~12-88% of the scene card instead of ~28-72%. The negative bottom pushes the art's transparent under-rim padding off the card and keeps the rim clear of the Pond A/B toggle (src/games/mystery-lab/screens-b.jsx).
- All clue hotspots re-placed for the larger pond and spread out instead of clustering: deadFish 40%,62%; murky 66%,60%; temp 80%,70%; smell 32%,40%; healthyFish 55%,66%; clearWater 36%,58%; tempB 78%,72%. `rx`/`ry` ripple centres updated to match.
- Commit: Enlarge the observation pond and re-place the clue hotspots

## VERSION_78
- Both observation thermometers scaled up from `width={48}` to `width={84}` (height follows, 72px -> 126px), so the 34 C / 22 C readings are legible next to the enlarged pond (src/games/mystery-lab/screens-b.jsx).
- Pond B's thermometer moved from 78% to 84% across, since at the bigger size its bulb hung over the water instead of standing in the bank; `rx` updated to match.
- Commit: Enlarge the observation thermometers and reseat Pond B's on the bank

## VERSION_79
- Removed the dark "Pond A / Pond B" switcher pill that floated at the bottom of the observation scene. Switching ponds still works from the "Switch to Pond A/B" button in the screen header, so nothing is lost and the enlarged pond now has the full card (src/games/mystery-lab/screens-b.jsx).
- Commit: Remove the floating pond switcher pill from the observation scene

## VERSION_80
- The Ask/Hypothesise screen is now two sequential steps instead of one two-column dump: step 1 shows only "Pick a question" with a Next button (disabled until a question is picked), step 2 shows only "Pick hypotheses" plus the linked-evidence panel, with "Back to map" (disabled until at least one hypothesis) and a ghost "Question" button to step back. Driven by local `step` state, so no new route or app-level state (src/games/mystery-lab/screens-b.jsx).
- Header shows the live phase ("Phase 2 - Ask" / "Phase 3 - Hypothesise") and a "Step N of 2" chip; Hoot's line and mood now react to the step, including a nudge when the wrong question is picked.
- Hypothesis sticky notes now lay out `repeat(auto-fit, minmax(210px, 1fr))` so they fill the full-width card instead of a half-width column.
- Commit: Split the ask/hypothesise screen into two guided steps

## VERSION_81
- Added docs/asset-prompts/mystery-lab-lab-tent.md: a Codex art brief to revamp the Lab Tent and its five mini-games (21 PNGs). Follows the plant-cell.md shape - a consumer table linking every file to the exact inline SVG it replaces in screens-c.jsx, the game's real hex palette pulled from styles.css and the TESTS/POLLUTION_LEVELS/TEMP_CONTAINERS tables, per-asset export sizes, and identical-frame rules for the three pH strip states, the three pollution vials and the two contaminant states.
- Commit: Add the Codex asset prompt for the Mystery Lab tent mini-games

## VERSION_82
- Level icons now use five star tiers cut from `public/level-stars/Five-Tier Rounded Star Icon Set-Photoroom.png` into `star-tier-1..5.png` (256 × 256, centered, uniform padding).
- `src/lib/level-icons.js` maps level → tier with `ceil(level / 3)` (1–3, 4–6, 7–9, 10–12, 13–15) and loads from `level-stars/`.
- Removed old `public/level-stars/star-level-01..15.png`; rewrote `public/level-stars/PROMPTS.md` for the tier set.
- Commit: Switch level icons to five 3-level star tiers cut from new star sheet

## VERSION_83
- Mystery Lab temperature mini-game: removed the old SVG beaker (outline, brown rim, tick marks) that was drawn over the new `temp-beaker-glass.png`. `ContainerBeaker` in `src/games/mystery-lab/screens-c.jsx` now draws water + dipped thermometer behind the PNG, shows the PNG at full opacity and true aspect ratio, and moves the ✓ badge clear of the lid.
- Commit: Fix Mystery Lab temperature beakers double-drawn over new glass art

## VERSION_84
- Mystery Lab Phase 5 storyboard (`src/games/mystery-lab/screens-d.jsx`) now fits on one screen: comic panels use a viewport-scaled height (`clamp(104px, 19vh, 160px)`) instead of a 4:3.4 aspect ratio, with less strip padding; filled panels stack the scene icon above the caption so they don't overlap.
- Clue cards use an auto-fill grid (`minmax(190px, 1fr)`, 4 across on desktop) with slimmer padding and icons; the "Pick the clue" line folded into the hint row; "Drop on a panel" → "Tap to place" (it's a click).
- Commit: Compact Mystery Lab storyboard so panels and clues fit without scrolling

## VERSION_85
- Mystery Lab Phase 6 report (`ConclusionScreen` in `src/games/mystery-lab/screens-d.jsx`) is now a 3-step wizard: one question per step (Cause → Evidence → Explain) with clickable step pills, Back/Next footer, and "Close the Case" on the last step. Next stays disabled until the step's requirement is met.
- Detective Hoot's sidebar tip changes per step; the old sidebar submit button and requirements line were folded into the form footer.
- Commit: Turn Mystery Lab final report into a one-question-at-a-time stepper

## VERSION_86
- Mystery Lab temperature mini-game: °C readings (under each beaker and on the "Which was hottest?" cards) are now coloured on a blue→red scale by temperature (`getTempColor` in `src/games/mystery-lab/screens-c.jsx`, 15 °C = blue, 35 °C = red) instead of all red.
- Commit: Colour Mystery Lab temperature readings blue-to-red by value

## VERSION_87
- Mystery Lab victory screen: removed the "Up next · Episode 2 — The Wilting Plant Lab" banner and its Continue button (`src/games/mystery-lab/screens-d.jsx`), plus the now-unused `restart` callback/prop in `src/games/mystery-lab/index.jsx`.
- Commit: Remove Mystery Lab "Up next" episode banner from victory screen

## VERSION_88
- Mystery Lab hub thumbnail (`src/assets/mysterylab.png`) replaced with a crop of the "Dying Pond Mystery" opening art (factory, drain pipe, dying pond vs healthy pond, Detective Hoot), 785 × 508. Registry import unchanged.
- Commit: Replace Mystery Lab hub thumbnail with opening-scene art

## VERSION_89
- Added Live Quest, a teacher-hosted live quiz (our take on a Kahoot-style room). Teacher Portal → new "Live Quest" tab (`src/components/live-quest/LiveQuestHost.jsx`): Create room → 6-character join code, then in the lobby pick lessons (their multiple-choice + true/false quiz questions are played) and set "Time per question" (5–120 s) while students join live; Start → timed questions with answered count, auto-reveal when time is up or everyone answered, answer breakdown + Top 5, Next / Final results. An open room is resumed after a refresh.
- Students: new "Live Quest" navbar link → `src/pages/LiveQuestPage.jsx` (view `live-quest`): enter code → lobby → tap A/B/C/D tiles (shape + letter + color) → correct/points/rank after each reveal → final placing.
- New `supabase/migrations/20261024000000_live_quest.sql`: `live_rooms`, `live_room_questions` (host-only, holds answers), `live_room_players`, `live_room_answers`, RLS on all, realtime publication, and RPCs `join_live_room`, `start_live_question`, `reveal_live_question`, `submit_live_answer` (server-side answer check + speed scoring 1000→500). Index in `20261024000100_live_rooms_host_idx.sql`. `schema.sql` snapshot updated. Practice only — no XP, quiz_attempts or gradebook.
- New `src/lib/liveQuest.js` (all Live Quest DB calls), `src/hooks/useLiveRoom.js` (live room + countdown), `src/components/live-quest/options.js` + `LiveLeaderboard.jsx`.
- Commit: Add Live Quest: teacher-hosted live quiz rooms with join codes and timed questions

## VERSION_90
- Moved the student Live Quest entry from the navbar into the Games hub: a "Live Quest — Join with code" banner card above "All Games" (`src/pages/GamesHubPage.jsx`) opens the `live-quest` view. Removed the navbar link (`src/components/layout/Navbar.jsx`).
- `LiveQuestPage` now has the standard SciQuest back arrow (returns to Games, wired in `src/App.jsx`); the teacher lobby hint now says "Games → Live Quest".
- Commit: Move Live Quest entry into the Games hub

## VERSION_91
- Live Quest lobby: each lesson now expands (chevron + "picked/total Q" button) to show its playable questions with a type chip, each with its own checkbox. Lesson checkbox shows a partial (indeterminate) state; ticking a partial lesson selects all, ticking a full one clears it. Week badge now counts picked questions (`src/components/live-quest/LiveQuestHost.jsx`).
- `src/lib/liveQuest.js`: added `toQuestionKey` + `getPlayableQuestions`; `buildQuestionPool` takes an optional excluded-question list; removed `countPlayableQuestions`. Per-question unticks persist per room in host `localStorage` (no schema change).
- Commit: Let hosts see and pick individual Live Quest questions

## VERSION_92
- Live Quest lobby lesson picker now shows one week at a time: ‹ / › arrows step weeks, the middle is a week dropdown (each option shows its picked-question count) for jumping straight to any week. Replaces the stack of per-week accordions. Lessons show their questions expanded by default; selected total moved to its own live line (`src/components/live-quest/LiveQuestHost.jsx`).
- Commit: Live Quest lobby: step through weeks with arrows instead of accordions

## VERSION_93
- Live Quest question sets (Kahoot-style authoring). Teachers write their own questions in private sets and mix them with lesson questions in a room.
  - DB: `supabase/migrations/20261025000000_live_quest_sets.sql` adds `live_quest_sets` (owner-only RLS, questions as a JSON array) and `live_rooms.set_ids`; `start_live_question` / `reveal_live_question` / `submit_live_answer` now support multiple correct answers (`correctAnswers`), a per-question timer (`seconds`), and points `standard` / `double` / `none`. Owner index in `20261025000100_live_quest_sets_owner_idx.sql`. Images upload to the existing public `lesson-media` bucket under `live-quest/<teacher id>/`.
  - `supabase/schema.sql`: synced with the above, and repaired a pre-existing corruption where an ~80-line duplicate of the file's tail had been spliced into the `live_rooms` table definition.
  - New `src/components/live-quest/QuestionSetLibrary.jsx` (list / new / edit / duplicate / delete) and `QuestionSetEditor.jsx` (question list + editor: type, time limit, points, question text, optional image, 2–4 coloured answers with any number marked correct, reorder / duplicate / delete, unfinished-question warnings, explicit Save).
  - `LiveQuestHost.jsx`: library on the Live Quest home; lobby has a Lessons / My sets switch, both pickable and mixable; the picker is now a generic `QuestionGroupPicker` showing chips (type, multiple correct, timer, points, image). Host question/reveal screens show the image + points badge and every correct answer.
  - `LiveQuestPage.jsx` (student): image + points badge, reveal lists all correct answers. Shared `QuestionExtras.jsx`; `getCorrectAnswers` in `options.js`; per-question countdown via `getQuestionSeconds` in `useLiveRoom.js`.
  - `src/lib/liveQuest.js`: set CRUD, image upload, `getSetQuestionIssues`, `buildSetQuestionPool`; picks keyed by `pickId` (quiz index for lessons, question id for sets).
- Commit: Add Kahoot-style Live Quest question sets with multi-answer, per-question timer, points and images

## VERSION_94
- New students now start with the Forest avatar background instead of Science Lab.
  - `supabase/migrations/20261027000000_avatar_default_forest.sql`: `students.avatar_style` column default background `original` → `meadow` (the Forest id). Existing rows untouched. `supabase/schema.sql` synced.
  - `src/lib/avatar-personalization.js`: `normalizeAvatarStyle` fallback background is now `meadow`.
- Commit: Default new student avatar background to Forest

## VERSION_95
- Plant Cell Level 2 ("What Happens If?"): each round now opens with a full-screen blurred overlay asking the question, listing the choices, and a "Let's see what happens" button. Picking + confirming closes it and plays the change.
  - `src/games/plant-cell/levels/PredictThenTest.jsx`: new `.pc-ask` dialog during the `predict` phase; button label "Let's see it happen" → "Let's see what happens".
  - `src/games/plant-cell/styles.css`: new `.pc-ask*` styles (fixed backdrop, `blur(14px)`, dark-mode tint, reduced-motion off-switch).
- Commit: Plant cell L2: full-screen blurred prediction overlay

## VERSION_96
- Plant Cell Level 2: removed the bottom control bar; the round now plays out visually on the plant.
  - `ui/LabFrame.jsx`: `controls` is optional (no empty bar), new `overlay` prop drawn above the shell.
  - `levels/PredictThenTest.jsx`: question overlay moved to `overlay`; after watching, an unblurred verdict card (right/wrong, the real answer, the note, Try again / Watch it again) sits low over the stage. Watch countdown moved to the stage readout. Equation strikes out an ingredient at 0% and glucose + oxygen when photosynthesis stops.
  - `ui/PlantView.jsx`: optional `rate` prop draws glucose (leaves → roots) and oxygen (leaves → room) particles; they stop when the rate hits 0 and thin out when it drops. Other levels don't pass it, so they're unchanged.
  - `styles.css`: `.pc-verdict*`, `.pc-equation__off`.
- Commit: Plant cell L2: drop bottom bar, show glucose/oxygen output on the plant

## VERSION_97
- Plant Cell Level 2: each round now explains itself on screen. While the change plays out, 3 cause → effect lines fade in one at a time in a panel at the stage's top-right (e.g. "The sun is blocked…" → "No light means the chloroplasts can't do photosynthesis." → "So no glucose or oxygen is made…"). When the round is marked, the verdict (✓/✕, right answer, what you picked) and Try again / Watch it again join the end of the same panel.
  - `data/levels.js`: new `story[]` on each L2 quest; `watchSeconds` 5 → 9 so every line can be read.
  - `levels/PredictThenTest.jsx`: narration panel replaces the bottom verdict card; `STORY_FIRST_AT` / `STORY_STEP` set the line timing.
  - `ui/LabFrame.jsx`: new `stageOverlay` prop drawn inside the stage.
  - `styles.css`: `.pc-story*` + `pc-story-in` fade; `.pc-verdict*` removed.
- Commit: Plant cell L2: fade-in cause-and-effect narration while each change plays

## VERSION_98
- Plant Cell room: fixed the pot, cabinet and workbench floating off the floor line when the stage changes shape (worst on Level 2 since its bottom bar was removed).
  - `ui/PlantView.jsx`: plant SVG `preserveAspectRatio` `xMidYMid` → `xMidYMax`, so it sits on the stage's bottom edge.
  - `styles.css` (`.pc-lab-viewport--plant`): wall art anchored `center bottom` instead of `center`; furniture lifted to `bottom 5%` so the feet stand inside the floor band.
- Commit: Plant cell: pin room art and plant to the floor so nothing floats

## VERSION_99
- Plant Cell Level 2: the story panel is now subtitles. Each line rises out of the floor at the bottom of the stage; when the next one arrives, the older lines glide up, tilt back, shrink and fade, like text receding into the distance. The verdict (✓/✕ + right answer) arrives as the last line, with Watch it again / Try again under it.
  - `levels/PredictThenTest.jsx`: `.pc-subs` replaces `.pc-story`; each line gets a `data-age` (0 newest … `MAX_SUB_AGE` 3).
  - `styles.css`: `.pc-subs*` + `pc-sub-rise`; `.pc-story*` removed.
- Plant Cell room: cabinet (with its corkboard) moved left `14%` → `6%` so the corkboard no longer touches the window.
- Commit: Plant cell L2: receding subtitle narration, move cabinet off the window

## VERSION_100
- Plant Cell Level 2 subtitles: only 2 visible at once (the newest + one receding); the oldest fades out instead of stacking up. Slower pacing: lines rise over 2.2s (was 1.2s), recede over 1.6s (was 0.9s), arrive 3.6s apart (was 2.6s); `watchSeconds` 9 → 12 to fit.
  - `levels/PredictThenTest.jsx`: `MAX_SUB_AGE` 3 → 2, renders only the last 3 lines; `STORY_STEP` 2.6 → 3.6.
  - `styles.css`: age 2 now `opacity: 0`, age 3 rule removed, `.pc-subs__lines` height 150 → 110px.
- Commit: Plant cell L2: cap subtitles at two, slow them down

## VERSION_101
- Plant Cell: replaced Level 3 "Cell Emergency" (organelle diagnosis with lab tests) with **"Plant Doctor"** — five sick plants, each with a clue drawn in the room. The player picks what the plant is missing (sunlight / water / carbon dioxide), and a right answer fixes the room while the plant recovers and the story rises in as subtitles. A wrong guess costs a star and shows a hint. Rounds: closed curtains (light), dry cracked soil (water), plastic bag over the plant (CO₂), curtains + dry soil (two at once), night outside (light).
  - New `levels/PlantDoctor.jsx`; `index.jsx` routes `l3` to it. Level id stays `l3`, so unlocks, saved stars and the "Cell Medic" achievement still line up.
  - `data/levels.js`: new `l3` config (`missing`, `scene`, `hint`, `story` per quest; `sickHealth`, `recoverPerSec`, `fixSeconds`, `starsByMisses`).
  - `ui/PlantView.jsx`: new `curtain`, `night`, `bag` clue props drawn as plain shapes, and named in the plant's aria-label.
  - Shared with Level 2 now: `ui/Subtitles.jsx` (receding subtitles), `ui/story.js` (line timing), `ui/PhotosynthesisEquation.jsx` (struck-out equation). `PredictThenTest.jsx` uses them; no behaviour change.
  - Removed `levels/CellEmergency.jsx`, `data/faults.js`, and their dead CSS (`.pc-test*`, `.pc-evidence*`, `.pc-note`, `.pc-chips`, `.pc-suspect__x`, `.is-ruled-out`).
  - `docs/asset-prompts/plant-cell.md`: art brief for the three new clue images.
- Commit: Plant cell: replace Level 3 with Plant Doctor (spot what the plant is missing)

## VERSION_102
- Plant Cell Level 3: removed the bottom control bar. The answer pills (☀️ Sunlight / 💧 Water / 🌬️ Carbon dioxide) and Fix it now rise in as one row under the subtitles on the stage, unblurred, so the clue in the room stays visible. "See this plant again" appears there after a round; the recovery countdown moved to the stage readout.
  - `levels/PlantDoctor.jsx`: `controlBar` → `actions`, passed as `Subtitles` children.
  - `styles.css`: `.pc-subs__choices`, `.pc-subs__choice`, `.pc-subs__fix`.
- Commit: Plant cell L3: move answer pills onto the stage, drop bottom bar

## VERSION_103
- Plant Cell thumbnail: replaced `src/assets/plantcell.png` with the plant-by-the-window room scene, cropped to 16:9 (612 × 344) around the window and plant so the game card's `object-cover` doesn't cut it unpredictably.
- Commit: Plant cell: new room-scene thumbnail

## VERSION_104
- Food Chain Survival performance: fixed low FPS / lag.
  - `js/levels.js` `renderScene`: props wholly off screen are no longer drawn (margins `CULL_X` / `CULL_BELOW` / `CULL_ABOVE`; the world tree always draws). Before, every bush, grass clump, flower and pond on the whole map was redrawn every frame.
  - `js/grass.js`: blade colours (base, tip, vein) are worked out once per blade when a clump is generated instead of re-mixing arrays and building colour strings for every blade every frame. Looks identical.
- Commit: Food chain survival: cull off-screen props, cache grass colours

## VERSION_105
- Food Chain Survival: smarter animal movement — foxes and rabbits now steer around bushes, ponds, rocks and other blockers instead of walking straight into them and sliding along the edge.
  - `js/levels.js`: new shared `avoidHeading(agent, x, y, tx, ty, r)` — looks `AVOID_LOOK` (130px) ahead; if the straight path crosses a blocker (grown by the animal's radius + `AVOID_PAD` 16px so they clear the drawn edge), it aims at the tangent past it, remembering which side until the path is clear. Never avoids a blocker the target is inside (burrows).
  - `js/level1.js` (hunting foxes), `js/level2.js` (rival foxes, fleeing + wandering rabbits), `js/level3.js` (fox, fleeing + wandering bunnies) use it. The old push-out collision and stuck fallback stay as a safety net.
- Commit: Food chain survival: foxes and rabbits steer around obstacles
