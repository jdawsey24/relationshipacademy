// Shared jsdom/Testing-Library setup for Playbook interaction tests.
// IMPORTANT: each test file must `import "global-jsdom/register";` on its FIRST line
// (before this module) so window/document exist before react-dom loads.

import { afterEach } from "node:test";
import * as React from "react";
import { cleanup, render } from "@testing-library/react";
import userEventDefault from "@testing-library/user-event";

export * from "@testing-library/react";
export const userEvent = userEventDefault;
export const h = React.createElement;

// Components' JSX compiles to the classic runtime under tsx/esbuild (no React import
// in the components; Next uses the automatic runtime). Expose React globally so those
// `React.createElement` calls resolve at render time. Test-only; no build impact.
(globalThis as { React?: unknown }).React = React;

// ---- environment stubs (jsdom gaps) ----

// jsdom has no matchMedia; default = NOT reduced motion (tests can override).
type MQL = { matches: boolean; media: string; onchange: null; addEventListener(): void; removeEventListener(): void; addListener(): void; removeListener(): void; dispatchEvent(): boolean };
export function setReducedMotion(on: boolean) {
  (window as unknown as { matchMedia: (q: string) => MQL }).matchMedia = (query: string) => ({
    matches: on && /prefers-reduced-motion/.test(query),
    media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; },
  });
}
setReducedMotion(false);

// Controllable fetch mock. The progress PUT returns {ok:true}; the crisis /screen
// endpoint returns whatever `crisis` is set to. Records calls + bodies.
export const net = {
  calls: [] as { url: string; method?: string; body?: unknown }[],
  crisis: { interrupt: false, heading: null as string | null, message: null as string | null, resources: [] as { label: string; value: string }[] },
  reset() {
    this.calls = [];
    this.crisis = { interrupt: false, heading: null, message: null, resources: [] };
  },
};

(globalThis as unknown as { fetch: (url: string, init?: RequestInit) => Promise<{ ok: boolean; json: () => Promise<unknown> }> }).fetch = async (url: string, init?: RequestInit) => {
  let body: unknown = undefined;
  try {
    body = init?.body ? JSON.parse(String(init.body)) : undefined;
  } catch {
    body = init?.body;
  }
  net.calls.push({ url: String(url), method: init?.method, body });
  const respond = String(url).includes("/screen") ? net.crisis : { ok: true };
  return { ok: true, json: async () => respond };
};

// Re-export a fresh render + node:test cleanup wiring.
export { render };
afterEach(() => {
  cleanup();
  net.reset();
});
