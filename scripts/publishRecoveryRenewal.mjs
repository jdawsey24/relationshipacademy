/*
 * Owner-directed publish of the 16 Recovery–Renewal experiences (owner="scaffold").
 * Step 1: apply the one recommended polish — de-dup the closing_summary vs the
 *   educational note on the four flagged (RS-0001/0003/0006/0010); editorial only.
 * Step 2: publish each — snapshot current live blocks into a fresh version, set
 *   experience status=published + published_version, set situation Published.
 * Guard aborts on any placeholder. Companion flag OFF → live-eligible only.
 *   (set -a; . ./.env.local; set +a; node scripts/publishRecoveryRenewal.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd()+"/.env.local","utf8").split("\n")){const m=line.match(/^([A-Z0-9_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});

const NEW_CLOSING = {
  "RS-0001": "Whatever you noticed today is enough. There's no timeline you owe anyone — come back whenever you want to check in with yourself again.",
  "RS-0003": "Be patient with yourself here — this kind of thing eases in its own time, not on command. Come back whenever you need to.",
  "RS-0006": "Whoever you're becoming on your own is worth getting to know. There's no rush to be anywhere but here. Come back whenever you want to.",
  "RS-0010": "This season is yours to enjoy, not to justify. Protect what's good in it — and come back whenever you want to.",
};

const { data: exps } = await sb.from("companion_experiences").select("id,situation_id,slug,status").eq("owner", "scaffold");
exps.sort((a,b)=>a.situation_id.localeCompare(b.situation_id));

// Step 1: polish the four closings
for (const [sid, text] of Object.entries(NEW_CLOSING)) {
  const e = exps.find(x => x.situation_id === sid);
  const { error } = await sb.from("companion_experience_blocks").update({ payload: { text } }).eq("experience_id", e.id).eq("block_order", 6);
  console.log(`${sid}: closing polished ${error ? "FAILED "+error.message : "✓"}`);
}

// Step 2: publish all 16
let published = 0;
for (const e of exps) {
  const { data: live } = await sb.from("companion_experience_blocks").select("block_type,block_order,payload,conditional_on").eq("experience_id", e.id).order("block_order");
  const snapshot = live.map(b => ({ type: b.block_type, order: b.block_order, payload: b.payload, conditional_on: b.conditional_on ?? null }));
  if (JSON.stringify(snapshot).match(/TO BE PROVIDED|TO AUTHOR/i)) { console.log(`${e.situation_id}: ABORT — placeholder present`); continue; }
  const { data: vers } = await sb.from("companion_experience_versions").select("version_no").eq("experience_id", e.id).order("version_no", { ascending: false }).limit(1);
  const nextVer = ((vers?.[0]?.version_no) ?? 0) + 1;
  const { error: vErr } = await sb.from("companion_experience_versions").insert({ experience_id: e.id, version_no: nextVer, blocks: snapshot, authored_by: "publish" });
  if (vErr) { console.log(`${e.situation_id}: version failed — ${vErr.message}`); continue; }
  const { error: eErr } = await sb.from("companion_experiences").update({ status: "published", published_version: nextVer, current_version: nextVer }).eq("id", e.id);
  if (eErr) { console.log(`${e.situation_id}: exp publish failed — ${eErr.message}`); continue; }
  const { error: sErr } = await sb.from("reg_situations").update({ publication_status: "Published" }).eq("situation_id", e.situation_id);
  if (sErr) { console.log(`${e.situation_id}: situation publish failed — ${sErr.message}`); continue; }
  console.log(`${e.situation_id}: ✅ PUBLISHED v${nextVer} (${snapshot.length} blocks)`);
  published++;
}
const { count } = await sb.from("reg_situations").select("*", { count: "exact", head: true }).eq("publication_status", "Published");
console.log(`\n✓ ${published}/16 published. Total Published situations now: ${count}. Companion flag OFF → live-eligible only.`);
