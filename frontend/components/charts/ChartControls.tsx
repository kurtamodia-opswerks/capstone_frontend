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
import { useDatasetStore } from "@/store/datasetStore";
import ChartPreview from "./ChartPreview";

export default function ChartControls() {
  const {
    headers,
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
  } = useDatasetStore();

  useEffect(() => {
    fetchData();
  }, [xAxis, yAxis, aggFunc, yearFrom, yearTo]);

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Chart Type */}
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

        {/* X Axis */}
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

        {/* Y Axis */}
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

        {/* Aggregation */}
        <div>
          <label className="block text-sm font-medium">Aggregation</label>
          <Select value={aggFunc} onValueChange={setAggFunc}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="avg">Average</SelectItem>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="min">Min</SelectItem>
              <SelectItem value="max">Max</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Year Filter */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">From Year</label>
          <Input
            type="number"
            placeholder="e.g. 2013"
            value={yearFrom ?? ""}
            onChange={(e) => setYearFrom(e.target.value || null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            To Year (optional)
          </label>
          <Input
            type="number"
            placeholder="e.g. 2023"
            value={yearTo ?? ""}
            onChange={(e) => setYearTo(e.target.value || null)}
          />
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
