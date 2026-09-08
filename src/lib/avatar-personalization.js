import { Star, Heart, Sparkles, Crown, Glasses, Flower2, Leaf, Rocket, Atom, Zap, Music2, Rainbow } from 'lucide-react';

export const MAX_STICKERS = 6;
export const AVATAR_BACKGROUNDS = [
  { id: 'original', label: 'Original', className: 'bg-primary-500' },
  { id: 'sunrise', label: 'Sunrise', className: 'bg-gradient-to-br from-amber-300 to-orange-500' },
  { id: 'lagoon', label: 'Lagoon', className: 'bg-gradient-to-br from-teal-300 to-sky-600' },
  { id: 'meadow', label: 'Meadow', className: 'bg-gradient-to-br from-lime-300 to-emerald-600' },
  { id: 'peach', label: 'Peach', className: 'bg-gradient-to-br from-orange-200 to-rose-400' },
  { id: 'midnight', label: 'Midnight', className: 'bg-gradient-to-br from-slate-700 to-stone-950' },
];
export const AVATAR_STICKERS = [
  { id: 'star', label: 'Star', Glyph: Star, color: 'text-amber-500' },
  { id: 'heart', label: 'Heart', Glyph: Heart, color: 'text-rose-500' },
  { id: 'sparkles', label: 'Sparkles', Glyph: Sparkles, color: 'text-amber-500' },
  { id: 'crown', label: 'Crown', Glyph: Crown, color: 'text-orange-500' },
  { id: 'glasses', label: 'Glasses', Glyph: Glasses, color: 'text-stone-800' },
  { id: 'flower', label: 'Flower', Glyph: Flower2, color: 'text-rose-500' },
  { id: 'leaf', label: 'Leaf', Glyph: Leaf, color: 'text-emerald-600' },
  { id: 'rocket', label: 'Rocket', Glyph: Rocket, color: 'text-orange-600' },
  { id: 'atom', label: 'Atom', Glyph: Atom, color: 'text-teal-600' },
  { id: 'lightning', label: 'Lightning', Glyph: Zap, color: 'text-amber-500' },
  { id: 'music', label: 'Music', Glyph: Music2, color: 'text-teal-600' },
  { id: 'rainbow', label: 'Rainbow', Glyph: Rainbow, color: 'text-orange-500' },
];

const clamp = (n, min, max, fallback) => Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;

// Keep sticker corners inside the circular crop, even when rotated.
export function constrainSticker(sticker) {
  const size = clamp(sticker.size, 20, 38, 26);
  let x = clamp(sticker.x, 0, 100, 50) - 50;
  let y = clamp(sticker.y, 0, 100, 50) - 50;
  const radius = 49 - size * Math.SQRT1_2;
  const distance = Math.hypot(x, y);
  if (distance > radius) { x *= radius / distance; y *= radius / distance; }
  return { ...sticker, x: x + 50, y: y + 50, size, rotation: clamp(sticker.rotation, -180, 180, 0) };
}

export function normalizeAvatarStyle(value) {
  const background = AVATAR_BACKGROUNDS.some((b) => b.id === value?.background) ? value.background : 'original';
  const ids = new Set();
  const stickers = (Array.isArray(value?.stickers) ? value.stickers : [])
    .filter((s) => s && typeof s.id === 'string' && s.id.length > 0 && s.id.length <= 64 && AVATAR_STICKERS.some((item) => item.id === s.stickerId))
    .filter((s) => { if (ids.has(s.id)) return false; ids.add(s.id); return true; })
    .slice(0, MAX_STICKERS)
    .map((s) => constrainSticker({ id: s.id, stickerId: s.stickerId, x: s.x, y: s.y, size: s.size, rotation: s.rotation }));
  return { background, stickers };
}
