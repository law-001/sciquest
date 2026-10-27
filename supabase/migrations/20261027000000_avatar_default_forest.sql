-- New students start on the Forest background ('meadow' id). Existing rows keep
-- whatever they saved, since 'original' may be a deliberate choice.
alter table public.students
  alter column avatar_style set default '{"background":"meadow","stickers":[]}'::jsonb;

-- Rollback:
--   alter table public.students
--     alter column avatar_style set default '{"background":"original","stickers":[]}'::jsonb;
