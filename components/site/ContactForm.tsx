"use client";

import { useRef, useState } from "react";
import Turnstile, { turnstileEnabled } from "@/components/site/Turnstile";

const CATEGORIES = [
  { title: "General Questions", body: "Questions about the framework, the assessment, or the website.", type: "General Question" },
  { title: "Speaking & Events", body: "Interested in booking Janelle for a keynote, conference, or workshop.", type: "Speaking Inquiry" },
  { title: "Professional Partnerships", body: "Therapists, coaches, organizations, or institutions exploring professional use of the framework.", type: "Professional Partnership" },
  { title: "Media Requests", body: "Interview requests, press inquiries, or media kit access.", type: "Media Request" },
  { title: "Assessment Support", body: "Questions about your results or the Relationship Snapshot™.", type: "Assessment Support" },
  { title: "Technical Support", body: "Issues with the website or assessment.", type: "Technical Issue" },
];

const INQUIRY_TYPES = [
  "General Question", "Speaking Inquiry", "Professional Partnership",
  "Media Request", "Assessment Support", "Technical Issue", "Other",
];

const inputCls =
  "min-h-[48px] w-full rounded-lg border border-light-gray bg-white px-4 font-ui text-base text-charcoal outline-none focus:border-midnight-navy";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  function set(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function pickCategory(type: string) {
    setInquiryType(type);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const email = (values.email ?? "").trim();
    if (!(values.name ?? "").trim()) return setError("Please enter your name.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if (!(values.message ?? "").trim()) return setError("Please enter a message.");
    if (turnstileEnabled && !captchaToken) return setError("Please complete the verification.");
    setStatus("submitting");
    try {
      const res = await fetch("/api/site-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email,
          organization: values.organization,
          message: values.message,
          inquiry_type: inquiryType,
          source: "contact_form",
          turnstile_token: captchaToken,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      {/* Category cards */}
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.title}
            type="button"
            onClick={() => pickCategory(c.type)}
            className={`rounded-xl border bg-white p-5 text-left transition-colors hover:border-midnight-navy ${
              inquiryType === c.type ? "border-midnight-navy" : "border-light-gray"
            }`}
          >
            <h3 className="font-display text-lg font-semibold text-midnight-navy">{c.title}</h3>
            <p className="mt-1 font-body text-sm leading-relaxed text-charcoal">{c.body}</p>
          </button>
        ))}
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto mt-12 flex max-w-xl scroll-mt-28 flex-col gap-4">
        {status === "done" ? (
          <div className="rounded-lg bg-sage-green/15 px-5 py-4 font-body text-sage-green">
            Thank you — your message has been received. We typically respond within two business days.
          </div>
        ) : (
          <>
            <input type="text" placeholder="Name" value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputCls} />
            <input type="email" placeholder="Email" value={values.email ?? ""} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputCls} />
            <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className={inputCls} aria-label="Inquiry type">
              {INQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="Organization (optional)" value={values.organization ?? ""} onChange={(e) => set("organization", e.target.value)} className={inputCls} />
            <textarea rows={4} placeholder="Message" value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} className="w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-ui text-base text-charcoal outline-none focus:border-midnight-navy" />
            <Turnstile onToken={setCaptchaToken} />
            {error && <p className="font-body text-sm text-coral-rose">{error}</p>}
            <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50">
              {status === "submitting" ? "Sending…" : "Send Message"}
            </button>
            <p className="font-body text-[13px] text-charcoal/60">We typically respond within two business days.</p>
          </>
        )}
      </form>
    </div>
  );
}
