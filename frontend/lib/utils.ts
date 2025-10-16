import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fetchAllColumns, fetchDatasetColumns } from "@/lib/api/dataset";
import { fetchSchemalessDatasetColumns } from "./api/schema_less";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getFetchedHeaders(
  mode?: string,
  uploadId?: string | null
): Promise<string[]> {
  let fetchedHeaders: string[] = [];

  try {
    if (mode === "dataset" && uploadId) {
      const res = await fetchDatasetColumns(uploadId);
      fetchedHeaders = res.valid_headers;
    } else if (mode === "aggregated") {
      const res = await fetchAllColumns();
      fetchedHeaders = res.valid_headers;
    } else if (mode === "schemaless" && uploadId) {
      const res = await fetchSchemalessDatasetColumns(uploadId);
      fetchedHeaders = res.valid_headers;
    }
  } catch (err) {
    console.error("Error fetching headers:", err);
  }

  return fetchedHeaders;
}
