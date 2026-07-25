/*
 * Author the educational notes for the 16 Recovery–Renewal draft experiences,
 * GROUNDED IN the RLC Framework Manual (Ch.6 Recovery / Ch.7 Renewal). Each note
 * ties the situation to its phase + developmental task (Healing→Recovery,
 * Reengagement→Renewal) using the manual's own principles — nothing invented.
 * Updates the educational_note block payload on each scaffold experience.
 * Experiences remain status="draft" → owner reviews (theory/safety ladder) before publishing.
 *   (set -a; . ./.env.local; set +a; node scripts/authorRecoveryRenewalNotes.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Grounded in RLC Framework Manual — Ch.6 Recovery (Healing) / Ch.7 Renewal (Reengagement).
const NOTES = {
  "RS-0001": "In the Relationship Life Cycle, healing — the work of Recovery — comes before reengaging with dating, and it isn't meant to be rushed. Recovery begins only once reality has been accepted, and it was never designed to be hurried past. Not being ready isn't falling behind; it's Recovery doing its work. You're allowed to stay here until healing has progressed enough that possibility naturally reemerges.",
  "RS-0003": "Recovery is not about forgetting. Healthy healing means learning to carry the experience without letting it carry you — and in this framework, healing and pain often coexist. Still thinking about a former partner doesn't mean you've done something wrong or stalled; the impact, the memories, and the grief can remain even as you rebuild. Recovery isn't measured by the absence of pain, but by your growing ability to live and grow alongside it.",
  "RS-0004": "In the Relationship Life Cycle, Recovery begins once reality has been accepted — and closure is part of that acknowledgment, not something you have to receive from the other person. Healing isn't erasing the relationship or pretending it didn't matter; it's learning to carry what happened without being carried by it. The work here is less about a final answer and more about making enough peace with reality that you can move forward.",
  "RS-0006": "Recovery is not only about loss — it's a phase of reconstruction. As the routines, roles, and identity tied to the relationship fall away, Recovery opens new questions: Who am I now? What parts of myself are emerging? Learning to be on your own isn't an empty gap between relationships; it's the rebuilding work of this phase, where you begin to feel whole on your own terms.",
  "RS-0008": "This framework recognizes that Recovery often means grieving far more than a person — it can mean grieving the future you imagined, the identity you held, and the life you expected. That loss is real, even when no one else can see it. Healing here isn't erasing the dream; it's letting yourself mourn it honestly, so that in time you can want and build again in a new way.",
  "RS-0009": "Recovery is a phase of reconstruction, not only loss. A hard ending can shake the identity you held — but the Relationship Life Cycle treats this as the ground where a new sense of self emerges: what needs healing, and what is beginning to emerge. Rebuilding confidence isn't returning to who you were before; it's discovering who you're becoming, and letting your worth rest on that rather than on how the relationship ended.",
  "RS-0002": "In the Relationship Life Cycle, Renewal is not starting over and it is not a race. You don't return to who you were before — Renewal is an evolution, not a reset, and it carries no external timeline to fall behind on. Feeling 'off schedule' usually reflects someone else's clock, not the actual work of this phase: turning back toward life at your own pace, carrying what you've learned.",
  "RS-0005": "Renewal means moving forward carrying the wisdom of the past — not erasing it, and not simply returning to what was. This framework frames reengagement as a decision to engage possibility, made from who you are now rather than who you were before the ending. Whether reconnecting is renewal or repetition depends on whether it lets you move forward with that wisdom, or asks you to set it aside.",
  "RS-0007": "The goal of Renewal is to move forward carrying the wisdom of the past — and that growth becomes one of your greatest resources. Noticing a recurring pattern is exactly that wisdom surfacing. In the Relationship Life Cycle, reengaging well isn't repeating who you were; it's letting what you've learned reshape what you choose.",
  "RS-0010": "In the Relationship Life Cycle, Renewal is not primarily about finding another relationship — it's about reengaging with life: purpose, friendship, community, creativity, growth. Healthy Renewal is not dependent on another person. A full, contented single season isn't a waiting room; it's Renewal itself — participating in life again, on your own terms.",
  "RS-0011": "The central question of Renewal is 'How do I fully live again?' — and reengagement begins with a decision to engage possibility, not with a deadline. In this framework, dating can be part of Renewal but isn't its definition. Readiness is less about how much time has passed and more about whether you're turning toward life from a place of healing, rather than from loneliness or pressure.",
  "RS-0012": "The Relationship Life Cycle is clear that Renewal requires courage — not the absence of fear, but the willingness to move forward despite it. Most people enter Renewal still carrying uncertainty about rejection, vulnerability, and loss. The sign of healing isn't that fear disappears; it's that fear no longer makes every decision — that you can trust, hope, and try again even while afraid.",
  "RS-0014": "Renewal is an evolution, not a reset — you move forward carrying the wisdom of the past. Wanting to date differently is that wisdom becoming a plan. In the Relationship Life Cycle, the person entering Renewal is not who they were before; letting what you've learned reshape your choices is exactly the developmental work of this phase.",
  "RS-0016": "Renewal is the process of reengaging with life — not only dating, but participating again: community, friendship, shared interests, everyday connection. This framework locates possibility in turning back toward life broadly, not in any single channel. Meeting people offline is simply one way of doing the real work of Renewal: showing up to life again.",
  "RS-0017": "Renewal means carrying the wisdom of the past forward — and that growth is one of your greatest resources. Worrying you'll miss the signs usually means you've already learned to take them seriously. In the Relationship Life Cycle, you don't reengage as the person you were before; trusting what you now notice is that hard-won wisdom at work.",
  "RS-0019": "In the Relationship Life Cycle, healthy Renewal is not dependent on another person — it begins with your own decision to engage possibility. Reengagement is broader than dating, and it is yours to choose; pressure from others isn't the same as readiness. Renewal asks what turning toward life looks like for you, not what anyone else expects of you.",
};

async function main() {
  const ids = Object.keys(NOTES);
  const { data: exps } = await sb.from("companion_experiences").select("id,situation_id,status").eq("owner", "scaffold").in("situation_id", ids);
  let updated = 0;
  for (const e of exps ?? []) {
    if (e.status !== "draft") { console.log(`${e.situation_id}: not draft (${e.status}) — skip`); continue; }
    const note = NOTES[e.situation_id];
    const { data: blk } = await sb.from("companion_experience_blocks").select("id").eq("experience_id", e.id).eq("block_type", "educational_note").maybeSingle();
    if (!blk) { console.log(`${e.situation_id}: no educational_note block — skip`); continue; }
    const { error } = await sb.from("companion_experience_blocks").update({ payload: { text: note } }).eq("id", blk.id);
    if (error) { console.log(`${e.situation_id}: update failed — ${error.message}`); continue; }
    await sb.from("companion_experiences").update({
      canonical_source_ref: "RLC Framework Manual — Ch.6 Recovery / Ch.7 Renewal",
      internal_notes: "Reflective blocks framework-neutral (grounded in situation need/definition). Educational note authored from the Framework Manual (Recovery/Renewal chapters). Still DRAFT — pending owner theory/safety review before publishing.",
    }).eq("id", e.id);
    console.log(`${e.situation_id}: ✅ educational note authored (${note.length} chars)`);
    updated++;
  }
  console.log(`\n✓ ${updated}/${ids.length} educational notes authored from the manual. All still DRAFT.`);
}
main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
