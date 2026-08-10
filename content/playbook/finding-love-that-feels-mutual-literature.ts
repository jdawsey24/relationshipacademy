// Rev 3 Step 3 — Understand layer for Cluster 1 "Moving Beyond Rejection".
//
// FOR REVIEW (content gate, revised). Additive, flag-gated, not wired into v0.
// Three depths (owner-required):
//   Core Guides   — substantive, multi-section education (scope "cluster", depth "core").
//   Question Reads — focused answers to lived-experience questions (scope "cluster", depth "question").
//   Just-in-Time  — brief contextual teaching (scope "jit"), surfaced at authored anchors
//                    FIRST; browseable only after they've surfaced (handled by the engine later).
//
// Content rules honored (content-gate revision):
//   * No etiology asserted as fact (no "because it feels safer / from fear / from old hurt").
//   * No motive attributed to another person — phenomenology is translated to OBSERVABLE
//     patterns (inconsistent contact, low effort, unclear progression, mismatch).
//   * Congruence, not "actions beat words": compare what's said with what's repeatedly done;
//     agreement AND mismatch are both information.
//   * Self-worth stays evidence-bounded: "another person's choice cannot establish your worth"
//     (not "you were already enough"); a bounded event can't support claims beyond its evidence
//     (not "'never' is automatically false").
//   * Consumer label only ("Moving Beyond Rejection" / "this pattern"), not the internal
//     "Difficulty Feeling Chosen".
//   * support_signpost_candidate is eligibility for a structured persistence gate — never a trigger.
//   * `none` is exclusive; the 101 map routes only to the two BUILT Plays and is conservative
//     about statement -> Play inference (expectancy statements do NOT auto-route; PE-6 preserved).
//
// Readability ~5th grade with an adult tone. `targets` reference real literature ids or a
// BUILT play id ("read-and-decide" | "what-it-actually-means") only.

import type { LiteratureEntry, StatementMapping, StatementFunction } from "@/lib/playbook/contentSchema";

const RD = "read-and-decide";
const WM = "what-it-actually-means";

// =============================================================================
// Literature entries
// =============================================================================

export const MBR_LITERATURE: LiteratureEntry[] = [
  // ---------- Core Guides (substantive, multi-section) ----------
  {
    id: "lit-what-is-dfc",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this pattern is really about",
    body: [
      { kind: "paragraph", body: [
        "Everyone wants to be wanted. That's human, and it's fine. This pattern isn't about wanting a partner.",
        "It's about what being chosen starts to mean. When being picked becomes the main way you measure yourself, one text or one date can decide your whole mood — and your next move.",
      ] },
      { kind: "distinction", label: "The wish vs. the weight", body: [
        "Wanting to be chosen is a wish. Letting the fear of not being chosen steer your choices is the weight.",
        "This field guide is about the weight, not the wish.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Auditioning to be liked instead of asking whether you like them",
        "Reading a small signal as a big verdict about you",
        "Giving more and more to earn a spot",
        "Hiding parts of yourself to stay likable",
        "Staying somewhere that isn't good for you just to not be alone",
      ] },
      { kind: "guardrail", body: [
        "The goal here isn't to make you easier to pick. It's to keep the fear of not being chosen from running your dating life.",
      ] },
    ],
    related: ["lit-being-chosen-weight", "lit-want-vs-worth", "lit-healthier"],
  },
  {
    id: "lit-being-chosen-weight",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When being chosen starts to carry too much",
    body: [
      { kind: "paragraph", body: [
        "Being picked feels good. That's normal. It gets heavy when it becomes the main way you measure your worth.",
        "Then dating stops being “do I like this person?” and turns into “do they like me enough?”",
      ] },
      { kind: "distinction", label: "Two different questions", body: [
        "“Do they want me?” is about them. “Do I want this?” is about you.",
        "When the first question takes over, the second one goes quiet — and that's the one that protects you.",
      ] },
      { kind: "example", body: [
        "You leave a date replaying every word for signs they liked you — and realize you never once asked whether you even liked them.",
      ] },
      { kind: "paragraph", heading: "Why it matters", body: [
        "When being chosen carries your worth, a normal “no” can feel like proof you're not enough. It isn't. It's one person's read on fit.",
      ] },
      { kind: "guardrail", body: [
        "You can still want a partner. The work is loosening the grip, not killing the wish.",
      ] },
    ],
    related: ["lit-want-vs-worth", "lit-over-investing"],
  },
  {
    id: "lit-want-vs-worth",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Wanting to be chosen vs. proving your worth",
    body: [
      { kind: "paragraph", body: [
        "There's a big difference between “I'd love for them to pick me” and “if they don't pick me, I'm not enough.”",
        "The first is a wish. The second turns their choice into a verdict about you.",
      ] },
      { kind: "distinction", label: "The key line", body: [
        "Another person's choice cannot establish your worth.",
        "It can tell you about fit and timing. That's the whole of what it can tell you.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Trying to earn love instead of share it",
        "Feeling you have to prove you're worth keeping",
        "Reading “not a match” as “not good enough”",
      ] },
      { kind: "guardrail", body: [
        "This isn't about forcing yourself to feel great on command. It's about not handing strangers a vote on your value.",
      ] },
    ],
    related: ["lit-rejection-not-verdict", "lit-faq-not-enough"],
  },
  {
    id: "lit-wanted-vs-compatible",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Being wanted vs. being a good fit",
    body: [
      { kind: "paragraph", body: [
        "Someone can want you and still be a poor fit. Someone can be a great fit with no instant spark.",
        "“Do they want me?” and “are we good for each other?” are two different questions.",
      ] },
      { kind: "distinction", label: "Wanted vs. fit", body: [
        "Being wanted is about their pull toward you right now. Fit is about whether you're actually good for each other over time.",
        "Feeling chosen answers the first. It never answers the second.",
      ] },
      { kind: "example", body: [
        "They're eager and full of compliments, and it feels great — but real plans keep falling through, and you notice you feel more anxious than happy.",
      ] },
      { kind: "guardrail", body: [
        "When you only chase being wanted, you can miss whether the fit is even there — for you.",
      ] },
    ],
    related: ["lit-kinds-of-signal", "lit-faq-backup-option"],
  },
  {
    id: "lit-rejection-not-verdict",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "A “no” is information, not a verdict",
    body: [
      { kind: "paragraph", body: [
        "Rejection hurts. That's real, and it means you cared.",
        "But the mind can take one “no” and stretch it into a rule: “no one will ever want me.” That stretch is the part to catch.",
      ] },
      { kind: "distinction", label: "Event vs. claim", body: [
        "The event is real: this one person, this one time, said no.",
        "The claim — “something's wrong with me, forever” — reaches past what the event can show. Keep the event. Question the claim.",
      ] },
      { kind: "paragraph", heading: "What a “no” can and can't tell you", body: [
        "A “no” can tell you this wasn't a fit for them, now. It can't tell you about everyone, about the future, or about your worth.",
      ] },
      { kind: "guardrail", body: [
        "One person's “not a match” is one data point — not a report card.",
      ] },
    ],
    related: ["lit-play-wm", "lit-faq-not-enough"],
  },
  {
    id: "lit-uncertainty",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Not knowing: what it can and can't tell you",
    body: [
      { kind: "paragraph", body: [
        "Early dating is full of gaps. You get small, mixed signals and not much to go on.",
        "The mind doesn't like a gap, so it fills it — often with your biggest fear or your biggest hope. Then the guess starts to feel like a fact.",
      ] },
      { kind: "distinction", label: "What uncertainty can and can't say", body: [
        "Uncertainty can tell you “I don't have enough yet.” It can't tell you what someone really means.",
        "“I'm not sure” is a real, honest answer — not a problem to fix by guessing.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Reading a short reply as “they're done”",
        "Deciding what they meant before you have any proof",
        "Feeling certain, then noticing the “certainty” was mostly fear",
      ] },
      { kind: "guardrail", body: [
        "The move isn't to figure them out. It's to notice what you actually know, and decide what you'd need to see next.",
      ] },
    ],
    related: ["lit-play-rd", "lit-see-vs-act", "lit-kinds-of-signal"],
  },
  {
    id: "lit-kinds-of-signal",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Five kinds of signal people mix up",
    body: [
      { kind: "paragraph", body: [
        "It's easy to lump everything into “do they like me?” But these are separate kinds of information, and they don't always travel together.",
      ] },
      { kind: "list", label: "Five different things", items: [
        "Chemistry — a feeling, often fast",
        "Attention — how much they focus on you right now",
        "Interest — whether they want more, over time",
        "Fit — whether you're actually good for each other",
        "Effort — what they actually do, not just say",
      ] },
      { kind: "distinction", label: "Words and actions, together", body: [
        "The strongest read isn't “actions beat words.” It's whether what someone says and what they repeatedly do line up.",
        "Agreement is information. A steady mismatch is information too.",
      ] },
      { kind: "example", body: [
        "They say “I really like you” often, but plans keep slipping. The words and the pattern don't match — and that mismatch is worth watching, not explaining away.",
      ] },
      { kind: "guardrail", body: [
        "One warm text isn't proof of interest. A pattern over time tells you more than any single moment.",
      ] },
    ],
    related: ["lit-play-rd", "lit-wanted-vs-compatible"],
  },
  {
    id: "lit-see-vs-act",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Seeing what's true vs. acting on it",
    body: [
      { kind: "paragraph", body: [
        "Sometimes you can already read the situation clearly — and still not act on it.",
        "You notice the effort isn't matched. You notice you're the only one planning. But you stay.",
      ] },
      { kind: "distinction", label: "Two different skills", body: [
        "Reading the evidence is one skill. Acting on what you already know is a second one.",
        "They're not the same, and people are often better at the first than the second.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Explaining away a pattern you'd flag if a friend described it",
        "Waiting for certainty you already have",
        "Hoping the situation changes instead of deciding",
      ] },
      { kind: "guardrail", body: [
        "You don't always need more information. Sometimes you need to act on the information you already have.",
      ] },
    ],
    related: ["lit-play-rd", "lit-over-investing"],
  },
  {
    id: "lit-over-investing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "When you keep giving more than you get",
    body: [
      { kind: "paragraph", body: [
        "Giving a lot isn't a flaw. Giving a lot, again and again, to someone who keeps giving little — that's worth a look.",
      ] },
      { kind: "distinction", label: "Effort vs. match", body: [
        "The question isn't “am I giving enough?” It's “is my effort being met?”",
        "One-sided effort over time is a pattern, not a one-off.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Always being the one who plans, texts first, and smooths things over",
        "Adding more effort each time it isn't returned",
        "Telling yourself “they're just busy” every single time",
      ] },
      { kind: "guardrail", body: [
        "Noticing a one-sided pattern isn't scorekeeping. You're allowed to want your effort matched — and to decide what to do when it isn't.",
      ] },
    ],
    related: ["lit-see-vs-act", "lit-faq-care-more"],
  },
  {
    id: "lit-self-editing",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Editing yourself to stay likable",
    body: [
      { kind: "paragraph", body: [
        "When being chosen feels like everything, it can be tempting to hide the parts of you that might cost you the connection.",
        "You go along. You don't say the real thing. You become easy to like — and a little hard to actually know.",
      ] },
      { kind: "distinction", label: "Liked vs. known", body: [
        "Being liked for an edited version isn't the same as being chosen for you.",
        "If they pick the edited you, you never find out whether they'd have picked the real one.",
      ] },
      { kind: "list", label: "What this can look like", items: [
        "Agreeing when you don't agree",
        "Hiding a preference, an opinion, or a need",
        "Waiting to see what they want before you know what you want",
      ] },
      { kind: "guardrail", body: [
        "This isn't “overshare on date one.” It's noticing where you erase yourself to stay safe — and letting a little more of the real you show.",
      ] },
    ],
    related: ["lit-wanted-vs-compatible", "lit-healthier"],
  },
  {
    id: "lit-fatigue",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Burnout and losing hope",
    body: [
      { kind: "paragraph", body: [
        "Dating can wear you down. Getting your hopes up and being let down, over and over, is tiring. That's not weakness, and it's not a character flaw.",
      ] },
      { kind: "list", label: "What burnout can look like", items: [
        "Dread before dates",
        "Going numb, or not wanting to open the apps",
        "Snapping at small letdowns",
        "Assuming it won't work before it starts",
      ] },
      { kind: "distinction", label: "Rest vs. quitting", body: [
        "“I need a break” and “I'm done for good” are different. You don't have to decide the big one today.",
      ] },
      { kind: "guardrail", body: [
        "Stepping back on purpose is different from quitting in defeat. A real rest can be the thing that protects what you want.",
      ] },
    ],
    related: ["lit-loneliness", "lit-faq-tired-of-dating"],
  },
  {
    id: "lit-loneliness",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Missing someone isn't a flaw",
    body: [
      { kind: "paragraph", body: [
        "Wanting a partner is not a problem to fix. Missing someone, hating the quiet house, dreading the holidays — that's human, and it's allowed.",
      ] },
      { kind: "distinction", label: "The wish vs. the push", body: [
        "The desire for company isn't the issue. It matters for this work only when it starts to push your choices — like staying somewhere that isn't good for you just to not be alone.",
      ] },
      { kind: "guardrail", body: [
        "You can honor the wish and still choose well. Wanting someone and settling for anyone are not the same thing.",
      ] },
    ],
    related: ["lit-what-is-dfc"],
  },
  {
    id: "lit-healthier",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What healthier looks like here",
    body: [
      { kind: "paragraph", body: [
        "Healthier isn't “never wanting to be chosen.” It's wanting it without being ruled by it.",
      ] },
      { kind: "list", label: "What it can look like", items: [
        "Reading real signals instead of stories",
        "Giving in a way that's met",
        "Showing the real you sooner",
        "Letting a “no” be one “no”",
        "Deciding, instead of waiting to be picked",
      ] },
      { kind: "distinction", label: "Comfort isn't the goal", body: [
        "You'll still feel the sting sometimes. Feeling it and choosing well anyway is the win.",
        "The goal isn't to stop caring — it's to stop the fear from steering.",
      ] },
      { kind: "guardrail", body: [
        "Progress here is less interference and steadier choices — not a perfect mood, and not a guaranteed outcome.",
      ] },
    ],
    related: ["lit-play-rd", "lit-play-wm"],
  },

  // ---------- Question Reads (focused answers) ----------
  {
    id: "lit-faq-why-nobody-chooses",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“Why does nobody choose me?”",
    body: [
      { kind: "paragraph", body: [
        "When it keeps not working out, this can feel like a settled fact. It isn't — it's a conclusion the hurt is reaching for.",
      ] },
      { kind: "distinction", label: "What your experiences can and can't show", body: [
        "Some things haven't worked out. That's real. But a set of experiences can't support a claim about everyone, or about what will always happen.",
        "The experiences are true. The size of the conclusion is what to check.",
      ] },
      { kind: "paragraph", body: [
        "A more honest version is: “Some things haven't worked out, and I don't fully know why yet.” That's a place you can actually work from.",
      ] },
      { kind: "guardrail", body: [
        "This isn't “think positive.” It's keeping the claim the size the evidence supports.",
      ] },
    ],
    related: ["lit-rejection-not-verdict", "lit-play-wm"],
  },
  {
    id: "lit-faq-not-enough",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“What if I'm just not enough?”",
    body: [
      { kind: "paragraph", body: [
        "This one feels true because it hurts. But hurt isn't proof.",
      ] },
      { kind: "distinction", label: "The precise version", body: [
        "Another person's choice cannot establish your worth. “Not enough” treats your value like a score other people set. It isn't one.",
      ] },
      { kind: "paragraph", body: [
        "A person choosing or not choosing you is about fit and timing. The work isn't to feel great about yourself on command — it's to stop letting a stranger's choice decide your value.",
      ] },
      { kind: "guardrail", body: [
        "You don't have to win an argument about your worth. You have to stop putting it up for a vote.",
      ] },
    ],
    related: ["lit-want-vs-worth", "lit-play-wm"],
  },
  {
    id: "lit-faq-backup-option",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“Why do I always feel like the backup option?”",
    body: [
      { kind: "paragraph", body: [
        "Feeling like a backup is painful, and sometimes the pattern is real — the effort really isn't coming your way.",
      ] },
      { kind: "distinction", label: "Pattern vs. verdict", body: [
        "Two things get tangled here. One is what's actually happening: inconsistent contact, low effort, plans that never firm up.",
        "The other is the verdict — “I'm second-best.” Keep the pattern. Drop the verdict.",
      ] },
      { kind: "paragraph", body: [
        "You don't have to know why they act this way. Look at the pattern instead. Is the contact steady? Do plans hold? Decide from that.",
      ] },
      { kind: "guardrail", body: [
        "Deciding from a pattern isn't scorekeeping, and it doesn't require reading anyone's mind.",
      ] },
    ],
    related: ["lit-wanted-vs-compatible", "lit-play-rd"],
  },
  {
    id: "lit-faq-are-they-interested",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“How do I know if they're actually interested?”",
    body: [
      { kind: "paragraph", body: [
        "You often can't know for sure early on — and trying to be sure can keep you stuck.",
      ] },
      { kind: "distinction", label: "Say and do, together", body: [
        "Don't just weigh words against actions. Watch whether what they say and what they repeatedly do line up over time.",
        "Agreement is a green flag. A steady mismatch is information too.",
      ] },
      { kind: "list", label: "What tends to tell you more", items: [
        "Plans that actually happen",
        "Follow-through between dates",
        "Consistency over weeks — not one great night",
      ] },
      { kind: "guardrail", body: [
        "Instead of “are they into me?”, try: “what have I actually seen, and what would tell me more?”",
      ] },
    ],
    related: ["lit-play-rd", "lit-kinds-of-signal"],
  },
  {
    id: "lit-faq-care-more",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“Why do I keep caring more?”",
    body: [
      { kind: "paragraph", body: [
        "Caring a lot isn't the problem. Always being the one who cares more — and giving to earn a spot — is worth noticing.",
      ] },
      { kind: "distinction", label: "Matched vs. one-sided", body: [
        "The question isn't how much you care. It's whether the care is matched over time. You're allowed to want it returned.",
      ] },
      { kind: "guardrail", body: [
        "Noticing the gap is a first step, not scorekeeping. You get to decide what to do when your effort keeps outrunning theirs.",
      ] },
    ],
    related: ["lit-over-investing"],
  },
  {
    id: "lit-faq-tired-of-dating",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "“What if I'm just tired of dating?”",
    body: [
      { kind: "paragraph", body: [
        "Then you're tired — and that's allowed. Being worn out doesn't mean something is wrong with you.",
      ] },
      { kind: "distinction", label: "Break vs. done", body: [
        "“I need a break” and “I'm done for good” are different. You don't have to decide the big one today.",
      ] },
      { kind: "guardrail", body: [
        "Rest is a real choice, not giving up. Stepping back on purpose is different from quitting in defeat.",
      ] },
    ],
    related: ["lit-fatigue", "lit-loneliness"],
  },

  // ---------- Play-scope: education directly supporting a built Play ----------
  {
    id: "lit-play-rd",
    version: 1,
    scope: "play",
    playId: RD,
    title: "Behind “Read It, Then Decide”",
    body: [
      { kind: "paragraph", body: [
        "Early dating is unclear. The signs are small and mixed. The mind fills the gaps — often with fear or hope — and the guess starts to feel like a fact.",
      ] },
      { kind: "list", label: "Two moves", items: [
        "Keep what happened apart from what you think it means",
        "Decide ahead of time what you'd need to see before you give more",
      ] },
      { kind: "distinction", label: "Say and do", body: [
        "This isn't “actions beat words.” It's checking whether words and repeated actions line up.",
        "Agreement and mismatch are both real information.",
      ] },
      { kind: "guardrail", body: [
        "This isn't about being suspicious or keeping score. It's giving yourself real facts to work with.",
      ] },
      { kind: "paragraph", heading: "A little deeper", body: [
        "When you're unsure, the mind fills the gap with what you expect. This move slows that step down. It won't make anyone like you more — it changes what you're reacting to.",
        "Said plainly: these ideas come from research on how people read facts and make plans. Using them for dating is our best thinking, not a tested result.",
      ] },
    ],
    related: ["lit-uncertainty", "lit-see-vs-act", "lit-kinds-of-signal"],
  },
  {
    id: "lit-play-wm",
    version: 1,
    scope: "play",
    playId: WM,
    title: "Behind “What It Actually Means”",
    body: [
      { kind: "paragraph", body: [
        "Getting turned down hurts. So does watching something fade. That's not a flaw — it means you cared.",
        "But one step happens fast: one event grows into a big claim (“I'm unlovable”). The claim feels true because it hurts. Hurt isn't proof.",
      ] },
      { kind: "distinction", label: "Event vs. claim", body: [
        "A bounded event can't support a claim beyond its evidence — about everyone, about forever, or about your worth.",
        "Keep what the event shows. Let go of the reach past it.",
      ] },
      { kind: "paragraph", body: [
        "This isn't happy thinking or pretending you don't care. It's one honest question: what does this really show — and what does it not?",
      ] },
      { kind: "guardrail", body: [
        "A real, repeating pattern is worth a look. “I'm unlovable” is still a claim a pattern can't establish.",
      ] },
      { kind: "paragraph", heading: "A little deeper", body: [
        "When something hurts, the mind tends to explain it in the biggest way. A small step back keeps the claim the size of the evidence.",
        "Said plainly: these ideas come from research on how people handle painful events. Using them for dating is our best thinking, not a tested result.",
      ] },
    ],
    related: ["lit-rejection-not-verdict", "lit-faq-not-enough"],
  },

  // ---------- Just-in-Time (surfaced at anchors first; not top-level browse) ----------
  {
    id: "lit-jit-globalizing",
    version: 1,
    scope: "jit",
    anchor: "wm.expansion",
    title: "When one thing becomes everything",
    body: [
      { kind: "paragraph", body: [
        "Notice the words “everyone,” “always,” “never,” “forever.” They're the sign a bounded event just turned into a claim about all of you.",
      ] },
      { kind: "guardrail", body: [
        "Bring it back to size: what happened, with this one person, this one time? That's what the event can support. Keep that.",
      ] },
    ],
    related: ["lit-play-wm"],
  },
  {
    id: "lit-jit-ambiguity-spiral",
    version: 1,
    scope: "jit",
    anchor: "rd.reveal",
    title: "When a small change becomes a big story",
    body: [
      { kind: "paragraph", body: [
        "A shorter text, a slower reply — small things can spin into “they're losing interest” before you have the facts.",
      ] },
      { kind: "guardrail", body: [
        "Pause on the actual evidence. What did you truly see? What are you guessing? What would really tell you?",
      ] },
    ],
    related: ["lit-play-rd"],
  },
  {
    id: "lit-jit-waiting-to-be-chosen",
    version: 1,
    scope: "jit",
    anchor: "rd.waiting",
    title: "When you're waiting to be picked",
    body: [
      { kind: "paragraph", body: [
        "Waiting for someone to choose you can quietly become the whole relationship. Meanwhile, the question “would I choose this?” goes quiet.",
      ] },
      { kind: "guardrail", body: [
        "You can look at what you've actually seen — how steady the contact is, whether plans hold — and decide your own next step.",
      ] },
    ],
    related: ["lit-play-rd", "lit-faq-backup-option"],
  },
  {
    id: "lit-jit-hope-vs-hurt",
    version: 1,
    scope: "jit",
    anchor: "wm.pattern",
    title: "Hope without bracing for the worst",
    body: [
      { kind: "paragraph", body: [
        "If things keep ending, it makes sense to brace for it. Bracing is understandable. It just isn't proof of what will happen next.",
      ] },
      { kind: "guardrail", body: [
        "A real pattern is worth watching. Keep it as “this has happened,” not “this always will.” What's happened is evidence; “always” reaches past it.",
      ] },
    ],
    related: ["lit-play-wm", "lit-uncertainty"],
  },
];

// =============================================================================
// 101-statement content map (§5.1)
// =============================================================================

const m = (
  statementId: string,
  text: string,
  functions: StatementFunction[],
  targets?: string[],
): StatementMapping => ({ statementId, text, functions, ...(targets ? { targets } : {}) });

export const MBR_STATEMENT_MAP: StatementMapping[] = [
  // --- Core "why me / what's wrong with me / not enough" (self-verdict) ---
  m("STM-0001", "Why am I still single?", ["recognition", "cluster_literature", "context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0002", "Why doesn't anyone choose me?", ["recognition", "faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),
  m("STM-0003", "I feel invisible.", ["recognition", "context_normalization"], ["lit-loneliness"]),
  m("STM-0004", "I always get rejected.", ["recognition", "play_literature", "play_routing"], ["lit-play-wm", WM]),
  m("STM-0005", "I never get past the talking stage.", ["recognition", "faq_literature"], ["lit-faq-are-they-interested", "lit-play-rd"]),
  m("STM-0006", "I always get friend-zoned.", ["recognition", "cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0007", "I don't know what's wrong with me.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0008", "Everyone else finds love except me.", ["cluster_literature", "context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0009", "Dating makes me feel defeated.", ["recognition", "context_normalization"], ["lit-fatigue"]),
  m("STM-0010", "Maybe I'm just not attractive enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0011", "Maybe I'm too much.", ["cluster_literature", "context_normalization"], ["lit-self-editing"]),
  m("STM-0012", "Maybe I'm not enough.", ["recognition", "faq_literature", "play_literature", "play_routing"], ["lit-faq-not-enough", "lit-play-wm", WM]),
  m("STM-0013", "Nobody stays interested in me.", ["faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),
  m("STM-0014", "I always end up alone.", ["context_normalization", "cluster_literature"], ["lit-loneliness"]),
  m("STM-0015", "I feel behind everyone else.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0016", "I've never been in love.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0017", "I've never had a serious relationship.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0018", "I don't think I'll ever get married.", ["cluster_literature", "context_normalization"], ["lit-uncertainty"]),
  m("STM-0019", "I think I've missed my chance.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0020", "I feel like everyone else knows something I don't.", ["cluster_literature"], ["lit-what-is-dfc"]),

  // --- Self-worth / "the problem is me" / backup option ---
  m("STM-0140", "Maybe I'm too picky.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0141", "Maybe my standards are too high.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0142", "Maybe my standards are too low.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0143", "I think I'm the problem.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0144", "I don't know if I'm lovable.", ["faq_literature", "play_literature", "play_routing"], ["lit-faq-not-enough", "lit-play-wm", WM]),
  m("STM-0145", "I don't think I'm relationship material.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0146", "I always feel like the backup option.", ["recognition", "faq_literature"], ["lit-faq-backup-option", "lit-play-rd"]),
  m("STM-0147", "I never feel like the first choice.", ["faq_literature"], ["lit-faq-backup-option"]),
  m("STM-0148", "I feel like everyone settles for me.", ["faq_literature", "context_normalization"], ["lit-faq-backup-option"]),
  m("STM-0149", "I don't think people see my value.", ["cluster_literature", "play_routing"], ["lit-want-vs-worth", WM]),
  m("STM-0150", "I wish someone would choose me the way I choose them.", ["recognition", "context_normalization"], ["lit-want-vs-worth"]),
  m("STM-0151", "I don't think I'll ever be enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0152", "I'm tired of proving my worth.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0153", "I feel like I have to earn love.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0154", "I don't know why I'm never enough.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0155", "Maybe love just isn't meant for me.", ["context_normalization", "cluster_literature"], ["lit-uncertainty"]),
  m("STM-0156", "I feel broken.", ["faq_literature", "context_normalization", "support_signpost_candidate"], ["lit-faq-not-enough"]),
  m("STM-0157", "I wish relationships came easier for me.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0158", "I envy people who seem to find love effortlessly.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0159", "I don't know what I'm doing wrong.", ["faq_literature", "play_routing"], ["lit-faq-why-nobody-chooses", WM]),

  // --- Dating fatigue / discouragement / fear (NORMALIZE — do not signpost by default) ---
  m("STM-0172", "I'm tired of trying.", ["recognition", "cluster_literature", "context_normalization"], ["lit-fatigue"]),
  m("STM-0173", "I'm exhausted by dating.", ["recognition", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0174", "Every relationship ends the same way.", ["jit_teaching", "context_normalization"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0175", "I'm losing hope.", ["context_normalization", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0176", "I don't get excited about dating anymore.", ["cluster_literature"], ["lit-fatigue"]),
  m("STM-0177", "I don't even want to download the apps again.", ["recognition", "cluster_literature", "context_normalization"], ["lit-faq-tired-of-dating"]),
  m("STM-0178", "I feel emotionally burned out.", ["cluster_literature", "context_normalization"], ["lit-fatigue"]),
  m("STM-0179", "I'm afraid to get my hopes up.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0180", "I expect disappointment now.", ["jit_teaching", "context_normalization"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0181", "I don't believe people mean what they say.", ["cluster_literature"], ["lit-kinds-of-signal"]),
  m("STM-0182", "Love feels harder than it should.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0183", "I'm tired of investing in people who leave.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0184", "I'm afraid I'll end up alone.", ["context_normalization", "cluster_literature"], ["lit-loneliness"]),

  // --- Over-investment / self-editing / attachment / "almost enough" ---
  m("STM-0252", "Maybe I'm too independent.", ["cluster_literature"], ["lit-wanted-vs-compatible"]),
  m("STM-0253", "Maybe I'm too needy.", ["cluster_literature"], ["lit-self-editing"]),
  m("STM-0254", "Maybe I love too hard.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0255", "Maybe I don't love enough.", ["cluster_literature"], ["lit-self-editing"]),
  m("STM-0256", "I always care more than they do.", ["recognition", "faq_literature"], ["lit-faq-care-more", "lit-over-investing"]),
  m("STM-0257", "I feel like I'm always the one left behind.", ["cluster_literature", "context_normalization"], ["lit-over-investing"]),
  m("STM-0258", "I don't know why I get attached so quickly.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0259", "I don't know why people lose interest in me.", ["faq_literature", "cluster_literature"], ["lit-faq-why-nobody-chooses", "lit-kinds-of-signal"]),
  m("STM-0260", "I feel like I have to be perfect to be loved.", ["cluster_literature"], ["lit-self-editing"]),
  m("STM-0261", "I don't know who I am outside of relationships.", ["cluster_literature", "support_signpost_candidate"], ["lit-self-editing"]),
  m("STM-0262", "I keep changing myself for other people.", ["recognition", "cluster_literature"], ["lit-self-editing"]),
  m("STM-0263", "I don't know if people like the real me.", ["recognition", "cluster_literature"], ["lit-self-editing"]),
  m("STM-0264", "I wish I could stop caring so much.", ["cluster_literature"], ["lit-over-investing"]),
  m("STM-0265", "I always feel replaceable.", ["faq_literature", "context_normalization"], ["lit-faq-backup-option"]),
  m("STM-0266", "I don't feel special to anyone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0267", "I'm tired of being “almost enough.”", ["recognition", "faq_literature"], ["lit-faq-backup-option", "lit-over-investing"]),
  m("STM-0268", "I wonder if something is wrong with me.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0269", "I feel like love comes easily for everyone but me.", ["context_normalization"], ["lit-what-is-dfc"]),
  m("STM-0270", "I don't know why I always feel unwanted.", ["faq_literature", "play_routing"], ["lit-faq-not-enough", WM]),
  m("STM-0271", "I feel invisible even when I'm with people.", ["context_normalization", "support_signpost_candidate"], ["lit-loneliness"]),

  // --- Ambiguity / reading evidence / unclear progression (RD core) ---
  m("STM-0436", "I don't know if we're just friends.", ["recognition", "faq_literature", "play_routing"], ["lit-faq-are-they-interested", RD]),
  m("STM-0437", "They say they're not ready for a relationship.", ["play_literature", "play_routing"], ["lit-play-rd", RD]),
  m("STM-0438", "They give me just enough attention to keep me around.", ["faq_literature", "simulation_cue", "play_routing"], ["lit-faq-backup-option", RD]),
  m("STM-0439", "I don't know if they're keeping me as an option.", ["faq_literature", "play_routing"], ["lit-faq-backup-option", RD]),
  m("STM-0440", "I feel like I'm waiting for them to choose me.", ["recognition", "jit_teaching", "simulation_cue", "play_routing"], ["lit-jit-waiting-to-be-chosen", RD]),
  m("STM-0441", "I don't know if I'm wasting my time.", ["faq_literature", "play_routing"], ["lit-faq-are-they-interested", RD]),
  m("STM-0442", "I keep hoping they'll change their mind.", ["cluster_literature"], ["lit-see-vs-act"]),
  m("STM-0443", "I don't know when to walk away.", ["recognition", "cluster_literature", "play_routing"], ["lit-see-vs-act", RD]),

  // --- Expectancy / recurrence: DO NOT auto-route to a Play (PE-6 preserved) ---
  m("STM-0522", "I thought they'd be different.", ["cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0523", "I keep getting my hopes up.", ["jit_teaching"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0524", "Every time I think it's going somewhere, it ends.", ["jit_teaching", "context_normalization"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0525", "I'm tired of being disappointed.", ["context_normalization", "cluster_literature"], ["lit-fatigue"]),
  m("STM-0526", "I don't know how to have hope without getting hurt.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0527", "I expect people to leave eventually.", ["jit_teaching", "context_normalization"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0528", "I don't believe good things last.", ["cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0529", "I don't trust when things are going well.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0530", "I wait for the other shoe to drop.", ["jit_teaching", "cluster_literature"], ["lit-jit-hope-vs-hurt"]),
  m("STM-0531", "I don't know how to enjoy a healthy relationship without worrying it'll end.", ["cluster_literature"], ["lit-jit-hope-vs-hurt", "lit-healthier"]),

  // --- Loneliness / missing companionship (NORMALIZE — never route to a Play) ---
  m("STM-0563", "I miss having someone.", ["recognition", "context_normalization"], ["lit-loneliness"]),
  m("STM-0564", "I miss having my person.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0565", "I don't like coming home to an empty house.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0566", "I hate sleeping alone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0567", "I miss being someone's favorite person.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0568", "Holidays are hard.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0569", "Weekends feel lonely.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0570", "I feel forgotten.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0571", "I don't want to do life alone.", ["context_normalization"], ["lit-loneliness"]),
  m("STM-0572", "I wish someone would ask me how my day was.", ["context_normalization"], ["lit-loneliness"]),
];
