/**
 * ADD-ON — "Dating Later"
 * Derived from Cluster 20: Dating Later in Life (10 statements).
 *
 * Track: Renewal. Core Need: TO MOVE FORWARD.
 * Two Plays, five literature entries — add-on scale.
 *
 * ⚠ ADD-ON. Not quiz-detectable. Reached by signpost or life-situation menu.
 *
 * ⚠ NO AGE IS NAMED ANYWHERE. "Later" means later than the reader expected.
 *   No numbers, no life-stage assumptions, no assumption about why they are
 *   single now.
 *
 * ⚠ THE READER IS NOT DISADVANTAGED. The accumulated position — a settled life,
 *   known preferences, less patience for what doesn't work — is treated as an
 *   advantage, because it is one.
 *
 * ⚠ NO REASSURANCE ABOUT FINDING SOMEONE.
 *
 * ⚠ OVERLAPS: `staying-yourself` (C22) covers independence and commitment;
 *   `lean-in-or-let-go` (C24) covers whether to invest. This is the context
 *   those sit in, not a restatement of either.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { ADDON_DATING_LATER_LITERATURE } from "./dating-later-literature";

export const ADDON_DATING_LATER: PlaybookContent = {
  playbookKey: "addon-dating-later",
  playbookVersion: 1,
  displayName: "Dating Later",

  opening: {
    title: "Written for someone else",
    body: [
      "Most of what's out there is written for someone just starting out — lots of time, few commitments, no long history behind them. That fits almost nobody who's doing this later.",
      "Two things have changed, and people treat them as one problem. First, the mechanics — how dating works. That part is really different now, but you can learn it. Second, you — and that's mostly an advantage.",
      "Nothing here promises you'll meet anyone.",
    ],
    manifestations: [
      "I never thought I'd be dating at this age.",
      "Dating feels completely different now.",
      "I enjoy my independence, but I miss companionship.",
      "I don't know how to balance protecting my peace with opening my heart.",
    ],
    cta: "Start by separating the two",
  },

  recognitionCards: [
    {
      id: "rec-later-too-old",
      role: "validate",
      pathwayPlayId: null,
      headline: "Am I too old to start over?",
      validationCopy:
        "Some things are harder now. There are fewer people to meet. Lives are more tangled. More has to be worked around instead of built together. Some things are easier. You know what you want. You can say it. You don't need the relationship to give you everything. \u201cWill I ever find love again\u201d has no answer, and it isn't a question about you. People who have everything going for them don't meet anyone, and people who have none of it do.",
      secondaryExamples: [
        "I don't know if I'll ever find love again.",
        "I never thought I'd be dating at this age.",
        "I don't want to waste time.",
      ],
    },
    {
      id: "rec-later-different",
      role: "route",
      pathwayPlayId: "whats-changed-and-whats-mine",
      headline: "Dating feels completely different now.",
      explanation:
        "It helps to pull apart what's changed out there from what's changed in you. Only one of them is a problem to solve.",
      secondaryExamples: [
        "I don't know what people expect anymore.",
        "I don't know how to trust after everything I've experienced.",
      ],
    },
    {
      id: "rec-later-peace",
      role: "route",
      pathwayPlayId: "the-rate-not-the-decision",
      headline: "I don't know how to balance protecting my peace with opening my heart.",
      explanation:
        "This is a real tug-of-war, not a mix-up. Both sides are good things. Advice usually picks one side — and it's wrong about half the time.",
      secondaryExamples: [
        "I enjoy my independence, but I miss companionship.",
        "I don't want to merge my life with someone too quickly.",
      ],
    },
  ],

  plays: [
    {
      playId: "whats-changed-and-whats-mine",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What's Changed, and What's Mine",
      positioning: "For separating the mechanics from the person doing it.",
      recognitionGate: {
        prompt: "Does dating feel like a whole different thing from what you remember?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Two things have changed, and they get carried as one problem.",
            "Out there: where people meet, how much happens on a screen first, the pace, the sheer number of options, and how little people already know about each other when they show up.",
            "In you: you know what you want, you have a life, you have less patience for what doesn't work, and you have more to protect.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The first list is a learning problem, and it's smaller than it feels. The mechanics can be learned in a few months.",
            "The second isn't a problem at all. People often call it one, though — usually people who'd be better off if you had less of it.",
            "Knowing what you want and saying it early is an advantage. So is not needing the relationship to give you everything.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is a mechanics problem, and which is you?",
          situation:
            "You've been at this a few months and it feels harder than you expected. Some of it is the format and some of it isn't.",
          buckets: [
            { id: "mechanics", label: "Mechanics \u2014 learnable" },
            { id: "me", label: "Me \u2014 and mostly an advantage" },
          ],
          items: [
            {
              id: "sort-later-apps",
              text: "I don't know how any of the apps work",
              correctBucket: "mechanics",
              correction: "A learning problem. A few weeks, not something about who you are.",
            },
            {
              id: "sort-later-know-what-i-want",
              text: "I know what I want and I say so early",
              correctBucket: "me",
              correction:
                "An advantage, and unusual. Most people can't do it at any age.",
            },
            {
              id: "sort-later-expectations",
              text: "I don't know what people expect now",
              correctBucket: "mechanics",
              correction:
                "This is about the norms, and you can just ask about them instead of guessing.",
            },
            {
              id: "sort-later-less-patience",
              text: "I lose interest quickly when something isn't right",
              correctBucket: "me",
              correction:
                "This is being efficient, not rigid \u2014 though it's worth checking that it isn't kicking in before you have anything real to go on.",
            },
            {
              id: "sort-later-pace",
              text: "Everything moves faster at the start than I'm comfortable with",
              correctBucket: "mechanics",
              correction: "A norm, and one you can say no to without explaining yourself.",
            },
            {
              id: "sort-later-have-a-life",
              text: "I have a full life and don't want to lose it",
              correctBucket: "me",
              correction:
                "The strongest thing on this list. It's what lets you say no to a bad option.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your own version of each.",
          fields: [
            {
              id: "mechanics",
              label: "What's a mechanics problem you could actually learn?",
              input: "text",
              placeholder: "The bit that's about how it works now.",
            },
            {
              id: "mine",
              label: "What have you got now that you didn't have before?",
              input: "text",
              placeholder: "Be generous here. Most people count this too low.",
            },
          ],
        },
        {
          kind: "output",
          heading: "The two lists",
          body:
            "One is learnable. The other isn't a problem, though it often gets described as one.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The mechanics are a learning problem. Months, not a trait.",
            "Knowing what I want is an advantage most people don't have.",
            "Having a life is what lets me say no to a bad option.",
          ],
        },
      ],
      portable: [
        "The mechanics are a learning problem. Months, not a trait.",
        "Knowing what I want is an advantage most people don't have.",
        "Having a life is what lets me say no to a bad option.",
      ],
      myPlaysTemplate: {
        when: "When dating feels like a whole different thing from what I remember",
        move: "Separate what changed out there from what changed in me",
        lookingFor: "Which hard parts I can learn, and which aren't really problems",
        watchOut: "Treating everything I've built up as a downside",
        remember: "The people who call it rigid would be better off if I had less of it.",
      },
      fidelity: {
        correct:
          "Changes in dating are told apart from changes in the reader, and the changes in the reader are seen as strengths, not obstacles.",
        misuse: [
          "Filing your own standards under problems to fix.",
          "Treating not knowing the format yet as a statement about who you are.",
          "Using it to decide it's all the world's fault.",
        ],
        notMeaning:
          "It doesn't mean the mechanics are easy, that your advantages will lead to a result, or that anything gets simpler.",
      },
    },

    {
      playId: "the-rate-not-the-decision",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Rate, Not the Decision",
      positioning: "For holding your peace and your openness at the same time.",
      recognitionGate: {
        prompt: "Does opening up feel like it would cost you something you fought for?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cProtecting my peace\u201d and \u201copening my heart\u201d are both good things. That's why the tension never fully goes away.",
            "The peace was hard to win, and losing it would be a real loss. And nothing worth having comes without opening yourself up a little.",
            "Advice usually picks a side — be more open, or protect yourself — and each side is wrong about half the time.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It helps more to treat this as a rate, not a decision. Not open or closed — but how fast, about what, and with the freedom to slow down without ending anything.",
            "Combining your lives is also easier later, not harder. Houses, routines, family, money — it happens faster, and it's much harder to undo. \u201cI don't want to waste time\u201d pushes you to hurry, and hurrying doesn't save time if it ends badly.",
            "Going slower isn't a test of them, and shouldn't be treated like one. It's about what you'd want to still have if it didn't work out.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What makes up the peace? Name specific things, not a general feeling.",
          fields: [
            {
              id: "the-peace",
              label: "What actually makes up the peace you'd be protecting?",
              input: "chips",
              suggestions: [
                "My own place",
                "My own money",
                "How I spend my week",
                "Not having to accommodate anyone",
                "Quiet",
                "My friendships as they are",
              ],
            },
            {
              id: "would-open",
              label: "What would you be willing to open, and roughly when?",
              input: "text",
              placeholder: "Order matters more than timing. What goes first?",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "A rate you set for yourself, ahead of time, while nothing is pushing on you.",
          conditionLabel: "What I'll keep separate for now",
          thenLabel: "And what I'll do if things move faster than that",
          actions: [
            "Say plainly that I want to go slower",
            "Keep it separate without explaining why",
            "Ask what they'd want, and say what I want",
            "Slow down without ending anything",
          ],
          controlCheck:
            "This is about what I'd want to still have if it didn't work out — not a test of them, and not a way of expecting it to fail.",
        },
        {
          kind: "output",
          heading: "My rate",
          body:
            "Not open or closed. How fast, about what, and able to slow down without ending anything.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Both are good things. That's why it never fully settles.",
            "A rate, not a decision.",
            "Moving quickly doesn't save time if it ends badly.",
          ],
        },
      ],
      portable: [
        "Both are good things. That's why it never fully settles.",
        "A rate, not a decision.",
        "Moving quickly doesn't save time if it ends badly.",
      ],
      myPlaysTemplate: {
        when: "When opening up feels like it would cost me what I've built",
        move: "Set a rate rather than making a decision about openness",
        lookingFor: "What exactly makes up the peace — not a general feeling",
        watchOut: "Treating going slow as a test of them",
        remember: "Combining lives is faster and harder to undo later. That's a reason to set a pace, not to close yourself off.",
      },
      fidelity: {
        correct:
          "The parts of the reader's independence are named one by one, and a rate of opening is set ahead of time instead of one all-or-nothing decision.",
        misuse: [
          "Using the rate as a test of the other person.",
          "Setting it so slowly that nothing can happen.",
          "Treating any request to move faster as a warning sign.",
        ],
        notMeaning:
          "It doesn't mean the pace will be accepted, that slower is safer, or that your peace is guaranteed either way.",
      },
    },
  ],

  literature: ADDON_DATING_LATER_LITERATURE,

  missions: [
    {
      id: "mission-later-mechanics",
      version: 1,
      playId: "whats-changed-and-whats-mine",
      title: "Ask someone about the mechanics",
      instruction:
        "Ask a friend who's been dating lately how it actually works now. Treat it as getting information, not confessing anything.",
      linkToOperation: "Treating changes out there as something you can learn",
      attemptMeaning:
        "You asked. Not knowing the format is a fact about the format.",
      suitability:
        "Pick someone who won't turn it into advice about your attitude.",
      progression: [
        {
          id: "rung-later-mechanics-2",
          instruction: "Ask someone you're seeing what they expect, rather than guessing.",
        },
      ],
    },
    {
      id: "mission-later-rate",
      version: 1,
      playId: "the-rate-not-the-decision",
      title: "Say the rate out loud, once",
      instruction:
        "Tell someone you're seeing one thing you want to keep separate for now \u2014 as information, not as a condition.",
      linkToOperation: "Saying a pace for joining your lives, as information",
      attemptMeaning:
        "You said it. How they take it is useful either way.",
      suitability:
        "Say it before it's a point of argument, not in the moment it comes up. It's much easier as information than as a no.",
      progression: [
        {
          id: "rung-later-rate-2",
          instruction: "Ask them what they'd want to keep separate.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-later-mechanics",
      version: 1,
      playId: "whats-changed-and-whats-mine",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated the mechanics from myself",
          "Counted what I've got now",
          "Asked about how it works",
          "Filed my standards under problems",
        ],
      },
      performedOperation: {
        label: "Did you separate environmental change from your own?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the mechanics are learnable",
          "How much I've got that I didn't before",
          "That some of it isn't a problem at all",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It all felt like me",
          "The mechanics are more than I want to learn",
          "My standards do seem to be the problem",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-later-rate",
      version: 1,
      playId: "the-rate-not-the-decision",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what makes up the peace",
          "Set a rate in advance",
          "Said it as information",
          "Framed it as a test of them",
        ],
      },
      performedOperation: {
        label: "Did you set a rate rather than a decision?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What the peace is actually made of",
          "That both things can be held",
          "That I'd been treating it as open or closed",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They took it as a lack of interest",
          "I set it so slow nothing can happen",
          "I couldn't say it out loud",
          "Nothing stuck",
        ],
      },
    },
  ],
};
