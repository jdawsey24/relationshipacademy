"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { useCanWrite } from "@/components/admin/RoleContext";

interface MediaFile {
  name: string;
  url: string;
  size: number | null;
  mimetype: string | null;
  created_at: string | null;
}

function kindOf(m: string | null): "image" | "pdf" | "document" {
  if (m?.startsWith("image/")) return "image";
  if (m === "application/pdf") return "pdf";
  return "document";
}
function fmtSize(b: number | null) {
  if (!b) return "";
  return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
}

export default function MediaPage() {
  const [rows, setRows] = useState<MediaFile[] | null>(null);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canWrite = useCanWrite();

  function load() {
    fetch("/api/admin/media").then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows)).catch(() => setError(true));
  }
  useEffect(load, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sign = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name }) }).then((r) => r.json());
      if (!sign.path) throw new Error(sign.error || "sign failed");
      const { error } = await getSupabaseBrowserClient().storage.from("media").uploadToSignedUrl(sign.path, sign.token, file);
      if (error) throw error;
      load();
    } catch {
      setError(true);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function del(path: string) {
    setConfirmDel(null);
    await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, { method: "DELETE" });
    setRows((prev) => prev && prev.filter((r) => r.name !== path));
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  const filtered = useMemo(() => (rows ?? []).filter((r) => !filter || kindOf(r.mimetype) === filter), [rows, filter]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">Media Library</h1>
        {canWrite && (
          <label className="cursor-pointer rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90">
            {uploading ? "Uploading…" : "Upload file"}
            <input ref={fileRef} type="file" onChange={onFile} disabled={uploading} className="hidden" />
          </label>
        )}
      </div>

      <div className="mb-4 flex gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="pdf">PDFs</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {error && <p className="text-sm text-coral-rose">Something went wrong. Please refresh.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && filtered.length === 0 && <p className="text-sm text-charcoal/60">No files yet. Upload one to get started.</p>}

      {rows && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((f) => (
            <div key={f.name} className="flex flex-col overflow-hidden rounded-lg border border-light-gray bg-white">
              <div className="flex h-32 items-center justify-center bg-[#F9F9F9]">
                {kindOf(f.mimetype) === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-ui text-xs uppercase text-charcoal/50">{kindOf(f.mimetype)}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate font-ui text-xs text-charcoal" title={f.name}>{f.name}</p>
                <p className="mt-0.5 font-ui text-[11px] text-charcoal/50">{fmtSize(f.size)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button type="button" onClick={() => copy(f.url)} className="font-ui text-[12px] text-midnight-navy hover:underline">
                    {copied === f.url ? "Copied!" : "Copy URL"}
                  </button>
                  {canWrite && (
                    <button type="button" onClick={() => setConfirmDel(f.name)} className="ml-auto font-ui text-[12px] text-coral-rose hover:underline">Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <p className="font-ui text-sm text-charcoal">Delete this file? This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDel(null)} className="rounded-md border border-light-gray px-4 py-2 text-sm">Cancel</button>
              <button type="button" onClick={() => del(confirmDel)} className="rounded-md bg-coral-rose px-4 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
