-- Relationship Situation Registry — CROSSWALK + cross-cutting M2M. The crosswalk is
-- the ONLY place the classification and framework layers meet. Competency is a FK
-- to canonical fw_competencies (never free text) and is NULL where unresolved
-- (9 held for steward review) or where competencies don't exist yet (16
-- Recovery/Renewal — task-level only). Additive, idempotent, RLS-locked.

create table if not exists public.reg_situation_framework_map (
  id                  uuid primary key default gen_random_uuid(),
  situation_id        text not null references public.reg_situations(situation_id) on delete cascade,
  phase_id            text not null references public.fw_phases(phase_id),
  developmental_task  text,                            -- derived from phase (one per phase)
  domain_id           text references public.fw_domains(domain_id),
  competency_id       text references public.fw_competencies(competency_id),  -- NULL = unresolved / task-level
  mapping_role        text not null default 'Primary',  -- Primary | Secondary
  resolution_status   text not null default 'resolved', -- resolved | held_steward_review | task_level_draft
  educational_objective text,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);
create index if not exists idx_reg_fwmap_situation on public.reg_situation_framework_map (situation_id);
create index if not exists idx_reg_fwmap_competency on public.reg_situation_framework_map (competency_id);

create table if not exists public.reg_search_terms (
  id           uuid primary key default gen_random_uuid(),
  situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  search_text  text not null,
  term_type    text,
  locale       text
);
create index if not exists idx_reg_search_situation on public.reg_search_terms (situation_id);

create table if not exists public.reg_related_situations (
  id                  uuid primary key default gen_random_uuid(),
  source_situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  target_situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  relationship_type   text,
  rationale           text
);

create table if not exists public.reg_companion_links (
  id           uuid primary key default gen_random_uuid(),
  situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  asset_type   text,                                   -- Companion Experience | Playbook | Academy Lesson | Snapshot | ...
  asset_id     text,
  asset_title  text,
  url          text,
  link_status  text
);
create index if not exists idx_reg_links_situation on public.reg_companion_links (situation_id);

create table if not exists public.reg_governance_log (
  id             uuid primary key default gen_random_uuid(),
  situation_id   text references public.reg_situations(situation_id) on delete set null,
  decision_type  text,
  decision       text,
  rationale      text,
  reviewer       text,
  affected_assets text,
  created_at     timestamptz not null default now()
);

alter table public.reg_situation_framework_map enable row level security;
alter table public.reg_search_terms            enable row level security;
alter table public.reg_related_situations      enable row level security;
alter table public.reg_companion_links         enable row level security;
alter table public.reg_governance_log          enable row level security;

notify pgrst, 'reload schema';
