"use client";

import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register all chart types globally once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartJSRendererProps {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRenderStart?: () => void;
  onRenderEnd?: () => void;
}

export default function ChartJSRenderer({
  chartType,
  data,
  xAxis,
  yAxis,
  onRenderStart,
  onRenderEnd,
}: ChartJSRendererProps) {
  // Lifecycle for render timing (same pattern as PlotlyRenderer)
  useEffect(() => {
    onRenderStart?.();
    const timeout = setTimeout(() => onRenderEnd?.(), 0);
    return () => clearTimeout(timeout);
  }, [data, chartType]);

  // Handle missing or invalid data gracefully
  if (!data || data.length === 0 || !xAxis || !yAxis) {
    return <p className="text-gray-400 text-center">No data to visualize</p>;
  }

  // Extract values
  const labels = data.map((d) => d[xAxis]);
  const values = data.map((d) => d[yAxis]);

  // Shared chart.js dataset colors
  const colors = [
    "#4f46e5",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  // Build data object dynamically
  const chartData =
    chartType === "pie"
      ? {
          labels,
          datasets: [
            {
              label: yAxis ?? "Value",
              data: values,
              backgroundColor: colors,
            },
          ],
        }
      : {
          labels,
          datasets: [
            {
              label: yAxis ?? "Value",
              data: values,
              backgroundColor:
                chartType === "bar" ? "#4f46e5" : "rgba(75,192,192,0.4)",
              borderColor:
                chartType === "line" ? "#16a34a" : "rgba(75,192,192,1)",
              borderWidth: 2,
            },
          ],
        };

  // Shared chart options
  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text:
          chartType === "bar"
            ? "Chart.js Bar Chart"
            : chartType === "line"
            ? "Chart.js Line Chart"
            : "Chart.js Pie Chart",
      },
    },
    scales:
      chartType !== "pie"
        ? {
            x: {
              title: { display: true, text: xAxis ?? "" },
              grid: { color: "rgba(200,200,200,0.2)" },
            },
            y: {
              title: { display: true, text: yAxis ?? "" },
              grid: { color: "rgba(200,200,200,0.2)" },
            },
          }
        : undefined,
  };

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      {chartType === "bar" && <Bar data={chartData} options={options} />}
      {chartType === "line" && <Line data={chartData} options={options} />}
      {chartType === "pie" && <Pie data={chartData} options={options} />}
    </div>
  );
}
