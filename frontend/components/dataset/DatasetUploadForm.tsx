"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadDataset } from "@/lib/api/dataset";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Layers3,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DatasetSelector from "./DatasetSelector";
import { useRouter } from "next/navigation";

interface UploadResponse {
  message: string;
  upload_id: string;
  rows_inserted: number;
  rows_skipped: number;
}

interface DatasetUploadFormProps {
  mode: "aggregated" | "dataset";
}

export default function DatasetUploadForm({ mode }: DatasetUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      setStatus("error: Please drop a valid CSV file");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setStatus("error: Please select a CSV file first.");
      return;
    }

    setStatus("uploading");
    try {
      const uploaded: UploadResponse = await uploadDataset(file);
      setStatus(
        `success: ${uploaded.rows_inserted} rows processed successfully, ${uploaded.rows_skipped} rows skipped as duplicates.`
      );
      setFile(null);

      if (mode === "dataset") {
        router.push(`/charts?mode=dataset&uploadId=${uploaded.upload_id}`);
      } else {
        setStatus(
          `success: Aggregated dataset updated! ${uploaded.rows_inserted} rows processed successfully, ${uploaded.rows_skipped} rows skipped as duplicates.`
        );
      }
    } catch (error: any) {
      setStatus(`error: ${error.message ?? "An unknown error occurred"}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {file
                ? "File Selected"
                : mode === "aggregated"
                ? "Upload New Data for Aggregated Dataset"
                : "Upload Your Dataset"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === "aggregated"
                ? "Upload a new CSV file to add its records to your historical dataset."
                : "Drag and drop your CSV file here, or click to browse"}
            </p>
          </div>

          {file && (
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex gap-3">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!file || status === "uploading"}
                className="min-w-[120px]"
              >
                {status === "uploading" ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Conditional Section */}
        {mode === "dataset" ? (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2 text-center text-muted-foreground">
              or choose from previous uploads
            </h3>
            <DatasetSelector />
          </div>
        ) : (
          <div className="mt-6 border-t pt-4 text-center">
            <h3 className="text-lg font-medium mb-6 text-center text-muted-foreground">
              or use the latest aggregated dataset
            </h3>
            <Button
              variant="default"
              onClick={() => router.push("/charts?mode=aggregated")}
              className="flex items-center mx-auto gap-2"
            >
              <Layers3 className="h-4 w-4" />
              Use Aggregated Dataset
            </Button>
          </div>
        )}
      </div>

      {/* Status Alert */}
      {status && status !== "uploading" && (
        <Alert
          variant={status.startsWith("success") ? "default" : "destructive"}
          className="bg-white"
        >
          {status.startsWith("success") ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="ml-2">
            {status.split(": ")[1] || status}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
