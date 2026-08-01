/**
 * Cluster 21 — "Feeling Like We Want Different Things" — VOLUME II
 * The Relationship Playbook™ · Asking Better Questions Early
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Exclusivity (20 of 48 statements). Task = Intentional Investment.
 * Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ THIS READER IS NOT IN TROUBLE. Eight of twenty statements are wants and the
 *   rest are "I don't know how to…" — skill gaps, not dysfunction. This is the
 *   first preventive Playbook in the set rather than a remedial one, and the
 *   tone must reflect that. Nothing here treats the reader as stuck, hurt, or
 *   mistaken.
 *
 * ⚠ FAITH NEUTRALITY IS LOAD-BEARING. Nine of twenty statements touch faith.
 *   The content must work equally for someone devout, someone deconstructing,
 *   someone of a different faith, and someone with no faith and strong values.
 *   No position is taken on what anyone should believe or practise, and no
 *   assumption is made about which faith, if any.
 *
 * ⚠ NO TIMING RULES. "When should I bring up children" has no correct answer
 *   and anyone supplying a number is guessing. What exists is better and worse
 *   ways of finding out.
 *
 * ⚠ VOLUME I is the couple already together discovering a mismatch. This volume
 *   is someone still dating. Readers in the first position route out via
 *   `rec-c21b-already-together`.
 *
 * ⚠ CLAIM SCOPE. May claim: raise the big things as information rather than as
 *   an interview; tell a preference difference from a structural one; date in a
 *   way that matches your own values. MUST NOT CLAIM: that any timing is right,
 *   that shared faith or values are necessary or unnecessary, that compromise
 *   has a correct amount, or that asking well produces compatibility.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C21B_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c21b-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c21b-when-to-raise", "lit-c21b-wisdom-over-chemistry"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Most of what's written for people dating assumes something has gone wrong. This isn't that.",
          "You want to ask better questions early. You want to know someone beyond attraction. You want to date in a way that matches what you actually believe. None of that is a problem to be fixed.",
        ],
      },
      {
        kind: "distinction",
        label: "What's actually missing",
        body: [
          "Not insight. You already know what matters to you. That's further than most people get.",
          "The how-to. When to raise the big things, how to raise them without it turning into an interview, and how to tell which differences are actually going to matter.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There are no rules here about timing, and anyone who gives you a number of dates is guessing. What exists is better and worse ways of finding things out. That's a smaller, more honest offer.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-when-to-raise",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When to raise the big things",
    related: ["lit-c21b-not-an-interview", "lit-c21b-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know when to talk about marriage.\u201d \u201cI don't know when to talk about children.\u201d",
          "There's no correct week, and no rule everyone agrees on. What there is: a cost to raising it early, and a much larger cost to raising it late.",
        ],
      },
      {
        kind: "distinction",
        label: "The uneven trade worth knowing",
        body: [
          "Bring it up early and you risk seeming intense, or ending something that might have been good.",
          "Bring it up late and you risk two years, real attachment, and finding out something you could have known in week three.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people wait far longer than makes sense, because the early cost is right now and the late cost feels like a 'maybe' until it isn't.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "A rough guide, not a rule: bring it up before you're attached enough that the answer would be hard to act on. That point comes sooner than most people expect.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-not-an-interview",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Asking without it becoming an interview",
    related: ["lit-c21b-when-to-raise", "lit-c21b-hard-conversations"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The fear behind most of the waiting isn't the question. It's that asking turns a nice evening into a test.",
          "It can. The difference is almost all in whether you go first.",
        ],
      },
      {
        kind: "distinction",
        label: "Two versions of the same question",
        body: [
          "\u201cDo you want children?\u201d \u2014 a question put to them. It needs an answer, and it comes with no lead-in.",
          "\u201cI've always assumed I'd have children. What about you?\u201d \u2014 you offer something first, then ask. Now it's an exchange.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Going first also does something else: it tells them what you actually think — which is the thing you're hoping they'll do. People match the tone they're given.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "You can still ask three of these in one evening and end up with an interview. One at a time, spread out, isn't a technique \u2014 it's just how conversations work.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-which-differences",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Which differences will actually matter",
    related: ["lit-c21b-compromise", "lit-c21b-faith"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if we're aligned on what matters most.\u201d \u201cI don't know if our lifestyles are compatible.\u201d",
          "Nearly every couple is different in ways that don't matter and similar in ways that don't help. The sorting is the useful part.",
        ],
      },
      {
        kind: "distinction",
        label: "The test that works better than a list",
        body: [
          "Does this difference mean the lives you each want can't both happen? If yes, it's structural, and it doesn't get worked out \u2014 it gets decided about.",
          "If it would just be harder, or need some give and take, it's a preference. Most differences are preferences.",
        ],
      },
      {
        kind: "list",
        label: "The ones that most often turn out structural",
        items: [
          "Children \u2014 whether, and roughly when.",
          "Where you live, when that's truly fixed for one of you.",
          "How much of the week a faith or practice shapes \u2014 not what's believed.",
          "Whether the relationship is monogamous.",
          "What money is for, rather than how much of it there is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Someone else's list won't fit you. \u201cThat wouldn't bother me\u201d is information about them, and it's the least useful thing anyone will say to you about your own relationship.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-compromise",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cHow much compromise is healthy?\u201d",
    related: ["lit-c21b-which-differences", "lit-c21b-own-terms"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's no amount, and the question is usually asking for a number that doesn't exist. But it does have a shape.",
        ],
      },
      {
        kind: "distinction",
        label: "Compromise on preference, not on structure",
        body: [
          "Preferences can be met in the middle. Where you holiday, how often you see people, whose family at Christmas. Compromising there is just how two people live together.",
          "Structural things can't be met in the middle. Half a child doesn't exist. Living halfway between two cities usually suits nobody. Compromising there means one person not getting the thing.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the question isn't how much. It's what kind \u2014 and a lot of compromise on preferences is healthy, while even a little compromise on structure tends not to be.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't want to ignore important differences\u201d is worth holding onto. Ignoring them early is very common, completely understandable, and the single most reliable source of the situation described in Volume I of this Playbook.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-faith",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When faith is part of it",
    related: ["lit-c21b-which-differences", "lit-c21b-hard-conversations"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if shared faith is important.\u201d We're not going to answer that, either way. It depends entirely on what faith does in your life, and only you know that.",
        ],
      },
      {
        kind: "distinction",
        label: "One distinction that helps more than the belief question",
        body: [
          "What you each believe. This can be very different and often matters less than people expect.",
          "How much of your actual week it shapes \u2014 what you do on Sundays, what you eat, which holidays, how children would be raised, who you spend time with, what you'd want at a wedding or a funeral.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second is what causes friction, and you can check it early. Couples with different beliefs but similar practices often do fine. Couples with similar beliefs but very different practices often don't.",
          "\u201cMy faith has changed how I view relationships\u201d is worth saying out loud early for the same reason \u2014 it changes what the week looks like, and that's the part someone needs to know.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't want to compromise my beliefs\u201d is a fair position and nothing here suggests you should. If shared faith is structural for you, it's structural \u2014 that's a fact about your life, not a stubbornness to be worked on.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-hard-conversations",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Faith, politics, and the conversations that go wrong",
    related: ["lit-c21b-not-an-interview", "lit-c21b-faith"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to discuss politics respectfully.\u201d \u201cI don't know how to have hard conversations about faith.\u201d",
          "Both go wrong the same way: they turn into a debate about who's right, when what you were trying to find out was what it means to the person.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different conversations",
        body: [
          "Is this view right? Nobody wins that one, and neither of you will change your mind over dinner.",
          "What does holding this do to your life? You can answer that, it's interesting, and it's the real information you need.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second version also tends to go over better, because it's a real question rather than an opinion in disguise \u2014 and people can tell the difference right away.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some differences can't be bridged, and finding that out is the point of asking. A conversation that turns up a real mismatch hasn't gone wrong.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-own-terms",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Dating on your own terms",
    related: ["lit-c21b-wisdom-over-chemistry", "lit-c21b-compromise"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want to honour my values while dating.\u201d \u201cI don't know how to date with integrity.\u201d",
          "The hard part isn't knowing your values. It's that dating has strong defaults, so holding a different position means explaining it, over and over, to people who didn't ask.",
        ],
      },
      {
        kind: "distinction",
        label: "What tends to make it easier",
        body: [
          "Saying it as a fact about you rather than a stand you have to defend. \u201cI don't do that\u201d needs no argument attached.",
          "Saying it before anyone pushes back rather than in the moment they do. Much easier as a simple fact than as a “no”.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "You'll lose some people this way. That's not the method failing \u2014 it's the method working, sooner and at less cost than it would have otherwise.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nobody is owed an explanation of your values, and \u201cthat's just how I do it\u201d is a complete sentence. If someone demands a reason for something that affects only you, that's information.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c21b-wisdom-over-chemistry",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cI want wisdom more than chemistry\u201d",
    related: ["lit-c21b-own-terms", "lit-c21b-which-differences"],
    body: [
      {
        kind: "paragraph",
        body: [
          "One of the clearest things anyone says in this material. It's worth taking at face value rather than treating it as settling for less.",
        ],
      },
      {
        kind: "distinction",
        label: "Chemistry isn't the enemy",
        body: [
          "It matters, and a relationship without it is hard to keep going. Nothing here suggests ignoring it.",
          "But it isn't information about fit. It tells you how you feel in the room with someone. That's real, but it's a different question from whether the lives work.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI want to know someone beyond attraction\u201d is the same instinct, said plainly. Attraction is there in the first hour. Almost everything else takes weeks, and the weeks are the part most people skip.",
        ],
      },
    ],
  },

  {
    id: "lit-c21b-faq-too-early",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Will asking early scare people off?",
    related: ["lit-c21b-when-to-raise", "lit-c21b-not-an-interview"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Some people, yes. That's worth being honest about rather than smoothing over.",
        ],
      },
      {
        kind: "distinction",
        label: "Who it tends to scare off",
        body: [
          "People who don't want the thing you're asking about. Which is what you were trying to find out.",
          "People who find any directness uncomfortable. Also information, and it will come up again later about something else.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's a real cost, and it comes up front. You'll have fewer second dates and fewer eighteen-month surprises, and only you can say whether that trade is worth it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The version that really does scare people is three big questions in one evening, delivered as a test. That's not directness \u2014 it's an interview, and the difference is obvious from the other side of the table.",
        ],
      },
    ],
  },
];
