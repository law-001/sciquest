import {
  Atom,
  FlaskConical,
  Microscope,
  Dna,
  Leaf,
  Globe2,
  Telescope,
  Rocket,
} from 'lucide-react'

// Curated, dev-controlled avatar catalog. Students pick from this set
// only — there are no user uploads, so an avatar value is just a short
// `id` string persisted on students.avatar.
//
// Two kinds of entry:
//  - kind: 'svg'   — built-in, drawn from a lucide glyph on a brand
//                     gradient. Needs no asset file.
//  - kind: 'image' — a picture the dev drops into /public/avatars/.
//                     Add the file, then add an entry to IMAGE_AVATARS.

// Brand gradients (Tailwind tokens only — see Visual Design Spec).
const SVG_AVATARS = [
  { id: 'atom', label: 'Atom', Glyph: Atom, gradient: 'from-primary-500 to-amber-400' },
  { id: 'flask', label: 'Chemist', Glyph: FlaskConical, gradient: 'from-teal-500 to-sky-400' },
  { id: 'microscope', label: 'Microscope', Glyph: Microscope, gradient: 'from-amber-400 to-primary-500' },
  { id: 'dna', label: 'Geneticist', Glyph: Dna, gradient: 'from-emerald-500 to-teal-400' },
  { id: 'leaf', label: 'Botanist', Glyph: Leaf, gradient: 'from-lime-500 to-emerald-400' },
  { id: 'globe', label: 'Earth Explorer', Glyph: Globe2, gradient: 'from-sky-500 to-teal-400' },
  { id: 'telescope', label: 'Astronomer', Glyph: Telescope, gradient: 'from-primary-500 to-rose-400' },
  { id: 'rocket', label: 'Rocketeer', Glyph: Rocket, gradient: 'from-amber-500 to-primary-500' },
].map((a) => ({ ...a, kind: 'svg' }))

// Dev-supplied pictures. Drop the file in /public/avatars/, then add a
// row here. `src` is resolved from the site root (Vite serves /public).
// Example:
//   { id: 'einstein', label: 'Einstein', src: '/avatars/einstein.png' }
const IMAGE_AVATARS = [
  { id: 'profile', label: 'Profile', src: '/avatars/profile.jpg' },
].map((a) => ({ ...a, kind: 'image' }))

const CHARACTER_AVATARS = [
  { id: 'robot', label: 'Lab Buddy', character: 'robot', gradient: 'from-teal-400 to-teal-700' },
  { id: 'cat', label: 'Curious Cat', character: 'cat', gradient: 'from-orange-300 to-rose-400' },
  { id: 'frog', label: 'Pond Pal', character: 'frog', gradient: 'from-teal-400 to-emerald-700' },
  { id: 'astronaut', label: 'Space Scout', character: 'astronaut', gradient: 'from-slate-600 to-stone-950' },
  { id: 'owl', label: 'Night Scholar', character: 'owl', gradient: 'from-amber-300 to-orange-500' },
  { id: 'sun', label: 'Sunny', character: 'sun', gradient: 'from-orange-400 to-rose-500' },
].map((a) => ({ ...a, kind: 'character' }))

export const AVATARS = [...CHARACTER_AVATARS, ...SVG_AVATARS, ...IMAGE_AVATARS]

export function getAvatar(id) {
  if (!id) return null
  return AVATARS.find((a) => a.id === id) ?? null
}
