import { test } from "node:test";
import assert from "node:assert/strict";
import { resourceKindsFor, filterResources, type RoutableResource } from "../lib/companion/safetyRouting";

const r = (id: string, resource_kind: string | null, cats: string[], jurisdiction: string, is_active = true): RoutableResource =>
  ({ id, name: id, description: null, contact: null, url: null, hours: null, resource_kind, applies_to_categories: cats, jurisdiction, is_active });

const ROWS: RoutableResource[] = [
  r("988", "suicide_crisis", ["self_harm"], "US"),
  r("dv", "ipv", ["ipv"], "US"),
  r("rainn", "sexual_assault", ["sexual_coercion"], "US"),
  r("emerg", "emergency", [], "US"),
  r("global", "suicide_crisis", ["self_harm"], "GLOBAL"),
  r("dv_inactive", "ipv", ["ipv"], "US", false),
];
const ids = (rows: RoutableResource[]) => rows.map((x) => x.id).sort();

// ---- resource kind mapping (all four categories) ----
test("category → resource kinds", () => {
  assert.deepEqual([...resourceKindsFor(["self_harm"])], ["suicide_crisis"]);
  assert.deepEqual([...resourceKindsFor(["ipv"])], ["ipv"]);
  assert.deepEqual([...resourceKindsFor(["sexual_coercion"])], ["sexual_assault"]);
  assert.deepEqual([...resourceKindsFor(["harm_to_others"])].sort(), ["emergency", "suicide_crisis"]);
});
test("immediate adds emergency; undetermined → emergency + crisis", () => {
  assert.ok(resourceKindsFor(["ipv"], { immediate: true }).has("emergency"));
  assert.deepEqual([...resourceKindsFor([], { undetermined: true })].sort(), ["emergency", "suicide_crisis"]);
});

// ---- routing per category (US) ----
test("US + ipv → the IPV hotline only", () => {
  assert.deepEqual(ids(filterResources(ROWS, resourceKindsFor(["ipv"]), ["ipv"], "US")), ["dv"]);
});
test("US + self_harm immediate → crisis + emergency (+ GLOBAL crisis)", () => {
  const out = ids(filterResources(ROWS, resourceKindsFor(["self_harm"], { immediate: true }), ["self_harm"], "US"));
  assert.deepEqual(out, ["988", "emerg", "global"]);
});
test("US + sexual_coercion → RAINN", () => {
  assert.deepEqual(ids(filterResources(ROWS, resourceKindsFor(["sexual_coercion"]), ["sexual_coercion"], "US")), ["rainn"]);
});
test("undetermined acute (no category) still routes by kind", () => {
  const out = ids(filterResources(ROWS, resourceKindsFor([], { undetermined: true }), [], "US"));
  assert.deepEqual(out, ["988", "emerg", "global"]);
});

// ---- jurisdiction fallback (non-US / unsupported) ----
test("non-US jurisdiction falls back to GLOBAL only", () => {
  const out = ids(filterResources(ROWS, resourceKindsFor(["self_harm"]), ["self_harm"], "CA"));
  assert.deepEqual(out, ["global"]);           // US 988 excluded; GLOBAL kept
});
test("unsupported jurisdiction with no GLOBAL match → empty (copy still directs to help)", () => {
  const out = filterResources(ROWS, resourceKindsFor(["ipv"]), ["ipv"], "CA");
  assert.deepEqual(out, []);                    // no GLOBAL ipv row → empty, never a wrong-country number
});

// ---- inactive excluded ----
test("inactive resources are never routed", () => {
  const out = ids(filterResources(ROWS, resourceKindsFor(["ipv"]), ["ipv"], "US"));
  assert.ok(!out.includes("dv_inactive"));
});
