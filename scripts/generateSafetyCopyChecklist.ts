/**
 * Regenerate the safety-copy clinical review checklist from the LIVE content.
 *
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/generateSafetyCopyChecklist.ts)
 *
 * Writes artifacts/playbook/safety-copy-review-checklist.md.
 *
 * GENERATED — never hand-edit the output. When the corpus changes, re-run this;
 * the `id` on each item is the authoritative anchor for applying the owner's
 * decisions back into content/playbook/.
 *
 * Ordered by REVIEW LEVERAGE, not by playbook:
 *   §1 SHARED  — copy reused across many Playbooks. Reviewing the crisis
 *                escalation block once covers every signpost that interpolates
 *                it, which is the single highest-value decision in the file.
 *   §2 P1..P5  — per-item, crisis-first, as before.
 *
 * Signpost bodies that embed the shared crisis block print it as a marker
 * («CRISIS_ESCALATION — reviewed once in §1») rather than repeating ~90 words
 * twenty times, so the reviewer sees what is actually unique to each item.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { listPlaybookKeys, getPlaybookContent } from "../content/playbook";
import { CRISIS_ESCALATION } from "../content/playbook/shared/safety-not-safe";
import type { LiteratureEntry, PlaybookContent } from "../lib/playbook/contentSchema";

const OUT = "artifacts/playbook/safety-copy-review-checklist.md";
const DECISIONS = "artifacts/playbook/safety-copy-decisions.json";
const CRISIS_MARKER = "«CRISIS_ESCALATION — reviewed once in §1»";

type Tier = "P1" | "P2" | "P3" | "P4" | "P5";
const TIER_LABEL: Record<Tier, string> = {
  P1: "P1 — Crisis / mental-health escalation",
  P2: "P2 — Safety, abuse, coercive control",
  P3: "P3 — Bereavement and grief",
  P4: "P4 — Other support signposts",
  P5: "P5 — Scope redirects (out-of-scope referrals)",
};

interface Item {
  id: string;
  tier: Tier;
  type: string;
  heading: string;
  copy: string;
  locations: string[];      // "playbookKey · play <slug>" etc — shared items list all
  embedsCrisis: boolean;
}

/** Keyword tiering. Crisis wins over everything; scope redirects are the weakest. */
function tierFor(text: string): Tier {
  const t = text.toLowerCase();
  if (/suicid|harming yourself|stay safe|crisis service|emergency|988|don't want to keep living|not able to stay safe/.test(t)) return "P1";
  if (/depress|mental health|gp or another healthcare|therapist|counsell?or|professional support/.test(t)) return "P1";
  if (/abuse|coerciv|controll|afraid of|threaten|hurt you|violence|not safe/.test(t)) return "P2";
  if (/griev|bereave|died|death|loss of|passed away|widow|funeral/.test(t)) return "P3";
  if (/this playbook (isn't|is not)|beyond what|out of scope|different kind of help|not the right/.test(t)) return "P5";
  return "P4";
}

/**
 * Flatten a literature entry to reviewable prose.
 *
 * NOTE: every block variant carries its prose in a string ARRAY (`body` on
 * paragraph/distinction/example/guardrail, `items` on list) with only the
 * heading/label as a bare string. Reading just the strings yields headings and
 * loses the copy — which is exactly what the reviewer needs to see.
 */
function literatureText(l: LiteratureEntry): string {
  return l.body
    .map((b) => {
      const rec = b as unknown as Record<string, unknown>;
      const label = [rec.heading, rec.label].find((x): x is string => typeof x === "string");
      const lines = [rec.body, rec.items]
        .filter((x): x is string[] => Array.isArray(x))
        .flat()
        .filter((x): x is string => typeof x === "string");
      return [label ? `**${label}**` : null, ...lines].filter(Boolean).join("\n\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

function withMarker(copy: string): { copy: string; embedsCrisis: boolean } {
  if (CRISIS_ESCALATION && copy.includes(CRISIS_ESCALATION.trim())) {
    return { copy: copy.replace(CRISIS_ESCALATION.trim(), CRISIS_MARKER), embedsCrisis: true };
  }
  return { copy, embedsCrisis: false };
}

function collect(): { shared: Item[]; perItem: Item[] } {
  // Keyed by id so copy reused across Playbooks is reviewed ONCE, with every
  // consuming Playbook listed — that's the whole point of the shared section.
  const byId = new Map<string, Item>();

  const add = (partial: Omit<Item, "tier" | "embedsCrisis" | "locations"> & { raw: string; location: string }) => {
    const existing = byId.get(partial.id);
    if (existing) {
      if (!existing.locations.includes(partial.location)) existing.locations.push(partial.location);
      return;
    }
    const { copy, embedsCrisis } = withMarker(partial.copy);
    byId.set(partial.id, {
      id: partial.id,
      tier: tierFor(partial.raw),
      type: partial.type,
      heading: partial.heading,
      copy,
      locations: [partial.location],
      embedsCrisis,
    });
  };

  for (const key of listPlaybookKeys()) {
    const c: PlaybookContent | null = getPlaybookContent(key);
    if (!c) continue;

    for (const card of c.recognitionCards ?? []) {
      if (card.role !== "signpost") continue;
      const raw = [card.headline, card.explanation, card.validationCopy].filter(Boolean).join("\n\n");
      add({ id: card.id, type: "recognition card (role=signpost)", heading: card.headline, copy: raw, raw, location: key });
    }

    for (const play of c.plays ?? []) {
      for (const sp of play.supportSignposts ?? []) {
        const raw = `${sp.heading}\n\n${sp.body}`;
        add({ id: sp.id, type: "in-play support signpost", heading: sp.heading, copy: sp.body, raw, location: `${key} · play \`${play.playId}\`` });
      }
    }

    for (const lit of c.literature ?? []) {
      const text = literatureText(lit);
      const raw = `${lit.title}\n\n${text}`;
      // Skip ordinary teaching copy — EXCEPT in bereavement/loss material, where
      // the whole entry is grief copy even when no single sentence trips a
      // keyword ("companionship", "are you ready", "what this is"). Dropping
      // those is how the previous checklist lost 5 items it should have carried.
      const griefContext = /bereave|griev|loss|losing/i.test(`${lit.id} ${key}`);
      if (!griefContext && tierFor(raw) === "P4" && !/safe|crisis|support|help/i.test(lit.title)) continue;
      // Floor grief material at P3 so it sorts with the rest of the bereavement
      // review rather than trailing in the general pile.
      const raw3 = griefContext && tierFor(raw) === "P4" ? `${raw}\nbereavement` : raw;
      add({ id: lit.id, type: `safety literature (scope=${lit.scope})`, heading: lit.title, copy: text, raw: raw3, location: key });
    }
  }

  const all = [...byId.values()];
  const shared = all.filter((i) => i.locations.length > 1);
  const perItem = all.filter((i) => i.locations.length === 1);
  const order: Tier[] = ["P1", "P2", "P3", "P4", "P5"];
  const sort = (a: Item, b: Item) => order.indexOf(a.tier) - order.indexOf(b.tier) || a.id.localeCompare(b.id);
  return { shared: shared.sort(sort), perItem: perItem.sort(sort) };
}

interface Decision { status?: string; by?: string; date?: string; note?: string }

/**
 * Sign-off lives in its own hand-maintained file, NOT in the generated markdown —
 * otherwise regenerating the checklist would silently erase decisions the owner
 * has already made. Merged in here so the checklist always shows current state.
 */
function loadDecisions(): Record<string, Decision> {
  if (!existsSync(DECISIONS)) return {};
  try {
    const raw = JSON.parse(readFileSync(DECISIONS, "utf8")) as Record<string, unknown>;
    delete raw._README;
    return raw as Record<string, Decision>;
  } catch {
    return {};
  }
}

let DECIDED: Record<string, Decision> = {};

function decisionLines(id: string): string[] {
  const d = DECIDED[id];
  if (d?.status === "approved") {
    return [`- [x] **Signed off** — ${d.by ?? "owner"}, ${d.date ?? "date not recorded"}`];
  }
  if (d?.status === "changes_requested") {
    return [`- [ ] **Changes requested** — ${d.by ?? "owner"}, ${d.date ?? "date not recorded"}`];
  }
  return ["- [ ] Final sign-off"];
}

function renderItem(n: number, item: Item): string {
  const where = item.locations.length > 1
    ? `*Used in ${item.locations.length} Playbooks:* ${item.locations.map((l) => `\`${l}\``).join(", ")}`
    : `*Location:* ${item.locations[0]}`;
  return [
    `### ${n}. \`${item.id}\`  ·  ${item.tier}`,
    ``,
    ...decisionLines(item.id),
    `- *Type:* ${item.type}`,
    `- ${where}`,
    item.embedsCrisis ? `- *Embeds the shared crisis block* (see §1)` : null,
    ``,
    `> **${item.heading}**`,
    `>`,
    ...item.copy.split("\n").filter(Boolean).map((line) => `> ${line}`),
    ``,
    `**Decision:** ${DECIDED[item.id]?.note ?? ""}`,
    ``,
  ].filter((x) => x !== null).join("\n");
}

function main() {
  DECIDED = loadDecisions();
  const { shared, perItem } = collect();
  const crisisUsers = [...shared, ...perItem].filter((i) => i.embedsCrisis).length;
  const total = shared.length + perItem.length + 1; // +1 for the crisis block itself

  const out: string[] = [];
  out.push(`# Playbook safety copy — clinical review checklist`);
  out.push(``);
  out.push(`**GENERATED — do not hand-edit.** Re-run \`scripts/generateSafetyCopyChecklist.ts\` after any content change.`);
  out.push(`Generated from the live corpus: ${listPlaybookKeys().length} Playbooks.`);
  out.push(``);
  out.push(`Reviewer: the owner (LMFT). The \`id\` on each item is the authoritative anchor — mark **Decision:**`);
  out.push(`inline, then edit \`content/playbook/\` by id and re-run \`validatePlaybookContent\` + \`npm test\`.`);
  out.push(``);
  out.push(`**${total} items.** Ordered by review leverage, then crisis-first.`);
  out.push(``);
  out.push(`---`);
  out.push(``);
  out.push(`## §1 — Shared copy (review once, applies everywhere)`);
  out.push(``);
  out.push(`Highest-value decisions in this file. Each block below is written in ONE place and reused, so a`);
  out.push(`single sign-off covers every Playbook that pulls it in.`);
  out.push(``);

  // The crisis escalation block is item 1 — it is the highest-risk language in
  // the corpus and it is interpolated into every crisis signpost.
  out.push(`### 1. \`CRISIS_ESCALATION\` (shared constant)  ·  P1`);
  out.push(``);
  out.push(...decisionLines("CRISIS_ESCALATION"));
  out.push(`- *Type:* shared crisis-escalation block`);
  out.push(`- *Source:* \`content/playbook/shared/safety-not-safe.ts\``);
  out.push(`- *Interpolated into ${crisisUsers} signpost(s)/entries across the corpus* — reviewing this once covers all of them.`);
  out.push(``);
  out.push(...CRISIS_ESCALATION.trim().split("\n").filter(Boolean).map((l) => `> ${l}`));
  out.push(``);
  out.push(`**Decision:** ${DECIDED["CRISIS_ESCALATION"]?.note ?? ""}`);
  out.push(``);

  let n = 2;
  for (const item of shared) out.push(renderItem(n++, item));

  out.push(`---`);
  out.push(``);
  out.push(`## §2 — Per-Playbook items`);
  out.push(``);
  let currentTier: Tier | null = null;
  for (const item of perItem) {
    if (item.tier !== currentTier) {
      currentTier = item.tier;
      out.push(`## ${TIER_LABEL[item.tier]}`);
      out.push(``);
    }
    out.push(renderItem(n++, item));
  }

  mkdirSync("artifacts/playbook", { recursive: true });
  writeFileSync(OUT, out.join("\n"));

  const tiers = [...shared, ...perItem].reduce<Record<string, number>>((acc, i) => { acc[i.tier] = (acc[i.tier] ?? 0) + 1; return acc; }, {});
  console.log(`Wrote ${OUT}`);
  console.log(`  ${total} items — ${shared.length} shared, ${perItem.length} per-Playbook, +1 crisis constant`);
  console.log(`  crisis block is interpolated into ${crisisUsers} item(s)`);
  const signed = Object.values(DECIDED).filter((d) => d.status === "approved").length;
  console.log(`  by tier: ${JSON.stringify(tiers)}`);
  console.log(`  signed off: ${signed}/${total}`);
}

main();
