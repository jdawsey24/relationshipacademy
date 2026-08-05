"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Where a guest purchase finishes becoming an account (owner decision 2026-08-04:
// "the person needs to pay and then they can create the account. once the account
// has been created, their playbook will be there").
//
// The buyer arrives from the one-time link in the delivery email, which puts
// Supabase into a recovery session. All that's left is choosing a password — the
// entitlement was already written by the webhook, so the Playbook is sitting in
// their library the moment they land.
//
// Deliberately NOT under /academy: this is the neutral account doorway, and buying
// a Playbook grants no Academy access (see the account/Academy separation).
export default function SetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    // The link may already have been exchanged before this listener attaches, so
    // check for an existing session too rather than waiting only on the event.
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function save(e: React.FormEvent) {
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
      setError(err.message || "Could not save your password.");
      return;
    }
    router.push("/library");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo variant="full" href="/" className="mx-auto h-10" />
          <h1 className="mt-6 font-display text-3xl font-semibold text-midnight-navy">
            Finish setting up your account
          </h1>
          <p className="mt-3 font-body text-charcoal/70">
            Choose a password and your Playbook is waiting for you.
          </p>
        </div>

        {ready ? (
          <form onSubmit={save} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block font-ui text-sm font-medium text-midnight-navy">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-body text-charcoal outline-none transition-colors focus:border-midnight-navy"
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p className="font-body text-sm text-coral-rose">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save & Open My Playbook"}
            </button>
          </form>
        ) : (
          // No recovery session — the link was already used or has expired. Don't
          // dead-end them: their purchase is safe, a fresh link is one step away.
          <div className="rounded-2xl border border-light-gray bg-white p-6 text-center">
            <p className="font-body text-charcoal/75">
              This link has expired or was already used. Your purchase is safe — request a fresh link and
              your Playbook will be right where you left it.
            </p>
            <a
              href="/academy/reset-password"
              className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-midnight-navy px-7 font-ui text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Send me a new link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
