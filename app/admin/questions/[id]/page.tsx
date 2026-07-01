"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question_text: string;
  item_type: string;
  score_direction: string;
  construct: string | null;
  subconstruct: string | null;
  observable_behavior: string | null;
  active: boolean;
  in_snapshot: boolean;
  in_profile: boolean;
}

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [q, setQ] = useState<Question | null>(null);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/questions/${id}`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => setQ(d.question))
      .catch(() => setError(true));
  }, [id]);

  function set<K extends keyof Question>(field: K, value: Question[K]) {
    setQ((prev) => prev && { ...prev, [field]: value });
  }

  async function save() {
    if (!q) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: q.question_text,
          item_type: q.item_type,
          score_direction: q.score_direction,
          construct: q.construct,
          subconstruct: q.subconstruct,
          observable_behavior: q.observable_behavior,
          active: q.active,
          in_snapshot: q.in_snapshot,
          in_profile: q.in_profile,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.push("/admin/questions");
    } catch {
      setSaveError("Save failed. Please try again.");
      setSaving(false);
    }
  }

  if (error) return <p className="text-sm text-coral-rose">Failed to load question.</p>;
  if (!q) return <p className="text-sm text-charcoal/60">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/questions" className="text-sm text-midnight-navy hover:underline">← Back to questions</Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-midnight-navy">
        Edit <span className="font-mono text-lg">{q.id}</span>
      </h1>

      <div className="grid gap-4">
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Question text</span>
          <textarea rows={3} value={q.question_text} onChange={(e) => set("question_text", e.target.value)} className="admin-input" />
        </label>

        <div className="flex gap-4">
          <label className="block flex-1">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Item type</span>
            <select value={q.item_type} onChange={(e) => set("item_type", e.target.value)} className="admin-input">
              {["Growth", "Gap", "Decline"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block flex-1">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Score direction</span>
            <select value={q.score_direction} onChange={(e) => set("score_direction", e.target.value)} className="admin-input">
              <option value="forward">forward</option>
              <option value="reverse">reverse</option>
            </select>
          </label>
        </div>
        <p className="-mt-2 text-xs text-coral-rose">
          Changing score direction affects all historical results.
        </p>

        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Construct</span>
          <input type="text" value={q.construct ?? ""} onChange={(e) => set("construct", e.target.value)} className="admin-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Subconstruct</span>
          <input type="text" value={q.subconstruct ?? ""} onChange={(e) => set("subconstruct", e.target.value)} className="admin-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Observable behavior</span>
          <input type="text" value={q.observable_behavior ?? ""} onChange={(e) => set("observable_behavior", e.target.value)} className="admin-input" />
        </label>

        <div className="flex flex-wrap gap-6 py-2">
          <Toggle label="Active" checked={q.active} onChange={(v) => set("active", v)} />
          <Toggle label="In Snapshot" checked={q.in_snapshot} onChange={(v) => set("in_snapshot", v)} />
          <Toggle label="In Profile" checked={q.in_profile} onChange={(v) => set("in_profile", v)} />
        </div>

        {saveError && <p className="text-sm text-coral-rose">{saveError}</p>}

        <div className="flex items-center gap-3">
          <button type="button" onClick={save} disabled={saving} className="rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
          <Link href="/admin/questions" className="text-sm text-charcoal/70 hover:text-charcoal">Cancel</Link>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-midnight-navy" />
      {label}
    </label>
  );
}
