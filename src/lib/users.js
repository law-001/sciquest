import { supabase } from './supabase'

const PROFILE_COLUMNS = 'id, role, first_name, last_name, email, section, created_at'
const ROLE_LABELS = { admin: 'Admin', teacher: 'Teacher', student: 'Student' }

function relativeTime(timestamp) {
  if (!timestamp) return '—'
  const diffMs = Date.now() - new Date(timestamp).getTime()
  if (Number.isNaN(diffMs)) return '—'
  const days = Math.floor(diffMs / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (days < 30) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  if (days < 365) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(days / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

function fullName(profile) {
  const name = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
  return name || profile.email || 'Unknown'
}

// profiles row → shape consumed by the admin Users / Recent Users tables.
// `status` is hardcoded "Active": the profiles table has no activity column yet.
function toUserRow(profile) {
  return {
    id: profile.id,
    name: fullName(profile),
    role: ROLE_LABELS[profile.role] ?? 'Student',
    email: profile.email ?? '—',
    status: 'Active',
    joined: relativeTime(profile.created_at),
    section: profile.section || '—',
  }
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .neq('role', 'admin')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toUserRow)
}

export async function fetchRecentUsers(limit = 5) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map(toUserRow)
}

export async function fetchTeachers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('role', 'teacher')
    .order('created_at', { ascending: false })
  if (error) throw error
  // classes / students have no backing tables yet — left as 0.
  return (data ?? []).map((p) => ({
    id: p.id,
    name: fullName(p),
    email: p.email ?? '—',
    classes: 0,
    students: 0,
    status: 'Active',
    joined: relativeTime(p.created_at),
  }))
}

// Counts for the admin dashboard stat cards. `completedLessons` comes from
// student_progress — there is no quiz-attempts table yet.
export async function fetchDashboardCounts() {
  const countProfiles = (role) =>
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', role)
  const [students, teachers, completed] = await Promise.all([
    countProfiles('student'),
    countProfiles('teacher'),
    supabase.from('student_progress').select('id', { count: 'exact', head: true }).eq('completed', true),
  ])
  for (const result of [students, teachers, completed]) {
    if (result.error) throw result.error
  }
  return {
    students: students.count ?? 0,
    teachers: teachers.count ?? 0,
    completedLessons: completed.count ?? 0,
  }
}

// Student head-count per section, sorted largest first. Supabase has no GROUP BY
// over the JS client, so we tally the `section` column client-side.
export async function fetchSectionCounts() {
  const { data, error } = await supabase
    .from('profiles')
    .select('section')
    .eq('role', 'student')
  if (error) throw error
  const counts = new Map()
  for (const { section } of data ?? []) {
    const label = section || 'Unassigned'
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

// Deletes an auth user (cascades to profiles + student_progress) via the
// admin-delete-user Edge Function — the anon key cannot touch auth.users directly.
export async function deleteUser(userId) {
  const { data, error } = await supabase.functions.invoke('admin-delete-user', {
    body: { userId },
  })
  if (error) {
    let message = error.message
    try {
      const body = await error.context?.json()
      if (body?.error) message = body.error
    } catch {
      // fall back to the generic message
    }
    throw new Error(message)
  }
  if (data?.error) throw new Error(data.error)
  return data
}
