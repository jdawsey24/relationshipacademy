import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyProgress, type Play } from "../lib/playbook/contentSchema";
import { toggleRecognized, markExplored, markUsed, recordOutput } from "../lib/playbook/progressActions";
import { sanitizeIncomingProgress } from "../lib/playbook/sanitize";

const play: Play = {
  playId: "read-and-decide",
  playVersion: 3,
  outputSchemaVersion: 2,
  name: "Read It, Then Decide",
  positioning: "x",
  recognitionGate: { prompt: "p" },
  screens: [{ kind: "output", heading: "o" }],
  portable: ["a"],
  myPlaysTemplate: { when: "w", move: "m", lookingFor: "l", watchOut: "wo", remember: "r" },
  fidelity: { correct: "c", misuse: ["m"], notMeaning: "n" },
};

test("toggleRecognized adds then removes a card", () => {
  let p = emptyProgress("k", 1);
  p = toggleRecognized(p, "rec-1");
  assert.deepEqual(p.recognized, ["rec-1"]);
  p = toggleRecognized(p, "rec-1");
  assert.deepEqual(p.recognized, []);
});

test("markExplored never downgrades a saved or used play", () => {
  let p = emptyProgress("k", 1);
  p = markUsed(p, "read-and-decide");
  p = markExplored(p, "read-and-decide");
  assert.equal(p.play_states["read-and-decide"], "used");
});

test("recordOutput version-stamps the output and adds a My Plays card idempotently", () => {
  let p = emptyProgress("k", 1);
  p = recordOutput(p, play, { question: "q" });
  assert.equal(p.play_states["read-and-decide"], "in_my_plays");
  assert.equal(p.outputs["read-and-decide"].output_schema_version, 2);
  assert.equal(p.outputs["read-and-decide"].play_version, 3);
  assert.deepEqual(p.outputs["read-and-decide"].payload, { question: "q" });
  assert.equal(p.my_plays.length, 1);
  assert.equal(p.my_plays[0].play_id, "read-and-decide");

  // saving again updates the output but does not duplicate the card
  p = recordOutput(p, play, { question: "q2" });
  assert.equal(p.my_plays.length, 1);
  assert.deepEqual(p.outputs["read-and-decide"].payload, { question: "q2" });
});

test("sanitizeIncomingProgress enforces server-authoritative key/version and drops junk", () => {
  const out = sanitizeIncomingProgress(
    {
      playbook_key: "HACKED",
      playbook_version: 999,
      recognized: ["a", 5, "b"],
      play_states: { x: "used", y: "not-a-state" },
      outputs: { p1: { output_schema_version: 4, play_version: 2, payload: { ok: 1 } }, bad: { payload: 5 } },
      my_plays: [{ play_id: "z", name: "Z" }, { name: "no id" }],
    },
    "real-key",
    7,
  );
  assert.equal(out.playbook_key, "real-key");
  assert.equal(out.playbook_version, 7);
  assert.deepEqual(out.recognized, ["a", "b"]);
  assert.deepEqual(out.play_states, { x: "used" });
  assert.ok(out.outputs.p1);
  assert.ok(!out.outputs.bad);
  assert.equal(out.my_plays.length, 1);
  assert.equal(out.my_plays[0].play_id, "z");
});

test("sanitizeIncomingProgress tolerates a non-object body", () => {
  const out = sanitizeIncomingProgress(null, "k", 1);
  assert.deepEqual(out.recognized, []);
  assert.deepEqual(out.my_plays, []);
  assert.equal(out.playbook_key, "k");
});
