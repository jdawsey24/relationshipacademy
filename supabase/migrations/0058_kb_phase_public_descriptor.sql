-- Knowledge Base narrative layer — public descriptor (owner naming decision, 2026-08-06).
--
-- The naming decision distinguishes four things that were previously collapsed:
--
--   phase                  Recovery                       canonical identity: stored phase
--                                                         name, route identity, framework
--                                                         reference, mapping value
--   developmental_task     Healing                        canonical
--   consumer_phase_name    Getting Back to Yourself       consumer TRANSLATION of Recovery,
--                                                         never a replacement phase name
--   public_descriptor      Healing after relational loss  optional short public descriptor
--
-- `public_descriptor` is added here because the public phase cards need a short
-- consumer-facing line, and until now that line lived in lib/frameworkContent.ts
-- as independently authored copy. It moves into the Knowledge Base so there is
-- one authored source for it.
--
-- Idempotent. Run in the Supabase SQL editor.

alter table public.kb_phase_narratives
  add column if not exists public_descriptor text;

comment on column public.kb_phase_narratives.public_descriptor is
  'Optional short public-facing descriptor, e.g. "Healing after relational loss". A descriptor, not a name: the canonical phase name remains kb_phase_narratives.phase.';

comment on column public.kb_phase_narratives.consumer_phase_name is
  'Consumer translation of the phase, e.g. "Getting Back to Yourself". NEVER a replacement phase name. Route identity, framework reference and mapping values all use .phase.';
