# Content Engine — Phase 1 Implementation Plan

*Proposed 2026-08-05. **Awaiting owner approval. No migration created, no code written.***

Scope is the Phase 1 you defined: import approved keyword/Community records · owner-only dashboard ·
manual trend entry · RLC retrieval + traceability · generate and save drafts · manual approval ·
basic performance logging.

---

## 0. What changed since the audit

| Blocker | Status |
|---|---|
| 6 missing source files | ✅ imported |
| Competency authority | ✅ resolved — FK `fw_competencies.competency_id`, JOIN `kb_competencies` (`kind='competency'`) for narrative |
| `ANTHROPIC_API_KEY` | ✅ set locally **and** in Netlify production; **live call verified** through `lib/ai/provider.ts` (structured JSON, 270/41 tokens) |

Nothing blocks Phase 1.

## 1. What Phase 1 delivers (acceptance criteria it satisfies)

Your criteria **1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15** — everything except **#3** (live verified
context, needs the web-search provider) and **#14** (provider failover, meaningless until there is a
provider). Both are Phase 2.

Concretely, at the end of Phase 1 you can: open an owner-only Content Engine page → paste a topic from
your timeline → see it classified with keyword and Community routing → review 3–5 proposed relational
bridges with the RLC record each maps to and *why* → reject or edit the bridge → generate a Threads post
and a 30–90s video script → see platform keywords, Community language, RLC provenance and source
citations on the draft → have it saved as a version for review, never published → regenerate into a new
version without touching the first → log performance manually.

## 2. What Phase 1 explicitly does NOT do

- No live trend discovery (no web search, no YouTube, no Threads API) — **Phase 2**.
- No automatic publishing, ever.
- No scoring beyond a seeded, configurable weight table — the ranking engine is **Phase 3**.
- No cross-platform fan-out beyond Threads + video script — **Phase 4**.
- No performance-driven priority updates — **Phase 5**.
- No changes to assessments, Companion, Playbooks, Snapshot, finance, auth, or public pages.

---

## 3. Data findings that shape the design **[REPO — verified]**

**The seven platform sheets have genuinely different schemas.** This is the strongest argument for your
"do not collapse them" rule, and the importer must respect it:

| Sheet | Header row | Data rows | Platform-native phrase column |
|---|---:|---:|---|
| Threads | 3 | 40 | `Primary keyword / phrase` + **`Community keyword`** + `Signal role` |
| Instagram | 3 | 40 | spoken hook + on-screen phrase |
| TikTok | 3 | ~39 | **`Natural-language query`** + `Search intent` + `Spoken hook` + `On-screen text` |
| YouTube | 3 | 40 | long-tail search title + description/transcript alignment |
| LinkedIn | 3 | 30 | professional problem framing |
| X | 3 | 40 | conversation phrase |
| Pinterest | 3 | 40 | evergreen search / resource language |

≈ **270 keyword rows** total, plus `Cross-Platform Map` (40 RLC subjects → per-platform translation),
`Performance Log` (23 columns), `Scoring & Sources` (weights).

**⚠️ Community data is thinner than the spec assumes.** A `Community keyword` column exists **only on
the Threads sheet** — 10 distinct values (`dating`, `marriage`, `divorce`, `healing`, `boundaries`,
`communication`, …). None of the Community attributes you specified — official/informal status,
verification status, audience overlap, authority fit, trend potential, usage guidance — exist anywhere
in the workbook. **Phase 1 will import the 10 Threads Community keywords and create the table with those
attribute columns nullable, for you to author in the UI.** I will not invent the values.

---

## 4. Migration `0055_content_engine.sql`

Follows existing conventions: `ce_` prefix, RLS enabled, service-role writes, owner reads, `updated_at`
triggers. **Every RLC reference is a foreign key — no framework definitions are copied.**

```
ce_platform_keywords
  id uuid pk · platform text not null · rank int
  primary_phrase text not null            -- the platform-native phrase, whatever that sheet calls it
  phrase_kind text                        -- 'conversation'|'spoken_query'|'search_title'|'professional'|'evergreen'
  signal_role text                        -- Threads: 'Live-capable' etc.
  audience_doorway text · rlc_interpretation text · opening_use text
  supporting_terms text[] · best_format text · cta_fit text
  phase_slug text  → fw_phases            -- phase tags preserved verbatim, incl. compound "Exploration / Exclusivity"
  phase_raw text                          -- the workbook's original string, unparsed
  domain_raw text · domain_slugs text[]   -- same treatment for "Trust / Communication"
  score_audience int · score_platform int · score_rlc int · score_conversion int · score_momentum int
  opportunity_score numeric · priority_tier text
  source_sheet text · source_row int      -- provenance back to the workbook
  unique (platform, primary_phrase)

ce_communities
  id uuid pk · community_keyword text · platform text
  status text                             -- 'official'|'informal'|'unknown'  (DEFAULT 'unknown')
  verified boolean default false
  audience_overlap text · rlc_relevance text · authority_fit text
  trend_potential text · usage_guidance text
  unique (platform, community_keyword)
  -- imported: keyword+platform only. Everything else owner-authored.

ce_community_keywords        -- join: community ↔ platform keyword (many-to-many)
  community_id uuid → ce_communities · keyword_id uuid → ce_platform_keywords
  primary key (community_id, keyword_id)

ce_trend_candidates
  id uuid pk · canonical_name text not null · dedupe_key text unique
  entry_mode text not null                -- 'manual' in Phase 1; 'web_search'|'youtube'|'threads' later
  raw_input text                          -- exactly what you pasted (phrase / URL / post text / description)
  community_seen text                     -- "the Community where I saw it"
  exact_phrase text · related_phrases text[]
  affected_population text · relational_consequence text
  status text default 'new'               -- new|researched|bridged|generated|skipped
  first_observed_at timestamptz · last_validated_at timestamptz
  created_by text · created_at · updated_at

ce_trend_observations                     -- one row per source sighting; Phase 1 writes the manual one
  id uuid pk · candidate_id → ce_trend_candidates
  source_name text · platform text · region text
  exact_phrase text · related_phrases text[] · metrics jsonb
  source_url text · confidence numeric · api_status text
  raw_response jsonb · fetched_at timestamptz · cache_expires_at timestamptz

ce_relational_bridges
  id uuid pk · candidate_id → ce_trend_candidates
  bridge_type text not null               -- direct|life_disruption|seasonal|controversy|collective|cultural
  affected_population text · relational_consequence text · angle text
  competency_id text → fw_competencies(competency_id)     -- FK, enforced
  phase_slug text → fw_phases · domain_slug text → fw_domains
  rationale text                          -- "why this mapping was selected" (criterion #7)
  decision text default 'proposed'        -- proposed|accepted|rejected|edited
  decided_by text · decided_at · reject_reason text
  is_forced boolean default false         -- the engine's own "this is a stretch" flag

ce_scoring_weights                        -- seeded from the Scoring & Sources sheet
  key text pk · weight numeric · notes text · updated_at

ce_performance_records
  id uuid pk · draft_id uuid → ai_content_drafts(id)
  platform text · post_url text · posted_at date
  keyword_id → ce_platform_keywords · community_id → ce_communities
  views int · reach int · likes int · comments int · shares int · saves int
  watch_time_seconds int · completion_rate numeric · profile_visits int
  link_clicks int · follows int · cta_conversions int
  entry_mode text default 'manual' · recorded_by text · recorded_at
```

**Two columns added to an existing table** (no new draft table):

```sql
alter table public.ai_content_drafts
  add column if not exists version integer not null default 1,
  add column if not exists parent_draft_id uuid references public.ai_content_drafts(id);
```

That is the whole of "regeneration creates a version and never overwrites an approved draft" (#12).

**Reused unchanged:** `ai_generation_requests` · `ai_generation_outputs` · `ai_generation_sources` (extend
`source_entity_type` with `ce_trend_candidate`, `ce_platform_keyword`, `ce_community`) ·
`ai_quality_checks` · `ai_approval_events` · `prompt_templates` · `ai_settings`.

## 5. Import scripts (run by you, idempotent, re-runnable)

```
scripts/importPlatformKeywords.ts     → ce_platform_keywords + ce_communities + ce_community_keywords
scripts/importScoringWeights.ts       → ce_scoring_weights
```

- Parse with the namespace-tolerant reader already proven on all four workbooks (no `openpyxl` here).
- **Per-platform column maps** — one explicit map per sheet, because the schemas differ. No generic guess.
- **Phase tags preserved intact**: `phase_raw` keeps `"Exploration / Exclusivity"` verbatim; `phase_slug`/
  `domain_slugs` are derived, and a row whose phase doesn't resolve to `fw_phases` is **reported, not
  silently dropped**.
- Upsert on `(platform, primary_phrase)` — re-running never duplicates.
- Prints a reconciliation summary: rows read, imported, skipped + why.
- `--dry-run` default; `--apply` to write.

## 6. Services — `lib/contentEngine/`

| File | Responsibility |
|---|---|
| `types.ts` | shared types; the `TrendProvider` interface defined now, so Phase 2 slots in without refactor |
| `providers/manual.ts` | the only provider in Phase 1; normalizes pasted phrase / URL / post text / description |
| `normalize.ts` | canonical name + `dedupe_key` (lowercased, punctuation-stripped, stop-worded) so the same topic entered twice merges |
| `retrieval.ts` | **the traceability core** — given a bridge, load approved RLC records by FK and snapshot each into `ai_generation_sources` |
| `bridges.ts` | generate 3–5 candidate bridges across your six bridge types; each carries `rationale` + `is_forced` |
| `generate.ts` | render the approved `prompt_templates` row, call the provider, persist request/output/draft version |
| `qc.ts` | the safety gate (§8) |
| `performance.ts` | insert + median rollups (medians, never single outliers) |

## 7. Prompt templates (seeded as `status='draft'`, you approve before first use)

Three rows in `prompt_templates`, versioned and immutable once approved:

| `generation_type` | Produces |
|---|---|
| `ce_bridges` | 3–5 relational bridges with affected population, relational consequence, angle, proposed competency, and rationale |
| `ce_threads_post` | Threads post / mini-thread in conversation language, using the exact live phrase + Community |
| `ce_video_script` | 30–90s script, hook / re-hook / teaching point / CTA, plus on-screen caption |

The model **never chooses the framework mapping**: `ce_bridges` is given the enumerated, closed set of
valid phases/domains/competencies retrieved from the DB and must return a `competency_id` from that set.
`ce_threads_post` and `ce_video_script` receive the *already-accepted* bridge — mapping is settled before
drafting.

Voice constraints go in the template, including your ban list (no em dashes, no "I don't know who needs
to hear this", no gender-war framing, no diagnosing public figures, no framework jargon in consumer copy).

## 8. Quality-control gates (`qc.ts`) — every draft, before it is viewable as ready

| Check | Enforcement |
|---|---|
| Valid phase / domain / competency | DB lookup against `fw_*`; **plus a FK** so an invalid `competency_id` cannot be written at all |
| Source traceability | draft must have ≥1 `ai_generation_sources` row |
| No clinician-only leakage | consumer drafts may only cite fields flagged consumer-safe; a test proves clinical content cannot enter |
| No invented framework concepts | every phase/domain/competency string matched against the closed set |
| No diagnosis of public figures | pattern + phrase checks |
| Verified fact vs interpretation | facts must carry a citation; uncited claims flagged |
| Banned phrasing / voice | seeded from **`Excluded – Cultural Language`** (32 rows, Experience Clusters) — not hand-authored |
| Reading level | reuse the existing 5th-grade pass tooling |
| Keyword placement | primary phrase present in the opening; supporting terms natural, not stuffed |
| Recent-topic duplication | `dedupe.ts` similarity against recent drafts |
| Medical / legal / political / reputational risk | severity-scored; **`critical` blocks the "ready" state entirely** |

Findings write to `ai_quality_checks`. High-risk drafts are flagged and **never** presented as ready to post.

## 9. Routes and pages

**Endpoints** — every one behind `requireAiOwner()` (owner + MFA), rate-limited, audited:

```
POST   /api/admin/content-engine/trends            manual entry
GET    /api/admin/content-engine/trends            list
GET    /api/admin/content-engine/trends/[id]
POST   /api/admin/content-engine/trends/[id]/bridges     generate bridge candidates
PATCH  /api/admin/content-engine/bridges/[id]            accept | reject | edit  (criterion #8)
POST   /api/admin/content-engine/generate                draft from an accepted bridge
POST   /api/admin/content-engine/drafts/[id]/regenerate   → new version (#12)
POST   /api/admin/content-engine/drafts/[id]/approve
GET    /api/admin/content-engine/keywords                 per-platform + communities
POST   /api/admin/content-engine/performance
```

**Pages** — `app/admin/content-engine/`: dashboard · `trends/[id]` (bridge review with rationale and
accept/reject/edit) · `drafts/[id]` (version list, QC findings, provenance panel, approve) ·
`keywords` · `performance`.

The provenance panel is the visible form of criteria #7 and #10: for each draft, the trend, the exact
phrase, the Community, the competency + `competency_id`, the source record snapshot, and the citations.

## 10. Tests

Unit — dedupe/normalization · phase-tag preservation (compound tags survive) · scoring weight resolution ·
QC gates individually · reading level.
Guard — **invalid `competency_id` rejected at the DB** · clinical content cannot enter a consumer draft ·
prompt-injection strings in `raw_input` do not alter generation · regeneration creates a version and
leaves an approved draft untouched · non-owner gets 403 · unauthenticated gets 401.
Provider — manual adapter; mocked fixtures only, **no live API cost in CI**.
End-to-end (mocked model) — **COVID/Fauci** legitimate bridge · **football training camp** → Expansion
role-negotiation · **one forced bridge that must be rejected** and must not generate.
No live production data.

## 11. Sequencing

| Step | Deliverable | Gate |
|---|---|---|
| 1 | Migration `0055` written | **you review the SQL, then run it** |
| 2 | Import scripts + `--dry-run` reconciliation report | you read the report, then `--apply` |
| 3 | Services + endpoints + tests | tests green |
| 4 | Prompt templates seeded as `draft` | **you approve each template** |
| 5 | UI pages | — |
| 6 | End-to-end demos (3 scenarios) | you review the output |
| 7 | Merge | **your approval** — no deploy without it |

Steps 1–6 touch nothing in production. Step 1's migration is authored but **not run by me**.

## 12. Risks

- **Prompt injection** from pasted post text is the top risk in Phase 1, because `raw_input` is
  attacker-controlled by construction. Retrieved text is wrapped as data, never reaches the system prompt,
  and has a dedicated test.
- **Community metadata does not exist** in the workbook (§3) — the routing layer starts thin and depends
  on you authoring it.
- **Phase-tag compounds** (`"Exploration / Exclusivity"`) don't map to a single `fw_phases` row; I preserve
  the raw string and derive an array rather than forcing a choice.
- Cost is bounded by the existing `ai_settings` caps.

## 13. Decisions I need before writing code

1. **Approve this plan** (or trim the scope).
2. **`ce_` table prefix** — consistent with `fw_`/`kb_`/`ai_`, or do you want `content_`?
3. **Community attributes** — confirm you'll author status/verification/authority-fit in the UI, since the
   workbook has none.
4. **Model** — leave `ai_settings.model` at `claude-opus-4-8`, or move to `claude-opus-5`? Same price.
5. **Bridge count** — 3–5 per trend, or a fixed 5?
6. **Draft "ready" bar** — should a `high` severity QC finding block ready, or only `critical`?
