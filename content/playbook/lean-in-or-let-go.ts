/**
 * Cluster 24 — "Difficulty Knowing Whether to Invest" — VOLUME I
 * The Relationship Playbook™ · Deciding Whether to Lean In or Let Go
 *
 * Track: Exploration (24 of 32 statements). Task = Discernment.
 * Core Need: TO FIND CLARITY.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ MOSTLY QUESTIONS. Unique in the corpus. The reader is not stuck in a
 *   pattern — they are stuck in a decision, and waiting for certainty that is
 *   not coming.
 *
 * ⚠ THE OPERATION IS A SWAP. Unanswerable questions traded for answerable
 *   ones. "How long should I wait" becomes "what would I need to see, and by
 *   when". No tool supplies an answer, because the answers do not exist.
 *
 * ⚠ NO PRESCRIPTIONS. No timeframes, no number of dates, no rule about when to
 *   define a relationship. Those are exactly what the reader wants and exactly
 *   what cannot honestly be given.
 *
 * ⚠ TWO VOLUMES (Cluster 15 precedent). The 8 Exclusivity statements are POST-
 *   commitment doubt — a different problem. Routed out via
 *   `rec-c24-already-committed`. Volume II deferred.
 *
 * ⚠ INBOUND ROUTE from Cluster 15's `rec-c15-still-chasing`.
 *
 * ⚠ CLAIM SCOPE. May claim: replace an unanswerable question with an answerable
 *   one; ask directly; name your own terms; decide on evidence rather than
 *   certainty. MUST NOT CLAIM: that the uncertainty resolves, that you will
 *   know, that any timeframe is right, or that a correct choice is identifiable
 *   in advance.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C24_LITERATURE } from "./lean-in-or-let-go-literature";

export const LEAN_IN_OR_LET_GO: PlaybookContent = {
  playbookKey: "lean-in-or-let-go", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Deciding Whether to Lean In or Let Go",

  opening: {
    title: "Most of your questions don't have answers",
    body: [
      "How long should I wait. Am I settling. Is there someone better. Is love supposed to feel different. None of those have answers, and waiting for them is where the time goes.",
      "You're not stuck in a pattern — you can see this perfectly well. You're stuck in a decision, waiting for a certainty that isn't coming.",
      "What this does is trade the questions that can't be answered for ones that can. Smaller offer, honest one.",
    ],
    manifestations: [
      "Where is this going?",
      "How long should I wait?",
      "I don't know when to walk away.",
      "I'm afraid I'll choose the wrong person.",
    ],
    cta: "Start with what has no answer",
  },

  recognitionCards: [
    {
      id: "rec-c24-waiting-to-know",
      role: "validate",
      pathwayPlayId: null,
      headline: "I feel like I should just know by now.",
      validationCopy:
        "Some people do report knowing. Plenty who report it turn out to have been wrong, and plenty who were uncertain for a year turn out fine. The feeling of certainty isn't a reliable signal about the relationship — it's a signal about the person having it. Waiting to know may be waiting for something that isn't coming, and isn't diagnostic even when it does.",
      secondaryExamples: [
        "I keep second-guessing relationships.",
        "I'm afraid I'll choose the wrong person.",
      ],
    },
    {
      id: "rec-c24-already-committed",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I already said yes, and now I'm not sure.",
      validationCopy:
        "This Playbook is for deciding whether to commit. What you're describing is different — you committed, and the doubt arrived afterwards. That's a real thing and a common one, and it needs different handling: the question isn't 'should I' but 'can this hold up, and do I still want it'. This Playbook won't fit it. Look for one about the point where it becomes real.",
      secondaryExamples: [
        "Now that it's real, I don't know if I still want it.",
        "Everything felt easier before we called it something.",
        "I don't know if I'm ready for what it actually asks of me.",
      ],
    },
    {
      id: "rec-c24-what-are-we",
      role: "route",
      pathwayPlayId: "just-ask-what-this-is",
      headline: "I don't know what we actually are.",
      explanation:
        "This one is answerable. Uncomfortable, and answerable — which puts it in a small and useful category.",
      secondaryExamples: [
        "Are we dating or just hanging out?",
        "Should I ask what we are?",
        "How do I know if they're serious?",
      ],
    },
    {
      id: "rec-c24-how-long",
      role: "route",
      pathwayPlayId: "what-would-i-need-to-see",
      headline: "I don't know how long to give this.",
      explanation:
        "There's no correct number of weeks. But 'what would I need to see, and by when' is answerable by you, today.",
      secondaryExamples: [
        "How long should I wait?",
        "I don't want to waste my time.",
        "I don't know when to walk away.",
      ],
    },
    {
      id: "rec-c24-settling",
      role: "route",
      pathwayPlayId: "my-actual-terms",
      headline: "I don't know if I'm settling.",
      explanation:
        "There's no standard to be settling against. Only your own terms — and most people have never written them down.",
      secondaryExamples: [
        "I don't know if this is enough.",
        "I wonder if there's someone better.",
        "I don't know if I'm asking for too much.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "just-ask-what-this-is",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Just Ask What This Is",
      positioning:
        "For the question you've been not asking. You build it alone — then you ask, because asking is the only thing that produces an answer.",
      recognitionGate: {
        prompt: "Have you been wondering what you are to each other without asking?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Most of what's on your mind has no answer. This one does, and the answer is held by someone you speak to regularly.",
            "The case against asking is that it seems needy, or it'll scare them off, or you should be able to tell. All three assume the question costs you something.",
            "What it costs is finding out. If a direct question about what you're doing together puts someone off, that's information rather than a mistake.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cWhere is this going?\u201d asks them to guess what you want to know. It reliably produces a vague answer, which you then analyse for weeks.",
            "\u201cAre we seeing other people?\u201d or \u201cAre you looking for something serious?\u201d can be answered yes or no.",
            "The narrower it is, the harder it is to answer with warmth alone.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these can be answered?",
          situation:
            "You've been seeing each other for two months. It's good. Nobody has said what it is.",
          buckets: [
            { id: "answerable", label: "Answerable" },
            { id: "vague", label: "Invites a vague answer" },
          ],
          items: [
            {
              id: "sort-c24-where-going",
              text: "\u201cSo where is this going?\u201d",
              correctBucket: "vague",
              correction:
                "It sounds direct and it isn't — they have to guess what you're asking. Name the actual thing.",
            },
            {
              id: "sort-c24-seeing-others",
              text: "\u201cAre you seeing other people?\u201d",
              correctBucket: "answerable",
              correction: "Yes or no. That's the whole point.",
            },
            {
              id: "sort-c24-what-are-we",
              text: "\u201cWhat are we?\u201d",
              correctBucket: "vague",
              correction:
                "Almost impossible to answer well. Ask about a specific thing instead.",
            },
            {
              id: "sort-c24-something-serious",
              text: "\u201cAre you looking for something serious, or not right now?\u201d",
              correctBucket: "answerable",
              correction: "Two options offered. Easy to answer honestly.",
            },
            {
              id: "sort-c24-how-you-feel",
              text: "\u201cHow do you feel about me?\u201d",
              correctBucket: "vague",
              correction:
                "Produces reassurance rather than information, and you won't believe it anyway.",
            },
            {
              id: "sort-c24-exclusive-soon",
              text: "\u201cIs being exclusive something you'd want at some point?\u201d",
              correctBucket: "answerable",
              correction: "Specific, future-facing, and answerable without pressure.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The question, in your words",
          helper:
            "One thing, answerable yes or no — or with two options offered. You might start with “Can I ask you something directly?” or “I'd rather ask than keep wondering…”",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've written the question and you're together with nothing else going on.",
          doThis:
            "Ask it once, in the words you wrote. Take the answer at face value, including if it isn't the one you wanted.",
        },
        {
          kind: "output",
          heading: "What I asked, and what they said",
          body: "Whatever came back, you now know something you were previously inferring.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cWhere is this going\u201d makes them guess. Ask the actual thing.",
            "If a direct question ends it, that's information.",
            "Take the answer at face value.",
          ],
        },
      ],
      portable: [
        "\u201cWhere is this going\u201d makes them guess. Ask the actual thing.",
        "If a direct question ends it, that's information.",
        "Take the answer at face value.",
      ],
      myPlaysTemplate: {
        when: "When I've been wondering what we are without asking",
        move: "Ask one specific answerable question, directly",
        lookingFor: "A real answer — including one I don't want",
        watchOut: "Asking something so open it can't be answered",
        remember: "This is one of the few questions here that actually has an answer.",
      },
      fidelity: {
        correct:
          "One specific, answerable question about the state of the relationship is actually asked, and the answer taken at face value.",
        misuse: [
          "Asking something open enough to produce reassurance rather than information.",
          "Asking and then discounting the answer.",
          "Asking repeatedly until the answer changes.",
        ],
        notMeaning:
          "It does not mean the answer will be the one you want, that asking makes commitment more likely, or that one answer settles it permanently.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "what-would-i-need-to-see",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Would I Need to See?",
      positioning: "For replacing \u201chow long should I wait\u201d with something answerable.",
      recognitionGate: {
        prompt: "Are you waiting to find out whether this is going somewhere?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "There is no correct number of weeks, and anyone who gives you one is guessing with confidence.",
            "But \u201cwhat would I need to see, and by when\u201d is answerable \u2014 by you, today, without anyone else's cooperation.",
            "That's the swap. You give up the question you wanted answered and get one you can actually work with.",
          ],
        },
        {
          kind: "learn",
          body: [
            "A wait with no end point can't conclude. There's always a reason to give it a bit longer, and each individual reason is sound.",
            "A wait with an end point produces information. Either the thing you named happens by then, or it doesn't, and you learn something either way.",
            "This isn't a deadline for them. It's a date on which you look.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Name it",
          fields: [
            {
              id: "what-id-need",
              input: "text",
              label: "What would you need to see for this to feel like it's going somewhere?",
              placeholder:
                "Something observable. Not \u201cmore effort\u201d \u2014 something you could point at.",
            },
            {
              id: "by-when",
              input: "chips",
              label: "By when will you look?",
              suggestions: [
                "A month",
                "Two months",
                "Three months",
                "The next time it comes up",
              ],
            },
            {
              id: "already-seen",
              input: "text",
              label: "Have you seen any of it already?",
              placeholder: "Be fair to them here. Include what has happened.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is what you named something you could actually notice happening?",
          enoughLabel: "Yes — it's observable",
          needMoreLabel: "Not really — it's a feeling",
          needMoreIntro:
            "Common, and worth fixing. \u201cI'd need to feel more secure\u201d can't be observed. \u201cI'd need them to make a plan more than a week ahead\u201d can.",
          needToKnowLabel: "What would make it observable",
          observableLabel: "Something I could point at",
        },
        {
          kind: "output",
          heading: "What I'd need to see, and by when",
          body: "Not a deadline for them. A day on which you look.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cHow long\u201d has no answer. \u201cWhat would I need to see\u201d does.",
            "A wait with no end point can't conclude.",
            "It's a date on which I look, not a deadline for them.",
          ],
        },
      ],
      portable: [
        "\u201cHow long\u201d has no answer. \u201cWhat would I need to see\u201d does.",
        "A wait with no end point can't conclude.",
        "It's a date on which I look, not a deadline for them.",
      ],
      myPlaysTemplate: {
        when: "When I'm waiting to see if this goes anywhere",
        move: "Name something observable, and a date to look at it",
        lookingFor: "Whether the thing I named has happened by then",
        watchOut: "Naming a feeling instead of something I could point at",
        remember: "Not deciding is also a decision, and it costs the same time.",
      },
      fidelity: {
        correct:
          "An observable condition and a review date are named in advance, and the review is actually taken.",
        misuse: [
          "Naming a feeling rather than something observable.",
          "Moving the date when it arrives.",
          "Telling them the date as a warning.",
        ],
        notMeaning:
          "It does not mean the thing will happen, that the date is the right length, or that reaching it obliges you to act.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "my-actual-terms",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "My Actual Terms",
      positioning: "For \u201cam I settling\u201d — which has no answer until you have terms.",
      recognitionGate: {
        prompt: "Do you wonder whether this is enough, without knowing what enough would be?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cAm I settling\u201d assumes a scale everyone is placed on. There isn't one, which is why the question can be asked for years without resolving.",
            "What exists is your terms — the specific things without which this doesn't work for you. Most people have never written them down, which is why \u201cis this enough\u201d has nothing to measure against.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Not \u201ckindness\u201d. Something like: someone who tells me when they're annoyed rather than going quiet.",
            "Not \u201cambition\u201d. Something like: someone who has something of their own they care about.",
            "Vague terms can't be checked, which means they can't answer the question either.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these could you check?",
          situation:
            "You're trying to work out whether this is enough, and you've never actually written down what enough would be.",
          buckets: [
            { id: "checkable", label: "Checkable" },
            { id: "vague", label: "Can't be checked" },
          ],
          items: [
            {
              id: "sort-c24-chemistry",
              text: "Real chemistry",
              correctBucket: "vague",
              correction: "No way to check it and no agreed meaning. Needs unpacking.",
            },
            {
              id: "sort-c24-says-annoyed",
              text: "Tells me when something's bothering them",
              correctBucket: "checkable",
              correction: "Observable over a few weeks. That's a term.",
            },
            {
              id: "sort-c24-makes-me-happy",
              text: "Makes me happy",
              correctBucket: "vague",
              correction:
                "Nothing in it to check, and it puts the responsibility on them.",
            },
            {
              id: "sort-c24-wants-kids",
              text: "Wants children, or definitely doesn't",
              correctBucket: "checkable",
              correction: "Answerable by asking. One of the clearest terms there is.",
            },
            {
              id: "sort-c24-good-person",
              text: "A good person",
              correctBucket: "vague",
              correction: "True of most people and useless as a filter.",
            },
            {
              id: "sort-c24-own-friends",
              text: "Has their own friends and things they do",
              correctBucket: "checkable",
              correction: "Observable, and more predictive than it sounds.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Write yours",
          fields: [
            {
              id: "my-terms",
              input: "text",
              label: "What are your actual terms? Aim for three or four.",
              placeholder: "Specific enough that you could check them.",
            },
            {
              id: "met",
              input: "chips",
              label: "How many are met here?",
              suggestions: ["All of them", "Most", "About half", "Fewer than half"],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "If your terms are met and you're still uneasy — what's the unease about?",
          enoughLabel: "They're not all met, and that's the issue",
          needMoreLabel: "They are met, and I'm still not sure",
          needMoreIntro:
            "That's useful rather than confusing. It means the unease isn't about whether this is enough — it's about something else, possibly about deciding at all.",
          needToKnowLabel: "What the unease might actually be about",
          observableLabel: "Something I could notice or check",
        },
        {
          kind: "output",
          heading: "My terms, and where they stand",
          body: "\u201cAm I settling\u201d is now a checkable question rather than an anxious one.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "There's no scale. There are only my terms.",
            "A vague term can't be checked, so it can't answer anything.",
            "If they're met and I'm still uneasy, the unease is about something else.",
          ],
        },
      ],
      portable: [
        "There's no scale. There are only my terms.",
        "A vague term can't be checked, so it can't answer anything.",
        "If they're met and I'm still uneasy, the unease is about something else.",
      ],
      myPlaysTemplate: {
        when: "When I don't know whether this is enough",
        move: "Name three or four checkable terms and see where they stand",
        lookingFor: "Which are actually met, and which I'd been assuming",
        watchOut: "Writing terms so vague they can't be checked",
        remember: "\u201cSomeone better exists\u201d isn't the test. \u201cSomething I need is missing\u201d is.",
      },
      fidelity: {
        correct:
          "Three or four checkable terms are named and assessed against the current situation.",
        misuse: [
          "Writing terms that can't be observed.",
          "Writing them to justify a decision already made.",
          "Treating the list as a screening checklist for future people.",
        ],
        notMeaning:
          "It does not mean the terms are correct, that meeting them guarantees anything, or that unmet terms mean you should leave.",
      },
    },
  ],

  literature: C24_LITERATURE,

  missions: [
    {
      id: "mission-c24-ask",
      version: 1,
      playId: "just-ask-what-this-is",
      title: "Ask a second thing",
      instruction:
        "You asked in the tool. Ask one more — something you'd normally have inferred from behaviour instead.",
      linkToOperation: "Direct clarification of relational status",
      attemptMeaning:
        "You asked. An unwelcome answer is a completed attempt.",
      suitability:
        "If asking felt impossible rather than uncomfortable, that's worth noticing separately.",
      progression: [
        { id: "rung-c24-ask-2", instruction: "Ask about something further ahead than the next few weeks." },
      ],
    },
    {
      id: "mission-c24-see",
      version: 1,
      playId: "what-would-i-need-to-see",
      title: "Keep the date",
      instruction:
        "When your date arrives, actually look. Don't move it. Note what you found, whichever way it went.",
      linkToOperation: "Time-bounded observation before deciding",
      attemptMeaning:
        "You looked on the day. Moving the date is information too.",
      suitability:
        "If you moved it, that's worth knowing rather than hiding — it usually means the condition wasn't the real question.",
      progression: [
        { id: "rung-c24-see-2", instruction: "Set the next one shorter than the last." },
      ],
    },
    {
      id: "mission-c24-terms",
      version: 1,
      playId: "my-actual-terms",
      title: "Say your terms out loud to someone",
      instruction:
        "Tell someone you trust what your terms are. Notice which you can defend easily and which wobble when said aloud.",
      linkToOperation: "Externalising and testing one's own criteria",
      attemptMeaning:
        "You said them. Wobbling on one isn't a reason to drop it.",
      suitability:
        "Pick someone who won't immediately tell you you're too picky. That's the input you're trying to get away from.",
      progression: [
        { id: "rung-c24-terms-2", instruction: "Take one vague term and make it checkable." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c24-ask",
      version: 1,
      playId: "just-ask-what-this-is",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked something specific",
          "Took the answer at face value",
          "Asked once and stopped",
          "Asked something too open",
        ],
      },
      performedOperation: {
        label: "Did you ask a specific answerable question?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Where they actually are",
          "That I could just ask",
          "How much I'd been inferring",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The answer was vague and I let it be",
          "I couldn't bring myself to ask",
          "I asked and didn't believe it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c24-see",
      version: 1,
      playId: "what-would-i-need-to-see",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named something observable",
          "Set a date",
          "Actually looked on the day",
          "Moved the date",
        ],
      },
      performedOperation: {
        label: "Did you name an observable condition and look on the date?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it had happened",
          "That it hadn't",
          "That I'd been waiting without a condition",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I moved the date",
          "I couldn't name anything observable",
          "It happened and I still wasn't sure",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c24-terms",
      version: 1,
      playId: "my-actual-terms",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Wrote checkable terms",
          "Checked them against this situation",
          "Said them out loud",
          "Wrote things I couldn't check",
        ],
      },
      performedOperation: {
        label: "Did you name checkable terms and assess them?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Which terms actually matter to me",
          "That most of them are met",
          "That they're met and I'm still uneasy",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything I wrote was vague",
          "They're met and I still don't know",
          "I couldn't say them out loud",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
