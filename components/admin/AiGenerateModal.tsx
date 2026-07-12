"use client";

import { useEffect, useState } from "react";

// Shared "Generate with AI" modal for the Item Bank + Library. Picks a competency
// (the KB grounding), optional count (items only) + instructions, and calls
// onGenerate. AI output always lands as Draft — the parent reloads to show it.
export default function AiGenerateModal({
  title, subtitle, competencies, showCount, onClose, onGenerate,
}: {
  title: string;
  subtitle: string;
  competencies: { id: string; name: string }[];
  showCount?: boolean;
  onClose: () => void;
  onGenerate: (competencyId: string, count: number, instructions: string) => Promise<string | null>; // returns error or null
}) {
  const [competencyId, setCompetencyId] = useState("");
  const [count, setCount] = useState(8);
  const [instructions, setInstructions] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/studio/generate").then((r) => r.json()).then((d) => setConfigured(!!d.configured)).catch(() => setConfigured(false));
  }, []);

  async function submit() {
    if (!competencyId) { setErr("Select a competency."); return; }
    setBusy(true); setErr(null);
    const error = await onGenerate(competencyId, count, instructions);
    setBusy(false);
    if (error) setErr(error);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-lg font-semibold text-midnight-navy">{title}</h3>
        <p className="mb-3 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">{subtitle} It drafts only from the selected competency (and its behavioral indicators), and always lands as a <strong>Draft</strong> for your review — it never publishes on its own.</p>
        {configured === false && (
          <p className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">AI generation isn&apos;t configured. Set <code>ANTHROPIC_API_KEY</code> to enable it.</p>
        )}
        <label className="block text-sm font-medium text-charcoal">Competency
          <select value={competencyId} onChange={(e) => setCompetencyId(e.target.value)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm">
            <option value="">Select…</option>
            {competencies.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
          </select>
        </label>
        {showCount && (
          <label className="mt-3 block text-sm font-medium text-charcoal">How many items?
            <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
          </label>
        )}
        <label className="mt-3 block text-sm font-medium text-charcoal">Instructions <span className="font-normal text-charcoal/50">(optional)</span>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} placeholder="e.g. Keep the reading level simple; focus on early-dating contexts." className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
        </label>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={submit} disabled={busy || configured === false} className="rounded-md bg-dusty-plum px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : "Generate draft"}</button>
        </div>
      </div>
    </div>
  );
}
