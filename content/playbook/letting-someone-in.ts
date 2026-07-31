/**
 * Cluster 3 — "Fear of Being Fully Known"
 * The Relationship Playbook™ · Letting Someone In
 *
 * §0 DECISION: PLAYS-ONLY (consistent with Cluster 4). No `simulations[]`.
 * Ships under the amended invariant permitting a Play without a paired
 * Experience (PD-9, owner-approved).
 *
 * ⚠ CANDIDATE FOR A LATER EXPERIENCE: `one-true-thing` maps naturally to
 *   `evidenceTimeline` (disclose → watch the response → decide about the next
 *   one). Stronger simulation case than anything in Cluster 4. Not v1.
 *
 * Derived against Framework Version 1.9 (Manual Lag Rule applied).
 *   PE-6a → Perceptual Lens, ACCURATE — EXITS, no Play
 *   PE-4a → competency (Emotional Intimacy) — Understand layer in v1
 *   PE-4b → perceptual/motivational — Understand layer
 *   PE-4c → Personal Capacity Regulation (RLC-FR-002) — NOT a competency
 *   Structural History (RLC-FR-006) applied as a standard input
 *
 * ⚠ CLAIM SCOPE. May claim: notice the moment you move away and decide about
 *   it; say one true thing and watch what happens; ask instead of testing;
 *   decide on fit rather than staying by default; pace closeness to what you
 *   have available. MUST NOT claim: that letting someone in goes well, that
 *   you will stop being guarded, that the fear is unfounded, or that the
 *   reader lacks the ability to be close.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C3_LITERATURE } from "./letting-someone-in-literature";

export const LETTING_SOMEONE_IN: PlaybookContent = {
  // ── §1 top level ───────────────────────────────────────────────
  playbookKey: "letting-someone-in", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Letting Someone In",

  opening: {
    title: "Before anything else",
    body: [
      "Being afraid of getting hurt, after you've been hurt, is accurate. We're not going to try to talk you out of it.",
      "What we're going to look at is the moment you move away — and whether, that once, you want to.",
      "Nothing here promises it goes well.",
    ],
    manifestations: [
      "I push people away.",
      "I leave before they leave.",
      "I don't know how to be vulnerable.",
      "I'm afraid I've become too guarded.",
    ],
    cta: "Start with what's already accurate",
  },

  // ── §2 recognition ─────────────────────────────────────────────
  recognitionCards: [
    {
      id: "rec-c3-fear-is-fair",
      role: "validate",
      pathwayPlayId: null,
      headline: "I'm afraid of getting hurt again — and I don't think that's irrational.",
      validationCopy:
        "It isn't. Being wary after being hurt is a correct reading of something that actually happened. Nothing in here is going to argue with it. This is the starting point, not the problem.",
      secondaryExamples: [
        "I want love, but I'm scared of it.",
        "I'm afraid to be vulnerable.",
      ],
    },
    {
      id: "rec-c3-leave-first",
      role: "route",
      pathwayPlayId: "before-you-go",
      headline: "I leave before they can leave me.",
      explanation:
        "Exiting early guarantees the ending. It also means you never find out.",
      secondaryExamples: [
        "I push people away when they get close.",
        "I always find a reason to leave.",
        "I'm afraid I've become too guarded.",
      ],
    },
    {
      id: "rec-c3-hiding",
      role: "route",
      pathwayPlayId: "one-true-thing",
      headline: "I edit myself so people will keep liking me.",
      explanation:
        "One true thing, to one person, is survivable in a way that all of it isn't.",
      secondaryExamples: [
        "I feel like I have to perform.",
        "I don't know if they'd still love me if they knew everything.",
        "I'm sharing more of myself, but I don't know if it's safe yet.",
      ],
    },
    {
      id: "rec-c3-testing",
      role: "route",
      pathwayPlayId: "just-ask",
      headline: "I test people instead of asking them.",
      explanation:
        "A test tells you how they respond to a test. It never settles anything.",
      secondaryExamples: [
        "I wanted them to read my mind.",
        "I hoped they'd change without me having to ask.",
      ],
    },
    {
      id: "rec-c3-staying",
      role: "route",
      pathwayPlayId: "is-this-right-for-me",
      headline: "I knew it wasn't right and I stayed anyway.",
      explanation:
        "Staying by default and choosing to stay are different things.",
      secondaryExamples: [
        "I stayed because I didn't want to be alone.",
        "I kept hoping love would fix our incompatibility.",
      ],
    },
    {
      id: "rec-c3-closeness-costs",
      role: "route",
      pathwayPlayId: "when-closeness-costs",
      headline: "I feel trapped when it gets serious.",
      explanation:
        "Not that you can't be close. That closeness is currently costing more than you've got.",
      secondaryExamples: [
        "I crave space all the time.",
        "I don't like needing anyone.",
      ],
    },
  ],

  // ── §3 plays ───────────────────────────────────────────────────
  plays: [
    // ───────────────────────────────────────── Play 1 · CP-07 ──
    {
      playId: "before-you-go",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Before You Go",
      positioning: "For the moment you've decided to end it and haven't yet.",
      recognitionGate: {
        prompt: "Have you found yourself ready to end something before anything actually went wrong?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Leaving first isn't cowardice. It's the only move that guarantees the outcome — if you go before they do, you wrote the ending.",
            "The cost is that you never find out. Every early exit is a data point you didn't collect.",
            "This isn't about not leaving. Sometimes leaving is right. It's about putting a gap in, and using the gap.",
          ],
        },
        {
          kind: "learn",
          body: [
            "One responds to something they did. It's specific, recent, and you could point at it.",
            "The other arrives before they've done anything, and would be true of whoever was standing there.",
            "You often can't tell which you're in from the inside, in the moment. That's what the gap is for.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Staying in an unresolved thing is harder than ending it. Ending it brings relief, and the relief is real.",
            "You can want to go and still wait. Both at once. Feeling the pull isn't failing at this.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The two lists",
          fields: [
            {
              id: "what-they-did",
              input: "text",
              label: "What did they actually do? Just what happened.",
              placeholder: "Took a day to reply. Cancelled Friday…",
            },
            {
              id: "what-i-expect",
              input: "text",
              label: "What am I expecting is coming?",
              placeholder: "The thing you're bracing for…",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the second list based on the first — or on everyone before them?",
          enoughLabel: "It's based on what this person did",
          needMoreLabel: "It arrived before they'd done much",
          needMoreIntro:
            "That's the common answer, and it's the useful one. It doesn't mean you're wrong. It means you haven't found out yet.",
          needToKnowLabel: "What I'd need to see to know either way",
          observableLabel: "Something I could actually notice happening",
        },
        {
          kind: "ruleBuilder",
          intro: "Set the gap before you need it.",
          conditionLabel: "How long I'll wait before acting on it",
          thenLabel: "And while I wait, I'll watch for",
          actions: [
            "Whether they get in touch first",
            "Whether they do the thing they said",
            "Whether the urge to go changes on its own",
            "The specific thing I named above",
          ],
          controlCheck:
            "The gap is a promise to look, not a promise to stay \u2014 and if I've actually been mistreated, I don't need one.",
        },
        {
          kind: "output",
          heading: "My gap",
          body: "Not a commitment to stay. A decision about when you'll decide.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Is this about them, or about everyone?",
            "I can want to go and still wait.",
            "Leaving early means never finding out.",
          ],
        },
      ],
      portable: [
        "Is this about them, or about everyone?",
        "I can want to go and still wait.",
        "Leaving early means never finding out.",
      ],
      myPlaysTemplate: {
        when: "When I've decided to end something and nothing has actually gone wrong",
        move: "Put a gap between deciding and doing, and watch during it",
        lookingFor: "Something specific this person did — not what I'm braced for",
        watchOut: "Using the gap to build the case instead of to look",
        remember: "Sometimes leaving is right. This is about the exits where nothing happened.",
      },
      fidelity: {
        correct:
          "A gap is set before acting, and something observable is named to watch for during it.",
        misuse: [
          "Using the gap to gather evidence for the exit you'd already chosen.",
          "Staying in something where you've actually been mistreated.",
          "Treating the gap as a promise to stay.",
        ],
        notMeaning:
          "It does not mean the relationship will work, that leaving would be wrong, or that your read is inaccurate.",
      },
      supportSignposts: [
        {
          id: "signpost-c3-mistreatment",
          heading: "If something has actually happened",
          body:
            "If what you're describing involves fear, pressure, control, contempt, threats, or harm, this isn't a pattern for you to solve through better communication. Pause this tool and speak privately with a domestic-abuse service, or another qualified professional trained in relationship abuse. They can help you understand what's happening and make a safety plan based on your circumstances. You don't have to be certain before asking.",
        },
      ],
    },

    // ───────────────────────────────────────── Play 2 · CP-06 ──
    {
      playId: "one-true-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "One True Thing",
      positioning:
        "For when they only know the version you've edited. You choose the thing alone \u2014 then you say it, because a true thing unsaid changes nothing.",
      recognitionGate: {
        prompt: "Do you find yourself managing what people see of you?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Letting someone see something real does two things at once. It gives them a chance to accept it. It also gives them better information for leaving.",
            "Both are true. Anyone pretending only the first exists is selling something.",
            "What changes the maths is size and order. One true thing, said to one person, and then you watch.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Not a confession. Not your history. Something small and real that you'd normally have smoothed over.",
            "An actual opinion instead of the agreeable one. Something you're worried about. A preference you'd usually let go.",
            "The size is the point. You need it small enough that their reaction is survivable, because the reaction is the information.",
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "One true thing, said plainly",
          helper:
            "Small. Real. Something you'd normally smooth over. You might start with \u201cHonestly, I\u2026\u201d or \u201cSomething I haven't said is\u2026\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've picked the one thing and you're with the person you had in mind.",
          doThis:
            "Say it once, then stop talking and watch what they do with it. Don't explain it, don't add a second one, and don't apologise for it.",
          safetyNote:
            "If what you're carrying is heavier than a preference \u2014 something from your history you've never told anyone \u2014 this isn't the place to try it first. Start smaller.",
        },
        {
          kind: "ruleBuilder",
          intro: "Decide what you're watching for before you say it.",
          conditionLabel: "The one true thing I'm going to say",
          thenLabel: "What I'll pay attention to in their response",
          actions: [
            "Whether they stayed with it or moved past it",
            "Whether they asked anything about it",
            "Whether it came up again later",
            "Whether they offered something of their own",
          ],
          controlCheck:
            "I'm saying this to find out, not to test them \u2014 and it's small enough that any reaction is survivable.",
        },
        {
          kind: "output",
          heading: "My one true thing",
          body: "Said once. Then watched. That's the whole operation.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Small enough that their reaction is survivable.",
            "I'm saying it to find out, not to test them.",
            "Watch what they do with it. That's the information.",
          ],
        },
      ],
      portable: [
        "Small enough that their reaction is survivable.",
        "I'm saying it to find out, not to test them.",
        "Watch what they do with it. That's the information.",
      ],
      myPlaysTemplate: {
        when: "When someone only knows the edited version",
        move: "Say one small true thing and watch what happens to it",
        lookingFor: "Do they stay with it, ask about it, come back to it?",
        watchOut: "Making it a test, or attaching everything else to it",
        remember: "The reaction is the information. That's why it has to be small.",
      },
      fidelity: {
        correct:
          "One bounded disclosure is actually made to the other person, and the response observed rather than pre-judged. Choosing the thing is preparation; saying it is the operation.",
        misuse: [
          "Disclosing everything at once to get it over with.",
          "Using it as a loyalty test.",
          "Deciding what their reaction meant before it happens.",
        ],
        notMeaning:
          "It does not mean they will accept it, that you should share more, or that the relationship will hold.",
      },
      supportSignposts: [
        {
          id: "signpost-c3-heavier-material",
          heading: "If the true thing is a heavy one",
          body:
            "If what you're carrying is bigger than a preference or an opinion — something from your history, something you've never told anyone — this particular exercise isn't built to hold it safely. It's not that such things have to be handed to a professional before anything else; it's that this specific step isn't designed for traumatic or highly distressing material. If and when you want to bring it somewhere, a setting made for that can meet it properly. Here, you might start with something smaller.",
        },
      ],
    },

    // ───────────────────────────────────────── Play 3 · CP-08 ──
    {
      playId: "just-ask",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Just Ask",
      positioning:
        "For when you'd rather find out sideways. You write the question alone \u2014 then you ask it, because that is the only thing that produces an answer.",
      recognitionGate: {
        prompt: "Do you try to find things out without having to ask?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Going quiet to see if they notice. Waiting longer than you need to. Hoping they'll work it out.",
            "The trouble is that a test tells you how someone responds to a test. And if they pass, you don't believe it — because you know it was one.",
            "Asking costs one specific thing: they might say something you don't want to hear. That's the whole cost, and it's why testing exists.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Direct isn't confrontational. It's short, specific, and about one thing.",
            "\u201cAre we exclusive?\u201d is direct. \u201cWhere is this going?\u201d is not — it asks them to guess what you're asking.",
            "The more specific the question, the harder it is to answer vaguely.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these actually asks something?",
          situation:
            "You've been seeing someone for two months. You want to know where you stand, and you keep finding ways not to ask.",
          buckets: [
            { id: "asks", label: "Asks the question" },
            { id: "sideways", label: "Goes sideways" },
          ],
          items: [
            {
              id: "sort-c3-exclusive",
              text: "\u201cAre we seeing other people?\u201d",
              correctBucket: "asks",
              correction: "That one's answerable with a yes or a no. It asks.",
            },
            {
              id: "sort-c3-quiet",
              text: "Going quiet for two days to see what they do",
              correctBucket: "sideways",
              correction:
                "That produces a reaction, not an answer. And you'd discount the answer anyway.",
            },
            {
              id: "sort-c3-where-going",
              text: "\u201cSo… where is this going?\u201d",
              correctBucket: "sideways",
              correction:
                "It sounds direct, but it asks them to guess what you want to know. Name the actual thing.",
            },
            {
              id: "sort-c3-thursday",
              text: "\u201cI'd like to know if you're free Thursday, or if this isn't a regular thing.\u201d",
              correctBucket: "asks",
              correction: "Specific, and answerable. That asks.",
            },
            {
              id: "sort-c3-mention-someone",
              text: "Mentioning someone else to see if they react",
              correctBucket: "sideways",
              correction:
                "Whatever they do, you won't know what it meant. Sideways.",
            },
            {
              id: "sort-c3-hoping",
              text: "Hoping they'll bring it up themselves",
              correctBucket: "sideways",
              correction: "Hoping isn't asking. It's waiting, with the same cost.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The question, in your words",
          helper:
            "One thing, specific enough that a vague answer would be obvious. You might start with \u201cI'd rather just ask\u2026\u201d or \u201cCan I check something?\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've written the question and you're in a calm moment together.",
          doThis:
            "Ask it once, in the words you wrote. Then let the answer be the answer, including if it isn't the one you wanted.",
        },
        {
          kind: "output",
          heading: "What I asked, and what came back",
          body: "Whatever came back is real information. That's the whole point.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A test tells me how they handle a test.",
            "Specific enough that a vague answer would be obvious.",
            "The cost of asking is hearing the answer. That's also the point.",
          ],
        },
      ],
      portable: [
        "A test tells me how they handle a test.",
        "Specific enough that a vague answer would be obvious.",
        "The cost of asking is hearing the answer. That's also the point.",
      ],
      myPlaysTemplate: {
        when: "When I'd rather find out sideways than ask",
        move: "Ask one specific, answerable question directly",
        lookingFor: "A real answer — including one I don't want",
        watchOut: "Dressing up a test as a question",
        remember: "If they pass a test, I won't believe it. That's why testing never settles it.",
      },
      fidelity: {
        correct:
          "One specific answerable question is actually asked, directly, in place of an indirect probe. Drafting it is preparation; asking is the operation.",
        misuse: [
          "Asking in a way engineered to produce a particular answer.",
          "Asking and then discounting the answer.",
          "Stacking several questions so none can be answered.",
        ],
        notMeaning:
          "It does not mean the answer will be the one you want, or that asking makes it more likely.",
      },
    },

    // ───────────────────────────────────────── Play 4 · CP-20 ──
    {
      playId: "is-this-right-for-me",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Is This Actually Right for Me?",
      positioning: "For when you're staying and you're not sure it's a choice.",
      recognitionGate: {
        prompt: "Are you staying in something you already suspect isn't right?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "There's a version of staying that's a decision, and a version that's just the absence of leaving.",
            "They look the same from outside. From inside, one has a reason and the other has an explanation you assembled afterwards.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cCould this work?\u201d is nearly always yes. Almost anything could.",
            "\u201cDoes this fit what I actually need?\u201d is the one that gets answered, and it's the one people avoid.",
            "The second question doesn't require anything to be wrong with them.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest version",
          fields: [
            {
              id: "what-works",
              input: "text",
              label: "What actually works about this?",
              placeholder: "Real things, not potential things.",
            },
            {
              id: "what-doesnt",
              input: "text",
              label: "What doesn't — and has it changed at all?",
              placeholder: "The thing you keep coming back to.",
            },
            {
              id: "why-staying",
              input: "chips",
              label: "If you're honest, what's keeping you here?",
              suggestions: [
                "It works",
                "I don't want to be alone",
                "I've put a lot in already",
                "I'm hoping it changes",
                "I don't know",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is what's keeping you here a reason to stay, or a reason not to leave?",
          enoughLabel: "A reason to stay",
          needMoreLabel: "A reason not to leave",
          needMoreIntro:
            "Those aren't the same, and noticing the difference is the whole operation. It doesn't mean you have to go.",
          needToKnowLabel: "What would need to be true for this to fit",
          observableLabel: "Something I could actually notice happening",
        },
        {
          kind: "output",
          heading: "Where I actually am",
          body: "A read, not a verdict. You can hold it and not act on it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Could this work, or does this fit? Two different questions.",
            "A reason to stay isn't the same as a reason not to leave.",
            "Nothing has to be wrong with them for it not to fit.",
          ],
        },
      ],
      portable: [
        "Could this work, or does this fit? Two different questions.",
        "A reason to stay isn't the same as a reason not to leave.",
        "Nothing has to be wrong with them for it not to fit.",
      ],
      myPlaysTemplate: {
        when: "When I'm staying and I'm not sure it's a choice",
        move: "Separate what works from what's keeping me here",
        lookingFor: "Whether my reason is a reason to stay or a reason not to leave",
        watchOut: "Turning it into a case against them — that's not the question",
        remember: "Noticing isn't deciding. I can hold this and not act on it.",
      },
      fidelity: {
        correct:
          "Fit is evaluated on stated needs, and the reason for staying is named honestly.",
        misuse: [
          "Building a case against them instead of assessing fit.",
          "Treating the output as a decision you now have to act on.",
          "Using it to justify an exit you'd already chosen.",
        ],
        notMeaning:
          "It does not mean you should leave, that the relationship is wrong, or that hoping it changes is foolish.",
      },
      supportSignposts: [
        {
          id: "signpost-c3-mistreatment",
          heading: "If something has actually happened",
          body:
            "If part of what doesn't work is that you're being treated badly — pressure, contempt, being frightened, being controlled — that isn't a fit question. Fit assumes two people are both able to choose freely. If you're not sure that's where you are, please talk to someone who can help you look at it properly.",
        },
      ],
    },

    // ─────────────────────────────── Play 5 · PCR (RLC-FR-002) ──
    {
      playId: "when-closeness-costs",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "When Closeness Costs",
      positioning: "For when it gets serious and something in you wants out.",
      recognitionGate: {
        prompt: "Does closeness start to feel like too much, even when nothing's wrong?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Before anything else: we don't think you can't do closeness.",
            "Closeness takes something — attention, honesty, being reachable, sitting with not knowing. Those aren't free, and the closer it gets the more they cost.",
            "\u201cI feel trapped when it gets serious\u201d reads very differently as a statement about cost than as a statement about ability. We think it's the first one.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Avoidance takes you out of the thing. Pacing keeps you in it, slower.",
            "That's the whole distinction, and it's the one to hold onto. If what you're doing removes you entirely, that's the other one — and that's what Before You Go is for.",
            "You don't need to learn to be close. You need it to cost less, or to have more available, or to go at a rate you can actually afford.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What's actually expensive",
          fields: [
            {
              id: "costly-part",
              input: "chips",
              label: "Which part of getting closer costs you most right now?",
              suggestions: [
                "Being reachable",
                "Being asked about myself",
                "Not knowing where it stands",
                "Time and attention",
                "Being counted on",
              ],
            },
            {
              id: "whats-else-on",
              input: "text",
              label: "What else is currently taking from the same account?",
              placeholder: "Work, family, health, the rest of it…",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Pick a rate you could actually sustain.",
          conditionLabel: "The rate I can actually hold, for now",
          thenLabel: "What that looks like in practice",
          actions: [
            "Stay in contact, less often",
            "Keep seeing them, shorter",
            "Answer, but not immediately",
            "One real conversation, not constant ones",
          ],
          controlCheck:
            "I'll say that I'm slowing rather than just slowing \u2014 pacing keeps me in it, disappearing doesn't.",
        },
        {
          kind: "output",
          heading: "My rate",
          body: "Not a limit on the relationship. A rate you can actually sustain.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not can't. Costs more than I've got right now.",
            "Pacing keeps me in it. Avoidance takes me out.",
            "Say I'm slowing. Don't just slow.",
          ],
        },
      ],
      portable: [
        "Not can't. Costs more than I've got right now.",
        "Pacing keeps me in it. Avoidance takes me out.",
        "Say I'm slowing. Don't just slow.",
      ],
      myPlaysTemplate: {
        when: "When closeness starts to feel like too much and nothing is wrong",
        move: "Set a rate I can sustain, and say that I'm doing it",
        lookingFor: "Which specific part is expensive, and what else is drawing on the same account",
        watchOut: "Slowing without saying so — that reads as disappearing",
        remember: "I can be close. It's costing more than I have right now.",
      },
      fidelity: {
        correct:
          "A sustainable rate is chosen and communicated, while remaining in contact.",
        misuse: [
          "Using the rate as cover for withdrawing entirely.",
          "Slowing without telling them.",
          "Treating the rate as permanent.",
        ],
        notMeaning:
          "It does not mean you lack the ability to be close, that slower is better, or that the other person should wait.",
      },
      supportSignposts: [
        {
          id: "signpost-c3-depleted",
          heading: "If everything costs this much",
          body:
            "If it isn't only closeness — if most things are currently costing more than you've got — that's worth talking to someone about. A GP or a therapist. Not because of anything to do with dating. Because running that low across the board is worth looking at on its own.",
        },
      ],
    },
  ],

  // ── §4 literature ──────────────────────────────────────────────
  literature: C3_LITERATURE,

  // ── §5 missions ────────────────────────────────────────────────
  missions: [
    {
      id: "mission-c3-gap",
      version: 1,
      playId: "before-you-go",
      title: "Hold one gap",
      instruction:
        "Next time you decide to end something, wait the gap you set before doing anything. Watch for the thing you named.",
      linkToOperation: "Delaying a pre-emptive exit and observing during the delay",
      attemptMeaning:
        "You held the gap. It doesn't mean you should stay, or that your read was wrong.",
      suitability:
        "For exits where nothing has actually happened. If you've been mistreated, don't wait — leave.",
      progression: [
        {
          id: "rung-c3-gap-2",
          instruction: "Tell them you're thinking about it, rather than only waiting.",
        },
      ],
    },
    {
      id: "mission-c3-true-thing",
      version: 1,
      playId: "one-true-thing",
      title: "Say a second one",
      instruction:
        "You said the first in the tool. Say another, to the same person, and compare what they did with each.",
      linkToOperation: "Graduated disclosure with response observation",
      attemptMeaning:
        "You said it. It doesn't mean they took it well, or that you should say more.",
      suitability:
        "Keep it small. If what you're carrying is heavy or from your history, that belongs somewhere it can be met properly.",
      progression: [
        {
          id: "rung-c3-true-thing-2",
          instruction: "Say one to a second person, and notice whether it is easier or harder.",
        },
      ],
    },
    {
      id: "mission-c3-ask",
      version: 1,
      playId: "just-ask",
      title: "Ask a second one",
      instruction:
        "You asked the first in the tool. Ask another \u2014 something you'd normally have inferred rather than checked.",
      linkToOperation: "Direct clarification in place of indirect testing",
      attemptMeaning:
        "You asked. It doesn't mean the answer is good news.",
      suitability:
        "For ordinary uncertainty. If you're afraid of how they'll react to being asked something straightforward, that's worth noticing separately.",
      progression: [
        {
          id: "rung-c3-ask-2",
          instruction: "Ask a follow-up in the same conversation, rather than saving it.",
        },
      ],
    },
    {
      id: "mission-c3-fit",
      version: 1,
      playId: "is-this-right-for-me",
      title: "Name the reason once, out loud",
      instruction:
        "Say your actual reason for staying to someone you trust — not to the person you're dating. Notice how it sounds outside your head.",
      linkToOperation: "Fit-based evaluation in place of default continuation",
      attemptMeaning:
        "You named it. It doesn't mean you've decided anything.",
      suitability:
        "If you don't have someone safe to say it to, write it and read it back. That counts.",
      progression: [
        {
          id: "rung-c3-fit-2",
          instruction: "Name one thing that would have to change, and by when.",
        },
      ],
    },
    {
      id: "mission-c3-rate",
      version: 1,
      playId: "when-closeness-costs",
      title: "Hold the rate for a week, and say you are",
      instruction:
        "Keep contact at the rate you set — and tell them you're doing it, in one sentence. Notice what changes.",
      linkToOperation: "Pacing involvement to available capacity while remaining in contact",
      attemptMeaning:
        "You paced it and said so. Going over or under is information, not failure.",
      suitability:
        "If holding the rate means disappearing rather than slowing, that's the other pattern. Before You Go is the tool for that.",
      progression: [
        {
          id: "rung-c3-rate-2",
          instruction: "Revisit the rate when things ease, rather than leaving it where it is.",
        },
      ],
    },
  ],

  // ── §6 use reviews ─────────────────────────────────────────────
  useReviews: [
    {
      id: "review-c3-gap",
      version: 1,
      playId: "before-you-go",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Held the gap",
          "Named something specific to watch for",
          "Said I was thinking about it",
          "Ended it anyway",
        ],
      },
      performedOperation: {
        label: "Did you hold the gap before acting?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Whether it was about them or about everyone",
          "That the urge to go shifts on its own",
          "That nothing had actually happened",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Waiting was harder than leaving",
          "I used the gap to build the case",
          "I couldn't tell if it was them or the pattern",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c3-true-thing",
      version: 1,
      playId: "one-true-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said the true thing",
          "Kept it small",
          "Watched what they did with it",
          "Smoothed it over instead",
        ],
      },
      performedOperation: {
        label: "Did you say it, and watch rather than assume?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What they actually did with it",
          "That small was survivable",
          "How much I usually edit",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't find one small enough",
          "I said it and immediately took it back",
          "Their reaction confirmed what I feared",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c3-ask",
      version: 1,
      playId: "just-ask",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked directly",
          "Kept it to one question",
          "Took the answer at face value",
          "Went sideways instead",
        ],
      },
      performedOperation: {
        label: "Did you ask directly rather than test?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I could just ask",
          "What they actually think",
          "How much I'd been inferring",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I asked and didn't believe the answer",
          "The question came out vague",
          "I couldn't bring myself to ask",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c3-fit",
      version: 1,
      playId: "is-this-right-for-me",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named the actual reason",
          "Separated what works from what doesn't",
          "Said it out loud to someone",
          "Talked myself round again",
        ],
      },
      performedOperation: {
        label: "Did you evaluate fit rather than build a case?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That my reason was about not leaving",
          "What I actually need",
          "That nothing's wrong with them, it just doesn't fit",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Knowing didn't change anything",
          "It turned into a case against them",
          "I couldn't say it out loud",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c3-rate",
      version: 1,
      playId: "when-closeness-costs",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Held the rate",
          "Told them I was slowing",
          "Stayed in contact",
          "Went quiet instead",
        ],
      },
      performedOperation: {
        label: "Did you pace it and say so?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Which part is actually expensive",
          "What else is drawing on the same account",
          "That slower still counts as in",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I slowed without saying so",
          "Slower still felt like too much",
          "They took it as me pulling away",
          "Nothing stuck",
        ],
      },
    },
  ],

  // §7 simulations — INTENTIONALLY ABSENT. §0 decision: Plays-only.
};
