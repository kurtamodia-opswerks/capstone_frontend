import { create } from "zustand";
import {
  fetchSavedCharts,
  fetchChartById,
  fetchYearRange,
} from "@/lib/api/chart";
import { getFetchedHeaders } from "@/lib/utils";
import { fetchDashboard } from "@/lib/api/dashboard";

interface DataStore {
  headers: string[];
  rowsInserted: number;
  columnTypes: Record<
    string,
    "boolean" | "numeric" | "categorical" | "date" | "unknown"
  >;
  savedCharts: any[];
  selectedChart: any | null;
  dashboard: any | null;
  minYear: number;
  maxYear: number;

  setHeaders: (headers: string[]) => void;
  setRowsInserted: (count: number) => void;
  setColumnTypes: (
    types: Record<
      string,
      "boolean" | "numeric" | "categorical" | "date" | "unknown"
    >
  ) => void;
  setSavedCharts: (charts: any[]) => void;
  setSelectedChart: (chart: any | null) => void;
  setDashboard: (dashboard: any | null) => void;

  refreshCharts: (mode: string, uploadId: string | null) => Promise<void>;
  loadChartById: (chartId: string) => Promise<any>;
  refreshDashboard: (mode: string, uploadId: string | null) => Promise<void>;
  getYearRange: (uploadId?: string | null) => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  headers: [],
  rowsInserted: 0,
  columnTypes: {},
  savedCharts: [],
  selectedChart: null,
  dashboard: null,
  minYear: 0,
  maxYear: 0,

  setHeaders: (headers) => set({ headers }),
  setRowsInserted: (count) => set({ rowsInserted: count }),
  setColumnTypes: (types) => set({ columnTypes: types }),
  setSavedCharts: (charts) => set({ savedCharts: charts }),
  setSelectedChart: (chart) => set({ selectedChart: chart }),
  setDashboard: (dashboard) => set({ dashboard }),

  refreshCharts: async (mode, uploadId) => {
    try {
      const [headerData, charts] = await Promise.all([
        getFetchedHeaders(mode, uploadId),
        fetchSavedCharts(mode, uploadId),
      ]);

      set({
        headers: headerData.valid_headers || [],
        columnTypes: (headerData.column_types || {}) as Record<
          string,
          "boolean" | "numeric" | "categorical" | "date" | "unknown"
        >,
        savedCharts: charts,
      });
    } catch (err) {
      console.error("Failed to refresh charts:", err);
    }
  },

  loadChartById: async (chartId) => {
    try {
      const chart = await fetchChartById(chartId);
      set({ selectedChart: chart });
      return chart;
    } catch (err) {
      console.error("Failed to load chart by ID:", err);
      set({ selectedChart: null });
      return null;
    }
  },

  refreshDashboard: async (mode, uploadId) => {
    try {
      const res = await Promise.resolve(fetchDashboard(mode, uploadId));
      set({ dashboard: res });
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
    }
  },

  getYearRange: async (uploadId) => {
    try {
      const { min_year, max_year } = await fetchYearRange(uploadId);
      set({ minYear: min_year, maxYear: max_year });
    } catch (err) {
      console.error("Failed to get year range:", err);
      set({ minYear: 0, maxYear: 0 });
    }
  },
}));
