-- ============================================================
-- Migration: add "quizzes-individual" scope to course_publish_state
--
-- Adds a fourth scope ('quizzes-individual') to the publish-state table.
-- Under this scope the `week_ids` array holds LESSON ids whose quiz the
-- teacher has individually hidden. A quiz is visible to students when its
-- week is published AND its lesson id is NOT present in this set, so the
-- default (no row / empty set) keeps every quiz in a published week visible.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.course_publish_state
--     drop constraint if exists course_publish_state_scope_check;
--   delete from public.course_publish_state where scope = 'quizzes-individual';
--   alter table public.course_publish_state
--     add constraint course_publish_state_scope_check
--     check (scope in ('lessons', 'quizzes', 'open'));
-- ============================================================

begin;

alter table public.course_publish_state
  drop constraint if exists course_publish_state_scope_check;

alter table public.course_publish_state
  add constraint course_publish_state_scope_check
  check (scope in ('lessons', 'quizzes', 'open', 'quizzes-individual'));

commit;
