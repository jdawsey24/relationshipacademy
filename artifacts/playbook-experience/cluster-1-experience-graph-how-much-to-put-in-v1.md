# Experience Content Graph — "How Much to Put In" (`investmentView`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Authoring artifact only — **no code, no migration, no
wiring, no deploy.** Third of four (order: Is This Right for You? ✅ → Rest, or Giving Up? ✅ →
**How Much to Put In** → Say the Real Thing). Say the Real Thing is **not** authored yet. The two
existing Experiences and the RLC framework are unchanged.

**Play:** How Much to Put In · **Signature:** `investmentView` · **Provisional sim id:**
`sim-hmp-investment-view` (v1) · **Handoff Play id:** `how-much-to-put-in` *(Play not built yet —
provisional).*

Built entirely from existing node primitives (`moment` · `decision` · `capture` · `note` ·
`reveal` · `teach`) — **no new node kinds** (owner decision #7).

**Owner decision #3 honored:** *"give a little less"* is a legitimate investment option, **never**
framed as withdrawal, game-playing, or a way to provoke pursuit; **no partner reaction is ever shown
as caused by the user's investment choice** — the other person's beats are fully authored and
independent. **Excluded vocabulary that never appears** (as a modeled move): *stop texting first ·
mirrored response times · making someone chase · withholding · scorekeeping · tit-for-tat.* Uses the
observable tightening: the target is *investment that increased **without corresponding new
relational evidence***, never "driven by anxiety/hope."

---

## 1. Premise & teaching target

A dating sequence over a few weeks delivers information in **varying amounts** — a clearly-mutual
stretch, a quiet lull with nothing new, then a warm reach-out that is **authored to occur regardless
of anything the user did.** At each stretch the user chooses their **own** next level of investment,
then **names the evidence that was actually present.** The teaching target is the honest pairing:
**"What did I have to go on when I decided to put in more?"** — surfacing, observably, any moment
where **effort went up while new relational evidence did not.**

Non-negotiables baked into every branch:
- **The other person's beats are independent of the user's investment.** Nothing the user chooses
  changes what the person does; the round-3 reach-out is explicitly *not* caused by the user easing
  off (this is what keeps the Experience from teaching provoke-pursuit).
- ***"Give a little less"* means easing off effort that isn't being met so what's there becomes
  observable** — never a test/withdrawal/tactic, never about matching anyone's effort or timing.
- **No outcome scoring, no scorekeeping, no partner data, no trait/etiology inference,
  observation-not-trait phrasing, JIT Exposure only.**

---

## 2. Node index (flow)

```
hmp-n1 (moment: a few weeks in, going well; you'll choose how much to put in, a few times)
   → ROUND 1 — hmp-n2 (moment: a clearly-mutual stretch; evidence PRESENT)
        → hmp-d1 (decision: investment — keep / more / less / clarify)
           → hmp-cap1 (capture: "What did you have to go on when you chose that?")
              → keyed teaching note  → hmp-n3
   → ROUND 2 — hmp-n3 (moment: a quiet lull; NO new evidence)
        → hmp-d2 (decision: investment)
           → hmp-cap2 (capture: evidence-naming)
              → keyed teaching note  → hmp-n4
   → ROUND 3 — hmp-n4 (moment: a warm, unprompted reach-out — INDEPENDENT of the user's choices)
        → hmp-note-independence (their move was theirs, whatever you chose)
           → hmp-d3 (decision: investment)
              → hmp-cap3 (capture: evidence-naming)
                 → keyed teaching note  → hmp-reveal
   → hmp-reveal (each step you took, next to what was actually there; independence restated; no score)
   → hmp-teach (terminal handoff → "How Much to Put In" Play)
```

Each round's `decision` + `capture` resolve to **one keyed teaching note** via the rule table in §4
(five distinct notes total, reused across rounds — no combinatorial fan-out).

---

## 3. Every node — exact consumer copy

### hmp-n1 — `moment` (setup)
> You've been talking to someone for a few weeks, and it's been good — you like them, and it feels
> like it might be going somewhere. Over the next stretch you'll get to choose, a few times, how
> much to put in.

`next → hmp-n2`

### hmp-n2 — `moment` (Round 1 — clearly mutual; evidence present)
> This week it's clearly mutual: they text first a couple of times, they follow through on a plan
> they'd suggested, they ask you something real about your week.

`next → hmp-d1`

### hmp-d1 / hmp-d2 / hmp-d3 — `decision` (investment — same four options each round)
> **What do you want to do with your investment right now?**

| Option | Inline feedback | → |
|---|---|---|
| "Keep it about where it is." | "A real choice." | `hmp-cap{N}` |
| "Give a little more." | "Okay." | `hmp-cap{N}` |
| "Give a little less." | "Worth being clear about what that means." | `hmp-cap{N}` |
| "Clarify something first." | "Often the cleanest move." | `hmp-cap{N}` |

*(The investment choice is recorded for the mirror; combined with the evidence-naming below it
selects the keyed note — §4.)*

### hmp-cap1 / hmp-cap2 / hmp-cap3 — `capture` (evidence-naming; single-select)
> **What did you have to go on when you chose that?**

- "A new sign it's mutual — they reached out / made a plan / followed through."
- "Nothing new, really — it's been quiet, or I just felt like it."
- "Not sure."

`next → {keyed teaching note per §4}`

### hmp-n3 — `moment` (Round 2 — a quiet lull; no new evidence)
> Then it goes quiet. Three days, nothing wrong — no fight, no weirdness — just… less. You've picked
> up your phone to text twice and put it back down.

`next → hmp-d2` · **JIT hook available** (§6): *"Effort that outruns the evidence."*

### hmp-n4 — `moment` (Round 3 — a warm reach-out, independent of the user)
> A few days later, out of nowhere, they send a warm, real message — picking up a thread from
> before, glad to hear from you.

`next → hmp-note-independence`

### hmp-note-independence — `note` (kills the provoke-pursuit inference)
> Before you choose — notice this: that message would have come, or not, whatever you'd done in the
> quiet stretch. Their move is theirs. Nothing you did (or didn't do) with your own investment made
> it happen. That's exactly why none of this is about easing off to *get* a response.

`next → hmp-d3`

### Keyed teaching notes (selected by the §4 rule)

**hmp-note-responsive** — *(more / keep) + new mutual signal*
> Your investment moved with a real signal — they met you, and you met them back. That's the whole
> idea: effort going where there's something meeting it.

**hmp-note-effort-no-evidence** — *more + nothing-new / not-sure*
> Worth catching: your effort went up, and there wasn't a new sign it's mutual — it was more the
> quiet, or just the feeling. Reaching out isn't wrong. The move is only to notice which one you're
> doing, so it stays a choice and not a reflex.

**hmp-note-space** — *any "give a little less"* — carries the approved guardrail
> One thing to be clear about, because it gets twisted a lot: giving a little less here **isn't a
> test, a withdrawal, a tactic, or a way to get someone to chase** — and it has nothing to do with
> matching anyone's effort or timing. It just means easing off effort that isn't being met, so that
> what's actually there becomes easier to see.

**hmp-note-clarify** — *any "clarify first"*
> Asking is gathering evidence, not applying pressure. When the information's thin, a clear question
> is often the cleanest move there is.

**hmp-note-hold** — *keep + nothing-new / not-sure*
> Holding steady is a real choice — you're neither chasing a quiet patch nor reading into it. A fine
> place to sit.

Every keyed note routes to the **next round's moment** (`→ hmp-n3` / `→ hmp-n4` / `→ hmp-reveal`).

### hmp-reveal — `reveal` (observed choices + neutral recap — no score, no "right" curve)
> Here's each step you took, next to what was actually there — no score, no "right" curve.
>
> · When it was clearly mutual, you chose: **{round 1 choice}**.
> · When it went quiet, you chose: **{round 2 choice}**.
> · When they reached back out, you chose: **{round 3 choice}**.
>
> And the one worth keeping: their reaching back out wasn't caused by what you chose. The only thing
> that's ever really in your hands here is keeping your investment tied to what you can actually see
> — not to how quiet it got.

*The three `{choice}` slots restate the user's own recorded investment picks (observed choices, not a
measured quantity, not a score); computed in-session, never persisted.*

`next → hmp-teach`

### hmp-teach — `teach` (terminal handoff)
> Out in real life, the move is small and repeatable: before you change how much you're putting in,
> name what you're actually going on. That's the whole tool. Here's the Play.

`toPlayId → how-much-to-put-in` *(provisional — Play not yet built).* Terminal, no `next`.

---

## 4. Authored teaching-branch rule (investment × evidence)

| investment ↓ \ evidence → | **new mutual signal** | **nothing new / not sure** |
|---|---|---|
| **keep** | `hmp-note-responsive` | `hmp-note-hold` |
| **give a little more** | `hmp-note-responsive` | `hmp-note-effort-no-evidence` |
| **give a little less** | `hmp-note-space` (guardrail) | `hmp-note-space` (guardrail) |
| **clarify first** | `hmp-note-clarify` | `hmp-note-clarify` |

- The **guardrail** fires on **every** "give a little less," so the reframe is never missed.
- The **effort-without-evidence** note fires only where it's true: *more* paired with *no new
  signal* — the exact pairing the Experience exists to surface, stated observably.
- No branch shows or implies a partner reaction caused by the user's choice.

---

## 5. Fidelity model (signature-tagged; owner decision #1)

`FidelityOutcome` for `investmentView` (discriminated by `signature: "investmentView"`), two fields,
each `demonstrated | not_demonstrated | not_applicable`. **No score.**

| Signal | `demonstrated` when… | `not_demonstrated` when… | `not_applicable` |
|---|---|---|---|
| `investment_evidence_tied` | **every** "give a little more" the user chose was paired with a **"new mutual signal"** read (increases tracked observable evidence); using "clarify" when evidence was thin also counts | **any** "give a little more" was paired with **"nothing new / not sure"** | the user never increased or clarified (all keep/less) — the tie was never exercised |
| `effort_without_new_evidence_noticed` | at the **lull** (Round 2, no new evidence) the user either did **not** increase (keep/less/clarify), **or** — if they increased — **named the evidence honestly as "nothing new"** (registered the absence) | at the lull the user increased **and** claimed a **"new mutual signal"** that the scenario did not contain (misregistered absence as evidence) | never in v1 (the lull is always present) |

Notes:
- `effort_without_new_evidence_noticed` is the **approved** signal name (DECISION-LOG #23) — it
  describes the observable effort↔evidence relationship and **does not infer why** the user increased
  effort; the pack's `compensatory_effort_recognized` was rejected as implying a causal/functional
  reading the Experience does not establish. `investment_evidence_tied` is unchanged from the pack.
- Nothing about *how the person responded* is measured; nothing responds.
- `not_demonstrated` is **non-punitive** — informs in-session reflection / Play context / literature
  surfacing only. JIT views never change a signal (Exposure only).

---

## 6. JIT literature hooks (Exposure only — proposed anchors)

| Anchor node | Proposed JIT entry id | Working title | Function |
|---|---|---|---|
| `hmp-n3` / `hmp-note-effort-no-evidence` | `lit-jit-effort-outruns-evidence` | "Effort that outruns the evidence" | names investment rising without new evidence |
| `hmp-note-space` | `lit-jit-relational-space` | "What relational space actually is" | the approved space-creation guardrail read |
| `hmp-cap1` | `lit-jit-mutual-signal` | "What counts as a mutual signal" | grounds "evidence" in observable initiation/follow-through |

Exposure only — optional, never required, never advances Attempt / Technique Fidelity / Transfer.
Entry ids are proposals; literature authored later.

---

## 7. Safety / suitability boundaries

- **Not a pacing question when the real issue is different.** If the real situation is being **treated
  badly** or someone being **unavailable/mistreating**, that is **not** something to solve by
  adjusting investment — the guardrail is surfaced, and a situation meeting the **already-approved**
  persistence/pervasiveness or Layer-A crisis criteria routes to **support / excluded** (Safety Layer
  V2). This Experience adds **no new detection** and persists **no raw disclosure**.
- **No free-text surface** — all inputs are bounded selects; there is no user-authored disclosure
  inside this Experience.

---

## 8. Minimal persistence payload

Signature-tagged `FidelityOutcome` + `completed` (matching the discriminated architecture). No stance
enum is needed for this signature.

```
{
  object_type: "simulation",
  object_id:   "sim-hmp-investment-view",   // provisional
  object_version: 1,
  signature: "investmentView",
  completed: true,
  fidelity: {
    investment_evidence_tied:             "demonstrated" | "not_demonstrated" | "not_applicable",
    effort_without_new_evidence_noticed:  "demonstrated" | "not_demonstrated" | "not_applicable"
  }
}
```

- **Ephemeral / never persisted:** the scenario, the person's beats, every investment choice and
  evidence-naming, the mirror's recorded-choice recap. **Never exists:** any effort/pacing score, any
  tally of who-did-what, any partner data. **No free text anywhere.**

---

## 9. Conceptual-drift guards checked (this graph)

- ✅ **Other person's beats independent of the user's investment** — round-3 reach-out is explicitly
  *not* caused by the user easing off (`hmp-note-independence` + restated in the mirror).
- ✅ **"Give a little less" is legitimate, never withdrawal/tactic/provoke-pursuit** — the guardrail
  fires on every use.
- ✅ **Excluded vocabulary never modeled** (stop-texting / mirroring / making-them-chase / withholding
  / scorekeeping / tit-for-tat) — the guardrail names and disclaims them.
- ✅ **No scorekeeping, no "right" investment curve** — the mirror recaps observed choices only.
- ✅ **Observable language** — the target is "effort up without new evidence," never "driven by
  anxiety/hope."
- ✅ **Distinct from `evidenceTimeline`** — the object here is the user's **own investment calibration
  against evidence over time**, and the person is **non-reactive**; RD reads the other's signals.
- ✅ **Observation-not-trait; JIT Exposure only; no free-text surface.**

---

## 10. Open items surfaced by authoring (for owner note — not blockers)

1. **Handoff Play id + sim id** provisional; finalized when the Play is built.
2. **Fidelity signal names — RESOLVED (DECISION-LOG #23):** `effort_without_new_evidence_noticed`
   approved (observable effort↔evidence relationship, no inferred cause); `investment_evidence_tied`
   unchanged.
3. **Three JIT entry ids** are proposals to author in the literature layer.
4. **Round count** — v1 uses three rounds (mutual → lull → independent return). If you want a fourth
   contrast beat, it slots in without structural change.

**Next (on approval of this graph):** author **Say the Real Thing** (`communicationRehearsal`) — the
final Experience, still design/copy only. No code, migration, wiring, or deploy until you approve the
full set.
