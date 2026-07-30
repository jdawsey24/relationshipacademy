/**
 * Cluster 10 — "Feeling Like I'm Carrying This Alone"
 * The Relationship Playbook™ · Building a True Partnership
 *
 * Track: Expansion. Task = Integration. Core Need: TO BUILD PARTNERSHIP.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ "YOUR HALF" WITH A TWIST. 10 of 18 statements are Relational Condition, so
 *   the Cluster 7 precedent applies — but here the reader's half IS the
 *   over-functioning. The work is partly about doing LESS, which is the
 *   opposite of every other cluster's ask.
 *
 * ⚠ THE CENTRAL TRAP. The obvious advice — "communicate more clearly", "ask
 *   them to step up" — is more managing, done by the person already doing all
 *   the managing. No tool here may add to the load it is meant to reduce.
 *
 * ⚠ RESENTMENT GUARD. This cluster runs hot. No tool may function as
 *   evidence-gathering, and no copy may become a case against the partner.
 *
 * ⚠ CLAIM SCOPE. May claim: see the invisible load clearly; describe it once;
 *   hand one thing over properly; say what you want instead. MUST NOT CLAIM:
 *   that they will step up, that the balance shifts, or that the relationship
 *   becomes equal.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C10_LITERATURE } from "./building-a-true-partnership-literature";

export const BUILDING_A_TRUE_PARTNERSHIP: PlaybookContent = {
  playbookKey: "building-a-true-partnership", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Building a True Partnership",

  opening: {
    title: "It isn't the tasks",
    body: [
      "You could hand over half the jobs tomorrow and still feel exactly like this. What's tiring is being the one who holds the whole thing in mind.",
      "This one asks something unusual: not to do more, but to do less in a specific way. That's harder, and we'll be honest about why.",
      "It also can't make them step up. What it can do is find out whether they would.",
    ],
    manifestations: [
      "I carry all the responsibility.",
      "I notice everything; they notice nothing.",
      "I'm tired of reminding them.",
      "I want a partner, not another responsibility.",
    ],
    cta: "Start with what's actually tiring",
  },

  recognitionCards: [
    {
      id: "rec-c10-what-i-want",
      role: "validate",
      pathwayPlayId: null,
      headline: "I want a partner, not another responsibility.",
      validationCopy:
        "That's a legitimate thing to want, and we're not going to talk you into settling for the trained version. What's worth knowing is that 'they won't' and 'they've never had room to' look identical from inside the pattern — and only one of them is workable.",
      secondaryExamples: [
        "I don't want to be the relationship manager anymore.",
        "I don't want to teach someone how to love me.",
      ],
    },
    {
      id: "rec-c10-notice-everything",
      role: "route",
      pathwayPlayId: "the-invisible-list",
      headline: "I notice everything; they notice nothing.",
      explanation:
        "The tiring part isn't the tasks. It's holding the whole picture, continuously, in the background — and that part is invisible from outside.",
      secondaryExamples: [
        "I'm always thinking about us.",
        "I feel emotionally responsible for both of us.",
      ],
    },
    {
      id: "rec-c10-always-me",
      role: "route",
      pathwayPlayId: "leave-the-gap",
      headline: "Everything falls on me.",
      explanation:
        "While you're pre-empting, there's no gap for anyone to step into. Leaving one means something may go wrong — that's the actual cost.",
      secondaryExamples: [
        "I carry all the responsibility.",
        "I'm tired of reminding them.",
      ],
    },
    {
      id: "rec-c10-hand-over",
      role: "route",
      pathwayPlayId: "hand-one-thing-over",
      headline: "I ask them to do things and I'm still the one tracking it.",
      explanation:
        "Handing over a task and handing over the noticing are different. Only the second reduces the load.",
      secondaryExamples: [
        "I always have to bring up the hard conversations.",
        "I feel like I'm parenting my partner.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "the-invisible-list",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Invisible List",
      positioning:
        "For the work nobody can see. You write it down alone — then you describe it once, because they can't respond to something they can't see.",
      recognitionGate: {
        prompt: "Do you hold things in mind that nobody else seems to be tracking?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "When you say you do more, they list the tasks they do. That's the wrong list, and then you're both frustrated.",
            "What you mean is the other category — knowing what's coming, noticing before it goes wrong, remembering what was agreed, deciding when to raise things.",
            "None of that is visible from outside. Which means they may be entirely willing and genuinely unaware, both at once.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Arguing about the division of tasks can't get at it, because the thing you're carrying isn't on the task list.",
            "Describing it specifically — this is what I'm holding, here's what that involves — is a different conversation. It might not change anything. But it's the one you actually mean.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Write the invisible list",
          fields: [
            {
              id: "what-i-hold",
              input: "text",
              label: "What are you keeping track of that nobody else is?",
              placeholder: "Not the jobs. The knowing, remembering, noticing, anticipating.",
            },
            {
              id: "when-it-runs",
              input: "chips",
              label: "When is it running?",
              suggestions: [
                "Constantly, in the background",
                "Whenever something's coming up",
                "At night",
                "Whenever they're doing something I'd do differently",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll describe what you carry",
          helper:
            "What you hold, not what they don't do. You might start with \u201cThere's a part of this I don't think you can see\u2026\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've written the description and it's a calm moment.",
          doThis:
            "Say it once. Don't compare, don't list what they don't do. Describe what you carry, then stop.",
        },
        {
          kind: "output",
          heading: "What I described",
          body: "Said once. Whether they'd have carried it is now findable out.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The tasks aren't the thing. The noticing is.",
            "Describe what I carry. Don't compare.",
            "They may be willing and genuinely unaware.",
          ],
        },
      ],
      portable: [
        "The tasks aren't the thing. The noticing is.",
        "Describe what I carry. Don't compare.",
        "They may be willing and genuinely unaware.",
      ],
      myPlaysTemplate: {
        when: "When I'm holding things nobody else is tracking",
        move: "Write the invisible list, then describe it once without comparing",
        lookingFor: "Whether it's something they could see once it's named",
        watchOut: "Turning the description into a list of what they don't do",
        remember: "Describing it once isn't teaching someone how to love me. Doing it weekly for years is.",
      },
      fidelity: {
        correct:
          "The invisible load is described specifically and once, without comparison to the other person's contribution.",
        misuse: [
          "Turning it into a comparison or a tally.",
          "Repeating the description when it doesn't land.",
          "Using it as an opening for a wider case.",
        ],
        notMeaning:
          "It does not mean they'll take any of it on, that they'll understand it, or that describing it changes the arrangement.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "leave-the-gap",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Leave the Gap",
      positioning: "For when you pre-empt everything and nothing is left for anyone else.",
      recognitionGate: {
        prompt: "Do you handle things before anyone else notices they need handling?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Every other kind of relationship advice asks you to do something more. This asks you to do something less, which is harder.",
            "While you're pre-empting, there's no gap for anyone to step into. The thing gets handled, so it never becomes visible as something that needed handling.",
            "Leaving a gap means something may go wrong — briefly, visibly, in a way you could have prevented. That's the real cost, and it's why almost nobody does it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Making room: you don't do the thing, and you say you're not doing it, so it can be picked up.",
            "Withdrawing to prove a point: you don't do the thing silently and wait to see what happens.",
            "The second is tempting and it doesn't work. It produces a mess and a row, and the row ends up being about the mess rather than the arrangement.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Watching something you could fix go unfixed is genuinely difficult, and the discomfort isn't a sign you've done it wrong.",
            "You may also find you can't tolerate it. That's information rather than failure.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One gap",
          fields: [
            {
              id: "what-i-preempt",
              input: "text",
              label: "What do you handle before it needs asking for?",
              placeholder: "The things that would go wrong if you didn't.",
            },
            {
              id: "smallest-consequence",
              input: "text",
              label: "Which one has the smallest consequence if it's forgotten?",
              placeholder: "Not the school forms. Something you could survive twice.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "The gap",
          conditionLabel: "What I'm not going to pre-empt",
          thenLabel: "And how I'll say I'm not doing it",
          actions: [
            "Tell them once, plainly, that I'm not picking it up",
            "Not remind them about it",
            "Let it go wrong if it goes wrong",
            "Do this for two weeks, then look at it",
          ],
          controlCheck:
            "I've said it out loud. This isn't a silent test. The consequence of it failing is genuinely small. I'm making room, not making a point.",
        },
        {
          kind: "output",
          heading: "The gap I'm leaving",
          body: "Said out loud. Small enough to survive. Not a test.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "While I pre-empt, there's no gap to step into.",
            "Making room means saying I'm not doing it.",
            "Silent withdrawal produces a row about the mess.",
          ],
        },
      ],
      portable: [
        "While I pre-empt, there's no gap to step into.",
        "Making room means saying I'm not doing it.",
        "Silent withdrawal produces a row about the mess.",
      ],
      myPlaysTemplate: {
        when: "When I handle everything before anyone notices it needs handling",
        move: "Leave one small gap, and say out loud that I'm leaving it",
        lookingFor: "Whether anything gets picked up, and whether I can tolerate the wait",
        watchOut: "Leaving the gap silently — that's a test, and it produces a row",
        remember: "The discomfort of watching it go unfixed isn't a sign I've done it wrong.",
      },
      fidelity: {
        correct:
          "One small responsibility is left unhandled, the decision is stated out loud, and no reminder is given.",
        misuse: [
          "Withdrawing silently and waiting.",
          "Choosing something with a large consequence.",
          "Reminding them and calling it a gap.",
        ],
        notMeaning:
          "It does not mean they'll pick it up, that the arrangement shifts, or that failing to tolerate the gap is a failure of yours.",
      },
    },

    // ─────────────────────────────── Play 3 ──
    {
      playId: "hand-one-thing-over",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Hand One Thing Over",
      positioning:
        "For transferring the noticing, not just the task. This one needs them — the handover is the tool.",
      recognitionGate: {
        prompt:
          "Do you delegate tasks and still end up tracking whether they happened?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cCan you do the bins tonight?\u201d — you still own the bins. You've handed over an instance and kept the tracking, which is the part that was tiring.",
            "\u201cThe bins are yours now, and I'm not going to remind you\u201d — that's the transfer. It includes the not-reminding, which is the whole point and the difficult bit.",
          ],
        },
        {
          kind: "learn",
          body: [
            "A real transfer means it will sometimes be forgotten. If you can't tolerate that, the handover hasn't happened — you've added anxiety to a job you still own.",
            "Which is why what you pick matters more than how you say it. Start with something where being forgotten is genuinely survivable.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Pick it",
          fields: [
            {
              id: "the-thing",
              input: "text",
              label: "What are you handing over — completely?",
              placeholder: "Small. Survivable if forgotten. Twice.",
            },
            {
              id: "can-i-tolerate",
              input: "chips",
              label: "Honestly — could you let this fail without stepping in?",
              suggestions: [
                "Yes",
                "Probably, once",
                "No — pick something else",
                "Not sure",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The handover, including the not-reminding",
          helper:
            "The operative clause is that you won't remind them. You might say \u201c\u2026is yours now. I'm not going to remind you about it, and I'm not going to check.\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You've picked something small and survivable.",
          doThis:
            "Say it, including the part about not reminding them. Then don't remind them \u2014 that's the whole operation.",
        },
        {
          kind: "output",
          heading: "What I handed over",
          body: "The transfer includes the silence afterwards.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Delegating keeps the tracking. Transferring gives it away.",
            "\u201cAnd I'm not going to remind you\u201d is the operative clause.",
            "If I can't let it fail, it hasn't been handed over.",
          ],
        },
      ],
      portable: [
        "Delegating keeps the tracking. Transferring gives it away.",
        "\u201cAnd I'm not going to remind you\u201d is the operative clause.",
        "If I can't let it fail, it hasn't been handed over.",
      ],
      myPlaysTemplate: {
        when: "When I delegate and still end up tracking it",
        move: "Hand one small thing over completely, including the not-reminding",
        lookingFor: "Whether I can let it fail without stepping in",
        watchOut: "Reminding them once — that's the transfer cancelled",
        remember: "It will sometimes be forgotten. That's what a transfer costs.",
      },
      fidelity: {
        correct:
          "One responsibility is transferred out loud, including an explicit undertaking not to remind or check, and no reminder is given.",
        misuse: [
          "Reminding them, then calling it handed over.",
          "Choosing something you cannot let fail.",
          "Handing it over and then doing it yourself when it slips.",
        ],
        notMeaning:
          "It does not mean they'll do it, do it well, or do it on time — and it does not mean the wider balance changes.",
      },
    },
  ],

  literature: C10_LITERATURE,

  missions: [
    {
      id: "mission-c10-describe",
      version: 1,
      playId: "the-invisible-list",
      title: "Notice what goes back on the list",
      instruction:
        "You described it in the tool. Over a week, note what you added to your own mental list without meaning to.",
      linkToOperation: "Making the invisible load visible",
      attemptMeaning:
        "You noticed. Whether they took anything on is separate.",
      suitability:
        "If describing it turned into an argument about tasks, that's worth noticing rather than repeating.",
      progression: [
        { id: "rung-c10-describe-2", instruction: "Name one specific item and ask if they'd take the noticing for it." },
      ],
    },
    {
      id: "mission-c10-gap",
      version: 1,
      playId: "leave-the-gap",
      title: "Hold the gap for two weeks",
      instruction:
        "Keep the gap open. Don't remind, don't fix it, don't mention it again. Note what happened and how it felt.",
      linkToOperation: "Creating shared-responsibility space",
      attemptMeaning:
        "You held it. Stepping back in is information, not failure.",
      suitability:
        "If you find you can't tolerate it, stop — that's worth knowing rather than forcing.",
      progression: [
        { id: "rung-c10-gap-2", instruction: "Leave a second gap, slightly larger." },
      ],
    },
    {
      id: "mission-c10-handover",
      version: 1,
      playId: "hand-one-thing-over",
      title: "Don't remind them, for a month",
      instruction:
        "You handed it over in the tool. Now the hard part — a month with no reminder and no checking.",
      linkToOperation: "Sustaining a transfer of ownership",
      attemptMeaning:
        "You held the silence. One reminder cancels the transfer, and that's worth knowing rather than hiding.",
      suitability:
        "If it failed in a way that mattered, pick something smaller next time rather than concluding it can't work.",
      progression: [
        { id: "rung-c10-handover-2", instruction: "Hand over a second thing, and don't take the first one back." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c10-describe",
      version: 1,
      playId: "the-invisible-list",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Described what I carry, not what they don't do",
          "Said it once and stopped",
          "Kept it out of comparison",
          "It became a tally",
        ],
      },
      performedOperation: {
        label: "Did you describe the invisible load without comparing?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it is invisible",
          "That they genuinely couldn't see it",
          "That they could see it and it changed nothing",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into an argument about tasks",
          "They listed what they do",
          "I couldn't describe it without comparing",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c10-gap",
      version: 1,
      playId: "leave-the-gap",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said out loud I wasn't doing it",
          "Held the gap",
          "Let it go wrong",
          "Stepped back in",
        ],
      },
      performedOperation: {
        label: "Did you leave the gap, out loud, without reminding?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it got picked up",
          "That it didn't get picked up",
          "How hard the waiting is",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't watch it go wrong",
          "I said it and then did it anyway",
          "It went wrong and it mattered more than I expected",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c10-handover",
      version: 1,
      playId: "hand-one-thing-over",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Handed it over including the not-reminding",
          "Actually didn't remind them",
          "Picked something survivable",
          "Reminded them once",
        ],
      },
      performedOperation: {
        label: "Did you transfer it, including not reminding or checking?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the tracking was the tiring part",
          "That they can hold something",
          "That I can't let go of it yet",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I reminded them",
          "They forgot and I took it back",
          "Letting it fail cost more than expected",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
