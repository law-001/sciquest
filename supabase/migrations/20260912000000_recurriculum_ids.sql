-- ============================================================
-- Migration: re-point curriculum reference data at the MATATAG lesson ids
--
-- The course was restructured to follow the Grade 7 (MATATAG) curriculum:
-- 20 weeks, 33 lessons, with weeks 10 and 20 as periodical-examination weeks
-- that carry no lessons at all. Weeks 1 and 2 kept their original lessons and
-- ids (lesson-1 … lesson-5); weeks 3–19 moved to a wNN-lN scheme.
--
-- This migration handles REFERENCE DATA and CLEANUP only. The lesson and quiz
-- CONTENT rows are written by scripts/seed-curriculum.mjs (`npm run
-- seed:curriculum`), so that large JSONB payloads never enter migration
-- history.
--
-- What it does:
--   1. Rebuilds `curriculum_lessons` for the 33 current lesson ids. This table
--      is what quiz_week_for_lesson() consults so the quiz_attempts insert
--      policy never trusts the client-supplied week_id. Leaving the old
--      lesson-1 … lesson-60 rows in place meant every new lesson id resolved
--      to NULL and fell back to `coalesce(..., p_week_id)` — reopening exactly
--      the hole that 20260910010000_enforce_quiz_availability.sql closed.
--   2. Deletes orphaned SEED-OVERRIDE rows in `lessons` / `quizzes` — rows
--      whose id no longer matches any lesson in the curriculum. Teacher-created
--      lessons (is_custom = true) are deliberately PRESERVED: they are the
--      teachers' own content, not stale seed overrides.
--   3. Strips dead lesson ids out of section_publish_state.item_ids for the two
--      per-lesson scopes, so hide-toggles do not accumulate ids that can never
--      match anything again.
--
-- Deliberately NOT touched: quiz_attempts, lesson_interactions and
-- student_progress. Students keep every score and all XP earned on the old
-- curriculum, even where the lesson id no longer exists.
--
-- Idempotent: safe to re-run.
--
-- Rollback:
--   The previous reference rows are restored by re-running the insert block of
--   migrations/20260910010000_enforce_quiz_availability.sql. Content rows
--   deleted in step 2 are not recoverable from here — take a backup of
--   public.lessons and public.quizzes before applying if that matters.
-- ============================================================

begin;

-- ── 1. Rebuild the lesson → week reference map ───────────────────────────────

-- Full replace rather than upsert: the old map had 60 rows and several of its
-- week assignments (lesson-28..30 → week-10) are now actively wrong, since
-- week-10 is an examination week with no lessons.
delete from public.curriculum_lessons;

insert into public.curriculum_lessons (lesson_id, week_id) values
  -- Week 1 — Scientific Models (unchanged from the original course)
  ('lesson-1', 'week-1'), ('lesson-2', 'week-1'), ('lesson-3', 'week-1'),
  -- Week 2 — Particle Model of Matter (unchanged)
  ('lesson-4', 'week-2'), ('lesson-5', 'week-2'),
  -- Week 3 — Phases of Matter
  ('w03-l1', 'week-3'), ('w03-l2', 'week-3'),
  -- Week 4 — Changes in the State of Matter
  ('w04-l1', 'week-4'),
  -- Week 5 — Scientific Investigation and Measurement
  ('w05-l1', 'week-5'), ('w05-l2', 'week-5'),
  -- Week 6 — Solubility of Matter
  ('w06-l1', 'week-6'), ('w06-l2', 'week-6'),
  -- Week 7 — Concentration, Acids, Bases and Salts
  ('w07-l1', 'week-7'), ('w07-l2', 'week-7'),
  -- Week 8 — The Science Laboratory
  ('w08-l1', 'week-8'), ('w08-l2', 'week-8'),
  -- Week 9 — Performance Task 3
  ('w09-l1', 'week-9'),
  -- Week 10 — First Periodical Examination: no lessons
  -- Week 11 — The Microscope
  ('w11-l1', 'week-11'), ('w11-l2', 'week-11'),
  -- Week 12 — The Cell
  ('w12-l1', 'week-12'), ('w12-l2', 'week-12'),
  -- Week 13 — Plant and Animal Cell
  ('w13-l1', 'week-13'),
  -- Week 14 — Cell Reproduction and the Cell Cycle
  ('w14-l1', 'week-14'), ('w14-l2', 'week-14'),
  -- Week 15 — Cell Division
  ('w15-l1', 'week-15'), ('w15-l2', 'week-15'),
  -- Week 16 — Science Fair and Fertilization
  ('w16-l1', 'week-16'), ('w16-l2', 'week-16'),
  -- Week 17 — Asexual Reproduction
  ('w17-l1', 'week-17'),
  -- Week 18 — Sexual Reproduction and Energy Flow
  ('w18-l1', 'week-18'), ('w18-l2', 'week-18'),
  -- Week 19 — Energy Flow in the Circle of Life
  ('w19-l1', 'week-19'), ('w19-l2', 'week-19')
  -- Week 20 — Second Periodical Examination: no lessons
on conflict (lesson_id) do update set week_id = excluded.week_id;

-- ── 2. Drop orphaned seed-override rows ──────────────────────────────────────

-- A row with is_custom = false exists only to override a seed lesson. If its id
-- is no longer in the curriculum there is nothing left to override, so the row
-- is dead weight. Teacher-authored lessons (is_custom = true) are kept.
delete from public.quizzes q
where q.is_custom = false
  and not exists (
    select 1 from public.curriculum_lessons cl where cl.lesson_id = q.lesson_id
  );

delete from public.lessons l
where l.is_custom = false
  and not exists (
    select 1 from public.curriculum_lessons cl where cl.lesson_id = l.id
  );

-- ── 3. Clean dead lesson ids out of per-lesson publish state ─────────────────

-- Only the two per-lesson scopes hold lesson ids; 'lessons', 'open' and
-- 'quizzes' hold WEEK ids and are left alone. An id survives if it is either a
-- current curriculum lesson or a teacher's custom lesson.
update public.section_publish_state s
set item_ids = coalesce(
      (
        select array_agg(id order by id)
        from unnest(s.item_ids) as id
        where exists (select 1 from public.curriculum_lessons cl where cl.lesson_id = id)
           or exists (select 1 from public.lessons l where l.id = id and l.is_custom)
      ),
      '{}'
    ),
    updated_at = now()
where s.scope in ('lessons-individual', 'quizzes-individual')
  and exists (
    select 1 from unnest(s.item_ids) as id
    where not exists (select 1 from public.curriculum_lessons cl where cl.lesson_id = id)
      and not exists (select 1 from public.lessons l where l.id = id and l.is_custom)
  );

commit;
