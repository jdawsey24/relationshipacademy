/**
 * Cluster 6 — "Feeling Like I Need Constant Reassurance"
 * The Relationship Playbook™ · Finding Security Without Constant Reassurance
 * Field Guide literature. 10 Core Guides + 3 Question Reads.
 *
 * Authored 29 Jul 2026. Derived against Framework Version 1.9.
 *
 * ⚠⚠ HARD PROHIBITION — NO ATTACHMENT CLASSIFICATION.
 *   This cluster describes a pattern the owner recognises as running hotter
 *   than typical reassurance-seeking. The content MUST NOT name it, label the
 *   reader, or imply they are a type. No "anxious attachment", no attachment
 *   style, no diagnosis. Describe what is observable: reassurance helps and
 *   wears off; the relief is short; a lot is being spent on watching.
 *   (Framework prohibition, carried from Cluster 1 safety boundaries.)
 *
 * ⚠ WELLBEING CONSTRAINT — the reader is already highly self-critical. Nine
 *   statements in this cluster are self-attack about having the need. Content
 *   must NEVER reinforce "you should not need this". The need is not the
 *   target. The reassurance ROUTE is the target.
 *
 * Owner ruling 29 Jul: the target is the reassurance route, not the need.
 *
 * ⚠ Safety: self-worth is contingent on being wanted in part of this cluster
 *   ("I need someone to want me to feel valuable"). All signpost copy requires
 *   clinical review before publish.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const C6_LITERATURE: LiteratureEntry[] = [
  // ───────────────────────────────────────────────── CORE GUIDES ──
  {
    id: "lit-c6-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this actually is",
    related: ["lit-c6-not-a-defect", "lit-c6-why-it-wears-off"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You want to know where you stand. Then you find out, and it's fine, and a few hours later you want to know again.",
          "That's the shape of it. Not that you're never reassured — that the reassurance doesn't stay.",
        ],
      },
      {
        kind: "distinction",
        label: "Which means the problem probably isn't supply",
        body: [
          "Most people in this position are not short of reassurance. They've asked, they've been told, and it landed for a while.",
          "The trouble is on the other side: what happens to it once it arrives, and how quickly the ground goes soft again.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So getting more of it isn't the fix, and neither is going without. What's worth looking at is why it drains, what you're spending to keep topping it up, and whether anything else settles you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "We're not going to tell you what kind of person you are, or why you're like this. There are a lot of confident labels available and we don't think handing you one would help. What we'll do is describe what's happening, which you can check against your own experience.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-not-a-defect",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Wanting to know where you stand isn't a defect",
    related: ["lit-c6-what-this-is", "lit-c6-faq-too-much"],
    body: [
      {
        kind: "paragraph",
        body: [
          "A lot of what people say about this cluster isn't about the relationship at all. It's about themselves.",
        ],
      },
      {
        kind: "list",
        label: "The sentences underneath",
        items: [
          "I hate needing reassurance.",
          "I wish I didn't need so much.",
          "I'm embarrassed by how much I care.",
          "I hate feeling emotionally dependent.",
          "I don't like who I become when I'm insecure.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Wanting to know where you stand with someone is one of the most ordinary things a person can want. Caring a lot isn't a flaw. Neither is being unsettled when someone goes quiet.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the shame is worth putting down, practically",
        body: [
          "Hidden needs get asked for sideways. If it's embarrassing to say \u201cI'd like to know where we are\u201d, you'll find another way to find out — checking, rereading, testing, hinting.",
          "Sideways asking produces worse answers. And a worse answer needs topping up sooner, which means asking again, which is more embarrassing. It compounds.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is going to work on making you need less. That isn't the target and we're not sure it's available. What is available is spending less on the shame, and finding out whether the route you're using is the one that actually settles you.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-why-it-wears-off",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why reassurance wears off",
    related: ["lit-c6-doesnt-land", "lit-c6-cost-of-watching"],
    body: [
      {
        kind: "paragraph",
        body: [
          "This is the central thing, so it's worth going slowly.",
          "When you ask and they answer, you get a real moment of relief. It's not fake and you're not imagining it. Then it fades, faster than seems reasonable, and you're back where you were.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things reassurance can be",
        body: [
          "Information: something you didn't know, now you do, and it holds until something changes.",
          "Relief: the discomfort drops for a while. Nothing was learned, so nothing holds.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Most reassurance-seeking gets the second one. \u201cAre we okay?\u201d \u2014 \u201cYes, of course\u201d is a lovely exchange and it contains almost no information. Which is why it evaporates.",
          "The reassurance that lasts longer tends to be the kind you can check against something. Not what they said, but what they did afterwards, over time.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't an instruction to stop asking. It's a suggestion that asking a question with an actual answer, and then watching, gets you something that doesn't drain by Thursday.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-doesnt-land",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When it arrives and doesn't land",
    related: ["lit-c6-why-it-wears-off", "lit-c6-exclusive-didnt-fix-it"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't believe compliments.\u201d \u201cI assume they're just being nice.\u201d \u201cI always question whether someone genuinely likes me.\u201d",
          "This is the part that confuses people most, because it looks like a contradiction: needing reassurance badly and being unable to take it in.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It isn't a contradiction. If you're braced for bad news, anything good has to get past the brace. And the brace is there for a reason — it's cheaper to discount a compliment than to accept it and be wrong.",
        ],
      },
      {
        kind: "list",
        label: "The usual ways something good gets deflected",
        items: [
          "Deciding they're being polite.",
          "Finding the caveat \u2014 the thing they didn't say.",
          "Noting that they'd say that to anyone.",
          "Accepting it, and then re-examining it later until it comes apart.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Noticing which one is yours is most of the work here. Not making yourself believe it \u2014 just seeing the moment where it gets taken apart, and leaving it alone for a bit longer than usual.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-rereading-isnt-reading",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Rereading isn't reading",
    related: ["lit-c6-cost-of-watching", "lit-c6-asking-well"],
    body: [
      {
        kind: "paragraph",
        body: [
          "You've read the message eleven times. Here's the thing about the eleventh time: it contains exactly the same information as the first.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Analysis feels like it's making progress. You're working on the problem, turning it over, considering angles. But there's no new data arriving, so nothing can actually be resolved — you're rearranging the same six words.",
          "What it does produce is more possible meanings, which is the opposite of what you were after.",
        ],
      },
      {
        kind: "distinction",
        label: "The only two things that produce new information",
        body: [
          "Asking. Which gets you an answer, and can be uncomfortable.",
          "Waiting and watching what they do. Which is slower, and also uncomfortable.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Rereading is comfortable by comparison, and that's the trap. It feels like doing something about it while keeping you exactly where you are.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-cost-of-watching",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What the watching costs",
    related: ["lit-c6-rereading-isnt-reading", "lit-c6-falling-fast"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Add it up sometime. The rereading, the checking when they were last online, looking at who they follow, replaying the conversation, working out what they meant.",
          "It's a lot of hours, and they're not free hours. They come out of the same supply as everything else you're doing.",
        ],
      },
      {
        kind: "distinction",
        label: "Which produces a second problem on top of the first",
        body: [
          "The monitoring is meant to make you feel safer. Mostly it doesn't \u2014 it generates more to analyse.",
          "And it leaves less of you for the rest of your life, which tends to make the relationship carry more weight, which raises the stakes, which makes the monitoring feel more necessary.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "We're not going to tell you to stop, because you've probably tried that and it doesn't take. What's more useful is knowing the price, and deciding what you'd rather spend some of it on.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-insecure-or-accurate",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Insecure, or accurate?",
    related: ["lit-c6-comparing", "lit-c6-faq-relax"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know if I'm being insecure or realistic.\u201d \u201cI don't know if I'm overreacting.\u201d",
          "Worth saying plainly: sometimes you're right. Anxiety doesn't make you wrong, and people do sometimes lose interest, and you may well be picking up on something.",
        ],
      },
      {
        kind: "list",
        label: "It's probably about them if",
        items: [
          "You can point at the specific thing. Something happened, or stopped happening.",
          "It changed. Whatever they're doing now is different from what they were doing.",
          "Someone else would notice it if you described it without commentary.",
        ],
      },
      {
        kind: "list",
        label: "It's probably the pattern if",
        items: [
          "It's the same feeling you had last month, and with the person before.",
          "It's strongest when nothing has happened at all \u2014 a slow afternoon, no messages, nothing wrong.",
          "It gets louder rather than quieter after they reassure you.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Neither list settles it, and \u201cit's the pattern\u201d never means \u201cignore it\u201d. It means the next move is different \u2014 you'd ask about them, and you'd do something about the feeling.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-comparing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Comparing yourself to people who aren't in the room",
    related: ["lit-c6-insecure-or-accurate", "lit-c6-cost-of-watching"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Their ex. The people they follow. Everyone at the party. Other people's relationships, as displayed.",
          "The comparison always comes out the same way, and there's a structural reason for that: you're comparing your inside to their outside, and there's no version of that where you win.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It's also mostly unfalsifiable. You can't find out whether you compare favourably to their ex, because there's no test and no result. So the question stays open, and open questions in this cluster don't stay quiet.",
        ],
      },
      {
        kind: "distinction",
        label: "One comparison that isn't like the others",
        body: [
          "\u201cThey like everyone else's pictures except mine\u201d isn't a comparison. It's an observation about something they're doing.",
          "That might be nothing, and it might be something. But it's checkable in a way that \u201cam I as good as their ex\u201d isn't \u2014 and checkable things are worth asking about.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI hate how dating has become so public\u201d is a fair reading of the environment, not a symptom. The comparison is easier to make than it used to be, and that isn't your imagination.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-exclusive-didnt-fix-it",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Why becoming official didn't fix it",
    related: ["lit-c6-why-it-wears-off", "lit-c6-doesnt-land"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cWe call each other exclusive, but I still don't feel secure.\u201d \u201cI'm more anxious now than I was before.\u201d",
          "This one is worth knowing about in advance, because it can be genuinely disorienting when it happens.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The reasonable expectation is that commitment settles the question. Sometimes it does the reverse: now there's more to lose, and the uncertainty that used to be about whether they liked you becomes uncertainty about whether it will last.",
          "The label changed. The not-knowing didn't.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "This isn't a sign the relationship is wrong, and it isn't a sign you are. It's the clearest evidence available that the thing bothering you was never going to be solved by getting the reassurance \u2014 which is useful information, even though it doesn't feel like it.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-falling-fast",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Falling fast, and being taken over by it",
    related: ["lit-c6-cost-of-watching"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI get attached too quickly.\u201d \u201cI become consumed by relationships.\u201d \u201cI don't know how to slow down.\u201d",
        ],
      },
      {
        kind: "distinction",
        label: "Two readings, and the second is more useful",
        body: [
          "One says something is wrong with how you attach. We can't verify that and we're not going to assert it.",
          "The other says something about arithmetic: a relationship at this intensity takes nearly everything you've got, so there isn't much left over. Not a flaw \u2014 a budget.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second reading suggests something you can actually do. Not feel less. Keep some of the rest of your life running while it happens, so the relationship isn't carrying all of the weight.",
          "That's not a trick to seem less keen. It's that when everything rests on one thing, every wobble in that thing is enormous.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READS ──
  {
    id: "lit-c6-faq-too-much",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Am I too much?",
    related: ["lit-c6-not-a-defect", "lit-c6-asking-well"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We can't answer that, and we'd be suspicious of anyone who says they can. Too much for whom, doing what.",
        ],
      },
      {
        kind: "distinction",
        label: "Two questions that do have answers",
        body: [
          "Is the way I'm asking getting me what I need? Often not \u2014 sideways asking produces thin answers that don't last.",
          "Is what this costs me sustainable? That one you can actually add up.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Both are about method rather than about you. Which is deliberate: \u201cam I too much\u201d has no available answer and asking it repeatedly is its own kind of expense.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "If \u201cam I too much\u201d is a question you're asking about yourself generally, rather than about one relationship \u2014 that's worth taking to someone who can stay with it properly.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-faq-relax",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Why can't I just relax?",
    related: ["lit-c6-why-it-wears-off", "lit-c6-cost-of-watching"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Because relaxing isn't a thing you can do on purpose, and being told to is close to useless.",
          "You already know it would be better not to be like this. Knowing hasn't helped, which is worth noticing rather than treating as further evidence against yourself.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What does sometimes shift is smaller and less dignified: asking a question that has a real answer instead of one that produces a nice noise. Watching what someone does over a week instead of what they said this morning. Getting some of your attention back from the monitoring.",
          "None of those are relaxing. They're just cheaper.",
        ],
      },
    ],
  },

  {
    id: "lit-c6-asking-well",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "Should I tell them how anxious I get?",
    related: ["lit-c6-not-a-defect", "lit-c6-why-it-wears-off"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Probably some of it, and probably not as a confession.",
        ],
      },
      {
        kind: "distinction",
        label: "Two ways of saying it",
        body: [
          "As an apology: \u201csorry, I'm a lot, I know I'm being annoying\u201d. This asks them to manage your feeling about the feeling, and usually produces the thin kind of reassurance.",
          "As information: \u201cI find not knowing where things stand hard, so I'd rather ask than guess\u201d. This is a fact about you and it doesn't require a response.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "The second one tends to go better, and it's easier to say twice \u2014 which matters, because you'll want to.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "You don't owe anyone a full account of how you work, especially early. \u201cI'd rather ask than guess\u201d is a complete sentence.",
        ],
      },
    ],
  },
];
