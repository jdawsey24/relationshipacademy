/**
 * Cluster 20 — "Difficulty Recognizing My Own Life" — IDENTITY CORE
 * The Relationship Playbook™ · Finding Yourself Again
 *
 * Track: Recovery (21) + Expiration (10). Task = Healing. Core Need: TO HEAL.
 * Plays-only.
 *
 * ⚠⚠ SCOPE — 31 OF 91 STATEMENTS. Owner-ruled. Cluster 20 as catalogued spans
 *   ten life events and cannot be one Playbook. Resolved as: this Playbook (31),
 *   a separate BEREAVEMENT Playbook (20), and four ADD-ONS (40) — caregiving,
 *   chronic illness, dating later in life, infertility and pregnancy loss.
 *
 * ⚠ NOT A BEREAVEMENT PLAYBOOK. Nothing assumes anyone died. `rec-c20-bereaved`
 *   routes those readers out. "I'm grieving someone who's still alive" is in
 *   this data and is a different injury.
 *
 * ⚠ NO TIMELINE CLAIMS anywhere.
 *
 * ⚠ THE PRACTICAL BLOCK IS NOT LEGAL OR PARENTING ADVICE. Co-parenting,
 *   finances and housing route to `signpost-c20-practical`.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   what-was-mine       → Identity Reconstruction
 *   the-future-i-lost   → Grief Integration
 *   the-shape-of-a-life → Life Reorganization · Support-System Development
 *   what-im-choosing    → Personal Agency · Identity Reconstruction
 *
 * ⚠ CLAIM SCOPE. May claim: separate what was shared from what was yours; grieve
 *   an imagined future as a real loss; rebuild the structure a life had; notice
 *   what's returning. MUST NOT CLAIM: that you'll feel like yourself again, that
 *   it takes any particular time, or that the old self returns.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C20_LITERATURE } from "./finding-yourself-again-literature";

export const FINDING_YOURSELF_AGAIN: PlaybookContent = {
  playbookKey: "finding-yourself-again",
  playbookVersion: 1,
  displayName: "Finding Yourself Again",

  opening: {
    title: "It took something else with it",
    body: [
      "Not just the person — the version of you that existed inside it. \u201cI don't recognise myself anymore\u201d is usually said with some embarrassment, as though it were an overreaction. It isn't.",
      "Three losses are tangled here: the person, the future you'd assumed, and the structure a life had. They respond to different things, and most people try to address all three the same way.",
      "Nothing here says how long this takes.",
    ],
    manifestations: [
      "I don't recognise myself anymore.",
      "I built my identity around my relationship.",
      "I'm grieving the future I imagined.",
      "Everything feels unfamiliar.",
    ],
    cta: "Start by separating the three",
  },

  recognitionCards: [
    {
      id: "rec-c20-failed",
      role: "validate",
      pathwayPlayId: null,
      headline: "I feel like I failed.",
      validationCopy:
        "Nearly everyone whose relationship ends says this, including people who were left and people who left. Failure implies a task with a defined success condition, and \u201cstayed together\u201d is the only one on offer — which makes every ending a failure regardless of what it contained. Nobody would apply that standard to a friendship, a job, or a city they moved away from.",
      secondaryExamples: [
        "I never imagined this would be my story.",
        "I don't want my past to define me.",
        "I'm afraid my past will ruin my future.",
      ],
    },
    {
      id: "rec-c20-bereaved",
      role: "signpost",
      pathwayPlayId: null,
      headline: "My partner died.",
      validationCopy:
        "This Playbook is for people whose relationship ended while both are still living, and some of it would land badly on you — the tools assume someone made a choice. Losing a partner to death is a different injury with different questions: whether continuing your life means leaving them behind, how to want companionship without it feeling like a betrayal. There's a paired Playbook for that, and it's the right one.",
      secondaryExamples: [
        "Dating again feels like I'm betraying them.",
        "I don't want to replace them.",
        "I still think of us as \u201cwe.\u201d",
      ],
    },
    {
      id: "rec-c20-built-around",
      role: "route",
      pathwayPlayId: "what-was-mine",
      headline: "I built my identity around my relationship.",
      explanation:
        "Not a failure of independence. It's what long relationships do, and the cost only appears at the end when it's unclear which of it was ever separately yours.",
      secondaryExamples: [
        "I don't know who I am without this relationship.",
        "I feel like I lost part of my identity.",
        "I have to learn how to be me again.",
      ],
    },
    {
      id: "rec-c20-the-future",
      role: "route",
      pathwayPlayId: "the-future-i-lost",
      headline: "I'm grieving the future I imagined.",
      explanation:
        "One of the least acknowledged losses there is, because nothing happened to it. It simply stopped being true.",
      secondaryExamples: [
        "I miss the life I thought we'd have.",
        "I don't know what my future looks like anymore.",
        "I'm grieving someone who's still alive.",
      ],
    },
    {
      id: "rec-c20-unfamiliar",
      role: "route",
      pathwayPlayId: "the-shape-of-a-life",
      headline: "Everything feels unfamiliar.",
      explanation:
        "A relationship organises an enormous amount. When it goes, the result presents as an identity crisis and a good deal of it is not knowing what to do on a Tuesday.",
      secondaryExamples: [
        "I don't know what life looks like now.",
        "I'm rebuilding my life from scratch.",
        "I don't know how to be alone.",
      ],
    },
    {
      id: "rec-c20-what-i-want",
      role: "route",
      pathwayPlayId: "what-im-choosing",
      headline: "I don't know what I want anymore.",
      explanation:
        "Usually a sign of capacity rather than damage. Knowing what you want takes spare resource, and there hasn't been any.",
      secondaryExamples: [
        "I don't know who I'm becoming.",
        "I don't know how to dream again.",
        "I want to feel like myself again.",
      ],
    },
  ],

  plays: [
    // ─────────────────── Play 1 · Identity Reconstruction ──
    {
      playId: "what-was-mine",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Was Mine",
      positioning: "For working out which parts of you were ever separately yours.",
      recognitionGate: {
        prompt: "Is it unclear which of your life was yours and which was theirs?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Building an identity around a relationship isn't a failure of independence. It's what long relationships do, and it happens without anyone deciding to.",
            "Two people living alongside each other for years develop shared preferences, friends, references, routines. That's not enmeshment — it's most of what closeness produces.",
            "The cost only appears at the end, when it becomes unclear which of it was ever separately yours.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The question isn't who you were before. That person is a decade out of date and isn't available.",
            "It's which of what you have now is yours — and there are three categories, not two.",
            "Things you brought and kept. Things they brought that you adopted and would keep. And things you did because they wanted to and never separately wanted.",
            "Most people assume the middle category has to be surrendered. It doesn't. Liking something because you learned it from someone is how most people come to like most things.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these would you keep?",
          situation:
            "You're going through the ordinary furniture of your life \u2014 what you listen to, who you see, what you do at the weekend \u2014 and much of it arrived through them.",
          buckets: [
            { id: "keep", label: "Mine, and I'd keep it" },
            { id: "falls-away", label: "Theirs, and it falls away" },
          ],
          items: [
            {
              id: "sort-c20-music",
              text: "Music they introduced you to that you genuinely love",
              correctBucket: "keep",
              correction:
                "Adopting something doesn't make it borrowed. That's yours now.",
            },
            {
              id: "sort-c20-their-sport",
              text: "The sport you watched because they did, and never cared about",
              correctBucket: "falls-away",
              correction:
                "That's the third category, and losing it isn't losing yourself.",
            },
            {
              id: "sort-c20-friends",
              text: "Friends who were originally theirs but became yours",
              correctBucket: "keep",
              correction:
                "Complicated in practice, and the liking is real regardless.",
            },
            {
              id: "sort-c20-sunday",
              text: "The Sunday routine you both had and you'd rather not continue",
              correctBucket: "falls-away",
              correction: "Shared, and it doesn't survive without both people.",
            },
            {
              id: "sort-c20-cooking",
              text: "Cooking properly, which you learned from them",
              correctBucket: "keep",
              correction: "Learned from someone, held by you. It stays.",
            },
            {
              id: "sort-c20-their-family",
              text: "The way you spent every Christmas, at their family's",
              correctBucket: "falls-away",
              correction:
                "Genuinely a loss, and not one that says anything about you.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Not an audit to complete. A first pass, and it changes over months.",
          fields: [
            {
              id: "brought-and-kept",
              label: "What did you bring in that's still yours?",
              input: "text",
              placeholder: "Things that predate them and survived.",
            },
            {
              id: "adopted-and-keeping",
              label: "What did you get from them that you'd keep?",
              input: "text",
              placeholder: "This is the category most people wrongly surrender.",
            },
            {
              id: "falls-away",
              label: "What are you letting go of that was never separately yours?",
              input: "text",
              placeholder: "Losing this isn't losing yourself.",
            },
          ],
        },
        {
          kind: "output",
          heading: "What stays",
          body:
            "The middle column is the one worth protecting. Liking something because you learned it from someone is how most people come to like most things.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Building around a relationship is what long relationships do.",
            "Not who was I before \u2014 which of what I have now is mine.",
            "Adopting something doesn't make it borrowed.",
          ],
        },
      ],
      portable: [
        "Building around a relationship is what long relationships do.",
        "Not who was I before \u2014 which of what I have now is mine.",
        "Adopting something doesn't make it borrowed.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell which parts of me were mine",
        move: "Sort what I have into brought, adopted, and never separately wanted",
        lookingFor: "The adopted things I'd keep — that's the column people surrender wrongly",
        watchOut: "Trying to reconstruct who I was before. That person isn't available.",
        remember: "The cost only appeared at the end. That doesn't mean it was a mistake.",
      },
      fidelity: {
        correct:
          "Personal attributes and habits are sorted by origin and by whether they would be kept, with the adopted-and-kept category preserved rather than surrendered.",
        misuse: [
          "Discarding everything associated with the other person.",
          "Trying to reconstruct a pre-relationship self.",
          "Treating it as an audit to be completed once.",
        ],
        notMeaning:
          "It does not mean you'll feel like yourself, that the sorting is final, or that what falls away wasn't a real loss.",
      },
    },

    // ────────────────────────── Play 2 · Grief Integration ──
    {
      playId: "the-future-i-lost",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Future I Lost",
      positioning: "For the loss nobody else can see.",
      recognitionGate: {
        prompt: "Are you mourning a life that was never going to be witnessed by anyone?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI'm grieving the future I imagined.\u201d This is one of the least acknowledged losses there is, because nothing happened to it. There's no event, no date, nothing anyone can point at.",
            "But you'd been living toward it — arranging things around it, declining things because of it, assuming it. That's a substantial amount of a life, organised around something that has now stopped being true.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It's harder to grieve than the relationship for two reasons.",
            "Nobody else can see it. There's no version friends witnessed, so there's nothing to commiserate about.",
            "And it feels illegitimate — mourning something that never existed sounds like sentimentality rather than loss.",
            "It isn't. Losing an assumed future is a recognised part of this and accounts for a great deal of the disorientation.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Naming it specifically tends to be worse before it's better. A vague sense of loss is more bearable than a list.",
            "It's also the thing that lets it be grieved rather than carried indefinitely as a mood.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Be specific. Vague losses can't be mourned, only carried.",
          fields: [
            {
              id: "the-picture",
              label: "What was the life you'd assumed?",
              input: "text",
              placeholder: "Concrete. Where, who, what a normal week contained.",
            },
            {
              id: "what-i-arranged",
              label: "What did you arrange, or decline, because of it?",
              input: "text",
              placeholder: "Decisions made on the strength of it.",
            },
            {
              id: "who-knows",
              label: "Does anyone know you're mourning this?",
              input: "chips",
              suggestions: [
                "No \u2014 I've only mourned the person out loud",
                "One person",
                "It's come up vaguely",
                "Yes, I've said it plainly",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Has this been grieved as a loss, or only carried as a mood?",
          enoughLabel: "It's been grieved",
          needMoreLabel: "Carried, mostly",
          needMoreIntro:
            "That's the usual answer. An unnamed loss doesn't resolve — it becomes a general heaviness that seems to be about everything.",
          needToKnowLabel: "What I'd want someone to understand about it",
          observableLabel: "Something I could actually say out loud",
        },
        {
          kind: "output",
          heading: "The future I was living toward",
          body:
            "A real loss, named. Not sentimentality \u2014 you'd made decisions on the strength of it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Nothing happened to it. It stopped being true.",
            "Nobody witnessed it, so nobody can commiserate about it.",
            "A vague loss can't be mourned. Only carried.",
          ],
        },
      ],
      portable: [
        "Nothing happened to it. It stopped being true.",
        "Nobody witnessed it, so nobody can commiserate about it.",
        "A vague loss can't be mourned. Only carried.",
      ],
      myPlaysTemplate: {
        when: "When I'm mourning a life that never happened",
        move: "Name the specific future I was living toward",
        lookingFor: "Whether it's been grieved or only carried as a general heaviness",
        watchOut: "Dismissing it as sentimentality — I made decisions on the strength of it",
        remember: "It gets worse before better when named. That's the naming working.",
      },
      fidelity: {
        correct:
          "The assumed future is described specifically, including decisions made on the strength of it, and recognised as a loss rather than a mood.",
        misuse: [
          "Using it to construct a case that they ruined your life.",
          "Keeping it vague to make it more bearable.",
          "Treating it as sentimentality not worth naming.",
        ],
        notMeaning:
          "It does not mean the future would have happened, that naming it resolves it, or that anyone else will understand it.",
      },
    },

    // ────── Play 3 · Life Reorganization / Support-System Development ──
    {
      playId: "the-shape-of-a-life",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Shape of a Life",
      positioning: "For the part of \u201ceverything is unfamiliar\u201d that's practical.",
      recognitionGate: {
        prompt: "Has your week lost its structure entirely?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A relationship organises an enormous amount. Evenings, weekends, meals, who you tell about your day, what happens on a Sunday, who you'd call first.",
            "All of it loses its scaffolding at once, and the result presents as an identity crisis.",
            "A good deal of it is not knowing what to do on a Tuesday.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Worth separating, because the structural part responds to ordinary things. Not insight — arrangements. Something in the diary, someone to see, something that happens whether or not you feel like it.",
            "It's disproportionate to the size of the problem, and it's one of the few things that reliably helps.",
            "\u201cI don't know how to be alone\u201d is a real skill most people have had no reason to develop. It comes with practice rather than acceptance, and it's usually worse for the first stretch than it stays.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One week. What's actually in it, and what left.",
          fields: [
            {
              id: "what-went",
              label: "What did the relationship organise that's now unorganised?",
              input: "chips",
              suggestions: [
                "Evenings",
                "Weekends",
                "Meals",
                "Who I told about my day",
                "Sunday",
                "Who I'd call first",
              ],
            },
            {
              id: "one-fixed",
              label: "One thing you could put in the week that happens regardless?",
              input: "text",
              placeholder:
                "Small and fixed. Something that occurs whether or not you feel like it.",
            },
            {
              id: "one-person",
              label: "Who could you arrange to see, who you'd have to turn up for?",
              input: "text",
              placeholder: "Turning up for someone works better than turning up for yourself.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Do you have anyone you'd call first now?",
          enoughLabel: "Yes",
          needMoreLabel: "Not really",
          needMoreIntro:
            "Common, and worth naming rather than getting round. Long relationships often absorb the role that several friendships used to hold, and rebuilding that is slower than rebuilding a routine.",
          needToKnowLabel: "Who might take that place, even partly",
          observableLabel: "Something I could arrange this month",
        },
        {
          kind: "output",
          heading: "One fixed thing, one person",
          body:
            "Not a solution to the loss. Structure for the part that's structural.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Some of \u201cI don't recognise my life\u201d is not knowing what to do on a Tuesday.",
            "Arrangements, not insight.",
            "Turning up for someone works better than turning up for myself.",
          ],
        },
      ],
      portable: [
        "Some of \u201cI don't recognise my life\u201d is not knowing what to do on a Tuesday.",
        "Arrangements, not insight.",
        "Turning up for someone works better than turning up for myself.",
      ],
      myPlaysTemplate: {
        when: "When the week has lost its shape",
        move: "Put one fixed thing and one person in it",
        lookingFor: "Which part is grief and which part is missing structure",
        watchOut: "Filling the week to avoid feeling anything",
        remember: "It's disproportionate to the problem. It still helps.",
      },
      fidelity: {
        correct:
          "The structural loss is separated from the emotional one, and one fixed commitment and one social arrangement are placed in the week.",
        misuse: [
          "Filling the diary to avoid the feeling.",
          "Treating structure as a solution to the grief.",
          "Waiting to feel better before arranging anything.",
        ],
        notMeaning:
          "It does not mean the grief is structural, that a full week helps, or that you should be doing more.",
      },
      supportSignposts: [
        {
          id: "signpost-c20-practical",
          heading: "The practical side needs different people",
          body:
            "Splitting finances, sorting housing, working out arrangements for children \u2014 none of that is what this is for, and doing it badly early is expensive. A solicitor, a mediator, or a family service is the right place. Co-parenting in particular has a substantial body of specific guidance behind it and is worth going to someone for rather than working out alone.",
        },
      ],
    },

    // ────── Play 4 · Personal Agency / Identity Reconstruction ──
    {
      playId: "what-im-choosing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What I'm Choosing",
      positioning: "For \u201cI don't know what I want\u201d, without interrogating it.",
      recognitionGate: {
        prompt: "Does the question of what you want come back blank?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't know what I want anymore\u201d is usually taken as a sign of damage. It's more often a sign of capacity — knowing what you want takes spare resource, and there hasn't been any.",
            "There's also a second version: if a lot of what you wanted was calibrated against someone else's wants, the standalone version may never have been formed.",
            "Both improve, and neither improves by being interrogated.",
          ],
        },
        {
          kind: "learn",
          body: [
            "What tends to work is small and concrete — noticing what you choose when nobody's preference is in the room.",
            "Not deciding what you want. Observing what you pick, over weeks, with nobody to accommodate.",
            "That's a much lower bar than working out who you're becoming, and it's the only version that produces evidence.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Small things. Deliberately small — this doesn't work at the scale of life decisions.",
          fields: [
            {
              id: "recent-choices",
              label: "What have you chosen recently, with nobody else to consider?",
              input: "text",
              placeholder: "Food, music, how you spent an evening. Small counts.",
            },
            {
              id: "surprised",
              label: "Has anything surprised you?",
              input: "text",
              placeholder:
                "Things you assumed you liked and didn't, or the other way round.",
            },
            {
              id: "coming-back",
              label: "Is anything coming back?",
              input: "chips",
              suggestions: [
                "Something I used to enjoy",
                "Wanting to see people",
                "Caring about work",
                "Laughing at things",
                "Nothing yet",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is \u201cnothing yet\u201d the honest answer?",
          enoughLabel: "No — some things are returning",
          needMoreLabel: "Yes, genuinely nothing",
          needMoreIntro:
            "That's an honest answer and it's information rather than failure. Preference is one of the first things to go under strain and one of the later ones to return — it's not a thing to force.",
          needToKnowLabel: "What I'd notice first, if it started coming back",
          observableLabel: "Something small I'd catch myself wanting",
        },
        {
          kind: "output",
          heading: "What I've been choosing",
          body:
            "Not who you're becoming. What you pick when nobody's preference is in the room.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not knowing what I want is usually capacity, not damage.",
            "Observe what I pick. Don't interrogate what I want.",
            "Preference goes early and returns late. That's the order.",
          ],
        },
      ],
      portable: [
        "Not knowing what I want is usually capacity, not damage.",
        "Observe what I pick. Don't interrogate what I want.",
        "Preference goes early and returns late. That's the order.",
      ],
      myPlaysTemplate: {
        when: "When the question of what I want comes back blank",
        move: "Notice what I choose when nobody's preference is in the room",
        lookingFor: "Small surprises — things I assumed I liked and don't",
        watchOut: "Trying to answer it at the scale of life decisions",
        remember: "Neither version of not-knowing improves by being interrogated.",
      },
      fidelity: {
        correct:
          "Small autonomous choices are observed over time rather than preferences being interrogated or decided.",
        misuse: [
          "Applying it to large life decisions.",
          "Treating \u201cnothing yet\u201d as a failure.",
          "Deciding what you should want and calling it noticing.",
        ],
        notMeaning:
          "It does not mean your preferences will return, that you'll know soon, or that noticing accelerates it.",
      },
    },
  ],

  literature: C20_LITERATURE,

  missions: [
    {
      id: "mission-c20-mine",
      version: 1,
      playId: "what-was-mine",
      title: "Keep one adopted thing, deliberately",
      instruction:
        "Pick something you got from them that you'd keep, and do it once — knowing where it came from and keeping it anyway.",
      linkToOperation: "Retaining adopted attributes as one's own",
      attemptMeaning:
        "You kept it. Feeling odd about it is expected and doesn't mean it's borrowed.",
      suitability:
        "If everything associated with them is currently unbearable, this is too early. Come back to it.",
      progression: [
        {
          id: "rung-c20-mine-2",
          instruction: "Do the sort again in three months and see what's moved.",
        },
      ],
    },
    {
      id: "mission-c20-future",
      version: 1,
      playId: "the-future-i-lost",
      title: "Say it to one person",
      instruction:
        "Tell someone you trust that you're mourning the future, not just the person. Most people have never heard it named.",
      linkToOperation: "Naming an unwitnessed loss to another person",
      attemptMeaning:
        "You said it. Whether they understood is separate.",
      suitability:
        "Pick someone who won't tell you there'll be another future. That's the wrong response and it's the common one.",
      progression: [
        {
          id: "rung-c20-future-2",
          instruction: "Name a second one — a smaller assumed future you also lost.",
        },
      ],
    },
    {
      id: "mission-c20-week",
      version: 1,
      playId: "the-shape-of-a-life",
      title: "Three weeks of the fixed thing",
      instruction:
        "Do it three weeks running, whether or not you feel like it. Note only whether you went.",
      linkToOperation: "Reorganising life structure after relational loss",
      attemptMeaning:
        "You went. Whether it helped isn't the measure for the first three.",
      suitability:
        "If three is too many, do one. The point is that it happens regardless of how you feel.",
      progression: [
        {
          id: "rung-c20-week-2",
          instruction: "Add the person — arrange to see someone you'd have to turn up for.",
        },
      ],
    },
    {
      id: "mission-c20-choosing",
      version: 1,
      playId: "what-im-choosing",
      title: "Notice for two weeks",
      instruction:
        "For two weeks, note small things you chose with nobody else to consider. Don't evaluate them.",
      linkToOperation: "Observing autonomous preference as it returns",
      attemptMeaning:
        "You noticed. An empty list after two weeks is information, not failure.",
      suitability:
        "If it becomes another way of assessing whether you're recovering properly, stop.",
      progression: [
        {
          id: "rung-c20-choosing-2",
          instruction: "Choose one thing deliberately that they'd have disliked.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c20-mine",
      version: 1,
      playId: "what-was-mine",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Sorted into three categories, not two",
          "Kept something adopted",
          "Let something go without it feeling like loss",
          "Discarded everything associated with them",
        ],
      },
      performedOperation: {
        label: "Did you sort by origin and by whether you'd keep it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much is genuinely mine",
          "That the adopted things are mine too",
          "How much was never separately mine",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything felt like theirs",
          "I couldn't keep anything of theirs",
          "I tried to find who I was before",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c20-future",
      version: 1,
      playId: "the-future-i-lost",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named the specific future",
          "Named what I'd arranged around it",
          "Said it to someone",
          "Kept it vague",
        ],
      },
      performedOperation: {
        label: "Did you describe the assumed future specifically?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's a real loss, not sentimentality",
          "How much I'd arranged around it",
          "That I'd never named it out loud",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Naming it made it much worse",
          "They said there'd be another future",
          "It turned into anger at them",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c20-week",
      version: 1,
      playId: "the-shape-of-a-life",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Put one fixed thing in",
          "Went when I didn't feel like it",
          "Arranged to see someone",
          "Waited to feel better first",
        ],
      },
      performedOperation: {
        label: "Did you put a fixed thing and a person in the week?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much was missing structure",
          "That there's nobody I'd call first",
          "That going helped a little",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't make myself go",
          "There wasn't anyone to arrange with",
          "I filled the week and felt worse",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c20-choosing",
      version: 1,
      playId: "what-im-choosing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed small choices",
          "Didn't evaluate them",
          "Kept it small",
          "Tried to answer it at life scale",
        ],
      },
      performedOperation: {
        label: "Did you observe small choices rather than interrogate preferences?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Something surprised me",
          "Something is coming back",
          "That nothing is yet, and that's where I am",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The list stayed empty",
          "It became a test of whether I'm recovering",
          "I couldn't tell what was mine",
          "Nothing stuck",
        ],
      },
    },
  ],
};
