"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KcTabs from "@/components/admin/KcTabs";

interface Row {
  id: string; title: string; slug: string; category: string | null;
  author: string | null; status: string; publish_date: string | null; related_phase_slug: string | null;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ArticlesListPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Knowledge Center</h1>
      <KcTabs />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-midnight-navy">Articles</h2>
        <Link href="/admin/knowledge-center/articles/new" className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90">New article</Link>
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load. If the Knowledge Center table isn&apos;t set up yet, run the articles migration.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}

      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No articles yet. Create your first one.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Title</th>
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Author</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Publish date</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 font-medium">{r.title}</td>
                  <td className="px-3 py-2">{r.category ?? "—"}</td>
                  <td className="px-3 py-2">{r.author ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${r.status === "published" ? "bg-sage-green/20 text-sage-green" : "bg-light-gray text-charcoal/60"}`}>{r.status}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(r.publish_date)}</td>
                  <td className="px-3 py-2"><Link href={`/admin/knowledge-center/articles/${r.id}`} className="font-medium text-midnight-navy hover:underline">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
