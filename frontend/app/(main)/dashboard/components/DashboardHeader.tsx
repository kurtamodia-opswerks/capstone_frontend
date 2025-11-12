"use client";

interface DashboardHeaderProps {
  mode: string;
  uploadId: string | null;
}

export default function DashboardHeader({
  mode,
  uploadId,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === "dataset" ? "Dataset Analysis" : "Aggregated Insights"}
            {uploadId && ` • Upload ID: ${uploadId}`}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              mode === "dataset" ? "bg-blue-500" : "bg-green-500"
            }`}
          />
          <span className="text-sm font-medium capitalize">{mode} Mode</span>
        </div>
      </div>
    </div>
  );
}
