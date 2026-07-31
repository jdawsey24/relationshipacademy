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
          "Almost everything written about relationships ending is written about relationships that ended by choice. Somebody left, or both of you did.",
          "That material fits you badly. There's no decision to examine, nobody to be angry with in the usual way, and none of the questions about what went wrong apply.",
        ],
      },
      {
        kind: "distinction",
        label: "The thing that runs through most of this",
        body: [
          "Not: how do I get over it. Very few people here are asking that.",
          "But: how do I go on living without it meaning I've left them behind. That's the question underneath the guilt, the ring, the introductions, and the wanting company.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here will suggest you move on, and nothing will put a timeline on anything \u2014 in either direction. There's no schedule you're meant to be keeping, and no single way you're supposed to be doing this.",
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
          "Many of the available scripts are built for divorce. People offer them because they're what exists \u2014 you'll be better off, you'll find someone, it takes about a year.",
          "None of those are aimed at what's happened to you. So people who genuinely care can say things that land as though they haven't understood \u2014 even when they're trying to. That doesn't mean no one can understand, or that you're alone in it; some people who've been through something similar may come closer than you'd expect.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also a category that does understand, and it's usually other people who've had the same loss. That's not a suggestion so much as an observation about where the recognition tends to come from.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know who understands this kind of loss\u201d is worth taking as a practical question rather than a rhetorical one. There are usually more people than it seems, and they aren't the obvious ones.",
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
          "These are common and they're rarely said out loud, because they sound irrational and they don't feel irrational.",
        ],
      },
      {
        kind: "distinction",
        label: "What the guilt can be doing",
        body: [
          "For some people, grief becomes one of the few remaining forms of contact \u2014 while it's acute, they're still present in the day.",
          "So anything that reduces it can feel like a second loss \u2014 not a relief but a further separation. That can be why being all right for an afternoon sometimes produces something that feels like betrayal.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which makes the usual reassurance land badly. \u201cThey'd want you to be happy\u201d misses the point: the difficulty isn't whether it's permitted, it's that feeling better feels like moving away.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We don't know what they'd have wanted and neither does anyone else. Nothing here will tell you what the dead would think \u2014 that's a claim nobody is entitled to make on your behalf.",
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
          "These are the small, constant ones \u2014 the ones that arrive several times a day and that nobody warns you about.",
        ],
      },
      {
        kind: "distinction",
        label: "Two different things being asked",
        body: [
          "What's true: whether you are still married, still a we, still someone's. Those aren't questions with clean answers and they don't have to be resolved.",
          "What to say: what comes out of your mouth at a party when someone asks. That's a practical problem, and it has practical answers.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one can be settled without settling the first. Having a sentence ready \u2014 whichever sentence \u2014 removes a daily small ambush, and it doesn't commit you to a position about anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here has a view about the ring. Some people wear one for the rest of their lives, some move it, some take it off early and put it back on. None of those is the correct handling and none of them is a stage.",
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
          "That last sentence contains the whole difficulty, and it rests on an assumption worth looking at.",
        ],
      },
      {
        kind: "distinction",
        label: "Replacing and adding are different",
        body: [
          "Replacement assumes a single slot \u2014 that a new person would occupy the place the last one had, and therefore displace them.",
          "Some people who do this find it doesn't work like that. The new relationship occupies its own place, and the previous one isn't vacated. Many people find they can hold both.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to love someone new while honouring my past\u201d is the right question, and one answer people arrive at is unglamorous: by not hiding it. When the previous relationship is acknowledged rather than managed around, some people find both are easier to hold \u2014 though there's no single right way to do this.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this is an argument for dating. Wanting companionship and not wanting to date are both entirely coherent positions, and so is wanting neither.",
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
          "\u201cMy grief changes from day to day.\u201d It does, and the unpredictability is one of the more exhausting parts \u2014 partly because it makes planning anything difficult.",
        ],
      },
      {
        kind: "distinction",
        label: "What people expect, and what happens",
        body: [
          "Expected: a gradual decline. Bad, then less bad, then manageable.",
          "Actual: much less orderly. A good fortnight followed by a worse week than any of the first month, often set off by something small and unrelated.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The practical consequence: a bad day isn't evidence of going backwards, and a good fortnight isn't evidence of being through it. Both readings are common and both cause a lot of unnecessary alarm.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cMy world changed overnight\u201d is worth naming as its own thing. Sudden loss and expected loss are different experiences, and people who had no warning often find that the shock and the grief can feel like overlapping experiences, moving at different speeds.",
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
          "There is no universal readiness threshold, and the people who tell you there is are guessing. Some people are ready in months and some never want to be, and neither says anything about the marriage.",
        ],
      },
      {
        kind: "distinction",
        label: "Two questions that are more useful than readiness",
        body: [
          "Would I be able to talk about them? Not hide the marriage, not manage around it. If the answer is no, that's worth knowing before rather than after.",
          "Am I wanting company, or wanting the ache to stop? Both are legitimate. They lead to different decisions.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know if I'll ever stop missing them\u201d probably has the answer no, and that isn't the obstacle it looks like. Missing someone permanently is compatible with a good deal, including another relationship.",
        ],
      },
    ],
  },
];
