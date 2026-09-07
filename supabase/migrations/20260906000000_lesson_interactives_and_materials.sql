-- ============================================================================
-- Interactive lesson blocks + teacher-uploaded lesson materials.
--
-- The interactive BLOCKS themselves need no schema: they are entries in
-- lessons.layout, which is already free-form jsonb. This migration adds only
--   1. lesson_materials     — teacher attachments (YouTube / PDF / PPT / Word)
--   2. lesson_interactions  — per-student completion of one interactive block
--   3. the two Storage buckets, including `lesson-media`, which until now was
--      created by hand in the dashboard and existed in no migration.
-- ============================================================================

-- ── Materials attached to a lesson ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.lesson_materials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    text NOT NULL,
  kind         text NOT NULL CHECK (kind IN ('youtube','pdf','ppt','doc','link')),
  title        text NOT NULL,
  description  text,
  url          text NOT NULL,        -- public Storage URL, or the external link
  storage_path text,                 -- set for uploads so delete can clean the object
  file_size    bigint,
  mime_type    text,
  sort_order   int NOT NULL DEFAULT 0,
  created_by   uuid REFERENCES auth.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_materials_lesson_idx
  ON public.lesson_materials(lesson_id, sort_order);

-- ── Per-student completion of one interactive block ─────────────────────────
-- Key shape mirrors game_progress (student + container + item), which is the
-- established pattern in this codebase for repeatable per-item progress.

CREATE TABLE IF NOT EXISTS public.lesson_interactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_id    text NOT NULL,
  block_id     text NOT NULL,
  block_type   text,
  completed    boolean NOT NULL DEFAULT true,
  xp_awarded   int NOT NULL DEFAULT 0,   -- frozen on first write; no XP farming
  attempts     int NOT NULL DEFAULT 1,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id, block_id)
);

CREATE INDEX IF NOT EXISTS lesson_interactions_student_idx
  ON public.lesson_interactions(student_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.lesson_materials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_interactions ENABLE ROW LEVEL SECURITY;

-- Materials: everyone signed in reads; only teachers/admins write.
DROP POLICY IF EXISTS lesson_materials_select_all ON public.lesson_materials;
CREATE POLICY lesson_materials_select_all ON public.lesson_materials FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS lesson_materials_write_teacher ON public.lesson_materials;
CREATE POLICY lesson_materials_write_teacher ON public.lesson_materials FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  );

-- Interactions: a student sees and writes only their own rows.
DROP POLICY IF EXISTS lesson_interactions_own ON public.lesson_interactions;
CREATE POLICY lesson_interactions_own ON public.lesson_interactions FOR ALL
  TO authenticated USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Staff may read all rows (for a future per-class report).
DROP POLICY IF EXISTS lesson_interactions_select_staff ON public.lesson_interactions;
CREATE POLICY lesson_interactions_select_staff ON public.lesson_interactions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  );

-- ── updated_at trigger (function already exists from the lessons migration) ──

CREATE OR REPLACE FUNCTION public.bump_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_materials_updated_at ON public.lesson_materials;
CREATE TRIGGER lesson_materials_updated_at BEFORE UPDATE ON public.lesson_materials
  FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();

-- ── Storage buckets ─────────────────────────────────────────────────────────
-- `lesson-media` is listed here deliberately: it is used by uploadLessonImage()
-- but was created manually in the dashboard, so a fresh environment had no
-- bucket and hero-image upload failed with no migration explaining why.

INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-media', 'lesson-media', true),
       ('lesson-materials', 'lesson-materials', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS lesson_buckets_read ON storage.objects;
CREATE POLICY lesson_buckets_read ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id IN ('lesson-media','lesson-materials'));

DROP POLICY IF EXISTS lesson_buckets_write_teacher ON storage.objects;
CREATE POLICY lesson_buckets_write_teacher ON storage.objects FOR ALL
  TO authenticated USING (
    bucket_id IN ('lesson-media','lesson-materials')
    AND EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  ) WITH CHECK (
    bucket_id IN ('lesson-media','lesson-materials')
    AND EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  );
