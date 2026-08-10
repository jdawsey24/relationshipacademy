# Cluster 1 — As-Built Reference Implementation Package

**What this is:** a verified, repository-grounded audit of exactly how **Cluster 1** of the Relationship Playbook™ ("Believing You're Worth Being Chosen" / key `moving-beyond-rejection`) is implemented in the current repository. It is a **documentation and audit deliverable** — producing it changed **no** runtime code, content, migration, feature flag, or deployment. _(superseded 2026-08-09 — see the correction note in `README.md`.)_

**How it was produced:** every as-built claim was verified against the working tree of branch `main` (not from memory, not summarized from the decision log alone). File paths, exported types/functions/components, and line ranges are cited throughout.

---

> ### ⚠ Correction — 2026-08-09
>
> **The consumer name is now "Finding Love That Feels Mutual".** This package records it as
> "Believing You're Worth Being Chosen", which was correct when the package was written and is
> not any more.
>
> The Experience Clusters workbook was revised and applied. `snapshot_clusters`
> now carries `playbook_subtitle = "Finding Love That Feels Mutual"` for cluster 1, and
> `content/playbook/moving-beyond-rejection.ts` was updated to match — both its
> `displayName` and the opening screen's title.
>
> This also retires the discrepancy this package documents. The earlier ruling —
> that the code was renamed **in code only** while the database and marketing
> were held on "Moving Beyond Rejection" — no longer describes anything: all
> three surfaces now agree, and none of them says "Moving Beyond Rejection".
>
> **The key did not change.** `moving-beyond-rejection` is still the stable
> identifier in URLs, purchases and saved progress, so every path, filename and
> key in this package is still accurate.
>
> Nothing else in the package was rewritten. It is an as-built record of what
> was true when it was produced; this note says what changed since.

---


## The one thing to read first

There is a **single uploadable document** that is self-contained — you can upload it into Claude Chat without repository access:

➡️ **[`CLUSTER_1_AS_BUILT_IMPLEMENTATION_PACKAGE.md`](CLUSTER_1_AS_BUILT_IMPLEMENTATION_PACKAGE.md)**

It opens with **"What Claude Chat Should Learn From Cluster 1"** and consolidates the executive summary, architecture, contracts, inventory, safety, traceability, reuse matrix, and the next-cluster contract + recipe.

---

## Status headline (do not collapse these)

| | |
|---|---|
| Design complete | ✅ (exception: 4 new Use Reviews are FOR REVIEW, not owner-approved) |
| Implementation complete | ✅ — but **uncommitted** on `main` (HEAD is the Step-8 two-Experience build) |
| Migration `0053` | Owner says run; file header still says "AUTHORED, NOT RUN" |
| Automated validation | ✅ 376/376 tests, tsc clean, build green |
| Owner E2E accepted | 🟡 non-authenticated PASS; **authenticated DB round-trip NOT verified** |
| Deployed | ❌ No |
| Production flag enabled | ❌ No (`PLAYBOOK_REV3_ENABLED` off) |
| Attorney review | Not evidenced in-repo |

Full detail: [`01-source-of-truth-and-status.md`](01-source-of-truth-and-status.md) and [`14-open-gates-known-limitations-and-owner-decisions.md`](14-open-gates-known-limitations-and-owner-decisions.md).

---

## Supporting technical documents

| File | Covers |
|---|---|
| [`01-source-of-truth-and-status.md`](01-source-of-truth-and-status.md) | Executive status (seven distinct states), naming, source-of-truth hierarchy, commit status. |
| [`02-end-to-end-architecture.md`](02-end-to-end-architecture.md) | The eight layers, consumer vs internal names, the process-state model, the end-to-end state flow, invariants. |
| [`03-content-and-schema-contracts.md`](03-content-and-schema-contracts.md) | The shared schema contracts (Play, Simulation, SimNode, FidelityOutcome, Screen, Mission, UseReview, progress, events, flag, validation). |
| [`04-cluster-1-object-inventory.md`](04-cluster-1-object-inventory.md) | Every Cluster 1 object with IDs: recognition→Play mappings, 6 Plays, 6 sims, literature, missions, use reviews, registry. |
| [`05-experience-signatures-and-fidelity.md`](05-experience-signatures-and-fidelity.md) | The engine, the six signatures, per-field fidelity meaning (establishes / does not establish), reveal resolvers. |
| [`06-play-practice-review-and-change-path.md`](06-play-practice-review-and-change-path.md) | Play contract, Missions, Use Review, Change Path priority + routing. |
| [`07-persistence-events-and-data-minimization.md`](07-persistence-events-and-data-minimization.md) | Migration 0053, load/save, sanitizers, events, the data-minimization matrix. |
| [`08-safety-and-suitability-boundaries.md`](08-safety-and-suitability-boundaries.md) | Layer A/B safety, suitability tiers, per-pathway boundaries, hard prohibitions. |
| [`09-build-sequence-and-decision-traceability.md`](09-build-sequence-and-decision-traceability.md) | Build chronology + the as-designed-vs-as-built audit table + superseded decisions. |
| [`10-testing-and-acceptance-criteria.md`](10-testing-and-acceptance-criteria.md) | The 33 test files by subsystem, shared vs C1, what future clusters must add, acceptance checklist. |
| [`11-reuse-versus-cluster-specific-matrix.md`](11-reuse-versus-cluster-specific-matrix.md) | Shared/reusable vs reusable-if-it-fits vs cluster-specific-derive-independently. |
| [`12-next-cluster-input-contract.md`](12-next-cluster-input-contract.md) | The 24 deliverables Claude Chat must freeze before Claude Code implements. |
| [`13-next-cluster-implementation-recipe.md`](13-next-cluster-implementation-recipe.md) | The 15-step Claude Code recipe + the conflict-handling boundary. |
| [`14-open-gates-known-limitations-and-owner-decisions.md`](14-open-gates-known-limitations-and-owner-decisions.md) | Every unresolved gate, gap, debt, and durable owner decision. |
| [`implementation-manifest.json`](implementation-manifest.json) | Machine-readable manifest (ids, files, signatures, columns, status, gates). |

---

## The core framing (why this matters for future clusters)

Cluster 1 is the **reference implementation, not a universal intervention template.** Future clusters **reuse the product infrastructure** but must **independently derive their behavioral and intervention logic** from the RLC framework. Existing interaction signatures are *options, not mandatory categories*; code convenience must never redefine the framework. See the "What Claude Chat Should Learn From Cluster 1" section that opens the consolidated package.
