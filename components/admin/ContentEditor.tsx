"use client";

import { useEffect, useState } from "react";
import type { ContentField } from "@/lib/siteContent";

// Reusable admin editor for a set of site_content fields. Loads current
// overrides, shows defaults where none exist, saves via the admin API.
type Toast = { kind: "success" | "error"; msg: string } | null;

export default function ContentEditor({ fields }: { fields: ContentField[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        const map: Record<string, string> = {};
        for (const row of d.rows as { key: string; value: string }[]) map[row.key] = row.value ?? "";
        const init: Record<string, string> = {};
        for (const f of fields) init[f.key] = map[f.key] ?? f.default;
        setValues(init);
        setLoaded(true);
      })
      .catch(() => setError(true));
  }, [fields]);

  function showToast(t: Toast) { setToast(t); if (t) setTimeout(() => setToast(null), 3000); }
  function set(key: string, value: string) { setValues((v) => ({ ...v, [key]: value })); }

  async function save() {
    setSaving(true);
    try {
      const updates: Record<string, string> = {};
      for (const f of fields) updates[f.key] = values[f.key] ?? "";
      const res = await fetch("/api/admin/site-content", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error();
      showToast({ kind: "success", msg: "Saved. Changes appear on the site within a minute." });
    } catch {
      showToast({ kind: "error", msg: "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="text-sm text-coral-rose">Failed to load. If the content table isn&apos;t set up yet, run the site_content migration.</p>;
  if (!loaded) return <p className="text-sm text-charcoal/60">Loading…</p>;

  return (
    <div className="relative max-w-2xl">
      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${toast.kind === "success" ? "bg-sage-green" : "bg-coral-rose"}`}>
          {toast.msg}
        </div>
      )}
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            {f.type === "toggle" ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={values[f.key] === "true"} onChange={(e) => set(f.key, e.target.checked ? "true" : "false")} className="h-4 w-4 accent-midnight-navy" />
                {f.label}
              </label>
            ) : (
              <label className="block">
                <span className="mb-1 block text-xs uppercase text-charcoal/50">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="admin-input" />
                ) : (
                  <input type="text" value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="admin-input" />
                )}
              </label>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={save} disabled={saving} className="mt-5 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
