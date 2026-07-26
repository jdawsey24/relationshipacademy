# Difficulty Feeling Chosen — Content Architecture & Consumer Copy (v1)

**Status:** **APPROVED FOR IMPLEMENTATION — CLUSTER 1 PROTOTYPE.** Final consumer copy + content model.
Four owner corrections applied (S3, S4R, S7, S13); the 10-point copy QA passed (see appendix). Not yet built.
Maps 1:1 to the approved UX Architecture v1 screens (S0–S16). Anchored to the existing "Moving Beyond
Rejection" voice. Governing task: Discernment. Spine: PRESENT → OBSERVE → DECIDE.

---

# PART 1 — CONTENT ARCHITECTURE

## 1. Voice & tone
- **Warm, plain, and on the user's side.** Talk *to* a person having a hard time, not *about* a "type."
- **Worth-preserving.** Separate worth from being chosen (the shell's key line: *"Rejection tells you a relationship wasn't mutual. It doesn't tell you that you weren't worthy."*).
- **Conditional, never diagnosing.** Always "*if you notice…*", "*do you ever…*" — never "people who feel unchosen do X."
- **No mechanism, no prevalence, no timelines.** Never explain *why* they feel unchosen; never claim what such people "do"; never "wait 3 days."
- **Autonomy first.** The Playbook gives information; the user decides. Multiple choices are always okay.
- **Reciprocity is information, not a scoreboard** (pattern-level, not matched turns).

## 2. Reading level
Target **~5th grade**: short sentences, common words, one idea per line, active voice. Warmth over cleverness.

## 3. Consumer-facing naming (finalized for copy)
| Internal (source of truth) | Consumer-facing |
|---|---|
| Authentic Self-Presentation (PRESENT) | **Show the real you** |
| Reciprocity-Based Investment (OBSERVE) | **Watch what they actually bring** |
| Evidence-Informed Decision-Making (DECIDE) | **Decide from what you see** |
| Intentional Dating Break (context) | **Taking a break, on purpose** |
| The completion artifact | **My Relationship Play** |

**Contribution constructs → plain labels** (OBSERVE): Reaches out · Responds · Follows through · Makes time ·
Stays steady · Asks about you · Helps plan / puts in effort · Words match actions.

**DECIDE outcomes → plain labels** (co-equal, never ranked): Keep going · Grow closer · Slow down ·
Ask them directly · Watch a little longer · Step back.

## 4. Content model (per screen: content *type* of each slot)
- **Static** — fixed copy (headings, teaching text, button labels).
- **Branch-variant** — copy that changes with a recognition answer (e.g., PRESENT reinforce vs rehearse).
- **User-generated** — the user's own selections/words (feeds *My Relationship Play*; the product never fills these).
- **System-reflection** — neutral microcopy the system shows in response (never a recommendation or score).

For implementation, this doc can be emitted as a `content.json` keyed by `screen_id → slot_id → {type, copy}`;
copy below is the source. No slot contains a partner-tracking field, a score, or a completion %.

## 5. Global microcopy
- Progress rail labels: **Present · Observe · Decide** (a *place*, not a percentage).
- Primary button default: **Continue**. Capture button: **Add to my Play**.
- "Add to my Play" is always **optional** — a user can proceed without adding.
- Back is always available; nothing is timed.

---

# PART 2 — CONSUMER COPY (screen by screen)

### S0 · Welcome  *(static)*
**Welcome to your Playbook.**
This isn't a guide to becoming more likable. It's a way to see your dating life more clearly — so you can make choices instead of waiting to be picked.
It takes about 15 minutes, and it's yours to come back to anytime.
`[ Begin ]`

### S1 · The Shift  *(static; teaching motion)*
~ "Am I being chosen?" ~ → ~ "What is this showing me — and what do I want to do about it?" ~
When dating hurts, it's easy to get stuck on one question: *Am I good enough to be picked?*
This Playbook helps you ask a better one — not *"How do I get chosen?"* but *"What is this connection actually showing me?"*
That's a skill. You can build it.
`[ Show me how ]`

### S2 · The Map  *(static)*
**Three steps you'll practice:**
- **Present** — Show the real you, so a real fit can happen.
- **Observe** — Notice what the other person actually brings.
- **Decide** — Choose your next move from what you see.
You'll go in order. And you can use these again with anyone new.
`[ Start with Present ]`

### S3 · Present — Recognition  *(branch-variant trigger)*
**Do you ever hide parts of yourself early on?**
When you really like someone, you might:
- keep a preference to yourself,
- say *"that's fine"* when it isn't,
- make a need smaller than it is,
- or turn into who you think they want.
Sound like you?
`( Often ) ( Sometimes ) ( Rarely ) ( That's not really me )`

### S4 · Present — Rehearsal  *(shown if Often/Sometimes)*
**What would you usually do?**
*You've been wanting to try a new place. They suggest one you're not into. Usually, you'd…*
- **"Sounds great!"** — even though it's a no for you.
- **Explain everything wrong with their pick** and list three you'd prefer.
- **"I've been wanting to try somewhere else — could we?"**

*System-reflection after each choice (no right/wrong badge):*
- (edit): "Saying yes keeps things smooth — but now they've met a version of you that isn't quite real. That makes fit harder to see."
- (over-share): "Sharing is good. But a full download can crowd out the moment. Fit shows up in small, honest exchanges."
- (paced): "That's one clear, kind, true thing. Now you get to see how they handle it — and that tells you something real."
`[ Continue ]`

### S4R · Present — Reinforce  *(shown if Rarely/Not me)*
**You already show up honestly.**
That gives the connection more accurate information to work with. When you show up honestly, the way someone responds gives you something real to notice.
`[ Continue ]`

### S5 · Present — Capture  *(user-generated)*
**Pick one true thing to practice showing.**
What's one honest thing you'd like to express more clearly?
`( A preference ) ( A need ) ( What I actually want ) ( A boundary ) ( My real opinion ) ( ✎ Write your own )`
`[ Add to my Play ]`   `[ Skip ]`

### S6 · Observe — Watch how it goes both ways  ★ SIGNATURE  *(static teaching + interaction)*
**Watch how it goes both ways.**
When you like someone, it's easy to watch just one thing: *Do they like me back?* Let's practice watching something more useful — **what they actually bring.**

*Pass 1 —* "When you fill every gap…" → "…you're the only one showing up. There's no room to see what they'd bring."
*Pass 2 —* "When you leave a little room…" → "…you get to see it. Maybe they reach back, follow through, make time. Maybe they don't. Either way — now you know something real."

*Their part can look different from yours.* You reach out; they follow through and plan the next one. **That still counts.** You're looking for a pattern of *both* people showing up — not a perfect match.

*(contribution tokens shown on the timeline):* Reaches out · Responds · Follows through · Makes time · Stays steady · Asks about you · Helps plan · Words match actions.

**Reciprocity is information — not a scoreboard.**
`[ I see it ]`

### S7 · Observe — Recognition  *(branch-variant; multi-select)*
**What do you want to pay more attention to?**
Interest can show up in different ways. Which of these would help you get a clearer picture of whether both people are participating?
`☐ They reach out too   ☐ They respond   ☐ They follow through   ☐ They make time`
`☐ They stay steady   ☐ They ask about you   ☐ They help plan   ☐ Their words match their actions`
`( I already watch for these )` → *reinforce:* "Good — you're already reading the thing that matters most."
`[ Continue ]`

### S8 · Observe — Capture  *(user-generated; prefilled from S7)*
**What will you pay attention to?**
Here's what you'll watch for from now on. Change it if you like.
`{prefilled selections, editable}`
`[ Add to my Play ]`

### S9 · Decide — Hoping vs. deciding  *(static)*
**Hoping vs. deciding.**
Waiting to be chosen can turn into waiting *forever* — hoping they'll finally decide about you.
There's another way: **you decide**, from what you actually see. Not by a date on the calendar — by what shows up.
`[ Show me ]`

### S10 · Decide — What would you need to see?  *(user-generated + system-reflection)*
**What would you need to see?**
Pick the things that would tell you this is worth more of you.
`☐ They follow through   ☐ They reach out too   ☐ They answer honestly when I ask`
`☐ Their behavior changes when it matters   ☐ They own their part   ☐ They make real time for me`

**Now — what's actually happening with each?**
`{per selected item:  ( Yes )  ( Not really )  ( Can't tell yet )}`

**So, what's your move?** *(all okay — pick what fits)*
`( Keep going ) ( Grow closer ) ( Slow down ) ( Ask them directly ) ( Watch a little longer ) ( Step back )`

*System-reflection (only if they pick "Watch a little longer" while most reads are Yes/Not really):*
"It looks like you may already see a lot of what you need. Watching longer is okay — just make sure you're not waiting to avoid a call you can already make. Only you can decide that."
`[ Add to my Play ]`

### S11 · Decide — Capture  *(user-generated; prefilled)*
**The evidence you'll use.**
When you're deciding whether to keep investing, this is what you'll look at.
`{prefilled from S10, editable}`
`[ Add to my Play ]`

### S12 · Quick check  *(branch-variant trigger)*
**One quick check.**
Right now, does dating feel draining, hopeless, or like it costs more than it gives?
`( Yes ) ( Kind of ) ( No, I'm okay )`

### S13 · Taking a break, on purpose  *(shown if Yes/Kind of; user-generated)*
**Taking a break, on purpose.**
Taking a break can mean different things. What matters here is knowing what you want the break to do for you.
- **What am I stepping away from?**  `{short answer}`
- **What is this break for?**  `{short answer}`
- **What would tell me I'm ready to think about dating again?**  `{short answer}`
`☐ Send me a gentle check-in reminder (optional)`  ← *optional; no fixed length*
`[ Add to my Play ]`

### S14 · Integration  *(static)*
**This is a loop, not a finish line.**
Present, Observe, Decide — you can use these with anyone new.
The goal was never to *get chosen*. It's to see clearly, and choose for yourself.
`[ See my Play ]`

### S15 · My Relationship Play  *(user-generated summary)*
**My Relationship Play**
- **Present** — I want to show: `{summary.present}`
- **Observe** — I'll pay attention to: `{summary.observe}`
- **Decide** — I'll decide using: `{summary.decide}`
- **If I need a break** — `{summary.break}`  *(only shown if S12 was Yes/Kind of)*

This is yours. Come back to it whenever you meet someone new.
`[ Save ]`   `[ Edit ]`

### S16 · Welcome back  *(re-entry; optional self-mark — v1.1)*
**Welcome back.**
Here's your Play. Did you get to try any of it?
`{each section:  ☐ I tried this }`  ← *optional; marking it just means you used it, not that you've mastered it.*

---

## Appendix A — corrections applied (this pass)
- **S3:** removed "A lot of people do, without meaning to." (unsupported prevalence) — now goes straight from the conditional question to "When you really like someone, you might…".
- **S4R:** softened the certainty claim — authenticity "gives the connection more accurate information to work with," no longer "makes fit easy to see."
- **S7:** reframed from deficit ("what do you tend to miss / not notice") to neutral observation ("What do you want to pay more attention to?" · "Interest can show up in different ways…"). "I already watch for these" preserved as an adaptive path.
- **S13:** removed the reset-vs-avoidance binary — now "Taking a break can mean different things. What matters here is knowing what you want the break to do for you." The three intentionality questions preserved; no classification of the user's break.

## Appendix B — Final copy QA (10-point)
| # | Check | Result |
|---|---|---|
| 1 | Unsupported prevalence claims | **PASS** — S3 line removed; all recognition copy is conditional/self-selected; no "people like you do X." |
| 2 | Unsupported psychological mechanisms | **PASS** — no "because you fear…", no attachment/why-you-feel-unchosen; the experience is named, never explained causally. |
| 3 | Certainty stronger than evidence | **PASS** — S4R softened; fit is framed as *"a real fit can happen"* / *"something real to notice,"* never guaranteed. |
| 4 | Deficit assumptions | **PASS** — S7 neutralized; no screen requires naming a flaw; recognition is opt-in with an "already doing this" path. |
| 5 | Covert advice as neutral reflection | **PASS** — S4 reflections describe *information value*, not "you should"; S10 reflection ends "only you can decide." |
| 6 | One DECIDE outcome implied healthier | **PASS** — six co-equal outcomes, no recommendation; "watch a little longer" reflection pushes neither staying nor leaving. |
| 7 | Arbitrary timelines | **PASS** — none; S9 "not by a date on the calendar"; S13 duration optional. |
| 8 | Scorekeeping / matched effort | **PASS** — S6 "not a scoreboard," "their part can look different from yours," pattern-level; no "match energy." |
| 9 | Reading-level drift | **PASS** — ~5th grade; a few necessary words ("accurate," "participating") are the ceiling, sentences stay short. |
| 10 | Accidental therapy/diagnostic framing | **PASS** — no clinical terms/diagnosis; S12 is a plain feeling-check (burnout is not diagnosed); worth protected. |

**Result: QA PASS on all 10 → status `APPROVED FOR IMPLEMENTATION — CLUSTER 1 PROTOTYPE`.**

## Appendix C — preserved by design (per approval)
PRESENT → OBSERVE → DECIDE · "Reciprocity is information — not a scoreboard" · pattern-level reciprocity ·
S10's *What I Need → What Is Happening → What's My Move* · all six co-equal DECIDE outcomes · "Watch a
little longer" as legitimate · the conditional reflection when evidence is already substantial · optional
Add to My Play · My Relationship Play as a behavioral reference (not a journal) · Recognize → Practice → Use.
