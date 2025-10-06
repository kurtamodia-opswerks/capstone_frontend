// components/ChartPreview.tsx
"use client";

import React, { useRef, useState } from "react";
import RechartsRenderer from "./RechartsRenderer";
import ChartJSRenderer from "./ChartJSRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChartStore } from "@/store/chartStore";
import { useDatasetStore } from "@/store/datasetStore";

export default function ChartPreview({
  chartType,
  data,
  xAxis,
  yAxis,
}: {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
}) {
  const { uploadId } = useDatasetStore();
  const [rechartsTime, setRechartsTime] = useState<number | null>(null);
  const [chartjsTime, setChartjsTime] = useState<number | null>(null);

  const rechartsStart = useRef<number>(0);
  const chartjsStart = useRef<number>(0);

  const { saveChart } = useChartStore();

  return (
    <div className="space-y-8">
      {/* ===================== RECHARTS ===================== */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Recharts{" "}
          <span className="text-xs text-gray-500">
            (Render Time: {rechartsTime ? `${rechartsTime.toFixed(1)} ms` : "–"}
            )
          </span>
        </h4>

        <RechartsRenderer
          chartType={chartType}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          onRenderStart={() => (rechartsStart.current = performance.now())}
          onRenderEnd={() =>
            setRechartsTime(performance.now() - rechartsStart.current)
          }
        />
      </div>

      {/* ===================== CHART.JS ===================== */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Chart.js{" "}
          <span className="text-xs text-gray-500">
            (Render Time: {chartjsTime ? `${chartjsTime.toFixed(1)} ms` : "–"})
          </span>
        </h4>

        <ChartJSRenderer
          chartType={chartType}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          onRenderStart={() => (chartjsStart.current = performance.now())}
          onRenderEnd={() =>
            setChartjsTime(performance.now() - chartjsStart.current)
          }
        />
      </div>

      {/* ===================== PERFORMANCE PANEL ===================== */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 space-y-4">
          <h4 className="font-semibold text-gray-800">
            Performance Comparison
          </h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>
              <span className="font-medium text-blue-600">Recharts:</span>{" "}
              {rechartsTime ? `${rechartsTime.toFixed(2)} ms` : "–"}
            </li>
            <li>
              <span className="font-medium text-green-600">Chart.js:</span>{" "}
              {chartjsTime ? `${chartjsTime.toFixed(2)} ms` : "–"}
            </li>
            {rechartsTime && chartjsTime && (
              <li className="pt-2 text-gray-800">
                <span className="font-medium">Faster Library:</span>{" "}
                {rechartsTime < chartjsTime ? (
                  <span className="text-blue-600 font-semibold">
                    Recharts 🚀
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Chart.js ⚡
                  </span>
                )}
              </li>
            )}
          </ul>

          {/* Save Chart */}
          <div className="pt-4 flex items-center gap-2">
            <Button
              onClick={() =>
                saveChart(
                  `${Date.now()} ${chartType} - Upload ID: ${uploadId} - ${xAxis} vs ${yAxis}`
                )
              }
              disabled={!xAxis || !yAxis}
            >
              Save Chart Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
