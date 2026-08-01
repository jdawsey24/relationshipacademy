/**
 * Cluster 7 — "Difficulty Communicating Without It Becoming a Fight"
 * The Relationship Playbook™ · Breaking the Cycle of the Same Arguments
 * Field Guide literature. 8 Core Guides + 3 Question Reads.
 *
 * FIRST EXPANSION-PHASE CLUSTER. Task = Integration. 26 Expansion
 * competencies apply. Nothing carries over from Clusters 3-6.
 *
 * ⚠⚠ SAFETY — HIGHEST OF ANY CLUSTER TO DATE.
 *   Owner ruling: "I don't feel emotionally safe" routes OUT of the tools,
 *   never into one. Every tool here involves raising difficult things and
 *   staying in the conversation. That is the wrong instruction for someone
 *   frightened of their partner. `lit-shared-if-you-dont-feel-safe` is a
 *   dedicated exit guide and is surfaced first for anyone who taps that card.
 *   NOTHING in this cluster may frame intimidation, contempt, or control as a
 *   communication problem.
 *
 * ⚠ SCOPE — "YOUR HALF". Owner ruling. 16 of 30 statements describe the
 *   couple, not the reader. The Playbook has one reader. Every tool works on
 *   what that reader controls, and the content states plainly that the other
 *   half is not theirs to move. No copy may promise the pattern will change.
 *
 * ⚠ CLAIM SCOPE. May claim: raise something without it becoming the fight;
 *   stop being the only one who raises things; notice when it turns and slow
 *   it; go back afterwards. MUST NOT CLAIM: that the arguments will stop, that
 *   the other person will change, that the relationship will improve, or that
 *   better communication fixes a relationship that isn't safe.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

import { SAFETY_GUIDE } from "./shared/safety-not-safe";

export const C7_LITERATURE: LiteratureEntry[] = [
  SAFETY_GUIDE, // shared — do not re-author per cluster

  {
    id: "lit-c7-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c7-your-half", "lit-c7-same-argument"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You know how it goes before it starts. Something needs saying, you can already see the shape of the next hour, and you decide it isn't worth it.",
          "Or you say it, and within four minutes you're arguing about something else entirely, and the original thing never gets discussed.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that look like one",
        body: [
          "The issue: the actual thing that needed saying. Usually solvable, often quite small.",
          "The pattern: what happens when either of you tries to raise anything. Not solvable by settling the issue, which is why settling issues hasn't helped.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cWe solve the issue but never the pattern\u201d is the most precise sentence in this cluster. The issues do get resolved. The next one goes the same way.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-your-half",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your half",
    related: ["lit-c7-what-this-is", "lit-c7-faq-am-i-the-problem"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Most of what people say about this is in the plural. We keep having the same argument. We don't know how to disagree. We apologise but nothing changes.",
          "That's accurate — it is a two-person pattern. Which creates an honest problem for something like this, and we'd rather name it than work around it.",
        ],
      },
      {
        kind: "distinction",
        label: "What this can and can't do",
        body: [
          "It can work on your half: how you raise something, whether you're always the one raising it, what you do when it turns, whether you go back afterwards.",
          "It can't move their half. Nothing you do here makes them listen, stop shutting down, or stop escalating. We're not going to imply otherwise.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's less than you probably wanted. It's also not nothing — a two-person pattern usually has two people holding it up, and changing your side does change what the pattern has to work with.",
          "But it might not be enough, and if it isn't, that isn't you having failed at this.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you find yourself doing all of this and nothing shifts, the answer probably isn't trying harder alone. It's the two of you, with someone in the room.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-same-argument",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why the same argument keeps coming back",
    related: ["lit-c7-raising-it", "lit-c7-repair"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe fight about the same things every week.\u201d \u201cWe have the same conversation over and over.\u201d",
          "An argument that repeats isn't unresolved. It's resolved repeatedly, in the same way, and the resolution doesn't hold.",
        ],
      },
      {
        kind: "distinction",
        label: "Usually because the argument isn't about what it's about",
        body: [
          "The surface: the bins, the phone, being late, whose turn it was.",
          "Underneath: something about how much you're each carrying, or whether you matter, or who gets to decide. That part never gets raised, so it never gets settled.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which means resolving the surface version is a real achievement that changes nothing. You'll be back next week with a different set of bins.",
          "The move — and it's uncomfortable — is to raise the pattern once, rather than the incident again.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Raising the pattern is a bigger conversation and it goes wrong more often. It's worth doing when things are calm, not in the middle of the fourth instance.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-raising-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Raising it without starting it",
    related: ["lit-c7-same-argument", "lit-c7-when-it-turns"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to bring things up without starting a fight.\u201d \u201cI avoid difficult conversations because they're exhausting.\u201d",
          "Avoidance here isn't cowardice. It's a calculation, and often a correct one — the conversation genuinely does cost more than the thing being raised.",
        ],
      },
      {
        kind: "list",
        label: "What tends to make the difference",
        items: [
          "Timing. Not in the moment, not late at night, not while either of you is already annoyed.",
          "One thing. Not the accumulated list, however tempting.",
          "Specific and recent. \u201cOn Tuesday, when\u201d rather than \u201cyou always\u201d.",
          "Say what you want, not only what's wrong. A complaint invites defence; a request invites an answer.",
          "Shorter than feels sufficient. The longer the opening, the more there is to argue with.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of these guarantee it goes well. They change the odds, and they mean that if it goes badly you know it wasn't the delivery.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-when-it-turns",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When it starts turning",
    related: ["lit-c7-raising-it", "lit-c7-repair"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's usually a moment. The conversation is still a conversation, and then it isn't, and afterwards you can both point at roughly when.",
          "Most people notice it. Very few do anything at the time, because by then the thing has its own momentum.",
        ],
      },
      {
        kind: "list",
        label: "Common signs it's turning",
        items: [
          "The subject changes to something older.",
          "One of you starts explaining rather than listening.",
          "Absolute words arrive \u2014 always, never, every time.",
          "You notice you're building your reply while they're still talking.",
          "Your body gets there before you do \u2014 chest, jaw, voice.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Your half of this is small and specific: name it, and stop. Not win it, not fix it, not explain why it turned. \u201cThis is going the usual way — can we come back to it?\u201d",
          "It works about as often as it doesn't. Which is a considerable improvement on nothing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Pausing is only pausing if you come back. A pause that becomes never mentioning it again is avoidance wearing better clothes.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-repair",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Repair is a separate skill",
    related: ["lit-c7-when-it-turns", "lit-c7-shutting-down"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe don't know how to repair after arguments.\u201d \u201cWe apologise but nothing changes.\u201d",
          "Those two sentences are pointing at the same thing: an apology closes the incident. It doesn't reconnect anybody.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different jobs",
        body: [
          "Apology: I'm sorry for the thing I did. Necessary, and it ends the argument.",
          "Repair: coming back to each other afterwards. Naming what happened, checking you're both still here, sometimes just being in the same room without an agenda.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most couples who fight the same fight forever are decent at apologising and have no repair at all. The argument ends and then there's a gap, and the gap is where the next one gets built.",
          "Repair is also the part you can do a surprising amount of alone. Going back is one-sided until it isn't.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-shutting-down",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When one of you goes quiet",
    related: ["lit-c7-repair", "lit-c7-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cThey shut down.\u201d \u201cOne of us always shuts down.\u201d \u201cI stop talking because nothing changes.\u201d",
          "Notice that the last one is the same behaviour described from inside. Whoever goes quiet usually has a reason that makes sense to them.",
        ],
      },
      {
        kind: "distinction",
        label: "What it usually is",
        body: [
          "Not indifference, though it reads as indifference from the outside.",
          "Usually overload, or the conclusion that speaking makes it worse. Both produce silence, and silence is the most maddening thing to be on the other side of.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "If it's them, there's very little you can do at the time. Pressing harder reliably makes it last longer.",
          "If it's you, the useful thing isn't forcing yourself to keep talking. It's saying that you've gone quiet and you'll come back — which is a sentence, not a conversation.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Silence used deliberately to punish someone is a different thing from being overwhelmed, and it isn't covered here. If that's what's happening, read \u201cIf you don't feel safe\u201d.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c7-faq-is-this-normal",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is this normal, or is something actually wrong?",
    related: ["lit-c7-same-argument", "lit-shared-if-you-dont-feel-safe"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Arguing is normal. Arguing about the same thing repeatedly is extremely common. Neither tells you much about whether a relationship is in trouble.",
        ],
      },
      {
        kind: "distinction",
        label: "More useful indicators",
        body: [
          "Can you recover? Couples who fight often and reconnect afterwards tend to do better than couples who fight rarely and stay distant for days.",
          "Is contempt in it? Eye-rolling, mockery, talking about each other rather than to each other. That one matters more than volume.",
          "Do you feel safe? If not, that isn't a communication question at all.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We can't tell you whether your relationship is in trouble and wouldn't try. What we can say is that frequency alone isn't the signal people assume it is.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-faq-therapy",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Should we see someone?",
    related: ["lit-c7-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Possibly, and earlier than most people do. Couples commonly wait years, by which point there's a lot more to unpick.",
        ],
      },
      {
        kind: "list",
        label: "Reasons to think about it now rather than later",
        items: [
          "You've both tried and the same thing keeps happening.",
          "The pattern is the problem, and the pattern needs both of you in the room.",
          "One of you has started managing the other rather than talking to them.",
          "You've been doing your half for a while and nothing has shifted.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This Playbook works on one person's half. That's a real limit, not modesty. If your half isn't enough, the next step is the two of you with someone \u2014 not you trying harder.",
        ],
      },
    ],
  },

  {
    id: "lit-c7-faq-am-i-the-problem",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I'm the problem?",
    related: ["lit-c7-your-half", "lit-c7-shutting-down"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's rarely one person, and the question usually isn't as useful as it feels.",
          "Patterns take two. Even when one person is doing something more obviously difficult, the shape it settles into is built by both.",
        ],
      },
      {
        kind: "distinction",
        label: "A better question",
        body: [
          "Not: whose fault is this?",
          "But: what's my move in it? Everyone has one — avoiding, over-explaining, going quiet, keeping score, being the only one who raises things.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Knowing your move is genuinely useful, because it's the only part you can do anything with. Deciding you're the problem isn't the same thing, and mostly it just makes raising anything harder.",
        ],
      },
    ],
  },
];
