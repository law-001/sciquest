-- ============================================================
-- Leaderboard RPC + global screen-time counter
--
-- 1. public.leaderboard(p_period) — ranks every student by the
--    *progress XP* they have earned (lesson completions + quiz
--    attempts). Achievement bonus XP is intentionally NOT included:
--    the achievement catalog's XP values live in
--    src/lib/achievements.js and duplicating them in SQL would create
--    a second source of truth. The leaderboard therefore ranks
--    "learning XP". It is SECURITY DEFINER so a student gets a single
--    aggregated, ranked result instead of pulling every other
--    student's rows to the client.
--
-- 2. public.site_metrics + add_screen_seconds() — one global counter,
--    "total_screen_seconds", incremented by every open SciQuest tab
--    via a heartbeat. SECURITY DEFINER so the table stays read-only to
--    clients (no direct writes) while anyone — even logged-out
--    visitors — can still contribute time. The per-call clamp caps
--    how much a single heartbeat can credit so a tampered client
--    can't inflate the shared total arbitrarily.
--
-- Idempotent.
-- ============================================================

begin;

-- ---- 1. Leaderboard ----------------------------------------

create or replace function public.leaderboard(p_period text default 'all')
returns table (
  student_id uuid,
  first_name text,
  last_name  text,
  xp         bigint,
  rank       bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with cutoff as (
    select case
      when p_period = 'week'  then now() - interval '7 days'
      when p_period = 'month' then now() - interval '30 days'
      else '-infinity'::timestamptz
    end as since
  ),
  lesson_xp as (
    select sp.student_id, coalesce(sum(sp.xp_awarded), 0) as xp
    from public.student_progress sp, cutoff c
    where sp.completed = true
      and coalesce(sp.completed_at, sp.created_at) >= c.since
    group by sp.student_id
  ),
  quiz_xp as (
    select qa.student_id, coalesce(sum(qa.xp_awarded), 0) as xp
    from public.quiz_attempts qa, cutoff c
    where qa.submitted_at >= c.since
    group by qa.student_id
  ),
  totals as (
    select
      s.id         as student_id,
      s.first_name as first_name,
      s.last_name  as last_name,
      coalesce(l.xp, 0) + coalesce(q.xp, 0) as xp
    from public.students s
    left join lesson_xp l on l.student_id = s.id
    left join quiz_xp   q on q.student_id = s.id
  )
  select
    t.student_id,
    t.first_name,
    t.last_name,
    t.xp,
    rank() over (order by t.xp desc) as rank
  from totals t
  where t.xp > 0
  order by t.xp desc, t.first_name;
$$;

grant execute on function public.leaderboard(text) to authenticated;

-- ---- 2. Global screen-time counter -------------------------

create table if not exists public.site_metrics (
  key   text primary key,
  value bigint not null default 0
);

insert into public.site_metrics (key, value)
  values ('total_screen_seconds', 0)
  on conflict (key) do nothing;

alter table public.site_metrics enable row level security;

-- Read-only to everyone (the counter is public). Writes happen only
-- through add_screen_seconds(), which runs as definer.
drop policy if exists "anyone_read_site_metrics" on public.site_metrics;
create policy "anyone_read_site_metrics"
  on public.site_metrics for select
  to anon, authenticated
  using (true);

create or replace function public.add_screen_seconds(p_seconds integer)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_total bigint;
begin
  if p_seconds is null or p_seconds <= 0 then
    select value into new_total
      from public.site_metrics where key = 'total_screen_seconds';
    return coalesce(new_total, 0);
  end if;
  -- One heartbeat fires at most every couple of minutes, so cap the
  -- credit at 120s — a tampered client can't pour in arbitrary time.
  p_seconds := least(p_seconds, 120);
  update public.site_metrics
    set value = value + p_seconds
    where key = 'total_screen_seconds'
    returning value into new_total;
  return new_total;
end;
$$;

grant execute on function public.add_screen_seconds(integer) to anon, authenticated;

commit;

-- ============================================================
-- Rollback (run manually to reverse this migration):
--
--   drop function if exists public.add_screen_seconds(integer);
--   drop table if exists public.site_metrics;
--   drop function if exists public.leaderboard(text);
-- ============================================================
