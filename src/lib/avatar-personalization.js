export const MAX_STICKERS = 6;
export const AVATAR_BACKGROUNDS = [
  // IDs are retained for saved profiles. Each one maps to an individual box
  // cropped directly from the supplied background sheet.
  { id: 'original', label: 'Science Lab', className: 'bg-teal-400', src: '/avatars/backgrounds/lab.webp' },
  { id: 'midnight', label: 'Space', className: 'bg-blue-950', src: '/avatars/backgrounds/space.webp' },
  { id: 'meadow', label: 'Forest', className: 'bg-lime-400', src: '/avatars/backgrounds/forest.webp' },
  { id: 'lagoon', label: 'Pond', className: 'bg-sky-400', src: '/avatars/backgrounds/pond.webp' },
  { id: 'sunrise', label: 'Village', className: 'bg-orange-400', src: '/avatars/backgrounds/village.webp' },
  { id: 'peach', label: 'Library', className: 'bg-violet-400', src: '/avatars/backgrounds/library.webp' },
];
export const AVATAR_STICKERS = [
  // col/row index into the generated 4x3 sticker sheet, in the order
  // STICKER_ORDER lays them out in scripts/build-avatar-assets.py — change one
  // and you must change the other. IDs are persisted inside students.avatar_style.
  { id: 'heart', label: 'Heart', col: 0, row: 0 },
  { id: 'glasses', label: 'Sunglasses', col: 1, row: 0 },
  { id: 'flower', label: 'Flower', col: 2, row: 0 },
  { id: 'bow', label: 'Ribbon Bow', col: 3, row: 0 },
  { id: 'bowtie', label: 'Bow Tie', col: 0, row: 1 },
  { id: 'flowers', label: 'Flower Bunch', col: 1, row: 1 },
  { id: 'speech', label: 'Speech Bubble', col: 2, row: 1 },
  { id: 'star', label: 'Star', col: 3, row: 1 },
  { id: 'sparkles', label: 'Sparkles', col: 0, row: 2 },
  { id: 'gradcap', label: 'Graduation Cap', col: 1, row: 2 },
  { id: 'potion', label: 'Potion', col: 2, row: 2 },
  { id: 'partyhat', label: 'Party Hat', col: 3, row: 2 },
];

export const STICKER_MIN = 12;
export const STICKER_MAX = 48;

const clamp = (n, min, max, fallback) => Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;

// Wrap to the -180..180 the rotation slider and clamp both work in, so a full
// turn of the rotate handle doesn't stick at either end.
export const wrapDegrees = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;

// Keep sticker corners inside the circular crop, even when rotated. Width and
// height are independent so a sticker can be stretched; `size` is the old
// single-dimension field and is still read so saved profiles carry over.
export function constrainSticker(sticker) {
  const width = clamp(sticker.width ?? sticker.size, STICKER_MIN, STICKER_MAX, 26);
  const height = clamp(sticker.height ?? sticker.size, STICKER_MIN, STICKER_MAX, 26);
  let x = clamp(sticker.x, 0, 100, 50) - 50;
  let y = clamp(sticker.y, 0, 100, 50) - 50;
  // Half the diagonal, so the corners stay inside the circle at any rotation.
  const radius = Math.max(0, 49 - Math.hypot(width, height) / 2);
  const distance = Math.hypot(x, y);
  if (distance > radius) { x *= radius / distance; y *= radius / distance; }
  return {
    id: sticker.id,
    stickerId: sticker.stickerId,
    x: x + 50,
    y: y + 50,
    width,
    height,
    rotation: clamp(wrapDegrees(sticker.rotation), -180, 180, 0),
  };
}

export function normalizeAvatarStyle(value) {
  const background = AVATAR_BACKGROUNDS.some((b) => b.id === value?.background) ? value.background : 'original';
  const ids = new Set();
  const stickers = (Array.isArray(value?.stickers) ? value.stickers : [])
    .filter((s) => s && typeof s.id === 'string' && s.id.length > 0 && s.id.length <= 64 && AVATAR_STICKERS.some((item) => item.id === s.stickerId))
    .filter((s) => { if (ids.has(s.id)) return false; ids.add(s.id); return true; })
    .slice(0, MAX_STICKERS)
    .map((s) => constrainSticker({ id: s.id, stickerId: s.stickerId, x: s.x, y: s.y, width: s.width, height: s.height, size: s.size, rotation: s.rotation }));
  return { background, stickers };
}
