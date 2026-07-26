# Difficulty Feeling Chosen — Playbook Experience Design Spec (v1)

**Status:** DESIGN BLUEPRINT for approval. NOT final consumer copy · NOT shipped UI · NOT other clusters.
Representative copy below is **illustrative** (marked _[rep]_) to show voice/shape — it is not final wording.
Consumer-facing Play names are **proposed drafts**; the approved *internal* names remain the source of truth.

**Sources of truth:** the locked Cluster 1 behavioral architecture (`artifacts/behavioral-derivation/
cross-cluster-rule-proposal/cluster1_final_architecture.json`) + the existing "Moving Beyond Rejection"
Playbook shell (`snapshot_clusters`/`data/clusters.json`, cluster 1). No new behavioral content is
introduced; nothing is remapped.

---

## 1. Design goal (the one thing this experience must do)
Move a user **FROM** *"Am I being chosen?"* **TOWARD** *"What is this relationship showing me, and what do
I want to do with that information?"* — **without** assuming why they feel unchosen or what behaviors they
perform. This is the developmental task **Discernment** (Exploration), made practical.

This is the same shift the existing shell already names ("*Why wasn't I enough?*" → "*Was this a good fit
for both?*") — the design makes that shift **actionable** via the three locked plays.

## 2. Integration with the existing "Moving Beyond Rejection" Playbook
The existing shell supplies the **FRAME** (education + worth-protection); the locked architecture supplies
the **PRACTICE** (what to actually do). They compose, not compete:

| Existing shell (frame) | This design adds (practice) |
|---|---|
| Content pillars: *why rejection feels personal · overlooked ≠ unworthy · protect confidence while showing up · you're not the only one* | The **PRESENT → OBSERVE → DECIDE** practice sequence |
| Key takeaway: *"Rejection tells you a relationship wasn't mutual. It doesn't tell you that you weren't worthy."* | T1/T2/T3 operationalize evaluating **mutuality** instead of chosenness |
| Developmental focus: *separate worth from outcomes; evaluate mutual compatibility* | = Discernment, delivered as three concrete practices |

## 2b. Product boundary (corrected in)
The **Relationship Playbook™ is NOT part of the Relationship Companion™.** It may share auth,
infrastructure, design system, or data architecture, but the consumer experiences it as a **distinct
product**. It is not journaling, ongoing coaching, a chatbot, or a course.

| Product | Consumer job |
|---|---|
| Relationship Snapshot™ | Recognition — *"What am I experiencing?"* |
| **Relationship Playbook™** | **Behavioral application — *"What can I actually do differently with what I now understand?"*** |
| Relationship Companion™ | Ongoing navigation — *"Help me navigate what's happening right now."* |
| Relationship Academy | Education — *"Teach me to become better at relationships."* |

## 3. Experience structure (flow)
```
A. Entry & Reframe            (worth ≠ being chosen; introduce Discernment; preview the 3 practices)
B. The practice sequence      PRESENT → OBSERVE → DECIDE   (the spine — always in this order)
     B1  PRESENT — Authentic Self-Presentation      (T1, Tier 1)
     B2  OBSERVE — Reciprocity-Based Investment     (T2, Tier 2 · human-approved)
     B3  DECIDE  — Evidence-Informed Decision-Making(T3, Tier 2 · human-approved)
C. Context-Activated module   Intentional Dating Break   (SHOWN ONLY if a burnout self-check is positive)
D. Close & integration        (the shift as an ongoing skill, not a one-time fix; autonomy; worth intact)
```
The three primary plays are the **smallest sufficient** set (locked). The design must not invent a fourth.

## 4. Per-section design

### A · Entry & Reframe
- **Purpose:** validate the experience without pathologizing; protect worth; introduce Discernment; preview the sequence.
- **Design must encode:** the reframe (rejection = *not mutual*, not *unworthy*); that the work is about **better information**, not becoming "more choosable."
- _[rep]_ "This isn't about becoming easier to choose. It's about getting clearer information — about them, about you, about whether you actually fit — so you can start making choices instead of waiting to be chosen."
- **Guardrails:** no "you feel this way because…"; validate as common experience (existing pillar: *you're not the only one*) **without** claiming what behaviors such users perform.

### B1 · PRESENT — Authentic Self-Presentation  _(T1, Tier 1, STM-0262)_
- **Proposed consumer name (draft):** "Let them meet the real you."
- **Purpose / role in sequence:** provide accurate self-information — the *input* to Discernment.
- **Governing logic the copy MUST preserve:** NOT "be more vulnerable so you'll be chosen." It is: *you can't tell whether someone fits you if they're meeting an edited version of you. Discernment needs accurate information about both people; self-editing degrades it.*
- **Conditional entry:** _[rep]_ "If you notice you shrink your opinions, hide a need, or shape-shift into who you think they want…"
- **The practice (small, graduated, safety-aware):** share one real preference / opinion / need in a low-stakes moment; notice how it's received.
- **What it reveals:** whether someone fits the *real* you — or only the performed version.
- **Expect / tolerate:** it can feel exposing; some people won't want the real you — that's *fit information*, not a verdict on your worth.
- **Context conditions:** authenticity is graduated and safety-aware; not "overshare everything."
- **Micro-practice prompt:** _[rep]_ "Pick one small true thing to say this week. Notice what happens."
- **Traceability:** Emotional Intimacy → **Authenticity**; Discernment (accurate self-information). *Resolves the previously-held CP-06/C1.*

### B2 · OBSERVE — Reciprocity-Based Investment  _(T2, Tier 2 · human-approved, STM-0395/0042/1039)_
- **Proposed consumer name (draft):** "Notice how it flows both ways."
- **Purpose / role:** the **OBSERVATION** component — gather and interpret relational evidence; adjust investment to demonstrated reciprocity/availability/consistency rather than pursuit or a being-selected orientation.
- **Conditional entry:** _[rep]_ "If you notice you give more when the other person gives less — or you're working to win someone over…"
- **The practice:** keep showing interest naturally while leaving enough relational space to observe whether the other person also initiates, follows through, and stays consistent (do their actions match their words?). **Reciprocity is information, not scorekeeping or effort-matching.**
- **What it reveals:** whether investment is **mutual** or one-sided.
- **Expect / tolerate:** reducing pursuit or over-functioning can create uncertainty — you're leaving more relational space and letting the other person's behavior become observable. **No response is itself information.**
- **Context conditions:** attraction still matters — this is *pacing*, not withholding affection. (Cross-phase source STM-1039 is used only as *observe consistency*, never as expecting Exclusivity-level commitment early.)
- **Micro-practice prompt:** _[rep]_ "Keep showing up naturally, and leave enough space to notice whether they also reach out and follow through."
- **Traceability:** Role Functioning → **Reciprocity**; Trust → **Availability**, **Congruence**; Discernment (observe mutual investment).

### B3 · DECIDE — Evidence-Informed Decision-Making  _(T3, Tier 2 · human-approved, STM-0039/0556)_
- **Proposed consumer name (draft):** "Decide from what you actually see."
- **Purpose / role:** the **DECISION** component — use *sufficient* accumulated evidence to continue, deepen, slow, or discontinue investment, instead of open-ended waiting. Distinct from B2: B2 *gathers/interprets*; B3 *acts*.
- **Conditional entry:** _[rep]_ "If you find yourself waiting a long time, hoping they'll finally decide about you…"
- **The practice (condition-based, NOT calendar-based):** name what you'd need to **see** — a specific, observable change or reciprocation — then decide from what actually happens. **No arbitrary timelines.**
- **What it reveals:** whether it's genuinely moving, or you're waiting on hope.
- **Expect / tolerate:** deciding can mean loss; you may have to act on what you see.
- **Context conditions:** repair vs waiting depends on *observable change*; the evidence, not a date, drives the decision.
- **Micro-practice prompt:** _[rep]_ "Name one thing you need to see. Let what happens next inform your move."
- **Traceability:** Role Functioning → **Boundaries**; Trust → **Accountability**; Discernment (informed decision).

### C · Context-Activated module — Intentional Dating Break  _(STM-0177, Tier 1, NOT in the primary sequence)_
- **Gating (required):** surfaces **only** when a short self-check is positive — _[rep]_ "Does dating feel exhausting or hopeless right now?" If no, this module is not shown. It is **not** a universal step.
- **Purpose:** distinguish a *chosen rest* from *avoidant withdrawal*.
- **The practice (intentionality-first; duration OPTIONAL):** distinguish intentional rest from avoidant withdrawal by naming *what* you're stepping away from, *what the break is for*, and *what would tell you you're ready to reassess*. A reassessment date is **optional, never required** — no fixed calendar duration.
- **Design rule:** never present as required; never imply every user needs a break. Keep visually/structurally separate from A–B–D.
- **Traceability:** Role Functioning → **Intentionality**.

### D · Close & Integration
- Restate the shift; frame the three practices as an **ongoing skill (Discernment)**, not a one-time fix; reaffirm **autonomy** (the person decides what to do with what they learn) and **worth** (separate from any single outcome).

## 5. Guardrail enforcement (baked into the design, not left to the writer)
1. **Conditional entry everywhere** ("If you notice yourself…") — the experience never asserts *"people who feel unchosen do X."*
2. **No psychological mechanism** — never "because you fear abandonment / because of low self-worth."
3. **No prevalence attribution** — cross-cluster behaviors (T2/T3) are offered as *pathways you may recognize*, never as traits of this result.
4. **No calendar timelines** — B3 is condition/evidence-based only.
5. **Worth-preserving, non-pathologizing tone** — the reframe (worth ≠ chosenness) is load-bearing; the content names an *experience*, never a defect.
6. **Autonomy-preserving** — the Playbook *informs* Discernment; the user decides.
7. **Excluded content stays excluded** — no "stop dismissing available people" (HELD), no "check red flags" (REJECTED).
8. **Emotionally-sensitive safety** — this cluster includes painful self-talk (e.g. "I feel broken"). Tone is validating, never shaming; crisis-level content is out of scope for the Playbook and is handled by the Companion's separate safety layer, which the experience should defer to rather than duplicate.

## 6. This design deliberately does NOT
- write final consumer copy (representative only) · build UI · add primary Plays · introduce new behavioral content · touch other clusters · establish consumer-facing Play names as final.

## 7. Traceability map
| Section | Play (internal) | Tier | Statement IDs | Competency | Discernment role |
|---|---|---|---|---|---|
| B1 PRESENT | Authentic Self-Presentation | 1 | STM-0262 | Emotional Intimacy → Authenticity | Accurate self-information |
| B2 OBSERVE | Reciprocity-Based Investment | 2 (HA) | STM-0395/0042/1039 | Role Fn → Reciprocity; Trust → Availability/Congruence | Observe mutual investment |
| B3 DECIDE | Evidence-Informed Decision-Making | 2 (HA) | STM-0039/0556 | Role Fn → Boundaries; Trust → Accountability | Informed decision |
| C (context) | Intentional Dating Break | 1 | STM-0177 | Role Fn → Intentionality | Intentional rest vs avoidance |

## 8. Open questions for the next phase (copy / build)
- Final **consumer-facing Play names** (internal names are behavioral, not marketing).
- **Medium / interaction model:** self-guided reading? interactive prompts? journaling inside the Companion PWA? (The Companion already hosts guided experiences with reflection blocks — a likely home.)
- How the three practices interleave with the existing shell's **educational** content and the Companion's journaling/safety layers.
- **Progress signal:** how we'd know a user is performing Discernment better (self-report? behavior-tracking?) — for a later measurement design.
