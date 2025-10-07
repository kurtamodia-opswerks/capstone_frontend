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

// ==================== TYPES ====================
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

type ChartType = "bar" | "line" | "pie";

interface ChartState {
  chartType: ChartType;
  xAxis: string | null;
  yAxis: string | null;
  aggFunc: string;
  yearFrom: string | null;
  yearTo: string | null;
  data: any[];
  savedCharts: Chart[];
  selectedChart: Chart | null;
  status: string | null;
  pendingChartId: string | null;

  // setters
  setChartType: (type: ChartType) => void;
  setXAxis: (x: string) => void;
  setYAxis: (y: string) => void;
  setAggFunc: (f: string) => void;
  setYearFrom: (year: string | null) => void;
  setYearTo: (year: string | null) => void;
  setPendingChartId: (id: string | null) => void;

  // actions
  fetchData: () => Promise<void>;
  saveChart: () => Promise<void>;
  fetchSavedCharts: () => Promise<void>;
  loadChartById: (chartId: string) => Promise<void>;
  resetChartState: () => void;
}

// ==================== STORE ====================
export const useChartStore = create<ChartState>((set, get) => ({
  // ---------- State ----------
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
  pendingChartId: null,

  // ---------- Setters ----------
  setChartType: (type) => set({ chartType: type }),
  setXAxis: (x) => set({ xAxis: x }),
  setYAxis: (y) => set({ yAxis: y }),
  setAggFunc: (f) => set({ aggFunc: f }),
  setYearFrom: (year) => set({ yearFrom: year }),
  setYearTo: (year) => set({ yearTo: year }),
  setPendingChartId: (id) => set({ pendingChartId: id }),

  // ---------- Actions ----------
  fetchData: async () => {
    const { uploadId } = useDatasetStore.getState();
    const { xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();

    if (!uploadId || !xAxis || !yAxis) {
      toast.error("Please select all required fields before previewing.");
      return;
    }

    try {
      const data = await fetchAggregatedData(
        uploadId,
        xAxis,
        yAxis,
        aggFunc,
        yearFrom,
        yearTo
      );
      set({ data });
    } catch (error: any) {
      set({ status: error.message });
      toast.error("Failed to load chart data.");
    }
  },

  saveChart: async () => {
    const { uploadId } = useDatasetStore.getState();
    const { chartType, xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();

    if (!uploadId || !xAxis || !yAxis) {
      toast.error("Please select all required fields before saving.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = `${timestamp} | ${chartType.toUpperCase()} | Upload ID: ${uploadId} - ${xAxis} vs ${yAxis}`;

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
      await get().fetchSavedCharts();
    } catch (error: any) {
      set({ status: error.message });
      toast.error(error.message || "Failed to save chart.");
    }
  },

  fetchSavedCharts: async () => {
    const { uploadId } = useDatasetStore.getState();
    if (!uploadId) return;

    try {
      const savedCharts = await fetchSavedCharts(uploadId);
      set({ savedCharts });
    } catch {
      toast.error("Failed to fetch saved charts.");
    }
  },

  loadChartById: async (chartId) => {
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

      await get().fetchData();
      toast.success(`Loaded chart: ${chart.name}`);
    } catch {
      toast.error("Failed to load chart.");
    }
  },

  resetChartState: () =>
    set({
      selectedChart: null,
      chartType: "bar",
      xAxis: null,
      yAxis: null,
      aggFunc: "sum",
      yearFrom: null,
      yearTo: null,
      data: [],
      status: null,
      pendingChartId: null,
    }),
}));
