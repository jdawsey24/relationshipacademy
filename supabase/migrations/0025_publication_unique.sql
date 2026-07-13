-- RLC AI Authoring Studio — AIS-4: publishing integration.
--
-- publication_mappings was created in 0022. Add a uniqueness constraint so a
-- (source, destination) pair maps at most once — enabling idempotent publish
-- (upsert) and clean unpublish. Additive; the table is currently empty.
-- Run in the Supabase SQL editor.

create unique index if not exists publication_mappings_unique
  on public.publication_mappings (source_type, source_id, destination);

notify pgrst, 'reload schema';
