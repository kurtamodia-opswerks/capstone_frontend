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
  const renderStartRef = useRef<number>(0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
}
