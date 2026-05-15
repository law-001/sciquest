import { supabase } from './supabase'

// All progress + quiz-attempt rows for a student. Called once after login;
// callers cache the result and update in-memory after writes.
export async function fetchProgress(studentId) {
  if (!studentId) return { completedLessons: [], attempts: [] }
  const [progressRes, attemptsRes] = await Promise.all([
    supabase
      .from('student_progress')
      .select('lesson_id, week_id, completed, completed_at')
      .eq('student_id', studentId)
      .eq('completed', true),
    supabase
      .from('quiz_attempts')
      .select('lesson_id, week_id, score, max_score, submitted_at')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false }),
  ])
  if (progressRes.error) throw progressRes.error
  if (attemptsRes.error) throw attemptsRes.error
  return {
    completedLessons: (progressRes.data ?? []).map((r) => r.lesson_id),
    attempts: attemptsRes.data ?? [],
  }
}

// Upsert on the unique (student_id, lesson_id) — re-completing is a no-op.
// Safe to call repeatedly.
export async function markLessonComplete(studentId, weekId, lessonId) {
  if (!studentId || !lessonId || !weekId) return
  const { error } = await supabase.from('student_progress').upsert(
    {
      student_id: studentId,
      week_id: weekId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_id' },
  )
  if (error) throw error
}

// Insert-only: every submission is preserved. Best-score is computed
// client-side from the attempt history.
export async function saveQuizAttempt({ studentId, weekId, lessonId, score, maxScore }) {
  if (!studentId || !lessonId || !weekId) return null
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      student_id: studentId,
      week_id: weekId,
      lesson_id: lessonId,
      score,
      max_score: maxScore,
    })
    .select('lesson_id, week_id, score, max_score, submitted_at')
    .single()
  if (error) throw error
  return data
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
