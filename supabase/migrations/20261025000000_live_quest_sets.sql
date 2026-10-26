-- ============================================================
-- Migration: Live Quest question sets (teacher-written questions)
--
-- Teachers write their own Live Quest questions, grouped into sets, and can
-- mix them with lesson-quiz questions in a room.
--
--   * live_quest_sets      — one row per set; `questions` is the whole
--                            ordered list as a JSON array, edited as a unit.
--                            Private to its author.
--   * live_rooms.set_ids   — the sets picked in the lobby, next to
--                            lesson_ids, so a refresh keeps them.
--
-- Questions in a room (live_room_questions.question) can now carry:
--   correctAnswers  jsonb array — any listed option scores. Old rows with a
--                   single `correctAnswer` still work.
--   seconds         int — this question's timer; null = room default.
--   points          'standard' | 'double' | 'none'.
--   imageUrl        text — public URL in the lesson-media bucket.
--
-- Rollback:
--   re-run the three functions from 20261024000000_live_quest.sql;
--   alter table public.live_rooms drop column if exists set_ids;
--   drop table if exists public.live_quest_sets;
-- ============================================================

begin;

create table if not exists public.live_quest_sets (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.staff(id) on delete cascade,
  title       text not null default 'Untitled set'
                check (char_length(title) between 1 and 120),
  questions   jsonb not null default '[]'::jsonb
                check (jsonb_typeof(questions) = 'array'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Same body as 20260906000000_lesson_interactives_and_materials.sql; repeated
-- so this file runs on its own.
create or replace function public.bump_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists live_quest_sets_updated_at on public.live_quest_sets;
create trigger live_quest_sets_updated_at before update on public.live_quest_sets
  for each row execute function public.bump_updated_at();

alter table public.live_quest_sets enable row level security;

drop policy if exists "live_quest_sets_owner" on public.live_quest_sets;
create policy "live_quest_sets_owner"
  on public.live_quest_sets for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and public.is_staff());

alter table public.live_rooms
  add column if not exists set_ids uuid[] not null default '{}';

-- Same as before, plus: the per-question timer is resolved here so every
-- screen counts down from the same number, and every answer key is stripped.
create or replace function public.start_live_question(p_room_id uuid, p_index int)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_question jsonb;
  v_seconds  int;
begin
  if not public.is_live_host(p_room_id) then
    raise exception 'Only the host can run this room' using errcode = '42501';
  end if;

  select q.question, coalesce((q.question ->> 'seconds')::int, r.seconds_per_question)
  into v_question, v_seconds
  from public.live_room_questions q
  join public.live_rooms r on r.id = q.room_id
  where q.room_id = p_room_id and q.idx = p_index;
  if v_question is null then
    raise exception 'No question at that position' using errcode = 'P0002';
  end if;

  update public.live_rooms
  set status = 'question',
      current_index = p_index,
      current_question = (v_question - 'correctAnswer' - 'correctAnswers' - 'explanation')
                         || jsonb_build_object('seconds', v_seconds),
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
        'correctAnswer',  q.question -> 'correctAnswer',
        'correctAnswers', coalesce(
                            q.question -> 'correctAnswers',
                            jsonb_build_array(q.question -> 'correctAnswer')
                          ),
        'explanation',    q.question -> 'explanation'
      )
  from public.live_room_questions q
  where r.id = p_room_id
    and r.status = 'question'
    and q.room_id = r.id
    and q.idx = r.current_index;
end;
$$;

-- Scoring as before (1000 for instant, sliding to 500 at the buzzer), times
-- the question's points setting: double = x2, none = 0 but still marked right.
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
  v_room       public.live_rooms;
  v_question   jsonb;
  v_seconds    int;
  v_elapsed    numeric;
  v_correct    jsonb;
  v_multiplier int;
  v_is_right   boolean;
  v_points     int;
begin
  select * into v_room from public.live_rooms where id = p_room_id;
  if v_room.id is null or v_room.status <> 'question' or v_room.current_index <> p_index then
    raise exception 'This question is closed' using errcode = 'P0001';
  end if;
  if not public.is_live_player(p_room_id) then
    raise exception 'Join the room first' using errcode = '42501';
  end if;

  select question into v_question
  from public.live_room_questions
  where room_id = p_room_id and idx = p_index;

  v_seconds := coalesce((v_question ->> 'seconds')::int, v_room.seconds_per_question);
  v_elapsed := extract(epoch from now() - v_room.question_started_at);
  if v_elapsed > v_seconds + 2 then
    raise exception 'Time is up' using errcode = 'P0001';
  end if;

  v_correct := coalesce(
    v_question -> 'correctAnswers',
    jsonb_build_array(v_question -> 'correctAnswer')
  );
  v_multiplier := case v_question ->> 'points'
    when 'double' then 2
    when 'none' then 0
    else 1
  end;

  v_is_right := v_correct @> jsonb_build_array(p_answer);
  v_points := case
    when v_is_right then
      round(v_multiplier * 1000 * (1 - least(v_elapsed / v_seconds, 1) / 2))::int
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

revoke execute on function public.start_live_question(uuid, int) from public, anon;
revoke execute on function public.reveal_live_question(uuid) from public, anon;
revoke execute on function public.submit_live_answer(uuid, int, jsonb) from public, anon;
grant execute on function public.start_live_question(uuid, int) to authenticated;
grant execute on function public.reveal_live_question(uuid) to authenticated;
grant execute on function public.submit_live_answer(uuid, int, jsonb) to authenticated;

commit;
