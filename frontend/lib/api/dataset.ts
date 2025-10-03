// api/datasets.ts

// Upload dataset CSV
export async function uploadDataset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/`, // DRF router auto-exposes at /dataset/
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  return response.json(); 
}

// Fetch dataset contents by upload_id
export async function fetchDatasetContents(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/?upload_id=${upload_id}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset failed");
  }

  return response.json(); // actual dataset contents
}

// Fetch dataset headers/columns that have valid values
export async function fetchDatasetColumns(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/headers/?upload_id=${upload_id}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset headers failed");
  }

  return response.json(); // { valid_headers: [...] }
}

export async function fetchAggregatedData(
  uploadId: string,
  xAxis: string,
  yAxis: string,
  aggFunc: string = "sum"
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset/aggregate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ upload_id: uploadId, x_axis: xAxis, y_axis: yAxis, agg_func: aggFunc }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch aggregated data");
  }

  return res.json();
}

