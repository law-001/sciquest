# Codex asset prompt — Plant Cell: Keep the Cell Alive

**Raster, not vector.** These assets come out of Codex's *image generation*
model as PNGs with real painted shading. The game currently draws plain SVG
shapes inline; each PNG below replaces one of those shapes.

Image models take **one prompt per image** and cannot lay out a labelled sprite
sheet, so every sprite is its own file. Generate them in the order listed and
**feed the previous image back in as a style reference** for the next one —
that is what keeps the set looking like one artist made it.

## Where each asset is consumed

**Cell view** — [CellView.jsx](../../src/games/plant-cell/ui/CellView.jsx):

| File (final path) | Replaces |
|---|---|
| `public/games/plant-cell/art/cell-wall.png` | the two `<rect>` wall strokes — [CellView.jsx:180](../../src/games/plant-cell/ui/CellView.jsx#L180) |
| `.../membrane-healthy.png`, `.../membrane-wilted.png` | the cytoplasm `<rect>` — [CellView.jsx:191](../../src/games/plant-cell/ui/CellView.jsx#L191) |
| `.../vacuole-full.png`, `.../vacuole-slack.png` | the vacuole `<ellipse>` pair — [CellView.jsx:203](../../src/games/plant-cell/ui/CellView.jsx#L203) |
| `.../nucleus.png` | the nucleus circles — [CellView.jsx:220](../../src/games/plant-cell/ui/CellView.jsx#L220) |
| `.../chloroplast-{idle,active,damaged}.png` | `<Chloroplast>` — [CellView.jsx:66](../../src/games/plant-cell/ui/CellView.jsx#L66) |
| `.../mitochondrion-{idle,active,damaged}.png` | `<Mitochondrion>` — [CellView.jsx:88](../../src/games/plant-cell/ui/CellView.jsx#L88) |
| `.../ribosome-cluster.png` | the `RIBOSOME_SPOTS` `<circle>`s — [CellView.jsx:225](../../src/games/plant-cell/ui/CellView.jsx#L225) |
| `.../particle-{sunlight,water,co2,glucose,oxygen}.png` | the `Stream` `<circle>` — [CellView.jsx:41](../../src/games/plant-cell/ui/CellView.jsx#L41) |

**Object view** — [PlantView.jsx](../../src/games/plant-cell/ui/PlantView.jsx), the
whole potted plant, reached from the "Whole plant" tab in
[ViewTabs.jsx:6](../../src/games/plant-cell/ui/ViewTabs.jsx#L6):

| File (final path) | Replaces |
|---|---|
| `.../room-wall.png` | the room background `<rect>` + floor band — [PlantView.jsx:156](../../src/games/plant-cell/ui/PlantView.jsx#L156) |
| `.../window.png`, `.../sun.png` | the window group and its sun — [PlantView.jsx:159](../../src/games/plant-cell/ui/PlantView.jsx#L159) |
| `.../sunbeam.png` | the beam `<path>` — [PlantView.jsx:189](../../src/games/plant-cell/ui/PlantView.jsx#L189) |
| `.../leaf-healthy.png`, `.../leaf-wilted.png` | `<Leaf>` — [PlantView.jsx:78](../../src/games/plant-cell/ui/PlantView.jsx#L78) |
| `.../pot.png`, `.../soil-dry.png`, `.../soil-wet.png` | the pot group — [PlantView.jsx:212](../../src/games/plant-cell/ui/PlantView.jsx#L212) |
| `.../leaf-surface.png`, `.../guard-cell.png` | the stomata close-up — [PlantView.jsx:241](../../src/games/plant-cell/ui/PlantView.jsx#L241) |
| `.../particle-vapour.png` | the vapour `Flow` — [PlantView.jsx:54](../../src/games/plant-cell/ui/PlantView.jsx#L54) |

**Shared:**

| File (final path) | Replaces |
|---|---|
| `src/assets/plantcell.png` | `thumbnail` in [registry.js:144](../../src/lib/games/registry.js#L144) — already a PNG, overwrite it so the card matches the new set |

Achievement medals `sun-catcher` / `water-keeper` / `cell-medic` already ship as
SVG in `public/achievements/` and stay SVG — the medal frame has to match the
other 25 medals exactly. **Do not regenerate them as images.**

---

## Paste from here into Codex

You are generating 2D game art for **SciQuest**, a Grade 7 science web app. The
game is *Plant Cell: Keep the Cell Alive*. It has two views of the same plant:
a **cell view** (a stylised plant cell seen from inside, where organelles react
as the player runs photosynthesis, balances water and repairs a broken
organelle) and an **object view** (the whole potted plant beside a window, which
brightens, drinks and wilts as the same sliders move). The player flips between
the two at any time, so **both halves must look like one set** — same brush,
same palette, same light. Sections 1–3 are the cell view, section 4 is the
object view, section 5 is the store thumbnail.

### Global rules — apply to every image below

- **Format:** PNG, **transparent background**, no baked backdrop, no ground
  shadow, no card, no border, no text, no watermark, no label.
  If the model cannot do alpha, render on flat `#FF00FF` and I will key it out.
- **Style:** painted flat-vector hybrid — clean readable silhouette, one soft
  interior gradient plus one specular highlight, a slightly darker rim rather
  than a hard black outline. Warm, friendly, textbook-adjacent. **Not**
  photoreal, not microscope photography, not a 3D render, not glossy plastic,
  no cartoon faces or eyes.
- **Lighting is identical in every image:** one soft light from the upper left,
  no cast shadows.
- **Camera is identical in every image:** flat straight-on view, no perspective,
  no tilt.
- Subject centred, ~10% empty padding on all sides, long axis horizontal (the
  game rotates these sprites, so nothing may depend on the sprite's own angle).
- Must read on **both** a cream `#FBF5E7` and a near-black `#0C0A09` page — so
  no white-only or near-black-only fills, and nothing that relies on the page
  colour showing through.
- Generate at 1024 × 1024, then downscale to the export size given per asset.

### Palette — use these exact colours

| Thing | Hex |
|---|---|
| cell wall / wall shade | `#7D9B4E` / `#5D7A34` |
| cell membrane | `#2F7D5C` |
| cytoplasm healthy / wilted | `#DFF0E2` / `#E8E3CF` |
| chloroplast / its rim | `#3F9B56` / `#2B6C3C` |
| vacuole / its rim | `#BFE3F2` / `#4F9EC4` |
| nucleus / its rim | `#C8B6E2` / `#7B5EA7` |
| mitochondrion / its rim | `#E08A5F` / `#A9532C` |
| ribosome | `#6F6553` |
| sunlight | `#F5C84A` |
| water | `#5AA9E6` |
| carbon dioxide | `#9AA0A6` |
| glucose | `#F08A4B` |
| oxygen | `#3BAFA9` |
| damage / fault | `#D1544F` |

---

### 1. Organelles — export each at 256 × 256

Generate `chloroplast-idle.png` first, then use it as the style reference for
everything after it.

1. **`chloroplast-idle.png`** — a lens/pill-shaped chloroplast lying horizontal,
   body `#3F9B56` with a `#2B6C3C` rim, three or four darker green stacked disc
   bundles (grana) inside, one soft highlight along the upper-left edge.
2. **`chloroplast-active.png`** — the same chloroplast, same size and pose, now
   photosynthesising: a warm `#F5C84A` glow rim around it and the grana lit
   slightly brighter. Nothing else changes.
3. **`chloroplast-damaged.png`** — the same chloroplast desaturated to a grey
   green, grana faded, two `#D1544F` fracture lines crossing the body.
4. **`mitochondrion-idle.png`** — a horizontal bean-shaped mitochondrion, body
   `#E08A5F` with an `#A9532C` rim and a folded inner membrane (cristae) drawn
   as a wavy ribbon running the length of the bean.
5. **`mitochondrion-active.png`** — the same bean with a warm `#F08A4B` energy
   glow rim and brighter cristae.
6. **`mitochondrion-damaged.png`** — the same bean desaturated, cristae torn and
   broken, `#D1544F` fracture lines.
7. **`nucleus.png`** — a round nucleus, `#C8B6E2` body, `#7B5EA7` rim, a darker
   purple nucleolus off-centre toward the upper right, faint evenly spaced pore
   dots around the rim.
8. **`ribosome-cluster.png`** — five or six tiny `#6F6553` grains loosely
   clustered, no rim, slightly soft. Export at **128 × 128**.

### 2. Stretchy pieces — the game scales these, so keep them simple

These get stretched horizontally and vertically at runtime. **No sharp detail,
no lettering, no fine texture** — anything crisp will smear when scaled.

9. **`vacuole-full.png`** — a wide, turgid, water-filled vacuole blob, `#BFE3F2`
   with a `#4F9EC4` rim, one large soft white highlight in the upper left.
   Export **512 × 384**.
10. **`vacuole-slack.png`** — the same blob, softer and slumped, rim slightly
    wrinkled, highlight dimmer — a vacuole that has lost water. Same footprint.
    Export **512 × 384**.
11. **`membrane-healthy.png`** — a rounded-rectangle membrane ring (corner radius
    about 1/8 of the width) filled with pale `#DFF0E2` cytoplasm, ring drawn in
    `#2F7D5C`, faint phospholipid bead texture along the ring only. Export
    **1240 × 840**.
12. **`membrane-wilted.png`** — identical shape and ring, cytoplasm shifted to
    the dull `#E8E3CF` of a wilting cell. Export **1240 × 840**.
13. **`cell-wall.png`** — a thick rigid rounded-rectangle cell-wall frame,
    `#7D9B4E` with a `#5D7A34` inner shade line, plant-fibre grain suggested
    along the band. **The interior must be fully transparent** — this frames the
    membrane image, it does not cover it. Export **1280 × 880**.

### 3. Particles — export each at 64 × 64

Simple single tokens. They travel along paths at roughly 6 px across on screen,
so silhouette is everything and interior detail is wasted.

14. **`particle-sunlight.png`** — a warm `#F5C84A` glowing mote with a short soft halo.
15. **`particle-water.png`** — a `#5AA9E6` water droplet with one white glint.
16. **`particle-co2.png`** — a small `#9AA0A6` three-atom molecule (one centre
    sphere, two smaller either side).
17. **`particle-glucose.png`** — a rounded `#F08A4B` hexagonal sugar token.
18. **`particle-oxygen.png`** — two `#3BAFA9` spheres joined side by side.

### 4. Object view — the plant by the window

The object view is the macro half of the game: a potted plant on a table beside a
window, redrawn live as the player moves the sunlight, water and stomata sliders.
Same painted flat-vector style, same lighting, same palette as the sprites above.
The scene is assembled from these pieces in code, so each piece is its own image
and **must not contain any of the others** — no plant in the pot, no pot in the
room, no sun baked into the window.

19. **`room-wall.png`** — an empty warm interior: cream wall, a wooden table
    surface across the bottom fifth, nothing else. **Opaque**, no window, no
    plant, no props. Export **1280 × 880**.
20. **`window.png`** — a single wooden-framed window, `#8A6F4E` frame with a
    vertical and a horizontal mullion, tall portrait proportions. **The glass
    area must be fully transparent** — the game paints the sky behind it and
    brightens it with the sunlight slider. Export **520 × 610**.
21. **`sun.png`** — a warm `#F5C84A` sun disc with a soft halo and short even
    rays, transparent background. The game scales and fades this with the
    sunlight slider, so draw it at full brightness. Export **256 × 256**.
22. **`sunbeam.png`** — a soft slanted wedge of warm light, brightest at the
    narrow end, fading to nothing at the wide end, straight-edged, no dust
    specks. Transparent, and the fade must be a real alpha ramp (the game only
    changes its opacity). Export **1024 × 768**.
23. **`leaf-healthy.png`** — one broad, firm, `#3F9B56` leaf pointing right, tip
    at the right edge, stalk at the left edge, `#2B6C3C` rim and one centre vein.
    The game mirrors and rotates this single leaf six times, so it must be
    **drawn flat, horizontal, and lit evenly** — no directional shadow. Export
    **512 × 256**.
24. **`leaf-wilted.png`** — the same leaf, same size and same anchor points,
    now limp and yellow-green (`#9A9264`), edges slightly curled and dulled.
    Export **512 × 256**.
25. **`pot.png`** — a simple terracotta pot, `#C8724A` body with an `#A3542F` rim
    line, empty (no soil, no plant), viewed straight on. Export **512 × 384**.
26. **`soil-dry.png`** — a shallow crescent of pale, cracked, dry soil
    (`#C8A874`) shaped to sit in that pot's opening. Export **512 × 160**.
27. **`soil-wet.png`** — the same crescent, same shape, dark and damp
    (`#6B4A2C`), a faint sheen. The game crossfades between the two, so the two
    images must line up pixel for pixel. Export **512 × 160**.
28. **`leaf-surface.png`** — a round magnified view of a leaf's underside: pale
    green cell-textured skin filling the circle, a thin `#2B6C3C` ring at the
    edge like a lens. **No stoma in this image** — the guard cells sit on top.
    Export **512 × 512**.
29. **`guard-cell.png`** — one kidney/sausage-shaped guard cell lying horizontal,
    `#3F9B56` with a `#2B6C3C` rim. The game draws it twice, mirrored top and
    bottom, and slides the pair apart to open the pore — so it must be **one
    cell only**, flat and symmetric left to right. Export **384 × 160**.
30. **`particle-vapour.png`** — a pale `#BCD7E8` wisp of escaping water vapour,
    softer and less defined than the water droplet. Export **64 × 64**.

### 5. Registry thumbnail — `plantcell.png`, export 960 × 640

The whole cell in one glance, **on an opaque cream `#FBF5E7` background** (this
one is not transparent): thick green cell wall frame, membrane just inside, one
big pale-blue central vacuole, the purple nucleus pushed to the left, five or
six chloroplasts spread around the edges, two orange mitochondria, and a few
warm sunlight motes entering from the top. Same painted flat-vector style as the
sprites. **No text anywhere in the image.**

### Delivery

- One PNG per file name above, named exactly as written — the code loads them by
  filename.
- Each sprite ≤ 80 KB after compression, whole set ≤ 1 MB. Run them through
  `oxipng` / `pngquant` before handing them over.

---

## After the assets land (code handoff)

1. Drop the sprites in `public/games/plant-cell/art/` and the thumbnail in
   `src/assets/plantcell.png`.
2. In `CellView.jsx`, swap each shape for
   `<image href="/games/plant-cell/art/<name>.png" …>` at the same coordinates —
   the 320 × 220 viewBox and every spot in `data/organelles.js` stay as they are.
3. Same in `PlantView.jsx` — it shares that 320 × 220 viewBox, so the `LEAVES`
   table, the `LANES` paths and the pore maths all stay. The stem stays a code
   path, and the wet/dry soil `mix()` becomes a crossfade between the two soil
   images.
4. `registry.js` already imports `plantcell.png`, so the thumbnail needs no code
   change — just overwrite the file. Delete the leftover `src/assets/plantcell.svg`.

## Still not covered

The stem is drawn as a curve in code (it bends as the plant wilts), so it needs
no artwork. Level 2's weather decorations — rain streaks in the window, cracks
in dry soil, salt grains on wet soil — are also plain code shapes; if they are
ever redrawn, they need a `rain-streak.png`, a `soil-cracks.png` overlay and a
`salt-grains.png` overlay sized to the same pot opening as `soil-dry.png`.
