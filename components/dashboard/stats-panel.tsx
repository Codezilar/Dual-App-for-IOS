"use client";

import { Activity, Database, HardDrive, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace-store";

export function StatsPanel() {
  const instances = useWorkspaceStore((state) => state.instances);
  const active = instances.filter((instance) => instance.status === "ONLINE").length;
  const profiles = new Set(instances.map((instance) => instance.profileId)).size;

  const stats = [
    { label: "Active instances", value: active.toString(), icon: Activity, detail: "Live session containers" },
    { label: "Profiles", value: profiles.toString(), icon: ShieldCheck, detail: "Unique cookie stores" },
    { label: "Storage", value: "18.4 GB", icon: HardDrive, detail: "Across cached profiles" },
    { label: "Audit events", value: "1.2k", icon: Database, detail: "Mongo-backed activity log" }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/80 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
