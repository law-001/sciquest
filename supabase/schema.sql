-- ============================================================
-- SciQuest Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Two-table user model:
--   students  → learners (signUp() flow)
--   staff     → teachers + admins (seeded manually with role)
-- ============================================================

create or replace function public.valid_avatar_style(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  sticker jsonb;
begin
  if value is null or jsonb_typeof(value) <> 'object' or octet_length(value::text) > 4096 then return false; end if;
  if not (value ? 'background' and value ? 'stickers') then return false; end if;
  if jsonb_typeof(value->'background') <> 'string' or value->>'background' not in ('original', 'sunrise', 'lagoon', 'meadow', 'peach', 'midnight') then return false; end if;
  if jsonb_typeof(value->'stickers') <> 'array' then return false; end if;
  if jsonb_array_length(value->'stickers') > 6 then return false; end if;
  for sticker in select * from jsonb_array_elements(value->'stickers') loop
    if jsonb_typeof(sticker) <> 'object' or not (sticker ?& array['id', 'stickerId', 'x', 'y', 'rotation']) then return false; end if;
    if jsonb_typeof(sticker->'id') <> 'string' or length(sticker->>'id') not between 1 and 64 then return false; end if;
    -- Retain legacy IDs so existing saved profiles remain valid.
    if jsonb_typeof(sticker->'stickerId') <> 'string' or sticker->>'stickerId' not in ('star', 'heart', 'sparkles', 'crown', 'glasses', 'flower', 'leaf', 'rocket', 'atom', 'lightning', 'music', 'rainbow', 'bow', 'bowtie', 'flowers', 'speech', 'gradcap', 'potion', 'partyhat') then return false; end if;
    if jsonb_typeof(sticker->'x') <> 'number' or jsonb_typeof(sticker->'y') <> 'number' or jsonb_typeof(sticker->'rotation') <> 'number' then return false; end if;
    if (sticker->>'x')::numeric not between 0 and 100 or (sticker->>'y')::numeric not between 0 and 100 or (sticker->>'rotation')::numeric not between -180 and 180 then return false; end if;
    if sticker ? 'width' or sticker ? 'height' then
      if not (sticker ?& array['width', 'height']) then return false; end if;
      if jsonb_typeof(sticker->'width') <> 'number' or jsonb_typeof(sticker->'height') <> 'number' then return false; end if;
      if (sticker->>'width')::numeric not between 12 and 48 or (sticker->>'height')::numeric not between 12 and 48 then return false; end if;
    else
      -- Old profiles used a single square size; the client upgrades on save.
      if not (sticker ? 'size') or jsonb_typeof(sticker->'size') <> 'number' then return false; end if;
      if (sticker->>'size')::numeric not between 20 and 38 then return false; end if;
    end if;
  end loop;
  return true;
end;
$$;

-- True for any teacher/admin. plpgsql so it can be defined before `staff`.
-- Added in migrations/20260911010000_sections_table.sql.
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

-- 1. STUDENTS TABLE
create table if not exists public.students (
  id              uuid references auth.users(id) on delete cascade primary key,
  first_name      text,
  last_name       text,
  email           text,
  student_number  text unique,
  section         text,
  avatar          text,
  avatar_style    jsonb not null default '{"background":"original","stickers":[]}'::jsonb,
  constraint students_avatar_style_valid check (public.valid_avatar_style(avatar_style)),
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

-- 3d. QUIZ STUDENT ACCESS TABLE
--     Per-student re-open of a quiz that is closed for the class (make-up /
--     deadline extension). `open_until` null = until the teacher removes it.
--     Added in migrations/20260910000000_quiz_student_access.sql.
create table if not exists public.quiz_student_access (
  lesson_id   text not null,
  student_id  uuid not null references public.students(id) on delete cascade,
  open_until  timestamptz,
  granted_by  uuid references public.staff(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (lesson_id, student_id)
);

-- 3e. CURRICULUM LESSONS TABLE
--     Which week each SEED lesson belongs to, so the server never trusts the
--     week_id a client sends with a quiz attempt. Custom lessons carry week_id
--     in `lessons`, which wins. Rows are seeded by
--     migrations/20260910010000_enforce_quiz_availability.sql — adding a seed
--     lesson means adding its row in a new migration. Read-only to clients.
create table if not exists public.curriculum_lessons (
  lesson_id  text primary key,
  week_id    text not null
);

-- 3f. TEACHER SECTIONS TABLE
--     The sections each teacher handles (teacher portal "My Sections").
--     Publishing and per-student quiz grants are limited to these.
--     Added in migrations/20260911000000_section_publish_state.sql.
create table if not exists public.teacher_sections (
  teacher_id  uuid not null references public.staff(id) on delete cascade,
  section     text not null,
  created_at  timestamptz not null default now(),
  primary key (teacher_id, section)
);

-- 3g. SECTION PUBLISH STATE TABLE
--     A section's override of a course_publish_state scope. No row for a
--     scope = inherit the global row; no global row = built-in default.
--     Added in migrations/20260911000000_section_publish_state.sql.
create table if not exists public.section_publish_state (
  section     text not null,
  scope       text not null check (scope in (
                'lessons', 'open', 'quizzes', 'quizzes-individual', 'lessons-individual'
              )),
  item_ids    text[] not null default '{}',
  updated_at  timestamptz not null default now(),
  primary key (section, scope)
);

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

-- Students: a student reads their own row; staff read all
-- (migrations/20260911020000_student_data_access.sql). The leaderboard goes
-- through leaderboard_entries() instead.
create policy "own_or_staff_read_students"
  on public.students for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

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

create policy "own_or_staff_read_progress"
  on public.student_progress for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

-- Quiz availability, enforced server-side (migrations/20260910010000_enforce_quiz_availability.sql).
-- Mirrors isQuizLocked in src/App.jsx: open to the class, or the student holds a
-- grant that hasn't ended (+2 min grace for auto-submit). course_publish_state is
-- defined in migrations/20260524000000_course_settings.sql.
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

-- Section-scoped publishing (migrations/20260911000000_section_publish_state.sql).
create or replace function public.is_staff_admin()
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return exists (select 1 from public.staff where id = auth.uid() and role = 'admin');
end;
$$;

create or replace function public.can_manage_section(p_section text)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return public.is_staff_admin() or exists (
    select 1 from public.teacher_sections
    where teacher_id = auth.uid() and section = p_section
  );
end;
$$;

create or replace function public.can_manage_student(p_student_id uuid)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return public.is_staff_admin() or exists (
    select 1
    from public.students s
    join public.teacher_sections ts on ts.section = s.section
    where s.id = p_student_id and ts.teacher_id = auth.uid()
  );
end;
$$;

-- Section row wins; a section that never touched this scope inherits the
-- global row. Null means neither exists (caller applies the default).
create or replace function public.publish_ids_for(p_section text, p_scope text)
returns text[]
language plpgsql
stable
security definer set search_path = public
as $$
declare
  v_ids text[];
begin
  select item_ids into v_ids
  from public.section_publish_state
  where section = p_section and scope = p_scope;
  if found then
    return v_ids;
  end if;
  select week_ids into v_ids from public.course_publish_state where scope = p_scope;
  return v_ids;
end;
$$;

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

-- Quiz attempts: students can insert their own, and only while the quiz is
-- open to them; all authenticated can read (teachers/admins need read access
-- for portals).
create policy "own_attempt_insert"
  on public.quiz_attempts for insert
  to authenticated
  with check (
    auth.uid() = student_id
    and public.is_quiz_open_for(auth.uid(), lesson_id, week_id)
  );

create policy "own_or_staff_read_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

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

create policy "own_or_staff_read_achievements"
  on public.student_achievements for select
  to authenticated
  using (student_id = auth.uid() or public.is_staff());

-- Curriculum lessons: reference data, readable by everyone signed in, written only by migrations.
alter table public.curriculum_lessons enable row level security;

create policy "anyone_read_curriculum_lessons"
  on public.curriculum_lessons for select
  to authenticated
  using (true);

-- Quiz student access: a student reads only their own grants; staff manage all.
alter table public.quiz_student_access enable row level security;

create policy "own_read_quiz_access"
  on public.quiz_student_access for select
  to authenticated
  using (auth.uid() = student_id);

create policy "staff_read_quiz_access"
  on public.quiz_student_access for select
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

-- Only teachers of the student's section (or an admin) can grant/revoke.
create policy "section_staff_insert_quiz_access"
  on public.quiz_student_access for insert
  to authenticated
  with check (public.can_manage_student(student_id));

create policy "section_staff_update_quiz_access"
  on public.quiz_student_access for update
  to authenticated
  using      (public.can_manage_student(student_id))
  with check (public.can_manage_student(student_id));

create policy "section_staff_delete_quiz_access"
  on public.quiz_student_access for delete
  to authenticated
  using (public.can_manage_student(student_id));

-- Teacher sections: a teacher manages her own list; admins see and edit all.
-- NOTE: self-assigned — any teacher can add any section. Tighten before
-- production if an admin should assign sections instead.
alter table public.teacher_sections enable row level security;

create policy "own_read_teacher_sections"
  on public.teacher_sections for select
  to authenticated
  using (teacher_id = auth.uid() or public.is_staff_admin());

create policy "own_insert_teacher_sections"
  on public.teacher_sections for insert
  to authenticated
  with check (
    (teacher_id = auth.uid() and exists (select 1 from public.staff where id = auth.uid()))
    or public.is_staff_admin()
  );

create policy "own_delete_teacher_sections"
  on public.teacher_sections for delete
  to authenticated
  using (teacher_id = auth.uid() or public.is_staff_admin());

-- Section publish state: everyone signed in reads (students need their own
-- section's); only that section's teachers or an admin write.
-- course_publish_state (the global default) is admin-write-only; its policies
-- live in the migrations.
alter table public.section_publish_state enable row level security;

create policy "anyone_read_section_publish_state"
  on public.section_publish_state for select
  to authenticated
  using (true);

create policy "section_staff_insert_publish_state"
  on public.section_publish_state for insert
  to authenticated
  with check (public.can_manage_section(section));

create policy "section_staff_update_publish_state"
  on public.section_publish_state for update
  to authenticated
  using      (public.can_manage_section(section))
  with check (public.can_manage_section(section));

create policy "section_staff_delete_publish_state"
  on public.section_publish_state for delete
  to authenticated
  using (public.can_manage_section(section));

-- Sections (migrations/20260911010000_sections_table.sql): signup lists them
-- before an account exists, so anon can read; staff create; admins delete.
create table if not exists public.sections (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  created_by_role  text not null check (created_by_role in ('admin', 'teacher')),
  created_at       timestamptz not null default now()
);

alter table public.sections enable row level security;

create policy "sections_select"
  on public.sections for select
  to anon, authenticated
  using (true);

create policy "sections_insert"
  on public.sections for insert
  to authenticated
  with check (
    public.is_staff()
    and (created_by_role = 'teacher' or public.is_staff_admin())
  );

create policy "sections_delete"
  on public.sections for delete
  to authenticated
  using (public.is_staff_admin());

-- Leaderboard (migrations/20260911020000_student_data_access.sql): what the
-- leaderboard shows, without exposing other students' rows. Achievement XP
-- is added client-side from the keys.
create or replace function public.leaderboard_entries(p_since timestamptz default null)
returns table (
  student_id        uuid,
  first_name        text,
  last_name         text,
  avatar            text,
  avatar_style      jsonb,
  progress_xp       bigint,
  achievement_keys  text[]
)
language plpgsql
stable
security definer set search_path = public
as $$
#variable_conflict use_column
begin
  return query
  with lesson_xp as (
    select sp.student_id as sid, sum(sp.xp_awarded)::bigint as xp
    from public.student_progress sp
    where sp.completed
      and (p_since is null or coalesce(sp.completed_at, sp.created_at) >= p_since)
    group by sp.student_id
  ),
  quiz_xp as (
    select qa.student_id as sid, sum(qa.xp_awarded)::bigint as xp
    from public.quiz_attempts qa
    where p_since is null or qa.submitted_at >= p_since
    group by qa.student_id
  ),
  ach as (
    select sa.student_id as sid, array_agg(sa.achievement_key) as keys
    from public.student_achievements sa
    where p_since is null or sa.unlocked_at >= p_since
    group by sa.student_id
  )
  select
    s.id,
    s.first_name,
    s.last_name,
    s.avatar,
    s.avatar_style,
    coalesce(l.xp, 0) + coalesce(q.xp, 0),
    coalesce(a.keys, '{}'::text[])
  from public.students s
  left join lesson_xp l on l.sid = s.id
  left join quiz_xp   q on q.sid = s.id
  left join ach       a on a.sid = s.id
  where l.sid is not null or q.sid is not null or a.sid is not null;
end;
$$;

revoke execute on function public.leaderboard_entries(timestamptz) from public, anon;
grant execute on function public.leaderboard_entries(timestamptz) to authenticated;

-- Teacher portal roster "remove": only for students in a section the caller
-- handles (students' own-row update policy can't allow it).
create or replace function public.remove_student_from_section(p_student_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.can_manage_student(p_student_id) then
    raise exception 'You can only remove students from sections you handle'
      using errcode = '42501';
  end if;
  update public.students set section = null where id = p_student_id;
end;
$$;

revoke execute on function public.remove_student_from_section(uuid) from public, anon;
grant execute on function public.remove_student_from_section(uuid) to authenticated;

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
