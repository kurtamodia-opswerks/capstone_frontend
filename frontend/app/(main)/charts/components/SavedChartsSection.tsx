"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import ChartCard from "./ChartCard";

interface SavedChartsSectionProps {
  mode: "dataset" | "aggregated" | "schemaless";
  savedCharts: any[];
  shareableCharts: any[];
  dashboardCharts: string[];
  onLoadChart: (chart: any) => void;
  onAddToDashboard: (chartId: string) => void;
  onDeleteChart: (chartId: string) => void;
}

export default function SavedChartsSection({
  mode,
  savedCharts,
  shareableCharts,
  dashboardCharts,
  onLoadChart,
  onAddToDashboard,
  onDeleteChart,
}: SavedChartsSectionProps) {
  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Saved Charts
          </CardTitle>
          <CardDescription>
            View, load, or add your saved charts to a dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedCharts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCharts.map((chart) => (
                <ChartCard
                  key={chart._id}
                  chart={chart}
                  inDashboard={dashboardCharts.includes(chart._id)}
                  onLoadChart={onLoadChart}
                  onAddToDashboard={onAddToDashboard}
                  onDeleteChart={onDeleteChart}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No saved charts found.
            </p>
          )}
        </CardContent>
      </Card>
      {mode !== "schemaless" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Shared Chart Configurations
            </CardTitle>
            <CardDescription>
              View, load, or add charts configs shared by others
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shareableCharts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shareableCharts.map((chart) => (
                  <ChartCard
                    key={chart._id}
                    chart={chart}
                    inDashboard={dashboardCharts.includes(chart._id)}
                    onLoadChart={onLoadChart}
                    onAddToDashboard={onAddToDashboard}
                    onDeleteChart={onDeleteChart}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No shared chart configurations found.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
