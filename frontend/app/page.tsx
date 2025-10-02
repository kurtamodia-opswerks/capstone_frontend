"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { uploadDataset, fetchDatasetContents } from "@/lib/api/dataset";

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [dataset, setDataset] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }
    try {
      const uploaded = await uploadDataset(file); // returns { message, upload_id, rows_inserted }
      setUploadId(uploaded.upload_id);
      setStatus(`Upload successful: ${uploaded.rows_inserted} rows inserted`);
      setFile(null);
    } catch (error: any) {
      setStatus(`${error.message}`);
    }
  };

  const handleFetchContents = async () => {
    if (!uploadId) return;
    try {
      const contents = await fetchDatasetContents(uploadId);
      console.log("Fetched contents:", contents);
      setDataset(contents);
      setStatus(`Fetched ${contents.length} rows for ${uploadId}`);
    } catch (error: any) {
      setStatus(`${error.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Upload Form */}
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

      {/* Dataset Fetch & Display */}
      {uploadId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload ID: {uploadId}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetchContents} className="mb-4">
              Fetch Dataset Contents
            </Button>

            {dataset.length > 0 && (
              <div className="space-y-2">
                {dataset.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap gap-2 border rounded p-2"
                  >
                    {Object.entries(row).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="px-2 py-1">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
