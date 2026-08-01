// The full playbook content corpus (handoff 2): 25 Plays-only Playbooks + 5 add-ons,
// registered for preview/validation but publish-held (absent from lib/playbook/keys.ts
// INTERACTIVE / commerce map). Registry-driven so every registered key is covered
// automatically. The flagship is the one publish-wired exception.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlaybookContent } from "../lib/playbook/contentValidate";
import { getPlaybookContent, listPlaybookKeys } from "../content/playbook";
import { clusterIdForKey, hasInteractivePlaybook } from "../lib/playbook/keys";

const FLAGSHIP = "moving-beyond-rejection";

test("registry has the flagship + the full corpus", () => {
  const keys = listPlaybookKeys();
  assert.ok(keys.includes(FLAGSHIP), "flagship registered");
  // 1 flagship + 25 Playbooks + 5 add-ons
  assert.equal(keys.length, 31, "expected 31 registered keys");
  assert.equal(keys.filter((k) => k.startsWith("addon-")).length, 5, "5 add-ons");
});

for (const key of listPlaybookKeys()) {
  const content = getPlaybookContent(key)!;

  test(`${key}: structurally valid`, () => {
    const errs = validatePlaybookContent(content);
    assert.deepEqual(errs, [], "content errors: " + errs.join("; "));
  });

  test(`${key}: every Play has an output screen + a portable form; playIds unique`, () => {
    assert.ok(content.plays.length > 0, "has at least one Play");
    const ids = content.plays.map((p) => p.playId);
    assert.equal(new Set(ids).size, ids.length, "playIds are unique");
    for (const p of content.plays) {
      assert.ok(p.screens.some((sc) => sc.kind === "output"), `${p.playId} has an output screen`);
      assert.ok(p.portable.length > 0, `${p.playId} has a portable form`);
    }
  });

  test(`${key}: literature cross-links all resolve (validator does not check literature)`, () => {
    const lit = content.literature ?? [];
    const ids = new Set(lit.map((e) => e.id));
    for (const e of lit) {
      for (const r of e.related ?? []) {
        assert.ok(ids.has(r), `literature "${e.id}" related "${r}" does not resolve`);
      }
    }
  });

  if (key !== FLAGSHIP) {
    test(`${key}: registered as content but NOT publish-wired`, () => {
      assert.ok(getPlaybookContent(key), "resolves via registry");
      assert.equal(hasInteractivePlaybook(key), false, "not served by the app yet");
      assert.equal(clusterIdForKey(key), null, "no commerce/cluster mapping yet");
    });
  }
}
