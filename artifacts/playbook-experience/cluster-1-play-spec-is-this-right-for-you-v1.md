# Play Production Spec — "Is This Right for You?" (`is-this-right-for-you`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Design/copy only — **no code, no migration, no wiring, no
deploy.** First of four Play specs (order: Is This Right for You? → Rest, or Giving Up? → How Much to
Put In → Say the Real Thing). The other three are **not** specced yet. The two live Plays and the RLC
framework are unchanged.

**Play id:** `is-this-right-for-you` (finalizes the `dualAttention` Experience's `teach.toPlayId`).
**Pairs with Experience:** `dualAttention` (graph:
`cluster-1-experience-graph-is-this-right-for-you-v1.md`). **`outputEditor`:** none (owner ruling #3).
**Structure:** existing `Play`/`Screen` schema only (no new screen kinds); modeled on the live
`read-and-decide` Play.

**Operation.** A repeatable **two-question check**: when someone's appealing, keep *"Do they seem
interested?"* **and** *"What am I learning about whether I want this?"* both live — using fit
information as data, never as a verdict or score. Plus the **respect/treatment boundary**: some
things aren't fit questions at all.

**Recognition gate (`recognitionGate.prompt`).**
> "When someone's easy to like, I focus on whether they're into me — and lose track of whether this
> is actually what I want."

---

## Screen order

1. `shift` — the observational framing
2. `literature` — L1 (required) + a brief L2 (respect/treatment boundary — justified as directly
   necessary for correct use)
3. `learn` — the two-question operation
4. `scenarioSort` — compact micro-practice (sort a few signals; **new, not the Experience scenario**)
5. `ownTurn` — apply it to the user's real situation
6. `sentenceBuilder` — the executable core (name one fit observation)
7. `output` — "Your Two Questions" (keep / save to My Plays)
8. `portable` — take-with-you steps
9. `realWorldUse` — useWhen / doThis / safetyNote

---

## Screen-by-screen exact copy

### 1. `shift`
```
body:
- "When someone is appealing, it can become easy to spend more attention on whether they want you
   than on what you're learning about whether you want this."
- "This helps you keep both questions open — so what you notice about whether this actually fits you
   stays in view as information, instead of getting waved off because you like them. It's not about
   deciding for or against anyone."
```

### 2. `literature`
```
l1: "Wanting to be chosen is human — enjoying that someone's into you isn't the problem. What's worth
     noticing is how much of your attention it can take. When someone's appealing and clearly
     interested, most of your attention can go to 'do they want me?', and your own question — 'is
     this actually what I want?' — can go quiet. Both can stay open at once. Keeping your own
     question live isn't vetting them or holding back; it just means the things you're learning about
     whether this fits you — how available they are, what they want, how they communicate, how your
     lives line up — stay in view as information instead of getting waved off because you like them."
l2Heading: "When it's not a fit question"
l2: "One thing to keep separate: how much you like someone and how they treat what matters to you are
     different questions. If something crosses from 'we might not line up' into dismissiveness,
     disrespect, or feeling unsafe, that isn't a fit trade-off you weigh against how appealing they
     are — it goes in its own box. One moment doesn't tell you who someone is; a repeated pattern
     matters more. And anything that feels like pressure or makes you feel unsafe is a different
     conversation, and there's support for it."
```
*(L2 is included because misusing the tool to "weigh" mistreatment as fit is a real correct-use risk;
it does not duplicate the Field Guide — it's the boundary specific to this operation.)*

### 3. `learn`
```
body:
- "Two questions, held side by side:"
- "Do they seem interested? — what you've actually seen."
- "What am I learning about whether I want this? — availability, values, communication, goals,
   lifestyle."
- "You don't have to answer the second one today. You just have to keep it from going quiet."
```

### 4. `scenarioSort` — compact micro-practice (new)
```
prompt: "Quick sort. A few things came up over a couple of dates with someone easy to like. Which
         box does each go in?"
situation: "Two dates in with someone you genuinely enjoy. A handful of things have come up."
buckets:
- { id: "interest", label: "About their interest" }
- { id: "fit",      label: "About whether this fits me" }
- { id: "respect",  label: "Not a fit question" }
items:
- { id: "s1", text: "They text back fast and are already planning a third date.", correctBucket: "interest" }
- { id: "s2", text: "They mentioned they're moving abroad in about six months.", correctBucket: "fit" }
- { id: "s3", text: "They lit up talking about wanting kids in the next couple of years.", correctBucket: "fit" }
- { id: "s4", text: "They complimented you a lot.", correctBucket: "interest" }
- { id: "s5", text: "When you shared something you're proud of, they brushed it off and moved on.",
    correctBucket: "respect",
    correction: "This one's easy to file under 'fit' with a 'but they're great otherwise.' It isn't a
                 fit trade-off — it's about respect, and it goes in its own box. One moment doesn't
                 define someone; a pattern would matter more." }
note: "Two of these tell you they're into it. Two tell you something about whether this fits *you*.
       The last one isn't a fit question at all."
evidenceQuestion:
  prompt: "When someone's this easy to like, which question tends to go quiet?"
  options:
  - "What I'm learning about whether I want this"
  - "Whether they're into me"
  - "Neither — I track both evenly"
```

### 5. `ownTurn`
```
intro: "Now someone real — someone you actually like right now. Keep it to what you've genuinely
        noticed, not what you're hoping or guessing."
fields:
- { id: "interest", label: "What have you actually seen that they're interested?", input: "chips",
    placeholder: "e.g. texts first, planned our last date" }
- { id: "fit", label: "What have you learned about whether this fits YOU? (availability, values,
    communication, goals, lifestyle)", input: "chips", placeholder: "e.g. wants to keep things very casual" }
- { id: "respect", label: "Anything that isn't a fit question — a respect or treatment thing you
    noticed? (Leave blank if none.)", input: "chips" }
```

### 6. `sentenceBuilder`
```
label: "Name one thing you've learned about whether this fits YOU — in your own words."
helper: "Not about whether they like you. About whether you want this. One honest sentence is plenty."
```

### 7. `output`
```
heading: "Your Two Questions"
body: "Here's your check for this person — both questions, kept open. Keep it, or save it to My Plays."
```

### 8. `portable`
```
heading: "Take it with you"
steps:
- "Do they seem interested?"
- "What am I learning about whether I want this?"
- "Is this a fit question, or a respect one?"
- "Liking them and choosing them aren't the same question — both get to stay open."
```

### 9. `realWorldUse`
```
useWhen: "you're a few dates in with someone you really like, and it's easy to spend all your
          attention on whether they're into you."
doThis: "Run both questions before you decide anything — and let what you learn about fit be
         information, not a verdict."
safetyNote: "If what you're weighing is disrespect or feeling unsafe, that's not a fit question —
             you don't weigh that against how much you like someone."
```

---

## Output construction → what the user builds & saves

The user's saved output is their **personalized two-question check**, built from the screens above:
- **Their interest** (from `ownTurn.interest`) — what they've actually seen.
- **Their fit read** (from `ownTurn.fit` + the `sentenceBuilder` sentence) — the one thing they've
  learned about whether this fits them.
- **Respect note** (from `ownTurn.respect`, optional) — anything that isn't a fit question.
No score, no verdict, no compatibility rating is ever produced — just the two questions, kept open.

## My Plays output (`myPlaysTemplate` — frozen five fields)
```
when:       "someone's appealing and I catch myself mostly tracking whether they're into me"
move:       "ask both questions — do they seem interested / what am I learning about whether I want
             this — and let fit info be data"
lookingFor: "real information about fit (availability, values, communication, goals), not just signs
             of their interest"
watchOut:   "spending all my attention on whether they like me; filing a respect/treatment thing
             under 'fit'"
remember:   "liking them and choosing them are different questions; both get to stay open"
```

## Fidelity conditions (`fidelity` — teaching copy + observable conditions)

**Play-level fidelity copy** (shown in the fidelity/Use-Review surface):
```
correct: "You kept your own question live — you can name at least one thing you've learned about fit,
          separate from whether they're interested."
misuse:
- "Turning it into a verdict or a score on the person."
- "Weighing a respect/treatment issue as if it were an ordinary fit trade-off."
notMeaning: "This isn't vetting, rejecting, or grading someone — it's keeping your own question from
             going quiet."
```
**Observable conditions on the constructed output** (what "correct" looks like in the saved tool):
- the fit read names **≥1 genuine fit observation** (availability/values/communication/goals/
  lifestyle) that is **distinct from** "they're interested";
- any respect/treatment item is placed in the **respect box**, not folded into the fit read;
- no output field expresses a for/against verdict, a rating, or a rejection decision.

## Experience → Play handoff (canonical fidelity names; no aliases)

The `dualAttention` Experience computes two **in-session** signals — **`evaluator_stance_held`** and
**`fit_information_kept_in_view`** (the canonical names from the approved Experience graph; carried
unchanged through `FidelityOutcome` → this Play → deferred persistence → Change Path). They inform
which reminder this Play leads with:
- `fit_information_kept_in_view = not_demonstrated` → open the Play emphasizing **"Your read"** (the
  second question).
- `evaluator_stance_held = demonstrated` → a lighter touch; reinforce holding both.

No new signal names are introduced here. Fidelity is computed by the Experience, not by this Play;
this Play's `fidelity` block is teaching copy.

## Suitability / safety

For **ordinary fit ambiguity**, not for reframing mistreatment as a fit trade-off (the `l2` +
`scenarioSort.s5` correction + `realWorldUse.safetyNote` carry the respect/treatment boundary).
Anything meeting the already-approved persistence/pervasiveness or Layer-A crisis criteria routes to
support; this Play adds no new detection.

## Open items (for owner note — not blockers)

1. **`sim id` / `Play version`** finalize at build (Phase C).
2. **`literature.l2` inclusion** — included here for the respect boundary; drop to L1-only if you'd
   rather that boundary live only in the Field Guide/JIT.
3. **`scenarioSort` item count/wording** — five compact items; swap any if you prefer different fit
   signals.

**Next (on approval):** author **Rest, or Giving Up?** full Play spec — still design/copy only. No
code, migration, wiring, or deploy until the Play specs are approved and Phase B begins.
