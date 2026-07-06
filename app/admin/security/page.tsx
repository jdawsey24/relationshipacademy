"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type Status = "loading" | "none" | "enrolling" | "enabled" | "error";

export default function SecurityPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [enroll, setEnroll] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data, error: e } = await supabase.auth.mfa.listFactors();
    if (e) { setStatus("error"); return; }
    const verified = (data?.totp ?? []).some((f) => f.status === "verified");
    setStatus(verified ? "enabled" : "none");
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function startEnroll() {
    setError(null); setBusy(true);
    const supabase = getSupabaseBrowserClient();
    // Clear any stale, never-verified factor first so re-enrolling stays clean.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.totp ?? []) {
      if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error: e } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setBusy(false);
    if (e || !data) { setError("Couldn't start setup. Please try again."); return; }
    setEnroll({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    setStatus("enrolling");
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enroll) return;
    setError(null); setBusy(true);
    const supabase = getSupabaseBrowserClient();
    const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId: enroll.factorId });
    if (chErr || !challenge) { setError("Verification failed to start. Try again."); setBusy(false); return; }
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId: enroll.factorId, challengeId: challenge.id, code: code.trim() });
    setBusy(false);
    if (vErr) { setError("That code didn't match. Try the current code from your app."); return; }
    setEnroll(null); setCode("");
    flash("Two-factor authentication is on.");
    refresh();
  }

  async function disable() {
    if (!confirm("Turn off two-factor authentication for your account? You'll sign in with just your password.")) return;
    setBusy(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.mfa.listFactors();
    for (const f of data?.totp ?? []) await supabase.auth.mfa.unenroll({ factorId: f.id });
    setBusy(false);
    flash("Two-factor authentication turned off.");
    refresh();
  }

  return (
    <div className="relative max-w-xl">
      {toast && <div className="fixed right-6 top-6 z-50 rounded-md bg-sage-green px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Security</h1>
      <p className="mb-6 text-sm text-charcoal/60">Protect your admin account with two-factor authentication (2FA) using an authenticator app.</p>

      {status === "loading" && <p className="text-sm text-charcoal/60">Loading…</p>}
      {status === "error" && <p className="text-sm text-coral-rose">Couldn&apos;t load your security settings.</p>}

      {status === "enabled" && (
        <div className="rounded-lg border border-light-gray bg-white p-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-sage-green" />
            <span className="font-medium text-midnight-navy">Two-factor authentication is on</span>
          </div>
          <p className="mt-2 text-sm text-charcoal/70">You&apos;ll be asked for a code from your authenticator app each time you sign in.</p>
          <button type="button" onClick={disable} disabled={busy} className="mt-4 rounded-md border border-coral-rose px-4 py-2 text-sm font-medium text-coral-rose hover:bg-coral-rose/5 disabled:opacity-50">
            Turn off two-factor
          </button>
        </div>
      )}

      {status === "none" && (
        <div className="rounded-lg border border-light-gray bg-white p-6">
          <p className="text-sm text-charcoal">Two-factor authentication is <span className="font-semibold">off</span>. Add it to require a one-time code at sign-in.</p>
          <button type="button" onClick={startEnroll} disabled={busy} className="mt-4 rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
            {busy ? "Starting…" : "Set up two-factor"}
          </button>
          {error && <p className="mt-3 text-sm text-coral-rose">{error}</p>}
        </div>
      )}

      {status === "enrolling" && enroll && (
        <form onSubmit={confirmEnroll} className="rounded-lg border border-light-gray bg-white p-6">
          <ol className="space-y-4 text-sm text-charcoal">
            <li><span className="font-semibold">1.</span> Scan this QR code with an authenticator app (Google Authenticator, 1Password, Authy…).</li>
          </ol>
          <div className="my-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={enroll.qr} alt="Two-factor QR code" className="h-44 w-44" />
          </div>
          <p className="text-center text-xs text-charcoal/60">Can&apos;t scan? Enter this key manually:</p>
          <p className="mb-4 break-all text-center font-mono text-xs text-charcoal">{enroll.secret}</p>
          <label className="block text-sm font-medium text-charcoal">
            <span className="font-semibold">2.</span> Enter the 6-digit code it shows
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus
              className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-center text-lg tracking-[0.4em] outline-none focus:border-midnight-navy" />
          </label>
          {error && <p className="mt-3 text-sm text-coral-rose">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={busy || code.length < 6} className="rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
              {busy ? "Verifying…" : "Turn on two-factor"}
            </button>
            <button type="button" onClick={() => { setEnroll(null); setCode(""); setStatus("none"); }} className="text-sm text-charcoal/60 hover:text-charcoal">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
