-- ============================================================
-- Migration: per-student quiz access (make-up / deadline extension)
--
-- A quiz is normally open or closed for the whole class via
-- course_publish_state ('quizzes' week scope + 'quizzes-individual').
-- This table lets a teacher re-open ONE closed quiz for ONE student —
-- e.g. a student who forgot to take it — without re-opening it for
-- classmates who already finished.
--
--   * One row per (lesson_id, student_id). Re-granting upserts, which is
--     how a teacher extends an existing window.
--   * `open_until` null = open until the teacher removes the row;
--     otherwise the grant stops applying once that time passes.
--   * A grant only matters while the quiz is closed for the class. When
--     the quiz is published for everyone the row is inert.
--
-- RLS: staff read/write everything; a student can read only their own rows.
-- Enforcement is client-side, same as the class-wide publish toggles —
-- quiz_attempts' insert policy does not check availability.
-- Tighten before production: gate quiz_attempts inserts on availability.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter publication supabase_realtime drop table public.quiz_student_access;
--   drop table if exists public.quiz_student_access;
-- ============================================================

begin;

create table if not exists public.quiz_student_access (
  lesson_id   text not null,
  student_id  uuid not null references public.students(id) on delete cascade,
  open_until  timestamptz,
  granted_by  uuid references public.staff(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (lesson_id, student_id)
);

alter table public.quiz_student_access enable row level security;

drop policy if exists "own_read_quiz_access" on public.quiz_student_access;
create policy "own_read_quiz_access"
  on public.quiz_student_access for select
  to authenticated
  using (auth.uid() = student_id);

drop policy if exists "staff_all_quiz_access" on public.quiz_student_access;
create policy "staff_all_quiz_access"
  on public.quiz_student_access for all
  to authenticated
  using      (exists (select 1 from public.staff where id = auth.uid()))
  with check (exists (select 1 from public.staff where id = auth.uid()));

-- Realtime so a grant reaches a student who already has the lesson open.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.quiz_student_access';
    exception when duplicate_object then null;
    end;
  end if;
end$$;

commit;
