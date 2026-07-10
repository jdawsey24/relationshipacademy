import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwnerFinance } from "@/lib/adminApi";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = [
  "created", "type", "billing_type", "tier", "email", "amount_gross", "fee", "amount_net",
  "currency", "charge_id", "invoice_id", "subscription_id", "balance_transaction_id", "livemode",
];

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const auth = await requireOwnerFinance();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const lm = url.searchParams.get("livemode") === "true";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = url.searchParams.get("format");

  const s = getSupabaseAdminClient();
  let q = s.from("stripe_transactions").select("*").eq("livemode", lm).order("created", { ascending: false });
  if (from) q = q.gte("created", from);
  if (to) q = q.lte("created", to);
  const { data, error } = await q.limit(format === "csv" ? 10000 : 200);
  if (error) return NextResponse.json({ error: "Failed to load transactions." }, { status: 502 });
  const rows = data ?? [];

  if (format === "csv") {
    const header = COLUMNS.join(",");
    const body = rows.map((r) => COLUMNS.map((c) => csvEscape((r as Record<string, unknown>)[c])).join(",")).join("\n");
    await audit({ actor: auth.user.email ?? null, action: "finance.export", metadata: { rows: rows.length, livemode: lm, from, to } });
    return new NextResponse(`${header}\n${body}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="transactions-${lm ? "live" : "test"}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ rows });
}
