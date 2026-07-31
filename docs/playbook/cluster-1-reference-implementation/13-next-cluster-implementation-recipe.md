# 13 — Implementation Recipe for a Future Cluster (Claude Code)

**Precondition:** a **frozen, owner-approved package** meeting the 24-item input contract (`12-…`). If it is incomplete, **stop at step 1**.

**The boundary that governs this entire recipe:**
> Claude Code MAY identify implementation conflicts. Claude Code MAY NOT revise the approved **theory, Change Targets, mechanisms, intervention operations, consumer claims, fidelity meanings, or safety boundaries**. Any such conflict must be **returned to the owner and Claude Chat for adjudication** — never resolved unilaterally in code.

This recipe is the generalization of how Cluster 1 was actually built (design-first, one vertical slice at a time, owner gate at each step — DECISION-LOG #28, #39–#46).

---

## Step 1 — Validate package completeness
Check the frozen package against `12-…` (all 24 items; item 24 owner-approved for every object). Missing/ambiguous → **return the gap list to the owner/Claude Chat and stop.** Do not fill gaps by inference.

## Step 2 — Map approved objects to existing schemas
For every object, identify its target schema shape (`Play`, `Simulation`/`SimNode`, `LiteratureEntry`, `Mission`, `UseReview`, `RecognitionCard`, `StatementMapping`) from `03-…`. Confirm each object *can* be expressed in the current schema **without a schema change**.

## Step 3 — Identify existing signatures/primitives that authentically fit
For each Experience operation, check whether an existing `InteractionKind` signature + reveal resolver + fidelity aggregation **authentically** fits (per `11-…` §2). Existing signatures are **options, not mandatory categories** — do not force-fit.

## Step 4 — Identify genuine unmet technical needs
List anything that cannot be expressed with the current shared engine/schema: a genuinely new signature, a new reveal resolver, a new persisted field/column, a new node kind, a new screen kind. Distinguish "a new resolver key" (a small code addition) from "a new schema field or migration" (owner-gated).

## Step 5 — STOP for owner approval before any shared schema or engine change
**Any** change to `FidelityOutcome`, `InteractionKind`, `SimNode`, `Screen`, the persisted progress shape, or a migration requires **explicit owner approval first** — with a demonstrated unmet need (the bar the extended `reveal` node cleared, DECISION-LOG #17/#28). Do not proceed to code on a shared change until approved.

## Step 6 — Implement one vertical slice
Pick one pathway (Cluster 1 started with `dualAttention`). Author its content in one slice file — the Play, the Simulation (with signal tags + reveal config + `teach.toPlayId`), and its JIT entries — plus the fidelity aggregator/resolver if the slice introduces an approved new signature. Wire it into the content registry. **Behind the feature flag; v0 and other clusters untouched.**

## Step 7 — Validate content parity
Run content validation: `validatePlaybookContent` (Plays + recognition) returns `[]`; every Play has an `output` screen and the five `myPlaysTemplate` fields; recognition routing resolves. (Remember the validator gap: also assert Simulations/Missions/Reviews/Literature via tests — `03-…` §8.)

## Step 8 — Validate fidelity aggregation
Unit-test the slice's `aggregateFidelity` across every path (mirror `playbook-dualattention.test.ts` etc.): each fidelity field's `demonstrated`/`not_demonstrated` rule, and that the field's meaning matches the approved "establishes / does not establish" statement (`05-…` §7). Fidelity must read authored `signal`/`fidelity` tags only — never node ids, never JIT (guards G1/G2).

## Step 9 — Validate reveal behavior
Test `resolveRevealContent` for the slice: static `body`, `computedSummary` variant selection, `recap` mapping, and `reactions` passthrough as authored. Confirm the reveal reports **observed choices, never a score/verdict**.

## Step 10 — Validate the full flow: Experience → Play → Mission → Use Review → Change Path
Interaction-test the slice end-to-end (mirror `playbook-experience-rev3.interaction.test.ts`): sim runs first, hands off to the Play at the teach node; Play produces an executable output + My Plays card; Mission selectable; Use Review captures signals; Change Path surfaces the correct next step with the frozen priority; non-attempt is no-fault; discomfort never routes backward after fidelity.

## Step 11 — Test persistence
Unit-test sanitize→save→load for any new state (enum allow-lists + caps; invalid coerced, not stored; unknown keys dropped). Confirm no free text (beyond the bounded `experience` note), no partner data, no narrative is persisted. If a **new column** was approved, ensure the migration is authored and the load/save/sanitize wiring matches.

## Step 12 — Test feature-flag isolation
Confirm v0 (`PLAYBOOK_REV3_ENABLED` off) is unchanged and the other clusters are unaffected (`playbook-experience-rev3.interaction.test.ts` OFF cases). No Rev 3 behavior leaks into v0.

## Step 13 — Run accessibility / mobile review
Keyboard operability, focus-on-transition, live-region neutrality, no serious/critical axe violations on key states; responsive/mobile layout check. (Reuse the a11y patterns; add cluster-specific a11y assertions.)

## Step 14 — Complete owner E2E
Owner walks the assembled cluster (all pathways) **including the authenticated persistence save→reload round-trip** (the item Cluster 1 has still not verified — `14-…`). Record acceptance.

## Step 15 — Separately approve deployment and flag enablement
Deployment and enabling the production flag are **two separate owner approvals**, distinct from implementation completion and from each other. Nothing ships without them.

---

## The conflict-handling rule (restated)
At steps 3, 4, 7, 8, 9, and 11, Claude Code will sometimes find that an approved object doesn't fit the mechanism, or that two approved decisions conflict, or that a consumer claim exceeds what a fidelity field establishes. In every such case:

1. **Document the conflict precisely** (which object, which decision-log entry, which schema/mechanism).
2. **Do not resolve it in code** by bending the operation, renaming a fidelity field, weakening a safety boundary, or inflating a consumer claim.
3. **Return it to the owner and Claude Chat** for adjudication, and pause that slice until resolved.

Claude Code implements the approved intervention system faithfully; it does not redesign it.
