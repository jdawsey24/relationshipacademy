import AssessmentTabs from "@/components/admin/AssessmentTabs";
import CopyEditor from "@/components/admin/CopyEditor";

export default function RiskLevelsCopyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Assessment</h1>
      <AssessmentTabs />
      <h2 className="mb-4 text-lg font-semibold text-midnight-navy">Risk Levels</h2>
      <CopyEditor
        apiPath="/api/admin/risk-levels"
        identityField="risk_level"
        identityLabel="Risk Level"
      />
    </div>
  );
}
