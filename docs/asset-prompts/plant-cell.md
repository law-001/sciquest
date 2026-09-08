# Codex asset prompt — Plant Cell: Keep the Cell Alive

Paste everything below the line into Codex. The game currently ships with plain
SVG shapes drawn in code; these assets replace them.

**Where each asset is consumed**

| Asset | Consumed by |
|---|---|
| `plant-cell-organelles.svg` (sprite sheet) | `src/games/plant-cell/ui/CellView.jsx` — replaces the inline `<ellipse>`/`<rect>` shapes |
| `plant-cell-particles.svg` (sprite sheet) | `CellView.jsx` — the `Stream` particles (`<circle>` today) |
| `src/assets/plantcell.svg` | `src/lib/games/registry.js` thumbnail |
| `public/achievements/{sun-catcher,water-keeper,cell-medic}.svg` | `src/components/AchievementMedal.jsx` |

---

You are producing 2D game art for **SciQuest**, a Grade 7 science web app. The
game is *Plant Cell: Keep the Cell Alive* — a stylised plant cell seen from
inside, where organelles animate as the player runs photosynthesis, balances
water, and repairs a broken organelle.

**Art direction**

- Flat vector, clean thick outlines (2–3 px at 1× on a 320 × 220 stage), soft
  interior shading only. No gradients heavier than a single soft highlight, no
  photorealism, no textures.
- Warm, friendly, textbook-adjacent — readable at 40 px tall on a phone.
- Palette (use these exactly):
  - cell wall `#7D9B4E`, wall shade `#5D7A34`
  - cell membrane `#2F7D5C`, cytoplasm `#DFF0E2`, wilted cytoplasm `#E8E3CF`
  - chloroplast `#3F9B56`, chloroplast outline `#2B6C3C`
  - vacuole `#BFE3F2`, vacuole outline `#4F9EC4`
  - nucleus `#C8B6E2`, nucleus outline `#7B5EA7`
  - mitochondrion `#E08A5F`, outline `#A9532C`
  - ribosome `#6F6553`
  - sunlight `#F5C84A`, water `#5AA9E6`, carbon dioxide `#9AA0A6`,
    glucose `#F08A4B`, oxygen `#3BAFA9`, damage/fault `#D1544F`
- Must read correctly on both a cream (`#FBF5E7`) and a near-black (`#0C0A09`)
  background — no white-only fills for shapes that sit on the stage.

**Deliverable 1 — `plant-cell-organelles.svg` (sprite sheet)**

One SVG, a 4 × 3 grid of 128 × 128 cells, each sprite centred in its cell, each
top-level `<g>` carrying `id="<name>"` from this list:

1. `chloroplast-idle` — lens-shaped, visible grana stacks
2. `chloroplast-active` — same shape, warm glow rim (photosynthesis running)
3. `chloroplast-damaged` — desaturated, cracked, red `#D1544F` fracture marks
4. `mitochondrion-idle` — bean shape with inner folded membrane (cristae)
5. `mitochondrion-active` — same with warm energy pulse rim
6. `mitochondrion-damaged` — desaturated, torn cristae
7. `nucleus` — round, nucleolus inside, faint nuclear-pore dots
8. `vacuole-full` — large rounded blob, one soft highlight
9. `vacuole-empty` — same blob shrunken and slack
10. `ribosome-cluster` — 5–6 small dots
11. `wall-corner` — a 90° corner piece of thick cell wall, tileable along both edges
12. `membrane-segment` — a thin horizontal membrane strip with a phospholipid
    hint, tileable left-to-right

**Deliverable 2 — `plant-cell-particles.svg` (sprite sheet)**

One SVG, a 6 × 1 grid of 64 × 64 cells, ids: `particle-sunlight`,
`particle-water`, `particle-co2`, `particle-glucose`, `particle-oxygen`,
`particle-salt`. Each is a single simple token (dot, droplet, small molecule
pair) in its palette colour, with a 1.5 px darker outline so it stays visible on
the pale cytoplasm.

**Deliverable 3 — thumbnail `plantcell.svg`**

480 × 320. The whole cell in one glance: wall, membrane, big central vacuole,
nucleus pushed to the left, 4–5 chloroplasts, 2 mitochondria, a few sunlight
dots entering from the top. No text.

**Deliverable 4 — three achievement medals**

128 × 128 each, matching the existing medals in `public/achievements/` exactly
(same metal frame path, same ribbon, same `<title>` pattern — copy
`meadow-forager.svg` as the template and swap only the face colour and the
central icon):

- `sun-catcher.svg` — sun over a leaf, accent `#F5C84A`
- `water-keeper.svg` — water droplet held safe, accent `#5AA9E6`
- `cell-medic.svg` — cell outline with a repair cross, accent `#2F9E63`

**Rules**

- SVG only, no raster, no external fonts, no embedded images.
- Every sprite on its own transparent background; no cell backgrounds baked in.
- Keep sprite ids exactly as listed — the code references them.
- Optimise: no editor metadata, no `<style>` blocks, inline `fill`/`stroke`
  attributes only.
- Total for both sprite sheets under 120 KB.
