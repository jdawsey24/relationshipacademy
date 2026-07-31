/**
 * Cluster 21 — "Feeling Like We Want Different Things" — VOLUME I
 * The Relationship Playbook™ · Building a Shared Future
 * Field Guide literature. 8 Core Guides + 2 Question Reads.
 *
 * Track: Expiration (28 of 48 statements). Task = Acceptance.
 * Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ TWO VOLUMES. Owner-ruled: some of this cluster is a couple already together
 *   discovering a mismatch (Expiration), and some is someone still dating,
 *   working out when to raise things and what matters (Exclusivity). Different
 *   phases, different readers. Volume II is authored separately.
 *
 * ⚠ MUST NOT PUSH TOWARD ENDING. Expiration is the track, but this reader has
 *   not decided anything. Same constraint as Cluster 11: nothing leans toward
 *   staying or leaving.
 *
 * ⚠ CULTURAL AND RACIAL DIFFERENCE — handled as real and permanent, not as a
 *   problem to be solved. Nothing here may suggest either person should become
 *   less themselves, and nothing takes a position on any culture, faith, or
 *   political view. The workable thing is the repeating misunderstanding, never
 *   the difference itself.
 *
 * ⚠ FAITH — neutral across all faiths and none. "We don't agree about faith" is
 *   treated as a compatibility question with no correct answer, in either
 *   direction.
 *
 * ⚠ CLAIM SCOPE. May claim: work out which differences are load-bearing; tell a
 *   permanent difference from a repeating misunderstanding; say what you want
 *   it to become. MUST NOT CLAIM: that difference can be overcome, that love is
 *   or isn't enough for you, that any value should be compromised, or that
 *   staying or leaving is right.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C21_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c21-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c21-load-bearing", "lit-c21-outgrown"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've noticed a gap. Not a fight, not a betrayal — a difference in what you each want your life to look like.",
          "And the difficulty is that nobody can tell you how much it matters, because that depends entirely on which difference it is and on you.",
        ],
      },
      {
        kind: "distinction",
        label: "Three things that get called the same thing",
        body: [
          "Differences that are permanent and fine. Most of them. Two people are never going to want identical lives.",
          "Differences that are permanent and load-bearing. Fewer, and they don't resolve by being worked on — they get decided about.",
          "Repeating misunderstandings, which look like differences and aren't. Those are workable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most of the exhaustion in this position comes from treating all three the same way — working hard on the permanent ones and letting the workable ones repeat.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here leans toward staying or ending. Plenty of couples with real differences do well, and plenty of couples who look aligned don't. We can't tell you which yours is.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-load-bearing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Which differences are load-bearing",
    related: ["lit-c21-what-this-is", "lit-c21-faq-love-enough"],
    body: [
      {
        kind: "paragraph",
        body: [
          "A load-bearing difference is one where the life you each want cannot both happen. Not one where it would be harder \u2014 one where it can't.",
        ],
      },
      {
        kind: "list",
        label: "The ones that most often turn out to be structural",
        items: [
          "Children \u2014 whether, and roughly when.",
          "Where you live, when that's genuinely fixed for one of you.",
          "How central faith or practice is to daily life, rather than what either of you believes.",
          "Whether the relationship is monogamous.",
          "Money at the level of what it's for, not how much.",
        ],
      },
      {
        kind: "distinction",
        label: "What tends to look structural and isn't",
        body: [
          "Different interests, different politics, different social appetites. Common, workable, and frequently not the actual problem.",
          "Different paces. Someone wanting more of something is a negotiation, not an incompatibility \u2014 unless the gap is very large.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "You're the only one who can say which of yours are load-bearing. Someone else's list won't fit you, and \u201cthat wouldn't bother me\u201d is not information about your relationship.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-outgrown",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI feel like I've outgrown this\u201d",
    related: ["lit-c21-growing-alone", "lit-c21-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's an uncomfortable thing to think and a harder thing to say, because it sounds like a claim about being better.",
          "It usually isn't. It's more often about direction than about height \u2014 you've moved and they haven't come, or they've moved somewhere else.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth separating",
        body: [
          "You've changed and they haven't. Happens, and it isn't anyone's fault \u2014 people don't develop on the same schedule.",
          "You've changed and they've changed differently. Also happens, and it's a different situation: two people moving, not one waiting.",
          "You've changed and they don't know. Surprisingly common. Whole years get spent on a mismatch that has never been described out loud.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cWe're becoming different people\u201d is often said as though it were a verdict. It's a description, and it's true of nearly every long relationship \u2014 what matters is whether the directions still work alongside each other.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-growing-alone",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Growing alone",
    related: ["lit-c21-outgrown", "lit-c21-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel like I'm growing alone.\u201d \u201cI want more out of life than my partner does.\u201d",
          "This is uncomfortable in both directions, and it's usually silent because of that.",
        ],
      },
      {
        kind: "distinction",
        label: "Why neither of you says it",
        body: [
          "The one who's moving can't mention it without sounding like they think they're better.",
          "The one who isn't can't mention it without sounding resentful of someone else's momentum.",
          "So the gap grows in silence, and both people privately conclude the other doesn't care.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Wanting more from your life isn't a criticism of someone who wants less. Those are different appetites, not different values \u2014 though they get treated as the second, which is what makes it so hard to raise.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't want either of us to lose ourselves\u201d is worth holding onto here. It's the most generous framing of this situation available, and it's usually accurate to what both people want.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-faith-values",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When it's faith or values",
    related: ["lit-c21-load-bearing", "lit-c21-cultural"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe don't agree about faith.\u201d \u201cWe have different values.\u201d \u201cWe agree on chemistry but not on life.\u201d",
          "We're not going to take a position on any of it \u2014 not on any faith, not on none, not on what anyone ought to believe. What we can offer is a distinction that tends to be more useful than the belief itself.",
        ],
      },
      {
        kind: "distinction",
        label: "Belief and practice are different questions",
        body: [
          "What you each believe. Can differ enormously and often matters less than people expect.",
          "How much of your actual week it shapes \u2014 Sundays, food, holidays, how children would be raised, who you spend time with. That's the part that produces friction, and it's checkable.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Couples with different beliefs and similar practices often do fine. Couples with similar beliefs and very different practices often don't. \u201cHow important are shared values really?\u201d is answered better by looking at the week than at the belief.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't want to compromise my beliefs\u201d is a legitimate position and nothing here will suggest you should. If a difference is load-bearing for you, it's load-bearing \u2014 that's a fact about you, not a rigidity to be worked on.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-cultural",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When the difference is cultural",
    related: ["lit-c21-faith-values", "lit-c21-same-misunderstanding"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe experience the world differently.\u201d \u201cI feel misunderstood because of my background.\u201d \u201cWe love each other, but our cultures clash.\u201d",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The first of those isn't a problem to be solved. You do experience the world differently, and you will continue to \u2014 that's not a gap that closes with effort, and treating it as one puts a quiet pressure on whichever of you is being asked to move.",
          "Nothing here suggests either of you should become less yourself.",
        ],
      },
      {
        kind: "distinction",
        label: "What is workable",
        body: [
          "Not the difference. The repeating misunderstanding \u2014 the same conversation going wrong the same way, which is a pattern rather than a fact about either of you.",
          "And the practical collisions: family expectations, traditions, who is accommodated at Christmas or Eid or a wedding. Those are negotiable in a way the underlying difference isn't.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to talk about race without hurting each other\u201d deserves an honest answer: sometimes it will be painful even when it goes well. That isn't a sign it's going badly. Conversations where one person is describing something the other hasn't lived are difficult by construction.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI want us to understand each other's experiences better\u201d is the right aim and a slow one. Understanding isn't a state you arrive at \u2014 it accumulates, and it goes backwards sometimes.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-same-misunderstanding",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The same misunderstanding, again",
    related: ["lit-c21-cultural", "lit-c21-load-bearing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe keep having the same cultural misunderstandings.\u201d \u201cOur families have different expectations.\u201d",
          "A misunderstanding that repeats isn't a misunderstanding anymore. It's a pattern, and patterns are workable in a way single events aren't.",
        ],
      },
      {
        kind: "distinction",
        label: "The thing that makes them repeat",
        body: [
          "Each instance gets handled as an instance. This particular Christmas, this particular comment, this particular relative.",
          "The underlying rule never gets stated \u2014 whose family takes precedence, what gets explained and what gets assumed, who does the accommodating and how often.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which means you resolve the instance and it returns in a new costume. Naming the rule is a bigger conversation and it's the only one that stops the repetition.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Worth having when nothing is imminent. Trying to name the rule in the middle of the fourth instance almost never works.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-what-you-want",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you want it to become",
    related: ["lit-c21-growing-alone", "lit-c21-faq-different-things"],
    body: [
      {
        kind: "paragraph",
        body: [
          "In amongst all of this, people say what they actually want, and it's usually the most concrete thing in the conversation.",
        ],
      },
      {
        kind: "list",
        items: [
          "I don't want either of us to lose ourselves.",
          "I want a relationship that helps us both become better.",
          "I don't want our differences to become divisions.",
          "I want us to understand each other's experiences better.",
          "I want us to feel like a team despite our differences.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Notice that none of those ask the other person to change. They describe a way of being together that holds difference rather than resolving it \u2014 which is a different and more achievable aim than agreement.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also worth saying these out loud. They're generous, they're specific, and most partners in this situation have never heard them \u2014 they've only heard the differences.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c21-faq-love-enough",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is love enough to overcome this?",
    related: ["lit-c21-load-bearing", "lit-c21-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "On its own, no \u2014 and that's a fairly consistent answer rather than a comment on your relationship.",
        ],
      },
      {
        kind: "distinction",
        label: "What it's enough for and what it isn't",
        body: [
          "Love carries you through difficulty, disagreement, and long stretches of things being hard. That's not nothing and it's most of what people need it for.",
          "It doesn't make two incompatible lives compatible. If one of you needs children and the other doesn't, love doesn't resolve that \u2014 it makes it more painful.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is why the load-bearing question matters more than the love question. Love is usually present in this situation. It's the thing making the decision hard, not the thing that decides it.",
        ],
      },
    ],
  },

  {
    id: "lit-c21-faq-different-things",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Can two people want different things and stay together?",
    related: ["lit-c21-what-you-want", "lit-c21-load-bearing"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Constantly. Nearly every long relationship contains people who want somewhat different lives and have found a shape that holds both.",
        ],
      },
      {
        kind: "distinction",
        label: "What seems to make the difference",
        body: [
          "Whether the difference is named. Unnamed differences get relitigated forever; named ones get planned around.",
          "Whether the accommodating is shared. One person doing all the bending is a different arrangement, and it usually shows up later as something else.",
          "Whether it's structural. Most differences aren't, and the ones that are can't be accommodated \u2014 only decided about.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI ignored our differences because I was in love\u201d is a common and forgivable thing to have done. It's also worth not doing twice, which is the only reason to look at it.",
        ],
      },
    ],
  },
];
