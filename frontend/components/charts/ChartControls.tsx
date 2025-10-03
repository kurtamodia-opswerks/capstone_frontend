"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDatasetStore } from "@/store/datasetStore";
import ChartPreview from "./ChartPreview";

export default function ChartControls() {
  const {
    headers,
    chartType,
    xAxis,
    yAxis,
    setChartType,
    setXAxis,
    setYAxis,
    fetchData,
    data,
  } = useDatasetStore();

  useEffect(() => {
    fetchData();
  }, [xAxis, yAxis]);

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Chart Type</label>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger>
              <SelectValue />
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
          <Select value={xAxis ?? ""} onValueChange={setXAxis}>
            <SelectTrigger>
              <SelectValue />
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
          <Select value={yAxis ?? ""} onValueChange={setYAxis}>
            <SelectTrigger>
              <SelectValue />
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

      {/* Chart Preview */}
      <ChartPreview
        chartType={chartType}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
      />
    </div>
  );
}
