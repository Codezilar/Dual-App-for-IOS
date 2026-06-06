"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

type DashboardShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  showViewControls?: boolean;
};

export function DashboardShell({ title, description, children, showViewControls = false }: DashboardShellProps) {
  return (
    <div className="mesh-bg min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Topbar title={title} description={description} showViewControls={showViewControls} />
          <div className="space-y-6 p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
