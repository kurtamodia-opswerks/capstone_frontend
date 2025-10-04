export async function fetchAggregatedData(
  uploadId: string,
  xAxis: string,
  yAxis: string,
  aggFunc: string,
  yearFrom?: string | null,
  yearTo?: string | null
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chart/aggregate/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upload_id: uploadId,
        x_axis: xAxis,
        y_axis: yAxis,
        agg_func: aggFunc,
        year_from: yearFrom || undefined,
        year_to: yearTo || undefined,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch aggregated data");
  return res.json();
}
