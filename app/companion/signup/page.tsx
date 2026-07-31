"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function CompanionSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function createAccount() {
    if (busy) return;
    setErr(null);
    if (password.length < 8) { setErr("Please use at least 8 characters for your password."); return; }
    setBusy(true);
    try {
      // 1) Create the account server-side, pre-confirmed (no email step).
      const res = await fetch("/api/companion/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, full_name: name.trim() || null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || "Could not create your account.");
        setBusy(false);
        return;
      }
      // 2) Sign in immediately, then continue into the Companion (→ purchase flow).
      const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error) { window.location.href = "/companion/login"; return; }
      window.location.href = "/companion";
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const inputCls = "w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight-navy/[0.07] text-midnight-navy">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
        </span>
        <p className="mt-5 font-ui text-eyebrow font-semibold uppercase text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Create your account</h1>
        <p className="mt-2 font-body text-sm text-charcoal/65">Your private space to work through what you&rsquo;re navigating.</p>
        <div className="mt-6 space-y-2.5 text-left">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" placeholder="Name" className={inputCls} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Email" className={inputCls} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="Password (at least 8 characters)"
            onKeyDown={(e) => { if (e.key === "Enter") createAccount(); }} className={inputCls} />
          <button onClick={createAccount} disabled={busy || !email || !password}
            className="w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50">
            {busy ? "Creating your account…" : "Create account"}
          </button>
          {err && <p className="text-center font-body text-sm text-coral-rose">{err}</p>}
        </div>
        <p className="mt-4 font-body text-sm text-charcoal/60">Already have an account? <Link href="/companion/login" className="text-midnight-navy/80 underline underline-offset-2">Sign in</Link></p>
        <p className="mt-3 font-body text-xs text-charcoal/45">By creating an account you agree to the <Link href="/terms" className="underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</p>
      </div>
    </main>
  );
}
