# Cluster 4 — Ratification Reconciliation & the Two Substantive Calls

**Purpose.** Resolve the disagreement between the C4 Part B Ruling Sheet ("all RATIFIED as recommended")
and the package's `27_Pending_Decisions` sheet ("8 OPEN"), and put the two real judgment calls in plain
language so they can be ruled cleanly. **Records decisions; changes no code/content/canon.**

---

## 1. What "RATIFIED as recommended" actually covers

The Ruling Sheet pre-filled every "YOUR RULING" cell with *"ratified as recommended"* — but its own README
says *"the ruling is yours."* So treat it as **recommendations pre-accepted as a default, not a signed
sign-off.** Mapped against `27_Pending_Decisions`, the ten Q-rulings fall into three buckets:

| Ruling-sheet item | Real status | Why |
|---|---|---|
| **Q1 Phase** (Exploration/Discernment) | ✅ **Settled** | Low-risk confirm; evidence is one-way. Stands. |
| **Q2 Partition** (no scaffolding, no quarantine) | ✅ **Settled** | Nothing to rule; clean. Stands. |
| **Q5 Shared-tool boundary** (CP-01 distinct playId/fidelity) | ✅ **Settled** (as a *constraint*; applied at authoring) | Direction is clear. |
| **Q6 Safety RATING** (elevated, no gamification) | ✅ **Settled** (the *rating*) — but see PD-6 for the *content* | Rating vs content are different things. |
| **Q3 Coverage dispositions** (PE-1a/1b split, PE-2/PE-4 targets, PE-3/PE-5a → Recognition/Understand) | ⚠️ **Needs your actual confirm** | This is `PD-1`, still listed OPEN — it's the substance of the cluster's shape, don't inherit "as recommended." |
| **Q4 Grade** (Sufficient-with-Recognition) | ⚠️ **Needs your actual confirm** | This is `PD-7`, still listed OPEN — bounds the product claim. |

Everything else in `27_Pending_Decisions` is **genuinely new** and not covered by any Q-ruling:
`PD-2` (FCQ-C4-02), `PD-3` (OQ-4 gender), `PD-4` (OQ-5 boundary), `PD-5` (fidelity names),
`PD-6` (D19 safety *content* clinical review — you're the clinician), and `PD-8` (the `exposureLoad`
engine change).

**Bottom line:** "ratified as recommended" legitimately settles **4 framing calls** (phase, partition,
shared-tool direction, safety *rating*). It **overreaches** on the **2 substance calls** (coverage
dispositions + grade), which the package itself still lists open. And it **doesn't touch** the **6 new
items** — two of which are the substantive calls below. So **C4 is not ratified yet; the `27_Pending_Decisions`
sheet is the accurate to-do list.** Reconcile the two sheets so they agree, then flip the Gate Status.

---

## 2. Substantive Call #1 — FCQ-C4-02: is "manage your own app exposure" a real tool?

**Plain version.** One of C4's two real tools is about **dating-app burnout**. The more you take in (endless
swiping, dozens of matches at once), the *worse* you get at actually judging anyone — you start rejecting
everyone by default (this is documented "choice overload"). The tool would help someone **deliberately limit
how much they take in** so their judgment works again. The snag: the RLC framework has a skill called
**"Boundaries," but it means boundaries with *another person*** — not "limits you set on your own process."
No existing skill cleanly covers "manage your own exposure."

**Your choice:**
- **A — Approve it as a "Task-Supporting" tool.** = "We don't have a named skill for this, but the framework's
  logic clearly supports it, so we build it at a lower evidence bar, with your explicit OK." *(Same route you
  already approved for Cluster 1's self-worth piece.)*
- **B — Don't.** Treat exposure-management as education/recognition only — name the problem, explain choice
  overload, but don't build it as an intervention tool.

**My steer: A.** It's genuinely intervenable, the mechanism is well-evidenced, and it's the same kind of call
you already made for Cluster 1. Approving it = it becomes a real Play; declining it = it drops to the
Understand layer.

---

## 3. Substantive Call #2 — the `exposureLoad` new signature (an engine change)

**Plain version.** Every interactive tool uses one of a small set of built-in **interaction shapes** (we call
them "signatures" — e.g. "read the evidence over time," "hold two questions at once," "rehearse saying the
real thing"). C4 wants a tool — **"How Many at Once"** — that doesn't fit any existing shape; it's about *how
much you're taking in at once and how that degrades your judgment*. Building it means **adding a new shape to
the app's engine** (new code: a new fidelity structure, a new results screen, a new event type). By our own
rule, **the engine is never extended without your explicit yes** — so convenience never bloats it.

**Your choice:**
- **A — Approve the new `exposureLoad` shape.** Extend the engine once so "How Many at Once" can be built. It's
  a genuine new capability, and any future cluster could reuse it if it fits.
- **B — Don't extend the engine.** Either express "How Many at Once" with an existing shape (only if one can
  authentically carry it), or ship C4 without that specific tool (the exposure piece becomes education-only).

**Important — these two calls are coupled.** `exposureLoad` is the interaction shape *for the very tool*
Call #1 is about (PE-4 / dating-app burnout). So **decide Call #1 first**: if you say **B** to Call #1 (not a
tool), there's no "How Many at Once," and Call #2 disappears. If you say **A** to Call #1, then Call #2 asks
*how* to build it.

**My steer + an offer:** before you approve new engine code, it's worth confirming a new shape is genuinely
needed — that's exactly the "find an authentically-fitting existing primitive before declaring an unmet need"
step in the implementation recipe. **Claude Code can check whether any existing signature can honestly carry
"How Many at Once" first.** If yes → reuse it (no engine change). If no → **A** is the right call, and it'd be
the first genuinely-new shared primitive since Cluster 1 — the engine extended by real need, not convenience.

---

## 4. The rest of the 8 (quick)
- **PD-1** confirm the D4 coverage dispositions (§1 Q3) · **PD-7** confirm the grade (§1 Q4).
- **PD-6** D19 safety *content* — your clinical review (elevated cluster; drafted, not approved).
- **PD-3 / OQ-4** gender branching — the equity-sensitive call; decide explicitly, don't default.
- **PD-4 / OQ-5** the "how to stand out" boundary · **PD-5** fidelity signal names (do-not-revert once frozen).

Once §1 is reconciled, Calls #1–#2 are ruled, PD-6 clinically reviewed, and PD-3/4/5/7 decided, C4 freezes.

---

## 5. Signature-fit check on "How Many at Once" (read-only; run 2026-07-29)

**Question:** can any of the six existing signatures authentically carry the `exposureLoad` Experience, or is a
new signature genuinely required? Compared C4's D10/D11/D12 specs against the six live/approved signatures in
`lib/playbook/contentSchema.ts` (`InteractionKind`, `FidelityOutcome`) + `SimulationSignatures.tsx`.

**Verdict: a new signature IS genuinely warranted (real need, not convenience) — but the cost is bounded, and
only the *Experience* needs it, not the tool.**

**Why no existing signature fits.** The operation is *reduce concurrent evaluation load so each person is judged
on their own evidence*; the interaction is **three rounds with rising load**, fidelity = a **within-session
trend (last decision vs first)** + a **terminal self-set numeric limit** (`concurrent_load_reduced`,
`individual_assessed_on_own_evidence`). Three features none of the six have:
1. **Accumulating load across repeated rounds** — every existing signature reads a *single* decision moment (the
   four choice-computed) or one person's evidence unfolding (evidenceTimeline/conclusionNarrowing); none tracks
   judgment degrading as load rises.
2. **A first-vs-last trend as the signal** — needs a new reveal resolver (`exposureLoadOutcome`) that *compares*
   rounds; no existing resolver does.
3. **Self-regulating your own intake volume**, not appraising the other person (the FCQ-C4-02 object).

Nearest reuses both fail honestly: **decisionRoom** shares only the terminal "set a limit / pause" tail but
measures intentional-rest-vs-avoidance and has no load mechanic; **investmentView** ties investment to *one
person's* evidence, not aggregate concurrency — reuse would make "how many at once" masquerade as "how much into
this one" (the masking-a-poor-fit case). **The pipeline stopped correctly.**

**Two things that shrink Call #2 from "novel engine work" to "bounded + sequenced":**
- **Not a new *kind* of engine — one more member of a union Cluster 1 already generalizes.** `exposureLoad` is
  **choice-computed**, like Cluster 1's four new signatures → one more `FidelityOutcome` union variant + one
  aggregator branch + one title/chrome entry; the *only* new primitive is the cross-round `exposureLoadOutcome`
  reveal resolver. So it **rides on Cluster 1 Phase B** (discriminated union + per-signature aggregation +
  extended reveal) — **unbuilt/uncommitted today**. PD-8 is therefore *downstream of Cluster 1 Phase B*, not a
  standalone C4 decision.
- **The tool doesn't need the new signature — only the bespoke Experience does.** The D13 **Play** "How Many at
  Once" is authored from existing primitives (`ownTurn → sufficiency → ruleBuilder → output`); only the D11
  **Experience** (the load-degradation rehearsal) proposes `exposureLoad`. The intervention can ship without it.

**Call #2, narrowed:**
- **A** — Approve `exposureLoad`, **sequenced after Cluster 1 Phase B**. Justified; first new primitive since
  Cluster 1; cost = one union variant + one aggregator + one new reveal resolver.
- **B** — Reuse decisionRoom/investmentView. Distorts the operation; not recommended.
- **C** — Ship the Play now (existing primitives), defer the bespoke Experience until Phase B lands.

**Steer: A in principle, C for sequencing** — approve the new signature as warranted, but don't build it
standalone; it's gated behind Cluster 1 Phase B, and until then "How Many at Once" ships as a Play on existing
primitives. Nothing about the new signature needs to block C4's intervention.
