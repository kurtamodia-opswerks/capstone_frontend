"use client";

import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Settings } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, ChartSpline } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode =
    searchParams.get("mode") === "dataset" ? "dataset" : "aggregated";
  const uploadId = searchParams.get("uploadId");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { dashboard, refreshDashboard } = useDataStore();

  // Only refresh when mode or uploadId changes
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

  const handleCreateChart = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleImportChart = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/charts?${params.toString()}`);
  };

  // Handle missing or invalid dashboard gracefully
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 grid grid-cols-7 gap-4">
      <div className="col-span-1 p-6 sticky top-0 bg-gray-100">
        <div className="flex items-center justify-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Optics Chart
          </h1>
        </div>
        <div className="flex flex-col justify-between gap-20">
          <NavigationMenu className="mt-6 ml-6">
            <NavigationMenuList className="flex flex-col space-y-2 items-start">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="flex flex-row gap-1">
                    <FileText className="mr-2 h-8 w-8" />
                    <span>Use a new dataset</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    onClick={handleImportChart}
                    className="flex flex-row gap-1"
                  >
                    <ChartSpline className="mr-2 h-4 w-4" />
                    Import a new chart
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    onClick={handleCreateChart}
                    className="flex flex-row gap-1"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create a new chart
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Popover>
            <PopoverTrigger className="text-sm flex flex-row justify-start items-center hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md ml-6 px-2 py-2">
              <Settings className="mr-2 h-4 w-4" />
              Dashboard Settings
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              Put settings here
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full mx-auto p-6 col-span-6">
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
            handleImportChart={handleImportChart}
          />
        )}
      </div>
    </div>
  );
}
