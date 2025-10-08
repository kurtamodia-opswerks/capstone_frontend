// app/charts/page.tsx
import ChartsPageClient from "./ChartsPageClient";
import {
  fetchAllData,
  fetchAllColumns,
  fetchDatasetContents,
  fetchDatasetColumns,
} from "@/lib/api/dataset";

interface ChartsPageProps {
  searchParams?: { mode?: string; uploadId?: string };
}

export default async function ChartsPage({ searchParams }: ChartsPageProps) {
  const mode = searchParams?.mode === "dataset" ? "dataset" : "aggregated"; // default = aggregated
  const uploadId = searchParams?.uploadId || null;

  let fetchedData = [];
  let fetchedHeaders = [];

  try {
    if (mode === "aggregated") {
      fetchedData = await fetchAllData();
      const res = await fetchAllColumns();
      fetchedHeaders = res.valid_headers;
    } else if (mode === "dataset" && uploadId) {
      fetchedData = await fetchDatasetContents(uploadId);
      const res = await fetchDatasetColumns(uploadId);
      fetchedHeaders = res.valid_headers;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  // Pass pre-fetched data to client
  return (
    <ChartsPageClient
      mode={mode}
      uploadId={uploadId}
      fetchedData={fetchedData}
      fetchedHeaders={fetchedHeaders}
    />
  );
}
