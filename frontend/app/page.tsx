"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  uploadDataset,
  fetchDatasetColumns,
  fetchAggregatedData,
} from "@/lib/api/dataset";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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

interface UploadResponse {
  message: string;
  upload_id: string;
  rows_inserted: number;
}

interface HeadersResponse {
  valid_headers: string[];
}

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);

  // Chart state
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [xAxis, setXAxis] = useState<string | null>(null);
  const [yAxis, setYAxis] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    try {
      const uploaded: UploadResponse = await uploadDataset(file);
      setUploadId(uploaded.upload_id);
      setStatus(`Upload successful: ${uploaded.rows_inserted} rows inserted`);
      setFile(null);
    } catch (error: any) {
      setStatus(error.message ?? "An unknown error occurred");
    }
  };

  const handleFetchHeaders = async () => {
    if (!uploadId) return;
    try {
      const result: HeadersResponse = await fetchDatasetColumns(uploadId);
      setHeaders(result.valid_headers);
      setXAxis(result.valid_headers[0] ?? null);
      setYAxis(result.valid_headers[1] ?? null);
      setStatus(
        `Fetched ${result.valid_headers.length} valid headers for ${uploadId}`
      );
    } catch (error: any) {
      setStatus(error.message ?? "An unknown error occurred");
    }
  };

  // Fetch aggregated data whenever x/y change
  useEffect(() => {
    if (uploadId && xAxis && yAxis) {
      fetchAggregatedData(uploadId, xAxis, yAxis, "sum")
        .then((rows) => {
          setData(rows);
        })
        .catch((err) => setStatus(err.message));
    }
  }, [uploadId, xAxis, yAxis]);

  // Chart.js Data
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
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <Label htmlFor="file">CSV File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit">Upload</Button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>

      {/* Dataset Headers & Chart Builder */}
      {uploadId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload ID: {uploadId}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetchHeaders} className="mb-4">
              Fetch Dataset Headers
            </Button>

            {headers.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {headers.map((header) => (
                    <Badge key={header} variant="outline" className="px-3 py-1">
                      {header}
                    </Badge>
                  ))}
                </div>

                {/* Chart Controls */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium">
                      Chart Type
                    </label>
                    <Select
                      value={chartType}
                      onValueChange={(v: any) => setChartType(v)}
                    >
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

                  <div>
                    <label className="block text-sm font-medium">X Axis</label>
                    <Select
                      value={xAxis ?? ""}
                      onValueChange={(v) => setXAxis(v)}
                    >
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

                  <div>
                    <label className="block text-sm font-medium">Y Axis</label>
                    <Select
                      value={yAxis ?? ""}
                      onValueChange={(v) => setYAxis(v)}
                    >
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

                {/* Charts Side by Side */}
                <div className="grid grid-cols-2 gap-6">
                  {/* ✅ Recharts */}
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
                          fill="#8884d8"
                        >
                          {data.map((_, i) => (
                            <Cell
                              key={i}
                              fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>

                  {/* ✅ Chart.js */}
                  <div className="w-full h-[400px]">
                    {chartType === "bar" && <ChartJSBar data={chartJsData} />}
                    {chartType === "line" && <ChartJSLine data={chartJsData} />}
                    {chartType === "pie" && <ChartJSPie data={chartJsData} />}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
