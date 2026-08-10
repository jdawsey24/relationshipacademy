/**
 * ADD-ON — "Losing a Partner"
 * Derived from Cluster 20: Grief & Loss (10) + Widowhood (10) = 20 statements.
 *
 * Track: Recovery. Task = Healing. Core Need: TO HEAL.
 * Three Plays, seven literature entries — add-on scale.
 *
 * ⚠ ADD-ON, NOT A PLAYBOOK. Structurally identical to `PlaybookContent`; the
 *   distinction is how it is reached and labelled. `playbookKey` carries the
 *   `addon-` prefix per the naming convention. No schema change required.
 *
 * ⚠⚠ ROUTING DEPENDENCY. `finding-yourself-after-everything-changed` routes bereaved readers here
 *   via `rec-c20-bereaved`. **`letting-go-without-losing-what-it-meant` (Cluster 12) STILL NEEDS THE SAME
 *   ROUTE ADDED** — its tools assume someone chose to leave, and a bereaved
 *   reader landing there would be badly served.
 *
 * ⚠ NEVER SUGGEST MOVING ON. The organising idea is that moving forward feels
 *   like betrayal; content encouraging it confirms the fear. Nothing may imply
 *   the deceased is an obstacle, that the ring should come off, that grief
 *   should reduce, or that companionship requires letting go of anything.
 *
 * ⚠ NOTHING ABOUT WHAT THE DEAD WOULD WANT. "They'd want you to be happy" is
 *   explicitly refused in `lit-bereave-guilt` — it is not a claim anyone is
 *   entitled to make on the reader's behalf.
 *
 * ⚠ NO TIMELINE IN EITHER DIRECTION. "Take all the time you need" is also a
 *   claim and can read as permission to stop.
 *
 * ⚠ CLAIM SCOPE. May claim: notice what the guilt assumes; have a sentence
 *   ready; separate wanting company from replacing someone. MUST NOT CLAIM:
 *   that grief lessens, that you should date, that they'd want anything, or
 *   that moving forward is possible or necessary.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { ADDON_BEREAVEMENT_LITERATURE } from "./losing-a-partner-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const ADDON_LOSING_A_PARTNER: PlaybookContent = {
  playbookKey: "addon-losing-a-partner",
  playbookVersion: 1,
  displayName: "Losing a Partner",

  opening: {
    title: "The usual material doesn't fit this",
    body: [
      "Almost everything written about relationships ending is about ones that ended by choice. There's no decision to look at here. There's no one to be angry with in the usual way. And none of the questions about what went wrong fit.",
      "The question underneath most of this is different. It's this: how do I keep living without it meaning I've left them behind?",
      "Nothing here will suggest you move on, and nothing puts a time limit on anything — in either direction.",
    ],
    manifestations: [
      "I feel guilty for laughing again.",
      "I still think of us as \u201cwe.\u201d",
      "Dating again feels like I'm betraying them.",
      "No one understands this kind of grief.",
    ],
    cta: "Start with what the guilt assumes",
  },

  recognitionCards: [
    {
      id: "rec-bereave-nobody-understands",
      role: "validate",
      pathwayPlayId: null,
      headline: "No one understands this kind of grief.",
      validationCopy:
        "That's mostly true. It's not a feeling that needs correcting. The lines people have ready are built for divorce — you'll be better off, you'll find someone, it takes about a year — and none of them are aimed at what's happened. So people who really care say things that land as if they don't understand. In a specific way, they don't.",
      secondaryExamples: [
        "I don't know who understands this kind of loss.",
        "My world changed overnight.",
        "My grief changes from day to day.",
      ],
    },
    {
      id: "rec-bereave-guilt",
      role: "route",
      pathwayPlayId: "allowed-to-be-all-right",
      headline: "I feel guilty for laughing again.",
      explanation:
        "Grief is one of the few kinds of contact you have left. So anything that eases it can feel like a second loss, not a relief.",
      secondaryExamples: [
        "I don't know if I'm allowed to be happy.",
        "I'm afraid moving forward means leaving them behind.",
        "I feel guilty smiling with someone else.",
      ],
    },
    {
      id: "rec-bereave-still-we",
      role: "route",
      pathwayPlayId: "what-do-i-say",
      headline: "I don't know how to introduce myself anymore.",
      explanation:
        "These are the small ones, and they come several times a day. What to say can be worked out without working out what's true.",
      secondaryExamples: [
        "I still think of us as \u201cwe.\u201d",
        "I still wear my ring.",
        "I don't know how to stop feeling married.",
      ],
    },
    {
      id: "rec-bereave-companionship",
      role: "route",
      pathwayPlayId: "company-not-replacement",
      headline: "I want companionship, but I don't know if my heart is ready.",
      explanation:
        "\u201cReplace\u201d assumes there's only one slot. Most people who do this find it doesn't work that way — the old place isn't emptied out.",
      secondaryExamples: [
        "Dating again feels like I'm betraying them.",
        "I don't want to replace them.",
        "I don't know how to love someone new while honouring my past.",
      ],
    },
  ],

  plays: [
    // ─────────── Play 1 · Grief Integration / Self-Compassion ──
    {
      playId: "allowed-to-be-all-right",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Allowed to Be All Right",
      positioning: "For the guilt that shows up when things are briefly okay.",
      recognitionGate: {
        prompt: "Does feeling better bring something that feels like betrayal?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Grief is one of the few kinds of contact you have left. While it's sharp, they're still here in your day.",
            "So anything that eases it can feel like a second loss — not a relief but one more step away from them.",
            "That's why an afternoon of feeling all right can bring something that feels like betrayal. It isn't irrational. And telling it that it is doesn't make it go away.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It also explains why the usual comfort lands badly. \u201cThey'd want you to be happy\u201d misses the point. The hard part isn't whether you're allowed to be happy. It's that feeling better feels like moving away from them.",
            "We don't know what they'd have wanted and neither does anyone else. Nothing here will tell you what the dead would think.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Looking at this straight on is uncomfortable. Part of what makes the guilt bearable is not looking at it too closely.",
            "Nothing here asks you to feel less guilty. Only to notice what it's assuming.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "When does it arrive?",
          fields: [
            {
              id: "when-guilt",
              label: "What sets it off?",
              input: "chips",
              suggestions: [
                "Laughing at something",
                "A good day I didn't expect",
                "Enjoying someone's company",
                "Going a while without thinking of them",
                "Making a plan for the future",
              ],
            },
            {
              id: "what-it-says",
              label: "What does the guilt seem to be saying?",
              input: "text",
              placeholder:
                "Put it in words. It's usually something about leaving or forgetting.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Does feeling better actually put more distance between you \u2014 or does it just feel that way?",
          enoughLabel: "It just feels that way",
          needMoreLabel: "I'm not sure",
          needMoreIntro:
            "Not sure is a fair answer, and it doesn't need solving today. What's worth noticing is that the guilt rests on it \u2014 and it's rarely been looked at.",
          needToKnowLabel: "What would still be true of them on a good day",
          observableLabel: "Something I'd still do or still keep",
        },
        {
          kind: "output",
          heading: "What the guilt assumes",
          body:
            "Not an instruction to feel less of it. A look at what it rests on.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Grief is contact. That's why less of it feels like more distance.",
            "\u201cThey'd want you to be happy\u201d misses the point.",
            "Noticing what the guilt assumes isn't the same as arguing with it.",
          ],
        },
      ],
      portable: [
        "Grief is contact. That's why less of it feels like more distance.",
        "\u201cThey'd want you to be happy\u201d misses the point.",
        "Noticing what the guilt assumes isn't the same as arguing with it.",
      ],
      myPlaysTemplate: {
        when: "When something is briefly okay and the guilt shows up",
        move: "Notice what the guilt is assuming about distance",
        lookingFor: "Whether feeling better actually changes anything about them",
        watchOut: "Trying to talk myself out of it — that isn't what this is",
        remember: "Nobody knows what they'd have wanted. Not me, and not anyone offering.",
      },
      fidelity: {
        correct:
          "The assumption underneath the guilt is named and looked at, without any attempt to reduce or argue with the guilt itself.",
        misuse: [
          "Using it to talk yourself out of grieving.",
          "Deciding you should be further along.",
          "Deciding what they would have wanted.",
        ],
        notMeaning:
          "It does not mean the guilt is unreasonable, that it will ease, or that you should feel differently.",
      },
    },

    // ──── Play 2 · Identity Reconstruction / Narrative Integration ──
    {
      playId: "what-do-i-say",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Do I Say",
      positioning:
        "For the daily small ambush. You choose the sentence — then you use it.",
      recognitionGate: {
        prompt: "Do ordinary questions about your situation catch you out?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't know how to introduce myself anymore.\u201d \u201cI still think of us as we.\u201d \u201cI don't know how to stop feeling married.\u201d",
            "Two different things are tangled here, and only one of them needs solving.",
            "What's true — whether you're still married, still a we, still someone's. Those don't have clean answers, and they don't have to be settled.",
            "What to say — what comes out of your mouth when someone asks at a party. That's practical, and it has practical answers.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The second can be settled without settling the first. Having a sentence ready takes away a small daily ambush, and it commits you to nothing.",
            "It also doesn't have to be the same sentence everywhere. Most people end up with two or three — one for strangers, one for people who'll ask a follow-up, one for people who already know.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Where does it catch you? These are the moments worth having something ready for.",
          fields: [
            {
              id: "where",
              label: "Where does the question come up?",
              input: "chips",
              suggestions: [
                "Meeting new people",
                "Forms and paperwork",
                "\u201cAre you married?\u201d",
                "Talking about plans \u2014 \u201cwe\u201d slips out",
                "People who don't know yet",
              ],
            },
            {
              id: "what-happens-now",
              label: "What happens currently?",
              input: "text",
              placeholder: "What you say, or what you avoid saying.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The sentence you'd want ready",
          helper:
            "Short, and only as much as you want to give. You might use \u201cMy husband died\u201d, or \u201cI was married \u2014 he died two years ago\u201d, or something that doesn't mention it at all. None of those is more correct than the others.",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "The next time the question comes up with someone who doesn't know.",
          doThis:
            "Use the sentence. Say it and stop — you don't owe a follow-up, and you don't have to manage their reaction to it.",
          safetyNote:
            "If saying it out loud is more than you can do right now, that's a fair place to be — not a stage you're failing to reach. Having the sentence written down is worth something on its own.",
        },
        {
          kind: "output",
          heading: "My sentence",
          body:
            "Settles what to say. Doesn't settle what's true, and doesn't have to.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "What to say can be settled without settling what's true.",
            "Say it and stop. I don't have to manage their reaction.",
            "Two or three sentences, for different people. Not one.",
          ],
        },
      ],
      portable: [
        "What to say can be settled without settling what's true.",
        "Say it and stop. I don't have to manage their reaction.",
        "Two or three sentences, for different people. Not one.",
      ],
      myPlaysTemplate: {
        when: "When an ordinary question about my situation catches me out",
        move: "Have a sentence ready, and use it",
        lookingFor: "Whether having it ready removes the ambush",
        watchOut: "Thinking the sentence has to settle what's actually true",
        remember: "Nothing here has a view about the ring. There isn't a correct handling.",
      },
      fidelity: {
        correct:
          "A prepared form of words is chosen and used, separately from any resolution of what the reader considers true.",
        misuse: [
          "Treating the sentence as a statement about where you are in grieving.",
          "Choosing one that gives more than you wanted to give.",
          "Using it as a test of whether you've moved on.",
        ],
        notMeaning:
          "It does not mean you're no longer married, that you've accepted anything, or that the question stops being difficult.",
      },
    },

    // ────── Play 3 · Grief Integration / Uncertainty Navigation ──
    {
      playId: "company-not-replacement",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Company, Not Replacement",
      positioning: "For wanting someone without it meaning you've replaced anyone.",
      recognitionGate: {
        prompt: "Do you want company and find the wanting itself feels like a betrayal?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't want to replace them.\u201d That one sentence holds the whole problem. And it rests on an assumption worth a look.",
            "Replacing assumes there's a single slot — that a new person would take the place the last one had, and so push them out.",
            "Most people who do this find it doesn't work like that. The new relationship has its own place, and the old one isn't emptied out. People hold both all the time.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cHow do I love someone new while honouring my past\u201d is the right question, and the answer most people land on is a plain one: by not hiding it.",
            "Relationships that start out with the old one out in the open tend to hold both more easily than ones where it's worked around.",
            "That turns readiness into something you can check: not whether the ache is gone, but whether you could talk about them.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "None of this is an argument for dating. Wanting company and not wanting to date both make sense.",
          fields: [
            {
              id: "what-i-want",
              label: "What is it you actually want?",
              input: "chips",
              suggestions: [
                "Someone to have dinner with",
                "Not being alone in the evenings",
                "Being touched",
                "Someone who knows how my day went",
                "I don't know yet",
                "Nothing, for now",
              ],
            },
            {
              id: "could-i-talk",
              label: "Could you talk about them, to someone new? Honestly.",
              input: "chips",
              suggestions: [
                "Yes",
                "Some of it",
                "No \u2014 I'd manage around it",
                "I haven't thought about it",
              ],
            },
            {
              id: "company-or-ache",
              label:
                "Is it company you want, or for the ache to stop? Both are fair.",
              input: "text",
              placeholder: "Honestly. They lead to different decisions.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Does wanting company require anything of them?",
          enoughLabel: "No \u2014 it's separate",
          needMoreLabel: "It feels like it does",
          needMoreIntro:
            "That's the assumption worth sitting with. If a new relationship would have to take their place, then wanting one is a betrayal. If it wouldn't, it isn't \u2014 and most people find the second is what actually happens.",
          needToKnowLabel: "What I'd want to keep, regardless",
          observableLabel: "Something that would stay true either way",
        },
        {
          kind: "output",
          heading: "What I want, and what it would cost",
          body:
            "Missing someone forever can go along with a lot in your life — including another relationship.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Replacing assumes there's a single slot. There isn't one.",
            "Readiness isn't the ache stopping. It's whether I could talk about them.",
            "Wanting company and not wanting to date both make sense.",
          ],
        },
      ],
      portable: [
        "Replacing assumes there's a single slot. There isn't one.",
        "Readiness isn't the ache stopping. It's whether I could talk about them.",
        "Wanting company and not wanting to date both make sense.",
      ],
      myPlaysTemplate: {
        when: "When I want company and the wanting feels like a betrayal",
        move: "Check whether wanting someone new would actually require anything of them",
        lookingFor: "Whether I could talk about them to someone new",
        watchOut: "Treating this as a nudge toward dating — it isn't one",
        remember: "Missing them forever can go along with a great deal.",
      },
      fidelity: {
        correct:
          "The replacement assumption is examined, and readiness is assessed by whether the previous relationship could be spoken about rather than by whether grief has reduced.",
        misuse: [
          "Using it as encouragement to date before you want to.",
          "Treating an inability to talk about them as a failure.",
          "Concluding that wanting company means you're finished grieving.",
        ],
        notMeaning:
          "It does not mean you should date, that you're ready, or that a new relationship would hold both.",
      },
    },
  ],

  literature: ADDON_BEREAVEMENT_LITERATURE,

  missions: [
    {
      id: "mission-bereave-guilt",
      version: 1,
      playId: "allowed-to-be-all-right",
      title: "Notice it once, without arguing",
      instruction:
        "Next time the guilt arrives after a good moment, notice what it says. Don't try to talk yourself out of it.",
      linkToOperation: "Observing the assumption underneath survivor guilt",
      attemptMeaning:
        "You noticed. Feeling differently was never the ask.",
      suitability:
        "If looking at it makes things much worse instead of clearer, leave it. This one is better with someone alongside you.",
      progression: [
        {
          id: "rung-bereave-guilt-2",
          instruction: "Say what it assumes out loud to one person.",
        },
      ],
    },
    {
      id: "mission-bereave-say",
      version: 1,
      playId: "what-do-i-say",
      title: "Use it a second time",
      instruction:
        "You used it once. Use it again, with someone different \u2014 and notice whether having it ready changed the moment.",
      linkToOperation: "Using a prepared form of words in an ordinary encounter",
      attemptMeaning:
        "You said it. Their reaction is theirs to have.",
      suitability:
        "If the sentence gave more than you wanted to give, change it. It's yours to set.",
      progression: [
        {
          id: "rung-bereave-say-2",
          instruction: "Write a second sentence, for a different kind of person.",
        },
      ],
    },
    {
      id: "mission-bereave-company",
      version: 1,
      playId: "company-not-replacement",
      title: "Arrange one piece of company",
      instruction:
        "Not dating. One arrangement with someone \u2014 dinner, a walk, an evening. Note what it was you actually wanted from it.",
      linkToOperation: "Meeting a need for companionship without relational commitment",
      attemptMeaning:
        "You arranged it. What it tells you about what you want is the point.",
      suitability:
        "If \u201cnothing, for now\u201d was your honest answer, this mission isn't for you and skipping it is the right call.",
      progression: [
        {
          id: "rung-bereave-company-2",
          instruction: "Mention them, once, to someone who didn't know them.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-bereave-guilt",
      version: 1,
      playId: "allowed-to-be-all-right",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed what the guilt was saying",
          "Didn't argue with it",
          "Named what set it off",
          "Tried to talk myself out of it",
        ],
      },
      performedOperation: {
        label: "Did you examine the assumption without arguing with the guilt?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That grief has been a form of contact",
          "What the guilt actually assumes",
          "That it isn't irrational",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Looking at it made it worse",
          "It felt like being told to move on",
          "Someone told me what they'd have wanted",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-bereave-say",
      version: 1,
      playId: "what-do-i-say",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Had a sentence ready",
          "Said it and stopped",
          "Didn't manage their reaction",
          "Avoided the question again",
        ],
      },
      performedOperation: {
        label: "Did you use a prepared sentence?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That having it ready removes the ambush",
          "That I gave more than I wanted to",
          "That different people need different sentences",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't say it out loud",
          "They reacted badly and I managed it",
          "Saying it felt like a betrayal",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-bereave-company",
      version: 1,
      playId: "company-not-replacement",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what I actually want",
          "Checked whether I could talk about them",
          "Arranged one piece of company",
          "Decided it's not for now",
        ],
      },
      performedOperation: {
        label: "Did you examine the replacement assumption?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's company I want, not the ache stopping",
          "That I couldn't talk about them yet",
          "That there isn't a single slot",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Wanting anything felt like a betrayal",
          "I couldn't imagine mentioning them",
          "It read as being pushed to date",
          "Nothing stuck",
        ],
      },
    },
  ],
};
