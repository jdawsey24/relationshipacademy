"use client";

import { useEffect, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";
import InstallGuide from "@/components/companion/InstallGuide";
import { RELATIONSHIP_STATUSES } from "@/lib/companion";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const NOTIF = [
  { key: "unfinished_reflection", label: "Remind me about unfinished reflections" },
  { key: "personal_checkin", label: "A gentle personal check-in I schedule" },
  { key: "practice_reminder", label: "Remind me about a practice I chose" },
  { key: "email", label: "Send reminders by email" },
  { key: "in_app", label: "Show reminders in the app" },
];

export default function CompanionSettings() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<string>("");
  const [installOpen, setInstallOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/companion/notifications").then((r) => r.ok ? r.json() : null).then((d) => setPrefs(d?.prefs ?? {})).catch(() => {});
  }, []);

  async function saveStatus(key: string) {
    setStatus(key);
    await fetch("/api/companion/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status_key: key }) });
    setMsg("Status updated. Past entries keep the status they had when you wrote them.");
  }
  async function toggleNotif(key: string) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await fetch("/api/companion/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefs: next }) });
  }
  function exportData() { window.location.href = "/api/companion/export"; }
  async function signOutAll() {
    await getSupabaseBrowserClient().auth.signOut({ scope: "global" });
    window.location.href = "/companion/login";
  }
  async function deleteData() {
    // Reauthenticate before a sensitive, irreversible action.
    const email = prompt("For your security, re-enter your email to confirm:");
    const password = email ? prompt("And your password:") : null;
    if (!email || !password) return;
    const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setMsg("Could not confirm your identity."); return; }
    if (!confirm("Permanently delete all your Companion reflections, Blueprint, plans, and milestones? This cannot be undone.")) return;
    const r = await fetch("/api/companion/account", { method: "DELETE" });
    setMsg(r.ok ? "Your Companion data has been deleted." : "Something went wrong.");
  }

  return (
    <CompanionChrome active="none">
      {installOpen && <InstallGuide open onClose={() => setInstallOpen(false)} />}
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Settings</h1>
      {msg && <p className="mt-2 rounded-xl border border-light-gray bg-white p-3 font-body text-sm text-charcoal/70">{msg}</p>}

      <Group title="Relationship status">
        <div className="space-y-2">
          {RELATIONSHIP_STATUSES.map((s) => (
            <button key={s.key} onClick={() => saveStatus(s.key)}
              className={`block w-full rounded-xl border px-4 py-3 text-left font-body text-sm ${status === s.key ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray bg-white text-charcoal/80"}`}>{s.label}</button>
          ))}
        </div>
      </Group>

      <Group title="Reminders" subtitle="All optional. Nothing daily, no pressure.">
        <div className="space-y-2">
          {NOTIF.map((n) => (
            <label key={n.key} className="flex items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3 font-body text-sm text-charcoal/80">
              {n.label}
              <input type="checkbox" checked={!!prefs[n.key]} onChange={() => toggleNotif(n.key)} />
            </label>
          ))}
        </div>
      </Group>

      <Group title="Your phone">
        <button onClick={() => setInstallOpen(true)} className="w-full rounded-xl border border-light-gray bg-white px-4 py-3 text-left font-body text-sm text-midnight-navy">Add Companion to my phone</button>
      </Group>

      <Group title="Your data">
        <div className="space-y-2">
          <button onClick={exportData} className="w-full rounded-xl border border-light-gray bg-white px-4 py-3 text-left font-body text-sm text-midnight-navy">Export my data</button>
          <button onClick={signOutAll} className="w-full rounded-xl border border-light-gray bg-white px-4 py-3 text-left font-body text-sm text-charcoal/80">Sign out of all devices</button>
          <button onClick={deleteData} className="w-full rounded-xl border border-coral-rose/40 bg-white px-4 py-3 text-left font-body text-sm text-coral-rose">Delete my Companion data</button>
        </div>
      </Group>
    </CompanionChrome>
  );
}

function Group({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">{title}</p>
      {subtitle && <p className="mt-0.5 font-body text-xs text-charcoal/55">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}
