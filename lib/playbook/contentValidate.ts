// Structural validation of authored Playbook content. Used by tests (and available
// for a dev-time check) to guarantee every content module conforms to the schema.

import type { PlaybookContent, Play, Screen } from "@/lib/playbook/contentSchema";

const SCREEN_KINDS = new Set<Screen["kind"]>([
  "shift",
  "literature",
  "learn",
  "scenarioSort",
  "ownTurn",
  "sufficiency",
  "ruleBuilder",
  "sentenceBuilder",
  "emotionBeat",
  "output",
  "portable",
  "realWorldUse",
]);

function validatePlay(play: Play, errors: string[]) {
  const where = `play "${play.playId || "(no id)"}"`;
  if (!play.playId) errors.push(`${where}: missing playId`);
  if (!(play.playVersion >= 1)) errors.push(`${where}: playVersion must be >= 1`);
  if (!(play.outputSchemaVersion >= 1)) errors.push(`${where}: outputSchemaVersion must be >= 1`);
  if (!play.name) errors.push(`${where}: missing name`);
  if (!play.recognitionGate?.prompt) errors.push(`${where}: missing recognitionGate.prompt`);
  if (!Array.isArray(play.screens) || play.screens.length === 0) errors.push(`${where}: no screens`);

  const t = play.myPlaysTemplate;
  for (const f of ["when", "move", "lookingFor", "watchOut", "remember"] as const) {
    if (!t || !t[f]) errors.push(`${where}: myPlaysTemplate.${f} missing`);
  }
  if (!play.fidelity?.correct) errors.push(`${where}: fidelity.correct missing`);
  if (!Array.isArray(play.fidelity?.misuse) || play.fidelity.misuse.length === 0) errors.push(`${where}: fidelity.misuse empty`);
  if (!play.fidelity?.notMeaning) errors.push(`${where}: fidelity.notMeaning missing`);
  if (!Array.isArray(play.portable) || play.portable.length === 0) errors.push(`${where}: portable empty`);

  const hasOutput = play.screens.some((s) => s.kind === "output");
  if (!hasOutput) errors.push(`${where}: no "output" screen (no executable output)`);

  play.screens.forEach((s, i) => {
    if (!SCREEN_KINDS.has(s.kind)) errors.push(`${where}: screen[${i}] unknown kind "${(s as { kind: string }).kind}"`);
    if (s.kind === "scenarioSort") {
      if (s.buckets.length < 2) errors.push(`${where}: screen[${i}] sort needs >= 2 buckets`);
      const bucketIds = new Set(s.buckets.map((b) => b.id));
      s.items.forEach((it) => {
        if (it.correctBucket && !bucketIds.has(it.correctBucket)) {
          errors.push(`${where}: screen[${i}] item "${it.id}" correctBucket "${it.correctBucket}" not a bucket`);
        }
      });
    }
  });
}

/** Returns a list of structural errors ([] = valid). */
export function validatePlaybookContent(content: PlaybookContent): string[] {
  const errors: string[] = [];
  if (!content.playbookKey) errors.push("missing playbookKey");
  if (!(content.playbookVersion >= 1)) errors.push("playbookVersion must be >= 1");
  if (!content.opening?.title || !Array.isArray(content.opening?.body)) errors.push("opening malformed");

  const playIds = new Set(content.plays.map((p) => p.playId));
  const seen = new Set<string>();
  for (const p of content.plays) {
    if (seen.has(p.playId)) errors.push(`duplicate playId "${p.playId}"`);
    seen.add(p.playId);
    validatePlay(p, errors);
    if (p.routing && !playIds.has(p.routing.toPlayId)) {
      errors.push(`play "${p.playId}": routing.toPlayId "${p.routing.toPlayId}" is not a built play`);
    }
  }

  // Recognition cards: role='route' must reference SOME pathway id (built or not);
  // role='validate'/'signpost' must not route.
  for (const c of content.recognitionCards) {
    if (c.role === "route" && !c.pathwayPlayId) errors.push(`recognition "${c.id}": route card without pathwayPlayId`);
    if (c.role !== "route" && c.pathwayPlayId) errors.push(`recognition "${c.id}": non-route card should not route`);
    if (!c.headline) errors.push(`recognition "${c.id}": missing headline`);
  }
  return errors;
}
