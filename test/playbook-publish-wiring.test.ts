// Publish-wiring draft (lib/playbook/keys.ts) — the corpus mapping is prepared
// but GATED OFF (NEXT_PUBLIC_PLAYBOOK_CORPUS unset in tests). These tests lock in
// (a) that flag-off preserves flagship-only behaviour, and (b) that the draft map
// is complete and internally consistent, ready to flip.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PLAYBOOK_KEY_TO_CLUSTER,
  INTERACTIVE_PLAYBOOK_KEYS,
  DRAFT_PLAYBOOK_KEY_TO_CLUSTER,
  CLUSTER_PRIMARY_KEY,
  PAIRED_KEYS,
  PAIRED_KEY_TO_CLUSTER,
  ADDON_KEYS,
  ADDON_KEY_TO_CLUSTER,
  hasInteractivePlaybook,
  clusterIdForKey,
  keyForClusterId,
} from "../lib/playbook/keys";
import { listPlaybookKeys, getPlaybookContent } from "../content/playbook";

const FLAGSHIP = "moving-beyond-rejection";

test("GATE OFF: only the flagship is wired/served (production behaviour)", () => {
  assert.deepEqual(Object.keys(PLAYBOOK_KEY_TO_CLUSTER), [FLAGSHIP]);
  assert.deepEqual([...INTERACTIVE_PLAYBOOK_KEYS], [FLAGSHIP]);
  assert.equal(hasInteractivePlaybook("letting-someone-in"), false);
  assert.equal(clusterIdForKey("letting-someone-in"), null);
  assert.equal(hasInteractivePlaybook("addon-caregiving"), false);
  // flagship still works
  assert.equal(clusterIdForKey(FLAGSHIP), 1);
  assert.equal(hasInteractivePlaybook(FLAGSHIP), true);
  assert.equal(keyForClusterId(1), FLAGSHIP);
});

test("DRAFT core + paired modules + add-ons cover exactly the corpus", () => {
  const corpus = listPlaybookKeys().filter((k) => k !== FLAGSHIP).sort();
  const drafted = [...Object.keys(DRAFT_PLAYBOOK_KEY_TO_CLUSTER), ...PAIRED_KEYS, ...ADDON_KEYS].sort();
  assert.deepEqual(drafted, corpus);
});

test("every core DRAFT key resolves to content; every cluster is 1..27 and assessable", () => {
  const NON_ASSESSABLE = new Set([2, 17]);
  for (const [key, cluster] of Object.entries(DRAFT_PLAYBOOK_KEY_TO_CLUSTER)) {
    assert.ok(getPlaybookContent(key), `no content for ${key}`);
    assert.ok(cluster >= 1 && cluster <= 27, `cluster ${cluster} out of range (${key})`);
    assert.ok(!NON_ASSESSABLE.has(cluster), `${key} maps to non-assessable cluster ${cluster}`);
  }
});

test("add-ons sold individually: each resolves to content and has its own reserved (non-cluster) id", () => {
  assert.equal(ADDON_KEYS.length, 5);
  const ids = Object.values(ADDON_KEY_TO_CLUSTER);
  assert.equal(new Set(ids).size, ids.length, "each add-on must have a DISTINCT entitlement id");
  for (const [key, id] of Object.entries(ADDON_KEY_TO_CLUSTER)) {
    assert.ok(getPlaybookContent(key), `no content for ${key}`);
    assert.ok(key.startsWith("addon-"), `${key} should be an add-on`);
    assert.ok(id > 27, `${key} id ${id} must be outside the Snapshot cluster range`);
  }
});

test("C12/C21 paired modules are sold separately: distinct reserved ids, own content, no collisions", () => {
  assert.equal(PAIRED_KEYS.length, 2);
  const pairedIds = Object.values(PAIRED_KEY_TO_CLUSTER);
  assert.equal(new Set(pairedIds).size, pairedIds.length, "paired modules must have DISTINCT ids");
  const addonIds = new Set(Object.values(ADDON_KEY_TO_CLUSTER));
  const draftIds = new Set(Object.values(DRAFT_PLAYBOOK_KEY_TO_CLUSTER));
  for (const [key, id] of Object.entries(PAIRED_KEY_TO_CLUSTER)) {
    assert.ok(getPlaybookContent(key), `no content for ${key}`);
    assert.ok(id > 27, `${key} id ${id} must be outside the Snapshot cluster range`);
    assert.ok(!addonIds.has(id), `${key} id ${id} collides with an add-on id`);
    // The whole point of the split: the paired module must NOT share a Snapshot cluster id,
    // and must not also live in the DRAFT map.
    assert.ok(!draftIds.has(id), `${key} id ${id} collides with a Snapshot cluster id`);
    assert.equal(DRAFT_PLAYBOOK_KEY_TO_CLUSTER[key], undefined, `${key} must not also be in the DRAFT map`);
  }
  // No multi-result clusters remain; if CLUSTER_PRIMARY_KEY is populated later it must stay valid.
  for (const [clusterStr, primary] of Object.entries(CLUSTER_PRIMARY_KEY)) {
    assert.equal(DRAFT_PLAYBOOK_KEY_TO_CLUSTER[primary], Number(clusterStr), `${primary} must map to ${clusterStr}`);
  }
});
