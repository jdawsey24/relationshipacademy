# Content Engine — Addendum: Script Builder, Governance Layers, Real Talk

*2026-08-06. Incorporates all owner instructions. **Awaiting approval — no Script Builder code written.***

Tags: **[REPO]** verified in this repository or its live database · **[SRC]** verified in a source file ·
**[REC]** recommendation · **[ASSUME]** assumption · **[OPEN]** unresolved, needs your decision.

---

## 0. What changed under us, and what it costs

Knowledge Base **v2.4** landed mid-build. It is not a minor version. **[SRC]**

| | v2.1 | v2.4 |
|---|---:|---:|
| Competencies | 111 | **155** (+24 Recovery, +20 Renewal) |
| Behavioral indicators | 333 | 465 |
| Interventions / practices | 333 each | 465 each |
| Content registry | 1,665 | 2,281 |

**Recovery and Renewal now have canonical IDs** — `COM-RECV-001`, `COM-RENW-001`; RECV/RENW registered
as phase codes (DEC-000017). Your earlier instruction to invent a separate working-source identifier is
**obsolete in mechanism**: the IDs exist and are canonical. The governance concern behind it survives —
see §9.

### Three blockers this created

**B1. No competency is approved. None.** `22_Competency_Details.Status`: **[SRC]**

| Phase | Status | Count |
|---|---|---:|
| Exploration, Exclusivity, Expansion, Expiration | `Draft` | 111 |
| Recovery, Renewal | `In Review` | 44 |

Under the Publication Mode rule you specified — approved RLC mapping, approved public-facing
interpretation, valid provenance, completed safety review, human approval — **nothing in the framework
qualifies today**, including the 111 I had been treating as canonical. Publication Mode would ship
zero content on day one.

**B2. Every public-suitability field is empty across all 155.** **[SRC]**

```
Consumer Translation          0 / 155      Cautions                     0 / 155
Public or Clinical Boundary   0 / 155      Contraindications            0 / 155
Reading Level                 0 / 155      Suppression or Safety Logic  0 / 155
Observable Expressions      155 / 155  <- the only populated public field
```

Your "blank does not mean approved" rule is the load-bearing constraint of the whole design: the fields
that would *authorise* public use are precisely the ones nobody has filled in, while `Clinical
Applications` and `Facilitation Notes` are populated 155/155.

**B3. The database is a version behind.** `fw_competencies` / `kb_competencies` still hold 111 rows.
`COM-RECV-001` does not exist in Postgres. Any Recovery/Renewal mapping fails today. **[REPO]**

---

## 1. Existing repository features the Script Builder reuses **[REPO]**

| Need | Reuse | Status |
|---|---|---|
| Owner-only + MFA | `requireAiOwner()` | built, in use |
| Provider abstraction | `lib/ai/provider.ts` (Anthropic, JSON-schema output) | built; live call verified |
| Versioned, approval-gated prompts | `prompt_templates` + `getActiveTemplate()` | built; **resolves only `approved`** |
| Cost ceilings | `ai_settings` ($25/day, $300/mo) | built |
| Generation runs | `ai_generation_requests` / `_outputs` | built |
| Provenance | `ai_generation_sources` (snapshot + version + status) | built |
| Drafts + versioning | `ai_content_drafts` + `version`, `parent_draft_id` | built (0055) |
| QC findings | `ai_quality_checks` | built |
| Approval audit | `ai_approval_events` | built |
| Keyword/Community routing | `ce_platform_keywords` (270), `ce_communities` (10) | imported |
| Untrusted-input sanitisation | `lib/contentEngine/normalize.ts` | built, tested |
| Full-relationship mapping validation | `lib/contentEngine/mappingValidation.ts` | built, tested |
| Rate limit / audit | `lib/rateLimit.ts`, `lib/audit.ts` | built |
| Scheduled jobs | `netlify/functions/*-cron.mjs` + `CRON_SECRET` | built (2 live) |

### What must be revised, not extended

- **`ce_video_script` v1/v2 templates** — a single call producing a whole package. That is precisely what
  §2 of your spec forbids. **Replace with staged generation.**
- **`ce_real_talk_briefs` (migration 0056, NOT run)** — missing `common_misunderstanding`, `audience
  segment`, `life stage`, and models Real Talk as a flag rather than a Content Series. **Rewrite before
  you run 0056.**
- **v2 prompt templates** — no content series, no format modules, no staging. **Superseded.**

Nothing needs rolling back: 0056 is unrun, and all six template rows are `draft`, so no approved content
depends on any of it.

---

## 2. Script Builder user flow **[REC]**

Twelve stages, each with structured input and schema-validated output. Framework mapping is settled and
owner-approved *before* any script text is generated.

```
 1 Topic intake        evergreen | reactive trend | predictable trend | audience question
                       | Experience Cluster | Situation Registry | manual
 2 Fact verification   claim-level records; skipped for evergreen
 3 Affected population
 4 Relational bridge   6 bridge types, graded strong|moderate|weak|forced|rejected
 5 RLC retrieval       full-relationship validation + provenance snapshots
      ── OWNER GATE: review and edit the bridge and mapping ──
 6 Content brief       assembled and saved; the contract for everything downstream
 7 Angle generation    3-5 meaningfully different angles
      ── OWNER GATE: select or edit an angle ──
 8 Configuration       format, runtime, platform, campaign, intensity, authority level
 9 Script generation   5th-grade and higher-level drafted INDEPENDENTLY from the same brief
10 Packaging           on-screen caption, post caption, keywords, CTA, visual notes
11 Quality control     framework / content / generation gates
12 Versioned draft     saved for human review. Never published.
```

Model calls: **stages 4, 7, 9 (×2), 10** — five to six per package, not one.

---

## 3. Interface and controls **[REC]**

Owner-only page at `app/admin/content-engine/script-builder`. Controls: topic source · topic/trend ·
platform · target audience · **life stage / audience segment** · content mode · **content series** ·
RLC phase · domain · competency · angle · script format · target runtime · reading-level output · tone ·
**Real Talk intensity** · content objective · campaign · CTA destination · primary keyword · supporting
terms · Community keyword · **expert-positioning level** (none | subtle | explicit | conversion-focused).

Live readouts: exact word count · estimated runtime · runtime pass/fail · reading-level estimate ·
5th-vs-higher body similarity · repetition warnings against recent drafts.

**Campaign defaults, not universal rules** — stored in a `ce_campaigns` row, not in code:
audience Black women · destination Relationship Snapshot · keyword `SNAPSHOT` · transformation
"stop guessing, understand her patterns, trust what she sees, make clearer choices".

---

## 4. Content brief schema **[REC]** — `ce_content_briefs`

The brief is the contract. No script generates without one.

```
Source and context
  content_origin  evergreen|reactive_trend|predictable_trend|audience_question
                  |experience_cluster|situation_registry|manual
  topic · verified_facts[] · verification_source_ids[] · exact_phrase
  affected_population · relational_consequence · approved_relational_bridge_id
  content_risk_level · interpretation_vs_fact (explicit split)

Framework alignment
  primary_phase_id · supporting_phase_id? · developmental_task · domain_id
  competency_id · source_record · source_status · mapping_rationale
  observable_pattern · approved_public_interpretation
  mapping_validated boolean · publication_eligible boolean

Content strategy
  target_audience · life_stage_segment · platform · content_series_id
  content_mode · content_objective · selected_angle_id · script_format
  target_runtime_seconds · reading_levels[] · viewer_reward · tone_tags[]
  primary_keyword · supporting_terms[] · community_keyword
  campaign_id · cta_destination · comment_keyword
  expert_positioning · real_talk_intensity?
```

**Separate taxonomy tables, no overloading of `phase`.** You have now had to say this twice — content
series is not a phase, life stage is not a phase — so it is enforced structurally: `ce_content_series`,
`ce_audience_segments`, `ce_life_stages` are their own tables with their own FKs, and there is no code
path that writes any of them into a phase column.

---

## 5. Prompt-module architecture **[REC]**

Composable modules, independently versioned, never one monolithic prompt:

`governance` · `retrieved_source` · `phase` · `bridge` · `format` · `platform` · `audience_voice` ·
`campaign_cta` · `real_talk` · `safety` · `qc`

Each generation records the module set and each module's version. `ce_prompt_module_versions` +
`ce_generation_modules` (join). **A prompt change cannot retroactively alter approved content**, because
approved drafts pin the module versions they were generated under.

## 6. Structured output schemas **[REC]**

JSON-schema enforced at the provider. Per stage: `BridgeSet` · `AngleSet` · `ScriptDraft`
(hook, re-hook, teaching point, viewer reward, expert bridge?, CTA, **plus one continuous spoken script**) ·
`Packaging` · `QcReport`. Every stage may instead return `Conflict` — see §13.

## 7. RLC retrieval logic **[REC]**

By FK from canon, never copied: `04_Competencies` (core + provenance) · `21_Domain_Details` ·
`22_Competency_Details` (canonical narrative) · `05/06_Indicators` where approved for public use ·
approved situation/practice/activity records.

Deprecated `04` narrative columns are unreachable — `fw_competencies` does not carry them. **[REPO]**

Retrieval stays an **allowlist**: `Definition`, `Purpose`, `Observable Expressions`,
`Consumer Translation`, plus `healthy_markers` / `growth_indicators`. Everything else in the ~60-key
`detail` blob — `Clinical Applications`, `Facilitation Notes`, `Interpretation Notes`, `Assessment
Intent` — is excluded by default, including from provenance snapshots. **[REPO]**

`Culture Terms - Audience Map` is internal-only: it may inform the engine's understanding of the pain
beneath a phrase, and its terms are **blocked from output** by a QC gate. **[SRC]**

## 8. Source status and public-suitability handling **[REC]** — the crux

Given B1 and B2, a record's own `Status` cannot gate publication today, and blank suitability fields
cannot be read as permission. Proposal:

```
ce_source_approvals
  competency_id → fw_competencies
  public_suitability   approved | restricted | not_reviewed   (default not_reviewed)
  approved_interpretation text        -- the approved public-facing wording
  reviewed_by · reviewed_at · notes
```

- **Development Mode** — `not_reviewed` sources may be retrieved. Every output is watermarked
  `NOT FOR PUBLICATION` and cannot reach `ready`.
- **Publication Mode** — requires `public_suitability = 'approved'` **and** a non-empty
  `approved_interpretation` **and** validated mapping **and** completed safety review **and** human
  approval. Blank never satisfies any of these.

This decouples your publication gate from the workbook's Draft/In Review lifecycle, so the Content Engine
does not stall waiting on manual incorporation — and it makes "approved for public use" an explicit,
attributable act rather than an absence.

## 9. Recovery and Renewal **[SRC] [OPEN]**

Canonical IDs now exist, so no working-source identifier is needed. Two constraints remain:

- Recovery/Renewal `Status = In Review` (44 records) — **Development Mode only** until you say otherwise.
- **Renewal must not be reduced to dating readiness.** Recovery's task is Healing (restores functioning);
  Renewal's is Reengagement (activates restored functioning through meaningful participation —
  relationships, identity, purpose, community, embodiment, future possibility). Dating is *one* form.
  Enforced as a QC check, not a prompt suggestion.

### ⚠️ The Situation Registry is worse than it looked **[SRC]**

Re-checked against v2.4. Its crosswalk stores competency **names**, not IDs:

| Outcome | Count |
|---|---:|
| Resolves to a competency **in the claimed phase** | **29 / 60** |
| Name resolves but to a **different phase** | **18** |
| Name does not resolve at all | 13 |
| Name is **ambiguous** — same name, >1 competency | 12 |

v2.4 made this *more* dangerous: Recovery/Renewal reuse names that already exist elsewhere
(`Self-Trust`, `Emotional Regulation`, `Boundary Communication`, `Reciprocity`, `Transparency`…), so a
name lookup can now silently select the wrong phase's competency. **Every one of the 60 needs review —
not just the 13 obvious failures.** Quarantine all of them; none feeds a publishable script until
re-mapped to an ID.

## 10. Draft and partial regeneration **[REC]**

Regeneration always creates a new version; approved drafts are immutable. Independently regenerable:
angles · hooks · 5th-grade script · higher-level script · CTA · on-screen caption · post caption ·
visual packaging · full package. Unselected components are **locked and carried forward** —
`ce_draft_components` holds one row per component with `locked boolean`, so a hook regeneration cannot
disturb an approved script.

## 11. Runtime and readability validation **[REC]**

Configurable rate, default **150 wpm** (`ce_generation_settings`).

| Runtime | Words | Content type default |
|---|---|---|
| 20-30s | 50-75 | companion post |
| 30-45s | 75-115 | companion / quick take |
| 45-60s | 110-150 | quick take / trend reaction |
| 60-75s | 145-190 | anchor teaching post |
| 75-90s | 185-225 | deeper cultural commentary |

Changing runtime **re-generates at a different depth** — the format module receives the target and the
structure changes. Relabelling is impossible because the word-count gate would fail.

Readability is a **diagnostic, never an auto-rewrite**. Reported, never applied. The 5th-grade version is
drafted independently from the brief, not derived by synonym replacement.

## 12. Similarity and repetition detection **[REC]**

- **Reading-level pair** — compare bodies with locked hook and CTA excluded; flag above a configurable
  **0.80** and require another drafting pass unless you approve the overlap.
- **Recent drafts** — openings, structures, authority phrasing, examples, CTAs. Warn on repeats.
- **Caption checks** — on-screen caption must not duplicate the hook; post caption must not contain the
  whole script.

`tokenOverlap()` exists and is tested; the pair check needs a body-level variant. **[REPO]**

## 13. Safety and public-content gates **[REC]**

Framework · content · generation gates as specified. Only `critical` blocks (your ruling); `high`
surfaces prominently.

**Conflict, not self-correction.** If a stage finds the approved mapping contradicts the requested claim,
example or guidance, it returns a typed conflict and **stops** — no draft row. `ce_generation_conflicts`
(in unrun 0056) already models this.

**Real Talk** is a Content Series with a separate intensity control, present in angle generation, script
generation, packaging and QC — not a tone label. Required brief elements: uncomfortable truth · audience ·
common misunderstanding · relational mechanism · distinction/necessary nuance · consequence · practical
takeaway · overgeneralization risk · RLC foundation. `Unfiltered` additionally requires an
overgeneralization **and reputational-risk** check. QC verifies the nuance appears **inside the script**,
not only in the brief. Prohibited: shaming · stereotyping · rage bait · hyper-independence ·
gender-war framing.

## 14. Model calls, latency, cost **[REC] [ASSUME]**

Per full package: bridges 1 · angles 1 · scripts 2 · packaging 1 · optional conflict re-run — **5-6 calls**.

**[ASSUME]** ~8-15k input / ~2-4k output tokens per package at Claude Opus 5 ($5/$25 per Mtok) ≈
**$0.15-0.30 per package**, 60-150s wall clock. At 2 packages/day ≈ **$12-18/month**, well inside the
existing $25/day cap. Partial regeneration costs one stage, not a package. Web search (Phase 2) adds
$10 per 1,000 searches. **[API]**

## 15. Acceptance tests **[REC]**

Your 24 criteria, plus the required cases: Exploration dating-discernment · Snapshot conversion ·
dating-guru advice reaction · **Renewal reengagement outside dating** · Fauci/COVID aftermath · football
training camp · a forced bridge that must be rejected · one topic as quick take / scenario / cultural
commentary proving structural variation · a reading-level pair that must **fail** for similarity.

Guard tests: invalid competency ID unsaveable (FK) · cross-phase mapping rejected · clinical-only text
cannot enter a public script · Culture Terms blocked from output · Recovery not mislabelled Renewal ·
Renewal not reduced to dating · working records not shown as canonical · regeneration versions ·
locked components preserved · nothing auto-publishes. All model calls mocked in CI.

## 16. MVP versus later **[REC]**

**MVP** — Script Builder stages 1, 3-12 (manual + evergreen intake) · content brief · Real Talk ·
format variety · dual reading levels · runtime/readability/similarity validation · QC · versioned drafts
with partial regeneration · Development/Publication Mode · `ce_source_approvals` · Situation Registry
quarantine · Voice Calibration Library (structure + retrieval; you author entries) · manual performance
logging.

**Phase 2** — live trend discovery (web search, YouTube, Threads) · claim-level verification with
recheck dates · Experience Cluster and Situation Registry intake once re-mapped.

**Phase 3** — Content Operations Layer (calendar with 30% reserve, batch variety rules) · Publishing
Record · sequels, comment-response, cross-platform repurposing, series continuity.

**Phase 4** — Performance Learning Loop (medians over ≥30 posts; recommends topics/formats/hooks/
runtimes; **never** alters RLC theory, overrides safety, encourages gender-war framing, or promotes
high-performing misinformation) · correction/withdrawal/rights-review workflows.

**Legacy 30-day workbook** — import as `legacy_draft` requiring remapping and review. Never a prompt
exemplar. Its failures (series stored as phases, "First/Then/Finally", near-identical reading levels,
repeated authority paragraphs, companions longer than anchors, missing IDs) become explicit QC checks.

---

## 17. Decisions I need **[OPEN]**

1. **What makes a competency "approved for public use"?** All 155 are Draft/In Review and every
   suitability field is blank. Without `ce_source_approvals` (§8) or an equivalent, **Publication Mode
   can never pass**. This is the top blocker.
2. **Re-import KB v2.4 into Postgres?** The DB holds 111; `COM-RECV-001` does not exist there. Needs its
   own migration and review.
3. **Recovery/Renewal in Development Mode only** while `In Review` — confirm.
4. **Situation Registry**: quarantine all 60 pending ID re-mapping — confirm. Only 29 currently resolve
   to the claimed phase.
5. **Approved public interpretation**: `Consumer Translation` is 0/155. Until authored, drafts translate
   from `Definition` (framework voice). Acceptable in Development Mode?
6. **Similarity threshold** 0.80 for the reading-level pair — confirm or set.
7. **Speaking rate** 150 wpm — confirm.
8. **`ce_` prefix** for all new tables — confirm.
9. **Scope of the first build.** The MVP above is large. I recommend cutting it at stages 1-12 with
   manual intake only, and deferring the Content Operations Layer entirely.

## Assumptions **[ASSUME]**

- Owner-only for the foreseeable future; no editor/viewer access to the Script Builder.
- Manual performance entry for the MVP.
- Publishing stays manual — the engine never posts.
- The keyword workbook remains the authoritative keyword/Community dataset.
- Existing `ai_*` tables are extended rather than replaced.

---

# Revision log — owner rulings 2026-08-06 (14 revisions)

Applied to the plan; two artifacts rewritten. **No Script Builder code written yet.**

| # | Ruling | How it is implemented |
|---|---|---|
| 1 | Separate framework status, record status, public-use approval | `fw_competencies.framework_status` (canonical for all 155 — the constructs are canonical) + `record_status` (draft 111 / in_review 44 — editorial workflow only). Publication is gated by neither; only §2 gates it. **This resolves the "nothing can publish" finding — it was my conflation, not a real blocker.** |
| 2 | Approval table must not become a second source of truth | `ce_source_use_approvals` stores `approved_source_version`, `approved_source_hash`, `permitted_use[]`, `audience[]`, `restrictions`, `reviewer`, `reviewed_at`. Consumer Translation, Public or Clinical Boundary, Cautions, Contraindications, Reading Level and Suppression/Safety Logic stay in the KB. `provenance_snapshot` is audit-only and never read as authority. |
| 3 | Broaden to all source types | Renamed `ce_source_use_approvals`, keyed by `(source_type, source_id)` — competency, indicator, practice, activity, worksheet, situation, domain, phase. |
| 4 | Recovery/Renewal Development Mode, per competency | Approval is per source row, so a single Recovery competency becomes publication-eligible once its interpretation and safety fields are approved. No phase-wide gate. |
| 5 | Quarantine all 60 Situation crosswalks | `ce_situation_crosswalks` — `competency_name_display` is display only; `resolved_competency_id` is the only join key; CHECK forbids leaving quarantine without an ID. Situations remain usable as raw topic sources. |
| 6 | Do not create `ce_life_stages` | **Not created.** Comment in the migration records why: not yet distinguished from Structural Context, relationship status, audience segment, situational tags. `ce_audience_segments` exists; life stage does not. |
| 7 | Claim-based verification, never skipped for evergreen | `ce_claims` with `claim_type` (empirical, statistical, medical, legal, historical, quoted, current_event, interpretation), sources, verified_by/at, event_date, risk_level, `recheck_at`. Applies to every origin including evergreen. |
| 8 | Group the interface | Backend stays 12 staged calls; the UI is **four screens** — Topic & Bridge · Brief & Angles · Scripts & Packaging · Review & QC. |
| 9 | Independent drafting; test similarity AND conceptual equivalence | Both drafted from the same approved brief. Two checks: lexical similarity (0.80 warning, owner override) and a conceptual-equivalence check that the lesson, reward, hook and CTA still match. |
| 10 | Category-sensitive blocking replaces "critical only" | `ce_qc_blocking_rules`, seeded: physical_safety, abuse, coercion, consent, clinical, legal, medical block at **high**; framework blocks at critical; voice/seo/duplication surface without blocking. |
| 11 | Culture Terms blocked by default, owner allowlist | `ce_culture_terms` with `disposition` blocked / allowed_public / internal_only, plus approver and date. |
| 12 | 150 wpm default, configurable profiles; keep `ce_` | `ce_delivery_profiles` seeded standard 150 (default), measured 130, brisk 170. |
| 13 | Reviewed, transactional v2.4 re-import | `scripts/importKnowledgeBaseV24.ts` — dry-run counts, upsert by canonical ID (**never deletes**), shape guard, pre/post FK orphan validation, backup to `ce_import_backups` before any write, `--rollback <id>`. |
| 14 | First-build scope | Manual intake · bridge and mapping review · content brief · angles · configuration · dual scripts · packaging · QC · versioned drafts · public-use governance. **Deferred:** trend discovery, scheduling, performance learning, Situation-Registry-driven mapping. |

## Correction to §0 of this document

The earlier finding **"under your own Publication Mode rule, nothing can publish today"** was wrong. It
treated `22_Competency_Details.Status = Draft` as if it meant the framework construct was provisional.
Ruling 1 separates the two: the 111 are canonical constructs whose detail records are editorially Draft.
The real gate is per-source use approval, which is a decision to be recorded rather than a blockage to
be waited out.

What remains true from that finding: the public-suitability fields are 0/155, so no source is yet
*approved for public use*, and Publication Mode will pass only for sources the owner explicitly approves.

## v2.4 import — dry run, verified 2026-08-06

```
competencies in workbook : 155
  by phase         : Exploration 36, Exclusivity 27, Expansion 26, Expiration 22, Recovery 24, Renewal 20
  by record_status : draft 111, in_review 44   (framework_status: canonical for all)

currently in fw_competencies : 111
  to ADD    : 44   (COM-RECV-001 …)     to UPDATE : 0     UNCHANGED : 111
  in DB but NOT in workbook (never deleted) : 0

FK safety: 0 references would orphan  ✅
```

Clean additive import: 44 new rows, nothing updated, nothing deleted, no orphans.

## Post-import state — 2026-08-06, applied

Migration 0056 run by owner; v2.4 competency import applied with owner approval.

```
fw_competencies : 155   Exploration 36 · Exclusivity 27 · Expansion 26 · Expiration 22 · Recovery 24 · Renewal 20
                        framework_status canonical ×155 · record_status draft 111 / in_review 44
backup          : a34d96df-21d2-4c20-8623-849e9129881f (111 rows)
integrity       : every competency phase and domain resolves in fw_phases / fw_domains ✅
                  0 orphaned references ✅
```

**§0 blocker B3 ("the database is a version behind") is now cleared.** B1 was withdrawn under ruling 1.
B2 stands: the six public-suitability fields remain 0/155, so no source is yet approved for public use.

`lib/contentEngine/mappingValidation.ts` updated to match: phase coverage is now read from
`fw_competencies` instead of the hardcoded `PHASES_WITHOUT_CANONICAL_COMPETENCIES` constant (which had
become false), and `framework_status` is checked while `record_status` is deliberately not — editorial
state does not gate mapping, and publication is gated only by `ce_source_use_approvals`.

### Outstanding: the v2.4 narrative layer

`kb_competencies` still holds the **v2.1** narrative rows (111, `kind='competency'`). All 44 Recovery and
Renewal competencies therefore have a canonical construct but **no narrative text**, and
`validateMapping()` correctly refuses to source from them. Until that separate import runs, Recovery and
Renewal are mappable in principle and unusable in practice. This is the next data gate.

---

## Knowledge Base narrative layer — Recovery seeded 2026-08-06

Migration `0057_kb_phase_narratives.sql` run by owner. Two owner-requested layers, under `kb_` because
they are Knowledge Base **sources** — the Content Engine reads them and may never write them.

```
kb_phase_narratives        Recovery / "Getting Back to Yourself" / individual / draft
                           7 transformation pairs · 10 governing narrative truths
kb_phase_domain_narratives 6 storylines · 24 competency ids · 0 dangling · 24/24 coverage
```

**Independent cross-validation.** The 24 competency names in the authored narrative foundation resolved
to canonical IDs in the correct domains, and the phase developmental task matched `fw_phases`, with no
exceptions. A spreadsheet import and a separately written prose document agreed on all 24 names, all six
domain groupings, and the task.

**Design decisions.**
- `competency_ids` is the only join key; `competency_names_display` is display and never resolved
  against. Same discipline as the Situation Registry quarantine.
- The 10 governing narrative truths are a `text[]` column, not prose, so QC reads them directly. Each
  becomes a check a draft can fail — "Healing is not forgiveness" is enforceable, not merely remembered.
- `record_status 'draft'` on all seven rows. Publication remains governed only by
  `ce_source_use_approvals` (`source_type` `phase_narrative` / `phase_domain_narrative`).

**Not authored, left empty — blank does not mean approved.**
Phase: `lived_experience_summary`, `developmental_explanation`, `common_misconceptions`,
`signs_of_movement`, `signs_constrained`, `safety_boundaries`, `public_or_clinical_boundary`,
`reading_level`, `approved_language`, `prohibited_reductions`.
Domain: `consumer_problem_language`, `observable_patterns`, `developmental_interpretation`,
`healthy_narrative_movement`, `content_themes`, `next_step_language`, `safety_rules`,
`suppression_rules`. Four of six storylines carry no `common_distorted_interpretation`.

The five phase-level suitability fields are the publication gate, so **Recovery is now describable but
still not publishable**. That is a content gap, not an engineering one.

### Open governance conflict

`lib/frameworkContent.ts:227` holds hardcoded public-facing Recovery copy rendered live at `/framework`,
`/recovery` and `/learn/[slug]` — `primaryFocus "Healing after loss"`, plus intro and section prose that
already states a version of the core tension. It names the phase "Recovery"; the KB record names it
"Getting Back to Yourself". **Two consumer-facing descriptions now exist in two places.** Until the
marketing pages read from the KB record, this is a second source of truth of exactly the kind the
governance model exists to prevent. Owner decision outstanding.

---

## Source-of-truth cutover — frameworkContent.ts → Knowledge Base (2026-08-06)

Resolved the conflict recorded above. `lib/frameworkContent.ts` is no longer an independent authoring
source for substantive framework narrative.

### The naming decision, as stored

| | value | role |
|---|---|---|
| `phase` | Recovery | canonical: stored phase name, route identity, framework reference, mapping value |
| `developmental_task` | Healing | canonical |
| `consumer_phase_name` | Getting Back to Yourself | consumer **translation**, never a replacement name |
| `public_descriptor` | Healing after relational loss | optional short public descriptor |

### What changed

- **`frameworkContent.ts`** keeps route, order, colour and layout. Each phase now declares
  `narrativeSource`: Recovery is `knowledge_base` and carries **no** narrative fields; the other five
  remain `legacy_manual` until migrated. The narrative fields are optional on the type, so a cut-over
  phase carrying prose is a compile error rather than a convention.
- **`lib/framework/phaseNarrative.ts`** — the single Knowledge Base entry point. Pure projector plus a
  thin fetcher, with a deterministic content-hash `sourceVersion`.
- **`lib/framework/phaseCards.ts`** — resolves each phase card to its declared source. Replaces
  `applyPhaseOverrides()`, which could not see Knowledge Base phases and would have rendered Recovery
  with an empty description.
- **`components/site/KbPhaseNarrative.tsx`** — renders a phase entirely from the projection. No prop for
  legacy copy, no fallback path.
- **Four surfaces cut over**: `/`, `/framework`, `/recovery`, `/learn/[slug]`. The home page was a
  fourth surface rendering Recovery card copy that the original brief did not list.
- **CMS override fields for cut-over phases are withdrawn.** A `phase.recovery.*` override in
  `site_content` would have been a second authoring source through the editor.

### No silent fallback

A phase declared `knowledge_base` with a missing record, or with missing display-required fields,
**throws**. It does not serve the legacy paragraph. The failure surfaces at build time.

Two gates are deliberately separate:

| gate | question | current state for Recovery |
|---|---|---|
| `renderable` | are the fields the page needs present? | yes |
| `approvalState` | approved for public use? | **`not_approved`** — typed as a constant, so no code path can derive approval from a field's presence |

### Narrative QC layer

`lib/framework/narrativeQc.ts` enforces that Recovery is not reduced to dating, reconciliation,
forgiveness, sexual readiness, total independence, or the absence of grief.

It is **field-aware, not a keyword scan**. The authored distortion corrections state the reduction in
order to correct it — "Recovery is demonstrated by becoming physically or sexually available again…" is
a textbook violation read in isolation. So `common_distorted_interpretation` is exempt from the
reduction check and subject to a stricter one: it must contain an actual corrective clause, because a
bare restatement teaches the reduction it was written to prevent. Every other field may not assert a
reduction at all, and only in a prescriptive construction with no negation — so the framework's own
"Healing is not forgiveness" is never flagged.

### Tests — `test/framework-narrative-cutover.test.ts`, 25 passing

One test per numbered requirement, plus negative cases: a storyline missing its correction is not
renderable · a bare restatement is rejected · each of the six reductions is flagged when asserted and
not flagged when denied · removing a governing truth is caught as a coverage gap · every display-required
field is individually enforced · a fully authored record is still `not_approved`.

Suite total 574 passing. The suite stays database-free; `scripts/verifyRecoveryNarrative.ts` runs the
same rules against live data.

### Content revision to flag

The Communication and Emotional Intimacy distortion corrections were **rewritten**. The first seeding
transcribed only the "it is not X" half and dropped the author's "It is: …" clause, leaving two bare
restatements — the exact failure the QC check now rejects. Both were restored from the author's original
text. Owner should confirm the wording.

---

## Script Builder — built 2026-08-06

Ruling 14 scope, delivered in two commits. Migrations 0059 run; five prompt templates seeded as `draft`.

### Stages 1-5 — `/admin/content-engine/intake`

Topic intake (untrusted text, sanitised before storage) · bridge proposal against a closed competency
set · grading · mapping re-validation · owner accept/reject. Ends at the gate: only a bridge graded
strong or moderate **with** a validated mapping can start a brief.

**Blocker found and fixed here.** `lib/contentEngine/bridges.ts` predates migration 0056's grading
columns — it never set `status`, `mapping_valid` or `eligible_for_generation`, so every bridge defaulted
to `weak`/false and **no bridge could ever have become eligible**. The pipeline could not have run end to
end regardless of the interface.

### Stages 6-12 — `/admin/content-engine/script-builder`

Four screens (ruling 8) over the staged backend: Topic & Bridge · Brief & Angles · Scripts & Packaging ·
Review & QC.

| decision | where it is enforced |
|---|---|
| Brief copies the approved mapping | `ce_content_briefs`, snapshot not join — a later bridge edit cannot change what a script was built on |
| Mapping re-validated at brief time | `createBrief` calls `validateMapping` rather than trusting the stored flag |
| Conflict, never self-correction | every schema carries a conflict channel → `ce_generation_conflicts` → stop |
| Two scripts, two questions | lexical similarity (0.80, overridable with a reason) **and** conceptual equivalence (never overridable) |
| Category-sensitive blocking | `ce_qc_blocking_rules`; ungoverned categories reported, never dropped |
| Public use | `ce_source_use_approvals`; missing approval and failed lookup both fail closed |
| Nothing publishes | drafts are versioned into `ai_content_drafts`, blocked packages kept for review |

### Deferred, per ruling 14

Trend discovery · scheduling · performance learning · Situation-Registry-driven mapping. Real Talk ships
as brief configuration (intensity passed to the script prompt); the seven-part briefing is not its own
generation stage.

### Outstanding

All five templates — `ce_bridges`, `ce_script_angles`, `ce_script_draft`, `ce_script_equivalence`,
`ce_script_packaging` — are `draft`. `getActiveTemplate()` resolves only `approved`, so every stage
refuses until the owner reads and approves each one. The bridge prompt is the consequential one: its
grading decides what can become content at all.
