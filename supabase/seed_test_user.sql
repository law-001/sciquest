-- ============================================================
-- Seed: test student account  (a@gmail.com / 123)
--
-- NOT a migration. Run manually for local/dev testing only —
-- never against production. Idempotent: safe to re-run. Also
-- repairs an already-seeded row (see the UPDATE at the end).
--
-- How to run:
--   Supabase Dashboard -> SQL Editor -> paste -> Run
--   (the SQL editor runs as a privileged role that can write
--    the `auth` schema; the app's anon key cannot).
--
-- WHY the empty-string token columns:
--   GoTrue scans auth.users.confirmation_token / recovery_token /
--   email_change* / phone_change* into non-nullable Go strings.
--   A manual INSERT leaves them NULL, so login fails with
--   "Database error querying schema". They must be '' not NULL.
--
-- NOTE: password "123" is below Supabase's signup minimum, so
-- the app's normal sign-up flow would reject it. A direct DB
-- insert bypasses that check; sign-in only verifies the hash.
-- ============================================================

do $$
declare
  uid uuid;
begin
  select id into uid from auth.users where email = 'a@gmail.com';

  if uid is null then
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change, email_change_token_new, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      uid, 'authenticated', 'authenticated', 'a@gmail.com',
      crypt('123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'first_name', 'Test',
        'last_name',  'User',
        'role',       'student'
      ),
      '', '',
      '', '', '',
      '', '', '',
      now(), now()
    );

    -- Email/password login requires a matching identity row.
    insert into auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      uid::text, uid,
      jsonb_build_object(
        'sub',            uid::text,
        'email',          'a@gmail.com',
        'email_verified', true
      ),
      'email', now(), now(), now()
    );

    -- Defensive: ensure the profile row exists even if the
    -- on_auth_user_created trigger is missing in this environment.
    insert into public.students (id, first_name, last_name, email)
    values (uid, 'Test', 'User', 'a@gmail.com')
    on conflict (id) do nothing;
  end if;

  -- Repair: a row inserted by an earlier version of this script
  -- (or any manual insert) may have NULL token columns, which
  -- breaks login. Force them to '' for this account.
  update auth.users
  set confirmation_token          = coalesce(confirmation_token, ''),
      recovery_token              = coalesce(recovery_token, ''),
      email_change                = coalesce(email_change, ''),
      email_change_token_new      = coalesce(email_change_token_new, ''),
      email_change_token_current  = coalesce(email_change_token_current, ''),
      phone_change                = coalesce(phone_change, ''),
      phone_change_token          = coalesce(phone_change_token, ''),
      reauthentication_token      = coalesce(reauthentication_token, '')
  where email = 'a@gmail.com';
end $$;
