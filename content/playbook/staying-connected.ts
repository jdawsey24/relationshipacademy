/**
 * Cluster 18 — "Feeling Like Money and Work Are Pulling Us Apart"
 * The Relationship Playbook™ · Staying Connected Through Life's Pressures
 *
 * Track: Expansion. Task = Integration. Core Need: TO BUILD PARTNERSHIP.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ SAFETY CARD INCLUDED (shared). Financial control is a recognised form of
 *   abuse and is named in the shared card. "I don't trust how they handle
 *   money" fits a reckless partner AND fits someone being controlled.
 *
 * ⚠ ZERO Tier 1. All 20 statements are Relational Condition, Thought/Belief,
 *   Experience or Fear. Everything routes Tier 3.
 *
 * ⚠ NO FINANCIAL ADVICE. Nothing here tells anyone how to budget, split bills,
 *   invest, or manage debt. The tools work on the conversation and the
 *   compatibility question only.
 *
 * ⚠ TWO HALVES. Money (10 statements) and work/ambition (10). Related but not
 *   the same problem; treated as two halves of one Playbook.
 *
 * ⚠ CLAIM SCOPE. May claim: have the conversation you've been avoiding; work
 *   out what the disagreement is actually about; name what you need to keep.
 *   MUST NOT CLAIM: financial compatibility, that they'll change how they
 *   handle money, that careers stop competing, or that the future resolves.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { SAFETY_RECOGNITION_CARD } from "./shared/safety-not-safe";
import { C18_LITERATURE } from "./staying-connected-literature";

export const STAYING_CONNECTED: PlaybookContent = {
  playbookKey: "staying-connected",
  playbookVersion: 1,
  displayName: "Staying Connected Through Life's Pressures",

  opening: {
    title: "It looks like two problems",
    body: [
      "Money, and the fact that work keeps winning. Underneath they're the same question, and it's a bigger one: are we building the same thing?",
      "Which is why the spreadsheet and the date night don't fix it. Good ideas, wrong layer.",
      "Nothing here tells you how to budget. That's a different kind of help and worth getting separately.",
    ],
    manifestations: [
      "We argue about money.",
      "We avoid talking about finances.",
      "I feel like work always comes first.",
      "I don't know if our dreams still align.",
    ],
    cta: "Start with the real question",
  },

  recognitionCards: [
    SAFETY_RECOGNITION_CARD,
    {
      id: "rec-c18-money-tension",
      role: "route",
      pathwayPlayId: "the-money-conversation",
      headline: "Money is a constant source of tension.",
      explanation:
        "Money arguments are rarely about the amount. They're about what you each think it's for, and what safety looks like to you.",
      secondaryExamples: [
        "We argue about money.",
        "We avoid talking about finances.",
        "Financial stress is hurting our relationship.",
      ],
    },
    {
      id: "rec-c18-same-thing",
      role: "route",
      pathwayPlayId: "are-we-building-the-same-thing",
      headline: "I don't know if we want the same future.",
      explanation:
        "The real question underneath both the money and the work. Worth asking directly rather than inferring it over years.",
      secondaryExamples: [
        "I don't know if we're financially compatible.",
        "I don't know if our dreams still align.",
        "One of us is growing while the other feels stuck.",
      ],
    },
    {
      id: "rec-c18-work-first",
      role: "route",
      pathwayPlayId: "season-or-arrangement",
      headline: "Work always comes first.",
      explanation:
        "Work has deadlines and consequences. The relationship has neither, so it loses — not because it matters less.",
      secondaryExamples: [
        "We never have time together.",
        "Our careers are pulling us in different directions.",
        "I don't know how to support them without losing myself.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "the-money-conversation",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Money Conversation",
      positioning:
        "For the subject you both avoid. This one needs them — the conversation is the tool.",
      recognitionGate: {
        prompt: "Do you avoid talking about money until something goes wrong?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "That's the uncomfortable part. Saving harder is sensible. Spending on a life you're actually living is also sensible. Neither of you is failing to see something obvious.",
            "Which changes what you're trying to do. Not convince them — that's what's been happening and it doesn't work, because they aren't being irrational.",
          ],
        },
        {
          kind: "learn",
          body: [
            "For some people a savings figure is the difference between fine and not fine, and spending it feels like risk. For others money is only useful spent, and saving feels like a life deferred.",
            "Add fairness, status, and whatever you each grew up with, and \u201cdifferent financial priorities\u201d turns out to be shorthand for something neither of you has said out loud.",
            "This is why a spreadsheet doesn't settle it. A spreadsheet settles the numbers. The argument was never about the numbers.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What it means to you",
          fields: [
            {
              id: "what-money-means",
              input: "chips",
              label: "When you think about money, what's the feeling underneath?",
              suggestions: [
                "Safety — I need a buffer",
                "Freedom — it's for living on",
                "Fairness — who contributes what",
                "Dread — I'd rather not look",
                "Something from how I grew up",
              ],
            },
            {
              id: "what-theirs-means",
              input: "text",
              label: "What do you think it means to them? And have they ever said?",
              placeholder: "Your best guess, and whether it's a guess.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "When to have it",
          conditionLabel: "When I'll raise it",
          thenLabel: "And how I'll open it",
          actions: [
            "When nothing has gone wrong",
            "As a scheduled, boring, low-stakes conversation",
            "Not straight after a bill or a purchase",
            "This week, before something forces it",
          ],
          controlCheck:
            "I'll start with what it means, not what it costs. I'll ask what it means to them and actually listen. I'm not trying to win it.",
        },
        {
          kind: "realWorldUse",
          useWhen: "Nothing has gone wrong and neither of you is busy.",
          doThis:
            "Have the conversation about what money means to each of you. Don't decide anything in the same conversation \u2014 getting both meanings said is the whole outcome.",
        },
        {
          kind: "output",
          heading: "What each of us said it means",
          body: "Two meanings, known rather than assumed. Decisions come later.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "We're probably both right. That's the problem.",
            "Start with what it means, not what it costs.",
            "A spreadsheet settles numbers. This was never about numbers.",
          ],
        },
      ],
      portable: [
        "We're probably both right. That's the problem.",
        "Start with what it means, not what it costs.",
        "A spreadsheet settles numbers. This was never about numbers.",
      ],
      myPlaysTemplate: {
        when: "When money is tense and we only discuss it reactively",
        move: "Have a scheduled conversation about what money means to each of us",
        lookingFor: "What it stands for on their side — safety, freedom, fairness",
        watchOut: "Trying to win it, or deciding something in the same conversation",
        remember: "They're not being irrational. They're weighting something differently.",
      },
      fidelity: {
        correct:
          "A non-reactive conversation is held in which both meanings are stated, with no decision attached.",
        misuse: [
          "Using it to argue for your position.",
          "Raising it after a purchase or a bill.",
          "Attaching a decision to the same conversation.",
        ],
        notMeaning:
          "It does not mean you'll agree, that spending changes, or that you're financially compatible.",
      },
      supportSignposts: [
        {
          id: "signpost-c18-financial-control",
          heading: "If money is being controlled rather than disagreed about",
          body:
            "If you don't have access to money, or you have to account for what you spend, or financial decisions are made and then told to you — that isn't a compatibility disagreement and this tool doesn't apply. Financial control is a recognised form of abuse. Please read 'If you don't feel safe', and consider talking to a domestic abuse service or a GP. You don't have to be certain to ask.",
        },
      ],
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "are-we-building-the-same-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Are We Building the Same Thing?",
      positioning:
        "For the question underneath all of it. You answer it alone first — then you ask them.",
      recognitionGate: {
        prompt: "Do you wonder whether you still want the same future?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Money and careers look like separate problems. Both are versions of the same one: are we building the same thing?",
            "Most couples have never asked it directly. They inferred an answer years ago and have been operating on the inference since.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Assuming you agree because you agreed once. People change, and the version you agreed on may be a decade old.",
            "Assuming you disagree because of one visible difference. Different spending habits don't necessarily mean different destinations.",
            "Both are inferences. Only asking produces an answer.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your answer first",
          fields: [
            {
              id: "my-picture",
              input: "text",
              label: "In five years, what does the life you want look like?",
              placeholder: "Concrete. Where, how, what a normal week contains.",
            },
            {
              id: "what-i-keep",
              input: "text",
              label: "What's non-negotiable in that? What can't you give up?",
              placeholder: "One or two things. The load-bearing ones.",
            },
            {
              id: "do-they-know",
              input: "chips",
              label: "Does your partner know that answer?",
              suggestions: [
                "Yes, we've talked about it",
                "Roughly — it's been mentioned",
                "No, not really",
                "I'm not sure I knew it until now",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll open it",
          helper:
            "Say yours first \u2014 it makes theirs easier to say. You might start with \u201cCan I tell you what I think I want, and then hear yours?\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've written your own picture of the next five years.",
          doThis:
            "Say yours first, then ask theirs. Listen without correcting it \u2014 you're collecting an answer, not negotiating one.",
        },
        {
          kind: "output",
          heading: "Both pictures",
          body: "Two answers, said out loud. Whether they match is now knowable.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "We inferred an answer years ago and never checked.",
            "Say mine first. It makes theirs easier to say.",
            "Different habits don't necessarily mean different destinations.",
          ],
        },
      ],
      portable: [
        "We inferred an answer years ago and never checked.",
        "Say mine first. It makes theirs easier to say.",
        "Different habits don't necessarily mean different destinations.",
      ],
      myPlaysTemplate: {
        when: "When I don't know whether we still want the same future",
        move: "Answer it myself, say it first, then ask theirs",
        lookingFor: "Whether the pictures overlap — and where exactly they don't",
        watchOut: "Turning it into an ultimatum, or correcting their answer",
        remember: "The version we agreed on may be a decade old.",
      },
      fidelity: {
        correct:
          "The reader's own picture is stated first, and the other person's is asked for and heard without correction.",
        misuse: [
          "Framing it as a decision point or an ultimatum.",
          "Correcting or negotiating their answer in the moment.",
          "Asking theirs without offering your own.",
        ],
        notMeaning:
          "It does not mean the pictures match, that a mismatch is fatal, or that anything is settled by asking.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "season-or-arrangement",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Season, or Arrangement?",
      positioning:
        "For when work keeps winning. You work out which one it is — then you name it.",
      recognitionGate: {
        prompt: "Has \u201cthings are busy right now\u201d been true for a long time?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Work has other people waiting and consequences for not showing up. The relationship has neither, so it loses — not because it matters less, but because nothing forces it.",
            "That's structural rather than personal, which is oddly reassuring and also means it won't resolve by itself.",
          ],
        },
        {
          kind: "learn",
          body: [
            "A season: something is genuinely demanding now, and it ends. Survivable — if it's named as temporary and actually is.",
            "An arrangement: this is simply how it is, and nobody decided it. Waiting doesn't fix that one.",
            "Most people describe theirs as a season for several years running.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Which is yours?",
          fields: [
            {
              id: "how-long",
              input: "text",
              label: "How long has it been busy?",
              placeholder: "Honestly. Count from when it actually started.",
            },
            {
              id: "when-ends",
              input: "chips",
              label: "Is there a date it ends?",
              suggestions: [
                "Yes, a real one",
                "Roughly, sometime this year",
                "It keeps moving",
                "No, this is just how it is now",
              ],
            },
            {
              id: "what-im-losing",
              input: "text",
              label: "What are you losing while this goes on?",
              placeholder: "Be specific. Time, ambition, a version of your life.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Does the other person know the answer you just gave?",
          enoughLabel: "Yes, we've discussed it",
          needMoreLabel: "No — they'd probably say it's a season",
          needMoreIntro:
            "That gap is the thing. Two people can be living in the same house with different beliefs about whether this is temporary.",
          needToKnowLabel: "What I'd want them to know",
          observableLabel: "Something specific I could say",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've worked out whether it's a season or an arrangement.",
          doThis:
            "Say which one you think it is, and what you're losing while it continues. Not a demand that they change anything.",
        },
        {
          kind: "output",
          heading: "What I named",
          body: "Season or arrangement, said out loud. Different problems, different answers.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Work has deadlines. We don't. That's why we lose.",
            "A season has an end date. Has anyone said it out loud?",
            "Name what I'm losing, not what they should do.",
          ],
        },
      ],
      portable: [
        "Work has deadlines. We don't. That's why we lose.",
        "A season has an end date. Has anyone said it out loud?",
        "Name what I'm losing, not what they should do.",
      ],
      myPlaysTemplate: {
        when: "When \u201cbusy right now\u201d has been true for years",
        move: "Work out whether it's a season or an arrangement, and say which",
        lookingFor: "Whether there's a real end date, and whether they'd say the same",
        watchOut: "Turning it into a demand rather than a statement of where I am",
        remember: "Somebody slowing down because they concluded they had to arrives as resentment later.",
      },
      fidelity: {
        correct:
          "The situation is classified honestly as season or arrangement, and the reader's own position and losses are stated.",
        misuse: [
          "Using it as a demand that they cut back.",
          "Calling it a season when the end date keeps moving.",
          "Naming what they're losing rather than what you are.",
        ],
        notMeaning:
          "It does not mean they'll slow down, that the season ends, or that naming it changes the schedule.",
      },
    },
  ],

  literature: C18_LITERATURE,

  missions: [
    {
      id: "mission-c18-money",
      version: 1,
      playId: "the-money-conversation",
      title: "Book the next one",
      instruction:
        "You had the first in the tool. Put a second in the diary — dull, scheduled, nothing gone wrong. That regularity is the point.",
      linkToOperation: "Non-reactive financial conversation",
      attemptMeaning:
        "You had it. Agreeing wasn't the objective.",
      suitability:
        "If money is controlled rather than disagreed about, this isn't the tool. Read the signpost on that Play.",
      progression: [
        { id: "rung-c18-money-2", instruction: "Decide one thing together, in a separate conversation from the meanings one." },
      ],
    },
    {
      id: "mission-c18-future",
      version: 1,
      playId: "are-we-building-the-same-thing",
      title: "Ask again in a month",
      instruction:
        "You asked in the tool. Ask again a month on — answers shift once people have had time to think.",
      linkToOperation: "Stating and eliciting future intent",
      attemptMeaning:
        "Both pictures are now known rather than assumed. A mismatch is information.",
      suitability:
        "If the answers were far apart, that's worth taking to someone rather than solving over a weekend.",
      progression: [
        { id: "rung-c18-future-2", instruction: "Name one thing you'd each have to give up for the other's version." },
      ],
    },
    {
      id: "mission-c18-season",
      version: 1,
      playId: "season-or-arrangement",
      title: "Hold the date, or admit there isn't one",
      instruction:
        "If you named an end date, check on it when it arrives. If it moves again, that's your answer about which one this is.",
      linkToOperation: "Distinguishing temporary demand from settled arrangement",
      attemptMeaning:
        "You checked honestly. Finding out it's an arrangement is a real outcome.",
      suitability:
        "If it's an arrangement and neither of you wants to change it, that's a legitimate position — worth saying rather than resenting.",
      progression: [
        { id: "rung-c18-season-2", instruction: "Ask them directly whether they'd call it a season or an arrangement." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c18-money",
      version: 1,
      playId: "the-money-conversation",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Raised it when nothing had gone wrong",
          "Started with what it means, not what it costs",
          "Asked what it means to them",
          "Ended up arguing about a purchase",
        ],
      },
      performedOperation: {
        label: "Did you have a non-reactive conversation about what money means?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What it stands for on their side",
          "That we're both being sensible",
          "That it's not really about the money",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into an argument",
          "They wouldn't engage with it",
          "I tried to win it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c18-future",
      version: 1,
      playId: "are-we-building-the-same-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said mine first",
          "Asked theirs and listened",
          "Didn't correct their answer",
          "Made it feel like an ultimatum",
        ],
      },
      performedOperation: {
        label: "Did you state yours and hear theirs without correcting it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That we mostly want the same thing",
          "Exactly where they diverge",
          "That I didn't know my own answer",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The answers were further apart than I expected",
          "They didn't have an answer",
          "It became a negotiation",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c18-season",
      version: 1,
      playId: "season-or-arrangement",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Counted honestly how long it's been",
          "Named which one it is",
          "Said what I'm losing",
          "Called it a season again",
        ],
      },
      performedOperation: {
        label: "Did you classify it honestly and state your own position?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's an arrangement, not a season",
          "That there's a real end date",
          "That they'd say something different",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The end date moved again",
          "Naming it changed nothing",
          "They heard it as a demand",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
