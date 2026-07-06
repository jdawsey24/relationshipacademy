"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Two modes in one page:
//   • "request" — enter your email, we send a recovery link.
//   • "update"  — you arrived from that link (Supabase set a recovery session);
//     choose a new password.
export default function AcademyResetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("update");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/academy/reset-password` : undefined,
    });
    setSubmitting(false);
    // Always show the same message so we don't reveal whether an email exists.
    if (err) console.error("[reset]", err.message);
    setNotice("If that email has an account, a reset link is on its way.");
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Please use at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (err) {
      setError(err.message || "Could not update your password.");
      return;
    }
    router.push("/academy/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo variant="full" href="/" className="mx-auto h-10" />
          <h1 className="mt-6 font-display text-3xl font-semibold text-midnight-navy">
            {mode === "request" ? "Reset your password" : "Choose a new password"}
          </h1>
        </div>

        {mode === "request" ? (
          <form onSubmit={requestReset} className="rounded-2xl border border-midnight-navy/10 bg-white p-8 shadow-sm">
            <label className="block font-ui text-sm font-medium text-charcoal">
              Email
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required
                className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
              />
            </label>
            {notice && <p className="mt-4 rounded-lg bg-sage-green/15 px-3 py-2 font-body text-sm text-midnight-navy">{notice}</p>}
            <button
              type="submit" disabled={submitting}
              className="mt-6 h-11 w-full rounded-full bg-midnight-navy font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </button>
            <p className="mt-4 text-center font-ui text-sm text-midnight-navy/70">
              <Link href="/academy/login" className="underline underline-offset-4 hover:text-midnight-navy">Back to sign in</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={updatePassword} className="rounded-2xl border border-midnight-navy/10 bg-white p-8 shadow-sm">
            <label className="block font-ui text-sm font-medium text-charcoal">
              New password
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" required minLength={8}
                className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
              />
            </label>
            {error && <p className="mt-4 rounded-lg bg-coral-rose/10 px-3 py-2 font-body text-sm text-coral-rose">{error}</p>}
            <button
              type="submit" disabled={submitting}
              className="mt-6 h-11 w-full rounded-full bg-midnight-navy font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
