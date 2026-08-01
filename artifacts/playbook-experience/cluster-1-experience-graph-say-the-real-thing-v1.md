# Experience Content Graph — "Say the Real Thing" (`communicationRehearsal`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Authoring artifact only — **no code, no migration, no
wiring, no deploy.** Fourth and final (order: Is This Right for You? ✅ → Rest, or Giving Up? ✅ →
How Much to Put In ✅ → **Say the Real Thing**). The two existing Experiences and the RLC framework
are unchanged.

**Play:** Say the Real Thing · **Signature:** `communicationRehearsal` · **Provisional sim id:**
`sim-stt-rehearsal` (v1) · **Handoff Play id:** `say-the-real-thing` *(Play not built yet —
provisional).*

Built entirely from existing node primitives (`moment` · `decision` · `note` · `reveal` · `teach`)
— **no new node kinds** (owner decision #7). **No free-text surface** — owner decision #4 sets v1 to
**select-a-phrasing**, not free compose.

**Owner decision #4 honored:** v1 uses **select-a-phrasing** (authored sentences, no free compose);
each moment shows **exactly three clearly-labeled hypothetical reactions**; the Experience stays
limited to **low-risk preferences, opinions, and small requests.** The success criterion is **not**
whether the other person likes the response; the user's choice **never selects** which reaction
occurs. Applies the observable-signal philosophy of DECISION-LOG #23 to the fidelity names (see §5).

---

## 1. Premise & teaching target

Three realistic **low-risk** relational moments (a plan preference, a differing opinion, a small
request) each tempt the user to **edit, soften, agree automatically, or bury a genuine preference in
apology** to stay likable. The user **selects a phrasing.** Then a **spread of three authored,
clearly-labeled hypothetical reactions** is shown — *the same three regardless of what the user
chose* — to teach one thing: **expressing something real gives you information about fit, whatever
the reaction.** The rehearsal target is the **clarity and non-self-erasure of the user's own
expression**, never the reaction.

Non-negotiables baked into every branch:
- **The user's choice never controls the other person's reaction.** The three-reaction spread is
  fixed per moment and shown in full on every path, making the decoupling explicit.
- **Success is not "did they like it."** No reaction is scored, ranked, or treated as failure.
- **Low-risk only (R1).** Higher-risk / more-demanding material is out of scope and routes to the
  already-approved supported/excluded routes (§7).
- **No outcome scoring, no partner data, no trait/etiology inference, observation-not-trait,
  JIT Exposure only, no free-text surface.**

---

## 2. Node index (flow)

```
stt-n1 (moment: framing — low-risk moments where saying the real thing is safe to practice)
   → MOMENT 1 — stt-m1 (moment: a plan/time preference)
        → stt-d1 (decision: SELECT-A-PHRASING — 4 authored phrasings)
           → keyed note (clear / erase / apologize)  → stt-spread1 (reveal: 3 labeled reactions) → stt-m2
   → MOMENT 2 — stt-m2 (moment: a differing opinion)
        → stt-d2 (decision: select-a-phrasing)
           → keyed note  → stt-spread2 (reveal: 3 labeled reactions) → stt-m3
   → MOMENT 3 — stt-m3 (moment: a small request)
        → stt-d3 (decision: select-a-phrasing)
           → keyed note  → stt-spread3 (reveal: 3 labeled reactions) → stt-reveal
   → stt-reveal (light recap of observed choices + the decoupling reminder; no score)
   → stt-teach (terminal handoff → "Say the Real Thing" Play)
```

Each `decision`'s four phrasings are **class-tagged** (auto-agree · soften-to-vanish · clear ·
over-apologize) and route to one of three **shared keyed notes** (§3, by class), then to that
moment's fixed **three-reaction spread.**

---

## 3. Every node — exact consumer copy

### stt-n1 — `moment` (framing)
> A few small moments coming up — the kind where it's easy to smooth yourself over to keep things
> nice. Nothing high-stakes here. Just practice saying the real thing, and seeing what you learn
> when you do.

`next → stt-m1`

### The reusable phrasing set (per `decision`) and the three keyed notes

Each moment's `decision` presents **four authored phrasings** (actual sentences, moment-specific in
§3a–c below), each tagged by **class**. The class routes to one of these **three shared keyed
notes**, which then routes to that moment's spread:

**stt-note-clear** — *class: clear*
> You said it — plainly, and kindly. That's the whole move. Now watch what comes back: whatever it
> is, it's information about fit, and it's information you only get *because* you said it.

**stt-note-erase** — *class: auto-agree / soften-to-vanish*
> Smooth — and also, nothing happened. When you go along or let it drop, there's nothing real to
> respond to, so there's nothing to learn. Here's what saying it could have told you →

**stt-note-apologize** — *class: over-apologize*
> You got there — and then spent it on "sorry." The real thing can stand on its own; it doesn't need
> the apology wrapped around it. Here's what came back to what you said →

*(All three then display the same moment spread. Consumer never sees the class labels.)*

### stt-m1 — `moment` (Moment 1 — a plan/time preference) · **JIT:** *"Self-editing to stay likable."*
> They suggest meeting at 8. You'd genuinely rather do earlier — you're wiped by 8 on a weeknight.
> There's a half-second where "sure, 8's fine!" is already forming.

`next → stt-d1`

### stt-d1 — `decision` (select-a-phrasing)
| Phrasing (what you'd actually say) | class | → |
|---|---|---|
| "Sure, 8 works!" | auto-agree | `stt-note-erase` → `stt-spread1` |
| "Maybe-ish? Whatever's easiest for you, honestly." | soften-to-vanish | `stt-note-erase` → `stt-spread1` |
| "Could we do earlier? 8's a stretch for me on a weeknight." | **clear** | `stt-note-clear` → `stt-spread1` |
| "Sorry — I know this is so annoying — it's just, maybe earlier? Only if that's totally fine!" | over-apologize | `stt-note-apologize` → `stt-spread1` |

### stt-spread1 — `reveal` (three labeled hypothetical reactions — fixed, decoupled)
> Here are three ways that can land. You don't control which — and **any of them can happen.** Each
> tells you something.
>
> · **It lands easily:** "Oh, earlier's better for me too, honestly."
> · **They'd prefer otherwise:** "I'd rather keep it at 8 — that work for you?"
> · **They meet you partway:** "Hmm, I kind of wanted later — split the difference at 7:30?"
>
> None of these is a failure. All three are just information about how this person meets a small,
> real preference — which is exactly what you wanted to find out.

`next → stt-m2`

### stt-m2 — `moment` (Moment 2 — a differing opinion) · **JIT:** *"A real answer is information, not a risk."*
> They're raving about a movie they loved — the one you thought was kind of a slog. "Wasn't it
> amazing? What'd you think?"

`next → stt-d2`

### stt-d2 — `decision` (select-a-phrasing)
| Phrasing | class | → |
|---|---|---|
| "Yeah, totally — so good!" | auto-agree | `stt-note-erase` → `stt-spread2` |
| "I mean… it was interesting? I can see why people like it." | soften-to-vanish | `stt-note-erase` → `stt-spread2` |
| "Honestly, it didn't really land for me — I found it kind of slow. Curious what grabbed you, though." | **clear** | `stt-note-clear` → `stt-spread2` |
| "Don't hate me! I know everyone loved it — I'm probably wrong — but I didn't totally get it? Sorry." | over-apologize | `stt-note-apologize` → `stt-spread2` |

### stt-spread2 — `reveal`
> Three ways it can go — any of them can happen, and none is a wrong outcome:
>
> · **It lands easily:** "Ha, fair — it's definitely not for everyone."
> · **They'd prefer otherwise:** "Really? I could talk about it for an hour — let me defend it."
> · **They meet you partway:** "Yeah, the pacing's rough — I just loved the ending."
>
> Notice: a different opinion, said plainly and kindly, didn't blow anything up. It just started a
> real conversation — and told you something about how they handle not-agreeing.

`next → stt-m3`

### stt-m3 — `moment` (Moment 3 — a small request) · **JIT:** *"Saying it kindly and clearly aren't opposites."*
> You'd genuinely prefer the coffee place near you over the bar across town they suggested — you've
> got an early start. Easy to just say "the bar's fine."

`next → stt-d3`

### stt-d3 — `decision` (select-a-phrasing)
| Phrasing | class | → |
|---|---|---|
| "The bar's fine!" | auto-agree | `stt-note-erase` → `stt-spread3` |
| "Wherever, really — I don't mind, you pick." | soften-to-vanish | `stt-note-erase` → `stt-spread3` |
| "Would you be up for the coffee place near me instead? I've got an early start." | **clear** | `stt-note-clear` → `stt-spread3` |
| "This is so high-maintenance of me, sorry — any chance we could do somewhere near me? Totally fine if not!" | over-apologize | `stt-note-apologize` → `stt-spread3` |

### stt-spread3 — `reveal`
> Three ways it can land — you don't pick which, and each is just information:
>
> · **It lands easily:** "Coffee near you? Done — easier for me too."
> · **They'd prefer otherwise:** "I had my heart set on the bar — could we do your spot next time?"
> · **They meet you partway:** "How about somewhere in the middle so we both travel a bit?"
>
> A small, clear request — no apology tax required. However they answered, you now know a little
> about how they handle one.

`next → stt-reveal`

### stt-reveal — `reveal` (light recap — observed choices, no score)
> Across those three, here's what you did — no grade, no "right" answer:
>
> **{recap line — see below}**
>
> The point was never whether they liked it. Every time you said the real thing, you got something
> back to learn from. Every time you smoothed it over, there was nothing to learn. That's the whole
> trade.

**Recap line — one authored line, from the observed choices (not a score, not a trait):**
- said it clearly in all/most moments → *"You mostly said the real thing — clearly, and without
  disappearing."*
- mixed → *"Some you said straight; some you smoothed over. Both are visible now — that's the useful
  part."*
- mostly self-erased → *"You leaned toward keeping it smooth. Worth noticing — because smooth is the
  one that leaves you with nothing to learn."*

`next → stt-teach`

### stt-teach — `teach` (terminal handoff)
> Out in real life, the move is one clear sentence — said kindly, without the disappearing act and
> without the apology tax. You won't control how it lands, and that was never the point: saying it
> is how you find out. Here's the Play.

`toPlayId → say-the-real-thing` *(provisional — Play not yet built).* Terminal, no `next`.

---

## 4. Authored teaching-branch logic

- **Class → keyed note** (shared across moments): `clear → stt-note-clear` · `auto-agree /
  soften-to-vanish → stt-note-erase` · `over-apologize → stt-note-apologize`.
- **The three-reaction spread is identical regardless of the chosen phrasing** and is shown on every
  path — this is the mechanism that decouples expression from outcome. On self-erase paths it teaches
  the *forfeited* information ("here's what saying it could have told you"); on the clear path it
  teaches that a range of reactions is normal and none is a failure.
- No branch grades or ranks a reaction; no branch implies the user's phrasing caused a reaction.

---

## 5. Fidelity model (signature-tagged; owner decision #1)

`FidelityOutcome` for `communicationRehearsal` (discriminated by
`signature: "communicationRehearsal"`), two fields, each `demonstrated | not_demonstrated |
not_applicable`. **No score.** Both are **observable, choice-based** signals (applying DECISION-LOG
#23's principle — describe the observable expression, don't infer an internal state):

| Signal | `demonstrated` when… | `not_demonstrated` when… | `not_applicable` |
|---|---|---|---|
| `preference_expressed_clearly` | the genuine preference was **stated** with sufficient clarity in **≥2 of 3** moments (classes **clear** or **over-apologize** state it; auto-agree / soften-to-vanish do not) | it was stated in **<2** of 3 moments | never in v1 (three moments always run) |
| `unnecessary_self_erasure_avoided` | the phrasing **avoided unnecessary self-erasure** in **≥2 of 3** moments (only the **clear** class avoids it; auto-agree, soften-to-vanish, and over-apologize each erase in some way) | erasure occurred in **≥2 of 3** moments | never in v1 |

Notes:
- **Signal names APPROVED (DECISION-LOG #26).** They refine the pack's `expressed_clearly` /
  `self_erasure_recognized` toward observable, choice-based language — `self_erasure_recognized`
  implied an internal "recognition" the Experience doesn't establish; `unnecessary_self_erasure_avoided`
  describes only what the selected phrasing did.
- **The reaction is never a fidelity input.** Whether the authored other-person "liked" it is
  irrelevant to both signals, by design.
- `not_demonstrated` is **non-punitive** — informs in-session reflection / Play context / literature
  surfacing only. JIT views never change a signal (Exposure only).

---

## 6. JIT literature hooks (Exposure only — proposed anchors)

| Anchor node | Proposed JIT entry id | Working title | Function |
|---|---|---|---|
| `stt-m1` | `lit-jit-self-editing` | "Self-editing to stay likable" | names the erase reflex |
| `stt-m2` | `lit-jit-answer-is-information` | "A real answer is information, not a risk" | reframes expressing as fit-finding |
| `stt-m3` | `lit-jit-kind-and-clear` | "Kind and clear aren't opposites" | dissolves the apology-tax reflex |

Exposure only — optional, never required, never advances Attempt / Technique Fidelity / Transfer.
Entry ids are proposals; literature authored later.

---

## 7. Safety / routing boundary

- **R1, low-risk only.** This Experience rehearses **low-risk** authentic expression (preferences,
  opinions, small requests) in a reasonably safe context — the approved R1 lane.
- **Higher-risk / more-demanding material is out of scope** (confronting mistreatment,
  high-consequence disclosure, an unsafe partner) and belongs in the **already-approved supported or
  excluded routes** — the Experience does not coach it. A real situation meeting the approved
  persistence/pervasiveness or Layer-A crisis criteria routes accordingly (Safety Layer V2); this
  Experience adds **no new detection** and persists **no raw disclosure.**
- **No free-text surface** — select-a-phrasing only (decision #4), so there is no user-authored
  disclosure inside this Experience.

---

## 8. Minimal persistence payload

Signature-tagged `FidelityOutcome` + `completed`. No stance enum is needed for this signature.

```
{
  object_type: "simulation",
  object_id:   "sim-stt-rehearsal",   // provisional
  object_version: 1,
  signature: "communicationRehearsal",
  completed: true,
  fidelity: {
    preference_expressed_clearly:      "demonstrated" | "not_demonstrated" | "not_applicable",
    unnecessary_self_erasure_avoided:  "demonstrated" | "not_demonstrated" | "not_applicable"
  }
}
```

- **Ephemeral / never persisted:** the scenario, the selected phrasings, the reaction spreads, the
  recap. **Never exists:** any "did they like it" score, any partner data. **No free text anywhere.**

---

## 9. Conceptual-drift guards checked (this graph)

- ✅ **The user's phrasing never controls the reaction** — the three-reaction spread is fixed and
  shown in full on every path.
- ✅ **Success is not "did they like it"** — no reaction is scored, ranked, or called a failure.
- ✅ **Not assertiveness-for-outcomes; not scripting** — it rehearses *clarity + non-erasure*, and
  the reactions are decoupled information, not results to engineer.
- ✅ **Low-risk only; higher-risk routes out** (R1 boundary preserved).
- ✅ **Observable, choice-based fidelity** — `unnecessary_self_erasure_avoided` describes the
  phrasing, not an inferred "recognition."
- ✅ **Observation-not-trait recap; no score; JIT Exposure only; no free-text surface.**

---

## 10. Open items surfaced by authoring (for owner note — not blockers)

1. **Handoff Play id + sim id** provisional; finalized when the Play is built.
2. **Fidelity signal names — RESOLVED (DECISION-LOG #26):** `preference_expressed_clearly` /
   `unnecessary_self_erasure_avoided` approved (observable, choice-based; consistent with #23).
3. **Three JIT entry ids** are proposals to author in the literature layer.
4. **Moment count** — v1 uses three low-risk moments (preference / opinion / request). All stay in
   R1; no "later, more-demanding" material is included, per decision #4.

**Status of the set:** with this graph, **all four remaining Cluster 1 Experiences are authored**
(design/copy). Awaiting owner approval of Say the Real Thing. No code, migration, wiring, or deploy
performed; the two existing Experiences (`evidenceTimeline`, `conclusionNarrowing`) and the RLC
framework remain untouched. Implementation (schema `InteractionKind` additions, signature-tagged
`FidelityOutcome`, content transcription, migration, wiring) is a **separate, later** phase requiring
its own approval.
