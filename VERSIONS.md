# Versions

## VERSION_1
- Lesson materials Open/Save fixed: `openMaterial` / `downloadMaterial` / `fileNameForMaterial` added to `src/lib/materials.js`.
- Open now targets a new browser tab — PDFs are re-typed as `application/pdf` and shown from a blob URL so a wrong stored MIME type can't hand the file to a desktop app; Word/PowerPoint go through Microsoft's web viewer.
- Save now fetches the file and downloads it from a blob URL (cross-origin `download` on an anchor was being ignored, which replaced the SciQuest tab), with a `?download=` hidden-frame fallback.
- `MaterialsList.jsx` Open/Save are real `<button>`s with Opening…/Saving… busy labels; both are used by `MaterialsPanel` and the `materials` lesson slot.

## VERSION_2
- Plant Cell object view: replaced the five-way sprite blend in `src/games/plant-cell/ui/PlantView.jsx` that kept two half-transparent plants on screen almost all the time (the window showed through the plant).
- Each wilt stage now holds fully solid and only cross-dissolves inside a short smoothstep-eased band at the stage boundary (`FADE_BAND`).
- The whole plant now settles ~2px downward as droop rises, so wilting reads as motion rather than a dissolve.
- Added eased `transition` rules for `.pc-plant__whole` in `src/games/plant-cell/styles.css`, disabled under `prefers-reduced-motion`.

## VERSION_3
- Plant Cell result screen now works like the sandbox's `SuccessModal`: it overlays the finished level instead of replacing the whole view with a card on an empty page.
- `src/games/plant-cell/index.jsx` keeps the level component mounted during the `results` stage (its sim loop already halts when the run is over) and renders `ResultsScreen` on top.
- `ResultsScreen.jsx` is now a real dialog — `role="dialog"`, `aria-modal`, autofocus on the first button, Tab focus trap, Escape returns to the level list. The separate "What just happened" card is merged into the one modal card as a tinted note box.
- `styles.css`: `.pc-results` became a dimmed blurred backdrop reusing the shared `sq-modal-backdrop-in` / `sq-modal-card-in` keyframes; new `.pc-results__card` and `.pc-results__note`; actions right-aligned; `.pc-root` given `position: relative` to anchor the overlay.


## VERSION_4
- Cut the six science characters out of `public/avatars/science/setofcharacters-cutout.png` into individual centred 512x512 transparent PNGs in `public/avatars/characters/` (sun, fox, astronaut, robot, frog, owl).
- Added `scripts/cut-avatar-sheet.py`: locates each character by its alpha channel, crops to a tight bounding box and scales it into a square canvas using a premultiplied-alpha LANCZOS resize (the source alpha is hard 0/255, so this is also what anti-aliases the edges). Per-character `TWEAKS` shrink the fox and owl so their ears and cape stop clipping the circular crop, and push the three busts down so shoulders reach the bottom of the circle.
- `src/lib/avatars.js`: `CHARACTER_AVATARS` now points at the individual PNGs via a `file` field instead of sprite-sheet `col`/`row` coordinates. Ids are unchanged so saved student avatars still resolve; the `cat` entry is relabelled "Curious Fox" because the artwork is a fox.
- `src/components/Avatar.jsx`: new `ImageLayer` handles loading and failure for every image layer — it fades in on decode and unmounts on error so a missing file falls back to the layer beneath instead of a broken-image icon. Characters render `object-contain` full-bleed. Removed the now-dead `Sprite` component and the sprite fallbacks for missing sheets.
- Added `src/lib/avatar-export.js`: `renderAvatarToCanvas` flattens background, character and stickers onto a circular 512x512 canvas mirroring the DOM layout, and `downloadAvatarPng` saves it. Individual layers degrade if an asset fails rather than failing the export.
- `src/components/AvatarEditor.jsx`: added a "Download PNG (512px)" button under the live preview, with a disabled "Preparing…" state and a screen-reader status message on success or failure.
- `public/avatars/README.md`: documented the characters folder and the cut script.


## VERSION_5
- Fixed a latent invisible-avatar bug in `ImageLayer` (`src/components/Avatar.jsx`): the layer only became opaque once `onLoad` fired, but a cached image can already be `complete` before React attaches the handler, stranding the image at `opacity-0`. Dropped the opacity gate — the background layer beneath already covers the loading moment — and kept the on-error unmount, now keyed by `src` so swapping character or background re-tries the new file.


## VERSION_6
- Re-cut the character PNGs so busts are no longer visibly cut off inside the circular avatar crop. Five of the six characters are drawn as busts whose artwork ends in a flat edge; centring them left that edge sitting inside the circle, which read as the character being sliced.
- `scripts/cut-avatar-sheet.py`: replaced `TWEAKS` with `LAYOUT`, which gives each character an anchor and a target size. Busts are sized by width and sat flush on the bottom of the canvas, where the circular crop narrows to nothing and hides the flat edge. The sun is a radial object with no flat edge, so it stays centred and fits whole.
- Target widths tuned per silhouette (fox 410, astronaut 400, robot 400, frog 425, owl 395) — the owl's cape is the widest shape and clips above 395.


## VERSION_7
- Optimized every avatar asset. The picker was loading 9.1MB of images; it now loads 584KB for the same content, with no visible quality change.
- Moved the full-resolution originals to `assets-src/avatars/` (outside `public/`, which ships verbatim) and replaced `scripts/cut-avatar-sheet.py` with `scripts/build-avatar-assets.py`, which builds all three asset kinds.
- Everything is now WebP: its alpha is stored losslessly, so the cutout edges are bit-identical to the source while the flat artwork compresses far better than PNG. Palette-quantised PNG was measured first and rejected — it dithered visible mottling into the flat fills.
- Characters 512x512 WebP q90 (1016KB -> 173KB). Backgrounds pre-cropped square at 512 and WebP q85 (6.9MB -> 224KB) — they are only ever drawn as a cover fill behind the circular crop, so the full 750x876 source was never visible. Sticker sheet down to 768x768 WebP q90 (1.2MB -> 153KB), which still gives about one screen pixel per source pixel at the largest sticker size.
- Updated the four config sites that name these files: `src/lib/avatars.js`, `src/lib/avatar-personalization.js`, `src/components/Avatar.jsx`, `src/lib/avatar-export.js`.
- Rewrote `public/avatars/README.md` around the new build step.

## VERSION_8
- Reworked the Edit Profile picture editor (`src/components/AvatarEditor.jsx`) from one long scrolling column into three tabs — Character, Background, Stickers — so the modal no longer scrolls past three stacked numbered sections to reach the sticker controls.
- The preview column is now sticky on desktop and carries the small "beside your name" sample and the download button, so the result stays visible while any tab is being used.
- Characters, backgrounds and stickers now use one shared tile shape at a 56px preview, replacing the mix of a picture grid and a row of text buttons. Selection is shown by border, tint and a check badge rather than the old "(selected)" text appended to every label, which screen readers already got from `aria-pressed`.
- Character tiles now render against the currently chosen background, so the pairing is visible before committing to it.
- Clicking a sticker on the preview jumps to the Stickers tab with that sticker selected; the tab shows a count badge. Tablist supports arrow-key navigation.


## VERSION_9
- Removed the "Download PNG" button from the profile picture editor and deleted `src/lib/avatar-export.js`, the canvas compositing module that only existed to serve it.
- Removed the "Pictures" group from the character picker. The `profile` picture avatar stays in the catalog so any student who already selected it keeps it — the editor just opens on the Characters group instead of a group with no visible chip.
- Names are now display-only. `EditProfileModal` no longer holds `firstName` / `lastName` state or renders the two text inputs; it shows the student's full name in the modal header instead.
- Restructured the modal into a fixed header, a scrolling middle and a fixed footer. Previously the whole dialog scrolled, so on a short window the name fields and the Save button were below the fold; now the name and the Cancel / Save buttons stay put at any window height and only the picture editor scrolls.
- `updateStudentProfile` (`src/lib/users.js`) now only writes the columns the caller supplies, mirroring how the avatar column was already handled. Without this the picture-only save would have overwritten both name columns with `undefined`.
- Save is no longer disabled on an empty first name, since the name can no longer be edited here.


## VERSION_10
- Removed the Characters / Science group chips from the picture picker. With only one group left there was nothing to switch between, so the character grid is now the whole panel and the `category` state is gone.
- Removed `SVG_AVATARS` from `src/lib/avatars.js` — the eight lucide glyph avatars (atom, flask, microscope, dna, leaf, globe, telescope, rocket) drawn on a brand gradient.
- `CHARACTER_AVATARS` is now exported and is what the picker renders directly, instead of filtering the full catalog by category.
- Dropped the matching dead `Glyph` branch from `src/components/Avatar.jsx`.
- `IMAGE_AVATARS` (`profile`) stays in the catalog but is not offered in the picker, so a student who selected it before still resolves to it.
- KNOWN EFFECT: a student whose saved `students.avatar` is one of the eight removed glyph ids now falls back to their initial letter, because `getAvatar` no longer resolves those ids. Nothing errors and the row is untouched — picking any character overwrites it.


## VERSION_11
- Confined the Edit Profile scrollbar to the choices grid. The modal body was the scroll container, so on a tall tab the tab bar and the live preview scrolled away with the tiles.
- On desktop the modal body no longer scrolls (`md:overflow-hidden` in `EditProfileModal`); the active tab panel is the scroll container instead, via the shared `PANEL` class in `src/components/AvatarEditor.jsx`. The tab bar, the preview column and the "nothing changes until you save" note are all `shrink-0` and stay put.
- Below the `md` breakpoint the editor stacks into one column, where a short inner scroll area would be worse than scrolling the sheet, so the modal body keeps scrolling as before.
- Dropped `md:sticky md:top-0` from the preview column — nothing scrolls past it any more.


## VERSION_12
- Fixed the horizontal scrollbar that appeared under the choices grid. Setting `overflow-y` makes CSS compute `overflow-x` from `visible` to `auto`, so the selected tile's check badge — offset `-top-1.5 -right-1.5`, deliberately outside the tile — was enough to raise a sideways bar whenever the rightmost tile was selected.
- Moved the check badge inside the tile (`top-1 right-1`) and pinned `md:overflow-x-hidden` on the panel, so only up/down scrolling is possible. Both are `md:`-scoped because only the desktop layout sets `overflow-y`; on mobile the panel stays unclipped so tile focus outlines are not cut off.
- Gave the scrollable panel a branded focus ring instead of the browser's default black outline, which was showing because the panel is focusable so keyboard users can reach the scroll area.


## VERSION_13
- Replaced the twelve avatar stickers with the supplied `STICKERS.png` sheet: heart, sunglasses, flower, ribbon bow, bow tie, flower bunch, speech bubble, star, sparkles, graduation cap, potion and party hat.
- The new art is a 3x4 grid whose sprites vary widely in shape (the sunglasses are 2.8x wider than tall, the potion is nearly twice as tall as wide). The avatar draws one sheet cell into a square box, so `build_stickers` now cuts each sprite to its own bounding box and re-lays them out on a 4x3 grid of 256px SQUARE cells, fit and centred. Dropping the sheet in as-is would have stretched every sprite.
- Kept the 4x3 output shape so the existing `backgroundSize: 400% 300%` maths in `src/components/Avatar.jsx` still holds; only the file name changed, to `stickers/stickers.webp` (1024x768, 120KB).
- Source moved to `assets-src/avatars/stickers.png`; the stray upload at `public/avatars/STICKERS.png` and the superseded `science-stickers.webp` are gone.
- KNOWN EFFECT: `heart`, `glasses`, `flower`, `star` and `sparkles` kept their ids, so saved profiles using those keep their stickers. The other seven old ids (`crown`, `leaf`, `rocket`, `atom`, `lightning`, `music`, `rainbow`) no longer exist and `normalizeAvatarStyle` drops them from a saved profile on load. Nothing errors; those students simply have fewer stickers.

## VERSION_14
- Fixed sticker saving with a forward-only database migration accepting the new sticker catalog and independent width/height (12-48%), while retaining legacy IDs and square sizes. Updated the schema snapshot to match. Applied this migration file to the linked database; all 17 read-only validator checks passed.
- Isolated avatar artwork stacking so it cannot cover editor controls; selected sticker handles stay above overlapping stickers.
- Made stretch, zoom and rotation relative to the initial grab point, preventing jumps. Zoom preserves proportions at size limits, and lost pointer capture ends dragging.

---
Staged changes: Fix sticker persistence and preview manipulation
