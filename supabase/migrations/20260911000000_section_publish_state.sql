-- ============================================================
-- Migration: per-section publishing
--
-- Publishing used to be one global switch: a teacher hiding week 3 hid it
-- for every section, including sections she does not handle, and RLS let any
-- staff member write it. This makes publish state per section and lets a
-- teacher write it only for the sections she handles.
--
--   * `teacher_sections` — the sections each teacher handles (the teacher
--     portal's "My Sections" tab). Previously browser localStorage, which the
--     server could not check.
--   * `section_publish_state` — a section's override of a publish scope. A
--     section with no row for a scope inherits the global
--     `course_publish_state` row; with no row there either, the built-in
--     default applies (every week published, nothing open, nothing hidden).
--   * New scope 'lessons-individual' — lesson ids hidden for a section.
--     Replaces the global `lesyes sons.is_hidden` toggle. Lessons hidden that way
--     move into the global 'lessons-individual' row, so no section sees a
--     change until one of its teachers toggles something.
--   * `course_publish_state` becomes admin-only to write: it is now the
--     default every section inherits.
--   * `is_quiz_open_for()` resolves the student's section state.
--   * `quiz_student_access` writes are limited to teachers of the student's
--     section (reads stay open to all staff).
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter publication supabase_realtime drop table public.section_publish_state;
--   update public.lessons set is_hidden = true
--     where id = any((select week_ids from public.course_publish_state
--                     where scope = 'lessons-individual'));
--   delete from public.course_publish_state where scope = 'lessons-individual';
--   alter table public.course_publish_state drop constraint if exists course_publish_state_scope_check;
--   alter table public.course_publish_state add constraint course_publish_state_scope_check
--     check (scope in ('lessons', 'quizzes', 'open', 'quizzes-individual'));
--   drop policy if exists "admin_write_publish_state" on public.course_publish_state;
--   create policy "staff_write_publish_state" on public.course_publish_state for all to authenticated
--     using (exists (select 1 from public.staff where id = auth.uid()))
--     with check (exists (select 1 from public.staff where id = auth.uid()));
--   drop policy if exists "staff_read_quiz_access" on public.quiz_student_access;
--   drop policy if exists "section_staff_insert_quiz_access" on public.quiz_student_access;
--   drop policy if exists "section_staff_update_quiz_access" on public.quiz_student_access;
--   drop policy if exists "section_staff_delete_quiz_access" on public.quiz_student_access;
--   create policy "staff_all_quiz_access" on public.quiz_student_access for all to authenticated
--     using (exists (select 1 from public.staff where id = auth.uid()))
--     with check (exists (select 1 from public.staff where id = auth.uid()));
--   -- then re-run the is_quiz_open_for body from 20260910010000_enforce_quiz_availability.sql
--   drop function if exists public.publish_ids_for(text, text);
--   drop table if exists public.section_publish_state;
--   drop function if exists public.can_manage_student(uuid);
--   drop function if exists public.can_manage_section(text);
--   drop table if exists public.teacher_sections;
--   drop function if exists public.is_staff_admin();
-- ============================================================

begin;

-- ── Who handles which section ───────────────────────────────────────────────

create table if not exists public.teacher_sections (
  teacher_id  uuid not null references public.staff(id) on delete cascade,
  section     text not null,
  created_at  timestamptz not null default now(),
  primary key (teacher_id, section)
);

alter table public.teacher_sections enable row level security;

-- plpgsql (not sql) so creation doesn't validate table references — keeps
-- the schema.sql snapshot runnable in any order.
create or replace function public.is_staff_admin()
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return exists (select 1 from public.staff where id = auth.uid() and role = 'admin');
end;
$$;

create or replace function public.can_manage_section(p_section text)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return public.is_staff_admin() or exists (
    select 1 from public.teacher_sections
    where teacher_id = auth.uid() and section = p_section
  );
end;
$$;

create or replace function public.can_manage_student(p_student_id uuid)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return public.is_staff_admin() or exists (
    select 1
    from public.students s
    join public.teacher_sections ts on ts.section = s.section
    where s.id = p_student_id and ts.teacher_id = auth.uid()
  );
end;
$$;

-- A teacher picks her own sections; an admin can see and edit anyone's.
-- NOTE: any teacher can still add any section to her own list — the list is
-- self-assigned, same as the old "My Sections" tab. Tighten before
-- production if sections should be assigned by an admin instead.
drop policy if exists "own_read_teacher_sections" on public.teacher_sections;
create policy "own_read_teacher_sections"
  on public.teacher_sections for select
  to authenticated
  using (teacher_id = auth.uid() or public.is_staff_admin());

drop policy if exists "own_insert_teacher_sections" on public.teacher_sections;
create policy "own_insert_teacher_sections"
  on public.teacher_sections for insert
  to authenticated
  with check (
    (teacher_id = auth.uid() and exists (select 1 from public.staff where id = auth.uid()))
    or public.is_staff_admin()
  );

drop policy if exists "own_delete_teacher_sections" on public.teacher_sections;
create policy "own_delete_teacher_sections"
  on public.teacher_sections for delete
  to authenticated
  using (teacher_id = auth.uid() or public.is_staff_admin());

-- ── Per-section publish state ───────────────────────────────────────────────

create table if not exists public.section_publish_state (
  section     text not null,
  scope       text not null check (scope in (
                'lessons', 'open', 'quizzes', 'quizzes-individual', 'lessons-individual'
              )),
  item_ids    text[] not null default '{}',
  updated_at  timestamptz not null default now(),
  primary key (section, scope)
);

alter table public.section_publish_state enable row level security;

drop policy if exists "anyone_read_section_publish_state" on public.section_publish_state;
create policy "anyone_read_section_publish_state"
  on public.section_publish_state for select
  to authenticated
  using (true);

drop policy if exists "section_staff_insert_publish_state" on public.section_publish_state;
create policy "section_staff_insert_publish_state"
  on public.section_publish_state for insert
  to authenticated
  with check (public.can_manage_section(section));

drop policy if exists "section_staff_update_publish_state" on public.section_publish_state;
create policy "section_staff_update_publish_state"
  on public.section_publish_state for update
  to authenticated
  using      (public.can_manage_section(section))
  with check (public.can_manage_section(section));

drop policy if exists "section_staff_delete_publish_state" on public.section_publish_state;
create policy "section_staff_delete_publish_state"
  on public.section_publish_state for delete
  to authenticated
  using (public.can_manage_section(section));

-- Section row wins; a section that never touched this scope inherits the
-- global row. Null means neither exists (caller applies the default).
create or replace function public.publish_ids_for(p_section text, p_scope text)
returns text[]
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_ids text[];
begin
  select item_ids into v_ids
  from public.section_publish_state
  where section = p_section and scope = p_scope;
  if found then
    return v_ids;
  end if;
  select week_ids into v_ids from public.course_publish_state where scope = p_scope;
  return v_ids;
end;
$$;

-- ── Global defaults: admin-only, plus the lesson-hide scope ─────────────────

alter table public.course_publish_state
  drop constraint if exists course_publish_state_scope_check;

alter table public.course_publish_state
  add constraint course_publish_state_scope_check
  check (scope in ('lessons', 'quizzes', 'open', 'quizzes-individual', 'lessons-individual'));

drop policy if exists "staff_write_publish_state" on public.course_publish_state;
drop policy if exists "admin_write_publish_state" on public.course_publish_state;
create policy "admin_write_publish_state"
  on public.course_publish_state for all
  to authenticated
  using      (public.is_staff_admin())
  with check (public.is_staff_admin());

-- Lessons hidden with the old global eye toggle (or the static-lesson trash
-- button, which did the same) become the global default, so every section
-- keeps seeing exactly what it saw before.
insert into public.course_publish_state (scope, week_ids, updated_at)
select 'lessons-individual', array_agg(id), now()
from public.lessons
where is_hidden
having count(*) > 0
on conflict (scope) do update
  set week_ids = array(
        select distinct unnest(public.course_publish_state.week_ids || excluded.week_ids)
      ),
      updated_at = now();

update public.lessons set is_hidden = false where is_hidden;

-- ── Quiz availability follows the student's section ─────────────────────────

-- Mirrors isQuizLocked in src/App.jsx. A missing 'quizzes' row means every
-- week is published; a missing 'quizzes-individual' row means none hidden.
create or replace function public.is_quiz_open_for(
  p_student_id uuid,
  p_lesson_id  text,
  p_week_id    text
)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_week      text := coalesce(public.quiz_week_for_lesson(p_lesson_id), p_week_id);
  v_section   text;
  v_published text[];
  v_hidden    text[];
  v_closed    boolean;
begin
  select section into v_section from public.students where id = p_student_id;
  v_published := public.publish_ids_for(v_section, 'quizzes');
  v_hidden    := public.publish_ids_for(v_section, 'quizzes-individual');

  v_closed :=
       (v_published is not null and not coalesce(v_week = any(v_published), false))
    or (v_hidden is not null and coalesce(p_lesson_id = any(v_hidden), false));

  if not v_closed then
    return true;
  end if;

  return exists (
    select 1 from public.quiz_student_access
    where lesson_id = p_lesson_id
      and student_id = p_student_id
      and (open_until is null or open_until + interval '2 minutes' > now())
  );
end;
$$;

-- ── Per-student quiz grants: only the student's own section teachers ────────

drop policy if exists "staff_all_quiz_access" on public.quiz_student_access;

drop policy if exists "staff_read_quiz_access" on public.quiz_student_access;
create policy "staff_read_quiz_access"
  on public.quiz_student_access for select
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

drop policy if exists "section_staff_insert_quiz_access" on public.quiz_student_access;
create policy "section_staff_insert_quiz_access"
  on public.quiz_student_access for insert
  to authenticated
  with check (public.can_manage_student(student_id));

drop policy if exists "section_staff_update_quiz_access" on public.quiz_student_access;
create policy "section_staff_update_quiz_access"
  on public.quiz_student_access for update
  to authenticated
  using      (public.can_manage_student(student_id))
  with check (public.can_manage_student(student_id));

drop policy if exists "section_staff_delete_quiz_access" on public.quiz_student_access;
create policy "section_staff_delete_quiz_access"
  on public.quiz_student_access for delete
  to authenticated
  using (public.can_manage_student(student_id));

-- Realtime: a teacher's toggle reaches students who already have the app open.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.section_publish_state';
    exception when duplicate_object then null;
    end;
  end if;
end$$;

commit;
