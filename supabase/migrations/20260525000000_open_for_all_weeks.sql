-- ============================================================
-- Migration: add "open for all" scope to course_publish_state
--
-- Adds a third scope ('open') to the existing publish-state table.
-- A week_id present under the 'open' scope is unlocked for students
-- regardless of whether the previous week is completed — used by the
-- teacher when they want week N accessible even though week N-1 has
-- not been finished by the class yet.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.course_publish_state
--     drop constraint if exists course_publish_state_scope_check;
--   delete from public.course_publish_state where scope = 'open';
--   alter table public.course_publish_state
--     add constraint course_publish_state_scope_check
--     check (scope in ('lessons', 'quizzes'));
-- ============================================================

begin;

alter table public.course_publish_state
  drop constraint if exists course_publish_state_scope_check;

alter table public.course_publish_state
  add constraint course_publish_state_scope_check
  check (scope in ('lessons', 'quizzes', 'open'));

commit;
