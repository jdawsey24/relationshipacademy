/**
 * Cluster 20 — "Difficulty Recognizing My Own Life" — IDENTITY CORE
 * The Relationship Playbook™ · Finding Yourself Again
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Recovery (21) + Expiration (10). Task = Healing. Core Need: TO HEAL.
 *
 * ⚠⚠ SCOPE — 31 OF 91 STATEMENTS. Owner-ruled 30 Jul 2026. Cluster 20 as
 *   catalogued spans ten distinct life events and cannot be one Playbook. It
 *   was resolved as:
 *     • THIS PLAYBOOK (31) — Identity, Divorce & Identity, Separation & Divorce.
 *       One coherent experience: a relationship ended and took the reader's
 *       sense of themselves with it.
 *     • BEREAVEMENT PLAYBOOK (20) — Grief & Loss + Widowhood. Separate, because
 *       nothing here fits it. A widow reading "what was actually mine" would be
 *       badly served.
 *     • FOUR ADD-ONS (40) — Caregiving, Chronic Illness & Disability, Dating
 *       Later in Life, Infertility & Pregnancy Loss. Smaller units, 1–2 tools.
 *
 * ⚠ NOT A BEREAVEMENT PLAYBOOK. Nothing here assumes anyone died. The loss is a
 *   relationship ending, and the person is alive — "I'm grieving someone who's
 *   still alive" is in the data and is a different injury.
 *
 * ⚠ NO TIMELINE CLAIMS. Nothing says how long this takes or that the reader is
 *   behind.
 *
 * ⚠ THE PRACTICAL BLOCK IS NOT LEGAL OR PARENTING ADVICE. "I don't know how to
 *   co-parent" and "how to split our lives apart" route to acknowledgement and
 *   signposting, not instruction.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   PE-1/PE-2 → Identity Reconstruction
 *   PE-3 → Identity Reconstruction · Personal Agency
 *   PE-4 → Grief Integration
 *   PE-5 → Life Reorganization · Support-System Development
 *   PE-7 → Self-Compassion · Narrative Integration
 *
 * ⚠ CLAIM SCOPE. May claim: separate what was shared from what was yours; grieve
 *   an imagined future as a real loss; rebuild the structure a life had; notice
 *   what's returning. MUST NOT CLAIM: that you'll feel like yourself again, that
 *   it takes any particular time, that the old self returns, or that rebuilding
 *   is achievable on a schedule.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C20_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c20-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c20-built-around", "lit-c20-the-future"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The relationship ended and took something else with it. Not just the person. It also took the version of you that lived inside it.",
          "\u201cI don't recognise myself anymore\u201d is the most common sentence here, and people usually say it with some embarrassment, as if it's an overreaction.",
        ],
      },
      {
        kind: "distinction",
        label: "Three losses, usually experienced as one",
        body: [
          "The person. This is grief, and it acts the way grief acts.",
          "The future you'd counted on. A real loss, rarely treated as one, because nothing actually happened to it. It just stopped being true.",
          "The shape of your life. Your week, your friendships, what you talked about, who you were used to being. That one feels like a deep crisis of self, but it's mostly practical.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's worth pulling them apart, because each one needs a different thing, and people usually try to handle all three the same way.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says how long this takes, or that you'll feel like yourself again. What tends to happen is messier than that, and it takes longer than anyone expects.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-built-around",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI built my identity around my relationship\u201d",
    related: ["lit-c20-what-this-is", "lit-c20-what-was-mine"],
    body: [
      {
        kind: "paragraph",
        body: [
          "People usually say this like a confession. It's worth knowing it isn't you failing to be independent. It's what long relationships do, and it happens without anyone choosing it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two people who live side by side for years build up shared tastes, shared friends, shared in-jokes, shared routines. That's not a sign of something unhealthy. It's most of what closeness makes.",
          "The cost only shows up at the end, when it's hard to tell which of it was ever just yours.",
        ],
      },
      {
        kind: "distinction",
        label: "The question that's actually being asked",
        body: [
          "Not: who was I before? That person is years out of date, and you can't go back to them.",
          "But: which of what I have now is mine? A slower question, and one that has an answer.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know who I am without someone to love\u201d is a harder version, and it's worth taking seriously rather than brushing off with comfort. Some people do build themselves around caring for someone, and finding that out is uncomfortable and useful.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-what-was-mine",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Which parts were actually yours",
    related: ["lit-c20-built-around", "lit-c20-dont-know-what-i-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "After a long relationship, almost everything is shared, including things you never talked over. The music, the food, the politics, the way you spend a Sunday.",
        ],
      },
      {
        kind: "distinction",
        label: "Three kinds, and the third is the interesting one",
        body: [
          "Things you brought and kept. Plainly yours.",
          "Things they brought that you took on and would keep. Also yours now. Taking something on doesn't make it borrowed.",
          "Things you did because they wanted to, and never wanted on your own. Those are the ones that fall away, and it can feel like losing yourself when it's the opposite.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most people assume the second kind has to be given up. It doesn't. Learning to like something from someone else is how most people come to like most things.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a checklist to finish. It's a way of noticing, over months, which things stay when nobody's asking you to keep them.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-the-future",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Grieving a future that never happened",
    related: ["lit-c20-what-this-is", "lit-c20-faq-allowed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI'm grieving the future I imagined.\u201d \u201cI miss the life I thought we'd have.\u201d \u201cI never imagined this would be my story.\u201d",
          "This is one of the least talked-about losses there is, because nothing happened to it. There's no event, no date, nothing anyone can point to.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "But you'd been living toward it. You arranged things around it. You said no to things because of it. You counted on it. That's a big part of a life, built around something that has now stopped being true.",
        ],
      },
      {
        kind: "distinction",
        label: "Why it's harder to grieve than the relationship",
        body: [
          "Nobody else can see it. Friends never saw it, so there's nothing for them to share the sadness over.",
          "And it feels like you're not allowed to. You're mourning something that never happened, which sounds like being sentimental, not like loss.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It isn't being sentimental. Losing a future you'd counted on is a commonly named kind of loss, and it explains a lot of feeling lost. \u201cI don't know what my future looks like anymore\u201d is a fair way to put it, not a failure of imagination.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-dont-know-what-i-want",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI don't know what I want anymore\u201d",
    related: ["lit-c20-what-was-mine", "lit-c20-unfamiliar"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This comes up twice here, from two directions, which suggests it matters.",
          "People often read it as a sign something's broken. More often it's a sign you're stretched thin. Knowing what you want takes spare energy, and there hasn't been any.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different not-knowings",
        body: [
          "Not knowing yet. The question needs a working sense of what you like, and that's one of the first things to go under strain.",
          "Not knowing because it was never asked. If a lot of what you wanted was measured against what someone else wanted, the on-your-own version may never have formed.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both get better, and neither gets better by grilling yourself about it. What tends to work is small and concrete. Noticing what you pick when nobody else's wishes are in the room.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know how to dream again\u201d belongs here. Dreaming needs you to believe the future is worth planning, and that's usually one of the last things to come back, not one of the first.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-unfamiliar",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When everything feels unfamiliar",
    related: ["lit-c20-dont-know-what-i-want", "lit-c20-practical"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cEverything feels unfamiliar.\u201d \u201cI don't know what life looks like now.\u201d \u201cI'm rebuilding my life from scratch.\u201d \u201cI don't know how to be alone.\u201d",
        ],
      },
      {
        kind: "distinction",
        label: "The part that's practical",
        body: [
          "A relationship holds a huge amount in place: evenings, weekends, meals, who you tell about your day, what happens on a Sunday, who you'd call first.",
          "All of that loses its frame at once, and it can feel like an identity crisis. A good deal of it is not knowing what to do on a Tuesday.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That part answers to ordinary things. Something on the calendar, someone to see, something that happens whether or not you feel like it. Not deep insight. Plans.",
          "It seems too small for the size of the problem, but it's one of the few things that reliably helps.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know how to be alone\u201d points to a real skill, and most people have had no reason to build it. It comes with practice, not with accepting it, and it's usually worse at the start than it stays.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-practical",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The practical splitting apart",
    related: ["lit-c20-unfamiliar", "lit-c20-faq-failed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to tell people we're separating.\u201d \u201cI don't know how to split our lives apart.\u201d \u201cI don't know how to co-parent.\u201d",
          "These are real, and this isn't the right tool for most of them. Nothing here is legal advice, money advice, or guidance on parenting arrangements.",
        ],
      },
      {
        kind: "distinction",
        label: "What is within reach",
        body: [
          "Telling people. That's a communication problem, and it's smaller than it feels. Most people need one sentence, not a whole explanation.",
          "The rest, like finances, housing, and plans for the children, needs people who do that work. A lawyer, a mediator, a family service.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's worth pulling the practical load apart from the identity one, because you carry them as one weight, and only one of them has professionals for it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Co-parenting especially has a large body of specific guidance behind it, and getting it wrong early costs a lot. That's worth going to someone for rather than working it out on your own.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c20-faq-failed",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cI feel like I failed\u201d",
    related: ["lit-c20-practical", "lit-c20-faq-allowed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Nearly everyone whose relationship ends says some version of this. The people who were left, and the people who left.",
        ],
      },
      {
        kind: "distinction",
        label: "What the word is doing",
        body: [
          "The word \u201cfailure\u201d means there was a task you could pass or fail. The only way to pass is \u201cstaying together,\u201d which makes every ending a failure, no matter what was in it or why it stopped.",
          "That's a strange test, and nobody would use it on a friendship, a job, or a city they moved away from.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want my past to define me\u201d is the same worry from the other side, and it's a fair thing to want. Worth noticing that right now it defines you mostly to yourself. Other people think about it far less than it feels like.",
        ],
      },
    ],
  },

  {
    id: "lit-c20-faq-allowed",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "When will I feel like myself again?",
    related: ["lit-c20-what-this-is", "lit-c20-dont-know-what-i-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We don't know, and we're not going to give you a number. The ones you hear going around are made up.",
        ],
      },
      {
        kind: "distinction",
        label: "What can honestly be said about the shape of it",
        body: [
          "Most people don't go back to the earlier version of themselves. That one was shaped partly by the relationship, and it isn't sitting somewhere waiting.",
          "What tends to happen instead is a slow build-up. Things that are yours, picked when nobody else's wishes were in the room. It builds rather than comes back.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI miss the version of me that laughed more\u201d is worth holding onto as a picture of what you're aiming at, not a person you have to rebuild.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If it's been a long stretch with no change at all, or it's affecting your sleep, your eating, or your ability to get through a day, that's worth taking to a doctor. It's a separate thing that often shows up alongside this and needs different help.",
        ],
      },
    ],
  },
];
