-- game_progress: one row per student per challenge
create table game_progress (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid references public.students(id) on delete cascade,
  game_id       text not null,
  challenge_id  text not null,
  completed     boolean default false,
  best_score    integer,
  score_unit    text,  -- 'time_ms' | 'points' | 'percent'
  attempts      integer default 0,
  metadata      jsonb default '{}',
  completed_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (student_id, game_id, challenge_id)
);

create index on game_progress (student_id);
create index on game_progress (game_id);

-- game_saves: arbitrary save slots per student per game
create table game_saves (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references public.students(id) on delete cascade,
  game_id     text not null,
  save_type   text not null,
  payload     jsonb not null,
  is_public   boolean default false,
  created_at  timestamptz default now()
);

create index on game_saves (student_id, game_id);

-- game_sessions: session telemetry
create table game_sessions (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid references public.students(id) on delete cascade,
  game_id          text not null,
  started_at       timestamptz default now(),
  ended_at         timestamptz,
  duration_seconds integer
);

-- RLS
alter table game_progress  enable row level security;
alter table game_saves     enable row level security;
alter table game_sessions  enable row level security;

-- game_progress policies
create policy "students manage own progress"
  on game_progress for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "authenticated users read all progress"
  on game_progress for select
  to authenticated
  using (true);

-- game_saves policies
create policy "students manage own saves"
  on game_saves for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "authenticated users read public or own saves"
  on game_saves for select
  to authenticated
  using (is_public = true or auth.uid() = student_id);

-- game_sessions policies
create policy "students manage own sessions"
  on game_sessions for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "authenticated users read all sessions"
  on game_sessions for select
  to authenticated
  using (true);
