-- ============================================================
-- Retire public.leaderboard(text)
--
-- The leaderboard is now aggregated client-side (src/lib/leaderboard.js)
-- so a student's rank uses the SAME total as their profile —
-- lesson + quiz XP PLUS achievement-bonus XP. Achievement XP values
-- live only in src/lib/achievements.js (never the DB), so the SQL RPC
-- could never include them and produced totals that disagreed with
-- the profile. Dropping it removes the misleading, now-unused path.
--
-- The site_metrics table + add_screen_seconds() from the previous
-- migration are unaffected.
--
-- Idempotent.
-- ============================================================

begin;

drop function if exists public.leaderboard(text);

commit;

-- ============================================================
-- Rollback (run manually to reverse this migration):
--
--   Re-run the leaderboard() definition from
--   20260518000000_leaderboard_and_screentime.sql.
-- ============================================================
