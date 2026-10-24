---
name: refine-interactive
description: Refine a lesson's interactive section: richer illustration, far less text, and a whole-section card flip that reveals the explanation once the activity is finished.
argument-hint: "[lesson id, widget id, or slot type, e.g. l4, particle-lab, sortBuckets]"
---

Refine one interactive section at a time so a Grade 7 student can look at it,
know what to do in one line, play with it, and only then read why it mattered.

## What this skill applies to

Three hosts render interactives. Everything below applies to all three:

| Host | File | What it renders |
| --- | --- | --- |
| `InteractiveFrame` slots | `src/components/lesson-slots/interactive/` | `flipCards`, `quickCheck`, `hotspot`, `sortBuckets`, `dragLabel`, `customWidget` |
| Signature widgets | `src/components/lesson-slots/interactive/widgets/` | one pinned simulation per lesson, registered in `signatureWidgets.js` |
| Teacher widgets | same `widgets/` folder, registered in `customWidgets.js` | teacher-placeable widgets |

Presentational slots (`intro`, `timeline`, `comparison`, …) are **out of scope**.
Do not add flips, illustrations, or completion state to them.

`src/games/matter-state-sandbox/` and its CSS blocks in `src/index.css` are
off-limits. See the Don't-Touch section of CLAUDE.md.

## The three goals

1. **Illustration carries the meaning.** The picture should show the thing, in
   enough detail that a student could describe it without reading anything.
2. **The front holds instructions only.** Explanation text is not deleted, it
   moves to the back of the card.
3. **Finishing unlocks the flip.** Once the block reports complete, clicking the
   section turns it over and the back explains what the student just did.

---

## Step 0. Pick the target and read it first

If the argument names a lesson (`l4`, `week-02 lesson 1`), find its `signature`
block in `src/data/lessonsweek-*.js` and every interactive entry in its
`layout[]`. If it names a widget id, go straight to that widget file. If nothing
is named, ask which lesson to work on. Never refine all of them at once; one
section per pass keeps the diff reviewable.

Read the widget/slot file end to end before editing. Note:

- where its copy lives (hardcoded in the widget, or in `src/data/lessonsweek-*.js`),
- what its completion condition is (what sets `onSolved` / `isComplete`),
- what it draws with (canvas, inline SVG, or DOM boxes).

---

## Step 1. Build the flip shell if it does not exist yet

The flip is **one shared component**, not a per-widget reimplementation. Check
for `src/components/lesson-slots/interactive/ExplainerFlip.jsx`. If it is
missing, build it to this contract before touching any widget.

```
<ExplainerFlip explainer={{ title, points: [] }} unlocked={isComplete}>
  …the whole existing card…
</ExplainerFlip>
```

Required behaviour:

- **Never unmounts the front.** The front face stays mounted and keeps its
  state; flipping only rotates it out of view. Unmounting would wipe a student's
  canvas/simulation state.
- **Locked until complete.** With `unlocked={false}` it renders children
  untouched: no hint, no pointer affordance, no flip.
- **Unlocked affordance.** Once `unlocked` flips true, show a real `<button>`
  strip at the foot of the card: "What just happened?" with a rotate icon. That
  button is the keyboard route; the card-level click is the convenience route.
- **Whole-card click that does not eat controls.** The card-level `onClick`
  returns early when the event came from a control:
  `if (e.target.closest('button, a, input, select, textarea, label, canvas, svg, [role="button"], [draggable="true"]')) return`.
  A student must still be able to press Reset or re-run the sim after finishing.
- **Height without magic numbers.** Both faces occupy the same CSS grid cell
  (`grid-area: 1 / 1`) so the container is as tall as the taller face. Never
  hardcode a pixel height, these sections range from 200px to 62vh.
- **The hidden face is really hidden.** Apply `aria-hidden` and `inert` to the
  face that is turned away, so Tab never lands on an invisible slider.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` the faces cross-fade
  instead of rotating. Handle it in CSS, matching the media-query style already
  used in `src/index.css`.
- **Back to the front.** The back has a "Back to the activity" button, and a
  click anywhere on the back returns too.
- **Not assessment.** The flip never awards XP, never reports completion, and
  never gates lesson progress. It is a reveal, nothing more.

Styles go in `src/index.css` as an `.sq-explain-flip*` block, modelled on the
existing `.sq-flip` rules (perspective on the wrapper, `transform-style:
preserve-3d` on the inner, `backface-visibility: hidden` on the faces). Do not
edit the `.sq-flip` rules themselves, `FlipCardsSection` depends on them.

Wire it in **two places only**:

- `InteractiveFrame.jsx`: wrap the `<Card>` it already renders, reading
  `explainer` and `isComplete` from the props it already receives.
- `SignatureWidgetSection.jsx`: wrap its `<Card>`, reading
  `signature.explainer` and its `solved` state.

That covers every interactive in the app. Individual widgets should not import
`ExplainerFlip`.

---

## Step 2. Make the illustration more detailed

Aim: the drawing looks like the real object, not like a diagram of the idea.

- **Fill the stage. No dead space.** The stage column is about 16:10 and its
  exact shape moves with the viewport, so a scene authored at any other ratio
  gets bars of empty gradient above and below it (or down both sides). Fixing it
  has three parts, all required:
  1. Author the scene at roughly **16:10** (620 x 390 is the house size). Do not
     leave a 2:1 strip and hope it stretches.
  2. Let the ground, sky, water or paper **bleed past the viewBox** on every
     side (a `BLEED` of about 60 units), and put no label, readout or legend in
     that margin, because it can be cropped.
  3. Render it with `preserveAspectRatio="xMidYMid slice"`, `style={stageFill(W, H)}`
     from `stageMedia.js`, and `<Stage bleed>`. That covers the frame the way
     `background-size: cover` does, and `stageFill`'s `aspect-ratio` is what
     stops the picture collapsing on a phone, where the row has no fixed height.

  Never reach for `preserveAspectRatio="none"` (it distorts the drawing) or a
  hardcoded pixel height on the stage.
- **Add structure, not decoration.** A beaker gets a rim, a lip, graduation
  marks, a meniscus, and a shadow on the bench. Each part is something the
  lesson refers to. A glow or gradient that names nothing is noise.
- **Show state changes in the drawing.** If a control changes something, the
  picture must visibly change: position, count, colour or posture, not just a
  readout number.
- **Label inside the picture** with short text tied to the part it names, so the
  explanation can stay on the back.
- **Stay theme-safe.** Pick colours that read on both `#FAF7F2` cream and
  `stone-900`. The state palette in CLAUDE.md's Visual Design Spec (solid
  `#A8C8F0`–`#DDEEFF`, liquid `#3BAFA9`–`#7BC9CF`, gas `rgba(200,220,255,0.4)`)
  is for canvas and badges only. Never hardcode a UI colour, use Tailwind tokens
  or CSS variables.
- **Colour is never the only signal.** Every state needs a text label too.
- **No new dependencies.** Inline SVG or the existing canvas loop. Never import a
  library for one shape.
- **Never interpolate a Tailwind class** (bg-${c}-50). Tailwind v4, no safelist,
  so use a static map of complete class strings, as `FlipCardsSection` does.
- **Animate `transform` and `opacity` only**, and honour `reducedMotion` /
  `prefers-reduced-motion` by rendering the end state without the tween.
- Keep the canvas/SVG inside the existing `SimLayout` `<Stage>` so the picture
  and its controls stay on one screen.

---

## Step 3. Put the front on a text diet

Rewrite the front copy to these budgets. If a line exceeds them, it belongs on
the back or nowhere.

| Slot | Budget |
| --- | --- |
| `heading` | ≤ 6 words, names the activity |
| `intro` | delete it, or one sentence ≤ 12 words |
| `instruction` | one imperative sentence ≤ 12 words: "Drag each label onto the right part." |
| Control label | ≤ 3 words |
| Readout | a number plus a unit plus at most 2 words |
| In-picture label | ≤ 4 words |
| Hint (per step) | ≤ 14 words, and only shown when the student is stuck |

Reading level: sentences under 15 words, everyday words over technical ones, one
idea per sentence. Introduce a science term only when the activity needs it, and
gloss it in three words the first time.

**No em dashes.** Not in anything a student reads, not in `explainer` points, not
in labels, readouts or headings, and not in the code comments either. They are a
tell, and a Grade 7 reader trips over them. Use a comma for an aside, a colon
before an explanation, or a full stop where the thought actually ends. The same
goes for the en dash used as punctuation; a real range (`4-16 h`) is fine.

Delete outright: restatements of the heading, "In this activity you will…"
preambles, anything explaining a result before the student has produced it, and
paragraph-length `note` strings attached to states. Those become back-of-card
points.

---

## Step 4. Write the back of the card

The back answers "what did I just do, and why did it matter". Shape:

```js
explainer: {
  title: 'Why the particles spread out',        // ≤ 7 words
  points: [
    'Pushing the heat past 100 °C…',            // ≤ 20 words each
  ],                                            // 2–4 points, ≤ 70 words total
}
```

Rules:

- Past tense, about what the student *did*, not about the topic in general:
  "When you pushed the temperature past 100 °C, the gaps opened up."
- Reuse the sentences you just removed from the front. Compress, don't invent.
- Each point ties to something the student could see happen on screen.
- No new vocabulary that never appeared on the front.
- Never put the instructions on the back. Instructions stay on the front where a
  student reading them can still act.

Where the object lives:

- Signature widgets → `signature.explainer` in `src/data/lessonsweek-*.js`, next
  to `instruction` and `xp`.
- Slot interactives → `data.explainer` on the slot entry, plus an
  `explainer: { title: '', points: [''] }` default in `DEFAULT_SLOT_DATA`
  (`src/components/lesson-slot-forms/index.js`) and a small title + points editor
  in that slot's form, so teachers can edit it. Follow the shape of the existing
  forms in that folder.
- A missing or empty `explainer` must render exactly as before: no flip, no
  affordance. Half-migrated lessons stay correct.

---

## Step 5. Verify and hand off

Per CLAUDE.md, **the developer does the testing.** Do not start the dev server,
drive a browser, or take screenshots.

1. Run the gate: `npm run lint && npm run build`. Fix every error it surfaces by
   editing the source. Warnings are fine, errors are not.
2. Append a new `VERSIONS.md` entry, one past the highest number, ending with its
   own `Commit:` line.
3. Report back:
   - **Where**: clickable `file:line` links for the widget, the flip shell, and
     the data entry you edited.
   - **How to edit it by hand**: name the `explainer.title` / `points` entry,
     the `instruction` string, and the flip's timing values, and say what
     changing each one does. For anything positional, give the property, its
     value, and which direction each way moves it.
   - **What to check**: the exact screen, what a correct result looks like, and
     the specific signs it is broken. Cover at least: the section before
     completion (no flip affordance), right after completion (affordance
     appears), clicking the card body (flips), clicking Reset while unlocked
     (resets, does not flip), Tab order while flipped, and the section at
     phone width.

## Non-negotiables

- One section per pass.
- Interactives are practice, not assessment. Never touch achievements,
  `quiz_attempts`, or the gradebook.
- No `console.log` in committed code.
- Tap targets ≥ 44px, keyboard access for everything, visible focus, 4.5:1
  contrast.
- Don't refactor neighbouring code while you are in the file.
