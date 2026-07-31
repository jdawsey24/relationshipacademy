/**
 * Cluster 9 — "Difficulty Staying Physically Connected"
 * The Relationship Playbook™ · Rebuilding Physical Connection
 * Field Guide literature. 7 Core Guides + 2 Question Reads.
 *
 * Track: Expansion. Task = Integration. Core Need: TO BE CHOSEN.
 *
 * ⚠ OWNER RULINGS 29 Jul 2026 (Part B, Instance 7):
 *   1. FRAME — this is about WANTED-NESS, not frequency. "I miss affection
 *      more than sex" is the clearest statement in the cluster and the key to
 *      it. No tool is built around initiating more.
 *   2. DESIRE DISCREPANCY — MEDIUM guard. Every tool touching initiation
 *      carries a boundary. The literature states plainly that a difference in
 *      wanting is not something one person fixes by trying harder. Tools work
 *      on TALKING about it, never on GETTING more of it.
 *   3. MEDICAL — FIRM and FIRST. "Before you work on this, rule out the
 *      physical causes." `lit-c9-rule-this-out-first` is the first entry and is
 *      named in the opening screen.
 *   4. JOINT WORK — unlike Clusters 7 and 8, this is not "your half". The work
 *      itself requires the other person. Tools produce a CONVERSATION, not a
 *      solo practice. Missions are "have this talk".
 *
 * ⚠ CONTENT — clinical and practical throughout. Non-explicit. This is
 *   relationship therapy material, written the way a therapist would write it.
 *
 * ⚠ CLAIM SCOPE. May claim: work out what you actually miss; say it out loud;
 *   have the conversation about a difference in wanting. MUST NOT CLAIM: that
 *   frequency increases, that desire returns, that your partner will want you
 *   more, or that any of this is achievable alone.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C9_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-c9-rule-this-out-first",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Before you work on this — rule out the physical causes",
    related: ["lit-c9-what-this-is-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We're putting this first because it's the most common thing people spend months not knowing.",
          "A great deal of what shows up as \u201cI've lost interest\u201d or \u201cthey don't want me anymore\u201d has a physical cause that has nothing to do with the relationship at all.",
        ],
      },
      {
        kind: "list",
        label: "Common, treatable, and frequently missed",
        items: [
          "Antidepressants. Reduced desire is one of the most common side effects, and a lot of people are never told. Often adjustable.",
          "Perimenopause and menopause. Changes in desire, arousal, and comfort are typical and there are options.",
          "The first year or two after a baby. Extremely common, and not only for the person who gave birth.",
          "Thyroid problems, diabetes, and other hormonal conditions.",
          "Chronic pain or illness \u2014 including pain during sex, which should always be looked at.",
          "Other medications: hormonal contraception, blood pressure medication, and others.",
          "Exhaustion. Not medical, but genuinely worth naming before anything else.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If any of these might apply — to either of you — it's worth seeing a GP or another healthcare professional, alongside looking at the relationship rather than instead of it. Changes in desire can be physical, medication-related, hormonal, emotional, relational, or a combination. Finding a physical contributor doesn't mean the relationship side is irrelevant — or the other way round — and neither has to be settled before the other is looked at.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "This isn't a way of saying it's probably medical and you can relax. Sometimes it is, sometimes it isn't, and often it's some of both. It's just the cheapest thing to check first.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-what-this-is-about",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is actually about",
    related: ["lit-c9-affection", "lit-c9-hard-to-talk-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It presents as a frequency problem. We don't have sex anymore. Our sex life feels routine. We're on different pages.",
          "Underneath, almost everyone says a version of the same thing: I don't feel desired. I don't feel attractive anymore. I feel rejected.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different problems that look identical",
        body: [
          "Not enough sex. A quantity, and quantities can be negotiated.",
          "Not feeling wanted. Not a quantity at all. More sex doesn't fix it, and people who get more sex and still don't feel wanted will tell you so.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The clearest sentence anyone says about this is: I miss affection more than sex.",
          "If that lands, this isn't a frequency problem, and working on frequency will be frustrating for both of you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is designed to increase how often you have sex. It's designed to help you work out what you actually miss and say it out loud — which is a different and more useful project.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-affection",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Affection isn't a smaller version of sex",
    related: ["lit-c9-what-this-is-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "In a lot of long relationships, touch narrows. It stops being something that happens and becomes something that means something is about to happen.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Once that's true, ordinary contact carries a question. A hand on the back isn't a hand on the back — it's an opening move, and it can be declined.",
          "So the person who doesn't want sex right now stops touching at all, to avoid seeming to start something. And the other person reads the absence of touch as the absence of wanting.",
          "Both are being reasonable. The result is two people who miss each other and have stopped making contact.",
        ],
      },
      {
        kind: "distinction",
        label: "Which is why untangling them helps",
        body: [
          "Affection that doesn't lead anywhere is its own thing, and for many people it's the thing they're actually short of.",
          "Saying so out loud — \u201cI'd like more of this, and it doesn't have to go anywhere\u201d — takes the question out of the touch. That's usually a relief on both sides.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-hard-to-talk-about",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why this is so hard to say out loud",
    related: ["lit-c9-what-this-is-about", "lit-c9-different-wanting"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to talk about sex.\u201d \u201cI don't know how to talk about what I want.\u201d \u201cWe avoid talking about it.\u201d",
          "Most couples who've been together a long time have never had a straightforward conversation about this. Not because they're avoidant — because there's no good moment and no good opening line.",
        ],
      },
      {
        kind: "list",
        label: "What makes it harder than other subjects",
        items: [
          "Raising it can sound like a complaint about them specifically, in an area where people feel most exposed.",
          "Raising it can sound like a request, which puts them on the spot immediately.",
          "Neither of you wants to be the one who says there's a problem.",
          "And once it's been unsaid for a while, saying it feels like a bigger deal than it is.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two things make it easier, reliably. Doing it with clothes on and nothing pending — not in bed, not after a knock-back. And saying what you miss rather than what's missing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There isn't a version of this conversation that isn't awkward. The aim is to get through it, not to do it gracefully.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-different-wanting",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When you want different amounts",
    related: ["lit-c9-hard-to-talk-about", "lit-c9-faq-too-much"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe have different sex drives.\u201d \u201cWe're on different pages sexually.\u201d",
          "This is extremely common — most long relationships have some version of it — and it's also the thing most likely to be handled badly, so it's worth being plain.",
        ],
      },
      {
        kind: "distinction",
        label: "The part that matters most",
        body: [
          "A difference in wanting isn't a problem one person can solve. It isn't fixed by initiating better, being more attractive, trying harder, or waiting it out.",
          "It's a thing two people work out between them, over time, usually more than once.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We're saying that clearly because most advice in this area points the other way — how to initiate better, how to set the mood, how to spark it again. All of that quietly assumes the answer is for the person who wants more to become more effective at getting it.",
          "That isn't a solution. Done for long enough, it becomes pressure, and pressure reliably reduces desire in the person on the other end of it.",
        ],
      },
      {
        kind: "list",
        label: "What does help",
        items: [
          "Talking about it once, calmly, when nothing is pending.",
          "Separating affection from sex, so touch isn't always a question.",
          "Both of you saying what you actually want, including if the answer is \u201cless, at the moment\u201d.",
          "Ruling out the physical causes, on both sides.",
          "For a lot of couples, someone else in the room \u2014 this is one of the things sex therapy is genuinely good at.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If your partner has said they don't want to, the answer is not a better approach. Wanting more than your partner does is painful and it is not something you can fix on your own, and nothing in this Playbook will pretend otherwise.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-emotional-first",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When the emotional has to come first",
    related: ["lit-c9-what-this-is-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't feel emotionally connected enough to be intimate.\u201d",
          "For a lot of people this is simply how it works, and it isn't a preference or a withholding. If the closeness isn't there, the body doesn't follow, and no amount of technique changes that.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth knowing which way round yours goes",
        body: [
          "Some people feel close and then want each other. For them, distance ends the physical side quite quickly.",
          "Others reconnect through touch — the physical is how they get back to feeling close, not the reward for it.",
          "Two people with different wiring here will each experience the other as withholding, and neither is.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "If you're the first kind and the distance is the real issue, this isn't the Playbook. The one about growing apart is closer to it, and the physical side tends to follow once the rest does.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-routine",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When it's gone routine",
    related: ["lit-c9-affection", "lit-c9-hard-to-talk-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cOur sex life feels routine.\u201d \u201cOur intimacy feels forced.\u201d",
          "Two different complaints, and it's worth knowing which one you have.",
        ],
      },
      {
        kind: "distinction",
        label: "Routine and forced are not the same",
        body: [
          "Routine is boredom. Predictable, fine, and nobody minds very much. It responds to variety and to actually saying what you'd like.",
          "Forced is something else. It means one or both of you is doing it out of obligation, and that doesn't respond to variety at all — it usually means something hasn't been said.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Forced is worth taking seriously rather than trying to improve. If you're going along with something you don't want, that's a conversation, not a technique problem — and it goes the same way if it's them.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c9-faq-too-much",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Am I asking for too much?",
    related: ["lit-c9-different-wanting"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's no correct amount, and comparing yourself to averages isn't useful — the range is enormous and most of the numbers people quote are unreliable.",
        ],
      },
      {
        kind: "distinction",
        label: "Two better questions",
        body: [
          "Have you actually said what you want, plainly, once? A surprising number of people haven't, and are hurt by a refusal that was never issued.",
          "Is what you're missing sex, or being wanted? Because you can be asking for the wrong one and getting nowhere.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Wanting more than your partner does isn't a character flaw and neither is wanting less. It's a difference, and it's the most common one there is.",
        ],
      },
    ],
  },

  {
    id: "lit-c9-faq-not-attracted",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if they're just not attracted to me anymore?",
    related: ["lit-c9-rule-this-out-first", "lit-c9-what-this-is-about"],
    body: [
      {
        kind: "paragraph",
        body: [
          "It's the fear underneath most of this, and it's worth saying that it's usually not the explanation — though we can't tell you it never is.",
        ],
      },
      {
        kind: "list",
        label: "Things that look identical from the outside",
        items: [
          "Exhaustion.",
          "Medication or a hormonal change.",
          "Having stopped initiating after being turned down, and not saying so.",
          "Feeling unattractive themselves.",
          "Distance that started somewhere else entirely.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "All of those produce the same silence, and the silence is what you're interpreting. Which is why asking is worth the discomfort — you're currently answering a question they haven't been given a chance to answer.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't feel attractive anymore\u201d is worth separating from \u201cthey don't find me attractive\u201d. Those often arrive together and only one of them is about them.",
        ],
      },
    ],
  },
];
