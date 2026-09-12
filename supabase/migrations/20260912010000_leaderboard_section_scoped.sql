-- ============================================================
-- Migration: the leaderboard only ranks the student's own section
--
-- Ethics safeguard for the study: a student's first name and XP total were
-- visible to every other student in the school. Scoping the board to the
-- caller's own section shrinks that audience to their own class, which is
-- also the only comparison that means anything pedagogically.
--
-- Staff still see every student — the teacher portal and admin dashboard
-- already read all rows, and staff have no `section` of their own to scope to.
--
-- A student with no section (removed from a roster) is grouped with other
-- unassigned students rather than shown an empty board; `is not distinct from`
-- is what makes null = null true here.
--
-- Signature and return type are unchanged from
-- migrations/20260912000000_leaderboard_first_name_only.sql, but the drop is
-- kept so this also applies cleanly on a database still holding the older
-- last_name version.
--
-- Idempotent: safe to re-run.
-- ============================================================

begin;

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
    and (v_is_staff or s.section is not distinct from v_section);
end;
$$;

revoke execute on function public.leaderboard_entries(timestamptz) from public, anon;
grant execute on function public.leaderboard_entries(timestamptz) to authenticated;

commit;
