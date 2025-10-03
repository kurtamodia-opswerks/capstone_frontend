// app/dataset/page.tsx
import DatasetUploadForm from "@/components/dataset/DatasetUploadForm";

export default function DatasetUploadPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Dataset Upload & Visualization
      </h1>
      <DatasetUploadForm />
    </div>
  );
}
