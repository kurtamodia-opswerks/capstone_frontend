"use client";

import React, { Profiler, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RechartsRenderer from "@/components/charts/RechartsRenderer";
import ChartJSRenderer from "@/components/charts/ChartJSRenderer";
import PlotlyRenderer from "@/components/charts/PlotlyRenderer";
import { Card, CardContent } from "@/components/ui/card";
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

export default function DashboardChartPreview({
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

  return (
    <div className="space-y-8">
      {/* ===================== RECHARTS ===================== */}
      {showRecharts && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Recharts{" "}
            <span className="text-xs text-gray-500">
              (React Render Time:{" "}
              {rechartsTimer.renderTime
                ? `${rechartsTimer.renderTime.toFixed(1)} ms`
                : "–"}
              --||--
            </span>
            <span className="text-xs text-gray-500">
              Paint Time:{" "}
              {rechartsTimer.paintTime
                ? `${rechartsTimer.paintTime.toFixed(1)} ms`
                : "–"}
              )
            </span>
          </h4>
          <Profiler id="recharts" onRender={handleProfilerMetrics}>
            <RechartsRenderer
              chartType={chartType}
              data={data}
              xAxis={xAxis}
              yAxis={yAxis}
              onRenderStart={rechartsTimer.onRenderStart}
              onRenderEnd={rechartsTimer.onRenderEnd}
            />
          </Profiler>
        </div>
      )}

      {/* ===================== CHART.JS ===================== */}
      {showChartJs && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Chart.js{" "}
            <span className="text-xs text-gray-500">
              (React Render Time:{" "}
              {chartjsTimer.renderTime
                ? `${chartjsTimer.renderTime.toFixed(1)} ms`
                : "–"}
              --||--
            </span>
            <span className="text-xs text-gray-500">
              Paint Time:{" "}
              {chartjsTimer.paintTime
                ? `${chartjsTimer.paintTime.toFixed(1)} ms`
                : "–"}
              )
            </span>
          </h4>
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
        </div>
      )}

      {/* ===================== PLOTLY ===================== */}
      {showPlotly && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Plotly{" "}
            <span className="text-xs text-gray-500">
              (React Render Time:{" "}
              {plotlyTimer.renderTime
                ? `${plotlyTimer.renderTime.toFixed(1)} ms`
                : "–"}
              --||--
            </span>
            <span className="text-xs text-gray-500">
              Paint Time:{" "}
              {plotlyTimer.paintTime
                ? `${plotlyTimer.paintTime.toFixed(1)} ms`
                : "–"}
              )
            </span>
          </h4>
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
        </div>
      )}

      {/* ===================== PERFORMANCE PANEL ===================== */}
      {showPerformancePanel && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-gray-800">
              Performance Comparison
            </h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>
                <span className="font-bold text-blue-600">Recharts:</span>{" "}
                {rechartsTimer.renderTime && rechartsTimer.paintTime
                  ? `${(
                      rechartsTimer.renderTime + rechartsTimer.paintTime
                    ).toFixed(2)} ms`
                  : "–"}
              </li>

              <li>
                <span className="font-bold text-green-600">Chart.js:</span>{" "}
                {chartjsTimer.renderTime && chartjsTimer.paintTime
                  ? `${(
                      chartjsTimer.renderTime + chartjsTimer.paintTime
                    ).toFixed(2)} ms`
                  : "–"}
              </li>

              <li>
                <span className="font-bold text-purple-600">Plotly:</span>{" "}
                {plotlyTimer.renderTime && plotlyTimer.paintTime
                  ? `${(plotlyTimer.renderTime + plotlyTimer.paintTime).toFixed(
                      2
                    )} ms`
                  : "–"}
              </li>
            </ul>

            {/* Save Chart */}
            <div className="pt-4 flex items-center gap-2">
              <Button
                onClick={() => setOpenDialog(true)}
                disabled={!xAxis || !yAxis}
              >
                {chartId ? "Update Chart" : "Save Chart Configuration"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================== SAVE / UPDATE DIALOG ===================== */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {chartId ? "Update Existing Chart" : "Save New Chart"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Chart Name</Label>
            <Input
              placeholder="Enter chart name"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveChart}
              disabled={!chartName.trim() || saving}
            >
              {saving
                ? chartId
                  ? "Updating..."
                  : "Saving..."
                : chartId
                ? "Update"
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
