"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AcademyTabs from "@/components/admin/AcademyTabs";
import { useCanWrite } from "@/components/admin/RoleContext";
import { tierLabel } from "@/lib/academy";

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  min_tier: string;
  status: string;
}

export default function AdminAcademyCourses() {
  const canWrite = useCanWrite();
  const [rows, setRows] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/academy/courses").then((r) => r.json()).catch(() => null);
    setRows(res?.rows ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/academy/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setCreating(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to create.");
      return;
    }
    setTitle("");
    load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Academy</h1>
      <p className="mb-6 text-sm text-charcoal/60">Create and manage courses, modules, and lessons.</p>
      <AcademyTabs />

      {canWrite && (
        <form onSubmit={create} className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-light-gray p-4">
          <label className="text-sm font-medium text-charcoal">
            New course title
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="mt-1 h-10 w-72 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
          </label>
          <button type="submit" disabled={creating || !title.trim()}
            className="h-10 rounded-md bg-midnight-navy px-4 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {creating ? "Creating…" : "Create course"}
          </button>
          {error && <span className="text-sm text-coral-rose">{error}</span>}
        </form>
      )}

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-charcoal/60">No courses yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-gray text-charcoal/60">
            <tr>
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Tier</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-light-gray/60">
                <td className="py-3 pr-4">
                  <span className="font-medium text-midnight-navy">{c.title}</span>
                  {c.subtitle && <span className="block text-xs text-charcoal/50">{c.subtitle}</span>}
                </td>
                <td className="py-3 pr-4">{tierLabel(c.min_tier)}</td>
                <td className="py-3 pr-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.status === "published" ? "bg-sage-green/20 text-midnight-navy" : "bg-light-gray text-charcoal/60"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Link href={`/admin/academy/courses/${c.id}`} className="text-midnight-navy hover:underline">Edit →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
