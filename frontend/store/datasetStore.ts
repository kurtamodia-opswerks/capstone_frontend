// store/datasetStore.ts
import { create } from "zustand";
import { fetchDatasetColumns } from "@/lib/api/dataset";
import { fetchAggregatedData } from "@/lib/api/chart";

interface DatasetState {
  uploadId: string | null;
  headers: string[];
  status: string | null;
  chartType: "bar" | "line" | "pie";
  xAxis: string | null;
  yAxis: string | null;
  aggFunc: string;
  yearFrom: string | null;
  yearTo: string | null;
  data: any[];

  setUploadId: (id: string) => void;
  setStatus: (s: string) => void;
  setChartType: (c: "bar" | "line" | "pie") => void;
  setXAxis: (x: string) => void;
  setYAxis: (y: string) => void;
  setAggFunc: (f: string) => void;
  setYearFrom: (y: string | null) => void;
  setYearTo: (y: string | null) => void;

  fetchHeaders: () => Promise<void>;
  fetchData: () => Promise<void>;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  uploadId: null,
  headers: [],
  status: null,
  chartType: "bar",
  xAxis: null,
  yAxis: null,
  aggFunc: "sum",
  yearFrom: null,
  yearTo: null,
  data: [],

  setUploadId: (id) => set({ uploadId: id }),
  setStatus: (s) => set({ status: s }),
  setChartType: (c) => set({ chartType: c }),
  setXAxis: (x) => set({ xAxis: x }),
  setYAxis: (y) => set({ yAxis: y }),
  setAggFunc: (f) => set({ aggFunc: f }),
  setYearFrom: (y) => set({ yearFrom: y }),
  setYearTo: (y) => set({ yearTo: y }),

  fetchHeaders: async () => {
    const { uploadId } = get();
    if (!uploadId) return;
    try {
      const result = await fetchDatasetColumns(uploadId);
      set({ headers: result.valid_headers });
    } catch (err: any) {
      set({ status: err.message });
    }
  },

  fetchData: async () => {
    const { uploadId, xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();
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
    }
  },
}));
