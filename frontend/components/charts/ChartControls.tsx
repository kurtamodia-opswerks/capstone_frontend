"use client";

import React, { useEffect } from "react";
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
import { useDatasetStore } from "@/store/datasetStore";
import { useChartStore } from "@/store/chartStore";
import ChartPreview from "./ChartPreview";
import { BarChart3, LineChart, PieChart, Settings2 } from "lucide-react";

export default function ChartControls() {
  const { headers } = useDatasetStore();

  const {
    chartType,
    xAxis,
    yAxis,
    aggFunc,
    yearFrom,
    yearTo,
    setChartType,
    setXAxis,
    setYAxis,
    setAggFunc,
    setYearFrom,
    setYearTo,
    fetchData,
    data,
  } = useChartStore();

  useEffect(() => {
    if (xAxis && yAxis) {
      fetchData();
    }
  }, [xAxis, yAxis, aggFunc, yearFrom, yearTo]);

  const chartIcons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
  };

  const ChartIcon = chartIcons[chartType];

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
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ChartIcon className="h-4 w-4" />
                Chart Type
              </Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar Chart
                  </SelectItem>
                  <SelectItem value="line" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    Line Chart
                  </SelectItem>
                  <SelectItem value="pie" className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Pie Chart
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

          {/* Year Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm font-medium">From Year</Label>
              <Input
                type="number"
                placeholder="e.g. 2013"
                value={yearFrom ?? ""}
                onChange={(e) => setYearFrom(e.target.value || null)}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">To Year (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 2023"
                value={yearTo ?? ""}
                onChange={(e) => setYearTo(e.target.value || null)}
                className="bg-white"
              />
            </div>
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
              Real-time visualization of your data with performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPreview
              chartType={chartType}
              data={data}
              xAxis={xAxis}
              yAxis={yAxis}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
