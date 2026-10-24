-- ============================================================
-- Migration: renumber the two Week 2 lessons and move them onto the wNN-lN
-- id scheme.
--
-- Week 2 carried the original course's GLOBAL lesson numbering: its lessons
-- were "Lesson 4" and "Lesson 5" with ids lesson-4 / lesson-5. Every other
-- week numbers its lessons from 1 and (from week 3 on) uses per-week ids, so
-- Week 2 now matches:
--
--   lesson-4  →  w02-l1   "Lesson 4" → "Lesson 1"
--   lesson-5  →  w02-l2   "Lesson 5" → "Lesson 2"
--
-- Week 1 is deliberately left on lesson-1 … lesson-3: its numbering is already
-- 1-2-3 and the plain ids do not collide with anything.
--
-- The ids are RENAMED, not deleted and re-created, so teacher overrides,
-- student progress, quiz attempts, interactive-block XP, per-lesson quiz
-- settings and hide-toggles all follow the lesson instead of being orphaned.
-- lesson_id is plain text everywhere (no foreign keys), so a plain update is
-- enough; the target ids are new, so no row can collide.
--
-- Content rows are written from the static curriculum by
-- scripts/seed-curriculum.mjs (`npm run seed:curriculum`) — run it after this
-- migration so the seed-override rows match the renamed ids.
--
-- Idempotent: safe to re-run (the second run matches no lesson-4/lesson-5 row).
--
-- Rollback: re-run this file with the two ids swapped in the mapping CTE, then
-- revert src/data/lessonsweek-02.js and src/data/quizzesweek-02.js.
-- ============================================================

begin;

-- ── 1. Reference map: which week each seed lesson belongs to ─────────────────

-- quiz_week_for_lesson() reads this table so the quiz_attempts insert policy
-- never trusts a client-supplied week_id. A missing row falls back to the
-- client's value, so the new ids must land here in the same transaction.
delete from public.curriculum_lessons where lesson_id in ('lesson-4', 'lesson-5');

insert into public.curriculum_lessons (lesson_id, week_id) values
  ('w02-l1', 'week-2'), ('w02-l2', 'week-2')
on conflict (lesson_id) do update set week_id = excluded.week_id;

-- ── 2. Carry every per-lesson row over to the new id ─────────────────────────

update public.lessons               set id        = 'w02-l1' where id        = 'lesson-4';
update public.lessons               set id        = 'w02-l2' where id        = 'lesson-5';

update public.quizzes               set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.quizzes               set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.quiz_settings         set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.quiz_settings         set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.quiz_student_access   set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.quiz_student_access   set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.quiz_attempts         set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.quiz_attempts         set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.student_progress      set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.student_progress      set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.lesson_interactions   set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.lesson_interactions   set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

update public.lesson_materials      set lesson_id = 'w02-l1' where lesson_id = 'lesson-4';
update public.lesson_materials      set lesson_id = 'w02-l2' where lesson_id = 'lesson-5';

-- ── 3. Rewrite the id inside the per-lesson publish scopes ───────────────────

-- Only 'lessons-individual' and 'quizzes-individual' hold LESSON ids; the
-- other scopes hold week ids and must not be touched. A stale id here would
-- silently un-hide a lesson a teacher had hidden.
update public.section_publish_state
set item_ids = array_replace(array_replace(item_ids, 'lesson-4', 'w02-l1'), 'lesson-5', 'w02-l2'),
    updated_at = now()
where scope in ('lessons-individual', 'quizzes-individual')
  and (item_ids && array['lesson-4', 'lesson-5']::text[]);

update public.course_publish_state
set week_ids = array_replace(array_replace(week_ids, 'lesson-4', 'w02-l1'), 'lesson-5', 'w02-l2'),
    updated_at = now()
where scope in ('lessons-individual', 'quizzes-individual')
  and (week_ids && array['lesson-4', 'lesson-5']::text[]);

-- ── 4. Lesson number shown in the UI ─────────────────────────────────────────

-- Only touches seed-override rows: a teacher's own lesson keeps its number.
update public.lessons set lesson_number = 1, badge = 'Lesson 1'
where id = 'w02-l1' and is_custom = false;

update public.lessons set lesson_number = 2, badge = 'Lesson 2'
where id = 'w02-l2' and is_custom = false;

commit;
