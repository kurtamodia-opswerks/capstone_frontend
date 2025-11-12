"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { FileText, Plus, ChartSpline, BarChart3 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

interface DashboardSidebarProps {
  mode: string;
  uploadId: string | null;
  handleCreateChart: (e: React.MouseEvent) => void;
  handleImportChart: (e: React.MouseEvent) => void;
}

export default function DashboardSidebar({
  handleCreateChart,
  handleImportChart,
}: DashboardSidebarProps & any) {
  return (
    <div className="col-span-1 p-6 sticky top-0 bg-gray-100">
      <div className="flex items-center justify-start gap-3 mb-6">
        <div className="p-2 bg-blue-500 rounded-lg">
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vizly
        </h1>
      </div>

      <NavigationMenu className="ml-6">
        <NavigationMenuList className="flex flex-col space-y-2 items-start">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="flex flex-row gap-1">
                <FileText className="mr-2 h-8 w-8" />
                <span>Use a new dataset</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                onClick={handleImportChart}
                className="flex flex-row gap-1"
              >
                <ChartSpline className="mr-2 h-4 w-4" />
                Import a new chart
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                onClick={handleCreateChart}
                className="flex flex-row gap-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create a new chart
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <LogoutButton />
    </div>
  );
}
