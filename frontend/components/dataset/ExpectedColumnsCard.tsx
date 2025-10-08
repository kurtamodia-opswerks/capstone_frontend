import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const expectedColumns = [
  { name: "model", type: "string" },
  { name: "year", type: "integer" },
  { name: "region", type: "string" },
  { name: "color", type: "string" },
  { name: "transmission", type: "string" },
  { name: "mileage_km", type: "float" },
  { name: "price_usd", type: "float" },
  { name: "sales_volume", type: "integer" },
];

export default function ExpectedColumnsCard() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border shadow-lg border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Table className="h-5 w-5 text-blue-600" />
          Expected Dataset Columns
        </CardTitle>
        <CardDescription>
          To ensure accurate analysis and visualization, your CSV should include
          the following columns:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {expectedColumns.map((col) => (
            <div
              key={col.name}
              className="flex flex-col items-center justify-center p-3 border rounded-lg bg-slate-50 hover:bg-blue-50 transition"
            >
              <Badge variant="outline" className="text-blue-700">
                {col.name}
              </Badge>
              <span className="text-xs text-muted-foreground mt-1">
                {col.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
