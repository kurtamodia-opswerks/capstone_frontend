// lib/api/dashboard.ts

export interface ChartData {
  mode: "aggregated" | "dataset";
  upload_id?: string | null;
  chart_type: string;
  x_axis: string;
  y_axis: string;
  agg_func: string;
  year_from?: number | null;
  year_to?: number | null;
  name: string;
}

export interface DashboardData {
  mode: "aggregated" | "dataset";
  upload_id?: string | null;
  charts: ChartData[];
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

  if (!res.ok) throw new Error("Failed to add/update dashboard");
  return res.json();
}

// ===========================
// Get a dashboard
// ===========================
export async function fetchDashboard(
  mode: "aggregated" | "dataset",
  uploadId: string | null
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${mode}/${uploadId}`
  );

  if (!res.ok) throw new Error("Dashboard not found");
  return res.json();
}

// ===========================
// Remove a chart from a dashboard
// ===========================
export async function removeChartFromDashboard(
  dashboardId: string,
  chartName: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${dashboardId}/${chartName}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Failed to remove chart from dashboard");
  return res.json();
}
