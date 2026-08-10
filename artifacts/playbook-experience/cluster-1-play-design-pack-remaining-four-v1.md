# Cluster 1 — Play Design Pack (remaining four Plays) — v1

**Status:** DESIGN ONLY — for owner review (Phase A of the implementation roadmap). **No code, no
migration, no wiring, no deploy.** These four Plays are the real-life tools that the four approved
Experiences hand off into; an Experience cannot be reached in-app without a schema-valid Play at its
`playId`, so the Plays must be designed and approved before implementation. The two live Plays
(`read-and-decide`, `what-it-actually-means`) and the RLC framework are unchanged.

**Why now:** the four Experience graphs are approved; implementation research found the four Plays
don't exist and weren't designed. Owner directed: design the 4 Plays first.

**Source of truth:** each Play is the repeatable, real-world version of the operation its Experience
rehearses. Operations, fidelity signals, boundaries, and handoff copy are carried from the approved
Experience graphs + `DECISION-LOG` #17–#27. Structure mirrors the two live Plays (see the worked
`read-and-decide` Play, `content/playbook/finding-love-that-feels-mutual.ts:120-283`).

**Shared Play anatomy (from `Play` / `Screen` in `lib/playbook/contentSchema.ts`; validated by
`contentValidate.ts`):** `recognitionGate.prompt` · `screens[]` (from: `shift` · `literature`
(l1/l2) · `learn` · `scenarioSort` · `ownTurn` · `sufficiency` · `ruleBuilder` · `sentenceBuilder` ·
`emotionBeat` · **`output` — required** · `portable` · `realWorldUse`) · `portable[]` ·
`myPlaysTemplate` (when/move/lookingFor/watchOut/remember) · `fidelity` (correct / non-empty misuse[]
/ notMeaning) · optional `outputEditor`. **Each Play needs at least one `output` screen and all five
`myPlaysTemplate` fields** or it fails validation.

**Play ids (finalize the Experiences' provisional `teach.toPlayId`):** `is-this-right-for-you` ·
`rest-or-giving-up` · `how-much-to-put-in` · `say-the-real-thing`.

**Global boundaries (all four):** observation-not-trait; no outcome/relationship scoring; choices
never determine the other person; no diagnosis/etiology; JIT literature is Exposure only; safety
escalation only via the already-approved persistence/pervasiveness + Layer-A crisis rules; all behind
`PLAYBOOK_REV3_ENABLED`.

---

## Play 3 — Is This Right for You?  (`is-this-right-for-you` ← `dualAttention`)

**Operation (real-life tool).** A repeatable **two-question check**: when someone's appealing, keep
*"Do they seem interested?"* **and** *"What am I learning about whether I want this?"* both live —
using fit information as data, never as a score or verdict.

**Recognition gate.** *"When someone's easy to like, I focus on whether they're into me — and lose
track of whether this is actually what I want."*

**Shift (screen: `shift`).** When someone is appealing, it can become easy to spend more attention on
whether they want you than on what you're learning about whether you want this. This helps you keep
both questions open, so what you learn about fit stays in view — without turning it into a verdict on
them.

**Core steps (screens: `learn` → `scenarioSort` → `ownTurn` → `sentenceBuilder`).**
1. **Their interest** — what have you actually seen that they're interested?
2. **Your read** — what have you learned about whether this fits *you* (availability, values,
   communication, goals, lifestyle)?
3. **Sort a mixed signal** — *their interest* / *fit information for me* / *not a fit question (a
   respect/treatment thing)*.
4. **Name one thing** you've learned about fit, in your own words (`sentenceBuilder`).

**Executable output → `myPlaysTemplate`.**
- **when:** "someone's appealing and I catch myself mostly tracking whether they're into me"
- **move:** "ask both questions — do they seem interested / what am I learning about whether I want
  this — and let fit info be data"
- **lookingFor:** "real information about fit (availability, values, communication, goals), not just
  signs of their interest"
- **watchOut:** "collapsing to 'do they like me'; filing a respect/treatment thing under 'fit'"
- **remember:** "liking them and choosing them are different questions; both get to stay open"

**Fidelity (Play-level).**
- **correct:** "You kept your own question live — you can name at least one thing you've learned
  about fit, separate from whether they're interested."
- **misuse:** ["Turning it into a verdict or a score on the person.", "Weighing a respect/treatment
  issue as if it were an ordinary fit trade-off."]
- **notMeaning:** "This isn't vetting, rejecting, or grading someone — it's keeping your own question
  from going quiet."

**Portable.** ["Do they seem interested?", "What am I learning about whether I want this?", "Is this
a fit question, or a respect one?", "I can hold both."]

**realWorldUse.** *useWhen:* "you're a few dates in with someone you really like and it's easy to
organize everything around being chosen." *doThis:* "Run both questions before you decide anything."
*safetyNote:* "If what you're weighing is disrespect or feeling unsafe, that's not a fit question —
you don't weigh that."

**Experience → Play handoff.** `evaluator_stance_held` / `fit_information_kept_in_view` (in-session)
inform which reminder to surface (e.g., if fit info wasn't kept in view, lead with "Your read").

**Suitability/safety.** For ordinary fit ambiguity, not for reframing mistreatment as a fit
trade-off (carry the respect/treatment boundary from the Experience).

---

## Play 4 — Rest, or Giving Up?  (`rest-or-giving-up` ← `decisionRoom`)

**Operation.** Choose an **intentional, revisitable stance toward dating right now** — from present
capacity and intention — instead of letting a discouraged moment decide forever. Not necessarily an
"engagement/rest decision": **`pause_decision` (not deciding yet) is an equally valid stance.** **No
other person in this tool.**

**Recognition gate.** *"When dating gets heavy, a hard week can quietly decide I'm done — instead of
me choosing on purpose."*

**Shift.** Right now a low moment can fix the decision as if it were forever. This helps you separate
the feeling from a stance you choose — one you can change whenever you want. Rest counts.

**Core steps (screens: `learn` → `scenarioSort` → `ownTurn` → `sufficiency`).**
1. **Name what's true now** — fatigue / discouragement / loneliness / dread / low motivation — plainly,
   without pathologizing.
2. **Separate feeling from decision** — is this a *forever conclusion showing up in a discouraged
   moment*? (`scenarioSort`: "a feeling to let settle" vs "a decision to make").
3. **Choose a stance for now** — rest · not now · lightly open · return later · pause the decision —
   **all co-equal, all revisitable** (`ownTurn`).
4. **Re-entry conditions** — name (for yourself) what would make coming back feel right. *(Moved here
   from the Experience per Rest revision #8; lives in the Play output.)*

**Executable output → `myPlaysTemplate`.**
- **when:** "dating feels heavy and I catch myself concluding it's never going to happen"
- **move:** "name what's true now, separate the feeling from the decision, choose a stance for now
  (rest included)"
- **lookingFor:** "a deliberate, revisitable stance from my present capacity — not a forever verdict"
- **watchOut:** "letting a low moment make a forever decision; treating rest as failure"
- **remember:** "rest is a real choice; a break isn't giving up; I can revisit anytime"

**Fidelity (Play-level).**
- **correct:** "You chose an intentional stance for now and kept it revisitable." *(Rest, not-now,
  lightly-open, return-later, and pause-decision are all co-equal satisfying stances.)*
- **misuse:** ["Treating a break as failure, or forcing yourself back to dating to prove something.",
  "Reading a forever verdict off one discouraged night."]
- **notMeaning:** "This isn't quitting, and it isn't a diagnosis. Rest and staying open are equally
  valid."

**Portable.** ["What's true right now?", "Is this a forever conclusion in a discouraged moment?",
"What do I want to decide, just for now?", "I can revisit this."]

**realWorldUse.** *useWhen:* "the apps feel like a chore, or a letdown has you ready to call it
forever." *doThis:* "Choose a stance for now, on purpose. Rest counts." *safetyNote:* "If the
heaviness is bigger than dating — following you everywhere, for a long time — that deserves more than
a dating tool; talking with a mental health professional can help." *(This is the support-signpost
boundary; escalation only via the already-approved persistence/pervasiveness + Layer-A crisis rules.)*

**Experience → Play handoff.** `chosen_stance` (in-session) can pre-orient the stance step;
`intentional_stance_selected` / `discouragement_distinguished_from_conclusion` inform reminders.

**Suitability/safety.** Highest-sensitivity Play: never push toward dating, never pathologize
loneliness, never treat a break as failure; the ordinary "never going to happen" read is **not**, by
itself, a signpost trigger.

---

## Play 5 — How Much to Put In  (`how-much-to-put-in` ← `investmentView`)

**Operation.** **Evidence-responsive pacing**: before changing how much you put in, name the evidence
— keep investment tied to what you can observe, not to the quiet.

**Recognition gate.** *"I sometimes change how much I'm putting in before I actually have new
information."*

**Shift.** Right now, effort can climb to fill a silence, or pull back to get a reaction. This helps
you tie your investment to observable evidence and a deliberate choice.

**Core steps (screens: `learn` → `scenarioSort` → `ownTurn` → `ruleBuilder`).**
1. **Name the evidence** — what have you actually seen? Mutual signals (initiation, follow-through,
   planning) count as evidence — **and so does a *repeated, observable pattern* of non-engagement.**
   The line is between *acting to fill an information gap* (a single quiet stretch, a feeling) and
   *responding to an observable pattern.* Silence is not automatically "no evidence."
2. **Sort** — *observable evidence (including a repeated pattern)* vs *a gap I'm filling / a feeling*
   (`scenarioSort`).
3. **Choose investment** — keep it where it is / give a little more / give a little less / clarify
   first — as a deliberate call.
4. **Build the if-then** (`ruleBuilder`) — **part of the core executable output**, not optional:
   "If I see ___, I'll ___," tied to observable evidence, with the control-check guardrail. The rule
   governs the user's **own** evidence-and-decision process and must **never** become mirrored
   behavior, a waiting tactic, withdrawal, response-time matching, or a pursuit test.

**The space guardrail (verbatim, surfaced in `literature`/`learn`).** *"Creating relational space is
not a test, withdrawal strategy, manipulation tactic, or attempt to provoke pursuit. It means
discontinuing unnecessary compensatory effort so existing mutual engagement becomes observable."*
**Excluded vocabulary — never modeled:** stop-texting-first · mirrored response times ·
making-someone-chase · withholding · scorekeeping · tit-for-tat.

**Executable output → `myPlaysTemplate`.**
- **when:** "I'm about to change how much I'm putting in"
- **move:** "name the evidence first, then choose keep / more / less / clarify — on purpose"
- **lookingFor:** "observable mutual signals (initiation, follow-through, plans), not the silence"
- **watchOut:** "effort climbing to fill quiet; using 'less' as a test or to provoke pursuit;
  scorekeeping"
- **remember:** "space means easing off unmatched effort so what's real becomes visible — not a
  tactic"

**Fidelity (Play-level).**
- **correct:** "Your investment change is tied to something you actually observed, and it's a
  deliberate choice — not a reaction to the quiet or a way to get a response."
- **misuse:** ["Using 'give a little less' as a test, a withdrawal, or a way to make someone chase.",
  "Scorekeeping or matching response times."]
- **notMeaning:** "This isn't playing games, withholding, or tit-for-tat. The other person's response
  isn't something you engineer."

**Portable.** ["What have I actually seen?", "Evidence, or the quiet?", "Keep / more / less / clarify
— on purpose", "Space isn't a tactic."]

**realWorldUse.** *useWhen:* "you feel the pull to text more into a silence, or to pull back to get a
reaction." *doThis:* "Name the evidence before you change your investment." *safetyNote:* "If the
real issue is that someone's unavailable or treating you badly, that's not a pacing question — trust
that."

**Experience → Play handoff.** `investment_evidence_tied` / `effort_without_new_evidence_noticed`
(in-session) inform reminders.

**Suitability/safety.** Not a pacing question when the real issue is mistreatment or unavailability.

---

## Play 6 — Say the Real Thing  (`say-the-real-thing` ← `communicationRehearsal`)

**Operation.** Say the genuine **preference / opinion / small request** clearly and kindly, **without
self-erasure** — treating the response as information about fit, not a grade. **Low-risk only.**

**Recognition gate.** *"I smooth myself over — agree, soften, or apologize — to stay likable, instead
of saying the real thing."*

**Shift.** Right now the reflex is to erase the real thing to keep it nice. This helps you say it
clearly and kindly, and treat what comes back as information about fit — not a verdict on you.

**Core steps (screens: `learn` → `sentenceBuilder` → `ownTurn`).**
1. **Name the real thing** — the preference/opinion/request.
2. **Build the sentence** (`sentenceBuilder`) — clear + kind, no disappearing act, no apology tax.
3. **Their response = information** — a range of reactions is normal; none is a failure; you learn
   about fit either way.

**Executable output → `myPlaysTemplate`.**
- **when:** "I notice myself about to agree / soften / apologize to stay likable"
- **move:** "name the real thing, say it clearly and kindly, let their response be information"
- **lookingFor:** "what I actually prefer/think/need — said plainly"
- **watchOut:** "vanishing the preference; burying it in apology; grading myself on their reaction"
- **remember:** "saying it is how I find out about fit; the response isn't a verdict on me"

**Fidelity (Play-level).**
- **correct:** "You said the genuine thing with enough clarity that it could actually land — without
  erasing yourself in agreement or apology."
- **misuse:** ["Measuring success by whether they liked it.", "Using it to push high-stakes or
  confrontational material that belongs in a safer, supported setting."]
- **notMeaning:** "This isn't about getting a reaction, scripting lines, or winning — it's saying the
  real thing and learning from what comes back."

**Portable.** ["What's the real thing?", "Say it — clear and kind", "No disappearing act, no apology
tax", "Their answer is information, not a verdict."]

**realWorldUse.** *useWhen:* "a low-risk moment where you're tempted to smooth yourself over — a plan,
an opinion, a small request." *doThis:* "Say the real thing clearly and kindly, without burying it in
apology or explanation." *safetyNote:* "For higher-stakes or unsafe conversations, this low-risk tool
isn't the right one; those deserve more support."

**`outputEditor` (required).** The user's saved output may include a **bounded version of the actual
preference/opinion/small request they intend to communicate** — a single clear, kind sentence they
can save and edit. Strictly R1 / low-risk material only.

**Experience → Play handoff.** `preference_expressed_clearly` / `unnecessary_self_erasure_avoided`
(in-session) inform reminders.

**Suitability/safety.** R1 low-risk only; higher-risk/more-demanding material routes to the
already-approved supported/excluded routes.

---

## Cross-Play rulings (owner — resolved)

1. **Literature depth.** **L1 is required for every Play. L2 is optional** — used only when deeper
   explanation is directly necessary for correct use of *that* intervention. Do **not** duplicate the
   broader Understand / Field Guide layer inside every Play.
2. **Play 4 re-entry/revisit conditions.** They belong in the **Play**, not the Experience. They
   **may persist as part of the saved Play output but must remain OPTIONAL** — a user choosing
   rest/not-now is **never required** to specify when they'll return.
3. **`outputEditor` scope.** Is This Right for You? → **no editor.** Rest, or Giving Up? → **editor.**
   How Much to Put In → **editor.** Say the Real Thing → **editor** (save/edit the bounded real-world
   sentence).
4. **Play practice scenarios.** Author **new, compact micro-practice items inside each Play** — do
   **not** reuse the full Experience scenarios verbatim. The Experience is immersive rehearsal; the
   Play teaches the operation, lets the user practice it briefly, builds the user's executable
   version, and saves it.
5. **My Plays five-field freeze:** each Play's `myPlaysTemplate` above is the frozen executable output
   the user saves. Copy is candidate, pending per-Play-spec review.
6. **Screen-kind reuse:** all four map onto existing screen kinds; **no new screen kinds** at the Play
   layer. (The roadmap's renderer extension is for the *Experience* `reveal` node, not Plays.)

## Fidelity naming — canonical (no aliases)

Every Experience → Play handoff uses the **one canonical field name** from the finalized approved
Experience graph — carried unchanged through `FidelityOutcome` → Play handoff → (deferred)
persistence → Change Path. No alternate aliases anywhere in the Play specs:
- `dualAttention`: `evaluator_stance_held`, `fit_information_kept_in_view`
- `decisionRoom`: `intentional_stance_selected`, `discouragement_distinguished_from_conclusion`,
  `chosen_stance` ∈ `rest | not_now | lightly_open | return_later | pause_decision`
- `investmentView`: `investment_evidence_tied`, `effort_without_new_evidence_noticed`
- `communicationRehearsal`: `preference_expressed_clearly`, `unnecessary_self_erasure_avoided`

## Next step

On approval of this pack's **direction**, author the **full per-Play content specs one at a time**
(exact screen-by-screen copy — same cadence as the Experience graphs: spec → owner revisions →
approval), starting with **Is This Right for You?** Then Phase B (shared infrastructure) + Phase C
(per-slice build) per the roadmap. Still design/copy only; no code, migration, wiring, or deploy.
