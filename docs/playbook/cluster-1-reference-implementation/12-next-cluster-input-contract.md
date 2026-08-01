# 12 — Input Contract for a Future Cluster (Claude Chat → Claude Code)

**Purpose:** define exactly what a **frozen, owner-approved cluster package** must contain before Claude Code begins implementation. If any item is missing, Claude Code must **stop and return the gap** (see `13-…` step 1).

This mirrors how Cluster 1 was actually prepared: the full behavioral derivation, Experience graphs, and Play specs were authored and owner-approved *before* code (DECISION-LOG #1–#38). Each item below maps to a concrete as-built target in the repo, so "minimum fields" are grounded, not aspirational.

---

## The 24 required deliverables

### 1. Cluster definition
- **Min fields:** the RLC cluster identity (Snapshot cluster name + numeric `cluster_id`), the stable `playbook_key` (marketing slug), the consumer `displayName`, `playbookVersion`.
- **As-built target:** `keys.ts` map + `PlaybookContent.{playbookKey, playbookVersion, displayName}`.

### 2. Statement disposition map
- **Min fields:** every Snapshot statement for the cluster, each assigned one or more `StatementFunction` (`recognition | cluster_literature | faq_literature | play_literature | jit_teaching | simulation_cue | play_routing | support_signpost_candidate | context_normalization | none`), with resolvable `targets`. **`none` must be exclusive.** Coverage must be exhaustive (each statement mapped exactly once).
- **As-built target:** `StatementMapping[]`; enforced by `playbook-literature.test.ts`.

### 3. Problem Expressions
- **Min fields:** the specific behavioral Problem Expression(s) the cluster addresses (framework-derived), stated as observable behavior, not trait/etiology.

### 4. Functional Interference rulings
- **Min fields:** for each candidate Problem Expression, the owner's ruling that it demonstrates **Functional Interference with the relevant developmental task** (the gate for intervention). Difficult feelings alone are NOT sufficient.

### 5. Framework-coverage rulings
- **Min fields:** confirmation that each intervention is covered by the RLC framework (not invented), citing the manual/Code Book basis.

### 6. Approved Change Targets
- **Min fields:** the behavioral change target for each Play (what observable behavior changes), owner-approved.
- **As-built target:** encoded in each Play's `positioning` + `fidelity.correct`.

### 7. Mechanism and evidence review
- **Min fields:** for each intervention, the mechanism of change and its evidence basis; explicit exclusions (what the mechanism does NOT claim).

### 8. Intervention portfolio
- **Min fields:** the full list of Plays (operations) for the cluster, each with a one-line operation statement and its recognition pathway.
- **As-built target:** the `plays[]` + `recognitionCards[]` set (six for Cluster 1).

### 9. Understand blueprint and full literature
- **Min fields:** every `LiteratureEntry` — `id` (unique), `version`, `scope` (`cluster|play|jit`), `depth?` (`core|question`), `title`, `body: LiteratureBlock[]`, and for play/jit: `playId`/`anchor`. Core guides substantive (multi-block).
- **As-built target:** `MBR_LITERATURE` + JIT; `playbook-literature.test.ts` rules.

### 10. Experience design specifications
- **Min fields:** per Experience — the operation rehearsed, the signature (reuse-or-new), the fidelity fields (canonical names), the reveal mechanism, the JIT hooks, and the safety exclusions. (This is the design pack; see Cluster 1 `cluster-1-experience-design-pack-remaining-four-v1.md`.)

### 11. Full Experience content graphs
- **Min fields:** per Experience — `id`, `version`, `simulationSchemaVersion`, `playId`, `signature`, `startNodeId`, and the full `nodes: SimNode[]` with every option's `signal`/`fidelity` tag, `jitLiteratureId` hooks, the reveal node config, and `teach.toPlayId`. Must satisfy `validateSimulation` (single connected graph, all terminals are teach handoffs, no cycles).
- **As-built target:** the six `sim-*` objects.

### 12. Canonical fidelity signal names
- **Min fields:** exactly **one canonical name per fidelity signal** (no aliases), each with a one-line "establishes / does not establish" statement bounded to what the interaction supports.
- **As-built target:** `FidelityOutcome` per-signature fields; `05-…` §7. (DECISION-LOG #23, #30 — name rulings; #19/#21 — renames.)

### 13. Full Play production specifications
- **Min fields:** per Play — `playId`, `playVersion`, `outputSchemaVersion`, `name`, `positioning`, `recognitionGate.prompt`, the ordered `screens[]` (incl. exactly one `output` screen), `portable[]`, the five-field `myPlaysTemplate`, `fidelity` (correct/misuse/notMeaning), optional `supportSignposts`/`routing`/`outputEditor`.
- **As-built target:** the six `Play` objects; `contentValidate.validatePlay` rules.

### 14. Missions
- **Min fields:** per Mission — `id`, `version`, `playId`, `title`, `instruction`, `linkToOperation`, `attemptMeaning?`, `suitability?`, `progression?` rungs. No gamification; no partner monitoring.
- **As-built target:** `MBR_MISSIONS` (note Cluster 1 currently has Missions only for 2 of 6 Plays — a gap to avoid).

### 15. Use Reviews
- **Min fields:** per Play — `id`, `version`, `playId`, and the four `StructuredPrompt`s (`didDifferently` multi, `performedOperation` single with the yes/partly/no options, `becameClearer` multi, `stuckWhere` single). Bounded selects only (the optional free-text note is a shared runtime field, not authored per review).
- **As-built target:** `MBR_USE_REVIEWS`.

### 16. Change Path routing rules
- **Min fields:** any cluster-specific routing copy for `reviewedRouting`/`nonAttemptRouting`, and any per-Play special-cases (avoid hardcodes; prefer parameterized rules). The frozen priority tiers are reused unchanged.

### 17. My Plays outputs
- **Min fields:** per Play — the five-field `myPlaysTemplate` and how the `output` payload derives the `userLine`.

### 18. JIT entries
- **Min fields:** per JIT — `id`, `version`, `scope:"jit"`, `title`, `body`, `anchor`; and the sim node that hooks it (`jitLiteratureId`). JIT never contributes to fidelity.

### 19. Safety/suitability routing
- **Min fields:** per Play — suitability tier (R1/R2/R3), any Layer-B `supportSignposts`, the excluded/safety-routed material, and which free-text fields need Layer-A screening. Ordinary discomfort must be explicitly in-scope (non-escalating).

### 20. Persistence/data-minimization rules
- **Min fields:** any new persisted state field (with its enum allow-list + numeric cap) — noting that a *new* persisted field or column is an **owner-gated schema change**. What is never persisted (free text beyond the bounded note, partner data, narrative).

### 21. Acceptance criteria
- **Min fields:** the cluster's own acceptance checklist (see `10-…` §3/§4): tests to add, invariants to preserve.

### 22. Decision log
- **Min fields:** a per-cluster decision log (mirroring `DECISION-LOG.md`) recording every approval, ruling, rename, and milestone with numbered entries.

### 23. Prohibited changes
- **Min fields:** an explicit list of what Claude Code may NOT change (the framework, Change Targets, mechanisms, intervention operations, consumer claims, fidelity meanings, safety boundaries; and per this cluster: v0, the other clusters, Snapshot/scoring, commerce/entitlements, migrations/flags/deploys without separate approval).

### 24. Owner approval status for every object
- **Min fields:** for each object above, an explicit status label (`OWNER-APPROVED AND IMPLEMENTED` / `OWNER-APPROVED BUT NOT IMPLEMENTED` / `DEFERRED` / `FOR REVIEW`). No object should reach Claude Code as "for review" unless the owner intends it implemented-pending-copy-approval (and even then it must be flagged, as Cluster 1's four new Use Reviews were — DECISION-LOG #49).

---

## Completeness gate

A package is **frozen and ready** only when items 1–24 are present and item 24 shows owner approval for every object. Anything short of that, Claude Code returns to the owner/Claude Chat rather than improvising (see `13-…`).
