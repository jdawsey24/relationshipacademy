# Relationship Companion™ — Recommendations for the Next Phase

**Date:** 2026-07-20
**From:** Systems Architect
**Companion workbook:** v3.0.0 (`Relationship_Companion_Architecture_Workbook_v2_POPULATED.xlsx`, 23 sheets)

The architecture is now **object-complete and experience-first**: every capability, workflow, prompt, repository, and knowledge object exists to serve one or more of ~900 systematically-derived guided experiences. The static architecture is finished. What remains is the *runtime*, the *launch curation*, and the *content*. Recommendations, in priority order.

---

## 1. Author the Reasoning Engine specification (DI-011) — the critical path

This is the single most important next workstream. The workbook defines **what** the Companion knows and **which** experiences it can run, but not **how** it decides — at runtime — which experience to select, in what order, for a given learner and moment.

The Prompt Architecture Manual already gives the raw material: the 6 reasoning layers (Constitution → Framework Reasoning → Retrieval → Personalization → Experience Generation → Response) and the 6-step Canonical Reasoning Sequence. The Reasoning Engine spec turns those into an executable orchestration: **learner event → experience selection → context resolution → knowledge retrieval → experience generation → response → progress update → next experience.**

Recommend a dedicated spec document (not a code sprint yet) that defines the selection logic, state model, and transition rules against the now-stable registries.

## 2. Curate the launch experience subset

~900 experiences is the *complete* catalog, deliberately. It is not the v1 product. Recommend selecting a launch subset:

- All Onboarding (4) + Assessment (6) + Recommendations (4) + Progress (6).
- The 60 registry Special-Situation / Milestone experiences (already authored and mostly published).
- A starter Education + Competency-Development set for the **first four phases** (defer Recovery/Renewal per DI-006).
- A curated handful of Practices and Reflections per competency rather than all 333/222.

Everything else stays in the catalog as `Planned`, ready to activate. This keeps launch focused while preserving the complete architecture.

## 3. Close the framework-authoring items

- **DI-012 (3 held situations):** return RS-0020, RS-0027, RS-0048 to the steward with the same-phase options already listed; small, bounded.
- **DI-006 (Recovery & Renewal competencies):** fund this as a real framework-authoring project (competencies → behavioral indicators → lessons → practices for two phases). Until then, these phases run at phase/task level, as ruled.
- **DI-005 (Op-Def §3.2 wording):** apply the "Intentional Investment" correction to the source manual.

## 4. Normalize before building the runtime (AV-012)

The Experience Registry carries multi-valued link columns (Lessons/Practices/Reflections/KOs). Before wiring a runtime over ~900 experiences, promote these to **junction tables** — `Experience↔KnowledgeObject`, `↔Lesson`, `↔Practice`, `↔Reflection` — so selection queries stay fast and the links stay deduplicated. This is the natural shape when the workbook becomes Supabase tables.

## 5. Specify, then build, the Blueprint / Pathway / Progress engines (DI-010)

These are conceptually defined; they need runtime generation specs (inputs → output structure). The inputs already exist — Assessment Master 08 (recommendation mappings) and MKB-16 recommendation rules feed Blueprint → Pathway. Spec first, implement when scheduled.

## 6. Content authoring pass

The experiences reference lessons, practices, and reflections that exist as governed **objects** but still need final learner-facing **content** (the placeholder gap already tracked for the Companion). Prioritize the launch-subset objects from #2.

## 7. Operationalize the workbook as the source database

Adopt the workbook as the canonical operational DB: generate Supabase tables from each sheet (IDs → primary keys, link columns → foreign keys / junctions), governed by the Studio-style spine already in the platform (immutable versions, append-only reviews, owner-only publish). This makes the architecture live and traceable rather than a static file.

---

## Sequencing

```
Now ─────────────► Reasoning Engine spec (1)  ─┐
                   Launch curation (2)          ├─► v1 build
                   Normalize to junctions (4)   ─┘
Parallel: steward items (3), content pass (6)
Later:    Recovery/Renewal competencies (3), Blueprint/Pathway engines (5), DB operationalization (7)
```

The reframing holds throughout: optimize every decision for **educational coherence, scalability, and traceability** — the Companion is a guided educational experience platform, and the Experience Registry is its spine.
