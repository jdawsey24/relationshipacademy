-- Relationship Companion — Phase 1 (3/5): many-to-many mappings, safety rules,
-- featured content, and per-experience entitlement RULES. Every mapping supports
-- include/exclude so an experience can be broadly available but suppressed for a
-- specific status or safety context. Content tables: RLS-locked, no public policy.

-- An experience maps to many statuses/domains/phases/competencies/practices, each
-- as include or exclude. mode='exclude' suppresses even if otherwise matched.
create table if not exists public.companion_experience_status_mappings (
  experience_id      uuid not null references public.companion_experiences(id) on delete cascade,
  structural_status_id uuid not null references public.structural_statuses(id),
  mode               text not null default 'include',  -- include | exclude
  primary key (experience_id, structural_status_id)
);

create table if not exists public.companion_experience_domain_mappings (
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  domain        text not null,   -- Communication|Trust|Conflict Management|Emotional Intimacy|Role Functioning|Physical/Sexual Intimacy
  mode          text not null default 'include',
  primary key (experience_id, domain)
);

create table if not exists public.companion_experience_phase_mappings (
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  phase         text not null,   -- Exploration|Exclusivity|Expansion|Expiration|Recovery|Renewal
  mode          text not null default 'include',
  primary key (experience_id, phase)
);

create table if not exists public.companion_experience_competency_mappings (
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  competency    text not null,
  mode          text not null default 'include',
  primary key (experience_id, competency)
);

create table if not exists public.companion_experience_practice_mappings (
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  practice_key  text not null,
  mode          text not null default 'include',
  primary key (experience_id, practice_key)
);

-- Per-experience unlock policy (content rule). Distinct from a user's grant.
create table if not exists public.companion_experience_entitlements (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  policy        text not null default 'included',  -- included|free_preview|playbook_unlock|academy_unlock|subscription|manual|featured
  unlock_ref    text,                              -- e.g. playbook/product key that unlocks it
  created_at    timestamptz not null default now()
);
create index if not exists idx_companion_exp_entitlements on public.companion_experience_entitlements (experience_id);

-- Safety-aware content rules: condition -> action. Copy is placeholder.
create table if not exists public.companion_safety_rules (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,
  description   text,
  condition     jsonb not null default '{}'::jsonb,  -- structured condition (placeholder)
  action        text not null,                       -- suppress_experience|show_notice|recommend_professional|crisis_route|bypass_confrontation
  notice_copy   text,                                -- [SAFETY COPY TO BE PROVIDED]
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Manually featured experiences (scoped window).
create table if not exists public.companion_experience_featured (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  audience      text not null default 'public',
  starts_at     timestamptz,
  ends_at       timestamptz,
  display_order smallint not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.companion_experience_status_mappings     enable row level security;
alter table public.companion_experience_domain_mappings     enable row level security;
alter table public.companion_experience_phase_mappings      enable row level security;
alter table public.companion_experience_competency_mappings enable row level security;
alter table public.companion_experience_practice_mappings   enable row level security;
alter table public.companion_experience_entitlements        enable row level security;
alter table public.companion_safety_rules                   enable row level security;
alter table public.companion_experience_featured            enable row level security;

notify pgrst, 'reload schema';
