-- RLC Content Intelligence — conversation, brief, lenses, voice (Phase A).
--
-- The conversation is the record. Everything the owner sees is derived from
-- these tables; the technical states live here so they do not have to live on
-- the screen.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Conversations and turns
-- ---------------------------------------------------------------------------
create table if not exists public.ci_conversations (
  id           uuid primary key default gen_random_uuid(),
  title        text,
  status       text not null default 'open',      -- open | packaged | archived
  entry_path   text not null default 'idea',      -- idea | opportunity
  keyword_id   uuid references public.ce_platform_keywords(id),
  brief_id     uuid references public.ce_content_briefs(id),
  cost_usd     numeric(10,4) not null default 0,
  cost_state   text not null default 'ok',        -- ok|soft_warned|hard_stopped|owner_continued
  created_by   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.ci_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  seq             integer not null,
  role            text not null,                  -- owner | assistant | system
  content         text not null,
  kind            text not null default 'message',-- message|question|reflection|proposal|notice
  cost_usd        numeric(10,4) not null default 0,
  model           text,
  generation_request_id uuid references public.ai_generation_requests(id) on delete set null,
  created_at      timestamptz not null default now(),
  unique (conversation_id, seq)
);

create table if not exists public.ci_sources (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  kind            text not null,                  -- text|link|screenshot|file|voice|keyword|saved_idea
  raw             text,
  sanitized       text,
  extracted       text,
  keyword_id      uuid references public.ce_platform_keywords(id),
  storage_path    text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Working Brief — one row per field, so provenance and protection are
--    per-field rather than per-brief.
--
--    `state` is the owner-protection mechanism: once a field is owner_edited or
--    owner_confirmed, a write becomes a suggestion instead of a replacement.
--    None of this vocabulary appears in the default interface.
-- ---------------------------------------------------------------------------
create table if not exists public.ci_brief_fields (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  field           text not null,
  value           text,
  state           text not null default 'inferred', -- inferred|owner_edited|owner_confirmed|superseded
  derived_from    uuid[] not null default '{}',     -- ci_messages ids
  confidence      numeric(3,2),
  superseded_by   uuid,
  updated_by      text,
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ci_brief_field_state') then
    alter table public.ci_brief_fields add constraint ci_brief_field_state
      check (state in ('inferred', 'owner_edited', 'owner_confirmed', 'superseded'));
  end if;
end $$;

-- One live row per field per conversation; superseded rows are kept as history.
create unique index if not exists idx_ci_brief_live
  on public.ci_brief_fields (conversation_id, field) where state <> 'superseded';

-- A pending suggestion against a field the owner already touched. It never
-- replaces the value — the owner accepts or dismisses it.
create table if not exists public.ci_field_suggestions (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  field           text not null,
  suggested_value text not null,
  rationale       text,
  status          text not null default 'pending', -- pending|accepted|dismissed
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Lenses — exploratory. Nothing here is approved mapping data.
-- ---------------------------------------------------------------------------
create table if not exists public.ci_lens_options (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  competency_id   text references public.fw_competencies(competency_id),
  phase_id        text references public.fw_phases(phase_id),
  domain_id       text references public.fw_domains(domain_id),
  status          text not null default 'suggested',  -- suggested|selected|rejected|combined|owner_supplied
  strength        text,                                -- strong|moderate|weak|forced
  relation        text,                                -- direct_application|related_lens
  plain_summary   text not null,                       -- what the owner actually reads
  why_it_fits     text,
  what_it_illuminates text,
  how_it_changes_the_lesson text,
  mapping_valid   boolean not null default false,
  mapping_errors  text[] not null default '{}',
  source_approval_state text,                          -- carried from the narrative record
  source_version_label  text,
  owner_reason    text,                                -- OPTIONAL. Never required.
  combined_with_id uuid,
  promoted_bridge_id uuid references public.ce_relational_bridges(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ci_lens_status') then
    alter table public.ci_lens_options add constraint ci_lens_status
      check (status in ('suggested','selected','rejected','combined','owner_supplied'));
  end if;
  -- A lens may only be promoted to a bridge once it is selected AND validates.
  if not exists (select 1 from pg_constraint where conname = 'ci_lens_promotion') then
    alter table public.ci_lens_options add constraint ci_lens_promotion
      check (promoted_bridge_id is null
             or (status in ('selected','combined','owner_supplied') and mapping_valid = true));
  end if;
end $$;

create index if not exists idx_ci_lens_conv on public.ci_lens_options (conversation_id, status);

-- ---------------------------------------------------------------------------
-- 4. Decisions — append-only. A changed mind writes a new row.
-- ---------------------------------------------------------------------------
create table if not exists public.ci_decisions (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  decision_type   text not null,
  value           text,
  message_id      uuid references public.ci_messages(id) on delete set null,
  supersedes_id   uuid references public.ci_decisions(id),
  decided_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Retrieval provenance — what was consulted, at which tier, about what
-- ---------------------------------------------------------------------------
create table if not exists public.ci_retrieval_events (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references public.ci_conversations(id) on delete cascade,
  message_id        uuid references public.ci_messages(id) on delete set null,
  query_text        text,
  results           jsonb not null default '[]'::jsonb,
  governed_property text,
  tier_conflict     boolean not null default false,
  conflict_scope    text,
  conflict_note     text,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. Voice rules — created empty.
--
--    No approved voice rules exist. The Playbook's documented voice belongs to a
--    different product and is NOT migrated here. Rows may be proposed for owner
--    review; nothing is active until status='owner_approved'.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_voice_rules (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null,   -- principle|example|prohibited_language|reading_level
                                 -- |platform_style|series_style|inferred_preference
  scope         text not null default 'global',   -- global | platform:<x> | series:<x> | product:<x>
  content       text not null,
  rationale     text,
  status        text not null default 'draft',    -- draft|owner_approved|rejected
  origin        text not null default 'authored', -- authored|inferred_from_conversation|proposed_migration
  original_source text,
  original_scope  text,
  wording_change  text,                            -- preserved | adapted, and how
  conversation_id uuid references public.ci_conversations(id) on delete set null,
  message_id      uuid references public.ci_messages(id) on delete set null,
  approved_by   text,
  approved_at   timestamptz,
  created_at    timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_voice_status') then
    alter table public.ce_voice_rules add constraint ce_voice_status
      check (status in ('draft', 'owner_approved', 'rejected'));
  end if;
  -- Approval requires a named approver, as everywhere else in this system.
  if not exists (select 1 from pg_constraint where conname = 'ce_voice_approval') then
    alter table public.ce_voice_rules add constraint ce_voice_approval
      check (status <> 'owner_approved' or approved_by is not null);
  end if;
  -- A preference inferred from a conversation can never be approved directly;
  -- it must be re-authored as a rule the owner reviews.
  if not exists (select 1 from pg_constraint where conname = 'ce_voice_inferred_not_approved') then
    alter table public.ce_voice_rules add constraint ce_voice_inferred_not_approved
      check (origin <> 'inferred_from_conversation' or status <> 'owner_approved');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 7. Cost controls — configurable, not hardcoded
-- ---------------------------------------------------------------------------
alter table public.ai_settings
  add column if not exists conversation_soft_limit_usd numeric(10,2) not null default 4;
alter table public.ai_settings
  add column if not exists conversation_hard_limit_usd numeric(10,2) not null default 6;

update public.ai_settings
   set daily_cost_limit_usd = 50,
       monthly_cost_limit_usd = 500
 where daily_cost_limit_usd < 50;

alter table public.ai_generation_requests
  add column if not exists conversation_id uuid references public.ci_conversations(id) on delete set null;
alter table public.ai_generation_requests
  add column if not exists stage_kind text;

-- ---------------------------------------------------------------------------
-- 8. RLS — service-role only, as everywhere else in the engine
-- ---------------------------------------------------------------------------
alter table public.ci_conversations     enable row level security;
alter table public.ci_messages          enable row level security;
alter table public.ci_sources           enable row level security;
alter table public.ci_brief_fields      enable row level security;
alter table public.ci_field_suggestions enable row level security;
alter table public.ci_lens_options      enable row level security;
alter table public.ci_decisions         enable row level security;
alter table public.ci_retrieval_events  enable row level security;
alter table public.ce_voice_rules       enable row level security;
