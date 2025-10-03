"use client";
import { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function RechartsRenderer({
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
  useEffect(() => {
    // after first paint
    requestAnimationFrame(() => {
      onRendered?.();
    });
  }, [data, chartType, xAxis, yAxis]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      {chartType === "bar" ? (
        <BarChart data={data}>
          <XAxis dataKey={xAxis ?? ""} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yAxis ?? ""} fill="#8884d8" />
        </BarChart>
      ) : chartType === "line" ? (
        <LineChart data={data}>
          <XAxis dataKey={xAxis ?? ""} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey={yAxis ?? ""} stroke="#82ca9d" />
        </LineChart>
      ) : (
        <PieChart>
          <Pie
            data={data}
            dataKey={yAxis ?? ""}
            nameKey={xAxis ?? ""}
            outerRadius={150}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
}
