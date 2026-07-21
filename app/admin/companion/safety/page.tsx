"use client";

import { useEffect, useState } from "react";

// Owner/clinician CMS for the Companion V1 safety layer. All content here is
// CLINICIAN-AUTHORED. The safety layer is INERT until at least one active
// trigger + a response message + at least one verified resource exist.

interface Trigger { id: string; pattern: string; match_type: string; level: string; risk_category: string | null; is_active: boolean; notes: string | null }
interface Resource { id: string; name: string; description: string | null; contact: string | null; url: string | null; jurisdiction: string; hours: string | null; is_active: boolean; verified_at: string | null; verified_by: string | null; source: string | null }
interface Resp { level: string; heading: string | null; message: string; resource_intro: string | null; is_active: boolean }
interface Event { id: string; matched_pattern: string | null; level: string; context: string | null; situation_ref: string | null; action: string; created_at: string }

async function j(url: string, opts?: RequestInit) { const r = await fetch(url, opts); return r.ok ? r.json() : Promise.reject(await r.json().catch(() => ({}))); }

export default function CompanionSafetyAdmin() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [resp, setResp] = useState<Resp>({ level: "high_risk", heading: "", message: "", resource_intro: "", is_active: true });
  const [events, setEvents] = useState<Event[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    const [t, r, rs, ev] = await Promise.all([
      j("/api/admin/companion/safety/triggers"), j("/api/admin/companion/safety/resources"),
      j("/api/admin/companion/safety/responses"), j("/api/admin/companion/safety/events"),
    ]);
    setTriggers(t.triggers); setResources(r.resources); setEvents(ev.events);
    const hr = (rs.responses as Resp[]).find((x) => x.level === "high_risk");
    if (hr) setResp({ ...hr, heading: hr.heading ?? "", resource_intro: hr.resource_intro ?? "" });
  }
  useEffect(() => { reload().catch(() => setMsg("Failed to load.")); }, []);

  const ready = triggers.some((t) => t.is_active) && !!resp.message.trim() && resources.some((r) => r.is_active);

  // --- trigger form ---
  const [tp, setTp] = useState({ pattern: "", match_type: "keyword", level: "high_risk", risk_category: "", notes: "" });
  async function addTrigger() {
    if (!tp.pattern.trim()) return;
    await j("/api/admin/companion/safety/triggers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tp) });
    setTp({ pattern: "", match_type: "keyword", level: "high_risk", risk_category: "", notes: "" }); reload();
  }
  async function toggleTrigger(t: Trigger) { await j(`/api/admin/companion/safety/triggers/${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !t.is_active }) }); reload(); }
  async function delTrigger(id: string) { if (!confirm("Delete this trigger?")) return; await j(`/api/admin/companion/safety/triggers/${id}`, { method: "DELETE" }); reload(); }

  async function saveResp() {
    if (!resp.message.trim()) { setMsg("Response message is required."); return; }
    await j("/api/admin/companion/safety/responses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) });
    setMsg("Response language saved."); reload();
  }

  // --- resource form ---
  const [rf, setRf] = useState({ name: "", description: "", contact: "", url: "", jurisdiction: "US", hours: "", source: "", verified_by: "" });
  async function addResource() {
    if (!rf.name.trim()) return;
    const body = { ...rf, verified_at: rf.verified_by ? new Date().toISOString() : null };
    await j("/api/admin/companion/safety/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setRf({ name: "", description: "", contact: "", url: "", jurisdiction: "US", hours: "", source: "", verified_by: "" }); reload();
  }
  async function toggleResource(r: Resource) { await j(`/api/admin/companion/safety/resources/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !r.is_active }) }); reload(); }
  async function delResource(id: string) { if (!confirm("Delete this resource?")) return; await j(`/api/admin/companion/safety/resources/${id}`, { method: "DELETE" }); reload(); }

  const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";
  const btn = "rounded bg-midnight-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40";

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-midnight-navy">Companion Safety (V1)</h1>
        <p className="mt-1 text-sm text-gray-600">Clinician-authored. The safety layer screens learner free-text, interrupts the experience on a high-risk trigger, and shows support + verified resources. Metadata-only audit logging.</p>
      </div>

      <div className={`rounded-lg border p-4 text-sm ${ready ? "border-green-300 bg-green-50 text-green-900" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
        {ready ? "✅ Live-ready: active trigger(s), a response message, and active resource(s) are all present." : "⚠️ Inert until you add at least one active trigger, a response message, AND one active resource. Verified resources must be legally reviewed before launch."}
      </div>
      {msg && <div className="rounded bg-gray-100 p-3 text-sm text-gray-700">{msg}</div>}

      {/* Triggers */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-midnight-navy">Trigger library</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <input className={`${input} sm:col-span-2`} placeholder="Pattern (word/phrase)" value={tp.pattern} onChange={(e) => setTp({ ...tp, pattern: e.target.value })} />
          <select className={input} value={tp.match_type} onChange={(e) => setTp({ ...tp, match_type: e.target.value })}><option value="keyword">keyword</option><option value="phrase">phrase</option><option value="regex">regex</option></select>
          <input className={input} placeholder="risk category (opt)" value={tp.risk_category} onChange={(e) => setTp({ ...tp, risk_category: e.target.value })} />
          <input className={`${input} sm:col-span-1`} placeholder="notes (opt)" value={tp.notes} onChange={(e) => setTp({ ...tp, notes: e.target.value })} />
          <button className={btn} onClick={addTrigger}>Add</button>
        </div>
        <ul className="divide-y rounded border">
          {triggers.length === 0 && <li className="p-3 text-sm text-gray-500">No triggers yet.</li>}
          {triggers.map((t) => (
            <li key={t.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="font-mono">{t.pattern}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{t.match_type}</span>
              {t.risk_category && <span className="text-xs text-gray-500">{t.risk_category}</span>}
              <span className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={t.is_active} onChange={() => toggleTrigger(t)} /> active</label>
                <button className="text-xs text-coral-rose" onClick={() => delTrigger(t.id)}>delete</button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Response language */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-midnight-navy">Supportive response language <span className="text-xs font-normal text-gray-500">(high_risk)</span></h2>
        <p className="text-xs text-gray-500">Supportive, non-diagnostic, non-directive — connects the person to help; does not assess, treat, or advise.</p>
        <input className={input} placeholder="Heading (optional)" value={resp.heading ?? ""} onChange={(e) => setResp({ ...resp, heading: e.target.value })} />
        <textarea className={`${input} min-h-[120px]`} placeholder="Supportive message shown when a trigger fires…" value={resp.message} onChange={(e) => setResp({ ...resp, message: e.target.value })} />
        <input className={input} placeholder="Lead-in above the resource list (optional)" value={resp.resource_intro ?? ""} onChange={(e) => setResp({ ...resp, resource_intro: e.target.value })} />
        <button className={btn} onClick={saveResp}>Save response</button>
      </section>

      {/* Resources */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-midnight-navy">Verified resources</h2>
        <p className="text-xs text-gray-500">Every resource must be professionally sourced + legally verified. Filling &quot;verified by&quot; stamps the verification date.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input className={input} placeholder="Name" value={rf.name} onChange={(e) => setRf({ ...rf, name: e.target.value })} />
          <input className={input} placeholder="Contact (phone/SMS/chat)" value={rf.contact} onChange={(e) => setRf({ ...rf, contact: e.target.value })} />
          <input className={input} placeholder="URL" value={rf.url} onChange={(e) => setRf({ ...rf, url: e.target.value })} />
          <input className={input} placeholder="Jurisdiction (e.g. US)" value={rf.jurisdiction} onChange={(e) => setRf({ ...rf, jurisdiction: e.target.value })} />
          <input className={input} placeholder="Hours (e.g. 24/7)" value={rf.hours} onChange={(e) => setRf({ ...rf, hours: e.target.value })} />
          <input className={input} placeholder="Source" value={rf.source} onChange={(e) => setRf({ ...rf, source: e.target.value })} />
          <input className={`${input} sm:col-span-2`} placeholder="Description (optional)" value={rf.description} onChange={(e) => setRf({ ...rf, description: e.target.value })} />
          <input className={input} placeholder="Verified by" value={rf.verified_by} onChange={(e) => setRf({ ...rf, verified_by: e.target.value })} />
        </div>
        <button className={btn} onClick={addResource}>Add resource</button>
        <ul className="divide-y rounded border">
          {resources.length === 0 && <li className="p-3 text-sm text-gray-500">No resources yet.</li>}
          {resources.map((r) => (
            <li key={r.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="font-semibold">{r.name}</span>
              {r.contact && <span className="text-gray-600">{r.contact}</span>}
              <span className="text-xs text-gray-400">{r.jurisdiction}</span>
              {r.verified_at ? <span className="text-xs text-green-700">verified</span> : <span className="text-xs text-amber-600">unverified</span>}
              <span className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={r.is_active} onChange={() => toggleResource(r)} /> active</label>
                <button className="text-xs text-coral-rose" onClick={() => delResource(r.id)}>delete</button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Audit log */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-midnight-navy">Safety event log <span className="text-xs font-normal text-gray-500">(metadata only)</span></h2>
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-2">When</th><th className="p-2">Level</th><th className="p-2">Context</th><th className="p-2">Matched</th><th className="p-2">Ref</th></tr></thead>
            <tbody>
              {events.length === 0 && <tr><td className="p-3 text-gray-500" colSpan={5}>No safety events.</td></tr>}
              {events.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-2 text-xs text-gray-600">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="p-2">{e.level}</td><td className="p-2">{e.context}</td>
                  <td className="p-2 font-mono text-xs">{e.matched_pattern}</td><td className="p-2 text-xs text-gray-500">{e.situation_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
