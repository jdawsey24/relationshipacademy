import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlaybookContent } from "../lib/playbook/contentValidate";
import { MOVING_BEYOND_REJECTION } from "../content/playbook/moving-beyond-rejection";
import { getPlaybookContent } from "../content/playbook";
import { clusterIdForKey, keyForClusterId, isPlaybookKey, hasInteractivePlaybook } from "../lib/playbook/keys";

test("shipped content module is structurally valid", () => {
  const errs = validatePlaybookContent(MOVING_BEYOND_REJECTION);
  assert.deepEqual(errs, [], "content errors: " + errs.join("; "));
});

test("shipped plays are the approved, screen-complete set (RD, WM + implemented slices)", () => {
  const ids = MOVING_BEYOND_REJECTION.plays.map((p) => p.playId).sort();
  assert.deepEqual(ids, ["how-much-to-put-in", "is-this-right-for-you", "read-and-decide", "rest-or-giving-up", "say-the-real-thing", "what-it-actually-means"]);
});

test("every play produces an executable output (output screen + portable form)", () => {
  for (const p of MOVING_BEYOND_REJECTION.plays) {
    assert.ok(p.screens.some((s) => s.kind === "output"), `${p.playId} has an output screen`);
    assert.ok(p.portable.length > 0, `${p.playId} has a portable form`);
    assert.ok(p.playVersion >= 1 && p.outputSchemaVersion >= 1, `${p.playId} is versioned (R2)`);
  }
});

test("recognition route cards route; validate cards do not; at least one routes to a built play", () => {
  const built = new Set(MOVING_BEYOND_REJECTION.plays.map((p) => p.playId));
  let routeToBuilt = 0;
  for (const c of MOVING_BEYOND_REJECTION.recognitionCards) {
    if (c.role === "route") {
      assert.ok(c.pathwayPlayId, `${c.id} route card has a pathway`);
      if (c.pathwayPlayId && built.has(c.pathwayPlayId)) routeToBuilt++;
    } else {
      assert.equal(c.pathwayPlayId, null, `${c.id} non-route card must not route`);
    }
  }
  assert.ok(routeToBuilt >= 1);
});

test("pattern-branch routing targets a built play", () => {
  const wm = MOVING_BEYOND_REJECTION.plays.find((p) => p.playId === "what-it-actually-means");
  assert.ok(wm);
  assert.equal(wm!.routing?.toPlayId, "read-and-decide");
});

test("validator catches malformed content", () => {
  const bad = structuredClone(MOVING_BEYOND_REJECTION);
  bad.plays[0].myPlaysTemplate.remember = "";
  assert.ok(validatePlaybookContent(bad).length > 0);
});

test("keys registry decouples playbook_key from cluster_id and round-trips", () => {
  assert.equal(clusterIdForKey("moving-beyond-rejection"), 1);
  assert.equal(keyForClusterId(1), "moving-beyond-rejection");
  assert.ok(isPlaybookKey("moving-beyond-rejection"));
  assert.ok(!isPlaybookKey("nope"));
  assert.ok(hasInteractivePlaybook("moving-beyond-rejection"));
  assert.equal(clusterIdForKey("nope"), null);
  assert.equal(keyForClusterId(999), null);
});

test("content registry resolves the shipped key and rejects unknown", () => {
  assert.ok(getPlaybookContent("moving-beyond-rejection"));
  assert.equal(getPlaybookContent("nope"), null);
  assert.equal(getPlaybookContent(null), null);
});
