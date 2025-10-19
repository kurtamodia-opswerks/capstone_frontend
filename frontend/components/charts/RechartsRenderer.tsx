"use client";

import React, { useEffect } from "react";
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
  CartesianGrid,
} from "recharts";

interface RechartsRendererProps {
  chartType: "bar" | "line" | "pie";
  data: any[];
  xAxis: string | null;
  yAxis: string | null;
  onRenderStart?: () => void;
  onRenderEnd?: () => void;
}

export default function RechartsRenderer({
  chartType,
  data,
  xAxis,
  yAxis,
  onRenderStart,
  onRenderEnd,
}: RechartsRendererProps) {
  useEffect(() => {
    onRenderStart?.();
    const frame = requestAnimationFrame(() => onRenderEnd?.());
    return () => cancelAnimationFrame(frame);
  }, [data, chartType]);

  if (!data || data.length === 0 || !xAxis || !yAxis) {
    return <p className="text-gray-400 text-center">No data to visualize</p>;
  }

  const colors = [
    "#4f46e5",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  const renderChart =
    chartType === "bar" ? (
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xAxis}
          label={{ value: xAxis, position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: yAxis, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Bar dataKey={yAxis} fill={colors[0]} isAnimationActive={false} />
      </BarChart>
    ) : chartType === "line" ? (
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xAxis}
          label={{ value: xAxis, position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: yAxis, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke={colors[1]}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    ) : (
      <PieChart>
        <Pie
          data={data}
          dataKey={yAxis}
          nameKey={xAxis}
          outerRadius={130}
          label
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" />
      </PieChart>
    );

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="95%" height="100%">
        {renderChart}
      </ResponsiveContainer>
    </div>
  );
}
