// api/datasets.ts

// Upload dataset CSV
export async function uploadDataset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/upload`,
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/all`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching upload IDs failed");
  }

  return response.json();
}

// Fetch all records (for global analysis)
export async function fetchAllData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/all/data`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching all data failed");
  }

  return response.json();
}

// Fetch all columns/headers (for global analysis)
export async function fetchAllColumns() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/all/headers`
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching all headers failed");
  }
  return response.json();
}

// Fetch dataset contents by upload_id
export async function fetchDatasetContents(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/${upload_id}/data`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset failed");
  }

  return response.json();
}

// Fetch dataset headers/columns that have valid values
export async function fetchDatasetColumns(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dataset/${upload_id}/headers`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset headers failed");
  }

  return response.json();
}
