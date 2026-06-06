"use client";

import { Activity, AlertTriangle, CheckCircle2, Clock3, Server } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";

export function MonitoringPage() {
  const instances = useWorkspaceStore((state) => state.instances);
  const online = instances.filter((instance) => instance.status === "ONLINE");
  const attention = instances.filter((instance) => ["SUSPENDED", "ERROR"].includes(instance.status));
  const recent = [...instances]
    .filter((instance) => instance.lastActivity)
    .sort((a, b) => new Date(b.lastActivity ?? 0).getTime() - new Date(a.lastActivity ?? 0).getTime())
    .slice(0, 6);

  return (
    <DashboardShell title="Monitoring" description="Watch container health, session activity, and profile runtime signals.">
      <div className="grid gap-3 md:grid-cols-3">
        <HealthCard title="Online containers" value={online.length} icon={Activity} detail="Currently reachable" />
        <HealthCard title="Attention queue" value={attention.length} icon={AlertTriangle} detail="Suspended or errored" />
        <HealthCard title="Runtime nodes" value={active > 0 ? 1 : 0} icon={Server} detail="Gateway workers ready" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock3 className="h-4 w-4 text-primary" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.length ? (
              recent.map((instance) => (
                <div key={instance.id} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{instance.name}</p>
                    <p className="text-xs text-muted-foreground">{instance.cookieStore}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(instance.lastActivity)}</span>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
                No activity yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Health Checks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {["Cookie isolation", "Local storage namespaces", "Cache buckets", "Gateway heartbeat"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
                <span>{item}</span>
                <Badge className="border-transparent bg-background">{instances.length ? "ready" : "waiting"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function HealthCard({
  title,
  value,
  detail,
  icon: Icon
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <Card className="bg-card/80 backdrop-blur-xl">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
