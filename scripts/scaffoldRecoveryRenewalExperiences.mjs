/*
 * Scaffold DRAFT guided experiences for the 16 Recovery–Renewal (single/breakup)
 * situations that have no experience. These are FRAMEWORK-NEUTRAL scaffolds for
 * the owner to author from: intro / reflection / emotion / [EDUCATIONAL NOTE
 * placeholder] / reflection / next-step / closing.
 *
 * The reflective prompts are grounded ONLY in each situation's own authored
 * definition + user_need (canonical situation content) and general open reflection
 * — they assert NO RLC theory. The EDUCATIONAL NOTE is left as an explicit
 * placeholder because Recovery–Renewal has no canonical competency content yet
 * (DI-006); the owner authors that substance.
 *
 * All rows are status="draft" (not user-visible). Idempotent: skips a situation
 * that already has any experience row.
 *   (set -a; . ./.env.local; set +a; node scripts/scaffoldRecoveryRenewalExperiences.mjs)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// situation_id → framework-neutral block copy (grounded in the situation's own need/definition)
const C = {
  "RS-0001": { intro: "There's no clock on this. This is a space to notice where you actually are with dating right now — honestly, and without pressure to be anywhere else.", r1: "When you picture dating again right now, what comes up — in your body, your thoughts, your gut? Write freely; nothing here is wrong.", emo: "Name whatever you're feeling as you sit with this. There's no feeling you're supposed to have.", r2: "Set aside what anyone else expects for a moment. What would you want this season to be about, if it could be about anything?", next: "Is there one small thing that would help this season feel like yours — rest, a person, a boundary, a plan? Note it if one comes to mind.", closing: "Not being ready is a valid answer. You don't owe anyone a timeline. Come back whenever you want to check in with yourself again." },
  "RS-0002": { intro: "The feeling of being “behind” usually comes from a comparison, not from your actual life. Let's gently look at where that feeling is coming from and what's true for you.", r1: "Behind whom, and by whose measure? When you feel off schedule, whose timeline are you measuring against? Write it out.", emo: "What feelings come up around this comparison? Name them plainly.", r2: "If no one's schedule but your own existed, what would you actually want more of right now?", next: "Is there one comparison you could set down this week — a feed to mute, a question to stop answering? Note it.", closing: "Your life isn't running late. Come back anytime you want to loosen the grip of the timeline." },
  "RS-0003": { intro: "Still thinking about someone doesn't mean you're doing anything wrong — it usually means something feels unfinished inside, not necessarily with them. Let's look at it gently.", r1: "When your ex comes to mind, what are you actually reaching for — them, a feeling, a version of things, an answer? Write what's really there.", emo: "What emotions ride along with those thoughts? Name them.", r2: "What would you need to feel or understand for the thoughts to loosen — even a little?", next: "Is there one kind thing you could do for yourself the next time the thoughts come? Note it.", closing: "Thinking about them doesn't undo your progress. Be patient with yourself. Come back whenever you need to." },
  "RS-0004": { intro: "Closure is often something you build for yourself rather than receive from someone else. This is a space to work toward your own peace with how it ended.", r1: "What still feels open for you about how it ended — a question, a hurt, a thing left unsaid? Write it down.", emo: "What are you feeling as you name that? Let it be whatever it is.", r2: "If the other person will never give you the answer you want, what would it take for you to make peace anyway?", next: "Is there one thing — a letter you don't send, a boundary, a ritual — that might help you close this for yourself? Note it.", closing: "Peace can be something you give yourself. You're allowed to move at your own pace. Come back anytime." },
  "RS-0005": { intro: "A door reopening doesn't mean you have to walk through it — or that you can't. This is a space to think it through clearly, before history or feelings decide for you.", r1: "What's pulling you toward saying yes? And what's pulling you toward no? Write both honestly.", emo: "What are you feeling as you weigh this — hope, fear, relief, dread? Name it.", r2: "What was actually true about the relationship when it ended — and what, specifically, would need to be different for returning to be worth it?", next: "What's one thing you'd want to see change or protect before deciding? Note it.", closing: "You get to choose on your own terms and your own timeline. Come back whenever you want to think it through again." },
  "RS-0006": { intro: "Being on your own is its own skill, and you're allowed to be new at it. This is a space to notice what grounds you when it's just you.", r1: "When are the moments you feel most like yourself lately — alone or otherwise? Write about one.", emo: "What comes up around being on your own right now? Name the feelings.", r2: "What would “whole on your own” look like for you — concretely, in an ordinary week?", next: "Is there one thing that steadies you that you could do more of? Note it.", closing: "Wholeness isn't something you're missing — it's something you're building. Come back whenever you want to." },
  "RS-0007": { intro: "Noticing a pattern is the hard part, and you've already done it. This is a space to look at what keeps drawing you in — with curiosity, not blame.", r1: "Think of the people you've been drawn to. What do they have in common — in how they made you feel, not just who they were? Write it out.", emo: "What comes up as you see the pattern? Name it.", r2: "What need might that familiar dynamic be trying to meet — and is it actually meeting it?", next: "What's one early sign of the pattern you could learn to notice sooner? Note it.", closing: "Seeing the pattern is what makes a different choice possible. Be gentle with yourself. Come back anytime." },
  "RS-0008": { intro: "Some of the hardest grief is for a future that never got to happen. That loss is real, even if no one else can see it. This is a space to honor it.", r1: "What was the life you pictured? Describe it — the ordinary details, not just the big ones.", emo: "What are you feeling as you name that imagined life? Let it be here.", r2: "What parts of what you wanted are about that relationship — and what parts are about things you can still want and build another way?", next: "Is there one small way to honor the loss, or one hope you can carry forward? Note it.", closing: "Grieving an imagined future is still grief, and it deserves care. Come back whenever you need to." },
  "RS-0009": { intro: "A hard ending can shake how you see yourself — but what happened to you isn't the same as what's true about you. This is a space to start rebuilding.", r1: "What has this experience made you believe about yourself? Write the belief out plainly, even if it stings.", emo: "What feelings come with that belief? Name them.", r2: "Whose voice is that belief, really? And what would someone who knows your worth say instead?", next: "What's one thing you could do this week that reminds you who you are outside of a relationship? Note it.", closing: "Your worth didn't leave with them. Rebuilding takes time, and you're allowed to take it. Come back anytime." },
  "RS-0010": { intro: "Being content on your own isn't a placeholder or a problem to solve. This is a space to name what's good about this season — and protect it.", r1: "What do you genuinely love about your life right now? Write it out — be specific.", emo: "What does this season feel like at its best? Name it.", r2: "What would help you keep this a season you're living rather than one you're waiting through?", next: "Is there one thing you want to do more of while you have this freedom? Note it.", closing: "A happy single season is a real, full life — not a waiting room. Come back whenever you want to." },
  "RS-0011": { intro: "“Ready” is worth getting honest about — for you, not for anyone else's timeline. This is a space to tell the difference between ready and restless.", r1: "What's making you consider dating right now? Name the real reasons — loneliness, pressure, curiosity, genuine desire — as honestly as you can.", emo: "What are you feeling as you think about putting yourself out there? Name it.", r2: "What would “ready” actually look like for you — emotionally and practically? What would need to be true?", next: "Is there one thing you'd want in place first? Note it.", closing: "There's no deadline on readiness. You're allowed to wait, or to try. Come back whenever you want to check in." },
  "RS-0012": { intro: "Fear of being hurt again usually means you've been hurt and paid attention — that's wisdom, not weakness. This is a space to hold both the caution and the wanting.", r1: "What are you most afraid would happen if you opened up again? Write the fear out fully.", emo: "What feelings come with that fear? Name them.", r2: "What has the fear been protecting you from — and what has it been costing you?", next: "What's one small way you could stay open and honor your caution at the same time? Note it.", closing: "Wanting connection while fearing it is deeply human. You don't have to choose between safe and open all at once. Come back anytime." },
  "RS-0014": { intro: "Wanting to do it differently starts with knowing what “differently” means for you. This is a space to turn that intention into something concrete.", r1: "Looking back, what do you most want to do differently this time — in who you choose, how you show up, or what you allow? Write it out.", emo: "What comes up as you imagine doing it differently? Name it.", r2: "What's one specific thing you'll do — or stop doing — that would make this different in practice, not just intention?", next: "What's the first small step toward that? Note it.", closing: "Different is built one choice at a time. You already know more than you did before. Come back whenever you want to." },
  "RS-0016": { intro: "Meeting people offline is less about luck and more about putting yourself where connection can happen. This is a space to think about what that could look like for your actual life.", r1: "Where in your ordinary week are you already around people — and where might you enjoy being more? Write out a few real places.", emo: "How do you feel about meeting people this way — excited, awkward, resistant? Name it.", r2: "What kinds of settings bring out a version of you that you like? What would it take to be in one more often?", next: "What's one small, doable thing you could try this month? Note it.", closing: "Connection tends to find people who show up. Start small and real. Come back whenever you want to." },
  "RS-0017": { intro: "Worrying you'll miss the signs usually means you're ready to take them seriously. This is a space to rebuild trust in your own judgment.", r1: "Looking back, what did you notice but talk yourself out of? Write out what you actually saw — and what you told yourself instead.", emo: "What comes up as you name that? Name the feelings.", r2: "What would help you trust and act on what you notice next time, instead of explaining it away?", next: "What's one thing you'll promise to take seriously if you see it again? Note it.", closing: "You likely saw more than you gave yourself credit for. Trusting yourself is a skill you can rebuild. Come back anytime." },
  "RS-0019": { intro: "If dating feels more like an assignment than a desire, that's worth pausing on. This is a space to sort out whose choice this actually is.", r1: "Whose voices are telling you to date — and what are they actually saying? Write them out.", emo: "What do you feel when you imagine not dating right now? Name it.", r2: "Setting everyone else aside, do you want this right now? What would you choose if no one were watching?", next: "Is there one expectation you could set down, at least for now? Note it.", closing: "Dating is yours to choose or decline. You don't owe anyone your love life. Come back whenever you want to." },
};

const FLOW = ["intro_context", "reflection_long", "emotion_select", "educational_note", "reflection_long", "user_next_step", "closing_summary"];
const slugify = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function main() {
  const ids = Object.keys(C);
  const { data: sits } = await sb.from("reg_situations").select("*").in("situation_id", ids);
  const { data: fmaps } = await sb.from("reg_situation_framework_map").select("*").in("situation_id", ids);
  const fmBy = Object.fromEntries((fmaps ?? []).map((f) => [f.situation_id, f]));
  let created = 0, skipped = 0;
  for (const sid of ids) {
    const sit = (sits ?? []).find((r) => r.situation_id === sid);
    if (!sit) { console.log(`${sid}: not found — skip`); continue; }
    const { data: existing } = await sb.from("companion_experiences").select("id").eq("situation_id", sid).limit(1).maybeSingle();
    if (existing) { console.log(`${sid}: already has an experience — skip`); skipped++; continue; }
    const fm = fmBy[sid] ?? {};
    const c = C[sid];
    const task = fm.developmental_task ?? "Recovery–Renewal";
    const eduNote = `[EDUCATIONAL NOTE — TO AUTHOR] Recovery–Renewal ("${task}" task) has no canonical RLC content yet (DI-006). Replace this with the framework-grounded educational note before publishing.`;
    const payloadFor = (t) => ({
      intro_context: { text: c.intro },
      reflection_long: { text: null }, // set per-position below
      emotion_select: { text: c.emo },
      educational_note: { text: eduNote },
      user_next_step: { text: c.next },
      closing_summary: { text: c.closing },
    }[t]);
    // two reflection_long blocks use r1 then r2 in order
    let rIdx = 0;
    const blocks = FLOW.map((t, i) => {
      let payload = payloadFor(t);
      if (t === "reflection_long") { payload = { text: rIdx === 0 ? c.r1 : c.r2 }; rIdx++; }
      return { block_type: t, block_order: i, payload };
    });

    const { data: exp, error: eErr } = await sb.from("companion_experiences").insert({
      slug: slugify(sit.official_title), title: sit.official_title, consumer_title: sit.official_title,
      short_description: c.intro, est_minutes: 6, mode: "guided",
      status: "draft", current_version: 1, published_version: null, owner: "scaffold",
      situation_id: sid, structural_context: sit.primary_status_key ?? null, phase: fm.phase_id ?? null,
      developmental_task: fm.developmental_task ?? null, domain: fm.domain_id ?? null, competency: null,
      situation_category: sit.primary_category_id ?? null, consumer_topic: sit.short_title ?? null,
      internal_notes: "Framework-neutral scaffold (auto). Reflective prompts grounded in the situation's own need/definition; educational note pending Recovery–Renewal authoring (DI-006). Owner to author + run the review ladder before publishing.",
      canonical_source_ref: "situation-level only; Recovery–Renewal competency content undefined (DI-006)",
    }).select("id").single();
    if (eErr) { console.log(`${sid}: insert failed — ${eErr.message}`); continue; }
    const expId = exp.id;
    const rows = blocks.map((b) => ({ experience_id: expId, block_type: b.block_type, block_order: b.block_order, payload: b.payload, conditional_on: null }));
    const { error: bErr } = await sb.from("companion_experience_blocks").insert(rows);
    if (bErr) { console.log(`${sid}: blocks failed — ${bErr.message}`); continue; }
    console.log(`${sid}: ✅ draft "${sit.official_title}" (${blocks.length} blocks; educational note = placeholder)`);
    created++;
  }
  console.log(`\n✓ Done — ${created} created, ${skipped} skipped. All DRAFT; educational notes are owner placeholders.`);
}
main().catch((e) => { console.error("SCAFFOLD FAILED:", e.message); process.exit(1); });
