/**
 * Cluster 27 — "Fear of Being Used Again"
 * The Relationship Playbook™ · Letting Go of the Armor
 *
 * Track: Exploration. Task = Discernment. Core Need: TO FEEL SECURE.
 * Plays-only. Completes the Exploration track.
 *
 * ⚠ THE ARMOR IS NOT THE FIRST THING TO FIX. The subtitle names it, and it
 *   would be easy to write a Playbook asking this reader to lower their guard.
 *   That would be asking them to be more available to the thing that hurt them.
 *   The guard works and it was built for a reason. What's examinable is what it
 *   costs and what it can't do.
 *
 * ⚠ CONTEXT-VALIDITY on PE-4. "Dating has become transactional" is an appraisal
 *   of the environment and may be substantially accurate. Same treatment as
 *   Cluster 4's PE-1: keep the observation, check only whether it's arriving
 *   before there's anything to read.
 *
 * ⚠ BOUNDARY WITH CLUSTER 14. Cluster 14 is the moment of the yes. This is the
 *   belief underneath — that being wanted has to be earned.
 *
 * ⚠ CLAIM SCOPE. May claim: tell wanting-you from wanting-what-you-offer;
 *   notice what the giving is buying; see what the guard costs. MUST NOT CLAIM:
 *   that you'll be wanted for yourself, that lowering the guard is safe, that
 *   dating isn't transactional, or that people will stop taking.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C27_LITERATURE } from "./more-than-what-you-provide-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const LETTING_GO_OF_THE_ARMOR: PlaybookContent = {
  playbookKey: "more-than-what-you-provide",
  playbookVersion: 1,
  displayName: "Letting Go of the Armor",

  opening: {
    title: "The guard isn't the first thing to look at",
    body: [
      "You give a lot. People take it. And somewhere in there, you started to suspect the giving is the reason anybody stays.",
      "Nothing here will ask you to lower your guard. That would mean opening yourself up more to the thing that hurt you. And the guard works — that's why you built it.",
      "What's worth looking at is what it costs you, and the one thing it can't do.",
    ],
    manifestations: [
      "I feel like I have to earn love instead of just receiving it.",
      "I don't trust that anyone wants me for who I am.",
      "I'm drained by relationships that only take.",
      "I keep my guard up so I don't get taken advantage of again.",
    ],
    cta: "Start with what the giving is buying",
  },

  recognitionCards: [
    {
      id: "rec-c27-transactional",
      role: "validate",
      pathwayPlayId: null,
      headline: "Dating has become transactional and effort doesn't get rewarded.",
      validationCopy:
        "There's a lot of truth in that, and we're not going to argue with it. Plenty of people treat dating like a market, and effort really does go unreturned a lot of the time. Keep what you've noticed — you earned it. The only thing worth checking is whether it's showing up before you've seen anything about a particular person.",
      secondaryExamples: [
        "I feel like effort and integrity don't get rewarded.",
        "I feel replaceable.",
        "I feel used in relationships.",
      ],
    },
    {
      id: "rec-c27-earning",
      role: "route",
      pathwayPlayId: "what-the-giving-is-buying",
      headline: "I feel like I have to earn being wanted.",
      explanation:
        "If you bought it, you can stop being able to afford it. That's why the effort can never come down.",
      secondaryExamples: [
        "I have to prove my value before anyone will choose me.",
        "I'm afraid that if I stop achieving, no one will want me.",
        "I wonder if anyone would still want me if I stopped giving so much.",
      ],
    },
    {
      id: "rec-c27-wanting-you",
      role: "route",
      pathwayPlayId: "you-or-what-you-offer",
      headline: "I can't tell if they want me or what I provide.",
      explanation:
        "There's a partial answer. But the strongest sign is one you can only get by saying no to something.",
      secondaryExamples: [
        "I feel like I'm only valued for what I do, not who I am.",
        "I don't trust that anyone wants me for who I am.",
      ],
    },
    {
      id: "rec-c27-drained",
      role: "route",
      pathwayPlayId: "the-work-nobody-counts",
      headline: "I'm drained by relationships that only take.",
      explanation:
        "\u201cToo much\u201d is almost always measured against a baseline of nothing. That says more about how unused to it everyone is than about your needs.",
      secondaryExamples: [
        "I do more emotional work than I get back.",
        "I manage everyone else's feelings but my own.",
        "I feel like my needs are treated as too much.",
      ],
    },
    {
      id: "rec-c27-armor",
      role: "route",
      pathwayPlayId: "what-the-armor-costs",
      headline: "I keep my guard up so it doesn't happen again.",
      explanation:
        "It works. It also can't tell people apart. It holds off the people who'd take and the people who wouldn't, at the same rate.",
      secondaryExamples: [
        "I feel used in relationships.",
        "I feel replaceable.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────────────────────── Play 1 ──
    {
      playId: "what-the-giving-is-buying",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What the Giving Is Buying",
      positioning: "For the effort that can never come down.",
      recognitionGate: {
        prompt: "Do you feel you have to keep giving to keep being wanted?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "If being wanted is something you buy, the price never ends. And a purchase can be lost. So the effort can never come down.",
            "It also makes the proof useless. Every sign that someone wants you gets explained away by what you've been giving. So none of it can count.",
            "That's the trap. It's not that you're wrong about people. It's that the belief can't be tested. While you're paying, you can never find out whether you needed to.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The way out isn't giving less as a plan. Giving less to test someone is the same deal running backwards. It gives you the same proof you can't use.",
            "What gives you real information is this: one specific thing, not offered, with one specific person — and then watching what happens. Keep it small enough that you can handle the answer either way.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What are you actually giving? Be specific — it's usually more than people realise.",
          fields: [
            {
              id: "what-i-give",
              label: "What do you bring that you think is the reason people stay?",
              input: "chips",
              suggestions: [
                "Sorting things out for people",
                "Being the emotionally available one",
                "Money, or what I can pay for",
                "Being useful — skills, contacts, doing",
                "Being easy — never a problem",
              ],
            },
            {
              id: "one-thing",
              label:
                "Name one small thing you'd normally offer, that you could not offer once",
              input: "text",
              placeholder: "Small. Something you can handle if it goes badly. About one person.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Have you ever not offered it, and seen what happened?",
          enoughLabel: "Yes — and I know what happened",
          needMoreLabel: "No — I've always offered",
          needMoreIntro:
            "Then the belief is untested. That's not the same as it being wrong. It means the proof you'd need has never been there for you.",
          needToKnowLabel: "What I'd be watching for afterwards",
          observableLabel: "Something they'd actually do or not do",
        },
        {
          kind: "output",
          heading: "What I'm paying, and what for",
          body:
            "This isn't a decision to stop giving. It's a clear view of what the giving is buying, and whether you've ever checked.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "If I bought it, I can stop affording it. That's why the effort never drops.",
            "While I'm paying, no proof can count.",
            "Giving less to test someone is the same deal in reverse.",
          ],
        },
      ],
      portable: [
        "If I bought it, I can stop affording it. That's why the effort never drops.",
        "While I'm paying, no proof can count.",
        "Giving less to test someone is the same deal in reverse.",
      ],
      myPlaysTemplate: {
        when: "When I feel I have to keep giving to keep being wanted",
        move: "Name what the giving is buying, and one small thing I could not offer",
        lookingFor: "Whether the belief has ever actually been tested",
        watchOut: "Holding back as a test — that gives the same proof I can't use",
        remember: "Untested isn't the same as wrong. It means the proof has never been there.",
      },
      fidelity: {
        correct:
          "What is being provided is named specifically, and one small non-offered thing is identified with something observable to watch for.",
        misuse: [
          "Withholding in order to test someone.",
          "Choosing something so large the answer isn't survivable.",
          "Using it to conclude people only want what you provide.",
        ],
        notMeaning:
          "It does not mean people want you for yourself, that giving less is safe, or that anyone will stay.",
      },
    },

    // ───────────────────────────────────────────── Play 2 ──
    {
      playId: "you-or-what-you-offer",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "You, or What You Offer",
      positioning: "For telling one from the other.",
      recognitionGate: {
        prompt: "Does every kind thing feel unclear, because it might be about what you provide?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't know how to tell if someone wants me or just wants what I offer.\u201d That's the real question here, and there's a partial answer.",
            "Not a sure one. But some signs lean toward the person, and some lean toward what you provide. Knowing which is which beats treating everything as unclear.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Toward the person: they ask about things that have nothing to do with what you provide. They notice when you're worn out without being told. They offer something when nothing needs fixing. They care about your opinions, not just what you can do.",
            "Toward what you provide: warmth that shows up when something is needed. Thanks aimed at what you did rather than who you are. Interest that fades when you're not around.",
            "And the strongest sign of all is one you can only get by saying no to something. That's why this question tends to stay open for a long time.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which way does each of these lean?",
          situation:
            "Someone you've been seeing has been really lovely, again and again. You've also been doing a lot for them.",
          buckets: [
            { id: "person", label: "Toward you" },
            { id: "provision", label: "Toward what you provide" },
          ],
          items: [
            {
              id: "sort-c27-so-helpful",
              text: "\u201cYou're so good at sorting things out\u201d",
              correctBucket: "provision",
              correction: "That's praise for what you can do. Lovely, and not about you.",
            },
            {
              id: "sort-c27-asked-about-book",
              text: "They asked what you thought about something that had nothing to do with them",
              correctBucket: "person",
              correction: "Interest that gets them nothing. That leans your way.",
            },
            {
              id: "sort-c27-noticed-tired",
              text: "They noticed you were flat before you said anything",
              correctBucket: "person",
              correction: "That takes attention on their part and buys them nothing.",
            },
            {
              id: "sort-c27-warm-when-needed",
              text: "They're warmest when they need something",
              correctBucket: "provision",
              correction: "The timing is the tell.",
            },
            {
              id: "sort-c27-thin-when-busy",
              text: "Interest drops off when you've been out of reach for a week",
              correctBucket: "provision",
              correction:
                "One time isn't enough to judge — but if it keeps happening, it leans.",
            },
            {
              id: "sort-c27-stayed-after-no",
              text: "You said no to something and they were fine and stayed",
              correctBucket: "person",
              correction: "The strongest sign there is, and the hardest to get.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Now think of one person you're unsure about right now.",
          fields: [
            {
              id: "toward-person",
              label: "What have you seen that leans toward you?",
              input: "text",
              placeholder: "Specific moments, not general feelings.",
            },
            {
              id: "toward-provision",
              label: "And what leans toward what you provide?",
              input: "text",
              placeholder: "Be fair in both directions.",
            },
          ],
        },
        {
          kind: "output",
          heading: "Which way it leans",
          body:
            "A lean, not a verdict — and the strongest sign is one you haven't been able to collect yet.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Warmth timed to need is the clearest tell.",
            "Interest that gets them nothing leans toward me.",
            "I can't see how they take a no until I've given one.",
          ],
        },
      ],
      portable: [
        "Warmth timed to need is the clearest tell.",
        "Interest that gets them nothing leans toward me.",
        "I can't see how they take a no until I've given one.",
      ],
      myPlaysTemplate: {
        when: "When every kind thing feels unclear",
        move: "Sort what I've seen into what leans toward me and what leans toward what I provide",
        lookingFor: "Interest that gets them nothing, and how a no is received",
        watchOut: "Putting everything in the provision column because that's the safer read",
        remember: "A lean isn't a verdict, and the best sign needs me to say no to something first.",
      },
      fidelity: {
        correct:
          "Observed instances are sorted by whether they return something practical, and the reader notes what they haven't been able to observe.",
        misuse: [
          "Sorting everything toward the provision as a protective default.",
          "Treating a lean as proof.",
          "Using it to justify withdrawing from someone.",
        ],
        notMeaning:
          "It does not mean they want you for yourself, that they don't, or that the signals are reliable in any single instance.",
      },
    },

    // ───────────────────────────────────────────── Play 3 ──
    {
      playId: "the-work-nobody-counts",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Work Nobody Counts",
      positioning: "For managing everyone's feelings but your own.",
      recognitionGate: {
        prompt: "Do your own needs arrive as an inconvenience?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI do more emotional work than I get back.\u201d \u201cI manage everyone else's feelings but my own.\u201d \u201cMy needs are treated as too much.\u201d",
            "That third one is the giveaway. Someone who does all the managing usually has needs that feel like a bother — because there's no usual way for them to come up.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It feeds itself. You manage their feelings, so yours never come up. Because yours never come up, everyone gets used to them not being there. So when one does show up, it throws things off — which confirms it was too much, and you go back to managing.",
            "\u201cToo much\u201d is almost always measured against a baseline of nothing. It isn't a measure of your needs. It's a measure of how unused to hearing them everyone is.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Looking at this can bring up how long it's been, and who never asked.",
            "You don't have to do anything with that today. Noticing is enough.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "An honest count of what you're carrying that nobody has counted.",
          fields: [
            {
              id: "what-i-manage",
              label: "Whose feelings are you managing?",
              input: "text",
              placeholder: "All of them. Work counts. Family counts.",
            },
            {
              id: "when-mine",
              label: "When did you last say a need out loud and have it received?",
              input: "text",
              placeholder: "If nothing comes to mind, that's the answer.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "One channel, with one person. Not a new rule for everything — just one time.",
          conditionLabel: "The one need I'll say out loud, to one person",
          thenLabel: "And if it lands badly, I'll",
          actions: [
            "Note it, and not conclude anything from one time",
            "Say it again to someone else",
            "Ask them directly what happened",
            "Leave it there for now",
          ],
          controlCheck:
            "\u201cToo much\u201d is measured against a baseline of nothing \u2014 so a bad first reaction is about how new this is, not about the size of what I asked.",
        },
        {
          kind: "output",
          heading: "What I'm carrying, and one thing I'll say",
          body:
            "One need, said once. That's the whole channel to begin with.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "My needs feel like a disruption because they never show up at all.",
            "\u201cToo much\u201d is measured against nothing.",
            "One need, one person, once.",
          ],
        },
      ],
      portable: [
        "My needs feel like a disruption because they never show up at all.",
        "\u201cToo much\u201d is measured against nothing.",
        "One need, one person, once.",
      ],
      myPlaysTemplate: {
        when: "When I'm managing everyone's feelings and mine never come up",
        move: "Say one need out loud to one person",
        lookingFor: "Whether it's received — and whether one bad reaction means anything",
        watchOut: "Deciding from one reaction that the need was too big",
        remember: "The disruption is about how new this is, not about the size of what I asked.",
      },
      fidelity: {
        correct:
          "One need is stated to one person, and a poor first reception is attributed to unfamiliarity rather than to the size of the need.",
        misuse: [
          "Using a single bad reaction as proof the need was too much.",
          "Saying it as an accusation about how much you do.",
          "Choosing someone you already know will refuse.",
        ],
        notMeaning:
          "It does not mean it will be received well, that the balance changes, or that saying more would help.",
      },
    },

    // ───────────────────────────────────────────── Play 4 ──
    {
      playId: "what-the-armor-costs",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What the Armor Costs",
      positioning: "For the guard that works, and the one thing it can't do.",
      recognitionGate: {
        prompt: "Do you keep something back so it can't happen again?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "It works. That's the first thing to say — the guard does cut down how often you get used, and you built it for a reason.",
            "Nothing here asks you to lower it. That would mean opening yourself up more to the thing that hurt you.",
          ],
        },
        {
          kind: "learn",
          body: [
            "What it can't do is tell people apart. Armor doesn't aim — it holds off the people who'd take and the people who wouldn't, at the same rate.",
            "And it makes the proof impossible to get. You can't find out whether someone would have wanted you for yourself while you're holding them at a distance where they can't show you.",
            "So it buys protection, and it costs information. That's a real trade, and it might be the right one for now. It's worth knowing it's a trade, not a free deal.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What is the guard actually made of?",
          fields: [
            {
              id: "what-i-hold-back",
              label: "What do you keep back?",
              input: "chips",
              suggestions: [
                "How much I actually like them",
                "Anything I need",
                "What I'm worried about",
                "How much it would hurt if it ended",
                "That I'm interested at all",
              ],
            },
            {
              id: "what-it-costs",
              label: "What has it cost you that you can name?",
              input: "text",
              placeholder: "Be specific if you can. Chances, people, time.",
            },
            {
              id: "aim-it",
              label:
                "Is there one person you could aim it at, instead of wearing it — one specific thing you'd check instead of holding everything back?",
              input: "text",
              placeholder: "Aiming, not lowering. Those are different.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the guard the thing making this survivable right now?",
          enoughLabel: "Yes — I need it where it is",
          needMoreLabel: "Not entirely — it's costing more than it's saving",
          needMoreIntro:
            "Either one is a fair answer. Nothing here needs you to be less protected than you can manage.",
          needToKnowLabel: "What would have to be true before it could come down at all",
          observableLabel: "Something I'd actually have to see happen",
        },
        {
          kind: "output",
          heading: "The trade I'm making",
          body:
            "Protection bought, information paid. A real trade, and possibly the right one for now.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Armor can't aim. It holds off everyone at the same rate.",
            "Aim it rather than lower it.",
            "It buys protection and costs information. That's a trade, not a flaw.",
          ],
        },
      ],
      portable: [
        "Armor can't aim. It holds off everyone at the same rate.",
        "Aim it rather than lower it.",
        "It buys protection and costs information. That's a trade, not a flaw.",
      ],
      myPlaysTemplate: {
        when: "When I'm keeping something back so it can't happen again",
        move: "Name what the guard costs, and whether I could aim it instead of wearing it",
        lookingFor: "Whether it's the thing making this survivable right now",
        watchOut: "Reading this as an instruction to trust more — it isn't",
        remember: "It works. It just can't tell people apart.",
      },
      fidelity: {
        correct:
          "The protective function of the guard is acknowledged, and its cost in unavailable information is named, without any requirement to lower it.",
        misuse: [
          "Reading it as an instruction to trust or open up.",
          "Concluding the guard was a mistake.",
          "Lowering it wholesale rather than aiming it at a specific check.",
        ],
        notMeaning:
          "It does not mean the guard is wrong, that lowering it is safe, or that you'd be treated better without it.",
      },
    },
  ],

  literature: C27_LITERATURE,

  missions: [
    {
      id: "mission-c27-giving",
      version: 1,
      playId: "what-the-giving-is-buying",
      title: "Don't offer the one thing, once",
      instruction:
        "The small thing you named — don't offer it, just once. Then note what actually happened, instead of what you expected.",
      linkToOperation: "Testing an untested belief with one bounded instance",
      attemptMeaning:
        "You found something out. Whichever way it went, you now have information you didn't have.",
      suitability:
        "If not offering it would really harm someone, pick something else. This isn't a test worth running at anyone's expense.",
      progression: [
        {
          id: "rung-c27-giving-2",
          instruction: "Do it with a second person and compare the two.",
        },
      ],
    },
    {
      id: "mission-c27-lean",
      version: 1,
      playId: "you-or-what-you-offer",
      title: "Watch for one week without providing",
      instruction:
        "For a week, notice what someone does when you haven't just done something for them. Only notice.",
      linkToOperation: "Observing interest that returns nothing practical",
      attemptMeaning:
        "You watched. A thin week is one week, not a verdict.",
      suitability:
        "If a week of not providing feels impossible with this person, that's worth noticing in itself.",
      progression: [
        {
          id: "rung-c27-lean-2",
          instruction: "Say no to one small thing and watch how it's received.",
        },
      ],
    },
    {
      id: "mission-c27-need",
      version: 1,
      playId: "the-work-nobody-counts",
      title: "Say the need to a second person",
      instruction:
        "You said one in the tool. Say the same need, or another, to someone different — and compare how the two landed.",
      linkToOperation: "Opening a channel for one's own needs",
      attemptMeaning:
        "You said it twice. Two tries beat one, especially if the first went badly.",
      suitability:
        "If saying a need out loud isn't safe with the people around you, that's a bigger thing than this tool and worth talking to someone about.",
      progression: [
        {
          id: "rung-c27-need-2",
          instruction: "Say one before you've done anything for them that day.",
        },
      ],
    },
    {
      id: "mission-c27-armor",
      version: 1,
      playId: "what-the-armor-costs",
      title: "Aim it once",
      instruction:
        "With one person, swap the general guard for one specific thing you're checking. Note whether anything feels different.",
      linkToOperation: "Converting undirected protection into a specific check",
      attemptMeaning:
        "You aimed it. Keeping the guard where it is is still a fair outcome.",
      suitability:
        "If the guard is what makes dating survivable right now, don't do this one. That's not a failure — it's an honest read of where you are.",
      progression: [
        {
          id: "rung-c27-armor-2",
          instruction: "Let one person see one thing you'd normally keep back.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c27-giving",
      version: 1,
      playId: "what-the-giving-is-buying",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what the giving is buying",
          "Didn't offer the one thing",
          "Watched what happened afterwards",
          "Offered it anyway",
        ],
      },
      performedOperation: {
        label: "Did you identify what's being provided and leave one thing unoffered?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much I actually provide",
          "That I'd never tested it",
          "What happened when I didn't",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't not offer it",
          "They didn't notice either way",
          "It confirmed what I feared",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c27-lean",
      version: 1,
      playId: "you-or-what-you-offer",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Sorted what I'd actually seen",
          "Was fair in both directions",
          "Noticed what I couldn't observe yet",
          "Put everything in the provision column",
        ],
      },
      performedOperation: {
        label: "Did you sort by whether it gets them something?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That some of it leans toward me",
          "That most of it is about what I provide",
          "That I can't tell without saying no to something",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything felt like it was about what I provide",
          "There wasn't much to sort",
          "I couldn't be fair to them",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c27-need",
      version: 1,
      playId: "the-work-nobody-counts",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said one need out loud",
          "Said it without apologising for it",
          "Didn't conclude from one reaction",
          "Managed their feelings instead",
        ],
      },
      performedOperation: {
        label: "Did you state one need to one person?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it was received fine",
          "How rarely I say anything",
          "That the reaction was about unfamiliarity",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't get it out",
          "It landed badly and I believed the reaction",
          "I wrapped it in apology",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c27-armor",
      version: 1,
      playId: "what-the-armor-costs",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what the guard costs",
          "Aimed it at one specific check",
          "Let one thing through",
          "Kept it exactly where it is",
        ],
      },
      performedOperation: {
        label: "Did you name the cost and think about aiming instead of lowering?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What it's actually costing",
          "That I need it where it is for now",
          "That it can't tell people apart",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Aiming it felt the same as lowering it",
          "I let something through and regretted it",
          "I need it and that felt like failing",
          "Nothing stuck",
        ],
      },
    },
  ],
};
