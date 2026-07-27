"use client";

// Narrow corrective-learning editor: reopens ONLY a Play's saved executable output,
// prefilled, and returns the merged payload. Not a general-purpose editor.

import { useState } from "react";
import type { OutputEditorField, Play } from "@/lib/playbook/contentSchema";

export interface OutputEditorProps {
  play: Play; // must have outputEditor
  initial: Record<string, unknown>;
  onSave: (payload: Record<string, unknown>) => void;
  onCancel: () => void;
}

const nextBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";

export default function OutputEditor({ play, initial, onSave, onCancel }: OutputEditorProps) {
  const editor = play.outputEditor;
  const [draft, setDraft] = useState<Record<string, unknown>>({ ...initial });
  if (!editor) return null;
  const set = (id: string, v: unknown) => setDraft((d) => ({ ...d, [id]: v }));

  const complete = editor.fields.every((f) => {
    const v = draft[f.id];
    if (f.input === "rule") {
      const r = (v ?? {}) as { condition?: string; action?: string };
      return Boolean(r.condition?.trim() && r.action);
    }
    return typeof v === "string" && v.trim().length > 0;
  });

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white/70 p-6 sm:p-8" role="form" aria-label={editor.heading}>
      <h2 className="font-display text-xl text-midnight-navy">{editor.heading}</h2>
      <p className="mt-1 font-body text-[14px] text-charcoal/60">Update just what changed — your saved reminder updates with it.</p>
      <div className="mt-5 space-y-5">
        {editor.fields.map((f) => (
          <Field key={f.id} field={f} value={draft[f.id]} onChange={(v) => set(f.id, v)} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" disabled={!complete} onClick={() => onSave({ ...initial, ...draft })} className={nextBtn + " disabled:opacity-40"}>
          Save changes
        </button>
        <button type="button" onClick={onCancel} className="font-ui text-sm text-charcoal/55 underline">Cancel</button>
      </div>
    </div>
  );
}

function Field({ field, value, onChange }: { field: OutputEditorField; value: unknown; onChange: (v: unknown) => void }) {
  const inputCls = "w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy";
  if (field.input === "rule") {
    const r = (value ?? {}) as { condition?: string; action?: string };
    return (
      <div className="space-y-3">
        <label className="block font-ui text-sm font-medium text-charcoal">{field.label}</label>
        <input aria-label="If I see" value={r.condition ?? ""} onChange={(e) => onChange({ ...r, condition: e.target.value })} placeholder="If I see…" className={inputCls} />
        <select aria-label="then I will" value={r.action ?? ""} onChange={(e) => onChange({ ...r, action: e.target.value })} className={inputCls}>
          <option value="">…then I will</option>
          {(field.actions ?? []).map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {field.controlCheck && <p className="rounded-xl bg-warm-ivory px-4 py-2 font-body text-[13px] text-charcoal/70">{field.controlCheck}</p>}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <label className="block font-ui text-sm font-medium text-charcoal">{field.label}</label>
      <textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={2} placeholder={field.placeholder} className={inputCls} />
    </div>
  );
}
