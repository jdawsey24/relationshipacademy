-- 0075 — the Content Studio's first stage was never allowed to run.
--
-- 0070 seeded ai_surface_settings.enabled_generation_types with the six stages
-- that existed the day it was written. `read` was added to the pipeline
-- afterwards, so `cs_read` was missing, and because 0070 ends in
-- `on conflict (surface) do nothing` no later run could ever repair it.
--
-- The failure was invisible until the moment of use: every other stage worked,
-- and the one that broke was the FIRST one, so the Studio looked dead rather
-- than partly configured. The error only says the type is disabled, which reads
-- like a deliberate setting rather than a list that fell behind the code.
--
-- ADDITIVE AND IDEMPOTENT. This unions the missing type in rather than
-- replacing the array, so anything switched off on purpose stays off, and
-- running it twice changes nothing. test/content-intelligence.test.ts asserts
-- every stage in lib/contentStudio/stages.ts has a type listed here, so the next
-- stage that gets added fails a test instead of failing in her hands.

update public.ai_surface_settings
set enabled_generation_types = (
      select array_agg(distinct t)
      from unnest(
        enabled_generation_types
        || array['cs_read', 'cs_variations', 'cs_tighten', 'cs_hooks',
                 'cs_bodies', 'cs_close', 'cs_assemble']
      ) as t
    )
where surface = 'content_studio';
