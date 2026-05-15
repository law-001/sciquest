-- ============================================================
-- Migration: split public.profiles into public.students + public.staff
--
-- Run this ONCE on an existing database that still has the legacy
-- single-table `profiles` schema. Idempotent: safe to re-run; it
-- skips work that's already been done.
--
-- On a fresh project run schema.sql instead — it produces the same
-- end state without needing this migration.
-- ============================================================

begin;

-- 1. New target tables ----------------------------------------------------
create table if not exists public.students (
  id              uuid references auth.users(id) on delete cascade primary key,
  first_name      text,
  last_name       text,
  email           text,
  student_number  text unique,
  section         text,
  created_at      timestamptz default now()
);

create table if not exists public.staff (
  id          uuid references auth.users(id) on delete cascade primary key,
  role        text not null check (role in ('teacher', 'admin')),
  first_name  text,
  last_name   text,
  email       text,
  created_at  timestamptz default now()
);

-- 2. Move rows out of profiles -------------------------------------------
-- Only run the copy if profiles still exists (so re-runs are no-ops).
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'profiles') then

    insert into public.students (id, first_name, last_name, email, student_number, section, created_at)
    select id, first_name, last_name, email, student_number, section, created_at
    from public.profiles
    where role = 'student'
    on conflict (id) do nothing;

    insert into public.staff (id, role, first_name, last_name, email, created_at)
    select id, role, first_name, last_name, email, created_at
    from public.profiles
    where role in ('teacher', 'admin')
    on conflict (id) do nothing;
  end if;
end $$;

-- 3. Rewire student_progress.student_id FK --------------------------------
-- The old FK pointed at profiles(id); point it at students(id) instead.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'student_progress'
      and constraint_name = 'student_progress_student_id_fkey'
  ) then
    alter table public.student_progress drop constraint student_progress_student_id_fkey;
  end if;
end $$;

alter table public.student_progress
  add constraint student_progress_student_id_fkey
  foreign key (student_id) references public.students(id) on delete cascade;

-- 4. Replace the new-user trigger ----------------------------------------
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

-- 5. RLS on the new tables -----------------------------------------------
alter table public.students enable row level security;
alter table public.staff    enable row level security;

drop policy if exists "auth_read_students" on public.students;
create policy "auth_read_students"
  on public.students for select
  to authenticated
  using (true);

drop policy if exists "own_student_update" on public.students;
create policy "own_student_update"
  on public.students for update
  using (auth.uid() = id);

drop policy if exists "auth_read_staff" on public.staff;
create policy "auth_read_staff"
  on public.staff for select
  to authenticated
  using (true);

drop policy if exists "own_staff_update" on public.staff;
create policy "own_staff_update"
  on public.staff for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.staff where id = auth.uid()));

-- 6. Drop the old table --------------------------------------------------
-- Done last so the copy + FK rewire above could still reference it.
drop table if exists public.profiles;

commit;
