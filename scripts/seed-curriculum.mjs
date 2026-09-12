// Seeds the `lessons` and `quizzes` tables from the static curriculum in
// src/data/, so that what teachers edit in the portal is a real database row
// rather than a hardcoded file.
//
// Usage:
//   npm run seed:curriculum              # seed, preserving teacher edits
//   npm run seed:curriculum -- --force   # also overwrite teacher-edited rows
//   npm run seed:curriculum -- --dry-run # report what would change, write nothing
//
// Requires in .env.local (or the environment):
//   VITE_SUPABASE_URL           (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY   — the service_role key, NOT the anon key.
//     RLS restricts writes on these tables to staff with role teacher/admin,
//     and a script has no session; the service role bypasses RLS. Keep this key
//     out of the client bundle and out of version control.
//
// Why Vite loads the data instead of plain `import`:
//   src/data/lessonsweek-*.js import .jpg/.webp assets, which Node cannot
//   resolve. Vite's ssrLoadModule applies the same resolution the app uses and
//   hands back the asset URL as a string. Those URLs are stored as-is —
//   resolveLessonImage() in src/lib/lessonImages.js maps them back by filename
//   to whatever URL the current build emits, so a dev-server path still
//   resolves correctly in production.

import process from 'node:process'
import { createServer } from 'vite'
import { createClient } from '@supabase/supabase-js'

const args = new Set(process.argv.slice(2))
const FORCE = args.has('--force')
const DRY_RUN = args.has('--dry-run')

// ── Environment ──────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '\n  Missing credentials.\n\n' +
      '  Add to .env.local:\n' +
      '    VITE_SUPABASE_URL=https://<project>.supabase.co\n' +
      '    SUPABASE_SERVICE_ROLE_KEY=<service_role key from Supabase → Settings → API>\n\n' +
      '  The anon key will not work: RLS limits writes to teacher/admin staff.\n',
  )
  process.exit(1)
}

// ── Load the curriculum through Vite ─────────────────────────────────────────

async function loadCurriculum() {
  const server = await createServer({
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  })
  try {
    const lessonsMod = await server.ssrLoadModule('/src/data/lessonsweek-01.js')
    const quizzesMod = await server.ssrLoadModule('/src/data/quizzesweek-01.js')
    return {
      weeks: lessonsMod.WEEKS_DATA,
      quizzes: quizzesMod.QUIZZES_DATA,
    }
  } finally {
    await server.close()
  }
}

// ── Row mapping (app camelCase → DB snake_case) ──────────────────────────────

// `signature` is deliberately absent: it is developer-owned code with no column,
// and mergeWeeks() in LessonsDataContext re-attaches it from the static seed.
function lessonToRow(lesson, weekId) {
  return {
    id: lesson.id,
    week_id: weekId,
    lesson_number: lesson.lessonNumber ?? 999,
    title: lesson.title,
    badge: lesson.badge ?? null,
    subtitle: lesson.subtitle ?? null,
    read_time: lesson.readTime ?? '~15 min read',
    xp: typeof lesson.xp === 'number' ? lesson.xp : 50,
    hero_image_url: lesson.heroImage ?? null,
    hero_image_alt: lesson.heroImageAlt ?? null,
    sections: lesson.sections ?? [],
    references: lesson.references ?? [],
    layout: lesson.layout ?? [],
    is_custom: false,
    is_hidden: false,
    created_by: null,
  }
}

function quizToRow(quiz, lessonId) {
  return {
    lesson_id: lessonId,
    title: quiz.title,
    description: quiz.description ?? null,
    time_limit: quiz.timeLimit ?? 900,
    questions: quiz.questions ?? [],
    is_custom: false,
    is_hidden: false,
    created_by: null,
  }
}

// A row whose updated_at has moved past created_at was changed after it was
// seeded — i.e. a teacher edited it. The bump_updated_at trigger fires only on
// UPDATE, so on a fresh insert the two timestamps are equal.
function wasEditedByTeacher(row) {
  if (!row) return false
  if (row.created_by) return true
  if (!row.created_at || !row.updated_at) return false
  return new Date(row.updated_at).getTime() - new Date(row.created_at).getTime() > 1000
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { weeks, quizzes } = await loadCurriculum()

  const lessonRows = []
  for (const week of weeks) {
    for (const lesson of week.lessons ?? []) {
      lessonRows.push(lessonToRow(lesson, week.id))
    }
  }

  const validIds = new Set(lessonRows.map((r) => r.id))
  const quizRows = []
  for (const [lessonId, quiz] of Object.entries(quizzes)) {
    if (!validIds.has(lessonId)) {
      console.warn(`  ! quiz "${lessonId}" has no matching lesson — skipped`)
      continue
    }
    quizRows.push(quizToRow(quiz, lessonId))
  }

  console.log(
    `\n  Curriculum loaded: ${weeks.length} weeks, ${lessonRows.length} lessons, ${quizRows.length} quizzes`,
  )
  console.log(`  Target: ${SUPABASE_URL}`)
  console.log(
    `  Mode:   ${DRY_RUN ? 'DRY RUN (no writes)' : FORCE ? 'FORCE (overwrites teacher edits)' : 'preserve teacher edits'}\n`,
  )

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Existing rows, so teacher edits can be left alone.
  const [{ data: existingLessons, error: le }, { data: existingQuizzes, error: qe }] =
    await Promise.all([
      supabase.from('lessons').select('id, created_by, created_at, updated_at'),
      supabase.from('quizzes').select('lesson_id, created_by, created_at, updated_at'),
    ])
  if (le) throw new Error(`reading lessons: ${le.message}`)
  if (qe) throw new Error(`reading quizzes: ${qe.message}`)

  const lessonById = new Map((existingLessons ?? []).map((r) => [r.id, r]))
  const quizById = new Map((existingQuizzes ?? []).map((r) => [r.lesson_id, r]))

  const skippedLessons = []
  const toWriteLessons = lessonRows.filter((row) => {
    if (!FORCE && wasEditedByTeacher(lessonById.get(row.id))) {
      skippedLessons.push(row.id)
      return false
    }
    return true
  })

  const skippedQuizzes = []
  const toWriteQuizzes = quizRows.filter((row) => {
    if (!FORCE && wasEditedByTeacher(quizById.get(row.lesson_id))) {
      skippedQuizzes.push(row.lesson_id)
      return false
    }
    return true
  })

  if (DRY_RUN) {
    console.log(`  would write   ${toWriteLessons.length} lessons, ${toWriteQuizzes.length} quizzes`)
    console.log(`  would preserve ${skippedLessons.length} lessons, ${skippedQuizzes.length} quizzes\n`)
    if (skippedLessons.length) console.log(`  preserved lessons: ${skippedLessons.join(', ')}`)
    if (skippedQuizzes.length) console.log(`  preserved quizzes: ${skippedQuizzes.join(', ')}`)
    console.log()
    return
  }

  // Chunked so a single oversized request cannot fail the whole run.
  const CHUNK = 10
  for (let i = 0; i < toWriteLessons.length; i += CHUNK) {
    const chunk = toWriteLessons.slice(i, i + CHUNK)
    const { error } = await supabase.from('lessons').upsert(chunk, { onConflict: 'id' })
    if (error) throw new Error(`writing lessons ${i}–${i + chunk.length}: ${error.message}`)
    console.log(`  lessons  ${Math.min(i + CHUNK, toWriteLessons.length)}/${toWriteLessons.length}`)
  }

  for (let i = 0; i < toWriteQuizzes.length; i += CHUNK) {
    const chunk = toWriteQuizzes.slice(i, i + CHUNK)
    const { error } = await supabase.from('quizzes').upsert(chunk, { onConflict: 'lesson_id' })
    if (error) throw new Error(`writing quizzes ${i}–${i + chunk.length}: ${error.message}`)
    console.log(`  quizzes  ${Math.min(i + CHUNK, toWriteQuizzes.length)}/${toWriteQuizzes.length}`)
  }

  console.log(
    `\n  Done. ${toWriteLessons.length} lessons and ${toWriteQuizzes.length} quizzes written.`,
  )
  if (skippedLessons.length || skippedQuizzes.length) {
    console.log(
      `  Preserved ${skippedLessons.length} teacher-edited lessons and ${skippedQuizzes.length} quizzes. Re-run with --force to overwrite them.`,
    )
  }
  console.log()
}

main().catch((err) => {
  console.error(`\n  Seed failed: ${err.message}\n`)
  process.exit(1)
})
