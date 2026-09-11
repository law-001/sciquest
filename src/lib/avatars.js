// Curated, dev-controlled avatar catalog. Students pick from this set
// only — there are no user uploads, so an avatar value is just a short
// `id` string persisted on students.avatar.

// Mix-and-match characters, cut out of the supplied sheet into individual
// centred 512x512 transparent WebPs by scripts/build-avatar-assets.py. Add a
// row here (and a matching file) to offer another character — nothing else
// changes. These are the only avatars the picker offers.
// NOTE: `cat` is the fox artwork. The id is persisted on students.avatar so it
// stays as-is; only the label and file describe what is actually drawn.
export const CHARACTER_AVATARS = [
  { id: 'robot', label: 'Lab Buddy', file: 'robot' },
  { id: 'cat', label: 'Curious Fox', file: 'fox' },
  { id: 'frog', label: 'Pond Pal', file: 'frog' },
  { id: 'astronaut', label: 'Space Scout', file: 'astronaut' },
  { id: 'owl', label: 'Night Scholar', file: 'owl' },
  { id: 'sun', label: 'Sunny', file: 'sun' },
].map((a) => ({ ...a, src: `/avatars/characters/${a.file}.webp`, kind: 'image', category: 'character' }))

// Dev-supplied pictures. No longer offered in the picker, but kept in the
// catalog so a student who selected one before still resolves to it.
const IMAGE_AVATARS = [
  { id: 'profile', label: 'Profile', src: '/avatars/profile.jpg' },
].map((a) => ({ ...a, kind: 'image' }))

export const AVATARS = [...CHARACTER_AVATARS, ...IMAGE_AVATARS]

export function getAvatar(id) {
  if (!id) return null
  return AVATARS.find((a) => a.id === id) ?? null
}
