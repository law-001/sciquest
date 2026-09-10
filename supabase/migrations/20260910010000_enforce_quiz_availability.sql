-- ============================================================
-- Migration: enforce quiz availability on the server
--
-- Until now the week quiz toggle ('quizzes' scope), the per-quiz toggle
-- ('quizzes-individual' scope) and per-student grants
-- (quiz_student_access) were checked only in the browser, so a student
-- could insert a quiz_attempts row for a closed quiz straight through the
-- API. This moves the same rule into the quiz_attempts insert policy.
--
--   * `curriculum_lessons` — which week each SEED lesson belongs to. The
--     client sends week_id with every attempt, so trusting it would let a
--     student claim a published week. Custom lessons (and teacher overrides)
--     already carry week_id in `lessons`, which wins over this table.
--     Adding a seed lesson to src/data/ means adding its row here in a new
--     migration; until then its week falls back to the client's week_id.
--   * `is_quiz_open_for()` — true when the quiz is open to the class, or
--     the student holds a grant that has not ended. Grants get a 2-minute
--     grace so an auto-submit fired at the deadline still lands despite
--     network latency or a slightly fast/slow device clock.
--   * `own_attempt_insert` now also requires is_quiz_open_for().
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop policy if exists "own_attempt_insert" on public.quiz_attempts;
--   create policy "own_attempt_insert" on public.quiz_attempts for insert
--     to authenticated with check (auth.uid() = student_id);
--   drop function if exists public.is_quiz_open_for(uuid, text, text);
--   drop function if exists public.quiz_week_for_lesson(text);
--   drop table if exists public.curriculum_lessons;
-- ============================================================

begin;

create table if not exists public.curriculum_lessons (
  lesson_id  text primary key,
  week_id    text not null
);

alter table public.curriculum_lessons enable row level security;

-- Read-only reference data: only migrations write it.
drop policy if exists "anyone_read_curriculum_lessons" on public.curriculum_lessons;
create policy "anyone_read_curriculum_lessons"
  on public.curriculum_lessons for select
  to authenticated
  using (true);

insert into public.curriculum_lessons (lesson_id, week_id) values
  ('lesson-1',  'week-1'),  ('lesson-2',  'week-1'),  ('lesson-3',  'week-1'),
  ('lesson-4',  'week-2'),  ('lesson-5',  'week-2'),
  ('lesson-7',  'week-3'),  ('lesson-8',  'week-3'),  ('lesson-9',  'week-3'),
  ('lesson-10', 'week-4'),  ('lesson-11', 'week-4'),  ('lesson-12', 'week-4'),
  ('lesson-13', 'week-5'),  ('lesson-14', 'week-5'),  ('lesson-15', 'week-5'),
  ('lesson-16', 'week-6'),  ('lesson-17', 'week-6'),  ('lesson-18', 'week-6'),
  ('lesson-19', 'week-7'),  ('lesson-20', 'week-7'),  ('lesson-21', 'week-7'),
  ('lesson-22', 'week-8'),  ('lesson-23', 'week-8'),  ('lesson-24', 'week-8'),
  ('lesson-25', 'week-9'),  ('lesson-26', 'week-9'),  ('lesson-27', 'week-9'),
  ('lesson-28', 'week-10'), ('lesson-29', 'week-10'), ('lesson-30', 'week-10'),
  ('lesson-31', 'week-11'), ('lesson-32', 'week-11'), ('lesson-33', 'week-11'),
  ('lesson-34', 'week-12'), ('lesson-35', 'week-12'), ('lesson-36', 'week-12'),
  ('lesson-37', 'week-13'), ('lesson-38', 'week-13'), ('lesson-39', 'week-13'),
  ('lesson-40', 'week-14'), ('lesson-41', 'week-14'), ('lesson-42', 'week-14'),
  ('lesson-43', 'week-15'), ('lesson-44', 'week-15'), ('lesson-45', 'week-15'),
  ('lesson-46', 'week-16'), ('lesson-47', 'week-16'), ('lesson-48', 'week-16'),
  ('lesson-49', 'week-17'), ('lesson-50', 'week-17'), ('lesson-51', 'week-17'),
  ('lesson-52', 'week-18'), ('lesson-53', 'week-18'), ('lesson-54', 'week-18'),
  ('lesson-55', 'week-19'), ('lesson-56', 'week-19'), ('lesson-57', 'week-19'),
  ('lesson-58', 'week-20'), ('lesson-59', 'week-20'), ('lesson-60', 'week-20')
on conflict (lesson_id) do update set week_id = excluded.week_id;

-- plpgsql (not sql) so creation doesn't validate table references — keeps
-- the schema.sql snapshot runnable in any order.
create or replace function public.quiz_week_for_lesson(p_lesson_id text)
returns text
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_week text;
begin
  select week_id into v_week from public.lessons where id = p_lesson_id;
  if v_week is null then
    select week_id into v_week from public.curriculum_lessons where lesson_id = p_lesson_id;
  end if;
  return v_week;
end;
$$;

-- Mirrors isQuizLocked in src/App.jsx. A missing 'quizzes' row means every
-- week is published; a missing 'quizzes-individual' row means none hidden.
create or replace function public.is_quiz_open_for(
  p_student_id uuid,
  p_lesson_id  text,
  p_week_id    text
)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_week      text := coalesce(public.quiz_week_for_lesson(p_lesson_id), p_week_id);
  v_published text[];
  v_hidden    text[];
  v_closed    boolean;
begin
  select week_ids into v_published from public.course_publish_state where scope = 'quizzes';
  select week_ids into v_hidden    from public.course_publish_state where scope = 'quizzes-individual';

  v_closed :=
       (v_published is not null and not coalesce(v_week = any(v_published), false))
    or (v_hidden is not null and coalesce(p_lesson_id = any(v_hidden), false));

  if not v_closed then
    return true;
  end if;

  return exists (
    select 1 from public.quiz_student_access
    where lesson_id = p_lesson_id
      and student_id = p_student_id
      and (open_until is null or open_until + interval '2 minutes' > now())
  );
end;
$$;

drop policy if exists "own_attempt_insert" on public.quiz_attempts;
create policy "own_attempt_insert"
  on public.quiz_attempts for insert
  to authenticated
  with check (
    auth.uid() = student_id
    and public.is_quiz_open_for(auth.uid(), lesson_id, week_id)
  );

commit;
