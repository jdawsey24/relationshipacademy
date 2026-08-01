/**
 * ADD-ON — "When Your Body Changes the Relationship"
 * Derived from Cluster 20: Chronic Illness & Disability (10 statements).
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 * Two Plays, five literature entries — add-on scale.
 *
 * ⚠ ADD-ON. Not quiz-detectable. Reached by signpost or life-situation menu.
 *
 * ⚠ PAIRED WITH `addon-caregiving` — same situation, other side. Each routes to
 *   the other.
 *
 * ⚠ WRITTEN FROM THE INSIDE. The reader is ill. Nothing addresses them as a
 *   burden to be managed or treats their needs as an imposition.
 *
 * ⚠ NOT MEDICAL GUIDANCE. No assumption about condition, prognosis,
 *   progression, visibility, or capability.
 *
 * ⚠ "I FEEL LIKE A BURDEN" IS NOT ARGUED WITH. What's workable is what the
 *   belief suppresses — asking — and what that costs both people.
 *
 * ⚠ THE FEAR OF BEING LEFT MAY BE ACCURATE. Nothing promises otherwise.
 *
 * ⚠ INTIMACY — the material works on whether it can be discussed, never on
 *   function or capability.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { ADDON_ILLNESS_LITERATURE } from "./living-with-illness-literature";

export const ADDON_LIVING_WITH_ILLNESS: PlaybookContent = {
  playbookKey: "addon-living-with-illness",
  playbookVersion: 1,
  displayName: "When Your Body Changes the Relationship",

  opening: {
    title: "A fact, not a failing",
    body: [
      "Your illness changed the relationship. That's usually carried as though it were the second thing rather than the first.",
      "What the illness requires is practical and has specialists. What has happened between you because of it — the asking, the guilt, the intimacy, the fear — has almost nothing written for it. That's what this is.",
      "Nothing here is medical, and nothing here has a view about what you're capable of.",
    ],
    manifestations: [
      "I feel like a burden.",
      "I don't know how to ask for what I need.",
      "I don't know how to navigate intimacy now.",
      "I want to feel like more than my diagnosis.",
    ],
    cta: "Start with what the burden belief costs",
  },

  recognitionCards: [
    {
      id: "rec-ill-more-than",
      role: "validate",
      pathwayPlayId: null,
      headline: "I want to feel like more than my diagnosis.",
      validationCopy:
        "Worth taking literally rather than as a sentiment. The practical version: how much of what passes between you is about the illness? Appointments, symptoms, medication, how you're doing — all necessary, and it expands until there isn't much else. \u201cI miss who I used to be\u201d is partly about the body and partly about being related to as a person rather than a condition being managed.",
      secondaryExamples: [
        "I miss who I used to be.",
        "My illness has changed our relationship.",
        "I worry they'll leave because of my health.",
      ],
    },
    {
      id: "rec-ill-other-side",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm the one providing the care.",
      validationCopy:
        "Then this is written from the wrong side. There's a paired Playbook for the person caring — about the partnership receding, about the guilt of wanting a break, about being alone while together. That's the one for you. If both of you want to, reading the paired piece may help you understand the other's perspective. Share or discuss only what each of you is comfortable sharing.",
      secondaryExamples: [
        "I'm exhausted.",
        "I feel guilty wanting a break.",
        "I miss the relationship we used to have.",
      ],
    },
    {
      id: "rec-ill-burden",
      role: "route",
      pathwayPlayId: "what-the-burden-belief-costs",
      headline: "I feel like a burden.",
      explanation:
        "We're not going to tell you that you aren't. What's worth looking at is what the belief does — it suppresses asking, and that makes things harder for both of you.",
      secondaryExamples: [
        "I don't want them to feel trapped.",
        "I don't know how to ask for what I need.",
      ],
    },
    {
      id: "rec-ill-intimacy",
      role: "route",
      pathwayPlayId: "opening-the-subject",
      headline: "I don't know how to navigate intimacy now.",
      explanation:
        "The least discussed part of this and one of the most common. Both people avoid it to protect the other, and the avoiding becomes the problem.",
      secondaryExamples: [
        "I don't feel attractive anymore.",
        "I don't know how to stay connected when everything has changed.",
      ],
    },
  ],

  plays: [
    {
      playId: "what-the-burden-belief-costs",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What the Burden Belief Costs",
      positioning: "For the asking you've stopped doing.",
      recognitionGate: {
        prompt: "Have you got very good at needing less than you actually need?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "We're not going to tell you that you aren't a burden. Being argued out of it doesn't work and it adds a second layer about being unreasonable.",
            "What's worth looking at is what the belief does. It suppresses asking — if every request adds to a total you're already ashamed of, the sensible move is to ask for less.",
            "Most people here have got very good at that.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Which makes things harder for both of you. Your partner is working from incomplete information and often getting it wrong — doing things at the wrong time, missing the thing that mattered, guessing.",
            "\u201cI don't want them to feel trapped\u201d comes from the same place and usually results in managing their experience for them: deciding in advance what they can bear, without asking.",
            "Asking less doesn't reduce the load. It relocates it.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Not an exercise in asking for more. A count of what's currently unsaid.",
          fields: [
            {
              id: "not-asking",
              label: "What have you stopped asking for?",
              input: "text",
              placeholder: "Including small things. Especially small things.",
            },
            {
              id: "deciding-for-them",
              label: "What have you decided they couldn't bear, without asking?",
              input: "text",
              placeholder: "Most people find there's at least one.",
            },
            {
              id: "one-thing",
              label:
                "One thing you'd ask for if the running total didn't exist",
              input: "text",
              placeholder: "Small enough that a no would be survivable.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Does your partner know the things on that first list exist?",
          enoughLabel: "Mostly, yes",
          needMoreLabel: "No \u2014 they'd have no idea",
          needMoreIntro:
            "That's the cost, stated plainly. They're making decisions about how to help you based on a version of your needs that you've edited down.",
          needToKnowLabel: "What I'd most want them to know exists",
          observableLabel: "Something specific I could name",
        },
        {
          kind: "output",
          heading: "What I've stopped asking for",
          body:
            "Asking less doesn't reduce the load. It relocates it into their guessing.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The belief suppresses asking. That's the cost, whatever its accuracy.",
            "Deciding what they can bear, without asking, is managing them.",
            "Asking less relocates the load. It doesn't reduce it.",
          ],
        },
      ],
      portable: [
        "The belief suppresses asking. That's the cost, whatever its accuracy.",
        "Deciding what they can bear, without asking, is managing them.",
        "Asking less relocates the load. It doesn't reduce it.",
      ],
      myPlaysTemplate: {
        when: "When I've got good at needing less than I need",
        move: "Count what I've stopped asking for, and what I've decided for them",
        lookingFor: "Whether they know these things exist at all",
        watchOut: "Turning this into another reason to feel like a burden",
        remember: "They're working from a version of my needs that I edited down.",
      },
      fidelity: {
        correct:
          "Suppressed requests are counted, and decisions made on the partner's behalf without asking are identified.",
        misuse: [
          "Using it as further evidence of being a burden.",
          "Deciding to ask for everything at once.",
          "Treating the belief as something to be argued away.",
        ],
        notMeaning:
          "It does not mean you aren't a burden, that asking will be met, or that they want to be asked.",
      },
    },

    {
      playId: "opening-the-subject",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Opening the Subject",
      positioning:
        "For the conversation you're both avoiding to protect each other.",
      recognitionGate: {
        prompt: "Is there something about how you are together that neither of you raises?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Intimacy after a body changes is one of the least discussed parts of this, and almost nothing written about relationships and illness goes near it.",
            "Two things get treated as one. What your body can do — between you and people who know your condition, and not what this is about.",
            "And whether it can be talked about. That's the part that stalls, and it stalls in a specific way: both people avoid it to protect the other, and the avoiding becomes the problem.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Feeling unattractive is worth separating too. It's usually about how you feel in your body rather than what your partner thinks — which matters, because reassurance from them doesn't reach it, and you may both have concluded the reassurance failed.",
            "Nothing here suggests intimacy can be restored or should look like it used to. What's workable is whether the subject can be opened at all.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Opening it will probably be uncomfortable, and it may not go well the first time.",
            "That's not a sign it was the wrong move. Subjects that have been avoided for a long time rarely open gracefully.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What's actually unsaid? Not what you'd want changed — what hasn't been said.",
          fields: [
            {
              id: "unsaid",
              label: "What haven't you said?",
              input: "text",
              placeholder: "The thing you've been protecting them from.",
            },
            {
              id: "what-i-assume",
              label: "What do you assume they think, that you've never checked?",
              input: "text",
              placeholder: "About your body, about wanting you, about the future.",
            },
            {
              id: "which-part",
              label: "Is it about your body, or about how you feel in it?",
              input: "chips",
              suggestions: [
                "How I feel in it",
                "What it can do",
                "Both",
                "I hadn't separated those",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'd open it",
          helper:
            "Not a request and not an apology. Naming that it's unsaid is enough to start. You might use \u201cThere's something we don't talk about, and I'd rather we did\u201d or \u201cCan I say something awkward? I don't need you to fix it.\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "A calm moment with time afterwards \u2014 not in bed, and not after something has already gone wrong.",
          doThis:
            "Say the opening line and then the one unsaid thing. Don't add a request, don't apologise for raising it, and let it be uncomfortable rather than rescuing it.",
          safetyNote:
            "If you'd be at risk raising it \u2014 if there's pressure, or a reaction you're frightened of \u2014 that's a different situation and this isn't the tool. Please talk to someone.",
        },
        {
          kind: "output",
          heading: "What I said",
          body:
            "Not a solution. The subject opened, which is the part that was stuck.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "We're both avoiding it to protect each other. The avoiding is the problem.",
            "What my body can do and whether we can discuss it are different questions.",
            "Reassurance doesn't reach how I feel in my body. That isn't their failure.",
          ],
        },
      ],
      portable: [
        "We're both avoiding it to protect each other. The avoiding is the problem.",
        "What my body can do and whether we can discuss it are different questions.",
        "Reassurance doesn't reach how I feel in my body. That isn't their failure.",
      ],
      myPlaysTemplate: {
        when: "When neither of us raises something about how we are together",
        move: "Name that it's unsaid, then say the one thing",
        lookingFor: "Whether the subject can be opened at all",
        watchOut: "Rescuing the discomfort by adding a solution",
        remember: "It rarely opens gracefully. That isn't a sign it was wrong.",
      },
      fidelity: {
        correct:
          "An avoided subject is named directly, with one unsaid thing stated, and no request or apology attached.",
        misuse: [
          "Raising it in the moment it's most loaded.",
          "Attaching a request for something to change.",
          "Treating a difficult first conversation as evidence it shouldn't have been raised.",
        ],
        notMeaning:
          "It does not mean intimacy changes, that they'll respond well, or that the subject becomes easy.",
      },
    },
  ],

  literature: ADDON_ILLNESS_LITERATURE,

  missions: [
    {
      id: "mission-ill-ask",
      version: 1,
      playId: "what-the-burden-belief-costs",
      title: "Ask for the one thing",
      instruction:
        "Ask for the small thing you named. Once, plainly, without explaining why you deserve it.",
      linkToOperation: "Making a suppressed request",
      attemptMeaning:
        "You asked. A no is a completed attempt and is information about the request, not about you.",
      suitability:
        "Start with one where a no would be genuinely survivable. Not the biggest thing on the list.",
      progression: [
        {
          id: "rung-ill-ask-2",
          instruction:
            "Tell them one thing you'd decided they couldn't bear, and check whether that was right.",
        },
      ],
    },
    {
      id: "mission-ill-subject",
      version: 1,
      playId: "opening-the-subject",
      title: "Come back to it once",
      instruction:
        "A week or two after you opened it, return to it briefly. Subjects that get raised once and never again tend to close over.",
      linkToOperation: "Sustaining an opened subject rather than raising it once",
      attemptMeaning:
        "You came back. That it stays uncomfortable is expected.",
      suitability:
        "If the first attempt went badly, coming back is still worth doing \u2014 second attempts frequently go better than first ones here.",
      progression: [
        {
          id: "rung-ill-subject-2",
          instruction: "Ask them what they've been not saying.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-ill-ask",
      version: 1,
      playId: "what-the-burden-belief-costs",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Counted what I'd stopped asking for",
          "Noticed what I'd decided for them",
          "Asked for one thing",
          "Decided not to add to the total",
        ],
      },
      performedOperation: {
        label: "Did you count the suppressed requests?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much I've edited down",
          "That they don't know these things exist",
          "That I've been managing their experience",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It became more evidence of being a burden",
          "I couldn't ask even for the small thing",
          "I asked and it went badly",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-ill-subject",
      version: 1,
      playId: "opening-the-subject",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named that it was unsaid",
          "Said the one thing",
          "Let it be uncomfortable",
          "Rescued it with a solution",
        ],
      },
      performedOperation: {
        label: "Did you name the avoided subject and say one unsaid thing?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That they'd been avoiding it too",
          "That my assumption about them was wrong",
          "That it's about how I feel in my body",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't raise it",
          "It went badly",
          "They reassured me and it didn't land",
          "Nothing stuck",
        ],
      },
    },
  ],
};
