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

// ---- Phase D: Rev 3 separated state now carried (was stripped) -----------------

test("Phase D: simulation_state is carried, and a tagged fidelity outcome is validated", () => {
  const out = sanitizeIncomingProgress(
    {
      simulation_state: {
        version: 1,
        runs: {
          "sim-itr-evaluator-stance": { completed: true, fidelity: { signature: "dualAttention", evaluator_stance_held: "demonstrated", fit_information_kept_in_view: "demonstrated" } },
          "sim-rgu-decision-room": { completed: true, fidelity: { signature: "decisionRoom", intentional_stance_selected: "demonstrated", discouragement_distinguished_from_conclusion: "demonstrated", chosen_stance: "rest" } },
        },
      },
    },
    "k",
    1,
  );
  assert.ok(out.simulation_state, "simulation_state is no longer stripped");
  assert.equal(out.simulation_state?.runs?.["sim-itr-evaluator-stance"]?.completed, true);
  assert.equal(out.simulation_state?.runs?.["sim-rgu-decision-room"]?.fidelity?.signature, "decisionRoom");
});

test("Phase D: invalid fidelity states/stances are coerced to safe defaults; junk keys dropped", () => {
  const out = sanitizeIncomingProgress(
    {
      simulation_state: {
        runs: {
          s1: { completed: true, fidelity: { signature: "decisionRoom", intentional_stance_selected: "YES", discouragement_distinguished_from_conclusion: "demonstrated", chosen_stance: "whatever", partner_name: "leak" } },
          s2: { fidelity: { signature: "not-a-signature", x: 1 } },
        },
      },
    },
    "k",
    1,
  );
  const fid = out.simulation_state?.runs?.s1?.fidelity;
  assert.ok(fid && fid.signature === "decisionRoom");
  assert.equal(fid.intentional_stance_selected, "not_applicable", "invalid state → not_applicable");
  assert.equal(fid.chosen_stance, "pause_decision", "invalid stance → pause_decision");
  assert.ok(!("partner_name" in fid), "unknown/surveillance key dropped");
  assert.equal(out.simulation_state?.runs?.s2?.fidelity, undefined, "unknown signature → no fidelity");
});

test("Phase D: practice / use_review / change_path / literature state carried + enum-validated", () => {
  const out = sanitizeIncomingProgress(
    {
      practice_state: { version: 1, currentMissionId: "m1", missions: { m1: { state: "attempted", lastReport: "no_opportunity", attemptCount: 2 }, bad: { state: "nope" } } },
      use_review_state: { version: 1, reviews: { p1: { performed: "partly", stuck: "x", didDifferently: ["a", 5], kept: true } } },
      change_path_state: { version: 1, currentFocus: "read-and-decide" },
      literature_state: { version: 1, read: ["lit-a", "lit-b", 9] },
    },
    "k",
    1,
  );
  assert.equal(out.practice_state?.missions?.m1?.lastReport, "no_opportunity");
  assert.equal(out.practice_state?.missions?.bad, undefined, "invalid mission state dropped");
  // A legacy single-object review is coerced to a one-element list on the way in.
  assert.equal(out.use_review_state?.reviews?.p1?.[0]?.performed, "partly");
  assert.deepEqual(out.use_review_state?.reviews?.p1?.[0]?.didDifferently, ["a"]);
  assert.equal(out.change_path_state?.currentFocus, "read-and-decide");
  assert.deepEqual(out.literature_state?.read, ["lit-a", "lit-b"]);
});

test("Phase D: use_review keeps a LIST of logged uses (multiple over time), bounds count + at, coerces legacy", () => {
  const many = Array.from({ length: 60 }, (_, i) => ({ performed: "yes", at: `2026-07-${(i % 28) + 1}` }));
  const out = sanitizeIncomingProgress(
    {
      use_review_state: {
        version: 1,
        reviews: {
          listed: [{ performed: "yes", at: "2026-07-01T00:00:00.000Z" }, { performed: "partly", stuck: "s" }],
          legacy: { performed: "no" }, // legacy single object → one-element list
          capped: many,
          junk: [5, "x", { performed: "BAD", extra: "drop" }],
        },
      },
    },
    "k",
    1,
  );
  const rev = out.use_review_state?.reviews;
  assert.equal(rev?.listed?.length, 2, "list of uses preserved");
  assert.equal(rev?.listed?.[0]?.at, "2026-07-01T00:00:00.000Z", "at kept (bounded)");
  assert.equal(rev?.listed?.[1]?.performed, "partly");
  assert.deepEqual(rev?.legacy, [{ performed: "no" }], "legacy object coerced to one-element list");
  assert.equal(rev?.capped?.length, 50, "entries capped at 50");
  assert.equal(rev?.junk?.length, 1, "non-object entries dropped");
  assert.equal(rev?.junk?.[0]?.performed, undefined, "invalid performed dropped");
  assert.ok(!("extra" in (rev?.junk?.[0] ?? {})), "unknown keys dropped");
});

test("Phase D: absent/invalid Rev 3 state stays absent (no fabricated objects)", () => {
  const out = sanitizeIncomingProgress({ simulation_state: "not-an-object" }, "k", 1);
  assert.equal(out.simulation_state, undefined);
  assert.equal(out.practice_state, undefined);
  assert.equal(out.change_path_state, undefined);
});
