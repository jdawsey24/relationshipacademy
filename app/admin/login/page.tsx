"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
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
    // Session cookie is set; go to the dashboard.
    router.push("/admin/leads");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-light-gray p-8"
      >
        <h1 className="text-xl font-semibold text-midnight-navy">RLC Admin</h1>
        <p className="mt-1 text-sm text-charcoal/60">Sign in to continue</p>

        <label className="mt-6 block text-sm font-medium text-charcoal">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-charcoal">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-1 h-11 w-full rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-md bg-coral-rose/10 px-3 py-2 text-sm text-coral-rose">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 h-11 w-full rounded-md bg-midnight-navy text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
