# Codex asset prompt — Animal Cell: Power the Cell

**Raster, matching the plant cell set.** The sibling game `plant-cell` ships
painted PNGs; this game must look like the same artist made it. The game
currently draws plain SVG shapes inline; each PNG below replaces one of them.

Level 2 already uses the plant cell's finished water art
(`public/games/plant-cell/art/animal-cell-*.png`, `water-*.png`) through
[WaterCell.jsx](../../src/games/plant-cell/ui/WaterCell.jsx) — **do not redo
those**; feed `animal-cell-normal.png` in as the style reference for
everything below.

One prompt per image. Generate in the order listed and feed each finished image
back in as the style reference for the next.

## Where each asset is consumed

All in [AnimalCellView.jsx](../../src/games/animal-cell/AnimalCellView.jsx)
(Levels 1 and 3). Final folder: `public/games/animal-cell/art/`.

| File | Replaces |
|---|---|
| `membrane-healthy.png`, `membrane-weak.png` | the membrane + cytoplasm `<path>` — [AnimalCellView.jsx:78](../../src/games/animal-cell/AnimalCellView.jsx#L78) |
| `golgi.png` | the three Golgi arcs — [AnimalCellView.jsx:83](../../src/games/animal-cell/AnimalCellView.jsx#L83) |
| `er-ribosomes.png` | the ER folds + ribosome dots — [AnimalCellView.jsx:89](../../src/games/animal-cell/AnimalCellView.jsx#L89) |
| `nucleus.png` | the nucleus circles — [AnimalCellView.jsx:96](../../src/games/animal-cell/AnimalCellView.jsx#L96) |
| `mitochondrion-idle.png`, `mitochondrion-active.png`, `mitochondrion-damaged.png` | the mitochondrion ellipse + cristae — [AnimalCellView.jsx:100](../../src/games/animal-cell/AnimalCellView.jsx#L100) |
| `lysosome.png`, `lysosome-damaged.png` | the lysosome circles — [AnimalCellView.jsx:108](../../src/games/animal-cell/AnimalCellView.jsx#L108) |
| `particle-glucose.png`, `particle-oxygen.png`, `particle-energy.png`, `particle-co2.png` | the `Stream` `<circle>` — [AnimalCellView.jsx:45](../../src/games/animal-cell/AnimalCellView.jsx#L45). Glucose / oxygen / CO₂ may reuse `public/games/plant-cell/art/particle-*.png`; only **energy** is new. |

**Shared:**

| File | Replaces |
|---|---|
| `src/assets/animalcell.png` (480 × 320, no text) | the placeholder `animalcell.svg` imported in [registry.js](../../src/lib/games/registry.js) — swap the import to the PNG |
| `public/achievements/energy-maker.png`, `balance-keeper.png`, `organelle-doctor.png` (128 × 128) | **temporary copies** of the plant medals `sun-catcher` / `water-keeper` / `cell-medic`. Copy one of those as the template so the frame and ribbon match exactly; change only the centre emblem (mitochondrion + spark, a cell in a water drop, an organelle with a stethoscope). |

---

## Paste from here into Codex

You are generating 2D game art for **SciQuest**, a Grade 7 science web app. The
game is *Animal Cell: Power the Cell*, the sibling of *Plant Cell: Keep the Cell
Alive*. The player feeds an animal cell's mitochondria glucose and oxygen, and
diagnoses which organelle has broken. Match the attached style reference
exactly — same brush, same palette, same light.

### Global rules — apply to every image

- **Format:** PNG, **transparent background**, no backdrop, no shadow, no card,
  no border, **no text or labels**, no watermark. If alpha is impossible, render
  on flat `#FF00FF`.
- **Style:** painted flat-vector hybrid — clean silhouette, one soft interior
  gradient plus one specular highlight, a slightly darker rim instead of a black
  outline. Warm, textbook-friendly. Not photoreal, not 3D, no faces or eyes.
- **Light:** one soft light from the upper left, no cast shadows.
- **Camera:** flat, straight-on, no perspective. Subject centred, ~10% padding,
  long axis horizontal (the game rotates sprites).
- Must read on **both** cream `#FBF5E7` and near-black `#0C0A09`.
- Generate at 1024 × 1024, downscale to the export size given.
- **Budget:** each PNG under 120 KB after export.

### Palette — use these exact colours (taken from the game's code)

| Thing | Hex |
|---|---|
| cell membrane / cytoplasm | `#D76D2E` / `#FDE3CC` |
| nucleus / rim / nucleolus | `#F5D48A` / `#B8860B` / `#D9A824` |
| mitochondrion / rim | `#F08A4B` / `#B4531F` |
| endoplasmic reticulum | `#2BAFA9` |
| Golgi apparatus | `#1D8580` |
| ribosome | `#6F6553` |
| lysosome / rim | `#E9837F` / `#A83A36` |
| glucose / oxygen / energy / carbon dioxide | `#F08A4B` / `#2BAFA9` / `#D9A824` / `#8A8F94` |
| damage / fault | `#D1544F` |

### Organelles — export each at 256 × 256 unless stated

1. **`mitochondrion-idle.png`** — horizontal bean, body `#F08A4B`, `#B4531F` rim,
   pale `#FDE3CC` folded inner membrane (cristae) as a wavy ribbon along its length.
2. **`mitochondrion-active.png`** — same bean, same pose, with a warm `#D9A824`
   energy glow rim and brighter cristae. Nothing else changes.
3. **`mitochondrion-damaged.png`** — same bean desaturated, cristae torn, two
   `#D1544F` fracture lines.
4. **`nucleus.png`** — round nucleus `#F5D48A`, `#B8860B` rim, darker `#D9A824`
   nucleolus off-centre to the upper right, faint pore dots around the rim.
5. **`golgi.png`** — a stack of four curved, flattened `#1D8580` sacs, bowed
   upwards, with two tiny vesicles budding off the right end. Export 256 × 160.
6. **`er-ribosomes.png`** — a vertical folded ribbon of `#2BAFA9` rough ER
   studded with small `#6F6553` ribosome grains along both edges. Export 128 × 256.
7. **`lysosome.png`** — a small round sac `#E9837F`, `#A83A36` rim, a few darker
   specks inside. Export 128 × 128.
8. **`lysosome-damaged.png`** — same sac desaturated, rim split by a `#D1544F` crack.
9. **`particle-energy.png`** — a small four-point spark in `#D9A824` with a soft
   glow. Export 64 × 64.

### Stretchy pieces — the game scales these; keep detail soft

10. **`membrane-healthy.png`** — a wide, slightly irregular rounded animal cell
    outline: `#D76D2E` membrane rim, `#FDE3CC` cytoplasm fill, faint granules.
    **Empty inside** (no organelles — they are drawn on top). Export 640 × 440.
11. **`membrane-weak.png`** — the same shape, cytoplasm faded toward grey-beige
    and the membrane rim thinner and wavier. Same size and outline.

### Store thumbnail

12. **`animalcell.png`** — 480 × 320, no text. One animal cell filling the frame
    on a flat `#FBF5E7` background (the only image with a background): nucleus
    centre-left, three mitochondria, Golgi upper-left, ER and ribosomes right of
    the nucleus, a few lysosomes. Same art as the sprites above.

### Medals — 128 × 128

13–15. **`energy-maker.png`**, **`balance-keeper.png`**, **`organelle-doctor.png`** —
start from the attached existing SciQuest medal (`sun-catcher.png`) and keep its
frame, ribbon and colours identical. Replace only the centre emblem: a
mitochondrion with a spark; a round cell inside a water drop; an organelle with
a stethoscope.

### Rules

- Transparent backgrounds (except the thumbnail), no embedded text or fonts, no
  editor metadata, no extra files.
- Keep every sprite the same size and pose across its idle / active / damaged
  states so the game can cross-fade them.
