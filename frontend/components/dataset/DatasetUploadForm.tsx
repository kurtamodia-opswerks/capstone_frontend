"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadDataset } from "@/lib/api/dataset";
import DatasetHeaders from "./DatasetHeaders";
import { useDatasetStore } from "@/store/datasetStore";

interface UploadResponse {
  message: string;
  upload_id: string;
  rows_inserted: number;
}

export default function DatasetUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const { uploadId, status, setUploadId, setStatus } = useDatasetStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }
    try {
      const uploaded: UploadResponse = await uploadDataset(file);
      setUploadId(uploaded.upload_id);
      setStatus(`Upload successful: ${uploaded.rows_inserted} rows inserted`);
      setFile(null);
    } catch (error: any) {
      setStatus(error.message ?? "An unknown error occurred");
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <Label htmlFor="file">CSV File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit">Upload</Button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>

      {uploadId && <DatasetHeaders />}
    </div>
  );
}
