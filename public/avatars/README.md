# Avatar assets

Pictures students can pick from in **Edit Profile**. Users cannot upload their
own — only avatars listed in the catalog are selectable.

## Generated — do not hand-edit

Everything under `characters/`, `backgrounds/` and `stickers/` is built from the
originals in `assets-src/avatars/` (which is outside `public/`, so the
full-resolution art never ships):

```bash
python scripts/build-avatar-assets.py
```

Output is WebP throughout — its alpha channel is stored losslessly, so cutout
edges survive while the flat artwork compresses far smaller than PNG.

| Output | Built from | Size |
|---|---|---|
| `characters/*.webp` | `setofcharacters-cutout.png` | 512×512, one per character |
| `backgrounds/*.webp` | `bg-*.png` | 512×512, pre-cropped square |
| `stickers/stickers.webp` | `stickers.png` | 1024×768, 4×3 grid of 256px square cells |

## Adding a character

1. Add it to the sheet in `assets-src/avatars/`.
2. Add its name to `CHARACTER_GRID` in
   [`scripts/build-avatar-assets.py`](../../scripts/build-avatar-assets.py), plus a
   `CHARACTER_LAYOUT` entry (`anchor`, target width, y nudge).
3. Re-run the script.
4. Add a row to `CHARACTER_AVATARS` in
   [`src/lib/avatars.js`](../../src/lib/avatars.js).

`id` is what gets stored on `students.avatar`, so keep it stable — don't rename
an `id` that students may already have selected.

## Adding a sticker

The source sheet's own grid is described by `STICKER_SOURCE_GRID`; the build
re-lays the sprites out onto a 4×3 grid of square cells, because the avatar
draws one cell into a square box and a non-square cell would stretch the art.
Add the name to both `STICKER_SOURCE_GRID` and `STICKER_ORDER` in the build
script, re-run it, then add a row to `AVATAR_STICKERS` in
[`src/lib/avatar-personalization.js`](../../src/lib/avatar-personalization.js)
whose `col`/`row` match its slot in `STICKER_ORDER`.

Sticker ids are persisted inside `students.avatar_style`, so removing one drops
it from any saved profile that used it — `normalizeAvatarStyle` filters out ids
it no longer recognises.

## Adding a background

Drop `bg-<name>.png` in `assets-src/avatars/`, add `<name>` to `BACKGROUNDS` in the
build script, re-run it, then add a row to `AVATAR_BACKGROUNDS` in
[`src/lib/avatar-personalization.js`](../../src/lib/avatar-personalization.js).

## Hand-placed files

`profile.jpg` is a plain picture avatar listed in `IMAGE_AVATARS`; it is not
generated. The built-in science glyph avatars need no files at all — they are
lucide icons defined in `src/lib/avatars.js`.
