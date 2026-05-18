-- ============================================================
-- Migration: let staff grade quiz attempts
--
-- quiz_attempts had no UPDATE policy, so teachers could read
-- submissions in the portal but never write a grade back. This
-- adds an UPDATE policy scoped to staff (teachers + admins) so
-- the Teacher Portal "Grade" action can set score / xp_awarded
-- and clear pending_grade_count. Students still cannot UPDATE
-- their attempts (insert-only for them, unchanged).
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop policy if exists "staff_grade_attempts" on public.quiz_attempts;
-- ============================================================

begin;

drop policy if exists "staff_grade_attempts" on public.quiz_attempts;

create policy "staff_grade_attempts"
  on public.quiz_attempts for update
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()))
  with check (exists (select 1 from public.staff where id = auth.uid()));

commit;
