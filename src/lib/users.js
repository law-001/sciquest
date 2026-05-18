import { supabase } from './supabase'

const STUDENT_COLUMNS = 'id, first_name, last_name, email, section, created_at'
const STAFF_COLUMNS = 'id, role, first_name, last_name, email, created_at'
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

function fullName(row) {
  const name = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim()
  return name || row.email || 'Unknown'
}

// students/staff row → shape consumed by the admin Users / Recent Users tables.
// `status` is hardcoded "Active": neither table has an activity column yet.
function toUserRow(row, role) {
  return {
    id: row.id,
    name: fullName(row),
    role: ROLE_LABELS[role] ?? 'Student',
    email: row.email ?? '—',
    status: 'Active',
    joined: relativeTime(row.created_at),
    section: row.section || '—',
  }
}

// All non-admin users (students + teachers) for the admin Users table.
export async function fetchUsers() {
  const [studentsRes, teachersRes] = await Promise.all([
    supabase.from('students').select(STUDENT_COLUMNS).order('created_at', { ascending: false }),
    supabase.from('staff').select(STAFF_COLUMNS).eq('role', 'teacher').order('created_at', { ascending: false }),
  ])
  if (studentsRes.error) throw studentsRes.error
  if (teachersRes.error) throw teachersRes.error
  const tagged = [
    ...(studentsRes.data ?? []).map((r) => ({ row: r, role: 'student' })),
    ...(teachersRes.data ?? []).map((r) => ({ row: r, role: 'teacher' })),
  ]
  return tagged
    .sort((a, b) => new Date(b.row.created_at).getTime() - new Date(a.row.created_at).getTime())
    .map(({ row, role }) => toUserRow(row, role))
}

// Most-recently-joined users across both tables (admins included).
export async function fetchRecentUsers(limit = 5) {
  const [studentsRes, staffRes] = await Promise.all([
    supabase.from('students').select(STUDENT_COLUMNS).order('created_at', { ascending: false }).limit(limit),
    supabase.from('staff').select(STAFF_COLUMNS).order('created_at', { ascending: false }).limit(limit),
  ])
  if (studentsRes.error) throw studentsRes.error
  if (staffRes.error) throw staffRes.error
  const tagged = [
    ...(studentsRes.data ?? []).map((r) => ({ row: r, role: 'student', ts: r.created_at })),
    ...(staffRes.data ?? []).map((r) => ({ row: r, role: r.role, ts: r.created_at })),
  ]
  return tagged
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, limit)
    .map(({ row, role }) => toUserRow(row, role))
}

export async function fetchTeachers() {
  const { data, error } = await supabase
    .from('staff')
    .select(STAFF_COLUMNS)
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
  const [students, teachers, completed] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('staff').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
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
  const { data, error } = await supabase.from('students').select('section')
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

// Updates the signed-in student's own editable fields. RLS
// (own_student_update) restricts this to their own row.
export async function updateStudentProfile(studentId, { firstName, lastName, avatar }) {
  if (!studentId) return
  const patch = { first_name: firstName, last_name: lastName }
  // Only touch the avatar column when the caller supplies one, so name-only
  // edits don't wipe a previously chosen avatar.
  if (avatar !== undefined) patch.avatar = avatar
  const { error } = await supabase
    .from('students')
    .update(patch)
    .eq('id', studentId)
  if (error) throw error
}

// Deletes an auth user (cascades to students/staff + student_progress) via the
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

// Wipes a user's learning/game data (progress, quiz attempts, game records)
// while keeping their auth account + students/staff row, via the
// admin-wipe-user-data Edge Function. Used to reset a test account.
export async function wipeUserData(userId) {
  const { data, error } = await supabase.functions.invoke('admin-wipe-user-data', {
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
