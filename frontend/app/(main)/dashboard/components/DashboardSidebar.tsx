"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { FileText, Plus, ChartSpline, BarChart3, LogOut } from "lucide-react";

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
    <div className="">
      {/* Top section */}
      <div>
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
      </div>
    </div>
  );
}
