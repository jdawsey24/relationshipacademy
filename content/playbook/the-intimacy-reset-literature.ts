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
          "A lot of what shows up as \u201cI've lost interest\u201d or \u201cthey don't want me anymore\u201d has a physical cause that has nothing to do with the relationship at all.",
        ],
      },
      {
        kind: "list",
        label: "Common, treatable, and frequently missed",
        items: [
          "Antidepressants. Lower desire is one of the most common side effects, and a lot of people are never told. Often it can be adjusted.",
          "Perimenopause and menopause. Changes in desire, arousal, and comfort are normal here, and there are options.",
          "The first year or two after a baby. Very common, and not only for the person who gave birth.",
          "Thyroid problems, diabetes, and other hormonal conditions.",
          "Long-term pain or illness \u2014 including pain during sex, which should always be checked.",
          "Other medicines: hormonal birth control, blood pressure medicine, and others.",
          "Being worn out. Not medical, but really worth naming before anything else.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If any of these might apply — to either of you — it's worth seeing a GP or another healthcare professional. Do that alongside looking at the relationship, not instead of it. Changes in desire can come from your body, a medication, hormones, feelings, the relationship, or a mix of these. Finding a physical cause doesn't mean the relationship side doesn't matter — or the other way round — and neither one has to be settled before you look at the other.",
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
          "It looks like a problem about how often. We don't have sex anymore. Our sex life feels routine. We're on different pages.",
          "Underneath, almost everyone says a version of the same thing: I don't feel desired. I don't feel attractive anymore. I feel rejected.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different problems that look the same",
        body: [
          "Not enough sex. That's an amount, and amounts can be worked out together.",
          "Not feeling wanted. That's not an amount at all. More sex doesn't fix it, and people who get more sex and still don't feel wanted will tell you so.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The clearest sentence anyone says about this is: I miss affection more than sex.",
          "If that rings true, this isn't a problem about how often, and working on how often will be frustrating for both of you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is built to make you have sex more often. It's built to help you work out what you actually miss and say it out loud — which is a different and more useful job.",
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
          "In a lot of long relationships, touch gets narrower. It stops being something that just happens and starts to mean something is about to happen.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Once that's true, ordinary touch carries a question. A hand on the back isn't just a hand on the back — it's a first move, and it can be turned down.",
          "So the person who doesn't want sex right now stops touching at all, so they don't seem to be starting something. And the other person reads no touch as no wanting.",
          "Both of them make sense. The result is two people who miss each other and have stopped touching.",
        ],
      },
      {
        kind: "distinction",
        label: "Which is why pulling them apart helps",
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
          "Most couples who've been together a long time have never had a plain, direct conversation about this. Not because they're avoiding it — because there's no good moment and no good way to start.",
        ],
      },
      {
        kind: "list",
        label: "What makes it harder than other subjects",
        items: [
          "Bringing it up can sound like a complaint about them in particular, in an area where people feel most exposed.",
          "Bringing it up can sound like a request, which puts them on the spot right away.",
          "Neither of you wants to be the one who says there's a problem.",
          "And once it's been unsaid for a while, saying it feels like a bigger deal than it is.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two things make it easier, every time. Doing it with clothes on and nothing about to happen — not in bed, not after being turned down. And saying what you miss rather than what's missing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "There isn't a version of this conversation that isn't awkward. The aim is to get through it, not to do it well.",
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
          "This is very common — most long relationships have some version of it — and it's also the thing most likely to be handled badly, so it's worth being plain.",
        ],
      },
      {
        kind: "distinction",
        label: "The part that matters most",
        body: [
          "A difference in wanting isn't a problem one person can solve. It isn't fixed by starting things better, being more attractive, trying harder, or waiting it out.",
          "It's a thing two people work out between them, over time, usually more than once.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We're saying it clearly because most advice in this area points the other way — how to start things better, how to set the mood, how to spark it again. All of that quietly assumes the answer is for the person who wants more to get better at getting it.",
          "That isn't a solution. Do it long enough and it becomes pressure — and pressure lowers desire in the person on the receiving end, again and again.",
        ],
      },
      {
        kind: "list",
        label: "What does help",
        items: [
          "Talking about it once, calmly, when nothing's about to happen.",
          "Separating affection from sex, so touch isn't always a question.",
          "Both of you saying what you actually want, including if the answer is \u201cless, at the moment\u201d.",
          "Ruling out the physical causes, on both sides.",
          "For a lot of couples, someone else in the room \u2014 this is one of the things sex therapy is really good at.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If your partner has said they don't want to, the answer is not a better approach. Wanting more than your partner does is painful, and it is not something you can fix on your own. Nothing in this Playbook will pretend otherwise.",
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
          "For a lot of people this is simply how it works. It isn't a choice or a way of holding back. If the closeness isn't there, the body doesn't follow, and no amount of technique changes that.",
        ],
      },
      {
        kind: "distinction",
        label: "Worth knowing which way round yours goes",
        body: [
          "Some people feel close and then want each other. For them, distance ends the physical side quite quickly.",
          "Others reconnect through touch — the physical is how they get back to feeling close, not the reward for it.",
          "Two people who are wired differently here will each see the other as holding back, and neither is.",
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
          "Routine is boredom. Predictable, fine, and nobody minds very much. It gets better with variety, and with actually saying what you'd like.",
          "Forced is something else. It means one or both of you is doing it because you feel you have to, and variety won't touch that — it usually means something hasn't been said.",
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
          "There's no correct amount, and comparing yourself to averages doesn't help — the range is huge, and most of the numbers people quote can't be trusted.",
        ],
      },
      {
        kind: "distinction",
        label: "Two better questions",
        body: [
          "Have you actually said what you want, plainly, once? A surprising number of people haven't, and are hurt by a no that was never actually said.",
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
          "It's the fear underneath most of this. It's worth saying that it's usually not the reason — though we can't tell you it never is.",
        ],
      },
      {
        kind: "list",
        label: "Things that look the same from the outside",
        items: [
          "Being worn out.",
          "A medicine or a hormonal change.",
          "Having stopped starting things after being turned down, and not saying so.",
          "Feeling unattractive themselves.",
          "Distance that started somewhere else entirely.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "All of those produce the same silence, and the silence is what you're reading into. That's why asking is worth the discomfort — right now you're answering a question they've never had the chance to answer.",
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
