/**
 * Cluster 12 — "Difficulty Letting Go of What's Already Over" — VOLUME I
 * The Relationship Playbook™ · Letting Go
 *
 * Track: RECOVERY (38 of 58 statements) — first Recovery cluster built.
 * Task = Healing. Core Need: TO HEAL. Plays-only.
 * Competencies from Recovery_and_Renewal_Competency_Manual_v0_1.
 *
 * ⚠ TWO VOLUMES, splitting on the canonical subtitle. Volume I is the letting
 *   go (Recovery). Volume II is dating again afterwards (Renewal, 20) —
 *   authored separately. Readers there route out via `rec-c12-ready-to-date`.
 *
 * ⚠⚠ SAFETY — HIGHEST OF ANY CLUSTER. The most acutely distressed population in
 *   the corpus. `signpost-c12-not-coping` names post-loss depression and
 *   suicidal thinking explicitly, and sits on the identity Play. The literature
 *   entry `lit-c12-never-heal` carries the same. REQUIRES CLINICAL REVIEW
 *   BEFORE PUBLISH — this is the single highest-priority safety item.
 *
 * ⚠ NO TIMELINE CLAIMS. Nothing says how long grief takes, that it gets easier,
 *   or that the reader is behind.
 *
 * ⚠ THE CHECKING IS NOT SHAMED. Near-universal after a breakup. Content
 *   addresses cost and mechanism, never entitlement.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   the-checking       → Constructive Disengagement · Emotional Regulation
 *   what-was-mine      → Responsibility Differentiation · Self-Compassion
 *   what-actually-happened → Narrative Integration
 *   the-shape-of-a-week → Identity Reconstruction · Life Reorganization
 *
 * ⚠ CLAIM SCOPE. May claim: see what the checking costs; separate what was
 *   yours from what wasn't; hold an account that doesn't require rewriting;
 *   rebuild the structure a week had. MUST NOT CLAIM: that it gets easier, that
 *   you'll heal, that the relationship was or wasn't real, or that letting go
 *   is achievable on any timeline.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C12_LITERATURE } from "./letting-go-literature";

export const LETTING_GO: PlaybookContent = {
  playbookKey: "letting-go",
  playbookVersion: 1,
  displayName: "Letting Go",

  opening: {
    title: "It's over and you're still in it",
    body: [
      "Not by choice. You've probably tried a good deal not to be.",
      "Two things are happening at once. Grief, which doesn't respond to reasoning and takes as long as it takes. And a search — for an explanation, a moment you could have changed, a reason. That second one feels productive and mostly isn't.",
      "Nothing here will tell you how long this should take, or that it gets easier, or that you're behind.",
    ],
    manifestations: [
      "I can't move on.",
      "I keep replaying everything.",
      "Why wasn't I enough?",
      "I don't know who I am anymore.",
    ],
    cta: "Start with what the searching is for",
  },

  recognitionCards: [
    {
      id: "rec-c12-never-heal",
      role: "validate",
      pathwayPlayId: null,
      headline: "I'm afraid I'll never heal.",
      validationCopy:
        "That's a reasonable fear and we're not going to reassure you out of it — the reassurance is usually hollow and you'd know. What can honestly be said: most people find it changes, and rarely in the way they expected. Not the absence of it, but it taking up less of the day. Some carry a version of it permanently and still build good lives. Those aren't in conflict.",
      secondaryExamples: [
        "I'm afraid I'll never feel that way again.",
        "I don't know if I'll ever love again.",
        "I miss being in a relationship.",
      ],
    },
    {
      id: "rec-c12-ready-to-date",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm thinking about dating again and don't know how.",
      validationCopy:
        "That's the next part rather than this one. Working out how much of your past to share, when to mention what happened, whether you're ready — those need different tools, and they assume the letting go is at least underway. Look for the Playbook about moving forward. You can come back to this one; plenty of people move between them.",
      secondaryExamples: [
        "I don't know how to date anymore.",
        "Dating apps weren't around last time I was single.",
        "I don't know if I'm ready.",
      ],
    },
    {
      id: "rec-c12-bereaved",
      role: "signpost",
      pathwayPlayId: null,
      headline: "My partner died.",
      validationCopy:
        "This one would land badly on you, and we'd rather say so than let you find out three screens in. The tools here assume someone made a choice \u2014 they're about what was yours, what was theirs, and what the checking is for. None of that is your situation. Losing a partner to death is a different injury with different questions: whether going on means leaving them behind, how to want company without it feeling like a betrayal. There's something written for that, and it's the right thing to read.",
      secondaryExamples: [
        "I feel guilty for laughing again.",
        "I still think of us as \u201cwe.\u201d",
        "No one understands this kind of grief.",
      ],
    },
    {
      id: "rec-c12-checking",
      role: "route",
      pathwayPlayId: "the-checking",
      headline: "I keep checking their social media.",
      explanation:
        "Nearly everyone does. It also keeps the relationship in a present tense — something still being updated isn't over the way something finished is.",
      secondaryExamples: [
        "I wonder if they miss me.",
        "I still hope they'll come back.",
        "I wish I could stop thinking about them.",
      ],
    },
    {
      id: "rec-c12-blame",
      role: "route",
      pathwayPlayId: "what-was-mine",
      headline: "Why wasn't I enough?",
      explanation:
        "A question with a false premise in it. Relationships don't end because someone was insufficient.",
      secondaryExamples: [
        "I keep blaming myself.",
        "I ignored what I already knew.",
        "I regret not trusting myself.",
      ],
    },
    {
      id: "rec-c12-was-it-real",
      role: "route",
      pathwayPlayId: "what-actually-happened",
      headline: "I question whether any of it was real.",
      explanation:
        "The ending recasts everything. Something can be genuinely good and still end — those aren't in tension, though they feel like it.",
      secondaryExamples: [
        "I don't know how to trust my memories.",
        "I compare everyone to my ex.",
        "I keep replaying everything.",
      ],
    },
    {
      id: "rec-c12-who-am-i",
      role: "route",
      pathwayPlayId: "the-shape-of-a-week",
      headline: "I don't know who I am anymore.",
      explanation:
        "A long relationship organises a lot. Some of what feels like an identity crisis is not knowing what to do on a Tuesday.",
      secondaryExamples: [
        "I don't know how to start over.",
        "I don't know how to close this chapter.",
        "I don't know how to let go.",
      ],
    },
  ],

  plays: [
    // ────────────────── Play 1 · Constructive Disengagement ──
    {
      playId: "the-checking",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Checking",
      positioning: "For the contact that keeps it in the present tense.",
      recognitionGate: {
        prompt: "Do you look, and find it doesn't help?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "First: nearly everyone does this. It isn't weakness and it isn't a sign your recovery has gone wrong.",
            "It's also doing something mechanical. Contact — even one-sided, even through a screen — keeps the relationship in a present tense. Something still being updated isn't over the way something finished is.",
            "Nothing here tells you to stop as an act of will. That mostly produces a few good days and a worse relapse.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Each check delivers three things. A few seconds of contact, which is genuinely relieving. New information to process, which restarts the thinking. And no resolution.",
            "That last one is structural. If they look happy, that hurts. If they look unhappy, that's hope, which hurts differently. There's nothing you could see that would settle it.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "An honest count. No judgement attached to any of it.",
          fields: [
            {
              id: "where",
              label: "Where do you look?",
              input: "chips",
              suggestions: [
                "Their social media",
                "Mutual friends' posts",
                "Old messages",
                "Whether they've been online",
                "Their new person, if there is one",
              ],
            },
            {
              id: "how-often",
              label: "Roughly how often?",
              input: "text",
              placeholder: "Most people underestimate. A guess is fine.",
            },
            {
              id: "after",
              label: "How do you feel in the ten minutes afterwards?",
              input: "text",
              placeholder: "Honestly, including if it's sometimes better.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is there anything you could see that would actually settle it?",
          enoughLabel: "Yes — there's something",
          needMoreLabel: "No — nothing would",
          needMoreIntro:
            "That's the usual answer and it's the important one. If nothing you could see would settle it, the checking isn't gathering information. It's contact, and contact is what's being paid for.",
          needToKnowLabel: "What I'd actually want to know",
          observableLabel: "Something that would have to come from outside my looking",
        },
        {
          kind: "output",
          heading: "What the checking gives me",
          body:
            "Not a decision to stop. A clear view of what it delivers and what it can't.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Something still being updated isn't over the way something finished is.",
            "Happy hurts. Unhappy is hope, which hurts differently.",
            "Nearly everyone does this. It's the cost worth looking at, not whether I'm allowed.",
          ],
        },
      ],
      portable: [
        "Something still being updated isn't over the way something finished is.",
        "Happy hurts. Unhappy is hope, which hurts differently.",
        "Nearly everyone does this. It's the cost worth looking at, not whether I'm allowed.",
      ],
      myPlaysTemplate: {
        when: "When I keep looking and it doesn't help",
        move: "Look at what each check actually delivers, and what it can't",
        lookingFor: "Whether anything I could see would settle it",
        watchOut: "Turning this into shame about checking — that isn't the exercise",
        remember: "Stopping as an act of will mostly produces a worse relapse.",
      },
      fidelity: {
        correct:
          "The checking is examined for what it delivers and whether any result could settle the question, without judgement about entitlement.",
        misuse: [
          "Using it to conclude you're pathetic or stuck.",
          "Stopping abruptly and treating a relapse as failure.",
          "Checking more thoroughly to get a better answer.",
        ],
        notMeaning:
          "It does not mean you should stop, that stopping would help, or that the wanting to look is a problem.",
      },
    },

    // ───── Play 2 · Responsibility Differentiation / Self-Compassion ──
    {
      playId: "what-was-mine",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Was Actually Mine",
      positioning: "For the account you've been keeping against yourself.",
      recognitionGate: {
        prompt: "Have you concluded that most of it was your fault?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cWhy wasn't I enough?\u201d has a false premise in it. Relationships don't end because someone was insufficient — they end for reasons that mostly aren't about anyone's total worth.",
            "But the question is doing something, and it's worth seeing what.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Three categories, and most people collapse them into one.",
            "Yours — things you did or didn't do, which you could have chosen differently. Theirs — their choices, their limits, their reasons, including ones you never had access to. And neither's — timing, circumstance, incompatibility nobody caused.",
            "Taking all three isn't humility. It's a way of keeping some control: if it was all yours, it was preventable, and next time you could prevent it. Which is why separating them can feel like a loss rather than a relief.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Sort these three ways.",
          situation:
            "You've been going back through it for weeks. Most of what you find lands in the same column.",
          buckets: [
            { id: "mine", label: "Mine" },
            { id: "theirs", label: "Theirs" },
            { id: "neither", label: "Neither's" },
          ],
          items: [
            {
              id: "sort-c12-stayed-quiet",
              text: "I didn't say what I needed for two years",
              correctBucket: "mine",
              correction: "Yours, and genuinely so. That's the useful column.",
            },
            {
              id: "sort-c12-they-lied",
              text: "They didn't tell me they'd already checked out",
              correctBucket: "theirs",
              correction: "Their choice, made with information you didn't have.",
            },
            {
              id: "sort-c12-different-things",
              text: "We wanted different lives",
              correctBucket: "neither",
              correction: "Nobody caused that. It's the hardest column to accept.",
            },
            {
              id: "sort-c12-their-capacity",
              text: "They weren't able to give what I needed",
              correctBucket: "theirs",
              correction: "About their capacity. Not a verdict on what you needed.",
            },
            {
              id: "sort-c12-ignored",
              text: "I ignored what I already knew",
              correctBucket: "mine",
              correction: "Yours \u2014 and read the regret guide before you weigh it too heavily.",
            },
            {
              id: "sort-c12-timing",
              text: "It happened in the worst year either of us had had",
              correctBucket: "neither",
              correction: "Circumstance. Real, and not authored by anyone.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Your own account. Try to put at least one thing in each column — the difficulty is usually the last two.",
          fields: [
            {
              id: "mine",
              label: "What was genuinely yours?",
              input: "text",
              placeholder: "Specific. Things you chose or didn't.",
            },
            {
              id: "theirs",
              label: "What was theirs?",
              input: "text",
              placeholder: "Their choices, their limits, what they didn't tell you.",
            },
            {
              id: "neither",
              label: "What was neither of yours?",
              input: "text",
              placeholder: "Timing, circumstance, incompatibility nobody caused.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Were you able to put anything in the second and third columns?",
          enoughLabel: "Yes",
          needMoreLabel: "Not really — it all went in mine",
          needMoreIntro:
            "Very common, and worth sitting with rather than forcing. If it was all yours, it was preventable — and giving that up means accepting that some of it wasn't in anyone's hands.",
          needToKnowLabel: "One thing that might belong elsewhere",
          observableLabel: "Something they did, or something neither of you chose",
        },
        {
          kind: "output",
          heading: "The three columns",
          body:
            "Separating them isn't taking none. There's usually something genuinely yours, and it's the only part you could do anything with.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Taking all of it isn't humility. It's a way of keeping control.",
            "Yours, theirs, neither's. Most people only use one column.",
            "Relationships don't end because someone was insufficient.",
          ],
        },
      ],
      portable: [
        "Taking all of it isn't humility. It's a way of keeping control.",
        "Yours, theirs, neither's. Most people only use one column.",
        "Relationships don't end because someone was insufficient.",
      ],
      myPlaysTemplate: {
        when: "When I've concluded most of it was my fault",
        move: "Sort what happened into mine, theirs, and neither's",
        lookingFor: "Whether I can put anything at all in the last two columns",
        watchOut: "Using the exercise to move everything into theirs instead",
        remember: "If it was all mine, it was preventable. That's the appeal, and it isn't true.",
      },
      fidelity: {
        correct:
          "Responsibility is separated into the reader's own, the other person's, and neither's, with something placed in each column where honest.",
        misuse: [
          "Moving everything into the other person's column.",
          "Using it to build a case against them.",
          "Concluding you bear none of it.",
        ],
        notMeaning:
          "It does not mean you weren't at fault, that they were, or that sorting it reduces the grief.",
      },
    },

    // ──────────────────────── Play 3 · Narrative Integration ──
    {
      playId: "what-actually-happened",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Actually Happened",
      positioning: "For an account that doesn't require rewriting the good parts.",
      recognitionGate: {
        prompt: "Has the ending changed how you remember all of it?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI question whether any of it was real.\u201d This arrives once the ending recasts everything — the good parts start to look like evidence of something you missed.",
            "But an ending doesn't retroactively unmake what happened. Something can be genuinely good and still end. Those aren't in tension, though they feel like it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Someone can also have meant it at the time and stopped meaning it later. That's more common than deception, and it's harder to hold because it can't be filed anywhere clean.",
            "The account that includes both — it was real, and it ended — is more accurate than either the rewritten version or the preserved one. It's also the hardest to hold, which is why people generally pick a side.",
            "If you were actively deceived, that's different. Rewriting isn't distortion then; it's updating on information you didn't have.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Two lists, both true. Most people can only write one of them at a time.",
          fields: [
            {
              id: "was-real",
              label: "What was genuinely good, that you now doubt?",
              input: "text",
              placeholder: "Specific moments. The ones the ending has cast into question.",
            },
            {
              id: "was-also-true",
              label: "And what was also true, that you knew even then?",
              input: "text",
              placeholder: "The things that were there alongside the good.",
            },
            {
              id: "which-side",
              label: "Which version do you find yourself telling?",
              input: "chips",
              suggestions: [
                "The rewritten one — it was never good",
                "The preserved one — it was good, and I ruined it",
                "It depends on the day",
                "I'm trying to hold both",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Can both lists be true at once, without one cancelling the other?",
          enoughLabel: "Yes — both, at the same time",
          needMoreLabel: "Not yet — one keeps cancelling the other",
          needMoreIntro:
            "That's expected and it isn't a failure of the exercise. Holding both is the harder position and it usually arrives late rather than by deciding.",
          needToKnowLabel: "What makes it hard to hold both",
          observableLabel: "Something I'd notice about which version I tell",
        },
        {
          kind: "output",
          heading: "The account with both in it",
          body:
            "It was real, and it ended. The most accurate version, and the least comfortable.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "An ending doesn't retroactively unmake what happened.",
            "They may have meant it then and stopped meaning it later.",
            "Both lists are true. That's harder than picking one.",
          ],
        },
      ],
      portable: [
        "An ending doesn't retroactively unmake what happened.",
        "They may have meant it then and stopped meaning it later.",
        "Both lists are true. That's harder than picking one.",
      ],
      myPlaysTemplate: {
        when: "When the ending has recast everything that came before",
        move: "Hold what was real and what was also true, at the same time",
        lookingFor: "Which version I default to telling",
        watchOut: "Picking a side because holding both is uncomfortable",
        remember: "If I was actively deceived, rewriting isn't distortion — it's updating.",
      },
      fidelity: {
        correct:
          "Both the genuine good and the concurrent difficulty are held in one account, without either cancelling the other.",
        misuse: [
          "Using it to preserve an idealised version.",
          "Using it to establish that none of it counted.",
          "Applying it where there was actual deception.",
        ],
        notMeaning:
          "It does not mean the relationship was good, that it was bad, or that a coherent account reduces the loss.",
      },
    },

    // ───── Play 4 · Identity Reconstruction / Life Reorganization ──
    {
      playId: "the-shape-of-a-week",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Shape of a Week",
      positioning: "For the part of \u201cI don't know who I am\u201d that's actually a Tuesday problem.",
      recognitionGate: {
        prompt: "Does the week have no shape to it now?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A long relationship organises a lot. Your week, your friendships, what you do on Sunday, what you talk about, who you're in the habit of being.",
            "When it ends, all of that loses its scaffolding at once — and it feels like not knowing who you are.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two different losses are tangled here. The person, which is grief and works the way grief works.",
            "And the structure, which is a practical problem wearing an existential costume. A good deal of \u201cI don't know who I am\u201d turns out to be not knowing what to do on a Tuesday.",
            "Worth separating, because the second one responds to ordinary things. Not insight — arrangements. Something in the diary, someone to see, something that happens whether or not you feel like it.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Putting something in the diary can feel absurd when the problem is this large.",
            "It is disproportionate. It's also one of the few things that reliably helps, and it doesn't require you to feel any better first.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Not a plan for your life. One week, and what's actually in it.",
          fields: [
            {
              id: "what-went",
              label: "What did the relationship organise that's now unorganised?",
              input: "chips",
              suggestions: [
                "Evenings",
                "Weekends",
                "Who I saw and when",
                "Meals",
                "What I did on Sunday",
                "Who I talked to about my day",
              ],
            },
            {
              id: "one-fixed-thing",
              label: "What's one thing you could put in the week that would happen anyway?",
              input: "text",
              placeholder:
                "Small and fixed. Something that occurs whether or not you feel like it.",
            },
            {
              id: "one-person",
              label: "Who's one person you could arrange to see?",
              input: "text",
              placeholder: "Someone you'd have to turn up for.",
            },
          ],
        },
        {
          kind: "output",
          heading: "One fixed thing",
          body:
            "Not a solution to the grief. Structure for the part that's structural.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Some of \u201cI don't know who I am\u201d is not knowing what to do on a Tuesday.",
            "The structural part responds to arrangements, not insight.",
            "It doesn't require me to feel any better first.",
          ],
        },
      ],
      portable: [
        "Some of \u201cI don't know who I am\u201d is not knowing what to do on a Tuesday.",
        "The structural part responds to arrangements, not insight.",
        "It doesn't require me to feel any better first.",
      ],
      myPlaysTemplate: {
        when: "When the week has lost its shape",
        move: "Put one fixed thing in it that happens regardless of how I feel",
        lookingFor: "Which part is grief and which part is missing structure",
        watchOut: "Waiting to feel better before arranging anything",
        remember: "It's disproportionate to the size of the problem. It still helps.",
      },
      fidelity: {
        correct:
          "The structural loss is separated from the grief, and one fixed commitment is placed in the week.",
        misuse: [
          "Filling the week to avoid feeling anything.",
          "Treating structure as a solution to the grief.",
          "Waiting until you feel better to arrange something.",
        ],
        notMeaning:
          "It does not mean the grief is structural, that a full week helps, or that you should be doing more.",
      },
      supportSignposts: [
        {
          id: "signpost-c12-not-coping",
          heading: "If it's more than grief",
          body:
            "Losing a relationship this way can tip into something that needs more than time. If most things feel like this rather than just the relationship — if it's affecting your sleep, your eating, or your ability to get through a day, or it's been like this for a long stretch without moving at all — please talk to a GP. That's not a comment on how you're grieving. It's a different thing that often arrives alongside it and responds to different help. And if you've had thoughts about not being here, please talk to someone today — a GP, a crisis line, or someone you trust.",
        },
      ],
    },
  ],

  literature: C12_LITERATURE,

  missions: [
    {
      id: "mission-c12-checking",
      version: 1,
      playId: "the-checking",
      title: "Notice one check, without stopping it",
      instruction:
        "Next time you look, do it — and afterwards note how long the relief lasted and what it started up again.",
      linkToOperation: "Observing what continued contact delivers",
      attemptMeaning: "You noticed. Not stopping was never the ask.",
      suitability:
        "If noticing turns into shame, stop and read 'The checking' again. That isn't what this is for.",
      progression: [
        {
          id: "rung-c12-checking-2",
          instruction: "Leave one check undone and note what happens to the urge.",
        },
      ],
    },
    {
      id: "mission-c12-columns",
      version: 1,
      playId: "what-was-mine",
      title: "Say one column out loud",
      instruction:
        "Tell someone you trust one thing from the second or third column — theirs, or neither's. The ones that are hardest to say.",
      linkToOperation: "Differentiating responsibility for a relational ending",
      attemptMeaning:
        "You said it. Believing it comes later than saying it.",
      suitability:
        "Pick someone who won't immediately tell you it was all their fault. That's a different distortion.",
      progression: [
        {
          id: "rung-c12-columns-2",
          instruction: "Write the three columns again in a month and compare.",
        },
      ],
    },
    {
      id: "mission-c12-account",
      version: 1,
      playId: "what-actually-happened",
      title: "Tell it once with both in",
      instruction:
        "Tell someone the account with both lists in it — what was real, and what was also true. Notice which half you want to drop.",
      linkToOperation: "Integrating a coherent account of the relationship",
      attemptMeaning:
        "You told it whole. Wanting to drop half is the expected difficulty.",
      suitability:
        "If it was deception rather than an ending, this isn't the tool — updating your account is accurate there, not distortion.",
      progression: [
        {
          id: "rung-c12-account-2",
          instruction: "Tell it again on a bad day and see which version arrives.",
        },
      ],
    },
    {
      id: "mission-c12-week",
      version: 1,
      playId: "the-shape-of-a-week",
      title: "Put the fixed thing in, for three weeks",
      instruction:
        "Do the one fixed thing three weeks running, whether or not you feel like it. Note nothing except whether you went.",
      linkToOperation: "Reorganising life structure after relational loss",
      attemptMeaning:
        "You went. Whether it helped isn't the measure for the first three.",
      suitability:
        "If three weeks is too much, do one. The point is that it happens regardless of how you feel, not how many.",
      progression: [
        {
          id: "rung-c12-week-2",
          instruction: "Add a second fixed thing, and keep the first.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c12-checking",
      version: 1,
      playId: "the-checking",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed how long the relief lasted",
          "Noticed what it started up again",
          "Left one check undone",
          "Checked more than usual",
        ],
      },
      performedOperation: {
        label: "Did you look at what the checking delivers?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That nothing I could see would settle it",
          "How short the relief is",
          "How much of the day it takes",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into shame about checking",
          "Not checking was worse",
          "Seeing the cost didn't change it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c12-columns",
      version: 1,
      playId: "what-was-mine",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Put something in all three columns",
          "Named something that was theirs",
          "Named something that was neither's",
          "It all went in mine again",
        ],
      },
      performedOperation: {
        label: "Did you separate mine, theirs, and neither's?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That some of it genuinely wasn't mine",
          "What was actually mine",
          "That taking all of it was keeping control",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything still felt like mine",
          "It flipped and became all theirs",
          "Knowing didn't reduce the blame",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c12-account",
      version: 1,
      playId: "what-actually-happened",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Wrote both lists",
          "Held them at the same time",
          "Told it whole to someone",
          "Dropped one half",
        ],
      },
      performedOperation: {
        label: "Did you hold both what was real and what was also true?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the good parts were real",
          "That I've been rewriting it",
          "That I've been preserving it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "One list kept cancelling the other",
          "Holding both was worse than picking",
          "I couldn't write the second list",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c12-week",
      version: 1,
      playId: "the-shape-of-a-week",
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
        label: "Did you put one fixed thing in the week?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it was missing structure",
          "That going helped a little",
          "That the grief is separate from the week",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't make myself go",
          "It felt pointless while I feel like this",
          "I filled the week and felt worse",
          "Nothing stuck",
        ],
      },
    },
  ],
};
