"use client";

import { useSearchParams } from "next/navigation";
import { useDashboard } from "./hooks/useDashboard";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardEmptyState from "./components/DashboardEmptyState";
import DashboardContent from "./components/DashboardContent";
import Loading from "./loading";

export default function Dashboard() {
  const searchParams = useSearchParams();

  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "schemaless"
      ? "schemaless"
      : "aggregated";

  const uploadId = searchParams.get("uploadId");

  const dashboardState = useDashboard(mode, uploadId);
  const { dashboard, loading } = dashboardState;

  if (loading) {
    <Loading />;
  }

  // Handle missing or invalid dashboard
  if (!dashboard || !dashboard._id) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 grid grid-cols-7 gap-4">
      <DashboardSidebar mode={mode} uploadId={uploadId} {...dashboardState} />
      <DashboardContent mode={mode} uploadId={uploadId} {...dashboardState} />
    </div>
  );
}
