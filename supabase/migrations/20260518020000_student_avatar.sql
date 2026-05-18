-- ============================================================
-- Migration: add students.avatar
--
-- Stores the id of the dev-provided avatar a student has picked
-- (see src/lib/avatars.js). NULL = no avatar chosen yet; the UI
-- falls back to an initial-based circle. Users can only select
-- from the curated catalog — no uploads — so this is a short
-- text key, not a URL.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   alter table public.students drop column if exists avatar;
-- ============================================================

begin;

alter table public.students
  add column if not exists avatar text;

commit;
