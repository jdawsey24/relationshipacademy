# Play Production Spec — "Rest, or Giving Up?" (`rest-or-giving-up`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Design/copy only — **no code, no migration, no wiring, no
deploy.** Second of four Play specs (Is This Right for You? ✅ → **Rest, or Giving Up?** → How Much to
Put In → Say the Real Thing). The other two are not specced yet. The two live Plays and the RLC
framework are unchanged.

**Play id:** `rest-or-giving-up` (finalizes the `decisionRoom` Experience's `teach.toPlayId`).
**Pairs with Experience:** `decisionRoom` (graph: `cluster-1-experience-graph-rest-or-giving-up-v1.md`).
**`outputEditor`:** yes (owner ruling #3). **Structure:** existing `Play`/`Screen` schema only; **no
other person in this tool.**

**Operation.** Choose an **intentional, revisitable stance toward dating right now** — from present
capacity and intention — instead of letting a discouraged moment decide forever. **Not necessarily an
"engagement/rest decision": `pause_decision` (not deciding yet) is an equally valid stance.**

**Recognition gate (`recognitionGate.prompt`).**
> "When dating gets heavy, a hard week can quietly decide I'm done — instead of me choosing on
> purpose."

---

## ⚠️ Schema constraint (affects one screen — flagged, not a blocker)

The Play `Screen` kinds have **no bounded single-select** primitive (`ownTurn` fields are `text` or
`chips`; `sufficiency` is binary; `ruleBuilder.actions` is rule-scoped). Per the owner ruling, **no
new screen kinds** at the Play layer. So the five-way stance is captured with an **`ownTurn` `text`
field seeded with the five canonical stances as `suggestions`** (soft-select: tap a suggestion or say
it your way). The canonical `chosen_stance` enum (`rest | not_now | lightly_open | return_later |
pause_decision`) remains the **Experience's** in-session signal; this Play presents/edits the stance
as seeded text. *(If a strict bounded stance control mapped directly to the enum is wanted, that needs
a new screen kind — deferred; see Open items.)*

---

## Screen order

1. `shift` — observational framing
2. `literature` — L1 only (L2 omitted; the fatigue/loneliness material lives in the Field Guide)
3. `learn` — the operation
4. `scenarioSort` — compact micro-practice (**new**: sort thoughts into feeling / forever conclusion /
   stance)
5. `emotionBeat` — honor the feeling, no pathology
6. `ownTurn` — the user's situation: what's true now · stance (seeded) · optional re-entry
7. `output` — "Your Stance, For Now"
8. `portable` — take-with-you steps
9. `realWorldUse` — useWhen / doThis / safetyNote (support-signpost boundary)
+ `outputEditor` — edit stance + optional re-entry

---

## Screen-by-screen exact copy

### 1. `shift`
```
body:
- "When dating gets heavy, a hard week or a rough date can quietly settle the question — 'I'm done' —
   before you've actually chosen anything."
- "This helps you choose your stance toward dating on purpose, just for right now, and keep it
   something you can revisit. Resting counts. Not-now counts. Not deciding yet counts."
```

### 2. `literature`
```
l1: "Dating fatigue, discouragement, loneliness, dread — these are common, and none of them is a
     verdict on you or on how it'll go. What's worth catching is the moment a hard feeling quietly
     turns into a forever conclusion: 'it's never going to happen,' 'I'll always be the one not
     chosen.' That's a forever question being answered with today's feeling. You can honor the
     feeling and still keep it separate from what you actually want to decide — which is only ever
     'for right now.' Choosing to rest, to step back, to stay lightly open, to come back later, or
     simply not to decide yet from a low moment — these are all real, equal choices, and every one of
     them is yours to change. Rest isn't giving up, and a break isn't a failure."
```
*(No `l2` — the broader loneliness/fatigue material belongs to the Understand/Field Guide layer, not
duplicated here, per owner ruling #1.)*

### 3. `learn`
```
body:
- "Three quick moves:"
- "Name what's true right now — tired, discouraged, lonely, flat. No fixing, just naming."
- "Notice if a feeling is trying to make a forever decision — and set that part aside; you're only
   choosing for now."
- "Choose your stance for right now — rest, not now, lightly open, come back later, or not deciding
   yet. All of them count, and you can change your mind."
```

### 4. `scenarioSort` — compact micro-practice (new)
```
prompt: "Quick sort. Which is which?"
situation: "A few thoughts that show up on a low dating night."
buckets:
- { id: "feeling", label: "A feeling, right now" }
- { id: "forever", label: "A forever conclusion" }
- { id: "stance",  label: "A stance I could choose" }
items:
- { id: "s1", text: "I'm wiped out by the apps right now.", correctBucket: "feeling" }
- { id: "s2", text: "It's never going to happen for me.", correctBucket: "forever",
    correction: "That's a forever conclusion showing up in a discouraged moment — it answers a
                 *forever* question with *tonight's* feeling. You don't have to call it forever." }
- { id: "s3", text: "I'm setting this down for a month, then I'll see how I feel.", correctBucket: "stance" }
- { id: "s4", text: "I'll always be the one who doesn't get chosen.", correctBucket: "forever",
    correction: "A hard stretch, spoken as 'always.' That's a big word for one rough patch — you're
                 allowed to leave it open even when it doesn't feel open." }
- { id: "s5", text: "I want to stay a little open, without chasing anything.", correctBucket: "stance" }
- { id: "s6", text: "Honestly, I just dread opening the app tonight.", correctBucket: "feeling" }
note: "Feelings are real and worth naming — they just aren't decisions. Forever conclusions answer a
       forever question with today's feeling. A stance is something you choose, for now, and can
       change."
evidenceQuestion:
  prompt: "Which of these is a choice you get to make on purpose?"
  options:
  - "A stance I could choose"
  - "A feeling, right now"
  - "A forever conclusion"
```

### 5. `emotionBeat`
```
body:
- "Feeling done-for-now tired, or lonely, or discouraged isn't a flaw or a diagnosis — it's a real
   signal, and it's allowed."
- "You can honor exactly how it feels and still choose your stance on purpose. Rest is a choice, not
   a defeat."
```

### 6. `ownTurn`
```
intro: "Now you. Just for right now — not forever."
fields:
- { id: "now", label: "Right now, what's most true for you?", input: "text",
    placeholder: "e.g. I'm tired of the apps, and the last date stung" }
- { id: "stance", label: "For right now, what do you want to choose?", input: "text",
    suggestions: [
      "Rest — set it down for a while",
      "Not now — not dating right now",
      "Lightly open — around, not pursuing",
      "Come back later, on my terms",
      "Not deciding yet — let it settle"
    ],
    placeholder: "pick one, or say it your way" }
- { id: "reentry", label: "Optional: what would make coming back feel right? (Only if you want to —
    you don't have to name this.)", input: "text", placeholder: "leave blank if you'd rather not" }
```
*(The `stance` suggestions map to `chosen_stance`: `rest | not_now | lightly_open | return_later |
pause_decision`. The `reentry` field is **optional** — a user choosing rest/not-now is never required
to say when they'll return, per owner ruling #2.)*

### 7. `output`
```
heading: "Your Stance, For Now"
body: "Here's what you've chosen — for right now, and yours to change. Keep it, or save it to My Plays."
```

### 8. `portable`
```
heading: "Take it with you"
steps:
- "What's true right now?"
- "Is a feeling trying to make a forever decision?"
- "What do I want to choose — just for now?"
- "Rest counts. I can revisit this anytime."
```

### 9. `realWorldUse`
```
useWhen: "the apps feel like a chore, or a letdown has you ready to call it forever."
doThis: "Choose a stance for right now, on purpose — rest included — and let it be something you can
         revisit."
safetyNote: "If the heaviness is bigger than dating — following you everywhere, for a long time, or
             you're not sure you want to be here — that deserves more than a dating tool. Talking with
             a mental health professional can help, and support is available."
```

### `outputEditor`
```
heading: "Update your stance"
fields:
- { id: "stance",   label: "Your stance for now", input: "text",
    suggestions: [ "Rest — set it down for a while", "Not now — not dating right now",
                   "Lightly open — around, not pursuing", "Come back later, on my terms",
                   "Not deciding yet — let it settle" ] }
- { id: "reentry",  label: "What would make coming back feel right? (optional)", input: "text" }
```

---

## Output construction → what the user builds & saves

The saved output is the user's **chosen stance for now** (from `ownTurn.stance`) plus, **optionally**,
their **re-entry conditions** (`ownTurn.reentry`) and a note of what's true right now (`ownTurn.now`).
Everything is framed "for right now" and is editable via the `outputEditor`. No mood score, no
diagnosis, no forever verdict is ever produced.

## My Plays output (`myPlaysTemplate` — frozen five fields)
```
when:       "dating feels heavy and I catch myself concluding it's never going to happen"
move:       "name what's true now, separate the feeling from the decision, choose a stance for now
             (rest included)"
lookingFor: "a deliberate, revisitable stance from my present capacity — not a forever verdict"
watchOut:   "letting a low moment make a forever decision; treating rest as failure"
remember:   "rest is a real choice; a break isn't giving up; I can revisit anytime"
```

## Fidelity conditions (`fidelity` — teaching copy + observable conditions)

**Play-level fidelity copy:**
```
correct: "You chose an intentional stance for now and kept it revisitable."
misuse:
- "Treating a break as failure, or forcing yourself back to dating to prove something."
- "Reading a forever verdict off one discouraged night."
notMeaning: "This isn't quitting, and it isn't a diagnosis. Rest and staying open are equally valid."
```
*(Rest, not-now, lightly-open, return-later, and pause-decision are **co-equal** satisfying stances.)*

**Observable conditions on the constructed output:**
- the `stance` field holds one of the five stances (or the user's own equivalent), framed as **"for
  now"**;
- **no** output field expresses a permanent / forever verdict;
- `reentry` is **optional** — absent is fully fine and never a failure.

## Experience → Play handoff (canonical fidelity names; no aliases)

The `decisionRoom` Experience computes (in-session): **`intentional_stance_selected`**,
**`discouragement_distinguished_from_conclusion`**, and the **`chosen_stance`** enum (`rest | not_now
| lightly_open | return_later | pause_decision`) — canonical names carried unchanged through
`FidelityOutcome` → this Play → (deferred) persistence → Change Path.
- `chosen_stance` can **pre-orient** the `ownTurn.stance` field (seed the suggestion the user picked
  in the Experience).
- `discouragement_distinguished_from_conclusion = not_demonstrated` → lead with the "is a feeling
  trying to make a forever decision?" framing.
No new signal names are introduced here; fidelity is computed by the Experience, not this Play.

## Suitability / safety

Highest-sensitivity Play. **Never push toward dating**; rest / not-now / pause are co-equal; loneliness
is not pathologized; a break is not a failure. The ordinary, dating-specific **"never going to happen"
read is not, by itself, a support-signpost trigger** — the `safetyNote` signposts support only for
heaviness that is pervasive / identity-level / crisis, and **escalation is governed only by the
already-approved persistence/pervasiveness + Layer-A crisis rules.** This Play adds no new detection
and produces no diagnosis.

## Open items (for owner note — not blockers)

1. **Stance capture** — modeled as a seeded `ownTurn` text field (no bounded single-select screen kind
   exists; no new screen kinds allowed). If you want a strict bounded stance control that writes the
   `chosen_stance` enum directly at the Play layer, that requires a new screen kind (deferred). For v1
   the enum is the Experience's signal; the Play presents/edits the stance as seeded text.
2. **`sim id` / Play version** finalize at build (Phase C).
3. **Re-entry persistence** — the saved `reentry` text persists with the Play output (like any My
   Plays field), remaining optional; it is not a separate sensitive-text surface.

**Next (on approval):** author **How Much to Put In** full Play spec — still design/copy only. No
code, migration, wiring, or deploy until the Play specs are approved and Phase B begins.
