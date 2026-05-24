// Gating rules — keep one source of truth so the lesson grid, the
// lesson tab nav, and the App's "start week" handler all agree.
//
// Lesson within a week:
//   * lesson at index 0 is always available (once the week itself is unlocked)
//   * lesson at index i requires lesson i-1 to be completed
//
// Week:
//   * the week must be in the published set
//   * AND the previous week (if it exists) must be either
//       (a) fully completed by the student, or
//       (b) currently unpublished by the teacher
//     — case (b) is the "teacher closed week 1 but published week 2" escape
//       hatch the user asked for.
//
// `publishedIds` is the Set returned by getPublishedWeekIds(); a null
// value means "all published" (default before any teacher toggle).

import { isWeekPublished } from './publishedWeeks'

export function isLessonUnlocked(weekLessons, lessonId, completedLessons) {
  const idx = weekLessons.findIndex((l) => l.id === lessonId)
  if (idx <= 0) return true
  const prev = weekLessons[idx - 1]
  return completedLessons.includes(prev.id)
}

export function isWeekFullyCompleted(week, completedLessons) {
  if (!week?.lessons?.length) return false
  return week.lessons.every((l) => completedLessons.includes(l.id))
}

export function isWeekUnlocked(week, weeksData, completedLessons, publishedIds) {
  if (!week) return false
  if (!isWeekPublished(week.id, publishedIds)) return false

  const idx = weeksData.findIndex((w) => w.id === week.id)
  if (idx <= 0) return true

  const prev = weeksData[idx - 1]
  if (!prev) return true

  // Teacher unpublished the previous week → don't make the student wait on it.
  if (!isWeekPublished(prev.id, publishedIds)) return true

  return isWeekFullyCompleted(prev, completedLessons)
}

export function weekLockReason(week, weeksData, completedLessons, publishedIds) {
  if (!week) return null
  if (!isWeekPublished(week.id, publishedIds)) return 'unpublished'
  const idx = weeksData.findIndex((w) => w.id === week.id)
  if (idx <= 0) return null
  const prev = weeksData[idx - 1]
  if (!prev) return null
  if (!isWeekPublished(prev.id, publishedIds)) return null
  if (!isWeekFullyCompleted(prev, completedLessons)) return 'prev-week-incomplete'
  return null
}
