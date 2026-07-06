"use client";

import { useEffect, useState } from "react";
import AcademyTabs from "@/components/admin/AcademyTabs";
import { useCanWrite } from "@/components/admin/RoleContext";
import { TIERS } from "@/lib/academy";

interface MemberRow {
  id: string;
  full_name: string | null;
  email: string | null;
  membership_tier: string;
  skool_joined: boolean;
  created_at: string;
}

export default function AdminMembers() {
  const canWrite = useCanWrite();
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/admin/academy/members").then((r) => r.json()).catch(() => null);
    setRows(res?.rows ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setTier(id: string, membership_tier: string) {
    setSavingId(id);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, membership_tier } : r)));
    await fetch("/api/admin/academy/members", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, membership_tier }),
    }).catch(() => {});
    setSavingId(null);
  }

  const filtered = rows.filter((r) =>
    !q ||
    (r.email ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (r.full_name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Academy</h1>
      <p className="mb-6 text-sm text-charcoal/60">Members and their membership tier.</p>
      <AcademyTabs />

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email"
        className="mb-4 h-10 w-72 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-charcoal/60">No members yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-light-gray text-charcoal/60">
            <tr>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Skool</th>
              <th className="py-2 pr-4 font-medium">Joined</th>
              <th className="py-2 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-light-gray/60">
                <td className="py-3 pr-4 text-midnight-navy">{m.full_name || "—"}</td>
                <td className="py-3 pr-4">{m.email || "—"}</td>
                <td className="py-3 pr-4">{m.skool_joined ? "Yes" : "—"}</td>
                <td className="py-3 pr-4 text-charcoal/60">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <select
                    value={m.membership_tier}
                    disabled={!canWrite || savingId === m.id}
                    onChange={(e) => setTier(m.id, e.target.value)}
                    className="rounded-md border border-light-gray px-2 py-1 text-sm outline-none focus:border-midnight-navy disabled:opacity-60"
                  >
                    {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
