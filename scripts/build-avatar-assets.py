"""Build the shipped avatar assets from the originals in assets-src/avatars/.

    python scripts/build-avatar-assets.py

Everything under public/ is copied into the production build verbatim, so the
full-resolution originals live outside it and only the WebP output below ships.
WebP is used throughout: its alpha channel is stored losslessly, so the cutout
edges survive intact while the flat artwork compresses far better than PNG.
"""

import os

import numpy as np
from PIL import Image

SRC = 'assets-src/avatars'
OUT = 'public/avatars'

CANVAS = 512
CHARACTER_SHEET = f'{SRC}/setofcharacters-cutout.png'
CHARACTER_GRID = [['sun', 'fox', 'astronaut'], ['robot', 'frog', 'owl']]

# name -> (anchor, target px, y nudge). Every character except the sun is drawn
# as a bust whose artwork ends in a flat edge, so they are sized by width and
# sat flush on the bottom of the canvas: the circular avatar crop narrows to
# nothing there, which hides the flat edge. Anything centred instead leaves that
# edge inside the circle, where it reads as the character being cut off.
# The sun is a radial object with no flat edge, so it is centred and fits whole.
#
# Target px is the drawn width for a bust, or the longest side for 'contain'.
# Smaller = more padding from the circle edge; bigger = fills more and the
# widest points start clipping. y nudge moves the art down (negative = up).
CHARACTER_LAYOUT = {
    'sun': ('contain', 460, 0),
    'fox': ('bottom', 410, 0),
    'astronaut': ('bottom', 400, 0),
    'robot': ('bottom', 400, 0),
    'frog': ('bottom', 425, 0),
    'owl': ('bottom', 395, 0),      # widest silhouette — cape clips above this
}

# Backgrounds are only ever drawn as a cover fill behind the circular crop, so
# they are pre-cropped square at the size the export canvas uses.
BACKGROUNDS = ['forest', 'lab', 'library', 'pond', 'space', 'village']

# Stickers are re-laid-out onto a 4x3 grid of SQUARE cells, because the avatar
# draws one cell into a square box — a non-square cell would stretch the art.
# Each sprite is fit inside its cell and centred, so the wide sunglasses and the
# tall potion both land at a sensible size without distortion.
# A 256px cell is about one screen pixel per source pixel at the largest sticker
# size (38% of a 512px avatar).
STICKER_SOURCE = f'{SRC}/stickers.png'
STICKER_SOURCE_GRID = [
    ['heart', 'glasses', 'flower'],
    ['bow', 'bowtie', 'flowers'],
    ['speech', 'star', 'sparkles'],
    ['gradcap', 'potion', 'partyhat'],
]
# Output order, row-major across 4 columns — must match AVATAR_STICKERS.
STICKER_ORDER = ['heart', 'glasses', 'flower', 'bow',
                 'bowtie', 'flowers', 'speech', 'star',
                 'sparkles', 'gradcap', 'potion', 'partyhat']
STICKER_COLUMNS, STICKER_ROWS = 4, 3
STICKER_CELL = 256
STICKER_FILL = 0.9


def find_runs(profile, min_pixels=4):
    """Index ranges where the alpha profile is non-empty, ignoring stray pixels."""
    runs, start = [], None
    for i, value in enumerate(profile):
        if value >= min_pixels and start is None:
            start = i
        elif value < min_pixels and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(profile) - 1))
    return runs


def resize_rgba(image, width, height):
    """LANCZOS resize in premultiplied space so transparent pixels cannot bleed."""
    px = np.array(image).astype(np.float64)
    px[:, :, :3] *= px[:, :, 3:4] / 255.0
    resized = Image.fromarray(px.astype(np.uint8), 'RGBA').resize((width, height), Image.LANCZOS)
    out = np.array(resized).astype(np.float64)
    alpha = np.clip(out[:, :, 3:4] / 255.0, 1e-6, None)
    out[:, :, :3] = np.clip(out[:, :, :3] / alpha, 0, 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def save_webp(image, path, quality):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path, 'WEBP', quality=quality, alpha_quality=100, method=4)
    print(f'  {path}  {os.path.getsize(path) // 1024}KB')


def build_characters():
    print('characters')
    sheet = Image.open(CHARACTER_SHEET).convert('RGBA')
    mask = np.array(sheet)[:, :, 3] > 32
    cols = find_runs(mask.sum(axis=0))
    rows = find_runs(mask.sum(axis=1))
    if (len(rows), len(cols)) != (len(CHARACTER_GRID), len(CHARACTER_GRID[0])):
        raise SystemExit(f'expected a {len(CHARACTER_GRID)}x{len(CHARACTER_GRID[0])} grid, '
                         f'found {len(rows)}x{len(cols)}')

    for row_index, (y0, y1) in enumerate(rows):
        for col_index, (x0, x1) in enumerate(cols):
            name = CHARACTER_GRID[row_index][col_index]
            ys, xs = np.where(mask[y0:y1 + 1, x0:x1 + 1])
            crop = sheet.crop((x0 + int(xs.min()), y0 + int(ys.min()),
                               x0 + int(xs.max()) + 1, y0 + int(ys.max()) + 1))

            anchor, target, dy = CHARACTER_LAYOUT[name]
            scale = (min(target / crop.width, target / crop.height) if anchor == 'contain'
                     else target / crop.width)
            width, height = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
            if height > CANVAS:
                width, height = max(1, round(width * CANVAS / height)), CANVAS
            top = (CANVAS - height if anchor == 'bottom' else (CANVAS - height) // 2) + dy

            canvas = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
            canvas.paste(resize_rgba(crop, width, height), ((CANVAS - width) // 2, top))
            save_webp(canvas, f'{OUT}/characters/{name}.webp', quality=90)


def build_backgrounds():
    print('backgrounds')
    for name in BACKGROUNDS:
        image = Image.open(f'{SRC}/bg-{name}.png').convert('RGB')
        scale = max(CANVAS / image.width, CANVAS / image.height)
        filled = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
        left, top = (filled.width - CANVAS) // 2, (filled.height - CANVAS) // 2
        save_webp(filled.crop((left, top, left + CANVAS, top + CANVAS)),
                  f'{OUT}/backgrounds/{name}.webp', quality=85)


def build_stickers():
    print('stickers')
    source = Image.open(STICKER_SOURCE).convert('RGBA')
    mask = np.array(source)[:, :, 3] > 32
    cols = find_runs(mask.sum(axis=0))
    rows = find_runs(mask.sum(axis=1))
    if (len(rows), len(cols)) != (len(STICKER_SOURCE_GRID), len(STICKER_SOURCE_GRID[0])):
        raise SystemExit(f'expected a {len(STICKER_SOURCE_GRID)}x{len(STICKER_SOURCE_GRID[0])} '
                         f'sticker grid, found {len(rows)}x{len(cols)}')

    crops = {}
    for row_index, (y0, y1) in enumerate(rows):
        for col_index, (x0, x1) in enumerate(cols):
            ys, xs = np.where(mask[y0:y1 + 1, x0:x1 + 1])
            crops[STICKER_SOURCE_GRID[row_index][col_index]] = source.crop(
                (x0 + int(xs.min()), y0 + int(ys.min()),
                 x0 + int(xs.max()) + 1, y0 + int(ys.max()) + 1))

    sheet = Image.new('RGBA', (STICKER_COLUMNS * STICKER_CELL, STICKER_ROWS * STICKER_CELL), (0, 0, 0, 0))
    box = STICKER_CELL * STICKER_FILL
    for index, name in enumerate(STICKER_ORDER):
        crop = crops[name]
        scale = min(box / crop.width, box / crop.height)
        width, height = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
        cell_x = (index % STICKER_COLUMNS) * STICKER_CELL
        cell_y = (index // STICKER_COLUMNS) * STICKER_CELL
        sheet.paste(resize_rgba(crop, width, height),
                    (cell_x + (STICKER_CELL - width) // 2, cell_y + (STICKER_CELL - height) // 2))
        print(f'    {name:10s} cell {index % STICKER_COLUMNS},{index // STICKER_COLUMNS}  {width}x{height}')

    save_webp(sheet, f'{OUT}/stickers/stickers.webp', quality=90)


if __name__ == '__main__':
    build_characters()
    build_backgrounds()
    build_stickers()
