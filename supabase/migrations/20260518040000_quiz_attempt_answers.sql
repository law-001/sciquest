-- ============================================================
-- Migration: store the student's answers on each quiz attempt
--
-- quiz_attempts only kept score / max_score, so the Teacher
-- Portal grading view had no way to show WHAT the student wrote
-- (essay text, chosen options, etc.). This adds a jsonb `answers`
-- column: a map of question id → the student's submitted answer,
-- exactly the shape QuizContainer already keeps in state. NULL
-- for older attempts taken before this column existed; the UI
-- treats that as "answers not recorded".
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.quiz_attempts drop column if exists answers;
-- ============================================================

begin;

alter table public.quiz_attempts
  add column if not exists answers jsonb;

commit;
