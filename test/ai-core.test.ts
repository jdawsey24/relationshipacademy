import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateCost, OWNER_ONLY_AI_STATUSES } from "../lib/ai/types";
import { renderTemplate } from "../lib/ai/templates";
import { tokenSimilarity } from "../lib/ai/dedupe";
import { getProvider } from "../lib/ai/provider";

test("cost estimate is positive and increases with tokens", () => {
  assert.ok(estimateCost(1000, 1000) > 0);
  assert.ok(estimateCost(2000, 2000) > estimateCost(1000, 1000));
});

test("approve/publish/reject/retire are owner-only statuses", () => {
  for (const s of ["approved", "published", "rejected", "retired"]) {
    assert.ok(OWNER_ONLY_AI_STATUSES.includes(s as never), `${s} must be owner-only`);
  }
  assert.equal(OWNER_ONLY_AI_STATUSES.includes("draft" as never), false);
});

test("template rendering fills known vars and leaves unknown placeholders", () => {
  const out = renderTemplate("Hello {{name}}, count {{count}}, {{missing}}", { name: "A", count: "3" });
  assert.equal(out, "Hello A, count 3, {{missing}}");
});

test("duplicate similarity: identical=1, disjoint=0, partial in between", () => {
  assert.equal(tokenSimilarity("ask thoughtful questions", "ask thoughtful questions"), 1);
  assert.equal(tokenSimilarity("ask thoughtful questions", "swimming underwater elephants"), 0);
  const partial = tokenSimilarity("I ask thoughtful questions often", "I ask questions sometimes");
  assert.ok(partial > 0 && partial < 1);
});

test("provider abstraction: anthropic wired, unknown provider unavailable (no hardcode leak)", () => {
  assert.equal(getProvider("anthropic").name, "anthropic");
  const openai = getProvider("openai");
  assert.equal(openai.configured(), false);
  assert.rejects(() => openai.generate({ system: "", user: "", schema: {}, model: "x", maxTokens: 1, timeoutSeconds: 1 }));
});
