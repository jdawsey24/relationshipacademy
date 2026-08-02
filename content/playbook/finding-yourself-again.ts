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

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const FINDING_YOURSELF_AGAIN: PlaybookContent = {
  playbookKey: "finding-yourself-again",
  playbookVersion: 1,
  displayName: "Finding Yourself Again",

  opening: {
    title: "It took something else with it",
    body: [
      "Not just the person. It also took the version of you that lived inside it. People say \u201cI don't recognise myself anymore\u201d with some embarrassment, as if it's an overreaction. It isn't.",
      "Three losses are tangled up here. The person. The future you thought you'd have. And the way your life was set up. Each one needs a different thing. But most people try to handle all three the same way.",
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
        "Nearly everyone whose relationship ends says this. The people who were left, and the people who left. The word \u201cfailure\u201d means there was a task you could pass or fail. And the only way to pass is \u201cstaying together.\u201d That makes every ending a failure, no matter what was in it. Nobody uses that test on a friendship, a job, or a city they moved away from.",
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
        "This Playbook is for people whose relationship ended while both are still alive. Some of it would land badly on you, because the tools assume someone made a choice. Losing a partner to death is a different kind of hurt, with different questions. Does going on with your life mean leaving them behind? How do you want company again without it feeling like a betrayal? There's a matching Playbook for that, and it's the right one.",
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
        "This isn't you failing to be independent. It's what long relationships do. The cost only shows up at the end, when it's hard to tell which parts were ever just yours.",
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
        "This is one of the least talked-about losses there is, because nothing happened to it. It just stopped being true.",
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
        "A relationship holds a huge amount in place. When it ends, it can feel like an identity crisis. But a lot of it is just not knowing what to do on a Tuesday.",
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
        "Usually this is about not having spare energy, not about something being broken. Knowing what you want takes spare energy, and there hasn't been any.",
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
      positioning: "For working out which parts of you were ever just yours.",
      recognitionGate: {
        prompt: "Is it hard to tell which parts of your life were yours and which were theirs?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Building your identity around a relationship isn't you failing to be independent. It's what long relationships do. It happens without anyone choosing it.",
            "Two people who live side by side for years share tastes, friends, in-jokes, and routines. That's not a sign of something unhealthy. It's most of what being close creates.",
            "The cost only shows up at the end, when it's hard to tell which of it was ever just yours.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The question isn't who you were before. That person is years out of date, and you can't go back to them.",
            "The question is which parts of what you have now are yours. And there are three kinds, not two.",
            "Things you brought in and kept. Things they brought that you took on and would keep. And things you only did because they wanted to, and never really wanted yourself.",
            "Most people think the middle kind has to be given up. It doesn't. Learning to like something from someone else is how most people come to like most things.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these would you keep?",
          situation:
            "You're going through the everyday stuff of your life \u2014 what you listen to, who you see, what you do on the weekend \u2014 and a lot of it came from them.",
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
                "Taking something on doesn't make it borrowed. That's yours now.",
            },
            {
              id: "sort-c20-their-sport",
              text: "The sport you watched because they did, and never cared about",
              correctBucket: "falls-away",
              correction:
                "That's the third kind. Losing it isn't losing yourself.",
            },
            {
              id: "sort-c20-friends",
              text: "Friends who were originally theirs but became yours",
              correctBucket: "keep",
              correction:
                "It's messy in real life, but the friendship is real either way.",
            },
            {
              id: "sort-c20-sunday",
              text: "The Sunday routine you both had and you'd rather not continue",
              correctBucket: "falls-away",
              correction: "This was shared, and it doesn't last without both of you.",
            },
            {
              id: "sort-c20-cooking",
              text: "Cooking properly, which you learned from them",
              correctBucket: "keep",
              correction: "You learned it from someone, but you hold it now. It stays.",
            },
            {
              id: "sort-c20-their-family",
              text: "The way you spent every Christmas, at their family's",
              correctBucket: "falls-away",
              correction:
                "This is a real loss, and it doesn't say anything about you.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "This isn't a checklist to finish. It's a first pass, and it changes over months.",
          fields: [
            {
              id: "brought-and-kept",
              label: "What did you bring in that's still yours?",
              input: "text",
              placeholder: "Things you had before them that are still here.",
            },
            {
              id: "adopted-and-keeping",
              label: "What did you get from them that you'd keep?",
              input: "text",
              placeholder: "This is the kind most people give up by mistake.",
            },
            {
              id: "falls-away",
              label: "What are you letting go of that was never just yours?",
              input: "text",
              placeholder: "Losing this isn't losing yourself.",
            },
          ],
        },
        {
          kind: "output",
          heading: "What stays",
          body:
            "The middle column is the one worth protecting. Learning to like something from someone else is how most people come to like most things.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Building around a relationship is what long relationships do.",
            "Not who was I before \u2014 which of what I have now is mine.",
            "Taking something on doesn't make it borrowed.",
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
        move: "Sort what I have into brought in, took on, and never wanted on my own",
        lookingFor: "The things I took on that I'd keep — that's the column people give up by mistake",
        watchOut: "Trying to rebuild who I was before. That person isn't around to go back to.",
        remember: "The cost only appeared at the end. That doesn't mean it was a mistake.",
      },
      fidelity: {
        correct:
          "You sort your traits and habits by where they came from and by whether you'd keep them, holding on to the took-on-and-kept ones rather than giving them up.",
        misuse: [
          "Throwing out everything tied to the other person.",
          "Trying to rebuild the self you were before the relationship.",
          "Treating it as a checklist to finish in one go.",
        ],
        notMeaning:
          "It doesn't mean you'll feel like yourself, that the sorting is final, or that what falls away wasn't a real loss.",
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
        prompt: "Are you mourning a life that nobody else was ever going to see?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI'm grieving the future I imagined.\u201d This is one of the least talked-about losses there is, because nothing happened to it. There's no event, no date, nothing anyone can point to.",
            "But you'd been living toward it. You arranged things around it. You said no to things because of it. You counted on it. That's a big part of a life, built around something that has now stopped being true.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It's harder to grieve than the relationship for two reasons.",
            "Nobody else can see it. Friends never saw it, so there's nothing for them to share the sadness over.",
            "And it feels like you're not allowed to. Mourning something that never happened sounds like being sentimental, not like real loss.",
            "It isn't. Losing a future you'd counted on is a known part of this, and it explains a lot of feeling lost.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Naming it exactly tends to feel worse before it feels better. A fuzzy sense of loss is easier to carry than a clear list.",
            "But naming it is also what lets you grieve it, instead of carrying it forever as a mood.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Be specific. A fuzzy loss can't be mourned, only carried.",
          fields: [
            {
              id: "the-picture",
              label: "What was the life you'd counted on?",
              input: "text",
              placeholder: "Be concrete. Where, who, what a normal week looked like.",
            },
            {
              id: "what-i-arranged",
              label: "What did you set up, or say no to, because of it?",
              input: "text",
              placeholder: "Choices you made because you were counting on it.",
            },
            {
              id: "who-knows",
              label: "Does anyone know you're mourning this?",
              input: "chips",
              suggestions: [
                "No \u2014 I've only grieved the person out loud",
                "One person",
                "It's come up, but not clearly",
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
            "That's the usual answer. A loss you never name doesn't go away. It turns into a heaviness that seems to be about everything.",
          needToKnowLabel: "What I'd want someone to understand about it",
          observableLabel: "Something I could actually say out loud",
        },
        {
          kind: "output",
          heading: "The future I was living toward",
          body:
            "A real loss, named. Not being sentimental. You made choices because you were counting on it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Nothing happened to it. It stopped being true.",
            "Nobody saw it, so nobody can share the sadness of it.",
            "A fuzzy loss can't be mourned. Only carried.",
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
        move: "Name the exact future I was living toward",
        lookingFor: "Whether I've grieved it or just carried it as a heaviness",
        watchOut: "Brushing it off as sentimental. I made real choices because of it",
        remember: "It feels worse before better when I name it. That's the naming working.",
      },
      fidelity: {
        correct:
          "You describe the future you'd counted on in detail, including the choices you made because of it, and treat it as a real loss rather than a mood.",
        misuse: [
          "Using it to build a case that they ruined your life.",
          "Keeping it fuzzy to make it easier to bear.",
          "Treating it as sentimental and not worth naming.",
        ],
        notMeaning:
          "It doesn't mean the future would have happened, that naming it fixes it, or that anyone else will understand it.",
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
        prompt: "Has your week completely lost its shape?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A relationship holds a huge amount in place. Evenings, weekends, meals, who you tell about your day, what happens on a Sunday, who you'd call first.",
            "All of it loses its frame at once, and it can feel like an identity crisis.",
            "A good deal of it is not knowing what to do on a Tuesday.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It's worth pulling these apart, because the practical part answers to ordinary things. Not deep insight. Plans. Something on the calendar, someone to see, something that happens whether or not you feel like it.",
            "It seems too small for the size of the problem, but it's one of the few things that reliably helps.",
            "\u201cI don't know how to be alone\u201d points to a real skill, and most people have had no reason to build it. It comes with practice, not with accepting it, and it's usually worse at the start than it stays.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One week. What's really in it, and what's gone.",
          fields: [
            {
              id: "what-went",
              label: "What did the relationship hold in place that's now loose?",
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
              label: "One thing you could put in the week that happens no matter what?",
              input: "text",
              placeholder:
                "Small and set. Something that happens whether or not you feel like it.",
            },
            {
              id: "one-person",
              label: "Who could you arrange to see, who you'd have to show up for?",
              input: "text",
              placeholder: "Showing up for someone else works better than showing up for yourself.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Do you have anyone you'd call first now?",
          enoughLabel: "Yes",
          needMoreLabel: "Not really",
          needMoreIntro:
            "This is common, and worth naming instead of stepping around. Long relationships often take over the role that several friendships used to fill, and building that back is slower than building back a routine.",
          needToKnowLabel: "Who might take that place, even partly",
          observableLabel: "Something I could arrange this month",
        },
        {
          kind: "output",
          heading: "One fixed thing, one person",
          body:
            "Not a fix for the loss. Some shape for the part that needs shape.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Some of \u201cI don't recognise my life\u201d is not knowing what to do on a Tuesday.",
            "Plans, not deep insight.",
            "Showing up for someone else works better than showing up for myself.",
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
        move: "Put one set thing and one person in it",
        lookingFor: "Which part is grief and which part is a missing routine",
        watchOut: "Filling the week to avoid feeling anything",
        remember: "It seems too small for the problem. It still helps.",
      },
      fidelity: {
        correct:
          "You pull the practical loss apart from the emotional one, and put one set commitment and one plan to see someone into the week.",
        misuse: [
          "Packing the calendar to dodge the feeling.",
          "Treating routine as a fix for the grief.",
          "Waiting to feel better before arranging anything.",
        ],
        notMeaning:
          "It doesn't mean the grief is just a missing routine, that a full week helps, or that you should be doing more.",
      },
      supportSignposts: [
        {
          id: "signpost-c20-practical",
          heading: "The practical side needs different people",
          body:
            "Splitting finances, sorting out housing, working out plans for the children. None of that is what this is for, and getting it wrong early costs a lot. A lawyer, a mediator, or a family service is the right place. Co-parenting especially has a large body of specific guidance behind it, and it's worth going to someone for rather than working it out on your own.",
        },
      ],
    },

    // ────── Play 4 · Personal Agency / Identity Reconstruction ──
    {
      playId: "what-im-choosing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What I'm Choosing",
      positioning: "For \u201cI don't know what I want,\u201d without grilling yourself about it.",
      recognitionGate: {
        prompt: "Does the question of what you want come back blank?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't know what I want anymore\u201d is usually read as a sign something's broken. More often it's a sign you're stretched thin. Knowing what you want takes spare energy, and there hasn't been any.",
            "There's also a second version. If a lot of what you wanted was measured against what someone else wanted, the on-your-own version may never have formed.",
            "Both get better, and neither gets better by grilling yourself about it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "What tends to work is small and concrete. Noticing what you pick when nobody else's wishes are in the room.",
            "Not deciding what you want. Watching what you pick, over weeks, with nobody to please.",
            "That's a much easier task than figuring out who you're becoming, and it's the only version that gives you real proof.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Small things. On purpose small. This doesn't work for big life decisions.",
          fields: [
            {
              id: "recent-choices",
              label: "What have you picked lately, with nobody else to think about?",
              input: "text",
              placeholder: "Food, music, how you spent an evening. Small counts.",
            },
            {
              id: "surprised",
              label: "Has anything surprised you?",
              input: "text",
              placeholder:
                "Things you thought you liked and didn't, or the other way around.",
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
          enoughLabel: "No — some things are coming back",
          needMoreLabel: "Yes, genuinely nothing",
          needMoreIntro:
            "That's an honest answer, and it's information, not failure. What you prefer is one of the first things to go under strain and one of the last to come back. It's not something to force.",
          needToKnowLabel: "What I'd notice first, if it started coming back",
          observableLabel: "Something small I'd catch myself wanting",
        },
        {
          kind: "output",
          heading: "What I've been choosing",
          body:
            "Not who you're becoming. What you pick when nobody else's wishes are in the room.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not knowing what I want is usually about being stretched thin, not broken.",
            "Watch what I pick. Don't grill myself about what I want.",
            "What I prefer goes early and comes back late. That's the order.",
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
        move: "Notice what I pick when nobody else's wishes are in the room",
        lookingFor: "Small surprises. Things I thought I liked and don't",
        watchOut: "Trying to answer it with big life decisions",
        remember: "Neither kind of not-knowing gets better by grilling myself about it.",
      },
      fidelity: {
        correct:
          "You watch small choices you make on your own over time, instead of grilling yourself about what you want or deciding it.",
        misuse: [
          "Using it for big life decisions.",
          "Treating \u201cnothing yet\u201d as a failure.",
          "Deciding what you should want and calling it noticing.",
        ],
        notMeaning:
          "It doesn't mean your preferences will come back, that you'll know soon, or that noticing speeds it up.",
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
        "You kept it. Feeling odd about it is normal and doesn't mean it's borrowed.",
      suitability:
        "If everything tied to them is too much to bear right now, this is too early. Come back to it later.",
      progression: [
        {
          id: "rung-c20-mine-2",
          instruction: "Do the sort again in three months and see what's changed.",
        },
      ],
    },
    {
      id: "mission-c20-future",
      version: 1,
      playId: "the-future-i-lost",
      title: "Say it to one person",
      instruction:
        "Tell someone you trust that you're mourning the future, not just the person. Most people have never heard it said out loud.",
      linkToOperation: "Naming an unwitnessed loss to another person",
      attemptMeaning:
        "You said it. Whether they understood is separate.",
      suitability:
        "Pick someone who won't tell you there'll be another future. That's the wrong thing to say, and it's the common one.",
      progression: [
        {
          id: "rung-c20-future-2",
          instruction: "Name a second one. A smaller future you'd counted on and also lost.",
        },
      ],
    },
    {
      id: "mission-c20-week",
      version: 1,
      playId: "the-shape-of-a-life",
      title: "Three weeks of the fixed thing",
      instruction:
        "Do it three weeks in a row, whether or not you feel like it. Note only whether you went.",
      linkToOperation: "Reorganising life structure after relational loss",
      attemptMeaning:
        "You went. Whether it helped isn't the point for the first three.",
      suitability:
        "If three is too many, do one. The point is that it happens no matter how you feel.",
      progression: [
        {
          id: "rung-c20-week-2",
          instruction: "Add the person. Arrange to see someone you'd have to show up for.",
        },
      ],
    },
    {
      id: "mission-c20-choosing",
      version: 1,
      playId: "what-im-choosing",
      title: "Notice for two weeks",
      instruction:
        "For two weeks, note small things you chose with nobody else to think about. Don't judge them.",
      linkToOperation: "Observing autonomous preference as it returns",
      attemptMeaning:
        "You noticed. An empty list after two weeks is information, not failure.",
      suitability:
        "If it turns into one more way of checking whether you're recovering right, stop.",
      progression: [
        {
          id: "rung-c20-choosing-2",
          instruction: "Choose one thing on purpose that they'd have disliked.",
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
          "Sorted into three kinds, not two",
          "Kept something I took on",
          "Let something go without it feeling like loss",
          "Threw out everything tied to them",
        ],
      },
      performedOperation: {
        label: "Did you sort by where it came from and whether you'd keep it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much is really mine",
          "That the things I took on are mine too",
          "How much was never just mine",
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
          "Named the exact future",
          "Named what I'd arranged around it",
          "Said it to someone",
          "Kept it fuzzy",
        ],
      },
      performedOperation: {
        label: "Did you describe the future you'd counted on in detail?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's a real loss, not being sentimental",
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
          "Put one set thing in",
          "Went when I didn't feel like it",
          "Arranged to see someone",
          "Waited to feel better first",
        ],
      },
      performedOperation: {
        label: "Did you put a set thing and a person in the week?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much was a missing routine",
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
          "I packed the week and felt worse",
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
          "Didn't judge them",
          "Kept it small",
          "Tried to answer it with big decisions",
        ],
      },
      performedOperation: {
        label: "Did you watch small choices instead of grilling yourself about what you want?",
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
