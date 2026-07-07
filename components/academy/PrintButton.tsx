"use client";

// Triggers the browser print dialog (Save as PDF / print). Hidden when printing.
export default function PrintButton({ label = "Download / Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 print:hidden"
    >
      {label}
    </button>
  );
}
