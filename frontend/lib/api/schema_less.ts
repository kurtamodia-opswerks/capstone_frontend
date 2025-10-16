// api/schema_less.ts

// Upload dataset CSV
export async function uploadSchemaless(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schemaless/upload`,
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

// Fetch all unique upload IDs
export async function fetchAllUploadIds() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schemaless/all`
    );
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch dataset contents by upload_id
export async function fetchDatasetContents(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schemaless/${upload_id}/data`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset failed");
  }

  return response.json();
}

// Fetch dataset headers/columns that have valid values
export async function fetchSchemalessDatasetColumns(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schemaless/${upload_id}/headers`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset headers failed");
  }

  return response.json();
}

export async function fetchAggregateSchemalessData({
  upload_id,
  x_axis,
  y_axis,
  agg_func,
}: {
  upload_id: string;
  x_axis: string;
  y_axis: string;
  agg_func: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schemaless/aggregate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upload_id,
        x_axis,
        y_axis,
        agg_func,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Aggregation failed");
  }

  return response.json();
}
