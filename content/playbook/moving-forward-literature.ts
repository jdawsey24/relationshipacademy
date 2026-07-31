/**
 * Cluster 12 — "Difficulty Letting Go of What's Already Over" — VOLUME II
 * The Relationship Playbook™ · Moving Forward
 * Field Guide literature. 5 Core Guides + 2 Question Reads.
 *
 * Track: Renewal (20 of 58 statements). Task = Reengagement.
 * Core Need: TO MOVE FORWARD.
 *
 * ⚠ SCOPED DELIBERATELY. Of the 20 source statements, roughly 12 are distinct —
 *   two source blocks (Dating Again / Dating After Divorce) overlap heavily,
 *   and STM-0245 / STM-0634 are verbatim duplicates.
 *
 *   Of those 12, most of the "doing it differently" material is already covered:
 *     • "I don't want to repeat my past" / "make the same mistakes"
 *       → `opening-your-heart-again` (Cluster 13), Pattern Interruption
 *     • "I don't know what healthy looks like anymore"
 *       → `opening-your-heart-again`, Adaptive Responding
 *     • "I don't know how to trust my judgment"
 *       → `trusting-what-you-see` (Cluster 5)
 *   Those route out via `rec-c12b-differently`. Rebuilding them here would
 *   produce a fourth Playbook saying the same thing.
 *
 *   What is GENUINELY UNCOVERED and is what this Playbook is:
 *     • Disclosure — how much of the past to share, when to mention the divorce
 *     • Guilt about dating at all
 *     • Comparing everyone to the former partner
 *
 * ⚠ VOLUME I is `letting-go` (Recovery, 38). This assumes the letting go is at
 *   least underway. Readers still in it route back via `rec-c12b-still-in-it`.
 *
 * ⚠ NOT ABOUT BEREAVEMENT. The guilt here is about a person who is alive and
 *   from whom the reader separated. `addon-losing-a-partner` handles the other.
 *
 * ⚠ NO ASSUMPTION ABOUT WHO ENDED IT, whether there were children, or how long
 *   ago. No timeline claims about readiness.
 *
 * ⚠ CLAIM SCOPE. May claim: decide what to disclose and when; notice what the
 *   guilt assumes; see what the comparison is actually comparing. MUST NOT
 *   CLAIM: that you're ready, that disclosure will be received well, that the
 *   comparison stops, or that dating again is advisable.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C12B_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c12b-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c12b-disclosure", "lit-c12b-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You're considering doing this again, and a set of questions has arrived that nobody had to answer the first time round.",
          "How much of it do I tell someone. When do I mention the divorce. Am I allowed to want this yet. And why does everyone get measured against someone I chose to leave.",
        ],
      },
      {
        kind: "distinction",
        label: "What's here and what isn't",
        body: [
          "Not how to do it differently. That has its own Playbook and it's better than anything we'd repeat here.",
          "The specific problems of having a history \u2014 what to say about it, whether you're permitted to move, and what the previous person is still doing to your judgement of new ones.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says you should be dating, or that you're ready. Reading about it and doing it are different, and there's no schedule anyone can hold you to.",
        ],
      },
    ],
  },

  {
    id: "lit-c12b-disclosure",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "How much to say, and when",
    related: ["lit-c12b-what-this-is", "lit-c12b-the-divorce"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how much of my past to share.\u201d Said twice in this material, from both directions, which suggests it's the live one.",
          "There's no correct amount, and the advice available splits into two unhelpful halves: be completely open, or don't burden them with it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different disclosures that get confused",
        body: [
          "The fact. That you were married, that it ended, roughly when. That's context someone needs fairly early to understand your life.",
          "The account. What happened, whose fault, what it did to you. That's an intimacy, and intimacies are exchanged rather than delivered.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most of the difficulty comes from treating those as one thing. The fact is small and can be said in a sentence. The account is large, and there's no obligation to produce it on any timetable.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "A useful check: are you telling them because they need to know, or because you're bracing for them to find out? The second one tends to produce the full account early, and it's usually more than either of you wanted.",
        ],
      },
    ],
  },

  {
    id: "lit-c12b-the-divorce",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cWhen do I talk about my divorce?\u201d",
    related: ["lit-c12b-disclosure", "lit-c12b-faq-baggage"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Earlier than feels comfortable, and less than feels honest. Those pull in opposite directions and both are right.",
        ],
      },
      {
        kind: "distinction",
        label: "Why early, and why brief",
        body: [
          "Early, because it's a fact about your life that shapes a great deal \u2014 time, money, family, availability. Withholding it doesn't protect anyone and it gets harder to raise the longer it waits.",
          "Brief, because the detail isn't information they can use yet, and it changes what the conversation is about.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "One sentence, offered rather than confessed, is usually the right size. \u201cI was married \u2014 it ended a couple of years ago\u201d does the work without handing over the account.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "How someone receives it is genuinely useful information. Some people become uncomfortable, some become curious in a way that's about them rather than you, and some take it as an ordinary fact about an adult's life. That last group is larger than it feels from where you're standing.",
        ],
      },
    ],
  },

  {
    id: "lit-c12b-guilt",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI feel guilty dating again\u201d",
    related: ["lit-c12b-what-this-is", "lit-c12b-comparing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This surprises people, because there's often nobody obvious to be guilty toward. The relationship ended, possibly at your instigation, and the other person is alive and getting on with things.",
        ],
      },
      {
        kind: "distinction",
        label: "What it's usually about, and it's rarely the ex",
        body: [
          "Children, if there are any \u2014 not wanting to introduce something, or to be seen wanting something for yourself.",
          "The marriage as a thing you meant. Moving on can feel like conceding it wasn't what you said it was, which is a loss on top of the loss.",
          "Or a sense that wanting anything again is greedy, having already had a go.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of those respond to being told you're allowed. What they respond to, slowly, is being named \u2014 because guilt with no identified object is much harder to weigh than guilt with one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI want love, but I don't want more pain\u201d is the same sentence twice in this material, and it isn't guilt \u2014 it's an accurate statement of the trade. There isn't a version without exposure, and anyone offering one is selling something.",
        ],
      },
    ],
  },

  {
    id: "lit-c12b-comparing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Comparing everyone to them",
    related: ["lit-c12b-guilt", "lit-c12b-faq-available"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI compare everyone to my former partner.\u201d Nearly universal, and worth knowing what's actually being compared.",
        ],
      },
      {
        kind: "distinction",
        label: "It isn't them against the new person",
        body: [
          "It's someone met three weeks ago against someone you knew for years \u2014 their humour, their references, the shorthand, the way they knew what you meant.",
          "That's not a fair comparison and it isn't fixable by trying to be fair. Familiarity is what's being missed, and nobody new has any.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's a second version that's more useful to notice. Sometimes the comparison isn't favourable at all \u2014 you're scanning for resemblance rather than superiority, checking whether this one will turn out the same way. That's a different activity and it's worth telling them apart.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Neither version means you shouldn't be dating. The first fades with time and familiarity. The second is worth watching, because it can make an ordinary person look like evidence.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c12b-faq-available",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cAm I emotionally available?\u201d",
    related: ["lit-c12b-comparing", "lit-c12b-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's a better question than \u201cam I ready\u201d, because it has something checkable in it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that get called unavailable",
        body: [
          "Still occupied. A lot of your attention is with the previous relationship, and there isn't much spare. Real, and it changes.",
          "Guarded. You have the attention and you're not extending it, because extending it is how the last one hurt. Also real, and it responds to different things.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The first one improves largely on its own. The second doesn't, and it's the one people mistake for taking longer to heal.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Being partly unavailable isn't a reason not to see anyone. It's a reason to say so \u2014 most people can work with \u201cI'm not fully in this yet\u201d, and almost nobody can work with being told it's fine when it isn't.",
        ],
      },
    ],
  },

  {
    id: "lit-c12b-faq-baggage",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Will my history put people off?",
    related: ["lit-c12b-the-divorce", "lit-c12b-disclosure"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some people, yes. Fewer than you're expecting, and mostly not the ones you'd want.",
        ],
      },
      {
        kind: "distinction",
        label: "What actually puts people off, when it does",
        body: [
          "Rarely the fact of it. Adults dating adults expect histories, and the absence of one raises more questions than its presence.",
          "More often the handling \u2014 an account delivered too early and too complete, or an obvious avoidance that makes it seem larger than it is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Someone put off by the existence of a previous marriage has told you something quickly and cheaply, which is worth more than it costs.",
        ],
      },
    ],
  },
];
