import { create } from "zustand";

interface DatasetState {
  mode: "aggregated" | "dataset"; // current mode
  uploadId: string | null; // selected dataset ID
  headers: string[]; // headers for specific dataset
  allHeaders: string[]; // headers for aggregated data
  records: any[]; // fetched rows
  status: string | null; // loading/error/success messages

  // setters only
  setMode: (mode: "aggregated" | "dataset") => void;
  setUploadId: (id: string | null) => void;
  setHeaders: (headers: string[]) => void;
  setAllHeaders: (headers: string[]) => void;
  setRecords: (records: any[]) => void;
  setStatus: (status: string | null) => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  mode: "aggregated",
  uploadId: null,
  headers: [],
  allHeaders: [],
  records: [],
  status: null,

  // ✅ Setters only
  setMode: (mode) => set({ mode }),
  setUploadId: (id) => set({ uploadId: id }),
  setHeaders: (headers) => set({ headers }),
  setAllHeaders: (headers) => set({ allHeaders: headers }),
  setRecords: (records) => set({ records }),
  setStatus: (status) => set({ status }),
}));
