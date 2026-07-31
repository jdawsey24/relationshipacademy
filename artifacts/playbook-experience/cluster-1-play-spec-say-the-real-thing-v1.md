# Play Production Spec — "Say the Real Thing" (`say-the-real-thing`) — v1

**Status:** PRODUCTION COPY, FOR REVIEW. Design/copy only — **no code, no migration, no wiring, no
deploy.** Fourth and **final** Play spec (Is This Right for You? ✅ → Rest, or Giving Up? ✅ → How Much
to Put In ✅ → **Say the Real Thing**). The two live Plays and the RLC framework are unchanged.

**Play id:** `say-the-real-thing` (finalizes the `communicationRehearsal` Experience's `teach.toPlayId`).
**Pairs with Experience:** `communicationRehearsal` (graph:
`cluster-1-experience-graph-say-the-real-thing-v1.md`). **`outputEditor`:** yes — saves/edits the
**bounded real-world sentence** (owner ruling #3). **Structure:** existing `Play`/`Screen` schema only.
**Strictly R1 / low-risk.**

**Operation.** Say the genuine **preference / opinion / small request** clearly and kindly, **without
self-erasure** — and treat what comes back as **information about fit**, not a grade. Low-risk material
only.

**Recognition gate (`recognitionGate.prompt`).**
> "I smooth myself over — agree, soften, or apologize — to stay likable, instead of saying the real
> thing."

---

## Screen order

1. `shift` — observational framing
2. `literature` — L1 only (the higher-risk-routing note lives in `safetyNote`, not a duplicated L2)
3. `learn` — the operation + the decoupling (response = information, not a grade)
4. `scenarioSort` — compact micro-practice (**new**: sort phrasings by clarity vs erasure)
5. `ownTurn` — the user's real low-risk moment + the real thing
6. `sentenceBuilder` — build the bounded, clear, kind sentence (the executable core)
7. `output` — "Your Real Thing"
8. `portable` — take-with-you steps
9. `realWorldUse` — useWhen / doThis / safetyNote
+ `outputEditor` — save/edit the bounded real-world sentence

---

## Screen-by-screen exact copy

### 1. `shift`
```
body:
- "In small moments, it's easy to smooth yourself over — agree, soften, or apologize — to keep things
   nice, and let the real thing disappear."
- "This helps you say the real thing clearly and kindly, and treat what comes back as information
   about whether you fit — not a verdict on you."
```

### 2. `literature`
```
l1: "Editing yourself to stay likable — agreeing when you don't, softening a preference until it's
     gone, apologizing for having one — is a common reflex, especially when you like someone. The
     catch is that smoothing yourself over leaves you with nothing to learn: their response only tells
     you something if you actually said the real thing. Saying it — clearly and kindly — isn't a risk
     to manage; it's how you find out whether this fits. And success isn't whether they liked it. A
     range of reactions is normal, and none of them is a failure — each is just information about how
     this person meets a real, small thing from you. This is for low-risk moments: preferences,
     opinions, small requests. Higher-stakes or unsafe conversations aren't what this tool is for."
```
*(No `l2` — the R1/higher-risk boundary is stated in `safetyNote`/`realWorldUse`, and the broader
material lives in the Field Guide, per owner ruling #1.)*

### 3. `learn`
```
body:
- "Three quick moves:"
- "Name the real thing — the preference, opinion, or small request."
- "Say it clearly and kindly — no disappearing act, no apology tax."
- "Let their answer be information — about fit, not a verdict on you. You don't control how it lands,
   and that's fine."
```

### 4. `scenarioSort` — compact micro-practice (new)
```
prompt: "Quick sort. They suggested 8pm; you'd honestly rather do earlier. Which of these says the
         real thing?"
situation: "They suggested meeting at 8. You'd genuinely rather do earlier — you're wiped by 8 on a
            weeknight."
buckets:
- { id: "clear",  label: "Says the real thing" }
- { id: "buried", label: "Buries it in apology" }
- { id: "erased", label: "Smooths it over" }
items:
- { id: "s1", text: "\"Sure, 8 works!\"", correctBucket: "erased" }
- { id: "s2", text: "\"Could we do earlier? 8's a stretch for me on a weeknight.\"", correctBucket: "clear" }
- { id: "s3", text: "\"Maybe-ish? Whatever's easiest for you, honestly.\"", correctBucket: "erased" }
- { id: "s4", text: "\"Sorry, I know this is so annoying — maybe earlier? Only if that's totally fine!\"",
    correctBucket: "buried",
    correction: "The real thing's in there — you just paid an apology tax for it. It can stand without
                 the sorry." }
- { id: "s5", text: "\"I'd like to do earlier — I'm wiped by 8.\"", correctBucket: "clear" }
note: "Only one kind actually says it plainly. 'Smoothing it over' leaves you with nothing to learn;
       'burying it in apology' says it but half-takes it back. Clear and kind is the move."
evidenceQuestion:
  prompt: "What are you actually trying to find out by saying the real thing?"
  options:
  - "Something about whether we fit"
  - "Whether they'll like me"
  - "Whether I can dodge the awkwardness"
```

### 5. `ownTurn`
```
intro: "Now a small, low-risk moment of yours — the kind where you'd usually smooth yourself over."
fields:
- { id: "moment", label: "The moment — a plan, an opinion, or a small request.", input: "text",
    placeholder: "e.g. they want the loud bar; I'd rather somewhere quieter" }
- { id: "real", label: "What's the real thing you'd want to say?", input: "text" }
```

### 6. `sentenceBuilder`
```
label: "Say it — one clear, kind sentence. No disappearing act, no apology tax."
helper: "The real thing, plainly. This is the sentence you can actually use — their answer will be
         information about fit, not a verdict on you."
```

### 7. `output`
```
heading: "Your Real Thing"
body: "Here's the sentence you'd use — clear and kind. Keep it, or save it to My Plays."
```

### 8. `portable`
```
heading: "Take it with you"
steps:
- "What's the real thing?"
- "Say it — clear and kind"
- "No disappearing act, no apology tax"
- "Their answer is information about fit, not a verdict on me."
```

### 9. `realWorldUse`
```
useWhen: "a low-risk moment where you're tempted to smooth yourself over — a plan, an opinion, a small
          request."
doThis: "Say the real thing clearly and kindly, without burying it in apology or explanation."
safetyNote: "For higher-stakes or unsafe conversations, this low-risk tool isn't the right one — those
             deserve more support."
```

### `outputEditor` (saves/edits the bounded real-world sentence — owner ruling #3)
```
heading: "Update your sentence"
fields:
- { id: "sentence", label: "The real thing you'd say", input: "text" }
```
*(A single, bounded, low-risk sentence — the actual preference/opinion/small request the user intends
to communicate. R1 only.)*

---

## Output construction → what the user builds & saves

The saved output is the user's **bounded real-world sentence** — the clear, kind version of the real
thing they intend to say (from `sentenceBuilder`), editable via the `outputEditor`. No reaction is
scored or predicted; success is never framed as whether the other person liked it.

## My Plays output (`myPlaysTemplate` — frozen five fields)
```
when:       "I notice myself about to agree / soften / apologize to stay likable"
move:       "name the real thing, say it clearly and kindly, let their response be information"
lookingFor: "what I actually prefer/think/need — said plainly"
watchOut:   "vanishing the preference; burying it in apology; grading myself on their reaction"
remember:   "saying it is how I find out about fit; the response isn't a verdict on me"
```

## Fidelity conditions (`fidelity` — teaching copy + observable conditions)

**Play-level fidelity copy:**
```
correct: "You said the genuine thing with enough clarity that it could actually land — without
          erasing yourself in agreement or apology."
misuse:
- "Measuring success by whether they liked it."
- "Using it to push high-stakes or confrontational material that belongs in a safer, supported
   setting."
notMeaning: "This isn't about getting a reaction, scripting lines, or winning — it's saying the real
             thing and learning from what comes back."
```
**Observable conditions on the constructed output:**
- the saved sentence **states the genuine preference/opinion/request with sufficient clarity** — not
  vanished (auto-agree/soften) and not buried in apology or over-explanation;
- the material is **low-risk** (preference/opinion/small request), not high-stakes/confrontational;
- success is **not** framed as getting a particular reaction.

## Experience → Play handoff (canonical fidelity names; no aliases)

The `communicationRehearsal` Experience computes (in-session): **`preference_expressed_clearly`** and
**`unnecessary_self_erasure_avoided`** (canonical names, carried unchanged through `FidelityOutcome`
→ this Play → deferred persistence → Change Path).
- `unnecessary_self_erasure_avoided = not_demonstrated` → open the Play emphasizing **"no disappearing
  act, no apology tax."**
- `preference_expressed_clearly = not_demonstrated` → emphasize **"name the real thing"** + clarity.
No new signal names are introduced; fidelity is computed by the Experience, not this Play.

## Suitability / safety

**R1 low-risk only.** Higher-risk / more-demanding material (confronting mistreatment,
high-consequence disclosure, an unsafe partner) is **out of scope** and routes to the already-approved
supported/excluded routes; the `safetyNote` signposts it. The only user-authored text is the bounded
low-risk sentence saved as the Play output (consistent with other Plays' saved outputs); this Play
adds no new detection.

## Open items (for owner note — not blockers)

1. **`sim id` / Play version** finalize at build (Phase C).
2. **`scenarioSort` item wording** — five phrasings across three buckets; swap any if you prefer a
   different low-risk moment.

**Status of Phase A:** with this spec, **all four full Play production specs are authored** — Is This
Right for You? (approved), Rest, or Giving Up? (approved), How Much to Put In (approved), and Say the
Real Thing (this one, awaiting approval). On approval of this last spec, **Phase A is complete** and
Phase B (shared infrastructure) begins. No code, migration, wiring, or deploy in Phase A.
