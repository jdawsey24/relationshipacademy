"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentField } from "@/lib/siteContent";
import { useCanWrite } from "@/components/admin/RoleContext";

// Reusable admin editor for a set of site_content fields. Loads current
// overrides, shows defaults where none exist, saves via the admin API.
//
// Draft/publish: when pointed at the site_content endpoint (the default), edits
// are staged as a draft and only go live on Publish. `value` is the published
// value public pages read; `draft_value` is the staged edit. Editors that write
// a different endpoint (e.g. Settings) keep a single immediate Save.
type Toast = { kind: "success" | "error"; msg: string } | null;
const SITE_CONTENT_PATH = "/api/admin/site-content";

export default function ContentEditor({ fields, apiPath = SITE_CONTENT_PATH }: { fields: ContentField[]; apiPath?: string }) {
  const draftAware = apiPath === SITE_CONTENT_PATH;
  const [values, setValues] = useState<Record<string, string>>({});
  const [published, setPublished] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<null | "draft" | "publish" | "save">(null);
  const [toast, setToast] = useState<Toast>(null);
  const canWrite = useCanWrite();

  useEffect(() => {
    fetch(apiPath)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        const val: Record<string, string> = {};
        const draft: Record<string, string | null> = {};
        for (const row of d.rows as { key: string; value: string; draft_value?: string | null }[]) {
          val[row.key] = row.value ?? "";
          draft[row.key] = row.draft_value ?? null;
        }
        const pub: Record<string, string> = {};
        const init: Record<string, string> = {};
        for (const f of fields) {
          pub[f.key] = val[f.key] ?? f.default;
          // Show the staged draft if one exists, otherwise the published value.
          const d0 = draft[f.key];
          init[f.key] = d0 !== null && d0 !== undefined ? d0 : pub[f.key];
        }
        setPublished(pub);
        setValues(init);
        setLoaded(true);
      })
      .catch(() => setError(true));
  }, [fields]);

  // Keys whose current editor value differs from what's live on the site.
  const dirtyKeys = useMemo(
    () => fields.filter((f) => (values[f.key] ?? "") !== (published[f.key] ?? "")).map((f) => f.key),
    [fields, values, published]
  );
  const hasUnpublished = dirtyKeys.length > 0;

  function showToast(t: Toast) { setToast(t); if (t) setTimeout(() => setToast(null), 4000); }
  function set(key: string, value: string) { setValues((v) => ({ ...v, [key]: value })); }

  function payload() {
    const out: Record<string, string> = {};
    for (const f of fields) out[f.key] = values[f.key] ?? "";
    return out;
  }

  async function patch(body: object) {
    const res = await fetch(apiPath, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
  }

  async function saveDraft() {
    setBusy("draft");
    try {
      await patch({ drafts: payload() });
      showToast({ kind: "success", msg: "Draft saved. It won't appear on the site until you publish." });
    } catch {
      showToast({ kind: "error", msg: "Save failed." });
    } finally { setBusy(null); }
  }

  async function publish() {
    setBusy("publish");
    try {
      await patch({ publish: payload() });
      setPublished({ ...payload() }); // now live → clears the unpublished indicator
      showToast({ kind: "success", msg: "Published. Changes appear on the site within a minute." });
    } catch {
      showToast({ kind: "error", msg: "Publish failed." });
    } finally { setBusy(null); }
  }

  async function saveImmediate() {
    setBusy("save");
    try {
      await patch({ updates: payload() });
      setPublished({ ...payload() });
      showToast({ kind: "success", msg: "Saved. Changes appear on the site within a minute." });
    } catch {
      showToast({ kind: "error", msg: "Save failed." });
    } finally { setBusy(null); }
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
        {fields.map((f) => {
          const dirty = draftAware && dirtyKeys.includes(f.key);
          return (
            <div key={f.key}>
              {f.type === "toggle" ? (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={values[f.key] === "true"} onChange={(e) => set(f.key, e.target.checked ? "true" : "false")} className="h-4 w-4 accent-midnight-navy" />
                  {f.label}
                  {dirty && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-700">Unpublished</span>}
                </label>
              ) : (
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-xs uppercase text-charcoal/50">
                    {f.label}
                    {dirty && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium normal-case text-amber-700">Unpublished</span>}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="admin-input" />
                  ) : (
                    <input type="text" value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="admin-input" />
                  )}
                </label>
              )}
            </div>
          );
        })}
      </div>

      {draftAware ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={publish} disabled={!!busy || !canWrite} title={!canWrite ? "Read-only access" : undefined} className="rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          <button type="button" onClick={saveDraft} disabled={!!busy || !canWrite} title={!canWrite ? "Read-only access" : undefined} className="rounded-md border border-light-gray px-5 py-2 text-sm font-medium text-midnight-navy hover:border-midnight-navy disabled:opacity-50">
            {busy === "draft" ? "Saving…" : "Save draft"}
          </button>
          {hasUnpublished && (
            <span className="text-sm text-amber-700">You have unpublished changes.</span>
          )}
        </div>
      ) : (
        <button type="button" onClick={saveImmediate} disabled={!!busy || !canWrite} title={!canWrite ? "Read-only access" : undefined} className="mt-5 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
          {busy === "save" ? "Saving…" : "Save"}
        </button>
      )}
    </div>
  );
}
