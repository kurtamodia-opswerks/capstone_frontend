"use client";

import React, { Profiler, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RechartsRenderer from "./RechartsRenderer";
import ChartJSRenderer from "./ChartJSRenderer";
import PlotlyRenderer from "./PlotlyRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSaveChart } from "@/hooks/useSaveChart";
import { useRenderTimer } from "@/hooks/useRenderTimer";
import { updateChart } from "@/lib/api/chart";
import { useDataStore } from "@/store/dataStore";
import {
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Save,
  Trophy,
  Clock,
} from "lucide-react";

export default function ChartPreview({
  mode,
  chartType,
  data,
  xAxis,
  yAxis,
  uploadId,
  aggFunc,
  yearFrom,
  yearTo,
  showPerformancePanel = true,
  showChartJs = true,
  showRecharts = true,
  showPlotly = true,
  chartingLibrary,
}: {
  mode: "aggregated" | "dataset" | "schemaless";
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  uploadId?: string | null;
  aggFunc?: string;
  yearFrom?: string | null;
  yearTo?: string | null;
  showPerformancePanel?: boolean;
  showChartJs?: boolean;
  showRecharts?: boolean;
  showPlotly?: boolean;
  chartingLibrary: "recharts" | "chartjs" | "plotly";
}) {
  const { refreshCharts } = useDataStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chartId = searchParams.get("chartId");

  const { saveChart, saving } = useSaveChart();
  const [openDialog, setOpenDialog] = useState(false);
  const [chartName, setChartName] = useState("");

  const rechartsTimer = useRenderTimer();
  const chartjsTimer = useRenderTimer();
  const plotlyTimer = useRenderTimer();

  const handleProfilerMetrics = (
    id: string,
    phase: string,
    actualDuration: number
  ) => {
    if (phase === "mount") {
      if (id === "recharts") {
        rechartsTimer.setRenderTime(actualDuration);
      } else if (id === "chartjs") {
        chartjsTimer.setRenderTime(actualDuration);
      } else if (id === "plotly") {
        plotlyTimer.setRenderTime(actualDuration);
      }
    }
  };

  const handleSaveChart = async () => {
    if (!xAxis || !yAxis) {
      toast.error("Missing chart configuration");
      return;
    }

    try {
      if (chartId) {
        await updateChart(chartId, {
          mode,
          uploadId,
          chartType,
          xAxis,
          yAxis,
          aggFunc,
          yearFrom,
          yearTo,
          chartName,
          chartingLibrary,
        });
        toast.success("Chart updated successfully");
      } else {
        await saveChart({
          mode,
          uploadId,
          chartType,
          xAxis,
          yAxis,
          aggFunc,
          yearFrom,
          yearTo,
          chartName,
          chartingLibrary,
        });
        toast.success("Chart saved successfully");
      }

      setOpenDialog(false);
      setChartName("");
      await refreshCharts(mode, uploadId ?? null);
      const params = new URLSearchParams({ mode });
      if (uploadId) params.set("uploadId", uploadId);
      router.push(`/charts?${params.toString()}`);
    } catch (error) {
      toast.error("Failed to save chart");
      console.error(error);
    }
  };

  const renderTimes = {
    recharts: (rechartsTimer.renderTime ?? 0) + (rechartsTimer.paintTime ?? 0),
    chartjs: (chartjsTimer.renderTime ?? 0) + (chartjsTimer.paintTime ?? 0),
    plotly: (plotlyTimer.renderTime ?? 0) + (plotlyTimer.paintTime ?? 0),
  };

  const fastestLibrary = Object.entries(renderTimes).reduce(
    (fastest, [lib, time]) => {
      return time > 0 && time < fastest.time ? { lib, time } : fastest;
    },
    { lib: "", time: Infinity }
  );

  const chartConfigs = [
    {
      id: "recharts",
      name: "Recharts",
      icon: BarChart3,
      color: "blue",
      show: showRecharts,
    },
    {
      id: "chartjs",
      name: "Chart.js",
      icon: LineChart,
      color: "green",
      show: showChartJs,
    },
    {
      id: "plotly",
      name: "Plotly",
      icon: PieChart,
      color: "purple",
      show: showPlotly,
    },
  ];

  return (
    <div className="space-y-6 h-full">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chart Comparison
          </h3>
          <p className="text-sm text-gray-600">
            Same data, different libraries
          </p>
        </div>
        <Button
          onClick={() => setOpenDialog(true)}
          disabled={!xAxis || !yAxis}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {chartId ? "Update Chart" : "Save Chart"}
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {chartConfigs.map(
          (config) =>
            config.show && (
              <Card key={config.id} className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <config.icon
                        className={`h-5 w-5 text-${config.color}-600`}
                      />
                      <span>{config.name}</span>
                    </div>
                    {fastestLibrary.lib === config.id && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <div className=" border rounded-lg">
                    {config.id === "recharts" &&
                      chartingLibrary === "recharts" && (
                        <Profiler
                          id="recharts"
                          onRender={handleProfilerMetrics}
                        >
                          <RechartsRenderer
                            chartType={chartType}
                            data={data}
                            xAxis={xAxis}
                            yAxis={yAxis}
                            onRenderStart={rechartsTimer.onRenderStart}
                            onRenderEnd={rechartsTimer.onRenderEnd}
                          />
                        </Profiler>
                      )}
                    {config.id === "chartjs" &&
                      chartingLibrary === "chartjs" && (
                        <Profiler id="chartjs" onRender={handleProfilerMetrics}>
                          <ChartJSRenderer
                            chartType={chartType}
                            data={data}
                            xAxis={xAxis}
                            yAxis={yAxis}
                            onRenderStart={chartjsTimer.onRenderStart}
                            onRenderEnd={chartjsTimer.onRenderEnd}
                          />
                        </Profiler>
                      )}
                    {config.id === "plotly" && chartingLibrary === "plotly" && (
                      <Profiler id="plotly" onRender={handleProfilerMetrics}>
                        <PlotlyRenderer
                          chartType={chartType}
                          data={data}
                          xAxis={xAxis}
                          yAxis={yAxis}
                          onRenderStart={plotlyTimer.onRenderStart}
                          onRenderEnd={plotlyTimer.onRenderEnd}
                        />
                      </Profiler>
                    )}
                  </div>

                  {/* Performance Metric for each chart */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          Render Time + Paint:
                        </span>
                      </div>
                      <span
                        className={`font-bold ${
                          fastestLibrary.lib === config.id
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {renderTimes[config.id as keyof typeof renderTimes] > 0
                          ? `${renderTimes[
                              config.id as keyof typeof renderTimes
                            ].toFixed(1)} ms`
                          : "–"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
        )}
      </div>

      {/* Performance Panel */}
      {showPerformancePanel && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Performance Comparison
                </h4>
                <p className="text-sm text-gray-600">
                  Real-time rendering performance across different libraries
                </p>
              </div>

              {fastestLibrary.lib && (
                <div className="text-right bg-white px-4 py-2 rounded-lg border">
                  <p className="text-sm font-medium text-gray-700">
                    Performance Winner
                  </p>
                  <p className="text-lg font-bold text-green-600 capitalize flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    {fastestLibrary.lib}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {chartConfigs.map(
                (config) =>
                  config.show && (
                    <div
                      key={config.id}
                      className={`text-center p-4 rounded-lg transition-all ${
                        fastestLibrary.lib === config.id
                          ? "bg-green-100 border-2 border-green-300 shadow-sm"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <config.icon
                          className={`h-5 w-5 text-${config.color}-600`}
                        />
                        <p className="font-semibold text-gray-800">
                          {config.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold text-gray-900">
                          {renderTimes[config.id as keyof typeof renderTimes] >
                          0
                            ? `${renderTimes[
                                config.id as keyof typeof renderTimes
                              ].toFixed(1)}`
                            : "–"}
                        </p>
                        <p className="text-sm text-gray-600">milliseconds</p>
                      </div>
                      {fastestLibrary.lib === config.id && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <Trophy className="h-3 w-3" />
                          Fastest
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              {chartId ? "Update Chart" : "Save Chart Configuration"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Chart Name</Label>
            <Input
              placeholder="Enter a descriptive name for your chart"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveChart}
              disabled={!chartName.trim() || saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {chartId ? "Updating..." : "Saving..."}
                </>
              ) : chartId ? (
                "Update Chart"
              ) : (
                "Save Chart"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
