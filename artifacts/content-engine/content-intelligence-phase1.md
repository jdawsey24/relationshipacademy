# RLC Content Intelligence — Phase 1: audit and architecture

*2026-08-07. **Audit only. No code written, no migrations created.*** Per §21–22 of the brief and the
standing rule on this project.

Tags: **[VERIFIED]** checked against the running system today · **[GAP]** the brief assumes something
that does not exist · **[CONFLICT]** the brief reverses an earlier ruling · **[DECISION]** needs you.

---

## 0. The finding that changes the shape of this

### Demand Intelligence does not exist. **[GAP]**

§7 says *"Retain or complete the provider-adapter architecture."* There is nothing to retain. The
270-row keyword corpus is a **one-time spreadsheet import** — every row shares a single `created_at`,
and there is no provider code anywhere in the repository.

Measured against §6's required record fields:

```
✗ metric_type      ✗ current_volume   ✗ previous_period   ✗ percent_change
✗ trend_status     ✗ retrieved_at     ✗ market            ✗ language
✗ month_represented ✗ provider        ✗ official_or_estimated
✗ confidence       ✗ provider_version ✗ content_gap
✗ audience_intent  ✗ related_phrases  ✗ covered_already
```

**17 of 17 absent.** What exists is editorial scoring authored by hand — `opportunity_score`,
`priority_tier`, `audience_doorway`, `rlc_interpretation` — which is genuinely useful, and is not
demand data. No volumes, no movement, no dates, no markets, no provider.

So §6 and §7 are not a refactor of an existing subsystem. They are a **new subsystem with external
vendor dependencies, recurring API cost, and a provider-selection decision** — and they are the
largest single piece of the brief. Everything the home screen promises (*rising with my audience,
new content gaps, recently updated demand signals, monthly change*) depends on data the system has
never had.

The conversational Content Studio can be built without it. The opportunity library cannot.

---

## 1. What already exists, and what it is worth

### Reusable as-is **[VERIFIED]**

| capability | where | keep |
|---|---|---|
| Full-relationship mapping validation | `lib/contentEngine/mappingValidation.ts` | yes — §9's guarantee depends on it |
| Consumer-safe projection (allowlist) | `lib/contentEngine/retrieval.ts` | yes — the clinical/consumer boundary |
| Graded bridges + eligibility | `lib/contentEngine/bridges.ts` | yes — becomes §9's "lenses" |
| Claim records + verification | `scriptBuilder/claims.ts` | yes, **repositioned** — see §5 |
| Public-use approvals, version-bound | `scriptBuilder/governance.ts` | yes |
| Category-sensitive QC | `scriptBuilder/qc.ts` + `ce_qc_blocking_rules` | yes |
| Narrative QC, phase-derived | `lib/framework/narrativeQc.ts` | yes |
| Versioned drafts, approval events | `ai_content_drafts`, `ai_approval_events` | yes |
| Prompt templates, approval-gated | `prompt_templates` + `getActiveTemplate` | yes |
| Provider abstraction, cost ceilings | `lib/ai/provider.ts`, `guard.ts` | yes — needs a higher ceiling, see §7 |
| Owner + MFA gate, audit | `requireAiOwner`, `lib/audit.ts` | yes |

That is most of §16's governance list already built and tested. **None of it needs rebuilding** — it
needs to move behind a different front end.

### Moves to Advanced View **[VERIFIED]**

`/admin/content-engine/intake` (bridge review), `/admin/content-engine/script-builder` (the four-screen
form), `/admin/content-engine/approvals`. All three keep working; they stop being the default path.

### Greenfield

Conversation storage, Working Brief state, thesis interpretation, lens presentation, multi-direction
generation, content-package formats beyond short-form video, content-history de-duplication, and the
whole Demand Intelligence layer.

---

## 2. Naming collision **[DECISION]**

Two things are already called Studio:

- **`/admin/studio`** — 30 pages. Content & Assessment Studio: competency admin, framework editing,
  publishing, assessment mapping. Nothing to do with this brief.
- **`/admin/content-engine/*`** — what the brief calls "the existing Content Studio."

The brief names the new workspace **Content Studio**, which is currently the name of the other thing.
Options: rename the existing one (e.g. *Framework Studio*), put the new one at `/admin/content-studio`
and leave the old name alone, or nest it. I would rename the old one — it is framework
administration, not content creation — but it has 30 pages and its own nav entry, so it is your call.

---

## 3. Source hierarchy **[GAP]**

§2 lists eight governed sources. Current reality:

| source | state |
|---|---|
| RLC Master Knowledge Base | **indexed and retrievable** — but the brief says v2.1 and the system now runs **v2.4** (155 competencies, imported today) |
| RLC Experience Clusters | spreadsheet in `import/`, **not indexed** |
| Relationship Situation Registry | spreadsheet in `import/`, **not indexed**; its 60 crosswalks are quarantined by your ruling 5 |
| Facilitator Manual | `.docx`, **not indexed** |
| Operations Manual | `.docx`, **not indexed** |
| Recovery & Renewal Competency Manual | `.docx`, **not indexed** — superseded by v2.4, which is imported |
| Companion Competency Review Workbook | **not indexed** |
| Companion Architecture Workbook | **not indexed** |

So retrieval today can cite the Knowledge Base and the phase narratives, and nothing else. §9's
retrieval list (Experience Clusters, situations, audience language) needs those sources indexed
first — which is its own import-and-govern job, roughly the size of the v2.4 imports.

**The v2.1/v2.4 discrepancy needs your word.** I will assume v2.4 is correct since we imported it
today, but the brief says v2.1 and I am not going to quietly overrule a canonical-source list.

---

## 4. Cost and scale **[DECISION]**

A conversational strategist is many small calls plus a few large ones. The current ceiling is
**$25/day, $300/month**, and a single Script Builder package already costs ~$0.60–0.75. An
exploratory conversation could plausibly cost $2–5 before any content exists.

At $25/day that is roughly five working conversations. The ceiling was sized for a form. It needs
raising, or a per-conversation budget, or both — and it should stay a real ceiling, not be removed.

---

## 5. Where the brief reverses an earlier ruling **[CONFLICT]**

§15: *"Do not require me to certify 'no claims' before the content exists. After drafting, scan the
actual content."*

Ruling 7 (2026-08-06) was *"claim-based verification, never skipped for evergreen"*, and I built it as
a **pre-generation gate**: `generateScripts` refuses until the review is recorded. That was finished
and verified yesterday.

These are reconcilable — the step still never gets skipped, it just moves after drafting — and §15 is
plainly the better creative sequence. But it is a reversal of a stated ruling, so I am naming it
rather than quietly flipping the gate. **Confirmed reading:** claims are auto-classified from the
finished draft, the review gate moves to before *approval/publication* rather than before generation,
and nothing can reach approved state with unresolved high-risk claims.

Two smaller reversals in the same direction, both of which I read as intended:

- Real Talk currently gates script generation on a complete seven-part brief. §11 says series must
  influence the thesis *before* generation — compatible, but the hard gate becomes conversational.
- The Working Brief (§12) replaces the configuration screen. Fields become inferred rather than required.

---

## 6. Architecture I propose

### The conversation is the record

```
ci_conversations      one creative thread: title, status, entry_path, created/updated
ci_messages           role, content, and WHAT THE TURN DID — tool calls, retrievals, decisions
ci_sources            what was brought in: text, link, screenshot, file, keyword, saved idea
ci_working_briefs     the inferred state, one per conversation, every field nullable
ci_lens_options       lenses offered, with rationale; accepted / rejected / combined
ci_decisions          append-only: what was chosen, when, by whom, and what it superseded
```

`ci_working_briefs` carries a `derived_from_message_id` per field so "why does it say this" is
answerable, and an `owner_edited` flag per field so inference never overwrites something you typed.

### Layer separation enforced structurally (§3)

The three layers are not a UI convention — they are separate columns with separate provenance:

- **canonical** — `competency_id`, retrieved records, `source_version`. Written only by retrieval.
- **editorial** — `thesis`, `argument`, `distinction`. Written only from *your* turns, never inferred
  from a keyword. A keyword arriving with `rlc_interpretation` populates a *suggestion*, not the thesis.
- **creative** — angles, drafts, packages. Written by generation.

A migration cannot move a value from suggestion to thesis. That is what stops §3's collapse.

### Retrieval (§9)

Reuses `generateBridges` but changes its contract: it currently returns bridges graded for
*eligibility*. It becomes a **lens proposer** returning 2–4 defensible options with the four required
explanations, and the owner may accept none. The graded status and mapping validation stay exactly as
they are — a weak lens is still visibly weak.

### Existing tables reused, not duplicated (§21.6)

`ce_content_briefs` becomes the *derived* record a conversation produces when it is ready to generate,
not the thing you fill in. `ce_relational_bridges` stores proposed lenses. `ce_claims` moves to
post-draft classification. `ai_content_drafts` continues to hold versions. No duplication.

---

## 7. Sequencing I recommend

The brief's Phase 2 bundles the opportunity library with the conversational workspace. I would
separate them, because one is buildable now and the other is blocked on vendor selection.

| | scope | blocked on |
|---|---|---|
| **A** | Conversation + Working Brief + lens proposal + editorial development + content packages. Both entry paths, with Path B reading the **existing** 270-keyword corpus, honestly labelled as editorial scoring rather than demand data. | nothing |
| **B** | Governance integration, Advanced View, post-draft claim classification, content-history de-duplication | A |
| **C** | Demand Intelligence: provider adapters, refresh, history, metric-integrity fields, cross-platform normalisation | **your vendor + budget decision** |
| **D** | Indexing the remaining canonical sources so §9 retrieval can cite them | your call on which matter |

A delivers the thing the brief is actually about — *"feels like working with an AI content strategist"* —
without waiting on a keyword vendor. C is where the honest metric labelling in §6 lives, and it cannot
be faked from the current corpus without inventing numbers, which §6 explicitly forbids.

---

## 8. Decisions I need before Phase 2

1. **Naming.** Rename `/admin/studio` → Framework Studio, or put the new workspace elsewhere?
2. **Knowledge Base version.** §2 says v2.1; the system runs v2.4. Confirm v2.4.
3. **Claim gate reversal.** Confirm §15 supersedes ruling 7's pre-generation gate.
4. **Demand Intelligence.** Which providers, and what monthly budget? Until this is answered, Path B
   shows the existing corpus with honest labels and no invented metrics.
5. **Cost ceiling.** Raise from $25/day to what? Add a per-conversation cap?
6. **Source indexing.** Which of the six unindexed sources matter enough to import and govern first?
   My order: Experience Clusters, then Situation Registry, then the manuals.

## 9. What I will not do

Invent framework content, create phases/domains/tasks/competencies, resolve a theoretical conflict by
authoring canon, overwrite historical records, expose provider keys client-side, fabricate demand
numbers for platforms we do not query, or let a creative conversation write to a canonical table.
