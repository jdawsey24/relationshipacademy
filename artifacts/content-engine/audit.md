# RLC Content Engine — Repository & API Feasibility Audit

*2026-08-05. Pre-implementation. No code written, no migrations created.*

Every claim is tagged: **[REPO]** verified in this repository or its live database ·
**[API]** verified against current official documentation today · **[REC]** my recommendation ·
**[ASSUME]** assumption I am making · **[OPEN]** needs your decision.

---

## 1. Current repository stack **[REPO]**

| | |
|---|---|
| Framework | Next.js **15.1.6** App Router, React 19, TypeScript 5.7 |
| Data | Supabase (`@supabase/supabase-js` 2.45), Postgres, service-role admin client |
| AI | **`@anthropic-ai/sdk` 0.111** — already a dependency |
| Payments | Stripe 22 · Email: Resend 6.17 |
| Styling | Tailwind 3.4 with custom RLC tokens |
| Scripts | `tsx` — the established pattern for one-off and cron scripts |
| Deploy | Netlify, **local-CLI builds only** (`netlify deploy --build --prod`) |
| Tests | `node --test --import tsx test/*.test.ts` — **519 passing** |

No queue, no Redis, no background worker. Scheduled work runs through Netlify Scheduled Functions.

## 2. Database and migration structure **[REPO]**

- **54 migrations**, `supabase/migrations/NNNN_name.sql`, sequential, hand-run by you.
- RLS enabled per table; writes go through the service role, reads via owner policies.
- Naming is domain-prefixed and consistent: `fw_*` (framework), `kb_*` (knowledge base), `studio_*` (authoring), `ai_*` (generation), `companion_*`, `playbook_*`, `snapshot_*`.
- A Content Engine should follow with a **`ce_*`** prefix.

## 3. Admin / owner access **[REPO]**

- `lib/adminApi.ts` — roles are `owner | editor | viewer`, read from `app_metadata.role`. Not user-settable.
- `requireOwner()` for owner-only routes; `requireAdmin()` for the admin surface.
- **`lib/ai/guard.ts` → `requireAiOwner()` is the strictest gate in the codebase**: owner role **plus** an MFA-verified session (AAL2). Every AI Studio route already uses it.
- `lib/rateLimit.ts` — `rateLimit()` + `tooManyRequests()`, already applied in the AI guard.
- `lib/audit.ts` — `audit({actor, action, metadata})`, used by admin mutations.
- Admin pages live under `app/admin/*` (20 sections incl. `ai`, `framework`, `knowledge-center`, `content`, `analytics`).

**The Content Engine should reuse `requireAiOwner()` verbatim.** It gives owner-only + MFA with zero new code.

## 4. Existing AI provider and prompt architecture **[REPO]**

This is the single most important finding: **most of what the Content Engine needs already exists.**

`lib/ai/` — 17 modules:

| File | What it does |
|---|---|
| `provider.ts` | Provider abstraction. `AiProvider` interface, Anthropic wired, structured JSON-schema output, timeouts. Keys server-side only. |
| `templates.ts` | `getActiveTemplate(generationType)` — resolves the **approved, highest-version** prompt from `prompt_templates`. `renderTemplate()` fills `{{vars}}`. Approved templates are immutable; edits create a new version. |
| `settings.ts` | `ai_settings` row — model, output limit, retry limit, **daily $25 / monthly $300 cost caps**. |
| `guard.ts` | Owner + AAL2 + rate limit. |
| `context.ts` | Assembles approved source records into model context. |
| `quality.ts` / `dedupe.ts` / `reviewContent.ts` / `approve*.ts` | QC checks, similarity dedupe, review + approval flow. |
| `generateContent.ts` / `generateItem.ts` | Orchestrators. |

**Existing tables (migration 0022) map almost 1:1 onto the Content Engine's needs:**

| Table | Content Engine use |
|---|---|
| `ai_generation_requests` | generation runs — has `generation_type`, `prompt_template_id`+`version`, `provider`, `model`, `parameters` jsonb, status, tokens |
| `ai_generation_sources` | **source provenance** — `source_entity_type` (`kb_competency`, `behavioral_indicator`, …), `source_entity_id`, `source_version`, `source_snapshot` jsonb |
| `ai_content_drafts` | drafts — `competency_id`, `draft_content` jsonb, `source_ids`, `quality_status`, `status`, reviewer + approval fields |
| `ai_quality_checks` | QC findings — `check_type`, `severity`, `passed`, `finding`, `recommendation` |
| `ai_approval_events` | approval audit trail |
| `prompt_templates` | versioned, approved prompts |
| `ai_settings` | model + cost caps (row exists in the live DB) |

**⚠️ Blocking: `ANTHROPIC_API_KEY` is not set — not in `.env.local`, not in Netlify production.** The entire AI Studio is built and inert. No generation can happen until this is provisioned. **[OPEN]**

**⚠️ `ai_settings.model` is `claude-opus-4-8`.** Current default is `claude-opus-5` (same price, $5/$25 per Mtok). **[API]**

**⚠️ No web-search capability exists anywhere.** Zero references to `web_search`, no tool-use array, no outbound news/HTTP fetch outside Stripe/Supabase/Resend. Trend discovery is genuinely new surface.

## 5. Existing tables and services to reuse **[REPO]**

Reuse, do not duplicate:

- **Framework canon** — FK to `fw_competencies.competency_id`; JOIN `kb_competencies` (`kind='competency'`) for approved narrative. Resolved in §6.
- **Generation + draft + provenance + QC** — the seven `ai_*` tables above.
- **Auth / audit / rate limit** — `requireAiOwner`, `audit`, `rateLimit`.
- **Cron** — `netlify/functions/*-cron.mjs` → `CRON_SECRET`-protected `/api/cron/*`. Two already run (`email-sequence-cron`, `playbook-reconcile-cron`). `CRON_SECRET` is set in Netlify production.
- **Email** — `lib/email/client.ts` `sendEmail()` for owner notifications.
- **Marketing/consumer naming** — `lib/playbookMarketing.ts`, `snapshot_clusters`, `lib/snapshot/resultTitle.ts` (consumer-safe titles).

## 6. Source-file inventory **[REPO]**

**All 9 files now present** (owner imported the missing 6 on 2026-08-05). `import/` holds seven;
the Companion Architecture Workbook is at `data/companion-architecture/…_v2_POPULATED.xlsx`.
⚠️ One mismatch remains: `docs/companion-competency-review-workbook.xlsx` is **not** the `_reviewed`
variant specified.

### ✅ RESOLVED — the competency-authority question (and I was wrong)

My earlier reading of this as a "second source of authority" was **incorrect**. Verified by comparing
every ID in `04_Competencies` against both live tables:

| Table | Rows | vs. canonical workbook |
|---|---:|---|
| `fw_competencies` | 111 | **exact 1:1 match** — 0 missing, 0 extra |
| `kb_competencies` | 123 | same 111 **plus 12 correctly-typed non-competency rows** |

The 12 "extra" rows are 6 domains (`DOM-001…006`) and 6 phases (`PHASE-EXPLORATION…RENEWAL`), and
`kb_competencies` carries a **`kind` column** (`competency | domain | phase`) that distinguishes them.
It is a deliberate unified knowledge-base table, not a duplicate. Every consumer filters correctly —
`studioAssessmentData`, `studioAiAuthor`, `studioFrameworkData` all `.eq("kind","competency")`, and
`listKb()` takes a `kind` filter.

**The split matches the governing rules exactly:**

| Workbook sheet | Live table | Role |
|---|---|---|
| `04_Competencies` (111, narrative cols marked `[DEPRECATED]`) | `fw_competencies` — thin: `competency_id, name, phase, domain, developmental_task` | core records, **no narrative** |
| `22_Competency_Details` (111: Definition, Purpose, Developmental Significance, Observable Expressions, indicator IDs) | `kb_competencies` where `kind='competency'` | **canonical narrative** |
| `21_Domain_Details` (6) | `kb_competencies` where `kind='domain'` | canonical domains |

The deprecated narrative columns in `04_Competencies` are **not** loaded into `fw_competencies` — the
rule "deprecated narrative fields must not become a second source of authority" is already enforced by
the schema.

**Decision for the Content Engine:** FK `competency_id` → **`fw_competencies.competency_id`** (the
canonical key, exact match to `04_Competencies`); JOIN to `kb_competencies` on `code` with
`kind='competency'` for the approved consumer narrative. No new competency storage.

### Newly imported source files **[REPO]**

| File | Structure |
|---|---|
| **RLC_Master_Knowledge_Base_v2.1.xlsx** | **31 sheets.** `04_Competencies` 111 · `22_Competency_Details` 111 · `21_Domain_Details` 6 · `05_Behavioral_Indicators` 333 · `06_Incomplete_Indicators` 333 · `07_Intervention_Registry` 333 · `08_Practice_Library` 333 · `17_Content_Registry` **1,665** · plus `02_Lookups`, `03_ID_Standards`, `20_Decision_Log`, `23_Database_Schema_Map`, `27_Migration_Junctions`, `28_Postgres_Field_Map` (372) |
| **RLC_Experience_Clusters.xlsx** | 8 sheets — Cluster Framework 33 · **Full Statement Mapping 1,085** · Culture Terms–Audience Map 35 · Relationship Playbooks 29 · Assessment Structure/Quizzes · Results · **Excluded – Cultural Language 32** (a ready-made banned-language list) |
| **Relationship_Situation_Registry_v0.1.xlsx** | 16 sheets — Situations 60 · Framework Crosswalk 60 · **Search Terms 180** · Related Situations · Companion Links · Version History · Governance Log · Publication Status |
| **RLC Operations Manual.docx** | Operational Definitions Manual — the authority for architecture: Core Ontology, Developmental Architecture, Developmental Influence System, Structural Architecture, Competency Architecture |
| **Facilitator Manual.docx** | The largest (~19k runs) — the six phases in teaching voice. **Best single source for consumer-safe translation and tone.** |
| **Recovery_and_Renewal_Competency_Manual_v0.1.docx** | Recovery + Renewal competencies by domain, with §2.1 "Construct decisions preserved in this manual". **Status: approved working architecture, NOT canonical** — must carry a status flag, never silently promoted. |

Two sheets are directly useful to the Content Engine beyond the framework: **`Search Terms` (180)** in the
Situation Registry, and **`Excluded – Cultural Language` (32)** in Experience Clusters, which can seed the
QC banned-phrasing gate rather than being hand-authored.

### Keyword workbook structure **[REPO]**

11 sheets — Overview · Cross-Platform Map · **Threads · Instagram · TikTok · YouTube · LinkedIn · X · Pinterest** · Performance Log · Scoring & Sources. Per-platform sheets are already the model you described:

`Rank | Primary keyword/phrase | Signal role | Community keyword | RLC phase | RLC domain | Audience doorway | RLC interpretation | Opening use | Supporting terms | Best format | CTA fit | Audience recognition (1-5) | Platform fit (1-5) | RLC fit (1-5) | Conversion fit (1-5) | Momentum/evergreen (1-5) | Opportunity score | Priority tier`

Sample row: `mixed signals | Live-capable | dating | Exploration | Trust/Communication | … | 5|5|5|5|5 | 100 | Tier 1`

Scoring weights are explicit (`Audience recognition 0.25`, `Platform fit 0.25`, `RLC fit 0.25`, …) and the sheet already self-labels as *"Directional planning scores, not official."* Performance Log carries 23 columns matching your metric list. **This is a clean, ready import target.**

---

## 7. API feasibility matrix **[API — verified today against official docs]**

| Source | Status | What it actually gives | Verdict |
|---|---|---|---|
| **Threads Keyword Search** | Available | `GET /keyword_search`, `search_mode=TAG` for topic tags, `search_type=TOP\|RECENT`, `media_type` filter. Returns `id, text, media_type, permalink, timestamp, username, has_replies, is_quote_post, is_reply`. **2,200 queries / rolling 24h.** | **Validation only.** ❌ No engagement metrics, no view counts. ❌ Does **not** surface trending topics — it only searches phrases you supply. ⚠️ Requires the `threads_keyword_search` permission via **app review**; without it, search is limited to *your own* posts. |
| **YouTube Data API v3** | Available | 10,000 quota units/day. `videos.list?chart=mostPopular` = **1 unit**; `search.list` = **100 units**. | **Good discovery source.** Regional trending at 1 unit/call means all regions many times daily. Avoid `search.list` in loops. |
| **Google Trends API** | ⚠️ **Alpha, application-gated** | Announced 2025-07-24; ~1 year on, still limited to a small tester pool. Scaled search interest, 1800-day history, geo restriction — *when granted*. | **Not available.** Apply, but do not design around it. |
| **Anthropic web search** (existing provider) | ✅ **Available now** | Server-side tool: `{"type":"web_search_20260318","name":"web_search"}`. Options: `max_uses`, `allowed_domains`/`blocked_domains`, `user_location`, `response_inclusion`. Returns cited sources (`url`, `title`, `page_age`, `encrypted_content`). Dynamic filtering on Claude 4.6+ filters results *before* they hit context. | **The MVP discovery source.** No new vendor, no new credential, server-side, cited. **$10 per 1,000 searches** + tokens. ⚠️ Must be enabled for the org in Console → Privacy (a disabled org gets a 400). |
| **Manual timeline entry** | N/A | You paste phrase / URL / post text / Community. | **Required.** The only source that captures your personalised For You feed, which no API exposes. |
| Existing news/cultural source in the app | **None** | — | Nothing to reuse. |

**Your discovery-vs-validation distinction is exactly right and is confirmed by the docs:** Threads validates a known phrase and returns no engagement numbers; nothing in the official Threads API exposes Trending Now or your timeline.

## 8. Recommended MVP trend-source stack **[REC]**

1. **Anthropic web search** — discovery + fact verification + citations. Already have the SDK and the provider abstraction; needs only `ANTHROPIC_API_KEY`.
2. **Manual timeline entry** — first-class, not a fallback. It is the only route to your actual feed.
3. **YouTube `videos.list?chart=mostPopular`** — cheap regional discovery, 1 unit/call. Phase 2.
4. **Threads keyword search** — phase-validation only, *after* app review clears. Never presented as a volume metric.
5. **Google Trends** — apply now, integrate if/when granted. Not on the critical path.

Everything behind one `TrendProvider` interface with your specified fields (source, fetched_at, region, platform, exact phrase, related phrases, metrics, source URL, confidence, api_status, cache_expires_at, raw response). One provider down must never break the engine.

## 9. Proposed data model **[REC]**

New tables, `ce_` prefix, foreign-keyed to existing canon — **no framework definitions copied**:

```
ce_trend_sources        provider registry: name, kind(discovery|validation), enabled, health, last_ok_at
ce_trend_candidates     normalized topic: canonical_name, first_observed_at, last_validated_at,
                        status, dedupe_key
ce_trend_observations   per-source sighting: candidate_id → source_id, exact_phrase, related_phrases[],
                        platform, region, metrics jsonb, source_url, confidence, raw jsonb
ce_platform_keywords    from the workbook, ONE ROW PER PLATFORM (never collapsed):
                        platform, rank, primary_keyword, signal_role, supporting_terms[],
                        phase_id→fw_phases, domain_id→fw_domains, audience_doorway,
                        rlc_interpretation, opening_use, best_format, cta_fit, 5 sub-scores,
                        opportunity_score, priority_tier
ce_communities          community_keyword, platform, official/informal, verified, audience_overlap,
                        rlc_relevance, authority_fit, trend_potential, usage_guidance
ce_community_keywords   join: community ↔ platform keyword
ce_relational_bridges   candidate_id, bridge_type(1-6), affected_population, relational_consequence,
                        competency_id → <canonical competency table>, phase_id, domain_id,
                        rationale, accepted_by_owner, rejected_reason
ce_content_angles       bridge_id, title, hook, opportunity_score, score_breakdown jsonb, rationale
ce_scoring_weights      configurable, seeded from the workbook's Scoring & Sources sheet
ce_performance_records  post_url, platform, keyword_id, community_id, draft_id, 20+ metric columns,
                        recorded_at, entry_mode(manual|api)
```

**Reused, not rebuilt:** `ai_generation_requests` (generation runs) · `ai_generation_sources` (RLC provenance — extend `source_entity_type` with `ce_trend_candidate`, `ce_platform_keyword`) · `ai_content_drafts` + versioning (drafts) · `ai_quality_checks` (QC) · `ai_approval_events` · `prompt_templates` (prompt versions) · `ai_settings` (cost caps).

**Draft versioning:** `ai_content_drafts` currently has no `version`/`parent_draft_id`. Your "regeneration creates a new version, never overwrites an approved draft" requirement needs **two added columns**, not a new table.

## 10. Proposed pages, endpoints, services **[REC]**

**Pages** — `app/admin/content-engine/`: `page.tsx` (dashboard) · `trends/` (cards + why-included/excluded) · `trends/[id]/` (bridges, accept/reject/edit before generation) · `drafts/[id]/` (versions, diff, approve) · `performance/` (entry + medians) · `keywords/` (per-platform + communities).

**Endpoints** — all behind `requireAiOwner()`:
`POST /api/admin/content-engine/trends/discover` · `POST …/trends/manual` · `GET …/trends` · `POST …/trends/[id]/bridges` · `PATCH …/bridges/[id]` (accept/reject/edit) · `POST …/generate` · `POST …/drafts/[id]/regenerate` · `POST …/drafts/[id]/approve` · `POST …/performance` · `GET …/providers/health`.

**Services** — `lib/contentEngine/`: `providers/{index,webSearch,manual,youtube,threads}.ts` (common interface) · `normalize.ts` (dedupe) · `bridges.ts` · `scoring.ts` (weights from DB) · `retrieval.ts` (approved RLC records → model context) · `generate.ts` (per-platform) · `qc.ts` (safety gates) · `performance.ts` (medians, not outliers).

## 11. Retrieval and generation workflow **[REC]**

Retrieval happens **before** the model call; the model never chooses the framework mapping.

1. Trend selected → load accepted bridge → **fetch approved RLC records by FK** (phase, domain, competency + `competency_id`, developmental task, approved consumer translation, observable indicators cleared for public use).
2. Load platform keyword row + community row for the target platform.
3. Load verified facts + citations from the trend's observations.
4. Snapshot every source into `ai_generation_sources` (`source_snapshot` jsonb) so the draft is reproducible even if canon later changes.
5. Render the approved `prompt_templates` row for `generation_type = 'ce_<platform>'`.
6. Call the provider with a JSON schema; store output in `ai_generation_outputs`.
7. Run QC (§12) → write `ai_quality_checks` → set `quality_status`.
8. Save as a **new draft version**. Never publish.

**Platform differentiation is enforced structurally**, not by asking the model nicely: one template per platform, each fed that platform's own keyword row, format, and CTA rhythm from the workbook — so Threads gets conversation phrasing and YouTube gets long-tail search intent by construction.

## 12. Security and safety risks **[REC]**

| Risk | Mitigation |
|---|---|
| **Prompt injection from scraped posts/pages** | Retrieved external text is **data, never instruction**. Wrap in delimited blocks, strip instruction-like content, never let it reach the system prompt. Web search returns `encrypted_content` that must be echoed unmodified — treat as opaque. |
| Invalid `competency_id` | DB **foreign key** + a test proving a nonexistent id cannot be saved. Not app-layer validation alone. |
| Clinical material leaking into consumer drafts | Retrieval layer filters to approved-consumer-safe fields; QC gate re-checks; a test asserts clinician-only content cannot enter a draft. |
| Invented framework concepts | Model receives an enumerated, closed set; QC validates every phase/domain/competency against DB. |
| Diagnosing public figures | Explicit QC check + banned-phrasing list. |
| Cost runaway | Existing `ai_settings` daily/monthly caps + `max_uses` on web search + provider-level caps. |
| Credential exposure | Server-side only; `NEXT_PUBLIC_*` never used for provider keys. |
| Provider outage | Health status per provider; manual entry + evergreen generation always available. |
| Owner-only | `requireAiOwner()` (owner + MFA). |

## 13. Estimated API dependencies and recurring cost **[API]**

| Dependency | Cost |
|---|---|
| `ANTHROPIC_API_KEY` | **Required, not yet provisioned.** Claude Opus 5 $5/$25 per Mtok. |
| Anthropic web search | **$10 / 1,000 searches** + tokens for retrieved content. Errors are not billed. |
| YouTube Data API | Free within 10,000 units/day. |
| Threads API | Free; 2,200 queries/24h; requires app review. |
| Google Trends | Unknown — no access. |

**Rough monthly:** daily discovery run at ~20 searches = ~600 searches ≈ **$6/mo** in search fees. Generation dominates: a 5-angle multi-platform pack at Opus 5 ≈ $0.30–0.80 per run. Existing caps ($25/day, $300/mo) are already a sane ceiling. **[ASSUME]** one discovery run/day and ~2 generation packs/day.

## 14. Phased implementation plan **[REC]**

**Phase 0 — unblock (no feature code).** Provision `ANTHROPIC_API_KEY`; resolve the `fw_` vs `kb_` competency authority; supply the Master Knowledge Base. Nothing downstream is trustworthy until these land.

**Phase 1 — internal foundation.** Migration `0055_content_engine` (keyword/community/trend/bridge/draft-version tables); import the keyword workbook (11 sheets, per-platform preserved); owner-only dashboard; manual trend entry; RLC retrieval + provenance; generate Threads post + 30-90s script; save as draft; basic performance logging.

**Phase 2 — live discovery.** Anthropic web search provider; provider health/caching/dedup/timestamps; verified source display; YouTube trending; Threads validation *if* app review clears.

**Phase 3 — relational intelligence.** Affected-population detection; multi-bridge generation; configurable scoring from `ce_scoring_weights`; risk review; platform recommendation.

**Phase 4 — cross-platform generation.** All seven platforms with genuinely distinct structure; repurposing from an approved master; draft comparison; 5th-grade + higher-level variants.

**Phase 5 — performance learning.** Median-based comparison across ≥30 posts/platform; update keyword/community/format/CTA priority. **Never writes back to canonical RLC records.**

## 15. Tests and acceptance criteria **[REC]**

Unit: scoring math · dedupe/normalization · RLC retrieval · safety gates · reading level.
Integration: one per provider adapter, **all mocked** — no live API cost in CI.
Guard tests: nonexistent `competency_id` rejected · clinician-only content cannot enter a consumer draft · prompt-injection strings in retrieved text do not alter behaviour · provider timeout/failure degrades gracefully · regeneration creates a version and never mutates an approved draft.
End-to-end: **COVID/Fauci** (legitimate bridge) · **football training camp** (Expansion role-negotiation bridge) · **one forced bridge that must be rejected**.
No live production data in the initial test pass.

Your 15 acceptance criteria are all satisfiable in Phase 1 + 2, **except** #3 ("retrieve current verified context") which needs `ANTHROPIC_API_KEY`.

## 16. Decisions that require your approval **[OPEN]**

1. **`ANTHROPIC_API_KEY`** — provision it (local `.env.local` + Netlify production). Nothing generates without it.
2. ~~Competency authority~~ — **RESOLVED** (§6): FK `fw_competencies.competency_id`, JOIN `kb_competencies` for narrative. No decision needed.
3. ~~The 6 missing source files~~ — **RESOLVED**, all imported 2026-08-05.
4. **`companion-competency-review-workbook_reviewed.xlsx`** — the `_reviewed` variant is absent; is the plain one in `docs/` equivalent?
5. **Model** — move `ai_settings.model` from `claude-opus-4-8` to `claude-opus-5`? Same price.
6. **Threads app review** — do you want to pursue the `threads_keyword_search` permission? Without it, search only sees your own posts.
7. **Google Trends alpha** — apply now, or skip?
8. **Web search org setting** — must be enabled in Console → Privacy, and you may want a domain allowlist for source quality.
9. **Recovery & Renewal status** — confirm it is stored as *approved working architecture, not canonical*, with a status column preserving that distinction.
10. **Scope of Phase 1** — the plan above, or narrower?

---

## Assumptions **[ASSUME]**

- The Content Engine is owner-only for the foreseeable future (no editor/viewer access).
- Manual performance entry is acceptable for v1; platform analytics integrations come later.
- Publishing stays fully manual — the engine never posts.
- The keyword workbook is the authoritative starting operational dataset for keywords/communities.
- Existing `ai_*` tables can be extended (new `source_entity_type` values, two draft-version columns) rather than replaced.

## Open questions **[OPEN]**

- Should `ce_*` trend records be retained indefinitely, or aged out?
- Do you want the daily discovery run on a cron (mirroring the reconcile cron), or strictly on-demand via the button?
- Should a rejected bridge be remembered so the same forced connection isn't re-proposed?
- Is there an existing brand/voice document I should read that isn't in the nine source files?
