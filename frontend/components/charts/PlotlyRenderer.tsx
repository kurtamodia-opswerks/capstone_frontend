"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import type * as Plotly from "plotly.js";

// Dynamically import for SSR safety
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyRendererProps {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRenderStart?: () => void;
  onRenderEnd?: () => void;
}

export default function PlotlyRenderer({
  chartType,
  data,
  xAxis,
  yAxis,
  onRenderStart,
  onRenderEnd,
}: PlotlyRendererProps) {
  useEffect(() => {
    onRenderStart?.();
  }, [data, chartType]);

  if (!data?.length || !xAxis || !yAxis) {
    return <p className="text-gray-400 text-center">No data to visualize</p>;
  }

  const xValues = data.map((d) => d[xAxis]);
  const yValues = data.map((d) => d[yAxis]);

  let plotData: any[] = [];
  if (chartType === "bar") {
    plotData = [
      { x: xValues, y: yValues, type: "bar", marker: { color: "#4f46e5" } },
    ];
  } else if (chartType === "line") {
    plotData = [
      {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "lines+markers",
        line: { color: "#16a34a" },
      },
    ];
  } else {
    plotData = [{ labels: xValues, values: yValues, type: "pie" }];
  }

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    margin: { t: 30, b: 50, l: 50, r: 30 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    xaxis: { title: { text: xAxis ?? "" } },
    yaxis: { title: { text: yAxis ?? "" } },
  };

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        onAfterPlot={onRenderEnd}
      />
    </div>
  );
}
