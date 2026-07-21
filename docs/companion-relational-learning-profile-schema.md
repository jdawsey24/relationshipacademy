# Relational Learning Profile™ (RLP) — Schema Specification (v0.1 Draft)

**Reference:** Reasoning Engine Spec §7 / §13.2 (DI-011 build blocker)
**Date:** 2026-07-20
**Author:** Systems Architect
**Status:** Draft for owner review — specification only
**Canonical source:** Prompt Architecture Manual, **Layer 4 — Personalization Layer** ("Relational Learning Profile™" + "Components" + "Views" + "Personalization Rules")

---

## 0. What the RLP is (and is not)

The RLP is the **instructional bridge** between a learner's current context and the Companion's experience generation. Per Layer 4, it is:

- **Assembled fresh for the current interaction** — a *temporary, dynamic instructional profile*, **not a durable record**.
- Explicitly **not** an assessment, a diagnosis, a personality profile, or a permanent record.

> **Correction to Reasoning Engine Spec v0.2 §7:** that section labeled the RLP "per learner, durable." Per Layer 4 the RLP is **ephemeral** — the *sources* are durable, the RLP is **assembled per interaction** (and may be cached for the session only). §7 should be updated to match this schema. This document is the authority for the RLP's shape.

**Cardinal rule (Layer 4):** the framework is never personalized. The RLP influences *how* concepts are explained, which examples/experiences are chosen, and how learning is sequenced — **never** the phases, tasks, competencies, domains, definitions, or objectives themselves.

---

## 1. The model: durable sources → ephemeral RLP → two views

```
DURABLE SOURCES (persisted)                     EPHEMERAL RLP (per interaction)        VIEWS
────────────────────────────                    ──────────────────────────────        ──────────────
companion_profiles (structural context) ─┐
Snapshot / RPI / Profile results ─────────┤
Relationship Blueprint™ / Pathway™ ───────┼──►  assembled at Engine Stage 1  ──►  Internal RLP  (reasoning)
Companion history (experiences/reflections)┤     + populated by Stages 2–3          Learner View  (display)
Academy progress ─────────────────────────┤
User preferences / accessibility ─────────┘
```

The RLP has **five component groups** (Layer 4, verbatim structure) and exists in **two views**: an **Internal RLP** (full structured object used for reasoning) and a **Learner View** (a supportive translation shown to the learner).

---

## 2. Component schema (the five canonical groups)

Types: `enum` values reference the workbook's lookup registries; `id`/`id[]` reference canonical object IDs; every derived field carries a `confidence` (0–1) and may be `null` (see §5 Minimize Assumptions). "Filled by" = which Engine stage populates it.

### 2.1 Relationship Context
| Field | Type | Source | Required | Filled by |
|-------|------|--------|----------|-----------|
| `relationship_status` | enum(Structural Context Registry: Single…Separation) | `companion_profiles.current_status_id` → `structural_statuses.key` | yes | Stage 1 |
| `structural_history` | `{status, from, to}[]` (when applicable) | profile status history | no | Stage 1 |
| `current_situation_id` | id(`reg_situations`) \| null | trigger (confirm) or classifier (§3.3) | when situation-scoped | Stage 2 |

### 2.2 Framework Context — *canonical, never personalized* (this is the `FrameworkResolution`)
| Field | Type | Source | Required | Filled by |
|-------|------|--------|----------|-----------|
| `current_phase` | id(Phase Registry PH-###) | `reg_situation_framework_map` / reasoning | yes | Stage 2 |
| `developmental_task` | id(Developmental Task Registry DT-###) | framework map | yes | Stage 2 |
| `developmental_objective` | text (canonical) | Phase/Task definition | yes | Stage 2 |
| `primary_competency_id` | id(competency) \| null | framework map (null for Recovery/Renewal) | no | Stage 2 |
| `supporting_competency_ids` | id[] | reasoning (enhance only) | no | Stage 2 |
| `educational_objective` | text = selected experience's Learner Outcome | Experience Registry | yes | Stage 3 |

> These fields are **read from canonical objects, never invented or altered**. Personalization does not touch this group.

### 2.3 Learning Context
| Field | Type | Source | Filled by |
|-------|------|--------|-----------|
| `recommended_experience_type` | enum(Experience Type Registry ET-###) | situation `primary_experience_type_id` (confirm) or reasoning Step 6 | Stage 2/3 |
| `current_learning_priorities` | id(competency)[] | RPI flagged-growth + Pathway™ | Stage 1/3 |
| `recommended_practices` | id(practice)[] | MKB-16 rules for the priority competency | Stage 3 |
| `suggested_resources` | id(resource)[] | Resource Repository via MKB-16 | Stage 3 |

### 2.4 Ecosystem Context (from durable sources)
| Field | Type | Source | Filled by |
|-------|------|--------|-----------|
| `snapshot_insights` | `{ref, summary, at}` | Relationship Snapshot™ | Stage 1 |
| `rpi_results` | `{competency_id, band, priority}[]` | Relational Profile Inventory | Stage 1 |
| `blueprint_ref` | ref(Blueprint™) \| null | Relationship Blueprint™ (DI-010) | Stage 1 |
| `pathway_ref` | ref(Pathway™) + `next_step` \| null | Developmental Pathway™ (DI-010) | Stage 1 |
| `companion_history` | `{completed_experiences, reflections, practices, situations_explored}` | Companion history | Stage 1 |
| `academy_progress` | `{completed_lessons, active_courses, milestones}` | Relationship Academy™ | Stage 1 |

### 2.5 Personalization Context — *influences presentation only*
| Field | Type | Source | Filled by |
|-------|------|--------|-----------|
| `conversation_history` | recent turns (bounded) | session/history | Stage 1 |
| `user_preferences` | `{communication_style, activity_length, learning_preferences}` | User Preferences | Stage 1 |
| `accessibility_settings` | `{...}` | preferences | Stage 1 |
| `session_context` | ref(Session State) | current session | Stage 1 |

---

## 3. The two views (Layer 4)

### 3.1 Internal RLP (reasoning only — never displayed)
The complete structured object below. May include framework mappings, repository references, prompt metadata, educational objectives, competency identifiers, experience identifiers, system metadata, and **confidence values**.

```jsonc
{
  "rlp_version": "0.1",
  "assembled_at": "<timestamp>",          // ephemeral; interaction-scoped
  "learner_ref": "<opaque user ref>",     // not PII; see §7
  "input_mode": "confirm | derive | open-question",
  "relationship_context": {
    "relationship_status": "Dating",
    "structural_history": [],
    "current_situation_id": "RS-0027"
  },
  "framework_context": {                   // canonical — never personalized
    "current_phase": "PH-001",
    "developmental_task": "DT-001",
    "developmental_objective": "…",
    "primary_competency_id": "COM-EXPL-006",
    "supporting_competency_ids": [],
    "educational_objective": "…"           // = selected experience Learner Outcome
  },
  "learning_context": {
    "recommended_experience_type": "ET-002",
    "current_learning_priorities": ["COM-EXPL-006"],
    "recommended_practices": ["PRA-000xxx"],
    "suggested_resources": []
  },
  "ecosystem_context": {
    "snapshot_insights": { "ref": "…", "summary": "…", "at": "…" },
    "rpi_results": [{ "competency_id": "COM-EXPL-006", "band": "growth", "priority": 1 }],
    "blueprint_ref": null,
    "pathway_ref": null,
    "companion_history": { "completed_experiences": ["CEX-…"], "situations_explored": ["RS-…"] },
    "academy_progress": { "completed_lessons": [], "active_courses": [], "milestones": [] }
  },
  "personalization_context": {
    "user_preferences": { "communication_style": "warm", "activity_length": "short" },
    "accessibility_settings": {},
    "conversation_history_ref": "…",
    "session_context": "…"
  },
  "confidence": { "relationship_status": 1.0, "current_situation_id": 0.82, "rpi_results": 0.6 },
  "provenance": { "<field>": "<source id/version>" }   // traceability §10 of engine spec
}
```

### 3.2 Learner View (display — supportive translation)
Never exposes framework architecture. Answers five questions (Layer 4):

| View heading | Sourced from | Example |
|--------------|--------------|---------|
| **Your Current Situation** | `current_situation_id` title | "You're noticing you're more invested than they are." |
| **Today's Focus** | `primary_competency_id` (learner-facing name) | "Reciprocity — mutual give-and-take." |
| **Why It Matters** | competency/phase rationale | "In early dating, noticing balance helps you invest wisely." |
| **What You'll Learn** | `educational_objective` | "How to recognize and talk about investment balance." |
| **Suggested Next Step** | Stage 7 follow-up | "A short reflection on where your energy is going." |

Prioritizes clarity, encouragement, practical application. Where a field is low-confidence, the Learner View **acknowledges uncertainty** rather than asserting (Rule 5, §5).

---

## 4. Assembly (Engine Stage 1)

1. Resolve `relationship_status` from `companion_profiles` (durable). Required; if absent → onboarding.
2. Pull Ecosystem Context from durable sources (Snapshot, RPI, Blueprint/Pathway, history, Academy) — each optional, each with availability/confidence.
3. Pull Personalization Context (preferences, accessibility, session).
4. Leave Framework + Learning Context empty — they are filled by Stage 2 (reasoning) and Stage 3 (selection).
5. Cache the assembled RLP **for the session only**; discard/expire after (§6).

Framework and Learning Context are populated downstream because they depend on reasoning and selection — the RLP is progressively completed across Stages 1→3, then consumed by Stages 4–6.

---

## 5. Personalization rules as invariants (Layer 4)

1. **Framework First** — framework fidelity outranks personalization; the `framework_context` group is immutable canonical data.
2. **Personalize Delivery, Not Theory** — personalization may touch only Learning/Personalization presentation; never Framework Context.
3. **Preserve Learner Autonomy** — no life decisions for the learner (Ops §4; Engine §5).
4. **Build Continuity** — use `companion_history` to avoid repetition and build on prior learning.
5. **Minimize Assumptions** — when data is incomplete, **acknowledge uncertainty** (low `confidence`, Learner-View hedging), never fabricate (Layer 3 Rule 4). This is why every derived field carries a `confidence` and may be `null`.

---

## 6. Lifecycle & persistence

- **Ephemeral:** the RLP object is assembled per interaction and cached **session-scoped only**; it is not a permanent record (Layer 4).
- **Durable stores** (the sources) persist: `companion_profiles`, assessment results, Blueprint/Pathway, Companion history, Academy progress, preferences.
- **Recompute triggers:** a new assessment, a structural-context change, or a completed experience invalidates the cached RLP for the next interaction.
- **TTL:** session-bound; expires with the session (exact TTL is an open param, Engine §13.6).

---

## 7. Privacy

Consistent with the Companion's privacy-first posture: the RLP is **instructional, not a personality profile or permanent record**. It references a learner by an **opaque ref**, carries the minimum context needed for the current experience, is **not cached durably**, and is never used to compile a cross-session behavioral dossier. The Internal RLP is never displayed; only the Learner View is shown.

---

## 8. Mapping to existing platform tables

| RLP source | Existing store | Status |
|------------|----------------|--------|
| `relationship_status` | `companion_profiles.current_status_id` → `structural_statuses` | ✅ exists |
| `companion_history` | `companion_experiences`, journey/drafts | ✅ exists (extendable) |
| `snapshot_insights` / `rpi_results` | Snapshot / Assessment results | ✅ Snapshot exists; RPI mapping to define |
| `blueprint_ref` / `pathway_ref` | Blueprint™ / Pathway™ | ⬜ generation open (DI-010) |
| `academy_progress` | Academy module | ✅ exists (link to define) |
| `user_preferences` / `accessibility_settings` | preferences store | ◑ partial; fields to confirm |

No new *durable* store is strictly required to begin; the RLP is a **read-model assembled over existing tables**, extended as Blueprint/Pathway/RPI mature.

---

## 9. Open items
1. **RPI → `rpi_results` mapping** — exact band/priority derivation from the Relational Profile Inventory.
2. **Preferences field set** — confirm the concrete `user_preferences` / `accessibility_settings` fields the product supports.
3. **Confidence model** — how each derived field's confidence is computed (esp. the open-question classifier match, Engine §3.3).
4. **Blueprint/Pathway refs** — depend on DI-010 generation specs.
5. **Session TTL** — shared with Engine §13.6.

---

## 10. Summary

The RLP schema is fully specifiable **today** — it is the Layer 4 component structure, formalized as a five-group read-model assembled per interaction over existing durable sources, with two views and five invariants. It unblocks the Reasoning Engine's Stage 1. The only fields that wait on other workstreams are the Blueprint/Pathway refs (DI-010) and the exact RPI mapping — both optional, both degrading gracefully (Rule 5). Recommend updating Engine Spec §7 to reference this document and correct the ephemeral-vs-durable point.
