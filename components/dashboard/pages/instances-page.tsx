"use client";

import { AppLauncher } from "@/components/dashboard/app-launcher";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InstanceManager } from "@/components/dashboard/instance-manager";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace-store";

export function InstancesPage() {
  const instances = useWorkspaceStore((state) => state.instances);
  const suspended = instances.filter((instance) => instance.status === "SUSPENDED").length;
  const offline = instances.filter((instance) => instance.status === "OFFLINE").length;
  const favorites = instances.filter((instance) => instance.favorite).length;

  return (
    <DashboardShell
      title="Instances"
      description="Create, launch, duplicate, rename, favorite, and retire isolated app containers."
      showViewControls
    >
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Favorites" value={favorites} detail="Pinned containers" />
        <Metric label="Offline" value={offline} detail="Ready for clean launch" />
        <Metric label="Suspended" value={suspended} detail="Needs operator review" />
      </div>
      <AppLauncher />
      <InstanceManager />
    </DashboardShell>
  );
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <Card className="bg-card/80 backdrop-blur-xl">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
