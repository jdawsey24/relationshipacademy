import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { readJsonBody } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { EYES_OPEN, enrolmentState, seatsRemaining } from "@/lib/eyesOpen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Open checkout for a founding-cohort seat, holding the seat while she pays.
 *
 * THE HOLD IS THE POINT. Everything else this site sells is unlimited, so a
 * checkout session is harmless. Here it is a claim on one of fifteen things.
 * The row is written BEFORE the Stripe session exists, so the seat is off the
 * board from the moment she commits to paying rather than from the moment the
 * money lands — otherwise fifteen simultaneous buyers all see a seat.
 *
 * The hold is short and expires by itself (see seatsTaken). An abandoned
 * checkout costs the cohort half an hour, not a seat.
 *
 * Guest checkout, like the Playbook: nobody signs in to buy a class. Stripe
 * collects the email, the webhook confirms the seat against it, and that
 * address is how she gets the class link.
 */
export async function POST(request: Request) {
  if (!(await rateLimit(request, { bucket: "eyes-open-checkout", limit: 8, windowSeconds: 60 }))) {
    return tooManyRequests();
  }
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Enrollment isn't open yet." }, { status: 503 });
  }

  // The date closes it even when seats remain.
  const seats = await seatsRemaining();
  const state = enrolmentState(seats);
  if (state === "closed") {
    return NextResponse.json({ error: "The September cohort has already begun." }, { status: 409 });
  }
  if (state === "full") {
    return NextResponse.json({
      error: `All ${EYES_OPEN.seats} seats are taken. Join the October list and you'll hear the dates first.`,
    }, { status: 409 });
  }

  const body = await readJsonBody(request).catch(() => null);
  const email = String((body as { email?: unknown } | null)?.email ?? "").trim().toLowerCase();
  const name = String((body as { name?: unknown } | null)?.name ?? "").trim() || null;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const stripe = getStripe();
  const origin = request.headers.get("origin") || "https://relationshiplc.com";

  // Already in? Say so rather than selling her a second seat.
  const { data: existing } = await admin.from("eyes_open_enrolments")
    .select("id").eq("cohort", EYES_OPEN.cohort).eq("status", "paid")
    .ilike("email", email).maybeSingle();
  if (existing) {
    return NextResponse.json({
      error: "You're already enrolled — check your email for the class details.",
    }, { status: 409 });
  }

  // Hold the seat first. If Stripe then fails, the hold lapses on its own.
  const { data: held, error: holdError } = await admin.from("eyes_open_enrolments")
    .insert({ cohort: EYES_OPEN.cohort, email, name, status: "pending" })
    .select("id").maybeSingle();
  if (holdError || !held) {
    console.error("[eyes-open/checkout] hold failed:", holdError?.message);
    return NextResponse.json({ error: "Could not hold a seat. Try again." }, { status: 502 });
  }
  const enrolmentId = (held as { id: string }).id;

  // Re-check after taking the hold. Two requests can pass the check above at
  // the same time; only one of them can be within the cap once both rows exist.
  if (await overCapacity()) {
    await releaseHold(enrolmentId, "over capacity at hold time");
    return NextResponse.json({
      error: `Someone just took the last seat. Join the October list and you'll hear the dates first.`,
    }, { status: 409 });
  }

  try {
    const prices = await stripe.prices.list({
      lookup_keys: [EYES_OPEN.priceLookupKey], active: true, limit: 1,
    });
    const price = prices.data[0];
    if (!price) {
      await releaseHold(enrolmentId, "no active price");
      return NextResponse.json({ error: "Enrollment isn't open yet." }, { status: 503 });
    }

    const meta = {
      product_key: EYES_OPEN.productKey,
      billing_type: "one_time",
      cohort: EYES_OPEN.cohort,
      enrolment_id: enrolmentId,
    };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: email,
      return_url: `${origin}/dating-with-your-eyes-open/enrolled?session_id={CHECKOUT_SESSION_ID}`,
      metadata: meta,
      payment_intent_data: { metadata: meta },
      allow_promotion_codes: true,
      // Shorter than Stripe's 24-hour default so an abandoned cart does not sit
      // on a seat overnight. Minimum Stripe accepts is 30 minutes.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    await admin.from("eyes_open_enrolments")
      .update({ stripe_session_id: session.id }).eq("id", enrolmentId);

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (e) {
    await releaseHold(enrolmentId, e instanceof Error ? e.message : "stripe error");
    console.error("[eyes-open/checkout]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}

/** True when live seats now exceed the cap — i.e. this hold was one too many. */
async function overCapacity(): Promise<boolean> {
  const admin = getSupabaseAdminClient();
  const [{ count: paid }, { count: pending }] = await Promise.all([
    admin.from("eyes_open_enrolments").select("id", { count: "exact", head: true })
      .eq("cohort", EYES_OPEN.cohort).eq("status", "paid"),
    admin.from("eyes_open_enrolments").select("id", { count: "exact", head: true })
      .eq("cohort", EYES_OPEN.cohort).eq("status", "pending")
      .gt("held_until", new Date().toISOString()),
  ]);
  return (paid ?? 0) + (pending ?? 0) > EYES_OPEN.seats;
}

/** Give the seat back immediately rather than waiting for the hold to lapse. */
async function releaseHold(id: string, reason: string) {
  await getSupabaseAdminClient().from("eyes_open_enrolments")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("id", id).eq("status", "pending");
  console.warn(`[eyes-open/checkout] released ${id}: ${reason}`);
}
