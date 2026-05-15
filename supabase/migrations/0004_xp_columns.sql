-- ============================================================
-- Migration: add XP + pending-grade columns
--
-- student_progress.xp_awarded — XP awarded for finishing the lesson,
--                                captured at completion time.
-- quiz_attempts.xp_awarded    — XP awarded for the quiz submission.
-- quiz_attempts.pending_grade_count — essay/short-answer questions
--                                that still need a teacher to grade.
--
-- Also refreshes the readable views to include the new columns.
-- Idempotent.
-- ============================================================

begin;

alter table public.student_progress
  add column if not exists xp_awarded integer default 0 not null;

alter table public.quiz_attempts
  add column if not exists xp_awarded integer default 0 not null;

alter table public.quiz_attempts
  add column if not exists pending_grade_count integer default 0 not null;

-- Drop + recreate, not `create or replace`. CREATE OR REPLACE only allows
-- appending new columns at the end; inserting one anywhere else looks like
-- a column rename and Postgres refuses with 42P16.
drop view if exists public.student_progress_view;
create view public.student_progress_view
  with (security_invoker = on) as
  select
    sp.id,
    s.first_name,
    s.last_name,
    s.email,
    sp.student_id,
    sp.week_id,
    sp.lesson_id,
    sp.completed,
    sp.completed_at,
    sp.xp_awarded,
    sp.created_at
  from public.student_progress sp
  join public.students s on s.id = sp.student_id;

drop view if exists public.quiz_attempts_view;
create view public.quiz_attempts_view
  with (security_invoker = on) as
  select
    qa.id,
    s.first_name,
    s.last_name,
    s.email,
    qa.student_id,
    qa.week_id,
    qa.lesson_id,
    qa.score,
    qa.max_score,
    qa.xp_awarded,
    qa.pending_grade_count,
    qa.submitted_at
  from public.quiz_attempts qa
  join public.students s on s.id = qa.student_id;

commit;
