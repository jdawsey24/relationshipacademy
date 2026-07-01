import CopyTabs from "@/components/admin/CopyTabs";
import CopyEditor from "@/components/admin/CopyEditor";

export default function RiskLevelsCopyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Result Copy</h1>
      <CopyTabs />
      <CopyEditor
        apiPath="/api/admin/risk-levels"
        identityField="risk_level"
        identityLabel="Risk Level"
      />
    </div>
  );
}
