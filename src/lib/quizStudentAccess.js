// Per-student quiz access — lets a teacher re-open a closed quiz for one
// student (a make-up, or a deadline extension) without re-opening it for
// the whole class.
//
// A grant only matters while the quiz is closed for the class; App's
// isQuizLocked checks it after the week/individual publish state.
// `openUntil` null = open until the teacher removes the grant.
//
// RLS scopes reads: staff see every grant, a student sees only their own,
// so the same fetch serves both portals.

import { supabase } from './supabase'

function toGrant(row) {
  return {
    lessonId: row.lesson_id,
    studentId: row.student_id,
    openUntil: row.open_until,
  }
}

export async function fetchQuizAccessGrants() {
  const { data, error } = await supabase
    .from('quiz_student_access')
    .select('lesson_id, student_id, open_until')
  if (error) throw error
  return (data ?? []).map(toGrant)
}

// Upsert, so granting again to the same student moves their end time —
// that is how an existing window is extended.
export async function grantQuizAccess({ lessonId, studentId, openUntil }) {
  const { error } = await supabase
    .from('quiz_student_access')
    .upsert(
      {
        lesson_id: lessonId,
        student_id: studentId,
        open_until: openUntil,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id,student_id' },
    )
  if (error) throw error
}

export async function revokeQuizAccess({ lessonId, studentId }) {
  const { error } = await supabase
    .from('quiz_student_access')
    .delete()
    .eq('lesson_id', lessonId)
    .eq('student_id', studentId)
  if (error) throw error
}

export function isGrantActive(grant, now) {
  if (!grant) return false
  if (!grant.openUntil) return true
  return new Date(grant.openUntil).getTime() > now
}

// `now` defaults to the current time for event handlers; render code passes
// a ticking state value so the result stays stable between renders.
export function findActiveGrant(grants, lessonId, studentId, now = Date.now()) {
  const grant = grants.find(
    (g) => g.lessonId === lessonId && g.studentId === studentId,
  )
  return isGrantActive(grant, now) ? grant : null
}

export function subscribeToQuizAccess(onChange) {
  // Channel names must be unique per subscriber — duplicate names across
  // components silently break Supabase realtime.
  const channel = supabase
    .channel(`quiz_student_access_changes_${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'quiz_student_access' },
      () => onChange(),
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
