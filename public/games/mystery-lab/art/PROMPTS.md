# Mystery Lab — flat expedition sprites

Art direction: repository `AGENTS.md` and `codex.md`, inspected gold crown,
First Quiz trophy, and Science Nerd flask. Generated with the built-in imagegen
tool. These are individual transparent PNGs, not pieces cropped from a map.
The unused whole-map generation is not included in the project.

## Shared generation prompt

Create ONE reusable SciQuest game sprite PNG with actual transparent alpha
background. Simple friendly flat illustration matching flat gold crown game
icons: chunky recognizable silhouette, 2–4 coordinated colors, one subtly darker
facet at most. NO heavy outlines, texture, realistic material, gloss, 3D
rendering, dramatic shadow, backing badge, text or numbers. Elevated 2D
adventure-game view, readable at 64–200px, centered with balanced padding and
85% canvas coverage. Subject: [subject below].

## Individual subjects

| PNG | Subject / constraints |
| --- | --- |
| pond-healthy | Irregular blue pond and sage shoreline only; two pale ripple marks. No fish, plants, rocks or scenery. |
| pond-polluted | Matching irregular gray-brown pond and ochre muddy shoreline; two muted olive patches. No fish, debris or plants. |
| lab-tent | Teal research tent with open cream interior, rolled flaps and yellow flag. No equipment or scenery. |
| factory | Terracotta factory, charcoal sawtooth roof, two smokestacks, four yellow windows, right drainage pipe. No smoke, ground or signage. |
| evidence-board | Freestanding tan wooden board, cream pinned notes, teal specimen photo, coral connecting string. No text or ground. |
| tree | Rounded sage canopy, darker teal cluster, short brown trunk. No ground. |
| dead-tree | Gray-brown bare trunk and five simple crooked branches. No ground. |
| bush | Low bush, three chunky leaf masses, two green tones. No ground. |
| rock | Three rounded angular silver-gray stones, two shades. No ground. |
| reeds | Five sage-green leaves and two brown cattails. No water or ground. |
| flowers | Three yellow five-petal wildflowers, green stems and leaves. No ground. |
| lab-bench | Wooden table, teal microscope, three sample jars and test-tube rack. No tent, scenery or text. |
| debris | Crumpled silver can and short broken brown twig. No water or ground. |
| fish | Small orange fish, chunky side silhouette and tiny dark eye. No water. |
| dead-plants | Three wilted ochre leaves on drooping brown stems. No ground. |

## Integration

`ExpeditionMap.jsx` owns terrain, paths, location coordinates, decoration placement
and the existing navigation callbacks. Each sprite is independently positioned.
Smoke and a single drifting fish animate separately; reduced-motion disables them.
`world.jsx` reuses sprites in opening and observation scenes. Fish and labels in
the observation pond remain separate from the pond bitmap, preserving interactive
clues and `hideFish` behavior.

PNG optimization uses palette compression with alpha retained. Large landmarks
are at most 512px; small props are at most 256px. `preview.html` displays all sprites
on light and dark backgrounds, including a 48px readability preview.

## Observation evidence and lab tools (September 2026)

The existing pond plates are intentionally retained. Field evidence is supplied as
independently clickable transparent overlays, letting it animate and fade after
collection without changing `pond-healthy.png` or `pond-polluted.png`.

Prompt foundation used with the built-in image generator:

> Create one transparent SciQuest Mystery Lab game sprite matching the existing flat
> pond, factory and expedition-map art: friendly chunky silhouette, two to four
> coordinated colors, minimal shading with one darker facet, readable at small size.
> No heavy outline, texture, realism, gloss, 3D, labels, background, border or watermark.

| PNG | Subject |
| --- | --- |
| `clue-dead-fish.png` | Three pale fish floating belly-up, kid-friendly. |
| `clue-murky-water.png` | Top-down brown cloudy-water slick with muddy swirls. |
| `clue-chemical-vapor.png` | Small lime-yellow chemical vapor plume. |
| `clue-drain-pipe.png` | Oversized rust-orange outfall with a dark open mouth, cracked concrete collar and a thick muddy wastewater stream. |
| `clue-healthy-fish.png` | Two lively orange freshwater fish with ripples. |
| `clue-clear-water.png` | Pale cyan clear-water ripples, bubbles and glint. |
| `clue-thermometer-hot.png` | Red field thermometer with a `34°C` badge. |
| `clue-thermometer-cool.png` | Blue field thermometer with a `22°C` badge. |
| `tool-ph-strip.png` | Acidic-result pH strip and color reference. |
| `tool-oxygen-probe.png` | Handheld dissolved oxygen meter and sensor. |
| `tool-thermometer.png` | High-reading laboratory thermometer. |
| `tool-pollution-vial.png` | Capped vial of orange-brown contaminated water. |
| `tool-microscope.png` | Compact teal laboratory microscope. |

## Observation-scene backdrop plates (September 2026)

These are full-bleed 1280 × 720 PNGs, used behind the existing pond plates and
independent clue sprites. Their middle/lower-middle is deliberately quiet so the
pond, collectible evidence, and pond switcher remain readable.

> Create a beautiful 16:9 SciQuest Mystery Lab field-site background plate. Match
> the friendly flat 2D map and pond sprites with clean chunky silhouettes, 2–4
> coordinated colors, gentle one-facet shading and restrained edge details. Reserve
> the central 55% for the existing pond and overlays. Background only: no pond,
> fish, thermometer, pipe, UI, labels, border, watermark or readable text.

| PNG | Scene |
| --- | --- |
| `observation-backdrop-healthy-v1.png` | Mint-to-teal healthy meadow, distant hills and trees, corner cattails and a far-right clean creek. |
| `observation-backdrop-polluted-v1.png` | Peach-to-umber industrial meadow, distant smoky ridge, faint far-right runoff and edge cattails. |

## Lab Tent art pass (September 2026)

The Lab Tent uses the full generated field-kit set described in
`docs/asset-prompts/mystery-lab-lab-tent.md`. The scene uses `tent-canopy.png`,
`bench-surface.png`, and the two bench beakers; tool tile files are replaced in
place. Mini-games layer the new art around the existing live water, timer,
measurement, selection, and motion logic.

Added PNGs: `tent-canopy`, `bench-surface`, `bench-beaker-teal`,
`bench-beaker-orange`, `ph-jar`, `ph-strip-dry`, `ph-strip-wet`,
`ph-strip-acidic`, `temp-thermometer`, `temp-beaker-glass`, `vial-metal`,
`vial-acid`, `vial-thermal`, `micro-field`, `micro-contaminant`, and
`micro-contaminant-found` (all `.png`).
