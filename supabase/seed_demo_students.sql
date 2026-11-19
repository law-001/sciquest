-- ============================================================
-- Seed: 72 demo students with random Week 1–3 progress
--
--   7 - Obedience  — 35 students, SQ-OB-001 … SQ-OB-035
--   7 - Optimistic — 37 students, SQ-OP-001 … SQ-OP-037
--
-- NOT a migration. Run manually for dev/demo only — never against
-- production. Same pattern as seed_test_user.sql:
--   Supabase Dashboard -> SQL Editor -> paste -> Run
--
-- Login: email = student number in lowercase @sciquest.demo
--   (e.g. sq-ob-001@sciquest.demo), password = 123456
--
-- Progress: each student completes the first N lessons (N random 0–7)
-- of Weeks 1–3, in course order, and has one quiz attempt per completed
-- lesson. Nothing past Week 3.
--
-- Idempotent: an account whose email already exists is skipped, so
-- re-running never duplicates students or re-rolls their progress.
--
-- Remove everything this seeded:
--   delete from auth.users where email like 'sq-o_-___@sciquest.demo';
--   (students / progress / attempts cascade)
-- ============================================================

insert into public.sections (name, created_by_role)
values ('7 - Obedience', 'admin'), ('7 - Optimistic', 'admin')
on conflict (name) do nothing;

do $$
declare
  first_names text[] := array[
    'Juan','Maria','Jose','Ana','Carlo','Andrea','Miguel','Sofia','Gabriel','Isabella',
    'Rafael','Camille','Paolo','Bea','Joshua','Angel','Nathan','Patricia','Ethan','Kyla',
    'Lance','Jasmine','Adrian','Nicole','Kenneth','Trisha','Mark','Princess','Ian','Erika',
    'Daniel','Hannah','Christian','Faith','Bryan','Joy','Vincent','Clarisse','Marco','Alyssa'];
  last_names text[] := array[
    'Santos','Reyes','Cruz','Bautista','Ocampo','Garcia','Mendoza','Torres','Tomas','Andrada',
    'Castillo','Flores','Villanueva','Ramos','Castro','Rivera','Aquino','Navarro','Salazar','Mercado',
    'Domingo','Gutierrez','Dela Cruz','Pascual','Soriano','Manalo','Fernandez','Valdez','Lopez','Francisco'];
  -- Weeks 1–3 in course order (see curriculum_lessons).
  lesson_ids text[] := array['lesson-1','lesson-2','lesson-3','w02-l1','w02-l2','w03-l1','w03-l2'];
  week_ids   text[] := array['week-1','week-1','week-1','week-2','week-2','week-3','week-3'];
  sec record;
  i int;
  k int;
  n_done int;
  score int;
  uid uuid;
  sn text;
  em text;
  first_nm text;
  last_nm text;
  done_at timestamptz;
begin
  for sec in
    select * from (values ('7 - Obedience', 'SQ-OB', 35), ('7 - Optimistic', 'SQ-OP', 37)) as t(name, prefix, total)
  loop
    for i in 1..sec.total loop
      sn := sec.prefix || '-' || lpad(i::text, 3, '0');
      em := lower(sn) || '@sciquest.demo';
      continue when exists (select 1 from auth.users where email = em);

      uid := gen_random_uuid();
      first_nm := first_names[1 + floor(random() * array_length(first_names, 1))::int];
      last_nm := last_names[1 + floor(random() * array_length(last_names, 1))::int];

      -- Empty-string tokens, not NULL: GoTrue can't scan NULLs (see seed_test_user.sql).
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
        uid, 'authenticated', 'authenticated', em,
        crypt('123456', gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'first_name', first_nm, 'last_name', last_nm, 'role', 'student',
          'student_number', sn, 'section', sec.name
        ),
        '', '', '', '', '', '', '', '',
        now(), now()
      );

      insert into auth.identities (
        provider_id, user_id, identity_data, provider,
        last_sign_in_at, created_at, updated_at
      ) values (
        uid::text, uid,
        jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true),
        'email', now(), now(), now()
      );

      -- on_auth_user_created normally creates this; be safe if the trigger is missing.
      insert into public.students (id, first_name, last_name, email, student_number, section)
      values (uid, first_nm, last_nm, em, sn, sec.name)
      on conflict (id) do nothing;

      n_done := floor(random() * 8)::int;  -- 0..7 lessons
      for k in 1..n_done loop
        done_at := now() - ((8 - k) || ' days')::interval - (random() * interval '20 hours');

        insert into public.student_progress (student_id, lesson_id, week_id, completed, completed_at, xp_awarded)
        values (uid, lesson_ids[k], week_ids[k], true, done_at, 50);

        score := 4 + floor(random() * 7)::int;  -- 4..10 out of 10
        insert into public.quiz_attempts (student_id, lesson_id, week_id, score, max_score, xp_awarded, submitted_at)
        values (uid, lesson_ids[k], week_ids[k], score, 10, score * 10, done_at + interval '15 minutes');
      end loop;
    end loop;
  end loop;
end $$;
