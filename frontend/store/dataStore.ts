// /store/dataStore.ts
import { create } from "zustand";
import { fetchSavedCharts, fetchChartById } from "@/lib/api/chart";
import { getFetchedHeaders } from "@/lib/utils";

interface DataStore {
  headers: string[];
  savedCharts: any[];
  selectedChart: any | null;

  setHeaders: (headers: string[]) => void;
  setSavedCharts: (charts: any[]) => void;
  setSelectedChart: (chart: any | null) => void;

  refreshCharts: (mode: string, uploadId: string | null) => Promise<void>;
  loadChartById: (chartId: string) => Promise<any>;
}

export const useDataStore = create<DataStore>((set) => ({
  headers: [],
  savedCharts: [],
  selectedChart: null,

  setHeaders: (headers) => set({ headers }),
  setSavedCharts: (charts) => set({ savedCharts: charts }),
  setSelectedChart: (chart) => set({ selectedChart: chart }),

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
}));
