"use client";

import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useDatasetStore } from "@/store/datasetStore";
import ChartControls from "../../components/charts/ChartControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Analysis() {
  const { headers, fetchHeaders, uploadId } = useDatasetStore();

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  return (
    <div className="mt-20 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Dataset Analysis
          </h3>
          <p className="text-sm text-muted-foreground">Upload ID: {uploadId}</p>
        </div>
      </div>

      {headers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dataset Structure</CardTitle>
            <CardDescription>
              {headers.length} valid columns detected in your dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {headers.map((header, index) => (
                <Badge
                  key={header}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  {header}
                </Badge>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Ready to Visualize!
                </h4>
                <p className="text-sm text-blue-700">
                  Your dataset has been processed successfully. Use the controls
                  below to create your first visualization.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {headers.length > 0 && <ChartControls />}
    </div>
  );
}
