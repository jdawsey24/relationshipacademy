# Competency Details — Fill Audit & Source Reconciliation

**What this is.** A column-by-column fill audit of the `22_Competency_Details` sheet, plus a reconciliation of the workbook snapshot against the live JSON knowledge base. Purpose: tell the framework steward exactly which competency fields still need authoring, and settle "which source is current" before Cluster 2 derives competency content.

**Sources (read-only; nothing modified by this audit):**
- Workbook: `_import/RLC_Master_Knowledge_Base_v2.1.xlsx` → sheet `22_Competency_Details`.
- Live JSON KB: `_import/json/kb_competencies.json` (canonical export).
- Scoped extract: `artifacts/intervention-coverage/generated/kb_defs.json` (20 Discernment-relevant competencies).

---

## 1. Headline

`22_Competency_Details` = **111 competencies × 62 columns**, **~73% overall fill**. The fill is **binary, not partial**:

- **45 columns are 100% filled** (all 111 rows).
- **17 columns are 0% filled** (0/111).
- **0 columns are partially filled.**

This is a deliberate export gap — 17 fields were never authored — not messy/incomplete data.

---

## 2. The 17 columns needing authoring (grouped)

| Group | Empty columns (each 0/111) |
|---|---|
| **Proficiency continuum (5)** | Continuum — Emerging · Developing · Competent · Advanced · Mastery |
| **Report suitability (3)** | Self-Report Suitability · Partner-Report Suitability · Clinician-Observation Suitability |
| **Safety / clinical (4)** | Contraindications · Cautions · Suppression or Safety Logic · Escalation Logic |
| **Consumer / delivery (3)** | Consumer Translation · Reading Level · Public or Clinical Boundary |
| **Adaptivity + governance (2)** | Structural Context Sensitivity · Reviewer |

---

## 3. Full 62-column fill table

`✅` = 100% (111/111) · `⬜` = 0% (0/111).

| # | Column | Fill |
|---|---|---|
| 1 | Detail ID | ✅ |
| 2 | Competency ID | ✅ |
| 3 | Competency Name | ✅ |
| 4 | Domain ID | ✅ |
| 5 | Domain | ✅ |
| 6 | Phase | ✅ |
| 7 | Developmental Task | ✅ |
| 8 | Definition | ✅ |
| 9 | Purpose | ✅ |
| 10 | Developmental Significance | ✅ |
| 11 | Behavioral Indicator IDs | ✅ |
| 12 | Incomplete Indicator IDs | ✅ |
| 13 | Observable Expressions | ✅ |
| 14 | Common Facets or Dimensions | ✅ |
| 15 | Related Competency IDs | ✅ |
| 16 | Developmental Dependencies | ✅ |
| 17 | Expected Developmental Application | ✅ |
| 18 | Recommended Intervention IDs | ✅ |
| 19 | Recommended Practice IDs | ✅ |
| 20 | Linked Activity IDs | ✅ |
| 21 | Common Developmental Enhancements | ✅ |
| 22 | Common Developmental Barriers | ✅ |
| 23 | Assessment Intent | ✅ |
| 24 | Item Writing Considerations | ✅ |
| 25 | Interpretation Notes | ✅ |
| 26 | Clinical Applications | ✅ |
| 27 | Educational Applications | ✅ |
| 28 | Coaching Considerations | ✅ |
| 29 | Facilitation Notes | ✅ |
| 30 | Linked Worksheet IDs | ✅ |
| 31 | Linked Conversation Guide IDs | ✅ |
| 32 | Linked Journal Prompt IDs | ✅ |
| 33 | Linked Video IDs | ✅ |
| 34 | Linked Lesson IDs | ✅ |
| 35 | Version | ✅ |
| 36 | Author | ✅ |
| 37 | Date Created | ✅ |
| 38 | Last Revised | ✅ |
| 39 | Status | ✅ |
| 40 | **Reviewer** | ⬜ |
| 41 | Decision Log Reference | ✅ |
| 42 | Operational Notes | ✅ |
| 43 | **Continuum - Emerging** | ⬜ |
| 44 | **Continuum - Developing** | ⬜ |
| 45 | **Continuum - Competent** | ⬜ |
| 46 | **Continuum - Advanced** | ⬜ |
| 47 | **Continuum - Mastery** | ⬜ |
| 48 | **Self Report Suitability** | ⬜ |
| 49 | **Partner Report Suitability** | ⬜ |
| 50 | **Clinician Observation Suitability** | ⬜ |
| 51 | **Contraindications** | ⬜ |
| 52 | **Cautions** | ⬜ |
| 53 | Source Document | ✅ |
| 54 | Source Chapter | ✅ |
| 55 | Source Construct | ✅ |
| 56 | Source Version | ✅ |
| 57 | **Suppression or Safety Logic** | ⬜ |
| 58 | **Escalation Logic** | ⬜ |
| 59 | **Structural Context Sensitivity** | ⬜ |
| 60 | **Consumer Translation** | ⬜ |
| 61 | **Reading Level** | ⬜ |
| 62 | **Public or Clinical Boundary** | ⬜ |

**Summary: 45 × 100% · 0 partial · 17 × 0%.**

---

## 4. Source reconciliation (live KB vs v2.1 workbook)

- **They are the same snapshot.** Each competency in `_import/json/kb_competencies.json` carries a `detail` object whose keys are the **exact 62 columns** above, for the **same 111 competencies** (the JSON also holds 12 domain/phase records → 123 total). The JSON is the structured form of this sheet — **the live KB is not ahead of the v2.1 workbook**, and the identical 17 columns are empty in both.
- **kb_defs.json does not surface hidden content.** Its `definition`/`purpose` equal the workbook's (verbatim for COM-EXPL-001). Its `healthy_markers`/`common_challenges`/`growth_indicators` are re-labelings of **populated** columns (Behavioral Indicators, Common Developmental Barriers, Expected Developmental Application), scoped to 20 Discernment-relevant competencies — **not** the empty `Continuum -` columns.

---

## 5. Implications

- **D11 (for these 17 fields) is genuine authoring work in both sources, not an export lag.** A workbook re-export will **not** fill them, because the JSON `detail` is equally empty there. The size of D11 for these columns is *not* smaller than the workbook indicates.
- **The definitional/content layer is complete in both** (45 columns), including the fields kb_defs.json depends on — so that layer is *not* part of the gap.
- **Cluster 2 should derive competency content from `_import/json/kb_competencies.json`** as the single source of truth (kb_defs.json is a scoped extract of it; the workbook is its spreadsheet view). Do not plan around "the live KB has content the workbook lacks" — it does not.
- The 17 empty columns are the psychometric (continuum, report-suitability), safety/clinical (contraindications, cautions, suppression/escalation logic), consumer-delivery (consumer translation, reading level, public/clinical boundary), adaptivity (structural context sensitivity), and governance (reviewer) layers — a coherent authoring worklist for the steward.

---

## 6. Caveat

This audit is of `_import/RLC_Master_Knowledge_Base_v2.1.xlsx` (the workbook that contains a `22_Competency_Details` sheet). If "the workbook" in the working conversation refers to a different file, re-run the same per-column fill check against that file before acting.

*Method: `openpyxl` per-column non-empty count over the 111 data rows; live-KB comparison via `kb_competencies.json` `detail` keys. No files were modified.*
