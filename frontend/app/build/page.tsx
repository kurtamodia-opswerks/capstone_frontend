import { fetchChartById } from "@/lib/api/chart";
import ChartControls from "../../components/charts/ChartControls";
import { getFetchedHeaders } from "@/lib/utils";

interface BuildPageProps {
  searchParams?: {
    mode?: string;
    uploadId?: string;
    chartId?: string;
  };
}

export default async function Build({ searchParams }: BuildPageProps) {
  const mode = searchParams?.mode === "dataset" ? "dataset" : "aggregated";
  const uploadId = searchParams?.uploadId || null;
  const chartId = searchParams?.chartId || null;

  let chartData: any = null;

  // Fetch saved chart if chartId is provided
  if (chartId) {
    chartData = await fetchChartById(chartId);
  }

  // Fetch dataset headers
  const headers = await getFetchedHeaders(mode, uploadId);

  // Prepare initial chart configuration
  const initialConfig = chartData
    ? {
        chartType: chartData.chart_type,
        xAxis: chartData.x_axis,
        yAxis: chartData.y_axis,
        aggFunc: chartData.agg_func,
        yearFrom: chartData.year_from,
        yearTo: chartData.year_to,
      }
    : undefined;

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
        <ChartControls
          headers={headers}
          uploadId={uploadId}
          mode={mode}
          initialConfig={initialConfig}
        />
      )}
    </div>
  );
}
