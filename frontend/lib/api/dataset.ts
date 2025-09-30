export async function uploadDataset(file: File, name: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/datasets/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  return response.json();
}
