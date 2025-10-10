"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChartControls from "@/components/charts/ChartControls";
import { useDataStore } from "@/store/dataStore";
import { fetchChartById } from "@/lib/api/chart";

export default function BuildPage() {
  const searchParams = useSearchParams();
  const mode =
    searchParams.get("mode") === "dataset" ? "dataset" : "aggregated";
  const uploadId = searchParams.get("uploadId");
  const chartId = searchParams.get("chartId");

  const { headers, refreshCharts } = useDataStore();
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data and chart details
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshCharts(mode, uploadId || null);

        if (chartId) {
          const chartData = await fetchChartById(chartId);
          setInitialConfig({
            chartType: chartData.chart_type,
            xAxis: chartData.x_axis,
            yAxis: chartData.y_axis,
            aggFunc: chartData.agg_func,
            yearFrom: chartData.year_from,
            yearTo: chartData.year_to,
          });
        }
      } catch (err) {
        console.error("Error loading build page:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, uploadId, chartId, refreshCharts]);

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chart Builder
          </h1>
        </div>
      </div>

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
