"use client";

import { useDataStore } from "@/store/dataStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
