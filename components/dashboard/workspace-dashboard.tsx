"use client";

import { AppLauncher } from "@/components/dashboard/app-launcher";
import { AdminPanel } from "@/components/dashboard/admin-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InstanceManager } from "@/components/dashboard/instance-manager";
import { RecentFavorites } from "@/components/dashboard/recent-favorites";
import { StatsPanel } from "@/components/dashboard/stats-panel";

export function WorkspaceDashboard() {
  return (
    <DashboardShell
      title="Workspace Dashboard"
      description="Launch independent accounts without cookie or storage conflicts."
      showViewControls
    >
      <StatsPanel />
      <AppLauncher />
      <RecentFavorites />
      <InstanceManager />
      <AdminPanel />
    </DashboardShell>
  );
}
