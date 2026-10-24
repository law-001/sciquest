-- ============================================================
-- Migration: Live Quest (teacher-hosted live quiz rooms)
--
-- A teacher opens a room with a 6-character join code, picks lessons whose
-- multiple-choice / true-false questions make up the game, sets the seconds
-- per question, then steps the class through it live. Students join by code
-- and answer on their own device; faster correct answers score more.
--
-- Practice only: nothing here touches quiz_attempts, XP, or the gradebook.
--
--   * live_rooms           — one row per room. Students see only rooms they
--                            joined; `current_question` never holds the
--                            answer, `current_answer` is filled on reveal.
--   * live_room_questions  — the full questions with answers. Host only, so
--                            a student can't read answers off the wire.
--   * live_room_players    — roster + running score. Written only by the
--                            join / submit RPCs, so a student can't set a
--                            name or score.
--   * live_room_answers    — one answer per student per question, written
--                            only by submit_live_answer, which checks the
--                            answer and the clock server-side.
--
-- TIGHTEN BEFORE PRODUCTION: any staff member can host, and any student who
-- knows a code can join — no section check.
--
-- Rollback:
--   drop function if exists public.submit_live_answer(uuid, int, jsonb);
--   drop function if exists public.reveal_live_question(uuid);
--   drop function if exists public.start_live_question(uuid, int);
--   drop function if exists public.join_live_room(text);
--   drop table if exists public.live_room_answers, public.live_room_players,
--     public.live_room_questions, public.live_rooms;
--   drop function if exists public.is_live_player(uuid);
--   drop function if exists public.is_live_host(uuid);
-- ============================================================

begin;

create table if not exists public.live_rooms (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  host_id               uuid not null references public.staff(id) on delete cascade,
  lesson_ids            text[] not null default '{}',
  seconds_per_question  int not null default 20 check (seconds_per_question between 5 and 120),
  status                text not null default 'lobby'
                          check (status in ('lobby', 'question', 'reveal', 'ended')),
  question_count        int not null default 0,
  current_index         int not null default -1,
  current_question      jsonb,
  current_answer        jsonb,
  question_started_at   timestamptz,
  created_at            timestamptz not null default now()
);

create table if not exists public.live_room_questions (
  room_id   uuid not null references public.live_rooms(id) on delete cascade,
  idx       int not null,
  question  jsonb not null,
  primary key (room_id, idx)
);

create table if not exists public.live_room_players (
  room_id       uuid not null references public.live_rooms(id) on delete cascade,
  student_id    uuid not null references public.students(id) on delete cascade,
  display_name  text not null,
  score         int not null default 0,
  joined_at     timestamptz not null default now(),
  primary key (room_id, student_id)
);

create table if not exists public.live_room_answers (
  room_id         uuid not null,
  student_id      uuid not null,
  question_index  int not null,
  answer          jsonb not null,
  is_correct      boolean not null,
  points          int not null default 0,
  answered_at     timestamptz not null default now(),
  primary key (room_id, student_id, question_index),
  foreign key (room_id, student_id)
    references public.live_room_players(room_id, student_id) on delete cascade
);

-- plpgsql (not sql) so creation doesn't validate table references — keeps
-- the schema.sql snapshot runnable in any order. Security definer so the
-- policies below can look across tables without recursing into RLS.
create or replace function public.is_live_host(p_room_id uuid)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return exists (
    select 1 from public.live_rooms where id = p_room_id and host_id = auth.uid()
  );
end;
$$;

create or replace function public.is_live_player(p_room_id uuid)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
begin
  return exists (
    select 1 from public.live_room_players
    where room_id = p_room_id and student_id = auth.uid()
  );
end;
$$;

alter table public.live_rooms          enable row level security;
alter table public.live_room_questions enable row level security;
alter table public.live_room_players   enable row level security;
alter table public.live_room_answers   enable row level security;

drop policy if exists "live_rooms_select" on public.live_rooms;
create policy "live_rooms_select"
  on public.live_rooms for select
  to authenticated
  using (host_id = auth.uid() or public.is_live_player(id));

drop policy if exists "live_rooms_insert" on public.live_rooms;
create policy "live_rooms_insert"
  on public.live_rooms for insert
  to authenticated
  with check (host_id = auth.uid() and public.is_staff() and status = 'lobby');

drop policy if exists "live_rooms_update" on public.live_rooms;
create policy "live_rooms_update"
  on public.live_rooms for update
  to authenticated
  using (host_id = auth.uid())
  with check (host_id = auth.uid());

drop policy if exists "live_rooms_delete" on public.live_rooms;
create policy "live_rooms_delete"
  on public.live_rooms for delete
  to authenticated
  using (host_id = auth.uid());

drop policy if exists "live_room_questions_host" on public.live_room_questions;
create policy "live_room_questions_host"
  on public.live_room_questions for all
  to authenticated
  using (public.is_live_host(room_id))
  with check (public.is_live_host(room_id));

drop policy if exists "live_room_players_select" on public.live_room_players;
create policy "live_room_players_select"
  on public.live_room_players for select
  to authenticated
  using (public.is_live_host(room_id) or public.is_live_player(room_id));

drop policy if exists "live_room_answers_select" on public.live_room_answers;
create policy "live_room_answers_select"
  on public.live_room_answers for select
  to authenticated
  using (student_id = auth.uid() or public.is_live_host(room_id));

-- Join by code. The name comes from the student's own row, so nobody can
-- join under someone else's name. Re-joining the same room is a no-op.
create or replace function public.join_live_room(p_code text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_name text;
  v_room uuid;
begin
  select first_name into v_name from public.students where id = auth.uid();
  if not found then
    raise exception 'Only students can join a Live Quest' using errcode = '42501';
  end if;

  select id into v_room
  from public.live_rooms
  where code = upper(btrim(p_code)) and status <> 'ended';
  if v_room is null then
    raise exception 'No open Live Quest uses that code' using errcode = 'P0002';
  end if;

  insert into public.live_room_players (room_id, student_id, display_name)
  values (v_room, auth.uid(), coalesce(nullif(btrim(v_name), ''), 'Student'))
  on conflict do nothing;

  return v_room;
end;
$$;

-- Opens question p_index. The clock starts on the server so scoring never
-- depends on the host's device time; the answer is stripped before it is
-- copied onto the room row students can read.
create or replace function public.start_live_question(p_room_id uuid, p_index int)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_question jsonb;
begin
  if not public.is_live_host(p_room_id) then
    raise exception 'Only the host can run this room' using errcode = '42501';
  end if;

  select question into v_question
  from public.live_room_questions
  where room_id = p_room_id and idx = p_index;
  if v_question is null then
    raise exception 'No question at that position' using errcode = 'P0002';
  end if;

  update public.live_rooms
  set status = 'question',
      current_index = p_index,
      current_question = v_question - 'correctAnswer' - 'explanation',
      current_answer = null,
      question_started_at = now()
  where id = p_room_id;
end;
$$;

create or replace function public.reveal_live_question(p_room_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_live_host(p_room_id) then
    raise exception 'Only the host can run this room' using errcode = '42501';
  end if;

  update public.live_rooms r
  set status = 'reveal',
      current_answer = jsonb_build_object(
        'correctAnswer', q.question -> 'correctAnswer',
        'explanation',   q.question -> 'explanation'
      )
  from public.live_room_questions q
  where r.id = p_room_id
    and r.status = 'question'
    and q.room_id = r.id
    and q.idx = r.current_index;
end;
$$;

-- Scores like the classic live-quiz formula: an instant correct answer earns
-- 1000, sliding down to 500 at the last second. A 2s
-- grace covers network lag after the timer hits zero on the student's screen.
create or replace function public.submit_live_answer(
  p_room_id uuid,
  p_index int,
  p_answer jsonb
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_room     public.live_rooms;
  v_elapsed  numeric;
  v_correct  jsonb;
  v_is_right boolean;
  v_points   int;
begin
  select * into v_room from public.live_rooms where id = p_room_id;
  if v_room.id is null or v_room.status <> 'question' or v_room.current_index <> p_index then
    raise exception 'This question is closed' using errcode = 'P0001';
  end if;
  if not public.is_live_player(p_room_id) then
    raise exception 'Join the room first' using errcode = '42501';
  end if;

  v_elapsed := extract(epoch from now() - v_room.question_started_at);
  if v_elapsed > v_room.seconds_per_question + 2 then
    raise exception 'Time is up' using errcode = 'P0001';
  end if;

  select question -> 'correctAnswer' into v_correct
  from public.live_room_questions
  where room_id = p_room_id and idx = p_index;

  v_is_right := v_correct = p_answer;
  v_points := case
    when v_is_right then
      round(1000 * (1 - least(v_elapsed / v_room.seconds_per_question, 1) / 2))::int
    else 0
  end;

  insert into public.live_room_answers
    (room_id, student_id, question_index, answer, is_correct, points)
  values (p_room_id, auth.uid(), p_index, p_answer, v_is_right, v_points)
  on conflict do nothing;
  if not found then
    raise exception 'You already answered this one' using errcode = 'P0001';
  end if;

  update public.live_room_players
  set score = score + v_points
  where room_id = p_room_id and student_id = auth.uid();

  return jsonb_build_object('isCorrect', v_is_right, 'points', v_points);
end;
$$;

revoke execute on function public.join_live_room(text) from public, anon;
revoke execute on function public.start_live_question(uuid, int) from public, anon;
revoke execute on function public.reveal_live_question(uuid) from public, anon;
revoke execute on function public.submit_live_answer(uuid, int, jsonb) from public, anon;
grant execute on function public.join_live_room(text) to authenticated;
grant execute on function public.start_live_question(uuid, int) to authenticated;
grant execute on function public.reveal_live_question(uuid) to authenticated;
grant execute on function public.submit_live_answer(uuid, int, jsonb) to authenticated;

-- Realtime drives every screen change, so the tables must be in the
-- publication (see 20260908000000_realtime_lessons_quizzes_materials.sql).
do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['live_rooms', 'live_room_players', 'live_room_answers'] loop
      begin
        execute format('alter publication supabase_realtime add table public.%I', t);
      exception
        when duplicate_object then null;
        when undefined_table then null;
      end;
    end loop;
  end if;
end$$;

commit;
