import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

// Postgres-backed rate limiter (see migration 0009). Resilient: if the RPC or
// table is absent (migration not run) or the DB errors, it FAILS OPEN (allows
// the request) so it can never take the site down — it only ever adds
// protection once the migration is applied.

/** Best-effort client IP. Netlify sets x-nf-client-connection-ip; fall back to
 * the first x-forwarded-for hop. */
export function clientIp(request: Request): string {
  const nf = request.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

export interface RateLimitOptions {
  bucket: string;        // logical endpoint name, e.g. "site-leads"
  limit: number;         // max requests per window
  windowSeconds: number; // window length
}

/** Returns true if the request is within the limit (allowed). */
export async function rateLimit(request: Request, opts: RateLimitOptions): Promise<boolean> {
  const key = `${opts.bucket}:${clientIp(request)}`;
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: opts.limit,
      p_window_seconds: opts.windowSeconds,
    });
    if (error) {
      console.error("[rateLimit]", opts.bucket, error.message);
      return true; // fail open
    }
    return data === true;
  } catch (e) {
    console.error("[rateLimit]", opts.bucket, e instanceof Error ? e.message : e);
    return true; // fail open
  }
}

/** Standard 429 response. */
export function tooManyRequests(retryAfterSeconds = 60): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please slow down and try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
