# Codex asset prompt — Mystery Lab: the Lab Tent and its five mini-games

**Raster, not vector.** These assets come out of Codex's *image generation*
model as PNGs with real painted shading. The tent, the bench and every
mini-game prop are currently drawn as plain inline SVG; each PNG below replaces
one of those shapes.

Image models take **one prompt per image** and cannot lay out a labelled sprite
sheet, so every sprite is its own file. Generate them in the order listed and
**feed the previous image back in as a style reference** for the next one —
that is what keeps the set looking like one artist made it.

Everything lands in `public/games/mystery-lab/art/`.

## Where each asset is consumed

All consumers are in [screens-c.jsx](../../src/games/mystery-lab/screens-c.jsx).

**Tent and bench** — the room the five mini-games launch from:

| File (final path) | Replaces |
|---|---|
| `.../tent-canopy.png` | the striped canopy `<svg>` stretched across the top — [screens-c.jsx:152](../../src/games/mystery-lab/screens-c.jsx#L152) |
| `.../bench-surface.png` | the bench gradient + plank lines `<div>` — [screens-c.jsx:158](../../src/games/mystery-lab/screens-c.jsx#L158) |
| `.../bench-beaker-teal.png`, `.../bench-beaker-orange.png` | the two decorative `<Beaker>` SVGs — [screens-c.jsx:287](../../src/games/mystery-lab/screens-c.jsx#L287), placed at [:219](../../src/games/mystery-lab/screens-c.jsx#L219) |

**Tool tiles** — the five buttons that start a mini-game. These already exist as
PNGs and are being **replaced in place**, same filenames:

| File (final path) | Replaces |
|---|---|
| `.../tool-ph-strip.png` | current pH tile art — `TOOL_ART`, [screens-c.jsx:318](../../src/games/mystery-lab/screens-c.jsx#L318) |
| `.../tool-oxygen-probe.png` | current oxygen tile art |
| `.../tool-thermometer.png` | current temperature tile art |
| `.../tool-pollution-vial.png` | current pollution tile art |
| `.../tool-microscope.png` | current microscope tile art |

Each tile renders at **max 76 × 82** ([:323](../../src/games/mystery-lab/screens-c.jsx#L323)) and the *same file* is
reused at **44 × 44** in the mini-game popup header
([:412](../../src/games/mystery-lab/screens-c.jsx#L412)) — so each one must still read at 44px.

**pH mini-game** — dip a strip, then match the colour:

| File (final path) | Replaces |
|---|---|
| `.../ph-jar.png` | the Pond A sample jar `<PHBeakerSVG>` — [screens-c.jsx:439](../../src/games/mystery-lab/screens-c.jsx#L439) |
| `.../ph-strip-dry.png`, `.../ph-strip-wet.png`, `.../ph-strip-acidic.png` | the strip `<rect>` whose fill steps `#e2e8f0` → `#fbbf24` → `#f97316` as the dip fills — [screens-c.jsx:577](../../src/games/mystery-lab/screens-c.jsx#L577) |

**Temperature mini-game** — drag a thermometer into three water samples:

| File (final path) | Replaces |
|---|---|
| `.../temp-thermometer.png` | `<DragThermometer>` — [screens-c.jsx:813](../../src/games/mystery-lab/screens-c.jsx#L813) |
| `.../temp-beaker-glass.png` | the glass body + wooden rim of `<ContainerBeaker>` — [screens-c.jsx:831](../../src/games/mystery-lab/screens-c.jsx#L831). **Interior must be transparent**: the coloured water rect is drawn behind it and changes per sample. |

**Pollution mini-game** — match the chemical signature:

| File (final path) | Replaces |
|---|---|
| `.../vial-metal.png`, `.../vial-acid.png`, `.../vial-thermal.png` | `<PollutionTube color>` — [screens-c.jsx:363](../../src/games/mystery-lab/screens-c.jsx#L363). One filled vial per liquid: metal `#f97316`, acid `#8b5cf6`, thermal `#dc2626` (`POLLUTION_LEVELS`, [:1146](../../src/games/mystery-lab/screens-c.jsx#L1146)) |

**Microscope mini-game** — click the contaminants:

| File (final path) | Replaces |
|---|---|
| `.../micro-field.png` | the scope field: radial-gradient circle, 8px `#1c1410` ring and 20 scattered dot `<span>`s — [screens-c.jsx:1417](../../src/games/mystery-lab/screens-c.jsx#L1417) |
| `.../micro-contaminant.png` | `<MetallicVirus>` — [screens-c.jsx:1340](../../src/games/mystery-lab/screens-c.jsx#L1340) |
| `.../micro-contaminant-found.png` | the teal check circle shown once a target is clicked — [screens-c.jsx:1455](../../src/games/mystery-lab/screens-c.jsx#L1455) |

**Not in this pass:** the oxygen mini-game's gauge is a live gradient whose green
zone shrinks per round, so it stays CSS. The registry thumbnail and the
achievement medals are unchanged — **do not generate them.**

---

## Paste from here into Codex

You are generating 2D game art for **SciQuest**, a Grade 7 science web app. The
game is *Mystery Lab: The Dying Pond* — a detective story where a student
investigates why fish are dying in one pond and not another. These assets are
for the **Lab Tent**: a field science tent on a pond bank, holding a bench of
five instruments. Clicking an instrument opens a small mini-game in a popup
card. Everything below belongs to that tent, so the whole set must look like one
field kit owned by one detective — same brush, same palette, same light.

### Global rules — apply to every image below

- **Format:** PNG, **transparent background**, no baked backdrop, no ground
  shadow, no card, no border, no text, no watermark, no label, no UI chrome.
  If the model cannot do alpha, render on flat `#FF00FF` and I will key it out.
  (The two exceptions that *do* fill their frame are `tent-canopy.png` and
  `bench-surface.png` — both noted per asset.)
- **No lettering of any kind.** No "pH", no numbers on a dial, no brand marks.
  Every label in this game is live HTML text drawn over the art; baked text will
  double up and will not translate.
- **Style:** painted flat-vector hybrid — clean readable silhouette, one soft
  interior gradient plus one specular highlight, a slightly darker rim rather
  than a hard black outline. Warm, friendly, hand-illustrated storybook
  adjacent, like a well-made children's science annual. **Not** photoreal, not
  a 3D render, not glossy plastic, not technical-manual line art, no cartoon
  faces or eyes.
- **Lighting is identical in every image:** one soft light from the upper left,
  no cast shadows.
- **Camera is identical in every image:** flat straight-on view, no perspective,
  no tilt, no vanishing point.
- Subject centred, ~10% empty padding on all sides, upright.
- Must read on **both** the cream page `#FDF6E3` and the dark page `#14110D`, and
  on the warm bench top `#E6D6B9` — so no white-only or near-black-only fills,
  and nothing that relies on the page colour showing through. Give glass a
  faint warm-grey body rather than pure transparency, or it vanishes on cream.
- **Readable small.** Several of these render at 44px. Big shapes, high
  contrast, no hairline detail, no fine hatching.
- Generate at 1024 × 1024, then downscale to the export size given per asset.

### Palette — use these exact colours

These are the game's real tokens. Do not invent new hues.

| Thing | Hex |
|---|---|
| outline / darkest ink | `#1C1410` |
| wood, bench rim, stands | `#5B4530` |
| wood highlight | `#846346` |
| bench top (light → dark) | `#F8EFD1` → `#E6D6B9` |
| cream page / paper | `#FDF6E3` / `#FFFAEE` |
| glass body | `#FDF6E3` at low opacity, rim `#1C1410` |
| primary orange / dark | `#F97316` / `#C2410C` |
| tent stripe yellow | `#FDE047` |
| teal / dark | `#14B8A6` / `#0F766E` |
| pH test accent | `#A855F7` |
| oxygen test accent | `#0EA5E9` |
| temperature test accent | `#EF4444` |
| pollution test accent | `#F97316` |
| microscope test accent | `#14B8A6` |
| river water | `#67E8F9` |
| Pond A water (sick, warm) | `#FB923C` |
| Pond B water (healthy) | `#7DD3FC` |
| sick pond-water brown | `#7C5A30` |
| acid discharge | `#8B5CF6` |
| thermal effluent | `#DC2626` |
| success green | `#34D399` |

---

### 1. The tent — generate first, it sets the style

1. **`tent-canopy.png`** — a field-lab tent canopy seen straight on, only the
   top valance: a scalloped awning edge in alternating `#F97316` and `#FDE047`
   panels, a `#5B4530` ridge pole along the top, soft fabric folds, a slight sag
   between poles. **Fills its frame edge to edge, no transparent margin left or
   right** — it is stretched across the full width of the scene and must tile
   seamlessly if repeated. Export **1600 × 200**.
2. **`bench-surface.png`** — a warm wooden field workbench top seen straight on,
   planks running horizontally, `#F8EFD1` near the top fading to `#E6D6B9` at
   the bottom, soft `#846346` plank seams, a few faint water rings and chemical
   stains, one small scuff. Calm and low contrast — instruments sit on top of
   this and must pop. **Fills its frame, no transparency.** Export
   **1600 × 720**.
3. **`bench-beaker-teal.png`** — a small glass beaker with a pouring lip, filled
   two thirds with `#14B8A6` liquid, a lighter meniscus line, two or three
   rising bubbles, `#1C1410` rim line, faint graduation ticks on the left (ticks
   only — no numbers). Export **160 × 260**.
4. **`bench-beaker-orange.png`** — the same beaker, same angle, one size
   smaller, liquid `#F97316`. Export **120 × 200**.

### 2. The five tool tiles — export each at 256 × 256

These sit on the bench as buttons and are reused at 44px, so each one needs an
instantly different **silhouette**: strip, probe, thermometer, vial, microscope.
Each stands upright, three-quarters filling the frame.

5. **`tool-ph-strip.png`** — a small stack of pH test strips, top strip pulled
   forward and slightly fanned, paper `#FFFAEE` with a coloured pad at the lower
   end running `#DC2626` → `#F97316` → `#FACC15` → `#34D399`, `#1C1410` rim.
   Accent `#A855F7` allowed only as a thin band on the pack the strips sit in.
6. **`tool-oxygen-probe.png`** — a handheld dissolved-oxygen probe: a `#0EA5E9`
   body with a `#5B4530` grip, a short coiled cable falling to the lower right,
   a metal sensor tip at the bottom, a small blank round readout window (the
   window is empty — no digits).
7. **`tool-thermometer.png`** — a lab thermometer standing upright, `#FFFAEE`
   glass stem, `#EF4444` column and bulb, `#1C1410` tick marks on one side
   (marks only — no numbers), one highlight down the left of the stem.
8. **`tool-pollution-vial.png`** — a corked sample vial in a small wooden stand
   `#5B4530`, liquid `#F97316`, `#1C1410` rim, one bright highlight down the
   left of the glass, a faint sediment layer at the bottom.
9. **`tool-microscope.png`** — a compact field microscope seen three-quarters
   from the front but with **no perspective distortion**: `#14B8A6` arm and
   base, `#5B4530` stage clips, `#FFFAEE` eyepiece barrel, a small round mirror
   below the stage.

### 3. pH mini-game

10. **`ph-jar.png`** — a wide-mouth sample jar of **sick pond water**: `#FFFAEE`
    glass with a `#5B4530` screw rim, filled to about 70% with murky
    `#7C5A30` water, a slightly lighter surface line, three small silty bubbles
    rising, faint sediment on the bottom, `#1C1410` rim line, graduation ticks
    on the left. Export **440 × 560**.
11. **`ph-strip-dry.png`** — a single pH strip standing vertical, paper
    `#FFFAEE`, `#1C1410` rim, the reagent pad at the **bottom third** a neutral
    unreacted grey `#E2E8F0`. Export **240 × 336**.
12. **`ph-strip-wet.png`** — the identical strip, identical size and position,
    the pad now half reacted to amber `#FBBF24`, the paper just above the pad
    slightly darkened by moisture. Nothing else changes.
13. **`ph-strip-acidic.png`** — the identical strip again, pad fully reacted to
    `#F97316`, a wet sheen on the pad. Nothing else changes.

> 11–13 are read as a three-frame animation, so the paper, the rim and the pad's
> position must be **pixel-identical** between them. Only the pad colour moves.

### 4. Temperature mini-game

14. **`temp-thermometer.png`** — a chunky draggable lab thermometer, upright,
    `#FFFAEE` stem with a `#1C1410` rim, `#EF4444` column rising from a large
    round `#EF4444` bulb at the bottom, tick marks on the right of the stem
    (marks only), one soft white highlight on the upper left of the bulb.
    Slightly friendlier and thicker than `tool-thermometer.png` — this one is
    dragged by a finger. Export **256 × 848**.
15. **`temp-beaker-glass.png`** — an empty straight-sided lab beaker seen
    straight on: a `#5B4530` wooden collar rim across the top, `#1C1410` glass
    outline, a soft vertical highlight on the left wall, three graduation ticks
    on the left. **The interior must be fully transparent** — coloured water is
    drawn behind this image and must show through unchanged. No liquid, no
    meniscus, no contents. Export **720 × 976**.

### 5. Pollution mini-game — export each at 320 × 560

16. **`vial-metal.png`** — a tall corked test vial held in a `#5B4530` wooden
    clip, filled with cloudy `#F97316` industrial run-off, fine dark particles
    suspended in it, a slightly domed meniscus, `#1C1410` rim, one hard
    highlight down the left of the glass.
17. **`vial-acid.png`** — the identical vial and clip, liquid `#8B5CF6`, clear
    rather than cloudy, a few tiny bubbles clinging to the glass.
18. **`vial-thermal.png`** — the identical vial and clip, liquid `#DC2626`, with
    a faint heat shimmer and two wisps of vapour above the surface.

> The vial, cork and clip must be **identical** across 16–18; the game swaps
> these three as one prop changing contents. Only the liquid changes.

### 6. Microscope mini-game

19. **`micro-field.png`** — the circular view down a microscope: a **wide
    ellipse** field (1.6 : 1, not a circle) with a thick `#1C1410` barrel ring
    all the way around, the field inside a soft teal wash from
    `#14B8A6` at ~30% opacity in the centre to almost clear at the edge, and
    scattered harmless cell debris — pale teal discs and specks of varied size,
    evenly spread, none near the centre-heavy. Subtle: moving contaminants are
    drawn on top of this and must stay findable. No crosshair, no reticle
    numbers, no vignette so dark it hides a sprite. Export **1280 × 800**.
20. **`micro-contaminant.png`** — one metallic contaminant particle, filling its
    frame: a rounded metal body with a cool steel gradient from `#D0E4EE`
    highlight through `#6A90A4` to `#243C4E` shadow, ringed by about ten short
    blunt spikes with small ball tips, one white specular dot upper left,
    `#182E3A` rim. Menacing but not gross — no eyes, no face, no slime. Export
    **256 × 256**.
21. **`micro-contaminant-found.png`** — the same particle at the same size and
    pose, now **captured**: desaturated to grey steel, and a solid `#14B8A6`
    disc with a thick white tick sits over its centre-right, with a white ring
    around the disc so it reads on the teal field. Export **256 × 256**.

### Delivery

- 21 PNGs, exact filenames above, flat in one folder — no subfolders, no
  variants, no `_v2` suffixes.
- Transparent background everywhere except `tent-canopy.png` and
  `bench-surface.png`.
- Keep each file **under 400 KB**; these all load on one screen.
- If a file has to be regenerated, regenerate the **whole group** it belongs to
  (the three pH strips, the three vials, the two contaminants) so the frames
  stay identical.
