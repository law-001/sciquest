-- ============================================================
-- Migration: per-quiz attempt limit + show-correct-answers toggle
--
-- Adds two columns to `quiz_settings`:
--   * `max_attempts` — null means "unlimited"; positive int otherwise.
--     Missing rows continue to mean "use the app default" (currently 3).
--   * `show_correct_answers` — true means the per-question review
--     after submission reveals the right answer; false hides it.
--     Defaults true to preserve prior behavior.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.quiz_settings drop column if exists max_attempts;
--   alter table public.quiz_settings drop column if exists show_correct_answers;
-- ============================================================

begin;

alter table public.quiz_settings
  add column if not exists max_attempts integer
    check (max_attempts is null or max_attempts > 0);

alter table public.quiz_settings
  add column if not exists show_correct_answers boolean not null default true;

commit;
