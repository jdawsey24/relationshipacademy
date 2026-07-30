/**
 * Cluster 8 — "Feeling Like We're Growing Apart"
 * The Relationship Playbook™ · Finding Your Way Back to Each Other
 *
 * Track: Expansion. Task = Integration. Core Need: TO FEEL UNDERSTOOD.
 * §0 DECISION: PLAYS-ONLY, consistent with Clusters 3-7.
 *
 * ⚠ FRAME — owner-ruled. This moves someone OUT of a place of pain. Not a
 *   screen. The flat / checked-out statements are the far end of the same
 *   road, not a separate condition. Write for someone who wants their way
 *   back.
 *
 * ⚠ SAFETY — `SAFETY_RECOGNITION_CARD` (shared) has role "signpost" and routes to NO Play.
 *   Cluster 7 precedent. Feeling unsafe is not a connection problem.
 *
 * ⚠ LIGHT SIGNPOST on self-disconnection inside `have-i-stopped-reaching` —
 *   a mention, not a route-out. Owner-confirmed.
 *
 * ⚠ SCOPE — "your half". 14 Relational Condition statements; one reader.
 *
 * ⚠ CLAIM SCOPE. May claim: name what's missing precisely; say what you want
 *   rather than what's wrong; put one small thing back; notice whether you've
 *   stopped reaching. MUST NOT CLAIM: the closeness returns, they'll meet you,
 *   the relationship survives, or that trying harder is the answer.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import {
  SAFETY_RECOGNITION_CARD,
  SAFETY_GUIDE,
} from "@/content/playbook/shared/safety-not-safe";
import { C8_LITERATURE } from "./finding-your-way-back-literature";

export const FINDING_YOUR_WAY_BACK: PlaybookContent = {
  playbookKey: "finding-your-way-back", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Finding Your Way Back to Each Other",

  opening: {
    title: "Before anything else",
    body: [
      "Nothing went wrong. That's what makes this so hard to explain — there was no crisis, and you're still two people who handle things well together and don't know each other much anymore.",
      "Underneath most of what people say here is one thing: I don't feel understood. That's what this works on.",
      "There's one of you reading this, and it took two of you to drift. We'll be honest about what that means.",
    ],
    manifestations: [
      "We feel like roommates.",
      "I don't feel seen.",
      "We only talk about responsibilities.",
      "I've stopped expecting things to get better.",
    ],
    cta: "Start with what this actually is",
  },

  recognitionCards: [
    SAFETY_RECOGNITION_CARD,
    {
      id: "rec-c8-not-understood",
      role: "route",
      pathwayPlayId: "the-closest-word",
      headline: "I don't feel seen, or heard, or... I can't quite name it.",
      explanation:
        "That's one thing said eight ways, because no single word covers it. Finding the closest one is what makes it askable.",
      secondaryExamples: [
        "I don't feel valued.",
        "They don't understand me.",
        "I feel lonely in my relationship.",
      ],
    },
    {
      id: "rec-c8-want-instead",
      role: "route",
      pathwayPlayId: "what-i-want-instead",
      headline: "I know what's missing. I don't know how to ask for it.",
      explanation:
        "\u201cI don't feel like a priority\u201d invites a defence. \u201cI want to feel like a priority\u201d invites an answer.",
      secondaryExamples: [
        "I want someone who understands me.",
        "I want a relationship that feels like home.",
        "I don't know how to make us a priority again.",
      ],
    },
    {
      id: "rec-c8-roommates",
      role: "route",
      pathwayPlayId: "one-thing-back",
      headline: "We only ever talk about logistics.",
      explanation:
        "The bins have a deadline. Asking each other a real question doesn't. Small things survive better than big gestures.",
      secondaryExamples: [
        "We feel like roommates.",
        "We've become business partners instead of lovers.",
        "We stopped dating each other.",
      ],
    },
    {
      id: "rec-c8-checked-out",
      role: "route",
      pathwayPlayId: "have-i-stopped-reaching",
      headline: "I've stopped expecting it to get better.",
      explanation:
        "Nobody starts here. You get here by reaching and not being met, enough times that reaching starts to feel humiliating.",
      secondaryExamples: [
        "I go through the motions.",
        "I feel like I've checked out.",
        "I feel emotionally flat.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "the-closest-word",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Closest Word",
      positioning:
        "For when you can't quite say what's missing. You work the word out alone \u2014 then you say it, because a word nobody hears does nothing.",
      recognitionGate: {
        prompt: "Do you find yourself listing what's wrong because no single word fits?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Not seen. Not heard. Not valued. Not appreciated. Not important.",
            "That's not five problems. It's one thing that doesn't have a good word, so you keep trying different ones hoping something lands.",
            "The circling is accurate. It's also unaskable — a person can respond to something specific and can't respond to a fog.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cI don't feel appreciated\u201d sounds like it's about the washing-up. What you mean is much bigger, which is why saying it never quite works.",
            "The aim isn't a perfect word. It's the closest one, plus one concrete moment where you felt it — because the moment does the work the word can't.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these could someone actually do something with?",
          situation:
            "You've been trying to say what's missing for months. It keeps coming out as a list, and it keeps going nowhere.",
          buckets: [
            { id: "askable", label: "They could act on this" },
            { id: "fog", label: "Nothing to act on" },
          ],
          items: [
            {
              id: "sort-c8-drifting",
              text: "\u201cWe're growing apart\u201d",
              correctBucket: "fog",
              correction:
                "True, and there's nothing in it to do. It describes the weather.",
            },
            {
              id: "sort-c8-asked-about-day",
              text: "\u201cYou haven't asked me about my day in about a month\u201d",
              correctBucket: "askable",
              correction: "Specific, checkable, and there's an obvious next move.",
            },
            {
              id: "sort-c8-not-valued",
              text: "\u201cI don't feel valued\u201d",
              correctBucket: "fog",
              correction:
                "It's the truest thing you could say and there's no action in it. Needs a moment attached.",
            },
            {
              id: "sort-c8-told-you-thing",
              text: "\u201cI told you the thing about my mum and you were on your phone\u201d",
              correctBucket: "askable",
              correction: "One moment. That's what makes it possible to respond to.",
            },
            {
              id: "sort-c8-roommates",
              text: "\u201cWe're like roommates\u201d",
              correctBucket: "fog",
              correction:
                "Accurate and unanswerable. It invites agreement or denial, not action.",
            },
            {
              id: "sort-c8-laugh",
              text: "\u201cWe used to laugh at things together and I can't remember the last time\u201d",
              correctBucket: "askable",
              correction: "Specific enough to be recognised, and it names something recoverable.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your closest word",
          fields: [
            {
              id: "closest-word",
              input: "chips",
              label: "Which one is nearest?",
              suggestions: [
                "Not seen",
                "Not heard",
                "Not valued",
                "Not desired",
                "Not a priority",
                "Not known",
              ],
            },
            {
              id: "the-moment",
              input: "text",
              label: "One moment where you felt it. What actually happened?",
              placeholder: "Not a pattern. One time, recently, that you could describe.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The word, and the moment",
          helper:
            "One word plus one specific thing that happened. Nothing else — no list, no history. You might start with “I've worked out what I've been missing.”",
        },
        {
          kind: "output",
          heading: "What I said",
          body: "The word on its own does nothing. Saying it is the tool.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "One thing, said eight ways. Find the nearest.",
            "A word plus a moment. The moment does the work.",
            "They can't respond to a fog.",
          ],
        },
      ],
      portable: [
        "One thing, said eight ways. Find the nearest.",
        "A word plus a moment. The moment does the work.",
        "They can't respond to a fog.",
      ],
      myPlaysTemplate: {
        when: "When I can't say what's missing without listing everything",
        move: "Find the closest word and attach one concrete moment to it",
        lookingFor: "Something specific enough that they could recognise it",
        watchOut: "Producing the whole list again — that's the fog, not the point",
        remember: "The circling is accurate. It's just not askable yet.",
      },
      fidelity: {
        correct:
          "One term is selected, paired with a single concrete recent instance, and SAID to the other person. The saying completes it; the working-out alone does not.",
        misuse: [
          "Producing the full list instead of choosing.",
          "Using the moment as evidence in a case.",
          "Picking the word that sounds least demanding rather than the truest.",
        ],
        notMeaning:
          "It does not mean they'll understand it, that naming it changes anything, or that you've found the whole of it.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "what-i-want-instead",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What I Want Instead",
      positioning:
        "For turning what's missing into something they could actually do \u2014 and then asking. This one needs them; the ask is the tool.",
      recognitionGate: {
        prompt:
          "Do your attempts to raise this turn into them defending themselves \u2014 and are you ready to try asking instead?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't feel like a priority\u201d is a verdict. There's a rebuttal available, so you get one.",
            "\u201cI want to feel like a priority\u201d is a request. It can be met or refused — and either way you learn something.",
            "This isn't a communication trick. The second version tells them what to do. The first only tells them they've failed.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Most people in this position can list what they want quite easily: to be understood, to feel like a priority, for it to feel like home.",
            "Those sentences get overlooked because they sound obvious. They're the most useful thing here — they're the only place you say what you want rather than what's absent.",
            "The work is making one of them small enough to be doable this week.",
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "What you're asking for",
          helper:
            "Not “more connection” — something they could actually do on Wednesday. You might start with “Can I ask for something? It's small.”",
        },
        {
          kind: "sufficiency",
          prompt: "Could they do what you've written, this week, without guessing?",
          enoughLabel: "Yes — it's concrete",
          needMoreLabel: "Not really — it's still a feeling",
          needMoreIntro:
            "Very common. \u201cI want to feel closer\u201d isn't doable. \u201cI want us to have one conversation this week that isn't about the kids\u201d is.",
          needToKnowLabel: "What would make it concrete",
          observableLabel: "Something they could actually do",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've drafted the ask and you're somewhere neither of you is busy.",
          doThis:
            "Ask for it once, in those words. Then stop and let them answer \u2014 met or refused, you now know something you were guessing at.",
        },
        {
          kind: "output",
          heading: "What I asked, and what they said",
          body: "Met or refused, you now know something you were previously guessing at.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A verdict gets a rebuttal. A request gets an answer.",
            "Could they do it Wednesday without guessing?",
            "Say what I want, not what's wrong.",
          ],
        },
      ],
      portable: [
        "A verdict gets a rebuttal. A request gets an answer.",
        "Could they do it Wednesday without guessing?",
        "Say what I want, not what's wrong.",
      ],
      myPlaysTemplate: {
        when: "When raising it turns into them defending themselves",
        move: "Turn what's missing into a specific want they could act on",
        lookingFor: "Whether it's concrete enough to do this week",
        watchOut: "Asking for a feeling — nobody can produce a feeling on request",
        remember: "Either answer is information. Refused is still information.",
      },
      fidelity: {
        correct:
          "A stated absence is converted into a specific actionable request AND asked. The asking is the operation; drafting it is preparation.",
        misuse: [
          "Wrapping a complaint in request language.",
          "Asking for a feeling rather than an action.",
          "Attaching a consequence to it.",
        ],
        notMeaning:
          "It does not mean they'll agree, that being met would fix it, or that asking well makes it more likely.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "one-thing-back",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "One Thing Back",
      positioning: "For when everything between you is admin.",
      recognitionGate: {
        prompt: "Is almost everything you say to each other about arrangements?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Logistics are urgent. Connection isn't. The bins have a deadline; asking each other a real question doesn't.",
            "So it goes to the bottom of the list, every day, for perfectly good reasons. Two years of that and you've built something that runs beautifully and contains almost nothing.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The instinct is a weekend away. Big gestures carry too much — if it goes flat, it doesn't just go flat, it becomes evidence.",
            "A small thing carries almost nothing. If it lands badly it was a small thing, and you can do another on Thursday.",
            "It also asks nothing of them. A Thing needs both of you ready. A small thing doesn't.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What you'd put back",
          fields: [
            {
              id: "what-went",
              input: "chips",
              label: "What's gone that you miss most?",
              suggestions: [
                "Laughing at things together",
                "Being asked about my day and meaning it",
                "Talking about something that isn't the house",
                "Being touched for no reason",
                "Planning something we both want",
              ],
            },
            {
              id: "smallest-version",
              input: "text",
              label: "What's the smallest version of that?",
              placeholder: "Small enough to do this week without announcing it.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "When",
          conditionLabel: "When I'll do it",
          thenLabel: "And what I'll hold to",
          actions: [
            "Once this week",
            "Twice, on different days",
            "Something tiny, daily",
            "Next time there's a quiet ten minutes",
          ],
          controlCheck:
            "I'm not announcing it as an initiative. I'm not counting whether they reciprocate. If it lands flat, that's allowed. I'll do another.",
        },
        {
          kind: "output",
          heading: "The one thing",
          body: "Small, unannounced, repeatable.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Big gestures carry too much.",
            "If it lands flat, it was a small thing.",
            "Don't announce it. Don't count.",
          ],
        },
      ],
      portable: [
        "Big gestures carry too much.",
        "If it lands flat, it was a small thing.",
        "Don't announce it. Don't count.",
      ],
      myPlaysTemplate: {
        when: "When everything between us is admin",
        move: "Put one small non-logistical thing back, without announcing it",
        lookingFor: "Whether anything at all comes back — not whether it's matched",
        watchOut: "Keeping score, or making it a Thing",
        remember: "A weekend away can't carry this. Ten minutes might.",
      },
      fidelity: {
        correct:
          "One small non-logistical exchange is initiated without announcement or reciprocity condition.",
        misuse: [
          "Announcing it as an effort you're making.",
          "Tracking whether they match it.",
          "Escalating to a large gesture when a small one falls flat.",
        ],
        notMeaning:
          "It does not mean they'll respond, that closeness returns, or that repeated small things add up to a fix.",
      },
    },

    // ─────────────────────────────── Play 4 ──
    {
      playId: "have-i-stopped-reaching",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Have I Stopped Reaching?",
      positioning: "For when you've quietly given up and haven't said so.",
      recognitionGate: {
        prompt: "Have you stopped trying, without ever deciding to?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You reached, and weren't met, enough times that reaching started to feel humiliating. So you stopped — and stopping brought relief, which is why it stuck.",
            "That's a sensible adaptation to something that kept costing you. It's also, eventually, the thing holding the situation in place.",
          ],
        },
        {
          kind: "learn",
          body: [
            "People who've genuinely stopped caring don't feel flat about it. They feel free.",
            "Flat usually means still wanting it and having given up on getting it. That's more painful, and it also means something is still running.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Noticing you've checked out tends to bring up how long it's been, and what it's cost, and whether it was worth it.",
            "You don't have to do anything with that today. Noticing is the whole ask.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest look",
          fields: [
            {
              id: "when-stopped",
              input: "text",
              label: "When did you stop reaching? Roughly.",
              placeholder: "A season, a year, after something in particular.",
            },
            {
              id: "what-stopped",
              input: "chips",
              label: "What did you stop doing?",
              suggestions: [
                "Telling them things",
                "Asking for what I wanted",
                "Starting conversations",
                "Expecting an answer",
                "Hoping it would change",
              ],
            },
            {
              id: "still-there",
              input: "chips",
              label: "Honestly — is any of it still there?",
                suggestions: [
                "Yes, and that's the painful part",
                "Some of it",
                "I don't know",
                "I don't think so",
              ],
            },
          ],
        },
        {
          kind: "output",
          heading: "Where I actually am",
          body: "Not a decision about the relationship. Just an honest position.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Nobody starts checked out.",
            "Flat means still wanting it. Free means finished.",
            "Noticing is the whole ask.",
          ],
        },
      ],
      portable: [
        "Nobody starts checked out.",
        "Flat means still wanting it. Free means finished.",
        "Noticing is the whole ask.",
      ],
      myPlaysTemplate: {
        when: "When I've quietly stopped trying and haven't admitted it",
        move: "Look honestly at when I stopped and whether anything is still there",
        lookingFor: "Whether it's flat or genuinely finished — they're different",
        watchOut: "Turning this into a verdict about the relationship today",
        remember: "Stopping was sensible. It's also what's holding it in place.",
      },
      fidelity: {
        correct:
          "Disengagement is named honestly, including whether anything remains, without a decision being forced.",
        misuse: [
          "Using it to justify leaving.",
          "Using it to prove you tried harder than they did.",
          "Deciding the answer before doing it.",
        ],
        notMeaning:
          "It does not mean you should stay, that you should go, or that noticing changes anything by itself.",
      },
      supportSignposts: [
        {
          id: "signpost-c8-self-disconnection",
          heading: "If it isn't only about them",
          body:
            "Some of what people write here isn't really about the relationship — feeling disconnected from yourself, not remembering the last time anything felt exciting, not feeling like yourself anymore. If that's nearer the mark, it's worth mentioning to a GP or a therapist. Not instead of this. Alongside it, because that part isn't a relationship problem and won't be fixed by one.",
        },
      ],
    },
  ],

  // SAFETY_GUIDE first so the shared "not safe" card's guide is reachable in Understand.
  literature: [SAFETY_GUIDE, ...C8_LITERATURE],

  missions: [
    {
      id: "mission-c8-word",
      version: 1,
      playId: "the-closest-word",
      title: "Say a second one, later",
      instruction:
        "You said the first in the tool. A week or two on, say another \u2014 and notice whether the first one landed anywhere.",
      linkToOperation: "Naming the unmet need specifically enough to be actionable",
      attemptMeaning: "You said it. Whether they got it isn't the measure.",
      suitability:
        "If saying it isn't safe, this isn't the tool. Read the card at the top.",
      progression: [
        { id: "rung-c8-word-2", instruction: "Say a second one, a week later, and see if the first landed." },
      ],
    },
    {
      id: "mission-c8-ask",
      version: 1,
      playId: "what-i-want-instead",
      title: "Ask for a second thing",
      instruction:
        "You made the first ask in the tool. Make a second, on a different subject, before judging whether the first held.",
      linkToOperation: "Converting an absence into an actionable request",
      attemptMeaning:
        "You asked. Refused is information; so is met.",
      suitability:
        "If you find yourself attaching a consequence, that's a different conversation and probably a harder one.",
      progression: [
        { id: "rung-c8-ask-2", instruction: "Ask for a second thing before checking whether the first held." },
      ],
    },
    {
      id: "mission-c8-small",
      version: 1,
      playId: "one-thing-back",
      title: "Put the small thing back, twice",
      instruction:
        "Do the small thing you named. Then do it again a few days later. Don't announce either, and don't count what comes back.",
      linkToOperation: "Reintroducing non-logistical exchange",
      attemptMeaning:
        "You did it. Flat is a normal result and isn't a verdict.",
      suitability:
        "If you've been doing this alone for a long time already, read 'Your half of it' before doing more.",
      progression: [
        { id: "rung-c8-small-2", instruction: "Do a different one, rather than repeating the same." },
      ],
    },
    {
      id: "mission-c8-reaching",
      version: 1,
      playId: "have-i-stopped-reaching",
      title: "Reach once, on purpose",
      instruction:
        "Pick one thing you stopped doing and do it once, knowingly. Note what it cost you and what came back.",
      linkToOperation: "Resuming a discontinued bid, deliberately",
      attemptMeaning:
        "You reached. Not being met is the outcome you were protecting against — and now you know rather than assume.",
      suitability:
        "Only if you want to. If the honest answer is that you don't, that's worth knowing too and isn't a failure of this.",
      progression: [
        { id: "rung-c8-reaching-2", instruction: "Reach a second time before deciding what the first one meant." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c8-word",
      version: 1,
      playId: "the-closest-word",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said one word rather than the list",
          "Attached a specific moment",
          "Stopped talking afterwards",
          "Ended up listing everything",
        ],
      },
      performedOperation: {
        label: "Did you name one thing with one moment?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Which word is actually nearest",
          "That the moment does the work",
          "How much I'd been circling",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They didn't recognise it",
          "I couldn't pick one",
          "It turned into the whole conversation",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c8-ask",
      version: 1,
      playId: "what-i-want-instead",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked for something specific",
          "Said what I wanted, not what was wrong",
          "Let the answer be the answer",
          "It came out as a complaint",
        ],
      },
      performedOperation: {
        label: "Did you make a specific, actionable ask?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That asking works better than telling",
          "What I actually want",
          "Where they are on it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They agreed and nothing happened",
          "I couldn't make it concrete",
          "It still came out as blame",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c8-small",
      version: 1,
      playId: "one-thing-back",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Did the small thing",
          "Did it more than once",
          "Didn't announce it",
          "Waited for them to go first",
        ],
      },
      performedOperation: {
        label: "Did you put one small thing back without announcing it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That small things are possible",
          "How much of it is logistics",
          "That something came back",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It fell completely flat",
          "I couldn't stop keeping score",
          "I'm always the one doing this",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c8-reaching",
      version: 1,
      playId: "have-i-stopped-reaching",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Looked at it honestly",
          "Reached once on purpose",
          "Told someone where I am",
          "Decided not to, for now",
        ],
      },
      performedOperation: {
        label: "Did you look honestly at whether you've stopped?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That something's still there",
          "How long it's been",
          "That I'm further along than I thought",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I reached and wasn't met",
          "Looking at it made it worse",
          "I don't think I want to",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
