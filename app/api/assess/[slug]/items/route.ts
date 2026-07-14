import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { getPublicInstrumentBySlug } from "@/lib/instrumentPublish";
import { loadPublicQuizItems } from "@/lib/studioScoringData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The five-point frequency scale (matches the studio RM-FREQ-001 response model).
const RESPONSE_OPTIONS = [
  { value: 1, label: "Almost Never" }, { value: 2, label: "Rarely" }, { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" }, { value: 5, label: "Almost Always" },
];

// GET /api/assess/[slug]/items — the published instrument's quiz items. 404 unless
// the instrument is published + live_enabled. Anonymous read (service-role).
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await rateLimit(request, { bucket: "assess-items", limit: 60, windowSeconds: 60 }))) return tooManyRequests();
  const instrument = await getPublicInstrumentBySlug(decodeURIComponent(slug));
  if (!instrument) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const items = await loadPublicQuizItems(instrument.assessment_id);
  return NextResponse.json({
    instrument: { name: instrument.name, purpose: instrument.purpose, estimated_time: instrument.estimated_time, intro_copy: instrument.intro_copy, slug: instrument.public_slug },
    items,
    responseOptions: RESPONSE_OPTIONS,
  });
}
