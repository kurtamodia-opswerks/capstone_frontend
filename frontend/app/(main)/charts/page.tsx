"use client";

import { useSearchParams } from "next/navigation";
import { useCharts } from "./hooks/useCharts";
import DatasetInfoCard from "./components/DatasetInfoCard";
import SavedChartsSection from "./components/SavedChartsSection";
import ChartsEmptyState from "./components/ChartsEmptyState";
import Loading from "./loading";

export default function ChartsPageClient() {
  const searchParams = useSearchParams();

  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "schemaless"
      ? "schemaless"
      : "aggregated";

  const uploadId = searchParams.get("uploadId");

  const {
    loading,
    headers,
    columnTypes,
    savedCharts,
    shareableCharts,
    dashboardCharts,
    handleCreateChart,
    handleLoadChart,
    handleViewDashboard,
    handleAddToDashboard,
    handleDeleteChart,
  } = useCharts(mode, uploadId);

  if (loading) {
    return <Loading />;
  }

  if (!headers || headers.length === 0) {
    return <ChartsEmptyState />;
  }

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">
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
          columnTypes={columnTypes}
          uploadId={uploadId}
          onViewDashboard={handleViewDashboard}
          onCreateChart={handleCreateChart}
        />
      )}

      <SavedChartsSection
        mode={mode}
        savedCharts={savedCharts}
        shareableCharts={shareableCharts}
        dashboardCharts={dashboardCharts}
        onLoadChart={handleLoadChart}
        onAddToDashboard={handleAddToDashboard}
        onDeleteChart={handleDeleteChart}
      />
    </div>
  );
}
