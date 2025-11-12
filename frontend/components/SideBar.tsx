"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  FileText,
  Plus,
  ChartSpline,
  BarChart3,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardSidebar from "@/app/(main)/dashboard/components/DashboardSidebar";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="col-span-2 w-full max-w-[300] p-6 sticky top-0 bg-gray-100 flex flex-col justify-between h-screen">
      {/* Top section */}
      <div>
        <div className="flex items-center justify-start gap-3 mb-6">
          <div className="p-2 bg-green-900 rounded-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-900 to-green-600 bg-clip-text text-transparent">
            Vizly
          </h1>
        </div>

        <span className="text-sm font-bold">Navigation Menu</span>
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
                <Link href="/charts" className="flex flex-row gap-1">
                  <ChartSpline className="mr-2 h-4 w-4" />
                  View Saved Configs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/build" className="flex flex-row gap-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Create a new chart
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/dashboard" className="flex flex-row gap-1">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Real-time Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {pathname === "/dashboard" && (
          <div className="dashboard-menu mt-6">
            <span className="text-sm font-bold">Dashboard Settings</span>
            <DashboardSidebar />
          </div>
        )}
      </div>

      {/* Bottom user details */}
      <div className="user-details mt-6 flex flex-col items-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-row items-center gap-3 focus:outline-none">
              <Avatar className="w-12 h-12">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "NN"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1 items-start">
                <span className="text-sm">{session?.user?.name}</span>
                <span className="text-xs text-gray-500">
                  {session?.user?.email}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
