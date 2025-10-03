"use client";

import React from "react";
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
  return (
    <div className="grid grid-cols-2 gap-6">
      <RechartsRenderer
        chartType={chartType}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
      />
      <ChartJSRenderer
        chartType={chartType}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
      />
    </div>
  );
}
