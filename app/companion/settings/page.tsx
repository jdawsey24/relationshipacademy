"use client";

import { useEffect, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";
import InstallGuide from "@/components/companion/InstallGuide";
import { RELATIONSHIP_STATUSES } from "@/lib/companion";
import { STATUS_META } from "@/lib/companion/statusMeta";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const NOTIF = [
  { key: "unfinished_reflection", label: "Remind me about unfinished reflections" },
  { key: "personal_checkin", label: "A gentle personal check-in I schedule" },
  { key: "practice_reminder", label: "Remind me about a practice I chose" },
  { key: "email", label: "Send reminders by email" },
  { key: "in_app", label: "Show reminders in the app" },
];

function Glyph({ paths, size = 20 }: { paths: string[]; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

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
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Settings</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy">Settings</h1>
      {msg && <p className="mt-3 rounded-2xl border border-light-gray bg-white p-3.5 font-body text-sm leading-relaxed text-charcoal/70">{msg}</p>}

      <Group title="Relationship status">
        <div className="space-y-2.5">
          {RELATIONSHIP_STATUSES.map((s) => {
            const sel = status === s.key;
            const m = STATUS_META[s.key];
            return (
              <button key={s.key} onClick={() => saveStatus(s.key)}
                className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3 text-left transition-all ${sel ? "border-midnight-navy bg-midnight-navy/[0.04]" : "border-light-gray bg-white hover:border-midnight-navy/25"}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${sel ? "bg-midnight-navy text-white" : "bg-warm-ivory text-midnight-navy/65"}`}><Glyph paths={m?.icon ?? []} size={18} /></span>
                <span className="flex-1">
                  <span className="block font-display text-[17px] font-semibold text-midnight-navy">{s.label}</span>
                  <span className="block font-body text-[13px] text-charcoal/55">{m?.desc}</span>
                </span>
                <span className={`shrink-0 text-midnight-navy transition-opacity ${sel ? "opacity-100" : "opacity-0"}`} aria-hidden="true"><Glyph paths={["M5 12l5 5 9-11"]} size={17} /></span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Reminders" subtitle="All optional. Nothing daily, no pressure.">
        <div className="space-y-2">
          {NOTIF.map((n) => (
            <label key={n.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-sm text-charcoal/80">
              <span>{n.label}</span>
              <input type="checkbox" checked={!!prefs[n.key]} onChange={() => toggleNotif(n.key)} className="h-4 w-4 shrink-0 accent-midnight-navy" />
            </label>
          ))}
        </div>
      </Group>

      <Group title="Your phone">
        <ActionRow onClick={() => setInstallOpen(true)} icon={["M8 3h8v18H8z", "M11 18h2"]} label="Add Companion to my phone" />
      </Group>

      <Group title="Your data">
        <div className="space-y-2">
          <ActionRow onClick={exportData} icon={["M12 3v12", "M8 11l4 4 4-4", "M5 21h14"]} label="Export my data" />
          <ActionRow onClick={signOutAll} icon={["M14 4h5v16h-5", "M3 12h11", "M9 8l-4 4 4 4"]} label="Sign out of all devices" tone="muted" />
          <ActionRow onClick={deleteData} icon={["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13"]} label="Delete my Companion data" tone="danger" />
        </div>
      </Group>
    </CompanionChrome>
  );
}

function ActionRow({ onClick, icon, label, tone = "primary" }: { onClick: () => void; icon: string[]; label: string; tone?: "primary" | "muted" | "danger" }) {
  const color = tone === "danger" ? "text-coral-rose" : tone === "muted" ? "text-charcoal/70" : "text-midnight-navy";
  const border = tone === "danger" ? "border-coral-rose/40" : "border-light-gray";
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl border ${border} bg-white px-4 py-3 text-left font-body text-sm ${color} transition-colors hover:border-midnight-navy/25`}>
      <span className="shrink-0 opacity-80"><Glyph paths={icon} size={18} /></span>
      <span className="flex-1">{label}</span>
      <span className="shrink-0 text-charcoal/25" aria-hidden="true">→</span>
    </button>
  );
}

function Group({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="font-display text-lg font-semibold text-midnight-navy">{title}</h2>
      {subtitle && <p className="mt-0.5 font-body text-xs text-charcoal/55">{subtitle}</p>}
      <div className="mt-2.5 h-px bg-light-gray" />
      <div className="mt-3">{children}</div>
    </section>
  );
}
