import { supabase } from './supabase'
import { totalAchievementXp } from './achievements'

// Ranked XP leaderboard across all students. `period` is one of
// 'week' | 'month' | 'all'.
//
// XP is computed the SAME way the profile's "Total XP" is —
// lesson xp_awarded + quiz xp_awarded + the achievement-bonus XP from
// src/lib/achievements.js — so a student's rank always matches the
// total shown on their own profile. Students can't read each other's rows,
// so the leaderboard_entries RPC returns per-student lesson + quiz XP and
// achievement keys; achievement XP values live only in the JS catalog, so
// they are added here.
function cutoffMs(period) {
  if (period === 'week') return Date.now() - 7 * 86_400_000
  if (period === 'month') return Date.now() - 30 * 86_400_000
  return null
}

export async function fetchLeaderboard(period = 'all') {
  const since = cutoffMs(period)
  const { data, error } = await supabase.rpc('leaderboard_entries', {
    p_since: since == null ? null : new Date(since).toISOString(),
  })
  if (error) throw error

  const rows = (data ?? [])
    .map((s) => ({
      studentId: s.student_id,
      name: `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Student',
      avatar: s.avatar ?? null,
      avatarStyle: s.avatar_style,
      xp: Number(s.progress_xp ?? 0) + totalAchievementXp(s.achievement_keys ?? []),
    }))
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
