import { supabase } from './supabase'
import { WEEKS_DATA } from '../data/lessonsweek-01'
import { QUIZ_MIN_XP, QUIZ_XP_PER_CORRECT } from './xp-config'

// lesson_id → { title, category } from the static curriculum. Lesson ids are
// globally unique across weeks, so a flat map is safe.
const LESSON_INDEX = (() => {
  const map = new Map()
  for (const week of WEEKS_DATA ?? []) {
    for (const lesson of week.lessons ?? []) {
      map.set(lesson.id, { title: lesson.title, category: week.category })
    }
  }
  return map
})()

const TOTAL_LESSONS = LESSON_INDEX.size

function relativeTime(timestamp) {
  if (!timestamp) return '—'
  const diffMs = Date.now() - new Date(timestamp).getTime()
  if (Number.isNaN(diffMs)) return '—'
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (days < 30) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

function fullName(row) {
  const name = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim()
  return name || row.email || 'Unknown'
}

function scorePct({ score, maxScore }) {
  return maxScore ? Math.round((score / maxScore) * 100) : 0
}

// One aggregate read for the whole teacher portal. Sections are derived from
// the students.section column (there is no sections table); lesson titles and
// categories come from the static curriculum.
export async function fetchTeacherDashboard() {
  const [studentsRes, progressRes, attemptsRes] = await Promise.all([
    supabase.from('students').select('id, first_name, last_name, email, section'),
    supabase.from('student_progress').select('student_id, lesson_id').eq('completed', true),
    supabase
      .from('quiz_attempts')
      .select('id, student_id, lesson_id, score, max_score, pending_grade_count, answers, submitted_at')
      .order('submitted_at', { ascending: false }),
  ])
  if (studentsRes.error) throw studentsRes.error
  if (progressRes.error) throw progressRes.error
  if (attemptsRes.error) throw attemptsRes.error

  const progressRows = progressRes.data ?? []
  const attemptRows = attemptsRes.data ?? []

  // Build per-student accumulators.
  const byId = new Map()
  for (const s of studentsRes.data ?? []) {
    byId.set(s.id, {
      id: s.id,
      name: fullName(s),
      email: s.email ?? '—',
      section: s.section || 'Unassigned',
      completedCount: 0,
      best: new Map(), // lesson_id → { score, maxScore }
    })
  }

  for (const p of progressRows) {
    const st = byId.get(p.student_id)
    if (st) st.completedCount += 1
  }

  for (const a of attemptRows) {
    const st = byId.get(a.student_id)
    if (!st) continue
    const prev = st.best.get(a.lesson_id)
    if (!prev || a.score > prev.score) {
      st.best.set(a.lesson_id, { score: a.score, maxScore: a.max_score })
    }
  }

  // students[] — progress = % of curriculum completed, avgScore = mean best %.
  const students = [...byId.values()]
    .map((st) => {
      const bests = [...st.best.values()]
      const avgScore = bests.length
        ? Math.round(bests.reduce((sum, b) => sum + scorePct(b), 0) / bests.length)
        : 0
      return {
        id: st.id,
        name: st.name,
        email: st.email,
        section: st.section,
        progress: TOTAL_LESSONS ? Math.round((st.completedCount / TOTAL_LESSONS) * 100) : 0,
        avgScore,
        best: st.best,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  // sections[] — grouped by the section label.
  const bySection = new Map()
  for (const st of students) {
    if (!bySection.has(st.section)) bySection.set(st.section, [])
    bySection.get(st.section).push(st)
  }
  const sections = [...bySection.entries()]
    .map(([name, list]) => ({
      id: name,
      name,
      students: list.length,
      avgScore: list.length
        ? Math.round(list.reduce((sum, s) => sum + s.avgScore, 0) / list.length)
        : 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // lessons[] — only lessons with activity (completion or attempts), so the
  // teacher sees a meaningful list rather than the full 100+ curriculum.
  const completedBySection = new Map() // lesson_id → Map(section → count)
  for (const p of progressRows) {
    const st = byId.get(p.student_id)
    if (!st) continue
    if (!completedBySection.has(p.lesson_id)) completedBySection.set(p.lesson_id, new Map())
    const m = completedBySection.get(p.lesson_id)
    m.set(st.section, (m.get(st.section) ?? 0) + 1)
  }
  const activeLessonIds = new Set([
    ...progressRows.map((p) => p.lesson_id),
    ...attemptRows.map((a) => a.lesson_id),
  ])
  const lessons = [...activeLessonIds]
    .filter((id) => LESSON_INDEX.has(id))
    .map((id) => {
      const meta = LESSON_INDEX.get(id)
      const completion = {}
      const perSection = completedBySection.get(id)
      for (const sec of sections) {
        const total = bySection.get(sec.id)?.length ?? 0
        const done = perSection?.get(sec.id) ?? 0
        completion[sec.id] = total ? Math.round((done / total) * 100) : 0
      }
      return {
        id,
        title: meta.title,
        category: meta.category,
        status: 'Published',
        sections: sections.map((s) => s.id),
        completion,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  // submissions[] — newest first (query already ordered).
  const submissions = attemptRows.map((a) => {
    const st = byId.get(a.student_id)
    return {
      id: a.id,
      student: st?.name ?? 'Unknown',
      section: st?.section ?? 'Unassigned',
      quiz: LESSON_INDEX.get(a.lesson_id)?.title ?? a.lesson_id,
      lessonId: a.lesson_id,
      score: a.score,
      total: a.max_score,
      answers: a.answers ?? null,
      time: relativeTime(a.submitted_at),
      status: a.pending_grade_count > 0 ? 'pending' : 'graded',
    }
  })

  // quizColumns[] — lessons that have at least one attempt, for the gradebook.
  const attemptedIds = new Set(attemptRows.map((a) => a.lesson_id))
  const quizColumns = [...attemptedIds]
    .filter((id) => LESSON_INDEX.has(id))
    .map((id) => ({ id, title: LESSON_INDEX.get(id).title }))
    .sort((a, b) => a.title.localeCompare(b.title))

  return { sections, students, lessons, submissions, quizColumns }
}

// Score + XP a manual percentage grade yields. Kept on the same scale as
// auto-graded quizzes (QUIZ_XP_PER_CORRECT per scored unit, floored at
// QUIZ_MIN_XP for any submission) so a teacher-graded attempt and an
// auto-graded one of equal performance earn the same XP.
export function previewGrade(percent, maxScore) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0))
  const max = Math.max(0, Number(maxScore) || 0)
  const score = Math.round((pct / 100) * max)
  const xp = Math.max(QUIZ_MIN_XP, Math.round((pct / 100) * max * QUIZ_XP_PER_CORRECT))
  return { pct, score, xp }
}

// Writes a teacher's percentage grade onto a quiz attempt: sets the score,
// awards XP (which flows straight into the leaderboard + the student's
// profile total, both of which sum quiz_attempts.xp_awarded), and clears
// pending_grade_count so the submission no longer shows as "pending".
// Gated by the staff_grade_attempts RLS policy.
export async function gradeQuizAttempt({ attemptId, percent, maxScore }) {
  if (!attemptId) throw new Error('Missing attempt id')
  const { score, xp } = previewGrade(percent, maxScore)
  const { error } = await supabase
    .from('quiz_attempts')
    .update({ score, xp_awarded: xp, pending_grade_count: 0 })
    .eq('id', attemptId)
  if (error) throw error
  return { score, xp }
}
