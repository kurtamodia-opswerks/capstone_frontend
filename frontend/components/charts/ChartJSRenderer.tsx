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
        backgroundColor: ["#8884d8", "#82ca9d", "#ffc658"],
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
