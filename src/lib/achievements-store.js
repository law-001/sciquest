import { supabase } from './supabase'
import { deriveUnlockedKeys, isAchievementKey } from './achievements'

// All achievement keys a student has unlocked. Called once after
// login alongside fetchProgress; the result is cached in App state.
export async function fetchAchievements(studentId) {
  if (!studentId) return []
  const { data, error } = await supabase
    .from('student_achievements')
    .select('achievement_key')
    .eq('student_id', studentId)
  if (error) throw error
  return (data ?? []).map((r) => r.achievement_key)
}

// Insert-or-ignore: re-awarding an already-unlocked achievement is a
// no-op thanks to the unique (student_id, achievement_key) constraint.
// Unknown keys are dropped so a typo can never persist a junk row.
export async function awardAchievements(studentId, keys) {
  const valid = [...new Set(keys)].filter(isAchievementKey)
  if (!studentId || valid.length === 0) return []
  const { error } = await supabase.from('student_achievements').upsert(
    valid.map((achievement_key) => ({ student_id: studentId, achievement_key })),
    { onConflict: 'student_id,achievement_key', ignoreDuplicates: true },
  )
  if (error) throw error
  return valid
}

// Evaluates the catalog against current progress, persists any newly
// met achievements, and returns the full unlocked set plus what was
// just unlocked. `alreadyUnlocked` is the cached list from
// fetchAchievements so we only write the diff.
export async function syncAchievements(studentId, ctx, alreadyUnlocked = []) {
  const have = new Set(alreadyUnlocked)
  const derived = deriveUnlockedKeys(ctx)
  const newlyUnlocked = derived.filter((k) => !have.has(k))
  if (studentId && newlyUnlocked.length > 0) {
    await awardAchievements(studentId, newlyUnlocked)
  }
  return {
    unlocked: [...new Set([...alreadyUnlocked, ...derived])],
    newlyUnlocked,
  }
}
