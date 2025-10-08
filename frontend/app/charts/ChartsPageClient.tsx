"use client";

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
  fetchedHeaders: string[];
}

export default function ChartsPageClient({
  mode,
  uploadId,
  fetchedHeaders,
}: ChartsPageClientProps) {
  const router = useRouter();

  const handleCreateChart = () => {
    if (mode === "dataset" && uploadId) {
      router.push(`/build?mode=${mode}&uploadId=${uploadId}`);
      return;
    } else if (mode === "aggregated") {
      router.push(`/build?mode=${mode}`);
      return;
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
      </Card>
    </div>
  );
}
