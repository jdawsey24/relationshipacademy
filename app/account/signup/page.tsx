"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Neutral account sign-up — the shared identity behind purchases. NOT the Academy:
// creating an account does not enrol you in the Academy. Honors a same-origin
// ?next= so a buyer returns to finish checkout.
export default function AccountSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Read the query string client-side after mount so SSR and first client render
  // agree (avoids a hydration mismatch on the ?next=-carrying links).
  const [nextParam, setNextParam] = useState("");
  useEffect(() => { setNextParam(window.location.search); }, []);

  function safeNext(): string {
    const raw = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
    return raw && /^\/(?!\/)/.test(raw) ? raw : "/";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Please use at least 8 characters for your password.");
      return;
    }
    setSubmitting(true);
    try {
      // Create the account server-side, pre-confirmed (no email step). The signup
      // endpoint only creates the shared account + a free profile — no Academy access.
      const res = await fetch("/api/academy/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, full_name: name.trim() || null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Could not create your account.");
        setSubmitting(false);
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) {
        router.push(`/account/login${typeof window !== "undefined" ? window.location.search : ""}`);
        return;
      }
      router.push(safeNext());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo variant="full" href="/" className="mx-auto h-10" />
          <h1 className="mt-6 font-display text-3xl font-semibold text-midnight-navy">Create your account</h1>
          <p className="mt-1 font-body text-sm text-charcoal/70">One account for your purchases — takes a moment</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-midnight-navy/10 bg-white p-8 shadow-sm">
          <label className="block font-ui text-sm font-medium text-charcoal">
            Name
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
              className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
            />
          </label>
          <label className="mt-4 block font-ui text-sm font-medium text-charcoal">
            Email
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required
              className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
            />
          </label>
          <label className="mt-4 block font-ui text-sm font-medium text-charcoal">
            Password
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
            {submitting ? "Creating…" : "Create account"}
          </button>

          <p className="mt-4 text-center font-ui text-sm text-midnight-navy/70">
            Already have an account? <Link href={`/account/login${nextParam}`} className="underline underline-offset-4 hover:text-midnight-navy">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
