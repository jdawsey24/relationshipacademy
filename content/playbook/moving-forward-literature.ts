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

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
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
          "You're thinking about doing this again, and a set of questions has shown up that nobody had to answer the first time around.",
          "How much of it do I tell someone. When do I mention the divorce. Am I allowed to want this yet. And why does everyone get measured against someone I chose to leave.",
        ],
      },
      {
        kind: "distinction",
        label: "What's here and what isn't",
        body: [
          "Not how to do it differently. That has its own Playbook and it's better than anything we'd repeat here.",
          "The specific problems of having a history \u2014 what to say about it, whether you're allowed to move on, and what the last person is still doing to how you judge new ones.",
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
          "\u201cI don't know how much of my past to share.\u201d It comes up twice here, from both sides, which suggests it's the live one.",
          "There's no correct amount, and the advice out there splits into two unhelpful halves: be completely open, or don't burden them with it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different kinds of sharing that get confused",
        body: [
          "The fact. That you were married, that it ended, roughly when. That's context someone needs fairly early to understand your life.",
          "The account. What happened, whose fault, what it did to you. That's personal, and personal things get shared back and forth, not handed over.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most of the difficulty comes from treating those as one thing. The fact is small and can be said in a sentence. The account is large, and you don't have to give it on any timetable.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "A useful check: are you telling them because they need to know, or because you're bracing for them to find out? The second one tends to bring out the whole account early, and it's usually more than either of you wanted.",
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
          "Early, because it's a fact about your life that shapes a great deal \u2014 time, money, family, how free you are. Holding it back doesn't protect anyone, and it gets harder to bring up the longer it waits.",
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
          "How someone takes it is genuinely useful information. Some people get uncomfortable, some get curious in a way that's about them rather than you, and some take it as an ordinary fact about an adult's life. That last group is bigger than it feels from where you're standing.",
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
          "This surprises people, because there's often nobody obvious to feel guilty toward. The relationship ended — maybe you're the one who ended it — and the other person is alive and getting on with things.",
        ],
      },
      {
        kind: "distinction",
        label: "What it's usually about, and it's rarely the ex",
        body: [
          "Children, if there are any \u2014 not wanting to introduce something, or to be seen wanting something for yourself.",
          "The marriage as something you meant. Moving on can feel like admitting it wasn't what you said it was, which is a loss on top of the loss.",
          "Or a feeling that wanting anything again is greedy, since you've already had a turn.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of those respond to being told you're allowed. What they respond to, slowly, is being named \u2014 because guilt with no clear target is much harder to weigh than guilt with one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI want love, but I don't want more pain\u201d shows up twice here, and it isn't guilt \u2014 it's an honest look at the trade. There's no version of this that doesn't leave you open to being hurt, and anyone who says there is one is selling something.",
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
          "\u201cI compare everyone to my former partner.\u201d Almost everyone does it, and it's worth knowing what's really being compared.",
        ],
      },
      {
        kind: "distinction",
        label: "It isn't them against the new person",
        body: [
          "It's someone met three weeks ago against someone you knew for years \u2014 their humour, their references, the shorthand, the way they knew what you meant.",
          "That's not a fair comparison, and you can't fix it by trying to be fair. What you're missing is familiarity, and nobody new has any.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's a second version that's more useful to notice. Sometimes the comparison isn't flattering at all \u2014 you're scanning for likeness rather than who's better, checking whether this one will turn out the same way. That's a different thing, and it's worth telling them apart.",
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
          "Still taken up. A lot of your attention is still with the last relationship, and there isn't much to spare. Real, and it changes.",
          "Guarded. You have the attention, but you're holding it back, because opening up is how the last one hurt. Also real, and it responds to different things.",
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
          "Rarely the fact of it. Adults dating adults expect histories, and not having one raises more questions than having one.",
          "More often the handling \u2014 an account given too early and too complete, or an obvious dodging that makes it seem bigger than it is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Someone put off by the fact that you were married before has told you something quickly and cheaply, which is worth more than it costs.",
        ],
      },
    ],
  },
];
