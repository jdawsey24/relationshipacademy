-- RLC Studio — Phase E: AI authoring assist (provenance tracking).
--
-- Adds a `provenance` column (human | ai_generated | ai_assisted) to the typed
-- content tables that can now receive AI-drafted records, so every generated
-- record is traceable and can be badged in the UI. AI output always lands as
-- status='draft', provenance='ai_generated' — never auto-published.
--
-- Additive + idempotent. Run in the Supabase SQL editor.

do $$
declare t text;
begin
  foreach t in array array[
    'studio_assessment_items',
    'studio_practices','studio_activities','studio_interventions','studio_worksheets',
    'studio_conversation_guides','studio_journal_prompts','studio_videos','studio_lessons','studio_courses'
  ] loop
    execute format('alter table public.%I add column if not exists provenance text not null default ''human''', t);
  end loop;
end $$;

notify pgrst, 'reload schema';
