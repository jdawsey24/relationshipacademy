"use client";

import { useEffect, useRef, useState } from "react";
import KcTabs from "@/components/admin/KcTabs";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { useCanWrite } from "@/components/admin/RoleContext";
import { fileTypeFromName, RESOURCE_STATUSES, type Resource } from "@/lib/resourceConstants";

type Uploaded = { file_url: string; file_name: string; file_type: string };
type Toast = { kind: "ok" | "err"; text: string } | null;

function fmtSize(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ResourcesAdminPage() {
  const [rows, setRows] = useState<Resource[] | null>(null);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploaded, setUploaded] = useState<Uploaded | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canWrite = useCanWrite();

  function load() {
    fetch("/api/admin/resources").then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows)).catch(() => setError(true));
  }
  useEffect(load, []);

  function showToast(t: Toast) { setToast(t); if (t) setTimeout(() => setToast(null), 3000); }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sign = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name }) }).then((r) => r.json());
      if (!sign.path) throw new Error(sign.error || "sign failed");
      const { error: upErr } = await getSupabaseBrowserClient().storage.from("media").uploadToSignedUrl(sign.path, sign.token, file);
      if (upErr) throw upErr;
      setUploaded({ file_url: sign.url, file_name: file.name, file_type: fileTypeFromName(file.name) });
      if (!title) setTitle(file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "));
    } catch {
      showToast({ kind: "err", text: "Upload failed." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function add() {
    if (!uploaded || !title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, status: "published", ...uploaded }),
      });
      if (!res.ok) throw new Error();
      setTitle(""); setDescription(""); setCategory(""); setUploaded(null);
      showToast({ kind: "ok", text: "Resource added." });
      load();
    } catch {
      showToast({ kind: "err", text: "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: string) {
    setRows((prev) => prev && prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/resources/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }

  async function del(id: string) {
    if (!confirm("Delete this resource? The underlying file stays in the Media Library.")) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    setRows((prev) => prev && prev.filter((r) => r.id !== id));
  }

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${toast.kind === "ok" ? "bg-sage-green" : "bg-coral-rose"}`}>{toast.text}</div>
      )}
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Knowledge Center</h1>
      <KcTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Resources</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">Downloadable guides, worksheets, and PDFs shown on the public Learning Center. Files are stored in the Media Library.</p>

      {canWrite && (
        <div className="mb-8 max-w-2xl rounded-lg border border-light-gray bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-midnight-navy">Add a resource</h3>
          <div className="space-y-3">
            <div>
              <span className="mb-1 block text-xs uppercase text-charcoal/50">File</span>
              {uploaded ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded bg-light-gray px-2 py-0.5 text-[11px] uppercase text-charcoal/60">{uploaded.file_type}</span>
                  <span className="truncate text-charcoal">{uploaded.file_name}</span>
                  <button type="button" onClick={() => setUploaded(null)} className="ml-auto text-[12px] text-coral-rose hover:underline">Remove</button>
                </div>
              ) : (
                <label className="inline-block cursor-pointer rounded-md border border-light-gray px-4 py-2 text-sm hover:border-midnight-navy">
                  {uploading ? "Uploading…" : "Choose file"}
                  <input ref={fileRef} type="file" onChange={onFile} disabled={uploading} className="hidden" />
                </label>
              )}
            </div>
            <label className="block">
              <span className="mb-1 block text-xs uppercase text-charcoal/50">Title</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase text-charcoal/50">Description (optional)</span>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase text-charcoal/50">Category (optional)</span>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input" />
            </label>
          </div>
          <button type="button" onClick={add} disabled={saving || uploading || !uploaded || !title.trim()} className="mt-4 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {saving ? "Adding…" : "Add resource"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-coral-rose">Failed to load. If the Resources table isn&apos;t set up yet, run the 0004_resources migration.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No resources yet.</p>}

      {rows && rows.length > 0 && (
        <div className="max-w-3xl overflow-hidden rounded-lg border border-light-gray">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F9F9] text-left text-xs uppercase text-charcoal/50">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Added</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-light-gray">
                  <td className="px-4 py-2">
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-midnight-navy hover:underline">{r.title}</a>
                    {r.category && <span className="ml-2 text-[11px] uppercase text-charcoal/40">{r.category}</span>}
                  </td>
                  <td className="px-4 py-2 text-charcoal/60">{r.file_type}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-charcoal/60">{fmtSize(r.created_at)}</td>
                  <td className="px-4 py-2">
                    <select value={r.status} disabled={!canWrite} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded border border-light-gray px-2 py-1 text-xs outline-none focus:border-midnight-navy disabled:opacity-60">
                      {RESOURCE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {canWrite && <button type="button" onClick={() => del(r.id)} className="text-[12px] text-coral-rose hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
