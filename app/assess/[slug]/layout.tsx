// Shell for the parallel assessment flow — its own chrome (no (site) header/footer),
// mirroring /snapshot. Entirely separate from the Snapshot tree.
export default function AssessLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-warm-ivory font-body text-charcoal">{children}</div>;
}
