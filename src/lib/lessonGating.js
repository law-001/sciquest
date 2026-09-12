// Gating rules — keep one source of truth so the lesson grid, the
// lesson tab nav, and the App's "start week" handler all agree.
//
// Lesson within a week:
//   * lesson at index 0 is always available (once the week itself is unlocked)
//   * lesson at index i requires the quiz for lesson i-1 to be submitted
//     (reading the lesson alone is no longer enough — they must take the quiz)
//
// Week:
//   * the week must be in the published set, AND
//   * the week is unlocked if any of these is true:
//       (a) it is the first week,
//       (b) the teacher flagged it "open for all" (openIds set),
//       (c) every lesson in the previous week has a submitted quiz attempt.
//
// `publishedIds` is resolvePublishIds(state, section, 'lessons'); a null
// value means "all published" (default before any teacher toggle).
// `openIds` is resolvePublishIds(state, section, 'open'); null/empty means
// "no week is open-for-all" (the default).

import { isWeekPublished, isWeekOpen } from './publishedWeeks'

// A lesson is "passed" once the student has submitted at least one quiz
// attempt for it. Derived from the quizAttempts rows.
export function lessonsPassedFromAttempts(quizAttempts) {
  if (!Array.isArray(quizAttempts)) return []
  return [...new Set(quizAttempts.map((a) => a.lesson_id).filter(Boolean))]
}

export function isLessonUnlocked(weekLessons, lessonId, lessonsPassed) {
  const idx = weekLessons.findIndex((l) => l.id === lessonId)
  if (idx <= 0) return true
  const prev = weekLessons[idx - 1]
  return lessonsPassed.includes(prev.id)
}

export function isWeekFullyCompleted(week, lessonsPassed) {
  if (!week?.lessons) return false
  // Weeks 10 and 20 are periodical-examination weeks and carry no lessons, so
  // there is no quiz a student could submit to "complete" them. Treat a
  // lesson-less week as done, or it would permanently lock every week after it.
  if (week.lessons.length === 0) return true
  return week.lessons.every((l) => lessonsPassed.includes(l.id))
}

export function isWeekUnlocked(week, weeksData, lessonsPassed, publishedIds, openIds) {
  if (!week) return false
  if (!isWeekPublished(week.id, publishedIds)) return false
  if (isWeekOpen(week.id, openIds)) return true

  const idx = weeksData.findIndex((w) => w.id === week.id)
  if (idx <= 0) return true

  const prev = weeksData[idx - 1]
  if (!prev) return true

  return isWeekFullyCompleted(prev, lessonsPassed)
}

export function weekLockReason(week, weeksData, lessonsPassed, publishedIds, openIds) {
  if (!week) return null
  if (!isWeekPublished(week.id, publishedIds)) return 'unpublished'
  if (isWeekOpen(week.id, openIds)) return null
  const idx = weeksData.findIndex((w) => w.id === week.id)
  if (idx <= 0) return null
  const prev = weeksData[idx - 1]
  if (!prev) return null
  if (!isWeekFullyCompleted(prev, lessonsPassed)) return 'prev-week-incomplete'
  return null
}
