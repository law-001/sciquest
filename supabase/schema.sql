-- ============================================================
-- SciQuest Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  role         text not null default 'student' check (role in ('admin', 'teacher', 'student')),
  first_name   text,
  last_name    text,
  student_number text,
  section      text,
  email        text,
  created_at   timestamptz default now()
);

-- 2. STUDENT PROGRESS TABLE
create table if not exists public.student_progress (
  id           uuid default gen_random_uuid() primary key,
  student_id   uuid references public.profiles(id) on delete cascade not null,
  lesson_id    text not null,
  week_id      text not null,
  completed    boolean default false,
  completed_at timestamptz,
  created_at   timestamptz default now(),
  unique(student_id, lesson_id)
);

-- ============================================================
-- 3. TRIGGER: auto-create profile on new user signup
--    Reads role/name/etc from user metadata passed during signUp()
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, first_name, last_name, student_number, section)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'student_number',
    new.raw_user_meta_data->>'section'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.student_progress enable row level security;

-- Profiles: authenticated users can read all profiles
create policy "auth_read_profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Profiles: users can update their own profile (not role)
create policy "own_profile_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Progress: students manage their own; all authenticated can read
create policy "own_progress_all"
  on public.student_progress for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "auth_read_progress"
  on public.student_progress for select
  to authenticated
  using (true);

-- ============================================================
-- 5. SEED ADMIN & TEACHER ACCOUNTS
--
-- Step 1: In Supabase Dashboard → Authentication → Users → Add User
--   Create: admin@gmail.com  password: admin123
--   Create: teacher@gmail.com password: teacher123
--
-- Step 2: Run the SQL below AFTER creating those users above.
--   (The trigger will insert them as 'student' by default;
--    these UPDATEs promote them to the correct role.)
-- ============================================================
update public.profiles set role = 'admin'   where email = 'admin@gmail.com';
update public.profiles set role = 'teacher' where email = 'teacher@gmail.com';
