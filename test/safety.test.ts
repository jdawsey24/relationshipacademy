import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, type RuleSet, type SafetyRule, type ImmediacyTerm, type RiskCategory } from "../lib/companion/safetyEngine";

// ---------------------------------------------------------------------------
// Fixture rule set — mirrors data/companion-safety/registry.seed.json (v2.0.1,
// owner-reviewed round 2). Exercises the ENGINE; the production registry lives in
// the DB. Severity framework: 1 ambiguous, 2 clear disclosure, 3 explicit serious
// harm / assault / credible threat.
// ---------------------------------------------------------------------------

let n = 0;
const rule = (
  risk_category: RiskCategory, canonical_concept: string, pattern: string,
  severity: 1 | 2 | 3, opts: Partial<SafetyRule> = {}
): SafetyRule => ({
  id: `R${++n}`, risk_category, canonical_concept, pattern,
  match_type: opts.match_type ?? "phrase", severity,
  context_required: opts.context_required ?? true,
  negation_sensitive: opts.negation_sensitive ?? true,
  ...opts,
});

const RULES: SafetyRule[] = [
  // self_harm
  rule("self_harm", "suicidal_intent", "kill myself", 3),
  rule("self_harm", "suicidal_intent", "want to kill myself", 3),
  rule("self_harm", "suicidal_ideation", "thinking about killing myself", 3),
  rule("self_harm", "suicidal_ideation", "keep thinking about killing myself", 3),
  rule("self_harm", "passive_death_wish", "want to die", 2),
  rule("self_harm", "passive_death_wish", "better off dead", 2),
  rule("self_harm", "self_harm_intent", "want to hurt myself", 2),
  rule("self_harm", "self_harm_intent", "cut myself on purpose", 2),
  rule("self_harm", "self_harm_intent", "cutting myself", 2),
  rule("self_harm", "diffuse_distress", "want everything to stop", 1),

  // ipv — ordinary assault sev2, severe violence sev3
  rule("ipv", "physical_assault", "hit me", 2),
  rule("ipv", "physical_assault", "hitting me", 2),
  rule("ipv", "physical_assault", "slapped me", 2),
  rule("ipv", "physical_assault", "punched me", 2),
  rule("ipv", "physical_assault", "pushed me", 2),
  rule("ipv", "physical_assault", "grabbed me", 2),
  rule("ipv", "severe_violence", "choke me", 3),
  rule("ipv", "severe_violence", "choked me", 3),
  rule("ipv", "severe_violence", "strangled me", 3),
  rule("ipv", "threat", "threatened me", 3),
  rule("ipv", "threat", "threatening me", 3),
  rule("ipv", "threat", "threatened to kill me", 3),
  rule("ipv", "lethality_fear", "going to kill me", 3),
  rule("ipv", "confinement", "won't let me leave", 2),   // atomic; negation stays ON
  rule("ipv", "confinement", "trapped me", 2),
  rule("ipv", "fear_of_partner", "afraid of my partner", 2),
  rule("ipv", "referenced_abuse", "does the same thing to me", 1),
  rule("ipv", "referenced_abuse", "does that to me", 1),

  // sexual_coercion
  rule("sexual_coercion", "assault", "forced me to have sex", 3),
  rule("sexual_coercion", "assault", "raped me", 3),
  rule("sexual_coercion", "assault", "made me have sex", 3),
  rule("sexual_coercion", "nonconsent", "said no.{0,30}(kept going|wouldn'?t stop|didn'?t stop|wouldn'?t listen|didn'?t listen)", 3, { match_type: "regex" }),
  rule("sexual_coercion", "nonconsent", "wouldn't listen when i said no", 3),
  rule("sexual_coercion", "coercion", "pressured me into sex", 2),
  rule("sexual_coercion", "consent_unclear", "i didn't agree to it", 2),
  rule("sexual_coercion", "consent_unclear", "i was asleep when it happened", 2),
  rule("sexual_coercion", "consent_ambiguous", "wouldn't stop", 1),

  // harm_to_others — explicit intent sev3; bare reference sev1
  rule("harm_to_others", "lethal_intent", "(about to|going to|gonna|want to|planning to) kill (him|her|them|someone|my partner)", 3, { match_type: "regex" }),
  rule("harm_to_others", "violent_intent", "(about to|going to|gonna|want to|planning to) hurt (him|her|them|someone|my partner)", 3, { match_type: "regex" }),
  rule("harm_to_others", "lethal_reference", "kill him", 1),
  rule("harm_to_others", "lethal_reference", "kill her", 1),
  rule("harm_to_others", "violent_urge", "seriously hurt them", 2),
  rule("harm_to_others", "loss_of_control", "afraid i'll hurt someone", 2),
];

const IMMEDIACY: ImmediacyTerm[] = [
  { id: "I1", pattern: "about to", match_type: "phrase", kind: "intent" },
  { id: "I2", pattern: "going to do it", match_type: "phrase", kind: "intent" },
  { id: "I3", pattern: "already took the pills", match_type: "phrase", kind: "active_act", implies_category: "self_harm" },
  { id: "I3b", pattern: "took too many pills", match_type: "phrase", kind: "active_act", implies_category: "self_harm" },
  // weapon terms carry NO implies_category (category-neutral)
  { id: "I4", pattern: "has a gun", match_type: "phrase", kind: "weapon" },
  { id: "I5", pattern: "have the gun with me", match_type: "phrase", kind: "weapon" },
  { id: "I6", pattern: "won't let me leave", match_type: "phrase", kind: "confinement" },
  { id: "I7", pattern: "hiding from him", match_type: "phrase", kind: "confinement" },
  { id: "I8", pattern: "threatening me", match_type: "phrase", kind: "escalation" },
  { id: "I9", pattern: "going to kill me", match_type: "phrase", kind: "escalation" },
  { id: "I10", pattern: "right now", match_type: "phrase", kind: "temporal" },
  { id: "I11", pattern: "tonight", match_type: "keyword", kind: "temporal" },
  { id: "I12", pattern: "here right now", match_type: "phrase", kind: "temporal" },
];

const RS: RuleSet = { rules: RULES, immediacyTerms: IMMEDIACY, registry_version: "test-fixture" };
const run = (t: string) => classify(t, RS);
const cats = (t: string) => run(t).categories.slice().sort();

// ---------------------------------------------------------------------------
// Direct disclosures
// ---------------------------------------------------------------------------
test("direct IPV assault: 'my husband hit me' → ipv, severity 2 (ordinary assault)", () => {
  const c = run("My husband hit me.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.action_level, 2);
  assert.equal(c.immediate_danger, false);
});

test("direct self-harm intent → self_harm sev3", () => {
  const c = run("Sometimes I just want to kill myself.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.action_level, 3);
});

test("passive ideation is severity 2, not automatically 3", () => {
  const c = run("Lately I just want to die.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.action_level, 2);
});

// ---------------------------------------------------------------------------
// (1) IPV physical-violence severity split
// ---------------------------------------------------------------------------
test("[rev1] ordinary assault 'he slapped me' → ipv sev2", () => {
  const c = run("He slapped me during the argument.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.action_level, 2);
});
test("[rev1] severe violence 'he choked me' → ipv sev3", () => {
  const c = run("He choked me.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.action_level, 3);
});

// ---------------------------------------------------------------------------
// (2) Self-harm: intentional vs accidental
// ---------------------------------------------------------------------------
test("[rev2] accidental injury 'accidentally cut myself chopping vegetables' → NOT classified", () => {
  assert.deepEqual(run("I accidentally cut myself chopping vegetables.").categories, []);
});
test("[rev2] intentional 'cutting myself on purpose' → self_harm sev2", () => {
  const c = run("I've been cutting myself on purpose.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.action_level, 2);
});
test("[rev2] suicide-thought 'keep thinking about killing myself' → self_harm sev3", () => {
  const c = run("I keep thinking about killing myself.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.action_level, 3);
});
test("[rev2] 'want to hurt myself' → self_harm sev2 (not auto-3)", () => {
  const c = run("Some days I want to hurt myself.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.action_level, 2);
});

// ---------------------------------------------------------------------------
// (3) Weapon terms are category-neutral; undetermined stays undetermined
// ---------------------------------------------------------------------------
test("[rev3] weapon + anaphoric intent → immediate, category UNDETERMINED (not defaulted)", () => {
  const c = run("I have the gun with me and I'm going to do it.");
  assert.equal(c.immediate_danger, true);
  assert.equal(c.action_level, 3);
  assert.equal(c.category_undetermined, true);
  assert.deepEqual(c.categories, []);              // NOT defaulted to self_harm or ipv
});
test("[rev3] weapon + partner threat → category from the finding (ipv), not the weapon", () => {
  const c = run("He has a gun and he's threatening me.");
  assert.equal(c.immediate_danger, true);
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.category_undetermined, false);
});

// ---------------------------------------------------------------------------
// (4) Removed over-broad immediacy patterns
// ---------------------------------------------------------------------------
test("[rev4] 'hiding my feelings' does NOT read as confinement/immediacy", () => {
  const c = run("I've been hiding my feelings from everyone.");
  assert.equal(c.immediate_danger, false);
  assert.deepEqual(c.categories, []);
});
test("[rev4] 'things are getting worse' does NOT escalate", () => {
  assert.equal(run("Things are getting worse between us.").immediate_danger, false);
});
test("[rev4] 'I just took my vitamins' is NOT an active-act signal", () => {
  assert.equal(run("I just took my vitamins and went to bed.").action_level, 0);
});

// ---------------------------------------------------------------------------
// (5) Atomic 'won't let me leave' + negation stays enabled generally
// ---------------------------------------------------------------------------
test("[rev5] 'he won't let me leave' → ipv confinement (atomic, not negation-suppressed)", () => {
  const c = run("He won't let me leave.");
  assert.deepEqual(c.categories, ["ipv"]);          // matched despite the internal "n't"
  assert.ok(c.findings.some((f) => f.actionable));  // NOT suppressed by negation
  // Confinement alone (a described pattern) is NOT immediate without a present cue.
  assert.equal(c.immediate_danger, false);
  assert.equal(c.action_level, 2);
});
test("[rev5] confinement escalates to immediate ONLY with a present-tense cue", () => {
  const now = run("He's here right now and won't let me leave.");
  assert.equal(now.immediate_danger, true);
  assert.equal(now.action_level, 3);
});
test("[rev5] negation still works elsewhere: 'he has never threatened me' → NOT classified", () => {
  assert.deepEqual(run("He has never threatened me.").categories, []);
});

// ---------------------------------------------------------------------------
// (6) Harm-to-others: explicit intent > bare reference
// ---------------------------------------------------------------------------
test("[rev6] bare 'I could just kill him' → sev1 (non-blocking), hyperbole-tolerant", () => {
  const c = run("Ugh, I could just kill him sometimes.");
  assert.deepEqual(c.categories, ["harm_to_others"]);
  assert.equal(c.action_level, 1);
});
test("[rev6] explicit 'I want to kill him' → harm_to_others sev3", () => {
  const c = run("I want to kill him.");
  assert.deepEqual(c.categories, ["harm_to_others"]);
  assert.equal(c.action_level, 3);
});
test("[rev6] explicit 'I'm about to hurt her' → harm_to_others + immediate", () => {
  const c = run("I'm about to hurt her.");
  assert.deepEqual(c.categories, ["harm_to_others"]);
  assert.equal(c.immediate_danger, true);
});

// ---------------------------------------------------------------------------
// (7) Sexual-consent common-language coverage
// ---------------------------------------------------------------------------
test("[rev7] 'I said no but they kept going' → sexual_coercion sev3", () => {
  const c = run("I said no but they kept going.");
  assert.deepEqual(c.categories, ["sexual_coercion"]);
  assert.equal(c.action_level, 3);
});
test("[rev7] 'he made me have sex' → sexual_coercion sev3", () => {
  assert.deepEqual(run("He made me have sex when I didn't want to.").categories, ["sexual_coercion"]);
});
test("[rev7] 'I was asleep when it happened' → sexual_coercion sev2 (deliberately not 3)", () => {
  const c = run("I was asleep when it happened.");
  assert.deepEqual(c.categories, ["sexual_coercion"]);
  assert.equal(c.action_level, 2);
});
test("[rev7] 'he wouldn't stop' → sexual_coercion sev1 (ambiguous)", () => {
  const c = run("He wouldn't stop.");
  assert.deepEqual(c.categories, ["sexual_coercion"]);
  assert.equal(c.action_level, 1);
});

// ---------------------------------------------------------------------------
// Negation, media, hypothetical, temporality, compound (regressions preserved)
// ---------------------------------------------------------------------------
test("negated IPV 'has never hit me' → NOT classified", () => {
  assert.deepEqual(run("He has never hit me.").categories, []);
});
test("negation reversal 'never hit me, but he actually did' → ipv", () => {
  assert.deepEqual(run("I used to say he never hit me, but he actually did.").categories, ["ipv"]);
});
test("per-clause 'wasn't abusing me, but he was hitting me' → ipv", () => {
  assert.deepEqual(run("I told myself he wasn't abusing me, but he was hitting me.").categories, ["ipv"]);
});
test("media 'movie where a husband hit his wife' → NOT user IPV", () => {
  assert.deepEqual(run("I watched a movie where a husband hit his wife.").categories, []);
});
test("media + personal 'saw it on TV and my husband does that to me' → ipv", () => {
  assert.deepEqual(run("I saw it on TV and realized my husband does that to me.").categories, ["ipv"]);
});
test("historical 'my ex used to choke me' → ipv, historical, not immediate", () => {
  const c = run("My ex used to choke me.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.immediate_danger, false);
  assert.equal(c.findings.find((f) => f.actionable)?.temporality, "historical");
});
test("historical + current threat → ipv + immediate", () => {
  const c = run("My ex hit me years ago and is outside my house threatening me now.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.immediate_danger, true);
});
test("compound 'threatened me and forced me to have sex' → ipv + sexual_coercion", () => {
  assert.deepEqual(cats("He threatened me and forced me to have sex."), ["ipv", "sexual_coercion"]);
});

// ---------------------------------------------------------------------------
// Immediacy combination rule
// ---------------------------------------------------------------------------
test("immediacy word alone 'my husband is here right now' → NOT classified", () => {
  const c = run("My husband is here right now.");
  assert.deepEqual(c.categories, []);
  assert.equal(c.immediate_danger, false);
  assert.equal(c.action_level, 0);
});
test("immediacy word alone 'we talked about this tonight' → NOT classified", () => {
  assert.equal(run("We talked about this tonight.").action_level, 0);
});
test("immediacy + risk 'here right now and won't let me leave' → ipv + immediate", () => {
  const c = run("My husband is here right now and won't let me leave.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.immediate_danger, true);
});
test("explicit 'hit me last night and afraid he's going to kill me' → ipv + immediate", () => {
  const c = run("My husband hit me last night and I'm afraid he's going to kill me.");
  assert.deepEqual(c.categories, ["ipv"]);
  assert.equal(c.immediate_danger, true);
  assert.equal(c.action_level, 3);
});
test("active act 'I already took the pills' → self_harm + immediate", () => {
  const c = run("I already took the pills.");
  assert.deepEqual(c.categories, ["self_harm"]);
  assert.equal(c.immediate_danger, true);
});
test("intent 'I'm about to kill myself' → self_harm + immediate", () => {
  const c = run("I'm about to kill myself.");
  assert.equal(c.immediate_danger, true);
  assert.ok(c.categories.includes("self_harm"));
});

// ---------------------------------------------------------------------------
// Absence ≠ safety; robustness; versioning
// ---------------------------------------------------------------------------
test("benign text → no_safety_signal_detected (level 0)", () => {
  const c = run("We had a really nice weekend together and talked about our goals.");
  assert.equal(c.action_level, 0);
  assert.deepEqual(c.categories, []);
  assert.equal(c.immediate_danger, false);
});
test("case + punctuation + curly apostrophes still match", () => {
  assert.deepEqual(run("HE HIT ME!!!").categories, ["ipv"]);
  assert.deepEqual(run("he   hit me").categories, ["ipv"]);
  assert.deepEqual(run("he won’t let me leave").categories, ["ipv"]); // curly apostrophe
});
test("classification carries engine + registry version", () => {
  const c = run("My husband hit me.");
  assert.equal(c.engine_version, "2.0.0");
  assert.equal(c.registry_version, "test-fixture");
});
