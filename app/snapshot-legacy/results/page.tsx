import AssessResults from "@/components/assess/AssessResults";

// Flagship results now render the Studio instrument's authored participant
// report (studio stack). Legacy results UI preserved in git history for rollback.
export default function SnapshotResultsPage() {
  return <AssessResults />;
}
