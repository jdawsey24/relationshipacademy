/**
 * Cluster 27 — "Fear of Being Used Again"
 * The Relationship Playbook™ · Letting Go of the Armor
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Exploration. Task = Discernment. Core Need: TO FEEL SECURE.
 *
 * ⚠ THE ARMOR IS NOT THE PROBLEM TO FIX FIRST. The subtitle names it, and it
 *   would be easy to write a Playbook that asks this reader to lower their
 *   guard. That would be asking them to be more available to the thing that
 *   hurt them. The guard came from somewhere and it works. What's examinable is
 *   what it costs and what it can't do.
 *
 * ⚠ CONTEXT-VALIDITY on PE-4. "Dating has become transactional" and "effort and
 *   integrity don't get rewarded" are appraisals of the environment and may be
 *   substantially accurate. Same treatment as Cluster 4's PE-1: validate the
 *   observation, never the universal.
 *
 * ⚠ BOUNDARY WITH CLUSTER 14. Cluster 14 is "I can't say no" — the moment of
 *   the yes. This is the belief underneath: that being wanted has to be earned.
 *   Related, and not the same tool.
 *
 * ⚠ CLAIM SCOPE. May claim: tell wanting-you from wanting-what-you-offer;
 *   notice what the giving is buying; see what the guard costs. MUST NOT CLAIM:
 *   that you'll be wanted for yourself, that lowering the guard is safe, that
 *   dating isn't transactional, or that people will stop taking.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C27_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c27-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c27-earning", "lit-c27-armor"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You give a lot. You're good at it, and people take it, and somewhere in there you started to suspect that the giving is the reason anybody stays.",
          "\u201cI wonder if anyone would still want me if I stopped giving so much\u201d is the sentence underneath the rest.",
        ],
      },
      {
        kind: "distinction",
        label: "Two beliefs that arrive together",
        body: [
          "That you have to earn being wanted. Which means the giving is never generosity \u2014 it's payment, and payments have to keep coming.",
          "That people mostly want what you provide. Which makes every good thing they do ambiguous, because it might be about the provision.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The guard follows from both. If being known means being assessed on what you're worth, keeping some of yourself back is sensible.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will ask you to drop the guard. That would be asking you to be more available to the thing that hurt you. What's worth looking at is what it costs and what it can't do \u2014 and that's a different request.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-earning",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Earning it",
    related: ["lit-c27-what-this-is", "lit-c27-if-i-stopped"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like I have to prove my value before anyone will choose me.\u201d \u201cI have to earn love instead of just receiving it.\u201d \u201cI'm afraid that if I stop achieving, no one will want me.\u201d",
          "These describe a specific arrangement: being wanted is a thing you buy, and the price is ongoing.",
        ],
      },
      {
        kind: "distinction",
        label: "Why that arrangement doesn't settle",
        body: [
          "A purchase can be lost. If you bought it, you can stop being able to afford it, so the effort can never come down.",
          "And it makes the evidence useless. Every sign that someone wants you is explained by what you've been providing, so it can't count.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's the trap worth seeing. It isn't that you're wrong about people \u2014 it's that the belief makes itself unfalsifiable. As long as you're paying, you can never find out whether you needed to.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't an argument for giving less as a strategy. Giving less in order to test someone is still the same arrangement, just running in reverse.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-wanting-you",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Wanting you, or wanting what you offer",
    related: ["lit-c27-earning", "lit-c27-transactional"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to tell if someone wants me or just wants what I offer.\u201d It's the practical question in this cluster and there's a partial answer.",
        ],
      },
      {
        kind: "list",
        label: "Signals that lean toward the person",
        items: [
          "They ask about things that have nothing to do with what you provide.",
          "They notice when you're depleted, without you announcing it.",
          "They offer something without a problem needing solving first.",
          "They're interested in your opinions, not only your capabilities.",
          "Something has been declined and they stayed.",
        ],
      },
      {
        kind: "list",
        label: "Signals that lean toward the provision",
        items: [
          "Warmth that arrives when something is needed.",
          "Appreciation phrased around what you did rather than who you are.",
          "Interest that thins when you're unavailable.",
          "Never asking anything about you that isn't practical.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That last signal on the first list is the strongest and the hardest to get. You can't observe how someone responds to being declined until you've declined something \u2014 which is why this question tends to stay open indefinitely.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-if-i-stopped",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWhat if I stopped giving so much?\u201d",
    related: ["lit-c27-earning", "lit-c27-wanting-you"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's a real question and it's frightening, because the answer might be nobody would stay.",
          "Which is worth saying plainly rather than reassuring around: sometimes people do leave. Not everyone who's been taking will stay when the taking stops.",
        ],
      },
      {
        kind: "distinction",
        label: "What that would actually tell you",
        body: [
          "Not that you're only worth what you provide. That would be the conclusion you're afraid of, and it doesn't follow.",
          "That those particular people were there for the provision. Which is information about them, and it's information you currently don't have.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The cost of not finding out is that you keep paying, indefinitely, to avoid an answer. And the payment is expensive \u2014 it's most of what \u201cI'm drained by relationships that only take\u201d is describing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says do it all at once, or with everyone. Small and specific is the only version of this that's manageable, and it's also the only version that produces usable information.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-emotional-work",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The work nobody counts",
    related: ["lit-c27-if-i-stopped", "lit-c27-armor"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI do more emotional work than I get back.\u201d \u201cI manage everyone else's feelings but my own.\u201d \u201cMy needs are treated as too much.\u201d",
          "The third one is the giveaway. Someone doing all the managing usually has needs that arrive as an inconvenience, because there's no established channel for them.",
        ],
      },
      {
        kind: "distinction",
        label: "How that becomes self-reinforcing",
        body: [
          "You manage their feelings, so your feelings never come up.",
          "Your feelings never coming up means everyone gets used to them not being there.",
          "So when one arrives it's disruptive \u2014 which confirms that they were too much, and you go back to managing.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cToo much\u201d is almost always a comparison against a baseline of nothing. It isn't a measure of your needs. It's a measure of how unaccustomed everyone is to hearing them.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-transactional",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cDating has become transactional\u201d",
    related: ["lit-c27-wanting-you", "lit-c27-faq-wrong-people"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like effort and integrity don't get rewarded in dating.\u201d",
          "There's a good deal of truth in this and we're not going to argue with it. Plenty of people are treating dating as a market, and effort genuinely does go unreciprocated a lot of the time.",
        ],
      },
      {
        kind: "distinction",
        label: "Where the accurate reading stops being useful",
        body: [
          "\u201cA lot of dating is transactional\u201d is an observation, and it's defensible.",
          "\u201cEffort and integrity don't get rewarded\u201d is a rule, and a rule tells you not to bother \u2014 which means you stop finding out about individuals.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The distinction matters practically. An accurate observation about the pool doesn't tell you about the person in front of you. If the rule is doing your reading for you, you'll be right about the average and wrong about anyone specific.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Keep the observation. It's earned. The only thing worth checking is whether it's arriving before you've seen anything.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-armor",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What the armor costs",
    related: ["lit-c27-what-this-is", "lit-c27-faq-lower-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI keep my guard up so I don't get taken advantage of again.\u201d",
          "It works. That's the first thing to say \u2014 it does reduce how often you get used, and it was built for a reason.",
        ],
      },
      {
        kind: "distinction",
        label: "And what it can't do",
        body: [
          "It doesn't distinguish. Armor is undirected \u2014 it holds off the people who'd take and the people who wouldn't, at the same rate.",
          "It also makes the evidence unavailable. You can't find out whether someone would have wanted you for yourself while they're being kept at the distance where they can't.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So it buys protection and it costs information. That's a real trade and it might be the right one for now. What's worth knowing is that it's a trade, rather than a free arrangement.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI feel replaceable\u201d and \u201cI feel used\u201d are describing something that happened. This isn't a suggestion that you were wrong to build it.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c27-faq-lower-it",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Do I have to lower my guard?",
    related: ["lit-c27-armor", "lit-c27-if-i-stopped"],
    body: [
      {
        kind: "paragraph",
        body: [
          "No. And we'd be wary of anyone telling you that you must \u2014 that's usually said by people who haven't had your experience.",
        ],
      },
      {
        kind: "distinction",
        label: "A more useful framing",
        body: [
          "Not: lower it. Aim it. Undirected armor holds off everyone equally; a specific check applied to a specific person does a different job.",
          "Not: trust more. Find out more. Those aren't the same, and the second is available without the first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the guard is currently the only thing making dating survivable, that's worth respecting. There's no version of this that requires you to be less protected than you can manage.",
        ],
      },
    ],
  },

  {
    id: "lit-c27-faq-wrong-people",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Am I just attracting the wrong people?",
    related: ["lit-c27-transactional", "lit-c27-if-i-stopped"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Possibly. We're not going to explain why, because the confident explanations available \u2014 about what you attract, what you're drawn to, what it says about you \u2014 aren't established enough to hand you as fact.",
        ],
      },
      {
        kind: "distinction",
        label: "One observation that is fairly safe",
        body: [
          "People who give a great deal, early and without conditions, are more visible to people looking for that than to people looking for a person.",
          "That's a fact about visibility rather than about you \u2014 and it's the version of this that leaves something to do.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI attract users\u201d puts the cause in you and leaves nothing actionable. \u201cI give a lot before I know anything\u201d is the same pattern one level down, and it's workable.",
        ],
      },
    ],
  },
];
