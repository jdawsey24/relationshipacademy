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

test("DRAFT covers exactly the corpus (every registered key except flagship)", () => {
  const corpus = listPlaybookKeys().filter((k) => k !== FLAGSHIP).sort();
  assert.deepEqual(Object.keys(DRAFT_PLAYBOOK_KEY_TO_CLUSTER).sort(), corpus);
});

test("every DRAFT key resolves to loadable content; every cluster is 1..27 and assessable", () => {
  const NON_ASSESSABLE = new Set([2, 17]);
  for (const [key, cluster] of Object.entries(DRAFT_PLAYBOOK_KEY_TO_CLUSTER)) {
    assert.ok(getPlaybookContent(key), `no content for ${key}`);
    assert.ok(cluster >= 1 && cluster <= 27, `cluster ${cluster} out of range (${key})`);
    assert.ok(!NON_ASSESSABLE.has(cluster), `${key} maps to non-assessable cluster ${cluster}`);
  }
});

test("multi-Playbook clusters have an explicit, valid primary", () => {
  for (const [clusterStr, primary] of Object.entries(CLUSTER_PRIMARY_KEY)) {
    const cluster = Number(clusterStr);
    assert.equal(DRAFT_PLAYBOOK_KEY_TO_CLUSTER[primary], cluster, `${primary} must map to ${cluster}`);
    const members = Object.entries(DRAFT_PLAYBOOK_KEY_TO_CLUSTER).filter(([, c]) => c === cluster);
    assert.ok(members.length > 1, `cluster ${cluster} listed as multi-Playbook but has ${members.length}`);
  }
});
