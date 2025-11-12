"use client";

import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardHeader from "./DashboardHeader";

interface DashboardContentProps {
  mode: "dataset" | "aggregated" | "schemaless";
  uploadId: string | null;
  loading: boolean;
  dashboard: any;
  handleImportChart: (e: React.MouseEvent) => void;
  showRecharts: boolean;
  showChartJs: boolean;
  showPlotly: boolean;
}

export default function DashboardContent({
  mode,
  uploadId,
  loading,
  dashboard,
  handleImportChart,
  showRecharts,
  showChartJs,
  showPlotly,
}: DashboardContentProps) {
  return (
    <div className="w-full mx-auto p-6 col-span-6">
      <DashboardHeader mode={mode} uploadId={uploadId} />
      {!loading && (
        <DashboardCharts
          charts={dashboard.charts || []}
          mode={mode}
          uploadId={uploadId}
          dashboardId={dashboard._id}
          initialYearFrom={dashboard.year_from}
          initialYearTo={dashboard.year_to}
          handleImportChart={handleImportChart}
          showRecharts={showRecharts}
          showChartJs={showChartJs}
          showPlotly={showPlotly}
        />
      )}
    </div>
  );
}
