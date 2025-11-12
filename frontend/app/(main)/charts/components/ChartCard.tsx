"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ChartCardProps {
  chart: any;
  inDashboard: boolean;
  onLoadChart: (chart: any) => void;
  onAddToDashboard: (chartId: string) => void;
  onDeleteChart: (chartId: string) => void;
}

export default function ChartCard({
  chart,
  inDashboard,
  onLoadChart,
  onAddToDashboard,
  onDeleteChart,
}: ChartCardProps) {
  return (
    <Card key={chart._id} className="border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">{chart.name}</h4>
            <p className="text-sm text-blue-700">{chart.chart_type}</p>
          </div>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete chart</p>
              </TooltipContent>
            </Tooltip>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete chart</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this chart from the database?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => onDeleteChart(chart._id)}
                  >
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            onClick={() => onLoadChart(chart)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Load
          </Button>

          {inDashboard ? (
            <Button variant="secondary" disabled>
              In Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onAddToDashboard(chart._id)}
            >
              Add to Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
