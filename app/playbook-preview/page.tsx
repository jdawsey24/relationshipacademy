import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

// DEV/PREVIEW-ONLY. This route exists solely to render the Rev 3 home compositions for the
// owner E2E walkthrough without an auth session. It 404s in production so it can never ship.
export const dynamic = "force-dynamic";

export default async function PlaybookPreviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const sp = await searchParams;
  const state = typeof sp.state === "string" ? sp.state : "no-mission";
  return <PreviewClient state={state} />;
}
