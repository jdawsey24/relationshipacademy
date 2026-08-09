-- 0070 — one set of AI rules was governing six different products.
--
-- ai_settings is a single row, and it decides the model, the output ceiling, the
-- timeout, the daily and monthly spend caps, the kill switch and the allowed
-- generation types for everything: assessment items, result narratives, the
-- Framework Studio, the Content Engine script builder, and the Content Studio.
--
-- Those products want different answers. A Content Studio day of drafting
-- shouldn't eat the budget that assessment generation runs on, and pausing
-- script writing shouldn't stop a customer's result narrative from rendering.
--
-- So a surface may override any of it. Every column is nullable and null means
-- "whatever the global row says", so this changes nothing until something is
-- set, and the global row remains the single place to change everything at once.
--
-- THE KILL SWITCH IS THE EXCEPTION. A surface can stop itself, but it cannot
-- start itself: the global switch still wins. An emergency stop that some
-- product could opt out of is not an emergency stop.

create table if not exists public.ai_surface_settings (
  surface                     text primary key,
  label                       text not null,

  -- Which generation types belong to this surface. Used to attribute spend, so
  -- one surface's daily ceiling is measured against its own usage.
  generation_type_prefixes    text[] not null default '{}',

  -- All nullable. Null inherits from ai_settings.
  model                       text,
  output_limit                integer,
  timeout_seconds             integer,
  daily_cost_limit_usd        numeric(10,2),
  monthly_cost_limit_usd      numeric(10,2),
  enabled_generation_types    text[],
  conversation_soft_limit_usd numeric(10,2),
  conversation_hard_limit_usd numeric(10,2),

  -- Can pause itself. Cannot un-pause itself past the global switch.
  kill_switch_active          boolean not null default false,

  updated_by                  text,
  updated_at                  timestamptz not null default now()
);

comment on column public.ai_surface_settings.kill_switch_active is
  'Stops this surface only. The global ai_settings kill switch still overrides it — a surface can stop itself but cannot start itself.';

comment on column public.ai_surface_settings.generation_type_prefixes is
  'Prefixes of generation_type belonging to this surface, used to measure its own daily spend rather than everybody''s.';

-- The Content Studio. Its own budget, and limits that fit a build with a
-- try-again button on every stage rather than a single chat.
insert into public.ai_surface_settings (
  surface, label, generation_type_prefixes, enabled_generation_types,
  daily_cost_limit_usd, monthly_cost_limit_usd,
  conversation_soft_limit_usd, conversation_hard_limit_usd
) values (
  'content_studio',
  'Content Studio',
  array['cs_', 'ci_'],
  array['cs_variations', 'cs_tighten', 'cs_hooks', 'cs_bodies', 'cs_close',
        'cs_assemble', 'ci_studio_turn'],
  20, 200,
  -- A script is about fifty cents and a few regenerations are normal, so the
  -- old four-dollar warning fired mid-build. Raised to fit the work.
  8, 15
)
on conflict (surface) do nothing;

alter table public.ai_surface_settings enable row level security;
