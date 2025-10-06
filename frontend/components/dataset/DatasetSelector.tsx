"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAllUploadIds } from "@/lib/api/dataset";
import { useDatasetStore } from "@/store/datasetStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DatasetSelector() {
  const router = useRouter();

  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chosenUploadId, setChosenUploadId] = useState<string>("");
  const { uploadId, setUploadId } = useDatasetStore();

  useEffect(() => {
    async function loadUploadIds() {
      try {
        const result = await fetchAllUploadIds();
        setUploadIds(result.upload_ids || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUploadIds();
  }, []);

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">
        Loading previous uploads...
      </p>
    );
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (uploadIds.length === 0)
    return (
      <p className="text-sm text-muted-foreground">No previous uploads found</p>
    );

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label>Select Previous Upload</Label>
      <Select
        value={chosenUploadId ?? ""}
        onValueChange={(value) => setChosenUploadId(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose an existing upload ID" />
        </SelectTrigger>
        <SelectContent>
          {uploadIds.map((id) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {chosenUploadId && (
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            if (!chosenUploadId) return;
            setUploadId(chosenUploadId);
            router.push("/analysis");
          }}
        >
          Use this dataset
        </Button>
      )}
    </div>
  );
}
