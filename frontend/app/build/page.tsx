"use client";
import { useSearchParams } from "next/navigation";
import ChartControls from "@/components/charts/ChartControls";
import { useBuildData } from "./hooks/useBuildData";
import BuildHeader from "./components/BuildHeader";
import { BarChart3 } from "lucide-react";
import Loading from "./loading";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BuildHeader />

        {loading ? (
          <Loading />
        ) : headers.length > 0 ? (
          <>
            {" "}
            <ChartControls
              headers={headers}
              uploadId={uploadId}
              mode={mode}
              initialConfig={initialConfig || undefined}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Headers Found
            </h3>
            <p className="text-gray-500 mb-6">
              Please upload a dataset first to get started with visualization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
