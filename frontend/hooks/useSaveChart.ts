// hooks/useSaveChart.ts
import { useState } from "react";
import { postSaveChart } from "@/lib/api/chart";
import { toast } from "sonner";

export function useSaveChart() {
  const [saving, setSaving] = useState(false);

  const saveChart = async (payload: {
    mode: "aggregated" | "dataset" | "schemaless";
    uploadId?: string | null;
    chartType: "bar" | "line" | "pie";
    xAxis: string;
    yAxis: string;
    aggFunc?: string;
    yearFrom?: string | null;
    yearTo?: string | null;
    chartName: string;
    chartingLibrary: "recharts" | "chartjs" | "plotly";
    shareable?: boolean;
  }) => {
    setSaving(true);
    try {
      const res = await postSaveChart(
        payload.mode,
        payload.uploadId || null,
        payload.chartType,
        payload.xAxis,
        payload.yAxis,
        payload.aggFunc || "sum",
        payload.yearFrom || null,
        payload.yearTo || null,
        payload.chartName,
        payload.chartingLibrary,
        payload.shareable
      );
      toast.success(`Chart "${res.name}" saved successfully!`);
      console.log(payload);
      return res;
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save chart configuration");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saveChart, saving };
}
