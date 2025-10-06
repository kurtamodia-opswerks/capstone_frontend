"use client";

import React, { useEffect, useRef, useState } from "react";
import RechartsRenderer from "./RechartsRenderer";
import ChartJSRenderer from "./ChartJSRenderer";

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
  const [rechartsTime, setRechartsTime] = useState<number | null>(null);
  const [chartJsTime, setChartJsTime] = useState<number | null>(null);

  const renderStartRef = useRef<number>(0);

  // Reset measurement when data or chart type changes
  useEffect(() => {
    renderStartRef.current = performance.now();
    setRechartsTime(null);
    setChartJsTime(null);
  }, [chartType, data, xAxis, yAxis]);

  const handleRechartsRendered = () => {
    const end = performance.now();
    setRechartsTime(end - renderStartRef.current);
  };

  const handleChartJsRendered = () => {
    const end = performance.now();
    setChartJsTime(end - renderStartRef.current);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <RechartsRenderer
          chartType={chartType}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          onRendered={handleRechartsRendered}
        />
        <ChartJSRenderer
          chartType={chartType}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          onRendered={handleChartJsRendered}
        />
      </div>

      {/* Benchmark Results */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="font-medium">Benchmark Results</h3>
        <p>
          Recharts Render Time:{" "}
          {rechartsTime ? `${rechartsTime.toFixed(2)} ms` : "..."}
        </p>
        <p>
          Chart.js Render Time:{" "}
          {chartJsTime ? `${chartJsTime.toFixed(2)} ms` : "..."}
        </p>
      </div>
    </div>
  );
}
