"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDatasetStore } from "@/store/datasetStore";
import ChartControls from "../charts/ChartControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, BarChart3 } from "lucide-react";

export default function DatasetHeaders() {
  const { headers, fetchHeaders, uploadId } = useDatasetStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Dataset Analysis
          </h3>
          <p className="text-sm text-muted-foreground">Upload ID: {uploadId}</p>
        </div>
        <Button onClick={fetchHeaders} className="gap-2">
          <Download className="h-4 w-4" />
          Fetch Headers
        </Button>
      </div>

      {headers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dataset Structure</CardTitle>
            <CardDescription>
              {headers.length} columns detected in your dataset
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
