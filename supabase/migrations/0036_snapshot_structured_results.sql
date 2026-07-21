-- Relationship Snapshot: structured results content per cluster. Replaces the
-- single-paragraph result (alignment_paragraph, now deprecated) with the full
-- structured Results-tab model. Additive and safe: text columns are nullable,
-- array columns default to an empty jsonb array. The seed re-populates every
-- cluster with the new content. alignment_paragraph is intentionally kept (no
-- longer rendered) so nothing that still reads it breaks.

alter table public.snapshot_clusters
  add column if not exists result_title        text,
  add column if not exists core_pattern        text,
  add column if not exists what_this_means      text,
  add column if not exists why_this_happens     text,
  add column if not exists how_it_may_show_up   jsonb not null default '[]'::jsonb,  -- array of bullets
  add column if not exists strengths            jsonb not null default '[]'::jsonb,  -- array of bullets
  add column if not exists blind_spots          jsonb not null default '[]'::jsonb,  -- array of bullets
  add column if not exists cost_of_staying_here text,
  add column if not exists growth_looks_like    text,
  add column if not exists developmental_focus  text,
  add column if not exists why_this_playbook    text,
  add column if not exists key_takeaway         text,
  add column if not exists call_to_action       text;

notify pgrst, 'reload schema';
