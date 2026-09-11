import { supabase } from './supabase'

// Requires the following table in Supabase:
//   create table sections (
//     id uuid primary key default gen_random_uuid(),
//     name text not null unique,
//     created_by_role text not null check (created_by_role in ('admin', 'teacher')),
//     created_at timestamptz not null default now()
//   );
//   alter table sections enable row level security;
//
//   -- Allow anonymous reads so the signup dropdown works for unauthenticated users:
//   create policy "sections_select" on sections for select using (true);
//
//   -- Only staff can insert/delete:
//   create policy "sections_insert" on sections for insert with check (
//     exists (select 1 from staff where id = auth.uid()));
//   create policy "sections_delete" on sections for delete using (
//     exists (select 1 from staff where id = auth.uid() and role = 'admin'));

// Used by the signup modal — no auth required (sections are not sensitive).
export async function fetchPublicSections() {
  const { data, error } = await supabase
    .from('sections')
    .select('id, name')
    .order('name')
  if (error) throw error
  return (data ?? []).map((s) => ({ id: s.id, name: s.name }))
}
export async function fetchAllSections() {
  const [sectionsRes, studentsRes] = await Promise.all([
    supabase.from('sections').select('id, name, created_by_role, created_at').order('name'),
    supabase.from('students').select('section'),
  ])
  if (sectionsRes.error) throw sectionsRes.error
  if (studentsRes.error) throw studentsRes.error

  const counts = new Map()
  for (const { section } of studentsRes.data ?? []) {
    if (section) counts.set(section, (counts.get(section) ?? 0) + 1)
  }

  return (sectionsRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    createdByRole: s.created_by_role,
    createdAt: s.created_at,
    students: counts.get(s.name) ?? 0,
  }))
}

export async function createSection(name, createdByRole = 'teacher') {
  const { data, error } = await supabase
    .from('sections')
    .insert({ name: name.trim(), created_by_role: createdByRole })
    .select('id, name, created_by_role, created_at')
    .single()
  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    createdByRole: data.created_by_role,
    createdAt: data.created_at,
    students: 0,
  }
}

export async function deleteSection(id) {
  const { error } = await supabase.from('sections').delete().eq('id', id)
  if (error) throw error
}

// The sections a teacher handles — the "My Sections" tab. RLS limits
// publishing to these (can_manage_section), so this is the list the server
// checks, not just a display preference.
export async function fetchTeacherSections(teacherId) {
  const { data, error } = await supabase
    .from('teacher_sections')
    .select('section')
    .eq('teacher_id', teacherId)
    .order('section')
  if (error) throw error
  return (data ?? []).map((row) => row.section)
}

export async function addTeacherSection(teacherId, section) {
  const { error } = await supabase
    .from('teacher_sections')
    .upsert(
      { teacher_id: teacherId, section },
      { onConflict: 'teacher_id,section', ignoreDuplicates: true },
    )
  if (error) throw error
}

export async function removeTeacherSection(teacherId, section) {
  const { error } = await supabase
    .from('teacher_sections')
    .delete()
    .eq('teacher_id', teacherId)
    .eq('section', section)
  if (error) throw error
}
