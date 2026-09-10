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
- Avatar editor: pressing anywhere off a sticker now deselects it (handles + dashed outline disappear). `AvatarEditor.jsx` listens for `pointerdown` on the document while a sticker is selected; presses on a sticker frame or inside the Stickers panel (marked `data-keeps-sticker-selection`) keep the selection.

## VERSION_9
- Avatar editor: the red remove handle on a selected sticker now shows a trash icon (`Trash2`) instead of an X. Help text in the Stickers panel updated to match.

## VERSION_10
- Avatar editor: removed the row of placed-sticker chips ("Flower Bunch 1", "Heart 2", …) from the Stickers panel. Stickers are selected by clicking (or tabbing to) them on the preview; the edit card and "Clear all stickers" stay.

## VERSION_11
- Avatar editor: nothing renders below the sticker grid any more. Removed the "sticker space is full" note, the "Editing …" card (width/height/rotation/position sliders, Bring to front, Remove sticker) and "Clear all stickers". Stickers are edited only on the preview (drag, handles, trash button, arrow keys); the `n / 6` counter still shows when the grid is full.
- The Stickers panel no longer keeps a sticker selected, so clicking blank space in it deselects like anywhere else. Dropped the now-unused `CONTROL`, `selected` and `selectedLabel`.

---
Staged changes: Remove sticker edit card and controls below avatar sticker grid
