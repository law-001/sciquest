-- ============================================================
-- Migration: contact messages
--
-- The Contact page form used to fake a submit and store nothing. This adds
-- the table it now writes to, read by the admin portal's Messages tab.
--
--   * Anyone — signed in or not — may INSERT a message. A signed-in sender
--     may only attach their own user_id; anonymous senders leave it null.
--     New rows must arrive unread.
--   * Only admins may SELECT / UPDATE / DELETE.
--
-- TIGHTEN BEFORE PRODUCTION: the anonymous insert policy has no rate limit,
-- so a script can flood the table. Put an edge function with a captcha or
-- per-IP throttle in front of it before launch.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   drop table if exists public.contact_messages;
-- ============================================================

begin;

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 254 and email like '%@%'),
  message     text not null check (char_length(btrim(message)) between 1 and 5000),
  user_id     uuid references auth.users(id) on delete set null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "anyone_insert_contact_message" on public.contact_messages;
create policy "anyone_insert_contact_message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    is_read = false
    and (user_id is null or user_id = auth.uid())
  );

drop policy if exists "admin_all_contact_messages" on public.contact_messages;
create policy "admin_all_contact_messages"
  on public.contact_messages for all
  to authenticated
  using      (exists (select 1 from public.staff where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.staff where id = auth.uid() and role = 'admin'));

commit;
