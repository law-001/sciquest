-- ============================================================================
-- Enable Realtime for the content tables.
--
-- src/lib/lessons.js, quizzes.js and materials.js each open a `postgres_changes`
-- subscription so a teacher's save reaches students who already have the page
-- open. Those tables were never added to the supabase_realtime publication, so
-- the subscriptions connected and then simply never fired — students kept
-- seeing the previous version until they reloaded, with no error anywhere.
--
-- Mirrors the guarded pattern in 20260524000000_course_settings.sql. Idempotent:
-- a table already in the publication raises duplicate_object, which is swallowed.
--
-- To reverse: remove each of public.lessons, public.quizzes and
-- public.lesson_materials from the supabase_realtime publication.
-- ============================================================================

begin;

do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['lessons', 'quizzes', 'lesson_materials'] loop
      begin
        execute format('alter publication supabase_realtime add table public.%I', t);
      exception
        when duplicate_object then null;
        when undefined_table then null;
      end;
    end loop;
  end if;
end$$;

commit;
