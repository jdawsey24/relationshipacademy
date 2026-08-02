/**
 * Cluster 12 — "Difficulty Letting Go of What's Already Over" — VOLUME I
 * The Relationship Playbook™ · Letting Go
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * Track: RECOVERY (38 of 58 statements) — first Recovery cluster built.
 * Task = Healing. Core Need: TO HEAL.
 * Competencies from Recovery_and_Renewal_Competency_Manual_v0_1.
 *
 * ⚠ TWO VOLUMES. The canonical subtitle is "Letting Go and Moving Forward" and
 *   the cluster splits on exactly that line. Volume I is the letting go
 *   (Recovery, 38). Volume II is dating again afterwards (Renewal, 20) —
 *   authored separately. Readers in that position route out via
 *   `rec-c12-ready-to-date`.
 *
 * ⚠ SAFETY — ELEVATED. This is the most acutely distressed population in the
 *   corpus. "I can't move on", "I'm afraid I'll never heal", "I don't know who
 *   I am anymore" describe a state where post-loss depression is common. A
 *   signpost sits on the identity Play and the shared safety card is NOT
 *   applicable here — this is about the reader's own state, not another
 *   person's behaviour.
 *
 * ⚠ NO TIMELINE CLAIMS. Nothing here says how long grief takes, that it gets
 *   easier, or that the reader is behind. "I'm afraid I'll never heal" is
 *   validated as a reasonable fear, not corrected.
 *
 * ⚠ THE CHECKING IS NOT SHAMED. Looking at an ex's social media is close to
 *   universal after a breakup. The content addresses what it costs and what it
 *   cannot deliver, never whether the reader should be doing it.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   PE-1 → Constructive Disengagement · Emotional Regulation
 *   PE-2/PE-3 → Responsibility Differentiation · Self-Compassion
 *   PE-4 → Narrative Integration
 *   PE-6 → Identity Reconstruction · Life Reorganization
 *   PE-7 → Grief Integration · Uncertainty Navigation
 *
 * ⚠ CLAIM SCOPE. May claim: see what the checking costs; separate what was
 *   yours from what wasn't; hold an account of what happened that doesn't
 *   require rewriting it; notice what's still yours. MUST NOT CLAIM: that it
 *   gets easier, that you'll heal, that the relationship was or wasn't real,
 *   that the ex was at fault, or that letting go is achievable on any timeline.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C12_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c12-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c12-still-checking", "lit-c12-never-heal"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's over and you're still in it. Not by choice \u2014 you've probably tried hard not to be.",
          "The thinking doesn't stop. The checking doesn't help. And the question under most of it is some version of: why wasn't that enough, and what did I miss?",
        ],
      },
      {
        kind: "distinction",
        label: "Two things happening at once",
        body: [
          "Grief, which doesn't listen to reasoning, and isn't supposed to. It takes as long as it takes.",
          "A search \u2014 for an explanation, a moment you could have changed, a reason. That one feels useful, and mostly isn't. It's also the part with something to work on.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Nothing here will tell you how long this should take, or that it gets easier, or that you're behind. Those claims get made a lot, and none of them are ours to make.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If most things feel like this \u2014 not just the relationship \u2014 or if it's been affecting your sleep, your eating, or your ability to get through a day, that's worth taking to a GP. Not instead of this. Alongside it.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-still-checking",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The checking",
    related: ["lit-c12-replaying", "lit-c12-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI keep checking their social media.\u201d \u201cI wonder if they miss me.\u201d \u201cI still hope they'll come back.\u201d",
          "First: nearly everyone does this. It isn't weakness and it isn't a sign that something has gone wrong with your recovery.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's also doing something specific. Contact keeps the relationship in the present tense \u2014 even one-sided, even through a screen. Not as a mistake you're making, but automatically: something that's still being updated isn't over the way something finished is.",
        ],
      },
      {
        kind: "distinction",
        label: "What each check actually gives you",
        body: [
          "A few seconds of contact, which really does bring relief.",
          "New information to work through, which starts the thinking up again.",
          "And nothing settled, because nothing you could see would settle it. If they look happy, that hurts. If they look unhappy, that's hope, which hurts in a different way.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here tells you to just stop by force of will \u2014 that mostly gives you a few good days and then a worse slip back. What's worth knowing is how it works, so if you do stop, you know what you're buying.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-replaying",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The replaying",
    related: ["lit-c12-still-checking", "lit-c12-what-was-mine"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI replay every conversation.\u201d \u201cI keep replaying everything.\u201d \u201cI wish I could stop thinking about them.\u201d",
          "The replaying is a search. It's looking for the moment \u2014 the thing you said, the thing you missed, the point where it could have gone differently.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It feels like work because it is work. It's just work on a problem that doesn't have the answer it's looking for. Relationships rarely turn on a single moment. And even when one exists, finding it doesn't undo it.",
        ],
      },
      {
        kind: "distinction",
        label: "What it's actually trying to do",
        body: [
          "Make it make sense. If there's a reason, then the world is orderly and you could avoid it next time.",
          "That's a reasonable thing to want. It's also why the search doesn't end \u2014 no explanation is ever quite complete enough to give it to you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some of what you find will be true. \u201cI ignored what I already knew\u201d is often true, and it belongs in the account. The problem isn't that the search finds nothing \u2014 it's that it never finishes.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-what-was-mine",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What was actually yours",
    related: ["lit-c12-replaying", "lit-c12-regret"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWhy wasn't I enough?\u201d \u201cI keep blaming myself.\u201d",
          "The first one is a question with a false idea buried in it. Relationships don't end because someone wasn't enough \u2014 they end for reasons that mostly aren't about anyone's total worth.",
        ],
      },
      {
        kind: "distinction",
        label: "Three kinds, and most people squash them into one",
        body: [
          "Yours. Things you did or didn't do, that you could have chosen differently.",
          "Theirs. Their choices, their limits, their reasons \u2014 including ones you never got to see.",
          "Neither's. Timing, circumstance, a mismatch that nobody caused.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Taking all three is common, and it isn't humility. It's a way of keeping some control \u2014 if it was all yours, then it could have been stopped, and next time you could stop it.",
          "That's why pulling them apart can feel like a loss instead of a relief.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Pulling them apart isn't the same as taking none. There's usually something truly yours in the account, and finding it is useful \u2014 it's the only part you could do anything with.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-regret",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI knew better\u201d",
    related: ["lit-c12-what-was-mine", "lit-c12-faq-wasted"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI ignored what I already knew.\u201d \u201cI regret not trusting myself.\u201d \u201cI wish I had left sooner.\u201d \u201cI knew better.\u201d",
          "This is the sharpest kind of regret, because it isn't about not knowing. You're not sorry you didn't know \u2014 you're sorry you knew and stayed anyway.",
        ],
      },
      {
        kind: "distinction",
        label: "What \u201cknowing\u201d was actually like at the time",
        body: [
          "Looking back, it feels like a clear signal you pushed past.",
          "At the time it was almost certainly a quiet doubt, up against love, hope, all you'd already put in, and someone you cared about telling you it was fine.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's not an excuse, and it isn't meant to make the regret go away. It's a fix to the picture. You didn't ignore a blaring alarm. You weighed something unclear and got it wrong — which is a different, and much more forgivable, thing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI regret the person I became in that relationship\u201d is worth keeping separate from the rest. That's usually about who you were shaped into, rather than a choice you made, and it responds to different things.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-was-it-real",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWas any of it real?\u201d",
    related: ["lit-c12-replaying", "lit-c12-comparing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI question whether any of it was real.\u201d \u201cI don't know how to trust my memories.\u201d",
          "This tends to show up after the ending has changed how you see it all \u2014 once you know how it finished, the good parts start to look like proof of something you missed.",
        ],
      },
      {
        kind: "distinction",
        label: "An ending doesn't reach back and undo what happened",
        body: [
          "Something can be truly good and still end. Those two things don't fight each other, even though it feels like they do.",
          "And someone can have meant it at the time and stopped meaning it later. That's more common than being lied to, and it's harder to hold because it doesn't fit neatly anywhere.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The version of your memories that holds both \u2014 it was real, and it ended \u2014 is more accurate than either the rewritten one or the preserved one. It's also the hardest to hold, which is why people usually pick a side.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you were actively lied to, that's a different situation, and rewriting isn't twisting the truth \u2014 it's updating with information you didn't have. Being lied to and being left are not the same wound.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-comparing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Comparing everyone to them",
    related: ["lit-c12-was-it-real", "lit-c12-who-am-i"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI compare everyone to my ex.\u201d Almost everyone does, and it's worth knowing what's actually being compared.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Not them against a new person. It's a new person, met at week two, held up against someone you knew for years \u2014 their humour, the references you both knew, the shorthand, the version of yourself you were around them.",
          "It isn't a fair comparison, and you can't fix it by trying to be fair. What you're missing is familiarity, and nobody new has any.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI'm angry they moved on so quickly\u201d belongs near this. How fast someone moves on says very little about how deep the feeling was \u2014 people process at wildly different speeds, and some start long before the ending.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-who-am-i",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI don't know who I am anymore\u201d",
    related: ["lit-c12-comparing", "lit-c12-never-heal"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the parts that leaves you most lost, and one of the least talked about.",
          "A long relationship organises a lot: your week, your friendships, what you do on Sunday, what you talk about, who you're in the habit of being. When it ends, all of that loses its support at once.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different losses",
        body: [
          "The person. Grief, and it works the way grief works.",
          "The structure. This is a practical problem dressed up as a huge one \u2014 it feels like not knowing who you are, and a lot of it is not knowing what to do on a Tuesday.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Worth separating, because the second one responds to ordinary things. Not deep insight \u2014 plans. Something in the diary, someone to see, something that happens whether or not you feel like it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know how to start over\u201d is a reasonable thing not to know. Most people only do this a few times in a life, so there's no built-up skill at it.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c12-never-heal",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I never heal?",
    related: ["lit-c12-what-this-is", "lit-c12-who-am-i"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's a reasonable fear, and we're not going to talk you out of it, because that kind of comfort is usually hollow and you'd know it.",
        ],
      },
      {
        kind: "distinction",
        label: "What can honestly be said",
        body: [
          "Most people do find it changes, and the change is rarely the one they expected \u2014 not that it goes away, but that it takes up less of the day.",
          "Some people carry a version of it for good and still build good lives. Both of those are true at once.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI'm afraid I'll never feel that way again\u201d is a separate fear, and worth naming on its own. Sometimes people don't feel exactly that way again. They often feel other things, and some of them turn out to be better \u2014 though nobody can promise you that either.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If this has turned into a settled belief rather than a fear \u2014 or if you've had thoughts about not being here \u2014 please talk to someone today. A GP, a crisis line, or someone you trust. That's a different thing from grief, and it needs different help.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-faq-wasted",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Did I waste those years?",
    related: ["lit-c12-regret", "lit-c12-was-it-real"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's a common thought, and the answer is more complicated than either the harsh version or the comforting one.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things people mean by it",
        body: [
          "Time spent that gave you nothing. Rarely quite true \u2014 you lived those years, and things happened in them that weren't the relationship.",
          "Time spent on something that wasn't going to work, that you could have spent another way. Often true, and it's a real loss worth grieving rather than arguing with.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The comforting version \u2014 everything happens for a reason, you learned so much \u2014 is worth being wary of. Some of it really does teach you something, and some of it was just cost. Being told it was all a lesson tends to add a small pressure to be grateful, on top of everything else.",
        ],
      },
    ],
  },

  {
    id: "lit-c12-faq-forgive",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I forgive \u2014 them, or myself?",
    related: ["lit-c12-what-was-mine", "lit-c12-regret"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Nothing here will teach you to forgive. It isn't a technique and we don't think it can be produced on demand.",
        ],
      },
      {
        kind: "distinction",
        label: "What it seems to be, when it happens",
        body: [
          "Not deciding it was fine. Not forgetting \u2014 you won't.",
          "Closer to a decision to stop charging interest. The debt stays on the books. You just stop adding to it every day.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Forgiving yourself tends to be harder than forgiving them, partly because you have every detail of what you did and none of what they were thinking. The case against yourself is just better documented.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It also usually comes later than people want, and rarely as a decision. Most people notice afterwards that it happened, rather than doing it on purpose.",
        ],
      },
    ],
  },
];
