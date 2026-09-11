-- ============================================================
-- Migration: student data is readable by its owner and staff only
--
-- Every signed-in user could read every student's email, student number,
-- lesson progress, quiz attempts (answers included) and achievements, so any
-- student could pull their classmates' data straight from the API. The only
-- student-facing screen that needed other students' rows was the
-- leaderboard, which now goes through a function that returns just what it
-- shows.
--
--   * students / student_progress / quiz_attempts / student_achievements:
--     select is limited to the student's own rows, or staff.
--   * `leaderboard_entries(p_since)` — per student: name, avatar, lesson +
--     quiz XP since `p_since`, and achievement keys unlocked since then.
--     Achievement XP values live in src/lib/achievements.js, so the client
--     adds them. No emails, student numbers or answers.
--   * `remove_student_from_section(p_student_id)` — the teacher portal's
--     roster "remove" button. RLS only lets a student update their own row,
--     so the direct update silently changed nothing. The function checks
--     the caller handles that student's section (can_manage_student).
--
-- NOTE: staff still read every student, not only their own sections —
-- the admin dashboard and the "Add Section" student counts need it.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop function if exists public.remove_student_from_section(uuid);
--   drop function if exists public.leaderboard_entries(timestamptz);
--   drop policy if exists "own_or_staff_read_students" on public.students;
--   create policy "auth_read_students" on public.students for select to authenticated using (true);
--   drop policy if exists "own_or_staff_read_progress" on public.student_progress;
--   create policy "auth_read_progress" on public.student_progress for select to authenticated using (true);
--   drop policy if exists "own_or_staff_read_attempts" on public.quiz_attempts;
--   create policy "auth_read_attempts" on public.quiz_attempts for select to authenticated using (true);
--   drop policy if exists "own_or_staff_read_achievements" on public.student_achievements;
--   create policy "auth_read_achievements" on public.student_achievements for select to authenticated using (true);
-- ============================================================

begin;

-- ── Reads: own rows or staff ────────────────────────────────────────────────

drop policy if exists "auth_read_students" on public.students;
drop policy if exists "own_or_staff_read_students" on public.students;
create policy "own_or_staff_read_students"
  on public.students for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists "auth_read_progress" on public.student_progress;
drop policy if exists "own_or_staff_read_progress" on public.student_progress;
create policy "own_or_staff_read_progress"
  on public.student_progress for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

drop policy if exists "auth_read_attempts" on public.quiz_attempts;
drop policy if exists "own_or_staff_read_attempts" on public.quiz_attempts;
create policy "own_or_staff_read_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

drop policy if exists "auth_read_achievements" on public.student_achievements;
drop policy if exists "own_or_staff_read_achievements" on public.student_achievements;
create policy "own_or_staff_read_achievements"
  on public.student_achievements for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

-- ── Leaderboard ─────────────────────────────────────────────────────────────

create or replace function public.leaderboard_entries(p_since timestamptz default null)
returns table (
  student_id        uuid,
  first_name        text,
  last_name         text,
  avatar            text,
  avatar_style      jsonb,
  progress_xp       bigint,
  achievement_keys  text[]
)
language plpgsql
stable
security definer set search_path = public
as $$
#variable_conflict use_column
begin
  return query
  with lesson_xp as (
    select sp.student_id as sid, sum(sp.xp_awarded)::bigint as xp
    from public.student_progress sp
    where sp.completed
      and (p_since is null or coalesce(sp.completed_at, sp.created_at) >= p_since)
    group by sp.student_id
  ),
  quiz_xp as (
    select qa.student_id as sid, sum(qa.xp_awarded)::bigint as xp
    from public.quiz_attempts qa
    where p_since is null or qa.submitted_at >= p_since
    group by qa.student_id
  ),
  ach as (
    select sa.student_id as sid, array_agg(sa.achievement_key) as keys
    from public.student_achievements sa
    where p_since is null or sa.unlocked_at >= p_since
    group by sa.student_id
  )
  select
    s.id,
    s.first_name,
    s.last_name,
    s.avatar,
    s.avatar_style,
    coalesce(l.xp, 0) + coalesce(q.xp, 0),
    coalesce(a.keys, '{}'::text[])
  from public.students s
  left join lesson_xp l on l.sid = s.id
  left join quiz_xp   q on q.sid = s.id
  left join ach       a on a.sid = s.id
  where l.sid is not null or q.sid is not null or a.sid is not null;
end;
$$;

revoke execute on function public.leaderboard_entries(timestamptz) from public, anon;
grant execute on function public.leaderboard_entries(timestamptz) to authenticated;

-- ── Roster: remove a student from their section ─────────────────────────────

create or replace function public.remove_student_from_section(p_student_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.can_manage_student(p_student_id) then
    raise exception 'You can only remove students from sections you handle'
      using errcode = '42501';
  end if;
  update public.students set section = null where id = p_student_id;
end;
$$;

revoke execute on function public.remove_student_from_section(uuid) from public, anon;
grant execute on function public.remove_student_from_section(uuid) to authenticated;

commit;
