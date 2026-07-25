/*
 * Publish RS-0057 (Questioning Whether to Stay Married) + RS-0058 (Considering
 * Separation): owner-directed un-hold. Done CORRECTLY — the existing
 * published_version=1 snapshot is stale PLACEHOLDER content, so this snapshots the
 * current live blocks (owner-authored + the safety educational_note) into a fresh
 * version, points published_version at it, sets experience status=published, and
 * sets the situation publication_status=Published.
 *
 * NOTE: the Companion feature flag is OFF, so these become live-ELIGIBLE only —
 * no member can reach them until the whole Companion is enabled (attorney review
 * pending). Reversible. Runtime safety detection applies to all free-text.
 *   (set -a; . ./.env.local; set +a; node scripts/publishMarriageSituations.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd()+"/.env.local","utf8").split("\n")){const m=line.match(/^([A-Z0-9_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});

for (const sid of ["RS-0057","RS-0058"]) {
  const { data: e } = await sb.from("companion_experiences").select("id,slug,status").eq("situation_id", sid).maybeSingle();
  if (!e) { console.log(`${sid}: no experience — skip`); continue; }
  // 1. snapshot current live blocks
  const { data: live } = await sb.from("companion_experience_blocks").select("block_type,block_order,payload,conditional_on").eq("experience_id", e.id).order("block_order");
  const snapshot = live.map((b) => ({ type: b.block_type, order: b.block_order, payload: b.payload, conditional_on: b.conditional_on ?? null }));
  // guard: never publish placeholder content
  const bad = JSON.stringify(snapshot).match(/TO BE PROVIDED|TO AUTHOR/i);
  if (bad) { console.log(`${sid}: ABORT — snapshot still contains placeholders`); continue; }
  // 2. next version number
  const { data: vers } = await sb.from("companion_experience_versions").select("version_no").eq("experience_id", e.id).order("version_no", { ascending: false }).limit(1);
  const nextVer = ((vers?.[0]?.version_no) ?? 0) + 1;
  const { error: vErr } = await sb.from("companion_experience_versions").insert({ experience_id: e.id, version_no: nextVer, blocks: snapshot, authored_by: "publish" });
  if (vErr) { console.log(`${sid}: version snapshot failed — ${vErr.message}`); continue; }
  // 3. publish the experience against the fresh snapshot
  const { error: eErr } = await sb.from("companion_experiences").update({ status: "published", published_version: nextVer, current_version: nextVer }).eq("id", e.id);
  if (eErr) { console.log(`${sid}: experience publish failed — ${eErr.message}`); continue; }
  // 4. publish the situation
  const { error: sErr } = await sb.from("reg_situations").update({ publication_status: "Published" }).eq("situation_id", sid);
  if (sErr) { console.log(`${sid}: situation publish failed — ${sErr.message}`); continue; }
  console.log(`${sid}: ✅ PUBLISHED — experience v${nextVer} (${snapshot.length} real blocks), situation Published`);
}
console.log("\nReminder: Companion flag is OFF → live-eligible only, no member exposure yet. Reversible.");
