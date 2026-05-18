-- ============================================================
-- Achievements persistence
--
-- The achievement *catalog* (icons, labels, criteria) lives in
-- src/lib/achievements.js. The DB only records WHICH achievement a
-- student has unlocked and WHEN — keyed by the catalog's stable
-- `key`. Re-awarding is a no-op via the unique constraint.
-- ============================================================

create table if not exists public.student_achievements (
  id               uuid default gen_random_uuid() primary key,
  student_id       uuid references public.students(id) on delete cascade not null,
  achievement_key  text not null,
  unlocked_at      timestamptz default now() not null,
  unique(student_id, achievement_key)
);

create index if not exists student_achievements_student_idx
  on public.student_achievements(student_id);

-- RLS — mirrors student_progress: a student manages their own rows,
-- any authenticated user can read (teacher/admin portals need this).
alter table public.student_achievements enable row level security;

create policy "own_achievements_all"
  on public.student_achievements for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "auth_read_achievements"
  on public.student_achievements for select
  to authenticated
  using (true);

-- Readable view — browse in the Table Editor without joining.
create or replace view public.student_achievements_view
  with (security_invoker = on) as
  select
    sa.id,
    s.first_name,
    s.last_name,
    s.email,
    sa.student_id,
    sa.achievement_key,
    sa.unlocked_at
  from public.student_achievements sa
  join public.students s on s.id = sa.student_id;

-- ============================================================
-- Rollback (run manually to reverse this migration):
--
--   drop view if exists public.student_achievements_view;
--   drop table if exists public.student_achievements cascade;
-- ============================================================
