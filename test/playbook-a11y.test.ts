// Accessibility smoke tests for the shared SortEngine, using react-dom/server
// (already a dependency — no new test stack). Asserts the initial render's a11y
// structure: keyboard-operable tap-assign buttons, text labels (not color-only),
// a labelled sort group, and a disabled-until-complete continue control.

import { test } from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SortEngine from "../components/playbook/SortEngine";
import type { SortBucket, SortItem } from "../lib/playbook/contentSchema";

// Under this test runner (tsx/esbuild) the component's JSX compiles to the classic
// runtime (bare `React.createElement`) while the component imports no React (Next
// uses the automatic runtime). Expose React globally so those calls resolve at
// render time. Test-only; no effect on the production build.
(globalThis as { React?: unknown }).React = React;

const buckets: SortBucket[] = [
  { id: "supports", label: "This event supports this" },
  { id: "cant", label: "This event can't prove this" },
];
const items: SortItem[] = [{ id: "a1", text: "This person didn't want to keep dating me", correctBucket: "supports" }];

function decode(html: string): string {
  return html
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#x22;/g, '"')
    .replace(/&amp;/g, "&");
}

function render(): string {
  return decode(renderToStaticMarkup(React.createElement(SortEngine, { buckets, items, onComplete: () => {} })));
}

test("SortEngine uses tap-assign buttons with aria-pressed (keyboard-operable, not drag-only)", () => {
  const html = render();
  assert.ok(html.includes("aria-pressed"), "bucket buttons expose aria-pressed");
  assert.ok((html.match(/<button/g) || []).length >= buckets.length, "a button per bucket");
});

test("SortEngine conveys buckets by text label, not color alone", () => {
  const html = render();
  for (const b of buckets) assert.ok(html.includes(b.label), `bucket label present: ${b.label}`);
});

test("SortEngine renders item text inside a labelled group (screen-reader)", () => {
  const html = render();
  assert.ok(html.includes(items[0].text), "item text present");
  assert.ok(html.includes("aria-label"), "sort group is labelled");
});

test("SortEngine keeps continue disabled until all items are assigned", () => {
  const html = render();
  assert.ok(html.includes("disabled"), "continue disabled at initial state");
  assert.ok(html.includes("Sort each one to continue"), "guidance shown while incomplete");
});
