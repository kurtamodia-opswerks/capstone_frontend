// store/datasetStore.ts
import { create } from "zustand";
import { fetchDatasetColumns } from "@/lib/api/dataset";

interface DatasetState {
  uploadId: string | null;
  headers: string[];
  status: string | null;

  setUploadId: (id: string) => void;
  setStatus: (s: string) => void;
  fetchHeaders: () => Promise<void>;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  uploadId: null,
  headers: [],
  status: null,

  setUploadId: (id) => set({ uploadId: id }),
  setStatus: (s) => set({ status: s }),

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
}));
