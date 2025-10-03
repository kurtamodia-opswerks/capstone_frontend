"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDatasetStore } from "@/store/datasetStore";
import ChartControls from "../charts/ChartControls";

export default function DatasetHeaders() {
  const { headers, status, fetchHeaders } = useDatasetStore();

  return (
    <div className="mt-6">
      <Button onClick={fetchHeaders} className="mb-4">
        Fetch Dataset Headers
      </Button>
      {status && <p className="text-sm mb-2">{status}</p>}

      {headers.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {headers.map((header) => (
              <Badge key={header} variant="outline" className="px-3 py-1">
                {header}
              </Badge>
            ))}
          </div>
          <ChartControls />
        </>
      )}
    </div>
  );
}
