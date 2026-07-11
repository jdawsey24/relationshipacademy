// Client-safe finance types + pure helpers. NO server imports.
// All monetary amounts are INTEGER MINOR UNITS (cents).

export type Cents = number;

/** Format minor units as a currency string. */
export function formatMoney(cents: Cents, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
    maximumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

/**
 * Normalize a per-interval recurring amount (minor units) to a MONTHLY figure.
 * month → /interval_count · year → /(12·count) · week → ×52/12 · day → ×365/12.
 */
export function normalizeToMonthly(
  amount: Cents,
  interval: string | null,
  intervalCount = 1
): Cents {
  const c = intervalCount > 0 ? intervalCount : 1;
  switch (interval) {
    case "month": return Math.round(amount / c);
    case "year": return Math.round(amount / (12 * c));
    case "week": return Math.round((amount * 52) / 12 / c);
    case "day": return Math.round((amount * 365) / 12 / c);
    default: return Math.round(amount / c);
  }
}

export interface DeltaMetric {
  current: number;
  previous: number;
}

export interface TierBreakdown {
  tier: string;
  label: string;
  count: number;
  mrr: Cents;
}

export interface TransactionRow {
  balance_transaction_id: string;
  created: string | null;
  type: string | null;
  billing_type: string | null;
  tier: string | null;
  email: string | null;
  amount_gross: Cents;
  fee: Cents;
  amount_net: Cents;
  currency: string | null;
}

export interface FinanceSummary {
  livemode: boolean;
  range: { from: string; to: string };
  currency: string;
  // Revenue (period + prior-period comparison)
  gross: DeltaMetric;
  fees: DeltaMetric;
  refunds: DeltaMetric;
  net: DeltaMetric;
  oneTime: DeltaMetric;
  // Recurring
  mrr: Cents;
  committedMrr: Cents;
  arr: Cents;
  revenueThisMonth: Cents;
  revenueThisYear: Cents;
  // Subscriptions
  activeSubs: number;
  trialingSubs: number;
  pastDueSubs: number;
  monthlySubs: number;
  annualSubs: number;
  byTier: TierBreakdown[];
  // Lifecycle (in range)
  newSubs: DeltaMetric;
  cancellations: DeltaMetric;
  upgrades: number;
  downgrades: number;
  failedPayments: number;
  disputes: { count: number; amount: Cents };
  // Revenue by product (in range)
  byProduct: { tier: string; label: string; amount: Cents; billing_type: string }[];
  // Revenue over time (bucketed across the range)
  timeseries: { date: string; label: string; gross: Cents; net: Cents }[];
  // Recent activity
  recentTransactions: TransactionRow[];
  // Sync/reconciliation status
  lastSyncedAt: string | null;
  reconciliation: { status: "ok" | "drift" | "unknown"; note?: string } | null;
}

export interface BalanceInfo {
  available: { amount: Cents; currency: string }[];
  pending: { amount: Cents; currency: string }[];
  upcomingPayout: { amount: Cents; currency: string; arrival_date: string | null } | null;
  fetchedAt: string;
}
