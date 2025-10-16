import { BarChart3 } from "lucide-react";

export default function HeaderSection() {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vizly
        </h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Transform your CSV data into beautiful, interactive visualizations in
        seconds
      </p>
    </div>
  );
}
