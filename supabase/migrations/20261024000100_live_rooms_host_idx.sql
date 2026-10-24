-- ============================================================
-- Migration: index for the Live Quest host's "resume a room" lookup
--
-- The teacher portal looks up the host's unfinished rooms on open
-- (host_id = me and status <> 'ended'); without this it scans every room
-- ever played.
--
-- Rollback:
--   drop index if exists public.live_rooms_host_idx;
-- ============================================================

create index if not exists live_rooms_host_idx on public.live_rooms (host_id, status);
