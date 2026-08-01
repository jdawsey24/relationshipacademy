# Cluster 1 — Phase 5/5B Experience Design Pack (remaining four Plays) — v1

**Status:** DESIGN ONLY — for owner review. No implementation code. Nothing wired, deployed,
migrated, or scored. The two already-approved Experience signatures (`evidenceTimeline`,
`conclusionNarrowing`) are **not** altered. RLC framework, Snapshot/scoring, commerce, and the
deployed Rev 3 architecture are untouched.

**Scope:** Experience-layer (simulation) specifications for the four remaining approved Cluster 1
intervention families, so each Play gains an Experience whose interaction *matches its own
mechanism* rather than reusing the existing two patterns mechanically.

| # | Play | Proposed signature | Schema status |
|---|------|--------------------|---------------|
| 3 | Is This Right for You? | `dualAttention` | **new** (propose adding to `InteractionKind`) |
| 4 | How Much to Put In | `investmentView` | already reserved (future, not built) |
| 5 | Say the Real Thing | `communicationRehearsal` | already reserved (future, not built) |
| 6 | Rest, or Giving Up? | `decisionRoom` | **new** (propose adding to `InteractionKind`) |

Grounding notes (from `lib/playbook/contentSchema.ts`, so these are implementable later without
new primitives unless flagged):
- **Node kinds available:** `moment` · `note` (teaching branch, rejoins) · `capture` · `decision` ·
  `reveal` · `reconsider` · `teach` (terminal handoff to a Play).
- **Fidelity vocabulary:** `FidelityState = "demonstrated" | "not_demonstrated" | "not_applicable"`.
  Today `FidelityOutcome` carries two fixed fields (`evidence_reconsidered`,
  `interpretation_response_appropriate`) shaped for RD/WM. Each new signature below defines **its
  own two `FidelityState` signals** → see *Unresolved owner decisions* for how `FidelityOutcome`
  should become signature-tagged.

---

## Global design contract (applies to all four)

1. The user's choices **never determine or predict the other person's behavior.** Authored beats
   are independent of user input; any "other-person" responses are shown as a *spread* to teach,
   not as a consequence of what the user did.
2. **No outcome scoring.** No compatibility score, no "how the date went" grade, no points.
3. **No inference** of traits, attachment style, diagnosis, motives, or etiology.
4. **Observation-not-trait** phrasing throughout ("here's what you attended to," never "you're an
   over-investor").
5. **JIT literature is Exposure only** — surfacing a read never advances Attempt, Technique
   Fidelity, or Transfer, and never changes a fidelity signal.
6. **Ephemeral by default.** Scenario text, the person's authored details, and any user free text
   are ephemeral. Only a minimal functional signal per signature is persisted (and only once
   migration `0053` is run — until then Experience state is in-session, consistent with current
   behavior).
7. Every Experience **teaches through authored decisions / reveals / feedback**, not static
   explanation, and **hands off** into its Play via a terminal `teach` node.

---

## Play 3 — Is This Right for You?

**1. Play name.** Is This Right for You?

**2. Intervention mechanism.** Mutual-fit / evaluator stance — holding *two* live questions at
once: "Do they appear interested in me?" **and** "What am I learning about whether I want this?"
The operation is *staying an evaluator* while also being evaluated, and *using fit information as
data* instead of organizing the whole encounter around being selected.

**3. Experience purpose.** Surface how quickly attention collapses onto "Do they like me?" when the
other person is appealing/interested/impressive, so fit information (values, availability,
communication style, goals, lifestyle, relational fit) gets underweighted or waved away. The
Experience rehearses *holding both questions*, not rejecting anyone.

**4. Proposed signature.** `dualAttention` (a.k.a. the evaluator-shift). Distinct from
`evidenceTimeline` (which reads *their* signals) because here two parallel streams run at once and
the teaching target is the user's **attention allocation**, not the reading of a single signal.

**5. Consumer interaction concept.** An unfolding date/early-dating scenario with an appealing,
interested person. As it unfolds, information arrives that is *simultaneously* a signal of their
interest **and** a piece of fit information. At intervals the user is asked what they're noticing.
The trap: the flattering/interested signals pull attention; the fit signals slip by. A closing
**two-column mirror** reflects *where the user's attention went* — never a verdict on the person.

**6. Scenario structure.**
- `moment` — an easy, appealing opening (they're warm, funny, clearly into you).
- `moment` + `capture` (×3–4 beats) — each beat carries a *dual* payload: an interest signal
  (they text fast, they compliment you, they lock in a second date) braided with a fit signal
  (they mention they travel for work 3 weeks a month / they want kids soon / they go quiet on
  anything serious / values divergence). The `capture` asks: **"What are you noticing right now?"**
- `reconsider` — near the end, a single hold-both prompt (below).
- `reveal` — the two-column mirror.
- `teach` — hand off to the Play.

**7. Exact kinds of decision points.**
- **Attention captures** (`capture`, single-select) after fit-bearing beats: options span
  *interest-only* reads ("They really seem into me"), *fit* reads ("Noted they're away most of the
  month — I'd want to know what that means for us"), and *dismissal* reads ("It's probably fine,
  they're great"). No option is "correct/incorrect"; the branch teaches.
- **Hold-both `reconsider`:** "Two things are true here: they seem interested, *and* you've learned
  a few things about whether this fits you. Which are you weighting right now?" → options let the
  user notice if the encounter has collapsed to being-chosen.

**8. Authored teaching-branch logic.**
- *Interest-only / dismissal pick* → `note`: "That told you they seem interested — real, and worth
  enjoying. It didn't tell you anything yet about whether *this* is something you want. Both
  questions get to stay open." (Rejoins; never scolds, never rejects the person.)
- *Fit-aware pick* → `note`: "You kept your own question in the room. That's the evaluator stance —
  you're allowed to like them *and* keep learning about fit." (Reinforce; rejoin.)
- All branches rejoin before the reveal so no path is a dead end and no path "wins."

**9. Fidelity model.** Two `FidelityState` signals:
- `evaluator_stance_held` — did the user keep their own question live rather than organizing the
  scenario entirely around being selected? (`demonstrated` if ≥1 fit-aware read *and* the hold-both
  reconsider is not collapsed to being-chosen.)
- `fit_information_used` — did the user register and use ≥1 piece of the emergent fit information as
  data (not dismiss it)? (`not_applicable` only if no fit signal was ever surfaced — shouldn't
  happen in the authored graph.)
  **Not fidelity:** whether they'd "keep or drop" the person. There is no right verdict.

**10. JIT literature opportunities (Exposure only).** Anchored to fit-bearing beats: *"Being wanted
vs. being compatible,"* *"Liking someone and choosing someone are different questions,"* *"When a
fit signal is actually a mistreatment signal"* (see boundary). Surfacing is Exposure; it never
moves a fidelity signal.

**11. Safety / suitability boundaries.** This is for **ordinary fit ambiguity**, not for reframing
mistreatment as a "weigh both sides" exercise. If an emergent signal crosses from *fit* into
*disrespect / unsafe / boundary-violating*, the Experience must **not** present it as one more thing
to balance — a boundary `note` fires: *"This isn't a fit question anymore. If someone's treating you
badly, you don't need more information — trust that."* Also: the purpose is **not** to teach
rejection or a cynical "vet them" stance.

**12. Minimal persistence signals.** `completed: true`; `fidelity: { evaluator_stance_held,
fit_information_used }`. **Ephemeral:** the person's authored attributes, the specific fit facts, all
captures. **Never persisted:** any compatibility score (there is none), any partner data.

**13. Handoff into the Play.** `teach` → *Is This Right for You?* Play, which is the structured
real-life version of holding both questions (a repeatable "two questions" tool). Copy: *"Out in real
life, this is the move — keep both questions open. Here's the tool."*

**14. Risks of conceptual drift.** (a) Becoming a **compatibility scorer**; (b) teaching **rejection
/ vetting / cynicism**; (c) collapsing back into *reading their interest* (that's RD's job, not
this); (d) letting a mistreatment signal be handled as ordinary "fit."

**15. Unresolved owner decisions.** (i) Does the two-column mirror show the *user's attention
distribution* only, or also a neutral recap of the fit facts? (recommend: attention only, facts as
plain recap, no weighting). (ii) Where exactly is the fit→mistreatment threshold, and which authored
signals cross it? (iii) Should `dualAttention` be added to `InteractionKind` now or deferred until
build?

**16. Example consumer-facing scenario copy.**
> **Beat 2.** "Second date, and it's easy — they're funny, they remember the small stuff you said
> last time. Near the end they mention, kind of in passing, that they're on the road about three
> weeks out of four for the next year."
> **Capture — "What are you noticing right now?"**
> · *"Honestly? That they're great and clearly into this."*
> · *"That I'd want to know what three-weeks-away actually looks like for someone dating them."*
> · *"It's early — no need to make it a thing."*
> **Note (after the first or third):** "They do seem into it — enjoy that; it's real. It just
> doesn't answer your other question yet: is *this* something you'd want? You get to hold both."
> **Reveal — two-column mirror:** "Here's where your attention went tonight — a lot on *are they
> interested,* a little on *is this for me.* Neither is wrong. The move is keeping the second column
> from going blank."

---

## Play 4 — How Much to Put In

**1. Play name.** How Much to Put In.

**2. Intervention mechanism.** Intentional investment / evidence-responsive pacing — investment
changes are tied to **observable relational evidence and deliberate choice**, not to panic, hope,
performance, or game-playing. Preserves the approved space-creation guardrail (verbatim in §11).

**3. Experience purpose.** Help the user *notice what they were responding to* when they decided to
put in more (or less): **"What evidence did I have when I decided to put in more?"** Surface
investment that **increased without corresponding new relational evidence**, and separate it from
evidence-tied pacing. (Observation, not cause: the Experience never attributes the change to
anxiety/hope — it shows effort rising while new mutual evidence did not.)

**4. Proposed signature.** `investmentView` (already reserved in `InteractionKind`, future/not
built). Distinct from `evidenceTimeline` because the object under calibration is the **user's own
output (investment level)** across time, mirrored against evidence — not the reading of the other
person's signals.

**5. Consumer interaction concept.** A dating sequence delivering **varying amounts of information
over time** (rich mutual engagement; sparse/ambiguous stretches; a lull with nothing new). At each
step the user chooses their **own next level of investment**, then the Experience surfaces the
evidence that was actually present when they chose. A closing mirror lays the user's *investment
line* beside the *evidence line* — the person's beats never react to the user's choices.

**6. Scenario structure.**
- `moment` (×several) — engagement varies: a warm, clearly-mutual stretch → an ambiguous quiet →
  a genuinely mutual signal again. Authored to be **independent of the user's investment**.
- `decision` after each stretch — the investment choice (below).
- `capture` — "What did you have to go on when you chose that?" (evidence-naming).
- `reveal` — the two-line mirror (investment vs. evidence over time).
- `teach` — hand off.

**7. Exact kinds of decision points.**
- **Investment `decision`** (the four approved consumer choices): *keep it where it is · give a
  little more · give a little less · clarify first.*
- **Evidence `capture`** paired to each investment choice: "What was actually there when you chose —
  new mutual signal, or the quiet?"

**8. Authored teaching-branch logic.**
- *Give more during a lull with no new evidence* → `note`: "Notice what pulled the extra effort —
  was there a new sign it's mutual, or was it the quiet? Putting in more to fill a silence is the
  reflex this is here to catch." (Surfaces investment rising without corresponding new relational evidence — observed, never attributed to a cause.)
- *Give a little less* → `note` **carries the guardrail**: "This isn't pulling back to make them
  chase. Giving a little less here means dropping effort that isn't matched — so what's actually
  there becomes visible." Reframes away from test/withdrawal.
- *Clarify first* → `note`: "Asking is gathering evidence, not applying pressure. It's often the
  cleanest move when the information's just thin."
- *Give more when mutual engagement is observable* → `note`: "You added investment where there was
  real mutual signal. That's evidence-responsive — the effort's going somewhere that's meeting you."
- All rejoin. The person's next beat is **the same regardless of the user's choice.**

**9. Fidelity model.** Two `FidelityState` signals:
- `investment_evidence_tied` — were investment changes connected to observable evidence + deliberate
  choice? (`demonstrated` if the user can name real evidence behind ≥ their investment increases and
  didn't ramp on a pure lull.)
- `effort_without_new_evidence_noticed` — did the user register at least once when effort would rise
  **without corresponding new relational evidence** (observed effort↔evidence relationship, **not**
  an inferred cause)? (`not_applicable` if no lull path was traversed.) *(Renamed from
  `compensatory_effort_recognized` — DECISION-LOG #23 — which implied a causal/functional reading the
  Experience does not establish.)* **Not fidelity:** whether the person "responded well." Nothing
  responds.

**10. JIT literature opportunities (Exposure only).** *"Over-investing: effort that outruns the
evidence,"* *"Compensatory effort,"* and the space-creation guardrail read. Exposure only.

**11. Safety / suitability boundaries.** Not for situations where the real issue is being treated
badly or someone being unavailable/mistreating — that's not a pacing question. The **approved
guardrail must be prominent** (surfaced, not buried):
> *Creating relational space is not a test, withdrawal strategy, manipulation tactic, or attempt to
> provoke pursuit. It means discontinuing unnecessary compensatory effort so existing mutual
> engagement becomes observable.*
**Explicitly excluded interaction vocabulary** (must never appear as a modeled move): *stop texting
first · mirrored response times · making someone chase · withholding · scorekeeping · tit-for-tat.*

**12. Minimal persistence signals.** `completed: true`; `fidelity: { investment_evidence_tied,
effort_without_new_evidence_noticed }`. **Ephemeral:** the person, the specific messages, the
investment picks. **Never persisted:** any tally of who-did-what (there is none).

**13. Handoff into the Play.** `teach` → *How Much to Put In* Play — the real-life evidence-responsive
pacing tool ("before you change your investment, name the evidence"). Copy: *"Out in real life, the
move is small: before you put in more, check what you're going on. Here's the tool."*

**14. Risks of conceptual drift.** (a) **The big one** — sliding into tit-for-tat / withdrawal /
make-them-chase via the "give a little less" option; (b) **scorekeeping**; (c) implying that
reducing investment *causes* pursuit (the scenario must prove the opposite by keeping the person's
beats independent); (d) turning "clarify first" into pressure/ultimatum.

**15. Unresolved owner decisions.** (i) Is "give a little less" offered at all, given drift risk, or
only reached *after* the guardrail note? (ii) How many beats/lulls before it drags? (recommend 3–4).
(iii) Should the person show *any* reaction at all? (recommend: **none** that could read as caused by
the user's investment). (iv) Does the mirror label the lines neutrally without implying an "optimal"
investment curve?

**16. Example consumer-facing scenario copy.**
> **Beat 3 (a quiet stretch).** "It's been three days. Nothing wrong happened — it just went quiet.
> You've drafted and deleted two messages."
> **Decision — "What do you want to do with your investment right now?"**
> · *Keep it where it is* · *Give a little more* · *Give a little less* · *Clarify first*
> **Capture — "What have you actually got to go on right now?"**
> **Note (if *give a little more*):** "Worth a look: is there a new sign this is mutual, or is it the
> quiet doing the talking? Adding effort to fill a silence is exactly the habit we're catching —
> not because reaching out is wrong, but because it's worth knowing which one you're doing."
> **Reveal:** "Here's your effort over these two weeks, next to what was actually happening. See the
> spot where the effort climbed and the evidence didn't? That's the one to notice — no verdict, just
> a place to look."

---

## Play 5 — Say the Real Thing

**1. Play name.** Say the Real Thing.

**2. Intervention mechanism.** Authentic presentation / low-risk authentic expression —
communicating a genuine preference, opinion, or small need **with sufficient clarity and without
unnecessary self-erasure**. Success is *not* whether the other person likes the response; expressing
something real **gives you information about fit**.

**3. Experience purpose.** Surface the reflex to edit, soften, agree automatically, over-apologize,
or conceal a genuine preference to stay likable — and rehearse saying the real thing on **low-risk
material** where the cost of authenticity is low and the information gain is clear.

**4. Proposed signature.** `communicationRehearsal` (already reserved, future/not built). Distinct
from all others because the object of practice is **the user's own utterance**, and it uses a
*decoupled spread of authored reactions* to prove the point that reactions are information, not a
grade.

**5. Consumer interaction concept.** A short series of realistic relational moments (a plan, an
opinion, a small request) where self-erasure is tempting. The user chooses (or assembles) how to
respond. Then — critically — the Experience shows a **spread of 2–3 authored hypothetical reactions
side by side**, *not* selected by the user's choice, to teach: a real expression returns fit
information, whatever the reaction. The success read is the *clarity and non-erasure of the user's
own expression*, never the reaction.

**6. Scenario structure.**
- `moment` — a low-risk moment sets up a genuine preference (you'd prefer the earlier time; you
  didn't love the movie they loved; you'd like to reschedule).
- `decision` (or a light `capture`/sentence-assembly) — how the user responds.
- `reveal` — the **spread**: 2–3 authored reactions shown together, explicitly framed as "any of
  these can happen; each tells you something."
- `note` — teaching on clarity vs. erasure.
- (repeat for 2–3 moments, escalating only *slightly*)
- `teach` — hand off.

**7. Exact kinds of decision points.**
- **Expression `decision`** among: *agree automatically / go along* · *soften until it disappears*
  · *say it clearly and kindly* · *say it but bury it in apology/over-explanation.*
- Optional **assembly `capture`** (ephemeral, never persisted as text) for users who want to phrase
  it themselves — used only to reflect clarity, discarded after.

**8. Authored teaching-branch logic.**
- *Agree automatically / soften-to-vanishing* → `note`: "Smooth — and you also didn't get to find
  out anything. When you say the real thing, their answer tells you something about fit. When you
  don't, there's nothing to learn from." (Self-erasure forfeits information.)
- *Say it clearly* → `reveal` the spread + `note`: "You said it. Look — here are a few ways that can
  land. None of them is a failure; each is just information about fit." (Decouples expression from
  outcome.)
- *Say it but over-apologize* → `note`: "You got there — and then you spent it on 'sorry.' The real
  thing can stand without the apology attached." (Self-erasure via over-justification.)
- The user's choice **never selects** which reaction occurs; the spread is always shown in full to
  make the decoupling explicit.

**9. Fidelity model.** Two `FidelityState` signals:
- `expressed_clearly` — was the genuine preference/opinion/need communicated with sufficient clarity
  (not vanished, not buried)? (`demonstrated` on the clear-expression path; `not_demonstrated` on
  auto-agree/soften-to-vanish.)
- `self_erasure_recognized` — did the user register at least once that softening/apologizing was
  erasing the real thing? (`not_applicable` if only clear paths were taken.)
  **Not fidelity:** whether the authored other-person "liked" it. Reactions are never graded.

**10. JIT literature opportunities (Exposure only).** *"Self-editing to stay likable,"* *"A real
answer is information, not a risk,"* *"Saying it kindly and clearly aren't opposites."* Exposure only.

**11. Safety / suitability boundaries.** Preserve the **approved routing boundary**:
- **R1** for low-risk authentic expression in a reasonably safe context (preferences, opinions,
  small requests) — this Experience stays here by design, escalating only slightly.
- **More demanding / higher-risk material** (confronting mistreatment, high-consequence disclosure,
  unsafe partner) belongs in **supported or excluded routes as already approved** — the Experience
  must not coach it. If the user's real situation reads as higher-risk, signpost rather than
  rehearse.
Also: this is **not** assertiveness-training-for-outcomes and **not** scripting.

**12. Minimal persistence signals.** `completed: true`; `fidelity: { expressed_clearly,
self_erasure_recognized }`. **Ephemeral / never persisted:** any user-authored phrasing (treated as
sensitive free text), the specific moments, the reactions.

**13. Handoff into the Play.** `teach` → *Say the Real Thing* Play — the real-life low-risk
authentic-expression tool. Copy: *"Out in real life, the move is one clear sentence, said kindly,
without the disappearing act. Here's the tool."*

**14. Risks of conceptual drift.** (a) Grading the **reaction** instead of the expression; (b)
becoming **assertiveness-for-results** ("say this and they'll respect you"); (c) **scripting** exact
lines rather than rehearsing clarity; (d) drifting up into **high-risk disclosure** that belongs in a
supported route; (e) implying the user's expression *controls* the other person.

**15. Unresolved owner decisions.** (i) Compose-your-own (ephemeral free text) vs. select-a-phrasing
— free text is richer but raises the sensitive-text/safety-screen surface (recommend: select, with
optional ephemeral compose behind a clear "not saved" note). (ii) How many reactions in the spread
(2 vs 3) and how explicitly they're labeled as non-consequential. (iii) The exact
low-risk→higher-risk line inside the scenario, and the signpost copy at that line. (iv) Whether the
`communicationRehearsal` node set needs a lightweight "assembly" capture kind or can reuse
`decision`.

**16. Example consumer-facing scenario copy.**
> **Moment 1.** "They suggest 8pm. You'd genuinely rather do earlier — you're wiped by 8 on a
> weeknight. There's a half-second where 'sure, 8 works!' is already forming."
> **Decision — "What do you actually say?"**
> · *"Sure, 8 works!"* · *"Maybe-ish, whatever's easier for you…"* · *"Could we do earlier? 8's a
> stretch for me on a weeknight."* · *"Sorry, I know this is annoying — it's just, if it's okay,
> maybe earlier? Only if that's fine!"*
> **Reveal — the spread (after the clear version):**
> · *"Oh yeah, earlier's better for me too."* · *"I'd rather keep it at 8 — that work?"* · *"Hm, I
> kind of wanted later. Split the difference at 7:30?"*
> **Note:** "Three different answers — and *all* of them are useful. You just found out something
> about how they meet a small real preference. That's the whole point; it was never about which one
> you'd get."

---

## Play 6 — Rest, or Giving Up?

**1. Play name.** Rest, or Giving Up?

**2. Intervention mechanism.** Intentional engagement / intentional disengagement — making a
**deliberate** decision about dating based on **present capacity and intention**, rather than letting
discouragement automatically make (and permanently fix) the decision. Intentional rest is a valid
outcome.

**3. Experience purpose.** Put the user *inside* dating fatigue/discouragement/loneliness/dread/low
motivation and help them **distinguish** among real possibilities — so a hard feeling doesn't get
mistaken for an irreversible conclusion about the future.

**4. Proposed signature.** `decisionRoom`. **The only Cluster 1 Experience with no other person in
it** — the object is the user's own present state and intention. Distinct from every other signature
by construction.

**5. Consumer interaction concept.** A single, quiet **decision-room** moment (no partner, no
scenario partner-beats). The Experience names the felt state without pathologizing it, then helps the
user **separate the transient reaction from a chosen stance** and pick a deliberate,
*revisitable* one from a set of legitimate options — including rest and not-now. The system never
nudges toward dating.

**6. Scenario structure.**
- `moment` — the felt entry (e.g., the app notification on a low Sunday; the after-another-flat-date
  slump). Named plainly, honored, not diagnosed.
- `capture` — **"Right now, what's most true?"** (the distinguishing sort; options below).
- `reconsider` — separate *reaction* from *decision*: "Is this a thing you want to decide, or a
  feeling you want to let settle first?"
- `note` branches per stance (below).
- optional `capture` — for *rest* / *return-later*: name the return conditions (**you** set them).
- `reveal` — reflect the *chosen, revisitable* stance (no push, no verdict).
- `teach` — hand off.

**7. Exact kinds of decision points.**
- **State-sort `capture`** among legitimate possibilities: *I need rest · I don't want to date right
  now · I'm discouraged and reacting to the latest disappointment · I want to stay lightly open
  without actively pursuing · I might want to come back later, on conditions I choose.*
- **Reaction-vs-decision `reconsider`:** distinguish "answering a forever question with today's
  feeling" from "deciding something, just for now."
- **Return-conditions `capture`** (optional, user-defined): what would make coming back feel right.

**8. Authored teaching-branch logic.**
- *"I'm done / it's never going to happen"* (discouragement-as-conclusion) → `note`: "That's a
  forever conclusion showing up in a discouraged moment — and the feeling is real. Notice it's
  answering a *forever* question with *tonight's* feeling. You don't have to decide forever right
  now — what do you want to decide, just for now?"
  (Distinguish reaction from decision; keep it revisitable.)
- *"I need rest"* → `note`: "Rest is a real choice, not giving up. You're allowed to set this down
  and pick it back up when you want. Want to name what 'picking it back up' would look like?"
- *"Reacting to the latest disappointment"* → `note`: "Makes complete sense. You can decide
  something now, or let the reaction settle and decide later — both are fine."
- *"Lightly open"* → `note`: "That's a real stance, not a lukewarm one — open, without chasing."
- *"Come back later on my conditions"* → optional return-conditions `capture`.
- **No branch pushes toward dating.** Rest and not-now are validated as complete, legitimate
  outcomes.

**9. Fidelity model.** Two `FidelityState` signals:
- `deliberate_decision_made` — did the user make a chosen engagement/rest decision based on present
  capacity/intention (vs. leaving discouragement in charge)? (`demonstrated` when any deliberate
  stance is chosen — *including rest/not-now*.)
- `discouragement_distinguished_from_conclusion` — did the user separate the transient feeling from
  a forever-conclusion? (`demonstrated` on the reaction-vs-decision reconsider.)
  **Not fidelity:** choosing to date. Rest scores identically to engagement.

**10. JIT literature opportunities (Exposure only).** *"Dating fatigue is not a verdict,"* *"Rest is
not giving up,"* *"Loneliness is a signal, not a diagnosis."* Exposure only.

**11. Safety / suitability boundaries.** **This is the highest-sensitivity Experience.** It touches
loneliness/discouragement and must **never pathologize** them, **never treat a break as failure**,
and **never nudge toward dating**. But it is also where the **Safety Layer V2** detection matters
most: if disclosure indicates something *pervasive / identity-level / hopeless beyond dating* (or any
risk indicator), the deterministic support-signpost / excluded route applies — ordinary dating
fatigue is in scope; clinical depression or self-harm is **out of scope and routed to support**,
per the approved safety posture (metadata-only, no raw disclosure retained).

**12. Minimal persistence signals.** `completed: true`; `fidelity: { deliberate_decision_made,
discouragement_distinguished_from_conclusion }`; **optionally** `chosen_stance` as a small enum
(`rest | not_now | lightly_open | return_later | reacting`) to seed the Play handoff. **Ephemeral /
never persisted:** the felt content, any free-text return-conditions, any mood data (there is no mood
score). No diagnosis, ever.

**13. Handoff into the Play.** `teach` → *Rest, or Giving Up?* Play — the real-life intentional
engagement/rest decision tool, which honors whatever stance was chosen (including "set it down") and
keeps it revisitable. Copy: *"Whatever you chose — rest, later, lightly open — it's yours and you can
change it. Here's the tool for making that call on purpose."*

**14. Risks of conceptual drift.** (a) **Nudging back to dating** / treating engagement as the
"good" outcome; (b) **pathologizing loneliness**; (c) treating a **break as failure**; (d) becoming a
**mood tracker**; (e) drifting into **clinical territory** without the support signpost; (f)
accidentally introducing a partner/other-person (it must stay a decision-room).

**15. Unresolved owner decisions.** (i) Persist `chosen_stance` or keep even that ephemeral?
(recommend: persist the enum only, no free text). (ii) Exact trigger threshold for the
support-signpost escalation inside this Experience, and whether it can *interrupt* mid-flow. (iii)
Offer the return-conditions capture, and if so, kept ephemeral or as a saved Play output? (iv) Is
`decisionRoom` a new `InteractionKind` now or at build time?

**16. Example consumer-facing scenario copy.**
> **Moment.** "The app pinged. You looked at it for a second and felt… tired. Not heartbroken —
> just done-for-now tired. Another week, another round of this."
> **Capture — "Right now, what's most true?"**
> · *"I need a rest."* · *"I don't want to date right now."* · *"I'm just discouraged — last date
> was a letdown."* · *"I want to stay a little open, without chasing anything."* · *"I might come
> back later, when it's on my terms."*
> **Reconsider — "Is this a thing you want to decide, or a feeling you want to let settle first?"**
> **Note (if 'I'm done'):** "That's a forever conclusion showing up in a discouraged moment — and
> the feeling is real. But notice it's answering a *forever* question with *tonight's* feeling. You
> don't have to call it forever right now. What do you actually want to decide, just for this week?"
> **Reveal:** "So — rest, for now, on your call. Not giving up, not a failure — a decision you made,
> that you can revisit whenever you want."

---

## Comparison table — six Cluster 1 Experience signatures

| Play | Signature | Core interaction verb | What unfolds | The user's job | Error it surfaces | Reveal / mirror | Fidelity focus | Other person's role |
|------|-----------|----------------------|--------------|----------------|-------------------|-----------------|----------------|---------------------|
| What It Actually Means | `conclusionNarrowing` | **Narrow** | one event balloons into a global self-story | shrink the conclusion back to what the event establishes | overgeneralizing a letdown into "what's wrong with me / always" | conclusion contracts to the evidence | conclusion matches the evidence size | minimal — the event only |
| Read It, Then Decide | `evidenceTimeline` | **Read, then decide** | ambiguous signals accrue over days | separate saw-it from guessing; decide from evidence | acting on the story before the evidence is in | what was seen vs. guessed | reading fidelity + evidence-based decision | ambiguous signals over time |
| Is This Right for You? | `dualAttention` | **Hold both** | interest signals braided with fit signals | keep two questions live; use fit info as data | attention collapses to "do they like me" | where your attention went (two columns) | evaluator stance held + fit info used | appealing & interested (attention magnet) |
| How Much to Put In | `investmentView` | **Calibrate** | information arrives in varying amounts over time | set your own investment to the evidence, on purpose | investing on hope/panic/quiet, not evidence | your effort line vs. the evidence line | investment tied to evidence + choice | independent, **non-reactive** |
| Say the Real Thing | `communicationRehearsal` | **Say it** | low-risk moments tempt self-erasure | express the real thing clearly, without erasing yourself | editing/softening/agreeing to stay likable | a **spread** of authored reactions (decoupled) | clarity of expression + non-erasure | a *range* of hypothetical reactions |
| Rest, or Giving Up? | `decisionRoom` | **Decide, on purpose** | your own fatigue/discouragement, felt | separate the reaction from a chosen, revisitable stance | discouragement making an irreversible conclusion | your chosen, revisitable stance | deliberate decision + reaction≠conclusion | **none** (no partner) |

**One Playbook, not repetitive.** Read across the "Core interaction verb" and "Other person's role"
columns: the six move the user's attention to six different objects — an over-general *self-story*
(narrow), *their ambiguous signals* (read), *two simultaneous questions* (hold), *the user's own
output* (calibrate), *the user's own utterance* (say), and *the user's own state with no other
present* (decide). No two share a mechanic; all share the family voice (observation-not-trait, no
scoring, choices never drive the other person).

---

## Cross-cutting boundaries (recap, all six)

- No choice determines/predicts the other person's behavior; authored beats are independent.
- No outcome scoring; no compatibility/mood/effort *scores* anywhere.
- No trait/attachment/diagnosis/motive/etiology inference; observation-not-trait phrasing.
- JIT literature = Exposure only; never advances Attempt/Technique-Fidelity/Transfer.
- Ephemeral by default; only the minimal per-signature `FidelityState` pair (+ optional
  `chosen_stance` for `decisionRoom`) is persisted, and only post-`0053`.
- Safety: Play 4 carries the verbatim space-creation guardrail + an excluded-vocabulary list;
  Play 3 has a fit→mistreatment boundary; Play 5 preserves the R1 / supported / excluded routing;
  Play 6 is the primary support-signpost surface (dating fatigue in scope, clinical out).

## Consolidated unresolved owner decisions

1. **`FidelityOutcome` shape.** Today it's two fixed fields for RD/WM. Each new signature needs its
   own two `FidelityState` signals → make `FidelityOutcome` **signature-tagged** (a discriminated
   union by `InteractionKind`) before building. **Owner/eng call.**
2. **`InteractionKind` additions.** Adopt reserved `investmentView` + `communicationRehearsal`; add
   new `dualAttention` + `decisionRoom` — now, or at build time?
3. **Play 4:** offer "give a little less" at all, and only after the guardrail note? Show *any*
   partner reaction? (recommend: none.)
4. **Play 5:** select-a-phrasing vs. ephemeral compose (sensitive-text surface); size/labeling of
   the reaction spread; exact low→higher-risk line + signpost copy.
5. **Play 6:** persist `chosen_stance` enum or keep fully ephemeral; support-signpost trigger
   threshold + whether it can interrupt mid-flow; return-conditions capture kept ephemeral or saved.
6. **Play 3:** two-column mirror — attention-only vs. attention + neutral fact recap; the exact
   fit→mistreatment threshold and which authored signals cross it.
7. **New node kinds?** All four can be modeled from existing kinds (`moment`/`capture`/`decision`/
   `note`/`reveal`/`reconsider`/`teach`). Play 5's optional "assembly" input and Play 6's
   return-conditions are the only candidates for a new capture variant — defer unless owner wants
   authored composition.

## Recommended next step (not started)

On owner approval of this pack: author the four content graphs + copy for a **content/experience
gate** (still no wiring), one Play at a time, starting with the two lowest-drift-risk
(`decisionRoom`, `dualAttention`) or the highest-value — owner's call — before any code, migration,
or flag work.
