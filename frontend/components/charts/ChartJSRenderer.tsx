import { useEffect } from "react";
import BarChart from "./chartjs-charts/BarChart";
import LineGraph from "./chartjs-charts/LineGraph";
import PieChart from "./chartjs-charts/PieChart";

export default function ChartJSRenderer({
  chartType,
  data,
  xAxis,
  yAxis,
  onRenderStart,
  onRenderEnd,
}: {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRenderStart?: () => void;
  onRenderEnd?: () => void;
}) {
  useEffect(() => {
    onRenderStart?.();
    const timeout = setTimeout(() => onRenderEnd?.(), 0);
    return () => clearTimeout(timeout);
  }, [data, chartType]);

  const chartJsData = {
    labels: data.map((d) => d[xAxis as string]),
    datasets: [
      {
        label: yAxis ?? "Value",
        data: data.map((d) => d[yAxis as string]),
        backgroundColor: [
          "#8884d8",
          "#82ca9d",
          "#ffc658",
          "#ef5350",
          "#ec407a",
          "#ab47bc",
          "#7e57c2",
          "#5c6bc0",
          "#42a5f5",
          "#26c6da",
          "#00bcd4",
          "#009688",
          "#4caf50",
          "#8bc34a",
          "#cddc39",
          "#ffeb3b",
          "#ffc107",
          "#ff9800",
          "#ff5722",
          "#795548",
          "#9e9e9e",
          "#607d8b",
        ],
      },
    ],
  };

  return (
    <div className="flex w-full h-[400px] items-center justify-center">
      {chartType === "bar" && <BarChart data={chartJsData} />}
      {chartType === "line" && <LineGraph data={chartJsData} />}
      {chartType === "pie" && <PieChart data={chartJsData} />}
    </div>
  );
}
