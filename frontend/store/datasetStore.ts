// stores/datasetStore.ts
import { create } from "zustand";
import { fetchDatasetColumns, fetchAggregatedData } from "@/lib/api/dataset";

type ChartType = "bar" | "line" | "pie";

interface DatasetState {
  uploadId: string | null;
  headers: string[];
  status: string | null;
  chartType: ChartType;
  xAxis: string | null;
  yAxis: string | null;
  data: any[];

  // actions
  setUploadId: (id: string) => void;
  setStatus: (status: string | null) => void;
  fetchHeaders: () => Promise<void>;
  setChartType: (type: ChartType) => void;
  setXAxis: (x: string) => void;
  setYAxis: (y: string) => void;
  fetchData: () => Promise<void>;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  uploadId: null,
  headers: [],
  status: null,
  chartType: "bar",
  xAxis: null,
  yAxis: null,
  data: [],

  setUploadId: (id) => set({ uploadId: id }),
  setStatus: (status) => set({ status }),

  fetchHeaders: async () => {
    const { uploadId } = get();
    if (!uploadId) return;
    try {
      const result = await fetchDatasetColumns(uploadId);
      set({
        headers: result.valid_headers,
        xAxis: result.valid_headers[0] ?? null,
        yAxis: result.valid_headers[1] ?? null,
        status: `Fetched ${result.valid_headers.length} valid headers`,
      });
    } catch (error: any) {
      set({ status: error.message ?? "An unknown error occurred" });
    }
  },

  setChartType: (type) => set({ chartType: type }),
  setXAxis: (x) => set({ xAxis: x }),
  setYAxis: (y) => set({ yAxis: y }),

  fetchData: async () => {
    const { uploadId, xAxis, yAxis } = get();
    if (!uploadId || !xAxis || !yAxis) return;
    try {
      const rows = await fetchAggregatedData(uploadId, xAxis, yAxis, "sum");
      set({ data: rows });
    } catch (error: any) {
      set({ status: error.message ?? "Failed to fetch data" });
    }
  },
}));
