"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlockView, { type RenderBlock } from "@/components/companion/blocks/BlockRenderer";

interface Started { entry_id: string; experience: { title: string; blocks: RenderBlock[] }; responses: Record<string, unknown> }

export default function CompanionSession() {
  const { session: slug } = useParams<{ session: string }>();
  const router = useRouter();
  const [data, setData] = useState<Started | null>(null);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [notFound, setNotFound] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    fetch("/api/companion/entries/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: Started) => { setData(d); setResponses(d.responses ?? {}); })
      .catch(() => setNotFound(true));
  }, [slug]);

  const save = useCallback((ref: string, value: unknown) => {
    if (!data) return;
    setSaveState("saving");
    clearTimeout(timers.current[ref]);
    timers.current[ref] = setTimeout(async () => {
      await fetch(`/api/companion/entries/${data.entry_id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ block_ref: ref, response: value }) }).catch(() => {});
      setSaveState("saved");
    }, 700);
  }, [data]);

  function onChange(ref: string, value: unknown) {
    setResponses((prev) => ({ ...prev, [ref]: value }));
    save(ref, value);
  }

  // Guard against losing an in-flight autosave on accidental navigation/close.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (saveState === "saving") { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  async function complete() {
    if (!data) return;
    await fetch(`/api/companion/entries/${data.entry_id}`, { method: "POST" }).catch(() => {});
    router.replace("/companion/journey");
  }

  if (notFound) return <Centered>This experience isn&apos;t available.</Centered>;
  if (!data) return <Centered>Preparing…</Centered>;

  const visible = data.experience.blocks.filter((b) => {
    const c = b.conditional_on as { block_ref?: string; equals?: unknown } | null;
    return !c?.block_ref || responses[c.block_ref] === c.equals;
  });

  return (
    <main className="mx-auto min-h-screen max-w-md bg-warm-ivory px-5 pb-32 pt-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.replace("/companion")} className="font-ui text-sm text-charcoal/55">Save &amp; exit</button>
        <span className="font-ui text-xs text-charcoal/40">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}</span>
      </div>

      <h1 className="mt-3 text-balance font-display text-2xl font-semibold leading-tight text-midnight-navy">{data.experience.title}</h1>

      <div className="mt-5 space-y-3">
        {visible.map((b) => {
          const ref = String(b.order);
          return <BlockView key={ref} block={b} value={responses[ref]} onChange={(v) => onChange(ref, v)} />;
        })}
      </div>

      <button onClick={complete} className="mt-8 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white">
        Save reflection
      </button>
      <p className="mt-3 text-center font-body text-xs text-charcoal/40">Your reflection is private to you. You can leave and come back anytime.</p>
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center"><p className="font-body text-charcoal/55">{children}</p></main>;
}
