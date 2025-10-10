"use client";

import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const mode =
    searchParams.get("mode") === "dataset" ? "dataset" : "aggregated";
  const uploadId = searchParams.get("uploadId");
  const [loading, setLoading] = useState(true);

  const { dashboard, refreshDashboard } = useDataStore();

  // ✅ Only refresh when mode or uploadId changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboard(mode, uploadId || null);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, uploadId, refreshDashboard]);

  // ✅ Handle missing or invalid dashboard gracefully
  if (!dashboard || !dashboard._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Dashboard Found
            </h3>
            <p className="text-gray-500 text-sm">
              Add your first chart to see it appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                {mode === "dataset"
                  ? "Dataset Analysis"
                  : "Aggregated Insights"}
                {uploadId && ` • Upload ID: ${uploadId}`}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  mode === "dataset" ? "bg-blue-500" : "bg-green-500"
                }`}
              />
              <span className="text-sm font-medium capitalize">
                {mode} Mode
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {!loading && (
          <DashboardCharts
            charts={dashboard.charts || []}
            mode={mode}
            uploadId={uploadId}
            dashboardId={dashboard._id}
            initialYearFrom={dashboard.year_from}
            initialYearTo={dashboard.year_to}
          />
        )}
      </div>
    </div>
  );
}
