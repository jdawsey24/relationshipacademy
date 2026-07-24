# Companion RLS / Security Sweep

**Scope:** all Companion-related Supabase tables, functions, and server/API access paths.
**Result:** **CLEAN** — no vulnerabilities found; **no remediation required** within the Companion scope.
**Method:** static review of migrations 0037–0048 + `middleware.ts` + `lib/companion/*` + admin routes,
plus direct unauthenticated API attack tests. **Companion feature flag remains OFF.**

## Security model

Two tiers, both defense-in-depth:
- **User-owned data** — RLS enabled **with** an owner policy (`auth.uid() = user_id`, `for all` + `with check`). Direct PostgREST access with a user JWT sees only that user's rows.
- **Config / content / safety / analytics** — RLS enabled with **no client policy** (deny-all to `anon`/`authenticated`); reached only by the **service role** via server routes. The browser never queries these tables directly (verified — components use `fetch()` to server routes only).

All server access uses `getSupabaseAdminClient()` (service role, server-only key `SUPABASE_SERVICE_ROLE_KEY` — no `NEXT_PUBLIC`), and every data-layer function **scopes by `user_id`** (entries also call `ownsEntry()` before writes) — so even though the service role bypasses RLS, ownership is enforced in app code, with owner-RLS as the backstop.

## Tables audited (30) — RLS status + policy

| Tier | Tables | RLS | Policy |
|---|---|---|---|
| User-owned | companion_profiles, companion_user_entries, companion_user_entry_responses, companion_user_entry_tags, companion_user_entry_favorites, companion_conversation_plans, companion_blueprint_sections, companion_blueprint_section_versions, companion_user_milestones (9) | ✅ | `own … all` — `auth.uid() = user_id`, `for all` with check |
| Entitlement | companion_entitlements (1) | ✅ | `own entitlements select` (SELECT only; no insert/update/delete policy → a user cannot self-grant access; writes are service-role/webhook only) |
| Config / content | companion_experiences, companion_experience_blocks, companion_experience_versions, companion_experience_categories, companion_experience_featured, companion_experience_entitlements, companion_experience_status_mappings, companion_experience_phase_mappings, companion_experience_domain_mappings, companion_experience_competency_mappings, companion_experience_practice_mappings, companion_reusable_block_templates, companion_content_reviews (13) | ✅ | none — deny-all to clients; service-role only |
| Analytics | companion_events (1) | ✅ | none — deny-all; written by server |
| Safety | companion_safety_triggers, companion_safety_immediacy_terms, companion_safety_responses, companion_safety_resources, companion_safety_events, companion_safety_rules (6) | ✅ | none — deny-all; owner-only via admin routes |

Related (0037): `structural_statuses` (public-read reference data — non-sensitive list of relationship statuses), `user_structural_status_history` + `user_interest_preferences` (owner policies).

## Functions / RPCs / storage

- **No functions or RPCs** in the Companion migrations (0037–0048); **no `.rpc()` calls** in code → no Companion RPC attack surface.
- The only relevant SECURITY DEFINER function is `handle_new_user()` (standard signup trigger): `set search_path = public`, inserts only `profiles(new.id)` `on conflict do nothing`, no client parameters, no cross-user access → safe.
- No Companion storage buckets in scope.

## Authorization / security tests performed

| Test | Result |
|---|---|
| Unauthenticated companion consumer API (start / blueprint / planner / status / safety resources) | **PASS** — 401 "Sign in required." |
| Unauthenticated specific-ID IDOR probes (planner/journey/entries `/{uuid}`) | **PASS** — 401 at the edge, no data |
| Unauthenticated safety-admin API (triggers/immediacy/responses/resources/events, GET + POST) | **PASS** — 401 "Unauthorized" |
| Every Companion route has an auth guard (`require*` or inline `getCompanionUser()`) | **PASS** — all 30 route files guarded; middleware matcher covers `/api/companion` + `/api/admin` |
| Admin authorization uses server-controlled role | **PASS** — `getAdminRole()` reads `app_metadata.role` (not client-writable `user_metadata`); fails closed to `viewer` |
| Safety registry/response/resource/event admin blocked for ordinary users | **PASS** — `requireOwner` + deny-all RLS |
| Service-role key server-only | **PASS** — `SUPABASE_SERVICE_ROLE_KEY`, no `NEXT_PUBLIC`; `getSupabaseAdminClient` throws if missing |
| No client-side DB access to Companion tables | **PASS** — components use `fetch()` to server routes |
| Data layer scopes every query by `user_id` (+ `ownsEntry`) | **PASS** — entries/planner/blueprint/journey reviewed |
| Raw safety disclosures not exposed via any DB/API path | **PASS** — events metadata-only; learner content is owner-RLS'd (their own journal) |

**Not testable in this harness:** authenticated **cross-user** access (would require forging a second real user session). It is provably blocked by **both** layers — the owner-RLS policy (`auth.uid() = user_id`) and the app-code ownership checks (`.eq("user_id", …)` + `ownsEntry`). Recommend a two-account manual/E2E confirmation as part of final pre-launch validation.

## Changes made

**None.** The Companion security posture is already sound; no RLS or authorization changes were required.

## Remaining / out of scope

- The prior platform audit's "tables missing RLS" refers to **non-Companion** tables (studio_/quiz_/snapshot_ etc.), which are **outside this task's scope** and remain a separate item.
- Recommended before go-live: a two-account cross-user E2E confirmation (belongs to final pre-launch validation).
