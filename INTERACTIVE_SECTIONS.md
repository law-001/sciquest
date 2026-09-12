# Per-Lesson Signature Simulations

One purpose-built, animated simulation per lesson, pinned to that lesson and owned by
developers rather than teachers.

> **Rebuilt for the MATATAG curriculum.** The course now follows `SCIQUEST-TOPICS.pdf`:
> 20 weeks, **33 lessons**, with a varying number of lessons per week rather than a fixed
> three. Weeks 10 and 20 are periodical-examination weeks and carry no lessons at all.
> The old 59-lesson plan below has been replaced week by week.

---

## The rule that decides everything

**Show the object. Do not ask about it.**

SciQuest already has a full quiz system with ten question types. A lesson interactive that
asks a question is a worse quiz in the wrong place. What the quiz cannot do is *run the
thing* — melt an actual lattice, sag an actual bridge, unroll an actual globe.

So every signature interactive is a working model of the thing the lesson is about, with
controls that drive it and readouts that respond. The student learns by steering it and
watching, the way you learn a bicycle.

**Banned outright:**

- Multiple choice, "pick the right one", "match A to B"
- Drag-into-the-correct-bucket, ordering cards, fill in the blank
- Anything where the interaction is *stating an answer* rather than *causing an effect*
- A wall of text with a button under it

**What replaces them:**

- Sliders, dials, hold-to-heat buttons, drag-the-thing controls
- Continuously animated canvas or SVG that responds while you hold the control
- Numeric readouts computed from the simulation, never hardcoded
- Completion earned by *producing a state* or *watching a process finish*, never by
  answering correctly

A useful test: **if you removed every word from the widget, would a student still see the
science happen?** If not, it is the wrong design.

### Where the words do belong

Text is not banned — narration is. Each simulation carries a short live caption naming the
current state ("0 °C — melting, and holding") and a compact checklist of what the student
has caused so far. Both are readouts of the simulation, updating as it runs. Neither is a
question, and neither is more than a couple of lines.

---

## Progress

**Shipped: 28 of 28 buildable. Every content lesson now has one.**

The 33 lessons break down as:

| Group | Count | Status |
|---|---|---|
| Lessons with a shipped widget | 28 | ✅ Done |
| Lessons still needing a widget | 0 | — |
| Performance-task lessons (no signature — see below) | 5 | — Not applicable |
| **Total lessons** | **33** | |

| Wave | Scope | Status |
|---|---|---|
| **0** | Infrastructure | ✅ Done — registry, host section, `SimLayout`, `LessonTemplate` + `LessonsDataContext` wiring |
| **1** | Weeks 1–2 | ✅ Done — all five shipped |
| **2** | Weeks 3–7 (7 widgets) | ✅ Done — all seven shipped |
| **3** | Weeks 8–13 (7 widgets) | ✅ Done — all seven shipped |
| **4** | Weeks 14–19 (9 widgets) | ✅ Done — all nine shipped |

### Shipped

Weeks 1–2 were **deliberately left unchanged** during the curriculum rebuild, so their
lesson ids are still the original `lesson-N` form. Everything from Week 3 on uses the
`wNN-lN` scheme described below.

| Lesson | Lesson id | Widget id | File |
|---|---|---|---|
| W1 L1 Uses of Scientific Models | `lesson-1` | `model-gallery` | `widgets/ModelGalleryWidget.jsx` |
| W1 L2 Science Process Skills | `lesson-2` | `investigation-run` | `widgets/InvestigationRunWidget.jsx` |
| W1 L3 Models in Real Life | `lesson-3` | `globe-unroll` | `widgets/GlobeUnrollWidget.jsx` |
| W2 L1 Particle Theory of Matter | `lesson-4` | `particle-lab` | `widgets/ParticleLabWidget.jsx` |
| W2 L2 Particle Nature of Matter States | `lesson-5` | `state-change-lab` | `widgets/StateChangeLabWidget.jsx` |
| W3 L1 Different Phases of Matter | `w03-l1` | `phase-bench` | `widgets/PhaseBenchWidget.jsx` |
| W4 L1 Changes in the State of Matter | `w04-l1` | `heating-curve` | `widgets/HeatingCurveWidget.jsx` |
| W5 L1 Steps in Scientific Investigation | `w05-l1` | `investigation-rig` | `widgets/InvestigationRigWidget.jsx` |
| W5 L2 Measurement | `w05-l2` | `meniscus-bench` | `widgets/MeniscusBenchWidget.jsx` |
| W6 L1 Solubility: Solute and Solvent | `w06-l1` | `solubility-beaker` | `widgets/SolubilityBeakerWidget.jsx` |
| W7 L1 Concentration of Solutions | `w07-l1` | `dilution-jar` | `widgets/DilutionJarWidget.jsx` |
| W7 L2 Acids, Bases and Salts | `w07-l2` | `titration-drip` | `widgets/TitrationDripWidget.jsx` |
| W8 L1 Laboratory Instruments and Equipment | `w08-l1` | `equipment-bench` | `widgets/EquipmentBenchWidget.jsx` |
| W8 L2 Laboratory Rules and Safety Symbols | `w08-l2` | `hazard-cabinet` | `widgets/HazardCabinetWidget.jsx` |
| W11 L1 The Microscope: An Introduction | `w11-l1` | `focus-scope` | `widgets/FocusScopeWidget.jsx` |
| W11 L2 The Importance of Microscope Discovery | `w11-l2` | `scope-through-time` | `widgets/ScopeThroughTimeWidget.jsx` |
| W12 L1 The Cell Theory and Its Diversity | `w12-l1` | `scope-field` | `widgets/ScopeFieldWidget.jsx` |
| W12 L2 Parts and Function of the Cell | `w12-l2` | `cell-cutaway` | `widgets/CellCutawayWidget.jsx` |
| W13 L1 Plant and Animal Cell | `w13-l1` | `cell-morph` | `widgets/CellMorphWidget.jsx` |
| W14 L1 Cell Reproduction | `w14-l1` | `surface-volume` | `widgets/SurfaceVolumeWidget.jsx` |
| W14 L2 The Cell Cycle | `w14-l2` | `cycle-dial` | `widgets/CycleDialWidget.jsx` |
| W15 L1 Mitosis Cell Division | `w15-l1` | `mitosis-run` | `widgets/MitosisRunWidget.jsx` |
| W15 L2 Meiosis Cell Division | `w15-l2` | `crossover-lab` | `widgets/CrossoverLabWidget.jsx` |
| W16 L2 Fertilization | `w16-l2` | `fusion-bench` | `widgets/FusionBenchWidget.jsx` |
| W17 L1 Asexual Reproduction | `w17-l1` | `clone-bench` | `widgets/CloneBenchWidget.jsx` |
| W18 L1 Sexual Reproduction | `w18-l1` | `variation-batch` | `widgets/VariationBatchWidget.jsx` |
| W18 L2 Energy Flow in an Ecosystem | `w18-l2` | `energy-flow` | `widgets/EnergyFlowWidget.jsx` |
| W19 L1 Energy Flow in the Circle of Life | `w19-l1` | `ten-percent` | `widgets/TenPercentWidget.jsx` |

Two second interactives also ship as `customWidget` blocks inside those same lessons:
`pour-test` on `lesson-4` and `container-test` on `lesson-5`.

**All four waves are done.** Every one of the 28 content lessons has a signature
simulation; the five performance-task lessons deliberately have none. There is no
"next three" — the next work on this system is maintenance, or a widget for a lesson
that does not exist yet. Read `ParticleLabWidget.jsx` (canvas sim) and
`CellCutawayWidget.jsx` (SVG scene with derived travellers) first if you are adding one;
between them they demonstrate every technique in the set.

Wave 2 added one shared trick worth copying: with `prefers-reduced-motion` on there is no
`rAF` loop, so the canvas widgets stash the draw function in a ref and repaint once per
control change. That keeps a reduced-motion student with a picture that still answers the
slider instead of one frozen at mount.

Wave 3 added two more:

- **A tick counter beats a `rAF` loop for SVG widgets.** All seven Wave 3 widgets are SVG,
  so they run one `setInterval` that only does `setTick(t => t + 1)` and derive every
  moving coordinate from `tick` in render. Nothing is stored in a ref, nothing tears down
  when a slider moves, and reduced motion is one `if` that skips the interval.
- **The reduced-motion flag belongs in `useState`, not a ref**, whenever render needs it.
  The React Compiler lint rule `react-hooks/refs` is an error on reading `ref.current`
  during render, so seed it with `useState(() => window.matchMedia?.(…).matches ?? false)`
  and read the state. A ref is still fine when only event handlers and effects read it.

Wave 4 added one more, learned the hard way three times in one run:

- **A helper an effect calls must be declared above that effect.** `react-hooks` treats a
  hoisted `function win() {}` used inside a `useEffect` that sits above it as
  *Cannot access variable before it is declared*, and it is an **error**, not a warning.
  Declare `win` / `mark` / `finish` immediately after the state and refs they touch, and
  before the first effect that calls them. If an effect calls one, wrap it in
  `useCallback` and list it in the deps — a plain function declaration leaves an
  `exhaustive-deps` warning, and adding a non-memoised function to the deps would restart
  the interval on every render.

### Lesson id scheme

Weeks 3–19 use `wNN-lN` ids (`w03-l1`, `w03-l2`, `w04-l1`, …). This was chosen over
re-using `lesson-N` so that no stale teacher-override row in Supabase could silently land
old content on a new topic. Weeks 1–2 keep their original `lesson-1`…`lesson-5` ids.

### Performance-task lessons take no signature

Five lessons are performance-task briefings rather than content lessons:

| Lesson id | Task |
|---|---|
| `w03-l2` | Performance Task 1 — "The States of Matter Adventure: A Comic Strip Journey" |
| `w06-l2` | Performance Task 2 — Solution Detectives |
| `w09-l1` | Performance Task 3 — Identifying Acids and Bases in Everyday Products |
| `w16-l1` | 2nd Performance Task — Math and Science Fair 2025 |
| `w19-l2` | 3rd Performance Task — 3D Ecosystem Diorama |

These tell a student how to build something in the real world over several days. There is
no object to simulate — the object is the thing they go and make. Adding a widget here
would be decoration, so they are deliberately left without one. Their quizzes carry the
planning work instead.

---

## Architecture (built and working — do not redesign)

### Attachment: a pinned `signature` field

A lesson object gains a sibling to `layout[]`:

```js
{
  id: "w04-l1",
  title: "Changes in the State of Matter in Terms of Particle Arrangement",
  signature: {
    widgetId: "heating-curve",
    heading: "Watch It: The Plateau Appears",
    intro: "Heat goes in at a steady rate and the graph draws itself…",
    instruction: "Draw both plateaus, then run it backwards",
    xp: 25,
  },
  layout: [ /* teacher-editable, untouched */ ],
}
```

Because it lives *outside* `layout[]`, it never appears in the teacher's section list and
cannot be dragged or deleted.

### The files

| File | Role |
|---|---|
| `interactive/signatureWidgets.js` | Registry. One `lazy()` line per widget, at module scope |
| `interactive/SignatureWidgetSection.jsx` | Host block: heading, intro, completion pill, `Suspense` |
| `interactive/SimLayout.jsx` | Picture-left / controls-right shell + `Stage` frame |
| `interactive/stageMedia.js` | `STAGE_MEDIA` sizing for the SVG or canvas |
| `interactive/widgets/<Name>Widget.jsx` | One per lesson |

All of these live under `src/components/lesson-slots/interactive/`.

Separate from `CUSTOM_WIDGETS` deliberately: that registry is rendered as a radio list in
the teacher's section picker, and dozens of entries would make it unusable.

### Two wiring points, already done

1. **`LessonTemplate.jsx`** renders the block after `layout.map()`, before
   `<MaterialsPanel>`.
2. **`LessonsDataContext.jsx:86`** — `mergeWeeks()` carries `signature` from the static
   seed onto a teacher's DB override row. **Without this the widget vanishes the first
   time a teacher edits the lesson.** Do not remove it.

`SignatureWidgetSection` does *not* use `InteractiveFrame`: that shell holds its content at
`opacity: 0` until an IntersectionObserver fires, which can leave a simulation invisible.
The signature block paints unconditionally.

### Completion and XP

- `blockId` is the fixed string `"signature"`, so a completion record is never orphaned by
  a teacher inserting a section above it.
- `useCompletionReport` reports the first solve; `App.jsx` decides whether it is new, so
  revisiting never re-awards XP.
- `recordInteraction` upserts with `ignoreDuplicates`, so resetting cannot farm XP.
- 25 XP flat. `lesson_interactions.block_type` is plain `text` — no migration needed.
- **Practice, not assessment.** No achievements, no `quiz_attempts`, no gradebook, and they
  never gate lesson completion.

---

## The widget contract

```jsx
export default function SomethingWidget({ onSolved }) { … }
```

That is the entire API. A widget receives one callback and calls it once, when the student
has produced or watched everything the lesson wanted. It knows nothing about lessons, XP,
Supabase, or the student.

### Required shape

```jsx
import SimLayout, { Stage } from '../SimLayout'
import { STAGE_MEDIA } from '../stageMedia'

<SimLayout
  stage={<Stage><svg viewBox={`0 0 ${W} ${H}`} style={STAGE_MEDIA} role="img" aria-label={…}>…</svg></Stage>}
  panel={<>{/* live caption, controls, compact checklist */}</>}
/>
```

`SimLayout` gives both columns one shared height (`lg:h-[62vh]`), so the picture and the
controls that drive it are always on screen together. Below `lg` it stacks. **Every new
widget uses it** — a simulation the student has to scroll away from to reach its own slider
is a broken simulation.

---

## Six shapes, not 23 originals

| # | Shape | What it is | Built example |
|---|---|---|---|
| **A** | **Live Sim** | Canvas, `requestAnimationFrame`, particles or agents with real velocities. State emerges from the physics rather than being drawn on | `particle-lab` |
| **B** | **Apparatus** | An instrument you operate — burner, burette, microscope, balance. Controls move real parts; readouts follow | `state-change-lab` |
| **C** | **Run & Record** | Press start; a process plays out over time while data accumulates and a chart draws itself | `investigation-run` |
| **D** | **Morph** | One continuous control transforms A into B; a number measured off the shape tracks the change | `globe-unroll` |
| **E** | **Dissect** | A detailed diagram where removing or triggering a part makes a downstream function visibly fail | — |
| **F** | **Cascade** | Nodes and flows; change one and watch it propagate through the rest | — |

> Build them concretely and inline. `SimLayout` is the only shared abstraction that has
> earned its place. Do not build an "ArchetypeEngine" — three similar files beat a
> premature engine, and guessing the abstraction before the third case reliably produces
> the wrong one.

---

## Non-negotiables per widget

**Visual**

- Something must be **moving or responding** the moment the widget renders. A static
  picture with a button under it is a failed widget.
- The picture carries the science. Colour is never the only signal — every state is also
  named in text.
- Numbers shown are computed from the simulation. Never hardcode a readout.
- SciQuest palette: cream `#FAF7F2` ground, orange/teal/yellow accents. State colours —
  solid `#7FB3EA`, liquid `#3BAFA9`, gas `#9AA7B8`. 12–16px corners.
- Canvas draws on a transparent background in colours that read on cream *and* on
  stone-900, so no widget has to know about the theme.

**Technical**

- **Never interpolate a Tailwind class** (`` `bg-${c}-50` ``). Tailwind v4, no safelist —
  interpolated classes compile to nothing. Use static maps of complete class strings.
- One `rAF` loop per widget, started once. Read live control values through a **ref** so
  dragging a slider never tears down and restarts the simulation.
- **The React Compiler lint rules are on, and they are errors, not warnings:**
  - No writing to a ref during render — do it in a `useEffect`.
  - No calling `setState` synchronously in an effect body — seed it in `useState`, or move
    the work into a timer or event callback.
- No `console.log`. No GSAP unless the motion is genuinely choreographed (it is already a
  dependency; most of these do not need it). Never Phaser — that stack stays in
  `src/games/`.

**Accessibility**

- Real `<button>` elements, visible labels, `min-h-11` tap targets.
- Native `<input type="range">` so arrow keys work. Every input has a `<label>`.
- `role="img"` plus a live `aria-label` on the canvas or SVG, and an `aria-live="polite"`
  status line naming the current state.
- `prefers-reduced-motion`: render one representative frame instead of looping. Check it
  once at mount and branch — never leave a reduced-motion student with a blank box.
- Dark mode on every surface. 4.5:1 contrast.

**Size**

- 200–330 lines. Past 350 the concept is too big — cut it, do not split it.

---

## The 28 simulations, as specified

Shape letters refer to the table above. **G** = worth reaching for GSAP.

### All weeks — shipped ✅

All twenty-eight are built and attached; see the Shipped table above. The per-week
entries below are kept as the record of what each one was specified to do, so a later
change can be checked against the original intent.

### Week 3 — Phases of Matter

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w03-l1** Different Phases of Matter | ✅ `phase-bench` | One substance, five phases. A single energy slider runs from near absolute zero to star-hot: particles lock into a shivering lattice, break loose, fly free, then tear apart into glowing charged plasma. At the cold end they slow almost to a stop and merge into one blurred group | All five phases reached | A |
| **w03-l2** Performance Task 1 | — | Task briefing — no signature widget | — | — |

### Week 4 — Changes in the State of Matter

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w04-l1** Changes in State by Particle Arrangement | ✅ `heating-curve` | An ice cube on a hotplate, zoomed to the lattice. Heat goes in at a steady rate and the temperature-against-time graph **draws itself live**, so the flat plateau is something the student watches appear rather than a picture of a graph. Freeze it back and the curve retraces in reverse. A vacuum lever forces the sublimation route so the liquid stage is visibly skipped | Both plateaus drawn, both directions run, sublimation route taken | C |

### Week 5 — Scientific Investigation and Measurement

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w05-l1** Appropriate Steps in Scientific Investigation | ✅ `investigation-rig` | The investigation as a working machine: question, prediction, trial, data and conclusion are physical stages on a conveyor with material moving through them. Pull any stage out and the machine visibly jams at that point. A second lever lets two variables change at once, and the cause-arrows visibly tangle | Machine run whole, jammed once, and confounded once | E |
| **w05-l2** Measurement | ✅ `meniscus-bench` | A graduated cylinder with a **draggable eye**. The sightline is drawn and the apparent reading genuinely changes with parallax, so a wrong eye height gives a wrong number until the student levels it. A balance beside it can be left untared, shifting every reading by the same amount | Three volumes read at eye level, systematic error found and fixed | B |

### Week 6 — Solubility of Matter

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w06-l1** Solubility: Solute and Solvent | ✅ `solubility-beaker` | Spoon sugar in and the particles visibly dissolve — until they stop and pile on the bottom. A temperature slider re-dissolves the pile and a solubility curve traces where you currently are. A stirrer and a crusher change only how *fast* it goes, and the curve does not move — which is the whole lesson | Unsaturated, saturated and supersaturated reached; rate changed without moving the curve | A |
| **w06-l2** Performance Task 2 | — | Task briefing — no signature widget | — | — |

### Week 7 — Concentration, Acids, Bases and Salts

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w07-l1** Concentration of Solutions | ✅ `dilution-jar` | Colour intensity driven by particles-per-volume, drawn as actual particles. Two separate controls — add solute, add water. Adding water pushes the particles apart and lightens the colour **without removing a single one**, and a live %m/m readout falls as it happens | Both routes to dilute found, target concentration hit | A |
| **w07-l2** Acids, Bases and Salts | ✅ `titration-drip` | A burette releases one drop at a time. The pH needle climbs, H⁺ and OH⁻ particles pair off into water on screen, the indicator flips at the endpoint, and salt crystals grow in the flask. Overshooting is allowed and shown | pH 7 reached and salt formed | B |

### Week 8 — The Science Laboratory

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w08-l1** Laboratory Instruments and Equipment | ✅ `equipment-bench` | A bench of instruments. Pick one up and it **does its job on screen** — the bunsen lights and its flame changes with the collar, the balance pan settles, the funnel filters a mixture into a clean filtrate, the microscope focuses | Every instrument operated | B |
| **w08-l2** Laboratory Rules and Safety Symbols | ✅ `hazard-cabinet` | Containers on a shelf. Open one and its symbol animates into what it actually does: corrosive eats a hole through a plate, flammable ignites, toxic spreads through a fish tank. A lab scene alongside has unsafe things actively happening — a flame creeping toward loose hair, a spill spreading — and tapping intervenes | Every symbol demonstrated, every hazard resolved | B · E |

### Week 9 — Performance Task 3

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w09-l1** Performance Task 3 | — | Task briefing — no signature widget | — | — |

### Week 10 — First Periodical Examination

No lessons. Examination week.

### Week 11 — The Microscope

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w11-l1** The Microscope: An Introduction | ✅ `focus-scope` | Coarse and fine knobs and an objective turret. The image is genuinely blurred and sharpens as you turn; coarse focus at high power drives the objective into the slide and cracks it. A coverslip can be lowered at a draggable angle, and lowering it flat traps bubbles you then have to look at | Sharp image at high power, slide intact, bubble-free mount | B |
| **w11-l2** The Importance of Microscope Discovery | ✅ `scope-through-time` | The same cork specimen through a 1665 lens, an 1830 achromat, a 1930s electron beam. Resolution genuinely improves as you scrub the years — blur and detail change, not the caption — and each instrument reveals the structure that was actually discovered with it | All three instruments used | D |

### Week 12 — The Cell

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w12-l1** The Cell Theory and Its Diversity | ✅ `scope-field` | A live field of cells swimming under the objective. Zoom in on any one and its interior resolves — or stays empty, which is the whole prokaryote/eukaryote distinction. Specialised cells are in the mix, each shaped for its job | Six cells inspected, both cell types found | A |
| **w12-l2** Parts and Function of the Cell | ✅ `cell-cutaway` | A cell with everything running: ribosomes assembling protein chains, mitochondria pulsing, vesicles travelling to the membrane, molecules bouncing off or slipping through. Switch one organelle off and the animation downstream stops | Every organelle switched off once | E |

### Week 13 — Plant and Animal Cell

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w13-l1** Plant and Animal Cell | ✅ `cell-morph` | *Built without GSAP* — the morph is slider-driven and the burst is a short one-shot timer, so a tween library earned nothing. One slider morphs an animal cell into a plant cell. Shared structures hold steady through the whole morph; unique ones grow in and label themselves as they appear. A second water slider then swells both — the plant cell stops firm against its wall, the animal cell bursts | Full morph both ways, both cells put in pure water | D · **G** |

### Week 14 — Cell Reproduction and the Cell Cycle

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w14-l1** Cell Reproduction | ✅ `surface-volume` | A single cell you can grow with a slider. Nutrients diffuse inward from the membrane as visible dots — and as the cell grows, the centre starves because volume outruns surface area. Hit divide and two smaller cells feed perfectly again | Cell grown to starvation and divided | A |
| **w14-l2** The Cell Cycle | ✅ `cycle-dial` | Scrub a circular G₁–S–G₂–M dial. Chromosomes physically duplicate as you pass through S, and a DNA-amount graph steps up with them. Damage the DNA and the G₂ checkpoint visibly halts the dial until it is repaired | Full cycle traversed, a checkpoint triggered | D |

### Week 15 — Cell Division

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w15-l1** Mitosis Cell Division | ✅ `mitosis-run` | *Built without GSAP* — every position is a pure function of the slider, so scrubbing backwards already runs it in reverse. A real animated mitosis the student scrubs frame by frame — chromosomes condensing, aligning on the plate, spindle fibres pulling, the cell pinching in two. A plant/animal switch changes the ending from cleavage furrow to cell plate | Full division scrubbed both ways, both cytokinesis types seen | C · **G** |
| **w15-l2** Meiosis Cell Division | ✅ `crossover-lab` | *Built without GSAP* — the gametes are recomputed from the crossover index, not tweened. Drag a crossover point along a tetrad. The four gametes that come out are visibly different **because of where the student dragged it**, and a live 2n → 2n → n → n counter shows exactly where the halving happens | Crossover performed, both divisions stepped, gametes compared | B · **G** |

### Week 16 — Science Fair and Fertilization

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w16-l1** Math and Science Fair | — | Task briefing — no signature widget | — | — |
| **w16-l2** Fertilization | ✅ `fusion-bench` | Drag two gametes together and watch them fuse, with the chromosome count adding up on screen. Drag a diploid cell in by mistake and watch the count come out wrong. The zygote then starts dividing on its own | Correct zygote formed, error explored | B |

### Week 17 — Asexual Reproduction

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w17-l1** Asexual Reproduction | ✅ `clone-bench` | Binary fission, budding, fragmentation and vegetative propagation, each running as a real animation on a real organism. A disease switch then sweeps the field, and because every organism is identical they all fall together | All four run, disease applied | C |

### Week 18 — Sexual Reproduction and Energy Flow

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w18-l1** Sexual Reproduction | ✅ `variation-batch` | Cross two parents and watch twelve offspring generate one by one, each visibly different — colour, size, pattern, all inherited from the mix. Fire the same disease from `clone-bench` at this varied field and watch some survive | A batch of twelve run, stress test survived | C |
| **w18-l2** Energy Flow in an Ecosystem | ✅ `energy-flow` | Energy travels as visible packets along the arrows. Reverse an arrow and the packets flow the wrong way and the chain starves in front of you — the classic arrow-direction error, made physical. Add links to turn the chain into a web, then remove one organism and watch the loss propagate | Chain built and correctly fed, web survived a removal | F |

### Week 19 — Energy Flow in the Circle of Life

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **w19-l1** Energy Flow in the Circle of Life | ✅ `ten-percent` | A thousand energy units enter as visible dots. At each trophic step ninety percent visibly peel off as heat and drift away, leaving a tenth to climb — so the pyramid shape builds itself. Alongside it, nutrient atoms take the other route: they leave a dead organism, pass through a decomposer, and return to the soil to be used again | Energy traced to the top, one nutrient atom followed full circle | F |
| **w19-l2** 3rd Performance Task | — | Task briefing — no signature widget | — | — |

### Week 20 — Second Periodical Examination

No lessons. Examination week.

---

## Verification

No test suite and no typecheck, so per `CLAUDE.md` the developer does the runtime testing.
Per wave:

1. `npm run lint && npm run build` — must exit 0. Warnings are fine, errors are not.
2. A **What to check** handoff naming the lesson page, the exact control to drive, what
   correct looks like, and the specific signs of failure.

Standing checks for every new widget:

- Something is moving the instant the block renders.
- The picture and its controls are the same height and both on screen at once, with no
  page scrolling between them.
- Narrow the window below 1024px — it stacks cleanly, with no horizontal scrollbar.
- Dark mode on every surface inside the widget.
- Tab to each slider; arrow keys move it.
- OS-level reduced motion on: a still frame, never a blank box.
- Edit the lesson as a teacher, save, reopen as a student — **the block must still be
  there** (`mergeWeeks` carry-over).
- Complete it; XP rises by 25. Reload; it stays complete and XP does not rise again.

---

## Adding one — the checklist

1. Write `interactive/widgets/<Name>Widget.jsx` taking `{ onSolved }`, using `SimLayout`.
2. Add one `lazy()` line to `interactive/signatureWidgets.js`.
3. Add a `signature: { widgetId, heading, intro, instruction, xp: 25 }` block to the lesson
   in `src/data/lessonsweek-NN.js`, next to `heroImageAlt`.
4. `npm run lint && npm run build`.
5. Update the Progress table above.
