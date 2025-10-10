// /store/dataStore.ts
import { create } from "zustand";
import { fetchSavedCharts } from "@/lib/api/chart";
import { getFetchedHeaders } from "@/lib/utils";

interface ChartsStore {
  headers: string[];
  savedCharts: any[];
  setHeaders: (headers: string[]) => void;
  setSavedCharts: (charts: any[]) => void;
  refreshCharts: (mode: string, uploadId: string | null) => Promise<void>;
}

export const useChartsStore = create<ChartsStore>((set) => ({
  headers: [],
  savedCharts: [],
  setHeaders: (headers) => set({ headers }),
  setSavedCharts: (charts) => set({ savedCharts: charts }),

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
}));
