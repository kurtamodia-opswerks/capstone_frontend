import { useEffect, useState } from "react";

type FieldType = "numeric" | "categorical" | "date" | "boolean" | "unknown";

interface AutoInsights {
  suggestedChart: "bar" | "line" | "pie";
  insightMessage: string | null;
}

/** Detects the type of a field based on its values */
function detectColumnType(values: any[]): FieldType {
  const nonNull = values.filter(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (nonNull.length === 0) return "unknown";

  const sample = nonNull.slice(0, 20);

  // Check for date strings or Date objects
  if (sample.every((v) => !isNaN(Date.parse(v)))) return "date";

  // Check for numeric values
  if (sample.every((v) => !isNaN(Number(v)))) return "numeric";

  // Check for booleans
  if (
    sample.every((v) =>
      ["true", "false", "yes", "no", true, false, 0, 1].includes(
        typeof v === "string" ? v.toLowerCase() : v
      )
    )
  )
    return "boolean";

  return "categorical";
}

// Simple rules for recommending chart types
function recommendChartType(
  xType: FieldType,
  yType: FieldType
): "bar" | "line" | "pie" {
  if (xType === "date" && yType === "numeric") return "line"; // trends over time
  if (xType === "categorical" && yType === "numeric") return "bar"; // group comparisons
  if (xType === "numeric" && yType === "numeric") return "line"; // continuous relationship
  if (xType === "categorical" && yType === "categorical") return "pie"; // categorical distribution
  return "bar";
}

/** Generate human-readable insight */
function generateInsight(
  xLabel: string,
  xType: FieldType,
  yLabel: string,
  yType: FieldType,
  chart: string
): string {
  const xHint =
    xType === "date"
      ? "is a time field"
      : xType === "numeric"
      ? "is numeric"
      : xType === "categorical"
      ? "represents categories"
      : "has mixed values";

  const yHint =
    yType === "numeric"
      ? "is numeric"
      : yType === "categorical"
      ? "represents categories"
      : "has mixed values";

  return `Looks like "<strong>${xLabel}</strong>" ${xHint}, and "<strong>${yLabel}</strong>" ${yHint}. A ${chart} chart might best show this relationship.`;
}

export function useAutoInsights(
  columnTypes: Record<
    string,
    "numeric" | "categorical" | "date" | "boolean" | "unknown"
  >,
  xAxis?: string | null,
  yAxis?: string | null
): AutoInsights {
  const [suggestedChart, setSuggestedChart] = useState<"bar" | "line" | "pie">(
    "bar"
  );
  const [insightMessage, setInsightMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!xAxis || !yAxis) {
      setSuggestedChart("bar");
      setInsightMessage(null);
      return;
    }

    const xType = columnTypes[xAxis];
    const yType = columnTypes[yAxis];
    const chart = recommendChartType(xType, yType);
    const message = generateInsight(xAxis, xType, yAxis, yType, chart);

    setSuggestedChart(chart);
    setInsightMessage(message);
  }, [columnTypes, xAxis, yAxis]);

  return { suggestedChart, insightMessage };
}
