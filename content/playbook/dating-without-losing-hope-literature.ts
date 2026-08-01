/**
 * Cluster 4 — "Feeling Like You Don't Belong in Today's Dating World"
 * Field Guide literature. 9 Core Guides + 4 Question Reads.
 *
 * Authored 29 Jul 2026 from the Cluster 4 content write-up.
 * Derived against Framework Version 1.9 (Manual Lag Rule applied).
 *
 * BINDING CONSTRAINTS ON THIS CONTENT
 *  - Never argue with an accurate observation. Target the quantifier only.
 *  - Exhaustion is a CAPACITY matter (Personal Capacity Regulation, RLC-FR-002),
 *    not a competency deficit. No copy may imply the reader lacks judgement.
 *  - No optimism claims: not that dating improves, not that they will feel
 *    better, not that they will meet someone.
 *  - Never characterise men or women as a group.
 *
 * OPEN ITEM 4 — CITATIONS ATTACHED 2026-07-31, verified against primary sources
 *   (see the CITATION comment on each figure). All seven figures confirmed
 *   accurate as authored.
 *   ⚠ TIME-SENSITIVE: the Match Group litigation STATUS and Tinder payer counts
 *     change — re-check both at each review before publish.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C4_LITERATURE: LiteratureEntry[] = [
  // ─────────────────────────────────────────────── CORE GUIDES ──
  {
    id: "lit-c4-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c4-not-imagining-it", "lit-c4-average-vs-person"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You're not here because you're bad at dating.",
          "You're here because you've been doing it for a while, and somewhere along the way you stopped expecting much. That's not a character flaw. It's what happens when you put effort somewhere repeatedly and it mostly doesn't come back.",
        ],
      },
      {
        kind: "distinction",
        label: "There are two halves to this, and we'll be straight about both",
        body: [
          "The first half is real. Dating now is harder than it was — not vaguely, measurably. The conversations really do die. You're not imagining it and you're not being dramatic.",
          "The second half is the part we can do something about. Somewhere in the middle of all that, a conclusion formed. Something like nobody's serious, or everyone's keeping options open. And once that conclusion is in place, it starts arriving before people do.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That second piece is what's worth looking at. Not because the conclusion came from nowhere — it came from experience — but because it's now doing your reading for you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't going to tell you to stay positive. It's going to help you see what's actually in front of you, and stop spending yourself on the parts that were never going to pay off.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-not-imagining-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "You're not imagining it",
    related: ["lit-c4-designed-this-way", "lit-c4-faq-is-it-me"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We want to be specific about this, because you've probably been told you're being negative.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   "Worn out": Forbes Health / OnePoll, dating-app fatigue survey, 2024
        //     (n=1,000 US adults who used a dating app in the past year; fieldwork
        //     27 Mar–1 Apr 2024) — 78% feel fatigued sometimes/often/always.
        //     https://www.forbes.com/health/dating/dating-app-fatigue/
        //   "Ghosted or ghosted someone (~three-quarters)": Forbes Health / OnePoll,
        //     2023 (n=5,000 US adults who actively dated in the past 5 years; fieldwork
        //     2–16 Aug 2023) — 76% either ghosted someone or had been ghosted. Matches
        //     the copy's "around three-quarters … in the last five years."
        //     https://www.forbes.com/health/mind/modern-dating-mental-health/
        kind: "list",
        label: "What the numbers actually say",
        items: [
          "Roughly four out of five people using dating apps say they're worn out by it, at least sometimes.",
          "Around three-quarters of people who've dated in the last five years have either been ghosted or ghosted someone.",
          "When people are asked what wore them out, the answers are the ones you'd give: couldn't find a real connection, got ghosted, the same conversation over and over.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So when you say this is exhausting, you're describing the average experience, not a personal failing.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're leading with this because everything else depends on it. If we started by suggesting the problem is your attitude, we'd be wrong, and you'd know we were wrong.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-average-vs-person",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The average isn't the person in front of you",
    related: ["lit-c4-what-serious-looks-like", "lit-c4-faq-is-it-me"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is the one that does the most work, so we'll take it slowly.",
          "You've built up a read on dating. Something like: most people aren't serious, or everyone's talking to five other people, or nobody actually wants to meet. That read is probably roughly right. As a description of the pool, it's defensible.",
        ],
      },
      {
        kind: "distinction",
        label: "Here's the problem",
        body: [
          "A read about a pool and a judgement about a person are two different things, and the first has quietly started standing in for the second.",
          "When you already know how someone will behave, you stop watching what they actually do. Not consciously — you just aren't looking, because you think you already have the answer.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's the cost. Not that you're too negative. That the general read is doing a job it isn't built for.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Tinder, "The Green Flags Study" / Opinium, 2024 (n=8,000 single, actively
        //     dating 18–34; UK/US/Canada/Australia; fieldwork 3–18 Jun 2024) — 68% of
        //     women and 53% of men said they want a romantic relationship.
        //     https://www.tinderpressroom.com/The-Green-Flags-Study
        //     Note: 4-country sample (not US-only); "single & actively dating."
        kind: "example",
        body: [
          "One thing worth knowing, since it cuts against the strongest version of the read: when people in their twenties and thirties are actually asked, most say they want a relationship — around two-thirds of women, around half of men.",
          "So nobody wants anything real isn't holding up as a universal, even though the version you've experienced — a lot of people not being serious — clearly is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "What we're not saying: that you should give everyone a chance, assume the best, or ignore what you've learned. Keep the read. Just don't let it answer questions it wasn't asked.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-why-people-vanish",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why people vanish",
    related: ["lit-c4-what-serious-looks-like"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You want to know why. Most people do. Here's the honest answer, in three parts.",
        ],
      },
      {
        kind: "list",
        items: [
          "It's usually about them. People who disappear rather than say something tend to be avoiding the conversation, not delivering a verdict on you. That's a fact about their conflict tolerance, not about your worth.",
          "It hurts more than it should, and that's not weakness. Being cut off without explanation lands harder than being told no — you never get the information that would let you close it out.",
          "You usually won't find out. Most of the time there's no explanation coming, and waiting for one keeps the thing open long after it's over.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "What you can do is stop treating silence as data about you. It's data about them, and mostly it isn't even much of that.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-what-serious-looks-like",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What serious actually looks like",
    related: ["lit-c4-average-vs-person", "lit-c4-why-people-vanish"],
    body: [
      {
        kind: "paragraph",
        body: [
          "If there's one practical thing to take from this, it's the difference between two kinds of signal.",
        ],
      },
      {
        kind: "list",
        label: "Signals that tend to mean something",
        items: [
          "They reply without you always going first.",
          "What they said they'd do and what they did match up.",
          "They move toward actually meeting, within a reasonable stretch of time.",
          "It holds up over more than one exchange.",
        ],
      },
      {
        kind: "list",
        label: "Signals that tend to mean less than they feel like",
        items: [
          "Warmth. Being nice is cheap and most people manage it.",
          "Intensity early on. Strong feeling before they know you isn't about you yet.",
          "Stated intentions with nothing behind them. \u201cI'm looking for something real\u201d is a sentence.",
          "Attractiveness, in either direction.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The useful shift is small: stop weighing what people say, start weighing what they do \u2014 and give it more than one data point before you decide.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This won't tell you how things end. Nothing does. It'll tell you whether someone is currently showing up, which is a different and much more answerable question.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-designed-this-way",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "It's designed this way",
    related: ["lit-c4-too-much-volume", "lit-c4-faq-worth-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've probably thought at some point that the apps aren't built for you to succeed. That's not paranoid.",
          "They work on the same principle as a slot machine. The reward is unpredictable \u2014 sometimes a match, usually nothing \u2014 and unpredictable rewards are the most habit-forming kind there is. Not because anyone is being cruel, but because it keeps people opening the app.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Putative class action v. Match Group, Inc., N.D. Cal., filed 14 Feb 2024 —
        //     alleges Tinder/Hinge/The League are designed to be "addictive"/gamified.
        //     Match Group calls the suit "ridiculous" with "zero merit."
        //     ALLEGATION ONLY; denied; unresolved as authored.
        //     https://sfstandard.com/2024/02/15/hinge-tinder-dating-app-addicts-lawsuit/
        //   ⚠ Litigation status changes — RE-CHECK the case status at each review.
        kind: "example",
        body: [
          "There's active litigation in the US alleging that some major platforms use these mechanics deliberately to keep people searching rather than finding. The companies deny it. We're not going to tell you how that resolves.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We're telling you it exists so that the exhaustion makes sense. Feeling like it's engineered to keep you going isn't a distorted read. It's a structural read, and it's a reasonable one.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "What follows is practical, not moral: if a system is built to keep you engaged, then how much you engage is a decision you have to make on purpose. It won't be made for you.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-too-much-volume",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why volume makes you harsher",
    related: ["lit-c4-designed-this-way", "lit-c4-stopping-is-allowed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is the one most people haven't heard, and it changes how the tiredness reads.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Pronk, T. M., & Denissen, J. J. A. (2020). A Rejection Mind-Set: Choice
        //     Overload in Online Dating. Social Psychological and Personality Science,
        //     11(3), 388–396. https://doi.org/10.1177/1948550619866189 — across a
        //     session, chance of acceptance fell ~27% from first to last option
        //     (copy's "roughly a quarter").
        kind: "example",
        body: [
          "When researchers watched people go through profiles in a single sitting, something consistent happened. People got more rejecting as they went. By the end of a session they were saying no far more often than at the start \u2014 roughly a quarter less likely to accept anyone.",
          "The people at the end weren't worse. The person judging them was depleted.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the pickiness that creeps in, the sense that nobody measures up, the way everyone starts to blur \u2014 that's not you becoming jaded as a personality change. That's what evaluating too many people in a row does to anyone.",
        ],
      },
      {
        kind: "distinction",
        label: "This flips the problem",
        body: [
          "You don't need to learn how to judge people better. You're good enough at it. You've been doing it eighty times a week with no break.",
          "That's a fuel problem, and fuel problems have different solutions than skill problems.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-how-people-meet-now",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "How people actually meet now",
    related: ["lit-c4-faq-worth-it"],
    body: [
      {
        kind: "paragraph",
        body: ["Straight answer, because it's a straight question."],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Rosenfeld, M. J., Thomas, R. J., & Hausen, S. (2019). Disintermediating
        //     your friends: How online dating in the United States displaces other
        //     ways of meeting. PNAS, 116(36), 17753–17758 (HCMST data).
        //     https://doi.org/10.1073/pnas.1908630116 — for US heterosexual couples,
        //     meeting online became the single most common way couples meet ~2013;
        //     ~39% by 2017.
        kind: "example",
        body: [
          "Meeting online overtook meeting through friends around 2013. Roughly four in ten couples now meet that way, and it's the single most common route.",
          "Which is an uncomfortable answer, because it's the route that's wearing you out.",
        ],
      },
      {
        kind: "list",
        label: "Two things follow",
        items: [
          "The tiredness isn't a sign you're doing it wrong. You're using the main channel, and the main channel is exhausting.",
          "It isn't the only channel. The offline ones have got quieter but haven't gone anywhere.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to tell you to join a running club. We're telling you that the answer to \u201chow does anyone meet anymore\u201d is: mostly this way, and it's genuinely hard, and some people still do it the old way.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-stopping-is-allowed",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Stopping is a decision, not a failure",
    related: ["lit-c4-too-much-volume", "lit-c4-faq-worth-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Somewhere in here you may have thought about quitting. Deleting the apps. Taking a few months. Being done for a while.",
          "We want to be clear: that's the skill working, not failing.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Weighing whether something is worth continuing is exactly the kind of judgement this whole Playbook is about. Applying it to the process itself isn't giving up \u2014 it's the same evaluation, pointed one level out.",
          "Plenty of people take a break and come back with a clearer sense of what they're after. Plenty take a break and stay stopped for a while, and that's a legitimate outcome too.",
        ],
      },
      {
        kind: "distinction",
        label: "The one thing worth knowing about yourself",
        body: [
          "\u201cI'm stopping because this isn't paying off right now\u201d is a decision.",
          "\u201cI'm stopping because nothing will ever work\u201d is a conclusion, and conclusions like that are worth a second look before you act on them.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If it's the second one \u2014 and especially if that feeling has spread beyond dating into how you see yourself generally \u2014 that's worth talking to someone about. Not because something's wrong with you. Because that's a heavier thing than a Playbook is built for.",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c4-faq-is-it-me",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is it me, or is it this?",
    related: ["lit-c4-not-imagining-it", "lit-c4-average-vs-person"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The question underneath most of the others. And the honest answer is: both, and not in equal measure.",
        ],
      },
      {
        kind: "distinction",
        label: "Both halves",
        body: [
          "It's genuinely this. The environment is harder than it was. The numbers back you up. Anyone telling you it's all down to your profile is selling something.",
          "And there are things that are yours. Not because you're doing it wrong, but because when you decide nothing works, you stop doing the things that occasionally do. You stop reading individuals. You stop pacing yourself. You keep going at a volume that makes you worse at it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Those are the parts we can work on, and they're worth working on precisely because the environment is hard. When conditions are rough, how you spend your effort matters more, not less.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "What we won't do is split it neatly for you. Anyone who tells you it's 70% you or 70% them is guessing.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-faq-different-for-others",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Why does it look so different for other people?",
    related: ["lit-c4-not-imagining-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Because it genuinely is different, depending on where you're standing.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Pew Research Center (2 Feb 2023), "From Looking for Love to Swiping the
        //     Field: Online Dating in the U.S." — among recent online daters, 54% of
        //     women vs ~25% of men felt overwhelmed by the number of messages; 64% of
        //     men vs ~40% of women felt insecure about too few. Describes divergent
        //     EXPERIENCES, consistent with the drowning/invisible split below.
        //     https://www.pewresearch.org/internet/2023/02/02/from-looking-for-love-to-swiping-the-field-online-dating-in-the-u-s/
        // ⚠ GENDER GUARDRAIL: describes EXPERIENCES, never groups. Do not
        //   rewrite into "men are" / "women are" framing under any edit.
        kind: "distinction",
        label: "Two different kinds of hard",
        body: [
          "Some people are drowning. Too much contact, most of it low-effort, a lot of it needing to be screened before it's even a conversation. The work is filtering, and it's tiring in a specific way.",
          "Other people are invisible. Very little coming back, sometimes nothing for long stretches. The work is being seen at all, and it's tiring in a completely different way.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both are real. Both are common. And they produce opposite-looking complaints \u2014 \u201ceveryone has too many options\u201d and \u201cI can't get anyone to notice me\u201d \u2014 from people who are both, accurately, describing what's happening to them.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you've ever read someone else's account of dating and thought that's not my experience at all, this is probably why. It doesn't mean either of you is wrong.",
        ],
      },
    ],
  },

  {
    id: "lit-c4-faq-worth-it",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Are the apps still worth it?",
    related: ["lit-c4-how-people-meet-now", "lit-c4-stopping-is-allowed"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We won't answer this for you, but we can give you what the answer depends on.",
        ],
      },
      {
        // CITATION [verified 2026-07-31]:
        //   Match Group Q4 2024 results — Tinder direct-revenue payers fell ~5% YoY to
        //     9.5M, declining for multiple consecutive quarters through 2024.
        //     https://s203.q4cdn.com/993464185/files/doc_financials/2024/q4/Q4-2024-Executive-Commentary_vF.pdf
        //   ⚠ Time-sensitive figure — refresh to the latest quarter at each review.
        kind: "distinction",
        label: "Both true at once",
        body: [
          "App use is falling. The biggest platforms have been losing paying users for a while. People are voting with their feet, so if it feels like the shine has come off, you're reading the room correctly.",
          "And it's still the most common way couples meet.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So it's a trade-off, not a right answer. The question worth asking isn't are apps good or bad \u2014 it's is what I'm putting in coming back in any form. If it isn't, that's information. If it is, even occasionally, that's information too.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "What we'd steer you away from is deciding in the middle of a bad week. That's the depleted version of you making a call the rested version might make differently.",
        ],
      },
    ],
  },
  {
    // STM-0290 "how to stand out" — bounded scope ratified by owner 2026-07-31.
    // A REFRAME, never optimisation advice: no profile/photo tips, no "be more X,"
    // no implication that being more noticeable = success or that dating improves.
    id: "lit-c4-faq-standing-out",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "How do I stand out?",
    related: ["lit-c4-what-serious-looks-like"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is a fair question, and an exhausting one — it can feel like everyone's being asked to perform just to be seen at all.",
        ],
      },
      {
        kind: "distinction",
        label: "What this isn't",
        body: [
          "This isn't a guide to better photos, sharper openers, or being more marketable. If that's the advice you were bracing for, you can let it go — it's what a lot of people in your position have already tried and found hollow, and we're not going to repeat it.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The more answerable question isn't “how do I get noticed by everyone,” which mostly isn't in anyone's control. It's this: when someone does show up, can you tell whether they're actually engaged — and are you spending your effort where it comes back? That part you can work on, and it's what “Who's Actually Here” is for.",
          "Standing out to the whole pool and being met by one person are different things. This Playbook is about the second.",
        ],
      },
    ],
  },
];
