# Experience Content Graph — "Is This Right for You?" (`dualAttention`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Authoring artifact only — **no code, no migration, no
deploy.** First of four (authoring order: Is This Right for You? → Rest, or Giving Up? → How Much to
Put In → Say the Real Thing). The other three graphs are **not** authored yet. The two existing
Experiences (`evidenceTimeline`, `conclusionNarrowing`) and the RLC framework are unchanged.

**Play:** Is This Right for You? · **Signature:** `dualAttention` · **Provisional sim id:**
`sim-itr-evaluator-stance` (v1) · **Handoff Play id:** `is-this-right-for-you` *(Play not built yet
— target id is provisional).*

Built entirely from existing node primitives (`moment` · `capture` · `decision` · `note` ·
`reconsider` · `reveal` · `teach`) per owner decision #7 — no new node kinds. Honors owner decisions
#1 (signature-tagged fidelity, no score), #2 (`dualAttention` added to `InteractionKind`), #6
(mirror = observed exercise choices + neutral fact recap; an explicit authored respect/treatment
boundary, no "weighing"). Incorporates the four v1 gate revisions: (1) the exclusion beat is reframed
as a respect/treatment *boundary* — not established mistreatment, and treatment is not claimed
unrelated to fit; (2) the mirror reports **observed exercise choices**, not a measured quantity of
attention; (3) `fit_information_used` → **`fit_information_kept_in_view`**; (4) tightened
future-intent copy.

---

## 1. Premise & teaching target

A few dates in with someone **genuinely appealing and clearly interested.** As the evening unfolds,
real *fit* information surfaces (availability, then long-term intent) braided with their obvious
interest. The pull is to let attention collapse onto **"Do they like me?"** while the **"What am I
learning about whether I want this?"** question goes quiet. The Experience rehearses holding **both**
questions. It is **not** about rejecting anyone, and it **never** scores the person or the fit.

A single **respect/treatment-boundary beat** is authored in (a mild dismissive brush-off) to teach
that ordinary fit differences and respect/safety information **should not be handled identically**:
a dismissive moment is information worth **noticing rather than explaining away** because someone is
appealing; **one event does not establish the person's character**; a **repeated** disrespect/
boundary pattern becomes more consequential; and actual coercion/intimidation/abuse remains
**excluded and safety-routed.** It is deliberately **mild** and **non-conclusive** (it draws no
verdict about the person), and it is **excluded** from the fidelity signal.

The other person's lines are **fully authored and independent of the user's choices** — nothing the
user selects changes what they say or do (global contract #1). No outcome is scored (#2); no trait/
intent is inferred (#3); phrasing is observation-not-trait (#4); JIT is Exposure only (#5).

---

## 2. Node index (flow)

```
itr-n1 (moment: appealing opener)
   → itr-n2 (moment: interest + AVAILABILITY fit signal)
      → itr-d1 (decision: "What are you noticing?")
            ├ interest-only / dismissal → itr-note1-widen ┐
            └ fit-aware                 → itr-note1-hold   ┘→ itr-n3
   → itr-n3 (moment: interest + INTENT/long-term fit signal)
      → itr-d2 (decision: "What are you noticing now?")
            ├ smooth-over / dismissal → itr-note2-widen ┐
            └ fit-aware               → itr-note2-hold   ┘→ itr-n4
   → itr-n4 (moment: RESPECT/TREATMENT-BOUNDARY beat — mild dismissive brush-off)
      → itr-d3 (decision: "What did you notice there?")  [all options →]
            → itr-note-exclusion (holds respect info differently from fit; non-conclusive; one event ≠ character) → itr-r1
   → itr-r1 (reconsider: hold-both — where did your attention go?)
            ├ collapsed-to-being-liked → itr-note-r1-collapse ┐
            └ held-both                → itr-note-r1-both      ┘→ itr-reveal
   → itr-reveal (two-column mirror + neutral fact recap; no weighting/score)
   → itr-teach (terminal handoff → "Is This Right for You?" Play)
```

Every capture/decision **rejoins the main line** — no dead ends, no path "wins."

---

## 3. Every node — exact consumer copy

### itr-n1 — `moment` (opener)
> A few dates in with someone you genuinely like. They're warm, they're funny, they remember the
> small stuff you said last time. Tonight's the easy kind of easy — the kind that makes you want it
> to work out.

`next → itr-n2`

### itr-n2 — `moment` (interest + availability fit signal)
> Over dinner they're clearly into it — leaning in, already floating ideas for a next time. Somewhere
> in there they mention, lightly, that they're on the road for work about three weeks out of every
> four this year.

`next → itr-d1` · **JIT hook available here** (see §6): *"Being wanted vs. being a fit."*

### itr-d1 — `decision` ("What are you noticing right now?")
| Option | Inline feedback | → |
|---|---|---|
| "Mostly that they're really into this." | "That part's real." | `itr-note1-widen` |
| "That 'three weeks away' is something I'd want to understand for myself." | "You kept your own question in the room." | `itr-note1-hold` |
| "Nothing worth flagging — it's going great." | "It is going well." | `itr-note1-widen` |

*(Read used for the `fit_information_kept_in_view` signal — see §5.)*

### itr-note1-widen — `note`
> They do seem into it — that's real, and you get to enjoy it. It just doesn't answer your other
> question yet: is *this* — three weeks away most months and all — something *you'd* want? Both
> questions get to stay open.

`next → itr-n3`

### itr-note1-hold — `note`
> You let your own question stay in the room. Liking them and learning whether this fits you are
> allowed to run side by side — that's the whole move.

`next → itr-n3`

### itr-n3 — `moment` (interest + long-term intent fit signal)
> Later, something real comes up — where things could go, further down the line. They stay warm, but
> wave it off with a smile: "Eh — honestly not sure I want the whole settle-down thing. Let's just
> see where it goes."

`next → itr-d2`

### itr-d2 — `decision` ("What are you noticing now?")
| Option | Inline feedback | → |
|---|---|---|
| "They're so easy to be around — I don't want to make it heavy." | "Makes sense." | `itr-note2-widen` |
| "That 'not sure I want to settle down' is information I'd want to keep in view, if long-term direction matters to me." | "You let it land as information." | `itr-note2-hold` |
| "It's probably nothing — people say that." | "Maybe." | `itr-note2-widen` |

### itr-note2-widen — `note`
> Fair not to want to make it heavy. Still — that was real information about how they're talking
> about the future right now. You don't have to *do* anything with it tonight; the move is just to
> let it land as information instead of smoothing it away.

`next → itr-n4`

### itr-note2-hold — `note`
> You let it land as information. That's the evaluator stance — you can hold that they're lovely
> *and* that you just learned something about whether this points where you want to go.

`next → itr-n4`

### itr-n4 — `moment` (respect/treatment-boundary beat — deliberately mild)
> You mention something you've been proud of — a thing you've been building at work. They laugh:
> "Cute. Anyway—" and move straight on.

`next → itr-d3` · **JIT hook available here** (see §6): *"Respect and fit are different kinds of information."*

### itr-d3 — `decision` ("What did you notice there?") — *all options route to the same exclusion note*
| Option | Inline feedback | → |
|---|---|---|
| "A small thing — they're great otherwise." | "Worth pausing on, even so." | `itr-note-exclusion` |
| "That was dismissive of something that matters to me." | "You clocked it." | `itr-note-exclusion` |
| "Not sure — it just sat a little wrong." | "That 'sat wrong' is worth keeping." | `itr-note-exclusion` |

### itr-note-exclusion — `note` (the authored respect/treatment boundary; fires for everyone)
> Here's one worth noticing rather than explaining away. A brush-off like that is information — and
> "they're great otherwise" is exactly the sentence that waves it off when someone's this appealing.
> One moment doesn't tell you who they are. But **information about respect and how you'd be treated
> isn't the same kind of information as whether your schedules or your goals line up** — it's worth
> holding a little differently, not folded in as just another fit trade-off. If that kind of thing
> turned out to be a *pattern*, it would matter more, not less. And anything that ever crossed into
> pressure, intimidation, or feeling unsafe is a different conversation altogether — not a fit
> question, and there's support for that.

`next → itr-r1` · *(This beat is **excluded** from the `fit_information_kept_in_view` signal — see §5.)*

### itr-r1 — `reconsider` (hold-both)
> Two things are true tonight: they seem genuinely into you, **and** you've picked up some real
> information about whether this is something *you* want. Right now — honestly — which one has more
> of your attention?

| Option | `evaluator_stance_held` contribution | → |
|---|---|---|
| "Mostly whether they're into me." | collapse | `itr-note-r1-collapse` |
| "Both — I'm enjoying them *and* keeping my own question open." | held | `itr-note-r1-both` |
| "I'd already decided they were great, so the rest didn't really land." | collapse | `itr-note-r1-collapse` |

### itr-note-r1-collapse — `note`
> Notice where it landed — mostly on "do they want me." That's the exact pull this is about. Nothing
> went wrong; it's just worth seeing, because the *other* question is the one that tells you whether
> **you** want this.

`next → itr-reveal` · **JIT hook available here** (see §6): *"Liking someone vs. choosing someone."*

### itr-note-r1-both — `note`
> You held both — into them, and still asking your own question. That's the move, and it's harder
> than it sounds when someone's this easy to like.

`next → itr-reveal`

### itr-reveal — `reveal` (observed exercise choices + neutral fact recap — no weighting, no score)
> Here's tonight, laid out plainly — no verdict, no score.
>
> **What came up (just the facts):**
> · They're warm, funny, and clearly interested.
> · They're away for work about three weeks a month this year.
> · They said they're not sure they want to settle down.
> · When you shared something you're proud of, they brushed it off — worth noticing rather than
>   explaining away. One moment doesn't define someone; a pattern would matter more.
>
> **Where your choices focused in this exercise:**
> · *{one authored summary — see below}*
>
> That's it. We're not stacking these against each other, and we're not scoring the fit — that's
> yours to decide, out in the world. The only move here was keeping your own question from going
> quiet.

**Authored summary** — exactly one line is shown, selected from the user's choices *in this
exercise* (not a measure of attention, not a percentage, not a trait):
- *"In this exercise, your choices leaned mostly toward whether they were interested."* — when no
  fit-aware read was chosen at `itr-d1`/`itr-d2`, **or** `itr-r1` collapsed to being-liked.
- *"In this exercise, your choices held both streams — their interest and your own read."* — when
  `itr-r1` = "Both…".
- *"In this exercise, your choices kept your own evaluation active."* — when ≥1 fit-aware read was
  chosen but `itr-r1` was not the explicit "Both…" option.

The neutral fact recap is preserved and un-valenced. Selection is computed **in session only** and
**never persisted** (only the two fidelity signals in §8 persist).

`next → itr-teach`

### itr-teach — `teach` (terminal handoff)
> Out in real life, this is the whole tool: when someone's easy to like, keep **both** questions
> open — *do they seem interested*, **and** *what am I learning about whether I want this?* Here's
> the Play.

`toPlayId → is-this-right-for-you` *(provisional — Play not yet built).* Terminal node, no `next`.

---

## 4. Teaching-branch summary

- **Widen branches** (`note1-widen`, `note2-widen`) fire when the user reads interest-only or waves
  the fit signal away. They *validate the interest as real*, then re-open the user's own question —
  never scolding, never concluding anything about the person.
- **Hold branches** (`note1-hold`, `note2-hold`) fire when the user registers the fit signal as
  data. They reinforce the evaluator stance ("both can run side by side").
- **Respect/treatment-boundary branch** (`note-exclusion`) fires for **all** reads of the brush-off
  beat. It teaches that respect/safety information and ordinary fit differences shouldn't be handled
  identically, names one event as *not* establishing character, notes a **pattern** would matter
  more, and routes actual coercion/abuse to support — all non-conclusive about this person, no
  diagnosing.
- **Reconsider branches** (`note-r1-collapse` / `note-r1-both`) mirror where attention landed —
  observationally, no fault.

---

## 5. Fidelity model (signature-tagged; owner decision #1)

`FidelityOutcome` for `dualAttention` (discriminated by `signature: "dualAttention"`) carries exactly
two fields, each `demonstrated | not_demonstrated | not_applicable`. **No generic score.**

| Signal | `demonstrated` when… | `not_demonstrated` when… | `not_applicable` |
|---|---|---|---|
| `fit_information_kept_in_view` | the user selects the **fit-aware** read at `itr-d1` **or** `itr-d2` (fit-bearing information stays in the evaluative frame rather than being waved off) | the user reads **interest-only / dismissal** at *both* `itr-d1` and `itr-d2` | never in v1 (both fit signals always present) |
| `evaluator_stance_held` | `itr-r1` = **"Both…"** **and** `fit_information_kept_in_view` is `demonstrated` | `itr-r1` collapses to being-liked, **or** no fit-bearing information was kept in view earlier | never in v1 (the reconsider is always reached) |

Notes:
- **Scope of the signal.** `fit_information_kept_in_view` establishes only that fit-bearing
  information **remained in the evaluative frame** during the exercise. It does **not** claim the
  user *used* that information in a real decision — that would be a Transfer-level claim this
  Experience does not make (renamed from `fit_information_used` per owner decision #3).
- The **respect/treatment-boundary beat (`itr-d3`) does not feed either signal** — noticing a
  brush-off is a boundary teaching, not a fit-competence measure.
- Nothing about *whether the user would "keep or drop" the person* is measured. There is no correct
  verdict, by design.
- JIT views never change a signal (Exposure only).

---

## 6. JIT literature hooks (Exposure only — proposed anchors)

| Anchor node | Proposed JIT entry id | Working title | Function |
|---|---|---|---|
| `itr-n2` / `itr-d1` | `lit-jit-wanted-vs-compatible` | "Being wanted isn't the same as being a fit" | names the two-question split at the moment of a fit signal |
| `itr-n4` / `itr-note-exclusion` | `lit-jit-respect-vs-fit` | "Respect and fit are different kinds of information" | respect/treatment boundary (not established mistreatment; pattern matters more; abuse safety-routed) |
| `itr-note-r1-collapse` / `itr-reveal` | `lit-jit-liking-vs-choosing` | "Liking someone and choosing someone are different questions" | reinforces evaluator stance at the mirror |

All three are **Exposure only**: surfacing is optional, never required, and never advances Attempt,
Technique Fidelity, or Transfer. JIT entries are authored in the literature layer later (these ids
are proposals, not yet created).

---

## 7. Respect/treatment boundary & safety branches

- **Authored respect/treatment boundary** (`itr-n4` → `itr-d3` → `itr-note-exclusion`): a *mild*,
  non-conclusive brush-off. It is **not** classified as established mistreatment, and treatment is
  **not** claimed unrelated to fit; the teaching is that respect/safety information and ordinary fit
  differences shouldn't be **handled identically** — the brush-off is information worth noticing
  rather than explaining away, one event doesn't establish character, and a *pattern* would matter
  more. Excluded from fidelity.
- **Real-world escalation boundary:** the authored beat is intentionally mild. Anything beyond mild
  in a real situation (a *pattern* of disrespect, unsafe/abusive content) is **out of scope** for
  this Experience and routes to **support / excluded** per the **already-approved** structured-
  persistence / pervasiveness / crisis criteria (Safety Layer V2). This Experience introduces **no
  new** detection logic and persists **no raw disclosure** — metadata-only, consistent with the
  approved posture.
- **No free text anywhere** in v1 (all reads are select), so there is no user-authored disclosure
  surface inside this Experience.

---

## 8. Minimal persistence payload

Persisted at completion (post-`0053`; in-session only until then, per current behavior):

```
{
  object_type: "simulation",
  object_id:   "sim-itr-evaluator-stance",   // provisional
  object_version: 1,
  signature: "dualAttention",
  completed: true,
  fidelity: {
    evaluator_stance_held:        "demonstrated" | "not_demonstrated" | "not_applicable",
    fit_information_kept_in_view:  "demonstrated" | "not_demonstrated" | "not_applicable"
  }
}
```

**Ephemeral / never persisted:** all scenario text, the person's attributes and lines, every read/
decision, the observed-exercise-choice summary in the mirror, the neutral fact recap, any JIT views.
**Never exists:** a compatibility score, a fit rating, any good/bad classification, any partner data.

---

## 9. Handoff into the Play

Terminal `itr-teach` hands the user into the **Is This Right for You?** Play (`is-this-right-for-you`,
to be built), which is the real-life, repeatable version of holding both questions — a "two
questions" tool, not a scorer. The Experience's fidelity signals seed the Play/Change-Path context
exactly as `evidenceTimeline`/`conclusionNarrowing` already do; no new plumbing is implied.

---

## 10. Conceptual-drift guards checked (this graph)

- ✅ Choices never change the other person's authored lines.
- ✅ No compatibility/fit score anywhere; the mirror only reflects **attention + neutral facts**.
- ✅ Not teaching rejection — widen branches keep both questions open; nothing concludes "drop them."
- ✅ Not re-doing `evidenceTimeline` (reading *their* signals) — the object here is the user's own
  **attention across two parallel questions.**
- ✅ Respect/treatment information is **held differently** from ordinary fit, not weighed as a
  trade-off — and one mild moment is **not** classified as established mistreatment; a pattern
  matters more; coercion/abuse is safety-routed (authored `note-exclusion`).
- ✅ Observation-not-trait throughout; the mirror reports **"where your choices focused in this
  exercise,"** never a measured quantity of attention and never "you're an over-focuser."

---

## 11. Open items surfaced by authoring (for owner note — not blockers)

1. **Handoff Play id + sim id** are provisional; finalized when the Play is built.
2. **Three JIT entry ids** (`lit-jit-wanted-vs-compatible`, `lit-jit-not-a-fit-question`,
   `lit-jit-liking-vs-choosing`) are proposals to author in the literature layer.
3. **`FidelityOutcome` union:** this graph assumes the approved signature-tagged shape; the exact
   TypeScript union lands at implementation, not here.
4. The mild brush-off in `itr-n4` is one option for the exclusion beat; if you'd prefer a different
   mild treatment signal (e.g., pushing past a stated small preference), it's a copy swap — the
   structure holds.

**Next (on approval of this graph):** author "Rest, or Giving Up?" (`decisionRoom`) — still design/
copy only, one graph at a time. No code, migration, or deploy until you approve the full set.
