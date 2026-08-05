import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { keyForClusterId } from "@/lib/playbook/keys";
import { getPlaybookContent } from "@/content/playbook";
import { getSupabaseAdminClient } from "@/lib/supabase";
import SectionLabel from "@/components/site/SectionLabel";

export const dynamic = "force-dynamic";

// Where Stripe returns an embedded-checkout buyer. Read-only confirmation: the
// WEBHOOK grants access (single source of truth) — this page just reports what
// happened and points at the Playbook. If the webhook hasn't landed yet the copy
// says so rather than implying something failed.
async function playbookNameFor(clusterId: number, key: string): Promise<string> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("snapshot_clusters").select("playbook_subtitle").eq("id", clusterId).maybeSingle();
    const sub = (data as { playbook_subtitle?: string | null } | null)?.playbook_subtitle;
    if (sub) return sub;
  } catch { /* fall through */ }
  return getPlaybookContent(key)?.displayName ?? "Your Playbook";
}

export default async function PurchaseCompletePage(
  { searchParams }: { searchParams?: Promise<{ session_id?: string }> },
) {
  const checkoutSessionId = (await searchParams)?.session_id;

  let paid = false;
  let key: string | null = null;
  let name = "Your Playbook";

  if (checkoutSessionId && stripeConfigured()) {
    try {
      const s = await getStripe().checkout.sessions.retrieve(checkoutSessionId);
      paid = s.payment_status === "paid" || s.status === "complete";
      const clusterId = Number(s.metadata?.cluster_id);
      if (Number.isInteger(clusterId)) {
        key = keyForClusterId(clusterId);
        if (key) name = await playbookNameFor(clusterId, key);
      }
    } catch { /* fall through to the generic message */ }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <SectionLabel>{paid ? "You're all set" : "Thanks"}</SectionLabel>
      <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy">
        {paid ? `${name} is yours.` : "Your purchase is being confirmed."}
      </h1>
      <p className="mt-6 font-body text-lg leading-relaxed text-charcoal/75">
        {paid
          ? "It's in your library from now on — take it at your own pace and come back whenever you need it."
          : "This can take a few seconds. Your Playbook will appear in your library as soon as it's confirmed."}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        {key && (
          <Link href={`/playbook/${key}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90">
            Open {name} →
          </Link>
        )}
        <Link href="/playbooks" className="font-ui text-sm text-midnight-navy/70 underline underline-offset-4 hover:text-midnight-navy">
          Go to my library
        </Link>
      </div>
    </main>
  );
}
