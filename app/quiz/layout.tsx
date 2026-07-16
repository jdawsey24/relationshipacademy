import Logo from "@/components/Logo";

// Chrome for the Relationship Snapshot cluster quizzes — its own minimal shell
// (no global site nav), separate from everything else. Built in parallel with the
// live 47-item Snapshot at /snapshot; repointed at cutover.
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-ivory font-body text-charcoal">
      <header className="px-6 pt-6">
        <Logo variant="full" href="/" className="h-8" />
      </header>
      {children}
    </div>
  );
}
