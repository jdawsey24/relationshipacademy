import { NextResponse } from "next/server";
import { getSiteContentMap, get } from "@/lib/siteContent";

// Public (no auth): returns the announcement banner state for the client
// banner component. Resilient — returns disabled state if content is absent.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const map = await getSiteContentMap();
  return NextResponse.json({
    announcement: {
      enabled: get(map, "announcement.enabled", "false") === "true",
      text: get(map, "announcement.text", ""),
      link: get(map, "announcement.link", ""),
    },
  });
}
