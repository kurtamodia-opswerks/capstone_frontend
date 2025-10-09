"use client";

import { useEffect, useState } from "react";
import { fetchAggregatedData } from "@/lib/api/chart";
import ChartPreview from "@/components/charts/ChartPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, BarChart3, Plus } from "lucide-react";

interface DashboardChartsProps {
  charts: any[];
  mode: "aggregated" | "dataset";
  uploadId: string | null;
}

export default function DashboardCharts({
  charts,
  mode,
  uploadId,
}: DashboardChartsProps) {
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results: Record<string, any[]> = {};

      for (const chart of charts) {
        try {
          const data = await fetchAggregatedData(
            uploadId,
            chart.x_axis,
            chart.y_axis,
            chart.agg_func,
            chart.year_from,
            chart.year_to
          );
          results[chart._id] = data;
        } catch (err) {
          console.error(`Failed to fetch data for chart ${chart._id}`, err);
          results[chart._id] = [];
        }
      }

      setChartData(results);
      setLoading(false);
    };

    if (charts.length > 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [charts, uploadId]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!charts.length) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Charts Yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Create your first visualization to see it appear in your dashboard.
        </p>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create First Chart
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {charts.length} {charts.length === 1 ? "Chart" : "Charts"}
          </h2>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        className={`
        gap-6
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "space-y-6"
        }
      `}
      >
        {charts.map((chart, index) => (
          <div
            key={chart._id}
            className={`
              group relative
              ${
                viewMode === "grid"
                  ? "bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  : "bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
              }
            `}
          >
            {/* Chart Header */}
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {chart.name || `Chart ${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {chart.chart_type} • {chart.agg_func || "No aggregation"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Content */}
            <div className={viewMode === "grid" ? "p-4 aspect-video" : "p-6"}>
              {chartData[chart._id] ? (
                <ChartPreview
                  mode={mode}
                  chartType={chart.chart_type}
                  data={chartData[chart._id]}
                  xAxis={chart.x_axis}
                  yAxis={chart.y_axis}
                  uploadId={uploadId}
                  aggFunc={chart.agg_func}
                  yearFrom={chart.year_from}
                  yearTo={chart.year_to}
                  showPerformancePanel={false}
                />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  Failed to load chart data
                </div>
              )}
            </div>

            {/* Chart Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>X: {chart.x_axis}</span>
                <span>Y: {chart.y_axis}</span>
                {chart.year_from && (
                  <span>
                    Range: {chart.year_from}
                    {chart.year_to ? `-${chart.year_to}` : "+"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="p-4 aspect-video">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
