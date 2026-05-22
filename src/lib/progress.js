import { supabase } from './supabase'

// All progress + quiz-attempt rows for a student. Called once after login;
// callers cache the result and update in-memory after writes.
export async function fetchProgress(studentId) {
  if (!studentId) return { completedLessons: [], attempts: [] }
  const [progressRes, attemptsRes] = await Promise.all([
    supabase
      .from('student_progress')
      .select('lesson_id, week_id, completed, completed_at, xp_awarded')
      .eq('student_id', studentId)
      .eq('completed', true),
    supabase
      .from('quiz_attempts')
      .select('id, lesson_id, week_id, score, max_score, xp_awarded, pending_grade_count, submitted_at')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false }),
  ])
  if (progressRes.error) throw progressRes.error
  if (attemptsRes.error) throw attemptsRes.error
  return {
    completedLessons: (progressRes.data ?? []).map((r) => r.lesson_id),
    completedRows: progressRes.data ?? [],
    attempts: attemptsRes.data ?? [],
  }
}

// Upsert on the unique (student_id, lesson_id) — re-completing is a no-op.
// `xpAwarded` is captured at completion time and frozen on the row so a later
// XP config change doesn't retroactively rewrite history.
export async function markLessonComplete(studentId, weekId, lessonId, xpAwarded = 0) {
  if (!studentId || !lessonId || !weekId) return
  const { error } = await supabase.from('student_progress').upsert(
    {
      student_id: studentId,
      week_id: weekId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
      xp_awarded: xpAwarded,
    },
    { onConflict: 'student_id,lesson_id' },
  )
  if (error) throw error
}

// Insert-only: every submission is preserved. Best-score is computed
// client-side from the attempt history.
export async function saveQuizAttempt({
  studentId,
  weekId,
  lessonId,
  score,
  maxScore,
  xpAwarded = 0,
  pendingGradeCount = 0,
  answers = null,
}) {
  if (!studentId || !lessonId || !weekId) return null
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      student_id: studentId,
      week_id: weekId,
      lesson_id: lessonId,
      score,
      max_score: maxScore,
      xp_awarded: xpAwarded,
      pending_grade_count: pendingGradeCount,
      answers,
    })
    .select('id, lesson_id, week_id, score, max_score, xp_awarded, pending_grade_count, submitted_at')
    .single()
  if (error) throw error
  return data
}

// Total XP a student has accrued — sum across completed lessons + every
// quiz attempt. Quiz XP is per-attempt (so retries genuinely earn more if
// the student improves their score).
export function totalXpEarned(completedRows, attempts) {
  let xp = 0
  for (const row of completedRows ?? []) xp += row.xp_awarded ?? 0
  for (const a of attempts ?? []) xp += a.xp_awarded ?? 0
  return xp
}

// Best (highest) score per lesson from an attempt list — used to render
// "Quiz score: 8/10" on lesson cards. Returns a Map keyed by lessonId.
export function bestScoresByLesson(attempts) {
  const map = new Map()
  for (const a of attempts ?? []) {
    const prev = map.get(a.lesson_id)
    if (!prev || a.score > prev.score) {
      map.set(a.lesson_id, { score: a.score, maxScore: a.max_score })
    }
  }
  return map
}

// A week is done when every lesson in it appears in `completedLessons`.
export function completedWeekIds(weeksData, completedLessons) {
  const done = new Set()
  const completed = new Set(completedLessons ?? [])
  for (const week of weeksData ?? []) {
    if (week.lessons?.length && week.lessons.every((l) => completed.has(l.id))) {
      done.add(week.id)
    }
  }
  return done
}
