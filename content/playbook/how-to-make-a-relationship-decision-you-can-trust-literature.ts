/**
 * Cluster 23 — "Fear of Making the Wrong Choice"
 * The Relationship Playbook™ · Making Confident Relationship Decisions
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Exclusivity (10) + Recovery (11). Core Need: TO TRUST MYSELF.
 *
 * ⚠ THE CLUSTER IS TWO HALVES THAT BELONG TOGETHER. Perfectionism about the
 *   next decision, and shame about the last one. They are the same mechanism
 *   running in both directions: the shame of having got it wrong is what makes
 *   getting it right next time feel compulsory. STM-0190 ("I'm afraid I'm too
 *   damaged") sits exactly between them.
 *
 * ⚠ TEN STATEMENTS ROUTED OUT. The Expectations block ("I thought chemistry was
 *   enough", "I didn't realize love required so much intentionality") is
 *   substantially identical to Cluster 25's central argument. It routes to
 *   `what-nobody-taught-you-about-healthy-relationships` via `rec-c23-expectations` rather than being rebuilt.
 *
 * ⚠ SUBTITLE UNDERSELLS IT. "Making Confident Relationship Decisions" fits the
 *   perfectionism half and says nothing about the shame half, which is the
 *   larger and heavier one. Canonical, so not changed — flagged.
 *
 * ⚠ THE SHAME IS NOT ARGUED WITH. "I feel like I failed" is not corrected by
 *   being told it isn't true. What's workable is what the hiding costs, and
 *   Support-Seeking Communication as the specific competency.
 *
 * ⚠ COMPETENCY MAPPING
 *   PE-1 → Self-Compassion (Recovery)
 *   PE-2 → Uncertainty Navigation (Recovery) · Self-Trust (Recovery)
 *   PE-3/4/5 → Support-Seeking Communication (Recovery) · Self-Compassion
 *
 * ⚠ CLAIM SCOPE. May claim: notice what the standard costs; act without the
 *   certainty; tell one person one true thing. MUST NOT CLAIM: that you won't
 *   choose wrong again, that the shame is unwarranted, that telling someone
 *   helps, or that readiness arrives.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const C23_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c23-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c23-getting-it-right", "lit-c23-the-shame"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Two things that look separate and aren't. You feel the next decision has to be right. And you carry a quiet shame about the last one.",
        ],
      },
      {
        kind: "distinction",
        label: "They're the same thing, pointed in two directions",
        body: [
          "Looking back: I got it wrong, and that says something about me.",
          "Looking ahead: so this one has to be right, and I can't move until I'm sure.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's why working on only the forward half doesn't hold. Being told to take a chance doesn't help much while getting it wrong still means what it means to you now.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI'm afraid I'm too damaged\u201d sits between the two. It's a fear, not a fact about you, and it's the most common thing people in this spot don't say out loud.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-getting-it-right",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI have to get this right\u201d",
    related: ["lit-c23-what-this-is", "lit-c23-good-enough"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like I have to get relationships right.\u201d \u201cI expect too much from myself.\u201d \u201cI don't want to make another mistake.\u201d",
          "The standard is unusually high, and you usually apply it to just one area. Most people here are far easier on themselves at work.",
        ],
      },
      {
        kind: "distinction",
        label: "Why relationships get the strictest standard",
        body: [
          "The cost of getting it wrong is genuinely high \u2014 years, sometimes.",
          "And the mistake feels like a verdict, not just an outcome. A bad decision at work is just a bad decision. A bad relationship decision gets read as a fact about your judgement, and then about you.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That second one is where the demand comes from. If getting it wrong means something about who you are, then getting it right isn't optional \u2014 it's a defence.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI expect too much from other people\u201d belongs here too, and it's usually the same standard turned outward. People who hold themselves to an impossible line rarely hold others to a gentle one.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-good-enough",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWhen is good good enough?\u201d",
    related: ["lit-c23-getting-it-right", "lit-c23-waiting"],
    body: [
      {
        kind: "paragraph",
        body: [
          "A real question, and it has no outside answer. There's no set line, and nobody can give you one.",
        ],
      },
      {
        kind: "distinction",
        label: "What it usually means when it's being asked",
        body: [
          "Sometimes: is this relationship good enough? You can only answer that against your own terms — and only if you've named them.",
          "More often: am I allowed to stop picking it apart? That's a different question, and it isn't about the relationship at all.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second version doesn't get solved by more information, which is why the picking-apart doesn't end. No amount of looking gives you permission.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "To be honest, some things genuinely aren't good enough, and the scrutiny is sometimes right. The question that sorts it out: has more looking ever changed the answer?",
        ],
      },
    ],
  },

  {
    id: "lit-c23-waiting",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Waiting until you're ready",
    related: ["lit-c23-good-enough", "lit-c23-faq-wrong-again"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI keep waiting until I'm ready.\u201d \u201cI don't know if I'll ever feel ready.\u201d \u201cI keep trying to find certainty before I move forward.\u201d",
          "The second sentence answers the first. If you don't know whether it'll ever come, then waiting for it isn't a plan \u2014 it's a wait with no end that feels like one.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things readiness could mean",
        body: [
          "Practically ready: your circumstances allow it. You can check that, and sometimes the answer is genuinely no.",
          "Feeling ready: the doubt is gone. That one doesn't come from waiting, because doubt about something uncertain is an accurate response, not an obstacle.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the certainty you're looking for isn't there to be had. And not having it doesn't tell you whether to go ahead. That's an unsatisfying thing to hear, and it's the honest version.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Not deciding is also a decision. It costs the same time as deciding wrongly \u2014 with less information at the end.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-the-shame",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The shame of what happened",
    related: ["lit-c23-what-this-is", "lit-c23-hiding"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm embarrassed by my relationship history.\u201d \u201cI feel ashamed that I ignored the signs.\u201d \u201cI feel like I failed.\u201d",
          "We're not going to tell you these are untrue. Being argued out of shame doesn't work, and it usually adds a second layer — feeling unreasonable on top of it.",
        ],
      },
      {
        kind: "distinction",
        label: "One thing worth separating",
        body: [
          "Regret: I wish I'd done that differently. It points at an action, and there's something in it.",
          "Shame: what happened says something about what I am. It points at you, and there's nothing in it to act on.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people here have both, tangled together. The regret is often accurate and useful. The shame is the part that makes it unspeakable \u2014 and unspeakable is where most of the cost sits.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI feel ashamed that I ignored the signs\u201d is worth one correction \u2014 not because the shame is unreasonable, but because the picture usually is. Looking back, it looks like a clear signal you overrode. At the time it was almost certainly a quiet doubt, up against love, hope, and someone telling you it was fine.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-hiding",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What the hiding costs",
    related: ["lit-c23-the-shame", "lit-c23-telling-someone"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI pretend everything is okay.\u201d \u201cI don't want people to pity me.\u201d \u201cI don't like asking for help.\u201d \u201cI'm tired of carrying this alone.\u201d",
          "That last one is the tell. Nobody says it about a load they're happy to carry.",
        ],
      },
      {
        kind: "distinction",
        label: "What hiding buys and what it costs",
        body: [
          "Buys: no one's pity, no one's opinion, no one's version of what you should have done. Those are real and worth something.",
          "Costs: everyone around you is going on the pretend version, so nothing they offer can be aimed at what's really happening.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It also builds up. The longer the pretend version has been running, the bigger the correction feels — and the more it seems like something you'd have to announce, not just mention.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't want to admit how unhappy I am\u201d is sometimes protecting a decision you haven't made. Saying it out loud makes it real, and real means something might have to happen.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-telling-someone",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Telling one person",
    related: ["lit-c23-hiding", "lit-c23-faq-pity"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The version of this that works is smaller than people think. Not telling everyone. Not a full account. Not an announcement.",
          "One person. One true thing. Nothing else attached.",
        ],
      },
      {
        kind: "distinction",
        label: "Who to pick matters more than what you say",
        body: [
          "Someone who won't jump to telling you what to do. Advice is what most people reach for, and it's rarely what's needed.",
          "Someone who won't pass it on. The fear of it getting around is often the real obstacle — more than the telling itself.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't like asking for help\u201d is worth noticing as separate from not wanting help. Most people here would take help if it were offered, but can't ask for it themselves \u2014 which is one specific difficulty, not a general independence.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here promises it helps. Sometimes people respond badly — and that's information about them, not proof you were right to stay quiet. It's worth choosing carefully, rather than testing the idea on the hardest case.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c23-faq-wrong-again",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I choose wrong again?",
    related: ["lit-c23-waiting", "lit-c23-getting-it-right"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You might. There's no method that removes that, and anyone offering one is selling something.",
        ],
      },
      {
        kind: "distinction",
        label: "What the fear is actually protecting against",
        body: [
          "Not the wrong choice, exactly. The meaning of it \u2014 that choosing wrong twice would prove something the first time only suggested.",
          "That's why the stakes feel so much higher than the decision calls for.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The honest position: a second poor choice would hurt, and it would not be a verdict. Plenty of people who choose badly twice choose well after that, and the second one often teaches you more than the first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There's also no risk-free option. Waiting has a cost, choosing has a cost, and the cost of waiting is the one you're paying right now.",
        ],
      },
    ],
  },

  {
    id: "lit-c23-faq-pity",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if they pity me?",
    related: ["lit-c23-hiding", "lit-c23-telling-someone"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some people will, and it's genuinely unpleasant. Worth saying plainly, rather than talking around it.",
        ],
      },
      {
        kind: "distinction",
        label: "What pity usually is",
        body: [
          "Mostly discomfort. People who don't know what to say come out with something that lands as pity, and it's about their awkwardness, not their view of you.",
          "It also tends to be brief. Pity is hard to keep up; most people go back to treating you normally within a conversation or two.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Choosing well matters more here than anything you could say. One person who handles it well is worth more than a careful script given to someone who won't.",
        ],
      },
    ],
  },
];
