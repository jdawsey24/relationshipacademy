import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CROSS_PLAYBOOK_ROUTES,
  routesFrom,
  relatedPlaybookKeys,
  validateCrossPlaybookRoutes,
} from "../lib/playbook/crossPlaybookRoutes";
import { getPlaybookContent, listPlaybookKeys } from "../content/playbook";

test("every cross-Playbook route endpoint resolves to a registered playbook_key", () => {
  const errs = validateCrossPlaybookRoutes(listPlaybookKeys());
  assert.deepEqual(errs, [], errs.join("; "));
});

test("every route endpoint has loadable content (not just a bare key)", () => {
  for (const r of CROSS_PLAYBOOK_ROUTES) {
    assert.ok(getPlaybookContent(r.from), `no content for from "${r.from}"`);
    assert.ok(getPlaybookContent(r.to), `no content for to "${r.to}"`);
  }
});

test("validator flags unknown keys and self-routes", () => {
  assert.equal(validateCrossPlaybookRoutes([]).length > 0, true, "empty key set → errors");
});

test("the caregiving ⇄ living-with-illness pair is symmetric", () => {
  assert.ok(relatedPlaybookKeys("addon-caregiving").includes("addon-living-with-illness"));
  assert.ok(relatedPlaybookKeys("addon-living-with-illness").includes("addon-caregiving"));
});

test("moving-forward ↔ letting-go-without-losing-what-it-meant is bidirectional", () => {
  assert.ok(relatedPlaybookKeys("moving-forward").includes("letting-go-without-losing-what-it-meant"));
  assert.ok(relatedPlaybookKeys("letting-go-without-losing-what-it-meant").includes("moving-forward"));
});

test("routesFrom returns declared routes; relatedPlaybookKeys dedupes", () => {
  // moving-forward routes to letting-go-without-losing-what-it-meant + starting-again-without-starting-from-scratch + trust-yourself-to-choose-better
  const targets = relatedPlaybookKeys("moving-forward");
  assert.deepEqual([...targets].sort(), ["letting-go-without-losing-what-it-meant", "starting-again-without-starting-from-scratch", "trust-yourself-to-choose-better"]);
  assert.equal(routesFrom("a-key-with-no-routes").length, 0);
});

test("every route carries a non-empty reason", () => {
  for (const r of CROSS_PLAYBOOK_ROUTES) assert.ok(r.reason.trim().length > 0, `${r.from} → ${r.to}`);
});
