// fetch aggregated data for chart
export async function fetchAggregatedData(
  uploadId: string | null,
  xAxis: string,
  yAxis: string,
  aggFunc: string,
  yearFrom?: string | null,
  yearTo?: string | null
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chart/aggregate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upload_id: uploadId || null,
        x_axis: xAxis,
        y_axis: yAxis,
        agg_func: aggFunc,
        year_from: yearFrom ? Number(yearFrom) : undefined,
        year_to: yearTo ? Number(yearTo) : undefined,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch aggregated data");
  return res.json();
}

// save chart
export async function postSaveChart(
  mode: "aggregated" | "dataset",
  uploadId: string | null,
  chartType: string,
  xAxis: string,
  yAxis: string,
  aggFunc: string,
  yearFrom: string | null,
  yearTo: string | null,
  name: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chart/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      upload_id: uploadId,
      chart_type: chartType,
      x_axis: xAxis,
      y_axis: yAxis,
      agg_func: aggFunc,
      year_from: yearFrom ? Number(yearFrom) : undefined,
      year_to: yearTo ? Number(yearTo) : undefined,
      name,
    }),
  });

  if (!res.ok) throw new Error("Failed to save chart");
  return res.json();
}

// fetch saved charts
export async function fetchSavedCharts(mode: string, uploadId: string | null) {
  if (mode === "aggregated") {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chart/saved/all`
      );
      if (!res.ok) throw new Error("Failed to fetch saved charts");
      return res.json();
    } catch (err) {
      console.error(err);
    }
  } else if (mode === "dataset" && uploadId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chart/saved/${uploadId}`
      );
      if (!res.ok) throw new Error("Failed to fetch saved charts");
      return res.json();
    } catch (error) {
      console.error(error);
    }
  }
}

export async function fetchChartById(chartId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chart/saved/chart/${chartId}`
  );
  if (!res.ok) throw new Error("Chart not found");
  return res.json();
}

// Update a chart
export async function updateChart(
  chartId: string,
  updatedData: {
    mode?: "aggregated" | "dataset";
    uploadId?: string | null;
    chartType?: string;
    xAxis?: string;
    yAxis?: string;
    aggFunc?: string;
    yearFrom?: string | null;
    yearTo?: string | null;
    chartName?: string;
  }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chart/update/${chartId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: updatedData.mode,
        upload_id: updatedData.uploadId,
        chart_type: updatedData.chartType,
        x_axis: updatedData.xAxis,
        y_axis: updatedData.yAxis,
        agg_func: updatedData.aggFunc,
        year_from: updatedData.yearFrom
          ? Number(updatedData.yearFrom)
          : undefined,
        year_to: updatedData.yearTo ? Number(updatedData.yearTo) : undefined,
        name: updatedData.chartName,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to update chart");
  return res.json();
}

export async function deleteChart(chartId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chart/delete/${chartId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Failed to delete chart");
  return res.json();
}
