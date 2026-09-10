# Per-Lesson Signature Simulations

One purpose-built, animated simulation per lesson, pinned to that lesson and owned by
developers rather than teachers.

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

**Shipped: 5 of 59.**

| Wave | Scope | Status |
|---|---|---|
| **0** | Infrastructure | ✅ Done — registry, host section, `SimLayout`, `LessonTemplate` + `LessonsDataContext` wiring |
| **1** | Weeks 1–3 (L1–L9) | 🟡 L1–L5 shipped · **L7, L8, L9 remain** |
| **2** | Weeks 4–7 (L10–L21) | ⬜ 12 to build |
| **3** | Weeks 8–11 (L22–L33) | ⬜ 12 to build |
| **4** | Weeks 12–15 (L34–L45) | ⬜ 12 to build |
| **5** | Weeks 16–20 (L46–L60) | ⬜ 14 to build |

### Shipped

| Lesson | Widget id | File |
|---|---|---|
| L1 | `model-gallery` | `widgets/ModelGalleryWidget.jsx` |
| L2 | `investigation-run` | `widgets/InvestigationRunWidget.jsx` |
| L3 | `globe-unroll` | `widgets/GlobeUnrollWidget.jsx` |
| L4 | `particle-lab` | `widgets/ParticleLabWidget.jsx` |
| L5 | `state-change-lab` | `widgets/StateChangeLabWidget.jsx` |

**Next session: L7, L8, L9** — see the Week 3 table. Read `ParticleLabWidget.jsx` (canvas
sim) and `ModelGalleryWidget.jsx` (SVG scenes) first; between them they demonstrate every
technique the remaining 54 need.

---

## Architecture (built and working — do not redesign)

### Attachment: a pinned `signature` field

A lesson object gains a sibling to `layout[]`:

```js
{
  id: "lesson-4",
  title: "Particle Theory of Matter",
  signature: {
    widgetId: "particle-lab",
    heading: "Watch It: A Box of Real Particles",
    intro: "Live particles with real speeds…",
    instruction: "Drive the sliders and watch all five behaviours happen",
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

Separate from `CUSTOM_WIDGETS` deliberately: that registry is rendered as a radio list in
the teacher's section picker, and 59 entries would make it unusable.

### Two wiring points, already done

1. **`LessonTemplate.jsx:515`** renders the block after `layout.map()`, before
   `<MaterialsPanel>`.
2. **`LessonsDataContext.jsx:85`** — `mergeWeeks()` carries `signature` from the static
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

## Six shapes, not 59 originals

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

## The 59 simulations

Shape letters refer to the table above. **G** = worth reaching for GSAP.

### Week 1 — Scientific Models ✅

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| ✅ **L1** Uses of Scientific Models | `model-gallery` | Four models actually working: a suspension bridge whose deck sags under a crossing truck with hangers tracking the curve, an atom with two orbiting electron shells, a population formula plotting itself year by year, a hurricane spinning along a track inside a widening forecast cone | All four run | B |
| ✅ **L2** Scientific Method | `investigation-run` | Two pots, one variable. Fourteen days play out — sun arcs over, stems climb a ruler, leaves unfold every 4 cm, the chart plots both curves live. Conclusion computed from the heights that came out | Full run completes | C |
| ✅ **L3** Models in Real Life | `globe-unroll` | A globe unrolls into a Mercator map. Same lat/long coastlines projected two ways and blended; Greenland genuinely inflates, and the "× too big" readout is a shoelace area measured off the shape on screen | Both ends reached | D |

### Week 2 — Particle Model of Matter ✅

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| ✅ **L4** Particle Theory of Matter | `particle-lab` | Canvas particles with real velocities and motion trails. Cold and they lock to a lattice and shiver; warm and they break loose but stay pooled; hot and they fly free filling the box | All five behaviours produced | A |
| ✅ **L5** Particle Nature of States | `state-change-lab` | A beaker on a burner. Hold to heat: lattice bonds stretch and snap, the thermometer **stalls at 0 °C and 100 °C**, bubbles form and rise while boiling. A vacuum pump forces sublimation and deposition | All six changes watched | B |

*`lesson-6` does not exist — week 2 has only lessons 4 and 5 after a content merge. The
unused `lesson6hero` import still sits at `src/data/lessonsweek-02.js:7`.*

#### Second interactives, via `customWidget`

`signature` is one per lesson and both week 2 lessons already use theirs, so a lesson that
earns a second simulation gets it as a `customWidget` block placed inside `layout[]`. Same
`{ onSolved }` contract, same `SimLayout`, same design rules — the only differences are
that the host is `CustomWidgetSection` (which *does* use `InteractiveFrame`, so the block
fades in on scroll) and that a teacher can move or delete it.

| Lesson | Widget id | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| ✅ **L4** | `pour-test` | 50 mL of water poured into 50 mL of alcohol measures about 96 mL. A dashed line marks where 100 mL would have reached; a magnifier lens zooms into the real simulated particles and the small alcohol beads are visibly sitting in the gaps between the large water ones. The vessel is a volumetric flask because only a narrow neck makes a 4 mL shortfall visible | Both poured full, shortfall read, magnifier used, partial mix compared | B |
| ✅ **L5** | `container-test` | Ice, water and steam moved between a beaker, a conical flask and a syringe. The liquid surface is found by integrating the container's own cross-section, so the same 40 mL genuinely stands twice as tall in the narrow syringe. The plunger compresses the gas and stops dead against the liquid | All three samples seen in all three containers, plunger pushed on gas and on liquid | B |

Register these in `interactive/customWidgets.js` (not `signatureWidgets.js`) — that registry
is the teacher's radio list, and a handful of entries keeps it usable.

### Week 3 — Changes in State of Matter — **next up**

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L7** Melting and Freezing | `heating-curve` | An ice cube on a hotplate, zoomed to the lattice. Heat goes in at a steady rate and the temperature-against-time graph **draws itself live**, so the flat plateau is something the student watches appear rather than a picture of a graph. Freeze it back and the curve retraces in reverse | Both plateaus drawn, both directions run | C |
| **L8** Evaporation and Condensation | `evaporation-race` | Two open dishes of water with particles visibly escaping the surface. Drag physical apparatus onto a dish — heat lamp, fan, wide dish, humidity lid — and watch the water-level bars diverge in real time | A dish emptied, all four factors used | A |
| **L9** Sublimation and Deposition | `dry-ice-bench` | A block of dry ice fuming on a bench, and a cold window growing frost crystals outward from seed points. A pressure dial moves the substance between routes so the liquid stage is visibly skipped | Both direct routes run | B |

### Week 4 — Scientific Investigation

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L10** Parts of an Investigation | `investigation-rig` | The investigation as a working machine: question, prediction, trial, data and conclusion are physical stages on a conveyor with material moving through them. Pull any stage out and the machine visibly jams at that point | Machine run whole, and jammed at least once | E |
| **L11** Variables and Controls | `confound-lab` | Two setups, and you can change more than one thing at a time. Cause-arrows are drawn from each change to the outcome, and with two changes the arrows visibly tangle so the result cannot be pinned on either | A clean single-variable run and a tangled one | A |
| **L12** Data Collection and Recording | `trial-bench` | A ball rolls down a ramp and is timed, again and again, with real scatter. Each run drops a dot onto a live dot plot; the mean line jitters wildly at three trials and settles by thirty | 30 trials run, mean settled | C |

### Week 5 — Measurement in Science

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L13** SI Units and Measurement Tools | `scale-zoom` | One continuous zoom from a millimetre to a kilometre. Real objects fade in at their true size as the scale reaches them — grain of sand, coin, desk, bus, field — and the sensible unit renames itself as you pass | Full range traversed | D |
| **L14** Measuring Length, Mass, Volume | `meniscus-bench` | A graduated cylinder with a **draggable eye**. The sightline is drawn and the apparent reading genuinely changes with parallax, so a wrong eye height gives a wrong number until the student levels it | Three volumes read at eye level | B |
| **L15** Accuracy, Precision, and Errors | `target-range` | A bow fires at a target. Two physical dials — sight offset for accuracy, hand wobble for precision — and the student produces each of the four groupings by driving them and watching where arrows land | All four groupings produced | A |

### Week 6 — Solutions and Solubility

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L16** Mixtures and Solutions | `tyndall-bench` | A laser fires through three beakers. The beam is invisible in the solution, scatters into a visible shaft in the colloid, and in the suspension the particles slowly settle into a layer while you watch | All three beams fired, settling watched | A |
| **L17** Solubility | `solubility-beaker` | Spoon sugar in and the particles visibly dissolve — until they stop and pile on the bottom. A temperature slider re-dissolves the pile, and a solubility curve traces where you currently are | Unsaturated, saturated and supersaturated all reached | A |
| **L18** Rate of Dissolving | `dissolving-race` | Two beakers with real apparatus: a stirrer that spins, a heater, and a crusher that visibly breaks a cube into smaller cubes. Sugar disappears faster on the side with more surface, heat and motion | All three factors isolated | A |

### Week 7 — Concentration of Solutions

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L19** What is Concentration? | `dilution-jar` | Colour intensity driven by particles-per-volume, drawn as actual particles. Two separate controls — add solute, add water. Adding water pushes the particles apart and lightens the colour **without removing a single one** | Both routes to dilute found | A |
| **L20** Measuring Concentration | `percent-bench` | A balance and a measuring cylinder you physically load. The pan tips, the meniscus rises, and %m/m, %m/v and ppm all recompute live from what is actually on the bench | Three targets hit | B |
| **L21** Dilution and Saturated Solutions | `dilution-bench` | Pour from a stock bottle into a flask and top up with water. The colour changes as you pour and a C₁V₁ = C₂V₂ bar rebalances live. Hit a target colour | Target hit within tolerance | B |

### Week 8 — Acids, Bases, and Salts

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L22** Properties of Acids and Bases | `indicator-bench` | Dip litmus into a beaker and watch the colour **wick up the paper** in real time. Four unknowns, two indicators, evidence gathered by dipping | All four tested with both indicators | B |
| **L23** The pH Scale | `ph-dial` | Drag a pH probe between real substances. The colour strip slides and the H⁺ particle density in the beaker changes with it, so "more acidic" is a visible crowd rather than a word | Full range swept, all three categories visited | D |
| **L24** Neutralization and Salts | `titration-drip` | A burette releases one drop at a time. The pH needle climbs, the indicator flips at the endpoint, and salt crystals grow in the flask. Overshooting is allowed and shown | pH 7 reached and salt formed | B |

### Week 9 — Laboratory Equipment

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L25** Common Laboratory Equipment | `equipment-bench` | A bench of instruments. Pick one up and it **does its job on screen** — the bunsen lights and its flame changes with the collar, the balance pan settles, the funnel filters a mixture into a clean filtrate | Every instrument operated | B |
| **L26** Using the Microscope | `focus-scope` | Coarse and fine knobs and an objective turret. The image is genuinely blurred and sharpens as you turn; coarse focus at high power drives the objective into the slide and cracks it | Sharp image at high power, slide intact | B |
| **L27** Proper Handling of Lab Materials | `handling-bench` | Carry acid, heat a test tube, waft a gas. Each action plays out physically — a tube pointed at a face erupts at that face, wafting delivers a safe whiff | Every action performed safely | E |

### Week 10 — Laboratory Safety

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L28** Laboratory Safety Rules | `hazard-scene` | A lab scene where the unsafe things are actively *happening* — a flame creeping toward loose hair, a spill spreading across the bench, a bag in a walkway. Tap to intervene and watch each resolve | All eight resolved | E |
| **L29** Safety Symbols and Hazards | `hazard-cabinet` | Containers on a shelf. Open one and its symbol animates into what it actually does: corrosive eats a hole through a plate, flammable ignites, toxic spreads through a fish tank | Every symbol demonstrated | B |
| **L30** Emergency Procedures | `emergency-drill` | A spill spreads across the floor in real time while the student acts. Right moves contain it; wrong moves let it reach the drain and keep spreading | All three emergencies contained | E |

### Week 11 — The Microscope

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L31** History and Parts of the Microscope | `scope-cutaway` | A cutaway compound microscope with **light physically travelling the path** — mirror to condenser to specimen to objective to eyepiece. Switch off any part and the beam breaks there and the image goes dark | Light path traced, every part interrupted | E |
| **L32** Using the Microscope Correctly | `scope-run` | The same scope, operated. Carry it one-handed and it drops; start at high power and the field is empty; skip the coverslip and the image swims | Clean run completed | B |
| **L33** Preparing Microscope Slides | `wet-mount` | Lower a coverslip at an angle you control with a drag. Lower it flat and air bubbles get trapped — then look through the scope at the bubbles you just made | Bubble-free mount produced | B · **G** |

### Week 12 — Cell Theory

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L34** Development of Cell Theory | `scope-through-time` | The same cork specimen through a 1665 lens, an 1830 achromat and an 1855 compound scope. Resolution genuinely improves as you scrub the years — blur and detail change, not the caption | All three instruments used | D |
| **L35** Prokaryotes and Eukaryotes | `scope-field` | A live field of cells swimming under the objective. Zoom in on any one and its interior resolves — or stays empty, which is the whole distinction | Six cells inspected | A |
| **L36** Cell Diversity | `cell-shape-lab` | Morph a generic cell toward nerve, muscle or root hair. A job-performance meter — signal distance, contraction force, water uptake — responds to the shape as it changes | All three shapes driven to peak | D |

### Week 13 — Cell Parts and Functions

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L37** Cell Membrane and Cell Wall | `gatekeeper` | Molecules of different sizes stream at a membrane. Small ones slip through, large ones bounce. Add a cell wall and watch what changes — and what does not | Selective permeability shown both ways | A |
| **L38** Nucleus and Cell Organelles | `cell-cutaway` | A cell with everything running: ribosomes assembling protein chains, mitochondria pulsing, vesicles travelling to the membrane. Switch one organelle off and the animation downstream stops | Every organelle switched off once | E |
| **L39** Cytoplasm and Cytoskeleton | `scaffold-test` | Remove one filament type at a time and watch the cell sag out of shape, transport stall mid-journey, or division fail halfway | All three roles broken | E · **G** |

### Week 14 — Plant and Animal Cells

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L40** Comparing Plant and Animal Cells | `cell-morph` | One slider morphs an animal cell into a plant cell. Shared structures hold steady through the whole morph; unique ones grow in and label themselves as they appear | Full morph both ways | D · **G** |
| **L41** Unique Structures in Plant Cells | `turgor-lab` | A water slider drives two linked scales at once — the vacuole swelling inside the cell, and the whole plant standing or wilting beside it. The wall visibly holds shape where an animal cell would burst | Turgid and flaccid both produced | A |
| **L42** Unique Structures in Animal Cells | `lysosome-bench` | Feed debris to a lysosome and watch it engulf and digest. Trigger the centrioles and watch a spindle assemble | Both structures run | E |

### Week 15 — Cell Reproduction: Mitosis

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L43** The Cell Cycle | `cycle-dial` | Scrub a circular G₁–S–G₂–M dial. Chromosomes physically duplicate as you pass through S, and a DNA-amount graph steps up with them | Full cycle traversed | D |
| **L44** Stages of Mitosis | `mitosis-run` | A real animated mitosis the student scrubs frame by frame — chromosomes condensing, aligning on the plate, spindle fibres pulling, the cell pinching in two | Full division scrubbed both ways | C · **G** |
| **L45** Importance and Applications | `wound-heal` | Cut a sheet of tissue and watch cells divide inward to close the gap. Flip a switch to runaway division and watch the same process pile into a tumour | Both outcomes run | A · **G** |

### Week 16 — Cell Reproduction: Meiosis

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L46** Introduction to Meiosis | `chromosome-counter` | Step through both divisions with the chromosomes physically halving and a live 2n → 2n → n → n counter beside them, so *where* the halving happens is something you watch | Both divisions stepped | C |
| **L47** Stages of Meiosis | `crossover-lab` | Drag a crossover point along a tetrad. The four gametes that come out are visibly different **because of where the student dragged it** | Crossover performed, gametes compared | B · **G** |
| **L48** Comparing Mitosis and Meiosis | `side-by-side-run` | Both processes run in parallel from the same starting cell, in step. Daughter cells line up at the end for a direct visual comparison | Both run to completion | C · **G** |

### Week 17 — Fertilization and Reproduction

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L49** Fertilization | `fusion-bench` | Drag two gametes together and watch them fuse, with the chromosome count adding up on screen. Drag a diploid cell in by mistake and watch the count come out wrong | Correct zygote formed, error explored | B |
| **L50** Sexual Reproduction | `variation-batch` | Cross two parents and watch twelve offspring generate one by one, each visibly different — colour, size, pattern, all inherited from the mix | A batch of twelve run | C |
| **L51** Asexual Reproduction | `clone-bench` | Binary fission, budding, fragmentation and vegetative propagation, each running as a real animation on a real organism | All four run | C |

### Week 18 — Types of Reproduction Compared

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L52** Sexual vs. Asexual Reproduction | `population-race` | Two populations grow generation by generation as visible organisms filling a field. The clones fill it faster, which sets up L53 | Race run to completion | C |
| **L53** Advantages and Disadvantages | `stress-test` | Fire a disease or a drought at those same two fields. The clonal population — every organism identical — dies together; the varied one loses some and recovers | Both stressors applied | C |
| **L54** Examples in Nature | `field-bench` | A pond and garden scene. Tap any organism and it reproduces on screen by its own method — strawberry runners creep, hydra buds, a sea star regrows an arm. Several do both | Every organism run | B |

### Week 19 — Food Chains and Food Webs

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L55** Producers, Consumers, Decomposers | `ecosystem-jar` | Stock a sealed jar and run it. Leave out decomposers and dead matter visibly piles up until it chokes; leave out producers and everything starves | A jar run to a stable state | F |
| **L56** Food Chains | `energy-flow` | Energy travels as visible packets along the arrows. Reverse an arrow and the packets flow the wrong way and the chain starves in front of you — the classic arrow-direction error, made physical | Chain built and correctly fed | F |
| **L57** Food Webs | `web-collapse` | Remove one organism and watch the loss propagate node by node, populations swelling and crashing along every connected path | Three removals explored | F · **G** |

*`src/data/lessonsweek-19.js` is corrupted by a bad find/replace — every "Web"/"web" became
the literal string `null` (`"Food Chains and Food nulls"`, `"Food nulls"`, and two alt-text
strings). Fix that before L57 ships.*

### Week 20 — Energy Flow and Biological Organization

| Lesson | Widget | What runs on screen | Done when | Shape |
|---|---|---|---|---|
| **L58** Energy Pyramid | `ten-percent` | A thousand energy units enter as visible dots. At each trophic step ninety percent visibly peel off as heat and drift away, leaving a tenth to climb — so the pyramid shape builds itself | Energy traced to the top | F |
| **L59** Levels of Biological Organization | `zoom-ladder` | One continuous zoom from atom to biosphere through all nine levels, each resolving into the next and naming itself as it comes into view | All nine levels passed | D · **G** |
| **L60** Ecosystem Interactions | `interaction-tank` | Put two organisms in a tank and run it. Watch what actually happens between them over time — one feeds, one shelters, one starves — and the relationship names itself from the outcome | All five relationships produced | C |

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
5. Update the Progress table above and add a `VERSIONS.md` entry.
