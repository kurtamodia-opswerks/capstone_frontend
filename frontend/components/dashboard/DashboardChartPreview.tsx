"use client";

import RechartsRenderer from "@/components/charts/RechartsRenderer";
import ChartJSRenderer from "@/components/charts/ChartJSRenderer";
import PlotlyRenderer from "@/components/charts/PlotlyRenderer";

export default function DashboardChartPreview({
  chartType,
  data,
  xAxis,
  yAxis,

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
  chartingLibrary: "recharts" | "chartjs" | "plotly";
}) {
  return (
    <div className="space-y-8">
      {/* ===================== RECHARTS ===================== */}
      {chartingLibrary === "recharts" && (
        <div>
          <RechartsRenderer
            chartType={chartType}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
          />
        </div>
      )}

      {/* ===================== CHART.JS ===================== */}
      {chartingLibrary === "chartjs" && (
        <div>
          <ChartJSRenderer
            chartType={chartType}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
          />
        </div>
      )}

      {/* ===================== PLOTLY ===================== */}
      {chartingLibrary === "plotly" && (
        <div>
          <PlotlyRenderer
            chartType={chartType}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
          />
        </div>
      )}
    </div>
  );
}
