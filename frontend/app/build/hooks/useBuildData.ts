// /app/build/hooks/useBuildData.ts
import { useEffect, useState } from "react";
import { useDataStore } from "@/store/dataStore";
import { fetchChartById } from "@/lib/api/chart";

export function useBuildData(
  mode: string,
  uploadId?: string | null,
  chartId?: string | null
) {
  const { headers, refreshCharts } = useDataStore();
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshCharts(mode, uploadId || null);

        if (chartId) {
          const chartData = await fetchChartById(chartId);
          setInitialConfig({
            chartType: chartData.chart_type,
            xAxis: chartData.x_axis,
            yAxis: chartData.y_axis,
            aggFunc: chartData.agg_func,
            yearFrom: chartData.year_from,
            yearTo: chartData.year_to,
          });
        }
      } catch (err) {
        console.error("Error loading build data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, uploadId, chartId, refreshCharts]);

  return { headers, loading, initialConfig };
}
