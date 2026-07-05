"use client";

import { useEffect, useState } from "react";
import KcTabs from "@/components/admin/KcTabs";
import { useCanWrite } from "@/components/admin/RoleContext";
import type { ArticleCategory } from "@/lib/articleCategories";

type Toast = { kind: "ok" | "err"; text: string } | null;

export default function CategoriesAdminPage() {
  const [rows, setRows] = useState<ArticleCategory[] | null>(null);
  const [error, setError] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const canWrite = useCanWrite();

  function load() {
    fetch("/api/admin/article-categories").then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows)).catch(() => setError(true));
  }
  useEffect(load, []);

  function showToast(t: Toast) { setToast(t); if (t) setTimeout(() => setToast(null), 3000); }

  async function add() {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/article-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName.trim() }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setNewName("");
      load();
    } catch (e) {
      showToast({ kind: "err", text: e instanceof Error ? e.message : "Add failed." });
    } finally { setBusy(false); }
  }

  async function rename(cat: ArticleCategory, name: string) {
    if (name === cat.name || !name.trim()) { load(); return; }
    setRows((prev) => prev && prev.map((r) => (r.id === cat.id ? { ...r, name } : r)));
    const res = await fetch(`/api/admin/article-categories/${cat.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    if (!res.ok) { const d = await res.json(); showToast({ kind: "err", text: d.error || "Rename failed." }); load(); }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!rows) return;
    const other = index + dir;
    if (other < 0 || other >= rows.length) return;
    const a = rows[index], b = rows[other];
    // swap sort_order values
    const next = [...rows];
    next[index] = { ...b }; next[other] = { ...a };
    setRows(next);
    await Promise.all([
      fetch(`/api/admin/article-categories/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: b.sort_order }) }),
      fetch(`/api/admin/article-categories/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: a.sort_order }) }),
    ]);
    load();
  }

  async function del(cat: ArticleCategory) {
    if (!confirm(`Delete “${cat.name}”? Existing articles keep their label; the category is just removed from the list.`)) return;
    await fetch(`/api/admin/article-categories/${cat.id}`, { method: "DELETE" });
    setRows((prev) => prev && prev.filter((r) => r.id !== cat.id));
  }

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${toast.kind === "ok" ? "bg-sage-green" : "bg-coral-rose"}`}>{toast.text}</div>
      )}
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Knowledge Center</h1>
      <KcTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Categories</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">These appear in the article editor&apos;s Category dropdown and as the topic list on the public Learning Center. Deleting a category doesn&apos;t change articles already labeled with it.</p>

      {canWrite && (
        <div className="mb-6 flex max-w-md gap-2">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="New category name" className="admin-input" />
          <button type="button" onClick={add} disabled={busy || !newName.trim()} className="shrink-0 rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">Add</button>
        </div>
      )}

      {error && <p className="text-sm text-coral-rose">Failed to load. If the categories table isn&apos;t set up yet, run the 0006_article_categories migration.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No categories yet.</p>}

      {rows && rows.length > 0 && (
        <ul className="max-w-md divide-y divide-light-gray overflow-hidden rounded-lg border border-light-gray">
          {rows.map((c, i) => (
            <li key={c.id} className="flex items-center gap-2 bg-white px-3 py-2">
              {canWrite ? (
                <input
                  type="text"
                  defaultValue={c.name}
                  onBlur={(e) => rename(c, e.target.value.trim())}
                  className="flex-1 rounded border border-transparent px-2 py-1 text-sm hover:border-light-gray focus:border-midnight-navy focus:outline-none"
                />
              ) : (
                <span className="flex-1 px-2 py-1 text-sm">{c.name}</span>
              )}
              {canWrite && (
                <>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1.5 text-charcoal/50 hover:text-midnight-navy disabled:opacity-30" title="Move up">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="rounded px-1.5 text-charcoal/50 hover:text-midnight-navy disabled:opacity-30" title="Move down">↓</button>
                  <button type="button" onClick={() => del(c)} className="ml-1 text-[12px] text-coral-rose hover:underline">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
