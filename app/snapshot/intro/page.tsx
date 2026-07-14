"use client";

import AssessFlow from "@/components/assess/AssessFlow";
import { FLAGSHIP_SLUG } from "@/lib/flagship";

// The flagship assessment now runs on the Studio instrument (studio scoring
// stack), served at the original /snapshot URL. The legacy multi-route flow
// (phase-select/questions/capture) + legacy engine (lib/scoring.ts, /api/score,
// /api/results, quiz_* tables) are left intact but dark for rollback.
export default function SnapshotPage() {
  return <AssessFlow slug={FLAGSHIP_SLUG} resultsHref={(a) => `/snapshot/results?attempt=${a}`} />;
}
