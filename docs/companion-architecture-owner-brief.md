# Relationship Companion™ Architecture Workbook — Owner Decision Brief

**Date:** 2026-07-20
**From:** Systems Architect
**Re:** Data Integrity findings requiring owner / steward action
**Artifact:** `data/companion-architecture/Relationship_Companion_Architecture_Workbook_v2_POPULATED.xlsx` (16 sheets, v2.0.0)

---

## Where the workbook stands

The architecture workbook is a complete, canonically-sourced operational architecture. Every registry is populated from the manuals in authority order (Theory → Operational Definitions → Assessment Master → MKB v2.1 → Prompt Architecture → Situation Registry), with permanent IDs, versions, statuses, relationships, ownership, and source attribution. Foreign keys resolve cleanly across all sheets.

**Six of ten Data Integrity findings are closed or fully populated:**

| ID | Finding | Status |
|----|---------|--------|
| DI-001 | Behavioral indicators → RLC Assessment Master (04A) | ✅ Resolved |
| DI-002 | Curriculum (lessons/practices/reflections/resources) → MKB v2.1 | ✅ Resolved |
| DI-003 | Companion Experience internals populated from Experience Types + MKB-16 | ✅ Populated |
| DI-004 | Prompt architecture — 6-layer registry + Appendix B spec schema | ✅ Populated |
| DI-008 | Workflow Registry → canonical Appendix E catalog (24 workflows) | ✅ Resolved |
| DI-009 | "Practice" duplication — referenced by ID, not text | ✅ Resolved |

**The four below cannot be closed inside the workbook.** Each needs a decision or action upstream — a manual correction, new framework content, steward input, or an engine that doesn't exist yet.

---

## Decisions needed from you

### DI-005 — Correct "Investment" → "Intentional Investment" in the Operations Manual
**What:** The Operational Definitions Manual §3.2 names the Exclusivity developmental task as **"Investment."** The Theory Manual, MKB v2.1, and the live registry all use **"Intentional Investment."**
**Status of decision:** You have already ruled that **"Intentional Investment"** is canonical.
**Action required:** A documentation edit — update Op-Def §3.2 to "Intentional Investment" and version-bump the manual so the two canonical documents agree.
**Owner:** You (or the Op-Def manual maintainer).
**Effort:** Minutes. **Recommendation:** Make the edit; this removes the only remaining wording conflict between canonical documents.

### DI-006 — Recovery & Renewal have no competency architecture
**What:** MKB v2.1 defines competencies for only the first four phases (Exploration, Exclusivity, Expansion, Expiration). **Recovery** (task: Healing) and **Renewal** (task: Reengagement) have **zero** competencies and no phase codes. As a result, **16 situations** that belong to those phases are mapped only to phase + developmental task and are held in Draft — they cannot resolve a competency because none exist.
**This is a framework gap, not a data error.** Per your standing rule, I did not invent competencies for these phases.
**Decision required:** Choose one —
  - **(a)** Commission a competency architecture for Recovery & Renewal (a real authoring project: define competencies, behavioral indicators, lessons, practices for two phases), then I integrate and unblock the 16 situations; **or**
  - **(b)** Formally scope the Companion's competency-level guidance to the first four phases for launch, and keep Recovery/Renewal situations at the phase/task level (still useful, just not competency-mapped).
**Owner:** You + framework author. **Recommendation:** (b) for launch, (a) as a funded follow-on — it keeps the product shippable without inventing framework.

### DI-007 — Nine held situation → competency mappings await steward review
**What:** Nine situations have competency mappings I flagged as needing framework-steward confirmation before publishing:
`RS-0020, RS-0023, RS-0027, RS-0040, RS-0047, RS-0048, RS-0050, RS-0051, RS-0054`.
They are valid at the phase/task level but their specific competency assignment was borderline. They remain in Draft.
**Action required:** The framework steward reviews the nine (the Competency Mapping Review Workbook is already generated), approves or corrects each; I then re-seed and publish.
**Owner:** Framework steward. **Recommendation:** Route the review workbook to the steward; this is a small, bounded review that unblocks nine more published situations.

### DI-010 — Blueprint / Pathway / Progress generation specs don't exist yet
**What:** The Relationship Blueprint™, Developmental Pathway™, and Progress repositories are **runtime-generated per learner** — there is no canonical document defining their generation logic (inputs → output structure). The workbook models them as repositories with the right relationships, but their internal generation rules are blank because no source defines them.
**Action required:** Author generation specifications when those engines are built. The starting inputs already exist — Assessment Master's recommendation mappings (08) and the MKB-16 recommendation rules feed the Blueprint/Pathway logic.
**Owner:** You + engineering, at roadmap time. **Recommendation:** Defer until Blueprint/Pathway is scheduled; no action needed now.

---

## Summary of asks

| Finding | Your decision | Who executes | Blocks launch? |
|---------|---------------|--------------|----------------|
| DI-005 | Approve the wording fix (already ruled) | Op-Def maintainer | No |
| DI-006 | Choose (a) build R/R competencies or (b) scope to 4 phases | You + author | Only R/R depth |
| DI-007 | Send review workbook to steward | Framework steward | 9 situations |
| DI-010 | Defer to engine roadmap | You + engineering | No |

Nothing here blocks the core Companion from launching on the first four phases. DI-005 and DI-007 are quick wins; DI-006 is the one genuine scope decision.
