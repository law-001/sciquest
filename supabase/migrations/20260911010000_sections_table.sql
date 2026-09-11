-- ============================================================
-- Migration: sections table
--
-- `sections` backs the signup section dropdown and the teacher portal's
-- "Add Section" modal, but it was only ever created by hand from a comment
-- in src/lib/sections.js — a database built from migrations did not have
-- it. This creates it (no-op where it already exists), ships its policies,
-- and backfills every section name students already carry so existing
-- sections show up in the dropdown.
--
--   * Read: anyone, signed in or not — the signup form lists sections
--     before the student has an account. Names only; nothing sensitive.
--   * Insert: staff. A teacher can only record 'teacher' as the creator.
--   * Delete: admins.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop table if exists public.sections;
--   drop function if exists public.is_staff();
--   (only where this migration created the table — a hand-made table that
--   predates it holds real data)
-- ============================================================

begin;

-- plpgsql (not sql) so creation doesn't validate table references — keeps
-- the schema.sql snapshot runnable in any order.
create or replace function public.is_staff()
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return exists (select 1 from public.staff where id = auth.uid());
end;
$$;

create table if not exists public.sections (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  created_by_role  text not null check (created_by_role in ('admin', 'teacher')),
  created_at       timestamptz not null default now()
);

alter table public.sections enable row level security;

drop policy if exists "sections_select" on public.sections;
create policy "sections_select"
  on public.sections for select
  to anon, authenticated
  using (true);

drop policy if exists "sections_insert" on public.sections;
create policy "sections_insert"
  on public.sections for insert
  to authenticated
  with check (
    public.is_staff()
    and (created_by_role = 'teacher' or public.is_staff_admin())
  );

drop policy if exists "sections_delete" on public.sections;
create policy "sections_delete"
  on public.sections for delete
  to authenticated
  using (public.is_staff_admin());

insert into public.sections (name, created_by_role)
select distinct btrim(section), 'admin'
from public.students
where section is not null and btrim(section) <> ''
on conflict (name) do nothing;

commit;
