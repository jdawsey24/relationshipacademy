// Scaffolded playbook clusters — Plays-only, registered for preview/validation but publish-held
// (absent from lib/playbook/keys.ts INTERACTIVE / commerce map). Add a row here when a cluster is
// promoted into content/playbook/. When one is genuinely published, move it out of this list.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlaybookContent } from "../lib/playbook/contentValidate";
import { DATING_WITHOUT_LOSING_HOPE } from "../content/playbook/dating-without-losing-hope";
import { LETTING_SOMEONE_IN } from "../content/playbook/letting-someone-in";
import { TRUSTING_WHAT_YOU_SEE } from "../content/playbook/trusting-what-you-see";
import { FINDING_SECURITY } from "../content/playbook/finding-security";
import { BREAKING_THE_CYCLE } from "../content/playbook/breaking-the-cycle";
import { getPlaybookContent } from "../content/playbook";
import { clusterIdForKey, hasInteractivePlaybook } from "../lib/playbook/keys";

const SCAFFOLDS = [
  {
    key: "dating-without-losing-hope",
    content: DATING_WITHOUT_LOSING_HOPE,
    playIds: ["how-many-at-once", "them-or-the-pattern", "whos-actually-here"],
    litCount: 12,
  },
  {
    key: "letting-someone-in",
    content: LETTING_SOMEONE_IN,
    playIds: ["before-you-go", "is-this-right-for-me", "just-ask", "one-true-thing", "when-closeness-costs"],
    litCount: 13,
  },
  {
    key: "trusting-what-you-see",
    content: TRUSTING_WHAT_YOU_SEE,
    playIds: [
      "check-it-dont-bury-it",
      "do-my-standards-fit-me",
      "give-it-a-second-look",
      "how-long-am-i-giving-this",
      "where-my-effort-goes",
      "wise-or-scared",
    ],
    litCount: 13,
  },
  {
    key: "finding-security",
    content: FINDING_SECURITY,
    playIds: ["ask-then-watch", "insecure-or-accurate", "what-this-is-costing", "when-it-doesnt-land"],
    litCount: 13,
  },
  {
    key: "breaking-the-cycle",
    content: BREAKING_THE_CYCLE,
    playIds: ["going-back-afterwards", "not-always-me", "raise-it-anyway", "when-it-starts-turning"],
    litCount: 11,
  },
] as const;

for (const s of SCAFFOLDS) {
  test(`${s.key}: structurally valid`, () => {
    const errs = validatePlaybookContent(s.content);
    assert.deepEqual(errs, [], "content errors: " + errs.join("; "));
  });

  test(`${s.key}: expected Plays, each with output + portable`, () => {
    assert.deepEqual([...s.content.plays.map((p) => p.playId)].sort(), [...s.playIds].sort());
    for (const p of s.content.plays) {
      assert.ok(p.screens.some((sc) => sc.kind === "output"), `${p.playId} has an output screen`);
      assert.ok(p.portable.length > 0, `${p.playId} has a portable form`);
    }
  });

  test(`${s.key}: registered as content but NOT publish-wired`, () => {
    assert.ok(getPlaybookContent(s.key), "resolves via registry");
    assert.equal(hasInteractivePlaybook(s.key), false, "not served by the app yet");
    assert.equal(clusterIdForKey(s.key), null, "no commerce/cluster mapping yet");
  });

  test(`${s.key}: literature cross-links all resolve (validator does not check literature)`, () => {
    const lit = s.content.literature ?? [];
    assert.equal(lit.length, s.litCount);
    const ids = new Set(lit.map((e) => e.id));
    for (const e of lit) {
      for (const r of e.related ?? []) {
        assert.ok(ids.has(r), `literature "${e.id}" related "${r}" does not resolve`);
      }
    }
  });
}
