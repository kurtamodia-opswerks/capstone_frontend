"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DatasetInfoCardProps {
  headers: string[];
  columnTypes: Record<
    string,
    "boolean" | "numeric" | "categorical" | "date" | "unknown"
  >;
  uploadId: string | null;
  onViewDashboard: () => void;
  onCreateChart: () => void;
}

export default function DatasetInfoCard({
  headers,
  columnTypes,
  uploadId,
  onViewDashboard,
  onCreateChart,
}: DatasetInfoCardProps) {
  return (
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

        <Button variant="outline" className="text-sm" onClick={onViewDashboard}>
          Go to Dashboard
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {headers.map((header) => {
            const type = columnTypes[header] ?? "unknown";
            return (
              <Badge
                key={header}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-medium flex items-center gap-1"
              >
                <span>{header}</span>
                <span className="text-xs text-muted-foreground">({type})</span>
              </Badge>
            );
          })}
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
              onClick={onCreateChart}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create New Chart
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
