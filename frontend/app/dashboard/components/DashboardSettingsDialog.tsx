"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface DashboardSettingsDialogProps {
  choiceShowChartJs: boolean;
  setChoiceShowChartJs: (v: boolean) => void;
  choiceShowRecharts: boolean;
  setChoiceShowRecharts: (v: boolean) => void;
  choiceShowPlotly: boolean;
  setChoiceShowPlotly: (v: boolean) => void;
  setShowRecharts: (v: boolean) => void;
  setShowChartsJs: (v: boolean) => void;
  setShowPlotly: (v: boolean) => void;
}

export default function DashboardSettingsDialog({
  choiceShowChartJs,
  setChoiceShowChartJs,
  choiceShowRecharts,
  setChoiceShowRecharts,
  choiceShowPlotly,
  setChoiceShowPlotly,
  setShowRecharts,
  setShowChartsJs,
  setShowPlotly,
}: DashboardSettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm flex flex-row justify-start items-center hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md px-2 py-2"
        >
          <Settings className="mr-2 h-4 w-4" />
          Dashboard Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Customize which charts appear in your dashboard view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {[
            {
              id: "showRecharts",
              label: "Show Recharts",
              value: choiceShowRecharts,
              setter: setChoiceShowRecharts,
            },
            {
              id: "showChartsJS",
              label: "Show Charts.js",
              value: choiceShowChartJs,
              setter: setChoiceShowChartJs,
            },
            {
              id: "showPlotly",
              label: "Show Plotly",
              value: choiceShowPlotly,
              setter: setChoiceShowPlotly,
            },
          ].map(({ id, label, value, setter }) => (
            <div className="flex items-center space-x-2" key={id}>
              <Checkbox
                id={id}
                checked={value}
                onCheckedChange={(v) => setter(!!v)}
              />
              <Label
                htmlFor={id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setShowRecharts(choiceShowRecharts);
                setShowChartsJs(choiceShowChartJs);
                setShowPlotly(choiceShowPlotly);
              }}
            >
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
