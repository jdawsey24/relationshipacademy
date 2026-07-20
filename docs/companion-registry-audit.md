# Relationship Situation Registry™ — Audit, Discrepancy Report, Schema & Plan

**Analysis only. Nothing built, migrated, or deployed.** No RLC™ theory has been reinterpreted, expanded, or invented; every theoretical or structural question is surfaced for your decision, not silently resolved.

## Sources & order of authority
Reviewed in full: **RLC™ Framework Manual** (121k words), **RLC™ Operational Definitions Manual** (`RLC Operations Manual.docx`, 31k words), **Companion Operations Manual**, **Companion Situation Taxonomy Manual**, **Situation Registry v0.1** (60 situations, RS-0001–RS-0060). The manuals' own **Order of Authority** (Companion Ops Appendix J): (1) Theory Manual → (2) Operational Definitions Manual → (3) Companion Operations Manual → (4) Situation Taxonomy → (5) Experience Library. Higher wins on conflict.

**Load-bearing finding:** the formal taxonomy (Structural Markers, the 6 Domains, the Competency architecture, Behavioral Indicators, the classification hierarchy) exists **only in the Operational Definitions Manual** — the Framework/Theory Manual is narrative and does not enumerate it (and uses "domain" for a *different*, phase-internal concept). So the Theory Manual is canonical for **phase/task developmental content**, and the Operational Definitions Manual is canonical for **taxonomy/vocabulary**.

---

## 1. Document + registry audit (health)

**Registry v0.1 is a clean draft:** 60 situations, sequential immutable IDs (RS-0001–RS-0060, no gaps/dupes), **zero missing required fields**, no duplicate titles, **no theory vocabulary in any consumer title**, every situation carries a Primary framework mapping (phase+task+domain+competency), 180 consumer search phrases, 30 related-situation links, 60 Companion-experience links, one version-history row each. It already separates concerns across sheets (Situations / Framework Crosswalk / Statuses / Search Terms / Related / Links / Version History / Governance Log / lookups).

**Structural Independence check (theory-critical): PASS.** Phase is not mechanically derived from status — each status spans two phases (e.g. Married → Expansion ×7 *and* Expiration ×3; Dating → Exploration ×9 and Exclusivity ×1), so phase is assigned from situation content, honoring the Operational Definitions §5.1.2 Structural Independence Rule.

---

## 2. Discrepancy report (your 8 categories)

### (1) Inconsistent terminology
- **Domain name:** canonical is **"Physical Intimacy"** (Op-Def §6.2; "Physical/Sexual" and "Sexual Intimacy" appear **0×** in either theory manual). Registry uses **"Physical/Sexual Intimacy"** (`DOM-006`) and category **"Physical & Sexual Intimacy"** (`CAT-008`); the already-built Companion also used "Physical/Sexual Intimacy." Three non-canonical variants.
- **Exclusivity's Developmental Task:** the **Theory Manual says "Intentional Investment"**, the **Operational Definitions Manual says "Investment."** The two top authorities disagree. Registry chose "Intentional Investment."
- **Structural Marker forms:** canonical markers are nouns — **"Engagement," "Marriage"**; registry uses adjectives **"Engaged," "Married."**
- **"Domain" collision (theory-internal):** Op-Def "Developmental Domains" (the 6) vs Framework Manual "Six Domains of Integration" (Time/Emotional/Social/Practical/Identity/Future — a phase-internal Expansion model). Registry correctly uses the 6 Developmental Domains, but any tool keying on the word "domain" must disambiguate.
- **Companion manuals disagree with each other:** category member names ("Emotional Connection" vs "Emotional Intimacy"; "Family & Social Relationships" vs "Family Relationships"); publication status "Under Review" vs "Review."

### (2) Unsupported framework mappings
- **No canonical competency roster exists.** Theory sanctions the competency *structure* (phase-specific, derived from the task, classified into a domain) but publishes **no master list and no IDs** — only ~13 illustrative examples. The registry's **44 competencies cannot be validated** against theory. (Several — "Wise Trust," "Secure Base," "Sexual Integrity," "Systems Coordination" — aren't among the illustrative examples.)
- **No Behavioral-Indicator inventory or ID scheme exists in theory.** The registry's `Behavioral Indicator IDs` column is **empty on all 60** — consistent with there being nothing canonical to reference yet.
- **"Considering Dating" (`ST-002`) is not a canonical Structural Marker.** Canonical markers: Single, Dating, Committed Relationship, Engagement, Marriage, **Separation**. The registry invented "Considering Dating" and **omits "Separation."**
- **Developmental Task is entered as free text** on the crosswalk rather than derived from Phase (theory: exactly one task per phase). Currently all pairings are correct, but the field invites drift.

### (3) Duplicate / overlapping situations
- **None found** in v0.1 (no duplicate IDs or titles; 30 related-situation links are typed "Related," not duplicates). The manuals' "one situation, one purpose" + non-duplication rule should be enforced by the CMS as the catalog scales.

### (4) Missing required metadata
- **Behavioral Indicators empty (60/60)** — but blocked by category (2) (no canonical inventory); treat as *not yet required*, not an error.
- **Governance Log empty (0 rows)** though classification decisions have been made.
- **Only "Primary" mappings** — no secondary phase, additional domains, or multi-status enrichment (all *allowed* by the manuals, none *required*).
- **Scope note:** the registry is a *situation* catalog; several OPS "required" fields (estimated completion time, educational objective, reading level, risk indicators) are **experience-level** metadata that belong on Companion experiences, not situations. Don't conflate the two levels.

### (5) Category / Experience-Type ambiguity
- **Situation Category set is unstable across the manuals:** three different lists — **14** (Taxonomy §2.4, which the registry uses), **12** (Taxonomy Ch.2), **10** (Ops Appendix G). No single canonical set.
- **Categories mirror framework Domains** (Communication, Trust, Conflict, Emotional Connection, Physical & Sexual Intimacy, Roles & Responsibilities). Since "Situation Category" is **not** a theory construct (Companion-owned), this isn't a framework violation — but it blurs the classification/framework layers and risks the consumer-language rule if categories ever surface.
- **Ops §10 contradiction:** describes the Category field as holding **status values** ("Dating, Marriage, Engagement") — directly against the taxonomy's own rule.
- **Hierarchy depth conflict:** Taxonomy = 5 levels (…Situation → **Experience Type** → Companion Experience); Ops Appendix G = 4 levels (drops Experience Type). **Classification order** also inverts: Status-before-Type (TAX) vs Type-before-Status (OPS).
- Experience Types themselves are clean and consistent (Prepare/Process/Decide/Build/Celebrate; one primary per experience; "determined by purpose, not phase/status/domain").

### (6) Schema fields that don't match the manuals
- Domain label, status set, and status forms per (1)/(2).
- **Developmental Task stored independently** rather than as an attribute of Phase.
- **Two permanent-ID schemes** with no stated crosswalk: **Situation ID `RS-0001`** vs **Experience ID `EXP-PREP-001`** (a situation may have many experiences over time).
- **Publication-status vocabulary differs** (6 / 5 / a 10-stage lifecycle). Registry's lookup uses 6 (Draft/Under Review/Approved/Published/Archived/Retired).
- **Companion product already built with 5 statuses** (Single/Dating/Committed/Engaged/Married) — misaligned with the registry's 6 and canonical's 6 (Separation). The live `structural_statuses` table + onboarding will need reconciling once the status set is decided.

### (7) Consumer-language concerns
- Titles are excellent — plain, first-person, no theory terms. ✓
- **Categories named "Communication / Trust / Conflict"** would violate the explicit rule *"do not organize the consumer interface around Trust / Communication / Conflict"* **if surfaced**. The manuals say categories are internal/organizational — so this is safe *only* as long as categories stay internal and the consumer browses **situations** (and, per the content-architecture blueprint, life-moment *collections*).
- No phase/domain/competency is consumer-exposed anywhere. ✓ Reading-level rule (5th–8th grade) is not yet linted.

### (8) Places requiring a theoretical or structural decision
Enumerated in **§7 (Decisions requiring approval)** below.

### Findings sorted into your four buckets

| # | Finding | Bucket |
|---|---|---|
| a | Exclusivity task: "Investment" (Op-Def) vs "Intentional Investment" (Theory) | **Theory/manual clarification** |
| b | No canonical competency roster/IDs → 44 competencies unvalidated | **Theory/manual clarification** |
| c | No Behavioral-Indicator inventory/ID scheme in theory | **Theory/manual clarification** |
| d | "Considering Dating" not a canonical marker; "Separation" missing | **Theory/manual clarification** (+ registry correction once decided) |
| e | Situation Category set unstable (14/12/10); category names duplicate domains | **Theory/manual clarification** (Companion manuals) |
| f | Hierarchy depth (5 vs 4) + layer model (3-layer vs dual) + classification order | **Theory/manual clarification** (Companion manuals) |
| g | Publication-status vocabulary differs (6/5/10) | **Theory/manual clarification** |
| h | Taxonomy Manual references a "Section VI" governance section that is absent | **Theory/manual clarification** (missing content) |
| i | `DOM-006` "Physical/Sexual Intimacy" → "Physical Intimacy" | **Registry correction** |
| j | Marker forms "Engaged/Married" → "Engagement/Marriage" | **Registry correction** |
| k | `CAT-008` "Physical & Sexual Intimacy" naming | **Registry correction** (pending e) |
| l | Behavioral-Indicator column empty; Governance Log empty | **Registry correction** (deferred; see c) |
| m | Enrich secondary phase / additional domains / multi-status where applicable | **Registry correction** (enrichment) |
| n | Three-layer separation as separate tables; crosswalk-only joins | **Software** |
| o | Task modeled as attribute of Phase (not free text) | **Software** |
| p | M2M for statuses/phases/domains/competencies/search/related/links | **Software** |
| q | Model both permanent IDs (RS situation ↔ EXP experience, 1:many) | **Software** |
| r | Keep Category and Status as separate FKs (fix Ops §10 contamination) | **Software** |
| s | Reconcile live Companion 5-status model with the chosen status set | **Software** (rework) |
| t | Framework names as validated natural keys matching canonical exactly | **Software** |
| u | Coverage dashboard; consumer full-text search; related-situation graph | **Optional enhancement** |
| v | Consumer "collections" layer over internal categories; reading-level linting | **Optional enhancement** |

---

## 3. Proposed normalized schema (three layers, never combined)

Permanent Situation IDs preserved; full version history; many-to-many everywhere the manuals allow it. The three layers live in **separate tables** and meet **only** in the crosswalk/junction tables — no layer is ever a column on another.

**A. CLASSIFICATION layer (Companion-owned — how users find content)**
- `reg_relationship_statuses` (`status_id` e.g. ST-001, name, definition, is_canonical_marker, display_order) — the Structural Markers.
- `reg_situation_categories` (`category_id`, name, definition, display_order).
- `reg_situations` (`id uuid`, **`situation_id` text unique immutable** RS-####, official_title, short_title, definition, user_need, `primary_status_id` FK, `primary_category_id` FK, `primary_experience_type_id` FK, publication_status, record_owner, current_version, created/updated).
- `reg_situation_statuses` (situation ↔ status, `is_primary`) — M2M additional statuses.
- `reg_situation_categories_map` (situation ↔ category, `is_primary`) — optional secondary categories via metadata.

**B. INSTRUCTIONAL layer (Companion-owned — how content is designed)**
- `reg_experience_types` (`experience_type_id` ET-###, name, definition, typical_flow jsonb) — Prepare/Process/Decide/Build/Celebrate.
- Link to the existing **`companion_experiences`**: add `situation_id` FK (1 situation → many experiences) + `experience_ref` (EXP-{TYPE}-###) + `experience_type_id`. The experience's own metadata + governed versioning already exist.

**C. FRAMEWORK layer (theory-owned, authoritative — names must match canonical exactly)**
- `fw_phases` (`phase_id` PH-###, **canonical_name**, `developmental_task` as an attribute — one per phase, not free text).
- `fw_domains` (`domain_id` DOM-###, **canonical_name**).
- `fw_competencies` (`competency_id`, **canonical_name**, `domain_id`, `phase_id`) — *provisional* until a canonical roster is supplied.
- `fw_behavioral_indicators` (deferred — created empty; populated only when theory publishes an inventory + ID scheme).

**Crosswalk (the only place layers meet):**
- `reg_situation_framework_map` (situation ↔ `phase_id` with `role` primary/secondary, `domain_id` with `role` primary/additional, `competency_id`, `behavioral_indicator_id` nullable, `mapping_role`, `educational_objective`, `active`) — full M2M with roles.

**Cross-cutting (all M2M, per the registry's existing sheets):**
- `reg_search_terms` (situation ↔ search_text, term_type, locale, active).
- `reg_related_situations` (source ↔ target, relationship_type, rationale).
- `reg_companion_links` / ecosystem (situation ↔ asset_type, asset_id, asset_title, url, version, status) — Playbook/Academy/Snapshot/Profile/Blueprint links.
- `reg_situation_versions` (immutable per-situation version history — permanent ID retained across title/field revisions).
- `reg_governance_log` (decision_type, decision, rationale, reviewer, date, affected_assets).

**Integrity rules:** framework `canonical_name` is the natural key and is CHECK/trigger-validated against the canonical lists; framework tables are Framework-Steward-only; RLS locks all tables to service-role reads with app-code gating (consistent with the existing `companion_*` posture); Situation IDs are immutable and never reused.

---

## 4. Migration plan (additive, idempotent, owner-run — after approval)

Starts at the next free number (**0043+**), same conventions as the built system (`if not exists`, `notify pgrst`, UUID PKs + text business IDs, RLS). **No destructive changes; the live `companion_*` product is preserved.**
1. **0043 — Framework layer + lookups:** `fw_phases` (+ tasks), `fw_domains`, `fw_competencies` (provisional), `fw_behavioral_indicators` (empty); seed canonical names *after* the terminology decisions (§7). Add name-validation constraints.
2. **0044 — Classification layer:** statuses, categories, `reg_situations`, `reg_situation_statuses`, category map + version history.
3. **0045 — Crosswalk + cross-cutting M2M:** framework map, search terms, related situations, companion links, governance log.
4. **0046 — Instructional link:** add `situation_id`/`experience_ref`/`experience_type_id` to `companion_experiences`; seed `reg_experience_types`; reconcile the live status set (§7 decision — this is the one place existing data/onboarding changes).
5. **Data load:** a seed script imports the **corrected** registry (post §7 decisions) from the xlsx → tables, preserving RS IDs and version history. Verified against the canonical lists before load.

---

## 5. Admin workflow (situation + experience authoring)

Extends the existing owner CMS + governance engine:
1. **Author a situation** → auto-assign next `RS-####` (immutable) → write title/short/definition/user_need.
2. **Classify** (one primary each): Status → Category → Experience Type. (Order per the chosen manual resolution.)
3. **Map framework** *after* classification (Independence Rule): pick Phase (Task auto-fills from phase), primary Domain (+ additional), competencies (many), optional secondary phase; Behavioral Indicators deferred.
4. **Enrich:** search terms, related situations, ecosystem links.
5. **Governed review:** Draft → Under Review → **Editorial Review** → **Framework Review** (Framework Steward validates every mapping against canonical) → Approved → Published; version history + governance log written on each transition. A **completeness + framework-validity gate** blocks publish until required fields are present and every framework name matches canonical.
6. **Experiences** hang off a published situation (1→many), authored through the block CMS already built, inheriting the situation's classification.
7. **Framework-layer edits** (phases/domains/competencies) are Framework-Steward-only and name-validated — the Companion can never modify canonical theory.

---

## 6. Implementation risks
1. **Canon is not fully settled.** The two top authorities disagree (Investment vs Intentional Investment), and there is no canonical competency roster or Behavioral-Indicator inventory. Building framework validation before these are fixed risks encoding the wrong canon.
2. **Taxonomy is single-sourced** in the Operational Definitions Manual, yet you named the *Theory Manual* canonical — the order-of-authority for taxonomy must be locked (recommend Ops Appendix J order).
3. **Status-set decision has downstream rework** — the live Companion (5 statuses, onboarding, `structural_statuses`) must change to match whatever is chosen; entries already reference the old set (currently none real).
4. **Companion manuals disagree with each other** (category set, hierarchy depth, publication vocab, layer model, ID schemes) and one references a **missing Section VI** — schema choices made before these resolve risk rework.
5. **Category/Domain naming collision** could leak framework language to consumers if categories are ever surfaced; keep categories internal + add a consumer "collections" layer.
6. **Two-ID complexity** (RS ↔ EXP) needs a clean 1:many contract to avoid drift between situations and experiences.

---

## 7. Decisions requiring approval (the gate — nothing is built until these are made)

**Theory / canon:**
1. **Exclusivity task name:** adopt **"Intentional Investment"** (Theory Manual) or **"Investment"** (Operational Definitions)? (Recommend Theory Manual wins per Order of Authority → "Intentional Investment," and correct the Op-Def table.)
2. **Domain name:** adopt canonical **"Physical Intimacy"** across registry + Companion (replacing "Physical/Sexual Intimacy")? (Recommend yes.)
3. **Structural Marker set:** adopt canonical six — Single, Dating, Committed Relationship, **Engagement**, **Marriage**, **Separation**? If so: (a) is **"Considering Dating"** dropped, or reclassified as a Structural *Characteristic*/sub-state of Single (not a marker)? (b) confirm **"Separation"** is added. (This drives the live 5→? reconciliation.)
4. **Competency roster:** supply/author a canonical **Competency Profile registry** (names + domain/phase + IDs), or approve the registry's 44 as **provisional** pending that roster? (Recommend provisional + flag unvalidated ones.)
5. **Behavioral Indicators:** defer (no required BI metadata) until theory publishes an inventory + ID scheme — confirm?

**Companion taxonomy (manual conflicts):**
6. **Canonical Situation Category set:** 14 (Taxonomy §2.4) vs 12 vs 10 — and should categories be **renamed** so they don't duplicate Domain names, and confirmed **internal-only** with a consumer "collections" layer?
7. **Hierarchy depth + classification order:** Experience Type *in* the hierarchy (Taxonomy) or *out* (Ops)? Status-before-Type or Type-before-Status?
8. **Publication lifecycle:** adopt the 6-value set (Draft/Under Review/Approved/Published/Archived/Retired)?
9. **Layer terminology:** confirm the **three-layer** model (classification / instructional / framework) as the schema's governing structure (Taxonomy §2.5), superseding the Ops "dual-layer" wording.
10. **Missing Taxonomy Section VI** (governance) — will you supply it, or should governance follow **Ops Appendix J** in the interim?

**Product/structural:**
11. **ID model:** confirm **RS-#### (situation, permanent) → EXP-{TYPE}-### (experience, 1:many)** as the two-key contract.
12. **Order of authority for taxonomy:** confirm **Operational Definitions Manual** is authoritative for vocabulary (with Theory Manual canonical for phase/task content), per Ops Appendix J.

On your rulings for these, I'll finalize the schema and produce the migration + corrected-registry load for a second review — still no destructive changes until you approve that.
