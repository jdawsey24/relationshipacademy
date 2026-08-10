/**
 * Cluster 25 — "Feeling Like No One Taught Me How to Do This"
 * The Relationship Playbook™ · From the Ground Up
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Renewal (22) + Expansion (10). Task = Reengagement.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF.
 *
 * ⚠⚠ THE FAILURE MODE IS SELF-ADVERTISEMENT. This reader is describing this
 *   product — "I want tools, not just encouragement", "I want practical
 *   guidance, not clichés", "I want to become relationship literate". The
 *   obvious and worthless version of this Playbook congratulates them for
 *   wanting what it sells. Nothing here may reference the Playbook, the
 *   framework, or "the tools" as an answer. If a screen could be read as
 *   marketing, it is wrong.
 *
 * ⚠ TWENTY OF THIRTY-TWO STATEMENTS ARE REQUESTS OR ASPIRATIONS. PE-4 and PE-5
 *   are the reader asking for something and describing who they want to be.
 *   Neither is a difficulty. Both route to Recognition/Context.
 *
 * ⚠ "WHY DO I KEEP ENDING UP HERE" CANNOT BE ANSWERED. STM-1032 asks for an
 *   explanation. The honest position is that confident explanations exist and
 *   none are established enough to hand someone as fact. What IS available is
 *   the recurring move — same discipline as Cluster 5 and Cluster 27.
 *
 * ⚠ MIXED UNIT OF ANALYSIS. PE-1 is a couple; the rest is an individual. The
 *   Expansion block is only 10 statements, below the volume threshold, so it
 *   folds in — but the content must work for someone reading alone.
 *
 * ⚠ COMPETENCY MAPPING
 *   PE-1 → Repair Engagement · Adaptive Responding (Renewal)
 *   PE-2/PE-3 → Pattern Interruption (Renewal)
 *   PE-5 → Growth Maintenance (Renewal)
 *
 * ⚠ CLAIM SCOPE. May claim: separate love from skill; find the recurring move;
 *   turn an aspiration into one practice. MUST NOT CLAIM: that relationships
 *   can be learned from reading, that skill is sufficient, that we can explain
 *   why the reader keeps ending up somewhere, or anything about this product.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C25_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c25-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c25-love-and-skill", "lit-c25-nobody-taught"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've worked something out that most people don't. That relationships take skills. That nobody taught you those skills. And that goodwill alone hasn't been enough.",
          "That's an unusually clear picture of the problem. It's also, oddly, most of the way to the answer. So there's less to do here than a realisation this big might suggest.",
        ],
      },
      {
        kind: "distinction",
        label: "What can and can't follow from it",
        body: [
          "Knowing that something is a skill doesn't give you the skill. Reading about it doesn't either \u2014 that's a real limit of anything written, including this.",
          "What does seem to work is narrow. One thing, practised, in a real relationship, badly at first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to tell you that wanting tools is the right instinct and then hand you a list. That's the version of this that feels productive but isn't. Three things here. And most of this gets left alone on purpose.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-love-and-skill",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Love and skill are different things",
    related: ["lit-c25-what-this-is", "lit-c25-good-people"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe love each other, but we're still struggling.\u201d \u201cLove isn't fixing our problems.\u201d \u201cI thought love would be enough.\u201d",
          "This is the clearest thing here, and it's worth saying plainly. Love is not a skill, and it doesn't hold any.",
        ],
      },
      {
        kind: "distinction",
        label: "What each one actually does",
        body: [
          "Love gives the motivation. It's why you'd bother to repair something, and why it matters when it goes wrong.",
          "Skill gives the method. How to bring something up without it blowing up, how to hear a complaint without defending, how to repair afterwards.",
          "Having the first without the second gives you exactly what you're describing \u2014 two people who care a lot, trying hard, and getting nowhere.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is oddly good news. \u201cWe don't know how\u201d is a much better place to be than \u201cwe don't care enough.\u201d It's the one that responds to anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It also cuts the other way. Skill without motivation gives you people who know how but don't bother. If the love has gone, this isn't the problem you have.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-good-people",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cNeither of us is a bad person\u201d",
    related: ["lit-c25-love-and-skill", "lit-c25-habits"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Usually true. And usually not much comfort \u2014 because if no one's at fault, there's nothing obvious to change.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the character question is a dead end",
        body: [
          "\u201cAre they a bad person?\u201d has two answers and neither helps. Yes leaves you deciding whether to go. No leaves you back where you started.",
          "\u201cWhat do we do at the moment it goes wrong?\u201d has an answer with something in it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most relationship trouble between good people comes down to the procedure. It's not what either of you wants. It's what happens in the ninety seconds after something lands badly \u2014 and neither of you chose that procedure. You each brought one.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-habits",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Good intentions, poor habits",
    related: ["lit-c25-good-people", "lit-c25-the-move"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe have good intentions but poor habits.\u201d One of the most exact sentences anyone says in all this.",
        ],
      },
      {
        kind: "distinction",
        label: "Why intentions lose to habits reliably",
        body: [
          "Intentions are there when you're calm and thinking about the relationship \u2014 which is exactly when they aren't needed.",
          "Habits show up at the hard moment, which is when you aren't thinking about intentions at all.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the useful piece is small and clear enough to survive the moment you need it in. \u201cI want to communicate better\u201d isn't there mid-argument. \u201cI'll ask what they meant before I answer\u201d might be.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is also why learning about relationships in general does less than people expect. General understanding is there at the wrong time.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-nobody-taught",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cNobody taught me this\u201d",
    related: ["lit-c25-what-this-is", "lit-c25-unlearning"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI never learned how to have healthy relationships.\u201d \u201cI wish someone had taught me this years ago.\u201d",
          "Both true. Almost nobody is taught this. The people who seem to have been taught mostly picked it up by watching — which isn't teaching, and isn't available on request.",
        ],
      },
      {
        kind: "distinction",
        label: "Which changes what the gap actually is",
        body: [
          "Not an information gap. The information is widely available and most of it is fine.",
          "A practice gap. You watched a certain set of procedures for eighteen years, and those are what show up under pressure — no matter what you've read since.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That's a slower and less satisfying answer than a course. It's also why \u201cI want to learn how healthy relationships actually work\u201d can be fully met without much changing.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-unlearning",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Unlearning what you grew up with",
    related: ["lit-c25-nobody-taught", "lit-c25-the-move"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm trying to unlearn what I grew up with.\u201d This is the only thing here the reader describes themselves actually doing, and it's the hardest part.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Unlearning is a misleading word for it. Nothing gets removed. What happens, at best, is that a second option opens up alongside the first \u2014 and the first still comes first, for a long time.",
        ],
      },
      {
        kind: "distinction",
        label: "What progress looks like",
        body: [
          "Not: the old response stops appearing.",
          "But: noticing it appear, and having something else ready. First you notice afterwards, then during, then just before. That progress is slow enough to be easy to miss.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Which means a repeat isn't proof that nothing has changed. It's what you should expect, and the change is in what happens next.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-the-move",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWhy do I keep ending up here?\u201d",
    related: ["lit-c25-unlearning", "lit-c25-faq-attracting"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want someone to explain why I keep ending up here.\u201d It's a fair thing to ask, and we're going to turn it down — which needs a reason.",
        ],
      },
      {
        kind: "distinction",
        label: "Why we won't give you the explanation",
        body: [
          "Confident explanations exist \u2014 about your childhood, how you attach, what you're drawn to. Some may even be true for you.",
          "But none of them are solid enough to hand someone as fact. And a wrong explanation, held with confidence, is worse than no explanation. It reshapes how you see yourself around something that might not be true.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What you can have is smaller and more reliable: the recurring move. Not why you do it \u2014 what it is, and when it shows up.",
          "That's less satisfying than a reason. But it's the part you can actually act on \u2014 and \u201cwhy\u201d turns out not to be needed.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you want the why, that's a fair thing to want, and a therapist is the right place for it \u2014 with someone who knows your history and can be wrong out loud with you, rather than a text that has to guess.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c25-faq-attracting",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cWhy do I attract unhealthy relationships?\u201d",
    related: ["lit-c25-the-move"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Same answer as the last one, and same reason for it. We can't tell you, and the confident versions out there aren't reliable enough to be worth having.",
        ],
      },
      {
        kind: "distinction",
        label: "One way to look at it that leaves something to do",
        body: [
          "\u201cI attract unhealthy relationships\u201d is about magnetism. Nothing in it is something you can act on \u2014 you can't change what you give off.",
          "\u201cI stay past the point I've seen something\u201d or \u201cI give a lot before I know anything\u201d is the same pattern one level down, and both are things you can work with.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It may also be partly true that certain people are drawn to certain qualities. That's a fact about them, not a judgment on you, and it changes what you'd do about it.",
        ],
      },
    ],
  },

  {
    id: "lit-c25-faq-reading",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Can you actually learn this from reading?",
    related: ["lit-c25-habits", "lit-c25-nobody-taught"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Partly — and less than the amount of reading out there would suggest.",
        ],
      },
      {
        kind: "distinction",
        label: "What reading does and doesn't do",
        body: [
          "It's good at naming things. Having a word for what happens between you makes it easier to talk about, and that's real.",
          "It's poor at the moment itself. Nothing you've read is there ninety seconds into a hard conversation \u2014 only what you've practised is.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is an uncomfortable thing for anything written to admit. The honest version: read enough to name it, then practise one thing badly, over and over, and expect the reading to have been the easy part.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI want tools, not just encouragement\u201d is the right instinct. It's worth noticing that collecting tools can become its own way of not practising any.",
        ],
      },
    ],
  },
];
