"use client";

import AiStudioNav from "@/components/admin/AiStudioNav";

// Reference view of the quality checks (Quality Rules). Deterministic checks run
// automatically at generation; AI-assisted checks run on demand in the Review
// Queue ("Run AI quality review"). Toggling/config is a later phase.
const AUTO = [
  ["double_barreled", "Flags items that join two ideas with and/or."],
  ["double_negative", "Flags 2+ negations (hard to read)."],
  ["length", "Flags items over ~20 words."],
  ["reading_level", "Estimates Flesch-Kincaid grade; targets ~Grade 5 for consumer items."],
  ["moralizing", "Flags judgmental/should-language."],
  ["jargon", "Flags clinical/theory jargon in consumer items."],
  ["missing_source_links", "Fails items not traced to a behavioral indicator."],
  ["reverse_ambiguity", "Flags reverse items without clear negative polarity."],
];
const AI = [
  ["construct_overlap", "Overlap with adjacent competencies."],
  ["social_desirability", "Social-desirability bias."],
  ["unsafe_assumptions", "Unsupported assumptions about marriage, children, gender, religion, sexuality, monogamy, cohabitation."],
  ["phase_leakage", "Content that belongs to a different phase."],
  ["structural_context_mismatch", "Mismatch with the selected structural context."],
];

export default function AiQualityRulesPage() {
  return (
    <div>
      <AiStudioNav />
      <p className="mb-4 text-sm text-charcoal/60">Every draft is checked; nothing is auto-approved. Findings appear in the Review Queue with a severity and a recommended revision.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-light-gray p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Automatic (at generation)</h2>
          <ul className="space-y-1.5 text-sm">
            {AUTO.map(([k, v]) => <li key={k}><span className="font-mono text-xs text-midnight-navy">{k}</span><span className="block text-charcoal/60">{v}</span></li>)}
          </ul>
        </section>
        <section className="rounded-md border border-light-gray p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-charcoal/70">AI-assisted (on demand)</h2>
          <ul className="space-y-1.5 text-sm">
            {AI.map(([k, v]) => <li key={k}><span className="font-mono text-xs text-dusty-plum">ai:{k}</span><span className="block text-charcoal/60">{v}</span></li>)}
          </ul>
          <p className="mt-3 text-xs text-charcoal/50">Run these from a draft in the Review Queue via “Run AI quality review.”</p>
        </section>
      </div>
    </div>
  );
}
