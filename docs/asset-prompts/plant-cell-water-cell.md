# Codex asset prompt — Plant Cell, Level 2 close-up cell ("Keep It Alive")

Add-on to [plant-cell.md](plant-cell.md). Same raster pipeline, same painted
style, same palette. Level 2's cell close-up
([WaterCell.jsx](../../src/games/plant-cell/ui/WaterCell.jsx)) is still flat SVG
shapes; these PNGs replace them.

**Why the set is split the way it is:** the cell *animates*. As water goes
0 → 100 % the membrane grows from 158 × 88 to 218 × 148 (viewBox units) and the
vacuole scales from a speck to fill it. A single painted "whole cell" image
cannot do that without smearing. So every moving part is its own sprite, drawn
**simple enough to be stretched**. Where the look must change (not just the
size), there are two or three **keyframes on an identical canvas** that the code
crossfades while it scales. Keyframes only work if they line up pixel for pixel.

## Where each asset is consumed

| File (`public/games/plant-cell/art/`) | Status | Replaces |
|---|---|---|
| `cell-wall.png` | **reuse, do not regenerate** | wall `<rect>` — [WaterCell.jsx:42](../../src/games/plant-cell/ui/WaterCell.jsx#L42). Never moves. |
| `nucleus.png` | **reuse** | nucleus `<circle>` — [WaterCell.jsx:49](../../src/games/plant-cell/ui/WaterCell.jsx#L49), [:81](../../src/games/plant-cell/ui/WaterCell.jsx#L81) |
| `chloroplast-idle.png` | **reuse** | `CHLOROPLAST_SPOTS` ellipses — [WaterCell.jsx:50](../../src/games/plant-cell/ui/WaterCell.jsx#L50) |
| `water-membrane-turgid.png` | new | membrane + cytoplasm `<rect>` — [WaterCell.jsx:45](../../src/games/plant-cell/ui/WaterCell.jsx#L45), water ≥ 40 % |
| `water-membrane-plasmolysed.png` | new | same `<rect>`, crossfaded in as water drops below 40 % |
| `water-vacuole-full.png` / `-half.png` / `-shrivelled.png` | new | vacuole `<rect>` — [WaterCell.jsx:46](../../src/games/plant-cell/ui/WaterCell.jsx#L46) |
| `turgor-arrow.png` | new | "turgor pressure pushes out" text — [WaterCell.jsx:54](../../src/games/plant-cell/ui/WaterCell.jsx#L54) (text stays as a caption, the arrows animate) |
| `animal-cell-normal.png` / `-swollen.png` | new | animal `<ellipse>` — [WaterCell.jsx:70](../../src/games/plant-cell/ui/WaterCell.jsx#L70) |
| `animal-cell-burst.png` | new | the burst state of that ellipse — [WaterCell.jsx:76-79](../../src/games/plant-cell/ui/WaterCell.jsx#L76-L79) |
| `cell-fragment.png` | new | the 7 pink `<circle>`s — [WaterCell.jsx:84](../../src/games/plant-cell/ui/WaterCell.jsx#L84) |
| `particle-water.png` | **reuse** | any water-in / water-out motes |

The labels ("cell wall", "central vacuole", "PLANT CELL", "BURST") stay as SVG
text in code, never in the art.

---

## Paste from here into Codex

You are generating extra 2D game art for **SciQuest**, a Grade 7 science web app,
game *Plant Cell: Keep the Cell Alive*. This batch is for **Level 2**: a close-up
of one plant cell whose central vacuole fills with water (the plant stands up)
and empties (the plant wilts, and in salty water the inside of the cell pulls
away from the wall). Beside it is an animal cell that swells in pure water until
it bursts.

**Style reference — attach these existing images and match them exactly:**
`full-cell.png` (the whole look), `cell-wall.png`, `vacuole-full.png`,
`nucleus.png`, `chloroplast-idle.png`. Your images are layered on top of those in
the same scene, so they must look like one artist drew them all.

### Global rules — apply to every image below

- **Format:** PNG, **transparent background**, no backdrop, no ground shadow, no
  border, no text, no labels, no watermark. If the model cannot do alpha, render
  on flat `#FF00FF` and I will key it out.
- **Style:** painted flat-vector hybrid, as in the references. Clean readable
  silhouette, one soft interior gradient plus one soft highlight, a slightly
  darker rim instead of a black outline. Friendly, textbook-like. Not photoreal,
  not a microscope photo, not 3D, no faces.
- **Light:** one soft light from the upper left, no cast shadows.
- **Camera:** flat, straight on, no perspective.
- **These sprites get stretched and scaled at runtime.** Keep edges smooth, rims
  thin, and textures soft and low-contrast. No fine repeating detail (no bead
  rows, no hatching, no sharp speckles), because it smears when stretched.
- **Keyframe sets** (called out below) must share **the exact same canvas size,
  centre point and outer footprint**. Draw the first image, then edit it into
  the others. Do not redraw from scratch. The game crossfades them, so any
  drift shows as a double outline.
- Must read on **both** a cream `#FBF5E7` and a near-black `#0C0A09` page.
- Generate large, then downscale to the export size given.

### Palette — use these exact colours

| Thing | Hex |
|---|---|
| cell membrane rim | `#2F7D5C` |
| cytoplasm healthy / water-starved | `#DFF0E2` / `#E8E3CF` |
| vacuole / its rim | `#BFE3F2` / `#4F9EC4` |
| water | `#5AA9E6` |
| animal cytoplasm | `#FDE8D7` |
| animal membrane rim | `#B45309` |
| turgor / pressure | `#F08A4B` |
| damage / burst | `#D1544F` |

---

### 1. Plant cell membrane — keyframe pair, export each at 1240 × 840

The rounded rectangle just inside the cell wall. The game shrinks it away from
the wall as water is lost, so it has to stretch cleanly.

1. **`water-membrane-turgid.png`**: a rounded rectangle filling the canvas with
   ~4 % padding, corner radius about 1/8 of the width. Pale `#DFF0E2` cytoplasm
   fill with a very faint soft mottle. **Thin, smooth** `#2F7D5C` rim, about
   1.5 % of the width, with no bead or lipid texture. Edges taut and even: a
   well-watered cell pressing outward.
2. **`water-membrane-plasmolysed.png`**: **the same image, edited.** Same
   canvas, same centre, same overall footprint. Cytoplasm dulled to `#E8E3CF`,
   the rim gently puckered and wavy (soft, shallow wrinkles, not jagged), the
   corners slightly more rounded and sagging. A cell that has lost water.

### 2. Central vacuole — keyframe trio, export each at 512 × 384

Scaled from a speck up to most of the cell. Draw each one **filling its canvas
with ~8 % padding**; the game handles the size. All three share one canvas and
centre.

3. **`water-vacuole-full.png`**: a plump, tight, smoothly rounded water sac,
   `#BFE3F2` body, thin `#4F9EC4` rim, one large soft white highlight upper
   left, a faint inner ripple. It looks under pressure.
4. **`water-vacuole-half.png`**: **edit of #3.** Same footprint, softer and
   slightly slumped, rim relaxed into two gentle dents, highlight smaller.
5. **`water-vacuole-shrivelled.png`**: **edit of #4.** Same footprint, clearly
   deflated: rim wrinkled into several soft folds, body a little greyer and less
   see-through, highlight almost gone.

### 3. Turgor arrow — export at 128 × 128

6. **`turgor-arrow.png`**: one short, chunky, rounded arrow pointing **right**,
   `#F08A4B` with a slightly darker rim and a soft highlight, centred, long axis
   horizontal. The game rotates it to four sides of the vacuole and pulses it
   outward when the cell is full, so it must be symmetric top to bottom and
   evenly lit.

### 4. Animal cell — export #7–8 at 512 × 384, #9 at 768 × 576

An animal cell has **no cell wall**, only a flexible membrane. The game scales
it up as it takes in water.

7. **`animal-cell-normal.png`**: a soft, slightly irregular oval cell filling
   the canvas with ~8 % padding. `#FDE8D7` cytoplasm with faint soft mottle, thin
   smooth `#B45309` membrane rim. **No nucleus** (the game places `nucleus.png`
   on top). Relaxed and squishy.
8. **`animal-cell-swollen.png`**: **edit of #7.** Same canvas and centre, but
   the outline pushed out to a near-perfect taut oval touching the ~4 % padding.
   Rim thinner and stretched, a glossy tight highlight, cytoplasm paler as if
   diluted. A cell about to pop. The game crossfades #7 → #8 as it fills.
9. **`animal-cell-burst.png`**: the moment after bursting, on a larger canvas so
   pieces can fly out. A broken ring of torn `#B45309` membrane shreds arranged
   roughly where the swollen oval was, gaps between them, ragged torn ends, a
   few `#FDE8D7` cytoplasm splashes and small `#5AA9E6` water droplets spraying
   outward, a subtle `#D1544F` tint on the torn edges. **The centre must be
   empty and transparent.** Keep it readable, not gory.

### 5. Flying fragment — export at 64 × 64

10. **`cell-fragment.png`**: one small curled shred of torn `#B45309`-rimmed
    `#FDE8D7` membrane, no direction implied. The game throws seven copies
    outward and spins them.

### Delivery

- One PNG per file name above, named exactly as written. The code loads them
  by filename.
- Keyframe files in a set must be the same pixel size with the subject in the
  same place. Check them by toggling between them before sending.
- Each file ≤ 80 KB after compression (`oxipng` / `pngquant`), whole batch
  ≤ 500 KB.

---

## After the assets land (code handoff)

Everything stays in [WaterCell.jsx](../../src/games/plant-cell/ui/WaterCell.jsx)'s
320 × 220 viewBox. The existing geometry maths (`gap`, `mx/my/mw/mh`, `vw/vh`,
`rx/ry`) already describes the animation. Each shape just becomes
`<image href="/games/plant-cell/art/<name>.png" preserveAspectRatio="none" …>`
at the same x/y/width/height.

1. **Wall:** `cell-wall.png` at `x=40 y=26 w=240 h=170`, static.
2. **Membrane:** both membrane images at `mx/my/mw/mh`. Opacity of
   `-plasmolysed` = `clamp((40 - water) / 30, 0, 1)`, `-turgid` = the rest.
3. **Vacuole:** the three vacuole images at the `vw/vh` box. Crossfade
   shrivelled → half over 0–50 % water and half → full over 50–100 %.
4. **Turgor arrows:** four `turgor-arrow.png` copies around the vacuole
   (0°, 90°, 180°, 270°), shown when `fill >= 0.95`, pulsed with a CSS
   `transform`/`opacity` keyframe that is switched off under
   `prefers-reduced-motion`.
5. **Nucleus / chloroplasts:** `nucleus.png` and `chloroplast-idle.png` at the
   current circle/ellipse centres, drawn after the vacuole.
6. **Animal cell:** both images at the `rx/ry` box, crossfaded over 60–100 %
   water. On `burst`, swap to `animal-cell-burst.png` and send seven
   `cell-fragment.png` copies outward on the existing angle maths.
