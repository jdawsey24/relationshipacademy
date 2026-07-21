# Relationship Blueprint™ · Developmental Pathway™ · Progress — Generation Specification (v0.1 Draft)

**Reference:** Data Integrity finding DI-010
**Date:** 2026-07-20
**Author:** Systems Architect
**Status:** Draft for owner review — implementation specification (not framework theory)
**Canonical sources:** Prompt Architecture Manual Layer 4 (Blueprint™/RPI) + Layer 5 (Experience Series™ / progression); RLC Assessment Master (07 Interpretation, 08 Recommendation Mappings, 09 Results Templates); MKB v2.1 16 Recommendation Rules; Relational Learning Profile™ schema; Reasoning Engine Spec §6

---

## 0. Authority & scope

This specifies how three **runtime-generated** learner objects are produced. Unlike the framework/clinical briefs, this is **implementation architecture** — it can be authored here because it *consumes* canonical objects and never creates framework content:

- It **does not** invent competencies, phases, tasks, or interpretation logic (those are canonical — Framework, Assessment Master, MKB-16).
- It **does** define how existing canonical mappings are assembled, per learner, into a Blueprint, a Pathway, and Progress.

The three objects form a pipeline, each consuming the prior:

```
Assessment (Snapshot / Profile / RPI)
        ↓  interpretation + recommendation mappings (Assessment Master 07/08; MKB-16)
Relationship Blueprint™   — the developmental roadmap (what to grow, in priority order)
        ↓  Experience Series™ assembly (Layer 5)
Developmental Pathway™    — the sequenced learning plan (which experiences, in what order)
        ↓  delivery (Reasoning Engine) + completion
Progress                  — tracking, milestones, reassessment deltas
        ↺  reassessment → Blueprint/Pathway revision (WFL-403 / WFL-404)
```

**Guardrail throughout (Layer 3 Rule 4 / Layer 4):** never invent missing data; canonical framework mappings are immutable; personalization adapts *delivery and sequencing*, never theory. Where inputs are incomplete (e.g. no RPI, or Recovery/Renewal has no competencies per DI-006), each object **degrades gracefully** to what canonical data supports — it never fabricates a priority, competency, or step.

---

## 1. Relationship Blueprint™ — generation spec

**Definition (Layer 4):** the learner's *personalized developmental roadmap* — used to recommend next experiences, reinforce current priorities, and connect daily learning to broader developmental goals.

### 1.1 Inputs
- Structural context + validated phase/task placement (from assessment; RLP Framework Context).
- **RPI / Profile results** — per-competency bands (strength vs. growth) and priorities (Assessment Master interpretation, sheet 07).
- Assessment **Recommendation Mappings** (sheet 08) + **MKB-16** rules, keyed by competency, phase, and structural context, with suppression conditions.
- Companion history (already-developed competencies) — to avoid redundant priorities.

### 1.2 Generation logic
1. Take the learner's **current phase** → the set of **canonical competencies** for that phase (framework, immutable).
2. Classify each competency by the RPI band → **strengths** vs. **growth priorities**.
3. Rank growth priorities using the assessment **Priority** field (08) + RPI severity; apply **suppression conditions** (never recommend against safety, consent, or structural context — sheet 08).
4. Produce the narrative via prompt **BLU-001**, rendered through the **Results Template** structure (sheet 09: Where You Are → How You're Developing → What's Working → Growth Opportunity → Next Steps).

*Canonical vs. generated:* the phase→competency mapping and interpretation rules are **canonical**; the per-learner ranking, selection, and narrative are **generated**. No competency is created.

### 1.3 Output structure (`companion_blueprints`)
```jsonc
{
  "blueprint_id": "...", "learner_ref": "...", "version": 1, "generated_at": "...",
  "structural_context": "Dating",
  "phase": "PH-001", "developmental_task": "DT-001",
  "strengths": [{ "competency_id": "COM-EXPL-002", "band": "strength" }],
  "growth_priorities": [                                   // ranked
    { "competency_id": "COM-EXPL-006", "priority": 1, "rationale_ref": "MAP-...", "source": "RPI" }
  ],
  "developmental_goals": ["...narrative, BLU-001..."],
  "provenance": { "<field>": "<mapping id / rule id / version>" },  // traceability
  "degraded": false                                       // true if generated without RPI
}
```
- **Degradation:** no RPI → Blueprint built from Snapshot-level phase placement only (strengths/priorities coarser, `degraded: true`). Recovery/Renewal (no competencies, DI-006) → Blueprint operates at **phase/task level**; `growth_priorities` empty, narrative frames the developmental task without competency detail.

---

## 2. Developmental Pathway™ — generation spec

**Definition (Layer 5, Experience Series™):** an ordered educational progression — "a logical educational progression" of experiences toward the Blueprint's priorities.

### 2.1 Inputs
- The Blueprint's **ranked growth priorities**.
- The **Companion Experience Registry** (the ~897 experiences, keyed by competency + type).
- **MKB-16** recommendation rules (competency → INT/PRA/ACT outputs).
- RLP (completed experiences, difficulty tolerance).

### 2.2 Generation logic
1. For each priority competency (in Blueprint order), assemble its **experience arc** from the Registry: *Learn (Education) → Develop (Competency Development) → Practice → Reflect* — the canonical progression per competency.
2. **Sequence across competencies** by Blueprint priority, then within the learner's readiness using the **ratified selection weights** (Reasoning Engine §6.3: pathway 0.40 / growth 0.30 / difficulty 0.20 / recency 0.10) — here applied to *ordering*, not just next-pick.
3. Drop steps whose experiences the learner already completed (continuity, Layer 4); respect suppression conditions.
4. Emit an ordered **Experience Series™** — the Pathway.

### 2.3 Output structure (`companion_pathways` + `companion_pathway_steps`)
```jsonc
{
  "pathway_id": "...", "blueprint_id": "...", "learner_ref": "...", "version": 1, "generated_at": "...",
  "steps": [                                              // ordered
    { "step": 1, "experience_id": "CEX-EDU-COM-EXPL-006", "competency_id": "COM-EXPL-006",
      "type": "Education", "status": "pending", "rationale": "top growth priority" },
    { "step": 2, "experience_id": "CEX-DEV-COM-EXPL-006", "competency_id": "COM-EXPL-006",
      "type": "Competency Development", "status": "pending" }
  ],
  "horizon": 8,                                           // steps ahead maintained (open param §6)
  "degraded": false
}
```
- **`next_step`** = the first `pending` step — this is what the Reasoning Engine's **pathway-driven trigger** (§6.1 #4) consumes.
- **Degradation:** thin/empty Blueprint priorities → shorter pathway from whatever canonical experiences exist; Recovery/Renewal → phase-level experiences (Milestones, Life Transitions, phase education) rather than competency arcs. Never a fabricated step.

### 2.4 Revision (WFL-404)
On reassessment (or a completed arc), re-rank the Blueprint and **regenerate the pathway tail** (keep completed steps; re-derive pending ones). Versioned; the delta is logged to Progress.

---

## 3. Progress — generation / tracking spec

**Definition:** the learner's standing against their Pathway, plus milestones and reassessment deltas (Progress workflows WFL-401/402).

### 3.1 Inputs
- Pathway step completions (from the Reasoning Engine Stage 7).
- Milestone signals (phase-level; `CEX-MIL-*` experiences).
- Reassessment results (band deltas vs. the prior Blueprint).

### 3.2 Logic
- Mark steps complete as experiences finish; compute **pathway completion %** and **per-competency progress**.
- Detect **milestones** (competency arc completed; phase progression) → surface a Celebrate experience (WFL-402).
- Track **reassessment deltas** (growth priority band improved) → feed Blueprint revision.
- Enforce **reassessment cadence** (open param §6) → trigger WFL-104.

### 3.3 Output structure (`companion_progress`)
```jsonc
{
  "learner_ref": "...", "pathway_id": "...",
  "completed_steps": ["..."], "completion_pct": 0.25,
  "competency_progress": [{ "competency_id": "COM-EXPL-006", "arc_complete": false }],
  "milestones": [{ "type": "arc_complete", "competency_id": "...", "at": "..." }],
  "reassessment_deltas": [{ "competency_id": "...", "from": "growth", "to": "strength", "at": "..." }]
}
```

---

## 4. The generation pipeline (end-to-end)

| Trigger | Workflow / prompt | Produces |
|---------|-------------------|----------|
| Assessment completed | WFL-103 → **BLU-001** (WFL-403 for updates) | Blueprint |
| Blueprint generated/updated | WFL-303/404 → **PTH-001** | Pathway |
| Experience completed | Reasoning Engine Stage 7 | Progress update; maybe milestone |
| Reassessment | WFL-104 → WFL-403/404 | Blueprint + Pathway revision |

All three are **durable stores** — they are exactly the *sources* the ephemeral RLP reads (RLP schema §2.4 `blueprint_ref` / `pathway_ref`; §8 mapping). This spec fills the two `⬜ open (DI-010)` rows in the RLP schema's source table.

---

## 5. Integration points

- **RLP (Ecosystem Context):** `blueprint_ref`, `pathway_ref` + `next_step` now resolve.
- **Reasoning Engine:** the **pathway-driven trigger** (§6.1 #4) reads `pathway.next_step`; **Stage 7** writes Progress and requests the next pathway step. The engine already degrades gracefully when these are absent, so Blueprint/Pathway can ship *after* the core engine.
- **Experience Registry:** the Pathway is composed entirely of existing `experience_id`s — no new experiences needed.
- **Traceability:** Blueprint/Pathway/Progress each carry `provenance` (mapping/rule/version IDs), so a learner's roadmap is fully traceable to canonical objects and reproducible.

## 6. Open design decisions

1. **RPI band → priority mapping** — the exact derivation of growth priority from RPI results (shared open item with RLP schema §9.1; owned with the assessment team).
2. **Pathway horizon** — how many steps ahead to maintain/precompute (default suggestion: one full arc + next competency's Education step).
3. **Reassessment cadence** — what interval / completion count triggers WFL-104 (product decision).
4. **Milestone definitions** — which events count as milestones (arc complete, phase progression, streak) and which surface a Celebrate experience.
5. **Dependency: Assessment Master sheet 08 mappings are currently `Draft`/`TBD`** ("populate from the Knowledge Base after scoring rules are approved"). Blueprint/Pathway generation *consumes* these — until they're authored, generation runs in the degraded (Snapshot-level) mode. This is an assessment-team dependency, not a blocker for the spec.

## 7. What's canonical vs. generated vs. open

| | Owner |
|---|---|
| Phase→competency mappings, interpretation rules, recommendation mappings, MKB-16 | **Canonical** (framework / assessment / MKB — not authored here) |
| Per-learner ranking, sequencing, narrative assembly, progress computation | **Generated** (this spec) |
| RPI→priority mapping, cadence, horizon, milestones | **Open** (§6 — owner/assessment decisions) |
| Recovery/Renewal competency-level depth | **Blocked on DI-006** (degrades to phase/task until authored) |

---

### Summary
The Blueprint™, Developmental Pathway™, and Progress objects are **runtime read-models assembled over canonical mappings** — the same discipline as the RLP: consume canonical, never invent, degrade gracefully. This spec defines their inputs, generation logic, output schemas, durable stores, and integration with the Reasoning Engine and RLP, closing DI-010 at the specification level. Implementation waits only on the §6 product decisions and the assessment team completing the sheet-08 recommendation mappings; nothing here requires framework or clinical authoring.
