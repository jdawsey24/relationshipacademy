/**
 * Cluster 11 — "Difficulty Accepting This Relationship Is Ending"
 * The Relationship Playbook™ · Accepting What Is
 *
 * Track: Expiration. Task = Acceptance. Core Need: TO FIND CLARITY.
 * Plays-only. No `simulations[]`.
 *
 * ⚠⚠ THE DEFINING CONSTRAINT. STM-1003 is "I wish someone would decide for
 *   me." Nothing in this module may push toward staying or toward leaving —
 *   not in the copy, not in the framing, not in which option is listed first.
 *   Where a Play offers stay/go options, the ordering is deliberately mixed
 *   across screens so neither is consistently first.
 *
 * ⚠ HOPE IS NOT THE ENEMY. "I don't want to give up too soon" is as legitimate
 *   as "I don't want to stay too long". Treating hope as denial would be
 *   taking a side.
 *
 * ⚠ PARTIAL COMPETENCY FIT. The Expiration set is built for Acceptance
 *   (Detachment, Disengagement, Role Release). This reader has not reached
 *   acceptance because they have not decided. TRU-EXPR-003 Self-Trust and
 *   TRU-EXPR-004 Agency carry most of this cluster; the release competencies
 *   largely do not apply.
 *
 * ⚠ CLAIM SCOPE. May claim: separate answerable questions from unanswerable
 *   ones; tell evidence-based hope from waiting; name what you'd need to see.
 *   MUST NOT CLAIM: that it can or cannot be saved, that you'll know, that the
 *   ambivalence resolves, or anything amounting to advice to stay or go.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C11_LITERATURE } from "./accepting-what-is-literature";

export const ACCEPTING_WHAT_IS: PlaybookContent = {
  playbookKey: "accepting-what-is",
  playbookVersion: 1,
  displayName: "Accepting What Is",

  opening: {
    title: "We're not going to decide for you",
    body: [
      "You've been carrying should-I-stay-or-go for a while, and it doesn't resolve by being carried. You've probably found that.",
      "Some of what you're asking has no answer — can this be saved, is love enough, whether you'd regret it. Nobody knows those, including anyone who tells you confidently.",
      "What's here separates those from the ones you can actually check. It won't tell you what to do. It should tell you what you're deciding between.",
    ],
    manifestations: [
      "Should I stay or leave?",
      "I keep hoping things will change.",
      "I don't know when hope becomes denial.",
      "I wish someone would decide for me.",
    ],
    cta: "Start with what can actually be answered",
  },

  recognitionCards: [
    {
      id: "rec-c11-wish-someone-would-decide",
      role: "validate",
      pathwayPlayId: null,
      headline: "I wish someone would decide for me.",
      validationCopy:
        "That's a reasonable wish — the deciding is the worst part, and handing it over would be an enormous relief. Nobody should take it, though. Anyone who does is guessing with a fraction of the information and none of the consequences, and a decision made because someone told you tends not to hold. The friends certain you should leave and the ones certain you should stay are usually describing what they'd do.",
      secondaryExamples: [
        "I keep changing my mind.",
        "I don't know what I actually want.",
        "I don't trust my feelings because they change.",
      ],
    },
    {
      id: "rec-c11-hope-or-denial",
      role: "route",
      pathwayPlayId: "hope-or-denial",
      headline: "I don't know when hope becomes denial.",
      explanation:
        "The difference isn't how much you hope. It's whether you can point at something that actually happened.",
      secondaryExamples: [
        "I keep waiting for things to get better.",
        "I keep falling in love with potential.",
        "I remember who they used to be more than who they are now.",
      ],
    },
    {
      id: "rec-c11-what-am-i-deciding",
      role: "route",
      pathwayPlayId: "what-am-i-actually-deciding",
      headline: "Should I stay or leave?",
      explanation:
        "Some of what's in that question can be checked. Some of it can't be, by anyone. Worth knowing which is which.",
      secondaryExamples: [
        "Can this relationship be saved?",
        "I don't know if this is fixable.",
        "I'm scared of making the wrong decision.",
      ],
    },
    {
      id: "rec-c11-torn",
      role: "route",
      pathwayPlayId: "which-way-does-it-lean",
      headline: "Part of me wants this and part of me doesn't.",
      explanation:
        "Changing your mind about something this large isn't a malfunction. It's what a genuinely close call looks like from inside.",
      secondaryExamples: [
        "I'm torn between comfort and growth.",
        "I don't know whether to fight or let go.",
        "I don't know if I miss them or just miss having someone.",
      ],
    },
    {
      id: "rec-c11-distance",
      role: "route",
      pathwayPlayId: "the-distance-or-the-relationship",
      headline: "I don't know if long distance is worth it.",
      explanation:
        "Distance is genuinely hard, which makes it available as the explanation for everything. Worth separating.",
      secondaryExamples: [
        "I'm tired of saying goodbye.",
        "I don't know if we're building a future or delaying the inevitable.",
        "I worry we'll become strangers.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────────────────────── Play 1 ──
    {
      playId: "hope-or-denial",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Hope, or Denial?",
      positioning: "For the thing you keep waiting for.",
      recognitionGate: {
        prompt: "Are you waiting for something to change?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "This is the sharpest question in the whole cluster, and it does have a partial answer.",
            "The difference isn't how much you hope. Hope with evidence points at something that has actually happened — they did change that, it has been better since March, there was a stretch where this worked.",
            "Hope without evidence points at something that hasn't. They could change. If they understood, they would. It was like this once, years ago.",
            "Both feel identical from inside. The test isn't the strength of the feeling — it's whether you can name a thing that happened.",
          ],
        },
        {
          kind: "learn",
          body: [
            "None of this is an argument against hope. Wanting not to give up too soon is as legitimate as not wanting to stay too long, and people who leave early regret it about as often as people who stay late.",
            "The point is only to know which kind you're holding, because they behave differently over time.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is pointing at something that happened?",
          situation:
            "You've been waiting for a while for something to shift. Some of what you're holding is based on the record, and some of it isn't.",
          buckets: [
            { id: "happened", label: "Something that happened" },
            { id: "could", label: "Something that could happen" },
          ],
          items: [
            {
              id: "sort-c11-stopped-doing",
              text: "They stopped doing the thing after I raised it in April",
              correctBucket: "happened",
              correction: "Datable and checkable. That's evidence.",
            },
            {
              id: "sort-c11-if-they-understood",
              text: "If they really understood how much it hurt, they'd change",
              correctBucket: "could",
              correction:
                "A prediction about a version of them that hasn't appeared yet.",
            },
            {
              id: "sort-c11-better-stretch",
              text: "There were four months last year when this genuinely worked",
              correctBucket: "happened",
              correction: "It happened. Worth weighing — and worth asking what ended it.",
            },
            {
              id: "sort-c11-underneath",
              text: "Underneath it all they're a good person",
              correctBucket: "could",
              correction:
                "Might be true, and it isn't something you can be in a relationship with.",
            },
            {
              id: "sort-c11-said-would",
              text: "They said they'd start therapy",
              correctBucket: "could",
              correction:
                "Saying isn't doing. It moves to the other side when they've been.",
            },
            {
              id: "sort-c11-came-back",
              text: "After the last bad patch they came back and did the work",
              correctBucket: "happened",
              correction: "A track record. That's the strongest thing on this list.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Now yours. Be exact — the exactness is the whole exercise.",
          fields: [
            {
              id: "waiting-for",
              label: "What are you waiting for?",
              input: "text",
              placeholder: "The specific thing that would make this all right.",
            },
            {
              id: "has-it-happened",
              label: "Has it ever happened? When?",
              input: "text",
              placeholder:
                "A date, a stretch, an occasion. If nothing comes, write 'never'.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Is what you're holding pointing at the record, or at what's possible?",
          enoughLabel: "The record — it has happened",
          needMoreLabel: "What's possible — it hasn't yet",
          needMoreIntro:
            "That doesn't mean give up. It means you know which kind of hope this is, which is different from being told to stop hoping.",
          needToKnowLabel: "What would have to happen for this to become evidence",
          observableLabel: "Something I could point at afterwards",
        },
        {
          kind: "output",
          heading: "What I'm holding",
          body:
            "Not a verdict on the relationship. A clear view of what your hope is resting on.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The test isn't how much I hope. It's whether I can name a thing that happened.",
            "Saying isn't doing. It becomes evidence when it's been done.",
            "Not giving up too soon is as real a risk as staying too long.",
          ],
        },
      ],
      portable: [
        "The test isn't how much I hope. It's whether I can name a thing that happened.",
        "Saying isn't doing. It becomes evidence when it's been done.",
        "Not giving up too soon is as real a risk as staying too long.",
      ],
      myPlaysTemplate: {
        when: "When I'm waiting for something to change",
        move: "Check whether what I'm holding points at the record or at what's possible",
        lookingFor: "A specific thing that actually happened, and when",
        watchOut: "Treating this as a verdict — it isn't one, either way",
        remember: "Knowing which kind of hope it is isn't the same as being told to stop.",
      },
      fidelity: {
        correct:
          "The thing being waited for is named specifically, and checked against whether it has ever occurred.",
        misuse: [
          "Using it to build a case for leaving.",
          "Using it to build a case for staying.",
          "Counting a promise as an occurrence.",
        ],
        notMeaning:
          "It does not mean the hope is unfounded, that the relationship can't change, or that you should act on what you found.",
      },
    },

    // ───────────────────────────────────────────── Play 2 ──
    {
      playId: "what-am-i-actually-deciding",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Am I Actually Deciding?",
      positioning: "For sorting the answerable questions from the ones nobody can answer.",
      recognitionGate: {
        prompt: "Have you been weighing this for a long time without getting anywhere?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A lot of the weight you're carrying is made of questions that have no answers. Can this be saved. Is love enough. Whether you'd regret it.",
            "Those can be held for years and never resolve, and holding them is most of what's tiring.",
            "Underneath them are questions that can be checked — mostly by looking rather than thinking.",
          ],
        },
        {
          kind: "learn",
          body: [
            "This won't tell you what to do. It'll tell you what you're actually choosing between, which is more than most people in this position have.",
            "\u201cIs love enough\u201d has a fairly consistent answer, and it's no — not on its own. That's not a verdict on your relationship. It's why the checkable questions are the ones worth your time.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these could actually be answered?",
          situation:
            "You've been turning the same questions over for months. Some of them are going to keep going round forever.",
          buckets: [
            { id: "checkable", label: "Can be checked" },
            { id: "no-answer", label: "Nobody can answer" },
          ],
          items: [
            {
              id: "sort-c11-both-want",
              text: "Does the other person want this fixed?",
              correctBucket: "checkable",
              correction: "Answerable by asking, and it matters more than most of the list.",
            },
            {
              id: "sort-c11-saved",
              text: "Can this relationship be saved?",
              correctBucket: "no-answer",
              correction: "Not knowable in advance, by you or anyone.",
            },
            {
              id: "sort-c11-changed-before",
              text: "Has anything ever actually changed between us?",
              correctBucket: "checkable",
              correction: "A matter of record. Look rather than think.",
            },
            {
              id: "sort-c11-regret",
              text: "Would I regret leaving?",
              correctBucket: "no-answer",
              correction:
                "Unknowable, and the fear of it is doing a lot of the work here.",
            },
            {
              id: "sort-c11-would-need",
              text: "What would I need to see in six months?",
              correctBucket: "checkable",
              correction: "Answerable by you today, and almost nobody has done it.",
            },
            {
              id: "sort-c11-love-enough",
              text: "Is love enough?",
              correctBucket: "no-answer",
              correction:
                "Not answerable as posed — and the general answer is no, not on its own.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Your own version. What have you been turning over, and which kind is it?",
          fields: [
            {
              id: "unanswerable",
              label: "The question you keep coming back to",
              input: "text",
              placeholder: "The one that never resolves.",
            },
            {
              id: "checkable-version",
              label: "Is there a checkable question underneath it?",
              input: "text",
              placeholder:
                "\u201cCan this be saved\u201d might become \u201chas anything changed since we last tried?\u201d",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "A point at which you look. Not a deadline for them, and not a promise either way.",
          conditionLabel: "When I'll look at this again",
          thenLabel: "And what I'll be looking at",
          actions: [
            "Whether the specific thing has happened",
            "Whether they've done what they said",
            "Whether anything has changed at all",
            "How I feel when I imagine another year of exactly this",
          ],
          controlCheck:
            "This is a date I'll look on \u2014 not a decision made in advance, and not something I'm telling them as a warning.",
        },
        {
          kind: "output",
          heading: "What I'm actually deciding",
          body:
            "The unanswerable ones don't go away. They just stop being the thing you're waiting on.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Some of these have no answers. Holding them is most of what's tiring.",
            "Not deciding is also a decision, and it costs the same time.",
            "A date to look on isn't a decision made in advance.",
          ],
        },
      ],
      portable: [
        "Some of these have no answers. Holding them is most of what's tiring.",
        "Not deciding is also a decision, and it costs the same time.",
        "A date to look on isn't a decision made in advance.",
      ],
      myPlaysTemplate: {
        when: "When I've been weighing this for months without moving",
        move: "Separate the unanswerable questions from the ones I can check",
        lookingFor: "A checkable question underneath the one I keep circling",
        watchOut: "Turning the review date into a threat, or into a decision I've secretly made",
        remember: "This tells me what I'm choosing between. It doesn't choose.",
      },
      fidelity: {
        correct:
          "An unanswerable question is replaced with a checkable one, and a review point is set without a decision attached.",
        misuse: [
          "Setting the date and then deciding before it.",
          "Telling them the date as an ultimatum.",
          "Using the sort to justify a conclusion already reached.",
        ],
        notMeaning:
          "It does not mean you should stay, that you should leave, or that the answer arrives on the date.",
      },
    },

    // ───────────────────────────────────────────── Play 3 ──
    {
      playId: "which-way-does-it-lean",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Which Way Does It Lean?",
      positioning: "For when you keep changing your mind, and that's the problem.",
      recognitionGate: {
        prompt: "Do you find yourself sure one week and unsure the next?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Changing your mind about something this large isn't a malfunction. Decisions that are obvious don't oscillate.",
            "There's also a mechanical reason. Near them, when things are good, staying looks right. Apart, remembering the hard parts, leaving does. Neither reading is dishonest — you're sampling different evidence at different moments.",
            "Which makes \u201cI don't trust my feelings because they change\u201d slightly unfair to yourself. They're responding accurately to what's in front of them.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two situations feel identical here. Genuinely torn — both options carry real weight, and the oscillation reflects that. Or knowing and not wanting to know — there's an answer you keep arriving at and moving away from.",
            "Nothing in this tool decides. It's a way of noticing which one you're in, and you may find it's the first, which is a legitimate place to be.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "This one can be uncomfortable, because it asks you to notice a lean you may have been avoiding.",
            "Noticing a lean isn't the same as acting on it. You can see which way it goes and still not move for months, and that's allowed.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Three questions people find informative. There are no right answers and nothing is scored.",
          fields: [
            {
              id: "first-feeling",
              label:
                "When you imagine it being over, what's the FIRST feeling — before the sensible one arrives?",
              input: "chips",
              suggestions: [
                "Dread",
                "Relief",
                "Both at once",
                "Nothing much",
                "I can't tell",
              ],
            },
            {
              id: "five-years",
              label:
                "If they stayed exactly as they are now — no better, no worse — for five years, what's your answer?",
              input: "text",
              placeholder: "Most people find they know immediately. Write what came.",
            },
            {
              id: "what-im-avoiding",
              label: "Is there an answer you keep arriving at and moving away from?",
              input: "text",
              placeholder: "If there isn't, say so — genuinely torn is a real position.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Reading those back — is this genuinely close, or is there a lean?",
          enoughLabel: "There's a lean",
          needMoreLabel: "It's genuinely close",
          needMoreIntro:
            "Then it's close, and thinking harder won't resolve it. That's worth knowing rather than treating as a failure of yours.",
          needToKnowLabel: "What would tip it either way",
          observableLabel: "Something that would actually have to happen",
        },
        {
          kind: "output",
          heading: "Where I actually am",
          body:
            "A lean isn't a decision, and close isn't a failure. Either is more than not knowing.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Obvious decisions don't oscillate. Mine changes because it's close.",
            "The first feeling, not the sensible second one.",
            "Noticing a lean isn't the same as acting on it.",
          ],
        },
      ],
      portable: [
        "Obvious decisions don't oscillate. Mine changes because it's close.",
        "The first feeling, not the sensible second one.",
        "Noticing a lean isn't the same as acting on it.",
      ],
      myPlaysTemplate: {
        when: "When I'm sure one week and unsure the next",
        move: "Notice whether this is genuinely close or whether there's a lean I'm avoiding",
        lookingFor: "The first feeling, and what I'd say about five more years of exactly this",
        watchOut: "Treating a lean as a decision I now have to act on",
        remember: "My feelings change because they're sampling different weeks. That isn't unreliability.",
      },
      fidelity: {
        correct:
          "The reader distinguishes genuine ambivalence from an avoided lean, without a decision being forced.",
        misuse: [
          "Treating the output as an instruction.",
          "Running it repeatedly until it gives the answer you wanted.",
          "Using it to tell someone else what you've decided.",
        ],
        notMeaning:
          "It does not mean you should act, that a lean is correct, or that genuine ambivalence needs resolving today.",
      },
      supportSignposts: [
        {
          id: "signpost-c11-flatness",
          heading: "If it isn't only this",
          body:
            "If the flatness has spread past the relationship — if most things feel this way, or you've stopped expecting anything to improve anywhere — that's worth mentioning to a GP or a therapist. It's separate from this decision, and it makes the decision much harder to make well.",
        },
      ],
    },

    // ───────────────────────────────────────────── Play 4 ──
    {
      playId: "the-distance-or-the-relationship",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Distance, or the Relationship?",
      positioning: "For when distance has become the explanation for everything.",
      recognitionGate: {
        prompt: "Is the distance making it hard to tell what's actually wrong?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Distance is genuinely hard, which is exactly the problem: it's always available as the explanation.",
            "Every difficulty can be attributed to it, which means nothing gets examined on its own terms — including the things that would be difficult anyway.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two questions worth separating, and they lead to opposite conclusions.",
            "Is the distance the problem? If it ended tomorrow, would this be good?",
            "Or is the distance holding something together? Some relationships work partly because the gaps prevent the friction — and that's common, and not shameful, and very hard to see from inside.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "The thought experiment does more work than months of weighing. Answer quickly.",
          fields: [
            {
              id: "same-city",
              label:
                "If you woke up tomorrow in the same city with no distance at all — what's the first thing you'd feel?",
              input: "chips",
              suggestions: [
                "Relief",
                "Excitement",
                "Some dread",
                "I'd want to slow it down",
                "I don't know",
              ],
            },
            {
              id: "what-would-surface",
              label: "What would you have to deal with that the distance currently postpones?",
              input: "text",
              placeholder: "Be honest. There's usually something.",
            },
            {
              id: "how-long",
              label: "How long has this been the arrangement?",
              input: "text",
              placeholder: "And was there an end date? Is it still the same one?",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is there an actual end to the distance — a date, a plan, a decision made?",
          enoughLabel: "Yes, there's a real one",
          needMoreLabel: "No, or it keeps moving",
          needMoreIntro:
            "That's the more common answer and it's worth knowing. Distance with no end isn't a phase you're getting through — it's the arrangement, and it should be evaluated as one.",
          needToKnowLabel: "What would have to be true for there to be an end",
          observableLabel: "Something one of us would have to actually do",
        },
        {
          kind: "output",
          heading: "Distance, or the relationship",
          body:
            "Being tired of saying goodbye is real, and it isn't the same as not wanting the person.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Distance explains everything, which means nothing gets examined.",
            "If it ended tomorrow, would this be good?",
            "Distance with no end date isn't a phase. It's the arrangement.",
          ],
        },
      ],
      portable: [
        "Distance explains everything, which means nothing gets examined.",
        "If it ended tomorrow, would this be good?",
        "Distance with no end date isn't a phase. It's the arrangement.",
      ],
      myPlaysTemplate: {
        when: "When distance has become the explanation for everything",
        move: "Ask what would be true if the distance ended tomorrow",
        lookingFor: "Whether the distance is the problem or is preventing one",
        watchOut: "Using the answer as a verdict rather than as information",
        remember: "Being tired of goodbyes is real, and isn't the same as not wanting them.",
      },
      fidelity: {
        correct:
          "The effect of the distance is separated from the state of the relationship, and the presence or absence of an end point is named.",
        misuse: [
          "Using it to conclude the relationship is fine because the distance explains everything.",
          "Using it to conclude the relationship is over because the distance is hard.",
          "Treating a moving end date as an end date.",
        ],
        notMeaning:
          "It does not mean the distance is or isn't the problem, that closing it would fix things, or that you should act on the answer.",
      },
    },
  ],

  literature: C11_LITERATURE,

  missions: [
    {
      id: "mission-c11-hope",
      version: 1,
      playId: "hope-or-denial",
      title: "Find the date, or find there isn't one",
      instruction:
        "Try to put a date on the last time the thing you're waiting for actually happened. If you can't, that's the finding.",
      linkToOperation: "Checking hope against the record",
      attemptMeaning:
        "You looked. Finding nothing isn't a verdict — it's one piece of information.",
      suitability:
        "If looking at it makes things much worse rather than clearer, stop and come back to it another time.",
      progression: [
        {
          id: "rung-c11-hope-2",
          instruction: "Ask them directly whether they think it's changed.",
        },
      ],
    },
    {
      id: "mission-c11-deciding",
      version: 1,
      playId: "what-am-i-actually-deciding",
      title: "Keep the date you set",
      instruction:
        "When the date arrives, look at the thing you named. Don't move it. Note what you found either way.",
      linkToOperation: "Time-bounded review in place of open-ended weighing",
      attemptMeaning:
        "You looked on the day. Moving the date is information too.",
      suitability:
        "If you find yourself moving it repeatedly, that's worth noticing — it usually means the condition wasn't the real question.",
      progression: [
        {
          id: "rung-c11-deciding-2",
          instruction: "Ask them the checkable question rather than only observing it.",
        },
      ],
    },
    {
      id: "mission-c11-lean",
      version: 1,
      playId: "which-way-does-it-lean",
      title: "Say it out loud to one person",
      instruction:
        "Tell someone you trust where you actually are — the lean, or that it's close. Not the person you're deciding about.",
      linkToOperation: "Externalising an unspoken position",
      attemptMeaning:
        "You said it. Hearing yourself say it is the point, not what they advise.",
      suitability:
        "Pick someone who won't immediately tell you what to do. That's the input you're trying to avoid.",
      progression: [
        {
          id: "rung-c11-lean-2",
          instruction: "Answer the five-year question again a month later and compare.",
        },
      ],
    },
    {
      id: "mission-c11-distance",
      version: 1,
      playId: "the-distance-or-the-relationship",
      title: "Ask about the end date",
      instruction:
        "Ask them directly whether there's an actual plan for the distance ending, and when. Listen to the answer rather than the reassurance.",
      linkToOperation: "Establishing whether the arrangement has an end",
      attemptMeaning:
        "You asked. A vague answer is itself an answer.",
      suitability:
        "If the date has moved more than twice, that pattern is more informative than the next date will be.",
      progression: [
        {
          id: "rung-c11-distance-2",
          instruction:
            "Name what you'd need for the distance to stay workable, and say it.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c11-hope",
      version: 1,
      playId: "hope-or-denial",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named the specific thing I'm waiting for",
          "Checked whether it had actually happened",
          "Counted a promise as a promise, not as evidence",
          "Kept it general",
        ],
      },
      performedOperation: {
        label: "Did you check what you're holding against the record?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it has happened before",
          "That it never actually has",
          "How long I've been waiting",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't name one specific thing",
          "Looking at it made it worse",
          "I found the answer and didn't want it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c11-deciding",
      version: 1,
      playId: "what-am-i-actually-deciding",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated the answerable from the unanswerable",
          "Set a date to look",
          "Looked on the day",
          "Kept turning the same question over",
        ],
      },
      performedOperation: {
        label: "Did you replace an unanswerable question with a checkable one?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What I'm actually choosing between",
          "That some of it was never going to resolve",
          "That nothing has changed",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I moved the date",
          "I couldn't find a checkable version",
          "Knowing didn't help",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c11-lean",
      version: 1,
      playId: "which-way-does-it-lean",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Answered the first-feeling question honestly",
          "Answered the five-year question",
          "Said where I am to someone",
          "Avoided the questions",
        ],
      },
      performedOperation: {
        label: "Did you notice whether this is close or whether there's a lean?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That there's a lean",
          "That it's genuinely close",
          "That I've known for a while",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The answers contradicted each other",
          "I saw the lean and it frightened me",
          "Saying it out loud made it too real",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c11-distance",
      version: 1,
      playId: "the-distance-or-the-relationship",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Ran the same-city question honestly",
          "Named what the distance postpones",
          "Asked about the end date",
          "Blamed the distance again",
        ],
      },
      performedOperation: {
        label: "Did you separate the distance from the relationship?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the distance is the problem",
          "That the distance is holding something together",
          "That there isn't really an end date",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The answer wasn't what I expected",
          "The end date moved again",
          "I couldn't imagine it ending",
          "Nothing stuck",
        ],
      },
    },
  ],
};
