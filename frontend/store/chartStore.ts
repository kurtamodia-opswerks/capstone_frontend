// store/chartStore.ts
import { create } from "zustand";
import { fetchAggregatedData, postSaveChart } from "@/lib/api/chart";
import { useDatasetStore } from "./datasetStore";
import { toast } from "sonner";

interface ChartState {
  chartType: "bar" | "line" | "pie";
  xAxis: string | null;
  yAxis: string | null;
  aggFunc: string;
  yearFrom: string | null;
  yearTo: string | null;
  data: any[];
  status: string | null;

  setChartType: (c: "bar" | "line" | "pie") => void;
  setXAxis: (x: string) => void;
  setYAxis: (y: string) => void;
  setAggFunc: (f: string) => void;
  setYearFrom: (y: string | null) => void;
  setYearTo: (y: string | null) => void;

  fetchData: () => Promise<void>;
  saveChart: (name: string) => Promise<void>;
}

export const useChartStore = create<ChartState>((set, get) => ({
  chartType: "bar",
  xAxis: null,
  yAxis: null,
  aggFunc: "sum",
  yearFrom: null,
  yearTo: null,
  data: [],
  status: null,

  setChartType: (c) => set({ chartType: c }),
  setXAxis: (x) => set({ xAxis: x }),
  setYAxis: (y) => set({ yAxis: y }),
  setAggFunc: (f) => set({ aggFunc: f }),
  setYearFrom: (y) => set({ yearFrom: y }),
  setYearTo: (y) => set({ yearTo: y }),

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
    }
  },

  saveChart: async (name: string) => {
    const { uploadId } = useDatasetStore.getState();
    const { chartType, xAxis, yAxis, aggFunc, yearFrom, yearTo } = get();

    if (!uploadId || !xAxis || !yAxis) {
      alert("Please select all required fields before saving.");
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
    } catch (err: any) {
      set({ status: err.message });
    }
  },
}));
