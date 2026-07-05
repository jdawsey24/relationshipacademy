"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ARTICLE_CATEGORIES, ARTICLE_STATUSES, RELATED_PHASE_OPTIONS, type Article } from "@/lib/articleConstants";
import { useCanWrite } from "@/components/admin/RoleContext";

type Vals = Partial<Article>;

export default function ArticleEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [v, setV] = useState<Vals>({ status: "draft" });
  const [loaded, setLoaded] = useState(!id);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const canWrite = useCanWrite();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/articles/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setV(d.article); setLoaded(true); })
      .catch(() => setMsg({ kind: "err", text: "Failed to load article." }));
  }, [id]);

  function set(k: keyof Article, val: string) { setV((p) => ({ ...p, [k]: val })); }
  function flash(m: { kind: "ok" | "err"; text: string }) { setMsg(m); if (m.kind === "ok") setTimeout(() => setMsg(null), 3000); }

  async function save() {
    if (!(v.title ?? "").trim()) { flash({ kind: "err", text: "Title is required." }); return; }
    setSaving(true);
    try {
      if (id) {
        const res = await fetch(`/api/admin/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
        const d = await res.json();
        if (!res.ok) throw new Error(d.details || d.error);
        flash({ kind: "ok", text: "Saved." });
      } else {
        const res = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
        const d = await res.json();
        if (!res.ok) throw new Error(d.details || d.error);
        router.push(`/admin/knowledge-center/articles/${d.id}`);
        return;
      }
    } catch (e) {
      flash({ kind: "err", text: e instanceof Error ? e.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/knowledge-center/articles");
    else { setConfirmDel(false); flash({ kind: "err", text: "Delete failed." }); }
  }

  if (!loaded) return <p className="text-sm text-charcoal/60">Loading…</p>;

  const Field = ({ label, k, type = "text" }: { label: string; k: keyof Article; type?: string }) => (
    <label className="block">
      <span className="mb-1 block text-xs uppercase text-charcoal/50">{label}</span>
      <input type={type} value={(v[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} className="admin-input" />
    </label>
  );

  return (
    <div className="relative max-w-3xl">
      {msg && (
        <div className={`fixed right-6 top-6 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${msg.kind === "ok" ? "bg-sage-green" : "bg-coral-rose"}`}>{msg.text}</div>
      )}

      <div className="grid gap-4">
        <Field label="Title" k="title" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Slug (blank = from title)</span>
            <input type="text" value={v.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="admin-input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Status</span>
            <select value={v.status ?? "draft"} onChange={(e) => set("status", e.target.value)} className="admin-input">
              {ARTICLE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Category</span>
            <select value={v.category ?? ""} onChange={(e) => set("category", e.target.value)} className="admin-input">
              <option value="">— select —</option>
              {ARTICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-charcoal/50">Related phase</span>
            <select value={v.related_phase_slug ?? ""} onChange={(e) => set("related_phase_slug", e.target.value)} className="admin-input">
              {RELATED_PHASE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <Field label="Author" k="author" />
          <Field label="Publish date" k="publish_date" type="date" />
        </div>

        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Summary (article cards)</span>
          <textarea rows={2} value={v.summary ?? ""} onChange={(e) => set("summary", e.target.value)} className="admin-input" />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">Content (Markdown)</span>
          <textarea rows={16} value={v.content ?? ""} onChange={(e) => set("content", e.target.value)} className="admin-input font-mono text-[13px]" placeholder="## Heading&#10;&#10;Body text. **Bold**, _italic_, [links](https://…), lists, > quotes." />
        </label>

        <Field label="Featured image URL" k="featured_image_url" />
        <Field label="Tags (comma-separated)" k="tags" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CTA text" k="cta_text" />
          <Field label="CTA URL" k="cta_url" />
        </div>
        <Field label="SEO title" k="seo_title" />
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-charcoal/50">SEO description</span>
          <textarea rows={2} value={v.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} className="admin-input" />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving || !canWrite} title={!canWrite ? "Read-only access" : undefined} className="rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
          {saving ? "Saving…" : id ? "Save" : "Create article"}
        </button>
        {id && v.status === "published" && v.slug && (
          <Link href={`/learn/${v.slug}`} target="_blank" className="text-sm text-midnight-navy hover:underline">View live →</Link>
        )}
        {id && canWrite && (
          <button type="button" onClick={() => setConfirmDel(true)} className="ml-auto text-sm text-coral-rose hover:underline">Delete</button>
        )}
        <Link href="/admin/knowledge-center/articles" className="text-sm text-charcoal/60 hover:text-charcoal">Cancel</Link>
      </div>

      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <p className="font-ui text-sm text-charcoal">Delete this article? This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDel(false)} className="rounded-md border border-light-gray px-4 py-2 text-sm">Cancel</button>
              <button type="button" onClick={del} className="rounded-md bg-coral-rose px-4 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
