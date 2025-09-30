"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const response = await fetch("http://localhost:8000/api/datasets/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatus(`Upload failed: ${errorText}`);
        return;
      }

      const data = await response.json();
      setStatus(`✅ Upload successful: ${data.name}`);
      setFile(null);
      setName("");
    } catch (error) {
      setStatus("❌ Network error while uploading");
    }
  };

  return (
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
  );
}
