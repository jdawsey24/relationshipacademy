"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "mfa">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If we arrive with a password-only (AAL1) session that still owes an MFA
  // step (e.g. the page was refreshed mid-login), resume at the code step.
  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      try {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totp = factors?.totp?.[0];
          if (totp) { setFactorId(totp.id); setStep("mfa"); }
        }
      } catch { /* ignore — fall back to password step */ }
    })();
  }, []);

  function finish() {
    router.push("/admin");
    router.refresh();
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }
    // Does this account have MFA enrolled? If so, require the code.
    try {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totp = factors?.totp?.[0];
        if (totp) {
          setFactorId(totp.id);
          setStep("mfa");
          setSubmitting(false);
          return;
        }
      }
    } catch { /* ignore — proceed without MFA */ }
    finish();
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setError(null);
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr || !challenge) {
      setError("Could not start verification. Please try again.");
      setSubmitting(false);
      return;
    }
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code: code.trim() });
    if (vErr) {
      setError("Invalid code. Please try again.");
      setSubmitting(false);
      return;
    }
    finish();
  }

  async function startOver() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setStep("password");
    setPassword("");
    setCode("");
    setFactorId(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      {step === "password" ? (
        <form onSubmit={handlePassword} className="w-full max-w-sm rounded-lg border border-light-gray p-8">
          <h1 className="text-xl font-semibold text-midnight-navy">RLC Admin</h1>
          <p className="mt-1 text-sm text-charcoal/60">Sign in to continue</p>

          <label className="mt-6 block text-sm font-medium text-charcoal">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required
              className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
          </label>

          <label className="mt-4 block text-sm font-medium text-charcoal">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required
              className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
          </label>

          {error && <p className="mt-4 rounded-md bg-coral-rose/10 px-3 py-2 text-sm text-coral-rose">{error}</p>}

          <button type="submit" disabled={submitting}
            className="mt-6 h-11 w-full rounded-md bg-midnight-navy text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMfa} className="w-full max-w-sm rounded-lg border border-light-gray p-8">
          <h1 className="text-xl font-semibold text-midnight-navy">Two-factor verification</h1>
          <p className="mt-1 text-sm text-charcoal/60">Enter the 6-digit code from your authenticator app.</p>

          <label className="mt-6 block text-sm font-medium text-charcoal">
            Authentication code
            <input
              type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6}
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus required
              className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-center text-lg tracking-[0.4em] outline-none focus:border-midnight-navy" />
          </label>

          {error && <p className="mt-4 rounded-md bg-coral-rose/10 px-3 py-2 text-sm text-coral-rose">{error}</p>}

          <button type="submit" disabled={submitting || code.length < 6}
            className="mt-6 h-11 w-full rounded-md bg-midnight-navy text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50">
            {submitting ? "Verifying…" : "Verify"}
          </button>
          <button type="button" onClick={startOver} className="mt-3 w-full text-center text-sm text-charcoal/60 hover:text-charcoal">
            Start over
          </button>
        </form>
      )}
    </div>
  );
}
