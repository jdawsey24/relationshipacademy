// Shell for the flagship assessment. The flow is now the single-page Studio
// instrument (its own state), so the legacy QuizProvider is no longer needed —
// QuizContext is preserved in the repo for the dark legacy flow / rollback.
export default function SnapshotLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-warm-ivory font-body text-charcoal">{children}</div>;
}
