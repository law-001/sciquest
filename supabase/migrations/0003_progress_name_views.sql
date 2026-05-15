-- ============================================================
-- Migration: readable views for progress + quiz attempts
--
-- Adds student_progress_view and quiz_attempts_view so teachers/admins
-- can browse rows with first_name/last_name without writing a join.
--
-- `security_invoker = on` keeps RLS on the underlying tables in effect —
-- without it, views run as the creator (typically superuser) and bypass RLS.
--
-- Idempotent: safe to re-run.
-- ============================================================

begin;

create or replace view public.student_progress_view
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
    sp.created_at
  from public.student_progress sp
  join public.students s on s.id = sp.student_id;

create or replace view public.quiz_attempts_view
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
    qa.submitted_at
  from public.quiz_attempts qa
  join public.students s on s.id = qa.student_id;

commit;
