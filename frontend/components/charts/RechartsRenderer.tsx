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
  onRenderStart,
  onRenderEnd,
}: {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRenderStart: () => void;
  onRenderEnd: () => void;
}) {
  useEffect(() => {
    onRenderStart?.();
    const timeout = setTimeout(() => onRenderEnd?.(), 0);
    return () => clearTimeout(timeout);
  }, [data, chartType]);

  return (
    <ResponsiveContainer width="80%" height={400} className={"mx-auto"}>
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
