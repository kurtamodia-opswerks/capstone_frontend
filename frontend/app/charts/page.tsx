"use client";

import { useSearchParams } from "next/navigation";
import { useCharts } from "./hooks/useCharts";
import DatasetInfoCard from "./components/DatasetInfoCard";
import SavedChartsSection from "./components/SavedChartsSection";
import ChartsEmptyState from "./components/ChartsEmptyState";

export default function ChartsPageClient() {
  const searchParams = useSearchParams();

  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "aggregated"
      ? "aggregated"
      : "schemaless";

  const uploadId = searchParams.get("uploadId");

  const {
    loading,
    headers,
    savedCharts,
    dashboardCharts,
    handleCreateChart,
    handleLoadChart,
    handleViewDashboard,
    handleAddToDashboard,
    handleDeleteChart,
  } = useCharts(mode, uploadId);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground text-sm">Loading charts...</p>
          </div>
        </div>
      </>
    );
  }

  if (!headers || headers.length === 0) {
    return <ChartsEmptyState />;
  }

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Saved Visualizations
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Browse your existing charts or create new ones
          </p>
        </div>
      </div>

      {headers.length > 0 && (
        <DatasetInfoCard
          headers={headers}
          uploadId={uploadId}
          onViewDashboard={handleViewDashboard}
          onCreateChart={handleCreateChart}
        />
      )}

      <SavedChartsSection
        savedCharts={savedCharts}
        dashboardCharts={dashboardCharts}
        onLoadChart={handleLoadChart}
        onAddToDashboard={handleAddToDashboard}
        onDeleteChart={handleDeleteChart}
      />
    </div>
  );
}
