"use client";
import { useSearchParams } from "next/navigation";
import ChartControls from "@/components/charts/ChartControls";
import { useBuildData } from "./hooks/useBuildData";
import BuildHeader from "./components/BuildHeader";

export default function BuildPage() {
  const searchParams = useSearchParams();
  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "aggregated"
      ? "aggregated"
      : "schemaless";
  const uploadId = searchParams.get("uploadId");
  const chartId = searchParams.get("chartId");

  const { headers, loading, initialConfig } = useBuildData(
    mode,
    uploadId,
    chartId
  );

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      <BuildHeader />

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : headers.length > 0 ? (
        <ChartControls
          headers={headers}
          uploadId={uploadId}
          mode={mode}
          initialConfig={initialConfig || undefined}
        />
      ) : (
        <p className="text-center text-gray-400">
          No headers found. Please upload a dataset first.
        </p>
      )}
    </div>
  );
}
