/**
 * Cluster 11 — "Difficulty Accepting This Relationship Is Ending"
 * The Relationship Playbook™ · Accepting What Is
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * Track: Expiration. Task = Acceptance. Core Need: TO FIND CLARITY.
 *
 * ⚠⚠ THE DEFINING CONSTRAINT. STM-1003 is "I wish someone would decide for
 *   me." That is the cluster in one line, and it is exactly what this Playbook
 *   must refuse to do. Nothing here may push toward staying or toward leaving.
 *   Not in the copy, not in the framing, not in which option is listed first.
 *
 * ⚠ HOPE IS NOT THE ENEMY. "I don't want to give up too soon" is as legitimate
 *   as "I don't want to stay too long". Content that treats hope as denial
 *   would be taking a side.
 *
 * ⚠ PARTIAL COMPETENCY FIT — noted honestly. The Expiration set is built for
 *   Acceptance (Detachment, Disengagement, Role Release). This reader has not
 *   reached acceptance because they have not decided. TRU-EXPR-003 Self-Trust
 *   and TRU-EXPR-004 Agency fit; the release competencies largely do not.
 *
 * ⚠ CLAIM SCOPE. May claim: separate the answerable questions from the
 *   unanswerable; tell evidence-based hope from waiting; work out what you'd
 *   need to see. MUST NOT CLAIM: that the relationship can or cannot be saved,
 *   that you'll know, that the ambivalence resolves, or anything that
 *   constitutes advice to stay or go.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C11_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c11-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c11-wont-decide", "lit-c11-hope-or-denial"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Should I stay or leave. Can this be saved. Is love enough. Have we outgrown each other. I don't know when enough is enough.",
          "You've been carrying these for a while, and they don't resolve by being carried — which you've probably discovered.",
        ],
      },
      {
        kind: "distinction",
        label: "Two kinds of question in that list",
        body: [
          "Ones nobody can answer, including you, in advance. Can this be saved. Is love enough. Whether you'd regret it.",
          "Ones that are answerable, mostly by looking rather than thinking. What's actually changed in the last year. What you'd need to see. Whether anything you're hoping for has ever happened before.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second kind won't tell you what to do. They will tell you what you're actually deciding between, which is more than you have now.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here leans toward staying or toward leaving. If you finish something in this Playbook and feel it pushed you, tell someone \u2014 that would be a failure of ours, not a signal about your relationship.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-wont-decide",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "We're not going to decide for you",
    related: ["lit-c11-what-this-is", "lit-c11-not-knowing-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the things people say in this position is: I wish someone would decide for me.",
          "That's an entirely reasonable wish. The deciding is the worst part, and handing it to someone else would be an enormous relief.",
        ],
      },
      {
        kind: "distinction",
        label: "Why nobody should take it",
        body: [
          "Anyone who does is guessing. They have a fraction of the information and none of the consequences.",
          "And a decision made because someone told you tends not to hold. You'll relitigate it, and now with the added complication that it wasn't yours.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The friends who tell you to leave and the ones who tell you to stay are both usually describing what they'd do, or what they wish they'd done. That's worth knowing when you weigh their certainty.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Wanting to be relieved of the decision isn't weakness. It's what carrying an unresolvable question for months does. But nobody can lift it, and the ones who offer to are usually the least well placed.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-hope-or-denial",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Hope, or denial?",
    related: ["lit-c11-potential", "lit-c11-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know when hope becomes denial.\u201d It's the sharpest question in this cluster and it does have a partial answer.",
        ],
      },
      {
        kind: "distinction",
        label: "The difference isn't how much you hope",
        body: [
          "Hope with evidence points at something that has actually happened. They did change that thing. It has been better since March. There was a stretch where this worked.",
          "Hope without evidence points at something that hasn't. They could change. If they understood, they would. It was like this once, years ago.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both feel identical from inside \u2014 that's why the question is hard. The test isn't the strength of the feeling. It's whether you can name a thing that happened.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't an argument against hope. \u201cI don't want to give up too soon\u201d is as legitimate as \u201cI don't want to stay too long\u201d, and people who leave too early regret it as often as people who stay too late. The point is only to know which kind you're holding.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-potential",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Falling in love with potential",
    related: ["lit-c11-hope-or-denial", "lit-c11-tried-everything"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI keep falling in love with potential.\u201d \u201cI remember who they used to be more than who they are now.\u201d",
          "Both describe the same thing: being in a relationship with a version of someone that isn't currently in the room.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The past version is the harder one, because it isn't imaginary. They really were like that. So it doesn't feel like fantasy \u2014 it feels like knowing who they truly are underneath.",
          "Which may be true, and is also not something you can be in a relationship with.",
        ],
      },
      {
        kind: "distinction",
        label: "A question worth sitting with",
        body: [
          "If they stayed exactly as they are now \u2014 no worse, and no better \u2014 for another five years, what's your answer?",
          "Most people find they know immediately. It's an uncomfortable question and it does more work than months of weighing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's not a trick question with a right answer. Some people answer \u201cyes, actually\u201d and mean it. That's real information too.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-tried-everything",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWe've tried everything\u201d",
    related: ["lit-c11-potential", "lit-c11-faq-fixable"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Usually said with exhaustion rather than exaggeration. And usually not quite accurate \u2014 not because people haven't tried, but because of what \u201ceverything\u201d has meant.",
        ],
      },
      {
        kind: "list",
        label: "What \u201ceverything\u201d often turns out to be",
        items: [
          "The same conversation, many times.",
          "One person trying hard while the other agreed things would change.",
          "Long stretches of avoiding it, punctuated by a crisis.",
          "Two or three sessions with someone, years ago.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of that is failure. It's what most people do, and it's genuinely tiring. But it's a different fact from \u201cnothing could work\u201d, and the difference matters if you're using it to decide.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It also cuts the other way. If you've both genuinely tried \u2014 sustained, both of you, with help \u2014 then \u201cwe've tried everything\u201d is accurate and worth believing rather than arguing with.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-not-knowing-what-you-want",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Not knowing what you want",
    related: ["lit-c11-wont-decide", "lit-c11-faq-feelings"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cPart of me wants a relationship and part of me doesn't.\u201d \u201cI keep changing my mind.\u201d \u201cI don't trust my feelings because they change.\u201d",
          "Worth saying plainly: changing your mind about something this large isn't a malfunction. It's what a genuinely close call looks like from the inside.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different situations that feel the same",
        body: [
          "Genuinely torn \u2014 both options have real weight, and the oscillation reflects that. Common, and it doesn't resolve by thinking harder.",
          "Knowing and not wanting to know \u2014 there's an answer you keep arriving at and moving away from. Also common, and it feels like being torn.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "One quiet test: when you imagine it being over, is the first feeling dread or relief? Not the second feeling \u2014 the second one is usually the sensible one arriving. The first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That test isn't decisive and shouldn't be treated as one. It's one piece of information among several, and people's first feelings are sometimes about fear of change rather than about the relationship.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-distance",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When the distance is the pressure",
    related: ["lit-c11-tried-everything", "lit-c11-faq-fixable"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if long distance is worth it.\u201d \u201cI don't know if we're building a future or delaying the inevitable.\u201d",
          "Distance adds a particular difficulty: it's genuinely hard, so it becomes available as the explanation for everything.",
        ],
      },
      {
        kind: "distinction",
        label: "The question worth separating",
        body: [
          "Is the distance the problem? If it ended tomorrow, would this be good?",
          "Or is the distance holding something together that wouldn't survive being in the same city? Some relationships work partly because the gaps prevent the friction.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both are common and neither is shameful. But they lead to opposite conclusions, and the distance makes them very hard to tell apart \u2014 which is why \u201cI don't know how long I can do this\u201d can persist for years.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI'm tired of saying goodbye\u201d is worth taking at face value. Exhaustion from distance is real, and it isn't the same as not wanting the person.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-checked-out",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When you've already gone quiet",
    related: ["lit-c11-not-knowing-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm emotionally checked out.\u201d \u201cI don't recognise us anymore.\u201d \u201cI don't know if I'm happy anymore.\u201d",
        ],
      },
      {
        kind: "distinction",
        label: "Two readings, and it matters which",
        body: [
          "You've decided without announcing it. Sometimes checking out is the decision, arrived at quietly and not yet said out loud.",
          "You've protected yourself from something painful that's still going on. That's reversible, and it isn't a verdict.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The distinguishing question is whether it aches. People who are genuinely finished don't feel flat about it \u2014 they feel free. If there's an ache, something is still running.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the flatness has spread past the relationship \u2014 if most things feel this way, or you've stopped expecting anything to improve anywhere \u2014 that's worth mentioning to a GP or a therapist. It's a separate thing from this decision and it makes the decision much harder to make well.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c11-faq-fixable",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Can this be fixed?",
    related: ["lit-c11-tried-everything", "lit-c11-hope-or-denial"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We can't tell you, and anyone who can from the outside is guessing.",
        ],
      },
      {
        kind: "distinction",
        label: "What tends to matter more than the problem itself",
        body: [
          "Whether both people want it fixed. One person working alone can change a great deal and cannot change this.",
          "Whether anything has ever changed before. Not \u201ccould it\u201d \u2014 has it, actually, at any point.",
          "Whether either of you can still be reached. Contempt and indifference are harder signs than conflict.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cIs love enough\u201d is a question with a fairly consistent answer, and it's no \u2014 not on its own. That isn't a verdict on your relationship. It's why the other three questions above are the ones worth asking.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-faq-feelings",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Why do I keep changing my mind?",
    related: ["lit-c11-not-knowing-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Because it's close, most likely. Decisions that are obvious don't oscillate.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also a mechanical explanation. When you're near them and things are good, staying looks right. When you're apart and remembering the hard parts, leaving does. Neither reading is dishonest \u2014 you're sampling different evidence at different moments.",
          "Which is why \u201cI don't trust my feelings because they change\u201d is understandable and slightly unfair to yourself. The feelings are responding accurately to what's in front of them.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It also means the moment you decide matters. A decision made in the worst week, or the best one, is a decision made on a sample.",
        ],
      },
    ],
  },

  {
    id: "lit-c11-faq-regret",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I make the wrong decision?",
    related: ["lit-c11-wont-decide", "lit-c11-hope-or-denial"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You might. That's the honest answer, and pretending otherwise would be no help to you.",
        ],
      },
      {
        kind: "distinction",
        label: "What the fear obscures",
        body: [
          "Not deciding is also a decision, and it's the one you're currently making. It costs time in exactly the way you're trying to avoid.",
          "There's no risk-free option. Staying carries risk, leaving carries risk, and waiting carries the risk of both plus the waiting.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What seems to reduce regret isn't getting it right \u2014 nobody can guarantee that. It's having decided on something you can point at, rather than having drifted. People who drift tend to regret the drifting more than the outcome.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Deciding to stay for another six months and look again is a decision. Deciding to keep not-deciding is not the same thing, though they can look alike from outside.",
        ],
      },
    ],
  },
];
