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

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const ADDON_LIVING_WITH_ILLNESS: PlaybookContent = {
  playbookKey: "addon-living-with-illness",
  playbookVersion: 1,
  displayName: "When Your Body Changes the Relationship",

  opening: {
    title: "A fact, not a failing",
    body: [
      "Your illness changed the relationship. Most people treat that as the second thing, not the first.",
      "What the illness needs is practical, and there are specialists for it. What has happened between you because of it — the asking, the guilt, the intimacy, the fear — has almost nothing written for it. That's what this is for.",
      "Nothing here is medical. And nothing here has a view about what you can do.",
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
        "Worth taking literally, not as a nice sentiment. The practical version: how much of what goes on between you is about the illness? Appointments, symptoms, medication, how you're doing — all of it needed, and it grows until there isn't much else. \u201cI miss who I used to be\u201d is partly about the body. And partly about being treated as a person, not a condition being managed.",
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
        "Then this is written from the wrong side. There's a paired Playbook for the person caring — about the partnership fading, about the guilt of wanting a break, about being alone while together. That's the one for you. If both of you want to, reading the paired piece may help each of you understand the other's side. Share or discuss only what each of you is comfortable sharing.",
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
        "We're not going to tell you that you aren't. What's worth looking at is what the belief does — it stops you asking, and that makes things harder for both of you.",
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
        "The least talked-about part of this, and one of the most common. Both people avoid it to protect the other, and the avoiding becomes the problem.",
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
            "We're not going to tell you that you aren't a burden. Being argued out of it doesn't work. And it only adds a second layer: feeling unreasonable on top of everything else.",
            "What's worth looking at is what the belief does. It stops you asking. If every request adds to a total you're already ashamed of, then asking for less makes sense.",
            "Most people here have got very good at that.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Which makes things harder for both of you. Your partner is working from only part of the picture, and often gets it wrong — doing things at the wrong time, missing the thing that mattered, guessing.",
            "\u201cI don't want them to feel trapped\u201d comes from the same place. It usually means managing their experience for them — deciding ahead of time what they can handle, without asking.",
            "Asking for less doesn't lower the load. It just moves it.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "This isn't about asking for more. It's a count of what's going unsaid right now.",
          fields: [
            {
              id: "not-asking",
              label: "What have you stopped asking for?",
              input: "text",
              placeholder: "Including small things. Especially small things.",
            },
            {
              id: "deciding-for-them",
              label: "What have you decided they couldn't handle, without asking?",
              input: "text",
              placeholder: "Most people find there's at least one.",
            },
            {
              id: "one-thing",
              label:
                "One thing you'd ask for if the running total didn't exist",
              input: "text",
              placeholder: "Small enough that you could take a no.",
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
            "That's the cost, put plainly. They're deciding how to help you based on a cut-down version of your needs — one you edited down yourself.",
          needToKnowLabel: "What I'd most want them to know exists",
          observableLabel: "Something specific I could name",
        },
        {
          kind: "output",
          heading: "What I've stopped asking for",
          body:
            "Asking for less doesn't lower the load. It just moves it into their guessing.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The belief stops you asking. That's the cost, whether it's true or not.",
            "Deciding what they can handle, without asking, is managing them.",
            "Asking for less just moves the load. It doesn't lower it.",
          ],
        },
      ],
      portable: [
        "The belief stops you asking. That's the cost, whether it's true or not.",
        "Deciding what they can handle, without asking, is managing them.",
        "Asking for less just moves the load. It doesn't lower it.",
      ],
      myPlaysTemplate: {
        when: "When I've got good at needing less than I need",
        move: "Count what I've stopped asking for, and what I've decided for them",
        lookingFor: "Whether they know these things exist at all",
        watchOut: "Turning this into another reason to feel like a burden",
        remember: "They're working from a cut-down version of my needs — one I edited down.",
      },
      fidelity: {
        correct:
          "You count the requests you've held back, and you spot the choices you made for your partner without asking.",
        misuse: [
          "Using it as more proof that you're a burden.",
          "Deciding to ask for everything at once.",
          "Treating the belief as something to argue away.",
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
        prompt: "Is there something about how you are together that neither of you brings up?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Intimacy after your body changes is one of the least talked-about parts of this. And almost nothing written about relationships and illness goes near it.",
            "Two things get treated as one. First, what your body can do. That's between you and people who know your condition — and it's not what this is about.",
            "Second, whether it can be talked about. That's the part that gets stuck. And it gets stuck in a certain way: both people avoid it to protect the other, and the avoiding becomes the problem.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Feeling unattractive is worth pulling apart too. It's usually about how you feel in your body, not what your partner thinks — which matters, because their reassurance doesn't reach it, and you may both have decided the reassurance failed.",
            "Nothing here says intimacy can be brought back, or that it should look like it used to. What can be worked on is whether the subject can be opened at all.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Opening it will probably be uncomfortable, and it may not go well the first time.",
            "That's not a sign it was the wrong move. Subjects avoided for a long time rarely open smoothly.",
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
            "Not a request, and not an apology. Just naming that it's unsaid is enough to start. You might say \u201cThere's something we don't talk about, and I'd rather we did\u201d or \u201cCan I say something awkward? I don't need you to fix it.\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "A calm moment with time afterward \u2014 not in bed, and not right after something has gone wrong.",
          doThis:
            "Say the opening line, then the one unsaid thing. Don't add a request. Don't apologise for bringing it up. And let it stay uncomfortable instead of smoothing it over.",
          safetyNote:
            "If raising it would put you at risk \u2014 if there's pressure, or a reaction you're afraid of \u2014 that's a different situation, and this isn't the tool for it. Please talk to someone.",
        },
        {
          kind: "output",
          heading: "What I said",
          body:
            "Not a fix. The subject got opened, which is the part that was stuck.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "We're both avoiding it to protect each other. The avoiding is the problem.",
            "What my body can do and whether we can talk about it are two different questions.",
            "Reassurance doesn't reach how I feel in my body. That isn't their failure.",
          ],
        },
      ],
      portable: [
        "We're both avoiding it to protect each other. The avoiding is the problem.",
        "What my body can do and whether we can talk about it are two different questions.",
        "Reassurance doesn't reach how I feel in my body. That isn't their failure.",
      ],
      myPlaysTemplate: {
        when: "When neither of us brings up something about how we are together",
        move: "Name that it's unsaid, then say the one thing",
        lookingFor: "Whether the subject can be opened at all",
        watchOut: "Smoothing over the discomfort by adding a fix",
        remember: "It rarely opens smoothly. That isn't a sign it was wrong.",
      },
      fidelity: {
        correct:
          "You name an avoided subject directly, say one unsaid thing, and add no request or apology.",
        misuse: [
          "Bringing it up in the moment it's most loaded.",
          "Adding a request for something to change.",
          "Treating a hard first conversation as proof it shouldn't have been brought up.",
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
      linkToOperation: "Making a request you'd held back",
      attemptMeaning:
        "You asked. A no still counts as a full attempt — it's information about the request, not about you.",
      suitability:
        "Start with one where you could handle a no. Not the biggest thing on the list.",
      progression: [
        {
          id: "rung-ill-ask-2",
          instruction:
            "Tell them one thing you'd decided they couldn't handle, and check whether that was right.",
        },
      ],
    },
    {
      id: "mission-ill-subject",
      version: 1,
      playId: "opening-the-subject",
      title: "Come back to it once",
      instruction:
        "A week or two after you opened it, come back to it briefly. Subjects that get raised once and never again tend to close over.",
      linkToOperation: "Keeping an opened subject going, not just raising it once",
      attemptMeaning:
        "You came back. That it stays uncomfortable is expected.",
      suitability:
        "If the first try went badly, coming back is still worth doing \u2014 second tries often go better than first ones here.",
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
        label: "Did you count the requests you'd held back?",
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
          "It became more proof I'm a burden",
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
          "Smoothed it over with a fix",
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
          "That what I assumed about them was wrong",
          "That it's about how I feel in my body",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't bring it up",
          "It went badly",
          "They reassured me and it didn't land",
          "Nothing stuck",
        ],
      },
    },
  ],
};
