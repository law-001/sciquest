-- ============================================================
-- Migration: add public.quiz_attempts (insert-only attempt log)
--
-- Run after 0001_split_profiles.sql. Idempotent.
-- ============================================================

begin;

create table if not exists public.quiz_attempts (
  id           uuid default gen_random_uuid() primary key,
  student_id   uuid references public.students(id) on delete cascade not null,
  lesson_id    text not null,
  week_id      text not null,
  score        integer not null,
  max_score    integer not null,
  submitted_at timestamptz default now()
);

create index if not exists quiz_attempts_student_lesson_idx
  on public.quiz_attempts(student_id, lesson_id);

alter table public.quiz_attempts enable row level security;

drop policy if exists "own_attempt_insert" on public.quiz_attempts;
create policy "own_attempt_insert"
  on public.quiz_attempts for insert
  to authenticated
  with check (auth.uid() = student_id);

drop policy if exists "auth_read_attempts" on public.quiz_attempts;
create policy "auth_read_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (true);

commit;
