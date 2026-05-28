-- Fix for 20260528000000_add_dynamic_lessons.sql, which had two SQL errors that
-- prevented it from ever applying successfully:
--   1. `references` is a PostgreSQL reserved word — must be quoted as "references".
--   2. The `profiles` table was renamed/split into `staff` + `students` in
--      migration 0001_split_profiles.sql, so the RLS policy referenced a table
--      that no longer existed.
--
-- This migration is idempotent: it creates the tables/policies/triggers if they
-- are missing, and replaces any pre-existing policies with the corrected ones.

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.lessons (
  id text PRIMARY KEY,
  week_id text NOT NULL,
  lesson_number int NOT NULL,
  title text NOT NULL,
  badge text,
  subtitle text,
  read_time text DEFAULT '~15 min read',
  xp int DEFAULT 50,
  hero_image_url text,
  hero_image_alt text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  "references" jsonb NOT NULL DEFAULT '[]'::jsonb,
  layout jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_custom boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_week_id_idx ON public.lessons(week_id);
CREATE INDEX IF NOT EXISTS lessons_visibility_idx ON public.lessons(is_hidden) WHERE is_hidden = false;

CREATE TABLE IF NOT EXISTS public.quizzes (
  lesson_id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  time_limit int DEFAULT 900,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_custom boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lessons_select_all ON public.lessons;
CREATE POLICY lessons_select_all ON public.lessons FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS quizzes_select_all ON public.quizzes;
CREATE POLICY quizzes_select_all ON public.quizzes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS lessons_write_teacher ON public.lessons;
CREATE POLICY lessons_write_teacher ON public.lessons FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  );

DROP POLICY IF EXISTS quizzes_write_teacher ON public.quizzes;
CREATE POLICY quizzes_write_teacher ON public.quizzes FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND s.role IN ('teacher','admin'))
  );

-- ── Auto-bump updated_at ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.bump_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lessons_updated_at ON public.lessons;
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();

DROP TRIGGER IF EXISTS quizzes_updated_at ON public.quizzes;
CREATE TRIGGER quizzes_updated_at BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.bump_updated_at();
