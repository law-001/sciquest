-- Curated avatar decorations; existing students keep their current picture.
begin;

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
    if jsonb_typeof(sticker) <> 'object' or not (sticker ?& array['id', 'stickerId', 'x', 'y', 'size', 'rotation']) then return false; end if;
    if jsonb_typeof(sticker->'id') <> 'string' or length(sticker->>'id') not between 1 and 64 then return false; end if;
    if jsonb_typeof(sticker->'stickerId') <> 'string' or sticker->>'stickerId' not in ('star', 'heart', 'sparkles', 'crown', 'glasses', 'flower', 'leaf', 'rocket', 'atom', 'lightning', 'music', 'rainbow') then return false; end if;
    if jsonb_typeof(sticker->'x') <> 'number' or jsonb_typeof(sticker->'y') <> 'number' or jsonb_typeof(sticker->'size') <> 'number' or jsonb_typeof(sticker->'rotation') <> 'number' then return false; end if;
    if (sticker->>'x')::numeric not between 0 and 100 or (sticker->>'y')::numeric not between 0 and 100 or (sticker->>'size')::numeric not between 20 and 38 or (sticker->>'rotation')::numeric not between -180 and 180 then return false; end if;
  end loop;
  return true;
end;
$$;

alter table public.students
  add column if not exists avatar_style jsonb not null default '{"background":"original","stickers":[]}'::jsonb;

alter table public.students add constraint students_avatar_style_valid check (public.valid_avatar_style(avatar_style));
comment on column public.students.avatar_style is 'Curated background and up to six stickers with percentage coordinates, size, rotation and draw order.';

-- This column is covered by the existing own_student_update and read policies.
-- No new public write policy is introduced.
alter table public.students enable row level security;
commit;
