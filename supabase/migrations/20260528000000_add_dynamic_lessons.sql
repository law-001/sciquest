-- ── Lessons (overrides for static, full row for custom) ──────────────
CREATE TABLE lessons (
  id text PRIMARY KEY,                  -- "lesson-1" overrides static; "lesson-<uuid>" for custom
  week_id text NOT NULL,                -- "week-1"
  lesson_number int NOT NULL,
  title text NOT NULL,
  badge text,
  subtitle text,
  read_time text DEFAULT '~15 min read',
  xp int DEFAULT 50,
  hero_image_url text,                  -- Supabase Storage URL or external
  hero_image_alt text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,    -- ["Overview", "Breakdown", ...]
  references jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{label, url}]
  layout jsonb NOT NULL DEFAULT '[]'::jsonb,      -- [{type, heading, data}, ...]
  is_custom boolean NOT NULL DEFAULT false,       -- true = no static counterpart
  is_hidden boolean NOT NULL DEFAULT false,       -- soft-delete for static IDs
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lessons_week_id_idx ON lessons(week_id);
CREATE INDEX lessons_visibility_idx ON lessons(is_hidden) WHERE is_hidden = false;

-- ── Quizzes (overrides for static, full row for custom) ──────────────
CREATE TABLE quizzes (
  lesson_id text PRIMARY KEY,           -- matches lessons.id (1:1)
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

-- ── RLS ──────────────────────────────────────────────────────────────
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can SELECT
CREATE POLICY lessons_select_all ON lessons FOR SELECT
  TO authenticated USING (true);
CREATE POLICY quizzes_select_all ON quizzes FOR SELECT
  TO authenticated USING (true);

-- Only teachers/admins can INSERT / UPDATE / DELETE
CREATE POLICY lessons_write_teacher ON lessons FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  );

CREATE POLICY quizzes_write_teacher ON quizzes FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher','admin'))
  );

-- ── Auto-bump updated_at ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION bump_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$ LANGUAGE plpgsql;

CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION bump_updated_at();
CREATE TRIGGER quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION bump_updated_at();
