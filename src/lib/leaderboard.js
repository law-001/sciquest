import { supabase } from './supabase'
import { totalAchievementXp } from './achievements'

// Ranked XP leaderboard across all students. `period` is one of
// 'week' | 'month' | 'all'.
//
// XP is computed the SAME way the profile's "Total XP" is —
// lesson xp_awarded + quiz xp_awarded + the achievement-bonus XP from
// src/lib/achievements.js — so a student's rank always matches the
// total shown on their own profile. Achievement XP values live only
// in the JS catalog (never the DB), so this aggregation runs
// client-side; RLS already lets any authenticated user read every
// student's progress/attempts/achievement rows.
function cutoffMs(period) {
  if (period === 'week') return Date.now() - 7 * 86_400_000
  if (period === 'month') return Date.now() - 30 * 86_400_000
  return null
}

export async function fetchLeaderboard(period = 'all') {
  const since = cutoffMs(period)
  const within = (ts) =>
    since == null || (ts != null && new Date(ts).getTime() >= since)

  const [studentsRes, progressRes, attemptsRes, achRes] = await Promise.all([
    supabase.from('students').select('id, first_name, last_name, avatar'),
    supabase
      .from('student_progress')
      .select('student_id, xp_awarded, completed_at, created_at')
      .eq('completed', true),
    supabase.from('quiz_attempts').select('student_id, xp_awarded, submitted_at'),
    supabase
      .from('student_achievements')
      .select('student_id, achievement_key, unlocked_at'),
  ])
  for (const r of [studentsRes, progressRes, attemptsRes, achRes]) {
    if (r.error) throw r.error
  }

  const acc = new Map() // student_id → { xp, keys[] }
  const ensure = (id) => {
    let a = acc.get(id)
    if (!a) {
      a = { xp: 0, keys: [] }
      acc.set(id, a)
    }
    return a
  }
  for (const p of progressRes.data ?? []) {
    if (within(p.completed_at ?? p.created_at)) {
      ensure(p.student_id).xp += p.xp_awarded ?? 0
    }
  }
  for (const a of attemptsRes.data ?? []) {
    if (within(a.submitted_at)) ensure(a.student_id).xp += a.xp_awarded ?? 0
  }
  for (const ach of achRes.data ?? []) {
    if (within(ach.unlocked_at)) {
      ensure(ach.student_id).keys.push(ach.achievement_key)
    }
  }

  const rows = (studentsRes.data ?? [])
    .map((s) => {
      const a = acc.get(s.id) ?? { xp: 0, keys: [] }
      return {
        studentId: s.id,
        name:
          `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Student',
        avatar: s.avatar ?? null,
        xp: a.xp + totalAchievementXp(a.keys),
      }
    })
    .filter((r) => r.xp > 0)
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))

  // Dense-ranked: ties share a rank (matches the SQL rank() it replaced).
  let rank = 0
  let seen = 0
  let prevXp = null
  for (const r of rows) {
    seen += 1
    if (r.xp !== prevXp) {
      rank = seen
      prevXp = r.xp
    }
    r.rank = rank
  }
  return rows
}
