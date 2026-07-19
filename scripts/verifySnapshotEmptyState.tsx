import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SnapshotAnalyticsView } from "../app/admin/snapshot/SnapshotAnalyticsView";
import type { SnapshotAnalytics } from "../lib/snapshot/analytics";

void React; // ensure the classic JSX runtime has React in scope

// Renders the real Snapshot analytics view (same component the authed page uses)
// with an empty and a populated payload, asserting each branch renders correctly.
// This substitutes for a browser check, which is blocked by admin auth/MFA.

const empty: SnapshotAnalytics = {
  overall: { completed: 0, converted: 0, lowConfidencePct: 0, conversionPct: 0 },
  perMarker: [], primaryClusters: [], hotspots: [], hasData: false,
};
const populated: SnapshotAnalytics = {
  overall: { completed: 42, converted: 9, lowConfidencePct: 12.5, conversionPct: 21.4 },
  perMarker: [{ id: "in_a_relationship", display: "In a Relationship", completed: 42, converted: 9, avgNeutralPct: 8.3, lowConfidencePct: 12.5, conversionPct: 21.4, tiedPct: 4.8 }],
  primaryClusters: [{ clusterId: 8, name: "Feeling Like We're Growing Apart", count: 12 }],
  hotspots: [{ marker: "in_a_relationship", markerDisplay: "In a Relationship", questionOrder: 7, neutralPct: 34.2, answers: 38, clusters: ["Fear of Being Fully Known", "Difficulty Saying No"] }],
  hasData: true,
};

const emptyHtml = renderToStaticMarkup(<SnapshotAnalyticsView data={empty} />);
const fullHtml = renderToStaticMarkup(<SnapshotAnalyticsView data={populated} />);

const checks: [string, boolean][] = [
  ["empty: shows 'No completed Snapshots yet'", emptyHtml.includes("No completed Snapshots yet")],
  ["empty: shows the page heading", emptyHtml.includes("Snapshot Analytics")],
  ["empty: does NOT render the per-marker table", !emptyHtml.includes("Avg neutral")],
  ["empty: does NOT render hotspots panel", !emptyHtml.includes("Neutral hotspots")],
  ["populated: hides the empty-state message", !fullHtml.includes("No completed Snapshots yet")],
  ["populated: renders the per-marker table", fullHtml.includes("Avg neutral")],
  ["populated: renders hotspots panel", fullHtml.includes("Neutral hotspots") && fullHtml.includes("None of these fit")],
  ["populated: renders result distribution", fullHtml.includes("Result distribution")],
  ["populated: shows a real marker + stat", fullHtml.includes("In a Relationship") && fullHtml.includes("42")],
];

let ok = true;
for (const [label, pass] of checks) { console.log(`${pass ? "PASS" : "FAIL"}  ${label}`); if (!pass) ok = false; }
console.log(ok ? "\n✓ empty-state and populated-state both render correctly" : "\n✗ verification failed");
process.exit(ok ? 0 : 1);
