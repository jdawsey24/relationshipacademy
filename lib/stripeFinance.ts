import type Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { normalizeToMonthly } from "@/lib/finance";

// Server-only. Writes the Stripe → Supabase reporting layer. Stripe stays
// authoritative; upserts are idempotent (keyed by Stripe object id). Amounts are
// integer minor units. Stripe field access goes through LOOSE shapes so this
// keeps working across Stripe API versions (several fields moved in the 2025
// redesign — e.g. subscription period → items, discount → discounts).

const now = () => new Date().toISOString();
export function unixToIso(sec: number | null | undefined): string | null {
  return typeof sec === "number" ? new Date(sec * 1000).toISOString() : null;
}

type Ref = string | { id?: string } | null | undefined;
const refId = (r: Ref): string | null => (typeof r === "string" ? r : r?.id) ?? null;

interface LooseCoupon { percent_off?: number | null; amount_off?: number | null }
interface LoosePrice { id?: string; product?: Ref; currency?: string; unit_amount?: number | null; metadata?: Record<string, string>; recurring?: { interval?: string; interval_count?: number } | null }
interface LooseSubItem { price?: LoosePrice; quantity?: number; current_period_start?: number; current_period_end?: number }
interface LooseSub {
  id: string; customer?: Ref; status: string; livemode?: boolean; created?: number; currency?: string;
  items: { data: LooseSubItem[] };
  current_period_start?: number; current_period_end?: number;
  trial_start?: number | null; trial_end?: number | null;
  cancel_at?: number | null; canceled_at?: number | null; cancel_at_period_end?: boolean;
  discount?: { coupon?: LooseCoupon } | null; discounts?: Array<{ coupon?: LooseCoupon }>;
  latest_invoice?: Ref;
}
interface LooseCharge { id: string; invoice?: Ref; payment_intent?: Ref; customer?: Ref; balance_transaction?: Ref; billing_details?: { email?: string | null }; receipt_email?: string | null; metadata?: Record<string, string>; refunds?: { data?: Array<{ id: string; balance_transaction?: Ref }> } }
interface LooseInvoice { id: string; subscription?: Ref; parent?: { subscription_details?: { subscription?: Ref } } }
interface LooseBT { id: string; type: string; amount: number; fee: number; net: number; currency: string; available_on?: number; created?: number; source?: unknown; livemode?: boolean }
interface LooseDispute { id: string; charge?: Ref; payment_intent?: Ref; amount: number; currency: string; status: string; reason: string; evidence_details?: { due_by?: number | null }; is_charge_refundable?: boolean; created: number; livemode?: boolean }
interface LoosePayout { id: string; amount: number; currency: string; status: string; arrival_date?: number | null; created: number; livemode?: boolean }
interface LooseInvoiceFailed { id: string; subscription?: Ref; parent?: { subscription_details?: { subscription?: Ref } }; customer?: Ref; customer_email?: string | null; amount_due: number; currency: string; attempt_count?: number; next_payment_attempt?: number | null; status?: string | null; created: number; livemode?: boolean }

function invoiceSubId(inv: LooseInvoice | LooseInvoiceFailed): string | null {
  return refId(inv.subscription) ?? refId(inv.parent?.subscription_details?.subscription);
}

// ---------------------------------------------------------------------------
// Event status machine (received → processing → processed | failed). Resilient:
// returns "skip" if the finance layer is unavailable so the webhook never breaks.
// ---------------------------------------------------------------------------
export async function claimEvent(event: Stripe.Event): Promise<"process" | "skip"> {
  try {
    const s = getSupabaseAdminClient();
    const { data: existing, error } = await s.from("stripe_events").select("status, attempts").eq("id", event.id).maybeSingle();
    if (error) return "skip";
    if (existing?.status === "processed") return "skip";
    const { error: upErr } = await s.from("stripe_events").upsert(
      { id: event.id, type: event.type, livemode: event.livemode, api_version: event.api_version ?? null, created: unixToIso(event.created), status: "processing", attempts: (existing?.attempts ?? 0) + 1, updated_at: now() },
      { onConflict: "id" }
    );
    return upErr ? "skip" : "process";
  } catch { return "skip"; }
}
export async function markEventProcessed(id: string) {
  try { await getSupabaseAdminClient().from("stripe_events").update({ status: "processed", processed_at: now(), updated_at: now() }).eq("id", id); } catch { /* best-effort */ }
}
export async function markEventFailed(id: string, error: string) {
  try { await getSupabaseAdminClient().from("stripe_events").update({ status: "failed", last_error: error.slice(0, 800), updated_at: now() }).eq("id", id); } catch { /* best-effort */ }
}

// ---------------------------------------------------------------------------
// Canonical ledger: one row per balance_transaction.
// ---------------------------------------------------------------------------
export interface LedgerEnrichment {
  event_id?: string | null; charge_id?: string | null; payment_intent_id?: string | null; refund_id?: string | null;
  invoice_id?: string | null; subscription_id?: string | null; dispute_id?: string | null; billing_type?: string | null;
  product_id?: string | null; price_id?: string | null; tier?: string | null; customer_id?: string | null; email?: string | null;
}

export async function upsertBalanceTransaction(btIn: Stripe.BalanceTransaction, enrich: LedgerEnrichment) {
  const bt = btIn as unknown as LooseBT;
  const s = getSupabaseAdminClient();
  const src = bt.source as Ref | { object?: string };
  await s.from("stripe_transactions").upsert(
    {
      balance_transaction_id: bt.id, event_id: enrich.event_id ?? null,
      object_type: typeof src === "object" && src && "object" in src ? (src as { object?: string }).object ?? null : bt.type,
      object_id: refId(src as Ref),
      charge_id: enrich.charge_id ?? null, payment_intent_id: enrich.payment_intent_id ?? null, refund_id: enrich.refund_id ?? null,
      invoice_id: enrich.invoice_id ?? null, subscription_id: enrich.subscription_id ?? null, dispute_id: enrich.dispute_id ?? null,
      type: bt.type, amount_gross: bt.amount, fee: bt.fee, amount_net: bt.net, currency: bt.currency,
      billing_type: enrich.billing_type ?? null, product_id: enrich.product_id ?? null, price_id: enrich.price_id ?? null,
      tier: enrich.tier ?? null, customer_id: enrich.customer_id ?? null, email: enrich.email ?? null,
      available_on: unixToIso(bt.available_on), created: unixToIso(bt.created), livemode: bt.livemode ?? false, synced_at: now(),
    },
    { onConflict: "balance_transaction_id" }
  );
}

export async function resolveBalanceTransaction(bt: Ref): Promise<Stripe.BalanceTransaction | null> {
  if (!bt) return null;
  if (typeof bt !== "string") return bt as unknown as Stripe.BalanceTransaction;
  try { return await getStripe().balanceTransactions.retrieve(bt); } catch { return null; }
}

/** Tier/product for a recurring charge, resolved from our synced subscriptions. */
async function tierForSubscription(subId: string | null): Promise<{ tier: string | null; product_id: string | null; price_id: string | null }> {
  if (!subId) return { tier: null, product_id: null, price_id: null };
  const { data } = await getSupabaseAdminClient().from("stripe_subscriptions").select("tier, product_id, price_id").eq("id", subId).maybeSingle();
  return { tier: data?.tier ?? null, product_id: data?.product_id ?? null, price_id: data?.price_id ?? null };
}

export async function recordCharge(chargeIn: Stripe.Charge, eventId: string, _livemode: boolean) {
  const charge = chargeIn as unknown as LooseCharge;
  const bt = await resolveBalanceTransaction(charge.balance_transaction);
  if (!bt) return;
  const invoiceId = refId(charge.invoice);
  const billing_type = invoiceId ? "recurring" : "one_time";
  let subscription_id: string | null = null;
  let tier: string | null = null, product_id: string | null = null, price_id: string | null = null;

  if (invoiceId) {
    try {
      const inv = (await getStripe().invoices.retrieve(invoiceId)) as unknown as LooseInvoice;
      subscription_id = invoiceSubId(inv);
      const info = await tierForSubscription(subscription_id);
      tier = info.tier; product_id = info.product_id; price_id = info.price_id;
    } catch { /* best-effort */ }
  } else {
    tier = charge.metadata?.tier ?? null;
    product_id = charge.metadata?.product_id ?? null;
  }

  await upsertBalanceTransaction(bt, {
    event_id: eventId, charge_id: charge.id, payment_intent_id: refId(charge.payment_intent), invoice_id: invoiceId,
    subscription_id, billing_type, product_id, price_id, tier, customer_id: refId(charge.customer),
    email: charge.billing_details?.email ?? charge.receipt_email ?? null,
  });
}

export async function recordRefund(chargeIn: Stripe.Charge, eventId: string) {
  const charge = chargeIn as unknown as LooseCharge;
  const refund = charge.refunds?.data?.[0];
  if (!refund) return;
  const bt = await resolveBalanceTransaction(refund.balance_transaction);
  if (!bt) return;
  await upsertBalanceTransaction(bt, {
    event_id: eventId, charge_id: charge.id, refund_id: refund.id, invoice_id: refId(charge.invoice),
    billing_type: charge.invoice ? "recurring" : "one_time", customer_id: refId(charge.customer), email: charge.billing_details?.email ?? null,
  });
}

// ---------------------------------------------------------------------------
// Subscriptions (state + MRR) and lifecycle changes.
// ---------------------------------------------------------------------------
function subMetrics(subIn: Stripe.Subscription) {
  const sub = subIn as unknown as LooseSub;
  const item = sub.items.data[0];
  const price = item?.price;
  const qty = item?.quantity ?? 1;
  const unit = price?.unit_amount ?? 0;
  let effective = unit * qty;
  const coupon = sub.discount?.coupon ?? sub.discounts?.[0]?.coupon;
  if (coupon) {
    if (coupon.percent_off) effective = Math.round(effective * (1 - coupon.percent_off / 100));
    else if (coupon.amount_off) effective = Math.max(0, effective - coupon.amount_off);
  }
  const interval = price?.recurring?.interval ?? "month";
  const intervalCount = price?.recurring?.interval_count ?? 1;
  const mrr = normalizeToMonthly(effective, interval, intervalCount);
  return { sub, item, price, qty, unit, effective, mrr, interval, intervalCount };
}

export async function upsertSubscription(subIn: Stripe.Subscription): Promise<{ tier: string | null; mrr: number }> {
  const { sub, item, price, qty, unit, effective, mrr, interval, intervalCount } = subMetrics(subIn);
  const tier = price?.metadata?.tier ?? null;
  await getSupabaseAdminClient().from("stripe_subscriptions").upsert(
    {
      id: sub.id, customer_id: refId(sub.customer), email: null,
      product_id: refId(price?.product), price_id: price?.id ?? null, tier,
      interval, interval_count: intervalCount, quantity: qty,
      currency: price?.currency ?? sub.currency ?? null, unit_amount: unit, effective_amount: effective, mrr_amount: mrr,
      status: sub.status,
      current_period_start: unixToIso(sub.current_period_start ?? item?.current_period_start),
      current_period_end: unixToIso(sub.current_period_end ?? item?.current_period_end),
      trial_start: unixToIso(sub.trial_start), trial_end: unixToIso(sub.trial_end),
      cancel_at: unixToIso(sub.cancel_at), canceled_at: unixToIso(sub.canceled_at), cancel_at_period_end: sub.cancel_at_period_end ?? false,
      discount: (sub.discount ?? sub.discounts?.[0]) ? ((sub.discount ?? sub.discounts?.[0]) as unknown as object) : null,
      latest_invoice_id: refId(sub.latest_invoice), livemode: sub.livemode ?? false,
      created_at: unixToIso(sub.created), updated_at: now(), synced_at: now(),
    },
    { onConflict: "id" }
  );
  return { tier, mrr };
}

export async function recordSubscriptionChange(entry: { subscription_id: string; change_type: string; from_tier?: string | null; to_tier?: string | null; from_mrr?: number | null; to_mrr?: number | null; livemode: boolean; event_id?: string | null }) {
  await getSupabaseAdminClient().from("subscription_changes").insert({
    subscription_id: entry.subscription_id, change_type: entry.change_type, from_tier: entry.from_tier ?? null, to_tier: entry.to_tier ?? null,
    from_mrr: entry.from_mrr ?? null, to_mrr: entry.to_mrr ?? null, mrr_delta: (entry.to_mrr ?? 0) - (entry.from_mrr ?? 0),
    livemode: entry.livemode, event_id: entry.event_id ?? null,
  });
}

export async function getStoredSubscription(id: string): Promise<{ tier: string | null; mrr_amount: number } | null> {
  const { data } = await getSupabaseAdminClient().from("stripe_subscriptions").select("tier, mrr_amount").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function upsertPayout(pIn: Stripe.Payout) {
  const p = pIn as unknown as LoosePayout;
  await getSupabaseAdminClient().from("stripe_payouts").upsert(
    { id: p.id, amount: p.amount, currency: p.currency, status: p.status, arrival_date: unixToIso(p.arrival_date), created: unixToIso(p.created), livemode: p.livemode ?? false, synced_at: now() },
    { onConflict: "id" }
  );
}

export async function upsertDispute(dIn: Stripe.Dispute) {
  const d = dIn as unknown as LooseDispute;
  await getSupabaseAdminClient().from("stripe_disputes").upsert(
    { id: d.id, charge_id: refId(d.charge), payment_intent_id: refId(d.payment_intent), amount: d.amount, currency: d.currency, status: d.status, reason: d.reason, evidence_due_by: unixToIso(d.evidence_details?.due_by), is_charge_refundable: d.is_charge_refundable ?? null, created: unixToIso(d.created), livemode: d.livemode ?? false, synced_at: now() },
    { onConflict: "id" }
  );
}

export async function upsertFailedPayment(invIn: Stripe.Invoice) {
  const inv = invIn as unknown as LooseInvoiceFailed;
  await getSupabaseAdminClient().from("finance_failed_payments").upsert(
    { id: inv.id, invoice_id: inv.id, subscription_id: invoiceSubId(inv), customer_id: refId(inv.customer), email: inv.customer_email ?? null, amount: inv.amount_due, currency: inv.currency, attempt_count: inv.attempt_count ?? null, next_payment_attempt: unixToIso(inv.next_payment_attempt), status: inv.status ?? "open", created: unixToIso(inv.created), livemode: inv.livemode ?? false, synced_at: now() },
    { onConflict: "id" }
  );
}
