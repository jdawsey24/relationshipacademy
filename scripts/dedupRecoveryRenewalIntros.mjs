/*
 * De-dup pass: the intro_context blocks were restating the educational_note's
 * RLC principle. Rewrite each intro as a warm, EXPERIENTIAL invitation (meets the
 * person where they are, no framework jargon) so the educational note (block 3)
 * remains the single teaching moment. Only block 0 + short_description change;
 * reflections / educational note / closing are untouched. Still DRAFT.
 *   (set -a; . ./.env.local; set +a; node scripts/dedupRecoveryRenewalIntros.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const INTRO = {
  "RS-0001": "There's no clock on this. Take a few quiet minutes to notice where you actually are with dating right now — honestly, and without any pressure to be somewhere else.",
  "RS-0002": "The sense of being “behind” can sit heavy. This is a space to set the comparisons down for a few minutes and look at what's actually true for your life.",
  "RS-0003": "Someone can stay on your mind long after things end. This is a space to look, gently and without judgment, at what still holds your attention.",
  "RS-0004": "The wish for closure can ache. Take a few minutes here to work toward your own peace with how things ended — at your own pace.",
  "RS-0005": "A door reopening can stir up a lot at once. This is a space to slow down and think it through clearly, before history or feeling answers for you.",
  "RS-0006": "Being on your own is its own kind of learning, and you're allowed to be new at it. Take a few minutes to notice what steadies you when it's just you.",
  "RS-0007": "Noticing a pattern is the hard part, and you've already done it. This is a space to look at what keeps drawing you in — with curiosity, not blame.",
  "RS-0008": "Some of the heaviest grief is for a future that never got to happen. That loss is real, even when no one else can see it. This is a space to honor it.",
  "RS-0009": "A hard ending can shake how you see yourself. Take a few minutes here to begin separating what happened to you from what's actually true about you.",
  "RS-0010": "Contentment on your own is worth protecting, not explaining away. This is a space to name what's genuinely good about this season of your life.",
  "RS-0011": "“Ready” is worth getting honest about — for you, not for anyone else's timeline. Take a few minutes to tell the difference between ready and simply restless.",
  "RS-0012": "Wanting connection and fearing it can live in you at the same time. This is a space to hold both — the caution and the wanting — without having to resolve them yet.",
  "RS-0014": "Wanting to do it differently is a good instinct. Take a few minutes to turn that intention into something specific you can carry into how you date.",
  "RS-0016": "Meeting people offline can feel harder than it should. This is a space to think about where connection could realistically happen in your everyday life.",
  "RS-0017": "Worrying you'll miss the signs usually means you're ready to take them seriously. This is a space to rebuild trust in your own judgment.",
  "RS-0019": "If dating feels more like an assignment than a desire, that's worth pausing on. Take a few minutes to sort out whose choice this actually is.",
};

async function main() {
  const ids = Object.keys(INTRO);
  const { data: exps } = await sb.from("companion_experiences").select("id,situation_id,status").eq("owner", "scaffold").in("situation_id", ids);
  let updated = 0;
  for (const e of exps ?? []) {
    if (e.status !== "draft") { console.log(`${e.situation_id}: not draft — skip`); continue; }
    const intro = INTRO[e.situation_id];
    const { error: bErr } = await sb.from("companion_experience_blocks")
      .update({ payload: { text: intro } }).eq("experience_id", e.id).eq("block_order", 0);
    if (bErr) { console.log(`${e.situation_id}: intro update failed — ${bErr.message}`); continue; }
    await sb.from("companion_experiences").update({ short_description: intro }).eq("id", e.id);
    console.log(`${e.situation_id}: ✅ intro rewritten (experiential; no longer echoes the educational note)`);
    updated++;
  }
  console.log(`\n✓ ${updated}/${ids.length} intros de-duplicated. Educational notes now the single teaching moment. All DRAFT.`);
}
main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
