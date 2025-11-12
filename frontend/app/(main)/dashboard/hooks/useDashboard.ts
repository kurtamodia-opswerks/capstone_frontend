"use client";

import { useDataStore } from "@/store/dataStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDashboard(
  mode: "dataset" | "aggregated" | "schemaless",
  uploadId: string | null
) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [choiceShowChartJs, setChoiceShowChartJs] = useState(true);
  const [choiceShowRecharts, setChoiceShowRecharts] = useState(true);
  const [choiceShowPlotly, setChoiceShowPlotly] = useState(true);
  const [showChartJs, setShowChartsJs] = useState(true);
  const [showRecharts, setShowRecharts] = useState(true);
  const [showPlotly, setShowPlotly] = useState(true);

  const { dashboard, refreshDashboard } = useDataStore();

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = async (event) => {
      console.log("Message from server:", event.data);

      // Example message: "dataset_uploaded:3679-86fc-aefa"
      if (event.data.startsWith("dataset_uploaded")) {
        const [, uploadedId] = event.data.split(":");
        console.log(`Dataset uploaded: ${uploadedId}`);

        let countdown = 5;

        // Create a persistent toast
        const toastId = toast.loading(
          `A new dataset has been uploaded. Refreshing dashboard in ${countdown}...`
        );

        // Start countdown
        const interval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            toast.loading(
              `A new dataset has been uploaded. Refreshing dashboard in ${countdown}...`,
              {
                id: toastId,
              }
            );
          } else {
            clearInterval(interval);
            toast.success(`Dashboard refreshed for dataset: ${uploadedId}`, {
              id: toastId,
            });

            // Actually refresh dashboard
            refreshDashboard(mode, uploadId || null).catch((err) => {
              console.error("Failed to refresh dashboard:", err);
              toast.error("Failed to refresh dashboard", { id: toastId });
            });
          }
        }, 1000);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.close();
  }, [mode, uploadId, refreshDashboard]);

  // Only refresh when mode or uploadId changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboard(mode, uploadId || null);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, uploadId, refreshDashboard]);

  const handleCreateChart = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/build?${params.toString()}`);
  };

  const handleImportChart = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ mode });
    if (uploadId) params.set("uploadId", uploadId);
    router.push(`/charts?${params.toString()}`);
  };

  return {
    dashboard,
    loading,
    choiceShowChartJs,
    setChoiceShowChartJs,
    choiceShowRecharts,
    setChoiceShowRecharts,
    choiceShowPlotly,
    setChoiceShowPlotly,
    showChartJs,
    setShowChartsJs,
    showRecharts,
    setShowRecharts,
    showPlotly,
    setShowPlotly,
    handleCreateChart,
    handleImportChart,
  };
}
