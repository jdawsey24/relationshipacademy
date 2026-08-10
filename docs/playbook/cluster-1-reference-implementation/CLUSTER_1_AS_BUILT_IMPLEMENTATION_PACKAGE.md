# Cluster 1 — As-Built Implementation Package (Consolidated)

*Relationship Playbook™ · Cluster 1 · "Believing You're Worth Being Chosen" (`finding-love-that-feels-mutual`)* _(superseded 2026-08-09 — see the correction note in `README.md`.)_

This single document is **self-contained**: it explains how Cluster 1 is implemented in the current repository without requiring repository access. Every claim was verified against the working tree of branch `main`; file paths and line ranges are cited. A folder of deeper supporting documents (`01-…` through `14-…` + `implementation-manifest.json`) accompanies it for targeted reference. **Producing this package changed no runtime code, content, migration, feature flag, or deployment.**

---

## What Claude Chat Should Learn From Cluster 1

Read this before designing any future cluster.

1. **Cluster 1 is the reference implementation, not a universal intervention template.** It shows *how* a cluster is built, not *what* every cluster's interventions should be.
2. **Future clusters reuse the product infrastructure but independently derive their behavioral and intervention logic** from the RLC framework. Reuse the engine, schema, persistence, Change Path, UI — derive the Problem Expressions, Change Targets, mechanisms, scenarios, and fidelity meanings fresh.
3. **Existing interaction signatures are options, not mandatory categories.** The six signatures (`evidenceTimeline`, `conclusionNarrowing`, `dualAttention`, `decisionRoom`, `investmentView`, `communicationRehearsal`) are Cluster 1's operations. A new operation reuses a signature *only if the mechanism authentically fits*; otherwise derive a new one.
4. **Code convenience must never redefine the framework.** If an operation doesn't fit a mechanism, the answer is new derivation — never bending the operation to reuse a mechanism.
5. **New shared primitives require a demonstrated unmet need and owner approval.** (That is exactly how the extended `reveal` node came to exist.)
6. **Claude Chat must freeze one canonical name for every fidelity signal** — no aliases — each with a bounded "establishes / does not establish" statement.
7. **All consumer claims must be bounded to exactly what the interaction establishes.** A fidelity field means only what the code computes; never inflate it.
8. **Simulated performance does not establish real-world Transfer.** Completing an Experience/Play is Exposure/Attempt/Technique-Fidelity, never Transfer. Transfer requires reported use in an authentic context beyond the rehearsal.
9. **Statements are personalization/routing assets, not mechanisms or interventions.** Recognition statements route and normalize; they do not treat.
10. **Difficult feelings are not automatically intervention targets.** Ordinary fatigue, loneliness, discouragement, and worry are in-scope and non-escalating.
11. **Intervention requires demonstrated Functional Interference with the relevant developmental task** — the framework's gate for whether a Problem Expression warrants an intervention at all.

---

## 1. Executive summary

**What the Relationship Playbook™ is.** A distinct, **paid** application-layer product that turns a recognized RLC pattern into **rehearsable, savable behavioral tools** for real life. Boundary map (DECISION-LOG #4):

| Product | Role |
|---|---|
| **Snapshot** | Recognition — identifies the pattern/cluster. |
| **Relationship Playbook™** | **Application** — rehearses & applies a cluster's behavioral operations. |
| **Companion** | Navigation — guided, situation-by-situation processing (separate PWA). |
| **Academy** | Education — member learning portal. |

**Cluster 1's purpose.** It is the **first and reference** Playbook — the interventions for Snapshot cluster 1 "Difficulty Feeling Chosen." Consumer product name (code `displayName`): **"Believing You're Worth Being Chosen"**; stable key `finding-love-that-feels-mutual`; `cluster_id = 1`. _(superseded 2026-08-09 — see the correction note in `README.md`.)_

**Current status — seven distinct states (do not collapse):**

| State | Value |
|---|---|
| Design complete | ✅ Yes — **except** the four new Plays' Use Reviews are authored FOR REVIEW, not owner-approved (#49). |
| Implementation complete | ✅ Yes — but **uncommitted** (HEAD `9429246` is the original two-Experience build; all Phase A–D is in the working tree only). |
| Migration complete | ⚠️ Owner confirmed `0053` ran (#45/#46); the file header still says "AUTHORED, NOT RUN" (stale). |
| Automated validation complete | ✅ 376/376 tests, `tsc` clean, build green (#52/#53). |
| Owner E2E accepted | 🟡 Non-authenticated preview PASS; **authenticated DB save→reload round-trip NOT verified.** |
| Deployed | ❌ No. |
| Production flag enabled | ❌ No (`PLAYBOOK_REV3_ENABLED` off by default; not enabled in prod). |

**Feature flag:** `PLAYBOOK_REV3_ENABLED = process.env.NEXT_PUBLIC_PLAYBOOK_REV3 === "true"` (`lib/playbook/rev3.ts:11`); OFF by default. **Attorney review:** not evidenced in the repository. **Owner gates remaining:** authenticated persistence verification; owner content-approval of the four new Use Reviews; deployment; flag enablement; commit of the working tree; (Missions for the four new Plays; wiring the events producer). Full list: `14-…`.

---

## 2. Sources of truth (hierarchy)

When two disagree, the higher wins; **code never redefines the theory**:

1. **RLC framework** — the canonical RLC manuals, the Behavioral Code Book, RLC intervention-development standards (Problem Expressions, Functional Interference, Change Targets, mechanisms, Technique Fidelity vs Transfer, suitability tiers). *External to this repo; top authority.*
2. **Approved cluster specification + Decision Log** — `artifacts/playbook-experience/` (Experience graphs, Play specs, design packs) and `DECISION-LOG.md` (53 entries).
3. **Implementation** — the current code/content/tests/migrations (the working tree).
4. **Historical / superseded drafts** — the retired v1 linear model (`cluster-1-difficulty-feeling-chosen-*-v1.md`), kept as source only.

Key repo docs: `docs/playbook-architecture-rev3.md` (Rev 3 architecture), `docs/playbook-cluster1-*.md` (change path / integrate / practice / simulations / end-to-end), `docs/playbook-commerce.md` (paid product, entitlement-gated), migration `supabase/migrations/0053_playbook_events.sql`.

---

## 3. Product architecture (Rev 3)

Eight layers, grouped for the reader into three consumer buckets (**Learn · Work on it · Keep & explore**), with the personalized **"A useful next step"** card on top. No layer is hidden because a state is empty.

| Internal layer | Consumer label | Bucket | Renderer |
|---|---|---|---|
| Understand | "Understand the Pattern" | Learn | `FieldGuide.tsx` |
| Experience | "See It Play Out" | Learn | `SimulationPlayer.tsx` |
| Play | "Use a Tool" | Work on it | `PlaySequence`→`PlayContainer` |
| Practice | "Practice in Real Life" | Work on it | `MissionCard.tsx` |
| Integrate | "Log a Real-Life Experience" / "Look at How It Went" | Work on it | `UseReviewFlow.tsx` |
| Change Path | *(never labeled)* "A useful next step" | (top card) | `changePath.ts` + `ChangePathHome.tsx` |
| My Plays | "My Plays" | Keep & explore | `ExperienceShell.tsx` |
| Explore Another Area | "Explore Another Area" | Keep & explore | `ExperienceShell.tsx` |

**End-to-end state flow:**
```
recognition → literature exposure → simulation exposure → Technique Fidelity
 → Play attempt/output → Mission selection → authentic-context attempt
 → Use Review → possible Transfer evidence
```

**Explicit invariants (test-enforced):**
- **Completion is not mastery.** **Review is not Transfer.** **Saving/editing a Play is not Transfer.**
- **Transfer requires reported use in an authentic context beyond the original in-app rehearsal** (`lib/playbook/processState.ts`: `highestProcessState` needs `used_in_another_context`/`technique_fidelity_in_context`; `changePath.ts` `transferEvidence = attemptCount >= 2`).
- **Emotional discomfort is not failure.** **Relationship outcome never determines Technique Fidelity.** The partner's behavior is authored, never a function of the reader's choice. Non-attempt is no-fault.

**Change Path** is internal orchestration — deterministic, non-diagnostic, not a clinical treatment plan, not a new RLC construct; surfaced only as one "useful next step"; "Explore Another Area" is always available.

---

## 4. Cluster 1 object inventory

Registry: `content/playbook/finding-love-that-feels-mutual.ts` → `MOVING_BEYOND_REJECTION: PlaybookContent`, resolved via `content/playbook/index.ts`.

**Recognition statement → pathway (7 cards):**

| Card | Role | → Play |
|---|---|---|
| `rec-self-meaning` | route | `what-it-actually-means` |
| `rec-selection` | route | `is-this-right-for-you` |
| `rec-evidence` | route | `read-and-decide` |
| `rec-over-invest` | route | `how-much-to-put-in` |
| `rec-self-edit` | route | `say-the-real-thing` |
| `rec-fatigue` | route | `rest-or-giving-up` |
| `rec-loneliness` | **validate** (no route) | — |

*(Statements are routing/personalization assets, not interventions; `rec-loneliness` normalizes and does not route.)*

**The six pathways:**

| # | Consumer Experience | Signature | Play id | Sim id | Use Review | Mission |
|---|---|---|---|---|---|---|
| 1 | What It Actually Means | `conclusionNarrowing` | `what-it-actually-means` | `sim-wm-not-a-match` | `review-what-it-actually-means` | `mission-wm-narrowest-true-thing` |
| 2 | Read It, Then Decide | `evidenceTimeline` | `read-and-decide` | `sim-rd-shorter-texts` | `review-read-and-decide` | `mission-rd-read-before-react` |
| 3 | Is This Right for You? | `dualAttention` | `is-this-right-for-you` | `sim-itr-evaluator-stance` | `review-is-this-right-for-you`* | — |
| 4 | Rest, or Giving Up? | `decisionRoom` | `rest-or-giving-up` | `sim-rgu-decision-room` | `review-rest-or-giving-up`* | — |
| 5 | How Much to Put In | `investmentView` | `how-much-to-put-in` | `sim-hmp-investment-view` | `review-how-much-to-put-in`* | — |
| 6 | Say the Real Thing | `communicationRehearsal` | `say-the-real-thing` | `sim-stt-rehearsal` | `review-say-the-real-thing`* | — |

*\* authored FOR REVIEW (#49), not owner-approved. Missions exist only for Plays 1–2.*

**Literature:** 13 Core Guides (`lit-what-is-dfc`, `lit-being-chosen-weight`, `lit-want-vs-worth`, `lit-wanted-vs-compatible`, `lit-rejection-not-verdict`, `lit-uncertainty`, `lit-kinds-of-signal`, `lit-see-vs-act`, `lit-over-investing`, `lit-self-editing`, `lit-fatigue`, `lit-loneliness`, `lit-healthier`); 6 Question Reads (`lit-faq-*`); 2 play-scope (`lit-play-rd`, `lit-play-wm`); 16 JIT (`lit-jit-*`). ⚠️ `lit-self-editing` (core) ≠ `lit-jit-self-editing` (JIT). A 101-statement `StatementMap` covers each Snapshot statement exactly once. Full IDs: `04-…` / manifest.

---

## 5. Shared content contracts

Schema lives in `lib/playbook/contentSchema.ts` (526 lines). Public shapes (line ranges in `03-…`):

- **`PlaybookContent`** (`:5-21`): `playbookKey, playbookVersion, displayName, opening, recognitionCards, plays[]`, optional Rev 3 arrays `literature?/simulations?/missions?/useReviews?/statementMap?`.
- **`Play`** (`:148-165`): `playId, playVersion, outputSchemaVersion, name, positioning, recognitionGate.prompt, screens[], portable[], myPlaysTemplate (5 fields), fidelity{correct,misuse[],notMeaning}`, optional `supportSignposts/routing/outputEditor`.
- **`Screen`** (`:67-103`): 12 kinds — shift, literature, learn, scenarioSort, ownTurn, sufficiency, ruleBuilder, sentenceBuilder, emotionBeat, **output** (required in every Play), portable, realWorldUse. **No bounded single-select screen exists** — bounded choices use `ownTurn` seeded with `suggestions`.
- **`Simulation`** (`:388-396`): `id, version, simulationSchemaVersion, playId, signature: InteractionKind, startNodeId, nodes: SimNode[]`.
- **`SimNode`** (`:369-386`): 7 kinds — `moment, note, capture, decision, reveal, reconsider, teach` (teach is the terminal handoff). `reveal` carries optional `body?/computedSummary?/recap?/reactions?`. Options carry `signal?: string` (the authored fidelity tag) and optionally `fidelity?` (ReconsiderFidelity).
- **`InteractionKind`** (`:227-236`): the six signatures + `scenarioSort/ruleBuilder/sentenceBuilder` (screen kinds).
- **`FidelityOutcome`** (`:317-322`): signature-tagged discriminated union (no generic score) — fields per signature in §6. `FidelityState = "demonstrated"|"not_demonstrated"|"not_applicable"`. `ChosenStance = rest|not_now|lightly_open|return_later|pause_decision`.
- **`Mission`** (`:410-420`): `id, playId, title, instruction, linkToOperation, attemptMeaning?, suitability?, progression?[]`. `MissionReport = attempted|no_opportunity|opportunity_not_taken|unsuitable`.
- **`UseReview`** (`:429-438`): four `StructuredPrompt`s (bounded selects only). Persisted `UseReviewEntry` (`:515`) = signals + `at?` + optional `experience?` (the one free-text note).
- **`PlaybookProgress`** (`:189-206`): `recognized[], play_states, outputs, my_plays[]`, + five optional Rev 3 `*_state` objects.

**Validation** (`contentValidate.ts`): `validatePlaybookContent` validates **Plays + recognition cards only** (every Play needs an `output` screen, five `myPlaysTemplate` fields, `fidelity`, `portable`; route cards need `pathwayPlayId`; unique playId; routing targets a built Play). ⚠️ **Simulations/Missions/UseReviews/Literature are NOT build-time validated by this module** — a coverage gap; simulation validity is enforced by `validateSimulation` + tests.

---

## 6. Experience engine & the six signatures

An Experience is a **deterministic authored graph** (no randomness, no generation; the partner's behavior is authored, never a function of the reader's choice). `validateSimulation` (`simulation.ts:237-291`) enforces: unique nodes, valid `startNodeId`, all successors exist, every option routes, reconsider fidelity valid when present, `teach.toPlayId` is an approved Play, no dead-ends, no cycles, no unreachable nodes, every terminal is a teach handoff.

**Fidelity is computed from authored signal tags, never node ids, never JIT** (`aggregateFidelity`, `simulation.ts:113-165`; helpers `selectedSignals`/`selectedSignalCounts`). Fidelity is aggregated **once**, at the teach handoff (`SimulationPlayer.tsx:224`, the only call site).

| Signature | Consumer Experience | Operation | Fidelity fields | Reveal | Signal-set rule (summary) |
|---|---|---|---|---|---|
| `evidenceTimeline` | Read It, Then Decide | Read signals over time | `evidence_reconsidered`, `interpretation_response_appropriate` | static `body` + chrome | last-answered reconsider's authored `fidelity` fragment wins |
| `conclusionNarrowing` | What It Actually Means | Bound a globalized read | `evidence_reconsidered`, `interpretation_response_appropriate` | static `body`/recap + chrome | same (reconsider fragment) |
| `dualAttention` | Is This Right for You? | Hold interest + own-fit | `evaluator_stance_held`, `fit_information_kept_in_view` | `computedSummary`→`dualAttentionFocus` | fit = `fit_kept`; stance = `held_both` AND fit demonstrated |
| `decisionRoom` | Rest, or Giving Up? | Intentional revisitable stance | `intentional_stance_selected`, `discouragement_distinguished_from_conclusion`, `chosen_stance` | `computedSummary`→`decisionRoomStance` | intentional = any `stance:*`; distinguished = NOT `held_forever` (default demonstrated); stance = enum |
| `investmentView` | How Much to Put In | Tie investment to evidence | `investment_evidence_tied`, `effort_without_new_evidence_noticed` | `recap` of 3 rounds | tied = NOT `increase_at_lull`; noticed = NOT (`increase_at_lull` AND `claimed_evidence_at_lull`) |
| `communicationRehearsal` | Say the Real Thing | State a preference clearly | `preference_expressed_clearly`, `unnecessary_self_erasure_avoided` | 3 `reactions` spreads + `computedSummary`→`communicationRehearsalRecap` | clearly = (`clear`+`buried`)≥2; erasure-avoided = `clear`≥2 |

**Per-field discipline (bound every consumer claim to exactly this):** e.g. `fit_information_kept_in_view` establishes *the reader made ≥1 fit-keeping choice* — NOT sustained attention (the resolver comment says "not a measure of attention"). `discouragement_distinguished_from_conclusion` is a **default `demonstrated`** that only a `held_forever` signal revokes — it does not establish an affirmative distinction act. `effort_without_new_evidence_noticed` describes the **observable** effort-vs-evidence relationship, not a causal inference (DECISION-LOG #23, do-not-revert). Full field-by-field in `05-…` §7.

Reveal rendering (`SimulationPlayer.tsx:105-136`): `resolveRevealContent` yields paragraphs + optional recap `<dl>` + computed `summary` `<p>` + reactions `<ul>`, in an `aria-live="polite"` region with focus management. Reveals report **observed choices, never a score**.

---

## 7. Play, Practice, Use Review, Change Path

**Play** = recognition gate → screens (incl. an `output` screen) → executable output → My Plays card. Under Rev 3 the Play **follows** its simulation (`PlaySequence`). Output editors (modal, DECISION-LOG #53): 5 of 6 Plays have an `outputEditor` (`is-this-right-for-you` does not). Distinct concepts: Experience rehearsal ≠ Play operation ≠ saved output ≠ My Plays ≠ Mission ≠ Use Review.

**Practice (Mission):** `attempted` (the only report that advances state + increments `attemptCount`), `no_opportunity`, `opportunity_not_taken`, `unsuitable` (all no-fault). One active mission (`currentMissionId`). `nextRung` is content ordering only (not readiness). `attemptCount >= 2` → Transfer evidence. No gamification; no partner surveillance. Only Plays 1–2 have Missions.

**Use Review (Integrate):** bounded selects (`didDifferently` multi, `performedOperation` → Technique Fidelity yes/partly/no, `becameClearer` multi, `stuckWhere` single) **plus one optional free-text `experience` note** (≤2000 chars, crisis-screened on blur, never in the event log). `recordUseReview` **appends** to a per-Play list (cap 50); surfaced as a running count, latest note, and a read-only "View all" history. **Only the bounded selects feed Change Path.**

**Change Path** (`changePath.ts`): frozen focus-priority tiers — **declared (5) > active mission (4) > pending review (3) > exploration (2) > recognition (1)**; ties keep content order. `routeForOp` precedence handles non-attempt/reviewed/attempted/selected/saved/exposed/recognized. `reviewedRouting` routes from the **Use-Review contents**: remaining discomfort **never routes backward when fidelity was shown**; `fidelityShown && transferEvidence` → a stretch/other-pattern CTA. Literature surfacing changes *surfacing only*, never the next-step claim.

---

## 8. Persistence, events & data minimization

**DB:** `playbook_progress` (migration 0052; `unique(user_id, playbook_key)`; own-row RLS; no DELETE) + five Rev 3 jsonb columns and an append-only `playbook_events` table (migration 0053; `unique(user_id, action_id)`; SELECT-only RLS). `loadProgress`/`saveProgress` (`progress.ts`) map empty `'{}'` ↔ absent. The events **producer route is not wired** (`progress.ts:89` seam; longitudinal events DEFERRED).

**Sanitization (`sanitize.ts`) — the untrusted boundary:** `sanitizeIncomingProgress` rebuilds from `emptyProgress` (server-authoritative key/version), drops unknown keys, and enforces enum allow-lists + numeric caps everywhere (fidelity state → `not_applicable`, stance → `pause_decision`, `experience` ≤2000, ≤50 runs/missions/reviews, `recognized` ≤100, etc.).

**Events (`events.ts`):** 7 event types with per-event payload allow-lists; `simulation_completed` schemaVersion **3** with per-signature `SIM_COMPLETED_FIELDS`; `use_reviewed` carries only `{performed,stuck,kept,updated,saved}` — **never the free text.** No payload accepts free text or partner data.

**Data-minimization rules:**
- **Never persisted:** crisis-screen free text; raw narrative / journaling / mood; partner / other-person / surveillance data (structurally impossible — no type/column accepts it; unknown keys dropped).
- **The one bounded free-text field stored:** `use_review_state.experience` (≤2000 chars; reader's own; crisis-screened; not in events).
- **Bounded functional metadata only** — every persisted structure is capped + (where categorical) enum-coerced.

**Authenticated round-trip:** **OWNER E2E NOT YET VERIFIED** (code path unit-tested; live auth write→reload never driven).

---

## 9. Safety & suitability

**Two layers.** *Layer A (crisis, shared, content-agnostic)* — `crisisSafety.ts` adapts the frozen Safety V2 engine; screens every bounded free-text field (sim `capture`, Play `ownTurn`, Use Review `experience`) on advance/blur; **metadata-only** (never stores/returns raw text); the engine uses an `action_level` 0–3 model (immediate danger needs an actionable disclosure **and** present-danger immediacy); non-blocking; absence of a trigger is never "safe." *Layer B (support signposts, per-Play, content-driven)* — e.g. `severe-self-worth` on `what-it-actually-means`; not a crisis call.

⚠️ **Naming collision:** code comments' `R1/R2/R3/R4` are **release-phase markers** (keys/versioning/persistence/crisis-layer) — **not** the RLC suitability tiers. The RLC **R1 self-guided / R2 supported / R3 clinician-dependent / excluded** tiers are expressed in content (`suitability` strings, `supportSignposts`, routing, the approved specs). All six Cluster 1 Plays are **R1 self-guided**; Say the Real Thing is strictly R1/low-risk.

**Hard prohibitions (enforced):** no diagnosis; no attachment classification; no motive/etiology inference; **no relationship-health score**; no partner monitoring; relationship outcome never sets fidelity; **ordinary discomfort does not trigger support** (support signposts are rare, never triggered by ordinary fatigue/loneliness/worry; the ordinary "never going to happen" read is not a trigger); mistreatment/coercion excluded & safety-routed. Per-pathway boundaries: `08-…` §5. **Attorney review: not evidenced.**

---

## 10. Build chronology & as-designed vs as-built

**Chronology:** original prototype (v1 linear model, #1–#13) → **architecture pivot v1→v2** (#14, linear model RETIRED) → Rev 3 Experience graphs authored & approved (#17–#27) → roadmap approved (#28: design Plays first; extend reveal node; defer persistence) → **Phase A** design 4 Plays (#29–#38) → **Phase B** shared infra (signature-tagged `FidelityOutcome`, aggregators, extended reveal; #39–#40) → **Phase C** four vertical slices in order (dualAttention→decisionRoom→investmentView→communicationRehearsal; #40–#43) → **Phase D** persistence (migration 0053; #45) → E2E verification (#46) → owner-requested changes (multi-log, Home/MyPlays surfacing, the four Use Reviews FOR REVIEW, rename+free-text, history, View-all/Edit, modal-editor bugfix; #47–#53). Test counts climbed 327→376. **This design-first, slice-by-slice, owner-gated sequence is why future clusters should be fully designed before Claude Code implements.**

**Superseded:** #14 retires the linear 21-screen model (the one hard supersession); #23/#19/#21 renamed provisional fidelity/enum names; #47/#50 overrode the single-review + label behavior.

**Key as-designed-vs-as-built variances (full table in `09-…`):**
- `0053` ran (owner) but its **header still says "AUTHORED, NOT RUN."**
- The four new Plays' **Use Reviews are FOR REVIEW, not owner-approved.**
- **No Missions** for the four new Plays.
- **`playbook_events` producer not wired.**
- **Content validator** doesn't cover Simulations/Missions/Reviews/Literature.
- **RD Change-Path hardcode** (`changePath.ts:132`).
- **Working tree uncommitted** on `main`.

---

## 11. Testing (376/376)

33 playbook test files (`10-…` has the full per-subsystem inventory). Coverage spans content validation, graph validation (`validateSimulation`), per-signature fidelity + reveal resolvers (one C1 test per new signature), Play walkthroughs, Missions, Use Reviews, Change Path (frozen priority, fail-soft, non-authoritative), **process-state adjudication** (tool-review never = Transfer; Transfer needs real-world enactment), progress/sanitization (Phase D coercion + caps), events/idempotency, feature-flag isolation (v0 unchanged), commerce/entitlement gating, accessibility (SortEngine/FieldGuide/axe), and safety (Layer A/B). Latest reported: **376/376 green, `tsc` clean, build green.** A future cluster keeps all SHARED-infra tests passing and adds its own C1-equivalent content tests (`10-…` §3/§4).

---

## 12. Reuse vs cluster-specific (for the next cluster)

- **Reuse verbatim (shared infra):** feature-flag shell, `FieldGuide`, `SimulationPlayer`, node primitives + `validateSimulation`, extended `reveal` node + resolver registry, content registry, progress model + reducers, persistence + sanitization, event registry + writer, Mission/Use-Review UI, Change Path + process-state, My Plays shell, `PlayContainer`/`OutputEditor`/`SortEngine`, a11y patterns, content validation, Layer A safety.
- **Reuse only if the mechanism authentically fits:** the six signatures, the reveal resolvers, the fidelity-aggregation *pattern*, Play screen sequences, output builders. *Signatures are options, not mandatory categories.*
- **Derive independently (never copy):** Problem Expressions, Change Targets, intervention mechanisms, consumer statements, simulation scenarios, fidelity field names, literature, Plays, Missions, Use Reviews, Change-Path routing content.

**Three rules:** existing signatures are options not categories; code convenience never redefines the framework; new shared primitives need a demonstrated unmet need + owner approval.

---

## 13. Input contract for a future cluster (Claude Chat → Claude Code)

Before Claude Code implements, Claude Chat must freeze a package with all 24 deliverables (detail + minimum fields in `12-…`): 1 cluster definition · 2 statement disposition map · 3 Problem Expressions · 4 Functional-Interference rulings · 5 framework-coverage rulings · 6 Change Targets · 7 mechanism/evidence review · 8 intervention portfolio · 9 Understand blueprint + full literature · 10 Experience design specs · 11 full Experience content graphs · 12 canonical fidelity signal names · 13 full Play production specs · 14 Missions · 15 Use Reviews · 16 Change-Path routing rules · 17 My Plays outputs · 18 JIT entries · 19 safety/suitability routing · 20 persistence/data-minimization rules · 21 acceptance criteria · 22 decision log · 23 prohibited changes · 24 owner approval status for every object. Anything missing → Claude Code returns the gap and stops.

---

## 14. Implementation recipe for Claude Code

15 steps (detail in `13-…`): (1) validate package completeness → (2) map objects to existing schemas → (3) find authentically-fitting signatures/primitives → (4) identify genuine unmet needs → **(5) STOP for owner approval before any shared schema/engine change** → (6) implement one vertical slice (behind the flag) → (7) validate content parity → (8) validate fidelity aggregation → (9) validate reveal behavior → (10) validate Experience→Play→Mission→Use Review→Change Path → (11) test persistence → (12) test flag isolation → (13) accessibility/mobile → (14) owner E2E (incl. authenticated persistence) → **(15) separately approve deployment and flag enablement.**

**The boundary:** Claude Code may identify implementation conflicts, but may **not** revise the approved **theory, Change Targets, mechanisms, intervention operations, consumer claims, fidelity meanings, or safety boundaries** — those conflicts are returned to the owner and Claude Chat for adjudication.

---

## 15. Open gates & limitations (do not claim complete)

Authenticated DB round-trip **not verified**; owner E2E **partial**; deployment **not done**; production flag **off**; attorney review **not evidenced**; the four new Use Reviews **FOR REVIEW only**; **no Missions** for the four new Plays; `playbook_events` producer **not wired**; `0053` header **stale ("AUTHORED, NOT RUN")**; **working tree uncommitted** on `main`; manual screen-reader/mobile a11y sweep of the four new pathways **not evidenced**. Full detail: `14-…`.

**Never claim:** deployed · production flag enabled · authenticated persistence verified · attorney-reviewed · committed on main · all content owner-approved.
