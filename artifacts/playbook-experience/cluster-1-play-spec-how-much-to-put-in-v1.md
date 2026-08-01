# Play Production Spec — "How Much to Put In" (`how-much-to-put-in`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Design/copy only — **no code, no migration, no wiring, no
deploy.** Third of four Play specs (Is This Right for You? ✅ → Rest, or Giving Up? ✅ → **How Much to
Put In** → Say the Real Thing). The last one is not specced yet. The two live Plays and the RLC
framework are unchanged.

**Play id:** `how-much-to-put-in` (finalizes the `investmentView` Experience's `teach.toPlayId`).
**Pairs with Experience:** `investmentView` (graph: `cluster-1-experience-graph-how-much-to-put-in-v1.md`).
**`outputEditor`:** yes (owner ruling #3). **Structure:** existing `Play`/`Screen` schema only.

**Operation.** **Evidence-responsive pacing**: before you change how much you're putting in, name the
evidence — keep your investment tied to what you can actually observe, and turn it into a move you
decide on purpose (an "if I see ___, I'll ___").

**Recognition gate (`recognitionGate.prompt`).**
> "I sometimes change how much I'm putting in before I actually have new information."

---

## ⚠️ Schema constraint (same as Rest — flagged, not a blocker)

No bounded single-select `Screen` primitive exists, and no new screen kinds are allowed at the Play
layer. So the four-way **investment choice** (keep / more / less / clarify) is captured with an
`ownTurn` `text` field seeded with those four as `suggestions`. The `ruleBuilder`'s **`actions`** list
(a first-class bounded pick within the rule) carries the investment moves for the executable output.

---

## Screen order

1. `shift` — observational framing
2. `literature` — L1 (required) + L2 (the space guardrail — directly necessary for correct use)
3. `learn` — the operation, incl. the pattern-vs-gap distinction
4. `scenarioSort` — compact micro-practice (**new**: observable evidence vs a gap I'm filling)
5. `ownTurn` — the user's real situation: evidence · gap · investment (seeded)
6. `ruleBuilder` — **CORE executable output** (owner ruling: not optional)
7. `output` — "Your Evidence & Move"
8. `portable` — take-with-you steps
9. `realWorldUse` — useWhen / doThis / safetyNote
+ `outputEditor` — edit evidence + rule

---

## Screen-by-screen exact copy

### 1. `shift`
```
body:
- "It's easy to change how much you're putting in based on the quiet, or a feeling — before you've
   actually got new information."
- "This helps you tie your investment to what you can genuinely see, and to a move you decide on
   purpose — so your effort follows the evidence, not the silence."
```

### 2. `literature`
```
l1: "Early dating gives you information in uneven amounts — sometimes a lot, sometimes a quiet
     stretch. It's easy to change how much you're putting in based on the quiet or a feeling rather
     than on something you've actually seen. This helps you tie your investment to observable
     evidence: what you can genuinely point to — they initiated, they followed through, they made a
     plan — or, over time, a repeated pattern you can actually see. One quiet day or a hunch isn't new
     evidence; a pattern is. The move is small: before you change how much you put in, name what
     you're going on."
l2Heading: "What 'giving a little less' means"
l2: "Because this one gets twisted a lot: easing off isn't a test, a withdrawal, a tactic, or a way to
     get someone to chase — and it has nothing to do with matching their response times or timing.
     Creating relational space means discontinuing unnecessary compensatory effort so existing mutual
     engagement becomes observable. If you're easing off to provoke a reaction, that's a different
     thing — and it usually just clouds the information you were trying to get."
```
*(L1 required; L2 included because misusing "give a little less" as a tactic is a real correct-use
risk — it carries the approved space guardrail verbatim, not a Field-Guide duplicate.)*

### 3. `learn`
```
body:
- "The move is small and repeatable:"
- "Name what you've actually seen — initiation, follow-through, plans. Over time, a repeated pattern
   counts too."
- "Notice what's a gap you're filling — a quiet stretch, a feeling, a guess. That's not new evidence."
- "Then choose your investment — keep / more / less / clarify — on purpose, tied to what you can see."
```

### 4. `scenarioSort` — compact micro-practice (new)
```
prompt: "Quick sort. Evidence, or a gap you'd be filling?"
situation: "A handful of moments from a few weeks of talking to someone."
buckets:
- { id: "evidence", label: "Observable evidence" }
- { id: "gap",      label: "A gap I'm filling / a feeling" }
items:
- { id: "s1", text: "They followed through on the plan they suggested.", correctBucket: "evidence" }
- { id: "s2", text: "It's been quiet for a day and I feel anxious.", correctBucket: "gap" }
- { id: "s3", text: "Over three weeks, they've cancelled every plan they made.", correctBucket: "evidence",
    correction: "Easy to file this under 'just the quiet' — but a repeated, observable pattern over
                 time IS evidence. The line isn't 'silence = nothing'; it's whether you're filling a
                 gap or responding to a pattern you've actually seen." }
- { id: "s4", text: "I've got a feeling they're pulling away.", correctBucket: "gap" }
- { id: "s5", text: "They texted first and asked how my week went.", correctBucket: "evidence" }
- { id: "s6", text: "They haven't replied in two hours.", correctBucket: "gap" }
note: "One quiet day or a feeling isn't new evidence — that's a gap you might be filling. A repeated
       pattern you can actually point to is evidence. Tie your investment to what you can see, not to
       the silence."
evidenceQuestion:
  prompt: "When you feel the pull to put in more, what's worth checking first?"
  options:
  - "Whether there's actually a new sign it's mutual"
  - "How the silence feels"
  - "Whether they've texted yet today"
```

### 5. `ownTurn`
```
intro: "Now a real situation of yours. Keep it to what you've genuinely seen."
fields:
- { id: "evidence", label: "What have you actually seen? (initiation, follow-through, plans — or a
    repeated pattern over time)", input: "chips", placeholder: "e.g. planned our last two dates" }
- { id: "gap", label: "What are you filling in — a quiet stretch, a feeling, a guess?", input: "chips",
    placeholder: "e.g. quiet since Tuesday and I'm reading into it" }
- { id: "investment", label: "Right now, what do you want to do with your investment?", input: "text",
    suggestions: [ "Keep it where it is", "Give a little more",
                   "Give a little less (ease off effort that isn't being matched)", "Clarify first" ],
    placeholder: "pick one, or say it your way" }
```
*(Investment suggestions are seeded, per the schema constraint above.)*

### 6. `ruleBuilder` — CORE executable output
```
intro: "Now turn it into a move you decide now — so you're not deciding in the quiet, from a feeling."
conditionLabel: "If I see… (the observable thing you'll watch for)"
thenLabel: "…then I will"
actions:  # HMP_ACTIONS — the user's OWN moves; no mirrored/waiting/withdrawal/pursuit behavior
- "keep my investment where it is"
- "put in a little more"
- "ease off effort that isn't being matched, so what's there gets clearer"
- "ask a clear question to get the information"
- "take what I've seen as my answer and decide"
controlCheck:  # HMP_CONTROL_CHECK
  "This governs your own next move based on what you can observe. It's not a test, a way to get them
   to chase, matching their timing, or waiting them out."
```
*(The rule condition must name an **observable** thing — a mutual signal or a repeated pattern — not a
feeling, a countdown, or a timeline; the action is the user's **own** move. Excluded vocabulary
[stop-texting-first · mirrored response times · making-someone-chase · withholding · scorekeeping ·
tit-for-tat] never appears as an action.)*

### 7. `output`
```
heading: "Your Evidence & Move"
body: "Here's what you're going on, and the move you've decided. Keep it, or save it to My Plays."
```

### 8. `portable`
```
heading: "Take it with you"
steps:
- "What have I actually seen?"
- "Evidence (or a repeated pattern) — or a gap I'm filling?"
- "Keep / more / less / clarify — on purpose"
- "If I see ___, I'll ___. (my move, not a tactic)"
```

### 9. `realWorldUse`
```
useWhen: "you feel the pull to text more into a silence, or to pull back to get a reaction."
doThis: "Name what you've actually seen before you change your investment — then run your
         'if I see ___, I'll ___.'"
safetyNote: "If the real issue is that someone's unavailable or treating you badly, that's not a
             pacing question — trust that, and you don't need more evidence for it."
```

### `outputEditor` (like RD)
```
heading: "Update your evidence & move"
fields:
- { id: "evidence", label: "What have you actually seen?", input: "text" }
- { id: "rule", label: "Your move", input: "rule", actions: <HMP_ACTIONS>, controlCheck: <HMP_CONTROL_CHECK> }
```

---

## Output construction → what the user builds & saves

The saved output is the user's **evidence read** (`ownTurn.evidence`) plus their **decided move** —
the `ruleBuilder` "If I see ___, I'll ___" tied to observable evidence, with the control-check
affirmed. Editable via the `outputEditor`. No scorekeeping, no tally, no partner data is produced;
the other person's response is never something the move is meant to engineer.

## My Plays output (`myPlaysTemplate` — frozen five fields)
```
when:       "I'm about to change how much I'm putting in"
move:       "name the evidence first, then choose keep / more / less / clarify — on purpose"
lookingFor: "observable mutual signals (initiation, follow-through, plans), not the silence"
watchOut:   "effort climbing to fill quiet; using 'less' as a test or to provoke pursuit; scorekeeping"
remember:   "space means easing off unmatched effort so what's real becomes visible — not a tactic"
```

## Fidelity conditions (`fidelity` — teaching copy + observable conditions)

**Play-level fidelity copy:**
```
correct: "Your investment change is tied to something you actually observed, and it's a deliberate
          choice — not a reaction to the quiet or a way to get a response."
misuse:
- "Using 'give a little less' as a test, a withdrawal, or a way to make someone chase."
- "Scorekeeping or matching response times."
notMeaning: "This isn't playing games, withholding, or tit-for-tat. The other person's response isn't
             something you engineer."
```
**Observable conditions on the constructed output:**
- the rule's **"if I see ___"** names an **observable** thing (a mutual signal or a repeated pattern),
  **not** a feeling, a countdown, or a timeline;
- the **"then I will"** action is the user's **own** move — never mirrored behavior, a waiting tactic,
  withdrawal, response-time matching, or a pursuit test;
- the `controlCheck` is affirmed.

## Experience → Play handoff (canonical fidelity names; no aliases)

The `investmentView` Experience computes (in-session): **`investment_evidence_tied`** and
**`effort_without_new_evidence_noticed`** (canonical names, carried unchanged through `FidelityOutcome`
→ this Play → deferred persistence → Change Path).
- `effort_without_new_evidence_noticed = not_demonstrated` → open the Play emphasizing **"Name what
  you've actually seen"** and the pattern-vs-gap distinction.
No new signal names are introduced; fidelity is computed by the Experience, not this Play.

## Suitability / safety

Not a pacing question when the real issue is **mistreatment or unavailability** — the `safetyNote`
signposts that. Anything meeting the already-approved persistence/pervasiveness or Layer-A crisis
criteria routes to support; this Play adds no new detection and produces no scorekeeping or partner
data.

## Open items (for owner note — not blockers)

1. **Investment choice** modeled as a seeded `ownTurn` text field (no bounded single-select screen
   kind; no new screen kinds allowed). The `ruleBuilder.actions` list carries the executable moves.
2. **`HMP_ACTIONS` / `HMP_CONTROL_CHECK`** wording — the five actions + control-check above are
   candidates; adjust phrasing if you prefer (must stay the user's own move + forbid the excluded
   vocabulary).
3. **`sim id` / Play version** finalize at build (Phase C).

**Next (on approval):** author **Say the Real Thing** full Play spec — the final one; still design/
copy only. No code, migration, wiring, or deploy until the Play specs are approved and Phase B begins.
