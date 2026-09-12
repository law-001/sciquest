-- ============================================================
-- Migration: repair the RLS regressions caused by replaying 0001 and 0002
--
-- WHAT HAPPENED
--   The remote `supabase_migrations.schema_migrations` tracking table was
--   empty — the schema had been applied by hand (dashboard SQL editor) rather
--   than through the CLI. A `supabase db push` therefore believed NOTHING was
--   applied and began replaying the history from the start. It recorded 0001
--   and 0002 as applied, then aborted on 0003 with
--   "cannot drop columns from view (SQLSTATE 42P16)".
--
--   0001 and 0002 are idempotent for TABLES (create table if not exists) but
--   NOT for policies: both do `drop policy if exists X; create policy X ...`.
--   Replaying them silently reverted three policies to their original, more
--   permissive definitions, undoing later security migrations.
--
-- THE THREE REGRESSIONS BEING REPAIREDa
--   1. quiz_attempts.own_attempt_insert — 0002 recreated it as
--      `with check (auth.uid() = student_id)`, dropping the
--      `is_quiz_open_for(...)` term added by
--      20260910010000_enforce_quiz_availability.sql. Students could insert an
--      attempt for a CLOSED quiz straight through the API.
--   2. quiz_attempts.auth_read_attempts — 0002 recreated this
--      `using (true)` policy, which 20260911020000_student_data_access.sql had
--      deliberately dropped. RLS policies are OR-ed, so its return made the
--      restrictive own_or_staff_read_attempts policy irrelevant: any student
--      could read every student's attempts again.
--   3. students.auth_read_students — 0001 recreated this `using (true)`
--      policy, likewise dropped by 20260911020000. Any student could read
--      every student's email and student number again.
--
-- NOT AFFECTED (verified): handle_new_user, the student_progress FK,
--   own_student_update, auth_read_staff, own_staff_update (never redefined by
--   a later migration), and the student_progress / student_achievements read
--   policies (never touched by 0001 or 0002). 0003 aborted inside its own
--   transaction, so nothing from it applied.
--
-- Idempotent: safe to re-run. Restores the end state already described in
-- supabase/schema.sql.
--
-- Rollback: re-run the policy blocks of 0001_split_profiles.sql and
--   0002_quiz_attempts.sql — but note that doing so reintroduces exactly the
--   three vulnerabilities above.
-- ============================================================

begin;

-- ── 1. Remove the resurrected permissive read policies ──────────────────────

-- These names belong to the pre-20260911020000 world. Their restrictive
-- replacements (own_or_staff_*) are recreated below.
drop policy if exists "auth_read_attempts" on public.quiz_attempts;
drop policy if exists "auth_read_students" on public.students;

-- ── 2. Reassert the restrictive read policies ───────────────────────────────

drop policy if exists "own_or_staff_read_students" on public.students;
create policy "own_or_staff_read_students"
  on public.students for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists "own_or_staff_read_attempts" on public.quiz_attempts;
create policy "own_or_staff_read_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

-- ── 3. Restore server-side quiz availability on insert ──────────────────────

-- public.is_quiz_open_for(uuid, text, text) was created by
-- 20260910010000_enforce_quiz_availability.sql and was never dropped — only
-- the policy referencing it was replaced. Fail loudly if that is not true,
-- rather than silently leaving the permissive policy in place.
do $$
begin
  if to_regprocedure('public.is_quiz_open_for(uuid, text, text)') is null then
    raise exception
      'public.is_quiz_open_for(uuid, text, text) is missing — apply 20260910010000_enforce_quiz_availability.sql first';
  end if;
end $$;

drop policy if exists "own_attempt_insert" on public.quiz_attempts;
create policy "own_attempt_insert"
  on public.quiz_attempts for insert
  to authenticated
  with check (
    auth.uid() = student_id
    and public.is_quiz_open_for(auth.uid(), lesson_id, week_id)
  );

commit;
