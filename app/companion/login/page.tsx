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

  const inputCls = "w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight-navy/[0.07] text-midnight-navy">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            <path d="M6 11h12v9H6z" />
            <path d="M12 15v2" />
          </svg>
        </span>
        <p className="mt-5 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Welcome back</h1>
        <p className="mt-2 font-body text-sm text-charcoal/65">Sign in to your private Companion.</p>
        <div className="mt-6 space-y-2.5 text-left">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={inputCls} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
            onKeyDown={(e) => { if (e.key === "Enter") signIn(); }} className={inputCls} />
          <button onClick={signIn} disabled={busy || !email || !password}
            className="w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {err && <p className="text-center font-body text-sm text-coral-rose">{err}</p>}
        </div>
        <p className="mt-4 font-body text-xs text-charcoal/45">[ACCOUNT-HELP COPY TO BE PROVIDED]</p>
      </div>
    </main>
  );
}
