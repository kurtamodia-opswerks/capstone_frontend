"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { addToDashboard, fetchDashboard } from "@/lib/api/dashboard";
import { useDataStore } from "@/store/dataStore";
import { deleteChart } from "@/lib/api/chart";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChartsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // derive params from URL
  const mode =
    searchParams.get("mode") === "dataset"
      ? "dataset"
      : searchParams.get("mode") === "aggregated"
      ? "aggregated"
      : "schemaless";
  const uploadId = searchParams.get("uploadId");

  const { headers, savedCharts, refreshCharts } = useDataStore();
  const [dashboardCharts, setDashboardCharts] = useState<string[]>([]);

  // Fetch charts
  useEffect(() => {
    refreshCharts(mode, uploadId ?? null);
  }, [mode, uploadId]);

  // Fetch dashboard
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboard(mode, uploadId);
        if (res?.charts?.length) {
          setDashboardCharts(res.charts.map((c: any) => c._id));
        } else {
          setDashboardCharts([]);
        }
      } catch (err) {
        console.warn("No dashboard found or failed to fetch:", err);
        setDashboardCharts([]);
      }
    };
    loadDashboard();
  }, [mode, uploadId]);

  // Navigation handlers and chart actions
  const handleCreateChart = () => {
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleLoadChart = (chart: any) => {
    const params = new URLSearchParams({
      mode,
      chartId: chart._id,
    });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleViewDashboard = () => {
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleDeleteChart = async (chart_id: string) => {
    try {
      await deleteChart(chart_id);
      await refreshCharts(mode, uploadId ?? null);
      toast.success("Chart deleted successfully");
    } catch (err) {
      console.error("Failed to delete chart:", err);
      toast.error("Failed to delete chart");
    }
  };

  // Dashboard handlers
  const handleAddToDashboard = async (chart_id: string) => {
    try {
      await addToDashboard({ mode, upload_id: uploadId, chart_id });
      setDashboardCharts((prev) => [...prev, chart_id]);
    } catch (err) {
      console.error("Failed to update dashboard:", err);
    }
  };

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Saved Visualizations
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Browse your existing charts or create new ones
          </p>
        </div>
      </div>

      {/* Dataset Info */}
      {headers.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Dataset Structure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload ID: {uploadId ?? "Aggregated"}
                  </p>
                </div>
              </CardTitle>
              <CardDescription>
                {headers.length} valid columns detected in your dataset
              </CardDescription>
            </div>

            <Button
              variant="outline"
              className="text-sm"
              onClick={handleViewDashboard}
            >
              Go to Dashboard
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {headers.map((header) => (
                <Badge
                  key={header}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  {header}
                </Badge>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200 mb-6">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Ready to Visualize!
                </h4>
                <p className="text-sm text-blue-700">
                  Your dataset is ready. You can create a new visualization now.
                </p>
                <Button
                  onClick={handleCreateChart}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create New Chart
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Saved Charts */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            My Saved Charts
          </CardTitle>
          <CardDescription>
            View, load, or add your saved charts to a dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedCharts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCharts.map((chart) => {
                const isInDashboard = dashboardCharts.includes(chart._id);
                return (
                  <Card key={chart._id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">
                            {chart.name}
                          </h4>
                        </div>

                        <Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash />
                                </Button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove from dashboard</p>
                            </TooltipContent>
                          </Tooltip>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete chart</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this chart from
                                the database?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-end">
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    handleDeleteChart(chart._id);
                                  }}
                                >
                                  Confirm
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-blue-700">
                        {chart.chart_type}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => handleLoadChart(chart)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Load
                        </Button>

                        {isInDashboard ? (
                          <Button variant="secondary" disabled>
                            In Dashboard
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleAddToDashboard(chart._id)}
                          >
                            Add to Dashboard
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No saved charts found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
