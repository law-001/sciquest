-- ============================================================
-- Migration: index for a teacher's Live Quest set library
--
-- The Live Quest tab lists the teacher's own sets, newest edit first
-- (owner_id = me order by updated_at desc).
--
-- Rollback:
--   drop index if exists public.live_quest_sets_owner_idx;
-- ============================================================

create index if not exists live_quest_sets_owner_idx
  on public.live_quest_sets (owner_id, updated_at desc);
