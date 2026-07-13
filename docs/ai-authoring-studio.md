# RLC AI Authoring Studio — AIS-1 deliverable (foundation + item generator)

**Status: BUILD-ONLY on branch `ai-authoring-studio`. Not merged, not deployed.**
Per the spec, nothing merges or deploys until the owner reviews the build and approves E2E testing.

## 1. Architecture summary

A secure, owner-only **drafting + provenance layer**. It does not replace the Content Library, Assessment Library, or the manuals/Knowledge Base — those remain the sources of truth. Flow:

`Select sources → assemble APPROVED context (+ immutable snapshots) → provider call → schema-validate → ai_item_drafts (temp id, Draft) → quality checks + duplicate detection → Review Queue → owner Approve → PERMANENT ASM-###### id + promote to Item Bank (draft preserved) | Reject → stays out`

- **AI can only produce Drafts.** Only the owner (with MFA/AAL2) approves, publishes, rejects, or retires.
- **Grounded only** in approved/canonical RLC records; retired records are excluded; retrieved content is treated as untrusted (prompt-injection defense) and kept separate from system instructions.
- **No user PII / journals / assessment responses / clinical data** is ever sent to the provider.

## 2. Files

- **Migration:** `supabase/migrations/0022_ai_studio.sql` — `ai_generation_requests`, `ai_generation_sources`, `ai_generation_outputs`, `ai_item_drafts`, `ai_content_drafts`, `ai_quality_checks`, `ai_approval_events`, `prompt_templates` (seeded: assessment_item + item_review, v1 approved), `ai_settings` (single row, kill switch), `publication_mappings`. All RLS-locked (service-role only); additive.
- **Libraries (`lib/ai/`):** `types.ts` (client-safe), `provider.ts` (abstraction + Anthropic; OpenAI/fallback stubbed), `context.ts` (RAG assembler + snapshots + injection-safe), `templates.ts`, `settings.ts`, `quality.ts` (deterministic + AI-assisted checks), `dedupe.ts`, `guard.ts` (owner+AAL2 + kill-switch/rate/cost preflight), `generateItem.ts` (orchestrator), `approve.ts` (promote to bank + permanent id).
- **APIs (`app/api/admin/ai/`):** `settings`, `templates`, `generate/assessment-item`, `drafts`, `drafts/[id]`, `drafts/[id]/transition`, `drafts/[id]/review`, `dashboard`, `history`. Every route: `requireAiOwner` (owner + AAL2), audited.
- **UI (`app/admin/ai/`):** Dashboard, Assessment Builder, Content Builder (AIS-2 placeholder), Review Queue, Generation History, Prompt Templates, Quality Rules, AI Settings. Sidebar item **AI Studio** (owner-only).
- **Tests:** `test/ai-quality.test.ts`, `test/ai-core.test.ts` (21 tests pass with the existing scoring suite via `npm test`).

## 3. RLS policies

Every new table has `enable row level security` with **no public policy** — reads/writes happen only through the service-role client inside owner+AAL2-gated server routes (same model as the rest of the Studio). Provider API keys are read from server env in `lib/ai/provider.ts`; nothing AI-related is exposed via `NEXT_PUBLIC_*` or imported into a client bundle.

## 4. E2E checklist (owner runs after review, once 0022 is applied)

1. Apply `0022_ai_studio.sql`. Confirm `AI Studio` appears in the sidebar (owner + MFA session).
2. **Owner-only access:** a non-owner (or owner without MFA) gets 403 on `/api/admin/ai/*`.
3. **Kill switch:** turn it on in AI Settings → generation returns 503; turn off → works.
4. **Grounding required:** generating without a competency is rejected.
5. **Generate:** Assessment Builder → pick a competency → Generate → drafts appear in the **Review Queue**, NOT in the Item Bank. `ai_generation_requests`/`_sources`/`_outputs` rows exist; source snapshots attached.
6. **Retired excluded:** retire the source competency → generation refuses (retired records excluded from retrieval).
7. **Quality + duplicates:** open a draft → deterministic findings show; "Run AI quality review" adds AI findings; near-duplicate items surface side-by-side.
8. **Approve:** approve a draft → it receives the next `ASM-######` id and appears in the Item Bank (`provenance='ai_generated'`); the draft is preserved with `permanent_item_id`; `ai_approval_events` logged.
9. **Reject:** reject a draft → it does NOT enter the Item Bank.
10. **Invalid model output:** (simulate) → `ai_generation_outputs.validation_status='failed'`, no draft rows created.
11. **Immutable templates:** an approved template can't be edited; a change creates a new version.
12. **Limits:** exceed the daily cost limit → generation blocked (429); rate limit fires on rapid calls.
13. **Audit:** `audit_log` has entries for generate/approve/reject/settings.
14. **Keys:** confirm no `ANTHROPIC_API_KEY` reference in any client bundle.

Automated coverage already green (`npm test`): quality-check behavior, cost estimate, owner-only status set, template rendering, duplicate similarity, provider abstraction.

## 5. Decision-log entry

> **DEC — AI Authoring Studio (AIS-1).** Adopted a staged provenance model: AI writes to `ai_item_drafts` (staging), not the canonical Item Bank; permanent `ASM-######` ids are assigned only on owner approval. Provider is abstracted (Anthropic wired; OpenAI/fallback feature-flagged). Generation is grounded via a retired-excluding, injection-safe RAG assembler with immutable source snapshots. Owner+AAL2 on all routes; kill switch + rate/cost limits. Phase-E direct-insert generators are superseded by this flow. Deferred to later phases: Content Builder (worksheet/lesson), Review Mode, publishing integration, remaining content types, provider fallback.

## 6. Rollback plan

Fully additive and reversible. To roll back: do not merge the branch (nothing is deployed). If `0022` was applied and needs removing, drop the new objects — no existing data is touched:

```sql
drop table if exists public.publication_mappings, public.ai_settings, public.prompt_templates,
  public.ai_approval_events, public.ai_quality_checks, public.ai_content_drafts,
  public.ai_item_drafts, public.ai_generation_outputs, public.ai_generation_sources,
  public.ai_generation_requests cascade;
notify pgrst, 'reload schema';
```

The canonical Item Bank, Content Library, and Knowledge Base are unaffected by a rollback.
