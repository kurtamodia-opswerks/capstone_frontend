// /app/charts/hooks/useCharts.ts
import { useEffect, useState } from "react";
import { useDataStore } from "@/store/dataStore";
import { fetchDashboard, addToDashboard } from "@/lib/api/dashboard";
import { deleteChart } from "@/lib/api/chart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCharts(
  mode: "dataset" | "aggregated" | "schemaless",
  uploadId: string | null
) {
  const router = useRouter();

  const { headers, columnTypes, savedCharts, shareableCharts, refreshCharts } =
    useDataStore();
  const [dashboardCharts, setDashboardCharts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch charts
  useEffect(() => {
    setLoading(true);
    refreshCharts(mode, uploadId ?? null);
    setLoading(false);
  }, [mode, uploadId]);

  // Fetch dashboard
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetchDashboard(mode, uploadId);
        if (res?.charts?.length) {
          setDashboardCharts(res.charts.map((c: any) => c._id));
        } else {
          setDashboardCharts([]);
        }
      } catch (err) {
        console.warn("No dashboard found or failed to fetch:", err);
        setDashboardCharts([]);
      }
      setLoading(false);
    };
    loadDashboard();
  }, [mode, uploadId]);

  // Navigation handlers and chart actions
  const handleCreateChart = () => {
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleLoadChart = (chart: any) => {
    const params = new URLSearchParams({
      mode,
      chartId: chart._id,
    });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleViewDashboard = () => {
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleDeleteChart = async (chart_id: string) => {
    try {
      await deleteChart(chart_id);
      await refreshCharts(mode, uploadId ?? null);
      toast.success("Chart deleted successfully");
    } catch (err) {
      console.error("Failed to delete chart:", err);
      toast.error("Failed to delete chart");
    }
  };

  // Dashboard handlers
  const handleAddToDashboard = async (chart_id: string) => {
    try {
      await addToDashboard({ mode, upload_id: uploadId, chart_id });
      setDashboardCharts((prev) => [...prev, chart_id]);
    } catch (err) {
      console.error("Failed to update dashboard:", err);
    }
  };

  return {
    loading,
    headers,
    columnTypes,
    savedCharts,
    shareableCharts,
    dashboardCharts,
    handleCreateChart,
    handleLoadChart,
    handleViewDashboard,
    handleAddToDashboard,
    handleDeleteChart,
  };
}
