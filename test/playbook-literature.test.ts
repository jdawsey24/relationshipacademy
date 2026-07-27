import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { MBR_LITERATURE, MBR_STATEMENT_MAP } from "../content/playbook/moving-beyond-rejection-literature";
import type { StatementFunction } from "../lib/playbook/contentSchema";

const litIds = new Set(MBR_LITERATURE.map((e) => e.id));
const builtPlayIds = new Set(C.plays.map((p) => p.playId));
const validTargets = new Set([...litIds, ...builtPlayIds]);

const FUNCTIONS: StatementFunction[] = [
  "recognition", "cluster_literature", "faq_literature", "play_literature", "jit_teaching",
  "simulation_cue", "play_routing", "support_signpost", "context_normalization", "none",
];

test("literature entries have unique ids", () => {
  assert.equal(litIds.size, MBR_LITERATURE.length, "duplicate literature id");
});

test("every related link and play/jit constraint resolves", () => {
  for (const e of MBR_LITERATURE) {
    for (const r of e.related ?? []) assert.ok(litIds.has(r), `${e.id} → unknown related ${r}`);
    if (e.scope === "play") assert.ok(e.playId && builtPlayIds.has(e.playId), `${e.id} play entry must target a built play`);
    if (e.scope === "jit") assert.ok(e.anchor, `${e.id} jit entry needs an anchor`);
    assert.ok(e.body.length > 0 && e.body.every((b) => b.body.length > 0), `${e.id} has empty body`);
  }
});

test("the content map covers all 101 statements exactly once", () => {
  assert.equal(MBR_STATEMENT_MAP.length, 101, "expected 101 statements");
  const ids = new Set(MBR_STATEMENT_MAP.map((m) => m.statementId));
  assert.equal(ids.size, 101, "duplicate statement id");
});

test("every mapping uses valid functions and resolvable targets", () => {
  for (const mp of MBR_STATEMENT_MAP) {
    assert.ok(mp.text.trim().length > 0, `${mp.statementId} missing text`);
    assert.ok(mp.functions.length > 0, `${mp.statementId} has no function`);
    for (const f of mp.functions) assert.ok(FUNCTIONS.includes(f), `${mp.statementId} invalid function ${f}`);
    for (const t of mp.targets ?? []) assert.ok(validTargets.has(t), `${mp.statementId} → unresolvable target ${t}`);
  }
});

test("routing/intervention targets only reference BUILT plays (no dangling not-yet-built Plays)", () => {
  for (const mp of MBR_STATEMENT_MAP) {
    for (const t of mp.targets ?? []) {
      // a target that is a play id must be one of the two built plays
      if (!litIds.has(t)) assert.ok(builtPlayIds.has(t), `${mp.statementId} routes to unbuilt play ${t}`);
    }
  }
});

test("not every statement is an intervention — many resolve to recognition/literature/normalization", () => {
  const interventionish = (fs: StatementFunction[]) => fs.includes("play_routing") || fs.includes("play_literature");
  const nonIntervention = MBR_STATEMENT_MAP.filter((m) => !interventionish(m.functions));
  assert.ok(nonIntervention.length >= 40, `expected many non-intervention statements, got ${nonIntervention.length}`);
});

test("only the two built Plays are ever routed to (RD + WM)", () => {
  const routed = new Set<string>();
  for (const mp of MBR_STATEMENT_MAP) for (const t of mp.targets ?? []) if (builtPlayIds.has(t)) routed.add(t);
  assert.deepEqual([...routed].sort(), ["read-and-decide", "what-it-actually-means"]);
});

test("loneliness statements normalize rather than route to a Play", () => {
  const lonely = MBR_STATEMENT_MAP.filter((m) => m.text.match(/alone|lonely|miss (having|being)|empty house|holidays|forgotten|sleeping alone/i));
  assert.ok(lonely.length >= 8, "loneliness cluster present");
  for (const m of lonely) {
    assert.ok(!m.functions.includes("play_routing"), `${m.statementId} should not route to a Play`);
    assert.ok(m.functions.includes("context_normalization"), `${m.statementId} should normalize`);
  }
});

test("content module exposes the Understand layer", () => {
  assert.equal(C.literature?.length, MBR_LITERATURE.length);
  assert.equal(C.statementMap?.length, 101);
});
