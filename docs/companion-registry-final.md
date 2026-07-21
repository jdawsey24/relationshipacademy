# Relationship Situation Registry™ — Finalized Audit, Corrected-Load Plan & Schema (rulings applied)

**Analysis only. Nothing built, migrated, or deployed. No theory reinterpreted.** Supersedes the preliminary decisions in `companion-registry-audit.md`. Two conflicts remain that I must **not** resolve myself — see §5.

## Authority order (as ruled)
Theory Manual + Operational Definitions Manual are **jointly canonical** (Theory = conceptual meaning; Op-Def = exact terminology/definitions/classification). **Master Knowledge Base v2.1** is the consolidated implementation reference and must stay consistent with both. Companion Taxonomy is Companion-only (classification/instructional layers), never framework.

## Your rulings — applied
| # | Ruling | Status |
|---|---|---|
| 1 | Exclusivity task = **Intentional Investment** | Applied. Matches Theory Manual + MKB. ⚠ Op-Def §3.2 table says "Investment" → **conflict, see §5.1** |
| 2 | Domain = canonical **Physical Intimacy** | Applied. MKB **and** Op-Def agree on "Physical Intimacy"; registry's "Physical/Sexual Intimacy" is corrected |
| 3 | Keep **5** statuses (Single, Dating, Committed Relationship, Engaged, Married); remove "Considering Dating" (→ consumer branch under Single); **no** Separation status (Separation = structural-transition rule) | Applied. The live Companion already has exactly these 5 — no product rework needed |
| 4 | Competencies = canonical roster in **MKB v2.1**; verify every mapping | Done — **only 19/60 valid**, see §3.1 |
| 5 | Behavioral Indicators = canonical from **MKB v2.1**; propose ID schema only if none exists | MKB already has permanent BI IDs (`BI-000001`) → **use them; no new schema needed** |
| 6 | Consumer **Situation Categories** = your new 14-set (Companion classification layer, not domains) | Applied — remap in §4 |
| 7–12 | Implementation issues → my recommendations, preserving the three-layer architecture | Applied in §6 schema |

## Canonical vocabulary now locked (from MKB v2.1 + Op-Def)
- **Phases (6):** Exploration, Exclusivity, Expansion, Expiration, Recovery, Renewal.
- **Developmental Tasks:** Discernment, **Intentional Investment**, Integration, Acceptance, Healing, Reengagement (one per phase).
- **Domains (6), canonical IDs:** DOM-001 Communication, DOM-002 Trust, **DOM-003 Emotional Intimacy**, **DOM-004 Conflict Management**, DOM-005 Role Functioning, DOM-006 **Physical Intimacy**. *(Registry currently swaps DOM-003/004 and mislabels DOM-006 — corrected in §4.)*
- **Competencies:** 111 records / 102 distinct names, ID format `COM-EXPL-001` (`<DOMAIN>-<PHASE>-###`), each bound to a specific Phase+Domain. **Covers only Exploration/Exclusivity/Expansion/Expiration.**
- **Behavioral Indicators:** 333 records, IDs `BI-000001`, each linked to a Competency ID.
- **Structural Markers (framework):** Single, Dating, Committed Relationship, Engagement, Marriage, Separation — internal; the Companion's 5 consumer **relationship statuses** map onto these (Engaged↔Engagement, Married↔Marriage; Separation is framework-only).

---

## 3. Finalized discrepancy report (rulings applied)

### 3.1 Framework mappings — the material finding (registry correction + canonical gap)
Verifying all 60 crosswalk rows against the canonical `(competency, phase, domain)` grid:
- **19/60 canonically valid** ✓
- **25/60 invalid within the 4 covered phases** — competency name not canonical for that phase+domain (the registry stored free-text competency names, not canonical competency IDs; also three rows used **task names as competencies** — *Discernment, Integration, Reengagement*). → **registry correction: re-map to canonical Competency IDs.**
- **16/60 in Recovery/Renewal** — **no canonical competencies exist** for those phases (and no phase codes). → **BLOCKED, canonical gap — see §5.2.**
- 12 distinct registry competency names are absent from the roster; the valid canonical target is the grid of 4 phases × 6 domains (2–7 competencies per cell).

**Correction method:** the crosswalk must reference `Competency ID` (canonical), not a free-text `Competency` string. Behavioral Indicators then flow from the competency (no per-situation BI authoring needed). Every re-map is a data fix against the canonical grid — none invents theory.

### 3.2 Terminology / vocabulary (registry corrections)
- `DOM-006` "Physical/Sexual Intimacy" → **"Physical Intimacy"**; `CAT-008` naming handled by the new category set (§4).
- Domain IDs realigned to canonical: Emotional Intimacy = **DOM-003**, Conflict Management = **DOM-004** (registry has them swapped).
- Developmental Task no longer stored as free text on the crosswalk — **derived from Phase** (one task per phase).

### 3.3 Status (registry correction, no product rework)
- Registry drops `ST-002 Considering Dating` as a status; its **10 situations reassign to `ST-001 Single`** with a non-status "current focus: considering dating" attribute (a consumer branch, per ruling 3). The 5 canonical Companion statuses stay; the live `structural_statuses` table already matches.

### 3.4 Metadata / integrity
- Behavioral Indicator column stays empty on situations by design (BIs attach via competency). Governance Log to be populated as decisions are logged. Secondary phase/domain and multi-status enrichment supported by the schema but optional.

### 3.5 Consumer language ✓
- Titles clean. New categories are Companion classification-layer, confirmed internal-only, with situations (and life-moment collections) as the consumer surface — no framework language exposed.

---

## 4. Consumer Situation Categories — new canonical set (14) + remap

Your set (classification layer; must not redefine framework domains):
`Getting Started · Getting to Know Each Other · Communication · Trust · Boundaries · Conflict · Emotional Connection · Physical & Sexual Intimacy · Shared Life · Big Decisions · Life Changes · Breakups & Loss · Growing Forward · Wins Worth Celebrating`

Proposed old→new remap for the 60 situations (⚠ = confirm):
| Registry v0.1 category | → New consumer category |
|---|---|
| Getting Started | Getting Started |
| Communication | Communication |
| Conflict | Conflict |
| Trust | Trust |
| Boundaries | Boundaries |
| Emotional Connection | Emotional Connection |
| Physical & Sexual Intimacy | Physical & Sexual Intimacy |
| Decision Making | **Big Decisions** |
| Roles & Responsibilities | **Shared Life** ⚠ |
| Family & Social Relationships | **Shared Life** ⚠ (or Life Changes, per situation) |
| Life Transitions | **Life Changes** |
| Recovery & Healing | **Breakups & Loss** |
| Personal Growth | **Growing Forward** |
| Celebration & Milestones | **Wins Worth Celebrating** |
| *(none)* | **Getting to Know Each Other** — new; likely split from early-Dating situations currently in Getting Started/Communication ⚠ |

The ⚠ rows need your confirmation (a category with two plausible targets, or a brand-new category with no v0.1 source). Everything else is a clean 1:1 rename.

---

## 5. Conflicts I must return for approval (not resolving silently)

### 5.1 Operational Definitions Manual contradicts the ruling on Exclusivity's task
Op-Def §3.2 task table reads **"Investment."** Your ruling, the Theory Manual, and MKB v2.1 all read **"Intentional Investment."** I've applied "Intentional Investment," but the Op-Def Manual text itself is now inconsistent with the canon. **Requested:** correct Op-Def §3.2 to "Intentional Investment" (a manual edit), so the jointly-canonical sources agree. Until you confirm, I flag it rather than assume.

### 5.2 Recovery & Renewal are not built in the canonical framework
The MKB competency roster covers only 4 of 6 phases; **Recovery and Renewal have zero competencies and no phase codes** (`03_ID_Standards` marks them "TBD"). **16 registry situations map to these phases and therefore cannot be validated or completed** against canon. This is a gap in the canonical source, so I'm reporting it. **Requested decision (pick one):**
- (a) Author Recovery/Renewal competencies + phase codes in MKB v2.1 first (theory work), then map; or
- (b) Hold those 16 situations in Draft (published catalog excludes them) until the roster is extended; or
- (c) Map them at **task level only** (Phase + Developmental Task, no competency) as an explicit interim, flagged for re-mapping when competencies exist.
I recommend (b) or (c); I will not author framework competencies.

*(Note: registry DOM-003/004 swap and the "Physical/Sexual → Physical" fix are registry corrections, not conflicts — already applied in §3.2.)*

---

## 6. Finalized three-layer schema (MKB-aligned; layers never combined)

Framework layer is sourced from and keyed to MKB v2.1 canonical IDs. Classification and instructional layers are Companion-owned. The layers meet **only** in `reg_situation_framework_map`.

**A. CLASSIFICATION (Companion):** `reg_relationship_statuses` (5), `reg_situation_categories` (14, new set), `reg_situations` (permanent `RS-####`, titles, definition, user_need, `primary_status_id`, `primary_category_id`, `primary_experience_type_id`, `current_focus` nullable [holds "considering dating"], publication_status, owner, version), `reg_situation_statuses` (M2M), `reg_situation_categories_map` (M2M optional).

**B. INSTRUCTIONAL (Companion):** `reg_experience_types` (5), and `companion_experiences` gains `situation_id` + `experience_ref` (`EXP-{TYPE}-###`) + `experience_type_id` (1 situation → many experiences).

**C. FRAMEWORK (theory-owned; mirrors MKB, names/IDs must match canon exactly):** `fw_phases` (PH-### + phase_code + developmental_task; Recovery/Renewal codes pending §5.2), `fw_domains` (DOM-### canonical), `fw_competencies` (`COM-<DOMAIN>-<PHASE>-###`, phase, domain — imported from MKB `04`), `fw_behavioral_indicators` (`BI-######`, competency_id — imported from MKB `05`). These are **read-mostly**, sourced from MKB; the Companion never edits them.

**Crosswalk (the only join):** `reg_situation_framework_map` (situation ↔ `phase_id` [primary/secondary], `domain_id` [primary/additional], **`competency_id`** [FK to `fw_competencies`, not free text], `mapping_role`, `educational_objective`, `active`). BIs derive from the competency.

**Cross-cutting M2M:** `reg_search_terms`, `reg_related_situations`, `reg_companion_links` (ecosystem), `reg_situation_versions` (immutable history, permanent RS-#### preserved), `reg_governance_log`. RLS/service-role posture consistent with the built `companion_*` system; framework `canonical_name`/IDs validated against MKB on write.

*(This aligns with MKB's own `23_Database_Schema_Map` / `28_Postgres_Field_Map` for the framework tables — reusing its ID standards rather than the registry's improvised PH-001/DOM-001 codes.)*

---

## 7. Corrected registry load (transformations, pending §5)
A deterministic transform of registry v0.1 → the schema, applied by a reviewed seed script (no destructive DB change; runs after your approval + migrations):
1. Statuses → 5; reassign the 10 `ST-002` situations to `ST-001` + `current_focus="considering_dating"`.
2. Domains → canonical IDs/names ("Physical Intimacy"; fix DOM-003/004).
3. Task → derived from phase (drop free-text task column).
4. **Competencies → canonical `Competency ID`**: auto-match the 19 valid; produce a **worklist** for the 25 invalid (each with the canonical options for its phase+domain) for owner/steward re-mapping; **quarantine the 16 Recovery/Renewal** per §5.2.
5. Categories → new 14-set per §4 (⚠ rows confirmed by you).
6. BIs → linked via canonical competency (populate from MKB).
7. Preserve RS-#### IDs + version history; write a governance-log entry per change class.

## 8. Migration plan (unchanged; additive, idempotent, owner-run, after approval)
`0043` framework layer (import MKB competencies/BIs/domains/phases) · `0044` classification layer + situations + versions · `0045` crosswalk + cross-cutting M2M · `0046` instructional link on `companion_experiences`. No destructive change; the live product is preserved.

## 9. To proceed I need
1. **§5.1** — confirm the Op-Def "Investment → Intentional Investment" manual correction.
2. **§5.2** — choose (a)/(b)/(c) for Recovery/Renewal.
3. **§4 ⚠** — confirm the ambiguous/new category mappings.
Then I finalize the corrected-registry dataset + the migration for a second review — still nothing destructive until you approve that.

---

## 10. Decisions resolved (owner, 2026-07-20) — corrected load applied
- **§5.1 Exclusivity task:** **Intentional Investment** is canonical. **Op-Def / RLC Operations Manual §3.2 "Investment" → correct to "Intentional Investment"** (owner/steward manual edit; flagged, not auto-edited).
- **§5.2 Recovery & Renewal:** do **not** create/infer competencies. The 16 R/R situations are mapped to **canonical Phase + Developmental Task only** and held in **Draft** until the competency architecture is operationalized. (Option c.)
- **§4 categories confirmed:** Roles & Responsibilities **and** Family & Social Relationships → **Shared Life**; **Getting to Know Each Other** approved as a Companion-only consumer category (no framework meaning).

### Corrected-load result (deterministic transforms done)
- Statuses → 5; the 10 `ST-002` situations (RS-0011–RS-0020) reassigned to **Single + `current_focus="considering_dating"`**.
- Domains → canonical IDs/names (Emotional Intimacy = DOM-003, Conflict Management = DOM-004, **Physical Intimacy** = DOM-006).
- Developmental Task derived from Phase; categories remapped to the 14-set (distribution spans 13 categories; "Getting to Know Each Other" is net-new with no v0.1 source — available for manual assignment).
- Competencies: **19 valid kept** (linked to canonical `Competency ID` → BIs derive); **16 R/R = task-level, Draft**; **25 need a steward pick** → `docs/companion-competency-remap-worklist.md` (each row lists the canonical competencies available for its phase+domain).

### Remaining before the corrected dataset + migrations go to second review
- Complete the **25-row competency worklist** (steward selects one canonical `Competency ID` per row from the provided options).

---

## 11. Competency handling — updated (owner, 2026-07-20)
- **No inline manual selection.** In the corrected load, **non-canonical competency values are removed** and the Competency field is left **UNRESOLVED** wherever a canonical mapping can't be determined automatically. Only the **19 auto-resolvable** competencies carry a canonical `Competency ID`.
- The **canonical review document** is now **`docs/companion-competency-review-workbook.xlsx`** (supersedes the markdown worklist). It contains **only the 25 unresolved situations** with options, columns: Situation ID · Title · Phase · Domain · User Need · Canonical competency options (phase/domain) · blank **Selected Competency** · Notes. (The 16 Recovery/Renewal remain excluded — decided task-level/Draft, no options.)
- **The registry is not modified** until those mappings are approved via the workbook.

---

## 12. Competency review outcome (owner, 2026-07-20)
All 25 reviewer selections validated as canonical (correct ID + name + phase + domain vs MKB v2.1).

**Approved — 16** (folded into the corrected load with canonical Competency IDs):
| Situation | Competency ID | Competency |
|---|---|---|
| RS-0015 | ROL-EXPL-003 | Congruence |
| RS-0026 | COM-EXPL-007 | Clarification |
| RS-0032 | CON-EXPN-002 | Problem Solving |
| RS-0034 | ROL-EXPN-001 | Role Integration |
| RS-0035 | TRU-EXCL-002 | Consistency |
| RS-0036 | ROL-EXPN-002 | Shared Responsibility |
| RS-0038 | ROL-EXPN-001 | Role Integration |
| RS-0041 | ROL-EXPN-001 | Role Integration |
| RS-0043 | ROL-EXPN-003 | Coordination |
| RS-0044 | ROL-EXPN-002 | Shared Responsibility |
| RS-0045 | ROL-EXPN-003 | Coordination |
| RS-0046 | CON-EXPN-001 | Negotiation |
| RS-0049 | ROL-EXPN-003 | Coordination |
| RS-0052 | ROL-EXPN-002 | Shared Responsibility |
| RS-0053 | ROL-EXPN-003 | Coordination |
| RS-0058 | ROL-EXPR-002 | Role Transition |

**Held for steward phase/domain re-examination — 6** (competency left UNRESOLVED; these are framework-mapping questions, not competency-choice errors): RS-0040, RS-0047, RS-0048, RS-0050, RS-0051 (chosen competency contradicts the reconnect need), RS-0054.

**Still pending owner call — 3** (Trust-domain proxies; not in the approved 16 nor the held 6): RS-0020, RS-0023, RS-0027 — approve as proxies or add to steward review.

**Competency resolution tally:** 19 originally-valid + 16 approved = **35 resolved**; 6 held + 3 pending = 9 unresolved-with-options; 16 Recovery/Renewal = task-level, Draft. (60 total.) Registry unmodified pending final corrected-load approval.

### Update — 3 borderline moved to steward review (owner, 2026-07-20)
RS-0020, RS-0023, RS-0027 added to the steward hold. **Held for steward phase/domain review is now 9** (RS-0020, 0023, 0027, 0040, 0047, 0048, 0050, 0051, 0054), competency left unresolved. Tally: **35 resolved · 9 held (unresolved-with-options) · 16 Recovery/Renewal task-level Draft** = 60.
