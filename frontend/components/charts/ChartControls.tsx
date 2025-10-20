"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartPreview from "./ChartPreview";
import { BarChart3, LineChart, PieChart, Sliders } from "lucide-react";
import { fetchAggregatedData } from "@/lib/api/chart";
import { Slider } from "../ui/slider";
import { useDataStore } from "@/store/dataStore";
import { fetchAggregateSchemalessData } from "@/lib/api/schema_less";

interface ChartControlsProps {
  headers: string[];
  uploadId?: string | null;
  mode: "aggregated" | "dataset" | "schemaless";
  initialConfig?: {
    chartType?: string;
    xAxis?: string;
    yAxis?: string;
    aggFunc?: string;
    yearFrom?: string;
    yearTo?: string;
  };
}

export default function ChartControls({
  headers,
  uploadId = null,
  mode = "aggregated",
  initialConfig = {},
}: ChartControlsProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">(
    (initialConfig?.chartType as any) || "bar"
  );
  const [xAxis, setXAxis] = useState<string | null>(
    initialConfig?.xAxis || null
  );
  const [yAxis, setYAxis] = useState<string | null>(
    initialConfig?.yAxis || null
  );
  const [aggFunc, setAggFunc] = useState<string>(
    initialConfig?.aggFunc || "sum"
  );
  const [yearFrom, setYearFrom] = useState<string | null>(
    initialConfig?.yearFrom || null
  );
  const [yearTo, setYearTo] = useState<string | null>(
    initialConfig?.yearTo || null
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { minYear, maxYear, getYearRange } = useDataStore();

  const chartIcons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
  };

  const ChartIcon = chartIcons[chartType];

  useEffect(() => {
    if (mode === "schemaless") {
      return;
    }
    const loadYearRange = async () => {
      await getYearRange(uploadId);
    };
    loadYearRange();
  }, [uploadId]);

  // Fetch aggregated data when config changes
  useEffect(() => {
    if (!xAxis || !yAxis) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let res = [];
        if (mode === "schemaless" && uploadId) {
          res = await fetchAggregateSchemalessData({
            upload_id: uploadId,
            x_axis: xAxis,
            y_axis: yAxis,
            agg_func: aggFunc,
          });
        } else {
          res = await fetchAggregatedData(
            uploadId,
            xAxis,
            yAxis,
            aggFunc,
            yearFrom,
            yearTo
          );
        }

        setData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uploadId, xAxis, yAxis, aggFunc, yearFrom, yearTo, mode]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Configuration Panel - Left Sidebar */}
      <div className="xl:col-span-1 space-y-6">
        <Card className="sticky top-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders className="h-5 w-5 text-blue-600" />
              Chart Configuration
            </CardTitle>
            <CardDescription>
              Customize your visualization settings
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Chart Type Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ChartIcon className="h-4 w-4" />
                Chart Type
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setChartType("bar")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    chartType === "bar"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-medium">Bar</span>
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    chartType === "line"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <LineChart className="h-5 w-5" />
                  <span className="text-xs font-medium">Line</span>
                </button>
                <button
                  onClick={() => setChartType("pie")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    chartType === "pie"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs font-medium">Pie</span>
                </button>
              </div>
            </div>

            {/* Data Configuration */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">X Axis Column</Label>
                <Select value={xAxis ?? ""} onValueChange={setXAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X axis" />
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Y Axis Column</Label>
                <Select value={yAxis ?? ""} onValueChange={setYAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y axis" />
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Aggregation Function
                </Label>
                <Select value={aggFunc} onValueChange={setAggFunc}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="avg">Average</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="min">Minimum</SelectItem>
                    <SelectItem value="max">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year Range Slider */}
            {mode !== "schemaless" && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <Label className="text-sm font-medium">Year Range</Label>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{yearFrom ?? minYear}</span>
                  <span>{yearTo ?? maxYear}</span>
                </div>

                <Slider
                  defaultValue={[
                    Number(yearFrom) || minYear,
                    Number(yearTo) || maxYear,
                  ]}
                  min={minYear}
                  max={maxYear}
                  step={1}
                  onValueChange={(value) => {
                    setYearFrom(String(value[0]));
                    setYearTo(String(value[1]));
                  }}
                />

                <p className="text-xs text-gray-500">
                  Select a range of years for data filtering
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Preview Area - Main Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Status Card */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Chart Preview */}
        <Card className="h-full min-h-[600px]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Real-time visualization of your aggregated data
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full">
            {!xAxis || !yAxis ? (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select X and Y axis columns to generate chart
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No data available for the selected configuration
                  </p>
                </div>
              </div>
            ) : (
              <ChartPreview
                mode={mode}
                chartType={chartType}
                data={data}
                xAxis={xAxis}
                yAxis={yAxis}
                uploadId={uploadId}
                aggFunc={aggFunc}
                yearFrom={yearFrom}
                yearTo={yearTo}
                showPerformancePanel={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
