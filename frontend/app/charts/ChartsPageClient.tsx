"use client";

import { useEffect } from "react";
import { useChartStore } from "@/store/chartStore";
import { useDatasetStore } from "@/store/datasetStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ChartsPageClientProps {
  mode: "aggregated" | "dataset";
  uploadId: string | null;
  fetchedData: any[];
  fetchedHeaders: string[];
}

export default function ChartsPageClient({
  mode,
  uploadId,
  fetchedData,
  fetchedHeaders,
}: ChartsPageClientProps) {
  const router = useRouter();
  const { savedCharts, setPendingChartId, setData } = useChartStore();
  const { setMode, setUploadId, setHeaders } = useDatasetStore();

  // ✅ Hydrate Zustand
  useEffect(() => {
    setMode(mode);
    setUploadId(uploadId);
    setHeaders(fetchedHeaders);
    setData(fetchedData);
  }, [mode, uploadId, fetchedData, fetchedHeaders]);

  const handleLoadChart = (chartId: string) => {
    setPendingChartId(chartId);
    router.push("/analysis?mode=edit");
  };

  const handleCreateChart = () => {
    router.push("/analysis?mode=new");
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
      {fetchedHeaders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Dataset Structure
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload ID: {uploadId ?? "N/A"}
                </p>
              </div>
            </CardTitle>
            <CardDescription>
              {fetchedHeaders.length} valid columns detected in your dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {fetchedHeaders.map((header) => (
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
            View or reload your saved dataset visualizations
          </CardDescription>
        </CardHeader>

        <CardContent>
          {savedCharts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved visualizations found. Click{" "}
              <span className="font-semibold">“Create New Chart”</span> above to
              start one.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCharts.map((chart) => (
                <Card
                  key={chart._id}
                  className="border border-gray-200 hover:border-blue-400 transition-colors"
                >
                  <CardContent className="p-4">
                    <h5 className="font-medium text-gray-900 truncate mb-1">
                      {chart.name}
                    </h5>
                    <p className="text-xs text-gray-600 mb-3">
                      Type: {chart.chart_type.toUpperCase()} •{" "}
                      {chart.agg_func.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mb-3 truncate">
                      {chart.x_axis} vs {chart.y_axis}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadChart(chart._id)}
                    >
                      Load Chart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
