-- Accept the sticker editor's new catalog and independent dimensions.
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

comment on column public.students.avatar_style is 'Curated background and up to six stickers with percentage coordinates, width, height, rotation and draw order; legacy square size remains valid.';

-- Existing student read/update RLS policies continue to cover this column.
commit;
