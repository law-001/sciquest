-- ============================================================
-- Migration: global course settings (publish state + quiz timers)
--
-- Replaces the previous per-device localStorage state:
--   * `course_publish_state` — singleton-per-key rows holding the
--     set of published week_ids for lessons and quizzes. A row's
--     absence means "all published" (preserves prior default).
--   * `quiz_settings` — per-lesson quiz config. `time_limit_seconds`
--     is nullable; null means "no timer".
--
-- RLS: anyone authenticated can read; only staff can write.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop table if exists public.quiz_settings;
--   drop table if exists public.course_publish_state;
-- ============================================================

begin;

create table if not exists public.course_publish_state (
  scope        text primary key check (scope in ('lessons', 'quizzes')),
  week_ids     text[] not null default '{}',
  updated_at   timestamptz default now() not null
);

create table if not exists public.quiz_settings (
  lesson_id           text primary key,
  time_limit_seconds  integer check (time_limit_seconds is null or time_limit_seconds > 0),
  updated_at          timestamptz default now() not null
);

alter table public.course_publish_state enable row level security;
alter table public.quiz_settings        enable row level security;

drop policy if exists "anyone_read_publish_state" on public.course_publish_state;
create policy "anyone_read_publish_state"
  on public.course_publish_state for select
  to authenticated
  using (true);

drop policy if exists "staff_write_publish_state" on public.course_publish_state;
create policy "staff_write_publish_state"
  on public.course_publish_state for all
  to authenticated
  using      (exists (select 1 from public.staff where id = auth.uid()))
  with check (exists (select 1 from public.staff where id = auth.uid()));

drop policy if exists "anyone_read_quiz_settings" on public.quiz_settings;
create policy "anyone_read_quiz_settings"
  on public.quiz_settings for select
  to authenticated
  using (true);

drop policy if exists "staff_write_quiz_settings" on public.quiz_settings;
create policy "staff_write_quiz_settings"
  on public.quiz_settings for all
  to authenticated
  using      (exists (select 1 from public.staff where id = auth.uid()))
  with check (exists (select 1 from public.staff where id = auth.uid()));

-- Realtime publication: so all clients see toggle / timer changes immediately.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.course_publish_state';
    exception when duplicate_object then null;
    end;
    begin
      execute 'alter publication supabase_realtime add table public.quiz_settings';
    exception when duplicate_object then null;
    end;
  end if;
end$$;

commit;
