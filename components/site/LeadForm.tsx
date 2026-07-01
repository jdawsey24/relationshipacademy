"use client";

import { useState } from "react";

export type LeadField = "name" | "email" | "organization" | "message";

export interface ExtraField {
  key: string;
  label: string;
}

interface LeadFormProps {
  source: string;
  fields: LeadField[];
  /** renders inquiry_type as a select */
  inquiryTypeOptions?: string[];
  /** renders event_type as a select (else omitted) */
  eventTypeOptions?: string[];
  /** freeform extra inputs appended into the message on submit */
  extraFields?: ExtraField[];
  submitLabel?: string;
  successMessage?: string;
}

const LABELS: Record<LeadField, string> = {
  name: "Name",
  email: "Email",
  organization: "Organization",
  message: "Message",
};

const inputCls =
  "min-h-[48px] w-full rounded-lg border border-light-gray bg-white px-4 font-ui text-base text-charcoal outline-none focus:border-midnight-navy";

export default function LeadForm({
  source,
  fields,
  inquiryTypeOptions,
  eventTypeOptions,
  extraFields,
  submitLabel = "Submit",
  successMessage = "Thank you — we'll be in touch.",
}: LeadFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [inquiryType, setInquiryType] = useState(inquiryTypeOptions?.[0] ?? "");
  const [eventType, setEventType] = useState(eventTypeOptions?.[0] ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const email = (values.email ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (fields.includes("name") && !(values.name ?? "").trim()) {
      setError("Please enter your name.");
      return;
    }
    if (fields.includes("message") && !(values.message ?? "").trim()) {
      setError("Please enter a message.");
      return;
    }

    // Fold any extra freeform fields into the message so nothing is lost
    // (site_leads has no dedicated columns for them).
    const extras = (extraFields ?? [])
      .map((f) => (values[f.key] ? `${f.label}: ${values[f.key]}` : ""))
      .filter(Boolean);
    const composedMessage = [values.message ?? "", ...extras].filter(Boolean).join("\n");

    setStatus("submitting");
    try {
      const res = await fetch("/api/site-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email,
          organization: values.organization,
          source,
          ...(inquiryTypeOptions ? { inquiry_type: inquiryType } : {}),
          ...(eventTypeOptions ? { event_type: eventType } : {}),
          ...(composedMessage ? { message: composedMessage } : {}),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg bg-sage-green/15 px-5 py-4 font-body text-sage-green">
        {successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.includes("name") && (
        <input type="text" placeholder={LABELS.name} value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputCls} />
      )}
      {fields.includes("email") && (
        <input type="email" placeholder={LABELS.email} value={values.email ?? ""} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputCls} />
      )}
      {fields.includes("organization") && (
        <input type="text" placeholder={LABELS.organization} value={values.organization ?? ""} onChange={(e) => set("organization", e.target.value)} className={inputCls} />
      )}
      {inquiryTypeOptions && (
        <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className={inputCls} aria-label="Inquiry type">
          {inquiryTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {eventTypeOptions && (
        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={inputCls} aria-label="Event type">
          {eventTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {(extraFields ?? []).map((f) => (
        <input key={f.key} type="text" placeholder={f.label} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
      ))}
      {fields.includes("message") && (
        <textarea rows={4} placeholder={LABELS.message} value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} className="w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-ui text-base text-charcoal outline-none focus:border-midnight-navy" />
      )}

      {error && <p className="font-body text-sm text-coral-rose">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
