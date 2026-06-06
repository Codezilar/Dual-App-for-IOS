"use client";

import { BarChart3, Cpu, Server, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspace-store";

export function AdminPanel() {
  const instances = useWorkspaceStore((state) => state.instances);
  const active = instances.filter((instance) => instance.status === "ONLINE").length;
  const profiles = new Set(instances.map((instance) => instance.profileId)).size;
  const adminItems = [
    { label: "Users", value: "1", detail: "Current account", icon: Users },
    { label: "Workspaces", value: "1", detail: "Current workspace", icon: Server },
    { label: "Profiles", value: profiles.toString(), detail: "Created from real instances", icon: BarChart3 },
    { label: "Active containers", value: active.toString(), detail: "Currently online", icon: Cpu }
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {adminItems.map((item) => (
        <Card key={item.label} className="bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
