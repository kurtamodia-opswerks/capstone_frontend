"use client";

import React, { useEffect } from "react";
import { useDatasetStore } from "@/store/datasetStore";
import ChartControls from "../../components/charts/ChartControls";
import { useChartStore } from "@/store/chartStore";
import { useSearchParams } from "next/navigation";

export default function Analysis() {
  const params = useSearchParams();
  const mode = params.get("mode");

  const { headers, fetchHeaders } = useDatasetStore();
  const { loadChartById, pendingChartId, setPendingChartId, resetChartState } =
    useChartStore();

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  useEffect(() => {
    if (mode === "edit" && pendingChartId) {
      loadChartById(pendingChartId);
      setPendingChartId(null);
    }

    if (mode === "new") {
      resetChartState();
    }
  }, [pendingChartId, mode]);

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dataset Analysis
          </h1>
        </div>
      </div>

      {headers.length > 0 && <ChartControls />}
    </div>
  );
}
