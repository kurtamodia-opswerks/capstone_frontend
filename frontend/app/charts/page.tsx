// app/charts/page.tsx
import { getFetchedHeaders } from "@/lib/utils";
import ChartsPageClient from "./ChartsPageClient";

interface ChartsPageProps {
  searchParams?: { mode?: string; uploadId?: string };
}

export default async function ChartsPage({ searchParams }: ChartsPageProps) {
  const mode = searchParams?.mode === "dataset" ? "dataset" : "aggregated"; // default = aggregated
  const uploadId = searchParams?.uploadId || null;

  const fetchedHeaders = await getFetchedHeaders(mode, uploadId);

  return (
    <ChartsPageClient
      mode={mode}
      uploadId={uploadId}
      fetchedHeaders={fetchedHeaders}
    />
  );
}
