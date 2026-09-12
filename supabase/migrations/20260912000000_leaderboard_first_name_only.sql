-- ============================================================
-- Migration: the leaderboard stops returning last names
--
-- Ethics safeguard for the study: a student's full name was visible to every
-- other signed-in student on the profile leaderboard. Rank is the point, not
-- identification, so the function now returns the first name only and never
-- sends the surname to the client at all — hiding it in the UI would have left
-- it readable straight from the API.
--
-- The return type changes, so the function is dropped and recreated rather
-- than replaced. Body is otherwise identical to
-- migrations/20260911020000_student_data_access.sql.
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

commit;
