/**
 * Cluster 22 — "Fear of Losing Myself"
 * The Relationship Playbook™ · Staying Yourself While Growing Together
 *
 * Track: Exclusivity — the only cluster in this track.
 * Task = Intentional Investment. Core Need: TO BELONG.
 * Plays-only. No `simulations[]`.
 *
 * Authored 30 Jul 2026 against playbook-content-authoring-schema.md.
 *
 * ⚠ THE INDEPENDENCE HALF IS NOT A PROBLEM. Six of twenty statements are
 *   clearly stated values, not difficulties. They route to Recognition/Context
 *   via `rec-c22-independence-is-fine`. No Play works on them.
 *
 * ⚠ NO "JUST LET GO" ADVICE anywhere. It isn't actionable and it implies the
 *   planning is a character flaw rather than something that has served them.
 *
 * ⚠ CLAIM SCOPE. May claim: work out what's actually at risk; notice what the
 *   planning is for; separate what's yours to carry from what isn't. MUST NOT
 *   CLAIM: that commitment won't change your life, that the uncertainty gets
 *   comfortable, that you'll stop planning, or that any relationship is safe.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C22_LITERATURE } from "./staying-yourself-literature";

export const STAYING_YOURSELF: PlaybookContent = {
  playbookKey: "staying-yourself",
  playbookVersion: 1,
  displayName: "Staying Yourself While Growing Together",

  opening: {
    title: "Before anything else",
    body: [
      "You've built a life that works. The question underneath everything here is whether letting someone in means dismantling any of it.",
      "We're not going to reassure you that commitment won't change your life. It will, and you'd know if we were pretending otherwise.",
      "And nothing here will tell you to let go and trust the process. You've heard it. It isn't actionable.",
    ],
    manifestations: [
      "I don't want to lose my independence.",
      "I always need a plan.",
      "I prepare for disappointment before it happens.",
      "I feel responsible for making everything work.",
    ],
    cta: "Start with what's actually at risk",
  },

  recognitionCards: [
    {
      id: "rec-c22-independence-is-fine",
      role: "validate",
      pathwayPlayId: null,
      headline: "I don't want love to become my whole identity.",
      validationCopy:
        "That's a boundary, clearly stated, by someone who knows what they want — and most people arrive at a relationship unable to say any of it. We're not going to reframe it as fear of intimacy. There's a version of this material that does, and it's wrong. Nothing here works on your independence.",
      secondaryExamples: [
        "I want a relationship that adds to my life.",
        "I've worked too hard to give everything up.",
        "I enjoy my peace too much.",
      ],
    },
    {
      id: "rec-c22-no-room",
      role: "route",
      pathwayPlayId: "what-is-actually-at-risk",
      headline: "I don't know how to let someone into the life I've built.",
      explanation:
        "\u201cLosing myself\u201d is very general, and general fears can't be checked. Some things genuinely go. Most don't unless you hand them over.",
      secondaryExamples: [
        "I don't know if I have room for someone else.",
        "I'm afraid commitment means losing myself.",
        "I'm afraid a relationship will change my life too much.",
      ],
    },
    {
      id: "rec-c22-need-a-plan",
      role: "route",
      pathwayPlayId: "what-the-plan-is-for",
      headline: "I always need a plan.",
      explanation:
        "Planning has served you. In most areas effort goes in and certainty comes out. Relationships are the one place that return isn't there.",
      secondaryExamples: [
        "I like knowing what to expect.",
        "I struggle when things feel uncertain.",
        "I prepare for disappointment before it happens.",
      ],
    },
    {
      id: "rec-c22-responsible",
      role: "route",
      pathwayPlayId: "not-mine-to-carry",
      headline: "I feel responsible for making everything work.",
      explanation:
        "If it's all on you then it's all under your control. That's the appeal, and it's why it's exhausting.",
      secondaryExamples: [
        "I struggle when I can't fix things.",
        "I don't like depending on anyone.",
        "I want to control the outcome.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────────────────────── Play 1 ──
    {
      playId: "what-is-actually-at-risk",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What's Actually at Risk",
      positioning: "For when \u201closing myself\u201d is too general to check.",
      recognitionGate: {
        prompt:
          "Are you worried a relationship would cost you something you've built?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI'm afraid commitment means losing myself\u201d is the sentence. It's also very general, and general fears can't be checked or negotiated.",
            "Some things genuinely go. Time alone, mostly. Complete say over your evenings and your money and where you live. Those are real and worth grieving rather than denying.",
            "Some things don't go unless you hand them over — your work, your friendships, your opinions, who you are when nobody's watching.",
            "People defend the whole set at once, which is exhausting, and means the negotiable and the non-negotiable get the same energy.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The point of separating them isn't to shrink the list. It's that a specific fear can be discussed and a general one can't.",
            "\u201cI don't want to lose myself\u201d gets reassurance. \u201cI'm not giving up Thursday nights\u201d gets an actual answer.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these does a relationship take, and which only goes if you hand it over?",
          situation:
            "Things are getting serious. Nobody has asked you for anything yet, and you've already been running the calculation.",
          buckets: [
            { id: "goes", label: "Genuinely changes" },
            { id: "kept", label: "Only goes if I hand it over" },
          ],
          items: [
            {
              id: "sort-c22-time-alone",
              text: "As much time alone as I have now",
              correctBucket: "goes",
              correction:
                "This one is real. Worth grieving rather than arguing about.",
            },
            {
              id: "sort-c22-friendships",
              text: "My friendships",
              correctBucket: "kept",
              correction:
                "These usually go by a series of small accommodations, not because commitment took them.",
            },
            {
              id: "sort-c22-decide-alone",
              text: "Deciding big things without consulting anyone",
              correctBucket: "goes",
              correction: "That's the arrangement, not a risk within it.",
            },
            {
              id: "sort-c22-work",
              text: "My work and how much of me it gets",
              correctBucket: "kept",
              correction: "Negotiable, and only lost if you trade it away.",
            },
            {
              id: "sort-c22-saturday",
              text: "What I do with a free Saturday",
              correctBucket: "kept",
              correction:
                "Some of it gets shared. Losing it entirely would be something you agreed to.",
            },
            {
              id: "sort-c22-opinions",
              text: "My opinions and how freely I say them",
              correctBucket: "kept",
              correction:
                "Nothing about commitment removes these. If they go, that's worth noticing early.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Now your own list. Be specific — a general fear can't be discussed with anyone.",
          fields: [
            {
              id: "non-negotiable",
              label: "What are you genuinely not giving up?",
              input: "text",
              placeholder: "Two or three things. The load-bearing ones.",
            },
            {
              id: "already-changing",
              label: "What's already changing, or would have to?",
              input: "text",
              placeholder: "The honest version, including the bits you'd rather not.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Has anyone actually asked you to give up the things on your first list?",
          enoughLabel: "Yes — it's been asked for",
          needMoreLabel: "No — I'm defending it in advance",
          needMoreIntro:
            "Worth knowing. A boundary you'd defend against an actual encroachment is one thing. One defended against someone who hasn't asked for anything is doing a different job.",
          needToKnowLabel: "What would tell me it was actually at risk",
          observableLabel: "Something they'd have to actually do or say",
        },
        {
          kind: "output",
          heading: "What I'm actually protecting",
          body:
            "Specific enough to say out loud. That's the whole difference between a fear and a boundary.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A general fear gets reassurance. A specific one gets an answer.",
            "Some things go. Most only go if I hand them over.",
            "Am I defending this against a person, or against the idea of one?",
          ],
        },
      ],
      portable: [
        "A general fear gets reassurance. A specific one gets an answer.",
        "Some things go. Most only go if I hand them over.",
        "Am I defending this against a person, or against the idea of one?",
      ],
      myPlaysTemplate: {
        when: "When \u201closing myself\u201d is too vague to do anything with",
        move: "Separate what commitment genuinely changes from what only goes if I hand it over",
        lookingFor: "Whether anyone has actually asked for the things I'm defending",
        watchOut: "Shrinking the list to seem reasonable — that isn't the exercise",
        remember: "Being able to name what I won't give up is most of the protection.",
      },
      fidelity: {
        correct:
          "The general fear is separated into what a relationship structurally changes and what would only be lost by agreement.",
        misuse: [
          "Shortening the list to appear more flexible.",
          "Using it to build a case for not committing.",
          "Treating everything as non-negotiable without checking.",
        ],
        notMeaning:
          "It does not mean nothing will change, that your list is right, or that naming it protects it.",
      },
    },

    // ───────────────────────────────────────────── Play 2 ──
    {
      playId: "what-the-plan-is-for",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What the Plan Is For",
      positioning: "For the planning that isn't returning anything.",
      recognitionGate: {
        prompt: "Do you find yourself planning a relationship the way you'd plan anything else?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Planning isn't a flaw and it has almost certainly served you. Most people who describe themselves this way have built something with it.",
            "In most areas the return is real: effort in, certainty out. That relationship is why the habit exists and why it's hard to switch off.",
            "Relationships are the one place that return isn't there. Another person is involved and they aren't a variable you hold. So the effort goes in and nothing comes back — and the natural response is to plan harder.",
          ],
        },
        {
          kind: "learn",
          body: [
            "That's the loop worth seeing. Not that planning is bad. That in this one area the usual return isn't available, and the effort keeps escalating because it feels like it should be.",
            "Bracing is the same loop in a different shape. \u201cI prepare for disappointment before it happens\u201d buys a small reduction in shock, paid for continuously, against a cost that arrives whether or not the thing does.",
            "And bracing is visible. Someone being braced against usually knows, even if neither of you names it.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these can planning actually help with?",
          situation:
            "You've been together four months. It's going well. You've been mentally running the next two years most evenings.",
          buckets: [
            { id: "plannable", label: "Planning helps" },
            { id: "not", label: "Planning does nothing" },
          ],
          items: [
            {
              id: "sort-c22-what-i-say",
              text: "What I'll say when I raise something difficult",
              correctBucket: "plannable",
              correction: "Yours entirely. Planning pays here.",
            },
            {
              id: "sort-c22-how-they-feel",
              text: "Whether they'll still feel this way in a year",
              correctBucket: "not",
              correction:
                "Not a variable you hold. Effort here returns nothing.",
            },
            {
              id: "sort-c22-my-limits",
              text: "What I'll do if a line of mine gets crossed",
              correctBucket: "plannable",
              correction: "Entirely yours, and worth having decided in advance.",
            },
            {
              id: "sort-c22-will-it-last",
              text: "Whether this lasts",
              correctBucket: "not",
              correction:
                "The big one, and the least plannable. Effort here is where most of it goes.",
            },
            {
              id: "sort-c22-my-time",
              text: "How much of my week I'm actually willing to give",
              correctBucket: "plannable",
              correction: "Yours. Specific. Worth knowing before you're asked.",
            },
            {
              id: "sort-c22-they-change",
              text: "Whether they turn out to be who they seem",
              correctBucket: "not",
              correction:
                "Observable over time, but not plannable. Watching isn't planning.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Where is your planning going at the moment?",
          fields: [
            {
              id: "planning-on",
              label: "What have you been working out in your head?",
              input: "text",
              placeholder: "The thing you keep running.",
            },
            {
              id: "returns",
              label: "Honestly — has any of it produced an answer?",
              input: "chips",
              suggestions: [
                "Yes, I decided something",
                "It calmed me for a bit",
                "No — I just run it again",
                "It's made me more anxious",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Put the effort where it pays.",
          conditionLabel: "The plannable thing I'll work out instead",
          thenLabel: "And when the unplannable one comes back, I'll",
          actions: [
            "Notice it and let it be unanswered",
            "Write it down and stop there",
            "Move to the thing that is mine to decide",
            "Say it out loud to them",
          ],
          controlCheck:
            "I'm not trying to stop planning \u2014 I'm moving the effort to where it actually returns something.",
        },
        {
          kind: "output",
          heading: "Where the effort goes",
          body:
            "Not less planning. Planning aimed at the things that answer back.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "In most areas effort buys certainty. Not this one.",
            "Bracing is paid for continuously whether or not the thing happens.",
            "Is this mine to decide, or am I running it again?",
          ],
        },
      ],
      portable: [
        "In most areas effort buys certainty. Not this one.",
        "Bracing is paid for continuously whether or not the thing happens.",
        "Is this mine to decide, or am I running it again?",
      ],
      myPlaysTemplate: {
        when: "When I'm planning a relationship the way I'd plan anything else",
        move: "Separate what planning can settle from what it can't, and move the effort",
        lookingFor: "Whether the thing I'm running has ever produced an answer",
        watchOut: "Treating this as an instruction to stop planning — it isn't",
        remember: "Planning built what I have. It just doesn't return anything here.",
      },
      fidelity: {
        correct:
          "Planning effort is redirected from unplannable outcomes toward decisions that are the reader's own.",
        misuse: [
          "Treating it as an instruction to stop planning entirely.",
          "Using it to conclude the planning is a character flaw.",
          "Planning the redirection itself into another loop.",
        ],
        notMeaning:
          "It does not mean the uncertainty becomes comfortable, that you'll stop bracing, or that the outcome improves.",
      },
    },

    // ───────────────────────────────────────────── Play 3 ──
    {
      playId: "not-mine-to-carry",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Not Mine to Carry",
      positioning: "For when whether it works feels like your job.",
      recognitionGate: {
        prompt: "Do you feel responsible for whether the relationship succeeds?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI feel responsible for making everything work.\u201d \u201cI struggle when I can't fix things.\u201d \u201cI don't like depending on anyone.\u201d",
            "These three arrive together often enough to be one thing. If it's all on you, then it's all under your control — and that's the appeal, even though it's exhausting.",
            "Depending on someone means their choices affect your outcome. That's the actual objection, and it isn't irrational. It's also the definition of the thing you're considering.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Yours: what you contribute, what you're honest about, whether you show up, what you'll accept.",
            "Not yours: whether they do the same. Whether it lasts. Whether it turns out to have been the right call.",
            "Carrying the second set doesn't make it more likely to go well. It makes you tired — and it quietly relieves the other person of things that were theirs.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Setting something down isn't the same as trusting that it'll be fine.",
            "You can put it down because carrying it wasn't doing anything, while still thinking it might go badly. Those aren't in conflict.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Sort what you're currently holding.",
          fields: [
            {
              id: "carrying",
              label: "What are you holding that isn't yours?",
              input: "chips",
              suggestions: [
                "Whether they're happy",
                "Whether we last",
                "Whether they put in as much as I do",
                "Whether this was the right decision",
                "Whether they're honest with me",
              ],
            },
            {
              id: "actually-mine",
              label: "And what's genuinely yours here?",
              input: "text",
              placeholder: "What you contribute, what you're honest about, what you'll accept.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Has carrying the first list ever changed the outcome of anything on it?",
          enoughLabel: "Yes, sometimes",
          needMoreLabel: "No — it just costs me",
          needMoreIntro:
            "That's usually the answer, and it's the argument for setting it down. Not trust. Arithmetic.",
          needToKnowLabel: "What I'd set down first",
          observableLabel: "Something I'd notice myself doing differently",
        },
        {
          kind: "output",
          heading: "What's mine",
          body:
            "Setting the rest down isn't optimism. It's noticing that carrying it wasn't doing anything.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Depending on someone means their choices affect me. That's the arrangement.",
            "Carrying their half doesn't make it more likely to go well.",
            "I can put it down and still think it might go badly.",
          ],
        },
      ],
      portable: [
        "Depending on someone means their choices affect me. That's the arrangement.",
        "Carrying their half doesn't make it more likely to go well.",
        "I can put it down and still think it might go badly.",
      ],
      myPlaysTemplate: {
        when: "When whether the relationship works feels like my responsibility",
        move: "Separate what's genuinely mine from what I've taken on",
        lookingFor: "Whether carrying it has ever changed an outcome",
        watchOut: "Reading this as an instruction to trust them",
        remember: "Setting it down is arithmetic, not optimism.",
      },
      fidelity: {
        correct:
          "Responsibilities are sorted into the reader's own and the other person's, and at least one is set down on cost grounds.",
        misuse: [
          "Using it to justify contributing less.",
          "Using it as evidence of how much you do.",
          "Treating it as a requirement to trust them.",
        ],
        notMeaning:
          "It does not mean they'll pick up their half, that the relationship will hold, or that you'll worry less.",
      },
    },
  ],

  literature: C22_LITERATURE,

  missions: [
    {
      id: "mission-c22-at-risk",
      version: 1,
      playId: "what-is-actually-at-risk",
      title: "Say one non-negotiable out loud",
      instruction:
        "Tell them one specific thing you're not giving up. Not as a warning — as information about how you work.",
      linkToOperation: "Stating a specific boundary rather than a general fear",
      attemptMeaning:
        "You said it. How they take it is separate, and it's also useful information.",
      suitability:
        "If nothing has actually been asked for yet, this is still worth doing — it's easier to say before it's contested.",
      progression: [
        {
          id: "rung-c22-at-risk-2",
          instruction: "Ask them what's on their equivalent list.",
        },
      ],
    },
    {
      id: "mission-c22-plan",
      version: 1,
      playId: "what-the-plan-is-for",
      title: "Notice one loop, once",
      instruction:
        "Next time you catch yourself running the unplannable thing, note it and move to something that's yours to decide. Once is enough.",
      linkToOperation: "Redirecting planning effort toward decidable questions",
      attemptMeaning:
        "You noticed and moved. The loop coming back isn't failure — it will.",
      suitability:
        "If the redirection becomes its own plan, that's worth noticing rather than perfecting.",
      progression: [
        {
          id: "rung-c22-plan-2",
          instruction: "Say the unanswerable one out loud to them instead of running it.",
        },
      ],
    },
    {
      id: "mission-c22-carry",
      version: 1,
      playId: "not-mine-to-carry",
      title: "Set one thing down for a week",
      instruction:
        "Pick one thing from the not-yours list and stop carrying it for a week. Note what actually changed — in the situation, and in you.",
      linkToOperation: "Releasing a responsibility that belongs to the other person",
      attemptMeaning:
        "You set it down. Picking it back up is information, not failure.",
      suitability:
        "If setting it down means contributing less rather than worrying less, that's a different thing and worth catching.",
      progression: [
        {
          id: "rung-c22-carry-2",
          instruction: "Set down a second one, and don't take the first back.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c22-at-risk",
      version: 1,
      playId: "what-is-actually-at-risk",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named specific things rather than a general fear",
          "Checked whether anyone had actually asked",
          "Said one out loud",
          "Defended the whole list at once",
        ],
      },
      performedOperation: {
        label: "Did you separate what changes from what only goes if you hand it over?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That most of it isn't actually at risk",
          "That some of it genuinely is",
          "That nobody has asked me for anything",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything felt non-negotiable",
          "I couldn't say it without it sounding like a warning",
          "They didn't take it well",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c22-plan",
      version: 1,
      playId: "what-the-plan-is-for",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed the loop",
          "Moved to something I could decide",
          "Let one question stay unanswered",
          "Ran it again anyway",
        ],
      },
      performedOperation: {
        label: "Did you move the effort toward something decidable?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it was unanswerable",
          "That the planning wasn't returning anything",
          "Which parts are actually mine",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The loop came back straight away",
          "Not answering it felt worse",
          "The redirection became another plan",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c22-carry",
      version: 1,
      playId: "not-mine-to-carry",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Set one thing down",
          "Named what's genuinely mine",
          "Held it for the week",
          "Picked it back up",
        ],
      },
      performedOperation: {
        label: "Did you set down something that wasn't yours?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That carrying it changed nothing",
          "How much I'd taken on",
          "That putting it down isn't trusting them",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Putting it down felt like giving up",
          "I picked it straight back up",
          "I contributed less instead of worrying less",
          "Nothing stuck",
        ],
      },
    },
  ],
};
