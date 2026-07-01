import CopyTabs from "@/components/admin/CopyTabs";
import CopyEditor from "@/components/admin/CopyEditor";

export default function ResultLevelsCopyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Result Copy</h1>
      <CopyTabs />
      <CopyEditor
        apiPath="/api/admin/result-levels"
        identityField="level"
        identityLabel="Level"
        groupByDomain
      />
    </div>
  );
}
