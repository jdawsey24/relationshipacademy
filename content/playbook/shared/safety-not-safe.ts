/**
 * SHARED SAFETY CONTENT — "I don't feel safe"
 *
 * Authored 29 Jul 2026 as shared content, replacing three separate authorings
 * in Clusters 7, 8 and 9 (and any that follow).
 *
 * ⚠ WHY THIS IS SHARED, NOT PER-CLUSTER.
 *   The statement "I don't feel emotionally safe" appears in multiple clusters.
 *   Written per cluster, it drifts — three near-identical paragraphs with
 *   slightly different thresholds and slightly different referral routes. That
 *   is the wrong thing to have three versions of. One authoring, reviewed once,
 *   used everywhere.
 *
 * ⚠ OWNER RULING (Cluster 7, Part B Instance 5, and carried forward):
 *   This ROUTES OUT. It is never a route to a Play. Every relationship tool
 *   asks the reader to raise difficult things and stay in the conversation,
 *   which is the wrong instruction for someone frightened of their partner and
 *   could make things worse.
 *
 * ⚠ ACCEPTED COST, owner-ruled: some people who argue badly but are perfectly
 *   safe will be routed to this and not need it. That is the correct direction
 *   to be wrong in.
 *
 * ⚠ CLINICAL REVIEW REQUIRED before publish. The list below, the threshold it
 *   implies, and the referral routes are all clinical judgements. This is the
 *   single highest-priority review item across all clusters, because it is the
 *   one place the product could actively make a situation worse rather than
 *   simply fail to help.
 *
 * USAGE
 *   - Import `SAFETY_RECOGNITION_CARD` into any cluster whose statement bank
 *     contains a not-safe statement. Do not re-author it.
 *   - Import `SAFETY_GUIDE` into that cluster's literature array, FIRST.
 *   - Name it in the Playbook's opening screen, before anything else.
 *   - The card's role is "signpost". It must never be converted to "route".
 *
 * CURRENT CONSUMERS
 *   Cluster 7  — STM-0478, STM-0701
 *   Cluster 8  — STM-0677
 *   Cluster 9  — (no explicit statement; card omitted, guide available)
 */

import type { LiteratureEntry, RecognitionCard } from "@/lib/playbook/contentSchema";

/**
 * SHARED CRISIS ESCALATION — the one place suicide / self-harm / "can't stay
 * safe" escalation is worded, so it reads identically everywhere and is changed
 * once. Append to any supportSignpost/literature whose copy reaches a suicide or
 * immediate-safety threshold.
 *
 * ⚠ COUNTRY-AWARENESS: this static copy names 988 as a UNITED STATES resource and
 *   points non-US readers to their own country's crisis service. Rendering the
 *   actual local service dynamically (by locale) is a separate product/engineering
 *   task — see the owner-approval note in the change log. Do NOT present 988 as a
 *   worldwide number. "Crisis service" (support) is distinguished from "emergency
 *   services" (immediate danger) on purpose.
 */
export const CRISIS_ESCALATION =
  "If you're thinking about suicide, harming yourself, or you don't feel able to stay safe, please seek immediate support now. Contact your local crisis service or emergency services, or go to the nearest emergency department. In the United States, you can call or text 988. If you're elsewhere, use the crisis service for your country. If you can, tell someone you trust and stay with them while you connect with support.";

export const SAFETY_RECOGNITION_CARD: RecognitionCard = {
  id: "rec-shared-not-safe",
  role: "signpost",
  pathwayPlayId: null,
  headline: "I don't feel safe enough to be honest with them.",
  validationCopy:
    "Please read 'If you don't feel safe' before anything else here. Every tool in this Playbook asks you to raise hard things and stay in the conversation, and that's the wrong advice if you're frightened of how they'll react. You don't have to be sure it's serious to talk to someone about it.",
  secondaryExamples: [
    "I don't feel emotionally safe during conflict.",
    "I change what I say depending on their mood.",
    "I'm careful about how I bring things up because of how they react.",
  ],
};

export const SAFETY_GUIDE: LiteratureEntry = {
  id: "lit-shared-if-you-dont-feel-safe",
  version: 1,
  scope: "cluster",
  depth: "core",
  title: "If you don't feel safe",
  body: [
    {
      kind: "paragraph",
      body: [
        "We're putting this first because it matters more than anything else here.",
        "People in difficult relationships often say some version of: I don't feel emotionally safe. I don't feel safe enough to be honest. I'm careful about how I say things.",
      ],
    },
    {
      kind: "paragraph",
      body: [
        "Sometimes that means two people who handle conflict badly and both feel bruised afterwards. Sometimes it means something else.",
      ],
    },
    {
      kind: "list",
      label: "None of the following is a communication problem",
      items: [
        "Being frightened of how they'll react.",
        "Changing what you say to manage their temper or their mood.",
        "Being made to feel small, stupid, or unstable on purpose.",
        "Being blamed for things that were done to you.",
        "Having your access to money, people, or leaving controlled.",
        "Being pressured, coerced, or forced into sexual contact.",
        "Being threatened with harm — to you, to someone you love, or to a pet.",
        "Physical aggression: being hit or pushed, restrained, blocked from leaving, choked or strangled, or having property broken to frighten you.",
        "Any other unwanted physical aggression.",
      ],
    },
    {
      kind: "guardrail",
      body: [
        "Every tool in this Playbook asks you to raise difficult things and stay in the conversation. If any of the above is happening, that instruction can be the wrong one, and following it could make things worse. This isn't something to solve together through better communication.",
      ],
    },
    {
      kind: "paragraph",
      heading: "If you're in immediate danger",
      body: [
        "Contact your local emergency services or get to a place you feel safe. In the United States, that's 911; elsewhere, use your country's emergency number.",
      ],
    },
    {
      kind: "paragraph",
      heading: "Where to find the right support",
      body: [
        "A domestic-abuse service, or a professional trained specifically in relationship abuse, can help you understand what's happening and think it through — privately, at your own pace. A general couples counsellor isn't the right place for this, and joint counselling can be unsafe when one person is frightened of the other. You don't have to be certain, or have a word for it, before reaching out.",
        "They can also help you make a safety plan that fits your circumstances — what you'd do, where you'd go, who you'd tell — whether or not you're thinking about any change right now.",
      ],
    },
    {
      kind: "guardrail",
      body: [
        "One practical note: phone and internet activity can sometimes be seen by someone else. If that's a worry, you might reach out from a device they don't have access to, or from a public computer.",
      ],
    },
    {
      kind: "paragraph",
      body: [
        "If none of that fits, and it's genuinely two people who find this hard — the rest of this is for you.",
      ],
    },
  ],
};
