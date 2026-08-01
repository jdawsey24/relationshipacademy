# The RLC-FR Revision Process — and how the pending canonical questions map onto it

**What this is.** The Framework Revision Log & Change History (`_import/…Revision Log & Change History.docx`,
Version 1.0) defines a formal process — `RLC-FR-###` revision entries + `Major.Minor` versioning — for any
change to framework canon. The cluster-derivation and intervention-standard work keeps generating changes that
*are* canonical-source changes but have been recorded only as package notes or owner-decision sheets. This note
maps those onto the RLC-FR process so they route correctly. **Records process guidance; changes no canon,
code, or package.**

---

## 1. What the RLC-FR process actually governs

A change gets a formal `RLC-FR-###` number **only** when it materially affects the framework's theoretical
structure, a construct, an operational definition, or its application (Part I, "Criteria for Framework
Revisions"). The relevant criteria for our work:

- **Criterion 1 — new construct** (e.g. *"Addition of a new competency"*). ← the important one.
- **Criterion 2 — modification of an existing construct** (redefining/narrowing a competency's meaning).
- **Criterion 3 — structural change** (re-mapping, altering relationships among constructs).
- **Criterion 6 — retirement of a construct** (removing/consolidating; rationale + replacement documented).

Authoritative source of truth (per the Baseline Statement): the **Theory Framework Manual + Operational
Definitions Manual**. The cluster xlsx/JSON and competency KB are *derived operational artifacts* under that
canon — so a change to them that reflects a canon change should trace back to an RLC-FR entry, not stand alone.

**Not RLC-FR** (explicitly): editorial/typo/formatting/cross-ref fixes, and — critically — **product-layer
decisions that don't touch canon** (Playbook Play design, signature/engine choices, package grades). Those
stay in the artifacts where they already live.

---

## 2. The two live questions, mapped

### Q-A — Cluster 3 "Hidden Thoughts" block (STM-0655–0664) → **RLC-FR if it moves**
The [[cluster-3-partition-ruling]] holds this 10-statement block in quarantine pending an **owner
canonical-mapping ruling**: is it correctly assigned to Cluster 3, or a section-level mis-assignment to
redistribute (candidates 1 / 15 / 21 / 24)?
- **If owner rules KEEP** (the current C3 package assumption, base 56): *no RLC-FR* — the canon is unchanged;
  it's just a partition confirmation.
- **If owner rules MOVE**: that **edits the canonical statement→cluster mapping** = **Criterion 3 (Structural
  revision)** → file an `RLC-FR-###` entry documenting the re-mapping + the two Core-Play absorptions
  (0660/0661) re-examination. The package's OQ-1 resolution should then *cite* that RLC-FR number.

### Q-B — Task-Supporting targets (C1 PE-1; C4 PE-4 / FCQ-C4-02) → **RLC-FR only on graduation**
A Task-Supporting Intervention Target is, by design, *"the framework has no named competency for this, built at
a lower evidence bar with owner approval."* That is **not** a framework revision — no construct is added; it's a
product-layer intervention decision (stays in the intervention-development artifacts).
- **The RLC-FR trigger is graduation:** if a Task-Supporting target ever becomes a **named competency** (because
  repeated evidence warrants promoting it into the framework), *that* is **Criterion 1 (new construct)** → an
  `RLC-FR-###` Major/Structural revision, reviewed against the Theory + Operational Definitions Manuals.
- Until then: C1 PE-1 and C4 FCQ-C4-02 remain Task-Supporting (owner-approved), **no RLC-FR**. This preserves
  the intervention standard's hard rule — *never invent a competency* — by making competency creation possible
  **only** through an approved framework revision.

### (Related) The 17 empty `22_Competency_Details` columns
The [[architecture-workbook]] fill-audit found 17 competency-detail columns at 0%. Filling them is an
**Operational Definitions Manual** authoring task; if any fill *changes a competency's meaning* (not just
documents it), that's **Criterion 2** → RLC-FR. Pure documentation of already-canonical meaning is not.

---

## 3. One-line routing rule

> **Does the change alter framework canon (a construct, its definition, or the canonical mapping)?**
> **Yes →** file an `RLC-FR-###` entry (cite its number in the package). **No →** it stays a product-layer /
> package / owner-decision artifact. Task-Supporting targets are *No* until they graduate to a named competency.

---

## 4. Two doc nits to fix on the next Revision Log edit (owner)
- The **Version History table is still the placeholder "Example"** and disagrees with the entries (FR-002:
  table says v1.1, entry says v1.2). The doc's own release criteria require verified cross-references.
- **FR-005–009 restate Version-1.0 baseline architecture** (six phases / domains / competency architecture) —
  they read as retroactive *founding* entries, not post-1.0 changes. Fine to keep; just not "changes since 1.0."

*Sources: the Revision Log (Part I criteria + Part II entries), verified 2026-07-29; the C3 partition ruling
and the C4 reconciliation note in this directory. No canon, code, or package modified.*
