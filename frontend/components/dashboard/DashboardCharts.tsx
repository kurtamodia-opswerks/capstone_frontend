"use client";

import React, { useEffect, useState } from "react";
import { fetchAggregatedData } from "@/lib/api/chart";
import {
  removeChartFromDashboard,
  updateDashboardDateRange,
} from "@/lib/api/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Grid3X3,
  List,
  BarChart3,
  Plus,
  Calendar,
  Save,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/store/dataStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "../ui/slider";
import { fetchAggregateSchemalessData } from "@/lib/api/schema_less";
import DashboardChartPreview from "./DashboardChartPreview";

interface DashboardChartsProps {
  charts: any[];
  mode: "aggregated" | "dataset" | "schemaless";
  uploadId: string | null;
  dashboardId: string;
  initialYearFrom?: number | null;
  initialYearTo?: number | null;
  handleImportChart: (e: React.MouseEvent) => void;
  showRecharts: boolean;
  showChartJs: boolean;
  showPlotly: boolean;
}

export default function DashboardCharts({
  charts,
  mode,
  uploadId,
  dashboardId,
  initialYearFrom,
  initialYearTo,
  handleImportChart,
}: DashboardChartsProps) {
  const router = useRouter();
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [globalYearFrom, setGlobalYearFrom] = useState<string | null>(
    initialYearFrom?.toString() || ""
  );
  const [globalYearTo, setGlobalYearTo] = useState<string | null>(
    initialYearTo?.toString() || ""
  );

  const [debouncedYearFrom, setDebouncedYearFrom] = useState(globalYearFrom);
  const [debouncedYearTo, setDebouncedYearTo] = useState(globalYearTo);
  const [saving, setSaving] = useState(false);

  const { minYear, maxYear, getYearRange, refreshDashboard } = useDataStore();

  useEffect(() => {
    if (mode === "schemaless") {
      return;
    }
    const loadYearRange = async () => {
      await getYearRange(uploadId);
      if (!globalYearFrom) setGlobalYearFrom(minYear.toString());
      if (!globalYearTo) setGlobalYearTo(maxYear.toString());
    };
    loadYearRange();
  }, [uploadId]);

  // Debounce typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedYearFrom(globalYearFrom);
      setDebouncedYearTo(globalYearTo);
    }, 600);
    return () => clearTimeout(handler);
  }, [globalYearFrom, globalYearTo]);

  // Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results: Record<string, any[]> = {};

      for (const chart of charts) {
        try {
          if (mode === "schemaless" && uploadId) {
            const data = await fetchAggregateSchemalessData({
              upload_id: uploadId,
              x_axis: chart.x_axis,
              y_axis: chart.y_axis,
              agg_func: chart.agg_func,
            });
            results[chart._id] = data;
            continue;
          } else {
            const data = await fetchAggregatedData(
              uploadId,
              chart.x_axis,
              chart.y_axis,
              chart.agg_func,
              debouncedYearFrom || chart.year_from,
              debouncedYearTo || chart.year_to
            );
            results[chart._id] = data;
          }
        } catch (err) {
          console.error(`Failed to fetch data for chart ${chart._id}`, err);
          results[chart._id] = [];
        }
      }

      setChartData(results);
      setLoading(false);
    };

    if (charts.length > 0) fetchData();
    else setLoading(false);
  }, [charts, uploadId, debouncedYearFrom, debouncedYearTo]);

  // Manual save button handler
  const handleSaveFilters = async () => {
    try {
      setSaving(true);
      await updateDashboardDateRange(
        dashboardId,
        globalYearFrom ? Number(globalYearFrom) : null,
        globalYearTo ? Number(globalYearTo) : null
      );
      toast.success("Dashboard filters saved");
    } catch (err) {
      toast.error("Failed to save filters");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Reset filters (and backend)
  const handleReset = async () => {
    setGlobalYearFrom("");
    setGlobalYearTo("");
    await updateDashboardDateRange(dashboardId, null, null);
  };

  if (loading) return <DashboardSkeleton />;

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
          Import your first visualization to see it appear in your dashboard.
        </p>
        <Button className="gap-2" onClick={handleImportChart}>
          <Plus className="h-4 w-4" />
          Import First Chart
        </Button>
      </div>
    );
  }

  // Handle load chart
  const handleLoadChart = (chart: any) => {
    const params = new URLSearchParams({
      mode,
      chartId: chart._id,
    });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleRemoveChartFromDashboard = async (
    dashboardId: string,
    chartId: string
  ) => {
    await removeChartFromDashboard(dashboardId, chartId);
    await refreshDashboard(mode, uploadId);
  };
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {charts.length} {charts.length === 1 ? "Chart" : "Charts"}
          </h2>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grid View</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>List View</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Global Year Filter */}
        <div className="flex flex-col lg:flex-row items-center gap-4 bg-white border rounded-lg p-4 shadow-sm w-full">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Year Range</span>
          </div>

          <div className="flex-1">
            <Slider
              value={[
                Number(globalYearFrom) || minYear,
                Number(globalYearTo) || maxYear,
              ]}
              min={minYear}
              max={maxYear}
              step={1}
              onValueChange={(value: number[]) => {
                setGlobalYearFrom(value[0].toString());
                setGlobalYearTo(value[1].toString());
              }}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{globalYearFrom || "Start"}</span>
              <span>{globalYearTo || "End"}</span>
            </div>
          </div>

          {/* Save / Reset buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="gap-2"
              onClick={handleSaveFilters}
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Filters"}
            </Button>
            <Button size="sm" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        className={`gap-6 ${
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "space-y-6"
        }`}
      >
        {charts.map((chart, index) => (
          <div
            key={chart._id}
            className={`group relative ${
              viewMode === "grid"
                ? "bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                : "bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
            }`}
          >
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
                      {chart.chart_type} • {chart.agg_func || "No aggregation"}{" "}
                      • {chart.chart_library}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="load"
                        onClick={() => handleLoadChart(chart)}
                      >
                        <RefreshCcw />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Load chart</p>
                    </TooltipContent>
                  </Tooltip>
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove from dashboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove chart</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove this chart from your
                          dashboard?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              handleRemoveChartFromDashboard(
                                dashboardId,
                                chart._id
                              );
                            }}
                          >
                            Confirm
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className={viewMode === "grid" ? "p-4 aspect-video" : "p-6"}>
              {chartData[chart._id] ? (
                <DashboardChartPreview
                  mode={mode}
                  chartType={chart.chart_type}
                  data={chartData[chart._id]}
                  xAxis={chart.x_axis}
                  yAxis={chart.y_axis}
                  uploadId={uploadId}
                  aggFunc={chart.agg_func}
                  yearFrom={globalYearFrom || chart.year_from}
                  yearTo={globalYearTo || chart.year_to}
                  showPerformancePanel={false}
                  chartingLibrary={chart.chart_library}
                />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  Failed to load chart data
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>X: {chart.x_axis}</span>
                <span>Y: {chart.y_axis}</span>
                {(globalYearFrom || chart.year_from) && (
                  <span>
                    Range: {globalYearFrom || chart.year_from}
                    {globalYearTo || chart.year_to
                      ? `-${globalYearTo || chart.year_to}`
                      : "+"}
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
