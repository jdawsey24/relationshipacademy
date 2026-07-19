"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function CompanionLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function signIn() {
    setBusy(true); setErr(null);
    const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setBusy(false); setErr(error.message); return; }
    window.location.href = "/companion";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold text-midnight-navy">Welcome back</h1>
        <p className="mt-2 text-center font-body text-sm text-charcoal/65">Sign in to your private Companion.</p>
        <div className="mt-6 space-y-2.5">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
            className="w-full rounded-xl border border-light-gray bg-white px-4 py-3 font-body text-sm focus:border-midnight-navy/50 focus:outline-none" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
            onKeyDown={(e) => { if (e.key === "Enter") signIn(); }}
            className="w-full rounded-xl border border-light-gray bg-white px-4 py-3 font-body text-sm focus:border-midnight-navy/50 focus:outline-none" />
          <button onClick={signIn} disabled={busy || !email || !password}
            className="w-full rounded-full bg-midnight-navy py-3 font-ui text-sm font-semibold text-white disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {err && <p className="text-center text-sm text-coral-rose">{err}</p>}
        </div>
        <p className="mt-4 text-center font-body text-xs text-charcoal/45">[ACCOUNT-HELP COPY TO BE PROVIDED]</p>
      </div>
    </main>
  );
}
