/**
 * Cluster 14 — "Difficulty Saying No"
 * The Relationship Playbook™ · Learning to Say No Without Guilt
 *
 * Track: Expansion. Task = Integration.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ HIGHEST BEHAVIOURAL DENSITY IN THE CORPUS — 10 of 20 statements are
 *   Self-Behaviour. The change targets derive almost directly.
 *
 * ⚠ NOT A "STOP BEING KIND" PLAYBOOK. Generosity is not the target. The
 *   automatic yes is.
 *
 * ⚠ SELF-BLAME GUARD. "People take advantage of me" / "I attract people who
 *   need fixing" put the cause in the reader's character. Described, never
 *   explained; handled in `lit-c14-not-who-you-are`.
 *
 * ⚠ CLAIM SCOPE. May claim: notice the moment before the yes; buy time; say
 *   the smaller true thing; ask for one thing out loud. MUST NOT CLAIM: that
 *   the guilt goes, that people take it well, or that the reader will stop
 *   being generous.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C14_LITERATURE } from "./learning-to-say-no-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const LEARNING_TO_SAY_NO: PlaybookContent = {
  playbookKey: "learning-to-say-no", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Learning to Say No Without Guilt",

  opening: {
    title: "You already know what you do",
    body: [
      "That's unusual. Most people come to something like this unsure what their pattern even is. You can list yours.",
      "So this isn't about figuring yourself out. It's about the half-second between being asked and the yes coming out. That's where the whole thing really happens.",
      "Nothing here is aimed at making you less generous.",
    ],
    manifestations: [
      "I say yes when I want to say no.",
      "I always end up doing everything.",
      "I feel guilty setting boundaries.",
      "I don't ask for what I need.",
    ],
    cta: "Start with the half-second",
  },

  recognitionCards: [
    {
      id: "rec-c14-generosity-isnt-the-problem",
      role: "validate",
      pathwayPlayId: null,
      headline: "I know I do this. Knowing hasn't helped.",
      validationCopy:
        "It wouldn't. You don't lack understanding — you can list the pattern better than most people could. The gap is between knowing and the half-second where the yes comes out anyway. That's a much smaller and more exact thing to work on than 'learn to set boundaries'.",
      secondaryExamples: [
        "I confuse love with sacrifice.",
        "I don't know how to protect my peace.",
      ],
    },
    {
      id: "rec-c14-automatic-yes",
      role: "route",
      pathwayPlayId: "the-half-second",
      headline: "I say yes before I've even thought about it.",
      explanation:
        "The yes isn't a decision. It's out before you've weighed anything. Then you deal with the results of an answer you never gave.",
      secondaryExamples: [
        "I say yes when I want to say no.",
        "I don't know how to say no.",
        "I avoid difficult conversations.",
      ],
    },
    {
      id: "rec-c14-keeping-peace",
      role: "route",
      pathwayPlayId: "the-smaller-true-thing",
      headline: "I keep the peace even when I'm unhappy.",
      explanation:
        "A boundary doesn't have to be a flat no. There's usually something smaller and true that you could actually do.",
      secondaryExamples: [
        "I pretend everything is okay.",
        "I apologise too much.",
        "I ignore my own needs.",
      ],
    },
    {
      id: "rec-c14-not-asking",
      role: "route",
      pathwayPlayId: "ask-for-one-thing",
      headline: "I never ask for what I need.",
      explanation:
        "Saying no and asking use the same muscle. Most people here find asking harder. A no can sound practical. A request is bare.",
      secondaryExamples: [
        "I'm afraid my needs are too much.",
        "I don't know how to advocate for myself.",
        "I worry that honesty will push people away.",
      ],
    },
    {
      id: "rec-c14-carrying-it-all",
      role: "route",
      pathwayPlayId: "what-this-is-costing-me",
      headline: "I always end up doing everything.",
      explanation:
        "Each yes was small and made sense. That's why it piles up without anyone noticing — including you.",
      secondaryExamples: [
        "I give too much.",
        "I stay longer than I should.",
        "People take advantage of me.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "the-half-second",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Half-Second",
      positioning: "For the yes that's out before you've decided anything.",
      recognitionGate: {
        prompt: "Do you agree to things before you've had a chance to think?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Someone asks, and before you've weighed anything the word is already out. Then you spend three days dealing with the results of an answer you never gave.",
            "It's fast because you've done it thousands of times, and mostly it worked. Things stayed smooth. Nobody was annoyed with you.",
            "Something that works that well doesn't just go away. But it can be slowed down.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cLet me check and come back to you\u201d is the whole tool.",
            "It works because you don't have to say no to anyone right then — which is the part you can't do yet. It just buys back the thinking time you skipped.",
            "You'll still say yes to most of it. The difference is that some of them become decisions.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your tell",
          fields: [
            {
              id: "recent-yes",
              input: "text",
              label: "A recent yes you regretted. What was asked?",
              placeholder: "Small ones count. Most of them are small.",
            },
            {
              id: "how-fast",
              input: "chips",
              label: "How long between the ask and your answer?",
              suggestions: [
                "Immediately",
                "A few seconds",
                "I said yes then felt it drop",
                "I did think, and said yes anyway",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Your holding line",
          conditionLabel: "What I'll say instead of yes",
          thenLabel: "And when I'll come back to them",
          actions: [
            "\u201cLet me check and come back to you.\u201d",
            "\u201cCan I let you know later today?\u201d",
            "\u201cI want to think about it \u2014 give me till tomorrow.\u201d",
            "\u201cLet me look at the week and tell you.\u201d",
          ],
          controlCheck:
            "This isn't saying no. It's not answering yet. I will actually come back to them. Saying yes afterwards is completely fine.",
        },
        {
          kind: "output",
          heading: "My holding line",
          body: "One sentence, used before the yes. That's the whole tool.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The yes isn't a decision. It's a reflex.",
            "Not saying no \u2014 not saying yes yet.",
            "Saying yes afterwards is still a win.",
          ],
        },
      ],
      portable: [
        "The yes isn't a decision. It's a reflex.",
        "Not saying no \u2014 not saying yes yet.",
        "Saying yes afterwards is still a win.",
      ],
      myPlaysTemplate: {
        when: "When I'm asked for something and the yes is already coming",
        move: "Use my holding line instead of answering",
        lookingFor: "Whether the answer changes once I've actually thought it over",
        watchOut: "Using the delay to figure out what they'd want, instead of what I want",
        remember: "Most of them will still be yes. Some of them will be mine.",
      },
      fidelity: {
        correct:
          "A holding line is used instead of an instant yes, and the reader comes back with an answer.",
        misuse: [
          "Using the delay to avoid answering at all.",
          "Using the time to figure out what they'd rather hear.",
          "Treating a later yes as having failed.",
        ],
        notMeaning:
          "It does not mean you'll say no, that they'll accept the delay, or that the guilt won't arrive anyway.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "the-smaller-true-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Smaller True Thing",
      positioning:
        "For when a flat no feels out of reach. You find the smaller version on your own — then you say it.",
      recognitionGate: {
        prompt: "Do you agree because the other option feels too blunt?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "People picture a flat no, said calmly, to someone who takes it well. That's a high bar. If it's the only option, you'll keep choosing the yes.",
            "There's almost always something smaller and true. It's more honest than the automatic yes, and it's within reach for someone who can't yet manage a flat no.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cI can do part of that.\u201d \u201cNot this week \u2014 could it be next?\u201d \u201cI'd rather not, but I will if you're stuck.\u201d \u201cI can, but honestly it's a lot at the moment.\u201d",
            "None of those are a no. All of them put your real position in the room — which is the thing that's been missing.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these puts your position in the room?",
          situation:
            "Someone's asked you for something. It's a fair enough ask. You've already said yes in your head.",
          buckets: [
            { id: "honest", label: "Says something true" },
            { id: "same-as-yes", label: "Same as the automatic yes" },
          ],
          items: [
            {
              id: "sort-c14-course",
              text: "\u201cOf course, no problem at all\u201d",
              correctBucket: "same-as-yes",
              correction: "That's the reflex with extra reassurance stuck on.",
            },
            {
              id: "sort-c14-part",
              text: "\u201cI can do the first half, not the rest\u201d",
              correctBucket: "honest",
              correction: "Part of it, clear, and true. That's the middle range.",
            },
            {
              id: "sort-c14-happy-to",
              text: "\u201cHappy to!\u201d when you're not",
              correctBucket: "same-as-yes",
              correction: "The exclamation mark is usually the tell.",
            },
            {
              id: "sort-c14-if-stuck",
              text: "\u201cI'd rather not, but I will if you're stuck\u201d",
              correctBucket: "honest",
              correction:
                "You still did it, and they now know it cost something. Both true.",
            },
            {
              id: "sort-c14-fine",
              text: "\u201cIt's fine, don't worry about it\u201d",
              correctBucket: "same-as-yes",
              correction: "Classic. It closes the subject and tells them nothing.",
            },
            {
              id: "sort-c14-lot-on",
              text: "\u201cI can, but I've got a lot on \u2014 is anyone else free?\u201d",
              correctBucket: "honest",
              correction: "Says yes and puts the real information in. That counts.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "Your middle-range answer",
          helper:
            "Truer than a yes, smaller than a no. You might start with \u201cI can do part of this\u2026\u201d or \u201cNot this week, but\u2026\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've written out the middle-range version and the request is still open.",
          doThis:
            "Say it once, to the person it's about. Then stop, and let them respond however they respond.",
        },
        {
          kind: "output",
          heading: "What I said",
          body: "Truer than a yes. Smaller than a no.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A boundary doesn't have to be a refusal.",
            "\u201cI can do part of that\u201d is a complete answer.",
            "Truer than a yes. Smaller than a no.",
          ],
        },
      ],
      portable: [
        "A boundary doesn't have to be a refusal.",
        "\u201cI can do part of that\u201d is a complete answer.",
        "Truer than a yes. Smaller than a no.",
      ],
      myPlaysTemplate: {
        when: "When a flat no is out of reach but the yes isn't honest",
        move: "Find the middle-range version and say it",
        lookingFor: "Whether my real position made it into the room",
        watchOut: "Softening it back into a yes while saying it",
        remember: "Most people take the middle version completely fine.",
      },
      fidelity: {
        correct:
          "A partial or hedged answer is actually said, instead of a plain yes.",
        misuse: [
          "Writing it out and saying yes anyway.",
          "Adding so much softening that the position disappears.",
          "Using it to refuse things you'd have been fine doing.",
        ],
        notMeaning:
          "It does not mean they'll respond well, that it gets easier, or that you should have said a full no.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "ask-for-one-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Ask For One Thing",
      positioning:
        "For the request you've never made. You figure out what it is — then you ask.",
      recognitionGate: {
        prompt: "When did you last ask someone for something you needed?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Most people here do, and there's a reason. A no can sound practical — I'm busy, I can't this week.",
            "A request is bare. It says: I want something, and I'm telling you. There's no way to do it that isn't exposing.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cMy needs are too much\u201d is held very firmly by people who have almost never said one out loud.",
            "It's a prediction about an experiment nobody ran. The people around you have mostly never had the chance to find your needs reasonable, because they've never heard one.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Asking for something small can feel far more exposing than it should — more than saying no to something big.",
            "That's normal here and it isn't a sign you've picked the wrong thing.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One thing",
          fields: [
            {
              id: "the-need",
              input: "text",
              label: "What's something you want and haven't asked for?",
              placeholder: "Start small. Genuinely small.",
            },
            {
              id: "prediction",
              input: "chips",
              label: "What do you think will happen if you ask?",
              suggestions: [
                "They'll be annoyed",
                "They'll say yes but resent it",
                "They'll think I'm needy",
                "Honestly, probably nothing bad",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The ask, in your words",
          helper:
            "One thing, with no reason tacked on. You might start with \u201cCould you\u2026\u201d or \u201cSomething that would help me\u2026\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've picked something small you want and haven't asked for.",
          doThis:
            "Ask it once, in the words you wrote. Don't add the reason, don't pre-apologise, don't offer them a way out.",
        },
        {
          kind: "output",
          heading: "What I asked, and what happened",
          body: "Compare what happened to what you predicted. That comparison is the point.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Saying no and asking are the same muscle.",
            "It's a prediction about an experiment I never ran.",
            "No lead-in. No apology attached.",
          ],
        },
      ],
      portable: [
        "Saying no and asking are the same muscle.",
        "It's a prediction about an experiment I never ran.",
        "No lead-in. No apology attached.",
      ],
      myPlaysTemplate: {
        when: "When I want something and haven't said so",
        move: "Ask for one small thing, without giving a reason for it",
        lookingFor: "What actually happens, next to what I predicted",
        watchOut: "Adding so much apology that it stops being a request",
        remember: "They've mostly never had the chance to find my needs reasonable.",
      },
      fidelity: {
        correct:
          "One request is actually made, with no apology or reason added first.",
        misuse: [
          "Wrapping it in so much softening that it doesn't read as a request.",
          "Asking and then taking it right back.",
          "Choosing something so small it can't test the prediction.",
        ],
        notMeaning:
          "It does not mean they'll say yes, that asking gets easier, or that your prediction was wrong.",
      },
    },

    // ─────────────────────────────── Play 4 ──
    {
      playId: "what-this-is-costing-me",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What This Is Costing Me",
      positioning: "For when you're carrying everything and nobody knows.",
      recognitionGate: {
        prompt: "Are you doing more than anyone around you realises?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Nobody agrees to carry everything. They agree to forty small, fair things one at a time, and the fortieth lands on top of thirty-nine others nobody counted.",
            "Including you. That's why this builds up where nobody can see it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The obvious cost is time and energy. The other one is that nobody around you knows what you actually think.",
            "You've gone along with things long enough that what you want isn't visible — including to people who'd have been glad to make room for it.",
            "That's how this quietly becomes resentment. You're carrying something nobody asked you to carry, because you never told them you were.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest count",
          fields: [
            {
              id: "what-im-carrying",
              input: "text",
              label: "What are you doing that nobody has noticed?",
              placeholder: "The things that just... became yours.",
            },
            {
              id: "how-it-became-mine",
              input: "chips",
              label: "How did it become yours?",
              suggestions: [
                "I offered once and it stuck",
                "Nobody else was going to",
                "I'm better at it, so it made sense",
                "I never said anything",
              ],
            },
            {
              id: "do-they-know",
              input: "chips",
              label: "Do they know you'd rather not?",
              suggestions: [
                "No — I've never said",
                "They might have guessed",
                "I've hinted",
                "Yes, and nothing changed",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Have you actually told anyone this is a lot — or are they just left to guess?",
          enoughLabel: "I've said it directly",
          needMoreLabel: "They're guessing, or I've hinted",
          needMoreIntro:
            "That's the common answer, and it's the whole problem. Resentment about something you never said can't clear up, because the other person is working from information they don't have.",
          needToKnowLabel: "What I'd want them to actually know",
          observableLabel: "Something I could say plainly",
        },
        {
          kind: "output",
          heading: "What I'm carrying, and who knows",
          body: "Not a case against anyone. A count, and whether it's ever been said.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Every yes was small. That's why nobody counted.",
            "They're working from information they don't have.",
            "Hinting isn't telling.",
          ],
        },
      ],
      portable: [
        "Every yes was small. That's why nobody counted.",
        "They're working from information they don't have.",
        "Hinting isn't telling.",
      ],
      myPlaysTemplate: {
        when: "When I'm carrying more than anyone realises",
        move: "Count it honestly, and check whether it's ever actually been said",
        lookingFor: "The gap between what I carry and what anyone knows I carry",
        watchOut: "Building a case rather than making a count",
        remember: "Resentment about something you never said can't clear up.",
      },
      fidelity: {
        correct:
          "The load is counted honestly, and the difference between hinting and telling is named.",
        misuse: [
          "Turning it into proof against one person.",
          "Using it as a reason to pull back rather than say something.",
          "Counting only the things that prove the point.",
        ],
        notMeaning:
          "It does not mean anyone will take things off you, that they've been unfair, or that counting changes anything by itself.",
      },
    },
  ],

  literature: C14_LITERATURE,

  missions: [
    {
      id: "mission-c14-hold",
      version: 1,
      playId: "the-half-second",
      title: "Use the holding line three times",
      instruction:
        "Next three times you're asked for something, use your line before answering. Note what you decided after the pause.",
      linkToOperation: "Breaking into the automatic yes with a holding line",
      attemptMeaning:
        "You paused. Saying yes afterwards counts completely.",
      suitability:
        "Small requests are best for this. Don't save it for the hard one.",
      progression: [
        { id: "rung-c14-hold-2", instruction: "Use it on something that matters more." },
      ],
    },
    {
      id: "mission-c14-smaller",
      version: 1,
      playId: "the-smaller-true-thing",
      title: "Say a second one",
      instruction:
        "You said the first in the tool. Say another middle-range answer this week, to someone different.",
      linkToOperation: "Saying a partial or hedged position",
      attemptMeaning: "You said it. How it landed is separate.",
      suitability:
        "If softening keeps creeping back in, notice where — that's the useful part, not a failure.",
      progression: [
        { id: "rung-c14-smaller-2", instruction: "Try a full no, once, on something small." },
      ],
    },
    {
      id: "mission-c14-ask",
      version: 1,
      playId: "ask-for-one-thing",
      title: "Ask for a second thing",
      instruction:
        "You asked in the tool. Ask for one more, from someone different, and compare how the two went.",
      linkToOperation: "Making a request without giving a reason",
      attemptMeaning:
        "You asked. A no is still a completed attempt.",
      suitability:
        "Keep them small. The point is testing the prediction, not getting a big thing.",
      progression: [
        { id: "rung-c14-ask-2", instruction: "Ask for something you'd normally never mention." },
      ],
    },
    {
      id: "mission-c14-count",
      version: 1,
      playId: "what-this-is-costing-me",
      title: "Say one of them out loud",
      instruction:
        "Pick one thing from your list and tell the right person it's a lot. Not a complaint — just information.",
      linkToOperation: "Turning a load they had to guess at into one you've said out loud",
      attemptMeaning:
        "You said it. Whether anything shifts is separate.",
      suitability:
        "If you've already said it and nothing changed, that's different — and worth taking to someone rather than repeating.",
      progression: [
        { id: "rung-c14-count-2", instruction: "Ask for one specific thing to change, rather than only naming it." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c14-hold",
      version: 1,
      playId: "the-half-second",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Used the holding line",
          "Actually came back with an answer",
          "Changed my answer after thinking",
          "Said yes straight away anyway",
        ],
      },
      performedOperation: {
        label: "Did you use the holding line before answering?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How fast the yes actually is",
          "That some of them I'd have declined",
          "That the pause was fine with them",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The yes was out before I remembered",
          "The pause felt rude",
          "I paused and said yes anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c14-smaller",
      version: 1,
      playId: "the-smaller-true-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said a partial version",
          "Put my actual position in the room",
          "Didn't soften it away",
          "It turned into a yes",
        ],
      },
      performedOperation: {
        label: "Did you say the middle-range version?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the middle range exists",
          "That they were fine with it",
          "How much I usually soften",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I softened it back into a yes",
          "They pushed and I folded",
          "The guilt was worse than expected",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c14-ask",
      version: 1,
      playId: "ask-for-one-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked without justifying it",
          "Didn't pre-apologise",
          "Let it sit after asking",
          "Withdrew it immediately",
        ],
      },
      performedOperation: {
        label: "Did you ask, without apology or justification?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That my prediction was wrong",
          "That my prediction was right",
          "How rarely I ask for anything",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't get it out",
          "I wrapped it in so much apology it vanished",
          "They said no and it confirmed everything",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c14-count",
      version: 1,
      playId: "what-this-is-costing-me",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Counted honestly",
          "Said one of them out loud",
          "Noticed I'd only ever hinted",
          "Kept it to myself again",
        ],
      },
      performedOperation: {
        label: "Did you count it honestly and check whether it's been said?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it is mine",
          "That nobody actually knows",
          "That hinting hasn't worked",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into a case against them",
          "I said it and nothing changed",
          "Counting made me angrier",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
