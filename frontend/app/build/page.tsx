import { fetchAllColumns, fetchDatasetColumns } from "@/lib/api/dataset";
import ChartControls from "../../components/charts/ChartControls";
import { getFetchedHeaders } from "@/lib/utils";

interface BuildPageProps {
  searchParams?: { mode?: string; uploadId?: string };
}

export default async function Build({ searchParams }: BuildPageProps) {
  const mode = searchParams?.mode === "dataset" ? "dataset" : "aggregated"; // default = aggregated
  const uploadId = searchParams?.uploadId || null;

  const headers = await getFetchedHeaders(mode, uploadId);

  return (
    <div className="mt-20 mb-20 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chart Builder
          </h1>
        </div>
      </div>

      {headers.length > 0 && (
        <ChartControls headers={headers} uploadId={uploadId} />
      )}
    </div>
  );
}
