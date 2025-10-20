"use client";

import { useSearchParams } from "next/navigation";
import { useDashboard } from "./hooks/useDashboard";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardEmptyState from "./components/DashboardEmptyState";
import DashboardContent from "./components/DashboardContent";

export default function Dashboard() {
  const searchParams = useSearchParams();

  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "aggregated"
      ? "aggregated"
      : "schemaless";

  const uploadId = searchParams.get("uploadId");

  const dashboardState = useDashboard(mode, uploadId);
  const { dashboard, loading } = dashboardState;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
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
