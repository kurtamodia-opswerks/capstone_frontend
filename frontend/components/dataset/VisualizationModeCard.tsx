import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BanknoteX, Database, Layers3, Upload } from "lucide-react";
import DatasetUploadForm from "@/components/dataset/DatasetUploadForm";

export default function VisualizationModeCard() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Database className="h-6 w-6 text-green-600" />
          Data Visualization Modes
        </CardTitle>
        <CardDescription>
          Choose between aggregated data for standard reports or individual
          datasets for exploratory analysis.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="aggregated" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aggregated">
              <Layers3 className="h-4 w-4 mr-1" /> Aggregated Data
            </TabsTrigger>
            <TabsTrigger value="dataset">
              <Upload className="h-4 w-4 mr-1" /> Per Dataset
            </TabsTrigger>
            <TabsTrigger value="schemaless">
              <BanknoteX className="h-4 w-4 mr-1" /> Schema-less
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aggregated" className="mt-6">
            <AggregatedDataView />
          </TabsContent>

          <TabsContent value="dataset" className="mt-6">
            <DatasetView />
          </TabsContent>

          <TabsContent value="schemaless" className="mt-6">
            <SchemalessView />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function AggregatedDataView() {
  return (
    <div className="space-y-4 text-center">
      <h3 className="text-xl font-semibold">Aggregated Data Visualization</h3>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        This mode combines all uploaded datasets into one historical dataset
        with automatic deduplication. Upload new CSV files to continuously
        expand your aggregated data source.
      </p>
      <DatasetUploadForm mode="aggregated" />
    </div>
  );
}

function DatasetView() {
  return (
    <div className="space-y-4 text-center">
      <h3 className="text-xl font-semibold">
        Upload New Dataset for Exploration
      </h3>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        This mode is ideal for quick, on-demand analysis using a specific
        dataset upload.
      </p>
      <DatasetUploadForm mode="dataset" />
    </div>
  );
}

function SchemalessView() {
  return (
    <div className="space-y-4 text-center">
      <h3 className="text-xl font-semibold">
        Upload New Dataset for Exploration
      </h3>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        This mode is ideal for quick, on-demand analysis using a schemaless
        dataset.
      </p>
      <DatasetUploadForm mode="schemaless" />
    </div>
  );
}
