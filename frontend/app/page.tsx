"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadDataset } from "@/lib/api/dataset";

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [data, setData] = useState<{ name: string; headers: string[] } | null>(
    null
  );

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
      const data = await uploadDataset(file, name);
      console.log("Headers:", data.headers);
      setData(data);
      setStatus(`✅ Upload successful: ${data.name}`);
      setFile(null);
      setName("");
    } catch (error: any) {
      setStatus(`❌ ${error.message}`);
    }
  };

  return (
    <>
      <form onSubmit={handleUpload} className="space-y-4 max-w-md mx-auto p-4">
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

      <h4>{data?.headers}</h4>
    </>
  );
}
