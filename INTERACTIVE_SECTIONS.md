# Per-Lesson Signature Interactives

A proposal for giving every SciQuest lesson one purpose-built interactive of its own,
separate from the generic slots teachers can add and edit.

---

## Context

SciQuest has 59 lessons across 20 weeks. Six interactive slot types already exist and
work — `flipCards`, `quickCheck`, `hotspot`, `sortBuckets`, `dragLabel`, `customWidget` —
but **no seed lesson currently uses any of them**. Interactivity is entirely opt-in for
teachers, so in practice students scroll text.

The generic slots are also, by design, generic. A teacher can build a sorting task about
anything, but nothing in the system can *simulate solubility*, *run mitosis*, or *let a
student misread a meniscus and find out why*. Those need purpose-built code.

This document specifies one **signature interactive** per lesson: a developer-built
widget specific to that lesson's science, pinned to the lesson so it can't be deleted or
reordered, sitting alongside — not replacing — the teacher-editable slots.

There is exactly one custom widget in the codebase today,
`src/components/lesson-slots/interactive/widgets/ParticleMotionWidget.jsx`. It is the
proven shape to scale from: ~125 lines, no new dependencies, receives only `{ data,
onSolved }`, and knows nothing about lessons, XP, or Supabase.

### Two data problems found while scanning

**1. There are 59 lessons, not 60.** IDs run `lesson-1` … `lesson-60`, but `lesson-6`
does not exist — week 2 contains only `lesson-4` and `lesson-5` after a content merge.
The now-unused `lesson6hero` import still sits at `src/data/lessonsweek-02.js:7`. This
document covers the 59 lessons that actually exist.

**2. `src/data/lessonsweek-19.js` is corrupted by a bad find/replace.** Every occurrence
of "Web" / "web" became the literal string `null`:

- `title: "Food Chains and Food nulls"` (the week title)
- `title: "Food nulls"` (lesson-57's title)
- `"null diagram showing the interconnected food null of an ecosystem"`
- `"protect ocean food nulls from collapse"`

This is a separate one-line-per-instance fix, but lesson-57's widget can't ship with a
coherent heading until it's done.

---

## Architecture

### Attachment: a pinned `signature` field

Each lesson object gains an optional sibling to `layout[]`:

```js
{
  id: "lesson-4",
  title: "Particle Theory of Matter",
  signature: {
    widgetId: "particle-theory-sandbox",
    heading: "Try It: Build a Substance",
    intro: "Change the conditions and watch the five statements prove themselves.",
    xp: 25,
  },
  layout: [ /* teacher-editable, untouched */ ],
}
```

Because it lives *outside* `layout[]`, it never appears in the teacher's section list
and can't be dragged or removed. It is developer-owned content, keyed by lesson id.

### Files to create

| File | Purpose |
|---|---|
| `src/components/lesson-slots/interactive/signatureWidgets.js` | Registry, `lazy()` at module scope — mirrors `customWidgets.js` exactly |
| `src/components/lesson-slots/interactive/SignatureWidgetSection.jsx` | Host block; thin variant of `CustomWidgetSection.jsx` |
| `src/components/lesson-slots/interactive/widgets/<Name>Widget.jsx` × 59 | The widgets themselves |

A **separate registry** from `CUSTOM_WIDGETS` is deliberate. `CustomWidgetForm.jsx`
renders every registry entry as a radio option in the teacher's picker; adding 59
entries there would make it unusable. `CUSTOM_WIDGETS` stays the small, teacher-placeable
set.

`lazy()` is called once at module scope, not per render — the wrapper is cheap, the
underlying `import()` still only fires when a widget actually renders, and component
identity stays stable so it never remounts. Fifty-nine widgets therefore cost fifty-nine
separate chunks and nothing in the initial bundle.

### Files to modify

**1. `src/components/LessonTemplate.jsx`** — render after the `layout.map()` block
(currently ends line 509) and before `<MaterialsPanel>` (line 514):

```jsx
{lesson.signature?.widgetId && (
  <SignatureWidgetSection
    id="signature-interactive"
    lessonId={lesson.id}
    signature={lesson.signature}
    onInteractionComplete={onInteractionComplete}
  />
)}
```

**2. `src/context/LessonsDataContext.jsx` — the critical one.**

`dbRowToLesson()` (line 35) constructs a lesson object from DB columns and has no
concept of `signature`. The moment a teacher saves *any* edit to a lesson, an override
row wins in `mergeWeeks()` (line 79) and the signature widget silently disappears from
that lesson forever.

The fix belongs in `mergeWeeks`, carrying the field from the static seed rather than
adding a DB column — the widget is code, not editable content:

```js
if (override) {
  if (!override.is_hidden || includeHidden)
    merged.push({ ...dbRowToLesson(override), signature: lesson.signature })
}
```

DB-only custom lessons correctly receive no signature.

**This is the single highest-risk detail in the whole feature.** It fails silently, it
only fails after a teacher edits a lesson, and it would look like the widget "randomly
vanished on some lessons."

### Completion, XP and state — all reuse what exists

Nothing new is needed here. The existing interaction plumbing already does the job:

- `useCompletionReport` (`useInteractiveState.js:60`) reports the first solve upward.
  The latch is per-mount; `App.jsx` holds the student's saved rows and decides whether a
  report is genuinely new, so revisiting a finished widget never re-awards XP.
- `useInteractiveState(lessonId, blockId, makeInitial)` for any widget whose progress
  should survive a reload. Already scoped to the signed-in student via
  `interactiveStateKey`, so a shared computer never hands one student's half-finished
  work to the next.
- `recordInteraction` (`src/lib/lessonInteractions.js:25`) upserts with
  `ignoreDuplicates`, so resetting a widget cannot farm XP.
- `blockId` is the fixed string `"signature"`. This matters more than it looks: seed
  `layout[]` blocks have no `id`, so they fall back to `idx-${i}`
  (`LessonTemplate.jsx:504`), which shifts whenever a teacher inserts a block above.
  A stable id means a student's completion record can never be orphaned by a teacher edit.

Signature widgets stay **practice, not assessment**, exactly like the existing
interactive slots: no achievements, no `quiz_attempts`, no gradebook, and they never
gate lesson completion.

---

## Ten archetypes, not 59 originals

Nearly every lesson maps onto one of ten interaction shapes. Each widget still ships its
own SVG art, its own data, and its own validation — that is what makes it
lesson-specific — but the interaction shell repeats.

| # | Archetype | Shape | Count |
|---|---|---|---|
| **A** | Slider Sim | 1–2 continuous inputs → live visual + named readout | 13 |
| **B** | Sequencer | order steps or stages; a wrong order explains itself | 9 |
| **C** | Diagram Prober | SVG, tap parts to identify, then a challenge round | 7 |
| **D** | Classifier | items → 2–4 domain bins with reasoned feedback | 10 |
| **E** | Decision Path | scenario, choose an action, watch the consequence | 3 |
| **F** | Instrument Reader | read a rendered instrument correctly | 2 |
| **G** | Network Sim | nodes and edges; pull one, watch the cascade | 3 |
| **H** | Calculator Bench | compute from given inputs, answer checked | 4 |
| **I** | Comparator Morph | one control morphs A into B; labels appear as they apply | 6 |
| **J** | Population Sim | run rounds, watch outcomes diverge | 2 |

> **Do not build the archetype abstractions up front.** Build wave 1 concretely and
> inline. Extract a shared shell only where three widgets have *provably* converged —
> most likely `SequencerShell` and `SliderSimShell`, around wave 2. Three similar files
> beat a premature engine, and guessing the abstraction before writing the third case
> reliably produces the wrong one.

---

## Non-negotiables per widget

From `CLAUDE.md` and `.claude/rules/frontend.md`:

- **Never interpolate a Tailwind class** (`` `bg-${color}-50` ``). This is Tailwind v4
  with no safelist — interpolated classes compile to nothing. Use static maps of complete
  class strings; see `FlipCardsSection.jsx`.
- Every state shown by **both** color and a text label. Never color alone.
- Real `<button>` elements with visible labels. Tap targets ≥ 44px (`min-h-11`).
- Sliders respond to arrow keys — native `<input type="range">` does this; keep it.
- An `aria-live="polite"` status line for anything that changes.
- Respect `prefers-reduced-motion`. `ParticleMotionWidget` shows the pattern: drive the
  visual from state rather than a random walk, so reduced-motion users lose nothing.
- Dark mode on every surface (`dark:` variants). Base is cream `#fdf6e3` / `stone-900`.
- No `console.log` in committed code.
- Target 120–250 lines. A widget heading past 300 means the concept is too big — cut it.
- **Motion:** CSS transitions by default. **GSAP** (already a dependency, `^3.15.0`) only
  where the motion is genuinely choreographed — flagged per-widget in the tables below,
  11 of 59. Never Phaser; that stack stays in `src/games/`.

---

## Build order

Six waves, one week-block each, so testing arrives in reviewable chunks.

| Wave | Scope | Ships |
|---|---|---|
| **0** | Infrastructure | registry, host section, `LessonTemplate` + `LessonsDataContext` wiring, 1 pilot widget (lesson-4) |
| **1** | Weeks 1–3 (L1–L9) | 8 widgets |
| **2** | Weeks 4–7 (L10–L21) | 12 widgets |
| **3** | Weeks 8–11 (L22–L33) | 12 widgets |
| **4** | Weeks 12–15 (L34–L45) | 12 widgets |
| **5** | Weeks 16–20 (L46–L60) | 14 widgets |

Wave 0 gates everything. It proves the pinned-field path end to end, including surviving
a teacher edit, before 58 more widgets depend on it.

---

## The 59 signature interactives

Archetype letters refer to the table above. **G** in the Motion column means GSAP.

### Week 1 — Scientific Models

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L1** Uses of Scientific Models | `model-match-bench` | Given a real job — predict a hurricane path, show atom structure, test a bridge — pick which model type fits: physical, conceptual, mathematical, or simulation. The chosen model then renders, so the student sees the consequence of the choice rather than just a tick. | All 4 jobs matched | D | – |
| **L2** Scientific Method | `method-sequencer` | Drag the six steps into order for a concrete investigation. A wrong order *runs anyway* and shows what breaks — "you concluded before you collected data." | Correct order submitted | B | – |
| **L3** Models in Real Life | `model-limits-explorer` | Toggle between a globe and a flat map of the same region. A distortion overlay names exactly what each model preserves and what it sacrifices. | Both models inspected, trade-off question answered | I | – |

### Week 2 — Particle Model of Matter

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L4** Particle Theory of Matter | `particle-theory-sandbox` | Temperature **and** particle-count sliders. The five statements of particle theory sit alongside the box and light up as the student produces the behavior that evidences each one. | All five statements evidenced | A | – |
| **L5** Particle Nature of States | `state-change-journey` | Drag along a temperature axis from −20 °C to 120 °C. The particle box rearranges continuously; each of the six named changes fires and is logged as it's crossed. | All six changes triggered | A | – |

*`lesson-6` does not exist — see the data note above.*

### Week 3 — Changes in State of Matter

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L7** Melting and Freezing | `heating-curve-plotter` | Add heat step by step and the graph plots itself. The student must click the plateau and answer why temperature stalls while heat keeps going in. | Plateau identified and explained | A | – |
| **L8** Evaporation and Condensation | `evaporation-race` | Two dishes, four factor toggles each — temperature, surface area, wind, humidity. Predict the winner *before* racing them. | Three races predicted correctly | A | – |
| **L9** Sublimation and Deposition | `skip-the-liquid` | Dry ice and frost shown against the normal solid → liquid → gas route, making the direct path visible. The student routes a substance both ways. | Both direct paths traced | I | – |

### Week 4 — Scientific Investigation

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L10** Parts of an Investigation | `investigation-builder` | From a question card, assemble all seven parts in order. Each slot rejects the wrong card type and says why. | Full investigation assembled | B | – |
| **L11** Variables and Controls | `fair-test-designer` | Given a scenario — plant growth, sunscreen — pick the independent, dependent, and controlled variables. The verdict says whether the test is fair and, if not, which confound survived. | Two scenarios passed | custom | – |
| **L12** Data Collection and Recording | `trial-table` | Run repeated trials with realistic scatter. Compute the mean, flag the outlier, and watch the conclusion shift when there are too few trials. | Mean and outlier both correct | H | – |

### Week 5 — Measurement in Science

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L13** SI Units and Measurement Tools | `tool-picker` | A measuring job appears — a dose of medicine, the length of a field, the mass of a coin. Pick tool *and* unit; wrong combinations explain the mismatch of scale. | 5 jobs correct | D | – |
| **L14** Measuring Length, Mass, Volume | `cylinder-reader` | An SVG graduated cylinder with a **draggable eye level**. The reading changes with parallax, so the student must level their eye and then read the bottom of the meniscus. | 3 volumes read correctly at eye level | F | – |
| **L15** Accuracy, Precision, and Errors | `target-range` | Place four shots on an archery target, then label the grouping accurate / precise / both / neither. Then the reverse: given a label, produce the grouping. | All four categories produced | D | – |

### Week 6 — Solutions and Solubility

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L16** Mixtures and Solutions | `tyndall-beam` | Shine a light beam through a solution, a colloid, and a suspension. Beam scatter and settling-over-time distinguish them; the student then classifies three unknowns. | 3 unknowns classified | I | – |
| **L17** Solubility | `solubility-curve` | Temperature slider against solute added. The readout names unsaturated / saturated / supersaturated, with undissolved solid drawn at the bottom of the beaker. | All three conditions produced | A | – |
| **L18** Rate of Dissolving | `dissolving-race` | Two beakers, three toggles each — stir, heat, crush. Race the timer and isolate which factor mattered most. | Fastest combination found | A | – |

### Week 7 — Concentration of Solutions

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L19** What is Concentration? | `concentration-slider` | *Add solute* and *add solvent* as separate controls. Color intensity tracks concentration; the label reads concentrated or dilute. The key insight: adding solvent lowers concentration without removing any solute. | Both routes to "dilute" found | A | – |
| **L20** Measuring Concentration | `percent-bench` | Mass and volume inputs; compute %m/m, %m/v, and ppm. Answers checked, with worked feedback on the wrong ones. | 3 calculations correct | H | – |
| **L21** Dilution and Saturated Solutions | `dilution-bench` | Hit a target concentration by pouring stock and topping up with solvent. C₁V₁ = C₂V₂ updates live as the student pours. | Target hit within tolerance | H | – |

### Week 8 — Acids, Bases, and Salts

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L22** Properties of Acids and Bases | `indicator-bench` | Dip litmus and phenolphthalein into unknown solutions and deduce acid or base from the color evidence alone. | 4 unknowns identified | D | – |
| **L23** The pH Scale | `ph-dial` | Slide across 0–14. Real substances — lemon, milk, bleach — snap into place; the color strip and a text category label move together. Includes a "find something more acidic than X" challenge. | All 3 categories visited, challenge met | A | – |
| **L24** Neutralization and Salts | `titration-drip` | Add base drop by drop to an acid. The pH meter climbs, the indicator flips, and the salt and water are named as they form. Overshooting is allowed and shown. | pH 7 reached and the salt named | A | – |

### Week 9 — Laboratory Equipment

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L25** Common Laboratory Equipment | `equipment-bench` | Tap items on a lab bench to learn name and use, then a challenge round matches a job to the right piece. | Challenge round cleared | C | – |
| **L26** Using the Microscope | `focus-simulator` | Coarse and fine focus knobs plus an objective turret. Start blurry at low power and get a sharp image at high power — using coarse focus at high power cracks the slide. | Sharp image at high power, slide intact | A | – |
| **L27** Proper Handling of Lab Materials | `safe-handling-choices` | Scenario cards — carrying acid, heating a test tube, smelling a gas. Pick the action; unsafe picks play out the outcome rather than just being marked wrong. | All scenarios handled safely | E | – |

### Week 10 — Laboratory Safety

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L28** Laboratory Safety Rules | `spot-the-hazards` | A lab scene with eight unsafe things hidden in it — open flame near loose hair, no goggles, food on the bench. Tap to find each; each reveals the rule it breaks. | All 8 found | C | – |
| **L29** Safety Symbols and Hazards | `label-decoder` | Hazard symbols on realistic containers. A three-part match: symbol → meaning → required precaution. | All symbols decoded | D | – |
| **L30** Emergency Procedures | `emergency-response` | Branching first-30-seconds decisions for a chemical spill, a fire, and an eye splash. Wrong branches play out visibly before offering a retry. | All three emergencies resolved correctly | E | – |

### Week 11 — The Microscope

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L31** History and Parts of the Microscope | `microscope-anatomy` | Drag labels onto an SVG compound microscope. A history scrubber runs 1590 → today, showing what each generation could actually resolve. | All parts labeled, timeline scrubbed | C | – |
| **L32** Using the Microscope Correctly | `microscope-run` | Ordered handling steps, each wrong move carrying a visible consequence — carrying it one-handed drops it, starting at high power finds nothing. | Full run completed cleanly | B | – |
| **L33** Preparing Microscope Slides | `wet-mount-bench` | Place the specimen, add the water drop, lower the coverslip. Lowering it flat traps air bubbles — visible under the scope afterward. | Bubble-free mount produced | B | **G** |

### Week 12 — Cell Theory

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L34** Development of Cell Theory | `scientist-timeline` | Scrub 1590 → 1855. Each stop shows what that scientist saw through their instrument and what they concluded, assembling the three tenets of cell theory as you go. | All contributors visited, tenets assembled | C | – |
| **L35** Prokaryotes and Eukaryotes | `cell-sorter-scope` | Unlabeled cells under a scope. Decide prokaryote or eukaryote using only visible features; feedback names the deciding feature. | 6 cells sorted correctly | D | – |
| **L36** Cell Diversity | `form-follows-function` | Match specialized cells — nerve, muscle, root hair, red blood — to the job their shape enables. Wrong matches show why *that* shape fails at *that* job. | All matched | D | – |

### Week 13 — Cell Parts and Functions

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L37** Cell Membrane and Cell Wall | `gatekeeper` | Send molecules of different sizes at a membrane; some pass, some don't. Toggle a cell wall on and see what changes — and what doesn't. | Selective permeability demonstrated both ways | A | – |
| **L38** Nucleus and Cell Organelles | `organelle-explorer` | Tap organelles in an SVG cell for their function, then a challenge round: "this cell can't make protein — which organelle failed?" | Challenge round cleared | C | – |
| **L39** Cytoplasm and Cytoskeleton | `scaffold-test` | Remove cytoskeleton filaments one type at a time and watch shape, transport, and division each fail in turn. | All three roles demonstrated | A | **G** |

### Week 14 — Plant and Animal Cells

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L40** Comparing Plant and Animal Cells | `cell-morph` | A single slider morphs an animal cell into a plant cell. Shared structures hold steady; unique ones fade in and label themselves as they appear. | Full morph, shared/unique sorted | I | **G** |
| **L41** Unique Structures in Plant Cells | `turgor-lab` | A water slider. The vacuole swells and the plant stands; drain it and the plant visibly wilts. The cell wall is shown holding shape where an animal cell would burst. | Both turgid and flaccid states produced | A | – |
| **L42** Unique Structures in Animal Cells | `animal-cell-bench` | Trigger the centrioles to start division; feed debris to a lysosome and watch it digest. Two structures, two consequences. | Both triggered | C | – |

### Week 15 — Cell Reproduction: Mitosis

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L43** The Cell Cycle | `cycle-dial` | Drag around a G₁ → S → G₂ → M dial. A DNA-amount graph tracks the pointer, making the S-phase doubling visible rather than asserted. | Full cycle traversed, DNA doubling identified | A | – |
| **L44** Stages of Mitosis | `mitosis-sequencer` | Order the four PMAT stages from micrographs, then scrub a chromosome animation to see what actually moves in each. | Correct order, all stages scrubbed | B | **G** |
| **L45** Importance and Applications of Mitosis | `growth-repair-sim` | Cut a tissue and watch mitosis close the wound. Then flip a switch to runaway division and watch the same process become a tumor. | Both outcomes run | A | **G** |

### Week 16 — Cell Reproduction: Meiosis

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L46** Introduction to Meiosis | `halving-counter` | Step through both divisions with a live chromosome counter: 2n → 2n → n → n. The point is seeing *where* the halving happens. | Both divisions stepped through | A | – |
| **L47** Stages of Meiosis | `meiosis-sequencer` | Order the Meiosis I and II stages. Crossing-over is draggable in Prophase I, and the resulting gametes differ *because of what the student did*. | Both divisions ordered, crossover performed | B | **G** |
| **L48** Comparing Mitosis and Meiosis | `side-by-side-runner` | Run both processes in parallel from the same starting cell. Daughter cells are compared at the end on count, ploidy, and variation. | Both run to completion, comparison answered | I | **G** |

### Week 17 — Fertilization and Reproduction

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L49** Fertilization | `gamete-fusion` | Pick two gametes, fuse them, see the zygote's chromosome count. Try fusing a diploid cell by mistake and find out why meiosis has to come first. | Correct zygote formed, diploid error explored | A | – |
| **L50** Sexual Reproduction | `variation-machine` | Cross two parents and generate offspring. Run a batch of twelve and see that no two come out identical. | A batch run, variation observed | J | – |
| **L51** Asexual Reproduction | `clone-factory` | Pick binary fission, budding, fragmentation, or vegetative propagation and watch each run on a real organism. | All four methods run | I | – |

### Week 18 — Types of Reproduction Compared

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L52** Sexual vs. Asexual Reproduction | `strategy-race` | Two populations — one clonal, one sexual — over generations in a stable environment. The clones win on speed. This sets up L53. | Race run to completion | J | – |
| **L53** Advantages and Disadvantages of Each | `stress-test` | Throw a disease or a drought at those same two populations. The clonal one collapses; variation saves the sexual one. | Both stressors applied | J | – |
| **L54** Examples in Nature | `field-guide-sorter` | Sort real organisms — strawberry runners, sea star, hydra, salmon — by reproduction strategy. Several do both, which is the point. | All sorted, including the dual-strategy ones | D | – |

### Week 19 — Food Chains and Food Webs

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L55** Producers, Consumers, Decomposers | `role-assigner` | Build a working ecosystem by assigning roles. Leave out decomposers and nutrients pile up; leave out producers and it starves. | Functioning ecosystem built | D | – |
| **L56** Food Chains | `chain-builder` | Build a chain where **arrow direction matters** — arrows point along energy flow, and reversing one is the classic student error this widget catches explicitly. | Correct chain with correct arrows | G | – |
| **L57** Food Webs | `web-collapse` | Remove one organism from a food web and watch the cascade propagate through every connected species. | Three removals explored | G | **G** |

*Blocked on the `lessonsweek-19.js` find/replace fix — see the data note above.*

### Week 20 — Energy Flow and Biological Organization

| Lesson | Widget | Interaction | Solved when | Arch | Motion |
|---|---|---|---|---|---|
| **L58** Energy Pyramid | `ten-percent-pyramid` | Set producer energy and watch 10% survive each trophic step. The student predicts top-level energy before revealing it, and sees why food chains are short. | Prediction correct at two levels | A | – |
| **L59** Levels of Biological Organization | `zoom-ladder` | A single continuous zoom control from atom to biosphere through all nine levels, each naming itself as it comes into view. | All nine levels visited | A | **G** |
| **L60** Ecosystem Interactions | `interaction-lab` | Pair two organisms and set who benefits and who is harmed. The matrix names the relationship — mutualism, commensalism, parasitism, predation, competition. | All five relationships produced | D | – |

---

## Verification

There is no test suite and no typecheck in this project, so per `CLAUDE.md` the
developer does the runtime testing. Per wave:

1. `npm run lint` — must pass clean.
2. A **What to check** handoff note naming which lesson pages to open, the exact
   interaction to perform, what correct looks like, and the specific signs of failure.

Wave 0's handoff is the important one, because it validates the architecture rather than
any single widget:

- Open **Week 2 → Lesson 4** as a student. The signature block renders below all content
  sections and above Materials, headed "Try It: Build a Substance".
- Complete it. Profile XP should rise by 25.
- Reload. It should still read as completed, and XP must **not** rise again.
- Sign in as a **teacher**, edit that lesson (change any heading, save), then reopen it
  as a student. **The signature block must still be there.** If it vanished, the
  `mergeWeeks` carry-over is wrong — this is the failure mode the architecture section
  exists to prevent.
- In the teacher lesson editor, confirm the signature block does **not** appear in the
  section list and cannot be dragged or deleted.
- Toggle dark mode on the lesson and check every surface inside the widget.
- Tab to the slider and press the arrow keys; it must move.
- Enable `prefers-reduced-motion` at the OS level; no animation should play.

---

## Open questions

1. **XP per widget** — this document assumes a flat 25 XP. Should harder widgets
   (`meiosis-sequencer`, `dilution-bench`) be worth more than lighter ones
   (`tool-picker`)?
2. **Placement** — the signature block currently lands at the bottom of the lesson,
   after all content. Some lessons might teach better with it mid-page, which would mean
   an optional `after: <section index>` on the `signature` field.
3. **`lesson-6`** — leave the gap, or write a new week 2 lesson to fill it?
