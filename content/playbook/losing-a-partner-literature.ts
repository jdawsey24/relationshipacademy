/**
 * ADD-ON — "Losing a Partner"
 * Derived from Cluster 20: Grief & Loss (10) + Widowhood (10) = 20 statements.
 * Field Guide literature. 5 Core Guides + 2 Question Reads. (Add-on scale.)
 *
 * Track: Recovery. Task = Healing. Core Need: TO HEAL.
 *
 * ⚠ ADD-ON, NOT A PLAYBOOK. Owner-ruled 30 Jul 2026. Three tools rather than
 *   four to six; seven literature entries rather than nine to thirteen.
 *   Structurally identical to `PlaybookContent` — the distinction is how it is
 *   reached and labelled, not what it is. `playbookKey` uses the `addon-`
 *   prefix per the naming convention.
 *
 * ⚠⚠ DISCOVERABILITY IS THE RISK. A bereaved reader taking the assessment is
 *   likely to land in `letting-go` (Cluster 12) or `finding-yourself-again`
 *   (Cluster 20). Both would land badly — Cluster 12's tools assume someone
 *   chose to leave. `finding-yourself-again` already routes out via
 *   `rec-c20-bereaved`. **`letting-go` NEEDS THE SAME ROUTE ADDING.**
 *
 * ⚠ NEVER SUGGEST MOVING ON. The organising idea of this material is that
 *   moving forward feels like betrayal. Content that encourages moving on
 *   confirms the fear. Nothing here may imply the deceased is an obstacle, that
 *   the ring should come off, that grief should reduce, or that companionship
 *   requires letting go of anything.
 *
 * ⚠ NO TIMELINE, IN EITHER DIRECTION. Not "it takes about a year" and not "take
 *   all the time you need" — the second is also a claim, and it can read as
 *   permission to stop, which some readers do not want.
 *
 * ⚠ "NO ONE UNDERSTANDS THIS KIND OF GRIEF" appears twice. It is validated, not
 *   argued with. It is substantially accurate: the social scripts available are
 *   built for divorce, and they fit badly.
 *
 * ⚠ COMPETENCY MAPPING (Recovery set)
 *   moving-forward → Grief Integration · Self-Compassion
 *   still-we       → Identity Reconstruction · Narrative Integration
 *   companionship  → Grief Integration · Uncertainty Navigation
 *
 * ⚠ CLAIM SCOPE. May claim: notice what the guilt assumes; work out what stays;
 *   separate wanting company from replacing someone. MUST NOT CLAIM: that grief
 *   lessens, that you should date, that they'd want you to, that moving forward
 *   is possible or necessary, or anything about what the dead would think.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const ADDON_BEREAVEMENT_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-bereave-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is for",
    related: ["lit-bereave-nobody-understands", "lit-bereave-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Almost everything written about relationships ending is about ones that ended by choice. Somebody left, or both of you did.",
          "That material fits you badly. There's no decision to look at. There's no one to be angry with in the usual way. And none of the questions about what went wrong fit.",
        ],
      },
      {
        kind: "distinction",
        label: "The thing that runs through most of this",
        body: [
          "Not: how do I get over it. Very few people here are asking that.",
          "But: how do I keep living without it meaning I've left them behind. That's the question underneath the guilt, the ring, the introductions, and wanting company.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will suggest you move on, and nothing will put a time limit on anything \u2014 in either direction. There's no schedule you're meant to keep, and no single right way to do this.",
        ],
      },
    ],
  },

  {
    id: "lit-bereave-nobody-understands",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "\u201cNo one understands this kind of grief\u201d",
    related: ["lit-bereave-what-this-is", "lit-bereave-changes"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Said twice in this material, which is unusual, and we're not going to argue with it.",
        ],
      },
      {
        kind: "distinction",
        label: "Why it can feel that way",
        body: [
          "Many of the lines people have ready are built for divorce. They offer them because it's what they've got \u2014 you'll be better off, you'll find someone, it takes about a year.",
          "None of those are aimed at what's happened to you. So people who really care can say things that land as if they don't understand \u2014 even when they're trying to. That doesn't mean no one can understand, or that you're alone in it. Some people who've been through something like it may come closer than you'd expect.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also a group who do understand, and it's usually other people who've had the same loss. That's not so much a suggestion as a note about where the recognition tends to come from.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know who understands this kind of loss\u201d is worth treating as a real question you could actually answer, not just a way of saying how alone it feels. There are usually more people than it seems, and they aren't the obvious ones.",
        ],
      },
    ],
  },

  {
    id: "lit-bereave-guilt",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The guilt about being all right",
    related: ["lit-bereave-what-this-is", "lit-bereave-companionship"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel guilty for laughing again.\u201d \u201cI don't know if I'm allowed to be happy.\u201d \u201cI'm afraid moving forward means leaving them behind.\u201d",
          "These are common, and they're rarely said out loud. They sound irrational, and they don't feel irrational.",
        ],
      },
      {
        kind: "distinction",
        label: "What the guilt can be doing",
        body: [
          "For some people, grief becomes one of the few kinds of contact they have left \u2014 while it's sharp, the person is still there in the day.",
          "So anything that eases it can feel like a second loss \u2014 not a relief but one more step away from them. That can be why feeling all right for an afternoon sometimes brings something that feels like betrayal.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is why the usual comfort lands badly. \u201cThey'd want you to be happy\u201d misses the point. The hard part isn't whether you're allowed to be happy. It's that feeling better feels like moving away.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We don't know what they'd have wanted, and neither does anyone else. Nothing here will tell you what the dead would think \u2014 that's not a claim anyone has the right to make for you.",
        ],
      },
    ],
  },

  {
    id: "lit-bereave-still-we",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Still \u201cwe\u201d",
    related: ["lit-bereave-changes", "lit-bereave-companionship"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI still think of us as we.\u201d \u201cI still wear my ring.\u201d \u201cI don't know how to stop feeling married.\u201d \u201cI don't know how to introduce myself anymore.\u201d",
          "These are the small, constant ones \u2014 the ones that come several times a day, and that nobody warns you about.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different things being asked",
        body: [
          "What's true: whether you're still married, still a we, still someone's. Those aren't questions with clean answers, and they don't have to be settled.",
          "What to say: what comes out of your mouth at a party when someone asks. That's a practical problem, and it has practical answers.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one can be settled without settling the first. Having a sentence ready \u2014 whichever sentence \u2014 takes away a small daily ambush, and it doesn't commit you to a position on anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here has a view about the ring. Some people wear one for the rest of their lives, some move it, some take it off early and put it back on. None of those is the right way to do it, and none of them is a stage.",
        ],
      },
    ],
  },

  {
    id: "lit-bereave-companionship",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Wanting company",
    related: ["lit-bereave-guilt", "lit-bereave-faq-ready"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI want companionship, but I don't know if my heart is ready.\u201d \u201cDating again feels like I'm betraying them.\u201d \u201cI don't want to replace them.\u201d",
          "That last sentence holds the whole problem, and it rests on an assumption worth a look.",
        ],
      },
      {
        kind: "distinction",
        label: "Replacing and adding are different",
        body: [
          "Replacing assumes there's a single slot \u2014 that a new person would take the place the last one had, and so push them out.",
          "Some people who do this find it doesn't work like that. The new relationship has its own place, and the old one isn't emptied out. Many people find they can hold both.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to love someone new while honouring my past\u201d is the right question, and one answer people land on is a plain one: by not hiding it. When the old relationship is out in the open rather than worked around, some people find both are easier to hold \u2014 though there's no single right way to do this.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this is an argument for dating. Wanting company and not wanting to date both make complete sense — and so does wanting neither.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-bereave-changes",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Why does it change so much day to day?",
    related: ["lit-bereave-nobody-understands", "lit-bereave-still-we"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cMy grief changes from day to day.\u201d It does, and not knowing what's coming is one of the more exhausting parts \u2014 partly because it makes planning anything hard.",
        ],
      },
      {
        kind: "distinction",
        label: "What people expect, and what happens",
        body: [
          "Expected: a slow, steady fade. Bad, then less bad, then manageable.",
          "Actual: much less tidy. A good two weeks, then a week worse than any in the first month, often set off by something small and unrelated.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What this means in practice: a bad day isn't proof you're going backwards, and a good two weeks isn't proof you're through it. Both readings are common, and both cause a lot of needless alarm.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cMy world changed overnight\u201d is worth naming on its own. Sudden loss and expected loss are different experiences. People who had no warning often find the shock and the grief can feel like they overlap, moving at different speeds.",
        ],
      },
    ],
  },

  {
    id: "lit-bereave-faq-ready",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I know if I'm ready?",
    related: ["lit-bereave-companionship", "lit-bereave-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "There's no set point where everyone becomes ready, and the people who tell you there is are guessing. Some are ready in months, some never want to be, and neither says anything about the marriage.",
        ],
      },
      {
        kind: "distinction",
        label: "Two questions that are more useful than readiness",
        body: [
          "Could I talk about them? Not hide the marriage, not work around it. If the answer is no, that's worth knowing before rather than after.",
          "Am I wanting company, or wanting the ache to stop? Both are fair. They lead to different decisions.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know if I'll ever stop missing them\u201d probably has the answer no — and that isn't the obstacle it looks like. Missing someone forever can go along with a lot, including another relationship.",
        ],
      },
    ],
  },
];
