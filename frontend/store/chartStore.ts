// store/chartStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import {
  fetchAggregatedData,
  postSaveChart,
  fetchSavedCharts,
  fetchChartById,
} from "@/lib/api/chart";
import { useDatasetStore } from "./datasetStore";
import { Chathura } from "next/font/google";

interface Chart {
  _id: string;
  name: string;
  chart_type: string;
  x_axis: string;
  y_axis: string;
  agg_func: string;
  year_from?: number;
  year_to?: number;
}

interface ChartState {
  chartType: "bar" | "line" | "pie";
  xAxis: string | null;
  yAxis: string | null;
  aggFunc: string;
  yearFrom: string | null;
  yearTo: string | null;
  data: any[];
  savedCharts: Chart[];
  selectedChart: Chart | null;
  status: string | null;

  // setters
  setChartType: (c: "bar" | "line" | "pie") => void;
  setXAxis: (x: string) => void;
  setYAxis: (y: string) => void;
  setAggFunc: (f: string) => void;
  setYearFrom: (y: string | null) => void;
  setYearTo: (y: string | null) => void;

  // actions
  fetchData: () => Promise<void>;
  saveChart: () => Promise<void>;
  fetchSavedCharts: () => Promise<void>;
  loadChartById: (chartId: string) => Promise<void>;
}

export const useChartStore = create<ChartState>((set, get) => ({
  // ==================== STATE ====================
  chartType: "bar",
  xAxis: null,
  yAxis: null,
  aggFunc: "sum",
  yearFrom: null,
  yearTo: null,
  data: [],
  savedCharts: [],
  selectedChart: null,
  status: null,

  // ==================== SETTERS ====================
  setChartType: (c) => set({ chartType: c }),
  setXAxis: (x) => set({ xAxis: x }),
  setYAxis: (y) => set({ yAxis: y }),
  setAggFunc: (f) => set({ aggFunc: f }),
  setYearFrom: (y) => set({ yearFrom: y }),
  setYearTo: (y) => set({ yearTo: y }),

  // ==================== ACTIONS ====================

  // Fetch aggregated chart data for preview
  fetchData: async () => {
    const { uploadId } = useDatasetStore.getState();
    const { xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();

    if (!uploadId || !xAxis || !yAxis) return;

    try {
      const rows = await fetchAggregatedData(
        uploadId,
        xAxis,
        yAxis,
        aggFunc,
        yearFrom,
        yearTo
      );
      set({ data: rows });
    } catch (err: any) {
      set({ status: err.message });
      toast.error("Failed to load chart data.");
    }
  },

  // Save current chart configuration
  saveChart: async () => {
    const { uploadId } = useDatasetStore.getState();
    const { chartType, xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();

    const name =
      Date.now().toString() +
      chartType +
      " Upload ID: " +
      uploadId +
      " - " +
      xAxis +
      " vs " +
      yAxis;

    if (!uploadId || !xAxis || !yAxis) {
      toast.error("Please select all required fields before saving.");
      return;
    }

    try {
      await postSaveChart(
        uploadId,
        chartType,
        xAxis,
        yAxis,
        aggFunc,
        yearFrom,
        yearTo,
        name
      );
      toast.success("Chart saved successfully!");
      await get().fetchSavedCharts(); // refresh saved charts
    } catch (err: any) {
      toast.error(err.message);
      set({ status: err.message });
    }
  },

  // Load all saved charts for the current dataset
  fetchSavedCharts: async () => {
    const { uploadId } = useDatasetStore.getState();
    if (!uploadId) return;

    try {
      const charts = await fetchSavedCharts(uploadId);
      set({ savedCharts: charts });
    } catch (err: any) {
      toast.error("Failed to fetch saved charts");
    }
  },

  // Load a specific chart by ID
  loadChartById: async (chartId: string) => {
    try {
      const chart = await fetchChartById(chartId);
      set({
        selectedChart: chart,
        chartType: chart.chart_type,
        xAxis: chart.x_axis,
        yAxis: chart.y_axis,
        aggFunc: chart.agg_func,
        yearFrom: chart.year_from?.toString() ?? null,
        yearTo: chart.year_to?.toString() ?? null,
      });

      // Automatically fetch its data
      await get().fetchData();
      toast.success(`Loaded chart: ${chart.name}`);
    } catch (err: any) {
      toast.error("Failed to load chart");
    }
  },
}));
