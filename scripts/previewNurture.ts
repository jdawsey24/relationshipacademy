// Renders the full 10-day post-Snapshot nurture to static HTML for owner sign-off
// BEFORE anything is sent to a real inbox. Uses REAL cluster content from the DB
// via the same varsFor() the sender uses — what you see is what sends.
//
// Run:  npm run preview:nurture
// Output: artifacts/nurture-preview/index.html (+ one file per email, per variant)
//
// Variants rendered:
//   • c15 primary + c23 secondary  — full sequence, playbook available
//   • c1  primary, no secondary    — secondary paragraph omitted (Day 4)
//   • c19 primary                  — no purchasable Playbook: degraded Days 6-8/10, Day 9 skipped

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

for (const line of readFileSync(join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

async function main() {
  const { SEQUENCE, varsFor } = await import("../lib/snapshot/nurture");

  const OUT = join(process.cwd(), "artifacts", "nurture-preview");
  mkdirSync(OUT, { recursive: true });

  const variants: { label: string; slug: string; primary: number; secondary: number | null }[] = [
    { label: "Cluster 15 (Feeling Seen) + secondary c23 — playbook available", slug: "c15", primary: 15, secondary: 23 },
    { label: "Cluster 1 (Flagship), no secondary", slug: "c1", primary: 1, secondary: null },
    { label: "Cluster 19 (Parenthood) — NO purchasable playbook (degrade path)", slug: "c19", primary: 19, secondary: null },
  ];

  const indexRows: string[] = [];
  for (const variant of variants) {
    const v = await varsFor({ id: "00000000-0000-0000-0000-000000000000", primary_cluster_id: variant.primary, secondary_cluster_id: variant.secondary });
    if (!v) { console.log(`!! no vars for ${variant.slug} (missing cluster content?)`); continue; }
    indexRows.push(`<h2 style="font-family:Arial;margin:24px 0 8px;">${variant.label}</h2>`);
    SEQUENCE.forEach((step, i) => {
      const day = i + 1;
      if (step.skip?.(v)) {
        indexRows.push(`<p style="font-family:Arial;color:#999;">Day ${day} — <em>skipped for this cluster (${step.key})</em></p>`);
        return;
      }
      const { html, text } = step.body(v);
      const f = `${variant.slug}-day${String(day).padStart(2, "0")}.html`;
      writeFileSync(join(OUT, f), html);
      writeFileSync(join(OUT, f.replace(/\.html$/, ".txt")), `Subject: ${step.subject(v)}\nPreview: ${step.preview}\n\n${text}`);
      indexRows.push(`<p style="font-family:Arial;"><a href="${f}">Day ${day}</a> — <strong>${step.subject(v)}</strong> <span style="color:#888;">· ${step.preview}</span></p>`);
    });
    console.log(`rendered variant ${variant.slug}: "${v.resultTitle}" (playbook ${v.playbookAvailable ? `available: ${v.playbookSubtitle}` : "NOT available — degrade path"})`);
  }

  writeFileSync(join(OUT, "index.html"), `<!doctype html><meta charset="utf-8"><title>Nurture preview</title><body style="max-width:720px;margin:32px auto;">
    <h1 style="font-family:Arial;">10-day post-Snapshot nurture — preview</h1>
    <p style="font-family:Arial;color:#666;">Rendered from live cluster content via the sender's own varsFor(). Approve before enabling.</p>
    ${indexRows.join("\n")}</body>`);
  console.log(`\nWrote preview to ${OUT}/index.html`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
