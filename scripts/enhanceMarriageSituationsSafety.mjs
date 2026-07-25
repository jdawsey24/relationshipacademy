/*
 * RS-0057 (Questioning Whether to Stay Married) + RS-0058 (Considering Separation)
 * already have owner-authored, autonomy-preserving draft experiences. They were
 * HELD for the clinical-safety layer (now live). Their only gap: no safety carve-out
 * and no professional-support pointer — the exact element the hold was about.
 *
 * This ADDITIVELY inserts one educational_note (grounded in the canonical Expiration/
 * Acceptance phase + the resolved competency — Agency / Role Transition) that also
 * carries the safety carve-out ("abuse is not ordinary difficulty; your safety comes
 * first") + a nudge to professional (clinical/legal/financial) support. It preserves
 * every existing owner-authored block (shifts the last two down by one to make room),
 * sets safety_classification, and keeps status=draft. Idempotent (skips if an
 * educational_note already exists). Owner does final clinical+safety review + publish.
 *   (set -a; . ./.env.local; set +a; node scripts/enhanceMarriageSituationsSafety.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd()+"/.env.local","utf8").split("\n")){const m=line.match(/^([A-Z0-9_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});

const NOTE = {
  "RS-0057": "In the Relationship Life Cycle, a question like this belongs to the work of Acceptance — seeing clearly what is actually happening, rather than what you wish were true or fear might be. The aim isn't to decide for or against the marriage; it's Agency: making intentional choices within reality, identifying your real options instead of feeling trapped, and acting in line with your values. This tool can't tell you whether to stay or go, and a decision this large deserves real support — individual or couples counseling, and legal or financial guidance as needed. And if fear, control, or safety is part of what you're weighing, that is not an ordinary marital difficulty — your safety comes first.",
  "RS-0058": "In the Relationship Life Cycle, separation is a form of Role Transition — moving from one relational role to another with awareness, and adapting responsibilities, expectations, and identity along the way. The developmental work here is Acceptance: seeing clearly what is actually changing, rather than rushing it or resisting it. A responsible transition isn't about who's right; it's about navigating the change with as much clarity, honesty, and care as possible. Because separation carries legal, financial, and family consequences, this is a decision that deserves professional support — counseling, and legal or financial guidance. And if safety, coercion, or control is part of the picture, that changes what a responsible path looks like, and your safety comes first.",
};

async function main() {
  for (const [sid, note] of Object.entries(NOTE)) {
    const { data: e } = await sb.from("companion_experiences").select("id,competency").eq("situation_id", sid).maybeSingle();
    if (!e) { console.log(`${sid}: no experience — skip`); continue; }
    const { data: blks } = await sb.from("companion_experience_blocks").select("id,block_type,block_order").eq("experience_id", e.id).order("block_order");
    if (blks.some(b => b.block_type === "educational_note")) { console.log(`${sid}: already has an educational_note — skip`); continue; }
    // insert educational_note at position 5 (after the decision/fact blocks, before next-step + closing).
    const INSERT_AT = 5;
    // shift blocks at >= INSERT_AT up by one, highest order first to avoid collisions
    const toShift = blks.filter(b => b.block_order >= INSERT_AT).sort((a, b) => b.block_order - a.block_order);
    for (const b of toShift) {
      const { error } = await sb.from("companion_experience_blocks").update({ block_order: b.block_order + 1 }).eq("id", b.id);
      if (error) { console.log(`${sid}: shift failed on ${b.id} — ${error.message}`); }
    }
    const { error: iErr } = await sb.from("companion_experience_blocks").insert({
      experience_id: e.id, block_type: "educational_note", block_order: INSERT_AT, payload: { text: note }, conditional_on: null,
    });
    if (iErr) { console.log(`${sid}: insert failed — ${iErr.message}`); continue; }
    await sb.from("companion_experiences").update({
      safety_classification: "elevated_review_required",
      canonical_source_ref: `RLC Framework Manual — Expiration / Acceptance; competency ${e.competency}`,
      internal_notes: "Owner-authored autonomy-preserving experience (unchanged). Added one educational_note grounding it in Expiration/Acceptance + the resolved competency (Agency / Role Transition), carrying a safety carve-out (abuse != ordinary difficulty; safety first) + professional-support nudge — the clinical-safety element this situation was HELD for. Still DRAFT — requires owner CLINICAL + SAFETY review before publishing. Runtime safety detection applies to all free-text.",
    }).eq("id", e.id);
    console.log(`${sid}: ✅ safety+framework educational_note inserted at ${INSERT_AT}; flagged elevated_review_required (still draft)`);
  }
  console.log("\n✓ Done. Existing owner-authored blocks preserved; safety/support element added. DRAFT — owner review + publish.");
}
main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
