import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { getDomainByRouteSlug } from "@/lib/domains";
import type { QuestionsResponse } from "@/types/assessment";

// Reference data (questions) is public-readable via the anon key, but we serve
// it through this route to centralize the slug mapping and ordering and to keep
// the Supabase client out of the browser bundle.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const routeSlug = searchParams.get("domain");
  if (!routeSlug) {
    return NextResponse.json({ error: "Missing 'domain' query param." }, { status: 400 });
  }

  const domainMeta = getDomainByRouteSlug(routeSlug);
  if (!domainMeta) {
    return NextResponse.json({ error: `Unknown domain '${routeSlug}'.` }, { status: 404 });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch {
    return NextResponse.json(
      { error: "Server misconfigured: Supabase credentials missing." },
      { status: 500 }
    );
  }

  // Resolve the domain id from its DB slug.
  const { data: domainRow, error: domainErr } = await supabase
    .from("domains")
    .select("id, slug, name")
    .eq("slug", domainMeta.dbSlug)
    .single();
  if (domainErr || !domainRow) {
    return NextResponse.json(
      { error: "Failed to load domain.", details: domainErr?.message },
      { status: 502 }
    );
  }

  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id, question_text")
    .eq("domain_id", domainRow.id)
    .eq("in_snapshot", true)
    .order("id", { ascending: true });
  if (qErr) {
    return NextResponse.json(
      { error: "Failed to load questions.", details: qErr.message },
      { status: 502 }
    );
  }

  const body: QuestionsResponse = {
    domain: { slug: domainMeta.routeSlug, name: domainRow.name },
    questions: (questions ?? []).map((q) => ({
      id: q.id,
      question_text: q.question_text,
    })),
  };
  return NextResponse.json(body, { status: 200 });
}
