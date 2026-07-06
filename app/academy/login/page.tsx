"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AcademyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError("Invalid email or password.");
      setSubmitting(false);
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
          <h1 className="mt-6 font-display text-3xl font-semibold text-midnight-navy">Welcome back</h1>
          <p className="mt-1 font-body text-sm text-charcoal/70">Sign in to the Academy</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-midnight-navy/10 bg-white p-8 shadow-sm">
          <label className="block font-ui text-sm font-medium text-charcoal">
            Email
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" required
              className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
            />
          </label>
          <label className="mt-4 block font-ui text-sm font-medium text-charcoal">
            Password
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" required
              className="mt-1 h-11 w-full rounded-lg border border-light-gray px-3 font-body text-sm outline-none focus:border-midnight-navy"
            />
          </label>

          {error && <p className="mt-4 rounded-lg bg-coral-rose/10 px-3 py-2 font-body text-sm text-coral-rose">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="mt-6 h-11 w-full rounded-full bg-midnight-navy font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-4 flex items-center justify-between font-ui text-sm">
            <Link href="/academy/reset-password" className="text-midnight-navy/70 hover:text-midnight-navy">Forgot password?</Link>
            <Link href="/academy/signup" className="text-midnight-navy/70 hover:text-midnight-navy">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
