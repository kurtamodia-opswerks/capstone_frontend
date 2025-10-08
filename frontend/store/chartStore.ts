import { create } from "zustand";

export type ChartType = "bar" | "line" | "pie";

export interface Chart {
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

  // setters only
  setChartType: (type: ChartType) => void;
  setXAxis: (x: string | null) => void;
  setYAxis: (y: string | null) => void;
  setAggFunc: (func: string) => void;
  setYearFrom: (year: string | null) => void;
  setYearTo: (year: string | null) => void;
  setData: (data: any[]) => void;
  setSavedCharts: (charts: Chart[]) => void;
  setSelectedChart: (chart: Chart | null) => void;
  setStatus: (status: string | null) => void;
  setPendingChartId: (id: string | null) => void;
  resetChartState: () => void;
}

export const useChartStore = create<ChartState>((set) => ({
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
  setAggFunc: (func) => set({ aggFunc: func }),
  setYearFrom: (year) => set({ yearFrom: year }),
  setYearTo: (year) => set({ yearTo: year }),
  setData: (data) => set({ data }),
  setSavedCharts: (charts) => set({ savedCharts: charts }),
  setSelectedChart: (chart) => set({ selectedChart: chart }),
  setStatus: (status) => set({ status }),
  setPendingChartId: (id) => set({ pendingChartId: id }),

  resetChartState: () =>
    set({
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
    }),
}));
