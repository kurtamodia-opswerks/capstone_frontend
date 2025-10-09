// lib/api/chart.ts
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
