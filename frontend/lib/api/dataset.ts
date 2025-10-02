// api/datasets.ts

// Upload dataset CSV
export async function uploadDataset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/datasets/upload/`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  return response.json(); // contains message, upload_id, rows_inserted
}

// Fetch dataset contents by upload_id
export async function fetchDatasetContents(upload_id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/datasets/upload/?upload_id=${upload_id}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Fetching dataset failed");
  }

  return response.json(); // actual dataset contents
}
