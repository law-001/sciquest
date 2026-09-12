-- ============================================================
-- Migration: a student can take themselves off the leaderboard
--
-- Ethics safeguard for the study: appearing in a ranking in front of one's
-- classmates was an unavoidable condition of using the app. `leaderboard_opt_out`
-- lets a student decline that one feature without giving up lessons, quizzes,
-- XP or badges — none of which this flag touches.
--
-- Default false: the board stays populated, and the choice is offered in the
-- profile editor. Opting out hides the student from EVERY viewer, staff
-- included; teachers read progress and grades in the portal, not here.
--
-- Also tightens the students self-update policy. `section` now decides whose
-- leaderboard you appear on (migrations/20260912010000_leaderboard_section_scoped.sql),
-- so a student being able to rewrite their own section through the API would
-- have walked straight around that scoping. section, student_number and email
-- are now frozen against self-update; avatar, avatar_style, the names and this
-- new flag stay editable. The subquery pattern matches the existing
-- own_staff_update policy, which pins `role` the same way. Teacher-driven
-- section changes go through remove_student_from_section(), which is
-- security definer and unaffected.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.students drop column if exists leaderboard_opt_out;
-- ============================================================

begin;

alter table public.students
  add column if not exists leaderboard_opt_out boolean not null default false;

drop policy if exists "own_student_update" on public.students;
create policy "own_student_update"
  on public.students for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and section        is not distinct from (select section        from public.students where id = auth.uid())
    and student_number is not distinct from (select student_number from public.students where id = auth.uid())
    and email          is not distinct from (select email          from public.students where id = auth.uid())
  );

drop function if exists public.leaderboard_entries(timestamptz);

create function public.leaderboard_entries(p_since timestamptz default null)
returns table (
  student_id        uuid,
  first_name        text,
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
declare
  v_is_staff boolean := public.is_staff();
  v_section  text;
begin
  if not v_is_staff then
    select section into v_section from public.students where id = auth.uid();
  end if;

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
    s.avatar,
    s.avatar_style,
    coalesce(l.xp, 0) + coalesce(q.xp, 0),
    coalesce(a.keys, '{}'::text[])
  from public.students s
  left join lesson_xp l on l.sid = s.id
  left join quiz_xp   q on q.sid = s.id
  left join ach       a on a.sid = s.id
  where (l.sid is not null or q.sid is not null or a.sid is not null)
    and not s.leaderboard_opt_out
    and (v_is_staff or s.section is not distinct from v_section);
end;
$$;

revoke execute on function public.leaderboard_entries(timestamptz) from public, anon;
grant execute on function public.leaderboard_entries(timestamptz) to authenticated;

commit;
