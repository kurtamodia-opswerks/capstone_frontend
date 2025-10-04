// app/page.tsx
import DatasetUploadForm from "@/components/dataset/DatasetUploadForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Upload, Zap } from "lucide-react";

export default function DatasetUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Optics chart Benchmarking
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your CSV data into beautiful, interactive visualizations
            in seconds
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Upload className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-sm font-medium ml-2">
                Simple Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Drag & Drop</div>
              <p className="text-xs text-muted-foreground">
                CSV files supported
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-sm font-medium ml-2">
                Multiple Charts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3+ Types</div>
              <p className="text-xs text-muted-foreground">
                Bar, Line, Pie & more
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Zap className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-sm font-medium ml-2">
                Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Instant</div>
              <p className="text-xs text-muted-foreground">
                Live preview & updates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Upload Card */}
        <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Upload className="h-6 w-6 text-blue-600" />
              Dataset Upload & Visualization
            </CardTitle>
            <CardDescription>
              Upload your CSV file and create stunning visualizations with our
              intuitive tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatasetUploadForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
