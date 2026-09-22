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
- Teachers can now schedule when each quiz is available: a dated window with an "Opens" and a "Closes" time (e.g. 4:00–5:00 PM). Outside it the quiz is locked for the class; inside it students get all of their attempts.
- New migration `supabase/migrations/20260921000000_quiz_schedule_window.sql`:
  - Adds `quiz_settings.available_from` / `available_until` (timestamptz, both nullable) plus a check that the close time is after the open time.
  - New `is_quiz_scheduled_open(lesson_id)` and a rewritten `is_quiz_open_for()` that ANDs the window into the existing publish gates, so the `quiz_attempts` insert policy rejects an attempt sent outside the window. A `quiz_student_access` grant still overrides it — that is the make-up path for a student who missed the window.
  - The closing edge gets the same 2-minute server grace as grants so an auto-submit fired at the bell still saves.
- `supabase/schema.sql`: added the `quiz_settings` table (it was missing from the snapshot), its RLS policies, `is_quiz_scheduled_open`, and the window term in `is_quiz_open_for`.
- `src/lib/quizSettings.js`: `getQuizWindow`, `getQuizWindowState` ("none" | "before" | "open" | "after") and `saveQuizWindow`; fetch/realtime now carry the two new columns through a shared `toEntry`.
- `src/App.jsx`: `isQuizClosedForClass` now also fails outside the window; `getQuizClosesAt` became `getQuizClose`, returning the close instant plus which rule set it, and taking whichever of the grant / window runs longest. An extra clock tick is scheduled exactly on the next window edge so a quiz unlocks at its opening minute rather than up to 60s late.
- Teacher portal (`src/pages/TeacherPortalPage.jsx`): new `QuizScheduleControl` in each quiz card's Settings panel — an on/off switch, two `datetime-local` fields, a Save button, a live status line, and an amber warning when the window is shorter than `time limit × attempts`. Quiz cards show a schedule chip, and "Open for a student" now treats a closed window as closed for the class.
- Students: the lesson CTA says "Quiz Opens <time>" / "Quiz Window Has Closed" instead of a bare lock, and shows the closing time while the quiz is open; the quiz's countdown, auto-submit and "closed" screen now cover schedule windows as well as personal grants.
- Commit: Let teachers schedule a per-quiz availability window

## VERSION_46
- New skill `.claude/skills/refine-interactive/SKILL.md`, invoked as `/refine-interactive [lesson id | widget id | slot type]`. It drives a one-section-at-a-time refinement pass over lesson interactives.
- Encodes the three goals: more detailed illustration, front-of-card text cut to instructions only, and a whole-section card flip that reveals the explanation once the block reports complete.
- Specifies a single shared `ExplainerFlip` shell (to be built on first run) wired only into `InteractiveFrame.jsx` and `SignatureWidgetSection.jsx`: front never unmounts, locked until complete, click guard so Reset and controls still work, grid-stacked faces instead of a hardcoded height, `inert` + `aria-hidden` on the turned-away face, cross-fade under `prefers-reduced-motion`.
- Sets per-slot word budgets for front copy and the `explainer: { title, points[] }` shape for back copy, including where it lives in `src/data/lessonsweek-*.js` and `DEFAULT_SLOT_DATA`.
- Commit: Add /refine-interactive skill for lesson interactive refinement passes

## VERSION_47
- New shared `src/components/lesson-slots/interactive/ExplainerFlip.jsx`: once an interactive block reports complete, the whole card can be clicked (or the "What just happened?" strip pressed) to turn over and show a short explanation of what the student just did. The front is rotated away, never unmounted, so a running simulation keeps its state; clicks that start on a control (Reset, slider, canvas, button) don't trigger the flip; focus follows the flip because the turned-away face is `inert`; a block with no `explainer` renders exactly as before.
- `src/index.css`: new `.sq-explain-flip*` block — both faces share one grid cell so the card sizes itself, and `prefers-reduced-motion` cross-fades instead of rotating. The existing `.sq-flip` rules are untouched.
- Wired into `InteractiveFrame.jsx` (new `explainer` prop) and `SignatureWidgetSection.jsx` (`signature.explainer`); the six interactive slots pass `data.explainer` through.
- `DragLabelSection.jsx`: the drag ghost now renders through a portal to `document.body`. It is positioned in viewport coordinates, and the flip's `perspective` ancestor would otherwise become its containing block and offset it mid-drag.
- Week 1 interactives refined — more detailed illustrations, front text cut to instructions:
  - `ModelGalleryWidget`: each scene now paints its own ground so it holds contrast in both themes; the bridge gained a river, banks, braced towers, road markings, a dashed no-load line and a detailed truck; the atom gained countable protons/neutrons, shell labels, electron trails and a legend; the fish graph gained the lake, a "lake is full" ceiling, axis labels and a filled area; the storm gained coastal towns, day markers, rain bands and an eye. The four per-model explanation paragraphs were removed from the panel.
  - `InvestigationRunWidget`: each pot now has a light beam whose strength is that pot's hours, so the variable being changed is visible in the picture; tapered pots, trays, soil, veined leaves and a day counter. The five "Step N" prose blocks became four short labels plus the result line.
  - `GlobeUnrollWidget`: added South America and Australia in muted grey, globe shading and rim that fade as it flattens, and latitude labels; the two paragraph "costs you" panels became a Globe / Flat map seen-or-not pair.
- `src/data/lessonsweek-01.js`: all three signature blocks got shorter headings, no `intro`, and a new `explainer` with the removed prose compressed into 4 short points.
- Commit: Add explainer card flip and refine week 1 interactives

## VERSION_48
- Fixed the dead space above and below every simulation. The stage column is about 16:10 but the scenes were authored at other ratios, so `preserveAspectRatio` letterboxed the difference.
  - New `stageFill(w, h)` in `stageMedia.js` plus a `bleed` prop on `Stage`: the scene covers the frame the way `background-size: cover` does, using `preserveAspectRatio="xMidYMid slice"` for SVG and `object-fit: cover` for canvas, with an `aspect-ratio` that stops the picture collapsing on a phone.
  - Scenes re-authored near 16:10 with their ground bleeding past the viewBox: model gallery 620x390, investigation bench 620x400 (pots now sit side by side on a wide bench instead of a tall narrow strip), globe 620x390, particle box 640x400, phase bench 640x400, burner scene 620x400 (the burner's foot was previously cut off at 360), pour test 680x425, container test 608x380.
  - The lab scenes now paint their own wall and bench, which also fixes their contrast in dark mode.
- Weeks 2 and 3 interactives refined the same way as week 1: `particle-lab`, `pour-test`, `state-change-lab`, `container-test` and `phase-bench` each got an `explainer` back card, lost their `intro`, and had the per-state explanation paragraph cut from the panel. The state label and the readouts stay on the front.
- No em dashes anywhere in weeks 1 to 3: lesson data, interactive widgets, the shared interactive components, and the skill itself. Rewritten as colons, commas or full stops.
- `.claude/skills/refine-interactive/SKILL.md`: added the fill-the-stage rule (author at 16:10, bleed the ground, render with slice or cover, never distort or hardcode a height) and the no-em-dash rule.
- Commit: Fill the stage on every interactive and refine weeks 2 and 3

## VERSION_49
- Week 2 illustration detail pass, the part weeks 2 and 3 were missing after VERSION_48.
- `ParticleLabWidget`: the flat tinted rectangle is now a sealed glass jar. The simulation bounces off the jar's inner walls (new `IN_L/IN_R/IN_T/IN_B` constants shared by the physics and the drawing) instead of the canvas edge, so "it fills the whole container" is one fact rather than two kept in step by hand. Added lattice bonds drawn only in the solid state, a curved surface on the liquid, a working thermometer whose mercury tracks the slider, a sealed lid, a bench with the jar's shadow, and a state tag so colour is never the only signal.
- `PourTestWidget`: the flask now has the neck scale and the single etched 100 mL calibration ring its whole premise rests on, so a 4 mL shortfall is visibly a drop in the neck. Source cylinders became graduated measuring cylinders with a pouring lip, a foot and 10 mL marks. The measured surface curves into a meniscus, and the flask has a shadow on the bench.
- `StateChangeLabWidget`: the beaker rested on nothing above the burner, so it now sits on wire gauze over a tripod, which is also why the heat arrives spread out. The thermometer hangs from a retort stand instead of floating. Added a meniscus on the water surface and vapour wisps that only appear once there is vapour to leave.
- `ContainerTestWidget`: vessels gained a foot, a pouring lip, graduations up the left wall and a shadow on the bench; the liquid surface curves; the syringe gained finger flanges and a nozzle, and is excluded from the lip and foot it would never have.
- Commit: Detail pass on the week 2 interactive illustrations

## VERSION_50
- `container-test` refinement pass.
- Removed 6 dead `note` strings from `SAMPLES` and `CONTAINERS`. Nothing had read them since the explanation moved to the back of the card in VERSION_48.
- The checklist stated each conclusion on the front ("A solid keeps its shape and volume in every container") while the back card stated the same four again. The front now lists only the job to do ("Put the ice in all three containers"), and the separate hint line is gone because the task was the hint. Four fewer sentences on screen and no duplication.
- The reading was one long sentence. It is now two readouts, `40.0 mL` under "Volume" and a height under "Height", with the full sentence kept for the screen reader where a whole sentence is what you want.
- New height ruler down the left of the bench, in centimetres, with a bar showing what the sample is standing at right now. This is the block's stated pay-off: the same 40 mL stands twice as tall in the syringe as in the beaker, which was a number in the panel with nothing to read it against. `PX_PER_CM` is shared by the ruler and the readout so the two cannot disagree.
- The ice block now draws its own outline, so its silhouette is visibly identical in all three containers, which is what "a solid keeps its shape" means.
- Back card point 2 now names the height the ruler shows.
- Commit: Refine the container test with a height ruler and a shorter front

## VERSION_51
- `phase-bench` (week 3 lesson 1) refinement pass. Week 3 lesson 2 is the comic strip Performance Task: it has no signature widget and only presentational slots, so it has nothing this skill applies to and was left alone.
- The widget's own `aria-label` said "sealed chamber" but no chamber was ever drawn, just particles on a flat tinted rectangle. There is now a steel vacuum chamber with a bolted flange, feet and a viewport, and the simulation bounces off the chamber's inner walls (new `IN_L/IN_R/IN_T/IN_B`) instead of the canvas edge, so "it fills the chamber" is one fact rather than two kept in step by hand.
- Added lattice bonds drawn only in the solid phase, so watching them vanish is the lattice breaking; a curved surface on the liquid; a bench with the chamber's shadow; and a phase tag in the picture so colour is never the only signal.
- New energy gauge down the right, banded in each phase's own colour with a marker at the current setting. It shows that one slider covers all five phases and where in the range the student is standing.
- Plasma: the code comment claimed the "+ and −" marks carried the charge, but only the + was ever drawn on the ions. The free electrons now carry their −.
- Removed 5 dead `note` strings, unread since VERSION_48 moved the explanation to the back of the card.
- Front text: "Energy in the chamber" became "Energy", and "Same substance the whole way. Only the energy changes." is gone, since the heading and the back card both already say it.
- Back card: the title restated the lesson heading, so it is now "Energy alone changed the phase", and the plasma point is in past tense like the rest.
- Commit: Refine the phase bench with a real chamber and an energy gauge

## VERSION_52
- Renumbered the two Week 2 lessons: they now read "Lesson 1" and "Lesson 2" instead of "Lesson 4" and "Lesson 5" (`badge` + `lessonNumber` in `src/data/lessonsweek-02.js`).
- Moved their ids onto the per-week `wNN-lN` scheme used by weeks 3+: `lesson-4` -> `w02-l1`, `lesson-5` -> `w02-l2` (plain `lesson-1`/`lesson-2` would collide with Week 1). Updated `src/data/quizzesweek-02.js` keys and `lessonId`s to match.
- New migration `supabase/migrations/20260921010000_week2_lesson_ids.sql` renames the ids in place across `curriculum_lessons`, `lessons`, `quizzes`, `quiz_settings`, `quiz_student_access`, `quiz_attempts`, `student_progress`, `lesson_interactions`, `lesson_materials` and both publish-state id arrays, so teacher overrides, student progress and XP follow the lesson instead of being orphaned.
- Refreshed the `curriculum_lessons` note in `supabase/schema.sql` and the Week 2 rows/id-scheme note in `INTERACTIVE_SECTIONS.md`.
- Commit: renumber Week 2 lessons to 1-2 and move their ids to the w02-lN scheme

## VERSION_53
- Refined the Week 4 Lesson 1 signature interactive (`heating-curve`) so the picture carries the lesson and the explanation moved to the back of the card.
- Redrew the scene at 640x400 (the stage's own 16:10 shape) with a bleeding wall and bench, `stageFill` + `<Stage bleed>`, so it fills the frame instead of letterboxing inside it.
- Real apparatus instead of boxes: a beaker with a rim, pour lip, graduation marks and a meniscus, lattice bonds that stretch and snap, rising bubbles while boiling, a hotplate with an indicator LED, a digital readout and a glow band under the beaker base, and a bell jar for the vacuum route.
- Added a thermometer whose red column tracks the temperature, so a plateau is now visible as the column sitting still while the hotplate keeps glowing.
- The graph moved onto chart paper pinned to the wall, with a grid, dashed guides at 0 and 100 °C, a dashed ghost of the furthest run, and plateau bands that only get named once the student has drawn them.
- Front copy on a diet: the intro is one sentence, the instruction is one imperative, the five paragraph-length state `note` strings are gone, and the vacuum explainer paragraph moved to the back. Removed every em dash from student-facing text.
- New `signature.explainer` on the lesson, so finishing all four goals now unlocks the flip.
- Commit: Refine the heating curve with real apparatus and a thermometer

## VERSION_54
- Refined both Week 5 signature interactives: `investigation-rig` (Lesson 1) and `meniscus-bench` (Lesson 2). Neither lesson has any interactive slots in its `layout[]`, so the signature widget is the whole scope in each.
- Both scenes were redrawn at 620x390 (the stage's own 16:10 shape) with a bleeding wall and floor, `preserveAspectRatio="xMidYMid slice"`, `stageFill` and `<Stage bleed>`, so they cover the frame instead of letterboxing inside it. `investigation-rig` was 600x330 and `meniscus-bench` was 620x360, both on `STAGE_MEDIA`.
- `InvestigationRigWidget`: the belt now runs on two rollers with spokes that turn, stands on legs down to a workshop floor, and the modules bolt into a top and bottom mounting rail. A fitted module has bolt heads, a viewport onto its gears and a `FITTED` name plate; a pulled one shows the empty socket and its two bare rails. The sample is a potted seedling on a carrier plate instead of a rounded rectangle, and `JAMMED` moved below the belt where it no longer collides with the modules.
- `InvestigationRigWidget` honours `prefers-reduced-motion`: the belt dashes and gear spokes hold still, and only the sample moves.
- `MeniscusBenchWidget`: the cylinder gained a pour lip, a rim ellipse, a weighted foot, a glass highlight, a `50 mL` capacity band and ticks every 2 mL on both walls instead of every 5 on one. The balance gained feet, a pan column, a sample beaker on the pan, and a `TARE` button on its body that turns teal once zeroed. Both sit on a bench with their own shadow, and the eye now slides along a visible dashed track.
- Front copy on a diet in both. L1 intro is one sentence and the instruction drops the word "confound"; the five `jam` strings, the caption and the three goal hints are all inside budget. L2 heading went from 7 words to 5, the intro from a 40-word paragraph to one sentence, the slider label to "Eye height", and the panel reading is now two readouts rather than one long sentence. Every em dash in student-facing text is gone.
- Fixed L2's record message: a rejected reading said "Recorded ..." while recording nothing. It now says "Not recorded" and names how far off the eye is.
- New `signature.explainer` on both lessons, so finishing the goals unlocks the flip.
- Commit: Refine the Week 5 investigation rig and meniscus bench

## VERSION_55
- Re-centred the Week 5 Lesson 1 machine (`investigation-rig`). Its content sat from x=14 to x=574 in a 620-wide viewBox, so `slice` cropping (about 40 units a side at the shapes the stage actually takes) ate the left edge of module 1 while leaving bare wall on the right.
- Added `SAFE_L`/`SAFE_R` (40 units in from each edge) and laid the machine out between them: `X0` 14 -> 49, `PITCH` 100 -> 92, `HOUSE_W` 92 -> 84, tray 493-569. The whole composition is now centred on 309 with nothing but wall and floor outside the safe inset.
- Filled the vertical dead space at the bottom: modules moved down (`HOUSE_Y` 100 -> 110) and the belt with them (`BELT_Y` 282 -> 306, `FLOOR_Y` 348 -> 362), so the floor is a strip rather than a third of the picture.
- Added a drive motor under the left roller with a belt line to it, which gives the lower-left something structural instead of empty floor.
- `sampleX` is now derived from `X0`, `HOUSE_W` and `PITCH` instead of the three magic numbers it used, so the sample cannot drift off the module centres when the spacing is retuned.
- Week 5 Lesson 2 (`meniscus-bench`): the balance ran to x=580, right where a side crop lands. Its parts are now offset from one `BAL_X = 388` constant, moving it 16 units inboard.
- Commit: Re-centre the Week 5 machine inside the stage crop

## VERSION_56
- Week 6 Lesson 1 (`solubility-beaker`): re-authored the scene at the stage's own shape. It was 660x330 (a 2:1 strip) drawn with `STAGE_MEDIA`/`contain`, so it letterboxed with bars of gradient above and below. Now 620x390 with a 60-unit `BLEED`, `stageFill(W, H)` and `<Stage bleed>`, so it fills the frame.
- Gave the scene a room: a lab wall and a bench that both run past the viewBox, so the widget reads the same on cream and on stone-900 and a cropped edge never shows a seam.
- The beaker gained a rim ellipse, a pour lip, graduation ticks, a `100 mL` printed band, a curved meniscus, a highlight stripe and a shadow on the bench. It was three straight lines and a flat rectangle before.
- Every control now changes the picture, not just a readout: the hotplate's element band brightens with the temperature slider and sheds heat wisps above 42 °C, the stirring rod sweeps across the beaker with a swirl in the water while the stirrer is on, and `Crushed: YES` swaps the heap of 12 big cubes for a bed of 26-wide fine grains carrying the same mass.
- Moved the solubility curve onto a sheet of chart paper pinned to the wall, and added leader-line labels inside the picture (`dissolved N g`, `on the bottom N g`, `sugar cubes` / `crushed sugar`).
- Front copy on a diet: `intro` cut from 36 words to 9, `instruction` to 8, the four `STATUS` notes from paragraphs to one line each, and the two panel helper lines to six words each. Removed every em dash from the widget and its lesson data.
- Added `signature.explainer` to `w06-l1`, so the section now flips to a "Why the beaker stopped taking sugar" back once all four solutions have been made.
- Commit: Refine the Week 6 solubility beaker illustration and copy, add its explainer flip

## VERSION_57
- Week 7 Lesson 1 (`dilution-jar`): re-authored the scene at the stage's own shape. It was 620x330 drawn with `STAGE_MEDIA`/`contain`, so it letterboxed with bars of gradient above and below. Now 620x390 with a 60-unit `BLEED`, `stageFill(W, H)` and `<Stage bleed>`, so it fills the frame.
- Gave the scene a room: a lab wall and a bench that both run past the viewBox, so the widget reads the same on cream and on stone-900 and a cropped edge never shows a seam.
- The jar gained a rim ellipse, a pour lip, a curved meniscus, a highlight stripe, graduation ticks with mL numbers, a surface reading on a leader line and a shadow on the bench. It was four straight lines and a flat rectangle before.
- Both controls now change the picture: `Add 10 mL` opens a wall tap whose orange handle turns while a stream falls into the jar, and `Pour half away` sends a stream over the lip into a waste beaker on the bench whose level stays up afterwards.
- Moved the `% m/m` column onto a sheet pinned to the wall with the formula printed on it, and added in-picture labels (`N solute particles`, `only pouring removes them`, `N g solute`) so the point of the activity is readable without the panel.
- Week 7 Lesson 2 (`titration-drip`): same re-author, 620x340 to 620x390 with bleed and `stageFill`. The burette now hangs from a retort stand with a base, rod and clamp instead of floating, has graduation ticks and a stopcock whose orange handle turns a quarter while `Hold to drip` is pressed.
- The flask gained a rim, a neck, a curved indicator surface and a bench shadow; the salt stacks in offset rows with a `salt crystals` leader label; the pH scale moved onto a wall chart with `acid` / `neutral` / `base` band names so the scale never relies on colour alone, and the ion tally moved onto that chart.
- Front copy on a diet across both: `intro` cut from 33 to 9 words and 38 to 11 words, control labels down to three words or fewer (`Add 5 g`, `Pour half away`, `One drop`, `Hold to drip`, `Fresh flask`), status notes from paragraphs to one line, and every goal hint under 14 words. Removed every em dash from both widgets and their lesson data.
- Added `signature.explainer` to `w07-l1` and `w07-l2`, so each section flips to a "Why the colour faded" / "Why the pH jumped at the end" back once every goal is met.
- Commit: Refine the Week 7 dilution jar and titration drip illustrations and copy, add their explainer flips

## VERSION_58
- Week 8 Lesson 1 (`equipment-bench`): re-authored the scene at the stage's own shape. It was 620x340 drawn with `STAGE_MEDIA`/`contain`, so it letterboxed with bars of gradient above and below. Now 620x390 with a 60-unit `BLEED`, `preserveAspectRatio="xMidYMid slice"`, `stageFill(W, H)` and `<Stage bleed>`, so it fills the frame.
- Gave all four instruments a room: a tiled lab wall and a bench that both run past the viewBox, so the widget reads the same on cream and on stone-900 and a cropped edge never shows a seam. Every instrument now casts a shadow on the bench.
- Bunsen burner: added a wall gas tap with an orange handle and a rubber hose running to the burner inlet, a knurled collar whose air hole widens as the slider opens, a barrel highlight and a chimney base. The flame keeps its outer cone and gains an inner cone that only appears once air is getting in.
- Balance: the pan now carries a real sample beaker whose contents rise with the mass, and the body gained a spirit level whose bubble slides while the pan swings, a `TARE` button, a monospace display and feet.
- Filter funnel: the funnel hangs from a retort stand (base, rod, boss head, ring clamp) instead of a bare bracket. The paper cone is fluted, the receiving beaker gained a rim, a pour lip, a meniscus, a highlight and mL graduations, and the mud wedge builds at the apex while the filtrate climbs the ticks.
- Microscope: replaced the stick figure with a full compound scope. Foot, C arm, body tube, eyepiece, a three-objective nosepiece, stage with clips and slide, a lamp throwing light up through the specimen, and coarse and fine focus knobs that turn with the slider. The focus knob now raises and lowers the stage, so the gap under the objective is visible rather than only stated.
- Added one pinned wall card that carries the live number for whichever instrument is out (flame tip °C, balance reading, filtrate mL, focus error), in the same corner in all four views.
- Week 8 Lesson 2 (`hazard-cabinet`): same re-author, 620x340 to 620x390 with bleed, slice and `stageFill`, and the same wall/bench room.
- The cabinet is now a real wall cabinet: frame, `HAZARD STORE` plate, mounting brackets, two shelves and four labelled bottles with necks and caps. The four GHS pictograms are drawn as SVG paths (flame, skull and crossbones, corroding hand and plate, flame over circle) instead of emoji glyphs, so they look the same on every device.
- Every demonstration gained structure: the corrosive drips from a dropper bottle onto a steel plate raised on two blocks, the flammable beaker stands on the bench with its vapour drifting to a wall socket that sparks, the toxic drop goes into a tank with gravel and a plant, and the oxidiser's ember sits on a heatproof mat beside an oxygen cylinder.
- Lab floor: both students are now drawn with heads, faces, hair and lab gowns, the burner sits on a proper base, the boiling tube hangs in a clamp on a stand, and the spill and cordon cone sit on the floor with leader-line labels.
- Front copy on a diet across both lessons: L1 heading 7 words to 5 and its intro from a 47-word paragraph to one sentence; L2 heading 7 words to 6 and its intro from 53 words to one sentence. Control labels are three words or fewer (`Air collar`, `Mass on pan`, `Pour mixture`, `Focus knob`), helper lines are one short sentence each, and every goal hint is under 14 words. Removed every em dash from both widgets and their lesson data.
- Added `signature.explainer` to `w08-l1` and `w08-l2`, so each section flips to a "Why each tool has one job" / "Why the symbols are worth reading" back once every goal is met.
- Commit: Refine the Week 8 equipment bench and hazard cabinet illustrations and copy, add their explainer flips

## VERSION_59
- Week 11 Lesson 1 (`focus-scope`): re-authored the scene at the stage's own shape. It was 620x340 drawn with `STAGE_MEDIA`/`contain`, so it letterboxed with bars of gradient above and below. Now 620x390 with a 60-unit `BLEED`, `preserveAspectRatio="xMidYMid slice"`, `stageFill(W, H)` and `<Stage bleed>`, so it fills the frame.
- Gave the instrument a room: a lab wall and a bench that both run past the viewBox, so the widget reads the same on cream and on stone-900 and a cropped edge never shows a seam. The scope and the wet mount both cast shadows on the bench.
- Replaced the stick-figure scope with a full compound microscope: horseshoe foot, lamp with a visible light cone, condenser and iris diaphragm riding under the stage, stage with clips and slide, a three-objective turret whose two spare lenses swing out of the light path, arm, body tube and eyepiece.
- The objective barrels are now measured, not decorative: each one is drawn exactly long enough that its tip meets the slide at the coarse setting that cracks it, so the crash is something a student can watch closing instead of a message that appears.
- Both focus knobs turn with the slider that drives them (coarse outside, fine on the same shaft), so the control and the part it moves are visibly the same thing.
- Moved the wet mount out of the instrument and onto the bench: a glass slide with a water drop, the specimen in it, a mounted needle holding the coverslip at the chosen angle, and the trapped bubbles drawn on the slide as well as in the field of view.
- Added a pinned wall card carrying the live numbers (total magnification, sharp/blurred/cracked, the sharp band in µm), and gave the field of view a real eyepiece barrel, a `field of view` plate and cells with a proper wall, cytoplasm and nucleolus.
- Week 11 Lesson 2 (`scope-through-time`): same re-author, 620x340 to 620x390 with bleed, slice and `stageFill`, and the same wall and bench room.
- All three instruments are now the real objects. 1665: a leather barrel with gold tooling on a turned pillar, cork on a pin, and the oil lamp and water globe that made it usable. 1830: a brass compound scope with a horseshoe foot, curved arm, swivel mirror and an objective drawn as two stacked glasses. 1933: a vacuum column with an electron gun, three magnetic lens coils, a specimen airlock, a fluorescent viewing screen and a hosed vacuum pump.
- Added a year rail across the wall with the three anchor years notched on it and a marker that travels as the slider moves, so the slider's value lives in the picture. Cork cells are now irregular boxes rather than one repeated rectangle.
- Front copy on a diet across both lessons: L1 heading 7 words to 5 and its intro from a 60-word paragraph to one sentence of 7; L2 heading 8 words to 6 and its intro from 44 words to one sentence of 10. Control labels are three words or fewer (`Objective lens`, `Coarse focus`, `Fine focus`, `Coverslip angle`, `Fresh slide`), status notes are one line each, and every goal hint is under 14 words. Removed every em dash from both widgets and their signature data.
- Added `signature.explainer` to `w11-l1` and `w11-l2`, so each section flips to a "Why fine focus exists" / "Why better lenses found more" back once every goal is met.
- Commit: Refine the Week 11 microscope and scope-through-time illustrations and copy, add their explainer flips

## VERSION_59
- Week 8 Lesson 2 (`hazard-cabinet`): padded the left side of the wall cabinet. It started at x=24 in a 620-wide viewBox with its mounting brackets at x=16, so `slice` cropping (roughly 40 units a side at the shapes the stage takes) ate the bracket and the cabinet's left frame.
- Added a `CAB_X = 56` constant and laid the cabinet out from it: frame 56-220 (was 24-200), width 176 -> 164, back panel and warning plate inset to match, brackets now at x=48. The four bottles are positioned off `CAB_X` too, so the shelves stay centred if the cabinet moves again.
- Moved the blown-up diamond and its name from x=262 to x=272 to keep the gap between the cabinet and the demonstration area even.
- Lab floor: both people are now actual figures. Added a shared `Student` component drawing sloped shoulders, a lab gown with a collar V, a centre seam and buttons, a neck, ears, eyebrows, eyes, a nose and a mouth, one arm hanging with a visible hand and one arm reaching for the equipment their hazard belongs to. They were a rounded rectangle with a circle and two dots on top.
- Student at the burner: the hair is now a fringe plus a separate loose length that drapes toward the flame as the hazard grows, and tying it back turns that length into a bun with an orange tie. The burner gained a collar so it reads as a burner rather than a post.
- Student at the boiling tube: the goggles are a real strap plus two tinted lenses over the eyes instead of a flat bar, and the tube now hangs in a clamp on a stand with a base rather than floating beside a rod.
- Both status labels moved from y=140 to y=132 so the new hair and goggles do not run into them.
- Commit: Pad the Week 8 hazard cabinet and redraw the lab floor students as figures

## VERSION_60
- Week 8 Lesson 2 (`hazard-cabinet`), lab floor: the loose hair on the left student was a triangle that grew sideways out of the head, so it read as a spike pointing at the burner rather than as hair.
- Replaced it with a lock that hangs. Two `sway`/`drop` values in `LabFloor` swing the lock further out and further down as the hazard grows, and the path curves down over the shoulder and chest so the tip ends up beside the flame while the whole length still drapes under its own weight.
- Added a lighter strand line along the lock so it reads as hair rather than a flat blob.
- The tied-back state gained a short sweep from the fringe up to the bun, and the bun and its tie moved 2 units right so they sit behind the head instead of on top of the fringe.
- Commit: Redraw the loose hair on the Week 8 lab floor so it hangs instead of pointing

## VERSION_61
- Week 12 Lesson 1 (`scope-field`): the scene is now the eyepiece view itself. Redrawn at 620x390 with a 60-unit bleed, `preserveAspectRatio="xMidYMid slice"`, `stageFill` and `<Stage bleed>`, so the microscope barrel fills the stage corner to corner instead of a 620x340 disc floating in gradient.
- Added a `Barrel` component (ribbed body, lit top edge, engraved graduations around the rim) and an engraved readout plate on the right carrying objective zoom, the cell in view, its type badge, where the DNA is, and six inspection pips.
- More structure in the cells: nuclear envelope with pores plus a nucleolus, mitochondria with cristae, scattered ribosomes, a double cell wall and veined chloroplasts on the palisade cell, myelin blocks and branched dendrites on the neuron, a midpiece on the sperm cell, pili on E. coli, and stacked thylakoid rings in the cyanobacterium. The prokaryote interior is now a real closed DNA loop labelled `loose DNA loop`, not a squiggle.
- Added drifting grit inside the field so it reads as a wet mount.
- Week 12 Lesson 2 (`cell-cutaway`): redrawn at 620x390 with the same bleed/slice/stageFill treatment. The cell now fills the frame and the extracellular fluid bleeds past the viewBox.
- The membrane is a real phospholipid bilayer: two head rings with channel proteins sunk through them, switching to a red dashed double line when it is off. Nucleus gained an envelope, ten pores and chromatin threads; the rough ER is folded sheets studded with ribosomes; the Golgi is a four-cisterna stack with vesicles budding off the rim; mitochondria have inner membranes and cristae and now emit visible ATP dots toward the centre when powered.
- Replaced the floating sentence at the foot of the cell with a readout plate: `PROTEINS OUT PER MINUTE`, the number, and `stops at the golgi` / `line running`.
- Front copy on a diet across both lessons: L1 intro from a 43-word paragraph to one sentence of 10, L2 intro from 45 words to 9. Instructions are one imperative sentence each, every organelle and cell blurb is one line, and the closing hint on L2 is 8 words. Removed every em dash from both widgets and their signature data.
- Added `signature.explainer` to `w12-l1` and `w12-l2`, so each section flips to a "Why cells come in two kinds" / "Why one failure stops the line" back once every goal is met.
- Commit: Refine the Week 12 cell field and cell cutaway illustrations and copy, add their explainer flips

## VERSION_60
- Week 8 Lesson 2 (`hazard-cabinet`): the student at the burner now has hair on both sides. It was a single lock on her right, hanging off the edge of the shoulder; now a length leaves each temple, clears the jaw, drapes over its own shoulder and comes to rest on her chest.
- Kept the hazard intact: only the right length carries `sway` and `drop`, so it still swings out and down until its tip is beside the flame, which is what the `cm from flame` readout measures. The left length hangs still.
- Both lengths have their own highlight strand, and both inner edges are drawn outside the eyes so no hair crosses her face. The tied-back bun state is unchanged.
- Commit: Drape the hazard-cabinet student's hair over both shoulders onto her chest

## VERSION_62
- Week 12 Lesson 1 (`scope-field`): the in-cell labels were drawn inside the zoom transform, so at 3.2x `no nucleus` and `loose DNA loop` rendered at roughly three times their authored size and ran straight over the drawing.
- Added a `PinLabel` helper that keeps the label pinned to the cell but counter-scales the glyphs by `1 / zoom`, so a label is the same size on screen at 1x and at 6x. Gave it a cream halo (`stroke` plus `paintOrder`) so it stays readable over a tinted cell body.
- Moved the prokaryote labels clear of the body (`-30` and `34` in cell units, was `-22` and `27`) now that they no longer grow with the zoom.
- The orange selection ring and the teal seen rings are now hidden once the view is past 2.5x. At 3.2x a 46-unit ring filled the whole field, and the plate already names the cell in view.
- Week 12 Lesson 2 (`cell-cutaway`): the `mitochondrion` label sat at x=142 y=340 and ran under the readout plate that started at x=176. Renamed it `mitochondria` (two are drawn), moved it above its organelle at x=146 y=264, and nudged the bottom-left mitochondrion to [146, 296].
- Moved the readout plate to x=202 y=310, 196 x 56, so it sits inside the cytoplasm clear of both the mitochondria label and the Golgi label.
- Added a `short` name to each organelle and replaced `firstStop` (a name string that was matched back against the list) with a `stopped` organelle object, so the plate can read `stops at the Golgi` instead of `stops at the golgi apparatus` overrunning the number beside it.
- Commit: Counter-scale the Week 12 cell labels and clear the cutaway readout plate overlap

## VERSION_61
- Week 8 Lesson 2 (`hazard-cabinet`): her hair is no longer a filled silhouette. Both falling lengths are now bundles of 14 separate wavy strands drawn by a new `HairFall` component, each with its own start point, stroke width, shade and wave phase, so the bundle has a broken edge and gaps you can see through.
- Added a three-tone `HAIR_TINTS` palette (`#78350F`, `#92400E`, `#5C2A0B`) mixed strand by strand. One flat brown was most of why it read as a cut-out shape rather than hair.
- `sway` and `drop` now build up down each strand instead of moving the whole shape, because hair pivots at the head: the roots stay put and only the ends travel toward the flame.
- Kept the crown as a filled cap, since scalp does not show through the top of a head, but scalloped its lower edge and ran five strand lines over it. The bun in the tied-back state got the same treatment.
- Commit: Redraw the hazard-cabinet student's hair as wavy per-strand bundles

## VERSION_63
- Week 13 Lesson 1 (`cell-morph`): redrew the scene at the stage's own shape (620 x 390) with a 60-unit bleed, `preserveAspectRatio="xMidYMid slice"`, `stageFill` and `<Stage bleed>`, so the cell fills the frame instead of floating in a band of gradient.
- The organelles are drawn as objects now, not dots: the nucleus has a double envelope, pores, a nucleolus and chromatin; the mitochondria have cristae; there is a rough ER with ribosomes on it, a three-sac Golgi with budding vesicles, lysosomes with enzyme specks, and centrioles as a paired cylinder with triplets. Chloroplasts are ellipses with grana stacks.
- The cell wall is two layers now (a filled cellulose band plus a dashed inner line), and turgor closes the gap between membrane and wall from 16 to 5 units as the water rises, with four outward push marks.
- Water entering is visible: solute dots outside fade as the water gets purer, and blue dots march in from both sides toward the membrane.
- Chloroplasts and the vacuole are positioned off the box edges so they hug the wall as the cell grows; every shared organelle is on a fixed coordinate, so the "these never move" claim is literally true (dropped the old wobble that broke it).
- Front copy on a diet: `intro` is one line, control labels are "Animal to plant" and "Water outside" with the readout split out, the long note under the status went to the back of the card, and a one-line "Next" hint names the next step. No em dashes left in student-facing text.
- Added `signature.explainer` to `w13-l1`, so finishing all four steps unlocks the flip explaining what the student just saw.
- Commit: Refine the Week 13 cell-morph interactive and add its explainer flip

## VERSION_64
- Week 13 Lesson 1 (`cell-morph`): no label is drawn over the artwork any more. A new `Tag` component puts each label in a gutter beside the cell (`LEFT_TEXT`/`RIGHT_TEXT`) and draws a line with an arrowhead from the text to the part it names.
- Labelled parts: nucleus, centrioles and chloroplasts on the left; mitochondria, lysosomes and the central vacuole on the right; cell wall still above the wall, now with its own arrow down onto it.
- Shrank the cell to clear those gutters (`bw` 190 to 280, `bh` 190 to 204, was 212 to 324 / 212 to 228) and moved every organelle to match: nucleus (246, 174) r32, mitochondria (336, 136) and (340, 200), ER at y 236 and 248, Golgi at y 224 to 244, free ribosomes at y 208 to 220, lysosomes (288, 168) and (296, 192), centrioles at (212, 112).
- Vacuole now starts at x 306 and runs y `T+34` to `B-34`, so the mitochondria arrow passes above it; the top turgor marks moved off the chloroplast row to `CX ± 60`.
- Commit: Move the Week 13 cell-morph labels out of the drawing onto arrows

## VERSION_65
- Week 13 Lesson 1 (`cell-morph`): the centriole pair sat at (212, 112), which is outside the round animal cell (the box is 190 wide with a 95 radius, so that corner is off the circle). Moved it right and down to (266, 119) and (280, 123), with the triplet dots at 286 + i * 8, cy 128.5.
- The spot clears the nucleus at (246, 174) r32 and the upper mitochondrion at x 310, and stays inside the circle in animal form.
- Pointed the `centrioles` arrow at the pair's new left edge, (262, 126), was (210, 118).
- Commit: Move the Week 13 centrioles back inside the animal cell

## VERSION_66
- Fixed signup code resending to use Supabase's confirmation resend endpoint instead of repeating registration and its student-number duplicate check.
- Preserve resend error messages so email provider failures and rate limits are visible; normalize email addresses for signup, resend, and verification.
- Commit: Fix signup confirmation resend and expose delivery errors

## VERSION_67
- Week 14 Lesson 1 (`surface-volume`): redrawn at the stage's own shape (620 x 390) with a 60-unit bleed, `preserveAspectRatio="xMidYMid slice"`, `stageFill` and `<Stage bleed>`, so the scene fills the frame instead of letterboxing.
- The cell is an object now, not a circle: cytoplasm, a washed fed shell, a double membrane line, a nucleus with nucleolus and chromatin, mitochondria in the shell and in the core, nutrients drifting in the fluid outside, nutrients crossing the membrane, and a visible pile-up of nutrients at the inner edge of the shell where diffusion stops.
- Core mitochondria grey out when the core starves, so the starvation is shown by the drawing and not only by a number.
- Replaced the five-number readout plate inside the picture with an instrument card: a growth-race graph plotting surface and volume against the same baseline, a "volume fed" bar, and a legend. The raw numbers moved to the control panel.
- Radius range is now 30 to 100 µm at a 1.07 draw scale, chosen so both daughters still fit side by side after Divide.
- Front copy on a diet: `intro` is one line, the slider label is "Cell radius" with the value split out, the button is "Divide the cell", and the long note under the status became a one-line next-step hint. No em dashes left in student-facing text.
- Added `signature.explainer` to `w14-l1`, so finishing both steps unlocks the flip.
- Commit: Refine the Week 14 surface-volume interactive and add its explainer flip

## VERSION_68
- Week 14 Lesson 2 (`cycle-dial`): same stage treatment (620 x 390, 60-unit bleed, slice, `stageFill`, `<Stage bleed>`).
- A live cell now sits inside the dial and is drawn entirely from the dial position: it grows through interphase, its chromatin doubles through S, the nuclear envelope breaks down in early M, the chromosomes condense and line up on the equator, the chromatids are pulled to the poles, a cleavage furrow bites in from both sides, and at position 99 it is two separate cells.
- The furrow is a mask plus a clipped pair of arcs, so the membrane stays one continuous line around the narrowing waist instead of two circles crossing each other.
- Dropped the centre-to-rim handle spoke (it crossed the cell) for a knob riding on the ring, added hour ticks, and made the G₂ marker read as a gate that thickens and turns red when the DNA is damaged.
- Chromosome close-up redrawn with banding and a centromere disc; the DNA graph now has phase tint bands behind it so it ties back to the ring.
- Front copy on a diet: `intro` is one line, phase notes cut to one short sentence each, the slider label is "Dial position" with the value split out, and the standing "Damage it, then try..." line became a hint that only appears once the DNA is damaged. No em dashes left in student-facing text.
- Added `signature.explainer` to `w14-l2`, so finishing both steps unlocks the flip.
- Commit: Refine the Week 14 cycle-dial interactive and add its explainer flip

## VERSION_69
- Week 14 Lessons 1 and 2: the instrument card beside each illustration was being cropped away. The stage column runs at about 1.48 wide to 1 tall, not the 1.59 the scene is drawn at, so `slice` cuts roughly 25 units off each side, and more on a narrower window.
- Both scenes now keep every readable thing between x 60 and x 560, leaving a 60-unit crop margin of pure background on each side. The cards moved from x 372/356 width 232/250 to x 352 width 204, and their contents moved with them.
- Week 14 Lesson 1 (`surface-volume`): cell centre 190 to 200, draw scale 1.07 to 0.83 and `R_MIN` 30 to 34, so the two daughters still fit inside the band after Divide (they now span x 65 to 335). Graph box is 168 x 100 at (370, 88); the fed bar, legend and state caption moved up to match.
- Week 14 Lesson 2 (`cycle-dial`): dial centre 176 to 202, `R_OUT` 134 to 130, `R_IN` 94 to 92. Chromosome close-up spacing 60 to 50 and the DNA graph 200 x 84 to 164 x 80 so both sit inside the narrower card.
- Fixed the cleavage furrow. The bite circles were being driven to a centre distance of `biteR * 0.34`, which is inside their own radius, so the two bites met in the middle and cut a horizontal channel through the cell, leaving two crescents joined at their sides. They now stop at `biteR + NECK_HALF`, which pinches a 14-unit neck at the equator and leaves a proper peanut before the cell separates at position 99.
- Commit: Keep the Week 14 stage instruments inside the crop-safe band and fix the cleavage furrow

## VERSION_70
- Week 15 Lesson 1 (`mitosis-run`): scene re-authored at 620 x 390 with a 60-unit bleed, `preserveAspectRatio="xMidYMid slice"`, `stageFill` and `<Stage bleed>`, so it fills the stage instead of sitting in a band of empty gradient. Readable content stays between x 60 and x 560, y 40 and y 352.
- Chromosomes are now one morphing strand each: a long wavy thread when loose, a short fat rod once coiled, with a centromere disc joining the sisters. Dragging back uncoils them. Added a nucleolus that fades in prophase, spindle poles with asters on the animal cell, cytoplasm grain, chloroplasts and a double wall on the plant cell, the contractile ring drawn as a drawstring across the furrow, and Golgi vesicles that line up then fuse into the cell plate.
- Added a six-segment stage track along the bottom with a scrub marker, so PMAT is visible in the picture, plus one stage-gated in-picture label at a time (nucleus opening / metaphase plate / fibres pulling / cleavage furrow or cell plate).
- Stage boundaries retimed to 0-14-36-54-74-88-100 so each track segment is wide enough for its own name.
- Front copy on a diet: `intro` cut to one line, stage notes to one short sentence each, the slider helper to "Drag it backwards too.", the cell-type buttons to "Animal cell" / "Plant cell" with the explanation moved to the back. Added a Reset button.
- Week 15 Lesson 2 (`crossover-lab`): same stage treatment at 620 x 390 with bleed and slice. Gene letters A to F now ride on every band and a gene ruler runs down the left of the tetrad, so the swap is readable without relying on colour. Added a from-mother / from-father key, a cell outline around the tetrad, "untouched" / "swapped" strand labels, and a thicker orange outline on the gametes that came out mixed.
- Counter strip rebuilt at the new height and its labels cut to "n = 23, 46 chromatids" style with no em dashes.
- Front copy on a diet: `intro` cut to one line, step notes to one sentence, the recombinant card is now a readout plus a nudge only when no crossover is set, and "Back to the tetrad" became "Reset".
- Added `signature.explainer` to `w15-l1` and `w15-l2`, so finishing each one unlocks the flip.
- Commit: Refine the Week 15 mitosis and crossover interactives and add their explainer flips

## VERSION_71
- Week 15 Lesson 2 (`crossover-lab`): fixed overlapping text in the tetrad. The four strands were evenly spaced 38 apart, so the per-strand "untouched" / "swapped" captions under them ran into each other and read as "swappedswapped".
- Strands regrouped two and two at x offsets -62, -30, +30, +62, which is what a tetrad actually looks like (two chromosomes, each already two chromatids) and opens a 60-unit gap down the middle for the chiasma.
- Dropped the per-strand captions and the redundant gene ruler, whose "gene" header was sitting on the cell outline. Every band already carries its own gene letter. In their place: one orange bracket under the two strands that changed, labelled "swapped".
- The chiasma cross now straddles the crossover boundary (`cutY - 9` to `cutY + 9`) instead of hanging below it onto the next gene band, and the caption reads "swapped from gene F down".
- Moved the colour key inside the `step === 0` branch and into the top-left corner at x 66, where the cell ellipse never reaches, instead of x 470 where it sat on the membrane.
- Meiosis I chromatid spacing 38 to 32, to match the new within-pair gap.
- Week 15 Lesson 1 (`mitosis-run`): plant chloroplasts moved to +/- 178 x, +/- 44 and 48 y so they clear the stage-gated labels, and the prophase tag shortened from "nucleus opening" to "nucleus" and moved to (CX - 146, CY - 64) so it no longer touches the nuclear envelope.
- Commit: Fix overlapping labels in the Week 15 tetrad illustration

## VERSION_72
- Week 16 Lesson 2 (`fusion-bench`): rebuilt the illustration. The scene is now authored at 620x390 (the stage's own ~16:10 shape), the fluid background bleeds 60 units past the viewBox, and it renders with `preserveAspectRatio="xMidYMid slice"` + `stageFill` + `<Stage bleed>`, so it fills the frame instead of sitting in a 620x340 letterbox.
- The three cells are drawn as the actual objects instead of a circle with four bars. Sperm: acrosome cap, nucleus, midpiece, and a tail that beats from the animation tick. Egg: corona radiata, zona pellucida, yolk-packed cytoplasm, nucleus. Body cell: membrane, mitochondria, nucleus.
- New `Chroms` helper draws one bar per chromosome copy, so haploid reads as four singles, diploid as four pairs and a failed 69 as four triples with the surplus copy in red, with an "a whole extra set" callout pointing at it.
- A viable zygote now cleaves inside a drawn fertilisation membrane, 1 to 2 to 4 to 8 cells on a hand-placed pack, every cell still showing its diploid pair of bars.
- Added a pairing check: 46 is necessary but not sufficient, so egg + egg and sperm + sperm no longer count as a zygote. They fuse, fail, and report "46, but two of the same / needs one of each".
- New bench readout strip along the bottom: left slot, right slot and result, each with its name and count.
- Front copy on a diet. Heading "Watch It: Build a Zygote", intro one sentence, instruction "Make a real zygote, then make one that fails", per-cell notes cut to one short line each, action button "Drive them together".
- Added `signature.explainer` to `w16-l2` so finishing the block unlocks the flip.
- Reduced motion now jumps straight to the finished 8-cell embryo instead of running the fuse and cleave tweens.
- Commit: Rebuild the Week 16 fertilisation interactive and add its explainer flip

## VERSION_73
- Week 17 Lesson 1 (`clone-bench`): rebuilt the illustration. The scene is now authored at 620x390 (the stage's own ~16:10 shape), the background and the strawberry soil bleed 60 units past the viewBox, and it renders with `preserveAspectRatio="xMidYMid slice"` + `stageFill` + `<Stage bleed>`, so it fills the frame instead of sitting in a 620x340 letterbox.
- All four organisms redrawn as the real thing. Bacterium: rod body with a waisted outline that pinches shut, a DNA loop that duplicates and separates, ribosomes and flagella. Yeast: cell wall, vacuole, old bud scars, a neck that pinches, and a nucleus copy that travels into the bud. Starfish: five tapered arms with tube feet and a madreporite, the broken piece keeping a share of the central disc. Strawberry: soil band, trifoliate leaves, roots, and a runner that walks a second plant out and roots it.
- Layout regions fixed so nothing can be cropped: organism name at y 42, scene centred at (310, 128), bench divider at y 248, the clone field at y 312, disease verdict at y 350.
- The disease sweep is now a real progressive wave (`SWEEP_TICKS`) instead of an always-on sine tick that killed the whole field on the first frame. Dead clones get X eyes as well as a grey tint, so it is not colour alone.
- Dropped the permanent 70ms idle timer. Motion now only runs while a method or the sweep is running.
- "Release the disease" is gated on all four methods being run, which matches the hint line and makes completion deterministic.
- Front copy on a diet. Heading "Watch It: Copy Yourself Four Ways", intro one sentence, instruction "Run all four methods, then release the disease.", per-method paragraphs replaced by a one-line "what to watch for", in-picture captions cut to four words or fewer, em dashes removed.
- Added `signature.explainer` to `w17-l1` so finishing the block unlocks the flip.
- Commit: Rebuild the Week 17 asexual reproduction interactive and add its explainer flip

## VERSION_74
- Week 18 Lesson 1 (`variation-batch`): rebuilt the illustration. Scene re-authored at 620x390 (the stage's own ~16:10 shape), meadow, foliage and grass tufts bleed 60 units past the viewBox, and it now renders with `preserveAspectRatio="xMidYMid slice"` + `stageFill` + `<Stage bleed>` instead of letterboxing inside a 620x340 box.
- Beetles redrawn as beetles: six legs, two antennae, head with eyes, pronotum, wing cases with the split down the middle, a shell highlight and spots. Killed offspring land on their backs with their legs in the air instead of just turning grey.
- The shell-tone scale is now a field chart pinned in the scene, with a `pale`/`dark` gradient bar, the parasite zone drawn on it, and one triangle marker per offspring born, so the spread appears on the scale at the same moment it appears on the ground.
- The two parents now sit on leaves with a dashed cross joining them, so the picture shows where the litter came from.
- Front copy on a diet. Heading "Watch It: Twelve Offspring, All Different", one-sentence intro, instruction "Breed twelve offspring, then release the disease.", control labels cut to three words, status line reduced to a readout, and the panel paragraph replaced by a single hint that only shows while a goal is still open.
- Week 18 Lesson 2 (`energy-flow`): same stage treatment, plus a real meadow with sky, hills, a mid-ground band and a foreground band.
- All seven nodes redrawn as organisms instead of tinted circles: rayed sun, grass tuft with seed heads, grasshopper with a hind leg and antennae, frog with eyes and folded back legs, coiled snake with a tongue, hawk with spread wings, hooked beak and talons, and a rabbit with ears and a tail. Starving ones go grey with a red outline, a red dashed ring and a "no food" label, so it is never colour alone.
- Dropped the in-picture instruction caption; the instruction lives on the front and the panel buttons carry the same actions.
- Front copy on a diet on both blocks, em dashes removed from copy and comments.
- Added `signature.explainer` to `w18-l1` and `w18-l2` so finishing either block unlocks the flip.
- Commit: Rebuild both Week 18 interactives and add their explainer flips

## VERSION_75
- Week 19 Lesson 1 (`ten-percent`): rebuilt the illustration. Scene re-authored at 620x390 (the stage's own ~16:10 shape), sky, meadow and grass tufts bleed 60 units past the viewBox, and it now renders with `preserveAspectRatio="xMidYMid slice"` + `stageFill` + `<Stage bleed>` instead of letterboxing inside a 620x340 box.
- Trophic levels are drawn as organisms standing on their own bar: three grass tufts, a grasshopper with a hind leg and antennae, a frog with eye bumps and folded legs, and a coiled snake with a tongue. Tier widths still come from the cube root of the surviving fraction, with a 30-unit floor so the 1-unit bar can carry its label.
- Added a bleeding sun in the top-left corner with a dashed ray into the base bar and a "sunlight in" label, so the picture shows where the 1000 units come from.
- Heat plumes now carry a "90% heat" label, and a "10% up" chip appears beside each gap the student has actually climbed, so both halves of the rule are visible.
- Nutrient loop nodes redrawn as pictures: a grey dead snake with an X eye, a two-mushroom decomposer, a soil mound with mineral flecks and a new grass tuft. Nodes sit on the four diagonals and their labels ride paper chips, so nothing crowds the dashed ring.
- Front copy on a diet. Heading "Watch It: Energy Out, Atoms Round", one-sentence intro, instruction "Send energy to the top, then follow one carbon atom.", control labels cut to three words ("Send energy up", "Start again", "Follow one atom"), the panel paragraph replaced by a single hint that only shows while a goal is still open, and the status line reduced to a readout.
- Em dashes removed from the copy and the comments in this block.
- Added `signature.explainer` to `w19-l1` so finishing the block unlocks the flip.
- Commit: Rebuild the Week 19 ten-percent interactive and add its explainer flip
