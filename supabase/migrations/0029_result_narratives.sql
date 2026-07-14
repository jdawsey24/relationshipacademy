-- RLC — AI Result Narrative (Phase 2): per-session cache for the personalized
-- consumer narrative shown on the live results page.
--
-- The narrative is generated ONCE per session and cached here. The deterministic
-- scoring + results (lib/scoring.ts, app/api/score, app/api/results) are UNTOUCHED
-- — the narrative is additive and always falls back to the deterministic report.
-- Feature-flagged OFF by default (enable "result_narrative" in AI Settings).
-- RLS-locked (service-role only). Idempotent. Run in the Supabase SQL editor.

create table if not exists public.result_narratives (
  session_id    text primary key,             -- → quiz_sessions.id
  sections      jsonb not null,               -- [{ heading, body }]
  model         text,
  prompt_version int,
  safety_status text not null default 'ok',
  inputs_hash   text,                          -- hash of the grounding; regenerate only if results change
  created_at    timestamptz not null default now()
);

-- No public policies: written/read by the server via the service role only.
alter table public.result_narratives enable row level security;

notify pgrst, 'reload schema';
