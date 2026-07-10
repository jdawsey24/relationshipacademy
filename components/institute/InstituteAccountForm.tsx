"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Professional account: edit name + change password. Reuses the shared account
// endpoint (updates the same profiles row) and Supabase for the password.
export default function InstituteAccountForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameMsg(null);
    const res = await fetch("/api/academy/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name }),
    }).catch(() => null);
    setSavingName(false);
    setNameMsg(res && res.ok ? "Saved." : "Could not save.");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);
    if (password.length < 8) { setPwErr("Please use at least 8 characters."); return; }
    setSavingPw(true);
    const { error } = await getSupabaseBrowserClient().auth.updateUser({ password });
    setSavingPw(false);
    if (error) { setPwErr(error.message || "Could not update password."); return; }
    setPassword("");
    setPwMsg("Password updated.");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveName} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">Profile</h2>
        <label className="mt-4 block font-ui text-sm font-medium text-charcoal">Name
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 h-11 w-full max-w-md rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy" />
        </label>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={savingName} className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {savingName ? "Saving…" : "Save"}
          </button>
          {nameMsg && <span className="font-ui text-sm text-charcoal/60">{nameMsg}</span>}
        </div>
      </form>

      <form onSubmit={changePassword} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">Password</h2>
        <label className="mt-4 block font-ui text-sm font-medium text-charcoal">New password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8}
            className="mt-1 h-11 w-full max-w-md rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy" />
        </label>
        {pwErr && <p className="mt-3 font-body text-sm text-coral-rose">{pwErr}</p>}
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={savingPw || !password} className="rounded-full border border-midnight-navy/20 px-5 py-2 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5 disabled:opacity-50">
            {savingPw ? "Updating…" : "Update password"}
          </button>
          {pwMsg && <span className="font-ui text-sm text-sage-green">{pwMsg}</span>}
        </div>
      </form>
    </div>
  );
}
