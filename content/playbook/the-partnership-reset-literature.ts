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

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
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
          "You could hand over half the tasks tomorrow and still feel exactly like this. What's really tiring is being the one who holds the whole thing in mind.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different loads",
        body: [
          "Doing things. You can see them, count them, and share them.",
          "Keeping track of what needs doing, noticing when something's wrong, remembering, seeing what's coming, deciding when to bring it up. You can't see it or count it, and handing off tasks doesn't share it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI notice everything; they notice nothing\u201d is the sentence that gets at it. Not that they do nothing \u2014 it's that the noticing is all yours.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This is also the one where the obvious advice makes things worse. \u201cCommunicate more clearly\u201d and \u201cask them to do more\u201d are both more managing, done by the person already doing all of it. We'll try not to do that.",
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
          "There's a kind of work that only exists in your head. It's the part that doesn't show up in any fair split of the work.",
        ],
      },
      {
        kind: "list",
        label: "What it's made of",
        items: [
          "Knowing what's coming up and when.",
          "Noticing that something has started to go wrong before it goes wrong.",
          "Remembering what was agreed.",
          "Deciding whether now is a good time to bring something up.",
          "Working out ahead of time what will be needed, and by who.",
          "Holding the whole picture in your head, all the time, in the background.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "None of that shows from the outside. So your partner may be fully willing and truly unaware — and both of those can be true at the same time.",
          "It also means \u201cI do more\u201d talks tend to go badly. You're describing something they can't see, and they answer by listing the tasks they do \u2014 which is the wrong list, and then you're both frustrated.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Naming the invisible part clearly works much better than arguing about the tasks. Not because it wins the argument, but because it's the thing you really mean.",
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
          "Nobody agreed to this setup. It built up on its own, and it usually happened in one of a few ways.",
        ],
      },
      {
        kind: "list",
        label: "The usual ways it happens",
        items: [
          "You noticed first. Again and again. And noticing first turns into owning it.",
          "You're better at it, so it made sense at first. What made sense once became the way it always is.",
          "You asked, it got done badly or late, and doing it over was easier than the talk about it.",
          "You did it first. You handled it before anyone had to ask, so the asking never happened.",
          "Something got busy \u2014 a baby, a job, an illness \u2014 and the temporary setup never got worked out again.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Every one of those made sense at the time. That's why this isn't anybody's fault in the way it feels like it should be.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "It's also why \u201cwhy don't they just\u201d has no useful answer. Mostly because you got there first, for years, and they got used to a world where they didn't have to.",
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
          "Because as long as you handle things first, there's no gap for anyone to step into. The thing gets done, so it never shows up as something that needed doing.",
          "Leaving a gap means something may go wrong. For a bit, out in the open, and in a way you could have stopped. That's the real cost, and it's why most people don't do it.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that look the same",
        body: [
          "Making room \u2014 not doing something, and saying you're not doing it, so it can be picked up.",
          "Pulling back to prove a point \u2014 not doing something in silence, and waiting to see what happens.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The second one is tempting, and it doesn't work. It makes a mess and a fight, and the fight is about the mess instead of about the setup.",
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
          "Handing over a task and handing over the noticing are two different things, and only the second one makes the load lighter.",
        ],
      },
      {
        kind: "distinction",
        label: "The difference in real life",
        body: [
          "\u201cCan you do the bins tonight?\u201d \u2014 you still own the bins. You're handing over this one time and keeping the tracking.",
          "\u201cThe bins are yours now. I'm not going to remind you.\u201d \u2014 that's the real handover. It includes the part where you don't remind them, which is the whole point, and the hard part.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one means it will sometimes be forgotten. If you can't stand that, the handover hasn't happened \u2014 you've just added worry to a job you still own.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Start with something where being forgotten really doesn't cost much. Not the school forms. Something you could survive going wrong twice.",
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
          "It's one of the most common sentences in this area, and one of the most damaging, because of what it does to how you see them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Once someone is a person you manage, a lot of other things get hard. Attraction, mostly. Asking them for anything. Being looked after yourself \u2014 which is hard to accept from someone you now see as needing to be looked after.",
        ],
      },
      {
        kind: "distinction",
        label: "Two situations that look the same from the inside",
        body: [
          "Usually: someone who stopped taking part because it was always done for them, and got used to a world where they didn't have to. This is the common one, and it moves \u2014 slowly, and only once the doing-for stops.",
          "Occasionally: someone who truly can't or won't take part at all. Real, and this Playbook won't fix it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's worth knowing that the first is far more common than it feels from where you're standing. When you've been carrying everything for years, the obvious answer is that they can't do it \u2014 and the more likely one is that they got used to a setup that never needed them.",
          "That's not making excuses for them. It's the difference between a person and a pattern, and only one of those can change.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We can't tell you which one you have, and you probably can't tell from the inside either. What you can do is stop the doing-for and find out \u2014 which is what the tools here are for. If nothing moves after a real try, that's when you've learned something about the person, not the setup.",
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
          "Three sentences people say here, and they're the clearest wants anywhere in all of this.",
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
          "Those aren't complaints. They describe what partnership means to you, and it's worth noticing how exact it is: you want someone who arrives already carrying half of it, not someone who can be trained into carrying half of it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "That's a fair thing to want, and we're not going to talk you into settling for the trained version. It's also worth being honest that the difference between \u201cthey won't\u201d and \u201cthey haven't been given room to\u201d matters a lot here, and only one of those can work.",
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
          "The honest truth is that some of it they truly can't see, and some of it they've stopped looking for because it was always handled. Neither is an excuse, and both are real.",
        ],
      },
      {
        kind: "distinction",
        label: "Why \u201cthey should just know\u201d is a dead end",
        body: [
          "It might be true and there's nothing in it to do.",
          "The version with something in it: they can't see the invisible work, so it has to be described \u2014 once, clearly \u2014 before you find out whether they'd have carried it.",
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
          "Then you'll know something you don't know right now, which is worth more than it sounds.",
        ],
      },
      {
        kind: "distinction",
        label: "What you'd have figured out",
        body: [
          "Right now you can't tell whether they won't take part or whether they've never had to. Those look the same from the inside.",
          "Make room, describe the invisible part once, hand something over properly \u2014 and if nothing moves, you've told the two apart. That's a hard answer, and it's a real answer.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you get there, the next step isn't more of this. It's the two of you with someone else in the room \u2014 or a decision, which is a different talk, and a fair one.",
        ],
      },
    ],
  },
];
