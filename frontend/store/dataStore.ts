// /store/dataStore.ts
import { create } from "zustand";
import { fetchSavedCharts, fetchChartById } from "@/lib/api/chart";
import { getFetchedHeaders } from "@/lib/utils";
import { fetchDashboard } from "@/lib/api/dashboard";

interface DataStore {
  headers: string[];
  savedCharts: any[];
  selectedChart: any | null;
  dashboard: any | null;

  setHeaders: (headers: string[]) => void;
  setSavedCharts: (charts: any[]) => void;
  setSelectedChart: (chart: any | null) => void;
  setDashboard: (dashboard: any | null) => void;

  refreshCharts: (mode: string, uploadId: string | null) => Promise<void>;
  loadChartById: (chartId: string) => Promise<any>;
  refreshDashboard: (mode: string, uploadId: string | null) => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  headers: [],
  savedCharts: [],
  selectedChart: null,
  dashboard: null,

  setHeaders: (headers) => set({ headers }),
  setSavedCharts: (charts) => set({ savedCharts: charts }),
  setSelectedChart: (chart) => set({ selectedChart: chart }),
  setDashboard: (dashboard) => set({ dashboard }),

  refreshCharts: async (mode, uploadId) => {
    try {
      const [headers, charts] = await Promise.all([
        getFetchedHeaders(mode, uploadId),
        fetchSavedCharts(mode, uploadId),
      ]);
      set({ headers, savedCharts: charts });
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
}));
