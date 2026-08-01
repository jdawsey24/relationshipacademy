/**
 * Cluster 8 — "Feeling Like We're Growing Apart"
 * The Relationship Playbook™ · Finding Your Way Back to Each Other
 * Field Guide literature. 9 Core Guides + 3 Question Reads.
 *
 * Track: Expansion. Task = Integration. Core Need: TO FEEL UNDERSTOOD.
 *
 * ⚠ FRAME — owner-ruled 29 Jul 2026. This cluster moves someone OUT of a place
 *   of pain. It is not a screen. The flat / checked-out statements are the far
 *   end of the same road — unmet understanding, sustained long enough that the
 *   reader stopped reaching. Write for someone who wants their way back.
 *
 * ⚠ SAFETY — STM-0677 "I don't feel emotionally safe" ROUTES OUT (Cluster 7
 *   precedent). Feeling unsafe is not a connection problem.
 *
 * ⚠ LIGHT SIGNPOST on self-disconnection (STM-0686, 1009, 1011, 1014) — a
 *   mention, not a route-out. Owner-confirmed.
 *
 * ⚠ SCOPE — "your half". 14 Relational Condition statements; one reader.
 *
 * ⚠ CLAIM SCOPE. May claim: name what is missing precisely; say what you want
 *   rather than what is wrong; put one thing back that isn't logistics; notice
 *   whether you have stopped reaching. MUST NOT CLAIM: that the closeness
 *   returns, that they will meet you, that the relationship survives, or that
 *   trying harder is the answer.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";
import { SAFETY_GUIDE } from "./shared/safety-not-safe";

export const C8_LITERATURE: LiteratureEntry[] = [
  SAFETY_GUIDE, // shared — do not re-author per cluster
  {
    id: "lit-c8-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c8-eight-ways", "lit-c8-stopped-reaching"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Nothing went wrong. That's the strange part, and it's why it's so hard to explain to anyone.",
          "There was no betrayal, no crisis, no moment you could point at. You just look up one day and you're two people who handle things well together and don't know each other very much anymore.",
        ],
      },
      {
        kind: "distinction",
        label: "What people actually say",
        body: [
          "We feel like roommates. We function well but we don't feel close. We only talk about responsibilities.",
          "And underneath all of it, more or less: I don't feel understood.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's the thread running through everything here. Not being seen, not being heard, not being valued — those are all the same thing wearing different clothes.",
          "It matters because it tells you what would actually help. Not more time together. Not fixing the logistics. Being known by them again, in a way you currently aren't.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This won't tell you the closeness comes back. Sometimes it does and sometimes it doesn't. What it can do is help you name what's missing precisely enough to ask for it, which is more than most people in this position manage.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-eight-ways",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Eight ways of saying one thing",
    related: ["lit-c8-what-this-is", "lit-c8-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "When people describe this, they tend to produce a list rather than a sentence.",
        ],
      },
      {
        kind: "list",
        items: [
          "I don't feel seen.",
          "I don't feel heard.",
          "I don't feel valued.",
          "I don't feel respected.",
          "I don't feel desired.",
          "I don't feel appreciated.",
          "I don't feel important.",
          "I don't feel connected.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's not eight problems. It's one thing that no single word gets at, so you keep circling it, hoping one of them lands.",
          "Which is exactly what makes it hard to raise. \u201cI don't feel appreciated\u201d sounds like a complaint about the washing-up. What you mean is much larger and much harder to say.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The circling isn't you being vague. It's an accurate response to something that genuinely doesn't have a good word. But it's worth finding the closest one, because a person can respond to a specific thing and can't respond to a fog.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-logistics",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "How logistics take over",
    related: ["lit-c8-what-this-is", "lit-c8-one-thing-back"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe only talk about responsibilities.\u201d \u201cWe've become business partners instead of lovers.\u201d \u201cEverything revolves around the kids.\u201d",
          "Nobody decided this. It happens because logistics are urgent and connection isn't.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The bins have a deadline. The school run has a deadline. Asking each other a real question has no deadline at all, so it goes to the bottom of the list, every day, reasonably.",
          "Do that for two years and you've built a relationship that runs beautifully and contains almost nothing.",
        ],
      },
      {
        kind: "distinction",
        label: "Which is why \u201cspend more time together\u201d misses",
        body: [
          "You may already spend a great deal of time together. Most people in this position do.",
          "The missing thing isn't hours. It's the kind of exchange that isn't about arrangements — and that can happen in four minutes or not at all in a weekend away.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-missing-who-you-were",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Missing who you were together",
    related: ["lit-c8-logistics", "lit-c8-faq-normal"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI miss who we used to be.\u201d \u201cI miss laughing together.\u201d \u201cI miss feeling pursued.\u201d",
          "This is grief, and it's worth calling it that. You're not being nostalgic or unrealistic — something real existed and it isn't there now.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things worth separating",
        body: [
          "Missing the early version. That one isn't coming back and chasing it will make you miserable — it ran on novelty, and novelty has a shelf life.",
          "Missing being known and enjoyed by them. That one isn't about the early days at all. It's available at any stage, and it's what you're actually short of.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "People often think they want the first and actually want the second. Worth checking which, because they lead to completely different attempts.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-what-you-want",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What you want it to feel like",
    related: ["lit-c8-eight-ways", "lit-c8-one-thing-back"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Somewhere in all of this, people say what they actually want. It usually comes out sounding simple.",
        ],
      },
      {
        kind: "list",
        items: [
          "I want someone who understands me.",
          "I want to feel like a priority.",
          "I want peace.",
          "I want consistency.",
          "I want someone I can build with.",
          "I want a relationship that feels like home.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "These are the most useful sentences in this whole Playbook, and they get overlooked because they sound obvious.",
          "They're useful because they're the only place you say what you want rather than what's missing. And a person can do something with a want. Nobody can do anything with an absence.",
        ],
      },
      {
        kind: "distinction",
        label: "The same thing, two directions",
        body: [
          "\u201cI don't feel like a priority\u201d invites defence. It's a verdict, and there's a rebuttal available.",
          "\u201cI want to feel like a priority\u201d invites an answer. It's a request, and it can be met or refused, which is information either way.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a communication trick. It's that the second version tells them what to do, and the first only tells them they've failed.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-one-thing-back",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Putting one thing back",
    related: ["lit-c8-logistics", "lit-c8-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "The instinct is a big gesture. A weekend away, a proper conversation, a reset.",
          "Those mostly don't work, and the reason is worth knowing: a big gesture carries too much. If the weekend goes flat, it doesn't just go flat — it becomes evidence.",
        ],
      },
      {
        kind: "distinction",
        label: "Small things carry less and survive better",
        body: [
          "One question that isn't about arrangements. One thing you'd normally not bother mentioning. Ten minutes where nothing is being organised.",
          "If a small thing falls flat, it was a small thing. You can do another one on Thursday.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It also sidesteps the biggest obstacle here, which is that neither of you wants to make a Thing of it. A Thing requires both people to show up ready. A small thing doesn't require anything of them at all.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Small doesn't mean it works. Some of them land and some don't, and a few in a row landing badly is real information about where you are.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-stopped-reaching",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When you've stopped reaching",
    related: ["lit-c8-what-this-is", "lit-c8-faq-too-late"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI go through the motions.\u201d \u201cI've stopped expecting things to get better.\u201d \u201cI feel like I've checked out.\u201d",
          "This is further along the same road, and it usually arrives quietly.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Nobody starts here. You get here by reaching and not being met, enough times that reaching starts to feel humiliating. So you stop — and stopping brings relief, which is why it holds.",
          "It's a sensible adaptation to a situation that kept costing you. It also, eventually, becomes the thing keeping the situation in place.",
        ],
      },
      {
        kind: "distinction",
        label: "The part worth knowing",
        body: [
          "Checked out isn't the same as not caring. People who've genuinely stopped caring don't feel flat about it — they feel free.",
          "Flat usually means still wanting it and having given up on getting it. Which is painful, and also means something is still there.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If some of this has spread past the relationship — if you're flat about most things, or you feel disconnected from yourself rather than from them — that's worth mentioning to a GP or a therapist. Not instead of this. Alongside it.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-your-half",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Your half of it",
    related: ["lit-c8-one-thing-back", "lit-c8-faq-alone"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Almost everything here is in the plural. We're growing apart. We stopped dating each other. We don't laugh like we used to.",
          "That's accurate — it takes two to drift. Which leaves an honest problem, because there's one of you reading this.",
        ],
      },
      {
        kind: "distinction",
        label: "What can and can't be done from here",
        body: [
          "Yours: naming what's missing precisely, saying what you want instead of what's wrong, putting small things back, noticing whether you've stopped reaching.",
          "Not yours: whether they meet you. Nothing here makes someone turn towards you who has decided not to.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's less than you wanted. It's also not nothing — drift is held in place by both people, and one person stopping their half of it does change what the drift has to work with.",
          "But it might not be enough. If it isn't, that isn't you having failed at this.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you do all of this for a while and nothing shifts, the next step probably isn't more of it on your own. It's the two of you with someone in the room.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-not-what-i-expected",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Nobody prepared us for this",
    related: ["lit-c8-faq-normal"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cMarriage isn't what I expected.\u201d \u201cLove isn't enough.\u201d \u201cNobody prepared us for this.\u201d",
          "All three are true, and we're not going to soften them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Almost nothing you were shown about long relationships covers the part where two competent people quietly stop knowing each other while running a household well. There's no story about that. It isn't in the films and people don't mention it at dinner.",
          "So when it happens, it feels like a personal failure rather than the extremely common thing it is.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Knowing it's common doesn't fix it and isn't meant to. It's meant to stop you spending energy on the additional question of whether something is wrong with you specifically.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c8-faq-normal",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is this just what long relationships are?",
    related: ["lit-c8-not-what-i-expected", "lit-c8-missing-who-you-were"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Partly. Some of what you're missing was novelty, and novelty doesn't survive knowing someone for fifteen years. That part is normal and isn't coming back.",
        ],
      },
      {
        kind: "distinction",
        label: "But not all of it",
        body: [
          "Excitement fading is ordinary. Being unknown by the person you live with isn't the same thing, and it isn't inevitable.",
          "Plenty of long relationships are unglamorous and still have two people who know each other. That's the thing that's missing, and it isn't a function of how long you've been together.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Be careful with \u201cthis is just how it is\u201d. It's true enough to be believable and it also ends the conversation.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-faq-alone",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "What if I'm the only one who's noticed?",
    related: ["lit-c8-your-half", "lit-c8-what-you-want"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Common, and worth checking before concluding it.",
          "People notice at different times and say so at different times. Someone can be perfectly aware something has gone and have no idea how to raise it — which looks identical, from the outside, to not caring.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The way to find out isn't to work it out from evidence. It's to say the thing and see. That's uncomfortable, and it's the only method available.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If you say it clearly and they genuinely don't see a problem, that's real information — hard, but better than continuing to guess.",
        ],
      },
    ],
  },

  {
    id: "lit-c8-faq-too-late",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Is it too late?",
    related: ["lit-c8-stopped-reaching", "lit-c8-your-half"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We can't tell you, and we'd be wary of anyone who could.",
        ],
      },
      {
        kind: "distinction",
        label: "One thing that's worth knowing",
        body: [
          "The fact that this bothers you means something is still running. Genuine indifference doesn't ache.",
          "That isn't a promise it can be recovered. It does mean you're not as far along as the flatness makes it feel.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What tends to matter more than how long it's been is whether either of you can still be reached. One person trying, met with anything at all, is a very different position from one person trying alone.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If the honest answer is that you're asking whether to stay rather than how to reconnect — that's a legitimate question and it's a different one. Worth having with someone rather than alone.",
        ],
      },
    ],
  },
];
