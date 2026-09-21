-- ============================================================
-- Migration: per-quiz scheduled availability window
--
-- Teachers can already publish/hide a quiz outright and re-open a closed
-- one for a single student. This adds the third axis: a dated window, so a
-- quiz can be set to open at 4:00 PM and close again at 5:00 PM.
--
--   * `quiz_settings.available_from`  — null = no opening time.
--   * `quiz_settings.available_until` — null = never closes on its own.
--     Both null (the default) means the quiz behaves exactly as before.
--   * The window is an INSTANT, not a wall-clock time: the teacher's browser
--     converts their local pick to UTC, so a class spread across timezones
--     still opens and closes together.
--
-- How it composes with what already exists:
--   publish toggles AND the window must both allow the quiz through;
--   a quiz_student_access grant overrides either one. That keeps the
--   make-up flow working for a student who missed the window.
--
-- `is_quiz_scheduled_open` gives the closing edge the same 2-minute grace
-- that grants get, so a client auto-submitting at the bell still lands.
-- The browser applies no grace, so students see the quiz close on time.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   create or replace function public.is_quiz_scheduled_open(text)
--     returns boolean language sql immutable as $$ select true $$;
--   alter table public.quiz_settings
--     drop constraint if exists quiz_settings_window_order_check,
--     drop column if exists available_from,
--     drop column if exists available_until;
-- ============================================================

begin;

alter table public.quiz_settings
  add column if not exists available_from timestamptz;

alter table public.quiz_settings
  add column if not exists available_until timestamptz;

-- A window that ends before it starts would lock the quiz forever with no
-- visible reason, so reject it at the database rather than in the form only.
alter table public.quiz_settings
  drop constraint if exists quiz_settings_window_order_check;

alter table public.quiz_settings
  add constraint quiz_settings_window_order_check
  check (
    available_from is null
    or available_until is null
    or available_until > available_from
  );

-- True when the lesson has no window, or now() falls inside it. A missing
-- quiz_settings row means no window was ever set.
create or replace function public.is_quiz_scheduled_open(p_lesson_id text)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_from  timestamptz;
  v_until timestamptz;
begin
  select available_from, available_until
    into v_from, v_until
  from public.quiz_settings
  where lesson_id = p_lesson_id;

  if not found then
    return true;
  end if;
  if v_from is not null and now() < v_from then
    return false;
  end if;
  if v_until is not null and now() >= v_until + interval '2 minutes' then
    return false;
  end if;
  return true;
end;
$$;

-- Same body as the previous version plus the window term in v_closed, so a
-- per-student grant still re-opens a quiz the schedule has closed.
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
  v_section   text;
  v_published text[];
  v_hidden    text[];
  v_closed    boolean;
begin
  select section into v_section from public.students where id = p_student_id;
  v_published := public.publish_ids_for(v_section, 'quizzes');
  v_hidden    := public.publish_ids_for(v_section, 'quizzes-individual');

  v_closed :=
       (v_published is not null and not coalesce(v_week = any(v_published), false))
    or (v_hidden is not null and coalesce(p_lesson_id = any(v_hidden), false))
    or not public.is_quiz_scheduled_open(p_lesson_id);

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

commit;
