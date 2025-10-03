// app/charts/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { fetchDatasetColumns } from "@/lib/api/dataset";
import ChartBuilder from "@/components/charts/ChartBuilder";

export default async function ChartsPage() {
  const searchParams = useSearchParams();
  const uploadId = searchParams.get("upload_id");
  if (!uploadId) {
    return <p className="p-4 text-red-600">No upload_id provided</p>;
  }

  const { valid_headers } = await fetchDatasetColumns(uploadId);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Chart Builder</h1>
      <ChartBuilder uploadId={uploadId} headers={valid_headers} />
    </div>
  );
}
