/**
 * Cluster 23 — "Fear of Making the Wrong Choice"
 * The Relationship Playbook™ · Making Confident Relationship Decisions
 *
 * Track: Exclusivity (10) + Recovery (11). Core Need: TO TRUST MYSELF.
 * Plays-only.
 *
 * ⚠ TWO HALVES THAT BELONG TOGETHER. Perfectionism about the next decision and
 *   shame about the last one are the same mechanism in both directions: the
 *   shame of having got it wrong is what makes getting it right compulsory.
 *   Working only on the forwards half doesn't hold.
 *
 * ⚠ TEN STATEMENTS ROUTED OUT. The Expectations block is substantially Cluster
 *   25's central argument. `rec-c23-expectations` routes there.
 *
 * ⚠ SUBTITLE UNDERSELLS IT. The canonical subtitle covers the perfectionism
 *   half only. The shame half is larger and heavier. Flagged, not changed.
 *
 * ⚠ THE SHAME IS NOT ARGUED WITH. "I feel like I failed" is not corrected by
 *   being told it isn't true — that adds a second layer about being
 *   unreasonable. What's workable is what the hiding costs.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   the-standard      → Self-Compassion
 *   waiting-to-be-sure → Uncertainty Navigation · Self-Trust
 *   telling-one-person → Support-Seeking Communication · Self-Compassion
 *
 * ⚠ CLAIM SCOPE. May claim: notice what the standard costs; act without the
 *   certainty; tell one person one true thing. MUST NOT CLAIM: that you won't
 *   choose wrong again, that the shame is unwarranted, that telling someone
 *   helps, or that readiness arrives.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C23_LITERATURE } from "./making-confident-decisions-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const MAKING_CONFIDENT_DECISIONS: PlaybookContent = {
  playbookKey: "making-confident-decisions",
  playbookVersion: 1,
  displayName: "Making Confident Relationship Decisions",

  opening: {
    title: "Two things that look separate and aren't",
    body: [
      "You feel the next decision has to be right. And you carry a quiet shame about the last one.",
      "They're the same thing pointed two ways. Looking back: I got it wrong, and that says something about me. Looking ahead: so this one has to be right, and I can't move until I'm sure.",
      "That's why being told to take a chance doesn't help much. Not while getting it wrong still means what it means to you now.",
    ],
    manifestations: [
      "I feel like I have to get relationships right.",
      "I keep waiting until I'm ready.",
      "I'm embarrassed by my relationship history.",
      "I'm tired of carrying this alone.",
    ],
    cta: "Start with what the standard costs",
  },

  recognitionCards: [
    {
      id: "rec-c23-too-damaged",
      role: "validate",
      pathwayPlayId: null,
      headline: "I'm afraid I'm too damaged.",
      validationCopy:
        "It's the most common thing people here don't say out loud, and it sits right between the two halves of what you're carrying. It's a fear, not a fact about you — it comes with the shame, not from any evidence. And it tends to be loudest in the people who've thought hardest about getting it right.",
      secondaryExamples: [
        "I feel like I failed.",
        "I expect too much from myself.",
        "I don't want people to pity me.",
      ],
    },
    {
      id: "rec-c23-expectations",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I thought love would be enough, and it wasn't.",
      validationCopy:
        "That's a real, specific thing to notice — that relationships take skills nobody taught you, and that chemistry and commitment don't give you those skills. It has its own Playbook, and the tools there are built around exactly that. This one is about the fear of choosing wrong and the shame of having done. Close, but different. Look for the one about building from the ground up.",
      secondaryExamples: [
        "I thought chemistry was enough.",
        "I didn't realize love required so much intentionality.",
        "I thought once I found the right person everything would click.",
      ],
    },
    {
      id: "rec-c23-standard",
      role: "route",
      pathwayPlayId: "the-standard",
      headline: "I have to get relationships right.",
      explanation:
        "The standard is unusually high, and you apply it to just one area. Most people here are far easier on themselves at work.",
      secondaryExamples: [
        "I expect too much from myself.",
        "I expect too much from other people.",
        "I don't want to make another mistake.",
      ],
    },
    {
      id: "rec-c23-waiting",
      role: "route",
      pathwayPlayId: "waiting-to-be-sure",
      headline: "I keep waiting until I'm ready.",
      explanation:
        "\u201cI don't know if I'll ever feel ready\u201d answers that. Waiting for something that may never come isn't a plan, even though it feels like one.",
      secondaryExamples: [
        "I overthink every decision.",
        "I don't know when good is good enough.",
        "I keep trying to find certainty before I move forward.",
      ],
    },
    {
      id: "rec-c23-hiding",
      role: "route",
      pathwayPlayId: "telling-one-person",
      headline: "I pretend everything is okay.",
      explanation:
        "\u201cI'm tired of carrying this alone\u201d is the tell. Nobody says that about a load they're happy to carry.",
      secondaryExamples: [
        "I don't like telling people what happened.",
        "I don't like asking for help.",
        "I don't want to admit how unhappy I am.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────── Play 1 · Self-Compassion ──
    {
      playId: "the-standard",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Standard",
      positioning: "For the line you hold yourself to here, and nowhere else.",
      recognitionGate: {
        prompt: "Do you hold yourself to a higher standard in relationships than anywhere else?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "The standard is unusually high, and you usually apply it to one area. Most people here are far easier on themselves at work.",
            "There's a reason. A bad decision at work is just a bad decision. A bad relationship decision gets read as a fact about your judgement, and then about you.",
            "That's where the demand comes from. If getting it wrong means something about who you are, then getting it right isn't optional — it's a defence.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cI expect too much from other people\u201d belongs here too. It's usually the same standard turned outward — people who hold themselves to an impossible line rarely hold others to a gentle one.",
            "And \u201cwhen is good good enough\u201d has no outside answer. Sometimes it means: is this relationship good enough? You can only answer that against your own terms. More often it means: am I allowed to stop picking it apart? More information won't settle that.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these would you accept from someone else?",
          situation:
            "A close friend describes a relationship decision they made that didn't work out. You're listening to how they talk about themselves.",
          buckets: [
            { id: "accept", label: "Fine, from a friend" },
            { id: "not-me", label: "Wouldn't accept it from myself" },
          ],
          items: [
            {
              id: "sort-c23-didnt-know",
              text: "\u201cI didn't know then what I know now\u201d",
              correctBucket: "accept",
              correction:
                "Easy to give a friend. Worth noticing whether you give it to yourself.",
            },
            {
              id: "sort-c23-should-have-seen",
              text: "\u201cI should have seen it\u201d",
              correctBucket: "not-me",
              correction:
                "Most people would argue with a friend who said this. They don't argue with themselves.",
            },
            {
              id: "sort-c23-good-reasons",
              text: "\u201cI had good reasons at the time\u201d",
              correctBucket: "accept",
              correction: "We give this to others easily. We rarely claim it for ourselves.",
            },
            {
              id: "sort-c23-wasted",
              text: "\u201cI wasted years\u201d",
              correctBucket: "not-me",
              correction: "You'd push back on a friend. The same case applies to you.",
            },
            {
              id: "sort-c23-was-loved",
              text: "\u201cI was in love, and that made it harder to see\u201d",
              correctBucket: "accept",
              correction: "Clearly fair when someone else says it.",
            },
            {
              id: "sort-c23-failed",
              text: "\u201cI failed\u201d",
              correctBucket: "not-me",
              correction:
                "Almost nobody would let a friend describe a relationship that ended this way.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "This isn't about being kinder to yourself. It's a comparison.",
          fields: [
            {
              id: "my-standard",
              label: "What do you require of yourself here?",
              input: "text",
              placeholder: "The real line, in plain words.",
            },
            {
              id: "friend-standard",
              label: "What would you require of a close friend in the same position?",
              input: "text",
              placeholder: "Honestly. Most people find the gap is large.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is there a gap between those two?",
          enoughLabel: "Not really — they're similar",
          needMoreLabel: "Yes, a large one",
          needMoreIntro:
            "That gap is the standard doing its work. It isn't a sign of higher values — it's a defence, and it costs a lot to keep up.",
          needToKnowLabel: "What the standard is protecting against",
          observableLabel: "Something I'd notice if it eased",
        },
        {
          kind: "output",
          heading: "My standard, and the one I'd offer",
          body:
            "This isn't telling you to lower it. It's a measure of the gap.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A bad decision here gets read as a verdict, not just an outcome.",
            "Getting it right isn't optional. It's a defence.",
            "The standard I'd offer a friend is the honest one.",
          ],
        },
      ],
      portable: [
        "A bad decision here gets read as a verdict, not just an outcome.",
        "Getting it right isn't optional. It's a defence.",
        "The standard I'd offer a friend is the honest one.",
      ],
      myPlaysTemplate: {
        when: "When I'm holding myself to a line I'd never apply to anyone else",
        move: "Compare what I require of myself with what I'd require of a friend",
        lookingFor: "The size of the gap between them",
        watchOut: "Turning this into another thing I'm failing at",
        remember: "The standard is a defence against what getting it wrong would mean.",
      },
      fidelity: {
        correct:
          "The standard applied to the self is compared with the standard that would be applied to another person, and the gap named.",
        misuse: [
          "Using it as another performance to get right.",
          "Concluding the standard is a virtue.",
          "Lowering the standard as an instruction rather than noticing the gap.",
        ],
        notMeaning:
          "It does not mean your judgement is fine, that the standard will ease, or that self-compassion follows from noticing.",
      },
    },

    // ────────────── Play 2 · Uncertainty Navigation / Self-Trust ──
    {
      playId: "waiting-to-be-sure",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Waiting to Be Sure",
      positioning: "For the certainty that isn't coming.",
      recognitionGate: {
        prompt: "Are you waiting to feel certain before you move?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI keep waiting until I'm ready.\u201d \u201cI don't know if I'll ever feel ready.\u201d",
            "The second sentence answers the first. If you don't know whether it'll ever come, then waiting for it isn't a plan — it's a wait with no end that feels like one.",
          ],
        },
        {
          kind: "learn",
          body: [
            "“Ready” could mean two things. Practically ready — your circumstances allow it. You can check that, and sometimes the honest answer really is no.",
            "Or feeling ready — the doubt is gone. That kind doesn't come from waiting, because doubt about something uncertain is an accurate response, not a roadblock.",
            "So the certainty isn't there to be had. And not having it doesn't tell you whether to go ahead. That's unsatisfying, and it's honest.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What are you waiting on, specifically?",
          fields: [
            {
              id: "waiting-for",
              label: "What would have to be true before you'd move?",
              input: "text",
              placeholder: "As precisely as you can put it.",
            },
            {
              id: "which-kind",
              label: "Is that practical, or is it a feeling?",
              input: "chips",
              suggestions: [
                "Practical \u2014 circumstances",
                "A feeling of certainty",
                "Both, tangled",
                "I can't tell",
              ],
            },
            {
              id: "how-long",
              label: "How long have you been waiting?",
              input: "text",
              placeholder: "And has anything changed in that time?",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "Not a decision. A time to look again, picked while you're calm.",
          conditionLabel: "The date I'll look at this again",
          thenLabel: "And what I'll decide on, when I do",
          actions: [
            "What I'd do if certainty were never going to come",
            "Whether anything has actually changed since I started waiting",
            "Just the practical question, with the feeling set aside",
            "Whether waiting has cost more than deciding would",
          ],
          controlCheck:
            "Not having certainty doesn't tell you whether to go ahead \\u2014 doubt about something uncertain is an accurate response, not a roadblock.",
        },
        {
          kind: "output",
          heading: "What I'm waiting on",
          body:
            "Not deciding is also a decision. It costs the same time \u2014 and leaves you with less information at the end.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cI don't know if I'll ever feel ready\u201d answers \u201cI'm waiting until I'm ready.\u201d",
            "Doubt about something uncertain is accurate, not an obstacle.",
            "Waiting is also a decision, and it's the one I'm making right now.",
          ],
        },
      ],
      portable: [
        "\u201cI don't know if I'll ever feel ready\u201d answers \u201cI'm waiting until I'm ready.\u201d",
        "Doubt about something uncertain is accurate, not an obstacle.",
        "Waiting is also a decision, and it's the one I'm making right now.",
      ],
      myPlaysTemplate: {
        when: "When I'm waiting to feel certain before I move",
        move: "Separate practical readiness from the feeling, and set a date to look",
        lookingFor: "Whether anything has changed in the time I've been waiting",
        watchOut: "Moving the date when it arrives",
        remember: "There's no risk-free option. Waiting has a cost and I'm paying it.",
      },
      fidelity: {
        correct:
          "Practical readiness is distinguished from felt certainty, and a review point is set without a decision attached.",
        misuse: [
          "Setting a date and moving it.",
          "Using it to force a decision you don't want to make.",
          "Treating the absence of doubt as the target.",
        ],
        notMeaning:
          "It does not mean you should proceed, that certainty is unnecessary, or that the doubt is unfounded.",
      },
    },

    // ────── Play 3 · Support-Seeking Communication / Self-Compassion ──
    {
      playId: "telling-one-person",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Telling One Person",
      positioning:
        "For the thing nobody knows. You work out what to say and who to tell — then you say it.",
      recognitionGate: {
        prompt: "Is there something about your situation that nobody actually knows?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI'm tired of carrying this alone\u201d is the tell. Nobody says that about a load they're happy to carry.",
            "Hiding buys you something real. No one's pity, no one's opinion, no one's version of what you should have done.",
            "It costs you something too. Everyone around you is going on the pretend version. So nothing they offer can be aimed at what's really happening.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The version that works is smaller than people think. Not telling everyone. Not the full story. Not an announcement. One person, one true thing, nothing attached.",
            "Who you pick matters more than what you say. Pick someone who won't jump to telling you what to do — advice is what most people reach for, and it's rarely what's needed. And someone who won't pass it on. The fear of it getting around is often the real obstacle.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "The longer the pretend version has been running, the more this feels like something you'd have to announce, not just mention.",
            "It doesn't. One sentence, in an everyday conversation, is the whole thing.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One person, one thing.",
          fields: [
            {
              id: "who",
              label: "Who wouldn't tell you what to do, and wouldn't pass it on?",
              input: "text",
              placeholder: "One name. It doesn't have to be the closest person.",
            },
            {
              id: "the-one-thing",
              label: "What's the one true thing?",
              input: "text",
              placeholder:
                "Not the whole story. The one sentence you've been holding back.",
            },
            {
              id: "whats-stopping",
              label: "What's the real obstacle?",
              input: "chips",
              suggestions: [
                "They'd pity me",
                "It would get around",
                "They'd tell me what to do",
                "Saying it makes it real",
                "I don't want to be a burden",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The one thing, in your words",
          helper:
            "One sentence. No build-up, no request attached. You might start with \u201cThere's something I haven't told anyone\u201d or \u201cCan I say something? I don't need you to do anything about it.\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "An ordinary conversation with the person you picked \u2014 not a planned sit-down, and not at the end of an evening.",
          doThis:
            "Say the one thing. Don't build up to it. Don't give the full story. Don't apologise for saying it. Then let them respond however they respond.",
          safetyNote:
            "If the thing you're carrying involves being afraid of someone, or being harmed, that needs more than one friend \u2014 a GP, a therapist, or a domestic abuse service. You don't have to be sure it's serious to ask.",
        },
        {
          kind: "output",
          heading: "What I said, and to whom",
          body:
            "One person now knows the real version. That's the whole operation.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Everyone is going on the pretend version.",
            "One person, one thing, nothing attached.",
            "Who I pick matters more than what I say.",
          ],
        },
      ],
      portable: [
        "Everyone is going on the pretend version.",
        "One person, one thing, nothing attached.",
        "Who I pick matters more than what I say.",
      ],
      myPlaysTemplate: {
        when: "When nobody actually knows what's going on",
        move: "Tell one chosen person one true thing",
        lookingFor: "Whether it was smaller to say than it was to carry",
        watchOut: "Giving the full account, or picking someone who'll advise",
        remember: "Not wanting to ask is different from not wanting help.",
      },
      fidelity: {
        correct:
          "One specific true statement is made to one deliberately chosen person, without a full account or a request attached.",
        misuse: [
          "Telling someone who will immediately advise.",
          "Giving the whole history rather than one thing.",
          "Testing the principle on the hardest possible person.",
        ],
        notMeaning:
          "It does not mean they'll respond well, that telling helps, or that you owe anyone the rest of it.",
      },
      supportSignposts: [
        {
          id: "signpost-c23-alone",
          heading: "If there's no one",
          body:
            "Some people work through this and find there isn't anyone \u2014 the relationship took the friendships with it, or there was never much of a network. That's common, and it isn't a failure of yours. A therapist can be a good first person to tell, exactly because there's no history to manage and nothing gets passed on. So can a mental-health support line, or a bereavement line if the loss is what's heaviest \u2014 whichever is easier to start with.",
        },
      ],
    },
  ],

  literature: C23_LITERATURE,

  missions: [
    {
      id: "mission-c23-standard",
      version: 1,
      playId: "the-standard",
      title: "Catch it once, in the moment",
      instruction:
        "Next time you're hard on yourself about this, notice it and ask what you'd say to a friend. Don't try to feel differently.",
      linkToOperation: "Comparing the self-standard against the standard offered to others",
      attemptMeaning:
        "You noticed. Feeling differently wasn't the ask.",
      suitability:
        "If this turns into another thing to get right, stop \u2014 that's the standard showing up again in a new place.",
      progression: [
        {
          id: "rung-c23-standard-2",
          instruction: "Say the friend version out loud, even if you don't believe it.",
        },
      ],
    },
    {
      id: "mission-c23-waiting",
      version: 1,
      playId: "waiting-to-be-sure",
      title: "Keep the date",
      instruction:
        "When your date arrives, look at what you said you'd look at. Don't move it. Note what you found either way.",
      linkToOperation: "Bounded review in place of open-ended waiting",
      attemptMeaning:
        "You looked on the day. Moving the date is information too.",
      suitability:
        "If you move it more than once, that pattern tells you more than the next date will.",
      progression: [
        {
          id: "rung-c23-waiting-2",
          instruction: "Decide one small thing without waiting for certainty first.",
        },
      ],
    },
    {
      id: "mission-c23-tell",
      version: 1,
      playId: "telling-one-person",
      title: "Say a second thing, later",
      instruction:
        "You told one person one thing. A few weeks on, tell them one more \u2014 or tell a second person the first.",
      linkToOperation: "Seeking support by disclosing accurately",
      attemptMeaning:
        "You said it. How they took it is separate and is also information.",
      suitability:
        "If the first went badly, that's about them, not about the idea. Choose differently instead of writing it off.",
      progression: [
        {
          id: "rung-c23-tell-2",
          instruction: "Ask for one specific thing, rather than only telling.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c23-standard",
      version: 1,
      playId: "the-standard",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named my actual standard",
          "Named what I'd offer a friend",
          "Noticed the gap",
          "Turned it into another test",
        ],
      },
      performedOperation: {
        label: "Did you compare your standard with the one you'd offer someone else?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How large the gap is",
          "That the standard is a defence",
          "That I apply it here and nowhere else",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I think my standard is correct",
          "Noticing the gap didn't change it",
          "It became another thing to get right",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c23-waiting",
      version: 1,
      playId: "waiting-to-be-sure",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated practical from felt readiness",
          "Set a date",
          "Looked on the day",
          "Moved the date",
        ],
      },
      performedOperation: {
        label: "Did you distinguish practical readiness from certainty?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's the feeling I'm waiting on",
          "That nothing has changed while I waited",
          "How long it's actually been",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I moved the date",
          "The practical answer is genuinely no",
          "Knowing didn't make it easier to move",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c23-tell",
      version: 1,
      playId: "telling-one-person",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Told one person one thing",
          "Chose carefully",
          "Didn't give the whole account",
          "Kept pretending",
        ],
      },
      performedOperation: {
        label: "Did you tell one chosen person one true thing?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it was smaller to say than to carry",
          "That they took it fine",
          "How long I'd been managing it alone",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't get it out",
          "They immediately told me what to do",
          "There wasn't anyone to tell",
          "Nothing stuck",
        ],
      },
    },
  ],
};
