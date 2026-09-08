// Repairs bundler-generated image URLs stored in the database.
//
// Seed lessons reference images as ES imports, so Vite resolves them to a URL
// that differs per environment: `/src/assets/week1/globe.jpg` in dev,
// `/assets/globe-B0sootHm.jpg` in a build. When a teacher edits a seed lesson
// the editor clones that resolved URL into `lessons.layout`, freezing one
// environment's path into Postgres — which then 404s in the other, and again
// after any rebuild that changes the content hash.
//
// Rather than migrate the stored rows, we map the filename back to whatever URL
// this build uses. Strings that are not bundled assets (Supabase Storage,
// external links, data URIs) are returned untouched.

const MODULES = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp,svg,gif}', {
  eager: true,
  import: 'default',
})

// Keyed by filename *with* extension: week1 ships both simulation.jpg and
// simulation.jpeg, so the extension is what tells them apart.
const BY_FILENAME = new Map()
for (const [path, url] of Object.entries(MODULES)) {
  const filename = path.split('/').pop()
  if (filename) BY_FILENAME.set(filename.toLowerCase(), url)
}

// Only paths the bundler emits. Anything else is a URL we must not rewrite.
const BUNDLED_PATH = /^\/(?:assets|src\/assets)\//
// Vite appends 8 base64url characters before the extension in a build.
const CONTENT_HASH = /-[A-Za-z0-9_-]{8}(\.[A-Za-z0-9]+)$/

export function resolveLessonImage(src) {
  if (typeof src !== 'string' || !BUNDLED_PATH.test(src)) return src

  const filename = src.split('/').pop()?.toLowerCase()
  if (!filename) return src

  return (
    BY_FILENAME.get(filename.replace(CONTENT_HASH, '$1')) ??
    BY_FILENAME.get(filename) ??
    src
  )
}

// Walks arbitrary lesson JSON (layout blocks nest images at several depths and
// under several key names) and resolves every bundled asset path it contains.
export function resolveImagesDeep(value) {
  if (typeof value === 'string') return resolveLessonImage(value)
  if (Array.isArray(value)) return value.map(resolveImagesDeep)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = resolveImagesDeep(v)
    return out
  }
  return value
}
