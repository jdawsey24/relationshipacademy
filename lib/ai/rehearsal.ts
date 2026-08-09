import { getSupabaseAdminClient } from "@/lib/supabase";
import type { AiProvider, GenerateOpts, GenerateResult } from "@/lib/ai/provider";

// Rehearsal: replay a real response instead of buying a new one.
//
// Checking that a button works should not cost fifty cents. This returns a
// stored response from an earlier real run, shaped exactly as the stage's
// schema, so every screen behaves as it does live and the writing on it is
// writing rather than lorem.
//
// Two things it deliberately does NOT do:
//
// It does not invent a response when it has no sample. It fails, and says which
// generation type it has nothing for. A rehearsal that quietly produces
// something plausible would be indistinguishable from the real thing, and the
// point is to know which one you are looking at.
//
// It does not report tokens. Zero in, zero out, zero dollars, so nothing it
// does shows up in the spend ledger as though money moved.

export class RehearsalProvider implements AiProvider {
  name = "rehearsal";
  configured() { return true; }

  async generate(opts: GenerateOpts & { generationType?: string }): Promise<GenerateResult> {
    const type = opts.generationType;
    if (!type) throw new Error("Rehearsal needs to know which stage it is replaying.");

    const s = getSupabaseAdminClient();
    const { data } = await s.from("ai_rehearsal_samples")
      .select("output, label").eq("generation_type", type).order("created_at", { ascending: false });
    const rows = (data ?? []) as { output: unknown; label: string }[];

    if (!rows.length) {
      throw new Error(
        `Rehearsal has nothing saved for "${type}". Run it for real once, or run ` +
        `scripts/captureRehearsalSamples.ts to build samples from past runs.`,
      );
    }

    // Rotate rather than always returning the newest, so clicking a stage twice
    // shows something different and the screen gets exercised properly.
    const pick = rows[Math.floor(Math.random() * rows.length)];

    return {
      output: pick.output,
      provider: this.name,
      model: `rehearsal:${pick.label}`,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    };
  }
}
