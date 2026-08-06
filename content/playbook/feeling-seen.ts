/**
 * Cluster 15 — "Feeling Like I'm Taken for Granted" — VOLUME I
 * The Relationship Playbook™ · Feeling Seen and Appreciated
 *
 * Track: Expansion (42 of 53 statements). Task = Integration.
 * Core Need: TO BUILD PARTNERSHIP.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ TWO VOLUMES — owner-ruled 29 Jul 2026. The 11 Exclusivity statements
 *   (STM-0532 to STM-0542) are early-stage chasing and belong to a different
 *   phase. They ROUTE OUT via `rec-c15-still-chasing`. Volume II deferred: the
 *   material overlaps substantially with Cluster 24 (unbuilt), and building
 *   both would produce two Playbooks saying much the same thing.
 *
 * ⚠ RESENTMENT IS THE TARGET, not appreciation. Owner-ruled. The canonical
 *   subtitle understates this; noted rather than changed.
 *
 * ⚠ SIGNPOST on STM-0605 "I don't want to keep living like this". Treated as a
 *   signpost because it reads ambiguously and the asymmetry of being wrong
 *   favours caution.
 *
 * ⚠ BOUNDARY WITH CLUSTER 10. Cluster 10 handles the invisible logistical load
 *   and how to make it visible. Nothing here duplicates that. These tools are
 *   about what the resentment has done — the ledger, who you've become, what
 *   forgiving would require.
 *
 * ⚠ CLAIM SCOPE. May claim: say one specific unacknowledged thing; look at what
 *   the ledger costs; notice what you've become; work out what forgiving would
 *   require. MUST NOT CLAIM: that they'll appreciate you, that the resentment
 *   lifts, that forgiveness is achievable, or that the relationship recovers.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C15_LITERATURE } from "./feeling-seen-literature";
import { CRISIS_ESCALATION } from "./shared/safety-not-safe";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const FEELING_SEEN: PlaybookContent = {
  playbookKey: "feeling-seen",
  playbookVersion: 1,
  displayName: "Feeling Seen and Appreciated",

  opening: {
    title: "It didn't start as resentment",
    body: [
      "It started as giving, gladly, and not being noticed. The rest came one step at a time. Each step made sense back then.",
      "The part worth working on isn't the appreciation. It's what years of going unnoticed has done to you. And the fact that you don't like who you've become is the best sign you haven't become it.",
      "Nothing here promises the resentment goes away.",
    ],
    manifestations: [
      "I feel taken for granted.",
      "I keep score.",
      "I don't like who I've become.",
      "I miss giving love freely.",
    ],
    cta: "Start with how it turned",
  },

  recognitionCards: [
    {
      id: "rec-c15-dont-like-who-ive-become",
      role: "validate",
      pathwayPlayId: null,
      headline: "I don't like who I've become.",
      validationCopy:
        "That's the most important sentence in this Playbook, and people usually say it in passing. Two things about it. Someone who had truly turned bitter wouldn't be bothered by it. The fact that you notice is the part of you that hasn't changed. And it names the real loss. You haven't only lost the appreciation. You've lost being someone who gave without keeping count, and you liked that person.",
      secondaryExamples: [
        "I feel bitter.",
        "Small things bother me now.",
        "I miss giving love freely.",
      ],
    },
    {
      id: "rec-c15-still-chasing",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm always the one texting first. I don't want to convince someone to choose me.",
      validationCopy:
        "This Playbook is for people years into a relationship where the giving stopped being noticed. What you're describing sounds earlier than that. You're chasing someone who isn't giving back, and deciding whether to keep going. That's a different situation with a different answer, and the tools here won't fit it. Look for the Playbook on knowing whether to keep putting in.",
      secondaryExamples: [
        "I feel like I'm chasing people.",
        "I don't know if I should keep trying or walk away.",
        "I want someone who's excited about me.",
      ],
    },
    {
      id: "rec-c15-unseen",
      role: "route",
      pathwayPlayId: "one-specific-thing",
      headline: "I don't think they see how much I'm trying.",
      explanation:
        "A ledger can only ever be shown as a case, and a case gets defended against. One specific thing can be heard.",
      secondaryExamples: [
        "I feel taken for granted.",
        "I don't think they realise how much I've done.",
        "I don't feel appreciated.",
      ],
    },
    {
      id: "rec-c15-keeping-score",
      role: "route",
      pathwayPlayId: "the-ledger",
      headline: "I keep score, and I'm not proud of it.",
      explanation:
        "The ledger is doing a job. It's the only place what you've given exists. It's worth looking at what it costs to keep, not at whether you should have it.",
      secondaryExamples: [
        "I remember everything they've done wrong.",
        "I resent everything I sacrificed.",
        "I don't feel like they've changed.",
      ],
    },
    {
      id: "rec-c15-stopped-giving",
      role: "route",
      pathwayPlayId: "what-i-stopped",
      headline: "I stopped trying, and I miss the person who didn't.",
      explanation:
        "Stopping made sense. It also took away the thing you liked about yourself, which is a high price for a sensible choice.",
      secondaryExamples: [
        "I don't feel emotionally generous anymore.",
        "I feel emotionally checked out.",
        "I don't have anything left to give.",
      ],
    },
    {
      id: "rec-c15-forgive",
      role: "route",
      pathwayPlayId: "what-forgiving-would-take",
      headline: "I don't know how to let go of this.",
      explanation:
        "Nothing here teaches forgiveness. What you can do is find out what it would really take. That's usually smaller and more specific than people think.",
      secondaryExamples: [
        "I don't know how to forgive.",
        "I don't know if the resentment is fixable.",
        "I don't know how to let my guard down again.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "one-specific-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "One Specific Thing",
      positioning:
        "For the years of it that can't be said all at once. You pick one thing on its own, then you say it.",
      recognitionGate: {
        prompt: "Have you tried telling them how much you do, and had it turn into an argument?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "When you finally say it, it all comes out at once, because that's what's piled up.",
            "And all of it at once is a case. A case gets defended against. They'll bring their own list, and now you're comparing instead of being heard.",
            "One thing can be heard. It's a much smaller ask and a much better chance.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cI do everything around here\u201d invites a comeback, and there's always a comeback ready.",
            "\u201cI booked the dentist, and the car, and your mum's present, and I don't think you knew\u201d is checkable. There's nothing to argue with, so there's a chance it lands.",
            "It also won't cover everything you've been carrying. That's the trade. You give up saying all of it to get heard.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "It isn't enough. It's a small piece of it, and picking one can feel like letting them off.",
            "That's real. It's also the difference between being heard about something and being argued with about everything.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Pick one",
          fields: [
            {
              id: "the-thing",
              input: "text",
              label: "One thing you did recently that went unnoticed. Just the facts.",
              placeholder: "Recent, specific, checkable. Not a pattern.",
            },
            {
              id: "why-this-one",
              input: "chips",
              label: "Why this one?",
              suggestions: [
                "It's recent enough to remember",
                "It's undeniable",
                "It's small — they can't call it dramatic",
                "It stung the most",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The one thing, said plainly",
          helper:
            "One specific recent thing, and what it was like. No lead-up, no comparing. You might start with \u201cThere's something small I want to mention.\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've picked the one thing and you're in an ordinary moment.",
          doThis:
            "Say it once, then stop. Don't add the second example \u2014 that turns it back into a case.",
        },
        {
          kind: "output",
          heading: "What I said",
          body: "One thing, heard or not. Not the whole account.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A case gets defended. One thing can be heard.",
            "Don't add the second one.",
            "Giving up saying all of it to get heard.",
          ],
        },
      ],
      portable: [
        "A case gets defended. One thing can be heard.",
        "Don't add the second one.",
        "Giving up saying all of it to get heard.",
      ],
      myPlaysTemplate: {
        when: "When I want to tell them how much I do and it always becomes an argument",
        move: "Say one specific recent thing, and stop",
        lookingFor: "Whether one thing can land where the whole account couldn't",
        watchOut: "Adding the second example — that turns it back into a case",
        remember: "One thing isn't enough. That's the trade for being heard at all.",
      },
      fidelity: {
        correct:
          "One specific, recent, checkable contribution is stated, without comparison or accumulation.",
        misuse: [
          "Adding further examples once you've started.",
          "Choosing something that can't be verified.",
          "Using it as an opening for the full account.",
        ],
        notMeaning:
          "It does not mean they'll acknowledge it, that acknowledgement would settle things, or that the rest of the account is invalid.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "the-ledger",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Ledger",
      positioning: "For the account you're running, and what it costs to keep.",
      recognitionGate: {
        prompt: "Do you know the numbers — who did what, and when?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "People are usually ashamed of keeping score. It's worth knowing what it's for before deciding anything about it.",
            "It's a record. When nobody else acknowledges what you've given, keeping the account yourself is the only place it exists. It's also protection. If you know the numbers, you can't be told you're imagining it.",
            "So it isn't petty. Nothing here will ask you to tear it up.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Everything that happens between you gets logged, which means you're never quite off duty.",
            "And small things land on top of a running total instead of on their own. That's why the cup left out feels huge. It isn't the cup, it's the cup plus four years.",
            "The bigger cost: while the account is running, nothing they do can count as generous. It gets logged as partial repayment. Which means even the good things stop counting.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is the ledger doing?",
          situation:
            "You did three things last week that nobody mentioned. One of them took an evening.",
          buckets: [
            { id: "record", label: "Keeping the record" },
            { id: "charging", label: "Charging interest" },
          ],
          items: [
            {
              id: "sort-c15-know-numbers",
              text: "Knowing roughly what you've each done",
              correctBucket: "record",
              correction: "That's just knowing. Fair enough, and not costing you much.",
            },
            {
              id: "sort-c15-cup",
              text: "The cup left out ruining the evening",
              correctBucket: "charging",
              correction: "That's four years landing on a cup. The interest, not the record.",
            },
            {
              id: "sort-c15-remembering",
              text: "Remembering the time they let you down badly",
              correctBucket: "record",
              correction: "Remembering something real isn't charging for it.",
            },
            {
              id: "sort-c15-discount",
              text: "Them doing something kind and it not counting",
              correctBucket: "charging",
              correction:
                "Logged as repayment instead of received. That's the expensive part.",
            },
            {
              id: "sort-c15-recount",
              text: "Running back through the list at 2am",
              correctBucket: "charging",
              correction: "The record doesn't need re-reading. That's upkeep.",
            },
            {
              id: "sort-c15-tell-friend",
              text: "Being able to explain the situation accurately to a friend",
              correctBucket: "record",
              correction: "Getting it right is fine. It's the piling up that costs.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "What the account is costing",
          fields: [
            {
              id: "when-it-runs",
              input: "chips",
              label: "When does the account run?",
              suggestions: [
                "Constantly",
                "Whenever they do something",
                "At night",
                "Whenever I'm doing something they should have",
              ],
            },
            {
              id: "last-generous",
              input: "text",
              label:
                "When did they last do something that landed as generous instead of as repayment?",
              placeholder: "If nothing comes to mind, that's the answer.",
            },
          ],
        },
        {
          kind: "output",
          heading: "What the ledger costs me",
          body: "Keeping the record is fine. Charging interest is the expensive part.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The ledger exists because nobody else kept the record.",
            "It isn't the cup. It's the cup plus four years.",
            "While the account runs, nothing they do can count.",
          ],
        },
      ],
      portable: [
        "The ledger exists because nobody else kept the record.",
        "It isn't the cup. It's the cup plus four years.",
        "While the account runs, nothing they do can count.",
      ],
      myPlaysTemplate: {
        when: "When I'm keeping score and it's costing me",
        move: "Separate keeping the record from charging interest on it",
        lookingFor: "Whether anything they do can still land as generous",
        watchOut: "Turning this into another reason to be ashamed of the ledger",
        remember: "The record is fair. The piling up is what's expensive.",
      },
      fidelity: {
        correct:
          "The function of the record is distinguished from the cost of maintaining it, without the record being dismissed.",
        misuse: [
          "Using it to conclude you're a petty person.",
          "Deciding to drop the ledger as an act of will.",
          "Using it to build a stronger case.",
        ],
        notMeaning:
          "It does not mean the resentment is unjustified, that you should let it go, or that seeing the cost reduces it.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "what-i-stopped",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What I Stopped",
      positioning: "For the version of you that gave freely.",
      recognitionGate: {
        prompt: "Do you miss who you were in this relationship?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Pouring into something that wasn't landing cost more than it gave back. Stopping brought relief, and that's why it held.",
            "It also took away the thing you liked about yourself, which is a very high price for a sensible choice.",
            "\u201cI miss giving love freely\u201d is the tell. You don't miss something you're glad to be rid of.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Pulled back to protect yourself: this can be undone, and it's what most people here have done. It aches.",
            "Finished: different, and it doesn't ache. People who are truly done don't miss the version of themselves who tried.",
            "If it aches, you're in the first one. That's more painful and it means something is still running.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Looking at what you stopped tends to bring up how long it's been, and what it cost, and whether it was worth it.",
            "You don't have to do anything with that. Noticing is the whole ask.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What went",
          fields: [
            {
              id: "what-i-stopped-doing",
              input: "text",
              label: "What did you stop doing?",
              placeholder: "Small things count. Especially small things.",
            },
            {
              id: "when",
              input: "text",
              label: "Roughly when?",
              placeholder: "A season, a year, after something in particular.",
            },
            {
              id: "does-it-ache",
              input: "chips",
              label: "Honestly — does it ache?",
              suggestions: [
                "Yes, and that's the painful part",
                "Some of it",
                "I don't know",
                "No — I think I'm done",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is there one thing you'd want back for your own sake, not as a plan?",
          enoughLabel: "Yes, there's something",
          needMoreLabel: "Not right now",
          needMoreIntro:
            "That's a real answer, not a failure. Wanting it back has to come from you, not from a plan.",
          needToKnowLabel: "What would have to change first",
          observableLabel: "Something I'd actually notice",
        },
        {
          kind: "output",
          heading: "What I stopped, and whether it aches",
          body: "Not a plan to start again. An honest position.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Stopping made sense. It also cost me something I liked.",
            "If it aches, I've pulled back, not finished.",
            "Giving so I'd be appreciated is how this started.",
          ],
        },
      ],
      portable: [
        "Stopping made sense. It also cost me something I liked.",
        "If it aches, I've pulled back, not finished.",
        "Giving so I'd be appreciated is how this started.",
      ],
      myPlaysTemplate: {
        when: "When I've stopped giving and I miss the person who didn't",
        move: "Name what I stopped and whether it still aches",
        lookingFor: "Whether this is pulling back to protect myself or being truly done — they're different",
        watchOut: "Deciding to start giving again as a plan",
        remember: "Wanting it back has to be for me, not for a result.",
      },
      fidelity: {
        correct:
          "What was discontinued is named, and the distinction between protective withdrawal and completion is honestly assessed.",
        misuse: [
          "Resuming giving as a tactic to produce appreciation.",
          "Using it as evidence of how much you've sacrificed.",
          "Concluding you're a cold person.",
        ],
        notMeaning:
          "It does not mean you should start again, that they'd notice if you did, or that the generosity returns.",
      },
      supportSignposts: [
        {
          id: "signpost-c15-numbness",
          heading: "If the flatness has spread",
          body:
            `If it isn't only this relationship — if most things feel flat, or you've stopped expecting anything to get better anywhere — it can help to talk to a GP or another professional, alongside this rather than instead of it. And if you've had thoughts of suicide, or of hurting yourself, please treat that as urgent.\n\n${CRISIS_ESCALATION}`,
        },
      ],
    },

    // ─────────────────────────────── Play 4 ──
    {
      playId: "what-forgiving-would-take",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Forgiving Would Take",
      positioning: "For working out what it would really take — not for making it happen.",
      recognitionGate: {
        prompt: "Do you want to let this go and find you can't?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "It isn't a technique, and we don't think it can be forced on demand. Anyone selling you a method is selling you something.",
            "What you can do is find out what it would take. That's usually smaller and more specific than what people mean by the word.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It isn't deciding it was fine. It wasn't. It isn't forgetting — you won't. It isn't a feeling you can make yourself have.",
            "More often it's a decision to stop charging interest. The debt stays on the books; you stop adding to it daily.",
            "That's much smaller than most people mean, and a lot more doable.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What would have to be true",
          fields: [
            {
              id: "the-thing",
              input: "text",
              label: "What is it you can't let go of?",
              placeholder: "One thing, if there's one. Or the shape of it.",
            },
            {
              id: "what-would-need",
              input: "chips",
              label: "What would have to happen first?",
              suggestions: [
                "They'd have to admit it",
                "It would have to stop",
                "They'd have to understand what it cost",
                "Nothing — I'd just have to decide",
                "I don't know",
              ],
            },
            {
              id: "has-it",
              input: "chips",
              label: "Has any of that happened?",
              suggestions: ["Yes", "Partly", "No", "It's been the opposite"],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is what you'd need something they could actually give?",
          enoughLabel: "Yes, in principle",
          needMoreLabel: "No — or not from them",
          needMoreIntro:
            "That's important, not hopeless. If what forgiveness needs isn't there, then not being able to forgive isn't a failing of yours. It's arithmetic.",
          needToKnowLabel: "What that means for what happens next",
          observableLabel: "Something I could actually decide",
        },
        {
          kind: "output",
          heading: "What forgiving would require",
          body: "Not forgiveness. A clear view of what it would cost and whether it's available.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not deciding it was fine. Deciding to stop charging interest.",
            "Forgiving something never admitted is a lot to ask.",
            "If what it takes isn't there, that's arithmetic, not failure.",
          ],
        },
      ],
      portable: [
        "Not deciding it was fine. Deciding to stop charging interest.",
        "Forgiving something never admitted is a lot to ask.",
        "If what it takes isn't there, that's arithmetic, not failure.",
      ],
      myPlaysTemplate: {
        when: "When I want to let go and find I can't",
        move: "Work out what forgiving would really take, and whether it's there",
        lookingFor: "Whether what's needed is something they could give",
        watchOut: "Treating not being able to forgive as a flaw in me",
        remember: "Resentment about something still going on can't settle while it's still going on.",
      },
      fidelity: {
        correct:
          "The condition forgiveness would require is named, and its availability honestly assessed.",
        misuse: [
          "Using it to justify staying resentful.",
          "Using it to pressure them into an apology.",
          "Deciding you've forgiven when you haven't.",
        ],
        notMeaning:
          "It does not mean you will forgive, that you should, or that naming the condition makes it available.",
      },
    },
  ],

  literature: C15_LITERATURE,

  missions: [
    {
      id: "mission-c15-one-thing",
      version: 1,
      playId: "one-specific-thing",
      title: "Say a second one, a fortnight later",
      instruction:
        "You said the first in the tool. Say another in two weeks — and notice whether the first changed anything.",
      linkToOperation: "Naming a single unacknowledged contribution",
      attemptMeaning: "You said it. Whether it was heard is separate.",
      suitability:
        "If the first turned into an argument about the whole account, that's worth noticing rather than repeating the same way.",
      progression: [
        { id: "rung-c15-one-thing-2", instruction: "Say one as it happens, rather than afterwards." },
      ],
    },
    {
      id: "mission-c15-ledger",
      version: 1,
      playId: "the-ledger",
      title: "Notice one thing landing as repayment",
      instruction:
        "Over a week, catch one moment where they did something and it got logged rather than received. Just notice it.",
      linkToOperation: "Observing the discounting of positive contribution",
      attemptMeaning:
        "You noticed. Not being able to receive it is expected, not a failing.",
      suitability:
        "If noticing turns into self-criticism, stop and read 'What the ledger is for'.",
      progression: [
        { id: "rung-c15-ledger-2", instruction: "Let one thing count, for one day, without logging it." },
      ],
    },
    {
      id: "mission-c15-stopped",
      version: 1,
      playId: "what-i-stopped",
      title: "Do one of them, for yourself",
      instruction:
        "If something aches, do it once — for your own sake, not to see what they do. Note how it felt rather than how they responded.",
      linkToOperation: "Resuming a discontinued act for one's own reasons",
      attemptMeaning:
        "You did it for you. Their response isn't the measure and isn't the point.",
      suitability:
        "Only if you want to. 'Not right now' is a legitimate answer and this mission is optional.",
      progression: [
        { id: "rung-c15-stopped-2", instruction: "Notice whether doing it changed anything in you, regardless of them." },
      ],
    },
    {
      id: "mission-c15-forgive",
      version: 1,
      playId: "what-forgiving-would-take",
      title: "Say the condition out loud",
      instruction:
        "Tell someone you trust what forgiving would require, and whether it's available. Not the person it's about.",
      linkToOperation: "Externalising the condition for repair",
      attemptMeaning:
        "You said it. Hearing yourself say it is the point.",
      suitability:
        "If the honest answer is that it isn't available from them, that's worth taking to someone who can sit with it.",
      progression: [
        { id: "rung-c15-forgive-2", instruction: "Say it to them, if the condition is something they could give." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c15-one-thing",
      version: 1,
      playId: "one-specific-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said one thing only",
          "Kept it specific and recent",
          "Stopped after one",
          "It became the whole account",
        ],
      },
      performedOperation: {
        label: "Did you say one specific thing, without accumulating?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That one thing can be heard",
          "That they genuinely hadn't noticed",
          "How much I've been holding",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I added the second one",
          "They produced their own list",
          "It landed and didn't help",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c15-ledger",
      version: 1,
      playId: "the-ledger",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated the record from the interest",
          "Noticed something being discounted",
          "Let one thing count",
          "Added to the account instead",
        ],
      },
      performedOperation: {
        label: "Did you separate keeping the record from charging interest?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That nothing they do can count right now",
          "How much of my attention it takes",
          "That the ledger is doing a job",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into shame about keeping score",
          "I couldn't let anything count",
          "Seeing the cost didn't reduce it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c15-stopped",
      version: 1,
      playId: "what-i-stopped",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what I stopped",
          "Answered honestly about whether it aches",
          "Did one of them for myself",
          "Decided not to, for now",
        ],
      },
      performedOperation: {
        label: "Did you name what you stopped and whether it still aches?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it aches, so something's still there",
          "That I might be done",
          "How much of myself went",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I did it and they didn't notice",
          "Looking at it made it worse",
          "I don't want to start again",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c15-forgive",
      version: 1,
      playId: "what-forgiving-would-take",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named the condition",
          "Assessed honestly whether it's available",
          "Said it out loud to someone",
          "Concluded I should just get over it",
        ],
      },
      performedOperation: {
        label: "Did you name what forgiving would require and whether it's available?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the condition isn't available",
          "That it might be, if I asked",
          "That it's smaller than I thought",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "What I need isn't available from them",
          "I couldn't name the condition",
          "Naming it made it feel worse",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
