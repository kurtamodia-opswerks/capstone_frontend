import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/SideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vizly",
  description:
    "Both a practial tool for creating charts by uploading datasets as well as a benchmarking tool for chart libraries.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen grid grid-cols-7">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <main className="col-span-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
