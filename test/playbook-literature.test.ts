import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/finding-love-that-feels-mutual";
import { MBR_LITERATURE, MBR_STATEMENT_MAP } from "../content/playbook/finding-love-that-feels-mutual-literature";
import type { LiteratureBlock, StatementFunction } from "../lib/playbook/contentSchema";

const litIds = new Set(MBR_LITERATURE.map((e) => e.id));
const builtPlayIds = new Set(C.plays.map((p) => p.playId));
const validTargets = new Set([...litIds, ...builtPlayIds]);

const FUNCTIONS: StatementFunction[] = [
  "recognition", "cluster_literature", "faq_literature", "play_literature", "jit_teaching",
  "simulation_cue", "play_routing", "support_signpost_candidate", "context_normalization", "none",
];

function blockHasContent(b: LiteratureBlock): boolean {
  return b.kind === "list" ? b.items.length > 0 : b.body.length > 0;
}

test("literature entries have unique ids and valid depth/scope", () => {
  assert.equal(litIds.size, MBR_LITERATURE.length, "duplicate literature id");
  for (const e of MBR_LITERATURE) {
    if (e.scope === "cluster") assert.ok(e.depth === "core" || e.depth === "question", `${e.id} cluster entry needs depth`);
    else assert.equal(e.depth, undefined, `${e.id} non-cluster entry must not set depth`);
  }
});

test("three depths are all present (Core Guides, Question Reads, Just-in-Time)", () => {
  assert.ok(MBR_LITERATURE.some((e) => e.scope === "cluster" && e.depth === "core"), "core guides");
  assert.ok(MBR_LITERATURE.some((e) => e.scope === "cluster" && e.depth === "question"), "question reads");
  assert.ok(MBR_LITERATURE.some((e) => e.scope === "jit"), "just-in-time reads");
});

test("every block has content and a valid kind; distinctions carry a label", () => {
  const KINDS = ["paragraph", "distinction", "list", "example", "guardrail"];
  for (const e of MBR_LITERATURE) {
    assert.ok(e.body.length > 0, `${e.id} empty`);
    for (const b of e.body) {
      assert.ok(KINDS.includes(b.kind), `${e.id} invalid block kind ${b.kind}`);
      assert.ok(blockHasContent(b), `${e.id} empty block`);
      if (b.kind === "distinction") assert.ok(b.label.trim().length > 0, `${e.id} distinction needs a label`);
    }
  }
});

test("Core Guides are substantive (multi-section / multi-block)", () => {
  const cores = MBR_LITERATURE.filter((e) => e.scope === "cluster" && e.depth === "core");
  assert.ok(cores.length >= 10, "expected a full set of core guides");
  for (const e of cores) assert.ok(e.body.length >= 3, `${e.id} core guide should be multi-section`);
});

test("related links and play/jit constraints resolve", () => {
  for (const e of MBR_LITERATURE) {
    for (const r of e.related ?? []) assert.ok(litIds.has(r), `${e.id} → unknown related ${r}`);
    if (e.scope === "play") assert.ok(e.playId && builtPlayIds.has(e.playId), `${e.id} play entry must target a built play`);
    if (e.scope === "jit") assert.ok(e.anchor, `${e.id} jit entry needs an anchor`);
  }
});

test("no browseable entry links directly to a JIT entry (JIT surfaces at anchors, not browse)", () => {
  const jitIds = new Set(MBR_LITERATURE.filter((e) => e.scope === "jit").map((e) => e.id));
  const browseable = MBR_LITERATURE.filter((e) => e.scope !== "jit");
  for (const e of browseable) {
    for (const r of e.related ?? []) assert.ok(!jitIds.has(r), `${e.id} should not expose JIT ${r} via browse`);
  }
});

test("the content map covers all 101 statements exactly once", () => {
  assert.equal(MBR_STATEMENT_MAP.length, 101);
  assert.equal(new Set(MBR_STATEMENT_MAP.map((m) => m.statementId)).size, 101);
});

test("every mapping uses valid functions and resolvable targets", () => {
  for (const mp of MBR_STATEMENT_MAP) {
    assert.ok(mp.text.trim().length > 0, `${mp.statementId} missing text`);
    assert.ok(mp.functions.length > 0, `${mp.statementId} has no function`);
    for (const f of mp.functions) assert.ok(FUNCTIONS.includes(f), `${mp.statementId} invalid function ${f}`);
    for (const t of mp.targets ?? []) assert.ok(validTargets.has(t), `${mp.statementId} → unresolvable target ${t}`);
  }
});

test("`none` is exclusive — never coexists with another function", () => {
  for (const mp of MBR_STATEMENT_MAP) {
    if (mp.functions.includes("none")) assert.equal(mp.functions.length, 1, `${mp.statementId}: none must be exclusive`);
  }
});

test("only the two built Plays are ever routed to (RD + WM)", () => {
  const routed = new Set<string>();
  for (const mp of MBR_STATEMENT_MAP) for (const t of mp.targets ?? []) if (builtPlayIds.has(t)) routed.add(t);
  assert.deepEqual([...routed].sort(), ["read-and-decide", "what-it-actually-means"]);
});

test("support_signpost_candidate is rare, never a trigger, and off ordinary fatigue/loneliness/worry", () => {
  const withCandidate = MBR_STATEMENT_MAP.filter((m) => m.functions.includes("support_signpost_candidate"));
  assert.ok(withCandidate.length > 0 && withCandidate.length <= 5, "candidate is reserved for pervasive/identity statements");
  // ordinary dating fatigue / apps / worry-it-ends / loneliness must NOT carry the candidate
  const ordinary = ["STM-0177", "STM-0178", "STM-0530", "STM-0531", "STM-0570", "STM-0184"];
  for (const id of ordinary) {
    const mp = MBR_STATEMENT_MAP.find((m) => m.statementId === id)!;
    assert.ok(!mp.functions.includes("support_signpost_candidate"), `${id} must not carry a support signpost`);
  }
});

test("expectancy statements do NOT auto-route to a Play (PE-6 preserved)", () => {
  const expectancy = ["STM-0174", "STM-0180", "STM-0522", "STM-0524", "STM-0527", "STM-0528", "STM-0530"];
  for (const id of expectancy) {
    const mp = MBR_STATEMENT_MAP.find((m) => m.statementId === id)!;
    assert.ok(!mp.functions.includes("play_routing"), `${id} must not route to a Play`);
    assert.ok(!(mp.targets ?? []).some((t) => builtPlayIds.has(t)), `${id} must not target a Play`);
  }
});

test("loneliness statements normalize rather than route to a Play", () => {
  const lonely = MBR_STATEMENT_MAP.filter((m) => m.text.match(/alone|lonely|miss (having|being)|empty house|holidays|forgotten|sleeping alone/i));
  assert.ok(lonely.length >= 8, "loneliness cluster present");
  for (const m of lonely) {
    assert.ok(!m.functions.includes("play_routing"), `${m.statementId} should not route to a Play`);
    assert.ok(m.functions.includes("context_normalization"), `${m.statementId} should normalize`);
  }
});

test("not every statement is an intervention — many resolve to recognition/literature/normalization", () => {
  const interventionish = (fs: StatementFunction[]) => fs.includes("play_routing") || fs.includes("play_literature");
  const nonIntervention = MBR_STATEMENT_MAP.filter((m) => !interventionish(m.functions));
  assert.ok(nonIntervention.length >= 40, `expected many non-intervention statements, got ${nonIntervention.length}`);
});

test("content module exposes the Understand layer", () => {
  assert.ok((C.literature?.length ?? 0) >= MBR_LITERATURE.length, "exposes at least the cluster literature (+ slice JIT)");
  assert.equal(C.statementMap?.length, 101);
});
