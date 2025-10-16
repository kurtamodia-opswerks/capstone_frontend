export interface DashboardData {
  mode: "aggregated" | "dataset" | "schemaless";
  upload_id?: string | null;
  chart_id?: string;
}

// ===========================
// Add or update a dashboard
// ===========================
export async function addToDashboard(dashboard: DashboardData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dashboard),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to add/update dashboard: ${errText}`);
  }

  return res.json();
}

// ===========================
// Remove a chart from a dashboard
// ===========================
export async function removeChartFromDashboard(
  dashboardId: string,
  chartId: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${dashboardId}/${chartId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to remove chart from dashboard: ${errText}`);
  }

  return res.json();
}

export async function fetchDashboard(mode: string, uploadId: string | null) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${mode}/${uploadId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch dashboard: ${errText}`);
  }

  return res.json();
}

export async function updateDashboardDateRange(
  dashboardId: string,
  yearFrom: number | null,
  yearTo: number | null
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${dashboardId}/date-range`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year_from: yearFrom, year_to: yearTo }),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
