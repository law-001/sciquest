# SciQuest asset art direction

## Standing user preference

Use this style for future SciQuest asset requests unless the user explicitly requests something else. The user rejected a detailed metallic crown and chose simple numbered crowns, then asked for the achievements to match. Keep new assets consistent with that approved direction.

## Visual style

- Simple, friendly flat game illustrations with chunky, recognizable silhouettes.
- Two to four coordinated colors: warm yellow/gold, soft orange, teal, green, blue, purple, or silver gray as appropriate to the subject.
- Minimal shading: one subtly darker side facet or a very gentle tonal variation is enough.
- Avoid realistic metal, glossy 3D rendering, engraved bevels, textures, ornate details, heavy outlines, and dramatic shadows.
- Use a distinct, readable symbol for each asset. Keep details legible at 32–64 pixels.
- Center standalone icons with balanced padding and similar apparent size. Aim for roughly 80–85% canvas coverage.
- No circular backing, medal frame, ribbon, or decorative badge behind the subject unless requested. A circle that is part of the subject, such as Earth or a target, is fine.
- Include text or numbers only when needed. Leaderboard crowns have a large dark numeral directly on the crown: gold 1, silver 2, bronze 3. Other ranks are plain numbers without circles.

## Reference assets

Inspect these actual local PNGs before generating; use them as style references, not subjects to copy into unrelated icons:

- Primary style anchor: [gold crown](public/leaderboard/crown-gold-1.png).
- Matching crowns: [silver 2](public/leaderboard/crown-silver-2.png), [bronze 3](public/leaderboard/crown-bronze-3.png).
- Representative achievements: [First Quiz](public/achievements/first-quiz.png), [Science Nerd](public/achievements/science-nerd.png), [Apex Hunter](public/achievements/apex-hunter.png).
- [Complete achievement gallery](public/achievements/preview.html).
- Recorded prompts: [achievements](public/achievements/PROMPTS.md), [leaderboard](public/leaderboard/PROMPTS.md).

## Delivery and review

- Deliver generated illustrated assets as PNGs. Standalone icons need actual transparent alpha, not a painted checkerboard, white rectangle, or black background.
- Use the available image generation workflow for new illustrations. Save final assets in the project and update consuming references.
- Keep existing achievement keys and filenames stable. Achievement PNGs live in `public/achievements/`; crown PNGs live in `public/leaderboard/`.
- Current optimized sizes: 256 × 256 for achievements, 128 × 128 for leaderboard crowns. Choose an appropriate size for other asset types.
- Check the generated image at its intended display size on light and dark backgrounds. Inspect for unexpected holes, blemishes, stray pixels, wrong text, and inconsistent padding; correct visible defects before finishing.
- Preserve alpha during optimization. Update the relevant gallery and prompt notes when adding or replacing assets.

## Reusable prompt foundation

> Create a simple SciQuest game illustration of [SUBJECT], matching the supplied flat crown and achievement references. Chunky friendly silhouette, 2–4 coordinated colors, minimal shading with at most one darker side facet. Clear at small UI sizes. No realistic materials, gloss, texture, ornate borders, heavy outlines, or background badge. Centered with balanced padding. Actual transparent PNG background; no checkerboard pattern. No text except [EXACT REQUIRED TEXT, OR NONE].

Adapt the subject and composition to the request while retaining this visual language. Do not force icon framing or transparency onto a requested full scene or background.
