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
import { BarChart3, LineChart, PieChart, Settings2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5 text-blue-600" />
            Chart Configuration
          </CardTitle>
          <CardDescription>
            Customize your visualization by selecting data columns and chart
            type
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chart Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Chart Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ChartIcon className="h-4 w-4" />
                Chart Type
              </Label>
              <Select
                value={chartType}
                onValueChange={(val: any) => setChartType(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <BarChart3 className="h-4 w-4 inline-block mr-2" /> Bar
                    Chart
                  </SelectItem>
                  <SelectItem value="line">
                    <LineChart className="h-4 w-4 inline-block mr-2" /> Line
                    Chart
                  </SelectItem>
                  <SelectItem value="pie">
                    <PieChart className="h-4 w-4 inline-block mr-2" /> Pie Chart
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* X Axis */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">X Axis</Label>
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

            {/* Y Axis */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Y Axis</Label>
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

            {/* Aggregation */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Aggregation</Label>
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
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <Label className="text-sm font-medium">Year Range</Label>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{yearFrom ?? "—"}</span>
              <span>{yearTo ?? "—"}</span>
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
              Select a range of years for data filtering.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      {xAxis && yAxis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Real-time visualization of your aggregated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500">Loading chart...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : data.length === 0 ? (
              <p className="text-center text-gray-400">No data available</p>
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
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
