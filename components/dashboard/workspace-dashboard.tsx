"use client";

import { AppLauncher } from "@/components/dashboard/app-launcher";
import { AdminPanel } from "@/components/dashboard/admin-panel";
import { InstanceManager } from "@/components/dashboard/instance-manager";
import { RecentFavorites } from "@/components/dashboard/recent-favorites";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsPanel } from "@/components/dashboard/stats-panel";
import { Topbar } from "@/components/dashboard/topbar";

export function WorkspaceDashboard() {
  return (
    <div className="mesh-bg min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Topbar />
          <div className="space-y-6 p-4 lg:p-8">
            <StatsPanel />
            <AppLauncher />
            <RecentFavorites />
            <InstanceManager />
            <AdminPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
