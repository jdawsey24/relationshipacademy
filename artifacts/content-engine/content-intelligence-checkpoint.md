# RLC Content Intelligence — pre-implementation checkpoint

*2026-08-07. **No code written. No migrations created.*** All ten items from §11 of your corrections.

---

## 1. Data model with the source hierarchy

### Source tiers travel with every retrieval

Tier is a property of the SOURCE, not of the query. Retrieval reads it; nothing else may set it.

```
kb_source_registry                                        NEW
  id · source_key · title · tier (1|2|3) · source_type
  version · version_date · supersedes_id · status
  authority_note · indexed_at · record_count
```

| tier | sources | authority |
|---|---|---|
| **1** | Facilitator Manual · Operations Manual | governs theory, constructs, definitions, boundaries |
| **2** | Current approved Knowledge Base (**v2.4** today) | operationalises Tier 1. Traceable to it, cannot overrule it |
| **3** | Experience Clusters · approved Situation records · R&R Manual (unsuperseded only) · Companion workbooks | audience language, situations, applications. **Never independent theoretical authority** |

`supersedes_id` is how v2.1 stays. It is not deleted, not overwritten, and is marked
`status='historical'` pointing at v2.4. The operative version is a **query** — the row where
`tier=2 and status='approved'` — never a hardcoded string. That is what stops "v2.1" being baked in
anywhere again.

```
ci_retrieval_events                                       NEW
  conversation_id · message_id · query_text
  results: [{ source_key, tier, source_type, record_id, version, excerpt_ref }]
  tier_conflict boolean · conflict_note
```

**Conflict rule.** When two tiers disagree, retrieval returns the higher tier's answer, sets
`tier_conflict`, and surfaces it as *"the Knowledge Base and the Operations Manual describe this
differently"* — for your review. It never merges them and never silently prefers the richer text.

### Conversation core

```
ci_conversations     id · title · status · entry_path (idea|opportunity)
                     cost_usd · cost_state (ok|soft_warned|hard_stopped|owner_continued)
                     created_by · created_at · updated_at

ci_messages          id · conversation_id · seq · role (owner|assistant|system)
                     content · kind (message|question|reflection|proposal|decision)
                     cost_usd · model · generation_request_id

ci_sources           id · conversation_id · kind (text|link|screenshot|file|voice|keyword|saved_idea)
                     raw · sanitized · extracted · keyword_id · storage_path · added_at

ci_working_briefs    id · conversation_id (unique) · fields as jsonb-per-field (see §3)

ci_lens_options      see §2

ci_decisions         id · conversation_id · decision_type · value
                     message_id · supersedes_id · decided_at   -- append-only
```

`ci_decisions` is append-only. A changed mind writes a new row pointing at the old one, so the
conversation's history of decisions survives the decision changing.

---

## 2. Candidate → suggested lens → selected → validated bridge

Five stages, four of which never touch `ce_relational_bridges`. This is your §9 correction.

```
1  RETRIEVED CANDIDATE     ci_retrieval_events.results[]
   raw hits from governed sources. No editorial claim. Many per query.
        ↓  the model reasons over candidates and proposes
2  SUGGESTED LENS          ci_lens_options   status = 'suggested'
   2–4 options, each with: why it may fit · what it illuminates · how it changes
   the lesson · direct application vs related lens · graded strength · mapping_valid
        ↓  you accept / reject / combine / supply your own
3  OWNER DECISION          ci_lens_options   status = 'accepted' | 'rejected' | 'combined' | 'owner_supplied'
   rejected options are KEPT, with your reason. They are conversation history.
        ↓  only an accepted lens proceeds, and only if it validates
4  VALIDATED BRIDGE        ce_relational_bridges   ← FIRST TOUCH of the approved table
   created only now. Runs validateMapping. decision='accepted', eligible_for_generation
   computed as today. A lens that fails validation cannot become a bridge.
        ↓
5  FINAL MAPPING           ce_content_briefs.competency_id / phase_id / domain_id
   snapshotted at brief creation, as today — a later bridge edit cannot change
   what a draft was written against.
```

```
ci_lens_options
  id · conversation_id · competency_id · phase_id · domain_id
  status · strength (strong|moderate|weak|forced)  · mapping_valid · mapping_errors[]
  why_it_fits · what_it_illuminates · how_it_changes_the_lesson
  relation (direct_application | related_lens)
  owner_reason            -- required to reject, so rejections stay evidence
  combined_with_id        -- for stage-3 combination
  promoted_bridge_id      -- null until stage 4. THE boundary marker.
  source_tier_used
```

`promoted_bridge_id` is the audit answer to "did an exploratory idea ever get treated as approved
mapping data" — if it is null, it never did.

**Proceeding with no lens is a first-class outcome.** `ci_working_briefs.rlc_lens_state =
'none_defensible'` lets content be generated without a bridge, flagged in the brief and in QC as
having no framework claim. The system must not force a weak bridge to produce content (§9).

---

## 3. Working Brief field-state behaviour

Every field is a small record, not a bare value:

```
{ value, state, derived_from_message_ids[], confidence, updated_at, updated_by }

state:  inferred | owner_edited | owner_confirmed | superseded
```

### The rules, per your §8 correction

| rule | mechanism |
|---|---|
| The AI **may** infer a thesis from what you said | writes `state='inferred'` with the message ids it came from |
| It must be visibly provisional | the panel renders `inferred` fields in italic with *"I think you're saying…"* and an Accept / Edit control |
| It must **never** derive a thesis from a keyword alone | `thesis` writes are rejected unless `derived_from_message_ids` contains at least one `role='owner'` message. A keyword-only origin cannot satisfy that |
| It must never overwrite your words | any write to a field whose state is `owner_edited` or `owner_confirmed` creates a **suggestion** instead, shown as *"want to revise this?"* |
| Changing your mind is recorded | the prior record is written to `ci_decisions` with `state='superseded'` |

```
thesis                    ← the guarded one, above
source_stimulus · why_it_matters · audience · audience_tension · viewer_reward
editorial_direction · content_series · real_talk_intensity
rlc_lens_state (none|suggested|selected|none_defensible) · selected_lens_id
necessary_nuance · claim_notes · purpose · cta · format · platform · runtime · status
```

Only `thesis` carries the owner-message requirement. Everything else may be inferred freely, because
nothing else is your argument.

---

## 4. Content Studio home — `/admin/content-studio`

```
┌──────────────────────────────────────────────────────────────────────┐
│                    What are we creating today?                       │
│                                                                      │
│  ┌────────────────────────────────┐ ┌─────────────────────────────┐  │
│  │  Start with your idea          │ │  Find an opportunity        │  │
│  │                                │ │                             │  │
│  │  ┌──────────────────────────┐  │ │  Browse what your audience  │  │
│  │  │ A thought, a post, a     │  │ │  is already asking about.   │  │
│  │  │ screenshot, a link, a    │  │ │                             │  │
│  │  │ voice note…              │  │ │  [TikTok] [Instagram]       │  │
│  │  └──────────────────────────┘  │ │  [Threads] [Pinterest]      │  │
│  │  📎 attach   🎙 dictate         │ │  [YouTube] [X] [LinkedIn]   │  │
│  │                                │ │                             │  │
│  │  [ Explore with me ] [ Build it ]│ │  [ View all ]              │  │
│  └────────────────────────────────┘ └─────────────────────────────┘  │
│                                                                      │
│  Pick up where you left off                                          │
│  · "not everyone confused is actually confused"    3 days ago        │
│  · mixed signals — thesis confirmed, no draft yet   yesterday        │
│                                                                      │
│  Worth a look                                                        │
│  · 12 curated phrases you haven't covered                            │
│  · 3 Real Talk openings in your Recovery material                    │
└──────────────────────────────────────────────────────────────────────┘
```

No competency IDs, no approval codes, no bridge records, no claim warnings, no database language —
per §5 and §19. "Worth a look" derives from content history (§18), not from invented demand.

---

## 5. Conversational workspace

```
┌──────────────────────────────────────────┬───────────────────────────┐
│  ← Content Studio        mixed signals   │  Working Brief            │
│                                          │                           │
│  ┌────────────────────────────────────┐  │  Thesis        inferred ✎ │
│  │ You                                │  │  "Some people recognise   │
│  │ The last one. I think some women   │  │   the inconsistency but   │
│  │ aren't truly confused…             │  │   call it confusion       │
│  └────────────────────────────────────┘  │   because naming it       │
│                                          │   would require a         │
│  ┌────────────────────────────────────┐  │   decision."              │
│  │ It sounds like your argument isn't │  │   [Accept]  [Edit]        │
│  │ that people should pay closer      │  │                           │
│  │ attention. It's that naming the    │  │  Audience      inferred   │
│  │ pattern would force a decision.    │  │  Direction     —          │
│  │ Is that the distinction?           │  │  RLC lens      3 offered  │
│  │                                    │  │  Format        —          │
│  │ One flag: "women" makes this a     │  │  CTA           —          │
│  │ claim about a group. Same insight  │  │                           │
│  │ holds without it.                  │  │  ─────────────────────    │
│  └────────────────────────────────────┘  │  ▸ View reasoning         │
│                                          │    and sources            │
│  ┌────────────────────────────────────┐  │                           │
│  │ Type…                              │  │  $1.12 this conversation  │
│  └────────────────────────────────────┘  │                           │
└──────────────────────────────────────────┴───────────────────────────┘
```

One question at a time. The brief fills itself. Nothing is required before the AI will help. "View
reasoning and sources" opens competency IDs, retrieval evidence, tiers, versions, validation results.

---

## 6. Curated Opportunity Library

**Named honestly.** These are editorial assessments, not demand data — your §5.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Curated Opportunity Library                                         │
│  Editorially scored phrases. Not live search data — no volumes or    │
│  trends until Demand Intelligence is connected.          ▸ why       │
│                                                                      │
│  [TikTok 40] [Instagram 40] [Threads 40] … [All 270]                 │
│  Tier ▾   Covered? ▾   Search…                                       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ why mixed signals feel so confusing                Tier 1 · 100│  │
│  │ They say: "Their words and actions do not match."              │  │
│  │ Exploration · Communication          Reaction / stitch         │  │
│  │ ○ You haven't covered this                                     │  │
│  │                                    [ Explore this idea ]       │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

Shown: opportunity score, priority tier, audience doorway, preliminary RLC interpretation, platform,
phrase, coverage from your content history. **Not shown, because we do not have it:** volume, growth,
trend status, retrieval date, market. No invented numbers.

---

## 7. Example — keyword → confirmed thesis → content

**1. Select** "why mixed signals feel so confusing" · Explore this idea.

**2. Workspace opens** with context attached and *no mapping decided*:

> Mixed signals is one of your strongest curated phrases on TikTok. The audience wording is *"their
> words and actions don't match."* Inside that there are at least four different conversations:
> words versus behaviour · attention mistaken for commitment · avoiding the direct conversation ·
> recognising the pattern but resisting what it implies. Which one interests you — or do you have a
> different take?

Working Brief: `source_stimulus` = inferred. **`thesis` = empty** — a keyword cannot populate it.

**3. You:** *"The last one. Some women aren't truly confused. They don't want to accept what the inconsistency means, because then they'd have to decide."*

**4. Reflection + challenge:**

> Your argument isn't that people should pay closer attention — it's that naming the pattern forces
> a decision they're not ready to make. Confusion is doing protective work.
>
> One flag: *"women"* makes this a claim about a group. The insight holds without it, and it's
> sharper aimed at the behaviour than at the people.

`thesis` → `state='inferred'`, `derived_from_message_ids=[msg_3]`.

**5. You accept with an edit.** → `state='owner_edited'`.

**6. Lenses — 3 offered, none applied:**

| lens | why it may fit | how it changes the lesson |
|---|---|---|
| **Congruence** (Exploration/Communication) | the topic is words-versus-behaviour | lesson becomes *read the pattern* |
| **Commitment Clarity** (Exclusivity) | ambiguity about status | lesson becomes *ask the direct question* |
| **Self-Trust** (Exploration/Trust) | knowing and overriding your own read | lesson becomes *trust what you already noticed* — **closest to your thesis** |

**7. You take Self-Trust, reject Clarification.** Rejection stored with your reason.
→ `ci_lens_options` updates. **Only now** does a `ce_relational_bridge` get created and validated.

**8. Directions — genuinely different**, not five versions of one lesson: Real Talk · myth correction ·
therapist breakdown · reflective. You pick Real Talk → the seven-part argument shapes the thesis
*before* generation (§11).

**9. Package generated**, then claims classified from the actual draft (§15): *"'some people' is a
professional interpretation, not an empirical claim — labelled."* Draft saved, unapproved.

---

## 8. Example — your own rough thought

**You paste:** *"Men always know immediately whether they want to marry you."*

**The AI does not write the hook.** It argues:

> *"Always"* makes this a universal claim the framework and the evidence can't support, and it's the
> part that would get quoted back at you. The defensible version is sharper anyway: prolonged
> ambiguity shouldn't be read as commitment developing slowly. Same edge, and it survives contact.
>
> What made you want to say it — something you saw, or a pattern in your practice?

**You:** *"A client waited four years. He married someone else in eight months."*

> Then the argument is about what sustained ambiguity means, not about what men know. Do you want
> this as Real Talk — naming the thing directly — or as a case-pattern breakdown?

Thesis inferred from your turns, overgeneralisation flagged, story captured as `ci_sources`, no lens
forced. Same workspace as Path A — the paths converge (§4).

---

## 9. Exact reuse — components and tables

### Reused unchanged

| | |
|---|---|
| `mappingValidation.ts` | stage 4 validation |
| `retrieval.ts` + `pickConsumerSafeDetail` | governed retrieval, clinical/consumer boundary |
| `bridges.ts` | becomes the lens **proposer**; grading and canon-set restriction unchanged |
| `claims.ts` | repositioned post-draft; records and constraints unchanged |
| `governance.ts` | version-bound public-use approvals |
| `qc.ts`, `narrativeQc.ts`, `ce_qc_blocking_rules` | unchanged |
| `ai/provider.ts`, `templates.ts`, `guard.ts` | unchanged; ceilings raised in data |
| `ce_content_briefs` · `ce_relational_bridges` · `ce_claims` · `ce_scripts` · `ce_script_packages` · `ce_angles` · `ce_content_series` · `ce_real_talk_briefs` · `ce_source_use_approvals` · `ai_content_drafts` · `ai_generation_requests` · `ai_approval_events` · `prompt_templates` | **no schema change** |

### Moved to Advanced View — routes unchanged, still working

`/admin/content-engine/intake` · `/script-builder` · `/approvals`

### Renamed, display only

`RLC Studio` → **Framework Studio**. `/admin/studio` routes untouched — one nav label and its
in-page headings. No 30-page migration.

---

## 10. Proposed migrations — all additive

```
0065  kb_source_registry + seed the 8 sources with tiers
      ce_platform_keywords += signal_class ('editorial_curated'), so the honest
      label is data rather than a hardcoded string
0066  ci_conversations · ci_messages · ci_sources · ci_working_briefs
      · ci_lens_options · ci_decisions · ci_retrieval_events
0067  ai_settings += conversation_soft_limit_usd (4) · conversation_hard_limit_usd (6)
      daily 25→50 · monthly 300→500        [UPDATE of one settings row]
      ai_generation_requests += conversation_id · stage_kind   [nullable]
0068  demand schema, created but UNUSED until you approve a provider:
      ci_demand_records (platform, phrase, metric_type, value, market, language,
        month_represented, retrieved_at, provider, official_or_estimated,
        confidence, provider_version, trend_direction)  — append-only, never overwritten
      ci_demand_refreshes (provider, started/finished, status, rows, cost, error)
```

**Additive guarantees:** no `DROP TABLE`, no `DROP COLUMN`, no destructive `ALTER TYPE`. Every new
column nullable or defaulted. The only `UPDATE` is the one `ai_settings` row for the ceilings, which
is a value change you asked for. Existing records, audit history, and the v2.1 rows are untouched —
v2.1 becomes a `kb_source_registry` row marked historical rather than being altered.

---

## Decision-log entry to record on approval

> **Workflow revision, Content Engine. Not a theoretical revision to the RLC.**
> Claim verification moves from a pre-generation gate to post-draft classification with resolution
> required before approval or publication. The requirement that claims are never skipped remains
> active. No draft may reach approved or publishable status carrying an unresolved high-risk,
> empirical, current-event, clinical, medical, legal, or materially misleading claim.
> Supersedes the placement established by ruling 7 (2026-08-06); ruling 7's substance stands.

---

## Two things I want to flag before you approve

**Voice rules do not exist yet as data.** §14 says *"use my approved voice and content rules"* and
§18 lists preferred wording and rejected angles. `ce_voice_examples` was created in 0056 and has
never been written to. Until it holds something, "your voice" means whatever the model infers from
your turns. Worth authoring early — it is the difference between content that sounds like you and
content that sounds like competent generic advice.

**Content history is thin.** §18's de-duplication reads `ai_content_drafts` (4 rows) and `articles`
(1 row). "You covered this six months ago" cannot be answered from that. If your published back
catalogue lives somewhere else — a CMS, a spreadsheet, the platforms themselves — importing it would
make that feature real rather than technically present.
