// Per-student completion of interactive lesson blocks.
//
// Deliberately isolated from achievements and grading: nothing here feeds
// syncAchievements() or quiz_attempts. Interaction XP contributes to the
// profile XP total only.

import { supabase } from './supabase'

// Every interaction row for a student. Called once after login alongside
// fetchProgress; callers cache the result and update in memory after writes.
export async function fetchInteractions(studentId) {
  if (!studentId) return []
  const { data, error } = await supabase
    .from('lesson_interactions')
    .select('lesson_id, block_id, block_type, xp_awarded, completed_at')
    .eq('student_id', studentId)
    .eq('completed', true)
  if (error) throw error
  return data ?? []
}

// Upsert on the unique (student_id, lesson_id, block_id). Re-completing a block
// is a no-op for XP: `ignoreDuplicates` leaves the original row — and its frozen
// xp_awarded — untouched, so resetting a block can't farm XP.
export async function recordInteraction({ studentId, lessonId, blockId, blockType, xp = 0 }) {
  if (!studentId || !lessonId || !blockId) return
  const { error } = await supabase.from('lesson_interactions').upsert(
    {
      student_id: studentId,
      lesson_id: lessonId,
      block_id: blockId,
      block_type: blockType ?? null,
      completed: true,
      xp_awarded: xp,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_id,block_id', ignoreDuplicates: true },
  )
  if (error) throw error
}

export function totalInteractionXp(rows) {
  let xp = 0
  for (const row of rows ?? []) xp += row.xp_awarded ?? 0
  return xp
}

// Set of `${lessonId}::${blockId}` keys, for O(1) "is this block done" lookups.
export function interactionKeySet(rows) {
  return new Set((rows ?? []).map((r) => `${r.lesson_id}::${r.block_id}`))
}
