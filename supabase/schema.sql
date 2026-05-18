-- ============================================================
-- SciQuest Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Two-table user model:
--   students  → learners (signUp() flow)
--   staff     → teachers + admins (seeded manually with role)
-- ============================================================

-- 1. STUDENTS TABLE
create table if not exists public.students (
  id              uuid references auth.users(id) on delete cascade primary key,
  first_name      text,
  last_name       text,
  email           text,
  student_number  text unique,
  section         text,
  avatar          text,
  created_at      timestamptz default now()
);

-- 2. STAFF TABLE (teachers + admins live together, distinguished by role)
create table if not exists public.staff (
  id          uuid references auth.users(id) on delete cascade primary key,
  role        text not null check (role in ('teacher', 'admin')),
  first_name  text,
  last_name   text,
  email       text,
  created_at  timestamptz default now()
);

-- 3. STUDENT PROGRESS TABLE
--    One row per (student, lesson). `completed` flips to true when the student
--    finishes the lesson. `xp_awarded` is the lesson-completion XP captured at
--    completion time (insulates totals from later config changes). Week-level
--    completion is derived client-side.
create table if not exists public.student_progress (
  id           uuid default gen_random_uuid() primary key,
  student_id   uuid references public.students(id) on delete cascade not null,
  lesson_id    text not null,
  week_id      text not null,
  completed    boolean default false,
  completed_at timestamptz,
  xp_awarded   integer default 0 not null,
  created_at   timestamptz default now(),
  unique(student_id, lesson_id)
);

-- 3b. QUIZ ATTEMPTS TABLE
--     Insert-only: one row per submission so retries are preserved.
--     `pending_grade_count` is the number of essay/short-answer questions in
--     the submission that still need teacher review.
create table if not exists public.quiz_attempts (
  id                  uuid default gen_random_uuid() primary key,
  student_id          uuid references public.students(id) on delete cascade not null,
  lesson_id           text not null,
  week_id             text not null,
  score               integer not null,
  max_score           integer not null,
  xp_awarded          integer default 0 not null,
  pending_grade_count integer default 0 not null,
  answers             jsonb,
  submitted_at        timestamptz default now()
);
create index if not exists quiz_attempts_student_lesson_idx
  on public.quiz_attempts(student_id, lesson_id);

-- 3c. STUDENT ACHIEVEMENTS TABLE
--     One row per (student, achievement). The catalog (icons, labels,
--     unlock criteria) lives in src/lib/achievements.js — this table
--     only records which keys a student has unlocked and when.
create table if not exists public.student_achievements (
  id               uuid default gen_random_uuid() primary key,
  student_id       uuid references public.students(id) on delete cascade not null,
  achievement_key  text not null,
  unlocked_at      timestamptz default now() not null,
  unique(student_id, achievement_key)
);
create index if not exists student_achievements_student_idx
  on public.student_achievements(student_id);

-- ============================================================
-- 4. TRIGGER: auto-create the correct row on new auth user
--    Reads role from user_metadata.role:
--      'teacher' / 'admin' → staff
--      anything else        → students
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
begin
  if meta_role in ('teacher', 'admin') then
    insert into public.staff (id, role, first_name, last_name, email)
    values (
      new.id,
      meta_role,
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'last_name',
      new.email
    )
    on conflict (id) do nothing;
  else
    insert into public.students (id, first_name, last_name, email, student_number, section)
    values (
      new.id,
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'last_name',
      new.email,
      new.raw_user_meta_data->>'student_number',
      new.raw_user_meta_data->>'section'
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================
alter table public.students             enable row level security;
alter table public.staff                enable row level security;
alter table public.student_progress     enable row level security;
alter table public.quiz_attempts        enable row level security;
alter table public.student_achievements enable row level security;

-- Students: authenticated users can read all student rows.
create policy "auth_read_students"
  on public.students for select
  to authenticated
  using (true);

-- Students: a student can update their own row.
create policy "own_student_update"
  on public.students for update
  using (auth.uid() = id);

-- Staff: authenticated users can read staff rows (needed to identify teachers/admins).
create policy "auth_read_staff"
  on public.staff for select
  to authenticated
  using (true);

-- Staff: a staff member can update their own row, but cannot change their role.
create policy "own_staff_update"
  on public.staff for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.staff where id = auth.uid()));

-- Progress: students manage their own; all authenticated can read.
create policy "own_progress_all"
  on public.student_progress for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "auth_read_progress"
  on public.student_progress for select
  to authenticated
  using (true);

-- Quiz attempts: students can insert + read their own; all authenticated can read
-- (teachers/admins need read access for portals).
create policy "own_attempt_insert"
  on public.quiz_attempts for insert
  to authenticated
  with check (auth.uid() = student_id);

create policy "auth_read_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (true);

-- Quiz attempts: staff (teachers + admins) can grade — set score,
-- xp_awarded, and clear pending_grade_count from the Teacher Portal.
create policy "staff_grade_attempts"
  on public.quiz_attempts for update
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()))
  with check (exists (select 1 from public.staff where id = auth.uid()));

-- Achievements: students manage their own; all authenticated can read.
create policy "own_achievements_all"
  on public.student_achievements for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "auth_read_achievements"
  on public.student_achievements for select
  to authenticated
  using (true);

-- ============================================================
-- 7. READABLE VIEWS
--    Browse in the Table Editor without joining. `security_invoker = on`
--    keeps RLS on the underlying tables in effect.
-- ============================================================
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
    sp.xp_awarded,
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
    qa.xp_awarded,
    qa.pending_grade_count,
    qa.submitted_at
  from public.quiz_attempts qa
  join public.students s on s.id = qa.student_id;

create or replace view public.student_achievements_view
  with (security_invoker = on) as
  select
    sa.id,
    s.first_name,
    s.last_name,
    s.email,
    sa.student_id,
    sa.achievement_key,
    sa.unlocked_at
  from public.student_achievements sa
  join public.students s on s.id = sa.student_id;

-- ============================================================
-- 6. SEED ADMIN & TEACHER ACCOUNTS
--
-- Step 1: In Supabase Dashboard → Authentication → Users → Add User
--   Create: admin@gmail.com   password: admin123
--   Create: teacher@gmail.com password: teacher123
--
-- Step 2: The trigger inserts these as students by default (no role
--   in user_metadata). Move them into staff with the right role:
-- ============================================================
do $$
declare
  admin_id uuid;
  teacher_id uuid;
begin
  select id into admin_id   from auth.users where email = 'admin@gmail.com';
  select id into teacher_id from auth.users where email = 'teacher@gmail.com';

  if admin_id is not null then
    delete from public.students where id = admin_id;
    insert into public.staff (id, role, email) values (admin_id, 'admin', 'admin@gmail.com')
      on conflict (id) do update set role = 'admin';
  end if;

  if teacher_id is not null then
    delete from public.students where id = teacher_id;
    insert into public.staff (id, role, email) values (teacher_id, 'teacher', 'teacher@gmail.com')
      on conflict (id) do update set role = 'teacher';
  end if;
end $$;
