# RLC Content Intelligence — revised checkpoint (rev 2)

*2026-08-07. **Still no code written. No migrations created.*** Corrected portions only.

---

## 0. Two verified corrections, both against me

### 0.1 Self-Trust — confirmed, I was wrong **[VERIFIED]**

```
TRU-EXPR-003   Self-Trust   Expiration / Trust   task = Acceptance
TRU-RECV-001   Self-Trust   Recovery / Trust     task = Healing

Exploration / Trust actually holds:
  TRU-EXPL-001 Dependability   TRU-EXPL-002 Availability   TRU-EXPL-003 Congruence
  TRU-EXPL-004 Accountability  TRU-EXPL-005 Psychological Safety
  TRU-EXPL-006 Reliability     TRU-EXPL-007 Transparency
```

`EXPL` is Exploration. `EXPR` is Expiration. One letter, and I relocated a competency across a phase
boundary on the strength of its name sounding useful — which is the exact failure §1 says the system
must prevent. My error is the acceptance test.

**Congruence is `TRU-EXPL-003`, Exploration/Trust** — so your correction also supplies the right
direct lens for the example.

### 0.2 v2.4 is not a verified approved successor — I asserted it was **[VERIFIED]**

```
v2.1 workbook   111 rows   Version 1.0   "v1.0 (canonical)"   Status Draft       Reviewer blank
v2.4 workbook   111 rows   Version 1.0   "v1.0 (canonical)"   Status Draft       Reviewer blank
                 44 rows   Version 0.1   "v0.1 (working; July 2026)"  Status In Review  Reviewer blank

kb_source_registry     does not exist
ce_source_versions     does not exist
approval events for any source   0
```

There is **no approval record for any Knowledge Base version anywhere in the application.** The
v2.4 workbook marks its own Recovery/Renewal additions as *working, in review, unreviewed*. Calling
it "the current approved Knowledge Base" was unsupported.

**Consequence you should know about.** This morning's `importKbNarrativeV24.ts` wrote those 44 rows
with `status='active'`, because `validateMapping` requires an active narrative record. That is what
made Recovery and Renewal mappable and produced the "155/155 reachable" figure I reported. It did
**not** approve anything for public use — `ce_source_use_approvals` is still empty — but it did make
v0.1 working material retrievable, on my judgement rather than on evidence.

**[DECISION] Three options, and I am not choosing for you.**

| | effect |
|---|---|
| **A** Leave `status='active'`, mark provenance | R/R stays retrievable; every retrieval carries `version='0.1'`, `approval_state='in_review'`, and lenses from it are labelled provisional |
| **B** Introduce `status='in_review'` for the 44 | R/R becomes unretrievable again; coverage returns to 111/155 until you approve |
| **C** Leave active, block at lens stage | retrievable for exploration, cannot become a validated bridge |

I would take **A** — it preserves today's work, surfaces the truth at the point of use, and the
downstream public-use gate is already empty so nothing can publish regardless. But B is the
conservative reading of your own instruction, and it is your framework.

Until you decide, every reference reads: **"current approved Knowledge Base version, to be resolved
from governed source metadata."** No version string is hardcoded, and **v2.1 is not marked historical**.

---

## 1. Corrected source and authority model

Tier alone was wrong. Sources are compared only where they govern the same thing.

```
kb_source_registry
  id · source_key · title · source_type
  tier (1|2|3)
  authority_scope    text[]   -- WHAT this source governs
  version · version_label · version_evidence   -- where the version claim comes from
  approval_state (approved | in_review | draft | unverified)
  approval_evidence  -- who/when/what document. NULL means unverified, not approved
  supersedes_id · supersession_evidence        -- NULL until proven
  retrieval_scope (general | product_companion | on_request)
  product_boundary  text
  quarantine_note
  indexed_at · record_count
```

### `authority_scope` — who governs what

| source | tier | governs |
|---|---|---|
| Theory / Facilitator Manual | 1 | `theoretical_meaning` `phase_purpose` `developmental_logic` `conceptual_boundary` |
| Operational Definitions / Operations Manual | 1 | `terminology` `construct_definition` `competency_architecture` `identifier` `operational_rule` |
| Current approved Knowledge Base | 2 | `approved_detail` `indicators` `applications` `narrative` |
| Experience Clusters | 3 | `audience_language` `situational_pattern` — **interpretive only** |
| Situation Registry | 3 | `situation_description` `search_language` — crosswalk excluded, see §5 |
| R&R Competency Manual | 3 | unsuperseded content only |
| Companion workbooks | 3 | `product_application` — `retrieval_scope='product_companion'` |

### Conflict rule, corrected

```
conflict  ⟺  two sources make INCOMPATIBLE claims about the SAME governed_property
```

Governed properties that can conflict: `phase_assignment` · `domain_assignment` ·
`official_definition` · `developmental_task` · `inclusion_boundary` · `exclusion_boundary` ·
`public_use_status` · `application_restriction`.

A richer Knowledge Base record **is not a conflict** with a thinner manual entry. Detail is not
disagreement. Resolution is by the tier that holds `authority_scope` over *that property* — so the
Operations Manual wins a terminology dispute and the Facilitator Manual wins a phase-purpose dispute,
rather than "tier 1 always answers".

`ci_retrieval_events` gains `governed_property` per result and `conflict_scope` per flag.

---

## 2. Lens → bridge lifecycle, seven states

Selection ≠ validation ≠ approval. Your §4.

```
1  retrieved candidate        ci_retrieval_events
2  suggested lens             ci_lens_options   status='suggested'
3  owner-selected lens        ci_lens_options   status='selected'      ← "I want to explore this"
4  mapping validated          ci_lens_options   validation_result       ← structurally defensible
5  draft bridge created       ce_relational_bridges  status='draft'
6  bridge approved for reuse  ce_relational_bridges  status='owner_approved'   ← EXPLICIT, separate act
7  final mapping on a draft   ce_content_briefs  snapshot
```

`ce_relational_bridges` gains an explicit status, defaulting to the safe value:

```
draft | validated_for_current_content | owner_approved | rejected | superseded
```

**A bridge validated for one draft does not become a reusable keyword→competency mapping.** Only
`owner_approved` enters the governed reusable collection, and only by a deliberate act.

The existing `decision='accepted'` column is left alone — it records *your bridge-review decision*
and is not repurposed to mean governance approval.

### Rejection needs no explanation — §6

`owner_reason` becomes **optional**. One click, or "not that one" in the conversation, rejects a lens.
A reason is stored when you give one. Nothing is required.

---

## 3. `validateMapping` validates the lesson, not the coordinates — §5

Today it checks that competency + phase + domain + source record cohere. That is necessary and not
sufficient: **a real competency can support the wrong lesson.**

Added checks:

| check | question |
|---|---|
| lesson support | is the proposed lesson within the competency's approved definition? |
| situational fit | does the audience situation belong to this developmental context? |
| scope | does the content broaden the competency past its approved meaning? |
| directness | is a claimed *direct application* actually direct? |
| labelling | is a *related lens* labelled as one? |

And a **post-draft bridge-alignment check**: does the finished draft still make the lesson the bridge
was validated for? A draft that drifted onto a different lesson fails, and the finding names the drift.

This is the check that would have caught the ick script asserting *"the ick hits in under a second"*
under a competency about curiosity.

---

## 4. Working Brief — all owner-edited fields protected — §7

The overwrite protection applies to **every** field, not just the thesis:

> thesis · audience · why_it_matters · viewer_reward · necessary_nuance · editorial_direction ·
> content_series · real_talk_direction · real_talk_intensity · purpose · format · cta · selected_lens

Rule: any write to a field whose state is `owner_edited` or `owner_confirmed` becomes a
**suggestion** you accept or dismiss. The AI never silently replaces your value. The prior value is
kept as `superseded` in `ci_decisions`.

The thesis keeps its one additional rule: **it cannot be inferred from a keyword alone.** A write to
`thesis` is rejected unless it derives from at least one owner message.

---

## 5. Retrieval boundaries

### Record-level governance, not source-level — §9

A workbook's tabs do not share a governance status. Status therefore lives on the **record**:

```
kb_source_records
  source_id · section · record_key
  governance_status (approved | draft | quarantined | superseded)
  retrieval_eligible boolean
```

| Situation Registry section | status |
|---|---|
| situation descriptions | `approved` where approved |
| search / audience language | `approved` where approved |
| **Framework Crosswalk** | **`quarantined`** — excluded from validated RLC retrieval |
| companion links | `draft` |

### Experience Clusters are interpretive — §8

Retrieved as Tier 3 `audience_language` / `situational_pattern`. A cluster's *proposed* or
*questioned* phase association **cannot override** a governing manual or the Knowledge Base. Where a
cluster flags a phase-placement concern, it is preserved as an **unresolved governance issue** for
your review — never applied as a correction.

### Companion is scoped, not merely tiered — §10

`retrieval_scope='product_companion'` is enforced in the retrieval query, not in prompt text. It is
returned only when the conversation concerns the Companion, an approved Companion campaign is active,
you ask for it, or a product-specific workflow calls it. A general content conversation cannot reach it.

---

## 6. "Mixed signals" — corrected

Lenses now offered:

| lens | id | placement | relation |
|---|---|---|---|
| **Congruence** | `TRU-EXPL-003` | Exploration / Trust | **direct application** — words measured against repeated behaviour |
| **Discernment** | phase-level | Exploration, developmental task | broader phase interpretation — what this stage is for |
| **Self-Trust** | `TRU-EXPR-003` | **Expiration / Trust · Acceptance** | **related lens** — only if retrieved from its own Expiration context, and labelled as such |

The wireframe's *"Self-Trust (Exploration/Trust)"* is corrected in Plate 2. Self-Trust appears as a
related lens carrying its true phase, with the note that it belongs to Acceptance — not silently
relocated because its meaning sounded apt.

**The second example** (*"men always know…"*) is unchanged: the overgeneralisation challenge stands,
and no lens is forced.

---

## 7. Voice records — structure for approval — §11

Seven separate kinds, because they are approved differently:

```
ce_voice_rules
  kind: principle | example | prohibited_language | reading_level
        | platform_style | series_style | inferred_preference
  scope: global | platform:<x> | series:<x>
  content · rationale
  status: draft | owner_approved | rejected
  source: authored | inferred_from_conversation
  conversation_id · message_id     -- provenance for inferred
  approved_by · approved_at
```

`inferred_preference` may be captured from a conversation and **used within that conversation only**.
It cannot become an approved rule without your review — `status` starts `draft` and only you move it.
Retrieval for generation reads `status='owner_approved'` exclusively.

**Until an approved record exists, the system does not claim to use your voice.** The interface says
*"no approved voice rules yet"* rather than implying otherwise.

---

## 8. Content-history language — §12

Permitted, because the connected history can substantiate them:

- *No matching content was found in the connected content history*
- *No coverage exists in the currently indexed content*
- *This may overlap with one of the available drafts*

Forbidden until the back catalogue is imported:

- *You have never covered this* · *You covered this six months ago* · *Your audience has already seen this angle*

The import structure is designed now; Phase A is not blocked on the catalogue. Plate 1's "12 curated
phrases you haven't covered" becomes **"12 with no match in indexed content."**

---

## 9. Updated migrations

```
0065  kb_source_registry     tier · authority_scope[] · source_type · version · version_evidence
                             approval_state · approval_evidence · supersedes_id
                             supersession_evidence · retrieval_scope · product_boundary
                             quarantine_note
      kb_source_records      section/record-level governance_status · retrieval_eligible
      -- Registers sources with EVIDENCE. Anything unproven is 'unverified', never 'approved'.
      -- No supersession asserted from a filename. v2.1 is NOT marked historical.

0066  ci_conversations · ci_messages · ci_sources · ci_working_briefs
      ci_lens_options (validation_result, promoted_bridge_id, owner_reason NULLABLE)
      ci_decisions · ci_retrieval_events (governed_property, conflict_scope)

0067  ce_relational_bridges += status  default 'draft'
                            CHECK (status in ('draft','validated_for_current_content',
                                              'owner_approved','rejected','superseded'))
      -- existing rows backfill to 'draft'. `decision` untouched.

0068  ai_settings += conversation_soft_limit_usd (4) · conversation_hard_limit_usd (6)
                     daily 25→50 · monthly 300→500
      ai_generation_requests += conversation_id · stage_kind
      ce_voice_rules

0069  ci_demand_records · ci_demand_refreshes   -- built, unused, no provider activated
```

All additive. No `DROP`. Every new column nullable or defaulted. `ce_relational_bridges.status`
defaults to the **least** privileged value, so existing rows cannot be silently promoted.

---

## 10. Acceptance tests

All seven you listed, plus two the corrections imply:

| # | test |
|---|---|
| 1 | **Self-Trust cannot be assigned to Exploration.** `TRU-EXPR-003` mapped to any Exploration phase id fails validation with a cross-phase error. Generalised: no competency may be reassigned to a different phase or domain during retrieval, lens suggestion, bridge validation, or generation. |
| 2 | **A real competency cannot support an unrelated lesson.** A valid triple with a lesson outside the competency's definition fails the lesson-support check. |
| 3 | **A selected lens is not an approved reusable bridge.** After selection and validation, the bridge is `draft`; it is absent from the reusable-mapping query until explicitly `owner_approved`. |
| 4 | **Quarantined crosswalks cannot enter retrieval.** A Situation Registry crosswalk record is excluded even though its source is registered Tier 3. |
| 5 | **Companion material cannot leak.** A general conversation retrieving broadly returns zero `retrieval_scope='product_companion'` records. |
| 6 | **Owner-edited fields cannot be overwritten.** A write to any `owner_edited` field produces a suggestion, and the stored value is unchanged. |
| 7 | **An unverified version cannot supersede an approved source.** Setting `supersedes_id` without `supersession_evidence` is rejected; `approval_state` cannot be `approved` without `approval_evidence`. |
| 8 | **A thesis cannot derive from a keyword alone.** Rejected unless it cites ≥1 owner message. |
| 9 | **Detail is not disagreement.** A Knowledge Base record richer than a manual entry, with no incompatible governed property, raises no conflict. |

---

## What I need from you

1. **The v2.4 decision** — A, B, or C in §0.2. This is the only item blocking Phase A.
2. Anything wrong in the corrected authority model, since I have now been wrong twice about the
   framework and would rather be corrected here than in code.

Everything else above is settled and I will build to it.
