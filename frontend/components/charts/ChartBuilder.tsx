"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
import { Chart as ChartJS, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Bar as ChartJSBar, Line as ChartJSLine, Pie as ChartJSPie } from "react-chartjs-2";

ChartJS.register(Title, ChartTooltip, ChartLegend, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

interface ChartBuilderProps {
  headers: string[];
  data: any[];
}

export default function ChartBuilder({ headers, data }: ChartBuilderProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [xAxis, setXAxis] = useState<string | null>(headers[0] ?? null);
  const [yAxis, setYAxis] = useState<string | null>(headers[1] ?? null);

  if (!xAxis || !yAxis) return null;

  // Convert data for Chart.js
  const chartJsData = {
    labels: data.map((d) => d[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map((d) => d[yAxis]),
        backgroundColor: ["#8884d8", "#82ca9d", "#ffc658"],
      },
    ],
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Chart Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Chart Type Selector */}
          <div>
            <label className="block text-sm font-medium">Chart Type</label>
            <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* X Axis */}
          <div>
            <label className="block text-sm font-medium">X Axis</label>
            <Select value={xAxis} onValueChange={(v) => setXAxis(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select X field" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Y Axis */}
          <div>
            <label className="block text-sm font-medium">Y Axis</label>
            <Select value={yAxis} onValueChange={(v) => setYAxis(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y field" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Render Charts Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          {/* ✅ Recharts */}
          {/* <ResponsiveContainer width="100%" height={400}>
            {chartType === "bar" && (
              <BarChart data={data}>
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxis} fill="#8884d8" />
              </BarChart>
            )}
            {chartType === "line" && (
              <LineChart data={data}>
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey={yAxis} stroke="#82ca9d" />
              </LineChart>
            )}
            {chartType === "pie" && (
              <PieChart>
                <Pie data={data} dataKey={yAxis} nameKey={xAxis} outerRadius={150} fill="#8884d8">
                  {data.map((_, i) => (
                    <Cell key={i} fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer> */}

          {/* ✅ Chart.js */}
          <div className="w-full h-[400px]">
            {chartType === "bar" && <ChartJSBar data={chartJsData} />}
            {chartType === "line" && <ChartJSLine data={chartJsData} />}
            {chartType === "pie" && <ChartJSPie data={chartJsData} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
