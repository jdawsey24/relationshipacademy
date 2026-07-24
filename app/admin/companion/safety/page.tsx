"use client";

import { useCallback, useEffect, useState } from "react";

// Owner CMS for the Safety V2 registry. Four maintainable sections — trigger
// rules, immediacy terms, response copy, support resources — plus a read-only
// metadata event log. All content is clinician/owner-authored; new rules are
// created INACTIVE and activated explicitly. No raw learner text ever appears here.

const CATEGORIES = ["self_harm", "ipv", "sexual_coercion", "harm_to_others"] as const;
const MATCH_TYPES = ["phrase", "keyword", "regex"] as const;
const KINDS = ["intent", "active_act", "weapon", "confinement", "escalation", "temporal"] as const;
const LEVELS = ["1", "2", "3", "immediate_danger", "digital_safety"] as const;

interface Trigger { id: string; pattern: string; match_type: string; risk_category: string | null; canonical_concept: string | null; severity: number | null; context_required: boolean; negation_sensitive: boolean; registry_version: string; is_active: boolean; updated_by: string | null; updated_at: string | null }
interface Term { id: string; pattern: string; match_type: string; kind: string; implies_category: string | null; registry_version: string; is_active: boolean; updated_by: string | null }
interface Resp { level: string; heading: string | null; message: string; resource_intro: string | null; discreet_mode: boolean; is_active: boolean; updated_by: string | null }
interface Resource { id: string; name: string; description: string | null; contact: string | null; url: string | null; jurisdiction: string; hours: string | null; applies_to_categories: string[]; resource_kind: string | null; applies_to_levels: string[]; is_active: boolean; verified_at: string | null; verified_by: string | null; source: string | null }
interface Ev { id: string; matched_pattern: string | null; level: string; action_level: number | null; immediate_danger: boolean; categories: string[]; context: string | null; situation_ref: string | null; action: string; registry_version: string | null; created_at: string }

async function j(url: string, opts?: RequestInit) {
  const r = await fetch(url, opts);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((body as { error?: string }).error || `Request failed (${r.status})`);
  return body;
}
const isVerified = (r: Resource) => !!(r.verified_at && r.verified_by?.trim() && r.source?.trim());

const input = "w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm";
const btn = "rounded bg-midnight-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40";
const chip = "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600";

export default function SafetyV2Admin() {
  const [tab, setTab] = useState<"triggers" | "immediacy" | "responses" | "resources" | "events">("triggers");
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [responses, setResponses] = useState<Resp[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "warn"; text: string } | null>(null);

  const reload = useCallback(async () => {
    const [t, im, rp, rs, ev] = await Promise.all([
      j("/api/admin/companion/safety/triggers"), j("/api/admin/companion/safety/immediacy"),
      j("/api/admin/companion/safety/responses"), j("/api/admin/companion/safety/resources"),
      j("/api/admin/companion/safety/events"),
    ]);
    setTriggers(t.triggers); setTerms(im.terms); setResponses(rp.responses); setResources(rs.resources); setEvents(ev.events);
  }, []);
  useEffect(() => { reload().catch((e) => setMsg({ kind: "err", text: e.message })); }, [reload]);

  const flash = (kind: "ok" | "err" | "warn", text: string) => { setMsg({ kind, text }); };
  const run = async (fn: () => Promise<unknown>, okText: string) => {
    try { const r = await fn() as { warnings?: string[] }; await reload();
      if (r?.warnings?.length) flash("warn", `${okText} ⚠ ${r.warnings.join(" ")}`); else flash("ok", okText);
    } catch (e) { flash("err", e instanceof Error ? e.message : "Failed"); }
  };

  const TABS = [["triggers", "Trigger rules"], ["immediacy", "Immediacy terms"], ["responses", "Response copy"], ["resources", "Support resources"], ["events", "Event log"]] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-midnight-navy">Companion Safety Registry (V2)</h1>
        <p className="mt-1 text-sm text-gray-600">Maintain the detection registry without code changes. New rules are created <strong>inactive</strong> and must be activated explicitly. Changes affect <strong>future classifications only</strong> and never rewrite historical safety events.</p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-blue-900">
        <p><strong>Severity</strong> (1–3) and <strong>immediate danger</strong> are separate concepts: severity ranks the disclosure; immediate danger is a runtime combination of a disclosure with a present-danger signal.</p>
        <p className="mt-1">A trigger can be <strong>active without being an immediacy term</strong> — immediacy terms are a separate registry.</p>
        <p className="mt-1">&ldquo;No safety signal detected&rdquo; does <strong>not</strong> mean the learner is safe — it only means no rule matched.</p>
      </div>

      {msg && <div className={`rounded p-3 text-sm ${msg.kind === "ok" ? "bg-green-50 text-green-800" : msg.kind === "warn" ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-800"}`}>{msg.text}</div>}

      <div className="flex flex-wrap gap-1 border-b">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-t px-3 py-2 text-sm font-medium ${tab === k ? "border border-b-white bg-white text-midnight-navy" : "text-gray-500 hover:text-gray-800"}`}>{label}</button>
        ))}
      </div>

      {tab === "triggers" && <TriggersTab triggers={triggers} run={run} />}
      {tab === "immediacy" && <ImmediacyTab terms={terms} run={run} />}
      {tab === "responses" && <ResponsesTab responses={responses} run={run} />}
      {tab === "resources" && <ResourcesTab resources={resources} run={run} />}
      {tab === "events" && <EventsTab events={events} />}
    </div>
  );
}

type Run = (fn: () => Promise<unknown>, okText: string) => Promise<void>;

// ---------------- Triggers ----------------
const emptyTrigger = { pattern: "", match_type: "phrase", risk_category: "self_harm", canonical_concept: "", severity: 2, context_required: true, negation_sensitive: true };
function TriggersTab({ triggers, run }: { triggers: Trigger[]; run: Run }) {
  const [f, setF] = useState({ ...emptyTrigger });
  const [editing, setEditing] = useState<string | null>(null);
  const [ef, setEf] = useState<Partial<Trigger>>({});

  const create = () => run(() => j("/api/admin/companion/safety/triggers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }), "Trigger created (inactive).").then(() => setF({ ...emptyTrigger }));
  const patch = (id: string, body: Record<string, unknown>, ok: string) => run(() => j(`/api/admin/companion/safety/triggers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), ok);
  const del = (id: string) => { if (confirm("Delete this rule? (Rules referenced by past events cannot be deleted — deactivate instead.)")) run(() => j(`/api/admin/companion/safety/triggers/${id}`, { method: "DELETE" }), "Trigger deleted."); };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Fields: risk category · canonical concept · pattern · match type · severity · context required · negation sensitive · version · active.</p>
      <div className="grid grid-cols-2 gap-2 rounded border bg-gray-50 p-3 sm:grid-cols-4">
        <select className={input} value={f.risk_category} onChange={(e) => setF({ ...f, risk_category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <input className={input} placeholder="canonical concept" value={f.canonical_concept} onChange={(e) => setF({ ...f, canonical_concept: e.target.value })} />
        <input className={`${input} sm:col-span-2`} placeholder="pattern (word / phrase / regex)" value={f.pattern} onChange={(e) => setF({ ...f, pattern: e.target.value })} />
        <select className={input} value={f.match_type} onChange={(e) => setF({ ...f, match_type: e.target.value })}>{MATCH_TYPES.map((m) => <option key={m}>{m}</option>)}</select>
        <select className={input} value={f.severity} onChange={(e) => setF({ ...f, severity: Number(e.target.value) })}><option value={1}>severity 1 — ambiguous</option><option value={2}>severity 2 — clear</option><option value={3}>severity 3 — acute/high-risk</option></select>
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.context_required} onChange={(e) => setF({ ...f, context_required: e.target.checked })} /> context required</label>
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.negation_sensitive} onChange={(e) => setF({ ...f, negation_sensitive: e.target.checked })} /> negation sensitive</label>
        <button className={`${btn} sm:col-span-4`} onClick={create}>Create rule (inactive)</button>
      </div>

      <ul className="divide-y rounded border">
        {triggers.length === 0 && <li className="p-3 text-sm text-gray-500">No trigger rules yet.</li>}
        {triggers.map((t) => (
          <li key={t.id} className="p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono">{t.pattern}</span>
              <span className={chip}>{t.risk_category}</span>
              <span className={chip}>sev {t.severity}</span>
              <span className={chip}>{t.match_type}</span>
              {t.canonical_concept && <span className="text-xs text-gray-400">{t.canonical_concept}</span>}
              <span className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={t.is_active} onChange={() => patch(t.id, { is_active: !t.is_active }, t.is_active ? "Deactivated." : "Activated.")} /> active</label>
                <button className="text-xs text-blue-600" onClick={() => { setEditing(editing === t.id ? null : t.id); setEf(t); }}>edit</button>
                <button className="text-xs text-coral-rose" onClick={() => del(t.id)}>delete</button>
              </span>
            </div>
            {editing === t.id && (
              <div className="mt-2 grid grid-cols-2 gap-2 rounded bg-gray-50 p-2 sm:grid-cols-4">
                <input className={`${input} sm:col-span-2`} value={ef.pattern ?? ""} onChange={(e) => setEf({ ...ef, pattern: e.target.value })} />
                <select className={input} value={ef.match_type} onChange={(e) => setEf({ ...ef, match_type: e.target.value })}>{MATCH_TYPES.map((m) => <option key={m}>{m}</option>)}</select>
                <select className={input} value={ef.severity ?? 2} onChange={(e) => setEf({ ...ef, severity: Number(e.target.value) })}>{[1, 2, 3].map((s) => <option key={s} value={s}>severity {s}</option>)}</select>
                <input className={input} value={ef.canonical_concept ?? ""} onChange={(e) => setEf({ ...ef, canonical_concept: e.target.value })} placeholder="canonical concept" />
                <select className={input} value={ef.risk_category ?? ""} onChange={(e) => setEf({ ...ef, risk_category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!ef.context_required} onChange={(e) => setEf({ ...ef, context_required: e.target.checked })} /> context required</label>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!ef.negation_sensitive} onChange={(e) => setEf({ ...ef, negation_sensitive: e.target.checked })} /> negation sensitive</label>
                <button className={`${btn} sm:col-span-4`} onClick={() => patch(t.id, { pattern: ef.pattern, match_type: ef.match_type, severity: ef.severity, canonical_concept: ef.canonical_concept, risk_category: ef.risk_category, context_required: ef.context_required, negation_sensitive: ef.negation_sensitive }, "Rule saved.").then(() => setEditing(null))}>Save changes</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Immediacy ----------------
function ImmediacyTab({ terms, run }: { terms: Term[]; run: Run }) {
  const [f, setF] = useState({ pattern: "", match_type: "phrase", kind: "intent", implies_category: "" });
  const create = () => run(() => j("/api/admin/companion/safety/immediacy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }), "Immediacy term created (inactive).").then(() => setF({ pattern: "", match_type: "phrase", kind: "intent", implies_category: "" }));
  const patch = (id: string, body: Record<string, unknown>, ok: string) => run(() => j(`/api/admin/companion/safety/immediacy/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), ok);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Immediacy terms are separate from triggers. A weapon term is category-neutral (leave &ldquo;implies category&rdquo; blank); an overdose act may imply self_harm.</p>
      <div className="grid grid-cols-2 gap-2 rounded border bg-gray-50 p-3 sm:grid-cols-4">
        <input className={`${input} sm:col-span-2`} placeholder="pattern" value={f.pattern} onChange={(e) => setF({ ...f, pattern: e.target.value })} />
        <select className={input} value={f.match_type} onChange={(e) => setF({ ...f, match_type: e.target.value })}>{MATCH_TYPES.map((m) => <option key={m}>{m}</option>)}</select>
        <select className={input} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
        <select className={input} value={f.implies_category} onChange={(e) => setF({ ...f, implies_category: e.target.value })}><option value="">implies: (none)</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <button className={`${btn} sm:col-span-3`} onClick={create}>Create term (inactive)</button>
      </div>
      <ul className="divide-y rounded border">
        {terms.length === 0 && <li className="p-3 text-sm text-gray-500">No immediacy terms yet.</li>}
        {terms.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
            <span className="font-mono">{t.pattern}</span>
            <span className={chip}>{t.kind}</span>
            <span className={chip}>{t.match_type}</span>
            {t.implies_category && <span className="text-xs text-gray-400">implies {t.implies_category}</span>}
            <label className="ml-auto flex items-center gap-1 text-xs"><input type="checkbox" checked={t.is_active} onChange={() => patch(t.id, { is_active: !t.is_active }, t.is_active ? "Deactivated." : "Activated.")} /> active</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Responses ----------------
function ResponsesTab({ responses, run }: { responses: Resp[]; run: Run }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Supportive, non-diagnostic, non-directive copy per protocol level. Never assert the person is safe or define the relationship. Save is explicit per level.</p>
      {LEVELS.map((lv) => <ResponseEditor key={lv} level={lv} existing={responses.find((r) => r.level === lv)} run={run} />)}
    </div>
  );
}
function ResponseEditor({ level, existing, run }: { level: string; existing?: Resp; run: Run }) {
  const [f, setF] = useState<Resp>(existing ?? { level, heading: "", message: "", resource_intro: "", discreet_mode: level === "digital_safety", is_active: true, updated_by: null });
  useEffect(() => { if (existing) setF(existing); }, [existing]);
  const save = () => run(() => j("/api/admin/companion/safety/responses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, level }) }), `Response “${level}” saved.`);
  return (
    <div className="space-y-2 rounded border p-3">
      <div className="flex items-center gap-2"><span className="rounded bg-midnight-navy px-2 py-0.5 text-xs font-semibold text-white">level {level}</span>{existing?.updated_by && <span className="text-xs text-gray-400">last by {existing.updated_by}</span>}</div>
      <input className={input} placeholder="heading" value={f.heading ?? ""} onChange={(e) => setF({ ...f, heading: e.target.value })} />
      <textarea className={`${input} min-h-[80px]`} placeholder="message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.discreet_mode} onChange={(e) => setF({ ...f, discreet_mode: e.target.checked })} /> discreet mode</label>
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> active</label>
        <button className={btn} onClick={save}>Save</button>
      </div>
    </div>
  );
}

// ---------------- Resources ----------------
function ResourcesTab({ resources, run }: { resources: Resource[]; run: Run }) {
  const [f, setF] = useState({ name: "", contact: "", url: "", jurisdiction: "US", hours: "", resource_kind: "", description: "", source: "", verified_by: "", verify: false });
  const create = () => {
    const body = { ...f, verified_at: f.verify && f.verified_by ? new Date().toISOString() : null };
    run(() => j("/api/admin/companion/safety/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), "Resource created (inactive).").then(() => setF({ name: "", contact: "", url: "", jurisdiction: "US", hours: "", resource_kind: "", description: "", source: "", verified_by: "", verify: false }));
  };
  const patch = (id: string, body: Record<string, unknown>, ok: string) => run(() => j(`/api/admin/companion/safety/resources/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), ok);
  const del = (id: string) => { if (confirm("Delete this resource?")) run(() => j(`/api/admin/companion/safety/resources/${id}`, { method: "DELETE" }), "Resource deleted."); };
  const verifyNow = (r: Resource) => {
    const by = prompt("Verifier name/role (verified_by):", r.verified_by ?? ""); if (by === null) return;
    const src = prompt("Source (where confirmed):", r.source ?? ""); if (src === null) return;
    if (!by.trim() || !src.trim()) { alert("A verified resource needs both a verifier and a source."); return; }
    patch(r.id, { verified_by: by, source: src, verified_at: new Date().toISOString() }, "Resource verification saved.");
  };
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Route by category + jurisdiction. A resource is only shown as <strong>Verified</strong> when it has a verifier, a source, and a verification date — filling all three stamps verification.</p>
      <div className="grid grid-cols-2 gap-2 rounded border bg-gray-50 p-3 sm:grid-cols-4">
        <input className={input} placeholder="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={input} placeholder="contact" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
        <input className={input} placeholder="url" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
        <input className={input} placeholder="jurisdiction (US / GLOBAL)" value={f.jurisdiction} onChange={(e) => setF({ ...f, jurisdiction: e.target.value })} />
        <input className={input} placeholder="hours" value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} />
        <input className={input} placeholder="resource_kind (suicide_crisis / ipv / sexual_assault / emergency)" value={f.resource_kind} onChange={(e) => setF({ ...f, resource_kind: e.target.value })} />
        <input className={`${input} sm:col-span-2`} placeholder="description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <input className={input} placeholder="source" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} />
        <input className={input} placeholder="verified by" value={f.verified_by} onChange={(e) => setF({ ...f, verified_by: e.target.value })} />
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.verify} onChange={(e) => setF({ ...f, verify: e.target.checked })} /> stamp verified now</label>
        <button className={`${btn} sm:col-span-4`} onClick={create}>Create resource (inactive)</button>
      </div>
      <ul className="divide-y rounded border">
        {resources.length === 0 && <li className="p-3 text-sm text-gray-500">No resources yet.</li>}
        {resources.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
            <span className="font-semibold">{r.name}</span>
            {r.contact && <span className="text-gray-600">{r.contact}</span>}
            <span className={chip}>{r.jurisdiction}</span>
            {r.resource_kind && <span className={chip}>{r.resource_kind}</span>}
            {isVerified(r) ? <span className="text-xs font-semibold text-green-700">Verified · {r.verified_by}</span> : <span className="text-xs font-semibold text-amber-600">Unverified</span>}
            <span className="ml-auto flex items-center gap-3">
              <button className="text-xs text-blue-600" onClick={() => verifyNow(r)}>set verification</button>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={r.is_active} onChange={() => patch(r.id, { is_active: !r.is_active }, r.is_active ? "Deactivated." : "Activated.")} /> active</label>
              <button className="text-xs text-coral-rose" onClick={() => del(r.id)}>delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Events (read-only, metadata only) ----------------
function EventsTab({ events }: { events: Ev[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Read-only, <strong>metadata only</strong> — no raw learner disclosures are stored or shown. &ldquo;matched&rdquo; is the clinician concept, not learner text.</p>
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-2">When</th><th className="p-2">Level</th><th className="p-2">Immediate</th><th className="p-2">Categories</th><th className="p-2">Context</th><th className="p-2">Concept</th><th className="p-2">Registry</th></tr></thead>
          <tbody>
            {events.length === 0 && <tr><td className="p-3 text-gray-500" colSpan={7}>No safety events.</td></tr>}
            {events.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2 text-xs text-gray-600">{new Date(e.created_at).toLocaleString()}</td>
                <td className="p-2">{e.action_level ?? e.level}</td>
                <td className="p-2">{e.immediate_danger ? "yes" : "—"}</td>
                <td className="p-2 text-xs">{(e.categories ?? []).join(", ")}</td>
                <td className="p-2 text-xs">{e.context}</td>
                <td className="p-2 font-mono text-xs">{e.matched_pattern}</td>
                <td className="p-2 text-xs text-gray-400">{e.registry_version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
