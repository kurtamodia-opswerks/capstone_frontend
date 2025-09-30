"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { uploadDataset, fetchHeaders } from "@/lib/api/dataset";

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [data, setData] = useState<{
    id: number;
    name: string;
    headers: string[];
  } | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !name) {
      setName(f.name.replace(/\.csv$/i, ""));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }
    try {
      const uploaded = await uploadDataset(file, name);
      setData(uploaded);
      setStatus(`✅ Upload successful: ${uploaded.name}`);
      setFile(null);
      setName("");
      setShowHeaders(false); // reset headers view after new upload
    } catch (error: any) {
      setStatus(`❌ ${error.message}`);
    }
  };

  const handleFetchHeaders = async () => {
    if (!data?.id) return;
    try {
      const res = await fetchHeaders(data.id);
      setData({ ...data, headers: res.headers });
      setShowHeaders(true);
    } catch (error: any) {
      setStatus(`❌ ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <Label htmlFor="name">Dataset Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter dataset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {!showHeaders ? (
              <Button onClick={handleFetchHeaders}>Fetch Headers</Button>
            ) : (
              <ul className="space-y-2">
                {data.headers.map((header, idx) => (
                  <li key={idx}>
                    <Badge
                      variant="outline"
                      className="px-3 py-1 w-full justify-start"
                    >
                      {header}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
