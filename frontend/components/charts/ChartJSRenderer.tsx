"use client";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  Bar as ChartJSBar,
  Line as ChartJSLine,
  Pie as ChartJSPie,
} from "react-chartjs-2";

ChartJS.register(
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function ChartJSRenderer({
  chartType,
  data,
  xAxis,
  yAxis,
  onRendered,
}: {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRendered?: () => void;
}) {
  const chartJsData = {
    labels: data.map((d) => d[xAxis as string]),
    datasets: [
      {
        label: yAxis ?? "Value",
        data: data.map((d) => d[yAxis as string]),
        backgroundColor: ["#8884d8", "#82ca9d", "#ffc658"],
      },
    ],
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      onRendered?.();
    });
  }, [data, chartType, xAxis, yAxis]);

  return (
    <div className="w-full h-[400px]">
      {chartType === "bar" && <ChartJSBar data={chartJsData} />}
      {chartType === "line" && <ChartJSLine data={chartJsData} />}
      {chartType === "pie" && <ChartJSPie data={chartJsData} />}
    </div>
  );
}
