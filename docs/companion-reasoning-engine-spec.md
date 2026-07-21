# Relationship Companion™ Reasoning Engine — Specification (v0.2 Draft)

**Reference:** Data Integrity finding DI-011
**Date:** 2026-07-20
**Author:** Systems Architect
**Status:** Draft for owner review — specification only, no implementation
**Primary canonical source:** Relationship Companion™ Prompt Architecture Manual (Layers 1–6, Canonical Reasoning Sequence, Appendix E); Relationship Companion™ Operations Manual (§4 boundaries, §6 Experience Types)

### Changelog — v0.1 → v0.2 (design-review response)
Addresses the twelve review findings: (1) reconciled the manual's cross-layer ordering tension explicitly; (2) added **confirm-vs-derive** modes for the Canonical Reasoning Sequence; (3) added the **open-question classification bridge**; (4) added a dedicated **Safety Architecture** section; (5) resolved the objective↔experience circularity; (6) reconciled experience-type *chosen vs. pre-bound*; (7) promoted **selection ranking** to a core component with a default policy; (8) added **Performance & Scalability**; (9) added **resume semantics**; (10) added **object versioning** to traces; (11) added a **registry interface matrix**; (12) added a **validation strategy**.

---

## 0. Authority & scope

This document specifies the **runtime reasoning engine** — the orchestration layer that decides, at runtime, which guided experience the Companion runs for a given learner and moment, and how it assembles that experience from canonical objects.

It is an **implementation artifact**. It sits below the canonical documents and never redefines them:

> Theory Manual → Operational Definitions Manual → Assessment Master / MKB v2.1 → Prompt Architecture Manual → **this specification**.

The engine **operationalizes** the six layers; it introduces no new theory, competencies, or framework changes. Where a canonical object does not exist (e.g. Recovery/Renewal competencies, DI-006), it degrades gracefully and **never invents** (Layer 3, Rule 4).

**Framing:** the Companion is a **guided educational-experience platform**, not a conversational agent. The engine's unit of work is the **Experience** (a row in the Companion Experience Registry). Everything else exists to select, assemble, deliver, and sequence experiences.

---

## 1. Core principle

The engine does one thing: **it turns a learner event into the right guided experience, grounded in the framework, then sequences the next one.** It does not free-associate a reply. Every interaction resolves to (a) selecting an Experience, (b) reasoning it through the framework, (c) retrieving the objects it needs, (d) generating and delivering it, (e) updating state and choosing what's next.

---

## 2. Architecture overview — the runtime loop

```
Learner Event
    ↓
[Stage 0] Session Init + Continuous Safety Screen        (Layer 1 · SAF-001 · §5)
    ↓
[Stage 1] Learner Context Resolution                     (Layer 4 → Relational Learning Profile™)
    ↓
[Stage 2] Framework Reasoning — Canonical Reasoning Seq.  (Layer 2 · confirm/derive · §3)
    ↓
[Stage 3] Experience Selection                           (Companion Experience Registry · §6)
    ↓
[Stage 4] Knowledge Retrieval                            (Layer 3 retrieval workflow)
    ↓
[Stage 5] Experience Generation                          (Layer 5 · 5-part architecture)
    ↓
[Stage 6] Response Generation                            (Layer 6 · Connection→…→Next Step)
    ↓
[Stage 7] Progress Update + Next-Experience Selection     (Progress · Pathway · Follow-ups)
    ↓
(loop)
```

### 2.1 Reconciling the manual's cross-layer ordering (finding #1)

The manual specifies ordering in **three** places that are not mutually consistent, because each describes a different altitude:

- **Appendix E (Workflow Architecture):** Learner Event → Workflow Selection → Context Resolution → Knowledge Retrieval → **Reasoning** → Response → Progress → Next.
- **Layer 2 (Canonical Reasoning Sequence):** reasoning *identifies* the situation, phase, competency, objective, and experience type.
- **Layer 3 (Retrieval Workflow):** Structural Context → Situation → Framework Mapping → Competency → Indicators → Resources → **User Context** → Experience Template (user context retrieved *late*).

These conflict: Appendix E puts reasoning *after* retrieval, but Layer 3 retrieval already needs the situation and competency that *reasoning* produces; and Layer 3 puts user context last, while personalization must inform selection. This is an **acknowledged tension in the source material**, not a settled order.

**Chosen order and rationale (this spec's decision):** resolve **learner context first** (Stage 1), **reason to a framework resolution** (Stage 2), **select the experience** (Stage 3), then perform a **targeted retrieval of exactly that experience's declared objects** (Stage 4). We diverge from Appendix E's literal sequence deliberately, because:
1. The Experience Registry now makes each experience's object dependencies **explicit** (its `Required Knowledge Objects / Lessons / Practices / Reflections`), so retrieval is a *bounded lookup after* selection rather than an open search before it — this is more efficient and more traceable than the manual's pre-registry assumption.
2. Reasoning must precede selection because selection keys on the reasoning outputs (situation, competency, type).
3. Context-first (vs. Layer 3's context-last) is required so personalization can inform selection ranking (§6).

This divergence is an **implementation optimization over canonical structure, not a redefinition of it** — every canonical *object* and *rule* is preserved; only the retrieval *timing* is tightened. Flagged here for owner ratification.

---

## 3. Input modes — how an event enters the pipeline (findings #2, #3)

Not every event derives the situation from scratch. The engine runs the Canonical Reasoning Sequence (Stage 2) in one of two **modes**, plus a classification bridge for open text.

### 3.1 Confirm mode (situation-first — the product's front door)
When the trigger already supplies a canonical object — the learner tapped a situation on the Process/Home surface, or opened a specific experience — Steps 1–3 and 6 are **pre-answered by data**. The engine **validates** rather than derives:
- The situation's `primary_status_key`, `reg_situation_framework_map` (phase/task/competency), and `primary_experience_type_id` are read directly.
- The sequence's job is to **confirm** these resolve consistently (e.g. structural context matches, competency is canonical/published) and to fill Step 5 (objective). If a pre-bound value fails validation (e.g. held competency, DI-012), the engine degrades to phase/task level.

### 3.2 Derive mode (assessment / pathway / recommendation)
When the trigger provides no situation (post-assessment, a pathway step, a recommendation), the engine **derives** the full sequence Step 1→6 as originally specified.

### 3.3 Open-question bridge ("Ask the Companion")
A free-text question (WFL-301; "Companion Conversations" experiences) enters through a **classification step before Stage 2**:
1. Screen for safety (Stage 0) — always first.
2. **Classify the utterance** against the canonical Situation Registry (search terms + situation definitions) to find the best-matching `situation_id`; if a confident match exists, enter **confirm mode** with it.
3. If no confident situation match, map to the **Decision Philosophy** path (Layer 1 §6): *clarify the situation → explain relevant developmental principles → identify options → discuss benefits/drawbacks → encourage reflection* — realized as a **Decide/Process** experience scoped to the learner's structural context. The engine never answers "what should I do?" prescriptively (Layer 1 §6; Ops §4 "not a decision-maker").
4. The classifier **never invents a situation**; a no-match resolves to the default surface (§6.4) plus a logged content-gap.

> The classifier itself (utterance → `situation_id`) is a bounded retrieval/matching task over `reg_search_terms` + situation definitions. Its confidence threshold is an open parameter (§13).

---

## 4. Pipeline specification (stage by stage)

### Stage 0 — Session init & continuous safety
See the dedicated **Safety Architecture** (§5). In brief: load the Constitution; run SAF-001 as a continuous guard; on elevated risk, halt the educational pipeline and route to the safety response.

### Stage 1 — Learner context resolution
- **Source:** Layer 4; CTX-001; CAP-017. **Reads:** User, Progress, Assessment repositories.
- Assemble the **Relational Learning Profile™** (§7). Personalization **adapts delivery, never theory**.

### Stage 2 — Framework reasoning (confirm or derive per §3)
The six-step Canonical Reasoning Sequence:

| Step | Question | Resolves to | Source | Confirm mode |
|------|----------|-------------|--------|--------------|
| 1 Structural Context | Where structurally? | Single…Separation | Structural Context Registry | validated from situation `primary_status_key` |
| 2 Situation | Which primary situation? | one canonical situation | `reg_situations` | **given** by trigger |
| 3 Developmental Context | What developmental work? | Phase + Task + Objective | Phase/Task Registries, `reg_situation_framework_map` | read from map |
| 4 Primary Competency | Which competency? | one canonical competency | Knowledge Object Registry | read from map (blank if held/absent) |
| 5 Educational Objective | Understand/practice/recognize what? | **the selected experience's Learner Outcome** (see below) | Experience Registry | resolved at Stage 3 |
| 6 Experience Type | Which type? | Prepare/Process/Decide/Build/Celebrate | Experience Type Registry | **given** by situation `primary_experience_type_id` |

- **Objective ↔ experience (finding #5):** the educational objective is **not** derived independently and then matched. It is the **Learner Outcome of the experience selected in Stage 3**. Step 5 therefore *names the requirement* ("this interaction needs one clear educational objective"); the concrete objective is **bound at selection**. Reasoning constrains the *space* of acceptable experiences (phase/competency/type); selection picks the one whose Learner Outcome becomes the objective. No circularity: requirement (Step 5) → candidate set (Steps 1–4,6) → selection (Stage 3) → concrete objective.
- **Experience type chosen vs. pre-bound (finding #6):** in **confirm mode** the type is *given* by the situation and Step 6 only validates it; in **derive mode** the engine *selects* it per the manual. The spec no longer claims the engine always chooses it.
- **Completion rule:** all steps resolve before proceeding; if Step 4 has no canonical competency (Recovery/Renewal), stop at phase+task and proceed — never fabricate.
- **Output:** `FrameworkResolution { mode, structuralContext, situationId?, phase, task, competencyId?, experienceType?, objectiveRequirement }`.

### Stage 3 — Experience selection
Central decision; see §6. **Output:** one `experienceId` + ranked shortlist; its Learner Outcome becomes the interaction's educational objective.

### Stage 4 — Knowledge retrieval
- **Source:** Layer 3. Because selection is now upstream, retrieval is a **bounded lookup** of the selected experience's declared FK columns (`Required Knowledge Objects/Lessons/Practices/Reflections/Repositories`), enriched with the Layer-3 chain (situation → framework mapping → competency → indicators → resources → user context).
- **Rules:** retrieve before generating; canonical sources first; **never invent**; separate retrieval from interpretation.
- **Completion:** the five retrieval questions answered, or graceful degradation. **Output:** `ExperiencePayload`.

### Stage 5 — Experience generation
- **Source:** Layer 5 five-part architecture (Welcome → Understanding → Framework Insight → Reflection → Skill Development → close), specialized by the Experience Type's Typical Flow (Ops §6). One competency; one objective. **Output:** `GeneratedExperience`.

### Stage 6 — Response generation
- **Source:** Layer 6 (Connection → Understanding → Insight → Action → Next Step), rendered in the Layer 1 §4 voice. **Output:** delivered interaction.

### Stage 7 — Progress update & next-experience
- **Source:** Appendix E; WFL-401–404. Persist completion, update the Profile and milestones, then pick next by precedence: (a) completed experience's **Follow-up Experiences**; (b) **Developmental Pathway™** next step; (c) fresh recommendation (MKB-16); else default surface. **Output:** `nextExperienceId?` + updated state.

---

## 5. Safety Architecture (finding #4)

Safety is a **cross-cutting override**, not a workflow (DI-008). It runs at Stage 0 and continuously on every learner input.

### 5.1 Canonical boundary (what the Companion is)
Per Ops §4 and Layer 1 §5, the Companion is for **everyday relationship growth**; it **does not** diagnose, conduct therapy, prescribe treatment, or serve as a **crisis resource**. Ops §4 is explicit: *"Experiences involving elevated risk should redirect users toward appropriate emergency or professional resources."* That sentence is the canonical mandate for the safety response.

### 5.2 Escalation levels (mechanism)
| Level | Meaning | Engine action |
|-------|---------|---------------|
| **L0 Clear** | no risk signal | proceed normally |
| **L1 Sensitive** | emotionally heavy but within scope (breakup, conflict, grief) | proceed; select a Process/Celebrate experience; soften voice (Layer 1 §4) |
| **L2 Out-of-scope** | needs professional support beyond education (clinical, mental-health) | **halt education**; deliver a supportive, non-diagnostic message; surface professional-resource guidance |
| **L3 Elevated risk** | immediate-intervention indicators (harm to self/others, abuse) | **halt immediately**; deliver the emergency/crisis-resource handoff; do not run any experience |

- L2/L3 **override every other trigger and stage** (§6.1). The engine never continues an educational experience through an L2/L3 signal.
- The response is **supportive and non-directive**, consistent with "not a decision-maker" (Ops §4): it does not diagnose, and it hands off rather than advises.

### 5.3 What must be authored (NOT invented here)
The **specific clinical trigger taxonomy** — the phrases/patterns that map an utterance to L1/L2/L3, and the exact resource-referral content per jurisdiction — is **out of scope for me to author** and must be developed with **qualified clinical/safety input**. This spec defines the *mechanism* (levels, override, handoff) and the *canonical mandate* (redirect to emergency/professional resources); it deliberately does **not** invent the detection taxonomy or crisis-line content. Tracked as an open safety dependency (§13).

---

## 6. Experience selection logic (finding #7)

Selection chooses one row from the Experience Registry. It is a **core engine component**, not a tuning detail — paths §6.1(4–5) are unbuildable without the ranking policy, so a **default policy is specified here**, not deferred.

### 6.1 Trigger precedence
1. **Safety (L2/L3)** — overrides all (§5).
2. **Direct request** — learner tapped a situation/experience → confirm mode on that `situation_id`.
3. **Assessment-driven** — post-assessment → Interpretation experiences → recommendations.
4. **Pathway-driven** — active Pathway™ next step → its Education/Development/Practice experience.
5. **Recommendation-driven** — MKB-16 fires on a flagged growth competency → matching development/practice experience.
6. **Milestone/transition** — recognized milestone or phase/structural transition → Celebrate/Life-Transition experience.
7. **Default** — surface situations for the learner's structural context.

### 6.2 Matching procedure
Given `FrameworkResolution`: (1) **exact situation** → the situation-guided experience; (2) else **competency** → Education/Development/Practice/Reflection experiences whose `Required Knowledge Objects` = that competency, filtered by `experienceType`; (3) else **phase/task** → phase-scoped experiences (never below phase/task); (4) **type filter**; (5) **rank** (§6.3); (6) **tie-break** by follow-up distance, then registry order.

### 6.3 Default ranking policy (specified, tunable)
Order candidates by weighted score, default weights: **pathway alignment 0.40 · flagged-growth priority 0.30 · difficulty fit 0.20 · recency/novelty 0.10**.

> **Status: RATIFIED by owner, 2026-07-20** as the default selection policy. These remain runtime-tunable configuration (see the classification below) — ratification sets the shipping default, not a frozen value.

**Per-weight rationale:**
- **Pathway alignment — 0.40 (highest).** If the learner has an active Developmental Pathway™, honoring its next step preserves developmental continuity (Layer 4 "Build Continuity"). Ignoring the plan fragments learning, so it outranks the rest.
- **Flagged-growth priority — 0.30.** The learner's biggest growth need (from RPI/assessment) is where development compounds fastest. High, but *below* pathway so remediation serves the plan rather than derailing it.
- **Difficulty fit — 0.20.** Matching an experience to readiness keeps engagement and avoids overwhelm. A shaping factor, not a driver.
- **Recency/novelty — 0.10 (lowest).** Anti-repetition and variety. A refinement, not a developmental reason to choose an experience.

**Sensitivity (same learner, different weights) —** learner on a pathway step *Develop: Active Listening*, biggest flagged growth *Emotional Regulation*, completed an Active Listening lesson yesterday:
- **Default (pathway 0.40):** → the pathway step (Active Listening) — continuity wins despite yesterday's completion.
- **Growth-weighted (0.50 growth / 0.20 pathway):** → Emotional Regulation — targets the weakness, at the cost of pathway coherence.
- **Recency-weighted (0.40 recency):** → a novel, off-plan experience — variety over continuity.
- **Difficulty-weighted (0.40 difficulty):** → down-ranks the stretch Emotional Regulation practice → a gentler experience; slower but safer ramp.

So the weights tune the balance between **continuity (pathway), remediation (growth), comfort (difficulty), and variety (recency)** — a pedagogical dial, not a change to *what is eligible*.

**Classification — configurable runtime parameters, NOT canonical.** The weights are **product/pedagogical configuration**: owner-tunable, environment-overridable, and A/B-testable, with no framework review required to change them. What is **canonical and immutable** is the *constraint envelope* the ranking runs inside — every candidate it orders is *already* framework-valid (correct phase/competency/type, canonical objects only, one primary competency, structural independence, never-invent). **Ranking can only reorder valid experiences; it can never select an invalid one, and no weight setting can breach a canonical rule.** Governance implication: tuning weights is an implementation decision (no steward/theory sign-off); the guardrails that bound them are framework and cannot be tuned away (§9, §13.1).

### 6.4 Graceful degradation
No competency (Recovery/Renewal) → phase/task-level experiences; ambiguous situation → primary + acknowledge secondary; no match → default surface + logged content gap.

---

## 7. State model (finding #9)

Three state objects, all referencing canonical object IDs (with versions — §10).

- **Relational Learning Profile™** (**ephemeral — assembled per interaction, session-cached only**, per Layer 4; *not* a durable record): the five-group instructional read-model (Relationship / Framework / Learning / Ecosystem / Personalization context). Assembled at Stage 1 over durable *sources* and progressively completed by Stages 2–3. **Full field-level schema: see `docs/companion-relational-learning-profile-schema.md`.** (Corrects v0.1's "durable" label — the *sources* are durable, the RLP is not.)
- **Session State** (per session): current stage, `FrameworkResolution`, selected `experienceId`, retrieval payload, safety level.
- **Progress/Milestone State** (per learner, durable): completions, milestones, reassessment deltas.

### 7.1 Resume semantics
Multi-step experiences are **resumable**. On entry the engine checks for an **in-progress experience** (the product's "continue where you left off"): if present and still valid (its objects haven't been retired), it resumes at the saved step with the same `FrameworkResolution`; if the underlying objects changed version, it re-validates (Stage 2 confirm mode) before resuming, and re-selects if a dependency was retired. Abandoned sessions expire per a TTL (open param §13).

> Blueprint™/Pathway™ **generation** remains out of scope (DI-010); the engine consumes them.

---

## 8. Performance & scalability (finding #8)

The scalability mandate requires an explicit plan for two hot paths:

- **Selection over ~900 experiences:** do not scan per turn. Index the Experience Registry by `(structuralContext, situationId, phase, competencyId, experienceType, category)`; matching (§6.2 steps 1–4) is an indexed lookup returning a small candidate set; ranking (§6.3) runs over that set only.
- **Retrieval hops:** the Layer-3 chain is nine conceptual steps but, because selection is upstream, retrieval is a **batched fetch** of the selected experience's declared FK objects (one round-trip per repository, parallelizable), not nine sequential dependent queries.
- **Profile caching:** the Relational Learning Profile™ is computed on assessment and cached; selection reads the cache, not a recompute.
- **Precomputation:** for pathway-driven learners, the next 1–3 experiences can be precomputed at Stage 7 and cached for instant delivery.
- **Latency budget (target, tunable):** ≤300 ms to selection, retrieval parallelized; generation/response are the model-bound cost and dominate — so keeping stages 1–4 cheap matters.

---

## 9. Decision rules & guardrails (cross-cutting)
- **DR-002 / Framework Integrity** — never modify/expand theory.
- **DR-004 — safety overrides** (§5).
- **DR-006 — structural independence** — structural context never determines phase/task.
- **DR-008 — one primary developmental objective** per experience.
- **Layer 3 Rule 4 — never invent missing data.**
- **Canonical hierarchy** — on conflict, Theory > Op-Def > implementation; defer upward and **log**, never resolve silently.

---

## 10. Traceability & governance (finding #10)

Every run emits a **reasoning trace**: an ordered record of each stage's decision, referencing object IDs **and their versions** — `structuralContext`, `situationId@ver`, `phase/task`, `competencyId@ver`, `experienceType`, `experienceId@ver`, `workflowId`, `promptIds`, retrieved object IDs@ver, safety level, input mode, and the selection rationale (trigger + matching rule + ranking scores). Versioned IDs make a historical trace **reproducible** even after objects change. Feeds the Governance Log and analytics.

---

## 11. Registry interface matrix (finding #11)

| Stage | Reads | Writes |
|-------|-------|--------|
| 0 Safety | (input) | Session State (safety level); safety event log |
| 1 Context | User, Progress, Assessment repos | Relational Learning Profile™ (cache) |
| 2 Reasoning | Structural Context, Phase, Task, Experience Type registries; `reg_situations`, `reg_situation_framework_map`, Knowledge Objects | Session State (`FrameworkResolution`) |
| 3 Selection | Companion Experience Registry (indexed); Pathway/Recommendation (MKB-16) | Session State (`experienceId`, shortlist) |
| 4 Retrieval | selected experience's FK objects; Lesson/Practice/Reflection/Resource/Competency/BI repos | Session State (`ExperiencePayload`) |
| 5 Generation | Experience Type Registry (flow) | `GeneratedExperience` |
| 6 Response | Prompt Layer Registry (Layer 6), voice | delivered interaction |
| 7 Progress | Follow-ups, Pathway, MKB-16 | Progress/Milestone State; Profile; reasoning trace |

---

## 12. Validation strategy (finding #12)

- **Golden-path cases:** a fixed set of (learner state, event) → expected `FrameworkResolution` + `experienceId`, one per input mode and per trigger, asserted against the reasoning trace.
- **Framework-fidelity assertions (runtime):** every trace must satisfy invariants — exactly one primary competency (or none for R/R); experienceType ∈ the 5; situation ∈ registry; no object referenced that isn't canonical; structural context never used to set phase (DR-006).
- **Safety regression suite:** curated L1/L2/L3 inputs must produce the correct escalation and never run an experience through L2/L3 (authored with the clinical input of §5.3).
- **Degradation cases:** Recovery/Renewal and held-competency (DI-012) situations must resolve to phase/task level and never fabricate.
- **Reproducibility:** replaying a versioned trace yields the same selection.

---

## 13. Open design decisions (owner / engineering)
1. **Ranking weights (§6.3)** — ✅ **ratified by owner 2026-07-20** (0.40/0.30/0.20/0.10); remains runtime-tunable.
2. **Relational Learning Profile™ schema** — ✅ **drafted** (`docs/companion-relational-learning-profile-schema.md`).
3. **Open-question classifier confidence threshold (§3.3).**
4. **Clinical safety trigger taxonomy + jurisdictional resource content (§5.3)** — requires qualified clinical/safety authoring; **not to be invented**.
5. **Blueprint™/Pathway™ generation (DI-010)** — separate workstream; engine degrades gracefully without it.
6. **Session TTL / resume expiry (§7.1); reassessment & milestone triggers.**

---

## 14. Scope boundaries — what the engine does NOT do
- Not a free-form chat agent; every interaction resolves to a structured Experience (open text routed via §3.3).
- Does not diagnose, conduct therapy, or make decisions for the learner (Layer 1 §5–6; Ops §4).
- Does not invent situations, competencies, phases, or theory.
- Does not produce Blueprint™/Pathway™ content (DI-010) — it consumes them.
- Does not author the clinical safety taxonomy (§5.3) or resolve canonical conflicts — it defers upward and logs.

---

## 15. Dependencies summary

| Depends on | Status |
|---|---|
| Companion Experience Registry (the spine) | ✅ complete (~900) |
| Framework / Situation / Competency / lookup registries | ✅ complete |
| Workflow Catalog, Prompt Layers, Decision Rules | ✅ complete |
| Relational Learning Profile™ schema | ✅ drafted (`docs/companion-relational-learning-profile-schema.md`) |
| Selection ranking weights | ✅ ratified 2026-07-20 (0.40/0.30/0.20/0.10; runtime-tunable) |
| Open-question classifier | ◑ mechanism specified; threshold open (§13.3) |
| Clinical safety taxonomy + resource content | ⬜ open — qualified authoring required (§5.3) |
| Blueprint™ / Pathway™ generation | ⬜ open (DI-010) |

The static architecture is complete and the two internal design blockers are cleared — the **Relational Learning Profile™ schema** is drafted and the **ranking weights are ratified**. The engine is now specifiable end-to-end for the core paths. The one remaining hard gate before *public exposure* is the **clinical safety taxonomy and resource content** (§5.3), which must be authored with qualified input and must not be invented; Blueprint™/Pathway™ generation (DI-010) can follow, since the engine degrades gracefully without it.
