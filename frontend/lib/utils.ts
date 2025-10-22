import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fetchAllColumns, fetchDatasetColumns } from "@/lib/api/dataset";
import { fetchSchemalessDatasetColumns } from "./api/schema_less";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface HeaderResponse {
  valid_headers: string[];
  column_types: Record<string, string>;
}

export async function getFetchedHeaders(
  mode?: string,
  uploadId?: string | null
): Promise<HeaderResponse> {
  let fetchedHeaders: string[] = [];
  let fetchedColumnTypes: Record<string, string> = {};

  try {
    if (mode === "dataset" && uploadId) {
      const res = await fetchDatasetColumns(uploadId);
      fetchedHeaders = res.valid_headers || [];
      fetchedColumnTypes = res.column_types || {};
    } else if (mode === "aggregated") {
      const res = await fetchAllColumns();
      fetchedHeaders = res.valid_headers || [];
      fetchedColumnTypes = res.column_types || {};
    } else if (mode === "schemaless" && uploadId) {
      const res = await fetchSchemalessDatasetColumns(uploadId);
      fetchedHeaders = res.valid_headers || [];
      fetchedColumnTypes = res.column_types || {};
    }
  } catch (err) {
    console.error("Error fetching headers:", err);
  }

  return {
    valid_headers: fetchedHeaders,
    column_types: fetchedColumnTypes,
  };
}
