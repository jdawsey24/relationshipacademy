/**
 * Cluster 10 — "Feeling Like I'm Carrying This Alone"
 * The Relationship Playbook™ · Building a True Partnership
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Expansion. Task = Integration. Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ 10 of 18 statements are RELATIONAL CONDITION. "Your half" applies
 *   (Cluster 7 precedent) — but with a specific twist: in this cluster the
 *   reader's half IS the over-functioning. So the work is partly about doing
 *   LESS, which is the opposite of every other cluster's ask.
 *
 * ⚠ THE CENTRAL TRAP. The obvious advice is "communicate more clearly" or
 *   "ask them to step up" — which is more managing, delivered by the person
 *   already doing all the managing. Every tool here has to avoid adding to
 *   the load it's meant to reduce.
 *
 * ⚠ RESENTMENT GUARD. This cluster runs hot. Content must not become a case
 *   against the partner, and the tools must not function as evidence-gathering.
 *
 * ⚠ THE LAST THREE STATEMENTS ARE THE CLEAREST WANTS IN ANY CLUSTER —
 *   "I don't want to be the relationship manager anymore", "I don't want to
 *   teach someone how to love me", "I want a partner, not another
 *   responsibility." Recognition/Context; they are what the reader is aiming at.
 *
 * ⚠ CLAIM SCOPE. May claim: see the load clearly; stop pre-empting; hand one
 *   thing over properly; say what you want instead. MUST NOT CLAIM: that they
 *   will step up, that the balance shifts, or that the relationship becomes
 *   equal.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C10_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c10-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c10-invisible-work", "lit-c10-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It isn't the tasks. That's the thing most people get wrong about this, including the person living it.",
          "You could hand over half the tasks tomorrow and still feel exactly like this, because what's actually tiring is being the one who holds the whole thing in mind.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different loads",
        body: [
          "Doing things. Visible, countable, and shareable.",
          "Keeping track of what needs doing, noticing when something's wrong, remembering, anticipating, deciding when to raise it. Invisible, uncountable, and it doesn't get shared by delegating tasks.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI notice everything; they notice nothing\u201d is the sentence that gets at it. Not that they do nothing \u2014 that the noticing is entirely yours.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is also the cluster where the obvious advice makes things worse. \u201cCommunicate more clearly\u201d and \u201cask them to do more\u201d are both more managing, done by the person already doing all of it. We'll try not to do that.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-invisible-work",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The work nobody can see",
    related: ["lit-c10-what-this-is", "lit-c10-how-it-happened"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's a category of work that only exists in your head, and it's the part that doesn't show up in any fair division of labour.",
        ],
      },
      {
        kind: "list",
        label: "What it's made of",
        items: [
          "Knowing what's coming up and when.",
          "Noticing that something has started to go wrong before it goes wrong.",
          "Remembering what was agreed.",
          "Deciding whether now is a good moment to raise something.",
          "Anticipating what will be needed and by whom.",
          "Holding the whole picture, continuously, in the background.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of that is visible from outside. Which means your partner may be entirely willing and genuinely unaware, and both of those can be true at once.",
          "It also means \u201cI do more\u201d conversations tend to go badly. You're describing something they can't see, and they respond by listing the tasks they do \u2014 which is the wrong list, and then you're both frustrated.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Naming the invisible part specifically is much more effective than arguing about the tasks. Not because it wins the argument, but because it's the thing you actually mean.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-how-it-happened",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "How you ended up with all of it",
    related: ["lit-c10-invisible-work", "lit-c10-doing-less"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Nobody agreed to this arrangement. It assembled itself, and it usually happened in one of a few ways.",
        ],
      },
      {
        kind: "list",
        label: "The usual routes",
        items: [
          "You noticed first. Repeatedly. And noticing first turns into owning it.",
          "You're better at it, so it was efficient. Efficient once becomes permanent.",
          "You asked, it was done badly or late, and redoing it was easier than the conversation.",
          "You pre-empted. You did it before it needed asking for, so the asking never happened.",
          "Something got busy \u2014 a baby, a job, an illness \u2014 and the temporary arrangement never got renegotiated.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Every one of those was reasonable at the time. That's why this isn't anybody's fault in the way it feels like it should be.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also why \u201cwhy don't they just\u201d has no useful answer. Mostly because you got there first, for years, and they adapted to a world in which they didn't have to.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-doing-less",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The uncomfortable part: doing less",
    related: ["lit-c10-how-it-happened", "lit-c10-not-a-test"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Every other version of relationship advice asks you to do something more. This one asks you to do something less, which is harder.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Because as long as you're pre-empting, there's no gap for anyone to step into. The thing gets handled, so it never becomes visible as something that needed handling.",
          "Leaving a gap means something may go wrong. Briefly, visibly, and in a way you could have prevented. That's the actual cost, and it's why most people don't do it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that look identical",
        body: [
          "Making room \u2014 not doing something, and saying you're not doing it, so it can be picked up.",
          "Withdrawing to prove a point \u2014 not doing something silently and waiting to see what happens.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The second one is tempting and it doesn't work. It produces a mess and a row, and the row is about the mess rather than about the arrangement.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-not-a-test",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Handing something over properly",
    related: ["lit-c10-doing-less"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Handing over a task and handing over the noticing are different, and only the second one reduces the load.",
        ],
      },
      {
        kind: "distinction",
        label: "The difference in practice",
        body: [
          "\u201cCan you do the bins tonight?\u201d \u2014 you still own the bins. You're delegating an instance and keeping the tracking.",
          "\u201cThe bins are yours now. I'm not going to remind you.\u201d \u2014 that's the transfer. It includes the part where you don't remind them, which is the whole point and the hard bit.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one means it will sometimes be forgotten. If you can't tolerate that, the transfer hasn't happened \u2014 you've just added anxiety to a job you still own.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Start with something where the consequence of it being forgotten is genuinely small. Not the school forms. Something you could survive going wrong twice.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-parenting-them",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cI feel like I'm parenting my partner\u201d",
    related: ["lit-c10-doing-less", "lit-c10-faq-love-me"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's one of the most common sentences in this territory and one of the most corrosive, because of what it does to how you see them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Once someone is a person you manage, a lot of other things become difficult. Attraction, mostly. Asking them for anything. Being looked after yourself \u2014 which is hard to accept from someone you've cast as needing supervision.",
        ],
      },
      {
        kind: "distinction",
        label: "Two situations that look identical from inside",
        body: [
          "Usually: someone who stopped participating because it was consistently done for them, and has adapted to a world where they didn't have to. This is the common one, and it moves \u2014 slowly, and only once the doing-for stops.",
          "Occasionally: someone who genuinely can't or won't participate at all. Real, and this Playbook won't fix it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's worth knowing that the first is far more common than it feels from where you're standing. When you've been carrying everything for years, the obvious explanation is that they're incapable \u2014 and the more likely one is that they adapted to a system that never required them.",
          "That's not a defence of them. It's the difference between a person and a pattern, and only one of those can change.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We can't tell you which you have, and you probably can't tell from inside it either. What you can do is stop the doing-for and find out \u2014 which is what the tools here are for. If nothing moves after a real attempt, that's when you've learned something about the person rather than the arrangement.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-what-you-want",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you actually want",
    related: ["lit-c10-what-this-is", "lit-c10-faq-love-me"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Three sentences people say here, and they're the clearest statements of want anywhere in this material.",
        ],
      },
      {
        kind: "list",
        items: [
          "I don't want to be the relationship manager anymore.",
          "I don't want to teach someone how to love me.",
          "I want a partner, not another responsibility.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Those aren't complaints. They're a description of what partnership means to you, and it's worth noticing how specific it is: you want someone who arrives already carrying half of it, rather than someone who can be trained into carrying half of it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That's a legitimate thing to want, and we're not going to talk you into settling for the trained version. It's also worth being honest that the difference between \u201cthey won't\u201d and \u201cthey haven't been given room to\u201d matters enormously here, and only one of those is workable.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c10-faq-love-me",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Shouldn't they just know?",
    related: ["lit-c10-invisible-work", "lit-c10-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Ideally, yes. And it's exhausting that they don't.",
          "The honest position is that some of it they genuinely can't see, and some of it they've stopped looking for because it was always handled. Neither is a defence, and both are real.",
        ],
      },
      {
        kind: "distinction",
        label: "Why \u201cthey should just know\u201d is a dead end",
        body: [
          "It might be true and there's nothing in it to do.",
          "The version with something in it: they can't see the invisible work, so it has to be described \u2014 once, specifically \u2014 before you find out whether they'd have carried it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Describing it once isn't teaching someone how to love you. Doing it every week for four years is, and that's the line worth watching.",
        ],
      },
    ],
  },

  {
    id: "lit-c10-faq-nothing-changes",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I do all this and nothing changes?",
    related: ["lit-c10-doing-less", "lit-c10-parenting-them"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Then you'll know something you don't currently know, which is worth more than it sounds.",
        ],
      },
      {
        kind: "distinction",
        label: "What you'd have established",
        body: [
          "Right now you can't tell whether they won't participate or whether they've never had to. Those look the same from inside.",
          "Make room, describe the invisible part once, hand something over properly \u2014 and if nothing moves, you've distinguished them. That's a hard answer and it's an actual answer.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you get there, the next step isn't more of this. It's the two of you with someone else in the room \u2014 or a decision, which is a different conversation and a legitimate one.",
        ],
      },
    ],
  },
];
