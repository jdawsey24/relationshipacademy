"use client";

import { useEffect, useState } from "react";

interface UserRow {
  id: string; email: string; role: string; last_sign_in_at: string | null; deactivated: boolean;
}
const ROLES = ["owner", "editor", "viewer"];

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "forbidden" | "error">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [msg, setMsg] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/users").then(async (r) => {
      if (r.status === 403) { setStatus("forbidden"); return; }
      if (!r.ok) throw new Error();
      const d = await r.json(); setRows(d.rows); setStatus("ok");
    }).catch(() => setStatus("error"));
  }
  useEffect(load, []);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, role: newRole }) });
    const d = await res.json();
    if (!res.ok) { setMsg(d.details || d.error || "Failed."); return; }
    setEmail(""); setPassword(""); setNewRole("viewer"); load();
  }

  async function update(id: string, patch: { role?: string; deactivated?: boolean }) {
    const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
    if (!res.ok) { const d = await res.json(); setMsg(d.error || "Failed."); return; }
    load();
  }

  if (status === "forbidden") return (
    <div><h1 className="text-2xl font-semibold text-midnight-navy">Users &amp; Permissions</h1>
      <p className="mt-4 text-sm text-charcoal/70">Only owners can manage users.</p></div>
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-midnight-navy">Users &amp; Permissions</h1>

      {msg && <p className="mb-4 rounded-md bg-coral-rose/10 px-4 py-2 text-sm text-coral-rose">{msg}</p>}

      <form onSubmit={addUser} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-light-gray p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase text-charcoal/50">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 w-56 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase text-charcoal/50">Temp password</span>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10 w-44 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase text-charcoal/50">Role</span>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <button type="submit" className="h-10 rounded-md bg-midnight-navy px-4 text-sm font-medium text-white hover:bg-midnight-navy/90">Add user</button>
      </form>

      {status === "loading" && <p className="text-sm text-charcoal/60">Loading…</p>}
      {status === "error" && <p className="text-sm text-coral-rose">Failed to load users.</p>}

      {status === "ok" && rows && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
              <th className="px-3 py-2 font-semibold">Email</th><th className="px-3 py-2 font-semibold">Role</th>
              <th className="px-3 py-2 font-semibold">Last login</th><th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {rows.map((u, i) => (
                <tr key={u.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    <select value={u.role} onChange={(e) => update(u.id, { role: e.target.value })} className="rounded border border-light-gray px-2 py-1 text-xs outline-none focus:border-midnight-navy">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(u.last_sign_in_at)}</td>
                  <td className="px-3 py-2">{u.deactivated ? <span className="text-coral-rose">Deactivated</span> : <span className="text-sage-green">Active</span>}</td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => update(u.id, { deactivated: !u.deactivated })} className="font-medium text-midnight-navy hover:underline">
                      {u.deactivated ? "Reactivate" : "Deactivate"}
                    </button>
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
